# Geometry Explorer

Sitio web educativo interactivo y animado por scroll que guía a los estudiantes a través de la progresión de figuras geométricas — desde un punto sin dimensiones hasta un polígono de N lados — con dibujos SVG animados, fórmulas reveladas al desplazarse, paralaje con el mouse y soporte bilingüe.

---

## Vista previa local

Abre `index.html` directamente en cualquier navegador moderno, o sírvelo localmente:

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
| Build | Ninguno — archivo `.html` único, sin dependencias |

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

---

## Estructura de Archivos

```
ciencias_naturales/
├── index.html          # Toda la app — HTML + CSS + JS en un solo archivo
├── README.md           # Documentación en inglés
├── README.es.md        # Este archivo (Español)
├── LESSON.md           # Tutorial paso a paso: cómo construir esto desde cero
└── .git/               # Repositorio Git
```

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
