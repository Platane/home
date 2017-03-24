import type {Point} from '../../../type'
import {delaunay}   from '../../math/delaunay'
import {voronoi}    from '../../math/voronoi'
import {boundingBox}from '../../math/primitive/bounding'


const enflate = ( polygon: Array<Point>, m: number ) : Array<Point> => {

    const c = {x:0, y:0}
    polygon
        .forEach( ({x,y}) => {
            c.x += x
            c.y += y
        })

    c.x /= polygon.length
    c.y /= polygon.length

    return polygon.map( p => {

        const vx = p.x - c.x
        const vy = p.y - c.y

        const l = Math.sqrt(vx*vx + vy*vy)

        return {
            x : c.x + vx/l*(l+m),
            y : c.y + vy/l*(l+m),
        }
    })
}

const isCanvasEmpty = ( canvas : HTMLCanvasElement ) : boolean => {

    const ctx : CanvasRenderingContext2D = canvas.getContext('2d')

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for(let i=3; i< imageData.data.length; i += 4)
        if ( imageData.data[i] > 0 )
            return false

    return true
}


const buildCanvas = ( l:number, vertices: Array<Point>, faces: Array<[number, number, number]>, paint: ( ctx: CanvasRenderingContext2D, l: number ) => void  ) : Array<HTMLElement> =>
    faces.map( face => {

        const triangle = enflate(face.map( i => vertices[i] ), 1)

        const box = boundingBox(triangle)

        const canvas    = document.createElement('canvas')
        canvas.width    = box.max.x - box.min.x + 1
        canvas.height   = box.max.y - box.min.y + 1

        canvas.style.position   = 'absolute'
        canvas.style.left       = box.min.x
        canvas.style.top        = box.min.y


        // paint the face
        {
            const ctx : CanvasRenderingContext2D = canvas.getContext('2d')

            ctx.save()

            ctx.translate(-box.min.x, -box.min.y)
            ctx.beginPath()

            ctx.moveTo( triangle[0].x, triangle[0].y )
            for( let k=triangle.length; k--; )
                ctx.lineTo( triangle[k].x, triangle[k].y )

            ctx.clip()

            paint( ctx, l )

            ctx.restore()
        }

        if ( isCanvasEmpty( canvas ) )
            return null

        // animate the face
        {
            canvas.style.transformOrigin = '50% 50%'
            canvas.style.transformStyle = 'preserve-3d'

            const origin = {
                x   : (box.min.x + box.max.x)/2,
                y   : (box.min.y + box.max.y)/2,
                z   : 0
            }

            const r = Math.random()*l*0.2
            const phy = Math.random()*Math.PI

            const target = {
                x   : (origin.x - l/2)*1.2 + l/2 + Math.cos(phy)*r,
                y   : l * 1.1,
                z   : Math.sin(phy)*r
            }

            const A = { transform : `translate3d(${target.x-origin.x}px,${target.y-origin.y}px,${target.z-origin.z}px) rotateX(90deg) rotateZ(${(Math.random()-0.5)*100}deg)` }
            const B = { transform : 'none' }

            const duration  = ( Math.random() + 2 )/3 * 0.6
            const offset    = 0.2 + ( 1 - duration - 0.2 ) * Math.random()

            const keyFrames = [
                { offset: 0, ...A },
                { offset: offset, ...A },
                { offset: offset+duration, ...B },
                { offset: 1, ...B },
            ]

            canvas.animate(
                keyFrames,
                    {
                        duration    : 1360,
                        easing      : 'ease',
                        // direction   : 'alternate',
                        // iterations  : Infinity
                    }
            )

        }

        return canvas
    })
    .filter( Boolean )

export const create = (l:number, paint:( ctx: CanvasRenderingContext2D, l: number ) => void) => {

    const rect : Array<Point> = [
        {x: 0, y: 0},
        {x: l, y: 0},
        {x: l, y: l},
        {x: 0, y: l},
    ]

    const inside : Array<Point> = Array.from({ length: 20 }).map( () => ({ x: 0|(Math.random()*l), y: 0|(Math.random()*l) }) )

    const vertices = [ ...rect, ...inside ]
    const faces = delaunay(vertices)


    const container = document.createElement('div')
    container.style.position = 'relative'
    container.style.margin = '100px'
    container.style.perspective = '1000px'
    container.style.perspectiveOrigin = 'center 120%'
    container.style.width = `${l}px`
    container.style.height = `${l}px`

    buildCanvas( l, vertices, faces, paint ).forEach( el => container.appendChild(el) )

    document.body.addEventListener('mousemove', e => {
        // container.style.transform=`rotateY(${(e.clientX/window.innerWidth-0.5)*-60}deg) rotateX(${(e.clientY/window.innerHeight-0.5)*-60}deg)`
    })

    return container
}
