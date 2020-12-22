from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from posts.authorization import IsOwnerOfSpecifiedPost
from posts.models import Post
from posts.serializers import (
    CreatePostSerializer,
    PostsSerializer,
)


class PostCreate(CreateAPIView):
    serializer_class = CreatePostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save(author=self.request.user)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        created_post = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        response_data = {
            'id': created_post.id,
            'date_created': created_post.date_created,
            'author': created_post.author.username,
            'title': created_post.title,
            'content': created_post.content,
            'like_count': created_post.like_count,
        }
        return Response(
            response_data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class PostList(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostsSerializer
    permission_classes = []


class PostRetrieveUpdateDelete(RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = (IsOwnerOfSpecifiedPost,)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PostsSerializer
        else:
            return CreatePostSerializer

    def perform_destroy(self, instance):
        instance.deleted = True
        instance.save()


class PostLike(APIView):
    permission_classes = ()

    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            post.like_count += 1
            post.save()
            return Response(status=status.HTTP_201_CREATED)
        except:
            raise Http404


class PostsHof(APIView):
    permission_classes = ()

    def get(self, request):
        top_posts = Post.objects.values().order_by('-like_count')[:10]
        return Response(top_posts, status=status.HTTP_200_OK)
