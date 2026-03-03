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

// Protected pages
import DashboardPage from "./pages/DashboardPage";
import AIServicesPage from "./pages/AIServicesPage";
import CropPage from "./pages/CropPage";
import FertilizerPage from "./pages/FertilizerPage";
import DiseasePage from "./pages/DiseasePage";
import CommunityPage from "./pages/CommunityPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";

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
      </Routes>
    </>
  );
}

export default App;
