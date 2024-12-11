import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import "./Test.scss";
// import Header from "../header/Header";
// import { Link } from "react-router-dom";

const Test = () => {

    // useGSAP(() => {
    //     gsap.to(".box", {
    //         rotate: 360,
    //         scale: 0,
    //         duration: 1,
    //         opacity: 0,
    //         delay: 0.5
    //     });
    // });


    return (
        <main className="container">
            {/* <Header /> */}
            <div className="main">
                <div className="circle"></div>
                <div className="box"></div>
            </div>
        </main>
    )
}

export default Test;