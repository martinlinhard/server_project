from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    day = models.IntegerField()
    hours = models.IntegerField()
    minutes = models.IntegerField()
    month = models.IntegerField()
    year = models.IntegerField()

    title = models.CharField(max_length=100)
    content = models.TextField()
