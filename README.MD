PASO A PASO PARA DESPLEGAR LA PAGINA.

TENER DOS TERMINALES A USAR, UNA PARA EL BACKEND Y OTRA PARA EL FRONTEND,
EN CADA UNA ACCEDER AL RESPECTIVO. EJ:
-----------------------------
ETAPA1_FERREMAS\frontend>
ETAPA1_FERREMAS\backend>
-----------------------------

despues de eso correr en el backend: "python manage.py runserver"
despues de eso correr en el frontend: "ng serve"

la vista del frontend estara visible altiro, usando el puerto 4200.
la vista del backend para ver los datos de productos, tienen que ir a: 
http://127.0.0.1:8000/api/productos/ y ahi podran ver el id, nombre, descripcion, precio, stock
e imagen. 

IMPORTANTE: no crear productos a partir del backend, solo de la vista del frontend.


-----BASE DE DATOS----
instalar la extension de SQlite en VScode, el autor es alexcvzz, ahi tambien podran ver los datos.
para verlo, abajo al lado de la configuracion, sale algo llamado "SQLITE EXPLORER" y ahi pueden ver todo
la tabla se llama "productos_producto".
----------------------------------------------------------------------------------------------------------------------------------

08/05/2025, hora: 12:09 PM.

inicializar proyecto con antes dicho, ahora existe en el backend dos vistas mas: usuario register y usuario login.
para acceder a register es : http://127.0.0.1:8000/api/usuarios/registro/ y para login: http://127.0.0.1:8000/api/usuarios/login/
NOTA: los usuarios se estan manejando en otra app del backend, no esta en la carpeta 'productos', esta en la carpeta 'usuarios'.

PARA HACER: 
En el frontend hacer que los links funcionen, usando el standalone se tienen problemas con el 'routerlink' en el html del angular,
por ello se debe implementar un metodo que se quede en el .ts del header, que se encuentra en la carpeta 'shared'

asignar los registro e inicio de sesion del administrador, clientes, bodeguero y contador. cada uno con sus respectivas restricciones y no.

crear el crud de usuarios, este debe ser parecido al crud de productos, con un copy paste bien hecho deberia de funcionar.

agregar la api del dolar para que los productos se muestren en dolares, puede ser una conversion de CLP a DLR o etc..

IMPORTANTE: proceder al pago lo dejaremos al final, ya que tambien requiere implementar ciertas reglas especificas.

!: RESPETAR LAS REGLAS DE NEGOCIO DE LOS DOCX DEL CASO.
------------------------------------------------------------------------------------------------
09/05/2025 22:29

por hacer: 

1) En el apartado de carrito, si un producto se queda sin stock, en el boton de agregar, deja
   agregar mas productos (por ej si pintura roja tiene stock de 8, en el localhost:4200/carrito, deja agregar mas productos de los que existen, arreglar eso.)

2) Implementar el apartado de "ver cuenta", tiene que mostrar: nombre, contraseña con el visibility apagado por default y el email.
3) añadir las cuentas de los usuarios con sus respectivos permisos.
4) hacer mantenedor (crud) de los usuarios
5) hacer apartado de "olvidaste tu contraseña" para reestablecerla (se puede usar una api sencilla)

eso es todo.