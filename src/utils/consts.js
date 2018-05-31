import languages from 'languages'

export default {
  languages: [{name: 'Any Language'}].concat(languages.getAllLanguageCode().map(languages.getLanguageInfo).sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))),
  platforms: [
    {
      name: 'Appear.in',
      icon: 'https://appear.in/i/static/images/icons/favicon_v2-196x196.png',
    },
    {
      name: 'Hangouts.google.com',
      icon: 'https://ssl.gstatic.com/images/icons/material/product/2x/hangouts_32dp.png',
    },
    {
      name: 'Rabb.it',
      icon: 'https://www.rabb.it/favicon.ico',
      placeholder: 'Ex Rabb.it: "https://wwww.rabb.it/zetsin"',
    },
    {
      name: 'Custom link',
      icon: 'favicon.ico',
      placeholder: 'You can put any link from AppearIn, Hangouts, Rabbit'
    },
  ],
  levels: [
    'Any Level',
    'Beginer',
    'Upper Beginer',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Upper Advanced',
  ],
  icons: {
    google: 'https://www.google.com/images/branding/product/ico/googleg_lodp.ico',
    baidu: 'https://www.baidu.com/favicon.ico',
  }
}