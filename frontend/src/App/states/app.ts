import {
    createSlice,
    PayloadAction,
    ReducersMapObject,
    SliceCaseReducers,
    ValidateSliceCaseReducers,
} from '@reduxjs/toolkit'
import { ArticuloDetallado, FiltrosSliceType } from 'types/app-env'

// interface SwipeElementsType {
//     mostrando: ArticuloDetallado[]
//     ocultos: ArticuloDetallado[]
// }
// type RankMap = Map<number, string>

export const seccionSlice = createSlice({
    name: 'seccion',
    initialState: 'home',
    reducers: {
        switchTo: (state, action: PayloadAction<{ seccion: string }>) =>
            action.payload.seccion,
    },
})

const ARTICULOS_API_EMPTY: ArticuloDetallado[][] = []

const categoriaReducers: ValidateSliceCaseReducers<
    FiltrosSliceType,
    SliceCaseReducers<FiltrosSliceType>
> = {
    initCategories: (state, action: PayloadAction<string[]>) => {
        // const { medias } = state
        return { ...state, categories: [action.payload.sort(), []] }
    },
    addCatFilter: (state, action: PayloadAction<string>) => {
        const { categories } = state
        const [mostrando] = categories
        const cat = action.payload
        if (!mostrando.includes(cat)) mostrando.push(cat)
        mostrando.sort()
        return { ...state, categories }
    },
    removeCatFilter: (state, action: PayloadAction<string>) => {
        const { categories } = state
        const [mostrando, ocultos] = categories
        const cats = mostrando.filter((cat) => cat !== action.payload)
        return { ...state, categories: [cats, ocultos] }
    },
    removeCatFilters: (state, action: PayloadAction<string[]>) => {
        const { categories } = state
        const [mostrando, ocultos] = categories
        const cats = mostrando.filter((cat) => !action.payload.includes(cat))
        return { ...state, categories: [cats, ocultos] }
    },
    swipeCatMostrandoToOculto: (state, action: PayloadAction<string[]>) => {
        const { categories, filtrando, medias } = state
        let [mostrando, oculto] = categories
        const { payload } = action
        const aOcultar = [...new Set([...oculto, ...payload])]
        const cats = mostrando.filter((cat) => !payload.includes(cat))

        return {
            ...state,
            categories: [cats, aOcultar],
            filtrando:
                hayFiltroAplicado(aOcultar) || hayFiltroAplicado(medias[1]),
        }
    },
    swipeCatOcultoToMostrando: (state, action: PayloadAction<string[]>) => {
        const { categories, filtrando, medias } = state
        let [mostrando, oculto] = categories
        const { payload } = action
        const cats = oculto.filter((cat) => !payload.includes(cat))
        const recuperados = [...new Set([...mostrando, ...payload])].sort()
        return {
            ...state,
            categories: [recuperados, cats],
            filtrando: hayFiltroAplicado(cats) || hayFiltroAplicado(medias[1]),
        }
    },
}

const mediaReducers: ValidateSliceCaseReducers<
    FiltrosSliceType,
    SliceCaseReducers<FiltrosSliceType>
> = {
    initMedias: (state, action: PayloadAction<string[]>) => {
        // const [, categories] = state
        return { ...state, medias: [action.payload.sort(), []] }
    },
    addMediaFilter: (state, action: PayloadAction<string>) => {
        const { medias } = state
        const [mostrando] = medias
        const media = action.payload
        if (!mostrando.includes(media)) mostrando.push(media)
        mostrando.sort()
        return { ...state, medias }
    },
    removeMediaFilter: (state, action: PayloadAction<string>) => {
        const { medias } = state
        const [mostrando, ocultos] = medias
        const meds = mostrando.filter((media) => media !== action.payload)
        return { ...state, medias: [meds, ocultos] }
    },
    removeMediaFilters: (state, action: PayloadAction<string[]>) => {
        const { medias } = state
        const [mostrando, ocultos] = medias
        const meds = mostrando.filter(
            (media) => !action.payload.includes(media),
        )
        return {
            ...state,
            medias: [meds, ocultos],
        }
    },
    swipeMediaMostrandoToOculto: (state, action: PayloadAction<string[]>) => {
        console.log('Filtrando media...')
        const { medias, categories, filtrando } = state
        let [mostrando, oculto] = medias
        const { payload } = action
        const meds = mostrando.filter((med) => !payload.includes(med))
        const aOcultar = [...new Set([...oculto, ...payload])]
        const res = {
            ...state,
            medias: [meds, aOcultar],
            filtrando:
                hayFiltroAplicado(aOcultar) || hayFiltroAplicado(categories[1]),
        }
        console.log({ ...res })
        return res
    },
    swipeMediaOcultoToMostrando: (state, action: PayloadAction<string[]>) => {
        const { medias, categories, filtrando } = state
        let [mostrando, oculto] = medias
        const { payload } = action
        const recuperados = [...new Set([...mostrando, ...payload])].sort()
        const meds = oculto.filter((med) => !payload.includes(med))
        console.log({ recuperados, meds, payload, filtrando })
        return {
            ...state,
            medias: [recuperados, meds],
            filtrando:
                hayFiltroAplicado(meds) || hayFiltroAplicado(categories[1]),
        }
    },
}
const saveReducers: ValidateSliceCaseReducers<
    FiltrosSliceType,
    SliceCaseReducers<FiltrosSliceType>
