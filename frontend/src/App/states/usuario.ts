import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { wrapperSessionStorage } from 'Hooks/sessionStorage'
import { Usuario } from 'types/app-env'

const [usuario, setUsuario] = wrapperSessionStorage<Usuario>({ key: 'usuario' })

export const EMPTY_USUARIO: Usuario = {
    Id: '',
    alias: '',
    avatar: '',
    biblioteca: [],
    clave: '',
    correo: '',
    enLinea: false,
    esAdmin: false,
    seguidores: [],
    siguiendo: [],
}

// const initialStateUsuario: Usuario | null =
const initialStateUsuarios: Usuario[] = []

export const usuarioSlice = createSlice({
    name: 'usuario',
    initialState: usuario || EMPTY_USUARIO,
    reducers: {
        login: (state, action: PayloadAction<Usuario>) => {
            setUsuario(action.payload)
            return action.payload
        },
        logout: () => {
            // setUsuario(null)
            sessionStorage.clear()
            return EMPTY_USUARIO
        },
    },
})

export const usuariosSlice = createSlice({
    name: 'usuarios',
    initialState: initialStateUsuarios,
    reducers: {
        signin: (state, action: PayloadAction<Usuario>) => [
            ...state,
            action.payload,
        ],
        modify: (state, action: PayloadAction<Usuario>) => {
            return [
                ...state.filter((u) => u.Id !== action.payload.Id),
                action.payload,
            ]
        },
        initUsers: (state, action: PayloadAction<Usuario[]>) => action.payload,
        unsubscribe: (state, action: PayloadAction<Usuario>) =>
            state.filter((u) => u.Id !== action.payload.Id),
    },
})
