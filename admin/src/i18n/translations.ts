export type SupportedLanguage = 'en' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr'];

export type Translations = {
  common: {
    loading: string;
    yes: string;
    cancel: string;
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
    chooseLanguage: string;
    choosePlace: string;
    close: string;
    signOut: string;
    navDonations: string;
    navEvents: string;
    navAnnouncements: string;
    navLivestreams: string;
    navPrayerRequests: string;
    navCommunity: string;
    navMyQr: string;
    navHomePage: string;
    navDashboard: string;
    navSettings: string;
    noAdminPois: string;
    navRequests: string;
    navMassIntentions: string;
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
    purposeGeneral: string;
    purposeCollection: string;
    purposeCampaign: string;
    purposeCampaignNamed: string;
    purposeMassIntention: string;
    monthly: string;
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
    categoryLabel: string;
    categoryMass: string;
    categoryConfession: string;
    categoryAdoration: string;
    categoryPrayer: string;
    categoryOfficeHours: string;
    categoryOther: string;
    recurrenceLabel: string;
    recurrenceNone: string;
    recurrenceWeekly: string;
    firstStartsAtLabel: string;
    endTimeLabel: string;
    repeatUntilLabel: string;
    everyWeekday: string;
    fromDate: string;
    untilDate: string;
    weeklyHeading: string;
    weeklyHint: string;
    onceHeading: string;
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
    requests: string;
    massIntentions: string;
  };
  menuOrder: {
    title: string;
    subtitle: string;
    onBar: string;
    underMore: string;
    insideEvents: string;
    moveUp: string;
    moveDown: string;
    save: string;
    saving: string;
    saved: string;
    saveError: string;
    empty: string;
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
    blockCelebrationTimes: string;
    celebrationTimesNote: string;
    sectionsTitle: string;
  };
  dashboard: {
    title: string;
    greeting: string;
    loading: string;
    loadError: string;
    todoTitle: string;
    todoTitleCount: string;
    allDone: string;
    newRequests: string;
    awaitingReply: string;
    documentsToCheck: string;
    intentionsToMark: string;
    expiredMessages: string;
    actionOpen: string;
    actionReply: string;
    actionCheck: string;
    actionMark: string;
    actionEdit: string;
    andMore: string;
    mass: string;
    figuresTitle: string;
    donationsThisMonth: string;
    vsLastMonth: string;
    noComparison: string;
    members: string;
    newThisWeek: string;
    prayerRequests: string;
    thisWeek: string;
    weekTitle: string;
    weekEmpty: string;
    weekMore: string;
    intentionToRead: string;
    intentionsToRead: string;
    appointment: string;
  };
  preview: {
    title: string;
    frameTitle: string;
    languageLabel: string;
    hint: string;
    notRunning: string;
  };
  badges: {
    title: string;
    loading: string;
    loadError: string;
    saveError: string;
    deleteError: string;
    kindMessage: string;
    kindAuto: string;
    nextMassTitle: string;
    officeHoursTitle: string;
    nextConfessionTitle: string;
    campaignTitle: string;
    fromCalendar: string;
    fromOfficeHours: string;
    campaignNote: string;
    campaignLabel: string;
    latestCampaign: string;
    styleNormal: string;
    styleImportant: string;
    styleImportantShort: string;
    until: string;
    ended: string;
    opens: string;
    moveUp: string;
    moveDown: string;
    edit: string;
    delete: string;
    showLabel: string;
    orderNote: string;
    addTitle: string;
    editTitle: string;
    textLabel: string;
    textPlaceholder: string;
    styleLabel: string;
    linkLabel: string;
    linkNone: string;
    untilLabel: string;
    add: string;
    save: string;
    saving: string;
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
  requests: {
    title: string;
    subtitle: string;
    filterLabel: string;
    filterOpen: string;
    filterClosed: string;
    filterAll: string;
    loading: string;
    empty: string;
    loadError: string;
    loadOneError: string;
    open: string;
    askedOn: string;
    appointmentOn: string;
    unread: string;
    documentsPendingOne: string;
    documentsPendingMany: string;
    backToList: string;
    contactLabel: string;
    accountLabel: string;
    noName: string;
    preferredDateLabel: string;
    detailsLabel: string;
    statusHeading: string;
    statusLabel: string;
    statusReceived: string;
    statusInProgress: string;
    statusAppointmentSet: string;
    statusCompleted: string;
    statusCancelled: string;
    appointmentAtLabel: string;
    appointmentPlaceLabel: string;
    appointmentPlacePlaceholder: string;
    statusHint: string;
    save: string;
    saving: string;
    saved: string;
    saveError: string;
    documentsHeading: string;
    noDocuments: string;
    awaited: string;
    receivedOn: string;
    openFile: string;
    markReceived: string;
    markNotReceived: string;
    removeDocument: string;
    askHeading: string;
    documentLabel: string;
    documentPlaceholder: string;
    documentNoteLabel: string;
    ask: string;
    asking: string;
    documentError: string;
    conversationHeading: string;
    noMessages: string;
    fromOffice: string;
    office: string;
    messageLabel: string;
    attachmentLabel: string;
    send: string;
    sending: string;
    sendHint: string;
    sendError: string;
    typeBaptism: string;
    typeWedding: string;
    typeFuneral: string;
    typeFirstCommunion: string;
    typeConfirmation: string;
    typeCertificate: string;
    typeMeeting: string;
    typeBlessing: string;
    typeSickVisit: string;
    typeOther: string;
  };
  massIntentions: {
    title: string;
    subtitle: string;
    addTitle: string;
    intentionLabel: string;
    intentionPlaceholder: string;
    requesterNameLabel: string;
    requesterContactLabel: string;
    celebrationLabel: string;
    noDate: string;
    otherDate: string;
    otherAtLabel: string;
    otherTitleLabel: string;
    otherTitlePlaceholder: string;
    offeringReceivedLabel: string;
    add: string;
    adding: string;
    addError: string;
    registerTitle: string;
    filterLabel: string;
    filterUpcoming: string;
    filterAll: string;
    print: string;
    printTitle: string;
    loading: string;
    empty: string;
    loadError: string;
    noDateHeading: string;
    askedBy: string;
    fromOffice: string;
    fromApp: string;
    statusCelebrated: string;
    statusCancelled: string;
    markCelebrated: string;
    markAllCelebrated: string;
    move: string;
    saveMove: string;
    cancelIntention: string;
    putBack: string;
    saveError: string;
    offeringTitle: string;
    offeringHint: string;
    offeringLabel: string;
    offeringPlaceholder: string;
    saveOffering: string;
    saving: string;
    saved: string;
    offeringError: string;
  };
  campaigns: {
    title: string;
    subtitle: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    goalLabel: string;
    endsOnLabel: string;
    create: string;
    creating: string;
    save: string;
    edit: string;
    delete: string;
    shown: string;
    hidden: string;
    hide: string;
    show: string;
    raised: string;
    raisedOfGoal: string;
    giftCountOne: string;
    giftCountMany: string;
    progressLabel: string;
    endsOn: string;
    loading: string;
    empty: string;
    loadError: string;
    createError: string;
    saveError: string;
    deleteError: string;
  };
  receipts: {
    title: string;
    subtitle: string;
    legalTitle: string;
    legalHint: string;
    legalNameLabel: string;
    legalTaxIdLabel: string;
    legalAddressLabel: string;
    signatoryLabel: string;
    signatoryPlaceholder: string;
    save: string;
    saving: string;
    saved: string;
    legalLoadError: string;
    legalSaveError: string;
    yearLabel: string;
    exportCsv: string;
    loading: string;
    empty: string;
    loadError: string;
    noName: string;
    giftCountOne: string;
    giftCountMany: string;
    openReceipt: string;
  };
};

const en: Translations = {
  common: {
    loading: 'Loading…',
    yes: 'Yes',
    cancel: 'Cancel',
  },
  login: {
    heading: 'ANSAE Admin',
    subtitle: 'Sign in to manage your community.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    genericError: 'Something went wrong. Try again.',
  },
  layout: {
    managing: 'Managing',
    language: 'Language',
    chooseLanguage: 'Choose a language',
    choosePlace: 'Choose a place',
    close: 'Close',
    signOut: 'Sign out',
    navDonations: 'Donations',
    navEvents: 'Events',
    navAnnouncements: 'Announcements',
    navLivestreams: 'Livestreams',
    navPrayerRequests: 'Prayer Requests',
    navCommunity: 'Community',
    navMyQr: 'My QR',
    navHomePage: 'Home page',
    navDashboard: 'Dashboard',
    navSettings: 'Settings',
    noAdminPois: "Your account isn't an admin of any community yet.",
    navRequests: 'Requests',
    navMassIntentions: 'Mass intentions',
  },
  donations: {
    title: 'Donations',
    subtitle: "How giving is trending for this community.",
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
    purposeGeneral: 'Gift to the community',
    purposeCollection: 'Collection',
    purposeCampaign: 'Campaign',
    purposeCampaignNamed: 'Campaign: {{title}}',
    purposeMassIntention: 'Mass intention offering',
    monthly: 'Monthly',
  },
  events: {
    title: 'Events',
    subtitle: "Schedule services, baptisms, weddings, and other events for this community.",
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
    categoryLabel: 'Kind',
    categoryMass: 'Mass',
    categoryConfession: 'Confession',
    categoryAdoration: 'Adoration',
    categoryPrayer: 'Prayer',
    categoryOfficeHours: 'Office hours',
    categoryOther: 'Other',
    recurrenceLabel: 'Repeats',
    recurrenceNone: 'Only once',
    recurrenceWeekly: 'Every week',
    firstStartsAtLabel: 'First date & time',
    endTimeLabel: 'Ends at (optional)',
    repeatUntilLabel: 'Last date (optional — leave empty to keep it going)',
    everyWeekday: 'Every {{day}}',
    fromDate: 'from {{date}}',
    untilDate: 'until {{date}}',
    weeklyHeading: 'Every week',
    weeklyHint: "Your community's regular week. The app shows it as your timetable, and the Celebration times section of your home page is built from it.",
    onceHeading: 'Dates',
  },
  announcements: {
    title: 'Announcements',
    subtitle: 'Post bulletin-style updates for this community.',
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
    subtitle: "Manage this community's active modules and public info.",
    modulesSectionTitle: 'Active modules',
    activate: 'Activate',
    deactivate: 'Deactivate',
    notActivated: 'not activated',
    loadError: 'Could not load modules.',
    updateError: 'Could not update this module.',
    loading: 'Loading…',
    contentLanguageTitle: 'Content language',
    contentLanguageSubtitle: "The language this community publishes content in — announcements, events, and so on aren't translated for readers, only the app's own menus are.",
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
    requests: 'Requests & appointments',
    massIntentions: 'Mass intentions',
  },
  menuOrder: {
    title: 'Bottom menu order',
    subtitle:
      'The app gives the first modules on this list a button of their own at the bottom of the screen and puts the rest under More. Put what your people use most at the top.',
    onBar: 'On the menu',
    underMore: 'Under More',
    insideEvents: 'Inside Events',
    moveUp: 'Move up',
    moveDown: 'Move down',
    save: 'Save order',
    saving: 'Saving…',
    saved: 'Menu order saved.',
    saveError: 'Could not save the menu order.',
    empty: 'Activate a module below to arrange the menu.',
  },
  poiInfo: {
    title: 'Community info',
    subtitle: 'Shown to members in the app.',
    nameLabel: 'Name',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'A short description of your community.',
    pictureUrlLabel: 'Picture URL',
    pictureUrlPlaceholder: 'https://example.com/your-logo.jpg',
    pictureAlt: 'Community picture',
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
    blockCelebrationTimes: 'Celebration times',
    celebrationTimesNote: 'This section is built from your weekly events (Masses, confessions, office hours): set their kind and "Every week" on the Events page.',
    sectionsTitle: 'Page sections',
  },
  dashboard: {
    title: 'Dashboard',
    greeting: 'Hello {{name}}',
    loading: 'Loading…',
    loadError: 'The dashboard could not be loaded. Try again in a moment.',
    todoTitle: 'To do',
    todoTitleCount: 'To do ({{n}})',
    allDone: 'All up to date. Nothing is waiting on the team.',
    newRequests: 'New requests to open',
    awaitingReply: 'Members waiting for an answer',
    documentsToCheck: 'Documents received to check',
    intentionsToMark: 'Mass intentions to tick off as said',
    expiredMessages: 'Home page messages past their last day',
    actionOpen: 'Open',
    actionReply: 'Reply',
    actionCheck: 'Check',
    actionMark: 'Tick off',
    actionEdit: 'Edit',
    andMore: 'and {{n}} more',
    mass: 'Mass',
    figuresTitle: 'Key figures',
    donationsThisMonth: 'Donations this month',
    vsLastMonth: '{{pct}}% on last month, same date',
    noComparison: 'Nothing to compare with last month',
    members: 'Members',
    newThisWeek: '+{{n}} this week',
    prayerRequests: 'Prayer requests',
    thisWeek: 'this week',
    weekTitle: 'This week',
    weekEmpty: 'Nothing planned in the next seven days.',
    weekMore: '{{n}} more in Events',
    intentionToRead: '1 intention to read',
    intentionsToRead: '{{n}} intentions to read',
    appointment: 'Appointment: {{what}}',
  },
  preview: {
    title: 'Live preview',
    frameTitle: 'Preview of the home page on a phone',
    languageLabel: 'Preview language',
    hint: 'What a member sees when they open your place. You can scroll the phone. Dashed outlines show what is not saved yet.',
    notRunning: 'The app is not running, so there is nothing to preview. Start it with start.bat, then reload this page.',
  },
  badges: {
    title: 'Badges at the top of the page',
    loading: 'Loading the badges…',
    loadError: "Couldn't load the badges.",
    saveError: "Couldn't save that change.",
    deleteError: "Couldn't delete that badge.",
    kindMessage: 'Message',
    kindAuto: 'Auto',
    nextMassTitle: 'Next Mass',
    officeHoursTitle: 'Office open / closed',
    nextConfessionTitle: 'Next confessions',
    campaignTitle: 'Donation campaign',
    fromCalendar: 'Worked out from the calendar',
    fromOfficeHours: 'From the office hours in the calendar',
    campaignNote: 'Percentage raised',
    campaignLabel: 'Campaign',
    latestCampaign: 'The most recent',
    styleNormal: 'Normal',
    styleImportant: 'Important (orange)',
    styleImportantShort: 'Important',
    until: 'until {{date}}',
    ended: 'ended {{date}}',
    opens: 'opens {{module}}',
    moveUp: 'Move up',
    moveDown: 'Move down',
    edit: 'Edit',
    delete: 'Delete',
    showLabel: 'Show “{{name}}”',
    orderNote: 'Use ↑ ↓ to change the order. Every badge switched on shows, in this order.',
    addTitle: 'Add a message',
    editTitle: 'Edit the message',
    textLabel: 'Text ({{n}} characters at most)',
    textPlaceholder: 'Church closed Monday 29th',
    styleLabel: 'Style',
    linkLabel: 'On tap, open',
    linkNone: 'Nothing',
    untilLabel: 'Show until (optional)',
    add: 'Add the badge',
    save: 'Save',
    saving: 'Saving…',
  },
  qr: {
    title: 'My QR',
    subtitle: 'A printable flyer with your QR code — put it up anywhere people can scan it to get the app and join your community.',
    flyerHeadlineLabel: 'Flyer headline',
    flyerSubtextLabel: 'Flyer subtext',
    defaultHeadline: 'Scan to join us',
    defaultSubtext: 'Get the ANSAE app and stay connected with our community — announcements, events, prayer requests, and more.',
    save: 'Save',
    saving: 'Saving…',
    saveError: 'Could not save your changes.',
    print: 'Print / Save as PDF',
    previewTitle: 'Flyer preview',
    scanHint: 'Scan with your phone camera',
  },
  requests: {
    title: 'Requests',
    subtitle: 'What members ask the community for from the app — a baptism, a wedding, a certificate, a meeting — and everything that follows: status, appointment, documents and messages.',
    filterLabel: 'Show',
    filterOpen: 'Still open',
    filterClosed: 'Done or cancelled',
    filterAll: 'All',
    loading: 'Loading…',
    empty: 'No requests here.',
    loadError: 'Could not load the requests.',
    loadOneError: 'Could not load this request.',
    open: 'Open',
    askedOn: 'asked on {{date}}',
    appointmentOn: 'appointment {{date}}',
    unread: 'New from the member',
    documentsPendingOne: '1 document awaited',
    documentsPendingMany: '{{n}} documents awaited',
    backToList: 'All requests',
    contactLabel: 'Contact',
    accountLabel: 'Asked from the account of',
    noName: 'No name given',
    preferredDateLabel: 'When they would like it',
    detailsLabel: 'What they wrote',
    statusHeading: 'Status and appointment',
    statusLabel: 'Status',
    statusReceived: 'Received',
    statusInProgress: 'In progress',
    statusAppointmentSet: 'Appointment set',
    statusCompleted: 'Done',
    statusCancelled: 'Cancelled',
    appointmentAtLabel: 'Appointment (date & time)',
    appointmentPlaceLabel: 'Appointment place',
    appointmentPlacePlaceholder: 'The office, the sacristy…',
    statusHint: 'The member sees the status and the appointment in the app. Setting a date on its own marks the request as "Appointment set".',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved.',
    saveError: 'Could not save your changes.',
    documentsHeading: 'Documents',
    noDocuments: 'No documents asked for yet.',
    awaited: 'Awaited',
    receivedOn: 'Received on {{date}}',
    openFile: 'Open {{name}}',
    markReceived: 'Mark as received',
    markNotReceived: 'Mark as not received',
    removeDocument: 'Remove',
    askHeading: 'Ask the member for a document',
    documentLabel: 'Document',
    documentPlaceholder: 'e.g. Birth certificate of the child',
    documentNoteLabel: 'Note for the member (optional)',
    ask: 'Ask for it',
    asking: 'Asking…',
    documentError: 'Could not update the documents.',
    conversationHeading: 'Conversation',
    noMessages: 'No messages yet.',
    fromOffice: '{{name}} (office)',
    office: 'The office',
    messageLabel: 'Your message',
    attachmentLabel: 'Attach a photo or a PDF (optional)',
    send: 'Send',
    sending: 'Sending…',
    sendHint: 'The member reads it in the app.',
    sendError: 'Could not send the message.',
    typeBaptism: 'Baptism',
    typeWedding: 'Wedding',
    typeFuneral: 'Funeral',
    typeFirstCommunion: 'First Communion',
    typeConfirmation: 'Confirmation',
    typeCertificate: 'Certificate',
    typeMeeting: 'Meeting',
    typeBlessing: 'Blessing',
    typeSickVisit: 'Visit to a sick person',
    typeOther: 'Other',
  },
  massIntentions: {
    title: 'Mass intentions',
    subtitle: 'The Masses said for someone, asked for from the app or at the office, listed by celebration for the celebrant.',
    addTitle: 'Add one taken at the office',
    intentionLabel: 'Intention',
    intentionPlaceholder: 'e.g. For John Carter, who died last month',
    requesterNameLabel: 'Asked by',
    requesterContactLabel: 'Phone or email (optional)',
    celebrationLabel: 'Celebration',
    noDate: 'No date — whenever the community can',
    otherDate: 'Another date…',
    otherAtLabel: 'Date & time',
    otherTitleLabel: 'Celebration name',
    otherTitlePlaceholder: 'Sunday Mass',
    offeringReceivedLabel: 'Offering received ({{currency}}, optional)',
    add: 'Add to the register',
    adding: 'Adding…',
    addError: 'Could not add the intention.',
    registerTitle: 'Register',
    filterLabel: 'Show',
    filterUpcoming: 'Still to be said',
    filterAll: 'All, with celebrated and cancelled',
    print: 'Print the list',
    printTitle: 'Mass intentions',
    loading: 'Loading…',
    empty: 'No intentions here.',
    loadError: 'Could not load the intentions.',
    noDateHeading: 'No date chosen',
    askedBy: 'asked by {{name}}',
    fromOffice: 'at the office',
    fromApp: 'from the app',
    statusCelebrated: 'Celebrated',
    statusCancelled: 'Cancelled',
    markCelebrated: 'Mark as celebrated',
    markAllCelebrated: 'Mark all {{n}} as celebrated',
    move: 'Move',
    saveMove: 'Save',
    cancelIntention: 'Take off the list',
    putBack: 'Put back on the list',
    saveError: 'Could not save the change.',
    offeringTitle: 'Offering',
    offeringHint: 'What one intention costs when asked for from the app, as your diocese sets it. Leave it empty to let people choose what to give.',
    offeringLabel: 'Offering for one intention ({{currency}})',
    offeringPlaceholder: 'People choose',
    saveOffering: 'Save',
    saving: 'Saving…',
    saved: 'Saved.',
    offeringError: 'Could not save the offering.',
  },
  campaigns: {
    title: 'Campaigns',
    subtitle: 'Projects your community raises money for — the roof, the organ, a pilgrimage. Members can give to them from the app and see how close you are.',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g. New roof',
    descriptionLabel: 'Description (optional)',
    goalLabel: 'Goal ({{currency}}, optional)',
    endsOnLabel: 'End date (optional)',
    create: 'Start the campaign',
    creating: 'Starting…',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    shown: 'Shown in the app',
    hidden: 'Hidden from the app',
    hide: 'Hide from the app',
    show: 'Show in the app',
    raised: 'raised',
    raisedOfGoal: 'raised of {{goal}}',
    giftCountOne: '1 gift',
    giftCountMany: '{{n}} gifts',
    progressLabel: 'Progress of {{title}}',
    endsOn: 'Ends on {{date}}',
    loading: 'Loading…',
    empty: 'No campaigns yet.',
    loadError: 'Could not load the campaigns.',
    createError: 'Could not start the campaign.',
    saveError: 'Could not save the campaign.',
    deleteError: 'Could not delete the campaign.',
  },
  receipts: {
    title: 'Tax receipts',
    subtitle: 'One receipt a year for each person who asked for one when giving, adding up everything they gave. Open a receipt to print it or save it as a PDF; the links work for an hour.',
    legalTitle: 'Who issues the receipts',
    legalHint: 'The legal body behind the community, as it must appear on the receipts. It is often not the name people know the place by.',
    legalNameLabel: 'Legal name',
    legalTaxIdLabel: 'Tax number',
    legalAddressLabel: 'Address',
    signatoryLabel: 'Signed by',
    signatoryPlaceholder: 'Name and role',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved.',
    legalLoadError: 'Could not load who issues the receipts.',
    legalSaveError: 'Could not save your changes.',
    yearLabel: 'Year',
    exportCsv: 'Download the list (CSV)',
    loading: 'Loading…',
    empty: 'Nobody asked for a receipt for {{year}}.',
    loadError: 'Could not load the receipts.',
    noName: 'No name given',
    giftCountOne: '1 gift',
    giftCountMany: '{{n}} gifts',
    openReceipt: 'Open the receipt',
  },
};

const es: Translations = {
  common: {
    loading: 'Cargando…',
    yes: 'Sí',
    cancel: 'Cancelar',
  },
  login: {
    heading: 'ANSAE Admin',
    subtitle: 'Inicia sesión para gestionar tu comunidad.',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando sesión…',
    genericError: 'Algo salió mal. Inténtalo de nuevo.',
  },
  layout: {
    managing: 'Administrando',
    language: 'Idioma',
    chooseLanguage: 'Elige un idioma',
    choosePlace: 'Elige un lugar',
    close: 'Cerrar',
    signOut: 'Cerrar sesión',
    navDonations: 'Donaciones',
    navEvents: 'Eventos',
    navAnnouncements: 'Anuncios',
    navLivestreams: 'Transmisiones',
    navPrayerRequests: 'Peticiones de oración',
    navCommunity: 'Comunidad',
    navMyQr: 'Mi código QR',
    navHomePage: 'Página de inicio',
    navDashboard: 'Panel',
    navSettings: 'Configuración',
    noAdminPois: 'Tu cuenta todavía no es administradora de ninguna comunidad.',
    navRequests: 'Solicitudes',
    navMassIntentions: 'Intenciones de misa',
  },
  donations: {
    title: 'Donaciones',
    subtitle: 'Cómo evolucionan las donaciones en esta comunidad.',
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
    purposeGeneral: 'Donativo a la comunidad',
    purposeCollection: 'Colecta',
    purposeCampaign: 'Campaña',
    purposeCampaignNamed: 'Campaña: {{title}}',
    purposeMassIntention: 'Ofrenda de intención de misa',
    monthly: 'Mensual',
  },
  events: {
    title: 'Eventos',
    subtitle: 'Programa celebraciones, bautizos, bodas y otros eventos para esta comunidad.',
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
    categoryLabel: 'Tipo',
    categoryMass: 'Misa',
    categoryConfession: 'Confesión',
    categoryAdoration: 'Adoración',
    categoryPrayer: 'Oración',
    categoryOfficeHours: 'Horario de despacho',
    categoryOther: 'Otro',
    recurrenceLabel: 'Se repite',
    recurrenceNone: 'Solo una vez',
    recurrenceWeekly: 'Cada semana',
    firstStartsAtLabel: 'Primera fecha y hora',
    endTimeLabel: 'Termina a las (opcional)',
    repeatUntilLabel: 'Última fecha (opcional; déjala vacía para que continúe)',
    everyWeekday: 'Cada {{day}}',
    fromDate: 'desde el {{date}}',
    untilDate: 'hasta el {{date}}',
    weeklyHeading: 'Cada semana',
    weeklyHint: 'La semana habitual de tu comunidad. La app la muestra como tu horario, y la sección Horarios de celebraciones de tu página de inicio se construye con ella.',
    onceHeading: 'Fechas',
  },
  announcements: {
    title: 'Anuncios',
    subtitle: 'Publica actualizaciones tipo boletín para esta comunidad.',
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
    subtitle: 'Gestiona los módulos activos y la información pública de esta comunidad.',
    modulesSectionTitle: 'Módulos activos',
    activate: 'Activar',
    deactivate: 'Desactivar',
    notActivated: 'no activado',
    loadError: 'No se pudieron cargar los módulos.',
    updateError: 'No se pudo actualizar este módulo.',
    loading: 'Cargando…',
    contentLanguageTitle: 'Idioma del contenido',
    contentLanguageSubtitle: 'El idioma en que esta comunidad publica su contenido: anuncios, eventos, etc. no se traducen para los lectores, solo los menús de la propia app.',
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
    requests: 'Solicitudes y citas',
    massIntentions: 'Intenciones de misa',
  },
  menuOrder: {
    title: 'Orden del menú inferior',
    subtitle:
      'La app da un botón propio a los primeros módulos de esta lista, en la parte inferior de la pantalla, y pone el resto en Más. Coloca arriba lo que más usa tu gente.',
    onBar: 'En el menú',
    underMore: 'En Más',
    insideEvents: 'Dentro de Eventos',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    save: 'Guardar orden',
    saving: 'Guardando…',
    saved: 'Orden del menú guardado.',
    saveError: 'No se pudo guardar el orden del menú.',
    empty: 'Activa un módulo abajo para ordenar el menú.',
  },
  poiInfo: {
    title: 'Información de la comunidad',
    subtitle: 'Se muestra a los miembros en la app.',
    nameLabel: 'Nombre',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Una breve descripción de tu comunidad.',
    pictureUrlLabel: 'URL de la imagen',
    pictureUrlPlaceholder: 'https://ejemplo.com/tu-logo.jpg',
    pictureAlt: 'Imagen de la comunidad',
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
    blockCelebrationTimes: 'Horarios de celebraciones',
    celebrationTimesNote: 'Esta sección se construye con tus eventos semanales (misas, confesiones, horario de despacho): indica su tipo y «Cada semana» en la página Eventos.',
    sectionsTitle: 'Secciones de la página',
  },
  dashboard: {
    title: 'Panel',
    greeting: 'Hola, {{name}}',
    loading: 'Cargando…',
    loadError: 'No se ha podido cargar el panel. Inténtalo de nuevo en un momento.',
    todoTitle: 'Por hacer',
    todoTitleCount: 'Por hacer ({{n}})',
    allDone: 'Todo al día. No hay nada pendiente para el equipo.',
    newRequests: 'Solicitudes nuevas por abrir',
    awaitingReply: 'Miembros esperando una respuesta',
    documentsToCheck: 'Documentos recibidos por revisar',
    intentionsToMark: 'Intenciones de misa por marcar como celebradas',
    expiredMessages: 'Mensajes de inicio caducados',
    actionOpen: 'Abrir',
    actionReply: 'Responder',
    actionCheck: 'Revisar',
    actionMark: 'Marcar',
    actionEdit: 'Editar',
    andMore: 'y {{n}} más',
    mass: 'Misa',
    figuresTitle: 'Cifras clave',
    donationsThisMonth: 'Donativos este mes',
    vsLastMonth: '{{pct}} % respecto al mes pasado, misma fecha',
    noComparison: 'Sin comparación con el mes pasado',
    members: 'Miembros',
    newThisWeek: '+{{n}} esta semana',
    prayerRequests: 'Peticiones de oración',
    thisWeek: 'esta semana',
    weekTitle: 'Esta semana',
    weekEmpty: 'Nada previsto en los próximos siete días.',
    weekMore: '{{n}} más en Eventos',
    intentionToRead: '1 intención por leer',
    intentionsToRead: '{{n}} intenciones por leer',
    appointment: 'Cita: {{what}}',
  },
  preview: {
    title: 'Vista previa en directo',
    frameTitle: 'Vista previa de la página de inicio en un teléfono',
    languageLabel: 'Idioma de la vista previa',
    hint: 'Lo que ve un miembro al abrir su lugar. Puede desplazarse por el teléfono. Lo que aún no está guardado aparece con borde discontinuo.',
    notRunning: 'La app no está en marcha, así que no hay nada que mostrar. Iníciela con start.bat y vuelva a cargar esta página.',
  },
  badges: {
    title: 'Insignias en la parte superior de la página',
    loading: 'Cargando las insignias…',
    loadError: 'No se pudieron cargar las insignias.',
    saveError: 'No se pudo guardar ese cambio.',
    deleteError: 'No se pudo eliminar esa insignia.',
    kindMessage: 'Mensaje',
    kindAuto: 'Auto',
    nextMassTitle: 'Próxima misa',
    officeHoursTitle: 'Despacho abierto / cerrado',
    nextConfessionTitle: 'Próximas confesiones',
    campaignTitle: 'Campaña de donaciones',
    fromCalendar: 'Calculada a partir de la agenda',
    fromOfficeHours: 'Según el horario de oficina de la agenda',
    campaignNote: 'Porcentaje recaudado',
    campaignLabel: 'Campaña',
    latestCampaign: 'La más reciente',
    styleNormal: 'Normal',
    styleImportant: 'Importante (naranja)',
    styleImportantShort: 'Importante',
    until: 'hasta el {{date}}',
    ended: 'terminó el {{date}}',
    opens: 'abre {{module}}',
    moveUp: 'Subir',
    moveDown: 'Bajar',
    edit: 'Editar',
    delete: 'Eliminar',
    showLabel: 'Mostrar «{{name}}»',
    orderNote: 'Use ↑ ↓ para cambiar el orden. Se muestran todas las insignias activadas, en este orden.',
    addTitle: 'Añadir un mensaje',
    editTitle: 'Editar el mensaje',
    textLabel: 'Texto ({{n}} caracteres como máximo)',
    textPlaceholder: 'Iglesia cerrada el lunes 29',
    styleLabel: 'Estilo',
    linkLabel: 'Al tocar, abrir',
    linkNone: 'Nada',
    untilLabel: 'Mostrar hasta (opcional)',
    add: 'Añadir la insignia',
    save: 'Guardar',
    saving: 'Guardando…',
  },
  qr: {
    title: 'Mi código QR',
    subtitle: 'Un folleto imprimible con tu código QR: colócalo donde la gente pueda escanearlo para obtener la app y unirse a tu comunidad.',
    flyerHeadlineLabel: 'Título del folleto',
    flyerSubtextLabel: 'Texto del folleto',
    defaultHeadline: 'Escanea para unirte',
    defaultSubtext: 'Obtén la app ANSAE y mantente conectado con nuestra comunidad: anuncios, eventos, peticiones de oración y más.',
    save: 'Guardar',
    saving: 'Guardando…',
    saveError: 'No se pudieron guardar los cambios.',
    print: 'Imprimir / Guardar como PDF',
    previewTitle: 'Vista previa del folleto',
    scanHint: 'Escanea con la cámara de tu teléfono',
  },
  requests: {
    title: 'Solicitudes',
    subtitle: 'Lo que los miembros piden a la comunidad desde la app —un bautizo, una boda, un certificado, una cita— y todo lo que sigue: estado, cita, documentos y mensajes.',
    filterLabel: 'Mostrar',
    filterOpen: 'Abiertas',
    filterClosed: 'Terminadas o canceladas',
    filterAll: 'Todas',
    loading: 'Cargando…',
    empty: 'No hay solicitudes aquí.',
    loadError: 'No se pudieron cargar las solicitudes.',
    loadOneError: 'No se pudo cargar esta solicitud.',
    open: 'Abrir',
    askedOn: 'pedida el {{date}}',
    appointmentOn: 'cita el {{date}}',
    unread: 'Novedad del miembro',
    documentsPendingOne: '1 documento pendiente',
    documentsPendingMany: '{{n}} documentos pendientes',
    backToList: 'Todas las solicitudes',
    contactLabel: 'Contacto',
    accountLabel: 'Pedida desde la cuenta de',
    noName: 'Sin nombre',
    preferredDateLabel: 'Cuándo lo desean',
    detailsLabel: 'Lo que escribieron',
    statusHeading: 'Estado y cita',
    statusLabel: 'Estado',
    statusReceived: 'Recibida',
    statusInProgress: 'En curso',
    statusAppointmentSet: 'Cita fijada',
    statusCompleted: 'Terminada',
    statusCancelled: 'Cancelada',
    appointmentAtLabel: 'Cita (fecha y hora)',
    appointmentPlaceLabel: 'Lugar de la cita',
    appointmentPlacePlaceholder: 'El despacho, la sacristía…',
    statusHint: 'El miembro ve el estado y la cita en la app. Con solo poner una fecha, la solicitud pasa a «Cita fijada».',
    save: 'Guardar',
    saving: 'Guardando…',
    saved: 'Guardado.',
    saveError: 'No se pudieron guardar los cambios.',
    documentsHeading: 'Documentos',
    noDocuments: 'Todavía no se ha pedido ningún documento.',
    awaited: 'Pendiente',
    receivedOn: 'Recibido el {{date}}',
    openFile: 'Abrir {{name}}',
    markReceived: 'Marcar como recibido',
    markNotReceived: 'Marcar como no recibido',
    removeDocument: 'Quitar',
    askHeading: 'Pedir un documento al miembro',
    documentLabel: 'Documento',
    documentPlaceholder: 'p. ej., partida de nacimiento del niño',
    documentNoteLabel: 'Nota para el miembro (opcional)',
    ask: 'Pedirlo',
    asking: 'Pidiendo…',
    documentError: 'No se pudieron actualizar los documentos.',
    conversationHeading: 'Conversación',
    noMessages: 'Todavía no hay mensajes.',
    fromOffice: '{{name}} (despacho)',
    office: 'El despacho',
    messageLabel: 'Tu mensaje',
    attachmentLabel: 'Adjuntar una foto o un PDF (opcional)',
    send: 'Enviar',
    sending: 'Enviando…',
    sendHint: 'El miembro lo lee en la app.',
    sendError: 'No se pudo enviar el mensaje.',
    typeBaptism: 'Bautizo',
    typeWedding: 'Boda',
    typeFuneral: 'Funeral',
    typeFirstCommunion: 'Primera Comunión',
    typeConfirmation: 'Confirmación',
    typeCertificate: 'Certificado',
    typeMeeting: 'Cita',
    typeBlessing: 'Bendición',
    typeSickVisit: 'Visita a un enfermo',
    typeOther: 'Otra',
  },
  massIntentions: {
    title: 'Intenciones de misa',
    subtitle: 'Las misas ofrecidas por alguien, pedidas desde la app o en el despacho, ordenadas por celebración para el celebrante.',
    addTitle: 'Añadir una recibida en el despacho',
    intentionLabel: 'Intención',
    intentionPlaceholder: 'p. ej., por Juan García, fallecido el mes pasado',
    requesterNameLabel: 'Pedida por',
    requesterContactLabel: 'Teléfono o correo (opcional)',
    celebrationLabel: 'Celebración',
    noDate: 'Sin fecha: cuando la comunidad pueda',
    otherDate: 'Otra fecha…',
    otherAtLabel: 'Fecha y hora',
    otherTitleLabel: 'Nombre de la celebración',
    otherTitlePlaceholder: 'Misa dominical',
    offeringReceivedLabel: 'Ofrenda recibida ({{currency}}, opcional)',
    add: 'Añadir al registro',
    adding: 'Añadiendo…',
    addError: 'No se pudo añadir la intención.',
    registerTitle: 'Registro',
    filterLabel: 'Mostrar',
    filterUpcoming: 'Pendientes',
    filterAll: 'Todas, también celebradas y canceladas',
    print: 'Imprimir la lista',
    printTitle: 'Intenciones de misa',
    loading: 'Cargando…',
    empty: 'No hay intenciones aquí.',
    loadError: 'No se pudieron cargar las intenciones.',
    noDateHeading: 'Sin fecha elegida',
    askedBy: 'pedida por {{name}}',
    fromOffice: 'en el despacho',
    fromApp: 'desde la app',
    statusCelebrated: 'Celebrada',
    statusCancelled: 'Cancelada',
    markCelebrated: 'Marcar como celebrada',
    markAllCelebrated: 'Marcar las {{n}} como celebradas',
    move: 'Cambiar de fecha',
    saveMove: 'Guardar',
    cancelIntention: 'Quitar de la lista',
    putBack: 'Volver a la lista',
    saveError: 'No se pudo guardar el cambio.',
    offeringTitle: 'Ofrenda',
    offeringHint: 'Lo que cuesta una intención pedida desde la app, según lo fija tu diócesis. Déjalo vacío para que cada uno elija cuánto dar.',
    offeringLabel: 'Ofrenda por una intención ({{currency}})',
    offeringPlaceholder: 'Cada uno elige',
    saveOffering: 'Guardar',
    saving: 'Guardando…',
    saved: 'Guardado.',
    offeringError: 'No se pudo guardar la ofrenda.',
  },
  campaigns: {
    title: 'Campañas',
    subtitle: 'Proyectos para los que tu comunidad recauda fondos: el tejado, el órgano, una peregrinación. Los miembros pueden donar desde la app y ver cuánto falta.',
    titleLabel: 'Título',
    titlePlaceholder: 'p. ej., tejado nuevo',
    descriptionLabel: 'Descripción (opcional)',
    goalLabel: 'Objetivo ({{currency}}, opcional)',
    endsOnLabel: 'Fecha de fin (opcional)',
    create: 'Crear la campaña',
    creating: 'Creando…',
    save: 'Guardar',
    edit: 'Editar',
    delete: 'Eliminar',
    shown: 'Visible en la app',
    hidden: 'Oculta en la app',
    hide: 'Ocultar en la app',
    show: 'Mostrar en la app',
    raised: 'recaudados',
    raisedOfGoal: 'recaudados de {{goal}}',
    giftCountOne: '1 donativo',
    giftCountMany: '{{n}} donativos',
    progressLabel: 'Progreso de {{title}}',
    endsOn: 'Termina el {{date}}',
    loading: 'Cargando…',
    empty: 'Todavía no hay campañas.',
    loadError: 'No se pudieron cargar las campañas.',
    createError: 'No se pudo crear la campaña.',
    saveError: 'No se pudo guardar la campaña.',
    deleteError: 'No se pudo eliminar la campaña.',
  },
  receipts: {
    title: 'Certificados de donación',
    subtitle: 'Un certificado al año para cada persona que lo pidió al donar, con la suma de todo lo que dio. Abre un certificado para imprimirlo o guardarlo en PDF; los enlaces funcionan durante una hora.',
    legalTitle: 'Quién emite los certificados',
    legalHint: 'La entidad jurídica que está detrás de la comunidad, tal como debe figurar en los certificados. A menudo no es el nombre por el que se conoce el lugar.',
    legalNameLabel: 'Nombre legal',
    legalTaxIdLabel: 'Número de identificación fiscal',
    legalAddressLabel: 'Dirección',
    signatoryLabel: 'Firmado por',
    signatoryPlaceholder: 'Nombre y cargo',
    save: 'Guardar',
    saving: 'Guardando…',
    saved: 'Guardado.',
    legalLoadError: 'No se pudo cargar quién emite los certificados.',
    legalSaveError: 'No se pudieron guardar los cambios.',
    yearLabel: 'Año',
    exportCsv: 'Descargar la lista (CSV)',
    loading: 'Cargando…',
    empty: 'Nadie pidió un certificado para {{year}}.',
    loadError: 'No se pudieron cargar los certificados.',
    noName: 'Sin nombre',
    giftCountOne: '1 donativo',
    giftCountMany: '{{n}} donativos',
    openReceipt: 'Abrir el certificado',
  },
};

const fr: Translations = {
  common: {
    loading: 'Chargement…',
    yes: 'Oui',
    cancel: 'Annuler',
  },
  login: {
    heading: 'ANSAE Admin',
    subtitle: 'Connectez-vous pour gérer votre communauté.',
    emailLabel: 'E-mail',
    passwordLabel: 'Mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion…',
    genericError: "Une erreur s'est produite. Réessayez.",
  },
  layout: {
    managing: 'Gestion de',
    language: 'Langue',
    chooseLanguage: 'Choisissez une langue',
    choosePlace: 'Choisissez un lieu',
    close: 'Fermer',
    signOut: 'Se déconnecter',
    navDonations: 'Dons',
    navEvents: 'Événements',
    navAnnouncements: 'Annonces',
    navLivestreams: 'Diffusions',
    navPrayerRequests: 'Intentions de prière',
    navCommunity: 'Communauté',
    navMyQr: 'Mon code QR',
    navHomePage: "Page d'accueil",
    navDashboard: 'Tableau de bord',
    navSettings: 'Paramètres',
    noAdminPois: "Votre compte n'est encore administrateur d'aucune communauté.",
    navRequests: 'Demandes',
    navMassIntentions: 'Intentions de messe',
  },
  donations: {
    title: 'Dons',
    subtitle: "L'évolution des dons pour cette communauté.",
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
    purposeGeneral: 'Don à la communauté',
    purposeCollection: 'Quête',
    purposeCampaign: 'Campagne',
    purposeCampaignNamed: 'Campagne : {{title}}',
    purposeMassIntention: "Offrande d'intention de messe",
    monthly: 'Mensuel',
  },
  events: {
    title: 'Événements',
    subtitle: 'Planifiez les célébrations, baptêmes, mariages et autres événements de cette communauté.',
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
    categoryLabel: 'Type',
    categoryMass: 'Messe',
    categoryConfession: 'Confession',
    categoryAdoration: 'Adoration',
    categoryPrayer: 'Prière',
    categoryOfficeHours: "Heures d'accueil",
    categoryOther: 'Autre',
    recurrenceLabel: 'Répétition',
    recurrenceNone: 'Une seule fois',
    recurrenceWeekly: 'Chaque semaine',
    firstStartsAtLabel: 'Première date et heure',
    endTimeLabel: 'Se termine à (facultatif)',
    repeatUntilLabel: 'Dernière date (facultatif — laissez vide pour continuer)',
    everyWeekday: 'Chaque {{day}}',
    fromDate: 'à partir du {{date}}',
    untilDate: "jusqu'au {{date}}",
    weeklyHeading: 'Chaque semaine',
    weeklyHint: "La semaine habituelle de votre communauté. L'application l'affiche comme vos horaires, et la section Horaires des célébrations de votre page d'accueil est construite à partir d'elle.",
    onceHeading: 'Dates',
  },
  announcements: {
    title: 'Annonces',
    subtitle: 'Publiez des mises à jour de type bulletin pour cette communauté.',
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
    subtitle: "Gérez les modules actifs et les informations publiques de cette communauté.",
    modulesSectionTitle: 'Modules actifs',
    activate: 'Activer',
    deactivate: 'Désactiver',
    notActivated: 'non activé',
    loadError: 'Impossible de charger les modules.',
    updateError: 'Impossible de mettre à jour ce module.',
    loading: 'Chargement…',
    contentLanguageTitle: 'Langue du contenu',
    contentLanguageSubtitle: "La langue dans laquelle cette communauté publie son contenu — annonces, événements, etc. ne sont pas traduits pour les lecteurs, seuls les menus de l'app le sont.",
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
    requests: 'Demandes et rendez-vous',
    massIntentions: 'Intentions de messe',
  },
  menuOrder: {
    title: 'Ordre du menu du bas',
    subtitle:
      "L'app donne un bouton à part aux premiers modules de cette liste, en bas de l'écran, et met les autres dans Plus. Placez en haut ce que vos fidèles utilisent le plus.",
    onBar: 'Dans le menu',
    underMore: 'Dans Plus',
    insideEvents: 'Dans Agenda',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    save: "Enregistrer l'ordre",
    saving: 'Enregistrement…',
    saved: "Ordre du menu enregistré.",
    saveError: "Impossible d'enregistrer l'ordre du menu.",
    empty: 'Activez un module ci-dessous pour organiser le menu.',
  },
  poiInfo: {
    title: 'Informations de la communauté',
    subtitle: "Affichées aux membres dans l'app.",
    nameLabel: 'Nom',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'Une courte description de votre communauté.',
    pictureUrlLabel: 'URL de la photo',
    pictureUrlPlaceholder: 'https://exemple.com/votre-logo.jpg',
    pictureAlt: 'Photo de la communauté',
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
    blockCelebrationTimes: 'Horaires des célébrations',
    celebrationTimesNote: "Cette section est construite à partir de vos événements hebdomadaires (messes, confessions, heures d'accueil) : indiquez leur type et « Chaque semaine » dans la page Événements.",
    sectionsTitle: 'Sections de la page',
  },
  dashboard: {
    title: 'Tableau de bord',
    greeting: 'Bonjour {{name}}',
    loading: 'Chargement…',
    loadError: 'Impossible de charger le tableau de bord. Réessayez dans un instant.',
    todoTitle: 'À faire',
    todoTitleCount: 'À faire ({{n}})',
    allDone: 'Tout est à jour. Rien n’attend l’équipe.',
    newRequests: 'Nouvelles demandes à ouvrir',
    awaitingReply: 'Membres en attente d’une réponse',
    documentsToCheck: 'Documents reçus à vérifier',
    intentionsToMark: 'Intentions de messe à cocher comme célébrées',
    expiredMessages: 'Messages d’accueil expirés',
    actionOpen: 'Ouvrir',
    actionReply: 'Répondre',
    actionCheck: 'Vérifier',
    actionMark: 'Cocher',
    actionEdit: 'Modifier',
    andMore: 'et {{n}} de plus',
    mass: 'Messe',
    figuresTitle: 'Chiffres clés',
    donationsThisMonth: 'Dons ce mois-ci',
    vsLastMonth: '{{pct}} % sur le mois dernier à date',
    noComparison: 'Rien à comparer au mois dernier',
    members: 'Membres',
    newThisWeek: '+{{n}} cette semaine',
    prayerRequests: 'Intentions de prière',
    thisWeek: 'cette semaine',
    weekTitle: 'Cette semaine',
    weekEmpty: 'Rien de prévu dans les sept prochains jours.',
    weekMore: '{{n}} de plus dans Événements',
    intentionToRead: '1 intention à lire',
    intentionsToRead: '{{n}} intentions à lire',
    appointment: 'Rendez-vous : {{what}}',
  },
  preview: {
    title: 'Aperçu en direct',
    frameTitle: 'Aperçu de la page d’accueil sur un téléphone',
    languageLabel: 'Langue de l’aperçu',
    hint: 'Ce que voit un membre en ouvrant votre lieu. On peut faire défiler le téléphone. Ce qui n’est pas encore enregistré est entouré en pointillés.',
    notRunning: 'L’app n’est pas lancée, il n’y a donc rien à afficher. Lancez-la avec start.bat, puis rechargez cette page.',
  },
  badges: {
    title: 'Badges en haut de la page',
    loading: 'Chargement des badges…',
    loadError: 'Impossible de charger les badges.',
    saveError: "Impossible d'enregistrer ce changement.",
    deleteError: 'Impossible de supprimer ce badge.',
    kindMessage: 'Message',
    kindAuto: 'Auto',
    nextMassTitle: 'Prochaine messe',
    officeHoursTitle: 'Accueil ouvert / fermé',
    nextConfessionTitle: 'Prochaines confessions',
    campaignTitle: 'Campagne de dons',
    fromCalendar: "Calculée depuis l'agenda",
    fromOfficeHours: "Depuis les heures d'accueil de l'agenda",
    campaignNote: 'Pourcentage collecté',
    campaignLabel: 'Campagne',
    latestCampaign: 'La plus récente',
    styleNormal: 'Normal',
    styleImportant: 'Important (orange)',
    styleImportantShort: 'Important',
    until: "jusqu'au {{date}}",
    ended: 'terminé le {{date}}',
    opens: 'ouvre {{module}}',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    edit: 'Modifier',
    delete: 'Supprimer',
    showLabel: 'Afficher « {{name}} »',
    orderNote: "Utilisez ↑ ↓ pour changer l'ordre. Tous les badges activés s'affichent, dans cet ordre.",
    addTitle: 'Ajouter un message',
    editTitle: 'Modifier le message',
    textLabel: 'Texte ({{n}} caractères au plus)',
    textPlaceholder: 'Église fermée lundi 29',
    styleLabel: 'Style',
    linkLabel: 'Au toucher, ouvrir',
    linkNone: 'Rien',
    untilLabel: "Afficher jusqu'au (facultatif)",
    add: 'Ajouter le badge',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
  },
  qr: {
    title: 'Mon code QR',
    subtitle: "Un flyer imprimable avec votre code QR — affichez-le partout où l'on peut le scanner pour obtenir l'app et rejoindre votre communauté.",
    flyerHeadlineLabel: 'Titre du flyer',
    flyerSubtextLabel: 'Texte du flyer',
    defaultHeadline: 'Scannez pour nous rejoindre',
    defaultSubtext: "Téléchargez l'app ANSAE et restez connecté à notre communauté : annonces, événements, intentions de prière, et plus encore.",
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saveError: 'Impossible d’enregistrer les modifications.',
    print: 'Imprimer / Enregistrer en PDF',
    previewTitle: 'Aperçu du flyer',
    scanHint: 'Scannez avec l’appareil photo de votre téléphone',
  },
  requests: {
    title: 'Demandes',
    subtitle: "Ce que les membres demandent à la communauté depuis l'application — un baptême, un mariage, un certificat, un rendez-vous — et tout ce qui suit : statut, rendez-vous, documents et messages.",
    filterLabel: 'Afficher',
    filterOpen: 'En cours',
    filterClosed: 'Terminées ou annulées',
    filterAll: 'Toutes',
    loading: 'Chargement…',
    empty: 'Aucune demande ici.',
    loadError: 'Impossible de charger les demandes.',
    loadOneError: 'Impossible de charger cette demande.',
    open: 'Ouvrir',
    askedOn: 'demandée le {{date}}',
    appointmentOn: 'rendez-vous le {{date}}',
    unread: 'Nouveau de la part du membre',
    documentsPendingOne: '1 document attendu',
    documentsPendingMany: '{{n}} documents attendus',
    backToList: 'Toutes les demandes',
    contactLabel: 'Contact',
    accountLabel: 'Demandée depuis le compte de',
    noName: 'Sans nom',
    preferredDateLabel: 'Quand ils le souhaitent',
    detailsLabel: 'Ce qu’ils ont écrit',
    statusHeading: 'Statut et rendez-vous',
    statusLabel: 'Statut',
    statusReceived: 'Reçue',
    statusInProgress: 'En cours',
    statusAppointmentSet: 'Rendez-vous fixé',
    statusCompleted: 'Terminée',
    statusCancelled: 'Annulée',
    appointmentAtLabel: 'Rendez-vous (date et heure)',
    appointmentPlaceLabel: 'Lieu du rendez-vous',
    appointmentPlacePlaceholder: "L'accueil, la sacristie…",
    statusHint: "Le membre voit le statut et le rendez-vous dans l'application. Indiquer une date suffit à passer la demande en « Rendez-vous fixé ».",
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré.',
    saveError: "Impossible d'enregistrer vos modifications.",
    documentsHeading: 'Documents',
    noDocuments: "Aucun document demandé pour l'instant.",
    awaited: 'Attendu',
    receivedOn: 'Reçu le {{date}}',
    openFile: 'Ouvrir {{name}}',
    markReceived: 'Marquer comme reçu',
    markNotReceived: 'Marquer comme non reçu',
    removeDocument: 'Retirer',
    askHeading: 'Demander un document au membre',
    documentLabel: 'Document',
    documentPlaceholder: "Par ex. : acte de naissance de l'enfant",
    documentNoteLabel: 'Note pour le membre (facultatif)',
    ask: 'Le demander',
    asking: 'Envoi…',
    documentError: 'Impossible de mettre à jour les documents.',
    conversationHeading: 'Conversation',
    noMessages: 'Pas encore de message.',
    fromOffice: '{{name}} (accueil)',
    office: "L'accueil",
    messageLabel: 'Votre message',
    attachmentLabel: 'Joindre une photo ou un PDF (facultatif)',
    send: 'Envoyer',
    sending: 'Envoi…',
    sendHint: "Le membre le lit dans l'application.",
    sendError: "Impossible d'envoyer le message.",
    typeBaptism: 'Baptême',
    typeWedding: 'Mariage',
    typeFuneral: 'Obsèques',
    typeFirstCommunion: 'Première communion',
    typeConfirmation: 'Confirmation',
    typeCertificate: 'Certificat',
    typeMeeting: 'Rencontre',
    typeBlessing: 'Bénédiction',
    typeSickVisit: 'Visite à un malade',
    typeOther: 'Autre',
  },
  massIntentions: {
    title: 'Intentions de messe',
    subtitle: "Les messes dites pour quelqu'un, demandées depuis l'application ou à l'accueil, classées par célébration pour le célébrant.",
    addTitle: "Ajouter une intention reçue à l'accueil",
    intentionLabel: 'Intention',
    intentionPlaceholder: 'Par ex. : pour Jean Dupont, décédé le mois dernier',
    requesterNameLabel: 'Demandée par',
    requesterContactLabel: 'Téléphone ou e-mail (facultatif)',
    celebrationLabel: 'Célébration',
    noDate: 'Sans date — dès que la communauté le peut',
    otherDate: 'Une autre date…',
    otherAtLabel: 'Date et heure',
    otherTitleLabel: 'Nom de la célébration',
    otherTitlePlaceholder: 'Messe du dimanche',
    offeringReceivedLabel: 'Offrande reçue ({{currency}}, facultatif)',
    add: 'Ajouter au registre',
    adding: 'Ajout…',
    addError: "Impossible d'ajouter l'intention.",
    registerTitle: 'Registre',
    filterLabel: 'Afficher',
    filterUpcoming: 'À célébrer',
    filterAll: 'Toutes, célébrées et annulées comprises',
    print: 'Imprimer la liste',
    printTitle: 'Intentions de messe',
    loading: 'Chargement…',
    empty: 'Aucune intention ici.',
    loadError: 'Impossible de charger les intentions.',
    noDateHeading: 'Sans date choisie',
    askedBy: 'demandée par {{name}}',
    fromOffice: "à l'accueil",
    fromApp: "depuis l'application",
    statusCelebrated: 'Célébrée',
    statusCancelled: 'Annulée',
    markCelebrated: 'Marquer comme célébrée',
    markAllCelebrated: 'Marquer les {{n}} comme célébrées',
    move: 'Déplacer',
    saveMove: 'Enregistrer',
    cancelIntention: 'Retirer de la liste',
    putBack: 'Remettre dans la liste',
    saveError: "Impossible d'enregistrer la modification.",
    offeringTitle: 'Offrande',
    offeringHint: "Ce que coûte une intention demandée depuis l'application, tel que votre diocèse le fixe. Laissez vide pour que chacun choisisse ce qu'il donne.",
    offeringLabel: 'Offrande pour une intention ({{currency}})',
    offeringPlaceholder: 'Au choix',
    saveOffering: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré.',
    offeringError: "Impossible d'enregistrer l'offrande.",
  },
  campaigns: {
    title: 'Campagnes',
    subtitle: "Les projets pour lesquels votre communauté collecte des fonds — la toiture, l'orgue, un pèlerinage. Les membres peuvent donner depuis l'application et voir où vous en êtes.",
    titleLabel: 'Titre',
    titlePlaceholder: 'Par ex. : nouvelle toiture',
    descriptionLabel: 'Description (facultatif)',
    goalLabel: 'Objectif ({{currency}}, facultatif)',
    endsOnLabel: 'Date de fin (facultatif)',
    create: 'Lancer la campagne',
    creating: 'Lancement…',
    save: 'Enregistrer',
    edit: 'Modifier',
    delete: 'Supprimer',
    shown: "Visible dans l'application",
    hidden: "Masquée dans l'application",
    hide: "Masquer dans l'application",
    show: "Afficher dans l'application",
    raised: 'collectés',
    raisedOfGoal: 'collectés sur {{goal}}',
    giftCountOne: '1 don',
    giftCountMany: '{{n}} dons',
    progressLabel: 'Progression de {{title}}',
    endsOn: 'Se termine le {{date}}',
    loading: 'Chargement…',
    empty: 'Aucune campagne pour le moment.',
    loadError: 'Impossible de charger les campagnes.',
    createError: 'Impossible de lancer la campagne.',
    saveError: "Impossible d'enregistrer la campagne.",
    deleteError: 'Impossible de supprimer la campagne.',
  },
  receipts: {
    title: 'Reçus fiscaux',
    subtitle: "Un reçu par an pour chaque personne qui l'a demandé en donnant, avec le total de ses dons. Ouvrez un reçu pour l'imprimer ou l'enregistrer en PDF ; les liens fonctionnent pendant une heure.",
    legalTitle: 'Qui émet les reçus',
    legalHint: "L'entité juridique derrière la communauté, telle qu'elle doit figurer sur les reçus. Ce n'est souvent pas le nom sous lequel on connaît le lieu.",
    legalNameLabel: 'Dénomination légale',
    legalTaxIdLabel: "Numéro d'identification",
    legalAddressLabel: 'Adresse',
    signatoryLabel: 'Signé par',
    signatoryPlaceholder: 'Nom et fonction',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré.',
    legalLoadError: 'Impossible de charger qui émet les reçus.',
    legalSaveError: "Impossible d'enregistrer vos modifications.",
    yearLabel: 'Année',
    exportCsv: 'Télécharger la liste (CSV)',
    loading: 'Chargement…',
    empty: "Personne n'a demandé de reçu pour {{year}}.",
    loadError: 'Impossible de charger les reçus.',
    noName: 'Sans nom',
    giftCountOne: '1 don',
    giftCountMany: '{{n}} dons',
    openReceipt: 'Ouvrir le reçu',
  },
};

export const translations: Record<SupportedLanguage, Translations> = { en, es, fr };
