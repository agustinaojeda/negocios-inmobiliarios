export default function FormInput({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = 'col-md-6'
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id || name} className="form-label small fw-medium text-secondary">
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
        className="form-control rounded-3 py-2"
      />
    </div>
  )
}