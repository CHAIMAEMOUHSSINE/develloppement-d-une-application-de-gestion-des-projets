import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Filter, ChevronDown, 
  FileText, File, X, Download, Upload, Trash2, Eye, ExternalLink 
} from 'lucide-react';
import Sidemenuuser from '../components/Sidemenuuser';

const DocumentsPage = () => {
  // États
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState({ show: false, url: '', name: '', type: '' });
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: 'PDF',
    size: '',
    owner: ''
  });

  // Référence pour l'input file
  const fileInputRef = useRef(null);

  // Types de fichiers supportés
  const fileTypes = ['PDF', 'DOC', 'XLS', 'PPT', 'Figma', 'HTML'];

  // Fonction pour fermer la prévisualisation - CORRECTION DU BUG
  const closePreview = () => {
    setFilePreview({ show: false, url: '', name: '', type: '' });
  };

  // Fonction pour sauvegarder les documents dans un fichier JSON
  const saveDocumentsToJSON = async (documentsToSave) => {
    try {
      const response = await fetch('http://localhost:5000/api/documents/save-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents: documentsToSave }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde JSON');
      }

      console.log('Documents sauvegardés dans le fichier JSON');
    } catch (err) {
      console.error('Erreur de sauvegarde JSON:', err);
      // Sauvegarde locale en cas d'échec du serveur
      const dataStr = JSON.stringify(documentsToSave, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `documents_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Chargement initial
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/documents');
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setDocuments(data);
        setFilteredDocuments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Recherche et filtrage
  useEffect(() => {
    const filterDocuments = async () => {
      try {
        if (searchTerm) {
          const response = await fetch(`http://localhost:5000/api/documents/search?q=${searchTerm}`);
          const data = await response.json();
          setFilteredDocuments(data);
        } else {
          const response = await fetch('http://localhost:5000/api/documents');
          const data = await response.json();
          setFilteredDocuments(data);
        }
      } catch (err) {
        console.error("Erreur de recherche:", err);
      }
    };

    const timeoutId = setTimeout(() => {
      filterDocuments();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Filtrage par type
  useEffect(() => {
    if (selectedFilter !== 'Tous') {
      setFilteredDocuments(prev => 
        prev.filter(doc => doc.type === selectedFilter)
      );
    } else {
      setFilteredDocuments(documents);
    }
  }, [selectedFilter, documents]);

  // Fonction pour obtenir le type de fichier depuis l'extension
  const getFileTypeFromExtension = (filename) => {
    const extension = filename.split('.').pop().toUpperCase();
    
    switch(extension) {
      case 'PDF': return 'PDF';
      case 'DOC':
      case 'DOCX': return 'DOC';
      case 'XLS':
      case 'XLSX': return 'XLS';
      case 'PPT':
      case 'PPTX': return 'PPT';
      case 'FIG': return 'Figma';
      case 'HTML':
      case 'HTM': return 'HTML';
      default: return 'PDF';
    }
  };

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Gestion de l'importation de fichier avec sauvegarde JSON
  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Simulation d'un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Créer une URL pour prévisualiser le fichier
      const fileURL = URL.createObjectURL(file);

      // Créer un document simulé
      const simulatedDocument = {
        id: Date.now(),
        name: file.name,
        type: getFileTypeFromExtension(file.name),
        size: formatFileSize(file.size),
        owner: 'Utilisateur actuel',
        modifiedAt: new Date().toISOString(),
        fileURL: fileURL,
        originalFile: file,
        // Métadonnées supplémentaires pour le JSON
        uploadedAt: new Date().toISOString(),
        isImported: true
      };
      
      // Ajouter le document à la liste
      const updatedDocuments = [...documents, simulatedDocument];
      setDocuments(updatedDocuments);
      setFilteredDocuments([...filteredDocuments, simulatedDocument]);

      // Réinitialiser l'input
      fileInputRef.current.value = '';

      // Sauvegarder dans le fichier JSON
      await saveDocumentsToJSON(updatedDocuments);
      
      alert('Fichier importé et sauvegardé avec succès !');
    } catch (err) {
      console.error("Erreur d'importation:", err);
      alert("Erreur lors de l'importation du fichier");
    } finally {
      setUploading(false);
    }
  };

  // Fonction pour ouvrir/prévisualiser un fichier
  const handleOpenFile = (document) => {
    if (document.fileURL) {
      // Pour les fichiers importés localement
      if (document.type === 'PDF' || document.type === 'HTML') {
        // Ouvrir dans une nouvelle fenêtre pour PDF et HTML
        setFilePreview({
          show: true,
          url: document.fileURL,
          name: document.name,
          type: document.type
        });
      } else {
        // Pour les autres types, télécharger ou ouvrir avec l'application par défaut
        const link = document.createElement('a');
        link.href = document.fileURL;
        link.download = document.name;
        link.click();
      }
    } else {
      // Pour les documents depuis le serveur
      const serverUrl = `http://localhost:5000/api/documents/${document.id}/view`;
      window.open(serverUrl, '_blank');
    }
  };

  // Fonction pour télécharger un fichier
  const handleDownloadFile = (document) => {
    if (document.fileURL) {
      // Télécharger le fichier local
      const link = document.createElement('a');
      link.href = document.fileURL;
      link.download = document.name;
      link.click();
    } else {
      // Télécharger depuis le serveur
      const downloadUrl = `http://localhost:5000/api/documents/${document.id}/download`;
      window.open(downloadUrl, '_blank');
    }
  };

  // Déclencher la sélection de fichier
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument(prev => ({ ...prev, [name]: value }));
  };

  // Ajout de document manuel avec sauvegarde JSON
  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      const documentToAdd = {
        ...newDocument,
        id: Date.now(),
        modifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isImported: false
      };

      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentToAdd),
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout');

      const addedDocument = await response.json();
      const updatedDocuments = [...documents, addedDocument];
      setDocuments(updatedDocuments);

      // Sauvegarder dans le fichier JSON
      await saveDocumentsToJSON(updatedDocuments);

      setNewDocument({
        name: '',
        type: 'PDF',
        size: '',
        owner: ''
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de l'ajout du document");
    }
  };

  // Suppression de document avec mise à jour JSON
  const handleDeleteDocument = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce document ?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Erreur lors de la suppression');

        const updatedDocuments = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocuments);
        setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));

        // Mettre à jour le fichier JSON
        await saveDocumentsToJSON(updatedDocuments);
      } catch (err) {
        console.error("Erreur:", err);
        alert("Erreur lors de la suppression du document");
      }
    }
  };

  // Fonction pour exporter tous les documents en JSON
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `documents_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Icônes pour types de fichiers
  const getFileIcon = (type) => {
    const iconClass = "w-6 h-6";
    switch(type) {
      case 'PDF': return <FileText className={`${iconClass} text-red-500`} />;
      case 'DOC': return <FileText className={`${iconClass} text-blue-500`} />;
      case 'XLS': return <FileText className={`${iconClass} text-green-500`} />;
      case 'PPT': return <FileText className={`${iconClass} text-orange-500`} />;
      case 'Figma': return <FileText className={`${iconClass} text-purple-500`} />;
      default: return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Menu latéral */}
      <div className="w-64 bg-white shadow-md">
        <Sidemenuuser />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* En-tête avec barre de recherche fonctionnelle */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
           
          </div>

          {/* Barre d'actions */}
          <div className="flex flex-wrap gap-3 mb-8">
           

            <button
              onClick={triggerFileSelect}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Importation...' : 'Importer'}
            </button>

            <button
              onClick={handleExportJSON}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter JSON
            </button>

            {/* Input file caché */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileImport}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.htm,.fig"
              className="hidden"
            />

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedFilter}
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute z-10 mt-1 w-40 bg-white shadow-lg rounded-md border border-gray-200">
                  {['Tous', ...fileTypes].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedFilter(type);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedFilter === type 
                          ? 'bg-purple-50 text-purple-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Indicateur de téléversement */}
          {uploading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-700">Importation en cours...</span>
              </div>
            </div>
          )}

          {/* Tableau des documents */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-500">
              <div className="col-span-4">Nom</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Taille</div>
              <div className="col-span-2">Modifié</div>
              <div className="col-span-2">Actions</div>
            </div>

            {loading ? (
              <div className="p-6 text-center text-gray-500">Chargement...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">Aucun document trouvé</div>
            ) : (
              filteredDocuments.map(doc => (
                <div key={doc.id} className="grid grid-cols-12 px-6 py-4 border-b hover:bg-gray-50">
                  <div className="col-span-4 flex items-center space-x-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-500">
                        {doc.owner} {doc.isImported && <span className="text-green-600">(Importé)</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {doc.type}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {doc.size}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500">
                    {new Date(doc.modifiedAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button 
                      onClick={() => handleOpenFile(doc)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Ouvrir"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDownloadFile(doc)}
                      className="text-green-500 hover:text-green-700 p-1"
                      title="Télécharger"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de prévisualisation */}
      {filePreview.show && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-3/4 mx-4 flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">{filePreview.name}</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => window.open(filePreview.url, '_blank')}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Ouvrir dans un nouvel onglet"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button 
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              {filePreview.type === 'PDF' ? (
                <iframe
                  src={filePreview.url}
                  className="w-full h-full border rounded"
                  title={filePreview.name}
                />
              ) : filePreview.type === 'HTML' ? (
                <iframe
                  src={filePreview.url}
                  className="w-full h-full border rounded"
                  title={filePreview.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <File className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      Aperçu non disponible pour ce type de fichier
                    </p>
                    <button
                      onClick={() => window.open(filePreview.url, '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Ouvrir le fichier
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Nouveau Document</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDocument} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du document *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newDocument.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={newDocument.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    {fileTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille *
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={newDocument.size}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                    placeholder="ex: 2.5 MB"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Propriétaire *
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={newDocument.owner}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;