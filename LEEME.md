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

## 3. Cómo agregar cada zapatilla nueva

Por cada carpeta dentro de `assets/productos/`, agrega un objeto en
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
- `"carpeta"` debe ser IDÉNTICO al nombre de la carpeta en
  `assets/productos/` (mayúsculas, espacios y guiones incluidos).
- `"marca"` debe ser una de: `Nike`, `Adidas`, `Puma`, `New Balance`
  (o edita los botones en `index.html` si agregas otra marca).
- `"categoria"` debe ser una de: `Basketball`, `Running`, `Lifestyle`,
  `Training` (o edítalas también en `index.html`).
- El stock/tallas que veías en la 4ta imagen ("Stock y tallas") de cada
  carpeta, pásalo a mano al arreglo `"tallas"` — esa imagen es solo tu
  referencia interna, no se muestra en la web.
- Cada producto usa 3 imágenes en la galería (`imagenes`), pero puedes
  poner más si quieres.

## 4. Lo que ya funciona (Fase 1 + Fase 2)

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

## 5. Lo que falta para Fase 3 y 4

- Animaciones más elaboradas al hacer scroll
- Modal/lightbox al hacer clic en una zapatilla (vista ampliada + tallas)
- Menú móvil desplegable completo
- Mensaje de WhatsApp pre-llenado con el nombre del producto al
  hacer clic en "Consultar por WhatsApp" dentro de cada tarjeta

Cuando tengas más carpetas de productos listas, pásame 2 o 3 nombres
de carpeta más y te ayudo a completar el `products.json` y a montar
la tarjeta con botón directo a WhatsApp por producto.
