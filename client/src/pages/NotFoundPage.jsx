import { Link } from "react-router-dom";

// NotFoundPage component to display a user-friendly 404 error page
function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-green-600 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Page Not Found!
          </h2>
        </div>
        <p className="text-gray-600 leading-relaxed">
          The page you are looking for might have been removed, renamed, or is
          temporarily unavailable. Please check the URL or return to homepage.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            to="/"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium
        shadow-md hover:bg-green-700 hover:shadow-lg transition duration-300"
          >
            Return Home
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium
        hover:border-green-500 hover:text-green-600 transition duration-300"
          >
            Contact Support
          </Link>
        </div>
        <p className="text-sm text-gray-400 pt-4">
          If you believe this is a mistake, please contact system administrator.
        </p>
      </div>
    </div>
  );
}

export default NotFoundPage;
