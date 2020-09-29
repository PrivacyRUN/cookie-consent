let env = require('./env');

function openModernResume(client) {
	return client
		.url(env.BASE_URL + 'tests/testpages/modern-resume/index.html')
		.waitForElementPresent('body', 10000)
		.waitForElementVisible('.bnn-banner');
}

module.exports = {
	'@tags': ['test'],

	onLoad: function (client) {
		openModernResume(client)
			.execute('return !window._onload', function (r) {
				client.assert.ok(r.value);
			})
			.click('.bnn-banner-button[name=bnn-accept-all]')
			.pause(1000)
			.execute('return !!window._onload', function (r) {
				client.assert.ok(r.value);
			})
			.refresh()
			.waitForElementPresent('body', 10000)
			.execute('return !!window._onload', function (r) {
				client.assert.ok(r.value);
			})
			.end();
	}
};
