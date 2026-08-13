"use client";

import { useState } from "react";

export default function Home() {
  const [showProjects, setShowProjects] = useState(false);

  const projects = [
    { id: 1, title: "Project One", description: "A React-based portfolio site." },
    { id: 2, title: "Project Two", description: "A full-stack e-commerce app." },
    { id: 3, title: "Project Three", description: "A real-time chat application." },
  ];

  return (
    <main className="main">
      <h1 className="name">Dhruv Sarvaiya</h1>
      <a
        href="https://www.linkedin.com/in/dvsarvaiya"
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: "0.5rem", display: "inline-block" }}
      >
        <button type="button">LinkedIn</button>
      </a>
      <p className="subtitle">Portfolio • Developer</p>
      <a
        href="https://github.com/DVSarvaiya"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        GitHub
      </a>

      <button
        type="button"
        onClick={() => setShowProjects((prev) => !prev)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        {showProjects ? "Hide Projects" : "Show Projects"}
      </button>

      {showProjects && (
        <div className="mt-4 flex flex-col gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border rounded shadow-sm text-left"
            >
              <h2 className="font-bold text-lg">{project.title}</h2>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
