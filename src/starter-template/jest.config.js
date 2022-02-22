// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
	moduleNameMapper: {
		jszip: '<rootDir>/tests/mock/JSZip.js'
	},

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for
	// which coverage information should be collected
	collectCoverageFrom: [
		'**/*.(js)'
	],

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// An array of regexp pattern strings used to skip coverage collection
	coveragePathIgnorePatterns: [
		'/coverage/',
		'/export/FileSaver.js',
		'/node_modules/',
		'/tests/mock/',
		'/bundle.js',
		'/jest.config.js',
		'/rollup.config.js'
	],

	// An object that configures minimum threshold enforcement for coverage results
	coverageThreshold: {
		global: {
			branches: 24,
			functions: 39,
			lines: 36,
			statements: 36
		}
	},

	// A set of global variables that need to be available in all test environments
	globals: {},

	// An array of file extensions your modules use
	moduleFileExtensions: [
		'js',
		'json'
	],

	// The paths to modules that run some code to configure or
	// set up the testing environment before each test
	setupFiles: [
		'./jest.setup.js'
	],

	transform: {
		'^.+\\.jsx?$': 'babel-jest'
	}
};
