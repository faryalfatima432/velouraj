
import { useEffect, useState } from "react";
import {
  FaTimes,
  FaShieldAlt,
  FaFileContract,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

const legalDocuments = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How ShopHub handles your information",
    updated: "October 9, 2026",
    icon: FaShieldAlt,
    sections: [
      {
        title: "1. Introduction",
        paragraphs: [
          "ShopHub respects your privacy. This policy explains what information we may collect when you browse our website, create an account, place an order, or contact our support team.",
          "This policy applies to information processed through the ShopHub website and related shopping services. It should be read alongside our Terms & Conditions.",
        ],
      },
      {
        title: "2. Information We Collect",
        paragraphs: [
          "Account information: your name, email address, phone number, and account credentials when you register or update your profile.",
          "Order information: products purchased, order totals, delivery address, contact details, payment method, and order history.",
          "Support communications: information you provide when you contact us about an order, return, or other question.",
          "Technical information: limited device, browser, log, and website usage information may be collected to operate, protect, and improve the website.",
          "Please do not send us passwords, full payment card details, or other unnecessary sensitive information through customer support messages.",
        ],
      },
      {
        title: "3. How We Use Your Information",
        paragraphs: [
          "We may use your information to create and manage your account, process orders, arrange delivery, communicate order updates, respond to questions, prevent fraud, maintain website security, and improve our services.",
          "We may also use information to meet applicable legal, accounting, tax, and regulatory obligations.",
          "We will not use your email for promotional messages unless permitted by applicable law and, where required, you have given your consent. You can opt out of marketing communications.",
        ],
      },
      {
        title: "4. Payments",
        paragraphs: [
          "Payment information depends on the payment method you select. Where a third-party payment provider is used, that provider may process payment information under its own terms and privacy policy.",
          "ShopHub should not store full card numbers, card security codes, banking passwords, or payment gateway credentials in ordinary customer records. Payment status may be recorded to manage your order.",
          "For bank transfers or other manual payment methods, you may be asked to provide limited transaction evidence for order verification. Avoid including unrelated financial information in receipts.",
        ],
      },
      {
        title: "5. Sharing Information",
        paragraphs: [
          "We may share relevant information with service providers that help operate our store, process payments, deliver orders, host our website, protect against fraud, or provide customer support.",
          "We may disclose information when required by law, to respond to valid legal requests, to protect our rights, or to address security and fraud concerns.",
          "We do not offer customer personal information for sale. Information shared with service providers should be limited to what is reasonably necessary for their work.",
        ],
      },
      {
        title: "6. Cookies and Website Technology",
        paragraphs: [
          "The website may use browser storage, cookies, or similar technologies to maintain your shopping cart, remember preferences, keep your session working, and understand website performance.",
          "You can manage cookies through your browser settings. Disabling some technologies may affect cart, login, or other website functionality.",
          "Any analytics or advertising technologies should be disclosed here if ShopHub adds them, including relevant consent choices where required.",
        ],
      },
      {
        title: "7. Data Security and Retention",
        paragraphs: [
          "We use reasonable technical and organizational measures intended to protect information against unauthorized access, loss, misuse, or alteration. No internet transmission or storage system can be guaranteed completely secure.",
          "We retain information for as long as reasonably necessary to operate accounts and orders, resolve disputes, maintain records, prevent fraud, and meet applicable legal obligations. Retention periods depend on the type of information and its purpose.",
        ],
      },
      {
        title: "8. Your Choices and Rights",
        paragraphs: [
          "You may be able to access or correct your account details through your profile. You can contact ShopHub to request correction or deletion of personal information, subject to applicable law and legitimate recordkeeping requirements.",
          "You may opt out of promotional communications using the unsubscribe method provided or by contacting support. Essential messages about purchases, account security, and service operations may still be sent.",
          "Requests will be handled in accordance with applicable privacy and data protection laws.",
        ],
      },
      {
        title: "9. Children's Privacy",
        paragraphs: [
          "ShopHub is intended for people who can legally make purchases or use the service under applicable law. We do not knowingly seek to collect children's personal information unlawfully. A parent or guardian who believes a child has provided information may contact us to request review.",
        ],
      },
      {
        title: "10. Changes to This Policy",
        paragraphs: [
          "We may update this policy as our services, technology, or legal obligations change. The latest version and its update date will be displayed on this website. Where legally required, we will provide additional notice or obtain consent.",
        ],
      },
      {
        title: "11. Contact Us",
        paragraphs: [
          "For privacy questions or requests, contact ShopHub using the customer support email published on our website. Replace the example contact details with your verified business contact information before launch.",
          "Email: support@shophub.com",
          "Business location: Pakistan",
        ],
      },
    ],
  },

  terms: {
    title: "Terms & Conditions",
    subtitle: "The terms for using ShopHub",
    updated: "October 9, 2026",
    icon: FaFileContract,
    sections: [
      {
        title: "1. Agreement to These Terms",
        paragraphs: [
          "These Terms & Conditions govern your access to and use of the ShopHub website and its shopping services. By using the website or placing an order, you agree to these terms to the extent permitted by applicable law.",
          "If you do not agree, please do not use the website. Mandatory rights provided by applicable consumer law are not excluded by these terms.",
        ],
      },
      {
        title: "2. Eligibility and Accounts",
        paragraphs: [
          "You must be legally able to enter into a purchase agreement under applicable law to place an order. If you create an account, you agree to provide accurate information and keep it reasonably up to date.",
          "You are responsible for safeguarding your login credentials and notifying ShopHub if you suspect unauthorized account access. You must not impersonate another person or use the website for unlawful activity.",
          "ShopHub may restrict or suspend accounts where reasonably necessary to address suspected fraud, security risks, abuse, or a violation of these terms, subject to applicable law.",
        ],
      },
      {
        title: "3. Products and Availability",
        paragraphs: [
          "We aim to display product descriptions, images, prices, and availability accurately. Actual product appearance may vary slightly due to display settings, photography, or packaging changes.",
          "Products are subject to availability. We may correct listing errors, update product information, or discontinue products. If an order is affected by a material error or unavailable product, we will take appropriate steps, including contacting you and arranging a refund where applicable.",
        ],
      },
      {
        title: "4. Prices, Orders, and Confirmation",
        paragraphs: [
          "Prices and applicable charges will be shown during checkout. Delivery fees, discounts, taxes, or other charges will be disclosed where applicable before you complete your order.",
          "Submitting an order is a request to purchase the selected products. An order confirmation or order status shown on the website does not necessarily mean that an order has been dispatched.",
          "We may decline or cancel an order where reasonably justified, including product unavailability, a pricing or listing error, suspected fraud, or an inability to verify necessary information. If payment has already been collected for an order we cancel, any refund due will be processed in accordance with applicable law and the relevant payment method.",
        ],
      },
      {
        title: "5. Payment",
        paragraphs: [
          "Available payment methods will be displayed at checkout and may change over time. You agree to provide accurate information required for the payment method you choose.",
          "For cash on delivery, payment is collected according to the delivery arrangement presented at checkout. For online payments, the order may remain pending until payment is confirmed by the relevant provider.",
          "For bank transfer, where offered, the order may remain pending while ShopHub verifies the payment. Do not treat a submitted receipt alone as proof that a transfer has cleared.",
          "Refund timing may depend on your payment provider or bank. ShopHub will communicate relevant instructions where a refund is due.",
        ],
      },
      {
        title: "6. Delivery",
        paragraphs: [
          "Delivery estimates are provided for guidance and may be affected by location, courier capacity, weather, public holidays, or other circumstances outside our reasonable control.",
          "You are responsible for providing a complete and accurate delivery address and contact number. Please contact customer support promptly if you notice an error.",
          "Delivery charges, service areas, and any delivery restrictions will be shown or communicated as applicable. We will handle delivery issues in accordance with applicable law and the order arrangement.",
        ],
      },
      {
        title: "7. Cancellations, Returns, and Refunds",
        paragraphs: [
          "Cancellation, return, replacement, and refund requests are subject to the applicable ShopHub policy presented to customers and any mandatory rights under Pakistani law.",
          "Product eligibility, request deadlines, condition requirements, return shipping, and refund methods should be clearly stated in the published returns policy before orders are accepted.",
          "If a product arrives damaged, incorrect, or materially different from its description, contact customer support with your order details and relevant evidence so the issue can be reviewed.",
          "Nothing in these terms removes consumer rights that cannot legally be excluded or restricted.",
        ],
      },
      {
        title: "8. Acceptable Website Use",
        paragraphs: [
          "You must not misuse the website, attempt unauthorized access, interfere with its operation, distribute malicious code, submit fraudulent orders, or use another person's information without authorization.",
          "You must not copy, scrape, republish, or commercially exploit website content in a way that violates applicable law or the rights of ShopHub or others.",
        ],
      },
      {
        title: "9. Intellectual Property",
        paragraphs: [
          "Unless stated otherwise, website branding, text, design, graphics, and other content are owned by ShopHub or used with permission. You may use the website for personal, lawful shopping purposes.",
          "You must obtain appropriate permission before reproducing or commercially using protected ShopHub content. Product names, trademarks, and images belonging to third parties remain the property of their respective owners.",
        ],
      },
      {
        title: "10. Liability and Service Availability",
        paragraphs: [
          "We work to keep ShopHub available and information accurate, but we do not guarantee uninterrupted access or that the website will always be error-free.",
          "To the extent permitted by law, ShopHub is not responsible for indirect losses arising from circumstances beyond its reasonable control. Nothing in these terms excludes liability or consumer protections that cannot lawfully be excluded under applicable law.",
        ],
      },
      {
        title: "11. Privacy",
        paragraphs: [
          "Personal information is handled as described in the ShopHub Privacy Policy. By using the website, you should review that policy to understand how information is used and the choices available to you.",
        ],
      },
      {
        title: "12. Changes to These Terms",
        paragraphs: [
          "We may revise these terms as our services or legal obligations change. Updated terms will be published with a revised date. Changes will not override mandatory legal rights, and any legally required notice or consent will be provided.",
        ],
      },
      {
        title: "13. Applicable Law and Contact",
        paragraphs: [
          "These terms are intended for a store operating in Pakistan and are subject to applicable Pakistani law, including mandatory consumer protections. The appropriate legal forum and any dispute process must be finalized for your actual business and operating location.",
          "For questions about these terms, contact support@shophub.com. Replace this example email with your verified business contact before launch.",
        ],
      },
    ],
  },
};

