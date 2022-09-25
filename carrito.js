//Variables
const items = document.getElementById('items')
const cards = document.getElementById('cards')
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment()
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
let carrito = {}

// Creacion de eventos
document.addEventListener('DOMContentLoaded', e => { fetchData() });
cards.addEventListener('click', e => { agregarCarrito(e) });
items.addEventListener('click', e => { agregarReducir(e)})

// Funciones

// Mostrar productos en las cards
const Cards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('button').dataset.id = item.id
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//Mostrar Carrito
const mostrarCarrito = () => {
    items.innerHTML = ''

    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.precio * producto.cantidad
        
        //botones del carrito
        templateCarrito.querySelector('.btn-dark').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const duplicar = templateCarrito.cloneNode(true)
        fragment.appendChild(duplicar)
    })
    items.appendChild(fragment)

    mostrarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

// Traer productos con fetch
const fetchData = async () => {
    const res = await fetch('productos.json');
    const data = await res.json()
    Cards(data)
}

// Agregar al carrito
const agregarCarrito = e => {
    if (e.target.classList.contains('btn-danger')) {
        setCarrito(e.target.parentElement)
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tu pokemon fue agregado al carrito',
            showConfirmButton: false,
            timer: 1500
          })
    }
    e.stopPropagation()
}

const setCarrito = item => {
    const producto = {
        title: item.querySelector('h5').textContent,
        precio: item.querySelector('p').textContent,
        id: item.querySelector('button').dataset.id,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    mostrarCarrito()
}
//footer del carrito
const mostrarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Aun no has agregado elementos a tu carrito</th>
        `
        return
    }
    // sumar cantidad y sumar totales
    const cantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const precio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent = cantidad
    templateFooter.querySelector('span').textContent = precio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)
    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        mostrarCarrito()
    })

}

const agregarReducir = e => {
    if (e.target.classList.contains('btn-dark')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        mostrarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        mostrarCarrito()
    }
    e.stopPropagation()
}

//localStorage
document.addEventListener('DOMContentLoaded', e => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        mostrarCarrito()
    }
});
