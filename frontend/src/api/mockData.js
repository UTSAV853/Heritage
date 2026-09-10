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
      title: "Solanki Splendor: The Solar Symphony of Modhera",
      narrative: `Step into the year 1026 CE, where Master Craftsmen commissioned by King Bhimdev I sculpted a celestial alignment in stone.\n\nEvery year on the equinoxes, the rising sun's maiden rays penetrate through the carved corridors of the Sabha Mandap directly into the sanctum sanctorum, bathing the golden icon of Surya in divine radiance.\n\nSurrounding you is the Surya Kund — an inverted stepped pyramid holding 108 miniature shrines, designed not merely for ritual ablutions, but as a sophisticated rainwater harvesting marvel and thermal regulator that cooled the entire sanctuary amidst the harsh arid plains of North Gujarat.`,
      highlights: [
        "Equinoctial solar alignment engineered 1,000 years ago",
        "Surya Kund with 108 micro-shrines reflecting Vedic astronomical mathematics",
        "Intricate Torana gateway depicting the avatars of Vishnu and solar deities"
      ],
      fun_facts: [
        "Built without any cementing mortar — held solely by precision interlocking stone joints.",
        "The step tank water was historically scented with medicinal herbs and camphor for pilgrimage wellness."
      ],
      walking_route: [
        { stop: 1, name: "Surya Kund Stepped Reservoir", time: "15 mins", focus: "Hydraulic engineering & mini-shrines" },
        { stop: 2, name: "Sabha Mandap (Assembly Hall)", time: "20 mins", focus: "52 carved pillars representing weeks of solar year" },
        { stop: 3, name: "Garbhagriha (Sanctum)", time: "15 mins", focus: "Solar alignment and astronomical axis" }
      ]
    },
    Gujarati: {
      title: "મોઢેરા સૂર્ય મંદિર: ગુજરાતનું અજોડ સ્થાપત્ય ગૌરવ",
      narrative: `ઈ.સ. ૧૦૨૬માં સોલંકી વંશના રાજા ભીમદેવ પહેલા દ્વારા નિર્મિત આ વિશ્વપ્રસિદ્ધ મંદિર ભારતીય ખગોળશાસ્ત્ર અને સ્થાપત્યકળાનો અદ્ભુત સંગમ છે.\n\nવિષુવવૃત્ત (Equinox) ના દિવસે ઉગતા સૂર્યના પ્રથમ કિરણો સભા મંડપમાંથી પસાર થઈ સીધા ગર્ભગૃહમાં સૂર્યદેવની મૂર્તિ પર પડતા હતા. ૧૦૮ લઘુ મંદિરોથી શોભતો સૂર્યકુંડ જળસંચય અને સૌંદર્યનું બેનમૂન ઉદાહરણ છે.`,
      highlights: [
        "૧૦૦૦ વર્ષ જૂનું સૂર્ય-કેન્દ્રિત ખગોળીય સ્થાપત્ય",
        "૧૦૮ નાના મંદિરો ધરાવતો ભવ્ય સૂર્યકુંડ",
        "સિમેન્ટ કે ચૂના વગર માત્ર પથ્થરોના ઇન્ટરલોકિંગથી નિર્માણ"
      ],
      fun_facts: [
        "સભા મંડપના ૫૨ સ્તંભો વર્ષના ૫૨ અઠવાડિયા દર્શાવે છે.",
        "આ મંદિર શિલ્પ અને ગણિતનું વિશ્વકક્ષાનું પ્રતીક છે."
      ],
      walking_route: [
        { stop: 1, name: "સૂર્યકુંડ પગથિયાં", time: "૧૫ મિનિટ", focus: "જળસંચય અને શિલ્પો" },
        { stop: 2, name: "સભા મંડપ", time: "૨૦ મિનિટ", focus: "૫૨ કલાત્મક સ્તંભો" },
        { stop: 3, name: "ગર્ભગૃહ પરિક્રમા", time: "૧૫ મિનિટ", focus: "સૂર્ય કિરણ માર્ગ" }
      ]
    },
    Hindi: {
      title: "मोढेरा सूर्य मंदिर: भारत की अमर सौर धरोहर",
      narrative: `१०२६ ईस्वी में सोलंकी वंश के पराक्रमी राजा भीमदेव प्रथम द्वारा निर्मित मोढेरा सूर्य मंदिर प्राचीन भारतीय स्थापत्य और खगोल विज्ञान का अनुपम शिखर है।\n\nवर्ष में दो बार विषुव (Equinox) के दिन उदीयमान सूर्य की पहली किरणें सभा मंडप के स्तंभों के बीच से होकर गर्भगृह में विराजित सूर्य प्रतिमा को आलोकित करती हैं। सूर्य कुंड के १०८ लघु मंदिर वैदिक ज्यामिति का साक्षात प्रमाण हैं।`,
      highlights: [
        "१०२६ ई. की सौर-संरेखित वास्तुकला",
        "सूर्य कुंड और १०८ लघु देवालय",
        "५२ नक्काशीदार स्तंभ जो सौर वर्ष के ५२ सप्ताह दर्शाते हैं"
      ],
      fun_facts: [
        "बिना किसी चूने या गारे के, केवल इंटरलॉकिंग पत्थरों से निर्मित।",
        "सूर्य कुंड प्राचीन भारत का उत्कृष्ट जल संरक्षण तंत्र है।"
      ],
      walking_route: [
        { stop: 1, name: "सूर्य कुंड", time: "१५ मिनट", focus: "सीढ़ीदार कुंड एवं लघु मंदिर" },
        { stop: 2, name: "सभा मंडप", time: "२० मिनट", focus: "५२ नक्काशीदार स्तंभ" },
        { stop: 3, name: "गर्भगृह", time: "१५ मिनट", focus: "सौर संरेखण एवं गर्भगृह पीठ" }
      ]
    }
  }

  const selectedStory = stories[language] || stories.English
  return {
    site_name: site,
    language,
    age_group: ageGroup,
    story: selectedStory.narrative,
    title: selectedStory.title,
    highlights: selectedStory.highlights,
    fun_facts: selectedStory.fun_facts,
    walking_route: selectedStory.walking_route,
    powered_by: "IBM Granite 3.0 Cultural LLM"
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
    authorized_signoff: "AI Multi-Agent Synthesis · IBM Granite Engine"
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
