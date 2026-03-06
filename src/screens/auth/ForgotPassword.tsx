import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "../../services/authApi";

interface forgotPasswordValues {
  email: string;
}

interface OtpValues {
  otp: string;
}

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

function ForgotPassword() {

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [loading, setIsLoading] = useState<boolean>(false);

  const emailSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const otpSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  const passwordSchema = Yup.object({
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleEmailSubmit = async (values: forgotPasswordValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("email", values.email);

      setEmail(values.email)

      await forgotPasswordApi(formData);

      toast.success("OTP successfully sent your email!")

      setStep(2);
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async(values:OtpValues) => {

       try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("otp", values.otp);


      setOtp(values.otp)
      await verifyOtpApi(formData);
      
      setStep(3);
      toast.success("OTP Verified Successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
      
    
  

  const handleResetSubmit = async(values: ResetPasswordValues) => {

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);

      await resetPasswordApi(formData);
      navigate("/", { replace: true });
      toast.success("Password Updated Successfully");
    } catch (error: any) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
      
    
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg 
                shadow-[0_0_50px_rgba(168,85,247,0.5)]"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Forgot Password
        </h2>

        {step === 1 && (
          <Formik<forgotPasswordValues>
            initialValues={{ email: "" }}
            validationSchema={emailSchema}
            onSubmit={handleEmailSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label>Email</label>
                  <Field name="email" as={Input} className="w-full" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Button
                  type="primary"
                  style={{ fontFamily: "var(--primary-font)" }}
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Send OTP
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {step === 2 && (
          <Formik<OtpValues>
            initialValues={{ otp: "" }}
            validationSchema={otpSchema}
            onSubmit={handleOtpSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label>Enter OTP</label>
                  <Field name="otp" as={Input} className="w-full" />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Button
                  type="primary"
                  style={{ fontFamily: "var(--primary-font)" }}
                  loading={loading}
                  htmlType="submit"
                  block
                >
                  Verify OTP
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {step === 3 && (
          <Formik<ResetPasswordValues>
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={passwordSchema}
            onSubmit={handleResetSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <label>New Password</label>
                  <Field
                    name="password"
                    as={Input.Password}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label>Confirm Password</label>
                  <Field
                    name="confirmPassword"
                    as={Input.Password}
                    className="w-full"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Button
                  type="primary"
                  style={{ fontFamily: "var(--primary-font)" }}
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Reset Password
                </Button>
              </Form>
            )}
          </Formik>
        )}

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-blue-500 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
