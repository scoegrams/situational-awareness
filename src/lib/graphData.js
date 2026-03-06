// A lightweight concept graph inspired by the "Situational Awareness" essay.
// Keep this repo code-first: summaries + relationships.
// If you add full text from external sources, consider licensing/copyright.

export const graph = {
  nodes: [
    {
      id: 'ai_scaling_laws',
      title: 'AI Scaling Laws',
      summary:
        'Empirical relationships between compute/data/parameters and model capability. Suggests predictable gains from scaling.'
    },
    {
      id: 'compute_scaling',
      title: 'Compute Scaling',
      summary:
        'The race to train frontier models is constrained by GPU availability, datacenters, capital, and energy.'
    },
    {
      id: 'gpu_manufacturing',
      title: 'GPU Manufacturing',
      summary:
        'Chip design + advanced manufacturing + packaging are a key bottleneck. Supply chains and export controls matter.'
    },
    {
      id: 'datacenter_buildout',
      title: 'Datacenter Buildout',
      summary:
        'Physical infrastructure required to house and power large GPU clusters: cooling, networking, construction timelines.'
    },
    {
      id: 'energy_supply',
      title: 'Energy Supply',
      summary:
        'Power generation and grid capacity become strategic constraints on scaling up training and inference.'
    },
    {
      id: 'capital_allocation',
      title: 'Capital Allocation',
      summary:
        'Training frontier models requires large up-front investment. Funding, incentives, and national priorities shape outcomes.'
    },
    {
      id: 'research_automation',
      title: 'Automated Research',
      summary:
        'AI systems that accelerate R&D: coding, experimentation, theorem-proving, chip design, and model improvement.'
    },
    {
      id: 'intelligence_explosion',
      title: 'Intelligence Explosion',
      summary:
        'A feedback loop where better AI builds better AI, compressing timelines and accelerating capability improvements.'
    },
    {
      id: 'geopolitical_competition',
      title: 'Geopolitical Competition',
      summary:
        'Strategic competition between states over AI capability, compute supply chains, and control of critical infrastructure.'
    },
    {
      id: 'us_ai_ecosystem',
      title: 'US AI Ecosystem',
      summary:
        'Private labs, cloud providers, chip firms, and universities. Strengths: innovation + capital + leading compute suppliers.'
    },
    {
      id: 'china_ai_ecosystem',
      title: 'China AI Ecosystem',
      summary:
        'State-backed scale, talent, and manufacturing depth. Constraints can include access to top-end chips and tooling.'
    },
    {
      id: 'security_and_espionage',
      title: 'Security & Espionage',
      summary:
        'Frontier weights, training recipes, and infrastructure are high-value targets. Security becomes core capability.'
    },
    {
      id: 'alignment_risk',
      title: 'Alignment Risk',
      summary:
        'If systems become extremely capable, misalignment or misuse can create catastrophic outcomes. Safety is not optional.'
    },
    {
      id: 'governance',
      title: 'Governance',
      summary:
        'Institutions, policy, norms, and enforcement mechanisms that shape AI deployment, security, and international stability.'
    }
  ],
  links: [
    { source: 'compute_scaling', target: 'ai_scaling_laws', label: 'enables' },
    { source: 'gpu_manufacturing', target: 'compute_scaling', label: 'bottleneck' },
    { source: 'datacenter_buildout', target: 'compute_scaling', label: 'houses' },
    { source: 'energy_supply', target: 'datacenter_buildout', label: 'powers' },
    { source: 'capital_allocation', target: 'compute_scaling', label: 'funds' },

    { source: 'ai_scaling_laws', target: 'research_automation', label: 'improves' },
    { source: 'research_automation', target: 'intelligence_explosion', label: 'drives' },
    { source: 'compute_scaling', target: 'research_automation', label: 'trains' },

    { source: 'geopolitical_competition', target: 'compute_scaling', label: 'pressures' },
    { source: 'geopolitical_competition', target: 'gpu_manufacturing', label: 'contests' },
    { source: 'geopolitical_competition', target: 'security_and_espionage', label: 'incentivizes' },

    { source: 'us_ai_ecosystem', target: 'compute_scaling', label: 'invests' },
    { source: 'china_ai_ecosystem', target: 'compute_scaling', label: 'invests' },
    { source: 'us_ai_ecosystem', target: 'geopolitical_competition', label: 'actor' },
    { source: 'china_ai_ecosystem', target: 'geopolitical_competition', label: 'actor' },

    { source: 'intelligence_explosion', target: 'alignment_risk', label: 'raises' },
    { source: 'security_and_espionage', target: 'alignment_risk', label: 'amplifies' },
    { source: 'governance', target: 'alignment_risk', label: 'mitigates' },
    { source: 'governance', target: 'security_and_espionage', label: 'regulates' }
  ]
}

export const timelineLines = [
  '2020  scaling laws validated in practice',
  '2024  frontier LLMs demonstrate broad competence',
  '2026  AI copilots accelerate engineering & research',
  '2028  larger-scale research automation',
  '2030  possibility: rapid capability takeoff'
]

export const mapAscii = String.raw`
    [GPU_MANUFACTURING] -> [COMPUTE_SCALING] <- [DATACENTER_BUILDOUT]
            |                    |                  ^
            |                    v                  |
     [GEO COMPETITION] -> [AI_SCALING_LAWS] -> [RESEARCH_AUTOMATION]
            |                                       |
            v                                       v
   [SECURITY & ESPIONAGE]                      [INTELLIGENCE_EXPLOSION]
            |                                       |
            v                                       v
         [GOVERNANCE]  ----------------------->  [ALIGNMENT_RISK]
`
