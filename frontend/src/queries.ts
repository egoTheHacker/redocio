import { gql } from '@apollo/client'

export const SIGNIN_QUERY = gql`
    mutation signin(
        $correo: String!
        $clave: String!
        $alias: String!
        $admin: Boolean
        $avatar: Boolean
    ) {
        signin(
            alias: $alias
            correo: $correo
            clave: $clave
            esAdmin: $admin
            genAvatar: $avatar
        ) {
            Id
            alias
            avatar
            correo
            esAdmin
        }
    }
`

export const LOGIN_QUERY = gql`
    mutation login($correo: String!, $clave: String!) {
        login(correo: $correo, clave: $clave) {
            Id
            alias
            correo
            avatar
            esAdmin
            enLinea
            biblioteca {
                Id
                tipo
                estado
                guardado
                ranking
            }
        }
    }
`

export const LOGOUT_QUERY = gql`
    mutation logout($usuario: String!) {
        logout(usuario: $usuario) {
            Id
            alias
            enLinea
        }
    }
`

export const UNSUBSCRIBE_QUERY = gql`
    mutation unsubscribe($id: String!) {
        unsubscribe(id: $id) {
            succeded
            usuario {
                Id
            }
        }
    }
`

export const MODIFICAR_USUARIO_QUERY = gql`
    mutation modificarUsuario($id: String!, $alias: String, $clave: String) {
        modificarUsuario(id: $id, alias: $alias, clave: $clave) {
            Id
        }
    }
`

export const ARTICULOS_QUERY = gql`
    query {
        articulos(limite: 3) {
            id
            tipo
            titulo
            portada
            sinopsis
            creadores
            generos
        }
    }
`

export const ARTICULOS_APP_QUERY = gql`
    query articulos($usuario: String!) {
        articulosApp(usuario: $usuario) {
            Id
            tipo
            estado
            ranking
            guardado
            comentarios {
                Id
                contenido
                autor {
                    Id
                    alias
                    avatar
                }
                likes {
                    Id
                }
                dislikes {
                    Id
                }
                respuestas {
                    autor {
                        Id
                        alias
                        avatar
                    }
                }
            }
        }
    }
`

export const BIBLIOTECA_QUERY = gql`
    query biblioteca($usuario: String!) {
        articulosUsuario(usuario: $usuario) {
            Id
            tipo
            estado
            ranking
            guardado
        }
    }
`

export const ARTICULO_ID_QUERY = gql`
    query articuloId($id: String!, $tipo: TipoE!) {
        articulo(id: $id, tipo: $tipo) {
            id
            titulo
            portada
            creadores
            sinopsis
            idioma
            tipo
        }
    }
`

export const GUARDAR_ARTICULO_QUERY = gql`
    mutation guardarArticulo(
        $usuario: String!
        $tipo: TipoE!
        $articulo: String!
    ) {
        guardarArticulo(usuario: $usuario, tipo: $tipo, articulo: $articulo) {
            Id
            tipo
            estado
            ranking
        }
    }
`

export const BORRAR_ARTICULO_QUERY = gql`
    mutation borrarArticulo($usuario: String!, $articulo: String!) {
        borrarArticulo(usuario: $usuario, articulo: $articulo) {
            Id
            tipo
            estado
            ranking
        }
    }
`

export const USUARIOS_QUERY = gql`
    query usuariosQuery {
        usuarios {
            Id
            alias
            enLinea
            avatar
            esAdmin
            correo
        }
    }
`

export const MODIFICAR_ARTICULO_QUERY = gql`
    mutation modificarArticulo(
        $usuario: String!
        $articulo: String!
        $tipo: TipoE!
        $estado: EstadoE
        $ranking: Int
    ) {
        modificarArticulo(
            usuario: $usuario
            articulo: $articulo
            tipo: $tipo
            estado: $estado
            ranking: $ranking
        ) {
            Id
            tipo
            estado
            ranking
        }
    }
`

export const COMENTAR_ARTICULO_QUERY = gql`
    mutation comentarArticulo(
        $usuario: String!
        $articulo: String!
        $tipo: TipoE!
        $contenido: String!
    ) {
        comentarArticulo(
            usuario: $usuario
            articulo: $articulo
            tipo: $tipo
            contenido: $contenido
        ) {
            contenido
            autor {
                alias
            }
            likes {
                Id
            }
            dislikes {
                Id
            }
            respuestas {
                autor {
                    alias
                }
            }
        }
    }
`

export const UPVOTE_COMENTARIO_QUERY = gql`
    mutation upvoteComentario($usuario: String!, $comentario: String!) {
        upvoteComentario(usuario: $usuario, comentario: $comentario) {
            contenido
            autor {
                alias
            }
            likes {
                Id
            }
            dislikes {
                Id
            }
            respuestas {
                autor {
                    alias
                }
            }
        }
    }
`
