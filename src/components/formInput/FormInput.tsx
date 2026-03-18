import { Field, ErrorMessage } from "formik";
import { Input, InputNumber } from "antd";

interface FormInputProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "number";
}

function FormInput({ label, name, type = "text" }: FormInputProps) {
  return (
    <div className="space-y-1 flex flex-col">
      <label htmlFor={name}>{label}</label>
      {type === "password" ? (
        <Field id={name} name={name} as={Input.Password} />
      ) : type === "number" ? (
        <Field id={name} name={name}>
          {({ field, form }: any) => (
            <InputNumber
              value={field.value}
              style={{ width: "100%" }}
              onChange={(value) => form.setFieldValue(name, value)}
            />
          )}
        </Field>
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
