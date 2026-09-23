import { useCallback, useRef, useState } from "react";
 
const DURACION_MS = 3200;
 

// Se usa UNA sola vez, arriba (LayoutPublico), y se reparte hacia abajo
// como "mostrarToast" 
export function useToast() {
  const [mensaje, setMensaje] = useState(null);
  const timeoutRef = useRef(null);
 
  const mostrarToast = useCallback((texto) => {
    // Si ya había un toast esperando para ocultarse, cancelamos ese timer

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMensaje(texto);
    timeoutRef.current = setTimeout(() => setMensaje(null), DURACION_MS);
  }, []);
 
  return { mensaje, mostrarToast };
}
 