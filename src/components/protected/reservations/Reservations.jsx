import React, { useState, useRef, useEffect } from "react";
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./Reservations.scss";
import { Link } from "react-router-dom";
import { Dropdown } from 'primereact/dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Toast } from 'primereact/toast';
import { useFormik } from 'formik';
import { reservationSchema } from "../../validationSchemas/reservation";

const Reservations = () => {
    // Formik 
    const formik = useFormik({
        initialValues: {
            personName: '',
            noOfPerson: null,
            seatAvailablity: null,
            emailId: '',
            mobileNumber: '',
            dateOfBooking: new Date(),
            timeOfBooking: null,
        },
        validationSchema: reservationSchema,
        onSubmit: (values, actions) => {

            console.log(values);
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Booking submitted.',
                life: 3000,
            });
            actions.setSubmitting(false);
            actions.resetForm();
            
        }
    });

    const [noOfPersons, setNoOfPersons] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const toast = useRef(null); //for file-upload
    const peronsQty = [
        { name: 'One', value: 'One' },
        { name: 'Two', value: 'Two' },
        { name: 'Three', value: 'Three' },
        { name: 'Four', value: 'Four' },
        { name: 'Five', value: 'Five' },
        { name: 'Six', value: 'Six' },
        { name: 'Family', value: 'Family' },
    ];

    const [seatsFor, setSeatsFor] = useState(null);
    const seatsIn = [
        { name: 'Section A - Table No-1', value: 'A1' },
        { name: 'Section A - Table No-2', value: 'A2' },
        { name: 'Section A - Table No-3', value: 'A3' },
        { name: 'Section A - Table No-4', value: 'A4' },
        { name: 'Section A - Table No-5', value: 'A5' },
        { name: 'Section A - Table No-6', value: 'A6' },
        { name: 'Section A - Table No-7', value: 'A7' },
        { name: 'Section A - Table No-8', value: 'A8' },
        { name: 'Section B - Table No-1', value: 'B1' },
        { name: 'Section B - Table No-2', value: 'B2' },
        { name: 'Section B - Table No-3', value: 'B3' },
        { name: 'Section B - Table No-4', value: 'B4' },
        { name: 'Section B - Table No-5', value: 'B5' },
        { name: 'Section B - Table No-6', value: 'B6' },
        { name: 'Section B - Table No-7', value: 'B7' },
        { name: 'Section B - Table No-8', value: 'B8' },
        { name: 'Section C - Table No-1', value: 'C1' },
        { name: 'Section C - Table No-2', value: 'C2' },
        { name: 'Section C - Table No-3', value: 'C3' },
        { name: 'Section C - Table No-4', value: 'C4' },
        { name: 'Section C - Table No-5', value: 'C5' },
        { name: 'Section C - Table No-6', value: 'C6' },
        { name: 'Section C - Table No-7', value: 'C7' },
        { name: 'Section C - Table No-8', value: 'C8' },
        { name: 'Section D - Table No-1', value: 'D1' },
        { name: 'Section D - Table No-2', value: 'D2' },
        { name: 'Section D - Table No-3', value: 'D3' },
        { name: 'Section D - Table No-4', value: 'D4' },
        { name: 'Section D - Table No-5', value: 'D5' },
        { name: 'Section D - Table No-6', value: 'D6' },
        { name: 'Section D - Table No-7', value: 'D7' },
        { name: 'Section D - Table No-8', value: 'D8' },
        { name: 'Cabin A', value: 'CAB-A' },
        { name: 'Cabin B', value: 'CAB-B' },
        { name: 'Cabin C', value: 'CAB-C' },
        { name: 'Cabin D', value: 'CAB-D' },
        { name: 'Balcony - Table No-1', value: 'BA1' },
        { name: 'Balcony - Table No-2', value: 'BA2' },
        { name: 'Balcony - Table No-3', value: 'BA3' },
        { name: 'Balcony - Table No-4', value: 'BA4' },
        { name: 'Balcony - Table No-5', value: 'BA5' },
        { name: 'Balcony - Table No-6', value: 'BA6' },
        { name: 'Balcony - Table No-7', value: 'BA7' },
        { name: 'Balcony - Table No-8', value: 'BA8' },
        { name: 'Balcony - Table No-9', value: 'BA9' },
        { name: 'Balcony - Table No-10', value: 'BA10' },
        { name: 'Delux - Table No-1', value: 'DX1' },
        { name: 'Delux - Table No-2', value: 'DX2' },
        { name: 'Delux - Table No-3', value: 'DX3' },
        { name: 'Delux - Table No-4', value: 'DX4' },
        { name: 'Delux - Table No-5', value: 'DX5' },


    ];

    const [startTime, setStartTime] = useState(null);
    const bookingTime = [
        {
            label: 'Morning',
            code: 'MOR',
            items: [
                { name: '06:00 AM', value: '06:00 AM' },
                { name: '06:30 AM', value: '06:30 AM' },
                { name: '07:00 AM', value: '07:00 AM' },
                { name: '07:30 AM', value: '07:30 AM' },
                { name: '08:00 AM', value: '08:00 AM' },
                { name: '08:30 AM', value: '08:30 AM' },
                { name: '09:00 AM', value: '09:00 AM' },
                { name: '09:30 AM', value: '09:30 AM' },
                { name: '10:00 AM', value: '10:00 AM' },
                { name: '10:30 AM', value: '10:30 AM' },
                { name: '11:00 AM', value: '11:00 AM' },
                { name: '11:30 AM', value: '11:30 AM' },
            ]
        },
        {
            label: 'Afternoon',
            code: 'AFT',
            items: [
                { name: '12:00 PM', value: '12:00 PM' },
                { name: '12:30 PM', value: '12:30 PM' },
                { name: '01:00 PM', value: '01:00 PM' },
                { name: '01:30 PM', value: '01:30 PM' },
                { name: '02:00 PM', value: '02:00 PM' },
                { name: '02:30 PM', value: '02:30 PM' },
                { name: '03:00 PM', value: '03:00 PM' },
                { name: '03:30 PM', value: '03:30 PM' },
                { name: '04:00 PM', value: '04:00 PM' },
                { name: '04:30 PM', value: '04:30 PM' },
            ]
        },
        {
            label: 'Evening',
            code: 'EVE',
            items: [
                { name: '05:00 PM', value: '05:00 PM' },
                { name: '05:30 PM', value: '05:30 PM' },
                { name: '06:00 PM', value: '06:00 PM' },
                { name: '06:30 PM', value: '06:30 PM' },
                { name: '07:00 PM', value: '07:00 PM' },
                { name: '07:30 PM', value: '07:30 PM' },
            ]
        },
        {
            label: 'Night',
            code: 'NIG',
            items: [
                { name: '08:00 PM', value: '08:00 PM' },
                { name: '08:30 PM', value: '08:30 PM' },
                { name: '09:00 PM', value: '09:00 PM' },
                { name: '09:30 PM', value: '09:30 PM' },
                { name: '10:00 PM', value: '10:00 PM' },
                { name: '10:30 PM', value: '10:30 PM' },
                { name: '11:00 PM', value: '11:00 PM' },
                { name: '11:30 PM', value: '11:30 PM' },
                { name: '12:00 AM', value: '12:00 AM' },
                { name: '12:30 AM', value: '12:30 AM' }
            ]
        }
    ]

    // Date Hooks
    const manageBookingDate = (date) => {
        const d1 = new Date(date);
        const timestamp = d1.getTime();
        setStartDate(timestamp);
    }

    useEffect(() => { 
        formik.values.dateOfBooking = startDate;
    }, [startDate]);

    return (
        <div>
            <Toast ref={toast}></Toast>
            <Header />
            <div id="scrollsmoother-container">
                {/* Start Hero */}
                <section>
                    <div className="ak-commmon-hero ak-style1 ak-bg">
                        <div className="ak-commmon-heading">
                            <div className="ak-section-heading ak-style-1 ak-type-1 ak-color-1 page-top-title">
                                <div className="ak-section-subtitle">
                                    <Link to="/">Home</Link> / Reservation
                                </div>
                                <h2 className="ak-section-title page-title-anim">Reservation</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Start Booking System */}
                <section>
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="container-fluid">
                        <div className="ak-booking-system-map-from">
                            <div className="booking-system-map">
                                <div className="booking-system-map-frist">
                                    <div className="ak-google-map ak-bg">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96652.27317354927!2d-74.33557928194516!3d40.79756494697628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3a82f1352d0dd%3A0x81d4f72c4435aab5!2sTroy+Meadows+Wetlands!5e0!3m2!1sen!2sbd!4v1563075599994!5m2!1sen!2sbd"
                                            allowfullscreen=""></iframe>
                                    </div>
                                </div>

                                <div className="booking-system-map-second">
                                    <div className="booking-system-heading">
                                        <div className="ak-section-heading ak-style-1">
                                            <div className="ak-section-subtitle">
                                                Book Your Table
                                            </div>
                                            <h2 className="ak-section-title anim-title-3 objects-up-down">Reservations
                                            </h2>
                                        </div>
                                        <div className="ak-height-60 ak-height-lg-30"></div>
                                        <div className="booking-system-form">
                                            <form className="forms" autoComplete="off" onSubmit={formik.handleSubmit}>
                                                <div className="row g-2">
                                                    <div className="col-12">
                                                        <label for="personName" className="form-label">Booking For</label>
                                                        <input type="text" name="personName"
                                                            className="form-control input-text"
                                                            placeholder="Name of the person"
                                                            value={formik.values.personName}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        {formik.errors.personName && formik.touched.personName && <p className="errors-mssg">
                                                            <small>{formik.errors.personName}</small></p>}
                                                    </div>

                                                    <div className="col-6">
                                                        <label for="noOfPerson" className="form-label">No. of Persons</label>
                                                        <Dropdown
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.noOfPerson}
                                                            options={peronsQty}
                                                            optionLabel="name"
                                                            name="noOfPerson"
                                                            placeholder="No. of Person"
                                                            className="form-control"
                                                            showClear />
                                                        {formik.errors.noOfPerson && formik.touched.noOfPerson && <p className="errors-mssg">
                                                            <small>{formik.errors.noOfPerson}</small></p>}
                                                    </div>

                                                    <div className="col-6">
                                                        <label for="seatAvailablity" className="form-label">Seat Availablity</label>
                                                        <Dropdown
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.seatAvailablity}
                                                            options={seatsIn}
                                                            optionLabel="name"
                                                            name="seatAvailablity"
                                                            placeholder="Select Seats"
                                                            className="form-control"
                                                            showClear />
                                                        {formik.errors.seatAvailablity && formik.touched.seatAvailablity && <p className="errors-mssg">
                                                            <small>{formik.errors.seatAvailablity}</small></p>}
                                                    </div>


                                                    <div className="col-12">
                                                        <label for="emailId" className="form-label">Email ID</label>
                                                        <input type="email" name="emailId"
                                                            className="form-control input-text"
                                                            placeholder="Person's EmailId"
                                                            value={formik.values.emailId}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        {formik.errors.emailId && formik.touched.emailId && <p className="errors-mssg">
                                                            <small>{formik.errors.emailId}</small></p>}
                                                    </div>

                                                    <div className="col-12">
                                                        <label for="mobileNumber" className="form-label">Mobile Number</label>
                                                        <input type="text" name="mobileNumber"
                                                            className="form-control input-text"
                                                            placeholder="Person's Mobile Number"
                                                            value={formik.values.mobileNumber}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        {formik.errors.mobileNumber && formik.touched.mobileNumber && <p className="errors-mssg">
                                                            <small>{formik.errors.mobileNumber}</small></p>}
                                                    </div>

                                                    
                                                    <div className="col-6">
                                                        <label for="dateOfBooking" className="form-label">Choose Date</label>
                                                        <DatePicker
                                                            className="input-text"
                                                            selected={startDate}
                                                            onChange={(date) => manageBookingDate(date)} 
                                                            name="dateOfBooking" />
                                                    </div>
                                                    
                                                    <div className="col-6">
                                                        <label for="timeOfBooking" className="form-label">Choose Time</label>
                                                        <Dropdown
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.timeOfBooking}
                                                            options={bookingTime}
                                                            optionLabel="name"
                                                            optionGroupLabel="label"
                                                            optionGroupChildren="items"
                                                            placeholder="Select Time"
                                                            className="form-control"
                                                            name="timeOfBooking"
                                                            showClear />
                                                        {formik.errors.timeOfBooking && formik.touched.timeOfBooking && <p className="errors-mssg">
                                                            <small>{formik.errors.timeOfBooking}</small></p>}
                                                    </div>
                                                    <div className="d-grid">
                                                        <button disabled={formik.isSubmitting} className="btn btn-primary btn-reserv btn-lg" type="submit">Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Booking System */}

                {/* Start Nearby Location */}
                <section>
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="container">
                        <div className="ak-section-heading ak-style-1 ak-type-1">
                            <div className="ak-section-subtitle">
                                Visit Us
                            </div>
                            <h2 className="ak-section-title anim-title">Nearby Find Us</h2>
                        </div>
                    </div>
                    <div className="ak-height-65 ak-height-lg-30"></div>
                    <div className="container">
                        <div className="location-card location-card-style-1">
                            <div className="location-card-item style-1">
                                <div className="card-icon">
                                    <svg viewBox="0 0 40 41" height="41" width="40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11.127C16.1403 11.127 13 14.1177 13 17.7936C13 18.8971 13.2897 19.9913 13.8404 20.9618L19.6172 28.9121C19.6941 29.0448 19.8407 29.127 20 29.127C20.1593 29.127 20.3059 29.0448 20.3828 28.9121L26.1617 20.9585C26.7103 19.9913 27 18.8971 27 17.7936C27 14.1177 23.8597 11.127 20 11.127ZM20 21.127C18.0701 21.127 16.5 19.6316 16.5 17.7936C16.5 15.9557 18.0701 14.4603 20 14.4603C21.9299 14.4603 23.5 15.9557 23.5 17.7936C23.5 19.6316 21.9299 21.127 20 21.127Z"
                                            fill="white" />
                                    </svg>
                                </div>

                                <h6 className="card-title">
                                    New York
                                </h6>
                                <p className="card-subtext">901 N Pitt Str., Suite 170</p>
                                <p> Alexandria, NY, USA</p>
                                <p> info@example.com </p>
                            </div>
                            <div className="location-card-item style-1">
                                <div className="card-icon">
                                    <svg viewBox="0 0 40 41" height="41" width="40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11.127C16.1403 11.127 13 14.1177 13 17.7936C13 18.8971 13.2897 19.9913 13.8404 20.9618L19.6172 28.9121C19.6941 29.0448 19.8407 29.127 20 29.127C20.1593 29.127 20.3059 29.0448 20.3828 28.9121L26.1617 20.9585C26.7103 19.9913 27 18.8971 27 17.7936C27 14.1177 23.8597 11.127 20 11.127ZM20 21.127C18.0701 21.127 16.5 19.6316 16.5 17.7936C16.5 15.9557 18.0701 14.4603 20 14.4603C21.9299 14.4603 23.5 15.9557 23.5 17.7936C23.5 19.6316 21.9299 21.127 20 21.127Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h6 className="card-title">
                                    Los Angeles
                                </h6>
                                <p className="card-subtext">901 N Pitt Str., Suite 170</p>
                                <p> Alexandria, NY, USA</p>
                                <p> info@example.com </p>
                            </div>
                            <div className="location-card-item">
                                <div className="card-icon">
                                    <svg viewBox="0 0 40 41" height="41" width="40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11.127C16.1403 11.127 13 14.1177 13 17.7936C13 18.8971 13.2897 19.9913 13.8404 20.9618L19.6172 28.9121C19.6941 29.0448 19.8407 29.127 20 29.127C20.1593 29.127 20.3059 29.0448 20.3828 28.9121L26.1617 20.9585C26.7103 19.9913 27 18.8971 27 17.7936C27 14.1177 23.8597 11.127 20 11.127ZM20 21.127C18.0701 21.127 16.5 19.6316 16.5 17.7936C16.5 15.9557 18.0701 14.4603 20 14.4603C21.9299 14.4603 23.5 15.9557 23.5 17.7936C23.5 19.6316 21.9299 21.127 20 21.127Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h6 className="card-title">
                                    Chicago
                                </h6>
                                <p className="card-subtext">901 N Pitt Str., Suite 170</p>
                                <p> Alexandria, NY, USA</p>
                                <p> info@example.com </p>
                            </div>
                        </div>
                    </div>
                    <div className="ak-loaction-hr"></div>
                    <div className="container">
                        <div className="location-card location-card-style-1">
                            <div className="location-card-item style-1">
                                <div className="card-icon">
                                    <svg viewBox="0 0 40 41" height="41" width="40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11.127C16.1403 11.127 13 14.1177 13 17.7936C13 18.8971 13.2897 19.9913 13.8404 20.9618L19.6172 28.9121C19.6941 29.0448 19.8407 29.127 20 29.127C20.1593 29.127 20.3059 29.0448 20.3828 28.9121L26.1617 20.9585C26.7103 19.9913 27 18.8971 27 17.7936C27 14.1177 23.8597 11.127 20 11.127ZM20 21.127C18.0701 21.127 16.5 19.6316 16.5 17.7936C16.5 15.9557 18.0701 14.4603 20 14.4603C21.9299 14.4603 23.5 15.9557 23.5 17.7936C23.5 19.6316 21.9299 21.127 20 21.127Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h6 className="card-title">
                                    Houston
                                </h6>
                                <p className="card-subtext">901 N Pitt Str., Suite 170</p>
                                <p> Alexandria, NY, USA</p>
                                <p> info@example.com </p>
                            </div>
                            <div className="location-card-item style-1">
                                <div className="card-icon">
                                    <svg viewBox="0 0 40 41" height="41" width="40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11.127C16.1403 11.127 13 14.1177 13 17.7936C13 18.8971 13.2897 19.9913 13.8404 20.9618L19.6172 28.9121C19.6941 29.0448 19.8407 29.127 20 29.127C20.1593 29.127 20.3059 29.0448 20.3828 28.9121L26.1617 20.9585C26.7103 19.9913 27 18.8971 27 17.7936C27 14.1177 23.8597 11.127 20 11.127ZM20 21.127C18.0701 21.127 16.5 19.6316 16.5 17.7936C16.5 15.9557 18.0701 14.4603 20 14.4603C21.9299 14.4603 23.5 15.9557 23.5 17.7936C23.5 19.6316 21.9299 21.127 20 21.127Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h6 className="card-title">
                                    Phoenix
                                </h6>
                                <p className="card-subtext">901 N Pitt Str., Suite 170</p>
                                <p> Alexandria, NY, USA</p>
                                <p> info@example.com </p>
                            </div>
                            <div className="location-card-item">
                                <div className="card-icon">
                                    <svg viewBox="0 0 40 41" height="41" width="40" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 11.127C16.1403 11.127 13 14.1177 13 17.7936C13 18.8971 13.2897 19.9913 13.8404 20.9618L19.6172 28.9121C19.6941 29.0448 19.8407 29.127 20 29.127C20.1593 29.127 20.3059 29.0448 20.3828 28.9121L26.1617 20.9585C26.7103 19.9913 27 18.8971 27 17.7936C27 14.1177 23.8597 11.127 20 11.127ZM20 21.127C18.0701 21.127 16.5 19.6316 16.5 17.7936C16.5 15.9557 18.0701 14.4603 20 14.4603C21.9299 14.4603 23.5 15.9557 23.5 17.7936C23.5 19.6316 21.9299 21.127 20 21.127Z"
                                            fill="white" />
                                    </svg>
                                </div>
                                <h6 className="card-title">
                                    San Diego
                                </h6>
                                <p className="card-subtext">901 N Pitt Str., Suite 170</p>
                                <p> Alexandria, NY, USA</p>
                                <p> info@example.com </p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Nearby Location */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default Reservations;