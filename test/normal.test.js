import test from 'ava';
import { factory } from '../dist/esm/index';

class TestClass {
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

  compare(other) {
    return this.v == other.v;
  }
}

const { snapshotManager } = require('ava/lib/concordance-options');
snapshotManager.plugins.push(factory(TestClass));

test('normal eq', async t => {
  t.plan(1);
  t.snapshot(new TestClass(100));
});

test.failing('normal neq', async t => {
  t.plan(1);
  t.snapshot(new TestClass(400));
});
