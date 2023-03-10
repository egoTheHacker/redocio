import { IconProps } from 'types/app-env'

export function Bookmark({
    height,
    width,
    fill,
    className,
    ...props
}: IconProps) {
    const clases = className ? ` ${className}` : ''
    return (
        <svg
            {...props}
            className={'Bookmark' + clases}
            height={height}
            viewBox='0 0 21 21'
            width={width}
            xmlns='http://www.w3.org/2000/svg'>
            <path
                d='m1.5.5h6c.55228475 0 1 .44771525 1 1v12l-4-4-4 4v-12c0-.55228475.44771525-1 1-1z'
                fill={fill || 'none'}
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                transform='translate(6 4)'
            />
        </svg>
    )
}
