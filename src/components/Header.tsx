import { Menu, Save, X } from 'lucide-react';
import { Step } from '../types';
import { useState } from 'react';

interface HeaderProps {
  currentStep: Step;
  onNavigate: (step: Step) => void;
  onSaveProgress?: () => void;
}

export function Header({ currentStep, onNavigate, onSaveProgress }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesignStep = ['whatsapp', 'qr', 'design', 'preview'].includes(currentStep);

  const handleNavClick = (step: Step) => {
    onNavigate(step);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavClick('home')}
          >
            <img src="/logo.jpg" alt="Som QRPrint Logo" className="h-10 w-auto rounded" />
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">Som QRPrint</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium ${currentStep === 'home' ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('whatsapp')}
              className={`text-sm font-medium ${currentStep === 'whatsapp' ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
            >
              WhatsApp Link
            </button>
            <button 
              onClick={() => handleNavClick('qr')}
              className={`text-sm font-medium ${currentStep === 'qr' ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
            >
              QR Generator
            </button>
            <button 
              onClick={() => handleNavClick('design')}
              className={`text-sm font-medium ${currentStep === 'design' ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
            >
              Designs
            </button>
          </nav>

          <div className="flex items-center gap-4">
            {isDesignStep && onSaveProgress ? (
              <button 
                onClick={onSaveProgress}
                className="hidden md:inline-flex items-center justify-center gap-2 px-4 py-2 border border-zinc-800 text-sm font-medium rounded-md shadow-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Save className="h-4 w-4 text-red-500" /> Save
              </button>
            ) : (
              currentStep === 'home' && (
                <button 
                  onClick={() => handleNavClick('whatsapp')}
                  className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Create QR
                </button>
              )
            )}
            <button 
              className="md:hidden text-zinc-400 hover:text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-4 space-y-4">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => handleNavClick('home')}
              className={`text-left text-base font-medium py-2 ${currentStep === 'home' ? 'text-red-500' : 'text-zinc-400'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('whatsapp')}
              className={`text-left text-base font-medium py-2 ${currentStep === 'whatsapp' ? 'text-red-500' : 'text-zinc-400'}`}
            >
              WhatsApp Link
            </button>
            <button 
              onClick={() => handleNavClick('qr')}
              className={`text-left text-base font-medium py-2 ${currentStep === 'qr' ? 'text-red-500' : 'text-zinc-400'}`}
            >
              QR Generator
            </button>
            <button 
              onClick={() => handleNavClick('design')}
              className={`text-left text-base font-medium py-2 ${currentStep === 'design' ? 'text-red-500' : 'text-zinc-400'}`}
            >
              Designs
            </button>
          </div>
          
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            {isDesignStep && onSaveProgress && (
              <button 
                onClick={() => {
                  onSaveProgress();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-zinc-800 text-base font-medium rounded-md shadow-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                <Save className="h-5 w-5 text-red-500" /> Save Progress
              </button>
            )}
            {currentStep === 'home' && (
              <button 
                onClick={() => handleNavClick('whatsapp')}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Create QR
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
