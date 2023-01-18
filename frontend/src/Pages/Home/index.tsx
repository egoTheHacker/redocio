import { useAppDispatch, useAppSelector } from 'App/hooks'
import { switchTo } from 'App/store'
import { Auth } from 'Components/Auth'
import { Buscador } from 'Components/Buscador'
import { Encabezado } from 'Components/Encabezado'
import { PanelFiltro } from 'Components/PanelFiltro'
import { secciones } from 'Config/routes'
import { useState } from 'react'
import './estilos.scss'

export function Home() {
    const [loginVisible, setLoginVisible] = useState(false)
    const { usuario } = useAppSelector((state) => state)
    const mostrarLogin = () => setLoginVisible((prevValue) => !prevValue)
    const cerrarLogin = () => setLoginVisible(false)
    const dispatch = useAppDispatch()
    const { seccion } = useAppSelector((state) => state)
    const seccionHandler = (seccion: string) => {
        return secciones.filter((s) => s.nombre === seccion)[0]
    }
    const cambiarSeccion = (secc: string) => {
        if (secc !== seccion) dispatch(switchTo({ seccion: secc }))
    }

    const Seccion = seccionHandler(seccion).componente

    return (
        <>
            <Encabezado mostrarLogin={mostrarLogin}>
                <button className='btn' onClick={() => cambiarSeccion('docs')}>
                    Docs
                </button>
                <button
                    className='btn'
                    onClick={() => cambiarSeccion('comunidad')}>
                    Comunidad
                </button>
                {usuario && usuario.enLinea && (
                    <button
                        className='btn'
                        onClick={() => cambiarSeccion('biblioteca')}>
                        Mi biblioteca
                    </button>
                )}
                <Buscador />
            </Encabezado>
            {loginVisible && <Auth cerrar={cerrarLogin} />}
            <main className='Home'>
                <PanelFiltro />
                <section className={seccion}>
                    <Seccion />
                </section>
            </main>
        </>
    )
}
