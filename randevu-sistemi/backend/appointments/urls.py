from django.urls import path
from .views import (
    TestAPIView,
    ServiceListAPIView,
    PersonnelListAPIView,
    AvailableSlotsAPIView,
    CreateAppointmentAPIView,
    RegisterAPIView,
    LoginAPIView,
    UpdateAppointmentStatusAPIView,
    MyAppointmentsAPIView,  # <--- Sadece bu satır eksikti
)

urlpatterns = [
    path("test/", TestAPIView.as_view()),
    path("services/", ServiceListAPIView.as_view()),
    path("personnels/", PersonnelListAPIView.as_view()),
    path("available-slots/", AvailableSlotsAPIView.as_view()),
    path("create-appointment/", CreateAppointmentAPIView.as_view()),
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("my-appointments/", MyAppointmentsAPIView.as_view()),
    path("appointments/<int:pk>/status/", UpdateAppointmentStatusAPIView.as_view()),
]