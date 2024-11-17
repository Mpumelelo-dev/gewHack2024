import React, { useState } from 'react';
import styles from './FinancialLiteracyPage.module.css'; // Import CSS module

const FinancialLiteracyPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [score, setScore] = useState(0);

  const sections = [
    {
      title: 'Introduction to Savings',
      content: 'Learn the basics of saving money and why it is important for your financial health.',
      quiz: {
        question: 'Why is saving money important?',
        options: [
          'To buy things you don’t need',
          'To have financial security',
          'To impress others',
          'To waste money'
        ],
        correctAnswer: 1
      }
    },
    {
      title: 'Budgeting Basics',
      content: 'Understand how to create a budget and stick to it.',
      quiz: {
        question: 'What is a budget?',
        options: [
          'A plan for spending money',
          'A list of things you want to buy',
          'A way to borrow money',
          'A type of bank account'
        ],
        correctAnswer: 0
      }
    },
    // Add more sections as needed
  ];

  const handleAnswer = (index) => {
    if (index === sections[currentSection].quiz.correctAnswer) {
      setScore(score + 1);
    }
    setCurrentSection(currentSection + 1);
  };

  return (
    <div className={styles.container}>
      <h2>Financial Literacy Game</h2>
      {currentSection < sections.length ? (
        <div className={styles.section}>
          <h3>{sections[currentSection].title}</h3>
          <p>{sections[currentSection].content}</p>
          <div className={styles.quiz}>
            <p>{sections[currentSection].quiz.question}</p>
            {sections[currentSection].quiz.options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(index)} className={styles.optionButton}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.result}>
          <h3>Congratulations!</h3>
          <p>You have completed the financial literacy game.</p>
          <p>Your score: {score} / {sections.length}</p>
        </div>
      )}
    </div>
  );
};

export default FinancialLiteracyPage;