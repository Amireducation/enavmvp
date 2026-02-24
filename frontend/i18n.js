import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: { "welcome": "Welcome" }},
  am: { translation: { "welcome": "እንኳን ደህና መጡ" }},
  om: { translation: { "welcome": "Baga nagaan dhuftan" }},
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
