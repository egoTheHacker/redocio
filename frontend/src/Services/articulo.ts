import { useMutation } from '@apollo/client'
import { TipoArticulo } from 'Config/util'
import { useUsuario } from 'Hooks/usuario'
import {
    BORRAR_ARTICULO_QUERY,
    GUARDAR_ARTICULO_QUERY,
    MODIFICAR_ARTICULO_QUERY,
} from 'queries'

export function guardarArticulo({
    id,
    tipo,
}: {
    id: string
    tipo: TipoArticulo
}) {
    const [query, result] = useMutation(GUARDAR_ARTICULO_QUERY)
    const { loading, error } = result
    const { usuario } = useUsuario()
    query({
        variables: { usuario: usuario?.Id, tipo, articulo: id },
    })
    return { cargando: loading, errores: [error?.message] }
}

export function borrarArticulo({ id }: { id: string }) {
    const [query, result] = useMutation(BORRAR_ARTICULO_QUERY)
    const { loading, error } = result
    const { usuario } = useUsuario()
    if (usuario)
        query({
            variables: { usuario: usuario.Id, articulo: id },
        })
    return { cargando: loading, errores: [error?.message] }
}

export function modificarLike({
    id,
    gustado,
}: {
    id: string
    gustado: boolean
}) {
    const [query, result] = useMutation(MODIFICAR_ARTICULO_QUERY)
    const { loading, error } = result
    const { usuario } = useUsuario()
    if (usuario)
        query({
            variables: { usuario: usuario.Id, articulo: id, gustado },
        })
    return { cargando: loading, errores: [error?.message] }
}
