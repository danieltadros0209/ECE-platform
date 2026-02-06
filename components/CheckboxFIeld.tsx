type CheckboxFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
};

const FieldError = ({ message }: { message: string }) => {
  return <div className="invalid-feedback d-block">{message}</div>;
};

export const CheckboxField = ({
  id,
  label,
  required,
  error,
}: CheckboxFieldProps) => {
  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          id={id}
          name={id}
          className={`form-check-input ${error ? "is-invalid" : ""}`}
          required={required}
        />

        <label
          htmlFor={id}
          className={`form-check-label ${required ? "required" : ""}`}
        >
          {label}
        </label>
      </div>

      {error && <FieldError message={error} />}
    </>
  );
};
