export function Select({ children, name, onValueChange }) {
  return (
    <select
      name={name}
      onChange={(e) => onValueChange(e.target.value)}
      className="border px-3 py-2 rounded w-full mb-2"
    >
      <option value="">Select...</option>
      {children}
    </select>
  );
}
export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}