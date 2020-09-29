const seleniumServer = require('selenium-server');
const chromeDriver = require('chromedriver');
const geckoDriver = require('geckodriver');

module.exports = {
	src_folders: [
		'tests/e2e'
	],
	live_output: true,
	disable_colors: false,
	parallel_process_delay: 10,
	test_workers: {
		enabled: false,
		workers: 'auto'
	},
	selenium: {
		start_process: true,
		server_path: seleniumServer.path,
		check_process_delay: 5000,
		host: '127.0.0.1',
		port: 4444,
		cli_args: {
			"webdriver.chrome.driver": chromeDriver.path,
			"webdriver.gecko.driver": geckoDriver.path
		}
	},
	test_settings: {
		skip_testcases_on_fail: false,
		end_session_on_fail: false,
		chrome: {
			desiredCapabilities: {
				browserName: 'chrome',
				chromeOptions: {
					w3c: false
				}
			}
		},
		firefox: {
			desiredCapabilities: {
				browserName: 'firefox',
				javascriptEnabled: true,
				acceptSslCerts: true,
				marionette: true
			}
		}
	}
};
