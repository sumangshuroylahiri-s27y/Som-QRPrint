import { Template } from './types';

export const CONFIG = {
  BUSINESS_NAME: "Som QRPrint",
  UPI_ID: "sumangshuroylahiri-1@okhdfcbank",
  DESIGN_PRICE: 49,
};

// Precisely calculated coordinates matching the physical "Scan Me" white boxes
export const TEMPLATES: Template[] = [
  { id: '01', name: 'Design 01', image: '/assets/templates/design-01.png', defaultQrPosition: { x: 956, y: 1123 }, defaultQrSize: 571 },
  { id: '02', name: 'Design 02', image: '/assets/templates/design-02.png', defaultQrPosition: { x: 951, y: 1141 }, defaultQrSize: 574 },
  { id: '03', name: 'Design 03', image: '/assets/templates/design-03.png', defaultQrPosition: { x: 949, y: 1170 }, defaultQrSize: 578 },
  { id: '04', name: 'Design 04', image: '/assets/templates/design-04.png', defaultQrPosition: { x: 965, y: 1138 }, defaultQrSize: 563 },
  { id: '05', name: 'Design 05', image: '/assets/templates/design-05.png', defaultQrPosition: { x: 926, y: 1133 }, defaultQrSize: 623 },
  { id: '06', name: 'Design 06', image: '/assets/templates/design-06.png', defaultQrPosition: { x: 889, y: 1210 }, defaultQrSize: 703 },
  { id: '07', name: 'Design 07', image: '/assets/templates/design-07.png', defaultQrPosition: { x: 915, y: 1202 }, defaultQrSize: 658 },
  { id: '08', name: 'Design 08', image: '/assets/templates/design-08.png', defaultQrPosition: { x: 894, y: 1204 }, defaultQrSize: 691 },
];
