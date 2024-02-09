window.onscroll = function() {
	scrollFunction();
}

function scrollFunction() {
	let rttButton = document.querySelector(".rtt");

	if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
		rttButton.style.display = "block";
	} else {
		rttButton.style.display = "none";
	}
}
