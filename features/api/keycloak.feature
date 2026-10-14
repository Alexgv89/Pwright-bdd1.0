#language: es

@allure.label.owner:Alex
@allure.label.epic:Seguridad_y_Accesos
@allure.label.feature:Keycloak_Auth
@allure.label.severity:critical
@api @smoke @regression
Característica: Autenticación y Gestión de Usuarios en Keycloak API

  @allure.label.story:US-2045_Obtener_Token_Admin
  @allure.label.workitem:2045
  @AB#2045
  @tms:9100
  Escenario: Obtener token de acceso para el usuario administrador
    Dado que el servicio de Keycloak se encuentra activo en "http://localhost:8080"
    Cuando solicito el token de acceso con usuario "admin" y contraseña "admin" en el realm "master"
    Entonces la respuesta debe tener el código de estado 200
    Y la respuesta debe contener un token de acceso válido de tipo "Bearer"

  @allure.label.story:US-2046_Consultar_Usuarios_Admin
  @allure.label.workitem:2046
  @AB#2046
  @tms:9101
  Escenario: Consultar lista de usuarios con token de administrador
    Dado que he obtenido un token de acceso válido de administrador
    Cuando consulto la lista de usuarios del realm "master"
    Entonces la respuesta debe tener el código de estado 200
    Y la lista de usuarios debe contener al usuario "admin"
