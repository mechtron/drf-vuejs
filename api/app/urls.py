import urllib.parse

from allauth.socialaccount.providers.github import views as github_views
from allauth.socialaccount.providers.google import views as google_views
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.conf.urls import url
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path, reverse
from rest_auth.registration.views import SocialLoginView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


class GitHubLogin(SocialLoginView):
    adapter_class = github_views.GitHubOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('github_callback'))


class GoogleLogin(SocialLoginView):
    adapter_class = google_views.GoogleOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return self.request.build_absolute_uri(reverse('google_callback'))


def github_callback(request):
    params = urllib.parse.urlencode(request.GET)
    return redirect(f'https://frontend/auth/github?{params}')


def google_callback(request):
    params = urllib.parse.urlencode(request.GET)
    return redirect(f'https://frontend/auth/google?{params}')


schema_view = get_schema_view(
   openapi.Info(
      title="DRF VueJS",
      default_version='v1',
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('rest_auth.urls')),
    path('auth/github/callback/', github_callback, name='github_callback'),
    path('auth/github/url/', github_views.oauth2_login),
    path('auth/github/token/', GitHubLogin.as_view()),
    path('auth/google/callback/', google_callback, name='google_callback'),
    path('auth/google/url/', google_views.oauth2_login),
    path('auth/google/token/', GoogleLogin.as_view()),
    url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
