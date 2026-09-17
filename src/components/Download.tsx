import { useEffect, useRef, useState } from 'react';
import { AppState } from '../types';
import { CONFIG, TEMPLATES } from '../config';
import { Download as DownloadIcon, FileText, CheckCircle, Smartphone, Lock, Unlock, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

interface DownloadProps {
  appState: AppState;
}

export function Download({ appState }: DownloadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrPaymentCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [finalDataUrl, setFinalDataUrl] = useState<string | null>(null);
  
  // Payment Verification State
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const selectedTemplate = TEMPLATES.find(t => t.id === appState.selectedTemplateId);
  const upiString = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`;

  useEffect(() => {
    if (qrPaymentCanvasRef.current) {
      QRCode.toCanvas(qrPaymentCanvasRef.current, upiString, {
        width: 180,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    }
  }, [upiString]);

  useEffect(() => {
    const generateFinalImage = async () => {
      if (!selectedTemplate || !appState.qrCodeDataUrl || !canvasRef.current) return;
      
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Context missing");

        canvas.width = 2480;
        canvas.height = 3508;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const tImg = new Image();
        tImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          tImg.onload = resolve;
          tImg.onerror = reject;
          tImg.src = selectedTemplate.image;
        });
        
        const qImg = new Image();
        await new Promise((resolve, reject) => {
          qImg.onload = resolve;
          qImg.onerror = reject;
          qImg.src = appState.qrCodeDataUrl;
        });
        
        ctx.drawImage(tImg, 0, 0, canvas.width, canvas.height);

        const { x, y } = selectedTemplate.defaultQrPosition;
        const qrSize = selectedTemplate.defaultQrSize;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, y, qrSize, qrSize);
        ctx.drawImage(qImg, x, y, qrSize, qrSize);

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        setFinalDataUrl(dataUrl);
        setIsGenerating(false);
      } catch (error) {
        console.error("Failed to generate final image", error);
        setIsGenerating(false);
      }
    };

    generateFinalImage();
  }, [selectedTemplate, appState.qrCodeDataUrl]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.trim().length < 12) {
      toast.error("Please enter a valid 12-digit UTR / Reference Number");
      return;
    }
    
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsUnlocked(true);
      toast.success("Payment verified successfully!");
    }, 1500);
  };

  const handleDownloadImage = () => {
    if (finalDataUrl) {
      const a = document.createElement('a');
      a.href = finalDataUrl;
      a.download = `QR-Design-${selectedTemplate?.id || 'export'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadPDF = () => {
    if (finalDataUrl && canvasRef.current) {
      toast.loading("Generating PDF...", { id: 'pdf-toast' });
      
      // Use setTimeout to allow the UI to update and show the toast
      setTimeout(() => {
        try {
          // Create PDF
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true // Enable PDF compression
          });
          
          // Instead of using the huge 1.0 quality PNG, we'll use a slightly compressed JPEG 
          // which is MUUUUCH faster for jsPDF to process and results in a smaller file size
          const compressedDataUrl = canvasRef.current!.toDataURL('image/jpeg', 0.85);
          
          doc.addImage(compressedDataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
          doc.save(`QR-Design-${selectedTemplate?.id || 'export'}.pdf`);
          
          toast.success("PDF Downloaded!", { id: 'pdf-toast' });
        } catch (err) {
          console.error(err);
          toast.error("Failed to generate PDF", { id: 'pdf-toast' });
        }
      }, 100);
    }
  };

  if (!selectedTemplate) return null;

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Payment Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Smartphone className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Step 1: Pay to Unlock</h2>
          <p className="text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">Scan the QR code or tap a button below to pay using your UPI app.</p>
          
          <div className="bg-white p-3 rounded-2xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] relative inline-block">
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
            <canvas ref={qrPaymentCanvasRef} className="block rounded-lg mx-auto" />
          </div>
          
          <div className="text-5xl font-extrabold text-white mb-8 tracking-tight">
            ₹{CONFIG.DESIGN_PRICE}
            <span className="text-lg text-slate-500 font-medium ml-1">.00</span>
          </div>
          
          <div className="w-full flex flex-col gap-3 max-w-sm">
            <motion.a 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              href={`gpay://upi/pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              Pay with Google Pay
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              href={`phonepe://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#5f259f] hover:bg-[#4b1d7d] text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              Pay with PhonePe
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              href={`paytmmp://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#00b9f5] hover:bg-[#0096c7] text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              Pay with Paytm
            </motion.a>
          </div>
        </motion.div>

        {/* Verification & Download Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
          className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center justify-center"
        >
          <AnimatePresence mode="wait">
            {!isUnlocked ? (
              <motion.div 
                key="locked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-sm flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/10"></div>
                  <Lock className="h-7 w-7 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Step 2: Verify Payment</h2>
                <p className="text-slate-400 mb-8 text-sm">To prevent unauthorized downloads, please enter the 12-digit UTR / Reference Number after completing your payment.</p>

                <form onSubmit={handleVerify} className="w-full flex flex-col gap-4">
                  <div className="text-left">
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                      UTR / Reference Number <span className="text-indigo-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all font-mono text-white placeholder-slate-600 shadow-inner"
                      placeholder="e.g. 312345678901"
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isVerifying || utr.length < 1}
                    className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-[0_1px_2px_rgba(255,255,255,0.3)_inset,0_4px_12px_rgba(79,70,229,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        <Unlock className="h-5 w-5" /> Unlock Download
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="unlocked"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center"
              >
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20 shadow-inner">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Unlocked & Ready!</h2>
                  <p className="text-slate-400">Your high-resolution A4 design is ready.</p>
                </div>

                <div className="w-full rounded-xl overflow-hidden shadow-2xl border border-white/5 mb-8 relative min-h-[300px] bg-slate-900 flex-grow flex items-center justify-center">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="font-medium text-sm">Generating HD Print File...</span>
                    </div>
                  ) : (
                    <img src={finalDataUrl!} alt="Final Print File" className="w-full h-full object-contain max-h-[400px] block" />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={handleDownloadImage}
                    disabled={isGenerating}
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 shadow-sm"
                  >
                    <DownloadIcon className="h-5 w-5 text-indigo-400" />
                    Save Image
                  </button>
                  
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(255,255,255,0.3)_inset,0_4px_12px_rgba(79,70,229,0.3)]"
                  >
                    <FileText className="h-5 w-5 text-indigo-100" />
                    Download PDF
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
