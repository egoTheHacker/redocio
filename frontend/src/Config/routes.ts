import { AdminPanel } from 'Pages/AdminPanel'
import { ArticuloDetallado } from 'Pages/ArticuloDetallado'
import { Articulos } from 'Pages/Home/Articulos'
import { Biblioteca } from 'Pages/Home/Biblioteca'
import { Comunidad } from 'Pages/Home/Comunidad'
import { Docs } from 'Pages/Home/Docs'
import { Home } from 'Pages/Home'
// import { Juegos } from 'Pages/Juegos'
// import { Libros } from 'Pages/Libros'
// import { Peliculas } from 'Pages/Peliculas'
// import { Series } from 'Pages/Series'

interface Seccion {
    nombre: string
    componente: () => JSX.Element
}

export interface Ruta {
    nombre?: string
    path: string
    componente: (props: any) => JSX.Element
}

export const rutas: Ruta[] = [
    {
        nombre: 'home',
        path: '/',
        componente: Home,
    },
    {
        path: `/book/:id`,
        componente: ArticuloDetallado,
        nombre: 'book',
    },
    {
        path: `/film/:id`,
        componente: ArticuloDetallado,
        nombre: 'film',
    },
    {
        path: `/show/:id`,
        componente: ArticuloDetallado,
        nombre: 'show',
    },
    {
        path: `/game/:id`,
        componente: ArticuloDetallado,
        nombre: 'game',
    },
    {
        path: '/admin',
        componente: AdminPanel,
        nombre: 'admin',
    },
]

export const secciones: Seccion[] = [
    {
        nombre: 'home',
        componente: Articulos,
    },
    {
        nombre: 'docs',
        componente: Docs,
    },
    {
        nombre: 'comunidad',
        componente: Comunidad,
    },
    {
        nombre: 'biblioteca',
        componente: Biblioteca,
    },
]
