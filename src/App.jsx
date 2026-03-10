import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const PARTIES = [
  { id: "h2000", name: "Heiloo-2000", short: "H-2000", color: "#D4A017", light: "#FDF3D0" },
  { id: "glpvda", name: "GroenLinks/PvdA", short: "GL/PvdA", color: "#2E7D32", light: "#E8F5E9" },
  { id: "vvd", name: "VVD", short: "VVD", color: "#003DA5", light: "#E3EAF8" },
  { id: "d66", name: "D66", short: "D66", color: "#1B9E3E", light: "#E6F4EA" },
  { id: "gbh", name: "Gemeentebelangen", short: "GBH", color: "#1565C0", light: "#E3F0FD" },
  { id: "cda", name: "CDA", short: "CDA", color: "#007D3A", light: "#E6F4ED" },
];

// Party positions: -2 strongly against, -1 against, 0 neutral, 1 for, 2 strongly for
const QUESTIONS = [
  {
    id: 1,
    theme: "Infrastructuur",
    emoji: "🛣️",
    statement: "Er moet een nieuwe A9-afslag bij Heiloo komen om de verkeersdruk op het centrum te verlichten.",
    context: "De A9-afslag is een van de meest besproken punten in de verkiezingen. Voorstanders zeggen dat het de Kennemerstraatweg ontlast; tegenstanders vrezen extra forensenverkeer en bebouwing.",
    positions: { h2000: -1, glpvda: 0, vvd: 2, d66: 2, gbh: -2, cda: 0 },
  },
  {
    id: 2,
    theme: "Woningbouw",
    emoji: "🏗️",
    statement: "De Zandzoom moet volledig worden bebouwd met 1.300 nieuwe woningen.",
    context: "De Zandzoom is een groot groen gebied ten oosten van Heiloo. De plannen variëren van volledige bebouwing (1300 woningen, VVD) tot beperkte bouw gericht op lokale behoefte.",
    positions: { h2000: -1, glpvda: -1, vvd: 2, d66: 1, gbh: -2, cda: 0 },
  },
  {
    id: 3,
    theme: "Bestuur",
    emoji: "🏛️",
    statement: "Heiloo moet fuseren met de andere BUCH-gemeenten (Bergen, Uitgeest, Castricum) tot één grote gemeente.",
    context: "Een grotere gemeente kan efficiënter werken en grotere projecten realiseren. Tegenstanders vrezen verlies van lokale zeggenschap en democratische betrokkenheid.",
    positions: { h2000: 0, glpvda: 1, vvd: 0, d66: 2, gbh: -2, cda: -2 },
  },
  {
    id: 4,
    theme: "Woningbouw",
    emoji: "🏠",
    statement: "Woningbouw moet primair gericht zijn op betaalbare woningen voor jongeren en senioren uit de eigen regio.",
    context: "Er is in Heiloo een groot tekort aan betaalbare woningen. De vraag is of nieuwbouw primair voor de lokale behoefte is of ook voor mensen van buiten.",
    positions: { h2000: 1, glpvda: 2, vvd: 1, d66: 2, gbh: 2, cda: 2 },
  },
  {
    id: 5,
    theme: "Duurzaamheid",
    emoji: "🔥",
    statement: "Bewoners mogen niet verplicht worden om van het aardgas af te gaan — dat moet vrijwillig zijn.",
    context: "De energietransitie is een groot thema. Sommige partijen vinden dat mensen de vrijheid moeten hebben om zelf te kiezen wanneer ze overstappen.",
    positions: { h2000: 1, glpvda: -1, vvd: 2, d66: 0, gbh: 0, cda: 1 },
  },
  {
    id: 6,
    theme: "Woningbouw",
    emoji: "🏢",
    statement: "Bij nieuwe bouwprojecten moet minimaal 40% van de woningen sociale huurwoning zijn.",
    context: "GroenLinks/PvdA pleit voor de 40/40/20-norm. Andere partijen vinden dit te rigide en willen meer maatwerk per locatie.",
    positions: { h2000: 1, glpvda: 2, vvd: -1, d66: 1, gbh: 1, cda: 1 },
  },
  {
    id: 7,
    theme: "Verkeer",
    emoji: "🚗",
    statement: "De maximumsnelheid in de meeste straten van Heiloo moet naar 30 km/uur.",
    context: "D66 wil 30 km/uur als standaard in het dorp voor meer verkeersveiligheid. De VVD vreest oponthoud en wil dit beperken tot schoolomgevingen.",
    positions: { h2000: 0, glpvda: 1, vvd: -1, d66: 2, gbh: 1, cda: 0 },
  },
  {
    id: 8,
    theme: "Verkeer",
    emoji: "🅿️",
    statement: "Gratis parkeren in de gemeente Heiloo moet behouden blijven.",
    context: "De VVD wil gratis parkeren handhaven als vestigingsfactor voor ondernemers en bezoekers. Andere partijen zien betaald parkeren als middel om autogebruik te ontmoedigen.",
    positions: { h2000: 1, glpvda: -1, vvd: 2, d66: -1, gbh: 0, cda: 1 },
  },
  {
    id: 9,
    theme: "Natuur",
    emoji: "🌿",
    statement: "De groene ring rondom Heiloo moet beschermd en ecologisch versterkt worden — geen bebouwing.",
    context: "Heiloo heeft een uniek groen karakter. Alle partijen hechten belang aan groen, maar ze verschillen in hoe strikt ze omgaan met bebouwing in de groene gordel.",
    positions: { h2000: 2, glpvda: 2, vvd: 1, d66: 2, gbh: 2, cda: 1 },
  },
  {
    id: 10,
    theme: "Voorzieningen",
    emoji: "🏊",
    statement: "De gemeente moet een meerjarige financiële garantie geven voor zwembad het Baafje en theater de Beun.",
    context: "Na het faillissement van Stichting Heiloo Aktief in 2022 zijn beide voorzieningen precair. Alle partijen willen ze behouden, maar verschillen over hoe ze dat willen financieren.",
    positions: { h2000: 2, glpvda: 2, vvd: 1, d66: 2, gbh: 2, cda: 2 },
  },
  {
    id: 11,
    theme: "Democratie",
    emoji: "🗳️",
    statement: "Inwoners van Heiloo moeten via een referendum kunnen meebeslissen over grote gemeentelijke kwesties.",
    context: "Gemeentebelangen pleit expliciet voor referenda bij grote kwesties. Andere partijen zijn minder uitgesproken over dit instrument.",
    positions: { h2000: 1, glpvda: 1, vvd: 0, d66: 1, gbh: 2, cda: 0 },
  },
  {
    id: 12,
    theme: "Woningbouw",
    emoji: "📈",
    statement: "De gemeente moet actief optreden tegen woningspeculatie: woningen zijn voor bewoning, niet voor belegging.",
    context: "GroenLinks/PvdA wil anti-speculatiebeding in koopcontracten opnemen. De VVD vindt dit te ver gaan en een inbreuk op de vrije markt.",
    positions: { h2000: 1, glpvda: 2, vvd: -1, d66: 1, gbh: 1, cda: 1 },
  },
  {
    id: 13,
    theme: "Duurzaamheid",
    emoji: "☀️",
    statement: "Het nieuwe geluidsscherm langs de A9 moet worden gecombineerd met zonnepanelen.",
    context: "VVD en CDA zijn enthousiast over zon-op-geluidswallen. Ze zien dit als een manier om duurzaamheid te combineren met nuttige infrastructuur, zonder zonnepanelen in het groen.",
    positions: { h2000: 1, glpvda: 1, vvd: 2, d66: 1, gbh: 0, cda: 2 },
  },
  {
    id: 14,
    theme: "Fiets",
    emoji: "🚲",
    statement: "Heiloo moet een echt fietsdorp worden: veilige, bredere fietspaden en meer ruimte voor fietsers ten koste van auto's.",
    context: "CDA en D66 willen fietsen promoten. De VVD wil de bereikbaarheid per auto niet in gevaar brengen.",
    positions: { h2000: 1, glpvda: 2, vvd: 1, d66: 2, gbh: 1, cda: 2 },
  },
  {
    id: 15,
    theme: "Zorg",
    emoji: "🤝",
    statement: "De bestrijding van eenzaamheid moet een expliciet speerpunt worden van het gemeentelijk beleid.",
    context: "Het CDA heeft dit als concreet speerpunt opgenomen. Andere partijen onderschrijven het belang van sociale cohesie, maar zijn minder concreet over beleid.",
    positions: { h2000: 1, glpvda: 2, vvd: 1, d66: 1, gbh: 1, cda: 2 },
  },
  {
    id: 16,
    theme: "Natuur",
    emoji: "🦋",
    statement: "De gemeente moet meer investeren in biodiversiteit: meer bomen, bloemrijke bermen en wilde natuur in openbaar groen.",
    context: "Meerdere partijen willen de natuur in Heiloo versterken. De vraag is hoe ver de gemeente hierin mag gaan ten koste van gemaaid gazon.",
    positions: { h2000: 2, glpvda: 2, vvd: 1, d66: 2, gbh: 2, cda: 2 },
  },
  {
    id: 17,
    theme: "Bestuur",
    emoji: "📢",
    statement: "De gemeente moet inwoners eerder en actiever betrekken bij plannen die hun buurt of straat raken.",
    context: "Alle partijen spreken over burgerparticipatie, maar verschillen in hoe verplichtend ze dit willen maken.",
    positions: { h2000: 1, glpvda: 2, vvd: 1, d66: 2, gbh: 2, cda: 1 },
  },
  {
    id: 18,
    theme: "Vliegtuigoverlast",
    emoji: "✈️",
    statement: "De gemeente moet actief lobbyen in Den Haag om de vliegtuigoverlast boven Heiloo terug te dringen.",
    context: "Heiloo ligt onder drukke vliegroutes. Gemeentebelangen heeft dit als expliciet speerpunt. Andere partijen zijn minder uitgesproken.",
    positions: { h2000: 1, glpvda: 1, vvd: 0, d66: 1, gbh: 2, cda: 1 },
  },
];

