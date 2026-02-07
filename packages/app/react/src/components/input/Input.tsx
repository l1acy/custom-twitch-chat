import './Input.css'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

function Input({ label, id, ...props }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label htmlFor={id} style={{ color: "#fafafa" }}>{label}</label>}
      <input
        id={id}
        {...props}
        style={{
          padding: "8px 12px",
          backgroundColor: "#09090b",
          border: "1px solid #27272a",
          borderRadius: 10,
          maxWidth: 400,
          color: "#fafafa",
          ...props.style,
        }}
      />
    </div>
  );
};

export default Input;