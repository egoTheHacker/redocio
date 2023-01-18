import { useAppDispatch, useAppSelector } from 'App/hooks'
import {
    dataSwipeMostrandoToOculto,
    dataSwipeOcultoToMostrando,
    emptyClicked,
    initCategories,
    initMedias,
    initRanked,
    initSaves,
    initStatuses,
    swipeCatMostrandoToOculto,
    swipeCatOcultoToMostrando,
    swipeMediaMostrandoToOculto,
    swipeMediaOcultoToMostrando,
} from 'App/store'
// import { dataFetch } from 'App/store'
import { rankMap, TipoArticulo, TipoEstado } from 'Config/util'
import {
    Dispatch,
    MouseEventHandler,
    SetStateAction,
    useEffect,
    useState,
} from 'react'
import { ArticuloCombinado, ArticuloDetallado } from 'types/app-env'

type Opcion = { valor: string; cantidad: number }

interface Filtro {
    nombre: string
    opciones: Opcion[]
    authRequired?: boolean
    handler?: MouseEventHandler
}

// type Props = {
//     setClicked: Dispatch<SetStateAction<string>>
// }

type FilterCb<T> = (value: T, index?: number, array?: T[]) => boolean

enum TipoFiltro {
    Media = 0,
    Category = 1,
    Status = 2,
    Save = 3,
    Rank = 4,
}

function rankMapGetKey(value: string) {
    for (let [k, v] of rankMap) {
        if (v === value) return k
    }
    return 0
}

// type Fil<T> = (value: T, index?: number, array?: T[]) => boolean

type FilterArticuloDetallado = FilterCb<ArticuloDetallado>

