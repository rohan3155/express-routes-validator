export type Validator = (value: any, key: string) => string | null;

export const isString: Validator = (value, key) => {
  if (typeof value !== "string") {
    return `${key} must be a string`;
  }
  return null;
};

export const isNumber: Validator = (value, key) => {
  if (typeof value !== "number") {
    return `${key} must be a number`;
  }
  return null;
};

export const isRequired: Validator = (value, key) => {
  if (value === undefined || value === null) {
    return `${key} is required`;
  }
  return null;
};

export const maxLength = (max: number): Validator => {
  return (value, key) => {
    if (typeof value === "string" && value.length > max) {
      return `${key} must not exceed ${max} characters`;
    }
    return null;
  };
};

export const minLength = (min: number): Validator => {
  return (value, key) => {
    if (typeof value === "string" && value.length < min) {
      return `${key} must be at least ${min} characters`;
    }
    return null;
  };
};

export const isEmail: Validator = (value, key) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof value !== "string" || !emailRegex.test(value)) {
    return `${key} must be a valid email`;
  }
  return null;
};

export const minValue = (min: number): Validator => {
  return (value, key) => {
    if (typeof value === "number" && value < min) {
      return `${key} must be at least ${min}`;
    }
    return null;
  };
};

export const maxValue = (max: number): Validator => {
  return (value, key) => {
    if (typeof value === "number" && value > max) {
      return `${key} must not exceed ${max}`;
    }
    return null;
  };
};

export const matchesPattern = (pattern: RegExp): Validator => {
  return (value, key) => {
    if (typeof value !== "string" || !pattern.test(value)) {
      return `${key} does not match the required pattern`;
    }
    return null;
  };
};

export const customValidator = (
  fn: (value: any) => string | null
): Validator => {
  return (value, key) => {
    const error = fn(value);
    if (error) {
      return `${key}: ${error}`;
    }
    return null;
  };
};

export const isArray: Validator = (value, key) => {
  if (!Array.isArray(value)) {
    return `${key} must be an array`;
  }
  return null;
};

export const trimString: Validator = (value, key) => {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
};

export const arrayElementsValidator = (
  elementValidators: Validator[]
): Validator => {
  return (value, key) => {
    if (!Array.isArray(value)) {
      return `${key} must be an array`;
    }

    for (let i = 0; i < value.length; i++) {
      for (const validator of elementValidators) {
        const error = validator(value[i], `${key}[${i}]`);
        if (error) {
          return error;
        }
      }
    }
    return null;
  };
};

export const objectKeysValidator = (
  keyValidators: Record<string, Validator>
): Validator => {
  return (value, key) => {
    if (typeof value !== "object" || value === null) {
      return `${key} must be an object`;
    }

    for (const objectKey in value) {
      if (value.hasOwnProperty(objectKey)) {
        const keyValidator = keyValidators[objectKey];

        if (keyValidator) {
          const error = keyValidator(value[objectKey], `${key}.${objectKey}`);
          if (error) {
            return error;
          }
        }
      }
    }

    return null;
  };
};

export const isBoolean: Validator = (value, key) => {
  if (typeof value !== "boolean") {
    return `${key} must be a boolean`;
  }
  return null;
};

export const isObject: Validator = (value, key) => {
  if (typeof value !== "object" || Array.isArray(value) || value === null) {
    return `${key} must be an object`;
  }
  return null;
};

export const arrayMaxLength = (max: number): Validator => {
  return (value, key) => {
    if (Array.isArray(value) && value.length > max) {
      return `${key} must not contain more than ${max} items`;
    }
    return null;
  };
};

export const arrayMinLength = (min: number): Validator => {
  return (value, key) => {
    if (Array.isArray(value) && value.length < min) {
      return `${key} must contain at least ${min} items`;
    }
    return null;
  };
};

export const isKeyInObject = (requiredKey: string): Validator => {
  return (value, key) => {
    if (
      typeof value !== "object" ||
      Array.isArray(value) ||
      value === null ||
      !(requiredKey in value)
    ) {
      return `${key} must contain the key '${requiredKey}'`;
    }
    return null;
  };
};

export const isAlpha: Validator = (value, key) => {
  if (typeof value !== "string" || !/^[A-Za-z]+$/.test(value)) {
    return `${key} must only contain alphabetic characters`;
  }
  return null;
};

export const isAlphanumeric: Validator = (value, key) => {
  if (typeof value !== "string" || !/^[A-Za-z0-9]+$/.test(value)) {
    return `${key} must only contain alphanumeric characters`;
  }
  return null;
};

export const isLowercase: Validator = (value, key) => {
  if (typeof value !== "string" || value !== value.toLowerCase()) {
    return `${key} must be in lowercase`;
  }
  return null;
};

export const isUppercase: Validator = (value, key) => {
  if (typeof value !== "string" || value !== value.toUpperCase()) {
    return `${key} must be in uppercase`;
  }
  return null;
};

export const isLength = (min: number, max: number): Validator => {
  return (value, key) => {
    if (
      typeof value === "string" &&
      (value.length < min || value.length > max)
    ) {
      return `${key} must be between ${min} and ${max} characters long`;
    }
    return null;
  };
};

export const isInteger: Validator = (value, key) => {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    return `${key} must be an integer`;
  }
  return null;
};

export const isPositive: Validator = (value, key) => {
  if (typeof value === "number" && value <= 0) {
    return `${key} must be a positive number`;
  }
  return null;
};

export const isNegative: Validator = (value, key) => {
  if (typeof value === "number" && value >= 0) {
    return `${key} must be a negative number`;
  }
  return null;
};

