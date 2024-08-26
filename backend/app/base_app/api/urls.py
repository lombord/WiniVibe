from django.urls import include, path


from . import views
from . import viewsets

auth_urls = [
    path("register/", views.UserRegisterAPIView.as_view()),
    path("login/", views.LoginView.as_view(), name="jwt_cookie_login"),
    path("logout/", views.LogoutView.as_view(), name="jwt_cookie_logout"),
    path("logoutall/", views.LogoutAllView.as_view(), name="jwt_cookie_logoutall"),
    path("check/", views.CheckAuthView.as_view(), name="jwt_cookie_check"),
]

urlpatterns = [
    path("auth/", include(auth_urls)),
    path("session/", views.UserSessionAPIView.as_view()),
    path("profile/", views.UserProfileAPIView.as_view()),
]

# include ViewSet urls as well
urlpatterns.extend(viewsets.urls)
