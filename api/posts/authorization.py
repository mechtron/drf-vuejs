from rest_framework import permissions

from posts.models import Post


def _user_owns_post(user, post_id):
    posts = Post.objects.filter(id=post_id)
    if len(posts) == 0:
        return False
    return posts.first().author == user.username


class IsOwnerOfSpecifiedPost(permissions.BasePermission):
    message = 'You are not the owner of the post(s) specifed'

    def has_permission(self, request, view):
        return _user_owns_post(request.user, view.kwargs.get('pk'))

    def has_object_permission(self, request, view, obj):
        return _user_owns_post(request.user, obj.id)
