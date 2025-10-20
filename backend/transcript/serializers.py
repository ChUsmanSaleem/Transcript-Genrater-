from rest_framework import serializers
from .models import Transcript

class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = ['id', 'youtube_url', 'video_id', 'title', 'channel_name', 'thumbnail_url', 'duration', 'publish_date', 'transcript', 'summary', 'highlights', 'key_moments', 'topics', 'quotes', 'sentiment', 'host_name', 'guest_name', 'created_at']
        read_only_fields = ['id', 'video_id', 'title', 'channel_name', 'thumbnail_url', 'duration', 'publish_date', 'transcript', 'summary', 'highlights', 'key_moments', 'topics', 'quotes', 'sentiment', 'host_name', 'guest_name', 'created_at']

class SummarizeSerializer(serializers.Serializer):
    youtube_url = serializers.URLField()
