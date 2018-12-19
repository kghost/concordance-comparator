import { ObjectFormatter } from 'concordance/lib/formatUtils';
import { single } from 'concordance/lib/lineBuilder';

import { Comparable } from './Comparable';

function elementFactory<U, T extends Comparable<U>>(
  api: any,
  cls: new () => T,
  clsFactory: ((u: U) => T) | undefined
) {
  function describe(props: any): any {
    return new DescribedPromiseValue(props);
  }

  function deserialize(state: any, recursor: any) {
    return new DeserializedPromiseValue(state, recursor);
  }

  const tag = Symbol(`@concordance/cls/${cls.name}`);

  abstract class PromiseValue extends api.ObjectValue {
    protected abstract value: T;

    constructor(props: any) {
      super(props);
    }

    compare(expected: any) {
      if (!(this.value instanceof cls)) return api.UNEQUAL;
      if (!(expected.value instanceof cls)) return api.UNEQUAL;

      return this.value.compare(expected.value) ? api.DEEP_EQUAL : api.UNEQUAL;
    }

    formatShallow(theme: any, indent: any) {
      const value = this.value;

      return new class extends ObjectFormatter {
        constructor(object: any, theme: any, indent: any) {
          super(object, theme, indent);
        }

        finalize() {
          return single(value.toString());
        }
      }(this, theme, indent);
    }

    serialize() {
      return [this.value.serialize(), super.serialize()];
    }
  }
  Object.defineProperty(PromiseValue.prototype, 'isComplex', { value: true });
  Object.defineProperty(PromiseValue.prototype, 'tag', { value: tag });

  class DescribedPromiseValue extends api.DescribedMixin(PromiseValue) {
    constructor(props: any) {
      super(props);
    }

    compare(expected: any) {
      return super.compare(expected);
    }
  }

  class DeserializedPromiseValue extends api.DeserializedMixin(PromiseValue) {
    constructor(state: any, recursor: any) {
      super(state[1], recursor);
      if (clsFactory) this.value = clsFactory(state[0]);
      else {
        this.value = new cls();
        this.value.deserialize(state[0]);
      }
    }

    compare(expected: any) {
      return super.compare(expected);
    }
  }

  return {
    describe,
    deserialize,
    tag,
  };
}

let index = 0;

export function factory<U, T extends Comparable<U>>(
  cls: new () => T,
  clsFactory: ((u: U) => T) | undefined = undefined
) {
  index++;

  // Must be unique across all registered plugins.
  const name = `@concordance/cls/${cls.name}`;

  // Expected API version to be passed to register().
  const apiVersion = 1;

  // Expected minimal version of Concordance. Concordance will increment its API
  // version for breaking changes, this is useful if you rely on features or
  // patches that were introduced in a specific version of Concordance.
  const minimalConcordanceVersion = '1.0.0';

  // Plugin-specific version of its serialization output.
  const serializerVersion = 2;

  const theme = {};

  function register(api: any) {
    const element = elementFactory(api, cls, clsFactory);

    api.addDescriptor(index, element.tag, element.deserialize);

    return (value: any) => {
      if (value instanceof cls) return element.describe;
      return null;
    };
  }

  return {
    name,
    apiVersion,
    minimalConcordanceVersion,
    serializerVersion,
    theme,
    register,
  };
}
