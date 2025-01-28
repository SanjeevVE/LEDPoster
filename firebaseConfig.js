import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDQEQV1bT92IX6iSCWrz1zUm7XVhQiRoHI',
  authDomain: 'certificate-generate-22963.firebaseapp.com',
  projectId: 'certificate-generate-22963',
  storageBucket: 'certificate-generate-22963.appspot.com',
  messagingSenderId: '531628968969',
  appId: '1:531628968969:web:64d1f66461889de5fb3cd8',
  measurementId: 'G-0Y7DEHKVW2',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
