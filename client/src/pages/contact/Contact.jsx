import { useState } from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import API from "../../services/api";
import contactHero from "../../assets/images/hero6.jpeg";

function Contact() {
  const reduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      setSending(true);
      const response = await API.post("/contact", formData);
      setSuccess(
        response.data.message ||
          "Thanks for reaching out. Our team will be in touch soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "We couldn’t send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const fadeUp = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: "easeOut",
      },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  };

  return (
    <main className="bg-white text-[#252a25]">
      {/* HERO SECTION */}
      {/* <section className="relative isolate mx-3 my-3 flex min-h-97.5 items-center overflow-hidden rounded-2xl bg-[#123e28] sm:mx-5 sm:my-5 sm:min-h-120 sm:rounded-3xl lg:mx-8 lg:my-8 lg:min-h-135">
        <motion.img
          src={contactHero}
          alt="ShopHub customer enjoying a skincare routine"
          className="absolute inset-0 -z-20 h-full w-full scale-[1.45] origin-[68%_0%] object-cover object-[68%_0%] sm:scale-100 sm:origin-center sm:object-[68%_16%]"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.5 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1.45 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#103d27]/95 via-[#17633a]/65 to-[#17633a]/10" />

        <motion.div
          className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <motion.div
            className="max-w-2xl text-white"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4ead9]"
            >
              Customer care
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
            >
              Contact ShopHub
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg"
            >
              Tell us what you need help with. Our team is here for questions
              about orders, products, and your shopping experience.
            </motion.p>
          </motion.div>
        </motion.div>
      </section> */}
      
{/* HERO SECTION */}
<section className="relative isolate mx-3 my-3 flex h-65 items-center overflow-hidden rounded-2xl bg-[#123e28] sm:mx-5 sm:my-5 sm:h-75 sm:rounded-3xl md:h-85 lg:mx-8 lg:my-8 lg:h-95">
  <motion.img
    src={contactHero}
    alt="ShopHub customer enjoying a skincare routine"
    className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_16%]"
    initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
    animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
  />

  <div className="absolute inset-0 -z-10 " />

  <motion.div
    className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14"
    initial={reduceMotion ? false : { opacity: 0 }}
    animate={reduceMotion ? undefined : { opacity: 1 }}
    transition={{ duration: 0.7, delay: 0.1 }}
  >
    <motion.div
      className="max-w-2xl text-white"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
     
    </motion.div>
  </motion.div>
</section>


      {/* CONTACT DETAILS AND FORM */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16 lg:px-10">
        <motion.aside
          className="pt-2"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-[0.18em] text-[#17633a]"
          >
            Get in touch
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-2xl font-bold text-[#202a22] sm:text-3xl"
          >
            We’ll help you get it sorted.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-sm text-sm leading-6 text-[#70746a]"
          >
            Send us a message and include any details that will help us
            understand your question.
          </motion.p>

          <motion.a
            href="mailto:support@shophub.com"
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { x: 5 }}
            className="mt-8 flex items-start gap-3 text-sm text-[#17633a] hover:text-[#12532f]"
          >
            <motion.span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf6f0]"
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: -4 }}
            >
              <FaEnvelope />
            </motion.span>
            <span>
              <span className="block font-semibold text-[#252a25]">
                Email support
              </span>
              <span className="mt-1 block">support@shophub.com</span>
            </span>
          </motion.a>

          <motion.div
            variants={fadeUp}
            whileHover={reduceMotion ? undefined : { x: 5 }}
            className="mt-8 flex items-start gap-3 text-sm text-[#70746a]"
          >
            <motion.span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf6f0] text-[#17633a]"
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 4 }}
            >
              <FaMapMarkerAlt />
            </motion.span>
            <span>
              <span className="block font-semibold text-[#252a25]">
                ShopHub support
              </span>
              <span className="mt-1 block">Lahore, Pakistan</span>
            </span>
          </motion.div>
        </motion.aside>

        <motion.section
          className="rounded-2xl border border-[#e2e9e2] bg-white p-5 shadow-sm sm:p-8"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
        >
          <div>
            <h2 className="text-xl font-bold text-[#202a22]">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-[#70746a]">
              We’ll reply to the email address you provide.
            </p>
          </div>

          <div aria-live="polite" aria-atomic="true">
            {success && (
              <motion.div
                role="status"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-start gap-3 rounded-xl border border-[#cfe3d5] bg-[#edf6f0] p-4 text-sm text-[#17633a]"
              >
                <FaCheckCircle className="mt-0.5 shrink-0" />
                <p>{success}</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                role="alert"
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <motion.div
              className="grid gap-5 sm:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.label variants={fadeUp} className="block text-sm font-semibold text-[#37433a]">
                Your name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={100}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d8e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
                />
              </motion.label>

              <motion.label variants={fadeUp} className="block text-sm font-semibold text-[#37433a]">
                Email address
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  maxLength={254}
                  required
                  className="mt-2 w-full rounded-xl border border-[#d8e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
                />
              </motion.label>
            </motion.div>

            <motion.label
              className="block text-sm font-semibold text-[#37433a]"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              Subject
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                maxLength={160}
                required
                className="mt-2 w-full rounded-xl border border-[#d8e0d8] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />
            </motion.label>

            <motion.label
              className="block text-sm font-semibold text-[#37433a]"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                maxLength={5000}
                required
                className="mt-2 w-full resize-y rounded-xl border border-[#d8e0d8] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#17633a] focus:ring-2 focus:ring-[#edf6f0]"
              />
            </motion.label>

            <motion.div
              className="flex flex-col gap-3 border-t border-[#e8eee8] pt-5 sm:flex-row sm:items-center sm:justify-between"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <p className="text-xs text-[#70746a]">
                Your message is sent securely to the ShopHub support team.
              </p>
              <motion.button
                type="submit"
                disabled={sending}
                whileHover={
                  reduceMotion || sending ? undefined : { y: -2, scale: 1.01 }
                }
                whileTap={reduceMotion || sending ? undefined : { scale: 0.98 }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#17633a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#12532f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <motion.span
                    className="inline-flex"
                    animate={reduceMotion ? undefined : { rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSpinner />
                  </motion.span>
                ) : (
                  <FaPaperPlane />
                )}
                {sending ? "Sending..." : "Send message"}
              </motion.button>
            </motion.div>
          </form>
        </motion.section>
      </section>
    </main>
  );
}

export default Contact;
