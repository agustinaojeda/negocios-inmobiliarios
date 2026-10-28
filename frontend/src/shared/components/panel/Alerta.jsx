// Alerta Bootstrap descartable. alerta = { tipo: "success" | "danger" | ..., mensaje }
// El estado se maneja con el hook useAlerta (shared/hooks/useAlerta.js)
export default function Alerta({ alerta, onCerrar }) {
  if (!alerta) return null;

  return (
    <div
      className={`alert alert-${alerta.tipo} alert-dismissible fade show rounded-3 small py-2`}
      role="alert"
    >
      {alerta.mensaje}
      <button
        type="button"
        className="btn-close py-2"
        aria-label="Cerrar"
        onClick={onCerrar}
      />
    </div>
  );
}
