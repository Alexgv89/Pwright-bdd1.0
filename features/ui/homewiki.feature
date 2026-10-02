#language: es


@allure.label.owner:Alex
@allure.label.epic:Wikipedia
@allure.label.feature:Búsqueda
@allure.label.severity:critical
@smoke @ui @wikipedia
Característica: Búsqueda en Wikipedia

@allure.label.story:Búsqueda_Página_Principal
Escenario: Buscar un término en la página principal
Dado que el usuario navega a la página principal de Wikipedia "/" con el titulo "Wikipedia, la enciclopedia libre"
Cuando busca el término "automation" en la barra de búsqueda
Entonces el título de la página debe contener "Resultados de la búsqueda para «automation» - Wikipedia, la enciclopedia libre"