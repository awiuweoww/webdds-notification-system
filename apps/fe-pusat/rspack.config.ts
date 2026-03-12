import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import ReactRefreshPlugin from "@rspack/plugin-react-refresh";
import * as path from "path";

const isDev = process.env.NODE_ENV === "development";
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig((env) => {
	// Menangkap port dari --env port=3000/3001, atau default 3000
	let port = 3000;
	if (env && env.port) {
		port = Number(env.port);
	} else if (process.env.PORT) {
		port = Number(process.env.PORT);
	}

	return {
		context: __dirname,
		entry: {
			main: "./src/main.tsx"
		},
		devtool: "source-map",
		output: {
			publicPath: "auto",
			filename: "bundle.js"
		},
		resolve: {
			modules: [path.join(__dirname, "src"), "node_modules"],
			alias: {
				"@common": path.resolve(__dirname, "src/common"),
				"@component": path.resolve(__dirname, "src/components"),
				"@constants": path.resolve(__dirname, "src/constants"),
				"@utils": path.resolve(__dirname, "src/utils"),
				"@store": path.resolve(__dirname, "src/store"),
				"@hooks": path.resolve(__dirname, "src/hooks"),
				"@types": path.resolve(__dirname, "src/types"),
				"@streams": path.resolve(__dirname, "src/streams")
			},
			extensions: ["...", ".ts", ".tsx", ".jsx"]
		},
		devServer: {
			port: port,
			static: {
				directory: path.join(__dirname, "build")
			},
			historyApiFallback: true,
			client: {
				overlay: false
			}
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: ["postcss-loader"],
					type: "css"
				},
				{
					test: /\.svg$/,
					type: "asset"
				},
				{
					test: /\.[jt]sx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: "builtin:swc-loader",
							options: {
								jsc: {
									parser: {
										syntax: "typescript",
										tsx: true
									},
									transform: {
										react: {
											runtime: "automatic",
											development: isDev,
											refresh: isDev
										}
									}
								},
								env: { targets }
							}
						}
					]
				}
			]
		},
		plugins: [
			new rspack.HtmlRspackPlugin({
				template: "./index.html"
			}),
			isDev && new ReactRefreshPlugin()
		].filter(Boolean),
		optimization: {
			minimizer: [
				new rspack.SwcJsMinimizerRspackPlugin(),
				new rspack.LightningCssMinimizerRspackPlugin()
			]
		},
		experiments: {
			css: true
		}
	};
});
