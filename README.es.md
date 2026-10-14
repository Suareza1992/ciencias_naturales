# Geometry Explorer

Sitio web educativo interactivo y animado por scroll en cuatro materias — **Geometría**, **Precálculo**, **Cálculo** y **Álgebra Lineal** — con dibujos y gráficas SVG animadas, fórmulas reveladas al desplazarse, explicaciones a fondo, laboratorios interactivos, ejercicios con verificación, paralaje con el mouse y soporte en inglés y español.

| Página | Materia | Contenido |
|---|---|---|
| `index.html` | Geometría | Punto → Octágono, slider del polígono N, 27 ejercicios |
| `precalculus.html` | Precálculo | 14 temas, Transformador de Funciones, 42 ejercicios |
| `calculus.html` | Cálculo | 15 temas, Laboratorio de Derivadas e Integrales, 45 ejercicios |
| `linear-algebra.html` | Álgebra Lineal | 16 temas enfocados en AR/VR, Laboratorio de Transformaciones, 192 ejercicios generados de completar matrices (ilimitados con Nuevo ↻ / + Más) |

Las páginas se enlazan entre sí desde el menú (selector de materia) y con un botón “Siguiente materia” al final de cada página. El idioma elegido se recuerda entre páginas.

---

## Vista previa local

Abre cualquiera de las páginas directamente en un navegador moderno, o sirve la carpeta localmente:

```bash
npx serve .
```

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Estructura | HTML5 semántico |
| Estilos | CSS3 puro (variables, grid, scroll-snap, transiciones) |
| Lógica | JavaScript puro (ES2020, sin frameworks ni bundlers) |
| Fuentes | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) vía Google Fonts |
| Gráficos | SVG en línea (generado dinámicamente por JS) |
| Animaciones | CSS `stroke-dashoffset`, `transform`, transiciones de `opacity` |
| Scroll | `IntersectionObserver` + seguimiento manual de progreso de scroll |
| Anclaje | CSS `scroll-snap-type: y proximity` |
| Build | Ninguno — sin bundler, sin paquetes npm, sin librería de matemáticas |

---

## Características

- **8 secciones de figuras** — Punto, Segmento, Triángulo, Cuadrado, Pentágono, Hexágono, Heptágono, Octágono
- **Revelación de fórmulas por scroll** — cada sección mide 260 vh; las fórmulas aparecen progresivamente al desplazarse
- **Animación de trazo SVG** — `stroke-dashoffset` se anima desde la longitud total hasta `0` al entrar al viewport, dibujando la figura trazo a trazo
- **Paralaje con el mouse** — el canvas de la figura sigue la posición del cursor y aplica una inclinación sutil de `rotateX / rotateY` mediante `perspective` CSS
- **Secciones pegajosas** — `position: sticky` mantiene la figura + fórmulas en pantalla mientras la sección exterior se desplaza
- **Scroll snap** — `scroll-snap-type: y proximity` crea un efecto magnético suave al inicio de cada sección
- **Polígono N interactivo** — un slider (3–30 lados) regenera el polígono SVG y recalcula todas las fórmulas en tiempo real
- **Menú de navegación hamburguesa** — overlay de panel dividido con dos pestañas (**Figuras** y **Ejercicios**), inspirado en el menú del sitio de GTA VI; cada pestaña lista las 9 figuras y desplaza directamente a la sección o grupo de ejercicios elegido; X para cerrar, clic fuera para cerrar
- **Toggle bilingüe EN / ES** — todas las etiquetas, descripciones de fórmulas, nombres de figuras, etiquetas de pestañas y texto de ejercicios cambian instantáneamente sin recargar la página
- **Paleta Night Sky** — cada sección tiene un tinte de fondo atmosférico único, con gradientes entre secciones adyacentes
- **Sección de Ejercicios interactivos** — 27 problemas agrupados por figura (3 por figura), verificación de respuestas en tiempo real con tolerancia ±0.015 para decimales, pista revelada tras 2 intentos fallidos, contador de puntaje persistente, completamente bilingüe
- **Botón volver al inicio** — aparece solo al llegar a la sección del Polígono N o a los Ejercicios

