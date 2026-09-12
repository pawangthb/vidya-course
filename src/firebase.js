import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDibA2upNu51SISvB0N_rl7ub7fEZfFAv4",
  authDomain: "vidya-course.firebaseapp.com",
  projectId: "vidya-course",
  storageBucket: "vidya-course.firebasestorage.app",
  messagingSenderId: "439079567127",
  appId: "1:439079567127:web:79c143f9fbe9ae7cb6c152",
  measurementId: "G-X164WH5KYG"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app