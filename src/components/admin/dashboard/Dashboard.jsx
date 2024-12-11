import React, { useRef, useState } from "react";
import "./Dashboard.scss";
import gsap from 'gsap-trial';
import { Link } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { MultiSelect } from 'primereact/multiselect';
import { Tooltip } from 'primereact/tooltip';
import { useFormik } from 'formik';
import { rolesSchema } from "../../validationSchemas/roles";
import { Toast } from 'primereact/toast';


const Dashboard = () => {
    // const [selectedCities, setSelectedCities] = useState(null);

    // Formik 
    const formik = useFormik({
        initialValues: {
            user: null,
            roles: [],
            createdBy: 'admin',
            createdAt: Date.now(),
            updatedBy: 'admin',
            updatedAt: Date.now()
        },
        validationSchema: rolesSchema,
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

    //Sidebar Hooks
    const [isActive, setActive] = useState(false);
    const toggleClass = () => {
        setActive(!isActive);
        gsap.to(".toogle", {
            duration: 1,
            rotate: isActive ? 180 : 360
        });
    };

    //Form Hooks
    const [selected, setSelected] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [ingredient, setIngredient] = useState('Credit Card');
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];


    // const [selectedUsers, setSelectedUsers] = useState(null);
    const users = [
        { name: 'Sailesh Paul', value: 'Admin' },
        { name: 'Manjeet Singh', value: 'Head Chef' },
        { name: 'Raju Anna', value: 'Head Chef' },
        { name: 'Subramannium Anna', value: 'Station Chef' },
        { name: 'Vaishali Pawar', value: 'Dishwasher' },
    ];

    // const [selectedRoles, setSelectedRoles] = useState(null);
    const roles = [
        { name: 'Dashboard', value: 'dashboard' },
        { name: 'Food Menu', value: 'food-menu' },
        { name: 'Chef', value: 'chefs' },
        { name: 'Blogs', value: 'blogs' },
        { name: 'Reservations', value: 'reservations' }
    ];

    const animate = (event) => {
        // console.log(event);
    }

    return (
        <div>
            <Toast ref={toast}></Toast>

            {/* Top navigation  */}
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <Link to="/admin/dashboard" className="navbar-brand"><h5>DASHBOARD</h5></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse float-end" id="navbarCollapse">
                        <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link to="#" className="nav-link small">
                                    <i class='bx bx-bell'></i>
                                    <span className="text nav-text">Notifications</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link small">
                                    <i class='bx bx-cog'></i>
                                    <span className="text nav-text">Settings</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link small">
                                    <i class='bx bx-help-circle'></i>
                                    <span className="text nav-text">Support</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Side navigation */}
            <nav className={isActive ? 'sidebar' : 'sidebar close'} >
                <header>
                    <div style={isActive ? {} : { height: '60px' }} >
                        {/* <span className="image">
                            <p>SA</p>
                        </span> */}
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="xlarge" shape="circle" />

                        {/* <div className="text header-text">
                            <h6>Welcome</h6>
                            <span className="profession">Sailesh Kr. Paul</span>
                        </div> */}
                    </div>

                    <Link to="#" onClick={toggleClass}>
                        <i className="bx bx-chevron-left toogle"></i>
                    </Link>
                </header>

                <div className="menu-bar">
                    <div className="menu">
                        <li className="search-box">
                            <i className="bx bx-search icon"></i>
                            <input type="search" placeholder="Search..." />
                        </li>
                        <ul className="menu-links">
                            <li className="nav-link">
                                <Tooltip target=".bx-home-alt-link" content="Dashboard" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/dashboard" className="bx-home-alt-link"
                                    onMouseEnter={animate} >
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bx-dish-link" content="Food Menu" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/food-menu" className="bx-dish-link"
                                    onMouseEnter={animate}>
                                    <i className="bx bx-dish icon"></i>
                                    <span className="text nav-text">Food Menu</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bx-user-link" content="Chefs" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/chefs" className="bx-user-link"
                                    onMouseEnter={animate}>
                                    <i className="bx bx-user icon"></i>
                                    <span className="text nav-text">Chefs</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bxl-blogger-link" content="Blogs" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/blogs" className="bxl-blogger-link"
                                    onMouseEnter={animate}>
                                    <i className='bx bxl-blogger icon'></i>
                                    <span className="text nav-text">Blogs</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bxs-book-content-link" content="Reservations" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/reservations" className="bxs-book-content-link"
                                    onMouseEnter={animate}>
                                    <i className='bx bxs-book-content icon'></i>
                                    <span className="text nav-text">Reservations</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="bottom-content">
                        <li className="">
                            <Link to="#">
                                <i className="bx bx-power-off icon"></i>
                                <span className="text nav-text">Logout</span>
                            </Link>
                        </li>

                        {/* <li className="mode">
                            <div className="moon-sun">
                                <i className="bx bx-moon icon moon"></i>
                                <i className="bx bx-sun icon sun"></i>
                            </div>
                            <span className="mode-text text">Dark Mode</span>

                            <div className="toggle-switch">
                                <span className="switch"> </span>
                            </div>
                        </li> */}
                    </div>
                </div>
            </nav>

            {/* Container */}
            <section className="home">
                <div className="container-fluid px-0">
                    <h2>Welcome, <span style={{ color: "#afafaf" }}>Sailesh Kumar Paul</span></h2>
                    <h6 className="mb-4">Last Logged In: <span style={{ color: "#f0f0f0" }}>10-09-2024 13:04:00</span></h6>
                    <hr />

                    <section className="my-4">
                        <h4 className="mb-3">Role Management</h4>
                        <form className="forms" autoComplete="off" onSubmit={formik.handleSubmit}>
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <Dropdown name="user"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.user}
                                        options={users}
                                        optionLabel="name"
                                        placeholder="Select User"
                                        className="form-control"
                                        showClear />
                                    {formik.errors.user && formik.touched.user && <p className="errors-mssg">
                                        <small>{formik.errors.user}</small></p>}
                                </div>
                                <div className="col-12 col-md-4">
                                    <MultiSelect name="roles"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.roles}
                                        options={roles}
                                        optionLabel="name"
                                        placeholder="Assign Roles"
                                        maxSelectedLabels={3}
                                        className="form-control"
                                        showClear />
                                    {formik.errors.roles && formik.touched.roles && <p className="errors-mssg">
                                        <small>{formik.errors.roles}</small></p>}
                                </div>
                                <div className="col-12 col-md-4">
                                    <button disabled={formik.isSubmitting} className="btn btn-outline-dark btn-lg" type="submit" style={{ padding: "0.44rem 2rem" }}>Submit</button>
                                </div>

                            </div>
                        </form>
                    </section>
                    <hr />

                    <form action="#" className="forms mt-4">
                        <div className="row g-5">
                            <div className="col-12 col-md-5 order-md-last">
                                <h4 className="d-flex justify-content-between align-items-center mb-3">
                                    <span>Your Cart</span>
                                    <span className="badge bg-primary rounded-pill">3</span>
                                </h4>
                                <ul className="list-group mb-3" data-bs-theme="dark">
                                    <li className="list-group-item d-flex justify-content-between lh-sm">
                                        <div>
                                            <h6 className="my-0">Product name</h6>
                                            <small className="text-muted">Brief description</small>
                                        </div>
                                        <span className="text-muted">$12</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between lh-sm">
                                        <div>
                                            <h6 className="my-0">Second product</h6>
                                            <small className="text-muted">Brief description</small>
                                        </div>
                                        <span className="text-muted">$8</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between lh-sm">
                                        <div>
                                            <h6 className="my-0">Third item</h6>
                                            <small className="text-muted">Brief description</small>
                                        </div>
                                        <span className="text-muted">$5</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between bg-light">
                                        <div className="text-success">
                                            <h6 className="my-0">Promo code</h6>
                                            <small>Example Code</small>
                                        </div>
                                        <span className="text-success">−$5</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between">
                                        <span>Total (USD)</span>
                                        <strong>$20</strong>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-7">
                                <h4 className="mb-3">Billing Address</h4>
                                <form className="needs-validation">
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <label for="firstName" className="form-label">First name</label>
                                            <div className="input-group">
                                                <i className="bx bx-user icon"></i>
                                                <input type="text" className="form-control" placeholder="John" />
                                            </div>
                                        </div>

                                        <div className="col-sm-6">
                                            <label for="lastName" className="form-label">Last name</label>
                                            <div className="input-group">
                                                <i className="bx bx-user icon"></i>
                                                <input type="text" className="form-control" placeholder="Doe" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label for="username" className="form-label">Username</label>
                                            <div className="input-group">
                                                <i className="bx bx-user-pin icon"></i>
                                                <input type="text" className="form-control" placeholder="JohnDoe85" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label for="email" className="form-label">Email <span className="text-muted">(Optional)</span></label>
                                            <div className="input-group">
                                                <i className="bx bx-envelope icon"></i>
                                                <input type="email" className="form-control" placeholder="johndoe891@jsmastery.com" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label for="address" className="form-label">Address</label>
                                            <div className="input-group">
                                                <i className="bx bx-map icon"></i>
                                                <input type="email" className="form-control" placeholder="1234 Main St" />
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label for="address2" className="form-label">Address 2 <span className="text-muted">(Optional)</span></label>
                                            <div className="input-group">
                                                <i className="bx bx-map icon"></i>
                                                <input type="email" className="form-control" placeholder="Apartment or suite" />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label for="country" className="form-label">Country</label>
                                            <ReactFlagsSelect searchable={true} defaultCountry="IN" selected={selected}
                                                searchPlaceholder="Search for a country" className="menu-flags"
                                                onSelect={(code) => setSelected(code)} selectButtonClassName="menu-flags-button"
                                                showSelectedLabel={true} showOptionLabel={true} placeholder="Select Country" />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label for="state" className="form-label">State</label>
                                            <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                                                placeholder="Select City" className="form-control" showClear />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label for="zip" className="form-label">Zip</label>
                                            <div className="input-group">
                                                <i className="bx bx-map-pin icon"></i>
                                                <input type="text" className="form-control" placeholder="XXXXX" />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="same-address" />
                                        <label className="form-check-label" for="same-address">Shipping address is the same as my billing address</label>
                                    </div>

                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" id="save-info" />
                                        <label className="form-check-label" for="save-info">Save this information for next time</label>
                                    </div>

                                    <hr className="my-4" />

                                    <h4 className="mb-3">Payment</h4>
                                    <div className="my-3">
                                        <div className="row rb-wrapper">
                                            <div className="col-12">
                                                <div className="rb-group">
                                                    <div className="rb-control">
                                                        <RadioButton inputId="ingredient1" name="pizza" value="Credit Card" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Credit Card'} />
                                                        <label>Credit Card</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="rb-group">
                                                    <div className="rb-control">
                                                        <RadioButton inputId="ingredient2" name="pizza" value="Debit Card" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Debit Card'} />
                                                        <label>Debit Card</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="rb-group">
                                                    <div className="rb-control">
                                                        <RadioButton inputId="ingredient3" name="pizza" value="PayPal" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'PayPal'} />
                                                        <label>PayPal</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row gy-3">
                                        <div className="col-md-6">
                                            <label for="cc-name" className="form-label">Name on card</label>
                                            <div className="input-group">
                                                <i className='bx bxl-visa icon' ></i>
                                                <input type="text" className="form-control" placeholder="VISA Platinum | Gold" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label for="cc-number" className="form-label">Credit card number</label>
                                            <div className="input-group">
                                                <i className='bx bx-credit-card icon' ></i>
                                                <input type="text" className="form-control" placeholder="XXXX-XXXX-XXXX-XXXX" />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label for="cc-expiration" className="form-label">Expiration</label>
                                            <div className="input-group">
                                                <i className='bx bx-calendar icon'></i>
                                                <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label for="cc-cvv" className="form-label">CVV</label>
                                            <div className="input-group">
                                                <i className='bx bx-credit-card-alt icon'></i>
                                                <input type="text" className="form-control" placeholder="XXX" />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    <button className="w-100 btn-dark btn-5 btn-lg" type="button">Continue to Checkout</button>
                                </form>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <footer className="py-3 my-4">
                        <hr className="my-4" />
                        <p className="text-center text-muted">Copyright © 2024. All Rights Reserved</p>
                    </footer>
                </div>
            </section>
        </div>
    )
}

export default Dashboard;