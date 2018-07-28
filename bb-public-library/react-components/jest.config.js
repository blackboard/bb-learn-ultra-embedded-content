module.exports = {
    coverageDirectory: '../coverage/',
    moduleNameMapper: {
        '^.+\\.(css|scss|svg)$': 'identity-obj-proxy',
        'bb-public-library/utilities': '<rootDir>../utilities/lib',
    },
    setupFiles: [],
    setupTestFrameworkScriptFile: './test-setup.js',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
};
