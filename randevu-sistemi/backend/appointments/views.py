from rest_framework.views import APIView
from rest_framework.response import Response #Json döndürmek için
from .models import Service, Personnel, Appointment
from .serializers import ServiceSerializer, PersonnelSerializer, AppointmentSerializer

class TestAPIView(APIView):

    def get(self, request):
        return Response({
            "message": "Backend çalışıyor!"
        })
    
class ServiceListAPIView(APIView):

    def get(self, request):
        services = Service.objects.all() #Service tablosundaki bütün kayıtları getir.
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    
class PersonnelListAPIView(APIView):

    def get(self, request):
        personnels = Personnel.objects.all()
        serializer = PersonnelSerializer(personnels, many=True)
        return Response(serializer.data)
    
class AppointmentListAPIView(APIView):

    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)