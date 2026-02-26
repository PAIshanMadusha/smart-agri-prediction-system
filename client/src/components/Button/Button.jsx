// A reusable Button component with multiple variants and disabled state handling
function Button({
  children,
  type = "button",
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition duration-300";

  // Define styles for different button variants
  const variants = {
    primary:
      "bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200",

    primarySolid:
      "bg-white text-green-700 text-sm font-semibold px-4 py-2 rounded hover:bg-green-50 transition-colors duration-200",

    outline:
      "border border-green-600 text-green-700 text-sm font-semibold px-4 py-2 rounded hover:bg-green-600 hover:text-white transition-colors duration-200",

    outlineLight:
      "border border-white text-white text-sm font-semibold px-4 py-2 rounded hover:bg-white hover:text-green-700 transition-colors duration-200",

    danger:
      "bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200",
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
