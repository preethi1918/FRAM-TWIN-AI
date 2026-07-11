export default function FormField({ label, ...inputProps }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...inputProps} />
    </div>
  )
}
