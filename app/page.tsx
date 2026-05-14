import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoriesShowcase from "@/components/CategoriesShowcase";
import WhyCNA from "@/components/WhyCNA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CategoriesShowcase />
      <WhyCNA />
      <Footer />
    </main>
  );
}
