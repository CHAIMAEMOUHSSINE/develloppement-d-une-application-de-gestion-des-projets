import { useState } from 'react';
import { ArrowLeft, Save, X, User, Mail, Calendar, Building, Briefcase } from 'lucide-react';

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    startDate: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Nettoyer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.department) newErrors.department = "Le département est requis";
    if (!formData.position.trim()) newErrors.position = "La position est requise";
    if (!formData.startDate) newErrors.startDate = "La date d'adhésion est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Données soumises:', formData);
      
      // Afficher la notification
      setShowNotification(true);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      // Réinitialiser le formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        startDate: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedFields = Object.values(formData).filter(Boolean).length;
  const progressPercentage = (completedFields / 7) * 100;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Notification de succès */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center z-50">
          <div className="mr-2">✅</div>
          <div>Employé ajouté avec succès!</div>
          <button 
            onClick={() => setShowNotification(false)}
            className="ml-4 text-green-700 hover:text-green-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* En-tête */}
      <div className="bg-white p-4 shadow-sm mb-6">
        <div className="max-w-6xl mx-auto flex items-center">
          <button className="mr-4 text-gray-500 hover:text-purple-700 transition-colors duration-200">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-medium text-gray-800">Ajouter un employé</h1>
        </div>
      </div>

      {/* Formulaire principal */}
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          {/* Progrès du formulaire */}
          <div className="mb-8">
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-600 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right">
              {completedFields}/7 champs complétés
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <User size={20} className="text-purple-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-700">Informations personnelles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                    Prénom<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Ex: Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                    Nom<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Ex: Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="col-span-2 mt-4">
              <div className="flex items-center mb-4">
                <Briefcase size={20} className="text-purple-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-700">Informations professionnelles</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    <div className="flex items-center">
                      <Mail size={16} className="mr-1 text-gray-500" />
                      Email<span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="nom@entreprise.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-500" />
                      Date d'adhésion<span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                    <div className="flex items-center">
                      <Building size={16} className="mr-1 text-gray-500" />
                      Département<span className="text-red-500">*</span>
                    </div>
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 bg-white`}
                  >
                    <option value="">Sélectionner un département</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">Ressources Humaines</option>
                    <option value="Sales">Ventes</option>
                  </select>
                  {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position">
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1 text-gray-500" />
                      Position<span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    placeholder="Ex: Développeur Frontend"
                    value={formData.position}
                    onChange={handleChange}
                    className={`w-full p-2 border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200`}
                  />
                  {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-purple-50 transition-colors duration-200">
                    <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${formData.status === 'active' ? 'border-purple-600' : 'border-gray-300'}`}>
                      {formData.status === 'active' && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div>
                      <span className="font-medium">Actif</span>
                      <p className="text-xs text-gray-500">L'employé est actuellement en service</p>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-purple-50 transition-colors duration-200">
                    <div className={`w-5 h-5 rounded-full border-2 mr-2 flex items-center justify-center ${formData.status === 'leave' ? 'border-purple-600' : 'border-gray-300'}`}>
                      {formData.status === 'leave' && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                    </div>
                    <input
                      type="radio"
                      name="status"
                      value="leave"
                      checked={formData.status === 'leave'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div>
                      <span className="font-medium">En congé</span>
                      <p className="text-xs text-gray-500">L'employé est temporairement absent</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-200"
            >
              <X size={18} className="mr-2" />
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center transition-colors duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}