const THEMES = [...new Set(QUESTIONS.map(q => q.theme))];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function calcResults(answers, weights) {
  return PARTIES.map(party => {
    let totalScore = 0;
    let totalWeight = 0;
    let agreements = 0;
    let count = 0;

    QUESTIONS.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer === undefined || userAnswer === null) return;
      const partyPos = q.positions[party.id];
      const themeWeight = weights[q.theme] ?? 1;
      // Distance: closer = better score
      const distance = Math.abs(userAnswer - partyPos);
      const maxDist = 4;
      const score = ((maxDist - distance) / maxDist) * themeWeight;
      totalScore += score;
      totalWeight += themeWeight;
      if (distance <= 1) agreements++;
      count++;
    });

    const pct = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
    return { ...party, score: pct, agreements, total: count };
  }).sort((a, b) => b.score - a.score);
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const ANSWER_OPTIONS = [
  { value: -2, label: "Helemaal mee oneens", short: "Oneens", emoji: "👎" },
  { value: -1, label: "Mee oneens", short: "Licht oneens", emoji: "↙️" },
  { value: 0, label: "Neutraal / geen mening", short: "Neutraal", emoji: "↔️" },
  { value: 1, label: "Mee eens", short: "Licht eens", emoji: "↗️" },
  { value: 2, label: "Helemaal mee eens", short: "Eens", emoji: "👍" },
];

