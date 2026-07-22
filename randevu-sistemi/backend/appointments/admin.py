from django.contrib import admin

from .models import Customer, Personnel, Service, Appointment

admin.site.register(Customer)
admin.site.register(Personnel)
admin.site.register(Service)
admin.site.register(Appointment)
