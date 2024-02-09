window.onscroll = function() {
	scrollFunction();
}

function scrollFunction() {
	let rttButton = document.querySelector(".rtt");

	if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
		rttButton.style.display = "block";
	} else {
		rttButton.style.display = "none";
	}
}
