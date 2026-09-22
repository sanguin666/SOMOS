export type SupportedLanguage = 'en' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr'];

// Only the app's own chrome (menus, buttons, form labels) is translated
// here. Content POIs publish — announcements, prayer requests, community
// posts, event details — is shown exactly as the POI wrote it, in the
// POI's own language (see Poi.language on the backend). A future AI
// translation pass on that content is a separate, later feature.
export type Translations = {
  common: {
    back: string;
    loading: string;
    anonymous: string;
  };
  home: {
    welcome: string;
    error: string;
    scanButton: string;
    myPlacesButton: string;
    languageLabel: string;
    signInButton: string;
    signOutButton: string;
    signedInAs: string;
  };
  signIn: {
    title: string;
    phoneExplainer: string;
    phoneLabel: string;
    phonePlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    sendCode: string;
    sending: string;
    codeExplainer: string;
    devCodeLabel: string;
    confirm: string;
    checking: string;
    changeNumber: string;
    genericError: string;
    requiredToPost: string;
  };
  scan: {
    title: string;
    subtitle: string;
    error: string;
    simulateButton: string;
    codeLabel: string;
    codePlaceholder: string;
    codeButton: string;
    codeNotFound: string;
  };
  hub: {
    errorLoad: string;
    noModules: string;
    locationNotSet: string;
    donationsLabel: string;
    eventsLabel: string;
    announcementsLabel: string;
    prayerRequestsLabel: string;
    livestreamLabel: string;
    communityLabel: string;
    nextEvent: string;
    upcomingEvents: string;
    pastEvents: string;
    nextLivestream: string;
    latestAnnouncements: string;
    seeAll: string;
    homeLabel: string;
    moreLabel: string;
    switchPlace: string;
  };
  more: {
    title: string;
    prayerRequests: string;
    community: string;
  };
  places: {
    title: string;
    addPlace: string;
    appHome: string;
    close: string;
  };
  donate: {
    title: string;
    subtitle: string;
    chooseAmount: string;
    customAmount: string;
    donateButton: string;
    processingButton: string;
    footnote: string;
    demoFootnote: string;
    payingTitle: string;
    payingMessage: string;
    openPaymentButton: string;
    checkingPayment: string;
    cancelButton: string;
    error: string;
    thankYou: string;
    confirmation: string;
    demoConfirmation: string;
    doneButton: string;
  };
  events: {
    title: string;
    watchLive: string;
    watchLiveHint: string;
    notifyOn: string;
    notifyOff: string;
    loading: string;
    error: string;
    empty: string;
  };
  announcements: {
    title: string;
    newAria: string;
    error: string;
    loading: string;
    empty: string;
    playVoice: string;
    pauseVoice: string;
  };
  composeAnnouncement: {
    title: string;
    titlePlaceholder: string;
    bodyPlaceholder: string;
    voiceMessageLabel: string;
    stop: string;
    recorded: string;
    reRecord: string;
    reRecordAria: string;
    recordButton: string;
    recordAria: string;
    playPreviewAria: string;
    pausePreviewAria: string;
    postButton: string;
    postingButton: string;
    micPermissionError: string;
    startRecordingError: string;
    titleRequiredError: string;
    contentRequiredError: string;
    genericError: string;
  };
  prayerRequests: {
    title: string;
    messagePlaceholder: string;
    namePlaceholder: string;
    shareButton: string;
    sharingButton: string;
    error: string;
    loading: string;
    prayingSuffix: string;
    prayButton: string;
    prayAria: string;
  };
  livestream: {
    title: string;
    error: string;
    loading: string;
    live: string;
    watch: string;
    replay: string;
    watchAria: string;
    replayAria: string;
  };
  community: {
    title: string;
    messagePlaceholder: string;
    namePlaceholder: string;
    postButton: string;
    postingButton: string;
    error: string;
    loading: string;
    openAria: string;
  };
  communityThread: {
    repliesLabel: string;
    error: string;
    loading: string;
    empty: string;
    messagePlaceholder: string;
    namePlaceholder: string;
    replyButton: string;
    replyingButton: string;
  };
};

