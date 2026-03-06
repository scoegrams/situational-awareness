// Concept graph based on Leopold Aschenbrenner's "Situational Awareness: The Decade Ahead" (2024)
// Each node maps to a chapter/theme; chapter = essay slug for reference.

export const CHAPTERS = {
  I:    { label: 'I · Counting the OOMs',           url: 'https://situational-awareness.ai/from-gpt-4-to-agi/' },
  II:   { label: 'II · Intelligence Explosion',      url: 'https://situational-awareness.ai/from-agi-to-superintelligence/' },
  IIIa: { label: 'IIIa · Trillion-Dollar Cluster',  url: 'https://situational-awareness.ai/racing-to-the-trillion-dollar-cluster/' },
  IIIb: { label: 'IIIb · Lock Down the Labs',       url: 'https://situational-awareness.ai/lock-down-the-labs/' },
  IIIc: { label: 'IIIc · Superalignment',           url: 'https://situational-awareness.ai/superalignment/' },
  IIId: { label: 'IIId · Free World Must Prevail',  url: 'https://situational-awareness.ai/the-free-world-must-prevail/' },
  IV:   { label: 'IV · The Project',                url: 'https://situational-awareness.ai/the-project/' },
}

export const graph = {
  nodes: [
    // ── Chapter I: Counting the OOMs ──────────────────────────────────────────
    {
      id: 'scaling_laws',
      title: 'Scaling Laws',
      chapter: 'I',
      summary:
        'Empirical power-law relationships show model capability improves predictably with more compute, data, and parameters. Every 10× (1 OOM) of effective compute yields a consistent, measurable jump in benchmark performance — the foundation of all timeline projections.',
      keywords: ['OOM', 'compute', 'benchmarks', 'power law', 'trendlines'],
    },
    {
      id: 'oom_compute',
      title: 'OOM: Physical Compute',
      chapter: 'I',
      summary:
        'Training compute has grown ~0.5 orders of magnitude per year — roughly doubling every 6 months through more GPUs and bigger clusters. From GPT-2 to GPT-4 represents ~4 OOMs of physical compute growth over 4 years.',
      keywords: ['OOM', 'GPUs', 'training compute', '0.5 OOM/year'],
    },
    {
      id: 'oom_algorithms',
      title: 'OOM: Algorithmic Efficiency',
      chapter: 'I',
      summary:
        'Algorithmic improvements (better architectures, training recipes, data curation) contribute another ~0.5 OOMs/year of "effective compute" without any extra hardware. This doubles the apparent rate of capability gain.',
      keywords: ['algorithmic efficiency', 'architecture', 'training recipes', 'effective compute'],
    },
    {
      id: 'unhobbling',
      title: 'Unhobbling',
      chapter: 'I',
      summary:
        'Models are artificially limited by default: they lack tools, memory, context, and agency. "Unhobbling" gains — RLHF, tool use, scaffolding, long context — unlock latent capability and transform chatbots into agents without any underlying model improvement.',
      keywords: ['RLHF', 'tool use', 'agents', 'scaffolding', 'unhobbling'],
    },
    {
      id: 'agi_by_2027',
      title: 'AGI by 2027',
      chapter: 'I',
      summary:
        'Projecting ~4 OOMs of total effective compute growth (physical + algorithmic + unhobbling) from GPT-4 to 2027 yields another GPT-2→GPT-4-sized qualitative jump. That could mean AI systems able to do the work of an AI researcher/engineer — the definition of AGI used here.',
      keywords: ['AGI', '2027', 'projection', 'trendlines', 'researcher-level AI'],
    },

    // ── Chapter II: Intelligence Explosion ────────────────────────────────────
    {
      id: 'intelligence_explosion',
      title: 'Intelligence Explosion',
      chapter: 'II',
      summary:
        'Once AGI can automate AI research, each generation of AI accelerates the next. Hundreds of millions of AGI "coworkers" running experiments 24/7 could compress a decade of algorithmic progress into one year, producing rapidly superintelligent systems.',
      keywords: ['feedback loop', 'recursive improvement', 'superintelligence', 'timelines'],
    },
    {
      id: 'research_automation',
      title: 'Automated AI Research',
      chapter: 'II',
      summary:
        'AGI systems that can autonomously write code, run experiments, review papers, and iterate on model architectures would break the human-speed bottleneck on progress. This is the key input to the intelligence explosion — the moment AI starts improving itself at scale.',
      keywords: ['autonomous research', 'coding agents', 'self-improvement'],
    },
    {
      id: 'superintelligence',
      title: 'Superintelligence',
      chapter: 'II',
      summary:
        'Systems vastly smarter than any human in every relevant domain. Post-explosion, capability gains could be so rapid that we move from near-human to far-superhuman in months. The strategic, economic, and existential consequences are unparalleled.',
      keywords: ['superintelligence', 'post-AGI', 'capability overhang'],
    },

    // ── Chapter IIIa: Trillion-Dollar Cluster ─────────────────────────────────
    {
      id: 'compute_scaling',
      title: 'Compute Buildout',
      chapter: 'IIIa',
      summary:
        'Training frontier models requires exponentially growing clusters. Projections point to $100B→$1T clusters by 2030. This demands extraordinary coordination: procuring GPUs at scale, building power infrastructure, and securing supply chains — mobilization not seen since WWII.',
      keywords: ['GPU clusters', '$1T cluster', 'data centers', 'capital'],
    },
    {
      id: 'energy_supply',
      title: 'Energy & Power Grid',
      chapter: 'IIIa',
      summary:
        'Data centers need electricity at a scale that strains national grids. US electricity production may need to grow 10–20% just for AI by 2030. Power contracts, nuclear restarts, and new gas plants are being secured years in advance.',
      keywords: ['electricity', 'power grid', 'energy', 'nuclear', 'natural gas'],
    },
    {
      id: 'gpu_manufacturing',
      title: 'GPU Manufacturing',
      chapter: 'IIIa',
      summary:
        'Advanced chip manufacturing is concentrated in TSMC (Taiwan). GPU supply is the single biggest near-term bottleneck for scaling. US export controls attempt to limit China\'s access — a key vector in the geopolitical contest.',
      keywords: ['TSMC', 'chip manufacturing', 'export controls', 'Nvidia', 'H100'],
    },
    {
      id: 'capital_allocation',
      title: 'Capital & Investment',
      chapter: 'IIIa',
      summary:
        'Training runs now cost hundreds of millions; the next generation will cost billions. Revenue from current models funds the next cluster. The scale of investment signals a winner-take-most dynamic: whoever builds the biggest cluster first gains a decisive lead.',
      keywords: ['investment', 'funding', 'revenue', 'winner-take-most'],
    },

    // ── Chapter IIIb: Lock Down the Labs ──────────────────────────────────────
    {
      id: 'lab_security',
      title: 'AI Lab Security',
      chapter: 'IIIb',
      summary:
        'Current AI labs treat security as an afterthought. Model weights, training code, and alignment research are high-value targets. A state actor stealing frontier weights could short-circuit years of investment and bypass safety work — yet basic security hygiene is often absent.',
      keywords: ['model weights', 'security', 'state actor', 'exfiltration', 'OpenAI', 'Anthropic'],
    },
    {
      id: 'espionage',
      title: 'Espionage Threat',
      chapter: 'IIIb',
      summary:
        'China\'s intelligence apparatus actively targets US AI labs. Insider threats, cyber intrusions, and supply-chain attacks are all vectors. The prize — frontier model weights and training recipes — would be transformative for any adversary who obtained them.',
      keywords: ['China', 'CCP', 'insider threat', 'cyber attack', 'espionage'],
    },

    // ── Chapter IIIc: Superalignment ──────────────────────────────────────────
    {
      id: 'alignment_problem',
      title: 'The Alignment Problem',
      chapter: 'IIIc',
      summary:
        'We don\'t yet know how to reliably specify what we want a superhuman AI to do, nor how to verify that it\'s doing it. Misaligned goals in a superintelligent system could be catastrophic. This is an unsolved technical research problem — not a sci-fi thought experiment.',
      keywords: ['alignment', 'corrigibility', 'reward hacking', 'specification', 'values'],
    },
    {
      id: 'superalignment',
      title: 'Superalignment',
      chapter: 'IIIc',
      summary:
        'The challenge of aligning AI systems that are smarter than their creators. Classic alignment techniques (RLHF, red-teaming) may not scale to superhuman intelligence. New approaches — scalable oversight, interpretability, formal verification — are needed before the intelligence explosion.',
      keywords: ['superalignment', 'scalable oversight', 'interpretability', 'RLHF', 'OpenAI'],
    },
    {
      id: 'interpretability',
      title: 'Interpretability',
      chapter: 'IIIc',
      summary:
        'Understanding what\'s happening inside neural networks — what circuits compute what, where values and beliefs are stored. Crucial for verifying alignment and detecting deceptive behavior. Current tools (attention visualization, probing) are primitive relative to the need.',
      keywords: ['interpretability', 'mechanistic', 'circuits', 'transparency'],
    },

    // ── Chapter IIId: Free World Must Prevail ─────────────────────────────────
    {
      id: 'us_china_competition',
      title: 'US–China AI Race',
      chapter: 'IIId',
      summary:
        'The AI race is a geopolitical contest. The US currently leads, but China has scale, talent, and state-directed investment. A CCP-led superintelligence would give an autocratic regime decisive economic and military advantage over the free world — potentially permanently.',
      keywords: ['China', 'CCP', 'US', 'geopolitics', 'competition', 'strategic advantage'],
    },
    {
      id: 'compute_governance',
      title: 'Compute Governance',
      chapter: 'IIId',
      summary:
        'Controlling who can train frontier models means controlling compute: export controls on advanced chips, monitoring of large training runs, international agreements on compute thresholds. The most tractable lever for AI governance today.',
      keywords: ['export controls', 'governance', 'compute', 'regulation', 'BIS'],
    },
    {
      id: 'democratic_ai',
      title: 'Democratic AI Development',
      chapter: 'IIId',
      summary:
        'The case that democratic values — freedom of speech, rule of law, checks and balances — must be embedded in the development and deployment of superintelligence. An AI shaped by liberal democracies is far preferable to one shaped by authoritarian regimes.',
      keywords: ['democracy', 'values', 'freedom', 'rule of law', 'liberal order'],
    },

    // ── Chapter IV: The Project ────────────────────────────────────────────────
    {
      id: 'the_project',
      title: 'The Project',
      chapter: 'IV',
      summary:
        'As AGI approaches, the US national security apparatus will get involved. A government-led AGI program — akin to the Manhattan Project — is likely by 2027–28. No private lab can handle the security, governance, and strategic implications of building superintelligence alone.',
      keywords: ['Manhattan Project', 'NSA', 'government', 'classified', 'SCIF', 'national security'],
    },
    {
      id: 'governance',
      title: 'AI Governance',
      chapter: 'IV',
      summary:
        'Policies, institutions, and norms that shape AI development, deployment, and access. Includes domestic regulation, international coordination, liability frameworks, and safety standards. Critically under-developed relative to the speed of the technology.',
      keywords: ['regulation', 'policy', 'international', 'norms', 'safety standards'],
    },
  ],

  links: [
    // OOM stack → AGI
    { source: 'oom_compute',    target: 'scaling_laws',   label: 'grows' },
    { source: 'oom_algorithms', target: 'scaling_laws',   label: 'multiplies' },
    { source: 'unhobbling',     target: 'agi_by_2027',    label: 'accelerates' },
    { source: 'scaling_laws',   target: 'agi_by_2027',    label: 'projects' },

    // AGI → explosion
    { source: 'agi_by_2027',           target: 'research_automation',  label: 'enables' },
    { source: 'research_automation',   target: 'intelligence_explosion', label: 'drives' },
    { source: 'intelligence_explosion', target: 'superintelligence',    label: 'produces' },

    // Physical constraints
    { source: 'gpu_manufacturing', target: 'compute_scaling',  label: 'bottleneck' },
    { source: 'energy_supply',     target: 'compute_scaling',  label: 'powers' },
    { source: 'capital_allocation', target: 'compute_scaling', label: 'funds' },
    { source: 'compute_scaling',   target: 'oom_compute',      label: 'feeds' },

    // Security
    { source: 'espionage',   target: 'lab_security',  label: 'motivates' },
    { source: 'lab_security', target: 'alignment_problem', label: 'protects' },

    // Alignment stack
    { source: 'intelligence_explosion', target: 'alignment_problem',  label: 'sharpens' },
    { source: 'alignment_problem',      target: 'superalignment',     label: 'requires' },
    { source: 'superalignment',         target: 'interpretability',   label: 'needs' },

    // Geopolitics
    { source: 'us_china_competition',  target: 'compute_scaling',      label: 'pressures' },
    { source: 'us_china_competition',  target: 'gpu_manufacturing',    label: 'contests' },
    { source: 'us_china_competition',  target: 'espionage',            label: 'incentivizes' },
    { source: 'compute_governance',    target: 'us_china_competition', label: 'shapes' },
    { source: 'compute_governance',    target: 'gpu_manufacturing',    label: 'regulates' },
    { source: 'democratic_ai',         target: 'the_project',          label: 'motivates' },

    // The Project
    { source: 'superintelligence',     target: 'the_project',    label: 'necessitates' },
    { source: 'the_project',           target: 'governance',     label: 'instantiates' },
    { source: 'governance',            target: 'alignment_problem', label: 'addresses' },
    { source: 'governance',            target: 'lab_security',   label: 'mandates' },
  ]
}

