export default function FormInput({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  hint = "",
  className = "col-md-6",
  error = "",
}) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id || name}
          className="form-label small fw-medium text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={id || name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-control rounded-3 py-2 ${error ? "is-invalid" : ""}`}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {!error && hint && <div className="form-text small">{hint}</div>}
    </div>
  );
}