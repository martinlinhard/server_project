from django.urls import path, include
from .views import GalleryView

urlpatterns=[
    path('', GalleryView.as_view(), name="start-gallery")
]