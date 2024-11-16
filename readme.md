# Powerful Validators for Node.js

**A comprehensive set of reusable and customizable validation functions for your Node.js applications.**  
Ensure clean, safe, and validated input data with ease.

---

## Features

- Easy-to-use and customizable validators
- Supports validation for strings, numbers, arrays, emails, dates, and more
- Designed for use with Express.js middleware
- Extendable with custom validation logic

---

## Installation

Install the package via npm:

```bash
npm install your-package-name
```

---

## Available Validators

Here is a complete list of the validators available in this package:

### **1. `isString`**

Validates that a value is a string.

```js
isString(value, key);
```

---

### **2. `isNumber`**

Validates that a value is a number.

```js
isNumber(value, key);
```

---

### **3. `isRequired`**

Validates that the value is neither `null` nor `undefined`.

```js
isRequired(value, key);
```

---

### **4. `maxLength`**

Validates that a string does not exceed a maximum length.

```js
maxLength(max)(value, key);
```

---

### **5. `minLength`**

Validates that a string is at least a minimum length.

```js
minLength(min)(value, key);
```

---

### **6. `isEmail`**

Validates that the value is a valid email address.

```js
isEmail(value, key);
```

---

### **7. `minValue`**

Validates that a numeric value is greater than or equal to a specified minimum value.

```js
minValue(min)(value, key);
```

---

### **8. `maxValue`**

Validates that a numeric value is less than or equal to a specified maximum value.

```js
maxValue(max)(value, key);
```

---

### **9. `matchesPattern`**

Validates that the value matches a given regular expression.

```js
matchesPattern(pattern)(value, key);
```

---

### **10. `customValidator`**

Allows you to define a custom validation function.

```js
customValidator(fn)(value, key);
```

---

### **11. `isArray`**

Validates that the value is an array.

```js
isArray(value, key);
```

---

### **12. `trimString`**

Trims whitespace from the beginning and end of a string.

```js
trimString(value, key);
```

---

### **13. `arrayElementsValidator`**

Validates the elements inside an array using provided validators.

```js
arrayElementsValidator(elementValidators)(value, key);
```

---

### **14. `objectKeysValidator`**

Validates the keys of an object using provided key validators.

```js
objectKeysValidator(keyValidators)(value, key);
```

---

### **15. `isBoolean`**

Validates that the value is a boolean.

```js
isBoolean(value, key);
```

---

### **16. `isObject`**

Validates that the value is an object.

```js
isObject(value, key);
```

---

### **17. `arrayMaxLength`**

Validates that an array does not exceed a maximum length.

```js
arrayMaxLength(max)(value, key);
```

---

### **18. `arrayMinLength`**

Validates that an array contains at least a minimum number of elements.

```js
arrayMinLength(min)(value, key);
```

---

### **19. `isKeyInObject`**

Validates that a specific key exists in an object.

```js
isKeyInObject(requiredKey)(value, key);
```

---

### **20. `isAlpha`**

Validates that the value only contains alphabetic characters (A-Z, a-z).

```js
isAlpha(value, key);
```

---

### **21. `isAlphanumeric`**

Validates that the value only contains alphanumeric characters (A-Z, a-z, 0-9).

```js
isAlphanumeric(value, key);
```

---

### **22. `isLowercase`**

Validates that the value is in lowercase.

```js
isLowercase(value, key);
```

---

### **23. `isUppercase`**

Validates that the value is in uppercase.

```js
isUppercase(value, key);
```

---

### **24. `isLength`**

Validates that the length of a string is within a specified range.

```js
isLength(min, max)(value, key);
```

---

### **25. `isInteger`**

Validates that the value is an integer.

```js
isInteger(value, key);
```

---

### **26. `isPositive`**

Validates that the value is a positive number.

```js
isPositive(value, key);
```

---

### **27. `isNegative`**

Validates that the value is a negative number.

```js
isNegative(value, key);
```

---

### **28. `isDate`**

Validates that the value is a valid date.

```js
isDate(value, key);
```

---

### **29. `isFutureDate`**

Validates that the date is in the future.

```js
isFutureDate(value, key);
```

---

### **30. `isPastDate`**

Validates that the date is in the past.

```js
isPastDate(value, key);
```

---

### **31. `isBeforeDate`**

Validates that the date is before a given date.

```js
isBeforeDate(date)(value, key);
```

---

### **32. `isEmailUnique`**

Validates that the email is unique in a given list of emails (asynchronous).

```js
isEmailUnique(key, value, existingEmails);
```

---

### **33. `isDateInRange`**

Validates that the date is within a specified range.

```js
isDateInRange(startDate, endDate)(value, key);
```

---

### **34. `isCountryCode`**

Validates that the value is a valid two-letter country code.

```js
isCountryCode(value, key);
```

---

### **35. `isMongoId`**

Validates that the value is a valid MongoDB ObjectId.

```js
isMongoId(value, key);
```

---

### **36. `capitalizeString`**

Capitalizes the first letter of each word in a string.

```js
capitalizeString(value, key);
```

---

## Example Usage

Here’s a simple example of how to use these validators:

```js
const { isString, isEmail, isRequired } = require("express-routes-validator");

const schema = {
  email: [isRequired, isEmail],
  username: [isRequired, isString],
};

const validateInput = (input) => {
  const errors = {};

  for (const key in schema) {
    const validators = schema[key];
    for (const validator of validators) {
      const error = validator(input[key], key);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  }

  return errors;
};

const inputData = {
  email: "invalid-email.com",
  username: "", // Empty username
};

const validationErrors = validateInput(inputData);

console.log(validationErrors); // Output errors
```

---

## Contributing

Feel free to fork and submit pull requests. All contributions are welcome!
If you find any issues or would like to suggest a feature, please create an issue on GitHub.

---

## License

This package is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
