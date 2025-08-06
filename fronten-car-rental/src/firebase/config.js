import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyA-yFdLVn5LA8iu81C2seW5nt6OHiAk5x0',
  authDomain: 'car-rental-dc2f3.firebaseapp.com',
  projectId: 'car-rental-dc2f3',
  storageBucket: 'car-rental-dc2f3.appspot.com',
  messagingSenderId: '779267774310',
  appId: '1:779267774310:web:474d1a571952c923fcdaa7',
  measurementId: 'G-EV55C3KMVG'
};

// Initialize Firebase
let app;
// let analytics;

try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');

  // Disable analytics for development to prevent ad blocker issues
  // isSupported().then(yes => {
  //   if (yes) {
  //     analytics = getAnalytics(app);
  //     console.log('Analytics initialized successfully');
  //   }
  // }).catch(error => {
  //   console.warn('Analytics not supported:', error);
  // });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Add error handling for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user.email);
  } else {
    console.log('No user is signed in');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});

export { app, auth, db, storage };
