import os
import urllib.parse

from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.contrib import admin
from django.urls import include, path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from healthcheck.views import HealthCheck
from posts.views import (
    PostCreate,
    PostLike,
    PostList,
    PostRetrieveUpdateDelete,
    PostsHof,
)


WEB_HOSTNAME = os.getenv('WEB_HOSTNAME', 'http://localhost:8080')


class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "{}/auth/github/".format(WEB_HOSTNAME)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "{}/auth/google/".format(WEB_HOSTNAME)


schema_view = get_schema_view(
   openapi.Info(
      title="Posts (mechtron/drf-vuejs)",
      default_version='v1',
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/github/', GitHubLogin.as_view(), name='github_login'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('health', HealthCheck.as_view()),
    path('hof', PostsHof.as_view()),
    path('like/<int:post_id>/', PostLike.as_view()),
    path('post', PostCreate.as_view()),
    path('post/<int:pk>/', PostRetrieveUpdateDelete.as_view()),
    path('posts', PostList.as_view()),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
