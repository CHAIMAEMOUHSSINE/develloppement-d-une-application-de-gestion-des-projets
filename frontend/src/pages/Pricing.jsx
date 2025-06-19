import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';



const Pricing = () => {
  return (
    <>
    <Navbar/>
 
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tarification transparente et adaptée à vos besoins
        </h1>
        <p className="text-gray-700 mb-6 text-lg">
        Chez Taskify, on croit qu’un bon outil ne doit pas être compliqué… ni coûteux.
        C’est pourquoi nous proposons une tarification simple, sans surprise, pour vous accompagner à chaque étape de votre activité.        </p>
        
        {/* Billing Toggle */}
        <Link to="/Login"  type="submit" className="px-8 py-3 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e]" >Commencer gratuitement</Link>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pro Plan */}
        <div className="border border-gray-200 rounded-xl p-6 hover:border-[#9c28b1] transition-all">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Plan Gratuit – 0€/mois</h2>
            <p className="text-gray-600 mt-2">
            Parfait pour les freelances et les petites équipes qui démarrent.


</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500 ml-1">/mois</span>
            </div>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Gestion de tâches illimitée</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span> CRM léger</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Mood Tracking (bien-être émotionnel)</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Facturation simple</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Filtres et vues personnalisées</span>
            </li>
          </ul>
          
          <Link to="/Login"  type="submit" className="px-8 py-3 bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e]" >Commencer</Link>

        </div>

        {/* Pro Plus Plan */}
        <div className="border border-gray-200 rounded-xl p-6 hover:border-[#9c28b1] transition-all">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Plan Pro – 90€/mois/utilisateur</h2>
            <p className="text-gray-600 mt-2">
            Pour aller plus loin dans votre organisation.

</p>
         
          
          <div className="mb-6">
            <div className="flex items-end">
              <span className="text-4xl font-bold text-gray-900">$90</span>
              <span className="text-gray-500 ml-1">/mois</span>
            </div>
          </div>
            <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Automatisations (ex. rappels, affectation auto)</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Rapports et statistiques avancées</span>
            </li>
         
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Suivi de temps</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span> Support prioritaire par email</span>
            </li>
          </ul>
          </div>
          
        
          
          <button className="px-8 py-3 shadow-sm bg-[#9c28b1] font-bold text-white rounded-full hover:bg-[#d22c6e]">
            À venir
          </button>
        </div>
      </div>
    </div>
    <Footer/>

    </>
  );
};

export default Pricing;