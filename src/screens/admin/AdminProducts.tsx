import { Button, Popconfirm, Space } from "antd";
import TableComponent from "../../components/table/Table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../redux/productSlice";
import { getProductDetails } from "../../services/authApi";
import { toast } from "react-toastify";
import { Product } from "../../types/authTypes";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/formInput/FormInput";
import {
  updateProduct,
  addProduct,
  deleteProduct,
} from "../../services/authApi";

function AdminProducts() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, currentPage, totalCount } = useSelector(
    (state: RootState) => state.products,
  );
  const [mode, setMode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  const tableData = products.map((item) => ({
    key: item.productId,
    productName: item.productName,
    categoryName: item.categoryName,
    price: item.price,
    discount: item.discountPercent,
    status: item.status,
  }));

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleEdit(record.key)}>Edit</Button>

          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAdd = async () => {
    setIsModalOpen(true);
    setMode("add");
  };

  const handleEdit = async (productId: string) => {
    setLoading(true);
    setIsModalOpen(true);
    setMode("edit");
    try {
      const data = await getProductDetails(Number(productId));
      setEditingProduct(data);
      setIsModalOpen(true);
      setEditingProduct(data);
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProducts(1));
  }, [dispatch]);

  const handleDelete = async (productId: string) => {
    setLoading(true);
    try {
      const response = await deleteProduct(Number(productId));

      toast.success(response?.data?.message);

      dispatch(fetchProducts(1));
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("product_name", values.productName);
      formData.append("category_id", values.categoryId);
      formData.append("product_price", values.productPrice);
      formData.append("discount_per", values.discountPercent);
      formData.append("product_description", values.productDescription);
      formData.append("status", values.status);

      if (values.imageUrl) {
        if (values.image) {
          formData.append("image", values.image);
        } else {
          formData.append("image_url", values.imageUrl);
        }
      } else {
        formData.append("image", values.image);
      }

      if (editingProduct) {
        await updateProduct(formData, editingProduct?.productId);
        toast.success("Product updated succesfully");
      } else {
        await addProduct(formData);
        toast.success("Product added succesfully");
      }
      setFileName("");
      dispatch(fetchProducts(1));
      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    productName: Yup.string().required("Required"),
    categoryId: Yup.number()
      .min(1, "Select valid category")
      .required("Required"),
    productPrice: Yup.number().required("Required"),
    discountPercent: Yup.number().min(0, "Minimum 0%").max(100, "Maximum 100%"),
    productDescription: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
  });

  return (
    <div>
      <h2 className="text-3xl font-bold my-3 flex flex-col">Products</h2>
      <div className="flex justify-end items-center">
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: "20px" }}
        >
          Add Product
        </Button>
      </div>

      {isLoading || loading ? (
        <div className="flex justify-center my-4">
          <div className="loader"></div>
        </div>
      ) : (
        <TableComponent
          pagination={{
            current: currentPage,
            total: totalCount,
            pageSize: 10,
          }}
          onChange={(pagination) => {
            if (pagination.current) {
              dispatch(fetchProducts(pagination.current));
            }
          }}
          columns={columns}
          data={tableData}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-3 ">
          <div className="bg-white p-3 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <Formik
              initialValues={
                editingProduct
                  ? {
                      productName: editingProduct?.productName || "",
                      categoryId: 0 || 0,
                      productPrice: editingProduct?.price || 0,
                      discountPercent: editingProduct?.discountPercent || 0,
                      productDescription: editingProduct?.description || "",
                      image: null,
                      imageUrl: editingProduct?.imageUrl || "",
                      status: editingProduct?.status || "",
                    }
                  : {
                      productName: "",
                      categoryId: 0,
                      productPrice: 0,
                      discountPercent: 0,
                      productDescription: "",
                      image: null,
                      status: "",
                    }
              }
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <FormInput label="Product Name" name="productName" />

                  <FormInput
                    label="Category Id"
                    name="categoryId"
                    type="number"
                  />

                  <FormInput
                    label="Product Price"
                    name="productPrice"
                    type="number"
                  />

                  <FormInput
                    label="Discount Percent"
                    name="discountPercent"
                    type="number"
                  />

                  <FormInput
                    label="Product Description"
                    name="productDescription"
                  />

                  <div className="flex flex-col gap-1">
                    <label className="font-medium">Upload Image</label>
                    <label className="rounded-md cursor-pointer text-center w-30 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all">
                      Choose File
                      <input
                        type="file"
                        name="image"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          setFieldValue("image", file);
                          if (file) {
                            setFileName(file.name);
                          }
                        }}
                      />
                    </label>

                    {fileName && (
                      <p className="text-md font-semibold text-red-400">
                        {fileName}{" "}
                      </p>
                    )}
                    <ErrorMessage
                      name="file"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {editingProduct && (
                    <FormInput label="Image Url" name="imageUrl" />
                  )}

                  <FormInput label="Status" name="status" />

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="mt-[5px]"
                    style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}
                  >
                    {mode === "edit" ? " Update Product" : "Add Product"}
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
