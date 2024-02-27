window.onscroll = function() {
	scrollFunction();
}

function scrollFunction() {
	let rttButton = document.querySelector(".rtt");

	if (document.body.scrollTop > 800 || document.documentElement.scrollTop > 800) {
		rttButton.style.display = "block";
	} else {
		rttButton.style.display = "none";
	}
}
