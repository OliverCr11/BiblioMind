import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Book, Review
from .serializers import BookSerializer, ReviewSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def create(self, request, *args, **kwargs):
        # Create a mutable copy of the query dict
        data = request.data.copy()
        title = data.get('title', '')
        
        if title:
            try:
                # Fetch data from Google Books API
                response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}")
                if response.status_code == 200:
                    api_data = response.json()
                    if 'items' in api_data and len(api_data['items']) > 0:
                        volume_info = api_data['items'][0].get('volumeInfo', {})
                        
                        # Update description if it's missing or empty
                        if not data.get('description'):
                            data['description'] = volume_info.get('description', '')
                            
                        # Update cover_url if it's the placeholder or missing
                        current_cover = data.get('cover_url', '')
                        if not current_cover or 'unsplash.com' in current_cover:
                            image_links = volume_info.get('imageLinks', {})
                            thumbnail = image_links.get('thumbnail', '')
                            
                            # Replace http:// with https:// to prevent Mixed Content errors
                            if thumbnail.startswith('http://'):
                                thumbnail = thumbnail.replace('http://', 'https://')
                                
                            # Improve image resolution from thumbnail to higher quality
                            if '&zoom=1' in thumbnail:
                                thumbnail = thumbnail.replace('&zoom=1', '&zoom=2')
                            
                            if thumbnail:
                                data['cover_url'] = thumbnail
                            else:
                                data['cover_url'] = 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop'
                        elif not current_cover:
                             data['cover_url'] = 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop'
            except Exception as e:
                print(f"Error fetching from Google Books API: {e}")
                
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
