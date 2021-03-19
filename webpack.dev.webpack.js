import { merge } from "webpack-merge";
import base from "./webpack.common.webpack.js";

const dirName = "build";
const react = "react.development.js";
const reactDom = "react-dom.development.js";
const chart = "Chart.js";

const common = base(dirName, react, reactDom, chart);

const config = (rootDir) => ({
    mode: "development",
    resolve: {
        alias: {
            "react-dom": "@hot-loader/react-dom"
        },
    },
    devServer: {
        contentBase: `./${rootDir}`
    }
});

export default merge(common, config);