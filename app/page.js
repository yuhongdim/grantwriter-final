"use client";
// 我们需要从 react 引入 useEffect 和 useState
import { useState, useEffect } from 'react';

// 【唯一的修改在这里】我们将免费使用上限设置为 3 次
const USAGE_LIMIT = 3;

export default function Home() {
  const [topic, setTopic] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [aim1, setAim1] = useState('');
  const [aim2, setAim2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // 创建一个状态来追踪用户的使用次数
  const [usageCount, setUsageCount] = useState(0);

  // 当页面第一次加载时，从浏览器的小“笔记本”里读取记录
  useEffect(() => {
    // 尝试读取名为 'proposalUsageCount' 的记录，如果找不到，就默认为 0
    const storedCount = parseInt(localStorage.getItem('proposalUsageCount') || '0');
    setUsageCount(storedCount);
  }, []); // 空数组 [] 意味着这个效果只在页面加载时运行一次

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 在执行任何操作之前，先检查使用次数
    if (usageCount >= USAGE_LIMIT) {
      // 如果次数已经用完，就弹出一个提示，然后停止所有后续操作
      alert("您已用完 " + USAGE_LIMIT + " 次免费试用机会！未来的付费版将解锁无限次使用和更多高级功能。");
      return; 
    }

    setIsLoading(true);
    setResult('');
    setError('');

    // 一旦用户点击生成，立刻将使用次数 +1 并记录下来
    const newCount = usageCount + 1;
    localStorage.setItem('proposalUsageCount', newCount.toString());
    setUsageCount(newCount); // 更新页面上的次数记录

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, hypothesis, aim1, aim2 }),
      });

      if (!response.ok) {
        // 如果生成失败，我们不应该惩罚用户，所以把次数减回去
        const rollBackCount = usageCount; // 减回到点击前的状态
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

  // 我们可以在页面底部显示剩余次数，给用户明确的提示
  const remainingTries = USAGE_LIMIT - usageCount > 0 ? USAGE_LIMIT - usageCount : 0;

  // ... (后面的 return 部分和之前完全一样，只是增加了剩余次数的显示)
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
            <textarea style={styles.textarea} id="hypothesis" value={hypothesis} onChange={(e) => setHypothesis(e.g., We hypothesize that protein XYZ is a key driver of..." required rows="3"></textarea>
          </div>
          <div>
            <label style={styles.label} htmlFor="aim1">Specific Aim 1</label>
            <input style={styles.input} id="aim1" type="text" value={aim1} onChange={(e) => setAim1(e.target.value)} placeholder="e.g., To determine the molecular mechanism of XYZ" required />
          </div>
          <div>
            <label style={styles.label} htmlFor="aim2">Specific Aim 2</label>
            <input style={styles.input} id="aim2" type="text" value={aim2} onChange={(e) => setAim2(e.target.value)} placeholder="e.g., To test the therapeutic potential of inhibiting XYZ" required />
          </div>
          <button style={{...styles.button, ...(isLoading || remainingTries <= 0 ? styles.buttonDisabled : {})}} type="submit" disabled={isLoading || remainingTries <= 0}>
            {isLoading ? 'Generating...' : '✨ Generate Proposal'}
          </button>
        </form>
        {/* 在底部显示剩余次数 */}
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
  );
}
