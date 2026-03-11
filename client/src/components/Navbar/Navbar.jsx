import { useState, useEffect, useRef, useTransition } from "react";
import { FaMapLocationDot, FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdAddIcCall } from "react-icons/md";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaSeedling,
  FaMicroscope,
  FaFlask,
  FaChevronDown,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import ContactInfoItem from "./ContactInfoItem";
import Logo from "../../assets/leaf_favicon.png";
import SocialIcon from "./SocialIcon";
import Button from "../Button/Button";
import { useAuth } from "../../context/useAuth";

// Navbar Links for desktop, with active state logic based on current path
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact Us" },
];

// AI services links for dropdown, with icons
const aiServiceLinks = [
  {
    to: "/ai-services/crop",
    label: "Crop Recommendation",
    icon: <FaSeedling className="text-emerald-500" />,
  },
  {
    to: "/ai-services/fertilizer",
    label: "Fertilizer Suggestion",
    icon: <FaFlask className="text-teal-500" />,
  },
  {
    to: "/ai-services/disease",
    label: "Disease Detection",
    icon: <FaMicroscope className="text-green-500" />,
  },
];

// Custom hook to detect clicks outside of a specified ref, used for closing dropdowns when clicking outside
function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("touchstart", fn);
    };
  }, [ref, handler]);
}

// Dropdown component for both user menu and AI services menu, with smooth open/close animations and alignment options
function Dropdown({ isOpen, children, align = "left" }) {
  return (
    <div
      className={`absolute top-[calc(100%+8px)] ${align === "right" ? "right-0" : "left-0"}
        bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[190px]
        transition-all duration-200 origin-top
        ${isOpen ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}`}
    >
      {children}
    </div>
  );
}

