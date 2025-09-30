"use client";
import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [aim1, setAim1] = useState('');
  const [aim2, setAim2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
    setError('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, hypothesis, aim1, aim2 }),
      });

      if (!response.ok) {
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

  // 我们将直接使用内联样式，彻底告别所有CSS配置问题
  const styles = {
    container: { display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6' },
    leftPanel: { width: '50%', padding: '2rem', backgroundColor: 'white', borderRight: '1px solid #e5e7eb' },
    rightPanel: { width: '50%', padding: '2rem' },
    h1: { fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' },
    h2: { fontSize: '1.125rem', color: '#4B5563', marginBottom: '1.5rem' },
    label: { display: 'block', color: '#374151', fontWeight: 'bold', marginBottom: '0.5rem' },
    input: { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', marginBottom: '1rem' },
    textarea: { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #D1D5DB', borderRadius: '0.375rem', marginBottom: '1rem' },
    button: { width: '100%', backgroundColor: '#2563EB', color: 'white', fontWeight: 'bold', padding: '0.75rem 1rem', borderRadius: '0.375rem' },
    buttonDisabled: { backgroundColor: '#9CA3AF' },
    resultBox: { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', minHeight: '60vh', whiteSpace: 'pre-wrap', color: '#374151', border: '1px solid #e5e7eb' }
  };

  return (
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
  );
}
