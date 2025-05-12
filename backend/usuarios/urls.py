from django.urls import path
from .views import RegistroClienteAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from .views import PerfilUsuarioView


urlpatterns = [
    path('registro/', RegistroClienteAPIView.as_view(), name='registro'),
    path('login/', TokenObtainPairView.as_view(), name='api-login'),
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil-usuario'),
]
