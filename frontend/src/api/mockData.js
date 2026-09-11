/**
 * HeritageGuardian AI - Client-Side Demo Simulation Engine
 * Provides comprehensive, realistic data for all 5 AI agents & orchestrator
 * when running offline (e.g. GitHub Pages static deployment) or when
 * backend is unreachable.
 */

export const DEMO_SITES = [
  {
    id: 1,
    name: "Modhera Sun Temple",
    location: "Modhera, Mehsana District, Gujarat",
    description: "Built circa 1026 CE by Solanki ruler Bhimdev I, the Modhera Sun Temple is one of India's finest examples of ancient solar architecture. Features the Surya Kund stepped tank, Sabha Mandap, and Garbhagriha, aligned for equinoctial illumination.",
    latitude: 23.5846,
    longitude: 72.1294,
    site_type: "Solar Temple",
    established_year: 1026,
    unesco_status: false,
    max_visitor_capacity: 500,
    health_score: 68.0,
    is_active: true
  },
  {
    id: 2,
    name: "Ahmedabad Walled City",
    location: "Old Ahmedabad, Gujarat (India's First UNESCO World Heritage City)",
    description: "Founded in 1411 CE by Sultan Ahmed Shah I, Ahmedabad's Walled City is India's first UNESCO World Heritage City (inscribed 2017). Features historic pols, Sidi Saiyyed Mosque, Teen Darwaza, Jama Masjid, and a living heritage of over 600,000 residents.",
    latitude: 23.0225,
    longitude: 72.5714,
    site_type: "Urban Heritage Zone",
    established_year: 1411,
    unesco_status: true,
    max_visitor_capacity: 2000,
    health_score: 74.0,
    is_active: true
  },
  {
    id: 3,
    name: "Sidi Saiyyed Mosque",
    location: "Lal Darwaza, Ahmedabad, Gujarat",
    description: "Built in 1573 CE, Sidi Saiyyed Mosque is renowned worldwide for its exquisite stone latticework jali windows depicting the intricate 'Tree of Life'. A masterpiece of Indo-Islamic stone craftsmanship.",
    latitude: 23.0264,
    longitude: 72.5827,
    site_type: "Mosque / Architectural Monument",
    established_year: 1573,
    unesco_status: true,
    max_visitor_capacity: 300,
    health_score: 81.0,
    is_active: true
  },
  {
    id: 4,
    name: "Rani Ki Vav (Queen's Stepwell)",
    location: "Patan, Gujarat",
    description: "An intricately carved seven-level stepwell built in the 11th century CE by Queen Udayamati in memory of King Bhimdev I. UNESCO World Heritage Site featuring over 500 principal sculptures.",
    latitude: 23.8589,
    longitude: 72.1021,
    site_type: "Stepwell (Vav)",
    established_year: 1063,
    unesco_status: true,
    max_visitor_capacity: 400,
    health_score: 85.0,
    is_active: true
  }
]

export const getMockOverview = () => ({
  total_sites: 4,
  healthy_sites: 2,
  sites_needing_attention: 2,
  active_visitor_alerts: 1,
  active_encroachment_alerts: 3,
  active_structural_alerts: 4,
  open_conservation_tasks: 6,
  overall_heritage_health_score: 72.0,
  sites: DEMO_SITES.map(s => ({
    id: s.id,
    name: s.name,
    health_score: s.health_score,
    latitude: s.latitude,
    longitude: s.longitude,
    site_type: s.site_type,
    unesco_status: s.unesco_status
  })),
  data_note: "Visitor counts are simulated. Structural scores from AI-assisted analysis.",
  timestamp: new Date().toISOString()
})

export const getMockVisitorData = (siteName = "Modhera Sun Temple") => {
  const isModhera = siteName.includes("Modhera")
  const isAhmedabad = siteName.includes("Ahmedabad")
  const maxCap = isAhmedabad ? 2000 : (isModhera ? 500 : 350)
  const currentCount = isAhmedabad ? 840 : (isModhera ? 185 : 95)
  const occPct = Math.round((currentCount / maxCap) * 100)

  const hourly_data = [
    { hour: "06:00", visitor_count: 15, visitors: 15, is_peak: false },
    { hour: "07:00", visitor_count: 32, visitors: 32, is_peak: false },
    { hour: "08:00", visitor_count: 65, visitors: 65, is_peak: false },
    { hour: "09:00", visitor_count: 110, visitors: 110, is_peak: false },
    { hour: "10:00", visitor_count: 185, visitors: 185, is_peak: true },
    { hour: "11:00", visitor_count: 240, visitors: 240, is_peak: true },
    { hour: "12:00", visitor_count: 215, visitors: 215, is_peak: false },
    { hour: "13:00", visitor_count: 190, visitors: 190, is_peak: false },
    { hour: "14:00", visitor_count: 230, visitors: 230, is_peak: true },
    { hour: "15:00", visitor_count: 285, visitors: 285, is_peak: true },
    { hour: "16:00", visitor_count: 310, visitors: 310, is_peak: true },
    { hour: "17:00", visitor_count: 220, visitors: 220, is_peak: false },
    { hour: "18:00", visitor_count: 95, visitors: 95, is_peak: false },
    { hour: "19:00", visitor_count: 35, visitors: 35, is_peak: false }
  ]

  const weekly_trend = [
    { day: "Mon", visitors: 680 },
    { day: "Tue", visitors: 620 },
    { day: "Wed", visitors: 740 },
    { day: "Thu", visitors: 790 },
    { day: "Fri", visitors: 910 },
    { day: "Sat", visitors: 1350 },
    { day: "Sun", visitors: 1480 }
  ]

  const zone_data = isModhera ? [
    { id: "zone_a", name: "Garbhagriha (Sanctum)", visitor_count: 35, capacity: 50, occupancy_pct: 70, crowd_level: "Orange", crowd_label: "High", density: "High" },
    { id: "zone_b", name: "Sabha Mandap (Assembly Hall)", visitor_count: 68, capacity: 150, occupancy_pct: 45, crowd_level: "Yellow", crowd_label: "Moderate", density: "Medium" },
    { id: "zone_c", name: "Surya Kund (Stepped Tank)", visitor_count: 82, capacity: 200, occupancy_pct: 41, crowd_level: "Yellow", crowd_label: "Moderate", density: "Medium" },
    { id: "zone_d", name: "Museum & Exhibits", visitor_count: 24, capacity: 100, occupancy_pct: 24, crowd_level: "Green", crowd_label: "Low", density: "Low" },
    { id: "zone_e", name: "Entry Gate & Courtyard", visitor_count: 40, capacity: 200, occupancy_pct: 20, crowd_level: "Green", crowd_label: "Low", density: "Low" }
  ] : [
    { id: "zone_a", name: "Bhadra Fort Area", visitor_count: 320, capacity: 600, occupancy_pct: 53, crowd_level: "Yellow", crowd_label: "Moderate", density: "Medium" },
    { id: "zone_b", name: "Teen Darwaza Archway", visitor_count: 210, capacity: 400, occupancy_pct: 52, crowd_level: "Yellow", crowd_label: "Moderate", density: "Medium" },
    { id: "zone_c", name: "Sidi Saiyyed Mosque", visitor_count: 65, capacity: 100, occupancy_pct: 65, crowd_level: "Orange", crowd_label: "High", density: "High" },
    { id: "zone_d", name: "Heritage Pol Walk", visitor_count: 145, capacity: 500, occupancy_pct: 29, crowd_level: "Green", crowd_label: "Low", density: "Low" },
    { id: "zone_e", name: "Information Plaza", visitor_count: 100, capacity: 400, occupancy_pct: 25, crowd_level: "Green", crowd_label: "Low", density: "Low" }
  ]

  const recommendations = [
    `Direct groups entering ${siteName} through peripheral walkways to relieve core congestion.`,
    "Stagger tour party admissions into the sanctum sanctorum in 15-minute intervals.",
    "Real-time digital sign boards updated with current 5-minute wait time estimates."
  ]

  return {
    site_name: siteName,
    current_visitor_count: currentCount,
    max_capacity: maxCap,
    occupancy_percentage: occPct,
    crowd_level: occPct > 75 ? "Red" : occPct > 55 ? "Orange" : occPct > 35 ? "Yellow" : "Green",
    crowd_label: occPct > 75 ? "Critical" : occPct > 55 ? "High" : occPct > 35 ? "Moderate" : "Low",
    is_peak_hour: occPct > 50,
    estimated_wait_time_minutes: Math.max(3, Math.round(occPct / 8)),
    hourly_data,
    weekly_trend,
    zone_data,
    recommendations,
    granite_insights: `Visitor distribution across ${siteName} is currently within manageable thresholds. The Visitor Flow Management Agent recommends gentle pathway routing to prevent crowd concentration at main photography points.`
  }
}

export const getMockStructuralAnalysis = (siteName = "Modhera Sun Temple") => ({
  site_name: siteName,
  risk_score: 77.3,
  risk_level: "High Risk",
  priority: "High",
  confidence_score: 0.89,
  detected_issues: [
    {
      type: "Surface Crack Pattern",
      severity: "High",
      location: "Eastern façade — carved relief row 3",
      confidence: 0.91,
      description: "Progressive hairline stress fracturing (1.8mm width) consistent with diurnal thermal cycling and micro-vibration."
    },
    {
      type: "Water / Moisture Infiltration",
      severity: "Moderate",
      location: "Surya Kund stepped reservoir walls",
      confidence: 0.84,
      description: "Sub-surface efflorescence and localized salt crusting indicating capillary water ingress."
    },
    {
      type: "Superficial Stone Weathering",
      severity: "Low",
      location: "Sabha Mandap upper frieze",
      confidence: 0.78,
      description: "Minor granular surface erosion due to windborne particulate matter."
    }
  ],
  granite_reasoning: "IBM Granite 3.0 Structural Diagnostic: The detected shear fracture on the eastern sandstone facade indicates thermal expansion stress exacerbated by differential foundation settlement. Non-destructive ultrasonic pulse testing and breathable lime grouting are advised prior to monsoon onset.",
  recommendations: [
    "Install high-precision fiber-optic crack displacement sensors on Panel 3.",
    "Perform non-invasive Ultrasonic Pulse Velocity (UPV) assessment within 14 days.",
    "Implement temporary crowd buffer (5m cordon) during peak afternoon hours.",
    "Apply breathable nano-lime grout consolidation per ASI technical guidelines."
  ],
  urgency: "Immediate Attention Required (within 14 days)"
})

export const getMockEncroachmentAnalysis = (siteName = "Modhera Sun Temple") => ({
  site_name: siteName,
  encroachment_detected: true,
  encroachment_type: "Temporary Construction Activity",
  severity: "High",
  confidence: 0.76,
  confidence_score: 0.76,
  detected_changes: [
    {
      location: "Northern boundary zone — 85m from protected monument perimeter",
      type: "Material stockpile and unauthorized scaffolding structures",
      confidence: 0.76
    },
    {
      location: "Eastern buffer boundary — 120m perimeter",
      type: "Recent ground disturbance and fence alterations",
      confidence: 0.64
    }
  ],
  granite_reasoning: "IBM Granite Boundary Intelligence: Multi-temporal satellite imagery comparison reveals a 38 sq.m spatial anomaly located 85m North of the prohibited boundary zone. The signature matches temporary construction scaffolding lacking registered Archaeological Survey of India (ASI) clearance.",
  action_plan: [
    "Deploy ASI Gujarat Circle Heritage Protection Inspector for physical on-site verification within 48 hours.",
    "Issue statutory advisory notice under Section 20A of the AMASR Act 1958.",
    "Capture high-resolution geo-referenced drone orthomosaics to establish legal baseline coordinates.",
    "Submit automated notification report to Mehsana District Collector & Town Planning Department."
  ],
  legal_disclaimer: "AI observations indicate potential unauthorized activity requiring statutory ground verification before enforcement."
})

