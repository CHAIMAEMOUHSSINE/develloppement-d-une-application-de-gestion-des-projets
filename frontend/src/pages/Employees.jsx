import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Plus, X, Edit, Trash2, ChevronRight, ChevronDown, ChevronUp, Check, Link, Link2, Unlink } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';
import EmployeeTeamsBadges from '../components/EmployeeTeamsBadges';
import EmployeeTeams from '../components/EmployeeTeams';

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployeeDetails, setViewingEmployeeDetails] = useState(null);
  const [filters, setFilters] = useState({
    status: 'Tous',
    searchTerm: ''
  });
  const [newEmployee, setNewEmployee] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    departement: '',
    statut: 'actif',
    selectedTeams: []
  });
  const [teamsDropdownOpen, setTeamsDropdownOpen] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [unlinkedData, setUnlinkedData] = useState({
  employees: [],
  users: [],
  canAutoLink: false
});
  const [selectedLinkEmployee, setSelectedLinkEmployee] = useState(null);
  const [selectedLinkUser, setSelectedLinkUser] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchAllTeams();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error("Erreur de chargement employés :", err);
    }
  };

  const fetchAllTeams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/teams');
      setTeams(res.data);
    } catch (err) {
      console.error("Erreur de chargement des équipes :", err);
    }
  };

 const fetchUnlinkedData = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/employees/admin/unlinked');
    setUnlinkedData({
      employees: res.data.unlinkedEmployees || [],
      users: res.data.availableUsers || [],
      canAutoLink: res.data.canAutoLink || false
    });
  } catch (err) {
    console.error("Erreur de chargement des données non liées :", err);
    setUnlinkedData({
      employees: [],
      users: [],
      canAutoLink: false
    });
  }
};
  const handleTeamSelection = (teamId) => {
    setNewEmployee(prev => {
      const isSelected = prev.selectedTeams.includes(teamId);
      return {
        ...prev,
        selectedTeams: isSelected
          ? prev.selectedTeams.filter(id => id !== teamId)
          : [...prev.selectedTeams, teamId]
      };
    });
  };

  const toggleTeamsDropdown = () => {
    setTeamsDropdownOpen(!teamsDropdownOpen);
  };

  const selectAllTeams = () => {
    setNewEmployee(prev => ({
      ...prev,
      selectedTeams: teams.map(team => team.id)
    }));
  };

  const clearAllTeams = () => {
    setNewEmployee(prev => ({
      ...prev,
      selectedTeams: []
    }));
  };

  const exportToCSV = () => {
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '';
      return `"${String(str).replace(/"/g, '""')}"`;
    };

    const headers = [
      'ID', 'Nom', 'Prénom', 'Téléphone', 'Adresse', 
      'Département', 'Statut', 'Date Embauche', 'Équipes', 'Utilisateur lié'
    ].join(';');

    const rows = employees.map(employee => [
      employee.id,
      escapeCsv(employee.nom),
      escapeCsv(employee.prenom),
      escapeCsv(employee.telephone),
      escapeCsv(employee.adresse),
      escapeCsv(employee.departement),
      escapeCsv(employee.statut),
      escapeCsv(employee.date_embauche),
      escapeCsv(employee.teams?.map(t => t.name).join(', ')),
      escapeCsv(employee.user_name ? `${employee.user_name} (${employee.user_email})` : 'Non lié')
    ].join(';'));

    const csvContent = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredEmployees = employees.filter(employee => {
    const statusMatch = filters.status === 'Tous' || employee.statut === filters.status;
    const searchMatch = 
      filters.searchTerm === '' ||
      Object.values(employee).some(
        val => val && 
        val.toString().toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    return statusMatch && searchMatch;
  });

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const date_embauche = new Date().toISOString().slice(0, 10);
      const res = await axios.post('http://localhost:5000/api/employees', {
        ...newEmployee,
        date_embauche
      });
      
      const newEmployeeId = res.data.id;
      
      if (newEmployee.selectedTeams.length > 0) {
        await Promise.all(
          newEmployee.selectedTeams.map(teamId => 
            axios.post('http://localhost:5000/api/teams/add-employee', {
              employeeId: newEmployeeId,
              teamId
            })
          )
        );
      }
      
      setEmployees([...employees, { id: res.data.id, ...newEmployee, date_embauche }]);
      setNewEmployee({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        departement: '',
        statut: 'actif',
        selectedTeams: []
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Erreur ajout employé :", err);
    }
  };

  const handleSaveEditedEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${editingEmployee.id}`, editingEmployee);
      setEmployees(employees.map(e => (e.id === editingEmployee.id ? editingEmployee : e)));
      setEditingEmployee(null);
    } catch (err) {
      console.error("Erreur modification employé :", err);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm(`Voulez-vous vraiment supprimer cet employé ?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${employeeId}`);
        setEmployees(employees.filter(e => e.id !== employeeId));
      } catch (err) {
        console.error("Erreur suppression employé :", err);
      }
    }
  };

  const handleAutoLink = async () => {
  try {
    const response = await axios.post('/api/employees/admin/auto-link');
    
    if (response.data.success) {
      alert(`${response.data.message}\n` + 
            `Restants non liés: ${response.data.remainingUnlinked || 0}`);
      // Rafraîchir les données
      fetchEmployees();
    } else {
      alert(response.data.message || "Aucune liaison effectuée");
    }
  } catch (error) {
    console.error("Auto-linking failed:", error);
    alert("Erreur lors de la liaison automatique: " + 
      (error.response?.data?.error || "Erreur serveur"));
  }
};

  const handleManualLink = async () => {
    if (!selectedLinkEmployee || !selectedLinkUser) {
      alert("Veuillez sélectionner un employé et un utilisateur");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/employees/admin/manual-link', {
        employeeId: selectedLinkEmployee,
        userId: selectedLinkUser
      });
      alert("Lien créé avec succès");
      fetchEmployees();
      setShowLinkModal(false);
      setSelectedLinkEmployee(null);
      setSelectedLinkUser(null);
    } catch (err) {
      console.error("Erreur lors du lien manuel :", err);
      alert("Erreur lors de la création du lien");
    }
  };

  const handleUnlinkEmployee = async (employeeId) => {
    if (window.confirm("Voulez-vous vraiment supprimer le lien avec l'utilisateur ?")) {
      try {
        await axios.put(`http://localhost:5000/api/employees/${employeeId}`, {
          user_id: null
        });
        fetchEmployees();
        if (viewingEmployeeDetails?.id === employeeId) {
          setViewingEmployeeDetails(prev => ({
            ...prev,
            user_id: null,
            user_name: null,
            user_email: null,
            user_role: null
          }));
        }
      } catch (err) {
        console.error("Erreur lors de la suppression du lien :", err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-600';
      case 'inactif': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Employés</h1>
            <div className="flex space-x-3">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 rounded-full bg-white text-purple-700 border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50"
              >
                <Download size={16} className="mr-2" />
                Exporter CSV
              </button>
              <button
                onClick={() => setFilterVisible(!filterVisible)}
                className="flex items-center px-4 py-2 rounded-full bg-white text-purple-700 border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50"
              >
                <Filter size={16} className="mr-2" />
                Filtrer
              </button>
              <button
                onClick={() => {
                  setShowLinkModal(true);
                  fetchUnlinkedData();
                }}
                className="flex items-center px-4 py-2 rounded-full bg-blue-600 text-white shadow-sm text-sm font-medium hover:bg-blue-700"
              >
                <Link size={16} className="mr-2" />
                Lier employés
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 rounded-full bg-purple-600 text-white shadow-sm text-sm font-medium hover:bg-purple-700"
              >
                <Plus size={16} className="mr-2" />
                Ajouter
              </button>
            </div>
          </div>

          {filterVisible && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={(e) => {
                      setFilters({...filters, status: e.target.value});
                      setCurrentPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="Tous">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={(e) => {
                      setFilters({...filters, searchTerm: e.target.value});
                      setCurrentPage(1);
                    }}
                    placeholder="Rechercher..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({ status: 'Tous', searchTerm: '' });
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Prénom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Équipes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Département</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.prenom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <EmployeeTeamsBadges employeeId={employee.id} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.user_name ? (
                            <div className="flex items-center">
                              <span className="mr-2">{employee.user_name}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnlinkEmployee(employee.id);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Supprimer le lien"
                              >
                                <Unlink size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">Non lié</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.departement}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.statut)}`}>
                            {employee.statut === 'actif' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setViewingEmployeeDetails(employee)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Détails"
                            >
                              <ChevronRight size={18} />
                            </button>
                            <button
                              onClick={() => setEditingEmployee(employee)}
                              className="text-green-600 hover:text-green-900"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        Aucun employé trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {filteredEmployees.length > 0 ? (
                  `Affichage de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(
                    currentPage * itemsPerPage,
                    filteredEmployees.length
                  )} sur ${filteredEmployees.length} employés`
                ) : (
                  'Aucun employé'
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'border-purple-500 bg-purple-100 text-purple-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de liaison employés-utilisateurs */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Lier des employés à des utilisateurs</h2>
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setSelectedLinkEmployee(null);
                    setSelectedLinkUser(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Employés non liés</h3>
                    <div className="border rounded-md overflow-hidden">
                      {unlinkedData.employees.length > 0 ? (
                        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                          {unlinkedData.employees.map(emp => (
                            <li 
                              key={emp.id} 
                              className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedLinkEmployee === emp.id ? 'bg-blue-50' : ''}`}
                              onClick={() => setSelectedLinkEmployee(emp.id)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{emp.nom} {emp.prenom}</span>
                                {selectedLinkEmployee === emp.id && (
                                  <Check className="text-blue-600" size={18} />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{emp.departement}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500">Aucun employé non lié</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Utilisateurs disponibles</h3>
                    <div className="border rounded-md overflow-hidden">
                      {unlinkedData.users.length > 0 ? (
                        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                          {unlinkedData.users.map(user => (
                            <li 
                              key={user.id} 
                              className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedLinkUser === user.id ? 'bg-blue-50' : ''}`}
                              onClick={() => setSelectedLinkUser(user.id)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{user.name}</span>
                                {selectedLinkUser === user.id && (
                                  <Check className="text-blue-600" size={18} />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-gray-500">Aucun utilisateur disponible</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={handleAutoLink}
                  disabled={!unlinkedData.canAutoLink}
                  className={`px-4 py-2 rounded-md flex items-center ${unlinkedData.canAutoLink ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  <Link2 size={16} className="mr-2" />
                  Lier automatiquement
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowLinkModal(false);
                      setSelectedLinkEmployee(null);
                      setSelectedLinkUser(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleManualLink}
                    disabled={!selectedLinkEmployee || !selectedLinkUser}
                    className={`px-4 py-2 rounded-md flex items-center ${selectedLinkEmployee && selectedLinkUser ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    <Link size={16} className="mr-2" />
                    Lier manuellement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                <h2 className="text-xl font-bold text-gray-800">Ajouter un nouvel employé</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Fermer le formulaire"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddEmployee}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nom"
                      type="text"
                      value={newEmployee.nom}
                      onChange={(e) => setNewEmployee({...newEmployee, nom: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      required
                      placeholder="Nom de famille"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      value={newEmployee.prenom}
                      onChange={(e) => setNewEmployee({...newEmployee, prenom: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      required
                      placeholder="Prénom"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      id="telephone"
                      type="tel"
                      value={newEmployee.telephone}
                      onChange={(e) => setNewEmployee({...newEmployee, telephone: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="departement" className="block text-sm font-medium text-gray-700">
                      Département <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="departement"
                      type="text"
                      value={newEmployee.departement}
                      onChange={(e) => setNewEmployee({...newEmployee, departement: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      required
                      placeholder="Ex: Comptabilité, RH, IT..."
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                      Statut
                    </label>
                    <select
                      id="statut"
                      value={newEmployee.statut}
                      onChange={(e) => setNewEmployee({...newEmployee, statut: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      id="adresse"
                      type="text"
                      value={newEmployee.adresse}
                      onChange={(e) => setNewEmployee({...newEmployee, adresse: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="123 Rue de l'exemple"
                    />
                  </div>

                  {/* Sélecteur d'équipes */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Assigner à des équipes
                    </label>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={toggleTeamsDropdown}
                        className="w-full flex justify-between items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <span className="flex items-center">
                          {newEmployee.selectedTeams.length === 0 ? (
                            <span className="text-gray-500">Sélectionner des équipes...</span>
                          ) : (
                            <span className="text-gray-700">
                              {newEmployee.selectedTeams.length} équipe(s) sélectionnée(s)
                            </span>
                          )}
                        </span>
                        {teamsDropdownOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      
                      {teamsDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
                          <div className="border-b border-gray-200 px-3 py-2 flex justify-between">
                            <button
                              type="button"
                              onClick={selectAllTeams}
                              className="text-xs text-purple-600 hover:text-purple-800"
                            >
                              Tout sélectionner
                            </button>
                            <button
                              type="button"
                              onClick={clearAllTeams}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Tout effacer
                            </button>
                          </div>
                          
                          {teams.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              Aucune équipe disponible
                            </div>
                          ) : (
                            teams.map(team => (
                              <div
                                key={team.id}
                                onClick={() => handleTeamSelection(team.id)}
                                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-purple-50 ${newEmployee.selectedTeams.includes(team.id) ? 'bg-purple-50' : ''}`}
                              >
                                <div className={`flex items-center justify-center h-5 w-5 rounded border ${newEmployee.selectedTeams.includes(team.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                                  {newEmployee.selectedTeams.includes(team.id) && (
                                    <Check className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div className="ml-3 flex flex-col">
                                  <span className="text-sm font-medium text-gray-700">{team.name}</span>
                                  {team.manager && (
                                    <span className="text-xs text-gray-500">Manager: {team.manager}</span>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Affichage des équipes sélectionnées */}
                    {newEmployee.selectedTeams.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {teams
                            .filter(team => newEmployee.selectedTeams.includes(team.id))
                            .map(team => (
                              <span
                                key={team.id}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {team.name}
                                <button
                                  type="button"
                                  onClick={() => handleTeamSelection(team.id)}
                                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-600 hover:bg-purple-200 hover:text-purple-900 focus:outline-none"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    disabled={!newEmployee.nom || !newEmployee.prenom || !newEmployee.departement}
                  >
                    Enregistrer l'employé
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulaire de modification */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
                <h2 className="text-2xl font-bold text-gray-800">Modifier l'employé</h2>
                <button
                  onClick={() => setEditingEmployee(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  aria-label="Fermer le formulaire"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSaveEditedEmployee}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-nom" className="block text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-nom"
                      type="text"
                      value={editingEmployee.nom || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, nom: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      placeholder="Dupont"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-prenom" className="block text-sm font-medium text-gray-700">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-prenom"
                      type="text"
                      value={editingEmployee.prenom || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, prenom: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      placeholder="Jean"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-telephone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      id="edit-telephone"
                      type="tel"
                      value={editingEmployee.telephone || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, telephone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-departement" className="block text-sm font-medium text-gray-700">
                      Département <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-departement"
                      type="text"
                      value={editingEmployee.departement || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, departement: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      placeholder="Informatique"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-statut" className="block text-sm font-medium text-gray-700">
                      Statut
                    </label>
                    <select
                      id="edit-statut"
                      value={editingEmployee.statut || 'actif'}
                      onChange={(e) => setEditingEmployee({...editingEmployee, statut: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjR2NXY3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label htmlFor="edit-adresse" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      id="edit-adresse"
                      type="text"
                      value={editingEmployee.adresse || ''}
                      onChange={(e) => setEditingEmployee({...editingEmployee, adresse: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="123 Rue de la République"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingEmployee(null)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Sauvegarder les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vue détaillée */}
        {viewingEmployeeDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Détails de l'employé</h2>
                <button
                  onClick={() => setViewingEmployeeDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{viewingEmployeeDetails.id}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Date d'embauche</p>
                  <p className="font-medium">{viewingEmployeeDetails.date_embauche || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{viewingEmployeeDetails.nom}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Prénom</p>
                  <p className="font-medium">{viewingEmployeeDetails.prenom}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{viewingEmployeeDetails.telephone || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Département</p>
                  <p className="font-medium">{viewingEmployeeDetails.departement}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(viewingEmployeeDetails.statut)}`}>
                      {viewingEmployeeDetails.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                </div>
                
                <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{viewingEmployeeDetails.adresse || '-'}</p>
                </div>

                {/* Section utilisateur lié */}
                {viewingEmployeeDetails.user_id ? (
                  <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Utilisateur lié</p>
                        <p className="font-medium">
                          {viewingEmployeeDetails.user_name} ({viewingEmployeeDetails.user_email})
                        </p>
                        <p className="text-sm text-gray-500">Rôle: {viewingEmployeeDetails.user_role}</p>
                      </div>
                      <button
                        onClick={() => handleUnlinkEmployee(viewingEmployeeDetails.id)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm"
                      >
                        <Unlink size={16} className="mr-1" />
                        Supprimer le lien
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Utilisateur lié</p>
                    <p className="font-medium text-gray-400">Aucun utilisateur lié</p>
                    <button
                      onClick={() => {
                        setShowLinkModal(true);
                        fetchUnlinkedData();
                        setSelectedLinkEmployee(viewingEmployeeDetails.id);
                      }}
                      className="mt-2 flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Link size={16} className="mr-1" />
                      Lier à un utilisateur
                    </button>
                  </div>
                )}

                <EmployeeTeams employeeId={viewingEmployeeDetails.id} />
                
                <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setEditingEmployee(viewingEmployeeDetails);
                      setViewingEmployeeDetails(null);
                    }}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setViewingEmployeeDetails(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Fermer
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