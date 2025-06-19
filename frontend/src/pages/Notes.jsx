import React, { useState, useEffect } from 'react';
import { Bold, Italic, Underline, List, AlignLeft, Save, Plus, Search, X, Trash2 } from 'lucide-react';
import Sidemenuuser from '../components/Sidemenuuser';

const NotesPage = () => {
  // États
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Chargement initial des notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notes');
        if (!response.ok) throw new Error('Erreur de chargement des notes');
        const data = await response.json();
        setNotes(data);
        setFilteredNotes(data);
        if (data.length > 0) setActiveNoteId(data[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Recherche de notes
  useEffect(() => {
    const searchNotes = async () => {
      try {
        if (searchTerm) {
          const response = await fetch(`http://localhost:5000/api/notes/search?q=${searchTerm}`);
          if (!response.ok) throw new Error('Erreur de recherche');
          const data = await response.json();
          setFilteredNotes(data);
        } else {
          setFilteredNotes(notes);
        }
      } catch (err) {
        console.error("Erreur de recherche:", err);
      }
    };

    const timeoutId = setTimeout(() => {
      searchNotes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, notes]);

  // Fonction pour récupérer la note active
  const getActiveNote = () => {
    return notes.find(note => note.id === activeNoteId) || {};
  };

  // Ajouter une nouvelle note
  const addNewNote = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: "Nouvelle note"
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la création de la note');

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setActiveNoteId(newNote.id);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la création de la note");
    }
  };

  // Mettre à jour le contenu d'une note
  const updateNoteContent = async (content) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${activeNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      const updatedNote = await response.json();
      setNotes(notes.map(note => 
        note.id === activeNoteId ? updatedNote : note
      ));
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la mise à jour de la note");
    }
  };

  // Mettre à jour le titre d'une note
  const updateNoteTitle = async (title) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${activeNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour du titre');

      const updatedNote = await response.json();
      setNotes(notes.map(note => 
        note.id === activeNoteId ? updatedNote : note
      ));
      setEditingTitle(false);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la mise à jour du titre");
    }
  };

  // Supprimer une note
  const deleteNote = async () => {
    if (notes.length <= 1) {
      alert("Vous ne pouvez pas supprimer la dernière note.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${activeNoteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      // Filtrer les notes pour supprimer celle qui a été supprimée
      const updatedNotes = notes.filter(note => note.id !== activeNoteId);
      setNotes(updatedNotes);
      setFilteredNotes(filteredNotes.filter(note => note.id !== activeNoteId));
      
      // Sélectionner la première note après suppression
      if (updatedNotes.length > 0) {
        setActiveNoteId(updatedNotes[0].id);
      } else {
        setActiveNoteId(null);
      }
      
      setConfirmDeleteModal(false);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la suppression de la note");
    }
  };

  // Pour modifier le contenu d'une note en temps réel (avant de sauvegarder)
  const handleContentChange = (e) => {
    const content = e.target.value;
    setNotes(notes.map(note => {
      if (note.id === activeNoteId) {
        return { ...note, content };
      }
      return note;
    }));
  };

  // Pour modifier le titre d'une note en temps réel (avant de sauvegarder)
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setNotes(notes.map(note => {
      if (note.id === activeNoteId) {
        return { ...note, title };
      }
      return note;
    }));
  };

  // Pour sauvegarder une note
  const saveNote = async () => {
    const activeNote = getActiveNote();
    if (!activeNote) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notes/${activeNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: activeNote.title,
          content: activeNote.content
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      const updatedNote = await response.json();
      setNotes(notes.map(note => 
        note.id === activeNoteId ? updatedNote : note
      ));
      
      alert("Note sauvegardée avec succès");
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la sauvegarde de la note");
    }
  };

  const activeNote = getActiveNote();

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Menu latéral */}
      <div className="w-64 bg-white shadow-md">
        <Sidemenuuser />
      </div>

      <div className="flex w-full">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="font-semibold text-gray-700">Mes Notes</h1>
            <div className="mt-2 relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full px-3 py-1.5 pl-8 rounded border border-gray-300 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2 text-gray-400 w-4 h-4" />
            </div>
            <button 
              className="mt-4 bg-purple-600 text-white w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center"
              onClick={addNewNote}
            >
              <Plus size={16} className="mr-1" /> Nouvelle Note
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Chargement...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune note ne correspond à votre recherche
              </div>
            ) : (
              filteredNotes.map(note => (
                <div 
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer ${
                    activeNoteId === note.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <h2 className="font-medium text-gray-800">{note.title}</h2>
                  <p className="text-sm text-gray-500 mt-1 truncate">{note.preview}</p>
                  <p className="text-xs text-gray-400 mt-2">{note.lastModified}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 text-xs text-gray-500 border-t border-gray-200">
            {notes.length} notes
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 flex items-center">
            <div className="flex space-x-4 text-gray-500">
              <button className="p-1 rounded hover:bg-gray-100">
                <Bold size={18} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <Italic size={18} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <Underline size={18} />
              </button>
              <span className="border-r border-gray-300 mx-2"></span>
              <button className="p-1 rounded hover:bg-gray-100">
                <List size={18} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100">
                <AlignLeft size={18} />
              </button>
            </div>
            <div className="ml-auto flex space-x-2">
              <button 
                className="text-red-500 px-4 py-1 rounded text-sm font-medium flex items-center hover:bg-red-50"
                onClick={() => setConfirmDeleteModal(true)}
              >
                <Trash2 size={16} className="mr-1" />
                Supprimer
              </button>
              <button 
                className="bg-purple-600 text-white px-4 py-1 rounded text-sm font-medium flex items-center"
                onClick={saveNote}
              >
                <Save size={16} className="mr-1" />
                Enregistrer
              </button>
            </div>
          </div>
          
          {/* Note Content */}
          {activeNote ? (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {editingTitle ? (
                  <input
                    type="text"
                    className="text-2xl font-bold text-gray-800 mb-2 w-full border-b border-purple-300 focus:outline-none focus:border-purple-600"
                    value={activeNote.title || ''}
                    onChange={handleTitleChange}
                    onBlur={() => updateNoteTitle(activeNote.title)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateNoteTitle(activeNote.title);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <h1 
                    className="text-2xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-purple-600"
                    onClick={() => setEditingTitle(true)}
                  >
                    {activeNote.title || 'Sans titre'}
                  </h1>
                )}
                <p className="text-xs text-gray-500 mb-6">
                  {activeNote.lastModified || 'Jamais modifié'}
                </p>
                
                <textarea
                  className="w-full h-full min-h-96 p-2 border border-gray-200 rounded focus:outline-none focus:border-purple-300"
                  value={activeNote.content || ''}
                  onChange={handleContentChange}
                  placeholder="Commencez à écrire ici..."
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sélectionnez une note ou créez-en une nouvelle
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmer la suppression</h2>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setConfirmDeleteModal(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={deleteNote}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;