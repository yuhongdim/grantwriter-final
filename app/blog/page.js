// 这段代码定义了您的博客列表页面
export default function BlogIndex() {
  const styles = {
    container: { maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif', color: '#333' },
    title: { fontSize: '2.5rem', marginBottom: '2rem' },
    postItem: { marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1.5rem' },
    postTitle: { fontSize: '1.5rem', marginBottom: '0.5rem' },
    postLink: { color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' },
    postDescription: { color: '#555', lineHeight: 1.6 }
  };

  // 我们所有的博客文章列表
  const posts = [
    {
      title: "How to Write the NSF Broader Impacts Section: A Practical Guide with Examples",
      description: "A deep dive into crafting a compelling Broader Impacts section for your NSF grant, with actionable strategies and examples.",
      url: "/blog/how-to-write-nsf-broader-impacts"
    },
    {
      title: "The Ultimate Guide to Writing an NIH R01 Specific Aims Page (with Winning Examples for 2025)",
      description: "Deconstructing the golden four-paragraph structure of a successful Specific Aims page, complete with common mistakes to avoid.",
      url: "/blog/how-to-write-aims-page"
    }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Our Blog</h1>
      {posts.map(post => (
        <div key={post.url} style={styles.postItem}>
          <h2 style={styles.postTitle}>
            <a href={post.url} style={styles.postLink}>{post.title}</a>
          </h2>
          <p style={styles.postDescription}>{post.description}</p>
        </div>
      ))}
    </div>
  );
}
