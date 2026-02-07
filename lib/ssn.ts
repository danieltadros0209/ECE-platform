export const maskSsn = (number: string) => {
  const numLength = number.length;
  const numArray = [];

  if (numLength === 9) return "*********";
  if (numLength >= 5) return "*****" + number.slice(5);
  if (numLength >= 3) return "***" + number.slice(3);

  return number;
};

export const formatSsn = (value: string) => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) return value;

  // clean the input for any non-digit values.
  const ssn = value.replace(/[^\d|*|-]/g, "");

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const ssnLength = ssn.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code to early

  if (ssnLength < 3) return ssn;

  if (ssnLength < 5) {
    return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
  }

  return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
};
