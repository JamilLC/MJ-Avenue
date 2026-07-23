/* ==========================================================================
   MJ AVENUE STORE — main.js
   Carga el catálogo desde data/products.json, arma las tarjetas de producto,
   maneja el buscador en tiempo real y el filtro por marca/categoría.
   ========================================================================== */

const RUTA_PRODUCTOS = 'assets/productos';

let productos = [];
let marcaActiva = 'todas';
let categoriaActiva = 'todas';
let textoBusqueda = '';
let ordenActivo = 'destacados';

const grid = document.getElementById('grid-productos');
const inputBuscador = document.getElementById('input-buscador');
const filtrosMarca = document.getElementById('filtros-marca');
const selectorOrden = document.getElementById('selector-orden');
const botonLimpiar = document.getElementById('boton-limpiar');
const contadorResultados = document.getElementById('contador-resultados');

/* --------------------------------------------------------------------
   Carga inicial de datos
   -------------------------------------------------------------------- */
async function cargarProductos() {
  try {
    const respuesta = await fetch('data/products.json');
    if (!respuesta.ok) throw new Error('No se pudo leer products.json');
    productos = await respuesta.json();
    renderizarProductos();
  } catch (error) {
    grid.innerHTML = `
      <div class="catalogo__vacio">
        <strong>No se pudo cargar el catálogo</strong>
        Revisa que data/products.json exista y que estés viendo el sitio
        desde un servidor local (Live Server / GitHub Pages), no abriendo
        el archivo index.html directamente.
      </div>`;
    console.error(error);
  }
}

/* --------------------------------------------------------------------
   Construye la URL de una imagen respetando espacios y mayúsculas
   -------------------------------------------------------------------- */
function rutaImagen(producto, archivo) {
  return `${RUTA_PRODUCTOS}/${encodeURIComponent(producto.carpeta)}/${archivo}`;
}

/* --------------------------------------------------------------------
   Filtra el arreglo de productos según marca, categoría y texto
   -------------------------------------------------------------------- */
function obtenerProductosFiltrados() {
  const filtrados = productos.filter((p) => {
    const coincideMarca = marcaActiva === 'todas' || p.marca === marcaActiva;
    const coincideCategoria = categoriaActiva === 'todas' || p.categoria === categoriaActiva;
    const texto = `${p.nombre} ${p.marca} ${p.categoria} ${p.color}`.toLowerCase();
    const coincideTexto = texto.includes(textoBusqueda.toLowerCase());
    return coincideMarca && coincideCategoria && coincideTexto;
  });

  const ordenados = [...filtrados];

  if (ordenActivo === 'precio-asc') {
    ordenados.sort((a, b) => a.precio - b.precio);
  } else if (ordenActivo === 'precio-desc') {
    ordenados.sort((a, b) => b.precio - a.precio);
  } else {
    // "destacados" primero, respetando el orden original del JSON
    ordenados.sort((a, b) => (b.destacado === true) - (a.destacado === true));
  }

  return ordenados;
}

/* --------------------------------------------------------------------
   Calcula el stock total de un producto sumando todas sus tallas
   -------------------------------------------------------------------- */
function stockTotal(producto) {
  return producto.tallas.reduce((total, t) => total + t.stock, 0);
}

/* --------------------------------------------------------------------
   Genera el HTML de una tarjeta de producto
   -------------------------------------------------------------------- */
function crearTarjeta(producto) {
  const sinStock = stockTotal(producto) === 0;
  const imagenes = producto.imagenes;

  const dots = imagenes
    .map((_, i) => `<span class="${i === 0 ? 'activo' : ''}" data-indice="${i}"></span>`)
    .join('');

  const precioAnterior = producto.precioAnterior
    ? `<span class="producto-card__precio-antes">S/ ${producto.precioAnterior}</span>`
    : '';

  return `
    <article class="producto-card ${sinStock ? 'producto-card__sin-stock' : ''}" data-id="${producto.id}">
      <div class="producto-card__imagen">
        ${producto.destacado ? '<span class="producto-card__badge">Nuevo</span>' : ''}
        <img src="${rutaImagen(producto, imagenes[0])}" alt="${producto.nombre} - ${producto.marca}" loading="lazy" data-indice-actual="0">
        ${imagenes.length > 1 ? `<div class="producto-card__dots">${dots}</div>` : ''}
      </div>
      <div class="producto-card__info">
        <p class="producto-card__marca">${producto.marca}</p>
        <p class="producto-card__nombre">${producto.nombre}</p>
        <p class="producto-card__color">${producto.color}${sinStock ? ' · Agotado' : ''}</p>
        <div class="producto-card__precios">
          <span class="producto-card__precio">S/ ${producto.precio}</span>
          ${precioAnterior}
        </div>
      </div>
    </article>`;
}

/* --------------------------------------------------------------------
   Pinta el grid completo
   -------------------------------------------------------------------- */
