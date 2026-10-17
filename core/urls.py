from django.contrib import admin
from django.urls import path, include

from core import views

urlpatterns = [
<<<<<<< Updated upstream
    path('admin/', admin.site.urls),
    path('', include('pages.urls')),
=======
    path("", views.home, name="home"),
    path("manifest.webmanifest", views.manifest, name="manifest"),
    path("sw.js", views.service_worker, name="service-worker"),
    path("admin/", admin.site.urls),
>>>>>>> Stashed changes
]