### Páginas de Precálculo y Cálculo

- **29 temas** — Precálculo: Funciones, Lineal y Cuadrática, Polinomios, Racionales, Exponenciales, Logaritmos, Círculo Unitario, Gráficas Trigonométricas, Identidades, Ley de Senos y Cosenos, Vectores, Polares y Complejos, Secciones Cónicas, Sucesiones y Series. Cálculo: Límites, Continuidad, La Derivada, Reglas de Derivación, Regla de la Cadena e Implícita, Derivadas Trascendentes, Trazado de Curvas, Optimización y Razones Relacionadas, L’Hôpital, Sumas de Riemann, Teorema Fundamental, Técnicas de Integración, Área y Volumen, Ecuaciones Diferenciales, Series de Taylor
- **El mismo patrón de scroll pegajoso que Geometría** — cada tema mide 260 vh; su gráfica se dibuja sola y 4 tarjetas de fórmulas aparecen al desplazarse
- **Gráficas de funciones en lugar de polígonos** — cada tema tiene una figura (asíntotas, rectas tangentes, rectángulos de Riemann, campos de pendientes, polinomios de Taylor…) dibujada con `stroke-dashoffset`
- **“A Fondo” después de cada tema** — La Idea Central, Por Qué Funciona, Errores Comunes, un Ejemplo Resuelto paso a paso y Dónde Lo Verás
- **Transformador de Funciones** (Precálculo) — elige x², x³, √x, |x|, sen x, eˣ o 1/x y mueve a, b, h, k en `y = a·f(b(x − h)) + k`; cada cambio se explica en palabras
- **Laboratorio de Derivadas e Integrales** (Cálculo) — mueve x₀ para ver la recta tangente y f′(x₀); sube n para ver cómo los rectángulos izquierdos/medios/derechos convergen a la integral exacta
- **Verificación de respuestas más flexible** — acepta decimales, comas, fracciones (`3/4`) y π (`pi`, `2pi`, `-pi/3`)

### Página de Álgebra Lineal (pensada para AR/VR y gráficos 3D)

- **16 temas** — Vectores en 3D, Producto Punto, Producto Cruz, Matrices y Operaciones, Multiplicación de Matrices, Sistemas y Eliminación, Determinantes, Matrices Inversas, Transformaciones 2D, Rotaciones 3D, Coordenadas Homogéneas (4×4 / TRS), Cambio de Base (espacio local/mundo/vista), Ortogonalidad y Gram–Schmidt, Matrices de Proyección, Valores y Vectores Propios, Cuaterniones. Cada “A Fondo” termina con cómo se usa el tema en motores de AR/VR
- **Ejercicios de completar matrices** — cada tarjeta muestra las matrices dadas y una matriz respuesta con celdas vacías para escribir. Verificar colorea cada celda verde/roja; **Ver respuesta** llena las celdas; **Ver pasos** explica cómo se calcula cada entrada (sumas fila-por-columna, cada operación de fila de Gauss–Jordan con la matriz intermedia, matrices de cofactores y adjunta, productos de Hamilton…)
- **Fácil / Medio / Difícil** — 4 de cada uno por tema (192 en total), con filtro de dificultad
- **Práctica ilimitada** — los ejercicios los producen **generadores**: **Nuevo ↻** cambia una tarjeta por un problema nuevo y **+ Más ejercicios** agrega tres más a un tema
- **Matemática exacta** — las soluciones se calculan con fracciones exactas y cada generador está probado automáticamente
- **Laboratorio de Transformaciones** — una matriz 4×4 editable mueve un cubo 3D; los ajustes se pueden componer (M ← P·M) y la página explica qué hace la matriz actual

---

## Estructura de Archivos

