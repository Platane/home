import type {Point} from '../../../type'
import {delaunay}   from '../../math/delaunay'
import {voronoi}    from '../../math/voronoi'
import {boundingBox}from '../../math/primitive/bounding'
import {create as createPhy} from './phy'

const STEP_DURATION = 200

const getCenter = ( polygon: Array<Point> ) : Point => {

    const c = {x:0, y:0}

    if ( polygon.length == 0 )
        return c

    polygon
        .forEach( ({x,y}) => {
            c.x += x
            c.y += y
        })

    c.x /= polygon.length
    c.y /= polygon.length

    return c
}

const enflate = ( polygon: Array<Point>, m: number ) : Array<Point> => {

    const c = getCenter( polygon )

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


const buildCanvas = ( l:number, vertices: Array<Point>, faces: Array<[number, number, number]>, paint: ( ctx: CanvasRenderingContext2D, l: number ) => void  ) : Array<*> =>
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

        // discard empty canvas
        if ( isCanvasEmpty( canvas ) )
            return null


        const center = getCenter( triangle )

        const origin = {
            x   : (box.min.x + box.max.x)/2,
            y   : (box.min.y + box.max.y)/2,
            z   : 0
        }

        canvas.style.transformOrigin    = `${center.x}px ${center.y}px 0`
        canvas.style.transformStyle     = 'preserve-3d'
        canvas.style.transition         = `transform ${STEP_DURATION}ms linear`

        return {
            center,

            addTo : ( parent : HTMLElement ) =>
                parent.appendChild(canvas)
            ,
            applyTransform : ( pos: Point, rot: Point ) => {

                const  l = Math.sqrt(rot.x*rot.x + rot.y*rot.y + rot.z*rot.z)

                canvas.style.transform =
                    // `translate3d(${pos.x-center.x-(origin.x-center.x)}px,${pos.y-center.y-(origin.y-center.y)}px,${pos.z}px)`
                    `translate3d(${pos.x-center.x}px,${pos.y-center.y}px,${pos.z}px)`
                    +
                    (
                        l > 0.001
                            ? `rotate3d(${rot.x/l},${rot.y/l},${rot.z/l},${l}deg)`
                            : ''
                    )
            },
        }

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

    const canvas = buildCanvas( l, vertices, faces, paint )

    canvas.forEach( ({ addTo }) => addTo(container) )

    const phy = canvas.map( c => {
        const k = (6+Math.random())/7
        const b = (6+Math.random())/7

        return createPhy(k, b, {...c.center, z:0}, {x:0,y:0,z:0})
    })

    phy
        .forEach( (phy,i) => {

            const r = Math.random()*l*0.4
            const alpha = Math.random() * Math.PI*2

            phy.pos.x = (canvas[i].center.x-l/2)*1.4 + l/2 + Math.sin(alpha)*r
            phy.pos.y = l*1.2
            phy.pos.z = Math.cos(alpha)*r

            phy.rot.x = 90
        })

    const step = ( mouse_pos: Point, mouse_v: Point, delta: number ) => {

        phy.forEach( (phy,i) =>{

            const v = {
                x : phy.pos.x - mouse_pos.x,
                y : phy.pos.y - mouse_pos.y,
                z : phy.pos.z - mouse_pos.z,
            }

            const l = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z)

            const k = delta * 5000

            const f = {
                x : v.x/l/l *k,
                y : v.y/l/l *k,
                z : 0,
            }

            phy.impulse( mouse_pos, f )

            const mvl = Math.sqrt(mouse_v.x*mouse_v.x + mouse_v.y*mouse_v.y + mouse_v.z*mouse_v.z)

            if ( Math.random() < 0.1 + mvl/30 ) {

                const h = delta * ( mvl * 0.3 + 40 )
                const f = {
                    x : (Math.random()-0.5)*h,
                    y : (Math.random()-0.5)*h,
                    z : (Math.random()-0.5)*h,
                }
                phy.impulse( mouse_pos, f )
            }

            phy.step( delta )

            canvas[i].applyTransform( phy.pos, phy.rot )
        })
    }

    let lastDate        = Date.now()
    let mouse_instant   = {x:0, y:0}
    let mouse_pos       = {x:0, y:0, z:0}
    let mouse_v         = {x:0, y:0, z:0}

    const loop = () => {
        const delta = Date.now() - lastDate
        lastDate = Date.now()

        mouse_v.x = mouse_instant.x - mouse_pos.x
        mouse_v.y = mouse_instant.y - mouse_pos.y

        mouse_pos.x = mouse_instant.x
        mouse_pos.y = mouse_instant.y

        step(mouse_pos, mouse_v, Math.min(delta/1000,1))

        // requestAnimationFrame(loop)
        setTimeout( loop, STEP_DURATION )
    }

    loop()

    document.body.addEventListener('mousemove', e => {

        const {top,left} = container.getBoundingClientRect()

        mouse_instant.x = e.clientX - top
        mouse_instant.y = e.clientY - top

    })

    return container
}
