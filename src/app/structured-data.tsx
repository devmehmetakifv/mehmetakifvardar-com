import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mehmet Akif Vardar",
    "url": "https://mehmetakifvardar.com",
    "jobTitle": "Cybersecurity Researcher & Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "ISTUN Software Development Team"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "İstanbul Sağlık ve Teknoloji Üniversitesi"
    },
    "knowsAbout": [
      "Cybersecurity",
      "Penetration Testing",
      "Offensive Security",
      "Web Security",
      ".NET Core Development",
      "Red Teaming",
      "CTF Competitions"
    ],
    "skills": [
      "Web Application Security",
      "Network Security",
      "Penetration Testing",
      "Linux Systems",
      "SQL Server Administration",
      "Scripting & Automation",
      "Vulnerability Research"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/mehmet-akif-vardar/",
      "https://github.com/devmehmetakifv",
      "https://tryhackme.com/p/m4k"
    ]
  }

  return (
    <Script id="structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  )
} 