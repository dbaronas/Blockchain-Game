import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import translationEN from './translations/English/translation.json'
import translationLT from './translations/Lithuanian/translation.json'
import translationFR from './translations/French/translation.json'
import translationES from './translations/Spanish/translation.json'

const resources = {
  English: {
    Hero: translationEN.Hero,
    NavBar: translationEN.NavBar,
    Stats: translationEN.Stats,
    Business: translationEN.Business,
    Billing: translationEN.Billing,
    CTA: translationEN.CTA,
    CardDeal: translationEN.CardDeal,
    Testimonials: translationEN.Testimonials,
    Footer: translationEN.Footer
  },
  Lithuanian: {
    Hero: translationLT.Hero,
    NavBar: translationLT.NavBar,
    Stats: translationLT.Stats,
    Business: translationLT.Business,
    Billing: translationLT.Billing,
    CTA: translationLT.CTA,
    CardDeal: translationLT.CardDeal,
    Testimonials: translationLT.Testimonials,
    Footer: translationLT.Footer
  },
  French: {
    Hero: translationFR.Hero,
    NavBar: translationFR.NavBar,
    Stats: translationFR.Stats,
    Business: translationFR.Business,
    Billing: translationFR.Billing,
    CTA: translationFR.CTA,
    CardDeal: translationFR.CardDeal,
    Testimonials: translationFR.Testimonials,
    Footer: translationFR.Footer
  },
  Spanish: {
    Hero: translationES.Hero,
    NavBar: translationES.NavBar,
    Stats: translationES.Stats,
    Business: translationES.Business,
    Billing: translationES.Billing,
    CTA: translationES.CTA,
    CardDeal: translationES.CardDeal,
    Testimonials: translationES.Testimonials,
    Footer: translationES.Footer
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "English",
    debug: true,
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: "/src/translations/{{lng}}/translation.json",
    },
    resources
  })

export default i18n