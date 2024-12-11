import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./Chefs.scss";
import { Link } from "react-router-dom";
import chefOne from '../../../assets/images/chef_1.jpg' // relative path to image 
import chefTwo from '../../../assets/images/chef_2.jpg' // relative path to image 
import chefThree from '../../../assets/images/chef_3.jpg' // relative path to image 
import chefFour from '../../../assets/images/chef_4.jpg' // relative path to image 
import chefFive from '../../../assets/images/chef_5.jpg' // relative path to image 
import chefSix from '../../../assets/images/chef_6.jpg' // relative path to image 

const Chefs = () => {
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

                <div className="ak-height-150 ak-height-lg-60"></div>
                {/* Start  all chef */}
                <section className="container">
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-5">
                        <div className="col">
                            <div className="chef ak-chef-bg-img" style={{ backgroundImage: `url(${chefOne})` }}>
                                <div className="chef-style-1">
                                    <div className="chef-info">
                                        <div className="chef-info-social">
                                            <Link to="/">FACEBOOK</Link>
                                            <Link to="/">LINKED-IN</Link>
                                            <Link to="/">INSTAGRAM</Link>
                                        </div>
                                        <div className="chef-title">
                                            <Link to="/chefs/One">Byron Smith</Link>
                                            <p>Head of Chef</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="chef ak-chef-bg-img" style={{ backgroundImage: `url(${chefTwo})` }}>
                                <div className="chef-style-1">
                                    <div className="chef-info">
                                        <div className="chef-info-social">
                                            <Link to="/">FACEBOOK</Link>
                                            <Link to="/">LINKED-IN</Link>
                                            <Link to="/">INSTAGRAM</Link>
                                        </div>
                                        <div className="chef-title">
                                            <Link to="/chefs/One">Byron Smith</Link>
                                            <p>Head of Chef</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="chef ak-chef-bg-img" style={{ backgroundImage: `url(${chefThree})` }}>
                                <div className="chef-style-1">
                                    <div className="chef-info">
                                        <div className="chef-info-social">
                                            <Link to="/">FACEBOOK</Link>
                                            <Link to="/">LINKED-IN</Link>
                                            <Link to="/">INSTAGRAM</Link>
                                        </div>
                                        <div className="chef-title">
                                            <Link to="/chefs/One">Byron Smith</Link>
                                            <p>Head of Chef</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="chef ak-chef-bg-img" style={{ backgroundImage: `url(${chefFour})` }}>
                                <div className="chef-style-1">
                                    <div className="chef-info">
                                        <div className="chef-info-social">
                                            <Link to="/">FACEBOOK</Link>
                                            <Link to="/">LINKED-IN</Link>
                                            <Link to="/">INSTAGRAM</Link>
                                        </div>
                                        <div className="chef-title">
                                            <Link to="/chefs/One">Byron Smith</Link>
                                            <p>Head of Chef</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="chef ak-chef-bg-img" style={{ backgroundImage: `url(${chefFive})` }}>
                                <div className="chef-style-1">
                                    <div className="chef-info">
                                        <div className="chef-info-social">
                                            <Link to="/">FACEBOOK</Link>
                                            <Link to="/">LINKED-IN</Link>
                                            <Link to="/">INSTAGRAM</Link>
                                        </div>
                                        <div className="chef-title">
                                            <Link to="/chefs/One">Byron Smith</Link>
                                            <p>Head of Chef</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col">
                            <div className="chef ak-chef-bg-img" style={{ backgroundImage: `url(${chefSix})` }}>
                                <div className="chef-style-1">
                                    <div className="chef-info">
                                        <div className="chef-info-social">
                                            <Link to="/">FACEBOOK</Link>
                                            <Link to="/">LINKED-IN</Link>
                                            <Link to="/">INSTAGRAM</Link>
                                        </div>
                                        <div className="chef-title">
                                            <Link to="/chefs/One">Byron Smith</Link>
                                            <p>Head of Chef</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End  all chef */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default Chefs;