from django.conf import settings
from django.http import Http404
from django.shortcuts import render

from . import industries, solutions


def _live_solutions():
    base = settings.BASE_DIR / "templates" / "core" / "solutions"
    return [s for s in solutions.SOLUTIONS if (base / f"{s['slug']}.html").exists()]


def home(request):
    return render(
        request,
        "core/home.html",
        {"industries": industries.INDUSTRIES, "solutions": _live_solutions()},
    )


def industry(request, slug):
    item = industries.BY_SLUG.get(slug)
    if item is None:
        raise Http404("Unknown industry")
    prev_item, next_item = industries.neighbors(slug)
    return render(
        request,
        f"core/industries/{slug}.html",
        {
            "industry": item,
            "industries": industries.INDUSTRIES,
            "prev_item": prev_item,
            "next_item": next_item,
        },
    )


def solutions_index(request):
    # Only list solutions whose page exists, so the index never links to a 404.
    return render(request, "core/solutions_index.html", {"solutions": _live_solutions()})


def solution(request, slug):
    item = solutions.BY_SLUG.get(slug)
    if item is None:
        raise Http404("Unknown solution")
    prev_item, next_item = solutions.neighbors(slug)
    return render(
        request,
        f"core/solutions/{slug}.html",
        {
            "solution": item,
            "prev_item": prev_item,
            "next_item": next_item,
        },
    )
