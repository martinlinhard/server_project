from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import HttpRequest
from django.views import View
from django.urls import reverse

#from user_agents import parse
# Create your views here.

class HomeView(View):
    def get(self, request):
        """user_agent = parse(request.META['HTTP_USER_AGENT'])
        print(user_agent.is_mobile)
        print(user_agent)"""
        return render(request, "home/home.html")
