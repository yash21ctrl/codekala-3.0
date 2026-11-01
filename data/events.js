/**
 * CODEKALA 3.0 Event Registry & Data
 * Presented by ADROIT CCSD
 * Date: November 13, 2026
 * 
 * Events:
 * TECHNICAL:
 *   1. TechPitch (Innovation, Project & Paper Presentation)
 *   2. Algo-X (Algorithmic Coding Arena)
 *   3. Pixel Riot (Frontend, UI/UX & Web Duel)
 * 
 * NON-TECHNICAL:
 *   1. Esports Arena (BGMI & Free Fire)
 *   2. Chaos League (Rapid Blitz Chess & Mind Duel)
 *   3. Clue Crew (Campus Mystery & Cryptic Cipher Hunt)
 */

const EVENT_DATA = {
  // ---------------------------------------------------------
  // TECHNICAL EVENTS
  // ---------------------------------------------------------
  "tech-pitch": {
    id: "tech-pitch",
    title: "TechPitch",
    code: "EVT-TECH-01",
    subtitle: "Innovation, Project & Research Paper Presentation",
    category: "Technical",
    badge: "Paper & Prototype",
    date: "NOV 13",
    time: "10:30 AM - 01:00 PM",
    venue: "Main Auditorium Seminar Hall 1",
    teamSize: "1 - 3 Members",
    prizePool: "₹15,000",
    firstPrize: "₹10,000",
    secondPrize: "₹5,000",
    coordinators: "D. Sabari (+91 98765 43210) & Faculty Jury",
    description: "Present groundbreaking technological solutions, patent-track innovations, working hardware prototypes, or AI architectures to industry veterans.",
    rules: [
      "1. Presentations strictly limited to 7 minutes + 3 minutes live jury Q&A.",
      "2. Domains: Artificial Intelligence, Cloud/DevOps, Cyber Defense, IoT, Web3.",
      "3. Working prototypes and live demos receive 15 bonus evaluation points.",
      "4. Submit slide deck or abstract 30 minutes prior to session commencement.",
      "5. Plagiarism score must remain below 15% across all submitted materials.",
      "6. The decision of the technical evaluation jury is supreme and final."
    ],
    detailedRules: [
      "IEEE format preferred for paper abstracts and literature surveys.",
      "Top 3 presentations receive direct incubation funding recommendations.",
      "All presenters receive official certificates of presentation."
    ]
  },

  "algo-x": {
    id: "algo-x",
    title: "Algo-X",
    code: "EVT-TECH-02",
    subtitle: "The Premier Algorithmic Coding Duel",
    category: "Technical",
    badge: "Speed DSA Duel",
    date: "NOV 13",
    time: "09:30 AM - 12:30 PM",
    venue: "Turing Computing Lab, Block A",
    teamSize: "1 - 2 Members",
    prizePool: "₹18,000",
    firstPrize: "₹12,000",
    secondPrize: "₹6,000",
    coordinators: "D. Sabari & Varshitha Chennothar",
    description: "Push computational logic to the absolute brink. Solve rigorous algorithmic challenges, dynamic programming problems, and graph theory under strict time limits.",
    rules: [
      "1. Round 1: 30 minutes speed logic MCQs and syntax bug debugging.",
      "2. Round 2: 90 minutes deep algorithmic problem-solving across 4 benchmarks.",
      "3. Permitted programming languages: C++, Java 21, Python 3, and Rust.",
      "4. Automated test-suite verdicts and memory usage limits are final.",
      "5. Use of external AI assistants, internet search, or copilot is strictly banned.",
      "6. Tiebreaks determined by submission timestamp and memory footprint."
    ],
    detailedRules: [
      "Individual or duo participation allowed.",
      "Standard offline language documentation will be provided on terminals.",
      "Winner receives the coveted CodeKala 3.0 Grand Master Trophy."
    ]
  },

  "pixel-riot": {
    id: "pixel-riot",
    title: "Pixel Riot",
    code: "EVT-TECH-03",
    subtitle: "Next-Gen UI/UX & Creative Frontend Craft Duel",
    category: "Technical",
    badge: "Frontend & UI/UX",
    date: "NOV 13",
    time: "01:30 PM - 04:00 PM",
    venue: "Multimedia & Design Studio, 3rd Floor",
    teamSize: "1 - 2 Members",
    prizePool: "₹12,000",
    firstPrize: "₹8,000",
    secondPrize: "₹4,000",
    coordinators: "Varshitha Chennothar & Design Guild",
    description: "Battle in an intense creative webcraft arena. Recreate, elevate, and animate high-end web designs under time pressure with pixel-perfect precision.",
    rules: [
      "1. Bespoke design challenge prompt unveiled at the starting bell.",
      "2. Permitted tech stacks: HTML5, CSS3, JavaScript, Tailwind, React, Vue.",
      "3. Pre-built templates, website builders, or component scrapers are banned.",
      "4. Evaluation focuses on design polish, micro-animations, and responsive layout.",
      "5. Projects must render flawlessly across mobile, tablet, and desktop viewports.",
      "6. All commits must be pushed live to a freshly initialized GitHub repository."
    ],
    detailedRules: [
      "Bonus points for fluid SVG animations and accessible contrast ratios.",
      "Judged on typography hierarchy, animation timing curves, and code structure."
    ]
  },

  // ---------------------------------------------------------
  // NON-TECHNICAL EVENTS
  // ---------------------------------------------------------
  "esports": {
    id: "esports",
    title: "Esports Arena (BGMI & Free Fire)",
    code: "EVT-NONTECH-01",
    subtitle: "Tactical Mobile Showdown: BGMI & Free Fire MAX",
    category: "Non-Technical",
    badge: "BGMI & Free Fire",
    date: "NOV 13",
    time: "10:30 AM - 03:30 PM",
    venue: "Gamer's Pavilion, Hall 2",
    teamSize: "Squad (4 Players + 1 Sub)",
    prizePool: "₹25,000",
    firstPrize: "₹16,000 (Split)",
    secondPrize: "₹9,000 (Split)",
    coordinators: "Adroit Gaming Guild (+91 98765 43210)",
    description: "Lock and load for the ultimate battle royale championship. Compete across BGMI (Battlegrounds Mobile India) and Free Fire MAX in high-intensity custom lobby skirmishes.",
    rules: [
      "1. Separate tournament brackets for BGMI Squads and Free Fire MAX Squads.",
      "2. BGMI: 3-Match Cumulative Points Tally (Erangel, Miramar, Sanhok).",
      "3. Free Fire: Bermuda & Purgatory custom room rush matches.",
      "4. Emulators, third-party triggers, macro scripts, or hacks lead to instant permanent ban.",
      "5. Players must play on their own mobile devices; high-speed gigabit Wi-Fi provided.",
      "6. Tournament administrator decisions regarding match remakes are final."
    ],
    detailedRules: [
      "Points distribution: 1st Place = 15 pts, 2nd = 12 pts, 3rd = 10 pts + 1 pt per kill.",
      "Live streamed with casting on the main campus auditorium projector."
    ]
  },

  "chaos-league": {
    id: "chaos-league",
    title: "Chaos League",
    code: "EVT-NONTECH-02",
    subtitle: "Rapid Blitz Chess & Tactical Mind Warfare",
    category: "Non-Technical",
    badge: "Blitz Chess Arena",
    date: "NOV 13",
    time: "10:00 AM - 01:00 PM",
    venue: "Quiet Hall, Central Library",
    teamSize: "Individual",
    prizePool: "₹10,000",
    firstPrize: "₹6,500",
    secondPrize: "₹3,500",
    coordinators: "D. Sabari & Chess Club Lead",
    description: "Engage in 64 squares of cerebral combat. Test tactical depth, rapid calculation, and mental resilience under unforgiving blitz clock pressure.",
    rules: [
      "1. FIDE Rapid/Blitz rules: 5 minutes + 3 seconds increment per player.",
      "2. 5 rounds of Swiss-system matching followed by Top 4 knockout finals.",
      "3. Touch-move rule strictly enforced by accredited arbiters.",
      "4. All electronic gadgets and smartwatches strictly prohibited in playing hall.",
      "5. Buchholz and Sonneborn-Berger systems used for tiebreaks.",
      "6. Chief Arbiter's verdict is supreme on all board disputes."
    ],
    detailedRules: [
      "Digital DGT tournament clocks and wooden Staunton boards provided.",
      "Special memento for the best tactical queen sacrifice of the day."
    ]
  },

  "clue-crew": {
    id: "clue-crew",
    title: "Clue Crew",
    code: "EVT-NONTECH-03",
    subtitle: "Campus-Wide Cryptic Mystery & Geocache Treasure Quest",
    category: "Non-Technical",
    badge: "Mystery Treasure Hunt",
    date: "NOV 13",
    time: "02:00 PM - 04:30 PM",
    venue: "Campus Grounds & Quadrangles",
    teamSize: "3 - 4 Members",
    prizePool: "₹12,000",
    firstPrize: "₹8,000",
    secondPrize: "₹4,000",
    coordinators: "Varshitha Chennothar & Clue Marshals",
    description: "A labyrinth of hidden ciphers, historic riddles, GPS coordinates, and physical challenges scattered across the campus grounds. Recover the sacred Kala Relic to triumph.",
    rules: [
      "1. Teams must solve each clue sequentially to receive the next checkpoint cipher.",
      "2. All team members must report together at each marshaled waypoint.",
      "3. Strict zero-tolerance policy against disrupting academic classes or restricted labs.",
      "4. Using motorized vehicles on campus will trigger immediate team disqualification.",
      "5. The first team to decipher the final riddle and retrieve the Kala Relic wins.",
      "6. In case of disputed clues, checkpoint marshal logs determine the ranking."
    ],
    detailedRules: [
      "Decryption skills needed: Morse code, Caesar ciphers, and QR geolocation puzzles.",
      "Wear comfortable running footwear."
    ]
  }
};
