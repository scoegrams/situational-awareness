// ─────────────────────────────────────────────────────────────────────────────
// TWO DATA ERAS
//
//  ERA "2024" — essay thesis picks (Leopold's "exercise for the reader", fn.26)
//  ERA "2026" — actual 13F filings of Situational Awareness LP (Feb 2026)
//               Source: Fortune profile, Feb 2026
//               $5.5B AUM, ~30 holdings
//               Key shift: electricity + compute capacity over model builders
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
  CHIPS:       { label: 'Chips & GPUs',          color: '#76b900', lightColor: '#3a6300' },
  POWER:       { label: 'Power & Energy',         color: '#ffd700', lightColor: '#7c4a00' },
  HYPERSCALER: { label: 'Hyperscalers / Cloud',   color: '#00a4ef', lightColor: '#005f8a' },
  NETWORKING:  { label: 'Networking & Infra',     color: '#c77dff', lightColor: '#6a2da0' },
  INFRA:       { label: 'Datacenter Hardware',    color: '#ff9f43', lightColor: '#7a3c00' },
  COMPUTE:     { label: 'Compute / AI Cloud',     color: '#00e5ff', lightColor: '#005f7a' },
  MINING:      { label: 'Crypto → AI Compute',   color: '#ff9f43', lightColor: '#7a3c00' },
  ETF:         { label: 'ETF / Index',            color: '#a0a0a0', lightColor: '#555555' },
}

