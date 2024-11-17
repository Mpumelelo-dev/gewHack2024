import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Adjust the path as needed
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, getDoc, addDoc } from 'firebase/firestore';
import styles from './UserDashboard.module.css';
import logo from '../logo.jpg'; // Ensure the image path is correct

function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'joinRequest',
      message: 'Alice has requested to join your saving stokvel.',
      stokvelId: '1',
      stokvelName: 'saving stokvel',
      requesterId: 'alice123',
      stokvelGoal: 'Reach our monthly target',
      stokvelPaymentDate: '2024-12-15',
      stokvelRules: 'Monthly contributions of R1000'
    },
    {
      id: '2',
      type: 'paymentReminder',
      message: 'Reminder: Your payment of R500 for grocery stokvel is due on 2024-11-20.',
      stokvelId: '2',
      stokvelName: 'grocery stokvel'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData({
              ...userDoc.data(),
              stokvels: [
                {
                  id: '1',
                  name: 'saving stokvel',
                  type: 'created',
                  balance: 7500,
                  totalContributions: 20000,
                  recentActivity: 'Received contribution from Bob',
                  goal: 'Reach our monthly target',
                  paymentDate: '2024-12-15',
                  rules: 'Monthly contributions of R1000'
                },
                {
                  id: '2',
                  name: 'grocery stokvel',
                  type: 'joined',
                  balance: 4500,
                  totalContributions: 12000,
                  recentActivity: 'Monthly contribution from Jess',
                  goal: 'General savings',
                  paymentDate: '2024-11-20',
                  rules: 'Monthly contributions of R500',
                  amountDue: 500
                }
              ]
            });
          } else {
            setError('No user data found.');
          }
        } else {
          setError('User is not logged in.');
        }
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newNotifications = [];
        querySnapshot.forEach((doc) => {
          newNotifications.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(newNotifications);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleApproveRequest = async (notification) => {
    try {
      const stokvelDoc = doc(db, 'stokvels', notification.stokvelId);
      await updateDoc(stokvelDoc, {
        members: arrayUnion(notification.requesterId)
      });
      await updateDoc(doc(db, 'users', notification.requesterId), {
        stokvels: arrayUnion({
          id: notification.stokvelId,
          name: notification.stokvelName,
          type: 'joined',
          balance: 0,
          totalContributions: 0,
          recentActivity: '',
          goal: notification.stokvelGoal,
          paymentDate: notification.stokvelPaymentDate,
          rules: notification.stokvelRules
        })
      });
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'approved'
      });
      await addDoc(collection(db, 'notifications'), {
        type: 'joinResponse',
        userId: notification.requesterId,
        message: `Your request to join ${notification.stokvelName} has been approved.`,
        status: 'approved',
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error approving request:', err);
    }
  };

  const handleDeclineRequest = async (notification) => {
    try {
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'declined'
      });
      await addDoc(collection(db, 'notifications'), {
        type: 'joinResponse',
        userId: notification.requesterId,
        message: `Your request to join ${notification.stokvelName} has been declined.`,
        status: 'declined',
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Error declining request:', err);
    }
  };

  const handleManageStokvel = () => {
    navigate('/manage-stokvel');
  };

  const handleMakePayment = () => {
    navigate('/payment');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.navbar}>
        <img src={logo} alt="Logo" />
        <nav>
          <Link to="/financial-literacy">📚 Financial Literacy</Link>
          <Link to="/stokvel-directory">👥 Stokvel Directory</Link>
          <Link to="/setup-stokvel">➕ Set Up a Stokvel</Link>
          <Link to="/join-stokvel">➕ Join a Stokvel</Link>
          <Link to="/profile-settings">👤 Profile and Settings</Link>
        </nav>
      </div>
      <div className={styles.mainContent}>
        <h1>Welcome, {userData.fullName}</h1>
        <section>
          <h2>Stokvel Overview</h2>
          <div>
            <h3>Created Stokvels</h3>
            {userData.stokvels && userData.stokvels.filter(stokvel => stokvel.type === 'created').length > 0 ? (
              userData.stokvels.filter(stokvel => stokvel.type === 'created').map((stokvel, index) => (
                <div key={index}>
                  <h4>{stokvel.name}</h4>
                  <p>Balance: R{stokvel.balance}</p>
                  <p>Total Contributions: R{stokvel.totalContributions}</p>
                  <p>Recent Activity: {stokvel.recentActivity}</p>
                  <button onClick={handleManageStokvel}>Manage Stokvel</button>
                </div>
              ))
            ) : (
              <p>No stokvels created yet. Set up a stokvel to get started.</p>
            )}
          </div>
          <div>
            <h3>Joined Stokvels</h3>
            {userData.stokvels && userData.stokvels.filter(stokvel => stokvel.type === 'joined').length > 0 ? (
              userData.stokvels.filter(stokvel => stokvel.type === 'joined').map((stokvel, index) => (
                <div key={index}>
                  <h4>{stokvel.name}</h4>
                  <p>Balance: R{stokvel.balance}</p>
                  <p>Total Contributions: R{stokvel.totalContributions}</p>
                  <p>Recent Activity: {stokvel.recentActivity}</p>
                  <p>Amount Due: R{stokvel.amountDue}</p>
                  <button onClick={handleMakePayment}>Make Payment</button>
                </div>
              ))
            ) : (
              <p>No stokvels joined yet. Join a stokvel to get started.</p>
            )}
          </div>
        </section>
        <section>
          <h2>Stokvel Data Visualization</h2>
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Stokvel Name</th>
                  <th>Balance (R)</th>
                  <th>Total Contributions (R)</th>
                </tr>
              </thead>
              <tbody>
                {userData.stokvels.map((stokvel, index) => (
                  <tr key={index}>
                    <td>{stokvel.name}</td>
                    <td>{stokvel.balance}</td>
                    <td>{stokvel.totalContributions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2>Notifications</h2>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index}>
                {notification.type === 'joinRequest' && (
                  <div>
                    <p>{notification.message}</p>
                    <button onClick={() => handleApproveRequest(notification)}>Approve</button>
                    <button onClick={() => handleDeclineRequest(notification)}>Decline</button>
                  </div>
                )}
                {notification.type === 'joinResponse' && (
                  <p>{notification.message}</p>
                )}
                {notification.type === 'paymentReminder' && (
                  <p>{notification.message}</p>
                )}
                {notification.type === 'generalUpdate' && (
                  <p>{notification.message}</p>
                )}
              </div>
            ))
          ) : (
            <p>No notifications at the moment.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;