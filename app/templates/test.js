const test = require('tape');
const <%= camelModuleName %> = require('../src');

test('<%= camelModuleName %>', (assert) => {
  assert.plan(1);
  assert.equal(true, <%= camelModuleName %>(), 'return true');
});
