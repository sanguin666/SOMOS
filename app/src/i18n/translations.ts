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
    unknownCode: string;
    enableCamera: string;
    cameraExplainer: string;
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
    requestsLabel: string;
    massIntentionsLabel: string;
    celebrationTimes: string;
    nextMass: string;
  };
  more: {
    title: string;
    prayerRequests: string;
    community: string;
    leavePlace: string;
    leaveQuestion: string;
    leaveExplainer: string;
    leaveConfirm: string;
    leaveCancel: string;
    leaveError: string;
    chooseLanguage: string;
  };
  profile: {
    title: string;
    openSignedOut: string;
    pictureLabel: string;
    addPicture: string;
    changePicture: string;
    choosePhoto: string;
    takePhoto: string;
    cancel: string;
    nameLabel: string;
    firstNameLabel: string;
    lastNameLabel: string;
    save: string;
    saving: string;
    saved: string;
    noName: string;
    signedOutExplainer: string;
    laterLabel: string;
    permissionDenied: string;
    error: string;
  };
  onboarding: {
    welcome: string;
    signUp: string;
    signIn: string;
  };
  addPlace: {
    title: string;
    codeLabel: string;
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
    purposeLabel: string;
    purposeGeneral: string;
    purposeCollection: string;
    purposeCollectionHint: string;
    campaignProgress: string;
    frequencyLabel: string;
    once: string;
    monthly: string;
    monthlyHint: string;
    monthlySignIn: string;
    receiptToggle: string;
    receiptHint: string;
    nameLabel: string;
    addressLabel: string;
    postalCodeLabel: string;
    cityLabel: string;
    taxIdLabel: string;
    donateMonthlyButton: string;
    monthlyConfirmation: string;
    myMonthly: string;
    monthlyAmount: string;
    since: string;
    stopMonthly: string;
    stopQuestion: string;
    stopConfirm: string;
    stopKeep: string;
    myReceipts: string;
    openReceipt: string;
    receiptFor: string;
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
  badges: {
    today: string;
    tomorrow: string;
    mass: string;
    confession: string;
    officeOpen: string;
    officeClosed: string;
    until: string;
    opens: string;
    raised: string;
    give: string;
  };
  schedule: {
    everyWeek: string;
    comingUp: string;
    today: string;
    tomorrow: string;
    category_mass: string;
    category_confession: string;
    category_adoration: string;
    category_prayer: string;
    category_office_hours: string;
    category_other: string;
  };
  requests: {
    title: string;
    subtitle: string;
    newButton: string;
    empty: string;
    error: string;
    type_baptism: string;
    type_wedding: string;
    type_funeral: string;
    type_first_communion: string;
    type_confirmation: string;
    type_certificate: string;
    type_meeting: string;
    type_blessing: string;
    type_sick_visit: string;
    type_other: string;
    status_received: string;
    status_in_progress: string;
    status_appointment_set: string;
    status_completed: string;
    status_cancelled: string;
    unread: string;
    documentsPendingOne: string;
    documentsPendingMany: string;
    sentOn: string;
    newTitle: string;
    chooseType: string;
    nameLabel: string;
    phoneLabel: string;
    dateLabel: string;
    datePlaceholder: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    send: string;
    sending: string;
    actionError: string;
    appointment: string;
    documents: string;
    doc_pending: string;
    doc_sent: string;
    doc_received: string;
    sendPhoto: string;
    sendAnother: string;
    takePhoto: string;
    choosePhoto: string;
    cancelChoice: string;
    openFile: string;
    yourRequest: string;
    preferredDate: string;
    messages: string;
    noMessages: string;
    office: string;
    you: string;
    messageLabel: string;
    attach: string;
    photo: string;
    removeAttachment: string;
    sendMessage: string;
    cancelRequest: string;
    cancelQuestion: string;
    cancelConfirm: string;
    cancelKeep: string;
    permissionDenied: string;
  };
  intentions: {
    title: string;
    subtitle: string;
    intentionLabel: string;
    intentionPlaceholder: string;
    nameLabel: string;
    contactLabel: string;
    whichMass: string;
    whenever: string;
    offering: string;
    offeringFixed: string;
    offeringNone: string;
    noOffering: string;
    submit: string;
    submitWithOffering: string;
    error: string;
    payingTitle: string;
    thankYou: string;
    confirmedFor: string;
    confirmedWhenever: string;
    another: string;
    mine: string;
    status_pending_payment: string;
    status_confirmed: string;
    status_celebrated: string;
    status_cancelled: string;
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
    unknownCode: "That code isn't an Ansae place. Look for the QR on the community's flyer.",
    enableCamera: 'Use the camera',
    cameraExplainer: 'Turn on the camera to scan, or type the code below.',
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
    requestsLabel: 'Requests',
    massIntentionsLabel: 'Intentions',
    celebrationTimes: 'Celebration times',
    nextMass: 'Next Mass',
  },
  more: {
    title: 'More',
    prayerRequests: 'Prayer requests',
    community: 'Our group',
    leavePlace: 'Leave this place',
    leaveQuestion: 'Leave {{poiName}}?',
    leaveExplainer: 'It will be removed from your places. You can come back any time by scanning its QR code again.',
    leaveConfirm: 'Yes, leave',
    leaveCancel: 'No, stay',
    leaveError: "We couldn't do that. Please try again.",
    chooseLanguage: 'Choose a language',
  },
  profile: {
    title: 'Your settings',
    openSignedOut: 'Sign in',
    pictureLabel: 'Your picture',
    addPicture: 'Add a picture',
    changePicture: 'Change picture',
    choosePhoto: 'Choose a photo',
    takePhoto: 'Take a photo',
    cancel: 'Cancel',
    nameLabel: 'Your name',
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    noName: 'No name yet',
    signedOutExplainer: 'Sign in to set your name and your picture.',
    laterLabel: 'More settings are coming here later.',
    permissionDenied: 'ANSAE needs permission to open your photos. You can allow it in your phone settings.',
    error: "That didn't save. Please try again.",
  },
  onboarding: {
    welcome: 'Welcome',
    signUp: 'Sign up',
    signIn: 'Sign in',
  },
  addPlace: {
    title: 'Add the place you belong to.',
    codeLabel: 'Or type the place number printed on the flyer',
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
    purposeLabel: 'WHAT IS IT FOR?',
    purposeGeneral: 'Where it is most needed',
    purposeCollection: 'The collection',
    purposeCollectionHint: 'Your part of the Sunday collection, from wherever you are.',
    campaignProgress: '{{raised}} raised of {{goal}}',
    frequencyLabel: 'HOW OFTEN?',
    once: 'Once',
    monthly: 'Every month',
    monthlyHint: 'Taken each month by card. You can stop it here at any time.',
    monthlySignIn: 'Sign in to give every month, so you can stop it whenever you like.',
    receiptToggle: 'I would like a tax receipt',
    receiptHint: 'One receipt a year, adding up all your gifts.',
    nameLabel: 'Full name',
    addressLabel: 'Address',
    postalCodeLabel: 'Postcode',
    cityLabel: 'Town or city',
    taxIdLabel: 'Tax number (optional)',
    donateMonthlyButton: 'Give {{amount}} a month',
    monthlyConfirmation: 'Your gift of {{amount}} a month to {{poiName}} is set up. Thank you for your faithfulness.',
    myMonthly: 'MY MONTHLY GIFTS',
    monthlyAmount: '{{amount}} a month',
    since: 'since {{date}}',
    stopMonthly: 'Stop this monthly gift',
    stopQuestion: 'Stop giving every month?',
    stopConfirm: 'Yes, stop it',
    stopKeep: 'No, keep it',
    myReceipts: 'MY TAX RECEIPTS',
    openReceipt: 'Open',
    receiptFor: 'Receipt for {{year}}, {{amount}}',
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
  badges: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    mass: 'Mass',
    confession: 'Confessions',
    officeOpen: 'Office open',
    officeClosed: 'Office closed',
    until: 'until {{time}}',
    opens: 'opens {{when}}',
    raised: '{{percent}}% raised',
    give: 'Give',
  },
  schedule: {
    everyWeek: 'EVERY WEEK',
    comingUp: 'COMING UP',
    today: 'Today',
    tomorrow: 'Tomorrow',
    category_mass: 'Masses',
    category_confession: 'Confessions',
    category_adoration: 'Adoration',
    category_prayer: 'Prayer',
    category_office_hours: 'Office hours',
    category_other: 'Also every week',
  },
  requests: {
    title: 'Requests',
    subtitle: 'Ask the office for a sacrament, a certificate or a meeting, and follow it here.',
    newButton: 'Make a request',
    empty: 'You have not made any request yet.',
    error: 'Could not load your requests. Please try again.',
    type_baptism: 'Baptism',
    type_wedding: 'Wedding',
    type_funeral: 'Funeral',
    type_first_communion: 'First Communion',
    type_confirmation: 'Confirmation',
    type_certificate: 'A certificate (baptism, marriage…)',
    type_meeting: 'Meet a priest',
    type_blessing: 'A blessing (home, object)',
    type_sick_visit: 'Visit someone who is ill',
    type_other: 'Something else',
    status_received: 'Received',
    status_in_progress: 'In progress',
    status_appointment_set: 'Appointment set',
    status_completed: 'Completed',
    status_cancelled: 'Cancelled',
    unread: 'New reply from the office',
    documentsPendingOne: '1 document to send',
    documentsPendingMany: '{{count}} documents to send',
    sentOn: 'Sent on {{date}}',
    newTitle: 'New request',
    chooseType: 'WHAT IS IT FOR?',
    nameLabel: 'Your name',
    phoneLabel: 'Phone, to call you back',
    dateLabel: 'Preferred date (optional)',
    datePlaceholder: 'e.g. a Saturday in June',
    detailsLabel: 'Tell us more',
    detailsPlaceholder: 'Who it is for, and anything the office should know',
    send: 'Send the request',
    sending: 'Sending…',
    actionError: 'That did not work. Please try again.',
    appointment: 'YOUR APPOINTMENT',
    documents: 'DOCUMENTS REQUESTED',
    doc_pending: 'To send',
    doc_sent: 'Sent, waiting for the office',
    doc_received: 'Received',
    sendPhoto: 'Send a photo',
    sendAnother: 'Send another photo',
    takePhoto: 'Take a photo',
    choosePhoto: 'Choose a photo',
    cancelChoice: 'Cancel',
    openFile: 'Open {{name}}',
    yourRequest: 'YOUR REQUEST',
    preferredDate: 'Preferred date: {{date}}',
    messages: 'MESSAGES',
    noMessages: 'No messages yet. The office will write to you here.',
    office: 'The office',
    you: 'You',
    messageLabel: 'Write to the office',
    attach: 'Attach a photo',
    photo: 'Photo',
    removeAttachment: 'Remove the photo',
    sendMessage: 'Send',
    cancelRequest: 'Cancel this request',
    cancelQuestion: 'Cancel this request?',
    cancelConfirm: 'Yes, cancel it',
    cancelKeep: 'No, keep it',
    permissionDenied: 'ANSAE needs access to your photos or camera for this. You can allow it in your phone’s settings.',
  },
  intentions: {
    title: 'Mass intentions',
    subtitle: 'Ask for a Mass to be offered for someone: a loved one who has died, someone who is ill, a thanksgiving.',
    intentionLabel: 'For whom, or for what?',
    intentionPlaceholder: 'e.g. For the repose of the soul of Jean Martin',
    nameLabel: 'Your name',
    contactLabel: 'Phone or email (optional)',
    whichMass: 'WHICH MASS?',
    whenever: 'Whenever the community can',
    offering: 'OFFERING',
    offeringFixed: 'The offering asked by the community is {{amount}}, paid by card.',
    offeringNone: 'The community asks for no offering.',
    noOffering: 'No offering',
    submit: 'Send the intention',
    submitWithOffering: 'Send, with {{amount}}',
    error: 'The intention could not be sent. Please try again.',
    payingTitle: 'Complete your offering',
    thankYou: 'Thank you',
    confirmedFor: 'Your intention will be prayed at the Mass on {{when}}.',
    confirmedWhenever: 'Your intention has been received. The community will choose the Mass.',
    another: 'Ask for another intention',
    mine: 'MY INTENTIONS',
    status_pending_payment: 'Waiting for payment',
    status_confirmed: 'Planned',
    status_celebrated: 'Celebrated',
    status_cancelled: 'Cancelled',
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
    unknownCode: 'Ese código no es un lugar de Ansae. Busca el QR en el cartel de la comunidad.',
    enableCamera: 'Usar la cámara',
    cameraExplainer: 'Activa la cámara para escanear, o escribe el código abajo.',
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
    requestsLabel: 'Solicitudes',
    massIntentionsLabel: 'Intenciones',
    celebrationTimes: 'Horarios de celebraciones',
    nextMass: 'Próxima misa',
  },
  more: {
    title: 'Más',
    prayerRequests: 'Peticiones de oración',
    community: 'Nuestro grupo',
    leavePlace: 'Salir de este lugar',
    leaveQuestion: '¿Salir de {{poiName}}?',
    leaveExplainer: 'Se quitará de tus lugares. Puedes volver cuando quieras escaneando otra vez su código QR.',
    leaveConfirm: 'Sí, salir',
    leaveCancel: 'No, quedarme',
    leaveError: 'No hemos podido hacerlo. Inténtalo de nuevo.',
    chooseLanguage: 'Elige un idioma',
  },
  profile: {
    title: 'Tus ajustes',
    openSignedOut: 'Iniciar sesión',
    pictureLabel: 'Tu foto',
    addPicture: 'Añadir una foto',
    changePicture: 'Cambiar la foto',
    choosePhoto: 'Elegir una foto',
    takePhoto: 'Hacer una foto',
    cancel: 'Cancelar',
    nameLabel: 'Tu nombre',
    firstNameLabel: 'Nombre',
    lastNameLabel: 'Apellido',
    save: 'Guardar',
    saving: 'Guardando…',
    saved: 'Guardado',
    noName: 'Todavía sin nombre',
    signedOutExplainer: 'Inicia sesión para poner tu nombre y tu foto.',
    laterLabel: 'Aquí habrá más ajustes más adelante.',
    permissionDenied: 'ANSAE necesita permiso para abrir tus fotos. Puedes darlo en los ajustes del teléfono.',
    error: 'No se pudo guardar. Inténtalo de nuevo.',
  },
  onboarding: {
    welcome: 'Bienvenido',
    signUp: 'Crear cuenta',
    signIn: 'Iniciar sesión',
  },
  addPlace: {
    title: 'Añade el lugar al que perteneces.',
    codeLabel: 'O escribe el número del lugar impreso en el folleto',
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
    purposeLabel: '¿PARA QUÉ?',
    purposeGeneral: 'Donde más se necesite',
    purposeCollection: 'La colecta',
    purposeCollectionHint: 'Tu parte de la colecta del domingo, estés donde estés.',
    campaignProgress: '{{raised}} recaudados de {{goal}}',
    frequencyLabel: '¿CON QUÉ FRECUENCIA?',
    once: 'Una vez',
    monthly: 'Cada mes',
    monthlyHint: 'Se cobra cada mes con tarjeta. Puedes pararlo aquí cuando quieras.',
    monthlySignIn: 'Inicia sesión para donar cada mes y poder pararlo cuando quieras.',
    receiptToggle: 'Quiero un certificado fiscal',
    receiptHint: 'Un certificado al año con todos tus donativos.',
    nameLabel: 'Nombre y apellidos',
    addressLabel: 'Dirección',
    postalCodeLabel: 'Código postal',
    cityLabel: 'Localidad',
    taxIdLabel: 'NIF (necesario para la deducción)',
    donateMonthlyButton: 'Donar {{amount}} al mes',
    monthlyConfirmation: 'Tu donativo de {{amount}} al mes para {{poiName}} está en marcha. Gracias por tu fidelidad.',
    myMonthly: 'MIS DONATIVOS MENSUALES',
    monthlyAmount: '{{amount}} al mes',
    since: 'desde {{date}}',
    stopMonthly: 'Parar este donativo mensual',
    stopQuestion: '¿Dejar de donar cada mes?',
    stopConfirm: 'Sí, pararlo',
    stopKeep: 'No, mantenerlo',
    myReceipts: 'MIS CERTIFICADOS',
    openReceipt: 'Abrir',
    receiptFor: 'Certificado de {{year}}, {{amount}}',
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
  badges: {
    today: 'Hoy',
    tomorrow: 'Mañana',
    mass: 'Misa',
    confession: 'Confesiones',
    officeOpen: 'Despacho abierto',
    officeClosed: 'Despacho cerrado',
    until: 'hasta las {{time}}',
    opens: 'abre {{when}}',
    raised: '{{percent}} % recaudado',
    give: 'Donar',
  },
  schedule: {
    everyWeek: 'CADA SEMANA',
    comingUp: 'PRÓXIMAMENTE',
    today: 'Hoy',
    tomorrow: 'Mañana',
    category_mass: 'Misas',
    category_confession: 'Confesiones',
    category_adoration: 'Adoración',
    category_prayer: 'Oración',
    category_office_hours: 'Horario de despacho',
    category_other: 'También cada semana',
  },
  requests: {
    title: 'Solicitudes',
    subtitle: 'Pide al despacho un sacramento, un certificado o una cita, y síguelo aquí.',
    newButton: 'Hacer una solicitud',
    empty: 'Todavía no has hecho ninguna solicitud.',
    error: 'No se pudieron cargar tus solicitudes. Inténtalo de nuevo.',
    type_baptism: 'Bautizo',
    type_wedding: 'Boda',
    type_funeral: 'Funeral',
    type_first_communion: 'Primera comunión',
    type_confirmation: 'Confirmación',
    type_certificate: 'Un certificado (bautismo, matrimonio…)',
    type_meeting: 'Hablar con un sacerdote',
    type_blessing: 'Una bendición (casa, objeto)',
    type_sick_visit: 'Visitar a un enfermo',
    type_other: 'Otra cosa',
    status_received: 'Recibida',
    status_in_progress: 'En curso',
    status_appointment_set: 'Cita fijada',
    status_completed: 'Completada',
    status_cancelled: 'Cancelada',
    unread: 'Nueva respuesta del despacho',
    documentsPendingOne: '1 documento por enviar',
    documentsPendingMany: '{{count}} documentos por enviar',
    sentOn: 'Enviada el {{date}}',
    newTitle: 'Nueva solicitud',
    chooseType: '¿PARA QUÉ ES?',
    nameLabel: 'Tu nombre',
    phoneLabel: 'Teléfono, para llamarte',
    dateLabel: 'Fecha deseada (opcional)',
    datePlaceholder: 'p. ej. un sábado de junio',
    detailsLabel: 'Cuéntanos más',
    detailsPlaceholder: 'Para quién es y lo que el despacho debe saber',
    send: 'Enviar la solicitud',
    sending: 'Enviando…',
    actionError: 'No ha funcionado. Inténtalo de nuevo.',
    appointment: 'TU CITA',
    documents: 'DOCUMENTOS SOLICITADOS',
    doc_pending: 'Por enviar',
    doc_sent: 'Enviado, pendiente del despacho',
    doc_received: 'Recibido',
    sendPhoto: 'Enviar una foto',
    sendAnother: 'Enviar otra foto',
    takePhoto: 'Hacer una foto',
    choosePhoto: 'Elegir una foto',
    cancelChoice: 'Cancelar',
    openFile: 'Abrir {{name}}',
    yourRequest: 'TU SOLICITUD',
    preferredDate: 'Fecha deseada: {{date}}',
    messages: 'MENSAJES',
    noMessages: 'Todavía no hay mensajes. El despacho te escribirá aquí.',
    office: 'El despacho',
    you: 'Tú',
    messageLabel: 'Escribir al despacho',
    attach: 'Adjuntar una foto',
    photo: 'Foto',
    removeAttachment: 'Quitar la foto',
    sendMessage: 'Enviar',
    cancelRequest: 'Cancelar esta solicitud',
    cancelQuestion: '¿Cancelar esta solicitud?',
    cancelConfirm: 'Sí, cancelarla',
    cancelKeep: 'No, mantenerla',
    permissionDenied: 'ANSAE necesita acceso a tus fotos o a la cámara. Puedes permitirlo en los ajustes del teléfono.',
  },
  intentions: {
    title: 'Intenciones de misa',
    subtitle: 'Pide que se ofrezca una misa por alguien: un ser querido fallecido, un enfermo, una acción de gracias.',
    intentionLabel: '¿Por quién o por qué?',
    intentionPlaceholder: 'p. ej. Por el eterno descanso de Juan García',
    nameLabel: 'Tu nombre',
    contactLabel: 'Teléfono o correo (opcional)',
    whichMass: '¿EN QUÉ MISA?',
    whenever: 'Cuando la comunidad pueda',
    offering: 'OFRENDA',
    offeringFixed: 'La ofrenda que pide la comunidad es de {{amount}}, con tarjeta.',
    offeringNone: 'La comunidad no pide ofrenda.',
    noOffering: 'Sin ofrenda',
    submit: 'Enviar la intención',
    submitWithOffering: 'Enviar, con {{amount}}',
    error: 'No se pudo enviar la intención. Inténtalo de nuevo.',
    payingTitle: 'Completa tu ofrenda',
    thankYou: 'Gracias',
    confirmedFor: 'Tu intención se rezará en la misa del {{when}}.',
    confirmedWhenever: 'Tu intención se ha recibido. La comunidad elegirá la misa.',
    another: 'Pedir otra intención',
    mine: 'MIS INTENCIONES',
    status_pending_payment: 'Pendiente de pago',
    status_confirmed: 'Prevista',
    status_celebrated: 'Celebrada',
    status_cancelled: 'Cancelada',
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
    unknownCode: "Ce code n'est pas un lieu Ansae. Cherchez le QR code sur l'affiche de la communauté.",
    enableCamera: 'Utiliser la caméra',
    cameraExplainer: 'Activez la caméra pour scanner, ou saisissez le code ci-dessous.',
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
    requestsLabel: 'Demandes',
    massIntentionsLabel: 'Intentions',
    celebrationTimes: 'Horaires des célébrations',
    nextMass: 'Prochaine messe',
  },
  more: {
    title: 'Plus',
    prayerRequests: 'Intentions de prière',
    community: 'Notre groupe',
    leavePlace: 'Quitter ce lieu',
    leaveQuestion: 'Quitter {{poiName}} ?',
    leaveExplainer: 'Il sera retiré de vos lieux. Vous pourrez revenir quand vous voulez en scannant à nouveau son code QR.',
    leaveConfirm: 'Oui, quitter',
    leaveCancel: 'Non, rester',
    leaveError: 'Nous n’avons pas pu le faire. Réessayez.',
    chooseLanguage: 'Choisissez une langue',
  },
  profile: {
    title: 'Vos réglages',
    openSignedOut: 'Se connecter',
    pictureLabel: 'Votre photo',
    addPicture: 'Ajouter une photo',
    changePicture: 'Changer la photo',
    choosePhoto: 'Choisir une photo',
    takePhoto: 'Prendre une photo',
    cancel: 'Annuler',
    nameLabel: 'Votre nom',
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré',
    noName: 'Pas encore de nom',
    signedOutExplainer: 'Connectez-vous pour indiquer votre nom et votre photo.',
    laterLabel: 'D’autres réglages arriveront ici plus tard.',
    permissionDenied: 'ANSAE a besoin d’accéder à vos photos. Vous pouvez l’autoriser dans les réglages du téléphone.',
    error: 'L’enregistrement a échoué. Réessayez.',
  },
  onboarding: {
    welcome: 'Bienvenue',
    signUp: 'S’inscrire',
    signIn: 'Se connecter',
  },
  addPlace: {
    title: 'Ajoutez le lieu auquel vous appartenez.',
    codeLabel: 'Ou saisissez le numéro du lieu imprimé sur le dépliant',
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
    purposeLabel: 'POUR QUOI ?',
    purposeGeneral: 'Là où c’est le plus utile',
    purposeCollection: 'La quête',
    purposeCollectionHint: 'Votre part de la quête du dimanche, où que vous soyez.',
    campaignProgress: '{{raised}} collectés sur {{goal}}',
    frequencyLabel: 'À QUEL RYTHME ?',
    once: 'Une fois',
    monthly: 'Chaque mois',
    monthlyHint: 'Prélevé chaque mois par carte. Vous pouvez l’arrêter ici à tout moment.',
    monthlySignIn: 'Connectez-vous pour donner chaque mois et pouvoir l’arrêter quand vous voulez.',
    receiptToggle: 'Je souhaite un reçu fiscal',
    receiptHint: 'Un reçu par an, qui additionne tous vos dons.',
    nameLabel: 'Nom et prénom',
    addressLabel: 'Adresse',
    postalCodeLabel: 'Code postal',
    cityLabel: 'Ville',
    taxIdLabel: 'N° fiscal (facultatif)',
    donateMonthlyButton: 'Donner {{amount}} par mois',
    monthlyConfirmation: 'Votre don de {{amount}} par mois à {{poiName}} est en place. Merci pour votre fidélité.',
    myMonthly: 'MES DONS MENSUELS',
    monthlyAmount: '{{amount}} par mois',
    since: 'depuis {{date}}',
    stopMonthly: 'Arrêter ce don mensuel',
    stopQuestion: 'Arrêter le don mensuel ?',
    stopConfirm: 'Oui, l’arrêter',
    stopKeep: 'Non, le garder',
    myReceipts: 'MES REÇUS FISCAUX',
    openReceipt: 'Ouvrir',
    receiptFor: 'Reçu {{year}}, {{amount}}',
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
  badges: {
    today: 'Auj.',
    tomorrow: 'Demain',
    mass: 'Messe',
    confession: 'Confessions',
    officeOpen: 'Accueil ouvert',
    officeClosed: 'Accueil fermé',
    until: 'jusqu’à {{time}}',
    opens: 'ouvre {{when}}',
    raised: '{{percent}} % collectés',
    give: 'Faire un don',
  },
  schedule: {
    everyWeek: 'CHAQUE SEMAINE',
    comingUp: 'À VENIR',
    today: 'Aujourd’hui',
    tomorrow: 'Demain',
    category_mass: 'Messes',
    category_confession: 'Confessions',
    category_adoration: 'Adoration',
    category_prayer: 'Prière',
    category_office_hours: 'Accueil',
    category_other: 'Aussi chaque semaine',
  },
  requests: {
    title: 'Demandes',
    subtitle: 'Demandez un sacrement, un certificat ou un rendez-vous, et suivez-le ici.',
    newButton: 'Faire une demande',
    empty: 'Vous n’avez encore fait aucune demande.',
    error: 'Impossible de charger vos demandes. Réessayez.',
    type_baptism: 'Baptême',
    type_wedding: 'Mariage',
    type_funeral: 'Obsèques',
    type_first_communion: 'Première communion',
    type_confirmation: 'Confirmation',
    type_certificate: 'Un certificat (baptême, mariage…)',
    type_meeting: 'Rencontrer un prêtre',
    type_blessing: 'Une bénédiction (maison, objet)',
    type_sick_visit: 'Visite à un malade',
    type_other: 'Autre demande',
    status_received: 'Reçue',
    status_in_progress: 'En cours',
    status_appointment_set: 'Rendez-vous fixé',
    status_completed: 'Terminée',
    status_cancelled: 'Annulée',
    unread: 'Nouvelle réponse de l’accueil',
    documentsPendingOne: '1 document à fournir',
    documentsPendingMany: '{{count}} documents à fournir',
    sentOn: 'Envoyée le {{date}}',
    newTitle: 'Nouvelle demande',
    chooseType: 'C’EST POUR QUOI ?',
    nameLabel: 'Votre nom',
    phoneLabel: 'Téléphone, pour vous rappeler',
    dateLabel: 'Date souhaitée (facultatif)',
    datePlaceholder: 'ex. un samedi de juin',
    detailsLabel: 'Précisez votre demande',
    detailsPlaceholder: 'Pour qui, et ce que l’accueil doit savoir',
    send: 'Envoyer la demande',
    sending: 'Envoi…',
    actionError: 'Cela n’a pas marché. Réessayez.',
    appointment: 'VOTRE RENDEZ-VOUS',
    documents: 'PIÈCES DEMANDÉES',
    doc_pending: 'À fournir',
    doc_sent: 'Envoyé, en attente de l’accueil',
    doc_received: 'Reçu',
    sendPhoto: 'Envoyer une photo',
    sendAnother: 'Envoyer une autre photo',
    takePhoto: 'Prendre une photo',
    choosePhoto: 'Choisir une photo',
    cancelChoice: 'Annuler',
    openFile: 'Ouvrir {{name}}',
    yourRequest: 'VOTRE DEMANDE',
    preferredDate: 'Date souhaitée : {{date}}',
    messages: 'MESSAGES',
    noMessages: 'Pas encore de message. L’accueil vous écrira ici.',
    office: 'L’accueil',
    you: 'Vous',
    messageLabel: 'Écrire à l’accueil',
    attach: 'Joindre une photo',
    photo: 'Photo',
    removeAttachment: 'Retirer la photo',
    sendMessage: 'Envoyer',
    cancelRequest: 'Annuler cette demande',
    cancelQuestion: 'Annuler cette demande ?',
    cancelConfirm: 'Oui, l’annuler',
    cancelKeep: 'Non, la garder',
    permissionDenied: 'ANSAE a besoin d’accéder à vos photos ou à l’appareil photo. Vous pouvez l’autoriser dans les réglages du téléphone.',
  },
  intentions: {
    title: 'Intentions de messe',
    subtitle: 'Faites célébrer une messe pour quelqu’un : un défunt, un malade, une action de grâce.',
    intentionLabel: 'Pour qui, ou pour quoi ?',
    intentionPlaceholder: 'ex. Pour le repos de l’âme de Jean Martin',
    nameLabel: 'Votre nom',
    contactLabel: 'Téléphone ou e-mail (facultatif)',
    whichMass: 'À QUELLE MESSE ?',
    whenever: 'Dès que la communauté le peut',
    offering: 'OFFRANDE',
    offeringFixed: 'L’offrande demandée par la communauté est de {{amount}}, réglée par carte.',
    offeringNone: 'La communauté ne demande pas d’offrande.',
    noOffering: 'Sans offrande',
    submit: 'Envoyer l’intention',
    submitWithOffering: 'Envoyer, avec {{amount}}',
    error: 'L’intention n’a pas pu être envoyée. Réessayez.',
    payingTitle: 'Réglez votre offrande',
    thankYou: 'Merci',
    confirmedFor: 'Votre intention sera portée à la messe du {{when}}.',
    confirmedWhenever: 'Votre intention est bien reçue. La communauté choisira la messe.',
    another: 'Demander une autre intention',
    mine: 'MES INTENTIONS',
    status_pending_payment: 'En attente de paiement',
    status_confirmed: 'Prévue',
    status_celebrated: 'Célébrée',
    status_cancelled: 'Annulée',
  },
};

export const translations: Record<SupportedLanguage, Translations> = { en, es, fr };
