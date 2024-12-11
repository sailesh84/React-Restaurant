import React, { useState } from "react";
import "../dashboard/Dashboard.scss";
import gsap from 'gsap-trial';
import "./Navigation.scss";
import { Link } from "react-router-dom";

const Navigation = () => {
    
    const [isActive, setActive] = useState(false);
    const toggleClass = () => {
        setActive(!isActive);
        gsap.to(".toogle", {
            duration: 1,
            rotate: isActive ? 180 : 360
        });
    };

    return (
        <div>
            <nav className={isActive ? 'sidebar' : 'sidebar close'} >
                <header>
                    <div className="image-text">
                        <span className="image">
                            <p>SA</p>
                        </span>

                        <div className="text header-text">
                            <h6>Welcome</h6>
                            <span className="profession">Sailesh Kr. Paul</span>
                        </div>
                    </div>

                    <Link to="#" onClick={toggleClass}>
                        <i className="bx bx-chevron-left toogle"></i>
                    </Link>
                </header>

                <div className="menu-bar">
                    <div className="menu">
                        <li className="search-box">
                            <i className="bx bx-search icon"></i>
                            <input type="search" placeholder="Search..." />
                        </li>
                        <ul className="menu-links">
                            <li className="nav-link">
                                <Link to="/admin/dashboard">
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/admin/food-menu">
                                    <i className="bx bx-dish icon"></i>
                                    <span className="text nav-text">Food Menu</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/admin/chefs">
                                    <i className="bx bx-user icon"></i>
                                    <span className="text nav-text">Chefs</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/admin/blogs">
                                    <i className='bx bxl-blogger icon'></i>
                                    <span className="text nav-text">Blogs</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Link to="/admin/reservations">
                                    <i className='bx bxs-book-content icon'></i>
                                    <span className="text nav-text">Reservations</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="bottom-content">
                        <li className="">
                            <a href="#">
                                <i className="bx bx-power-off icon"></i>
                                <span className="text nav-text">Logout</span>
                            </a>
                        </li>

                        {/* <li className="mode">
                            <div className="moon-sun">
                                <i className="bx bx-moon icon moon"></i>
                                <i className="bx bx-sun icon sun"></i>
                            </div>
                            <span className="mode-text text">Dark Mode</span>

                            <div className="toggle-switch">
                                <span className="switch"> </span>
                            </div>
                        </li> */}
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navigation;