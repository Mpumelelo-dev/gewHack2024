import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';



import CreateStokvelForm from './pages/CreateStokvelForm'; 
import logo from './logo.jpg'; 
import stokvelImage from './stokvel.png'; 
import { useState } from 'react';
import { AuthProvider } from './auth/AuthProvider'; // Custom AuthProvider for context
import PrivateRoute from './auth/PrivateRoute'; // Custom PrivateRoute component
import JoinStokvelForm from './pages/JoinStokvelForm';
import ManageStokvel from './pages/stokvelManage';
import StokvelDirectory from './pages/StokvelDirectory';
import Profile from './pages/profile';
import FinancialLiteracyPage from './pages/FinancialLiteracyPage';
import PaymentPage from './pages/PaymentPage';
import translated from './translated';
function App_mod() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/join-stokvel" element={<PrivateRoute><JoinStokvelForm /></PrivateRoute>} />
           <Route path="/setup-stokvel" element={<PrivateRoute><CreateStokvelForm /></PrivateRoute>} />
           <Route path="/manage-stokvel" element={<PrivateRoute><ManageStokvel /></PrivateRoute>} />
           <Route path="/stokvel-directory" element={<PrivateRoute><StokvelDirectory /></PrivateRoute>} />
           <Route path="/profile-settings" element={<PrivateRoute><Profile /></PrivateRoute>} />
           <Route path="/financial-literacy" element={<PrivateRoute><FinancialLiteracyPage /></PrivateRoute>} />
           <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
           <Route path="/" element={<PrivateRoute><translated /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function NavBar() {
  const location = useLocation();

 
}

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="home-page">
      <section className="header">
      <section className="navbar">
      
      
      
      <Link to="/">
      <img src={logo} alt="ZakaConnect Logo" className="logo" />
              </Link>    
      
        
         <ul className="nav-links">
         <li><Link to="/login" className="cta-button">Login</Link></li>
         <li><Link to="/register" className="cta-button">Register</Link></li>
         
       </ul>
      
    </section>
        <img src={stokvelImage} alt="Stokvel" className="header-image" />
        <h1>Savvy Savings, Kasi Style!</h1>
        <p>Empowering communities through collective savings and smart financial practices.</p>
        <p>Join your local stokvel, make those dreams happen – ZakaConnect got your back!</p>
        
        <a><Link to="/register" className="cta-button">Join Now</Link></a>
      </section>
      <section className="about-container">
        <h2>About ZakaConnect</h2>
        <p>
          At ZakaConnect, we’re on a mission to empower communities by transforming the way stokvels operate.
          Rooted in the spirit of collective growth, our platform makes managing savings groups easier, smarter,
          and more accessible. We believe in turning everyday savings into opportunities for business growth,
          financial freedom, and knowledge sharing. Join us in revolutionizing the future of savings, because
          together, we can achieve more.
        </p>
        <br></br>
        <button onClick={toggleDropdown} className="dropdown-button">Services</button>
        {isOpen && (
          <ul className="dropdown-content">
            <li> <p><b>Money Stokvels: </b>focus on pooling funds for periodic payouts to members, with options for investment and reinvestment in small businesses.</p></li>
            <li><p><b>Grocery Stokvels:</b> focus on saving for a year-end bulk purchase of food or household items, ideal for shared group benefits in December.</p></li>
            <li><p><b>Find Stokvels:</b> find an active stokvel to join, based on location or specific financial goals.</p></li>
            <li><p><b>Financial Literacy:</b> A dedicated section offering educational content, workshops, and video modules covering topics like budgeting, investment, and group finance management.</p></li>
          </ul>
        )}
        <p>For inquiries, reach us at: <b>contact@ZakaConnect.com</b> </p>
      </section>
     
      <section id="financial-literacy">
        <div className="financial-literacy-content">
          <h2>Financial Literacy: Empowering Your Future</h2>
          <p>
            Stokvels are more than just savings groups; they represent an opportunity to build wealth,
            learn smart financial practices, and support each other. Understanding how to maximize your
            savings, invest wisely, and manage risks can open doors to future prosperity.
          </p>
          <a href="https://www.africandecisions.com/finance/right-money/" target="_blank" rel="noopener noreferrer">
        <button className="btn-join">Read More</button></a>
        </div>
      </section>
      <footer className="footer">
      <div className="social-icons">
            <p>Follow us:</p>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12.073c0 5.746-4.476 10.22-10.222 10.222-5.746 0-10.222-4.476-10.222-10.222 0-5.747 4.476-10.222 10.222-10.222 5.746 0 10.222 4.475 10.222 10.222z" fill="#3b5998" />
                <path d="M15.118 12.801h-2.083v9.096h-3.001v-9.096h-2.167v-3.314h2.167v-2.536c0-2.064 1.023-3.232 2.777-3.232 1.583 0 3.075.196 3.337.241v3.099h-2.185c-1.231 0-1.525.464-1.525 1.442v2.438h3.046l-.416 3.314z" fill="#fff" />
              </svg>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.8 2c-.71 0-1.44.11-2.16.31-.81.24-1.53.6-2.15 1.03-.61.44-1.14.98-1.57 1.58-.43.61-.78 1.34-1.03 2.15-.21.73-.31 1.45-.31 2.16v6c0 .71.1 1.44.31 2.16.25.81.6 1.53 1.03 2.15.43.6.96 1.14 1.57 1.58.62.43 1.34.78 2.15 1.03.72.2 1.44.31 2.16.31h6c.72 0 1.44-.11 2.16-.31.81-.24 1.53-.6 2.15-1.03.61-.44 1.14-.98 1.57-1.58.43-.62.78-1.34 1.03-2.15.21-.72.31-1.45.31-2.16v-6c0-.71-.1-1.44-.31-2.16-.25-.81-.6-1.53-1.03-2.15-.43-.6-.96-1.14-1.57-1.58-.62-.43-1.34-.78-2.15-1.03-.72-.2-1.44-.31-2.16-.31h-6zM12 8.75a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5zm0 5.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5zm6.5-7.25c.13 0 .25.04.36.13.1.1.17.23.17.36 0 .13-.07.26-.17.36-.1.1-.23.17-.36.17-.13 0-.26-.07-.36-.17-.1-.1-.17-.23-.17-.36 0-.13.07-.26.17-.36.1-.09.23-.13.36-.13z" fill="#e4405f" />
              </svg>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.45 0h-14.9c-1.23 0-2.25 1.02-2.25 2.25v19.5c0 1.23 1.02 2.25 2.25 2.25h14.9c1.23 0 2.25-1.02 2.25-2.25v-19.5c0-1.23-1.02-2.25-2.25-2.25zm-12.92 18.75h-2.92v-9.34h2.92v9.34zm-1.46-10.66c-.94 0-1.71-.77-1.71-1.71 0-.94.77-1.71 1.71-1.71 1.11 0 1.71.77 1.71 1.71 0 .94-.6 1.71-1.71 1.71zm12.56 10.66h-2.91v-4.6c0-1.1-.02-2.51-1.52-2.51-1.53 0-1.77 1.2-1.77 2.44v4.67h-2.91v-9.34h2.79v1.27h.04c.38-.71 1.31-1.47 2.71-1.47 2.91 0 3.44 1.91 3.44 4.38v5.18z" fill="#0e76a8" />
              </svg>
            </a></div>
        <p>© 2024 ZakaConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App_mod;