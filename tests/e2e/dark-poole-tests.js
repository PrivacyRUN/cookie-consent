let env = require('./env');

function openDarkPoole(client) {
	return client
		.url(env.BASE_URL + 'tests/testpages/dark-poole/index.html')
		.waitForElementPresent('body', 10000)
		.waitForElementVisible('.bnn-banner');
}

function cssTest(client, selector, propertyName, expectedValue) {
	return client.execute('return window.getComputedStyle(document.querySelector(\'' + selector + '\')).' + propertyName + ';', [], function (r) {
		client.assert.equal(expectedValue, r.value);
	});
}

module.exports = {
	'@tags': ['test'],

	customTheme: function (client) {
		openDarkPoole(client);
		cssTest(client, '.bnn-banner', 'backgroundColor', 'rgb(106, 106, 106)');
		cssTest(client, '.bnn-banner-title', 'color', 'rgb(255, 255, 255)');
		cssTest(client, '.bnn-banner-consent-switch[data-checked="0"][data-enabled="1"]', 'backgroundColor', 'rgb(67, 67, 67)');
		cssTest(client, '.bnn-banner-consent', 'borderTopColor', 'rgb(67, 67, 67)');
	},

	jQuery: function (client) {
		openDarkPoole(client)
			.execute('return !window.jQuery', function (r) {
				client.assert.ok(r.value);
			})
			.click('.bnn-banner-button[name=bnn-accept-all]')
			.pause(1000)
			.execute('return !!window.jQuery', function (r) {
				client.assert.ok(r.value);
			})
			.end();
	}
};
