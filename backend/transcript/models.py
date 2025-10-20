from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Transcript(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    youtube_url = models.URLField()
    video_id = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=500, blank=True, null=True)
    channel_name = models.CharField(max_length=500, blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    duration = models.CharField(max_length=20, blank=True, null=True)
    publish_date = models.DateField(blank=True, null=True)
    transcript = models.TextField()
    summary = models.TextField()
    highlights = models.JSONField(blank=True, null=True)
    key_moments = models.JSONField(blank=True, null=True)
    topics = models.JSONField(blank=True, null=True)
    quotes = models.JSONField(blank=True, null=True)
    sentiment = models.CharField(max_length=100, blank=True, null=True)
    host_name = models.CharField(max_length=500, blank=True, null=True)
    guest_name = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transcript for {self.youtube_url}"
