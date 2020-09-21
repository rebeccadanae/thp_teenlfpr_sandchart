// Small JS to handle local URLs
// http://lea.verou.me/2017/10/different-remote-and-local-resource-urls-with-service-workers/

(function() {

	if (location.hostname !== "localhost") {
		return;
	}

	if (!self.document) {
		// We're in a service worker! Oh man, we’re living in the future! 🌈🦄
		self.addEventListener("fetch", function(evt) {
			const url = evt.request.url;

			// If the url contains Rackspace CDN url, then we remove it for local developments
			if (url.indexOf("rackcdn.com") > -1) {
				const newURL = url.replace(/.+?\/assets/, "assets") + "?" + Date.now();

				const response = fetch(new Request(newURL), evt.request)
					.then(r => r.status < 400? r : Promise.reject())
					// if that fails, return original request
					.catch(err => fetch(evt.request));

				evt.respondWith(response);
			}
		});

		return;
	}

	if ("serviceWorker" in navigator) {
		// Register this script as a service worker
		addEventListener("load", function() {
			navigator.serviceWorker.register("sitewide.js");
		});
	}

})();
