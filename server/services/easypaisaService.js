import crypto from "crypto";

/*
==================================================
EASYPAISA CONFIGURATION
==================================================
*/

const EASYPAISA_PAYMENT_URL =
  process.env.EASYPAISA_PAYMENT_URL ||
  "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf";

const EASYPAISA_STORE_ID =
  process.env.EASYPAISA_STORE_ID;

const EASYPAISA_HASH_KEY =
  process.env.EASYPAISA_HASH_KEY;

const EASYPAISA_POST_BACK_URL =
  process.env.EASYPAISA_POST_BACK_URL;

/*
==================================================
GENERATE ORDER REFERENCE
==================================================
*/

export const generatePaymentOrderId = () => {
  const timestamp = Date.now();

  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `SH-${timestamp}-${randomPart}`;
};

/*
==================================================
CREATE EASYPAISA HASH
==================================================

IMPORTANT:

The exact hash/signature construction must match
the integration guide issued for your merchant
account.

Do not change this arbitrarily after receiving
your production integration document.
==================================================
*/

export const generateEasypaisaHash = ({
  storeId,
  postBackURL,
  orderRefNum,
  amount,
}) => {
  if (!EASYPAISA_HASH_KEY) {
    throw new Error(
      "EASYPAISA_HASH_KEY is not configured."
    );
  }

  /*
  ----------------------------------------------
  IMPORTANT
  ----------------------------------------------

  Easypaisa's current staging demo exposes a
  merchantHashedReq field.

  Your merchant integration guide determines the
  exact string/signature construction.

  This implementation uses HMAC-SHA256 as the
  server-side signing mechanism placeholder.

  Replace the signature construction with the exact
  algorithm supplied for your merchant account.
  ----------------------------------------------
  */

  const data = [
    storeId,
    postBackURL,
    orderRefNum,
    amount,
  ].join("|");

  const hash = crypto
    .createHmac("sha256", EASYPAISA_HASH_KEY)
    .update(data)
    .digest("base64");

  return hash;
};

/*
==================================================
CREATE PAYMENT REQUEST
==================================================
*/

export const createEasypaisaPayment = ({
  orderRefNum,
  amount,
}) => {
  if (!EASYPAISA_STORE_ID) {
    throw new Error(
      "EASYPAISA_STORE_ID is not configured."
    );
  }

  if (!EASYPAISA_POST_BACK_URL) {
    throw new Error(
      "EASYPAISA_POST_BACK_URL is not configured."
    );
  }

  if (!orderRefNum) {
    throw new Error(
      "Payment Order ID is required."
    );
  }

  if (!amount || Number(amount) <= 0) {
    throw new Error(
      "Payment amount must be greater than zero."
    );
  }

  const formattedAmount = Number(amount).toFixed(2);

  const merchantHashedReq =
    generateEasypaisaHash({
      storeId: EASYPAISA_STORE_ID,
      postBackURL: EASYPAISA_POST_BACK_URL,
      orderRefNum,
      amount: formattedAmount,
    });

  return {
    paymentUrl: EASYPAISA_PAYMENT_URL,

    fields: {
      storeId: EASYPAISA_STORE_ID,

      postBackURL:
        EASYPAISA_POST_BACK_URL,

      autoRedirect: "1",

      orderRefNum,

      amount: formattedAmount,

      merchantHashedReq,
    },
  };
};