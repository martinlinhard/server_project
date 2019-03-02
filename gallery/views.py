from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import HttpRequest
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.urls import reverse
from .getImages import getI

# Create your views here.

class GalleryView(View):
    def get(self, request):
        files = getI()
        names = []

        files.sort()
        for file in files:
            names.append(file.split("_")[0])

        content = {
            'data' :  zip(files, names)
        }
        return render(request, "gallery/gallery.html", content)
