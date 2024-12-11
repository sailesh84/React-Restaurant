import React, { useRef, useEffect, useState } from 'react';

import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import Testimonials from '../../public/testimonials/Testimonials';
import "./Home.scss";
import Hero from '../hero/Hero';
import LightGallery from 'lightgallery/react/Lightgallery.es5';

// If you want you can use SCSS instead of css
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';
import 'lightgallery/scss/lg-thumbnail.scss';
import 'lightgallery/scss/lg-autoplay.scss';
import 'lightgallery/scss/lg-share.scss';

// import plugins if you need
import lgZoom from 'lightgallery/plugins/zoom';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgShare from 'lightgallery/plugins/share';

import galleryOne from '../../../assets/images/gallery_1.jpg';
import galleryTwo from '../../../assets/images/gallery_2.jpg';
import galleryThree from '../../../assets/images/gallery_3.jpg';
import bestItem1 from '../../../assets/images/bestItem1.jpg';
import bestItem2 from '../../../assets/images/bestItem2.jpg';
import starLine from '../../../assets/images/star_line.svg';

import gsap from 'gsap-trial';
import { useGSAP } from '@gsap/react';
import ScrollSmoother from 'gsap-trial/ScrollSmoother';
import ScrollTrigger from 'gsap-trial/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollSmoother, ScrollTrigger);

const Home = () => {

    const main = useRef();
    const smoother = useRef();

    useGSAP(() => {
        // create the smooth scroller FIRST!
        smoother.current = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 2, // seconds it takes to "catch up" to native scroll position
            smoothTouch: 0.5,
            effects: true
        });

        ScrollTrigger.create({
            trigger: '#smooth-wrapper',
            markers: false,
        });

    }, { scope: main });


    const [isVisible, setIsVisible] = useState(false);
    const listenToScroll = () => {
        const scroll = document.body.scrollTop || document.documentElement.scrollTop;

        if (scroll >= 2000) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", listenToScroll);
        return () => window.removeEventListener("scroll", listenToScroll);
    }, []);

    const goToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    return (
        <div>
            {/* <PreLoader /> */}
            <Header />
            <div id="smooth-wrapper" ref={main}>
                <div id="smooth-content">
                    <main>
                        {/* Start Hero */}
                        <section>
                            <Hero />
                        </section>
                        {/* End Hero */}

                        {/* Start Gallery */}
                        <div className="ak-height-150 ak-height-lg-60"></div>
                        <div className="container">
                            <div className="ak-section-heading ak-style-1 ak-type-1">
                                <div className="ak-section-subtitle">
                                    Food Items
                                </div>
                                <h2 className="ak-section-title anim-title">Food Showcase</h2>
                            </div>
                            <div className="ak-height-65 ak-height-lg-30"></div>
                            <LightGallery
                                speed={500}
                                plugins={[lgThumbnail, lgZoom, lgAutoplay, lgShare]}
                                elementClassNames={'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'}
                            >
                                <a href={galleryOne} className="ak-card ak-style-1">
                                    <div className="ak-card-img">
                                        <img alt="Spaghetti Carbonara - Desserts" src={galleryOne} />
                                    </div>
                                    <div className="card-info">
                                        <div className="card-text style-1">
                                            <h5 className="card-title">
                                                Spaghetti Carbonara
                                            </h5>
                                            <div className="card-subtitle">
                                                Desserts
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <a href={galleryTwo} className="ak-card ak-style-1">
                                    <div className="ak-card-img">
                                        <img alt="Spaghetti Carbonara - Desserts" src={galleryTwo} />
                                    </div>
                                    <div className="card-info">
                                        <div className="card-text style-1">
                                            <h5 className="card-title">
                                                Spaghetti Carbonara
                                            </h5>
                                            <div className="card-subtitle">
                                                Desserts
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <a href={galleryThree} className="ak-card ak-style-1">
                                    <div className="ak-card-img">
                                        <img alt="Spaghetti Carbonara - Desserts" src={galleryThree} />
                                    </div>
                                    <div className="card-info">
                                        <div className="card-text style-1">
                                            <h5 className="card-title">
                                                Spaghetti Carbonara
                                            </h5>
                                            <div className="card-subtitle">
                                                Desserts
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </LightGallery>

                        </div>
                        {/* End Gallery */}

                        {/* Start Our Specialties */}
                        <section>
                            <div className="ak-height-150 ak-height-lg-60"></div>
                            <div className="container">
                                <div className="ak-best-item">
                                    <div className="best-item-section-1">
                                        <div className="ak-section-heading ak-style-1">
                                            <div className="ak-section-subtitle">
                                                Our food philosophy
                                            </div>
                                            <h2 className="ak-section-title anim-title-2"><span className="text-white"> Our</span> <br />
                                                Specialties
                                            </h2>
                                        </div>
                                        <div className="ak-height-30 ak-height-lg-30"></div>
                                        <div>
                                            <p>Welcome to our restaurant, where culinary artistry meets exceptional dining
                                                experiences. At, we strive to create a gastronomic haven that tantalizes your taste
                                                buds.
                                            </p>
                                        </div>
                                        <div className="ak-height-50 ak-height-lg-30"></div>
                                        <div className="img-one">
                                            <img src={bestItem2} alt="..." data-speed="1.2" data-lag="0" />
                                            <div className="img-overlay" style={{ height: "0%" }}></div>
                                        </div>
                                    </div>
                                    <div className="best-item-section-2" data-speed="1.1" data-lag="1">
                                        <img src={starLine} alt="..." />
                                    </div>
                                    <div className="best-item-section-3">
                                        <div className="img-two">
                                            <img src={bestItem1} alt="..." data-speed="1.1" data-lag="0" />
                                            <div className="img-overlay" style={{ height: "0%" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* End Our Specialties */}

                        {/* Start Testimonials */}
                        <Testimonials />
                        {/* End Testimonials */}

                        <Footer />
                    </main>
                </div>
            </div>

            {isVisible && (
                <span className="ak-scrollup ak-scrollup-show" onClick={goToTop}>
                    <svg className="icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10L1.7625 11.7625L8.75 4.7875V20H11.25V4.7875L18.225 11.775L20 10L10 0L0 10Z"
                            fill="currentColor" />
                    </svg>
                </span>
            )}
        </div>
    )
}

export default Home;