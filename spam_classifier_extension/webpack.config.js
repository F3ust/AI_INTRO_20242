const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    popup: './src/popup.ts',
    content: './src/content.ts',
    background: './src/background.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: "manifest.json", 
          to: "manifest.json",
          transform(content) {
            const manifest = JSON.parse(content);
            // Fix paths for dist directory
            if (manifest.background && manifest.background.service_worker) {
              manifest.background.service_worker = "background.js";
            }
            if (manifest.content_scripts) {
              manifest.content_scripts.forEach(script => {
                script.js = script.js.map(jsFile => jsFile.replace('dist/', ''));
              });
            }
            return JSON.stringify(manifest, null, 2);
          }
        },
        { from: "popup.html", to: "popup.html" },
        { from: "images", to: "images" }
      ],
    }),
  ],
}; 