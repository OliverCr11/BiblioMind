import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Avg
from .models import Book, Review
from .serializers import BookSerializer, ReviewSerializer

@api_view(['GET'])
def get_stats(request):
    total_books = Book.objects.count()
    total_reviews = Review.objects.count()
    avg_rating = Review.objects.aggregate(Avg('rating'))['rating__avg']
    avg_rating = round(avg_rating, 1) if avg_rating else 0.0
    
    return Response({
        'total_books': total_books,
        'total_reviews': total_reviews,
        'average_rating': avg_rating
    })

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def create(self, request, *args, **kwargs):
        # Create a mutable copy of the query dict
        data = request.data.copy()
        title = data.get('title', '')
        
        if title:
            # 1. Primary Source: Google Books API
            google_success = False
            try:
                response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}", timeout=5)
                if response.status_code == 200:
                    api_data = response.json()
                    if 'items' in api_data and len(api_data['items']) > 0:
                        volume_info = api_data['items'][0].get('volumeInfo', {})
                        
                        # Set Description
                        if not data.get('description'):
                            fetched_desc = volume_info.get('description', '')
                            data['description'] = fetched_desc if fetched_desc else "No description available for this title."
                            
                        # Set Cover
                        current_cover = data.get('cover_url', '')
                        if not current_cover or 'unsplash.com' in current_cover:
                            image_links = volume_info.get('imageLinks', {})
                            thumbnail = image_links.get('thumbnail', '')
                            
                            if thumbnail.startswith('http://'):
                                thumbnail = thumbnail.replace('http://', 'https://')
                                
                            if '&zoom=1' in thumbnail:
                                thumbnail = thumbnail.replace('&zoom=1', '&zoom=2')
                            
                            if thumbnail:
                                data['cover_url'] = thumbnail
                                google_success = True
            except requests.exceptions.RequestException as e:
                print(f"Google Books API failed: {e}")

            # 2. Secondary Source: Open Library API Fallback
            if not google_success:
                print("Falling back to Open Library API...")
                try:
                    ol_response = requests.get(f"https://openlibrary.org/search.json?title={title}", timeout=5)
                    if ol_response.status_code == 200:
                        ol_data = ol_response.json()
                        if 'docs' in ol_data and len(ol_data['docs']) > 0:
                            first_doc = ol_data['docs'][0]
                            
                            # Attempt to get cover image
                            cover_i = first_doc.get('cover_i')
                            if cover_i:
                                data['cover_url'] = f"https://covers.openlibrary.org/b/id/{cover_i}-L.jpg"
                            
                            # Opem Library descriptions are often nested or missing, so keep safety net
                            if not data.get('description'):
                                data['description'] = "No description available for this title."
                except requests.exceptions.RequestException as e:
                    print(f"Open Library API failed: {e}")

            # 3. Tertiary Source: Ultimate Safety Net
            if not data.get('description'):
                data['description'] = "No description available for this title."
            if not data.get('cover_url') or 'unsplash.com' in data.get('cover_url', ''):
                data['cover_url'] = 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop'
                
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
