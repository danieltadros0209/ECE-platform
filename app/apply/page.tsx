"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { US_STATE_CODES } from "@/lib/constants";
import { FormField, SelectField, CheckboxField } from "@/components";

const ApplyPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setFieldErrors({});
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      dateOfBirth: formData.get("dateOfBirth"),
      ssn: formData.get("ssn"),
      addressLine1: formData.get("addressLine1"),
      addressLine2: formData.get("addressLine2") || undefined,
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      programName: formData.get("programName"),
      amountRequested: Number(formData.get("amountRequested")),
      agreement: formData.get("agreement") === "on",
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit?target=/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.fieldErrors && typeof data.fieldErrors === "object") {
          setFieldErrors(data.fieldErrors);
        }
        const errors = Array.isArray(data.errors)
          ? data.errors.join(" ")
          : data.error || "Submission failed.";
        setMessage({ type: "error", text: errors });
        return;
      }

      setMessage({
        type: "success",
        text: `Application submitted. Your application ID is ${data.applicationId}. Review tier: ${data.reviewTier}.`,
      });
      form.reset();
    } catch (err) {
      setMessage({
        type: "error",
        text: "Network or server error. Please try again.",
      });

      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const err = (name: string) => fieldErrors[name];

  return (
    <div className="container py-4">
      <nav className="mb-4">
        <Link href="/">← Home</Link>
      </nav>
      <h1 className="mb-4">Stipend Application</h1>

      {message && (
        <div
          className={`alert alert-${message.type === "success" ? "success" : "danger"}`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="needs-validation">
        <fieldset className="mb-4">
          <legend className="h5">Applicant Information</legend>
          <div className="row g-3">
            <div className="col-md-6">
              <FormField
                id="firstName"
                label="First name"
                required
                error={err("firstName")}
              />
            </div>
            <div className="col-md-6">
              <FormField
                id="lasttName"
                label="Last name"
                required
                error={err("lastName")}
              />
            </div>
            <div className="col-md-12">
              <FormField
                id="email"
                label="Email"
                type="email"
                required
                error={err("email")}
              />
            </div>
            <div className="col-md-6">
              <FormField
                id="phone"
                label="Phone"
                type="tel"
                required
                error={err("email")}
              />
            </div>
            <div className="col-md-6">
              <FormField
                id="dateOfBirth"
                label="Date of birth"
                type="date"
                required
                error={err("dateOfBirth")}
              />
            </div>
            <div className="col-md-12">
              <FormField
                id="ssn"
                label="Social Security Number"
                required
                placeholder="XXX-XX-XXXX"
                error={err("ssn")}
              />
            </div>
            <div className="col-12">
              <FormField
                id="addressLine1"
                label="Address Line 1"
                required
                error={err("addressLine1")}
              />
            </div>
            <div className="col-md-2">
              <SelectField
                id="state"
                label="State"
                required
                error={err("state")}
              >
                {" "}
                <option value="">--</option>{" "}
                {US_STATE_CODES.map((s) => (
                  <option key={s} value={s}>
                    {" "}
                    {s}{" "}
                  </option>
                ))}{" "}
              </SelectField>
            </div>
            <div className="col-md-3">
              <FormField
                id="zipCode"
                label="Zip Code"
                required
                error={err("zipCode")}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="h5">Program Information</legend>
          <div className="row g-3">
            <div className="col-12">
              <FormField
                id="programName"
                label="Program Name"
                required
                error={err("programName")}
              />
            </div>
            <div className="col-md-6">
              <FormField
                id="amountRequested"
                label="Amount request ($)"
                required
                error={err("amountRequested")}
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div className="col-12">
              <CheckboxField
                id="agreement"
                label="I agree to the terms and conditions"
                required
                error={err("agreement")}
              />
            </div>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyPage;
