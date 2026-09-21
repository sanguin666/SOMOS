export type SupportedLanguage = 'en' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr'];

export type Translations = {
  common: {
    loading: string;
  };
  login: {
    heading: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    signIn: string;
    signingIn: string;
    genericError: string;
  };
  layout: {
    managing: string;
    language: string;
    signOut: string;
    navDonations: string;
    navEvents: string;
    navAnnouncements: string;
    navLivestreams: string;
    navPrayerRequests: string;
    navCommunity: string;
    navMyQr: string;
    navHomePage: string;
    navSettings: string;
    noAdminPois: string;
  };
  donations: {
    title: string;
    subtitle: string;
    thisWeek: string;
    thisMonth: string;
    averageGift: string;
    vsLastWeek: string;
    vsLastMonth: string;
    vsLastMonthAverage: string;
    dailyDonationsTitle: string;
    last30Days: string;
    viewAsTable: string;
    hideTableView: string;
    dateHeader: string;
    totalHeader: string;
    giftsHeader: string;
    giftWord: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    recentGiftsTitle: string;
    noDonations: string;
    anonymous: string;
    loadError: string;
    loading: string;
  };
  events: {
    title: string;
    subtitle: string;
    titleLabel: string;
    startsAtLabel: string;
    locationLabel: string;
    descriptionLabel: string;
    schedule: string;
    scheduling: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    loadError: string;
    createError: string;
    saveError: string;
    deleteError: string;
    loading: string;
    empty: string;
  };
  announcements: {
    title: string;
    subtitle: string;
    titleLabel: string;
    bodyLabel: string;
    publish: string;
    publishing: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    includesVoice: string;
    loadError: string;
    createError: string;
    saveError: string;
    deleteError: string;
    loading: string;
  };
  livestreams: {
    title: string;
    subtitle: string;
    titleLabel: string;
    urlLabel: string;
    scheduledAtLabel: string;
    schedule: string;
    scheduling: string;
    delete: string;
    loadError: string;
    createError: string;
    statusError: string;
    deleteError: string;
    loading: string;
    statusUpcoming: string;
    statusLive: string;
    statusEnded: string;
  };
  prayerRequests: {
    title: string;
    subtitle: string;
    remove: string;
    prayingSuffix: string;
    anonymous: string;
    empty: string;
    loadError: string;
    removeError: string;
    loading: string;
  };
  community: {
    title: string;
    subtitle: string;
    replies: string;
    hideReplies: string;
    removePost: string;
    removeReply: string;
    noReplies: string;
    loadingReplies: string;
    empty: string;
    anonymous: string;
    loadError: string;
    removePostError: string;
    removeReplyError: string;
    repliesLoadError: string;
    loading: string;
  };
  modules: {
    title: string;
    subtitle: string;
    modulesSectionTitle: string;
    activate: string;
    deactivate: string;
    notActivated: string;
    loadError: string;
    updateError: string;
    loading: string;
    contentLanguageTitle: string;
    contentLanguageSubtitle: string;
    saveLanguage: string;
    savingLanguage: string;
    languageSaveError: string;
  };
  moduleNames: {
    donations: string;
    events: string;
    announcements: string;
    prayerRequests: string;
    livestream: string;
    community: string;
  };
  poiInfo: {
    title: string;
    subtitle: string;
    nameLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    pictureUrlLabel: string;
    pictureUrlPlaceholder: string;
    pictureAlt: string;
    save: string;
    saving: string;
    saveError: string;
    saveSuccess: string;
  };
  homePage: {
    title: string;
    subtitle: string;
    loading: string;
    loadError: string;
    saveError: string;
    empty: string;
    useDefault: string;
    addSection: string;
    moveUp: string;
    moveDown: string;
    delete: string;
    save: string;
    saving: string;
    saved: string;
    headingLabel: string;
    captionLabel: string;
    textLabel: string;
    itemCountLabel: string;
    imageLabel: string;
    chooseImage: string;
    uploading: string;
    uploadError: string;
    autoNote: string;
    moduleOffNote: string;
    blockText: string;
    blockImage: string;
    blockNextEvents: string;
    blockPastEvents: string;
    blockLatestAnnouncements: string;
    blockNextLivestream: string;
    blockDonate: string;
  };
  qr: {
    title: string;
    subtitle: string;
    flyerHeadlineLabel: string;
    flyerSubtextLabel: string;
    defaultHeadline: string;
    defaultSubtext: string;
    save: string;
    saving: string;
    saveError: string;
    print: string;
    previewTitle: string;
    scanHint: string;
  };
};

