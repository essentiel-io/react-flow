import React, { createContext, useContext, useRef, useReducer, useLayoutEffect, useEffect, useState, memo, useMemo, useCallback, createElement } from 'react';
import _objectSpread$1 from '@babel/runtime/helpers/objectSpread2';
import require$$2 from 'react-dom';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var isArray = Array.isArray;

function cc(obj) {
  var out = "";

  if (typeof obj === "string" || typeof obj === "number") return obj || ""

  if (isArray(obj))
    for (var k = 0, tmp; k < obj.length; k++) {
      if ((tmp = cc(obj[k])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  else
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && obj[k]) out += (out && " ") + k;
    }

  return out
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};

var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */


  function getState() {
    if (isDispatching) {
      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
    }

    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */


  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected the listener to be a function.');
    }

    if (isDispatching) {
      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
    }

    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      if (isDispatching) {
        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
      }

      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;

    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */


  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */


  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[result] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.


  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[result] = observable, _ref2;
}

/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */


  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
  } catch (e) {} // eslint-disable-line no-empty

}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    keys.push.apply(keys, Object.getOwnPropertySymbols(object));
  }

  if (enumerableOnly) keys = keys.filter(function (sym) {
    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
  });
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(void 0, arguments));
    };
  });
}

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */

function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/*
 * This is a dummy function to check if the function name has been altered by minification.
 * If the function has been minified and NODE_ENV !== 'production', warn the user.
 */

function isCrushed() {}

if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
  warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
}

function createThunkMiddleware(extraArgument) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    return function (next) {
      return function (action) {
        if (typeof action === 'function') {
          return action(dispatch, getState, extraArgument);
        }

        return next(action);
      };
    };
  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

function t(t){for(var n=arguments.length,r=Array(n>1?n-1:0),e=1;e<n;e++)r[e-1]=arguments[e];if("production"!==process.env.NODE_ENV){var i=Y[t],o=i?"function"==typeof i?i.apply(null,r):i:"unknown error nr: "+t;throw Error("[Immer] "+o)}throw Error("[Immer] minified error nr: "+t+(r.length?" "+r.map((function(t){return "'"+t+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function n(t){return !!t&&!!t[Q]}function r(t){return !!t&&(function(t){if(!t||"object"!=typeof t)return !1;var n=Object.getPrototypeOf(t);return !n||n===Object.prototype}(t)||Array.isArray(t)||!!t[L]||!!t.constructor[L]||s(t)||v(t))}function e(r){return n(r)||t(23,r),r[Q].t}function i(t,n,r){void 0===r&&(r=!1),0===o(t)?(r?Object.keys:Z)(t).forEach((function(e){r&&"symbol"==typeof e||n(e,t[e],t);})):t.forEach((function(r,e){return n(e,r,t)}));}function o(t){var n=t[Q];return n?n.i>3?n.i-4:n.i:Array.isArray(t)?1:s(t)?2:v(t)?3:0}function u(t,n){return 2===o(t)?t.has(n):Object.prototype.hasOwnProperty.call(t,n)}function a(t,n){return 2===o(t)?t.get(n):t[n]}function f(t,n,r){var e=o(t);2===e?t.set(n,r):3===e?(t.delete(n),t.add(r)):t[n]=r;}function c(t,n){return t===n?0!==t||1/t==1/n:t!=t&&n!=n}function s(t){return X&&t instanceof Map}function v(t){return q&&t instanceof Set}function p(t){return t.o||t.t}function l(t){if(Array.isArray(t))return Array.prototype.slice.call(t);var n=tt(t);delete n[Q];for(var r=Z(n),e=0;e<r.length;e++){var i=r[e],o=n[i];!1===o.writable&&(o.writable=!0,o.configurable=!0),(o.get||o.set)&&(n[i]={configurable:!0,writable:!0,enumerable:o.enumerable,value:t[i]});}return Object.create(Object.getPrototypeOf(t),n)}function d(t,e){return void 0===e&&(e=!1),y(t)||n(t)||!r(t)?t:(o(t)>1&&(t.set=t.add=t.clear=t.delete=h),Object.freeze(t),e&&i(t,(function(t,n){return d(n,!0)}),!0),t)}function h(){t(2);}function y(t){return null==t||"object"!=typeof t||Object.isFrozen(t)}function b(n){var r=nt[n];return r||t(18,n),r}function _(){return "production"===process.env.NODE_ENV||U||t(0),U}function j(t,n){n&&(b("Patches"),t.u=[],t.s=[],t.v=n);}function g(t){w(t),t.p.forEach(S),t.p=null;}function w(t){t===U&&(U=t.l);}function O(t){return U={p:[],l:U,h:t,m:!0,_:0}}function S(t){var n=t[Q];0===n.i||1===n.i?n.j():n.g=!0;}function P(n,e){e._=e.p.length;var i=e.p[0],o=void 0!==n&&n!==i;return e.h.O||b("ES5").S(e,n,o),o?(i[Q].P&&(g(e),t(4)),r(n)&&(n=M(e,n),e.l||x(e,n)),e.u&&b("Patches").M(i[Q],n,e.u,e.s)):n=M(e,i,[]),g(e),e.u&&e.v(e.u,e.s),n!==H?n:void 0}function M(t,n,r){if(y(n))return n;var e=n[Q];if(!e)return i(n,(function(i,o){return A(t,e,n,i,o,r)}),!0),n;if(e.A!==t)return n;if(!e.P)return x(t,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=l(e.k):e.o;i(3===e.i?new Set(o):o,(function(n,i){return A(t,e,o,n,i,r)})),x(t,o,!1),r&&t.u&&b("Patches").R(e,r,t.u,t.s);}return e.o}function A(e,i,o,a,c,s){if("production"!==process.env.NODE_ENV&&c===o&&t(5),n(c)){var v=M(e,c,s&&i&&3!==i.i&&!u(i.D,a)?s.concat(a):void 0);if(f(o,a,v),!n(v))return;e.m=!1;}if(r(c)&&!y(c)){if(!e.h.N&&e._<1)return;M(e,c),i&&i.A.l||x(e,c);}}function x(t,n,r){void 0===r&&(r=!1),t.h.N&&t.m&&d(n,r);}function z(t,n){var r=t[Q];return (r?p(r):t)[n]}function I(t,n){if(n in t)for(var r=Object.getPrototypeOf(t);r;){var e=Object.getOwnPropertyDescriptor(r,n);if(e)return e;r=Object.getPrototypeOf(r);}}function k(t){t.P||(t.P=!0,t.l&&k(t.l));}function E(t){t.o||(t.o=l(t.t));}function R(t,n,r){var e=s(n)?b("MapSet").T(n,r):v(n)?b("MapSet").F(n,r):t.O?function(t,n){var r=Array.isArray(t),e={i:r?1:0,A:n?n.A:_(),P:!1,I:!1,D:{},l:n,t:t,k:null,o:null,j:null,C:!1},i=e,o=rt;r&&(i=[e],o=et);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(n,r):b("ES5").J(n,r);return (r?r.A:_()).p.push(e),e}function D(e){return n(e)||t(22,e),function t(n){if(!r(n))return n;var e,u=n[Q],c=o(n);if(u){if(!u.P&&(u.i<4||!b("ES5").K(u)))return u.t;u.I=!0,e=N(n,c),u.I=!1;}else e=N(n,c);return i(e,(function(n,r){u&&a(u.t,n)===r||f(e,n,t(r));})),3===c?new Set(e):e}(e)}function N(t,n){switch(n){case 2:return new Map(t);case 3:return Array.from(t)}return l(t)}var G,U,W="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),X="undefined"!=typeof Map,q="undefined"!=typeof Set,B="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,H=W?Symbol.for("immer-nothing"):((G={})["immer-nothing"]=!0,G),L=W?Symbol.for("immer-draftable"):"__$immer_draftable",Q=W?Symbol.for("immer-state"):"__$immer_state",Y={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(t){return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+t},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(t){return "Cannot apply patch, path doesn't resolve: "+t},16:'Sets cannot have "replace" patches.',17:function(t){return "Unsupported patch operation: "+t},18:function(t){return "The plugin for '"+t+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+t+"()` when initializing your application."},20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",21:function(t){return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '"+t+"'"},22:function(t){return "'current' expects a draft, got: "+t},23:function(t){return "'original' expects a draft, got: "+t},24:"Patching reserved attributes like __proto__, prototype and constructor is not allowed"},Z="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:Object.getOwnPropertyNames,tt=Object.getOwnPropertyDescriptors||function(t){var n={};return Z(t).forEach((function(r){n[r]=Object.getOwnPropertyDescriptor(t,r);})),n},nt={},rt={get:function(t,n){if(n===Q)return t;var e=p(t);if(!u(e,n))return function(t,n,r){var e,i=I(n,r);return i?"value"in i?i.value:null===(e=i.get)||void 0===e?void 0:e.call(t.k):void 0}(t,e,n);var i=e[n];return t.I||!r(i)?i:i===z(t.t,n)?(E(t),t.o[n]=R(t.A.h,i,t)):i},has:function(t,n){return n in p(t)},ownKeys:function(t){return Reflect.ownKeys(p(t))},set:function(t,n,r){var e=I(p(t),n);if(null==e?void 0:e.set)return e.set.call(t.k,r),!0;if(!t.P){var i=z(p(t),n),o=null==i?void 0:i[Q];if(o&&o.t===r)return t.o[n]=r,t.D[n]=!1,!0;if(c(r,i)&&(void 0!==r||u(t.t,n)))return !0;E(t),k(t);}return t.o[n]=r,t.D[n]=!0,!0},deleteProperty:function(t,n){return void 0!==z(t.t,n)||n in t.t?(t.D[n]=!1,E(t),k(t)):delete t.D[n],t.o&&delete t.o[n],!0},getOwnPropertyDescriptor:function(t,n){var r=p(t),e=Reflect.getOwnPropertyDescriptor(r,n);return e?{writable:!0,configurable:1!==t.i||"length"!==n,enumerable:e.enumerable,value:r[n]}:e},defineProperty:function(){t(11);},getPrototypeOf:function(t){return Object.getPrototypeOf(t.t)},setPrototypeOf:function(){t(12);}},et={};i(rt,(function(t,n){et[t]=function(){return arguments[0]=arguments[0][0],n.apply(this,arguments)};})),et.deleteProperty=function(n,r){return "production"!==process.env.NODE_ENV&&isNaN(parseInt(r))&&t(13),rt.deleteProperty.call(this,n[0],r)},et.set=function(n,r,e){return "production"!==process.env.NODE_ENV&&"length"!==r&&isNaN(parseInt(r))&&t(14),rt.set.call(this,n[0],r,e,n[0])};var it=function(){function e(t){this.O=B,this.N=!0,"boolean"==typeof(null==t?void 0:t.useProxies)&&this.setUseProxies(t.useProxies),"boolean"==typeof(null==t?void 0:t.autoFreeze)&&this.setAutoFreeze(t.autoFreeze),this.produce=this.produce.bind(this),this.produceWithPatches=this.produceWithPatches.bind(this);}var i=e.prototype;return i.produce=function(n,e,i){if("function"==typeof n&&"function"!=typeof e){var o=e;e=n;var u=this;return function(t){var n=this;void 0===t&&(t=o);for(var r=arguments.length,i=Array(r>1?r-1:0),a=1;a<r;a++)i[a-1]=arguments[a];return u.produce(t,(function(t){var r;return (r=e).call.apply(r,[n,t].concat(i))}))}}var a;if("function"!=typeof e&&t(6),void 0!==i&&"function"!=typeof i&&t(7),r(n)){var f=O(this),c=R(this,n,void 0),s=!0;try{a=e(c),s=!1;}finally{s?g(f):w(f);}return "undefined"!=typeof Promise&&a instanceof Promise?a.then((function(t){return j(f,i),P(t,f)}),(function(t){throw g(f),t})):(j(f,i),P(a,f))}if(!n||"object"!=typeof n){if((a=e(n))===H)return;return void 0===a&&(a=n),this.N&&d(a,!0),a}t(21,n);},i.produceWithPatches=function(t,n){var r,e,i=this;return "function"==typeof t?function(n){for(var r=arguments.length,e=Array(r>1?r-1:0),o=1;o<r;o++)e[o-1]=arguments[o];return i.produceWithPatches(n,(function(n){return t.apply(void 0,[n].concat(e))}))}:[this.produce(t,n,(function(t,n){r=t,e=n;})),r,e]},i.createDraft=function(e){r(e)||t(8),n(e)&&(e=D(e));var i=O(this),o=R(this,e,void 0);return o[Q].C=!0,w(i),o},i.finishDraft=function(n,r){var e=n&&n[Q];"production"!==process.env.NODE_ENV&&(e&&e.C||t(9),e.I&&t(10));var i=e.A;return j(i,r),P(void 0,i)},i.setAutoFreeze=function(t){this.N=t;},i.setUseProxies=function(n){n&&!B&&t(20),this.O=n;},i.applyPatches=function(t,r){var e;for(e=r.length-1;e>=0;e--){var i=r[e];if(0===i.path.length&&"replace"===i.op){t=i.value;break}}var o=b("Patches").$;return n(t)?o(t,r):this.produce(t,(function(t){return o(t,r.slice(e+1))}))},e}(),ot=new it;ot.produceWithPatches.bind(ot);ot.setAutoFreeze.bind(ot);ot.setUseProxies.bind(ot);ot.applyPatches.bind(ot);ot.createDraft.bind(ot);ot.finishDraft.bind(ot);

var StoreContext = createContext();

// To get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
// subscription callback always has the selector from the latest render commit
// available, otherwise a store update may happen between render and the effect,
// which may cause missed updates; we also must ensure the store subscription
// is created synchronously, otherwise a store update may occur before the
// subscription is created and an inconsistent state may be observed

var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
function createStoreStateHook(Context) {
  return function useStoreState(mapState, equalityFn) {
    var store = useContext(Context);
    var mapStateRef = useRef(mapState);
    var stateRef = useRef();
    var mountedRef = useRef(true);
    var subscriptionMapStateError = useRef();

    var _useReducer = useReducer(function (s) {
      return s + 1;
    }, 0),
        forceRender = _useReducer[1];

    if (subscriptionMapStateError.current || mapStateRef.current !== mapState || stateRef.current === undefined) {
      try {
        stateRef.current = mapState(store.getState());
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          var errorMessage = "Error in useStoreState: " + err.message + ".";

          if (subscriptionMapStateError.current) {
            errorMessage += "\nMaybe related to:\n" + subscriptionMapStateError.current.stack;
          }

          throw new Error(errorMessage);
        }

        throw subscriptionMapStateError.current || err;
      }
    }

    useIsomorphicLayoutEffect(function () {
      mapStateRef.current = mapState;
      subscriptionMapStateError.current = undefined;
    });
    useIsomorphicLayoutEffect(function () {
      var checkMapState = function checkMapState() {
        try {
          var newState = mapStateRef.current(store.getState());
          var isStateEqual = typeof equalityFn === 'function' ? equalityFn(stateRef.current, newState) : stateRef.current === newState;

          if (isStateEqual) {
            return;
          }

          stateRef.current = newState;
        } catch (err) {
          // see https://github.com/reduxjs/react-redux/issues/1179
          // There is a possibility mapState will fail due to stale state or
          // props, therefore we will just track the error and force our
          // component to update. It should then receive the updated state
          subscriptionMapStateError.current = err;
        }

        if (mountedRef.current) {
          forceRender({});
        }
      };

      var unsubscribe = store.subscribe(checkMapState);
      checkMapState();
      return function () {
        mountedRef.current = false;
        unsubscribe();
      };
    }, []);
    return stateRef.current;
  };
}
var useStoreState = createStoreStateHook(StoreContext);
function createStoreActionsHook(Context) {
  return function useStoreActions(mapActions) {
    var store = useContext(Context);
    return mapActions(store.getActions());
  };
}
var useStoreActions = createStoreActionsHook(StoreContext);
function createStoreDispatchHook(Context) {
  return function useStoreDispatch() {
    var store = useContext(Context);
    return store.dispatch;
  };
}
var useStoreDispatch = createStoreDispatchHook(StoreContext);
function useStore() {
  return useContext(StoreContext);
}
function createStoreRehydratedHook(Context) {
  return function useStoreRehydrated() {
    var store = useContext(Context);

    var _useState = useState(false),
        rehydrated = _useState[0],
        setRehydrated = _useState[1];

    useEffect(function () {
      store.persist.resolveRehydration().then(function () {
        return setRehydrated(true);
      });
    }, []);
    return rehydrated;
  };
}
var useStoreRehydrated = createStoreRehydratedHook(StoreContext);
function createTypedHooks() {
  return {
    useStoreActions: useStoreActions,
    useStoreDispatch: useStoreDispatch,
    useStoreState: useStoreState,
    useStoreRehydrated: useStoreRehydrated,
    useStore: useStore
  };
}

var actionSymbol = '$_a';
var actionOnSymbol = '$_aO';
var computedSymbol = '$_c';
var effectOnSymbol = '$_e';
var persistSymbol = '$_p';
var reducerSymbol = '$_r';
var thunkOnSymbol = '$_tO';
var thunkSymbol = '$_t';
var action = function action(fn) {
  var _ref2;

  return _ref2 = {}, _ref2[actionSymbol] = true, _ref2.fn = fn, _ref2;
};
var defaultStateResolvers = [function (state) {
  return state;
}];
var computed = function computed(fnOrStateResolvers, fn) {
  var _ref4;

  if (typeof fn === 'function') {
    var _ref3;

    return _ref3 = {}, _ref3[computedSymbol] = true, _ref3.fn = fn, _ref3.stateResolvers = fnOrStateResolvers, _ref3;
  }

  return _ref4 = {}, _ref4[computedSymbol] = true, _ref4.fn = fnOrStateResolvers, _ref4.stateResolvers = defaultStateResolvers, _ref4;
};
var thunk$1 = function thunk(fn) {
  var _ref7;

  return _ref7 = {}, _ref7[thunkSymbol] = true, _ref7.fn = fn, _ref7;
};

/**
 * We create our own immer instance to avoid potential issues with autoFreeze
 * becoming default enabled everywhere. We want to disable autofreeze as it
 * does not suit the design of Easy Peasy.
 * https://github.com/immerjs/immer/issues/681#issuecomment-705581111
 */

var easyPeasyImmer;
function isPlainObject$1(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;

  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}
function clone(source) {
  function recursiveClone(current) {
    var next = Object.keys(current).reduce(function (acc, key) {
      if (Object.getOwnPropertyDescriptor(current, key).get == null) {
        acc[key] = current[key];
      }

      return acc;
    }, {});
    Object.keys(next).forEach(function (key) {
      if (isPlainObject$1(next[key])) {
        next[key] = recursiveClone(next[key]);
      }
    });
    return next;
  }

  return recursiveClone(source);
}
function isPromise(x) {
  return x != null && typeof x === 'object' && typeof x.then === 'function';
}
function get(path, target) {
  return path.reduce(function (acc, cur) {
    return isPlainObject$1(acc) ? acc[cur] : undefined;
  }, target);
}
function newify(currentPath, currentState, finalValue) {
  if (currentPath.length === 0) {
    return finalValue;
  }

  var newState = _objectSpread$1({}, currentState);

  var key = currentPath[0];

  if (currentPath.length === 1) {
    newState[key] = finalValue;
  } else {
    newState[key] = newify(currentPath.slice(1), newState[key], finalValue);
  }

  return newState;
}
function set(path, target, value) {
  if (path.length === 0) {
    if (typeof value === 'object') {
      Object.keys(target).forEach(function (key) {
        delete target[key];
      });
      Object.keys(value).forEach(function (key) {
        target[key] = value[key];
      });
    }

    return;
  }

  path.reduce(function (acc, cur, idx) {
    if (idx + 1 === path.length) {
      acc[cur] = value;
    } else {
      acc[cur] = acc[cur] || {};
    }

    return acc[cur];
  }, target);
}
function createSimpleProduce(disableImmer) {
  if (disableImmer === void 0) {
    disableImmer = false;
  }

  return function simpleProduce(path, state, fn) {
    if (disableImmer) {
      var _current = get(path, state);

      var next = fn(_current);

      if (_current !== next) {
        return newify(path, state, next);
      }

      return state;
    }

    if (!easyPeasyImmer) {
      easyPeasyImmer = new it({
        // We need to ensure that we disable proxies if they aren't available
        // on the environment. Users need to ensure that they use the enableES5
        // feature of immer.
        useProxies: typeof Proxy !== 'undefined' && typeof Proxy.revocable !== 'undefined' && typeof Reflect !== 'undefined',
        // Autofreezing breaks easy-peasy, we need a mixed version of immutability
        // and mutability in order to apply updates to our computed properties
        autoFreeze: false
      });
    }

    if (path.length === 0) {
      var _draft = easyPeasyImmer.createDraft(state);

      var _result = fn(_draft);

      if (_result) {
        return n(_result) ? easyPeasyImmer.finishDraft(_result) : _result;
      }

      return easyPeasyImmer.finishDraft(_draft);
    }

    var parentPath = path.slice(0, path.length - 1);
    var draft = easyPeasyImmer.createDraft(state);
    var parent = get(parentPath, state);
    var current = get(path, draft);
    var result = fn(current);

    if (result) {
      parent[path[path.length - 1]] = result;
    }

    return easyPeasyImmer.finishDraft(draft);
  };
}

var pReduce = function pReduce(iterable, reducer, initialValue) {
  return new Promise(function (resolve, reject) {
    var iterator = iterable[Symbol.iterator]();
    var index = 0;

    var next = function next(total) {
      var element = iterator.next();

      if (element.done) {
        resolve(total);
        return;
      }

      Promise.all([total, element.value]).then(function (value) {
        return (// eslint-disable-next-line no-plusplus
          next(reducer(value[0], value[1], index++))
        );
      }).catch(function (err) {
        return reject(err);
      });
    };

    next(initialValue);
  });
};

var pSeries = function pSeries(tasks) {
  var results = [];
  return pReduce(tasks, function (_, task) {
    return task().then(function (value) {
      results.push(value);
    });
  }).then(function () {
    return results;
  });
};
function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }

  for (var i = 0; i < newInputs.length; i += 1) {
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }

  return true;
}
function memoizeOne(resultFn) {
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;
  return function memoized() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (calledOnce && areInputsEqual(args, lastArgs)) {
      return lastResult;
    }

    lastResult = resultFn.apply(void 0, args);
    calledOnce = true;
    lastArgs = args;
    return lastResult;
  };
}

function createReducer(disableImmer, _aRD, _cR, _cP) {
  var simpleProduce = createSimpleProduce(disableImmer);

  var runActionReducerAtPath = function runActionReducerAtPath(state, action, actionReducer, path) {
    return simpleProduce(path, state, function (draft) {
      return actionReducer(draft, action.payload);
    });
  };

  var reducerForActions = function reducerForActions(state, action) {
    var actionReducer = _aRD[action.type];

    if (actionReducer) {
      return runActionReducerAtPath(state, action, actionReducer, actionReducer.def.meta.parent);
    }

    return state;
  };

  var reducerForCustomReducers = function reducerForCustomReducers(state, action) {
    return _cR.reduce(function (acc, _ref) {
      var parentPath = _ref.parentPath,
          key = _ref.key,
          reducer = _ref.reducer;
      return simpleProduce(parentPath, acc, function (draft) {
        draft[key] = reducer(n(draft[key]) ? e(draft[key]) : draft[key], action);
        return draft;
      });
    }, state);
  };

  var rootReducer = function rootReducer(state, action) {
    var stateAfterActions = reducerForActions(state, action);
    var next = _cR.length > 0 ? reducerForCustomReducers(stateAfterActions, action) : stateAfterActions;

    if (state !== next) {
      _cP.forEach(function (_ref2) {
        var parentPath = _ref2.parentPath,
            bindComputedProperty = _ref2.bindComputedProperty;
        var parentState = get(parentPath, next);
        if (parentState != null) bindComputedProperty(parentState, next);
      });
    }

    return next;
  };

  return rootReducer;
}

var noopStorage = {
  getItem: function getItem() {
    return undefined;
  },
  setItem: function setItem() {
    return undefined;
  },
  removeItem: function removeItem() {
    return undefined;
  }
};

var getBrowerStorage = function getBrowerStorage(storageName) {
  var storageCache;
  return function () {
    if (!storageCache) {
      try {
        if (typeof window !== 'undefined' && typeof window[storageName] !== 'undefined') {
          storageCache = window[storageName];
        }
      } catch (_) {// swallow the failure
      }

      if (!storageCache) {
        storageCache = noopStorage;
      }
    }

    return storageCache;
  };
};

var localStorage = getBrowerStorage('localStorage');
var sessionStorage = getBrowerStorage('sessionStorage');

function createStorageWrapper(storage, transformers) {
  if (transformers === void 0) {
    transformers = [];
  }

  if (storage == null) {
    storage = sessionStorage();
  }

  if (typeof storage === 'string') {
    if (storage === 'localStorage') {
      storage = localStorage();
    } else if (storage === 'sessionStorage') {
      storage = sessionStorage();
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Invalid storage provider");
      }

      storage = noopStorage;
    }
  }

  var outTransformers = [].concat(transformers).reverse();

  var serialize = function serialize(data) {
    if (transformers.length > 0 && data != null && typeof data === 'object') {
      Object.keys(data).forEach(function (key) {
        data[key] = transformers.reduce(function (acc, cur) {
          return cur.in(acc, key);
        }, data[key]);
      });
    }

    return storage === localStorage() || storage === sessionStorage() ? JSON.stringify({
      data: data
    }) : data;
  };

  var deserialize = function deserialize(data) {
    var result = storage === localStorage() || storage === sessionStorage() ? JSON.parse(data).data : data;

    if (outTransformers.length > 0 && result != null && typeof result === 'object') {
      Object.keys(result).forEach(function (key) {
        result[key] = outTransformers.reduce(function (acc, cur) {
          return cur.out(acc, key);
        }, result[key]);
      });
    }

    return result;
  };

  var isAsync = isPromise(storage.getItem('_'));
  return {
    getItem: function getItem(key) {
      if (isAsync) {
        return storage.getItem(key).then(function (wrapped) {
          return wrapped != null ? deserialize(wrapped) : undefined;
        });
      }

      var wrapped = storage.getItem(key);
      return wrapped != null ? deserialize(wrapped) : undefined;
    },
    setItem: function setItem(key, data) {
      return storage.setItem(key, serialize(data));
    },
    removeItem: function removeItem(key) {
      return storage.removeItem(key);
    }
  };
}

function extractPersistConfig(path, persistdef) {
  if (persistdef === void 0) {
    persistdef = {};
  }

  return {
    path: path,
    config: {
      allow: persistdef.allow || [],
      deny: persistdef.deny || [],
      mergeStrategy: persistdef.mergeStrategy || 'mergeDeep',
      storage: createStorageWrapper(persistdef.storage, persistdef.transformers)
    }
  };
}

function resolvePersistTargets(target, allow, deny) {
  var targets = Object.keys(target);

  if (allow.length > 0) {
    targets = targets.reduce(function (acc, cur) {
      if (allow.findIndex(function (x) {
        return x === cur;
      }) !== -1) {
        return [].concat(acc, [cur]);
      }

      return acc;
    }, []);
  }

  if (deny.length > 0) {
    targets = targets.reduce(function (acc, cur) {
      if (deny.findIndex(function (x) {
        return x === cur;
      }) !== -1) {
        return acc;
      }

      return [].concat(acc, [cur]);
    }, []);
  }

  return targets;
}

function createPersistenceClearer(persistKey, _r) {
  return function () {
    if (_r._i._persistenceConfig.length === 0) {
      return Promise.resolve();
    }

    return pSeries(_r._i._persistenceConfig.map(function (_ref) {
      var path = _ref.path,
          config = _ref.config;
      return function () {
        return Promise.resolve(config.storage.removeItem(persistKey(path)));
      };
    }));
  };
}

function createPersistor(persistKey, _r) {
  var persistPromise = Promise.resolve();
  var isPersisting = false;
  var nextPersistOperation;
  var timingMethod = typeof window === 'undefined' ? function (fn) {
    return fn();
  } : window.requestIdleCallback != null ? window.requestIdleCallback : window.requestAnimationFrame;

  var persist = function persist(nextState) {
    if (_r._i._persistenceConfig.length === 0) {
      return;
    }

    var operation = function operation() {
      isPersisting = true;
      persistPromise = new Promise(function (resolve) {
        timingMethod(function () {
          pSeries(_r._i._persistenceConfig.map(function (_ref2) {
            var path = _ref2.path,
                config = _ref2.config;
            return function () {
              var storage = config.storage,
                  allow = config.allow,
                  deny = config.deny;
              var persistRootState = clone(get(path, nextState));
              var persistTargets = resolvePersistTargets(persistRootState, allow, deny);
              var stateToPersist = {};
              persistTargets.map(function (key) {
                var targetPath = [].concat(path, [key]);
                var rawValue = get(targetPath, nextState);
                var value = isPlainObject$1(rawValue) ? clone(rawValue) : rawValue;
                stateToPersist[key] = value;
              });
              return Promise.resolve(storage.setItem(persistKey(path), stateToPersist));
            };
          })).finally(function () {
            isPersisting = false;

            if (nextPersistOperation) {
              var next = nextPersistOperation;
              nextPersistOperation = null;
              next();
            } else {
              resolve();
            }
          });
        });
      });
    };

    if (isPersisting) {
      nextPersistOperation = operation;
    } else {
      operation();
    }
  };

  return {
    persist: persist,
    clear: createPersistenceClearer(persistKey, _r),
    flush: function flush() {
      if (nextPersistOperation) {
        nextPersistOperation();
      }

      return persistPromise;
    }
  };
}
function createPersistMiddleware(persistor, _r) {
  return function (_ref3) {
    var getState = _ref3.getState;
    return function (next) {
      return function (action) {
        var state = next(action);

        if (action && action.type !== '@action.ePRS' && _r._i._persistenceConfig.length > 0) {
          persistor.persist(getState());
        }

        return state;
      };
    };
  };
}
function rehydrateStateFromPersistIfNeeded(persistKey, replaceState, _r, root) {
  if (_r._i._persistenceConfig.length === 0) {
    return Promise.resolve();
  }

  var state = clone(_r._i._dS);
  var rehydrating = false;
  return pSeries(_r._i._persistenceConfig.map(function (persistInstance) {
    return function () {
      var path = persistInstance.path,
          config = persistInstance.config;
      var mergeStrategy = config.mergeStrategy,
          storage = config.storage;

      if (root && (path.length < 1 || path[0] !== root)) {
        return Promise.resolve();
      }

      var hasDataModelChanged = function hasDataModelChanged(dataModel, rehydratingModelData) {
        return dataModel != null && rehydratingModelData != null && (typeof dataModel !== typeof rehydratingModelData || Array.isArray(dataModel) && !Array.isArray(rehydratingModelData));
      };

      var applyRehydrationStrategy = function applyRehydrationStrategy(persistedState) {
        if (mergeStrategy === 'overwrite') {
          set(path, state, persistedState);
        } else if (mergeStrategy === 'mergeShallow') {
          var targetState = get(path, state);
          Object.keys(persistedState).forEach(function (key) {
            if (hasDataModelChanged(targetState[key], persistedState[key])) ; else {
              targetState[key] = persistedState[key];
            }
          });
        } else if (mergeStrategy === 'mergeDeep') {
          var _targetState = get(path, state);

          var setAt = function setAt(currentTargetState, currentPersistedState) {
            Object.keys(currentPersistedState).forEach(function (key) {
              if (hasDataModelChanged(currentTargetState[key], currentPersistedState[key])) ; else if (isPlainObject$1(currentPersistedState[key])) {
                currentTargetState[key] = currentTargetState[key] || {};
                setAt(currentTargetState[key], currentPersistedState[key]);
              } else {
                currentTargetState[key] = currentPersistedState[key];
              }
            });
          };

          setAt(_targetState, persistedState);
        }
      };

      var rehydate = function rehydate(persistedState) {
        if (persistedState != null) {
          applyRehydrationStrategy(persistedState);
          rehydrating = true;
        }
      };

      var getItemResult = storage.getItem(persistKey(path));

      if (isPromise(getItemResult)) {
        return getItemResult.then(rehydate);
      }

      return Promise.resolve(rehydate(getItemResult));
    };
  })).then(function () {
    if (rehydrating) {
      replaceState(state);
    }
  });
}

function createActionCreator(def, _r) {
  function actionCreator(payload) {
    var action = {
      type: def.meta.type,
      payload: payload
    };

    if (def[actionOnSymbol] && def.meta.resolvedTargets) {
      payload.resolvedTargets = [].concat(def.meta.resolvedTargets);
    }

    return _r.dispatch(action);
  } // We bind the types to the creator for easy reference by consumers


  actionCreator.type = def.meta.type;
  return actionCreator;
}

function createThunkHandler(def, _r, injections, _aC) {
  return function (payload, fail) {
    var helpers = {
      dispatch: _r.dispatch,
      fail: fail,
      getState: function getState() {
        return get(def.meta.parent, _r.getState());
      },
      getStoreActions: function getStoreActions() {
        return _aC;
      },
      getStoreState: _r.getState,
      injections: injections,
      meta: {
        key: def.meta.actionName,
        parent: def.meta.parent,
        path: def.meta.path
      }
    };

    if (def[thunkOnSymbol] && def.meta.resolvedTargets) {
      payload.resolvedTargets = [].concat(def.meta.resolvedTargets);
    }

    return def.fn(get(def.meta.parent, _aC), payload, helpers);
  };
}

var logThunkEventListenerError = function logThunkEventListenerError(type, err) {
  // eslint-disable-next-line no-console
  console.log("Error in " + type); // eslint-disable-next-line no-console

  console.log(err);
};

var handleEventDispatchErrors = function handleEventDispatchErrors(type, dispatcher) {
  return function () {
    try {
      var result = dispatcher.apply(void 0, arguments);

      if (isPromise(result)) {
        result.catch(function (err) {
          logThunkEventListenerError(type, err);
        });
      }
    } catch (err) {
      logThunkEventListenerError(type, err);
    }
  };
};

function createThunkActionsCreator(def, _r) {
  var actionCreator = function actionCreator(payload) {
    var dispatchStart = handleEventDispatchErrors(def.meta.startType, function () {
      return _r.dispatch({
        type: def.meta.startType,
        payload: payload
      });
    });
    var dispatchFail = handleEventDispatchErrors(def.meta.failType, function (err) {
      return _r.dispatch({
        type: def.meta.failType,
        payload: payload,
        error: err
      });
    });
    var dispatchSuccess = handleEventDispatchErrors(def.meta.successType, function (result) {
      return _r.dispatch({
        type: def.meta.successType,
        payload: payload,
        result: result
      });
    });
    dispatchStart();
    var failure = null;

    var fail = function fail(_failure) {
      failure = _failure;
    };

    var result = _r.dispatch(function () {
      return def.thunkHandler(payload, fail);
    });

    if (isPromise(result)) {
      return result.then(function (resolved) {
        if (failure) {
          dispatchFail(failure);
        } else {
          dispatchSuccess(resolved);
        }

        return resolved;
      });
    }

    if (failure) {
      dispatchFail(failure);
    } else {
      dispatchSuccess(result);
    }

    return result;
  };

  actionCreator.type = def.meta.type;
  actionCreator.successType = def.meta.successType;
  actionCreator.failType = def.meta.failType;
  actionCreator.startType = def.meta.startType;
  return actionCreator;
}

function createListenerMiddleware(_r) {
  return function () {
    return function (next) {
      return function (action) {
        var result = next(action);

        if (action && _r._i._lAM[action.type] && _r._i._lAM[action.type].length > 0) {
          var sourceAction = _r._i._aCD[action.type];

          _r._i._lAM[action.type].forEach(function (actionCreator) {
            actionCreator({
              type: sourceAction ? sourceAction.def.meta.type : action.type,
              payload: action.payload,
              error: action.error,
              result: action.result
            });
          });
        }

        return result;
      };
    };
  };
}
function bindListenerdefs(listenerdefs, _aC, _aCD, _lAM) {
  listenerdefs.forEach(function (def) {
    var targets = def.targetResolver(get(def.meta.parent, _aC), _aC);
    var targetTypes = (Array.isArray(targets) ? targets : [targets]).reduce(function (acc, target) {
      if (typeof target === 'function' && target.def.meta.type && _aCD[target.def.meta.type]) {
        if (target.def.meta.successType) {
          acc.push(target.def.meta.successType);
        } else {
          acc.push(target.def.meta.type);
        }
      } else if (typeof target === 'string') {
        acc.push(target);
      }

      return acc;
    }, []);
    def.meta.resolvedTargets = targetTypes;
    targetTypes.forEach(function (targetType) {
      var listenerReg = _lAM[targetType] || [];
      listenerReg.push(_aCD[def.meta.type]);
      _lAM[targetType] = listenerReg;
    });
  });
}

function createComputedPropertyBinder(parentPath, key, def, _r) {
  var memoisedResultFn = memoizeOne(def.fn);
  return function createComputedProperty(parentState, storeState) {
    Object.defineProperty(parentState, key, {
      configurable: true,
      enumerable: true,
      get: function get$1() {
        if (_r._i._cS.isInReducer) {
          // We don't want computed properties resolved every time an action
          // is handled by the reducer. They need to remain lazy, only being
          // computed when used by a component or getState call.
          return undefined;
        }

        var state = get(parentPath, storeState);

        var inputs = def.stateResolvers.map(function (resolver) {
          return resolver(state, storeState);
        });
        return memoisedResultFn.apply(void 0, inputs);
      }
    });
  };
}
function createComputedPropertiesMiddleware(_r) {
  return function () {
    return function (next) {
      return function (action) {
        _r._i._cS.isInReducer = true;
        var result = next(action);
        _r._i._cS.isInReducer = false;
        return result;
      };
    };
  };
}

function createEffectsMiddleware(_r) {
  return function (store) {
    return function (next) {
      return function (action) {
        if (_r._i._e.length === 0) {
          return next(action);
        }

        var prevState = store.getState();
        var result = next(action);
        var nextState = store.getState();

        _r._i._e.forEach(function (def) {
          var prevLocal = get(def.meta.parent, prevState);
          var nextLocal = get(def.meta.parent, nextState);

          if (prevLocal !== nextLocal) {
            var prevDependencies = def.dependencyResolvers.map(function (resolver) {
              return resolver(prevLocal);
            });
            var nextDependencies = def.dependencyResolvers.map(function (resolver) {
              return resolver(nextLocal);
            });
            var hasChanged = prevDependencies.some(function (dependency, idx) {
              return dependency !== nextDependencies[idx];
            });

            if (hasChanged) {
              def.actionCreator(prevDependencies, nextDependencies, action);
            }
          }
        });

        return result;
      };
    };
  };
}

var logEffectError = function logEffectError(err) {
  // As users can't get a handle on effects we need to report the error
  // eslint-disable-next-line no-console
  console.log(err);
};

function createEffectHandler(def, _r, injections, _aC) {
  var actions = get(def.meta.parent, _aC);
  var dispose;
  return function (change) {
    var helpers = {
      dispatch: _r.dispatch,
      getState: function getState() {
        return get(def.meta.parent, _r.getState());
      },
      getStoreActions: function getStoreActions() {
        return _aC;
      },
      getStoreState: _r.getState,
      injections: injections,
      meta: {
        key: def.meta.actionName,
        parent: def.meta.parent,
        path: def.meta.path
      }
    };

    if (dispose !== undefined) {
      var disposeResult = dispose();
      dispose = undefined;

      if (isPromise(disposeResult)) {
        disposeResult.catch(logEffectError);
      }
    }

    var effectResult = def.fn(actions, change, helpers);

    if (isPromise(effectResult)) {
      return effectResult.then(function (resolved) {
        if (typeof resolved === 'function') {
          if (process.env.NODE_ENV !== 'production') {
            // Dispose functions are not allowed to be resolved asynchronously.
            // Doing so would provide inconsistent behaviour around their execution.
            // eslint-disable-next-line no-console
            console.warn('[easy-peasy] Effect is asynchronously resolving a dispose fn.');
          }
        }
      });
    }

    if (typeof effectResult === 'function') {
      dispose = effectResult;
    }

    return undefined;
  };
}

var logEffectEventListenerError = function logEffectEventListenerError(type, err) {
  // eslint-disable-next-line no-console
  console.log("Error in " + type); // eslint-disable-next-line no-console

  console.log(err);
};

var handleEventDispatchErrors$1 = function handleEventDispatchErrors(type, dispatcher) {
  return function () {
    try {
      var result = dispatcher.apply(void 0, arguments);

      if (isPromise(result)) {
        result.catch(function (err) {
          logEffectEventListenerError(type, err);
        });
      }
    } catch (err) {
      logEffectEventListenerError(type, err);
    }
  };
};

function createEffectActionsCreator(def, _r, effectHandler) {
  var actionCreator = function actionCreator(previousDependencies, nextDependencies, action) {
    var change = {
      prev: previousDependencies,
      current: nextDependencies,
      action: action
    };
    var dispatchStart = handleEventDispatchErrors$1(def.meta.startType, function () {
      return _r.dispatch({
        type: def.meta.startType,
        change: change
      });
    });
    var dispatchSuccess = handleEventDispatchErrors$1(def.meta.successType, function () {
      return _r.dispatch({
        type: def.meta.successType,
        change: change
      });
    });
    dispatchStart();

    try {
      var result = _r.dispatch(function () {
        return effectHandler(change);
      });

      if (isPromise(result)) {
        return result.then(function (resolved) {
          dispatchSuccess(resolved);
          return resolved;
        }, logEffectError);
      }

      dispatchSuccess(result);
      return result;
    } catch (err) {
      logEffectError(err);
    }
  };

  actionCreator.type = def.meta.type;
  actionCreator.startType = def.meta.startType;
  actionCreator.successType = def.meta.successType;
  actionCreator.failType = def.meta.failType;
  return actionCreator;
}

function extractDataFromModel(model, initialState, injections, _r) {
  var _dS = initialState;
  var _aCD = {};
  var _aC = {};
  var _aRD = {};
  var actionThunks = {};
  var _cP = [];
  var _cR = [];
  var _e = [];
  var _lAC = {};
  var _lAM = {};
  var listenerdefs = [];
  var _persistenceConfig = [];
  var _cS = {
    isInReducer: false
  };

  var recursiveExtractFromModel = function recursiveExtractFromModel(current, parentPath) {
    return Object.keys(current).forEach(function (key) {
      var value = current[key];
      var path = [].concat(parentPath, [key]);
      var meta = {
        parent: parentPath,
        path: path,
        key: key
      };

      var handleValueAsState = function handleValueAsState() {
        var initialParentRef = get(parentPath, initialState);

        if (initialParentRef && key in initialParentRef) {
          set(path, _dS, initialParentRef[key]);
        } else {
          set(path, _dS, value);
        }
      };

      if (key === persistSymbol) {
        _persistenceConfig.push(extractPersistConfig(parentPath, value));

        return;
      }

      if (value != null && typeof value === 'object') {
        if (value[actionSymbol] || value[actionOnSymbol]) {
          var def = _objectSpread$1({}, value); // Determine the category of the action


          var category = def[actionSymbol] ? '@action' : '@actionOn'; // Establish the meta data describing the action

          def.meta = {
            actionName: meta.key,
            category: category,
            type: category + "." + meta.path.join('.'),
            parent: meta.parent,
            path: meta.path
          }; // Create the "action creator" function

          def.actionCreator = createActionCreator(def, _r); // Create a bidirectional relationship of the def/actionCreator

          def.actionCreator.def = def; // Create a bidirectional relationship of the def/reducer

          def.fn.def = def; // Add the action creator to lookup map

          _aCD[def.meta.type] = def.actionCreator; // Add the reducer to lookup map

          _aRD[def.meta.type] = def.fn; // We don't want to expose the internal action to consumers

          if (meta.key !== 'ePRS') {
            // Set the action creator in the "actions" object tree for
            // either the listeners object tree, or the standard actions/thunks
            // object tree
            if (def[actionOnSymbol]) {
              listenerdefs.push(def);
              set(path, _lAC, def.actionCreator);
            } else {
              set(path, _aC, def.actionCreator);
            }
          }
        } else if (value[thunkSymbol] || value[thunkOnSymbol]) {
          var _def = _objectSpread$1({}, value); // Determine the category of the thunk


          var _category = _def[thunkSymbol] ? '@thunk' : '@thunkOn'; // Establish the meta data describing the thunk


          var type = _category + "." + meta.path.join('.');
          _def.meta = {
            actionName: meta.key,
            parent: meta.parent,
            path: meta.path,
            type: type,
            startType: type + "(start)",
            successType: type + "(success)",
            failType: type + "(fail)"
          }; // Create the function that will handle, i.e. be executed, when
          // the thunk action is created/dispatched

          _def.thunkHandler = createThunkHandler(_def, _r, injections, _aC); // Register the thunk handler

          set(path, actionThunks, _def.thunkHandler); // Create the "action creator" function

          _def.actionCreator = createThunkActionsCreator(_def, _r); // Create a bidirectional relationship of the def/actionCreator

          _def.actionCreator.def = _def; // Register the action creator within the lookup map

          _aCD[_def.meta.type] = _def.actionCreator; // Set the action creator in the "actions" object tree for
          // either the listeners object tree, or the standard actions/thunks
          // object tree

          if (_def[thunkOnSymbol]) {
            listenerdefs.push(_def);
            set(path, _lAC, _def.actionCreator);
          } else {
            set(path, _aC, _def.actionCreator);
          }
        } else if (value[computedSymbol]) {
          var parent = get(parentPath, _dS);
          var bindComputedProperty = createComputedPropertyBinder(parentPath, key, value, _r);
          bindComputedProperty(parent, _dS);

          _cP.push({
            key: key,
            parentPath: parentPath,
            bindComputedProperty: bindComputedProperty
          });
        } else if (value[reducerSymbol]) {
          _cR.push({
            key: key,
            parentPath: parentPath,
            reducer: value.fn
          });
        } else if (value[effectOnSymbol]) {
          var _def2 = _objectSpread$1({}, value); // Establish the meta data describing the effect


          var _type = "@effectOn." + meta.path.join('.');

          _def2.meta = {
            type: _type,
            actionName: meta.key,
            parent: meta.parent,
            path: meta.path,
            startType: _type + "(start)",
            successType: _type + "(success)",
            failType: _type + "(fail)"
          };
          var effectHandler = createEffectHandler(_def2, _r, injections, _aC);
          var actionCreator = createEffectActionsCreator(_def2, _r, effectHandler);
          _def2.actionCreator = actionCreator;

          _e.push(_def2);
        } else if (isPlainObject$1(value)) {
          var existing = get(path, _dS);

          if (existing == null) {
            set(path, _dS, {});
          }

          recursiveExtractFromModel(value, path);
        } else {
          handleValueAsState();
        }
      } else {
        handleValueAsState();
      }
    });
  };

  _persistenceConfig = _persistenceConfig.sort(function (a, b) {
    var aPath = a.path.join('.');
    var bPath = b.path.join('.');

    if (aPath < bPath) {
      return -1;
    }

    if (aPath > bPath) {
      return 1;
    }

    return 0;
  });
  recursiveExtractFromModel(model, []);
  bindListenerdefs(listenerdefs, _aC, _aCD, _lAM);
  return {
    _aCD: _aCD,
    _aC: _aC,
    _aRD: _aRD,
    _cP: _cP,
    _cR: _cR,
    _cS: _cS,
    _dS: _dS,
    _e: _e,
    _lAC: _lAC,
    _lAM: _lAM,
    _persistenceConfig: _persistenceConfig
  };
}

function createStore$1(model, options) {
  if (options === void 0) {
    options = {};
  }

  var modelClone = clone(model);
  var _options = options,
      compose$1 = _options.compose,
      _options$devTools = _options.devTools,
      devTools = _options$devTools === void 0 ? process.env.NODE_ENV !== 'production' : _options$devTools,
      _options$disableImmer = _options.disableImmer,
      disableImmer = _options$disableImmer === void 0 ? false : _options$disableImmer,
      _options$enhancers = _options.enhancers,
      enhancers = _options$enhancers === void 0 ? [] : _options$enhancers,
      _options$initialState = _options.initialState,
      initialState = _options$initialState === void 0 ? {} : _options$initialState,
      _options$injections = _options.injections,
      injections = _options$injections === void 0 ? {} : _options$injections,
      _options$middleware = _options.middleware,
      middleware = _options$middleware === void 0 ? [] : _options$middleware,
      _options$mockActions = _options.mockActions,
      mockActions = _options$mockActions === void 0 ? false : _options$mockActions,
      _options$name = _options.name,
      storeName = _options$name === void 0 ? "EasyPeasyStore" : _options$name,
      _options$version = _options.version,
      version = _options$version === void 0 ? 0 : _options$version,
      _options$reducerEnhan = _options.reducerEnhancer,
      reducerEnhancer = _options$reducerEnhan === void 0 ? function (rootReducer) {
    return rootReducer;
  } : _options$reducerEnhan;

  var bindReplaceState = function bindReplaceState(modelDef) {
    return _objectSpread$1(_objectSpread$1({}, modelDef), {}, {
      ePRS: action(function (_, payload) {
        return payload;
      })
    });
  };

  var _r = {};
  var modeldef = bindReplaceState(modelClone);
  var mockedActions = [];

  var persistKey = function persistKey(targetPath) {
    return "[" + storeName + "][" + version + "]" + (targetPath.length > 0 ? "[" + targetPath.join('.') + "]" : '');
  };

  var persistor = createPersistor(persistKey, _r);
  var persistMiddleware = createPersistMiddleware(persistor, _r);

  var replaceState = function replaceState(nextState) {
    return _r._i._aCD['@action.ePRS'](nextState);
  };

  var bindStoreInternals = function bindStoreInternals(state) {
    if (state === void 0) {
      state = {};
    }

    var data = extractDataFromModel(modeldef, state, injections, _r);
    _r._i = _objectSpread$1(_objectSpread$1({}, data), {}, {
      reducer: reducerEnhancer(createReducer(disableImmer, data._aRD, data._cR, data._cP))
    });
  };

  var mockActionsMiddleware = function mockActionsMiddleware() {
    return function () {
      return function (action) {
        if (action != null) {
          mockedActions.push(action);
        }

        return undefined;
      };
    };
  };

  var composeEnhancers = compose$1 || (devTools && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    name: storeName
  }) : compose);
  bindStoreInternals(initialState);
  var easyPeasyMiddleware = [createComputedPropertiesMiddleware(_r)].concat(middleware, [thunk, createListenerMiddleware(_r), createEffectsMiddleware(_r), persistMiddleware]);

  if (mockActions) {
    easyPeasyMiddleware.push(mockActionsMiddleware);
  }

  var store = createStore(_r._i.reducer, _r._i._dS, composeEnhancers.apply(void 0, [applyMiddleware.apply(void 0, easyPeasyMiddleware)].concat(enhancers)));
  store.subscribe(function () {
    _r._i._cS.isInReducer = false;
  });
  _r.dispatch = store.dispatch;
  _r.getState = store.getState;

  var bindActionCreators = function bindActionCreators() {
    Object.keys(store.dispatch).forEach(function (actionsKey) {
      delete store.dispatch[actionsKey];
    });
    Object.keys(_r._i._aC).forEach(function (key) {
      store.dispatch[key] = _r._i._aC[key];
    });
  };

  bindActionCreators();

  var rebindStore = function rebindStore(removeKey) {
    var currentState = store.getState();

    if (removeKey) {
      delete currentState[removeKey];
    }

    bindStoreInternals(currentState);
    store.replaceReducer(_r._i.reducer);
    replaceState(_r._i._dS);
    bindActionCreators();
  };

  var _resolveRehydration = rehydrateStateFromPersistIfNeeded(persistKey, replaceState, _r);

  return Object.assign(store, {
    addModel: function addModel(key, modelForKey) {
      if (modeldef[key] && process.env.NODE_ENV !== 'production') {
        store.removeModel(key);
      }

      modeldef[key] = modelForKey;
      rebindStore(); // There may have been persisted state for a dynamic model. We should try
      // and rehydrate the specifc node

      var addModelRehydration = rehydrateStateFromPersistIfNeeded(persistKey, replaceState, _r, key);
      return {
        resolveRehydration: function resolveRehydration() {
          return addModelRehydration;
        }
      };
    },
    clearMockedActions: function clearMockedActions() {
      mockedActions = [];
    },
    getActions: function getActions() {
      return _r._i._aC;
    },
    getListeners: function getListeners() {
      return _r._i._lAC;
    },
    getMockedActions: function getMockedActions() {
      return [].concat(mockedActions);
    },
    persist: {
      clear: persistor.clear,
      flush: persistor.flush,
      resolveRehydration: function resolveRehydration() {
        return _resolveRehydration;
      }
    },
    reconfigure: function reconfigure(newModel) {
      modeldef = bindReplaceState(newModel);
      rebindStore();
    },
    removeModel: function removeModel(key) {
      if (!modeldef[key]) {
        return;
      }

      delete modeldef[key];
      rebindStore(key);
    }
  });
}

