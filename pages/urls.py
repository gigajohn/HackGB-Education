from django.urls import path
from .views import LandingPageView, LoginPageView, OAuthStartView, LogoutView

urlpatterns = [
    path('', LandingPageView.as_view(), name='landing'),
    path('login/', LoginPageView.as_view(), name='login'),
    path('oauth/<str:provider>/', OAuthStartView.as_view(), name='oauth_start'),
    path('logout/', LogoutView.as_view(), name='logout'),
]