export function useFiltros() {
    const { articulosFilt, articulosAPI, usuario } = useAppSelector((s) => s)
    const [mostrando, ocultos] = articulosFilt
    const {
        medias: mediasFilt,
        categories: categoriesFilt,
        ranked: rankedFilt,
        saves: savesFilt,
        statuses: statusesFilt,
    } = useAppSelector((s) => s.filtros)
    const [medias, mediasApplied] = mediasFilt
    const [ranked, rankedApplied] = rankedFilt
    const [saves, savesApplied] = savesFilt
    const [statuses, statusesApplied] = statusesFilt
    const [categories, categoriesApplied] = categoriesFilt
    const dispatch = useAppDispatch()

    const mediaFiltro =
        (tipo: string): FilterArticuloDetallado =>
        (a: ArticuloDetallado) =>
            a.tipo === getTipoMedia(tipo)

    const catFiltro = (cat: string): FilterArticuloDetallado => {
        return (a: ArticuloDetallado) => {
            const { generos } = a
            if (!generos) return false
            return generos.length > 0 && generos.includes(cat)
        }
    }
    const getFilterCallback = (
        tipo: TipoFiltro,
        f: string,
    ): FilterArticuloDetallado => {
        let callbk: FilterArticuloDetallado
        switch (tipo) {
            case TipoFiltro.Media:
                callbk = mediaFiltro(f)
                break
            case TipoFiltro.Category:
                callbk = catFiltro(f)
                break
            default:
                throw TypeError('Tipo de filtro no implementado')
        }
        console.log({ callbk: callbk })
        return callbk
    }

    useEffect(() => {
        // setArticulosFiltrados(articulosAPI)
        const cats: string[] = []
        for (const art of articulosAPI) {
            art.generos?.forEach((gen) => {
                if (!cats.includes(gen)) cats.push(gen)
            })
        }
        const meds = Object.keys(TipoArticulo).filter(
            (k) => isNaN(Number(k)) && k !== 'ARTICULO',
        )
        const ranks = [...rankMap.values()]
        const stats = Object.keys(TipoEstado).filter((k) => isNaN(Number(k)))
        const savs = ['GUARDADO', 'NO GUARDADO']
        // console.log({ meds })
        dispatch(initCategories(cats))
        dispatch(initMedias(meds))
        dispatch(initRanked(ranks))
        dispatch(initStatuses(stats))
        dispatch(initSaves(savs))
    }, [articulosAPI])

    useEffect(() => {
        console.log({ mostrando, ocultos })
    }, [ocultos])

    const filtrarArticulos = (tipo: TipoFiltro, f: string) => {
        let callbk: FilterArticuloDetallado = getFilterCallback(tipo, f)

        const aOcultar = mostrando.slice().filter((a) => !callbk(a))
        console.log({ aOcultar })

        if (aOcultar.length > 0) dispatch(dataSwipeMostrandoToOculto(aOcultar))
    }

    function desfiltrarArticulos(tipo: TipoFiltro, f: string) {
        let recuperados: ArticuloDetallado[] = []

        console.log({ mediasApplied, categoriesApplied })

        if ([...mediasApplied, ...categoriesApplied].length <= 1) {
            return clearHandler()
        }

        // dispatch(dataSwipeOcultoToMostrando(ocultos))
        const refiltrar = (tipo: TipoFiltro, f: string) => {
            const callbk: FilterArticuloDetallado = getFilterCallback(tipo, f)
            // console.log({ tipo })
            const swipe =
                tipo === TipoFiltro.Media
                    ? swipeMediaOcultoToMostrando
                    : swipeCatOcultoToMostrando
            const rec = ocultos.filter(callbk)
            console.log({ rec })
            dispatch(swipe(rec))
        }

        mediasApplied.forEach((t) => {
            if (t !== f) {
                console.log(`Refiltrando ${t}...`)
                // const res = ocultos.filter((a) => !mediaFiltro(t))
                // console.log({ res })
                // res.forEach((a) => {
                //     console.log({ a })
                //     if (recuperados.find((p) => p.id === a.id) === undefined)
                //         recuperados.push(a)
                // })
                refiltrar(TipoFiltro.Media, t)
            }
            console.log({ recuperados, ocultos })
        })

        categoriesApplied.forEach((c) => {
            if (c !== f) {
                console.log(`Refiltrando ${c}...`)
                // const res = ocultos.filter(catFiltro(c))
                // res.forEach((a) => {
                //     if (recuperados.find((p) => p.id === a.id) === undefined)
                //         recuperados.push(a)
                // })
                refiltrar(TipoFiltro.Category, c)
            }
        })

        // if (recuperados.length > 0)
        //     dispatch(dataSwipeOcultoToMostrando(recuperados))
    }

    const removeMediaFilterHandler: MouseEventHandler<HTMLButtonElement> = (
        evt,
    ) => {
        const tipo =
            (evt.currentTarget as HTMLElement).getAttribute('data-op') || ''
        dispatch(swipeMediaOcultoToMostrando([tipo]))
        desfiltrarArticulos(TipoFiltro.Media, tipo)
    }

    const removeStatusFilterHandler: MouseEventHandler<HTMLButtonElement> = (
        evt,
    ) => {
        // const tipo =
        //     (evt.currentTarget as HTMLElement).getAttribute('data-op') || ''
        // dispatch(swipeMediaOcultoToMostrando([tipo]))
        // desfiltrarArticulos(TipoFiltro.Media, tipo)
        // TODO: Por implementar
        if (!usuario.enLinea) return
    }

    const removeSaveFilterHandler: MouseEventHandler<HTMLButtonElement> = (
        evt,
    ) => {
        // const tipo =
        //     (evt.currentTarget as HTMLElement).getAttribute('data-op') || ''
        // dispatch(swipeMediaOcultoToMostrando([tipo]))
        // desfiltrarArticulos(TipoFiltro.Media, tipo)
        // TODO: Por implementar
        if (!usuario.enLinea) return
    }

    const removeCatFilterHandler: MouseEventHandler<HTMLButtonElement> = (
        evt,
    ) => {
        const cat =
            (evt.currentTarget as HTMLElement).getAttribute('data-op') || ''
        dispatch(swipeCatOcultoToMostrando([cat]))
        desfiltrarArticulos(TipoFiltro.Category, cat)
    }

    const closeHandler = () => {
        dispatch(emptyClicked(''))
    }

    const clearHandler = () => {
        dispatch(swipeMediaOcultoToMostrando(mediasApplied))
        dispatch(swipeCatOcultoToMostrando(categoriesApplied))
        dispatch(dataSwipeOcultoToMostrando(ocultos))
    }

    const FILTROS: Filtro[] = [
        {
            nombre: 'Tipo media',
            opciones: medias
                ? medias.map((f) => {
                      const cantidad: number =
                          mostrando &&
                          mostrando.filter((a) => getTipoMedia(f) === a.tipo)
                              .length
                      return { valor: f, cantidad }
                  })
                : [],
            handler: (evt) => {
                const target = evt.currentTarget as HTMLElement
                const tipo = target.getAttribute('data-op') || ''
                // swipeElement(tipo, setMedias, setMediasApplied)
                dispatch(swipeMediaMostrandoToOculto([tipo]))
                filtrarArticulos(TipoFiltro.Media, tipo)
                closeHandler()
            },
        },
        {
            nombre: 'Puntuación',
            opciones: ranked
                ? ranked.map((f) => {
                      let cantidad = 0
                      //   console.log([...rankMap])
                      if (usuario.enLinea) {
                          cantidad =
                              mostrando &&
                              (mostrando as ArticuloCombinado[]).filter(
                                  (m) => m.ranking === rankMapGetKey(f),
                              ).length
                      }
                      return { valor: f, cantidad }
                  })
                : [],
            authRequired: true,
        },
        {
            nombre: 'Guardado',
            opciones: saves
                ? saves.map((f) => {
                      let cantidad = 0
                      //   console.log({ f })
                      if (usuario.enLinea) {
                          cantidad =
                              mostrando &&
                              (mostrando as ArticuloCombinado[]).filter((m) => {
                                  if (f === 'GUARDADO') {
                                      return m.guardado
                                  }
                                  return !m.guardado
                              }).length
                      }
                      return { valor: f, cantidad }
                  })
                : [],
            authRequired: true,
        },
        {
            nombre: 'Estado',
            opciones: statuses
                ? statuses.map((f) => {
                      let cantidad = 0
                      //   console.log({ f })
                      if (usuario.enLinea) {
                          cantidad =
                              mostrando &&
                              (mostrando as ArticuloCombinado[]).filter((m) => {
                                  const s = new Map([
                                      ['TERMINADO', TipoEstado.TERMINADO],
                                      ['VIENDO', TipoEstado.VIENDO],
                                      ['PENDIENTE', TipoEstado.PENDIENTE],
                                  ])
                                  return m.estado === s.get(f)
                              }).length
                      }
                      return { valor: f, cantidad }
                  })
                : [],
            authRequired: true,
        },
        {
            nombre: 'Categoría',
            opciones: categories
                ? categories.map((f) => {
                      const cantidad: number =
                          mostrando &&
                          mostrando.filter(
                              ({ generos }) => generos && generos.includes(f),
                          ).length
                      return { valor: f, cantidad }
                  })
                : [],
            handler: (evt) => {
                const target = evt.currentTarget as HTMLElement
                const cat = target.getAttribute('data-op') || ''
                // swipeElement(cat, setCategories, setCategoriesApplied)
                dispatch(swipeCatMostrandoToOculto([cat]))
                filtrarArticulos(TipoFiltro.Category, cat)
                closeHandler()
            },
        },
    ]
    // const FILTROS: Filtro[] = []

    const DESFILTROS: Filtro[] = [
        {
            nombre: 'Tipo media',
            opciones: mediasApplied
                ? mediasApplied.map((f) => {
                      return { valor: f, cantidad: 0 }
                  })
                : [],
            handler: removeMediaFilterHandler,
        },
        {
            nombre: 'Puntuado',
            opciones: rankedApplied
                ? rankedApplied.map((f) => {
                      return { valor: f, cantidad: 0 }
                  })
                : [],
            handler: () => {},
        },
        {
            nombre: 'Guardado',
            opciones: savesApplied
                ? savesApplied.map((f) => {
                      return { valor: f, cantidad: 0 }
                  })
                : [],
            handler: removeSaveFilterHandler,
        },
        {
            nombre: 'Estado',
            opciones: statusesApplied
                ? statusesApplied.map((f) => {
                      return { valor: f, cantidad: 0 }
                  })
                : [],
            handler: removeStatusFilterHandler,
        },
        {
            nombre: 'Categoría',
            opciones: categoriesApplied
                ? categoriesApplied.map((f) => {
                      return { valor: f, cantidad: 0 }
                  })
                : [],
            handler: removeCatFilterHandler,
        },
    ]

    return {
        FILTROS,
        DESFILTROS,
        clearHandler,
        closeHandler,
        filtrarArticulos,
        desfiltrarArticulos,
        removeCatFilterHandler,
        removeMediaFilterHandler,
        mediasApplied,
        categoriesApplied,
    }
}

function getTipoMedia(tipo: string) {
    // console.log(Object.keys())
    // console.log({ tipo })
    switch (tipo) {
        case 'LIBRO':
            return TipoArticulo.LIBRO
        case 'JUEGO':
            return TipoArticulo.JUEGO
        case 'SERIE':
            return TipoArticulo.SERIE
        case 'PELICULA':
            return TipoArticulo.PELICULA
        default:
            throw TypeError(
                `Este tipo de media (${tipo}), no está contemplado.`,
            )
    }
}