/* eslint-disable react/prop-types */
function StoreProvider(_ref) {
  var children = _ref.children,
      store = _ref.store;
  return /*#__PURE__*/React.createElement(StoreContext.Provider, {
    value: store
  }, children);
}

var typedHooks = createTypedHooks();
var useStoreActions$1 = typedHooks.useStoreActions;
var useStoreDispatch$1 = typedHooks.useStoreDispatch;
var useStoreState$1 = typedHooks.useStoreState;
var useStore$1 = typedHooks.useStore;

var isInputDOMNode = function (e) {
    var target = e === null || e === void 0 ? void 0 : e.target;
    return (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target === null || target === void 0 ? void 0 : target.nodeName) || (target === null || target === void 0 ? void 0 : target.hasAttribute('contenteditable')));
};
var getDimensions = function (node) { return ({
    width: node.offsetWidth,
    height: node.offsetHeight,
}); };
var clamp = function (val, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return Math.min(Math.max(val, min), max);
};
var clampPosition = function (position, extent) { return ({
    x: clamp(position.x, extent[0][0], extent[1][0]),
    y: clamp(position.y, extent[0][1], extent[1][1]),
}); };

var useKeyPress = (function (keyCode) {
    var _a = useState(false), keyPressed = _a[0], setKeyPressed = _a[1];
    useEffect(function () {
        if (typeof keyCode !== 'undefined') {
            var downHandler_1 = function (event) {
                if (!isInputDOMNode(event) && (event.key === keyCode || event.keyCode === keyCode)) {
                    event.preventDefault();
                    setKeyPressed(true);
                }
            };
            var upHandler_1 = function (event) {
                if (!isInputDOMNode(event) && (event.key === keyCode || event.keyCode === keyCode)) {
                    setKeyPressed(false);
                }
            };
            var resetHandler_1 = function () { return setKeyPressed(false); };
            window.addEventListener('keydown', downHandler_1);
            window.addEventListener('keyup', upHandler_1);
            window.addEventListener('blur', resetHandler_1);
            return function () {
                window.removeEventListener('keydown', downHandler_1);
                window.removeEventListener('keyup', upHandler_1);
                window.removeEventListener('blur', resetHandler_1);
            };
        }
    }, [keyCode, setKeyPressed]);
    return keyPressed;
});

var isEdge = function (element) {
    return 'id' in element && 'source' in element && 'target' in element;
};
var isNode = function (element) {
    return 'id' in element && !('source' in element) && !('target' in element);
};
var getOutgoers = function (node, elements) {
    if (!isNode(node)) {
        return [];
    }
    var outgoerIds = elements.filter(function (e) { return isEdge(e) && e.source === node.id; }).map(function (e) { return e.target; });
    return elements.filter(function (e) { return outgoerIds.includes(e.id); });
};
var getIncomers = function (node, elements) {
    if (!isNode(node)) {
        return [];
    }
    var incomersIds = elements.filter(function (e) { return isEdge(e) && e.target === node.id; }).map(function (e) { return e.source; });
    return elements.filter(function (e) { return incomersIds.includes(e.id); });
};
var removeElements = function (elementsToRemove, elements) {
    var nodeIdsToRemove = elementsToRemove.map(function (n) { return n.id; });
    return elements.filter(function (element) {
        var edgeElement = element;
        return !(nodeIdsToRemove.includes(element.id) ||
            nodeIdsToRemove.includes(edgeElement.target) ||
            nodeIdsToRemove.includes(edgeElement.source));
    });
};
var getEdgeId = function (_a) {
    var source = _a.source, sourceHandle = _a.sourceHandle, target = _a.target, targetHandle = _a.targetHandle;
    return "reactflow__edge-" + source + sourceHandle + "-" + target + targetHandle;
};
var connectionExists = function (edge, elements) {
    return elements.some(function (el) {
        return isEdge(el) &&
            el.source === edge.source &&
            el.target === edge.target &&
            (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
            (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle));
    });
};
var addEdge = function (edgeParams, elements) {
    if (!edgeParams.source || !edgeParams.target) {
        console.warn("Can't create edge. An edge needs a source and a target.");
        return elements;
    }
    var edge;
    if (isEdge(edgeParams)) {
        edge = __assign({}, edgeParams);
    }
    else {
        edge = __assign(__assign({}, edgeParams), { id: getEdgeId(edgeParams) });
    }
    if (connectionExists(edge, elements)) {
        return elements;
    }
    return elements.concat(edge);
};
var updateEdge = function (oldEdge, newConnection, elements) {
    if (!newConnection.source || !newConnection.target) {
        console.warn("Can't create new edge. An edge needs a source and a target.");
        return elements;
    }
    var foundEdge = elements.find(function (e) { return isEdge(e) && e.id === oldEdge.id; });
    if (!foundEdge) {
        console.warn("The old edge with id=" + oldEdge.id + " does not exist.");
        return elements;
    }
    // Remove old edge and create the new edge with parameters of old edge.
    var edge = __assign(__assign({}, oldEdge), { id: getEdgeId(newConnection), source: newConnection.source, target: newConnection.target, sourceHandle: newConnection.sourceHandle, targetHandle: newConnection.targetHandle });
    return elements.filter(function (e) { return e.id !== oldEdge.id; }).concat(edge);
};
var pointToRendererPoint = function (_a, _b, snapToGrid, _c) {
    var x = _a.x, y = _a.y;
    var tx = _b[0], ty = _b[1], tScale = _b[2];
    var snapX = _c[0], snapY = _c[1];
    var position = {
        x: (x - tx) / tScale,
        y: (y - ty) / tScale,
    };
    if (snapToGrid) {
        return {
            x: snapX * Math.round(position.x / snapX),
            y: snapY * Math.round(position.y / snapY),
        };
    }
    return position;
};
var onLoadProject = function (currentStore) {
    return function (position) {
        var _a = currentStore.getState(), transform = _a.transform, snapToGrid = _a.snapToGrid, snapGrid = _a.snapGrid;
        return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
    };
};
var parseElement = function (element, nodeExtent) {
    if (!element.id) {
        throw new Error('All nodes and edges need to have an id.');
    }
    if (isEdge(element)) {
        return __assign(__assign({}, element), { source: element.source.toString(), target: element.target.toString(), sourceHandle: element.sourceHandle ? element.sourceHandle.toString() : null, targetHandle: element.targetHandle ? element.targetHandle.toString() : null, id: element.id.toString(), type: element.type || 'default' });
    }
    return __assign(__assign({}, element), { id: element.id.toString(), type: element.type || 'default', __rf: {
            position: clampPosition(element.position, nodeExtent),
            width: null,
            height: null,
            handleBounds: {},
            isDragging: false,
        } });
};
var getBoundsOfBoxes = function (box1, box2) { return ({
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2),
}); };
var rectToBox = function (_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
    return ({
        x: x,
        y: y,
        x2: x + width,
        y2: y + height,
    });
};
var boxToRect = function (_a) {
    var x = _a.x, y = _a.y, x2 = _a.x2, y2 = _a.y2;
    return ({
        x: x,
        y: y,
        width: x2 - x,
        height: y2 - y,
    });
};
var getBoundsofRects = function (rect1, rect2) {
    return boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
};
var getRectOfNodes = function (nodes) {
    var box = nodes.reduce(function (currBox, _a) {
        var _b = _a.__rf, _c = _b === void 0 ? {} : _b, position = _c.position, width = _c.width, height = _c.height;
        return getBoundsOfBoxes(currBox, rectToBox(__assign(__assign({}, position), { width: width, height: height })));
    }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
    return boxToRect(box);
};
var getNodesInside = function (nodes, rect, _a, partially) {
    var _b = _a === void 0 ? [0, 0, 1] : _a, tx = _b[0], ty = _b[1], tScale = _b[2];
    if (partially === void 0) { partially = false; }
    var rBox = rectToBox({
        x: (rect.x - tx) / tScale,
        y: (rect.y - ty) / tScale,
        width: rect.width / tScale,
        height: rect.height / tScale,
    });
    return nodes.filter(function (_a) {
        var _b = _a.__rf, position = _b.position, width = _b.width, height = _b.height, isDragging = _b.isDragging;
        var nBox = rectToBox(__assign(__assign({}, position), { width: width, height: height }));
        var xOverlap = Math.max(0, Math.min(rBox.x2, nBox.x2) - Math.max(rBox.x, nBox.x));
        var yOverlap = Math.max(0, Math.min(rBox.y2, nBox.y2) - Math.max(rBox.y, nBox.y));
        var overlappingArea = Math.ceil(xOverlap * yOverlap);
        if (width === null || height === null || isDragging) {
            // nodes are initialized with width and height = null
            return true;
        }
        if (partially) {
            return overlappingArea > 0;
        }
        var area = width * height;
        return overlappingArea >= area;
    });
};
var getConnectedEdges = function (nodes, edges) {
    var nodeIds = nodes.map(function (node) { return node.id; });
    return edges.filter(function (edge) { return nodeIds.includes(edge.source) || nodeIds.includes(edge.target); });
};
var parseElements = function (nodes, edges) {
    return __spreadArrays(nodes.map(function (node) {
        var n = __assign({}, node);
        n.position = n.__rf.position;
        delete n.__rf;
        return n;
    }), edges.map(function (e) { return (__assign({}, e)); }));
};
var onLoadGetElements = function (currentStore) {
    return function () {
        var _a = currentStore.getState(), _b = _a.nodes, nodes = _b === void 0 ? [] : _b, _c = _a.edges, edges = _c === void 0 ? [] : _c;
        return parseElements(nodes, edges);
    };
};
var onLoadToObject = function (currentStore) {
    return function () {
        var _a = currentStore.getState(), _b = _a.nodes, nodes = _b === void 0 ? [] : _b, _c = _a.edges, edges = _c === void 0 ? [] : _c, transform = _a.transform;
        return {
            elements: parseElements(nodes, edges),
            position: [transform[0], transform[1]],
            zoom: transform[2],
        };
    };
};

var useGlobalKeyHandler = (function (_a) {
    var deleteKeyCode = _a.deleteKeyCode, multiSelectionKeyCode = _a.multiSelectionKeyCode, onElementsRemove = _a.onElementsRemove;
    var store = useStore$1();
    var unsetNodesSelection = useStoreActions$1(function (actions) { return actions.unsetNodesSelection; });
    var setMultiSelectionActive = useStoreActions$1(function (actions) { return actions.setMultiSelectionActive; });
    var resetSelectedElements = useStoreActions$1(function (actions) { return actions.resetSelectedElements; });
    var deleteKeyPressed = useKeyPress(deleteKeyCode);
    var multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
    useEffect(function () {
        var _a = store.getState(), edges = _a.edges, selectedElements = _a.selectedElements;
        if (onElementsRemove && deleteKeyPressed && selectedElements) {
            var selectedNodes = selectedElements.filter(isNode);
            var connectedEdges = getConnectedEdges(selectedNodes, edges);
            var elementsToRemove = __spreadArrays(selectedElements, connectedEdges).reduce(function (res, item) { return res.set(item.id, item); }, new Map());
            onElementsRemove(Array.from(elementsToRemove.values()));
            unsetNodesSelection();
            resetSelectedElements();
        }
    }, [deleteKeyPressed]);
    useEffect(function () {
        setMultiSelectionActive(multiSelectionKeyPressed);
    }, [multiSelectionKeyPressed]);
});

var noop = {value: () => {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function array(x) {
  return typeof x === "object" && "length" in x
    ? x // Array, TypedArray, NodeList, array-like
    : Array.from(x); // Map, Set, iterable, string, or anything else
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function arrayAll(select) {
  return function() {
    var group = select.apply(this, arguments);
    return group == null ? [] : array(group);
  };
}

function selection_selectAll(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}

var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

function selection_selectChild(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : childMatcher(match)));
}

var filter = Array.prototype.filter;

function children() {
  return this.children;
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

function selection_selectChildren(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant(x) {
  return function() {
    return x;
  };
}

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

function selection_data(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = array(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {
  if (!(selection instanceof Selection)) throw new Error("invalid merge");

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  return Array.from(this);
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames$1(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, options) {
  var typenames = parseTypenames$1(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

function* selection_iterator() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}

var root$1 = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root$1);
}

function selection_selection() {
  return this;
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root$1);
}

function sourceEvent(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent) event = sourceEvent;
  return event;
}

function pointer(event, node) {
  event = sourceEvent(event);
  if (node === undefined) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

function dragDisable(view) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}

function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}

function Color() {}

var darker = 0.7;
var brighter = 1 / darker;

var reI = "\\s*([+-]?\\d+)\\s*",
    reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    reHex = /^#([0-9a-f]{3,8})$/,
    reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
    reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
    reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
    reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
    reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
    reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

var named = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

define(Color, color, {
  copy: function(channels) {
    return Object.assign(new this.constructor, this, channels);
  },
  displayable: function() {
    return this.rgb().displayable();
  },
  hex: color_formatHex, // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});

function color_formatHex() {
  return this.rgb().formatHex();
}

function color_formatHsl() {
  return hslConvert(this).formatHsl();
}

function color_formatRgb() {
  return this.rgb().formatRgb();
}

function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
      : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
      : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
      : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
      : null) // invalid hex
      : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
      : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
      : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
      : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
      : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
      : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
      : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
      : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
      : null;
}

function rgbn(n) {
  return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
}

function rgba(r, g, b, a) {
  if (a <= 0) r = g = b = NaN;
  return new Rgb(r, g, b, a);
}

function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb;
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}

function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}

function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}

