import React from 'react';
import "./Footer.scss";
import { Link } from "react-router-dom";
import logo from '../../../assets/images/Elegencia.png' // relative path to image 

const Footer = () => {
    return (
        <div>
            {/* Start Footer */}
            <footer>
                <div className="ak-footer ak-style-1">
                    <div className="ak-bg-footer footer-bg-img" data-src="assets/images/footer_bg.png"></div>
                    <div className="ak-height-150 ak-height-lg-60"></div>

                    <div className="container ak-hr-container">
                        <div className="ak-braner-logo type-color-1 footer-logo">
                            <div className="footer-log-elem">
                                <div className="footer-log-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="13" viewBox="0 0 30 13"
                                        fill="none">
                                        <path d="M28.991 12.2063L14.8322 1L0.67334 12.2063" stroke="white"
                                            stroke-linecap="round" />
                                    </svg>
                                </div>
                                <img src={logo} alt="..." />
                            </div>
                            <div className="ak-height-100 ak-height-lg-60"></div>
                            <div className="ak-footer-hr-top"></div>

                            <div className="footer-main">
                                <div className="footer-eamil-menu">
                                    <div className="footer-email">
                                        <a href="mailto:info@example.com">
                                            info@example.com
                                        </a>
                                    </div>
                                    <div className="footer-menu">
                                        <ul>
                                            <li><Link to="/">Home</Link></li>
                                            <li><Link to="about">About</Link></li>
                                            <li><Link to="menu">Menu</Link></li>
                                            <li><Link to="chefs">Chef</Link></li>
                                            <li><Link to="portfolio">Portfolio</Link></li>
                                            <li><Link to="blogs">Blog</Link></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="ak-height-75 ak-height-lg-5"></div>
                                <div className="footer-info">
                                    <div className="fooer-phn">
                                        <a href="tel:1-800-915-6271">1-800-915-6271</a>
                                        <br />
                                        <a href="tel:1-800-915-6271">1-800-915-6271</a>
                                    </div>
                                    <div className="footer-address">
                                        <a href="https://maps.app.goo.gl/gAd1JdfRW5d6eHkn7" target="_blank">
                                            2726 Av. PapineauMontreal,<br />QC H2K 4J6, Canada
                                        </a>
                                    </div>
                                    <div className="footer-time">
                                        <p>SUNDAY - THURSDAY: 11:30AM - 11PM</p>
                                        <div className="footer-time-border my-1"></div>
                                        <p>FRIDAY &amp; SATURDAY: 11:30AM - 12AM</p>
                                    </div>
                                    <div className="footer-btn">
                                        <Link to="/reservation">
                                            <div className="reservation-btn">
                                                Reservations
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-footer-hr-bottom qodef-grid-item"></div>
                            <div className="ak-height-130 ak-height-lg-30"></div>

                            <div className="copy-right-section">
                                <p className="text-uppercase text-md-center text-white">
                                    Copyright 2023 All Right Reserved
                                </p>
                            </div>

                            <div className="ak-height-45 ak-height-lg-30"></div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* End Footer */}
        </div>
    )
}

export default Footer;