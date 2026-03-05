import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


interface forgotPasswordValues {
  email: string
}

interface OtpValues {
  otp: string
}

interface ResetPasswordValues {
  password: string
  confirmPassword: string
}


function ForgotPassword() {
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userEmail, setUserEmail] = useState("");


  const emailSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const otpSchema = Yup.object({
    otp: Yup.string()
      .length(4, "OTP must be 4 digits")
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

  const handleEmailSubmit = (values:forgotPasswordValues) => {
    let userExists = true

    if (!userExists) {
      toast.error("User not found")
      return;
    }

    setUserEmail(values.email);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);

    setStep(2);
  };


  const handleOtpSubmit = (values:OtpValues) => {
    if (values.otp === generatedOtp) {
      toast.success("OTP Verified Successfully")
      setStep(3);
    } else {
      toast.error("Invalid Otp")
    }
  };


  const handleResetSubmit = (values:ResetPasswordValues) => {

    toast.success("Password Updated Successfully")
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg 
                shadow-[0_0_50px_rgba(168,85,247,0.5)]">

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

                <Button type="primary" style={{fontFamily:"var(--primary-font)"}} htmlType="submit" block>
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

                <Button type="primary" style={{fontFamily:"var(--primary-font)"}} htmlType="submit" block>
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
                  <Field name="password" as={Input.Password} className="w-full" />
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

                <Button type="primary" style={{fontFamily:"var(--primary-font)"}} htmlType="submit" block>
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