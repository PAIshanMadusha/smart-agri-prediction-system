// A reusable component to display contact information with an icon, title, and text
function ContactInfoItem({ icon, title, text }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 transition duration-300">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{text}</p>
      </div>
    </div>
  );
}

export default ContactInfoItem;
