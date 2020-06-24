import _ from 'lodash';

export default {
    Jest: {
        group: "Test framework",
        devDependencies: configItems => {
          const isBabel = _.includes(configItems, "Babel");
          return _.concat(["jest"], isBabel ? "babel-jest": []);
        },
        files: configItems => ({
          "my.test.js": `test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
  });`
        }),
        packageJson: {
          scripts: {
            test: "jest"
          }
        }
      },
      Mocha: {
        group: "Test framework",
        devDependencies: configItems => {
          return ["mocha"];
        },
        files: configItems => ({
          "test/test.js": `var assert = require('assert');
    describe('Array', function () {
      describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
          assert.equal([1, 2, 3].indexOf(4), -1);
        });
      });
    });`
  }),
        packageJson: {
          scripts: {
            test: "mocha"
          }
        }
      },
      Jasmine: {
        group: "Test framework",
        devDependencies: configItems => {
          return ["jasmine"];
        },
        files: configItems => ({
          "spec/myJasmineSpec.js": `describe("A suite is just a function", function() {
    var a;
  
    it("and so is a spec", function() {
      a = true;
  
      expect(a).toBe(true);
    });
  });`, "spec/support/jasmine.json": `{
    "spec_dir": "spec",
    "spec_files": [
      "**/*[sS]pec.js"
    ],
    "helpers": [
      "helpers/**/*.js"
    ],
    "stopSpecOnExpectationFailure": false,
    "random": true
  }`
        }),
        packageJson: {
          scripts: {
            test: "jasmine"
          }
        }
      },
      TestCafe: {
        group: "Test framework",
        devDependencies: configItems => {
          return ["testcafe"];
        },
        files: configItems => ({
          "tests/test-example.js": `import { Selector } from 'testcafe';
          
fixture \`Getting Started\`
  .page \`http://devexpress.github.io/testcafe/example\`;

test('My first test', async t => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button');
});`
        }),
        packageJson: {
          scripts: {
            test: "testcafe chrome tests/"
          }
        }
      },
      AVA: {
        group: "Test framework",
        devDependencies: configItems => {
          return ["ava"];
        },
        files: configItems => ({
          "test.js": `const test = require('ava');

test('foo', t => {
    t.pass();
});

test('bar', async t => {
    const bar = Promise.resolve('bar');
    t.is(await bar, 'bar');
});`
  }),
        packageJson: {
          scripts: {
            test: "ava"
          }
        }
      },
      Cypress: {
        group: "Test framework",
        devDependencies: configItems => {
          return ["cypress"];
        },
        files: configItems => ({
          "cypress/integration/sample_spec.js": `describe('My First Test', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})`
  }),
        packageJson: {
          scripts: {
            "cypress:open": "cypress open"
          }
        }
      },
}