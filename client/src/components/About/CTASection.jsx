import { FaArrowRightLong } from "react-icons/fa6";
import FadeIn from "../common/FadeIn";
import { Link } from "react-router-dom";

// This component displays a call-to-action section on the About page, encouraging users to take the next step in engaging with our platform. It features a compelling headline, a supportive subheading, and a prominent button that directs users to the registration page, all styled with a vibrant background and engaging design elements to maximize conversion.
function CTASection() {
  return (
    <section className="py-10 bg-green-600 text-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to make smarter farming decisions?
          </h2>
          <p className="text-green-100/80 mb-8 text-base max-w-xl mx-auto">
            Explore how AI-powered insights can improve your agricultural
            outcomes.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-7 py-3 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5 text-sm"
          >
            Get Started <FaArrowRightLong />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

export default CTASection;
