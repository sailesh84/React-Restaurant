import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import "./Testimonials.scss";
import testimonialIconOne from '../../../assets/images/testimonial_icon_l.svg';
import testimonialIconR from '../../../assets/images/testimonial_icon_r.svg';
import testimonialOne from '../../../assets/images/testimonial_1.jpg';

const Testimonials = () => {
    return (
        <div>
            <section className="container">
                <div className="ak-height-150 ak-height-lg-60"></div>
                <div className="ak-slider ak-slider-3">
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={1}
                        navigation={true}
                        loop={true}
                        navigation={{
                            nextEl: ".ak-swiper-button-next-3",
                            prevEl: ".ak-swiper-button-prev-3"
                        }}
                        modules={[Navigation]}
                    >
                        <SwiperSlide className="swiper-slide">
                            <div className="container">
                                <div className="testimonial-section">
                                    <div className="testimonial-icon-1">
                                        <img src={testimonialIconOne} alt="..." />
                                    </div>
                                    <div className="testimonial-info-section">
                                        <div className="testimonial-info">
                                            <img src={testimonialOne} className="testimonial-info-img"
                                                alt="..." />
                                            <h6 className="testimonial-info-title">Steven K. Roberts</h6>
                                            <p className="short-title">From USA</p>
                                            <p className="testimonial-info-subtitle">“Their talented team of passionate
                                                chefs masterfully crafts each dish, combining the finest ingredients
                                                with innovative techniques to present culinary creations that are as
                                                visually stunning as they are delicious.”</p>
                                        </div>
                                    </div>
                                    <div className="testimonial-icon-1">
                                        <img src={testimonialIconR} alt="..." />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="swiper-slide">
                            <div className="container">
                                <div className="testimonial-section">
                                    <div className="testimonial-icon-1">
                                        <img src={testimonialIconOne} alt="..." />
                                    </div>
                                    <div className="testimonial-info-section">
                                        <div className="testimonial-info">
                                            <img src={testimonialOne} className="testimonial-info-img"
                                                alt="..." />
                                            <h6 className="testimonial-info-title">Steven K. Roberts</h6>
                                            <p className="short-title">From USA</p>
                                            <p className="testimonial-info-subtitle">“Their talented team of passionate
                                                chefs masterfully crafts each dish, combining the finest ingredients
                                                with innovative techniques to present culinary creations that are as
                                                visually stunning as they are delicious.”</p>
                                        </div>
                                    </div>

                                    <div className="testimonial-icon-1">
                                        <img src={testimonialIconR} alt="..." />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide className="swiper-slide">
                            <div className="container">
                                <div className="testimonial-section">
                                    <div className="testimonial-icon-1">
                                        <img src={testimonialIconOne} alt="..." />
                                    </div>
                                    <div className="testimonial-info-section">
                                        <div className="testimonial-info">
                                            <img src={testimonialOne} className="testimonial-info-img"
                                                alt="..." />
                                            <h6 className="testimonial-info-title">Steven K. Roberts</h6>
                                            <p className="short-title">From USA</p>
                                            <p className="testimonial-info-subtitle">“Their talented team of passionate
                                                chefs masterfully crafts each dish, combining the finest ingredients
                                                with innovative techniques to present culinary creations that are as
                                                visually stunning as they are delicious.”</p>
                                        </div>
                                    </div>

                                    <div className="testimonial-icon-1">
                                        <img src={testimonialIconR} alt="..." />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>

                        <div className="ak-swiper-controll-3">
                            <div className="ak-swiper-navigation-wrap">
                                <div className="ak-swiper-button-prev-3">
                                    <button className="btn-style-2 btn-size btn-style-round button-prev-next-2 rotate-svg"
                                        aria-disabled="false">
                                        <svg width="20" height="14" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="#fff" fill="none">
                                                <path d="M12.743 1.343L18.4 7l-5.657 5.657M18.4 7H.4"></path>
                                            </g>
                                        </svg>
                                        <svg width="20" height="14" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="#fff" fill="none">
                                                <path d="M12.743 1.343L18.4 7l-5.657 5.657M18.4 7H.4"></path>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                                <div className="ak-swiper-button-next-3">
                                    <button className="btn-style-2 btn-size btn-style-round button-prev-next-2"
                                        aria-disabled="false">
                                        <svg width="20" height="14" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="#fff" fill="none">
                                                <path d="M12.743 1.343L18.4 7l-5.657 5.657M18.4 7H.4"></path>
                                            </g>
                                        </svg>
                                        <svg width="20" height="14" xmlns="http://www.w3.org/2000/svg">
                                            <g stroke="#fff" fill="none">
                                                <path d="M12.743 1.343L18.4 7l-5.657 5.657M18.4 7H.4"></path>
                                            </g>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </Swiper>
                </div>
            </section>
        </div>
    )
}

export default Testimonials;