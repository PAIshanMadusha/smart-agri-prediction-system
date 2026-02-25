import Logo from "../../assets/leaf_favicon.png";
import { FaMapLocationDot, FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdAddIcCall } from "react-icons/md";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import SocialIcon from "./SocialIcon";
import ContactInfoItem from "./ContactInfoItem";

function Navbar() {
  return (
    <nav className="w-full shadow-sm">
      {/* Upper Navbar */}
      <div className="bg-white py-2">
        <div className="container flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition duration-300 mr-5"
          >
            <div
              className="flex items-center justify-center 
                  shadow-2xl rounded-full group-hover:shadow-md 
                  transition duration-300"
            >
              <img src={Logo} alt="Logo" className="w-16 h-16" />
            </div>

            <div className="leading-tight">
              <h1 className="text-2xl font-bold text-green-600 group-hover:text-green-800 transition">
                Smart Agri Prediction
              </h1>
            </div>
          </Link>

          {/* Contact Info */}
          <div className="hidden md:grid md:grid-cols-3 gap-2 text-sm text-gray-600">
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

          {/* Social Icons */}
          <div className="flex gap-3 text-xl text-gray-600">
            <SocialIcon icon={<FaFacebookSquare />} />
            <SocialIcon icon={<FaInstagramSquare />} />
            <SocialIcon icon={<FaGithub />} />
            <SocialIcon icon={<FaLinkedin />} />
          </div>
        </div>
      </div>

      {/* Lower Navbar */}
      <div className="bg-green-600 text-white">
        <div className="container flex justify-between items-center py-3">
          <div className="flex gap-6 font-medium">
            <Link to="/" className="hover:text-gray-200">
              Home
            </Link>
            <Link to="/about" className="hover:text-gray-200">
              About Us
            </Link>
            <Link to="/services" className="hover:text-gray-200">
              Services
            </Link>
            <Link to="/resources" className="hover:text-gray-200">
              Resources
            </Link>
            <Link to="/contact" className="hover:text-gray-200">
              Contact Us
            </Link>
          </div>

          <div className="flex gap-4">
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
