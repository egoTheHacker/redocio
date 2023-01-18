import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ARTICULO_COMBINADO_EMPTY, TipoArticulo, TipoEstado } from 'Config/util'
import { wrapperSessionStorage } from 'Hooks/sessionStorage'
import { Articulo, ArticuloCombinado, ArticuloDetallado } from 'types/app-env'

const [articulo, setArticulo] = wrapperSessionStorage<ArticuloCombinado>({
    key: 'articulo',
})

const EMPTY_ARTICULOS: (ArticuloCombinado | ArticuloDetallado)[] = []

const ARTICULOS_API_EMPTY: ArticuloDetallado[] = []

const ARTICULOS_EMPTY: Articulo[] = []

export const articuloSlice = createSlice({
    name: 'articulo',
    initialState: articulo || ARTICULO_COMBINADO_EMPTY,
    reducers: {
        init: (state, action: PayloadAction<ArticuloCombinado>) => {
            setArticulo(action.payload)
            return action.payload
        },
        close: () => {
            setArticulo(null)
            return ARTICULO_COMBINADO_EMPTY
        },
    },
})

export const articulosSlice = createSlice({
    name: 'articulos',
    initialState: ARTICULOS_EMPTY,
    reducers: {
        inits: (_, action: PayloadAction<Articulo[]>) => action.payload,
        add: (state, action: PayloadAction<Articulo>) => [
            ...state,
            action.payload,
        ],
        modify: (
            state,
            action: PayloadAction<{
                articulo: string
                ranking?: number
                estado?: TipoEstado
                guardado?: boolean
            }>,
        ) => {
            const { articulo } = action.payload
            const art = state.find((a) => a.Id === articulo)
            console.log({ art })
            if (art) return [...state.filter((a) => a.Id !== articulo), art]
            return state
        },
    },
})

export const articulosAPISlice = createSlice({
    name: 'articulosAPI',
    initialState: ARTICULOS_API_EMPTY,
    reducers: {
        initFetch: (_, action) => action.payload,
    },
})