// ── Timeline ──────────────────────────────────────────────────────────────────
export const timelineLines = [
  '2019  GPT-2 · ~preschooler · semi-coherent paragraphs',
  '2020  GPT-3 · ~elementary schooler · few-shot learning',
  '2022  RLHF (InstructGPT) · chatbot era begins',
  '2023  GPT-4 · ~smart high-schooler · aces college exams',
  '2024  +4 OOMs effective compute since GPT-2',
  '─────────────────────────────────────────────',
  '2025  AI copilots become mainstream engineering tools',
  '2026  ~+4 more OOMs projected · AGI-threshold plausible',
  '2027  Researcher-level AI · self-improving feedback starts',
  '2028  Automated AI research at scale · intelligence explosion',
  '2030  Possible: rapid capability takeoff to superintelligence',
  '─────────────────────────────────────────────',
  'Source: Aschenbrenner (2024) · situational-awareness.ai',
]

// ── Topology ASCII ─────────────────────────────────────────────────────────────
export const mapAscii = String.raw`
CAPABILITY STACK
  [oom_compute] + [oom_algorithms] + [unhobbling]
           \            |              /
            └──> [scaling_laws] ──> [agi_by_2027]
                                         |
                              [research_automation]
                                         |
                            [intelligence_explosion]
                                         |
                              [superintelligence]
                                         |
                            ┌────────────┴────────────┐
                      [alignment_problem]       [the_project]
                            |                        |
                     [superalignment]          [governance]
                            |
                    [interpretability]

PHYSICAL LAYER
  [gpu_manufacturing] → [compute_scaling] ← [energy_supply]
                               ↑
                       [capital_allocation]

GEOPOLITICAL LAYER
  [us_china_competition] → [espionage] → [lab_security]
           ↑
  [compute_governance]  [democratic_ai]
`
