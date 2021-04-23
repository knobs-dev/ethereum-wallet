import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './imports/locales/en/translation.json';
import translationIT from './imports/locales/it/translation.json';

const resources = {
    en: {
        translation: translationEN,
    },
    it: {
        translation: translationIT,
    },
};

i18n.use(initReactI18next).init({
    resources,
    languages: ['it', 'en'],
    lng: 'it',
    fallbackLng: 'en',

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