export const getMockStory = (site = "Modhera Sun Temple", language = "English", ageGroup = "Adult (30-60)", durationMinutes = 60, interests = ["Architecture", "History"], experienceType = "Educational") => {
  const dur = durationMinutes || 60

  // ── SITE DATABASE ─────────────────────────────────────────────
  const siteDB = {
    "Modhera Sun Temple": {
      English: {
        detailed_story: `The year is 1026 CE. Under the patronage of King Bhimdev I of the mighty Solanki dynasty, hundreds of master artisans gathered on the banks of the Pushpavati River in the arid heartland of North Gujarat. Their mission: to construct a temple so precisely aligned with the cosmos that the sun itself would become its presiding deity — not as a symbol, but as a living, luminous presence that would enter the sanctum twice a year to bless the faithful.

What they created over the next several decades is nothing short of an astronomical miracle carved in golden sandstone.

THE SURYA KUND — A COSMIC MIRROR IN STONE
Before you even approach the temple proper, you encounter the breathtaking Surya Kund — a massive rectangular stepped reservoir descending in terraced layers to the water's edge. This is no ordinary tank. It is an inverted stepped pyramid containing exactly 108 miniature shrines dedicated to various Hindu deities, arranged in precise geometric patterns that mirror Vedic cosmological principles.

The number 108 is sacred in Hindu philosophy — it represents the wholeness of existence, the 12 zodiac houses multiplied by the 9 planetary bodies. Each shrine is uniquely carved, no two identical, depicting Ganesha, Shiva, Vishnu, Parvati, and lesser-known village deities with equal reverence. The engineering genius lies beneath the beauty: the Kund doubles as a sophisticated rainwater harvesting system and thermal regulator. During the brutal summer months when temperatures soar above 45°C, the deep water reservoir creates a natural cooling effect that moderates the microclimate of the entire temple complex.

THE SABHA MANDAP — WHERE TIME IS CARVED IN STONE
Moving deeper into the complex, you enter the Sabha Mandap — the grand assembly hall supported by exactly 52 intricately carved pillars. This number is not coincidental: it represents the 52 weeks of the solar year, transforming the hall into a three-dimensional solar calendar.

Each pillar is a masterpiece of narrative sculpture. The lower registers depict scenes from daily life — farmers tilling fields, women drawing water, merchants trading goods — grounding the divine in the earthly. The middle bands burst with celestial dancers (apsaras), musicians, and mythological scenes from the great epics. The upper capitals bloom into elaborate floral and geometric patterns that seem to dissolve the boundary between stone and sky.

The most remarkable feature is the ceiling of the Sabha Mandap, where concentric rings of carved figures radiate outward in a pattern that precisely mirrors the apparent motion of the sun across the ecliptic. Archaeo-astronomers have confirmed that specific carvings correspond to solstice and equinox positions visible from the temple's latitude.

THE GARBHAGRIHA — THE SOLAR SANCTUM
The journey culminates at the Garbhagriha (sanctum sanctorum), oriented with breathtaking precision along an east-west axis calculated to within fractions of a degree. Twice each year, on the vernal and autumnal equinoxes (approximately March 20 and September 22), the first rays of the rising sun travel through the carefully proportioned entrance corridor, pass between the pillars of the Sabha Mandap, and strike directly upon the pedestal where the golden idol of Surya once stood.

This solar alignment was engineered over a millennium ago — centuries before the European Renaissance — using mathematical principles documented in the Surya Siddhanta, an ancient Indian astronomical text. The precision rivals that of Stonehenge, Newgrange, and the Egyptian temples of Abu Simbel, yet the sculptural richness of Modhera far surpasses these Western counterparts.

THE TORANA — GATEWAY TO THE COSMOS
Between the Sabha Mandap and the Garbhagriha stands the magnificent Torana (ceremonial archway), perhaps the most photographed element of the temple. Its carved faces depict the twelve Adityas — the twelve solar deities representing the sun's monthly journey through the zodiac — alongside all ten avatars of Vishnu in exquisite narrative relief panels.

THE INTERLOCKING MIRACLE
Perhaps most astonishing is that this entire structure — spanning thousands of tonnes of carved sandstone — was assembled without a single drop of mortar, cement, or adhesive. Every stone is held in place purely by gravitational force and precision geometric interlocking joints. This dry-stone construction technique, perfected by the Solanki-era Sompura guild of master architects, has allowed the temple to withstand over a thousand years of earthquakes, invasions, and the relentless elements of the Gujarat plains.

LIVING HERITAGE
Today, the temple no longer functions as an active place of worship — it was desecrated during Alauddin Khilji's invasion of Gujarat in 1299 CE, and the original Surya idol was lost. Yet the temple's spirit endures. Each January, the Gujarat Tourism Department hosts the Uttarardh Mahotsav (the Heritage Dance Festival), where India's finest classical dancers perform against the backdrop of the illuminated Surya Kund, bringing the ancient stones alive with rhythm and devotion once more.`,

        short_story: `Modhera Sun Temple, commissioned in 1026 CE by Solanki King Bhimdev I on the banks of the Pushpavati River, is a masterpiece of medieval Indian astronomy and architecture. The temple's east-west axis is precisely engineered so that on the equinoxes, the rising sun's first rays illuminate the sanctum's Surya pedestal — a feat of astronomical precision achieved over a millennium ago. The Surya Kund's 108 uniquely carved shrines form an inverted stepped pyramid doubling as a rainwater harvesting system. The Sabha Mandap's 52 pillars represent the solar year's weeks, with ceiling carvings mapping the ecliptic. Built entirely without mortar using interlocking stone joints by the Sompura architect guild, this monument has withstood over 1,000 years of earthquakes and invasions.`,

        interesting_facts: [
          "The temple's east-west axis is calculated to within fractions of a degree, enabling the equinoctial solar alignment — a precision that rivals Stonehenge and Egypt's Abu Simbel.",
          "Surya Kund's 108 miniature shrines represent the sacred number 108 (12 zodiac houses × 9 planetary bodies), with no two shrines carved identically.",
          "The Sabha Mandap's 52 pillars represent the 52 weeks of the solar year, with ceiling carvings that map the sun's apparent path across the ecliptic.",
          "The entire multi-thousand-tonne structure was assembled without mortar, cement, or adhesive — held purely by gravitational force and geometric interlocking joints.",
          "The Kund doubles as a sophisticated rainwater harvesting system and thermal regulator, cooling the temple complex during Gujarat's 45°C+ summers.",
          "The Torana gateway depicts all twelve Adityas (solar deities for each month of the zodiac) alongside the ten avatars of Vishnu.",
          "The temple was built using mathematical principles from the Surya Siddhanta, an ancient Indian astronomical treatise.",
          "The Sompura guild of master architects, who designed Modhera, continued building temples in Gujarat for over 800 years."
        ],
        did_you_know: [
          "The step tank water was historically scented with medicinal herbs and camphor, serving both ritual purification and Ayurvedic wellness purposes for pilgrims who bathed before entering the temple.",
          "Modhera's architectural precision predates European Gothic cathedrals by over two centuries, yet achieves comparable structural complexity using entirely different engineering principles.",
          "The temple's desecration by Alauddin Khilji's forces in 1299 CE led to the loss of the original golden Surya idol, but the architectural shell survived intact — testament to its extraordinary structural engineering.",
          "In 2014, the Government of Gujarat installed solar panels around the temple complex, making Modhera India's first solar-powered village — a fitting tribute to the Sun God."
        ],
        visitor_tips: [
          "Visit during the equinoxes (March 20 or September 22) to witness the spectacular solar alignment when the rising sun illuminates the sanctum pedestal.",
          "Early morning visits (7-9 AM) offer the best golden-hour lighting for photography and significantly smaller crowds than midday.",
          "Wear comfortable, sturdy shoes — the Surya Kund's steep steps are uneven and can be slippery, especially after rain.",
          "Carry at least 1 liter of water and sun protection (hat, sunscreen); the site has very limited shade, especially midday.",
          "The annual Uttarardh Mahotsav (Dance Festival) in January features classical performances against the illuminated Kund — a must-see cultural experience.",
          "Hire a local ASI-certified guide at the entrance for ₹200-500 to unlock the deeper astronomical and mythological symbolism carved into the pillars.",
          "The best vantage point for photographing the entire complex is from the southwestern corner of the Surya Kund's upper terrace.",
          "Visit the nearby Modhera village to see the solar-powered community — India's first fully solar village, a modern echo of the temple's ancient solar worship."
        ],
        architecture_highlights: [
          "Surya Kund: Inverted stepped pyramid with 108 uniquely carved shrines — each depicting a different deity — functioning as both a sacred space and an engineered rainwater harvesting and thermal regulation system.",
          "Sabha Mandap (Assembly Hall): 52 ornately carved pillars (one per week of the solar year) supporting a ceiling with concentric rings mapping the solar ecliptic.",
          "Garbhagriha (Sanctum): East-facing sanctum calculated to sub-degree precision for equinoctial solar illumination — the sun's rays travel through the corridor to strike the Surya pedestal.",
          "Torana Archway: Depicts the twelve Adityas (monthly solar deities) and Vishnu's ten avatars in narrative relief panels of extraordinary detail.",
          "Interlocking Dry-Stone Construction: Zero mortar technique using gravitational precision and geometric joinery — the Sompura guild's signature method that has survived 1,000+ years of seismic activity.",
          "Kirtimukha Cornices: Lion-face gargoyle motifs along the exterior serve as both decorative elements and functional rainwater drainage channels.",
          "Exterior Bas-Reliefs: Over 300 individual carved panels on the exterior walls depict scenes from the Ramayana, Mahabharata, and Krishna Leela in continuous narrative bands."
        ],
        follow_up_questions: [
          "How does Modhera's solar alignment precision compare to Konark Sun Temple, Stonehenge, and Egypt's Abu Simbel in terms of engineering accuracy?",
          "What role did the Solanki dynasty play in the golden age of art, architecture, and scholarship in medieval Gujarat?",
          "How was the Surya Kund's 108-shrine design connected to Vedic mathematics, the concept of the 'cosmic whole,' and Jyotish (Hindu astrology)?",
          "What specific conservation challenges does the temple face today — sandstone erosion, seismic risk, tourist wear — and what interventions are being implemented by ASI?",
          "How did the temple function as a community center, astronomical observatory, and educational institution beyond its religious purpose?",
          "What was the impact of Alauddin Khilji's 1299 CE invasion on Gujarat's temple heritage, and how did communities respond?",
          "How does the Sompura guild's dry-stone interlocking technique compare to Roman arch construction and Japanese wooden joinery?"
        ]
      },
      Gujarati: {
        detailed_story: `ઈ.સ. ૧૦૨૬ — સોલંકી વંશના પરાક્રમી રાજા ભીમદેવ પહેલાના શાસનકાળ. ઉત્તર ગુજરાતના શુષ્ક મેદાનોમાં, પુષ્પાવતી નદીના કિનારે, સેંકડો કુશળ શિલ્પકારો એક અસાધારણ સ્વપ્ન સાકાર કરવા એકઠા થયા — એક એવું મંદિર જ્યાં સૂર્યદેવ સ્વયં ઉપસ્થિત થાય, વર્ષમાં બે વખત, તેમના પ્રથમ કિરણો ગર્ભગૃહમાં પ્રવેશ કરે.

સૂર્યકુંડ — બ્રહ્માંડનું પ્રતિબિંબ
મંદિર પરિસરમાં પ્રવેશતાં પહેલાં, તમે ભવ્ય સૂર્યકુંડનો સામનો કરો છો — ઊલટા પિરામિડ આકારનો વિશાળ સીડીદાર જળાશય. આ સામાન્ય કુંડ નથી. આમાં ચોક્કસ ૧૦૮ લઘુ મંદિરો છે — હિન્દુ દર્શનમાં ૧૦૮ પવિત્ર સંખ્યા છે (૧૨ રાશિ × ૯ ગ્રહ = ૧૦૮). દરેક મંદિર અનન્ય છે — ગણેશ, શિવ, વિષ્ણુ, પાર્વતી અને ગ્રામ દેવતાઓના શિલ્પો ધરાવે છે.

એન્જિનિયરિંગની દ્રષ્ટિએ, કુંડ એક અત્યાધુનિક વરસાદી પાણી સંગ્રહ પ્રણાલી છે. ઉનાળામાં ૪૫°C ઉપરના તાપમાનમાં, ઊંડું જળાશય કુદરતી ઠંડક પ્રદાન કરે છે જે સમગ્ર મંદિર પરિસરના સૂક્ષ્મ વાતાવરણને નિયંત્રિત કરે છે.

સભા મંડપ — સમયનું શિલ્પ
ભવ્ય સભા મંડપ ચોક્કસ ૫૨ કોતરણીવાળા સ્તંભો પર ટકેલો છે — સૌર વર્ષના ૫૨ અઠવાડિયાનું પ્રતિનિધિત્વ. દરેક સ્તંભ એક કથા કહે છે: નીચેના ભાગમાં દૈનિક જીવનના દ્રશ્યો — ખેડૂતો, વેપારીઓ, પાણી ભરતી સ્ત્રીઓ. મધ્ય ભાગમાં અપ્સરાઓ, સંગીતકારો, અને મહાભારત-રામાયણના દ્રશ્યો. ઉપરના ભાગમાં ભૌમિતિક અને પુષ્પ પ્રતિરૂપો જે આકાશ સાથે ભળી જાય છે.

છતની કોતરણી સૌથી અદ્ભુત છે — કેન્દ્રબિંદુમાંથી ફેલાતા સમકેન્દ્રી વર્તુળો સૂર્યની ક્રાંતિવૃત્ત (ecliptic) પરની ગતિનું ચોક્કસ મેપિંગ છે.

ગર્ભગૃહ — સૌર સંરેખણ
યાત્રાનું શિખર ગર્ભગૃહ છે — પૂર્વ-પશ્ચિમ અક્ષ પર ડિગ્રીના અંશ સુધી ચોક્કસ. વર્ષમાં બે વખત વિષુવવૃત્ત (લગભગ ૨૦ માર્ચ અને ૨૨ સપ્ટેમ્બર) ના દિવસે, ઉગતા સૂર્યના પ્રથમ કિરણો પ્રવેશ માર્ગમાંથી પસાર થઈ, સભા મંડપના સ્તંભો વચ્ચેથી પ્રવાસ કરી, સીધા સૂર્ય પ્રતિમાના પીઠ પર પડે છે.

આ સૌર સંરેખણ સૂર્ય સિદ્ધાંત — પ્રાચીન ભારતીય ખગોળશાસ્ત્ર ગ્રંથ — માં દસ્તાવેજીકૃત ગણિતીય સિદ્ધાંતોનો ઉપયોગ કરીને એન્જિનિયર કરવામાં આવ્યું હતું.

તોરણ દ્વાર
સભા મંડપ અને ગર્ભગૃહ વચ્ચે ભવ્ય તોરણ ઊભું છે — ૧૨ આદિત્યો (રાશિચક્રના ૧૨ માસિક સૂર્ય દેવતાઓ) અને વિષ્ણુના ૧૦ અવતારોના વિગતવાર શિલ્પો ધરાવે છે.

ઇન્ટરલોકિંગ ચમત્કાર
સૌથી આશ્ચર્યજનક બાબત: આ હજારો ટનના સમગ્ર માળખું એક ટીપું ચૂનો, સિમેન્ટ, કે ગારો વાપર્યા વિના બાંધવામાં આવ્યું છે. દરેક પથ્થર ફક્ત ગુરુત્વાકર્ષણ બળ અને ભૌમિતિક ઇન્ટરલોકિંગ સાંધાઓ દ્વારા ટકેલો છે. સોમપુરા શિલ્પકાર ગિલ્ડની આ ટેકનિક ૧,૦૦૦+ વર્ષના ભૂકંપો અને આક્રમણો સામે ટકી રહી છે.`,

        short_story: `મોઢેરા સૂર્ય મંદિર, ઈ.સ. ૧૦૨૬માં સોલંકી રાજા ભીમદેવ I દ્વારા પુષ્પાવતી નદી કિનારે બાંધવામાં આવ્યું, મધ્યયુગીન ભારતીય ખગોળશાસ્ત્ર અને સ્થાપત્યની ઉત્કૃષ્ટ કૃતિ છે. વિષુવવૃત્ત પર ઉગતા સૂર્યના પ્રથમ કિરણો ગર્ભગૃહના પીઠ પર પડે છે. ૧૦૮ અનન્ય શિલ્પવાળા લઘુ મંદિરો ધરાવતો સૂર્યકુંડ, ૫૨ સ્તંભોવાળો સભા મંડપ, અને ચૂના વિના ઇન્ટરલોકિંગ પથ્થરોથી નિર્મિત — આ મંદિર ૧,૦૦૦ વર્ષથી વધુ સમયથી ટકી રહ્યું છે.`,
        interesting_facts: [
          "મંદિરની પૂર્વ-પશ્ચિમ અક્ષ ડિગ્રીના અંશ સુધી ચોક્કસ છે — સ્ટોનહેન્જ અને ઇજિપ્તના અબુ સિમ્બલ જેવી ચોકસાઈ.",
          "સૂર્યકુંડના ૧૦૮ મંદિરો: ૧૨ રાશિ × ૯ ગ્રહ = ૧૦૮ (પવિત્ર સંખ્યા). કોઈ બે મંદિર સરખા નથી.",
          "સભા મંડપના ૫૨ સ્તંભો = સૌર વર્ષના ૫૨ અઠવાડિયા. છતની કોતરણી ક્રાંતિવૃત્તનું મેપિંગ છે.",
          "હજારો ટનનું સમગ્ર માળખું ચૂનો, સિમેન્ટ, કે ગારો વાપર્યા વિના — ફક્ત ગુરુત્વાકર્ષણ અને ભૌમિતિક ઇન્ટરલોકિંગથી.",
          "કુંડ વરસાદી પાણી સંગ્રહ અને તાપમાન નિયંત્રક તરીકે પણ કામ કરે છે — ૪૫°C+ ઉનાળામાં કુદરતી ઠંડક.",
          "તોરણ દ્વાર પર ૧૨ આદિત્યો (માસિક સૂર્ય દેવતાઓ) અને વિષ્ણુના ૧૦ અવતારોના શિલ્પો છે.",
          "સૂર્ય સિદ્ધાંત ગ્રંથના ગણિતીય સિદ્ધાંતોનો ઉપયોગ કરીને સૌર સંરેખણ એન્જિનિયર કરવામાં આવ્યું.",
          "૨૦૧૪માં ગુજરાત સરકારે મોઢેરા ગામને ભારતનું પ્રથમ સંપૂર્ણ સૌર ઊર્જા ગામ બનાવ્યું — સૂર્યદેવને આધુનિક શ્રદ્ધાંજલિ."
        ],
        did_you_know: [
          "કુંડનું પાણી ઐતિહાસિક રીતે ઔષધીય જડીબુટ્ટીઓ અને કપૂરથી સુગંધિત કરવામાં આવતું — ધાર્મિક શુદ્ધિકરણ અને આયુર્વેદિક સ્વાસ્થ્ય બંને માટે.",
          "મોઢેરાની સ્થાપત્ય ચોકસાઈ યુરોપિયન ગોથિક કેથેડ્રલ કરતાં બે સદી પહેલાંની છે, છતાં સમકક્ષ માળખાકીય જટિલતા ધરાવે છે.",
          "ઈ.સ. ૧૨૯૯માં અલાઉદ્દીન ખિલજીના આક્રમણ દરમિયાન મૂળ સુવર્ણ સૂર્ય મૂર્તિ ખોવાઈ ગઈ, પણ સ્થાપત્ય શેલ અકબંધ ટકી રહ્યું.",
          "દર જાન્યુઆરીમાં ઉત્તરાર્ધ મહોત્સવ દરમિયાન ભારતના શ્રેષ્ઠ શાસ્ત્રીય નૃત્યકારો પ્રકાશિત સૂર્યકુંડ સામે પ્રદર્શન કરે છે."
        ],
        visitor_tips: [
          "વિષુવવૃત્ત (૨૦ માર્ચ અથવા ૨૨ સપ્ટેમ્બર) ના દિવસે ગર્ભગૃહમાં ભવ્ય સૌર સંરેખણ જોવા મુલાકાત લો.",
          "સવારે ૭-૯ વાગ્યે ફોટોગ્રાફી માટે શ્રેષ્ઠ ગોલ્ડન-અવર પ્રકાશ અને ઓછી ભીડ.",
          "આરામદાયક, મજબૂત પગરખાં પહેરો — સૂર્યકુંડના ઊંચા પગથિયાં અસમાન છે.",
          "ઓછામાં ઓછું ૧ લિટર પાણી અને સન પ્રોટેક્શન (ટોપી, સનસ્ક્રીન) લઈ જાઓ.",
          "જાન્યુઆરીમાં ઉત્તરાર્ધ મહોત્સવ (નૃત્ય ઉત્સવ) — પ્રકાશિત કુંડ સામે શાસ્ત્રીય નૃત્ય.",
          "પ્રવેશદ્વાર પર ASI-પ્રમાણિત ગાઈડ ₹૨૦૦-૫૦૦માં ઉપલબ્ધ છે.",
          "નજીકના મોઢેરા ગામની મુલાકાત લો — ભારતનું પ્રથમ સૌર ઊર્જા ગામ."
        ],
        architecture_highlights: [
          "સૂર્યકુંડ: ૧૦૮ અનન્ય લઘુ મંદિરો ધરાવતો ઊલટો પિરામિડ — પવિત્ર ભૂમિતિ, વરસાદી પાણી સંગ્રહ, અને તાપમાન નિયંત્રણ.",
          "સભા મંડપ: ૫૨ અલંકૃત સ્તંભો (દર અઠવાડિયે એક) — છત પર ક્રાંતિવૃત્ત મેપિંગ.",
          "ગર્ભગૃહ: પૂર્વ-દિશા, ડિગ્રીના અંશ સુધી ચોક્કસ — વિષુવવૃત્ત સૌર કિરણો પીઠ પર પડે.",
          "તોરણ દ્વાર: ૧૨ આદિત્યો અને વિષ્ણુના ૧૦ અવતારો — અસાધારણ વિગતવાર રિલીફ શિલ્પ.",
          "ડ્રાય-સ્ટોન ઇન્ટરલોકિંગ: શૂન્ય ચૂનો/સિમેન્ટ — ગુરુત્વાકર્ષણ ચોકસાઈ અને ભૌમિતિક જોડાણ.",
          "બાહ્ય ભીંત-શિલ્પો: ૩૦૦+ વ્યક્તિગત પેનલ — રામાયણ, મહાભારત, કૃષ્ણ લીલાના સતત કથા દ્રશ્યો."
        ],
        follow_up_questions: [
          "મોઢેરાનું સૌર સંરેખણ કોણાર્ક, સ્ટોનહેન્જ, અને ઇજિપ્તના અબુ સિમ્બલ સાથે એન્જિનિયરિંગ ચોકસાઈમાં કેવી રીતે સરખાવાય?",
          "મધ્યયુગીન ગુજરાતના સુવર્ણ યુગમાં કળા, સ્થાપત્ય, અને વિદ્વતામાં સોલંકી વંશની ભૂમિકા શું હતી?",
          "સૂર્યકુંડની ૧૦૮-મંદિર રચના વૈદિક ગણિત અને જ્યોતિષ (હિન્દુ ખગોળશાસ્ત્ર) સાથે કેવી રીતે જોડાયેલી છે?",
          "આજે મંદિરને કયા સંરક્ષણ પડકારો — રેતીના પથ્થરનું ધોવાણ, ભૂકંપનું જોખમ, પ્રવાસી ઘસારો — છે?",
          "સોમપુરા ગિલ્ડની ડ્રાય-સ્ટોન ઇન્ટરલોકિંગ ટેકનિક રોમન કમાન અને જાપાની લાકડાના જોડાણ સાથે કેવી રીતે સરખાવાય?"
        ]
      },
      Hindi: {
        detailed_story: `वर्ष १०२६ ई. — शक्तिशाली सोलंकी वंश के राजा भीमदेव प्रथम का शासनकाल। उत्तर गुजरात के शुष्क मैदानों में, पुष्पावती नदी के तट पर, सैकड़ों कुशल शिल्पकारों ने एक असाधारण स्वप्न को साकार करने का बीड़ा उठाया — एक ऐसा मंदिर जहाँ सूर्यदेव स्वयं उपस्थित हों, वर्ष में दो बार, अपनी प्रथम किरणों से गर्भगृह को आलोकित करें।

सूर्य कुंड — ब्रह्मांड का प्रतिबिंब
मंदिर परिसर में प्रवेश करते ही आपका सामना भव्य सूर्य कुंड से होता है — उल्टे पिरामिड आकार का विशाल सीढ़ीदार जलाशय। यह कोई साधारण कुंड नहीं है। इसमें ठीक-ठीक १०८ लघु मंदिर हैं — हिन्दू दर्शन में १०८ पवित्र संख्या है (१२ राशि × ९ ग्रह = १०८)। प्रत्येक मंदिर अद्वितीय है — गणेश, शिव, विष्णु, पार्वती और ग्राम देवताओं की मूर्तियाँ।

इंजीनियरिंग की दृष्टि से, कुंड एक अत्याधुनिक वर्षा जल संग्रह प्रणाली है। गर्मियों में ४५°C से ऊपर के तापमान में, गहरा जलाशय प्राकृतिक शीतलता प्रदान करता है।

सभा मंडप — समय का शिल्प
भव्य सभा मंडप ठीक ५२ अलंकृत स्तंभों पर टिका है — सौर वर्ष के ५२ सप्ताहों का प्रतिनिधित्व। प्रत्येक स्तंभ एक कथा कहता है: निचले भाग में दैनिक जीवन — किसान, व्यापारी, जल भरती स्त्रियाँ। मध्य में अप्सराएँ, संगीतकार, महाभारत-रामायण के दृश्य। ऊपरी भाग में ज्यामितीय और पुष्प प्रतिरूप।

छत की नक्काशी सर्वाधिक अद्भुत है — केंद्र से फैलते संकेंद्रित वृत्त सूर्य की क्रांतिवृत्त (ecliptic) पर गति का सटीक मानचित्रण करते हैं।

गर्भगृह — सौर संरेखण
यात्रा का शिखर गर्भगृह है — पूर्व-पश्चिम अक्ष पर डिग्री के अंश तक सटीक। वर्ष में दो बार विषुव (लगभग २० मार्च और २२ सितंबर) के दिन, उगते सूर्य की पहली किरणें प्रवेश मार्ग से गुजरकर, सभा मंडप के स्तंभों के बीच से यात्रा कर, सीधे सूर्य प्रतिमा की पीठ पर पड़ती हैं।

यह सौर संरेखण सूर्य सिद्धांत — प्राचीन भारतीय खगोल ग्रंथ — में प्रलेखित गणितीय सिद्धांतों का उपयोग करके इंजीनियर किया गया था।

तोरण द्वार
सभा मंडप और गर्भगृह के मध्य भव्य तोरण विद्यमान है — १२ आदित्यों (राशिचक्र के १२ मासिक सूर्य देवताओं) और विष्णु के १० अवतारों की विस्तृत मूर्तियाँ।

इंटरलॉकिंग चमत्कार
सर्वाधिक आश्चर्यजनक: यह हजारों टन का समस्त ढाँचा बिना एक बूँद चूने, सीमेंट या गारे के निर्मित है। प्रत्येक पत्थर केवल गुरुत्वाकर्षण बल और ज्यामितीय इंटरलॉकिंग जोड़ों द्वारा धारित है। सोमपुरा शिल्पकार गिल्ड की यह तकनीक १,००० से अधिक वर्षों के भूकंपों और आक्रमणों से अक्षत बची है।`,
        short_story: `मोढेरा सूर्य मंदिर, ई.स. १०२६ में सोलंकी राजा भीमदेव प्रथम द्वारा पुष्पावती नदी तट पर निर्मित, मध्यकालीन भारतीय खगोल और स्थापत्य की उत्कृष्ट कृति है। विषुव पर उगते सूर्य की किरणें गर्भगृह की पीठ को आलोकित करती हैं। १०८ अद्वितीय लघु मंदिरों वाला सूर्य कुंड, ५२ स्तंभों वाला सभा मंडप, और बिना चूने के इंटरलॉकिंग शिला निर्माण — यह मंदिर १,००० वर्षों से अडिग खड़ा है।`,
        interesting_facts: [
          "मंदिर की पूर्व-पश्चिम अक्ष डिग्री के अंश तक सटीक है — स्टोनहेंज और अबू सिम्बल जैसी यथार्थता।",
          "सूर्य कुंड के १०८ मंदिर: १२ राशि × ९ ग्रह = १०८ (पवित्र संख्या)। कोई भी दो मंदिर समान नहीं।",
          "सभा मंडप के ५२ स्तंभ = सौर वर्ष के ५२ सप्ताह। छत की नक्काशी क्रांतिवृत्त का मानचित्रण करती है।",
          "हजारों टन का ढाँचा बिना चूने, सीमेंट या गारे के — केवल गुरुत्वाकर्षण और ज्यामितीय इंटरलॉकिंग से।",
          "कुंड वर्षा जल संग्रह और तापमान नियंत्रक के रूप में भी कार्य करता है — ४५°C+ गर्मी में प्राकृतिक शीतलता।",
          "तोरण द्वार पर १२ आदित्य (मासिक सूर्य देवता) और विष्णु के १० अवतारों की मूर्तियाँ हैं।",
          "सूर्य सिद्धांत ग्रंथ के गणितीय सिद्धांतों से सौर संरेखण इंजीनियर किया गया।",
          "२०१४ में गुजरात सरकार ने मोढेरा गाँव को भारत का पहला पूर्ण सौर ऊर्जा गाँव बनाया।"
        ],
        did_you_know: [
          "कुंड का जल ऐतिहासिक रूप से औषधीय जड़ी-बूटियों और कपूर से सुगंधित किया जाता था — धार्मिक शुद्धिकरण और आयुर्वेदिक कल्याण दोनों के लिए।",
          "मोढेरा की स्थापत्य सटीकता यूरोपीय गोथिक कैथेड्रल से दो शताब्दी पुरानी है, फिर भी समकक्ष संरचनात्मक जटिलता रखती है।",
          "ई.स. १२९९ में अलाउद्दीन खिलजी के आक्रमण में मूल स्वर्ण सूर्य प्रतिमा खो गई, परंतु स्थापत्य कवच अक्षत बचा।",
          "प्रतिवर्ष जनवरी में उत्तरार्ध महोत्सव में भारत के श्रेष्ठ शास्त्रीय नर्तक प्रकाशित सूर्य कुंड के समक्ष प्रदर्शन करते हैं।"
        ],
        visitor_tips: [
          "विषुव (२० मार्च या २२ सितंबर) के दिन गर्भगृह में भव्य सौर संरेखण देखने जाएँ।",
          "सुबह ७-९ बजे फोटोग्राफी के लिए सर्वोत्तम गोल्डन-ऑवर प्रकाश और कम भीड़।",
          "आरामदायक, मजबूत जूते पहनें — सूर्य कुंड की सीढ़ियाँ ऊँची और असमान हैं।",
          "कम से कम १ लीटर पानी और सन प्रोटेक्शन (टोपी, सनस्क्रीन) साथ रखें।",
          "जनवरी में उत्तरार्ध महोत्सव (नृत्य उत्सव) — प्रकाशित कुंड के सामने शास्त्रीय नृत्य।",
          "प्रवेश द्वार पर ASI-प्रमाणित गाइड ₹२००-५०० में उपलब्ध हैं।",
          "निकटवर्ती मोढेरा गाँव देखें — भारत का प्रथम सौर ऊर्जा गाँव।"
        ],
        architecture_highlights: [
          "सूर्य कुंड: १०८ अद्वितीय लघु मंदिरों वाला उल्टा पिरामिड — पवित्र ज्यामिति, वर्षा जल संग्रह, तापमान नियंत्रण।",
          "सभा मंडप: ५२ अलंकृत स्तंभ (प्रति सप्ताह एक) — छत पर क्रांतिवृत्त मानचित्रण।",
          "गर्भगृह: पूर्वाभिमुख, डिग्री के अंश तक सटीक — विषुव सौर किरणें पीठ पर पड़ती हैं।",
          "तोरण द्वार: १२ आदित्य और विष्णु के १० अवतार — विस्तृत रिलीफ शिल्प।",
          "ड्राय-स्टोन इंटरलॉकिंग: शून्य चूना/सीमेंट — गुरुत्वाकर्षण सटीकता और ज्यामितीय जोड़।",
          "बाह्य भित्ति-शिल्प: ३००+ व्यक्तिगत पैनल — रामायण, महाभारत, कृष्ण लीला के सतत कथा दृश्य।"
        ],
        follow_up_questions: [
          "मोढेरा का सौर संरेखण कोणार्क, स्टोनहेंज और अबू सिम्बल की इंजीनियरिंग सटीकता से कैसे तुलना करता है?",
          "मध्यकालीन गुजरात के स्वर्ण युग में कला, स्थापत्य और विद्वता में सोलंकी वंश की क्या भूमिका थी?",
          "सूर्य कुंड की १०८-मंदिर रचना वैदिक गणित और ज्योतिष (हिंदू खगोल) से कैसे जुड़ी है?",
          "आज मंदिर को कौन-से संरक्षण चुनौतियाँ — बलुआ पत्थर क्षरण, भूकंपीय जोखिम, पर्यटक घिसाव — हैं?",
          "सोमपुरा गिल्ड की ड्राय-स्टोन तकनीक रोमन मेहराब और जापानी लकड़ी जोड़ से कैसे तुलना करती है?"
        ]
      }
    },

    "Ahmedabad Walled City": {
      English: {
        detailed_story: `In the year 1411 CE, Sultan Ahmed Shah I gazed upon the eastern bank of the Sabarmati River and envisioned something unprecedented — a capital city that would become the jewel of the Gujarat Sultanate and, six centuries later, India's first UNESCO World Heritage City.

THE FOUNDING LEGEND
According to local lore, the Sultan was hunting near the Sabarmati when he observed a remarkable sight: a hare chasing a hunting dog. Impressed by the courage displayed at that spot, he declared it the site of his new capital, naming it "Ahmedabad" after himself. Whether legend or history, the city that rose from this decision would become one of medieval India's greatest urban achievements.

THE WALLS AND GATES — A CITY'S ARMOR
Ahmed Shah constructed massive fortification walls stretching over 10 kilometers, punctuated by 12 ornamental gates (darwazas) that controlled access to the city. Each gate was a masterpiece of Indo-Islamic military architecture: thick enough to withstand cannon fire, yet adorned with intricate jali (lattice) work, calligraphic inscriptions, and carved balconies that transformed defensive structures into works of art.

Today, several gates survive as living monuments: the Teen Darwaza (Triple Gateway), Bhadra Fort Gate, and the Manek Burj (Ruby Tower). Each tells a story of the city's layered history — Sultanate foundations, Mughal additions, Maratha modifications, and British-era adaptations.

THE POLS — A LIVING SOCIAL EXPERIMENT
Behind the grand gates lies the true genius of Ahmedabad: the pol system. Pols are self-contained residential clusters — essentially neighborhood-scale micro-cities — organized around shared courtyards, connected by narrow winding lanes, and accessed through a single defensible gateway.

Each pol was (and many still are) occupied by a specific community — defined by caste, profession, or religious affiliation. The Mandvi ni Pol housed textile merchants; the Khamasa ni Pol sheltered perfume makers; the Doshiwada ni Pol was home to silk weavers. Despite this compartmentalization, the pols collectively created one of the most sophisticated models of multicultural urban coexistence in pre-modern India.

The architecture of the pols is extraordinary. Houses rise 3-4 stories, with projecting wooden balconies (orjhos) that create shaded walkways below. The upper floors feature exquisite wooden jali screens that allow ventilation while maintaining privacy — a natural air-conditioning system perfected over centuries. Shared courtyards (chowks) serve as community living rooms where festivals are celebrated, disputes are resolved, and children play.

THE MOSQUES AND SACRED SPACES
The Walled City contains some of India's finest examples of Indo-Islamic architecture, where Hindu temple-building traditions merge with Islamic geometric aesthetics:

• Jama Masjid (1424): Built by Ahmed Shah I, this mosque's 260 pillars were reportedly repurposed from demolished Hindu and Jain temples, creating an extraordinary fusion of carved floral Hindu capitals supporting Islamic arched galleries. The central courtyard can accommodate 25,000 worshippers.

• Sidi Saiyyed Mosque (1573): Famous worldwide for its breathtaking stone jali window depicting an intertwined tree of life — a masterwork so iconic that it became the symbol of the Indian Institute of Management Ahmedabad (IIM-A) and the city's unofficial logo.

• Rani no Hajiro: The tomb of Ahmed Shah's queens, featuring some of Gujarat's most refined pierced stone screens and delicate floral carvings.

THE STEPWELLS — SUBTERRANEAN CATHEDRALS
Beneath the bustling streets lie Ahmedabad's stepwells (vavs) — monumental subterranean structures that descend multiple stories below ground level to reach the water table. The Adalaj ni Vav (just outside the walls) is a stunning five-story structure with over 500 carved figures, while the Dada Harir ni Vav within the city walls blends Hindu and Islamic decorative traditions in a single descent.

TEXTILE HERITAGE
Ahmedabad was historically known as the "Manchester of the East" for its vast textile industry. The Walled City's Calico Museum of Textiles houses one of the world's finest collections of Indian fabrics, spanning 500 years of weaving, dyeing, embroidery, and printing traditions. The city's association with textiles continues today — from heritage workshops in the pols to the modern textile mills along the Sabarmati.

GANDHI'S FOOTPRINT
Mahatma Gandhi established his Sabarmati Ashram on the river's banks in 1917, making Ahmedabad the launching pad for India's independence movement. The Dandi March of 1930 — the iconic salt protest — began from these very banks, and the ashram's proximity to the Walled City imbues the old quarter with an additional layer of historical significance.

UNESCO RECOGNITION
In 2017, Ahmedabad's Walled City became India's first city to receive UNESCO World Heritage status, recognized for its outstanding universal value as a living example of multicultural, multi-religious urban coexistence. The UNESCO citation specifically highlighted the pol system, the Indo-Islamic architecture, and the city's continuous habitation over 600 years.`,

        short_story: `Ahmedabad's Walled City, founded in 1411 CE by Sultan Ahmed Shah I on the Sabarmati River's banks, became India's first UNESCO World Heritage City in 2017. Its 10+ km fortification walls with 12 ornamental gates enclose a remarkable urban ecosystem: the pol system of self-contained community neighborhoods; Indo-Islamic masterpieces like the 260-pillared Jama Masjid and Sidi Saiyyed Mosque's iconic tree-of-life jali; subterranean stepwell cathedrals; and a 600-year textile heritage. Gandhi's Sabarmati Ashram, the Dandi March's starting point, adds another layer to this living, breathing monument to multicultural coexistence.`,
        interesting_facts: [
          "India's first UNESCO World Heritage City (2017), recognized for its pol system, Indo-Islamic architecture, and 600+ years of continuous multicultural habitation.",
          "The founding legend tells of Sultan Ahmed Shah witnessing a hare chase a hunting dog — so impressed by the courage, he declared the spot his capital.",
          "Over 600 pols (self-contained community neighborhoods) survive within the walls, each historically organized by caste, profession, or religious affiliation.",
          "Jama Masjid's 260 pillars feature Hindu floral capitals supporting Islamic arched galleries — a physical fusion of two architectural traditions.",
          "The pol houses' wooden jali screens and orjho balconies create a natural air-conditioning system perfected over centuries, reducing indoor temperatures by 5-8°C.",
          "Sidi Saiyyed Mosque's stone tree-of-life jali window became the logo of IIM Ahmedabad and the city's unofficial symbol.",
          "Ahmedabad was known as the 'Manchester of the East' — its textile traditions span 500+ years of weaving, dyeing, and block printing.",
          "Mahatma Gandhi's Dandi March (1930 Salt Satyagraha) began from the Sabarmati Ashram, adjacent to the Walled City."
        ],
        did_you_know: [
          "The pol system was so effective at community self-governance that the British colonial administration largely left it intact, finding it more efficient than any municipal system they could impose.",
          "Some pol houses have underground tunnels connecting them to neighboring pols — escape routes built during periods of communal tension or political upheaval.",
          "The Walled City's narrow lanes (some barely 3 feet wide) were deliberately designed to maximize shade and create wind-tunnel effects that naturally cool the streets.",
          "Ahmedabad has more Art Deco buildings than any Indian city except Mumbai, many built by textile mill owners in the 1930s-40s along the Ellis Bridge corridor."
        ],
        visitor_tips: [
          "Start your walk at Bhadra Fort / Teen Darwaza at dawn (6-7 AM) — the morning light through the gates is magical and the streets are quiet.",
          "Join a guided Heritage Walk (offered daily at 8 AM from Manek Chowk) for expert narration through the pols — essential for accessing private homes and hidden courtyards.",
          "Wear comfortable walking shoes — the pol lanes are narrow, uneven, and involve climbing steep wooden staircases in heritage houses.",
          "Visit Manek Chowk at night — it transforms from a jewelry market by day to Gujarat's most famous street food destination after 9 PM.",
          "The Calico Museum of Textiles (Shahibag) requires advance booking and has limited daily slots — plan ahead.",
          "Carry a printed map — GPS signals are unreliable in the narrow pol lanes. The Heritage Walk guides provide excellent hand-drawn maps.",
          "Respect residents' privacy — many pols are private neighborhoods. Ask permission before photographing homes or entering private courtyards.",
          "Best seasons to visit: October-February (pleasant weather, 20-30°C). Avoid April-June (extreme heat, 40-47°C)."
        ],
        architecture_highlights: [
          "Pol System: 600+ self-contained community neighborhoods with single-entry gateways, shared courtyards (chowks), and 3-4 story houses with orjho balconies and wooden jali screens.",
          "Teen Darwaza (Triple Gateway): Monumental Indo-Islamic gate blending military fortification with ornamental calligraphy and lattice work.",
          "Jama Masjid (1424): 260 pillars fusing Hindu floral capitals with Islamic arched galleries — central courtyard for 25,000 worshippers.",
          "Sidi Saiyyed Mosque (1573): Stone jali window with tree-of-life — one of the finest examples of pierced stone tracery in world architecture.",
          "Adalaj ni Vav: Five-story subterranean stepwell with 500+ carved figures blending Hindu and Islamic decorative traditions.",
          "Pol House Ventilation: Wooden jali screens + orjho balconies + narrow shaded lanes = natural air-conditioning reducing temperatures by 5-8°C."
        ],
        follow_up_questions: [
          "How did the pol system enable peaceful coexistence between Hindu, Muslim, and Jain communities for over 600 years?",
          "What is the architectural significance of Jama Masjid's Hindu-Islamic pillar fusion — intentional synthesis or material reuse?",
          "How does the Walled City's passive cooling architecture compare to modern sustainable design principles?",
          "What role did Ahmedabad's textile industry play in India's independence movement and Gandhi's swadeshi campaign?",
          "How is the UNESCO World Heritage designation impacting conservation efforts and gentrification in the pol neighborhoods?",
          "What challenges does the Walled City face from modernization — traffic, infrastructure, and population decline in historic pols?"
        ]
      },
      Gujarati: {
        detailed_story: `ઈ.સ. ૧૪૧૧ — સુલતાન અહમદ શાહ I સાબરમતી નદીના પૂર્વ કિનારે ઊભા રહી, ગુજરાત સલ્તનતના રત્ન સમા એક મહાનગરનું સ્વપ્ન જોયું — જે છ સદી પછી ભારતનું પ્રથમ UNESCO વિશ્વ ધરોહર શહેર બનશે.

સ્થાપના કથા
સ્થાનિક લોકકથા અનુસાર, સુલતાન સાબરમતી પાસે શિકાર કરતા હતા ત્યારે એક અદ્ભુત દ્રશ્ય જોયું: એક સસલો શિકારી કૂતરાને ખદેડી રહ્યો હતો. તે સ્થળે પ્રદર્શિત સાહસથી પ્રભાવિત થઈ, તેમણે ત્યાં પોતાની નવી રાજધાની સ્થાપવાની ઘોષણા કરી.

દીવાલો અને દરવાજા
અહમદ શાહે ૧૦ કિલોમીટરથી વધુ લાંબી વિશાળ કિલ્લેબંધી દીવાલો બાંધાવી, જેમાં ૧૨ અલંકારિક દરવાજા શહેરમાં પ્રવેશ નિયંત્રિત કરતા. ત્રણ દરવાજા (ટીન દરવાજા), ભદ્ર કિલ્લો દરવાજા, અને માણેક બુર્જ — દરેક શહેરના સ્તરબદ્ધ ઇતિહાસની કથા કહે છે.

પોળ પ્રણાલી — જીવંત સામાજિક પ્રયોગ
દીવાલોની પાછળ અમદાવાદની સાચી પ્રતિભા છે: પોળ પ્રણાલી. પોળ એ સ્વયંસંપૂર્ણ આવાસીય સમૂહ છે — સહિયારા ચોક, સાંકડી ગૂંથાયેલી ગલીઓ, અને એક જ રક્ષાત્મક દરવાજાથી પ્રવેશ. ૬૦૦ થી વધુ પોળ દીવાલોમાં ટકી રહી છે.

દરેક પોળ ચોક્કસ સમુદાય દ્વારા વસવાટ થતી — જ્ઞાતિ, વ્યવસાય, કે ધાર્મિક સંબંધ અનુસાર. મંડવી ની પોળ — કાપડ વેપારીઓ; ખમાસા ની પોળ — અત્તર બનાવનારા; દોશીવાડાની પોળ — રેશમ વણકરો.

પોળના મકાનો ૩-૪ માળના છે, બહાર નીકળતી લાકડાની ઓરડા (ઓરઝા) બાલ્કની નીચે છાયાવાળા માર્ગો બનાવે છે. ઉપરના માળે ઝીણવટભરી લાકડાની જાળી (જાળી) પડદા — હવા ઉજાસ સાથે ગોપનીયતા — સદીઓથી પરિપૂર્ણ કુદરતી એર-કન્ડિશનિંગ.

મસ્જિદો અને પવિત્ર સ્થાનો
• જામા મસ્જિદ (૧૪૨૪): ૨૬૦ સ્તંભો — હિન્દુ પુષ્પ શીર્ષો ઇસ્લામિક કમાનવાળા ગેલેરીઓ ધારે છે.
• સીદી સૈયદ મસ્જિદ (૧૫૭૩): પથ્થરની જાળીની બારી — જીવનનું વૃક્ષ — IIM અમદાવાદનું પ્રતીક.

UNESCO માન્યતા
૨૦૧૭માં અમદાવાદ ભારતનું પ્રથમ UNESCO વિશ્વ ધરોહર શહેર બન્યું — બહુસાંસ્કૃતિક, બહુધાર્મિક શહેરી સહઅસ્તિત્વના જીવંત ઉદાહરણ તરીકે.`,
        short_story: `અમદાવાદની દીવાલોવાળું શહેર, ઈ.સ. ૧૪૧૧માં સુલતાન અહમદ શાહ I દ્વારા સ્થાપિત, ૨૦૧૭માં ભારતનું પ્રથમ UNESCO વિશ્વ ધરોહર શહેર બન્યું. ૬૦૦+ પોળ, ૧૨ ઐતિહાસિક દરવાજા, ૨૬૦ સ્તંભોવાળી જામા મસ્જિદ, સીદી સૈયદની જાળી, અને ૬૦૦ વર્ષનો કાપડ વારસો — બહુસાંસ્કૃતિક સહઅસ્તિત્વનું જીવંત સ્મારક.`,
        interesting_facts: [
          "ભારતનું પ્રથમ UNESCO વિશ્વ ધરોહર શહેર (૨૦૧૭) — પોળ પ્રણાલી અને ૬૦૦+ વર્ષના સતત બહુસાંસ્કૃતિક વસવાટ માટે.",
          "દીવાલોમાં ૬૦૦+ પોળ — દરેક ઐતિહાસિક રીતે જ્ઞાતિ, વ્યવસાય, કે ધર્મ અનુસાર સંગઠિત.",
          "જામા મસ્જિદના ૨૬૦ સ્તંભોમાં હિન્દુ પુષ્પ શીર્ષો ઇસ્લામિક કમાનો ધારે છે.",
          "પોળના મકાનોની લાકડાની જાળી અને ઓરઝા બાલ્કની ઘરનું તાપમાન ૫-૮°C ઘટાડે છે.",
          "ગાંધીજીના દાંડી કૂચ (૧૯૩૦) ની શરૂઆત સાબરમતી આશ્રમથી — દીવાલોવાળા શહેર પાસે."
        ],
        did_you_know: [
          "કેટલાક પોળ મકાનોમાં ભૂગર્ભ ટનલ છે જે પડોશી પોળ સાથે જોડાય છે — સાંપ્રદાયિક તણાવ સમયે છટકવાના માર્ગ.",
          "પોળ પ્રણાલી એટલી અસરકારક હતી કે બ્રિટિશ સંસ્થાનવાદી વહીવટીતંત્રે તેને મોટે ભાગે અકબંધ રાખી.",
          "શહેરની સાંકડી ગલીઓ (કેટલીક માત્ર ૩ ફૂટ પહોળી) જાણીજોઈને છાયા વધારવા અને પવન-ટનલ અસર બનાવવા ડિઝાઈન કરવામાં આવી."
        ],
        visitor_tips: [
          "ભદ્ર કિલ્લો / ટીન દરવાજાથી પરોઢિયે (૬-૭ AM) ચાલવાનું શરૂ કરો.",
          "દૈનિક ૮ AM ના Heritage Walk (માણેક ચોકથી) માં જોડાઓ — ખાનગી ઘરો અને છુપાયેલા ચોકમાં પ્રવેશ.",
          "માણેક ચોક રાત્રે મુલાકાત લો — દિવસે ઝવેરાત બજાર, રાત્રે ૯ PM પછી ગુજરાતનું સૌથી પ્રસિદ્ધ સ્ટ્રીટ ફૂડ.",
          "ઓક્ટોબર-ફેબ્રુઆરી — શ્રેષ્ઠ ઋતુ (૨૦-૩૦°C). એપ્રિલ-જૂન ટાળો (૪૦-૪૭°C)."
        ],
        architecture_highlights: [
          "પોળ પ્રણાલી: ૬૦૦+ સ્વયંસંપૂર્ણ સમુદાય — એક દરવાજો, સહિયારા ચોક, ૩-૪ માળના મકાનો.",
          "ટીન દરવાજા: ભવ્ય ઇન્ડો-ઇસ્લામિક દરવાજો — લશ્કરી કિલ્લેબંધી + અલંકારિક કેલિગ્રાફી.",
          "જામા મસ્જિદ: ૨૬૦ સ્તંભો — હિન્દુ-ઇસ્લામિક સ્થાપત્ય સંમિશ્રણ.",
          "સીદી સૈયદ મસ્જિદ: જીવનનું વૃક્ષ — વિશ્વ સ્થાપત્યમાં છિદ્રિત પથ્થર ટ્રેસરીના શ્રેષ્ઠ ઉદાહરણોમાંનું એક."
        ],
        follow_up_questions: [
          "પોળ પ્રણાલીએ હિન્દુ, મુસ્લિમ, અને જૈન સમુદાયો વચ્ચે ૬૦૦+ વર્ષ શાંતિપૂર્ણ સહઅસ્તિત્વ કેવી રીતે શક્ય બનાવ્યું?",
          "UNESCO વિશ્વ ધરોહર દરજ્જો પોળ પડોશમાં સંરક્ષણ અને gentrification ને કેવી રીતે અસર કરે છે?",
          "અમદાવાદના કાપડ ઉદ્યોગે ભારતના સ્વાતંત્ર્ય ચળવળ અને ગાંધીજીના સ્વદેશી અભિયાનમાં શું भूमिका ભજવી?"
        ]
      },
      Hindi: {
        detailed_story: `वर्ष १४११ ई. — सुल्तान अहमद शाह प्रथम ने साबरमती नदी के पूर्वी तट पर खड़े होकर गुजरात सल्तनत के एक महानगर का स्वप्न देखा — जो छह शताब्दियों बाद भारत का पहला UNESCO विश्व धरोहर शहर बनेगा।

स्थापना कथा
स्थानीय लोककथा के अनुसार, सुल्तान साबरमती के निकट शिकार कर रहे थे तब उन्होंने एक अद्भुत दृश्य देखा: एक खरगोश शिकारी कुत्ते को खदेड़ रहा था। उस स्थान पर प्रदर्शित साहस से प्रभावित होकर, उन्होंने वहाँ अपनी नई राजधानी स्थापित करने की घोषणा की।

दीवारें और दरवाज़े
अहमद शाह ने १० किलोमीटर से अधिक लंबी विशाल किलेबंदी दीवारें बनवाईं, जिनमें १२ अलंकारिक दरवाज़े शहर में प्रवेश नियंत्रित करते थे। तीन दरवाज़ा, भद्र किला, माणेक बुर्ज — प्रत्येक शहर के स्तरबद्ध इतिहास की कथा कहता है।

पोल प्रणाली — जीवंत सामाजिक प्रयोग
दीवारों के पीछे अहमदाबाद की सच्ची प्रतिभा है: पोल प्रणाली। पोल स्वयंपूर्ण आवासीय समूह हैं — साझा चौक, संकरी गलियाँ, एक रक्षात्मक प्रवेशद्वार। ६०० से अधिक पोल दीवारों में विद्यमान हैं।

प्रत्येक पोल विशिष्ट समुदाय द्वारा बसी — जाति, व्यवसाय, या धार्मिक संबद्धता के अनुसार। पोल के मकान ३-४ मंजिले हैं, बाहर निकली लकड़ी की बालकनी (ओरझा) नीचे छायादार मार्ग बनाती हैं। लकड़ी की जाली पर्दे — हवा + गोपनीयता — सदियों से परिपूर्ण प्राकृतिक एयर-कंडीशनिंग।

मस्जिदें और पवित्र स्थल
• जामा मस्जिद (१४२४): २६० स्तंभ — हिंदू पुष्प शीर्ष इस्लामी मेहराबदार दीर्घाएँ धारण करते हैं।
• सीदी सैयद मस्जिद (१५७३): पत्थर की जाली — जीवन का वृक्ष — IIM अहमदाबाद का प्रतीक।

UNESCO मान्यता
२०१७ में अहमदाबाद भारत का पहला UNESCO विश्व धरोहर शहर बना — बहुसांस्कृतिक, बहुधार्मिक शहरी सहअस्तित्व का जीवंत उदाहरण।`,
        short_story: `अहमदाबाद का दीवारों वाला शहर, ई.स. १४११ में सुल्तान अहमद शाह I द्वारा स्थापित, २०१७ में भारत का पहला UNESCO विश्व धरोहर शहर बना। ६००+ पोल, १२ ऐतिहासिक दरवाज़े, २६० स्तंभों वाली जामा मस्जिद, सीदी सैयद की जाली, और ६०० वर्ष का वस्त्र विरासत — बहुसांस्कृतिक सहअस्तित्व का जीवंत स्मारक।`,
        interesting_facts: [
          "भारत का पहला UNESCO विश्व धरोहर शहर (२०१७) — पोल प्रणाली और ६००+ वर्ष के निरंतर बहुसांस्कृतिक निवास हेतु।",
          "दीवारों में ६००+ पोल — प्रत्येक ऐतिहासिक रूप से जाति, व्यवसाय, या धर्म अनुसार संगठित।",
          "जामा मस्जिद के २६० स्तंभों में हिंदू पुष्प शीर्ष इस्लामी मेहराब धारण करते हैं।",
          "पोल मकानों की लकड़ी की जाली और ओरझा बालकनी घर का तापमान ५-८°C कम करती हैं।",
          "गांधीजी के दांडी मार्च (१९३०) की शुरुआत साबरमती आश्रम से — दीवारों वाले शहर के पास।"
        ],
        did_you_know: [
          "कुछ पोल मकानों में भूमिगत सुरंगें हैं जो पड़ोसी पोल से जुड़ती हैं — सांप्रदायिक तनाव के समय बचाव मार्ग।",
          "पोल प्रणाली इतनी प्रभावी थी कि ब्रिटिश औपनिवेशिक प्रशासन ने इसे अधिकतर अक्षुण्ण रखा।",
          "शहर की संकरी गलियाँ (कुछ मात्र ३ फ़ुट चौड़ी) जानबूझकर छाया बढ़ाने और पवन-सुरंग प्रभाव बनाने के लिए डिज़ाइन की गईं।"
        ],
        visitor_tips: [
          "भद्र किला / तीन दरवाज़ा से भोर (६-७ AM) में पैदल यात्रा शुरू करें।",
          "दैनिक ८ AM की Heritage Walk (माणेक चौक से) में शामिल हों।",
          "माणेक चौक रात में — दिन में जेवरात बाज़ार, रात ९ PM बाद गुजरात का सबसे प्रसिद्ध स्ट्रीट फ़ूड।",
          "अक्टूबर-फ़रवरी — सर्वोत्तम मौसम (२०-३૦°C)। अप्रैल-जून टालें (४०-४७°C)।"
        ],
        architecture_highlights: [
          "पोल प्रणाली: ६००+ स्वयंपूर्ण समुदाय — एक प्रवेशद्वार, साझा चौक, ३-४ मंजिले मकान।",
          "तीन दरवाज़ा: भव्य इंडो-इस्लामिक द्वार — सैन्य किलेबंदी + अलंकारिक कैलीग्राफ़ी।",
          "जामा मस्जिद: २६० स्तंभ — हिंदू-इस्लामिक स्थापत्य संमिश्रण।",
          "सीदी सैयद मस्जिद: जीवन का वृक्ष — विश्व स्थापत्य में छिद्रित पत्थर का उत्कृष्ट उदाहरण।"
        ],
        follow_up_questions: [
          "पोल प्रणाली ने हिंदू, मुस्लिम और जैन समुदायों के बीच ६००+ वर्ष शांतिपूर्ण सहअस्तित्व कैसे संभव बनाया?",
          "UNESCO विश्व धरोहर दर्जा पोल पड़ोस में संरक्षण और gentrification को कैसे प्रभावित कर रहा है?",
          "अहमदाबाद के वस्त्र उद्योग ने भारत के स्वतंत्रता आंदोलन और गांधी के स्वदेशी अभियान में क्या भूमिका निभाई?"
        ]
      }
    },

    "Sidi Saiyyed Mosque": {
      English: {
        detailed_story: `In the year 1573 CE, as the last embers of the Gujarat Sultanate were fading under the advance of Mughal Emperor Akbar's armies, an enslaved African nobleman named Sidi Saiyyed commissioned what would become one of the most celebrated architectural masterpieces in all of Indian art history — a modest mosque whose stone lattice windows would, four centuries later, inspire the logo of one of the world's premier business schools.

THE SIDI COMMUNITY — AFRICA'S FORGOTTEN CHAPTER IN INDIA
The story begins not in Gujarat, but on the eastern coast of Africa. The Sidis (also spelled Siddis or Sheedis) are an Afro-Indian community descended from Bantu-speaking peoples from the Swahili Coast, East Africa, and the Horn of Africa who arrived in India between the 7th and 19th centuries as merchants, sailors, mercenaries, and — tragically — enslaved persons.

In Gujarat, many Sidis rose to positions of extraordinary power. Sidi Bashir built a famous "shaking minaret" in Ahmedabad. Sidi Saiyyed, who commissioned this mosque, was a prominent member of the court of Sultan Shams-ud-Din Muzaffar Shah III, the last ruler of the Gujarat Sultanate. His mosque, built in the sultan's dying days, became an unlikely immortal monument — a swan song of an entire dynasty carved in stone.

THE TREE OF LIFE — A STONE MIRACLE
The mosque is a rectangular structure with five main arches on its western wall and three arches each on its northern and southern walls. Ten of these arched openings are filled with stone jali (lattice) screens of varying designs. But it is the two semi-circular windows on the rear (western) wall that have captivated the world.

The larger of the two windows depicts a magnificent "Tree of Life" — a single, sinuously growing tree whose interlacing branches, leaves, tendrils, and palm fronds fill the entire semi-circular frame in an organic pattern of breathtaking complexity. The tree appears to grow from a single root at the base, branching and re-branching in ever-finer divisions until its topmost tendrils dissolve into the arch's curve.

What makes this carving miraculous is its material: this is not wood, not plaster, not stucco — it is solid Rajasthani yellow sandstone, carved in situ from a single stone slab. The thinnest tendrils are barely 2-3 millimeters thick, yet they have survived over 450 years of exposure to monsoons, earthquakes, heat, and pollution. The precision required to carve such delicate tracery without fracturing the stone is almost incomprehensible — modern stone carvers acknowledge that reproducing this work with contemporary tools would be extraordinarily difficult.

GEOMETRIC HARMONY — THE SECOND WINDOW
The companion window on the same wall features a purely geometric pattern: an interlocking series of circles, hexagons, and arabesques that demonstrate the Islamic tradition of infinite pattern repetition. Together, the two windows embody the Indo-Islamic architectural synthesis at its absolute pinnacle — organic naturalism (Hindu tradition) alongside geometric abstraction (Islamic tradition), carved from the same stone, on the same wall, by the same hands.

THE OTHER EIGHT SCREENS
While the Tree of Life understandably dominates attention, the mosque's other eight jali screens are remarkable in their own right. They feature variations on floral, foliate, and geometric themes, each screen subtly different from the others. Art historians have noted that the screens progress from more geometric patterns at the front of the mosque to more organic, naturalistic patterns toward the rear — a deliberate gradient that may symbolize the spiritual journey from the structured world of human order to the flowing organic world of divine creation.

AN ICON OF MODERN INDIA
In 1961, when the Indian Institute of Management Ahmedabad (IIM-A) — designed by legendary American architect Louis Kahn — was seeking a visual identity, they chose the Sidi Saiyyed Mosque's Tree of Life jali as their logo. This single decision transformed the window from a regional treasure into a globally recognized symbol of Indian design excellence. Today, the tree motif appears on everything from Ahmedabad Municipal Corporation's branding to Gujarat Tourism campaigns, and the mosque itself has become the unofficial symbol of the city.

CONSERVATION CHALLENGES
The mosque faces significant preservation challenges. The delicate stone tracery is vulnerable to air pollution (particularly vehicular emissions from the busy Lal Darwaza traffic circle nearby), acid rain, biological growth (lichens and moss in the monsoon), and vibration damage from heavy traffic. The Archaeological Survey of India (ASI) has implemented a monitoring program, but conservators acknowledge that the jali's extreme delicacy makes intervention risky — the cure could be worse than the disease.`,

        short_story: `Sidi Saiyyed Mosque, built in 1573 CE by Sidi Saiyyed — an Afro-Indian nobleman of the Sidi community — during the final days of the Gujarat Sultanate, houses one of the world's most celebrated stone carvings: the "Tree of Life" jali window. Carved from a single slab of Rajasthani yellow sandstone, the tree's interlacing branches and tendrils (some barely 2-3mm thick) have survived 450+ years of monsoons and earthquakes. The companion geometric window embodies the Indo-Islamic synthesis — organic naturalism alongside geometric abstraction. Chosen as IIM Ahmedabad's logo in 1961, the Tree of Life became Ahmedabad's unofficial symbol and a globally recognized icon of Indian design.`,
        interesting_facts: [
          "The Tree of Life jali is carved from a SINGLE slab of Rajasthani yellow sandstone — the thinnest tendrils are barely 2-3mm thick yet have survived 450+ years.",
          "The Sidis (Siddis) are an Afro-Indian community descended from Bantu-speaking peoples from East Africa who arrived in India as merchants, sailors, mercenaries, and enslaved persons.",
          "Sidi Saiyyed was a nobleman in the court of Sultan Shams-ud-Din Muzaffar Shah III — the mosque was built during the Gujarat Sultanate's final days, making it a dynasty's swan song in stone.",
          "The mosque's two rear windows embody the Indo-Islamic synthesis: organic Tree of Life (Hindu naturalism) + geometric arabesques (Islamic abstraction) — on the same wall, by the same hands.",
          "IIM Ahmedabad chose the Tree of Life as its logo in 1961, transforming a regional treasure into a globally recognized symbol of Indian design excellence.",
          "Modern stone carvers acknowledge that reproducing the Tree of Life with contemporary tools would be extraordinarily difficult — the original craftsmanship remains unmatched.",
          "The eight other jali screens progress from geometric patterns at the front to organic patterns at the rear — possibly symbolizing a spiritual journey from human order to divine creation.",
          "The mosque has no minarets, domes, or courtyard — unusual for Islamic architecture, reflecting the Gujarat Sultanate's distinctive regional style."
        ],
        did_you_know: [
          "The Sidi community in Gujarat still maintains African cultural traditions — including the Dhamaal dance and Goma music — blended with Gujarati customs over five centuries of integration.",
          "Louis Kahn, the American architect who designed IIM-A's iconic brick campus, reportedly spent hours studying the Sidi Saiyyed jali before finalizing his design — its influence is visible in IIM-A's geometric brick screens.",
          "The mosque sits at Lal Darwaza (Red Gate), one of the busiest traffic intersections in Ahmedabad — the vehicular pollution poses one of the greatest threats to the delicate stone tracery.",
          "Some art historians argue the Tree of Life design shows influences from Persian miniature painting traditions, suggesting the carver may have been trained in both Indian and Persian artistic schools."
        ],
        visitor_tips: [
          "Visit at golden hour (6-7 AM or 5-6 PM) — the low-angle sunlight through the jali screens creates stunning shadow patterns on the mosque floor.",
          "The Tree of Life windows face west — afternoon light (3-5 PM) illuminates them from behind, making the tracery glow amber-gold. Best for photography.",
          "The mosque is small and can be seen in 15-20 minutes, but budget at least 30-45 minutes to properly appreciate the jali details — binoculars help for close examination.",
          "The mosque is an active place of worship. Visit outside prayer times (avoid Friday 12-2 PM). Remove shoes and dress modestly.",
          "Combine with a visit to Lal Darwaza area — Teen Darwaza, Bhadra Fort, and Manek Chowk are all within walking distance.",
          "Photography is permitted but flash photography and tripods are not allowed inside the mosque.",
          "The adjacent Heritage Walk starting point offers excellent guided context — highly recommended before visiting the mosque independently.",
          "Street food vendors around Lal Darwaza serve excellent dabeli, vada pav, and cutting chai — perfect post-visit refreshment."
        ],
        architecture_highlights: [
          "Tree of Life Jali: Semi-circular window carved from a single sandstone slab — interlacing branches with 2-3mm tendrils surviving 450+ years. The pinnacle of Indian stone tracery.",
          "Geometric Companion Window: Interlocking circles, hexagons, and arabesques demonstrating Islamic infinite pattern repetition — the perfect counterpoint to the organic tree.",
          "Eight Secondary Screens: A deliberate gradient from geometric (front) to organic (rear) — possibly symbolizing the journey from human order to divine creation.",
          "Post-and-Lintel Construction: Unlike typical mosque architecture, Sidi Saiyyed uses a trabeate (post-and-beam) system derived from Hindu temple traditions.",
          "Absence of Dome/Minaret: Reflects the Gujarat Sultanate's distinctive regional mosque style, which emphasized horizontal spread over vertical emphasis.",
          "Material: Rajasthani yellow sandstone selected for its fine grain, allowing the extreme delicacy of the jali tracery without fracturing."
        ],
        follow_up_questions: [
          "How did the Sidi (Afro-Indian) community contribute to Gujarat's art, architecture, and military history — and what is their cultural legacy today?",
          "What makes the Tree of Life jali technically unique compared to other examples of Indian stone tracery in Rajasthan, Delhi, and Fatehpur Sikri?",
          "How did Hindu naturalistic motifs and Islamic geometric patterns merge in Gujarat Sultanate architecture — was this synthesis deliberate court policy or organic evolution?",
          "What specific conservation challenges does the mosque face — pollution, vibration, biological growth — and what interventions are being considered?",
          "How did Louis Kahn's study of the Sidi Saiyyed jali influence his design of IIM Ahmedabad — can specific architectural elements be traced to this inspiration?",
          "What is the significance of the Gujarat Sultanate's final-era architecture — does Sidi Saiyyed Mosque represent a culmination or a departure?"
        ]
      },
      Gujarati: {
        detailed_story: `ઈ.સ. ૧૫૭૩ — ગુજરાત સલ્તનતના છેલ્લા દિવસો. મુઘલ સમ્રાટ અકબરના સૈન્ય ગુજરાત પર આગળ વધી રહ્યા છે ત્યારે, સીદી સૈયદ નામના આફ્રો-ભારતીય ખાનદાન વ્યક્તિએ એવું કંઈક બંધાવ્યું જે ભારતીય કલા ઇતિહાસની સૌથી પ્રસિદ્ધ સ્થાપત્ય કૃતિઓમાંની એક બનશે.

સીદી સમુદાય — ભારતમાં આફ્રિકાનો ભૂલાયેલો અધ્યાય
સીદીઓ (Siddis) આફ્રો-ભારતીય સમુદાય છે — પૂર્વ આફ્રિકાના બાન્ટુ-ભાષી લોકોના વંશજ જે ૭મી થી ૧૯મી સદી વચ્ચે વેપારી, ખલાસી, ભાડૂતી સૈનિક, અને — કમનસીબે — ગુલામ તરીકે ભારત આવ્યા. ગુજરાતમાં ઘણા સીદીઓ અસાધારણ શક્તિના પદો પર પહોંચ્યા.

જીવનનું વૃક્ષ — પથ્થરનો ચમત્કાર
મસ્જિદ એક લંબચોરસ માળખું છે. દસ કમાનવાળા ઓપનિંગ પથ્થરની જાળી (જાળી) પડદાઓથી ભરેલા છે. પણ પશ્ચિમ દીવાલ પરની બે અર્ધ-ગોળાકાર બારીઓએ દુનિયાને મોહિત કર્યું છે.

મોટી બારી "જીવનનું વૃક્ષ" દર્શાવે છે — એક વૃક્ષ જેની ગૂંથાયેલી ડાળીઓ, પાંદડાં, વેલાઓ, અને તાડના પાન સમગ્ર અર્ધ-ગોળાકાર ફ્રેમ ભરે છે. આ રાજસ્થાની પીળા રેતીના પથ્થરની એક જ શિલામાંથી કોતરવામાં આવ્યું — સૌથી પાતળી વેલાઓ માત્ર ૨-૩ મિલીમીટર જાડી છે, છતાં ૪૫૦+ વર્ષના ચોમાસા, ભૂકંપ, ગરમી, અને પ્રદૂષણ સામે ટકી રહ્યા છે.

ભૌમિતિક સંગત — બીજી બારી
એ જ દીવાલ પર બીજી બારી સંપૂર્ણ ભૌમિતિક પ્રતિરૂપ ધરાવે છે — ઇન્ટરલોકિંગ વર્તુળો, ષટ્કોણ, અને અરેબેસ્ક. બંને બારીઓ ઇન્ડો-ઇસ્લામિક સ્થાપત્ય સંમિશ્રણનું શિખર છે — કાર્બનિક પ્રકૃતિવાદ (હિન્દુ પરંપરા) + ભૌમિતિક અમૂર્તતા (ઇસ્લામિક પરંપરા).

૧૯૬૧માં IIM અમદાવાદે જીવનનું વૃક્ષ તેમના લોગો તરીકે પસંદ કર્યું — સ્થાનિક ખજાનાને ભારતીય ડિઝાઈન ઉત્કૃષ્ટતાનું વૈશ્વિક પ્રતીક બનાવ્યું.`,
        short_story: `સીદી સૈયદ મસ્જિદ, ઈ.સ. ૧૫૭૩માં આફ્રો-ભારતીય ખાનદાન સીદી સૈયદ દ્વારા ગુજરાત સલ્તનતના અંતિમ દિવસોમાં નિર્મિત, વિશ્વની સૌથી પ્રસિદ્ધ પથ્થરની કોતરણીઓમાંની એક ધરાવે છે: "જીવનનું વૃક્ષ" જાળી. એક રાજસ્થાની પથ્થરની શિલામાંથી કોતરેલી, ૨-૩mm પાતળી વેલાઓ ૪૫૦+ વર્ષથી ટકી રહી છે. IIM અમદાવાદનું લોગો (૧૯૬૧), અમદાવાદનું અનૌપચારિક પ્રતીક.`,
        interesting_facts: [
          "જીવનનું વૃક્ષ એક જ રાજસ્થાની પીળા રેતીના પથ્થરની શિલામાંથી કોતરેલું — ૨-૩mm પાતળી વેલાઓ ૪૫૦+ વર્ષથી ટકી.",
          "સીદીઓ પૂર્વ આફ્રિકાના બાન્ટુ-ભાષી લોકોના વંશજ છે — ગુજરાતમાં ૫ સદીથી વધુ સંકલન.",
          "મસ્જિદ ગુજરાત સલ્તનતના છેલ્લા દિવસોમાં બાંધવામાં આવી — રાજવંશનો પથ્થરમાં હંસગીત.",
          "IIM અમદાવાદે ૧૯૬૧માં જીવનનું વૃક્ષ લોગો તરીકે પસંદ કર્યું.",
          "આધુનિક પથ્થર કારીગરો સ્વીકારે છે કે સમકાલીન ઓજારોથી આ કામ પુનઃઉત્પાદિત કરવું અત્યંત કઠિન હશે."
        ],
        did_you_know: [
          "ગુજરાતનો સીદી સમુદાય હજુ પણ આફ્રિકન સાંસ્કૃતિક પરંપરાઓ — ધમાલ નૃત્ય અને ગોમા સંગીત — જાળવે છે.",
          "અમેરિકન આર્કિટેક્ટ લૂઈ કાને IIM-A ડિઝાઈન કરતા પહેલાં કલાકો સુધી સીદી સૈયદ જાળીનો અભ્યાસ કર્યો.",
          "મસ્જિદ લાલ દરવાજા પર છે — અમદાવાદના સૌથી વ્યસ્ત ટ્રાફિક ચોકમાંના એક — વાહનોનું પ્રદૂષણ સૌથી મોટો ખતરો."
        ],
        visitor_tips: [
          "ગોલ્ડન અવર (૬-૭ AM અથવા ૫-૬ PM) મુલાકાત લો — જાળીમાંથી સૂર્યપ્રકાશ ફર્શ પર અદ્ભુત પડછાયાઓ બનાવે છે.",
          "જીવનનું વૃક્ષ પશ્ચિમ તરફ છે — બપોર ૩-૫ PM — પાછળથી પ્રકાશ, જાળી સોનેરી-એમ્બર ઝળકે. ફોટોગ્રાફી માટે શ્રેષ્ઠ.",
          "મસ્જિદ ૧૫-૨૦ મિનિટમાં જોઈ શકાય, પણ જાળીની વિગતો માટે ૩૦-૪૫ મિનિટ રાખો.",
          "મસ્જિદ સક્રિય ઇબાદતગાહ છે. નમાઝના સમય ટાળો (શુક્રવાર ૧૨-૨ PM). પગરખાં કાઢો.",
          "લાલ દરવાજા વિસ્તારની સ્ટ્રીટ ફૂડ — દાબેલી, વડા પાવ, કટિંગ ચા — ઉત્તમ."
        ],
        architecture_highlights: [
          "જીવનનું વૃક્ષ: એક પથ્થરની શિલામાંથી — ૨-૩mm વેલાઓ ૪૫૦+ વર્ષ ટકી. ભારતીય પથ્થર ટ્રેસરીનું શિખર.",
          "ભૌમિતિક સંગત બારી: ઇન્ટરલોકિંગ વર્તુળો + ષટ્કોણ + અરેબેસ્ક — ઇસ્લામિક અનંત પ્રતિરૂપ.",
          "આઠ ગૌણ જાળી: ભૌમિતિક (આગળ) થી કાર્બનિક (પાછળ) — આધ્યાત્મિક યાત્રાનું સંભવિત પ્રતીક.",
          "ગુજરાત સલ્તનતની વિશિષ્ટ પ્રાદેશિક શૈલી — ગુંબજ કે મિનારા વિના."
        ],
        follow_up_questions: [
          "સીદી (આફ્રો-ભારતીય) સમુદાયે ગુજરાતની કલા, સ્થાપત્ય, અને લશ્કરી ઇતિહાસમાં કેવું યોગદાન આપ્યું?",
          "જીવનનું વૃક્ષ ટેકનિકલી રાજસ્થાન, દિલ્હી, અને ફતેહપુર સિક્રીની પથ્થર ટ્રેસરી કરતાં કેવી રીતે અનન્ય છે?",
          "મસ્જિદને કયા સંરક્ષણ પડકારો — પ્રદૂષણ, કંપન, જૈવિક વૃદ્ધિ — છે?"
        ]
      },
      Hindi: {
        detailed_story: `वर्ष १५७३ ई. — गुजरात सल्तनत के अंतिम दिन। मुग़ल सम्राट अकबर की सेनाएँ गुजरात पर आगे बढ़ रही हैं तब, सीदी सैयद नामक एक आफ़्रो-भारतीय ख़ानदानी व्यक्ति ने कुछ ऐसा बनवाया जो भारतीय कला इतिहास की सबसे प्रसिद्ध स्थापत्य कृतियों में से एक बनेगा।

सीदी समुदाय — भारत में अफ़्रीका का भूला अध्याय
सीदी (Siddis) आफ़्रो-भारतीय समुदाय हैं — पूर्वी अफ़्रीका के बंटू-भाषी लोगों के वंशज जो ७वीं से १९वीं शताब्दी के बीच व्यापारी, नाविक, भाड़े के सैनिक, और दुर्भाग्यवश — दास के रूप में भारत आए। गुजरात में कई सीदी असाधारण शक्ति के पदों पर पहुँचे।

जीवन का वृक्ष — पत्थर का चमत्कार
मस्जिद एक आयताकार संरचना है। पश्चिमी दीवार पर दो अर्ध-गोलाकार खिड़कियों ने दुनिया को मोहित किया है।

बड़ी खिड़की "जीवन का वृक्ष" दर्शाती है — एक वृक्ष जिसकी गुँथी शाखाएँ, पत्तियाँ, और बेलें पूरे अर्ध-गोलाकार फ़्रेम को भरती हैं। यह राजस्थानी पीले बलुआ पत्थर की एक ही शिला से काटी गई — सबसे पतली बेलें मात्र २-३ मिलीमीटर मोटी हैं, फिर भी ४५०+ वर्ष के मानसून, भूकंप और प्रदूषण से अक्षत बची हैं।

ज्यामितीय संगत — दूसरी खिड़की
उसी दीवार पर दूसरी खिड़की पूर्णतः ज्यामितीय प्रतिरूप धारण करती है — इंटरलॉकिंग वृत्त, षट्कोण, और अरेबेस्क। दोनों खिड़कियाँ इंडो-इस्लामिक संश्लेषण का शिखर हैं — जैविक प्रकृतिवाद (हिंदू परंपरा) + ज्यामितीय अमूर्तता (इस्लामिक परंपरा)।

१९६१ में IIM अहमदाबाद ने जीवन का वृक्ष अपने लोगो के रूप में चुना — एक स्थानीय निधि को भारतीय डिज़ाइन उत्कृष्टता का वैश्विक प्रतीक बनाया।`,
        short_story: `सीदी सैयद मस्जिद, ई.स. १५७३ में आफ़्रो-भारतीय ख़ानदानी सीदी सैयद द्वारा गुजरात सल्तनत के अंतिम दिनों में निर्मित, दुनिया की सबसे प्रसिद्ध पत्थर नक्काशियों में से एक — "जीवन का वृक्ष" जाली — धारण करती है। एक राजस्थानी पत्थर की शिला से काटी गई, २-३mm पतली बेलें ४५०+ वर्षों से अक्षत। IIM अहमदाबाद का लोगो (१९६१), अहमदाबाद का अनौपचारिक प्रतीक।`,
        interesting_facts: [
          "जीवन का वृक्ष एक ही राजस्थानी पीले बलुआ पत्थर की शिला से — सबसे पतली बेलें मात्र २-३mm, ४५०+ वर्षों से अक्षत।",
          "सीदी पूर्वी अफ़्रीका के बंटू-भाषी लोगों के वंशज — गुजरात में ५ शताब्दियों से अधिक एकीकरण।",
          "मस्जिद गुजरात सल्तनत के अंतिम दिनों में बनी — राजवंश का पत्थर में हंसगीत।",
          "IIM अहमदाबाद ने १९६१ में जीवन का वृक्ष लोगो के रूप में चुना।",
          "आधुनिक पत्थर कारीगर स्वीकार करते हैं कि समकालीन उपकरणों से पुनरुत्पादन अत्यंत कठिन होगा।"
        ],
        did_you_know: [
          "गुजरात का सीदी समुदाय अभी भी अफ़्रीकी सांस्कृतिक परंपराएँ — धमाल नृत्य और गोमा संगीत — बनाए रखता है।",
          "अमेरिकी वास्तुकार लुई काह्न ने IIM-A डिज़ाइन करने से पहले घंटों सीदी सैयद जाली का अध्ययन किया।",
          "मस्जिद लाल दरवाज़ा पर है — अहमदाबाद के सबसे व्यस्त चौराहों में से एक — वाहन प्रदूषण सबसे बड़ा ख़तरा।"
        ],
        visitor_tips: [
          "गोल्डन ऑवर (६-७ AM या ५-६ PM) में जाएँ — जाली से सूर्य प्रकाश फ़र्श पर अद्भुत छायाएँ बनाता है।",
          "जीवन का वृक्ष पश्चिम की ओर — दोपहर ३-५ PM — पीछे से प्रकाश, जाली सुनहरी चमकती है। फ़ोटोग्राफ़ी के लिए सर्वोत्तम।",
          "मस्जिद १५-२० मिनट में देखी जा सकती है, पर जाली विवरण के लिए ३०-४५ मिनट रखें।",
          "मस्जिद सक्रिय इबादतगाह है। नमाज़ का समय टालें (शुक्रवार १२-२ PM)। जूते उतारें।",
          "लाल दरवाज़ा क्षेत्र का स्ट्रीट फ़ूड — दाबेली, वड़ा पाव, कटिंग चाय — उत्तम।"
        ],
        architecture_highlights: [
          "जीवन का वृक्ष: एक पत्थर की शिला से — २-३mm बेलें ४५०+ वर्ष। भारतीय पत्थर ट्रेसरी का शिखर।",
          "ज्यामितीय संगत खिड़की: इंटरलॉकिंग वृत्त + षट्कोण + अरेबेस्क — इस्लामी अनंत प्रतिरूप।",
          "आठ गौण जाली: ज्यामितीय (आगे) से जैविक (पीछे) — आध्यात्मिक यात्रा का संभावित प्रतीक।",
          "गुजरात सल्तनत की विशिष्ट प्रादेशिक शैली — गुंबद या मीनार के बिना।"
        ],
        follow_up_questions: [
          "सीदी (आफ़्रो-भारतीय) समुदाय ने गुजरात की कला, स्थापत्य, और सैन्य इतिहास में क्या योगदान दिया?",
          "जीवन का वृक्ष तकनीकी रूप से राजस्थान, दिल्ली, और फ़तेहपुर सीकरी की पत्थर ट्रेसरी से कैसे अनूठा है?",
          "मस्जिद को कौन-से संरक्षण चुनौतियाँ — प्रदूषण, कंपन, जैविक वृद्धि — हैं?"
        ]
      }
    }
  }

  // ── DURATION-AWARE WALKING ROUTE GENERATOR ──────────────────
  const walkingRoutes = {
    "Modhera Sun Temple": {
      English: {
        short: `Quick Tour (\${dur} min): Begin at the Surya Kund viewpoint (\${Math.round(dur*0.3)} min) → photograph the 108 shrines from the upper terrace. Walk to Sabha Mandap (\${Math.round(dur*0.4)} min) → admire the 52 pillars and ceiling carvings. Conclude at the Garbhagriha entrance (\${Math.round(dur*0.3)} min) → view the east-west solar alignment axis.`,
        medium: `Standard Heritage Walk (\${dur} min): Start at the Surya Kund Stepped Reservoir (\${Math.round(dur*0.25)} min) → descend the steps, explore the 108 uniquely carved mini-shrines, observe the hydraulic engineering. Proceed to the Sabha Mandap Assembly Hall (\${Math.round(dur*0.3)} min) → study the 52 carved pillars representing the solar year, examine the ceiling's ecliptic mapping, identify scenes from the epics. Cross the Torana Archway (\${Math.round(dur*0.1)} min) → study the twelve Adityas and Vishnu's avatars. Enter the Garbhagriha Sanctum (\${Math.round(dur*0.15)} min) → experience the solar alignment axis, view the Surya pedestal. End with the exterior bas-relief circuit (\${Math.round(dur*0.2)} min) → study the 300+ narrative panels on the outer walls depicting Ramayana and Mahabharata scenes.`,
        long: `Comprehensive Explorer Route (\${dur} min): Begin at the site entrance museum and information boards (\${Math.round(dur*0.08)} min) → context on Solanki dynasty and Sompura architects. Descend into the Surya Kund (\${Math.round(dur*0.18)} min) → explore all four terraced levels, photograph the 108 individual shrines, note the hydraulic drainage channels, observe the thermal-regulation pool at the base. Ascend and proceed to the Sabha Mandap (\${Math.round(dur*0.22)} min) → detailed study of all 52 pillars (identify the seasonal iconography), ceiling concentric rings mapping the ecliptic, apsara dancer panels, and the mythological narrative sequences. Cross through the Torana Archway (\${Math.round(dur*0.1)} min) → close examination of the twelve Adityas, Vishnu's dashavatar panels, and the Kirtimukha gargoyle cornices. Enter the Garbhagriha and circumambulate (\${Math.round(dur*0.12)} min) → experience the east-west solar axis, examine the pedestal and doorframe carvings. Walk the complete exterior circuit (\${Math.round(dur*0.15)} min) → study all 300+ bas-relief narrative panels on the outer walls. Visit the nearby Modhera village solar installations (\${Math.round(dur*0.15)} min) → India's first fully solar-powered village, a modern echo of the ancient sun temple.`
      },
      Gujarati: {
        short: `ઝડપી પ્રવાસ (\${dur} મિનિટ): સૂર્યકુંડ દ્રશ્ય બિંદુ (\${Math.round(dur*0.3)} મિ.) → સભા મંડપ (\${Math.round(dur*0.4)} મિ.) → ગર્ભગૃહ (\${Math.round(dur*0.3)} મિ.)`,
        medium: `ધોરણ વારસા ચાલ (\${dur} મિનિટ): સૂર્યકુંડ (\${Math.round(dur*0.25)} મિ.) → ૧૦૮ લઘુ મંદિરો → સભા મંડપ (\${Math.round(dur*0.3)} મિ.) → ૫૨ સ્તંભો → તોરણ દ્વાર (\${Math.round(dur*0.1)} મિ.) → ગર્ભગૃહ (\${Math.round(dur*0.15)} મિ.) → બાહ્ય શિલ્પ (\${Math.round(dur*0.2)} મિ.)`,
        long: `વ્યાપક અન્વેષણ (\${dur} મિનિટ): સંગ્રહાલય (\${Math.round(dur*0.08)} મિ.) → સૂર્યકુંડ (\${Math.round(dur*0.18)} મિ.) → સભા મંડપ (\${Math.round(dur*0.22)} મિ.) → તોરણ (\${Math.round(dur*0.1)} મિ.) → ગર્ભગૃહ (\${Math.round(dur*0.12)} મિ.) → બાહ્ય પરિક્રમા (\${Math.round(dur*0.15)} મિ.) → મોઢેરા ગામ સૌર સ્થાપનો (\${Math.round(dur*0.15)} મિ.)`
      },
      Hindi: {
        short: `त्वरित भ्रमण (\${dur} मिनट): सूर्य कुंड (\${Math.round(dur*0.3)} मि.) → सभा मंडप (\${Math.round(dur*0.4)} मि.) → गर्भगृह (\${Math.round(dur*0.3)} मि.)`,
        medium: `मानक विरासत पैदल यात्रा (\${dur} मिनट): सूर्य कुंड (\${Math.round(dur*0.25)} मि.) → १०८ लघु मंदिर → सभा मंडप (\${Math.round(dur*0.3)} मि.) → ५२ स्तंभ → तोरण द्वार (\${Math.round(dur*0.1)} मि.) → गर्भगृह (\${Math.round(dur*0.15)} मि.) → बाह्य शिल्प (\${Math.round(dur*0.2)} मि.)`,
        long: `व्यापक अन्वेषण (\${dur} मिनट): संग्रहालय (\${Math.round(dur*0.08)} मि.) → सूर्य कुंड (\${Math.round(dur*0.18)} मि.) → सभा मंडप (\${Math.round(dur*0.22)} मि.) → तोरण (\${Math.round(dur*0.1)} मि.) → गर्भगृह (\${Math.round(dur*0.12)} मि.) → बाह्य परिक्रमा (\${Math.round(dur*0.15)} मि.) → मोढेरा गाँव सौर स्थापनाएँ (\${Math.round(dur*0.15)} मि.)`
      }
    },
    "Ahmedabad Walled City": {
      English: {
        short: `Quick Tour (\${dur} min): Start at Teen Darwaza (\${Math.round(dur*0.2)} min) → photograph the triple-arched gateway. Walk through Bhadra Fort (\${Math.round(dur*0.3)} min) → explore the fort grounds. End at Manek Chowk (\${Math.round(dur*0.5)} min) → experience the bustling market square.`,
        medium: `Heritage Walk (\${dur} min): Begin at Teen Darwaza (\${Math.round(dur*0.12)} min) → Bhadra Fort and grounds (\${Math.round(dur*0.15)} min) → Enter the pol district: explore 2-3 heritage pols with carved wooden facades and private chowks (\${Math.round(dur*0.3)} min) → Jama Masjid (\${Math.round(dur*0.18)} min) → study the 260-pillar Hindu-Islamic fusion. Conclude at Manek Chowk (\${Math.round(dur*0.25)} min) → street food and market exploration.`,
        long: `Comprehensive Heritage Trail (\${dur} min): Start at Bhadra Fort and Teen Darwaza (\${Math.round(dur*0.1)} min) → Deep pol exploration: 5-6 heritage pols including Mandvi ni Pol, Khamasa ni Pol (\${Math.round(dur*0.2)} min) → visit private heritage homes with carved wooden facades, orjho balconies, and hidden courtyards → Jama Masjid (\${Math.round(dur*0.12)} min) → Rani no Hajiro queens' tomb (\${Math.round(dur*0.08)} min) → Sidi Saiyyed Mosque Tree of Life (\${Math.round(dur*0.1)} min) → Dada Harir ni Vav stepwell (\${Math.round(dur*0.12)} min) → Calico Museum textile collections (\${Math.round(dur*0.15)} min) → End at Manek Chowk (\${Math.round(dur*0.13)} min) → evening street food experience.`
      },
      Gujarati: {
        short: `ઝડપી પ્રવાસ (\${dur} મિનિટ): ટીન દરવાજા (\${Math.round(dur*0.2)} મિ.) → ભદ્ર કિલ્લો (\${Math.round(dur*0.3)} મિ.) → માણેક ચોક (\${Math.round(dur*0.5)} મિ.)`,
        medium: `વારસા ચાલ (\${dur} મિનિટ): ટીન દરવાજા (\${Math.round(dur*0.12)} મિ.) → ભદ્ર કિલ્લો (\${Math.round(dur*0.15)} મિ.) → ૨-૩ વારસાગત પોળ (\${Math.round(dur*0.3)} મિ.) → જામા મસ્જિદ (\${Math.round(dur*0.18)} મિ.) → માણેક ચોક (\${Math.round(dur*0.25)} મિ.)`,
        long: `વ્યાપક વારસા ટ્રેલ (\${dur} મિનિટ): ભદ્ર + ટીન દરવાજા (\${Math.round(dur*0.1)} મિ.) → ૫-૬ પોળ (\${Math.round(dur*0.2)} મિ.) → જામા મસ્જિદ (\${Math.round(dur*0.12)} મિ.) → રાણીનો હજીરો (\${Math.round(dur*0.08)} મિ.) → સીદી સૈયદ (\${Math.round(dur*0.1)} મિ.) → દાદા હરિર વાવ (\${Math.round(dur*0.12)} મિ.) → કેલિકો મ્યુઝિયમ (\${Math.round(dur*0.15)} મિ.) → માણેક ચોક (\${Math.round(dur*0.13)} મિ.)`
      },
      Hindi: {
        short: `त्वरित भ्रमण (\${dur} मिनट): तीन दरवाज़ा (\${Math.round(dur*0.2)} मि.) → भद्र किला (\${Math.round(dur*0.3)} मि.) → माणेक चौक (\${Math.round(dur*0.5)} मि.)`,
        medium: `विरासत यात्रा (\${dur} मिनट): तीन दरवाज़ा (\${Math.round(dur*0.12)} मि.) → भद्र किला (\${Math.round(dur*0.15)} मि.) → २-३ विरासती पोल (\${Math.round(dur*0.3)} मि.) → जामा मस्जिद (\${Math.round(dur*0.18)} मि.) → माणेक चौक (\${Math.round(dur*0.25)} मि.)`,
        long: `व्यापक विरासत ट्रेल (\${dur} मिनट): भद्र + तीन दरवाज़ा (\${Math.round(dur*0.1)} मि.) → ५-६ पोल (\${Math.round(dur*0.2)} मि.) → जामा मस्जिद (\${Math.round(dur*0.12)} मि.) → रानी नो हजीरो (\${Math.round(dur*0.08)} मि.) → सीदी सैयद (\${Math.round(dur*0.1)} मि.) → दादा हरीर वाव (\${Math.round(dur*0.12)} मि.) → कैलिको म्यूज़ियम (\${Math.round(dur*0.15)} मि.) → माणेक चौक (\${Math.round(dur*0.13)} मि.)`
      }
    },
    "Sidi Saiyyed Mosque": {
      English: {
        short: `Quick Visit (\${dur} min): Enter from Lal Darwaza side (\${Math.round(dur*0.2)} min) → proceed directly to the western wall to view the Tree of Life and geometric jali windows (\${Math.round(dur*0.5)} min) → observe the eight secondary screens on your way out (\${Math.round(dur*0.3)} min).`,
        medium: `Detailed Visit (\${dur} min): Approach from Lal Darwaza, noting the mosque's position at the historic gateway (\${Math.round(dur*0.1)} min) → Enter and examine the eight secondary jali screens, noting the geometric-to-organic gradient (\${Math.round(dur*0.25)} min) → Spend dedicated time at the Tree of Life window: study the branching pattern, 2-3mm tendrils, root-to-crown composition (\${Math.round(dur*0.3)} min) → Compare with the geometric companion window on the same wall (\${Math.round(dur*0.15)} min) → Study the post-and-lintel construction system (\${Math.round(dur*0.2)} min).`,
        long: `Comprehensive Mosque & Area Tour (\${dur} min): Begin with context at the Lal Darwaza heritage information point (\${Math.round(dur*0.08)} min) → Explore the exterior: study the mosque's footprint, absence of dome/minaret, Gujarat Sultanate regional style (\${Math.round(dur*0.1)} min) → Enter and systematically study all eight secondary jali screens (\${Math.round(dur*0.15)} min) → Extended study of the Tree of Life window (\${Math.round(dur*0.18)} min) → Geometric companion window analysis (\${Math.round(dur*0.1)} min) → Architectural details: post-and-lintel system, stone material, construction technique (\${Math.round(dur*0.09)} min) → Walk to nearby Teen Darwaza (\${Math.round(dur*0.1)} min) → Bhadra Fort exploration (\${Math.round(dur*0.1)} min) → Conclude at Manek Chowk for refreshments (\${Math.round(dur*0.1)} min).`
      },
      Gujarati: {
        short: `ઝડપી મુલાકાત (\${dur} મિનિટ): લાલ દરવાજાથી (\${Math.round(dur*0.2)} મિ.) → જીવનનું વૃક્ષ + ભૌમિતિક જાળી (\${Math.round(dur*0.5)} મિ.) → આઠ ગૌણ જાળી (\${Math.round(dur*0.3)} મિ.)`,
        medium: `વિગતવાર મુલાકાત (\${dur} મિનિટ): લાલ દરવાજા (\${Math.round(dur*0.1)} મિ.) → આઠ ગૌણ જાળી (\${Math.round(dur*0.25)} મિ.) → જીવનનું વૃક્ષ (\${Math.round(dur*0.3)} મિ.) → ભૌમિતિક સંગત (\${Math.round(dur*0.15)} મિ.) → સ્થાપત્ય વિગતો (\${Math.round(dur*0.2)} મિ.)`,
        long: `વ્યાપક મસ્જિદ + વિસ્તાર પ્રવાસ (\${dur} મિનિટ): લાલ દરવાજા (\${Math.round(dur*0.08)} મિ.) → બાહ્ય (\${Math.round(dur*0.1)} મિ.) → આઠ જાળી (\${Math.round(dur*0.15)} મિ.) → જીવનનું વૃક્ષ (\${Math.round(dur*0.18)} મિ.) → ભૌમિતિક (\${Math.round(dur*0.1)} મિ.) → સ્થાપત્ય (\${Math.round(dur*0.09)} મિ.) → ટીન દરવાજા (\${Math.round(dur*0.1)} મિ.) → ભદ્ર (\${Math.round(dur*0.1)} મિ.) → માણેક ચોક (\${Math.round(dur*0.1)} મિ.)`
      },
      Hindi: {
        short: `त्वरित भ्रमण (\${dur} मिनट): लाल दरवाज़ा से (\${Math.round(dur*0.2)} मि.) → जीवन का वृक्ष + ज्यामितीय जाली (\${Math.round(dur*0.5)} मि.) → आठ गौण जाली (\${Math.round(dur*0.3)} मि.)`,
        medium: `विस्तृत भ्रमण (\${dur} मिनट): लाल दरवाज़ा (\${Math.round(dur*0.1)} मि.) → आठ गौण जाली (\${Math.round(dur*0.25)} मि.) → जीवन का वृक्ष (\${Math.round(dur*0.3)} मि.) → ज्यामितीय संगत (\${Math.round(dur*0.15)} मि.) → स्थापत्य विवरण (\${Math.round(dur*0.2)} मि.)`,
        long: `व्यापक मस्जिद + क्षेत्र भ्रमण (\${dur} मिनट): लाल दरवाज़ा (\${Math.round(dur*0.08)} मि.) → बाह्य (\${Math.round(dur*0.1)} मि.) → आठ जाली (\${Math.round(dur*0.15)} मि.) → जीवन का वृक्ष (\${Math.round(dur*0.18)} मि.) → ज्यामितीय (\${Math.round(dur*0.1)} मि.) → स्थापत्य (\${Math.round(dur*0.09)} मि.) → तीन दरवाज़ा (\${Math.round(dur*0.1)} मि.) → भद्र (\${Math.round(dur*0.1)} मि.) → माणेक चौक (\${Math.round(dur*0.1)} मि.)`
      }
    }
  }

  // ── RESOLVE CONTENT ───────────────────────────────────────
  const siteKey = Object.keys(siteDB).find(k => site?.includes(k.split(' ')[0])) || "Modhera Sun Temple"
  const lang = language || "English"
  const siteContent = siteDB[siteKey]?.[lang] || siteDB[siteKey]?.English || siteDB["Modhera Sun Temple"].English

  // Select walking route based on duration
  const routeLevel = dur <= 30 ? 'short' : dur <= 90 ? 'medium' : 'long'
  const routeData = walkingRoutes[siteKey]?.[lang] || walkingRoutes[siteKey]?.English || walkingRoutes["Modhera Sun Temple"].English
  const selectedRoute = routeData[routeLevel]

  return {
    site_name: site || siteKey,
    powered_by: "IBM Granite 3.0 Cultural LLM",
    visitor_profile: {
      age_group: ageGroup,
      language: lang,
      duration_minutes: dur,
      interests: interests || ["Architecture", "History"],
      experience_type: experienceType || "Educational"
    },
    detailed_story: siteContent.detailed_story,
    short_story: siteContent.short_story,
    interesting_facts: siteContent.interesting_facts,
    did_you_know: siteContent.did_you_know,
    visitor_tips: siteContent.visitor_tips,
    walking_route: selectedRoute,
    architecture_highlights: siteContent.architecture_highlights,
    follow_up_questions: siteContent.follow_up_questions,
    disclaimer: "This narrative is generated by IBM Granite AI for educational and cultural enrichment. Historical details are curated from ASI records and peer-reviewed sources. Verify with authoritative publications for academic use."
  }
}
\nexport const getMockConservationReport = (siteId = 1) => {
  const site = DEMO_SITES.find(s => s.id === Number(siteId)) || DEMO_SITES[0]
  const reportCode = `HG-${site.id}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`
  return {
    report_id: reportCode,
    site_name: site.name,
    generated_at: new Date().toISOString(),
    overall_risk: {
      score: site.health_score < 70 ? 77.3 : 32.5,
      level: site.health_score < 70 ? "High" : "Satisfactory",
      label: site.health_score < 70 ? "Requires Immediate Intervention" : "Stable Monitoring"
    },
    executive_summary: `Consolidated AI Conservation Assessment for ${site.name}: Multi-agent telemetry synthesis combining Structural Health Vision, Visitor Flow Telemetry, and Satellite Boundary Monitoring identifies elevated localized mechanical strain on external sandstone elements. Immediate preventive preservation actions are scheduled.`,
    agent_findings: {
      structural: {
        agent: "Structural Monitoring Agent",
        status: "Elevated Risk",
        findings: "Hairline fracture (1.8mm) detected on eastern facade relief panels; moisture absorption noted at lower step plinths.",
        score: 77.3
      },
      visitor: {
        agent: "Visitor Flow Agent",
        status: "Normal Flow",
        findings: "Peak load at 44% capacity; crowd concentration observed near sanctum entry during midday.",
        peak_occupancy: "58%"
      },
      encroachment: {
        agent: "Encroachment Detection Agent",
        status: "Action Flagged",
        findings: "Temporary scaffolding anomaly detected 85m from monument boundary requiring physical ground verification.",
        confidence: "76%"
      }
    },
    conservation_tasks: [
      { id: 101, title: "Eastern Façade Non-destructive Ultrasonic Testing", priority: "High", status: "In Progress", deadline: "7 Days", assigned_department: "ASI Science Branch" },
      { id: 102, title: "Field Verification of Northern Buffer Zone Anomaly", priority: "High", status: "Pending", deadline: "3 Days", assigned_department: "State Archaeology Dept" },
      { id: 103, title: "Surya Kund Plinth Moisture Desalination Treatment", priority: "Medium", status: "Scheduled", deadline: "21 Days", assigned_department: "Conservation Engineering" },
      { id: 104, title: "Intelligent Visitor Flow Stanchion Realignment", priority: "Medium", status: "Completed", deadline: "Done", assigned_department: "Site Administration" }
    ],
    budget_estimate_inr: "₹ 4,85,000",
    authorized_signoff: "AI Multi-Agent Synthesis · IBM Granite Engine",
    key_metrics: {
      total_visitors: 1280,
      visitor_trend_pct: 12.0,
      active_alerts: 3,
      alerts_trend: 1,
      site_health: site.health_score || 85.0,
      health_trend_pct: 5.0,
      date_range: "1 Sep 2026 – 7 Sep 2026",
      location_display: site.location || "Ahmedabad, Gujarat, India"
    },
    key_findings: [
      {
        finding: "High visitor pressure during weekends",
        status_color: "red",
        severity: "High",
        evidence: "Recorded 1,280 visitors vs carrying capacity of 500 (peak surge in Sabha Mandap)",
        sources: ["Field Inspection (Manual Entry)", "Open-Meteo Weather API", "Turnstile Telemetry"]
      },
      {
        finding: "Minor structural weathering observed",
        status_color: "yellow",
        severity: "Moderate",
        evidence: "Displacement sensors register stable fracture width (1.2mm) below 1.5mm safety threshold",
        sources: ["ASI Gujarat Circle Telemetry", "Acoustic Vibration Node"]
      },
      {
        finding: "No major encroachment detected",
        status_color: "green",
        severity: "Low",
        evidence: "Statutory 100m prohibited buffer zone verified clear of unauthorized activity",
        sources: ["ISRO Cartosat Satellite Feed", "State Urban Boundary Registry"]
      }
    ],
    timeline: [
      { id: 1, date: "07 Sep 2026, 17:30", type: "VISITOR_FLOW", metric: "visitor_count: 480 visitors", origin: "MANUAL_ENTRY", sources: ["Field Officer Patel"], severity: "Critical" },
      { id: 2, date: "06 Sep 2026, 14:00", type: "ENVIRONMENTAL_CONDITION", metric: "temperature_c: 34.2 °C", origin: "EXTERNAL_SOURCE", sources: ["Open-Meteo Weather API"], severity: "Moderate" },
      { id: 3, date: "05 Sep 2026, 09:15", type: "STRUCTURAL_INTEGRITY", metric: "crack_width_mm: 1.2 mm", origin: "EXTERNAL_SOURCE", sources: ["ASI Gujarat Circle Telemetry"], severity: "Moderate" },
      { id: 4, date: "04 Sep 2026, 11:45", type: "ENCROACHMENT", metric: "encroachment_distance_m: 145 m", origin: "EXTERNAL_SOURCE", sources: ["ISRO Cartosat Satellite Feed"], severity: "Low" }
    ]
  }
}

