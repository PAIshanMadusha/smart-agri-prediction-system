// Importing necessary components and data for the Services page
import ServicesHero from "../components/services/ServicesHero";
import ServiceExplorer from "../components/services/ServiceExplorer";
import ComparisonSection from "../components/services/ComparisonSection";
import PlatformFeaturesSection from "../components/services/PlatformFeaturesSection";
import ServicesCTA from "../components/services/ServicesCTA";

// The ServicesPage component composes all the sections of the Services page, providing an overview of our AI tools, how they work, their unique features, and a call-to-action for users to get started. It uses a consistent design language and layout to create an engaging and informative experience for visitors interested in exploring our agricultural technology solutions.
function ServicesPage() {
  return (
    <div className="bg-[#deffe8] text-[#073319] overflow-x-hidden">
      <ServicesHero />
      <ServiceExplorer />
      <ComparisonSection />
      <PlatformFeaturesSection />
      <ServicesCTA />
    </div>
  );
}

export default ServicesPage;
