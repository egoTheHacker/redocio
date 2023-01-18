import { useAppSelector } from 'App/hooks'
import { Articulo } from 'Components/Articulo'
import { combinarArticulos, TipoArticulo, TipoEstado } from 'Config/util'
import { useArticulo } from 'Hooks/articulos'
import { useBiblioteca } from 'Hooks/biblioteca'
import { useEffect } from 'react'
import {
    Articulo as ArticuloType,
    ArticuloCombinado,
    ArticuloDetallado,
} from 'types/app-env'
// import { useBiblioteca } from 'Hooks/biblioteca'
import './estilos.scss'

export function Biblioteca() {
    const { usuario, articulos } = useAppSelector((state) => state)
    // const { getArticulo } = useArticulo({ id })
    let articulosCombinados: ArticuloCombinado[] = []
    // const { fetchBiblioteca } = useBiblioteca()
    // const { articulos: articulosCombinados } = fetchBiblioteca()
    // const { biblioteca } = usuario
    // console.log(biblioteca)
    // const articulosCombinados: ArticuloCombinado[] = articulos.map((ad) => {
    //     console.log({ ad })
    //     const a = biblioteca.find((e) => e.Id === ad.id) || ARTICULO_EMPTY
    //     return combinarArticulos({ a, ad })
    // })
    // console.log({ articulosCombinados })
    // useEffect(() => {
    //     articulosCombinados = articulos
    //         .map((a) => getArticulo({ tipo: a.tipo }))
    //         .filter((a) => a.guardado)
    // }, [])

    // console.log({ articulosCombinados })
    return (
        <>
            {/* {articulosCombinados.length > 0 ? (
                articulosCombinados.map((articulo) => (
                    <Articulo key={articulo.id} detalles={articulo} />
                ))
            ) : (
                <div>Todavía no tienes nada en tu biblioteca</div>
            )} */}
            {/* {
                articulos.filter(a => a.guardado).map(detalles => (
                    <Articulo key={detalles.Id}
                ))
            } */}
            <div>Todavía no tienes nada en tu biblioteca</div>
        </>
    )
}
