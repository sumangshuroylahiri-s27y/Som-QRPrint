import { useEffect, useRef, useState } from 'react';
import { AppState, Step } from '../types';
import { TEMPLATES, CONFIG } from '../config';
import { ArrowLeft, Move, RotateCcw, ZoomIn, ZoomOut, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface LivePreviewProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  onNavigate: (step: Step) => void;
}

export function LivePreview({ appState, setAppState, onNavigate }: LivePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [qrImg, setQrImg] = useState<HTMLImageElement | null>(null);
  
  // Viewport state (pan & zoom)
  const [viewScale, setViewScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const selectedTemplate = TEMPLATES.find(t => t.id === appState.selectedTemplateId);

  useEffect(() => {
    if (!selectedTemplate) {
      onNavigate('design');
      return;
    }

    const tImg = new Image();
    tImg.crossOrigin = "anonymous";
    tImg.onload = () => setTemplateImg(tImg);
    tImg.onerror = () => {
      tImg.src = `https://placehold.co/800x1200/f1f5f9/64748b.png?text=${encodeURIComponent(selectedTemplate.name)}`;
    };
    tImg.src = selectedTemplate.image;

    if (appState.qrCodeDataUrl) {
      const qImg = new Image();
      qImg.onload = () => setQrImg(qImg);
      qImg.src = appState.qrCodeDataUrl;
    }
  }, [selectedTemplate, appState.qrCodeDataUrl, onNavigate]);

  const focusOnQR = () => {
    if (containerRef.current && templateImg) {
      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;
      
      const { x, y, size } = appState.qrConfig;
      const qrCenterX = x + size / 2;
      const qrCenterY = y + size / 2;
      
      const canvasCenterX = (templateImg.width || 800) / 2;
      const canvasCenterY = (templateImg.height || 1200) / 2;

      const targetScale = Math.min(1, (Math.min(containerW, containerH) - 32) / (size * 1.5));
      
      const panX = (canvasCenterX - qrCenterX) * targetScale;
      const panY = (canvasCenterY - qrCenterY) * targetScale;
      
      setViewScale(targetScale);
      setPan({ x: panX, y: panY });
    }
  };

  // Initial fit scale
  useEffect(() => {
    focusOnQR();
  }, [templateImg]);

  // Handle canvas drawing
  useEffect(() => {
    if (!templateImg || !qrImg || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = templateImg.width || 800;
    canvas.height = templateImg.height || 1200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

    const { x, y, size } = appState.qrConfig;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, size, size);
    ctx.drawImage(qrImg, x, y, size, size);

  }, [templateImg, qrImg, appState.qrConfig]);

  const handleConfigChange = (key: keyof typeof appState.qrConfig, value: number) => {
    setAppState(prev => ({
      ...prev,
      qrConfig: {
        ...prev.qrConfig,
        [key]: value
      }
    }));
  };

  const handleResetQR = () => {
    if (selectedTemplate) {
      setAppState(prev => ({
        ...prev,
        qrConfig: {
          x: selectedTemplate.defaultQrPosition.x,
          y: selectedTemplate.defaultQrPosition.y,
          size: selectedTemplate.defaultQrSize
        }
      }));
    }
  };

  const handleSaveProgress = () => {
    localStorage.setItem('somQrPrintSavedDesign', JSON.stringify(appState));
    toast.success('Design progress saved successfully!');
  };

  // Viewport interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };
  
  const handleZoomIn = () => setViewScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setViewScale(prev => Math.max(prev - 0.2, 0.2));
  const handleResetView = () => focusOnQR();

  const handleDownloadPreview = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `preview-design-${selectedTemplate?.id}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
      toast.success('Preview downloaded');
    }
  };

  if (!selectedTemplate) return null;

  return (
    <div className="flex-grow flex flex-col md:flex-row bg-black md:min-h-[calc(100vh-4rem)]">
      {/* Canvas Area */}
      <div 
        className="relative overflow-hidden bg-zinc-950 cursor-grab active:cursor-grabbing select-none h-[50vh] md:h-auto md:flex-grow"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Viewport controls */}
        <div className="absolute top-4 right-4 z-20 flex bg-zinc-900 rounded-lg shadow-md border border-zinc-800 overflow-hidden">
          <button onClick={handleZoomOut} className="p-3 hover:bg-zinc-800 text-zinc-300 transition-colors border-r border-zinc-800 flex items-center justify-center min-w-[44px] min-h-[44px]" title="Zoom Out">
            <ZoomOut className="h-5 w-5" />
          </button>
          <div className="px-2 text-sm font-medium text-zinc-400 flex items-center justify-center w-16 min-h-[44px]">
            {Math.round(viewScale * 100)}%
          </div>
          <button onClick={handleZoomIn} className="p-3 hover:bg-zinc-800 text-zinc-300 transition-colors border-l border-zinc-800 flex items-center justify-center min-w-[44px] min-h-[44px]" title="Zoom In">
            <ZoomIn className="h-5 w-5" />
          </button>
          <button onClick={handleResetView} className="p-3 hover:bg-zinc-800 text-zinc-300 transition-colors border-l border-zinc-800 flex items-center justify-center min-w-[44px] min-h-[44px]" title="Reset View">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div 
            className="shadow-2xl bg-white origin-center"
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${viewScale})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-full md:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('design')} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-zinc-400" />
            </button>
            <h2 className="text-xl font-bold text-white">Customize</h2>
          </div>
          <button 
            onClick={handleSaveProgress}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 text-red-400 hover:bg-red-900/50 rounded-md text-sm font-bold transition-colors"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Selected Design</h3>
            <p className="text-zinc-400">{selectedTemplate.name}</p>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" /> QR Size
                </label>
                <span className="text-xs text-zinc-500 font-mono">{appState.qrConfig.size}px</span>
              </div>
              <div className="py-2">
                <input
                  type="range"
                  min="100"
                  max={templateImg?.width ? Math.floor(templateImg.width / 1.5) : 1500}
                  value={appState.qrConfig.size}
                  onChange={(e) => handleConfigChange('size', parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Move className="h-4 w-4" /> Position X (Horizontal)
                </label>
                <span className="text-xs text-zinc-500 font-mono">{appState.qrConfig.x}px</span>
              </div>
              <div className="py-2">
                <input
                  type="range"
                  min="0"
                  max={templateImg?.width || 2500}
                  value={appState.qrConfig.x}
                  onChange={(e) => handleConfigChange('x', parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                  <Move className="h-4 w-4 rotate-90" /> Position Y (Vertical)
                </label>
                <span className="text-xs text-zinc-500 font-mono">{appState.qrConfig.y}px</span>
              </div>
              <div className="py-2">
                <input
                  type="range"
                  min="0"
                  max={templateImg?.height || 3600}
                  value={appState.qrConfig.y}
                  onChange={(e) => handleConfigChange('y', parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>

            <button
              onClick={handleResetQR}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-4 w-4" /> Reset QR Position
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900 space-y-3">
          <button
            onClick={handleDownloadPreview}
            className="w-full py-3 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 rounded-lg font-bold transition-colors shadow-sm"
          >
            Download Preview
          </button>
          <button
            onClick={() => onNavigate('payment')}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors shadow-md shadow-red-900/20 text-lg flex items-center justify-center gap-2"
          >
            Proceed to Payment - ₹{CONFIG.DESIGN_PRICE}
          </button>
        </div>
      </div>
    </div>
  );
}
