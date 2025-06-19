import React, { useState } from 'react';

const Faq = () => {
    // État pour gérer les questions/réponses
    const [faq, setFaq] = useState([
        {
            question: 'Taskify est-il vraiment gratuit ?',
            answer: 'Oui ! Taskify propose un plan gratuit incluant les fonctionnalités essentielles : gestion de tâches, CRM léger, mood tracking, et facturation simple. Des options premium sont disponibles pour aller plus loin.',
            open: false
        },
        {
            question: 'À qui s’adresse Taskify ?',
            answer: 'Taskify est conçu pour les freelances, indépendants, petites équipes, micro-entreprises, coachs et consultants. Pas besoin d’être un expert en gestion de projet pour l’utiliser !',
            open: false
        },
        {
            question: 'Dois-je installer un logiciel pour utiliser Taskify ?',
            answer: 'Non, Taskify est 100% en ligne. Vous pouvez l’utiliser depuis votre navigateur, que vous soyez sur ordinateur, tablette ou mobile.',
            open: false
        },
        {
            question: ' Mes données sont-elles sécurisées ?',
            answer: 'Oui. Nous accordons une grande importance à la confidentialité et à la sécurité. Vos données sont stockées de manière sécurisée et ne seront jamais partagées sans votre consentement.',
            open: false
        }
    ]);

    // Fonction pour basculer l'état d'une FAQ
    const toggleFaq = (index) => {
        setFaq(faq.map((item, i) => {
            if (i === index) {
                return { ...item, open: !item.open };
            } else {
                return { ...item, open: false }; // Ferme les autres items
            }
        }));
    }

    return (
        <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                {/* En-tête */}
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-bold leading-tight text-[#9c28b1] sm:text-4xl lg:text-5xl">
                        FAQ
                    </h2>
                   
                </div>

                {/* Liste des FAQ */}
                <div className="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
                    {faq.map((item, index) => (
                        <div 
                            key={index} 
                            className="transition-all duration-200 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            <button 
                                type="button" 
                                className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={item.open}
                                aria-controls={`faq-content-${index}`}
                            >
                                <span className="text-lg font-semibold text-left text-black">
                                    {item.question}
                                </span>

                                {/* Icône flèche */}
                                <svg 
                                    className={`w-6 h-6 text-gray-400 transform transition-transform ${item.open ? 'rotate-180' : ''}`} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth="2" 
                                        d="M19 9l-7 7-7-7" 
                                    />
                                </svg>
                            </button>

                            {/* Contenu de la réponse */}
                            <div 
                                id={`faq-content-${index}`}
                                className={`${item.open ? 'block' : 'hidden'} px-4 pb-5 sm:px-6 sm:pb-6`}
                            >
                                {/* Utilisation de dangerouslySetInnerHTML pour le HTML intégré */}
                                <div 
                                    className="prose text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

              
            </div>
        </section>
    );
}

export default Faq;