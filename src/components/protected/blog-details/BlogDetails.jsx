import React from 'react';
import Header from '../../public/header/Header';
import Footer from '../../public/footer/Footer';
import "./BlogDetails.scss";
import { Link } from "react-router-dom";
import blogDetailsImg from '../../../assets/images/blog_detalis.jpg' // relative path to image 
import testimonialIconOne from '../../../assets/images/testimonial_icon_l.svg' // relative path to image 
import testimonialIconR from '../../../assets/images/testimonial_icon_r.svg' // relative path to image 
import testimonialOne from '../../../assets/images/testimonial_1.jpg' // relative path to image 
import blogDetailsVideo from '../../../assets/images/blog_details_video.jpg' // relative path to image 
import Author from '../../../assets/images/author.png' // relative path to image 
import blogFour from '../../../assets/images/blog_4.jpg' // relative path to image 
import blogFive from '../../../assets/images/blog_5.jpg' // relative path to image 
import blogSix from '../../../assets/images/blog_6.jpg' // relative path to image 

const BlogDetails = () => {
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
                                    <Link to="/">Home</Link> / Single Blog
                                </div>
                                <h2 className="ak-section-title page-title-anim">Single Blog</h2>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Hero */}

                {/* Blog Content */}
                <section className="container">
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="blog-details">
                        <h3 className="anim-title-3">Indulge in Exquisite Dining</h3>
                        <div className="blog-details-subtitle">
                            <p>15 June 2023</p>
                            <p className="blog-details-date"></p>
                            <p>By: Marlow</p>
                        </div>
                    </div>

                    <div className="row" id="containerAround">
                        <div className="col-md-8">
                            <div className="blog-content" id="scrollGaleria">
                                <div className="ak-height-50 ak-height-lg-30"></div>
                                <img className="imagesZoom" src={blogDetailsImg} alt="..." />
                                <div className="ak-height-75 ak-height-lg-30"></div>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                    galley of type and scrambled it to make a type
                                    specimen book. It has survived not only five centuries, but also the leap into electronic
                                    typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                                    release of Letraset sheets containing Lorem Ipsum
                                    passages, and more recently with desktop publishing software like Aldus PageMaker including
                                    versions of Lorem Ipsum.
                                </p>
                                <div className="ak-height-75 ak-height-lg-30"></div>

                                <div className="quote-option">
                                    <div className="testimonial-section">
                                        <div className="testimonial-icon-1">
                                            <img src={testimonialIconOne} alt="..." />
                                        </div>
                                        <div className="testimonial-info-section">
                                            <div className="testimonial-info">
                                                <p className="testimonial-info-subtitle">“Their talented team of Lorem Ipsum is
                                                    simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                                    been the industry's standard dummy text ever since the 1500s, when an
                                                    unknown printer.</p>
                                            </div>
                                        </div>
                                        <div className="testimonial-icon-1">
                                            <img src={testimonialIconR} alt="..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="ak-height-75 ak-height-lg-30"></div>

                                <h4 className="anim-title-2 ak-white-color">Indulge in Exquisite Dining</h4>
                                <div className="ak-height-20 ak-height-lg-20"></div>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                    galley of type and scrambled it to make a type
                                    specimen book. It has survived not only five centuries, but also the leap into electronic
                                    typesetting, remaining essentially unchanged. It was popularised in the 1960s with the
                                    release of Letraset sheets containing Lorem Ipsum
                                    passages, and more recently with desktop publishing software like Aldus PageMaker including
                                    versions of Lorem Ipsum.</p>
                                <div className="ak-height-75 ak-height-lg-30"></div>

                                {/* Start Video */}
                                <div>
                                    <div className="video-section">
                                        <img src={blogDetailsVideo} alt="..."
                                            className="video-section-bg-img ak-bg imagesZoom" />
                                        <div className="video-section-btn">
                                            <Link to="/" className="ak-video-block ak-style1 ak-video-open">
                                                <span className="ak-player-btn ak-accent-color">
                                                    <span></span>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                {/* End Video */}

                                <div className="ak-height-75 ak-height-lg-30"></div>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                    been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                    galley of type</p>
                                <div className="ak-height-75 ak-height-lg-30"></div>
                                <div className="blog-details-border"></div>
                                <div className="ak-height-35 ak-height-lg-30"></div>
                                <div className="social-link">
                                    <p>Social Share:</p>
                                    <Link to="/">Facebook</Link>
                                    <Link to="/">LinkedIn</Link>
                                    <Link to="/">Instagram</Link>
                                </div>

                                <div className="ak-height-100 ak-height-lg-60"></div>
                                <div>
                                    <h3 className="anim-title-2 ak-white-color">Comment (1)</h3>
                                    <p>One Comment Yet! Comment post comment box is empty! </p>
                                    <ol className="comment-list">
                                        <li className="comment">
                                            <div className="comment-body">
                                                <div className="comment-author vcard">
                                                    <img className="avatar" src={Author} alt="Author" />
                                                    <Link to="/" className="url">George Steven</Link>
                                                </div>
                                                <div className="comment-meta">
                                                    <Link to="/">Sep 17, 2023 at 10:59 am</Link>
                                                </div>
                                                <p>Donec pellentesque luctus tortor finibus blandit. Fusce tincidunt lectus
                                                    augue, quis commodo justo tincidunt eget. Praesent at elit diam. Tortor
                                                    finibus blandit
                                                </p>
                                                <div className="reply">
                                                    <Link to="/" className="comment-reply-link">
                                                        Reply
                                                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M1 5.74707H8.5C10.0913 5.74707 11.6174 6.37921 12.7426 7.50443C13.8679 8.62965 14.5 10.1558 14.5 11.7471V13.2471M1 5.74707L5.5 10.2471M1 5.74707L5.5 1.24707"
                                                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                                                stroke-linejoin="round"></path>
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                            <ol className="children">
                                                <li className="comment">
                                                    <div className="comment-body">
                                                        <div className="comment-author vcard">
                                                            <img className="avatar" src={testimonialOne} alt="Author" />
                                                            <Link to="/" className="url">Sarah Taylor</Link>
                                                        </div>
                                                        <div className="comment-meta">
                                                            <Link to="/">Sep 17, 2023 at 5:59 pm</Link>
                                                        </div>
                                                        <p>Thanks bro 🙂</p>
                                                        <div className="reply">
                                                            <Link to="/" className="comment-reply-link">
                                                                Reply
                                                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M1 5.74707H8.5C10.0913 5.74707 11.6174 6.37921 12.7426 7.50443C13.8679 8.62965 14.5 10.1558 14.5 11.7471V13.2471M1 5.74707L5.5 10.2471M1 5.74707L5.5 1.24707"
                                                                        stroke="currentColor" stroke-width="1.5"
                                                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                                                </svg>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ol>
                                        </li>
                                    </ol>
                                </div>

                                <div className="ak-height-100 ak-height-lg-60"></div>
                                <div className="contact-content">
                                    <div className="contact-form">
                                        <h2 className="contact-form-title anim-title-2 ak-white-color">Post A Comment</h2>
                                        <from action="jsfdjks.php" method="post">
                                            <div className="from-input">
                                                <input placeholder="Name" className="col-md-5 col-12" type="text" name="fristname"
                                                    id="fristname" />
                                                <input placeholder="Email" className="col-md-5 col-12" type="email" name="email"
                                                    id="emailid" />
                                            </div>
                                            <div className="col-md-12">
                                                <textarea name="textarea" rows="5" className="col-12 col-md-10"
                                                    placeholder="Comment text."></textarea>
                                            </div>
                                            <div className="ak-height-40 ak-height-lg-20"></div>
                                            <div className="ak-btn style-5">
                                                <button type="submit">Post Comment
                                                </button>
                                            </div>
                                        </from>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Start Widget */}
                        <div className="col-md-4">
                            <div id="infoProduto">
                                <div className="ak-height-50 ak-height-lg-30"></div>
                                <div>
                                    <div className="search-filed">
                                        <input type="text" className="input-section" placeholder="Search" />
                                        <button type="submit" className="search-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"
                                                fill="none">
                                                <path
                                                    d="M15.5 14.0898H14.71L14.43 13.8198C15.4439 12.6439 16.0011 11.1425 16 9.58985C16 8.30427 15.6188 7.04756 14.9046 5.97864C14.1903 4.90972 13.1752 4.0766 11.9874 3.58463C10.7997 3.09266 9.49279 2.96394 8.23192 3.21474C6.97104 3.46555 5.81285 4.08461 4.90381 4.99365C3.99477 5.90269 3.3757 7.06088 3.1249 8.32176C2.87409 9.58264 3.00282 10.8896 3.49479 12.0773C3.98676 13.265 4.81988 14.2802 5.8888 14.9944C6.95772 15.7086 8.21442 16.0898 9.5 16.0898C11.11 16.0898 12.59 15.4998 13.73 14.5198L14 14.7998V15.5898L19 20.5798L20.49 19.0898L15.5 14.0898ZM9.5 14.0898C7.01 14.0898 5 12.0798 5 9.58985C5 7.09985 7.01 5.08985 9.5 5.08985C11.99 5.08985 14 7.09985 14 9.58985C14 12.0798 11.99 14.0898 9.5 14.0898Z"
                                                    fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="ak-height-50 ak-height-lg-30"></div>
                                <div>
                                    <h5>Popular Category</h5>
                                    <div className="category-list">
                                        <Link to="/">Cheeseburgers</Link>
                                        <Link to="/">Paneer Pakora</Link>
                                        <Link to="/">Hors D'oeuvres</Link>
                                        <Link to="/">Spaghetti Carbonara </Link>
                                        <Link to="/">Croquetas de jamón</Link>

                                    </div>
                                </div>
                                <div className="ak-height-50 ak-height-lg-30"></div>
                                <div className="popular-tag">
                                    <Link to="/">Sushi</Link>
                                    <Link to="/">Sashimi</Link>
                                    <Link to="/">Moussaka</Link>
                                    <Link to="/">Moussaka</Link>
                                    <Link to="/">Antipasto</Link>
                                    <Link to="/">antipasto</Link>
                                    <Link to="/">Apple pie</Link>

                                </div>
                                <div className="ak-height-50 ak-height-lg-30"></div>
                                <div className="author-info">
                                    <img className="author-img" src={Author} alt="..." />
                                    <h6 className="author-title">Baskerville</h6>
                                    <p className="author-text">I'm are lorem ipsum pass <br /> ages of available,</p>
                                    <Link to="/" className="author-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15"
                                            fill="none">
                                            <path
                                                d="M1.76547 14.043H4.71284V8.14086H7.36842L7.66021 5.20823H4.71284V3.72718C4.71284 3.53176 4.79047 3.34434 4.92866 3.20615C5.06684 3.06797 5.25426 2.99034 5.44968 2.99034H7.66021V0.0429688H5.44968C4.47257 0.0429688 3.53548 0.431126 2.84455 1.12205C2.15363 1.81297 1.76547 2.75007 1.76547 3.72718V5.20823H0.291789L0 8.14086H1.76547V14.043Z"
                                                fill="white" />
                                        </svg>
                                    </Link>
                                    <Link to="/" className="author-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15"
                                            fill="none">
                                            <path
                                                d="M6.2211 14.043C12.8947 14.043 16.5443 8.65653 16.5443 3.98513C16.5443 3.83222 16.5443 3.68002 16.5339 3.52854C17.2442 3.02792 17.8573 2.40802 18.3444 1.69789C17.6823 1.98409 16.9799 2.17187 16.2606 2.25498C17.0178 1.81297 17.5844 1.11802 17.8551 0.299413C17.1431 0.71109 16.3641 1.00123 15.5517 1.15731C15.0047 0.590554 14.2811 0.215262 13.4931 0.089505C12.7051 -0.0362519 11.8964 0.0945368 11.1924 0.461633C10.4883 0.828729 9.92806 1.41167 9.59829 2.12025C9.26853 2.82882 9.18764 3.62354 9.36815 4.38141C7.92572 4.31098 6.5146 3.9458 5.2264 3.3096C3.9382 2.6734 2.8017 1.78038 1.89068 0.688517C1.42683 1.46677 1.28484 2.388 1.4936 3.26467C1.70236 4.14134 2.24618 4.90754 3.01437 5.4073C2.4369 5.3905 1.87205 5.23858 1.36752 4.96435V5.00958C1.36775 5.8257 1.65769 6.61661 2.18817 7.24821C2.71865 7.87981 3.45701 8.31321 4.27805 8.4749C3.74395 8.61666 3.18361 8.63729 2.64005 8.53521C2.87186 9.23761 3.32319 9.85187 3.93091 10.2921C4.53864 10.7323 5.27237 10.9765 6.02952 10.9904C5.27721 11.5663 4.41577 11.9921 3.49445 12.2434C2.57313 12.4947 1.61001 12.5666 0.660156 12.455C2.31919 13.4926 4.24966 14.0431 6.2211 14.0408"
                                                fill="white" />
                                        </svg>
                                    </Link>
                                    <Link to="/" className="author-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17"
                                            fill="none">
                                            <path
                                                d="M4.9694 3.37599C4.96922 3.72961 4.82858 4.06868 4.57841 4.31861C4.32823 4.56853 3.98902 4.70884 3.6354 4.70866C3.28178 4.70848 2.94271 4.56784 2.69279 4.31766C2.44286 4.06749 2.30256 3.72828 2.30273 3.37466C2.30291 3.02104 2.44356 2.68197 2.69373 2.43205C2.9439 2.18212 3.28311 2.04182 3.63673 2.04199C3.99036 2.04217 4.32942 2.18281 4.57935 2.43299C4.82927 2.68316 4.96958 3.02237 4.9694 3.37599ZM5.0094 5.69599H2.34273V14.0427H5.0094V5.69599ZM9.22273 5.69599H6.5694V14.0427H9.19607V9.66266C9.19607 7.22266 12.3761 6.99599 12.3761 9.66266V14.0427H15.0094V8.75599C15.0094 4.64266 10.3027 4.79599 9.19607 6.81599L9.22273 5.69599Z"
                                                fill="white" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* End Widget */}
                    </div>
                </section>
                {/* End Blog Content */}

                {/* Start Similar Post */}
                <div className="container">
                    <div className="ak-height-150 ak-height-lg-60"></div>
                    <div className="ak-section-heading ak-style-1 ak-type-1">
                        <div className="ak-section-subtitle">
                            Similar News
                        </div>
                        <h2 className="ak-section-title anim-title">Similar News</h2>
                    </div>
                    <div className="ak-height-75 ak-height-lg-60"></div>
                    <div className="row row-cols-1 row-cols-md-3 g-4" id="pagination-container">
                        <div className="col ak-border border-none-bottom drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogFour} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Nine">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Nine" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border border-none-bottom drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogFive} className="blog-img-top" alt="..." />
                                <div className="blog-body">
                                    <p className="blog-time">06 June 2023</p>
                                    <Link to="/blogs/Nine">
                                        <h6 className="blog-title">Exquisite Dining Make Moment</h6>
                                    </Link>
                                    <Link to="/blogs/Nine" className="blog-text">Read More</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col ak-border border-none-bottom drop-anim-gallery">
                            <div className="blog h-100">
                                <img src={blogSix} className="blog-img-top" alt="..." />
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
                {/* End Similar Post */}

                {/* Start Footer */}
                <Footer />
                {/* End Footer */}
            </div>
        </div>
    )
}

export default BlogDetails;