define(Rgb, rgb, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb: function() {
    return this;
  },
  displayable: function() {
    return (-0.5 <= this.r && this.r < 255.5)
        && (-0.5 <= this.g && this.g < 255.5)
        && (-0.5 <= this.b && this.b < 255.5)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex, // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));

function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}

function rgb_formatRgb() {
  var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
  return (a === 1 ? "rgb(" : "rgba(")
      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
      + (a === 1 ? ")" : ", " + a + ")");
}

function hex(value) {
  value = Math.max(0, Math.min(255, Math.round(value) || 0));
  return (value < 16 ? "0" : "") + value.toString(16);
}

function hsla(h, s, l, a) {
  if (a <= 0) h = s = l = NaN;
  else if (l <= 0 || l >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l, a);
}

function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl;
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r = o.r / 255,
      g = o.g / 255,
      b = o.b / 255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      h = NaN,
      s = max - min,
      l = (max + min) / 2;
  if (s) {
    if (r === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r) / s + 2;
    else h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}

function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}

function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}

define(Hsl, hsl, extend(Color, {
  brighter: function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker: function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb: function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < 0.5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  displayable: function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1)
        && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl: function() {
    var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "hsl(" : "hsla(")
        + (this.h || 0) + ", "
        + (this.s || 0) * 100 + "%, "
        + (this.l || 0) * 100 + "%"
        + (a === 1 ? ")" : ", " + a + ")");
  }
}));

/* From FvD 13.37, CSS Color Module Level 3 */
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60
      : h < 180 ? m2
      : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
      : m1) * 255;
}

var constant$1 = x => () => x;

function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
  };
}

function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
}

var interpolateRgb = (function rgbGamma(y) {
  var color = gamma(y);

  function rgb$1(start, end) {
    var r = color((start = rgb(start)).r, (end = rgb(end)).r),
        g = color(start.g, end.g),
        b = color(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.r = r(t);
      start.g = g(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  rgb$1.gamma = rgbGamma;

  return rgb$1;
})(1);

function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    reB = new RegExp(reA.source, "g");

function zero(b) {
  return function() {
    return b;
  };
}

function one(b) {
  return function(t) {
    return b(t) + "";
  };
}

function interpolateString(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
      am, // current match in a
      bm, // current match in b
      bs, // string preceding current number in b, if any
      i = -1, // index in s
      s = [], // string constants and placeholders
      q = []; // number interpolators

  // Coerce inputs to strings.
  a = a + "", b = b + "";

  // Interpolate pairs of numbers in a & b.
  while ((am = reA.exec(a))
      && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) { // a string precedes the next number in b
      bs = b.slice(bi, bs);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
      if (s[i]) s[i] += bm; // coalesce with previous string
      else s[++i] = bm;
    } else { // interpolate non-matching numbers
      s[++i] = null;
      q.push({i: i, x: interpolateNumber(am, bm)});
    }
    bi = reB.lastIndex;
  }

  // Add remains of b.
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i]) s[i] += bs; // coalesce with previous string
    else s[++i] = bs;
  }

  // Special optimization for only a single match.
  // Otherwise, interpolate each of the numbers and rejoin the string.
  return s.length < 2 ? (q[0]
      ? one(q[0].x)
      : zero(b))
      : (b = q.length, function(t) {
          for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        });
}

var degrees = 180 / Math.PI;

var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};

function decompose(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX: scaleX,
    scaleY: scaleY
  };
}

var svgNode;

/* eslint-disable no-undef */
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
}

function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}

function interpolateTransform(parse, pxComma, pxParen, degParen) {

  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }

  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }

  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
      q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }

  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }

  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }

  return function(a, b) {
    var s = [], // string constants and placeholders
        q = []; // number interpolators
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null; // gc
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}

var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

var epsilon2 = 1e-12;

function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}

function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}

function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}

var interpolateZoom = (function zoomRho(rho, rho2, rho4) {

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }

    i.duration = S * 1000 * rho / Math.SQRT2;

    return i;
  }

  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };

  return zoom;
})(Math.SQRT2, 2, 4);

