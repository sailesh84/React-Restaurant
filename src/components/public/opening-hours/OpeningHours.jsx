import React from 'react';
import "./OpeningHours.scss";
import { Link } from "react-router-dom";
import about_open_hour from '../../../assets/images/about_open_hour.jpg' // relative path to image 

const OpeningHours = () => {
    return (
        <div>
            <section className="container">
                <div className="ak-height-150 ak-height-lg-60"></div>
                <div className="opening-hour type-2">
                    <div className="opening-hour-img-section style-2">
                        <img src={about_open_hour} className="imagesZoom opening-bg-img ak-bg" alt="..." />
                        <div className="overlap-opening-img" style={{ height: "0%" }}></div>
                    </div>
                    <div className="opening-hour-text-section type-2">
                        <h2 className="opening-hour-title  anim-title-2">Opening Hours</h2>
                        <div className="ak-height-30 ak-height-lg-30"></div>
                        <p className="opening-hour-subtext">Lorem to our restaurant, where culinary artistry meets exceptional
                            dining experiences. At, we strive to create a gastronomic haven that.</p>
                        <div className="ak-height-30 ak-height-lg-30"></div>
                        <div className="opening-hour-date">
                            <p>SUNDAY - THURSDAY: 11:30AM - 11PM</p>
                            <div className="opening-hour-hr"></div>
                            <p> FRIDAY &amp; SATURDAY: 11:30AM - 12AM</p>
                        </div>
                        <div className="ak-height-70 ak-height-lg-30"></div>
                        <div className="text-btn">
                            <Link to="/reservation" className="text-btn1">Reservation</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default OpeningHours;