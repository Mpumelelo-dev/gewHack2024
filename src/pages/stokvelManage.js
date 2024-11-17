import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust the path as needed
import styles from './ManageStokvel.module.css'; // Import CSS module

const ManageStokvel = () => {
  const [stokvels, setStokvels] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStokvels = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, 'stokvels'));
        const stokvelList = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().createdBy === user.uid) {
            stokvelList.push({ id: doc.id, ...doc.data() });
          }
        });
        setStokvels(stokvelList);
      }
    };

    const fetchRequests = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, 'notifications'));
        const requestList = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().type === 'joinRequest' && doc.data().status === 'pending' && doc.data().userId === user.uid) {
            requestList.push({ id: doc.id, ...doc.data() });
          }
        });
        setRequests(requestList);
      }
    };

    fetchStokvels();
    fetchRequests();
  }, []);

  const handleApproveRequest = async (requestId, stokvelId, requesterId) => {
    try {
      const stokvelDoc = doc(db, 'stokvels', stokvelId);
      const stokvelSnapshot = await getDoc(stokvelDoc);
      const stokvelData = stokvelSnapshot.data();

      await updateDoc(stokvelDoc, {
        members: [...stokvelData.members, requesterId]
      });

      await updateDoc(doc(db, 'notifications', requestId), {
        status: 'approved'
      });

      setMessage('Request approved successfully.');
    } catch (error) {
      console.error('Error approving request: ', error);
      setMessage('Error approving request. Please try again.');
    }
  };

  const handleRemoveUser = async (stokvelId, userId) => {
    try {
      const stokvelDoc = doc(db, 'stokvels', stokvelId);
      const stokvelSnapshot = await getDoc(stokvelDoc);
      const stokvelData = stokvelSnapshot.data();

      await updateDoc(stokvelDoc, {
        members: stokvelData.members.filter(member => member !== userId)
      });

      setMessage('User removed successfully.');
    } catch (error) {
      console.error('Error removing user: ', error);
      setMessage('Error removing user. Please try again.');
    }
  };

  const handleSendNotification = async (stokvelId, message) => {
    try {
      const stokvelDoc = doc(db, 'stokvels', stokvelId);
      const stokvelSnapshot = await getDoc(stokvelDoc);
      const stokvelData = stokvelSnapshot.data();

      const notification = {
        type: 'general',
        message,
        userId: stokvelData.createdBy,
        timestamp: new Date()
      };

      await addDoc(collection(db, 'notifications'), notification);

      setMessage('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification: ', error);
      setMessage('Error sending notification. Please try again.');
    }
  };

  const handleActivateBulkPurchase = async (stokvelId) => {
    try {
      const stokvelDoc = doc(db, 'stokvels', stokvelId);
      const stokvelSnapshot = await getDoc(stokvelDoc);
      const stokvelData = stokvelSnapshot.data();

      if (stokvelData.type === 'grocery') {
        setMessage('Your chosen retail partner will contact you for the bulk purchase.');
      } else {
        setMessage('Bulk purchase is only available for grocery stokvels.');
      }
    } catch (error) {
      console.error('Error activating bulk purchase: ', error);
      setMessage('Error activating bulk purchase. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Stokvel</h2>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.section}>
        <h3>Pending Join Requests</h3>
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className={styles.request}>
              <p>{request.message}</p>
              <button
                onClick={() => handleApproveRequest(request.id, request.stokvelId, request.requesterId)}
                className={styles.button}
              >
                Approve
              </button>
            </div>
          ))
        ) : (
          <p>No pending requests.</p>
        )}
      </div>
      <div className={styles.section}>
        <h3>Your Stokvels</h3>
        {stokvels.length > 0 ? (
          stokvels.map((stokvel) => (
            <div key={stokvel.id} className={styles.stokvel}>
              <h4>{stokvel.name}</h4>
              <p><strong>Goal:</strong> {stokvel.goal}</p>
              <p><strong>Location:</strong> {stokvel.location}</p>
              <p><strong>Rules:</strong> {stokvel.rules}</p>
              <h5>Members</h5>
              <ul>
                {stokvel.members.map((member) => (
                  <li key={member}>
                    {member}
                    <button
                      onClick={() => handleRemoveUser(stokvel.id, member)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSendNotification(stokvel.id, 'Upcoming meeting on 20th Nov')}
                className={styles.button}
              >
                Send Meeting Notification
              </button>
              <button
                onClick={() => handleSendNotification(stokvel.id, 'Next payment due on 1st Dec')}
                className={styles.button}
              >
                Send Payment Notification
              </button>
              {stokvel.type === 'grocery' && (
                <button
                  onClick={() => handleActivateBulkPurchase(stokvel.id)}
                  className={styles.button}
                >
                  Activate Bulk Purchase
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No stokvels available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageStokvel;