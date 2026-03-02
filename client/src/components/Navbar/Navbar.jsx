// Navbar component with responsive design, scroll effects, and route-aware menu state
import { useState, useEffect, useTransition } from "react";
import { FaMapLocationDot, FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdAddIcCall } from "react-icons/md";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import ContactInfoItem from "./ContactInfoItem";
import Logo from "../../assets/leaf_favicon.png";
import SocialIcon from "./SocialIcon";
import Button from "../Button/Button";

// Navigation links data for easy management and scalability
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact Us" },
];

// Main Navbar component
function Navbar() {
  // State for mobile menu and scroll detection
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, startTransition] = useTransition();
  const location = useLocation();

  // Scroll effect to add shadow when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change with a smooth transition
  useEffect(() => {
    startTransition(() => {
      setMenuOpen(false);
    });
  }, [location]);

  // Main return with structured JSX for desktop and mobile views, utilizing Tailwind CSS for styling and responsiveness
  return (
    <nav
      className={`w-full sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      {/* Upper Navbar with logo, contact info, and social icons */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-0 py-2 flex items-center justify-between">
          {/* Logo and Title */}
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
            <div className="leading-tight">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 group-hover:text-green-800 transition whitespace-nowrap">
                Smart Agri Prediction
              </h1>
            </div>
          </Link>

          {/* Contact Info and Social Icons for desktop, and menu toggle for mobile */}
          <div className="flex items-center gap-6">
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

            {/* Social Icons hidden on mobile */}
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

            {/* Mobile menu toggle button */}
            <button
              className="sm:hidden text-green-700 text-2xl p-1 focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <HiX /> : <HiMenuAlt3 />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Links for desktop */}
      <div className="bg-green-600 text-white hidden sm:block">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center py-3">
          <div className="flex gap-4 md:gap-6 font-medium text-sm md:text-base">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative pb-0.5 transition-colors duration-200 hover:text-green-100 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all after:duration-200 ${
                  location.pathname === to
                    ? "text-white after:w-full"
                    : "after:w-0 hover:after:w-full"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Authentication Links for desktop */}
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outlineLight">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primarySolid">Register</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu with navigation links, contact info, and social icons, all with smooth transitions */}
      <div
        className={`sm:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                location.pathname === to
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile contact info shown when menu is open */}
        <div className="px-4 pb-3 space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMapLocationDot className="text-green-600" />
            <span>11/A Horana, Kalutara</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IoIosMail className="text-green-600" />
            <span>support@saps.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MdAddIcCall className="text-green-600" />
            <span>+(94)-34-567-8943</span>
          </div>
        </div>

        {/* Mobile social icons shown when menu is open */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between">
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

          {/* Authentication Links for mobile */}
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
