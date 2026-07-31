from rest_framework.views import APIView
from rest_framework.response import Response  # Json döndürmek için
from rest_framework import status
from datetime import datetime, timedelta
from .models import Service, Personnel, Appointment, Customer
from .serializers import ServiceSerializer, PersonnelSerializer, AppointmentSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token


class RegisterAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Kullanıcı adı ve şifre zorunlu."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Bu kullanıcı adı zaten alınmış."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username}, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Kullanıcı adı veya şifre hatalı."}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class UpdateAppointmentStatusAPIView(APIView):
    """PATCH /api/appointments/<id>/status/   body: {"status": "approved"}"""
    def patch(self, request, pk):
        try:
            appointment = Appointment.objects.get(id=pk)
        except Appointment.DoesNotExist:
            return Response({"error": "Randevu bulunamadı."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        valid_statuses = [choice[0] for choice in Appointment.STATUS_CHOICES]

        if new_status not in valid_statuses:
            return Response({"error": "Geçersiz durum."}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = new_status
        appointment.save()
        return Response(AppointmentSerializer(appointment).data)


class TestAPIView(APIView):
    def get(self, request):
        return Response({
            "message": "Backend çalışıyor!"
        })


class ServiceListAPIView(APIView):
    def get(self, request):
        services = Service.objects.filter(is_active=True)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)


class PersonnelListAPIView(APIView):
    def get(self, request):
        personnels = Personnel.objects.filter(is_active=True)
        serializer = PersonnelSerializer(personnels, many=True)
        return Response(serializer.data)


class AppointmentListAPIView(APIView):
    def get(self, request):
        appointments = Appointment.objects.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class AvailableSlotsAPIView(APIView):
    """
    Personel, hizmet ve tarihe göre boş slotları hesaplar.
    İstek örneği: GET /api/available-slots/?personnel=1&service=1&date=2026-07-22
    """
    def get(self, request):
        personnel_id = request.query_params.get("personnel")
        service_id = request.query_params.get("service")
        date_str = request.query_params.get("date")

        if not all([personnel_id, service_id, date_str]):
            return Response({"error": "Eksik parametre!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            personnel = Personnel.objects.get(id=personnel_id)
            service = Service.objects.get(id=service_id)
            appointment_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except (Personnel.DoesNotExist, Service.DoesNotExist, ValueError):
            return Response({"error": "Geçersiz bilgi!"}, status=status.HTTP_400_BAD_REQUEST)

        # O tarihteki dolu randevuları getir
        existing_appointments = Appointment.objects.filter(
            personnel=personnel,
            appointment_date=appointment_date
        ).exclude(status="cancelled")

        slots = []
        duration = service.duration_minutes
        
        # Personelin mesai başlangıç ve bitiş zamanı
        curr_dt = datetime.combine(appointment_date, personnel.working_start)
        end_dt = datetime.combine(appointment_date, personnel.working_end)

        # Slot oluştur ve doluluğunu kontrol et
        while curr_dt + timedelta(minutes=duration) <= end_dt:
            slot_start = curr_dt.time()
            slot_end = (curr_dt + timedelta(minutes=duration)).time()

            # Çakışma kontrolü
            is_booked = False
            for app in existing_appointments:
                if max(slot_start, app.start_time) < min(slot_end, app.end_time):
                    is_booked = True
                    break

            slots.append({
                "start_time": slot_start.strftime("%H:%M"),
                "end_time": slot_end.strftime("%H:%M"),
                "is_available": not is_booked
            })

            curr_dt += timedelta(minutes=duration)

        return Response(slots)


class CreateAppointmentAPIView(APIView):
    """
    Yeni randevu oluşturur (Müşteri yoksa otomatik kaydeder).
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            customer_name = data.get("customer_name")
            customer_phone = data.get("customer_phone")
            customer_email = data.get("customer_email")
            personnel_id = data.get("personnel_id")
            service_id = data.get("service_id")
            appointment_date = data.get("appointment_date")
            start_time_str = data.get("start_time")

            service = Service.objects.get(id=service_id)
            personnel = Personnel.objects.get(id=personnel_id)

            start_time = datetime.strptime(start_time_str, "%H:%M").time()
            start_dt = datetime.combine(datetime.strptime(appointment_date, "%Y-%m-%d").date(), start_time)
            end_time = (start_dt + timedelta(minutes=service.duration_minutes)).time()

            
            customer, _ = Customer.objects.get_or_create(
                phone=customer_phone,
                defaults={
                    "name": customer_name,
                    "email": customer_email,
                },
            )
            if not created and customer.email != customer_email:
                customer.email = customer_email
                customer.save()

            existing = Appointment.objects.filter(
                personnel=personnel,
                appointment_date=appointment_date,
                start_time=start_time
            ).exclude(status="cancelled")

            if existing.exists():
                return Response(
                    {"error": "Bu saat dolu."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            appointment = Appointment.objects.create(
                user=request.user,
                customer=customer,
                personnel=personnel,
                service=service,
                appointment_date=appointment_date,
                start_time=start_time,
                end_time=end_time,
                status="pending"
            )

            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MyAppointmentsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = AppointmentSerializer(
            appointments,
            many=True
        )

        return Response(serializer.data)