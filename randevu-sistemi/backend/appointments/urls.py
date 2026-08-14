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
    MyAppointmentsAPIView,
    CancelAppointmentAPIView,
    DashboardAPIView,
    VerifyEmailAPIView,
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
    path("appointments/<int:appointment_id>/cancel/",CancelAppointmentAPIView.as_view(),),
    path("dashboard/", DashboardAPIView.as_view()),
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path("verify-email/<uidb64>/<token>/", VerifyEmailAPIView.as_view()),
]

