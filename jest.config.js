// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
	testEnvironment: 'jsdom',
	moduleNameMapper: {
		wvui: '<rootDir>/node_modules/@wikimedia/wvui'
	},

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for
	// which coverage information should be collected
	collectCoverageFrom: [
		'src/**/*.(js)'
	],

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'src/routes.js',
		'src/main.js',
		// Not part of application
		'src/starter-template',
		'src/export/FileSaver.js'
	],

	// An object that configures minimum threshold enforcement for coverage results
	coverageThreshold: {
		global: {
			branches: 40,
			functions: 40,
			lines: 40,
			statements: 40
		}
	},

	// A set of global variables that need to be available in all test environments
	globals: {
		'vue-jest': {
			babelConfig: false,
			hideStyleWarn: true,
			experimentalCSSCompile: true
		}
	},

	// An array of file extensions your modules use
	moduleFileExtensions: [
		'js',
		'json',
		'vue'
	],

	// The paths to modules that run some code to configure or
	// set up the testing environment before each test
	setupFiles: [
		'./jest.setup.js'
	],

	transform: {
		'.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
		'^.+\\.jsx?$': 'babel-jest'
	}
};
