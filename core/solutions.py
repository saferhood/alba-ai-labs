"""
Registry of solution pages ("What we solve"). Each entry has a template at
templates/core/solutions/<slug>.html. Order here is display order.
"""

SOLUTIONS = [
    {
        "slug": "network-second-reads",
        "name": "Cancer detection across a hospital network",
        "short": "Second reads",
        "category": "Healthcare",
        "icon": "i-eye",
        "thesis": "Every CT, MRI, and ultrasound in the network gets a second read for cancer, with the model evolved to the hospitals that have the fewest specialists.",
    },
    {
        "slug": "hereditary-disease-imaging",
        "name": "Imaging for hereditary blood disorders",
        "short": "Hereditary disease",
        "category": "Healthcare",
        "icon": "i-health",
        "thesis": "Sickle cell and other inherited conditions concentrate in specific populations that global models were never trained on. We evolve for them.",
    },
    {
        "slug": "trauma-triage",
        "name": "Trauma CT triage for remote regions",
        "short": "Trauma triage",
        "category": "Healthcare",
        "icon": "i-shield-plain",
        "thesis": "Where road deaths are highest, radiologists are fewest. We prioritize the scans that cannot wait.",
    },
    {
        "slug": "opportunistic-screening",
        "name": "Opportunistic screening on existing scans",
        "short": "Opportunistic screening",
        "category": "Healthcare",
        "icon": "i-layers",
        "thesis": "Scans ordered for one reason hold evidence of diabetes, heart disease, and bone loss. We read all of it.",
    },
    {
        "slug": "animal-collisions",
        "name": "Animal collisions on rural highways",
        "short": "Highway collisions",
        "category": "Infrastructure",
        "icon": "i-truck",
        "thesis": "Camels, cattle, and deer on unlit highways kill drivers every week. We detect them before the headlights do.",
    },
    {
        "slug": "solar-soiling",
        "name": "Dust and soiling forecasting for solar plants",
        "short": "Solar soiling",
        "category": "Energy",
        "icon": "i-forecast",
        "thesis": "Dust can take a third of a solar plant's output in months. We forecast it and schedule cleaning where it pays.",
    },
    {
        "slug": "heat-illness",
        "name": "Heat illness forecasting at mass gatherings",
        "short": "Heat illness",
        "category": "Public safety",
        "icon": "i-spark",
        "thesis": "Cameras can see a crowd. They cannot see who will collapse in two hours. We forecast heat risk by site and by hour.",
    },
    {
        "slug": "flash-flood",
        "name": "Flash flood nowcasting for desert cities",
        "short": "Flash floods",
        "category": "Infrastructure",
        "icon": "i-bridge",
        "thesis": "Cities built for drought flood in hours. We turn radar, terrain, and drain sensors into street level warnings.",
    },
    {
        "slug": "sme-cash-flow",
        "name": "Cash flow and credit for small businesses",
        "short": "SME cash flow",
        "category": "Finance",
        "icon": "i-trend",
        "thesis": "Small firms with no credit history now produce structured invoice data every day. We turn it into forecasts lenders can act on.",
    },
    {
        "slug": "heritage-monitoring",
        "name": "Structural monitoring of heritage sites",
        "short": "Heritage sites",
        "category": "Infrastructure",
        "icon": "i-house",
        "thesis": "Rock cut tombs and ancient cliffs erode faster than a survey team can return. We watch them from repeat imagery.",
    },
]

BY_SLUG = {s["slug"]: s for s in SOLUTIONS}


def neighbors(slug):
    slugs = [s["slug"] for s in SOLUTIONS]
    idx = slugs.index(slug)
    prev_item = SOLUTIONS[idx - 1] if idx > 0 else None
    next_item = SOLUTIONS[idx + 1] if idx < len(SOLUTIONS) - 1 else None
    return prev_item, next_item
