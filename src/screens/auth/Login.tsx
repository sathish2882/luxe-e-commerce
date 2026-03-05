import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button, Input } from "antd";
import { loginApi } from "../../services/authApi";
import { setToken } from "../../utils/authCookies";
import { toast } from "react-toastify";

interface LoginFormValues {
  email: string;
  password: string;
}

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Please input your email!"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Please input your password!"),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("email", values.email);
      formData.append("password", values.password);

      const response = await loginApi(formData);

      console.log(response.data.token)

      setToken(response.data.token);
      toast.success("Login successful");

      navigate(`/`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
    finally {
    setLoading(false);
  }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 login">
      <div
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg 
                shadow-[0_0_50px_rgba(168,85,247,0.5)]"
      >
        <Link className="text-center" to="/">
          <h1 className="font-bold text-2xl">
            LUXE<span className="text-[rgb(230,107,26)]">.</span>
          </h1>
        </Link>
        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              <div className="mb-4">
                <label>Email</label>
                <Field name="email" as={Input} className="w-full" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <label>Password</label>
                <Field name="password" as={Input.Password} className="w-full" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="mt-[30px]"
                style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}
              >
                Login
              </Button>

              <Button
                type="text"
                onClick={handleForgotPassword}
                block
                style={{
                  color: "#0d6ac9",
                  fontWeight: "600",
                  fontSize: "15px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Forgot Password
              </Button>
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[var(--secondary-color)] font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
