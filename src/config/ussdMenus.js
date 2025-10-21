// USSD Menu Configuration
export const ussdMenus = {
  welcome: {
    text: `CON Welcome to INKINGI Rescue
    Choose language to continue
    1. English
    2. Ikinyarwanda
    3. Français
    4. Kiswahili
    `,
    options: {
      1: "en",
      2: "rw",
      3: "fr",
      4: "sw",
    },
  },

  main: {
    text: `CON Choose type of service
    1. Emergencies
    2. Community Posts
    3. Hotlines
    4. Distress
    5. Settings
    `,
    options: {
      1: "emergencies",
      2: "communityPosts",
      3: "hotlines",
      4: "distress",
      5: "settings",
    },
  },

  emergencies: {
    text: `CON Emergencies
    1. View Emergencies
    2. Report Emergency
    3. My Emergencies
    0. Go back
    `,
    options: {
      1: "viewEmergencies",
      2: "reportEmergency",
      3: "myEmergencies",
      0: "main",
    },
  },

  communityPosts: {
    text: `CON Community Posts
    1. News
    2. Events
    0. Go back
    `,
    options: {
      1: "news",
      2: "events",
      0: "main",
    },
  },

  hotlines: {
    text: `CON Hotlines 
    1. Police - 112
    2. Fire - 113
    3. Ambulance - 114
    0. Go back
    `,
    options: {
      1: "main",
      2: "main",
      3: "main",
      0: "main",
    },
  },

  distress: {
    text: `CON Are you in an Immediate emergency? if yes, kindly confirm and help will be on the way.
    1. Confirm
    0. cancel
    `,
    options: {
      1: "confirmDistress",
      0: "main",
    },
  },

  settings: {
    text: `CON Settings
    1. Change Language
    2. Terms of Service
    3. Privacy Policy
    0. Go back
    `,
    options: {
      1: "languages",
      2: "terms",
      3: "privacy",
      0: "main",
    },
  },

  //  sub screens
  viewEmergencies: {
    text: `CON Found {count} emergencies
        1. emergency type - details
        2. emergency type - details
        3. emergency type - details
        0. go back
        `,
    options: {
      1: "viewEmergency",
      2: "viewEmergency",
      3: "viewEmergency",
      0: "emergencies",
    },
  },

  reportEmergency: {
    text: `CON Type of emergency
    1. Fire
    2. Medical
    3. Assault
    4. Corruption
    5. Accident
    6. Other
    0. Go back
    `,
    options: {
      1: "additionalInfo",
      2: "additionalInfo",
      3: "additionalInfo",
      4: "additionalInfo",
      5: "additionalInfo",
      6: "additionalInfo",
      0: "emergencies",
    },
  },

  additionalInfo: {
    text: `CON Please tell us more about the emergency(optional)
    1. Continue
    0. Go back
    `,
    options: {
      1: "confirmEmergency",
      0: "reportEmergency",
    },
  },

  confirmEmergency: {
    text: `CON Are you sure you want to report this emergency?
    1. Confirm
    0. Cancel
    `,
    options: {
      1: "submitEmergency",
      0: "emergencies",
    },
  },

  thankYou: {
    text: `CON Thank you! The rescue team will be on the way, kindly follow these guidelines as help is on the way
    {AI content here}
    0. Go back
    `,
    options: {
      0: "main",
    },
  },

  myEmergencies: {
    text: `CON My emergencies
    1. emergency type - details
    2. emergency type - details
    3. emergency type - details
    0. go back
    `,
    options: {
      1: "viewEmergency",
      2: "viewEmergency",
      3: "viewEmergency",
      0: "emergencies",
    },
  },

  viewEmergency: {
    text: `CON emergency type - details
    0. go back
    `,
    options: {
      0: "myEmergencies",
    },
  },

  news: {
    text: `CON News
    1. News - details
    2. News - details
    3. News - details
    0. go back
    `,
    options: {
      1: "viewNews",
      2: "viewNews",
      3: "viewNews",
      0: "communityPosts",
    },
  },

  viewNews: {
    text: `CON News - details
    0. go back
    `,
    options: {
      0: "news",
    },
  },

  events: {
    text: `CON Events
    1. Event - details
    2. Event - details
    3. Event - details
    0. go back
    `,
    options: {
      1: "viewEvent",
      2: "viewEvent",
      3: "viewEvent",
      0: "communityPosts",
    },
  },

  viewEvent: {
    text: `CON Event - details
    0. go back
    `,
    options: {
      0: "events",
    },
  },

  languages: {
    text: `CON Change language
    1. English
    2. Rwandan
    3. French
    4. Swahili
    0. Go back
    `,
    options: {
      1: "en",
      2: "rw",
      3: "fr",
      4: "sw",
      0: "main",
    },
  },

  terms: {
    text: `CON Terms of Service
    0. Go back
    `,
    options: {
      0: "main",
    },
  },

  privacy: {
    text: `CON Privacy Policy
    0. Go back
    `,
    options: {
      0: "main",
    },
  },
};
