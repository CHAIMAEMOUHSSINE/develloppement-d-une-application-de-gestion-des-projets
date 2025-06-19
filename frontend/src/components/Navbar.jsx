import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
              <Link to="/HomePage"> <div class=" font-bold text-4xl text-[#d22c6e]">T<span class="text-[#9c28b1]">askify</span></div> </Link>
        
        <div className="hidden md:flex space-x-8">
        <Link to="/whyus" className="text-gray-800 text-lg hover:text-[#9c28b1] ">Pourquoi Nous</Link>
          <Link to="/Pricing" className="text-gray-800 text-lg hover:text-[#9c28b1] ">Prix</Link>
        </div>
        <div className="flex space-x-4">
        <Link to="/Login" className="px-4 py-2 text-[#d22c6e] font-bold  border-2 rounded-full border-[#d22c6e] hover:text-[#d22c6e] ">Se connecter</Link>
           <Link to="/Signup" className="px-4 py-2 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e] ">S'inscrire</Link>
        </div>
      </nav>
  );
};

export default Navbar;