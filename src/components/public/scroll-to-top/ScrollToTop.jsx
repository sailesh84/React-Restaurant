import React, { useEffect, useState } from "react";
import "./ScrollToTop.scss";

const ScrollToTop = () => {

    const [isVisible, setIsVisible] = useState(false);
    const listenToScroll = () => {
        const scroll = document.body.scrollTop || document.documentElement.scrollTop;
        console.log(scroll);

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
            <div className="loading-overlap"></div>

            {isVisible && (
                <span className="ak-scrollup ak-scrollup-show" onClick={goToTop}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 10L1.7625 11.7625L8.75 4.7875V20H11.25V4.7875L18.225 11.775L20 10L10 0L0 10Z"
                            fill="currentColor" />
                    </svg>
                </span>
            )}
        </div>
    )
}

export default ScrollToTop;