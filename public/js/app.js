// import SimpleMDE from "simplemde";
// import Styles from "css-loader?modules!../../node_modules/simplemde/dist/simplemde.min.css";

$(document).ready(function() {
    var longTime = $("#timestamp > em:nth-child(1)");
    longTime.text(moment(longTime.text()).format("MM/DD/YYYY HH:mm:ss"));
    $.each($(".short-date"), function (i, v) {
	    $(v).text(moment($(v).text()).format("MMMM D YYYY"));
    });
});

$(".menu.open").on("click", function () {
	$(".ui.sidebar").sidebar("toggle");
});

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


