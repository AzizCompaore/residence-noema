from django.urls import path

from . import views

urlpatterns = [
    path('csrf/', views.csrf_token, name='auth-csrf'),
    path('me/', views.current_user, name='auth-me'),
    path('register/', views.register, name='auth-register'),
    path('login/', views.login_view, name='auth-login'),
    path('logout/', views.logout_view, name='auth-logout'),
    path('password-reset/request/', views.password_reset_request, name='auth-password-reset-request'),
    path('password-reset/confirm/', views.password_reset_confirm, name='auth-password-reset-confirm'),
    path('google/start/', views.google_start, name='auth-google-start'),
    path('google/callback/', views.google_callback, name='auth-google-callback'),
]