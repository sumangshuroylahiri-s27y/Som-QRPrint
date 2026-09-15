import { useState } from 'react';
import { AppState, Step } from '../types';
import { CONFIG } from '../config';
import { ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

export function Payment({ appState, setAppState, onNavigate }: PaymentProps) {
  const [utr, setUtr] = useState(appState.paymentInfo?.utr || '');
  const [customerName, setCustomerName] = useState(appState.paymentInfo?.customerName || '');
  const [mobileNumber, setMobileNumber] = useState(appState.paymentInfo?.mobileNumber || '');

  // Generate UPI string: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
  const upiString = `upi://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim() || !customerName.trim()) {
      toast.error('Please fill required details');
      return;
    }

    setAppState(prev => ({
      ...prev,
      paymentInfo: {
        utr: utr.trim(),
        customerName: customerName.trim(),
        mobileNumber: mobileNumber.trim()
      }
    }));

    toast.success('Payment submitted successfully!');
    onNavigate('download');
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12 bg-black">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Direct Payment Section */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Direct UPI Payment</h2>
          <p className="text-zinc-400 mb-8">Click below to pay directly via Google Pay or any other UPI application.</p>
          
          <div className="text-4xl font-extrabold text-white mb-8">₹{CONFIG.DESIGN_PRICE}</div>
          
          <div className="w-full flex flex-col gap-3">
            <a 
              href={`gpay://upi/pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-3 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              Pay with Google Pay
            </a>
            
            <a 
              href={`phonepe://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#5f259f] hover:bg-[#4b1d7d] text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              Pay with PhonePe
            </a>

            <a 
              href={`paytmmp://pay?pa=${CONFIG.UPI_ID}&pn=${encodeURIComponent(CONFIG.BUSINESS_NAME)}&am=${CONFIG.DESIGN_PRICE}&cu=INR`}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#00b9f5] hover:bg-[#0096c7] text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg"
            >
              Pay with Paytm
            </a>

            <a 
              href={upiString}
              target="_top"
              rel="noopener noreferrer"
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg mt-2"
            >
              Other UPI Apps
            </a>
          </div>
          
          <p className="text-sm text-zinc-500 max-w-xs mt-6">
            Supported apps: Google Pay, PhonePe, Paytm, CRED, Amazon Pay, etc.
          </p>
        </div>

        {/* Verification Form Section */}
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          <div className="p-8 border-b border-zinc-800 bg-zinc-950 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4 border border-zinc-700">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Have you completed the payment?</h3>
          </div>
          
          <div className="p-8">
            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  UPI Transaction ID / UTR Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all font-mono text-white"
                  placeholder="e.g. 312345678901"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all text-white"
                  placeholder="For backup communication"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                Submit Payment Details <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

