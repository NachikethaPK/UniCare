import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import Features from "../../components/home/Features";
import Services from "../../components/home/Services";
import Footer from "../../components/layout/Footer";


function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Footer />
    </>
  );
}

export default Home;