import "./globals.css";

export const metadata = {
  title: "AI Grant Proposal Writer",
  description: "Generate grant proposals with AI",
};

export default function RootLayout({ children }) {
  // 导航栏的样式
  const navStyles = {
    nav: { backgroundColor: 'white', padding: '1rem 2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontWeight: 'bold', fontSize: '1.25rem', color: '#333', textDecoration: 'none' },
    linkContainer: { display: 'flex', gap: '1.5rem' },
    link: { color: '#555', textDecoration: 'none', fontWeight: '500' }
  };

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {/* --- 新增的导航栏 --- */}
        <nav style={navStyles.nav}>
          <a href="/" style={navStyles.logo}>AI Grant Writer</a>
          <div style={navStyles.linkContainer}>
            <a href="/" style={navStyles.link}>Home (Tool)</a>
            <a href="/blog" style={navStyles.link}>Blog</a>
          </div>
        </nav>
        {/* --- 页面主体内容 --- */}
        <main>{children}</main>
      </body>
    </html>
  );
}
