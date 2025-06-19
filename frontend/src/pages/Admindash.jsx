import React, { useState, useEffect } from 'react';
import { Search, Bell, BarChart2, Users, Briefcase, UserCheck, Calendar, DollarSign, AlertCircle, Smile, Frown, Meh, Zap, Battery, Filter, TrendingUp, Activity } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000/api';

const AdminDash = () => {
  // États pour stocker les données du tableau de bord
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalClients: 0,
    totalProjects: 0,
    activeClients: 0,
    projectsInProgress: 0,
    completedProjects: 0,
    cancelledProjects: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    urgentTasks: 0
  });

  // États pour les humeurs
  const [moodData, setMoodData] = useState({
    taskMoods: [],
    dailyMoods: [],
    moodStats: {
      excellent: 0,
      bon: 0,
      neutre: 0,
      stresse: 0,
      epuise: 0
    }
  });
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour faire des appels API
  const fetchAPI = async (endpoint, params = {}) => {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de l'appel API ${endpoint}:`, error);
      throw error;
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les statistiques générales
        const statsData = await fetchAPI('/dashboard/stats');
        setStats(statsData);
        
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const employeesData = await fetchAPI('/dashboard/employees');
        setEmployees(employeesData);
      } catch (err) {
        console.error('Erreur lors du chargement des employés:', err);
      }
    };
    
    fetchDashboardData();
    fetchEmployees();
  }, []);

  // Charger les données d'humeur quand les filtres changent
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const params = {
          employee_id: selectedEmployee,
          period: selectedPeriod
        };

        // Récupérer les humeurs par tâche et journalières en parallèle
        const [taskMoodsData, dailyMoodsData, moodStatsData] = await Promise.all([
          fetchAPI('/dashboard/task-moods', params),
          fetchAPI('/dashboard/daily-moods', params),
          fetchAPI('/dashboard/mood-stats', params)
        ]);

        setMoodData({
          taskMoods: taskMoodsData,
          dailyMoods: dailyMoodsData,
          moodStats: moodStatsData
        });

      } catch (err) {
        console.error('Erreur lors du chargement des humeurs:', err);
      }
    };
    
    fetchMoodData();
  }, [selectedEmployee, selectedPeriod]);

  // Filtrer les données selon les critères sélectionnés
  const filteredTaskMoods = moodData.taskMoods.filter((mood) => {
    if (selectedEmployee !== 'all' && mood.user_id !== parseInt(selectedEmployee)) return false;
    return true;
  });

  const filteredDailyMoods = moodData.dailyMoods.filter((mood) => {
    if (selectedEmployee !== 'all' && mood.user_id !== parseInt(selectedEmployee)) return false;
    return true;
  });

  // Fonction pour obtenir l'icône selon l'humeur
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'excellent': return <Smile className="text-green-500" size={20} />;
      case 'bon': return <Smile className="text-blue-500" size={20} />;
      case 'neutre': return <Meh className="text-yellow-500" size={20} />;
      case 'stresse': return <Frown className="text-orange-500" size={20} />;
      case 'epuise': return <Battery className="text-red-500" size={20} />;
      default: return <Meh className="text-gray-500" size={20} />;
    }
  };

  // Fonction pour obtenir la couleur selon l'humeur
  const getMoodColor = (mood) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'bon': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'neutre': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stresse': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'epuise': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar à gauche */}
      <div>
        <Sidebarmenu />
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1">
        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center bg-white shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord - Suivi des humeurs</h1>
            <p className="text-gray-600 text-sm mt-1">Surveillance du bien-être des employés</p>
          </div>
          <div className="flex items-center">
           
            <div className="relative mr-4">
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
            </div>
            <button className="h-10 w-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
              A
            </button>
          </div>
        </header>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <div className="text-lg text-gray-600 ml-4">Chargement des données...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">Erreur: {error}</div>
          </div>
        ) : (
          <div className="p-6">
            {/* Vue d'ensemble rapide */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Employés" 
                value={stats.totalEmployees} 
                icon={<Users size={20} />}
                color="purple"
              />
              <StatCard 
                title="Total Clients" 
                value={stats.totalClients} 
                icon={<UserCheck size={20} />}
                color="blue"
              />
              <StatCard 
                title="Projets Actifs" 
                value={stats.projectsInProgress} 
                icon={<Briefcase size={20} />}
                color="green"
              />
              <StatCard 
                title="Tâches Urgentes" 
                value={stats.urgentTasks} 
                icon={<AlertCircle size={20} />}
                color="red"
              />
            </div>

            {/* Section principale - Humeurs des Employés */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                    <Activity className="mr-2 text-purple-600" size={28} />
                    Analyse des Humeurs des Employés
                  </h2>
                  <p className="text-gray-600 mt-1">Suivi du bien-être et de la motivation de l'équipe</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-500" size={20} />
                  <span className="text-sm text-gray-600">Filtres actifs</span>
                </div>
              </div>
              
              {/* Filtres avancés */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employé</label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2 px-3"
                    >
                      <option value="all">Tous les employés</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de feedback</label>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2 px-3"
                    >
                      <option value="all">Tous les types</option>
                      <option value="tasks">Humeurs par tâche</option>
                      <option value="daily">Humeurs journalières</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2 px-3"
                    >
                      <option value="today">Aujourd'hui</option>
                      <option value="week">Cette semaine</option>
                      <option value="month">Ce mois</option>
                      <option value="all">Toute la période</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Statistiques des humeurs en cartes visuelles */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <MoodStatCard mood="excellent" count={moodData.moodStats.excellent} total={Object.values(moodData.moodStats).reduce((a, b) => a + b, 0)} />
                <MoodStatCard mood="bon" count={moodData.moodStats.bon} total={Object.values(moodData.moodStats).reduce((a, b) => a + b, 0)} />
                <MoodStatCard mood="neutre" count={moodData.moodStats.neutre} total={Object.values(moodData.moodStats).reduce((a, b) => a + b, 0)} />
                <MoodStatCard mood="stresse" count={moodData.moodStats.stresse} total={Object.values(moodData.moodStats).reduce((a, b) => a + b, 0)} />
                <MoodStatCard mood="epuise" count={moodData.moodStats.epuise} total={Object.values(moodData.moodStats).reduce((a, b) => a + b, 0)} />
              </div>

              {/* Grille des tableaux d'humeurs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tableau des humeurs par tâche */}
                {(selectedFilter === 'all' || selectedFilter === 'tasks') && (
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Briefcase className="mr-2 text-blue-600" size={20} />
                        Humeurs par Tâche
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Feedback des employés sur leurs tâches</p>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tâche</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humeur</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTaskMoods.map((mood, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-purple-600 font-medium text-sm">
                                      {mood.employee_name?.charAt(0) || 'E'}
                                    </span>
                                  </div>
                                  <span className="ml-2 text-sm font-medium text-gray-900">
                                    {mood.employee_name || 'Employé inconnu'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{mood.task_name || 'Tâche inconnue'}</div>
                                  <div className="text-xs text-gray-500">{mood.project_name || 'Projet inconnu'}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getMoodColor(mood.mood)}`}>
                                  {getMoodIcon(mood.mood)}
                                  <span className="ml-1 capitalize">{mood.mood}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                                <div className="truncate" title={mood.comment || 'Aucun commentaire'}>
                                  {mood.comment || '-'}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(mood.created_at).toLocaleDateString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                            </tr>
                          ))}
                          {filteredTaskMoods.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                Aucune humeur par tâche trouvée
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tableau des humeurs par jour */}
                {(selectedFilter === 'all' || selectedFilter === 'daily') && (
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Calendar className="mr-2 text-green-600" size={20} />
                        Humeurs Journalières
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">État d'esprit quotidien des employés</p>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humeur</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredDailyMoods.map((mood, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-600 font-medium text-sm">
                                      {mood.employee_name?.charAt(0) || 'E'}
                                    </span>
                                  </div>
                                  <span className="ml-2 text-sm font-medium text-gray-900">
                                    {mood.employee_name || 'Employé inconnu'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getMoodColor(mood.mood)}`}>
                                  {getMoodIcon(mood.mood)}
                                  <span className="ml-1 capitalize">{mood.mood}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                                <div className="truncate" title={mood.comment || 'Aucun commentaire'}>
                                  {mood.comment || '-'}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(mood.date).toLocaleDateString('fr-FR')}
                              </td>
                            </tr>
                          ))}
                          {filteredDailyMoods.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                Aucune humeur journalière trouvée
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Résumé des tendances */}
              <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <TrendingUp className="mr-2 text-purple-600" size={20} />
                  Tendances et Alertes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="text-red-500 mr-2" size={20} />
                      <span className="text-red-800 font-medium">Attention requise</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      {moodData.moodStats.epuise + moodData.moodStats.stresse} signalements de stress ou épuisement
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Meh className="text-yellow-500 mr-2" size={20} />
                      <span className="text-yellow-800 font-medium">Humeur neutre</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      {moodData.moodStats.neutre} employés en humeur neutre
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Smile className="text-green-500 mr-2" size={20} />
                      <span className="text-green-800 font-medium">Moral positif</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      {moodData.moodStats.excellent + moodData.moodStats.bon} signalements positifs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour les statistiques d'humeur avec pourcentage
const MoodStatCard = ({ mood, count, total }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'excellent': return <Smile className="text-green-500" size={24} />;
      case 'bon': return <Smile className="text-blue-500" size={24} />;
      case 'neutre': return <Meh className="text-yellow-500" size={24} />;
      case 'stresse': return <Frown className="text-orange-500" size={24} />;
      case 'epuise': return <Battery className="text-red-500" size={24} />;
      default: return <Meh className="text-gray-500" size={24} />;
    }
  };

  const getMoodBg = (mood) => {
    switch (mood) {
      case 'excellent': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'bon': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'neutre': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'stresse': return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'epuise': return 'bg-red-50 border-red-200 hover:bg-red-100';
      default: return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className={`${getMoodBg(mood)} border rounded-lg p-4 text-center transition-all duration-200 hover:shadow-md`}>
      <div className="flex justify-center mb-2">
        {getMoodIcon(mood)}
      </div>
      <div className="text-2xl font-bold text-gray-700">{count}</div>
      <div className="text-sm text-gray-600 capitalize mb-1">{mood}</div>
      <div className="text-xs text-gray-500">{percentage}%</div>
    </div>
  );
};

// Carte de statistique composant
const StatCard = ({ title, value, icon, color }) => {
  const bgColors = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    pink: 'bg-pink-100 text-pink-600'
  };
  
  const textColors = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    pink: 'text-pink-600'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`${bgColors[color]} p-3 rounded-full mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className={`text-2xl font-bold ${textColors[color]} mt-1`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDash;