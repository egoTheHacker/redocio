import { CSSProperties, PropsWithChildren } from 'react'
import { TipoArticulo, TipoEstado } from '../Config/util'

interface ArticuloDetallado {
    id: string
    tipo: TipoArticulo
    titulo: string
    portada?: string
    sinopsis?: string
    fechaSalida?: string
    editora?: string
    creadores: string[]
    generos?: string[]
    personajes?: string[]
    idioma: string
}

interface Articulo {
    Id: string
    tipo: TipoArticulo
    ranking: number
    estado: TipoEstado
    guardado: boolean
    comentarios?: Comentario[]
}

interface IconProps extends PropsWithChildren {
    width: number
    height: number
    fill?: string
    style?: CSSProperties
    className?: string
    onClick?: (e: any) => void
}

interface Usuario {
    Id: string
    alias: string
    avatar: string
    correo: string
    clave: string
    enLinea: boolean
    esAdmin: boolean
    biblioteca: Articulo[]
    seguidores: Usuario[]
    siguiendo: Usuario[]
}

interface Comentario {
    Id: string
    contenido: string
    autor: Usuario
    likes: Usuario[]
    dislikes: Usuario[]
    respuestas: Comentario[]
}

type ArticuloCombinado = Omit<Articulo, 'Id'> & ArticuloDetallado

interface FiltrosSliceType {
    medias: string[][]
    categories: string[][]
    saves: string[][]
    ranked: string[][]
    statuses: string[][]
    filtrando: boolean
    actualFilt: string
}
