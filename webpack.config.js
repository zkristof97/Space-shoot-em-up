var path = require('path');

module.exports={
    devtool: 'source-map',
    mode: 'development',
    entry: './ts-src/game.ts',
    output:{
        path: path.resolve(__dirname, "build"),
        filename: 'bundle.js'
    },
    module:{
        rules:[{
            test: /\.ts$/,
            include: path.resolve(__dirname, 'ts-src'),
            loader: 'ts-loader'
        }]
    },
    resolve:{
        extensions: ['.webpack.js','.web.js','.ts','.js']
    },
    watch: true,
    target: "web"
}