import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzyNLwQhuLeN-PtfM85W3SpHk6mkGh3wI",
  authDomain: "trip-planner-b79d3.firebaseapp.com",
  projectId: "trip-planner-b79d3",
  storageBucket: "trip-planner-b79d3.firebasestorage.app",
  messagingSenderId: "1008237601576",
  appId: "1:1008237601576:web:ec6c23413063ac5316661d",
  measurementId: "G-X2RR6CFZJK"
};


export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
//const analytics = getAnalytics(app);