import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { merge } from "webpack-merge";
import ZipPlugin from "zip-webpack-plugin";
import base from "./webpack.common.webpack.js";

const dirName = "dist";
const react = "react.production.min.js";
const reactDom = "react-dom.production.min.js";
const chart = "Chart.min.js";

const common = base(dirName, react, reactDom, chart);

const config = {
    mode: "production",
    resolve: {
        extensions: [".js", ".jsx", ".tsx", ".ts"]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ZipPlugin({
            path: "..",
            filename: "FBRefVisualizer.zip",
            exclude: [/\.txt$/],
            fileOptions: {
                mtime: new Date(),
                mode: 0o100664,
                compress: true,
                forceZip64Format: false
            },
            zipOptions: {
                forceZip64Format: false,
            }
        })
    ],
};

export default merge(common, config);