var frame = 0, // is an animation frame pending?
    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout$1(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(elapsed => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = get$2(node, id);
  if (schedule.state > CREATED) throw new Error("too late; already scheduled");
  return schedule;
}

function set$2(node, id) {
  var schedule = get$2(node, id);
  if (schedule.state > STARTED) throw new Error("too late; already running");
  return schedule;
}

function get$2(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return timeout$1(start);

      // Interrupt the active transition, if any.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions.
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    timeout$1(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(node, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set$2(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set$2(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get$2(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set$2(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get$2(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber
      : b instanceof color ? interpolateRgb
      : (c = color(b)) ? (b = c, interpolateRgb)
      : interpolateString)(a, b);
}

function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant$1(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrConstantNS$1(fullname, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function attrFunction$1(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function attrFunctionNS$1(fullname, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS$1 : attrRemove$1)(fullname)
      : (fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, i, value));
}

function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}

function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}

function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get$2(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set$2(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set$2(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get$2(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set$2(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get$2(this.node(), id).ease;
}

function easeVarying(id, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function") throw new Error;
    set$2(this, id).ease = v;
  };
}

function transition_easeVarying(value) {
  if (typeof value !== "function") throw new Error;
  return this.each(easeVarying(this._id, value));
}

function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set$2;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get$2(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get$2(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get$2(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection$1 = selection.prototype.constructor;

function transition_selection() {
  return new Selection$1(this._groups, this._parents);
}

function styleNull(name, interpolate) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}

function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant$1(name, interpolate, value1) {
  var string00,
      string1 = value1 + "",
      interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null
        : string0 === string00 ? interpolate0
        : interpolate0 = interpolate(string00 = string0, value1);
  };
}

function styleFunction$1(name, interpolate, value) {
  var string00,
      string10,
      interpolate0;
  return function() {
    var string0 = styleValue(this, name),
        value1 = value(this),
        string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null
        : string0 === string00 && string1 === string10 ? interpolate0
        : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}

function styleMaybeRemove(id, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
  return function() {
    var schedule = set$2(this, id),
        on = schedule.on,
        listener = schedule.value[key] == null ? remove || (remove = styleRemove$1(name)) : undefined;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

    schedule.on = on1;
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this
      .styleTween(name, styleNull(name, i))
      .on("end.style." + name, styleRemove$1(name))
    : typeof value === "function" ? this
      .styleTween(name, styleFunction$1(name, i, tweenValue(this, "style." + name, value)))
      .each(styleMaybeRemove(this._id, name))
    : this
      .styleTween(name, styleConstant$1(name, i, value), priority)
      .on("end.style." + name, null);
}

function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}

function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction$1(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction$1(tweenValue(this, "text", value))
      : textConstant$1(value == null ? "" : value + ""));
}

function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}

function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}

function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, textTween(value));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get$2(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

function transition_end() {
  var on0, on1, that = this, id = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = {value: reject},
        end = {value: function() { if (--size === 0) resolve(); }};

    that.each(function() {
      var schedule = set$2(this, id),
          on = schedule.on;

      // If this node shared a dispatch with the previous node,
      // just assign the updated shared dispatch and we’re done!
      // Otherwise, copy-on-write.
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }

      schedule.on = on1;
    });

    // The selection was empty, resolve end immediately
    if (size === 0) resolve();
  });
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function newId() {
  return ++id;
}

var selection_prototype = selection.prototype;

Transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id} not found`);
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;

var constant$2 = x => () => x;

function ZoomEvent(type, {
  sourceEvent,
  target,
  transform,
  dispatch
}) {
  Object.defineProperties(this, {
    type: {value: type, enumerable: true, configurable: true},
    sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
    target: {value: target, enumerable: true, configurable: true},
    transform: {value: transform, enumerable: true, configurable: true},
    _: {value: dispatch}
  });
}

function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};

var identity$1 = new Transform(1, 0, 0);

function nopropagation(event) {
  event.stopImmediatePropagation();
}

function noevent$1(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}

function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}

function defaultTransform() {
  return this.__zoom || identity$1;
}

function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
      dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
      dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
      dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

function zoom() {
  var filter = defaultFilter,
      extent = defaultExtent,
      constrain = defaultConstrain,
      wheelDelta = defaultWheelDelta,
      touchable = defaultTouchable,
      scaleExtent = [0, Infinity],
      translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
      duration = 250,
      interpolate = interpolateZoom,
      listeners = dispatch("start", "zoom", "end"),
      touchstarting,
      touchfirst,
      touchending,
      touchDelay = 500,
      wheelDelay = 150,
      clickDistance2 = 0,
      tapDistance = 10;

  function zoom(selection) {
    selection
        .property("__zoom", defaultTransform)
        .on("wheel.zoom", wheeled)
        .on("mousedown.zoom", mousedowned)
        .on("dblclick.zoom", dblclicked)
      .filter(touchable)
        .on("touchstart.zoom", touchstarted)
        .on("touchmove.zoom", touchmoved)
        .on("touchend.zoom touchcancel.zoom", touchended)
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  zoom.transform = function(collection, transform, point, event) {
    var selection = collection.selection ? collection.selection() : collection;
    selection.property("__zoom", defaultTransform);
    if (collection !== selection) {
      schedule(collection, transform, point, event);
    } else {
      selection.interrupt().each(function() {
        gesture(this, arguments)
          .event(event)
          .start()
          .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
          .end();
      });
    }
  };

  zoom.scaleBy = function(selection, k, p, event) {
    zoom.scaleTo(selection, function() {
      var k0 = this.__zoom.k,
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };

  zoom.scaleTo = function(selection, k, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t0 = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
          p1 = t0.invert(p0),
          k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p, event);
  };

  zoom.translateBy = function(selection, x, y, event) {
    zoom.transform(selection, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };

  zoom.translateTo = function(selection, x, y, p, event) {
    zoom.transform(selection, function() {
      var e = extent.apply(this, arguments),
          t = this.__zoom,
          p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity$1.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };

  function scale(transform, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
  }

  function translate(transform, p0, p1) {
    var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
    return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
  }

  function centroid(extent) {
    return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
  }

  function schedule(transition, transform, point, event) {
    transition
        .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
        .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
        .tween("zoom", function() {
          var that = this,
              args = arguments,
              g = gesture(that, args).event(event),
              e = extent.apply(that, args),
              p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
              w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
              a = that.__zoom,
              b = typeof transform === "function" ? transform.apply(that, args) : transform,
              i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
          return function(t) {
            if (t === 1) t = b; // Avoid rounding error on end.
            else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
            g.zoom(null, t);
          };
        });
  }

  function gesture(that, args, clean) {
    return (!clean && that.__zooming) || new Gesture(that, args);
  }

  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }

  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };

  function wheeled(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var g = gesture(this, args).event(event),
        t = this.__zoom,
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
        p = pointer(event);

    // If the mouse is in the same location as before, reuse it.
    // If there were recent wheel events, reset the wheel idle timeout.
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    }

    // If this wheel event won’t trigger a transform change, ignore it.
    else if (t.k === k) return;

    // Otherwise, capture the mouse point and location at the start.
    else {
      g.mouse = [p, t.invert(p)];
      interrupt(this);
      g.start();
    }

    noevent$1(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }

  function mousedowned(event, ...args) {
    if (touchending || !filter.apply(this, arguments)) return;
    var g = gesture(this, args, true).event(event),
        v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
        p = pointer(event, currentTarget),
        currentTarget = event.currentTarget,
        x0 = event.clientX,
        y0 = event.clientY;

    dragDisable(event.view);
    nopropagation(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt(this);
    g.start();

    function mousemoved(event) {
      noevent$1(event);
      if (!g.moved) {
        var dx = event.clientX - x0, dy = event.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event)
       .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }

    function mouseupped(event) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event.view, g.moved);
      noevent$1(event);
      g.event(event).end();
    }
  }

  function dblclicked(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var t0 = this.__zoom,
        p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
        p1 = t0.invert(p0),
        k1 = t0.k * (event.shiftKey ? 0.5 : 2),
        t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

    noevent$1(event);
    if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);
    else select(this).call(zoom.transform, t1, p0, event);
  }

  function touchstarted(event, ...args) {
    if (!filter.apply(this, arguments)) return;
    var touches = event.touches,
        n = touches.length,
        g = gesture(this, args, event.changedTouches.length === n).event(event),
        started, i, t, p;

    nopropagation(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
    }

    if (touchstarting) touchstarting = clearTimeout(touchstarting);

    if (started) {
      if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
      interrupt(this);
      g.start();
    }
  }

  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t, p, l;

    noevent$1(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1],
          p1 = g.touch1[0], l1 = g.touch1[1],
          dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
          dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    }
    else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
    else return;

    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }

  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event),
        touches = event.changedTouches,
        n = touches.length, i, t;

    nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
      if (g.taps === 2) {
        t = pointer(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select(this).on("dblclick.zoom");
          if (p) p.apply(this, arguments);
        }
      }
    }
  }

  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant$2(+_), zoom) : wheelDelta;
  };

  zoom.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$2(!!_), zoom) : filter;
  };

  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), zoom) : touchable;
  };

  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant$2([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };

  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };

  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };

  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };

  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };

  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };

  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };

  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };

  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };

  return zoom;
}

var useResizeHandler = (function (rendererNode) {
    var updateSize = useStoreActions$1(function (actions) { return actions.updateSize; });
    useEffect(function () {
        var resizeObserver;
        var updateDimensions = function () {
            if (!rendererNode.current) {
                return;
            }
            var size = getDimensions(rendererNode.current);
            if (size.height === 0 || size.width === 0) {
                console.warn('The React Flow parent container needs a width and a height to render the graph.');
            }
            updateSize(size);
        };
        updateDimensions();
        window.onresize = updateDimensions;
        if (rendererNode.current) {
            resizeObserver = new ResizeObserver(function () { return updateDimensions(); });
            resizeObserver.observe(rendererNode.current);
        }
        return function () {
            window.onresize = null;
            if (resizeObserver && rendererNode.current) {
                resizeObserver.unobserve(rendererNode.current);
            }
        };
    }, []);
});

var Position;
(function (Position) {
    Position["Left"] = "left";
    Position["Top"] = "top";
    Position["Right"] = "right";
    Position["Bottom"] = "bottom";
})(Position || (Position = {}));
var ArrowHeadType;
(function (ArrowHeadType) {
    ArrowHeadType["Arrow"] = "arrow";
    ArrowHeadType["ArrowClosed"] = "arrowclosed";
})(ArrowHeadType || (ArrowHeadType = {}));
var BackgroundVariant;
(function (BackgroundVariant) {
    BackgroundVariant["Lines"] = "lines";
    BackgroundVariant["Dots"] = "dots";
})(BackgroundVariant || (BackgroundVariant = {}));
var ConnectionMode;
(function (ConnectionMode) {
    ConnectionMode["Strict"] = "strict";
    ConnectionMode["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var ConnectionLineType;
(function (ConnectionLineType) {
    ConnectionLineType["Bezier"] = "default";
    ConnectionLineType["Straight"] = "straight";
    ConnectionLineType["Step"] = "step";
    ConnectionLineType["SmoothStep"] = "smoothstep";
})(ConnectionLineType || (ConnectionLineType = {}));
var PanOnScrollMode;
(function (PanOnScrollMode) {
    PanOnScrollMode["Free"] = "free";
    PanOnScrollMode["Vertical"] = "vertical";
    PanOnScrollMode["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));

var viewChanged = function (prevTransform, eventTransform) {
    return prevTransform.x !== eventTransform.x ||
        prevTransform.y !== eventTransform.y ||
        prevTransform.zoom !== eventTransform.k;
};
var eventToFlowTransform = function (eventTransform) { return ({
    x: eventTransform.x,
    y: eventTransform.y,
    zoom: eventTransform.k,
}); };
var ZoomPane = function (_a) {
    var onMove = _a.onMove, onMoveStart = _a.onMoveStart, onMoveEnd = _a.onMoveEnd, _b = _a.zoomOnScroll, zoomOnScroll = _b === void 0 ? true : _b, _c = _a.zoomOnPinch, zoomOnPinch = _c === void 0 ? true : _c, _d = _a.panOnScroll, panOnScroll = _d === void 0 ? false : _d, _e = _a.panOnScrollSpeed, panOnScrollSpeed = _e === void 0 ? 0.5 : _e, _f = _a.panOnScrollMode, panOnScrollMode = _f === void 0 ? PanOnScrollMode.Free : _f, _g = _a.zoomOnDoubleClick, zoomOnDoubleClick = _g === void 0 ? true : _g, selectionKeyPressed = _a.selectionKeyPressed, elementsSelectable = _a.elementsSelectable, _h = _a.paneMoveable, paneMoveable = _h === void 0 ? true : _h, _j = _a.defaultPosition, defaultPosition = _j === void 0 ? [0, 0] : _j, _k = _a.defaultZoom, defaultZoom = _k === void 0 ? 1 : _k, translateExtent = _a.translateExtent, zoomActivationKeyCode = _a.zoomActivationKeyCode, children = _a.children;
    var zoomPane = useRef(null);
    var prevTransform = useRef({ x: 0, y: 0, zoom: 0 });
    var store = useStore$1();
    var d3Zoom = useStoreState$1(function (s) { return s.d3Zoom; });
    var d3Selection = useStoreState$1(function (s) { return s.d3Selection; });
    var d3ZoomHandler = useStoreState$1(function (s) { return s.d3ZoomHandler; });
    var initD3Zoom = useStoreActions$1(function (actions) { return actions.initD3Zoom; });
    var updateTransform = useStoreActions$1(function (actions) { return actions.updateTransform; });
    var zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
    useResizeHandler(zoomPane);
    useEffect(function () {
        if (zoomPane.current) {
            var state = store.getState();
            var currentTranslateExtent = typeof translateExtent !== 'undefined' ? translateExtent : state.translateExtent;
            var d3ZoomInstance = zoom().scaleExtent([state.minZoom, state.maxZoom]).translateExtent(currentTranslateExtent);
            var selection = select(zoomPane.current).call(d3ZoomInstance);
            var clampedX = clamp(defaultPosition[0], currentTranslateExtent[0][0], currentTranslateExtent[1][0]);
            var clampedY = clamp(defaultPosition[1], currentTranslateExtent[0][1], currentTranslateExtent[1][1]);
            var clampedZoom = clamp(defaultZoom, state.minZoom, state.maxZoom);
            var updatedTransform = identity$1.translate(clampedX, clampedY).scale(clampedZoom);
            d3ZoomInstance.transform(selection, updatedTransform);
            initD3Zoom({
                d3Zoom: d3ZoomInstance,
                d3Selection: selection,
                d3ZoomHandler: selection.on('wheel.zoom'),
                // we need to pass transform because zoom handler is not registered when we set the initial transform
                transform: [clampedX, clampedY, clampedZoom],
            });
        }
    }, []);
    useEffect(function () {
        if (d3Selection && d3Zoom) {
            if (panOnScroll && !zoomActivationKeyPressed) {
                d3Selection
                    .on('wheel', function (event) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    var currentZoom = d3Selection.property('__zoom').k || 1;
                    if (event.ctrlKey && zoomOnPinch) {
                        var point = pointer(event);
                        // taken from https://github.com/d3/d3-zoom/blob/master/src/zoom.js
                        var pinchDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * 10;
                        var zoom_1 = currentZoom * Math.pow(2, pinchDelta);
                        d3Zoom.scaleTo(d3Selection, zoom_1, point);
                        return;
                    }
                    // increase scroll speed in firefox
                    // firefox: deltaMode === 1; chrome: deltaMode === 0
                    var deltaNormalize = event.deltaMode === 1 ? 20 : 1;
                    var deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
                    var deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
                    d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed);
                })
                    .on('wheel.zoom', null);
            }
            else if (typeof d3ZoomHandler !== 'undefined') {
                d3Selection.on('wheel', null).on('wheel.zoom', d3ZoomHandler);
            }
        }
    }, [panOnScroll, panOnScrollMode, d3Selection, d3Zoom, d3ZoomHandler, zoomActivationKeyPressed, zoomOnPinch]);
    useEffect(function () {
        if (d3Zoom) {
            if (selectionKeyPressed) {
                d3Zoom.on('zoom', null);
            }
            else {
                d3Zoom.on('zoom', function (event) {
                    updateTransform([event.transform.x, event.transform.y, event.transform.k]);
                    if (onMove) {
                        var flowTransform = eventToFlowTransform(event.transform);
                        onMove(flowTransform);
                    }
                });
            }
        }
    }, [selectionKeyPressed, d3Zoom, updateTransform, onMove]);
    useEffect(function () {
        if (d3Zoom) {
            if (onMoveStart) {
                d3Zoom.on('start', function (event) {
                    if (viewChanged(prevTransform.current, event.transform)) {
                        var flowTransform = eventToFlowTransform(event.transform);
                        prevTransform.current = flowTransform;
                        onMoveStart(flowTransform);
                    }
                });
            }
            else {
                d3Zoom.on('start', null);
            }
        }
    }, [d3Zoom, onMoveStart]);
    useEffect(function () {
        if (d3Zoom) {
            if (onMoveEnd) {
                d3Zoom.on('end', function (event) {
                    if (viewChanged(prevTransform.current, event.transform)) {
                        var flowTransform = eventToFlowTransform(event.transform);
                        prevTransform.current = flowTransform;
                        onMoveEnd(flowTransform);
                    }
                });
            }
            else {
                d3Zoom.on('end', null);
            }
        }
    }, [d3Zoom, onMoveEnd]);
    useEffect(function () {
        if (d3Zoom) {
            d3Zoom.filter(function (event) {
                var zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
                var pinchZoom = zoomOnPinch && event.ctrlKey;
                // if all interactions are disabled, we prevent all zoom events
                if (!paneMoveable && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
                    return false;
                }
                // during a selection we prevent all other interactions
                if (selectionKeyPressed) {
                    return false;
                }
                // if zoom on double click is disabled, we prevent the double click event
                if (!zoomOnDoubleClick && event.type === 'dblclick') {
                    return false;
                }
                if (event.target.closest('.nowheel') && event.type === 'wheel') {
                    return false;
                }
                // when the target element is a node, we still allow zooming
                if ((event.target.closest('.react-flow__node') || event.target.closest('.react-flow__edgeupdater')) &&
                    event.type !== 'wheel') {
                    return false;
                }
                // when the target element is a node selection, we still allow zooming
                if (event.target.closest('.react-flow__nodesselection') && event.type !== 'wheel') {
                    return false;
                }
                if (!zoomOnPinch && event.ctrlKey && event.type === 'wheel') {
                    return false;
                }
                // when there is no scroll handling enabled, we prevent all wheel events
                if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === 'wheel') {
                    return false;
                }
                // if the pane is not movable, we prevent dragging it with the mouse
                if (!paneMoveable && event.type === 'mousedown') {
                    return false;
                }
                // default filter for d3-zoom
                return (!event.ctrlKey || event.type === 'wheel') && !event.button;
            });
        }
    }, [
        d3Zoom,
        zoomOnScroll,
        zoomOnPinch,
        panOnScroll,
        zoomOnDoubleClick,
        paneMoveable,
        selectionKeyPressed,
        elementsSelectable,
        zoomActivationKeyPressed,
    ]);
    return (React.createElement("div", { className: "react-flow__renderer react-flow__zoompane", ref: zoomPane }, children));
};

/**
 * The user selection rectangle gets displayed when a user drags the mouse while pressing shift
 */
function getMousePosition(event) {
    var reactFlowNode = event.target.closest('.react-flow');
    if (!reactFlowNode) {
        return;
    }
    var containerBounds = reactFlowNode.getBoundingClientRect();
    return {
        x: event.clientX - containerBounds.left,
        y: event.clientY - containerBounds.top,
    };
}
var SelectionRect = function () {
    var userSelectionRect = useStoreState$1(function (state) { return state.userSelectionRect; });
    if (!userSelectionRect.draw) {
        return null;
    }
    return (React.createElement("div", { className: "react-flow__selection", style: {
            width: userSelectionRect.width,
            height: userSelectionRect.height,
            transform: "translate(" + userSelectionRect.x + "px, " + userSelectionRect.y + "px)",
        } }));
};
var UserSelection = memo(function (_a) {
    var selectionKeyPressed = _a.selectionKeyPressed;
    var selectionActive = useStoreState$1(function (state) { return state.selectionActive; });
    var elementsSelectable = useStoreState$1(function (state) { return state.elementsSelectable; });
    var setUserSelection = useStoreActions$1(function (actions) { return actions.setUserSelection; });
    var updateUserSelection = useStoreActions$1(function (actions) { return actions.updateUserSelection; });
    var unsetUserSelection = useStoreActions$1(function (actions) { return actions.unsetUserSelection; });
    var unsetNodesSelection = useStoreActions$1(function (actions) { return actions.unsetNodesSelection; });
    var renderUserSelectionPane = selectionActive || selectionKeyPressed;
    if (!elementsSelectable || !renderUserSelectionPane) {
        return null;
    }
    var onMouseDown = function (event) {
        var mousePos = getMousePosition(event);
        if (!mousePos) {
            return;
        }
        setUserSelection(mousePos);
    };
    var onMouseMove = function (event) {
        if (!selectionKeyPressed || !selectionActive) {
            return;
        }
        var mousePos = getMousePosition(event);
        if (!mousePos) {
            return;
        }
        updateUserSelection(mousePos);
    };
    var onMouseUp = function () { return unsetUserSelection(); };
    var onMouseLeave = function () {
        unsetUserSelection();
        unsetNodesSelection();
    };
    return (React.createElement("div", { className: "react-flow__selectionpane", onMouseDown: onMouseDown, onMouseMove: onMouseMove, onMouseUp: onMouseUp, onMouseLeave: onMouseLeave },
        React.createElement(SelectionRect, null)));
});

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b$1="function"===typeof Symbol&&Symbol.for,c$1=b$1?Symbol.for("react.element"):60103,d$1=b$1?Symbol.for("react.portal"):60106,e$1=b$1?Symbol.for("react.fragment"):60107,f$1=b$1?Symbol.for("react.strict_mode"):60108,g$1=b$1?Symbol.for("react.profiler"):60114,h$1=b$1?Symbol.for("react.provider"):60109,k$1=b$1?Symbol.for("react.context"):60110,l$1=b$1?Symbol.for("react.async_mode"):60111,m=b$1?Symbol.for("react.concurrent_mode"):60111,n$1=b$1?Symbol.for("react.forward_ref"):60112,p$1=b$1?Symbol.for("react.suspense"):60113,q$1=b$1?
Symbol.for("react.suspense_list"):60120,r$1=b$1?Symbol.for("react.memo"):60115,t$1=b$1?Symbol.for("react.lazy"):60116,v$1=b$1?Symbol.for("react.block"):60121,w$1=b$1?Symbol.for("react.fundamental"):60117,x$1=b$1?Symbol.for("react.responder"):60118,y$1=b$1?Symbol.for("react.scope"):60119;
function z$1(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c$1:switch(a=a.type,a){case l$1:case m:case e$1:case g$1:case f$1:case p$1:return a;default:switch(a=a&&a.$$typeof,a){case k$1:case n$1:case t$1:case r$1:case h$1:return a;default:return u}}case d$1:return u}}}function A$1(a){return z$1(a)===m}var AsyncMode=l$1;var ConcurrentMode=m;var ContextConsumer=k$1;var ContextProvider=h$1;var Element=c$1;var ForwardRef=n$1;var Fragment=e$1;var Lazy=t$1;var Memo=r$1;var Portal=d$1;
var Profiler=g$1;var StrictMode=f$1;var Suspense=p$1;var isAsyncMode=function(a){return A$1(a)||z$1(a)===l$1};var isConcurrentMode=A$1;var isContextConsumer=function(a){return z$1(a)===k$1};var isContextProvider=function(a){return z$1(a)===h$1};var isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c$1};var isForwardRef=function(a){return z$1(a)===n$1};var isFragment=function(a){return z$1(a)===e$1};var isLazy=function(a){return z$1(a)===t$1};
var isMemo=function(a){return z$1(a)===r$1};var isPortal=function(a){return z$1(a)===d$1};var isProfiler=function(a){return z$1(a)===g$1};var isStrictMode=function(a){return z$1(a)===f$1};var isSuspense=function(a){return z$1(a)===p$1};
var isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e$1||a===m||a===g$1||a===f$1||a===p$1||a===q$1||"object"===typeof a&&null!==a&&(a.$$typeof===t$1||a.$$typeof===r$1||a.$$typeof===h$1||a.$$typeof===k$1||a.$$typeof===n$1||a.$$typeof===w$1||a.$$typeof===x$1||a.$$typeof===y$1||a.$$typeof===v$1)};var typeOf=z$1;

var reactIs_production_min = {
	AsyncMode: AsyncMode,
	ConcurrentMode: ConcurrentMode,
	ContextConsumer: ContextConsumer,
	ContextProvider: ContextProvider,
	Element: Element,
	ForwardRef: ForwardRef,
	Fragment: Fragment,
	Lazy: Lazy,
	Memo: Memo,
	Portal: Portal,
	Profiler: Profiler,
	StrictMode: StrictMode,
	Suspense: Suspense,
	isAsyncMode: isAsyncMode,
	isConcurrentMode: isConcurrentMode,
	isContextConsumer: isContextConsumer,
	isContextProvider: isContextProvider,
	isElement: isElement,
	isForwardRef: isForwardRef,
	isFragment: isFragment,
	isLazy: isLazy,
	isMemo: isMemo,
	isPortal: isPortal,
	isProfiler: isProfiler,
	isStrictMode: isStrictMode,
	isSuspense: isSuspense,
	isValidElementType: isValidElementType,
	typeOf: typeOf
};

/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var reactIs_development = createCommonjsModule(function (module, exports) {



if (process.env.NODE_ENV !== "production") {
  (function() {

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
// (unstable) APIs that have been removed. Can we remove the symbols?

var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

function isValidElementType(type) {
  return typeof type === 'string' || typeof type === 'function' || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
}

function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_ASYNC_MODE_TYPE:
          case REACT_CONCURRENT_MODE_TYPE:
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }

        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
} // AsyncMode is deprecated along with isAsyncMode

var AsyncMode = REACT_ASYNC_MODE_TYPE;
var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
    }
  }

  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
}
function isConcurrentMode(object) {
  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}

exports.AsyncMode = AsyncMode;
exports.ConcurrentMode = ConcurrentMode;
exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
  })();
}
});

var reactIs = createCommonjsModule(function (module) {

if (process.env.NODE_ENV === 'production') {
  module.exports = reactIs_production_min;
} else {
  module.exports = reactIs_development;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var printWarning = function() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          );
        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

/**
 * Resets warning cache when testing.
 *
 * @private
 */
checkPropTypes.resetWarningCache = function() {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */







var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);
var printWarning$1 = function() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning$1(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1(
            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
          );
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);
        if (type === 'symbol') {
          return String(value);
        }
        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning$1(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = objectAssign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // falsy value can't be a Symbol
    if (!propValue) {
      return false;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  }  shim.isRequired = shim;
  function getShim() {
    return shim;
  }  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var propTypes = createCommonjsModule(function (module) {
if (process.env.NODE_ENV !== 'production') {
  var ReactIs = reactIs;

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

var classnames = createCommonjsModule(function (module) {
/* global define */

(function () {

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}
}());
});

var findInArray_1 = findInArray;
var isFunction_1 = isFunction;
var isNum_1 = isNum;
var int_1 = int;
var dontSetMe_1 = dontSetMe;

// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
function findInArray(array
/*: Array<any> | TouchList*/
, callback
/*: Function*/
)
/*: any*/
{
  for (var i = 0, length = array.length; i < length; i++) {
    if (callback.apply(callback, [array[i], i, array])) return array[i];
  }
}

function isFunction(func
/*: any*/
)
/*: boolean %checks*/
{
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

function isNum(num
/*: any*/
)
/*: boolean %checks*/
{
  return typeof num === 'number' && !isNaN(num);
}

function int(a
/*: string*/
)
/*: number*/
{
  return parseInt(a, 10);
}

function dontSetMe(props
/*: Object*/
, propName
/*: string*/
, componentName
/*: string*/
) {
  if (props[propName]) {
    return new Error("Invalid prop ".concat(propName, " passed to ").concat(componentName, " - do not set this, set it on the child."));
  }
}

var shims = /*#__PURE__*/Object.defineProperty({
	findInArray: findInArray_1,
	isFunction: isFunction_1,
	isNum: isNum_1,
	int: int_1,
	dontSetMe: dontSetMe_1
}, '__esModule', {value: true});

var getPrefix_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrefix = getPrefix;
exports.browserPrefixToKey = browserPrefixToKey;
exports.browserPrefixToStyle = browserPrefixToStyle;
exports.default = void 0;
var prefixes = ['Moz', 'Webkit', 'O', 'ms'];

function getPrefix()
/*: string*/
{
  var prop
  /*: string*/
  = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';
  // Checking specifically for 'window.document' is for pseudo-browser server-side
  // environments that define 'window' as the global context.
  // E.g. React-rails (see https://github.com/reactjs/react-rails/pull/84)
  if (typeof window === 'undefined' || typeof window.document === 'undefined') return '';
  var style = window.document.documentElement.style;
  if (prop in style) return '';

  for (var i = 0; i < prefixes.length; i++) {
    if (browserPrefixToKey(prop, prefixes[i]) in style) return prefixes[i];
  }

  return '';
}

function browserPrefixToKey(prop
/*: string*/
, prefix
/*: string*/
)
/*: string*/
{
  return prefix ? "".concat(prefix).concat(kebabToTitleCase(prop)) : prop;
}

function browserPrefixToStyle(prop
/*: string*/
, prefix
/*: string*/
)
/*: string*/
{
  return prefix ? "-".concat(prefix.toLowerCase(), "-").concat(prop) : prop;
}

function kebabToTitleCase(str
/*: string*/
)
/*: string*/
{
  var out = '';
  var shouldCapitalize = true;

  for (var i = 0; i < str.length; i++) {
    if (shouldCapitalize) {
      out += str[i].toUpperCase();
      shouldCapitalize = false;
    } else if (str[i] === '-') {
      shouldCapitalize = true;
    } else {
      out += str[i];
    }
  }

  return out;
} // Default export is the prefix itself, like 'Moz', 'Webkit', etc
// Note that you may have to re-test for certain things; for instance, Chrome 50
// can handle unprefixed `transform`, but not unprefixed `user-select`


var _default = getPrefix();

exports.default = _default;
});

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


var matchesSelector_1 = matchesSelector;
var matchesSelectorAndParentsTo_1 = matchesSelectorAndParentsTo;
var addEvent_1 = addEvent;
var removeEvent_1 = removeEvent;
var outerHeight_1 = outerHeight;
var outerWidth_1 = outerWidth;
var innerHeight_1 = innerHeight;
var innerWidth_1 = innerWidth;
var offsetXYFromParent_1 = offsetXYFromParent;
var createCSSTransform_1 = createCSSTransform;
var createSVGTransform_1 = createSVGTransform;
var getTranslation_1 = getTranslation;
var getTouch_1 = getTouch;
var getTouchIdentifier_1 = getTouchIdentifier;
var addUserSelectStyles_1 = addUserSelectStyles;
var removeUserSelectStyles_1 = removeUserSelectStyles;
var addClassName_1 = addClassName;
var removeClassName_1 = removeClassName;



var _getPrefix = _interopRequireWildcard(getPrefix_1);

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var matchesSelectorFunc = '';

function matchesSelector(el
/*: Node*/
, selector
/*: string*/
)
/*: boolean*/
{
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = (0, shims.findInArray)(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
      // $FlowIgnore: Doesn't think elements are indexable
      return (0, shims.isFunction)(el[method]);
    });
  } // Might not be found entirely (not an Element?) - in that case, bail
  // $FlowIgnore: Doesn't think elements are indexable


  if (!(0, shims.isFunction)(el[matchesSelectorFunc])) return false; // $FlowIgnore: Doesn't think elements are indexable

  return el[matchesSelectorFunc](selector);
} // Works up the tree to the draggable itself attempting to match selector.


function matchesSelectorAndParentsTo(el
/*: Node*/
, selector
/*: string*/
, baseNode
/*: Node*/
)
/*: boolean*/
{
  var node = el;

  do {
    if (matchesSelector(node, selector)) return true;
    if (node === baseNode) return false;
    node = node.parentNode;
  } while (node);

  return false;
}

function addEvent(el
/*: ?Node*/
, event
/*: string*/
, handler
/*: Function*/
, inputOptions
/*: Object*/
)
/*: void*/
{
  if (!el) return;

  var options = _objectSpread({
    capture: true
  }, inputOptions);

  if (el.addEventListener) {
    el.addEventListener(event, handler, options);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = handler;
  }
}

function removeEvent(el
/*: ?Node*/
, event
/*: string*/
, handler
/*: Function*/
, inputOptions
/*: Object*/
)
/*: void*/
{
  if (!el) return;

  var options = _objectSpread({
    capture: true
  }, inputOptions);

  if (el.removeEventListener) {
    el.removeEventListener(event, handler, options);
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el['on' + event] = null;
  }
}

function outerHeight(node
/*: HTMLElement*/
)
/*: number*/
{
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  var height = node.clientHeight;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height += (0, shims.int)(computedStyle.borderTopWidth);
  height += (0, shims.int)(computedStyle.borderBottomWidth);
  return height;
}

function outerWidth(node
/*: HTMLElement*/
)
/*: number*/
{
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetLeft which is including margin. See getBoundPosition
  var width = node.clientWidth;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width += (0, shims.int)(computedStyle.borderLeftWidth);
  width += (0, shims.int)(computedStyle.borderRightWidth);
  return width;
}

function innerHeight(node
/*: HTMLElement*/
)
/*: number*/
{
  var height = node.clientHeight;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height -= (0, shims.int)(computedStyle.paddingTop);
  height -= (0, shims.int)(computedStyle.paddingBottom);
  return height;
}

function innerWidth(node
/*: HTMLElement*/
)
/*: number*/
{
  var width = node.clientWidth;
  var computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width -= (0, shims.int)(computedStyle.paddingLeft);
  width -= (0, shims.int)(computedStyle.paddingRight);
  return width;
} // Get from offsetParent


function offsetXYFromParent(evt
/*: {clientX: number, clientY: number}*/
, offsetParent
/*: HTMLElement*/
, scale
/*: number*/
)
/*: ControlPosition*/
{
  var isBody = offsetParent === offsetParent.ownerDocument.body;
  var offsetParentRect = isBody ? {
    left: 0,
    top: 0
  } : offsetParent.getBoundingClientRect();
  var x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  var y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
  return {
    x: x,
    y: y
  };
}

function createCSSTransform(controlPos
/*: ControlPosition*/
, positionOffset
/*: PositionOffsetControlPosition*/
)
/*: Object*/
{
  var translation = getTranslation(controlPos, positionOffset, 'px');
  return _defineProperty$1({}, (0, _getPrefix.browserPrefixToKey)('transform', _getPrefix.default), translation);
}

function createSVGTransform(controlPos
/*: ControlPosition*/
, positionOffset
/*: PositionOffsetControlPosition*/
)
/*: string*/
{
  var translation = getTranslation(controlPos, positionOffset, '');
  return translation;
}

function getTranslation(_ref2, positionOffset
/*: PositionOffsetControlPosition*/
, unitSuffix
/*: string*/
)
/*: string*/
{
  var x = _ref2.x,
      y = _ref2.y;
  var translation = "translate(".concat(x).concat(unitSuffix, ",").concat(y).concat(unitSuffix, ")");

  if (positionOffset) {
    var defaultX = "".concat(typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix);
    var defaultY = "".concat(typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix);
    translation = "translate(".concat(defaultX, ", ").concat(defaultY, ")") + translation;
  }

  return translation;
}

function getTouch(e
/*: MouseTouchEvent*/
, identifier
/*: number*/
)
/*: ?{clientX: number, clientY: number}*/
{
  return e.targetTouches && (0, shims.findInArray)(e.targetTouches, function (t) {
    return identifier === t.identifier;
  }) || e.changedTouches && (0, shims.findInArray)(e.changedTouches, function (t) {
    return identifier === t.identifier;
  });
}

function getTouchIdentifier(e
/*: MouseTouchEvent*/
)
/*: ?number*/
{
  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
} // User-select Hacks:
//
// Useful for preventing blue highlights all over everything when dragging.
// Note we're passing `document` b/c we could be iframed


function addUserSelectStyles(doc
/*: ?Document*/
) {
  if (!doc) return;
  var styleEl = doc.getElementById('react-draggable-style-el');

  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'react-draggable-style-el';
    styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
    styleEl.innerHTML += '.react-draggable-transparent-selection *::selection {all: inherit;}\n';
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }

  if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
}

function removeUserSelectStyles(doc
/*: ?Document*/
) {
  if (!doc) return;

  try {
    if (doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection'); // $FlowIgnore: IE

    if (doc.selection) {
      // $FlowIgnore: IE
      doc.selection.empty();
    } else {
      // Remove selection caused by scroll, unless it's a focused input
      // (we use doc.defaultView in case we're in an iframe)
      var selection = (doc.defaultView || window).getSelection();

      if (selection && selection.type !== 'Caret') {
        selection.removeAllRanges();
      }
    }
  } catch (e) {// probably IE
  }
}

function addClassName(el
/*: HTMLElement*/
, className
/*: string*/
) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
      el.className += " ".concat(className);
    }
  }
}

function removeClassName(el
/*: HTMLElement*/
, className
/*: string*/
) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), 'g'), '');
  }
}

var domFns = /*#__PURE__*/Object.defineProperty({
	matchesSelector: matchesSelector_1,
	matchesSelectorAndParentsTo: matchesSelectorAndParentsTo_1,
	addEvent: addEvent_1,
	removeEvent: removeEvent_1,
	outerHeight: outerHeight_1,
	outerWidth: outerWidth_1,
	innerHeight: innerHeight_1,
	innerWidth: innerWidth_1,
	offsetXYFromParent: offsetXYFromParent_1,
	createCSSTransform: createCSSTransform_1,
	createSVGTransform: createSVGTransform_1,
	getTranslation: getTranslation_1,
	getTouch: getTouch_1,
	getTouchIdentifier: getTouchIdentifier_1,
	addUserSelectStyles: addUserSelectStyles_1,
	removeUserSelectStyles: removeUserSelectStyles_1,
	addClassName: addClassName_1,
	removeClassName: removeClassName_1
}, '__esModule', {value: true});

var getBoundPosition_1 = getBoundPosition;
var snapToGrid_1 = snapToGrid;
var canDragX_1 = canDragX;
var canDragY_1 = canDragY;
var getControlPosition_1 = getControlPosition;
var createCoreData_1 = createCoreData;
var createDraggableData_1 = createDraggableData;





function getBoundPosition(draggable
/*: Draggable*/
, x
/*: number*/
, y
/*: number*/
)
/*: [number, number]*/
{
  // If no bounds, short-circuit and move on
  if (!draggable.props.bounds) return [x, y]; // Clone new bounds

  var bounds = draggable.props.bounds;
  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
  var node = findDOMNode(draggable);

  if (typeof bounds === 'string') {
    var ownerDocument = node.ownerDocument;
    var ownerWindow = ownerDocument.defaultView;
    var boundNode;

    if (bounds === 'parent') {
      boundNode = node.parentNode;
    } else {
      boundNode = ownerDocument.querySelector(bounds);
    }

    if (!(boundNode instanceof ownerWindow.HTMLElement)) {
      throw new Error('Bounds selector "' + bounds + '" could not find an element.');
    }

    var nodeStyle = ownerWindow.getComputedStyle(node);
    var boundNodeStyle = ownerWindow.getComputedStyle(boundNode); // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.

    bounds = {
      left: -node.offsetLeft + (0, shims.int)(boundNodeStyle.paddingLeft) + (0, shims.int)(nodeStyle.marginLeft),
      top: -node.offsetTop + (0, shims.int)(boundNodeStyle.paddingTop) + (0, shims.int)(nodeStyle.marginTop),
      right: (0, domFns.innerWidth)(boundNode) - (0, domFns.outerWidth)(node) - node.offsetLeft + (0, shims.int)(boundNodeStyle.paddingRight) - (0, shims.int)(nodeStyle.marginRight),
      bottom: (0, domFns.innerHeight)(boundNode) - (0, domFns.outerHeight)(node) - node.offsetTop + (0, shims.int)(boundNodeStyle.paddingBottom) - (0, shims.int)(nodeStyle.marginBottom)
    };
  } // Keep x and y below right and bottom limits...


  if ((0, shims.isNum)(bounds.right)) x = Math.min(x, bounds.right);
  if ((0, shims.isNum)(bounds.bottom)) y = Math.min(y, bounds.bottom); // But above left and top limits.

  if ((0, shims.isNum)(bounds.left)) x = Math.max(x, bounds.left);
  if ((0, shims.isNum)(bounds.top)) y = Math.max(y, bounds.top);
  return [x, y];
}

function snapToGrid(grid
/*: [number, number]*/
, pendingX
/*: number*/
, pendingY
/*: number*/
)
/*: [number, number]*/
{
  var x = Math.round(pendingX / grid[0]) * grid[0];
  var y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
}

function canDragX(draggable
/*: Draggable*/
)
/*: boolean*/
{
  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
}

function canDragY(draggable
/*: Draggable*/
)
/*: boolean*/
{
  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
} // Get {x, y} positions from event.


function getControlPosition(e
/*: MouseTouchEvent*/
, touchIdentifier
/*: ?number*/
, draggableCore
/*: DraggableCore*/
)
/*: ?ControlPosition*/
{
  var touchObj = typeof touchIdentifier === 'number' ? (0, domFns.getTouch)(e, touchIdentifier) : null;
  if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch

  var node = findDOMNode(draggableCore); // User can provide an offsetParent if desired.

  var offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
  return (0, domFns.offsetXYFromParent)(touchObj || e, offsetParent, draggableCore.props.scale);
} // Create an data object exposed by <DraggableCore>'s events


function createCoreData(draggable
/*: DraggableCore*/
, x
/*: number*/
, y
/*: number*/
)
/*: DraggableData*/
{
  var state = draggable.state;
  var isStart = !(0, shims.isNum)(state.lastX);
  var node = findDOMNode(draggable);

  if (isStart) {
    // If this is our first move, use the x and y as last coords.
    return {
      node: node,
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x: x,
      y: y
    };
  } else {
    // Otherwise calculate proper values.
    return {
      node: node,
      deltaX: x - state.lastX,
      deltaY: y - state.lastY,
      lastX: state.lastX,
      lastY: state.lastY,
      x: x,
      y: y
    };
  }
} // Create an data exposed by <Draggable>'s events


function createDraggableData(draggable
/*: Draggable*/
, coreData
/*: DraggableData*/
)
/*: DraggableData*/
{
  var scale = draggable.props.scale;
  return {
    node: coreData.node,
    x: draggable.state.x + coreData.deltaX / scale,
    y: draggable.state.y + coreData.deltaY / scale,
    deltaX: coreData.deltaX / scale,
    deltaY: coreData.deltaY / scale,
    lastX: draggable.state.x,
    lastY: draggable.state.y
  };
} // A lot faster than stringify/parse


function cloneBounds(bounds
/*: Bounds*/
)
/*: Bounds*/
{
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom
  };
}

function findDOMNode(draggable
/*: Draggable | DraggableCore*/
)
/*: HTMLElement*/
{
  var node = draggable.findDOMNode();

  if (!node) {
    throw new Error('<DraggableCore>: Unmounted during event!');
  } // $FlowIgnore we can't assert on HTMLElement due to tests... FIXME


  return node;
}

var positionFns = /*#__PURE__*/Object.defineProperty({
	getBoundPosition: getBoundPosition_1,
	snapToGrid: snapToGrid_1,
	canDragX: canDragX_1,
	canDragY: canDragY_1,
	getControlPosition: getControlPosition_1,
	createCoreData: createCoreData_1,
	createDraggableData: createDraggableData_1
}, '__esModule', {value: true});

var _default = log;

/*eslint no-console:0*/
function log() {
}

var log_1 = /*#__PURE__*/Object.defineProperty({
	default: _default
}, '__esModule', {value: true});

var DraggableCore_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React$1 = _interopRequireWildcard(React);

var _propTypes = _interopRequireDefault(propTypes);

var _reactDom = _interopRequireDefault(require$$2);







var _log = _interopRequireDefault(log_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Simple abstraction for dragging events names.
var eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  }
}; // Default to mouse events.

var dragEventFor = eventsFor.mouse;
/*:: type DraggableCoreState = {
  dragging: boolean,
  lastX: number,
  lastY: number,
  touchIdentifier: ?number
};*/

/*:: export type DraggableData = {
  node: HTMLElement,
  x: number, y: number,
  deltaX: number, deltaY: number,
  lastX: number, lastY: number,
};*/

/*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void;*/

/*:: export type ControlPosition = {x: number, y: number};*/

/*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/

/*:: export type DraggableCoreProps = {
  allowAnyClick: boolean,
  cancel: string,
  children: ReactElement<any>,
  disabled: boolean,
  enableUserSelectHack: boolean,
  offsetParent: HTMLElement,
  grid: [number, number],
  handle: string,
  nodeRef?: ?React.ElementRef<any>,
  onStart: DraggableEventHandler,
  onDrag: DraggableEventHandler,
  onStop: DraggableEventHandler,
  onMouseDown: (e: MouseEvent) => void,
  scale: number,
};*/

//
// Define <DraggableCore>.
//
// <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
// work well with libraries that require more control over the element.
//
var DraggableCore = /*#__PURE__*/function (_React$Component) {
  _inherits(DraggableCore, _React$Component);

  var _super = _createSuper(DraggableCore);

  function DraggableCore() {
    var _this;

    _classCallCheck(this, DraggableCore);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      dragging: false,
      // Used while dragging to determine deltas.
      lastX: NaN,
      lastY: NaN,
      touchIdentifier: null
    });

    _defineProperty(_assertThisInitialized(_this), "mounted", false);

    _defineProperty(_assertThisInitialized(_this), "handleDragStart", function (e) {
      // Make it possible to attach event handlers on top of this one.
      _this.props.onMouseDown(e); // Only accept left-clicks.


      if (!_this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false; // Get nodes. Be sure to grab relative document (could be iframed)

      var thisNode = _this.findDOMNode();

      if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
        throw new Error('<DraggableCore> not mounted on DragStart!');
      }

      var ownerDocument = thisNode.ownerDocument; // Short circuit if handle or cancel prop was provided and selector doesn't match.

      if (_this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || _this.props.handle && !(0, domFns.matchesSelectorAndParentsTo)(e.target, _this.props.handle, thisNode) || _this.props.cancel && (0, domFns.matchesSelectorAndParentsTo)(e.target, _this.props.cancel, thisNode)) {
        return;
      } // Prevent scrolling on mobile devices, like ipad/iphone.
      // Important that this is after handle/cancel.


      if (e.type === 'touchstart') e.preventDefault(); // Set touch identifier in component state if this is a touch event. This allows us to
      // distinguish between individual touches on multitouch screens by identifying which
      // touchpoint was set to this element.

      var touchIdentifier = (0, domFns.getTouchIdentifier)(e);

      _this.setState({
        touchIdentifier: touchIdentifier
      }); // Get the current drag point from the event. This is used as the offset.


      var position = (0, positionFns.getControlPosition)(e, touchIdentifier, _assertThisInitialized(_this));
      if (position == null) return; // not possible but satisfies flow

      var x = position.x,
          y = position.y; // Create an event object with all the data parents need to make a decision here.

      var coreEvent = (0, positionFns.createCoreData)(_assertThisInitialized(_this), x, y);
      (0, _log.default)('DraggableCore: handleDragStart: %j', coreEvent); // Call event handler. If it returns explicit false, cancel.

      (0, _log.default)('calling', _this.props.onStart);

      var shouldUpdate = _this.props.onStart(e, coreEvent);

      if (shouldUpdate === false || _this.mounted === false) return; // Add a style to the body to disable user-select. This prevents text from
      // being selected all over the page.

      if (_this.props.enableUserSelectHack) (0, domFns.addUserSelectStyles)(ownerDocument); // Initiate dragging. Set the current x and y as offsets
      // so we know how much we've moved during the drag. This allows us
      // to drag elements around even if they have been moved, without issue.

      _this.setState({
        dragging: true,
        lastX: x,
        lastY: y
      }); // Add events to the document directly so we catch when the user's mouse/touch moves outside of
      // this element. We use different events depending on whether or not we have detected that this
      // is a touch-capable device.


      (0, domFns.addEvent)(ownerDocument, dragEventFor.move, _this.handleDrag);
      (0, domFns.addEvent)(ownerDocument, dragEventFor.stop, _this.handleDragStop);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDrag", function (e) {
      // Get the current drag point from the event. This is used as the offset.
      var position = (0, positionFns.getControlPosition)(e, _this.state.touchIdentifier, _assertThisInitialized(_this));
      if (position == null) return;
      var x = position.x,
          y = position.y; // Snap to grid if prop has been provided

      if (Array.isArray(_this.props.grid)) {
        var deltaX = x - _this.state.lastX,
            deltaY = y - _this.state.lastY;

        var _snapToGrid = (0, positionFns.snapToGrid)(_this.props.grid, deltaX, deltaY);

        var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);

        deltaX = _snapToGrid2[0];
        deltaY = _snapToGrid2[1];
        if (!deltaX && !deltaY) return; // skip useless drag

        x = _this.state.lastX + deltaX, y = _this.state.lastY + deltaY;
      }

      var coreEvent = (0, positionFns.createCoreData)(_assertThisInitialized(_this), x, y);
      (0, _log.default)('DraggableCore: handleDrag: %j', coreEvent); // Call event handler. If it returns explicit false, trigger end.

      var shouldUpdate = _this.props.onDrag(e, coreEvent);

      if (shouldUpdate === false || _this.mounted === false) {
        try {
          // $FlowIgnore
          _this.handleDragStop(new MouseEvent('mouseup'));
        } catch (err) {
          // Old browsers
          var event = ((document.createEvent('MouseEvents')
          /*: any*/
          )
          /*: MouseTouchEvent*/
          ); // I see why this insanity was deprecated
          // $FlowIgnore

          event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

          _this.handleDragStop(event);
        }

        return;
      }

      _this.setState({
        lastX: x,
        lastY: y
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleDragStop", function (e) {
      if (!_this.state.dragging) return;
      var position = (0, positionFns.getControlPosition)(e, _this.state.touchIdentifier, _assertThisInitialized(_this));
      if (position == null) return;
      var x = position.x,
          y = position.y;
      var coreEvent = (0, positionFns.createCoreData)(_assertThisInitialized(_this), x, y); // Call event handler

      var shouldContinue = _this.props.onStop(e, coreEvent);

      if (shouldContinue === false || _this.mounted === false) return false;

      var thisNode = _this.findDOMNode();

      if (thisNode) {
        // Remove user-select hack
        if (_this.props.enableUserSelectHack) (0, domFns.removeUserSelectStyles)(thisNode.ownerDocument);
      }

      (0, _log.default)('DraggableCore: handleDragStop: %j', coreEvent); // Reset the el.

      _this.setState({
        dragging: false,
        lastX: NaN,
        lastY: NaN
      });

      if (thisNode) {
        // Remove event handlers
        (0, _log.default)('DraggableCore: Removing handlers');
        (0, domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, _this.handleDrag);
        (0, domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, _this.handleDragStop);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function (e) {
      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

      return _this.handleDragStart(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onMouseUp", function (e) {
      dragEventFor = eventsFor.mouse;
      return _this.handleDragStop(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onTouchStart", function (e) {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return _this.handleDragStart(e);
    });

    _defineProperty(_assertThisInitialized(_this), "onTouchEnd", function (e) {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return _this.handleDragStop(e);
    });

    return _this;
  }

  _createClass(DraggableCore, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.mounted = true; // Touch handlers must be added with {passive: false} to be cancelable.
      // https://developers.google.com/web/updates/2017/01/scrolling-intervention

      var thisNode = this.findDOMNode();

      if (thisNode) {
        (0, domFns.addEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
          passive: false
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false; // Remove any leftover event handlers. Remove both touch and mouse handlers in case
      // some browser quirk caused a touch event to fire during a mouse move, or vice versa.

      var thisNode = this.findDOMNode();

      if (thisNode) {
        var ownerDocument = thisNode.ownerDocument;
        (0, domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
        (0, domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
        (0, domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
        (0, domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
        (0, domFns.removeEvent)(thisNode, eventsFor.touch.start, this.onTouchStart, {
          passive: false
        });
        if (this.props.enableUserSelectHack) (0, domFns.removeUserSelectStyles)(ownerDocument);
      }
    } // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.

  }, {
    key: "findDOMNode",
    value: function findDOMNode()
    /*: ?HTMLElement*/
    {
      return this.props.nodeRef ? this.props.nodeRef.current : _reactDom.default.findDOMNode(this);
    }
  }, {
    key: "render",
    value: function render() {
      // Reuse the child provided
      // This makes it flexible to use whatever element is wanted (div, ul, etc)
      return React$1.cloneElement(React$1.Children.only(this.props.children), {
        // Note: mouseMove handler is attached to document so it will still function
        // when the user drags quickly and leaves the bounds of the element.
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        // onTouchStart is added on `componentDidMount` so they can be added with
        // {passive: false}, which allows it to cancel. See 
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        onTouchEnd: this.onTouchEnd
      });
    }
  }]);

  return DraggableCore;
}(React$1.Component);

exports.default = DraggableCore;

_defineProperty(DraggableCore, "displayName", 'DraggableCore');

_defineProperty(DraggableCore, "propTypes", {
  /**
   * `allowAnyClick` allows dragging using any mouse button.
   * By default, we only accept the left button.
   *
   * Defaults to `false`.
   */
  allowAnyClick: _propTypes.default.bool,

  /**
   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
   * with the exception of `onMouseDown`, will not fire.
   */
  disabled: _propTypes.default.bool,

  /**
   * By default, we add 'user-select:none' attributes to the document body
   * to prevent ugly text selection during drag. If this is causing problems
   * for your app, set this to `false`.
   */
  enableUserSelectHack: _propTypes.default.bool,

  /**
   * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
   * instead of using the parent node.
   */
  offsetParent: function offsetParent(props
  /*: DraggableCoreProps*/
  , propName
  /*: $Keys<DraggableCoreProps>*/
  ) {
    if (props[propName] && props[propName].nodeType !== 1) {
      throw new Error('Draggable\'s offsetParent must be a DOM Node.');
    }
  },

  /**
   * `grid` specifies the x and y that dragging should snap to.
   */
  grid: _propTypes.default.arrayOf(_propTypes.default.number),

  /**
   * `handle` specifies a selector to be used as the handle that initiates drag.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *         return (
   *            <Draggable handle=".handle">
   *              <div>
   *                  <div className="handle">Click me to drag</div>
   *                  <div>This is some other content</div>
   *              </div>
   *           </Draggable>
   *         );
   *       }
   *   });
   * ```
   */
  handle: _propTypes.default.string,

  /**
   * `cancel` specifies a selector to be used to prevent drag initialization.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *           return(
   *               <Draggable cancel=".cancel">
   *                   <div>
   *                     <div className="cancel">You can't drag from here</div>
   *                     <div>Dragging here works fine</div>
   *                   </div>
   *               </Draggable>
   *           );
   *       }
   *   });
   * ```
   */
  cancel: _propTypes.default.string,

  /* If running in React Strict mode, ReactDOM.findDOMNode() is deprecated.
   * Unfortunately, in order for <Draggable> to work properly, we need raw access
   * to the underlying DOM node. If you want to avoid the warning, pass a `nodeRef`
   * as in this example:
   *
   * function MyComponent() {
   *   const nodeRef = React.useRef(null);
   *   return (
   *     <Draggable nodeRef={nodeRef}>
   *       <div ref={nodeRef}>Example Target</div>
   *     </Draggable>
   *   );
   * }
   *
   * This can be used for arbitrarily nested components, so long as the ref ends up
   * pointing to the actual child DOM node and not a custom component.
   */
  nodeRef: _propTypes.default.object,

  /**
   * Called when dragging starts.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onStart: _propTypes.default.func,

  /**
   * Called while dragging.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onDrag: _propTypes.default.func,

  /**
   * Called when dragging stops.
   * If this function returns the boolean false, the drag will remain active.
   */
  onStop: _propTypes.default.func,

  /**
   * A workaround option which can be passed if onMouseDown needs to be accessed,
   * since it'll always be blocked (as there is internal use of onMouseDown)
   */
  onMouseDown: _propTypes.default.func,

  /**
   * `scale`, if set, applies scaling while dragging an element
   */
  scale: _propTypes.default.number,

  /**
   * These properties should be defined on the child, not here.
   */
  className: shims.dontSetMe,
  style: shims.dontSetMe,
  transform: shims.dontSetMe
});

_defineProperty(DraggableCore, "defaultProps", {
  allowAnyClick: false,
  // by default only accept left click
  cancel: null,
  disabled: false,
  enableUserSelectHack: true,
  offsetParent: null,
  handle: null,
  grid: null,
  transform: null,
  onStart: function onStart() {},
  onDrag: function onDrag() {},
  onStop: function onStop() {},
  onMouseDown: function onMouseDown() {},
  scale: 1
});
});

var Draggable_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DraggableCore", {
  enumerable: true,
  get: function get() {
    return _DraggableCore.default;
  }
});
exports.default = void 0;

