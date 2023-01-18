import { configureStore } from '@reduxjs/toolkit'
import { articulosFiltSlice, filtrosSlice, seccionSlice } from './states/app'
import {
    articulosAPISlice,
    articuloSlice,
    articulosSlice,
} from './states/articulo'
import { EMPTY_USUARIO, usuarioSlice, usuariosSlice } from './states/usuario'

export const store = configureStore({
    reducer: {
        usuario: usuarioSlice.reducer,
        usuarios: usuariosSlice.reducer,
        articulo: articuloSlice.reducer,
        articulos: articulosSlice.reducer,
        articulosAPI: articulosAPISlice.reducer,
        articulosFilt: articulosFiltSlice.reducer,
        seccion: seccionSlice.reducer,
        filtros: filtrosSlice.reducer,
    },
})

export const { login, logout } = usuarioSlice.actions
export const {
    signin,
    unsubscribe,
    initUsers,
    modify: modifyUser,
} = usuariosSlice.actions
export const { close, init } = articuloSlice.actions
export const { add, inits, modify } = articulosSlice.actions
export const { switchTo } = seccionSlice.actions

export const { initFetch } = articulosAPISlice.actions
export const {
    dataInitialFetch,
    dataSwipeMostrandoToOculto,
    dataSwipeOcultoToMostrando,
    dataFetch,
} = articulosFiltSlice.actions

export const {
    addCatFilter,
    removeCatFilter,
    removeCatFilters,
    addMediaFilter,
    removeMediaFilter,
    removeMediaFilters,
    initMedias,
    initCategories,
    initSaves,
    initRanked,
    initStatuses,
    swipeCatMostrandoToOculto,
    swipeCatOcultoToMostrando,
    swipeMediaMostrandoToOculto,
    swipeMediaOcultoToMostrando,
    setClicked,
    emptyClicked,
} = filtrosSlice.actions

export { EMPTY_USUARIO }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
