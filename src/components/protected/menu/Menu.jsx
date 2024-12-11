import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./Menu.scss";
import { Link } from "react-router-dom";
import menuBg from '../../../assets/images/menuBg.png' // relative path to image 
import itemShowTwo from '../../../assets/images/item-show_2.png' // relative path to image 
import itemShowThree from '../../../assets/images/item-show_3.png' // relative path to image 
import itemShow from '../../../assets/images/item-show.png' // relative path to image 
import bessertsMenuBg from '../../../assets/images/bessertsMenuBg.png' // relative path to image 
import barMenuBg from '../../../assets/images/barMenuBg.png' // relative path to image 

const Menu = () => {
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
                                    <Link to="/">Home</Link> / Our Menu
                                </div>
                                <h2 className="ak-section-title page-title-anim">Our Menu</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Start Food Menu  Idli's */}
                <section className="set-bg-img-section ak-menu-bg">
                    <img src={menuBg} alt="..." className="imagesZoom bg-img ak-menu-bg-img" />
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="container">
                        <div className="ak-section-heading ak-style-1 ak-type-1">
                            <div className="ak-section-subtitle">
                                XXXXXXXX
                            </div>
                            <h2 className="ak-section-title anim-title">Idli</h2>
                        </div>
                        <div className="ak-height-65 ak-height-lg-30"></div>
                        <div className="ak-menu-list">
                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Idli (2 psc) <i class='bx bxs-offer' title="Best Seller"></i></p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>&#8377; 19</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>With chutney and sambhar</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>With all inclusive taxes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Sambhar Idli (2psc)  <i class='bx bxs-bookmarks' title="Must Try"></i></p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>&#8377; 69</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara <i class='bx bxs-star' title="Recommended"></i></p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara <i class='bx bxs-badge-dollar' title="Chef Special"></i></p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara <i class='bx bxs-brightness' title="New"></i></p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowTwo} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1"></div>
                                            <div className="food-menu-hr style-1"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="ak-height-150 ak-height-lg-0"></div>
                </section>
                {/* End Food Menu  Appetizers */}

                {/* Start Food Menu Desserts */}
                <section className="set-bg-img-section ak-menu-bg">
                    <img src={bessertsMenuBg} alt="..." className="imagesZoom bg-img ak-menu-bg-img" />
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="container">
                        <div className="ak-section-heading ak-style-1 ak-type-1">
                            <div className="ak-section-subtitle">
                                Sweet dreams
                            </div>
                            <h2 className="ak-section-title anim-title">Desserts</h2>
                        </div>
                        <div className="ak-height-65 ak-height-lg-30"></div>
                        <div className="ak-menu-list">
                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShow} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                            <div className="food-menu-hr style-1 anim-2"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="ak-height-150 ak-height-lg-0"></div>
                </section>
                {/* End Food Menu Desserts */}

                {/* Start Food Menu Bar Items */}
                <section className="set-bg-img-section ak-menu-bg">
                    <img src={barMenuBg} alt="..." className="imagesZoom bg-img ak-menu-bg-img" />
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="container">
                        <div className="ak-section-heading ak-style-1 ak-type-1">
                            <div className="ak-section-subtitle">
                                Juice Bar
                            </div>
                            <h2 className="ak-section-title anim-title">Bar Items</h2>
                        </div>
                        <div className="ak-height-65 ak-height-lg-30"></div>
                        <div className="ak-menu-list">
                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ak-menu-list-section-1">
                                <img src={itemShowThree} alt="..." />
                                <div className="food-menu style-1">
                                    <div className="food-menu-section-1">
                                        <div className="food-menu-title">
                                            <p>Spaghetti alla Carbonara</p>
                                        </div>
                                        <div className="food-menu-hr">
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                            <div className="food-menu-hr style-1 anim-3"></div>
                                        </div>
                                        <div className="food-menu-price">
                                            <p>$49</p>
                                        </div>
                                    </div>
                                    <div className="food-menu-section-2">
                                        <div className="food-menu-subsitle">
                                            <p>Lorem passionate chefs masterfully</p>
                                        </div>
                                        <div className="food-menu-price-subsitle">
                                            <p>Extra free juice</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="ak-height-150 ak-height-lg-0"></div>
                </section>
                {/* End Food Menu Bar Items */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default Menu;