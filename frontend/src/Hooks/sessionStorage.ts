import { useState } from 'react'

interface SessionProps {
    key: string
}

export function useSessionStorage<Type>({
    key,
}: SessionProps): [Type | null, (value: Type) => void] {
    const sessionValue = window.sessionStorage.getItem(key)
    const [item, setItem] = useState<Type | null>(
        sessionValue ? JSON.parse(sessionValue) : null,
    )
    // const sessionItem = window.sessionStorage.getItem(key)
    // const item: Type = sessionItem ? JSON.parse(sessionItem) : null
    const updateItem = (value: Type | null) => {
        console.log('Actualizando', typeof value)
        if (!value) {
            removeItem()
            return
        }
        window.sessionStorage.setItem(key, JSON.stringify(value))
        setItem(value)
    }
    const removeItem = () => {
        console.log('Borrando item')
        window.sessionStorage.removeItem(key)
        setItem(null)
    }
    return [item, updateItem]
}

export function wrapperSessionStorage<Type>({
    key,
}: SessionProps): [Type | null, (value: Type | null) => void] {
    const sessionValue = window.sessionStorage.getItem(key)
    let item: Type | null = sessionValue ? JSON.parse(sessionValue) : null
    const setItem = (valor: Type | null) => (item = valor)
    const updateItem = (value: Type | null) => {
        console.log('Actualizando', typeof value)
        if (!value) {
            removeItem()
            return
        }
        window.sessionStorage.setItem(key, JSON.stringify(value))
        setItem(value)
    }
    const removeItem = () => {
        console.log('Borrando item')
        window.sessionStorage.removeItem(key)
        setItem(null)
    }
    return [item, updateItem]
}
