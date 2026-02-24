// i18n Translation System for Ethiopian Navigator

export type Language = 'en' | 'am' | 'om';

export interface TranslationDict {
  [key: string]: string | TranslationDict;
}

const translations: Record<Language, TranslationDict> = {
  en: {
    common: {
      home: 'Home',
      services: 'Services',
      applications: 'Applications',
      profile: 'Profile',
      logout: 'Logout',
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      submit: 'Submit',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      download: 'Download',
      upload: 'Upload',
      search: 'Search',
      filter: 'Filter',
      noResults: 'No results found'
    },
    citizen: {
      dashboard: 'Citizen Dashboard',
      browseServices: 'Browse Services',
      requestService: 'Request Service',
      myApplications: 'My Applications',
      feedback: 'Feedback',
      trackRequest: 'Track Request',
      serviceDescription: 'Service Description',
      processingTime: 'Processing Time',
      cost: 'Cost',
      requirements: 'Requirements',
      submitRequest: 'Submit Service Request',
      requestSubmitted: 'Your service request has been submitted successfully',
      selectService: 'Please select a service',
      addDocuments: 'Add Supporting Documents'
    },
    employee: {
      dashboard: 'Review Dashboard',
      serviceRequests: 'Service Requests',
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      rejected: 'Rejected',
      citizenName: 'Citizen Name',
      serviceName: 'Service Name',
      submittedDate: 'Submitted Date',
      updateStatus: 'Update Status',
      addNotes: 'Add Notes',
      viewDetails: 'View Details',
      assignToMe: 'Assign to Me',
      markComplete: 'Mark as Complete'
    },
    admin: {
      dashboard: 'Admin Dashboard',
      users: 'Users',
      services: 'Services',
      feedback: 'Feedback',
      analytics: 'Analytics',
      reports: 'Reports',
      settings: 'Settings',
      manageUsers: 'Manage Users',
      manageServices: 'Manage Services',
      viewStatistics: 'View Statistics',
      totalUsers: 'Total Users',
      totalRequests: 'Total Requests',
      completionRate: 'Completion Rate',
      averageProcessingTime: 'Average Processing Time'
    },
    chatbot: {
      title: 'Service Assistant',
      greeting: 'Hello! How can I help you today?',
      askQuestion: 'Ask me about government services',
      typeMessage: 'Type your message here...',
      sending: 'Sending...',
      helpTopics: 'Help Topics',
      serviceInfo: 'Service Information',
      applicationStatus: 'Application Status',
      requirements: 'Requirements',
      contactSupport: 'Contact Support',
      sorry: 'Sorry, I could not understand that. Please rephrase your question.'
    },
    errors: {
      unauthorized: 'You are not authorized to access this resource',
      notFound: 'Resource not found',
      serverError: 'Server error. Please try again later',
      validationError: 'Validation error. Please check your input',
      networkError: 'Network error. Please check your connection',
      fileError: 'File size exceeds maximum limit of 5MB'
    },
    validation: {
      required: 'This field is required',
      minLength: 'Minimum length is {min} characters',
      maxLength: 'Maximum length is {max} characters',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      number: 'Please enter a valid number'
    },
    messages: {
      confirmDelete: 'Are you sure you want to delete this item?',
      deleteSuccess: 'Item deleted successfully',
      updateSuccess: 'Item updated successfully',
      createSuccess: 'Item created successfully',
      loadingData: 'Loading data...',
      noData: 'No data available'
    }
  },
  am: {
    common: {
      home: 'ቤት',
      services: 'ሴቪሶች',
      applications: 'መተግበሪያዎች',
      profile: 'ገጽታ',
      logout: 'ሎግ አደስ',
      welcome: 'እንኩዋን ደህና መጡ',
      loading: 'በመጫን ላይ...',
      error: 'ስህተት',
      success: 'ስኬት',
      cancel: 'ወይዘሪት ያድርጉ',
      submit: 'ያስዋውቁ',
      save: 'ጠይቅ',
      delete: 'ሰርዝ',
      edit: 'ማራም',
      download: 'ダウンロード',
      upload: 'ይጫኑ',
      search: 'ፈልግ',
      filter: 'ማጣሪያ',
      noResults: 'ምንም ውጤት አልተገኘም'
    },
    citizen: {
      dashboard: 'የዜጋ ዳሾቦርድ',
      browseServices: 'ሴቪሶችን ቀልድ',
      requestService: 'ሴቪስ ይጠይቁ',
      myApplications: 'ፈተናዎቼ',
      feedback: 'ግላዊ አስተያየት',
      trackRequest: 'ጠይቅ ይከተሉ',
      serviceDescription: 'ሴቪስ ገለጻ',
      processingTime: 'የመጋበያ ጊዜ',
      cost: 'ወጪ',
      requirements: 'መስፈርቶች',
      submitRequest: 'ሴቪስ ጠይቅ ያስዋውቁ',
      requestSubmitted: 'የእርስዎ ሴቪስ ጠይቅ በተሳካ ሁኔታ ተላል됨ል',
      selectService: 'ጋር ሴቪስ ይምረጡ',
      addDocuments: 'ሰነዶች ይጨምሩ'
    },
    employee: {
      dashboard: 'ገምጋሚ ዳሾቦርድ',
      serviceRequests: 'ሴቪስ ጠይቆች',
      pending: 'በጥበታ',
      inProgress: 'በሂደት ላይ',
      completed: 'ተጠናቋል',
      rejected: 'ውድቅ ተደርጓል',
      citizenName: 'የዜጋ ስም',
      serviceName: 'የሴቪስ ስም',
      submittedDate: 'ታቅደ ዓይነ',
      updateStatus: 'ሁኔታ ያሻሽሉ',
      addNotes: 'ማስታወሻዎች ይጨምሩ',
      viewDetails: 'ዝርዝሮችን ይመልከቱ',
      assignToMe: 'ለእኔ ይመድቡ',
      markComplete: 'እንደ ተጠናቋል ምልክት'
    },
    admin: {
      dashboard: 'የአስተዳደር ዳሾቦርድ',
      users: 'ተጠቃሚዎች',
      services: 'ሴቪሶች',
      feedback: 'ግላዊ አስተያየት',
      analytics: 'ትንታኔ',
      reports: 'ሪፖርቶች',
      settings: 'ቅንብሮች',
      manageUsers: 'ተጠቃሚዎችን ያስተዳድሩ',
      manageServices: 'ሴቪሶችን ያስተዳድሩ',
      viewStatistics: 'ስታቲስቲክስ ይመልከቱ',
      totalUsers: 'አጠቃላይ ተጠቃሚዎች',
      totalRequests: 'አጠቃላይ ጠይቆች',
      completionRate: 'የማጠናቀቅ መጠን',
      averageProcessingTime: 'አማካይ የመጋበያ ጊዜ'
    },
    chatbot: {
      title: 'ሴቪስ ረዳት',
      greeting: 'ሰላም! ዛሬ እንዴት ሊረዱዎ ይችላሉ?',
      askQuestion: 'ስለ ሚኒስቴር ሴቪሶች ጠይቁ',
      typeMessage: 'መልእክትዎን ይተይቡ...',
      sending: 'በመላክ ላይ...',
      helpTopics: 'የእርዳታ ርእሰ ጉዳዮች',
      serviceInfo: 'ሴቪስ መረጃ',
      applicationStatus: 'አብ ሁኔታ',
      requirements: 'መስፈርቶች',
      contactSupport: 'ድጋፍ ያነጋግሩ',
      sorry: 'ይቅርታ, ይህን ተረድተዋል ብለው ባላመነሁ. እባክዎ ጥያቄዎን ትንሳኤ ጠይቁ'
    },
    errors: {
      unauthorized: 'ለዚህ ሪሪብ ወደ ዚህ ምንጭ ሊጠቀሙ አይችሉም',
      notFound: 'ሪሪብ አልተገኘም',
      serverError: 'ወሰን ስህተት. ጥቂት ደቂቃዎችን ፈጥነው ዛሬ ሞክር',
      validationError: 'ማረጋገጫ ስህተት. ገቤታዎን ይፈትሹ',
      networkError: 'የአውታረ መረብ ስህተት. ግንኙነትዎን ይፈትሹ',
      fileError: 'የፋይል መጠን 5MB ከ-5MB ገደብ ይበልጣል'
    },
    validation: {
      required: 'ይህ መስክ ያስፈልጋል',
      minLength: 'ዝቅተኛ ርዝመት {min} ቁምፊዎች ነው',
      maxLength: 'ከፍተኛ ርዝመት {max} ቁምፊዎች ነው',
      email: 'ዋጋ ያለውን ኢሜይል አድራሻ ያስገቡ',
      phone: 'ዋጋ ያለውን ስልክ ቁጥር ያስገቡ',
      number: 'ዋጋ ያለውን ቁጥር ያስገቡ'
    },
    messages: {
      confirmDelete: 'ይህን ጋር ሰርዝ ይፈልጋሉ?',
      deleteSuccess: 'ጋር በተሳካ ሁኔታ ተሰርዘ',
      updateSuccess: 'ጋር በተሳካ ሁኔታ ተሻሽሎ',
      createSuccess: 'ጋር በተሳካ ሁኔታ ተፈጠረ',
      loadingData: 'ውሂብ በመጫን ላይ...',
      noData: 'ምንም ውሂብ አይገኝም'
    }
  },
  om: {
    common: {
      home: 'Mana',
      services: 'Tajaajilaan',
      applications: 'Arfiin',
      profile: 'Piroofiila',
      logout: 'Ba\'i',
      welcome: 'Akam jirtuu',
      loading: 'Jidha jidu...',
      error: 'Dogoggora',
      success: 'Ijaarsa',
      cancel: 'Hafe',
      submit: 'Ilaali',
      save: 'Kuusu',
      delete: 'Haqi',
      edit: 'Gulali',
      download: 'Buusi',
      upload: 'Ol baasi',
      search: 'Barbaadi',
      filter: 'Sirreessi',
      noResults: 'Bu\'aa hin argamne'
    },
    citizen: {
      dashboard: 'Daashboord Qamaa',
      browseServices: 'Tajaajilaa ilaali',
      requestService: 'Tajaajila Gaafa',
      myApplications: 'Arfiin Kooti',
      feedback: 'Kaa Gaafi',
      trackRequest: 'Gaaffii Hordofi',
      serviceDescription: 'Ibsa Tajaajila',
      processingTime: 'Yeroo Itti Fufinsaa',
      cost: 'Gatii',
      requirements: 'Fedhii',
      submitRequest: 'Gaaffii Tajaajila Ilaali',
      requestSubmitted: 'Gaaffii tajaajila kee haala milkaa\'ina ilaale',
      selectService: 'Maaloo tajaajila filadhu',
      addDocuments: 'Walaloo Dabalchi'
    },
    employee: {
      dashboard: 'Daashboord Ilaalcha',
      serviceRequests: 'Gaaffiiwwan Tajaajila',
      pending: 'Eegaa jira',
      inProgress: 'Hojii',
      completed: 'Xumure',
      rejected: 'Diddame',
      citizenName: 'Maqaa Qamaa',
      serviceName: 'Maqaa Tajaajila',
      submittedDate: 'Guyyaa Ilaale',
      updateStatus: 'Haala Haaraa',
      addNotes: 'Yaad Irraa Dabalchi',
      viewDetails: 'Xustuuqaa Ilaali',
      assignToMe: 'Naa Gaaffi',
      markComplete: 'Xumure Jecha Mallatteessi'
    },
    admin: {
      dashboard: 'Daashboord Handhuura',
      users: 'Fayyadamtoonni',
      services: 'Tajaajilaan',
      feedback: 'Kaa Gaafi',
      analytics: 'Xiinxala',
      reports: 'Gabaabsa',
      settings: 'Ijaarsa',
      manageUsers: 'Fayyadamtoonni Hojjechi',
      manageServices: 'Tajaajilaa Hojjechi',
      viewStatistics: 'Xiinxala Ilaali',
      totalUsers: 'Fayyadamtoonni Hunduu',
      totalRequests: 'Gaaffiiwwan Hunduu',
      completionRate: 'Baay\'ina Xumuraa',
      averageProcessingTime: 'Giddaramtaa Yeroo Itti Fufinsaa'
    },
    chatbot: {
      title: 'Gargaarsa Tajaajila',
      greeting: 'Salaam! Akam si gargaaruu danda\'a?',
      askQuestion: 'Tajaajilaa mootummaa irraa gaafi',
      typeMessage: 'Ergaa kee barreessi...',
      sending: 'Ergaa ergu...',
      helpTopics: 'Jilboonni Gargaarsa',
      serviceInfo: 'Odeeffannoo Tajaajila',
      applicationStatus: 'Haala Arfii',
      requirements: 'Fedhii',
      contactSupport: 'Gargaarsa Quunnamsi',
      sorry: 'Kan akka jedhuu irra si faala. Maaloo gaaffii kee duubatti haaraa gaafi'
    },
    errors: {
      unauthorized: 'Meeshii kana hin raabu ilaalchisuu akka raabutti si hin jette',
      notFound: 'Meeshiin hin argamne',
      serverError: 'Dogoggora server. Maaloo booda yoo irra deebitanii mali',
      validationError: 'Dogoggora mallatoo. Galaa kee sakattaabadhu',
      networkError: 'Dogoggora neeworkii. Walqunnamtii kee sakattaabadhu',
      fileError: 'Bal faili gosaa guddina 5MB caala'
    },
    validation: {
      required: 'Lama kanaan barbaachisa',
      minLength: 'Dheerina xiqqaa {min} barruulee dha',
      maxLength: 'Dheerina guddaa {max} barruulee dha',
      email: 'Maaloo aadiressa iimeeyl milkaa\'aa gal',
      phone: 'Maaloo lakkoobsa bilbila milkaa\'aa gal',
      number: 'Maaloo lakkoobsa milkaa\'aa gal'
    },
    messages: {
      confirmDelete: 'Meeshii kanaa haqu barbaaddee?',
      deleteSuccess: 'Meeshiin haqa milkaa\'ina xumure',
      updateSuccess: 'Meeshiin fooyya\'e milkaa\'ina xumure',
      createSuccess: 'Meeshiin raasaa milkaa\'ina xumure',
      loadingData: 'Daataa jidha jidu...',
      noData: 'Daataa dhabuu jira'
    }
  }
};

// Get translation value
export function t(key: string, language: Language = 'en', variables?: Record<string, string>): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Replace variables
  if (variables) {
    Object.entries(variables).forEach(([varKey, varValue]) => {
      value = value.replace(`{${varKey}}`, varValue);
    });
  }

  return value;
}

// Get all translations for a language
export function getLanguageTranslations(language: Language): TranslationDict {
  return translations[language];
}

// Get available languages
export const AVAILABLE_LANGUAGES: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromo' }
];

// Language context for React
export function useLanguage(): {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
} {
  // This would be implemented with React Context in a real app
  const language: Language = 'en';
  
  return {
    language,
    setLanguage: () => {},
    t: (key: string, variables?: Record<string, string>) => t(key, language, variables)
  };
}
