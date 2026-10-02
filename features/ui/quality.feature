#language: es

@quality @ui
Característica: Pruebas de Calidad

@quality_gate
Escenario: Validar que el Quality Gate detecte un fallo
Dado que el usuario navega a la página principal de Wikipedia "BASE" con el titulo "Wikipedia"
Entonces el sistema debe fallar la prueba de calidad