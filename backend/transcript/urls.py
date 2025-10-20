from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SummarizeView, HistoryView

router = DefaultRouter()
router.register(r'history', HistoryView, basename='history')

urlpatterns = [
    path('summarize/', SummarizeView.as_view(), name='summarize'),
    path('', include(router.urls)),
]
