import type {Point} from '../../../type'


export const spring_acc = ( k, b, x, v, target ) =>
    - k * ( x - target ) - b * v

export const create = ( k:number, b:number, target_pos: Point, target_rot: Point ) => {

    const pos = {x:0,y:0,z:0}
    const rot = {x:0,y:0,z:0}

    const v_pos = {x:0,y:0,z:0}
    const v_rot = {x:0,y:0,z:0}


    return {
        pos,
        rot,
        set : ( p: Point, r: Point ) => {
            pos.x = p.x
            pos.y = p.y
            pos.z = p.z

            rot.x = r.x
            rot.y = r.y
            rot.z = r.z
        },
        impulse : ( c: Point, f: Point ) => {

            const h = 1

            v_pos.x += f.x * h
            v_pos.y += f.y * h
            v_pos.z += f.z * h

        },
        step : ( delta : number ) => {

            const process = ( k, b, x, v, target, _, delta ) => {
                v[_] += spring_acc( k, b, x[_], v[_], target[_] ) * delta
                x[_] += v[_] * delta
            }

            process(k, b, pos, v_pos, target_pos, 'x', delta )
            process(k, b, pos, v_pos, target_pos, 'y', delta )
            process(k, b, pos, v_pos, target_pos, 'z', delta )

            process(k, b, rot, v_rot, target_rot, 'x', delta )
            process(k, b, rot, v_rot, target_rot, 'y', delta )
            process(k, b, rot, v_rot, target_rot, 'z', delta )

        },
    }
}