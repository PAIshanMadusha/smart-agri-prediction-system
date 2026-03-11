//TODO: Split into smaller components for better maintainability (e.g. ContactCard, FaqItem, SocialLink, etc.)
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaMapLocationDot,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa6";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaCheckCircle,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { HiSparkles } from "react-icons/hi2";
import { MdAccessTime, MdSupportAgent } from "react-icons/md";

/* Scroll reveal */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const t = {
    up: "translateY(32px)",
    left: "translateX(-32px)",
    right: "translateX(32px)",
    none: "none",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : t[direction],
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionPill({ text, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 border
      ${dark ? "bg-white/10 text-green-200 border-white/20" : "bg-green-100 text-green-700 border-green-200"}`}
    >
      <FaLeaf /> {text}
    </span>
  );
}

/* Contact info cards data */
const contactCards = [
  {
    icon: <IoIosMail />,
    label: "Email Us",
    primary: "support@saps.com",
    secondary: "info@saps.com",
    note: "We reply within 24 hours",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    accent: "text-emerald-600",
  },
  {
    icon: <FaPhone />,
    label: "Call Us",
    primary: "+(94)-34-567-8943",
    secondary: "+(94)-11-234-5678",
    note: "Mon–Fri · 8 AM – 6 PM",
    gradient: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    accent: "text-teal-600",
  },
  {
    icon: <FaMapLocationDot />,
    label: "Visit Us",
    primary: "11/A Horana Road",
    secondary: "Kalutara, Sri Lanka",
    note: "Open for walk-ins",
    gradient: "from-green-500 to-teal-600",
    bg: "bg-green-50",
    border: "border-green-100",
    accent: "text-green-600",
  },
];

const faqs = [
  {
    q: "Is Smart Agri Prediction free to use?",
    a: "Yes — all four AI services (Crop Recommendation, Disease Detection, Fertilizer Suggestion, and Weather Insights) are completely free for registered users.",
  },
  {
    q: "How accurate are the ML predictions?",
    a: "Our models achieve up to 99.82% training accuracy. The crop recommendation model scores 99.32% on test data, and the disease CNN reaches 99.45% validation accuracy.",
  },
  {
    q: "What data do I need to get a crop recommendation?",
    a: "You'll need soil N, P, K values, pH level, plus your location's average rainfall, temperature, and humidity. The platform also auto-fills weather data via GPS.",
  },
  {
    q: "Does the disease detection work with any crop?",
    a: "Currently it supports 38 disease classes across major Sri Lankan crops. We are continuously expanding the model's crop coverage.",
  },
  {
    q: "How do I report a bug or suggest a feature?",
    a: "Use the contact form on this page, email us directly, or open an issue on our GitHub repository. We actively monitor all channels.",
  },
];

const socialLinks = [
  {
    icon: <FaFacebookSquare />,
    label: "Facebook",
    href: "#",
    color: "hover:text-blue-600",
  },
  {
    icon: <FaInstagramSquare />,
    label: "Instagram",
    href: "#",
    color: "hover:text-pink-500",
  },
  {
    icon: <FaGithub />,
    label: "GitHub",
    href: "#",
    color: "hover:text-gray-900",
  },
  {
    icon: <FaLinkedin />,
    label: "LinkedIn",
    href: "#",
    color: "hover:text-blue-700",
  },
];

/* FAQ accordion item */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={index * 60}>
      <div
        className={`border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer
          ${open ? "border-green-300 shadow-sm bg-green-50" : "border-gray-100 bg-white hover:border-green-200"}`}
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex items-center justify-between px-5 py-4 gap-4">
          <span className="text-sm font-semibold text-[#073319]">{q}</span>
          <span
            className={`text-green-600 text-lg flex-shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </div>
        <div
          style={{
            maxHeight: open ? "200px" : "0",
            opacity: open ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.3s ease",
          }}
          className="overflow-hidden"
        >
          <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* Main page*/
function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim() || form.message.length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="bg-[#f0fdf4] text-[#073319] overflow-x-hidden">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-emerald-300/10 blur-3xl translate-y-1/2" />

        <div className="relative container mx-auto px-4 md:px-6 text-center">
          <Reveal>
            <SectionPill text="Contact Us" dark />
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-5">
              We're Here to{" "}
              <span className="text-green-300">Help You Grow</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-green-100/75 text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Have a question about our AI tools, need technical support, or
              want to collaborate? Reach out — our team responds within 24
              hours.
            </p>
          </Reveal>

          {/* Quick info pills */}
          <Reveal delay={300}>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: <MdAccessTime />, text: "24hr Response" },
                { icon: <MdSupportAgent />, text: "Free Support" },
                { icon: <HiSparkles />, text: "Technical Help" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <span className="text-green-300">{icon}</span> {text}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact card*/}
      <section className="py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-3 gap-5 -mt-10 relative z-10">
            {contactCards.map(
              (
                {
                  icon,
                  label,
                  primary,
                  secondary,
                  note,
                  gradient,
                  bg,
                  border,
                  accent,
                },
                i,
              ) => (
                <Reveal key={label} delay={i * 80}>
                  <div
                    className={`rounded-2xl border ${border} ${bg} p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow mb-4`}
                    >
                      {icon}
                    </div>
                    <p
                      className={`text-xs font-bold uppercase tracking-widest ${accent} mb-2`}
                    >
                      {label}
                    </p>
                    <p className="text-sm font-bold text-[#073319]">
                      {primary}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">{secondary}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full">
                      <FaCheckCircle className="text-green-400" /> {note}
                    </span>
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Main contact form side bar*/}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            {/* Left sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal direction="left">
                <SectionPill text="Get In Touch" />
                <h2 className="text-3xl font-extrabold text-[#073319] leading-tight mb-3">
                  Let's Start a<br />
                  <span className="text-green-600">Conversation</span>
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Whether you're a farmer seeking guidance, a researcher
                  interested in collaboration, or a developer wanting to
                  integrate our APIs — we'd love to hear from you.
                </p>
              </Reveal>

              {/* Office hours card */}
              <Reveal delay={100} direction="left">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <MdAccessTime className="text-lg" />
                    </div>
                    <h4 className="font-bold text-sm text-[#073319]">
                      Office Hours
                    </h4>
                  </div>
                  {[
                    { day: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
                    { day: "Saturday", time: "9:00 AM – 1:00 PM" },
                    { day: "Sunday", time: "Closed" },
                  ].map(({ day, time }) => (
                    <div
                      key={day}
                      className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-xs text-gray-500">{day}</span>
                      <span
                        className={`text-xs font-semibold ${time === "Closed" ? "text-red-400" : "text-green-600"}`}
                      >
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Social links */}
              <Reveal delay={150} direction="left">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-bold text-sm text-[#073319] mb-4">
                    Follow Us
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map(({ icon, label, href, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2.5 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-400 ${color} hover:border-current hover:bg-gray-50 transition-all duration-200`}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs font-semibold">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Quick links */}
              <Reveal delay={200} direction="left">
                <div
                  className="bg-gradient-to-br from-[#052e16] to-[#16a34a] rounded-2xl p-5 text-white shadow-lg"
                  style={{ boxShadow: "0 12px 40px rgba(22,163,74,0.25)" }}
                >
                  <HiSparkles className="text-green-300 text-xl mb-3" />
                  <h4 className="font-bold text-sm mb-2">
                    Prefer Self-Service?
                  </h4>
                  <p className="text-xs text-green-100/70 mb-4 leading-relaxed">
                    Find answers instantly in our documentation or start using
                    our AI tools right away.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/services"
                      className="text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-lg text-center"
                    >
                      → Explore Services
                    </Link>
                    <Link
                      to="/resources"
                      className="text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors px-3 py-2 rounded-lg text-center"
                    >
                      → View Resources
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <Reveal direction="right">
                {submitted ? (
                  /* Success state */
                  <div
                    className="bg-white border border-green-200 rounded-3xl p-10 text-center shadow-lg"
                    style={{ animation: "fadeSlide 0.5s ease" }}
                  >
                    <div
                      className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg"
                      style={{ boxShadow: "0 0 30px rgba(74,222,128,0.3)" }}
                    >
                      <FaCheckCircle />
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#073319] mb-3">
                      Message Sent!
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                      Thank you, <strong>{form.name}</strong>! We've received
                      your message and will get back to you at{" "}
                      <strong>{form.email}</strong> within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: "",
                          email: "",
                          subject: "",
                          category: "",
                          message: "",
                        });
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm shadow"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow">
                        <FaPaperPlane />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#073319] text-lg">
                          Send Us a Message
                        </h3>
                        <p className="text-xs text-gray-400">
                          All fields marked * are required
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            placeholder="Kasun Perera"
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all
                              ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-green-300 focus:border-green-400"}`}
                          />
                          {errors.name && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) =>
                              handleChange("email", e.target.value)
                            }
                            placeholder="kasun@example.com"
                            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all
                              ${errors.email ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-green-300 focus:border-green-400"}`}
                          />
                          {errors.email && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">
                          Category
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) =>
                            handleChange("category", e.target.value)
                          }
                          className="w-full border border-gray-200 hover:border-green-300 focus:border-green-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white text-gray-700"
                        >
                          <option value="">Select a category…</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="crop">Crop Recommendation Help</option>
                          <option value="disease">
                            Disease Detection Help
                          </option>
                          <option value="fertilizer">
                            Fertilizer Suggestion Help
                          </option>
                          <option value="collab">Research Collaboration</option>
                          <option value="feedback">
                            Feedback & Suggestions
                          </option>
                          <option value="bug">Bug Report</option>
                        </select>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={form.subject}
                          onChange={(e) =>
                            handleChange("subject", e.target.value)
                          }
                          placeholder="What's this about?"
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all
                            ${errors.subject ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-green-300 focus:border-green-400"}`}
                        />
                        {errors.subject && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1.5">
                          Message *{" "}
                          <span className="text-gray-400 font-normal">
                            (min 20 chars)
                          </span>
                        </label>
                        <textarea
                          value={form.message}
                          onChange={(e) =>
                            handleChange("message", e.target.value)
                          }
                          placeholder="Tell us how we can help…"
                          rows={5}
                          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all resize-none
                            ${errors.message ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-green-300 focus:border-green-400"}`}
                        />
                        <div className="flex justify-between items-center mt-1">
                          {errors.message ? (
                            <p className="text-xs text-red-500">
                              {errors.message}
                            </p>
                          ) : (
                            <span />
                          )}
                          <span
                            className={`text-xs ml-auto ${form.message.length < 20 ? "text-gray-400" : "text-green-500"}`}
                          >
                            {form.message.length} chars
                          </span>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg
                          ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl"}`}
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-xs" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder*/}
      <section className="py-4 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-lg h-72 bg-gradient-to-br from-green-100 to-emerald-50">
              {/* Map placeholder replace with actual Google Maps embed */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div
                  className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg mb-4"
                  style={{ boxShadow: "0 0 30px rgba(74,222,128,0.35)" }}
                >
                  <FaMapLocationDot />
                </div>
                <p className="font-extrabold text-[#073319] text-lg">
                  11/A Horana Road, Kalutara
                </p>
                <p className="text-gray-500 text-sm mt-1">Sri Lanka</p>
                <a
                  href="https://maps.google.com/?q=Kalutara,Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-bold bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors shadow"
                >
                  Open in Google Maps →
                </a>
              </div>
              {/* Subtle dot grid overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, #16a34a 1px, transparent 1px)`,
                  backgroundSize: "28px 28px",
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FQA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <Reveal>
              <SectionPill text="FAQ" />
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#073319]">
                Frequently Asked Questions
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-gray-500 text-sm mt-3">
                Can't find what you're looking for? Send us a message above.
              </p>
            </Reveal>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA*/}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal>
            <div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#16a34a] text-white text-center py-16 px-6 md:px-12"
              style={{ boxShadow: "0 25px 60px rgba(22,163,74,0.25)" }}
            >
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-200 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                  <FaLeaf /> Join the Community
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                  Start Farming Smarter — <br className="hidden sm:block" />
                  Today, for Free
                </h2>
                <p className="text-green-100/70 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
                  Register for instant access to all four AI tools. No credit
                  card, no commitment — just smarter farming.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/register"
                    className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-lg text-sm"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    to="/services"
                    className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:border-white hover:bg-white/10 transition-all text-sm"
                  >
                    View Services
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default ContactUsPage;