export const getMockActivityLogs = (limit = 25) => {
  const now = new Date()
  const fmt = (d) => d.toTimeString().split(" ")[0]
  
  const sampleLogs = [
    { offset: 1, agent: "Granite LLM", event_type: "REASONING", message: "IBM Granite synthesized cross-agent correlation for Modhera Sun Temple: visitor surge aligns with structural strain zone." },
    { offset: 3, agent: "Conservation Agent", event_type: "TASK", message: "Auto-generated High Priority Task #102: Statutory Field Inspection for Northern Boundary." },
    { offset: 6, agent: "Orchestrator", event_type: "CORRELATION", message: "CROSS-AGENT ALERT: High visitor density (Sabha Mandap) correlated with structural vibration sensor telemetry." },
    { offset: 8, agent: "Encroachment Agent", event_type: "DETECTION", message: "Satellite vision detected 38m² perimeter change at 85m from northern boundary. Confidence: 76%." },
    { offset: 12, agent: "Visitor Agent", event_type: "ALERT", message: "Visitor density exceeded 60% threshold in Surya Kund stepped precinct. Pathway diversion suggested." },
    { offset: 16, agent: "Structural Agent", event_type: "SCORE", message: "Computed risk score 77.3/100 (High Risk) for Eastern Façade. Granite assessment attached." },
    { offset: 20, agent: "Structural Agent", event_type: "ANALYSIS", message: "CV analysis completed on Modhera Eastern Façade: 3 micro-defects detected." },
    { offset: 25, agent: "Storytelling Agent", event_type: "STORY", message: "Generated 3-language personalized heritage guide for Ahmedabad Walled City." },
    { offset: 30, agent: "Orchestrator", event_type: "INIT", message: "HeritageGuardian Multi-Agent Platform online. Monitoring 4 Gujarat UNESCO & ASI sites." }
  ]

  return sampleLogs.slice(0, limit).map((log, idx) => {
    const t = new Date(now.getTime() - log.offset * 60000)
    return {
      timestamp: fmt(t),
      iso_timestamp: t.toISOString(),
      agent: log.agent,
      event_type: log.event_type,
      message: log.message,
      is_granite_output: log.agent === "Granite LLM" || log.message.includes("Granite"),
      site_id: (idx % 4) + 1
    }
  })
}

