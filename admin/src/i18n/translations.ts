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
    navAnnouncements: string;
    navLivestreams: string;
    navPrayerRequests: string;
    navCommunity: string;
    navModules: string;
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
};

const en: Translations = {
  common: {
    loading: 'Loading…',
  },
  login: {
    heading: 'myPeople Admin',
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
    navAnnouncements: 'Announcements',
    navLivestreams: 'Livestreams',
    navPrayerRequests: 'Prayer Requests',
    navCommunity: 'Community',
    navModules: 'Modules',
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
    title: 'Modules',
    subtitle: "Turn features on or off for this parish's app experience.",
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
};

const es: Translations = {
  common: {
    loading: 'Cargando…',
  },
  login: {
    heading: 'myPeople Admin',
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
    navAnnouncements: 'Anuncios',
    navLivestreams: 'Transmisiones',
    navPrayerRequests: 'Peticiones de oración',
    navCommunity: 'Comunidad',
    navModules: 'Módulos',
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
    title: 'Módulos',
    subtitle: 'Activa o desactiva funciones para la experiencia de esta parroquia en la app.',
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
};

const fr: Translations = {
  common: {
    loading: 'Chargement…',
  },
  login: {
    heading: 'myPeople Admin',
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
    navAnnouncements: 'Annonces',
    navLivestreams: 'Diffusions',
    navPrayerRequests: 'Intentions de prière',
    navCommunity: 'Communauté',
    navModules: 'Modules',
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
    title: 'Modules',
    subtitle: "Activez ou désactivez des fonctionnalités pour l'app de cette paroisse.",
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
};

export const translations: Record<SupportedLanguage, Translations> = { en, es, fr };
