// import { useQuery } from '@apollo/client'
import { useAppSelector } from 'App/hooks'
import { Articulo } from 'Components/Articulo'
import { Spin } from 'Components/Spin'
// import { TipoArticulo } from 'Config/util'
import { useArticulos } from 'Hooks/articulos'
import { useEffect, useState } from 'react'
import { ArticuloDetallado } from 'types/app-env'
// import { ARTICULOS_QUERY } from 'queries'
// import { useEffect, useState } from 'react'
import './estilos.scss'

export function Articulos() {
    // const { articulos, cargando } = useArticulos()
    const { articulosAPI, articulosFilt } = useAppSelector((state) => state)
    const [mostrando] = articulosFilt
    const [articulos, setArticulos] = useState(articulosAPI)
    // let articulos: ArticuloDetallado[] = []
    interface User {
        name: string
        birthday: Date
        hobbies: string[]
        email: string
    }

    useEffect(() => {
        const ordenarPorTipoYTitulo = (
            a: ArticuloDetallado,
            b: ArticuloDetallado,
        ) => {
            if (a.tipo < b.tipo) return -1
            if (a.tipo > b.tipo) return 1
            return a.titulo.localeCompare(b.titulo)
        }
        setArticulos(() => {
            const arts =
                mostrando && mostrando.length > 0
                    ? [...mostrando]
                    : [...articulosAPI]
            // arts.sort((a, b) => a.tipo - b.tipo).sort(ordenarPorTitulo)
            return arts.sort(ordenarPorTipoYTitulo)
        })
    }, [mostrando])

    return (
        <>
            {/* {cargando && <Spin />} */}
            {articulos.map((articulo) => {
                const { id } = articulo
                return <Articulo key={id} detalles={articulo} />
            })}
        </>
    )
}
