import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
  resendOtpApi,
} from "../../services/authApi";
import FormInput from "../../components/formInput/FormInput";

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
  const [otpKey, setOtpKey] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [loading, setIsLoading] = useState<boolean>(false);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, step]);

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
      const response = await forgotPasswordApi(formData);
      setOtpKey(response.data.otp_key);
      setCanResend(false);
      setTimer(60);
      toast.success("OTP successfully sent your email!");

      setStep(2);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("reset_key", otpKey);
      await resendOtpApi(formData);
      setCanResend(false);
      setTimer(60);
      toast.success("OTP successfully resent your email!");

      setStep(2);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (values: OtpValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("otp", values.otp);
      formData.append("otp_key", otpKey);

      await verifyOtpApi(formData);

      setStep(3);
      toast.success("OTP Verified Successfully");
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (values: ResetPasswordValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("otp_key", otpKey);
      formData.append("new_password", values.password);
      console.log(otpKey);

      await resetPasswordApi(formData);
      navigate("/", { replace: true });
      toast.success("Password Updated Successfully");
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
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
                <FormInput label="Email" name="email" type="email" />

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
                <FormInput label="Enter OTP" name="otp" />

                <Button
                  type="primary"
                  style={{ fontFamily: "var(--primary-font)" }}
                  loading={loading}
                  htmlType="submit"
                  disabled={canResend}
                  block
                >
                  Verify OTP
                </Button>

                <Button
                  type="primary"
                  style={{ fontFamily: "var(--primary-font)" }}
                  disabled={!canResend}
                  loading={loading}
                  onClick={handleResendOtp}
                  block
                >
                  Resend OTP
                </Button>

                <p className="text-center text-gray-700 font-bold">
                  OTP expires in {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </p>
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
                <FormInput
                  label="New Password"
                  name="password"
                  type="password"
                />

                <FormInput
                  label="Confirm Password"
                  name="password"
                  type="password"
                />

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
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline text-sm cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
