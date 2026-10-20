import { useEffect, useState } from "react";
import { FaArrowRight, FaChevronDown, FaTimes } from "react-icons/fa";

const faqItems = [
  {
    question: "How do I place an order?",
    answer: "Browse the products, add the items you want to your cart, then continue to checkout to enter your delivery details and choose an available payment method.",
  },
  {
    question: "Where can I check my order status?",
    answer: "Sign in and open My Orders from the Account menu. You can view each order’s status and open its details there.",
  },
  {
    question: "Which payment methods can I use?",
    answer: "Available payment methods are shown during checkout and may vary by order.",
  },
  {
    question: "Can I change or cancel an order?",
    answer: "Contact support as soon as possible with your order number. Changes depend on the order’s current fulfillment status.",
  },
  {
    question: "How do I contact customer support?",
    answer: "Email support@shophub.com or start a WhatsApp chat using the contact button in the footer.",
  },
];

export default function FaqModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex w-fit items-center gap-2 text-sm text-green-100/70 transition hover:text-white"
      >
        <FaArrowRight className="text-[10px] opacity-0 transition group-hover:opacity-100" />
        FAQs
      </button>

      {isOpen && (
        <div
          className="shop-backdrop-enter fixed inset-0 z-100 flex items-end justify-center bg-gray-950/65 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-modal-title"
            className="shop-modal-enter flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-[#e2e9e2] bg-[#edf6f0] px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17633a]">Support</p>
                <h2 id="faq-modal-title" className="mt-1 text-xl font-bold text-[#202a22] sm:text-2xl">
                  Frequently Asked Questions
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close frequently asked questions"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 transition hover:bg-[#17633a] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#17633a]"
              >
                <FaTimes />
              </button>
            </header>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-6">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0} className="group rounded-xl border border-[#e2e9e2] bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-[#26352b] marker:hidden sm:text-base">
                    {item.question}
                    <FaChevronDown className="shrink-0 text-xs text-[#17633a] transition group-open:rotate-180" />
                  </summary>
                  <p className="px-4 pb-4 text-sm leading-6 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
