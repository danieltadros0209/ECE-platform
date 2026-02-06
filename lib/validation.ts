import type { ApplicationInput } from "./types";
import { US_STATE_CODE_SET } from "./constants";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

type StateCode = typeof US_STATE_CODE_SET extends Set<infer T> ? T : never;

const toStateCode = (value: string): StateCode | null => {
  const upper = value.toUpperCase() as StateCode;
  return US_STATE_CODE_SET.has(upper) ? upper : null;
};

/** Keep only digits; dashes are fine in input. */
const ssnDigits = (ssn: string): string => {
  return ssn.replace(/\D/g, "");
};

/** Basic SSN checks: 9 digits; no all-zero parts; no 666; no 9xx. */
export const isValidSsnPattern = (ssn: string): boolean => {
  const digits = ssnDigits(ssn);
  if (digits.length !== 9) return false;
  const area = digits.slice(0, 3);
  const group = digits.slice(3, 5);
  const serial = digits.slice(5, 9);
  if (area === "000" || group === "00" || serial === "0000") return false;
  if (area === "666") return false;
  if (area.startsWith("9")) return false; // disallowed area
  return true;
};

/** Flag SSNs that look fake or invalid. */
export const hasUnusualSsn = (ssn: string): boolean => {
  const digits = ssnDigits(ssn);
  if (digits.length !== 9) return true;
  return !isValidSsnPattern(ssn);
};

export type ValidationFailure = {
  success: false;
  errors: string[];
  fieldErrors: Record<string, string>;
};

export type ValidationResult =
  | { success: true; data: ApplicationInput }
  | ValidationFailure;

export const validateApplication = (body: unknown): ValidationResult => {
  const errors: string[] = [];
  const fieldErrors: Record<string, string> = {};

  const setFieldError = (field: string, message: string) => {
    errors.push(message);
    if (!fieldErrors[field]) fieldErrors[field] = message;
  };

  if (!body || typeof body !== "object") {
    return {
      success: false,
      errors: ["Request body must be a JSON object."],
      fieldErrors: {},
    };
  }

  const payload = body as Record<string, unknown>;

  const readString = (key: string, required = true): string => {
    const value = payload[key];
    if (value == null || typeof value !== "string") {
      if (required)
        setFieldError(key, `${key} is required and must be a string.`);
      return "";
    }
    return value.trim();
  };

  const readNumber = (key: string): number => {
    const value = payload[key];
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
    setFieldError(key, `${key} must be a number.`);
    return 0;
  };

  const readBoolean = (key: string): boolean => {
    const value = payload[key];
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    setFieldError(key, `${key} must be true or false.`);
    return false;
  };

  const firstName = readString("firstName");
  const lastName = readString("lastName");
  const email = readString("email");
  const phone = readString("phone");
  const dateOfBirth = readString("dateOfBirth");
  const ssn = readString("ssn");
  const addressLine1 = readString("addressLine1");
  const addressLine2 = readString("addressLine2", false);
  const city = readString("city");
  const state = readString("state");
  const zipCode = readString("zipCode");
  const programName = readString("programName");
  const amountRequested = readNumber("amountRequested");
  const agreement = readBoolean("agreement");

  if (firstName.length < 1)
    setFieldError("firstName", "First name is required.");
  if (lastName.length < 1) setFieldError("lastName", "Last name is required.");
  if (email.length < 1) setFieldError("email", "Email is required.");
  if (email.length >= 1 && !EMAIL_REGEX.test(email)) {
    setFieldError("email", "Email must be a valid format.");
  }
  if (phone.length < 1) setFieldError("phone", "Phone is required.");
  if (dateOfBirth.length < 1)
    setFieldError("dateOfBirth", "Date of birth is required.");
  if (ssn.length < 1) setFieldError("ssn", "SSN is required.");
  if (ssn.length >= 1 && ssnDigits(ssn).length !== 9) {
    setFieldError("ssn", "SSN must be 9 digits (dashes allowed).");
  }
  if (addressLine1.length < 1)
    setFieldError("addressLine1", "Address line 1 is required.");
  if (city.length < 1) setFieldError("city", "City is required.");
  const normalizedState = toStateCode(state);
  if (state.length !== 2 || !normalizedState) {
    setFieldError("state", "State must be a 2-letter US state code.");
  }
  if (zipCode.length < 1) {
    setFieldError("zipCode", "ZIP code is required.");
  } else if (!ZIP_REGEX.test(zipCode.replace(/\s/g, ""))) {
    setFieldError(
      "zipCode",
      "ZIP must be 5 or 9 digits (e.g. 12345 or 12345-6789).",
    );
  }
  if (programName.length < 1)
    setFieldError("programName", "Program name is required.");
  if (amountRequested < 0 || Number.isNaN(amountRequested)) {
    setFieldError(
      "amountRequested",
      "Amount requested must be a non-negative number.",
    );
  }
  if (!agreement) setFieldError("agreement", "You must agree to the terms.");

  if (errors.length > 0) return { success: false, errors, fieldErrors };

  const data: ApplicationInput = {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    ssn,
    addressLine1,
    addressLine2: addressLine2 || undefined,
    city,
    state: (normalizedState ??
      state.toUpperCase()) as ApplicationInput["state"],
    zipCode: zipCode.replace(/\s/g, ""),
    programName,
    amountRequested,
    agreement,
  };

  return { success: true, data };
};
