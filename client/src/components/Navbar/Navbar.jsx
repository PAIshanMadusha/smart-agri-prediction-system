import Logo from "../../assets/leaf_favicon.png";
import { FaMapLocationDot, FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { MdAddIcCall } from "react-icons/md";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";

function Navbar() {
  return (
    <div className="shadow-md">
      {/* Upper Navbar */}
      <div className="bg-white">
        <div className="container flex justify-between items-center ">
          <div>
            <a href="#" className="font-bold text-2xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-25" /> Smart Agri
              Prediction
            </a>
          </div>
          {/* Contact Information */}
          <div className="flex">
            <div>
              <FaMapLocationDot />
              <p>Our Location</p>
              <p>11/A Horana, Kalutura</p>
            </div>
            <div>
              <IoIosMail />
              <p>Mail Us</p>
              <p>support@saps.com</p>
            </div>
            <div>
              <MdAddIcCall />
              <p>Live Help</p>
              <p>+(94)-34-567-8943</p>
            </div>
          </div>
          <div className="flex">
            <div>
              <a href="#">
                <FaFacebookSquare />
              </a>
            </div>
            <div>
              <a href="#">
                <FaInstagramSquare />
              </a>
            </div>
            <div>
              <a href="#">
                <FaGithub />
              </a>
            </div>
            <div>
              <a href="#">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Lower Navbar */}
      <div></div>
    </div>
  );
}

export default Navbar;
