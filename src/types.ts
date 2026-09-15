export interface Template {
  id: string;
  name: string;
  image: string;
  defaultQrPosition: { x: number; y: number };
  defaultQrSize: number;
}

export type Step = 
  | 'home'
  | 'whatsapp'
  | 'qr'
  | 'design'
  | 'preview'
  | 'payment'
  | 'download';

export interface AppState {
  step: Step;
  whatsappLink: string;
  qrCodeDataUrl: string;
  selectedTemplateId: string | null;
  qrOptions: {
    color: string;
    ecl: 'L' | 'M' | 'Q' | 'H';
    logo: string | null;
  };
  qrConfig: {
    x: number;
    y: number;
    size: number;
  };
  paymentInfo: {
    utr: string;
    customerName: string;
    mobileNumber: string;
  } | null;
}
