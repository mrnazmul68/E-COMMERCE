import { Tag, Phone, Share2, Globe, MessageCircle, Mail } from "lucide-react";

const Topbar = () => {
  return (
    <div className="bg-orange-500 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10">
        {/* Left — Social / Connect Icons (Lucide) */}
        <div className="hidden sm:flex items-center gap-3">
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
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Tag size={16} className="shrink-0" />
          <span className="truncate">
            Free shipping on orders over{" "}
            <span className="font-semibold">$50</span> — Limited time offer!
          </span>
        </div>

        {/* Right — Phone Number */}
        <div className="hidden md:flex items-center gap-2">
          <Phone size={16} />
          <span className="font-medium">+880 1234-567890</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
