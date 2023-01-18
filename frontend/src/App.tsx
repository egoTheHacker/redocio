import { useState, useEffect } from 'react'
import './App.scss'
import { inits } from 'App/store'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import { useArticulosApp, useBiblioteca } from 'Hooks/biblioteca'
import { Ruta, rutas } from 'Config/routes'
import { Route, Switch } from 'wouter'
import { useUsuarios } from 'Hooks/usuario'
import { useArticulos } from 'Hooks/articulos'

function App() {
    // const dispatch = useAppDispatch()
    const { usuario } = useAppSelector((state) => state)
    // const { fetchBiblioteca } = useBiblioteca()
    const { fetchArticulos } = useArticulosApp()
    const { fetchArticulosApi } = useArticulos()
    const { fetchUsuarios } = useUsuarios()

    useEffect(() => {
        fetchUsuarios()
        fetchArticulosApi()
    }, [])

    useEffect(() => {
        if (usuario.enLinea) {
            fetchArticulos()
        }
    }, [usuario])

    const Ruta = (r: Ruta) => {}

    return (
        <div className='App'>
            <Switch>
                {rutas.map((r) => (
                    <Route
                        key={r.path}
                        path={r.path}
                        component={r.componente}
                    />
                ))}
            </Switch>
            {/* {usuario.esAdmin ? <AdminPanel /> : <Home />} */}
        </div>
    )
}

export default App
