import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import styles from './RegisterPage.module.css';
import logo from '../logo.jpg'; // Ensure the image path is correct
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [cellNumber, setCellNumber] = useState('');
  const [email, setEmail] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateCellNumber = (number) => {
    const re = /^\d{10}$/;
    return re.test(String(number));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName || !cellNumber || !email || !homeAddress || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }
    if (!validateCellNumber(cellNumber)) {
      setError("Invalid cell number. It should be 10 digits.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        cellNumber,
        email,
        homeAddress,
        password, // Note: This is for testing purposes only. Do not store passwords in plain text in production.
        stokvels: [],
        notifications: []
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    
    <div className={styles.registerPage}>
        
      <header className={styles.header}>
      <div className={styles.buttonHome}>
      <button><Link to="/" className={styles.button}>Home</Link></button>
      </div>
        <h1>Register</h1>
      </header>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className={styles.input}
            aria-label="Full Name"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cellNumber">Cell Number:</label>
          <input
            type="text"
            id="cellNumber"
            value={cellNumber}
            onChange={(e) => setCellNumber(e.target.value)}
            required
            className={styles.input}
            aria-label="Cell Number"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            aria-label="Email Address"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="homeAddress">Home Address:</label>
          <input
            type="text"
            id="homeAddress"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            required
            className={styles.input}
            aria-label="Home Address"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Create Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            aria-label="Create Password"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
            aria-label="Confirm Password"
          />
        </div>
        <button type="submit" className={styles.button}>Register</button>
        
        
      </form>
     
    </div>
  );
}

export default RegisterPage;