import { AppState, Step } from '../types';
import { TEMPLATES, CONFIG } from '../config';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface DesignGalleryProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DesignGallery({ appState, setAppState, onNavigate }: DesignGalleryProps) {
  const handleSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setAppState(prev => ({
        ...prev,
        selectedTemplateId: templateId
      }));
      onNavigate('preview');
    }
  };

  return (
    <div className="flex-grow bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Choose Your <span className="text-indigo-400">QR Design</span></h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Select a professional template. Your QR code will be automatically placed in the center. 
            Each premium design costs just <strong className="text-white">₹{CONFIG.DESIGN_PRICE}</strong>.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {TEMPLATES.map((template) => (
            <motion.div 
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              key={template.id}
              className={`bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-800 overflow-hidden flex flex-col group transition-all shadow-lg ${
                appState.selectedTemplateId === template.id 
                  ? 'ring-2 ring-indigo-500 shadow-indigo-500/20' 
                  : 'hover:shadow-indigo-500/10'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative aspect-[2/3] bg-slate-950 overflow-hidden rounded-t-3xl border-b border-slate-800/50 p-2">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img 
                    src={template.image} 
                    alt={`Design ${template.id}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/2480x3508/0f172a/94a3b8.png?text=Design+${template.id}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="absolute top-5 right-5 bg-indigo-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-indigo-500/50 z-10 transform translate-z-[20px]">
                  ₹{CONFIG.DESIGN_PRICE} ONLY
                </div>

                {appState.selectedTemplateId === template.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-t-2xl"
                  >
                    <div className="bg-indigo-600 text-white rounded-full p-4 shadow-2xl shadow-indigo-900 border border-indigo-400/30">
                      <Check className="h-10 w-10" />
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors">Design {template.id}</h3>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(template.id)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                    appState.selectedTemplateId === template.id
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-900/50 border border-indigo-400/30'
                      : 'bg-slate-800/80 backdrop-blur-sm text-slate-300 hover:bg-slate-700 border border-slate-700/50 group-hover:border-indigo-500/30 group-hover:bg-indigo-950/40 group-hover:text-indigo-300'
                  }`}
                >
                  {appState.selectedTemplateId === template.id ? 'Selected' : 'Select Design'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
