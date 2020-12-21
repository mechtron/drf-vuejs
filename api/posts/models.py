from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class SoftDeleteManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super(SoftDeleteManager, self).get_queryset(
            *args,
            **kwargs
        ).filter(deleted=False)

    def everything(self, *args, **kwargs):
        return super(SoftDeleteManager, self).get_queryset(*args, **kwargs)


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    title = models.TextField(max_length=128)
    content = models.TextField(max_length=2048)
    like_count = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(13371337),
        ]
    )
    deleted = models.BooleanField(default=False)
    objects = SoftDeleteManager()

    class Meta:
        ordering = ('date_created',)
