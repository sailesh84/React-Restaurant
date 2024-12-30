// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/**
 * This variable is used for the development mode.
 */
export const environment = {
  production: false,
  //  socket_server: '/',
  //  api_server: '/api/',
  msalUriRedirect: 'http://localhost:4200/',
  msalAuthority: 'https://login.microsoftonline.com/0804c951-93a0-405d-80e4-fa87c7551d6a',
  msalClientID: 'e1aee997-5533-4a2f-958f-a5d0ff2562b2',
  socket_server: 'https://infieldportal-qa.lab.technipfmc.com/',
  api_server: 'https://infieldportal-qa.lab.technipfmc.com/api/v1/',
  // vapid_public: 'BK39_ntdZJU9TKiu5fjbxNmlrRZyN-EmnwcnvV6CD_Jmc7YkWgblTOWmpvJ8tzx1poZG2Gv76tZIT3WNbojaXJU'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
