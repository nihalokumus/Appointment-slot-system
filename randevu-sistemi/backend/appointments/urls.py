from django.urls import path

from .views import (
    TestAPIView,
    ServiceListAPIView,
    PersonnelListAPIView,
    AvailableSlotsAPIView,
    CreateAppointmentAPIView,
    RegisterAPIView,
    LoginAPIView,
    VerifyEmailAPIView,
    UpdateAppointmentStatusAPIView,
    MyAppointmentsAPIView,
    CancelAppointmentAPIView,
    DashboardAPIView,
)

urlpatterns = [
    path("test/", TestAPIView.as_view()),

    # Hizmet / personel
    path("services/", ServiceListAPIView.as_view()),
    path("personnels/", PersonnelListAPIView.as_view()),
    path("available-slots/", AvailableSlotsAPIView.as_view()),

    # Randevu
    path("create-appointment/", CreateAppointmentAPIView.as_view()),
    path("my-appointments/", MyAppointmentsAPIView.as_view()),
    path(
        "appointments/<int:pk>/status/",
        UpdateAppointmentStatusAPIView.as_view(),
    ),
    path(
        "appointments/<int:appointment_id>/cancel/",
        CancelAppointmentAPIView.as_view(),
    ),

    # Kimlik doğrulama
    path("register/", RegisterAPIView.as_view()),
    path("login/", LoginAPIView.as_view()),
    path(
        "verify-email/<uidb64>/<token>/",
        VerifyEmailAPIView.as_view(),
    ),

    # Dashboard
    path("dashboard/", DashboardAPIView.as_view()),
]