var React$1 = _interopRequireWildcard(React);

var _propTypes = _interopRequireDefault(propTypes);

var _reactDom = _interopRequireDefault(require$$2);

var _classnames = _interopRequireDefault(classnames);







var _DraggableCore = _interopRequireDefault(DraggableCore_1);

var _log = _interopRequireDefault(log_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
// Define <Draggable>
//
var Draggable = /*#__PURE__*/function (_React$Component) {
  _inherits(Draggable, _React$Component);

  var _super = _createSuper(Draggable);

  _createClass(Draggable, null, [{
    key: "getDerivedStateFromProps",
    // React 16.3+
    // Arity (props, state)
    value: function getDerivedStateFromProps(_ref, _ref2) {
      var position = _ref.position;
      var prevPropsPosition = _ref2.prevPropsPosition;

      // Set x/y if a new position is provided in props that is different than the previous.
      if (position && (!prevPropsPosition || position.x !== prevPropsPosition.x || position.y !== prevPropsPosition.y)) {
        (0, _log.default)('Draggable: getDerivedStateFromProps %j', {
          position: position,
          prevPropsPosition: prevPropsPosition
        });
        return {
          x: position.x,
          y: position.y,
          prevPropsPosition: _objectSpread({}, position)
        };
      }

      return null;
    }
  }]);

  function Draggable(props
  /*: DraggableProps*/
  ) {
    var _this;

    _classCallCheck(this, Draggable);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onDragStart", function (e, coreData) {
      (0, _log.default)('Draggable: onDragStart: %j', coreData); // Short-circuit if user's callback killed it.

      var shouldStart = _this.props.onStart(e, (0, positionFns.createDraggableData)(_assertThisInitialized(_this), coreData)); // Kills start event on core as well, so move handlers are never bound.


      if (shouldStart === false) return false;

      _this.setState({
        dragging: true,
        dragged: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onDrag", function (e, coreData) {
      if (!_this.state.dragging) return false;
      (0, _log.default)('Draggable: onDrag: %j', coreData);
      var uiData = (0, positionFns.createDraggableData)(_assertThisInitialized(_this), coreData);
      var newState
      /*: $Shape<DraggableState>*/
      = {
        x: uiData.x,
        y: uiData.y
      }; // Keep within bounds.

      if (_this.props.bounds) {
        // Save original x and y.
        var x = newState.x,
            y = newState.y; // Add slack to the values used to calculate bound position. This will ensure that if
        // we start removing slack, the element won't react to it right away until it's been
        // completely removed.

        newState.x += _this.state.slackX;
        newState.y += _this.state.slackY; // Get bound position. This will ceil/floor the x and y within the boundaries.

        var _getBoundPosition = (0, positionFns.getBoundPosition)(_assertThisInitialized(_this), newState.x, newState.y),
            _getBoundPosition2 = _slicedToArray(_getBoundPosition, 2),
            newStateX = _getBoundPosition2[0],
            newStateY = _getBoundPosition2[1];

        newState.x = newStateX;
        newState.y = newStateY; // Recalculate slack by noting how much was shaved by the boundPosition handler.

        newState.slackX = _this.state.slackX + (x - newState.x);
        newState.slackY = _this.state.slackY + (y - newState.y); // Update the event we fire to reflect what really happened after bounds took effect.

        uiData.x = newState.x;
        uiData.y = newState.y;
        uiData.deltaX = newState.x - _this.state.x;
        uiData.deltaY = newState.y - _this.state.y;
      } // Short-circuit if user's callback killed it.


      var shouldUpdate = _this.props.onDrag(e, uiData);

      if (shouldUpdate === false) return false;

      _this.setState(newState);
    });

    _defineProperty(_assertThisInitialized(_this), "onDragStop", function (e, coreData) {
      if (!_this.state.dragging) return false; // Short-circuit if user's callback killed it.

      var shouldContinue = _this.props.onStop(e, (0, positionFns.createDraggableData)(_assertThisInitialized(_this), coreData));

      if (shouldContinue === false) return false;
      (0, _log.default)('Draggable: onDragStop: %j', coreData);
      var newState
      /*: $Shape<DraggableState>*/
      = {
        dragging: false,
        slackX: 0,
        slackY: 0
      }; // If this is a controlled component, the result of this operation will be to
      // revert back to the old position. We expect a handler on `onDragStop`, at the least.

      var controlled = Boolean(_this.props.position);

      if (controlled) {
        var _this$props$position = _this.props.position,
            x = _this$props$position.x,
            y = _this$props$position.y;
        newState.x = x;
        newState.y = y;
      }

      _this.setState(newState);
    });

    _this.state = {
      // Whether or not we are currently dragging.
      dragging: false,
      // Whether or not we have been dragged before.
      dragged: false,
      // Current transform x and y.
      x: props.position ? props.position.x : props.defaultPosition.x,
      y: props.position ? props.position.y : props.defaultPosition.y,
      prevPropsPosition: _objectSpread({}, props.position),
      // Used for compensating for out-of-bounds drags
      slackX: 0,
      slackY: 0,
      // Can only determine if SVG after mounting
      isElementSVG: false
    };

    if (props.position && !(props.onDrag || props.onStop)) {
      // eslint-disable-next-line no-console
      console.warn('A `position` was applied to this <Draggable>, without drag handlers. This will make this ' + 'component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the ' + '`position` of this element.');
    }

    return _this;
  }

  _createClass(Draggable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Check to see if the element passed is an instanceof SVGElement
      if (typeof window.SVGElement !== 'undefined' && this.findDOMNode() instanceof window.SVGElement) {
        this.setState({
          isElementSVG: true
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.setState({
        dragging: false
      }); // prevents invariant if unmounted while dragging
    } // React Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.

  }, {
    key: "findDOMNode",
    value: function findDOMNode()
    /*: ?HTMLElement*/
    {
      return this.props.nodeRef ? this.props.nodeRef.current : _reactDom.default.findDOMNode(this);
    }
  }, {
    key: "render",
    value: function render()
    /*: ReactElement<any>*/
    {
      var _classNames;

      var _this$props = this.props;
          _this$props.axis;
          _this$props.bounds;
          var children = _this$props.children,
          defaultPosition = _this$props.defaultPosition,
          defaultClassName = _this$props.defaultClassName,
          defaultClassNameDragging = _this$props.defaultClassNameDragging,
          defaultClassNameDragged = _this$props.defaultClassNameDragged,
          position = _this$props.position,
          positionOffset = _this$props.positionOffset;
          _this$props.scale;
          var draggableCoreProps = _objectWithoutProperties(_this$props, ["axis", "bounds", "children", "defaultPosition", "defaultClassName", "defaultClassNameDragging", "defaultClassNameDragged", "position", "positionOffset", "scale"]);

      var style = {};
      var svgTransform = null; // If this is controlled, we don't want to move it - unless it's dragging.

      var controlled = Boolean(position);
      var draggable = !controlled || this.state.dragging;
      var validPosition = position || defaultPosition;
      var transformOpts = {
        // Set left if horizontal drag is enabled
        x: (0, positionFns.canDragX)(this) && draggable ? this.state.x : validPosition.x,
        // Set top if vertical drag is enabled
        y: (0, positionFns.canDragY)(this) && draggable ? this.state.y : validPosition.y
      }; // If this element was SVG, we use the `transform` attribute.

      if (this.state.isElementSVG) {
        svgTransform = (0, domFns.createSVGTransform)(transformOpts, positionOffset);
      } else {
        // Add a CSS transform to move the element around. This allows us to move the element around
        // without worrying about whether or not it is relatively or absolutely positioned.
        // If the item you are dragging already has a transform set, wrap it in a <span> so <Draggable>
        // has a clean slate.
        style = (0, domFns.createCSSTransform)(transformOpts, positionOffset);
      } // Mark with class while dragging


      var className = (0, _classnames.default)(children.props.className || '', defaultClassName, (_classNames = {}, _defineProperty(_classNames, defaultClassNameDragging, this.state.dragging), _defineProperty(_classNames, defaultClassNameDragged, this.state.dragged), _classNames)); // Reuse the child provided
      // This makes it flexible to use whatever element is wanted (div, ul, etc)

      return /*#__PURE__*/React$1.createElement(_DraggableCore.default, _extends({}, draggableCoreProps, {
        onStart: this.onDragStart,
        onDrag: this.onDrag,
        onStop: this.onDragStop
      }), React$1.cloneElement(React$1.Children.only(children), {
        className: className,
        style: _objectSpread(_objectSpread({}, children.props.style), style),
        transform: svgTransform
      }));
    }
  }]);

  return Draggable;
}(React$1.Component);

exports.default = Draggable;

_defineProperty(Draggable, "displayName", 'Draggable');

_defineProperty(Draggable, "propTypes", _objectSpread(_objectSpread({}, _DraggableCore.default.propTypes), {}, {
  /**
   * `axis` determines which axis the draggable can move.
   *
   *  Note that all callbacks will still return data as normal. This only
   *  controls flushing to the DOM.
   *
   * 'both' allows movement horizontally and vertically.
   * 'x' limits movement to horizontal axis.
   * 'y' limits movement to vertical axis.
   * 'none' limits all movement.
   *
   * Defaults to 'both'.
   */
  axis: _propTypes.default.oneOf(['both', 'x', 'y', 'none']),

  /**
   * `bounds` determines the range of movement available to the element.
   * Available values are:
   *
   * 'parent' restricts movement within the Draggable's parent node.
   *
   * Alternatively, pass an object with the following properties, all of which are optional:
   *
   * {left: LEFT_BOUND, right: RIGHT_BOUND, bottom: BOTTOM_BOUND, top: TOP_BOUND}
   *
   * All values are in px.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *         return (
   *            <Draggable bounds={{right: 300, bottom: 300}}>
   *              <div>Content</div>
   *           </Draggable>
   *         );
   *       }
   *   });
   * ```
   */
  bounds: _propTypes.default.oneOfType([_propTypes.default.shape({
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number,
    bottom: _propTypes.default.number
  }), _propTypes.default.string, _propTypes.default.oneOf([false])]),
  defaultClassName: _propTypes.default.string,
  defaultClassNameDragging: _propTypes.default.string,
  defaultClassNameDragged: _propTypes.default.string,

  /**
   * `defaultPosition` specifies the x and y that the dragged item should start at
   *
   * Example:
   *
   * ```jsx
   *      let App = React.createClass({
   *          render: function () {
   *              return (
   *                  <Draggable defaultPosition={{x: 25, y: 25}}>
   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
   *                  </Draggable>
   *              );
   *          }
   *      });
   * ```
   */
  defaultPosition: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  positionOffset: _propTypes.default.shape({
    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }),

  /**
   * `position`, if present, defines the current position of the element.
   *
   *  This is similar to how form elements in React work - if no `position` is supplied, the component
   *  is uncontrolled.
   *
   * Example:
   *
   * ```jsx
   *      let App = React.createClass({
   *          render: function () {
   *              return (
   *                  <Draggable position={{x: 25, y: 25}}>
   *                      <div>I start with transformX: 25px and transformY: 25px;</div>
   *                  </Draggable>
   *              );
   *          }
   *      });
   * ```
   */
  position: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),

  /**
   * These properties should be defined on the child, not here.
   */
  className: shims.dontSetMe,
  style: shims.dontSetMe,
  transform: shims.dontSetMe
}));

_defineProperty(Draggable, "defaultProps", _objectSpread(_objectSpread({}, _DraggableCore.default.defaultProps), {}, {
  axis: 'both',
  bounds: false,
  defaultClassName: 'react-draggable',
  defaultClassNameDragging: 'react-draggable-dragging',
  defaultClassNameDragged: 'react-draggable-dragged',
  defaultPosition: {
    x: 0,
    y: 0
  },
  position: null,
  scale: 1
}));
});

var Draggable = Draggable_1.default,
    DraggableCore = Draggable_1.DraggableCore; // Previous versions of this lib exported <Draggable> as the root export. As to no-// them, or TypeScript, we export *both* as the root and as 'default'.
// See https://github.com/mzabriskie/react-draggable/pull/254
// and https://github.com/mzabriskie/react-draggable/issues/266


var cjs = Draggable;
var _default$1 = Draggable;
var DraggableCore_1$1 = DraggableCore;
cjs.default = _default$1;
cjs.DraggableCore = DraggableCore_1$1;

/**
 * The nodes selection rectangle gets displayed when a user
 * made a selectio  with on or several nodes
 */
