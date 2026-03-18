import { Button, Popconfirm, Space } from "antd";
import TableComponent from "../../components/table/Table";
import { useEffect, useState } from "react";
import { fetchCategory } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Category } from "../../types/authTypes";
import { toast } from "react-toastify";
import {
  deleteCategory,
  addCategory,
  updateCategory,
} from "../../services/authApi";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/formInput/FormInput";

function AdminCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, categoryLoading } = useSelector(
    (state: RootState) => state.categories,
  );
  console.log(categories);
  const [mode, setMode] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  console.log(editingCategory);

  const tableData = categories.map((item) => ({
    key: item.categoriesId,
    categoryId: item.categoriesId,
    categoryName: item.name,
    status: item.status,
    updatedAt: item.updatedAt,
    createdBy: item.createdBy,
  }));

  const handleEdit = (categoryId: any) => {
    const selected = categories.find(
      (each) => each.categoriesId === categoryId,
    );

    if (selected) {
      setEditingCategory(selected);
    }
    setIsModalOpen(true);
    setMode("edit");
  };

  const handleDelete = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await deleteCategory(Number(categoryId));

      toast.success(response?.data?.message);

      dispatch(fetchCategory());
    } catch (error: any) {
      console.log(error);
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsModalOpen(true);
    setMode("add");
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (editingCategory) {
        formData.append("name", values.categoryName);

        if (values.status) {
          formData.append("status", values.status);
        }

        if (values.parentId) {
          formData.append("parent_id", values.parentId);
        }
      } else {
        formData.append("category_name", values.categoryName);
        if (values.status) {
          formData.append("status", values.status);
        }
      }

      if (values.image) {
        formData.append("image", values.image);
      } else if (values.imageUrl) {
        formData.append("image_url", values.imageUrl);
      }

      if (editingCategory) {
        await updateCategory(formData, editingCategory?.categoriesId);
        toast.success("Category updated successfully");
      } else {
        await addCategory(formData);

        toast.success("Category added succesfully");
      }
      setFileName("");
      dispatch(fetchCategory());
      setEditingCategory(null);
      setIsModalOpen(false);
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Something went wrong";
      toast.error(message);
      console.log(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCategory());
  }, [dispatch]);

  const columns = [
    {
      title: "Category Id",
      dataIndex: "categoryId",
      key: "categoryId",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
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

  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Required"),
    status: editingCategory ? Yup.string().required("Required") : Yup.string(),
  });

  return (
    <div>
      <h2 className="text-3xl font-bold my-3 flex flex-col">Categories</h2>
      <div className="flex justify-end items-center">
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: "20px" }}
        >
          Add Category
        </Button>
      </div>

      {categoryLoading || loading ? (
        <div className="flex justify-center my-4">
          <div className="loader"></div>
        </div>
      ) : (
        <TableComponent columns={columns} data={tableData} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-3 ">
          <div className="bg-white p-6 rounded-xl w-96 shadow-[0_0_50px_rgba(168,85,247,0.5)]">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>

            <Formik
              initialValues={
                editingCategory
                  ? {
                      categoryName: editingCategory?.name || "",
                      parentId: editingCategory?.parentId || 0,
                      status: editingCategory?.status || "",
                      image: null,
                      imageUrl: editingCategory?.imageUrl || "",
                    }
                  : {
                      categoryName: "",
                      status: "",
                      image: null,
                    }
              }
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ setFieldValue }) => (
                <Form className="space-y-4">
                  <FormInput label="Category Name" name="categoryName" />

                  <FormInput label="Parent Id" name="parentId" type="number" />

                  {editingCategory && (
                    <FormInput label="Status" name="status" />
                  )}

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

                  {editingCategory && (
                    <FormInput label="Image Url" name="imageUrl" />
                  )}

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="mt-[30px]"
                    style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}
                  >
                    {mode === "edit" ? " Update Category" : "Add Category"}
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

export default AdminCategory;
