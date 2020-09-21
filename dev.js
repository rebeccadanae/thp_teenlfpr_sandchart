(function() {
	'use strict';

/* -- Tools -- */

	// function analytics(action, label='null') {
	// 	window.dataLayer.push({
	// 		'event': 'Interactive',
	// 		'category': 'Interactive',
	// 		'action': action,
	// 		'label': label
	// 	});
	// 	// console.clear();
	// 	// console.table(window.dataLayer);
	// }

	// function throttle(callback, limit) {
	// 	var wait = false;
	// 	return function() {
	// 		if (wait) return;
	// 		callback.call();
	// 		wait = true;
	// 		setTimeout(function(){
	// 			wait = false;
	// 		}, limit);
	// 	}
	// }

/* -- Function -- */

	// Get the version if it is A or B
	const getRandomBasedOn = (variation) => Math.random() > variation;

	// Get percentage
	const getPercentage = (number) => (number * 100).toFixed(2);

/* -- Application -- */

	function app() {

		const ABratio = .5;
		const isVariantA = () => getRandomBasedOn(ABratio);
		const iterations = [1000,10000,100000,1000000,10000000];

		let displayVariantA;
		let displayVariantB;
		let i;

		for (let n = iterations.length - 1; n >= 0; n--) {
			displayVariantA = displayVariantB = i = 0;

			while (i < iterations[n]) {
				isVariantA() ? displayVariantA++ : displayVariantB++;
				i++;
			}

			console.log(`Variations: ${iterations[n].toLocaleString()}\nA/B: ${getPercentage(displayVariantA/iterations[n])}%/${getPercentage(displayVariantB/iterations[n])}%`);
		}
	}

	// Start the whole thing when the DOM is complete
	document.addEventListener('readystatechange', function() {
		document.readyState === 'interactive' && app();
	}, false);

// end of the interactive
})();
