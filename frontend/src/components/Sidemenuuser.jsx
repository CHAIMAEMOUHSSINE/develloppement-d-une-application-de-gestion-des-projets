import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Sidemenuuser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    
    // Fonction de déconnexion
    const handleLogout = async () => {
        try {
            // Appel à l'API de déconnexion
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Important pour inclure les cookies
            });

            const data = await response.json();

            if (data.success) {
                // Supprimer les données locales
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('userRole');
                
                // Supprimer les cookies côté client si nécessaire
                document.cookie.split(";").forEach((c) => {
                    const eqPos = c.indexOf("=");
                    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                });

                // Rediriger vers la page d'accueil
                navigate('/HomePage', { replace: true });
                
                // Empêcher le retour avec le bouton précédent
                window.history.pushState(null, '', window.location.href);
            } else {
                console.error('Erreur lors de la déconnexion:', data.message);
                // Même en cas d'erreur, on peut forcer la déconnexion côté client
                localStorage.clear();
                navigate('/HomePage', { replace: true });
            }
        } catch (error) {
            console.error('Erreur réseau lors de la déconnexion:', error);
            // En cas d'erreur réseau, forcer la déconnexion côté client
            localStorage.clear();
            navigate('/HomePage', { replace: true });
        }
    };

    // Empêcher le retour en arrière après déconnexion
    useEffect(() => {
        const handlePopState = () => {
            const token = localStorage.getItem('token');
            if (!token && currentPath !== '/HomePage') {
                navigate('/HomePage', { replace: true });
            }
        };

        window.addEventListener('popstate', handlePopState);
        
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate, currentPath]);
        
    return (
        <div className="flex flex-1 bg-gray-50">
            <div className="hidden md:flex md:w-64 md:flex-col">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white">
                    <div className="flex items-center flex-shrink-0 px-4">
                    <Link to="/HomePage"> <div className="font-bold text-4xl text-[#d22c6e]">T<span className="text-[#9c28b1]">askify</span></div> </Link>
                    </div>

                    <div className="px-4 mt-6">
                        <hr className="border-gray-200" />
                    </div>

                    <div className="flex flex-col flex-1 px-3 mt-6">
                        <div className="space-y-4">
                            <nav className="flex-1 space-y-2">
                                {/* Utilisation de currentPath pour déterminer l'état actif */}
                                <div className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                                    currentPath === "/Taskse" 
                                    ? "bg-[#9c28b1] text-white" 
                                    : "text-gray-900 hover:bg-[#9c28b1] hover:text-white"
                                }`}>
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <Link to="/TasksEmployeePage" className="w-full">Tâches</Link>
                                </div>

                                <div className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                                    currentPath === "/Documents" 
                                    ? "bg-[#9c28b1] text-white" 
                                    : "text-gray-900 hover:bg-[#9c28b1] hover:text-white"
                                }`}>
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <Link to="/Documents" className="w-full">Documents</Link>
                                </div>

                                <div className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                                    currentPath === "/Notes" 
                                    ? "bg-[#9c28b1] text-white" 
                                    : "text-gray-900 hover:bg-[#9c28b1] hover:text-white"
                                }`}>
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <Link to="/Notes" className="w-full">Notes</Link>
                                </div>

                                <div className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                                    currentPath === "/Whiteboard" 
                                    ? "bg-[#9c28b1] text-white" 
                                    : "text-gray-900 hover:bg-[#9c28b1] hover:text-white"
                                }`}>
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <Link to="/Whiteboard" className="w-full">Tableau blanc</Link>
                                </div>
                            </nav>

                            <hr className="border-gray-200" />

                            <hr className="border-gray-200" />

                            <nav className="flex-1 space-y-2">
                                <div className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group ${
                                    currentPath === "/Settings" 
                                    ? "bg-[#9c28b1] text-white" 
                                    : "text-gray-900 hover:bg-[#9c28b1] hover:text-white"
                                }`}>
                                    <svg className="flex-shrink-0 w-5 h-5 mr-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <Link to="/Settings" className="w-full">Paramètres</Link>
                                </div>
                                
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-3 mt-2 text-sm font-medium text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    <svg className="w-5 h-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Déconnexion
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <main>
                    <div className="py-6">
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                            {/* Le contenu sera injecté par le composant parent */}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Sidemenuuser;