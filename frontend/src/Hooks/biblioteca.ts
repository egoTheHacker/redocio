import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import {
    ARTICULOS_APP_QUERY,
    ARTICULO_ID_QUERY,
    // BIBLIOTECA_QUERY,
    BORRAR_ARTICULO_QUERY,
    GUARDAR_ARTICULO_QUERY,
    MODIFICAR_ARTICULO_QUERY,
} from 'queries'
import { useEffect, useState } from 'react'
import {
    ARTICULO_EMPTY,
    combinarArticulos,
    TipoArticulo,
    TipoEstado,
} from 'Config/util'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import { Articulo, ArticuloCombinado, ArticuloDetallado } from 'types/app-env'
import { inits } from 'App/store'
// import { Articulo } from "Components/Articulo"

const ARTICULO_DETALLADO_EMPTY: ArticuloDetallado = {
    id: '',
    creadores: [],
    idioma: '',
    tipo: TipoArticulo.ARTICULO,
    titulo: '',
}

export function useArticulosApp() {
    const { usuario } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    const [articuloQuery, articuloR] = useLazyQuery<{
        articulosApp: Articulo[]
    }>(ARTICULOS_APP_QUERY)
    // if (!usuario.enLinea) return { fetchArticulos: () => {} }

    const fetchArticulos = () =>
        articuloQuery({ variables: { usuario: usuario.Id } }).then(
            ({ data }) => {
                if (data) dispatch(inits(data.articulosApp))
            },
        )
    return { fetchArticulos }
}

export function useBiblioteca() {
    const { usuario } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    const [errores, setErrores] = useState<string[]>([])
    const [articulos, setArticulos] = useState<ArticuloCombinado[]>([])
    const [articuloQuery, articuloR] = useLazyQuery<{
        articulo: ArticuloDetallado
    }>(ARTICULO_ID_QUERY)
    let biblio: Promise<ArticuloCombinado>[] = []
    useEffect(() => {
        if (!usuario) return
        biblio = usuario.biblioteca.map(async (a: Articulo) => {
            // Obteniendo campos de Articulo para ser compatible con ArticuloCombinado
            // const { estado, ranking, guardado } = a
            const queryRes = async () =>
                await articuloQuery({
                    variables: { id: a.Id, tipo: a.tipo },
                })
                    .then((qres) => {
                        if (!qres.loading) {
                            return qres.data?.articulo
                        }
                        return
                    })
                    .catch((e: Error) =>
                        setErrores((prev) => [...prev, e.message]),
                    )
            const ad: ArticuloDetallado =
                (await queryRes()) || ARTICULO_DETALLADO_EMPTY
            // const ad: ArticuloDetallado = await articuloQuery({
            //     variables: { id: a.Id, tipo: a.tipo },
            // })
            //     .then(async (qres) => {
            //         if (!qres.loading) {
            //             return await qres.data.articulo
            //         }
            //         return
            //     })
            //     .catch((e: Error) => setErrores((prev) => [...prev, e.message]))
            // Obteniendo campos de ArticuloDetallado para ser compatible con ArticuloCombinado
            // const { id, creadores, titulo, tipo, sinopsis, portada, idioma } =
            //     articulo

            return combinarArticulos({ a, ad })
        })
    }, [])

    const fetchBiblioteca = () => {
        biblio.forEach((p) =>
            p.then((a) => setArticulos((arts) => [...arts, a])),
        )
        // dispatch(inits(articulos))
        return { articulos }
    }

    return { fetchBiblioteca, cargando: articuloR.loading, errores }
}

export function useArticuloB({ id }: { id: string }) {
    const { articulos, usuario } = useAppSelector((state) => state)
    // const { usuario } = useUsuario()
    const [guardarQuery, guardarResult] = useMutation(GUARDAR_ARTICULO_QUERY)
    const [borrarQuery, borrarResult] = useMutation(BORRAR_ARTICULO_QUERY)
    const [modificarQuery, modificarResult] = useMutation(
        MODIFICAR_ARTICULO_QUERY,
    )
    const [articulo, setArticulo] = useState<Articulo>(ARTICULO_EMPTY)
    if (!usuario)
        return {
            error: 'No hay usuario logueado',
            guardar: () => null,
            borrar: () => null,
            modificar: () => null,
            articulo,
        }
    if (articulos) {
        const f = articulos.find((a) => a.Id === id)
        if (f) setArticulo(f)
    }

    const guardar = ({ tipo }: { tipo: TipoArticulo }) =>
        guardarQuery({
            variables: {
                usuario: usuario.Id,
                tipo: TipoArticulo[tipo],
                articulo: id,
            },
        })

    const borrar = () =>
        borrarQuery({
            variables: { usuario: usuario.Id, articulo: id },
        })

    const modificar = ({
        ranking,
        estado,
        tipo,
    }: {
        ranking: number
        estado?: TipoEstado
        tipo: TipoArticulo
    }) => {
        console.log({
            articulo: id,
            usuario: usuario.Id,
            tipo: TipoArticulo[tipo],
            ranking,
        })
        return modificarQuery({
            variables: {
                usuario: usuario.Id,
                articulo: id,
                estado,
                tipo: TipoArticulo[tipo],
                ranking,
            },
        })
    }
    return { articulo, guardar, borrar, modificar }
}
