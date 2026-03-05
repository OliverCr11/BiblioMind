from rest_framework import serializers
from .models import Book, Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book', 'reviewer_name', 'rating', 'comment', 'created_at']

class BookSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'cover_url', 'reviews']