const en: Translations = {
  common: {
    loading: 'Loading…',
  },
  login: {
    heading: 'ANSAE Admin',
    subtitle: 'Sign in to manage your parish content.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    genericError: 'Something went wrong. Try again.',
  },
  layout: {
    managing: 'Managing',
    language: 'Language',
    signOut: 'Sign out',
    navDonations: 'Donations',
    navEvents: 'Events',
    navAnnouncements: 'Announcements',
    navLivestreams: 'Livestreams',
    navPrayerRequests: 'Prayer Requests',
    navCommunity: 'Community',
    navMyQr: 'My QR',
    navHomePage: 'Home page',
    navSettings: 'Settings',
    noAdminPois: "Your account isn't an admin of any parish yet.",
  },
  donations: {
    title: 'Donations',
    subtitle: "How giving is trending for this parish.",
    thisWeek: 'This week',
    thisMonth: 'This month',
    averageGift: 'Average gift',
    vsLastWeek: 'last week',
    vsLastMonth: 'last month',
    vsLastMonthAverage: "last month's average",
    dailyDonationsTitle: 'Daily donations',
    last30Days: 'Last 30 days',
    viewAsTable: 'View as table',
    hideTableView: 'Hide table view',
    dateHeader: 'Date',
    totalHeader: 'Total',
    giftsHeader: 'Gifts',
    giftWord: 'gift',
    minutesAgo: '{{n}}m ago',
    hoursAgo: '{{n}}h ago',
    daysAgo: '{{n}}d ago',
    recentGiftsTitle: 'Recent gifts',
    noDonations: 'No donations yet.',
    anonymous: 'Anonymous',
    loadError: 'Could not load donation data.',
    loading: 'Loading…',
  },
  events: {
    title: 'Events',
    subtitle: "Schedule Masses, baptisms, weddings, and other events for this parish.",
    titleLabel: 'Title',
    startsAtLabel: 'Date & time',
    locationLabel: 'Location',
    descriptionLabel: 'Description',
    schedule: 'Schedule',
    scheduling: 'Scheduling…',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    loadError: 'Could not load events.',
    createError: 'Could not schedule the event.',
    saveError: 'Could not save changes.',
    deleteError: 'Could not delete the event.',
    loading: 'Loading…',
    empty: 'No events scheduled yet.',
  },
  announcements: {
    title: 'Announcements',
    subtitle: 'Post bulletin-style updates for this parish.',
    titleLabel: 'Title',
    bodyLabel: 'Body',
    publish: 'Publish',
    publishing: 'Publishing…',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    includesVoice: '🎙 Includes a voice message',
    loadError: 'Could not load announcements.',
    createError: 'Could not create the announcement.',
    saveError: 'Could not save changes.',
    deleteError: 'Could not delete the announcement.',
    loading: 'Loading…',
  },
  livestreams: {
    title: 'Livestreams',
    subtitle: 'Schedule a link to a livestreamed or recorded service.',
    titleLabel: 'Title',
    urlLabel: 'URL',
    scheduledAtLabel: 'Scheduled at',
    schedule: 'Schedule',
    scheduling: 'Scheduling…',
    delete: 'Delete',
    loadError: 'Could not load livestreams.',
    createError: 'Could not schedule the livestream.',
    statusError: 'Could not update the status.',
    deleteError: 'Could not delete the livestream.',
    loading: 'Loading…',
    statusUpcoming: 'upcoming',
    statusLive: 'live',
    statusEnded: 'ended',
  },
  prayerRequests: {
    title: 'Prayer Requests',
    subtitle: "Moderate what's shared publicly. Anyone can post here from the app.",
    remove: 'Remove',
    prayingSuffix: 'praying',
    anonymous: 'Anonymous',
    empty: 'No prayer requests yet.',
    loadError: 'Could not load prayer requests.',
    removeError: 'Could not remove that request.',
    loading: 'Loading…',
  },
  community: {
    title: 'Community',
    subtitle: 'Moderate posts and replies. Anyone can post here from the app.',
    replies: 'Replies',
    hideReplies: 'Hide replies',
    removePost: 'Remove post',
    removeReply: 'Remove',
    noReplies: 'No replies.',
    loadingReplies: 'Loading replies…',
    empty: 'No posts yet.',
    anonymous: 'Anonymous',
    loadError: 'Could not load community posts.',
    removePostError: 'Could not remove that post.',
    removeReplyError: 'Could not remove that reply.',
    repliesLoadError: 'Could not load replies.',
    loading: 'Loading…',
  },
  modules: {
    title: 'Settings',
    subtitle: "Manage this parish's active modules and public info.",
    modulesSectionTitle: 'Active modules',
    activate: 'Activate',
    deactivate: 'Deactivate',
    notActivated: 'not activated',
    loadError: 'Could not load modules.',
    updateError: 'Could not update this module.',
    loading: 'Loading…',
    contentLanguageTitle: 'Content language',
    contentLanguageSubtitle: "The language this parish publishes content in — announcements, events, and so on aren't translated for readers, only the app's own menus are.",
    saveLanguage: 'Save',
    savingLanguage: 'Saving…',
    languageSaveError: 'Could not update the content language.',
  },
  moduleNames: {
    donations: 'Donations',
    events: 'Events',
    announcements: 'Announcements',
    prayerRequests: 'Prayer Requests',
    livestream: 'Livestream',
    community: 'Community',
  },
  poiInfo: {
    title: 'Parish info',
    subtitle: 'Shown to congregants in the app.',
    nameLabel: 'Name',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'A short description of your parish or community.',
    pictureUrlLabel: 'Picture URL',
    pictureUrlPlaceholder: 'https://example.com/your-logo.jpg',
    pictureAlt: 'Parish picture',
    save: 'Save',
    saving: 'Saving…',
    saveError: 'Could not save your changes.',
    saveSuccess: 'Saved.',
  },
  homePage: {
    title: 'Home page',
    subtitle: 'What people see when they open your place, before they pick anything from the menu. Sections show in the order below.',
    loading: 'Loading the page…',
    loadError: "Couldn't load this page.",
    saveError: "Couldn't save that change.",
    empty: 'You have no sections yet, so people see a short default page: the next event and the latest announcements.',
    useDefault: 'Start from the default page',
    addSection: 'Add a section',
    moveUp: 'Move up',
    moveDown: 'Move down',
    delete: 'Remove',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    headingLabel: 'Heading (optional)',
    captionLabel: 'Caption (optional)',
    textLabel: 'Text',
    itemCountLabel: 'How many to show',
    imageLabel: 'Image',
    chooseImage: 'Choose an image',
    uploading: 'Uploading…',
    uploadError: "Couldn't upload that image.",
    autoNote: 'This section fills itself from what you publish — nothing to write here.',
    moduleOffNote: "This module is off, so this section won't show in the app.",
    blockText: 'Text',
    blockImage: 'Photo',
    blockNextEvents: 'Upcoming events',
    blockPastEvents: 'Past events',
    blockLatestAnnouncements: 'Latest announcements',
    blockNextLivestream: 'Next livestream',
    blockDonate: 'Donate button',
  },
  qr: {
    title: 'My QR',
    subtitle: 'A printable flyer with your QR code — put it up anywhere congregants can scan it to get the app and join your parish.',
    flyerHeadlineLabel: 'Flyer headline',
    flyerSubtextLabel: 'Flyer subtext',
    defaultHeadline: 'Scan to join us',
    defaultSubtext: 'Get the ANSAE app and stay connected with our parish — announcements, events, prayer requests, and more.',
    save: 'Save',
    saving: 'Saving…',
    saveError: 'Could not save your changes.',
    print: 'Print / Save as PDF',
    previewTitle: 'Flyer preview',
    scanHint: 'Scan with your phone camera',
  },
};

