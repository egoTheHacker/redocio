// import { useState } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import {
    initUsers,
    login,
    logout,
    modifyUser,
    signin,
    unsubscribe,
} from 'App/store'
import {
    LOGIN_QUERY,
    LOGOUT_QUERY,
    MODIFICAR_USUARIO_QUERY,
    SIGNIN_QUERY,
    UNSUBSCRIBE_QUERY,
    USUARIOS_QUERY,
} from 'queries'
import { Usuario } from 'types/app-env'
import { useArticulosApp } from './biblioteca'
import { useSessionStorage } from './sessionStorage'

export function useUsuarios() {
    const dispatch = useAppDispatch()
    const [usuariosQuery, { loading, error, data }] = useLazyQuery<{
        usuarios: Usuario[]
    }>(USUARIOS_QUERY)
    const fetchUsuarios = () =>
        usuariosQuery().then(({ data }) => {
            if (data) {
                dispatch(initUsers(data.usuarios))
            }
            return data?.usuarios
        })
    return { fetchUsuarios, cargando: loading, errores: [error?.message] }
}

export function useUsuario({ id }: { id: string }) {
    const dispatch = useAppDispatch()
    let cargando = false
    let errores: string[] = []
    const [unsubscribeQuery, unsubscribeResult] = useMutation<{
        unsubscribe: { succeded: boolean; usuario: Usuario }
    }>(UNSUBSCRIBE_QUERY)
    const [modUsuarioQuery, modUsuarioResult] = useMutation<{
        modificarUsuario: Usuario
    }>(MODIFICAR_USUARIO_QUERY)

    const unsubscribeFunction = () =>
        unsubscribeQuery({ variables: { id } }).then(({ data }) => {
            const res = data?.unsubscribe
            const { loading, error } = unsubscribeResult
            cargando = loading
            if (error) errores = [error.message]
            if (res?.succeded) dispatch(unsubscribe(res?.usuario))
            return res?.succeded
        })

    const modUsuarioFunction = ({
        clave,
        alias,
    }: {
        clave?: string
        alias?: string
    }) =>
        modUsuarioQuery({ variables: { id, clave, alias } }).then(
            ({ data }) => {
                if (data) dispatch(modifyUser(data.modificarUsuario))
                return data?.modificarUsuario
            },
        )

    return {
        unsubscribe: unsubscribeFunction,
        modify: modUsuarioFunction,
        cargando,
        errores,
    }
}

export function useLogin() {
    // const { usuario } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    // const { setUsuario } = useUsuario()
    const [loginQuery, loginResult] = useMutation<{ login: Usuario }>(
        LOGIN_QUERY,
    )
    const { loading, error } = loginResult
    const loginFunction = ({
        correo,
        clave,
    }: {
        correo: string
        clave: string
    }) =>
        loginQuery({ variables: { correo, clave } })
            .then(({ data }) => {
                if (data) dispatch(login(data.login))
                // console.log(data)
                return data?.login
            })
            .catch((e) => {
                console.error({ e })
            })
    // console.log({ usuario })
    return {
        login: loginFunction,
        cargando: loading,
        errores: [error?.message],
    }
}

export function useLogout() {
    const { usuario } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()
    // const { setUsuario } = useUsuario()
    const [logoutQuery, logoutResult] = useMutation(LOGOUT_QUERY)
    const { loading, error } = logoutResult
    const logoutFunction = () =>
        logoutQuery({ variables: { usuario: usuario.Id } }).then(({ data }) => {
            dispatch(logout())
            return data.logout
        })

    return {
        logout: logoutFunction,
        cargando: loading,
        errores: [error?.message],
    }
}

export function useSingin() {
    const dispatch = useAppDispatch()
    const [signinQuery, signinResult] = useMutation<{ signin: Usuario }>(
        SIGNIN_QUERY,
    )
    const { loading, error } = signinResult
    const signinFunction = ({
        correo,
        clave,
        alias,
        admin,
        avatar,
    }: {
        correo: string
        clave: string
        alias: string
        admin?: boolean
        avatar?: boolean
    }) =>
        signinQuery({ variables: { correo, clave, alias, admin, avatar } })
            .then(({ data }) => {
                if (data) dispatch(signin(data.signin))
                // console.log(data)
                return data?.signin
            })
            .catch((e) => {
                console.error({ e })
            })
    return {
        signin: signinFunction,
        cargando: loading,
        errores: [error?.message],
    }
}
