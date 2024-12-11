import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./MeetTheChef.scss";
import { Link } from "react-router-dom";
import meetAbout from '../../../assets/images/meetAbout.jpg' // relative path to image 

const MeetTheChef = () => {
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
                                    <Link to="/">Home</Link> / Chefs
                                </div>
                                <h2 className="ak-section-title page-title-anim">Our Chefs</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Start About Content */}
                <section>
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="container">
                        <div className="meet-the-content-about-section">
                            <div className="about-info">
                                <div className="ak-section-heading ak-style-1 ak-color-1">
                                    <p>Head of Chef</p>
                                    <h2 className="ak-section-title anim-title-3">About Alex Smith</h2>
                                </div>
                                <div className="ak-height-25 ak-height-lg-25"></div>
                                <p>Lorem to our restaurant, where culinary artistry meets exceptional dining experiences. At, we
                                    strive to create a gastronomic haven that tantalizes your taste buds and leaves you with
                                    unforgettable memories. Welcome to our restaurant,
                                    where culinary artistry meets exceptional dining experiences. At, we strive to create a
                                    gastronomic.
                                </p>
                                <div className="ak-height-25 ak-height-lg-25"></div>
                                <p>Lorem to our restaurant, where culinary artistry meets exceptional dining experiences. At, we
                                    strive to create a gastronomic haven that. Lorem to our restaurant, where culinary artistry
                                    meets exceptional dining exp eriences. At,
                                    we strive to create a gastronomic haven that.</p>
                                <div className="ak-height-45 ak-height-lg-30"></div>
                                <div className="text-btn">
                                    <Link to="/" className="text-btn1 ak-video-open">View Expertise</Link>
                                </div>
                            </div>

                            <div className="about-img">
                                <img src={meetAbout} className="imagesZoom" data-speed="1.1" alt="meetAbout" />
                            </div>
                            <div className="about-social">
                                <Link to="/">FACEBOOK</Link>
                                <Link to="/">LINKED-IN</Link>
                                <Link to="/">INSTAGRAM</Link>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End About Content */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default MeetTheChef;