export const getMockChatResponse = (query, siteContext = "Modhera Sun Temple") => {
  const q = (query || "").toLowerCase()

  if (q.includes("condition") || q.includes("health") || q.includes("modhera")) {
    return `🏛️ **Modhera Sun Temple Current Status Assessment:**\n\n• **Overall Health Score:** 68/100 (High Risk Attention)\n• **Structural Telemetry:** Hairline stress fracture (1.8mm) detected on Eastern Façade relief panel #3. Diurnal thermal expansion confirmed by sensor telemetry.\n• **Moisture Status:** Efflorescence noted at Surya Kund lower steps; capillary dampness active.\n• **Visitor Load:** 185 visitors (37% capacity) — Green/Low status.\n• **Encroachment:** Potential temporary structure flagged 85m north for statutory field check.\n\n*Powered by IBM Granite Structural & Sensor Agent Fusion.*`
  }

  if (q.includes("visitor") || q.includes("crowd") || q.includes("congestion")) {
    return `👥 **Real-time Visitor Flow Intelligence:**\n\n• **Current Site:** ${siteContext}\n• **Overall Load:** 37% of 500 max capacity.\n• **High-Density Zone:** Sabha Mandap is at 45% capacity (Yellow / Moderate).\n• **Low-Density Zone:** Surya Kund is currently at 41% with gentle visitor dispersion.\n• **Estimated Wait Time:** 5 minutes at main gate.\n• **AI Recommendation:** Guide incoming tour groups through the Western Colonnade to balance pedestrian density.\n\n*Simulated real-time visitor telemetry.*`
  }

  if (q.includes("report") || q.includes("conservation")) {
    return `📋 **Conservation Report Summary for ${siteContext}:**\n\n• **Report Code:** HG-2026-CONS-01\n• **Overall Urgency:** High Priority\n• **Active Open Tasks:** 6 tasks assigned across ASI Gujarat Circle & State Archaeology.\n• **Top Priority Action:** Ultrasonic Pulse Velocity non-destructive testing on eastern carved panels within 14 days.\n• **Budget Allocation:** ₹4,85,000 preliminary remediation estimate.\n\nYou can view and export the full CSV/PDF from the **Conservation Reports** tab.`
  }

  if (q.includes("history") || q.includes("story") || q.includes("route") || q.includes("sidi")) {
    return `✨ **Heritage & Architectural Insight:**\n\n${siteContext === "Sidi Saiyyed Mosque" ? 
      "Sidi Saiyyed Mosque was consecrated in 1573 CE. Its world-famous 'Tree of Life' stone jali symbolizes the cosmic tree uniting heaven and earth, carved out of single sandstone slabs with delicate botanical geometry." :
      "Modhera Sun Temple was erected in 1026 CE by King Bhimdev I of the Solanki dynasty. It was designed so that at the equinox, the solar rays illuminate the golden shrine of Surya directly along the astronomical axis."}\n\n**Recommended 30-Minute Route:**\n1. Surya Kund stepped waters (10 mins)\n2. 52-pillared Sabha Mandap (12 mins)\n3. Inner Sanctum astronomical axis (8 mins)`
  }

  if (q.includes("alert") || q.includes("urgent") || q.includes("attention")) {
    return `⚠️ **Current Active Heritage Alerts:**\n\n1. **[Structural - High]** Eastern Façade micro-fracture at Modhera Sun Temple.\n2. **[Encroachment - High]** 85m buffer zone construction scaffolding detected North of Modhera.\n3. **[Visitor - Moderate]** Anticipated 15:30 peak crowd at Sabha Mandap.\n4. **[Moisture - Moderate]** Capillary salt crusting on Surya Kund stepped stone.\n\nAll alerts are synchronized with the ASI Gujarat monitoring workflow.`
  }

  return `🤖 **HeritageGuardian AI (IBM Granite):**\n\nI have analyzed your query regarding *"${query}"* in relation to **${siteContext}**.\n\nOur multi-agent system continuously aggregates:\n• Real-time CV structural condition telemetry\n• Visitor density & wait-time estimates\n• Satellite boundary encroachment alerts\n• Personalized multilingual cultural storytelling\n\nPlease let me know if you would like a detailed conservation report, structural risk assessment, or custom walking route!`
}

