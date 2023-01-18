// import { COLORES, TipoArticulo } from 'Config/util'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import { init } from 'App/store'
import { PortadaDefecto } from 'Components/Portada'
import { rankMap, rutaMap, TipoArticulo } from 'Config/util'
import { useArticulo } from 'Hooks/articulos'
import { useArticuloB, useBiblioteca } from 'Hooks/biblioteca'
import { useUsuario } from 'Hooks/usuario'
import { Bookmark } from 'icons/Bookmark'
import { Chain } from 'icons/Chain'
import { Heart } from 'icons/Heart'
import {
    MouseEvent,
    MouseEventHandler,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react'
import { ArticuloCombinado, ArticuloDetallado } from 'types/app-env'
import { useLocation } from 'wouter'
import './estilos.scss'

interface ArticuloProps extends PropsWithChildren {
    detalles: ArticuloCombinado | ArticuloDetallado
    onClick?: MouseEventHandler
}

export function Articulo({ detalles, ...props }: ArticuloProps) {
    const [location, setLocation] = useLocation()
    // const [mostralModal, setMostrarModal] = useState(false)
    const [propiedad, setPropiedad] = useState('')
    const dispatch = useAppDispatch()
    const { portada, titulo, creadores, tipo, id } = detalles
    const { usuario } = useAppSelector((state) => state)
    const tituloLargo = titulo.length > 30
    const tituloAcortado = titulo.slice(0, 27) + '...'
    const creador = creadores.join(', ')
    const creadorLargo = creador.length > 30
    const creadorAcortado = creador.slice(0, 27) + '...'

    const switchPropiedad = (prop: string) => {
        if (prop && prop === propiedad) setPropiedad('')
        else setPropiedad(prop)
    }
    const mostrarModal = propiedad !== ''

    const clickHandler = (evt: MouseEvent) => {
        evt.stopPropagation()

        // console.log({ tipo })
        dispatch(init(detalles as ArticuloCombinado))
        setLocation(`${rutaMap.get(tipo)}/${id}`)
    }

    return (
        <article
            {...props}
            onClick={props.onClick ?? clickHandler}
            className={`Articulo tipo-${tipo}`}
            title={creador ? `${titulo} - ${creador}` : titulo}
            id={`Articulo-${id}`}>
            {/* <header>
                <span>{titulo.slice(0, 12)}...</span>-
                <span>{creadores?.at(0)}</span>
            </header> */}
            {portada ? (
                <img src={portada} alt='' className='portada' />
            ) : (
                <PortadaDefecto
                    className='portada'
                    titulo={tituloLargo ? tituloAcortado : titulo}
                    creador={creadorLargo ? creadorAcortado : creador}
                />
            )}
            {usuario.enLinea && mostrarModal && (
                <OpcionesModal propiedad={propiedad} />
            )}
            {usuario.enLinea && (
                <Opciones
                    id={id}
                    tipo={tipo}
                    switchPropiedad={switchPropiedad}
                />
            )}
        </article>
    )
}

function Opciones({
    id,
    tipo,
    switchPropiedad,
}: {
    id: string
    tipo: TipoArticulo
    switchPropiedad: (propiedad: string) => void
}) {
    const { articulos } = useAppSelector((state) => state)
    // const articulo = articulos.find((a) => a.Id === id)
    const { getArticulo, borrar, guardar, modificar } = useArticulo({ id })
    const articulo = getArticulo()
    // const { articulo, error, modificar, borrar, guardar } = useArticuloB({ id })
    // const { error } = useArticuloB({ id })
    // const [ranking, setRanking] = useState(articulo.ranking ?? 0)
    const [ranking, setRanking] = useState(articulo?.ranking ?? 0)
    // const [guardado, setGuardado] = useState(articulo.guardado ?? false)
    const [guardado, setGuardado] = useState(articulo?.guardado ?? false)
    const bookmarked = guardado ? 'bookmarked' : ''
    const ranked = ranking !== 0 ? 'liked' : ''

    // console.log({ articulo })
    // console.log({ ranking })

    const bookmarkHandler = () => {
        // ;(evt.target as SVGElement).classList.toggle('bookmarked')
        !guardado ? guardar({ tipo }) : borrar()
        setGuardado((prev) => !prev)
    }

    const heartHandler = (evt: Event) => {
        // ;(evt.target as SVGElement).classList.toggle('liked')
        evt.preventDefault()
        switchPropiedad('rank')
        // setRanking((prev) => (prev === 0 ? 1 : 0))
        // modificar({ ranking, tipo }).then(() => {
        //     console.log(`Actualizando ranking a ${ranking}`)
        //     // console.log({ ranking })
        // })
    }

    const chainHandler = () => {
        switchPropiedad('link')
        // ;(evt.target as SVGElement).classList.toggle('bookmarked')
    }

    return (
        <div className='Opciones' onClick={(evt) => evt.stopPropagation()}>
            <Heart
                className={ranked}
                onClick={heartHandler}
                width={21}
                height={21}
            />
            <Bookmark
                className={bookmarked}
                onClick={bookmarkHandler}
                width={21}
                height={21}
            />
            <Chain onClick={chainHandler} width={21} height={21} />
        </div>
    )
}

function OpcionesModal({ propiedad }: { propiedad: string }) {
    type Propiedad = {
        nombre: string
        valor: number | string
        handler?: MouseEventHandler
    }
    // rankMap
    let propiedades: Propiedad[] | undefined = undefined

    if (propiedad === 'rank') {
        propiedades = [
            {
                nombre: rankMap.get(1) + 'Me gusta',
                valor: 1,
                handler: (evt) => {
                    console.log('Qué pasa!!!')
                },
            },
            { nombre: rankMap.get(2) + 'Me encanta', valor: 2 },
            { nombre: rankMap.get(-1) + 'No me gusta', valor: -1 },
        ]
    } else if (propiedad === 'link') {
        propiedades = [
            { nombre: 'twitter', valor: 'https://twitter.com' },
            { nombre: 'whatsapp', valor: 'https://whatsapp.com' },
            { nombre: 'telegram', valor: 'https://telegram.com' },
        ]
    }

    // const propiedades: { rank: Propiedad[]; link: Propiedad[] } = {
    //     rank: [
    //         { nombre: 'Me gusta', valor: 1 },
    //         { nombre: 'Me encanta', valor: 2 },
    //         { nombre: 'No me gusta', valor: -1 },
    //     ],
    //     link: [
    //         { nombre: 'twitter', valor: 'https://twitter.com' },
    //         { nombre: 'whatsapp', valor: 'https://whatsapp.com' },
    //         { nombre: 'telegram', valor: 'https://telegram.com' },
    //     ],
    // }

    // propiedades
    console.log(Object.fromEntries(rankMap))
    // console.log(propiedad && propiedades[propiedad])
    return (
        <aside
            className='OpcionesModal'
            onClick={(evt) => evt.stopPropagation()}>
            <ul>
                {propiedades &&
                    propiedades.map((p) => (
                        <li key={p.valor} data-id={p.valor} onClick={p.handler}>
                            {p.nombre}
                        </li>
                    ))}
            </ul>
        </aside>
    )
}