export default function LegalModals() {
  const [activeDocument, setActiveDocument] = useState(null);

  useEffect(() => {
    if (!activeDocument) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveDocument(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDocument]);

  const legalDocument = activeDocument
    ? legalDocuments[activeDocument]
    : null;

  const DocumentIcon = legalDocument?.icon;

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-green-100/70 sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveDocument("privacy")}
          className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        >
          Privacy Policy
        </button>

        <button
          type="button"
          onClick={() => setActiveDocument("terms")}
          className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        >
          Terms & Conditions
        </button>
      </div>

      {legalDocument && (
        <div
          className="shop-backdrop-enter fixed inset-0 z-100 flex items-end justify-center bg-gray-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveDocument(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            className="shop-modal-enter flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88dvh] sm:rounded-2xl"
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 bg-[#edf6f0] px-4 py-4 sm:px-7 sm:py-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17633a] text-lg text-white">
                  <DocumentIcon />
                </div>

                <div className="min-w-0">
                  <h2
                    id="legal-modal-title"
                    className="text-lg font-extrabold text-gray-900 sm:text-2xl"
                  >
                    {legalDocument.title}
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                    {legalDocument.subtitle}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                    Last updated: {legalDocument.updated}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveDocument(null)}
                aria-label="Close legal document"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-[#17633a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17633a]"
              >
                <FaTimes />
              </button>
            </div>

            {/* Reading area */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-7 sm:py-7">
              <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <FaLock className="mt-1 shrink-0 text-[#17633a]" />

                  <p className="text-xs leading-6 text-gray-700 sm:text-sm">
                    {activeDocument === "privacy"
                      ? "We aim to handle customer information responsibly and use it for legitimate store operations, order fulfillment, security, and support."
                      : "These terms explain the general rules for shopping with ShopHub. Product-specific and legally required policies continue to apply."}
                  </p>
                </div>
              </div>

              <div className="space-y-7">
                {legalDocument.sections.map((section) => (
                  <article key={section.title}>
                    <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                      {section.title}
                    </h3>

                    <div className="mt-2 space-y-3">
                      {section.paragraphs.map((paragraph, index) => (
                        <p
                          key={index}
                          className="wrap-break-word text-xs leading-7 text-gray-600 sm:text-sm sm:leading-7"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 shrink-0 text-[#17633a]" />
                  <p className="text-xs leading-6 text-gray-600 sm:text-sm">
                    For questions about this document, contact ShopHub
                    customer support using the verified contact information
                    published on our website.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3 sm:px-7 sm:py-4">
              <span className="text-[11px] text-gray-500 sm:text-xs">
                ShopHub · Pakistan
              </span>

              <button
                type="button"
                onClick={() => setActiveDocument(null)}
                className="rounded-xl bg-[#17633a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12532f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}