const es: Translations = {
  common: {
    loading: 'Cargando…',
  },
  login: {
    heading: 'ANSAE Admin',
    subtitle: 'Inicia sesión para gestionar el contenido de tu parroquia.',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando sesión…',
    genericError: 'Algo salió mal. Inténtalo de nuevo.',
  },
  layout: {
    managing: 'Administrando',
    language: 'Idioma',
    signOut: 'Cerrar sesión',
    navDonations: 'Donaciones',
    navEvents: 'Eventos',
    navAnnouncements: 'Anuncios',
    navLivestreams: 'Transmisiones',
    navPrayerRequests: 'Peticiones de oración',
    navCommunity: 'Comunidad',
    navMyQr: 'Mi código QR',
    navHomePage: 'Página de inicio',
    navSettings: 'Configuración',
    noAdminPois: 'Tu cuenta todavía no es administradora de ninguna parroquia.',
  },
  donations: {
    title: 'Donaciones',
    subtitle: 'Cómo evolucionan las donaciones en esta parroquia.',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mes',
    averageGift: 'Donativo promedio',
    vsLastWeek: 'la semana pasada',
    vsLastMonth: 'el mes pasado',
    vsLastMonthAverage: 'el promedio del mes pasado',
    dailyDonationsTitle: 'Donaciones diarias',
    last30Days: 'Últimos 30 días',
    viewAsTable: 'Ver como tabla',
    hideTableView: 'Ocultar tabla',
    dateHeader: 'Fecha',
    totalHeader: 'Total',
    giftsHeader: 'Donativos',
    giftWord: 'donativo',
    minutesAgo: 'hace {{n}} min',
    hoursAgo: 'hace {{n}} h',
    daysAgo: 'hace {{n}} d',
    recentGiftsTitle: 'Donativos recientes',
    noDonations: 'Todavía no hay donaciones.',
    anonymous: 'Anónimo',
    loadError: 'No se pudieron cargar los datos de donaciones.',
    loading: 'Cargando…',
  },
  events: {
    title: 'Eventos',
    subtitle: 'Programa misas, bautizos, bodas y otros eventos para esta parroquia.',
    titleLabel: 'Título',
    startsAtLabel: 'Fecha y hora',
    locationLabel: 'Lugar',
    descriptionLabel: 'Descripción',
    schedule: 'Programar',
    scheduling: 'Programando…',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    loadError: 'No se pudieron cargar los eventos.',
    createError: 'No se pudo programar el evento.',
    saveError: 'No se pudieron guardar los cambios.',
    deleteError: 'No se pudo eliminar el evento.',
    loading: 'Cargando…',
    empty: 'Todavía no hay eventos programados.',
  },
  announcements: {
    title: 'Anuncios',
    subtitle: 'Publica actualizaciones tipo boletín para esta parroquia.',
    titleLabel: 'Título',
    bodyLabel: 'Contenido',
    publish: 'Publicar',
    publishing: 'Publicando…',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    includesVoice: '🎙 Incluye un mensaje de voz',
    loadError: 'No se pudieron cargar los anuncios.',
    createError: 'No se pudo crear el anuncio.',
    saveError: 'No se pudieron guardar los cambios.',
    deleteError: 'No se pudo eliminar el anuncio.',
    loading: 'Cargando…',
  },
  livestreams: {
    title: 'Transmisiones',
    subtitle: 'Programa un enlace a un servicio en vivo o grabado.',
    titleLabel: 'Título',
    urlLabel: 'URL',
    scheduledAtLabel: 'Programado para',
    schedule: 'Programar',
    scheduling: 'Programando…',
    delete: 'Eliminar',
    loadError: 'No se pudieron cargar las transmisiones.',
    createError: 'No se pudo programar la transmisión.',
    statusError: 'No se pudo actualizar el estado.',
    deleteError: 'No se pudo eliminar la transmisión.',
    loading: 'Cargando…',
    statusUpcoming: 'próxima',
    statusLive: 'en vivo',
    statusEnded: 'finalizada',
  },
  prayerRequests: {
    title: 'Peticiones de oración',
    subtitle: 'Modera lo que se comparte públicamente. Cualquiera puede publicar aquí desde la app.',
    remove: 'Eliminar',
    prayingSuffix: 'orando',
    anonymous: 'Anónimo',
    empty: 'Todavía no hay peticiones de oración.',
    loadError: 'No se pudieron cargar las peticiones de oración.',
    removeError: 'No se pudo eliminar esa petición.',
    loading: 'Cargando…',
  },
  community: {
    title: 'Comunidad',
    subtitle: 'Modera publicaciones y respuestas. Cualquiera puede publicar aquí desde la app.',
    replies: 'Respuestas',
    hideReplies: 'Ocultar respuestas',
    removePost: 'Eliminar publicación',
    removeReply: 'Eliminar',
    noReplies: 'Sin respuestas.',
    loadingReplies: 'Cargando respuestas…',
    empty: 'Todavía no hay publicaciones.',
    anonymous: 'Anónimo',
    loadError: 'No se pudieron cargar las publicaciones de la comunidad.',
    removePostError: 'No se pudo eliminar esa publicación.',
    removeReplyError: 'No se pudo eliminar esa respuesta.',
    repliesLoadError: 'No se pudieron cargar las respuestas.',
    loading: 'Cargando…',
  },
  modules: {
    title: 'Configuración',
    subtitle: 'Gestiona los módulos activos y la información pública de esta parroquia.',
    modulesSectionTitle: 'Módulos activos',
    activate: 'Activar',
    deactivate: 'Desactivar',
    notActivated: 'no activado',
    loadError: 'No se pudieron cargar los módulos.',
    updateError: 'No se pudo actualizar este módulo.',
    loading: 'Cargando…',
    contentLanguageTitle: 'Idioma del contenido',
    contentLanguageSubtitle: 'El idioma en que esta parroquia publica su contenido: anuncios, eventos, etc. no se traducen para los lectores, solo los menús de la propia app.',
    saveLanguage: 'Guardar',
    savingLanguage: 'Guardando…',
    languageSaveError: 'No se pudo actualizar el idioma del contenido.',
  },
  moduleNames: {
    donations: 'Donaciones',
    events: 'Eventos',
    announcements: 'Anuncios',
    prayerRequests: 'Peticiones de oración',
    livestream: 'Transmisión en vivo',
    community: 'Comunidad',
  },
  poiInfo: {
    title: 'Información de la parroquia',
    subtitle: 'Se muestra a los feligreses en la app.',
    nameLabel: 'Nombre',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Una breve descripción de tu parroquia o comunidad.',
    pictureUrlLabel: 'URL de la imagen',
    pictureUrlPlaceholder: 'https://ejemplo.com/tu-logo.jpg',
    pictureAlt: 'Imagen de la parroquia',
    save: 'Guardar',
    saving: 'Guardando…',
    saveError: 'No se pudieron guardar los cambios.',
    saveSuccess: 'Guardado.',
  },
  homePage: {
    title: 'Página de inicio',
    subtitle: 'Lo que ve la gente al abrir tu lugar, antes de elegir algo del menú. Las secciones aparecen en el orden de abajo.',
    loading: 'Cargando la página…',
    loadError: 'No se pudo cargar esta página.',
    saveError: 'No se pudo guardar ese cambio.',
    empty: 'Todavía no tienes secciones, así que la gente ve una página breve por defecto: el próximo evento y los últimos anuncios.',
    useDefault: 'Empezar con la página por defecto',
    addSection: 'Añadir una sección',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    delete: 'Quitar',
    save: 'Guardar',
    saving: 'Guardando…',
    saved: 'Guardado',
    headingLabel: 'Título (opcional)',
    captionLabel: 'Pie de foto (opcional)',
    textLabel: 'Texto',
    itemCountLabel: 'Cuántos mostrar',
    imageLabel: 'Imagen',
    chooseImage: 'Elegir una imagen',
    uploading: 'Subiendo…',
    uploadError: 'No se pudo subir esa imagen.',
    autoNote: 'Esta sección se rellena sola con lo que publicas: aquí no hay nada que escribir.',
    moduleOffNote: 'Este módulo está desactivado, así que esta sección no aparecerá en la app.',
    blockText: 'Texto',
    blockImage: 'Foto',
    blockNextEvents: 'Próximos eventos',
    blockPastEvents: 'Eventos pasados',
    blockLatestAnnouncements: 'Últimos anuncios',
    blockNextLivestream: 'Próxima transmisión',
    blockDonate: 'Botón de donar',
  },
  qr: {
    title: 'Mi código QR',
    subtitle: 'Un folleto imprimible con tu código QR: colócalo donde los feligreses puedan escanearlo para obtener la app y unirse a tu parroquia.',
    flyerHeadlineLabel: 'Título del folleto',
    flyerSubtextLabel: 'Texto del folleto',
    defaultHeadline: 'Escanea para unirte',
    defaultSubtext: 'Obtén la app ANSAE y mantente conectado con nuestra parroquia: anuncios, eventos, peticiones de oración y más.',
    save: 'Guardar',
    saving: 'Guardando…',
    saveError: 'No se pudieron guardar los cambios.',
    print: 'Imprimir / Guardar como PDF',
    previewTitle: 'Vista previa del folleto',
    scanHint: 'Escanea con la cámara de tu teléfono',
  },
};

