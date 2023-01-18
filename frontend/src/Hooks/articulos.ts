import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import { dataInitialFetch, initFetch } from 'App/store'
import {
    ARTICULO_COMBINADO_EMPTY,
    ARTICULO_EMPTY,
    TipoArticulo,
    TipoEstado,
} from 'Config/util'
import {
    ARTICULOS_QUERY,
    ARTICULO_ID_QUERY,
    BORRAR_ARTICULO_QUERY,
    GUARDAR_ARTICULO_QUERY,
    MODIFICAR_ARTICULO_QUERY,
} from 'queries'
import { useState } from 'react'
import { Articulo, ArticuloCombinado, ArticuloDetallado } from 'types/app-env'
import { useSessionStorage } from './sessionStorage'

export function useArticulos() {
    const [articulosQuery, { loading, error }] = useLazyQuery<{
        articulos: ArticuloDetallado[]
    }>(ARTICULOS_QUERY)
    const dispatch = useAppDispatch()
    // let articulos: ArticuloDetallado[] = []
    // const [errores, setErrores] = useState<string[]>([])

    // if (error) {
    //     console.error({ error })
    //     setErrores([error.message])
    // }
    // if (data) {
    //     articulos = data.articulos
    // }

    const fetchArticulosApi = () =>
        articulosQuery().then(({ data }) => {
            if (data) {
                dispatch(initFetch(data.articulos))
                dispatch(dataInitialFetch(data.articulos))
            }
            return { articulos: data, cargando: loading, error }
        })

    return { fetchArticulosApi }
}

export function useArticulo({ id, tipo }: { id: string; tipo?: TipoArticulo }) {
    // const [articulo, setArticulo] = useSessionStorage<
    //     Articulo | ArticuloCombinado
    // >({ key: 'articulo' })
    // return { articulo, setArticulo }
    // const [articulo, setArticulo] = useState<ArticuloCombinado>(ARTICULO_COMBINADO_EMPTY)
    let articulo: ArticuloCombinado = ARTICULO_COMBINADO_EMPTY
    const { articulos, articulosAPI, usuario } = useAppSelector(
        (state) => state,
    )
    const [articuloQuery, artQueryResult] = useLazyQuery<{
        articulo: ArticuloDetallado
    }>(ARTICULO_ID_QUERY)
    const [modifyQuery, modQueryResult] = useMutation<{
        modificarArticulo: ArticuloDetallado
    }>(MODIFICAR_ARTICULO_QUERY)
    const [saveQuery, savQueryResult] = useMutation<{
        guardarArticulo: ArticuloDetallado
    }>(GUARDAR_ARTICULO_QUERY)
    const [deleteQuery, delQueryResult] = useMutation<{
        borrarArticulo: ArticuloDetallado
    }>(BORRAR_ARTICULO_QUERY)
    const art = articulos.find((a) => a.Id === id) || ARTICULO_EMPTY
    let artAPI = articulosAPI.find((a) => a.id === id)
    // console.log(artAPI)
    const { estado, guardado, ranking, comentarios } = art
    const getArticulo = () => {
        const tipoA = tipo || art.tipo
        if (artAPI === undefined) {
            // console.log(`Hey ${id}`)
            articuloQuery({
                variables: { id, tipo: TipoArticulo[tipoA] },
            }).then(({ data }) => {
                // console.log(data)
                if (data) {
                    articulo = {
                        ...data.articulo,
                        estado,
                        guardado,
                        ranking,
                        comentarios,
                    } as ArticuloCombinado
                }
            })
        } else {
            articulo = {
                ...artAPI,
                estado,
                guardado,
                ranking,
                comentarios,
            } as ArticuloCombinado
        }
        return articulo
    }

    const guardar = ({ tipo }: { tipo: TipoArticulo }) => {
        console.log(`Guardando ${id}`)
        return saveQuery({
            variables: {
                usuario: usuario.Id,
                tipo: TipoArticulo[tipo],
                articulo: id,
            },
        }).then((data) => {
            console.log('OYE')
        })
    }

    const borrar = () => {
        return deleteQuery({
            variables: { usuario: usuario.Id, articulo: id },
        })
    }

    const modificar = ({
        ranking,
        estado,
        tipo,
    }: {
        ranking?: number
        estado?: TipoEstado
        tipo: TipoArticulo
    }) => {
        console.log({ estado })
        return modifyQuery({
            variables: {
                usuario: usuario.Id,
                articulo: id,
                estado: estado ? TipoEstado[estado] : null,
                tipo: TipoArticulo[tipo],
                ranking,
            },
        })
    }

    // console.log(articulo)
    return { guardar, borrar, modificar, getArticulo }
    // const articulo: ArticuloCombinado =
}