// The Navbar component is a responsive navigation bar that includes an upper section with contact info and social media links, and a lower section with navigation links, user authentication actions, and dropdown menus for AI services and user account options. It also handles mobile menu toggling and click-outside behavior for dropdowns.
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileAIOpen, setMobileAIOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Authentication context to determine if user is logged in and to handle logout
  const { user, logout } = useAuth();
  const location = useLocation();

  // Refs for click-outside on both dropdowns
  const userRef = useRef(null);
  const serviceRef = useRef(null);
  useClickOutside(userRef, () => setUserMenuOpen(false));
  useClickOutside(serviceRef, () => setServiceMenuOpen(false));

  // Scroll listener to add shadow to navbar when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu and AI services submenu when navigating to a new page
  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false);
      setMobileAIOpen(false);
    });
  }, [location]);

  // Generate user initials for avatar display, fallback to "U" if no name is available
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Function to determine the class for desktop navigation links, adding an underline effect for the active link and hover states
  const desktopLinkClass = (path) =>
    `relative pb-0.5 transition-colors duration-200 hover:text-green-100
     after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200
     ${location.pathname === path ? "text-white after:w-full" : "after:w-0 hover:after:w-full"}`;

  // Similar function for mobile navigation links, changing background and text color for the active link and hover states
  const mobileLinkClass = (path) =>
    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
     ${location.pathname === path ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`;

  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-sm"}`}
    >
      {/* Upper Navbar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-2 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group transition duration-300 shrink-0"
          >
            <div className="flex items-center justify-center shadow-md rounded-full group-hover:shadow-lg transition duration-300 bg-green-50 p-1">
              <img
                src={Logo}
                alt="Smart Agri Logo"
                className="w-14 h-14 object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 group-hover:text-green-800 transition whitespace-nowrap">
              Smart Agri Prediction
            </h1>
          </Link>

          {/* Contact info and social media links for desktop, with a hamburger menu button for mobile */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
              <ContactInfoItem
                icon={<FaMapLocationDot />}
                title="Our Location"
                text="11/A Horana, Kalutara"
              />
              <ContactInfoItem
                icon={<IoIosMail />}
                title="Mail Us"
                text="support@saps.com"
              />
              <ContactInfoItem
                icon={<MdAddIcCall />}
                title="Live Help"
                text="+(94)-34-567-8943"
              />
            </div>
            <div className="hidden sm:flex gap-3 text-xl text-gray-500">
              <SocialIcon
                href="https://web.facebook.com/ishan.madusha.313"
                icon={<FaFacebookSquare />}
              />
              <SocialIcon
                href="https://www.instagram.com/ishan_madusha_"
                icon={<FaInstagramSquare />}
              />
              <SocialIcon
                href="https://github.com/PAIshanMadusha"
                icon={<FaGithub />}
              />
              <SocialIcon
                href="https://www.linkedin.com/in/ishan-madhusha-b457921ba"
                icon={<FaLinkedin />}
              />
            </div>
            <button
              className="sm:hidden text-green-700 text-2xl p-1 focus:outline-none"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Navbar (desktop) */}
      <div className="bg-green-600 text-white hidden sm:block">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center py-3">
          <div className="flex items-center gap-4 md:gap-6 font-medium text-sm md:text-base">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={desktopLinkClass(to)}>
                {label}
              </Link>
            ))}
            {user && (
              <div className="relative" ref={serviceRef}>
                <button
                  onClick={() => setServiceMenuOpen((p) => !p)}
                  className={`flex items-center gap-1.5 pb-0.5 transition-colors duration-200 hover:text-green-100
                    after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200
                    ${serviceMenuOpen ? "text-white after:w-full" : "after:w-0 hover:after:w-full"}`}
                >
                  AI Services
                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${serviceMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <Dropdown isOpen={serviceMenuOpen} align="left">
                  {aiServiceLinks.map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setServiceMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <span className="text-base">{icon}</span> {label}
                    </Link>
                  ))}
                </Dropdown>
              </div>
            )}

            {user && (
              <Link to="/community" className={desktopLinkClass("/community")}>
                Community
              </Link>
            )}
          </div>

          {/* User authentication actions, show login/register if not logged in */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outlineLight">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primarySolid">Register</Button>
                </Link>
              </>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/25 hover:border-white/45 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-semibold"
                >
                  <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white/40 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                  <span className="hidden md:inline max-w-[110px] truncate">
                    {user?.name}
                  </span>
                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* User dropdown menu with profile and logout options, showing user info in the header of the dropdown */}
                <Dropdown isOpen={userMenuOpen} align="right">
                  {/* Header with user info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-extrabold flex items-center justify-center shadow">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#073319] truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                  >
                    <FaTachometerAlt className="text-green-500 text-xs" />{" "}
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border-b border-gray-100"
                  >
                    <FaUser className="text-green-500 text-xs" /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                  >
                    <FaSignOutAlt className="text-xs" /> Logout
                  </button>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-2 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={mobileLinkClass(to)}>
              {label}
            </Link>
          ))}

          {user && (
            <div>
              <button
                onClick={() => setMobileAIOpen((p) => !p)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${mobileAIOpen ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}`}
              >
                AI Services
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${mobileAIOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${mobileAIOpen ? "max-h-44" : "max-h-0"}`}
              >
                <div className="pl-3 pt-1 pb-1 space-y-0.5">
                  {aiServiceLinks.map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <span>{icon}</span> {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {user && (
            <Link to="/community" className={mobileLinkClass("/community")}>
              Community
            </Link>
          )}
          {user && (
            <Link to="/dashboard" className={mobileLinkClass("/dashboard")}>
              Dashboard
            </Link>
          )}
          {user && (
            <Link to="/profile" className={mobileLinkClass("/profile")}>
              Profile
            </Link>
          )}
        </div>

        <div className="px-4 py-3 space-y-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapLocationDot className="text-green-600 shrink-0" />
            <span>11/A Horana, Kalutara</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosMail className="text-green-600 shrink-0" />
            <span>support@saps.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MdAddIcCall className="text-green-600 shrink-0" />
            <span>+(94)-34-567-8943</span>
          </div>
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-3 text-xl text-gray-500">
            <SocialIcon
              href="https://web.facebook.com/ishan.madusha.313"
              icon={<FaFacebookSquare />}
            />
            <SocialIcon
              href="https://www.instagram.com/ishan_madusha_"
              icon={<FaInstagramSquare />}
            />
            <SocialIcon
              href="https://github.com/PAIshanMadusha"
              icon={<FaGithub />}
            />
            <SocialIcon
              href="https://www.linkedin.com/in/ishan-madhusha-b457921ba"
              icon={<FaLinkedin />}
            />
          </div>
          <div className="flex gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Register</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="primary">Dashboard</Button>
                </Link>
                <Button variant="danger" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
