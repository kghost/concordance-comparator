import test from 'ava';
import { factory } from '../dist/esm/index';

class TestClassNeq {
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
    return false;
  }
}

const { snapshotManager } = require('ava/lib/concordance-options');
snapshotManager.plugins.push(factory(TestClassNeq));

test.failing('always fail', async t => {
  t.plan(1);
  t.snapshot(new TestClassNeq(700));
});