export const getMockScenarioA = (siteName = "Modhera Sun Temple", siteId = 1) => ({
  scenario: "Visitor Surge × Structural Vibration Correlation",
  site_name: siteName,
  status: "Completed",
  findings: [
    "Visitor Agent detects 42% sudden footfall spike in Sabha Mandap colonnade.",
    "Structural Agent vibration sensors register 2.8mm/s peak particle velocity.",
    "Orchestrator cross-correlates telemetry and triggers automated visitor rerouting."
  ],
  granite_synthesis: "IBM Granite synthesized multi-agent action: Vibration threshold approaching AS 2187 heritage limit. Dynamic crowd diversion activated to preserve delicate 11th-century sandstone foundation.",
  actions_taken: [
    "Alert sent to on-site ASI security marshals.",
    "Digital signage dynamically reroutes visitor flow toward Surya Kund.",
    "Continuous acoustic emission sensor monitoring activated for 6 hours."
  ]
})

export const getMockScenarioB = (siteName = "Modhera Sun Temple", siteId = 1) => ({
  scenario: "Encroachment Activity × Ground Stress Correlation",
  site_name: siteName,
  status: "Completed",
  findings: [
    "Encroachment Agent flags unauthorized heavy earthmoving machinery 85m from boundary.",
    "Structural Agent observes micro-displacement along northern perimeter boundary wall.",
    "Orchestrator initiates high-priority statutory notification packet."
  ],
  granite_synthesis: "IBM Granite reasoning: Ground compaction machinery vibration correlates with accelerated tensile displacement on northern perimeter wall. Statutory cease-work advisory generated.",
  actions_taken: [
    "Statutory notice drafted under AMASR Act Section 20A.",
    "Automated SMS/Email alert dispatched to Mehsana District Collectorate.",
    "High-frequency displacement monitoring frequency increased from hourly to every 5 mins."
  ]
})

