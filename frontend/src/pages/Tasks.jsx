import { useState, useEffect } from 'react';
import { MoreHorizontal, ChevronRight, Download, Filter, Plus, X, Edit, Trash2 } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';
import axios from 'axios';

export default function GestionTaches() {
  // États
  const [expandedTask, setExpandedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [equipes, setEquipes] = useState([]); // Changé de managers à equipes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [taskForm, setTaskForm] = useState({
    id: '',
    name: '',
    assignedTo: '',
    project: '',
    dueDate: '',
    status: 'OUVERT',
    description: '',
    estimatedHours: 0,
    loggedHours: 0,
    labels: []
  });

  // Chargement initial des tâches, projets et équipes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Charger les tâches
        const tasksResponse = await axios.get('http://localhost:5000/api/tasks');
        setTasks(tasksResponse.data);
        
        // Charger les projets
        const projectsResponse = await axios.get('http://localhost:5000/api/projects');
        setProjects(projectsResponse.data);
        
        // Charger les équipes (remplace managers)
        const equipesResponse = await axios.get('http://localhost:5000/api/equipes');
        setEquipes(equipesResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'OUVERT': return 'bg-red-100 text-red-600';
      case 'EN COURS': return 'bg-orange-100 text-orange-600';
      case 'RÉVISION': return 'bg-blue-100 text-blue-600';
      case 'TERMINÉ': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };

  const handleLabelsChange = (e) => {
    const labels = e.target.value.split(',').map(label => label.trim());
    setTaskForm({ ...taskForm, labels });
  };

  // Ajout d'une nouvelle tâche
  const handleAddTask = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', taskForm);
      setTasks([...tasks, response.data]);
      setShowModal(false);
      resetTaskForm();
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      alert(err.response?.data?.message || "Erreur lors de l'ajout de la tâche");
    }
  };

  // Mise à jour d'une tâche
  const handleUpdateTask = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskForm.id}`, taskForm);
      setTasks(tasks.map(t => t.id === taskForm.id ? taskForm : t));
      setShowModal(false);
      resetTaskForm();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      alert(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  // Suppression d'une tâche
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        setTasks(tasks.filter(t => t.id !== taskId));
      } catch (err) {
        alert(`Erreur lors de la suppression: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  // Réinitialisation du formulaire
  const resetTaskForm = () => {
    setTaskForm({
      id: '',
      name: '',
      assignedTo: '',
      project: '',
      dueDate: '',
      status: 'OUVERT',
      description: '',
      estimatedHours: 0,
      loggedHours: 0,
      labels: []
    });
    setIsEditing(false);
  };

  // Préparation de l'édition d'une tâche
  const prepareEditTask = (task) => {
    setTaskForm({
      id: task.id,
      name: task.name,
      assignedTo: task.assignedTo,
      project: task.project,
      dueDate: task.dueDate,
      status: task.status,
      description: task.description || '',
      estimatedHours: task.estimatedHours || 0,
      loggedHours: task.loggedHours || 0,
      labels: task.labels || []
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Filtrage des tâches
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'Tous') return true;
    const statusMap = {
      'Ouvert': 'OUVERT',
      'En cours': 'EN COURS',
      'Révision': 'RÉVISION',
      'Terminé': 'TERMINÉ'
    };
    return task.status === statusMap[activeTab];
  });

  // Fonction pour récupérer le nom du projet à partir de son ID
  const getProjectNameById = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.nom : 'Non assigné';
  };

  // Fonction pour récupérer le nom du membre de l'équipe à partir de son ID
  const getEquipeMemberNameById = (memberId) => {
    const member = equipes.find(m => m.id === memberId);
    return member ? member.name : 'Non assigné';
  };

  if (loading) return (
     <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6">
        <div>Chargement en cours...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      <div className="ml-64 w-full h-screen overflow-auto bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* En-tête et boutons */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">Tâches</h1>
            <div className="flex space-x-2">
              <button 
                className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md text-sm"
                onClick={() => {
                  resetTaskForm();
                  setShowModal(true);
                }}
              >
                <Plus size={16} className="mr-1" />
                Ajouter Tâche
              </button>
            </div>
          </div>
        
          {/* Onglets */}
          <div className="flex mb-4 text-sm">
            <div className="mr-1">Afficher:</div>
            <div className="flex space-x-2">
              {['Tous', 'Ouvert', 'En cours', 'Révision', 'Terminé'].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-full ${
                    activeTab === tab ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        
          {/* Tableau des tâches */}
          <div className="bg-white rounded-lg shadow overflow-hidde">
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Nom de la tâche</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Assigné à</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Projet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Échéance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <>
                    <tr key={task.id} className={`hover:bg-gray-50 ${expandedTask === task.id ? 'bg-gray-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                            className={`mr-2 transform transition-transform ${expandedTask === task.id ? 'rotate-90' : ''}`}
                          >
                            <ChevronRight size={16} />
                          </button>
                          <span className="text-sm font-medium text-gray-900">{task.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getEquipeMemberNameById(task.assignedTo)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getProjectNameById(task.project)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                        <button 
                          onClick={() => prepareEditTask(task)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                    {expandedTask === task.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="ml-6">
                            <div className="mb-3">
                              <span className="font-medium text-gray-700">Description:</span>
                              <p className="text-gray-600 text-sm mt-1">{task.description || 'Aucune description'}</p>
                            </div>
                            
                            <div className="flex space-x-6 mb-3">
                              <div>
                                <span className="text-xs text-gray-500">Heures estimées:</span>
                                <div className="font-medium">{task.estimatedHours || 0} heures</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Heures enregistrées:</span>
                                <div className="font-medium">{task.loggedHours || 0} heures</div>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Étiquettes:</span>
                                <div className="flex space-x-1 mt-1">
                                  {task.labels && task.labels.length > 0 ? (
                                    task.labels.map(label => (
                                      <span key={label} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{label}</span>
                                    ))
                                  ) : (
                                    <span className="text-gray-400 text-xs">Aucune étiquette</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Modal pour ajouter/modifier une tâche */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {isEditing ? 'Modifier la tâche' : 'Ajouter une nouvelle tâche'}
                </h2>
                <button onClick={() => {
                  setShowModal(false);
                  resetTaskForm();
                }} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la tâche*</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={taskForm.name} 
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à*</label>
                    <select 
                      name="assignedTo" 
                      value={taskForm.assignedTo} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Sélectionner un membre d'équipe</option>
                      {equipes.map(membre => (
                        <option key={membre.id} value={membre.id}>
                          {membre.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Projet*</label>
                    <select 
                      name="project" 
                      value={taskForm.project} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Sélectionner un projet</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Échéance*</label>
                    <input 
                      type="date" 
                      name="dueDate" 
                      value={taskForm.dueDate} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut*</label>
                    <select 
                      name="status" 
                      value={taskForm.status} 
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      required
                    >
                      <option value="OUVERT">OUVERT</option>
                      <option value="EN COURS">EN COURS</option>
                      <option value="RÉVISION">RÉVISION</option>
                      <option value="TERMINÉ">TERMINÉ</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description" 
                    value={taskForm.description} 
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heures estimées</label>
                    <input 
                      type="number" 
                      name="estimatedHours" 
                      value={taskForm.estimatedHours} 
                      onChange={handleInputChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Étiquettes (séparées par des virgules)</label>
                    <input 
                      type="text" 
                      name="labels" 
                      value={taskForm.labels.join(', ')} 
                      onChange={handleLabelsChange}
                      placeholder="ex: Front-end, Urgent"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetTaskForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700"
                  >
                    Annuler
                  </button>
                  <button 
                    type="button"
                    onClick={isEditing ? handleUpdateTask : handleAddTask}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm"
                  >
                    {isEditing ? 'Modifier' : 'Ajouter'} la tâche
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}