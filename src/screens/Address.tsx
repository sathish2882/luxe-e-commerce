import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Checkbox } from "antd";
import { useState } from "react";
import FormInput from "../components/formInput/FormInput";
import { toast } from "react-toastify";
import { createAddress } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { AddressFields } from "../types/authTypes";

function Address() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    addressLine1: Yup.string().required("Please Enter Address Line 1"),
    addressLine2: Yup.string().required("Please Enter Address Line 2"),
    city: Yup.string().required("Please Enter City Name"),
    state: Yup.string().required("Please Enter State Name"),
    country: Yup.string().required("Please Enter Country Name"),
    pincode: Yup.string().required("Please Enter Pincode"),
    isDefault: Yup.boolean().default(false),
  });

  const handleAddAddress = async (values: AddressFields) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("address_line1", values.addressLine1);
      formData.append("address_line2", values.addressLine2);
      formData.append("city", values.city);
      formData.append("state", values.state);
      formData.append("country", values.country);
      formData.append("pincode", values.pincode);
      formData.append("isdefault", String(values.isDefault));

      const response = await createAddress(formData);

      if (response.data) {
        navigate("/cart");
      }
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-15 px-8 sm:px-10 xl:px-20 min-h-screen flex flex-col items-center px-4 login">
      <div
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg 
                shadow-[0_0_50px_rgba(168,85,247,0.5)]"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Add New Address</h2>

        <Formik<AddressFields>
          initialValues={{
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            isDefault: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddAddress}
        >
          {() => (
            <Form className="space-y-4">
              <FormInput label="Address Line1" name="addressLine1" />

              <FormInput label="Address Line2" name="addressLine2" />

              <FormInput label="City" name="city" />

              <FormInput label="State" name="state" />

              <FormInput label="Country" name="country" />

              <FormInput label="Pincode" name="pincode" />

              <div>
                <label className="mr-2" htmlFor="checkbox">
                  Is Default Address
                </label>

                <Field
                  id="checkbox"
                  name="isDefault"
                  type="checkbox"
                  as={Checkbox}
                />

                <ErrorMessage
                  name="isDefault"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                aria-label="add address"
                loading={loading}
                className="mt-[30px]"
                style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}
              >
                Add Address
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default Address;
