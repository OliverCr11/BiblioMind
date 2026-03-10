from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReviewViewSet, get_stats, RegisterView, CustomAuthToken

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('stats/', get_stats, name='stats'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('', include(router.urls)),
]
