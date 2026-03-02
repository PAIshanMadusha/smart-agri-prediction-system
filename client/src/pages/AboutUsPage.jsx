// Importing necessary components and data for the About Us page
import AboutHero from "../components/About/AboutHero";
import WhoWeAre from "../components/About/WhoWeAre";
import CoreValues from "../components/About/CoreValues";
import Timeline from "../components/About/Timeline";
import TeamSection from "../components/About/TeamSection";
import Testimonial from "../components/About/Testimonial";
import CTASection from "../components/About/CTASection";

// The AboutUsPage component composes all the sections of the About Us page, providing a comprehensive overview of our company, mission, values, milestones, team, and testimonials. It uses a consistent design language and layout to create an engaging and informative experience for visitors who want to learn more about our work and impact in the agricultural technology space.
export default function AboutUsPage() {
  return (
    <div className="bg-[#deffe8] text-[#073319] overflow-x-hidden">
      <AboutHero />
      <WhoWeAre />
      <CoreValues />
      <Timeline />
      <TeamSection />
      <Testimonial />
      <CTASection />
    </div>
  );
}
