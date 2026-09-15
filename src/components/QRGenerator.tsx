import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { AppState, Step } from '../types';
import { Download, ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRGeneratorProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

export function QRGenerator({ appState, setAppState, onNavigate }: QRGeneratorProps) {
  const [linkInput, setLinkInput] = useState(appState.whatsappLink || '');

  // We use local state for inputs so it updates live
  const [color, setColor] = useState(appState.qrOptions.color || '#000000');
  const [ecl, setEcl] = useState(appState.qrOptions.ecl || 'H');
  const [logoUrl, setLogoUrl] = useState<string | null>(appState.qrOptions.logo || null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateQR = async (text: string, c: string, e: 'L'|'M'|'Q'|'H', l: string | null) => {
    if (!text.trim()) return;

    try {
      // Create canvas for drawing
      const canvas = document.createElement('canvas');
      // Always draw slightly larger to ensure quality
      await QRCode.toCanvas(canvas, text, {
        errorCorrectionLevel: e,
        margin: 2,
        width: 1000,
        color: {
          dark: c,
          light: '#ffffff'
        }
      });
      
      const ctx = canvas.getContext('2d');
      if (l && ctx) {
        const logoImg = new Image();
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.src = l;
        });

        // Calculate logo size (25% of QR width is usually safe for H ECL)
        const logoSize = canvas.width * 0.25;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        // Draw white rounded rect behind logo
        const radius = 20;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20, radius);
        ctx.fill();

        // Draw logo
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      
      setAppState(prev => ({
        ...prev,
        whatsappLink: text,
        qrCodeDataUrl: dataUrl,
        qrOptions: { color: c, ecl: e, logo: l }
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (appState.whatsappLink && !appState.qrCodeDataUrl) {
      generateQR(appState.whatsappLink, color, ecl, logoUrl);
    }
  }, []);

  // Update when options change
  useEffect(() => {
    if (linkInput.trim()) {
      generateQR(linkInput, color, ecl, logoUrl);
    }
  }, [color, ecl, logoUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setLogoUrl(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!appState.qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.download = 'whatsapp-qr.png';
    link.href = appState.qrCodeDataUrl;
    link.click();
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 bg-black">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-2">Customize QR Code</h2>
            <p className="text-zinc-400">Change appearance and verify live changes.</p>
          </div>
          
          <div className="p-8 flex-grow">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">WhatsApp Link</label>
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => {
                    setLinkInput(e.target.value);
                    if (e.target.value.trim()) {
                      generateQR(e.target.value, color, ecl, logoUrl);
                    }
                  }}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white"
                  placeholder="https://wa.me/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">QR Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 p-1 bg-zinc-950 border border-zinc-800 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-zinc-500 font-mono uppercase">{color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Error Correction</label>
                  <select 
                    value={ecl}
                    onChange={(e) => setEcl(e.target.value as 'L'|'M'|'Q'|'H')}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%) - Recommended for logos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Center Logo</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Upload className="h-4 w-4" /> Upload Logo
                  </button>
                  {logoUrl && (
                    <button
                      onClick={() => setLogoUrl(null)}
                      className="text-sm text-red-500 hover:text-red-400 font-medium"
                    >
                      Remove Logo
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">Use 'High' error correction when adding a logo to ensure scannability.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-8 flex flex-col items-center justify-center text-center">
          {appState.qrCodeDataUrl ? (
            <div className="animate-in zoom-in-95 duration-300 w-full flex flex-col items-center">
              <h3 className="text-xl font-bold text-white mb-6">Live Preview</h3>
              
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-sm mb-8">
                <img 
                  src={appState.qrCodeDataUrl} 
                  alt="Generated QR Code" 
                  className="w-64 h-64 object-contain"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <Download className="h-4 w-4" /> Download QR
                </button>
                <button
                  onClick={() => onNavigate('design')}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  <ImageIcon className="h-4 w-4" /> Use on Design
                </button>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 flex flex-col items-center gap-4">
              <p>Enter a valid WhatsApp link to see the preview</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
