import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import Testimonials from '../../public/testimonials/Testimonials';
import "./About.scss";
import { Link } from "react-router-dom";
import about_bg from '../../../assets/images/about_bg.jpg' // relative path to image 
import aboutVideoBg from '../../../assets/images/aboutVideoBg.jpg' // relative path to image 
import OpeningHours from '../../public/opening-hours/OpeningHours';


const About = () => {
    return (
        <div>
            <Header />
            <div id="scrollsmoother-container">
                {/* Start Hero */}
                <section>
                    <div className="ak-commmon-hero ak-style1 ak-bg">
                        <div className="ak-commmon-heading">
                            <div className="ak-section-heading ak-style-1 ak-type-1 ak-color-1 page-top-title">
                                <div className="ak-section-subtitle">
                                    <Link to="/">Home</Link> / About Us
                                </div>
                                <h2 className="ak-section-title page-title-anim">About Us</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Start About */}
                <section className="ak-about-bg-color">
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="ak-about ak-style-1">
                        <div className="ak-about-bg-img ak-bg">
                            <img className="imagesZoom" src={about_bg} alt="..." />
                        </div>
                        <div className="ak-about-hr"></div>
                        <div className="container">
                            <div className="about-section ak-about-1">
                                <div className="about-text-section">
                                    <h2 className="about-title">Exquisite Dining Experience Fit for
                                        <br /><span className="anim-title-2">Royalty</span>
                                    </h2>
                                    <div className="ak-height-30 ak-height-lg-30"></div>
                                    <p className="about-subtext">Welcome to our restaurant, where culinary artistry meets
                                        exceptional dining experiences. At, we strive to create a gastronomic haven that
                                        tantalizes your taste buds and leaves you with unforgettable memories.
                                    </p>
                                    <div className="ak-height-30 ak-height-lg-30"></div>
                                    <p className="about-subtext">Lorem to our restaurant, where culinary artistry meets exceptional
                                        dining experiences. At, we strive to create a gastronomic haven that.
                                    </p>
                                    <div className="ak-height-50 ak-height-lg-30"></div>
                                    <div className="text-btn">
                                        <Link to="/about" className="text-btn1">Discover The Kitchen</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End About */}

                {/* Start Testimonial */}
                <Testimonials />
                {/* End Testimonial */}

                {/* Start Opening Hour */}
                <OpeningHours />
                {/* End Opening Hour */}

                <div className="ak-height-150 ak-height-lg-60"></div>
                {/* Start Video */}
                <div className="video-section">
                    <img src={aboutVideoBg} alt="..." className="video-section-bg-img ak-bg imagesZoom"/>
                    <div className="video-section-btn">
                        <Link to="/about" className="ak-video-block ak-style1 ak-video-open">
                            <span className="ak-player-btn ak-accent-color">
                                <span></span>
                            </span>
                        </Link>
                    </div>
                </div>
                {/* End Video */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
            
        </div>
    )
}

export default About;