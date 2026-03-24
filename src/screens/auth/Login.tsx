import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "antd";
import {
  loginApi,
  verifyOtpFor2FA,
  resendOtpApi,
} from "../../services/authApi";
import { setToken, setUser } from "../../utils/authCookies";
import { toast } from "react-toastify";
import FormInput from "../../components/formInput/FormInput";
import { syncCartAfterLogin } from "../../utils/cartHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface LoginFormValues {
  email: string;
  password: string;
}

interface OtpValues {
  otp: string;
}

function Login() {
  const cart = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [otpKey, setOtpKey] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your email!"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Please enter your password!"),
  });

  const otpSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be 6 digits")
      .required("OTP is required"),
  });

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0 && step === 2) {
      setCanResend(true);
    }
  }, [timer, step]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("email", values.email);
      formData.append("password", values.password);

      const response = await loginApi(formData);

      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user_type)
        if (cart.items.length !== 0) {
          await syncCartAfterLogin(dispatch);
        }
        if (response.data.user_type === "admin") {
          navigate("/admin-layout");
        } else if (response.data.user_type === "user") {
          navigate("/", { replace: true });
        }
        toast.success("Login successful");
      } else if (response.data.otp_key) {
        setOtpKey(response.data.otp_key);
        setTimer(response?.data?.timer);
        setCanResend(false);
        toast.success("OTP sent to your email");
        setStep(2);
      }
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values: OtpValues) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("otp", values.otp);
      formData.append("otp_key", otpKey);
      const response = await verifyOtpFor2FA(formData);
      setToken(response.data.token);
      setUser(response.data.user_type)

      await syncCartAfterLogin(dispatch);
      navigate("/", { replace: true });
      toast.success("OTP Verified Successfully");
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("reset_key", otpKey);
      const response = await resendOtpApi(formData);
      setCanResend(false);
      setTimer(response?.data?.timer);
      toast.success("OTP successfully resent your email!");
      setStep(2);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg 
                shadow-[0_0_50px_rgba(168,85,247,0.5)]"
      >
        <Link className="text-center" to="/">
          <h1 className="font-bold text-2xl">
            LUXE<span className="text-[rgb(230,107,26)]">.</span>
          </h1>
        </Link>
        {step === 1 && (
          <Formik<LoginFormValues>
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <FormInput label="Email" name="email" type="email" />

                <FormInput label="Password" name="password" type="password" />

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
        )}
        {step === 2 && (
          <Formik<OtpValues>
            initialValues={{ otp: "" }}
            validationSchema={otpSchema}
            onSubmit={handleOtpSubmit}
          >
            {({values}) => (
              <Form className="space-y-4">
                <FormInput label="Enter OTP" name="otp" type="text" />

                
                <Button
                  type="primary"
                  style={{ fontFamily: "var(--primary-font)" }}
                  loading={loading}
                  disabled={values.otp === ""}
                  htmlType="submit"
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
      </div>
    </div>
  );
}

export default Login;