export default function Kieswijzer() {
  const [screen, setScreen] = useState("intro"); // intro | question | weight | result
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [weights, setWeights] = useState(
    Object.fromEntries(THEMES.map(t => [t, 1]))
  );
  const [showContext, setShowContext] = useState(false);
  const [results, setResults] = useState(null);
  const [animDir, setAnimDir] = useState("right");
  const [animKey, setAnimKey] = useState(0);

  const q = QUESTIONS[current];
  const progress = (current / QUESTIONS.length) * 100;
  const answered = Object.keys(answers).length;

  function answer(val) {
    setAnswers(prev => ({ ...prev, [q.id]: val }));
    setShowContext(false);
    setAnimDir("right");
    setAnimKey(k => k + 1);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 180);
    } else {
      setTimeout(() => setScreen("weight"), 180);
    }
  }

  function goBack() {
    if (current > 0) {
      setAnimDir("left");
      setAnimKey(k => k + 1);
      setShowContext(false);
      setCurrent(c => c - 1);
    }
  }

  function skip() {
    setAnswers(prev => ({ ...prev, [q.id]: 0 }));
    setShowContext(false);
    setAnimDir("right");
    setAnimKey(k => k + 1);
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 180);
    } else {
      setTimeout(() => setScreen("weight"), 180);
    }
  }

  function showResults() {
    setResults(calcResults(answers, weights));
    setScreen("result");
  }

  function restart() {
    setAnswers({});
    setWeights(Object.fromEntries(THEMES.map(t => [t, 1])));
    setCurrent(0);
    setResults(null);
    setScreen("intro");
  }

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .kw-root {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background: #F0EDE8;
      color: #1A1A1A;
    }

    /* ── INTRO ── */
    .intro {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(160deg, #1A2E4A 0%, #0D1B2E 60%, #1A2E4A 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }
    .intro::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 20%, rgba(255,200,60,0.12) 0%, transparent 55%),
                  radial-gradient(ellipse at 80% 80%, rgba(30,180,100,0.1) 0%, transparent 50%);
    }
    .intro-badge {
      background: rgba(255,200,60,0.18);
      border: 1px solid rgba(255,200,60,0.4);
      color: #FFD54F;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 28px;
      position: relative;
    }
    .intro h1 {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(36px, 7vw, 64px);
      line-height: 1.1;
      text-align: center;
      margin-bottom: 12px;
      position: relative;
    }
    .intro h1 span { color: #FFD54F; }
    .intro-sub {
      font-size: 18px;
      opacity: 0.75;
      text-align: center;
      margin-bottom: 12px;
      position: relative;
    }
    .intro-date {
      font-size: 14px;
      opacity: 0.5;
      margin-bottom: 48px;
      position: relative;
    }
    .intro-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-bottom: 48px;
      position: relative;
    }
    .party-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
    }
    .party-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .intro-stats {
      display: flex;
      gap: 32px;
      margin-bottom: 48px;
      position: relative;
    }
    .stat { text-align: center; }
    .stat-num {
      font-family: 'DM Serif Display', serif;
      font-size: 36px;
      color: #FFD54F;
    }
    .stat-label { font-size: 12px; opacity: 0.6; margin-top: 2px; }

    /* ── BUTTON ── */
    .btn-primary {
      background: #FFD54F;
      color: #1A1A1A;
      border: none;
      border-radius: 12px;
      padding: 16px 40px;
      font-family: 'DM Sans', sans-serif;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .btn-primary:hover { background: #FFE082; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,213,79,0.3); }
    .btn-secondary {
      background: transparent;
      color: #555;
      border: 1.5px solid #DDD;
      border-radius: 10px;
      padding: 10px 22px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: #999; color: #222; background: #F5F5F5; }

    /* ── QUESTION SCREEN ── */
    .q-screen {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #F0EDE8;
    }
    .q-topbar {
      background: #1A2E4A;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }
    .q-logo {
      font-family: 'DM Serif Display', serif;
      color: #FFD54F;
      font-size: 18px;
      white-space: nowrap;
    }
    .progress-bar-wrap {
      flex: 1;
      height: 6px;
      background: rgba(255,255,255,0.15);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: #FFD54F;
      border-radius: 3px;
      transition: width 0.4s ease;
    }
    .q-counter {
      color: rgba(255,255,255,0.6);
      font-size: 13px;
      white-space: nowrap;
    }

    .q-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px 32px;
      max-width: 720px;
      margin: 0 auto;
      width: 100%;
    }

    .q-theme-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: white;
      border: 1.5px solid #E0DDD8;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }

    .q-card {
      background: white;
      border-radius: 20px;
      padding: 32px 32px 24px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.07);
      margin-bottom: 24px;
    }

    .q-statement {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(20px, 3.5vw, 26px);
      line-height: 1.35;
      color: #1A1A1A;
      margin-bottom: 16px;
    }

    .q-context-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #007AFF;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      background: none;
      border: none;
      padding: 4px 0;
    }
    .q-context-toggle:hover { opacity: 0.75; }

    .q-context {
      margin-top: 14px;
      padding: 14px 16px;
      background: #F7F6F2;
      border-left: 3px solid #FFD54F;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
      line-height: 1.6;
      color: #555;
    }

    /* ── ANSWER BUTTONS ── */
    .answers-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      margin-bottom: 16px;
    }
    .answer-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      border-radius: 14px;
      border: 2px solid #E8E5E0;
      background: white;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #1A1A1A;
    }
    .answer-btn:hover {
      border-color: #1A2E4A;
      background: #F5F3EE;
      transform: translateX(4px);
    }
    .answer-btn.selected {
      border-color: #1A2E4A;
      background: #1A2E4A;
      color: white;
    }
    .answer-emoji { font-size: 20px; flex-shrink: 0; }
    .answer-pill {
      display: inline-block;
      background: rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 2px 10px;
      font-size: 12px;
      margin-left: auto;
      white-space: nowrap;
    }

    .q-nav {
      display: flex;
      gap: 10px;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .anim-right { animation: slideInRight 0.25s ease; }
    .anim-left { animation: slideInLeft 0.25s ease; }

    /* ── WEIGHT SCREEN ── */
    .weight-screen {
      min-height: 100vh;
      background: #F0EDE8;
      display: flex;
      flex-direction: column;
    }
    .weight-body {
      flex: 1;
      max-width: 720px;
      margin: 0 auto;
      width: 100%;
      padding: 32px 16px;
    }
    .weight-title {
      font-family: 'DM Serif Display', serif;
      font-size: 28px;
      margin-bottom: 8px;
    }
    .weight-sub {
      color: #666;
      font-size: 15px;
      margin-bottom: 32px;
      line-height: 1.5;
    }
    .weight-item {
      background: white;
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .weight-item-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .weight-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 15px;
    }
    .weight-value {
      font-weight: 700;
      color: #1A2E4A;
      font-size: 15px;
    }
    .weight-slider {
      width: 100%;
      -webkit-appearance: none;
      height: 6px;
      border-radius: 3px;
      background: #E0DDD8;
      outline: none;
      cursor: pointer;
    }
    .weight-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 22px; height: 22px;
      border-radius: 50%;
      background: #1A2E4A;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .weight-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    /* ── RESULT SCREEN ── */
    .result-screen {
      min-height: 100vh;
      background: #F0EDE8;
    }
    .result-hero {
      background: linear-gradient(160deg, #1A2E4A 0%, #0D1B2E 100%);
      padding: 40px 24px 60px;
      color: white;
      text-align: center;
      position: relative;
    }
    .result-hero-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.6;
      margin-bottom: 12px;
    }
    .result-hero h2 {
      font-family: 'DM Serif Display', serif;
      font-size: clamp(28px, 6vw, 48px);
      margin-bottom: 6px;
    }
    .result-hero h2 span { color: #FFD54F; }
    .result-hero-sub { opacity: 0.65; font-size: 16px; }

    .result-body {
      max-width: 720px;
      margin: -24px auto 0;
      padding: 0 16px 48px;
      position: relative;
    }

    .result-winner {
      background: white;
      border-radius: 20px;
      padding: 28px 28px 24px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      margin-bottom: 20px;
      border-top: 4px solid var(--party-color);
    }
    .result-winner-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--party-color);
      margin-bottom: 8px;
    }
    .result-winner-name {
      font-family: 'DM Serif Display', serif;
      font-size: 32px;
      color: #1A1A1A;
      margin-bottom: 4px;
    }
    .result-winner-score {
      font-size: 64px;
      font-weight: 700;
      color: var(--party-color);
      line-height: 1;
      margin-bottom: 6px;
    }
    .result-winner-agreements {
      color: #888;
      font-size: 14px;
    }

    .result-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
    .result-party-row {
      background: white;
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .result-rank {
      font-size: 13px;
      font-weight: 700;
      color: #BBB;
      width: 24px;
      text-align: center;
    }
    .result-party-name {
      flex: 1;
      font-weight: 600;
      font-size: 15px;
    }
    .result-bar-wrap {
      flex: 2;
      height: 10px;
      background: #F0EDE8;
      border-radius: 5px;
      overflow: hidden;
    }
    .result-bar-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 1s ease;
    }
    .result-pct {
      font-size: 15px;
      font-weight: 700;
      color: #1A1A1A;
      width: 44px;
      text-align: right;
    }

    .result-detail-title {
      font-family: 'DM Serif Display', serif;
      font-size: 22px;
      margin-bottom: 16px;
      color: #1A1A1A;
    }
    .result-theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 28px;
    }
    .result-theme-card {
      background: white;
      border-radius: 14px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .rtc-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 12px;
      color: #444;
    }
    .rtc-parties {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .rtc-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
    }
    .rtc-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .rtc-name { flex: 1; color: #555; }
    .rtc-bar-wrap {
      width: 60px;
      height: 4px;
      background: #F0EDE8;
      border-radius: 2px;
      overflow: hidden;
    }
    .rtc-bar-fill { height: 100%; border-radius: 2px; }

    .result-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      padding-top: 8px;
    }

    .disclaimer {
      text-align: center;
      font-size: 12px;
      color: #AAA;
      margin-top: 32px;
      line-height: 1.6;
      padding: 0 16px;
    }

    /* theme emoji map */
    .theme-emojis { display: none; }
  `;

  const THEME_EMOJI = {
    Infrastructuur: "🛣️", Woningbouw: "🏠", Bestuur: "🏛️",
    Duurzaamheid: "♻️", Natuur: "🌿", Verkeer: "🚗",
    Voorzieningen: "🎭", Democratie: "🗳️", Fiets: "🚲",
    Zorg: "🤝", Vliegtuigoverlast: "✈️",
  };

  const WEIGHT_LABELS = { 0: "Niet belangrijk", 1: "Normaal", 2: "Belangrijk", 3: "Zeer belangrijk" };

  if (screen === "intro") return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="intro">
        <div className="intro-badge">🗳️ Gemeenteraadsverkiezingen</div>
        <h1>Heiloo<br /><span>Kieswijzer</span> 2026</h1>
        <p className="intro-sub">Ontdek welke partij het beste bij uw standpunten past</p>
        <p className="intro-date">18 maart 2026 · 18 stellingen · ~5 minuten</p>

        <div className="intro-cards">
          {PARTIES.map(p => (
            <div key={p.id} className="party-chip">
              <span className="party-dot" style={{ background: p.color }} />
              {p.name}
            </div>
          ))}
        </div>

        <div className="intro-stats">
          <div className="stat"><div className="stat-num">18</div><div className="stat-label">Stellingen</div></div>
          <div className="stat"><div className="stat-num">6</div><div className="stat-label">Partijen</div></div>
          <div className="stat"><div className="stat-num">11</div><div className="stat-label">Thema's</div></div>
        </div>

        <button className="btn-primary" onClick={() => setScreen("question")}>
          Start de kieswijzer →
        </button>
      </div>
    </div>
  );

  if (screen === "question") return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="q-screen">
        <div className="q-topbar">
          <div className="q-logo">Heiloo Kieswijzer</div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="q-counter">{current + 1} / {QUESTIONS.length}</div>
        </div>

        <div className="q-body">
          <div className={`q-theme-badge ${animDir === "right" ? "anim-right" : "anim-left"}`} key={`badge-${animKey}`}>
            <span>{THEME_EMOJI[q.theme] || "📌"}</span>
            {q.theme}
          </div>

          <div className={`q-card ${animDir === "right" ? "anim-right" : "anim-left"}`} key={`card-${animKey}`}>
            <div className="q-statement">"{q.statement}"</div>
            <button className="q-context-toggle" onClick={() => setShowContext(v => !v)}>
              {showContext ? "▲ Verberg toelichting" : "▼ Toon toelichting"}
            </button>
            {showContext && <div className="q-context">{q.context}</div>}
          </div>

          <div className={`answers-grid ${animDir === "right" ? "anim-right" : "anim-left"}`} key={`ans-${animKey}`}>
            {ANSWER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`answer-btn${answers[q.id] === opt.value ? " selected" : ""}`}
                onClick={() => answer(opt.value)}
              >
                <span className="answer-emoji">{opt.emoji}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="q-nav">
            <button className="btn-secondary" onClick={goBack} disabled={current === 0}
              style={{ opacity: current === 0 ? 0.4 : 1 }}>
              ← Vorige
            </button>
            <button className="btn-secondary" onClick={skip}>Sla over</button>
            {answered >= QUESTIONS.length * 0.7 && (
              <button className="btn-primary" onClick={() => setScreen("weight")} style={{ padding: "10px 20px", fontSize: 14 }}>
                Naar resultaat →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (screen === "weight") return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div className="weight-screen">
        <div className="q-topbar">
          <div className="q-logo">Heiloo Kieswijzer</div>
          <div className="q-counter" style={{ marginLeft: "auto" }}>Stap 2 van 3</div>
        </div>
        <div className="weight-body">
          <div className="weight-title">Wat vindt u belangrijk?</div>
          <p className="weight-sub">
            Geef aan hoeveel gewicht de verschillende thema's voor u hebben. Schuif de bal naar rechts om een thema zwaarder mee te laten tellen in uw resultaat.
          </p>
          {THEMES.map(theme => (
            <div key={theme} className="weight-item">
              <div className="weight-item-top">
                <div className="weight-label">
                  <span style={{ fontSize: 20 }}>{THEME_EMOJI[theme] || "📌"}</span>
                  {theme}
                </div>
                <div className="weight-value">{WEIGHT_LABELS[weights[theme]]}</div>
              </div>
              <input
                type="range" min={0} max={3} step={1}
                value={weights[theme]}
                className="weight-slider"
                onChange={e => setWeights(w => ({ ...w, [theme]: Number(e.target.value) }))}
              />
            </div>
          ))}
          <div className="weight-actions">
            <button className="btn-secondary" onClick={() => setScreen("question")}>← Terug naar stellingen</button>
            <button className="btn-primary" onClick={showResults}>Bekijk mijn resultaat →</button>
          </div>
        </div>
      </div>
    </div>
  );

  if (screen === "result" && results) {
    const winner = results[0];
    // Theme breakdown per party
    const themeBreakdown = THEMES.map(theme => {
      const qs = QUESTIONS.filter(q => q.theme === theme);
      return {
        theme,
        parties: PARTIES.map(party => {
          let score = 0, count = 0;
          qs.forEach(q => {
            const userAns = answers[q.id];
            if (userAns === undefined || userAns === null) return;
            const dist = Math.abs(userAns - q.positions[party.id]);
            score += (4 - dist) / 4;
            count++;
          });
          return { ...party, pct: count > 0 ? Math.round((score / count) * 100) : 0 };
        }).sort((a, b) => b.pct - a.pct)
      };
    });

    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <style>{styles}</style>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <div className="result-screen">
          <div className="result-hero">
            <div className="result-hero-label">Uw resultaat</div>
            <h2>Beste match: <span>{winner.name}</span></h2>
            <p className="result-hero-sub">{winner.score}% overeenkomst · {winner.agreements} van {winner.total} standpunten dichtbij</p>
          </div>

          <div className="result-body">
            {/* Winner card */}
            <div className="result-winner" style={{ "--party-color": winner.color }}>
              <div className="result-winner-badge">🥇 Uw beste match</div>
              <div className="result-winner-name">{winner.name}</div>
              <div className="result-winner-score">{winner.score}%</div>
              <div className="result-winner-agreements">
                Overeenkomst op {winner.agreements} van {winner.total} stellingen
              </div>
            </div>

            {/* Full ranking */}
            <div className="result-detail-title">Alle partijen vergeleken</div>
            <div className="result-list">
              {results.map((p, i) => (
                <div key={p.id} className="result-party-row">
                  <div className="result-rank">#{i + 1}</div>
                  <div className="result-party-name" style={{ color: i === 0 ? p.color : "#1A1A1A" }}>{p.name}</div>
                  <div className="result-bar-wrap">
                    <div className="result-bar-fill" style={{ width: `${p.score}%`, background: p.color }} />
                  </div>
                  <div className="result-pct">{p.score}%</div>
                </div>
              ))}
            </div>

            {/* Theme breakdown */}
            <div className="result-detail-title">Overeenkomst per thema</div>
            <div className="result-theme-grid">
              {themeBreakdown.filter(t => t.parties.some(p => {
                const userQs = QUESTIONS.filter(q => q.theme === t.theme && answers[q.id] !== undefined);
                return userQs.length > 0;
              })).map(({ theme, parties }) => (
                <div key={theme} className="result-theme-card">
                  <div className="rtc-header">
                    <span>{THEME_EMOJI[theme] || "📌"}</span>
                    {theme}
                  </div>
                  <div className="rtc-parties">
                    {parties.slice(0, 4).map(p => (
                      <div key={p.id} className="rtc-row">
                        <div className="rtc-dot" style={{ background: p.color }} />
                        <div className="rtc-name">{p.short}</div>
                        <div className="rtc-bar-wrap">
                          <div className="rtc-bar-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#555", minWidth: 30, textAlign: "right" }}>{p.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="result-actions">
              <button className="btn-secondary" onClick={restart}>↺ Opnieuw beginnen</button>
              <button className="btn-secondary" onClick={() => setScreen("weight")}>⚖️ Gewichten aanpassen</button>
            </div>

            <div className="disclaimer">
              Deze kieswijzer is samengesteld op basis van gepubliceerde verkiezingsprogramma's en standpunten van de deelnemende partijen.<br />
              De resultaten zijn indicatief en geen politiek advies. Lees de volledige programma's voor een compleet beeld.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}