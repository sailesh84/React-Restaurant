import * as yup from "yup";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const reservationSchema = yup.object().shape({
    personName: yup.string().required("Booking name is required"),
    mobileNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Phone Number is required"),
    emailId: yup.string().email("Invalid Email-Id").required("Email is required"),
    noOfPerson: yup.string().required("No of person is required"),
    seatAvailablity: yup.string().required("Seat availablity is required"),
    timeOfBooking: yup.string().required("Booking time is required")
})