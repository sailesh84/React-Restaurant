import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/protected/home/Home';
import About from './components/protected/about/About';
import Menu from './components/protected/menu/Menu';
import Chefs from './components/protected/chefs/Chefs';
import Portfolio from './components/protected/portfolio/Portfolio';
import Blogs from './components/protected/blogs/Blogs';
import Reservation from './components/protected/reservations/Reservations';
import MeetTheChef from './components/protected/meet-the-chef/MeetTheChef';
import PortfolioDetails from './components/protected/portfolio-details/PortfolioDetails';
import BlogDetails from './components/protected/blog-details/BlogDetails';
import NotFound from './components/protected/not-found/NotFound';
import Test from './components/public/test/Test';
import Dashboard from './components/admin/dashboard/Dashboard';
import BlogsMaster from './components/admin/blogs/BlogsMaster';
import ChefsMaster from './components/admin/chefs/ChefsMaster';
import FoodMenuMaster from './components/admin/food-menu/FoodMenuMaster';
import Login from './components/admin/login/Login';
import SignUp from './components/admin/signup/SignUp';
import ReservationsLists from './components/admin/reservations/ReservationsLists';


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="about" exact element={<About />} />
          <Route path="menu" exact element={<Menu />} />
          <Route path="chefs" exact element={<Chefs />} />
          <Route path="chefs/:chefId" exact element={<MeetTheChef />} />
          <Route path="portfolio" exact element={<Portfolio />} />
          <Route path="portfolio/:portfolioId" exact element={<PortfolioDetails />} />
          <Route path="blogs" exact element={<Blogs />} />
          <Route path="blogs/:blogId" exact element={<BlogDetails />} />
          <Route path="reservation" exact element={<Reservation />} />
          <Route path="admin/dashboard" exact element={<Dashboard />} />
          <Route path="admin/blogs" exact element={<BlogsMaster />} />
          <Route path="admin/chefs" exact element={<ChefsMaster />} />
          <Route path="admin/food-menu" exact element={<FoodMenuMaster />} />
          <Route path="admin/login" exact element={<Login />} />
          <Route path="admin/signup" exact element={<SignUp />} />
          <Route path="admin/reservations" exact element={<ReservationsLists />} />
          <Route path="test" exact element={<Test />} />
          <Route path="*" exact element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}