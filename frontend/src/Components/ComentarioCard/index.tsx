import { Avatar } from 'Components/Avatar'
import { Comentario } from 'types/app-env'

type ComentarioProps = {
    detalles: Comentario
}

export function ComentarioCard({ detalles, ...props }: ComentarioProps) {
    const { autor, contenido, dislikes, likes, respuestas } = detalles
    return (
        <article className='ComentarioCard'>
            <div>
                <Avatar url={autor.avatar} />
                <div>
                    <span>{autor.alias}</span>
                    <p>{contenido}</p>
                    <span>Up {likes.length}</span>
                    <span>Down {dislikes.length}</span>
                </div>
            </div>
            <hr />
            {respuestas.map((r) => (
                <ComentarioCard detalles={r} />
            ))}
        </article>
    )
}