```
ciencias_naturales/
├── index.html              # Geometría — HTML + CSS + JS en un solo archivo (el original)
├── precalculus.html        # Página de Precálculo: textos del hero + Explorer.init(...)
├── precalculus-topics.js   # Datos de Precálculo: 14 temas (gráfica, fórmulas, A Fondo, ejercicios)
├── precalculus-lab.js      # Transformador de Funciones
├── calculus.html           # Página de Cálculo: textos del hero + Explorer.init(...)
├── calculus-topics.js      # Datos de Cálculo: 15 temas
├── calculus-lab.js         # Laboratorio de Derivadas e Integrales
├── linear-algebra.html     # Página de Álgebra Lineal
├── linear-algebra-topics.js    # 16 temas (gráficas, fórmulas, A Fondo)
├── linear-algebra-exercises.js # GENERADORES de ejercicios: fácil/medio/difícil por tema, con pasos
├── linear-algebra-lab.js       # Laboratorio de Transformaciones (matriz 4×4 + cubo)
├── shared/
│   ├── explorer.css        # Estilos de las dos páginas nuevas
│   ├── explorer.js         # Motor: construye hero, temas, A Fondo, ejercicios, menú, EN/ES
│   ├── graph.js            # Mini ayudante de gráficas: coordenadas matemáticas → SVG
│   └── matrix-practice.js  # Interfaz de completar matrices, fracciones exactas, aleatoriedad con semilla
├── README.md               # Documentación en inglés
├── README.es.md            # Este archivo (Español)
├── LESSON.md               # Tutorial paso a paso (los Pasos 16–20 explican el motor)
└── PLAN-precalc-calc.md    # El plan de construcción de Precálculo y Cálculo
```

### Agregar un tema

Los temas son solo datos. Para agregar uno, añade un objeto a `PRECALC_TOPICS` o `CALC_TOPICS` con `id`, `color`, `tag`, `name`, `graph()`, `formulas`, `deep` y `exercises` (mira el ejemplo en `README.md`). El motor construye la sección, el “A Fondo”, los enlaces del menú y el grupo de ejercicios automáticamente. Dentro del texto, encierra las matemáticas entre comillas invertidas (`` `x²` ``) para darles estilo de fórmula.

### Secciones de la página (en orden de scroll)
1. **Hero** — título a pantalla completa
2. **Secciones de figuras × 8** — Punto → Octágono, cada una de 260 vh con contenido pegajoso
3. **Polígono N** — slider de polígono interactivo
4. **Ejercicios** — 27 problemas de práctica agrupados por figura
5. **Pie de página**

---

## Cómo Funciona — Referencia Rápida

### Secciones de figuras
Cada sección es un elemento `<section class="shape-section">` de **260 vh de alto**. Dentro vive un `<div class="sticky-wrapper">` con `position: sticky; top: 0; height: 100vh`. Esto mantiene el contenido fijo en pantalla mientras la sección exterior se desplaza, creando el espacio de scroll necesario para revelar las fórmulas una a una.

### Revelación de fórmulas
Un listener de `scroll` calcula `progreso = -rect.top / (altura_sección - alto_viewport)` (0 → 1). Cada tarjeta de fórmula recibe su clase `.visible` en umbrales distribuidos uniformemente a lo largo de ese rango.

### Dibujo SVG
Cuando una sección entra al viewport, `path.getTotalLength()` mide el perímetro del polígono y asigna `stroke-dasharray = stroke-dashoffset = longitud`. Una transición CSS anima `stroke-dashoffset` a `0`, dibujando el trazo.

### Matemática del polígono N
Todos los vértices de un polígono regular se calculan con:
```
x = cx + R · cos(2πi/n − π/2)
y = cy + R · sin(2πi/n − π/2)
```
El área, el ángulo interior y la suma de ángulos se actualizan reactivamente desde el valor del slider.

---

## Inspiración

El diseño visual y el patrón de animación por scroll están inspirados en el [sitio web de GTA VI de Rockstar Games](https://www.rockstargames.com/VI) — construido con Next.js App Router, animaciones CSS por scroll y secciones pegajosas.

---

## Licencia

MIT — libre para usar y modificar con fines educativos.
