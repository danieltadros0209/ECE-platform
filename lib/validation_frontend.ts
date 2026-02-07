export const validateDob = (dob: string, errors: object) => {
  const date = new Date(dob);
  const min = new Date("1900-01-01");
  const now = new Date();

  if (isNaN(date.getTime())) {
    return (errors.dateOfBirth = "Invalid date format");
  }

  if (date < min) {
    return (errors.dateOfBirth = "Date of birth must be after 01/01/1900");
  }

  if (date > now) {
    return (errors.dateOfBirth = "Date of birth cannot be in the future");
  }

  return;
};

export const validateZipcode = (zip: string, errors: object) => {
  const pattern = /^\d{5}(-\d{4})?$/;
  if (!pattern.test(zip)) {
    return (errors.zipCode = "Invalid ZIP code format");
  }
  return null;
};
