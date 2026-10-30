import {
  LuArrowRight,
  LuHeadphones,
  LuMail,
  LuMapPin,
  LuPhone,
  LuRotateCcw,
  LuShieldCheck,
  LuTruck,
} from "react-icons/lu";
import {
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const features = [
  { icon: LuTruck, title: "Free Shipping", desc: "On orders over $50" },
  { icon: LuRotateCcw, title: "Easy Returns", desc: "30-day return policy" },
  {
    icon: LuShieldCheck,
    title: "Secure Payment",
    desc: "100% protected checkout",
  },
  { icon: LuHeadphones, title: "24/7 Support", desc: "We're here to help" },
];

const shopLinks = [
  "New Arrivals",
  "Best Sellers",
  "Men",
  "Women",
  "Accessories",
  "Sale",
];
const supportLinks = [
  "Help Center",
  "Track Order",
  "Shipping Info",
  "Returns & Refunds",
  "Size Guide",
  "FAQs",
];
const companyLinks = [
  "About Nexora",
  "Careers",
  "Blog",
  "Press",
  "Affiliates",
  "Contact Us",
];

const socials = [
  { icon: FaFacebookF, label: "Facebook" },
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaXTwitter, label: "X (Twitter)" },
  { icon: FaYoutube, label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-black text-neutral-400">
      {/* Black background with white-shade square grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Feature strip */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                <Icon size={22} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{title}</h4>
                <p className="text-xs text-neutral-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 gap-12 py-14 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-4">
            <a href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-lg font-bold text-black">
                N
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                Nexora
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Your destination for modern essentials. Quality products, fair
              prices and fast delivery, right to your door.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex max-w-sm items-center rounded-lg border border-white/10 bg-white/5 p-1 focus-within:border-white/30"
            >
              <LuMail size={18} className="ml-3 shrink-0 text-neutral-500" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-black transition hover:bg-neutral-200"
              >
                <LuArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-300 transition hover:border-white hover:bg-white hover:text-black"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterColumn title="Shop" links={shopLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Company" links={companyLinks} />
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Get in touch
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <LuMapPin size={18} className="mt-0.5 shrink-0 text-white" />
                <span>123 Commerce Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <LuPhone size={18} className="shrink-0 text-white" />
                <a href="tel:+8801000000000" className="hover:text-white">
                  +880 1000-000000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <LuMail size={18} className="shrink-0 text-white" />
                <a
                  href="mailto:support@nexora.com"
                  className="hover:text-white"
                >
                  support@nexora.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-neutral-500 md:flex-row">
          <p>© {new Date().getFullYear()} Nexora. All rights reserved.</p>

          <div className="flex items-center gap-3">
            <FaCcVisa size={28} />
            <FaCcMastercard size={28} />
            <FaCcPaypal size={28} />
            <span className="ml-1">bKash · Nagad · COD</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
      {title}
    </h3>
    <ul className="space-y-3 text-sm">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="inline-block transition hover:translate-x-1 hover:text-white"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
