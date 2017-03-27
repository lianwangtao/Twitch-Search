module.exports = {
  entry: './src/client.jsx',
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'react',
            'latest'
          ]
        }
      }
    ]
  },
  resolve: {
    extension: ['', '.js', '.jsx', '.json']
  }
}

