import { Template } from './types';

export const CONFIG = {
  BUSINESS_NAME: "Som QRPrint",
  UPI_ID: "sumangshuroylahiri-1@okhdfcbank",
  DESIGN_PRICE: 49,
};

// Replace these placeholders with actual design images in /public/assets/templates/
export const TEMPLATES: Template[] = [
  { id: '01', name: 'Business WhatsApp', image: '/assets/templates/design-01.png', defaultQrPosition: { x: 929, y: 1107 }, defaultQrSize: 617 },
  { id: '02', name: 'Restaurant WhatsApp', image: '/assets/templates/design-02.png', defaultQrPosition: { x: 935, y: 1125 }, defaultQrSize: 608 },
  { id: '03', name: 'Shop Contact', image: '/assets/templates/design-03.png', defaultQrPosition: { x: 1325, y: 2231 }, defaultQrSize: 684 },
  { id: '04', name: 'Personal Contact', image: '/assets/templates/design-04.png', defaultQrPosition: { x: 938, y: 1111 }, defaultQrSize: 607 },
  { id: '05', name: 'Customer Support', image: '/assets/templates/design-05.png', defaultQrPosition: { x: 910, y: 1117 }, defaultQrSize: 655 },
  { id: '06', name: 'Payment / Contact', image: '/assets/templates/design-06.png', defaultQrPosition: { x: 837, y: 1205 }, defaultQrSize: 806 },
  { id: '07', name: 'Service Enquiry', image: '/assets/templates/design-07.png', defaultQrPosition: { x: 868, y: 1188 }, defaultQrSize: 748 },
  { id: '08', name: 'Appointment', image: '/assets/templates/design-08.png', defaultQrPosition: { x: 770, y: 1143 }, defaultQrSize: 877 },
];
