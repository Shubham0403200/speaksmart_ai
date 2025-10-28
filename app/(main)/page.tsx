import CTASection from "@/components/main/cta-section";
import FAQSection from "@/components/main/faq";
import FeaturesSection from "@/components/main/feature-section";
import HeroSection from "@/components/main/hero-section";
import HowItWorks from "@/components/main/how-it-works";
import Modes from "./_components/modes";
import FeedbackComponent from "./_components/feedback-component";

const HomePage = () => {
  
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Modes />
      <FeedbackComponent />
      <FAQSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
