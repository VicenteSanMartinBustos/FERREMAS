from django.urls import path
from . import views

urlpatterns = [
    path('create-paypal-transaction/', views.create_paypal_transaction),
]
