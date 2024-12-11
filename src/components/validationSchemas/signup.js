import * as yup from "yup";

export const signUpSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid Email-Id").required("Email is required"),
    password: yup.string()
        .min(8, "password must contain 8 or more characters.")
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
        .required("Password is required.")
})