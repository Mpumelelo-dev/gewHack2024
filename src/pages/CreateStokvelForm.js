import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Adjust the path as needed
import styles from './CreateStokvelForm.module.css'; // Import CSS module

const CreateStokvelForm = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('savings');
  const [goal, setGoal] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [rules, setRules] = useState('');
  const [location, setLocation] = useState('');
  const [retailPartners, setRetailPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [hasBankAccount, setHasBankAccount] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRetailPartners = async () => {
      const querySnapshot = await getDocs(collection(db, 'retailPartners'));
      const partners = [];
      querySnapshot.forEach((doc) => {
        partners.push({ id: doc.id, ...doc.data() });
      });
      setRetailPartners(partners);
    };

    if (type === 'grocery') {
      fetchRetailPartners();
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      // Check if the stokvel name already exists
      const stokvelQuery = query(collection(db, 'stokvels'), where('name', '==', name));
      const querySnapshot = await getDocs(stokvelQuery);
      if (!querySnapshot.empty) {
        setError('A stokvel with this name already exists.');
        return;
      }

      const stokvelData = {
        name,
        type,
        goal,
        paymentDate,
        rules,
        location,
        createdBy: user.uid,
        members: [user.uid],
        retailPartners: type === 'grocery' ? [selectedPartner] : [],
        balance: 0,
        totalContributions: 0,
        recentActivity: '',
        bankAccount: hasBankAccount ? selectedBank : null,
      };

      try {
        await addDoc(collection(db, 'stokvels'), stokvelData);
        console.log('Stokvel created successfully');
        if (hasBankAccount) {
          navigate('/manage-stokvel'); // Navigate to a page that shows the bank contact message
        } else {
          navigate('/manage-stokvel'); // Navigate to the stokvel management page
        }
      } catch (error) {
        console.error('Error creating stokvel: ', error);
        setError('Error creating stokvel. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Stokvel</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Stokvel Name"
          required
          className={styles.input}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className={styles.select}>
          <option value="savings">Savings Stokvel</option>
          <option value="grocery">Grocery Savings Stokvel</option>
        </select>
        {type === 'grocery' && (
          <select value={selectedPartner} onChange={(e) => setSelectedPartner(e.target.value)} className={styles.select}>
            <option value="">Select Retail Partner</option>
            {retailPartners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Stokvel Goal"
          required
          className={styles.input}
        />
        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          placeholder="Payment Date"
          required
          className={styles.input}
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
          className={styles.input}
        />
        <textarea
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="Stokvel Rules"
          required
          className={styles.textarea}
        />
        <div className={styles.bankAccountSection}>
          <p>Do you have a bank account?</p>
          <label>
            <input
              type="radio"
              value="no"
              checked={hasBankAccount === true}
              onChange={() => setHasBankAccount(true)}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              value="yes"
              checked={hasBankAccount === false}
              onChange={() => setHasBankAccount(false)}
            />
            Yes
          </label>
        </div>
        {hasBankAccount && (
          <div className={styles.bankOptions}>
            <p>Select your bank:</p>
            <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className={styles.select}>
              <option value="">Select Bank</option>
              <option value="bank1">Bank 1 - Benefits: Low fees, high interest</option>
              <option value="bank2">Bank 2 - Benefits: No fees, cashback rewards</option>
              <option value="bank3">Bank 3 - Benefits: High interest, free transfers</option>
            </select>
          </div>
        )}
        <button type="submit" className={styles.button}>Create Stokvel</button>
      </form>
    </div>
  );
};

export default CreateStokvelForm;