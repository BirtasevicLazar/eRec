import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "greeting": "Greeting",
      "mainPageDescription": "Welcome to the Hotel Tour.",
      "roomNumber": "Room Number",
      "cardTitle1": "Restaurant",
      "cardText1": "Visit our restaurant for delicious meals.",
      "cardTitle2": "Services",
      "cardText2": "Explore the services we offer.",
      "cardTitle3": "Report a Problem",
      "cardText3": "Report any issues you encounter.",
      "visitButton": "Visit",
      "restaurant": "Restaurant",
      "services": "Services",
      "problem": "Report a Problem",
      "userProfile": "User Profile",
      "name": "Name",
      "email": "Email",
      "totalSpend": "Total Spend",
      "close": "Close",
      "logout": "Logout",
      "contactUs": "Contact Us",
      "quickLinks": "Quick Links",
      "home": "Home",
      "about": "About Us",
      "contact": "Contact",
      "followUs": "Follow Us",
      "allRightsReserved": "All rights reserved",
      "restaurantPageTitle": "Our Restaurant",
      "restaurantPageContent": "Enjoy a variety of dishes at our restaurant.",
      "ourRestaurant": "Our Restaurant",
      "restaurantDescription": "We offer a wide range of cuisines to satisfy your taste buds.",
      "servicesPageTitle": "Our Services",
      "servicesPageContent": "Discover the services we provide to make your stay comfortable.",
      "ourServices": "Our Services",
      "servicesDescription": "From room service to spa treatments, we have it all.",
      "reportProblem": "Report a Problem",
      "problemFormExplanation": "Please describe the issue you are facing.",
      "problemDescription": "Problem Description",
      "submitProblem": "Submit Problem",
      "problemReported": "Problem reported successfully.",
      "problemReportError": "There was an error reporting the problem.",
      "emailMissing": "Email is missing in localStorage",
      "inProgress": "In Progress",
      "login": "Login",
      "roomNumberMissing": "Room number is missing",
      "emailExists": "Email exists",
      "emailNotExists": "Email does not exist",
      "errorOccurred": "An error occurred",
      "problemPageTitle": "Report a Problem",
      "problemPageContent": "Please describe the issue you are facing.",
      "price": "Price",
      "order": "Order",
      "date": "Date",
      "time": "Time",
      "note": "Note",
      "submitOrder": "Schedule Service",
      "orderCreated": "Service scheduled successfully",
      "orderCreationError": "Error scheduling service",
      "dateExplanation": "Please select a date for your appointment.",
      "timeExplanation": "Please select a time for your appointment.",
      "dateAndTimeRequired": "Date and time are required.",
      "confirmOrderMessage": "Are you sure you want to place this order?",
      "cancel": "Cancel",
      "confirm": "Confirm",
      "cart": "Cart",
      "cartEmpty": "Your cart is empty.",
      "totalPrice": "Total Price",
      "checkout": "Checkout",
      "addToCart": "Add to Cart",
      "remove": "Remove",
      "quantity": "Quantity"
    }
  },
  sr: {
    translation: {
      "greeting": "Pozdrav",
      "mainPageDescription": "Dobrodošli u Hotel Tour.",
      "roomNumber": "Broj Sobe",
      "cardTitle1": "Restoran",
      "cardText1": "Posetite naš restoran za ukusne obroke.",
      "cardTitle2": "Usluge",
      "cardText2": "Istražite usluge koje nudimo.",
      "cardTitle3": "Prijavite Problem",
      "cardText3": "Prijavite bilo kakve probleme koje imate.",
      "visitButton": "Poseti",
      "restaurant": "Restoran",
      "services": "Usluge",
      "problem": "Prijavite Problem",
      "userProfile": "Korisnički Profil",
      "name": "Ime",
      "email": "Email",
      "totalSpend": "Ukupna Potrošnja",
      "close": "Zatvori",
      "logout": "Odjavi se",
      "contactUs": "Kontaktirajte Nas",
      "quickLinks": "Brzi Linkovi",
      "home": "Početna",
      "about": "O Nama",
      "contact": "Kontakt",
      "followUs": "Pratite Nas",
      "allRightsReserved": "Sva prava zadržana",
      "restaurantPageTitle": "Naš Restoran",
      "restaurantPageContent": "Uživajte u raznovrsnim jelima u našem restoranu.",
      "ourRestaurant": "Naš Restoran",
      "restaurantDescription": "Nudimo širok spektar kuhinja koje će zadovoljiti vaše ukuse.",
      "servicesPageTitle": "Naše Usluge",
      "servicesPageContent": "Otkrijte usluge koje pružamo kako bi vaš boravak bio udoban.",
      "ourServices": "Naše Usluge",
      "servicesDescription": "Od sobne usluge do spa tretmana, imamo sve.",
      "reportProblem": "Prijavite Problem",
      "problemFormExplanation": "Molimo opišite problem sa kojim se suočavate.",
      "problemDescription": "Opis Problema",
      "submitProblem": "Pošalji Problem",
      "problemReported": "Problem uspešno prijavljen.",
      "problemReportError": "Došlo je do greške prilikom prijavljivanja problema.",
      "emailMissing": "Email nedostaje u localStorage",
      "inProgress": "U Toku",
      "login": "Prijava",
      "roomNumberMissing": "Broj sobe nedostaje",
      "emailExists": "Email postoji",
      "emailNotExists": "Email ne postoji",
      "errorOccurred": "Došlo je do greške",
      "problemPageTitle": "Prijavite Problem",
      "problemPageContent": "Molimo opišite problem sa kojim se suočavate.",
      "price": "Cena",
      "order": "Naruči",
      "date": "Datum",
      "time": "Vreme",
      "note": "Napomena",
      "submitOrder": "Zakaži uslugu",
      "orderCreated": "Usluga uspešno zakazana",
      "orderCreationError": "Greška prilikom zakazivanja usluge",
      "dateExplanation": "Molimo izaberite datum za vaš termin.",
      "timeExplanation": "Molimo izaberite vreme za vaš termin.",
      "dateAndTimeRequired": "Datum i vreme su obavezni.",
      "confirmOrderMessage": "Da li ste sigurni da želite da naručite?",
      "cancel": "Otkaži",
      "confirm": "Potvrdi",
      "cart": "Korpa",
      "cartEmpty": "Vaša korpa je prazna.",
      "totalPrice": "Ukupna Cena",
      "checkout": "Završi kupovinu",
      "addToCart": "Dodaj u korpu",
      "remove": "Ukloni",
      "quantity": "Količina"
    }
  }
};

const language = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: language, // postavljanje jezika iz localStorage
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;