export class LRUMap<K = string, T = any> {
  public readonly max;
  private _cache_map: Map<K, T>;

  constructor(max: number = 100) {
    this.max = max;
    this._cache_map = new Map();
  }

  private firstKey(): K | void {
    const { value } = this._cache_map.entries().next();
    if (value) {
      return (value as [K, T])[0];
    }
  }

  private updateItemOrder(key: K, value: T) {
    this._cache_map.delete(key);
    this._cache_map.set(key, value);
  }

  public get(key: K) {
    const value = this._cache_map.get(key);
    if (value) {
      this.updateItemOrder(key, value);
    }
    return value;
  }

  public set(key: K, value: T) {
    this.updateItemOrder(key, value);
    if (this._cache_map.size > this.max) {
      const key = this.firstKey();
      this._cache_map.delete(key as K);
    }
  }

  public has(key: K) {
    return this._cache_map.has(key);
  }

  public remove(key: K) {
    return this._cache_map.delete(key);
  }

  public reset() {
    this._cache_map.clear();
  }

  public entries() {
    return this._cache_map.entries();
  }

  public keys() {
    return this._cache_map.keys();
  }

  public values() {
    return this._cache_map.values();
  }

  public [Symbol.iterator]() {
    return this._cache_map.entries();
  }
}

export function lruCache<T extends any[], R>(
  cb: (...args: T) => R,
  maxSize: number = 100,
) {
  const cache = new LRUMap<string, R>(maxSize);
  const wrapper: typeof cb = (...args) => {
    const key = JSON.stringify(args);
    let result = cache.get(key);
    if (!result) {
      result = cb(...args);
      cache.set(key, result);
    }
    return result;
  };

  return wrapper;
}
