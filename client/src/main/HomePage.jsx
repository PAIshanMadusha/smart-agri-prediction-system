// Importing necessary components for the HomePage
import HeroSection from "../components/Home/HeroSection";
import AboutUsPage from "../pages/public/AboutUsPage";
import ServicesPage from "../pages/public/ServicesPage";
import ResourcesPage from "../pages/public/ResourcesPage";
import ContactUsPage from "../pages/public/ContactUsPage";
import Footer from "../components/Footer/Footer";

// HomePage component that composes the main sections of the homepage
function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutUsPage />
      <ServicesPage />
      <ResourcesPage />
      <ContactUsPage />
      <Footer />
    </>
  );
}

export default HomePage;
