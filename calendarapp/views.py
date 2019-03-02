from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import JsonResponse
from django.views import View
from django.contrib.auth.models import User

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator



import json
from .models import Event

# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class CalendarView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return render(request, "calendarapp/calendar.html")
        else:
            return render(request, "calendarapp/calendar_not_logged_in.html")

    def post(self, request):
        data = request.body.decode('utf-8')
        #convert the content (may be from a database...) to json / dictionary
        requestData = json.loads(data)

        if requestData["reqType"] == "createEvent":
            #event that should be created
            newEvent = requestData["event"]
            newEvent["content"] = newEvent["content"].replace("<br>", "\n")

            #Are numbers real numbers?
            for prop in newEvent:
                if newEvent[prop] == None:
                    return HttpResponse("error")    
            
            if "~" in newEvent["title"] or "~" in newEvent["content"]:
                return HttpResponse("error") 
            #Save event
            event = Event(day=newEvent["day"], hours=newEvent["hours"], minutes=newEvent["minutes"], month=newEvent["month"], year=newEvent["year"], title=newEvent["title"], content=newEvent["content"])
            event.save()
            
            return HttpResponse("success")
        elif requestData["reqType"] == "editEvent":
            oldEvent = requestData["oldEvent"]
            newEvent = requestData["newEvent"]

            for prop in newEvent:
                if newEvent[prop] == None:
                    return HttpResponse("error")    
            
            if "~" in newEvent["title"] or "~" in newEvent["content"]:
                return HttpResponse("error")

            oldEvent["content"] = oldEvent["content"].replace("<br>", "\n")
            newEvent["content"] = newEvent["content"].replace("<br>", "\n")
            #Delete old event
            delEvent = Event.objects.filter(
                day=oldEvent["day"], hours=oldEvent["hours"], minutes=oldEvent["minutes"], month=oldEvent["month"], year=oldEvent["year"], title=oldEvent["title"], content=oldEvent["content"]
            ).first()
            delEvent.delete()

            #Add new event
            event = Event(day=newEvent["day"], hours=newEvent["hours"], minutes=newEvent["minutes"], month=newEvent["month"], year=newEvent["year"], title=newEvent["title"], content=newEvent["content"])
            event.save()
            return HttpResponse("success")

        elif requestData["reqType"] == "deleteEvent":
            oldEvent = requestData["delEvent"]
            oldEvent["content"] = oldEvent["content"].replace("<br>", "\n")

            delEvent = Event.objects.filter(
                day=oldEvent["day"], hours=oldEvent["hours"], minutes=oldEvent["minutes"], month=oldEvent["month"], year=oldEvent["year"], title=oldEvent["title"], content=oldEvent["content"]
            ).first()
            delEvent.delete()
            return HttpResponse("success")
        
        elif requestData["reqType"] == "getData":
            eventsQ = Event.objects.all()
            data = list(eventsQ)
            resultArr = []

            for item in data:
                resultArr.append(
                    {"day": item.day, "hours": item.hours, "minutes":item.minutes, "month":item.month, "year":item.year, "title":item.title, "content":item.content}
                )

            response = {
                "events": resultArr
            }
            return JsonResponse(response)

        