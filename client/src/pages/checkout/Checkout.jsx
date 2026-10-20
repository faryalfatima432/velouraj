import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaCheck,
  FaCreditCard,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaShoppingBag,
} from "react-icons/fa";

import { useCart } from "../../context/CartContext";
import API from "../../services/api";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartSubtotal,
    clearCart,
  } = useCart();

  /*
  ==================================================
  STATE
  ==================================================
  */

  const [step, setStep] = useState(1);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Pakistan",
    });

  /*
  ==================================================
  REDIRECT IF CART EMPTY
  ==================================================
  */

  useEffect(() => {
    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      navigate("/cart");
    }
  }, [
    cartItems,
    navigate,
  ]);

  /*
  ==================================================
  SHIPPING
  ==================================================
  */

  const shippingPrice =
    cartSubtotal >= 3000 ? 0 : 200;

  /*
  ==================================================
  TOTAL
  ==================================================
  */

  const totalPrice =
    cartSubtotal + shippingPrice;

  /*
  ==================================================
  INPUT HANDLER
  ==================================================
  */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  /*
  ==================================================
  VALIDATE ADDRESS
  ==================================================
  */

  const validateAddress = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "address",
      "city",
    ];

    for (
      const field of requiredFields
    ) {
      if (
        !formData[field].trim()
      ) {
        return `${field} is required.`;
      }
    }

    return "";
  };

  /*
  ==================================================
  ORDER ITEMS
  ==================================================
  */

  const getOrderItems = () => {
    return cartItems.map(
      (item) => ({
        product: item._id || item.product,

        name: item.name,

        image:
          item.images?.[0] ||
          item.image ||
          "",

        price:
          Number(item.salePrice) > 0
            ? Number(item.salePrice)
            : Number(item.price),

        quantity:
          Number(item.quantity),
      })
    );
  };

  /*
  ==================================================
  COD ORDER
  ==================================================
  */

  const placeCODOrder = async () => {
    const response =
      await API.post(
        "/orders",
        {
          orderItems:
            getOrderItems(),

          shippingAddress:
            formData,

          paymentMethod:
            "Cash on Delivery",
        }
      );

    if (
      !response.data.success
    ) {
      throw new Error(
        response.data.message ||
          "Unable to place order."
      );
    }

    return response.data.order;
  };

  /*
  ==================================================
  ONLINE PAYMENT
  ==================================================
  */

  const startOnlinePayment =
    async () => {
      const response =
        await API.post(
          "/orders/payment/create",
          {
            orderItems:
              getOrderItems(),

            shippingAddress:
              formData,

            paymentMethod:
              paymentMethod,
          }
        );

      if (
        !response.data.success
      ) {
        throw new Error(
          response.data.message ||
            "Unable to start payment."
        );
      }

      /*
      ----------------------------------------------
      IMPORTANT
      ----------------------------------------------

      Easypaisa hosted checkout requires a POST
      form, not simply window.location.href.

      ----------------------------------------------
      */

      if (
        response.data.paymentUrl &&
        response.data.paymentFields
      ) {
        submitGatewayForm(
          response.data.paymentUrl,
          response.data.paymentFields
        );

        return null;
      }

      throw new Error(
        "Payment gateway did not return payment information."
      );
    };

  /*
  ==================================================
  SUBMIT GATEWAY FORM
  ==================================================
  */

  const submitGatewayForm = (
    action,
    fields
  ) => {
    const form =
      document.createElement(
        "form"
      );

    form.method = "POST";

    form.action = action;

    form.style.display = "none";

    Object.entries(fields).forEach(
      ([name, value]) => {
        const input =
          document.createElement(
            "input"
          );

        input.type = "hidden";

        input.name = name;

        input.value = value;

        form.appendChild(input);
      }
    );

    document.body.appendChild(
      form
    );

    form.submit();
  };

  /*
  ==================================================
  CONTINUE DELIVERY
  ==================================================
  */

  const handleDeliveryContinue =
    () => {
      setError("");

      const validation =
        validateAddress();

      if (validation) {
        setError(
          validation
        );

        return;
      }

      setStep(2);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /*
  ==================================================
  CONTINUE PAYMENT
  ==================================================
  */

  const handlePaymentContinue =
    () => {
      setError("");

      if (
        !paymentMethod
      ) {
        setError(
          "Please select a payment method."
        );

        return;
      }

      setStep(3);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  /*
  ==================================================
  PLACE ORDER
  ==================================================
  */

  const handlePlaceOrder =
    async () => {
      try {
        setError("");

        setLoading(true);

        let order = null;

        /*
        ------------------------------------------
        COD
        ------------------------------------------
        */

        if (
          paymentMethod ===
          "Cash on Delivery"
        ) {
          order =
            await placeCODOrder();
        }

        /*
        ------------------------------------------
        ONLINE
        ------------------------------------------
        */

        if (
          paymentMethod ===
          "Easypaisa"
        ) {
          await startOnlinePayment();

          /*
          The browser is redirected to Easypaisa,
          so we stop here.
          */

          return;
        }

        /*
        ------------------------------------------
        ORDER CREATED
        ------------------------------------------
        */

        if (!order) {
          throw new Error(
            "Unable to create order."
          );
        }

        clearCart();

        navigate(
          `/order-success/${order._id}`,
          {
            state: {
              order,
            },
          }
        );
      } catch (err) {
        console.error(
          "CHECKOUT ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

  /*
  ==================================================
  PAYMENT OPTIONS
  ==================================================
  */

  const paymentOptions =
    useMemo(
      () => [
        {
          id: "Cash on Delivery",

          title:
            "Cash on Delivery",

          description:
            "Pay when your order arrives.",

          icon:
            FaMoneyBillWave,

          available: true,
        },

        {
          id: "Easypaisa",

          title:
            "Easypaisa",

          description:
            "Pay securely through Easypaisa.",

          icon:
            FaCreditCard,

          available: true,
        },

        // {
        //   id: "Card Payment",

        //   title:
        //     "Debit / Credit Card",

        //   description:
        //     "Card gateway can be connected later.",

        //   icon:
        //     FaCreditCard,

        //   available: false,
        // },

        // {
        //   id: "Bank Transfer",

        //   title:
        //     "Bank Transfer",

        //   description:
        //     "Online bank payment can be connected later.",

        //   icon:
        //     FaCreditCard,

        //   available: false,
        // },
      ],
      []
    );

  /*
  ==================================================
  EMPTY CART
  ==================================================
  */

  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    return null;
  }

  return (
    <div className="shop-page-enter min-h-screen bg-[#f4f7f3] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">
          <button
            onClick={() =>
              navigate("/cart")
            }
            className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#17633a]"
          >
            <FaArrowLeft />

            Back to Cart
          </button>

          <h1 className="text-3xl font-bold text-slate-900">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Complete your order securely.
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mb-8 rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            {[
              {
                number: 1,
                title: "Delivery",
              },
              {
                number: 2,
                title: "Payment",
              },
              {
                number: 3,
                title: "Review",
              },
            ].map(
              (item, index) => (
                <div
                  key={
                    item.number
                  }
                  className="flex flex-1 items-center"
                >

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                      step >=
                      item.number
                        ? "bg-[#17633a] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step >
                    item.number ? (
                      <FaCheck />
                    ) : (
                      item.number
                    )}
                  </div>

                  <span
                    className={`ml-3 hidden text-sm font-semibold sm:block ${
                      step >=
                      item.number
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {item.title}
                  </span>

                  {index <
                    2 && (
                    <div
                      className={`mx-3 h-1 flex-1 rounded ${
                        step >
                        item.number
                          ? "bg-[#17633a]"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              )
            )}

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* MAIN */}

          <div className="lg:col-span-2">

            {/* STEP 1 */}

            {step === 1 && (
              <div className="shop-page-enter rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-[#edf6f0] p-3 text-[#17633a]">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Delivery Address
                    </h2>

                    <p className="text-sm text-slate-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    label="Full Name"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                  />

                  <Input
                    label="Phone"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="03XXXXXXXXX"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Address"
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="House number, street, area"
                    />
                  </div>

                  <Input
                    label="City"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Lahore"
                  />

                  <Input
                    label="State / Province"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Punjab"
                  />

                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={
                      formData.postalCode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="54000"
                  />

                  <Input
                    label="Country"
                    name="country"
                    value={
                      formData.country
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Pakistan"
                  />

                </div>

                <button
                  onClick={
                    handleDeliveryContinue
                  }
                  className="mt-8 w-full rounded-xl bg-[#17633a] px-6 py-3.5 font-bold text-white transition hover:bg-[#12532f]"
                >
                  Continue to Payment
                </button>

              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <div className="shop-page-enter rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Select Payment Method
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose how you want to pay.
                  </p>
                </div>

                <div className="space-y-3">

                  {paymentOptions.map(
                    (option) => {
                      const Icon =
                        option.icon;

                      return (
                        <button
                          key={
                            option.id
                          }
                          type="button"
                          disabled={
                            !option.available
                          }
                          onClick={() =>
                            option.available &&
                            setPaymentMethod(
                              option.id
                            )
                          }
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            !option.available
                              ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                              : paymentMethod ===
                                option.id
                              ? "border-[#17633a] bg-[#f4f8f4] ring-2 ring-[#edf6f0]"
                              : "border-slate-200 hover:border-[#a9c9b2]"
                          }`}
                        >
                          <div className="flex items-center gap-4">

                            <div
                              className={`rounded-xl p-3 ${
                                paymentMethod ===
                                  option.id &&
                                option.available
                                  ? "bg-[#17633a] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon />
                            </div>

                            <div className="flex-1">

                              <div className="flex items-center gap-2">

                                <h3 className="font-bold text-slate-900">
                                  {
                                    option.title
                                  }
                                </h3>

                                {!option.available && (
                                  <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                                    Coming soon
                                  </span>
                                )}

                              </div>

                              <p className="mt-1 text-sm text-slate-500">
                                {
                                  option.description
                                }
                              </p>

                            </div>

                            {option.available && (
                              <div
                                className={`h-5 w-5 rounded-full border-2 ${
                                  paymentMethod ===
                                  option.id
                                    ? "border-[#17633a] bg-[#17633a]"
                                    : "border-slate-300"
                                }`}
                              >
                                {paymentMethod ===
                                  option.id && (
                                  <div className="m-1 h-1.5 w-1.5 rounded-full bg-white" />
                                )}
                              </div>
                            )}

                          </div>
                        </button>
                      );
                    }
                  )}

                </div>

                {/* ONLINE PAYMENT MESSAGE */}

                {paymentMethod ===
                  "Easypaisa" && (
                  <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">

                    <div className="flex gap-3">

                      <FaShieldAlt className="mt-1 shrink-0 text-green-600" />

                      <div>
                        <h3 className="font-bold text-green-800">
                          Secure Easypaisa Payment
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-green-700">
                          You will be redirected to the secure Easypaisa payment page to complete your payment.
                        </p>

                        <p className="mt-2 text-xs text-green-600">
                          ShopHub does not ask you for your Easypaisa transaction ID, PIN, or account password.
                        </p>
                      </div>

                    </div>

                  </div>
                )}

                <div className="mt-8 flex gap-3">

                  <button
                    onClick={() =>
                      setStep(1)
                    }
                    className="flex-1 rounded-xl border border-[#d8e0d8] px-5 py-3.5 font-bold text-slate-700 transition hover:bg-[#f4f7f3]"
                  >
                    Back
                  </button>

                  <button
                    onClick={
                      handlePaymentContinue
                    }
                    className="flex-1 rounded-xl bg-[#17633a] px-5 py-3.5 font-bold text-white transition hover:bg-[#12532f]"
                  >
                    Continue
                  </button>

                </div>

              </div>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <div className="shop-page-enter space-y-6">

                {/* DELIVERY REVIEW */}

                <div className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6">

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-bold text-slate-900">
                      Delivery Information
                    </h2>

                    <button
                      onClick={() =>
                        setStep(1)
                      }
                      className="text-sm font-bold text-[#17633a] hover:text-[#12532f]"
                    >
                      Edit
                    </button>

                  </div>

                  <div className="rounded-xl bg-[#f4f7f3] p-4 text-sm leading-7 text-slate-600">

                    <p className="font-bold text-slate-900">
                      {
                        formData.fullName
                      }
                    </p>

                    <p>
                      {
                        formData.phone
                      }
                    </p>

                    <p>
                      {
                        formData.address
                      }
                    </p>

                    <p>
                      {
                        formData.city
                      }
                      {formData.state
                        ? `, ${formData.state}`
                        : ""}
                    </p>

                    {formData.postalCode && (
                      <p>
                        {
                          formData.postalCode
                        }
                      </p>
                    )}

                    <p>
                      {
                        formData.country
                      }
                    </p>

                  </div>

                </div>

                {/* PAYMENT REVIEW */}

                <div className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6">

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-bold text-slate-900">
                      Payment
                    </h2>

                    <button
                      onClick={() =>
                        setStep(2)
                      }
                      className="text-sm font-bold text-[#17633a] hover:text-[#12532f]"
                    >
                      Edit
                    </button>

                  </div>

                  <div className="flex items-center gap-4 rounded-xl bg-[#f4f7f3] p-4">

                    <div className="rounded-xl bg-[#edf6f0] p-3 text-[#17633a]">
                      {paymentMethod ===
                      "Cash on Delivery" ? (
                        <FaMoneyBillWave />
                      ) : (
                        <FaCreditCard />
                      )}
                    </div>

                    <div>

                      <p className="font-bold text-slate-900">
                        {
                          paymentMethod
                        }
                      </p>

                      <p className="text-sm text-slate-500">

                        {paymentMethod ===
                        "Easypaisa"
                          ? "You will be redirected to Easypaisa to complete payment."
                          : "Pay when your order is delivered."}

                      </p>

                    </div>

                  </div>

                </div>

                {/* PLACE ORDER */}

                <button
                  onClick={
                    handlePlaceOrder
                  }
                  disabled={
                    loading
                  }
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#17633a] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                      Processing...
                    </>
                  ) : paymentMethod ===
                    "Easypaisa" ? (
                    <>
                      Continue to Secure Payment
                    </>
                  ) : (
                    <>
                      <FaCheck />

                      Place Order
                    </>
                  )}
                </button>

              </div>
            )}

          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:col-span-1">

            <div className="sticky top-24 rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-[#edf6f0] p-3 text-[#17633a]">
                  <FaShoppingBag />
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    Order Summary
                  </h2>

                  <p className="text-sm text-slate-500">
                    {cartItems.length} item(s)
                  </p>

                </div>

              </div>

              <div className="max-h-72 space-y-4 overflow-y-auto pr-1">

                {cartItems.map(
                  (item) => {
                    const price =
                      Number(
                        item.salePrice
                      ) > 0
                        ? Number(
                            item.salePrice
                          )
                        : Number(
                            item.price
                          );

                    return (
                      <div
                        key={
                          item._id ||
                          item.product
                        }
                        className="flex gap-3"
                      >

                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">

                          <img
                            src={
                              item.images?.[0] ||
                              item.image ||
                              ""
                            }
                            alt={
                              item.name
                            }
                            className="h-full w-full object-cover"
                          />

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                            {
                              item.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>

                        </div>

                        <p className="text-sm font-bold text-slate-900">
                          Rs.{" "}
                          {(
                            price *
                            item.quantity
                          ).toLocaleString()}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-slate-600">
                  <span>
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-900">
                    Rs.{" "}
                    {cartSubtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>
                    Shipping
                  </span>

                  <span className="font-semibold text-slate-900">
                    {shippingPrice ===
                    0
                      ? "Free"
                      : `Rs. ${shippingPrice.toLocaleString()}`}
                  </span>
                </div>

              </div>

              <div className="my-5 border-t border-slate-200" />

              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-slate-900">
                  Total
                </span>

                <span className="text-2xl font-black text-[#17633a]">
                  Rs.{" "}
                  {totalPrice.toLocaleString()}
                </span>

              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">

                <FaShieldAlt className="mt-1 shrink-0 text-green-600" />

                <p className="text-xs leading-5 text-slate-500">
                  Your order information is securely processed. Online payments are handled through the payment gateway.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

/*
==================================================
INPUT COMPONENT
==================================================
*/

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#d8e0d8] px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
      />
    </div>
  );
};

export default Checkout;