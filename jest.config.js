module.exports = {
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  testRegex: "\\.(test|spec)\\.ts$",
  moduleFileExtensions: ["ts", "js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/imageMock.js",
    "\\.css$": "identity-obj-proxy"
  },
  collectCoverageFrom: ["src/emails-input/*.ts"]
};
