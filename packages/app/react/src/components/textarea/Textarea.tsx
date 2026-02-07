import "./Textarea.css";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea(props: TextAreaProps) {
  const { label, id, style, ...rest } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label htmlFor={id} style={{ color: "#fafafa" }}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...rest}
        style={{
          padding: "8px 12px",
          backgroundColor: "#09090b",
          border: "1px solid #27272a",
          borderRadius: 10,
          maxWidth: 400,
          color: "#fafafa",
          ...style,
        }}
      />
    </div>
  );
}
