import Navbar from "../components/common/Navbar";
import Footer from '../components/common/Footer'


const Home = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-700">🏠 Home Page</h1>
    </div>
    
    <Footer/>
    </>
    
  );
};
export default Home;