> = {
    initSaves: (state, action: PayloadAction<string[]>) => {
        return { ...state, saves: [action.payload.sort(), []] }
    },
}

const rankReducers: ValidateSliceCaseReducers<
    FiltrosSliceType,
    SliceCaseReducers<FiltrosSliceType>
> = {
    initRanked: (state, action: PayloadAction<string[]>) => {
        return { ...state, ranked: [action.payload, []] }
    },
}

const statusReducers: ValidateSliceCaseReducers<
    FiltrosSliceType,
    SliceCaseReducers<FiltrosSliceType>
> = {
    initStatuses: (state, action: PayloadAction<string[]>) => {
        return { ...state, statuses: [action.payload, []] }
    },
}

const clickReducers: ValidateSliceCaseReducers<
    FiltrosSliceType,
    SliceCaseReducers<FiltrosSliceType>
> = {
    setClicked: (state, action: PayloadAction<string>) => {
        return { ...state, actualFilt: action.payload }
    },
    emptyClicked: (state) => {
        const { actualFilt } = initialFiltros
        return { ...state, actualFilt }
    },
    // hayFiltroAplicado: (state) => {
    //     const {} = state
    //     return {...state}
    // },
}

export const articulosFiltSlice = createSlice({
    name: 'articulosFilt',
    initialState: ARTICULOS_API_EMPTY,
    reducers: {
        dataInitialFetch: (_, action: PayloadAction<ArticuloDetallado[]>) => [
            action.payload,
            [],
        ],
        dataFetch: (_, action: PayloadAction<ArticuloDetallado[]>) => _,
        dataSwipeMostrandoToOculto: (
            state,
            action: PayloadAction<ArticuloDetallado[]>,
        ) => {
            console.log('Filtrando articulo...')
            let [mostrando, oculto] = state
            const { payload } = action
            const aOcultar = mergeArticulos([...oculto, ...payload])
            const arts: ArticuloDetallado[] = mostrando.filter(
                (a1) => !payload.find((a2) => a2.id === a1.id),
            )
            // for (let a2 of p) {
            //     if (!oculto.find((a1) => a2.id === a1.id)) oculto.push(a2)
            // }
            console.log([arts, aOcultar])
            return [arts, aOcultar]
        },
        dataSwipeOcultoToMostrando: (
            state,
            action: PayloadAction<ArticuloDetallado[]>,
        ) => {
            // https://stackoverflow.com/questions/18773778/create-array-of-unique-objects-by-property
            let [mostrando, oculto] = state
            // const flags = new Set<ArticuloDetallado>()
            const { payload } = action

            const recuperados = mergeArticulos([...mostrando, ...payload])
            const arts = oculto.filter(
                (a1) => !payload.find((a2) => a2.id === a1.id),
            )
            // console.log({
            //     arts: arts.map((a) => a.id),
            //     recuperados: recuperados.map((a) => a.id),
            //     payload: payload.map((a) => a.id),
            // })
            // for (let a2 of p) {
            //     if (!mostrando.find((a1) => a2.id === a1.id)) mostrando.push(a2)
            // }
            return [recuperados, arts]
        },
    },
})
// const initialMedias: string[][] = []
const initialFiltros: FiltrosSliceType = {
    filtrando: false,
    medias: [],
    categories: [],
    ranked: [],
    saves: [],
    statuses: [],
    actualFilt: '',
}

