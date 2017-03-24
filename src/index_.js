import ReactDOM                 from 'react-dom'
import React                    from 'react'

import {TimeLine as TimeLineComponent}  from './component/timeLine/component'
import type {TimeLine as TimeLineType}  from '../type'

{

    const lines : Array<TimeLineType> = [
        {
            label   : 'game jam',
            icon    : 'case',
            events  : [
                {
                    startDate       : (new Date('2017-01-20')).getTime(),
                    endDate         : (new Date('2017-01-22')).getTime(),
                    media           : [
                        {
                            type    : 'img',
                            label   : null,
                            url     : 'https://raw.githubusercontent.com/TheMarvellousTeam/The-Marvellous-Surfers/master/doc/asset/run.jpg',
                        },
                        {
                            type    : 'link',
                            label   : 'github',
                            url     : 'https://github.com/TheMarvellousTeam/The-Marvellous-Surfers',
                        }
                    ],
                    icon_url        : '',
                    description     : '',
                    title           : 'The marvellous surfers',
                },
                {
                    startDate       : (new Date('2014-04-27')).getTime(),
                    endDate         : (new Date('2014-04-29')).getTime(),
                    media           : [
                        {
                            type    : 'img',
                            label   : null,
                            url     : 'https://raw.githubusercontent.com/TheMarvellousTeam/The-Marvellous-Sushimaker/master/screenshots/scene.png',
                        },
                        {
                            type    : 'link',
                            label   : 'github',
                            url     : 'https://github.com/TheMarvellousTeam/The-Marvellous-Sushimaker',
                        }
                    ],
                    icon_url        : '',
                    description     : '',
                    title           : 'The marvellous sushimaker',
                },
                {
                    startDate       : (new Date('2016-01-20')).getTime(),
                    endDate         : (new Date('2016-01-22')).getTime(),
                    media           : [],
                    icon_url        : '',
                    description     : '',
                    title           : 'The marvellous space drillers',
                },
                {
                    startDate       : (new Date('2015-01-20')).getTime(),
                    endDate         : (new Date('2015-01-22')).getTime(),
                    media           : [],
                    icon_url        : '',
                    description     : '',
                    title           : 'The marvellous island',
                },
                {
                    startDate       : (new Date('2014-01-20')).getTime(),
                    endDate         : (new Date('2014-01-22')).getTime(),
                    media           : [],
                    icon_url        : '',
                    description     : '',
                    title           : 'The marvellous crab',
                },
            ],
        },
        {
            label   : 'random project',
            icon    : 'case',
            events  : [],
        },
        {
            label   : 'work',
            icon    : 'case',
            events  : [],
        },
        {
            label   : 'challenge',
            icon    : 'cup',
            events  : [
                {
                    startDate       : (new Date('2017-02-18')).getTime(),
                    endDate         : (new Date('2017-02-28')).getTime(),
                    media           : [],
                    icon_url        : '',
                    description     : '',
                    title           : 'js1k 2017',
                },
                {
                    startDate       : (new Date('2015-02-18')).getTime(),
                    endDate         : (new Date('2015-02-28')).getTime(),
                    media           : [],
                    icon_url        : '',
                    description     : '',
                    title           : 'js1k 2015',
                },
                {
                    startDate       : (new Date('2014-02-18')).getTime(),
                    endDate         : (new Date('2014-02-28')).getTime(),
                    media           : [],
                    icon_url        : '',
                    description     : '',
                    title           : 'js1k 2014',
                },
            ],
        },

    ]

    const offset = (new Date('2014-01-01')).getTime()
    const w = 3*24*60*60*1000

    ReactDOM.render( <TimeLineComponent lines={lines} project={x => (x-offset)/w} offset={0} now={Date.now()}/>, document.getElementById('timeLine') )
}