// ─── 2024 ESSAY PICKS ─────────────────────────────────────────────────────────
// Derived from "Situational Awareness" essay IIIa footnote 26 and surrounding text
export const PICKS_2024 = [

  // ── CHIPS ──────────────────────────────────────────────────────────────────
  {
    ticker: 'NVDA',
    name: 'Nvidia',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'compute_scaling', 'oom_compute'],
    chapterRef: 'IIIa',
    color: '#76b900',
    status: 'IN',
    conviction: 10,
    timeframe: 'long',
    signal: 'Directly named in essay fn.26. Blackwell ramp exceeding all forecasts. Thesis fully intact.',
    risk: 'Export controls expand; AMD/custom ASICs capture >30% share.',
    catalysts: ['Blackwell GB200 NVL72 shipments', 'Rubin architecture reveal'],
    thesis:
      'Nvidia datacenter revenue exploded from ~$14B to ~$90B annualized in one year. ' +
      'Aschenbrenner\'s OOM tables show H100-equivalent demand growing 100x by 2030. ' +
      '"Mainstream analysts assume only 10-20% YoY growth… Insane! It\'s been pretty obvious ' +
      'for a while that Nvidia is going to do over $200B of revenue in CY25."',
    quote: '"NVDA/TSM… it\'s still not even close to fully priced in." — fn.26',
  },
  {
    ticker: 'TSM',
    name: 'TSMC',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'us_china_competition'],
    chapterRef: 'IIIa',
    color: '#e53935',
    status: 'IN',
    conviction: 9,
    timeframe: 'long',
    signal: 'Directly named in essay fn.26. CoWoS doubling; N2 node ramping on schedule.',
    risk: 'Taiwan military contingency — physically irreplaceable if conflict occurs.',
    catalysts: ['CoWoS capacity ramp', 'N2 node ramp 2025', 'Arizona Fab 21 Phase 2'],
    thesis:
      'TSMC manufactures virtually all frontier AI chips. "TSMC would need to build dozens of Gigafabs… ' +
      'it could add up to over $1T of capex." Taiwan contingency is the single biggest AI supply chain risk.',
    quote: '"If having chip production abroad is like having uranium deposits abroad…"',
  },
  {
    ticker: 'AMD',
    name: 'AMD',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#ed1c24',
    status: 'WATCH',
    conviction: 6,
    timeframe: 'medium',
    signal: 'MI300X gaining traction but execution risk on roadmap. CUDA moat is real.',
    risk: 'Nvidia\'s CUDA moat is a 10-year lead. Hyperscaler custom ASICs compete directly.',
    catalysts: ['MI350 shipments', 'Microsoft/Meta MI300X deployment scale'],
    thesis:
      '"AMD forecasted a $400B AI accelerator market by 2027, implying $700B+ of total AI spending." ' +
      'MI300X is the only serious competitor to Nvidia at scale.',
    quote: '"AMD forecasted a $400B AI accelerator market by 2027."',
  },
  {
    ticker: 'AVGO',
    name: 'Broadcom',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#cc0000',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'Custom ASIC TAM expanding. Google/Meta ASIC programs ramping. VMware software moat.',
    risk: 'Hyperscalers may consolidate ASIC design in-house over 3-5 year horizon.',
    catalysts: ['Google TPU v7 ramp', 'Meta MTIA scale-out'],
    thesis:
      'Broadcom is the custom ASIC king — Google\'s TPU, Meta\'s MTIA rely on Broadcom IP. ' +
      'As hyperscalers build proprietary AI accelerators, Broadcom\'s ethernet networking and ASIC design ' +
      'becomes the connective tissue of the AI datacenter stack.',
    quote: '"Google\'s TPUs are great too!" — IIIa',
  },
  {
    ticker: 'MRVL',
    name: 'Marvell Technology',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#ff4081',
    status: 'WATCH',
    conviction: 6,
    timeframe: 'medium',
    signal: 'Optical DSP and custom silicon pipeline strong but revenue lags thesis.',
    risk: 'Concentration risk in 2-3 hyperscaler customers; program delays outsized impact.',
    catalysts: ['Amazon custom ASIC ramp', 'Optical interconnect adoption'],
    thesis:
      'Marvell is a key custom silicon and optical interconnect play. As cluster sizes grow, ' +
      'intra-cluster networking becomes a critical bottleneck. Marvell\'s PCIe retimers and optical DSPs ' +
      'put it directly in the path of the trillion-dollar cluster buildout.',
    quote: '"The trillion-dollar cluster will be a truly extraordinary effort." — IIIa',
  },

  // ── POWER ───────────────────────────────────────────────────────────────
  {
    ticker: 'CEG',
    name: 'Constellation Energy',
    category: 'POWER',
    graphNodes: ['energy_supply', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#7ecef4',
    status: 'IN',
    conviction: 9,
    timeframe: 'long',
    signal: 'Three Mile Island restart confirmed. Microsoft 20yr PPA signed. Nuclear renaissance.',
    risk: 'Regulatory reversal; rate cases challenge long-term PPA economics.',
    catalysts: ['Three Mile Island restart', 'New nuclear PPA announcements'],
    thesis:
      '"Power has become the binding constraint: there simply isn\'t much spare capacity." ' +
      'Microsoft restarted Three Mile Island for AI datacenters. Nuclear provides always-on baseload. ' +
      'Constellation is the largest US nuclear operator.',
    quote: '"Power has become the binding constraint." — IIIa',
  },
  {
    ticker: 'VST',
    name: 'Vistra Energy',
    category: 'POWER',
    graphNodes: ['energy_supply', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#f9ca24',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'Nuclear + gas fleet positioned perfectly. Texas AI datacenter corridor.',
    risk: 'Merchant power pricing volatility; ERCOT grid stress events.',
    catalysts: ['New datacenter power contracts', 'Texas grid capacity auctions'],
    thesis:
      'Vistra operates nuclear and natural gas fleet — exactly the combination to power the AGI buildout. ' +
      'Texas presence puts it at the heart of the US datacenter belt.',
    quote: '"Securing power, land, permitting, and datacenter construction." — IIIa',
  },
  {
    ticker: 'GEV',
    name: 'GE Vernova',
    category: 'POWER',
    graphNodes: ['energy_supply', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#1a73e8',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'Gas turbine backlog at record highs. AI datacenter orders accelerating.',
    risk: 'Supply chain constraints; carbon regulation could restrict gas builds.',
    catalysts: ['Gas turbine order backlog disclosures', 'H-class turbine deliveries'],
    thesis:
      'GE Vernova makes the gas turbines that physically power the AGI clusters. ' +
      '"Combined cycle plants can be built in about two years." Dominant manufacturer.',
    quote: '"$100B of capex for 100GW of natural gas power plants." — IIIa',
  },
  {
    ticker: 'BE',
    name: 'Bloom Energy',
    category: 'POWER',
    graphNodes: ['energy_supply', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#00bcd4',
    status: 'WATCH',
    conviction: 7,
    timeframe: 'medium',
    signal: 'Fuel cell orders from SK, Samsung rising. Grid bypass narrative gaining traction.',
    risk: 'Cost per kW still higher than grid power; profitable at GW scale unproven.',
    catalysts: ['Hyperscaler fuel cell contract', 'Cost reduction milestones'],
    thesis:
      'Bloom Energy solid-oxide fuel cells generate electricity on-site — eliminating grid dependency. ' +
      'As hyperscalers race to power 1GW+ campuses that can\'t wait for grid connections, ' +
      'Bloom\'s on-site generation becomes a critical unlock.',
    quote: '"Power contracts are usually long-term locked-in." — IIIa',
  },

  // ── HYPERSCALERS ──────────────────────────────────────────────────────
  {
    ticker: 'MSFT',
    name: 'Microsoft',
    category: 'HYPERSCALER',
    graphNodes: ['compute_scaling', 'capital_allocation', 'research_automation'],
    chapterRef: 'IIIa',
    color: '#00a4ef',
    status: 'IN',
    conviction: 9,
    timeframe: 'long',
    signal: 'Azure AI growing 157% YoY. Copilot adoption. $10T thesis on track.',
    risk: 'OpenAI relationship fraying; regulatory antitrust on AI products.',
    catalysts: ['Azure AI revenue', 'Copilot seat growth', 'Stargate $500B commitment'],
    thesis:
      '"Could you get a third of [350M Office subscribers] to pay $100/month for an AI add-on?" ' +
      'AI revenue could hit $100B run rate by mid-2026, making MSFT potentially the first $10T company.',
    quote: '"We might see our first $10T company soon thereafter." — IIIa',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet',
    category: 'HYPERSCALER',
    graphNodes: ['compute_scaling', 'capital_allocation', 'research_automation'],
    chapterRef: 'IIIa',
    color: '#fbbc04',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'Gemini competitive. Cloud AI revenue inflecting. TPU cost advantage deepening.',
    risk: 'Search disruption from AI competitors; regulatory breakup risk.',
    catalysts: ['Google Cloud AI revenue', 'TPU v7 production'],
    thesis:
      '"Google\'s TPUs are great too." Google controls search, YouTube, Cloud, and DeepMind. ' +
      'Most likely alongside Microsoft to reach $100B AI revenue run rate.',
    quote: '"AI products the biggest revenue driver for America\'s largest corporations." — IIIa',
  },
  {
    ticker: 'META',
    name: 'Meta',
    category: 'HYPERSCALER',
    graphNodes: ['compute_scaling', 'research_automation'],
    chapterRef: 'IIIa',
    color: '#0866ff',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'Llama 4 competitive with GPT. AI ad revenue +$10B. 1.1M GPUs deployed.',
    risk: 'Regulatory action on data practices.',
    catalysts: ['Llama 4 performance', 'AI ad revenue disclosure'],
    thesis:
      '"Zuck bought 350k H100s." Meta spending ~$40B+ capex. Open-source Llama embeds AI at 3B+ MAU.',
    quote: '"Zuck bought 350k H100s." — IIIa',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon',
    category: 'HYPERSCALER',
    graphNodes: ['compute_scaling', 'capital_allocation', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#ff9900',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'AWS AI revenue >50% YoY. 1GW nuclear campus operational. Trainium 3 on roadmap.',
    risk: 'AWS margin compression from AI capex.',
    catalysts: ['AWS Q1 AI revenue', 'Trainium 3 availability'],
    thesis:
      '"Amazon bought a 1GW datacenter campus next to a nuclear power plant." ' +
      'AWS is the default cloud for AI startups — Anthropic, Perplexity, and more.',
    quote: '"Amazon bought a 1GW datacenter campus next to a nuclear power plant." — IIIa',
  },

  // ── NETWORKING ────────────────────────────────────────────────────────
  {
    ticker: 'ANET',
    name: 'Arista Networks',
    category: 'NETWORKING',
    graphNodes: ['compute_scaling', 'capital_allocation'],
    chapterRef: 'IIIa',
    color: '#ff6b35',
    status: 'IN',
    conviction: 8,
    timeframe: 'long',
    signal: 'AI ethernet switching orders surging. Microsoft and Meta deploying at scale.',
    risk: 'Nvidia InfiniBand dominates training clusters; ethernet share in AI training unproven.',
    catalysts: ['Ultra Ethernet Consortium adoption', 'Q2 datacenter revenue'],
    thesis:
      'Arista is the dominant ethernet networking vendor for hyperscale AI datacenters. ' +
      'As clusters scale from 10k to 1M GPUs, the switching fabric becomes as important as the GPUs.',
    quote: '"Finding 10GW… securing power, land, permitting." — IIIa',
  },
  {
    ticker: 'VRT',
    name: 'Vertiv Holdings',
    category: 'NETWORKING',
    graphNodes: ['compute_scaling', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#e91e63',
    status: 'IN',
    conviction: 9,
    timeframe: 'long',
    signal: 'Liquid cooling backlog 3x YoY. Every new AI datacenter is a Vertiv customer.',
    risk: 'Supply chain constraints; margin pressure from competition.',
    catalysts: ['Liquid cooling revenue', 'Blackwell rack deployments'],
    thesis:
      'Vertiv makes cooling and power distribution that keeps GPU clusters running. ' +
      'At 1M H100-equivalents, that\'s 1.4GW of heat to remove.',
    quote: '"1,400W per H100 including datacenter power." — IIIa',
  },
  {
    ticker: 'ETN',
    name: 'Eaton Corporation',
    category: 'NETWORKING',
    graphNodes: ['compute_scaling', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#9c27b0',
    status: 'IN',
    conviction: 7,
    timeframe: 'long',
    signal: 'Data center segment growing 25%+ YoY. Electrical backlog at record.',
    risk: 'More diversified than Vertiv; slower pure-play AI upside.',
    catalysts: ['Q1 datacenter orders', 'Grid modernization contracts'],
    thesis:
      'Eaton is the power management backbone of every hyperscale datacenter — UPS, PDUs, busways. ' +
      'Every watt flowing into AI datacenters passes through Eaton equipment.',
    quote: '"The trillion-dollar cluster alone would require ~20% of US electricity." — IIIa',
  },
  {
    ticker: 'SMCI',
    name: 'Super Micro Computer',
    category: 'INFRA',
    graphNodes: ['gpu_manufacturing', 'compute_scaling', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#4caf50',
    status: 'WATCH',
    conviction: 5,
    timeframe: 'short',
    signal: 'Accounting concerns create governance risk. Thesis intact but watch closely.',
    risk: 'SEC investigation; auditor issues; Nvidia could shift volume to Dell/HPE.',
    catalysts: ['Auditor appointment', 'Blackwell server ramp', 'DOJ/SEC outcome'],
    thesis:
      'SuperMicro builds server platforms GPUs plug into. Fastest time-to-market for new Nvidia generations.',
    quote: '"Churning out 100s of millions of GPUs per year overall." — IIIa',
  },
  {
    ticker: 'EQIX',
    name: 'Equinix',
    category: 'INFRA',
    graphNodes: ['compute_scaling', 'capital_allocation'],
    chapterRef: 'IIIa',
    color: '#ff5722',
    status: 'WATCH',
    conviction: 6,
    timeframe: 'medium',
    signal: 'AI driving colo demand but hyperscalers building own campuses at scale.',
    risk: 'Hyperscalers bypass colo for owned campuses. Power cost inflation.',
    catalysts: ['AI interconnection revenue', 'New xScale campus builds'],
    thesis:
      'Equinix owns 260+ datacenters in 71 metros. Existing real estate nearly impossible to replicate quickly.',
    quote: '"It\'s finding the infrastructure itself." — IIIa',
  },
]

// ─── 2026 FUND HOLDINGS ───────────────────────────────────────────────────────
// Source: Situational Awareness LP 13F filing, Feb 2026 (actual filing data)
// Reported by Fortune (Feb 2026 profile of Aschenbrenner)
// $5.5B AUM, ~30 holdings
//
// ── TOP 10 POSITIONS (exact from 13F) ────────────────────────────────────────
// Rank  Issuer               Type    Reported Value      Shares
//  1    INTEL CORP           Call    $678,964,770        20,237,400
//  2    COREWEAVE INC        Common  $563,200,154         4,115,456
//  3    CORE SCIENTIFIC INC  Common  $362,038,780        20,180,534
//  4    IREN LIMITED         Common  $338,854,358         7,220,421
//  5    COREWEAVE INC        Call    $316,739,325         2,314,500
//  6    NVIDIA CORPORATION   Put     $298,528,000         1,600,000  ← SHORT/HEDGE
//  7    VISTRA CORP          Common  $252,327,327         1,287,910
//  8    VANECK ETF (SMH)     Put     $195,816,000           600,000  ← SHORT/HEDGE
//  9    COREWEAVE INC        Put     $191,590,000         1,400,000  ← HEDGE
// 10    APPLIED DIGITAL      Common  $139,111,716         6,064,155
//
// KEY READ: INTC is a leveraged CALL bet. NVDA & SMH are PUTS (hedged/short).
// CRWV appears 3x — long common + long call + put hedge = net very long CRWV.
// THESIS: electricity + compute capacity beats model builders.
export const PICKS_2026 = [

  // ── #1 LARGEST: INTEL CORP — CALL ($679M) ──────────────────────────────
  {
    ticker: 'INTC',
    name: 'Intel',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#0071c5',
    positionType: 'CALL',
    rank13F: 1,
    reportedValue: '$678,964,770',
    shareCount: '20,237,400',
    status: 'IN',
    conviction: 9,
    timeframe: 'long',
    fundNote: '🏆 #1 LARGEST HOLDING — $679M Call Options (13F, Feb 2026)',
    signal: 'Massive leveraged CALL bet — largest position in the fund. Intel 18A node + US fab thesis. Contrarian conviction.',
    risk: 'Intel foundry execution risk; Gaudi AI GPU adoption minimal vs Nvidia; balance sheet stress.',
    catalysts: ['Intel 18A node tape-out results', 'CHIPS Act foundry subsidies', 'Gaudi 3/4 hyperscaler wins', 'Potential split of foundry/products'],
    thesis:
      'Intel is the fund\'s #1 LARGEST position — held via call options at $679M notional. ' +
      'This is a leveraged bet, not passive exposure. ' +
      'The thesis: Intel\'s 18A process node could emerge as a TSMC alternative, directly addressing ' +
      'Aschenbrenner\'s concern about US semiconductor sovereignty. ' +
      '"We should prioritize democratic allies for fab projects." ' +
      'Intel Foundry also builds Gaudi AI accelerators — export-control-safe alternatives to Nvidia ' +
      'for markets where H100s are restricted. A successful turnaround could unlock enormous value ' +
      'and reduce the US\'s dangerous dependency on Taiwanese fabs.',
    quote: '"We should prioritize democratic allies for fab projects." — IIIa',
  },

  // ── #2 + #5 + #9: COREWEAVE — Common + Call + Put ($1.07B combined) ────
  {
    ticker: 'CRWV',
    name: 'CoreWeave',
    category: 'COMPUTE',
    graphNodes: ['compute_scaling', 'capital_allocation'],
    chapterRef: 'IIIa',
    color: '#00e5ff',
    positionType: 'LONG + OPTIONS',
    rank13F: 2,
    reportedValue: '$1,071,529,479',
    shareCount: '7,829,956 + options',
    status: 'IN',
    conviction: 10,
    timeframe: 'medium',
    fundNote: '⚡ #2/#5/#9 COMBINED — $1.07B total (Common + Call + Put hedge) — Net maximum long',
    signal: 'Largest single-name exposure when combining common + call + put. Complex options structure = maximum conviction with tail hedge.',
    risk: 'Customer concentration (Microsoft ~60% of revenue); GPU lease model creates balance sheet risk.',
    catalysts: ['Quarterly revenue growth', 'New hyperscaler contracts beyond Microsoft', 'Blackwell cluster expansion', 'Profitability timeline'],
    thesis:
      'CoreWeave is the fund\'s most complex position: $563M common stock (#2), $317M calls (#5), $192M puts (#9) — ' +
      '$1.07B combined notional, making it effectively the fund\'s biggest single-name bet. ' +
      'The puts likely hedge downside, while common + calls express maximum upside conviction. ' +
      'CoreWeave is an AI-native cloud that leases Nvidia GPU capacity — ' +
      'pure-play on the thesis that whoever controls compute capacity wins. ' +
      'Microsoft is anchor customer; OpenAI, Cohere, and others run on CoreWeave. ' +
      '"The most valuable assets in the AI era may not be algorithms, but electricity and computing power."',
    quote: '"The real bottlenecks in the AI boom will be electricity generation and computing capacity." — Fortune, 2026',
  },

  // ── #3: CORE SCIENTIFIC — Common ($362M) ───────────────────────────────
  {
    ticker: 'CORZ',
    name: 'Core Scientific',
    category: 'MINING',
    graphNodes: ['compute_scaling', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#ff9f43',
    positionType: 'COMMON',
    rank13F: 3,
    reportedValue: '$362,038,780',
    shareCount: '20,180,534',
    status: 'IN',
    conviction: 9,
    timeframe: 'medium',
    fundNote: '#3 LARGEST HOLDING — $362M Common Stock (13F, Feb 2026)',
    signal: 'Third largest position. 20M+ shares. Largest Bitcoin miner pivoting to AI hosting via CoreWeave partnership.',
    risk: 'AI hosting ramp execution risk; legacy mining margin compression; single customer concentration.',
    catalysts: ['CoreWeave AI hosting revenue ramp', 'New AI tenant contracts', 'Power capacity expansion', 'Hashrate reallocation to AI'],
    thesis:
      'Core Scientific is the #3 largest position at $362M — 20 million shares of common stock. ' +
      'Largest US Bitcoin miner, now pivoting aggressively to AI compute hosting. ' +
      'Signed a landmark 12-year partnership with CoreWeave to repurpose mining facilities as AI GPU clusters. ' +
      'Bitcoin miners already solved the hardest infrastructure problems: ' +
      'cheap power, high-density cooling, 24/7 operations, remote sites. ' +
      'AI workloads pay 3-5x higher margins than mining. The transition is underway.',
    quote: '"The real bottlenecks in the AI boom will be electricity generation and computing capacity." — Fortune, 2026',
  },

  // ── #4: IREN LIMITED — Common ($339M) ──────────────────────────────────
  {
    ticker: 'IREN',
    name: 'IREN (Iris Energy)',
    category: 'MINING',
    graphNodes: ['compute_scaling', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#ff7c43',
    positionType: 'COMMON',
    rank13F: 4,
    reportedValue: '$338,854,358',
    shareCount: '7,220,421',
    status: 'IN',
    conviction: 8,
    timeframe: 'medium',
    fundNote: '#4 LARGEST HOLDING — $339M Common Stock (13F, Feb 2026)',
    signal: '#4 largest position. 7.2M shares. Renewable-powered miner accelerating AI GPU hosting.',
    risk: 'Smaller scale; AI hosting ramp slower than CORZ; renewable power constraints.',
    catalysts: ['AI GPU hosting revenue', 'Texas/BC datacenter expansion', 'Renewable power contracts'],
    thesis:
      'Iris Energy is the #4 largest position at $339M — 7.2M shares of common stock. ' +
      'Renewable-powered crypto miner aggressively pivoting to AI GPU hosting. ' +
      'Clean energy angle aligns with hyperscaler ESG mandates and long-term power contracts. ' +
      'Pre-built high-density power infrastructure = cheapest and fastest path to AI GPU capacity.',
    quote: '"The real bottlenecks will be electricity generation and computing capacity." — Fortune, 2026',
  },

  // ── #6: NVIDIA — PUT ($299M) — HEDGE / SHORT ────────────────────────────
  {
    ticker: 'NVDA',
    name: 'Nvidia',
    category: 'CHIPS',
    graphNodes: ['gpu_manufacturing', 'compute_scaling', 'oom_compute'],
    chapterRef: 'IIIa',
    color: '#76b900',
    positionType: 'PUT',
    rank13F: 6,
    reportedValue: '$298,528,000',
    shareCount: '1,600,000',
    status: 'WATCH',
    conviction: 6,
    timeframe: 'short',
    fundNote: '⚠ #6 — $299M PUT (SHORT/HEDGE) — Not a long position',
    signal: 'PUT position — fund is HEDGED or SHORT on Nvidia. Likely pair trade: long compute/power, short the GPU monopoly.',
    risk: 'If Nvidia continues dominating and puts expire worthless, significant premium cost.',
    catalysts: ['Custom ASIC market share data', 'Nvidia margin compression signals', 'Export control expansion'],
    thesis:
      'CRITICAL: The fund holds a $299M PUT on Nvidia — this is a SHORT or hedge, NOT a long. ' +
      'This is the most important signal in the filing. ' +
      'Aschenbrenner appears to be expressing the view that Nvidia\'s monopoly rent is at risk: ' +
      'hyperscalers are building custom ASICs (Google TPU, Meta MTIA, Amazon Trainium), ' +
      'and the fund\'s long thesis is on electricity and compute capacity — not GPU vendors. ' +
      'The INTC call + NVDA put suggests a pair trade: ' +
      'long the challenger (Intel foundry/Gaudi), short the incumbent (Nvidia).',
    quote: '"Google\'s TPUs are great too! And custom chips will get better and better." — IIIa',
  },

  // ── #7: VISTRA CORP — Common ($252M) ───────────────────────────────────
  {
    ticker: 'VST',
    name: 'Vistra Energy',
    category: 'POWER',
    graphNodes: ['energy_supply', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#f9ca24',
    positionType: 'COMMON',
    rank13F: 7,
    reportedValue: '$252,327,327',
    shareCount: '1,287,910',
    status: 'IN',
    conviction: 9,
    timeframe: 'long',
    fundNote: '#7 LARGEST HOLDING — $252M Common Stock (13F, Feb 2026)',
    signal: '#7 position. Confirmed holding since Oct 2025. Nuclear + gas fleet in Texas AI corridor.',
    risk: 'Merchant power pricing volatility; ERCOT grid stress events.',
    catalysts: ['New AI datacenter power contracts', 'Texas capacity auctions', 'Nuclear license extensions'],
    thesis:
      'Vistra is the #7 position at $252M — 1.3M shares of common stock. ' +
      'Confirmed holding since the Oct 2025 13F filing. ' +
      'Nuclear + gas fleet perfectly positioned for Texas AI datacenter belt. ' +
      'Controls scarce power generation capacity that hyperscalers are desperate to lock in long-term.',
    quote: '"Securing power, land, permitting, and datacenter construction." — IIIa',
  },

  // ── #8: VANECK SMH — PUT ($196M) — HEDGE / SHORT ───────────────────────
  {
    ticker: 'SMH',
    name: 'VanEck Semiconductor ETF',
    category: 'ETF',
    graphNodes: ['gpu_manufacturing', 'compute_scaling'],
    chapterRef: 'IIIa',
    color: '#a0a0a0',
    positionType: 'PUT',
    rank13F: 8,
    reportedValue: '$195,816,000',
    shareCount: '600,000',
    status: 'WATCH',
    conviction: 5,
    timeframe: 'short',
    fundNote: '⚠ #8 — $196M PUT (SHORT/HEDGE) on semiconductor index',
    signal: 'PUT on SMH — hedging broad semiconductor exposure. Pairs with long INTC/specific chip plays.',
    risk: 'Semiconductor cycle could accelerate, making this hedge costly.',
    catalysts: ['Semiconductor inventory cycle data', 'AI capex slowdown signals'],
    thesis:
      'The fund holds a $196M PUT on the VanEck Semiconductor ETF (SMH). ' +
      'This is a HEDGE against broad semiconductor exposure — NOT a long. ' +
      'Combined with the NVDA put, this suggests the fund is long specific names (INTC, CRWV) ' +
      'while hedging against a broad semiconductor sector drawdown. ' +
      'Classic relative value: long the undervalued (Intel turnaround, compute infrastructure), ' +
      'short the overvalued (Nvidia monopoly priced for perfection, broad semi index at all-time highs).',
    quote: '"The trillion-dollar cluster will be a truly extraordinary effort." — IIIa',
  },

  // ── #10: APPLIED DIGITAL — Common ($139M) ──────────────────────────────
  {
    ticker: 'APLD',
    name: 'Applied Digital',
    category: 'MINING',
    graphNodes: ['compute_scaling', 'energy_supply'],
    chapterRef: 'IIIa',
    color: '#ff6b35',
    positionType: 'COMMON',
    rank13F: 10,
    reportedValue: '$139,111,716',
    shareCount: '6,064,155',
    status: 'IN',
    conviction: 7,
    timeframe: 'medium',
    fundNote: '#10 LARGEST HOLDING — $139M Common Stock (13F, Feb 2026)',
    signal: '#10 position. 6M shares. Building AI datacenter campuses from mining infrastructure.',
    risk: 'Small cap; execution risk on AI campus buildout; financing risk at scale.',
    catalysts: ['AI datacenter campus occupancy', 'New AI tenant signings', 'Power expansion permits'],
    thesis:
      'Applied Digital is the #10 position at $139M — 6M shares. ' +
      'Operating high-density computing facilities for both crypto mining and AI workloads. ' +
      'Building dedicated AI datacenter campuses in low-cost power regions across the US. ' +
      'Same thesis as CORZ and IREN: miners control the electricity and infrastructure ' +
      'that AI compute desperately needs.',
    quote: '"The real bottlenecks in the AI boom will be electricity generation and computing capacity." — Fortune, 2026',
  },
]

// Timeframes for Y-axis alignment with the essay's 2024-2030 projections
export const THESIS_MILESTONES = [
  { year: 2024, label: '$150B AI investment/yr (actual)',  value: 150  },
  { year: 2026, label: '$500B AI investment/yr',           value: 500  },
  { year: 2028, label: '$2T AI investment/yr',             value: 2000 },
  { year: 2030, label: '$8T AI investment/yr (projected)', value: 8000 },
]

// Legacy export for backwards compat
export const STOCK_PICKS = PICKS_2024
