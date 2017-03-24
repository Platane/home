const path = require('path')
const webpack = require('webpack')

const production = 'production' == process.env.NODE_ENV

module.exports = {

    entry: {
        'index'        : [
            './src/index.html',
            './src/index.js',
        ],
    },

    output: {
        path        : path.join(__dirname, 'dist'),
        filename    : '[name].js'
    },

    module  : {

        rules: [
            {
                test: /\.js$/,
                use : [
                    {
                        loader  : 'babel-loader',
                    },
                ],
            },

            {
                test: /\.(eot|ttf|woff|woff2|svg|gif|jpg|png|html)$/,
                use : [
                    {
                        loader  : 'file-loader',
                        options : {
                            name: '[name].[ext]',
                        }
                    },
                ],
            },

            {
                test: /\.css$/,
                use : [
                    {
                        loader  : 'style-loader',
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            modules         : true,
                            importLoaders   : 1,
                            localIdentName  : production
                                ? '[hash:6]'
                                : '[path][name]---[local]'
                            ,
                        },
                    },
                    {
                        loader  : 'postcss-loader',
                        options : {
                            plugins: () => [
                                ...( production
                                    ? [
                                        require('autoprefixer')({ }),
                                    ]
                                    : []
                                ),
                            ]
                        },
                    },
                ],
            },

        ],
    },

    plugins : [

        new webpack.DefinePlugin({

            // env var
            ...(
                [
                    'NODE_ENV',
                    'SOURCE_URL',
                ]
                    .reduce( (o,name) =>
                        !(name in process.env)
                            ? o
                            : { ...o, [ 'process.env.'+name ] : `'${ process.env[ name ] }'`}
                    ,{})
            ),
        })
    ],

    devtool : 'source-map',
}