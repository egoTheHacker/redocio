import { useAppSelector } from 'App/hooks'
import { Avatar } from 'Components/Avatar'
import { Encabezado } from 'Components/Encabezado'
import { useSingin, useUsuario } from 'Hooks/usuario'
import { FormEvent, PropsWithChildren, useEffect, useState } from 'react'
import { Usuario } from 'types/app-env'
import { useLocation } from 'wouter'
import './estilos.scss'

enum Acciones {
    DEFAULT = 0,
    MOD = 1,
    FILTER = 2,
    ADD = 3,
    DEL = 4,
}

type OpcionType = {
    target?: Usuario
    accion: Acciones
}

type AdminOpsProps = {
    opcion: OpcionType
    cerrar?: () => void
    updateUsuarios?: (usus: Usuario[]) => void
} & PropsWithChildren

export function AdminPanel() {
    const { usuario, usuarios } = useAppSelector((state) => state)
    const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([])
    const [opcion, setOpcion] = useState<OpcionType>({
        accion: Acciones.DEFAULT,
    })
    const [mostrarOps, setMostrarOps] = useState(false)
    const [, setLocation] = useLocation()
    const updateUsuarios = (us: Usuario[]) => setUsuariosFiltrados(us)
    if (!usuario.esAdmin) setLocation('/')

    useEffect(() => {
        console.log({ usuariosFiltrados })
        setUsuariosFiltrados(usuarios)
    }, [usuarios])

    useEffect(() => {
        setMostrarOps(opcion.accion !== Acciones.DEFAULT)
        console.log({ accion: opcion })
    }, [opcion.accion])

    const switchToFilter = () => setOpcion({ accion: Acciones.FILTER })
    const switchToModify = (usu: Usuario) =>
        setOpcion({ accion: Acciones.MOD, target: usu })
    const switchToAdd = () => setOpcion({ accion: Acciones.ADD })
    const switchToDel = (usu: Usuario) =>
        setOpcion({ accion: Acciones.DEL, target: usu })
    const switchToDefault = () => setOpcion({ accion: Acciones.DEFAULT })
    const disabled = opcion.accion !== Acciones.DEFAULT

    return (
        <>
            <Encabezado />
            <main className='AdminPanel'>
                <p>
                    <span>Añadir usuario</span>|<span>Eliminar usuario</span>|
                    <span>Modificar usuario</span>|<span>Filtrar</span>
                </p>
                <p>Censurar palabras | Borrar post</p>
                <table className='usuarios'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Avatar</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>
                                <div className='acciones'>
                                    <button
                                        className='btn'
                                        onClick={switchToAdd}
                                        disabled={disabled}>
                                        +
                                    </button>
                                    <button
                                        className='btn'
                                        onClick={switchToFilter}
                                        disabled={disabled}>
                                        ∫
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.map((u) => {
                            const rol = u.esAdmin ? 'Administrador' : 'usuario'
                            const yo = u.Id === usuario.Id ? 'yo' : ''
                            return (
                                <tr className={yo} key={u.Id}>
                                    <td>{u.Id}</td>
                                    <td>
                                        <Avatar />
                                    </td>
                                    <td>{u.alias}</td>
                                    <td>{u.correo}</td>
                                    <td>{rol}</td>
                                    <td>
                                        <div className='acciones'>
                                            <button
                                                className='btn editar'
                                                onClick={() =>
                                                    switchToModify(u)
                                                }
                                                disabled={disabled}>
                                                &#x270F;
                                            </button>
                                            <button
                                                className='btn borrar'
                                                onClick={() => switchToDel(u)}
                                                disabled={disabled}>
                                                &#x2298;
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {/* <section>
                    <header>USUARIOS ONLINE</header>
                </section>
                <section>
                    <header>USUARIOS OFFLINE</header>
                </section> */}
            </main>
            {mostrarOps && (
                <AdminOps
                    opcion={opcion}
                    cerrar={switchToDefault}
                    updateUsuarios={updateUsuarios}
                />
            )}
        </>
    )
}

function AdminOps({ cerrar, opcion, updateUsuarios }: AdminOpsProps) {
    const { accion, target } = opcion
    return (
        <aside className='Ops'>
            <button className='btn cerrar' onClick={cerrar}>
                &times;
            </button>
            {accion === Acciones.ADD && <AgregarUsuarioForm cerrar={cerrar} />}
            {accion === Acciones.MOD && (
                <ModificarUsuarioForm target={target} />
            )}
            {accion === Acciones.FILTER && (
                <FiltrarUsuarios setUsuarios={updateUsuarios} />
            )}
            {accion === Acciones.DEL && (
                <BorrarUsuario target={target} cerrar={cerrar} />
            )}
        </aside>
    )
}

function AgregarUsuarioForm({ cerrar }: { cerrar?: () => void }) {
    const [alias, setAlias] = useState('')
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [admin, setAdmin] = useState(false)
    const [avatar, setAvatar] = useState(false)
    const { signin } = useSingin()

    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault()
        signin({ correo, clave, alias, admin, avatar })
        ;(evt.target as HTMLFormElement).reset()
        cerrar && cerrar()
    }

    // useEffect(() => {
    //     console.log({ alias, correo, clave, admin })
    // }, [alias, correo, clave, admin])
    return (
        <form method='POST' onSubmit={handleSubmit}>
            <legend>Añadir usuario</legend>
            <input
                type='text'
                name='alias'
                id='alias'
                placeholder='Nombre...'
                onInput={(evt: FormEvent) =>
                    setAlias((evt.target as HTMLInputElement).value)
                }
            />
            <input
                type='email'
                name='correo'
                id='correo'
                placeholder='Correo...'
                onInput={(evt: FormEvent) =>
                    setCorreo((evt.target as HTMLInputElement).value)
                }
            />
            <input
                type='password'
                name='clave'
                id='clave'
                placeholder='Contraseña...'
                onInput={(evt: FormEvent) =>
                    setClave((evt.target as HTMLInputElement).value)
                }
            />
            {/* <input type="text" name="nombre" id="nombre" placeholder='Nombre...' /> */}
            <div>
                <input
                    type='checkbox'
                    name='rol'
                    id='rol'
                    onChange={(evt: FormEvent) =>
                        setAdmin((evt.target as HTMLInputElement).checked)
                    }
                />
                <label htmlFor='rol'>Hacer admin</label>
            </div>
            <div>
                <input
                    type='checkbox'
                    name='avatar'
                    id='avatar'
                    defaultChecked
                    onChange={(evt: FormEvent) =>
                        setAvatar((evt.target as HTMLInputElement).checked)
                    }
                />
                <label htmlFor='avatar'>Generar avatar automáticamente</label>
            </div>
            <div className='controles'>
                <input className='btn' type='submit' value='Guardar' />
                <input className='btn' type='reset' value='Limpiar' />
            </div>
        </form>
    )
}

function ModificarUsuarioForm({
    target,
    cerrar,
}: {
    target?: Usuario
    cerrar?: () => void
}) {
    const [alias, setAlias] = useState('')
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const { modify } = useUsuario({ id: target?.Id || '' })
    if (!target) return <>Este usuario no ha podido ser modificado</>
    const handleSubmit = (evt: FormEvent) => {
        evt.preventDefault()
        ;(evt.target as HTMLFormElement).reset()
        modify({ clave, alias })
        cerrar && cerrar()
    }
    return (
        <form method='POST' onSubmit={handleSubmit}>
            <legend>Modificar usuario</legend>
            <input
                type='text'
                name='alias'
                id='alias'
                placeholder={target.alias}
                onInput={(evt: FormEvent) =>
                    setAlias((evt.target as HTMLInputElement).value)
                }
            />
            <input
                type='email'
                name='correo'
                id='correo'
                placeholder={target.correo}
                onInput={(evt: FormEvent) =>
                    setCorreo((evt.target as HTMLInputElement).value)
                }
            />
            <input
                type='password'
                name='clave'
                id='clave'
                placeholder='Nueva contraseña...'
                onInput={(evt: FormEvent) =>
                    setClave((evt.target as HTMLInputElement).value)
                }
            />
            {/* <input type="text" name="nombre" id="nombre" placeholder='Nombre...' /> */}
            <div>
                <input type='checkbox' name='rol' id='rol' />
                <label htmlFor='rol' defaultChecked={target.esAdmin}>
                    Hacer admin
                </label>
            </div>
            <div className='controles'>
                <input className='btn' type='submit' value='Guardar' />
                <input className='btn' type='reset' value='Limpiar' />
            </div>
        </form>
    )
}

function FiltrarUsuarios({
    setUsuarios,
}: {
    setUsuarios?: (usus: Usuario[]) => void
}) {
    const { usuarios } = useAppSelector((state) => state)
    return (
        <div>
            <legend>Filtrar usuarios</legend>
        </div>
    )
}

function BorrarUsuario({
    target,
    cerrar,
}: {
    target?: Usuario
    cerrar?: () => void
}) {
    const { usuario } = useAppSelector((state) => state)
    const { unsubscribe } = useUsuario({ id: target?.Id || '' })
    if (!target) return <>Este usuario no ha podido ser borrado</>
    if (target.Id === usuario.Id)
        return <>No puedes eliminar tu propio usuario</>
    const unsubHandler = () => {
        unsubscribe()
        cerrar && cerrar()
    }
    return (
        <div>
            <legend>Borrar usuario</legend>
            Seguro que desea eliminar a {target.alias}
            <p>ID: {target.Id}</p>
            <p>Nombre: {target.alias}</p>
            <p>Correo: {target.correo}</p>
            <div className='controles'>
                <input
                    className='btn'
                    type='submit'
                    value='Borrar'
                    onClick={unsubHandler}
                />
                <input className='btn' type='reset' value='Cancelar' />
            </div>
        </div>
    )
}
