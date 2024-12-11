import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./Blogs.scss";
import { Link } from "react-router-dom";
import blogOne from '../../../assets/images/blog_1.jpg' // relative path to image 
import blogTwo from '../../../assets/images/blog_2.jpg' // relative path to image 
import blogThree from '../../../assets/images/blog_3.jpg' // relative path to image 
import blogFour from '../../../assets/images/blog_4.jpg' // relative path to image 
import blogFive from '../../../assets/images/blog_5.jpg' // relative path to image 
import blogSix from '../../../assets/images/blog_6.jpg' // relative path to image 
import blogSeven from '../../../assets/images/blog_7.jpg' // relative path to image 
import blogEight from '../../../assets/images/blog_8.jpg' // relative path to image 
import blogNine from '../../../assets/images/blog_9.jpg' // relative path to image 

const Blogs = () => {
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
                                    <Link to="/">Home</Link> / Blog
                                </div>
                                <h2 className="ak-section-title page-title-anim">Blog</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Start All Blog */}
                <div className="container">
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="pagination-container">
                        <div className="col ak-border drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogOne} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/One">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/One" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogTwo} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Two">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Two" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogThree} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Three">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Three" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogFour} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Four">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Four" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogFive} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Five">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Five" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogSix} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Six">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Six" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogSeven} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Seven">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Seven" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogEight} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Eight">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Eight" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border  drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogNine} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Nine">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Nine" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End All Blog */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default Blogs;