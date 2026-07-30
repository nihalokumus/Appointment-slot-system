from django.contrib.auth.models import User

user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)