import * as yup from "yup";
import IValidationProperties from "./interfaces/validation-properties";

// Function to generate Yup schema from JSON rules
const GenerateYupSchema = (rules: IValidationProperties[]) => {
  const shape: any = {};
  let validator;

  rules.forEach((rule) => {
    switch (rule.type) {
      case "text":
        validator = yup.string();
        if (rule.isRequired)
          validator = validator.required(`${rule.name} is required`);
        if (rule.min)
          validator = validator.min(
            rule.min,
            `${rule.name} must be at least ${rule.min} characters`
          );
        if (rule.max)
          validator = validator.max(
            rule.max,
            `${rule.name} must be at most ${rule.max} characters`
          );
        if (rule.match) {
          validator = validator.oneOf(
            [yup.ref(rule.match)],
            `${rule.match} must match`
          );
        }
        break;

      case "options":
        validator = yup.string();
        if (rule.isRequired)
          validator = validator.required(`${rule.name} is required`);
        break;

      case "expanded-text":
        validator = yup.string();
        if (rule.isRequired)
          validator = validator.required(`${rule.name} is required`);
        if (rule.min)
          validator = validator.min(
            rule.min,
            `${rule.name} must be at least ${rule.min} characters`
          );
        if (rule.max)
          validator = validator.max(
            rule.max,
            `${rule.name} must be at most ${rule.max} characters`
          );
        break;

      case "number":
        validator = yup.number();
        if (rule.isRequired)
          validator = validator.required(`${rule.name} is required`);
        if (rule.isPositiveNumber)
             validator = validator.positive("this must be greater than zero");
        if (rule.min)
          validator = validator.min(
            Number(rule.min),
            `${rule.name} must be at least ${rule.min}`
          );
        if (rule.max)
          validator = validator.max(
            Number(rule.max),
            `${rule.name} must be at most ${rule.max}`
          );
        // 
        if (rule.lessThan) {
          validator = validator.max(
            yup.ref(rule.lessThan),
            `${rule.name} must be less than ${rule.greaterThan}`
          );
        }
        if (rule.greaterThan) {
          validator = validator.min(
            yup.ref(rule.greaterThan),
            `${rule.name} must be greater than ${rule.greaterThan}`
          );
        }
        break;

      case "date":
        validator = yup.date();
        if (rule.isRequired)
          validator = validator.required(`${rule.name} is required`);
        if (rule.lessThan) {
          validator = validator.max(
            yup.ref(rule.lessThan),
            `${rule.name} must be before ${rule.greaterThan}`
          );
        }
        if (rule.greaterThan) {
          validator = validator.min(
            yup.ref(rule.greaterThan),
            `${rule.name} must be after ${rule.greaterThan}`
          );
        }

        break;

      default:
        throw new Error(`Unsupported type: ${rule.type}`);
    }

    shape[rule.name] = validator;
  });

  return yup.object().shape(shape);
};

export default GenerateYupSchema;
