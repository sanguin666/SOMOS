// Plain client-side i18n for the landing site — no build step, no framework,
// matching the rest of this folder. Default language is Spanish; EN/FR are
// switched by the pills in the header.
(function () {
  var TRANSLATIONS = {
    es: {
      navFeatures: "Funcionalidades", navChurches: "Parroquias", navCongregants: "Feligreses", navPricing: "Precios", navContact: "Contáctanos",
      promoBar: "1 mes de prueba gratis · Plan base a 0 €/mes", promoLink: "Ver tarifas",
      heroEyebrow: "Para parroquias y comunidades",
      heroHeadline: "Una sola app para toda tu comunidad",
      heroSub: "Donativos, eventos, anuncios, peticiones de oración, misa en vivo y vida comunitaria — todo en una app pensada para ser sencilla, incluso para quienes no están acostumbrados a la tecnología.",
      heroCtaPrimary: "Descubrir SOMOS", heroCtaSecondary: "Tengo un código QR",
      heroPricingNote: "Solo pagas cuando activas módulos avanzados (donativos, comunicaciones…).",
      phoneNextEvent: "PRÓXIMO EVENTO", phoneEventTitle: "Misa dominical",
      phoneBulletinTitle: "Boletín de esta semana", phoneBulletinSub: "El ensayo del coro pasa al jueves…",
      featEyebrow: "Todo en una app", featHeading: "Todo lo que necesita tu parroquia",
      featSub: "Activa solo los módulos que tu comunidad necesita — ni más, ni menos.",
      feat1Title: "Donativos", feat1Desc: "Donar en unos toques, con confirmación clara e historial de donativos.",
      feat2Title: "Eventos", feat2Desc: "Misas, bautizos, bodas, funerales — con recordatorios que los feligreses pueden activar.",
      feat3Title: "Anuncios", feat3Desc: "El boletín parroquial, con la opción de un mensaje de voz.",
      feat4Title: "Peticiones de oración", feat4Desc: "Un espacio compartido para pedir — u ofrecer — oración a la comunidad.",
      feat5Title: "Misa en vivo", feat5Desc: "Un solo toque para ver la misa en vivo o la grabación.",
      feat6Title: "Comunidad", feat6Desc: "Un muro de conversación moderado para que la comunidad esté en contacto.",
      churchEyebrow: "Para el personal parroquial", churchHeading: "Gestiona todo desde un solo panel",
      churchPara: "Publica anuncios, programa eventos y misas en vivo, modera lo que publica la comunidad, y activa los módulos que necesites — un panel pensado para el personal parroquial, no para desarrolladores.",
      churchBullet1: "Disponible en inglés, español y francés",
      churchBullet2: "Un folleto con código QR imprimible para hacer crecer tu parroquia en la app",
      churchBullet3: "Gestiona más de una parroquia desde una sola cuenta",
      churchCta: "Configurar mi parroquia",
      dashThisWeek: "Esta semana", dashThisMonth: "Este mes", dashDaily: "Donativos diarios",
      congEyebrow: "Para los feligreses", congHeading: "Pensado para ser sencillo, para todos",
      congPara: "Texto grande y contrastado, zonas táctiles amplias, sin gestos complicados — SOMOS está pensado para una comunidad mayormente mayor, sin dejar a nadie fuera.",
      congBullet1: "Escanea el código QR de tu parroquia para empezar al instante",
      congBullet2: "No necesitas cuenta ni contraseña para consultar y participar",
      congBullet3: "Usa la app en tu propio idioma",
      miniWelcome: "Bienvenido. Elige una acción.", miniScan: "Escanear un código QR", miniPlaces: "Mis lugares",
      ctaHeading: "¿Listo para conectar tu parroquia?",
      ctaPara: "Contáctanos y te ayudamos a configurar tu panel y tu folleto imprimible.",
      ctaBtn1: "Contáctanos", ctaBtn2: "Ver el recorrido del feligrés",
      footerJoinLink: "Únete a una parroquia",
      footerCopyright: "© 2026 SOMOS. Página de demostración de un proyecto en desarrollo.",
      pricingEyebrow: "Precios",
      pricingHeading: "Empieza gratis. Paga solo por lo que activas.",
      pricingSub: "El plan base siempre es gratuito. Los módulos avanzados se activan cuando tu parroquia los necesita, con un mes de prueba gratis en cada uno.",
      pricingBaseTitle: "Plan base",
      pricingBasePrice: "0 €/mes",
      pricingBaseDesc: "El registro de tu parroquia, la app para tus feligreses, el código QR de bienvenida y un perfil básico — gratis, sin límite de tiempo.",
      pricingModulesTitle: "Módulos avanzados",
      pricingModulesPrice: "Pago por módulo",
      pricingModulesDesc: "Donativos, comunicaciones avanzadas, y más — cada módulo incluye 1 mes de prueba gratis antes de decidir. Los precios detallados llegarán pronto.",
      pricingComingSoon: "La página de tarifas detallada llega pronto. Mientras tanto, contáctanos y te explicamos todo.",
      joinEyebrow: "Casi listo",
      joinHeading: "Ya casi estás dentro",
      joinPara: "Descarga la app SOMOS para terminar de unirte a tu parroquia. Una vez instalada, ábrela y escanea de nuevo el mismo código QR — o introduce el código a mano más abajo.",
      joinAppStore: "Disponible en App Store",
      joinGooglePlay: "Disponible en Google Play",
      joinTokenLabel: "El código de tu parroquia:",
      joinFallbackNote: "La app aún no está publicada en las tiendas — esta sección es un placeholder para ese flujo. Mientras tanto, usa el botón «Simular escaneo» en la app de demostración.",
    },
    en: {
      navFeatures: "Features", navChurches: "Churches", navCongregants: "Congregants", navPricing: "Pricing", navContact: "Contact us",
      promoBar: "1 month free trial · Base plan at €0/month", promoLink: "See pricing",
      heroEyebrow: "For churches & communities",
      heroHeadline: "One app for your whole community",
      heroSub: "Donations, events, announcements, prayer requests, livestream and community life — all in one app designed to be simple, even for congregants who aren't used to apps.",
      heroCtaPrimary: "Discover SOMOS", heroCtaSecondary: "I have a QR code",
      heroPricingNote: "You only pay when you activate advanced modules (donations, communications…).",
      phoneNextEvent: "NEXT EVENT", phoneEventTitle: "Sunday Mass",
      phoneBulletinTitle: "This week's bulletin", phoneBulletinSub: "Choir practice moves to Thursday …",
      featEyebrow: "All-in-one", featHeading: "Everything your parish needs",
      featSub: "Turn on only the modules your community needs — nothing more, nothing less.",
      feat1Title: "Donations", feat1Desc: "Give in a few taps, with a clear confirmation and giving history.",
      feat2Title: "Events", feat2Desc: "Masses, baptisms, weddings, funerals — with reminders congregants can opt into.",
      feat3Title: "Announcements", feat3Desc: "Bulletin-style updates from staff, including a spoken voice message option.",
      feat4Title: "Prayer requests", feat4Desc: "A shared space for the community to ask for — or offer — prayer.",
      feat5Title: "Livestream", feat5Desc: "One tap to today's livestreamed or recorded service.",
      feat6Title: "Community", feat6Desc: "A moderated discussion board for the congregation to stay in touch.",
      churchEyebrow: "For parish staff", churchHeading: "Run everything from one dashboard",
      churchPara: "Publish announcements, schedule events and livestreams, moderate what the community posts, and turn on the modules you need — a dashboard built for parish staff, not developers.",
      churchBullet1: "Available in English, Spanish and French",
      churchBullet2: "A printable QR flyer to grow your parish's app signups",
      churchBullet3: "Manage more than one parish from a single account",
      churchCta: "Set up my parish",
      dashThisWeek: "This week", dashThisMonth: "This month", dashDaily: "Daily donations",
      congEyebrow: "For congregants", congHeading: "Designed to be simple, for everyone",
      congPara: "Large, high-contrast text, big touch targets, no complicated gestures — SOMOS is built with a mostly older congregation in mind, without leaving anyone out.",
      congBullet1: "Scan your parish's QR code to get started instantly",
      congBullet2: "No account or password needed to browse and post",
      congBullet3: "Use the app in your own language",
      miniWelcome: "Welcome. Choose an action.", miniScan: "Scan a QR code", miniPlaces: "My places",
      ctaHeading: "Ready to connect your parish?",
      ctaPara: "Get in touch and we'll help you set up your dashboard and printable flyer.",
      ctaBtn1: "Contact us", ctaBtn2: "See the congregant flow",
      footerJoinLink: "Join a parish",
      footerCopyright: "© 2026 SOMOS. This is a demo landing page for a project in development.",
      pricingEyebrow: "Pricing",
      pricingHeading: "Start free. Only pay for what you turn on.",
      pricingSub: "The base plan is always free. Advanced modules activate when your parish needs them, each with a one-month free trial.",
      pricingBaseTitle: "Base plan",
      pricingBasePrice: "€0/month",
      pricingBaseDesc: "Your parish's listing, the app for your congregants, the welcome QR code, and a basic profile — free, with no time limit.",
      pricingModulesTitle: "Advanced modules",
      pricingModulesPrice: "Pay per module",
      pricingModulesDesc: "Donations, advanced communications, and more — every module comes with a 1-month free trial before you decide. Detailed pricing is coming soon.",
      pricingComingSoon: "The detailed pricing page is coming soon. In the meantime, get in touch and we'll walk you through it.",
      joinEyebrow: "Almost there",
      joinHeading: "You're almost there",
      joinPara: "Download the SOMOS app to finish joining your parish. Once installed, open it and scan the same QR code again — or enter the code below by hand.",
      joinAppStore: "Download on the App Store",
      joinGooglePlay: "Get it on Google Play",
      joinTokenLabel: "Your parish's code:",
      joinFallbackNote: "The app isn't published to app stores yet — this section is a placeholder for that flow. In the meantime, use the \"Simulate scan\" button in the demo app.",
    },
    fr: {
      navFeatures: "Fonctionnalités", navChurches: "Paroisses", navCongregants: "Fidèles", navPricing: "Tarifs", navContact: "Nous contacter",
      promoBar: "1 mois d'essai gratuit · Offre de base à 0 €/mois", promoLink: "Voir les tarifs",
      heroEyebrow: "Pour les paroisses & communautés",
      heroHeadline: "Une seule app pour toute votre communauté",
      heroSub: "Dons, événements, annonces, demandes de prière, messe en direct et vie communautaire — le tout dans une app pensée pour être simple, même pour les fidèles les moins à l'aise avec la technologie.",
      heroCtaPrimary: "Découvrir SOMOS", heroCtaSecondary: "J'ai un code QR",
      heroPricingNote: "Vous ne payez que lorsque vous activez des modules avancés (dons, communications…).",
      phoneNextEvent: "PROCHAIN ÉVÉNEMENT", phoneEventTitle: "Messe du dimanche",
      phoneBulletinTitle: "Bulletin de la semaine", phoneBulletinSub: "La répétition de la chorale passe au jeudi…",
      featEyebrow: "Tout en un", featHeading: "Tout ce dont votre paroisse a besoin",
      featSub: "Activez uniquement les modules dont votre communauté a besoin — rien de plus, rien de moins.",
      feat1Title: "Dons", feat1Desc: "Donner en quelques gestes, avec une confirmation claire et un historique des dons.",
      feat2Title: "Événements", feat2Desc: "Messes, baptêmes, mariages, funérailles — avec des rappels que les fidèles peuvent activer.",
      feat3Title: "Annonces", feat3Desc: "Le bulletin paroissial, avec en plus la possibilité d'un message vocal.",
      feat4Title: "Demandes de prière", feat4Desc: "Un espace partagé pour demander — ou offrir — une prière à la communauté.",
      feat5Title: "Messe en direct", feat5Desc: "Un seul geste pour rejoindre la messe diffusée en direct ou revoir l'enregistrement.",
      feat6Title: "Communauté", feat6Desc: "Un fil de discussion modéré pour que la communauté reste en lien.",
      churchEyebrow: "Pour le personnel paroissial", churchHeading: "Tout piloter depuis un seul tableau de bord",
      churchPara: "Publiez des annonces, programmez événements et messes en direct, modérez les échanges de la communauté et activez les modules dont vous avez besoin — un tableau de bord pensé pour le personnel paroissial, pas pour des développeurs.",
      churchBullet1: "Disponible en anglais, espagnol et français",
      churchBullet2: "Un flyer QR imprimable pour faire grandir votre paroisse sur l'app",
      churchBullet3: "Gérez plusieurs paroisses depuis un seul compte",
      churchCta: "Configurer ma paroisse",
      dashThisWeek: "Cette semaine", dashThisMonth: "Ce mois-ci", dashDaily: "Dons quotidiens",
      congEyebrow: "Pour les fidèles", congHeading: "Pensé pour être simple, pour tout le monde",
      congPara: "Texte large et contrasté, grandes zones tactiles, aucun geste compliqué — SOMOS est pensé pour une communauté en grande partie plus âgée, sans laisser personne de côté.",
      congBullet1: "Scannez le code QR de votre paroisse pour commencer instantanément",
      congBullet2: "Aucun compte ni mot de passe requis pour consulter et participer",
      congBullet3: "Utilisez l'app dans votre propre langue",
      miniWelcome: "Bienvenue. Choisissez une action.", miniScan: "Scanner un code QR", miniPlaces: "Mes lieux",
      ctaHeading: "Prêt à connecter votre paroisse ?",
      ctaPara: "Contactez-nous, on vous aide à configurer votre tableau de bord et votre flyer imprimable.",
      ctaBtn1: "Nous contacter", ctaBtn2: "Voir le parcours fidèle",
      footerJoinLink: "Rejoindre une paroisse",
      footerCopyright: "© 2026 SOMOS. Page de démonstration pour un projet en développement.",
      pricingEyebrow: "Tarifs",
      pricingHeading: "Commencez gratuitement. Ne payez que ce que vous activez.",
      pricingSub: "L'offre de base est toujours gratuite. Les modules avancés s'activent quand votre paroisse en a besoin, avec un mois d'essai gratuit sur chacun.",
      pricingBaseTitle: "Offre de base",
      pricingBasePrice: "0 €/mois",
      pricingBaseDesc: "La fiche de votre paroisse, l'app pour vos fidèles, le code QR de bienvenue et un profil de base — gratuit, sans limite de temps.",
      pricingModulesTitle: "Modules avancés",
      pricingModulesPrice: "Paiement au module",
      pricingModulesDesc: "Dons, communications avancées, et plus — chaque module inclut 1 mois d'essai gratuit avant de vous décider. Les tarifs détaillés arrivent bientôt.",
      pricingComingSoon: "La page de tarifs détaillée arrive bientôt. En attendant, contactez-nous et on vous explique tout.",
      joinEyebrow: "Vous y êtes presque",
      joinHeading: "Vous y êtes presque",
      joinPara: "Téléchargez l'app SOMOS pour terminer de rejoindre votre paroisse. Une fois installée, ouvrez-la et scannez à nouveau le même code QR — ou saisissez le code ci-dessous à la main.",
      joinAppStore: "Disponible sur l'App Store",
      joinGooglePlay: "Disponible sur Google Play",
      joinTokenLabel: "Le code de votre paroisse :",
      joinFallbackNote: "L'app n'est pas encore publiée sur les stores — cette section est un placeholder pour ce parcours. En attendant, utilisez le bouton « Simuler un scan » dans l'app de démonstration.",
    },
  };

  var STORAGE_KEY = "somos-landing-language";

  function applyLang(lang) {
    var t = TRANSLATIONS[lang] || TRANSLATIONS.es;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll("[data-lang-pill]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-lang-pill") === lang);
    });
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Private browsing / blocked storage: language just won't persist.
    }
  }

  function initialLang() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Ignore: fall back to the default below.
    }
    return TRANSLATIONS[saved] ? saved : "es";
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(initialLang());
    document.querySelectorAll("[data-lang-pill]").forEach(function (el) {
      el.addEventListener("click", function () {
        applyLang(el.getAttribute("data-lang-pill"));
      });
    });
  });
})();
