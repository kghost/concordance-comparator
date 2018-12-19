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

  compare() {
    return true;
  }
}

const { snapshotManager } = require('ava/lib/concordance-options');
snapshotManager.plugins.push(factory(TestClassEq, v => new TestClassEq(v[0])));

test('should pass', async t => {
  t.plan(1);
  t.snapshot(new TestClassEq(1100));
});
