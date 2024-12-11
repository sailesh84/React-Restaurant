import React from 'react';
import "./Header.scss";
import { Link } from "react-router-dom";
import logo from '../../../assets/images/logo.png' // relative path to image 
import { Avatar } from 'primereact/avatar';
import { useGSAP } from '@gsap/react';
import gsap from "gsap";


const Header = () => {
    return (
        <div>
            <header className="ak-site_header ak-style1 ak-sticky_header ak-site_header_full_width">
                <div className="header-top">
                    <div className="wrapper">
                        <div className="header-logo">
                            <Link to="/reservation" className="logo">Reservation</Link>
                            {/* <a href="reservations.html" className="logo">Reservation</a> */}
                        </div>
                        <div className="center-log">
                            <Link to="/"><img src={logo} alt="..." /></Link>
                            {/* <a href="index.html">
                                <img src={logo} alt="..." />
                            </a> */}
                        </div>
                        {/* <button className="ak-menu-toggle" id="akMenuToggle" type="button">
                            <svg viewBox="0 0 20 15" width="40px" height="30px" className="ak-menu-icon">
                                <path d="M20,2 L2,2" className="bar-1"></path>
                                <path d="M2,7 L20,7" className="bar-2"></path>
                                <path d="M30,12 L2,12" className="bar-3"></path>
                            </svg>
                        </button> */}

                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="xlarge" shape="circle" />

                        {/* <Link to="#" className="nav-link large">
                            <i class='bx bxs-user-circle'></i>
                        </Link> */}
                    </div>
                </div>
                <div className="nav-bar-border"></div>
                <div className="ak-main_header">
                    <div className="container">
                        <div className="ak-main_header_in">
                            <div className="ak-main_header_left">
                                <Link to="/" className="ak-site_branding"><img src={logo} alt="..." /></Link>
                                {/* <a className="ak-site_branding" href="index.html">
                                    <img src={logo} alt="..." />
                                </a> */}
                            </div>
                            <div className="ak-main_header_right">
                                <div className="ak-nav ak-medium">
                                    <ul className="ak-nav_list">
                                        <li>
                                            <Link to="/" className="link">Home</Link>
                                        </li>
                                        <li>
                                            <Link to="/about" className="link">About</Link>
                                        </li>
                                        <li>
                                            <Link to="/menu">Menu</Link>
                                        </li>
                                        <li>
                                            <Link to="/chefs">Chef</Link>
                                        </li>
                                        <li>
                                            <Link to="/portfolio">Portfolio</Link>
                                        </li>
                                        <li>
                                            <Link to="/blogs">Blog</Link>
                                        </li>
                                        <li>
                                            <Link to="/reservation">Reservations</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header;