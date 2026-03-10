from django.contrib import admin
from .models import Book, Review

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'owner')
    search_fields = ('title', 'author')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'reviewer_name', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('book__title', 'reviewer_name')
