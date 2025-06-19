import { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import Sidebarmenu from '../components/Sidebarmenu';
import ActionHistory from '../components/ActionHistory';

export default function Historique() {
  const [history] = useState([{
    id: 'HIST-001', action: 'Ajout employé', target: 'Robert Johnson', performer: 'Admin',
    date: '2023-11-12 09:00', details: 'Nouvel employé ajouté'
  }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  
  const actionTypes = ['Tous', 'Ajout employé', 'Modification employé', 'Suppression employé', 'Ajout équipe', 'Modification équipe', 'Suppression équipe'];
  const entriesPerPage = 10;
  const totalEntries = history.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const filteredHistory = history.filter(entry => {
    const matchSearch = 
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.performer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchType = selectedActionType === 'Tous' || entry.action === selectedActionType;
    
    return matchSearch && matchType;
  });

  // Calculate which entries to display on the current page
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredHistory.slice(indexOfFirstEntry, indexOfLastEntry);

  return (
    <div className="flex">
      <Sidebarmenu/>
      <div className="p-6 bg-white min-h-screen w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Historique des Actions</h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center space-x-2">
              <div className="relative inline-block">
                <select 
                  value={selectedActionType} 
                  onChange={e => setSelectedActionType(e.target.value)}
                  className="appearance-none border border-gray-300 rounded px-3 py-2 pr-8 bg-white"
                >
                  {actionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              <button 
                className="border border-gray-300 rounded px-4 py-2 bg-white text-gray-700 hover:bg-gray-100"
                onClick={() => alert("Export en CSV")}
              >
                Exporter CSV
              </button>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSearchInputValue('');
                  setSelectedActionType('Tous');
                }}
                className="border border-gray-300 rounded p-2 bg-white text-gray-700 hover:bg-gray-100" 
                title="Réinitialiser"
              >
                <RefreshCw size={18}/>
              </button>
            </div>
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Rechercher actions..." 
                value={searchInputValue}
                onChange={e => setSearchInputValue(e.target.value)} 
                onKeyPress={e => e.key === 'Enter' && setSearchTerm(searchInputValue)}
                className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full md:w-64"
              />
              <div 
                onClick={() => setSearchTerm(searchInputValue)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
              >
                <Search size={18} className="text-gray-400 hover:text-gray-600"/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <ActionHistory history={filteredHistory} />
            
            {filteredHistory.length > 0 && (
              <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 gap-4">
                <div className="text-sm text-gray-500">
                  Affichage {indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, filteredHistory.length)} sur {filteredHistory.length} entrées
                </div>
                <div className="flex space-x-1">
                  {Array.from({length: Math.min(5, totalPages)}).map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1 ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}