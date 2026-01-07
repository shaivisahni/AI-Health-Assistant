from django.urls import path
from .views import suggest

urlpatterns = [
    path("suggest/", suggest),
]
