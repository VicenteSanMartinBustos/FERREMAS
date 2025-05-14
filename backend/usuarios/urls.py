from django.urls import path
from .views import RegistroClienteAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.urls import path
from .views import PerfilUsuarioView
from .views import RegistroClienteAPIView, PerfilUsuarioView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import UsuarioListAPIView
from .views import UsuarioDetailAPIView


urlpatterns = [
    path('registro/', RegistroClienteAPIView.as_view(), name='registro'),
    path('login/', TokenObtainPairView.as_view(), name='api-login'),
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil-usuario'),
    path('', UsuarioListAPIView.as_view()),  # GET + POST
    path('<int:pk>/', UsuarioDetailAPIView.as_view()),  # GET + PUT + DELETE

]
