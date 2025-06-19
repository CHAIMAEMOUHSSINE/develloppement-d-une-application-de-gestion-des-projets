import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link} from 'react-router-dom';

const Whyus = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">

     <Navbar/>
     
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Pourquoi choisir Taskify ?
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
        Parce que vous méritez une solution simple, humaine et accessible.
        </p>
        <Link to="/Login"  type="submit" className="px-8 py-3 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e]" >Commencer gratuitement</Link>

        <div className="mt-16 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl">
           <img 
        src="src\IMAGES\0de91f3f7a1fceaf855581c6bca5f66d.jpg" 
        alt="Illustration Taskify"
        className="w-full rounded-lg shadow-xl"
      />
          
        </div>
    
    
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-16">
      Une approche différente de la gestion de projet
        </h2>  
        <p className="text-xl text-gray-600 max-w-2xl mt-8 mx-auto ">
        Contrairement aux grandes plateformes trop complexes, Taskify vous offre une solution :
        </p>


      </section>
      
     {/* Features Section */}
<section className="container mx-auto px-6 py-12">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
    {/* Feature 1 */}
    <div className="relative bg-cover bg-center p-6 rounded-lg h-64 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
      <div className="absolute inset-0 bg-purple-900 opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-xl font-semibold mb-2 flex justify-center">Ciblée</h3>
        <p className=" flex justify-center">juste les outils qu'il vous faut (tâches, CRM, factures)</p>
      </div>
    </div>
    
    {/* Feature 2 */}
    <div className="relative bg-cover bg-center p-6 rounded-lg h-64 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
      <div className="absolute inset-0 bg-purple-900 opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-xl font-semibold mb-2 flex justify-center">Équilibrée</h3>
        <p className=" flex justify-center">performance + bien-être émotionnel</p>
      </div>
    </div>
    
    {/* Feature 3 */}
    <div className="relative bg-cover bg-center p-6 rounded-lg h-64 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
      <div className="absolute inset-0 bg-purple-900 opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-xl font-semibold mb-2 flex justify-center">Intelligente</h3>
        <p className=" flex justify-center">design intuitif, zéro prise de tête</p>
      </div>
    </div>
    
    {/* Feature 4 */}
    <div className="relative bg-cover bg-center p-6 rounded-lg h-64 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')" }}>
      <div className="absolute inset-0 bg-purple-900 opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
      <div className="relative z-10 text-white">
        <h3 className="text-xl font-semibold mb-2 flex justify-center">Flexible</h3>
        <p className=" flex justify-center">un modèle freemium pour commencer sans risque</p>
      </div>
    </div>
  </div>
</section>
      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Whyus;