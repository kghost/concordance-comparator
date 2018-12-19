export interface Comparable<T> {
  toString(): String;
  serialize(): T;
  deserialize?(value: T): void;
  compare(other: Comparable<T>): boolean;
}
