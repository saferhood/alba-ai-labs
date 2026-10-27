"""
Sitemaps for search engines, served at /sitemap.xml.

Only pages whose template exists are listed, so Google is never sent to a 404.
"""

from django.conf import settings
from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from . import industries, solutions

TEMPLATES_DIR = settings.BASE_DIR / "templates" / "core"


def _live(items, folder):
    return [i for i in items if (TEMPLATES_DIR / folder / f"{i['slug']}.html").exists()]


class _BaseSitemap(Sitemap):
    protocol = "https"

    def get_domain(self, site=None):
        # Always point Google at the canonical domain, whatever host served the request.
        return settings.SITE_DOMAIN


class StaticSitemap(_BaseSitemap):
    def items(self):
        return [("core:home", 1.0), ("core:solutions", 0.8)]

    def location(self, item):
        return reverse(item[0])

    def priority(self, item):
        return item[1]


class SolutionSitemap(_BaseSitemap):
    priority = 0.7

    def items(self):
        return _live(solutions.SOLUTIONS, "solutions")

    def location(self, item):
        return reverse("core:solution", args=[item["slug"]])


class IndustrySitemap(_BaseSitemap):
    priority = 0.7

    def items(self):
        return _live(industries.INDUSTRIES, "industries")

    def location(self, item):
        return reverse("core:industry", args=[item["slug"]])


SITEMAPS = {
    "static": StaticSitemap,
    "solutions": SolutionSitemap,
    "industries": IndustrySitemap,
}
