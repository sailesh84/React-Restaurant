import * as yup from "yup";

export const blogsSchema = yup.object().shape({
    title: yup.string().required("Blog's title is required"),
    categoryName: yup.string().required("Blog's category is required"),
    tags: yup.string().required("Blog's tag is required"),
    postDetails: yup.string().required("Blog's post is required")
})