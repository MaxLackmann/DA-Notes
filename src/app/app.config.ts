import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"da-notes-75099","appId":"1:689844811378:web:ae7609f0343e6a142834eb","storageBucket":"da-notes-75099.appspot.com","apiKey":"AIzaSyC-Zr-LjX63Kcv9_hJEy0a-gDiUDT1E7Gc","authDomain":"da-notes-75099.firebaseapp.com","messagingSenderId":"689844811378"})), provideFirestore(() => getFirestore())]
};
