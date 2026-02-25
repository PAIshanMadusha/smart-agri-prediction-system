function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition duration-300";

  const variants = {
    primary:
      "px-4 py-1 rounded-md bg-white text-green-600 hover:bg-gray-200 transition duration-300",

    outline:
      "px-4 py-1 rounded-md text-white border border-gray-300 hover:text-white-900 hover:border-gray-400 transition duration-300",

    danger:
      "px-4 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}

export default Button;
