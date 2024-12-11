import * as yup from "yup";

export const rolesSchema = yup.object().shape({
    user: yup.string().required("User is required"),
    roles: yup.array().min(1, 'Select at least one role for user')
})