export const filtrosSlice = createSlice({
    name: 'filtros',
    initialState: initialFiltros,
    reducers: {
        ...categoriaReducers,
        ...mediaReducers,
        ...clickReducers,
        ...saveReducers,
        ...statusReducers,
        ...rankReducers,
        // initMedias: (state, action: PayloadAction<string[]>) => {
        //     // const [, categories] = state
        //     return { ...state, medias: [action.payload.sort(), []] }
        // },
        // addMediaFilter: (state, action: PayloadAction<string>) => {
        //     const { medias } = state
        //     const [mostrando] = medias
        //     const media = action.payload

        //     if (!mostrando.includes(media)) mostrando.push(media)

        //     mostrando.sort()

        //     return { ...state, medias }
        // },
        // removeMediaFilter: (state, action: PayloadAction<string>) => {
        //     const { medias } = state
        //     const [mostrando, ocultos] = medias
        //     const meds = mostrando.filter((media) => media !== action.payload)

        //     return { ...state, medias: [meds, ocultos] }
        // },
        // removeMediaFilters: (state, action: PayloadAction<string[]>) => {
        //     const { medias } = state
        //     const [mostrando, ocultos] = medias
        //     const meds = mostrando.filter(
        //         (media) => !action.payload.includes(media),
        //     )

        //     return { ...state, medias: [meds, ocultos] }
        // },
        // swipeMediaMostrandoToOculto: (
        //     state,
        //     action: PayloadAction<string[]>,
        // ) => {
        //     console.log('Filtrando media...')
        //     const { medias } = state
        //     let [mostrando, oculto] = medias
        //     const aOcultar = action.payload
        //     const meds = mostrando.filter((med) => !aOcultar.includes(med))
        //     const res = {
        //         ...state,
        //         medias: [meds, [...new Set([...oculto, ...aOcultar])]],
        //     }
        //     console.log({ ...res })
        //     return res
        // },
        // swipeMediaOcultoToMostrando: (
        //     state,
        //     action: PayloadAction<string[]>,
        // ) => {
        //     const { medias } = state
        //     let [mostrando, oculto] = medias
        //     const recuperados = action.payload
        //     const meds = oculto.filter((med) => !recuperados.includes(med))
        //     for (let med of recuperados) {
        //         if (!mostrando.includes(med)) mostrando.push(med)
        //     }
        //     mostrando.sort()
        //     return { ...state, medias: [mostrando, meds] }
        // },
        // initCategories: (state, action: PayloadAction<string[]>) => {
        //     // const { medias } = state
        //     return { ...state, categories: [action.payload.sort(), []] }
        // },
        // addCatFilter: (state, action: PayloadAction<string>) => {
        //     const { categories } = state
        //     const [mostrando] = categories
        //     const cat = action.payload

        //     if (!mostrando.includes(cat)) mostrando.push(cat)

        //     mostrando.sort()

        //     return { ...state, categories }
        // },
        // removeCatFilter: (state, action: PayloadAction<string>) => {
        //     const { categories } = state
        //     const [mostrando, ocultos] = categories
        //     const cats = mostrando.filter((cat) => cat !== action.payload)

        //     return { ...state, categories: [cats, ocultos] }
        // },
        // removeCatFilters: (state, action: PayloadAction<string[]>) => {
        //     const { categories } = state
        //     const [mostrando, ocultos] = categories
        //     const cats = mostrando.filter(
        //         (cat) => !action.payload.includes(cat),
        //     )

        //     return { ...state, categories: [cats, ocultos] }
        // },
        // swipeCatMostrandoToOculto: (state, action: PayloadAction<string[]>) => {
        //     const { categories } = state
        //     let [mostrando, oculto] = categories
        //     const aOcultar = action.payload
        //     const cats = mostrando.filter((cat) => !aOcultar.includes(cat))
        //     for (let cat of aOcultar) {
        //         if (!oculto.includes(cat)) oculto.push(cat)
        //     }
        //     return { ...state, categories: [cats, oculto] }
        // },
        // swipeCatOcultoToMostrando: (state, action: PayloadAction<string[]>) => {
        //     const { categories } = state
        //     let [mostrando, oculto] = categories
        //     const recuperados = action.payload
        //     const cats = oculto.filter((cat) => !recuperados.includes(cat))
        //     for (let cat of recuperados) {
        //         if (!mostrando.includes(cat)) mostrando.push(cat)
        //     }
        //     mostrando.sort()
        //     return { ...state, categories: [mostrando, cats] }
        // },
    },
})

function hayFiltroAplicado(ocultos: string[]): boolean {
    return ocultos.length > 0
}

function mergeArticulos(articulos: ArticuloDetallado[]): ArticuloDetallado[] {
    const flags = new Set()
    return articulos.filter((art) => {
        if (flags.has(art.id)) {
            return false
        }
        flags.add(art.id)
        return true
    })
}

// function rankOrdenPorKey(a: [number, string], b: [number, string]) {
//     return a[0] - b[0]
// }
