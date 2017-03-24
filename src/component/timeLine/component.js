import React                    from 'react'
import type {Element}           from 'react'
import type {TimeLine as TimeLineType}   from '../../../type'

import style                    from './style.css'

export type Props = {
    project : ((x:number) => number),
    lines   : Array<TimeLineType>,
    offset  : number,
    now     : number,
}

const color = Array.from({length: 4}).map( (_,i,arr) => `hsl(${60+i/arr.length*360},60%,60%)`)




export const TimeLine = ({project, lines, offset, now}: Props) : Element<any> =>
    <div className={style.container}>
        <div className={style.labelList}>
            { lines
                .map( ({ label, icon }, i) =>
                    <div key={label} className={style.label}>
                        <div className={style.title} style={{ color: color[i] }}>{ label }</div>
                    </div>
                )
            }
        </div>
        <svg className={style.lines}>
            <g className={style.rulers}>
                <g className={style.nowGroup} transform={`translate(${project(now)},0)`}>
                    <line className={style.nowCursor} x1={0} x2={0} y1={0} y2={9999} />
                </g>
            </g>
            <g className={style.viewport} transform={`translate(${offset},0)`}>
                { lines
                    .map( ({ events, label }, i) =>
                        <g key={label} className={style.line} transform={`translate(0,${40*(i+0.5)})`} >
                            <line className={style.backLine} stroke={color[i]} x1={-99999} x2={project(now)} y1={0} y2={0} />
                            <line className={style.backLine_future} stroke={color[i]} x1={project(now)} x2={99999} y1={0} y2={0} />
                            { events
                                .map( ({ startDate, endDate }) =>
                                    <g key={startDate} className={style.event}>
                                        <line className={style.tic} stroke={color[i]} x1={project(startDate)} x2={project(endDate)} y1={0} y2={0} />
                                    </g>
                                )
                            }
                        </g>
                    )
                }
            </g>
        </svg>
    </div>

