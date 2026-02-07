import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";

import { formatSsn, maskSsn } from "@/lib/ssn";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  value?: string;
  onChange?: (value: string) => void;
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
  type = "text",
  min,
  step,
}: FormFieldProps) => {
  const [ssn, setSsn] = useState<string>("");
  const [maskedSsn, setMaskedSsn] = useState<string>("");

  // prevent to copy, cut and paste SSN
  const block = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };

  const handleOnChange = (event: React.FormEvent<HTMLInputElement>) => {
    const input: string = event.currentTarget.value;

    if (input.length > 9) return;
    setSsn(input);
  };

  useEffect(() => setMaskedSsn(formatSsn(maskSsn(ssn))), [ssn]);

  return (
    <>
      <div className="d-flex align-items-center mb-1">
        <label
          htmlFor={id}
          className={`form-label mb-0 ${required ? "required" : ""}`}
        >
          {label}
        </label>
        {id === "ssn" && (
          <abbr
            title="We request an SSN to verify identity, prevent duplicate or fraudulent applications, and meet basic eligibility and reporting requirements for financial assistance programs. Only the minimum necessary data is used and never exposed outside the secure submission flow."
            className="ms-1"
          >
            <FontAwesomeIcon icon={faCircleQuestion} />
          </abbr>
        )}
      </div>
      {id === "ssn" && (
        <div className="position-relative ssn-input">
          <input
            disabled
            value={maskedSsn}
            type="text"
            className="form-control shown"
          />
          <input
            id="ssn"
            name="ssn"
            onCopy={block}
            onCut={block}
            onPaste={block}
            onContextMenu={block}
            value={ssn}
            onChange={handleOnChange}
            className={`form-control hidden ${error ? "is-invalid" : ""}`}
            type="number"
          />
        </div>
      )}
      {id !== "ssn" && (
        <input
          id={id}
          name={id}
          type={type}
          className={`form-control ${error ? "is-invalid" : ""}`}
          required={required}
          placeholder={placeholder}
          min={min}
          step={step}
          onPaste={id === "ssn" ? (e) => e.preventDefault() : undefined}
          onCopy={id === "ssn" ? (e) => e.preventDefault() : undefined}
          onCut={id === "ssn" ? (e) => e.preventDefault() : undefined}
        />
      )}

      {error && <FieldError message={error} />}
    </>
  );
};
