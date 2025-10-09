"use client";
import { useState, useEffect } from 'react';

// 免费使用上限
const USAGE_LIMIT = 3;

// ====================================================================
// 弹窗组件
// ====================================================================
const WaitlistModal = ({ onClose }) => {
  // 【已替换】这里是您的接收邮箱
  const recipientEmail = "yuhongdim@gmail.com"; 
  const emailSubject = "I'm interested in the Pro version of AI Grant Writer!";
  
  const handleJoinWaitlist = () => {
    // 使用 mailto 链接，自动打开用户的邮件客户端
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(emailSubject)}`;
  };

  const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '90%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', position: 'relative' },
    h2: { marginTop: 0, fontSize: '1.5rem' },
    p: { color: '#4B5563', lineHeight: 1.6 },
    button: { width: '100%', backgroundColor: '#10B981', color: 'white', fontWeight: 'bold', padding: '0.75rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem' },
    closeButton: { position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9CA3AF', padding: '0.5rem' }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
         <button style={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 style={styles.h2}>Unlock Infinite Possibilities!</h2>
        <p style={styles.p}>
          You've used all your free trials. We are preparing more powerful features for Pro users, including unlimited generations, exporting to Word documents, and saving history. 
          If you are interested, join our waitlist, and we will notify you as soon as the paid features are launched!
        </p>
        <button style={styles.button} onClick={handleJoinWaitlist}>Join Waitlist & Get Notified</button>
      </div>
    </div>
  );
};

// ====================================================================
// 主页面组件
// ====================================================================
export default function Home() {
  const [topic, setTopic] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [aim1, setAim1] = useState('');
  const [aim2, setAim2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [usageCount, setUsageCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedCount = parseInt(localStorage.getItem('proposalUsageCount') || '0');
    setUsageCount(storedCount);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usageCount >= USAGE_LIMIT) {
      setShowModal(true); 
      return; 
    }

    setIsLoading(true);
    setResult('');
    setError('');

    const newCount = usageCount + 1;
    localStorage.setItem('proposalUsageCount', newCount.toString());
    setUsageCount(newCount);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, hypothesis, aim1, aim2 }),
      });

      if (!response.ok) {
        const rollBackCount = usageCount;
        localStorage.setItem('proposalUsageCount', rollBackCount.toString());
        setUsageCount(rollBackCount);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.proposal);
    } catch (err) {
      setError("Failed to generate proposal. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingTries = USAGE_LIMIT - usageCount > 0 ? USAGE_LIMIT - usageCount : 0;
  
  const styles = {
    container: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6' },
    leftPanel: { width: '50%', padding: '2rem', backgroundColor: 'white', borderRight: '1px solid #e5e7eb' },
    rightPanel: { width: '50%', padding: '2rem' },
    h1: { fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' },
    h2: { fontSize: '1.125rem', color: '#4B5563', marginBottom: '1.5rem' },
    label: { display: 'block', color: '#374151', fontWeight: 'bold', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', marginBottom: '1rem' },
    textarea: { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', marginBottom: '1rem' },
    button: { width: '100%', backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', padding: '0.75rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' },
    buttonDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' },
    resultBox: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', minHeight: '60vh', whiteSpace: 'pre-wrap', color: '#374151', border: '1px solid #e5e7eb' },
    footerText: { marginTop: '1.5rem', textAlign: 'center', color: '#6B7280' }
  };

  return (
    <>
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
      
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h1 style={styles.h1}>AI Grant Proposal Writer</h1>
          <h2 style={styles.h2}>Generate a Flawless 'Specific Aims' Page Instantly</h2>
          <form onSubmit={handleSubmit}>
             <div>
                <label style={styles.label} htmlFor="topic">Research Topic</label>
                <input style={styles.input} id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The role of protein XYZ in neurodegeneration" required />
              </div>
              <div>
                <label style={styles.label} htmlFor="hypothesis">Central Hypothesis</label>
                <textarea style={styles.textarea} id="hypothesis" value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="e.g., We hypothesize that protein XYZ is a key driver of..." required rows="3"></textarea>
              </div>
              <div>
                <label style={styles.label} htmlFor="aim1">Specific Aim 1</label>
                <input style={styles.input} id="aim1" type="text" value={aim1} onChange={(e) => setAim1(e.target.value)} placeholder="e.g., To determine the molecular mechanism of XYZ" required />
              </div>
              <div>
                <label style={styles.label} htmlFor="aim2">Specific Aim 2</label>
                <input style={styles.input} id="aim2" type="text" value={aim2} onChange={(e) => setAim2(e.target.value)} placeholder="e.g., To test the therapeutic potential of inhibiting XYZ" required />
              </div>
            <button style={{...styles.button, ...(isLoading ? styles.buttonDisabled : {})}} type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : '✨ Generate Proposal'}
            </button>
          </form>
          <p style={styles.footerText}>You have {remainingTries} free tries remaining.</p>
        </div>
        <div style={styles.rightPanel}>
           <h3 style={{...styles.h1, fontSize: '1.5rem', marginBottom: '1rem'}}>Generated Proposal Draft</h3>
            <div style={styles.resultBox}>
              {isLoading && <p>Thinking... Please wait a moment.</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {result && <p>{result}</p>}
              {!isLoading && !result && <p style={{ color: '#9CA3AF' }}>Your generated 'Specific Aims' page will appear here...</p>}
            </div>
        </div>
      </div>
    </>
  );
}
