# usuarios/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

class UsuarioAdmin(UserAdmin):
    model = Usuario
    list_display = ('username', 'email', 'rol', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('rol',)}),
    )

admin.site.register(Usuario, UsuarioAdmin)

