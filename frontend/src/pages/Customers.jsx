import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Plus, X, Edit, Trash2, ChevronRight } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';

export default function Client() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterVisible, setFilterVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [viewingClientDetails, setViewingClientDetails] = useState(null);
  const [filters, setFilters] = useState({
    status: 'Tous',
    searchTerm: ''
  });
  const [newClient, setNewClient] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: '',
    statut: 'actif',
    type_client: 'particulier',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/clients');
      setClients(res.data);
    } catch (err) {
      console.error("Erreur de chargement clients :", err);
    }
  };

  // Fonction d'export CSV améliorée
  const exportToCSV = () => {
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '';
      return `"${String(str).replace(/"/g, '""')}"`;
    };

    const headers = [
      'ID', 'Nom', 'Email', 'Téléphone', 'Entreprise',
      'Statut', 'Type Client', 'Adresse', 'Ville',
      'Code Postal', 'Pays', 'Notes', 'Date Inscription'
    ].join(';');

    const rows = clients.map(client => [
      client.id,
      escapeCsv(client.nom),
      escapeCsv(client.email),
      escapeCsv(client.telephone),
      escapeCsv(client.entreprise),
      escapeCsv(client.statut),
      escapeCsv(client.type_client),
      escapeCsv(client.adresse),
      escapeCsv(client.ville),
      escapeCsv(client.code_postal),
      escapeCsv(client.pays),
      escapeCsv(client.notes),
      escapeCsv(client.date_inscription)
    ].join(';'));

    const csvContent = `${headers}\n${rows.join('\n')}`;
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clients_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtrage des clients
  const filteredClients = clients.filter(client => {
    const statusMatch = filters.status === 'Tous' || client.statut === filters.status;
    const searchMatch = 
      filters.searchTerm === '' ||
      Object.values(client).some(
        val => val && 
        val.toString().toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    return statusMatch && searchMatch;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const date_inscription = new Date().toISOString().slice(0, 10);
      const res = await axios.post('http://localhost:5000/api/clients', {
        ...newClient,
        date_inscription
      });
      setClients([...clients, { id: res.data.id, ...newClient, date_inscription }]);
      setNewClient({
        nom: '', email: '', telephone: '', entreprise: '', adresse: '',
        ville: '', code_postal: '', pays: '', statut: 'actif', type_client: 'particulier', notes: ''
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Erreur ajout client :", err);
    }
  };

  const handleSaveEditedClient = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/clients/${editingClient.id}`, editingClient);
      setClients(clients.map(c => (c.id === editingClient.id ? editingClient : c)));
      setEditingClient(null);
    } catch (err) {
      console.error("Erreur modification client :", err);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm(`Voulez-vous vraiment supprimer ce client ?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/clients/${clientId}`);
        setClients(clients.filter(c => c.id !== clientId));
      } catch (err) {
        console.error("Erreur suppression client :", err);
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

  const getTypeClientLabel = (type) => {
    return type === 'particulier' ? 'Particulier' : 'Entreprise';
  };

  return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedClients.length > 0 ? (
                    paginatedClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.telephone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getTypeClientLabel(client.type_client)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.statut)}`}>
                            {client.statut === 'actif' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => setViewingClientDetails(client)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Détails"
                            >
                              <ChevronRight size={18} />
                            </button>
                            <button
                              onClick={() => setEditingClient(client)}
                              className="text-green-600 hover:text-green-900"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
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
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Aucun client trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {filteredClients.length > 0 ? (
                  `Affichage de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(
                    currentPage * itemsPerPage,
                    filteredClients.length
                  )} sur ${filteredClients.length} clients`
                ) : (
                  'Aucun client'
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

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                <h2 className="text-xl font-bold text-gray-800">Ajouter un nouveau client</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Fermer le formulaire"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddClient}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nom"
                      type="text"
                      value={newClient.nom}
                      onChange={(e) => setNewClient({...newClient, nom: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      required
                      placeholder="Nom complet"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      id="telephone"
                      type="tel"
                      value={newClient.telephone}
                      onChange={(e) => setNewClient({...newClient, telephone: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="entreprise" className="block text-sm font-medium text-gray-700">
                      Entreprise
                    </label>
                    <input
                      id="entreprise"
                      type="text"
                      value={newClient.entreprise}
                      onChange={(e) => setNewClient({...newClient, entreprise: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                      Statut
                    </label>
                    <select
                      id="statut"
                      value={newClient.statut}
                      onChange={(e) => setNewClient({...newClient, statut: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="type_client" className="block text-sm font-medium text-gray-700">
                      Type de client
                    </label>
                    <select
                      id="type_client"
                      value={newClient.type_client}
                      onChange={(e) => setNewClient({...newClient, type_client: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    >
                      <option value="particulier">Particulier</option>
                      <option value="entreprise">Entreprise</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      id="adresse"
                      type="text"
                      value={newClient.adresse}
                      onChange={(e) => setNewClient({...newClient, adresse: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="123 Rue de l'exemple"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    <input
                      id="ville"
                      type="text"
                      value={newClient.ville}
                      onChange={(e) => setNewClient({...newClient, ville: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="Paris"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="code_postal" className="block text-sm font-medium text-gray-700">
                      Code postal
                    </label>
                    <input
                      id="code_postal"
                      type="text"
                      value={newClient.code_postal}
                      onChange={(e) => setNewClient({...newClient, code_postal: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="75000"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="pays" className="block text-sm font-medium text-gray-700">
                      Pays
                    </label>
                    <input
                      id="pays"
                      type="text"
                      value={newClient.pays}
                      onChange={(e) => setNewClient({...newClient, pays: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="France"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-1">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      value={newClient.notes}
                      onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      rows="3"
                      placeholder="Informations supplémentaires..."
                    />
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
                  >
                    Enregistrer le client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Formulaire de modification */}
        {editingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10">
                <h2 className="text-2xl font-bold text-gray-800">Modifier le client</h2>
                <button
                  onClick={() => setEditingClient(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                  aria-label="Fermer le formulaire"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSaveEditedClient}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-nom" className="block text-sm font-medium text-gray-700">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="edit-nom"
                      type="text"
                      value={editingClient.nom || ''}
                      onChange={(e) => setEditingClient({...editingClient, nom: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="edit-email"
                      type="email"
                      value={editingClient.email || ''}
                      onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="client@exemple.com"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-telephone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <input
                      id="edit-telephone"
                      type="tel"
                      value={editingClient.telephone || ''}
                      onChange={(e) => setEditingClient({...editingClient, telephone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-entreprise" className="block text-sm font-medium text-gray-700">
                      Entreprise
                    </label>
                    <input
                      id="edit-entreprise"
                      type="text"
                      value={editingClient.entreprise || ''}
                      onChange={(e) => setEditingClient({...editingClient, entreprise: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-statut" className="block text-sm font-medium text-gray-700">
                      Statut
                    </label>
                    <select
                      id="edit-statut"
                      value={editingClient.statut || 'actif'}
                      onChange={(e) => setEditingClient({...editingClient, statut: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjR2NXY3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-type-client" className="block text-sm font-medium text-gray-700">
                      Type de client
                    </label>
                    <select
                      id="edit-type-client"
                      value={editingClient.type_client || 'particulier'}
                      onChange={(e) => setEditingClient({...editingClient, type_client: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjR2NXY3IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]"
                    >
                      <option value="particulier">Particulier</option>
                      <option value="entreprise">Entreprise</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label htmlFor="edit-adresse" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <input
                      id="edit-adresse"
                      type="text"
                      value={editingClient.adresse || ''}
                      onChange={(e) => setEditingClient({...editingClient, adresse: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="123 Rue de la République"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-ville" className="block text-sm font-medium text-gray-700">
                      Ville
                    </label>
                    <input
                      id="edit-ville"
                      type="text"
                      value={editingClient.ville || ''}
                      onChange={(e) => setEditingClient({...editingClient, ville: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Paris"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-code-postal" className="block text-sm font-medium text-gray-700">
                      Code postal
                    </label>
                    <input
                      id="edit-code-postal"
                      type="text"
                      value={editingClient.code_postal || ''}
                      onChange={(e) => setEditingClient({...editingClient, code_postal: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="75000"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="edit-pays" className="block text-sm font-medium text-gray-700">
                      Pays
                    </label>
                    <input
                      id="edit-pays"
                      type="text"
                      value={editingClient.pays || ''}
                      onChange={(e) => setEditingClient({...editingClient, pays: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="France"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="edit-notes"
                      value={editingClient.notes || ''}
                      onChange={(e) => setEditingClient({...editingClient, notes: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[100px]"
                      placeholder="Informations supplémentaires sur le client..."
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingClient(null)}
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
        {viewingClientDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Détails du client</h2>
                <button
                  onClick={() => setViewingClientDetails(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium">{viewingClientDetails.id}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p className="font-medium">{viewingClientDetails.date_inscription}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{viewingClientDetails.nom}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{viewingClientDetails.email}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{viewingClientDetails.telephone}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Type de client</p>
                  <p className="font-medium">{getTypeClientLabel(viewingClientDetails.type_client)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="font-medium">{viewingClientDetails.entreprise || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(viewingClientDetails.statut)}`}>
                      {viewingClientDetails.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                </div>
                
                <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium">{viewingClientDetails.adresse || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Ville</p>
                  <p className="font-medium">{viewingClientDetails.ville || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Code postal</p>
                  <p className="font-medium">{viewingClientDetails.code_postal || '-'}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Pays</p>
                  <p className="font-medium">{viewingClientDetails.pays || '-'}</p>
                </div>
                
                {viewingClientDetails.notes && (
                  <div className="md:col-span-2 bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium whitespace-pre-line">{viewingClientDetails.notes}</p>
                  </div>
                )}
                
                <div className="md:col-span-2 flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setEditingClient(viewingClientDetails);
                      setViewingClientDetails(null);
                    }}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => setViewingClientDetails(null)}
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