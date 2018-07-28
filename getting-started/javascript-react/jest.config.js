// jest.config.js
module.exports = {
    globals: {
        window: {
            location: {
                origin: 'https://www.example.com/',
            },
        },
    },
    moduleNameMapper: {
        '^.+\\.(css|scss|svg)$': 'identity-obj-proxy',
        'bb-public-library/react-components': '<rootDir>../../bb-public-library/react-components/lib',
        'bb-public-library/utilities': '<rootDir>../../bb-public-library/utilities/lib',
    },
    setupFiles: [],
    setupTestFrameworkScriptFile: './test-setup.js',
    testURL: 'https://www.example.com/',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
};
