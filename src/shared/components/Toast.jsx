import "./Toast.css";

export default function Toast({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div className="toast-app" role="status">
      {mensaje}
    </div>
  );
}