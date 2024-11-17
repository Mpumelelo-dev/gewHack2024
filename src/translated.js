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
import { AuthProvider } from './auth/AuthProvider'; // Umnikezeli we-Auth owenziwe ngokwezifiso kwimeko
import PrivateRoute from './auth/PrivateRoute'; // I-PrivateRoute eyenziwe ngokwezifiso
import JoinStokvelForm from './pages/JoinStokvelForm';
import ManageStokvel from './pages/stokvelManage';
import StokvelDirectory from './pages/StokvelDirectory';
import Profile from './pages/profile';
import FinancialLiteracyPage from './pages/FinancialLiteracyPage';
import PaymentPage from './pages/PaymentPage';

function App_mod() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/create-stokvel" element={<PrivateRoute><CreateStokvelForm /></PrivateRoute>} />
          <Route path="/join-stokvel" element={<PrivateRoute><JoinStokvelForm /></PrivateRoute>} />
          <Route path="/manage-stokvel" element={<PrivateRoute><ManageStokvel /></PrivateRoute>} />
          <Route path="/directory" element={<PrivateRoute><StokvelDirectory /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/financial-literacy" element={<PrivateRoute><FinancialLiteracyPage /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function NavBar() {
  const location = useLocation();
  // I-Navigation Bar
}

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <header>
        <img src={logo} alt="ZakaConnect Logo" />
        <nav>
          <ul>
            <li><Link to="/login">Ngena</Link></li>
            <li><Link to="/register">Bhalisa</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>Ugcino oluhlakaniphileyo, Isitayela seKasi!</h1>
          <p>Ukomeleza uluntu ngokugcinwa kwemali ngokudibeneyo kunye neendlela ezihlakaniphileyo zemali.</p>
          <button><Link to="/register">Joyina ngoku</Link></button>
        </section>
        <section className="about">
          <h2>Malunga neZakaConnect</h2>
          <p>KwiZakaConnect, sinenjongo yokomeleza uluntu ngokuguqula indlela ezisebenza ngayo i-stokvels. Sisebenza ngokukhula ngokudibeneyo, iqonga lethu lenza ukuba ulawulo lwamaqela okugcinwa kwemali lube lula, luhlakaniphile, kwaye lufikeleleke. Sikholelwa ekuguquleni ugcino lwemihla ngemihla lube ngamathuba okukhula kwamashishini, inkululeko yezemali, kunye nokwabelana ngolwazi. Joyina kuthi ekuguquleni ikamva logcino, kuba kunye, sinokufezekisa okungakumbi.</p>
        </section>
        <section className="services">
          <h2>Iinkonzo</h2>
          {isOpen && (
            <ul>
              <li>Imali Stokvels: igxile ekuhlanganiseni imali ukuze kuhlawulwe amalungu ngamaxesha athile, kunye nokukhetha ukutyala kunye nokuphinda utyale kumashishini amancinci.</li>
              <li>Grocery Stokvels: igxile ekugcineni imali yokuthenga izinto zokutya okanye izinto zasekhaya ekupheleni konyaka, ilungele izibonelelo zamaqela ekupheleni kukaDisemba.</li>
              <li>Fumana iStokvels: fumana i-stokvel esebenzayo yokungena kuyo, ngokusekelwe kwindawo okanye iinjongo ezithile zemali.</li>
              <li>Ukwazi ngemali: Icandelo elizinikeleyo elinikezela ngomxholo wemfundo, iindibano zocweyo, kunye neemodyuli zevidiyo ezibandakanya izihloko ezifana nokwenza uhlahlo-lwabiwo mali, utyalo-mali, kunye nolawulo lwezemali lwamaqela.</li>
            </ul>
          )}
          <p>Ukuba unemibuzo, sinxibelelane: contact@ZakaConnect.com</p>
        </section>
        <section className="financial-literacy">
          <h2>Ukwazi ngemali: Ukomeleza Ikamva Lakho</h2>
          <p>I-Stokvels ayingomagqabantshintshi nje kuphela; zibalulekile ekwakheni ubutyebi, ukufunda iindlela ezihlakaniphileyo zemali, kunye nokuxhasa omnye nomnye. Ukuqonda indlela yokwandisa ugcino lwakho, utyale imali ngokuhlakanipha, kunye nokulawula imingcipheko kunokuvula iingcango zempumelelo yekamva.</p>
          <button><Link to="/financial-literacy">Funda Okungakumbi</Link></button>
        </section>
      </main>
      <footer>
        <p>Landela thina:</p>
        <ul>
          <li><a href="https://facebook.com">Facebook</a></li>
          <li><a href="https://twitter.com">Twitter</a></li>
          <li><a href="https://instagram.com">Instagram</a></li>
        </ul>
        <p>© 2024 ZakaConnect. Onke amalungelo agciniwe.</p>
      </footer>
    </div>
  );
}

export default App_mod;