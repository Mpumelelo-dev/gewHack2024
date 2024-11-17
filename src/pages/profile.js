import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Adjust the path as needed
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './profile.module.css'; // Import CSS module

const Profile = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName);
          setEmail(userData.email);
          setCellNumber(userData.cellNumber);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          fullName,
          email,
          cellNumber,
        });
        setMessage('Profile updated successfully.');
      } catch (error) {
        console.error('Error updating profile: ', error);
        setMessage('Error updating profile. Please try again.');
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    const user = auth.currentUser;
    if (user) {
      try {
        await user.updatePassword(password);
        setMessage('Password changed successfully.');
      } catch (error) {
        console.error('Error changing password: ', error);
        setMessage('Error changing password. Please try again.');
      }
    }
  };

  const handleDeleteProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
        await user.delete();
        navigate('/signup'); // Redirect to signup page after profile deletion
      } catch (error) {
        console.error('Error deleting profile: ', error);
        setMessage('Error deleting profile. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out: ', error);
      setMessage('Error logging out. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Profile</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleUpdateProfile} className={styles.form}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
          className={styles.input}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="text"
          value={cellNumber}
          onChange={(e) => setCellNumber(e.target.value)}
          placeholder="Cell Number"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Update Profile</button>
      </form>
      <form onSubmit={handleChangePassword} className={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          required
          className={styles.input}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Change Password</button>
      </form>
      <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
      <button onClick={handleDeleteProfile} className={styles.deleteButton}>Delete Profile</button>
    </div>
  );
};

export default Profile;