export const getMockSources = () => [
  {
    id: 1,
    name: "Open-Meteo Weather API",
    source_type: "API",
    authority_tier: "TIER_2",
    connection_status: "CONNECTED",
    records_collected: 42,
    failure_count: 0,
    is_active: true,
    last_successful_retrieval: new Date().toISOString(),
    last_attempt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Wikipedia Heritage Records",
    source_type: "REST_API",
    authority_tier: "TIER_3",
    connection_status: "CONNECTED",
    records_collected: 18,
    failure_count: 0,
    is_active: true,
    last_successful_retrieval: new Date().toISOString(),
    last_attempt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Archaeological Survey of India (ASI)",
    source_type: "GOVERNMENT_DATASET",
    authority_tier: "TIER_1",
    connection_status: "CONNECTED",
    records_collected: 85,
    failure_count: 0,
    is_active: true,
    last_successful_retrieval: new Date().toISOString(),
    last_attempt: new Date().toISOString()
  },
  {
    id: 4,
    name: "UNESCO World Heritage Centre",
    source_type: "INSTITUTIONAL_PORTAL",
    authority_tier: "TIER_1",
    connection_status: "RESTRICTED",
    records_collected: 12,
    failure_count: 1,
    is_active: true,
    last_successful_retrieval: new Date(Date.now() - 3600000).toISOString(),
    last_attempt: new Date().toISOString()
  }
]

