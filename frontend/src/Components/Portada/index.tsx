import { useEffect, useRef, useState } from 'react'

interface PortadaProps {
    height?: number
    width?: number
    fill?: string
    titulo: string
    creador: string
    className?: string
}
// https://stackoverflow.com/questions/74196113/get-bbox-of-svg-element-before-render-or-at-least-without-flickering
type BBox = { x: number; y: number; width: number; height: number }

const makeViewBox = (bbox: BBox) => {
    return `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
}
export function PortadaDefecto({
    titulo,
    creador,
    height,
    width,
    fill,
    ...props
}: PortadaProps) {
    const ref = useRef<null | SVGSVGElement>(null)
    const svgWidth = width || 220
    const svgHeight = height || 350
    const [bbox, setbbox] = useState<null | BBox>(null)
    // window.onresize = () => {
    //     if (ref.current) {
    //         setbbox(ref.current.getBBox())
    //     }
    // }
    // useEffect(() => {
    //     if (ref.current) {
    //         setbbox(ref.current.getBBox())
    //     }
    // }, [])
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            // width={width || 220}
            // height={height || 350}
            // viewBox={bbox ? makeViewBox(bbox) : ''}
            width={svgWidth}
            height={svgHeight}
            ref={ref}
            {...props}>
            <path
                style={{
                    fill: 'beige',
                }}
                d='M0 0h220v350H0z'
            />
            <text
                // lengthAdjust='spacingAndGlyphs'
                // stroke='black'
                // textLength={width ? width - 20 : 200}
                dominantBaseline='middle'
                textAnchor='middle'
                x='50%'
                y='50%'
                fontSize='.9em'
                fill={fill || 'currentColor'}>
                {titulo}
            </text>
            <text
                // textLength={width ? width - 70 : 150}
                // className='creador'
                // textAnchor='middle'
                // dominantBaseline='middle'
                dx='5%'
                dy='5%'
                fontSize='.7em'
                fill={fill || 'currentColor'}>
                {creador}
            </text>
        </svg>
    )
}
