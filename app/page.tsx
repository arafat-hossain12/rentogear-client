import Banner from "@/components/home/Banner";
import Featured from "@/components/home/Featured";
import Categories from "@/components/home/Categories";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Reviews from "@/components/home/Reviews";
import OwnerCta from "@/components/home/OwnerCta";

export default function HomePage() {
  return (
    <>
      <Banner />
      <Featured />
      <Categories />
      <WhyChooseUs />
      <HowItWorks />
      <Reviews />
      <OwnerCta />
    </>
  );
}
