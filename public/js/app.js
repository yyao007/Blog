// import SimpleMDE from "simplemde";
// import Styles from "css-loader?modules!../../node_modules/simplemde/dist/simplemde.min.css";

function confirmForm() {
	return confirm("Are you sure you want to delete this post?");
}

hljs.initHighlightingOnLoad();

// require("css-loader!simplemde/dist/simplemde.min.css");
var simplemde = new SimpleMDE({
	// autosave: {
	// 	enabled: true,
	// 	uniqueId: "editor",
	// 	delay: 10000
	// },
	autofocus: true,
	element: $("#editor")[0]
});
