import { Tag, Phone, Share2, Globe, MessageCircle, Mail } from "lucide-react";

const Topbar = () => {
  return (
    <div className="bg-orange-500 text-white text-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
        {/* Left — Social Icons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <a
            href="#"
            aria-label="Website"
            className="hover:text-orange-200 transition-colors"
          >
            <Globe size={16} />
          </a>

          <a
            href="#"
            aria-label="Chat"
            className="hover:text-orange-200 transition-colors"
          >
            <MessageCircle size={16} />
          </a>

          <a
            href="#"
            aria-label="Share"
            className="hover:text-orange-200 transition-colors"
          >
            <Share2 size={16} />
          </a>

          <a
            href="#"
            aria-label="Email"
            className="hover:text-orange-200 transition-colors"
          >
            <Mail size={16} />
          </a>
        </div>

        {/* Center — Offer */}
        <div className="min-w-0 flex-1 overflow-hidden sm:flex-none sm:mx-auto">
          <div className="flex items-center gap-2 w-max animate-marquee sm:animate-none sm:w-auto sm:justify-center">
            {/* First copy */}
            <div className="flex items-center gap-2 shrink-0">
              <Tag size={16} className="shrink-0" />
              <span className="whitespace-nowrap">
                Free shipping on orders over{" "}
                <span className="font-semibold">$50</span> — Limited time offer!
              </span>
            </div>

            {/* Duplicate for seamless scrolling */}
            <div
              className="flex items-center gap-2 shrink-0"
              aria-hidden="true"
            >
              <Tag size={16} className="shrink-0" />

              <span className="whitespace-nowrap">
                Free shipping on orders over{" "}
                <span className="font-semibold">$50</span> — Limited time offer!
              </span>
            </div>
          </div>
        </div>

        {/* Right — Phone Number */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Phone size={16} />
          <span className="font-medium">+880 1234-567890</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
