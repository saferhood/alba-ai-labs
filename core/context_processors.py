from django.conf import settings


def site(request):
    return {"site_url": f"https://{settings.SITE_DOMAIN}"}
