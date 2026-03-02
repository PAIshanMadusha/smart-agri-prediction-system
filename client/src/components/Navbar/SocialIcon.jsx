// A reusable component to display a social media icon with a link
function SocialIcon({ icon, href = "#" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
    >
      {icon}
    </a>
  );
}

export default SocialIcon;
