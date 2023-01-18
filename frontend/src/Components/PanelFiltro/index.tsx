import { useAppDispatch, useAppSelector } from 'App/hooks'
import { emptyClicked, setClicked } from 'App/store'
// import { dataFetch } from 'App/store'
import {
    capitalize,
    removeFromArray,
    swipeElements,
    TipoArticulo,
} from 'Config/util'
import { useFiltros } from 'Hooks/filtros'
import { MouseEventHandler, useEffect, useState } from 'react'
import { ArticuloDetallado } from 'types/app-env'
import './estilos.scss'

type Opcion = { valor: string; cantidad: number }

interface Filtro {
    nombre: string
    opciones: Opcion[]
    handler?: MouseEventHandler
}

export function PanelFiltro() {
    // const [clicked, setClicked] = useState('')
    const FILTERS_USER_REQUIRED = ['Puntuado', 'Guardado', 'Estado']
    const { usuario } = useAppSelector((state) => state)
    const { filtrando } = useAppSelector((state) => state.filtros)
    // const { filtrando, actualFilt } = filtros
    const dispatch = useAppDispatch()
    const {
        FILTROS,
        clearHandler,
        // desfiltrarArticulos,
        // filtrarArticulos,
        // filtersApplied,
        mediasApplied,
        categoriesApplied,
        removeCatFilterHandler,
        removeMediaFilterHandler,
        // articulosFiltrados,
    } = useFiltros()

    return (
        <aside className='PanelFiltro'>
            <article className='filtros'>
                {FILTROS.filter((f) => usuario.enLinea || !f.authRequired).map(
                    (f) => (
                        <Filtro key={f.nombre} detalles={f} />
                    ),
                )}
            </article>
            <article className='filtrado'>
                {mediasApplied &&
                    mediasApplied.map((f) => {
                        return (
                            <div>
                                {capitalize(f)}
                                <button
                                    className='btn'
                                    data-op={f}
                                    onClick={removeMediaFilterHandler}>
                                    &times;
                                </button>
                            </div>
                        )
                    })}
                {categoriesApplied &&
                    categoriesApplied.map((f) => {
                        return (
                            <div>
                                {capitalize(f)}
                                <button
                                    className='btn'
                                    data-op={f}
                                    onClick={removeCatFilterHandler}>
                                    &times;
                                </button>
                            </div>
                        )
                    })}
                {filtrando ? (
                    <button className='btn' onClick={clearHandler}>
                        Clear
                    </button>
                ) : null}
            </article>
        </aside>
    )
}

interface FiltroProps {
    detalles: Filtro
    // clickHandler: (nombre: string) => void
    // closeHandler: MouseEventHandler
}

const Filtro = ({ detalles }: FiltroProps) => {
    const { nombre, opciones, handler } = detalles
    const { actualFilt: clicked } = useAppSelector((state) => state.filtros)
    const dispatch = useAppDispatch()
    const clickHandler = (nombre: string) => {
        if (clicked !== nombre) dispatch(setClicked(nombre))
        // setClicked((prev) => {
        //     if (prev === nombre) return ''
        //     else return nombre
        // })
    }
    const closeHandler = () => {
        // dispatch(dataFetch([]))
        dispatch(emptyClicked(''))
        // setClicked('')
    }

    return (
        <>
            <button
                key={`btn-${nombre}`}
                className='btn'
                onClick={() => clickHandler(nombre)}>
                {nombre}
            </button>
            {clicked === nombre ? (
                <ul className='filtro-cont'>
                    <li onClick={closeHandler}>&times;</li>
                    {opciones.map((op) => (
                        <li key={op.valor} onClick={handler} data-op={op.valor}>
                            {capitalize(op.valor)} <span>({op.cantidad})</span>
                        </li>
                    ))}
                </ul>
            ) : null}
        </>
    )
}

// {
//     filtersApplied.length > 0
//         ? filtersApplied.map((f) => {
//               return (
//                   <div>
//                       {capitalize(f)}
//                       <button
//                           className='btn'
//                           data-op={f}
//                           onClick={removeFilterHandler}>
//                           &times;
//                       </button>
//                   </div>
//               )
//           })
//         : null
// }
