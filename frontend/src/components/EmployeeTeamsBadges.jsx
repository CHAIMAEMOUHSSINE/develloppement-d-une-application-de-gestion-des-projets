import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeTeamsBadges = ({ employeeId }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/teams/employee/${employeeId}`);
        setTeams(response.data);
      } catch (error) {
        console.error("Erreur de chargement des équipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [employeeId]);

  if (loading) {
    return <div className="text-gray-400">Chargement...</div>;
  }

  if (teams.length === 0) {
    return <div className="text-gray-400">Aucune équipe</div>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {teams.map((team) => (
        <span
          key={team.id}
          className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
          title={team.manager ? `Manager: ${team.manager}` : ''}
        >
          {team.name}
        </span>
      ))}
    </div>
  );
};

export default EmployeeTeamsBadges;