export const isDate: Validator = (value, key) => {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    return `${key} must be a valid date`;
  }
  return null;
};

export const isFutureDate: Validator = (value, key) => {
  if (value instanceof Date && value <= new Date()) {
    return `${key} must be a future date`;
  }
  return null;
};

export const isPastDate: Validator = (value, key) => {
  if (value instanceof Date && value >= new Date()) {
    return `${key} must be a past date`;
  }
  return null;
};

export const isBeforeDate = (date: Date): Validator => {
  return (value, key) => {
    if (value instanceof Date && value >= date) {
      return `${key} must be before ${date.toISOString()}`;
    }
    return null;
  };
};

export const isEmailUnique = async (
  key: string,
  value: string,
  existingEmails: string[]
): Promise<string | null> => {
  if (existingEmails.indexOf(value) !== -1) {
    return `Invalid email: ${value}`;
  }
  return null;
};

export const isDateInRange = (startDate: Date, endDate: Date): Validator => {
  return (value, key) => {
    if (value instanceof Date && (value < startDate || value > endDate)) {
      return `${key} must be between ${startDate.toISOString()} and ${endDate.toISOString()}`;
    }
    return null;
  };
};

export const isCountryCode: Validator = (value, key) => {
  const countryCodes = [
    "AD",
    "AE",
    "AF",
    "AG",
    "AI",
    "AL",
    "AM",
    "AO",
    "AQ",
    "AR",
    "AS",
    "AT",
    "AU",
    "AW",
    "AX",
    "AZ",
    "BA",
    "BB",
    "BD",
    "BE",
    "BF",
    "BG",
    "BH",
    "BI",
    "BJ",
    "BL",
    "BM",
    "BN",
    "BO",
    "BQ",
    "BR",
    "BS",
    "BT",
    "BV",
    "BW",
    "BY",
    "BZ",
    "CA",
    "CC",
    "CD",
    "CF",
    "CG",
    "CH",
    "CI",
    "CK",
    "CL",
    "CM",
    "CN",
    "CO",
    "CR",
    "CU",
    "CV",
    "CW",
    "CX",
    "CY",
    "CZ",
    "DE",
    "DJ",
    "DK",
    "DM",
    "DO",
    "DZ",
    "EC",
    "EE",
    "EG",
    "EH",
    "ER",
    "ES",
    "ET",
    "FI",
    "FJ",
    "FM",
    "FO",
    "FR",
    "GA",
    "GB",
    "GD",
    "GE",
    "GF",
    "GG",
    "GH",
    "GI",
    "GL",
    "GM",
    "GN",
    "GP",
    "GQ",
    "GR",
    "GT",
    "GU",
    "GW",
    "GY",
    "HK",
    "HM",
    "HN",
    "HR",
    "HT",
    "HU",
    "ID",
    "IE",
    "IL",
    "IM",
    "IN",
    "IO",
    "IQ",
    "IR",
    "IS",
    "IT",
    "JE",
    "JM",
    "JO",
    "JP",
    "KE",
    "KG",
    "KH",
    "KI",
    "KM",
    "KN",
    "KP",
    "KR",
    "KW",
    "KY",
    "KZ",
    "LA",
    "LB",
    "LC",
    "LI",
    "LK",
    "LR",
    "LS",
    "LT",
    "LU",
    "LV",
    "LY",
    "MA",
    "MC",
    "MD",
    "ME",
    "MF",
    "MG",
    "MH",
    "MK",
    "ML",
    "MM",
    "MN",
    "MO",
    "MP",
    "MQ",
    "MR",
    "MS",
    "MT",
    "MU",
    "MV",
    "MW",
    "MX",
    "MY",
    "MZ",
    "NA",
    "NC",
    "NE",
    "NF",
    "NG",
    "NI",
    "NL",
    "NO",
    "NP",
    "NR",
    "NU",
    "NZ",
    "OM",
    "PA",
    "PE",
    "PF",
    "PG",
    "PH",
    "PK",
    "PL",
    "PM",
    "PN",
    "PR",
    "PT",
    "PW",
    "PY",
    "QA",
    "RE",
    "RO",
    "RS",
    "RU",
    "RW",
    "SA",
    "SB",
    "SC",
    "SD",
    "SE",
    "SG",
    "SH",
    "SI",
    "SJ",
    "SK",
    "SL",
    "SM",
    "SN",
    "SO",
    "SR",
    "SS",
    "ST",
    "SV",
    "SX",
    "SY",
    "SZ",
    "TC",
    "TD",
    "TF",
    "TG",
    "TH",
    "TJ",
    "TK",
    "TL",
    "TM",
    "TN",
    "TO",
    "TR",
    "TT",
    "TV",
    "TZ",
    "UA",
    "UG",
    "US",
    "UY",
    "UZ",
    "VA",
    "VC",
    "VE",
    "VG",
    "VI",
    "VN",
    "VU",
    "WF",
    "WS",
    "YE",
    "YT",
    "ZA",
    "ZM",
    "ZW",
  ];

  if (countryCodes.indexOf(value) === -1) {
    return `${key} must be a valid country code (e.g. US, IN, GB)`;
  }
  return null;
};

export const isMongoId: Validator = (value, key) => {
  const mongoIdPattern = /^[a-f\d]{24}$/i;
  if (!mongoIdPattern.test(value)) {
    return `${key} must be a valid MongoDB ID`;
  }
  return null;
};

export const capitalizeString: Validator = (value, key) => {
  if (typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
};
