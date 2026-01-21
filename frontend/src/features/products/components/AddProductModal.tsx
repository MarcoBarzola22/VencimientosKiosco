import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Plus, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProduct: (name: string, expirationDate: Date) => void;
}

export const AddProductModal = ({ open, onOpenChange, onAddProduct }: AddProductModalProps) => {
  const [name, setName] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isListeningDate, setIsListeningDate] = useState(false);
  const [dateInputMethod, setDateInputMethod] = useState<'manual' | 'voice'>('manual');

  const parseSpokenDate = (transcript: string): string | null => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Normalize text
    const text = transcript.toLowerCase().trim();
    
    // Month mapping
    const months: { [key: string]: number } = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };

    // Try to match "DD de MONTH" or "DD MONTH"
    const datePattern = /(\d{1,2})\s*(?:de\s+)?(\w+)(?:\s+(?:de\s+)?(\d{4}))?/;
    const match = text.match(datePattern);
    
    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[2];
      const year = match[3] ? parseInt(match[3]) : currentYear;
      
      if (months[monthName] !== undefined && day >= 1 && day <= 31) {
        const date = new Date(year, months[monthName], day);
        // Format as YYYY-MM-DD for input[type="date"]
        return date.toISOString().split('T')[0];
      }
    }
    
    return null;
  };

  const handleVoiceDateInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListeningDate(true);
    toast.info('🎤 Escuchando... Di la fecha (ej: "15 de marzo")');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListeningDate(false);
      
      const parsedDate = parseSpokenDate(transcript);
      if (parsedDate) {
        setExpirationDate(parsedDate);
        toast.success(`Fecha: ${new Date(parsedDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}`);
      } else {
        toast.error(`No entendí "${transcript}". Intenta con "15 de marzo" por ejemplo.`);
      }
    };

    recognition.onerror = () => {
      setIsListeningDate(false);
      toast.error('No pude escucharte. Intenta de nuevo.');
    };

    recognition.onend = () => {
      setIsListeningDate(false);
    };

    recognition.start();
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    toast.info('🎤 Escuchando... Di el nombre del producto');

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setName(transcript);
      setIsListening(false);
      toast.success(`Escuché: "${transcript}"`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('No pude escucharte. Intenta de nuevo.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Ingresa el nombre del producto');
      return;
    }
    
    if (!expirationDate) {
      toast.error('Selecciona la fecha de vencimiento');
      return;
    }

    onAddProduct(name.trim(), new Date(expirationDate));
    setName('');
    setExpirationDate('');
    onOpenChange(false);
    toast.success('✅ Producto agregado');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-[90vw] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground text-center">
            Agregar Producto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Product Name with Voice */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Nombre del producto
            </Label>
            <div className="flex gap-2">
              <Input
                id="name"
                type="text"
                placeholder="Ej: Yogur Ser Frutilla"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  'flex-1 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground',
                  'focus:ring-2 focus:ring-primary focus:border-primary',
                  'text-base rounded-xl'
                )}
              />
              <Button
                type="button"
                onClick={handleVoiceInput}
                disabled={isListening}
                className={cn(
                  'h-12 w-12 p-0 rounded-xl transition-all duration-200',
                  isListening 
                    ? 'bg-destructive hover:bg-destructive animate-pulse' 
                    : 'bg-primary hover:bg-primary/90',
                  'active:scale-90'
                )}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
            </div>
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isListening}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl',
                'text-sm font-medium transition-all duration-200',
                isListening
                  ? 'bg-destructive/20 text-destructive border-2 border-destructive'
                  : 'bg-primary/10 text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/20',
                'active:scale-[0.98]'
              )}
            >
              {isListening ? (
                <>
                  <div className="relative">
                    <Mic className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-ping" />
                  </div>
                  <span>Escuchando...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>🎤 Dictar por voz</span>
                </>
              )}
            </button>
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Fecha de vencimiento
            </Label>
            
            {/* Date Input Method Toggle */}
            <div className="flex gap-2 p-1 bg-secondary rounded-xl">
              <button
                type="button"
                onClick={() => setDateInputMethod('manual')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  dateInputMethod === 'manual'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Calendar className="w-4 h-4" />
                Manual
              </button>
              <button
                type="button"
                onClick={() => setDateInputMethod('voice')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                  dateInputMethod === 'voice'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Mic className="w-4 h-4" />
                Por voz
              </button>
            </div>

            {/* Manual Date Input */}
            {dateInputMethod === 'manual' && (
              <Input
                id="date"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className={cn(
                  'h-12 w-full bg-secondary border-border text-foreground',
                  'focus:ring-2 focus:ring-primary focus:border-primary',
                  'text-base rounded-xl',
                  '[color-scheme:dark]'
                )}
              />
            )}

            {/* Voice Date Input */}
            {dateInputMethod === 'voice' && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleVoiceDateInput}
                  disabled={isListeningDate}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl',
                    'text-sm font-medium transition-all duration-200',
                    isListeningDate
                      ? 'bg-destructive/20 text-destructive border-2 border-destructive'
                      : 'bg-primary/10 text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/20',
                    'active:scale-[0.98]'
                  )}
                >
                  {isListeningDate ? (
                    <>
                      <div className="relative">
                        <Mic className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full animate-ping" />
                      </div>
                      <span>Escuchando fecha...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5" />
                      <span>🎤 Dictar fecha (ej: "15 de marzo")</span>
                    </>
                  )}
                </button>
                
                {/* Show recognized date */}
                {expirationDate && (
                  <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <span className="text-sm text-muted-foreground">Fecha seleccionada:</span>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(expirationDate).toLocaleDateString('es-AR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className={cn(
              'w-full h-14 text-lg font-semibold rounded-xl',
              'gradient-primary text-primary-foreground',
              'hover:opacity-90 active:scale-[0.98]',
              'transition-all duration-200',
              'shadow-fab hover:shadow-fab-hover'
            )}
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar producto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
