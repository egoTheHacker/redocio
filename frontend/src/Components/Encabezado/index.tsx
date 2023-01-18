import { useEffect, PropsWithChildren } from 'react'
import { Buscador } from 'Components/Buscador'
import './estilos.scss'
import { Perfil } from 'Components/Perfil'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import { init, switchTo } from 'App/store'
import logo from 'assets/poslogo.svg'
import { useLocation } from 'wouter'

interface EncabezadoProps {
    mostrarLogin?: () => void
}

export function Encabezado({
    mostrarLogin,
    children,
}: EncabezadoProps & PropsWithChildren) {
    const { usuario, seccion, articulo } = useAppSelector((state) => state)
    const [location, setLocation] = useLocation()
    const dispatch = useAppDispatch()
    const cambiarSeccion = (secc: string) => {
        if (secc !== seccion) dispatch(switchTo({ seccion: secc }))
    }

    const homeHandler = () => {
        const homeSeccion = 'home'
        const homeRuta = '/'
        if (homeSeccion !== seccion)
            dispatch(switchTo({ seccion: homeSeccion }))
        if (homeRuta !== location) setLocation(homeRuta)
        // if (articulo.id) dispatch(init())
    }
    useEffect(() => {
        console.log('Usuario cambiado')
        console.log(usuario)
    }, [usuario])
    return (
        <header className='Encabezado'>
            <span className='logo' onClick={homeHandler}>
                <img src={logo} alt='' />
            </span>
            {/* <img src={logo} alt='' /> */}
            {children}
            {!usuario || !usuario.enLinea ? (
                <button
                    className='btn'
                    onClick={() => mostrarLogin && mostrarLogin()}>
                    Login/Signin
                </button>
            ) : (
                <Perfil />
            )}
        </header>
    )
}
