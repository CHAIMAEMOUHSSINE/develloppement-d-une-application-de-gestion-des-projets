import React from 'react';
import Navbar from '../components/Navbar';
import Testimonials from '../components/Testimonials';
import Faq from '../components/FAQ';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
     <Navbar/>

      {/*////////////////////////////////////////////////////////////////////////////////////////////////*/}
      <section className="py-20 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Partie gauche (Texte) */}
    <div className="text-left">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Taskify : Gérez vos projets autrement
        <br />
        Simple, <span className='text-[#9c28b1]'>humain</span> et abordable
      </h1>
      <p className="text-xl text-gray-600 mb-8">
      Une plateforme intuitive de gestion de projet, clients et facturation, pensée pour les freelances et les petites équipes. Avec Taskify, gardez le cap tout en prenant soin de votre bien-être.
      </p>
                    <Link to="/Login"  type="submit" className="px-8 py-3 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e] " >Commencer</Link>
      
    </div>

    <div className="flex justify-center">
      <img 
        src="src\IMAGES\0de91f3f7a1fceaf855581c6bca5f66d.jpg" 
        alt="Illustration Taskify"
        className="w-full  rounded-lg shadow-xl"
      />
    </div>
  </div>
</section>

{/*////////////////////////////////////////////////////////////////////////////////////////////////*/}

      <section className="py-16 px-6 text-center bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-6"> Tout ce dont vous avez besoin, rien de plus </h2>
  
    <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center mt-8">
      {/* Première colonne */}
      <div className="mx-16">
        <p className="text-black font-jost font-semibold mt-4 text-6xl">01</p>
        <p className="text-black font-jost font-bold mt-4 text-md">Gestion de projet simplifiée</p>
        <hr className="my-4 border-b-2 border-[#d22c6e] w-12" />
        <p className="text-black font-jost font-semibold mt-4 text-md">
        Créez, assignez et suivez vos tâches sans complexité.
        </p>
      </div>

      {/* Deuxième colonne */}
      <div className="mx-4">
        <p className="text-[#9c28b1] font-jost font-semibold mt-4 text-6xl">02</p>
        <p className="text-black font-jost font-bold mt-4 text-md">Gestion des clients efficace</p>
        <hr className="my-4 border-b-2 border-[#d22c6e] w-12" />
        <p className="text-black font-jost font-semibold mt-4 text-md">
        Gardez vos contacts, projets clients et échanges centralisés.
        </p>
      </div>

      {/* Troisième colonne */}
      <div className="mx-16">
        <p className="text-black font-jost font-semibold mt-4 text-6xl">03</p>
        <p className="text-black font-jost font-bold mt-4 text-md">Facturation intégrée</p>
        <hr className="my-4 border-b-2 border-[#d22c6e] w-12" />
        <p className="text-black font-jost font-semibold mt-4 text-md">
        Gérez vos factures en quelques clics.
        </p>
      </div>
    </div>
    <div  className="mt-16">
    <Link to="/Login"  type="submit" className="px-8 py-3 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e] " >Commencer</Link>
    </div>

      </section>

{/*////////////////////////////////////////////////////////////////////////////////////////////////*/}
   
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Pourquoi Taskify ?
          </h2>
          <p className="text-xl text-gray-600">
          Les outils classiques sont souvent trop complexes ou trop chers pour les petites structures. Taskify vous offre une alternative :
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto ">
  {[
    { 
      image: "src/IMAGES/solution.png", 
      title: "Simplicité d'utilisation",
      description: "Interface intuitive conçue pour tous les niveaux" 
    },
    { 
      image: "src/IMAGES/outil-plume.png",
      title: "Outils essentiels", 
      description: "Fonctionnalités clés sans surcharge inutile" 
    },
    { 
      image: "src/IMAGES/regulation-emotionnelle.png",
      title: "Bien-être émotionnel", 
      description: "Intégration des aspects humains dans la productivité" 
    }
  ].map((feature, index) => (
    <div key={index} className="bg-white border-2 rounded-full border-[#d22c6e] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      {feature.image && (
      <img 
      className="w-16 h-16 mb-4 object-contain mx-auto"
      src={feature.image} 
      alt={feature.title}
    />
      )}
      <h3 className="text-xl font-semibold text-[#9c28b1] mb-3 flex justify-center">{feature.title}</h3>
      <p className="text-gray-600 ">{feature.description}</p>
    </div>
  ))}
</div>
      </section>

{/*////////////////////////////////////////////////////////////////////////////////////////////////*/}


     <Testimonials/>
     
   {/*////////////////////////////////////////////////////////////////////////////////////////////////*/}

     <section className="py-20 px-6 ">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Partie gauche (Texte) */}
    <div className="text-left">
      <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
        Pour qui ?
       </h3>
      <p className="text-xl text-gray-600 mb-8">
      Conçu pour :<br/>
Freelances/

Petites équipes/

Agences créatives/

Consultants/

Coachs & formateurs/

Startups en démarrage.   </p>
<Link to="/Login"  type="submit" className="px-8 py-3 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e]" >Commencer</Link>

    </div>

    <div className="flex justify-center">
      <img 
        src="src\IMAGES\Untitled design (7).png" 
        alt="Illustration Taskify"
        className="w-full  rounded-lg shadow-xl"
      />
    </div>
  </div>
</section>
   {/*////////////////////////////////////////////////////////////////////////////////////////////////*/}

      <Faq/>

         {/*////////////////////////////////////////////////////////////////////////////////////////////////*/}

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomePage;