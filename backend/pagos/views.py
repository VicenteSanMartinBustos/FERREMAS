from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import uuid

@csrf_exempt
def create_paypal_transaction(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        total = data.get('total')

        order_id = str(uuid.uuid4())
        return JsonResponse({
            'orderID': order_id,
            'total': total
        })
    return JsonResponse({'error': 'Método no permitido'}, status=405)
