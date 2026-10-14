# 🌐 Proyecto Playwright BDD - Wikipedia Automation

Este proyecto utiliza un enfoque de **Behavior-Driven Development (BDD)** combinando Playwright con `playwright-bdd`. Esto permite escribir las pruebas en lenguaje natural (Gherkin) y ejecutarlas como tests automatizados.

## 🚀 Guía de Comandos Rápidos

Para evitar confusiones con la configuración de los binarios, utiliza estrictamente los siguientes comandos:

### 1. Generación de Tests (`bddgen`)

El archivo `.feature` contiene la descripción del negocio, pero Playwright necesita archivos `.spec.js` para ejecutarlos.

**Cuándo ejecutarlo:**

- ⚠️ **OBLIGATORIO:** Cada vez que modifiques el texto, agregues un paso o cambies la estructura de cualquier archivo `.feature`.
- **NO ES NECESARIO:** Si solo cambiaste la lógica en los archivos de `pages` o `steps`.

**Comando:**

```bash
pnpm exec bddgen
```

_Nota: No agregues la palabra `generate` al final, el comando ya la incluye internamente._

### 2. Ejecución de Pruebas (con Quality Gates, Historial y Auto-Limpieza)

Cada ejecución limpia automáticamente resultados temporales para evitar mezclar navegadores, preservando el historial acumulado en `allure-history/`:

**A. Ejecutar en Chromium:**

```bash
pnpm test:chromium
```

_O ejecutar y abrir reporte Allure automáticamente:_

```bash
pnpm test:chromium:open
```

**B. Ejecutar por Ambiente (Filtrado Dinámico):**
Para ejecutar solo los tests de un ambiente específico y clasificarlos correctamente en el reporte de Allure, utiliza el prefijo `ENV=nombre_ambiente` y la etiqueta `--grep @tag`:

```bash
# Ejemplo para QA
ENV=qa pnpm test:chromium --grep @qa

# Ejemplo para Desarrollo
ENV=dev pnpm test:chromium --grep @dev

# Ejemplo para Release
ENV=release pnpm test:chromium --grep @release
```

**C. Ejecutar en Firefox:**

```bash
pnpm test:firefox
```

**D. Ejecutar en WebKit (Safari):**

```bash
pnpm test:webkit
```

**E. Ejecutar Pruebas de API (Backend / Keycloak):**

```bash
pnpm test:api
```

**F. Ejecución Total (Suite completa):**

```bash
pnpm test
```

_O ejecutar todos y abrir reporte automáticamente:_

```bash
pnpm test:open
```

**F. Modo Interfaz Visual de Playwright (UI Mode):**

```bash
pnpm test:ui
```

_Para filtrar por ambiente en modo UI:_

```bash
ENV=qa pnpm exec playwright test --ui --project=chromium --grep @qa
```

**G. Modo Debugging (Paso a Paso):**
Abre el navegador y el Inspector de Playwright para ejecutar el test línea por línea.

```bash
pnpm test:debug
```

_Para debuguear un ambiente específico:_

```bash
ENV=qa pnpm exec playwright test --debug --project=chromium --grep @qa
```

**H. Grabación de Trazas (Trace Viewer):**
El Trace graba toda la ejecución (acciones, red, consola). Por defecto está en `on-first-retry`, pero puedes forzarlo:

```bash
pnpm exec playwright test --trace on
```

---

---

### 3. Reportes de Resultados

**A. Reporte Nativo de Playwright (Default):**

```bash
pnpm report
```

**B. Reporte Allure Single-File (Autónomo en un solo archivo para compartir):**

```bash
pnpm report:single
pnpm report:single:open
# O generar y abrir en un solo comando:
pnpm report:single:flow
```

**C. Reporte Allure Estándar:**

```bash
pnpm report:allure
pnpm report:allure:open
```

---

### 4. Quality Gates (Validación de Calidad)

Allure 3 incluye soporte **nativo** para Quality Gates configurado directamente en [`allurerc.mjs`](file:///Users/alexgv/Documents/Pwright-bdd1.0/allurerc.mjs):

```javascript
export default defineConfig({
  qualityGate: {
    rules: [
      {
        maxFailures: 0, // 0 fallos permitidos
        successRate: 1.0, // 100% de éxito (1.0 = 100%)
        minTestsCount: 1, // Mínimo de pruebas ejecutadas requeridas
      },
    ],
  },
});
```

**Comando para ejecutar la validación:**

```bash
pnpm quality-gate
```

---

### 5. Etiquetas (Tags & Labels) en BDD

En los archivos `.feature` puedes agregar metadatos que Allure organiza automáticamente en los reportes:

```gherkin
@smoke @ui @wikipedia
@allure.label.owner:Alex
@allure.label.epic:Wikipedia
@allure.label.feature:Búsqueda
@allure.label.severity:critical
Característica: Búsqueda en Wikipedia

  @allure.label.story:Búsqueda_Página_Principal
  Escenario: Buscar un término en la página principal
    ...
```

## 🛠️ Flujo de Trabajo Recomendado

Sigue este ciclo paso a paso para desarrollar, probar y compartir resultados:

1. **Modificar el `.feature`** (si agregas o editas escenarios) $\rightarrow$ Correr:
   ```bash
   pnpm bdd:gen
   ```
2. **Ejecutar la prueba** (evalúa Quality Gates, limpia temporales y acumula Historial):
   ```bash
   pnpm test:chromium
   ```
3. **Analizar el resultado en Allure 3 en vivo:**
   ```bash
   pnpm report:ci
   ```
4. **Generar y abrir el reporte Single-File para compartir:**
   ```bash
   pnpm report:single
   pnpm report:single:open
   ```

## 📌 Notas Técnicas

- **Quality Gate:** Se evalúa de forma nativa en cada corrida. Si alguna regla falla (ej. fallos > 0 o éxito < 100%), la corrida termina con código de error.
- **Historial (Trends):** Se preserva automáticamente en `allure-history/history.jsonl` aun cuando se limpien los temporales.
- **Strict Mode:** Playwright lanza un error si encuentra más de un elemento con el mismo selector. Usa `.first()` en los locators para resolver empates.
- **Title Validation:** Para evitar fallos por títulos dinámicos (ej. "Portada - Wikipedia"), utiliza `expect(await page.title()).toContain("texto")` o `expect(page).toHaveTitle(...)`.
