import { Route, Routes } from "react-router-dom";

// Navbar component for site navigation
import Navbar from "./components/Navbar/Navbar";

// Public pages
import HomePage from "./main/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import ServicesPage from "./pages/ServicesPage";
import ResourcesPage from "./pages/ResourcesPage";
import ContactUsPage from "./pages/ContactUsPage";
import LoginPage /*, { ResetPasswordPage }*/ from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// ProtectedRoute component to guard routes that require authentication
import ProtectedRoute from "./routes/protected/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/*<Route path="/reset-password" element={<ResetPasswordPage />} />*/}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
