import { useLazyQuery, useMutation } from '@apollo/client'
import { useAppSelector } from 'App/hooks'
import { TipoArticulo } from 'Config/util'
import { COMENTAR_ARTICULO_QUERY } from 'queries'

export function useComentario() {
    const { articulo, usuario } = useAppSelector((state) => state)
    const [comentarQuery, comentarRes] = useMutation(COMENTAR_ARTICULO_QUERY)
    const [upvoteQuery, upvoteRes] = useMutation(COMENTAR_ARTICULO_QUERY)

    const comentar = (contenido: string) =>
        comentarQuery({
            variables: {
                usuario: usuario.Id,
                articulo: articulo.id,
                tipo: TipoArticulo[articulo.tipo],
                contenido,
            },
        })
    const upvote = (comentario: string) =>
        upvoteQuery({ variables: { usuario: usuario.Id, comentario } })

    return { comentar, upvote }
}
