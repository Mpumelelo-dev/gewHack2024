import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import styles from './StokvelDirectory.module.css'; // Import CSS module

const StokvelDirectory = () => {
  const [stokvels, setStokvels] = useState([]);

  useEffect(() => {
    const fetchStokvels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'stokvels'));
        const stokvelList = [];
        for (const docSnapshot of querySnapshot.docs) {
          const stokvelData = docSnapshot.data();
          const userDoc = await getDoc(doc(db, 'users', stokvelData.createdBy));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            stokvelList.push({
              id: docSnapshot.id,
              ...stokvelData,
              leaderName: userData.fullName,
              leaderContact: userData.cellNumber,
            });
          }
        }
        setStokvels(stokvelList);
      } catch (error) {
        console.error('Error fetching stokvels: ', error);
      }
    };

    fetchStokvels();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Stokvel Directory</h2>
      {stokvels.length > 0 ? (
        stokvels.map((stokvel) => (
          <div key={stokvel.id} className={styles.stokvel}>
            <h3>{stokvel.name}</h3>
            <p><strong>Goal:</strong> {stokvel.goal}</p>
            <p><strong>Leader:</strong> {stokvel.leaderName}</p>
            <p><strong>Contact:</strong> {stokvel.leaderContact}</p>
            <p><strong>Location:</strong> {stokvel.location}</p>
          </div>
        ))
      ) : (
        <p>No stokvels available.</p>
      )}
    </div>
  );
};

export default StokvelDirectory;