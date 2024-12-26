import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ServicesPage.css';

function ServicesPage() {
  const { t, i18n } = useTranslation(); // Dodali i18n za pristup jeziku
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    datum: '',
    vreme: '',
    napomene: ''
  });

  useEffect(() => {
    const storedRoomId = localStorage.getItem('roomNumber');
    if (storedRoomId && storedRoomId !== roomId) {
      navigate(`/main/${storedRoomId}/services`, { replace: true });
      return;
    }

    localStorage.setItem('roomNumber', roomId);

    const fetchUserInfo = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        console.error(t('emailMissing'));
        return;
      }
      const response = await fetch(`http://localhost:8888/api/get_user_info.php?email=${email}`);
      const data = await response.json();
      setUserInfo(data);
    };
  
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/get_services.php');
        const text = await response.text();
        console.log('Raw response:', text); // Dodaj log za sirovi odgovor
  
        try {
          const data = JSON.parse(text);
          if (data.error) {
            console.error('API error:', data.error);
            alert(t('apiError', { error: data.error }));
          } else {
            console.log('Fetched services:', data); // Dodaj log za proveru podataka
            // Prilagodimo podatke prema jeziku
            const adjustedData = data.map(service => ({
              ...service,
              naziv: i18n.language === 'en' ? service.naziv_en : service.naziv, // Prikazujemo naziv na engleskom ako je izabran engleski
              opis: i18n.language === 'en' ? service.opis_en : service.opis, // Prikazujemo opis na engleskom ako je izabran engleski
              slika_url: service.slika_url // Dodali slika_url
            }));
            setServices(adjustedData);
          }
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    fetchUserInfo();
    fetchServices();
  }, [t, roomId, navigate, i18n.language]); // Dodali i18n.language kao zavisnost

  const handleOrderSubmit = async () => {
    if (!orderDetails.datum || !orderDetails.vreme) {
      alert(t('dateAndTimeRequired'));
      return;
    }

    const email = localStorage.getItem('userEmail');
    const orderData = {
      soba_id: roomId,
      usluga_id: selectedService.id,
      datum: orderDetails.datum,
      vreme: orderDetails.vreme,
      napomene: orderDetails.napomene,
      email_korisnika: email,
      cena_usluge: selectedService.cena // Dodato polje za cenu usluge
    };

    console.log('Order Data:', orderData); // Dodaj log za proveru podataka

    try {
      const response = await fetch('http://localhost:8888/api/create_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log('Response:', result); // Dodaj log za proveru odgovora

      if (response.ok) {
        alert(t('orderCreated'));
        setOrderDetails({ datum: '', vreme: '', napomene: '' });
        setSelectedService(null);
      } else {
        alert(t('orderCreationError'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t('orderCreationError'));
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top w-100">
        <a className="navbar-brand ml-3" href="" onClick={() => navigate(`/main/${roomId}`)}>Hotel Tour</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="" onClick={() => navigate(`/main/${roomId}/restaurant`)}>{t('restaurant')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" onClick={() => navigate(`/main/${roomId}/problem`)}>{t('problem')}</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="image-container2">
        <div className="welcome-text">
          <h1>{t('servicesPageTitle')}</h1>
          <p>{t('servicesPageContent')}</p>
        </div>
      </div>

      <div className="services-container">
        <h2 className="text-center mb-4 text-white">{t('ourServices')}</h2>
        <p className="text-center text-white mb-4">{t('servicesDescription')}</p>
        <div className="row">
          {Array.isArray(services) && services.length > 0 ? (
            services.map(service => (
              <div className="col-md-4 mb-4" key={service.id}>
                <div className="card h-100 service-card">
                  <img src={service.slika_url} alt={service.naziv} className="card-img-top" /> {/* Dodali sliku */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{service.naziv}</h5>
                    <p className="card-text">{t('price')}: {service.cena} din</p>
                    <button className="btn btn-primary mt-auto" onClick={() => setSelectedService(service)}>{t('order')}</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-white">{t('noServicesAvailable')}</p>
          )}
        </div>
      </div>

      {selectedService && (
        <div className="modal show custom-modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedService.naziv}</h5>
                <button type="button" className="close" onClick={() => setSelectedService(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{selectedService.opis}</p>
                <p>{t('price')}: {selectedService.cena} din</p>
                <div className="form-group">
                  <label>{t('date')}</label>
                  <input type="date" className="form-control" value={orderDetails.datum} onChange={(e) => setOrderDetails({ ...orderDetails, datum: e.target.value })} required />
                  <small className="form-text text-light">{t('dateExplanation')}</small>
                </div>
                <div className="form-group">
                  <label>{t('time')}</label>
                  <input type="time" className="form-control" value={orderDetails.vreme} onChange={(e) => setOrderDetails({ ...orderDetails, vreme: e.target.value })} required />
                  <small className="form-text text-light">{t('timeExplanation')}</small>
                </div>
                <div className="form-group">
                  <label>{t('note')}</label>
                  <textarea className="form-control" value={orderDetails.napomene} onChange={(e) => setOrderDetails({ ...orderDetails, napomene: e.target.value })}></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedService(null)}>{t('close')}</button>
                <button type="button" className="btn btn-primary" onClick={handleOrderSubmit}>{t('submitOrder')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default ServicesPage;