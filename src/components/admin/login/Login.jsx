import React, { useState, useRef } from "react";
import "./Login.scss";
import { Link } from "react-router-dom";
import idliChutney from "../../../assets/images/idli-chutney.png";
import masalaDosa from "../../../assets/images/masala-dosa.png";
import "../dashboard/Dashboard.scss";
import idliVadaChutneySambhar from "../../../assets/images/idli-vada-chutney-sambhar.png";
import menduVada from "../../../assets/images/mendu-vada.png";
import idliOnionPakoda from "../../../assets/images/idli-onion-pakoda.png";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useFormik } from 'formik';
import { loginSchema } from "../../validationSchemas/login";
import { signUpSchema } from "../../validationSchemas/signup";
import { Toast } from 'primereact/toast';

const Login = () => {
    // Formik :: Login 
    const formikLogin = useFormik({
        initialValues: {
            loginEmail: '',
            loginPassword: '',
            loggedinBy: 'admin',
            loggedinAt: Date.now()
        },
        validationSchema: loginSchema,
        onSubmit: (values, actions) => {
            console.log(values);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Form submitted.',
                life: 3000,
            });
            actions.resetForm();
        }
    });

    // Formik :: SignUp 
    const formikSignUp = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            createdAt: Date.now(),
        },
        validationSchema: signUpSchema,
        onSubmit: (values, actions) => {
            console.log(values);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Form submitted.',
                life: 3000,
            });
            actions.resetForm();
        }
    });

    const toast = useRef(null); //for file-upload
    const [isGhost, setIsGhost] = useState(true);
    const ghostify = () => {
        setIsGhost(!isGhost);
        console.log(isGhost);
    }

    return (

        <div className="bg">
            <Toast ref={toast}></Toast>

            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row rounded-1 p-3 bg-dark shadow box-area">
                    <div className="col-md-6 rounded-1 d-flex justify-content-center align-items-center flex-column left-box"
                        style={{ background: "transparent" }}>
                        <div className="featured-image mb-3">
                            {/* <img src={idliChutney} alt="" className="img-fluid" /> */}
                            <img src={isGhost ? idliChutney : masalaDosa} alt="" className="img-fluid" />
                        </div>
                        <h4>Idli khane wale always khush!</h4>
                        <small className="text-white text-wrap text-center">Fresh and Tasty on the go...</small>
                    </div>

                    {/* SignUp Form */}
                    <div className="col-md-6 right-box signup-form" style={{ display: isGhost ? 'none' : 'block' }}>
                        <div className="row align-items-center">
                            <form className="forms" autoComplete="off" onSubmit={formikSignUp.handleSubmit}>
                                <div className="header-text mb-4">
                                    <h2>Registration</h2>
                                    <p>Enter user details to register</p>
                                </div>
                                <div className="col-md-12">
                                    <div
                                        className={formikSignUp.errors.firstName && formikSignUp.touched.firstName ? "input-error input-group" : "input-group mb-3"}>
                                        <i className="bx bx-user icon"></i>
                                        <input type="text" name="firstName" className="form-control"
                                            placeholder="Enter your first name"
                                            value={formikSignUp.values.firstName}
                                            onChange={formikSignUp.handleChange}
                                            onBlur={formikSignUp.handleBlur}
                                        />
                                    </div>
                                    {formikSignUp.errors.firstName && formikSignUp.touched.firstName && <p className="errors-mssg mb-3">
                                        <small>{formikSignUp.errors.firstName}</small></p>}
                                </div>

                                <div className="col-md-12">
                                    <div className={formikSignUp.errors.lastName && formikSignUp.touched.lastName ? "input-error input-group" : "input-group mb-3"}>
                                        <i className="bx bx-user icon"></i>
                                        <input type="text" name="lastName" className="form-control"
                                            placeholder="Enter your last name"
                                            value={formikSignUp.values.lastName}
                                            onChange={formikSignUp.handleChange}
                                            onBlur={formikSignUp.handleBlur}
                                        />
                                    </div>
                                    {formikSignUp.errors.lastName && formikSignUp.touched.lastName && <p className="errors-mssg mb-3">
                                        <small>{formikSignUp.errors.lastName}</small></p>}
                                </div>

                                <div className="col-md-12">
                                    <div className={formikSignUp.errors.email && formikSignUp.touched.email ? "input-error input-group" : "input-group mb-3"}>
                                        <i class='bx bxs-envelope icon' ></i>
                                        <input type="email" name="email" className="form-control"
                                            placeholder="Enter your email address"
                                            value={formikSignUp.values.email}
                                            onChange={formikSignUp.handleChange}
                                            onBlur={formikSignUp.handleBlur}
                                        />
                                    </div>
                                    {formikSignUp.errors.email && formikSignUp.touched.email && <p className="errors-mssg mb-3">
                                        <small>{formikSignUp.errors.email}</small></p>}
                                </div>

                                <div className="col-md-12">
                                    <div className={formikSignUp.errors.password && formikSignUp.touched.password ? "input-error input-group" : "input-group mb-2"}>
                                        <i class='bx bx-health icon'></i>
                                        <input type="password" name="password" className="form-control"
                                            placeholder="Enter your password"
                                            value={formikSignUp.values.password}
                                            onChange={formikSignUp.handleChange}
                                            onBlur={formikSignUp.handleBlur}
                                        />
                                    </div>
                                    {formikSignUp.errors.password && formikSignUp.touched.password && <p className="errors-mssg mb-2">
                                        <small>{formikSignUp.errors.password}</small></p>}
                                </div>

                                <div className="col-md-12">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="same-address" />
                                        <label className="form-check-label" for="same-address">
                                            <small>I agree to the terms and conditions</small>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <button disabled={formikSignUp.isSubmitting} className="btn btn-lg btn-primary btn-custom w-100 fs-6 mb-1" type="submit">Sign Up</button>
                                </div>
                                <div className="col-md-12 d-flex align-items-center" style={{ justifyContent: "space-between" }}>
                                    <small>Already have an account? </small>
                                    <Link to="#" className="form-link" onClick={ghostify}>Sign In</Link>
                                </div>
                            </form>
                        </div>
                    </div>


                    {/* Login Form */}
                    <div className="col-md-6 right-box login-form" style={{ display: isGhost ? 'block' : 'none' }}>
                        <div className="row align-items-center">
                            <form className="forms" autoComplete="off" onSubmit={formikLogin.handleSubmit}>
                                <div className="header-text mb-4">
                                    <h2 className="title-white">Hello Again !</h2>
                                    <p>We're happy to back you again.</p>
                                </div>
                                <div className="col-md-12">
                                    <div className={formikLogin.errors.loginEmail && formikLogin.touched.loginEmail ? "input-error input-group" : "input-group mb-3"}>
                                        <i class='bx bxs-envelope icon' ></i>
                                        <input type="email" name="loginEmail" className="form-control"
                                            placeholder="Enter your email address"
                                            value={formikLogin.values.loginEmail}
                                            onChange={formikLogin.handleChange}
                                            onBlur={formikLogin.handleBlur}
                                        />
                                    </div>
                                    {formikLogin.errors.loginEmail && formikLogin.touched.loginEmail && <p className="errors-mssg mb-3">
                                        <small>{formikLogin.errors.loginEmail}</small></p>}
                                </div>

                                <div className="col-md-12">
                                    <div className="input-group mb-2"
                                        className={formikLogin.errors.loginPassword && formikLogin.touched.loginPassword ? "input-error input-group" : "input-group mb-2"}>
                                        <i class='bx bx-health icon'></i>
                                        <input type="password" name="loginPassword" className="form-control"
                                            placeholder="Enter your password"
                                            value={formikLogin.values.loginPassword}
                                            onChange={formikLogin.handleChange}
                                            onBlur={formikLogin.handleBlur}
                                        />
                                    </div>
                                    {formikLogin.errors.loginPassword && formikLogin.touched.loginPassword && <p className="errors-mssg mb-3">
                                        <small>{formikLogin.errors.loginPassword}</small></p>}
                                </div>

                                <div className="col-md-12">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="same-address" />
                                        <label className="form-check-label" for="same-address">
                                            <small>Remember me</small>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <button className="btn btn-lg btn-primary btn-custom w-100 fs-6 mb-3" disabled={formikLogin.isSubmitting} type="submit">Login</button>
                                    <button className="btn btn-lg btn-primary btn-custom w-100 fs-6 mb-1 
                                    d-flex justify-content-center align-items-center">
                                        <i class='bx bxl-google icon mx-2'></i> Sign in with Google
                                    </button>
                                </div>
                                <div className="col-md-12 d-flex align-items-center" style={{ justifyContent: "space-between" }}>
                                    <small>Don't have an account? </small>
                                    <Link to="#" className="form-link" onClick={ghostify}>Sign Up</Link>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;