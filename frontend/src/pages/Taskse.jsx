import { useState } from 'react';
import { MessageCircle, FileText, Search, AlertCircle, Check, X, Clock, AlertTriangle, ChevronDown, Plus } from 'lucide-react';
import Sidemenuuser from '../components/Sidemenuuser';
import MediaRecorder from '../components/MediaRecorder';

export default function Taskse() {
  // État global de l'humeur
  const [mood, setMood] = useState('bon');
  const [moodComment, setMoodComment] = useState('Journée productive mais beaucoup de réunions');
  const [showMoodCommentInput, setShowMoodCommentInput] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    assignee: ''
  });

  // États pour les enregistrements
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const [showVideoRecorder, setShowVideoRecorder] = useState(false);
  const [recordings, setRecordings] = useState([]);

  // État des tâches avec humeur par tâche
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      title: "Créer le design de la page d'accueil", 
      deadline: "Aujourd'hui - 14 heures", 
      status: "En cours", 
      assignee: "Sophie Martin",
      taskMood: null,
      moodComment: ""
    },
    { 
      id: 2, 
      title: "Définir les spécifications UX", 
      domain: "1 Domaine · 3 Équipes", 
      assignee: "Thomas Bernard", 
      status: "À faire",
      taskMood: null,
      moodComment: ""
    },
    { 
      id: 3, 
      title: "Réunion client", 
      time: "1 Heu · 3min14s", 
      assignee: "Xavier Dupont", 
      status: "Terminé",
      taskMood: "bon",
      moodComment: "La réunion s'est bien passée, le client est satisfait"
    },
    { 
      id: 4, 
      title: "Intégration API de paiement", 
      urgency: "Urgence · 2 Équipes", 
      assignee: "Marie Martin", 
      status: "Retard",
      taskMood: "stresse",
      moodComment: "Difficultés techniques avec l'API"
    }
  ]);

  const discussions = [
    { id: 1, author: "Sophie Martin", time: "10h30", content: "Bonjour à tous ! J'ai terminé les maquettes pour le projet client. Je les partagerai cet après-midi." },
    { id: 2, author: "Thomas Bernard", time: "10h40", content: "Super ! J'ai hâte de les voir. Est-ce que tu as inclus les modifications demandées lors de la dernière réunion ?" },
    { id: 3, author: "Jean Dupont", time: "10h50", content: "Je peux vous aider avec les icônes si besoin." }
  ];

  const documents = [
    { id: 1, title: "Spécifications projet", updated: "Modifié il y a 2h" },
    { id: 2, title: "Rapport de progression", updated: "Modifié il y a 3h" },
    { id: 3, title: "Maquettes UI", updated: "Modifié il y a 5h" }
  ];

  // Fonction pour changer le statut d'une tâche
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Fonction pour mettre à jour l'humeur associée à une tâche
  const updateTaskMood = (taskId, newMood) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, taskMood: newMood } : task
    ));
  };

  // Fonction pour enregistrer un commentaire d'humeur pour une tâche
  const saveTaskMoodComment = (taskId, comment) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, moodComment: comment } : task
    ));
  };

  // Fonction pour ajouter une nouvelle tâche
  const addNewTask = () => {
    if (newTask.title.trim() === '') return;
    
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      deadline: newTask.deadline || "Pas de deadline",
      status: "À faire",
      assignee: newTask.assignee || "Non assigné",
      taskMood: null,
      moodComment: ""
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', deadline: '', assignee: '' });
    setShowTaskForm(false);
  };

  // Fonction pour sauvegarder un enregistrement
  const handleSaveRecording = (blob, type) => {
    const newRecording = {
      id: Date.now(),
      type,
      blob,
      date: new Date().toLocaleString(),
      taskId: null
    };
    setRecordings([...recordings, newRecording]);
    if (type === 'audio') {
      setShowAudioRecorder(false);
    } else {
      setShowVideoRecorder(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En cours": return "bg-yellow-100 text-yellow-800";
      case "À faire": return "bg-blue-100 text-blue-800";
      case "Terminé": return "bg-green-100 text-green-800";
      case "Retard": return "bg-red-100 text-red-800";
      case "Bloqué": return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "En cours": return <Clock className="w-4 h-4 mr-1" />;
      case "À faire": return <AlertCircle className="w-4 h-4 mr-1" />;
      case "Terminé": return <Check className="w-4 h-4 mr-1" />;
      case "Retard": return <AlertTriangle className="w-4 h-4 mr-1" />;
      case "Bloqué": return <X className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getMoodEmoji = (moodType) => {
    switch (moodType) {
      case "excellent": return "😃";
      case "bon": return "🙂";
      case "neutre": return "😐";
      case "stresse": return "😟";
      case "epuise": return "😫";
      default: return null;
    }
  };

  // État pour le task actuellement en édition
  const [editingTask, setEditingTask] = useState(null);
  const [taskMoodComment, setTaskMoodComment] = useState("");

  return (
    <div className="flex">
      <Sidemenuuser />
      <div className="bg-gray-50 min-h-screen w-full">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold">Bonjour, Jean</h1>
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input className="bg-transparent outline-none text-sm" placeholder="Recherche..." />
          </div>
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">2</div>
        </header>

        <div className="container mx-auto p-4 grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Mes Tâches</h2>
               
              </div>

            
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-gray-300 pl-3 py-2">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-xs text-gray-500">{task.deadline || task.domain || task.time || task.urgency}</p>
                        <p className="text-xs text-gray-700">{task.assignee}</p>
                      </div>
                      
                      {/* Menu déroulant pour changer le statut */}
                      <div className="flex items-center">
                        <div className="relative">
                          <select 
                            className={`text-xs px-3 py-1 rounded-full mr-2 flex items-center ${getStatusColor(task.status)} appearance-none pr-6`}
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                          >
                            <option value="À faire">À faire</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                            <option value="Retard">Retard</option>
                            <option value="Bloqué">Bloqué</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-current" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Section d'humeur par tâche */}
                    {(task.status === "Terminé" || task.status === "Retard" || task.status === "Bloqué") && (
                      <div className="mt-2 bg-gray-50 p-2 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-medium">Comment vous sentez-vous après cette tâche ?</h4>
                          {task.taskMood && (
                            <button 
                              className="text-xs text-purple-500"
                              onClick={() => {
                                setEditingTask(task.id);
                                setTaskMoodComment(task.moodComment || "");
                              }}
                            >
                              {task.moodComment ? "Modifier" : "Ajouter un commentaire"}
                            </button>
                          )}
                        </div>
                        
                        {/* Sélection d'humeur par tâche */}
                        <div className="flex space-x-2 mb-2">
                          {["excellent", "bon", "neutre", "stresse", "epuise"].map((moodType) => (
                            <button
                              key={moodType}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                task.taskMood === moodType ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'
                              }`}
                              onClick={() => updateTaskMood(task.id, moodType)}
                            >
                              <span>{getMoodEmoji(moodType)}</span>
                            </button>
                          ))}
                        </div>
                        
                        {/* Affichage du commentaire d'humeur */}
                        {task.moodComment && !(editingTask === task.id) && (
                          <p className="text-xs italic text-gray-600 mt-1">{task.moodComment}</p>
                        )}
                        
                        {/* Interface d'édition du commentaire */}
                        {editingTask === task.id && (
                          <div className="mt-2">
                            <textarea
                              className="w-full text-xs p-2 border rounded-md"
                              placeholder="Pourquoi vous sentez-vous ainsi ?"
                              value={taskMoodComment}
                              onChange={(e) => setTaskMoodComment(e.target.value)}
                              rows={2}
                            />
                            <div className="flex justify-end mt-1 space-x-2">
                              <button 
                                className="text-xs text-gray-500"
                                onClick={() => setEditingTask(null)}
                              >
                                Annuler
                              </button>
                              <button 
                                className="text-xs bg-purple-500 text-white px-2 py-1 rounded"
                                onClick={() => {
                                  saveTaskMoodComment(task.id, taskMoodComment);
                                  setEditingTask(null);
                                }}
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-bold mb-4">Discussion d'équipe</h2>
              <div className="space-y-4">
                {discussions.map(discussion => (
                  <div key={discussion.id} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{discussion.author}</span>
                      <span className="text-xs text-gray-500">{discussion.time}</span>
                    </div>
                    <p className="text-sm">{discussion.content}</p>
                  </div>
                ))}
              </div>
              <div className="flex mt-4">
                <input 
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  placeholder="Envoyer un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="bg-purple-500 text-white px-4 py-2 rounded-lg ml-2 text-sm">Envoyer</button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Suivi d'humeur</h2>
                <span className="text-xs text-gray-500">Aujourd'hui</span>
              </div>
              <div className="flex justify-between mb-4">
                {["excellent", "bon", "neutre", "stresse", "epuise"].map((moodType) => (
                  <div key={moodType} className="flex flex-col items-center">
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${mood === moodType ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'}`}
                      onClick={() => setMood(moodType)}
                    >
                      <span className="text-lg">{getMoodEmoji(moodType)}</span>
                    </button>
                    <span className="text-xs">
                      {moodType === "excellent" ? "Excellent" : 
                       moodType === "bon" ? "Bon" : 
                       moodType === "neutre" ? "Neutre" : 
                       moodType === "stresse" ? "Stressé" : "Épuisé"}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-medium">Commentaire sur votre humeur</h4>
                  <button 
                    className="text-xs text-purple-500"
                    onClick={() => setShowMoodCommentInput(!showMoodCommentInput)}
                  >
                    {showMoodCommentInput ? "Masquer" : "Modifier"}
                  </button>
                </div>
                
                {showMoodCommentInput ? (
                  <div>
                    <textarea
                      className="w-full text-xs p-2 border rounded-md"
                      value={moodComment}
                      onChange={(e) => setMoodComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-1">
                      <button 
                        className="text-xs bg-purple-500 text-white px-2 py-1 rounded"
                        onClick={() => setShowMoodCommentInput(false)}
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs italic text-gray-600">{moodComment}</p>
                )}
              </div>
              
              <button 
                className="w-full bg-purple-500 text-white py-2 rounded-md text-sm"
                onClick={() => alert(`Humeur enregistrée: ${mood} - ${moodComment}`)}
              >
                Enregistrer l'humeur
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold mb-4">Statistiques des tâches</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tâches terminées</span>
                  <span className="text-sm font-medium">
                    {tasks.filter(t => t.status === "Terminé").length} / {tasks.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tâches en retard</span>
                  <span className="text-sm font-medium text-red-500">
                    {tasks.filter(t => t.status === "Retard").length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tâches bloquées</span>
                  <span className="text-sm font-medium text-purple-500">
                    {tasks.filter(t => t.status === "Bloqué").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold mb-4">Outils rapides</h2>
              
              {showAudioRecorder && (
                <MediaRecorder 
                  type="audio" 
                  onSave={(blob) => handleSaveRecording(blob, 'audio')}
                />
              )}
              
              {showVideoRecorder && (
                <MediaRecorder 
                  type="video" 
                  onSave={(blob) => handleSaveRecording(blob, 'video')}
                />
              )}

              {!showAudioRecorder && !showVideoRecorder && (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setShowAudioRecorder(true)}
                    className="bg-gray-100 p-4 rounded-lg flex flex-col items-center hover:bg-gray-200 transition"
                  >
                    <div className="w-6 h-6 mb-2">🎤</div>
                    <span className="text-xs">Audio</span>
                  </button>
                  <button 
                    onClick={() => setShowVideoRecorder(true)}
                    className="bg-gray-100 p-4 rounded-lg flex flex-col items-center hover:bg-gray-200 transition"
                  >
                    <div className="w-6 h-6 mb-2">🎥</div>
                    <span className="text-xs">Vidéo</span>
                  </button>
                  <button className="bg-gray-100 p-4 rounded-lg flex flex-col items-center hover:bg-gray-200 transition">
                    <div className="w-6 h-6 mb-2">✏️</div>
                    <span className="text-xs">Dessin</span>
                  </button>
                  <button className="bg-gray-100 p-4 rounded-lg flex flex-col items-center hover:bg-gray-200 transition">
                    <div className="w-6 h-6 mb-2">🗺️</div>
                    <span className="text-xs">Mind Map</span>
                  </button>
                </div>
              )}
            </div>

            {recordings.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-semibold mb-4">Mes enregistrements</h2>
                <div className="space-y-3">
                  {recordings.map(recording => (
                    <div key={recording.id} className="border-b pb-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {recording.type === 'audio' ? 'Compte-rendu audio' : 'Compte-rendu vidéo'}
                        </span>
                        <span className="text-xs text-gray-500">{recording.date}</span>
                      </div>
                      {recording.type === 'audio' ? (
                        <audio 
                          src={URL.createObjectURL(recording.blob)} 
                          controls 
                          className="w-full mt-2"
                        />
                      ) : (
                        <video 
                          src={URL.createObjectURL(recording.blob)} 
                          controls 
                          className="w-full max-h-64 mt-2"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Documents Récents</h2>
                <button className="text-purple-500 text-xs">Voir tous</button>
              </div>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{doc.title}</h3>
                      <p className="text-xs text-gray-500">{doc.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}