import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL81eXUWkWLYyybYIJzrgpf0_6su7uM9c",
  authDomain: "smart-complaint-system-6606d.firebaseapp.com",
  projectId: "smart-complaint-system-6606d",
  storageBucket: "smart-complaint-system-6606d.appspot.com",
  messagingSenderId: "509667972932",
  appId: "1:509667972932:web:da693dbdf1311e5c5f2911",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
