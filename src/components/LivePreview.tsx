import { useEffect, useRef, useState } from 'react';
import { AppState, Step } from '../types';
import { TEMPLATES, CONFIG } from '../config';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LivePreviewProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

export function LivePreview({ appState, onNavigate }: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [qrImg, setQrImg] = useState<HTMLImageElement | null>(null);
  const selectedTemplate = TEMPLATES.find(t => t.id === appState.selectedTemplateId);

  useEffect(() => {
    if (!selectedTemplate) {
      onNavigate('design');
      return;
    }
    const tImg = new Image();
    tImg.crossOrigin = "anonymous";
    tImg.onload = () => setTemplateImg(tImg);
    tImg.onerror = () => {
      tImg.src = `https://placehold.co/2480x3508/0f172a/94a3b8.png?text=Design+${selectedTemplate.id}`;
    };
    tImg.src = selectedTemplate.image;
    
    if (appState.qrCodeDataUrl) {
      const qImg = new Image();
      qImg.onload = () => setQrImg(qImg);
      qImg.src = appState.qrCodeDataUrl;
    }
  }, [selectedTemplate, appState.qrCodeDataUrl, onNavigate]);

  useEffect(() => {
    if (!templateImg || !qrImg || !canvasRef.current || !selectedTemplate) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 2480;
    canvas.height = 3508;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
    
    // Draw using the precise calculated bounds
    const { x, y } = selectedTemplate.defaultQrPosition;
    const qrSize = selectedTemplate.defaultQrSize;
    
    // Draw white background for QR
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, qrSize, qrSize);
    
    // Draw QR
    ctx.drawImage(qrImg, x, y, qrSize, qrSize);
  }, [templateImg, qrImg, selectedTemplate]);

  if (!selectedTemplate) return null;

  return (
    <div className="flex-grow flex flex-col items-center py-12 px-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10 flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-between mb-8">
          <button onClick={() => onNavigate('design')} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full transition-colors text-slate-400 hover:text-white shadow-sm">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold text-white">Preview Design</h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/5 mb-8">
          <canvas ref={canvasRef} className="w-full h-auto block" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('download')}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl font-bold shadow-[0_1px_2px_rgba(255,255,255,0.3)_inset,0_4px_15px_rgba(79,70,229,0.4)] text-lg flex items-center justify-center gap-3 transition-all"
        >
          Proceed to Pay & Download - ₹{CONFIG.DESIGN_PRICE}
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
