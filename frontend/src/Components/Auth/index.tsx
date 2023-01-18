import { ChangeEvent, FormEvent, useState } from 'react'
import { useLogin, useSingin } from 'Hooks/usuario'
import { inits, login as connect } from 'App/store'
import './estilos.scss'
import { useAppDispatch, useAppSelector } from 'App/hooks'
import { useBiblioteca } from 'Hooks/biblioteca'
import { Usuario } from 'types/app-env'

interface LoginProps {
    cerrar: () => void
    clickHandler: () => void
}

export function Auth({ cerrar }: { cerrar: () => void }) {
    const [nuevo, setNuevo] = useState(false)
    const toggleAuth = () => setNuevo((prev) => !prev)
    if (nuevo) return <Signin cerrar={toggleAuth} clickHandler={toggleAuth} />
    return <Login cerrar={cerrar} clickHandler={toggleAuth} />
}

function Login({ cerrar, clickHandler }: LoginProps) {
    return (
        <section className='Auth'>
            <LoginForm cerrar={cerrar} />
            <aside>
                Si todavía no tiene usuario, considere{' '}
                <button className='btn' onClick={clickHandler}>
                    registrarse
                </button>
            </aside>
        </section>
    )
}

function Signin({ cerrar, clickHandler }: LoginProps) {
    return (
        <section className='Auth'>
            <SigninForm cerrar={cerrar} />
            <aside>
                Si ya tiene una cuenta, considere{' '}
                <button className='btn' onClick={clickHandler}>
                    loguearse
                </button>
            </aside>
        </section>
    )
}

function LoginForm({ cerrar }: { cerrar: () => void }) {
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    // const { usuario } = useAppSelector((state) => state)
    const { fetchBiblioteca } = useBiblioteca()
    const { login } = useLogin()
    const dispatch = useAppDispatch()
    const submitHadler = (evt: FormEvent) => {
        evt.preventDefault()
        login({ correo, clave }).then((u) => {
            // dispatch(connect(u))
            const { articulos } = fetchBiblioteca()
            dispatch(inits(articulos))
            // dispatch(inits([]))
        })
        cerrar()
        // console.log({ usuario })
    }
    return (
        <form action='' method='post' onSubmit={submitHadler}>
            <input
                type='text'
                name='correo'
                id='correo'
                placeholder='Correo'
                onInput={(evt: ChangeEvent<HTMLInputElement>) =>
                    setCorreo(evt.target.value)
                }
            />
            <input
                type='password'
                name='clave'
                id='clave'
                placeholder='Contraseña'
                onInput={(evt: ChangeEvent<HTMLInputElement>) =>
                    setClave(evt.target.value)
                }
            />
            <div className='grupo-btn'>
                <input type='submit' value='Login' className='btn' />
                <input
                    type='reset'
                    value='Cancelar'
                    className='btn'
                    onClick={cerrar}
                />
            </div>
        </form>
    )
}

function SigninForm({ cerrar }: { cerrar: () => void }) {
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [alias, setAlias] = useState('')
    const { signin } = useSingin()

    const submitHadler = (evt: FormEvent) => {
        evt.preventDefault()
        signin({ correo, clave, alias })
        cerrar()
    }

    return (
        <form action='' method='post' onSubmit={submitHadler}>
            <input
                type='text'
                name='correo'
                id='correo'
                placeholder='Correo'
                onInput={(evt: ChangeEvent<HTMLInputElement>) =>
                    setCorreo(evt.target.value)
                }
            />
            <input
                type='text'
                name='correo'
                id='correo'
                placeholder='Nombre de usuario'
                onInput={(evt: ChangeEvent<HTMLInputElement>) =>
                    setAlias(evt.target.value)
                }
            />
            <input
                type='password'
                name='clave'
                id='clave'
                placeholder='Contraseña'
                onInput={(evt: ChangeEvent<HTMLInputElement>) =>
                    setClave(evt.target.value)
                }
            />
            <div className='grupo-btn'>
                <input type='submit' value='Signin' className='btn' />
                <input
                    type='reset'
                    value='Cancelar'
                    className='btn'
                    onClick={cerrar}
                />
            </div>
        </form>
    )
}

// export function Login({ cerrar }: LoginProps) {
//     const [correo, setCorreo] = useState('')
//     const [clave, setClave] = useState('')
//     // const { usuario } = useAppSelector((state) => state)
//     const { fetchBiblioteca } = useBiblioteca()
//     const { login } = useLogin()
//     const dispatch = useAppDispatch()

//     const submitHadler = (evt: FormEvent) => {
//         evt.preventDefault()
//         login({ correo, clave }).then((u) => {
//             // dispatch(connect(u))
//             const { articulos } = fetchBiblioteca()
//             dispatch(inits(articulos))
//             // dispatch(inits([]))
//         })
//         cerrar()
//         // console.log({ usuario })
//     }

//     return (
//         <section className='Login'>
//             <form action='' method='post' onSubmit={submitHadler}>
//                 <input
//                     type='text'
//                     name='correo'
//                     id='correo'
//                     placeholder='Correo'
//                     onInput={(evt: ChangeEvent<HTMLInputElement>) =>
//                         setCorreo(evt.target.value)
//                     }
//                 />
//                 <input
//                     type='password'
//                     name='clave'
//                     id='clave'
//                     placeholder='Contraseña'
//                     onInput={(evt: ChangeEvent<HTMLInputElement>) =>
//                         setClave(evt.target.value)
//                     }
//                 />
//                 <div className='grupo-btn'>
//                     <input type='submit' value='Login' className='btn' />
//                     <input
//                         type='reset'
//                         value='Cancelar'
//                         className='btn'
//                         onClick={cerrar}
//                     />
//                 </div>
//             </form>
//             <aside>
//                 Si todavía no tiene usuario, considere{' '}
//                 <button className='btn'>registrarse</button>
//             </aside>
//         </section>
//     )
// }
