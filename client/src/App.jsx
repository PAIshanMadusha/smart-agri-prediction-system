import { Route, Routes } from "react-router-dom";

// Navbar component for site navigation
import Navbar from "./components/Navbar/Navbar";

// Public pages
import HomePage from "./main/HomePage";
import AboutUsPage from "./pages/public/AboutUsPage";
import ServicesPage from "./pages/public/ServicesPage";
import ResourcesPage from "./pages/public/ResourcesPage";
import ContactUsPage from "./pages/public/ContactUsPage";
import LoginPage /*, { ResetPasswordPage }*/ from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// ProtectedRoute component to guard routes that require authentication
import ProtectedRoute from "./routes/protected/ProtectedRoute";

// Protected pages
import DashboardPage from "./pages/protected/DashboardPage";
import AIServicesPage from "./pages/protected/AIServicesPage";
import CropPage from "./pages/protected/CropPage";
import FertilizerPage from "./pages/protected/FertilizerPage";
import DiseasePage from "./pages/protected/DiseasePage";
import CommunityPage from "./pages/protected/CommunityPage";
import HistoryPage from "./pages/protected/HistoryPage";
import ProfilePage from "./pages/protected/ProfilePage";

// NotFoundPage component
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/*<Route path="/reset-password" element={<ResetPasswordPage />} />*/}
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-services"
          element={
            <ProtectedRoute>
              <AIServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-services/crop"
          element={
            <ProtectedRoute>
              <CropPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-services/fertilizer"
          element={
            <ProtectedRoute>
              <FertilizerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-services/disease"
          element={
            <ProtectedRoute>
              <DiseasePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* NotFoundPage */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
