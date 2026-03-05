import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../services/authApi";
import * as Yup from "yup";
import { Button, Input } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";


interface SignupFormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function Signup() {
   const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Please enter your username"),
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Please enter your password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSubmit = async (values:SignupFormValues) => {
     try {
      setLoading(true);

    const formData = new FormData();

    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);

    const response = await signupApi(formData)

    console.log(response)

    navigate("/login");
     }
     catch (error: any) {
           const message = error.response?.data?.message || "Something went wrong";
           toast.error(message);
         }
         finally {
         setLoading(false);
       }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 login">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg shadow-[0_0_50px_rgba(168,85,247,0.5)]">

        <Link className="text-center" to="/">
          <h1 className="font-bold text-2xl">
            LUXE<span className="text-[rgb(230,107,26)]">.</span>
          </h1>
        </Link>

        <Formik<SignupFormValues>
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <label>Username</label>
                <Field name="username" as={Input} />
                <ErrorMessage name="username" component="div" className="text-red-500 text-sm"/>
              </div>
              <div>
                <label>Email</label>
                <Field name="email" as={Input} />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm"/>
              </div>
              <div>
                <label>Password</label>
                <Field name="password" as={Input.Password} />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm"/>
              </div>
              <div>
                <label>Confirm Password</label>
                <Field name="confirmPassword" as={Input.Password} />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm"/>
              </div>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="mt-[30px]"
                style={{ fontSize: "15px", fontFamily: "var(--font-body)"}}
              >
                Sign Up
              </Button>
              <p className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold">
                  Login
                </Link>
              </p>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Signup;