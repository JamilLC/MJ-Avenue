# MJ Avenue Store — Guía rápida

## 1. Cómo integrarlo a tu repo

Copia estos archivos dentro de tu carpeta `MJ-Avenue` respetando la
estructura que ya tienes:

```
MJ-Avenue/
├── assets/
│   ├── logo/logo.png          ← ya lo tienes
│   └── productos/              ← ya tienes las carpetas de cada zapatilla
├── css/style.css               ← nuevo
├── js/main.js                  ← nuevo
├── data/products.json          ← nuevo
└── index.html                  ← nuevo (reemplaza el que tengas)
```

## 2. IMPORTANTE: no abras index.html con doble clic

El catálogo carga `products.json` con `fetch()`, y los navegadores
bloquean esa lectura si abres el archivo directo desde el explorador
de Windows (`file:///...`). Tienes 2 opciones:

- **VS Code**: instala la extensión "Live Server" y dale clic en
  "Go Live" abajo a la derecha.
- **GitHub Pages**: súbelo a tu repo y actívalo en
  `Settings → Pages`. Ahí sí funcionará siempre.

## 3. Ya generé los 60 productos de hombre automáticamente

A partir de tu Excel `Zapatillas_MJ.xlsx` generé los 60 productos en
`data/products.json`, incluyendo:

- **Carpeta**, **marca**, **categoría**, **modelo** y **color**, parseados
  del nombre (ej. `BASKETBALL - BREAKNET MID - WHITEBLANCO - ADIDAS`).
- **Imágenes correctas de cada producto**: descubrí que están numeradas
  de forma correlativa en todo el catálogo (no por carpeta), 4 imágenes
  por producto. El producto #16 (Breaknet Mid) usa `Imagen61/62/63/64`,
  exactamente como me indicaste — el patrón es
  `imagen = (posición_en_excel - 1) * 4 + 1`. Ya usé eso para calcular
  las 3 imágenes de galería de los 60 productos automáticamente.
- **Categorías reales detectadas**: Basketball (22), Tenis (33), Urbano (2),
  Fitness (2), Running (1). Ya actualicé el menú de categorías y los
  chips de marca (Adidas/Puma) en `index.html` para que coincidan.

### Lo que falta completar a mano

Ya le puse precio a los 60 (S/ 185 Basketball, S/ 180 Tenis, S/ 175
Urbano/Fitness/Running). Lo único que falta es el **stock y tallas**,
que solo está en la 4ta imagen de cada carpeta (la captura de pantalla),
así que no lo pude sacar del Excel:

```json
"tallas": []
```

Por cada producto, abre la 4ta imagen de su carpeta (`Imagen64.jpg` para
el caso de Breaknet Mid) y copia el stock a mano, así:

```json
"tallas": [
  { "talla": "40", "stock": 5 },
  { "talla": "41", "stock": 0 }
]
```

Si me subes las capturas de stock/tallas de varias carpetas a la vez
(aunque sean 5-10 por tanda), te ayudo a completar el archivo bastante
más rápido que modelo por modelo.

## 4. Cómo modificar los precios más adelante

Ya asigné precios por categoría en `data/products.json`:

| Categoría | Precio actual |
|---|---|
| Basketball | S/ 185 |
| Tenis | S/ 180 |
| Urbano / Fitness / Running | S/ 175 |

**Opción A — cambiar un producto puntual:**
Abre `data/products.json` con cualquier editor de texto (Notepad,
VS Code), busca el modelo por su `"nombre"` y cambia solo su
`"precio"`:

```json
"nombre": "Breaknet Mid",
"precio": 190,
```

No necesitas tocar nada más — el sitio lee el archivo cada vez que
alguien lo abre.

**Opción B — subir/bajar el precio de toda una categoría de un jalón:**
Pásame el nuevo precio (ej. "sube Basketball a 195") y te regenero el
archivo completo en segundos, sin que tengas que editar los 60 a mano.

**Oferta / descuento en un producto:**
Usa el campo `"precioAnterior"` para mostrar el precio tachado:

```json
"precio": 165,
"precioAnterior": 185,
```

## 5. Cómo agregar una zapatilla nueva más adelante

Por cada carpeta nueva dentro de `assets/productos/`, agrega un objeto en
`data/products.json` así:

```json
{
  "id": "nike-air-force-1-white",
  "carpeta": "LIFESTYLE - AIR FORCE 1 - WHITE - NIKE",
  "nombre": "Air Force 1",
  "marca": "Nike",
  "categoria": "Lifestyle",
  "color": "White",
  "precio": 399,
  "precioAnterior": null,
  "destacado": false,
  "imagenes": ["Imagen01.jpg", "Imagen02.jpg", "Imagen03.jpg"],
  "tallas": [
    { "talla": "40", "stock": 5 },
    { "talla": "41", "stock": 0 }
  ]
}
```

**Notas:**
- `"carpeta"` debe ser IDÉNTICO al nombre real de la carpeta en
  `assets/productos/` (sin "/" en el color, igual que
  `WHITEBLANCO` en vez de `WHITE/BLANCO`).
- `"marca"` hoy solo tienes `Adidas` y `Puma` en inventario de hombre
  (si agregas Nike o New Balance más adelante, avísame para sumar el
  chip de filtro en `index.html`).
- `"categoria"` debe ser una de: `Basketball`, `Tenis`, `Urbano`,
  `Fitness`, `Running` (o edítalas también en `index.html` si agregas
  una nueva).
- El stock/tallas que veías en la 4ta imagen ("Stock y tallas") de cada
  carpeta, pásalo a mano al arreglo `"tallas"` — esa imagen es solo tu
  referencia interna, no se muestra en la web.
- Cada producto usa 3 imágenes en la galería (`imagenes`), pero puedes
  poner más si quieres.

## 6. Lo que ya funciona (Fase 1 + Fase 2 + Fase 3)

- Header con logo, buscador y menú
- Hero principal
- Menú de categorías (filtra el catálogo al hacer clic)
- Catálogo dinámico leyendo `products.json`
- Galería de 3 imágenes con cambio al pasar el mouse por los puntitos
- Zoom suave de la imagen al pasar el mouse por la tarjeta
- Buscador en tiempo real (nombre, marca, categoría, color)
- Filtro por marca (chips arriba del catálogo)
- Footer con tus 2 números de WhatsApp
- Botón flotante de WhatsApp (esquina inferior derecha)
- 100% responsive (celular, tablet, escritorio)
- Orden por destacados / precio (menor a mayor / mayor a menor)
- Contador de resultados ("Mostrando X de Y pares")
- Botón "Limpiar filtros"
- Animaciones de entrada del hero y revelado en cascada de tarjetas
  al hacer scroll

## 7. Lo que falta para Fase 4

- Modal/lightbox al hacer clic en una zapatilla (vista ampliada + tallas)
- Menú móvil desplegable completo
- Mensaje de WhatsApp pre-llenado con el nombre del producto al
  hacer clic en "Consultar por WhatsApp" dentro de cada tarjeta

Cuando tengas más carpetas de productos listas, pásame 2 o 3 nombres
de carpeta más y te ayudo a completar el `products.json` y a montar
la tarjeta con botón directo a WhatsApp por producto.
