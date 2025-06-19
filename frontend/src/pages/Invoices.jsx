import { useState, useEffect } from 'react';
import { Plus, RefreshCw, MoreHorizontal, Search, Trash2, Edit, ChevronRight, X } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

export default function Factures() {
  // États
  const [expandedFacture, setExpandedFacture] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [factureForm, setFactureForm] = useState({
    id: '',
    client: '',
    montant: 0,
    dateEmission: '',
    statut: 'En attente',
    emailClient: ''
  });

  // Chargement initial des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturesResponse, clientsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/factures'),
          axios.get('http://localhost:5000/api/clients')
        ]);
        setFactures(facturesResponse.data);
        setClients(clientsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mise à jour automatique de l'email quand le client est sélectionné
  useEffect(() => {
    if (factureForm.client) {
      const selectedClient = clients.find(c => c.id === factureForm.client);
      if (selectedClient) {
        setFactureForm(prev => ({
          ...prev,
          emailClient: selectedClient.email
        }));
      }
    }
  }, [factureForm.client, clients]);

  // Données pour le graphique
  const dataGraphique = [
    { name: 'Payées', value: factures.filter(f => f.statut === 'Payée').length, color: '#10B981' },
    { name: 'En attente', value: factures.filter(f => f.statut === 'En attente').length, color: '#F59E0B' },
    { name: 'En retard', value: factures.filter(f => f.statut === 'En retard').length, color: '#EF4444' }
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'Payée': return 'bg-green-100 text-green-600';
      case 'En attente': return 'bg-orange-100 text-orange-600';
      case 'En retard': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFactureForm({ ...factureForm, [name]: value });
  };

  // Générer un nouvel ID de facture
  const generateNewId = () => {
    return `FAC-${new Date().getFullYear()}-${(factures.length + 1).toString().padStart(3, '0')}`;
  };

  // Ajout d'une nouvelle facture
  const handleAddFacture = async () => {
    try {
      const newFacture = {
        ...factureForm,
        id: generateNewId(),
        dateEmission: new Date().toLocaleDateString('fr-FR')
      };
      const response = await axios.post('http://localhost:5000/api/factures', newFacture);
      setFactures([...factures, response.data]);
      setShowModal(false);
      resetFactureForm();
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      alert(err.response?.data?.message || "Erreur lors de l'ajout de la facture");
    }
  };

  // Mise à jour d'une facture
  const handleUpdateFacture = async () => {
    try {
      await axios.put(`http://localhost:5000/api/factures/${factureForm.id}`, factureForm);
      setFactures(factures.map(f => f.id === factureForm.id ? factureForm : f));
      setShowModal(false);
      resetFactureForm();
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      alert(err.response?.data?.message || "Erreur lors de la modification");
    }
  };

  // Suppression d'une facture
  const handleDeleteFacture = async (factureId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await axios.delete(`http://localhost:5000/api/factures/${factureId}`);
        setFactures(factures.filter(f => f.id !== factureId));
      } catch (err) {
        alert(`Erreur lors de la suppression: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  // Réinitialisation du formulaire
  const resetFactureForm = () => {
    setFactureForm({
      id: '',
      client: '',
      montant: 0,
      dateEmission: '',
      statut: 'En attente',
      emailClient: ''
    });
    setIsEditing(false);
  };

  // Préparation de l'édition d'une facture
  const prepareEditFacture = (facture) => {
    setFactureForm({
      id: facture.id,
      client: facture.client,
      montant: facture.montant,
      dateEmission: facture.dateEmission,
      statut: facture.statut,
      emailClient: facture.emailClient
    });
    setIsEditing(true);
    setShowModal(true);
  };

  // Filtrage des factures
  const filteredFactures = factures.filter(facture => {
    if (activeTab === 'Tous') return true;
    return facture.statut === activeTab;
  });

  if (loading) return (
    <div className="flex">
          <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
            <Sidebarmenu />
          </div>
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6 flex items-center justify-center">
        <div>Chargement en cours...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex">
      <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
        <Sidebarmenu />
      </div>
      <div className="ml-72 w-full h-screen overflow-auto bg-gray-50 p-6 flex items-center justify-center">
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
            <h1 className="text-xl font-bold text-gray-800">Factures</h1>
            <div className="flex space-x-2">
              <button
                className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-md text-sm"
                onClick={() => {
                  resetFactureForm();
                  setShowModal(true);
                }}
              >
                <Plus size={16} className="mr-1" />
                Nouvelle Facture
              </button>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex mb-4 text-sm">
            <div className="mr-1">Afficher:</div>
            <div className="flex space-x-2">
              {['Tous', 'Payée', 'En attente', 'En retard'].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-full ${activeTab === tab ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cartes de synthèse */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-purple-600 font-medium mb-1">Total Factures</p>
              <p className="text-3xl font-bold text-gray-800">{factures.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-green-500 font-medium mb-1">Factures Payées</p>
              <p className="text-3xl font-bold text-gray-800">{factures.filter(f => f.statut === 'Payée').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-orange-500 font-medium mb-1">Factures En attente</p>
              <p className="text-3xl font-bold text-gray-800">{factures.filter(f => f.statut === 'En attente').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <p className="text-red-500 font-medium mb-1">Factures En retard</p>
              <p className="text-3xl font-bold text-gray-800">{factures.filter(f => f.statut === 'En retard').length}</p>
            </div>
          </div>

          {/* Graphique */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dataGraphique} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {dataGraphique.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tableau des Factures */}
          <div className="mb-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm text-gray-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Client</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Montant</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Statut</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFactures.map(facture => (
                  <tr key={facture.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-800">{facture.id}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {clients.find(c => c.id === facture.client)?.nom || 'Client inconnu'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">{facture.montant} €</td>
                    <td className={`px-6 py-3 text-sm ${getStatusColor(facture.statut)} uppercase`}>{facture.statut}</td>
                    <td className="px-6 py-3 text-sm">
                      <button
                        onClick={() => prepareEditFacture(facture)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFacture(facture.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal d'ajout et de modification */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">{isEditing ? 'Modifier la Facture' : 'Ajouter une Facture'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Client</label>
                <select
                  name="client"
                  value={factureForm.client}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Sélectionnez un client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.nom} {client.entreprise && `(${client.entreprise})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
                <input
                  name="montant"
                  value={factureForm.montant}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email du client</label>
                <input
                  type="email"
                  name="emailClient"
                  value={factureForm.emailClient}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  name="statut"
                  value={factureForm.statut}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="En attente">En attente</option>
                  <option value="Payée">Payée</option>
                  <option value="En retard">En retard</option>
                </select>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={isEditing ? handleUpdateFacture : handleAddFacture}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Modifier' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}