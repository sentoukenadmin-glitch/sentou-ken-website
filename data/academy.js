/**
 * academy.js
 * ------------------------------------------------------------------
 * Single source of truth for academy details used across the site.
 * Update information HERE and it will be reflected everywhere it is
 * referenced in the HTML (search for [data-academy="..."] attributes)
 * and inside main.js, contact.js.
 *
 * Fields marked TODO are NOT YET CONFIRMED. Do not publish the site
 * live until every TODO below is either filled in or intentionally
 * removed from the page content. See README.md, section "Before you
 * publish".
 * ------------------------------------------------------------------
 */

const academy = {
  name: "SENTOU-KEN MARTIAL ARTS ACADEMY",
  shortName: "Sentou-Ken",
  tagline: "Discipline. Respect. Self-Defence.",
  city: "Chennai, Tamil Nadu, India",
  // Address updated to the OFFICIAL address per academy confirmation (Selayur is the office/admin address).
  address: "10 Gandhi Street, Sudharsan Nagar, Madambakkam Main Rd, Madambakkam, Chennai – 600073",
  // Pincode confirmed by the academy as 600073.
  landmark: "Near Jayam Supermarket",
  officeAddress: "7/14, Indian Bank Colony, Camp Road, Selayur, Chennai – 600073", // kept on file, not shown publicly — office/admin address only
  style: "Shito-Ryu Karate", // Confirmed
  disciplinesOrder: ["Karate", "Judo", "Jujutsu", "Kenjutsu", "Kalaripayattu", "Varmam", "Silambam", "Adimurai"], // Confirmed display order — Karate first, then Judo, Jujutsu, Kenjutsu, then the rest
  phone1: "98405 40985",
  phone2: "9677246635",
  whatsapp: "919677246635", // Confirmed primary WhatsApp line
  email: "sentouken.admin@gmail.com",
  youtube: "https://www.youtube.com/@Best-Karate_Dojo_in_Chennai",
  instagram: "https://www.instagram.com/sentouken_martial_arts_academy/",
  facebook: "https://www.facebook.com/share/1DWXNr6Q5r/",

  establishedYear: 2001, // Confirmed via Sensei's official biography

  chiefInstructor: {
    name: "Sensei P. M. Gnanasekar",
    title: "Founder, Chief Instructor & Technical Director",
    ranks: [
      "7th Dan Black Belt — Karate",
      "3rd Dan Black Belt — WSKF (World Shito-Ryu Karate Federation)",
      "Black Belt — Judo (Judo Federation of India)",
      "5th Dan Black Belt — Jujutsu (Mixed Martial Arts)",
      "1st Dan — Kenjutsu"
    ],
    // NOTE: A secondary source (Yenjinbudokai org materials) additionally credits
    // him with the title "Renshi" and a 5th Dan recognized specifically for
    // Jujutsu/Kenjutsu under that organization — consistent with the ranks above,
    // but worth Sensei confirming the exact wording/title before it goes on the
    // site, since it wasn't in the academy's own biography document.
    otherExpertise: ["Adimurai", "Kalaripayattu (Kalari)", "Varmam", "Silambam"],
    startedTrainingAge: 15,
    birthYear: 1975, // Confirmed by the academy — used to auto-calculate years of experience below
    trainingStartYear: 1975 + 15, // = 1990. Do not hardcode this elsewhere; it's derived here once.
    studentsTrainedCareerTotal: "10,000+", // across his full career, not exclusively at Sentou-Ken
    competitiveRecord: { gold: 25, silver: 6, bronze: 7 },
    honours: [
      "Honoured twice with the title \"Best Fighter\"",
      "Rotary Club Vocational Excellence Award — \"Best Martial Artist\""
    ],
    professionalRoles: [
      "Instructor, Police Training Academy, Vellore (martial arts & physical training for recruits)",
      "National Referee, KIO",
      "Chief Instructor, South Zone — Jujitsu & Kenjutsu, International India"
    ],
    teacher: "Sensei B. M. Narasimhan", // see lineage.teacher below for full profile
    quote: "The essence of martial arts is the journey of continuous self-improvement — physically, mentally, emotionally, and spiritually.",
    bio: "Sensei P. M. Gnanasekar began his martial arts journey at the age of 15. Over more than 30 years of dedicated practice and teaching, he has trained more than 10,000 students, competed to win 25 Gold, 6 Silver and 7 Bronze medals, and been honoured twice as \"Best Fighter.\" Beyond Karate, he has built expertise across Jujutsu, Kenjutsu, Judo, Adimurai, Kalaripayattu, Varmam and Silambam. In 2001, driven by a vision to share the values of martial arts, he founded Sentou-Ken Martial Arts Academy."
  },

  // The teacher who shaped Sensei P.M. Gnanasekar's own training — shown in the
  // "Our Lineage" section of the About page.
  lineage: {
    teacher: {
      name: "Grandmaster B. M. Narasimhan",
      title: "Founder of the Self Defence School of Indian Karate",
      summary: "A pioneering figure in Indian Karate, National Judo Champion in 1968, and a driving force in expanding structured Karate training in India from the 1970s onward — associated with the development of Indian Karate and Goshin-Ryu. Sensei P. M. Gnanasekar is proud to be his student."
    }
  },

  admin: {
    name: "Sempai Madhavan",
    role: "Admin"
  },

  minimumAge: 6, // Confirmed: "6 & above"

  stats: {
    yearsSinceFounding: 25,     // 2026 − 2001
    studentsTrained: "10,000+", // by the Founder, across his full career
    medalsWon: 23,              // academy students, Mysuru 2026
    branches: 3                 // Confirmed
  },

  // From the live Google Business Profile — verify this is still current before publishing,
  // ratings/review counts change over time.
  googleReviews: {
    rating: 4.8,
    count: 31,
    asOf: "29 Aug 2026" // TODO: update this date whenever you refresh the number
  },

  // Services listed on the Google Business Profile — useful raw material for the
  // Classes page copy. Confirm which of these are still actively offered.
  servicesListed: [
    "Self Defence",
    "Nunchaku",
    "Silambam",
    "Kids Training",
    "Personal Training",
    "Adults Training",
    "Beginners",
    "Women Self Defence Course",
    "Youth and Advanced"
  ],

  // ==========================================================================
  // TOURNAMENT RESULTS — this is the ONLY place you need to edit to add,
  // remove, or correct a tournament. Every entry here automatically:
  //   - becomes a click-to-expand card on tournaments.html
  //   - feeds the "featured: true" one into the Achievements page summary
  // To add a new tournament, copy one whole { ... } block below, paste it
  // as a new item in the list, and change the values. No HTML editing needed.
  // "medals" is optional — omit it entirely (or set to null) for events like
  // seminars where medals don't apply.
  // ==========================================================================
  tournamentResults: [
    {
      id: "aiskc-2026",
      eyebrowLabel: "National — 2026",
      title: "29th All India Shitoryu Karate-Do Championship",
      dateVenue: "24–26 July 2026 · Chamundi Vihaar Stadium, Mysuru",
      studentsCompeted: 18,
      medals: { gold: 7, silver: 7, bronze: 9 }, // totals 23 — shown automatically
      notes: "",
      featured: true // shown as the "Latest Result" on the Achievements page
    },
    {
      id: "state-open-2020",
      eyebrowLabel: "State Level — 2020",
      title: "State Level Invitational Open Karate Championship",
      dateVenue: "Organised by Okinawa Goju-Ryu Karate-Do Kyokai India",
      studentsCompeted: null,
      medals: { gold: 5, silver: 12, bronze: 4 }, // totals 21 — shown automatically
      notes: "",
      featured: false
    },
    {
      id: "jiujitsu-seminar-2015",
      eyebrowLabel: "International Seminar — 2015",
      title: "International Jiu Jitsu Seminar & National WFJ Tournament",
      dateVenue: "27–29 November 2015 · Vashi, Navi Mumbai",
      studentsCompeted: null,
      medals: null,
      notes: "Academy representatives trained and competed alongside international instructors.",
      featured: false
    }
    // To add another tournament, copy this whole block (from the { above the
    // id line, to the } and comma above) and paste it here with new details.
  ],

  // ==========================================================================
  // GALLERY PHOTOS — this is the ONLY place you need to edit to add or remove
  // a gallery photo. Every entry becomes a tile on gallery.html automatically,
  // filterable by category.
  //   1. Add the image file itself into the matching images/ subfolder.
  //   2. Copy one whole { ... } line below, paste it as a new item, and point
  //      "src" at your new file's path.
  // Valid "category" values: "training", "tournaments", "belt-exams", "camps"
  // Add "portrait: true" only for tall/narrow images (like a certificate
  // collage) so they display uncropped instead of being zoomed into a square.
  // ==========================================================================
  galleryPhotos: [
    { src: "images/training/sensei-technique.jpg", alt: "Sensei P. M. Gnanasekar demonstrating a technique", category: "training" },
    { src: "images/training/kenjutsu-demo.jpg", alt: "Kenjutsu sword technique demonstration", category: "training" },
    { src: "images/training/judo-throw.jpg", alt: "Students practicing a Judo throw", category: "training" },
    { src: "images/training/kicks-row-girls.jpg", alt: "Students practicing side kicks in formation", category: "training" },
    { src: "images/training/kicks-row-boys.jpg", alt: "Students practicing side kicks in formation", category: "training" },
    { src: "images/training/training-demo-01.jpg", alt: "Student demonstrating a self-defence throw in front of the class", category: "training" },
    { src: "images/tournaments/aiskc-2026-group-1.jpg", alt: "Students and officials at the 29th All India Shitoryu Karate-Do Championship 2026", category: "tournaments" },
    { src: "images/tournaments/aiskc-2026-group-2.jpg", alt: "Medal-winning students at the 29th All India Shitoryu Karate-Do Championship 2026", category: "tournaments" },
    { src: "images/tournaments/girls-trophies.jpg", alt: "Students with tournament trophies", category: "tournaments" },
    { src: "images/tournaments/boys-trophies.jpg", alt: "Students with tournament trophies", category: "tournaments" },
    { src: "images/tournaments/state-open-2020-group.jpg", alt: "Students at the State Level Invitational Open Karate Championship 2020", category: "tournaments" },
    { src: "images/tournaments/okinawa-gojuryu-state-2020.jpg", alt: "Students at a state-level Karate championship", category: "tournaments" },
    { src: "images/gallery/certificates-collage.jpg", alt: "Students receiving grading certificates", category: "belt-exams", portrait: true },
    { src: "images/gallery/jiujitsu-seminar-2015.jpg", alt: "International Jiu Jitsu Seminar and National WFJ Tournament, 2015", category: "camps" }
    // To add another photo: put the file in the right images/ subfolder, then
    // copy one line above (from { to },) and edit the src/alt/category.
  ],

  // Class timings are intentionally not published on the site (academy's choice).
  programs: [
    {
      name: "Kids Karate",
      ageRange: "6+",
      description: "Foundational karate training focused on coordination, discipline, and confidence."
    },
    {
      name: "Teenage Training",
      ageRange: "6+",
      description: "Building strength, technique, and self-defence skills through structured training."
    },
    {
      name: "Adult Karate",
      ageRange: "Adult",
      description: "Fitness, discipline, and practical self-defence for adult students of all levels."
    }
  ],

  trialClassAvailable: null, // TODO: true/false — confirm before publishing

  // Google Maps — using the free "no API key" embed method
  googleMapsEmbedUrl: "https://www.google.com/maps?q=10+Gandhi+Street,+Sudharsan+Nagar,+Madambakkam+Main+Rd,+Madambakkam,+Chennai&output=embed",
  googleMapsLink: "https://www.google.com/maps?q=10+Gandhi+Street,+Sudharsan+Nagar,+Madambakkam+Main+Rd,+Madambakkam,+Chennai",

  team: [
    { name: "Sensei P. M. Gnanasekar", role: "Founder, Chief Instructor & Technical Director" },
    { name: "Grandmaster B. M. Narasimhan", role: "Founder, Self Defence School of Indian Karate" },
    { name: "Sempai Madhavan", role: "Admin" },
    { name: "Shashank", role: "Instructor" },
    { name: "Sakshin", role: "Instructor" }
  ]
};

// Support both browser <script> usage and module usage without extra tooling
if (typeof module !== "undefined" && module.exports) {
  module.exports = academy;
}
