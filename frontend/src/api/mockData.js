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

export const getMockStory = (site = "Modhera Sun Temple", language = "English", ageGroup = "Adult (30-60)") => {
  const stories = {
    English: {
      detailed_story: `Step into the year 1026 CE, where Master Craftsmen commissioned by King Bhimdev I sculpted a celestial alignment in stone.\n\nEvery year on the equinoxes, the rising sun's maiden rays penetrate through the carved corridors of the Sabha Mandap directly into the sanctum sanctorum, bathing the golden icon of Surya in divine radiance.\n\nSurrounding you is the Surya Kund — an inverted stepped pyramid holding 108 miniature shrines, designed not merely for ritual ablutions, but as a sophisticated rainwater harvesting marvel and thermal regulator that cooled the entire sanctuary amidst the harsh arid plains of North Gujarat.\n\nThe Sabha Mandap's 52 intricately carved pillars — one for each week of the solar year — depict dancers, musicians, and celestial beings in a frozen symphony of devotion. Each pillar tells a story of the Solanki dynasty's patronage of art, science, and spiritual philosophy.\n\nAs you walk through the Torana archway, notice the depictions of Vishnu's avatars and the twelve forms of Surya (Adityas), narrating the cosmic journey of the sun across the zodiac. This is not merely a temple — it is a stone encyclopedia of ancient Indian astronomy, mathematics, and architectural genius.`,
      short_story: `Modhera Sun Temple, built in 1026 CE by King Bhimdev I, is a masterpiece of Solanki architecture where the rising equinox sun illuminates the sanctum's Surya idol. The Surya Kund's 108 shrines and Sabha Mandap's 52 carved pillars represent a fusion of astronomy, art, and engineering unmatched in medieval India.`,
      interesting_facts: [
        "Equinoctial solar alignment engineered over 1,000 years ago — the rising sun illuminates the sanctum precisely on the equinoxes.",
        "Surya Kund features 108 miniature shrines arranged in a stepped inverted pyramid, reflecting Vedic astronomical mathematics.",
        "The Sabha Mandap has exactly 52 carved pillars, symbolizing the 52 weeks of the solar year.",
        "The entire structure was built without any cementing mortar — held solely by precision interlocking stone joints.",
        "The intricate Torana gateway depicts all avatars of Vishnu alongside the twelve Adityas (solar deities)."
      ],
      did_you_know: [
        "The step tank water was historically scented with medicinal herbs and camphor, serving both ritual and wellness purposes for pilgrims.",
        "Modhera's architectural precision rivals the astronomical alignments of Stonehenge, yet predates European Gothic cathedrals by over two centuries."
      ],
      visitor_tips: [
        "Visit during the equinoxes (March 20 or September 22) to witness the spectacular solar alignment in the sanctum.",
        "Early morning visits (7-9 AM) offer the best lighting for photography and smaller crowds.",
        "Wear comfortable shoes — the Surya Kund's steep steps require careful navigation.",
        "Carry water and sun protection; the site has limited shade during midday.",
        "The annual Uttarardh Mahotsav (Dance Festival) in January transforms the temple into a stunning cultural venue."
      ],
      walking_route: "Start at the Surya Kund Stepped Reservoir (15 min) → explore the hydraulic engineering and 108 mini-shrines. Proceed to the Sabha Mandap Assembly Hall (20 min) → admire the 52 carved pillars representing weeks of the solar year. Continue to the Garbhagriha Sanctum (15 min) → experience the solar alignment axis and astronomical engineering. End with a meditative walk around the exterior panels (10 min) → study the Torana gateway and zodiac carvings.",
      architecture_highlights: [
        "Surya Kund: Inverted stepped pyramid with 108 shrines — a masterclass in hydraulic and sacred geometry.",
        "Sabha Mandap: 52 ornately carved pillars with scenes of dancers, deities, and celestial beings.",
        "Torana Archway: Depicts the twelve Adityas and Vishnu's avatars in exquisite relief sculpture.",
        "Garbhagriha: Precision-engineered east-facing sanctum designed for equinoctial solar illumination.",
        "Interlocking Stone Construction: Zero mortar — every block held by gravitational precision and geometric joinery."
      ],
      follow_up_questions: [
        "How does Modhera's solar alignment compare to other ancient astronomical sites like Konark or Stonehenge?",
        "What role did the Solanki dynasty play in promoting art and architecture in medieval Gujarat?",
        "How was the Surya Kund's 108-shrine design connected to Vedic mathematics and cosmology?",
        "What conservation challenges does the temple face today, and how are they being addressed?",
        "How did the temple function as a community center beyond its religious purpose?"
      ]
    },
    Gujarati: {
      detailed_story: `ઈ.સ. ૧૦૨૬માં સોલંકી વંશના રાજા ભીમદેવ પહેલા દ્વારા નિર્મિત આ વિશ્વપ્રસિદ્ધ મંદિર ભારતીય ખગોળશાસ્ત્ર અને સ્થાપત્યકળાનો અદ્ભુત સંગમ છે.\n\nવિષુવવૃત્ત (Equinox) ના દિવસે ઉગતા સૂર્યના પ્રથમ કિરણો સભા મંડપમાંથી પસાર થઈ સીધા ગર્ભગૃહમાં સૂર્યદેવની મૂર્તિ પર પડતા હતા. ૧૦૮ લઘુ મંદિરોથી શોભતો સૂર્યકુંડ જળસંચય અને સૌંદર્યનું બેનમૂન ઉદાહરણ છે.\n\nસભા મંડપના ૫૨ અદ્ભુત કોતરણીવાળા સ્તંભો — સૌર વર્ષના ૫૨ અઠવાડિયાનું પ્રતિનિધિત્વ કરે છે — નૃત્યાંગનાઓ, દેવતાઓ અને અપ્સરાઓના દ્રશ્યો દર્શાવે છે. દરેક સ્તંભ સોલંકી રાજવંશની કળા, વિજ્ઞાન અને આધ્યાત્મિક ફિલસૂફીની કથા કહે છે.\n\nતોરણ દ્વાર પરથી પસાર થતા, વિષ્ણુના અવતારો અને સૂર્યના બાર સ્વરૂપો (આદિત્યો) ના શિલ્પો જુઓ, જે રાશિચક્ર પર સૂર્યની બ્રહ્માંડીય યાત્રા વર્ણવે છે.`,
      short_story: `મોઢેરા સૂર્ય મંદિર, ઈ.સ. ૧૦૨૬માં રાજા ભીમદેવ I દ્વારા નિર્મિત, સોલંકી સ્થાપત્યનો ઉત્કૃષ્ટ નમૂનો છે જ્યાં વિષુવવૃત્ત પર ઉગતો સૂર્ય ગર્ભગૃહમાં સૂર્યદેવની મૂર્તિને પ્રકાશિત કરે છે.`,
      interesting_facts: [
        "૧૦૦૦ વર્ષ જૂનું સૂર્ય-કેન્દ્રિત ખગોળીય સ્થાપત્ય — વિષુવવૃત્ત પર સૂર્ય ગર્ભગૃહને ચોક્કસ રીતે પ્રકાશિત કરે છે.",
        "૧૦૮ નાના મંદિરો ધરાવતો ભવ્ય સૂર્યકુંડ વૈદિક ખગોળ ગણિતનું પ્રતિબિંબ છે.",
        "સભા મંડપમાં ચોક્કસ ૫૨ કોતરણીવાળા સ્તંભો છે, જે સૌર વર્ષના ૫૨ અઠવાડિયા દર્શાવે છે.",
        "સિમેન્ટ કે ચૂના વગર માત્ર પથ્થરોના ઇન્ટરલોકિંગથી સમગ્ર નિર્માણ થયું છે."
      ],
      did_you_know: [
        "સભા મંડપના ૫૨ સ્તંભો વર્ષના ૫૨ અઠવાડિયા દર્શાવે છે.",
        "આ મંદિર શિલ્પ અને ગણિતનું વિશ્વકક્ષાનું પ્રતીક છે."
      ],
      visitor_tips: [
        "વિષુવવૃત્ત (માર્ચ ૨૦ અથવા સપ્ટેમ્બર ૨૨) ના દિવસે મુલાકાત લો.",
        "સવારે ૭-૯ વાગ્યાની વચ્ચે ફોટોગ્રાફી માટે શ્રેષ્ઠ પ્રકાશ મળે છે.",
        "આરામદાયક પગરખાં પહેરો — સૂર્યકુંડના ઊંચા પગથિયાં સાવચેતી માગે છે."
      ],
      walking_route: "સૂર્યકુંડ પગથિયાંથી શરૂ કરો (૧૫ મિનિટ) → જળસંચય અને શિલ્પો જુઓ. સભા મંડપ તરફ આગળ વધો (૨૦ મિનિટ) → ૫૨ કલાત્મક સ્તંભોનું અવલોકન કરો. ગર્ભગૃહ પરિક્રમા (૧૫ મિનિટ) → સૂર્ય કિરણ માર્ગ અનુભવો.",
      architecture_highlights: [
        "સૂર્યકુંડ: ૧૦૮ લઘુ મંદિરો સાથે ઊલટા પિરામિડ આકારનો ભવ્ય કુંડ.",
        "સભા મંડપ: ૫૨ અલંકૃત સ્તંભો — નૃત્ય, સંગીત અને દેવતાઓના દ્રશ્યો.",
        "ગર્ભગૃહ: વિષુવવૃત્ત સૌર પ્રકાશ માટે ચોક્કસ એન્જિનિયરિંગ."
      ],
      follow_up_questions: [
        "મોઢેરાનું સૌર સંરેખણ કોણાર્ક કે સ્ટોનહેન્જ જેવા અન્ય પ્રાચીન ખગોળીય સ્થળો સાથે કેવી રીતે સરખામણી કરી શકાય?",
        "મધ્યયુગીન ગુજરાતમાં કળા અને સ્થાપત્યને પ્રોત્સાહન આપવામાં સોલંકી વંશની ભૂમિકા શું હતી?",
        "આજે મંદિરને કયા સંરક્ષણ પડકારોનો સામનો કરવો પડે છે?"
      ]
    },
    Hindi: {
      detailed_story: `१०२६ ईस्वी में सोलंकी वंश के पराक्रमी राजा भीमदेव प्रथम द्वारा निर्मित मोढेरा सूर्य मंदिर प्राचीन भारतीय स्थापत्य और खगोल विज्ञान का अनुपम शिखर है।\n\nवर्ष में दो बार विषुव (Equinox) के दिन उदीयमान सूर्य की पहली किरणें सभा मंडप के स्तंभों के बीच से होकर गर्भगृह में विराजित सूर्य प्रतिमा को आलोकित करती हैं। सूर्य कुंड के १०८ लघु मंदिर वैदिक ज्यामिति का साक्षात प्रमाण हैं।\n\nसभा मंडप के ५२ अलंकृत स्तंभ — सौर वर्ष के ५२ सप्ताहों का प्रतिनिधित्व करते हैं — नर्तकियों, देवताओं और अप्सराओं के दृश्यों से सज्जित हैं। प्रत्येक स्तंभ सोलंकी राजवंश की कला, विज्ञान और आध्यात्मिक दर्शन की गाथा कहता है।\n\nतोरण द्वार से गुजरते हुए, विष्णु के अवतारों और सूर्य के बारह रूपों (आदित्यों) की मूर्तियों को देखें, जो राशि चक्र पर सूर्य की ब्रह्मांडीय यात्रा का वर्णन करती हैं।`,
      short_story: `मोढेरा सूर्य मंदिर, १०२६ ई. में राजा भीमदेव प्रथम द्वारा निर्मित, सोलंकी वास्तुकला की उत्कृष्ट कृति है जहाँ विषुव पर उगता सूर्य गर्भगृह में सूर्य प्रतिमा को आलोकित करता है।`,
      interesting_facts: [
        "१०२६ ई. की सौर-संरेखित वास्तुकला — विषुव पर सूर्य गर्भगृह को सटीक रूप से आलोकित करता है।",
        "सूर्य कुंड में १०८ लघु देवालय — वैदिक गणित और ब्रह्मांड विज्ञान का प्रतिबिंब।",
        "५२ नक्काशीदार स्तंभ जो सौर वर्ष के ५२ सप्ताह दर्शाते हैं।",
        "बिना किसी चूने या गारे के, केवल इंटरलॉकिंग पत्थरों से निर्मित।"
      ],
      did_you_know: [
        "सूर्य कुंड प्राचीन भारत का उत्कृष्ट जल संरक्षण तंत्र है।",
        "मोढेरा की वास्तुकला स्टोनहेंज की खगोलीय सटीकता की प्रतिद्वंद्वी है, फिर भी यूरोपीय गोथिक कैथेड्रल से दो शताब्दी पुरानी है।"
      ],
      visitor_tips: [
        "विषुव (२० मार्च या २२ सितंबर) के दिन गर्भगृह में शानदार सौर संरेखण देखने जाएँ।",
        "सुबह ७-९ बजे के बीच फोटोग्राफी के लिए सर्वोत्तम प्रकाश मिलता है।",
        "आरामदायक जूते पहनें — सूर्य कुंड की खड़ी सीढ़ियों पर सावधानी ज़रूरी है।"
      ],
      walking_route: "सूर्य कुंड से शुरू करें (१५ मिनट) → सीढ़ीदार कुंड एवं लघु मंदिर देखें। सभा मंडप की ओर बढ़ें (२० मिनट) → ५२ नक्काशीदार स्तंभों का अवलोकन करें। गर्भगृह (१५ मिनट) → सौर संरेखण एवं गर्भगृह पीठ का अनुभव करें।",
      architecture_highlights: [
        "सूर्य कुंड: १०८ लघु मंदिरों सहित उल्टे पिरामिड आकार का भव्य कुंड।",
        "सभा मंडप: ५२ अलंकृत स्तंभ — नृत्य, संगीत और देवताओं के दृश्य।",
        "गर्भगृह: विषुव सौर प्रकाश के लिए सटीक इंजीनियरिंग।"
      ],
      follow_up_questions: [
        "मोढेरा का सौर संरेखण कोणार्क या स्टोनहेंज जैसे अन्य प्राचीन खगोलीय स्थलों की तुलना में कैसा है?",
        "मध्यकालीन गुजरात में कला और वास्तुकला को बढ़ावा देने में सोलंकी वंश की क्या भूमिका थी?",
        "आज मंदिर को किन संरक्षण चुनौतियों का सामना है?"
      ]
    }
  }

  const selectedStory = stories[language] || stories.English
  return {
    site_name: site,
    powered_by: "IBM Granite 3.0 Cultural LLM",
    visitor_profile: {
      age_group: ageGroup,
      language: language,
      duration_minutes: 60,
      interests: ["Architecture", "History"]
    },
    detailed_story: selectedStory.detailed_story,
    short_story: selectedStory.short_story,
    interesting_facts: selectedStory.interesting_facts,
    did_you_know: selectedStory.did_you_know,
    visitor_tips: selectedStory.visitor_tips,
    walking_route: selectedStory.walking_route,
    architecture_highlights: selectedStory.architecture_highlights,
    follow_up_questions: selectedStory.follow_up_questions,
    disclaimer: "This narrative is generated by IBM Granite AI for educational and cultural enrichment. Verify historical details with authoritative sources like ASI publications."
  }
}

export const getMockConservationReport = (siteId = 1) => {
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

