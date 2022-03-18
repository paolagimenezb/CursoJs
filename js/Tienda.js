let totalProductos = JSON.parse(localStorage.getItem("TotalProductos"));
let carrito = JSON.parse(localStorage.getItem("carrito"));

//Traemos el parrafo donde se indica la cantidad de productros en el carrito

let CarritoHTML = document.getElementById("carrito");

let cantidadArray;

//Actualizamos el los productos del carrito
if (carrito.length > 0) {
  CarritoHTML.innerText = String(carrito.length);
}

class Producto {
  constructor(idbtn, idunit, nombre, precio, inventario, categorias, unidades) {
    this.idBtn = idbtn;
    this.idUnit = "0" + idunit;
    this.name = nombre;
    this.value = precio;
    this.stock = inventario;
    this.category = categorias;
    this.units = unidades;
    this.imgURL = "/Proyecto_final/resources/imagenes/coffe_bag.webp";
  }
}

//Esta funcion nos permite Añadir elementos a los arrays de productos

function insertarProducto(
  array,
  idB,
  idU,
  nombre,
  precio,
  inventario,
  categoriasTienda,
  uni
) {
  let objetoTemporal = new Producto(
    idB,
    idU,
    nombre,
    precio,
    inventario,
    categoriasTienda,
    uni
  );
  array.push(objetoTemporal);
}

//funcion que Mostrara nuestros productos en la pagina

function tiendaHTML(arrayProductos, elementoPadreHTLM, index) {
  let divBSItem = document.createElement("div");
  divBSItem.classList.add("bestSeller--item");
  elementoPadreHTLM.prepend(divBSItem);

  divBSItem.innerHTML = `<img src=${arrayProductos[index].imgURL} alt="">
    <p>${arrayProductos[index].name}</p>
    <p> $${arrayProductos[index].value}</p>
    <div>
        <p>Cantidad</p>
        <input type="text" class="Tiendainput" id=${arrayProductos[index].idUnit}>
    </div>
    <button class="Tiendabttn" id="${arrayProductos[index].idBtn}">Comprar</button>`;
}

//Generacion de productos de Tienda.html

let elementoPadreTienda =
  document.getElementsByClassName("mainTienda--Grid")[0];

for (let i = 0; i < totalProductos.length; i++) {
  tiendaHTML(totalProductos, elementoPadreTienda, i);
}

//Generacion de tienda a partir de las preferencias del usuario ------------------------------------

//Traemos los input de los tipos de forma de organizar la tienda

let expensiveToCheaper = document.getElementById("expensiveToCheaper");
expensiveToCheaper.addEventListener("input", filtrar);

let cheaperToExpensive = document.getElementById("cheaperToExpensive");
cheaperToExpensive.addEventListener("input", filtrar);

//Funcion para generar la tienda segun el filtro

function generarTienda(arrayProductos, elementoPadreHTLM) {
  for (let i = 0; i < arrayProductos.length; i++) {
    tiendaHTML(arrayProductos, elementoPadreHTLM, i);
  }

  let botonesFiltro = Array.from(document.getElementsByClassName("Tiendabttn"));
  for (boton of botonesFiltro) {
    boton.addEventListener("click", añadirCarrito);
  }

  let CantidadInput = document.getElementsByClassName("Tiendainput");
  cantidadArray = Array.from(CantidadInput);
}

//Funcion que ejerce como filtro

function filtrar() {
  console.log(this.id);
  let id = this.id;
  filtroTienda(id);
}

function filtroTienda(filtro) {
  switch (filtro) {
    case "expensiveToCheaper":
      let eTc = totalProductos.sort((a, b) => {
        return a.value - b.value;
      });
      elementoPadreTienda.innerHTML = "";
      generarTienda(eTc, elementoPadreTienda);
      break;
    case "cheaperToExpensive":
      let cTe = totalProductos.sort((a, b) => {
        return b.value - a.value;
      });
      elementoPadreTienda.innerHTML = "";
      generarTienda(cTe, elementoPadreTienda);
      break;
    default:
      console.log("entro al default " + filtro);
      break;
  }
}

//---------------------------------------------------------------------

// traemos los botones generados
let botonesTienda = document.getElementsByClassName("Tiendabttn");

//Se añaden Eventos a todos los botones
for (boton of botonesTienda) {
  boton.addEventListener("click", añadirCarrito);
}

//Traemos los inputs de cantidad
let CantidadInput = document.getElementsByClassName("Tiendainput");
cantidadArray = Array.from(CantidadInput);

//esta funcion recibe un producto y lo busca en un array de los inputs de cantidad hasta encontrar el correcto y de esta forma devuelve el valor

function encontrarCantidad(pdt, arrayUnidades) {
  for (unidad of arrayUnidades) {
    if (pdt.idUnit == unidad.id) {
      return Number(unidad.value);
    }
  }
}

//Esta funcion busca un producto en el carrito para verificar si ya existe

function BuscarCarrito(arrayCarrito, producto) {
  for (let unidad of arrayCarrito) {
    if (unidad.idBtn == producto.idBtn) return unidad;
  }
}

//Esta funcion almacena un objeto de tipo producto en el carrito cuando se pulsa el boton correspondiente

function añadirCarrito() {
  console.log("se ejecuta");

  let idProducto = this.id;

  let producto = totalProductos.find(function (a) {
    if (a.idBtn == idProducto) {
      return a;
    }
  });

  let cantidad = encontrarCantidad(producto, cantidadArray);

  console.log(producto, "can" + cantidad);

  if (cantidad > 0 && cantidad <= producto.stock) {
    if (BuscarCarrito(carrito, producto)) {
      console.log("ya existo");

      let productoSumarUnidades = BuscarCarrito(carrito, producto);
      productoSumarUnidades.units += cantidad;

      producto.stock -= cantidad;
    } else {
      console.log("no existo");
      producto.stock -= cantidad;
      insertarProducto(
        carrito,
        producto.idBtn,
        producto.idUnit,
        producto.name,
        producto.value,
        producto.stock,
        producto.category,
        cantidad
      );
    }

    CarritoHTML.innerText = String(carrito.length);
    if (localStorage.hasOwnProperty("carrito")) {
      localStorage.removeItem("carrito");
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }
  }
}
