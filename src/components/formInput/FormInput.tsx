import { Field, ErrorMessage } from "formik";
import {Input} from "antd";

interface FormInputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password";
}

function FormInput({ label, name, type = "text" }: FormInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name}>{label}</label>
      {type === "password" ? (
        <Field id={name} name={name} as={Input.Password} />
      ) : (
        <Field id={name} name={name} as={Input} type={type} />
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
}

export default FormInput;
