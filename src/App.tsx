import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Step } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { WhatsAppGenerator } from './components/WhatsAppGenerator';
import { QRGenerator } from './components/QRGenerator';
import { DesignGallery } from './components/DesignGallery';
import { LivePreview } from './components/LivePreview';
import { Download } from './components/Download';

const initialState: AppState = {
  step: 'home',
  whatsappLink: '',
  qrCodeDataUrl: '',
  selectedTemplateId: null,
  qrOptions: {
    color: '#000000',
    ecl: 'H',
    logo: null,
  },
  paymentInfo: null
};

export default function App() {
  const [appState, setAppState] = useState<AppState>(initialState);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedStateData, setSavedStateData] = useState<AppState | null>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('somQrPrintSavedDesign');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only prompt if they saved it explicitly
        if (parsed.step !== 'download' && parsed.step !== 'home') {
          setSavedStateData(parsed);
          setShowResumeModal(true);
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  const handleResume = () => {
    if (savedStateData) {
      setAppState(savedStateData);
    }
    setShowResumeModal(false);
  };

  const handleStartFresh = () => {
    localStorage.removeItem('somQrPrintSavedDesign');
    setShowResumeModal(false);
  };

  const handleNavigate = (step: Step) => {
    setAppState(prev => ({ ...prev, step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetApp = () => {
    setAppState(initialState);
    localStorage.removeItem('somQrPrintSavedDesign');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProgress = () => {
    localStorage.setItem('somQrPrintSavedDesign', JSON.stringify(appState));
    import('react-hot-toast').then(({ default: toast }) => {
      toast.success('Design progress saved successfully!');
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-100 bg-slate-950">
      {showResumeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-indigo-900/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-white mb-2">Resume Design?</h2>
            <p className="text-slate-400 mb-8">You have a saved design in progress. Would you like to resume where you left off or start fresh?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleResume} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors">
                Resume Progress
              </button>
              <button onClick={handleStartFresh} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-colors">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <Header currentStep={appState.step} onNavigate={handleNavigate} onSaveProgress={handleSaveProgress} />
      
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={appState.step}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-grow flex flex-col w-full h-full"
          >
            {appState.step === 'home' && <Home onNavigate={handleNavigate} />}
            {appState.step === 'whatsapp' && <WhatsAppGenerator appState={appState} setAppState={setAppState} onNavigate={handleNavigate} />}
            {appState.step === 'qr' && <QRGenerator appState={appState} setAppState={setAppState} onNavigate={handleNavigate} />}
            {appState.step === 'design' && <DesignGallery appState={appState} setAppState={setAppState} onNavigate={handleNavigate} />}
            {appState.step === 'preview' && <LivePreview appState={appState} onNavigate={handleNavigate} />}
            {appState.step === 'download' && <Download appState={appState} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}