const en: Translations = {
  common: {
    back: 'Back',
    loading: 'Loading…',
    anonymous: 'Anonymous',
  },
  home: {
    welcome: 'Welcome. Choose an action below.',
    error: "Couldn't reach the server. Check that the backend is running and try again.",
    scanButton: "Scan a place's QR code",
    myPlacesButton: 'My places',
    languageLabel: 'Language',
    signInButton: 'Sign in',
    signOutButton: 'Sign out',
    signedInAs: 'Signed in as {{name}}',
  },
  signIn: {
    title: 'Sign in',
    phoneExplainer: 'Enter your phone number and we’ll text you a 6-digit code. There is no password to remember.',
    phoneLabel: 'Phone number',
    phonePlaceholder: '+34 600 00 00 00',
    nameLabel: 'Your name (optional)',
    namePlaceholder: 'Shown next to what you post',
    sendCode: 'Send me a code',
    sending: 'Sending…',
    codeExplainer: 'Enter the 6-digit code sent to {{phone}}.',
    devCodeLabel: 'No text message service is set up, so here is your code:',
    confirm: 'Sign in',
    checking: 'Checking…',
    changeNumber: 'Use a different number',
    genericError: 'Something went wrong. Please try again.',
    requiredToPost: 'Sign in to post here.',
  },
  scan: {
    title: 'Scan the QR code',
    subtitle: 'Point your camera at the code on the flyer',
    error: "Couldn't reach the server. Check that the backend is running and try again.",
    simulateButton: 'Simulate scan',
    codeLabel: 'Or type the code printed under it',
    codePlaceholder: 'Place code',
    codeButton: 'Open this place',
    codeNotFound: 'No place uses that code. Check it and try again.',
  },
  hub: {
    errorLoad: "Couldn't load what's available here. Pull up the app again to retry.",
    noModules: 'No modules are active for this place yet.',
    locationNotSet: 'Location not set',
    donationsLabel: 'Donate',
    eventsLabel: 'Events',
    announcementsLabel: 'News',
    prayerRequestsLabel: 'Prayer',
    livestreamLabel: 'Live',
    communityLabel: 'Group',
    nextEvent: 'Next event',
    upcomingEvents: 'Coming up',
    pastEvents: 'Recently',
    nextLivestream: 'Live services',
    latestAnnouncements: 'Latest',
    seeAll: 'See all',
    homeLabel: 'Home',
    moreLabel: 'More',
    switchPlace: 'Change place',
  },
  more: {
    title: 'More',
    prayerRequests: 'Prayer requests',
    community: 'Our group',
  },
  places: {
    title: 'Your places',
    addPlace: 'Add a place',
    appHome: 'ANSAE home',
    close: 'Close',
  },
  donate: {
    title: 'Donate to {{poiName}}',
    subtitle: 'Every gift helps our community thrive.',
    chooseAmount: 'CHOOSE AN AMOUNT',
    customAmount: 'Custom amount',
    donateButton: 'Donate {{amount}}',
    processingButton: 'Processing…',
    footnote: 'Secure payment · Powered by Stripe',
    demoFootnote: 'Demo mode · No payment will be taken',
    payingTitle: 'Finish your donation',
    payingMessage:
      'Your payment page opened in the browser. Once you have paid, come back here. This screen updates on its own.',
    openPaymentButton: 'Open the payment page',
    checkingPayment: 'Waiting for your payment…',
    cancelButton: 'Cancel',
    error: "We couldn't start the payment. Please try again.",
    thankYou: 'Thank you!',
    confirmation: 'Your donation of {{amount}} to {{poiName}} went through.',
    demoConfirmation:
      'This is a demo — no real payment was made. A donation of {{amount}} to {{poiName}} was recorded.',
    doneButton: 'Done',
  },
  events: {
    title: 'Events',
    watchLive: 'Watch live',
    watchLiveHint: 'What is on air now and what is coming',
    notifyOn: 'Turn off notifications for {{title}}',
    notifyOff: 'Turn on notifications for {{title}}',
    loading: 'Loading…',
    error: "Couldn't load events. Pull up the app again to retry.",
    empty: 'No upcoming events yet.',
  },
  announcements: {
    title: 'Announcements',
    newAria: 'New announcement',
    error: "Couldn't load announcements. Pull up the app again to retry.",
    loading: 'Loading…',
    empty: 'No announcements yet.',
    playVoice: 'Play voice message',
    pauseVoice: 'Pause voice message',
  },
  composeAnnouncement: {
    title: 'New Announcement',
    titlePlaceholder: 'Title',
    bodyPlaceholder: 'Write a message (optional if you record one below)…',
    voiceMessageLabel: 'VOICE MESSAGE (OPTIONAL)',
    stop: 'Stop',
    recorded: 'Voice message recorded',
    reRecord: 'Re-record',
    reRecordAria: 'Discard recording and record again',
    recordButton: 'Record voice message',
    recordAria: 'Record a voice message',
    playPreviewAria: 'Play preview',
    pausePreviewAria: 'Pause preview',
    postButton: 'Post announcement',
    postingButton: 'Posting…',
    micPermissionError: 'Microphone permission is needed to record a voice message.',
    startRecordingError: "Couldn't start recording on this device.",
    titleRequiredError: 'Please add a title.',
    contentRequiredError: 'Add some text or record a voice message.',
    genericError: 'Something went wrong.',
  },
  prayerRequests: {
    title: 'Prayer Requests',
    messagePlaceholder: 'Share a prayer request…',
    namePlaceholder: 'Your name (optional)',
    shareButton: 'Share request',
    sharingButton: 'Sharing…',
    error: "Couldn't load prayer requests. Pull up the app again to retry.",
    loading: 'Loading…',
    prayingSuffix: 'praying',
    prayButton: 'Pray',
    prayAria: "I'm praying for this",
  },
  livestream: {
    title: 'Livestream',
    error: "Couldn't load livestreams. Pull up the app again to retry.",
    loading: 'Loading…',
    live: 'LIVE',
    watch: 'Watch',
    replay: 'Replay',
    watchAria: 'Watch {{title}}',
    replayAria: 'Replay {{title}}',
  },
  community: {
    title: 'Community',
    messagePlaceholder: 'Start a conversation…',
    namePlaceholder: 'Your name (optional)',
    postButton: 'Post',
    postingButton: 'Posting…',
    error: "Couldn't load the community board. Pull up the app again to retry.",
    loading: 'Loading…',
    openAria: 'Open discussion: {{message}}',
  },
  communityThread: {
    repliesLabel: 'REPLIES',
    error: "Couldn't load replies. Pull up the app again to retry.",
    loading: 'Loading…',
    empty: 'No replies yet — be the first to respond.',
    messagePlaceholder: 'Write a reply…',
    namePlaceholder: 'Your name (optional)',
    replyButton: 'Reply',
    replyingButton: 'Replying…',
  },
};

