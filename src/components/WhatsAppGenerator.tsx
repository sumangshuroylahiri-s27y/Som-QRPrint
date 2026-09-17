import { useState } from 'react';
import { AppState, Step } from '../types';
import { ArrowRight, Copy, ExternalLink, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

interface WhatsAppGeneratorProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

export function WhatsAppGenerator({ appState, setAppState, onNavigate }: WhatsAppGeneratorProps) {
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up phone number (remove spaces, dashes)
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanedNumber.length < 8) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const fullNumber = `${countryCode.replace(/\D/g, '')}${cleanedNumber}`;
    let url = `https://wa.me/${fullNumber}`;
    
    if (message.trim()) {
      url += `?text=${encodeURIComponent(message.trim())}`;
    }

    setAppState(prev => ({
      ...prev,
      whatsappLink: url
    }));
    
    toast.success('WhatsApp link generated!');
  };

  const copyToClipboard = () => {
    if (appState.whatsappLink) {
      navigator.clipboard.writeText(appState.whatsappLink);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 bg-slate-950">
      <div className="max-w-xl w-full bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Link Generator</h2>
          <p className="text-slate-400">Create a direct link for customers to message you.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">Country Code</label>
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="+91"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Pre-filled Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Hello, I want to contact you."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors"
            >
              Generate WhatsApp Link
            </button>
          </form>

          {appState.whatsappLink && (
            <div className="mt-8 p-6 bg-indigo-950/20 border border-indigo-900/30 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm font-medium text-indigo-400 mb-3">Your generated link:</p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 break-all text-sm mb-4">
                {appState.whatsappLink}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <Copy className="h-4 w-4" /> Copy
                </button>
                <a
                  href={appState.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Open
                </a>
                <button
                  onClick={() => onNavigate('qr')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  <QrCode className="h-4 w-4" /> Next Step
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
