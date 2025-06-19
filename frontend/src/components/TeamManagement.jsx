// src/components/TeamManagement.jsx
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function TeamManagement({ 
  teams, 
  employees, 
  onAddTeam, 
  onEditTeam, 
  onDeleteTeam,
  onAddMember,
  onRemoveMember 
}) {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    manager: ''
  });

  const handleSaveTeam = () => {
    if (!teamFormData.name) {
      alert('Le nom de l\'équipe est requis');
      return;
    }
    
    if (teamFormData.id) {
      onEditTeam(teamFormData);
    } else {
      onAddTeam(teamFormData);
    }
    
    setShowTeamModal(false);
  };

  const handleEditTeam = (team) => {
    setTeamFormData({
      id: team.id,
      name: team.name,
      manager: team.manager
    });
    setShowTeamModal(true);
  };

  const getAvailableEmployeesForTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];

    return employees.filter(employee => 
      !team.members.includes(employee.id) && 
      employee.department !== team.name
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Gestion des équipes</h2>
          <button
            onClick={() => {
              setTeamFormData({ name: '', manager: '' });
              setShowTeamModal(true);
            }}
            className="flex items-center px-4 py-2 bg-[#9c28b1] text-white rounded-md"
          >
            <Plus size={18} className="mr-2" />
            Ajouter une équipe
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Manager</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Membres</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map(team => (
                <tr key={team.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.manager ? (
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full ${employees.find(e => e.id === team.manager)?.avatarColor || 'bg-gray-300'} flex items-center justify-center text-white text-xs font-medium mr-2`}>
                          {employees.find(e => e.id === team.manager)?.initials || '?'}
                        </div>
                        <span>{employees.find(e => e.id === team.manager)?.name || 'Non assigné'}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Non assigné</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {team.members.map(memberId => {
                        const member = employees.find(e => e.id === memberId);
                        return member ? (
                          <div key={memberId} className="inline-flex items-center bg-gray-100 rounded-full px-2 py-0.5">
                            <span className="text-xs font-medium text-gray-800 mr-1">
                              {member.name}
                            </span>
                            <button 
                              onClick={() => onRemoveMember(team.id, memberId)}
                              className="text-gray-500 hover:text-red-500 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                    
                    {getAvailableEmployeesForTeam(team.id).length > 0 && (
                      <select
                        className="border border-gray-300 rounded text-xs p-1"
                        onChange={(e) => {
                          if (e.target.value) {
                            onAddMember(team.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      >
                        <option value="">Ajouter un membre...</option>
                        {getAvailableEmployeesForTeam(team.id).map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} ({employee.position})
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditTeam(team)}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteTeam(team.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Supprimer"
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

      {/* Modale pour créer/modifier une équipe */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {teamFormData.id ? 'Modifier équipe' : 'Nouvelle équipe'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipe</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={teamFormData.manager}
                  onChange={(e) => setTeamFormData({...teamFormData, manager: e.target.value})}
                >
                  <option value="">Sélectionner un manager</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTeamModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveTeam}
                className="px-4 py-2 bg-[#9c28b1] text-white rounded-md hover:bg-[#8a1fa0]"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}