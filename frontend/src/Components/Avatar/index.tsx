import avatar from 'assets/unknown.svg'

export function Avatar({ url }: { url?: string }) {
    return <img src={url || avatar} />
}
