import * as yup from "yup";

export const loginSchema = yup.object().shape({
    loginEmail: yup.string().email("Invalid Email-Id").required("Email is required"),
    loginPassword: yup.string()
    .min(8, "password must contain 8 or more characters.")
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
    .required("Password is required.")
})