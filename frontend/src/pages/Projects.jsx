import React, { useState, useEffect } from 'react';
import { Search, Bell, X, Download, File, Users, FileText, Trash2, Edit, Send, Mail } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';

const ProjectsPage = () => {
  // Données initiales
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);

  // États
  const [showModal, setShowModal] = useState({ add: false, edit: false, notification: false });
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectForm, setProjectForm] = useState({
    name: '', clientId: '', managerId: '', deadline: '', status: 'En cours', team: []
  });

  // Charger les données au montage du composant
  useEffect(() => {
    fetchProjects();
    fetchClients();
    fetchManagers();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/managers');
      const data = await response.json();
      setManagers(data);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/team-members');
      const data = await response.json();
      setAllTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  // Statistiques
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.statut === 'En cours').length,
    completed: projects.filter(p => p.statut === 'Terminé').length,
    cancelled: projects.filter(p => p.statut === 'Annulé').length
  };

  // Fonctions
  const handleProjectSubmit = async () => {
    try {
      // Préparer les données dans le format attendu par le backend
      const projectData = {
        nom: projectForm.name,
        clientId: projectForm.clientId,
        managerId: projectForm.managerId,
        echeance: projectForm.deadline,
        statut: projectForm.status
      };

      let response;
      if (showModal.edit && selectedProject) {
        response = await fetch(`http://localhost:5000/api/projects/${selectedProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });
      } else {
        response = await fetch('http://localhost:5000/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la sauvegarde');
      }

      // Rafraîchir les données et réinitialiser le formulaire
      await fetchProjects();
      setShowModal({ add: false, edit: false, notification: false });
      setProjectForm({ 
        name: '', 
        clientId: '', 
        managerId: '', 
        deadline: '', 
        status: 'En cours', 
        team: [] 
      });

    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de la sauvegarde: ${error.message}`);
    }
  };

  const deleteProject = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Fonction pour ouvrir Gmail avec un message prédéfini
  const sendGmailNotification = (employee) => {
    const subject = encodeURIComponent('Notification importante');
    const body = encodeURIComponent(`Bonjour ${employee.name},

J'espère que vous allez bien.

Je vous contacte pour vous informer d'une mise à jour importante concernant nos projets en cours.

Merci de prendre connaissance de cette information et n'hésitez pas à me contacter si vous avez des questions.

Cordialement,
L'équipe de gestion`);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${employee.email}&su=${subject}&body=${body}`;
    
    // Ouvrir Gmail dans un nouvel onglet
    window.open(gmailUrl, '_blank');
    
    // Fermer la modale
    setShowModal({ ...showModal, notification: false });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Nom', 'Client', 'Responsable', 'Échéance', 'Statut'],
      ...projects.map(p => [
        p.id, 
        p.nom, 
        clients.find(c => c.id === p.clientId)?.nom || 'Inconnu',
        managers.find(m => m.id === p.managerId)?.manager || 'Inconnu',
        p.echeance, 
        p.statut
      ])
    ].map(row => row.join(';')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `projets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
     <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      
      
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6">Projets</h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-gray-500">Total Projets</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-green-500">En Cours</div>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-blue-500">Terminés</div>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-orange-500">Annulés</div>
            <div className="text-2xl font-bold">{stats.cancelled}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            onClick={() => setShowModal({ ...showModal, add: true })}
          >
            + Ajouter Projet
          </button>
          <button 
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={exportToCSV}
          >
            <Download size={18} /> Exporter CSV
          </button>
          <button 
            className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            onClick={() => setShowModal({ ...showModal, notification: true })}
          >
            <Mail size={18} /> Envoyer Notification
          </button>
        </div>

        {/* Recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher projets..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">ID</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">Nom</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">Client</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">Responsable</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">Échéance</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">Statut</th>
                  <th className="px-6 py-3 text-left text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects
                  .filter(p => 
                    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (clients.find(c => c.id === p.clientId)?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(project => (
                    <tr key={project.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">{project.id}</td>
                      <td className="px-6 py-4 font-medium">{project.nom}</td>
                      <td className="px-6 py-4">{clients.find(c => c.id === project.clientId)?.nom || 'Inconnu'}</td>
                      <td className="px-6 py-4">{managers.find(m => m.id === project.managerId)?.manager || 'Inconnu'}</td>
                      <td className="px-6 py-4">{formatDate(project.echeance)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          project.statut === 'En cours' ? 'bg-green-100 text-green-800' : 
                          project.statut === 'Terminé' ? 'bg-blue-100 text-blue-800' : 
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {project.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedProject(project);
                              setProjectForm({
                                name: project.nom,
                                clientId: project.clientId,
                                managerId: project.managerId,
                                deadline: project.echeance,
                                status: project.statut,
                                team: []
                              });
                              setShowModal({ ...showModal, edit: true });
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteProject(project.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modale Projet */}
        {(showModal.add || showModal.edit) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {showModal.add ? 'Ajouter un Projet' : 'Modifier le Projet'}
                </h2>
                <button onClick={() => setShowModal({ add: false, edit: false })} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom du Projet</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Client</label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={projectForm.clientId}
                      onChange={(e) => setProjectForm({...projectForm, clientId: e.target.value})}
                    >
                      <option value="">Sélectionner un client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.nom} {client.entreprise ? `(${client.entreprise})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Responsable</label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={projectForm.managerId}
                      onChange={(e) => setProjectForm({...projectForm, managerId: e.target.value})}
                    >
                      <option value="">Sélectionner un responsable</option>
                      {managers.map(manager => (
                        <option key={manager.id} value={manager.id}>
                          {manager.manager}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Échéance</label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={projectForm.deadline}
                      onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Statut</label>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({...projectForm, status: e.target.value})}
                    >
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button 
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowModal({ add: false, edit: false })}
                  >
                    Annuler
                  </button>
                  <button 
                    type="button"
                    className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    onClick={handleProjectSubmit}
                  >
                    {showModal.add ? 'Créer' : 'Modifier'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modale Sélection Employé pour Notification Gmail */}
        {showModal.notification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Mail size={20} /> Choisir un employé pour la notification
                </h2>
                <button 
                  onClick={() => setShowModal({ ...showModal, notification: false })} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Sélectionnez un employé pour lui envoyer une notification par email via Gmail :
                </p>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allTeamMembers.map(employee => (
                  <div 
                    key={employee.email} 
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-500">{employee.role}</p>
                        <p className="text-xs text-gray-400">{employee.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => sendGmailNotification(employee)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <Mail size={16} />
                      Envoyer Gmail
                    </button>
                  </div>
                ))}
              </div>

              {allTeamMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Aucun employé trouvé</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowModal({ ...showModal, notification: false })}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;