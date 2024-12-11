import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import gsap from 'gsap-trial';
import { Link } from "react-router-dom";
import "../dashboard/Dashboard.scss";
import "./ReservationsLists.scss";
// import { CustomerService } from "../../../services/CustomerServices";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { FoodMenuServices } from '../../../services/FoodMenuServices';
import { Tooltip } from 'primereact/tooltip';
import { Avatar } from 'primereact/avatar';


const ReservationsLists = () => {
    //Sidebar Hooks
    const [isActive, setActive] = useState(false);
    const toggleClass = () => {
        setActive(!isActive);
        gsap.to(".toogle", {
            duration: 1,
            rotate: isActive ? 180 : 360
        });
    };

    const [menus, setMenus] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [customers, setCustomers] = useState([]);
    // const [rowClick, setRowClick] = useState(true);
    // const [selectedReservations, setSelectedReservations] = useState(null);
    const [selectedMenus, setSelectedMenus] = useState(null);
    const toast = useRef(null);

    const onRowSelect = (event) => {
        toast.current.show({ severity: 'info', summary: 'Food Selected', detail: `Name: ${event.data.item_name}`, life: 3000 });
    };

    const onRowUnselect = (event) => {
        toast.current.show({ severity: 'warn', summary: 'Food Unselected', detail: `Name: ${event.data.item_name}`, life: 3000 });
    };

    useEffect(() => {
        // CustomerService.getCustomersMedium().then((data) => setCustomers(data));
        FoodMenuServices.getFoodMenuLarge().then((data) => setMenus(data));
    }, []);

    useEffect(() => {
        // CustomerService.getCustomersMedium().then((data) => {
        //     setCustomers(getCustomers(data));
        //     setLoading(false);
        // });
        FoodMenuServices.getFoodMenuLarge().then((data) => {
            setMenus(getMenus(data));
            setLoading(false);
        })
        initFilters();
    }, []);

    const animate = (event) => {
        // console.log(event);
    }

    // const getCustomers = (data) => {
    //     return [...(data || [])].map((d) => {
    //         d.date = new Date(d.date);
    //         return d;
    //     });
    // };

    const getMenus = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        console.log(_filters);
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            item_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            offers: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="bx bx-filter-alt" label="Clear" outlined onClick={clearFilter} />
                <IconField iconPosition="left">
                    <InputIcon className="bx bx-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };

    const header = renderHeader();
    return (
        <div>
            <Toast ref={toast} />
            {/* Top navigation  */}
            <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div className="container-fluid">
                    <Link to="/admin/dashboard" className="navbar-brand">
                        <h5>RESERVATION</h5>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse float-end" id="navbarCollapse">
                        <ul className="navbar-nav ms-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link to="#" className="nav-link small">
                                    <i class='bx bx-bell'></i>
                                    <span className="text nav-text">Notifications</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link small">
                                    <i class='bx bx-cog '></i>
                                    <span className="text nav-text">Settings</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link small">
                                    <i class='bx bx-help-circle'></i>
                                    <span className="text nav-text">Support</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Side navigation */}
            <nav className={isActive ? 'sidebar' : 'sidebar close'} >
                <header>
                    <div style={isActive ? {} : { height: '60px' }} >
                        {/* <span className="image">
                            <p>SA</p>
                        </span> */}
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" size="xlarge" shape="circle" />

                        {/* <div className="text header-text">
                            <h6>Welcome</h6>
                            <span className="profession">Sailesh Kr. Paul</span>
                        </div> */}
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
                                <Tooltip target=".bx-home-alt-link" content="Dashboard" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/dashboard" className="bx-home-alt-link"
                                    onMouseEnter={animate} >
                                    <i className="bx bx-home-alt icon"></i>
                                    <span className="text nav-text">Dashboard</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bx-dish-link" content="Food Menu" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/food-menu" className="bx-dish-link"
                                    onMouseEnter={animate}>
                                    <i className="bx bx-dish icon"></i>
                                    <span className="text nav-text">Food Menu</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bx-user-link" content="Chefs" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/chefs" className="bx-user-link"
                                    onMouseEnter={animate}>
                                    <i className="bx bx-user icon"></i>
                                    <span className="text nav-text">Chefs</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bxl-blogger-link" content="Blogs" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/blogs" className="bxl-blogger-link"
                                    onMouseEnter={animate}>
                                    <i className='bx bxl-blogger icon'></i>
                                    <span className="text nav-text">Blogs</span>
                                </Link>
                            </li>
                            <li className="nav-link">
                                <Tooltip target=".bxs-book-content-link" content="Reservations" position="right"
                                    style={isActive ? { display: 'none' } : { display: 'block' }} />
                                <Link to="/admin/reservations" className="bxs-book-content-link"
                                    onMouseEnter={animate}>
                                    <i className='bx bxs-book-content icon'></i>
                                    <span className="text nav-text">Reservations</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="bottom-content">
                        <li className="">
                            <Link to="#">
                                <i className="bx bx-power-off icon"></i>
                                <span className="text nav-text">Logout</span>
                            </Link>
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

            {/* Container */}
            <section className="home">
                <div className="container-fluid px-0">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="mb-3">List of Food Menus</h4>
                            <DataTable className="table table-dark" value={menus} stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50, 75]}
                                header={header} filters={filters} globalFilterFields={['item_name', 'category', 'price', 'offers']}
                                emptyMessage="No records found." onFilter={(e) => setFilters(e.filters)}
                                selectionMode="single"
                                selection={selectedMenus}
                                onSelectionChange={(e) => setSelectedMenus(e.value)}
                                onRowSelect={onRowSelect}
                                onRowUnselect={onRowUnselect}
                                metaKeySelection={false}
                                dataKey="id" tableStyle={{ minWidth: '50rem' }}>
                                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
                                <Column field="item_name" header="Item Name" sortable style={{ width: '25%' }} ></Column>
                                <Column field="category" header="Category" sortable style={{ width: '25%' }}></Column>
                                <Column field="price" header="Price" sortable style={{ width: '25%' }}></Column>
                                <Column field="offers" header="Offers" sortable style={{ width: '25%' }}></Column>
                            </DataTable>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="py-3 my-4">
                        <hr className="my-4" />
                        <p className="text-center text-muted">Copyright © 2024. All Rights Reserved</p>
                    </footer>
                </div>
            </section>
        </div>
    )
}

export default ReservationsLists;