function renderizarProductos() {
  const lista = obtenerProductosFiltrados();

  actualizarContador(lista.length);

  if (lista.length === 0) {
    grid.innerHTML = `
      <div class="catalogo__vacio">
        <strong>Sin resultados</strong>
        No encontramos zapatillas que coincidan con tu búsqueda.
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(crearTarjeta).join('');
  activarGaleriaHover();
  animarTarjetasEnCascada();
}

/* --------------------------------------------------------------------
   Texto "Mostrando X de Y pares"
   -------------------------------------------------------------------- */
function actualizarContador(cantidadFiltrada) {
  if (!contadorResultados) return;
  contadorResultados.innerHTML = `Mostrando <strong>${cantidadFiltrada}</strong> de <strong>${productos.length}</strong> pares`;
}

/* --------------------------------------------------------------------
   Anima cada tarjeta en cascada apenas entra al viewport
   -------------------------------------------------------------------- */
function animarTarjetasEnCascada() {
  const tarjetas = document.querySelectorAll('.producto-card');

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  tarjetas.forEach((tarjeta, indice) => {
    tarjeta.style.animationDelay = `${Math.min(indice, 8) * 0.06}s`;
    observador.observe(tarjeta);
  });
}

/* --------------------------------------------------------------------
   Al pasar el mouse por los puntos de una tarjeta, cambia la imagen
   -------------------------------------------------------------------- */
function activarGaleriaHover() {
  document.querySelectorAll('.producto-card').forEach((card) => {
    const idProducto = card.dataset.id;
    const producto = productos.find((p) => p.id === idProducto);
    if (!producto) return;

    const img = card.querySelector('img');
    const dots = card.querySelectorAll('.producto-card__dots span');

    dots.forEach((dot) => {
      dot.addEventListener('mouseenter', () => {
        const indice = Number(dot.dataset.indice);
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = rutaImagen(producto, producto.imagenes[indice]);
          img.style.opacity = '1';
        }, 120);
        dots.forEach((d) => d.classList.remove('activo'));
        dot.classList.add('activo');
      });
    });

    // Al salir la tarjeta, vuelve siempre a la imagen principal
    card.addEventListener('mouseleave', () => {
      img.src = rutaImagen(producto, producto.imagenes[0]);
      dots.forEach((d, i) => d.classList.toggle('activo', i === 0));
    });
  });
}

/* --------------------------------------------------------------------
   Buscador en tiempo real
   -------------------------------------------------------------------- */
inputBuscador?.addEventListener('input', (e) => {
  textoBusqueda = e.target.value.trim();
  renderizarProductos();
});

/* --------------------------------------------------------------------
   Filtro por marca (chips)
   -------------------------------------------------------------------- */
filtrosMarca?.addEventListener('click', (e) => {
  const chip = e.target.closest('.filtro-chip');
  if (!chip) return;

  filtrosMarca.querySelectorAll('.filtro-chip').forEach((c) => c.classList.remove('activo'));
  chip.classList.add('activo');
  marcaActiva = chip.dataset.marca;
  renderizarProductos();
});

/* --------------------------------------------------------------------
   Filtro por categoría (tarjetas del menú de categorías)
   -------------------------------------------------------------------- */
document.querySelectorAll('.categoria-card').forEach((card) => {
  card.addEventListener('click', () => {
    categoriaActiva = card.dataset.categoria;
    renderizarProductos();
  });
});

/* --------------------------------------------------------------------
   Selector de orden (destacados / precio asc / precio desc)
   -------------------------------------------------------------------- */
selectorOrden?.addEventListener('change', (e) => {
  ordenActivo = e.target.value;
  renderizarProductos();
});

/* --------------------------------------------------------------------
   Botón "Limpiar filtros": resetea marca, categoría, texto y orden
   -------------------------------------------------------------------- */
botonLimpiar?.addEventListener('click', () => {
  marcaActiva = 'todas';
  categoriaActiva = 'todas';
  textoBusqueda = '';
  ordenActivo = 'destacados';

  inputBuscador.value = '';
  selectorOrden.value = 'destacados';
  filtrosMarca.querySelectorAll('.filtro-chip').forEach((c, i) => c.classList.toggle('activo', i === 0));

  renderizarProductos();
});

/* --------------------------------------------------------------------
   Revelado en cascada de las tarjetas de categoría al hacer scroll
   -------------------------------------------------------------------- */
function animarCategorias() {
  const tarjetas = document.querySelectorAll('.categoria-card');
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  tarjetas.forEach((tarjeta, indice) => {
    tarjeta.style.animationDelay = `${indice * 0.08}s`;
    observador.observe(tarjeta);
  });
}

animarCategorias();

/* --------------------------------------------------------------------
   Menú móvil (placeholder simple, se expande en Fase 3/4)
   -------------------------------------------------------------------- */
document.getElementById('btn-menu-movil')?.addEventListener('click', () => {
  document.querySelector('.header__nav').classList.toggle('header__nav--abierto');
});

/* --------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------- */
cargarProductos();
