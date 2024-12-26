import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProblemPage.css';

function ProblemPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [problemDescription, setProblemDescription] = useState('');

  useEffect(() => {
    const storedRoomId = localStorage.getItem('roomNumber');
    if (storedRoomId && storedRoomId !== roomId) {
      navigate(`/main/${storedRoomId}/problem`, { replace: true });
      return;
    }

    localStorage.setItem('roomNumber', roomId);

    // ... ostatak koda ...
  }, [t, roomId, navigate]);

  const navigateToMainPage = () => {
    navigate(`/main/${roomId}`);
  };

  const navigateToServicesPage = () => {
    navigate(`/main/${roomId}/services`);
  };

  const navigateToRestaurantPage = () => {
    navigate(`/main/${roomId}/restaurant`);
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('userEmail');

    console.log({ roomId, problemDescription, email });

    const response = await fetch('http://localhost:8888/api/submit_problem.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        soba_id: roomId,
        opis: problemDescription,
        status: t('inProgress'),
        korisnik_email: email,
      }),
    });

    if (response.ok) {
      alert(t('problemReported'));
      setProblemDescription('');
    } else {
      alert(t('problemReportError'));
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top w-100">
        <a className="navbar-brand ml-3" href="" onClick={navigateToMainPage}>Hotel Tour</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="" onClick={navigateToRestaurantPage}>{t('restaurant')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" onClick={navigateToServicesPage}>{t('services')}</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="image-container1">
        <div className="welcome-text">
          <h1>{t('problemPageTitle')}</h1>
          <p>{t('problemPageContent')}</p>
        </div>
      </div>

      {/* Forma za prijavu problema */}
      <div className="problem-form-container bg-dark text-white p-3 rounded shadow-sm mt-4">
        <h2 className="text-center mb-4 text-white">{t('reportProblem')}</h2>
        <p className="text-center text-white mb-4">{t('problemFormExplanation')}</p>
        <form onSubmit={handleProblemSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="problemDescription" className="form-label text-white">{t('problemDescription')}</label>
            <textarea
              id="problemDescription"
              className="form-control border-0 shadow-sm bg-secondary text-white"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              required
              style={{ minHeight: '150px' }}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm">{t('submitProblem')}</button>
        </form>
      </div>

      {/* Footer */}
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
    </div>
  );
}

export default ProblemPage;