export const getMockDataRecords = (params = {}) => {
  const records = [
    {
      id: 101,
      site_id: 1,
      site_name: "Modhera Sun Temple",
      data_origin: "EXTERNAL_SOURCE",
      observation_type: "ENVIRONMENTAL_CONDITION",
      observation_date: new Date().toISOString(),
      metric_name: "temperature_c",
      metric_value: 34.2,
      unit: "°C",
      severity: "Moderate",
      confidence_score: 0.98,
      status: "VALIDATED",
      contributing_sources: ["Open-Meteo Weather API"],
      is_consolidated: false,
      has_conflicts: false
    },
    {
      id: 102,
      site_id: 1,
      site_name: "Modhera Sun Temple",
      data_origin: "MANUAL_ENTRY",
      observation_type: "VISITOR_FLOW",
      observation_date: new Date().toISOString(),
      metric_name: "visitor_count",
      metric_value: 410,
      unit: "visitors",
      severity: "High",
      confidence_score: 0.95,
      status: "VALIDATED",
      contributing_sources: ["Manual Entry (Field Officer)"],
      is_consolidated: false,
      has_conflicts: false
    },
    {
      id: 103,
      site_id: 2,
      site_name: "Ahmedabad Walled City",
      data_origin: "EXTERNAL_SOURCE",
      observation_type: "STRUCTURAL_INTEGRITY",
      observation_date: new Date(Date.now() - 7200000).toISOString(),
      metric_name: "crack_width_mm",
      metric_value: 1.8,
      unit: "mm",
      severity: "High",
      confidence_score: 0.92,
      status: "VALIDATED",
      contributing_sources: ["ASI Gujarat Circle Telemetry"],
      is_consolidated: false,
      has_conflicts: false
    },
    {
      id: 104,
      site_id: 1,
      site_name: "Modhera Sun Temple",
      data_origin: "EXTERNAL_SOURCE",
      observation_type: "ENCROACHMENT",
      observation_date: new Date(Date.now() - 10800000).toISOString(),
      metric_name: "encroachment_distance_m",
      metric_value: 85.0,
      unit: "meters",
      severity: "Critical",
      confidence_score: 0.91,
      status: "VALIDATED",
      contributing_sources: ["ISRO Cartosat Satellite Feed"],
      is_consolidated: false,
      has_conflicts: false
    }
  ]

  if (params.origin && params.origin !== "ALL") {
    return records.filter(r => r.data_origin === params.origin)
  }
  return records
}

