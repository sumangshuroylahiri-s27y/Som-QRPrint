import { AppState, Step } from '../types';
import { ArrowRight, ImageIcon, Link, Printer, QrCode, Smartphone, ChevronRight } from 'lucide-react';
import { CONFIG } from '../config';
import { motion } from 'motion/react';

interface HomeProps {
  onNavigate: (step: Step) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const workflowSteps = [
  { icon: Smartphone, label: 'Phone Number' },
  { icon: Link, label: 'WhatsApp Link' },
  { icon: QrCode, label: 'QR Code' },
  { icon: ImageIcon, label: 'Design' },
  { icon: Printer, label: 'Print' }
];

const flowContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const flowItem = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>
        <motion.div 
          className="relative max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Professional WhatsApp QR Designs <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">in Seconds.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate custom WhatsApp links, transform them into high-quality QR codes, and automatically place them on premium printable designs for your shop.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('whatsapp')}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-[0_1px_2px_rgba(255,255,255,0.2)_inset,0_4px_12px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Create QR Design <ArrowRight className="h-5 w-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('whatsapp')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800 text-slate-300 border border-slate-700/50 rounded-xl font-bold text-lg shadow-sm transition-all"
            >
              Generate WhatsApp Link
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Visual Flow */}
      <section className="py-8 border-y border-slate-800/50 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-30 overflow-hidden shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto px-4 relative">
          <motion.div 
            variants={flowContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-wrap justify-center items-center gap-y-6"
          >
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === workflowSteps.length - 1;
              return (
                <div key={index} className="flex items-center">
                  <motion.div 
                    variants={flowItem}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex flex-col sm:flex-row items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900/90 shadow-inner rounded-full text-slate-300 border border-slate-800/80 transition-colors hover:border-indigo-500/30 hover:bg-indigo-950/20 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 w-[200%] animate-shimmer"></div>
                    <div className="p-2 sm:p-0 bg-slate-800 sm:bg-transparent rounded-full sm:rounded-none group-hover:text-indigo-400 transition-colors shrink-0 z-10">
                      <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold tracking-wide z-10">{step.label}</span>
                  </motion.div>

                  {!isLast && (
                    <motion.div 
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        show: { opacity: 1, x: 0 }
                      }}
                      className="hidden md:flex px-2 sm:px-4 text-slate-700"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.div>
                  )}
                  {!isLast && (
                    <div className="md:hidden w-8 flex justify-center text-slate-700">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 hover:border-slate-700 shadow-lg transition-colors"
            >
              <div className="w-14 h-14 bg-indigo-950/50 border border-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Link className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">WhatsApp Link</h3>
              <p className="text-slate-400 mb-6 min-h-[48px] leading-relaxed">Turn any WhatsApp number into a clickable WhatsApp link instantly.</p>
              
              <button 
                onClick={() => onNavigate('whatsapp')}
                className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Create Link <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-800 hover:border-slate-700 shadow-lg transition-colors"
            >
              <div className="w-14 h-14 bg-indigo-950/50 border border-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <QrCode className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">QR Generator</h3>
              <p className="text-slate-400 mb-6 min-h-[48px] leading-relaxed">Convert your WhatsApp link into a high-quality, scannable QR code.</p>
              
              <button 
                onClick={() => onNavigate('qr')}
                className="text-indigo-400 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Generate QR <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-8 shadow-[0_10px_40px_rgba(79,70,229,0.3)] text-white relative overflow-hidden border border-indigo-400/20"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-indigo-900 opacity-20 rounded-full blur-xl"></div>
              
              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                <ImageIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                QR Design
                <span className="text-[10px] font-bold bg-white text-indigo-700 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">₹{CONFIG.DESIGN_PRICE}</span>
              </h3>
              <p className="text-indigo-100/90 mb-6 min-h-[48px] leading-relaxed">Place your QR automatically on one of our 8 printable, professional designs.</p>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('design')}
                className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
              >
                Choose Design <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Xerox Shop Use Case */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Made for Print <span className="text-indigo-400">&</span> Xerox Shops</h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
              Create WhatsApp QR posters, cards and promotional designs quickly without manually editing every file in Photoshop or CorelDraw.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'WhatsApp Contact QR', 'Business QR', 'Restaurant Order QR', 
                'Customer Support QR', 'Appointment QR', 'Shop Enquiry QR'
              ].map((useCase, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-slate-200">{useCase}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] p-10 border border-slate-800 shadow-2xl relative"
          >
            <h3 className="text-2xl font-bold mb-10 text-center text-white">How It Works</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-indigo-500/0 before:via-indigo-500/50 before:to-indigo-500/0">
              {[
                'Customer provides WhatsApp number',
                'Shop operator generates the QR',
                'Selects a design template',
                'QR automatically fits on the design',
                'Pay ₹49 via UPI',
                'Print final high-res file'
              ].map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-slate-950 bg-indigo-600 text-white font-bold shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {i + 1}
                  </div>
                  <div className="w-[calc(100%-5rem)] md:w-[calc(50%-4rem)] bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-700/50 shadow-sm">
                    <p className="font-medium text-slate-200">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
