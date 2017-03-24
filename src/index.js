import {create}     from './component/fragment/frag'


const loadImage = ( url: string ) =>
    new Promise( (resolve, reject, onCancel) => {

        const img = document.createElement('img')
        img.crossOrigin = 'Anonymous'

        img.onload = () =>
            resolve( img )

        img.onerror = err =>
            reject( err )

        img.setAttribute('src', url)

        onCancel && onCancel( () => img.removeAttribute('src') )
    })

const quantumizedColor = Array.from({length:3}).map((_,i,arr) => `hsl(0,0%,${10+i/arr.length*5}%)`)
const paint = ( ctx: CanvasRenderingContext2D, l: number ) : void => {

    // ctx.fillStyle = `hsl(${Math.random()*360},60%,70%)`
    // ctx.fillStyle = '#6f5f5c'
    ctx.fillStyle = quantumizedColor[0|(Math.random()*quantumizedColor.length)]

    ctx.beginPath()
    ctx.arc(l/2, l/2, l/2.5, 0, Math.PI*2)
    ctx.fill()


    // ctx.strokeStyle = ctx.fillStyle = '#000'
    // ctx.font = '50px Georgia'
    // ctx.beginPath()
    // ctx.fillText('Hello', l*0.2, l/2)

    const u=0.6

    ctx.save()
    ctx.beginPath()
    ctx.arc(l/2, l/2, l/2*u, 0, Math.PI*2)
    ctx.clip()

    ctx.drawImage(img, l/2*(1-u), l/2*(1-u), l*u, l*u)

    ctx.restore()
}

let img
loadImage('https://media.licdn.com/media/AAEAAQAAAAAAAAoJAAAAJDRlZWVhMmNiLTIzZGItNDczYi1iYmI3LTEyN2UzYjg5OGQ5OA.jpg')
    .then( _ => {

        img = _

        const domElement = create(300, paint)

        document.getElementById('glass').appendChild(domElement)

    })