import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Accordion, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RestaurantPage.css';

function RestaurantPage() {
  const { t, i18n } = useTranslation(); // Dodajemo i18n za pristup jeziku
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState({});
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCartModal, setShowCartModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [note, setNote] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const storedRoomId = localStorage.getItem('roomNumber');
    if (storedRoomId && storedRoomId !== roomId) {
      navigate(`/main/${storedRoomId}/restaurant`, { replace: true });
      return;
    }

    localStorage.setItem('roomNumber', roomId);

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/get_categories.php');
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        // Prilagodimo podatke prema jeziku
        const adjustedData = data.map(category => ({
          id: category.id,
          naziv: i18n.language === 'en' ? category.naziv_en : category.naziv // Prikazujemo naziv na engleskom ako je izabran engleski
        }));
        setCategories(adjustedData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [roomId, navigate]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchItems = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8888/api/get_items.php?category_id=${categoryId}`);
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      // Prilagodimo podatke prema jeziku
      const adjustedData = data.map(item => ({
        id: item.id,
        cena: item.cena,
        slika_url: item.slika_url,
        naziv: i18n.language === 'en' ? item.naziv_en : item.naziv, // Prikazujemo naziv na engleskom ako je izabran engleski
        opis: i18n.language === 'en' ? item.opis_en : item.opis // Prikazujemo opis na engleskom ako je izabran engleski
      }));
      setItems(prevItems => ({ ...prevItems, [categoryId]: adjustedData }));
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
        );
      } else {
        return [...prevCart, item];
      }
    });
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500); // Reset animation state after 0.5s
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const updatedCart = [...prevCart];
        if (updatedCart[itemIndex].quantity > 1) {
          updatedCart[itemIndex] = {
            ...updatedCart[itemIndex],
            quantity: updatedCart[itemIndex].quantity - 1
          };
        } else {
          updatedCart.splice(itemIndex, 1);
        }
        return updatedCart;
      }
      return prevCart;
    });
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.cena * item.quantity, 0);
  };

  const handleShowCartModal = (event) => {
    event.preventDefault();
    setShowCartModal(true);
  };

  const handleCloseCartModal = () => setShowCartModal(false);

  const handleShowConfirmModal = () => setShowConfirmModal(true);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleOrderClick = (item) => {
    setSelectedItem(item);
    setQuantity(1); // Reset quantity to 1
  };

  const handleAddToCart = () => {
    addToCart({ ...selectedItem, quantity });
    setSelectedItem(null); // Close modal
  };

  const handleCancelOrder = () => {
    setSelectedItem(null); // Close modal
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    setQuantity(value === '0' ? '' : Number(value));
  };

  const submitOrder = async () => {
    const email = localStorage.getItem('userEmail');
    const totalPrice = calculateTotalPrice(); // Dodajemo ukupnu cenu

    const orderData = {
      soba_id: roomId,
      napomene: note || '', // Ensure napomene is a string
      korisnik_email: email,
      ukupna_cena: totalPrice, // Dodajemo ukupnu cenu u orderData
      stavke: cart.map(item => ({
        artikal_id: item.id,
        kolicina: item.quantity
      }))
    };
    console.log('Order Data:', orderData); // Logovanje JSON podataka

    try {
      const response = await fetch('http://localhost:8888/api/submit_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log('Response:', result); // Logovanje odgovora
      if (result.message.includes('success')) {
        alert(t('orderCreated'));
        setCart([]); // Clear the cart after successful order
        setNote(''); // Clear the note
        handleCloseConfirmModal();
        handleCloseCartModal();
      } else {
        alert(`${t('orderCreationError')}: ${result.message}`);
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
              <a className="nav-link" href="" onClick={() => navigate(`/main/${roomId}/services`)}>{t('services')}</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="" onClick={() => navigate(`/main/${roomId}/problem`)}>{t('problem')}</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="image-container4">
        <div className="welcome-text">
          <h1>{t('restaurantPageTitle')}</h1>
          <p>{t('restaurantPageContent')}</p>
        </div>
      </div>

      <div className="restaurant-container bg-dark text-white p-3 rounded shadow-sm mt-4">
        <h2 className="text-center mb-4 text-white">{t('ourRestaurant')}</h2>
        <p className="text-center text-white mb-4">{t('restaurantDescription')}</p>
        <Accordion>
          {categories.map(category => (
            <Accordion.Item eventKey={category.id} key={category.id}>
              <Accordion.Header onClick={() => fetchItems(category.id)}>
                {category.naziv}
              </Accordion.Header>
              <Accordion.Body>
                {items[category.id] && items[category.id].map(item => (
                  <div key={item.id} className="item-card bg-secondary text-white p-3 mb-3 rounded">
                    <h5>{item.naziv}</h5>
                    <p>{item.opis}</p>
                    <p>{t('price')}: {item.cena} din</p>
                    <button className="btn btn-primary" onClick={() => handleOrderClick(item)}>{t('order')}</button>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {selectedItem && (
        <Modal show={true} onHide={handleCancelOrder}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedItem.naziv}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedItem.slika_url} alt={selectedItem.naziv} className="item-image" />
            <p>{selectedItem.opis}</p>
            <p>{t('price')}: {selectedItem.cena} din</p>
            <Form.Group controlId="formQuantity">
              <Form.Label>{t('quantity')}</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancelOrder}>
              {t('cancel')}
            </Button>
            <Button variant="primary" onClick={handleAddToCart}>
              {t('addToCart')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <div className={`floating-cart ${animate ? 'add-to-cart-animation' : ''}`} onClick={handleShowCartModal}>
        <i className="fas fa-shopping-cart"></i> ({cart.length})
      </div>

      <Modal show={showCartModal} onHide={handleCloseCartModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('cart')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <p>{t('cartEmpty')}</p>
          ) : (
            <div>
              <ul>
                {cart.map((item, index) => (
                  <li key={index} className="d-flex justify-content-between align-items-center">
                    <span>{item.naziv} - {t('price')}: {item.cena} din x {item.quantity}</span>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>
                      {t('remove')}
                    </button>
                  </li>
                ))}
              </ul>
              <Form.Group controlId="formNote">
                <Form.Label>{t('note')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={note}
                  onChange={handleNoteChange}
                  placeholder={t('note')}
                />
              </Form.Group>
              <p>{t('totalPrice')}: {calculateTotalPrice()} din</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCartModal}>
            {t('close')}
          </Button>
          <Button variant="primary" onClick={handleShowConfirmModal} disabled={cart.length === 0}>
            {t('checkout')}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('confirmOrderMessage')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t('totalPrice')}: {calculateTotalPrice()} din</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            {t('cancel')}
          </Button>
          <Button variant="primary" onClick={submitOrder}>
            {t('confirm')}
          </Button>
        </Modal.Footer>
      </Modal>

<br /><br /><br />

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

export default RestaurantPage;