//Elemento padre donde se mostraran los productos de la seccion BestSeller
let elementoPadreBS = document.getElementById("BestSellerJS");


//Se define la clase producto

class Producto{
    constructor(idbtn,idunit,nombre,precio,inventario,categorias,unidades){
        this.idBtn = idbtn;
        this.idUnit = "0" + idunit
        this.name = nombre;
        this.value = precio;
        this.stock = inventario;
        this.category = categorias;
        this.units = unidades;
        this.imgURL = "../resources/imagenes/cake.jpg";
    }
}

//Esta funcion nos permite Añadir elementos a los arrays de productos

function insertarProducto(array,idB,idU,nombre,precio,inventario,categoriasTienda,uni){
    let objetoTemporal = new Producto(idB,idU, nombre,precio,inventario,categoriasTienda,uni);
    array.push(objetoTemporal);
}

//funcion que Mostrara nuestros productos en la pagina

function tiendaHTML(arrayProductos,elementoPadreHTLM,index){
    let divBSItem = document.createElement("div");
    divBSItem.classList.add("bestSeller--item")
    elementoPadreHTLM.prepend(divBSItem);
    
    divBSItem.innerHTML = 
    `<img src=${arrayProductos[index].imgURL} alt="">
    <p>${arrayProductos[index].name}</p>
    <p> $${arrayProductos[index].value}</p>
    <div>
        <p>Cantidad</p>
        <input type="text" class="BSinput" id=${arrayProductos[index].idUnit}>
    </div>
    <button class="BSbttn" id="${arrayProductos[index].idBtn}">Comprar</button>`;

}

//Funcion numeros aleatorios

function aleatorios(LengthArray){
    let numMax = LengthArray;
    let numAleatorio = Math.random();

    return Math.floor(numAleatorio*numMax);
}


// Se añaden los productos a vender en la pagina
    //Listado de tortas.
    let Listadotortas = [];
    insertarProducto(Listadotortas,1,1,"Variedad 1",550,25,"Torta");
    insertarProducto(Listadotortas,2,2,"Variedad 2",630,25,"Torta");
    insertarProducto(Listadotortas,3,3,"Variedad 3",450,25,"Torta");
    insertarProducto(Listadotortas,4,4,"Variedad 4",520, 25, "Torta");
    insertarProducto(Listadotortas,5,5,"Variedad 5",650,25,"Torta");
    insertarProducto(Listadotortas,6,6,"Variedad 6" , 700,25,"Torta");

    // Array con el total de prodcutos
    totalProductos = Listadotortas;

    //lo almacenamos en el local storage

    console.log(1)
    if(true){
        localStorage.setItem("TotalProductos", JSON.stringify(totalProductos));
        console.log(2)
    }

//Generacion automatica y aleatoria de los productos mas vendidos

let indexUsados = new Set();

for(let i = 0; i <=5;){
    let indexAleatorio = aleatorios(totalProductos.length);    

    if(!indexUsados.has(indexAleatorio)){
        tiendaHTML(totalProductos,elementoPadreBS,indexAleatorio);
        i++
    }

    indexUsados.add(indexAleatorio)
}

//-------------------------------------------------------------------------------------------------

//Traemos el parrafo donde se indica la cantidad de productros en el carrito

let CarritoHTML = document.getElementById("carrito");

// traemos los botones generados
let botonesBs = document.getElementsByClassName("BSbttn");

//Se añaden Eventos a todos los botones
for(boton of botonesBs){
    boton.addEventListener("click", añadirCarrito)
};

//Traemos los inputs de cantidad
let CantidadInput = document.getElementsByClassName("BSinput");
let cantidadArray = Array.from(CantidadInput);

//esta funcion recibe un producto y lo busca en un array de los inputs de cantidad hasta encontrar el correcto y de esta forma devuelve el valor

function encontrarCantidad(pdt,arrayUnidades){
    for(unidad of arrayUnidades){
        if(pdt.idUnit == unidad.id){
            return Number(unidad.value);
        }
    }
}


//Esta funcion busca un producto en el carrito para verificar si ya existe

function BuscarCarrito(arrayCarrito,producto){
    for(let unidad of arrayCarrito){
        if(unidad.idBtn == producto.idBtn) return unidad;

    }
}

//Esta funcion almacena un objeto de tipo producto en el carrito cuando se pulsa el boton correspondiente

if(localStorage.hasOwnProperty("carrito")){
    var carrito = JSON.parse(localStorage.getItem("carrito"));
    CarritoHTML.innerText = String(carrito.length);
}else{
    var carrito = [];
}

// let carrito = [];

function añadirCarrito(){
    let idProducto = this.id;

    let producto = totalProductos.find(function(a){
        if(a.idBtn == idProducto){
            return a;
        }
    });

    
    let cantidad = encontrarCantidad(producto,cantidadArray);

    

    if(cantidad > 0 && cantidad <= producto.stock){

        //TODO : VERIFICADOR DE QUE EL PRODUCTO YA ESTE EN CARRITO Y ACTUALIZADOR DE CANTIDAD

        if(BuscarCarrito(carrito,producto) ){
            console.log("ya existo");

            let productoSumarUnidades = BuscarCarrito(carrito,producto);
            productoSumarUnidades.units += cantidad;

            producto.stock -= cantidad;


        }else{
            console.log("no existo");
            producto.stock -= cantidad;
            insertarProducto(carrito,producto.idBtn,producto.idUnit,producto.name,producto.value,producto.stock,producto.category,cantidad);
        }


        
        CarritoHTML.innerText = String(carrito.length);
        if(localStorage.hasOwnProperty("carrito")){
            localStorage.removeItem("carrito");
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }else{
            localStorage.setItem("carrito", JSON.stringify(carrito));
        }
        
    }
}








