import { useAppDispatch, useAppSelector } from 'App/hooks'
import { close } from 'App/store'
import { Articulo } from 'Components/Articulo'
import { ComentarioCard } from 'Components/ComentarioCard'
import { Encabezado } from 'Components/Encabezado'
import { rutas } from 'Config/routes'
import {
    ARTICULO_COMBINADO_EMPTY,
    capitalize,
    rutaMap,
    TipoArticulo,
} from 'Config/util'
import { useArticulo } from 'Hooks/articulos'
import { useComentario } from 'Hooks/comentarios'
import { FormEventHandler, MouseEventHandler, useEffect, useState } from 'react'
import { useLocation, useRoute } from 'wouter'
import './estilos.scss'

interface ArticuloDetalladoProps {
    id?: string
    tipo?: TipoArticulo
}

/** Página donde se puede un artículo en concreto, con todos sus detalles */
export function ArticuloDetallado({ id, tipo }: ArticuloDetalladoProps) {
    /** Longitud máxima de la sinopsis */
    const S_MAX_LENGTH = 100
    const [location] = useLocation()
    const articuloTipo = tipo ?? rutaMapGetKey(location)
    const [match, params] = useRoute(routerRuta(location) || 'art/:id')
    // const { articulo } = useAppSelector((state) => state)
    const articuloID = id ?? params?.id
    // console.log({ location: location.slice(1).split('/'), articuloID })
    // ''.split
    const articulo =
        articuloID && articuloTipo
            ? useArticulo({ id: articuloID, tipo: articuloTipo }).getArticulo()
            : ARTICULO_COMBINADO_EMPTY
    const [mensaje, setMensaje] = useState('')
    const { comentar, upvote } = useComentario()
    const dispatch = useAppDispatch()
    // const [location] = useLocation()
    const { portada, sinopsis, creadores, comentarios } = articulo
    const [mostrarSinopsis, setMostrarSinopsis] = useState(true)
    const sinopsisExtensible = sinopsis && sinopsis.length > S_MAX_LENGTH
    const toggleSinopsis = () => {
        if (sinopsisExtensible) setMostrarSinopsis((prev) => !prev)
    }
    const sinopsisAcortada = sinopsisExtensible
        ? sinopsis.slice(0, S_MAX_LENGTH - 3) + '...'
        : sinopsis
    const EXCLUDE_FIELDS = [
        'id',
        '__typename',
        'portada',
        'titulo',
        'tipo',
        'sinopsis',
        'comentarios',
        'estado',
        'guardado',
        'ranking',
    ]
    const articulo_filtered = Object.entries(articulo).filter(
        ([k]) => !EXCLUDE_FIELDS.includes(k),
    )
    const handleClick: MouseEventHandler = () => comentar(mensaje)
    const inputHandler: FormEventHandler = (evt) =>
        setMensaje((evt.currentTarget as HTMLInputElement).value)
    useEffect(() => {
        console.log({ id, tipo })
    }, [])
    useEffect(() => {
        console.log({ sinopsis, portada })
    }, [articulo])
    // console.table(articulo_filtered)
    // window.onpopstate = () => {
    //     console.log(`Saliendo de ${location}...`)
    //     if (location.split('/').includes('art')) dispatch(close())
    // }
    if (!articulo.id)
        return <main>Ha habido un error al cargar el artículo</main>
    return (
        <>
            <Encabezado />
            <main className='ArticuloDetallado'>
                <Articulo detalles={articulo} onClick={() => {}} />
                <section id='art-det'>
                    <article>
                        <legend>Sinopsis:</legend>
                        <p onClick={toggleSinopsis}>
                            {!sinopsis
                                ? 'No disponible'
                                : mostrarSinopsis
                                ? sinopsis
                                : sinopsisAcortada}
                        </p>
                    </article>
                    {/* <article>
                        <legend>Idioma:</legend>
                        <p>{articulo.idioma}</p>
                    </article> */}
                    {articulo_filtered.map(([k, v]) => {
                        return (
                            <article key={k}>
                                <legend>{capitalize(k)}:</legend>
                                <p>{k === 'creadores' ? v.join(', ') : v}</p>
                            </article>
                        )
                    })}
                </section>
                <section id='art-com'>
                    {(!comentarios || comentarios.length === 0) && (
                        <>Sé el primero en comentar. No seas tímido</>
                    )}
                    {comentarios?.map((c) => (
                        <ComentarioCard detalles={c} />
                    ))}
                </section>
                <aside id='com-envio'>
                    <textarea
                        name='com-campo'
                        id='com-campo'
                        onInput={inputHandler}></textarea>
                    <input
                        className='btn'
                        type='button'
                        value='Enviar'
                        onClick={handleClick}
                    />
                </aside>
            </main>
        </>
    )
}

function rutaMapGetKey(location: string) {
    console.log([...rutaMap])
    const [patron] = location.slice(1).split('/')
    for (let [k, v] of [...rutaMap]) {
        if (v === patron) return k
    }
    return TipoArticulo.ARTICULO
}

function routerRuta(location: string) {
    const [rut] = location.slice(1).split('/')
    const ruta = rutas.find((r) => r.nombre === rut)
    return ruta?.path
}
