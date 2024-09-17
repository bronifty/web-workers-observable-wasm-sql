var h = Object.defineProperty;
var p = (n, e, s) => e in n ? h(n, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[e] = s;
var t = (n, e, s) => (p(n, typeof e != "symbol" ? e + "" : e, s), s);
const o = class o {
  // private _pendingUpdates: Function[] = [];
  // private _isProcessingUpdates: boolean = false;
  // because _computeActive is static and the parent observable is assigned to it during compute of the parent observable's _valueFn, which returns the child's value via get accessor, where we add the child (in its get accessor during the compute cycle of the parent observable) to the _dependencyArray of the parent observable, we must make _dependencyArray non-private aka public so that it can be accessed by the child via the static -aka global- property _computeActive, to which the parent observable is assigned
  // so what that looks like is:
  // 1. parent.compute() assigns parent observable to the global aka "static" member "_computeActive"
  // 2. parent.compute() calls parent._valueFn(...parent._valueFnArgs)
  // 3. parent._valueFn contains child.value, which is called as get value() or the get accessor of the child. Now we have pushed the child observable's get accessor method on top of the call stack, right above the parent's compute method
  // 4. before we access the child's value to return it to the parent's compute function (the call site or calling code), we check to see if the child observable itself is a dependency on the parent's own _dependencyArray, which is accessed as a property of the global aka "static" member of the observable class "_computeActive", to which the parent is assigned (the parent observable is equal to "_computeActive" and its property "_dependencyArray" is accessed via _computeActive._dependencyArray; the way to signify accessing the global or "static" property, which is assigned to an object, and its property is by referencing the name of the observable class as a prefix like so: Observable._computeActive._dependencyArray).
  // 5. If the child is not already on the static Observable._computeActive._dependencyArray to which the parent is assigned (in other words, the parent's dependency array, which is accessed by the child on the call stack via making it a global or static), we push it on there.
  // 6. child.value is returned to the call site or calling code (parent.compute()); if it's a Promise, handle that.
  // 7. loop over the parent's _dependencyArray and subscribe each child to teh compute method of the parent (bindComputedObservable function)
  // 8. nullify the _dependencyArray
  constructor(e, ...s) {
    t(this, "_value");
    t(this, "_previousValue");
    t(this, "_subscribers", []);
    t(this, "_valueFn", null);
    t(this, "_valueFnArgs", []);
    t(this, "_dependencyArray", []);
    t(this, "_lastPromiseId", 0);
    t(this, "_isComputing", !1);
    t(this, "_promiseQueue", []);
    t(this, "_generationCounter", 0);
    t(this, "subscribe", (e, s) => {
      if (s) {
        const i = () => {
          r(), s.removeEventListener("abort", i);
        };
        s.addEventListener("abort", i, { once: !0 });
      }
      const r = () => {
        const i = this._subscribers.indexOf(e);
        i > -1 && this._subscribers.splice(i, 1);
      };
      return this._subscribers.includes(e) || this._subscribers.push(e), r;
    });
    t(this, "publish", () => {
      for (const e of this._subscribers)
        e(this._value, this._previousValue);
    });
    t(this, "computeHandler", () => this.compute());
    t(this, "compute", () => {
      if (this._isComputing)
        return;
      this._isComputing = !0, o._computeActive = this;
      const e = this._valueFn ? this._valueFn(...this._valueFnArgs) : null;
      this._lastPromiseId += 1;
      const s = this._lastPromiseId, r = (i) => {
        s === this._lastPromiseId && (o._computeActive = null, this._dependencyArray.forEach((u) => {
          this.bindComputedObservable(u);
        }), this._dependencyArray = [], this.value = i, this._isComputing = !1);
      };
      e instanceof Promise ? e.then(r) : r(e);
    });
    t(this, "bindComputedObservable", (e) => {
      e.subscribe(this.computeHandler);
    });
    t(this, "push", (e) => {
      if (Array.isArray(this._value))
        this._value.push(e);
      else
        throw new Error("Push can only be called on an observable array.");
    });
    typeof e == "function" ? (this._valueFn = e, this._valueFnArgs = s, this.compute()) : this._value = e;
  }
  get value() {
    return o._computeActive && o._computeActive !== this && !o._computeActive._dependencyArray.includes(this) && o._computeActive._dependencyArray.push(this), this._value;
  }
  set value(e) {
    if (this._previousValue = this._value, e instanceof Promise) {
      this._generationCounter += 1;
      const s = this._generationCounter, r = {
        promise: e,
        clear: () => {
        }
        // replace with your clear function
      };
      this._promiseQueue.push([s, r]), r.promise.then((i) => {
        s === this._generationCounter && (this._value = i, this.publish()), this._promiseQueue = this._promiseQueue.filter(
          ([u, l]) => u !== s
        );
      }).catch((i) => {
        console.error("Error resolving value:", i), this._promiseQueue = this._promiseQueue.filter(
          ([u, l]) => u !== s
        );
      });
    } else
      this._value = e, this.publish();
  }
  static delay(e) {
    let s;
    return { promise: new Promise((u) => {
      s = setTimeout(u, e);
    }), clear: () => clearTimeout(s) };
  }
};
t(o, "_computeActive", null);
let c = o;
class a {
  static create(e, ...s) {
    return new c(e, ...s);
  }
  static useState(e, ...s) {
    const r = a.create(e, ...s);
    return [
      () => r.value,
      // getter
      (i) => {
        r.value = i;
      },
      (i, u) => r.subscribe(i, u)
    ];
  }
}
export {
  c as Observable,
  a as default
};
