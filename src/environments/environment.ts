// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  urlFront: 'localhost:4200',
  urlFrontReset: 'http://localhost:4200l',
  keyEcrypt: 'seretokysidetec',
  //apiUrl: 'https://lavetonline.herokuapp.com',
  //urlFront:'lavetonline-giwnajnbea-tl.a.run.app',
  //urlFrontReset:'https://lavetonline-giwnajnbea-tl.a.run.app',

  firebaseConfig: {
    apiKey: 'AIzaSyDtWpcqTl0uTmMpYTwjfnpLoG_rVM2-HYY',
    authDomain: 'sincere-point-379815.firebaseapp.com',
    projectId: 'sincere-point-379815',
    storageBucket: 'sincere-point-379815.appspot.com',
    messagingSenderId: '196047771707',
    appId: '1:196047771707:web:48937832221954f8cee41e',
    measurementId: 'G-5YWPP82WPJ',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
