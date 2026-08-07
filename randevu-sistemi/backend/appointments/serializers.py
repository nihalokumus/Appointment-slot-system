from rest_framework import serializers
from .models import Service, Personnel, Appointment


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class PersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    personnel_name = serializers.CharField(
        source="personnel.name",
        read_only=True
    )

    service_name = serializers.CharField(
        source="service.name",
        read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "appointment_date",
            "start_time",
            "end_time",
            "status",

            "customer_name",
            "personnel_name",
            "service_name",
        ]