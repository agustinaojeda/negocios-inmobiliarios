

const CLASES_BOTON_ACCION =
  "btn btn-sm btn-light border rounded-circle p-0 d-inline-flex align-items-center justify-content-center";

const ESTILO_BOTON_ACCION = { width: "32px", height: "32px" };

export default function BotonAccion({
  id,
  etiqueta,
  onClick,
  disabled = false,
  motivoDeshabilitado,
  colorIcono = "text-secondary",
  children,
}) {
  const titulo = disabled && motivoDeshabilitado ? motivoDeshabilitado : etiqueta;

  const boton = (
    <button
      id={id}
      type="button"
      className={`${CLASES_BOTON_ACCION} ${colorIcono}`}
      style={ESTILO_BOTON_ACCION}
      onClick={onClick}
      disabled={disabled}
      aria-label={titulo}
      title={disabled ? undefined : etiqueta}
    >
      {children}
    </button>
  );

  if (!disabled) return boton;

  return (
    <span className="d-inline-flex" title={titulo}>
      {boton}
    </span>
  );
}
