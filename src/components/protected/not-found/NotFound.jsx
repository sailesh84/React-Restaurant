import React from 'react';
import Header from '../../public/header/Header';
import "./NotFound.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <Header />
            <div id="scrollsmoother-container">
                <div className="section-all-item-center" data-src="assets/img/errorBg.png">
                    <div className="border-comming-soon-colum-right"></div>
                    <div className="border-comming-soon-top"></div>
                    <div className="container text-center">
                        <h2 className="item-title-number">404</h2>
                        <h2 className="item-title">Sorry! The Page isn't Found Here</h2>
                        <p className="item-subtext">Fortunately, since it is mainly a client-side issue, it is relatively easy for
                            website owners to fix the 404 error. This article will explain the possible causes of error 404 and
                            show four effective methods to resolve it.Fortunately, since
                            it is mainly a client-side issue, it is relatively easy for website owners to fix the 404 error.</p>
                        <Link to="/">
                            <div className="ak-btn style-5 mt-4">
                                Back to Home
                            </div>
                        </Link>
                    </div>
                    <div className="border-comming-soon-colum-left"></div>
                    <div className="border-comming-soon-bottom"></div>
                </div>

                {/* Start Footer */}
                <footer>
                    <span className="ak-scrollup">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 10L1.7625 11.7625L8.75 4.7875V20H11.25V4.7875L18.225 11.775L20 10L10 0L0 10Z"
                                fill="currentColor" />
                        </svg>
                    </span>
                </footer>
                {/* End Footer */}
            </div>
        </div>
    )
}

export default NotFound;