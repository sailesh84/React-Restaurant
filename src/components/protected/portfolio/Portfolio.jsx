import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./Portfolio.scss";
import { Link } from "react-router-dom";
import foodItemOne from '../../../assets/images/food_item_1.jpg';
import foodItemTwo from '../../../assets/images/food_item_2.jpg';
import foodItemThree from '../../../assets/images/food_item_3.jpg';
import foodItemFour from '../../../assets/images/food_item_4.jpg';
import foodItemFive from '../../../assets/images/food_item_5.jpg';


const Portfolio = () => {
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
                                    <Link to="/">Home</Link> / Portfolio
                                </div>
                                <h2 className="ak-section-title page-title-anim">Portfolio</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Start Portfolio */}
                <div className="container">
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        <Link to="/portfolio/One" className="ak-card ak-style-1">
                            <div className="ak-card-img">
                                <img alt="img1" src={foodItemOne} />
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
                        </Link>

                        <Link to="/portfolio/Two" className="ak-card ak-style-1">
                            <div className="ak-card-img">
                                <img alt="img2" src={foodItemTwo} />
                            </div>
                            <div className="card-info">
                                <div className="card-text style-1">
                                    <h5 className="card-title">
                                        Spaghetti Carbonara
                                    </h5>
                                    <div className="card-subtitle">
                                        Google Marketing
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/portfolio/Three" className="ak-card ak-style-1">
                            <div className="ak-card-img">
                                <img alt="img2" src={foodItemThree} />
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
                        </Link>

                        <Link to="/portfolio/Four" className="ak-card ak-style-1">
                            <div className="ak-card-img">
                                <img alt="img2" src={foodItemFour} />
                            </div>
                            <div className="card-info">
                                <div className="card-text style-1">
                                    <h5 className="card-title">
                                        Spaghetti Carbonara
                                    </h5>
                                    <div className="card-subtitle">
                                        Google Marketing
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link to="/portfolio/Five" className="ak-card ak-style-1">
                            <div className="ak-card-img">
                                <img alt="img2" src={foodItemFive} />
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
                        </Link>

                        <Link to="/portfolio/One" className="ak-card ak-style-1">
                            <div className="ak-card-img">
                                <img alt="img2" src={foodItemOne} />
                            </div>
                            <div className="card-info">
                                <div className="card-text style-1">
                                    <h5 className="card-title">
                                        Spaghetti Carbonara
                                    </h5>
                                    <div className="card-subtitle">
                                        Google Marketing
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                {/* End Portfolio */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default Portfolio;