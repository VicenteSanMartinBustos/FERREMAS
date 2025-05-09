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
    
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests

@api_view(['GET'])
def obtener_tipo_cambio(request):
    try:
        response = requests.get('https://mindicador.cl/api/dolar')
        data = response.json()
        valor_dolar = data['serie'][0]['valor']
        
        # Asegúrate de devolver un JSON válido
        return JsonResponse({
            'usd_to_clp': float(valor_dolar),
            'status': 'success'
        }, json_dumps_params={'ensure_ascii': False})
        
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'status': 'error'
        }, status=500)
