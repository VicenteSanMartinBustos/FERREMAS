from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

def procesar_imagen(imagen):
    im = Image.open(imagen)
    im = im.convert('RGB')
    im = im.resize((600, 600))  # Cambia el tamaño
    buffer = BytesIO()
    im.save(fp=buffer, format='JPEG')
    return ContentFile(buffer.getvalue(), name=imagen.name)

def create(self, request, *args, **kwargs):
        if 'imagen' in request.FILES:
            request.FILES['imagen'] = self.procesar_imagen(request.FILES['imagen'])
        return super().create(request, *args, **kwargs)

def update(self, request, *args, **kwargs):
    if 'imagen' in request.FILES:
        request.FILES['imagen'] = self.procesar_imagen(request.FILES['imagen'])
        return super().update(request, *args, **kwargs)