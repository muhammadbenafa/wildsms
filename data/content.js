const stories = [
  {
    id: 1,
    species: "Cross River Gorilla",
    parts: [
      "WILDSMS | Deep in Afi Mountain, Emeka's grandfather once saw gorillas every morning. Today, fewer than 300 remain on earth. All live near YOU. Reply MORE for Part 2.",
      "WILDSMS | Pt 2: Poachers took the rest. But rangers, farmers & students like you stopped them. Afi Mountain is recovering — because people chose to speak up. Reply MORE for Pt 3.",
      "WILDSMS | Pt 3: One gorilla family needs 20km of forest. Protect the trees near you. Report illegal logging: text REPORT to 35367. You are the last line of defence. #WildSMS"
    ]
  },
  {
    id: 2,
    species: "Pangolin",
    parts: [
      "WILDSMS | Nkechi found a pangolin curled like a stone near her farm in Cross River. She called a ranger instead of selling it. That one call protected a species. Reply MORE.",
      "WILDSMS | Pt 2: Nigeria is the world's #1 pangolin trafficking hub. Traffickers pay villagers ₦500 — then sell abroad for ₦500,000. The profit leaves Nigeria. The loss stays. Reply MORE.",
      "WILDSMS | Pt 3: Pangolins eat termites that destroy your crops — they are your unpaid farmhands. See one? Text REPORT PANGOLIN to 35367. Protect your ally. #WildSMS"
    ]
  },
  {
    id: 3,
    species: "African Forest Elephant",
    parts: [
      "WILDSMS | In Okomu forest, an elephant knocked over Bode's fence. He was angry — until rangers showed him the elephant's path was older than his farm. Reply MORE.",
      "WILDSMS | Pt 2: Forest elephants plant trees. Every seed they swallow and drop grows a forest. Without them, Nigeria loses its lungs. Bode now leaves a corridor open. Reply MORE.",
      "WILDSMS | Pt 3: Human-wildlife conflict kills both sides. If an animal threatens your crops, text REPORT ELEPHANT to 35367. Rangers respond within 2 hours. Live together. #WildSMS"
    ]
  }
];

const facts = [
  "WILDFACT: The Cross River gorilla shares 98.6% of human DNA. There are fewer of them left than people in a small Nigerian village. Protect your cousins. Reply STORY to hear more.",
  "WILDFACT: Nigeria loses 350,000 hectares of forest every year — one of the fastest rates in the world. Trees are home. Without them, our wildlife vanishes. Reply STORY to act.",
  "WILDFACT: A single pangolin eats 70 million insects per year, protecting farmland worth billions of naira. They are endangered. You can help. Reply REPORT to flag illegal trade.",
  "WILDFACT: Yankari Game Reserve holds Nigeria's largest elephant population — just 350 animals in 2,244 sq km. In 1980 there were 3,000. Reply STORY to learn what changed.",
  "WILDFACT: The Ibadan malimbe bird exists ONLY in Nigeria. If we lose our forests, it disappears from earth forever. Text REPORT to protect its home. #WildSMS",
  "WILDFACT: Nigeria has 899 bird species, 1,489 fish species & 274 reptiles. More than most of Europe combined. This richness is ours to lose or protect. Reply STORY to learn more.",
  "WILDFACT: Gashaka-Gumti NP in Taraba is Nigeria's largest national park. Home to chimps, lions & wild dogs. Most Nigerians have never heard of it. Now you have. Reply STORY."
];

const welcomeMsg = (name) =>
  `Welcome to WildSMS! Nigeria's wildlife needs your voice.\n\nReply:\nFACT — daily wildlife fact\nSTORY — hear a wildlife story\nREPORT — flag a threat\nSTOP — unsubscribe\n\nTogether we protect our forests.`;

const reportPrompt =
  `WildSMS REPORT. Reply:\nREPORT POACH — illegal hunting\nREPORT FIRE — forest fire\nREPORT TRAP — snare found\nREPORT TRADE — illegal sale\n\nYour identity stays private. Rangers will respond.`;

const stopMsg =
  `You've left WildSMS. We're sorry. Nigeria's wildlife needs every voice. Rejoin anytime: text JOIN to 35367. Stay safe & protect our forests.`;

const unknownMsg =
  `WildSMS: Reply FACT for a wildlife fact, STORY for a story, REPORT to flag a threat, or STOP to leave. Our forests need you.`;

module.exports = { stories, facts, welcomeMsg, reportPrompt, stopMsg, unknownMsg };
