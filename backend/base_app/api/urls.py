from django.urls import include, path


from . import views
from .viewsets import urls

auth_urls = [
    path("register/", views.UserRegisterAPIView.as_view()),
    path("login/", views.LoginView.as_view(), name="knox_login"),
    path("logout/", views.LogoutView.as_view(), name="knox_logout"),
    path("logoutall/", views.LogoutAllView.as_view(), name="knox_logoutall"),
]

urlpatterns = [
    path("auth/", include(auth_urls)),
    path("session/", views.UserSessionAPIView.as_view()),
    path("profile/", views.UserProfileAPIView.as_view()),
]

# include ViewSet urls as well
urlpatterns.extend(urls)
