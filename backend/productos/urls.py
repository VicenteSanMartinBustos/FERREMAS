from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet
from django.conf import settings
from django.conf.urls.static import static
from .views import ProductoViewSet
from .views import obtener_tipo_cambio

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('tipo_cambio/', obtener_tipo_cambio, name='tipo_cambio'),  
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)