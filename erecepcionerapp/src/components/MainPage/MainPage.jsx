import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainPage.css'; // Proverite putanje do CSS fajlova
import cardImage1 from '../../assets/slike/restoran.jpg';
import cardImage2 from '../../assets/slike/usluge.jpg';
import cardImage3 from '../../assets/slike/problem.jpg';
import ProblemPage from '../ProblemPage/ProblemPage';
import ServicesPage from '../ServicesPage/ServicesPage';
import RestaurantPage from '../RestaurantPage/RestaurantPage';

function MainPage({ onLogout }) {
  const { room } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const storedRoom = localStorage.getItem('roomNumber');
    if (storedRoom && storedRoom !== room) {
      navigate(`/main/${storedRoom}`, { replace: true });
      return;
    }

    localStorage.setItem('roomNumber', room);

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    // Fetch user info
    const fetchUserInfo = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error('Email is missing in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8888/api/get_user_info.php?email=${email}`);
      const data = await response.json();
      console.log(data);
      setUserInfo(data);
    };

    if (!userInfo && localStorage.getItem('userEmail')) { // Proveri da li je korisnik ulogovan
      fetchUserInfo();
    }
  }, [room, i18n, navigate, userInfo]);

  const handleLogout = () => {
    console.log("Logging out...");
    onLogout();
    localStorage.removeItem('userEmail');
    if (modalRef.current) {
      modalRef.current.click(); // Zatvori modal
    }
    console.log("Navigating to login...");
    navigate(`/login?room=${room}`, { replace: true });
    window.location.reload(); // Osveži stranicu
  };



  return (
    <div className="main-page-body">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top w-100">
        <a className="navbar-brand ml-3" href="">Hotel Tour</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="" onClick={() => navigate(`/main/${room}/restaurant`)}>{t('restaurant')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" onClick={() => navigate(`/main/${room}/services`)}>{t('services')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" onClick={() => navigate(`/main/${room}/problem`)}>{t('problem')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" data-toggle="modal" data-target="#profileModal">
                <i className="fas fa-user"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="image-container">
        <div className="welcome-text">
          <h1>{t('greeting')} {userInfo && `${userInfo.ime} ${userInfo.prezime}`}</h1>
          <p>{t('mainPageDescription')}</p>
          {room && <p>{t('roomNumber')}: {room}</p>}
        </div>
      </div>
      <div className="cards-container container mt-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card h-100 bg-dark text-white">
              <img src={cardImage1} className="card-img-top card-img-custom" alt="Card image cap" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{t('cardTitle1')}</h5>
                <p className="card-text">{t('cardText1')}</p>
                <a href="" className="btn btn-primary mt-auto" onClick={() => navigate(`/main/${room}/restaurant`)}>{t('visitButton')}</a>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 bg-dark text-white">
              <img src={cardImage2} className="card-img-top card-img-custom" alt="Card image cap" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{t('cardTitle2')}</h5>
                <p className="card-text">{t('cardText2')}</p>
                <a href="" className="btn btn-primary mt-auto" onClick={() => navigate(`/main/${room}/services`)}>{t('visitButton')}</a>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 bg-dark text-white">
              <img src={cardImage3} className="card-img-top card-img-custom" alt="Card image cap" />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{t('cardTitle3')}</h5>
                <p className="card-text">{t('cardText3')}</p>
                <a href="" className="btn btn-primary mt-auto" onClick={() => navigate(`/main/${room}/problem`)}>{t('visitButton')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Routes>
        <Route path="problem" element={<ProblemPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="restaurant" element={<RestaurantPage />} />
      </Routes>
      <br /><br />
      <footer className="footer mt-auto py-3 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5>{t('contactUs')}</h5>
              <p>1234 Street Name<br />City, AA 99999<br />Email: info@hotel.com<br />Phone: (123) 456-7890</p>
            </div>
            <div className="col-md-4">
              <h5>{t('quickLinks')}</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white">{t('home')}</a></li>
                <li><a href="#" className="text-white">{t('about')}</a></li>
                <li><a href="#" className="text-white">{t('services')}</a></li>
                <li><a href="#" className="text-white">{t('contact')}</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5>{t('followUs')}</h5>
              <div className="social-icons">
                <a href="#" className="text-white mx-2"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-white mx-2"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white mx-2"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-white mx-2"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col text-center">
              <span>&copy; 2023 Hotel Tour. {t('allRightsReserved')}</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="modal fade" id="profileModal" tabIndex="-1" role="dialog" aria-labelledby="profileModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-dark">
            <div className="modal-header">
              <h5 className="modal-title" id="profileModalLabel">{t('userProfile')}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={modalRef}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {userInfo ? (
                <div>
                  <p><strong>{t('name')}: </strong>{userInfo.ime} {userInfo.prezime}</p>
                  <p><strong>{t('email')}: </strong>{userInfo.email}</p>
                  <p><strong>{t('totalSpend')}: </strong>{userInfo.ukupna_potrosnja}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">{t('close')}</button>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>{t('logout')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;