const es: Translations = {
  common: {
    back: 'Atrás',
    loading: 'Cargando…',
    anonymous: 'Anónimo',
  },
  home: {
    welcome: 'Bienvenido. Elige una acción a continuación.',
    error: 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución e inténtalo de nuevo.',
    scanButton: 'Escanear el código QR de un lugar',
    myPlacesButton: 'Mis lugares',
    languageLabel: 'Idioma',
    signInButton: 'Iniciar sesión',
    signOutButton: 'Cerrar sesión',
    signedInAs: 'Sesión iniciada como {{name}}',
  },
  signIn: {
    title: 'Iniciar sesión',
    phoneExplainer: 'Escribe tu número de teléfono y te enviaremos un código de 6 dígitos por SMS. No hay contraseña que recordar.',
    phoneLabel: 'Número de teléfono',
    phonePlaceholder: '+34 600 00 00 00',
    nameLabel: 'Tu nombre (opcional)',
    namePlaceholder: 'Aparecerá junto a lo que publiques',
    sendCode: 'Envíame un código',
    sending: 'Enviando…',
    codeExplainer: 'Escribe el código de 6 dígitos enviado a {{phone}}.',
    devCodeLabel: 'No hay servicio de SMS configurado, así que aquí tienes tu código:',
    confirm: 'Entrar',
    checking: 'Comprobando…',
    changeNumber: 'Usar otro número',
    genericError: 'Algo ha salido mal. Inténtalo de nuevo.',
    requiredToPost: 'Inicia sesión para publicar aquí.',
  },
  scan: {
    title: 'Escanea el código QR',
    subtitle: 'Apunta tu cámara al código del folleto',
    error: 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución e inténtalo de nuevo.',
    simulateButton: 'Simular escaneo',
    codeLabel: 'O escribe el código impreso debajo',
    codePlaceholder: 'Código del lugar',
    codeButton: 'Abrir este lugar',
    codeNotFound: 'Ningún lugar usa ese código. Revísalo e inténtalo de nuevo.',
  },
  hub: {
    errorLoad: 'No se pudo cargar lo disponible aquí. Vuelve a abrir la app para reintentar.',
    noModules: 'Todavía no hay módulos activos para este lugar.',
    locationNotSet: 'Ubicación no establecida',
    donationsLabel: 'Donar',
    eventsLabel: 'Eventos',
    announcementsLabel: 'Noticias',
    prayerRequestsLabel: 'Oración',
    livestreamLabel: 'En vivo',
    communityLabel: 'Grupo',
    nextEvent: 'Próximo evento',
    upcomingEvents: 'Próximamente',
    pastEvents: 'Recientemente',
    nextLivestream: 'Servicios en vivo',
    latestAnnouncements: 'Últimos anuncios',
    seeAll: 'Ver todos',
    homeLabel: 'Inicio',
    moreLabel: 'Más',
    switchPlace: 'Cambiar de lugar',
  },
  more: {
    title: 'Más',
    prayerRequests: 'Peticiones de oración',
    community: 'Nuestro grupo',
  },
  places: {
    title: 'Tus lugares',
    addPlace: 'Añadir un lugar',
    appHome: 'Inicio de ANSAE',
    close: 'Cerrar',
  },
  donate: {
    title: 'Donar a {{poiName}}',
    subtitle: 'Cada donativo ayuda a nuestra comunidad a prosperar.',
    chooseAmount: 'ELIGE UN MONTO',
    customAmount: 'Monto personalizado',
    donateButton: 'Donar {{amount}}',
    processingButton: 'Procesando…',
    footnote: 'Pago seguro · Con la tecnología de Stripe',
    demoFootnote: 'Modo demostración · No se cobrará nada',
    payingTitle: 'Completa tu donativo',
    payingMessage:
      'La página de pago se abrió en el navegador. Cuando termines de pagar, vuelve aquí. Esta pantalla se actualiza sola.',
    openPaymentButton: 'Abrir la página de pago',
    checkingPayment: 'Esperando tu pago…',
    cancelButton: 'Cancelar',
    error: 'No pudimos iniciar el pago. Inténtalo de nuevo.',
    thankYou: '¡Gracias!',
    confirmation: 'Tu donativo de {{amount}} a {{poiName}} se completó.',
    demoConfirmation:
      'Esto es una demostración: no se realizó ningún pago real. Se registró un donativo de {{amount}} para {{poiName}}.',
    doneButton: 'Listo',
  },
  events: {
    title: 'Eventos',
    watchLive: 'Ver en vivo',
    watchLiveHint: 'Lo que se emite ahora y lo que viene',
    notifyOn: 'Desactivar notificaciones de {{title}}',
    notifyOff: 'Activar notificaciones de {{title}}',
    loading: 'Cargando…',
    error: 'No se pudieron cargar los eventos. Vuelve a abrir la app para reintentar.',
    empty: 'Todavía no hay próximos eventos.',
  },
  announcements: {
    title: 'Anuncios',
    newAria: 'Nuevo anuncio',
    error: 'No se pudieron cargar los anuncios. Vuelve a abrir la app para reintentar.',
    loading: 'Cargando…',
    empty: 'Todavía no hay anuncios.',
    playVoice: 'Reproducir mensaje de voz',
    pauseVoice: 'Pausar mensaje de voz',
  },
  composeAnnouncement: {
    title: 'Nuevo anuncio',
    titlePlaceholder: 'Título',
    bodyPlaceholder: 'Escribe un mensaje (opcional si grabas uno abajo)…',
    voiceMessageLabel: 'MENSAJE DE VOZ (OPCIONAL)',
    stop: 'Detener',
    recorded: 'Mensaje de voz grabado',
    reRecord: 'Grabar de nuevo',
    reRecordAria: 'Descartar la grabación y grabar de nuevo',
    recordButton: 'Grabar mensaje de voz',
    recordAria: 'Grabar un mensaje de voz',
    playPreviewAria: 'Reproducir vista previa',
    pausePreviewAria: 'Pausar vista previa',
    postButton: 'Publicar anuncio',
    postingButton: 'Publicando…',
    micPermissionError: 'Se necesita permiso del micrófono para grabar un mensaje de voz.',
    startRecordingError: 'No se pudo iniciar la grabación en este dispositivo.',
    titleRequiredError: 'Agrega un título.',
    contentRequiredError: 'Agrega texto o graba un mensaje de voz.',
    genericError: 'Algo salió mal.',
  },
  prayerRequests: {
    title: 'Peticiones de oración',
    messagePlaceholder: 'Comparte una petición de oración…',
    namePlaceholder: 'Tu nombre (opcional)',
    shareButton: 'Compartir petición',
    sharingButton: 'Compartiendo…',
    error: 'No se pudieron cargar las peticiones de oración. Vuelve a abrir la app para reintentar.',
    loading: 'Cargando…',
    prayingSuffix: 'orando',
    prayButton: 'Orar',
    prayAria: 'Estoy orando por esto',
  },
  livestream: {
    title: 'Transmisión en vivo',
    error: 'No se pudieron cargar las transmisiones. Vuelve a abrir la app para reintentar.',
    loading: 'Cargando…',
    live: 'EN VIVO',
    watch: 'Ver',
    replay: 'Repetición',
    watchAria: 'Ver {{title}}',
    replayAria: 'Ver repetición de {{title}}',
  },
  community: {
    title: 'Comunidad',
    messagePlaceholder: 'Inicia una conversación…',
    namePlaceholder: 'Tu nombre (opcional)',
    postButton: 'Publicar',
    postingButton: 'Publicando…',
    error: 'No se pudo cargar la comunidad. Vuelve a abrir la app para reintentar.',
    loading: 'Cargando…',
    openAria: 'Abrir conversación: {{message}}',
  },
  communityThread: {
    repliesLabel: 'RESPUESTAS',
    error: 'No se pudieron cargar las respuestas. Vuelve a abrir la app para reintentar.',
    loading: 'Cargando…',
    empty: 'Todavía no hay respuestas — sé el primero en responder.',
    messagePlaceholder: 'Escribe una respuesta…',
    namePlaceholder: 'Tu nombre (opcional)',
    replyButton: 'Responder',
    replyingButton: 'Respondiendo…',
  },
};

