var path = require("path");

module.exports = {
	entry: "./public/js/app.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "public/js")
	}
	// module: {
	// 	rules: [
	// 		{
	// 			test: "/node_modules/simplemde/dist/simplemde.min.css",
	// 			use: "css-loader"
	// 		}
	// 	]
	// }
};