let env = require('./env');

function openAlfa(client) {
	return client
		.url(env.BASE_URL + 'tests/testpages/alfa/index.html')
		.waitForElementPresent('body', 10000)
		.waitForElementVisible('.bnn-banner');
}

module.exports = {
	'@tags': ['test'],

	hasFourCategories: function(client) {
		openAlfa(client)
			.getText({ selector: '.bnn-banner-consent-label', index: 0 }, function(r) {
				client.assert.equal(r.value, 'Necessary');
			})
			.getText({ selector: '.bnn-banner-consent-label', index: 1 }, function(r) {
				client.assert.equal(r.value, 'Marketing');
			})
			.getText({ selector: '.bnn-banner-consent-label', index: 2 }, function(r) {
				client.assert.equal(r.value, 'Preferences');
			})
			.getText({ selector: '.bnn-banner-consent-label', index: 3 }, function(r) {
				client.assert.equal(r.value, 'Statistics');
			})
			.end();
	},

	acceptAll: function(client) {
		openAlfa(client)
			.execute('return window._scripts;', [], function(r) {
				client.assert.equal(r.value.length, 2);
				client.assert.ok(r.value.includes('inline'), 'inline');
				client.assert.ok(r.value.includes('necessary.js'), 'necessary.js');
			})
			.click('.bnn-banner-button[name=bnn-accept-all]')
			.pause(2000)
			.execute('return window._scripts;', [], function(r) {
				client.assert.equal(r.value.length, 5);
				client.assert.ok(r.value.includes('inline'), 'inline');
				client.assert.ok(r.value.includes('necessary.js'), 'necessary.js');
				client.assert.ok(r.value.includes('statistics.js'), 'statistics.js');
				client.assert.ok(r.value.includes('preferences.js'), 'preferences.js');
				client.assert.ok(r.value.includes('marketing.js'), 'marketing.js');
			})
			.end();
	},

	acceptMarketing: function(client) {
		openAlfa(client)
			.click('.bnn-banner-consent-switch[data-category=marketing]')
			.click('.bnn-banner-button[name=bnn-save]')
			.pause(100)
			.execute('return window._scripts;', [], function(r) {
				client.assert.equal(r.value.length, 3);
				client.assert.ok(r.value.includes('inline'), 'inline');
				client.assert.ok(r.value.includes('necessary.js'), 'necessary.js');
				client.assert.ok(r.value.includes('marketing.js'), 'marketing.js');
			})
			.end();
	},

	saveOnly: function (client) {
		openAlfa(client)
			.click('.bnn-banner-button[name=bnn-save]')
			.pause(100)
			.execute('return window._scripts;', [], function(r) {
				client.assert.equal(r.value.length, 2);
				client.assert.ok(r.value.includes('inline'), 'inline');
				client.assert.ok(r.value.includes('necessary.js'), 'necessary.js');
			})
			.end();
	},

	localStorageCheck: function (client) {
		openAlfa(client)
			.execute('return window.localStorage.getItem(\'_cookieConsents\');', [], function(r) {
				client.assert.ok(!r.value);
			})
			.click('.bnn-banner-button[name=bnn-save]')
			.pause(100)
			.execute('return window.localStorage.getItem(\'_cookieConsents\');', [], function(r) {
				client.assert.ok(!!r.value);
			})
			.end();
	},

	keepPreferences: function (client) {
		openAlfa(client)
			.click('.bnn-banner-button[name=bnn-save]')
			.pause(100)
			.refresh()
			.pause(500)
			.waitForElementPresent('body', 10000)
			.waitForElementNotPresent('.bnn-banner', 1000)
			.end();
	},

	blockIframe: function (client) {
		openAlfa(client)
			.waitForElementNotPresent('iframe', 1000)
			.click('.bnn-banner-button[name=bnn-accept-all]')
			.pause(100)
			.waitForElementPresent('iframe', 1000)
			.end();
	}
};
