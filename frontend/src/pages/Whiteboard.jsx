import { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight, Square, Circle, ArrowRight, Type, ImageIcon, Grid, Move, Trash2 } from 'lucide-react';
import Sidemenuuser from '../components/Sidemenuuser';

export default function WhiteboardApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState('move');
  const [elements, setElements] = useState([
    {
      id: 'card-1',
      type: 'card',
      content: {
        title: 'Idées de Design',
        items: ['Nouvelle palette', 'Refonte landing page', 'Animations UI'],
        color: 'orange'
      },
      position: { x: 128, y: 80 },
      size: { width: 240, height: 'auto' }
    },
    {
      id: 'card-2',
      type: 'card',
      content: {
        title: 'Tâches Prioritaires',
        items: ['Maquettes mobile', 'Prototypes interactifs', 'Tests utilisateurs'],
        color: 'blue',
        numbered: true
      },
      position: { x: 480, y: 80 },
      size: { width: 256, height: 'auto' }
    },
    {
      id: 'arrow-1',
      type: 'arrow',
      position: { x: 384, y: 192 },
      size: { width: 180, height: 48 }
    },
   
  ]);
  
  const [currentElement, setCurrentElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [saved, setSaved] = useState(true);
  
  const boardRef = useRef(null);
  
  // Handle tool selection
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
  };
  
  // Handle element dragging
  const startDrag = (e, elementId) => {
    if (selectedTool !== 'move') return;
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    const board = boardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - (board.left + element.position.x);
    const offsetY = e.clientY - (board.top + element.position.y);
    
    setCurrentElement(elementId);
    setIsDragging(true);
    setDragOffset({ x: offsetX, y: offsetY });
    setSaved(false);
  };
  
  const onDrag = (e) => {
    if (!isDragging || !currentElement) return;
    
    const board = boardRef.current.getBoundingClientRect();
    const newX = e.clientX - board.left - dragOffset.x;
    const newY = e.clientY - board.top - dragOffset.y;
    
    setElements(elements.map(el => {
      if (el.id === currentElement) {
        return {
          ...el,
          position: { x: newX, y: newY }
        };
      }
      return el;
    }));
  };
  
  const endDrag = () => {
    setIsDragging(false);
    setCurrentElement(null);
  };
  
  // Create new element
  const createNewElement = (e) => {
    if (selectedTool === 'move') return;
    
    const board = boardRef.current.getBoundingClientRect();
    const x = e.clientX - board.left;
    const y = e.clientY - board.top;
    
    const id = `element-${Date.now()}`;
    let newElement = {
      id,
      position: { x, y }
    };
    
    switch (selectedTool) {
      case 'square':
        newElement = {
          ...newElement,
          type: 'shape',
          shapeType: 'square',
          size: { width: 100, height: 100 },
          style: { borderColor: 'purple', borderWidth: 2 }
        };
        break;
      case 'circle':
        newElement = {
          ...newElement,
          type: 'shape',
          shapeType: 'circle',
          size: { width: 100, height: 100 },
          style: { borderColor: 'purple', borderWidth: 2 }
        };
        break;
      case 'arrow':
        newElement = {
          ...newElement,
          type: 'arrow',
          size: { width: 150, height: 48 }
        };
        break;
      case 'text':
        newElement = {
          ...newElement,
          type: 'text',
          content: { text: 'Double-cliquez pour éditer' },
          size: { width: 200, height: 'auto' }
        };
        break;
      case 'image':
        newElement = {
          ...newElement,
          type: 'image',
          content: { src: '/api/placeholder/200/150', alt: 'Image placeholder' },
          size: { width: 200, height: 150 }
        };
        break;
      default:
        return;
    }
    
    setElements([...elements, newElement]);
    setSaved(false);
  };
  
  // Handle text editing
  const [editingText, setEditingText] = useState(null);
  
  const startEditing = (elementId) => {
    if (selectedTool !== 'move') return;
    setEditingText(elementId);
  };
  
  const handleTextChange = (elementId, newText) => {
    setElements(elements.map(el => {
      if (el.id === elementId) {
        return {
          ...el,
          content: { ...el.content, text: newText }
        };
      }
      return el;
    }));
    setSaved(false);
  };
  
  const finishEditing = () => {
    setEditingText(null);
  };
  
  // Delete element
  const deleteElement = (elementId) => {
    setElements(elements.filter(el => el.id !== elementId));
    setSaved(false);
  };
  
  // Save whiteboard
  const saveWhiteboard = () => {
    // In a real application, you would save to a database or backend
    console.log('Saving whiteboard data:', elements);
    alert('Whiteboard enregistré avec succès!');
    setSaved(true);
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete selected element with Delete key
      if (e.key === 'Delete' && currentElement) {
        deleteElement(currentElement);
        setCurrentElement(null);
      }
      
      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveWhiteboard();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentElement]);
  
  return (
    <div className="flex">
      <Sidemenuuser/>
   
      <div className="flex w-full h-screen bg-gray-50">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h1 className="text-lg font-medium">Mes Whiteboards</h1>
            
            <div className="flex items-center">
            
              
              <button 
                className={`${saved ? 'bg-gray-300' : 'bg-purple-500'} text-white px-4 py-2 rounded-full text-sm transition-colors`}
                onClick={saveWhiteboard}
                disabled={saved}
              >
                {saved ? 'Enregistré' : 'Enregistrer'}
              </button>
            </div>
          </div>
          
          {/* Tools Column */}
          <div className="flex flex-1">
            <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
              <button 
                className={`${selectedTool === 'move' ? 'text-purple-500' : 'text-gray-500'} hover:text-purple-500`}
                onClick={() => handleToolSelect('move')}
                title="Déplacer"
              >
                <Move size={20} />
              </button>
              <button 
                className={`${selectedTool === 'square' ? 'text-purple-500' : 'text-gray-500'} hover:text-purple-500`}
                onClick={() => handleToolSelect('square')}
                title="Rectangle"
              >
                <Square size={20} />
              </button>
              <button 
                className={`${selectedTool === 'circle' ? 'text-purple-500' : 'text-gray-500'} hover:text-purple-500`}
                onClick={() => handleToolSelect('circle')}
                title="Cercle"
              >
                <Circle size={20} />
              </button>
              <button 
                className={`${selectedTool === 'arrow' ? 'text-purple-500' : 'text-gray-500'} hover:text-purple-500`}
                onClick={() => handleToolSelect('arrow')}
                title="Flèche"
              >
                <ArrowRight size={20} />
              </button>
              <button 
                className={`${selectedTool === 'text' ? 'text-purple-500' : 'text-gray-500'} hover:text-purple-500`}
                onClick={() => handleToolSelect('text')}
                title="Texte"
              >
                <Type size={20} />
              </button>
              <button 
                className={`${selectedTool === 'image' ? 'text-purple-500' : 'text-gray-500'} hover:text-purple-500`}
                onClick={() => handleToolSelect('image')}
                title="Image"
              >
                <ImageIcon size={20} />
              </button>
              <div className="border-t border-gray-200 pt-4 mt-2"></div>
              <button 
                className="text-red-500 hover:text-red-600"
                onClick={() => currentElement && deleteElement(currentElement)}
                title="Supprimer"
              >
                <Trash2 size={20} />
              </button>
            </div>
            
            {/* Whiteboard Area */}
            <div 
              ref={boardRef}
              className="flex-1 p-0 relative bg-gray-50 overflow-hidden cursor-default"
              style={{ cursor: selectedTool === 'move' ? 'default' : 'crosshair' }}
              onClick={createNewElement}
              onMouseMove={onDrag}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
            >
              {elements.map((element) => {
                switch (element.type) {
                  case 'card':
                    return (
                      <div
                        key={element.id}
                        className={`absolute bg-${element.content.color}-100 p-4 rounded shadow-sm cursor-move`}
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          border: currentElement === element.id ? '2px dashed purple' : 'none',
                          zIndex: currentElement === element.id ? 10 : 1
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDrag(e, element.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEditing(element.id);
                        }}
                      >
                        <h3 className="font-medium mb-2">{element.content.title}</h3>
                        {element.content.numbered ? (
                          <ol className="text-sm ml-5 list-decimal">
                            {element.content.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ol>
                        ) : (
                          <ul className="text-sm">
                            {element.content.items.map((item, idx) => (
                              <li key={idx}>- {item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  
                  case 'shape':
                    return (
                      <div
                        key={element.id}
                        className={`absolute cursor-move`}
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          border: element.shapeType === 'square' ? `${element.style.borderWidth}px solid ${element.style.borderColor}` : 'none',
                          borderRadius: element.shapeType === 'circle' ? '50%' : '0',
                          outline: element.shapeType === 'circle' ? `${element.style.borderWidth}px solid ${element.style.borderColor}` : 'none',
                          zIndex: currentElement === element.id ? 10 : 1
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDrag(e, element.id);
                        }}
                      ></div>
                    );
                  
                  case 'arrow':
                    return (
                      <div
                        key={element.id}
                        className="absolute flex items-center cursor-move"
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          zIndex: currentElement === element.id ? 10 : 1
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDrag(e, element.id);
                        }}
                      >
                        <div className="w-32 h-12 border-2 border-purple-500 rounded"></div>
                        <div className="ml-2 text-purple-500">
                          <ArrowRight size={24} />
                        </div>
                      </div>
                    );
                  
                  case 'text':
                    return (
                      <div
                        key={element.id}
                        className="absolute cursor-move"
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          minHeight: '30px',
                          zIndex: currentElement === element.id ? 10 : 1,
                          border: currentElement === element.id ? '1px dashed purple' : 'none'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDrag(e, element.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startEditing(element.id);
                        }}
                      >
                        {editingText === element.id ? (
                          <textarea
                            className="w-full p-2 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={element.content.text}
                            onChange={(e) => handleTextChange(element.id, e.target.value)}
                            onBlur={finishEditing}
                            autoFocus
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="p-2">{element.content.text}</p>
                        )}
                      </div>
                    );
                  
                  case 'image':
                    return (
                      <div
                        key={element.id}
                        className="absolute cursor-move"
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          zIndex: currentElement === element.id ? 10 : 1,
                          border: currentElement === element.id ? '2px dashed purple' : 'none'
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDrag(e, element.id);
                        }}
                      >
                        <img 
                          src={element.content.src} 
                          alt={element.content.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  
                  case 'sprint':
                    return (
                      <div
                        key={element.id}
                        className="absolute border border-gray-300 border-dashed p-4 rounded cursor-move"
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                          zIndex: currentElement === element.id ? 10 : 1
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          startDrag(e, element.id);
                        }}
                      >
                        <h3 className="text-center mb-4">{element.content.title}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {element.content.months.map((month, idx) => (
                            <div key={idx} className="bg-gray-200 p-3 text-center rounded">{month}</div>
                          ))}
                        </div>
                      </div>
                    );
                  
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}