import { useEffect, useRef, useState } from 'react';
import { AppState, Step } from '../types';
import { TEMPLATES } from '../config';
import { CheckCircle2, Download as DownloadIcon, Loader2, RefreshCcw, Info, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface DownloadProps {
  appState: AppState;
  onNavigate: (step: Step) => void;
  resetApp: () => void;
}

export function Download({ appState, onNavigate, resetApp }: DownloadProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [finalDataUrl, setFinalDataUrl] = useState<string | null>(null);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedTemplate = TEMPLATES.find(t => t.id === appState.selectedTemplateId);

  useEffect(() => {
    if (!selectedTemplate || !appState.qrCodeDataUrl || !appState.paymentInfo) {
      onNavigate('home');
      return;
    }

    const generateFinalImage = async () => {
      try {
        const tImg = new Image();
        tImg.crossOrigin = "anonymous";
        
        // Wrap image loading in a promise
        await new Promise((resolve, reject) => {
          tImg.onload = resolve;
          tImg.onerror = () => {
            // Fallback if needed
            tImg.src = `https://placehold.co/800x1200/f1f5f9/64748b.png?text=${encodeURIComponent(selectedTemplate.name)}`;
            // We resolve immediately on fallback load to avoid getting stuck
            tImg.onload = resolve;
          };
          tImg.src = selectedTemplate.image;
        });

        const qImg = new Image();
        await new Promise((resolve) => {
          qImg.onload = resolve;
          qImg.src = appState.qrCodeDataUrl;
        });

        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas missing");
        
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Context missing");

        // Set full resolution
        canvas.width = tImg.width || 800;
        canvas.height = tImg.height || 1200;

        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw template
        ctx.drawImage(tImg, 0, 0, canvas.width, canvas.height);

        // Draw QR Code background
        const { x, y, size } = appState.qrConfig;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, size, size);
        
        // Draw QR Code
        ctx.drawImage(qImg, x, y, size, size);

        // Get final high-res data URL
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        setFinalDataUrl(dataUrl);
        setIsGenerating(false);

      } catch (error) {
        console.error("Failed to generate final image", error);
        toast.error("Failed to generate final image");
        setIsGenerating(false);
      }
    };

    generateFinalImage();
  }, [selectedTemplate, appState.qrCodeDataUrl, appState.qrConfig, appState.paymentInfo, onNavigate]);

  const handleDownload = () => {
    if (finalDataUrl && selectedTemplate) {
      const link = document.createElement('a');
      link.download = `som-qrprint-${selectedTemplate.id}.png`;
      link.href = finalDataUrl;
      link.click();
      toast.success('Download started!');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 bg-black">
      {/* Hidden canvas for high-res rendering */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="max-w-2xl w-full bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden flex flex-col items-center p-8 text-center">
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white">Preparing High-Resolution File...</h2>
            <p className="text-zinc-500 mt-2">Please wait a moment while we render your design.</p>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-2">Payment Verified</h2>
            <p className="text-zinc-400 mb-8">
              Thank you, <span className="font-semibold text-white">{appState.paymentInfo?.customerName}</span>! 
              Your print-ready design is generated and ready to download.
            </p>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 mb-8 w-full max-w-sm relative">
               {finalDataUrl && (
                 <img 
                  src={finalDataUrl} 
                  alt="Final Design Preview" 
                  className="w-full h-auto object-contain rounded shadow-sm"
                 />
               )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <button
                onClick={handleDownload}
                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md shadow-red-900/20 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <DownloadIcon className="h-5 w-5" /> Download Print File
              </button>
            </div>
            
            <button
              onClick={() => setShowTipsModal(true)}
              className="mt-6 text-red-400 hover:text-red-300 font-medium flex items-center justify-center gap-2 transition-colors bg-red-950/30 hover:bg-red-900/50 px-4 py-2 rounded-lg"
            >
              <Info className="h-4 w-4" /> View Printing Tips
            </button>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-md">
              <button
                onClick={() => onNavigate('design')}
                className="flex-1 py-3 bg-zinc-800 border-2 border-zinc-700 hover:border-zinc-600 text-zinc-300 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 w-full"
              >
                <Plus className="h-4 w-4" /> Add Another Design
              </button>
              
              <button
                onClick={resetApp}
                className="flex-1 py-3 text-zinc-400 hover:text-red-400 bg-zinc-950 hover:bg-red-950/20 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 w-full"
              >
                <RefreshCcw className="h-4 w-4" /> Start Fresh
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Printing Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Printing Tips</h2>
              <button onClick={() => setShowTipsModal(false)} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 text-zinc-300">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-950 text-red-500 flex items-center justify-center font-bold text-sm">1</div>
                <p><strong>Paper Quality:</strong> For best durability, print on thick card stock (at least 250gsm - 300gsm).</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-950 text-red-500 flex items-center justify-center font-bold text-sm">2</div>
                <p><strong>Finish:</strong> Request a <em>matte</em> finish or matte lamination. Glossy finishes can cause glare under shop lights, which prevents mobile cameras from scanning the QR code properly.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-950 text-red-500 flex items-center justify-center font-bold text-sm">3</div>
                <p><strong>Sizing:</strong> The downloaded file is high-resolution. Ask your local print shop to print it on standard A4 or scale it down to A5 for a neat counter standee.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-950 text-red-500 flex items-center justify-center font-bold text-sm">4</div>
                <p><strong>Printer Settings:</strong> Ensure the printer is set to "High Quality" color print to keep the QR code edges perfectly sharp.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowTipsModal(false)} 
              className="mt-8 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
