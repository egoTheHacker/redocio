// import { Usuario } from 'types/app-env'

// import { join } from 'path'
import { Dispatch, SetStateAction, useState } from 'react'
import {
    Articulo,
    ArticuloCombinado,
    ArticuloDetallado,
    Usuario,
} from 'types/app-env'

export enum TipoArticulo {
    ARTICULO = 0,
    LIBRO = 1,
    JUEGO = 2,
    SERIE = 3,
    PELICULA = 4,
}

export enum TipoEstado {
    PENDIENTE = 1,
    VIENDO = 2,
    TERMINADO = 3,
}

export const COLORES = {
    AZUL: 'blue',
    VERDE: 'green',
    AMARILLO: 'yellow',
    GRIS: 'grey',
}

export const ARTICULO_EMPTY: Articulo = {
    Id: '',
    estado: TipoEstado.PENDIENTE,
    guardado: false,
    ranking: 0,
    tipo: TipoArticulo.ARTICULO,
    comentarios: [],
}

export const ARTICULO_COMBINADO_EMPTY: ArticuloCombinado = {
    id: '',
    creadores: [],
    estado: TipoEstado.PENDIENTE,
    guardado: false,
    idioma: '',
    ranking: 0,
    tipo: TipoArticulo.ARTICULO,
    titulo: '',
    comentarios: [],
}

export const Usuarios = {
    esAmigo: (current: Usuario, other: Usuario) => {
        return Boolean(
            current.seguidores.find((u) => u.Id === other.Id) &&
                current.siguiendo.find((u) => u.Id === other.Id),
        )
    },
    esUsuario: (u: any): u is Usuario => {
        console.log(Object.keys(u))
        return Object.keys(u).includes('enLinea')
    },
}

export const Articulos = {
    esArticuloDetallado: (a: any): a is ArticuloDetallado =>
        Object.keys(a).includes('titulo'),
}

export const rutaMap = new Map([
    [TipoArticulo.ARTICULO, 'art'],
    [TipoArticulo.PELICULA, 'film'],
    [TipoArticulo.SERIE, 'show'],
    [TipoArticulo.LIBRO, 'book'],
    [TipoArticulo.JUEGO, 'game'],
])

export const capitalize = (s?: string): string => {
    if (!s) return ''
    if (s.length < 2) return s.toUpperCase()
    // ;[].join()
    // return s.slice(0, 1).toUpperCase() + s.slice(1)
    return s
        .split(' ')
        .map(
            (sub) => sub.slice(0, 1).toUpperCase() + sub.slice(1).toLowerCase(),
        )
        .join(' ')
}

export const combinarArticulos = ({
    a,
    ad,
}: {
    a: Articulo
    ad: ArticuloDetallado
}): ArticuloCombinado => {
    const { estado, guardado, ranking } = a
    // const {id, creadores,} = ad
    const ac: ArticuloCombinado = {
        ...ad,
        estado,
        guardado,
        ranking,
    }
    return ac
}

export const removeFromArray = (
    e: string,
    setArr: Dispatch<SetStateAction<string[]>>,
): string | undefined => {
    // const [el, setEl] = useState<string>()
    // const i = arr.indexOf(e)
    // let i = -1
    let el: string | undefined
    setArr((arr) => {
        // i = arr.indexOf(e)
        // setEl(arr.find((p) => p === e))
        el = arr.find((p) => p === e)
        return arr.filter((p) => p !== e)
    })
    // if (i < 0) return undefined

    // return arr.splice(i, 1)[0]
    return el
}

export function swipeElement<T = string>(
    e: T,
    setArr1: Dispatch<SetStateAction<T[]>>,
    setArr2: Dispatch<SetStateAction<T[]>>,
) {
    if (typeof e === 'string') {
        setArr1((arr) => arr.filter((p) => p !== e))
        setArr2((arr) => [...arr, e].sort())
    } else if (Array.isArray(e)) {
        // setArr1((arr) => arr.filter((c) => c.foreach(a => a)))
        throw new TypeError('NO implementado')
    } else {
        // setArr1(arr => )
        // setArr2()
    }
}

export function swipeElements<T = string>(
    e: T[],
    setArr1: Dispatch<SetStateAction<T[]>>,
    setArr2: Dispatch<SetStateAction<T[]>>,
) {
    // if (T === 'string') {
    //     setArr1((arr) => arr.filter((p) => p !== e))
    //     setArr2((arr) => [...arr, e])
    // } else if (Array.isArray(e)) {
    // }
    if (e.length > 0) {
        if (typeof e.at(0) === 'string') {
            setArr1((arr) => arr.filter((p) => !e.includes(p)))
            setArr2((arr) =>
                [...arr, ...e.filter((p) => !arr.includes(p))].sort(),
            )
        } else if (Articulos.esArticuloDetallado(e.at(0))) {
            // const a: ArticuloDetallado
            // a.id
            // console.log(Usuarios.esUsuario(e.at(0)))
            setArr1((arr) => arr.filter((p) => !e.find((a) => a.id !== p.id)))
            setArr2((arr) => [...arr, ...e])
            // console.log({ setArr1, setArr2 })
        }
    }
}

export const rankMap = new Map([
    [-1, '🤢'],
    // [0, ''],
    [1, '👍🏿'],
    [2, '😍'],
])

// Usuarios.prototype.esAmigo = () => {}

// export const USUARIO_VACIO: Usuario = {
//     alias: '',
//     Id: '',
//     avatar: '',
//     biblioteca: [],
//     clave: '',
//     correo: '',
//     enLinea: false,
//     esAdmin: false,
// }

// export const contains = (searchElement: Type, array: Type[]) =>
