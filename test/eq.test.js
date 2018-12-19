import test from 'ava';
import { factory } from '../dist/esm/index';

class TestClassEq {
  constructor(v) {
    this.v = v;
  }

  toString() {
    return `TestClass<${this.v}>`;
  }

  serialize() {
    return [this.v];
  }

  deserialize(value) {
    this.v = value[0];
  }

  compare() {
    return true;
  }
}

const { snapshotManager } = require('ava/lib/concordance-options');
snapshotManager.plugins.push(factory(TestClassEq));

test('always pass', async t => {
  t.plan(1);
  t.snapshot(new TestClassEq(600));
});