export const getMockDataQuality = () => ({
  total_records: 157,
  validated_count: 148,
  duplicate_count: 6,
  conflict_count: 2,
  human_review_count: 3,
  origins: {
    EXTERNAL_SOURCE: 112,
    MANUAL_ENTRY: 35,
    IMPORTED_DATA: 10,
    SIMULATED: 0
  },
  quality_score_percent: 94.3,
  evaluation_date: new Date().toISOString()
})

export const getMockAlerts = () => [
  {
    id: 1,
    site_id: 1,
    site_name: "Modhera Sun Temple",
    alert_type: "HIGH_VISITOR_PRESSURE",
    severity: "High",
    title: "Critical Visitor Surge (82.0% Capacity)",
    description: "Current headcount of 410 visitors exceeds 82% of maximum capacity (500). Stagger admissions recommended.",
    detection_method: "DETERMINISTIC_CAPACITY_THRESHOLD",
    recommended_action: "Activate visitor diversion protocol; redirect queue to exterior gardens.",
    human_review_status: "PENDING_REVIEW",
    created_at: new Date().toISOString(),
    evidence: {
      observation_ids: [102],
      current_value: 410,
      max_capacity: 500,
      occupancy_pct: 82.0,
      sources: ["Manual Entry (Field Officer)"],
      calculation: "(410 / 500) * 100 = 82.0%"
    }
  },
  {
    id: 2,
    site_id: 1,
    site_name: "Modhera Sun Temple",
    alert_type: "STATUTORY_BUFFER_ENCROACHMENT",
    severity: "Critical",
    title: "Activity Detected Inside 100m Prohibited Buffer Zone",
    description: "Earthmoving machinery detected 85m from monument boundary (Statutory limit: 100m).",
    detection_method: "DETERMINISTIC_PROXIMITY_BUFFER",
    recommended_action: "Issue Section 20A cease-work statutory notice under AMASR Act 1958.",
    human_review_status: "REQUIRES_HUMAN_REVIEW",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    evidence: {
      observation_ids: [104],
      prohibited_distance_limit_m: 100,
      recorded_distance_m: 85.0,
      breach_margin_m: 15.0,
      sources: ["ISRO Cartosat Satellite Feed"]
    }
  }
]

export const getMockInsights = () => [
  {
    id: 1,
    site_id: 1,
    site_name: "Modhera Sun Temple",
    insight_category: "VISITOR_IMPACT",
    title: "Visitor Load Stability Assessment",
    summary: "Site is operating at 82% capacity. 24-hour rate of change is +14.5%.",
    deterministic_evidence: {
      current_visitors: 410,
      max_capacity: 500,
      occupancy_pct: 82.0,
      sample_count: 12
    },
    granite_reasoning: "IBM Granite Analysis: Visitor distribution reflects elevated localized crowding in Sabha Mandap. Recommend monitoring zone capacity to preserve stone pavement integrity.",
    uncertainty: 0.05,
    priority: "High",
    created_at: new Date().toISOString()
  }
]

