import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path, { join } from "path";
import webpack from "webpack";

const __dirname = path.resolve();

const config = (rootDir, react, reactDom, chart) => ({
    devtool: false,
    entry: {
        background: join(__dirname, "src/background.ts"),
        inject: join(__dirname, "src/inject.tsx"),
        popup: join(__dirname, "src/popup.tsx")
    },
    output: {
        path: join(__dirname, rootDir),
        filename: "[name].js"
    },
    stats: {
        errorDetails: true
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.ts(x)?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: true,
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test: /\.svg$/,
                use: "file-loader",
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            mimetype: "image/png",
                        },
                    },
                ],
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public", to: "." },
                { from: `node_modules/react/umd/${react}`, to: "react.js" },
                { from: `node_modules/react-dom/umd/${reactDom}`, to: "react-dom.js" },
                { from: `node_modules/chart.js/dist/${chart}`, to: "chart.js" }
            ],
        }),
        new webpack.ProgressPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: "[name].js.map"
        }),
        new webpack.BannerPlugin({
            banner: `Copyright ${new Date().getFullYear()} FBRefVisualizer`,
            entryOnly: true
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "templates", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"]
        })
    ],
    resolve: {
        extensions: [".js", ".jsx", ".tsx", ".ts"]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "chart.js": "Chart"
    }
});

export default config;
