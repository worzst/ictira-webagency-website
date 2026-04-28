export interface Package {
  name: string;
  price: string;
  tag: string;
  sub: string;
  turnaround: string;
  popular: boolean;
  includes: string[];
  lpItems: string[];
}

export const packages: Package[] = [
  {
    name: "Onepager",
    price: "1490",
    tag: "Für Solopreneure, Events & Launch-Pages",
    sub: "Perfekt für Einzelunternehmer, Solopreneure und schnelle Launches.",
    turnaround: "7",
    popular: false,
    includes: [
      "Eine Seite, klar strukturiert",
      "Einfaches, individuelles Design",
      "Mobile-first, 100 % responsive",
      "Kontaktformular",
      "SEO-Basics & Performance-Tuning",
      "Domain & Hosting-Setup",
      "Zwei Revisions-Runden",
    ],
    lpItems: [
      "Ihr Angebot auf einer Seite – klar, überzeugend, modern",
      "Individuelles Design, kein Baukasten-Template",
      "Mobile-optimiert, SSL & Basis-SEO inklusive",
      "Kontaktformular & Domain-Setup inklusive",
    ],
  },
  {
    name: "Standard",
    price: "1990",
    tag: "Für KMU, Vereine & kleine Teams",
    sub: "Perfekt für klassische KMU mit mehreren Leistungsbereichen.",
    turnaround: "7–10",
    popular: true,
    includes: [
      "Bis zu 5 Seiten nach Mass",
      "Individuelles Design",
      "Mobile-first, 100 % responsive",
      "Kontaktformular & Google-Maps",
      "SEO-Optimierung pro Seite",
      "Domain & Hosting-Setup",
      "Drei Revisions-Runden",
    ],
    lpItems: [
      "5 Seiten: Start, Leistungen, Über uns, Referenzen, Kontakt",
      "Individuelles Design in Ihrem Branding",
      "Texte auf Basis Ihrer Infos – Sie schreiben nichts",
      "Mobile-optimiert, SSL, SEO pro Seite & Google Maps",
      "Domain & Hosting-Setup inklusive",
    ],
  },
  {
    name: "Grösser",
    price: "2990",
    tag: "Für wachsende Firmen mit grösserem Bedarf",
    sub: "Perfekt für wachsende Firmen mit komplexerem Bedarf.",
    turnaround: "14",
    popular: false,
    includes: [
      "6 bis 10 Seiten",
      "Custom Design-System",
      "Mobile-first, 100 % responsive",
      "Kontaktformular & Google-Maps",
      "Analytics & Tracking-Setup",
      "Persönliches Onboarding",
      "Unbegrenzte Revisionen",
    ],
    lpItems: [
      "Bis zu 10 Seiten mit individuellem Design-System",
      "Analytics & Tracking-Setup von Anfang an",
      "Persönliches Onboarding – Sie wissen danach, wie alles läuft",
      "Unbegrenzte Revisionen bis Go-Live",
    ],
  },
];