const fr: Translations = {
  common: {
    back: 'Retour',
    loading: 'Chargement…',
    anonymous: 'Anonyme',
  },
  home: {
    welcome: 'Bienvenue. Choisissez une action ci-dessous.',
    error: "Impossible de joindre le serveur. Vérifiez que le backend est démarré et réessayez.",
    scanButton: "Scanner le QR code d'un lieu",
    myPlacesButton: 'Mes lieux',
    languageLabel: 'Langue',
    signInButton: 'Se connecter',
    signOutButton: 'Se déconnecter',
    signedInAs: 'Connecté en tant que {{name}}',
  },
  signIn: {
    title: 'Se connecter',
    phoneExplainer: 'Saisissez votre numéro de téléphone et nous vous enverrons un code à 6 chiffres par SMS. Aucun mot de passe à retenir.',
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '+33 6 00 00 00 00',
    nameLabel: 'Votre nom (facultatif)',
    namePlaceholder: 'Affiché à côté de vos publications',
    sendCode: 'Envoyez-moi un code',
    sending: 'Envoi…',
    codeExplainer: 'Saisissez le code à 6 chiffres envoyé au {{phone}}.',
    devCodeLabel: "Aucun service SMS n'est configuré, voici donc votre code :",
    confirm: 'Se connecter',
    checking: 'Vérification…',
    changeNumber: 'Utiliser un autre numéro',
    genericError: "Une erreur s'est produite. Veuillez réessayer.",
    requiredToPost: 'Connectez-vous pour publier ici.',
  },
  scan: {
    title: 'Scannez le QR code',
    subtitle: 'Pointez votre caméra vers le code sur le dépliant',
    error: "Impossible de joindre le serveur. Vérifiez que le backend est démarré et réessayez.",
    simulateButton: 'Simuler un scan',
    codeLabel: 'Ou saisissez le code imprimé en dessous',
    codePlaceholder: 'Code du lieu',
    codeButton: 'Ouvrir ce lieu',
    codeNotFound: 'Aucun lieu n’utilise ce code. Vérifiez-le et réessayez.',
  },
  hub: {
    errorLoad: "Impossible de charger le contenu disponible ici. Rouvrez l'app pour réessayer.",
    noModules: "Aucun module n'est encore actif pour ce lieu.",
    locationNotSet: 'Emplacement non défini',
    donationsLabel: 'Dons',
    eventsLabel: 'Agenda',
    announcementsLabel: 'Actus',
    prayerRequestsLabel: 'Prière',
    livestreamLabel: 'Direct',
    communityLabel: 'Groupe',
    nextEvent: 'Prochain événement',
    upcomingEvents: 'À venir',
    pastEvents: 'Récemment',
    nextLivestream: 'Offices en direct',
    latestAnnouncements: 'Dernières annonces',
    seeAll: 'Tout voir',
    homeLabel: 'Accueil',
    moreLabel: 'Plus',
    switchPlace: 'Changer de lieu',
  },
  more: {
    title: 'Plus',
    prayerRequests: 'Intentions de prière',
    community: 'Notre groupe',
  },
  places: {
    title: 'Vos lieux',
    addPlace: 'Ajouter un lieu',
    appHome: 'Accueil ANSAE',
    close: 'Fermer',
  },
  donate: {
    title: 'Faire un don à {{poiName}}',
    subtitle: 'Chaque don aide notre communauté à s’épanouir.',
    chooseAmount: 'CHOISISSEZ UN MONTANT',
    customAmount: 'Montant personnalisé',
    donateButton: 'Donner {{amount}}',
    processingButton: 'Traitement…',
    footnote: 'Paiement sécurisé · Propulsé par Stripe',
    demoFootnote: 'Mode démonstration · Aucun paiement ne sera prélevé',
    payingTitle: 'Terminez votre don',
    payingMessage:
      'La page de paiement s’est ouverte dans le navigateur. Une fois le paiement effectué, revenez ici. Cet écran se met à jour tout seul.',
    openPaymentButton: 'Ouvrir la page de paiement',
    checkingPayment: 'En attente de votre paiement…',
    cancelButton: 'Annuler',
    error: 'Nous n’avons pas pu lancer le paiement. Veuillez réessayer.',
    thankYou: 'Merci !',
    confirmation: 'Votre don de {{amount}} à {{poiName}} a bien été effectué.',
    demoConfirmation:
      "Ceci est une démonstration — aucun paiement réel n'a été effectué. Un don de {{amount}} pour {{poiName}} a été enregistré.",
    doneButton: 'Terminé',
  },
  events: {
    title: 'Événements',
    watchLive: 'Regarder en direct',
    watchLiveHint: "Ce qui est diffusé maintenant et ce qui arrive",
    notifyOn: 'Désactiver les notifications pour {{title}}',
    notifyOff: 'Activer les notifications pour {{title}}',
    loading: 'Chargement…',
    error: "Impossible de charger les événements. Rouvrez l'app pour réessayer.",
    empty: "Aucun événement à venir pour l'instant.",
  },
  announcements: {
    title: 'Annonces',
    newAria: 'Nouvelle annonce',
    error: "Impossible de charger les annonces. Rouvrez l'app pour réessayer.",
    loading: 'Chargement…',
    empty: "Aucune annonce pour l'instant.",
    playVoice: 'Lire le message vocal',
    pauseVoice: 'Mettre en pause le message vocal',
  },
  composeAnnouncement: {
    title: 'Nouvelle annonce',
    titlePlaceholder: 'Titre',
    bodyPlaceholder: 'Écrivez un message (facultatif si vous en enregistrez un ci-dessous)…',
    voiceMessageLabel: 'MESSAGE VOCAL (FACULTATIF)',
    stop: 'Arrêter',
    recorded: 'Message vocal enregistré',
    reRecord: 'Réenregistrer',
    reRecordAria: "Supprimer l'enregistrement et recommencer",
    recordButton: 'Enregistrer un message vocal',
    recordAria: 'Enregistrer un message vocal',
    playPreviewAria: "Lire l'aperçu",
    pausePreviewAria: "Mettre en pause l'aperçu",
    postButton: "Publier l'annonce",
    postingButton: 'Publication…',
    micPermissionError: "L'autorisation du microphone est nécessaire pour enregistrer un message vocal.",
    startRecordingError: "Impossible de démarrer l'enregistrement sur cet appareil.",
    titleRequiredError: 'Veuillez ajouter un titre.',
    contentRequiredError: 'Ajoutez du texte ou enregistrez un message vocal.',
    genericError: "Une erreur s'est produite.",
  },
  prayerRequests: {
    title: 'Intentions de prière',
    messagePlaceholder: 'Partagez une intention de prière…',
    namePlaceholder: 'Votre nom (facultatif)',
    shareButton: "Partager l'intention",
    sharingButton: 'Partage…',
    error: "Impossible de charger les intentions de prière. Rouvrez l'app pour réessayer.",
    loading: 'Chargement…',
    prayingSuffix: 'prient',
    prayButton: 'Prier',
    prayAria: 'Je prie pour cette intention',
  },
  livestream: {
    title: 'Diffusion en direct',
    error: "Impossible de charger les diffusions. Rouvrez l'app pour réessayer.",
    loading: 'Chargement…',
    live: 'EN DIRECT',
    watch: 'Regarder',
    replay: 'Revoir',
    watchAria: 'Regarder {{title}}',
    replayAria: 'Revoir {{title}}',
  },
  community: {
    title: 'Communauté',
    messagePlaceholder: 'Démarrez une conversation…',
    namePlaceholder: 'Votre nom (facultatif)',
    postButton: 'Publier',
    postingButton: 'Publication…',
    error: "Impossible de charger la communauté. Rouvrez l'app pour réessayer.",
    loading: 'Chargement…',
    openAria: 'Ouvrir la discussion : {{message}}',
  },
  communityThread: {
    repliesLabel: 'RÉPONSES',
    error: "Impossible de charger les réponses. Rouvrez l'app pour réessayer.",
    loading: 'Chargement…',
    empty: 'Aucune réponse pour le moment — soyez le premier à répondre.',
    messagePlaceholder: 'Écrivez une réponse…',
    namePlaceholder: 'Votre nom (facultatif)',
    replyButton: 'Répondre',
    replyingButton: 'Envoi…',
  },
};

export const translations: Record<SupportedLanguage, Translations> = { en, es, fr };
