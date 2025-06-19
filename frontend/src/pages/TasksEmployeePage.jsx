import { useState, useEffect } from 'react';
import { MessageCircle, FileText, Search, AlertCircle, Check, X, Clock, AlertTriangle, ChevronDown, Plus } from 'lucide-react';
import Sidemenuuser from '../components/Sidemenuuser';
import MediaRecorder from '../components/MediaRecorder';

export default function TasksEmployeePage() {
  // État pour les tâches
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // État global de l'humeur
  const [mood, setMood] = useState(null);
  const [moodComment, setMoodComment] = useState('');
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

  // État pour le task actuellement en édition
  const [editingTask, setEditingTask] = useState(null);
  const [taskMoodComment, setTaskMoodComment] = useState("");

  // État pour les discussions
  const [discussions, setDiscussions] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);

  // Charger les tâches, le feedback quotidien et les messages au chargement du composant
  useEffect(() => {
    fetchEmployeeTasks();
    fetchDailyFeedback();
    fetchChatMessages();
  }, []);

  // Récupérer les tâches de l'employé
  const fetchEmployeeTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employee-tasks', {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des tâches');
      }

      const enhancedTasks = await Promise.all(data.data.map(async (task) => {
        try {
          const feedbackResponse = await fetch(`http://localhost:5000/api/employee-tasks/${task.id}/feedback`, {
            headers: {
              'x-auth-token': token
            }
          });
          const feedbackData = await feedbackResponse.json();
          return {
            ...task,
            taskMood: feedbackData?.data?.mood || null,
            moodComment: feedbackData?.data?.comment || ""
          };
        } catch (err) {
          console.error(`Error fetching feedback for task ${task.id}:`, err);
          return {
            ...task,
            taskMood: null,
            moodComment: ""
          };
        }
      }));
      
      setTasks(enhancedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Impossible de charger les tâches. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer le feedback quotidien
  const fetchDailyFeedback = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/daily-feedback', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du feedback quotidien');
      }
      
      const data = await response.json();
      if (data.data) {
        setMood(data.data.mood);
        setMoodComment(data.data.comment || '');
      }
    } catch (err) {
      console.error('Error fetching daily feedback:', err);
    }
  };

  // Récupérer les messages du chat
  const fetchChatMessages = async () => {
    try {
      setChatLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chat/messages', {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des messages');
      }

      // Formater les messages pour correspondre à la structure attendue
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        author: msg.author,
        time: msg.time || new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: msg.content
      }));

      setDiscussions(formattedMessages);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setChatLoading(false);
    }
  };

  // Envoyer un nouveau message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user')); // Supposons que les infos utilisateur sont stockées

      const response = await fetch('http://localhost:5000/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          author: user?.name || 'Anonyme',
          content: newMessage
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      // Recharger les messages après envoi
      await fetchChatMessages();
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Impossible d\'envoyer le message. Veuillez réessayer.');
    }
  };

  // Enregistrer le feedback quotidien
  const saveDailyFeedback = async () => {
    try {
      if (!mood) {
        alert('Veuillez sélectionner une humeur');
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/daily-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          mood,
          comment: moodComment
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du feedback');
      }

      alert('Votre humeur quotidienne a été enregistrée avec succès');
    } catch (err) {
      console.error('Error saving daily feedback:', err);
      alert('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  // Fonction pour changer le statut d'une tâche
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employee-tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Impossible de mettre à jour le statut de la tâche. Veuillez réessayer.');
    }
  };

  // Fonction pour mettre à jour l'humeur associée à une tâche
  const handleUpdateTaskMood = async (taskId, newMood) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employee-tasks/${taskId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ 
          mood: newMood,
          comment: task.moodComment || ""
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'humeur');
      }
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, taskMood: newMood } : task
      ));
    } catch (err) {
      console.error('Error updating task mood:', err);
      alert('Impossible d\'enregistrer votre ressenti. Veuillez réessayer.');
    }
  };

  // Fonction pour enregistrer un commentaire d'humeur pour une tâche
  const handleSaveTaskMoodComment = async (taskId, comment) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employee-tasks/${taskId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          mood: task.taskMood || 'neutre',
          comment
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du commentaire');
      }
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, moodComment: comment } : task
      ));
    } catch (err) {
      console.error('Error saving task mood comment:', err);
      alert('Impossible d\'enregistrer votre commentaire. Veuillez réessayer.');
    }
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
      case "EN COURS": return "bg-yellow-100 text-yellow-800";
      case "OUVERT": return "bg-blue-100 text-blue-800";
      case "TERMINÉ": return "bg-green-100 text-green-800";
      case "RÉVISION": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "EN COURS": return <Clock className="w-4 h-4 mr-1" />;
      case "OUVERT": return <AlertCircle className="w-4 h-4 mr-1" />;
      case "TERMINÉ": return <Check className="w-4 h-4 mr-1" />;
      case "RÉVISION": return <AlertTriangle className="w-4 h-4 mr-1" />;
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

  return (
   <div className="flex">
          <div className="fixed top-0 left-0 h-screen w-72 bg-white shadow z-50">
            <Sidemenuuser />
          </div>
      <div className="ml-72 w-full overflow-auto bg-gray-50 p-6 flex items-center justify-center">
       
      
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Tâches Assignées</h2>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-800 p-4 rounded-md">
                  {error}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune tâche assignée pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="border-l-4 border-gray-300 pl-3 py-2">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-semibold">{task.name}</h3>
                          <p className="text-xs text-gray-500">Projet: {task.projectName}</p>
                          <p className="text-xs text-gray-500">Équipe: {task.teamName}</p>
                          <p className="text-xs text-gray-500">Date limite: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="relative">
                            <select 
                              className={`text-xs px-3 py-1 rounded-full mr-2 flex items-center ${getStatusColor(task.status)} appearance-none pr-6`}
                              value={task.status}
                              onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            >
                              <option value="OUVERT">À faire</option>
                              <option value="EN COURS">En cours</option>
                              <option value="RÉVISION">En révision</option>
                              <option value="TERMINÉ">Terminé</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-current" />
                          </div>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      {(task.status === "TERMINÉ" || task.status === "RÉVISION") && (
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
                          
                          <div className="flex space-x-2 mb-2">
                            {["excellent", "bon", "neutre", "stresse", "epuise"].map((moodType) => (
                              <button
                                key={moodType}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  task.taskMood === moodType ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'
                                }`}
                                onClick={() => handleUpdateTaskMood(task.id, moodType)}
                              >
                                <span>{getMoodEmoji(moodType)}</span>
                              </button>
                            ))}
                          </div>
                          
                          {task.moodComment && !(editingTask === task.id) && (
                            <p className="text-xs italic text-gray-600 mt-1">{task.moodComment}</p>
                          )}
                          
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
                                    handleSaveTaskMoodComment(task.id, taskMoodComment);
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
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-bold mb-4">Discussion d'équipe</h2>
              {chatLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg ml-2 text-sm"
                      onClick={handleSendMessage}
                    >
                      Envoyer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Suivi d'humeur quotidien</h2>
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
                onClick={saveDailyFeedback}
              >
                Enregistrer l'humeur quotidienne
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold mb-4">Statistiques des tâches</h2>
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tâches terminées</span>
                    <span className="text-sm font-medium">
                      {tasks.filter(t => t.status === "TERMINÉ").length} / {tasks.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tâches en cours</span>
                    <span className="text-sm font-medium text-yellow-500">
                      {tasks.filter(t => t.status === "EN COURS").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tâches en révision</span>
                    <span className="text-sm font-medium text-purple-500">
                      {tasks.filter(t => t.status === "RÉVISION").length}
                    </span>
                  </div>
                </div>
              )}
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

           
          </div>
        </div>
      </div>
    </div>
  );
}