const fr: Translations = {
  common: {
    loading: 'Chargement…',
  },
  login: {
    heading: 'ANSAE Admin',
    subtitle: 'Connectez-vous pour gérer le contenu de votre paroisse.',
    emailLabel: 'E-mail',
    passwordLabel: 'Mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion…',
    genericError: "Une erreur s'est produite. Réessayez.",
  },
  layout: {
    managing: 'Gestion de',
    language: 'Langue',
    signOut: 'Se déconnecter',
    navDonations: 'Dons',
    navEvents: 'Événements',
    navAnnouncements: 'Annonces',
    navLivestreams: 'Diffusions',
    navPrayerRequests: 'Intentions de prière',
    navCommunity: 'Communauté',
    navMyQr: 'Mon code QR',
    navHomePage: "Page d'accueil",
    navSettings: 'Paramètres',
    noAdminPois: "Votre compte n'est encore administrateur d'aucune paroisse.",
  },
  donations: {
    title: 'Dons',
    subtitle: "L'évolution des dons pour cette paroisse.",
    thisWeek: 'Cette semaine',
    thisMonth: 'Ce mois-ci',
    averageGift: 'Don moyen',
    vsLastWeek: 'la semaine dernière',
    vsLastMonth: 'le mois dernier',
    vsLastMonthAverage: 'la moyenne du mois dernier',
    dailyDonationsTitle: 'Dons quotidiens',
    last30Days: 'Les 30 derniers jours',
    viewAsTable: 'Voir sous forme de tableau',
    hideTableView: 'Masquer le tableau',
    dateHeader: 'Date',
    totalHeader: 'Total',
    giftsHeader: 'Dons',
    giftWord: 'don',
    minutesAgo: 'il y a {{n}} min',
    hoursAgo: 'il y a {{n}} h',
    daysAgo: 'il y a {{n}} j',
    recentGiftsTitle: 'Dons récents',
    noDonations: 'Aucun don pour le moment.',
    anonymous: 'Anonyme',
    loadError: 'Impossible de charger les données de dons.',
    loading: 'Chargement…',
  },
  events: {
    title: 'Événements',
    subtitle: 'Planifiez les messes, baptêmes, mariages et autres événements de cette paroisse.',
    titleLabel: 'Titre',
    startsAtLabel: 'Date et heure',
    locationLabel: 'Lieu',
    descriptionLabel: 'Description',
    schedule: 'Planifier',
    scheduling: 'Planification…',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    loadError: 'Impossible de charger les événements.',
    createError: "Impossible de planifier l'événement.",
    saveError: 'Impossible d’enregistrer les modifications.',
    deleteError: "Impossible de supprimer l'événement.",
    loading: 'Chargement…',
    empty: "Aucun événement prévu pour l'instant.",
  },
  announcements: {
    title: 'Annonces',
    subtitle: 'Publiez des mises à jour de type bulletin pour cette paroisse.',
    titleLabel: 'Titre',
    bodyLabel: 'Contenu',
    publish: 'Publier',
    publishing: 'Publication…',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    includesVoice: '🎙 Inclut un message vocal',
    loadError: 'Impossible de charger les annonces.',
    createError: "Impossible de créer l'annonce.",
    saveError: 'Impossible d’enregistrer les modifications.',
    deleteError: "Impossible de supprimer l'annonce.",
    loading: 'Chargement…',
  },
  livestreams: {
    title: 'Diffusions',
    subtitle: 'Planifiez un lien vers un service en direct ou enregistré.',
    titleLabel: 'Titre',
    urlLabel: 'URL',
    scheduledAtLabel: 'Programmé pour',
    schedule: 'Planifier',
    scheduling: 'Planification…',
    delete: 'Supprimer',
    loadError: 'Impossible de charger les diffusions.',
    createError: 'Impossible de planifier la diffusion.',
    statusError: "Impossible de mettre à jour le statut.",
    deleteError: 'Impossible de supprimer la diffusion.',
    loading: 'Chargement…',
    statusUpcoming: 'à venir',
    statusLive: 'en direct',
    statusEnded: 'terminée',
  },
  prayerRequests: {
    title: 'Intentions de prière',
    subtitle: "Modérez ce qui est partagé publiquement. Tout le monde peut publier ici depuis l'app.",
    remove: 'Supprimer',
    prayingSuffix: 'prient',
    anonymous: 'Anonyme',
    empty: "Aucune intention de prière pour l'instant.",
    loadError: 'Impossible de charger les intentions de prière.',
    removeError: 'Impossible de supprimer cette intention.',
    loading: 'Chargement…',
  },
  community: {
    title: 'Communauté',
    subtitle: "Modérez les publications et réponses. Tout le monde peut publier ici depuis l'app.",
    replies: 'Réponses',
    hideReplies: 'Masquer les réponses',
    removePost: 'Supprimer la publication',
    removeReply: 'Supprimer',
    noReplies: 'Aucune réponse.',
    loadingReplies: 'Chargement des réponses…',
    empty: "Aucune publication pour l'instant.",
    anonymous: 'Anonyme',
    loadError: 'Impossible de charger les publications de la communauté.',
    removePostError: 'Impossible de supprimer cette publication.',
    removeReplyError: 'Impossible de supprimer cette réponse.',
    repliesLoadError: 'Impossible de charger les réponses.',
    loading: 'Chargement…',
  },
  modules: {
    title: 'Paramètres',
    subtitle: "Gérez les modules actifs et les informations publiques de cette paroisse.",
    modulesSectionTitle: 'Modules actifs',
    activate: 'Activer',
    deactivate: 'Désactiver',
    notActivated: 'non activé',
    loadError: 'Impossible de charger les modules.',
    updateError: 'Impossible de mettre à jour ce module.',
    loading: 'Chargement…',
    contentLanguageTitle: 'Langue du contenu',
    contentLanguageSubtitle: "La langue dans laquelle cette paroisse publie son contenu — annonces, événements, etc. ne sont pas traduits pour les lecteurs, seuls les menus de l'app le sont.",
    saveLanguage: 'Enregistrer',
    savingLanguage: 'Enregistrement…',
    languageSaveError: 'Impossible de mettre à jour la langue du contenu.',
  },
  moduleNames: {
    donations: 'Dons',
    events: 'Événements',
    announcements: 'Annonces',
    prayerRequests: 'Intentions de prière',
    livestream: 'Diffusion en direct',
    community: 'Communauté',
  },
  poiInfo: {
    title: 'Informations de la paroisse',
    subtitle: "Affichées aux paroissiens dans l'app.",
    nameLabel: 'Nom',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Une courte description de votre paroisse ou communauté.',
    pictureUrlLabel: 'URL de la photo',
    pictureUrlPlaceholder: 'https://exemple.com/votre-logo.jpg',
    pictureAlt: 'Photo de la paroisse',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saveError: 'Impossible d’enregistrer les modifications.',
    saveSuccess: 'Enregistré.',
  },
  homePage: {
    title: "Page d'accueil",
    subtitle: "Ce que les gens voient en ouvrant votre lieu, avant de choisir quoi que ce soit dans le menu. Les sections s'affichent dans l'ordre ci-dessous.",
    loading: 'Chargement de la page…',
    loadError: 'Impossible de charger cette page.',
    saveError: "Impossible d'enregistrer cette modification.",
    empty: "Vous n'avez pas encore de sections, donc les gens voient une page courte par défaut : le prochain événement et les dernières annonces.",
    useDefault: 'Partir de la page par défaut',
    addSection: 'Ajouter une section',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    delete: 'Retirer',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré',
    headingLabel: 'Titre (facultatif)',
    captionLabel: 'Légende (facultative)',
    textLabel: 'Texte',
    itemCountLabel: 'Combien en afficher',
    imageLabel: 'Image',
    chooseImage: 'Choisir une image',
    uploading: 'Envoi…',
    uploadError: "Impossible d'envoyer cette image.",
    autoNote: 'Cette section se remplit toute seule avec ce que vous publiez — rien à écrire ici.',
    moduleOffNote: "Ce module est désactivé, donc cette section n'apparaîtra pas dans l'app.",
    blockText: 'Texte',
    blockImage: 'Photo',
    blockNextEvents: 'Prochains événements',
    blockPastEvents: 'Événements passés',
    blockLatestAnnouncements: 'Dernières annonces',
    blockNextLivestream: 'Prochaine diffusion',
    blockDonate: 'Bouton de don',
  },
  qr: {
    title: 'Mon code QR',
    subtitle: "Un flyer imprimable avec votre code QR — affichez-le partout où les paroissiens peuvent le scanner pour obtenir l'app et rejoindre votre paroisse.",
    flyerHeadlineLabel: 'Titre du flyer',
    flyerSubtextLabel: 'Texte du flyer',
    defaultHeadline: 'Scannez pour nous rejoindre',
    defaultSubtext: "Téléchargez l'app ANSAE et restez connecté à notre paroisse : annonces, événements, intentions de prière, et plus encore.",
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saveError: 'Impossible d’enregistrer les modifications.',
    print: 'Imprimer / Enregistrer en PDF',
    previewTitle: 'Aperçu du flyer',
    scanHint: 'Scannez avec l’appareil photo de votre téléphone',
  },
};

export const translations: Record<SupportedLanguage, Translations> = { en, es, fr };
