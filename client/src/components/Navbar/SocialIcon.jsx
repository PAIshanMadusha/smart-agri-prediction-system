{
  /* Social Icon Component for the Navbar */
}
function SocialIcon({ icon }) {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
      {icon}
    </div>
  );
}

export default SocialIcon;
