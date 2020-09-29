
function ready() {
	window._onload = true;
	console.log('onload.js');
}

if (document.readyState === 'complete') {
	ready();
} else {
	window.addEventListener('DOMContentLoaded', ready, false);
}
