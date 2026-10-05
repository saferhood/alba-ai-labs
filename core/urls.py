from django.urls import path

from . import views

app_name = "core"

urlpatterns = [
    path("", views.home, name="home"),
    path("industries/<slug:slug>/", views.industry, name="industry"),
    path("solutions/", views.solutions_index, name="solutions"),
    path("solutions/<slug:slug>/", views.solution, name="solution"),
]
