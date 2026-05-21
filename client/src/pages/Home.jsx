import Navbar from "../components/common/Navbar";
import Footer from '../components/common/Footer'
import HeroBanner from "../components/home/HeroBanner";
import CategorySection from "../components/home/CategorySection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PromoSection from "../components/home/PromoSection";


const Home = () => {
  return (
    <>
    <HeroBanner/>
    <CategorySection/>
    <FeaturedProducts/>
    <PromoSection/>
    <Footer/>
    </>
    
  );
};
export default Home;