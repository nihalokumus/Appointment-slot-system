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
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model

class RegisterAPIView(APIView):

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response(
                {"error": "Kullanıcı adı, e-posta ve şifre zorunludur."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Bu kullanıcı adı zaten alınmış."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Bu e-posta adresi zaten kayıtlı."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=False
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        verification_link = (
            f"http://localhost:5173/verify-email/{uid}/{token}"
        )

        send_mail(
            subject="E-posta Doğrulama",
            message=(
                f"Merhaba {username},\n\n"
                f"Hesabınızı aktifleştirmek için aşağıdaki bağlantıya tıklayın:\n\n"
                f"{verification_link}\n\n"
                f"E-posta doğrulamasını tamamladıktan sonra giriş yapabilirsiniz."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Kayıt başarılı. E-posta adresinizi doğrulayın."
            },
            status=status.HTTP_201_CREATED
        )


class LoginAPIView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = User.objects.filter(username=username).first()

        if user and not user.is_active:
            return Response(
                {
                    "error": "E-posta adresinizi doğrulamadan giriş yapamazsınız."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            username=username,
            password=password
        )

        if not user:
            return Response(
                {"error": "Kullanıcı adı veya şifre hatalı."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "username": user.username
        })


class VerifyEmailAPIView(APIView):

    def get(self, request, uidb64, token):

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Geçersiz doğrulama bağlantısı."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"error": "Doğrulama bağlantısı geçersiz veya süresi dolmuş."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = True
        user.save()

        return Response({
            "message": "E-posta adresiniz başarıyla doğrulandı."
        })



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
            appointment_date_obj = datetime.strptime(
                appointment_date,
                "%Y-%m-%d",
            ).date()

            if appointment_date_obj < datetime.today().date():
                return Response(
                    {
                        "error": "Geçmiş tarihe randevu oluşturamazsınız."
             },
             status=status.HTTP_400_BAD_REQUEST,
            )


            start_time_str = data.get("start_time")

            service = Service.objects.get(id=service_id)
            personnel = Personnel.objects.get(id=personnel_id)

            start_time = datetime.strptime(start_time_str, "%H:%M").time()
            start_dt = datetime.combine(datetime.strptime(appointment_date, "%Y-%m-%d").date(), start_time)
            end_time = (start_dt + timedelta(minutes=service.duration_minutes)).time()

            
            customer, created = Customer.objects.get_or_create(
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
                appointment_date=appointment_date_obj,
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
                appointment_date=appointment_date_obj,
                start_time=start_time,
                end_time=end_time,
                status="pending"
            )
            send_mail(
            subject="Randevunuz Oluşturuldu",
            message=(
                f"Merhaba {customer.name},\n\n"
                f"Randevunuz başarıyla oluşturuldu.\n\n"
                f"Hizmet: {service.name}\n"
                f"Personel: {personnel.name}\n"
                f"Tarih: {appointment_date}\n"
                f"Saat: {start_time.strftime('%H:%M')}\n"
                f"Durum: Bekliyor\n\n"
                f"Randevunuzu uygulamadan takip edebilirsiniz."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.email],
            fail_silently=False,
        )

            serializer = AppointmentSerializer(appointment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MyAppointmentsAPIView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        appointments = (
            Appointment.objects
            .filter(user=request.user)
            .select_related( #Eğer select_related kullanmazsan Django her satır için tekrar tekrar veritabanına gider.
                "customer",
                "personnel",
                "service",
            )
            .order_by("-appointment_date", "-start_time")
        )

        serializer = AppointmentSerializer(
            appointments,
            many=True,
        )

        return Response(serializer.data)

class CancelAppointmentAPIView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):

        try:
            appointment = Appointment.objects.get(
                id=appointment_id,
                user=request.user,
            )

        except Appointment.DoesNotExist:
            return Response(
                {"error": "Randevu bulunamadı."},
                status=status.HTTP_404_NOT_FOUND,
            )

        appointment.status = "cancelled"
        appointment.save()

        serializer = AppointmentSerializer(appointment)

        return Response(serializer.data)

class DashboardAPIView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        appointments = Appointment.objects.filter(
            user=request.user
        )

        data = {
            "total": appointments.count(),

            "pending": appointments.filter(
                status="pending"
            ).count(),

            "approved": appointments.filter(
                status="approved"
            ).count(),

            "cancelled": appointments.filter(
                status="cancelled"
            ).count(),
        }

        return Response(data)