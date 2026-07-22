from django.urls import path
from .views import TestAPIView, ServiceListAPIView, PersonnelListAPIView, AppointmentListAPIView

urlpatterns = [
    path("test/", TestAPIView.as_view()),
    path("services/", ServiceListAPIView.as_view()),
    path("personnels/", PersonnelListAPIView.as_view()),
    path("appointments/", AppointmentListAPIView.as_view()),
]