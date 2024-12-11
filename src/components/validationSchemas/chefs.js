import * as yup from "yup";

export const chefsSchema = yup.object().shape({
    chefName: yup.string().required("Chef name is required"),
    designation: yup.string().required("Chef's designation is required"),
    biography: yup.string().required("Chef's biography is required"),
    salary: yup.number().positive("Salary must be a positive value").required("Salary is required").typeError("Salary must be integer value")
})