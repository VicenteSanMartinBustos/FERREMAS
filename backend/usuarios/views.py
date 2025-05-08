from rest_framework import generics
from .models import Usuario
from .serializers import UsuarioSerializer, RegistroClienteSerializer
from rest_framework.permissions import AllowAny

class RegistroClienteAPIView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroClienteSerializer
    permission_classes = [AllowAny]

