type SelectFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode; // <option> elements
};

const FieldError = ({ message }: { message: string }) => {
  return <div className="invalid-feedback d-block">{message}</div>;
};

export const SelectField = ({
  id,
  label,
  required,
  error,
  children,
}: SelectFieldProps) => {
  return (
    <>
      <label
        htmlFor={id}
        className={`form-label ${required ? "required" : ""}`}
      >
        {label}
      </label>

      <select
        id={id}
        name={id}
        className={`form-select ${error ? "is-invalid" : ""}`}
        required={required}
      >
        {children}
      </select>

      {error && <FieldError message={error} />}
    </>
  );
};
