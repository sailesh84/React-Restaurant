import * as yup from "yup";

export const foodMenusSchema = yup.object().shape({
    categoryName: yup.string().required("Food category is required"),
    offers: yup.string().required("Food offers is required"),
    itemName: yup.string().required("Item name is required"),
    price: yup.number().positive("Price must be a positive value").required("Price is required").typeError("Price must be integer value"),
    receipe: yup.string().required("Food's receipe is required")
})