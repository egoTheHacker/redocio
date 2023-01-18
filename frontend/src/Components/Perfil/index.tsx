import { useAppSelector } from 'App/hooks'
import { Menu } from 'Components/Menu'
import { useState } from 'react'

export function Perfil() {
    const { usuario } = useAppSelector((state) => state)
    const [mostrarMenu, setMostrarMenu] = useState(false)

    const clickHandler = () => {
        // Do something
    }

    const cerrarMenu = () => setMostrarMenu(false)

    const menuHandler = () => {
        setMostrarMenu((prev) => !prev)
    }
    return (
        <div className='Perfil' onClick={clickHandler}>
            <img className='avatar' src={usuario?.avatar} alt='' />
            <button
                className='btn'
                onClick={menuHandler}
                style={{ border: 'none', fontSize: '18px' }}>
                {mostrarMenu ? '✗' : '☰'}
            </button>
            {mostrarMenu && <Menu cerrar={cerrarMenu} />}
        </div>
    )
}
