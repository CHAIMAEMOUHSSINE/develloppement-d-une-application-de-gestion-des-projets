// src/components/ActionHistory.jsx
export default function ActionHistory({ history }) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Historique des actions</h2>
          <p className="text-sm text-gray-500 mt-1">
            Journal de toutes les actions effectuées dans le système
          </p>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Cible</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Effectué par</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Détails</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.action}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.target}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.performer}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{item.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }