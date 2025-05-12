from rest_framework import generics
from .models import Usuario
from .serializers import UsuarioSerializer, RegistroClienteSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class RegistroClienteAPIView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroClienteSerializer
    permission_classes = [AllowAny]

class PerfilUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
        })

