import { AppState, Step } from '../types';
import { TEMPLATES, CONFIG } from '../config';
import { Check } from 'lucide-react';

interface DesignGalleryProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

export function DesignGallery({ appState, setAppState, onNavigate }: DesignGalleryProps) {
  const handleSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setAppState(prev => ({
        ...prev,
        selectedTemplateId: templateId,
        qrConfig: {
          x: template.defaultQrPosition.x,
          y: template.defaultQrPosition.y,
          size: template.defaultQrSize
        }
      }));
      onNavigate('preview');
    }
  };

  return (
    <div className="flex-grow bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your QR Design</h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Select a professional template. Your QR code will be automatically placed on it. 
            Each premium design costs just <strong className="text-white">₹{CONFIG.DESIGN_PRICE}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TEMPLATES.map((template) => (
            <div 
              key={template.id}
              className={`bg-zinc-900 rounded-2xl border-2 overflow-hidden flex flex-col group transition-all hover:shadow-xl ${
                appState.selectedTemplateId === template.id 
                  ? 'border-red-600 shadow-lg' 
                  : 'border-zinc-800 hover:border-red-900/50'
              }`}
            >
              <div className="relative aspect-[2/3] bg-zinc-950 overflow-hidden">
                <img 
                  src={template.image} 
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image not found
                    (e.target as HTMLImageElement).src = `https://placehold.co/800x1200/18181b/a1a1aa.png?text=${encodeURIComponent(template.name)}`;
                  }}
                />
                <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                  ₹{CONFIG.DESIGN_PRICE} ONLY
                </div>
                {appState.selectedTemplateId === template.id && (
                  <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                    <div className="bg-red-600 text-white rounded-full p-3 shadow-lg">
                      <Check className="h-8 w-8" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-red-500 mb-1 uppercase tracking-wider">Design {template.id}</div>
                  <h3 className="text-lg font-bold text-white leading-tight">{template.name}</h3>
                </div>
                
                <button
                  onClick={() => handleSelect(template.id)}
                  className={`w-full py-4 rounded-lg font-bold text-base transition-colors ${
                    appState.selectedTemplateId === template.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/20'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 group-hover:bg-red-950/30 group-hover:text-red-400'
                  }`}
                >
                  {appState.selectedTemplateId === template.id ? 'Selected' : 'Select Design'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
