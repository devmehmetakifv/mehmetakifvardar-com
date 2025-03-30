'use client';

import Terminal from '@/components/Terminal';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <header className="sr-only">
        <center>
          <h1>Mehmet Akif VARDAR - Cybersecurity Researcher & Developer</h1>
          <p>Personal portfolio showcasing skills, experience, and achievements in cybersecurity and software development.</p>
        </center>
      </header>
      <section aria-label="Terminal Portfolio Interface">
        <Terminal />
      </section>
    </main>
  );
}
