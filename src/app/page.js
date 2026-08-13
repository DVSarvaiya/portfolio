export default function Home() {
  return (
    <main className="main">
      <h1 className="name">Dhruv Sarvaiya</h1>
      <a
        href="https://www.linkedin.com/in/dvsarvaiya"
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: '0.5rem', display: 'inline-block' }}
      >
        <button type="button">LinkedIn</button>
      </a>
      <p className="subtitle">Portfolio • Developer</p>
      <a href="https://github.com/DVSarvaiya" target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">GitHub</a>
    </main>
  );
}
