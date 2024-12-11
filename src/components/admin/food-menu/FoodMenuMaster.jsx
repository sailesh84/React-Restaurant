import React, { useState, useRef } from "react";
import gsap from 'gsap-trial';
import { Link } from "react-router-dom";
import "./FoodMenuMaster.scss";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { foodMenusSchema } from "../../validationSchemas/foodmenus";

const FoodMenuMaster = () => {
    // Formik 
    const formik = useFormik({
        initialValues: {
            categoryName: null,
            offers: null,
            itemName: '',
            price: 0,
            receipe: '',
            uploadFoodImage: [],
            createdBy: 'admin',
            createdAt: Date.now(),
            updatedBy: 'admin',
            updatedAt: Date.now()
        },
        validationSchema: foodMenusSchema,
        onSubmit: (values, actions) => {

            console.log(values);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Form submitted.',
                life: 3000,
            });
            fileUploadRef.current.clear();
            actions.resetForm();
        }
    });

    //Sidebar Hooks
    const [isActive, setActive] = useState(false);
    // const [selectedFoodCategory, setSelectedFoodCategory] = useState(null);
    // const [selectedOffers, setSelectedOffers] = useState(null);

    const toast = useRef(null); //for file-upload
    const [totalSize, setTotalSize] = useState(0);  //for file-upload
    const fileUploadRef = useRef(null); //for file-upload

    const animate = (event) => {
        // console.log(event);
    }

    const toggleClass = () => {
        setActive(!isActive);
        gsap.to(".toogle", {
            duration: 1,
            rotate: isActive ? 180 : 360
        });
    };

    //Food's category array
    const categories = [
        { name: 'Chole Bhature', value: 'Chole Bhature' },
        { name: 'Idli', value: 'Idli' },
        { name: 'Dosa', value: 'Dosa' },
        { name: 'Uttapam', value: 'Uttapam' },
        { name: 'Vada', value: 'Vada' },
        { name: 'Rice', value: 'Rice' },
        { name: 'Special', value: 'Special' },
        { name: 'Chutney', value: 'Chutney' },
        { name: 'Dessert', value: 'Dessert' },
        { name: 'Ice Cream', value: 'Ice Cream' },
        { name: 'Beverages', value: 'Beverages' }
    ];

    //Food's offer array
    const offers = [
        { name: 'Super Saver Combo', value: 'Super Saver Combo' },
        { name: 'Aaj ka Special', value: 'Aaj ka Special' },
        { name: 'Thoda Extra', value: 'Thoda Extra' },
        { name: 'Kuch Thanda', value: 'Kuch Thanda' },
        { name: 'Kuch Meetha', value: 'Kuch Meetha' },
        { name: 'Best Seller', value: 'Best Seller' },
        { name: 'Must Try', value: 'Must Try' },
        { name: 'Recommended', value: 'Recommended' },
        { name: 'Chef special', value: 'Chef special' },
        { name: 'New Launch', value: 'New Launch' },
        { name: 'NA', value: 'NA' },
    ];

    // FileUpload :: Template Select 
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    // FileUpload :: Converting Images into Base64
    const fileBase64 = (img) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onerror = reject
            fileReader.onload = function () {
                resolve(fileReader.result);
            }
            fileReader.readAsDataURL(img);
        });
    }

    // FileUpload :: Event for uploading images and pushing into Formik object
    const invoiceUploadHandler = ({ files }) => {
        Promise.all(Array.from(files).map(fileBase64))
            .then((urls) => {
                urls.forEach((item, index) => {
                    formik.values.uploadFoodImage.push(item);
                });
                setTotalSize(0);
                toast.current.show({
                    severity: 'info',
                    summary: 'Success',
                    detail: 'File Uploaded',
                });

            })
            .catch((error) => {
                console.error(error);
            });
    };

    // FileUpload :: Template remove
    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    // FileUpload :: Template clear
    const onTemplateClear = () => {
        setTotalSize(0);
    };

    //FileUpload :: This is the header section (including, choose, upload and cancel button with progressbar)   
    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : '0 B';

        return (
            <div
                className={className}
                style={{
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar
                        value={value}
                        showValue={false}
                        style={{ width: '10rem', height: '12px' }}
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    //FileUpload :: This is the section after the image is selected (including, image with its name and date, image-size, cancel-btn)
    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center me-2">
                    <img
                        alt={file.name}
                        role="presentation"
                        src={file.objectURL}
                        width={100}
                    />
                    <span className="flex flex-column text-left ms-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag
                    value={props.formatSize}
                    severity="warning"
                    className="px-3 py-2"
                />
                <Button
                    type="button"
                    icon="bx bx-x"
                    className="p-button-outlined p-button-rounded p-button-danger ml-auto"
                    onClick={() => onTemplateRemove(file, props.onRemove)}
                />
            </div>
        );
    };

    //FileUpload :: body's section
    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i
                    className="bx bx-image mt-3 p-5"
                    style={{
                        fontSize: '5em',
                        borderRadius: '50%',
                        backgroundColor: 'var(--surface-b)',
                        color: 'var(--surface-d)',
                    }}
                ></i>
                <span
                    style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
                    className="my-5"
                >
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };

    // FileUpload :: icons
    const chooseOptions = { icon: 'bx bx-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'bx bx-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'bx bx-x', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div>
            <Toast ref={toast}></Toast>

            {/* Top navigation  */}
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <Link to="/admin/dashboard" className="navbar-brand">
                        <h5>MENU MASTER</h5>
                    </Link>
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
                                    <i class='bx bx-cog '></i>
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

                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="mb-3">Food Menu</h4>
                            <form className="forms" autoComplete="off" onSubmit={formik.handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label for="categoryName" className="form-label">Category name</label>
                                        <Dropdown name="categoryName"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.categoryName}
                                            options={categories}
                                            optionLabel="name"
                                            placeholder="Select a Category"
                                            className={formik.errors.categoryName && formik.touched.categoryName ? "input-error form-control" : "form-control"}
                                            showClear />
                                        {formik.errors.categoryName && formik.touched.categoryName && <p className="errors-mssg">
                                            <small>{formik.errors.categoryName}</small></p>}
                                    </div>

                                    <div className="col-md-6">
                                        <label for="offers" className="form-label">Offers</label>
                                        <Dropdown name="offers"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.offers}
                                            options={offers}
                                            optionLabel="name"
                                            placeholder="Select a Offer"
                                            className={formik.errors.offers && formik.touched.offers ? "input-error form-control" : "form-control"}
                                            showClear />
                                        {formik.errors.offers && formik.touched.offers && <p className="errors-mssg">
                                            <small>{formik.errors.offers}</small></p>}
                                    </div>

                                    <div className="col-md-6">
                                        <label for="itemName" className="form-label">Item name</label>
                                        <div className={formik.errors.itemName && formik.touched.itemName ? "input-error input-group" : "input-group"}>
                                            <i class='bx bx-bowl-hot icon'></i>
                                            <input type="text" name="itemName" className="form-control"
                                                placeholder="Enter the food name"
                                                value={formik.values.itemName}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        {formik.errors.itemName && formik.touched.itemName && <p className="errors-mssg">
                                            <small>{formik.errors.itemName}</small></p>}
                                    </div>

                                    <div className="col-md-6">
                                        <label for="price" className="form-label">Price</label>
                                        <div className={formik.errors.price && formik.touched.price ? "input-error input-group" : "input-group"}>
                                            <i class='bx bx-rupee icon'></i>
                                            <input type="text" name="price" className="form-control"
                                                placeholder="Enter the food price"
                                                value={formik.values.price}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </div>
                                        {formik.errors.price && formik.touched.price && <p className="errors-mssg">
                                            <small>{formik.errors.price}</small></p>}
                                    </div>

                                    <div className="col-md-12">
                                        <label for="receipe" className="form-label">Share Item Receipe</label>
                                        <InputTextarea name="receipe"
                                            className={formik.errors.receipe && formik.touched.receipe ? "input-error form-control" : "form-control"}
                                            placeholder="Share recepie's ingredient, its speciality, cooking time, best use for, etc.."
                                            rows={5} cols={30}
                                            value={formik.values.receipe}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur} />
                                        {formik.errors.receipe && formik.touched.receipe && <p className="errors-mssg">
                                            <small>{formik.errors.receipe}</small></p>}
                                    </div>

                                    <div className="col-md-12">
                                        <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
                                        <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
                                        <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

                                        <FileUpload ref={fileUploadRef} name="uploadChefImage" customUpload={true}
                                            multiple accept="image/*" maxFileSize={1000000}
                                            onSelect={onTemplateSelect}
                                            onError={onTemplateClear}
                                            onClear={onTemplateClear}
                                            headerTemplate={headerTemplate} itemTemplate={itemTemplate}
                                            emptyTemplate={emptyTemplate} chooseOptions={chooseOptions}
                                            uploadOptions={uploadOptions} cancelOptions={cancelOptions}
                                            uploadHandler={invoiceUploadHandler} />
                                    </div>
                                    <hr className="my-4" />

                                    <div className="d-flex align-items-end justify-content-end">
                                        <button disabled={formik.isSubmitting} className="btn btn-outline-dark btn-lg" type="submit">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

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

export default FoodMenuMaster;