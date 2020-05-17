module.exports = {
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  testEnvironment: "node",
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
  collectCoverageFrom: ["src/*.ts"]
};
