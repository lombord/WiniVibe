"""
URL configuration for winivibe project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from itertools import chain
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from .static import range_serve
from . import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("base_app.api.urls")),
]

if settings.DEBUG:
    debug_urls = chain(
        static(settings.MEDIA_URL, view=range_serve, document_root=settings.MEDIA_ROOT),
        [
            path("__debug__/", include("debug_toolbar.urls")),
        ],
    )
    urlpatterns.extend(debug_urls)
