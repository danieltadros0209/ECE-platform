// components/FormField.tsx
type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  placeholder?: string | undefined;
  children?: React.ReactNode; // for <select> options
  type?: string; // text, email, date, etc.
  min?: string | undefined;
  step?: string | undefined;
  as?: "input" | "select";
};

const FieldError = ({ message }: { message: string }) => {
  return <div className="invalid-feedback d-block">{message}</div>;
};

export const FormField = ({
  id,
  label,
  required,
  placeholder,
  error,
  children,
  type = "text",
  min,
  step,
  as = "input",
}: FormFieldProps) => {
  const Component = as;

  return (
    <>
      <label
        htmlFor={id}
        className={`form-label ${required ? "required" : ""}`}
      >
        {label}
      </label>

      <Component
        id={id}
        name={id}
        type={as === "input" ? type : undefined}
        className={`form-control ${as === "select" ? "form-select" : ""} ${
          error ? "is-invalid" : ""
        }`}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
      >
        {children}
      </Component>

      {error && <FieldError message={error} />}
    </>
  );
};
