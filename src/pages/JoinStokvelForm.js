import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the path as needed
import styles from './JoinStokvelForm.module.css'; // Import CSS module

const JoinStokvelForm = () => {
  const [stokvels, setStokvels] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStokvels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'stokvels'));
        const stokvelList = [];
        querySnapshot.forEach((doc) => {
          stokvelList.push({ id: doc.id, ...doc.data() });
        });
        setStokvels(stokvelList);
      } catch (error) {
        console.error('Error fetching stokvels: ', error);
      }
    };

    fetchStokvels();
  }, []);

  const handleJoinRequest = async (stokvelId, stokvelName) => {
    const user = auth.currentUser;
    if (user) {
      const joinRequest = {
        type: 'joinRequest',
        stokvelId,
        requesterId: user.uid,
        requesterName: user.displayName || user.email,
        message: `User ${user.displayName || user.email} wants to join your stokvel ${stokvelName}`,
        status: 'pending',
        timestamp: new Date()
      };

      try {
        await addDoc(collection(db, 'notifications'), joinRequest);
        setMessage('Invite sent, awaiting approval.');
      } catch (error) {
        console.error('Error sending join request: ', error);
        setMessage('Error sending join request. Please try again.');
      }
    }
  };

  return (
    <form className={styles.form}>
      <h2>Join a Stokvel</h2>
      {message && <p className={styles.message}>{message}</p>}
      {stokvels.length > 0 ? (
        stokvels.map((stokvel) => (
          <div key={stokvel.id} className={styles.stokvel}>
            <h3>{stokvel.name}</h3>
            <p><strong>Goal:</strong> {stokvel.goal}</p>
            <p><strong>Location:</strong> {stokvel.location}</p>
            <p><strong>Rules:</strong> {stokvel.rules}</p>
            <button
              type="button"
              onClick={() => handleJoinRequest(stokvel.id, stokvel.name)}
              className={styles.joinButton}
            >
              Join Stokvel
            </button>
          </div>
        ))
      ) : (
        <p>No stokvels available to join.</p>
      )}
    </form>
  );
};

export default JoinStokvelForm;