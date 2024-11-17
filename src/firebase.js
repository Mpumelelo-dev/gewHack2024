// Import the necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // For authentication
import { getFirestore, doc, setDoc, collection, addDoc } from "firebase/firestore";  // For Firestore

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKAE1MrWReMold-90pTonx4hxt1yKUbSY",
  authDomain: "zakaconnect-c7e02.firebaseapp.com",
  projectId: "zakaconnect-c7e02",
  storageBucket: "zakaconnect-c7e02.appspot.com",  // Corrected storageBucket URL
  messagingSenderId: "285522125665",
  appId: "1:285522125665:web:b2cab448412e62bbd69b20",
  measurementId: "G-VTRTZHQTKM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// Function to add dummy data
const addDummyData = async () => {
    try {
      const userId = "voJlcoodQ5PEbLfFm2vXcJW67N33"; // Replace with a unique user ID
      const userDoc = doc(db, "users", userId);
  
      const userData = {
        fullName: "lelo",
        email: "john@example.com",
        cellNumber: "1234567890",
        homeAddress: "123 Main St, Anytown, USA",
        stokvels: [
          {
            id: "stokvel1",
            name: "Stokvel 1",
            balance: 500,
            totalContributions: 2000,
            recentActivity: "Last contribution on 12th Nov",
            createdBy: "anotherUserId", // ID of the user who created this stokvel
            type: "joined",
            goal: "Save for a new car",
            paymentDate: "2024-12-01",
            rules: "Monthly contributions of R500. No withdrawals before December."
          },
          {
            id: "stokvel2",
            name: "Stokvel 2",
            balance: 300,
            totalContributions: 1500,
            recentActivity: "Last contribution on 10th Nov",
            createdBy: userId, // ID of the user who created this stokvel
            type: "created",
            goal: "Year-end groceries",
            paymentDate: "2024-12-15",
            rules: "Monthly contributions of R300. No withdrawals before December."
          }
        ],
        notifications: [
          {
            type: "joinRequest",
            stokvelId: "stokvel2",
            requesterId: "requesterUserId",
            requesterName: "requesterName",
            message: "User requesterName wants to join your stokvel Stokvel 2",
            status: "pending",
            timestamp: new Date()
          },
          {
            type: "payment",
            stokvelId: "stokvel1",
            payerId: "payerUserId",
            amount: 100,
            message: "User payerUserId made a payment of R100 to stokvel Stokvel 1",
            userId: "anotherUserId"
          },
          {
            type: "general",
            message: "New educational content available in Financial Literacy Hub",
            userId: userId // General notification for the user
          },
          {
            type: "general",
            message: "Group announcement: Meeting on 20th Nov",
            userId: userId // General notification for the user
          }
        ]
      };
  
      await setDoc(userDoc, userData);
      console.log("Dummy data added successfully");
  
      // Add retail partners
      const retailPartners = [
        {
          name: "Shoprite",
          location: "123 Main St, Anytown, USA",
          contact: "contact1@example.com"
        },
        {
          name: "OK",
          location: "456 Elm St, Othertown, USA",
          contact: "contact2@example.com"
        }
      ];
  
      for (const partner of retailPartners) {
        await addDoc(collection(db, "retailPartners"), partner);
      }
      console.log("Retail partners added successfully");
  
    } catch (error) {
      console.error("Error adding dummy data: ", error);
    }
  };
  
  addDummyData();
// Export the necessary Firebase services and functions
export { db, auth };