import { useLogout } from 'Hooks/usuario'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import './estilos.scss'

export function Menu({ cerrar }: { cerrar: () => void }) {
    const { logout } = useLogout()
    const { usuario } = useAppSelector((state) => state)
    const clickHandler = () => {
        logout()
        cerrar()
    }
    return (
        <ul className='Menu'>
            {usuario.esAdmin && (
                <li>
                    <a href='/admin'>Administración</a>
                </li>
            )}
            <li>
                <button className='btn' onClick={clickHandler}>
                    Cerrar sesión
                </button>
            </li>
        </ul>
    )
}
