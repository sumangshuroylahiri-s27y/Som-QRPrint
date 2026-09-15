import { ArrowRight, Link, QrCode, Image as ImageIcon, Printer } from 'lucide-react';
import { Step } from '../types';

interface HomeProps {
  onNavigate: (step: Step) => void;
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Create Your WhatsApp <span className="text-red-500">QR Design</span> in Minutes
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate a WhatsApp link, turn it into a QR code, place it on a ready-made design, and download a print-ready file for your shop.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => onNavigate('whatsapp')}
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2"
            >
              Create QR Design <ArrowRight className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onNavigate('whatsapp')}
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg font-bold text-lg shadow-sm transition-all"
            >
              Generate WhatsApp Link
            </button>
          </div>
        </div>
      </section>

      {/* Visual Flow */}
      <section className="py-12 border-y border-zinc-900 bg-black">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 text-sm md:text-base font-medium text-zinc-500">
            <span className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full text-zinc-300">📱 Phone Number</span>
            <ArrowRight className="h-4 w-4 text-zinc-700" />
            <span className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full text-zinc-300"><Link className="h-4 w-4" /> WhatsApp Link</span>
            <ArrowRight className="h-4 w-4 text-zinc-700 hidden md:block" />
            <span className="flex items-center gap-2 px-3 py-1 bg-red-950 rounded-full text-red-400"><QrCode className="h-4 w-4" /> QR Code</span>
            <ArrowRight className="h-4 w-4 text-zinc-700 hidden sm:block" />
            <span className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full text-zinc-300"><ImageIcon className="h-4 w-4" /> Design</span>
            <ArrowRight className="h-4 w-4 text-zinc-700 hidden sm:block" />
            <span className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full text-zinc-300"><Printer className="h-4 w-4" /> Print</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-950 rounded-xl flex items-center justify-center mb-6">
                <Link className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">WhatsApp Link</h3>
              <p className="text-zinc-400 mb-6 min-h-[48px]">Turn any WhatsApp number into a clickable WhatsApp link instantly.</p>
              <button 
                onClick={() => onNavigate('whatsapp')}
                className="text-red-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Create Link <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Service 2 */}
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-950 rounded-xl flex items-center justify-center mb-6">
                <QrCode className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">QR Generator</h3>
              <p className="text-zinc-400 mb-6 min-h-[48px]">Convert your WhatsApp link into a high-quality, scannable QR code.</p>
              <button 
                onClick={() => onNavigate('qr')}
                className="text-red-500 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Generate QR <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-red-600 rounded-2xl p-8 shadow-xl shadow-red-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                QR Design
                <span className="text-xs font-bold bg-white text-red-600 px-2 py-1 rounded-md uppercase tracking-wider">₹49/design</span>
              </h3>
              <p className="text-red-100 mb-6 min-h-[48px]">Place your QR automatically on one of our 8 printable, professional designs.</p>
              <button 
                onClick={() => onNavigate('design')}
                className="bg-white text-red-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors inline-block"
              >
                Choose Design
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Xerox Shop Use Case */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Made for Xerox & Printing Shops</h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Create WhatsApp QR posters, cards and promotional designs quickly without manually editing every file in Photoshop or CorelDraw.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'WhatsApp Contact QR', 'Business QR', 'Restaurant Order QR', 
                'Customer Support QR', 'Appointment QR', 'Shop Enquiry QR'
              ].map((useCase, i) => (
                <div key={i} className="flex items-center gap-3 bg-zinc-900 p-4 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <QrCode className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 relative">
            <h3 className="text-2xl font-bold mb-8 text-center">How It Works at Your Shop</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
              {[
                'Customer gives WhatsApp number.',
                'Shop operator generates the QR.',
                'Selects a design template.',
                'QR automatically appears on the design.',
                'Customer pays ₹49 via UPI.',
                'Final high-res file is downloaded.',
                'Xerox shop prints it.'
              ].map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-zinc-950 bg-red-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {i + 1}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                    <p className="font-medium text-zinc-300">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
