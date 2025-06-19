import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * EmployeeTeams Component - Manages team assignments for an employee
 * @param {Object} props - Component props
 * @param {number} props.employeeId - ID of the employee
 * @returns {JSX.Element} - React component
 */
const EmployeeTeams = ({ employeeId }) => {
  // State management
  const [teams, setTeams] = useState([]);
  const [employeeTeams, setEmployeeTeams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState({
    teams: false,
    employeeTeams: false,
    add: false,
    remove: false
  });
  const [error, setError] = useState({
    teams: null,
    employeeTeams: null,
    add: null,
    remove: null
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch all available teams
  const fetchTeams = useCallback(async () => {
    setLoading(prev => ({ ...prev, teams: true }));
    setError(prev => ({ ...prev, teams: null }));
    
    try {
      const { data } = await axios.get(`${API_BASE_URL}/teams`);
      setTeams(data);
    } catch (err) {
      console.error("Teams loading error:", err);
      setError(prev => ({ ...prev, teams: err.message || 'Failed to load teams' }));
    } finally {
      setLoading(prev => ({ ...prev, teams: false }));
    }
  }, []);

  // Fetch teams assigned to the employee
  const fetchEmployeeTeams = useCallback(async () => {
    if (!employeeId) return;
    
    setLoading(prev => ({ ...prev, employeeTeams: true }));
    setError(prev => ({ ...prev, employeeTeams: null }));
    
    try {
      const { data } = await axios.get(`${API_BASE_URL}/teams/employee/${employeeId}`);
      setEmployeeTeams(data);
    } catch (err) {
      console.error("Employee teams loading error:", err);
      setError(prev => ({ ...prev, employeeTeams: err.message || 'Failed to load employee teams' }));
    } finally {
      setLoading(prev => ({ ...prev, employeeTeams: false }));
    }
  }, [employeeId]);

  // Initial data loading
  useEffect(() => {
    if (employeeId) {
      fetchTeams();
      fetchEmployeeTeams();
    }
  }, [employeeId, fetchTeams, fetchEmployeeTeams]);

  // Add employee to a team
  const handleAddToTeam = async () => {
    if (!selectedTeam) return;
    
    setLoading(prev => ({ ...prev, add: true }));
    setError(prev => ({ ...prev, add: null }));
    
    try {
      await axios.post(`${API_BASE_URL}/teams/add-employee`, {
        employeeId,
        teamId: selectedTeam
      });
      await fetchEmployeeTeams();
      setSelectedTeam('');
    } catch (err) {
      console.error("Add to team error:", err);
      setError(prev => ({ ...prev, add: err.response?.data?.message || err.message || 'Failed to add to team' }));
    } finally {
      setLoading(prev => ({ ...prev, add: false }));
    }
  };

  // Remove employee from a team
  const handleRemoveFromTeam = async (teamId) => {
    if (!window.confirm("Remove this employee from the team?")) return;
    
    setLoading(prev => ({ ...prev, [teamId]: true }));
    
    try {
      await axios.delete(`${API_BASE_URL}/teams/remove-employee`, {
        data: { employeeId, teamId }
      });
      await fetchEmployeeTeams();
    } catch (err) {
      console.error("Remove from team error:", err);
      setError(prev => ({ ...prev, remove: err.response?.data?.message || err.message || 'Failed to remove from team' }));
    } finally {
      setLoading(prev => ({ ...prev, [teamId]: false }));
    }
  };

  // Available teams for selection (filter out already assigned teams)
  const availableTeams = teams.filter(team => 
    !employeeTeams.some(et => et.id === team.id)
  );

  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
      {/* Header with toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-opacity-50 rounded-t-lg"
        aria-expanded={isOpen}
        aria-controls="employee-teams-content"
      >
        <h3 className="font-medium text-gray-800">Employee Teams</h3>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      
      {/* Collapsible content */}
      <div 
        id="employee-teams-content"
        className={`transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 space-y-4 border-t border-gray-200">
          {/* Error messages */}
          {(error.teams || error.employeeTeams || error.add || error.remove) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error.teams || error.employeeTeams || error.add || error.remove}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team selection and add button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading.teams || loading.add || availableTeams.length === 0}
              aria-label="Select a team to add"
            >
              <option value="">Select a team...</option>
              {availableTeams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} {team.manager && `(${team.manager})`}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleAddToTeam}
              disabled={!selectedTeam || loading.add || loading.teams}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
            >
              {loading.add ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={16} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
          
          {/* Current team assignments */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Team Assignments</h4>
            
            {loading.employeeTeams ? (
              <div className="flex justify-center py-4">
                <div className="inline-block h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : employeeTeams.length > 0 ? (
              <ul className="space-y-2">
                {employeeTeams.map(team => (
                  <li 
                    key={team.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                    <div>
                      <span className="font-medium">{team.name}</span>
                      {team.manager && (
                        <span className="text-sm text-gray-500 ml-2">(Manager: {team.manager})</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveFromTeam(team.id)}
                      disabled={loading[team.id]}
                      className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                      title="Remove from team"
                      aria-label={`Remove from ${team.name}`}
                    >
                      {loading[team.id] ? (
                        <div className="inline-block h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-500">This employee is not assigned to any teams</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
EmployeeTeams.propTypes = {
  employeeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default EmployeeTeams;