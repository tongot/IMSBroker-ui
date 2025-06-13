import { IFieldCategory } from "../api/ims-client";
import IValidationProperties from "./interfaces/validation-properties";

export default function GetFieldRules(fields: IFieldCategory[]|undefined){
    const listOfRules: IValidationProperties[] = [];
    if(!fields){
      return listOfRules
    }
    fields.forEach((x) => {
            x.fields?.forEach((r) => {
              if (r.validationObject) {
                const rule: IValidationProperties = JSON.parse(r.validationObject);
                rule.name = r.name||"";
                rule.type = r.type||"";
                rule.defaultValue = r.value;
                listOfRules.push(rule);
              }
            });
          });
    return listOfRules;
}