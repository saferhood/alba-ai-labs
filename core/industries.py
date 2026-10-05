"""
Registry of industry pages. Order here is the order shown on the home page.
Each entry has a template at templates/core/industries/<slug>.html.
"""

INDUSTRIES = [
    {
        "slug": "healthcare",
        "name": "Healthcare",
        "icon": "i-health",
        "thesis": "AI already reads scans, drafts notes, and flags risk. The hard cases are where it fails. That is where we evolve it.",
    },
    {
        "slug": "real-estate",
        "name": "Real Estate",
        "icon": "i-house",
        "thesis": "Valuation models are accurate on the easy properties and unreliable on the ones that matter. We evolve them to fit local markets.",
    },
    {
        "slug": "finance",
        "name": "Finance",
        "icon": "i-trend",
        "thesis": "Fraud and risk change faster than models get retrained. We evolve detection strategies against the behavior that is actually emerging.",
    },
    {
        "slug": "logistics",
        "name": "Logistics",
        "icon": "i-truck",
        "thesis": "Optimized plans break on contact with the real world. We evolve routing and forecasting systems that hold up when conditions shift.",
    },
    {
        "slug": "manufacturing",
        "name": "Manufacturing",
        "icon": "i-factory",
        "thesis": "Inspection and maintenance models fail on rare defects and new conditions. We evolve them on the line, not just in the lab.",
    },
    {
        "slug": "retail",
        "name": "Retail",
        "icon": "i-bag",
        "thesis": "Forecasting, pricing, and recommendation systems drift and feed on their own outputs. We evolve them toward real customer outcomes.",
    },
    {
        "slug": "legal",
        "name": "Legal",
        "icon": "i-scale",
        "thesis": "Legal AI is fast and often wrong in ways that get lawyers sanctioned. We evolve systems that are measured on verified accuracy.",
    },
    {
        "slug": "education",
        "name": "Education",
        "icon": "i-book",
        "thesis": "AI tutors can double learning gains or quietly erode them. We evolve systems toward what students retain, not what they click.",
    },
    {
        "slug": "infrastructure",
        "name": "Infrastructure",
        "icon": "i-bridge",
        "thesis": "Grid, water, and traffic models fail exactly when conditions are extreme. We evolve for robustness under the situations that matter.",
    },
    {
        "slug": "enterprise-operations",
        "name": "Enterprise Operations",
        "icon": "i-layers",
        "thesis": "Most enterprise AI pilots never reach production. We evolve workflows and agents against the outcomes your operation is measured on.",
    },
]

BY_SLUG = {i["slug"]: i for i in INDUSTRIES}


def neighbors(slug):
    """Previous and next entries for page footer navigation."""
    slugs = [i["slug"] for i in INDUSTRIES]
    idx = slugs.index(slug)
    prev_item = INDUSTRIES[idx - 1] if idx > 0 else None
    next_item = INDUSTRIES[idx + 1] if idx < len(INDUSTRIES) - 1 else None
    return prev_item, next_item