var NodesSelection = (function (_a) {
    var onSelectionDragStart = _a.onSelectionDragStart, onSelectionDrag = _a.onSelectionDrag, onSelectionDragStop = _a.onSelectionDragStop, onSelectionContextMenu = _a.onSelectionContextMenu;
    var _b = useStoreState$1(function (state) { return state.transform; }), tX = _b[0], tY = _b[1], tScale = _b[2];
    var selectedNodesBbox = useStoreState$1(function (state) { return state.selectedNodesBbox; });
    var selectionActive = useStoreState$1(function (state) { return state.selectionActive; });
    var selectedElements = useStoreState$1(function (state) { return state.selectedElements; });
    var snapToGrid = useStoreState$1(function (state) { return state.snapToGrid; });
    var snapGrid = useStoreState$1(function (state) { return state.snapGrid; });
    var nodes = useStoreState$1(function (state) { return state.nodes; });
    var updateNodePosDiff = useStoreActions$1(function (actions) { return actions.updateNodePosDiff; });
    var nodeRef = useRef(null);
    var grid = useMemo(function () { return (snapToGrid ? snapGrid : [1, 1]); }, [snapToGrid, snapGrid]);
    var selectedNodes = useMemo(function () {
        return selectedElements
            ? selectedElements.filter(isNode).map(function (selectedNode) {
                var matchingNode = nodes.find(function (node) { return node.id === selectedNode.id; });
                return __assign(__assign({}, matchingNode), { position: matchingNode === null || matchingNode === void 0 ? void 0 : matchingNode.__rf.position });
            })
            : [];
    }, [selectedElements, nodes]);
    var style = useMemo(function () { return ({
        transform: "translate(" + tX + "px," + tY + "px) scale(" + tScale + ")",
    }); }, [tX, tY, tScale]);
    var innerStyle = useMemo(function () { return ({
        width: selectedNodesBbox.width,
        height: selectedNodesBbox.height,
        top: selectedNodesBbox.y,
        left: selectedNodesBbox.x,
    }); }, [selectedNodesBbox]);
    var onStart = useCallback(function (event) {
        onSelectionDragStart === null || onSelectionDragStart === void 0 ? void 0 : onSelectionDragStart(event, selectedNodes);
    }, [onSelectionDragStart, selectedNodes]);
    var onDrag = useCallback(function (event, data) {
        if (onSelectionDrag) {
            onSelectionDrag(event, selectedNodes);
        }
        updateNodePosDiff({
            diff: {
                x: data.deltaX,
                y: data.deltaY,
            },
        });
    }, [onSelectionDrag, selectedNodes, updateNodePosDiff]);
    var onStop = useCallback(function (event) {
        updateNodePosDiff({
            isDragging: false,
        });
        onSelectionDragStop === null || onSelectionDragStop === void 0 ? void 0 : onSelectionDragStop(event, selectedNodes);
    }, [selectedNodes, onSelectionDragStop]);
    var onContextMenu = useCallback(function (event) {
        var selectedNodes = selectedElements
            ? selectedElements.filter(isNode).map(function (selectedNode) { return nodes.find(function (node) { return node.id === selectedNode.id; }); })
            : [];
        onSelectionContextMenu === null || onSelectionContextMenu === void 0 ? void 0 : onSelectionContextMenu(event, selectedNodes);
    }, [onSelectionContextMenu]);
    if (!selectedElements || selectionActive) {
        return null;
    }
    return (React.createElement("div", { className: "react-flow__nodesselection", style: style },
        React.createElement(cjs, { scale: tScale, grid: grid, onStart: function (event) { return onStart(event); }, onDrag: function (event, data) { return onDrag(event, data); }, onStop: function (event) { return onStop(event); }, nodeRef: nodeRef },
            React.createElement("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu: onContextMenu, style: innerStyle }))));
});

var FlowRenderer = function (_a) {
    var children = _a.children, onPaneClick = _a.onPaneClick, onPaneContextMenu = _a.onPaneContextMenu, onPaneScroll = _a.onPaneScroll, onElementsRemove = _a.onElementsRemove, deleteKeyCode = _a.deleteKeyCode, onMove = _a.onMove, onMoveStart = _a.onMoveStart, onMoveEnd = _a.onMoveEnd, selectionKeyCode = _a.selectionKeyCode, multiSelectionKeyCode = _a.multiSelectionKeyCode, zoomActivationKeyCode = _a.zoomActivationKeyCode, elementsSelectable = _a.elementsSelectable, zoomOnScroll = _a.zoomOnScroll, zoomOnPinch = _a.zoomOnPinch, panOnScroll = _a.panOnScroll, panOnScrollSpeed = _a.panOnScrollSpeed, panOnScrollMode = _a.panOnScrollMode, zoomOnDoubleClick = _a.zoomOnDoubleClick, paneMoveable = _a.paneMoveable, defaultPosition = _a.defaultPosition, defaultZoom = _a.defaultZoom, translateExtent = _a.translateExtent, onSelectionDragStart = _a.onSelectionDragStart, onSelectionDrag = _a.onSelectionDrag, onSelectionDragStop = _a.onSelectionDragStop, onSelectionContextMenu = _a.onSelectionContextMenu;
    var unsetNodesSelection = useStoreActions$1(function (actions) { return actions.unsetNodesSelection; });
    var resetSelectedElements = useStoreActions$1(function (actions) { return actions.resetSelectedElements; });
    var nodesSelectionActive = useStoreState$1(function (state) { return state.nodesSelectionActive; });
    var selectionKeyPressed = useKeyPress(selectionKeyCode);
    useGlobalKeyHandler({ onElementsRemove: onElementsRemove, deleteKeyCode: deleteKeyCode, multiSelectionKeyCode: multiSelectionKeyCode });
    var onClick = useCallback(function (event) {
        onPaneClick === null || onPaneClick === void 0 ? void 0 : onPaneClick(event);
        unsetNodesSelection();
        resetSelectedElements();
    }, [onPaneClick]);
    var onContextMenu = useCallback(function (event) {
        onPaneContextMenu === null || onPaneContextMenu === void 0 ? void 0 : onPaneContextMenu(event);
    }, [onPaneContextMenu]);
    var onWheel = useCallback(function (event) {
        onPaneScroll === null || onPaneScroll === void 0 ? void 0 : onPaneScroll(event);
    }, [onPaneScroll]);
    return (React.createElement(ZoomPane, { onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, selectionKeyPressed: selectionKeyPressed, elementsSelectable: elementsSelectable, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, zoomOnDoubleClick: zoomOnDoubleClick, paneMoveable: paneMoveable, defaultPosition: defaultPosition, defaultZoom: defaultZoom, translateExtent: translateExtent, zoomActivationKeyCode: zoomActivationKeyCode },
        children,
        React.createElement(UserSelection, { selectionKeyPressed: selectionKeyPressed }),
        nodesSelectionActive && (React.createElement(NodesSelection, { onSelectionDragStart: onSelectionDragStart, onSelectionDrag: onSelectionDrag, onSelectionDragStop: onSelectionDragStop, onSelectionContextMenu: onSelectionContextMenu })),
        React.createElement("div", { className: "react-flow__pane", onClick: onClick, onContextMenu: onContextMenu, onWheel: onWheel })));
};
FlowRenderer.displayName = 'FlowRenderer';
var FlowRenderer$1 = memo(FlowRenderer);

var NodeRenderer = function (props) {
    var transform = useStoreState$1(function (state) { return state.transform; });
    var selectedElements = useStoreState$1(function (state) { return state.selectedElements; });
    var nodesDraggable = useStoreState$1(function (state) { return state.nodesDraggable; });
    var nodesConnectable = useStoreState$1(function (state) { return state.nodesConnectable; });
    var elementsSelectable = useStoreState$1(function (state) { return state.elementsSelectable; });
    var viewportBox = useStoreState$1(function (state) { return state.viewportBox; });
    var nodes = useStoreState$1(function (state) { return state.nodes; });
    var batchUpdateNodeDimensions = useStoreActions$1(function (actions) { return actions.batchUpdateNodeDimensions; });
    var visibleNodes = props.onlyRenderVisibleElements ? getNodesInside(nodes, viewportBox, transform, true) : nodes;
    var transformStyle = useMemo(function () { return ({
        transform: "translate(" + transform[0] + "px," + transform[1] + "px) scale(" + transform[2] + ")",
    }); }, [transform[0], transform[1], transform[2]]);
    var resizeObserver = useMemo(function () {
        if (typeof ResizeObserver === 'undefined') {
            return null;
        }
        return new ResizeObserver(function (entries) {
            var updates = entries.map(function (entry) { return ({
                id: entry.target.getAttribute('data-id'),
                nodeElement: entry.target,
            }); });
            batchUpdateNodeDimensions({ updates: updates });
        });
    }, []);
    return (React.createElement("div", { className: "react-flow__nodes", style: transformStyle }, visibleNodes.map(function (node) {
        var nodeType = node.type || 'default';
        var NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default);
        if (!props.nodeTypes[nodeType]) {
            console.warn("Node type \"" + nodeType + "\" not found. Using fallback type \"default\".");
        }
        var isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        var isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        var isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
        return (React.createElement(NodeComponent, { key: node.id, id: node.id, className: node.className, style: node.style, type: nodeType, data: node.data, sourcePosition: node.sourcePosition, targetPosition: node.targetPosition, isHidden: node.isHidden, xPos: node.__rf.position.x, yPos: node.__rf.position.y, isDragging: node.__rf.isDragging, isInitialized: node.__rf.width !== null && node.__rf.height !== null, snapGrid: props.snapGrid, snapToGrid: props.snapToGrid, selectNodesOnDrag: props.selectNodesOnDrag, onClick: props.onElementClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onNodeDragStart: props.onNodeDragStart, onNodeDrag: props.onNodeDrag, onNodeDragStop: props.onNodeDragStop, scale: transform[2], selected: (selectedElements === null || selectedElements === void 0 ? void 0 : selectedElements.some(function (_a) {
                var id = _a.id;
                return id === node.id;
            })) || false, isDraggable: isDraggable, isSelectable: isSelectable, isConnectable: isConnectable, resizeObserver: resizeObserver }));
    })));
};
NodeRenderer.displayName = 'NodeRenderer';
var NodeRenderer$1 = memo(NodeRenderer);

var EdgeText = memo(function (_a) {
    var x = _a.x, y = _a.y, label = _a.label, _b = _a.labelStyle, labelStyle = _b === void 0 ? {} : _b, _c = _a.labelShowBg, labelShowBg = _c === void 0 ? true : _c, _d = _a.labelBgStyle, labelBgStyle = _d === void 0 ? {} : _d, _e = _a.labelBgPadding, labelBgPadding = _e === void 0 ? [2, 4] : _e, _f = _a.labelBgBorderRadius, labelBgBorderRadius = _f === void 0 ? 2 : _f;
    var edgeRef = useRef(null);
    var _g = useState({ x: 0, y: 0, width: 0, height: 0 }), edgeTextBbox = _g[0], setEdgeTextBbox = _g[1];
    useEffect(function () {
        if (edgeRef.current) {
            var textBbox = edgeRef.current.getBBox();
            setEdgeTextBbox({
                x: textBbox.x,
                y: textBbox.y,
                width: textBbox.width,
                height: textBbox.height,
            });
        }
    }, []);
    if (typeof label === 'undefined' || !label) {
        return null;
    }
    return (React.createElement("g", { transform: "translate(" + (x - edgeTextBbox.width / 2) + " " + (y - edgeTextBbox.height / 2) + ")" },
        labelShowBg && (React.createElement("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius })),
        React.createElement("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeRef, style: labelStyle }, label)));
});

var getMarkerEnd = function (arrowHeadType, markerEndId) {
    if (typeof markerEndId !== 'undefined' && markerEndId) {
        return "url(#" + markerEndId + ")";
    }
    return typeof arrowHeadType !== 'undefined' ? "url(#react-flow__" + arrowHeadType + ")" : 'none';
};
var getCenter = function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY;
    var xOffset = Math.abs(targetX - sourceX) / 2;
    var centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
    var yOffset = Math.abs(targetY - sourceY) / 2;
    var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    return [centerX, centerY, xOffset, yOffset];
};

function getBezierPath(_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, _b = _a.sourcePosition, sourcePosition = _b === void 0 ? Position.Bottom : _b, targetX = _a.targetX, targetY = _a.targetY, _c = _a.targetPosition, targetPosition = _c === void 0 ? Position.Top : _c, centerX = _a.centerX, centerY = _a.centerY;
    var _d = getCenter({ sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY }), _centerX = _d[0], _centerY = _d[1];
    var leftAndRight = [Position.Left, Position.Right];
    var cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    var cY = typeof centerY !== 'undefined' ? centerY : _centerY;
    var path = "M" + sourceX + "," + sourceY + " C" + sourceX + "," + cY + " " + targetX + "," + cY + " " + targetX + "," + targetY;
    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
        path = "M" + sourceX + "," + sourceY + " C" + cX + "," + sourceY + " " + cX + "," + targetY + " " + targetX + "," + targetY;
    }
    else if (leftAndRight.includes(targetPosition)) {
        path = "M" + sourceX + "," + sourceY + " C" + sourceX + "," + targetY + " " + sourceX + "," + targetY + " " + targetX + "," + targetY;
    }
    else if (leftAndRight.includes(sourcePosition)) {
        path = "M" + sourceX + "," + sourceY + " C" + targetX + "," + sourceY + " " + targetX + "," + sourceY + " " + targetX + "," + targetY;
    }
    return path;
}
var BezierEdge = memo(function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, _b = _a.sourcePosition, sourcePosition = _b === void 0 ? Position.Bottom : _b, _c = _a.targetPosition, targetPosition = _c === void 0 ? Position.Top : _c, label = _a.label, labelStyle = _a.labelStyle, labelShowBg = _a.labelShowBg, labelBgStyle = _a.labelBgStyle, labelBgPadding = _a.labelBgPadding, labelBgBorderRadius = _a.labelBgBorderRadius, style = _a.style, arrowHeadType = _a.arrowHeadType, markerEndId = _a.markerEndId;
    var _d = getCenter({ sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY }), centerX = _d[0], centerY = _d[1];
    var path = getBezierPath({
        sourceX: sourceX,
        sourceY: sourceY,
        sourcePosition: sourcePosition,
        targetX: targetX,
        targetY: targetY,
        targetPosition: targetPosition,
    });
    var text = label ? (React.createElement(EdgeText, { x: centerX, y: centerY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius })) : null;
    var markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    return (React.createElement(React.Fragment, null,
        React.createElement("path", { style: style, d: path, className: "react-flow__edge-path", markerEnd: markerEnd }),
        text));
});

// These are some helper methods for drawing the round corners
// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.
var bottomLeftCorner = function (x, y, size) {
    return "L " + x + "," + (y - size) + "Q " + x + "," + y + " " + (x + size) + "," + y;
};
var leftBottomCorner = function (x, y, size) {
    return "L " + (x + size) + "," + y + "Q " + x + "," + y + " " + x + "," + (y - size);
};
var bottomRightCorner = function (x, y, size) {
    return "L " + x + "," + (y - size) + "Q " + x + "," + y + " " + (x - size) + "," + y;
};
var rightBottomCorner = function (x, y, size) {
    return "L " + (x - size) + "," + y + "Q " + x + "," + y + " " + x + "," + (y - size);
};
var leftTopCorner = function (x, y, size) { return "L " + (x + size) + "," + y + "Q " + x + "," + y + " " + x + "," + (y + size); };
var topLeftCorner = function (x, y, size) { return "L " + x + "," + (y + size) + "Q " + x + "," + y + " " + (x + size) + "," + y; };
var topRightCorner = function (x, y, size) { return "L " + x + "," + (y + size) + "Q " + x + "," + y + " " + (x - size) + "," + y; };
var rightTopCorner = function (x, y, size) { return "L " + (x - size) + "," + y + "Q " + x + "," + y + " " + x + "," + (y + size); };
function getSmoothStepPath(_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, _b = _a.sourcePosition, sourcePosition = _b === void 0 ? Position.Bottom : _b, targetX = _a.targetX, targetY = _a.targetY, _c = _a.targetPosition, targetPosition = _c === void 0 ? Position.Top : _c, _d = _a.borderRadius, borderRadius = _d === void 0 ? 5 : _d, centerX = _a.centerX, centerY = _a.centerY;
    var _e = getCenter({ sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY }), _centerX = _e[0], _centerY = _e[1], offsetX = _e[2], offsetY = _e[3];
    var cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
    var cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
    var cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
    var leftAndRight = [Position.Left, Position.Right];
    var cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    var cY = typeof centerY !== 'undefined' ? centerY : _centerY;
    var firstCornerPath = null;
    var secondCornerPath = null;
    if (sourceX <= targetX) {
        firstCornerPath =
            sourceY <= targetY ? bottomLeftCorner(sourceX, cY, cornerSize) : topLeftCorner(sourceX, cY, cornerSize);
        secondCornerPath =
            sourceY <= targetY ? rightTopCorner(targetX, cY, cornerSize) : rightBottomCorner(targetX, cY, cornerSize);
    }
    else {
        firstCornerPath =
            sourceY < targetY ? bottomRightCorner(sourceX, cY, cornerSize) : topRightCorner(sourceX, cY, cornerSize);
        secondCornerPath =
            sourceY < targetY ? leftTopCorner(targetX, cY, cornerSize) : leftBottomCorner(targetX, cY, cornerSize);
    }
    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
        if (sourceX <= targetX) {
            firstCornerPath =
                sourceY <= targetY ? rightTopCorner(cX, sourceY, cornerSize) : rightBottomCorner(cX, sourceY, cornerSize);
            secondCornerPath =
                sourceY <= targetY ? bottomLeftCorner(cX, targetY, cornerSize) : topLeftCorner(cX, targetY, cornerSize);
        }
    }
    else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
        if (sourceX <= targetX) {
            firstCornerPath =
                sourceY <= targetY
                    ? rightTopCorner(targetX, sourceY, cornerSize)
                    : rightBottomCorner(targetX, sourceY, cornerSize);
        }
        else {
            firstCornerPath =
                sourceY <= targetY
                    ? bottomRightCorner(sourceX, targetY, cornerSize)
                    : topRightCorner(sourceX, targetY, cornerSize);
        }
        secondCornerPath = '';
    }
    else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
        if (sourceX <= targetX) {
            firstCornerPath =
                sourceY <= targetY
                    ? bottomLeftCorner(sourceX, targetY, cornerSize)
                    : topLeftCorner(sourceX, targetY, cornerSize);
        }
        else {
            firstCornerPath =
                sourceY <= targetY
                    ? bottomRightCorner(sourceX, targetY, cornerSize)
                    : topRightCorner(sourceX, targetY, cornerSize);
        }
        secondCornerPath = '';
    }
    return "M " + sourceX + "," + sourceY + firstCornerPath + secondCornerPath + "L " + targetX + "," + targetY;
}
var SmoothStepEdge = memo(function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, label = _a.label, labelStyle = _a.labelStyle, labelShowBg = _a.labelShowBg, labelBgStyle = _a.labelBgStyle, labelBgPadding = _a.labelBgPadding, labelBgBorderRadius = _a.labelBgBorderRadius, style = _a.style, _b = _a.sourcePosition, sourcePosition = _b === void 0 ? Position.Bottom : _b, _c = _a.targetPosition, targetPosition = _c === void 0 ? Position.Top : _c, arrowHeadType = _a.arrowHeadType, markerEndId = _a.markerEndId, _d = _a.borderRadius, borderRadius = _d === void 0 ? 5 : _d;
    var _e = getCenter({ sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY }), centerX = _e[0], centerY = _e[1];
    var path = getSmoothStepPath({
        sourceX: sourceX,
        sourceY: sourceY,
        sourcePosition: sourcePosition,
        targetX: targetX,
        targetY: targetY,
        targetPosition: targetPosition,
        borderRadius: borderRadius,
    });
    var markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    var text = label ? (React.createElement(EdgeText, { x: centerX, y: centerY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius })) : null;
    return (React.createElement(React.Fragment, null,
        React.createElement("path", { style: style, className: "react-flow__edge-path", d: path, markerEnd: markerEnd }),
        text));
});

var ConnectionLine = (function (_a) {
    var connectionNodeId = _a.connectionNodeId, connectionHandleId = _a.connectionHandleId, connectionHandleType = _a.connectionHandleType, connectionLineStyle = _a.connectionLineStyle, connectionPositionX = _a.connectionPositionX, connectionPositionY = _a.connectionPositionY, _b = _a.connectionLineType, connectionLineType = _b === void 0 ? ConnectionLineType.Bezier : _b, _c = _a.nodes, nodes = _c === void 0 ? [] : _c, transform = _a.transform, isConnectable = _a.isConnectable, CustomConnectionLineComponent = _a.CustomConnectionLineComponent;
    var _d = useState(null), sourceNode = _d[0], setSourceNode = _d[1];
    var nodeId = connectionNodeId;
    var handleId = connectionHandleId;
    useEffect(function () {
        var nextSourceNode = nodes.find(function (n) { return n.id === nodeId; }) || null;
        setSourceNode(nextSourceNode);
    }, []);
    if (!sourceNode || !isConnectable) {
        return null;
    }
    var sourceHandle = handleId
        ? sourceNode.__rf.handleBounds[connectionHandleType].find(function (d) { return d.id === handleId; })
        : sourceNode.__rf.handleBounds[connectionHandleType][0];
    var sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : sourceNode.__rf.width / 2;
    var sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNode.__rf.height;
    var sourceX = sourceNode.__rf.position.x + sourceHandleX;
    var sourceY = sourceNode.__rf.position.y + sourceHandleY;
    var targetX = (connectionPositionX - transform[0]) / transform[2];
    var targetY = (connectionPositionY - transform[1]) / transform[2];
    var isRightOrLeft = (sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position) === Position.Left || (sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position) === Position.Right;
    var targetPosition = isRightOrLeft ? Position.Left : Position.Top;
    if (CustomConnectionLineComponent) {
        return (React.createElement("g", { className: "react-flow__connection" },
            React.createElement(CustomConnectionLineComponent, { sourceX: sourceX, sourceY: sourceY, sourcePosition: sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position, targetX: targetX, targetY: targetY, targetPosition: targetPosition, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle })));
    }
    var dAttr = '';
    if (connectionLineType === ConnectionLineType.Bezier) {
        dAttr = getBezierPath({
            sourceX: sourceX,
            sourceY: sourceY,
            sourcePosition: sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position,
            targetX: targetX,
            targetY: targetY,
            targetPosition: targetPosition,
        });
    }
    else if (connectionLineType === ConnectionLineType.Step) {
        dAttr = getSmoothStepPath({
            sourceX: sourceX,
            sourceY: sourceY,
            sourcePosition: sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position,
            targetX: targetX,
            targetY: targetY,
            targetPosition: targetPosition,
            borderRadius: 0,
        });
    }
    else if (connectionLineType === ConnectionLineType.SmoothStep) {
        dAttr = getSmoothStepPath({
            sourceX: sourceX,
            sourceY: sourceY,
            sourcePosition: sourceHandle === null || sourceHandle === void 0 ? void 0 : sourceHandle.position,
            targetX: targetX,
            targetY: targetY,
            targetPosition: targetPosition,
        });
    }
    else {
        dAttr = "M" + sourceX + "," + sourceY + " " + targetX + "," + targetY;
    }
    return (React.createElement("g", { className: "react-flow__connection" },
        React.createElement("path", { d: dAttr, className: "react-flow__connection-path", style: connectionLineStyle })));
});

var Marker = function (_a) {
    var id = _a.id, children = _a.children;
    return (React.createElement("marker", { className: "react-flow__arrowhead", id: id, markerWidth: "12.5", markerHeight: "12.5", viewBox: "-10 -10 20 20", orient: "auto", refX: "0", refY: "0" }, children));
};
var MarkerDefinitions = function (_a) {
    var color = _a.color;
    return (React.createElement("defs", null,
        React.createElement(Marker, { id: "react-flow__arrowclosed" },
            React.createElement("polyline", { stroke: color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1", fill: color, points: "-5,-4 0,0 -5,4 -5,-4" })),
        React.createElement(Marker, { id: "react-flow__arrow" },
            React.createElement("polyline", { stroke: color, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5", fill: "none", points: "-5,-4 0,0 -5,4" }))));
};
MarkerDefinitions.displayName = 'MarkerDefinitions';

var StepEdge = memo(function (props) {
    return React.createElement(SmoothStepEdge, __assign({}, props, { borderRadius: 0 }));
});

var StraightEdge = memo(function (_a) {
    var sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, label = _a.label, labelStyle = _a.labelStyle, labelShowBg = _a.labelShowBg, labelBgStyle = _a.labelBgStyle, labelBgPadding = _a.labelBgPadding, labelBgBorderRadius = _a.labelBgBorderRadius, style = _a.style, arrowHeadType = _a.arrowHeadType, markerEndId = _a.markerEndId;
    var yOffset = Math.abs(targetY - sourceY) / 2;
    var centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    var xOffset = Math.abs(targetX - sourceX) / 2;
    var centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
    var markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    var text = label ? (React.createElement(EdgeText, { x: centerX, y: centerY, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius })) : null;
    return (React.createElement(React.Fragment, null,
        React.createElement("path", { style: style, className: "react-flow__edge-path", d: "M " + sourceX + "," + sourceY + "L " + targetX + "," + targetY, markerEnd: markerEnd }),
        text));
});

// checks if element below mouse is a handle and returns connection in form of an object { source: 123, target: 312 }
function checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection) {
    var elementBelow = document.elementFromPoint(event.clientX, event.clientY);
    var elementBelowIsTarget = (elementBelow === null || elementBelow === void 0 ? void 0 : elementBelow.classList.contains('target')) || false;
    var elementBelowIsSource = (elementBelow === null || elementBelow === void 0 ? void 0 : elementBelow.classList.contains('source')) || false;
    var result = {
        elementBelow: elementBelow,
        isValid: false,
        connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
        isHoveringHandle: false,
    };
    if (elementBelow && (elementBelowIsTarget || elementBelowIsSource)) {
        result.isHoveringHandle = true;
        // in strict mode we don't allow target to target or source to source connections
        var isValid = connectionMode === ConnectionMode.Strict
            ? (isTarget && elementBelowIsSource) || (!isTarget && elementBelowIsTarget)
            : true;
        if (isValid) {
            var elementBelowNodeId = elementBelow.getAttribute('data-nodeid');
            var elementBelowHandleId = elementBelow.getAttribute('data-handleid');
            var connection = isTarget
                ? {
                    source: elementBelowNodeId,
                    sourceHandle: elementBelowHandleId,
                    target: nodeId,
                    targetHandle: handleId,
                }
                : {
                    source: nodeId,
                    sourceHandle: handleId,
                    target: elementBelowNodeId,
                    targetHandle: elementBelowHandleId,
                };
            result.connection = connection;
            result.isValid = isValidConnection(connection);
        }
    }
    return result;
}
function resetRecentHandle(hoveredHandle) {
    hoveredHandle === null || hoveredHandle === void 0 ? void 0 : hoveredHandle.classList.remove('react-flow__handle-valid');
    hoveredHandle === null || hoveredHandle === void 0 ? void 0 : hoveredHandle.classList.remove('react-flow__handle-connecting');
}
function onMouseDown(event, handleId, nodeId, setConnectionNodeId, setPosition, onConnect, isTarget, isValidConnection, connectionMode, onConnectStart, onConnectStop, onConnectEnd) {
    var reactFlowNode = event.target.closest('.react-flow');
    if (!reactFlowNode) {
        return;
    }
    var handleType = isTarget ? 'target' : 'source';
    var containerBounds = reactFlowNode.getBoundingClientRect();
    var recentHoveredHandle;
    setPosition({
        x: event.clientX - containerBounds.left,
        y: event.clientY - containerBounds.top,
    });
    setConnectionNodeId({ connectionNodeId: nodeId, connectionHandleId: handleId, connectionHandleType: handleType });
    onConnectStart === null || onConnectStart === void 0 ? void 0 : onConnectStart(event, { nodeId: nodeId, handleId: handleId, handleType: handleType });
    function onMouseMove(event) {
        setPosition({
            x: event.clientX - containerBounds.left,
            y: event.clientY - containerBounds.top,
        });
        var _a = checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection), connection = _a.connection, elementBelow = _a.elementBelow, isValid = _a.isValid, isHoveringHandle = _a.isHoveringHandle;
        if (!isHoveringHandle) {
            return resetRecentHandle(recentHoveredHandle);
        }
        var isOwnHandle = connection.source === connection.target;
        if (!isOwnHandle && elementBelow) {
            recentHoveredHandle = elementBelow;
            elementBelow.classList.add('react-flow__handle-connecting');
            elementBelow.classList.toggle('react-flow__handle-valid', isValid);
        }
    }
    function onMouseUp(event) {
        var _a = checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection), connection = _a.connection, isValid = _a.isValid;
        onConnectStop === null || onConnectStop === void 0 ? void 0 : onConnectStop(event);
        if (isValid) {
            onConnect === null || onConnect === void 0 ? void 0 : onConnect(connection);
        }
        onConnectEnd === null || onConnectEnd === void 0 ? void 0 : onConnectEnd(event);
        resetRecentHandle(recentHoveredHandle);
        setConnectionNodeId({ connectionNodeId: null, connectionHandleId: null, connectionHandleType: null });
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

var wrapEdge = (function (EdgeComponent) {
    var EdgeWrapper = function (_a) {
        var id = _a.id, className = _a.className, type = _a.type, data = _a.data, onClick = _a.onClick, selected = _a.selected, animated = _a.animated, label = _a.label, labelStyle = _a.labelStyle, labelShowBg = _a.labelShowBg, labelBgStyle = _a.labelBgStyle, labelBgPadding = _a.labelBgPadding, labelBgBorderRadius = _a.labelBgBorderRadius, style = _a.style, arrowHeadType = _a.arrowHeadType, source = _a.source, target = _a.target, sourceX = _a.sourceX, sourceY = _a.sourceY, targetX = _a.targetX, targetY = _a.targetY, sourcePosition = _a.sourcePosition, targetPosition = _a.targetPosition, elementsSelectable = _a.elementsSelectable, markerEndId = _a.markerEndId, isHidden = _a.isHidden, sourceHandleId = _a.sourceHandleId, targetHandleId = _a.targetHandleId, handleEdgeUpdate = _a.handleEdgeUpdate, onConnectEdge = _a.onConnectEdge;
        var addSelectedElements = useStoreActions$1(function (actions) { return actions.addSelectedElements; });
        var setConnectionNodeId = useStoreActions$1(function (actions) { return actions.setConnectionNodeId; });
        var setPosition = useStoreActions$1(function (actions) { return actions.setConnectionPosition; });
        var connectionMode = useStoreState$1(function (state) { return state.connectionMode; });
        var _b = useState(false), updating = _b[0], setUpdating = _b[1];
        var inactive = !elementsSelectable && !onClick;
        var edgeClasses = cc([
            'react-flow__edge',
            "react-flow__edge-" + type,
            className,
            { selected: selected, animated: animated, inactive: inactive, updating: updating },
        ]);
        var onEdgeClick = useCallback(function (event) {
            var edgeElement = {
                id: id,
                source: source,
                target: target,
                type: type,
            };
            if (sourceHandleId) {
                edgeElement.sourceHandle = sourceHandleId;
            }
            if (targetHandleId) {
                edgeElement.targetHandle = targetHandleId;
            }
            if (typeof data !== 'undefined') {
                edgeElement.data = data;
            }
            if (elementsSelectable) {
                addSelectedElements(edgeElement);
            }
            onClick === null || onClick === void 0 ? void 0 : onClick(event, edgeElement);
        }, [elementsSelectable, id, source, target, type, data, sourceHandleId, targetHandleId, onClick]);
        var handleEdgeUpdater = useCallback(function (event, isSourceHandle) {
            var nodeId = isSourceHandle ? target : source;
            var handleId = isSourceHandle ? targetHandleId : sourceHandleId;
            var isValidConnection = function () { return true; };
            var isTarget = isSourceHandle;
            onMouseDown(event, handleId, nodeId, setConnectionNodeId, setPosition, onConnectEdge, isTarget, isValidConnection, connectionMode);
        }, [id, source, target, type, sourceHandleId, targetHandleId, setConnectionNodeId, setPosition]);
        var onEdgeUpdaterSourceMouseDown = useCallback(function (event) {
            handleEdgeUpdater(event, true);
        }, [id, source, sourceHandleId, handleEdgeUpdater]);
        var onEdgeUpdaterTargetMouseDown = useCallback(function (event) {
            handleEdgeUpdater(event, false);
        }, [id, target, targetHandleId, handleEdgeUpdater]);
        var onEdgeUpdaterMouseEnter = useCallback(function () { return setUpdating(true); }, [setUpdating]);
        var onEdgeUpdaterMouseOut = useCallback(function () { return setUpdating(false); }, [setUpdating]);
        if (isHidden) {
            return null;
        }
        return (React.createElement("g", { className: edgeClasses, onClick: onEdgeClick },
            handleEdgeUpdate && (React.createElement("g", { onMouseDown: onEdgeUpdaterSourceMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut },
                React.createElement("circle", { className: "react-flow__edgeupdater", cx: sourceX, cy: sourceY, r: 10, stroke: "transparent", fill: "transparent" }))),
            React.createElement(EdgeComponent, { id: id, source: source, target: target, selected: selected, animated: animated, label: label, labelStyle: labelStyle, labelShowBg: labelShowBg, labelBgStyle: labelBgStyle, labelBgPadding: labelBgPadding, labelBgBorderRadius: labelBgBorderRadius, data: data, style: style, arrowHeadType: arrowHeadType, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, markerEndId: markerEndId, sourceHandleId: sourceHandleId, targetHandleId: targetHandleId }),
            handleEdgeUpdate && (React.createElement("g", { onMouseDown: onEdgeUpdaterTargetMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut },
                React.createElement("circle", { className: "react-flow__edgeupdater", cx: targetX, cy: targetY, r: 10, stroke: "transparent", fill: "transparent" })))));
    };
    EdgeWrapper.displayName = 'EdgeWrapper';
    return memo(EdgeWrapper);
});

function createEdgeTypes(edgeTypes) {
    var standardTypes = {
        default: wrapEdge((edgeTypes.default || BezierEdge)),
        straight: wrapEdge((edgeTypes.bezier || StraightEdge)),
        step: wrapEdge((edgeTypes.step || StepEdge)),
        smoothstep: wrapEdge((edgeTypes.step || SmoothStepEdge)),
    };
    var wrappedTypes = {};
    var specialTypes = Object.keys(edgeTypes)
        .filter(function (k) { return !['default', 'bezier'].includes(k); })
        .reduce(function (res, key) {
        res[key] = wrapEdge((edgeTypes[key] || BezierEdge));
        return res;
    }, wrappedTypes);
    return __assign(__assign({}, standardTypes), specialTypes);
}
function getHandlePosition(position, node, handle) {
    if (handle === void 0) { handle = null; }
    var x = ((handle === null || handle === void 0 ? void 0 : handle.x) || 0) + node.__rf.position.x;
    var y = ((handle === null || handle === void 0 ? void 0 : handle.y) || 0) + node.__rf.position.y;
    var width = (handle === null || handle === void 0 ? void 0 : handle.width) || node.__rf.width;
    var height = (handle === null || handle === void 0 ? void 0 : handle.height) || node.__rf.height;
    switch (position) {
        case Position.Top:
            return {
                x: x + width / 2,
                y: y,
            };
        case Position.Right:
            return {
                x: x + width,
                y: y + height / 2,
            };
        case Position.Bottom:
            return {
                x: x + width / 2,
                y: y + height,
            };
        case Position.Left:
            return {
                x: x,
                y: y + height / 2,
            };
    }
}
function getHandle(bounds, handleId) {
    if (!bounds) {
        return null;
    }
    // there is no handleId when there are no multiple handles/ handles with ids
    // so we just pick the first one
    var handle = null;
    if (bounds.length === 1 || !handleId) {
        handle = bounds[0];
    }
    else if (handleId) {
        handle = bounds.find(function (d) { return d.id === handleId; });
    }
    return typeof handle === 'undefined' ? null : handle;
}
var getEdgePositions = function (sourceNode, sourceHandle, sourcePosition, targetNode, targetHandle, targetPosition) {
    var sourceHandlePos = getHandlePosition(sourcePosition, sourceNode, sourceHandle);
    var targetHandlePos = getHandlePosition(targetPosition, targetNode, targetHandle);
    return {
        sourceX: sourceHandlePos.x,
        sourceY: sourceHandlePos.y,
        targetX: targetHandlePos.x,
        targetY: targetHandlePos.y,
    };
};
function isEdgeVisible(_a) {
    var sourcePos = _a.sourcePos, targetPos = _a.targetPos, width = _a.width, height = _a.height, transform = _a.transform;
    var edgeBox = {
        x: Math.min(sourcePos.x, targetPos.x),
        y: Math.min(sourcePos.y, targetPos.y),
        x2: Math.max(sourcePos.x, targetPos.x),
        y2: Math.max(sourcePos.y, targetPos.y),
    };
    if (edgeBox.x === edgeBox.x2) {
        edgeBox.x2 += 1;
    }
    if (edgeBox.y === edgeBox.y2) {
        edgeBox.y2 += 1;
    }
    var viewBox = rectToBox({
        x: (0 - transform[0]) / transform[2],
        y: (0 - transform[1]) / transform[2],
        width: width / transform[2],
        height: height / transform[2],
    });
    var xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
    var yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
    var overlappingArea = Math.ceil(xOverlap * yOverlap);
    return overlappingArea > 0;
}
var getSourceTargetNodes = function (edge, nodes) {
    return nodes.reduce(function (res, node) {
        if (node.id === edge.source) {
            res.sourceNode = node;
        }
        if (node.id === edge.target) {
            res.targetNode = node;
        }
        return res;
    }, { sourceNode: null, targetNode: null });
};

var Edge = function (_a) {
    var edge = _a.edge, props = _a.props, nodes = _a.nodes, selectedElements = _a.selectedElements, elementsSelectable = _a.elementsSelectable, transform = _a.transform, width = _a.width, height = _a.height, onlyRenderVisibleElements = _a.onlyRenderVisibleElements, connectionMode = _a.connectionMode;
    var sourceHandleId = edge.sourceHandle || null;
    var targetHandleId = edge.targetHandle || null;
    var _b = getSourceTargetNodes(edge, nodes), sourceNode = _b.sourceNode, targetNode = _b.targetNode;
    var onConnectEdge = useCallback(function (connection) {
        var _a;
        (_a = props.onEdgeUpdate) === null || _a === void 0 ? void 0 : _a.call(props, edge, connection);
    }, [edge]);
    if (!sourceNode) {
        console.warn("couldn't create edge for source id: " + edge.source + "; edge id: " + edge.id);
        return null;
    }
    if (!targetNode) {
        console.warn("couldn't create edge for target id: " + edge.target + "; edge id: " + edge.id);
        return null;
    }
    // source and target node need to be initialized
    if (!sourceNode.__rf.width || !targetNode.__rf.width) {
        return null;
    }
    var edgeType = edge.type || 'default';
    var EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
    var targetNodeBounds = targetNode.__rf.handleBounds;
    // when connection type is loose we can define all handles as sources
    var targetNodeHandles = connectionMode === ConnectionMode.Strict
        ? targetNodeBounds.target
        : targetNodeBounds.target || targetNodeBounds.source;
    var sourceHandle = getHandle(sourceNode.__rf.handleBounds.source, sourceHandleId);
    var targetHandle = getHandle(targetNodeHandles, targetHandleId);
    var sourcePosition = sourceHandle ? sourceHandle.position : Position.Bottom;
    var targetPosition = targetHandle ? targetHandle.position : Position.Top;
    if (!sourceHandle) {
        console.warn("couldn't create edge for source handle id: " + sourceHandleId + "; edge id: " + edge.id);
        return null;
    }
    if (!targetHandle) {
        console.warn("couldn't create edge for target handle id: " + targetHandleId + "; edge id: " + edge.id);
        return null;
    }
    var _c = getEdgePositions(sourceNode, sourceHandle, sourcePosition, targetNode, targetHandle, targetPosition), sourceX = _c.sourceX, sourceY = _c.sourceY, targetX = _c.targetX, targetY = _c.targetY;
    var isVisible = onlyRenderVisibleElements
        ? isEdgeVisible({
            sourcePos: { x: sourceX, y: sourceY },
            targetPos: { x: targetX, y: targetY },
            width: width,
            height: height,
            transform: transform,
        })
        : true;
    if (!isVisible) {
        return null;
    }
    var isSelected = (selectedElements === null || selectedElements === void 0 ? void 0 : selectedElements.some(function (elm) { return isEdge(elm) && elm.id === edge.id; })) || false;
    return (React.createElement(EdgeComponent, { key: edge.id, id: edge.id, className: edge.className, type: edge.type, data: edge.data, onClick: props.onElementClick, selected: isSelected, animated: edge.animated, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, style: edge.style, arrowHeadType: edge.arrowHeadType, source: edge.source, target: edge.target, sourceHandleId: sourceHandleId, targetHandleId: targetHandleId, sourceX: sourceX, sourceY: sourceY, targetX: targetX, targetY: targetY, sourcePosition: sourcePosition, targetPosition: targetPosition, elementsSelectable: elementsSelectable, markerEndId: props.markerEndId, isHidden: edge.isHidden, onConnectEdge: onConnectEdge, handleEdgeUpdate: typeof props.onEdgeUpdate !== 'undefined' }));
};
var EdgeRenderer = function (props) {
    var transform = useStoreState$1(function (state) { return state.transform; });
    var edges = useStoreState$1(function (state) { return state.edges; });
    var connectionNodeId = useStoreState$1(function (state) { return state.connectionNodeId; });
    var connectionHandleId = useStoreState$1(function (state) { return state.connectionHandleId; });
    var connectionHandleType = useStoreState$1(function (state) { return state.connectionHandleType; });
    var connectionPosition = useStoreState$1(function (state) { return state.connectionPosition; });
    var selectedElements = useStoreState$1(function (state) { return state.selectedElements; });
    var nodesConnectable = useStoreState$1(function (state) { return state.nodesConnectable; });
    var elementsSelectable = useStoreState$1(function (state) { return state.elementsSelectable; });
    var width = useStoreState$1(function (state) { return state.width; });
    var height = useStoreState$1(function (state) { return state.height; });
    var nodes = useStoreState$1(function (state) { return state.nodes; });
    if (!width) {
        return null;
    }
    var connectionLineType = props.connectionLineType, arrowHeadColor = props.arrowHeadColor, connectionLineStyle = props.connectionLineStyle, connectionLineComponent = props.connectionLineComponent, onlyRenderVisibleElements = props.onlyRenderVisibleElements;
    var transformStyle = "translate(" + transform[0] + "," + transform[1] + ") scale(" + transform[2] + ")";
    var renderConnectionLine = connectionNodeId && connectionHandleType;
    return (React.createElement("svg", { width: width, height: height, className: "react-flow__edges" },
        React.createElement(MarkerDefinitions, { color: arrowHeadColor }),
        React.createElement("g", { transform: transformStyle },
            edges.map(function (edge) { return (React.createElement(Edge, { key: edge.id, edge: edge, props: props, nodes: nodes, selectedElements: selectedElements, elementsSelectable: elementsSelectable, transform: transform, width: width, height: height, onlyRenderVisibleElements: onlyRenderVisibleElements })); }),
            renderConnectionLine && (React.createElement(ConnectionLine, { nodes: nodes, connectionNodeId: connectionNodeId, connectionHandleId: connectionHandleId, connectionHandleType: connectionHandleType, connectionPositionX: connectionPosition.x, connectionPositionY: connectionPosition.y, transform: transform, connectionLineStyle: connectionLineStyle, connectionLineType: connectionLineType, isConnectable: nodesConnectable, CustomConnectionLineComponent: connectionLineComponent })))));
};
EdgeRenderer.displayName = 'EdgeRenderer';
var EdgeRenderer$1 = memo(EdgeRenderer);

var DEFAULT_PADDING = 0.1;
var initialZoomPanHelper = {
    zoomIn: function () { },
    zoomOut: function () { },
    zoomTo: function (_) { },
    transform: function (_) { },
    fitView: function (_) {
    },
    setCenter: function (_, __) { },
    fitBounds: function (_) { },
    initialized: false,
};
var getTransformForBounds = function (bounds, width, height, minZoom, maxZoom, padding) {
    if (padding === void 0) { padding = DEFAULT_PADDING; }
    var xZoom = width / (bounds.width * (1 + padding));
    var yZoom = height / (bounds.height * (1 + padding));
    var zoom = Math.min(xZoom, yZoom);
    var clampedZoom = clamp(zoom, minZoom, maxZoom);
    var boundsCenterX = bounds.x + bounds.width / 2;
    var boundsCenterY = bounds.y + bounds.height / 2;
    var x = width / 2 - boundsCenterX * clampedZoom;
    var y = height / 2 - boundsCenterY * clampedZoom;
    return [x, y, clampedZoom];
};
var useZoomPanHelper = function () {
    var store = useStore$1();
    var d3Zoom = useStoreState$1(function (s) { return s.d3Zoom; });
    var d3Selection = useStoreState$1(function (s) { return s.d3Selection; });
    var zoomPanHelperFunctions = useMemo(function () {
        if (d3Selection && d3Zoom) {
            return {
                zoomIn: function () { return d3Zoom.scaleBy(d3Selection, 1.2); },
                zoomOut: function () { return d3Zoom.scaleBy(d3Selection, 1 / 1.2); },
                zoomTo: function (zoomLevel) { return d3Zoom.scaleTo(d3Selection, zoomLevel); },
                transform: function (transform) {
                    var nextTransform = identity$1.translate(transform.x, transform.y).scale(transform.zoom);
                    d3Zoom.transform(d3Selection, nextTransform);
                },
                fitView: function (options) {
                    var _a;
                    if (options === void 0) { options = { padding: DEFAULT_PADDING, includeHiddenNodes: false }; }
                    var _b = store.getState(), nodes = _b.nodes, width = _b.width, height = _b.height, minZoom = _b.minZoom, maxZoom = _b.maxZoom;
                    if (!nodes.length) {
                        return;
                    }
                    var bounds = getRectOfNodes(options.includeHiddenNodes ? nodes : nodes.filter(function (node) { return !node.isHidden; }));
                    var padding = (_a = options.padding) !== null && _a !== void 0 ? _a : DEFAULT_PADDING;
                    var _c = getTransformForBounds(bounds, width, height, minZoom, maxZoom, padding), x = _c[0], y = _c[1], zoom = _c[2];
                    var transform = identity$1.translate(x, y).scale(zoom);
                    d3Zoom.transform(d3Selection, transform);
                },
                setCenter: function (x, y, zoom) {
                    var _a = store.getState(), width = _a.width, height = _a.height, maxZoom = _a.maxZoom;
                    var nextZoom = typeof zoom !== 'undefined' ? zoom : maxZoom;
                    var centerX = width / 2 - x * nextZoom;
                    var centerY = height / 2 - y * nextZoom;
                    var transform = identity$1.translate(centerX, centerY).scale(nextZoom);
                    d3Zoom.transform(d3Selection, transform);
                },
                fitBounds: function (bounds, padding) {
                    if (padding === void 0) { padding = DEFAULT_PADDING; }
                    var _a = store.getState(), width = _a.width, height = _a.height, minZoom = _a.minZoom, maxZoom = _a.maxZoom;
                    var _b = getTransformForBounds(bounds, width, height, minZoom, maxZoom, padding), x = _b[0], y = _b[1], zoom = _b[2];
                    var transform = identity$1.translate(x, y).scale(zoom);
                    d3Zoom.transform(d3Selection, transform);
                },
                initialized: true,
            };
        }
        return initialZoomPanHelper;
    }, [d3Zoom, d3Selection]);
    return zoomPanHelperFunctions;
};

var GraphView = function (_a) {
    var nodeTypes = _a.nodeTypes, edgeTypes = _a.edgeTypes, onMove = _a.onMove, onMoveStart = _a.onMoveStart, onMoveEnd = _a.onMoveEnd, onLoad = _a.onLoad, onElementClick = _a.onElementClick, onNodeMouseEnter = _a.onNodeMouseEnter, onNodeMouseMove = _a.onNodeMouseMove, onNodeMouseLeave = _a.onNodeMouseLeave, onNodeContextMenu = _a.onNodeContextMenu, onNodeDragStart = _a.onNodeDragStart, onNodeDrag = _a.onNodeDrag, onNodeDragStop = _a.onNodeDragStop, onSelectionDragStart = _a.onSelectionDragStart, onSelectionDrag = _a.onSelectionDrag, onSelectionDragStop = _a.onSelectionDragStop, onSelectionContextMenu = _a.onSelectionContextMenu, connectionMode = _a.connectionMode, connectionLineType = _a.connectionLineType, connectionLineStyle = _a.connectionLineStyle, connectionLineComponent = _a.connectionLineComponent, selectionKeyCode = _a.selectionKeyCode, multiSelectionKeyCode = _a.multiSelectionKeyCode, zoomActivationKeyCode = _a.zoomActivationKeyCode, onElementsRemove = _a.onElementsRemove, deleteKeyCode = _a.deleteKeyCode, onConnect = _a.onConnect, onConnectStart = _a.onConnectStart, onConnectStop = _a.onConnectStop, onConnectEnd = _a.onConnectEnd, snapToGrid = _a.snapToGrid, snapGrid = _a.snapGrid, onlyRenderVisibleElements = _a.onlyRenderVisibleElements, nodesDraggable = _a.nodesDraggable, nodesConnectable = _a.nodesConnectable, elementsSelectable = _a.elementsSelectable, selectNodesOnDrag = _a.selectNodesOnDrag, minZoom = _a.minZoom, maxZoom = _a.maxZoom, defaultZoom = _a.defaultZoom, defaultPosition = _a.defaultPosition, translateExtent = _a.translateExtent, nodeExtent = _a.nodeExtent, arrowHeadColor = _a.arrowHeadColor, markerEndId = _a.markerEndId, zoomOnScroll = _a.zoomOnScroll, zoomOnPinch = _a.zoomOnPinch, panOnScroll = _a.panOnScroll, panOnScrollSpeed = _a.panOnScrollSpeed, panOnScrollMode = _a.panOnScrollMode, zoomOnDoubleClick = _a.zoomOnDoubleClick, paneMoveable = _a.paneMoveable, onPaneClick = _a.onPaneClick, onPaneScroll = _a.onPaneScroll, onPaneContextMenu = _a.onPaneContextMenu, onEdgeUpdate = _a.onEdgeUpdate;
    var isInitialised = useRef(false);
    var setOnConnect = useStoreActions$1(function (actions) { return actions.setOnConnect; });
    var setOnConnectStart = useStoreActions$1(function (actions) { return actions.setOnConnectStart; });
    var setOnConnectStop = useStoreActions$1(function (actions) { return actions.setOnConnectStop; });
    var setOnConnectEnd = useStoreActions$1(function (actions) { return actions.setOnConnectEnd; });
    var setSnapGrid = useStoreActions$1(function (actions) { return actions.setSnapGrid; });
    var setSnapToGrid = useStoreActions$1(function (actions) { return actions.setSnapToGrid; });
    var setNodesDraggable = useStoreActions$1(function (actions) { return actions.setNodesDraggable; });
    var setNodesConnectable = useStoreActions$1(function (actions) { return actions.setNodesConnectable; });
    var setElementsSelectable = useStoreActions$1(function (actions) { return actions.setElementsSelectable; });
    var setMinZoom = useStoreActions$1(function (actions) { return actions.setMinZoom; });
    var setMaxZoom = useStoreActions$1(function (actions) { return actions.setMaxZoom; });
    var setTranslateExtent = useStoreActions$1(function (actions) { return actions.setTranslateExtent; });
    var setNodeExtent = useStoreActions$1(function (actions) { return actions.setNodeExtent; });
    var setConnectionMode = useStoreActions$1(function (actions) { return actions.setConnectionMode; });
    var currentStore = useStore$1();
    var _b = useZoomPanHelper(), zoomIn = _b.zoomIn, zoomOut = _b.zoomOut, zoomTo = _b.zoomTo, transform = _b.transform, fitView = _b.fitView, initialized = _b.initialized;
    useEffect(function () {
        if (!isInitialised.current && initialized) {
            if (onLoad) {
                onLoad({
                    fitView: function (params) {
                        if (params === void 0) { params = { padding: 0.1 }; }
                        return fitView(params);
                    },
                    zoomIn: zoomIn,
                    zoomOut: zoomOut,
                    zoomTo: zoomTo,
                    setTransform: transform,
                    project: onLoadProject(currentStore),
                    getElements: onLoadGetElements(currentStore),
                    toObject: onLoadToObject(currentStore),
                });
            }
            isInitialised.current = true;
        }
    }, [onLoad, zoomIn, zoomOut, zoomTo, transform, fitView, initialized]);
    useEffect(function () {
        if (onConnect) {
            setOnConnect(onConnect);
        }
    }, [onConnect]);
    useEffect(function () {
        if (onConnectStart) {
            setOnConnectStart(onConnectStart);
        }
    }, [onConnectStart]);
    useEffect(function () {
        if (onConnectStop) {
            setOnConnectStop(onConnectStop);
        }
    }, [onConnectStop]);
    useEffect(function () {
        if (onConnectEnd) {
            setOnConnectEnd(onConnectEnd);
        }
    }, [onConnectEnd]);
    useEffect(function () {
        if (typeof snapToGrid !== 'undefined') {
            setSnapToGrid(snapToGrid);
        }
    }, [snapToGrid]);
    useEffect(function () {
        if (typeof snapGrid !== 'undefined') {
            setSnapGrid(snapGrid);
        }
    }, [snapGrid]);
    useEffect(function () {
        if (typeof nodesDraggable !== 'undefined') {
            setNodesDraggable(nodesDraggable);
        }
    }, [nodesDraggable]);
    useEffect(function () {
        if (typeof nodesConnectable !== 'undefined') {
            setNodesConnectable(nodesConnectable);
        }
    }, [nodesConnectable]);
    useEffect(function () {
        if (typeof elementsSelectable !== 'undefined') {
            setElementsSelectable(elementsSelectable);
        }
    }, [elementsSelectable]);
    useEffect(function () {
        if (typeof minZoom !== 'undefined') {
            setMinZoom(minZoom);
        }
    }, [minZoom]);
    useEffect(function () {
        if (typeof maxZoom !== 'undefined') {
            setMaxZoom(maxZoom);
        }
    }, [maxZoom]);
    useEffect(function () {
        if (typeof translateExtent !== 'undefined') {
            setTranslateExtent(translateExtent);
        }
    }, [translateExtent]);
    useEffect(function () {
        if (typeof nodeExtent !== 'undefined') {
            setNodeExtent(nodeExtent);
        }
    }, [nodeExtent]);
    useEffect(function () {
        if (typeof connectionMode !== 'undefined') {
            setConnectionMode(connectionMode);
        }
    }, [connectionMode]);
    return (React.createElement(FlowRenderer$1, { onPaneClick: onPaneClick, onPaneContextMenu: onPaneContextMenu, onPaneScroll: onPaneScroll, onElementsRemove: onElementsRemove, deleteKeyCode: deleteKeyCode, selectionKeyCode: selectionKeyCode, multiSelectionKeyCode: multiSelectionKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, elementsSelectable: elementsSelectable, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, paneMoveable: paneMoveable, defaultPosition: defaultPosition, defaultZoom: defaultZoom, translateExtent: translateExtent, onSelectionDragStart: onSelectionDragStart, onSelectionDrag: onSelectionDrag, onSelectionDragStop: onSelectionDragStop, onSelectionContextMenu: onSelectionContextMenu },
        React.createElement(NodeRenderer$1, { nodeTypes: nodeTypes, onElementClick: onElementClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, onNodeDragStop: onNodeDragStop, onNodeDrag: onNodeDrag, onNodeDragStart: onNodeDragStart, selectNodesOnDrag: selectNodesOnDrag, snapToGrid: snapToGrid, snapGrid: snapGrid, onlyRenderVisibleElements: onlyRenderVisibleElements }),
        React.createElement(EdgeRenderer$1, { edgeTypes: edgeTypes, onElementClick: onElementClick, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, connectionLineComponent: connectionLineComponent, connectionMode: connectionMode, arrowHeadColor: arrowHeadColor, markerEndId: markerEndId, onEdgeUpdate: onEdgeUpdate, onlyRenderVisibleElements: onlyRenderVisibleElements })));
};
GraphView.displayName = 'GraphView';
var GraphView$1 = memo(GraphView);

var ElementUpdater = function (_a) {
    var elements = _a.elements;
    var setElements = useStoreActions$1(function (actions) { return actions.setElements; });
    useEffect(function () {
        setElements(elements);
    }, [elements]);
    return null;
};

var NodeIdContext = createContext(null);
var Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;

var alwaysValid = function () { return true; };
var Handle = function (_a) {
    var _b = _a.type, type = _b === void 0 ? 'source' : _b, _c = _a.position, position = _c === void 0 ? Position.Top : _c, _d = _a.isValidConnection, isValidConnection = _d === void 0 ? alwaysValid : _d, _e = _a.isConnectable, isConnectable = _e === void 0 ? true : _e, id = _a.id, onConnect = _a.onConnect, children = _a.children, className = _a.className, rest = __rest(_a, ["type", "position", "isValidConnection", "isConnectable", "id", "onConnect", "children", "className"]);
    var nodeId = useContext(NodeIdContext);
    var setPosition = useStoreActions$1(function (actions) { return actions.setConnectionPosition; });
    var setConnectionNodeId = useStoreActions$1(function (actions) { return actions.setConnectionNodeId; });
    var onConnectAction = useStoreState$1(function (state) { return state.onConnect; });
    var onConnectStart = useStoreState$1(function (state) { return state.onConnectStart; });
    var onConnectStop = useStoreState$1(function (state) { return state.onConnectStop; });
    var onConnectEnd = useStoreState$1(function (state) { return state.onConnectEnd; });
    var connectionMode = useStoreState$1(function (state) { return state.connectionMode; });
    var handleId = id || null;
    var isTarget = type === 'target';
    var onConnectExtended = useCallback(function (params) {
        onConnectAction === null || onConnectAction === void 0 ? void 0 : onConnectAction(params);
        onConnect === null || onConnect === void 0 ? void 0 : onConnect(params);
    }, [onConnectAction, onConnect]);
    var onMouseDownHandler = useCallback(function (event) {
        onMouseDown(event, handleId, nodeId, setConnectionNodeId, setPosition, onConnectExtended, isTarget, isValidConnection, connectionMode, onConnectStart, onConnectStop, onConnectEnd);
    }, [
        handleId,
        nodeId,
        setConnectionNodeId,
        setPosition,
        onConnectExtended,
        isTarget,
        isValidConnection,
        connectionMode,
        onConnectStart,
        onConnectStop,
        onConnectEnd,
    ]);
    var handleClasses = cc([
        'react-flow__handle',
        "react-flow__handle-" + position,
        'nodrag',
        className,
        {
            source: !isTarget,
            target: isTarget,
            connectable: isConnectable,
        },
    ]);
    return (React.createElement("div", __assign({ "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, className: handleClasses, onMouseDown: onMouseDownHandler }, rest), children));
};
Handle.displayName = 'Handle';
var Handle$1 = memo(Handle);

var DefaultNode = function (_a) {
    var data = _a.data, isConnectable = _a.isConnectable, _b = _a.targetPosition, targetPosition = _b === void 0 ? Position.Top : _b, _c = _a.sourcePosition, sourcePosition = _c === void 0 ? Position.Bottom : _c;
    return (React.createElement(React.Fragment, null,
        React.createElement(Handle$1, { type: "target", position: targetPosition, isConnectable: isConnectable }),
        data.label,
        React.createElement(Handle$1, { type: "source", position: sourcePosition, isConnectable: isConnectable })));
};
DefaultNode.displayName = 'DefaultNode';
var DefaultNode$1 = memo(DefaultNode);

var InputNode = function (_a) {
    var data = _a.data, isConnectable = _a.isConnectable, _b = _a.sourcePosition, sourcePosition = _b === void 0 ? Position.Bottom : _b;
    return (React.createElement(React.Fragment, null,
        data.label,
        React.createElement(Handle$1, { type: "source", position: sourcePosition, isConnectable: isConnectable })));
};
InputNode.displayName = 'InputNode';
var InputNode$1 = memo(InputNode);

var OutputNode = function (_a) {
    var data = _a.data, isConnectable = _a.isConnectable, _b = _a.targetPosition, targetPosition = _b === void 0 ? Position.Top : _b;
    return (React.createElement(React.Fragment, null,
        React.createElement(Handle$1, { type: "target", position: targetPosition, isConnectable: isConnectable }),
        data.label));
};
OutputNode.displayName = 'OutputNode';
var OutputNode$1 = memo(OutputNode);

var wrapNode = (function (NodeComponent) {
    var NodeWrapper = function (_a) {
        var id = _a.id, type = _a.type, data = _a.data, scale = _a.scale, xPos = _a.xPos, yPos = _a.yPos, selected = _a.selected, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseMove = _a.onMouseMove, onMouseLeave = _a.onMouseLeave, onContextMenu = _a.onContextMenu, onNodeDragStart = _a.onNodeDragStart, onNodeDrag = _a.onNodeDrag, onNodeDragStop = _a.onNodeDragStop, style = _a.style, className = _a.className, isDraggable = _a.isDraggable, isSelectable = _a.isSelectable, isConnectable = _a.isConnectable, selectNodesOnDrag = _a.selectNodesOnDrag, sourcePosition = _a.sourcePosition, targetPosition = _a.targetPosition, isHidden = _a.isHidden, isInitialized = _a.isInitialized, snapToGrid = _a.snapToGrid, snapGrid = _a.snapGrid, isDragging = _a.isDragging, resizeObserver = _a.resizeObserver;
        var updateNodeDimensions = useStoreActions$1(function (actions) { return actions.updateNodeDimensions; });
        var addSelectedElements = useStoreActions$1(function (actions) { return actions.addSelectedElements; });
        var updateNodePosDiff = useStoreActions$1(function (actions) { return actions.updateNodePosDiff; });
        var unsetNodesSelection = useStoreActions$1(function (actions) { return actions.unsetNodesSelection; });
        var nodeElement = useRef(null);
        var node = useMemo(function () { return ({ id: id, type: type, position: { x: xPos, y: yPos }, data: data }); }, [id, type, xPos, yPos, data]);
        var grid = useMemo(function () { return (snapToGrid ? snapGrid : [1, 1]); }, [snapToGrid, snapGrid]);
        var nodeStyle = useMemo(function () { return (__assign({ zIndex: selected ? 10 : 3, transform: "translate(" + xPos + "px," + yPos + "px)", pointerEvents: isSelectable || isDraggable || onClick ? 'all' : 'none', opacity: isInitialized ? 1 : 0 }, style)); }, [selected, xPos, yPos, isSelectable, isDraggable, onClick, isInitialized, style]);
        var onMouseEnterHandler = useMemo(function () {
            if (!onMouseEnter || isDragging) {
                return;
            }
            return function (event) { return onMouseEnter(event, node); };
        }, [onMouseEnter, isDragging, node]);
        var onMouseMoveHandler = useMemo(function () {
            if (!onMouseMove || isDragging) {
                return;
            }
            return function (event) { return onMouseMove(event, node); };
        }, [onMouseMove, isDragging, node]);
        var onMouseLeaveHandler = useMemo(function () {
            if (!onMouseLeave || isDragging) {
                return;
            }
            return function (event) { return onMouseLeave(event, node); };
        }, [onMouseLeave, isDragging, node]);
        var onContextMenuHandler = useMemo(function () {
            if (!onContextMenu) {
                return;
            }
            return function (event) { return onContextMenu(event, node); };
        }, [onContextMenu, node]);
        var onSelectNodeHandler = useCallback(function (event) {
            if (!isDraggable) {
                if (isSelectable) {
                    unsetNodesSelection();
                    if (!selected) {
                        addSelectedElements(node);
                    }
                }
                onClick === null || onClick === void 0 ? void 0 : onClick(event, node);
            }
        }, [isSelectable, selected, isDraggable, onClick, node]);
        var onDragStart = useCallback(function (event) {
            onNodeDragStart === null || onNodeDragStart === void 0 ? void 0 : onNodeDragStart(event, node);
            if (selectNodesOnDrag && isSelectable) {
                unsetNodesSelection();
                if (!selected) {
                    addSelectedElements(node);
                }
            }
            else if (!selectNodesOnDrag && !selected && isSelectable) {
                unsetNodesSelection();
                addSelectedElements([]);
            }
        }, [node, selected, selectNodesOnDrag, isSelectable, onNodeDragStart]);
        var onDrag = useCallback(function (event, draggableData) {
            if (onNodeDrag) {
                node.position.x += draggableData.deltaX;
                node.position.y += draggableData.deltaY;
                onNodeDrag(event, node);
            }
            updateNodePosDiff({
                id: id,
                diff: {
                    x: draggableData.deltaX,
                    y: draggableData.deltaY,
                },
            });
        }, [id, node, onNodeDrag]);
        var onDragStop = useCallback(function (event) {
            // onDragStop also gets called when user just clicks on a node.
            // Because of that we set dragging to true inside the onDrag handler and handle the click here
            if (!isDragging) {
                if (isSelectable && !selectNodesOnDrag && !selected) {
                    addSelectedElements(node);
                }
                onClick === null || onClick === void 0 ? void 0 : onClick(event, node);
                return;
            }
            updateNodePosDiff({
                id: node.id,
                isDragging: false,
            });
            onNodeDragStop === null || onNodeDragStop === void 0 ? void 0 : onNodeDragStop(event, node);
        }, [node, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop, isDragging, selected]);
        useEffect(function () {
            if (nodeElement.current && !isHidden) {
                updateNodeDimensions({ id: id, nodeElement: nodeElement.current });
            }
        }, [id, isHidden, sourcePosition, targetPosition]);
        useEffect(function () {
            if (nodeElement.current) {
                var currNode_1 = nodeElement.current;
                resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.observe(currNode_1);
                return function () { return resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.unobserve(currNode_1); };
            }
            return;
        }, []);
        if (isHidden) {
            return null;
        }
        var nodeClasses = cc([
            'react-flow__node',
            "react-flow__node-" + type,
            className,
            {
                selected: selected,
                selectable: isSelectable,
            },
        ]);
        return (React.createElement(DraggableCore_1$1, { onStart: onDragStart, onDrag: onDrag, onStop: onDragStop, scale: scale, disabled: !isDraggable, cancel: ".nodrag", nodeRef: nodeElement, grid: grid },
            React.createElement("div", { className: nodeClasses, ref: nodeElement, style: nodeStyle, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, "data-id": id },
                React.createElement(Provider, { value: id },
                    React.createElement(NodeComponent, { id: id, data: data, type: type, xPos: xPos, yPos: yPos, selected: selected, isConnectable: isConnectable, sourcePosition: sourcePosition, targetPosition: targetPosition, isDragging: isDragging })))));
    };
    NodeWrapper.displayName = 'NodeWrapper';
    return memo(NodeWrapper);
});

function createNodeTypes(nodeTypes) {
    var standardTypes = {
        input: wrapNode((nodeTypes.input || InputNode$1)),
        default: wrapNode((nodeTypes.default || DefaultNode$1)),
        output: wrapNode((nodeTypes.output || OutputNode$1)),
    };
    var wrappedTypes = {};
    var specialTypes = Object.keys(nodeTypes)
        .filter(function (k) { return !['input', 'default', 'output'].includes(k); })
        .reduce(function (res, key) {
        res[key] = wrapNode((nodeTypes[key] || DefaultNode$1));
        return res;
    }, wrappedTypes);
    return __assign(__assign({}, standardTypes), specialTypes);
}

// This is just a helper component for calling the onSelectionChange listener.
// As soon as easy-peasy has implemented the effectOn hook, we can remove this component
// and use the hook instead. https://github.com/ctrlplusb/easy-peasy/pull/459
var SelectionListener = (function (_a) {
    var onSelectionChange = _a.onSelectionChange;
    var selectedElements = useStoreState$1(function (s) { return s.selectedElements; });
    useEffect(function () {
        onSelectionChange(selectedElements);
    }, [selectedElements]);
    return null;
});

// do not edit .js files directly - edit src/index.jst



var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

var getHandleBounds = function (nodeElement, scale) {
    var bounds = nodeElement.getBoundingClientRect();
    return {
        source: getHandleBoundsByHandleType('.source', nodeElement, bounds, scale),
        target: getHandleBoundsByHandleType('.target', nodeElement, bounds, scale),
    };
};
var getHandleBoundsByHandleType = function (selector, nodeElement, parentBounds, k) {
    var handles = nodeElement.querySelectorAll(selector);
    if (!handles || !handles.length) {
        return null;
    }
    var handlesArray = Array.from(handles);
    return handlesArray.map(function (handle) {
        var bounds = handle.getBoundingClientRect();
        var dimensions = getDimensions(handle);
        var handleId = handle.getAttribute('data-handleid');
        var handlePosition = handle.getAttribute('data-handlepos');
        return __assign({ id: handleId, position: handlePosition, x: (bounds.left - parentBounds.left) / k, y: (bounds.top - parentBounds.top) / k }, dimensions);
    });
};

var storeModel = {
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    elements: [],
    nodes: computed(function (state) { return state.elements.filter(isNode); }),
    edges: computed(function (state) { return state.elements.filter(isEdge); }),
    selectedElements: null,
    selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
    viewportBox: computed(function (state) { return ({ x: 0, y: 0, width: state.width, height: state.height }); }),
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: undefined,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: [
        [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
        [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ],
    nodeExtent: [
        [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
        [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ],
    nodesSelectionActive: false,
    selectionActive: false,
    userSelectionRect: {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        draw: false,
    },
    connectionNodeId: null,
    connectionHandleId: null,
    connectionHandleType: 'source',
    connectionPosition: { x: 0, y: 0 },
    connectionMode: ConnectionMode.Strict,
    snapGrid: [15, 15],
    snapToGrid: false,
    nodesDraggable: true,
    nodesConnectable: true,
    elementsSelectable: true,
    multiSelectionActive: false,
    reactFlowVersion: "8.8.0" ,
    setOnConnect: action(function (state, onConnect) {
        state.onConnect = onConnect;
    }),
    setOnConnectStart: action(function (state, onConnectStart) {
        state.onConnectStart = onConnectStart;
    }),
    setOnConnectStop: action(function (state, onConnectStop) {
        state.onConnectStop = onConnectStop;
    }),
    setOnConnectEnd: action(function (state, onConnectEnd) {
        state.onConnectEnd = onConnectEnd;
    }),
    setElements: action(function (state, propElements) {
        var _loop_1 = function (i) {
            var se = state.elements[i];
            var elementExistsInProps = propElements.find(function (pe) { return pe.id === se.id; });
            if (!elementExistsInProps) {
                state.elements.splice(i, 1);
                i--;
            }
            out_i_1 = i;
        };
        var out_i_1;
        // remove deleted elements
        for (var i = 0; i < state.elements.length; i++) {
            _loop_1(i);
            i = out_i_1;
        }
        propElements.forEach(function (el) {
            var storeElementIndex = state.elements.findIndex(function (se) { return se.id === el.id; });
            // update existing element
            if (storeElementIndex !== -1) {
                var storeElement = state.elements[storeElementIndex];
                if (isNode(storeElement)) {
                    var propNode = el;
                    var positionChanged = storeElement.position.x !== propNode.position.x || storeElement.position.y !== propNode.position.y;
                    var typeChanged = typeof propNode.type !== 'undefined' && propNode.type !== storeElement.type;
                    state.elements[storeElementIndex] = __assign(__assign({}, storeElement), propNode);
                    if (positionChanged) {
                        state.elements[storeElementIndex].__rf.position = clampPosition(propNode.position, state.nodeExtent);
                    }
                    if (typeChanged) {
                        // we reset the elements dimensions here in order to force a re-calculation of the bounds.
                        // When the type of a node changes it is possible that the number or positions of handles changes too.
                        state.elements[storeElementIndex].__rf.width = null;
                    }
                }
                else {
                    state.elements[storeElementIndex] = __assign(__assign({}, storeElement), el);
                }
            }
            else {
                // add new element
                state.elements.push(parseElement(el, state.nodeExtent));
            }
        });
    }),
    batchUpdateNodeDimensions: action(function (state, _a) {
        var updates = _a.updates;
        updates.forEach(function (update) {
            var dimensions = getDimensions(update.nodeElement);
            var matchingIndex = state.elements.findIndex(function (n) { return n.id === update.id; });
            var matchingNode = state.elements[matchingIndex];
            if (matchingIndex !== -1 &&
                dimensions.width &&
                dimensions.height &&
                (matchingNode.__rf.width !== dimensions.width || matchingNode.__rf.height !== dimensions.height)) {
                var handleBounds = getHandleBounds(update.nodeElement, state.transform[2]);
                state.elements[matchingIndex].__rf.width = dimensions.width;
                state.elements[matchingIndex].__rf.height = dimensions.height;
                state.elements[matchingIndex].__rf.handleBounds = handleBounds;
            }
        });
    }),
    updateNodeDimensions: action(function (state, _a) {
        var id = _a.id, nodeElement = _a.nodeElement;
        var dimensions = getDimensions(nodeElement);
        var matchingIndex = state.elements.findIndex(function (n) { return n.id === id; });
        if (matchingIndex !== -1 && dimensions.width && dimensions.height) {
            var handleBounds = getHandleBounds(nodeElement, state.transform[2]);
            state.elements[matchingIndex].__rf.width = dimensions.width;
            state.elements[matchingIndex].__rf.height = dimensions.height;
            state.elements[matchingIndex].__rf.handleBounds = handleBounds;
        }
    }),
    updateNodePos: action(function (state, _a) {
        var id = _a.id, pos = _a.pos;
        var position = pos;
        if (state.snapToGrid) {
            var _b = state.snapGrid, gridSizeX = _b[0], gridSizeY = _b[1];
            position = {
                x: gridSizeX * Math.round(pos.x / gridSizeX),
                y: gridSizeY * Math.round(pos.y / gridSizeY),
            };
        }
        state.elements.forEach(function (n) {
            if (n.id === id && isNode(n)) {
                n.__rf.position = clampPosition(position, state.nodeExtent);
            }
        });
    }),
    updateNodePosDiff: action(function (state, _a) {
        var _b = _a.id, id = _b === void 0 ? null : _b, _c = _a.diff, diff = _c === void 0 ? null : _c, _d = _a.isDragging, isDragging = _d === void 0 ? true : _d;
        state.elements.forEach(function (n) {
            var _a;
            if (isNode(n) && (id === n.id || ((_a = state.selectedElements) === null || _a === void 0 ? void 0 : _a.find(function (sNode) { return sNode.id === n.id; })))) {
                if (diff) {
                    var position = {
                        x: n.__rf.position.x + diff.x,
                        y: n.__rf.position.y + diff.y,
                    };
                    n.__rf.position = clampPosition(position, state.nodeExtent);
                }
                n.__rf.isDragging = isDragging;
            }
        });
    }),
    setUserSelection: action(function (state, mousePos) {
        state.userSelectionRect = {
            width: 0,
            height: 0,
            startX: mousePos.x,
            startY: mousePos.y,
            x: mousePos.x,
            y: mousePos.y,
            draw: true,
        };
        state.selectionActive = true;
    }),
    updateUserSelection: action(function (state, mousePos) {
        var startX = state.userSelectionRect.startX || 0;
        var startY = state.userSelectionRect.startY || 0;
        var negativeX = mousePos.x < startX;
        var negativeY = mousePos.y < startY;
        var nextRect = __assign(__assign({}, state.userSelectionRect), { x: negativeX ? mousePos.x : state.userSelectionRect.x, y: negativeY ? mousePos.y : state.userSelectionRect.y, width: Math.abs(mousePos.x - startX), height: Math.abs(mousePos.y - startY) });
        var selectedNodes = getNodesInside(state.nodes, nextRect, state.transform);
        var selectedEdges = getConnectedEdges(selectedNodes, state.edges);
        var nextSelectedElements = __spreadArrays(selectedNodes, selectedEdges);
        var selectedElementsUpdated = !fastDeepEqual(nextSelectedElements, state.selectedElements);
        state.userSelectionRect = nextRect;
        if (selectedElementsUpdated) {
            state.selectedElements = nextSelectedElements.length > 0 ? nextSelectedElements : null;
        }
    }),
    unsetUserSelection: action(function (state) {
        var _a;
        var selectedNodes = (_a = state.selectedElements) === null || _a === void 0 ? void 0 : _a.filter(function (node) { return isNode(node) && node.__rf; });
        if (!selectedNodes || selectedNodes.length === 0) {
            state.selectionActive = false;
            state.userSelectionRect.draw = false;
            state.nodesSelectionActive = false;
            state.selectedElements = null;
            return;
        }
        var selectedNodesBbox = getRectOfNodes(selectedNodes);
        state.nodesSelectionActive = true;
        state.selectedNodesBbox = selectedNodesBbox;
        state.userSelectionRect.draw = false;
        state.selectionActive = false;
    }),
    setSelection: action(function (state, isActive) {
        state.selectionActive = isActive;
    }),
    unsetNodesSelection: action(function (state) {
        state.nodesSelectionActive = false;
    }),
    resetSelectedElements: action(function (state) {
        state.selectedElements = null;
    }),
    setSelectedElements: action(function (state, elements) {
        var selectedElementsArr = Array.isArray(elements) ? elements : [elements];
        var selectedElementsUpdated = !fastDeepEqual(selectedElementsArr, state.selectedElements);
        var selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;
        state.selectedElements = selectedElements;
    }),
    addSelectedElements: thunk$1(function (actions, elements, helpers) {
        var _a = helpers.getState(), multiSelectionActive = _a.multiSelectionActive, selectedElements = _a.selectedElements;
        var selectedElementsArr = Array.isArray(elements) ? elements : [elements];
        if (multiSelectionActive) {
            var nextElements = selectedElements ? __spreadArrays(selectedElements, selectedElementsArr) : selectedElementsArr;
            actions.setSelectedElements(nextElements);
            return;
        }
        actions.setSelectedElements(elements);
    }),
    updateTransform: action(function (state, transform) {
        state.transform[0] = transform[0];
        state.transform[1] = transform[1];
        state.transform[2] = transform[2];
    }),
    updateSize: action(function (state, size) {
        // when parent has no size we use these default values
        // so that the calculations don't throw any errors
        state.width = size.width || 500;
        state.height = size.height || 500;
    }),
    initD3Zoom: action(function (state, _a) {
        var d3Zoom = _a.d3Zoom, d3Selection = _a.d3Selection, d3ZoomHandler = _a.d3ZoomHandler, transform = _a.transform;
        state.d3Zoom = d3Zoom;
        state.d3Selection = d3Selection;
        state.d3ZoomHandler = d3ZoomHandler;
        state.transform[0] = transform[0];
        state.transform[1] = transform[1];
        state.transform[2] = transform[2];
    }),
    setMinZoom: action(function (state, minZoom) {
        state.minZoom = minZoom;
        if (state.d3Zoom) {
            state.d3Zoom.scaleExtent([minZoom, state.maxZoom]);
        }
    }),
    setMaxZoom: action(function (state, maxZoom) {
        state.maxZoom = maxZoom;
        if (state.d3Zoom) {
            state.d3Zoom.scaleExtent([state.minZoom, maxZoom]);
        }
    }),
    setTranslateExtent: action(function (state, translateExtent) {
        state.translateExtent = translateExtent;
        if (state.d3Zoom) {
            state.d3Zoom.translateExtent(translateExtent);
        }
    }),
    setNodeExtent: action(function (state, nodeExtent) {
        state.nodeExtent = nodeExtent;
        state.elements.forEach(function (el) {
            if (isNode(el)) {
                el.__rf.position = clampPosition(el.__rf.position, nodeExtent);
            }
        });
    }),
    setConnectionPosition: action(function (state, position) {
        state.connectionPosition = position;
    }),
    setConnectionNodeId: action(function (state, _a) {
        var connectionNodeId = _a.connectionNodeId, connectionHandleId = _a.connectionHandleId, connectionHandleType = _a.connectionHandleType;
        state.connectionNodeId = connectionNodeId;
        state.connectionHandleId = connectionHandleId;
        state.connectionHandleType = connectionHandleType;
    }),
    setSnapToGrid: action(function (state, snapToGrid) {
        state.snapToGrid = snapToGrid;
    }),
    setSnapGrid: action(function (state, snapGrid) {
        state.snapGrid[0] = snapGrid[0];
        state.snapGrid[1] = snapGrid[1];
    }),
    setInteractive: action(function (state, isInteractive) {
        state.nodesDraggable = isInteractive;
        state.nodesConnectable = isInteractive;
        state.elementsSelectable = isInteractive;
    }),
    setNodesDraggable: action(function (state, nodesDraggable) {
        state.nodesDraggable = nodesDraggable;
    }),
    setNodesConnectable: action(function (state, nodesConnectable) {
        state.nodesConnectable = nodesConnectable;
    }),
    setElementsSelectable: action(function (state, elementsSelectable) {
        state.elementsSelectable = elementsSelectable;
    }),
    setMultiSelectionActive: action(function (state, isActive) {
        state.multiSelectionActive = isActive;
    }),
    setConnectionMode: action(function (state, connectionMode) {
        state.connectionMode = connectionMode;
    }),
};
var nodeEnv = ("production");
var store = createStore$1(storeModel, { devTools: nodeEnv === 'development' });

var Wrapper = function (_a) {
    var _b;
    var children = _a.children;
    var easyPeasyStore = useStore$1();
    var isWrapepdWithReactFlowProvider = (_b = easyPeasyStore === null || easyPeasyStore === void 0 ? void 0 : easyPeasyStore.getState()) === null || _b === void 0 ? void 0 : _b.reactFlowVersion;
    if (isWrapepdWithReactFlowProvider) {
        // we need to wrap it with a fragment because t's not allowed for children to be a ReactNode
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
        return React.createElement(React.Fragment, null, children);
    }
    return React.createElement(StoreProvider, { store: store }, children);
};
Wrapper.displayName = 'ReactFlowWrapper';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".react-flow{width:100%;height:100%;position:relative;overflow:hidden}.react-flow__pane,.react-flow__renderer,.react-flow__selectionpane{width:100%;height:100%;position:absolute;top:0;left:0}.react-flow__pane{z-index:1}.react-flow__renderer{z-index:4}.react-flow__selectionpane{z-index:5}.react-flow__edges,.react-flow__selection{position:absolute;top:0;left:0}.react-flow__edges{pointer-events:none;z-index:2}.react-flow__edge{pointer-events:all;}.react-flow__edge.inactive{pointer-events:none}@-webkit-keyframes dashdraw{0%{stroke-dashoffset:10}}@keyframes dashdraw{0%{stroke-dashoffset:10}}.react-flow__edge-path{fill:none}.react-flow__edge-text{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.react-flow__connection{pointer-events:none;}.react-flow__connection .animated{stroke-dasharray:5;-webkit-animation:dashdraw .5s linear infinite;animation:dashdraw .5s linear infinite}.react-flow__connection-path{fill:none}.react-flow__nodes{width:100%;height:100%;pointer-events:none;z-index:3}.react-flow__node,.react-flow__nodes{position:absolute;transform-origin:0 0}.react-flow__node{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:all}.react-flow__nodesselection{z-index:3;position:absolute;width:100%;height:100%;top:0;left:0;transform-origin:left top;pointer-events:none;}.react-flow__nodesselection-rect{position:absolute;pointer-events:all;cursor:-webkit-grab;cursor:grab}.react-flow__handle{pointer-events:none;}.react-flow__handle.connectable{pointer-events:all}.react-flow__handle-bottom{top:auto;left:50%;bottom:-4px;transform:translate(-50%)}.react-flow__handle-top{left:50%;top:-4px;transform:translate(-50%)}.react-flow__handle-left{top:50%;left:-4px;transform:translateY(-50%)}.react-flow__handle-right{right:-4px;top:50%;transform:translateY(-50%)}.react-flow__edgeupdater{cursor:move}.react-flow__background{position:absolute;top:0;left:0;width:100%;height:100%}.react-flow__controls{position:absolute;z-index:5;bottom:10px;left:10px;}.react-flow__controls-button{width:24px;height:24px;}.react-flow__controls-button svg{width:100%}.react-flow__minimap{position:absolute;z-index:5;bottom:10px;right:10px;}.react-flow__minimap-node{shape-rendering:crispedges}";
styleInject(css_248z);

var css_248z$1 = ".react-flow__selection{background:rgba(0,89,220,.08);border:1px dotted rgba(0,89,220,.8)}.react-flow__edge.selected .react-flow__edge-path{stroke:#555}.react-flow__edge.animated path{stroke-dasharray:5;-webkit-animation:dashdraw .5s linear infinite;animation:dashdraw .5s linear infinite}.react-flow__edge.updating .react-flow__edge-path{stroke:#777}.react-flow__edge-path{stroke:#b1b1b7;stroke-width:1}.react-flow__edge-text{font-size:10px}.react-flow__edge-textbg{fill:#fff}.react-flow__connection-path{stroke:#b1b1b7;stroke-width:1}.react-flow__node{cursor:-webkit-grab;cursor:grab}.react-flow__node-default,.react-flow__node-input,.react-flow__node-output{padding:10px;border-radius:3px;width:150px;font-size:12px;color:#222;text-align:center;border-width:1px;border-style:solid}.react-flow__node-default.selectable:hover,.react-flow__node-input.selectable:hover,.react-flow__node-output.selectable:hover{box-shadow:0 1px 4px 1px rgba(0,0,0,.08)}.react-flow__node-input{background:#fff;border-color:#0041d0;}.react-flow__node-input.selected,.react-flow__node-input.selected:hover{box-shadow:0 0 0 .5px #0041d0}.react-flow__node-input .react-flow__handle{background:#0041d0}.react-flow__node-default{background:#fff;border-color:#1a192b;}.react-flow__node-default.selected,.react-flow__node-default.selected:hover{box-shadow:0 0 0 .5px #1a192b}.react-flow__node-default .react-flow__handle{background:#1a192b}.react-flow__node-output{background:#fff;border-color:#ff0072;}.react-flow__node-output.selected,.react-flow__node-output.selected:hover{box-shadow:0 0 0 .5px #ff0072}.react-flow__node-output .react-flow__handle{background:#ff0072}.react-flow__nodesselection-rect{background:rgba(0,89,220,.08);border:1px dotted rgba(0,89,220,.8)}.react-flow__handle{position:absolute;width:6px;height:6px;background:#555;border:1px solid #fff;border-radius:100%;}.react-flow__handle.connectable{cursor:crosshair}.react-flow__minimap{background-color:#fff}.react-flow__controls{box-shadow:0 0 2px 1px rgba(0,0,0,.08);}.react-flow__controls-button{background:#fefefe;border-bottom:1px solid #eee;box-sizing:content-box;display:flex;justify-content:center;align-items:center;width:16px;height:16px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;padding:5px;}.react-flow__controls-button svg{max-width:12px;max-height:12px}.react-flow__controls-button:hover{background:#f4f4f4}";
styleInject(css_248z$1);

var defaultNodeTypes = {
    input: InputNode$1,
    default: DefaultNode$1,
    output: OutputNode$1,
};
var defaultEdgeTypes = {
    default: BezierEdge,
    straight: StraightEdge,
    step: StepEdge,
    smoothstep: SmoothStepEdge,
};
var ReactFlow = function (_a) {
    var _b = _a.elements, elements = _b === void 0 ? [] : _b, className = _a.className, _c = _a.nodeTypes, nodeTypes = _c === void 0 ? defaultNodeTypes : _c, _d = _a.edgeTypes, edgeTypes = _d === void 0 ? defaultEdgeTypes : _d, onElementClick = _a.onElementClick, onLoad = _a.onLoad, onMove = _a.onMove, onMoveStart = _a.onMoveStart, onMoveEnd = _a.onMoveEnd, onElementsRemove = _a.onElementsRemove, onConnect = _a.onConnect, onConnectStart = _a.onConnectStart, onConnectStop = _a.onConnectStop, onConnectEnd = _a.onConnectEnd, onNodeMouseEnter = _a.onNodeMouseEnter, onNodeMouseMove = _a.onNodeMouseMove, onNodeMouseLeave = _a.onNodeMouseLeave, onNodeContextMenu = _a.onNodeContextMenu, onNodeDragStart = _a.onNodeDragStart, onNodeDrag = _a.onNodeDrag, onNodeDragStop = _a.onNodeDragStop, onSelectionChange = _a.onSelectionChange, onSelectionDragStart = _a.onSelectionDragStart, onSelectionDrag = _a.onSelectionDrag, onSelectionDragStop = _a.onSelectionDragStop, onSelectionContextMenu = _a.onSelectionContextMenu, _e = _a.connectionMode, connectionMode = _e === void 0 ? ConnectionMode.Strict : _e, _f = _a.connectionLineType, connectionLineType = _f === void 0 ? ConnectionLineType.Bezier : _f, connectionLineStyle = _a.connectionLineStyle, connectionLineComponent = _a.connectionLineComponent, _g = _a.deleteKeyCode, deleteKeyCode = _g === void 0 ? 'Backspace' : _g, _h = _a.selectionKeyCode, selectionKeyCode = _h === void 0 ? 'Shift' : _h, _j = _a.multiSelectionKeyCode, multiSelectionKeyCode = _j === void 0 ? 'Meta' : _j, _k = _a.zoomActivationKeyCode, zoomActivationKeyCode = _k === void 0 ? 'Meta' : _k, _l = _a.snapToGrid, snapToGrid = _l === void 0 ? false : _l, _m = _a.snapGrid, snapGrid = _m === void 0 ? [15, 15] : _m, _o = _a.onlyRenderVisibleElements, onlyRenderVisibleElements = _o === void 0 ? true : _o, _p = _a.selectNodesOnDrag, selectNodesOnDrag = _p === void 0 ? true : _p, nodesDraggable = _a.nodesDraggable, nodesConnectable = _a.nodesConnectable, elementsSelectable = _a.elementsSelectable, minZoom = _a.minZoom, maxZoom = _a.maxZoom, _q = _a.defaultZoom, defaultZoom = _q === void 0 ? 1 : _q, _r = _a.defaultPosition, defaultPosition = _r === void 0 ? [0, 0] : _r, translateExtent = _a.translateExtent, nodeExtent = _a.nodeExtent, _s = _a.arrowHeadColor, arrowHeadColor = _s === void 0 ? '#b1b1b7' : _s, markerEndId = _a.markerEndId, _t = _a.zoomOnScroll, zoomOnScroll = _t === void 0 ? true : _t, _u = _a.zoomOnPinch, zoomOnPinch = _u === void 0 ? true : _u, _v = _a.panOnScroll, panOnScroll = _v === void 0 ? false : _v, _w = _a.panOnScrollSpeed, panOnScrollSpeed = _w === void 0 ? 0.5 : _w, _x = _a.panOnScrollMode, panOnScrollMode = _x === void 0 ? PanOnScrollMode.Free : _x, _y = _a.zoomOnDoubleClick, zoomOnDoubleClick = _y === void 0 ? true : _y, _z = _a.paneMoveable, paneMoveable = _z === void 0 ? true : _z, onPaneClick = _a.onPaneClick, onPaneScroll = _a.onPaneScroll, onPaneContextMenu = _a.onPaneContextMenu, children = _a.children, onEdgeUpdate = _a.onEdgeUpdate, rest = __rest(_a, ["elements", "className", "nodeTypes", "edgeTypes", "onElementClick", "onLoad", "onMove", "onMoveStart", "onMoveEnd", "onElementsRemove", "onConnect", "onConnectStart", "onConnectStop", "onConnectEnd", "onNodeMouseEnter", "onNodeMouseMove", "onNodeMouseLeave", "onNodeContextMenu", "onNodeDragStart", "onNodeDrag", "onNodeDragStop", "onSelectionChange", "onSelectionDragStart", "onSelectionDrag", "onSelectionDragStop", "onSelectionContextMenu", "connectionMode", "connectionLineType", "connectionLineStyle", "connectionLineComponent", "deleteKeyCode", "selectionKeyCode", "multiSelectionKeyCode", "zoomActivationKeyCode", "snapToGrid", "snapGrid", "onlyRenderVisibleElements", "selectNodesOnDrag", "nodesDraggable", "nodesConnectable", "elementsSelectable", "minZoom", "maxZoom", "defaultZoom", "defaultPosition", "translateExtent", "nodeExtent", "arrowHeadColor", "markerEndId", "zoomOnScroll", "zoomOnPinch", "panOnScroll", "panOnScrollSpeed", "panOnScrollMode", "zoomOnDoubleClick", "paneMoveable", "onPaneClick", "onPaneScroll", "onPaneContextMenu", "children", "onEdgeUpdate"]);
    var nodeTypesParsed = useMemo(function () { return createNodeTypes(nodeTypes); }, []);
    var edgeTypesParsed = useMemo(function () { return createEdgeTypes(edgeTypes); }, []);
    var reactFlowClasses = cc(['react-flow', className]);
    return (React.createElement("div", __assign({}, rest, { className: reactFlowClasses }),
        React.createElement(Wrapper, null,
            React.createElement(GraphView$1, { onLoad: onLoad, onMove: onMove, onMoveStart: onMoveStart, onMoveEnd: onMoveEnd, onElementClick: onElementClick, onNodeMouseEnter: onNodeMouseEnter, onNodeMouseMove: onNodeMouseMove, onNodeMouseLeave: onNodeMouseLeave, onNodeContextMenu: onNodeContextMenu, onNodeDragStart: onNodeDragStart, onNodeDrag: onNodeDrag, onNodeDragStop: onNodeDragStop, nodeTypes: nodeTypesParsed, edgeTypes: edgeTypesParsed, connectionMode: connectionMode, connectionLineType: connectionLineType, connectionLineStyle: connectionLineStyle, connectionLineComponent: connectionLineComponent, selectionKeyCode: selectionKeyCode, onElementsRemove: onElementsRemove, deleteKeyCode: deleteKeyCode, multiSelectionKeyCode: multiSelectionKeyCode, zoomActivationKeyCode: zoomActivationKeyCode, onConnect: onConnect, onConnectStart: onConnectStart, onConnectStop: onConnectStop, onConnectEnd: onConnectEnd, snapToGrid: snapToGrid, snapGrid: snapGrid, onlyRenderVisibleElements: onlyRenderVisibleElements, nodesDraggable: nodesDraggable, nodesConnectable: nodesConnectable, elementsSelectable: elementsSelectable, selectNodesOnDrag: selectNodesOnDrag, minZoom: minZoom, maxZoom: maxZoom, defaultZoom: defaultZoom, defaultPosition: defaultPosition, translateExtent: translateExtent, nodeExtent: nodeExtent, arrowHeadColor: arrowHeadColor, markerEndId: markerEndId, zoomOnScroll: zoomOnScroll, zoomOnPinch: zoomOnPinch, zoomOnDoubleClick: zoomOnDoubleClick, panOnScroll: panOnScroll, panOnScrollSpeed: panOnScrollSpeed, panOnScrollMode: panOnScrollMode, paneMoveable: paneMoveable, onPaneClick: onPaneClick, onPaneScroll: onPaneScroll, onPaneContextMenu: onPaneContextMenu, onSelectionDragStart: onSelectionDragStart, onSelectionDrag: onSelectionDrag, onSelectionDragStop: onSelectionDragStop, onSelectionContextMenu: onSelectionContextMenu, onEdgeUpdate: onEdgeUpdate }),
            React.createElement(ElementUpdater, { elements: elements }),
            onSelectionChange && React.createElement(SelectionListener, { onSelectionChange: onSelectionChange }),
            children)));
};
ReactFlow.displayName = 'ReactFlow';

var MiniMapNode = function (_a) {
    var x = _a.x, y = _a.y, width = _a.width, height = _a.height, style = _a.style, color = _a.color, strokeColor = _a.strokeColor, strokeWidth = _a.strokeWidth, className = _a.className, borderRadius = _a.borderRadius;
    var _b = style || {}, background = _b.background, backgroundColor = _b.backgroundColor;
    var fill = (color || background || backgroundColor);
    return (React.createElement("rect", { className: cc(['react-flow__minimap-node', className]), x: x, y: y, rx: borderRadius, ry: borderRadius, width: width, height: height, fill: fill, stroke: strokeColor, strokeWidth: strokeWidth }));
};
MiniMapNode.displayName = 'MiniMapNode';
var MiniMapNode$1 = memo(MiniMapNode);

var defaultWidth = 200;
var defaultHeight = 150;
var MiniMap = function (_a) {
    var style = _a.style, className = _a.className, _b = _a.nodeStrokeColor, nodeStrokeColor = _b === void 0 ? '#555' : _b, _c = _a.nodeColor, nodeColor = _c === void 0 ? '#fff' : _c, _d = _a.nodeClassName, nodeClassName = _d === void 0 ? '' : _d, _e = _a.nodeBorderRadius, nodeBorderRadius = _e === void 0 ? 5 : _e, _f = _a.nodeStrokeWidth, nodeStrokeWidth = _f === void 0 ? 2 : _f, _g = _a.maskColor, maskColor = _g === void 0 ? 'rgb(240, 242, 243, 0.7)' : _g;
    var containerWidth = useStoreState$1(function (s) { return s.width; });
    var containerHeight = useStoreState$1(function (s) { return s.height; });
    var _h = useStoreState$1(function (s) { return s.transform; }), tX = _h[0], tY = _h[1], tScale = _h[2];
    var nodes = useStoreState$1(function (s) { return s.nodes; });
    var mapClasses = cc(['react-flow__minimap', className]);
    var elementWidth = ((style === null || style === void 0 ? void 0 : style.width) || defaultWidth);
    var elementHeight = ((style === null || style === void 0 ? void 0 : style.height) || defaultHeight);
    var nodeColorFunc = (nodeColor instanceof Function ? nodeColor : function () { return nodeColor; });
    var nodeStrokeColorFunc = (nodeStrokeColor instanceof Function
        ? nodeStrokeColor
        : function () { return nodeStrokeColor; });
    var nodeClassNameFunc = (nodeClassName instanceof Function ? nodeClassName : function () { return nodeClassName; });
    var hasNodes = nodes && nodes.length;
    var bb = getRectOfNodes(nodes);
    var viewBB = {
        x: -tX / tScale,
        y: -tY / tScale,
        width: containerWidth / tScale,
        height: containerHeight / tScale,
    };
    var boundingRect = hasNodes ? getBoundsofRects(bb, viewBB) : viewBB;
    var scaledWidth = boundingRect.width / elementWidth;
    var scaledHeight = boundingRect.height / elementHeight;
    var viewScale = Math.max(scaledWidth, scaledHeight);
    var viewWidth = viewScale * elementWidth;
    var viewHeight = viewScale * elementHeight;
    var offset = 5 * viewScale;
    var x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    var y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    var width = viewWidth + offset * 2;
    var height = viewHeight + offset * 2;
    return (React.createElement("svg", { width: elementWidth, height: elementHeight, viewBox: x + " " + y + " " + width + " " + height, style: style, className: mapClasses },
        nodes
            .filter(function (node) { return !node.isHidden; })
            .map(function (node) { return (React.createElement(MiniMapNode$1, { key: node.id, x: node.__rf.position.x, y: node.__rf.position.y, width: node.__rf.width, height: node.__rf.height, style: node.style, className: nodeClassNameFunc(node), color: nodeColorFunc(node), borderRadius: nodeBorderRadius, strokeColor: nodeStrokeColorFunc(node), strokeWidth: nodeStrokeWidth })); }),
        React.createElement("path", { className: "react-flow__minimap-mask", d: "M" + (x - offset) + "," + (y - offset) + "h" + (width + offset * 2) + "v" + (height + offset * 2) + "h" + (-width - offset * 2) + "z\n        M" + viewBB.x + "," + viewBB.y + "h" + viewBB.width + "v" + viewBB.height + "h" + -viewBB.width + "z", fill: maskColor, fillRule: "evenodd" })));
};
MiniMap.displayName = 'MiniMap';
var index = memo(MiniMap);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _ref = /*#__PURE__*/createElement("path", {
  d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"
});

function SvgPlus(props) {
  return /*#__PURE__*/createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 32"
  }, props), _ref);
}

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }

var _ref$1 = /*#__PURE__*/createElement("path", {
  d: "M0 0h32v4.2H0z"
});

function SvgMinus(props) {
  return /*#__PURE__*/createElement("svg", _extends$1({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 5"
  }, props), _ref$1);
}

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }

var _ref$2 = /*#__PURE__*/createElement("path", {
  d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 01-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"
});

function SvgFitview(props) {
  return /*#__PURE__*/createElement("svg", _extends$2({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 32 30"
  }, props), _ref$2);
}

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }

var _ref$3 = /*#__PURE__*/createElement("path", {
  d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"
});

function SvgLock(props) {
  return /*#__PURE__*/createElement("svg", _extends$3({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 25 32"
  }, props), _ref$3);
}

function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }

var _ref$4 = /*#__PURE__*/createElement("path", {
  d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z"
});

function SvgUnlock(props) {
  return /*#__PURE__*/createElement("svg", _extends$4({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 25 32"
  }, props), _ref$4);
}

var Controls = function (_a) {
    var style = _a.style, _b = _a.showZoom, showZoom = _b === void 0 ? true : _b, _c = _a.showFitView, showFitView = _c === void 0 ? true : _c, _d = _a.showInteractive, showInteractive = _d === void 0 ? true : _d, fitViewParams = _a.fitViewParams, onZoomIn = _a.onZoomIn, onZoomOut = _a.onZoomOut, onFitView = _a.onFitView, onInteractiveChange = _a.onInteractiveChange, className = _a.className;
    var setInteractive = useStoreActions$1(function (actions) { return actions.setInteractive; });
    var _e = useZoomPanHelper(), zoomIn = _e.zoomIn, zoomOut = _e.zoomOut, fitView = _e.fitView;
    var isInteractive = useStoreState$1(function (s) { return s.nodesDraggable && s.nodesConnectable && s.elementsSelectable; });
    var mapClasses = cc(['react-flow__controls', className]);
    var onZoomInHandler = useCallback(function () {
        zoomIn === null || zoomIn === void 0 ? void 0 : zoomIn();
        onZoomIn === null || onZoomIn === void 0 ? void 0 : onZoomIn();
    }, [zoomIn, onZoomIn]);
    var onZoomOutHandler = useCallback(function () {
        zoomOut === null || zoomOut === void 0 ? void 0 : zoomOut();
        onZoomOut === null || onZoomOut === void 0 ? void 0 : onZoomOut();
    }, [zoomOut, onZoomOut]);
    var onFitViewHandler = useCallback(function () {
        fitView === null || fitView === void 0 ? void 0 : fitView(fitViewParams);
        onFitView === null || onFitView === void 0 ? void 0 : onFitView();
    }, [fitView, fitViewParams, onFitView]);
    var onInteractiveChangeHandler = useCallback(function () {
        setInteractive === null || setInteractive === void 0 ? void 0 : setInteractive(!isInteractive);
        onInteractiveChange === null || onInteractiveChange === void 0 ? void 0 : onInteractiveChange(!isInteractive);
    }, [isInteractive, setInteractive, onInteractiveChange]);
    return (React.createElement("div", { className: mapClasses, style: style },
        showZoom && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "react-flow__controls-button react-flow__controls-zoomin", onClick: onZoomInHandler },
                React.createElement(SvgPlus, null)),
            React.createElement("div", { className: "react-flow__controls-button react-flow__controls-zoomout", onClick: onZoomOutHandler },
                React.createElement(SvgMinus, null)))),
        showFitView && (React.createElement("div", { className: "react-flow__controls-button react-flow__controls-fitview", onClick: onFitViewHandler },
            React.createElement(SvgFitview, null))),
        showInteractive && (React.createElement("div", { className: "react-flow__controls-button react-flow__controls-interactive", onClick: onInteractiveChangeHandler }, isInteractive ? React.createElement(SvgUnlock, null) : React.createElement(SvgLock, null)))));
};
Controls.displayName = 'Controls';
var index$1 = memo(Controls);

var createGridLinesPath = function (size, strokeWidth, stroke) {
    return React.createElement("path", { stroke: stroke, strokeWidth: strokeWidth, d: "M" + size / 2 + " 0 V" + size + " M0 " + size / 2 + " H" + size });
};
var createGridDotsPath = function (size, fill) {
    return React.createElement("circle", { cx: size / 2, cy: size / 2, r: size, fill: fill });
};

var _a;
var defaultColors = (_a = {},
    _a[BackgroundVariant.Dots] = '#81818a',
    _a[BackgroundVariant.Lines] = '#eee',
    _a);
var Background = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? BackgroundVariant.Dots : _b, _c = _a.gap, gap = _c === void 0 ? 15 : _c, _d = _a.size, size = _d === void 0 ? 0.5 : _d, color = _a.color, style = _a.style, className = _a.className;
    var _e = useStoreState$1(function (s) { return s.transform; }), x = _e[0], y = _e[1], scale = _e[2];
    var bgClasses = cc(['react-flow__background', className]);
    var scaledGap = gap * scale;
    var xOffset = x % scaledGap;
    var yOffset = y % scaledGap;
    var isLines = variant === BackgroundVariant.Lines;
    var bgColor = color ? color : defaultColors[variant];
    var path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size, bgColor);
    return (React.createElement("svg", { className: bgClasses, style: __assign(__assign({}, style), { width: '100%', height: '100%' }) },
        React.createElement("pattern", { id: "pattern", x: xOffset, y: yOffset, width: scaledGap, height: scaledGap, patternUnits: "userSpaceOnUse" }, path),
        React.createElement("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: "url(#pattern)" })));
};
Background.displayName = 'Background';
var index$2 = memo(Background);

var ReactFlowProvider = function (_a) {
    var children = _a.children;
    var store = useMemo(function () {
        return createStore$1(storeModel);
    }, []);
    return React.createElement(StoreProvider, { store: store }, children);
};
ReactFlowProvider.displayName = 'ReactFlowProvider';

export default ReactFlow;
export { ArrowHeadType, index$2 as Background, BackgroundVariant, ConnectionLineType, ConnectionMode, index$1 as Controls, EdgeText, Handle$1 as Handle, index as MiniMap, PanOnScrollMode, Position, ReactFlowProvider, addEdge, getBezierPath, getConnectedEdges, getCenter as getEdgeCenter, getIncomers, getMarkerEnd, getOutgoers, getSmoothStepPath, isEdge, isNode, removeElements, updateEdge, useStore$1 as useStore, useStoreActions$1 as useStoreActions, useStoreDispatch$1 as useStoreDispatch, useStoreState$1 as useStoreState, useZoomPanHelper };
//# sourceMappingURL=ReactFlow.esm.js.map
