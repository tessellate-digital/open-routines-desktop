(function () {
  const C = document.createElement('link').relList;
  if (C && C.supports && C.supports('modulepreload')) return;
  for (const q of document.querySelectorAll('link[rel="modulepreload"]')) m(q);
  new MutationObserver((q) => {
    for (const Y of q)
      if (Y.type === 'childList')
        for (const V of Y.addedNodes) V.tagName === 'LINK' && V.rel === 'modulepreload' && m(V);
  }).observe(document, { childList: !0, subtree: !0 });
  function _(q) {
    const Y = {};
    return (
      q.integrity && (Y.integrity = q.integrity),
      q.referrerPolicy && (Y.referrerPolicy = q.referrerPolicy),
      q.crossOrigin === 'use-credentials'
        ? (Y.credentials = 'include')
        : q.crossOrigin === 'anonymous'
          ? (Y.credentials = 'omit')
          : (Y.credentials = 'same-origin'),
      Y
    );
  }
  function m(q) {
    if (q.ep) return;
    q.ep = !0;
    const Y = _(q);
    fetch(q.href, Y);
  }
})();
var sf = { exports: {} },
  bu = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Sr;
function e0() {
  if (Sr) return bu;
  Sr = 1;
  var T = Symbol.for('react.transitional.element'),
    C = Symbol.for('react.fragment');
  function _(m, q, Y) {
    var V = null;
    if ((Y !== void 0 && (V = '' + Y), q.key !== void 0 && (V = '' + q.key), 'key' in q)) {
      Y = {};
      for (var F in q) F !== 'key' && (Y[F] = q[F]);
    } else Y = q;
    return ((q = Y.ref), { $$typeof: T, type: m, key: V, ref: q !== void 0 ? q : null, props: Y });
  }
  return ((bu.Fragment = C), (bu.jsx = _), (bu.jsxs = _), bu);
}
var zr;
function a0() {
  return (zr || ((zr = 1), (sf.exports = e0())), sf.exports);
}
var f = a0(),
  df = { exports: {} },
  G = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var jr;
function u0() {
  if (jr) return G;
  jr = 1;
  var T = Symbol.for('react.transitional.element'),
    C = Symbol.for('react.portal'),
    _ = Symbol.for('react.fragment'),
    m = Symbol.for('react.strict_mode'),
    q = Symbol.for('react.profiler'),
    Y = Symbol.for('react.consumer'),
    V = Symbol.for('react.context'),
    F = Symbol.for('react.forward_ref'),
    E = Symbol.for('react.suspense'),
    z = Symbol.for('react.memo'),
    Q = Symbol.for('react.lazy'),
    U = Symbol.for('react.activity'),
    nl = Symbol.iterator;
  function jl(o) {
    return o === null || typeof o != 'object'
      ? null
      : ((o = (nl && o[nl]) || o['@@iterator']), typeof o == 'function' ? o : null);
  }
  var Tl = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    Rl = Object.assign,
    St = {};
  function Xl(o, j, A) {
    ((this.props = o), (this.context = j), (this.refs = St), (this.updater = A || Tl));
  }
  ((Xl.prototype.isReactComponent = {}),
    (Xl.prototype.setState = function (o, j) {
      if (typeof o != 'object' && typeof o != 'function' && o != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.'
        );
      this.updater.enqueueSetState(this, o, j, 'setState');
    }),
    (Xl.prototype.forceUpdate = function (o) {
      this.updater.enqueueForceUpdate(this, o, 'forceUpdate');
    }));
  function Vl() {}
  Vl.prototype = Xl.prototype;
  function rl(o, j, A) {
    ((this.props = o), (this.context = j), (this.refs = St), (this.updater = A || Tl));
  }
  var xl = (rl.prototype = new Vl());
  ((xl.constructor = rl), Rl(xl, Xl.prototype), (xl.isPureReactComponent = !0));
  var Kl = Array.isArray;
  function bl() {}
  var K = { H: null, A: null, T: null, S: null },
    Gl = Object.prototype.hasOwnProperty;
  function dt(o, j, A) {
    var O = A.ref;
    return { $$typeof: T, type: o, key: j, ref: O !== void 0 ? O : null, props: A };
  }
  function Xe(o, j) {
    return dt(o.type, j, o.props);
  }
  function Nt(o) {
    return typeof o == 'object' && o !== null && o.$$typeof === T;
  }
  function Jl(o) {
    var j = { '=': '=0', ':': '=2' };
    return (
      '$' +
      o.replace(/[=:]/g, function (A) {
        return j[A];
      })
    );
  }
  var Se = /\/+/g;
  function Dt(o, j) {
    return typeof o == 'object' && o !== null && o.key != null ? Jl('' + o.key) : j.toString(36);
  }
  function zt(o) {
    switch (o.status) {
      case 'fulfilled':
        return o.value;
      case 'rejected':
        throw o.reason;
      default:
        switch (
          (typeof o.status == 'string'
            ? o.then(bl, bl)
            : ((o.status = 'pending'),
              o.then(
                function (j) {
                  o.status === 'pending' && ((o.status = 'fulfilled'), (o.value = j));
                },
                function (j) {
                  o.status === 'pending' && ((o.status = 'rejected'), (o.reason = j));
                }
              )),
          o.status)
        ) {
          case 'fulfilled':
            return o.value;
          case 'rejected':
            throw o.reason;
        }
    }
    throw o;
  }
  function b(o, j, A, O, X) {
    var J = typeof o;
    (J === 'undefined' || J === 'boolean') && (o = null);
    var el = !1;
    if (o === null) el = !0;
    else
      switch (J) {
        case 'bigint':
        case 'string':
        case 'number':
          el = !0;
          break;
        case 'object':
          switch (o.$$typeof) {
            case T:
            case C:
              el = !0;
              break;
            case Q:
              return ((el = o._init), b(el(o._payload), j, A, O, X));
          }
      }
    if (el)
      return (
        (X = X(o)),
        (el = O === '' ? '.' + Dt(o, 0) : O),
        Kl(X)
          ? ((A = ''),
            el != null && (A = el.replace(Se, '$&/') + '/'),
            b(X, j, A, '', function (Na) {
              return Na;
            }))
          : X != null &&
            (Nt(X) &&
              (X = Xe(
                X,
                A +
                  (X.key == null || (o && o.key === X.key)
                    ? ''
                    : ('' + X.key).replace(Se, '$&/') + '/') +
                  el
              )),
            j.push(X)),
        1
      );
    el = 0;
    var Zl = O === '' ? '.' : O + ':';
    if (Kl(o))
      for (var pl = 0; pl < o.length; pl++)
        ((O = o[pl]), (J = Zl + Dt(O, pl)), (el += b(O, j, A, J, X)));
    else if (((pl = jl(o)), typeof pl == 'function'))
      for (o = pl.call(o), pl = 0; !(O = o.next()).done; )
        ((O = O.value), (J = Zl + Dt(O, pl++)), (el += b(O, j, A, J, X)));
    else if (J === 'object') {
      if (typeof o.then == 'function') return b(zt(o), j, A, O, X);
      throw (
        (j = String(o)),
        Error(
          'Objects are not valid as a React child (found: ' +
            (j === '[object Object]' ? 'object with keys {' + Object.keys(o).join(', ') + '}' : j) +
            '). If you meant to render a collection of children, use an array instead.'
        )
      );
    }
    return el;
  }
  function N(o, j, A) {
    if (o == null) return o;
    var O = [],
      X = 0;
    return (
      b(o, O, '', '', function (J) {
        return j.call(A, J, X++);
      }),
      O
    );
  }
  function B(o) {
    if (o._status === -1) {
      var j = o._result;
      ((j = j()),
        j.then(
          function (A) {
            (o._status === 0 || o._status === -1) && ((o._status = 1), (o._result = A));
          },
          function (A) {
            (o._status === 0 || o._status === -1) && ((o._status = 2), (o._result = A));
          }
        ),
        o._status === -1 && ((o._status = 0), (o._result = j)));
    }
    if (o._status === 1) return o._result.default;
    throw o._result;
  }
  var il =
      typeof reportError == 'function'
        ? reportError
        : function (o) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var j = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof o == 'object' && o !== null && typeof o.message == 'string'
                    ? String(o.message)
                    : String(o),
                error: o,
              });
              if (!window.dispatchEvent(j)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', o);
              return;
            }
            console.error(o);
          },
    dl = {
      map: N,
      forEach: function (o, j, A) {
        N(
          o,
          function () {
            j.apply(this, arguments);
          },
          A
        );
      },
      count: function (o) {
        var j = 0;
        return (
          N(o, function () {
            j++;
          }),
          j
        );
      },
      toArray: function (o) {
        return (
          N(o, function (j) {
            return j;
          }) || []
        );
      },
      only: function (o) {
        if (!Nt(o))
          throw Error('React.Children.only expected to receive a single React element child.');
        return o;
      },
    };
  return (
    (G.Activity = U),
    (G.Children = dl),
    (G.Component = Xl),
    (G.Fragment = _),
    (G.Profiler = q),
    (G.PureComponent = rl),
    (G.StrictMode = m),
    (G.Suspense = E),
    (G.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = K),
    (G.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (o) {
        return K.H.useMemoCache(o);
      },
    }),
    (G.cache = function (o) {
      return function () {
        return o.apply(null, arguments);
      };
    }),
    (G.cacheSignal = function () {
      return null;
    }),
    (G.cloneElement = function (o, j, A) {
      if (o == null) throw Error('The argument must be a React element, but you passed ' + o + '.');
      var O = Rl({}, o.props),
        X = o.key;
      if (j != null)
        for (J in (j.key !== void 0 && (X = '' + j.key), j))
          !Gl.call(j, J) ||
            J === 'key' ||
            J === '__self' ||
            J === '__source' ||
            (J === 'ref' && j.ref === void 0) ||
            (O[J] = j[J]);
      var J = arguments.length - 2;
      if (J === 1) O.children = A;
      else if (1 < J) {
        for (var el = Array(J), Zl = 0; Zl < J; Zl++) el[Zl] = arguments[Zl + 2];
        O.children = el;
      }
      return dt(o.type, X, O);
    }),
    (G.createContext = function (o) {
      return (
        (o = {
          $$typeof: V,
          _currentValue: o,
          _currentValue2: o,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (o.Provider = o),
        (o.Consumer = { $$typeof: Y, _context: o }),
        o
      );
    }),
    (G.createElement = function (o, j, A) {
      var O,
        X = {},
        J = null;
      if (j != null)
        for (O in (j.key !== void 0 && (J = '' + j.key), j))
          Gl.call(j, O) && O !== 'key' && O !== '__self' && O !== '__source' && (X[O] = j[O]);
      var el = arguments.length - 2;
      if (el === 1) X.children = A;
      else if (1 < el) {
        for (var Zl = Array(el), pl = 0; pl < el; pl++) Zl[pl] = arguments[pl + 2];
        X.children = Zl;
      }
      if (o && o.defaultProps)
        for (O in ((el = o.defaultProps), el)) X[O] === void 0 && (X[O] = el[O]);
      return dt(o, J, X);
    }),
    (G.createRef = function () {
      return { current: null };
    }),
    (G.forwardRef = function (o) {
      return { $$typeof: F, render: o };
    }),
    (G.isValidElement = Nt),
    (G.lazy = function (o) {
      return { $$typeof: Q, _payload: { _status: -1, _result: o }, _init: B };
    }),
    (G.memo = function (o, j) {
      return { $$typeof: z, type: o, compare: j === void 0 ? null : j };
    }),
    (G.startTransition = function (o) {
      var j = K.T,
        A = {};
      K.T = A;
      try {
        var O = o(),
          X = K.S;
        (X !== null && X(A, O),
          typeof O == 'object' && O !== null && typeof O.then == 'function' && O.then(bl, il));
      } catch (J) {
        il(J);
      } finally {
        (j !== null && A.types !== null && (j.types = A.types), (K.T = j));
      }
    }),
    (G.unstable_useCacheRefresh = function () {
      return K.H.useCacheRefresh();
    }),
    (G.use = function (o) {
      return K.H.use(o);
    }),
    (G.useActionState = function (o, j, A) {
      return K.H.useActionState(o, j, A);
    }),
    (G.useCallback = function (o, j) {
      return K.H.useCallback(o, j);
    }),
    (G.useContext = function (o) {
      return K.H.useContext(o);
    }),
    (G.useDebugValue = function () {}),
    (G.useDeferredValue = function (o, j) {
      return K.H.useDeferredValue(o, j);
    }),
    (G.useEffect = function (o, j) {
      return K.H.useEffect(o, j);
    }),
    (G.useEffectEvent = function (o) {
      return K.H.useEffectEvent(o);
    }),
    (G.useId = function () {
      return K.H.useId();
    }),
    (G.useImperativeHandle = function (o, j, A) {
      return K.H.useImperativeHandle(o, j, A);
    }),
    (G.useInsertionEffect = function (o, j) {
      return K.H.useInsertionEffect(o, j);
    }),
    (G.useLayoutEffect = function (o, j) {
      return K.H.useLayoutEffect(o, j);
    }),
    (G.useMemo = function (o, j) {
      return K.H.useMemo(o, j);
    }),
    (G.useOptimistic = function (o, j) {
      return K.H.useOptimistic(o, j);
    }),
    (G.useReducer = function (o, j, A) {
      return K.H.useReducer(o, j, A);
    }),
    (G.useRef = function (o) {
      return K.H.useRef(o);
    }),
    (G.useState = function (o) {
      return K.H.useState(o);
    }),
    (G.useSyncExternalStore = function (o, j, A) {
      return K.H.useSyncExternalStore(o, j, A);
    }),
    (G.useTransition = function () {
      return K.H.useTransition();
    }),
    (G.version = '19.2.5'),
    G
  );
}
var Tr;
function vf() {
  return (Tr || ((Tr = 1), (df.exports = u0())), df.exports);
}
var Ml = vf(),
  of = { exports: {} },
  pu = {},
  rf = { exports: {} },
  mf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Er;
function n0() {
  return (
    Er ||
      ((Er = 1),
      (function (T) {
        function C(b, N) {
          var B = b.length;
          b.push(N);
          l: for (; 0 < B; ) {
            var il = (B - 1) >>> 1,
              dl = b[il];
            if (0 < q(dl, N)) ((b[il] = N), (b[B] = dl), (B = il));
            else break l;
          }
        }
        function _(b) {
          return b.length === 0 ? null : b[0];
        }
        function m(b) {
          if (b.length === 0) return null;
          var N = b[0],
            B = b.pop();
          if (B !== N) {
            b[0] = B;
            l: for (var il = 0, dl = b.length, o = dl >>> 1; il < o; ) {
              var j = 2 * (il + 1) - 1,
                A = b[j],
                O = j + 1,
                X = b[O];
              if (0 > q(A, B))
                O < dl && 0 > q(X, A)
                  ? ((b[il] = X), (b[O] = B), (il = O))
                  : ((b[il] = A), (b[j] = B), (il = j));
              else if (O < dl && 0 > q(X, B)) ((b[il] = X), (b[O] = B), (il = O));
              else break l;
            }
          }
          return N;
        }
        function q(b, N) {
          var B = b.sortIndex - N.sortIndex;
          return B !== 0 ? B : b.id - N.id;
        }
        if (
          ((T.unstable_now = void 0),
          typeof performance == 'object' && typeof performance.now == 'function')
        ) {
          var Y = performance;
          T.unstable_now = function () {
            return Y.now();
          };
        } else {
          var V = Date,
            F = V.now();
          T.unstable_now = function () {
            return V.now() - F;
          };
        }
        var E = [],
          z = [],
          Q = 1,
          U = null,
          nl = 3,
          jl = !1,
          Tl = !1,
          Rl = !1,
          St = !1,
          Xl = typeof setTimeout == 'function' ? setTimeout : null,
          Vl = typeof clearTimeout == 'function' ? clearTimeout : null,
          rl = typeof setImmediate < 'u' ? setImmediate : null;
        function xl(b) {
          for (var N = _(z); N !== null; ) {
            if (N.callback === null) m(z);
            else if (N.startTime <= b) (m(z), (N.sortIndex = N.expirationTime), C(E, N));
            else break;
            N = _(z);
          }
        }
        function Kl(b) {
          if (((Rl = !1), xl(b), !Tl))
            if (_(E) !== null) ((Tl = !0), bl || ((bl = !0), Jl()));
            else {
              var N = _(z);
              N !== null && zt(Kl, N.startTime - b);
            }
        }
        var bl = !1,
          K = -1,
          Gl = 5,
          dt = -1;
        function Xe() {
          return St ? !0 : !(T.unstable_now() - dt < Gl);
        }
        function Nt() {
          if (((St = !1), bl)) {
            var b = T.unstable_now();
            dt = b;
            var N = !0;
            try {
              l: {
                ((Tl = !1), Rl && ((Rl = !1), Vl(K), (K = -1)), (jl = !0));
                var B = nl;
                try {
                  t: {
                    for (xl(b), U = _(E); U !== null && !(U.expirationTime > b && Xe()); ) {
                      var il = U.callback;
                      if (typeof il == 'function') {
                        ((U.callback = null), (nl = U.priorityLevel));
                        var dl = il(U.expirationTime <= b);
                        if (((b = T.unstable_now()), typeof dl == 'function')) {
                          ((U.callback = dl), xl(b), (N = !0));
                          break t;
                        }
                        (U === _(E) && m(E), xl(b));
                      } else m(E);
                      U = _(E);
                    }
                    if (U !== null) N = !0;
                    else {
                      var o = _(z);
                      (o !== null && zt(Kl, o.startTime - b), (N = !1));
                    }
                  }
                  break l;
                } finally {
                  ((U = null), (nl = B), (jl = !1));
                }
                N = void 0;
              }
            } finally {
              N ? Jl() : (bl = !1);
            }
          }
        }
        var Jl;
        if (typeof rl == 'function')
          Jl = function () {
            rl(Nt);
          };
        else if (typeof MessageChannel < 'u') {
          var Se = new MessageChannel(),
            Dt = Se.port2;
          ((Se.port1.onmessage = Nt),
            (Jl = function () {
              Dt.postMessage(null);
            }));
        } else
          Jl = function () {
            Xl(Nt, 0);
          };
        function zt(b, N) {
          K = Xl(function () {
            b(T.unstable_now());
          }, N);
        }
        ((T.unstable_IdlePriority = 5),
          (T.unstable_ImmediatePriority = 1),
          (T.unstable_LowPriority = 4),
          (T.unstable_NormalPriority = 3),
          (T.unstable_Profiling = null),
          (T.unstable_UserBlockingPriority = 2),
          (T.unstable_cancelCallback = function (b) {
            b.callback = null;
          }),
          (T.unstable_forceFrameRate = function (b) {
            0 > b || 125 < b
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
                )
              : (Gl = 0 < b ? Math.floor(1e3 / b) : 5);
          }),
          (T.unstable_getCurrentPriorityLevel = function () {
            return nl;
          }),
          (T.unstable_next = function (b) {
            switch (nl) {
              case 1:
              case 2:
              case 3:
                var N = 3;
                break;
              default:
                N = nl;
            }
            var B = nl;
            nl = N;
            try {
              return b();
            } finally {
              nl = B;
            }
          }),
          (T.unstable_requestPaint = function () {
            St = !0;
          }),
          (T.unstable_runWithPriority = function (b, N) {
            switch (b) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                b = 3;
            }
            var B = nl;
            nl = b;
            try {
              return N();
            } finally {
              nl = B;
            }
          }),
          (T.unstable_scheduleCallback = function (b, N, B) {
            var il = T.unstable_now();
            switch (
              (typeof B == 'object' && B !== null
                ? ((B = B.delay), (B = typeof B == 'number' && 0 < B ? il + B : il))
                : (B = il),
              b)
            ) {
              case 1:
                var dl = -1;
                break;
              case 2:
                dl = 250;
                break;
              case 5:
                dl = 1073741823;
                break;
              case 4:
                dl = 1e4;
                break;
              default:
                dl = 5e3;
            }
            return (
              (dl = B + dl),
              (b = {
                id: Q++,
                callback: N,
                priorityLevel: b,
                startTime: B,
                expirationTime: dl,
                sortIndex: -1,
              }),
              B > il
                ? ((b.sortIndex = B),
                  C(z, b),
                  _(E) === null &&
                    b === _(z) &&
                    (Rl ? (Vl(K), (K = -1)) : (Rl = !0), zt(Kl, B - il)))
                : ((b.sortIndex = dl), C(E, b), Tl || jl || ((Tl = !0), bl || ((bl = !0), Jl()))),
              b
            );
          }),
          (T.unstable_shouldYield = Xe),
          (T.unstable_wrapCallback = function (b) {
            var N = nl;
            return function () {
              var B = nl;
              nl = N;
              try {
                return b.apply(this, arguments);
              } finally {
                nl = B;
              }
            };
          }));
      })(mf)),
    mf
  );
}
var Nr;
function i0() {
  return (Nr || ((Nr = 1), (rf.exports = n0())), rf.exports);
}
var hf = { exports: {} },
  Ql = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ar;
function c0() {
  if (Ar) return Ql;
  Ar = 1;
  var T = vf();
  function C(E) {
    var z = 'https://react.dev/errors/' + E;
    if (1 < arguments.length) {
      z += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var Q = 2; Q < arguments.length; Q++) z += '&args[]=' + encodeURIComponent(arguments[Q]);
    }
    return (
      'Minified React error #' +
      E +
      '; visit ' +
      z +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function _() {}
  var m = {
      d: {
        f: _,
        r: function () {
          throw Error(C(522));
        },
        D: _,
        C: _,
        L: _,
        m: _,
        X: _,
        S: _,
        M: _,
      },
      p: 0,
      findDOMNode: null,
    },
    q = Symbol.for('react.portal');
  function Y(E, z, Q) {
    var U = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: q,
      key: U == null ? null : '' + U,
      children: E,
      containerInfo: z,
      implementation: Q,
    };
  }
  var V = T.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function F(E, z) {
    if (E === 'font') return '';
    if (typeof z == 'string') return z === 'use-credentials' ? z : '';
  }
  return (
    (Ql.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = m),
    (Ql.createPortal = function (E, z) {
      var Q = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!z || (z.nodeType !== 1 && z.nodeType !== 9 && z.nodeType !== 11)) throw Error(C(299));
      return Y(E, z, null, Q);
    }),
    (Ql.flushSync = function (E) {
      var z = V.T,
        Q = m.p;
      try {
        if (((V.T = null), (m.p = 2), E)) return E();
      } finally {
        ((V.T = z), (m.p = Q), m.d.f());
      }
    }),
    (Ql.preconnect = function (E, z) {
      typeof E == 'string' &&
        (z
          ? ((z = z.crossOrigin),
            (z = typeof z == 'string' ? (z === 'use-credentials' ? z : '') : void 0))
          : (z = null),
        m.d.C(E, z));
    }),
    (Ql.prefetchDNS = function (E) {
      typeof E == 'string' && m.d.D(E);
    }),
    (Ql.preinit = function (E, z) {
      if (typeof E == 'string' && z && typeof z.as == 'string') {
        var Q = z.as,
          U = F(Q, z.crossOrigin),
          nl = typeof z.integrity == 'string' ? z.integrity : void 0,
          jl = typeof z.fetchPriority == 'string' ? z.fetchPriority : void 0;
        Q === 'style'
          ? m.d.S(E, typeof z.precedence == 'string' ? z.precedence : void 0, {
              crossOrigin: U,
              integrity: nl,
              fetchPriority: jl,
            })
          : Q === 'script' &&
            m.d.X(E, {
              crossOrigin: U,
              integrity: nl,
              fetchPriority: jl,
              nonce: typeof z.nonce == 'string' ? z.nonce : void 0,
            });
      }
    }),
    (Ql.preinitModule = function (E, z) {
      if (typeof E == 'string')
        if (typeof z == 'object' && z !== null) {
          if (z.as == null || z.as === 'script') {
            var Q = F(z.as, z.crossOrigin);
            m.d.M(E, {
              crossOrigin: Q,
              integrity: typeof z.integrity == 'string' ? z.integrity : void 0,
              nonce: typeof z.nonce == 'string' ? z.nonce : void 0,
            });
          }
        } else z == null && m.d.M(E);
    }),
    (Ql.preload = function (E, z) {
      if (typeof E == 'string' && typeof z == 'object' && z !== null && typeof z.as == 'string') {
        var Q = z.as,
          U = F(Q, z.crossOrigin);
        m.d.L(E, Q, {
          crossOrigin: U,
          integrity: typeof z.integrity == 'string' ? z.integrity : void 0,
          nonce: typeof z.nonce == 'string' ? z.nonce : void 0,
          type: typeof z.type == 'string' ? z.type : void 0,
          fetchPriority: typeof z.fetchPriority == 'string' ? z.fetchPriority : void 0,
          referrerPolicy: typeof z.referrerPolicy == 'string' ? z.referrerPolicy : void 0,
          imageSrcSet: typeof z.imageSrcSet == 'string' ? z.imageSrcSet : void 0,
          imageSizes: typeof z.imageSizes == 'string' ? z.imageSizes : void 0,
          media: typeof z.media == 'string' ? z.media : void 0,
        });
      }
    }),
    (Ql.preloadModule = function (E, z) {
      if (typeof E == 'string')
        if (z) {
          var Q = F(z.as, z.crossOrigin);
          m.d.m(E, {
            as: typeof z.as == 'string' && z.as !== 'script' ? z.as : void 0,
            crossOrigin: Q,
            integrity: typeof z.integrity == 'string' ? z.integrity : void 0,
          });
        } else m.d.m(E);
    }),
    (Ql.requestFormReset = function (E) {
      m.d.r(E);
    }),
    (Ql.unstable_batchedUpdates = function (E, z) {
      return E(z);
    }),
    (Ql.useFormState = function (E, z, Q) {
      return V.H.useFormState(E, z, Q);
    }),
    (Ql.useFormStatus = function () {
      return V.H.useHostTransitionStatus();
    }),
    (Ql.version = '19.2.5'),
    Ql
  );
}
var _r;
function f0() {
  if (_r) return hf.exports;
  _r = 1;
  function T() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(T);
      } catch (C) {
        console.error(C);
      }
  }
  return (T(), (hf.exports = c0()), hf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Mr;
function s0() {
  if (Mr) return pu;
  Mr = 1;
  var T = i0(),
    C = vf(),
    _ = f0();
  function m(l) {
    var t = 'https://react.dev/errors/' + l;
    if (1 < arguments.length) {
      t += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++) t += '&args[]=' + encodeURIComponent(arguments[e]);
    }
    return (
      'Minified React error #' +
      l +
      '; visit ' +
      t +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function q(l) {
    return !(!l || (l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11));
  }
  function Y(l) {
    var t = l,
      e = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do ((t = l), (t.flags & 4098) !== 0 && (e = t.return), (l = t.return));
      while (l);
    }
    return t.tag === 3 ? e : null;
  }
  function V(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if ((t === null && ((l = l.alternate), l !== null && (t = l.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function F(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if ((t === null && ((l = l.alternate), l !== null && (t = l.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function E(l) {
    if (Y(l) !== l) throw Error(m(188));
  }
  function z(l) {
    var t = l.alternate;
    if (!t) {
      if (((t = Y(l)), t === null)) throw Error(m(188));
      return t !== l ? null : l;
    }
    for (var e = l, a = t; ; ) {
      var u = e.return;
      if (u === null) break;
      var n = u.alternate;
      if (n === null) {
        if (((a = u.return), a !== null)) {
          e = a;
          continue;
        }
        break;
      }
      if (u.child === n.child) {
        for (n = u.child; n; ) {
          if (n === e) return (E(u), l);
          if (n === a) return (E(u), t);
          n = n.sibling;
        }
        throw Error(m(188));
      }
      if (e.return !== a.return) ((e = u), (a = n));
      else {
        for (var i = !1, c = u.child; c; ) {
          if (c === e) {
            ((i = !0), (e = u), (a = n));
            break;
          }
          if (c === a) {
            ((i = !0), (a = u), (e = n));
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = n.child; c; ) {
            if (c === e) {
              ((i = !0), (e = n), (a = u));
              break;
            }
            if (c === a) {
              ((i = !0), (a = n), (e = u));
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(m(189));
        }
      }
      if (e.alternate !== a) throw Error(m(190));
    }
    if (e.tag !== 3) throw Error(m(188));
    return e.stateNode.current === e ? l : t;
  }
  function Q(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (((t = Q(l)), t !== null)) return t;
      l = l.sibling;
    }
    return null;
  }
  var U = Object.assign,
    nl = Symbol.for('react.element'),
    jl = Symbol.for('react.transitional.element'),
    Tl = Symbol.for('react.portal'),
    Rl = Symbol.for('react.fragment'),
    St = Symbol.for('react.strict_mode'),
    Xl = Symbol.for('react.profiler'),
    Vl = Symbol.for('react.consumer'),
    rl = Symbol.for('react.context'),
    xl = Symbol.for('react.forward_ref'),
    Kl = Symbol.for('react.suspense'),
    bl = Symbol.for('react.suspense_list'),
    K = Symbol.for('react.memo'),
    Gl = Symbol.for('react.lazy'),
    dt = Symbol.for('react.activity'),
    Xe = Symbol.for('react.memo_cache_sentinel'),
    Nt = Symbol.iterator;
  function Jl(l) {
    return l === null || typeof l != 'object'
      ? null
      : ((l = (Nt && l[Nt]) || l['@@iterator']), typeof l == 'function' ? l : null);
  }
  var Se = Symbol.for('react.client.reference');
  function Dt(l) {
    if (l == null) return null;
    if (typeof l == 'function') return l.$$typeof === Se ? null : l.displayName || l.name || null;
    if (typeof l == 'string') return l;
    switch (l) {
      case Rl:
        return 'Fragment';
      case Xl:
        return 'Profiler';
      case St:
        return 'StrictMode';
      case Kl:
        return 'Suspense';
      case bl:
        return 'SuspenseList';
      case dt:
        return 'Activity';
    }
    if (typeof l == 'object')
      switch (l.$$typeof) {
        case Tl:
          return 'Portal';
        case rl:
          return l.displayName || 'Context';
        case Vl:
          return (l._context.displayName || 'Context') + '.Consumer';
        case xl:
          var t = l.render;
          return (
            (l = l.displayName),
            l ||
              ((l = t.displayName || t.name || ''),
              (l = l !== '' ? 'ForwardRef(' + l + ')' : 'ForwardRef')),
            l
          );
        case K:
          return ((t = l.displayName || null), t !== null ? t : Dt(l.type) || 'Memo');
        case Gl:
          ((t = l._payload), (l = l._init));
          try {
            return Dt(l(t));
          } catch {}
      }
    return null;
  }
  var zt = Array.isArray,
    b = C.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    N = _.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    B = { pending: !1, data: null, method: null, action: null },
    il = [],
    dl = -1;
  function o(l) {
    return { current: l };
  }
  function j(l) {
    0 > dl || ((l.current = il[dl]), (il[dl] = null), dl--);
  }
  function A(l, t) {
    (dl++, (il[dl] = l.current), (l.current = t));
  }
  var O = o(null),
    X = o(null),
    J = o(null),
    el = o(null);
  function Zl(l, t) {
    switch ((A(J, t), A(X, l), A(O, null), t.nodeType)) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Vo(l) : 0;
        break;
      default:
        if (((l = t.tagName), (t = t.namespaceURI))) ((t = Vo(t)), (l = Ko(t, l)));
        else
          switch (l) {
            case 'svg':
              l = 1;
              break;
            case 'math':
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    (j(O), A(O, l));
  }
  function pl() {
    (j(O), j(X), j(J));
  }
  function Na(l) {
    l.memoizedState !== null && A(el, l);
    var t = O.current,
      e = Ko(t, l.type);
    t !== e && (A(X, l), A(O, e));
  }
  function zu(l) {
    (X.current === l && (j(O), j(X)), el.current === l && (j(el), (vu._currentValue = B)));
  }
  var Vn, bf;
  function ze(l) {
    if (Vn === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        ((Vn = (t && t[1]) || ''),
          (bf =
            -1 <
            e.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < e.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      Vn +
      l +
      bf
    );
  }
  var Kn = !1;
  function Jn(l, t) {
    if (!l || Kn) return '';
    Kn = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var S = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(S.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(S, []);
                } catch (g) {
                  var y = g;
                }
                Reflect.construct(l, [], S);
              } else {
                try {
                  S.call();
                } catch (g) {
                  y = g;
                }
                l.call(S.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (g) {
                y = g;
              }
              (S = l()) && typeof S.catch == 'function' && S.catch(function () {});
            }
          } catch (g) {
            if (g && y && typeof g.stack == 'string') return [g.stack, y.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var u = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, 'name');
      u &&
        u.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        });
      var n = a.DetermineComponentFrameRoot(),
        i = n[0],
        c = n[1];
      if (i && c) {
        var s = i.split(`
`),
          v = c.split(`
`);
        for (u = a = 0; a < s.length && !s[a].includes('DetermineComponentFrameRoot'); ) a++;
        for (; u < v.length && !v[u].includes('DetermineComponentFrameRoot'); ) u++;
        if (a === s.length || u === v.length)
          for (a = s.length - 1, u = v.length - 1; 1 <= a && 0 <= u && s[a] !== v[u]; ) u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (s[a] !== v[u]) {
            if (a !== 1 || u !== 1)
              do
                if ((a--, u--, 0 > u || s[a] !== v[u])) {
                  var x =
                    `
` + s[a].replace(' at new ', ' at ');
                  return (
                    l.displayName &&
                      x.includes('<anonymous>') &&
                      (x = x.replace('<anonymous>', l.displayName)),
                    x
                  );
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      ((Kn = !1), (Error.prepareStackTrace = e));
    }
    return (e = l ? l.displayName || l.name : '') ? ze(e) : '';
  }
  function Rr(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return ze(l.type);
      case 16:
        return ze('Lazy');
      case 13:
        return l.child !== t && t !== null ? ze('Suspense Fallback') : ze('Suspense');
      case 19:
        return ze('SuspenseList');
      case 0:
      case 15:
        return Jn(l.type, !1);
      case 11:
        return Jn(l.type.render, !1);
      case 1:
        return Jn(l.type, !0);
      case 31:
        return ze('Activity');
      default:
        return '';
    }
  }
  function pf(l) {
    try {
      var t = '',
        e = null;
      do ((t += Rr(l, e)), (e = l), (l = l.return));
      while (l);
      return t;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var wn = Object.prototype.hasOwnProperty,
    kn = T.unstable_scheduleCallback,
    Wn = T.unstable_cancelCallback,
    Hr = T.unstable_shouldYield,
    Cr = T.unstable_requestPaint,
    lt = T.unstable_now,
    qr = T.unstable_getCurrentPriorityLevel,
    Sf = T.unstable_ImmediatePriority,
    zf = T.unstable_UserBlockingPriority,
    ju = T.unstable_NormalPriority,
    Br = T.unstable_LowPriority,
    jf = T.unstable_IdlePriority,
    Yr = T.log,
    Gr = T.unstable_setDisableYieldValue,
    Aa = null,
    tt = null;
  function $t(l) {
    if ((typeof Yr == 'function' && Gr(l), tt && typeof tt.setStrictMode == 'function'))
      try {
        tt.setStrictMode(Aa, l);
      } catch {}
  }
  var et = Math.clz32 ? Math.clz32 : Zr,
    Qr = Math.log,
    Xr = Math.LN2;
  function Zr(l) {
    return ((l >>>= 0), l === 0 ? 32 : (31 - ((Qr(l) / Xr) | 0)) | 0);
  }
  var Tu = 256,
    Eu = 262144,
    Nu = 4194304;
  function je(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function Au(l, t, e) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var u = 0,
      n = l.suspendedLanes,
      i = l.pingedLanes;
    l = l.warmLanes;
    var c = a & 134217727;
    return (
      c !== 0
        ? ((a = c & ~n),
          a !== 0
            ? (u = je(a))
            : ((i &= c), i !== 0 ? (u = je(i)) : e || ((e = c & ~l), e !== 0 && (u = je(e)))))
        : ((c = a & ~n),
          c !== 0
            ? (u = je(c))
            : i !== 0
              ? (u = je(i))
              : e || ((e = a & ~l), e !== 0 && (u = je(e)))),
      u === 0
        ? 0
        : t !== 0 &&
            t !== u &&
            (t & n) === 0 &&
            ((n = u & -u), (e = t & -t), n >= e || (n === 32 && (e & 4194048) !== 0))
          ? t
          : u
    );
  }
  function _a(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Lr(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Tf() {
    var l = Nu;
    return ((Nu <<= 1), (Nu & 62914560) === 0 && (Nu = 4194304), l);
  }
  function $n(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function Ma(l, t) {
    ((l.pendingLanes |= t),
      t !== 268435456 && ((l.suspendedLanes = 0), (l.pingedLanes = 0), (l.warmLanes = 0)));
  }
  function Vr(l, t, e, a, u, n) {
    var i = l.pendingLanes;
    ((l.pendingLanes = e),
      (l.suspendedLanes = 0),
      (l.pingedLanes = 0),
      (l.warmLanes = 0),
      (l.expiredLanes &= e),
      (l.entangledLanes &= e),
      (l.errorRecoveryDisabledLanes &= e),
      (l.shellSuspendCounter = 0));
    var c = l.entanglements,
      s = l.expirationTimes,
      v = l.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var x = 31 - et(e),
        S = 1 << x;
      ((c[x] = 0), (s[x] = -1));
      var y = v[x];
      if (y !== null)
        for (v[x] = null, x = 0; x < y.length; x++) {
          var g = y[x];
          g !== null && (g.lane &= -536870913);
        }
      e &= ~S;
    }
    (a !== 0 && Ef(l, a, 0),
      n !== 0 && u === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(i & ~t)));
  }
  function Ef(l, t, e) {
    ((l.pendingLanes |= t), (l.suspendedLanes &= ~t));
    var a = 31 - et(t);
    ((l.entangledLanes |= t),
      (l.entanglements[a] = l.entanglements[a] | 1073741824 | (e & 261930)));
  }
  function Nf(l, t) {
    var e = (l.entangledLanes |= t);
    for (l = l.entanglements; e; ) {
      var a = 31 - et(e),
        u = 1 << a;
      ((u & t) | (l[a] & t) && (l[a] |= t), (e &= ~u));
    }
  }
  function Af(l, t) {
    var e = t & -t;
    return ((e = (e & 42) !== 0 ? 1 : Fn(e)), (e & (l.suspendedLanes | t)) !== 0 ? 0 : e);
  }
  function Fn(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function In(l) {
    return ((l &= -l), 2 < l ? (8 < l ? ((l & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function _f() {
    var l = N.p;
    return l !== 0 ? l : ((l = window.event), l === void 0 ? 32 : hr(l.type));
  }
  function Mf(l, t) {
    var e = N.p;
    try {
      return ((N.p = l), t());
    } finally {
      N.p = e;
    }
  }
  var Ft = Math.random().toString(36).slice(2),
    Hl = '__reactFiber$' + Ft,
    wl = '__reactProps$' + Ft,
    Ze = '__reactContainer$' + Ft,
    Pn = '__reactEvents$' + Ft,
    Kr = '__reactListeners$' + Ft,
    Jr = '__reactHandles$' + Ft,
    Of = '__reactResources$' + Ft,
    Oa = '__reactMarker$' + Ft;
  function li(l) {
    (delete l[Hl], delete l[wl], delete l[Pn], delete l[Kr], delete l[Jr]);
  }
  function Le(l) {
    var t = l[Hl];
    if (t) return t;
    for (var e = l.parentNode; e; ) {
      if ((t = e[Ze] || e[Hl])) {
        if (((e = t.alternate), t.child !== null || (e !== null && e.child !== null)))
          for (l = Io(l); l !== null; ) {
            if ((e = l[Hl])) return e;
            l = Io(l);
          }
        return t;
      }
      ((l = e), (e = l.parentNode));
    }
    return null;
  }
  function Ve(l) {
    if ((l = l[Hl] || l[Ze])) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return l;
    }
    return null;
  }
  function Da(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(m(33));
  }
  function Ke(l) {
    var t = l[Of];
    return (t || (t = l[Of] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function Dl(l) {
    l[Oa] = !0;
  }
  var Df = new Set(),
    Uf = {};
  function Te(l, t) {
    (Je(l, t), Je(l + 'Capture', t));
  }
  function Je(l, t) {
    for (Uf[l] = t, l = 0; l < t.length; l++) Df.add(t[l]);
  }
  var wr = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$'
    ),
    Rf = {},
    Hf = {};
  function kr(l) {
    return wn.call(Hf, l)
      ? !0
      : wn.call(Rf, l)
        ? !1
        : wr.test(l)
          ? (Hf[l] = !0)
          : ((Rf[l] = !0), !1);
  }
  function _u(l, t, e) {
    if (kr(t))
      if (e === null) l.removeAttribute(t);
      else {
        switch (typeof e) {
          case 'undefined':
          case 'function':
          case 'symbol':
            l.removeAttribute(t);
            return;
          case 'boolean':
            var a = t.toLowerCase().slice(0, 5);
            if (a !== 'data-' && a !== 'aria-') {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, '' + e);
      }
  }
  function Mu(l, t, e) {
    if (e === null) l.removeAttribute(t);
    else {
      switch (typeof e) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, '' + e);
    }
  }
  function Ut(l, t, e, a) {
    if (a === null) l.removeAttribute(e);
    else {
      switch (typeof a) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          l.removeAttribute(e);
          return;
      }
      l.setAttributeNS(t, e, '' + a);
    }
  }
  function ot(l) {
    switch (typeof l) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return l;
      case 'object':
        return l;
      default:
        return '';
    }
  }
  function Cf(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  }
  function Wr(l, t, e) {
    var a = Object.getOwnPropertyDescriptor(l.constructor.prototype, t);
    if (
      !l.hasOwnProperty(t) &&
      typeof a < 'u' &&
      typeof a.get == 'function' &&
      typeof a.set == 'function'
    ) {
      var u = a.get,
        n = a.set;
      return (
        Object.defineProperty(l, t, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (i) {
            ((e = '' + i), n.call(this, i));
          },
        }),
        Object.defineProperty(l, t, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return e;
          },
          setValue: function (i) {
            e = '' + i;
          },
          stopTracking: function () {
            ((l._valueTracker = null), delete l[t]);
          },
        }
      );
    }
  }
  function ti(l) {
    if (!l._valueTracker) {
      var t = Cf(l) ? 'checked' : 'value';
      l._valueTracker = Wr(l, t, '' + l[t]);
    }
  }
  function qf(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(),
      a = '';
    return (
      l && (a = Cf(l) ? (l.checked ? 'true' : 'false') : l.value),
      (l = a),
      l !== e ? (t.setValue(l), !0) : !1
    );
  }
  function Ou(l) {
    if (((l = l || (typeof document < 'u' ? document : void 0)), typeof l > 'u')) return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var $r = /[\n"\\]/g;
  function rt(l) {
    return l.replace($r, function (t) {
      return '\\' + t.charCodeAt(0).toString(16) + ' ';
    });
  }
  function ei(l, t, e, a, u, n, i, c) {
    ((l.name = ''),
      i != null && typeof i != 'function' && typeof i != 'symbol' && typeof i != 'boolean'
        ? (l.type = i)
        : l.removeAttribute('type'),
      t != null
        ? i === 'number'
          ? ((t === 0 && l.value === '') || l.value != t) && (l.value = '' + ot(t))
          : l.value !== '' + ot(t) && (l.value = '' + ot(t))
        : (i !== 'submit' && i !== 'reset') || l.removeAttribute('value'),
      t != null
        ? ai(l, i, ot(t))
        : e != null
          ? ai(l, i, ot(e))
          : a != null && l.removeAttribute('value'),
      u == null && n != null && (l.defaultChecked = !!n),
      u != null && (l.checked = u && typeof u != 'function' && typeof u != 'symbol'),
      c != null && typeof c != 'function' && typeof c != 'symbol' && typeof c != 'boolean'
        ? (l.name = '' + ot(c))
        : l.removeAttribute('name'));
  }
  function Bf(l, t, e, a, u, n, i, c) {
    if (
      (n != null &&
        typeof n != 'function' &&
        typeof n != 'symbol' &&
        typeof n != 'boolean' &&
        (l.type = n),
      t != null || e != null)
    ) {
      if (!((n !== 'submit' && n !== 'reset') || t != null)) {
        ti(l);
        return;
      }
      ((e = e != null ? '' + ot(e) : ''),
        (t = t != null ? '' + ot(t) : e),
        c || t === l.value || (l.value = t),
        (l.defaultValue = t));
    }
    ((a = a ?? u),
      (a = typeof a != 'function' && typeof a != 'symbol' && !!a),
      (l.checked = c ? l.checked : !!a),
      (l.defaultChecked = !!a),
      i != null &&
        typeof i != 'function' &&
        typeof i != 'symbol' &&
        typeof i != 'boolean' &&
        (l.name = i),
      ti(l));
  }
  function ai(l, t, e) {
    (t === 'number' && Ou(l.ownerDocument) === l) ||
      l.defaultValue === '' + e ||
      (l.defaultValue = '' + e);
  }
  function we(l, t, e, a) {
    if (((l = l.options), t)) {
      t = {};
      for (var u = 0; u < e.length; u++) t['$' + e[u]] = !0;
      for (e = 0; e < l.length; e++)
        ((u = t.hasOwnProperty('$' + l[e].value)),
          l[e].selected !== u && (l[e].selected = u),
          u && a && (l[e].defaultSelected = !0));
    } else {
      for (e = '' + ot(e), t = null, u = 0; u < l.length; u++) {
        if (l[u].value === e) {
          ((l[u].selected = !0), a && (l[u].defaultSelected = !0));
          return;
        }
        t !== null || l[u].disabled || (t = l[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Yf(l, t, e) {
    if (t != null && ((t = '' + ot(t)), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? '' + ot(e) : '';
  }
  function Gf(l, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(m(92));
        if (zt(a)) {
          if (1 < a.length) throw Error(m(93));
          a = a[0];
        }
        e = a;
      }
      (e == null && (e = ''), (t = e));
    }
    ((e = ot(t)),
      (l.defaultValue = e),
      (a = l.textContent),
      a === e && a !== '' && a !== null && (l.value = a),
      ti(l));
  }
  function ke(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Fr = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' '
    )
  );
  function Qf(l, t, e) {
    var a = t.indexOf('--') === 0;
    e == null || typeof e == 'boolean' || e === ''
      ? a
        ? l.setProperty(t, '')
        : t === 'float'
          ? (l.cssFloat = '')
          : (l[t] = '')
      : a
        ? l.setProperty(t, e)
        : typeof e != 'number' || e === 0 || Fr.has(t)
          ? t === 'float'
            ? (l.cssFloat = e)
            : (l[t] = ('' + e).trim())
          : (l[t] = e + 'px');
  }
  function Xf(l, t, e) {
    if (t != null && typeof t != 'object') throw Error(m(62));
    if (((l = l.style), e != null)) {
      for (var a in e)
        !e.hasOwnProperty(a) ||
          (t != null && t.hasOwnProperty(a)) ||
          (a.indexOf('--') === 0
            ? l.setProperty(a, '')
            : a === 'float'
              ? (l.cssFloat = '')
              : (l[a] = ''));
      for (var u in t) ((a = t[u]), t.hasOwnProperty(u) && e[u] !== a && Qf(l, u, a));
    } else for (var n in t) t.hasOwnProperty(n) && Qf(l, n, t[n]);
  }
  function ui(l) {
    if (l.indexOf('-') === -1) return !1;
    switch (l) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var Ir = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    Pr =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Du(l) {
    return Pr.test('' + l)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : l;
  }
  function Rt() {}
  var ni = null;
  function ii(l) {
    return (
      (l = l.target || l.srcElement || window),
      l.correspondingUseElement && (l = l.correspondingUseElement),
      l.nodeType === 3 ? l.parentNode : l
    );
  }
  var We = null,
    $e = null;
  function Zf(l) {
    var t = Ve(l);
    if (t && (l = t.stateNode)) {
      var e = l[wl] || null;
      l: switch (((l = t.stateNode), t.type)) {
        case 'input':
          if (
            (ei(
              l,
              e.value,
              e.defaultValue,
              e.defaultValue,
              e.checked,
              e.defaultChecked,
              e.type,
              e.name
            ),
            (t = e.name),
            e.type === 'radio' && t != null)
          ) {
            for (e = l; e.parentNode; ) e = e.parentNode;
            for (
              e = e.querySelectorAll('input[name="' + rt('' + t) + '"][type="radio"]'), t = 0;
              t < e.length;
              t++
            ) {
              var a = e[t];
              if (a !== l && a.form === l.form) {
                var u = a[wl] || null;
                if (!u) throw Error(m(90));
                ei(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (t = 0; t < e.length; t++) ((a = e[t]), a.form === l.form && qf(a));
          }
          break l;
        case 'textarea':
          Yf(l, e.value, e.defaultValue);
          break l;
        case 'select':
          ((t = e.value), t != null && we(l, !!e.multiple, t, !1));
      }
    }
  }
  var ci = !1;
  function Lf(l, t, e) {
    if (ci) return l(t, e);
    ci = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (
        ((ci = !1),
        (We !== null || $e !== null) &&
          (bn(), We && ((t = We), (l = $e), ($e = We = null), Zf(t), l)))
      )
        for (t = 0; t < l.length; t++) Zf(l[t]);
    }
  }
  function Ua(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var a = e[wl] || null;
    if (a === null) return null;
    e = a[t];
    l: switch (t) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((a = !a.disabled) ||
          ((l = l.type),
          (a = !(l === 'button' || l === 'input' || l === 'select' || l === 'textarea'))),
          (l = !a));
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (e && typeof e != 'function') throw Error(m(231, t, typeof e));
    return e;
  }
  var Ht = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    fi = !1;
  if (Ht)
    try {
      var Ra = {};
      (Object.defineProperty(Ra, 'passive', {
        get: function () {
          fi = !0;
        },
      }),
        window.addEventListener('test', Ra, Ra),
        window.removeEventListener('test', Ra, Ra));
    } catch {
      fi = !1;
    }
  var It = null,
    si = null,
    Uu = null;
  function Vf() {
    if (Uu) return Uu;
    var l,
      t = si,
      e = t.length,
      a,
      u = 'value' in It ? It.value : It.textContent,
      n = u.length;
    for (l = 0; l < e && t[l] === u[l]; l++);
    var i = e - l;
    for (a = 1; a <= i && t[e - a] === u[n - a]; a++);
    return (Uu = u.slice(l, 1 < a ? 1 - a : void 0));
  }
  function Ru(l) {
    var t = l.keyCode;
    return (
      'charCode' in l ? ((l = l.charCode), l === 0 && t === 13 && (l = 13)) : (l = t),
      l === 10 && (l = 13),
      32 <= l || l === 13 ? l : 0
    );
  }
  function Hu() {
    return !0;
  }
  function Kf() {
    return !1;
  }
  function kl(l) {
    function t(e, a, u, n, i) {
      ((this._reactName = e),
        (this._targetInst = u),
        (this.type = a),
        (this.nativeEvent = n),
        (this.target = i),
        (this.currentTarget = null));
      for (var c in l) l.hasOwnProperty(c) && ((e = l[c]), (this[c] = e ? e(n) : n[c]));
      return (
        (this.isDefaultPrevented = (
          n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1
        )
          ? Hu
          : Kf),
        (this.isPropagationStopped = Kf),
        this
      );
    }
    return (
      U(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault
              ? e.preventDefault()
              : typeof e.returnValue != 'unknown' && (e.returnValue = !1),
            (this.isDefaultPrevented = Hu));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation
              ? e.stopPropagation()
              : typeof e.cancelBubble != 'unknown' && (e.cancelBubble = !0),
            (this.isPropagationStopped = Hu));
        },
        persist: function () {},
        isPersistent: Hu,
      }),
      t
    );
  }
  var Ee = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (l) {
        return l.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Cu = kl(Ee),
    Ha = U({}, Ee, { view: 0, detail: 0 }),
    lm = kl(Ha),
    di,
    oi,
    Ca,
    qu = U({}, Ha, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: mi,
      button: 0,
      buttons: 0,
      relatedTarget: function (l) {
        return l.relatedTarget === void 0
          ? l.fromElement === l.srcElement
            ? l.toElement
            : l.fromElement
          : l.relatedTarget;
      },
      movementX: function (l) {
        return 'movementX' in l
          ? l.movementX
          : (l !== Ca &&
              (Ca && l.type === 'mousemove'
                ? ((di = l.screenX - Ca.screenX), (oi = l.screenY - Ca.screenY))
                : (oi = di = 0),
              (Ca = l)),
            di);
      },
      movementY: function (l) {
        return 'movementY' in l ? l.movementY : oi;
      },
    }),
    Jf = kl(qu),
    tm = U({}, qu, { dataTransfer: 0 }),
    em = kl(tm),
    am = U({}, Ha, { relatedTarget: 0 }),
    ri = kl(am),
    um = U({}, Ee, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    nm = kl(um),
    im = U({}, Ee, {
      clipboardData: function (l) {
        return 'clipboardData' in l ? l.clipboardData : window.clipboardData;
      },
    }),
    cm = kl(im),
    fm = U({}, Ee, { data: 0 }),
    wf = kl(fm),
    sm = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    dm = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    om = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function rm(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = om[l]) ? !!t[l] : !1;
  }
  function mi() {
    return rm;
  }
  var mm = U({}, Ha, {
      key: function (l) {
        if (l.key) {
          var t = sm[l.key] || l.key;
          if (t !== 'Unidentified') return t;
        }
        return l.type === 'keypress'
          ? ((l = Ru(l)), l === 13 ? 'Enter' : String.fromCharCode(l))
          : l.type === 'keydown' || l.type === 'keyup'
            ? dm[l.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: mi,
      charCode: function (l) {
        return l.type === 'keypress' ? Ru(l) : 0;
      },
      keyCode: function (l) {
        return l.type === 'keydown' || l.type === 'keyup' ? l.keyCode : 0;
      },
      which: function (l) {
        return l.type === 'keypress'
          ? Ru(l)
          : l.type === 'keydown' || l.type === 'keyup'
            ? l.keyCode
            : 0;
      },
    }),
    hm = kl(mm),
    vm = U({}, qu, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    kf = kl(vm),
    ym = U({}, Ha, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: mi,
    }),
    gm = kl(ym),
    xm = U({}, Ee, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    bm = kl(xm),
    pm = U({}, qu, {
      deltaX: function (l) {
        return 'deltaX' in l ? l.deltaX : 'wheelDeltaX' in l ? -l.wheelDeltaX : 0;
      },
      deltaY: function (l) {
        return 'deltaY' in l
          ? l.deltaY
          : 'wheelDeltaY' in l
            ? -l.wheelDeltaY
            : 'wheelDelta' in l
              ? -l.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Sm = kl(pm),
    zm = U({}, Ee, { newState: 0, oldState: 0 }),
    jm = kl(zm),
    Tm = [9, 13, 27, 32],
    hi = Ht && 'CompositionEvent' in window,
    qa = null;
  Ht && 'documentMode' in document && (qa = document.documentMode);
  var Em = Ht && 'TextEvent' in window && !qa,
    Wf = Ht && (!hi || (qa && 8 < qa && 11 >= qa)),
    $f = ' ',
    Ff = !1;
  function If(l, t) {
    switch (l) {
      case 'keyup':
        return Tm.indexOf(t.keyCode) !== -1;
      case 'keydown':
        return t.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function Pf(l) {
    return ((l = l.detail), typeof l == 'object' && 'data' in l ? l.data : null);
  }
  var Fe = !1;
  function Nm(l, t) {
    switch (l) {
      case 'compositionend':
        return Pf(t);
      case 'keypress':
        return t.which !== 32 ? null : ((Ff = !0), $f);
      case 'textInput':
        return ((l = t.data), l === $f && Ff ? null : l);
      default:
        return null;
    }
  }
  function Am(l, t) {
    if (Fe)
      return l === 'compositionend' || (!hi && If(l, t))
        ? ((l = Vf()), (Uu = si = It = null), (Fe = !1), l)
        : null;
    switch (l) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case 'compositionend':
        return Wf && t.locale !== 'ko' ? null : t.data;
      default:
        return null;
    }
  }
  var _m = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function ls(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === 'input' ? !!_m[l.type] : t === 'textarea';
  }
  function ts(l, t, e, a) {
    (We ? ($e ? $e.push(a) : ($e = [a])) : (We = a),
      (t = Nn(t, 'onChange')),
      0 < t.length &&
        ((e = new Cu('onChange', 'change', null, e, a)), l.push({ event: e, listeners: t })));
  }
  var Ba = null,
    Ya = null;
  function Mm(l) {
    Yo(l, 0);
  }
  function Bu(l) {
    var t = Da(l);
    if (qf(t)) return l;
  }
  function es(l, t) {
    if (l === 'change') return t;
  }
  var as = !1;
  if (Ht) {
    var vi;
    if (Ht) {
      var yi = 'oninput' in document;
      if (!yi) {
        var us = document.createElement('div');
        (us.setAttribute('oninput', 'return;'), (yi = typeof us.oninput == 'function'));
      }
      vi = yi;
    } else vi = !1;
    as = vi && (!document.documentMode || 9 < document.documentMode);
  }
  function ns() {
    Ba && (Ba.detachEvent('onpropertychange', is), (Ya = Ba = null));
  }
  function is(l) {
    if (l.propertyName === 'value' && Bu(Ya)) {
      var t = [];
      (ts(t, Ya, l, ii(l)), Lf(Mm, t));
    }
  }
  function Om(l, t, e) {
    l === 'focusin'
      ? (ns(), (Ba = t), (Ya = e), Ba.attachEvent('onpropertychange', is))
      : l === 'focusout' && ns();
  }
  function Dm(l) {
    if (l === 'selectionchange' || l === 'keyup' || l === 'keydown') return Bu(Ya);
  }
  function Um(l, t) {
    if (l === 'click') return Bu(t);
  }
  function Rm(l, t) {
    if (l === 'input' || l === 'change') return Bu(t);
  }
  function Hm(l, t) {
    return (l === t && (l !== 0 || 1 / l === 1 / t)) || (l !== l && t !== t);
  }
  var at = typeof Object.is == 'function' ? Object.is : Hm;
  function Ga(l, t) {
    if (at(l, t)) return !0;
    if (typeof l != 'object' || l === null || typeof t != 'object' || t === null) return !1;
    var e = Object.keys(l),
      a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var u = e[a];
      if (!wn.call(t, u) || !at(l[u], t[u])) return !1;
    }
    return !0;
  }
  function cs(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function fs(l, t) {
    var e = cs(l);
    l = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (((a = l + e.textContent.length), l <= t && a >= t)) return { node: e, offset: t - l };
        l = a;
      }
      l: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break l;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = cs(e);
    }
  }
  function ss(l, t) {
    return l && t
      ? l === t
        ? !0
        : l && l.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? ss(l, t.parentNode)
            : 'contains' in l
              ? l.contains(t)
              : l.compareDocumentPosition
                ? !!(l.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function ds(l) {
    l =
      l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null
        ? l.ownerDocument.defaultView
        : window;
    for (var t = Ou(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == 'string';
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = Ou(l.document);
    }
    return t;
  }
  function gi(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return (
      t &&
      ((t === 'input' &&
        (l.type === 'text' ||
          l.type === 'search' ||
          l.type === 'tel' ||
          l.type === 'url' ||
          l.type === 'password')) ||
        t === 'textarea' ||
        l.contentEditable === 'true')
    );
  }
  var Cm = Ht && 'documentMode' in document && 11 >= document.documentMode,
    Ie = null,
    xi = null,
    Qa = null,
    bi = !1;
  function os(l, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    bi ||
      Ie == null ||
      Ie !== Ou(a) ||
      ((a = Ie),
      'selectionStart' in a && gi(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = ((a.ownerDocument && a.ownerDocument.defaultView) || window).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Qa && Ga(Qa, a)) ||
        ((Qa = a),
        (a = Nn(xi, 'onSelect')),
        0 < a.length &&
          ((t = new Cu('onSelect', 'select', null, t, e)),
          l.push({ event: t, listeners: a }),
          (t.target = Ie))));
  }
  function Ne(l, t) {
    var e = {};
    return (
      (e[l.toLowerCase()] = t.toLowerCase()),
      (e['Webkit' + l] = 'webkit' + t),
      (e['Moz' + l] = 'moz' + t),
      e
    );
  }
  var Pe = {
      animationend: Ne('Animation', 'AnimationEnd'),
      animationiteration: Ne('Animation', 'AnimationIteration'),
      animationstart: Ne('Animation', 'AnimationStart'),
      transitionrun: Ne('Transition', 'TransitionRun'),
      transitionstart: Ne('Transition', 'TransitionStart'),
      transitioncancel: Ne('Transition', 'TransitionCancel'),
      transitionend: Ne('Transition', 'TransitionEnd'),
    },
    pi = {},
    rs = {};
  Ht &&
    ((rs = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete Pe.animationend.animation,
      delete Pe.animationiteration.animation,
      delete Pe.animationstart.animation),
    'TransitionEvent' in window || delete Pe.transitionend.transition);
  function Ae(l) {
    if (pi[l]) return pi[l];
    if (!Pe[l]) return l;
    var t = Pe[l],
      e;
    for (e in t) if (t.hasOwnProperty(e) && e in rs) return (pi[l] = t[e]);
    return l;
  }
  var ms = Ae('animationend'),
    hs = Ae('animationiteration'),
    vs = Ae('animationstart'),
    qm = Ae('transitionrun'),
    Bm = Ae('transitionstart'),
    Ym = Ae('transitioncancel'),
    ys = Ae('transitionend'),
    gs = new Map(),
    Si =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' '
      );
  Si.push('scrollEnd');
  function jt(l, t) {
    (gs.set(l, t), Te(t, [l]));
  }
  var Yu =
      typeof reportError == 'function'
        ? reportError
        : function (l) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var t = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof l == 'object' && l !== null && typeof l.message == 'string'
                    ? String(l.message)
                    : String(l),
                error: l,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', l);
              return;
            }
            console.error(l);
          },
    mt = [],
    la = 0,
    zi = 0;
  function Gu() {
    for (var l = la, t = (zi = la = 0); t < l; ) {
      var e = mt[t];
      mt[t++] = null;
      var a = mt[t];
      mt[t++] = null;
      var u = mt[t];
      mt[t++] = null;
      var n = mt[t];
      if (((mt[t++] = null), a !== null && u !== null)) {
        var i = a.pending;
        (i === null ? (u.next = u) : ((u.next = i.next), (i.next = u)), (a.pending = u));
      }
      n !== 0 && xs(e, u, n);
    }
  }
  function Qu(l, t, e, a) {
    ((mt[la++] = l),
      (mt[la++] = t),
      (mt[la++] = e),
      (mt[la++] = a),
      (zi |= a),
      (l.lanes |= a),
      (l = l.alternate),
      l !== null && (l.lanes |= a));
  }
  function ji(l, t, e, a) {
    return (Qu(l, t, e, a), Xu(l));
  }
  function _e(l, t) {
    return (Qu(l, null, null, t), Xu(l));
  }
  function xs(l, t, e) {
    l.lanes |= e;
    var a = l.alternate;
    a !== null && (a.lanes |= e);
    for (var u = !1, n = l.return; n !== null; )
      ((n.childLanes |= e),
        (a = n.alternate),
        a !== null && (a.childLanes |= e),
        n.tag === 22 && ((l = n.stateNode), l === null || l._visibility & 1 || (u = !0)),
        (l = n),
        (n = n.return));
    return l.tag === 3
      ? ((n = l.stateNode),
        u &&
          t !== null &&
          ((u = 31 - et(e)),
          (l = n.hiddenUpdates),
          (a = l[u]),
          a === null ? (l[u] = [t]) : a.push(t),
          (t.lane = e | 536870912)),
        n)
      : null;
  }
  function Xu(l) {
    if (50 < fu) throw ((fu = 0), (Uc = null), Error(m(185)));
    for (var t = l.return; t !== null; ) ((l = t), (t = l.return));
    return l.tag === 3 ? l.stateNode : null;
  }
  var ta = {};
  function Gm(l, t, e, a) {
    ((this.tag = l),
      (this.key = e),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function ut(l, t, e, a) {
    return new Gm(l, t, e, a);
  }
  function Ti(l) {
    return ((l = l.prototype), !(!l || !l.isReactComponent));
  }
  function Ct(l, t) {
    var e = l.alternate;
    return (
      e === null
        ? ((e = ut(l.tag, t, l.key, l.mode)),
          (e.elementType = l.elementType),
          (e.type = l.type),
          (e.stateNode = l.stateNode),
          (e.alternate = l),
          (l.alternate = e))
        : ((e.pendingProps = t),
          (e.type = l.type),
          (e.flags = 0),
          (e.subtreeFlags = 0),
          (e.deletions = null)),
      (e.flags = l.flags & 65011712),
      (e.childLanes = l.childLanes),
      (e.lanes = l.lanes),
      (e.child = l.child),
      (e.memoizedProps = l.memoizedProps),
      (e.memoizedState = l.memoizedState),
      (e.updateQueue = l.updateQueue),
      (t = l.dependencies),
      (e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (e.sibling = l.sibling),
      (e.index = l.index),
      (e.ref = l.ref),
      (e.refCleanup = l.refCleanup),
      e
    );
  }
  function bs(l, t) {
    l.flags &= 65011714;
    var e = l.alternate;
    return (
      e === null
        ? ((l.childLanes = 0),
          (l.lanes = t),
          (l.child = null),
          (l.subtreeFlags = 0),
          (l.memoizedProps = null),
          (l.memoizedState = null),
          (l.updateQueue = null),
          (l.dependencies = null),
          (l.stateNode = null))
        : ((l.childLanes = e.childLanes),
          (l.lanes = e.lanes),
          (l.child = e.child),
          (l.subtreeFlags = 0),
          (l.deletions = null),
          (l.memoizedProps = e.memoizedProps),
          (l.memoizedState = e.memoizedState),
          (l.updateQueue = e.updateQueue),
          (l.type = e.type),
          (t = e.dependencies),
          (l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
      l
    );
  }
  function Zu(l, t, e, a, u, n) {
    var i = 0;
    if (((a = l), typeof l == 'function')) Ti(l) && (i = 1);
    else if (typeof l == 'string')
      i = Vh(l, e, O.current) ? 26 : l === 'html' || l === 'head' || l === 'body' ? 27 : 5;
    else
      l: switch (l) {
        case dt:
          return ((l = ut(31, e, t, u)), (l.elementType = dt), (l.lanes = n), l);
        case Rl:
          return Me(e.children, u, n, t);
        case St:
          ((i = 8), (u |= 24));
          break;
        case Xl:
          return ((l = ut(12, e, t, u | 2)), (l.elementType = Xl), (l.lanes = n), l);
        case Kl:
          return ((l = ut(13, e, t, u)), (l.elementType = Kl), (l.lanes = n), l);
        case bl:
          return ((l = ut(19, e, t, u)), (l.elementType = bl), (l.lanes = n), l);
        default:
          if (typeof l == 'object' && l !== null)
            switch (l.$$typeof) {
              case rl:
                i = 10;
                break l;
              case Vl:
                i = 9;
                break l;
              case xl:
                i = 11;
                break l;
              case K:
                i = 14;
                break l;
              case Gl:
                ((i = 16), (a = null));
                break l;
            }
          ((i = 29), (e = Error(m(130, l === null ? 'null' : typeof l, ''))), (a = null));
      }
    return ((t = ut(i, e, t, u)), (t.elementType = l), (t.type = a), (t.lanes = n), t);
  }
  function Me(l, t, e, a) {
    return ((l = ut(7, l, a, t)), (l.lanes = e), l);
  }
  function Ei(l, t, e) {
    return ((l = ut(6, l, null, t)), (l.lanes = e), l);
  }
  function ps(l) {
    var t = ut(18, null, null, 0);
    return ((t.stateNode = l), t);
  }
  function Ni(l, t, e) {
    return (
      (t = ut(4, l.children !== null ? l.children : [], l.key, t)),
      (t.lanes = e),
      (t.stateNode = {
        containerInfo: l.containerInfo,
        pendingChildren: null,
        implementation: l.implementation,
      }),
      t
    );
  }
  var Ss = new WeakMap();
  function ht(l, t) {
    if (typeof l == 'object' && l !== null) {
      var e = Ss.get(l);
      return e !== void 0 ? e : ((t = { value: l, source: t, stack: pf(t) }), Ss.set(l, t), t);
    }
    return { value: l, source: t, stack: pf(t) };
  }
  var ea = [],
    aa = 0,
    Lu = null,
    Xa = 0,
    vt = [],
    yt = 0,
    Pt = null,
    At = 1,
    _t = '';
  function qt(l, t) {
    ((ea[aa++] = Xa), (ea[aa++] = Lu), (Lu = l), (Xa = t));
  }
  function zs(l, t, e) {
    ((vt[yt++] = At), (vt[yt++] = _t), (vt[yt++] = Pt), (Pt = l));
    var a = At;
    l = _t;
    var u = 32 - et(a) - 1;
    ((a &= ~(1 << u)), (e += 1));
    var n = 32 - et(t) + u;
    if (30 < n) {
      var i = u - (u % 5);
      ((n = (a & ((1 << i) - 1)).toString(32)),
        (a >>= i),
        (u -= i),
        (At = (1 << (32 - et(t) + u)) | (e << u) | a),
        (_t = n + l));
    } else ((At = (1 << n) | (e << u) | a), (_t = l));
  }
  function Ai(l) {
    l.return !== null && (qt(l, 1), zs(l, 1, 0));
  }
  function _i(l) {
    for (; l === Lu; ) ((Lu = ea[--aa]), (ea[aa] = null), (Xa = ea[--aa]), (ea[aa] = null));
    for (; l === Pt; )
      ((Pt = vt[--yt]),
        (vt[yt] = null),
        (_t = vt[--yt]),
        (vt[yt] = null),
        (At = vt[--yt]),
        (vt[yt] = null));
  }
  function js(l, t) {
    ((vt[yt++] = At), (vt[yt++] = _t), (vt[yt++] = Pt), (At = t.id), (_t = t.overflow), (Pt = l));
  }
  var Cl = null,
    ml = null,
    I = !1,
    le = null,
    gt = !1,
    Mi = Error(m(519));
  function te(l) {
    var t = Error(
      m(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', '')
    );
    throw (Za(ht(t, l)), Mi);
  }
  function Ts(l) {
    var t = l.stateNode,
      e = l.type,
      a = l.memoizedProps;
    switch (((t[Hl] = l), (t[wl] = a), e)) {
      case 'dialog':
        (k('cancel', t), k('close', t));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        k('load', t);
        break;
      case 'video':
      case 'audio':
        for (e = 0; e < du.length; e++) k(du[e], t);
        break;
      case 'source':
        k('error', t);
        break;
      case 'img':
      case 'image':
      case 'link':
        (k('error', t), k('load', t));
        break;
      case 'details':
        k('toggle', t);
        break;
      case 'input':
        (k('invalid', t),
          Bf(t, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0));
        break;
      case 'select':
        k('invalid', t);
        break;
      case 'textarea':
        (k('invalid', t), Gf(t, a.value, a.defaultValue, a.children));
    }
    ((e = a.children),
      (typeof e != 'string' && typeof e != 'number' && typeof e != 'bigint') ||
      t.textContent === '' + e ||
      a.suppressHydrationWarning === !0 ||
      Zo(t.textContent, e)
        ? (a.popover != null && (k('beforetoggle', t), k('toggle', t)),
          a.onScroll != null && k('scroll', t),
          a.onScrollEnd != null && k('scrollend', t),
          a.onClick != null && (t.onclick = Rt),
          (t = !0))
        : (t = !1),
      t || te(l, !0));
  }
  function Es(l) {
    for (Cl = l.return; Cl; )
      switch (Cl.tag) {
        case 5:
        case 31:
        case 13:
          gt = !1;
          return;
        case 27:
        case 3:
          gt = !0;
          return;
        default:
          Cl = Cl.return;
      }
  }
  function ua(l) {
    if (l !== Cl) return !1;
    if (!I) return (Es(l), (I = !0), !1);
    var t = l.tag,
      e;
    if (
      ((e = t !== 3 && t !== 27) &&
        ((e = t === 5) &&
          ((e = l.type), (e = !(e !== 'form' && e !== 'button') || wc(l.type, l.memoizedProps))),
        (e = !e)),
      e && ml && te(l),
      Es(l),
      t === 13)
    ) {
      if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l)) throw Error(m(317));
      ml = Fo(l);
    } else if (t === 31) {
      if (((l = l.memoizedState), (l = l !== null ? l.dehydrated : null), !l)) throw Error(m(317));
      ml = Fo(l);
    } else
      t === 27
        ? ((t = ml), ve(l.type) ? ((l = Ic), (Ic = null), (ml = l)) : (ml = t))
        : (ml = Cl ? bt(l.stateNode.nextSibling) : null);
    return !0;
  }
  function Oe() {
    ((ml = Cl = null), (I = !1));
  }
  function Oi() {
    var l = le;
    return (l !== null && (Il === null ? (Il = l) : Il.push.apply(Il, l), (le = null)), l);
  }
  function Za(l) {
    le === null ? (le = [l]) : le.push(l);
  }
  var Di = o(null),
    De = null,
    Bt = null;
  function ee(l, t, e) {
    (A(Di, t._currentValue), (t._currentValue = e));
  }
  function Yt(l) {
    ((l._currentValue = Di.current), j(Di));
  }
  function Ui(l, t, e) {
    for (; l !== null; ) {
      var a = l.alternate;
      if (
        ((l.childLanes & t) !== t
          ? ((l.childLanes |= t), a !== null && (a.childLanes |= t))
          : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t),
        l === e)
      )
        break;
      l = l.return;
    }
  }
  function Ri(l, t, e, a) {
    var u = l.child;
    for (u !== null && (u.return = l); u !== null; ) {
      var n = u.dependencies;
      if (n !== null) {
        var i = u.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = u;
          for (var s = 0; s < t.length; s++)
            if (c.context === t[s]) {
              ((n.lanes |= e),
                (c = n.alternate),
                c !== null && (c.lanes |= e),
                Ui(n.return, e, l),
                a || (i = null));
              break l;
            }
          n = c.next;
        }
      } else if (u.tag === 18) {
        if (((i = u.return), i === null)) throw Error(m(341));
        ((i.lanes |= e), (n = i.alternate), n !== null && (n.lanes |= e), Ui(i, e, l), (i = null));
      } else i = u.child;
      if (i !== null) i.return = u;
      else
        for (i = u; i !== null; ) {
          if (i === l) {
            i = null;
            break;
          }
          if (((u = i.sibling), u !== null)) {
            ((u.return = i.return), (i = u));
            break;
          }
          i = i.return;
        }
      u = i;
    }
  }
  function na(l, t, e, a) {
    l = null;
    for (var u = t, n = !1; u !== null; ) {
      if (!n) {
        if ((u.flags & 524288) !== 0) n = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var i = u.alternate;
        if (i === null) throw Error(m(387));
        if (((i = i.memoizedProps), i !== null)) {
          var c = u.type;
          at(u.pendingProps.value, i.value) || (l !== null ? l.push(c) : (l = [c]));
        }
      } else if (u === el.current) {
        if (((i = u.alternate), i === null)) throw Error(m(387));
        i.memoizedState.memoizedState !== u.memoizedState.memoizedState &&
          (l !== null ? l.push(vu) : (l = [vu]));
      }
      u = u.return;
    }
    (l !== null && Ri(t, l, e, a), (t.flags |= 262144));
  }
  function Vu(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!at(l.context._currentValue, l.memoizedValue)) return !0;
      l = l.next;
    }
    return !1;
  }
  function Ue(l) {
    ((De = l), (Bt = null), (l = l.dependencies), l !== null && (l.firstContext = null));
  }
  function ql(l) {
    return Ns(De, l);
  }
  function Ku(l, t) {
    return (De === null && Ue(l), Ns(l, t));
  }
  function Ns(l, t) {
    var e = t._currentValue;
    if (((t = { context: t, memoizedValue: e, next: null }), Bt === null)) {
      if (l === null) throw Error(m(308));
      ((Bt = t), (l.dependencies = { lanes: 0, firstContext: t }), (l.flags |= 524288));
    } else Bt = Bt.next = t;
    return e;
  }
  var Qm =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var l = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (e, a) {
                  l.push(a);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                l.forEach(function (e) {
                  return e();
                }));
            };
          },
    Xm = T.unstable_scheduleCallback,
    Zm = T.unstable_NormalPriority,
    El = {
      $$typeof: rl,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Hi() {
    return { controller: new Qm(), data: new Map(), refCount: 0 };
  }
  function La(l) {
    (l.refCount--,
      l.refCount === 0 &&
        Xm(Zm, function () {
          l.controller.abort();
        }));
  }
  var Va = null,
    Ci = 0,
    ia = 0,
    ca = null;
  function Lm(l, t) {
    if (Va === null) {
      var e = (Va = []);
      ((Ci = 0),
        (ia = Yc()),
        (ca = {
          status: 'pending',
          value: void 0,
          then: function (a) {
            e.push(a);
          },
        }));
    }
    return (Ci++, t.then(As, As), t);
  }
  function As() {
    if (--Ci === 0 && Va !== null) {
      ca !== null && (ca.status = 'fulfilled');
      var l = Va;
      ((Va = null), (ia = 0), (ca = null));
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Vm(l, t) {
    var e = [],
      a = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (u) {
          e.push(u);
        },
      };
    return (
      l.then(
        function () {
          ((a.status = 'fulfilled'), (a.value = t));
          for (var u = 0; u < e.length; u++) (0, e[u])(t);
        },
        function (u) {
          for (a.status = 'rejected', a.reason = u, u = 0; u < e.length; u++) (0, e[u])(void 0);
        }
      ),
      a
    );
  }
  var _s = b.S;
  b.S = function (l, t) {
    ((ro = lt()),
      typeof t == 'object' && t !== null && typeof t.then == 'function' && Lm(l, t),
      _s !== null && _s(l, t));
  };
  var Re = o(null);
  function qi() {
    var l = Re.current;
    return l !== null ? l : ol.pooledCache;
  }
  function Ju(l, t) {
    t === null ? A(Re, Re.current) : A(Re, t.pool);
  }
  function Ms() {
    var l = qi();
    return l === null ? null : { parent: El._currentValue, pool: l };
  }
  var fa = Error(m(460)),
    Bi = Error(m(474)),
    wu = Error(m(542)),
    ku = { then: function () {} };
  function Os(l) {
    return ((l = l.status), l === 'fulfilled' || l === 'rejected');
  }
  function Ds(l, t, e) {
    switch (
      ((e = l[e]), e === void 0 ? l.push(t) : e !== t && (t.then(Rt, Rt), (t = e)), t.status)
    ) {
      case 'fulfilled':
        return t.value;
      case 'rejected':
        throw ((l = t.reason), Rs(l), l);
      default:
        if (typeof t.status == 'string') t.then(Rt, Rt);
        else {
          if (((l = ol), l !== null && 100 < l.shellSuspendCounter)) throw Error(m(482));
          ((l = t),
            (l.status = 'pending'),
            l.then(
              function (a) {
                if (t.status === 'pending') {
                  var u = t;
                  ((u.status = 'fulfilled'), (u.value = a));
                }
              },
              function (a) {
                if (t.status === 'pending') {
                  var u = t;
                  ((u.status = 'rejected'), (u.reason = a));
                }
              }
            ));
        }
        switch (t.status) {
          case 'fulfilled':
            return t.value;
          case 'rejected':
            throw ((l = t.reason), Rs(l), l);
        }
        throw ((Ce = t), fa);
    }
  }
  function He(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == 'object' && typeof e.then == 'function' ? ((Ce = e), fa) : e;
    }
  }
  var Ce = null;
  function Us() {
    if (Ce === null) throw Error(m(459));
    var l = Ce;
    return ((Ce = null), l);
  }
  function Rs(l) {
    if (l === fa || l === wu) throw Error(m(483));
  }
  var sa = null,
    Ka = 0;
  function Wu(l) {
    var t = Ka;
    return ((Ka += 1), sa === null && (sa = []), Ds(sa, l, t));
  }
  function Ja(l, t) {
    ((t = t.props.ref), (l.ref = t !== void 0 ? t : null));
  }
  function $u(l, t) {
    throw t.$$typeof === nl
      ? Error(m(525))
      : ((l = Object.prototype.toString.call(t)),
        Error(
          m(
            31,
            l === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : l
          )
        ));
  }
  function Hs(l) {
    function t(r, d) {
      if (l) {
        var h = r.deletions;
        h === null ? ((r.deletions = [d]), (r.flags |= 16)) : h.push(d);
      }
    }
    function e(r, d) {
      if (!l) return null;
      for (; d !== null; ) (t(r, d), (d = d.sibling));
      return null;
    }
    function a(r) {
      for (var d = new Map(); r !== null; )
        (r.key !== null ? d.set(r.key, r) : d.set(r.index, r), (r = r.sibling));
      return d;
    }
    function u(r, d) {
      return ((r = Ct(r, d)), (r.index = 0), (r.sibling = null), r);
    }
    function n(r, d, h) {
      return (
        (r.index = h),
        l
          ? ((h = r.alternate),
            h !== null
              ? ((h = h.index), h < d ? ((r.flags |= 67108866), d) : h)
              : ((r.flags |= 67108866), d))
          : ((r.flags |= 1048576), d)
      );
    }
    function i(r) {
      return (l && r.alternate === null && (r.flags |= 67108866), r);
    }
    function c(r, d, h, p) {
      return d === null || d.tag !== 6
        ? ((d = Ei(h, r.mode, p)), (d.return = r), d)
        : ((d = u(d, h)), (d.return = r), d);
    }
    function s(r, d, h, p) {
      var R = h.type;
      return R === Rl
        ? x(r, d, h.props.children, p, h.key)
        : d !== null &&
            (d.elementType === R ||
              (typeof R == 'object' && R !== null && R.$$typeof === Gl && He(R) === d.type))
          ? ((d = u(d, h.props)), Ja(d, h), (d.return = r), d)
          : ((d = Zu(h.type, h.key, h.props, null, r.mode, p)), Ja(d, h), (d.return = r), d);
    }
    function v(r, d, h, p) {
      return d === null ||
        d.tag !== 4 ||
        d.stateNode.containerInfo !== h.containerInfo ||
        d.stateNode.implementation !== h.implementation
        ? ((d = Ni(h, r.mode, p)), (d.return = r), d)
        : ((d = u(d, h.children || [])), (d.return = r), d);
    }
    function x(r, d, h, p, R) {
      return d === null || d.tag !== 7
        ? ((d = Me(h, r.mode, p, R)), (d.return = r), d)
        : ((d = u(d, h)), (d.return = r), d);
    }
    function S(r, d, h) {
      if ((typeof d == 'string' && d !== '') || typeof d == 'number' || typeof d == 'bigint')
        return ((d = Ei('' + d, r.mode, h)), (d.return = r), d);
      if (typeof d == 'object' && d !== null) {
        switch (d.$$typeof) {
          case jl:
            return ((h = Zu(d.type, d.key, d.props, null, r.mode, h)), Ja(h, d), (h.return = r), h);
          case Tl:
            return ((d = Ni(d, r.mode, h)), (d.return = r), d);
          case Gl:
            return ((d = He(d)), S(r, d, h));
        }
        if (zt(d) || Jl(d)) return ((d = Me(d, r.mode, h, null)), (d.return = r), d);
        if (typeof d.then == 'function') return S(r, Wu(d), h);
        if (d.$$typeof === rl) return S(r, Ku(r, d), h);
        $u(r, d);
      }
      return null;
    }
    function y(r, d, h, p) {
      var R = d !== null ? d.key : null;
      if ((typeof h == 'string' && h !== '') || typeof h == 'number' || typeof h == 'bigint')
        return R !== null ? null : c(r, d, '' + h, p);
      if (typeof h == 'object' && h !== null) {
        switch (h.$$typeof) {
          case jl:
            return h.key === R ? s(r, d, h, p) : null;
          case Tl:
            return h.key === R ? v(r, d, h, p) : null;
          case Gl:
            return ((h = He(h)), y(r, d, h, p));
        }
        if (zt(h) || Jl(h)) return R !== null ? null : x(r, d, h, p, null);
        if (typeof h.then == 'function') return y(r, d, Wu(h), p);
        if (h.$$typeof === rl) return y(r, d, Ku(r, h), p);
        $u(r, h);
      }
      return null;
    }
    function g(r, d, h, p, R) {
      if ((typeof p == 'string' && p !== '') || typeof p == 'number' || typeof p == 'bigint')
        return ((r = r.get(h) || null), c(d, r, '' + p, R));
      if (typeof p == 'object' && p !== null) {
        switch (p.$$typeof) {
          case jl:
            return ((r = r.get(p.key === null ? h : p.key) || null), s(d, r, p, R));
          case Tl:
            return ((r = r.get(p.key === null ? h : p.key) || null), v(d, r, p, R));
          case Gl:
            return ((p = He(p)), g(r, d, h, p, R));
        }
        if (zt(p) || Jl(p)) return ((r = r.get(h) || null), x(d, r, p, R, null));
        if (typeof p.then == 'function') return g(r, d, h, Wu(p), R);
        if (p.$$typeof === rl) return g(r, d, h, Ku(d, p), R);
        $u(d, p);
      }
      return null;
    }
    function M(r, d, h, p) {
      for (var R = null, P = null, D = d, L = (d = 0), $ = null; D !== null && L < h.length; L++) {
        D.index > L ? (($ = D), (D = null)) : ($ = D.sibling);
        var ll = y(r, D, h[L], p);
        if (ll === null) {
          D === null && (D = $);
          break;
        }
        (l && D && ll.alternate === null && t(r, D),
          (d = n(ll, d, L)),
          P === null ? (R = ll) : (P.sibling = ll),
          (P = ll),
          (D = $));
      }
      if (L === h.length) return (e(r, D), I && qt(r, L), R);
      if (D === null) {
        for (; L < h.length; L++)
          ((D = S(r, h[L], p)),
            D !== null && ((d = n(D, d, L)), P === null ? (R = D) : (P.sibling = D), (P = D)));
        return (I && qt(r, L), R);
      }
      for (D = a(D); L < h.length; L++)
        (($ = g(D, r, L, h[L], p)),
          $ !== null &&
            (l && $.alternate !== null && D.delete($.key === null ? L : $.key),
            (d = n($, d, L)),
            P === null ? (R = $) : (P.sibling = $),
            (P = $)));
      return (
        l &&
          D.forEach(function (pe) {
            return t(r, pe);
          }),
        I && qt(r, L),
        R
      );
    }
    function H(r, d, h, p) {
      if (h == null) throw Error(m(151));
      for (
        var R = null, P = null, D = d, L = (d = 0), $ = null, ll = h.next();
        D !== null && !ll.done;
        L++, ll = h.next()
      ) {
        D.index > L ? (($ = D), (D = null)) : ($ = D.sibling);
        var pe = y(r, D, ll.value, p);
        if (pe === null) {
          D === null && (D = $);
          break;
        }
        (l && D && pe.alternate === null && t(r, D),
          (d = n(pe, d, L)),
          P === null ? (R = pe) : (P.sibling = pe),
          (P = pe),
          (D = $));
      }
      if (ll.done) return (e(r, D), I && qt(r, L), R);
      if (D === null) {
        for (; !ll.done; L++, ll = h.next())
          ((ll = S(r, ll.value, p)),
            ll !== null && ((d = n(ll, d, L)), P === null ? (R = ll) : (P.sibling = ll), (P = ll)));
        return (I && qt(r, L), R);
      }
      for (D = a(D); !ll.done; L++, ll = h.next())
        ((ll = g(D, r, L, ll.value, p)),
          ll !== null &&
            (l && ll.alternate !== null && D.delete(ll.key === null ? L : ll.key),
            (d = n(ll, d, L)),
            P === null ? (R = ll) : (P.sibling = ll),
            (P = ll)));
      return (
        l &&
          D.forEach(function (t0) {
            return t(r, t0);
          }),
        I && qt(r, L),
        R
      );
    }
    function sl(r, d, h, p) {
      if (
        (typeof h == 'object' &&
          h !== null &&
          h.type === Rl &&
          h.key === null &&
          (h = h.props.children),
        typeof h == 'object' && h !== null)
      ) {
        switch (h.$$typeof) {
          case jl:
            l: {
              for (var R = h.key; d !== null; ) {
                if (d.key === R) {
                  if (((R = h.type), R === Rl)) {
                    if (d.tag === 7) {
                      (e(r, d.sibling), (p = u(d, h.props.children)), (p.return = r), (r = p));
                      break l;
                    }
                  } else if (
                    d.elementType === R ||
                    (typeof R == 'object' && R !== null && R.$$typeof === Gl && He(R) === d.type)
                  ) {
                    (e(r, d.sibling), (p = u(d, h.props)), Ja(p, h), (p.return = r), (r = p));
                    break l;
                  }
                  e(r, d);
                  break;
                } else t(r, d);
                d = d.sibling;
              }
              h.type === Rl
                ? ((p = Me(h.props.children, r.mode, p, h.key)), (p.return = r), (r = p))
                : ((p = Zu(h.type, h.key, h.props, null, r.mode, p)),
                  Ja(p, h),
                  (p.return = r),
                  (r = p));
            }
            return i(r);
          case Tl:
            l: {
              for (R = h.key; d !== null; ) {
                if (d.key === R)
                  if (
                    d.tag === 4 &&
                    d.stateNode.containerInfo === h.containerInfo &&
                    d.stateNode.implementation === h.implementation
                  ) {
                    (e(r, d.sibling), (p = u(d, h.children || [])), (p.return = r), (r = p));
                    break l;
                  } else {
                    e(r, d);
                    break;
                  }
                else t(r, d);
                d = d.sibling;
              }
              ((p = Ni(h, r.mode, p)), (p.return = r), (r = p));
            }
            return i(r);
          case Gl:
            return ((h = He(h)), sl(r, d, h, p));
        }
        if (zt(h)) return M(r, d, h, p);
        if (Jl(h)) {
          if (((R = Jl(h)), typeof R != 'function')) throw Error(m(150));
          return ((h = R.call(h)), H(r, d, h, p));
        }
        if (typeof h.then == 'function') return sl(r, d, Wu(h), p);
        if (h.$$typeof === rl) return sl(r, d, Ku(r, h), p);
        $u(r, h);
      }
      return (typeof h == 'string' && h !== '') || typeof h == 'number' || typeof h == 'bigint'
        ? ((h = '' + h),
          d !== null && d.tag === 6
            ? (e(r, d.sibling), (p = u(d, h)), (p.return = r), (r = p))
            : (e(r, d), (p = Ei(h, r.mode, p)), (p.return = r), (r = p)),
          i(r))
        : e(r, d);
    }
    return function (r, d, h, p) {
      try {
        Ka = 0;
        var R = sl(r, d, h, p);
        return ((sa = null), R);
      } catch (D) {
        if (D === fa || D === wu) throw D;
        var P = ut(29, D, null, r.mode);
        return ((P.lanes = p), (P.return = r), P);
      } finally {
      }
    };
  }
  var qe = Hs(!0),
    Cs = Hs(!1),
    ae = !1;
  function Yi(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Gi(l, t) {
    ((l = l.updateQueue),
      t.updateQueue === l &&
        (t.updateQueue = {
          baseState: l.baseState,
          firstBaseUpdate: l.firstBaseUpdate,
          lastBaseUpdate: l.lastBaseUpdate,
          shared: l.shared,
          callbacks: null,
        }));
  }
  function ue(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function ne(l, t, e) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (tl & 2) !== 0)) {
      var u = a.pending;
      return (
        u === null ? (t.next = t) : ((t.next = u.next), (u.next = t)),
        (a.pending = t),
        (t = Xu(l)),
        xs(l, null, e),
        t
      );
    }
    return (Qu(l, a, t, e), Xu(l));
  }
  function wa(l, t, e) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (e & 4194048) !== 0))) {
      var a = t.lanes;
      ((a &= l.pendingLanes), (e |= a), (t.lanes = e), Nf(l, e));
    }
  }
  function Qi(l, t) {
    var e = l.updateQueue,
      a = l.alternate;
    if (a !== null && ((a = a.updateQueue), e === a)) {
      var u = null,
        n = null;
      if (((e = e.firstBaseUpdate), e !== null)) {
        do {
          var i = { lane: e.lane, tag: e.tag, payload: e.payload, callback: null, next: null };
          (n === null ? (u = n = i) : (n = n.next = i), (e = e.next));
        } while (e !== null);
        n === null ? (u = n = t) : (n = n.next = t);
      } else u = n = t;
      ((e = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: n,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (l.updateQueue = e));
      return;
    }
    ((l = e.lastBaseUpdate),
      l === null ? (e.firstBaseUpdate = t) : (l.next = t),
      (e.lastBaseUpdate = t));
  }
  var Xi = !1;
  function ka() {
    if (Xi) {
      var l = ca;
      if (l !== null) throw l;
    }
  }
  function Wa(l, t, e, a) {
    Xi = !1;
    var u = l.updateQueue;
    ae = !1;
    var n = u.firstBaseUpdate,
      i = u.lastBaseUpdate,
      c = u.shared.pending;
    if (c !== null) {
      u.shared.pending = null;
      var s = c,
        v = s.next;
      ((s.next = null), i === null ? (n = v) : (i.next = v), (i = s));
      var x = l.alternate;
      x !== null &&
        ((x = x.updateQueue),
        (c = x.lastBaseUpdate),
        c !== i && (c === null ? (x.firstBaseUpdate = v) : (c.next = v), (x.lastBaseUpdate = s)));
    }
    if (n !== null) {
      var S = u.baseState;
      ((i = 0), (x = v = s = null), (c = n));
      do {
        var y = c.lane & -536870913,
          g = y !== c.lane;
        if (g ? (W & y) === y : (a & y) === y) {
          (y !== 0 && y === ia && (Xi = !0),
            x !== null &&
              (x = x.next =
                { lane: 0, tag: c.tag, payload: c.payload, callback: null, next: null }));
          l: {
            var M = l,
              H = c;
            y = t;
            var sl = e;
            switch (H.tag) {
              case 1:
                if (((M = H.payload), typeof M == 'function')) {
                  S = M.call(sl, S, y);
                  break l;
                }
                S = M;
                break l;
              case 3:
                M.flags = (M.flags & -65537) | 128;
              case 0:
                if (
                  ((M = H.payload), (y = typeof M == 'function' ? M.call(sl, S, y) : M), y == null)
                )
                  break l;
                S = U({}, S, y);
                break l;
              case 2:
                ae = !0;
            }
          }
          ((y = c.callback),
            y !== null &&
              ((l.flags |= 64),
              g && (l.flags |= 8192),
              (g = u.callbacks),
              g === null ? (u.callbacks = [y]) : g.push(y)));
        } else
          ((g = { lane: y, tag: c.tag, payload: c.payload, callback: c.callback, next: null }),
            x === null ? ((v = x = g), (s = S)) : (x = x.next = g),
            (i |= y));
        if (((c = c.next), c === null)) {
          if (((c = u.shared.pending), c === null)) break;
          ((g = c),
            (c = g.next),
            (g.next = null),
            (u.lastBaseUpdate = g),
            (u.shared.pending = null));
        }
      } while (!0);
      (x === null && (s = S),
        (u.baseState = s),
        (u.firstBaseUpdate = v),
        (u.lastBaseUpdate = x),
        n === null && (u.shared.lanes = 0),
        (de |= i),
        (l.lanes = i),
        (l.memoizedState = S));
    }
  }
  function qs(l, t) {
    if (typeof l != 'function') throw Error(m(191, l));
    l.call(t);
  }
  function Bs(l, t) {
    var e = l.callbacks;
    if (e !== null) for (l.callbacks = null, l = 0; l < e.length; l++) qs(e[l], t);
  }
  var da = o(null),
    Fu = o(0);
  function Ys(l, t) {
    ((l = wt), A(Fu, l), A(da, t), (wt = l | t.baseLanes));
  }
  function Zi() {
    (A(Fu, wt), A(da, da.current));
  }
  function Li() {
    ((wt = Fu.current), j(da), j(Fu));
  }
  var nt = o(null),
    xt = null;
  function ie(l) {
    var t = l.alternate;
    (A(Sl, Sl.current & 1),
      A(nt, l),
      xt === null && (t === null || da.current !== null || t.memoizedState !== null) && (xt = l));
  }
  function Vi(l) {
    (A(Sl, Sl.current), A(nt, l), xt === null && (xt = l));
  }
  function Gs(l) {
    l.tag === 22 ? (A(Sl, Sl.current), A(nt, l), xt === null && (xt = l)) : ce();
  }
  function ce() {
    (A(Sl, Sl.current), A(nt, nt.current));
  }
  function it(l) {
    (j(nt), xt === l && (xt = null), j(Sl));
  }
  var Sl = o(0);
  function Iu(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && ((e = e.dehydrated), e === null || $c(e) || Fc(e))) return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === 'forwards' ||
          t.memoizedProps.revealOrder === 'backwards' ||
          t.memoizedProps.revealOrder === 'unstable_legacy-backwards' ||
          t.memoizedProps.revealOrder === 'together')
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Gt = 0,
    Z = null,
    cl = null,
    Nl = null,
    Pu = !1,
    oa = !1,
    Be = !1,
    ln = 0,
    $a = 0,
    ra = null,
    Km = 0;
  function yl() {
    throw Error(m(321));
  }
  function Ki(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++) if (!at(l[e], t[e])) return !1;
    return !0;
  }
  function Ji(l, t, e, a, u, n) {
    return (
      (Gt = n),
      (Z = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (b.H = l === null || l.memoizedState === null ? zd : cc),
      (Be = !1),
      (n = e(a, u)),
      (Be = !1),
      oa && (n = Xs(t, e, a, u)),
      Qs(l),
      n
    );
  }
  function Qs(l) {
    b.H = Pa;
    var t = cl !== null && cl.next !== null;
    if (((Gt = 0), (Nl = cl = Z = null), (Pu = !1), ($a = 0), (ra = null), t)) throw Error(m(300));
    l === null || Al || ((l = l.dependencies), l !== null && Vu(l) && (Al = !0));
  }
  function Xs(l, t, e, a) {
    Z = l;
    var u = 0;
    do {
      if ((oa && (ra = null), ($a = 0), (oa = !1), 25 <= u)) throw Error(m(301));
      if (((u += 1), (Nl = cl = null), l.updateQueue != null)) {
        var n = l.updateQueue;
        ((n.lastEffect = null),
          (n.events = null),
          (n.stores = null),
          n.memoCache != null && (n.memoCache.index = 0));
      }
      ((b.H = jd), (n = t(e, a)));
    } while (oa);
    return n;
  }
  function Jm() {
    var l = b.H,
      t = l.useState()[0];
    return (
      (t = typeof t.then == 'function' ? Fa(t) : t),
      (l = l.useState()[0]),
      (cl !== null ? cl.memoizedState : null) !== l && (Z.flags |= 1024),
      t
    );
  }
  function wi() {
    var l = ln !== 0;
    return ((ln = 0), l);
  }
  function ki(l, t, e) {
    ((t.updateQueue = l.updateQueue), (t.flags &= -2053), (l.lanes &= ~e));
  }
  function Wi(l) {
    if (Pu) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        (t !== null && (t.pending = null), (l = l.next));
      }
      Pu = !1;
    }
    ((Gt = 0), (Nl = cl = Z = null), (oa = !1), ($a = ln = 0), (ra = null));
  }
  function Ll() {
    var l = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (Nl === null ? (Z.memoizedState = Nl = l) : (Nl = Nl.next = l), Nl);
  }
  function zl() {
    if (cl === null) {
      var l = Z.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = cl.next;
    var t = Nl === null ? Z.memoizedState : Nl.next;
    if (t !== null) ((Nl = t), (cl = l));
    else {
      if (l === null) throw Z.alternate === null ? Error(m(467)) : Error(m(310));
      ((cl = l),
        (l = {
          memoizedState: cl.memoizedState,
          baseState: cl.baseState,
          baseQueue: cl.baseQueue,
          queue: cl.queue,
          next: null,
        }),
        Nl === null ? (Z.memoizedState = Nl = l) : (Nl = Nl.next = l));
    }
    return Nl;
  }
  function tn() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fa(l) {
    var t = $a;
    return (
      ($a += 1),
      ra === null && (ra = []),
      (l = Ds(ra, l, t)),
      (t = Z),
      (Nl === null ? t.memoizedState : Nl.next) === null &&
        ((t = t.alternate), (b.H = t === null || t.memoizedState === null ? zd : cc)),
      l
    );
  }
  function en(l) {
    if (l !== null && typeof l == 'object') {
      if (typeof l.then == 'function') return Fa(l);
      if (l.$$typeof === rl) return ql(l);
    }
    throw Error(m(438, String(l)));
  }
  function $i(l) {
    var t = null,
      e = Z.updateQueue;
    if ((e !== null && (t = e.memoCache), t == null)) {
      var a = Z.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (t = {
              data: a.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      e === null && ((e = tn()), (Z.updateQueue = e)),
      (e.memoCache = t),
      (e = t.data[t.index]),
      e === void 0)
    )
      for (e = t.data[t.index] = Array(l), a = 0; a < l; a++) e[a] = Xe;
    return (t.index++, e);
  }
  function Qt(l, t) {
    return typeof t == 'function' ? t(l) : t;
  }
  function an(l) {
    var t = zl();
    return Fi(t, cl, l);
  }
  function Fi(l, t, e) {
    var a = l.queue;
    if (a === null) throw Error(m(311));
    a.lastRenderedReducer = e;
    var u = l.baseQueue,
      n = a.pending;
    if (n !== null) {
      if (u !== null) {
        var i = u.next;
        ((u.next = n.next), (n.next = i));
      }
      ((t.baseQueue = u = n), (a.pending = null));
    }
    if (((n = l.baseState), u === null)) l.memoizedState = n;
    else {
      t = u.next;
      var c = (i = null),
        s = null,
        v = t,
        x = !1;
      do {
        var S = v.lane & -536870913;
        if (S !== v.lane ? (W & S) === S : (Gt & S) === S) {
          var y = v.revertLane;
          if (y === 0)
            (s !== null &&
              (s = s.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: v.action,
                  hasEagerState: v.hasEagerState,
                  eagerState: v.eagerState,
                  next: null,
                }),
              S === ia && (x = !0));
          else if ((Gt & y) === y) {
            ((v = v.next), y === ia && (x = !0));
            continue;
          } else
            ((S = {
              lane: 0,
              revertLane: v.revertLane,
              gesture: null,
              action: v.action,
              hasEagerState: v.hasEagerState,
              eagerState: v.eagerState,
              next: null,
            }),
              s === null ? ((c = s = S), (i = n)) : (s = s.next = S),
              (Z.lanes |= y),
              (de |= y));
          ((S = v.action), Be && e(n, S), (n = v.hasEagerState ? v.eagerState : e(n, S)));
        } else
          ((y = {
            lane: S,
            revertLane: v.revertLane,
            gesture: v.gesture,
            action: v.action,
            hasEagerState: v.hasEagerState,
            eagerState: v.eagerState,
            next: null,
          }),
            s === null ? ((c = s = y), (i = n)) : (s = s.next = y),
            (Z.lanes |= S),
            (de |= S));
        v = v.next;
      } while (v !== null && v !== t);
      if (
        (s === null ? (i = n) : (s.next = c),
        !at(n, l.memoizedState) && ((Al = !0), x && ((e = ca), e !== null)))
      )
        throw e;
      ((l.memoizedState = n), (l.baseState = i), (l.baseQueue = s), (a.lastRenderedState = n));
    }
    return (u === null && (a.lanes = 0), [l.memoizedState, a.dispatch]);
  }
  function Ii(l) {
    var t = zl(),
      e = t.queue;
    if (e === null) throw Error(m(311));
    e.lastRenderedReducer = l;
    var a = e.dispatch,
      u = e.pending,
      n = t.memoizedState;
    if (u !== null) {
      e.pending = null;
      var i = (u = u.next);
      do ((n = l(n, i.action)), (i = i.next));
      while (i !== u);
      (at(n, t.memoizedState) || (Al = !0),
        (t.memoizedState = n),
        t.baseQueue === null && (t.baseState = n),
        (e.lastRenderedState = n));
    }
    return [n, a];
  }
  function Zs(l, t, e) {
    var a = Z,
      u = zl(),
      n = I;
    if (n) {
      if (e === void 0) throw Error(m(407));
      e = e();
    } else e = t();
    var i = !at((cl || u).memoizedState, e);
    if (
      (i && ((u.memoizedState = e), (Al = !0)),
      (u = u.queue),
      tc(Ks.bind(null, a, u, l), [l]),
      u.getSnapshot !== t || i || (Nl !== null && Nl.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        ma(9, { destroy: void 0 }, Vs.bind(null, a, u, e, t), null),
        ol === null)
      )
        throw Error(m(349));
      n || (Gt & 127) !== 0 || Ls(a, t, e);
    }
    return e;
  }
  function Ls(l, t, e) {
    ((l.flags |= 16384),
      (l = { getSnapshot: t, value: e }),
      (t = Z.updateQueue),
      t === null
        ? ((t = tn()), (Z.updateQueue = t), (t.stores = [l]))
        : ((e = t.stores), e === null ? (t.stores = [l]) : e.push(l)));
  }
  function Vs(l, t, e, a) {
    ((t.value = e), (t.getSnapshot = a), Js(t) && ws(l));
  }
  function Ks(l, t, e) {
    return e(function () {
      Js(t) && ws(l);
    });
  }
  function Js(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !at(l, e);
    } catch {
      return !0;
    }
  }
  function ws(l) {
    var t = _e(l, 2);
    t !== null && Pl(t, l, 2);
  }
  function Pi(l) {
    var t = Ll();
    if (typeof l == 'function') {
      var e = l;
      if (((l = e()), Be)) {
        $t(!0);
        try {
          e();
        } finally {
          $t(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = l),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Qt,
        lastRenderedState: l,
      }),
      t
    );
  }
  function ks(l, t, e, a) {
    return ((l.baseState = e), Fi(l, cl, typeof a == 'function' ? a : Qt));
  }
  function wm(l, t, e, a, u) {
    if (cn(l)) throw Error(m(485));
    if (((l = t.action), l !== null)) {
      var n = {
        payload: u,
        action: l,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (i) {
          n.listeners.push(i);
        },
      };
      (b.T !== null ? e(!0) : (n.isTransition = !1),
        a(n),
        (e = t.pending),
        e === null
          ? ((n.next = t.pending = n), Ws(t, n))
          : ((n.next = e.next), (t.pending = e.next = n)));
    }
  }
  function Ws(l, t) {
    var e = t.action,
      a = t.payload,
      u = l.state;
    if (t.isTransition) {
      var n = b.T,
        i = {};
      b.T = i;
      try {
        var c = e(u, a),
          s = b.S;
        (s !== null && s(i, c), $s(l, t, c));
      } catch (v) {
        lc(l, t, v);
      } finally {
        (n !== null && i.types !== null && (n.types = i.types), (b.T = n));
      }
    } else
      try {
        ((n = e(u, a)), $s(l, t, n));
      } catch (v) {
        lc(l, t, v);
      }
  }
  function $s(l, t, e) {
    e !== null && typeof e == 'object' && typeof e.then == 'function'
      ? e.then(
          function (a) {
            Fs(l, t, a);
          },
          function (a) {
            return lc(l, t, a);
          }
        )
      : Fs(l, t, e);
  }
  function Fs(l, t, e) {
    ((t.status = 'fulfilled'),
      (t.value = e),
      Is(t),
      (l.state = e),
      (t = l.pending),
      t !== null &&
        ((e = t.next), e === t ? (l.pending = null) : ((e = e.next), (t.next = e), Ws(l, e))));
  }
  function lc(l, t, e) {
    var a = l.pending;
    if (((l.pending = null), a !== null)) {
      a = a.next;
      do ((t.status = 'rejected'), (t.reason = e), Is(t), (t = t.next));
      while (t !== a);
    }
    l.action = null;
  }
  function Is(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function Ps(l, t) {
    return t;
  }
  function ld(l, t) {
    if (I) {
      var e = ol.formState;
      if (e !== null) {
        l: {
          var a = Z;
          if (I) {
            if (ml) {
              t: {
                for (var u = ml, n = gt; u.nodeType !== 8; ) {
                  if (!n) {
                    u = null;
                    break t;
                  }
                  if (((u = bt(u.nextSibling)), u === null)) {
                    u = null;
                    break t;
                  }
                }
                ((n = u.data), (u = n === 'F!' || n === 'F' ? u : null));
              }
              if (u) {
                ((ml = bt(u.nextSibling)), (a = u.data === 'F!'));
                break l;
              }
            }
            te(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return (
      (e = Ll()),
      (e.memoizedState = e.baseState = t),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ps,
        lastRenderedState: t,
      }),
      (e.queue = a),
      (e = bd.bind(null, Z, a)),
      (a.dispatch = e),
      (a = Pi(!1)),
      (n = ic.bind(null, Z, !1, a.queue)),
      (a = Ll()),
      (u = { state: t, dispatch: null, action: l, pending: null }),
      (a.queue = u),
      (e = wm.bind(null, Z, u, n, e)),
      (u.dispatch = e),
      (a.memoizedState = l),
      [t, e, !1]
    );
  }
  function td(l) {
    var t = zl();
    return ed(t, cl, l);
  }
  function ed(l, t, e) {
    if (
      ((t = Fi(l, t, Ps)[0]),
      (l = an(Qt)[0]),
      typeof t == 'object' && t !== null && typeof t.then == 'function')
    )
      try {
        var a = Fa(t);
      } catch (i) {
        throw i === fa ? wu : i;
      }
    else a = t;
    t = zl();
    var u = t.queue,
      n = u.dispatch;
    return (
      e !== t.memoizedState &&
        ((Z.flags |= 2048), ma(9, { destroy: void 0 }, km.bind(null, u, e), null)),
      [a, n, l]
    );
  }
  function km(l, t) {
    l.action = t;
  }
  function ad(l) {
    var t = zl(),
      e = cl;
    if (e !== null) return ed(t, e, l);
    (zl(), (t = t.memoizedState), (e = zl()));
    var a = e.queue.dispatch;
    return ((e.memoizedState = l), [t, a, !1]);
  }
  function ma(l, t, e, a) {
    return (
      (l = { tag: l, create: e, deps: a, inst: t, next: null }),
      (t = Z.updateQueue),
      t === null && ((t = tn()), (Z.updateQueue = t)),
      (e = t.lastEffect),
      e === null
        ? (t.lastEffect = l.next = l)
        : ((a = e.next), (e.next = l), (l.next = a), (t.lastEffect = l)),
      l
    );
  }
  function ud() {
    return zl().memoizedState;
  }
  function un(l, t, e, a) {
    var u = Ll();
    ((Z.flags |= l),
      (u.memoizedState = ma(1 | t, { destroy: void 0 }, e, a === void 0 ? null : a)));
  }
  function nn(l, t, e, a) {
    var u = zl();
    a = a === void 0 ? null : a;
    var n = u.memoizedState.inst;
    cl !== null && a !== null && Ki(a, cl.memoizedState.deps)
      ? (u.memoizedState = ma(t, n, e, a))
      : ((Z.flags |= l), (u.memoizedState = ma(1 | t, n, e, a)));
  }
  function nd(l, t) {
    un(8390656, 8, l, t);
  }
  function tc(l, t) {
    nn(2048, 8, l, t);
  }
  function Wm(l) {
    Z.flags |= 4;
    var t = Z.updateQueue;
    if (t === null) ((t = tn()), (Z.updateQueue = t), (t.events = [l]));
    else {
      var e = t.events;
      e === null ? (t.events = [l]) : e.push(l);
    }
  }
  function id(l) {
    var t = zl().memoizedState;
    return (
      Wm({ ref: t, nextImpl: l }),
      function () {
        if ((tl & 2) !== 0) throw Error(m(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function cd(l, t) {
    return nn(4, 2, l, t);
  }
  function fd(l, t) {
    return nn(4, 4, l, t);
  }
  function sd(l, t) {
    if (typeof t == 'function') {
      l = l();
      var e = t(l);
      return function () {
        typeof e == 'function' ? e() : t(null);
      };
    }
    if (t != null)
      return (
        (l = l()),
        (t.current = l),
        function () {
          t.current = null;
        }
      );
  }
  function dd(l, t, e) {
    ((e = e != null ? e.concat([l]) : null), nn(4, 4, sd.bind(null, t, l), e));
  }
  function ec() {}
  function od(l, t) {
    var e = zl();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && Ki(t, a[1]) ? a[0] : ((e.memoizedState = [l, t]), l);
  }
  function rd(l, t) {
    var e = zl();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && Ki(t, a[1])) return a[0];
    if (((a = l()), Be)) {
      $t(!0);
      try {
        l();
      } finally {
        $t(!1);
      }
    }
    return ((e.memoizedState = [a, t]), a);
  }
  function ac(l, t, e) {
    return e === void 0 || ((Gt & 1073741824) !== 0 && (W & 261930) === 0)
      ? (l.memoizedState = t)
      : ((l.memoizedState = e), (l = ho()), (Z.lanes |= l), (de |= l), e);
  }
  function md(l, t, e, a) {
    return at(e, t)
      ? e
      : da.current !== null
        ? ((l = ac(l, e, a)), at(l, t) || (Al = !0), l)
        : (Gt & 42) === 0 || ((Gt & 1073741824) !== 0 && (W & 261930) === 0)
          ? ((Al = !0), (l.memoizedState = e))
          : ((l = ho()), (Z.lanes |= l), (de |= l), t);
  }
  function hd(l, t, e, a, u) {
    var n = N.p;
    N.p = n !== 0 && 8 > n ? n : 8;
    var i = b.T,
      c = {};
    ((b.T = c), ic(l, !1, t, e));
    try {
      var s = u(),
        v = b.S;
      if (
        (v !== null && v(c, s), s !== null && typeof s == 'object' && typeof s.then == 'function')
      ) {
        var x = Vm(s, a);
        Ia(l, t, x, st(l));
      } else Ia(l, t, a, st(l));
    } catch (S) {
      Ia(l, t, { then: function () {}, status: 'rejected', reason: S }, st());
    } finally {
      ((N.p = n), i !== null && c.types !== null && (i.types = c.types), (b.T = i));
    }
  }
  function $m() {}
  function uc(l, t, e, a) {
    if (l.tag !== 5) throw Error(m(476));
    var u = vd(l).queue;
    hd(
      l,
      u,
      t,
      B,
      e === null
        ? $m
        : function () {
            return (yd(l), e(a));
          }
    );
  }
  function vd(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: B,
      baseState: B,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Qt,
        lastRenderedState: B,
      },
      next: null,
    };
    var e = {};
    return (
      (t.next = {
        memoizedState: e,
        baseState: e,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Qt,
          lastRenderedState: e,
        },
        next: null,
      }),
      (l.memoizedState = t),
      (l = l.alternate),
      l !== null && (l.memoizedState = t),
      t
    );
  }
  function yd(l) {
    var t = vd(l);
    (t.next === null && (t = l.alternate.memoizedState), Ia(l, t.next.queue, {}, st()));
  }
  function nc() {
    return ql(vu);
  }
  function gd() {
    return zl().memoizedState;
  }
  function xd() {
    return zl().memoizedState;
  }
  function Fm(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = st();
          l = ue(e);
          var a = ne(t, l, e);
          (a !== null && (Pl(a, t, e), wa(a, t, e)), (t = { cache: Hi() }), (l.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function Im(l, t, e) {
    var a = st();
    ((e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      cn(l) ? pd(t, e) : ((e = ji(l, t, e, a)), e !== null && (Pl(e, l, a), Sd(e, t, a))));
  }
  function bd(l, t, e) {
    var a = st();
    Ia(l, t, e, a);
  }
  function Ia(l, t, e, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (cn(l)) pd(t, u);
    else {
      var n = l.alternate;
      if (
        l.lanes === 0 &&
        (n === null || n.lanes === 0) &&
        ((n = t.lastRenderedReducer), n !== null)
      )
        try {
          var i = t.lastRenderedState,
            c = n(i, e);
          if (((u.hasEagerState = !0), (u.eagerState = c), at(c, i)))
            return (Qu(l, t, u, 0), ol === null && Gu(), !1);
        } catch {
        } finally {
        }
      if (((e = ji(l, t, u, a)), e !== null)) return (Pl(e, l, a), Sd(e, t, a), !0);
    }
    return !1;
  }
  function ic(l, t, e, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: Yc(),
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      cn(l))
    ) {
      if (t) throw Error(m(479));
    } else ((t = ji(l, e, a, 2)), t !== null && Pl(t, l, 2));
  }
  function cn(l) {
    var t = l.alternate;
    return l === Z || (t !== null && t === Z);
  }
  function pd(l, t) {
    oa = Pu = !0;
    var e = l.pending;
    (e === null ? (t.next = t) : ((t.next = e.next), (e.next = t)), (l.pending = t));
  }
  function Sd(l, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      ((a &= l.pendingLanes), (e |= a), (t.lanes = e), Nf(l, e));
    }
  }
  var Pa = {
    readContext: ql,
    use: en,
    useCallback: yl,
    useContext: yl,
    useEffect: yl,
    useImperativeHandle: yl,
    useLayoutEffect: yl,
    useInsertionEffect: yl,
    useMemo: yl,
    useReducer: yl,
    useRef: yl,
    useState: yl,
    useDebugValue: yl,
    useDeferredValue: yl,
    useTransition: yl,
    useSyncExternalStore: yl,
    useId: yl,
    useHostTransitionStatus: yl,
    useFormState: yl,
    useActionState: yl,
    useOptimistic: yl,
    useMemoCache: yl,
    useCacheRefresh: yl,
  };
  Pa.useEffectEvent = yl;
  var zd = {
      readContext: ql,
      use: en,
      useCallback: function (l, t) {
        return ((Ll().memoizedState = [l, t === void 0 ? null : t]), l);
      },
      useContext: ql,
      useEffect: nd,
      useImperativeHandle: function (l, t, e) {
        ((e = e != null ? e.concat([l]) : null), un(4194308, 4, sd.bind(null, t, l), e));
      },
      useLayoutEffect: function (l, t) {
        return un(4194308, 4, l, t);
      },
      useInsertionEffect: function (l, t) {
        un(4, 2, l, t);
      },
      useMemo: function (l, t) {
        var e = Ll();
        t = t === void 0 ? null : t;
        var a = l();
        if (Be) {
          $t(!0);
          try {
            l();
          } finally {
            $t(!1);
          }
        }
        return ((e.memoizedState = [a, t]), a);
      },
      useReducer: function (l, t, e) {
        var a = Ll();
        if (e !== void 0) {
          var u = e(t);
          if (Be) {
            $t(!0);
            try {
              e(t);
            } finally {
              $t(!1);
            }
          }
        } else u = t;
        return (
          (a.memoizedState = a.baseState = u),
          (l = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: l,
            lastRenderedState: u,
          }),
          (a.queue = l),
          (l = l.dispatch = Im.bind(null, Z, l)),
          [a.memoizedState, l]
        );
      },
      useRef: function (l) {
        var t = Ll();
        return ((l = { current: l }), (t.memoizedState = l));
      },
      useState: function (l) {
        l = Pi(l);
        var t = l.queue,
          e = bd.bind(null, Z, t);
        return ((t.dispatch = e), [l.memoizedState, e]);
      },
      useDebugValue: ec,
      useDeferredValue: function (l, t) {
        var e = Ll();
        return ac(e, l, t);
      },
      useTransition: function () {
        var l = Pi(!1);
        return ((l = hd.bind(null, Z, l.queue, !0, !1)), (Ll().memoizedState = l), [!1, l]);
      },
      useSyncExternalStore: function (l, t, e) {
        var a = Z,
          u = Ll();
        if (I) {
          if (e === void 0) throw Error(m(407));
          e = e();
        } else {
          if (((e = t()), ol === null)) throw Error(m(349));
          (W & 127) !== 0 || Ls(a, t, e);
        }
        u.memoizedState = e;
        var n = { value: e, getSnapshot: t };
        return (
          (u.queue = n),
          nd(Ks.bind(null, a, n, l), [l]),
          (a.flags |= 2048),
          ma(9, { destroy: void 0 }, Vs.bind(null, a, n, e, t), null),
          e
        );
      },
      useId: function () {
        var l = Ll(),
          t = ol.identifierPrefix;
        if (I) {
          var e = _t,
            a = At;
          ((e = (a & ~(1 << (32 - et(a) - 1))).toString(32) + e),
            (t = '_' + t + 'R_' + e),
            (e = ln++),
            0 < e && (t += 'H' + e.toString(32)),
            (t += '_'));
        } else ((e = Km++), (t = '_' + t + 'r_' + e.toString(32) + '_'));
        return (l.memoizedState = t);
      },
      useHostTransitionStatus: nc,
      useFormState: ld,
      useActionState: ld,
      useOptimistic: function (l) {
        var t = Ll();
        t.memoizedState = t.baseState = l;
        var e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return ((t.queue = e), (t = ic.bind(null, Z, !0, e)), (e.dispatch = t), [l, t]);
      },
      useMemoCache: $i,
      useCacheRefresh: function () {
        return (Ll().memoizedState = Fm.bind(null, Z));
      },
      useEffectEvent: function (l) {
        var t = Ll(),
          e = { impl: l };
        return (
          (t.memoizedState = e),
          function () {
            if ((tl & 2) !== 0) throw Error(m(440));
            return e.impl.apply(void 0, arguments);
          }
        );
      },
    },
    cc = {
      readContext: ql,
      use: en,
      useCallback: od,
      useContext: ql,
      useEffect: tc,
      useImperativeHandle: dd,
      useInsertionEffect: cd,
      useLayoutEffect: fd,
      useMemo: rd,
      useReducer: an,
      useRef: ud,
      useState: function () {
        return an(Qt);
      },
      useDebugValue: ec,
      useDeferredValue: function (l, t) {
        var e = zl();
        return md(e, cl.memoizedState, l, t);
      },
      useTransition: function () {
        var l = an(Qt)[0],
          t = zl().memoizedState;
        return [typeof l == 'boolean' ? l : Fa(l), t];
      },
      useSyncExternalStore: Zs,
      useId: gd,
      useHostTransitionStatus: nc,
      useFormState: td,
      useActionState: td,
      useOptimistic: function (l, t) {
        var e = zl();
        return ks(e, cl, l, t);
      },
      useMemoCache: $i,
      useCacheRefresh: xd,
    };
  cc.useEffectEvent = id;
  var jd = {
    readContext: ql,
    use: en,
    useCallback: od,
    useContext: ql,
    useEffect: tc,
    useImperativeHandle: dd,
    useInsertionEffect: cd,
    useLayoutEffect: fd,
    useMemo: rd,
    useReducer: Ii,
    useRef: ud,
    useState: function () {
      return Ii(Qt);
    },
    useDebugValue: ec,
    useDeferredValue: function (l, t) {
      var e = zl();
      return cl === null ? ac(e, l, t) : md(e, cl.memoizedState, l, t);
    },
    useTransition: function () {
      var l = Ii(Qt)[0],
        t = zl().memoizedState;
      return [typeof l == 'boolean' ? l : Fa(l), t];
    },
    useSyncExternalStore: Zs,
    useId: gd,
    useHostTransitionStatus: nc,
    useFormState: ad,
    useActionState: ad,
    useOptimistic: function (l, t) {
      var e = zl();
      return cl !== null ? ks(e, cl, l, t) : ((e.baseState = l), [l, e.queue.dispatch]);
    },
    useMemoCache: $i,
    useCacheRefresh: xd,
  };
  jd.useEffectEvent = id;
  function fc(l, t, e, a) {
    ((t = l.memoizedState),
      (e = e(a, t)),
      (e = e == null ? t : U({}, t, e)),
      (l.memoizedState = e),
      l.lanes === 0 && (l.updateQueue.baseState = e));
  }
  var sc = {
    enqueueSetState: function (l, t, e) {
      l = l._reactInternals;
      var a = st(),
        u = ue(a);
      ((u.payload = t),
        e != null && (u.callback = e),
        (t = ne(l, u, a)),
        t !== null && (Pl(t, l, a), wa(t, l, a)));
    },
    enqueueReplaceState: function (l, t, e) {
      l = l._reactInternals;
      var a = st(),
        u = ue(a);
      ((u.tag = 1),
        (u.payload = t),
        e != null && (u.callback = e),
        (t = ne(l, u, a)),
        t !== null && (Pl(t, l, a), wa(t, l, a)));
    },
    enqueueForceUpdate: function (l, t) {
      l = l._reactInternals;
      var e = st(),
        a = ue(e);
      ((a.tag = 2),
        t != null && (a.callback = t),
        (t = ne(l, a, e)),
        t !== null && (Pl(t, l, e), wa(t, l, e)));
    },
  };
  function Td(l, t, e, a, u, n, i) {
    return (
      (l = l.stateNode),
      typeof l.shouldComponentUpdate == 'function'
        ? l.shouldComponentUpdate(a, n, i)
        : t.prototype && t.prototype.isPureReactComponent
          ? !Ga(e, a) || !Ga(u, n)
          : !0
    );
  }
  function Ed(l, t, e, a) {
    ((l = t.state),
      typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(e, a),
      typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
        t.UNSAFE_componentWillReceiveProps(e, a),
      t.state !== l && sc.enqueueReplaceState(t, t.state, null));
  }
  function Ye(l, t) {
    var e = t;
    if ('ref' in t) {
      e = {};
      for (var a in t) a !== 'ref' && (e[a] = t[a]);
    }
    if ((l = l.defaultProps)) {
      e === t && (e = U({}, e));
      for (var u in l) e[u] === void 0 && (e[u] = l[u]);
    }
    return e;
  }
  function Nd(l) {
    Yu(l);
  }
  function Ad(l) {
    console.error(l);
  }
  function _d(l) {
    Yu(l);
  }
  function fn(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Md(l, t, e) {
    try {
      var a = l.onCaughtError;
      a(e.value, { componentStack: e.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function dc(l, t, e) {
    return (
      (e = ue(e)),
      (e.tag = 3),
      (e.payload = { element: null }),
      (e.callback = function () {
        fn(l, t);
      }),
      e
    );
  }
  function Od(l) {
    return ((l = ue(l)), (l.tag = 3), l);
  }
  function Dd(l, t, e, a) {
    var u = e.type.getDerivedStateFromError;
    if (typeof u == 'function') {
      var n = a.value;
      ((l.payload = function () {
        return u(n);
      }),
        (l.callback = function () {
          Md(t, e, a);
        }));
    }
    var i = e.stateNode;
    i !== null &&
      typeof i.componentDidCatch == 'function' &&
      (l.callback = function () {
        (Md(t, e, a),
          typeof u != 'function' && (oe === null ? (oe = new Set([this])) : oe.add(this)));
        var c = a.stack;
        this.componentDidCatch(a.value, { componentStack: c !== null ? c : '' });
      });
  }
  function Pm(l, t, e, a, u) {
    if (((e.flags |= 32768), a !== null && typeof a == 'object' && typeof a.then == 'function')) {
      if (((t = e.alternate), t !== null && na(t, e, u, !0), (e = nt.current), e !== null)) {
        switch (e.tag) {
          case 31:
          case 13:
            return (
              xt === null ? pn() : e.alternate === null && gl === 0 && (gl = 3),
              (e.flags &= -257),
              (e.flags |= 65536),
              (e.lanes = u),
              a === ku
                ? (e.flags |= 16384)
                : ((t = e.updateQueue),
                  t === null ? (e.updateQueue = new Set([a])) : t.add(a),
                  Cc(l, a, u)),
              !1
            );
          case 22:
            return (
              (e.flags |= 65536),
              a === ku
                ? (e.flags |= 16384)
                : ((t = e.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([a]) }),
                      (e.updateQueue = t))
                    : ((e = t.retryQueue), e === null ? (t.retryQueue = new Set([a])) : e.add(a)),
                  Cc(l, a, u)),
              !1
            );
        }
        throw Error(m(435, e.tag));
      }
      return (Cc(l, a, u), pn(), !1);
    }
    if (I)
      return (
        (t = nt.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = u),
            a !== Mi && ((l = Error(m(422), { cause: a })), Za(ht(l, e))))
          : (a !== Mi && ((t = Error(m(423), { cause: a })), Za(ht(t, e))),
            (l = l.current.alternate),
            (l.flags |= 65536),
            (u &= -u),
            (l.lanes |= u),
            (a = ht(a, e)),
            (u = dc(l.stateNode, a, u)),
            Qi(l, u),
            gl !== 4 && (gl = 2)),
        !1
      );
    var n = Error(m(520), { cause: a });
    if (((n = ht(n, e)), cu === null ? (cu = [n]) : cu.push(n), gl !== 4 && (gl = 2), t === null))
      return !0;
    ((a = ht(a, e)), (e = t));
    do {
      switch (e.tag) {
        case 3:
          return (
            (e.flags |= 65536),
            (l = u & -u),
            (e.lanes |= l),
            (l = dc(e.stateNode, a, l)),
            Qi(e, l),
            !1
          );
        case 1:
          if (
            ((t = e.type),
            (n = e.stateNode),
            (e.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == 'function' ||
                (n !== null &&
                  typeof n.componentDidCatch == 'function' &&
                  (oe === null || !oe.has(n)))))
          )
            return (
              (e.flags |= 65536),
              (u &= -u),
              (e.lanes |= u),
              (u = Od(u)),
              Dd(u, l, e, a),
              Qi(e, u),
              !1
            );
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var oc = Error(m(461)),
    Al = !1;
  function Bl(l, t, e, a) {
    t.child = l === null ? Cs(t, null, e, a) : qe(t, l.child, e, a);
  }
  function Ud(l, t, e, a, u) {
    e = e.render;
    var n = t.ref;
    if ('ref' in a) {
      var i = {};
      for (var c in a) c !== 'ref' && (i[c] = a[c]);
    } else i = a;
    return (
      Ue(t),
      (a = Ji(l, t, e, i, n, u)),
      (c = wi()),
      l !== null && !Al
        ? (ki(l, t, u), Xt(l, t, u))
        : (I && c && Ai(t), (t.flags |= 1), Bl(l, t, a, u), t.child)
    );
  }
  function Rd(l, t, e, a, u) {
    if (l === null) {
      var n = e.type;
      return typeof n == 'function' && !Ti(n) && n.defaultProps === void 0 && e.compare === null
        ? ((t.tag = 15), (t.type = n), Hd(l, t, n, a, u))
        : ((l = Zu(e.type, null, a, t, t.mode, u)), (l.ref = t.ref), (l.return = t), (t.child = l));
    }
    if (((n = l.child), !bc(l, u))) {
      var i = n.memoizedProps;
      if (((e = e.compare), (e = e !== null ? e : Ga), e(i, a) && l.ref === t.ref))
        return Xt(l, t, u);
    }
    return ((t.flags |= 1), (l = Ct(n, a)), (l.ref = t.ref), (l.return = t), (t.child = l));
  }
  function Hd(l, t, e, a, u) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Ga(n, a) && l.ref === t.ref)
        if (((Al = !1), (t.pendingProps = a = n), bc(l, u))) (l.flags & 131072) !== 0 && (Al = !0);
        else return ((t.lanes = l.lanes), Xt(l, t, u));
    }
    return rc(l, t, e, a, u);
  }
  function Cd(l, t, e, a) {
    var u = a.children,
      n = l !== null ? l.memoizedState : null;
    if (
      (l === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      a.mode === 'hidden')
    ) {
      if ((t.flags & 128) !== 0) {
        if (((n = n !== null ? n.baseLanes | e : e), l !== null)) {
          for (a = t.child = l.child, u = 0; a !== null; )
            ((u = u | a.lanes | a.childLanes), (a = a.sibling));
          a = u & ~n;
        } else ((a = 0), (t.child = null));
        return qd(l, t, n, e, a);
      }
      if ((e & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          l !== null && Ju(t, n !== null ? n.cachePool : null),
          n !== null ? Ys(t, n) : Zi(),
          Gs(t));
      else return ((a = t.lanes = 536870912), qd(l, t, n !== null ? n.baseLanes | e : e, e, a));
    } else
      n !== null
        ? (Ju(t, n.cachePool), Ys(t, n), ce(), (t.memoizedState = null))
        : (l !== null && Ju(t, null), Zi(), ce());
    return (Bl(l, t, u, e), t.child);
  }
  function lu(l, t) {
    return (
      (l !== null && l.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function qd(l, t, e, a, u) {
    var n = qi();
    return (
      (n = n === null ? null : { parent: El._currentValue, pool: n }),
      (t.memoizedState = { baseLanes: e, cachePool: n }),
      l !== null && Ju(t, null),
      Zi(),
      Gs(t),
      l !== null && na(l, t, a, !0),
      (t.childLanes = u),
      null
    );
  }
  function sn(l, t) {
    return (
      (t = on({ mode: t.mode, children: t.children }, l.mode)),
      (t.ref = l.ref),
      (l.child = t),
      (t.return = l),
      t
    );
  }
  function Bd(l, t, e) {
    return (
      qe(t, l.child, null, e),
      (l = sn(t, t.pendingProps)),
      (l.flags |= 2),
      it(t),
      (t.memoizedState = null),
      l
    );
  }
  function lh(l, t, e) {
    var a = t.pendingProps,
      u = (t.flags & 128) !== 0;
    if (((t.flags &= -129), l === null)) {
      if (I) {
        if (a.mode === 'hidden') return ((l = sn(t, a)), (t.lanes = 536870912), lu(null, l));
        if (
          (Vi(t),
          (l = ml)
            ? ((l = $o(l, gt)),
              (l = l !== null && l.data === '&' ? l : null),
              l !== null &&
                ((t.memoizedState = {
                  dehydrated: l,
                  treeContext: Pt !== null ? { id: At, overflow: _t } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = ps(l)),
                (e.return = t),
                (t.child = e),
                (Cl = t),
                (ml = null)))
            : (l = null),
          l === null)
        )
          throw te(t);
        return ((t.lanes = 536870912), null);
      }
      return sn(t, a);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var i = n.dehydrated;
      if ((Vi(t), u))
        if (t.flags & 256) ((t.flags &= -257), (t = Bd(l, t, e)));
        else if (t.memoizedState !== null) ((t.child = l.child), (t.flags |= 128), (t = null));
        else throw Error(m(558));
      else if ((Al || na(l, t, e, !1), (u = (e & l.childLanes) !== 0), Al || u)) {
        if (((a = ol), a !== null && ((i = Af(a, e)), i !== 0 && i !== n.retryLane)))
          throw ((n.retryLane = i), _e(l, i), Pl(a, l, i), oc);
        (pn(), (t = Bd(l, t, e)));
      } else
        ((l = n.treeContext),
          (ml = bt(i.nextSibling)),
          (Cl = t),
          (I = !0),
          (le = null),
          (gt = !1),
          l !== null && js(t, l),
          (t = sn(t, a)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (l = Ct(l.child, { mode: a.mode, children: a.children })),
      (l.ref = t.ref),
      (t.child = l),
      (l.return = t),
      l
    );
  }
  function dn(l, t) {
    var e = t.ref;
    if (e === null) l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != 'function' && typeof e != 'object') throw Error(m(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function rc(l, t, e, a, u) {
    return (
      Ue(t),
      (e = Ji(l, t, e, a, void 0, u)),
      (a = wi()),
      l !== null && !Al
        ? (ki(l, t, u), Xt(l, t, u))
        : (I && a && Ai(t), (t.flags |= 1), Bl(l, t, e, u), t.child)
    );
  }
  function Yd(l, t, e, a, u, n) {
    return (
      Ue(t),
      (t.updateQueue = null),
      (e = Xs(t, a, e, u)),
      Qs(l),
      (a = wi()),
      l !== null && !Al
        ? (ki(l, t, n), Xt(l, t, n))
        : (I && a && Ai(t), (t.flags |= 1), Bl(l, t, e, n), t.child)
    );
  }
  function Gd(l, t, e, a, u) {
    if ((Ue(t), t.stateNode === null)) {
      var n = ta,
        i = e.contextType;
      (typeof i == 'object' && i !== null && (n = ql(i)),
        (n = new e(a, n)),
        (t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null),
        (n.updater = sc),
        (t.stateNode = n),
        (n._reactInternals = t),
        (n = t.stateNode),
        (n.props = a),
        (n.state = t.memoizedState),
        (n.refs = {}),
        Yi(t),
        (i = e.contextType),
        (n.context = typeof i == 'object' && i !== null ? ql(i) : ta),
        (n.state = t.memoizedState),
        (i = e.getDerivedStateFromProps),
        typeof i == 'function' && (fc(t, e, i, a), (n.state = t.memoizedState)),
        typeof e.getDerivedStateFromProps == 'function' ||
          typeof n.getSnapshotBeforeUpdate == 'function' ||
          (typeof n.UNSAFE_componentWillMount != 'function' &&
            typeof n.componentWillMount != 'function') ||
          ((i = n.state),
          typeof n.componentWillMount == 'function' && n.componentWillMount(),
          typeof n.UNSAFE_componentWillMount == 'function' && n.UNSAFE_componentWillMount(),
          i !== n.state && sc.enqueueReplaceState(n, n.state, null),
          Wa(t, a, n, u),
          ka(),
          (n.state = t.memoizedState)),
        typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
        (a = !0));
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps,
        s = Ye(e, c);
      n.props = s;
      var v = n.context,
        x = e.contextType;
      ((i = ta), typeof x == 'object' && x !== null && (i = ql(x)));
      var S = e.getDerivedStateFromProps;
      ((x = typeof S == 'function' || typeof n.getSnapshotBeforeUpdate == 'function'),
        (c = t.pendingProps !== c),
        x ||
          (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof n.componentWillReceiveProps != 'function') ||
          ((c || v !== i) && Ed(t, n, a, i)),
        (ae = !1));
      var y = t.memoizedState;
      ((n.state = y),
        Wa(t, a, n, u),
        ka(),
        (v = t.memoizedState),
        c || y !== v || ae
          ? (typeof S == 'function' && (fc(t, e, S, a), (v = t.memoizedState)),
            (s = ae || Td(t, e, s, a, y, v, i))
              ? (x ||
                  (typeof n.UNSAFE_componentWillMount != 'function' &&
                    typeof n.componentWillMount != 'function') ||
                  (typeof n.componentWillMount == 'function' && n.componentWillMount(),
                  typeof n.UNSAFE_componentWillMount == 'function' &&
                    n.UNSAFE_componentWillMount()),
                typeof n.componentDidMount == 'function' && (t.flags |= 4194308))
              : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308),
                (t.memoizedProps = a),
                (t.memoizedState = v)),
            (n.props = a),
            (n.state = v),
            (n.context = i),
            (a = s))
          : (typeof n.componentDidMount == 'function' && (t.flags |= 4194308), (a = !1)));
    } else {
      ((n = t.stateNode),
        Gi(l, t),
        (i = t.memoizedProps),
        (x = Ye(e, i)),
        (n.props = x),
        (S = t.pendingProps),
        (y = n.context),
        (v = e.contextType),
        (s = ta),
        typeof v == 'object' && v !== null && (s = ql(v)),
        (c = e.getDerivedStateFromProps),
        (v = typeof c == 'function' || typeof n.getSnapshotBeforeUpdate == 'function') ||
          (typeof n.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof n.componentWillReceiveProps != 'function') ||
          ((i !== S || y !== s) && Ed(t, n, a, s)),
        (ae = !1),
        (y = t.memoizedState),
        (n.state = y),
        Wa(t, a, n, u),
        ka());
      var g = t.memoizedState;
      i !== S || y !== g || ae || (l !== null && l.dependencies !== null && Vu(l.dependencies))
        ? (typeof c == 'function' && (fc(t, e, c, a), (g = t.memoizedState)),
          (x =
            ae ||
            Td(t, e, x, a, y, g, s) ||
            (l !== null && l.dependencies !== null && Vu(l.dependencies)))
            ? (v ||
                (typeof n.UNSAFE_componentWillUpdate != 'function' &&
                  typeof n.componentWillUpdate != 'function') ||
                (typeof n.componentWillUpdate == 'function' && n.componentWillUpdate(a, g, s),
                typeof n.UNSAFE_componentWillUpdate == 'function' &&
                  n.UNSAFE_componentWillUpdate(a, g, s)),
              typeof n.componentDidUpdate == 'function' && (t.flags |= 4),
              typeof n.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
            : (typeof n.componentDidUpdate != 'function' ||
                (i === l.memoizedProps && y === l.memoizedState) ||
                (t.flags |= 4),
              typeof n.getSnapshotBeforeUpdate != 'function' ||
                (i === l.memoizedProps && y === l.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = a),
              (t.memoizedState = g)),
          (n.props = a),
          (n.state = g),
          (n.context = s),
          (a = x))
        : (typeof n.componentDidUpdate != 'function' ||
            (i === l.memoizedProps && y === l.memoizedState) ||
            (t.flags |= 4),
          typeof n.getSnapshotBeforeUpdate != 'function' ||
            (i === l.memoizedProps && y === l.memoizedState) ||
            (t.flags |= 1024),
          (a = !1));
    }
    return (
      (n = a),
      dn(l, t),
      (a = (t.flags & 128) !== 0),
      n || a
        ? ((n = t.stateNode),
          (e = a && typeof e.getDerivedStateFromError != 'function' ? null : n.render()),
          (t.flags |= 1),
          l !== null && a
            ? ((t.child = qe(t, l.child, null, u)), (t.child = qe(t, null, e, u)))
            : Bl(l, t, e, u),
          (t.memoizedState = n.state),
          (l = t.child))
        : (l = Xt(l, t, u)),
      l
    );
  }
  function Qd(l, t, e, a) {
    return (Oe(), (t.flags |= 256), Bl(l, t, e, a), t.child);
  }
  var mc = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function hc(l) {
    return { baseLanes: l, cachePool: Ms() };
  }
  function vc(l, t, e) {
    return ((l = l !== null ? l.childLanes & ~e : 0), t && (l |= ft), l);
  }
  function Xd(l, t, e) {
    var a = t.pendingProps,
      u = !1,
      n = (t.flags & 128) !== 0,
      i;
    if (
      ((i = n) || (i = l !== null && l.memoizedState === null ? !1 : (Sl.current & 2) !== 0),
      i && ((u = !0), (t.flags &= -129)),
      (i = (t.flags & 32) !== 0),
      (t.flags &= -33),
      l === null)
    ) {
      if (I) {
        if (
          (u ? ie(t) : ce(),
          (l = ml)
            ? ((l = $o(l, gt)),
              (l = l !== null && l.data !== '&' ? l : null),
              l !== null &&
                ((t.memoizedState = {
                  dehydrated: l,
                  treeContext: Pt !== null ? { id: At, overflow: _t } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = ps(l)),
                (e.return = t),
                (t.child = e),
                (Cl = t),
                (ml = null)))
            : (l = null),
          l === null)
        )
          throw te(t);
        return (Fc(l) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var c = a.children;
      return (
        (a = a.fallback),
        u
          ? (ce(),
            (u = t.mode),
            (c = on({ mode: 'hidden', children: c }, u)),
            (a = Me(a, u, e, null)),
            (c.return = t),
            (a.return = t),
            (c.sibling = a),
            (t.child = c),
            (a = t.child),
            (a.memoizedState = hc(e)),
            (a.childLanes = vc(l, i, e)),
            (t.memoizedState = mc),
            lu(null, a))
          : (ie(t), yc(t, c))
      );
    }
    var s = l.memoizedState;
    if (s !== null && ((c = s.dehydrated), c !== null)) {
      if (n)
        t.flags & 256
          ? (ie(t), (t.flags &= -257), (t = gc(l, t, e)))
          : t.memoizedState !== null
            ? (ce(), (t.child = l.child), (t.flags |= 128), (t = null))
            : (ce(),
              (c = a.fallback),
              (u = t.mode),
              (a = on({ mode: 'visible', children: a.children }, u)),
              (c = Me(c, u, e, null)),
              (c.flags |= 2),
              (a.return = t),
              (c.return = t),
              (a.sibling = c),
              (t.child = a),
              qe(t, l.child, null, e),
              (a = t.child),
              (a.memoizedState = hc(e)),
              (a.childLanes = vc(l, i, e)),
              (t.memoizedState = mc),
              (t = lu(null, a)));
      else if ((ie(t), Fc(c))) {
        if (((i = c.nextSibling && c.nextSibling.dataset), i)) var v = i.dgst;
        ((i = v),
          (a = Error(m(419))),
          (a.stack = ''),
          (a.digest = i),
          Za({ value: a, source: null, stack: null }),
          (t = gc(l, t, e)));
      } else if ((Al || na(l, t, e, !1), (i = (e & l.childLanes) !== 0), Al || i)) {
        if (((i = ol), i !== null && ((a = Af(i, e)), a !== 0 && a !== s.retryLane)))
          throw ((s.retryLane = a), _e(l, a), Pl(i, l, a), oc);
        ($c(c) || pn(), (t = gc(l, t, e)));
      } else
        $c(c)
          ? ((t.flags |= 192), (t.child = l.child), (t = null))
          : ((l = s.treeContext),
            (ml = bt(c.nextSibling)),
            (Cl = t),
            (I = !0),
            (le = null),
            (gt = !1),
            l !== null && js(t, l),
            (t = yc(t, a.children)),
            (t.flags |= 4096));
      return t;
    }
    return u
      ? (ce(),
        (c = a.fallback),
        (u = t.mode),
        (s = l.child),
        (v = s.sibling),
        (a = Ct(s, { mode: 'hidden', children: a.children })),
        (a.subtreeFlags = s.subtreeFlags & 65011712),
        v !== null ? (c = Ct(v, c)) : ((c = Me(c, u, e, null)), (c.flags |= 2)),
        (c.return = t),
        (a.return = t),
        (a.sibling = c),
        (t.child = a),
        lu(null, a),
        (a = t.child),
        (c = l.child.memoizedState),
        c === null
          ? (c = hc(e))
          : ((u = c.cachePool),
            u !== null
              ? ((s = El._currentValue), (u = u.parent !== s ? { parent: s, pool: s } : u))
              : (u = Ms()),
            (c = { baseLanes: c.baseLanes | e, cachePool: u })),
        (a.memoizedState = c),
        (a.childLanes = vc(l, i, e)),
        (t.memoizedState = mc),
        lu(l.child, a))
      : (ie(t),
        (e = l.child),
        (l = e.sibling),
        (e = Ct(e, { mode: 'visible', children: a.children })),
        (e.return = t),
        (e.sibling = null),
        l !== null &&
          ((i = t.deletions), i === null ? ((t.deletions = [l]), (t.flags |= 16)) : i.push(l)),
        (t.child = e),
        (t.memoizedState = null),
        e);
  }
  function yc(l, t) {
    return ((t = on({ mode: 'visible', children: t }, l.mode)), (t.return = l), (l.child = t));
  }
  function on(l, t) {
    return ((l = ut(22, l, null, t)), (l.lanes = 0), l);
  }
  function gc(l, t, e) {
    return (
      qe(t, l.child, null, e),
      (l = yc(t, t.pendingProps.children)),
      (l.flags |= 2),
      (t.memoizedState = null),
      l
    );
  }
  function Zd(l, t, e) {
    l.lanes |= t;
    var a = l.alternate;
    (a !== null && (a.lanes |= t), Ui(l.return, t, e));
  }
  function xc(l, t, e, a, u, n) {
    var i = l.memoizedState;
    i === null
      ? (l.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: e,
          tailMode: u,
          treeForkCount: n,
        })
      : ((i.isBackwards = t),
        (i.rendering = null),
        (i.renderingStartTime = 0),
        (i.last = a),
        (i.tail = e),
        (i.tailMode = u),
        (i.treeForkCount = n));
  }
  function Ld(l, t, e) {
    var a = t.pendingProps,
      u = a.revealOrder,
      n = a.tail;
    a = a.children;
    var i = Sl.current,
      c = (i & 2) !== 0;
    if (
      (c ? ((i = (i & 1) | 2), (t.flags |= 128)) : (i &= 1),
      A(Sl, i),
      Bl(l, t, a, e),
      (a = I ? Xa : 0),
      !c && l !== null && (l.flags & 128) !== 0)
    )
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13) l.memoizedState !== null && Zd(l, e, t);
        else if (l.tag === 19) Zd(l, e, t);
        else if (l.child !== null) {
          ((l.child.return = l), (l = l.child));
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t) break l;
          l = l.return;
        }
        ((l.sibling.return = l.return), (l = l.sibling));
      }
    switch (u) {
      case 'forwards':
        for (e = t.child, u = null; e !== null; )
          ((l = e.alternate), l !== null && Iu(l) === null && (u = e), (e = e.sibling));
        ((e = u),
          e === null ? ((u = t.child), (t.child = null)) : ((u = e.sibling), (e.sibling = null)),
          xc(t, !1, u, e, n, a));
        break;
      case 'backwards':
      case 'unstable_legacy-backwards':
        for (e = null, u = t.child, t.child = null; u !== null; ) {
          if (((l = u.alternate), l !== null && Iu(l) === null)) {
            t.child = u;
            break;
          }
          ((l = u.sibling), (u.sibling = e), (e = u), (u = l));
        }
        xc(t, !0, e, null, n, a);
        break;
      case 'together':
        xc(t, !1, null, null, void 0, a);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Xt(l, t, e) {
    if (
      (l !== null && (t.dependencies = l.dependencies), (de |= t.lanes), (e & t.childLanes) === 0)
    )
      if (l !== null) {
        if ((na(l, t, e, !1), (e & t.childLanes) === 0)) return null;
      } else return null;
    if (l !== null && t.child !== l.child) throw Error(m(153));
    if (t.child !== null) {
      for (l = t.child, e = Ct(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        ((l = l.sibling), (e = e.sibling = Ct(l, l.pendingProps)), (e.return = t));
      e.sibling = null;
    }
    return t.child;
  }
  function bc(l, t) {
    return (l.lanes & t) !== 0 ? !0 : ((l = l.dependencies), !!(l !== null && Vu(l)));
  }
  function th(l, t, e) {
    switch (t.tag) {
      case 3:
        (Zl(t, t.stateNode.containerInfo), ee(t, El, l.memoizedState.cache), Oe());
        break;
      case 27:
      case 5:
        Na(t);
        break;
      case 4:
        Zl(t, t.stateNode.containerInfo);
        break;
      case 10:
        ee(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Vi(t), null);
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (ie(t), (t.flags |= 128), null)
            : (e & t.child.childLanes) !== 0
              ? Xd(l, t, e)
              : (ie(t), (l = Xt(l, t, e)), l !== null ? l.sibling : null);
        ie(t);
        break;
      case 19:
        var u = (l.flags & 128) !== 0;
        if (
          ((a = (e & t.childLanes) !== 0),
          a || (na(l, t, e, !1), (a = (e & t.childLanes) !== 0)),
          u)
        ) {
          if (a) return Ld(l, t, e);
          t.flags |= 128;
        }
        if (
          ((u = t.memoizedState),
          u !== null && ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          A(Sl, Sl.current),
          a)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), Cd(l, t, e, t.pendingProps));
      case 24:
        ee(t, El, l.memoizedState.cache);
    }
    return Xt(l, t, e);
  }
  function Vd(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps) Al = !0;
      else {
        if (!bc(l, e) && (t.flags & 128) === 0) return ((Al = !1), th(l, t, e));
        Al = (l.flags & 131072) !== 0;
      }
    else ((Al = !1), I && (t.flags & 1048576) !== 0 && zs(t, Xa, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (((l = He(t.elementType)), (t.type = l), typeof l == 'function'))
            Ti(l)
              ? ((a = Ye(l, a)), (t.tag = 1), (t = Gd(null, t, l, a, e)))
              : ((t.tag = 0), (t = rc(null, t, l, a, e)));
          else {
            if (l != null) {
              var u = l.$$typeof;
              if (u === xl) {
                ((t.tag = 11), (t = Ud(null, t, l, a, e)));
                break l;
              } else if (u === K) {
                ((t.tag = 14), (t = Rd(null, t, l, a, e)));
                break l;
              }
            }
            throw ((t = Dt(l) || l), Error(m(306, t, '')));
          }
        }
        return t;
      case 0:
        return rc(l, t, t.type, t.pendingProps, e);
      case 1:
        return ((a = t.type), (u = Ye(a, t.pendingProps)), Gd(l, t, a, u, e));
      case 3:
        l: {
          if ((Zl(t, t.stateNode.containerInfo), l === null)) throw Error(m(387));
          a = t.pendingProps;
          var n = t.memoizedState;
          ((u = n.element), Gi(l, t), Wa(t, a, null, e));
          var i = t.memoizedState;
          if (
            ((a = i.cache),
            ee(t, El, a),
            a !== n.cache && Ri(t, [El], e, !0),
            ka(),
            (a = i.element),
            n.isDehydrated)
          )
            if (
              ((n = { element: a, isDehydrated: !1, cache: i.cache }),
              (t.updateQueue.baseState = n),
              (t.memoizedState = n),
              t.flags & 256)
            ) {
              t = Qd(l, t, a, e);
              break l;
            } else if (a !== u) {
              ((u = ht(Error(m(424)), t)), Za(u), (t = Qd(l, t, a, e)));
              break l;
            } else {
              switch (((l = t.stateNode.containerInfo), l.nodeType)) {
                case 9:
                  l = l.body;
                  break;
                default:
                  l = l.nodeName === 'HTML' ? l.ownerDocument.body : l;
              }
              for (
                ml = bt(l.firstChild),
                  Cl = t,
                  I = !0,
                  le = null,
                  gt = !0,
                  e = Cs(t, null, a, e),
                  t.child = e;
                e;
              )
                ((e.flags = (e.flags & -3) | 4096), (e = e.sibling));
            }
          else {
            if ((Oe(), a === u)) {
              t = Xt(l, t, e);
              break l;
            }
            Bl(l, t, a, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          dn(l, t),
          l === null
            ? (e = er(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = e)
              : I ||
                ((e = t.type),
                (l = t.pendingProps),
                (a = An(J.current).createElement(e)),
                (a[Hl] = t),
                (a[wl] = l),
                Yl(a, e, l),
                Dl(a),
                (t.stateNode = a))
            : (t.memoizedState = er(t.type, l.memoizedProps, t.pendingProps, l.memoizedState)),
          null
        );
      case 27:
        return (
          Na(t),
          l === null &&
            I &&
            ((a = t.stateNode = Po(t.type, t.pendingProps, J.current)),
            (Cl = t),
            (gt = !0),
            (u = ml),
            ve(t.type) ? ((Ic = u), (ml = bt(a.firstChild))) : (ml = u)),
          Bl(l, t, t.pendingProps.children, e),
          dn(l, t),
          l === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          l === null &&
            I &&
            ((u = a = ml) &&
              ((a = Dh(a, t.type, t.pendingProps, gt)),
              a !== null
                ? ((t.stateNode = a), (Cl = t), (ml = bt(a.firstChild)), (gt = !1), (u = !0))
                : (u = !1)),
            u || te(t)),
          Na(t),
          (u = t.type),
          (n = t.pendingProps),
          (i = l !== null ? l.memoizedProps : null),
          (a = n.children),
          wc(u, n) ? (a = null) : i !== null && wc(u, i) && (t.flags |= 32),
          t.memoizedState !== null && ((u = Ji(l, t, Jm, null, null, e)), (vu._currentValue = u)),
          dn(l, t),
          Bl(l, t, a, e),
          t.child
        );
      case 6:
        return (
          l === null &&
            I &&
            ((l = e = ml) &&
              ((e = Uh(e, t.pendingProps, gt)),
              e !== null ? ((t.stateNode = e), (Cl = t), (ml = null), (l = !0)) : (l = !1)),
            l || te(t)),
          null
        );
      case 13:
        return Xd(l, t, e);
      case 4:
        return (
          Zl(t, t.stateNode.containerInfo),
          (a = t.pendingProps),
          l === null ? (t.child = qe(t, null, a, e)) : Bl(l, t, a, e),
          t.child
        );
      case 11:
        return Ud(l, t, t.type, t.pendingProps, e);
      case 7:
        return (Bl(l, t, t.pendingProps, e), t.child);
      case 8:
        return (Bl(l, t, t.pendingProps.children, e), t.child);
      case 12:
        return (Bl(l, t, t.pendingProps.children, e), t.child);
      case 10:
        return ((a = t.pendingProps), ee(t, t.type, a.value), Bl(l, t, a.children, e), t.child);
      case 9:
        return (
          (u = t.type._context),
          (a = t.pendingProps.children),
          Ue(t),
          (u = ql(u)),
          (a = a(u)),
          (t.flags |= 1),
          Bl(l, t, a, e),
          t.child
        );
      case 14:
        return Rd(l, t, t.type, t.pendingProps, e);
      case 15:
        return Hd(l, t, t.type, t.pendingProps, e);
      case 19:
        return Ld(l, t, e);
      case 31:
        return lh(l, t, e);
      case 22:
        return Cd(l, t, e, t.pendingProps);
      case 24:
        return (
          Ue(t),
          (a = ql(El)),
          l === null
            ? ((u = qi()),
              u === null &&
                ((u = ol),
                (n = Hi()),
                (u.pooledCache = n),
                n.refCount++,
                n !== null && (u.pooledCacheLanes |= e),
                (u = n)),
              (t.memoizedState = { parent: a, cache: u }),
              Yi(t),
              ee(t, El, u))
            : ((l.lanes & e) !== 0 && (Gi(l, t), Wa(t, null, null, e), ka()),
              (u = l.memoizedState),
              (n = t.memoizedState),
              u.parent !== a
                ? ((u = { parent: a, cache: a }),
                  (t.memoizedState = u),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u),
                  ee(t, El, a))
                : ((a = n.cache), ee(t, El, a), a !== u.cache && Ri(t, [El], e, !0))),
          Bl(l, t, t.pendingProps.children, e),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(m(156, t.tag));
  }
  function Zt(l) {
    l.flags |= 4;
  }
  function pc(l, t, e, a, u) {
    if (((t = (l.mode & 32) !== 0) && (t = !1), t)) {
      if (((l.flags |= 16777216), (u & 335544128) === u))
        if (l.stateNode.complete) l.flags |= 8192;
        else if (xo()) l.flags |= 8192;
        else throw ((Ce = ku), Bi);
    } else l.flags &= -16777217;
  }
  function Kd(l, t) {
    if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) l.flags &= -16777217;
    else if (((l.flags |= 16777216), !cr(t)))
      if (xo()) l.flags |= 8192;
      else throw ((Ce = ku), Bi);
  }
  function rn(l, t) {
    (t !== null && (l.flags |= 4),
      l.flags & 16384 && ((t = l.tag !== 22 ? Tf() : 536870912), (l.lanes |= t), (ga |= t)));
  }
  function tu(l, t) {
    if (!I)
      switch (l.tailMode) {
        case 'hidden':
          t = l.tail;
          for (var e = null; t !== null; ) (t.alternate !== null && (e = t), (t = t.sibling));
          e === null ? (l.tail = null) : (e.sibling = null);
          break;
        case 'collapsed':
          e = l.tail;
          for (var a = null; e !== null; ) (e.alternate !== null && (a = e), (e = e.sibling));
          a === null
            ? t || l.tail === null
              ? (l.tail = null)
              : (l.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function hl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child,
      e = 0,
      a = 0;
    if (t)
      for (var u = l.child; u !== null; )
        ((e |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags & 65011712),
          (a |= u.flags & 65011712),
          (u.return = l),
          (u = u.sibling));
    else
      for (u = l.child; u !== null; )
        ((e |= u.lanes | u.childLanes),
          (a |= u.subtreeFlags),
          (a |= u.flags),
          (u.return = l),
          (u = u.sibling));
    return ((l.subtreeFlags |= a), (l.childLanes = e), t);
  }
  function eh(l, t, e) {
    var a = t.pendingProps;
    switch ((_i(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (hl(t), null);
      case 1:
        return (hl(t), null);
      case 3:
        return (
          (e = t.stateNode),
          (a = null),
          l !== null && (a = l.memoizedState.cache),
          t.memoizedState.cache !== a && (t.flags |= 2048),
          Yt(El),
          pl(),
          e.pendingContext && ((e.context = e.pendingContext), (e.pendingContext = null)),
          (l === null || l.child === null) &&
            (ua(t)
              ? Zt(t)
              : l === null ||
                (l.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Oi())),
          hl(t),
          null
        );
      case 26:
        var u = t.type,
          n = t.memoizedState;
        return (
          l === null
            ? (Zt(t), n !== null ? (hl(t), Kd(t, n)) : (hl(t), pc(t, u, null, a, e)))
            : n
              ? n !== l.memoizedState
                ? (Zt(t), hl(t), Kd(t, n))
                : (hl(t), (t.flags &= -16777217))
              : ((l = l.memoizedProps), l !== a && Zt(t), hl(t), pc(t, u, l, a, e)),
          null
        );
      case 27:
        if ((zu(t), (e = J.current), (u = t.type), l !== null && t.stateNode != null))
          l.memoizedProps !== a && Zt(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(m(166));
            return (hl(t), null);
          }
          ((l = O.current), ua(t) ? Ts(t) : ((l = Po(u, a, e)), (t.stateNode = l), Zt(t)));
        }
        return (hl(t), null);
      case 5:
        if ((zu(t), (u = t.type), l !== null && t.stateNode != null))
          l.memoizedProps !== a && Zt(t);
        else {
          if (!a) {
            if (t.stateNode === null) throw Error(m(166));
            return (hl(t), null);
          }
          if (((n = O.current), ua(t))) Ts(t);
          else {
            var i = An(J.current);
            switch (n) {
              case 1:
                n = i.createElementNS('http://www.w3.org/2000/svg', u);
                break;
              case 2:
                n = i.createElementNS('http://www.w3.org/1998/Math/MathML', u);
                break;
              default:
                switch (u) {
                  case 'svg':
                    n = i.createElementNS('http://www.w3.org/2000/svg', u);
                    break;
                  case 'math':
                    n = i.createElementNS('http://www.w3.org/1998/Math/MathML', u);
                    break;
                  case 'script':
                    ((n = i.createElement('div')),
                      (n.innerHTML = '<script><\/script>'),
                      (n = n.removeChild(n.firstChild)));
                    break;
                  case 'select':
                    ((n =
                      typeof a.is == 'string'
                        ? i.createElement('select', { is: a.is })
                        : i.createElement('select')),
                      a.multiple ? (n.multiple = !0) : a.size && (n.size = a.size));
                    break;
                  default:
                    n =
                      typeof a.is == 'string'
                        ? i.createElement(u, { is: a.is })
                        : i.createElement(u);
                }
            }
            ((n[Hl] = t), (n[wl] = a));
            l: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6) n.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                ((i.child.return = i), (i = i.child));
                continue;
              }
              if (i === t) break l;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t) break l;
                i = i.return;
              }
              ((i.sibling.return = i.return), (i = i.sibling));
            }
            t.stateNode = n;
            l: switch ((Yl(n, u, a), u)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                a = !!a.autoFocus;
                break l;
              case 'img':
                a = !0;
                break l;
              default:
                a = !1;
            }
            a && Zt(t);
          }
        }
        return (hl(t), pc(t, t.type, l === null ? null : l.memoizedProps, t.pendingProps, e), null);
      case 6:
        if (l && t.stateNode != null) l.memoizedProps !== a && Zt(t);
        else {
          if (typeof a != 'string' && t.stateNode === null) throw Error(m(166));
          if (((l = J.current), ua(t))) {
            if (((l = t.stateNode), (e = t.memoizedProps), (a = null), (u = Cl), u !== null))
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            ((l[Hl] = t),
              (l = !!(
                l.nodeValue === e ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                Zo(l.nodeValue, e)
              )),
              l || te(t, !0));
          } else ((l = An(l).createTextNode(a)), (l[Hl] = t), (t.stateNode = l));
        }
        return (hl(t), null);
      case 31:
        if (((e = t.memoizedState), l === null || l.memoizedState !== null)) {
          if (((a = ua(t)), e !== null)) {
            if (l === null) {
              if (!a) throw Error(m(318));
              if (((l = t.memoizedState), (l = l !== null ? l.dehydrated : null), !l))
                throw Error(m(557));
              l[Hl] = t;
            } else (Oe(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (hl(t), (l = !1));
          } else
            ((e = Oi()),
              l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e),
              (l = !0));
          if (!l) return t.flags & 256 ? (it(t), t) : (it(t), null);
          if ((t.flags & 128) !== 0) throw Error(m(558));
        }
        return (hl(t), null);
      case 13:
        if (
          ((a = t.memoizedState),
          l === null || (l.memoizedState !== null && l.memoizedState.dehydrated !== null))
        ) {
          if (((u = ua(t)), a !== null && a.dehydrated !== null)) {
            if (l === null) {
              if (!u) throw Error(m(318));
              if (((u = t.memoizedState), (u = u !== null ? u.dehydrated : null), !u))
                throw Error(m(317));
              u[Hl] = t;
            } else (Oe(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (hl(t), (u = !1));
          } else
            ((u = Oi()),
              l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u),
              (u = !0));
          if (!u) return t.flags & 256 ? (it(t), t) : (it(t), null);
        }
        return (
          it(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = e), t)
            : ((e = a !== null),
              (l = l !== null && l.memoizedState !== null),
              e &&
                ((a = t.child),
                (u = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (u = a.alternate.memoizedState.cachePool.pool),
                (n = null),
                a.memoizedState !== null &&
                  a.memoizedState.cachePool !== null &&
                  (n = a.memoizedState.cachePool.pool),
                n !== u && (a.flags |= 2048)),
              e !== l && e && (t.child.flags |= 8192),
              rn(t, t.updateQueue),
              hl(t),
              null)
        );
      case 4:
        return (pl(), l === null && Zc(t.stateNode.containerInfo), hl(t), null);
      case 10:
        return (Yt(t.type), hl(t), null);
      case 19:
        if ((j(Sl), (a = t.memoizedState), a === null)) return (hl(t), null);
        if (((u = (t.flags & 128) !== 0), (n = a.rendering), n === null))
          if (u) tu(a, !1);
          else {
            if (gl !== 0 || (l !== null && (l.flags & 128) !== 0))
              for (l = t.child; l !== null; ) {
                if (((n = Iu(l)), n !== null)) {
                  for (
                    t.flags |= 128,
                      tu(a, !1),
                      l = n.updateQueue,
                      t.updateQueue = l,
                      rn(t, l),
                      t.subtreeFlags = 0,
                      l = e,
                      e = t.child;
                    e !== null;
                  )
                    (bs(e, l), (e = e.sibling));
                  return (A(Sl, (Sl.current & 1) | 2), I && qt(t, a.treeForkCount), t.child);
                }
                l = l.sibling;
              }
            a.tail !== null &&
              lt() > gn &&
              ((t.flags |= 128), (u = !0), tu(a, !1), (t.lanes = 4194304));
          }
        else {
          if (!u)
            if (((l = Iu(n)), l !== null)) {
              if (
                ((t.flags |= 128),
                (u = !0),
                (l = l.updateQueue),
                (t.updateQueue = l),
                rn(t, l),
                tu(a, !0),
                a.tail === null && a.tailMode === 'hidden' && !n.alternate && !I)
              )
                return (hl(t), null);
            } else
              2 * lt() - a.renderingStartTime > gn &&
                e !== 536870912 &&
                ((t.flags |= 128), (u = !0), tu(a, !1), (t.lanes = 4194304));
          a.isBackwards
            ? ((n.sibling = t.child), (t.child = n))
            : ((l = a.last), l !== null ? (l.sibling = n) : (t.child = n), (a.last = n));
        }
        return a.tail !== null
          ? ((l = a.tail),
            (a.rendering = l),
            (a.tail = l.sibling),
            (a.renderingStartTime = lt()),
            (l.sibling = null),
            (e = Sl.current),
            A(Sl, u ? (e & 1) | 2 : e & 1),
            I && qt(t, a.treeForkCount),
            l)
          : (hl(t), null);
      case 22:
      case 23:
        return (
          it(t),
          Li(),
          (a = t.memoizedState !== null),
          l !== null
            ? (l.memoizedState !== null) !== a && (t.flags |= 8192)
            : a && (t.flags |= 8192),
          a
            ? (e & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (hl(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : hl(t),
          (e = t.updateQueue),
          e !== null && rn(t, e.retryQueue),
          (e = null),
          l !== null &&
            l.memoizedState !== null &&
            l.memoizedState.cachePool !== null &&
            (e = l.memoizedState.cachePool.pool),
          (a = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (a = t.memoizedState.cachePool.pool),
          a !== e && (t.flags |= 2048),
          l !== null && j(Re),
          null
        );
      case 24:
        return (
          (e = null),
          l !== null && (e = l.memoizedState.cache),
          t.memoizedState.cache !== e && (t.flags |= 2048),
          Yt(El),
          hl(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(m(156, t.tag));
  }
  function ah(l, t) {
    switch ((_i(t), t.tag)) {
      case 1:
        return ((l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null);
      case 3:
        return (
          Yt(El),
          pl(),
          (l = t.flags),
          (l & 65536) !== 0 && (l & 128) === 0 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (zu(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((it(t), t.alternate === null)) throw Error(m(340));
          Oe();
        }
        return ((l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null);
      case 13:
        if ((it(t), (l = t.memoizedState), l !== null && l.dehydrated !== null)) {
          if (t.alternate === null) throw Error(m(340));
          Oe();
        }
        return ((l = t.flags), l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null);
      case 19:
        return (j(Sl), null);
      case 4:
        return (pl(), null);
      case 10:
        return (Yt(t.type), null);
      case 22:
      case 23:
        return (
          it(t),
          Li(),
          l !== null && j(Re),
          (l = t.flags),
          l & 65536 ? ((t.flags = (l & -65537) | 128), t) : null
        );
      case 24:
        return (Yt(El), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Jd(l, t) {
    switch ((_i(t), t.tag)) {
      case 3:
        (Yt(El), pl());
        break;
      case 26:
      case 27:
      case 5:
        zu(t);
        break;
      case 4:
        pl();
        break;
      case 31:
        t.memoizedState !== null && it(t);
        break;
      case 13:
        it(t);
        break;
      case 19:
        j(Sl);
        break;
      case 10:
        Yt(t.type);
        break;
      case 22:
      case 23:
        (it(t), Li(), l !== null && j(Re));
        break;
      case 24:
        Yt(El);
    }
  }
  function eu(l, t) {
    try {
      var e = t.updateQueue,
        a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        e = u;
        do {
          if ((e.tag & l) === l) {
            a = void 0;
            var n = e.create,
              i = e.inst;
            ((a = n()), (i.destroy = a));
          }
          e = e.next;
        } while (e !== u);
      }
    } catch (c) {
      ul(t, t.return, c);
    }
  }
  function fe(l, t, e) {
    try {
      var a = t.updateQueue,
        u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var n = u.next;
        a = n;
        do {
          if ((a.tag & l) === l) {
            var i = a.inst,
              c = i.destroy;
            if (c !== void 0) {
              ((i.destroy = void 0), (u = t));
              var s = e,
                v = c;
              try {
                v();
              } catch (x) {
                ul(u, s, x);
              }
            }
          }
          a = a.next;
        } while (a !== n);
      }
    } catch (x) {
      ul(t, t.return, x);
    }
  }
  function wd(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        Bs(t, e);
      } catch (a) {
        ul(l, l.return, a);
      }
    }
  }
  function kd(l, t, e) {
    ((e.props = Ye(l.type, l.memoizedProps)), (e.state = l.memoizedState));
    try {
      e.componentWillUnmount();
    } catch (a) {
      ul(l, t, a);
    }
  }
  function au(l, t) {
    try {
      var e = l.ref;
      if (e !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof e == 'function' ? (l.refCleanup = e(a)) : (e.current = a);
      }
    } catch (u) {
      ul(l, t, u);
    }
  }
  function Mt(l, t) {
    var e = l.ref,
      a = l.refCleanup;
    if (e !== null)
      if (typeof a == 'function')
        try {
          a();
        } catch (u) {
          ul(l, t, u);
        } finally {
          ((l.refCleanup = null), (l = l.alternate), l != null && (l.refCleanup = null));
        }
      else if (typeof e == 'function')
        try {
          e(null);
        } catch (u) {
          ul(l, t, u);
        }
      else e.current = null;
  }
  function Wd(l) {
    var t = l.type,
      e = l.memoizedProps,
      a = l.stateNode;
    try {
      l: switch (t) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          e.autoFocus && a.focus();
          break l;
        case 'img':
          e.src ? (a.src = e.src) : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (u) {
      ul(l, l.return, u);
    }
  }
  function Sc(l, t, e) {
    try {
      var a = l.stateNode;
      (Eh(a, l.type, e, t), (a[wl] = t));
    } catch (u) {
      ul(l, l.return, u);
    }
  }
  function $d(l) {
    return (
      l.tag === 5 || l.tag === 3 || l.tag === 26 || (l.tag === 27 && ve(l.type)) || l.tag === 4
    );
  }
  function zc(l) {
    l: for (;;) {
      for (; l.sibling === null; ) {
        if (l.return === null || $d(l.return)) return null;
        l = l.return;
      }
      for (
        l.sibling.return = l.return, l = l.sibling;
        l.tag !== 5 && l.tag !== 6 && l.tag !== 18;
      ) {
        if ((l.tag === 27 && ve(l.type)) || l.flags & 2 || l.child === null || l.tag === 4)
          continue l;
        ((l.child.return = l), (l = l.child));
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function jc(l, t, e) {
    var a = l.tag;
    if (a === 5 || a === 6)
      ((l = l.stateNode),
        t
          ? (e.nodeType === 9
              ? e.body
              : e.nodeName === 'HTML'
                ? e.ownerDocument.body
                : e
            ).insertBefore(l, t)
          : ((t = e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e),
            t.appendChild(l),
            (e = e._reactRootContainer),
            e != null || t.onclick !== null || (t.onclick = Rt)));
    else if (
      a !== 4 &&
      (a === 27 && ve(l.type) && ((e = l.stateNode), (t = null)), (l = l.child), l !== null)
    )
      for (jc(l, t, e), l = l.sibling; l !== null; ) (jc(l, t, e), (l = l.sibling));
  }
  function mn(l, t, e) {
    var a = l.tag;
    if (a === 5 || a === 6) ((l = l.stateNode), t ? e.insertBefore(l, t) : e.appendChild(l));
    else if (a !== 4 && (a === 27 && ve(l.type) && (e = l.stateNode), (l = l.child), l !== null))
      for (mn(l, t, e), l = l.sibling; l !== null; ) (mn(l, t, e), (l = l.sibling));
  }
  function Fd(l) {
    var t = l.stateNode,
      e = l.memoizedProps;
    try {
      for (var a = l.type, u = t.attributes; u.length; ) t.removeAttributeNode(u[0]);
      (Yl(t, a, e), (t[Hl] = l), (t[wl] = e));
    } catch (n) {
      ul(l, l.return, n);
    }
  }
  var Lt = !1,
    _l = !1,
    Tc = !1,
    Id = typeof WeakSet == 'function' ? WeakSet : Set,
    Ul = null;
  function uh(l, t) {
    if (((l = l.containerInfo), (Kc = Hn), (l = ds(l)), gi(l))) {
      if ('selectionStart' in l) var e = { start: l.selectionStart, end: l.selectionEnd };
      else
        l: {
          e = ((e = l.ownerDocument) && e.defaultView) || window;
          var a = e.getSelection && e.getSelection();
          if (a && a.rangeCount !== 0) {
            e = a.anchorNode;
            var u = a.anchorOffset,
              n = a.focusNode;
            a = a.focusOffset;
            try {
              (e.nodeType, n.nodeType);
            } catch {
              e = null;
              break l;
            }
            var i = 0,
              c = -1,
              s = -1,
              v = 0,
              x = 0,
              S = l,
              y = null;
            t: for (;;) {
              for (
                var g;
                S !== e || (u !== 0 && S.nodeType !== 3) || (c = i + u),
                  S !== n || (a !== 0 && S.nodeType !== 3) || (s = i + a),
                  S.nodeType === 3 && (i += S.nodeValue.length),
                  (g = S.firstChild) !== null;
              )
                ((y = S), (S = g));
              for (;;) {
                if (S === l) break t;
                if (
                  (y === e && ++v === u && (c = i),
                  y === n && ++x === a && (s = i),
                  (g = S.nextSibling) !== null)
                )
                  break;
                ((S = y), (y = S.parentNode));
              }
              S = g;
            }
            e = c === -1 || s === -1 ? null : { start: c, end: s };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (Jc = { focusedElem: l, selectionRange: e }, Hn = !1, Ul = t; Ul !== null; )
      if (((t = Ul), (l = t.child), (t.subtreeFlags & 1028) !== 0 && l !== null))
        ((l.return = t), (Ul = l));
      else
        for (; Ul !== null; ) {
          switch (((t = Ul), (n = t.alternate), (l = t.flags), t.tag)) {
            case 0:
              if (
                (l & 4) !== 0 &&
                ((l = t.updateQueue), (l = l !== null ? l.events : null), l !== null)
              )
                for (e = 0; e < l.length; e++) ((u = l[e]), (u.ref.impl = u.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                ((l = void 0),
                  (e = t),
                  (u = n.memoizedProps),
                  (n = n.memoizedState),
                  (a = e.stateNode));
                try {
                  var M = Ye(e.type, u);
                  ((l = a.getSnapshotBeforeUpdate(M, n)),
                    (a.__reactInternalSnapshotBeforeUpdate = l));
                } catch (H) {
                  ul(e, e.return, H);
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (((l = t.stateNode.containerInfo), (e = l.nodeType), e === 9)) Wc(l);
                else if (e === 1)
                  switch (l.nodeName) {
                    case 'HEAD':
                    case 'HTML':
                    case 'BODY':
                      Wc(l);
                      break;
                    default:
                      l.textContent = '';
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((l & 1024) !== 0) throw Error(m(163));
          }
          if (((l = t.sibling), l !== null)) {
            ((l.return = t.return), (Ul = l));
            break;
          }
          Ul = t.return;
        }
  }
  function Pd(l, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Kt(l, e), a & 4 && eu(5, e));
        break;
      case 1:
        if ((Kt(l, e), a & 4))
          if (((l = e.stateNode), t === null))
            try {
              l.componentDidMount();
            } catch (i) {
              ul(e, e.return, i);
            }
          else {
            var u = Ye(e.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              l.componentDidUpdate(u, t, l.__reactInternalSnapshotBeforeUpdate);
            } catch (i) {
              ul(e, e.return, i);
            }
          }
        (a & 64 && wd(e), a & 512 && au(e, e.return));
        break;
      case 3:
        if ((Kt(l, e), a & 64 && ((l = e.updateQueue), l !== null))) {
          if (((t = null), e.child !== null))
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            Bs(l, t);
          } catch (i) {
            ul(e, e.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Fd(e);
      case 26:
      case 5:
        (Kt(l, e), t === null && a & 4 && Wd(e), a & 512 && au(e, e.return));
        break;
      case 12:
        Kt(l, e);
        break;
      case 31:
        (Kt(l, e), a & 4 && eo(l, e));
        break;
      case 13:
        (Kt(l, e),
          a & 4 && ao(l, e),
          a & 64 &&
            ((l = e.memoizedState),
            l !== null && ((l = l.dehydrated), l !== null && ((e = mh.bind(null, e)), Rh(l, e)))));
        break;
      case 22:
        if (((a = e.memoizedState !== null || Lt), !a)) {
          ((t = (t !== null && t.memoizedState !== null) || _l), (u = Lt));
          var n = _l;
          ((Lt = a),
            (_l = t) && !n ? Jt(l, e, (e.subtreeFlags & 8772) !== 0) : Kt(l, e),
            (Lt = u),
            (_l = n));
        }
        break;
      case 30:
        break;
      default:
        Kt(l, e);
    }
  }
  function lo(l) {
    var t = l.alternate;
    (t !== null && ((l.alternate = null), lo(t)),
      (l.child = null),
      (l.deletions = null),
      (l.sibling = null),
      l.tag === 5 && ((t = l.stateNode), t !== null && li(t)),
      (l.stateNode = null),
      (l.return = null),
      (l.dependencies = null),
      (l.memoizedProps = null),
      (l.memoizedState = null),
      (l.pendingProps = null),
      (l.stateNode = null),
      (l.updateQueue = null));
  }
  var vl = null,
    Wl = !1;
  function Vt(l, t, e) {
    for (e = e.child; e !== null; ) (to(l, t, e), (e = e.sibling));
  }
  function to(l, t, e) {
    if (tt && typeof tt.onCommitFiberUnmount == 'function')
      try {
        tt.onCommitFiberUnmount(Aa, e);
      } catch {}
    switch (e.tag) {
      case 26:
        (_l || Mt(e, t),
          Vt(l, t, e),
          e.memoizedState
            ? e.memoizedState.count--
            : e.stateNode && ((e = e.stateNode), e.parentNode.removeChild(e)));
        break;
      case 27:
        _l || Mt(e, t);
        var a = vl,
          u = Wl;
        (ve(e.type) && ((vl = e.stateNode), (Wl = !1)),
          Vt(l, t, e),
          ru(e.stateNode),
          (vl = a),
          (Wl = u));
        break;
      case 5:
        _l || Mt(e, t);
      case 6:
        if (((a = vl), (u = Wl), (vl = null), Vt(l, t, e), (vl = a), (Wl = u), vl !== null))
          if (Wl)
            try {
              (vl.nodeType === 9
                ? vl.body
                : vl.nodeName === 'HTML'
                  ? vl.ownerDocument.body
                  : vl
              ).removeChild(e.stateNode);
            } catch (n) {
              ul(e, t, n);
            }
          else
            try {
              vl.removeChild(e.stateNode);
            } catch (n) {
              ul(e, t, n);
            }
        break;
      case 18:
        vl !== null &&
          (Wl
            ? ((l = vl),
              ko(
                l.nodeType === 9 ? l.body : l.nodeName === 'HTML' ? l.ownerDocument.body : l,
                e.stateNode
              ),
              Ea(l))
            : ko(vl, e.stateNode));
        break;
      case 4:
        ((a = vl),
          (u = Wl),
          (vl = e.stateNode.containerInfo),
          (Wl = !0),
          Vt(l, t, e),
          (vl = a),
          (Wl = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (fe(2, e, t), _l || fe(4, e, t), Vt(l, t, e));
        break;
      case 1:
        (_l ||
          (Mt(e, t), (a = e.stateNode), typeof a.componentWillUnmount == 'function' && kd(e, t, a)),
          Vt(l, t, e));
        break;
      case 21:
        Vt(l, t, e);
        break;
      case 22:
        ((_l = (a = _l) || e.memoizedState !== null), Vt(l, t, e), (_l = a));
        break;
      default:
        Vt(l, t, e);
    }
  }
  function eo(l, t) {
    if (
      t.memoizedState === null &&
      ((l = t.alternate), l !== null && ((l = l.memoizedState), l !== null))
    ) {
      l = l.dehydrated;
      try {
        Ea(l);
      } catch (e) {
        ul(t, t.return, e);
      }
    }
  }
  function ao(l, t) {
    if (
      t.memoizedState === null &&
      ((l = t.alternate),
      l !== null && ((l = l.memoizedState), l !== null && ((l = l.dehydrated), l !== null)))
    )
      try {
        Ea(l);
      } catch (e) {
        ul(t, t.return, e);
      }
  }
  function nh(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return (t === null && (t = l.stateNode = new Id()), t);
      case 22:
        return (
          (l = l.stateNode),
          (t = l._retryCache),
          t === null && (t = l._retryCache = new Id()),
          t
        );
      default:
        throw Error(m(435, l.tag));
    }
  }
  function hn(l, t) {
    var e = nh(l);
    t.forEach(function (a) {
      if (!e.has(a)) {
        e.add(a);
        var u = hh.bind(null, l, a);
        a.then(u, u);
      }
    });
  }
  function $l(l, t) {
    var e = t.deletions;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var u = e[a],
          n = l,
          i = t,
          c = i;
        l: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (ve(c.type)) {
                ((vl = c.stateNode), (Wl = !1));
                break l;
              }
              break;
            case 5:
              ((vl = c.stateNode), (Wl = !1));
              break l;
            case 3:
            case 4:
              ((vl = c.stateNode.containerInfo), (Wl = !0));
              break l;
          }
          c = c.return;
        }
        if (vl === null) throw Error(m(160));
        (to(n, i, u),
          (vl = null),
          (Wl = !1),
          (n = u.alternate),
          n !== null && (n.return = null),
          (u.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null; ) (uo(t, l), (t = t.sibling));
  }
  var Tt = null;
  function uo(l, t) {
    var e = l.alternate,
      a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ($l(t, l), Fl(l), a & 4 && (fe(3, l, l.return), eu(3, l), fe(5, l, l.return)));
        break;
      case 1:
        ($l(t, l),
          Fl(l),
          a & 512 && (_l || e === null || Mt(e, e.return)),
          a & 64 &&
            Lt &&
            ((l = l.updateQueue),
            l !== null &&
              ((a = l.callbacks),
              a !== null &&
                ((e = l.shared.hiddenCallbacks),
                (l.shared.hiddenCallbacks = e === null ? a : e.concat(a))))));
        break;
      case 26:
        var u = Tt;
        if (($l(t, l), Fl(l), a & 512 && (_l || e === null || Mt(e, e.return)), a & 4)) {
          var n = e !== null ? e.memoizedState : null;
          if (((a = l.memoizedState), e === null))
            if (a === null)
              if (l.stateNode === null) {
                l: {
                  ((a = l.type), (e = l.memoizedProps), (u = u.ownerDocument || u));
                  t: switch (a) {
                    case 'title':
                      ((n = u.getElementsByTagName('title')[0]),
                        (!n ||
                          n[Oa] ||
                          n[Hl] ||
                          n.namespaceURI === 'http://www.w3.org/2000/svg' ||
                          n.hasAttribute('itemprop')) &&
                          ((n = u.createElement(a)),
                          u.head.insertBefore(n, u.querySelector('head > title'))),
                        Yl(n, a, e),
                        (n[Hl] = l),
                        Dl(n),
                        (a = n));
                      break l;
                    case 'link':
                      var i = nr('link', 'href', u).get(a + (e.href || ''));
                      if (i) {
                        for (var c = 0; c < i.length; c++)
                          if (
                            ((n = i[c]),
                            n.getAttribute('href') ===
                              (e.href == null || e.href === '' ? null : e.href) &&
                              n.getAttribute('rel') === (e.rel == null ? null : e.rel) &&
                              n.getAttribute('title') === (e.title == null ? null : e.title) &&
                              n.getAttribute('crossorigin') ===
                                (e.crossOrigin == null ? null : e.crossOrigin))
                          ) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      ((n = u.createElement(a)), Yl(n, a, e), u.head.appendChild(n));
                      break;
                    case 'meta':
                      if ((i = nr('meta', 'content', u).get(a + (e.content || '')))) {
                        for (c = 0; c < i.length; c++)
                          if (
                            ((n = i[c]),
                            n.getAttribute('content') ===
                              (e.content == null ? null : '' + e.content) &&
                              n.getAttribute('name') === (e.name == null ? null : e.name) &&
                              n.getAttribute('property') ===
                                (e.property == null ? null : e.property) &&
                              n.getAttribute('http-equiv') ===
                                (e.httpEquiv == null ? null : e.httpEquiv) &&
                              n.getAttribute('charset') === (e.charSet == null ? null : e.charSet))
                          ) {
                            i.splice(c, 1);
                            break t;
                          }
                      }
                      ((n = u.createElement(a)), Yl(n, a, e), u.head.appendChild(n));
                      break;
                    default:
                      throw Error(m(468, a));
                  }
                  ((n[Hl] = l), Dl(n), (a = n));
                }
                l.stateNode = a;
              } else ir(u, l.type, l.stateNode);
            else l.stateNode = ur(u, a, l.memoizedProps);
          else
            n !== a
              ? (n === null
                  ? e.stateNode !== null && ((e = e.stateNode), e.parentNode.removeChild(e))
                  : n.count--,
                a === null ? ir(u, l.type, l.stateNode) : ur(u, a, l.memoizedProps))
              : a === null && l.stateNode !== null && Sc(l, l.memoizedProps, e.memoizedProps);
        }
        break;
      case 27:
        ($l(t, l),
          Fl(l),
          a & 512 && (_l || e === null || Mt(e, e.return)),
          e !== null && a & 4 && Sc(l, l.memoizedProps, e.memoizedProps));
        break;
      case 5:
        if (($l(t, l), Fl(l), a & 512 && (_l || e === null || Mt(e, e.return)), l.flags & 32)) {
          u = l.stateNode;
          try {
            ke(u, '');
          } catch (M) {
            ul(l, l.return, M);
          }
        }
        (a & 4 &&
          l.stateNode != null &&
          ((u = l.memoizedProps), Sc(l, u, e !== null ? e.memoizedProps : u)),
          a & 1024 && (Tc = !0));
        break;
      case 6:
        if (($l(t, l), Fl(l), a & 4)) {
          if (l.stateNode === null) throw Error(m(162));
          ((a = l.memoizedProps), (e = l.stateNode));
          try {
            e.nodeValue = a;
          } catch (M) {
            ul(l, l.return, M);
          }
        }
        break;
      case 3:
        if (
          ((On = null),
          (u = Tt),
          (Tt = _n(t.containerInfo)),
          $l(t, l),
          (Tt = u),
          Fl(l),
          a & 4 && e !== null && e.memoizedState.isDehydrated)
        )
          try {
            Ea(t.containerInfo);
          } catch (M) {
            ul(l, l.return, M);
          }
        Tc && ((Tc = !1), no(l));
        break;
      case 4:
        ((a = Tt), (Tt = _n(l.stateNode.containerInfo)), $l(t, l), Fl(l), (Tt = a));
        break;
      case 12:
        ($l(t, l), Fl(l));
        break;
      case 31:
        ($l(t, l),
          Fl(l),
          a & 4 && ((a = l.updateQueue), a !== null && ((l.updateQueue = null), hn(l, a))));
        break;
      case 13:
        ($l(t, l),
          Fl(l),
          l.child.flags & 8192 &&
            (l.memoizedState !== null) != (e !== null && e.memoizedState !== null) &&
            (yn = lt()),
          a & 4 && ((a = l.updateQueue), a !== null && ((l.updateQueue = null), hn(l, a))));
        break;
      case 22:
        u = l.memoizedState !== null;
        var s = e !== null && e.memoizedState !== null,
          v = Lt,
          x = _l;
        if (((Lt = v || u), (_l = x || s), $l(t, l), (_l = x), (Lt = v), Fl(l), a & 8192))
          l: for (
            t = l.stateNode,
              t._visibility = u ? t._visibility & -2 : t._visibility | 1,
              u && (e === null || s || Lt || _l || Ge(l)),
              e = null,
              t = l;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (e === null) {
                s = e = t;
                try {
                  if (((n = s.stateNode), u))
                    ((i = n.style),
                      typeof i.setProperty == 'function'
                        ? i.setProperty('display', 'none', 'important')
                        : (i.display = 'none'));
                  else {
                    c = s.stateNode;
                    var S = s.memoizedProps.style,
                      y = S != null && S.hasOwnProperty('display') ? S.display : null;
                    c.style.display = y == null || typeof y == 'boolean' ? '' : ('' + y).trim();
                  }
                } catch (M) {
                  ul(s, s.return, M);
                }
              }
            } else if (t.tag === 6) {
              if (e === null) {
                s = t;
                try {
                  s.stateNode.nodeValue = u ? '' : s.memoizedProps;
                } catch (M) {
                  ul(s, s.return, M);
                }
              }
            } else if (t.tag === 18) {
              if (e === null) {
                s = t;
                try {
                  var g = s.stateNode;
                  u ? Wo(g, !0) : Wo(s.stateNode, !1);
                } catch (M) {
                  ul(s, s.return, M);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) || t.memoizedState === null || t === l) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              (e === t && (e = null), (t = t.return));
            }
            (e === t && (e = null), (t.sibling.return = t.return), (t = t.sibling));
          }
        a & 4 &&
          ((a = l.updateQueue),
          a !== null && ((e = a.retryQueue), e !== null && ((a.retryQueue = null), hn(l, e))));
        break;
      case 19:
        ($l(t, l),
          Fl(l),
          a & 4 && ((a = l.updateQueue), a !== null && ((l.updateQueue = null), hn(l, a))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ($l(t, l), Fl(l));
    }
  }
  function Fl(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, a = l.return; a !== null; ) {
          if ($d(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        if (e == null) throw Error(m(160));
        switch (e.tag) {
          case 27:
            var u = e.stateNode,
              n = zc(l);
            mn(l, n, u);
            break;
          case 5:
            var i = e.stateNode;
            e.flags & 32 && (ke(i, ''), (e.flags &= -33));
            var c = zc(l);
            mn(l, c, i);
            break;
          case 3:
          case 4:
            var s = e.stateNode.containerInfo,
              v = zc(l);
            jc(l, v, s);
            break;
          default:
            throw Error(m(161));
        }
      } catch (x) {
        ul(l, l.return, x);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function no(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        (no(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), (l = l.sibling));
      }
  }
  function Kt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) (Pd(l, t.alternate, t), (t = t.sibling));
  }
  function Ge(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (fe(4, t, t.return), Ge(t));
          break;
        case 1:
          Mt(t, t.return);
          var e = t.stateNode;
          (typeof e.componentWillUnmount == 'function' && kd(t, t.return, e), Ge(t));
          break;
        case 27:
          ru(t.stateNode);
        case 26:
        case 5:
          (Mt(t, t.return), Ge(t));
          break;
        case 22:
          t.memoizedState === null && Ge(t);
          break;
        case 30:
          Ge(t);
          break;
        default:
          Ge(t);
      }
      l = l.sibling;
    }
  }
  function Jt(l, t, e) {
    for (e = e && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate,
        u = l,
        n = t,
        i = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          (Jt(u, n, e), eu(4, n));
          break;
        case 1:
          if ((Jt(u, n, e), (a = n), (u = a.stateNode), typeof u.componentDidMount == 'function'))
            try {
              u.componentDidMount();
            } catch (v) {
              ul(a, a.return, v);
            }
          if (((a = n), (u = a.updateQueue), u !== null)) {
            var c = a.stateNode;
            try {
              var s = u.shared.hiddenCallbacks;
              if (s !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < s.length; u++) qs(s[u], c);
            } catch (v) {
              ul(a, a.return, v);
            }
          }
          (e && i & 64 && wd(n), au(n, n.return));
          break;
        case 27:
          Fd(n);
        case 26:
        case 5:
          (Jt(u, n, e), e && a === null && i & 4 && Wd(n), au(n, n.return));
          break;
        case 12:
          Jt(u, n, e);
          break;
        case 31:
          (Jt(u, n, e), e && i & 4 && eo(u, n));
          break;
        case 13:
          (Jt(u, n, e), e && i & 4 && ao(u, n));
          break;
        case 22:
          (n.memoizedState === null && Jt(u, n, e), au(n, n.return));
          break;
        case 30:
          break;
        default:
          Jt(u, n, e);
      }
      t = t.sibling;
    }
  }
  function Ec(l, t) {
    var e = null;
    (l !== null &&
      l.memoizedState !== null &&
      l.memoizedState.cachePool !== null &&
      (e = l.memoizedState.cachePool.pool),
      (l = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (l = t.memoizedState.cachePool.pool),
      l !== e && (l != null && l.refCount++, e != null && La(e)));
  }
  function Nc(l, t) {
    ((l = null),
      t.alternate !== null && (l = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== l && (t.refCount++, l != null && La(l)));
  }
  function Et(l, t, e, a) {
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) (io(l, t, e, a), (t = t.sibling));
  }
  function io(l, t, e, a) {
    var u = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (Et(l, t, e, a), u & 2048 && eu(9, t));
        break;
      case 1:
        Et(l, t, e, a);
        break;
      case 3:
        (Et(l, t, e, a),
          u & 2048 &&
            ((l = null),
            t.alternate !== null && (l = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== l && (t.refCount++, l != null && La(l))));
        break;
      case 12:
        if (u & 2048) {
          (Et(l, t, e, a), (l = t.stateNode));
          try {
            var n = t.memoizedProps,
              i = n.id,
              c = n.onPostCommit;
            typeof c == 'function' &&
              c(i, t.alternate === null ? 'mount' : 'update', l.passiveEffectDuration, -0);
          } catch (s) {
            ul(t, t.return, s);
          }
        } else Et(l, t, e, a);
        break;
      case 31:
        Et(l, t, e, a);
        break;
      case 13:
        Et(l, t, e, a);
        break;
      case 23:
        break;
      case 22:
        ((n = t.stateNode),
          (i = t.alternate),
          t.memoizedState !== null
            ? n._visibility & 2
              ? Et(l, t, e, a)
              : uu(l, t)
            : n._visibility & 2
              ? Et(l, t, e, a)
              : ((n._visibility |= 2), ha(l, t, e, a, (t.subtreeFlags & 10256) !== 0 || !1)),
          u & 2048 && Ec(i, t));
        break;
      case 24:
        (Et(l, t, e, a), u & 2048 && Nc(t.alternate, t));
        break;
      default:
        Et(l, t, e, a);
    }
  }
  function ha(l, t, e, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l,
        i = t,
        c = e,
        s = a,
        v = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (ha(n, i, c, s, u), eu(8, i));
          break;
        case 23:
          break;
        case 22:
          var x = i.stateNode;
          (i.memoizedState !== null
            ? x._visibility & 2
              ? ha(n, i, c, s, u)
              : uu(n, i)
            : ((x._visibility |= 2), ha(n, i, c, s, u)),
            u && v & 2048 && Ec(i.alternate, i));
          break;
        case 24:
          (ha(n, i, c, s, u), u && v & 2048 && Nc(i.alternate, i));
          break;
        default:
          ha(n, i, c, s, u);
      }
      t = t.sibling;
    }
  }
  function uu(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l,
          a = t,
          u = a.flags;
        switch (a.tag) {
          case 22:
            (uu(e, a), u & 2048 && Ec(a.alternate, a));
            break;
          case 24:
            (uu(e, a), u & 2048 && Nc(a.alternate, a));
            break;
          default:
            uu(e, a);
        }
        t = t.sibling;
      }
  }
  var nu = 8192;
  function va(l, t, e) {
    if (l.subtreeFlags & nu) for (l = l.child; l !== null; ) (co(l, t, e), (l = l.sibling));
  }
  function co(l, t, e) {
    switch (l.tag) {
      case 26:
        (va(l, t, e),
          l.flags & nu && l.memoizedState !== null && Kh(e, Tt, l.memoizedState, l.memoizedProps));
        break;
      case 5:
        va(l, t, e);
        break;
      case 3:
      case 4:
        var a = Tt;
        ((Tt = _n(l.stateNode.containerInfo)), va(l, t, e), (Tt = a));
        break;
      case 22:
        l.memoizedState === null &&
          ((a = l.alternate),
          a !== null && a.memoizedState !== null
            ? ((a = nu), (nu = 16777216), va(l, t, e), (nu = a))
            : va(l, t, e));
        break;
      default:
        va(l, t, e);
    }
  }
  function fo(l) {
    var t = l.alternate;
    if (t !== null && ((l = t.child), l !== null)) {
      t.child = null;
      do ((t = l.sibling), (l.sibling = null), (l = t));
      while (l !== null);
    }
  }
  function iu(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          ((Ul = a), oo(a, l));
        }
      fo(l);
    }
    if (l.subtreeFlags & 10256) for (l = l.child; l !== null; ) (so(l), (l = l.sibling));
  }
  function so(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        (iu(l), l.flags & 2048 && fe(9, l, l.return));
        break;
      case 3:
        iu(l);
        break;
      case 12:
        iu(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13)
          ? ((t._visibility &= -3), vn(l))
          : iu(l);
        break;
      default:
        iu(l);
    }
  }
  function vn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          ((Ul = a), oo(a, l));
        }
      fo(l);
    }
    for (l = l.child; l !== null; ) {
      switch (((t = l), t.tag)) {
        case 0:
        case 11:
        case 15:
          (fe(8, t, t.return), vn(t));
          break;
        case 22:
          ((e = t.stateNode), e._visibility & 2 && ((e._visibility &= -3), vn(t)));
          break;
        default:
          vn(t);
      }
      l = l.sibling;
    }
  }
  function oo(l, t) {
    for (; Ul !== null; ) {
      var e = Ul;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          fe(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          La(e.memoizedState.cache);
      }
      if (((a = e.child), a !== null)) ((a.return = e), (Ul = a));
      else
        l: for (e = l; Ul !== null; ) {
          a = Ul;
          var u = a.sibling,
            n = a.return;
          if ((lo(a), a === e)) {
            Ul = null;
            break l;
          }
          if (u !== null) {
            ((u.return = n), (Ul = u));
            break l;
          }
          Ul = n;
        }
    }
  }
  var ih = {
      getCacheForType: function (l) {
        var t = ql(El),
          e = t.data.get(l);
        return (e === void 0 && ((e = l()), t.data.set(l, e)), e);
      },
      cacheSignal: function () {
        return ql(El).controller.signal;
      },
    },
    ch = typeof WeakMap == 'function' ? WeakMap : Map,
    tl = 0,
    ol = null,
    w = null,
    W = 0,
    al = 0,
    ct = null,
    se = !1,
    ya = !1,
    Ac = !1,
    wt = 0,
    gl = 0,
    de = 0,
    Qe = 0,
    _c = 0,
    ft = 0,
    ga = 0,
    cu = null,
    Il = null,
    Mc = !1,
    yn = 0,
    ro = 0,
    gn = 1 / 0,
    xn = null,
    oe = null,
    Ol = 0,
    re = null,
    xa = null,
    kt = 0,
    Oc = 0,
    Dc = null,
    mo = null,
    fu = 0,
    Uc = null;
  function st() {
    return (tl & 2) !== 0 && W !== 0 ? W & -W : b.T !== null ? Yc() : _f();
  }
  function ho() {
    if (ft === 0)
      if ((W & 536870912) === 0 || I) {
        var l = Eu;
        ((Eu <<= 1), (Eu & 3932160) === 0 && (Eu = 262144), (ft = l));
      } else ft = 536870912;
    return ((l = nt.current), l !== null && (l.flags |= 32), ft);
  }
  function Pl(l, t, e) {
    (((l === ol && (al === 2 || al === 9)) || l.cancelPendingCommit !== null) &&
      (ba(l, 0), me(l, W, ft, !1)),
      Ma(l, e),
      ((tl & 2) === 0 || l !== ol) &&
        (l === ol && ((tl & 2) === 0 && (Qe |= e), gl === 4 && me(l, W, ft, !1)), Ot(l)));
  }
  function vo(l, t, e) {
    if ((tl & 6) !== 0) throw Error(m(327));
    var a = (!e && (t & 127) === 0 && (t & l.expiredLanes) === 0) || _a(l, t),
      u = a ? dh(l, t) : Hc(l, t, !0),
      n = a;
    do {
      if (u === 0) {
        ya && !a && me(l, t, 0, !1);
        break;
      } else {
        if (((e = l.current.alternate), n && !fh(e))) {
          ((u = Hc(l, t, !1)), (n = !1));
          continue;
        }
        if (u === 2) {
          if (((n = t), l.errorRecoveryDisabledLanes & n)) var i = 0;
          else
            ((i = l.pendingLanes & -536870913), (i = i !== 0 ? i : i & 536870912 ? 536870912 : 0));
          if (i !== 0) {
            t = i;
            l: {
              var c = l;
              u = cu;
              var s = c.current.memoizedState.isDehydrated;
              if ((s && (ba(c, i).flags |= 256), (i = Hc(c, i, !1)), i !== 2)) {
                if (Ac && !s) {
                  ((c.errorRecoveryDisabledLanes |= n), (Qe |= n), (u = 4));
                  break l;
                }
                ((n = Il), (Il = u), n !== null && (Il === null ? (Il = n) : Il.push.apply(Il, n)));
              }
              u = i;
            }
            if (((n = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (ba(l, 0), me(l, t, 0, !0));
          break;
        }
        l: {
          switch (((a = l), (n = u), n)) {
            case 0:
            case 1:
              throw Error(m(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              me(a, t, ft, !se);
              break l;
            case 2:
              Il = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(m(329));
          }
          if ((t & 62914560) === t && ((u = yn + 300 - lt()), 10 < u)) {
            if ((me(a, t, ft, !se), Au(a, 0, !0) !== 0)) break l;
            ((kt = t),
              (a.timeoutHandle = Jo(
                yo.bind(null, a, e, Il, xn, Mc, t, ft, Qe, ga, se, n, 'Throttled', -0, 0),
                u
              )));
            break l;
          }
          yo(a, e, Il, xn, Mc, t, ft, Qe, ga, se, n, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ot(l);
  }
  function yo(l, t, e, a, u, n, i, c, s, v, x, S, y, g) {
    if (((l.timeoutHandle = -1), (S = t.subtreeFlags), S & 8192 || (S & 16785408) === 16785408)) {
      ((S = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Rt,
      }),
        co(t, n, S));
      var M = (n & 62914560) === n ? yn - lt() : (n & 4194048) === n ? ro - lt() : 0;
      if (((M = Jh(S, M)), M !== null)) {
        ((kt = n),
          (l.cancelPendingCommit = M(To.bind(null, l, t, n, e, a, u, i, c, s, x, S, null, y, g))),
          me(l, n, i, !v));
        return;
      }
    }
    To(l, t, n, e, a, u, i, c, s);
  }
  function fh(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if (
        (e === 0 || e === 11 || e === 15) &&
        t.flags & 16384 &&
        ((e = t.updateQueue), e !== null && ((e = e.stores), e !== null))
      )
        for (var a = 0; a < e.length; a++) {
          var u = e[a],
            n = u.getSnapshot;
          u = u.value;
          try {
            if (!at(n(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((e = t.child), t.subtreeFlags & 16384 && e !== null)) ((e.return = t), (t = e));
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function me(l, t, e, a) {
    ((t &= ~_c),
      (t &= ~Qe),
      (l.suspendedLanes |= t),
      (l.pingedLanes &= ~t),
      a && (l.warmLanes |= t),
      (a = l.expirationTimes));
    for (var u = t; 0 < u; ) {
      var n = 31 - et(u),
        i = 1 << n;
      ((a[n] = -1), (u &= ~i));
    }
    e !== 0 && Ef(l, e, t);
  }
  function bn() {
    return (tl & 6) === 0 ? (su(0), !1) : !0;
  }
  function Rc() {
    if (w !== null) {
      if (al === 0) var l = w.return;
      else ((l = w), (Bt = De = null), Wi(l), (sa = null), (Ka = 0), (l = w));
      for (; l !== null; ) (Jd(l.alternate, l), (l = l.return));
      w = null;
    }
  }
  function ba(l, t) {
    var e = l.timeoutHandle;
    (e !== -1 && ((l.timeoutHandle = -1), _h(e)),
      (e = l.cancelPendingCommit),
      e !== null && ((l.cancelPendingCommit = null), e()),
      (kt = 0),
      Rc(),
      (ol = l),
      (w = e = Ct(l.current, null)),
      (W = t),
      (al = 0),
      (ct = null),
      (se = !1),
      (ya = _a(l, t)),
      (Ac = !1),
      (ga = ft = _c = Qe = de = gl = 0),
      (Il = cu = null),
      (Mc = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var a = l.entangledLanes;
    if (a !== 0)
      for (l = l.entanglements, a &= t; 0 < a; ) {
        var u = 31 - et(a),
          n = 1 << u;
        ((t |= l[u]), (a &= ~n));
      }
    return ((wt = t), Gu(), e);
  }
  function go(l, t) {
    ((Z = null),
      (b.H = Pa),
      t === fa || t === wu
        ? ((t = Us()), (al = 3))
        : t === Bi
          ? ((t = Us()), (al = 4))
          : (al =
              t === oc
                ? 8
                : t !== null && typeof t == 'object' && typeof t.then == 'function'
                  ? 6
                  : 1),
      (ct = t),
      w === null && ((gl = 1), fn(l, ht(t, l.current))));
  }
  function xo() {
    var l = nt.current;
    return l === null
      ? !0
      : (W & 4194048) === W
        ? xt === null
        : (W & 62914560) === W || (W & 536870912) !== 0
          ? l === xt
          : !1;
  }
  function bo() {
    var l = b.H;
    return ((b.H = Pa), l === null ? Pa : l);
  }
  function po() {
    var l = b.A;
    return ((b.A = ih), l);
  }
  function pn() {
    ((gl = 4),
      se || ((W & 4194048) !== W && nt.current !== null) || (ya = !0),
      ((de & 134217727) === 0 && (Qe & 134217727) === 0) || ol === null || me(ol, W, ft, !1));
  }
  function Hc(l, t, e) {
    var a = tl;
    tl |= 2;
    var u = bo(),
      n = po();
    ((ol !== l || W !== t) && ((xn = null), ba(l, t)), (t = !1));
    var i = gl;
    l: do
      try {
        if (al !== 0 && w !== null) {
          var c = w,
            s = ct;
          switch (al) {
            case 8:
              (Rc(), (i = 6));
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              nt.current === null && (t = !0);
              var v = al;
              if (((al = 0), (ct = null), pa(l, c, s, v), e && ya)) {
                i = 0;
                break l;
              }
              break;
            default:
              ((v = al), (al = 0), (ct = null), pa(l, c, s, v));
          }
        }
        (sh(), (i = gl));
        break;
      } catch (x) {
        go(l, x);
      }
    while (!0);
    return (
      t && l.shellSuspendCounter++,
      (Bt = De = null),
      (tl = a),
      (b.H = u),
      (b.A = n),
      w === null && ((ol = null), (W = 0), Gu()),
      i
    );
  }
  function sh() {
    for (; w !== null; ) So(w);
  }
  function dh(l, t) {
    var e = tl;
    tl |= 2;
    var a = bo(),
      u = po();
    ol !== l || W !== t ? ((xn = null), (gn = lt() + 500), ba(l, t)) : (ya = _a(l, t));
    l: do
      try {
        if (al !== 0 && w !== null) {
          t = w;
          var n = ct;
          t: switch (al) {
            case 1:
              ((al = 0), (ct = null), pa(l, t, n, 1));
              break;
            case 2:
            case 9:
              if (Os(n)) {
                ((al = 0), (ct = null), zo(t));
                break;
              }
              ((t = function () {
                ((al !== 2 && al !== 9) || ol !== l || (al = 7), Ot(l));
              }),
                n.then(t, t));
              break l;
            case 3:
              al = 7;
              break l;
            case 4:
              al = 5;
              break l;
            case 7:
              Os(n) ? ((al = 0), (ct = null), zo(t)) : ((al = 0), (ct = null), pa(l, t, n, 7));
              break;
            case 5:
              var i = null;
              switch (w.tag) {
                case 26:
                  i = w.memoizedState;
                case 5:
                case 27:
                  var c = w;
                  if (i ? cr(i) : c.stateNode.complete) {
                    ((al = 0), (ct = null));
                    var s = c.sibling;
                    if (s !== null) w = s;
                    else {
                      var v = c.return;
                      v !== null ? ((w = v), Sn(v)) : (w = null);
                    }
                    break t;
                  }
              }
              ((al = 0), (ct = null), pa(l, t, n, 5));
              break;
            case 6:
              ((al = 0), (ct = null), pa(l, t, n, 6));
              break;
            case 8:
              (Rc(), (gl = 6));
              break l;
            default:
              throw Error(m(462));
          }
        }
        oh();
        break;
      } catch (x) {
        go(l, x);
      }
    while (!0);
    return (
      (Bt = De = null),
      (b.H = a),
      (b.A = u),
      (tl = e),
      w !== null ? 0 : ((ol = null), (W = 0), Gu(), gl)
    );
  }
  function oh() {
    for (; w !== null && !Hr(); ) So(w);
  }
  function So(l) {
    var t = Vd(l.alternate, l, wt);
    ((l.memoizedProps = l.pendingProps), t === null ? Sn(l) : (w = t));
  }
  function zo(l) {
    var t = l,
      e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Yd(e, t, t.pendingProps, t.type, void 0, W);
        break;
      case 11:
        t = Yd(e, t, t.pendingProps, t.type.render, t.ref, W);
        break;
      case 5:
        Wi(t);
      default:
        (Jd(e, t), (t = w = bs(t, wt)), (t = Vd(e, t, wt)));
    }
    ((l.memoizedProps = l.pendingProps), t === null ? Sn(l) : (w = t));
  }
  function pa(l, t, e, a) {
    ((Bt = De = null), Wi(t), (sa = null), (Ka = 0));
    var u = t.return;
    try {
      if (Pm(l, u, t, e, W)) {
        ((gl = 1), fn(l, ht(e, l.current)), (w = null));
        return;
      }
    } catch (n) {
      if (u !== null) throw ((w = u), n);
      ((gl = 1), fn(l, ht(e, l.current)), (w = null));
      return;
    }
    t.flags & 32768
      ? (I || a === 1
          ? (l = !0)
          : ya || (W & 536870912) !== 0
            ? (l = !1)
            : ((se = l = !0),
              (a === 2 || a === 9 || a === 3 || a === 6) &&
                ((a = nt.current), a !== null && a.tag === 13 && (a.flags |= 16384))),
        jo(t, l))
      : Sn(t);
  }
  function Sn(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        jo(t, se);
        return;
      }
      l = t.return;
      var e = eh(t.alternate, t, wt);
      if (e !== null) {
        w = e;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        w = t;
        return;
      }
      w = t = l;
    } while (t !== null);
    gl === 0 && (gl = 5);
  }
  function jo(l, t) {
    do {
      var e = ah(l.alternate, l);
      if (e !== null) {
        ((e.flags &= 32767), (w = e));
        return;
      }
      if (
        ((e = l.return),
        e !== null && ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null)),
        !t && ((l = l.sibling), l !== null))
      ) {
        w = l;
        return;
      }
      w = l = e;
    } while (l !== null);
    ((gl = 6), (w = null));
  }
  function To(l, t, e, a, u, n, i, c, s) {
    l.cancelPendingCommit = null;
    do zn();
    while (Ol !== 0);
    if ((tl & 6) !== 0) throw Error(m(327));
    if (t !== null) {
      if (t === l.current) throw Error(m(177));
      if (
        ((n = t.lanes | t.childLanes),
        (n |= zi),
        Vr(l, e, n, i, c, s),
        l === ol && ((w = ol = null), (W = 0)),
        (xa = t),
        (re = l),
        (kt = e),
        (Oc = n),
        (Dc = u),
        (mo = a),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((l.callbackNode = null),
            (l.callbackPriority = 0),
            vh(ju, function () {
              return (Mo(), null);
            }))
          : ((l.callbackNode = null), (l.callbackPriority = 0)),
        (a = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || a)
      ) {
        ((a = b.T), (b.T = null), (u = N.p), (N.p = 2), (i = tl), (tl |= 4));
        try {
          uh(l, t, e);
        } finally {
          ((tl = i), (N.p = u), (b.T = a));
        }
      }
      ((Ol = 1), Eo(), No(), Ao());
    }
  }
  function Eo() {
    if (Ol === 1) {
      Ol = 0;
      var l = re,
        t = xa,
        e = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || e) {
        ((e = b.T), (b.T = null));
        var a = N.p;
        N.p = 2;
        var u = tl;
        tl |= 4;
        try {
          uo(t, l);
          var n = Jc,
            i = ds(l.containerInfo),
            c = n.focusedElem,
            s = n.selectionRange;
          if (i !== c && c && c.ownerDocument && ss(c.ownerDocument.documentElement, c)) {
            if (s !== null && gi(c)) {
              var v = s.start,
                x = s.end;
              if ((x === void 0 && (x = v), 'selectionStart' in c))
                ((c.selectionStart = v), (c.selectionEnd = Math.min(x, c.value.length)));
              else {
                var S = c.ownerDocument || document,
                  y = (S && S.defaultView) || window;
                if (y.getSelection) {
                  var g = y.getSelection(),
                    M = c.textContent.length,
                    H = Math.min(s.start, M),
                    sl = s.end === void 0 ? H : Math.min(s.end, M);
                  !g.extend && H > sl && ((i = sl), (sl = H), (H = i));
                  var r = fs(c, H),
                    d = fs(c, sl);
                  if (
                    r &&
                    d &&
                    (g.rangeCount !== 1 ||
                      g.anchorNode !== r.node ||
                      g.anchorOffset !== r.offset ||
                      g.focusNode !== d.node ||
                      g.focusOffset !== d.offset)
                  ) {
                    var h = S.createRange();
                    (h.setStart(r.node, r.offset),
                      g.removeAllRanges(),
                      H > sl
                        ? (g.addRange(h), g.extend(d.node, d.offset))
                        : (h.setEnd(d.node, d.offset), g.addRange(h)));
                  }
                }
              }
            }
            for (S = [], g = c; (g = g.parentNode); )
              g.nodeType === 1 && S.push({ element: g, left: g.scrollLeft, top: g.scrollTop });
            for (typeof c.focus == 'function' && c.focus(), c = 0; c < S.length; c++) {
              var p = S[c];
              ((p.element.scrollLeft = p.left), (p.element.scrollTop = p.top));
            }
          }
          ((Hn = !!Kc), (Jc = Kc = null));
        } finally {
          ((tl = u), (N.p = a), (b.T = e));
        }
      }
      ((l.current = t), (Ol = 2));
    }
  }
  function No() {
    if (Ol === 2) {
      Ol = 0;
      var l = re,
        t = xa,
        e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        ((e = b.T), (b.T = null));
        var a = N.p;
        N.p = 2;
        var u = tl;
        tl |= 4;
        try {
          Pd(l, t.alternate, t);
        } finally {
          ((tl = u), (N.p = a), (b.T = e));
        }
      }
      Ol = 3;
    }
  }
  function Ao() {
    if (Ol === 4 || Ol === 3) {
      ((Ol = 0), Cr());
      var l = re,
        t = xa,
        e = kt,
        a = mo;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (Ol = 5)
        : ((Ol = 0), (xa = re = null), _o(l, l.pendingLanes));
      var u = l.pendingLanes;
      if (
        (u === 0 && (oe = null),
        In(e),
        (t = t.stateNode),
        tt && typeof tt.onCommitFiberRoot == 'function')
      )
        try {
          tt.onCommitFiberRoot(Aa, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        ((t = b.T), (u = N.p), (N.p = 2), (b.T = null));
        try {
          for (var n = l.onRecoverableError, i = 0; i < a.length; i++) {
            var c = a[i];
            n(c.value, { componentStack: c.stack });
          }
        } finally {
          ((b.T = t), (N.p = u));
        }
      }
      ((kt & 3) !== 0 && zn(),
        Ot(l),
        (u = l.pendingLanes),
        (e & 261930) !== 0 && (u & 42) !== 0 ? (l === Uc ? fu++ : ((fu = 0), (Uc = l))) : (fu = 0),
        su(0));
    }
  }
  function _o(l, t) {
    (l.pooledCacheLanes &= t) === 0 &&
      ((t = l.pooledCache), t != null && ((l.pooledCache = null), La(t)));
  }
  function zn() {
    return (Eo(), No(), Ao(), Mo());
  }
  function Mo() {
    if (Ol !== 5) return !1;
    var l = re,
      t = Oc;
    Oc = 0;
    var e = In(kt),
      a = b.T,
      u = N.p;
    try {
      ((N.p = 32 > e ? 32 : e), (b.T = null), (e = Dc), (Dc = null));
      var n = re,
        i = kt;
      if (((Ol = 0), (xa = re = null), (kt = 0), (tl & 6) !== 0)) throw Error(m(331));
      var c = tl;
      if (
        ((tl |= 4),
        so(n.current),
        io(n, n.current, i, e),
        (tl = c),
        su(0, !1),
        tt && typeof tt.onPostCommitFiberRoot == 'function')
      )
        try {
          tt.onPostCommitFiberRoot(Aa, n);
        } catch {}
      return !0;
    } finally {
      ((N.p = u), (b.T = a), _o(l, t));
    }
  }
  function Oo(l, t, e) {
    ((t = ht(e, t)),
      (t = dc(l.stateNode, t, 2)),
      (l = ne(l, t, 2)),
      l !== null && (Ma(l, 2), Ot(l)));
  }
  function ul(l, t, e) {
    if (l.tag === 3) Oo(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Oo(t, l, e);
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == 'function' ||
            (typeof a.componentDidCatch == 'function' && (oe === null || !oe.has(a)))
          ) {
            ((l = ht(e, l)),
              (e = Od(2)),
              (a = ne(t, e, 2)),
              a !== null && (Dd(e, a, t, l), Ma(a, 2), Ot(a)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Cc(l, t, e) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new ch();
      var u = new Set();
      a.set(t, u);
    } else ((u = a.get(t)), u === void 0 && ((u = new Set()), a.set(t, u)));
    u.has(e) || ((Ac = !0), u.add(e), (l = rh.bind(null, l, t, e)), t.then(l, l));
  }
  function rh(l, t, e) {
    var a = l.pingCache;
    (a !== null && a.delete(t),
      (l.pingedLanes |= l.suspendedLanes & e),
      (l.warmLanes &= ~e),
      ol === l &&
        (W & e) === e &&
        (gl === 4 || (gl === 3 && (W & 62914560) === W && 300 > lt() - yn)
          ? (tl & 2) === 0 && ba(l, 0)
          : (_c |= e),
        ga === W && (ga = 0)),
      Ot(l));
  }
  function Do(l, t) {
    (t === 0 && (t = Tf()), (l = _e(l, t)), l !== null && (Ma(l, t), Ot(l)));
  }
  function mh(l) {
    var t = l.memoizedState,
      e = 0;
    (t !== null && (e = t.retryLane), Do(l, e));
  }
  function hh(l, t) {
    var e = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var a = l.stateNode,
          u = l.memoizedState;
        u !== null && (e = u.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(m(314));
    }
    (a !== null && a.delete(t), Do(l, e));
  }
  function vh(l, t) {
    return kn(l, t);
  }
  var jn = null,
    Sa = null,
    qc = !1,
    Tn = !1,
    Bc = !1,
    he = 0;
  function Ot(l) {
    (l !== Sa && l.next === null && (Sa === null ? (jn = Sa = l) : (Sa = Sa.next = l)),
      (Tn = !0),
      qc || ((qc = !0), gh()));
  }
  function su(l, t) {
    if (!Bc && Tn) {
      Bc = !0;
      do
        for (var e = !1, a = jn; a !== null; ) {
          if (l !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var n = 0;
            else {
              var i = a.suspendedLanes,
                c = a.pingedLanes;
              ((n = (1 << (31 - et(42 | l) + 1)) - 1),
                (n &= u & ~(i & ~c)),
                (n = n & 201326741 ? (n & 201326741) | 1 : n ? n | 2 : 0));
            }
            n !== 0 && ((e = !0), Co(a, n));
          } else
            ((n = W),
              (n = Au(
                a,
                a === ol ? n : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1
              )),
              (n & 3) === 0 || _a(a, n) || ((e = !0), Co(a, n)));
          a = a.next;
        }
      while (e);
      Bc = !1;
    }
  }
  function yh() {
    Uo();
  }
  function Uo() {
    Tn = qc = !1;
    var l = 0;
    he !== 0 && Ah() && (l = he);
    for (var t = lt(), e = null, a = jn; a !== null; ) {
      var u = a.next,
        n = Ro(a, t);
      (n === 0
        ? ((a.next = null), e === null ? (jn = u) : (e.next = u), u === null && (Sa = e))
        : ((e = a), (l !== 0 || (n & 3) !== 0) && (Tn = !0)),
        (a = u));
    }
    ((Ol !== 0 && Ol !== 5) || su(l), he !== 0 && (he = 0));
  }
  function Ro(l, t) {
    for (
      var e = l.suspendedLanes,
        a = l.pingedLanes,
        u = l.expirationTimes,
        n = l.pendingLanes & -62914561;
      0 < n;
    ) {
      var i = 31 - et(n),
        c = 1 << i,
        s = u[i];
      (s === -1
        ? ((c & e) === 0 || (c & a) !== 0) && (u[i] = Lr(c, t))
        : s <= t && (l.expiredLanes |= c),
        (n &= ~c));
    }
    if (
      ((t = ol),
      (e = W),
      (e = Au(l, l === t ? e : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1)),
      (a = l.callbackNode),
      e === 0 || (l === t && (al === 2 || al === 9)) || l.cancelPendingCommit !== null)
    )
      return (a !== null && a !== null && Wn(a), (l.callbackNode = null), (l.callbackPriority = 0));
    if ((e & 3) === 0 || _a(l, e)) {
      if (((t = e & -e), t === l.callbackPriority)) return t;
      switch ((a !== null && Wn(a), In(e))) {
        case 2:
        case 8:
          e = zf;
          break;
        case 32:
          e = ju;
          break;
        case 268435456:
          e = jf;
          break;
        default:
          e = ju;
      }
      return (
        (a = Ho.bind(null, l)),
        (e = kn(e, a)),
        (l.callbackPriority = t),
        (l.callbackNode = e),
        t
      );
    }
    return (
      a !== null && a !== null && Wn(a),
      (l.callbackPriority = 2),
      (l.callbackNode = null),
      2
    );
  }
  function Ho(l, t) {
    if (Ol !== 0 && Ol !== 5) return ((l.callbackNode = null), (l.callbackPriority = 0), null);
    var e = l.callbackNode;
    if (zn() && l.callbackNode !== e) return null;
    var a = W;
    return (
      (a = Au(l, l === ol ? a : 0, l.cancelPendingCommit !== null || l.timeoutHandle !== -1)),
      a === 0
        ? null
        : (vo(l, a, t),
          Ro(l, lt()),
          l.callbackNode != null && l.callbackNode === e ? Ho.bind(null, l) : null)
    );
  }
  function Co(l, t) {
    if (zn()) return null;
    vo(l, t, !0);
  }
  function gh() {
    Mh(function () {
      (tl & 6) !== 0 ? kn(Sf, yh) : Uo();
    });
  }
  function Yc() {
    if (he === 0) {
      var l = ia;
      (l === 0 && ((l = Tu), (Tu <<= 1), (Tu & 261888) === 0 && (Tu = 256)), (he = l));
    }
    return he;
  }
  function qo(l) {
    return l == null || typeof l == 'symbol' || typeof l == 'boolean'
      ? null
      : typeof l == 'function'
        ? l
        : Du('' + l);
  }
  function Bo(l, t) {
    var e = t.ownerDocument.createElement('input');
    return (
      (e.name = t.name),
      (e.value = t.value),
      l.id && e.setAttribute('form', l.id),
      t.parentNode.insertBefore(e, t),
      (l = new FormData(l)),
      e.parentNode.removeChild(e),
      l
    );
  }
  function xh(l, t, e, a, u) {
    if (t === 'submit' && e && e.stateNode === u) {
      var n = qo((u[wl] || null).action),
        i = a.submitter;
      i &&
        ((t = (t = i[wl] || null) ? qo(t.formAction) : i.getAttribute('formAction')),
        t !== null && ((n = t), (i = null)));
      var c = new Cu('action', 'action', null, a, u);
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (he !== 0) {
                  var s = i ? Bo(u, i) : new FormData(u);
                  uc(e, { pending: !0, data: s, method: u.method, action: n }, null, s);
                }
              } else
                typeof n == 'function' &&
                  (c.preventDefault(),
                  (s = i ? Bo(u, i) : new FormData(u)),
                  uc(e, { pending: !0, data: s, method: u.method, action: n }, n, s));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var Gc = 0; Gc < Si.length; Gc++) {
    var Qc = Si[Gc],
      bh = Qc.toLowerCase(),
      ph = Qc[0].toUpperCase() + Qc.slice(1);
    jt(bh, 'on' + ph);
  }
  (jt(ms, 'onAnimationEnd'),
    jt(hs, 'onAnimationIteration'),
    jt(vs, 'onAnimationStart'),
    jt('dblclick', 'onDoubleClick'),
    jt('focusin', 'onFocus'),
    jt('focusout', 'onBlur'),
    jt(qm, 'onTransitionRun'),
    jt(Bm, 'onTransitionStart'),
    jt(Ym, 'onTransitionCancel'),
    jt(ys, 'onTransitionEnd'),
    Je('onMouseEnter', ['mouseout', 'mouseover']),
    Je('onMouseLeave', ['mouseout', 'mouseover']),
    Je('onPointerEnter', ['pointerout', 'pointerover']),
    Je('onPointerLeave', ['pointerout', 'pointerover']),
    Te('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    Te(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' '
      )
    ),
    Te('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    Te('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    Te(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
    ),
    Te(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
    ));
  var du =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' '
      ),
    Sh = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(du)
    );
  function Yo(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var a = l[e],
        u = a.event;
      a = a.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var c = a[i],
              s = c.instance,
              v = c.currentTarget;
            if (((c = c.listener), s !== n && u.isPropagationStopped())) break l;
            ((n = c), (u.currentTarget = v));
            try {
              n(u);
            } catch (x) {
              Yu(x);
            }
            ((u.currentTarget = null), (n = s));
          }
        else
          for (i = 0; i < a.length; i++) {
            if (
              ((c = a[i]),
              (s = c.instance),
              (v = c.currentTarget),
              (c = c.listener),
              s !== n && u.isPropagationStopped())
            )
              break l;
            ((n = c), (u.currentTarget = v));
            try {
              n(u);
            } catch (x) {
              Yu(x);
            }
            ((u.currentTarget = null), (n = s));
          }
      }
    }
  }
  function k(l, t) {
    var e = t[Pn];
    e === void 0 && (e = t[Pn] = new Set());
    var a = l + '__bubble';
    e.has(a) || (Go(t, l, 2, !1), e.add(a));
  }
  function Xc(l, t, e) {
    var a = 0;
    (t && (a |= 4), Go(e, l, a, t));
  }
  var En = '_reactListening' + Math.random().toString(36).slice(2);
  function Zc(l) {
    if (!l[En]) {
      ((l[En] = !0),
        Df.forEach(function (e) {
          e !== 'selectionchange' && (Sh.has(e) || Xc(e, !1, l), Xc(e, !0, l));
        }));
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[En] || ((t[En] = !0), Xc('selectionchange', !1, t));
    }
  }
  function Go(l, t, e, a) {
    switch (hr(t)) {
      case 2:
        var u = Wh;
        break;
      case 8:
        u = $h;
        break;
      default:
        u = af;
    }
    ((e = u.bind(null, t, e, l)),
      (u = void 0),
      !fi || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (u = !0),
      a
        ? u !== void 0
          ? l.addEventListener(t, e, { capture: !0, passive: u })
          : l.addEventListener(t, e, !0)
        : u !== void 0
          ? l.addEventListener(t, e, { passive: u })
          : l.addEventListener(t, e, !1));
  }
  function Lc(l, t, e, a, u) {
    var n = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (;;) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var c = a.stateNode.containerInfo;
          if (c === u) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var s = i.tag;
              if ((s === 3 || s === 4) && i.stateNode.containerInfo === u) return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (((i = Le(c)), i === null)) return;
            if (((s = i.tag), s === 5 || s === 6 || s === 26 || s === 27)) {
              a = n = i;
              continue l;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    Lf(function () {
      var v = n,
        x = ii(e),
        S = [];
      l: {
        var y = gs.get(l);
        if (y !== void 0) {
          var g = Cu,
            M = l;
          switch (l) {
            case 'keypress':
              if (Ru(e) === 0) break l;
            case 'keydown':
            case 'keyup':
              g = hm;
              break;
            case 'focusin':
              ((M = 'focus'), (g = ri));
              break;
            case 'focusout':
              ((M = 'blur'), (g = ri));
              break;
            case 'beforeblur':
            case 'afterblur':
              g = ri;
              break;
            case 'click':
              if (e.button === 2) break l;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              g = Jf;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              g = em;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              g = gm;
              break;
            case ms:
            case hs:
            case vs:
              g = nm;
              break;
            case ys:
              g = bm;
              break;
            case 'scroll':
            case 'scrollend':
              g = lm;
              break;
            case 'wheel':
              g = Sm;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              g = cm;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              g = kf;
              break;
            case 'toggle':
            case 'beforetoggle':
              g = jm;
          }
          var H = (t & 4) !== 0,
            sl = !H && (l === 'scroll' || l === 'scrollend'),
            r = H ? (y !== null ? y + 'Capture' : null) : y;
          H = [];
          for (var d = v, h; d !== null; ) {
            var p = d;
            if (
              ((h = p.stateNode),
              (p = p.tag),
              (p !== 5 && p !== 26 && p !== 27) ||
                h === null ||
                r === null ||
                ((p = Ua(d, r)), p != null && H.push(ou(d, p, h))),
              sl)
            )
              break;
            d = d.return;
          }
          0 < H.length && ((y = new g(y, M, null, e, x)), S.push({ event: y, listeners: H }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (
            ((y = l === 'mouseover' || l === 'pointerover'),
            (g = l === 'mouseout' || l === 'pointerout'),
            y && e !== ni && (M = e.relatedTarget || e.fromElement) && (Le(M) || M[Ze]))
          )
            break l;
          if (
            (g || y) &&
            ((y =
              x.window === x
                ? x
                : (y = x.ownerDocument)
                  ? y.defaultView || y.parentWindow
                  : window),
            g
              ? ((M = e.relatedTarget || e.toElement),
                (g = v),
                (M = M ? Le(M) : null),
                M !== null &&
                  ((sl = Y(M)), (H = M.tag), M !== sl || (H !== 5 && H !== 27 && H !== 6)) &&
                  (M = null))
              : ((g = null), (M = v)),
            g !== M)
          ) {
            if (
              ((H = Jf),
              (p = 'onMouseLeave'),
              (r = 'onMouseEnter'),
              (d = 'mouse'),
              (l === 'pointerout' || l === 'pointerover') &&
                ((H = kf), (p = 'onPointerLeave'), (r = 'onPointerEnter'), (d = 'pointer')),
              (sl = g == null ? y : Da(g)),
              (h = M == null ? y : Da(M)),
              (y = new H(p, d + 'leave', g, e, x)),
              (y.target = sl),
              (y.relatedTarget = h),
              (p = null),
              Le(x) === v &&
                ((H = new H(r, d + 'enter', M, e, x)),
                (H.target = h),
                (H.relatedTarget = sl),
                (p = H)),
              (sl = p),
              g && M)
            )
              t: {
                for (H = zh, r = g, d = M, h = 0, p = r; p; p = H(p)) h++;
                p = 0;
                for (var R = d; R; R = H(R)) p++;
                for (; 0 < h - p; ) ((r = H(r)), h--);
                for (; 0 < p - h; ) ((d = H(d)), p--);
                for (; h--; ) {
                  if (r === d || (d !== null && r === d.alternate)) {
                    H = r;
                    break t;
                  }
                  ((r = H(r)), (d = H(d)));
                }
                H = null;
              }
            else H = null;
            (g !== null && Qo(S, y, g, H, !1), M !== null && sl !== null && Qo(S, sl, M, H, !0));
          }
        }
        l: {
          if (
            ((y = v ? Da(v) : window),
            (g = y.nodeName && y.nodeName.toLowerCase()),
            g === 'select' || (g === 'input' && y.type === 'file'))
          )
            var P = es;
          else if (ls(y))
            if (as) P = Rm;
            else {
              P = Dm;
              var D = Om;
            }
          else
            ((g = y.nodeName),
              !g || g.toLowerCase() !== 'input' || (y.type !== 'checkbox' && y.type !== 'radio')
                ? v && ui(v.elementType) && (P = es)
                : (P = Um));
          if (P && (P = P(l, v))) {
            ts(S, P, e, x);
            break l;
          }
          (D && D(l, y, v),
            l === 'focusout' &&
              v &&
              y.type === 'number' &&
              v.memoizedProps.value != null &&
              ai(y, 'number', y.value));
        }
        switch (((D = v ? Da(v) : window), l)) {
          case 'focusin':
            (ls(D) || D.contentEditable === 'true') && ((Ie = D), (xi = v), (Qa = null));
            break;
          case 'focusout':
            Qa = xi = Ie = null;
            break;
          case 'mousedown':
            bi = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((bi = !1), os(S, e, x));
            break;
          case 'selectionchange':
            if (Cm) break;
          case 'keydown':
          case 'keyup':
            os(S, e, x);
        }
        var L;
        if (hi)
          l: {
            switch (l) {
              case 'compositionstart':
                var $ = 'onCompositionStart';
                break l;
              case 'compositionend':
                $ = 'onCompositionEnd';
                break l;
              case 'compositionupdate':
                $ = 'onCompositionUpdate';
                break l;
            }
            $ = void 0;
          }
        else
          Fe
            ? If(l, e) && ($ = 'onCompositionEnd')
            : l === 'keydown' && e.keyCode === 229 && ($ = 'onCompositionStart');
        ($ &&
          (Wf &&
            e.locale !== 'ko' &&
            (Fe || $ !== 'onCompositionStart'
              ? $ === 'onCompositionEnd' && Fe && (L = Vf())
              : ((It = x), (si = 'value' in It ? It.value : It.textContent), (Fe = !0))),
          (D = Nn(v, $)),
          0 < D.length &&
            (($ = new wf($, l, null, e, x)),
            S.push({ event: $, listeners: D }),
            L ? ($.data = L) : ((L = Pf(e)), L !== null && ($.data = L)))),
          (L = Em ? Nm(l, e) : Am(l, e)) &&
            (($ = Nn(v, 'onBeforeInput')),
            0 < $.length &&
              ((D = new wf('onBeforeInput', 'beforeinput', null, e, x)),
              S.push({ event: D, listeners: $ }),
              (D.data = L))),
          xh(S, l, v, e, x));
      }
      Yo(S, t);
    });
  }
  function ou(l, t, e) {
    return { instance: l, listener: t, currentTarget: e };
  }
  function Nn(l, t) {
    for (var e = t + 'Capture', a = []; l !== null; ) {
      var u = l,
        n = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          n === null ||
          ((u = Ua(l, e)),
          u != null && a.unshift(ou(l, u, n)),
          (u = Ua(l, t)),
          u != null && a.push(ou(l, u, n))),
        l.tag === 3)
      )
        return a;
      l = l.return;
    }
    return [];
  }
  function zh(l) {
    if (l === null) return null;
    do l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Qo(l, t, e, a, u) {
    for (var n = t._reactName, i = []; e !== null && e !== a; ) {
      var c = e,
        s = c.alternate,
        v = c.stateNode;
      if (((c = c.tag), s !== null && s === a)) break;
      ((c !== 5 && c !== 26 && c !== 27) ||
        v === null ||
        ((s = v),
        u
          ? ((v = Ua(e, n)), v != null && i.unshift(ou(e, v, s)))
          : u || ((v = Ua(e, n)), v != null && i.push(ou(e, v, s)))),
        (e = e.return));
    }
    i.length !== 0 && l.push({ event: t, listeners: i });
  }
  var jh = /\r\n?/g,
    Th = /\u0000|\uFFFD/g;
  function Xo(l) {
    return (typeof l == 'string' ? l : '' + l)
      .replace(
        jh,
        `
`
      )
      .replace(Th, '');
  }
  function Zo(l, t) {
    return ((t = Xo(t)), Xo(l) === t);
  }
  function fl(l, t, e, a, u, n) {
    switch (e) {
      case 'children':
        typeof a == 'string'
          ? t === 'body' || (t === 'textarea' && a === '') || ke(l, a)
          : (typeof a == 'number' || typeof a == 'bigint') && t !== 'body' && ke(l, '' + a);
        break;
      case 'className':
        Mu(l, 'class', a);
        break;
      case 'tabIndex':
        Mu(l, 'tabindex', a);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Mu(l, e, a);
        break;
      case 'style':
        Xf(l, a, n);
        break;
      case 'data':
        if (t !== 'object') {
          Mu(l, 'data', a);
          break;
        }
      case 'src':
      case 'href':
        if (a === '' && (t !== 'a' || e !== 'href')) {
          l.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == 'function' || typeof a == 'symbol' || typeof a == 'boolean') {
          l.removeAttribute(e);
          break;
        }
        ((a = Du('' + a)), l.setAttribute(e, a));
        break;
      case 'action':
      case 'formAction':
        if (typeof a == 'function') {
          l.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == 'function' &&
            (e === 'formAction'
              ? (t !== 'input' && fl(l, t, 'name', u.name, u, null),
                fl(l, t, 'formEncType', u.formEncType, u, null),
                fl(l, t, 'formMethod', u.formMethod, u, null),
                fl(l, t, 'formTarget', u.formTarget, u, null))
              : (fl(l, t, 'encType', u.encType, u, null),
                fl(l, t, 'method', u.method, u, null),
                fl(l, t, 'target', u.target, u, null)));
        if (a == null || typeof a == 'symbol' || typeof a == 'boolean') {
          l.removeAttribute(e);
          break;
        }
        ((a = Du('' + a)), l.setAttribute(e, a));
        break;
      case 'onClick':
        a != null && (l.onclick = Rt);
        break;
      case 'onScroll':
        a != null && k('scroll', l);
        break;
      case 'onScrollEnd':
        a != null && k('scrollend', l);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(m(61));
          if (((e = a.__html), e != null)) {
            if (u.children != null) throw Error(m(60));
            l.innerHTML = e;
          }
        }
        break;
      case 'multiple':
        l.multiple = a && typeof a != 'function' && typeof a != 'symbol';
        break;
      case 'muted':
        l.muted = a && typeof a != 'function' && typeof a != 'symbol';
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break;
      case 'autoFocus':
        break;
      case 'xlinkHref':
        if (a == null || typeof a == 'function' || typeof a == 'boolean' || typeof a == 'symbol') {
          l.removeAttribute('xlink:href');
          break;
        }
        ((e = Du('' + a)), l.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', e));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        a != null && typeof a != 'function' && typeof a != 'symbol'
          ? l.setAttribute(e, '' + a)
          : l.removeAttribute(e);
        break;
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        a && typeof a != 'function' && typeof a != 'symbol'
          ? l.setAttribute(e, '')
          : l.removeAttribute(e);
        break;
      case 'capture':
      case 'download':
        a === !0
          ? l.setAttribute(e, '')
          : a !== !1 && a != null && typeof a != 'function' && typeof a != 'symbol'
            ? l.setAttribute(e, a)
            : l.removeAttribute(e);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        a != null && typeof a != 'function' && typeof a != 'symbol' && !isNaN(a) && 1 <= a
          ? l.setAttribute(e, a)
          : l.removeAttribute(e);
        break;
      case 'rowSpan':
      case 'start':
        a == null || typeof a == 'function' || typeof a == 'symbol' || isNaN(a)
          ? l.removeAttribute(e)
          : l.setAttribute(e, a);
        break;
      case 'popover':
        (k('beforetoggle', l), k('toggle', l), _u(l, 'popover', a));
        break;
      case 'xlinkActuate':
        Ut(l, 'http://www.w3.org/1999/xlink', 'xlink:actuate', a);
        break;
      case 'xlinkArcrole':
        Ut(l, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', a);
        break;
      case 'xlinkRole':
        Ut(l, 'http://www.w3.org/1999/xlink', 'xlink:role', a);
        break;
      case 'xlinkShow':
        Ut(l, 'http://www.w3.org/1999/xlink', 'xlink:show', a);
        break;
      case 'xlinkTitle':
        Ut(l, 'http://www.w3.org/1999/xlink', 'xlink:title', a);
        break;
      case 'xlinkType':
        Ut(l, 'http://www.w3.org/1999/xlink', 'xlink:type', a);
        break;
      case 'xmlBase':
        Ut(l, 'http://www.w3.org/XML/1998/namespace', 'xml:base', a);
        break;
      case 'xmlLang':
        Ut(l, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', a);
        break;
      case 'xmlSpace':
        Ut(l, 'http://www.w3.org/XML/1998/namespace', 'xml:space', a);
        break;
      case 'is':
        _u(l, 'is', a);
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        (!(2 < e.length) || (e[0] !== 'o' && e[0] !== 'O') || (e[1] !== 'n' && e[1] !== 'N')) &&
          ((e = Ir.get(e) || e), _u(l, e, a));
    }
  }
  function Vc(l, t, e, a, u, n) {
    switch (e) {
      case 'style':
        Xf(l, a, n);
        break;
      case 'dangerouslySetInnerHTML':
        if (a != null) {
          if (typeof a != 'object' || !('__html' in a)) throw Error(m(61));
          if (((e = a.__html), e != null)) {
            if (u.children != null) throw Error(m(60));
            l.innerHTML = e;
          }
        }
        break;
      case 'children':
        typeof a == 'string'
          ? ke(l, a)
          : (typeof a == 'number' || typeof a == 'bigint') && ke(l, '' + a);
        break;
      case 'onScroll':
        a != null && k('scroll', l);
        break;
      case 'onScrollEnd':
        a != null && k('scrollend', l);
        break;
      case 'onClick':
        a != null && (l.onclick = Rt);
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        break;
      case 'innerText':
      case 'textContent':
        break;
      default:
        if (!Uf.hasOwnProperty(e))
          l: {
            if (
              e[0] === 'o' &&
              e[1] === 'n' &&
              ((u = e.endsWith('Capture')),
              (t = e.slice(2, u ? e.length - 7 : void 0)),
              (n = l[wl] || null),
              (n = n != null ? n[e] : null),
              typeof n == 'function' && l.removeEventListener(t, n, u),
              typeof a == 'function')
            ) {
              (typeof n != 'function' &&
                n !== null &&
                (e in l ? (l[e] = null) : l.hasAttribute(e) && l.removeAttribute(e)),
                l.addEventListener(t, a, u));
              break l;
            }
            e in l ? (l[e] = a) : a === !0 ? l.setAttribute(e, '') : _u(l, e, a);
          }
    }
  }
  function Yl(l, t, e) {
    switch (t) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'img':
        (k('error', l), k('load', l));
        var a = !1,
          u = !1,
          n;
        for (n in e)
          if (e.hasOwnProperty(n)) {
            var i = e[n];
            if (i != null)
              switch (n) {
                case 'src':
                  a = !0;
                  break;
                case 'srcSet':
                  u = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(m(137, t));
                default:
                  fl(l, t, n, i, e, null);
              }
          }
        (u && fl(l, t, 'srcSet', e.srcSet, e, null), a && fl(l, t, 'src', e.src, e, null));
        return;
      case 'input':
        k('invalid', l);
        var c = (n = i = u = null),
          s = null,
          v = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var x = e[a];
            if (x != null)
              switch (a) {
                case 'name':
                  u = x;
                  break;
                case 'type':
                  i = x;
                  break;
                case 'checked':
                  s = x;
                  break;
                case 'defaultChecked':
                  v = x;
                  break;
                case 'value':
                  n = x;
                  break;
                case 'defaultValue':
                  c = x;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (x != null) throw Error(m(137, t));
                  break;
                default:
                  fl(l, t, a, x, e, null);
              }
          }
        Bf(l, n, c, s, v, i, u, !1);
        return;
      case 'select':
        (k('invalid', l), (a = i = n = null));
        for (u in e)
          if (e.hasOwnProperty(u) && ((c = e[u]), c != null))
            switch (u) {
              case 'value':
                n = c;
                break;
              case 'defaultValue':
                i = c;
                break;
              case 'multiple':
                a = c;
              default:
                fl(l, t, u, c, e, null);
            }
        ((t = n),
          (e = i),
          (l.multiple = !!a),
          t != null ? we(l, !!a, t, !1) : e != null && we(l, !!a, e, !0));
        return;
      case 'textarea':
        (k('invalid', l), (n = u = a = null));
        for (i in e)
          if (e.hasOwnProperty(i) && ((c = e[i]), c != null))
            switch (i) {
              case 'value':
                a = c;
                break;
              case 'defaultValue':
                u = c;
                break;
              case 'children':
                n = c;
                break;
              case 'dangerouslySetInnerHTML':
                if (c != null) throw Error(m(91));
                break;
              default:
                fl(l, t, i, c, e, null);
            }
        Gf(l, a, u, n);
        return;
      case 'option':
        for (s in e)
          if (e.hasOwnProperty(s) && ((a = e[s]), a != null))
            switch (s) {
              case 'selected':
                l.selected = a && typeof a != 'function' && typeof a != 'symbol';
                break;
              default:
                fl(l, t, s, a, e, null);
            }
        return;
      case 'dialog':
        (k('beforetoggle', l), k('toggle', l), k('cancel', l), k('close', l));
        break;
      case 'iframe':
      case 'object':
        k('load', l);
        break;
      case 'video':
      case 'audio':
        for (a = 0; a < du.length; a++) k(du[a], l);
        break;
      case 'image':
        (k('error', l), k('load', l));
        break;
      case 'details':
        k('toggle', l);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (k('error', l), k('load', l));
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (v in e)
          if (e.hasOwnProperty(v) && ((a = e[v]), a != null))
            switch (v) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(m(137, t));
              default:
                fl(l, t, v, a, e, null);
            }
        return;
      default:
        if (ui(t)) {
          for (x in e)
            e.hasOwnProperty(x) && ((a = e[x]), a !== void 0 && Vc(l, t, x, a, e, void 0));
          return;
        }
    }
    for (c in e) e.hasOwnProperty(c) && ((a = e[c]), a != null && fl(l, t, c, a, e, null));
  }
  function Eh(l, t, e, a) {
    switch (t) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'input':
        var u = null,
          n = null,
          i = null,
          c = null,
          s = null,
          v = null,
          x = null;
        for (g in e) {
          var S = e[g];
          if (e.hasOwnProperty(g) && S != null)
            switch (g) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                s = S;
              default:
                a.hasOwnProperty(g) || fl(l, t, g, null, a, S);
            }
        }
        for (var y in a) {
          var g = a[y];
          if (((S = e[y]), a.hasOwnProperty(y) && (g != null || S != null)))
            switch (y) {
              case 'type':
                n = g;
                break;
              case 'name':
                u = g;
                break;
              case 'checked':
                v = g;
                break;
              case 'defaultChecked':
                x = g;
                break;
              case 'value':
                i = g;
                break;
              case 'defaultValue':
                c = g;
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (g != null) throw Error(m(137, t));
                break;
              default:
                g !== S && fl(l, t, y, g, a, S);
            }
        }
        ei(l, i, c, s, v, x, n, u);
        return;
      case 'select':
        g = i = c = y = null;
        for (n in e)
          if (((s = e[n]), e.hasOwnProperty(n) && s != null))
            switch (n) {
              case 'value':
                break;
              case 'multiple':
                g = s;
              default:
                a.hasOwnProperty(n) || fl(l, t, n, null, a, s);
            }
        for (u in a)
          if (((n = a[u]), (s = e[u]), a.hasOwnProperty(u) && (n != null || s != null)))
            switch (u) {
              case 'value':
                y = n;
                break;
              case 'defaultValue':
                c = n;
                break;
              case 'multiple':
                i = n;
              default:
                n !== s && fl(l, t, u, n, a, s);
            }
        ((t = c),
          (e = i),
          (a = g),
          y != null
            ? we(l, !!e, y, !1)
            : !!a != !!e && (t != null ? we(l, !!e, t, !0) : we(l, !!e, e ? [] : '', !1)));
        return;
      case 'textarea':
        g = y = null;
        for (c in e)
          if (((u = e[c]), e.hasOwnProperty(c) && u != null && !a.hasOwnProperty(c)))
            switch (c) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                fl(l, t, c, null, a, u);
            }
        for (i in a)
          if (((u = a[i]), (n = e[i]), a.hasOwnProperty(i) && (u != null || n != null)))
            switch (i) {
              case 'value':
                y = u;
                break;
              case 'defaultValue':
                g = u;
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (u != null) throw Error(m(91));
                break;
              default:
                u !== n && fl(l, t, i, u, a, n);
            }
        Yf(l, y, g);
        return;
      case 'option':
        for (var M in e)
          if (((y = e[M]), e.hasOwnProperty(M) && y != null && !a.hasOwnProperty(M)))
            switch (M) {
              case 'selected':
                l.selected = !1;
                break;
              default:
                fl(l, t, M, null, a, y);
            }
        for (s in a)
          if (((y = a[s]), (g = e[s]), a.hasOwnProperty(s) && y !== g && (y != null || g != null)))
            switch (s) {
              case 'selected':
                l.selected = y && typeof y != 'function' && typeof y != 'symbol';
                break;
              default:
                fl(l, t, s, y, a, g);
            }
        return;
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var H in e)
          ((y = e[H]),
            e.hasOwnProperty(H) && y != null && !a.hasOwnProperty(H) && fl(l, t, H, null, a, y));
        for (v in a)
          if (((y = a[v]), (g = e[v]), a.hasOwnProperty(v) && y !== g && (y != null || g != null)))
            switch (v) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (y != null) throw Error(m(137, t));
                break;
              default:
                fl(l, t, v, y, a, g);
            }
        return;
      default:
        if (ui(t)) {
          for (var sl in e)
            ((y = e[sl]),
              e.hasOwnProperty(sl) &&
                y !== void 0 &&
                !a.hasOwnProperty(sl) &&
                Vc(l, t, sl, void 0, a, y));
          for (x in a)
            ((y = a[x]),
              (g = e[x]),
              !a.hasOwnProperty(x) ||
                y === g ||
                (y === void 0 && g === void 0) ||
                Vc(l, t, x, y, a, g));
          return;
        }
    }
    for (var r in e)
      ((y = e[r]),
        e.hasOwnProperty(r) && y != null && !a.hasOwnProperty(r) && fl(l, t, r, null, a, y));
    for (S in a)
      ((y = a[S]),
        (g = e[S]),
        !a.hasOwnProperty(S) || y === g || (y == null && g == null) || fl(l, t, S, y, a, g));
  }
  function Lo(l) {
    switch (l) {
      case 'css':
      case 'script':
      case 'font':
      case 'img':
      case 'image':
      case 'input':
      case 'link':
        return !0;
      default:
        return !1;
    }
  }
  function Nh() {
    if (typeof performance.getEntriesByType == 'function') {
      for (
        var l = 0, t = 0, e = performance.getEntriesByType('resource'), a = 0;
        a < e.length;
        a++
      ) {
        var u = e[a],
          n = u.transferSize,
          i = u.initiatorType,
          c = u.duration;
        if (n && c && Lo(i)) {
          for (i = 0, c = u.responseEnd, a += 1; a < e.length; a++) {
            var s = e[a],
              v = s.startTime;
            if (v > c) break;
            var x = s.transferSize,
              S = s.initiatorType;
            x && Lo(S) && ((s = s.responseEnd), (i += x * (s < c ? 1 : (c - v) / (s - v))));
          }
          if ((--a, (t += (8 * (n + i)) / (u.duration / 1e3)), l++, 10 < l)) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && ((l = navigator.connection.downlink), typeof l == 'number')
      ? l
      : 5;
  }
  var Kc = null,
    Jc = null;
  function An(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Vo(l) {
    switch (l) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function Ko(l, t) {
    if (l === 0)
      switch (t) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === 'foreignObject' ? 0 : l;
  }
  function wc(l, t) {
    return (
      l === 'textarea' ||
      l === 'noscript' ||
      typeof t.children == 'string' ||
      typeof t.children == 'number' ||
      typeof t.children == 'bigint' ||
      (typeof t.dangerouslySetInnerHTML == 'object' &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var kc = null;
  function Ah() {
    var l = window.event;
    return l && l.type === 'popstate' ? (l === kc ? !1 : ((kc = l), !0)) : ((kc = null), !1);
  }
  var Jo = typeof setTimeout == 'function' ? setTimeout : void 0,
    _h = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    wo = typeof Promise == 'function' ? Promise : void 0,
    Mh =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof wo < 'u'
          ? function (l) {
              return wo.resolve(null).then(l).catch(Oh);
            }
          : Jo;
  function Oh(l) {
    setTimeout(function () {
      throw l;
    });
  }
  function ve(l) {
    return l === 'head';
  }
  function ko(l, t) {
    var e = t,
      a = 0;
    do {
      var u = e.nextSibling;
      if ((l.removeChild(e), u && u.nodeType === 8))
        if (((e = u.data), e === '/$' || e === '/&')) {
          if (a === 0) {
            (l.removeChild(u), Ea(t));
            return;
          }
          a--;
        } else if (e === '$' || e === '$?' || e === '$~' || e === '$!' || e === '&') a++;
        else if (e === 'html') ru(l.ownerDocument.documentElement);
        else if (e === 'head') {
          ((e = l.ownerDocument.head), ru(e));
          for (var n = e.firstChild; n; ) {
            var i = n.nextSibling,
              c = n.nodeName;
            (n[Oa] ||
              c === 'SCRIPT' ||
              c === 'STYLE' ||
              (c === 'LINK' && n.rel.toLowerCase() === 'stylesheet') ||
              e.removeChild(n),
              (n = i));
          }
        } else e === 'body' && ru(l.ownerDocument.body);
      e = u;
    } while (e);
    Ea(t);
  }
  function Wo(l, t) {
    var e = l;
    l = 0;
    do {
      var a = e.nextSibling;
      if (
        (e.nodeType === 1
          ? t
            ? ((e._stashedDisplay = e.style.display), (e.style.display = 'none'))
            : ((e.style.display = e._stashedDisplay || ''),
              e.getAttribute('style') === '' && e.removeAttribute('style'))
          : e.nodeType === 3 &&
            (t
              ? ((e._stashedText = e.nodeValue), (e.nodeValue = ''))
              : (e.nodeValue = e._stashedText || '')),
        a && a.nodeType === 8)
      )
        if (((e = a.data), e === '/$')) {
          if (l === 0) break;
          l--;
        } else (e !== '$' && e !== '$?' && e !== '$~' && e !== '$!') || l++;
      e = a;
    } while (e);
  }
  function Wc(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (((t = t.nextSibling), e.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (Wc(e), li(e));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (e.rel.toLowerCase() === 'stylesheet') continue;
      }
      l.removeChild(e);
    }
  }
  function Dh(l, t, e, a) {
    for (; l.nodeType === 1; ) {
      var u = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== 'INPUT' || l.type !== 'hidden')) break;
      } else if (a) {
        if (!l[Oa])
          switch (t) {
            case 'meta':
              if (!l.hasAttribute('itemprop')) break;
              return l;
            case 'link':
              if (
                ((n = l.getAttribute('rel')),
                n === 'stylesheet' && l.hasAttribute('data-precedence'))
              )
                break;
              if (
                n !== u.rel ||
                l.getAttribute('href') !== (u.href == null || u.href === '' ? null : u.href) ||
                l.getAttribute('crossorigin') !== (u.crossOrigin == null ? null : u.crossOrigin) ||
                l.getAttribute('title') !== (u.title == null ? null : u.title)
              )
                break;
              return l;
            case 'style':
              if (l.hasAttribute('data-precedence')) break;
              return l;
            case 'script':
              if (
                ((n = l.getAttribute('src')),
                (n !== (u.src == null ? null : u.src) ||
                  l.getAttribute('type') !== (u.type == null ? null : u.type) ||
                  l.getAttribute('crossorigin') !==
                    (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  n &&
                  l.hasAttribute('async') &&
                  !l.hasAttribute('itemprop'))
              )
                break;
              return l;
            default:
              return l;
          }
      } else if (t === 'input' && l.type === 'hidden') {
        var n = u.name == null ? null : '' + u.name;
        if (u.type === 'hidden' && l.getAttribute('name') === n) return l;
      } else return l;
      if (((l = bt(l.nextSibling)), l === null)) break;
    }
    return null;
  }
  function Uh(l, t, e) {
    if (t === '') return null;
    for (; l.nodeType !== 3; )
      if (
        ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') && !e) ||
        ((l = bt(l.nextSibling)), l === null)
      )
        return null;
    return l;
  }
  function $o(l, t) {
    for (; l.nodeType !== 8; )
      if (
        ((l.nodeType !== 1 || l.nodeName !== 'INPUT' || l.type !== 'hidden') && !t) ||
        ((l = bt(l.nextSibling)), l === null)
      )
        return null;
    return l;
  }
  function $c(l) {
    return l.data === '$?' || l.data === '$~';
  }
  function Fc(l) {
    return l.data === '$!' || (l.data === '$?' && l.ownerDocument.readyState !== 'loading');
  }
  function Rh(l, t) {
    var e = l.ownerDocument;
    if (l.data === '$~') l._reactRetry = t;
    else if (l.data !== '$?' || e.readyState !== 'loading') t();
    else {
      var a = function () {
        (t(), e.removeEventListener('DOMContentLoaded', a));
      };
      (e.addEventListener('DOMContentLoaded', a), (l._reactRetry = a));
    }
  }
  function bt(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = l.data),
          t === '$' ||
            t === '$!' ||
            t === '$?' ||
            t === '$~' ||
            t === '&' ||
            t === 'F!' ||
            t === 'F')
        )
          break;
        if (t === '/$' || t === '/&') return null;
      }
    }
    return l;
  }
  var Ic = null;
  function Fo(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === '/$' || e === '/&') {
          if (t === 0) return bt(l.nextSibling);
          t--;
        } else (e !== '$' && e !== '$!' && e !== '$?' && e !== '$~' && e !== '&') || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Io(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === '$' || e === '$!' || e === '$?' || e === '$~' || e === '&') {
          if (t === 0) return l;
          t--;
        } else (e !== '/$' && e !== '/&') || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Po(l, t, e) {
    switch (((t = An(e)), l)) {
      case 'html':
        if (((l = t.documentElement), !l)) throw Error(m(452));
        return l;
      case 'head':
        if (((l = t.head), !l)) throw Error(m(453));
        return l;
      case 'body':
        if (((l = t.body), !l)) throw Error(m(454));
        return l;
      default:
        throw Error(m(451));
    }
  }
  function ru(l) {
    for (var t = l.attributes; t.length; ) l.removeAttributeNode(t[0]);
    li(l);
  }
  var pt = new Map(),
    lr = new Set();
  function _n(l) {
    return typeof l.getRootNode == 'function'
      ? l.getRootNode()
      : l.nodeType === 9
        ? l
        : l.ownerDocument;
  }
  var Wt = N.d;
  N.d = { f: Hh, r: Ch, D: qh, C: Bh, L: Yh, m: Gh, X: Xh, S: Qh, M: Zh };
  function Hh() {
    var l = Wt.f(),
      t = bn();
    return l || t;
  }
  function Ch(l) {
    var t = Ve(l);
    t !== null && t.tag === 5 && t.type === 'form' ? yd(t) : Wt.r(l);
  }
  var za = typeof document > 'u' ? null : document;
  function tr(l, t, e) {
    var a = za;
    if (a && typeof t == 'string' && t) {
      var u = rt(t);
      ((u = 'link[rel="' + l + '"][href="' + u + '"]'),
        typeof e == 'string' && (u += '[crossorigin="' + e + '"]'),
        lr.has(u) ||
          (lr.add(u),
          (l = { rel: l, crossOrigin: e, href: t }),
          a.querySelector(u) === null &&
            ((t = a.createElement('link')), Yl(t, 'link', l), Dl(t), a.head.appendChild(t))));
    }
  }
  function qh(l) {
    (Wt.D(l), tr('dns-prefetch', l, null));
  }
  function Bh(l, t) {
    (Wt.C(l, t), tr('preconnect', l, t));
  }
  function Yh(l, t, e) {
    Wt.L(l, t, e);
    var a = za;
    if (a && l && t) {
      var u = 'link[rel="preload"][as="' + rt(t) + '"]';
      t === 'image' && e && e.imageSrcSet
        ? ((u += '[imagesrcset="' + rt(e.imageSrcSet) + '"]'),
          typeof e.imageSizes == 'string' && (u += '[imagesizes="' + rt(e.imageSizes) + '"]'))
        : (u += '[href="' + rt(l) + '"]');
      var n = u;
      switch (t) {
        case 'style':
          n = ja(l);
          break;
        case 'script':
          n = Ta(l);
      }
      pt.has(n) ||
        ((l = U(
          { rel: 'preload', href: t === 'image' && e && e.imageSrcSet ? void 0 : l, as: t },
          e
        )),
        pt.set(n, l),
        a.querySelector(u) !== null ||
          (t === 'style' && a.querySelector(mu(n))) ||
          (t === 'script' && a.querySelector(hu(n))) ||
          ((t = a.createElement('link')), Yl(t, 'link', l), Dl(t), a.head.appendChild(t)));
    }
  }
  function Gh(l, t) {
    Wt.m(l, t);
    var e = za;
    if (e && l) {
      var a = t && typeof t.as == 'string' ? t.as : 'script',
        u = 'link[rel="modulepreload"][as="' + rt(a) + '"][href="' + rt(l) + '"]',
        n = u;
      switch (a) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          n = Ta(l);
      }
      if (
        !pt.has(n) &&
        ((l = U({ rel: 'modulepreload', href: l }, t)), pt.set(n, l), e.querySelector(u) === null)
      ) {
        switch (a) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (e.querySelector(hu(n))) return;
        }
        ((a = e.createElement('link')), Yl(a, 'link', l), Dl(a), e.head.appendChild(a));
      }
    }
  }
  function Qh(l, t, e) {
    Wt.S(l, t, e);
    var a = za;
    if (a && l) {
      var u = Ke(a).hoistableStyles,
        n = ja(l);
      t = t || 'default';
      var i = u.get(n);
      if (!i) {
        var c = { loading: 0, preload: null };
        if ((i = a.querySelector(mu(n)))) c.loading = 5;
        else {
          ((l = U({ rel: 'stylesheet', href: l, 'data-precedence': t }, e)),
            (e = pt.get(n)) && Pc(l, e));
          var s = (i = a.createElement('link'));
          (Dl(s),
            Yl(s, 'link', l),
            (s._p = new Promise(function (v, x) {
              ((s.onload = v), (s.onerror = x));
            })),
            s.addEventListener('load', function () {
              c.loading |= 1;
            }),
            s.addEventListener('error', function () {
              c.loading |= 2;
            }),
            (c.loading |= 4),
            Mn(i, t, a));
        }
        ((i = { type: 'stylesheet', instance: i, count: 1, state: c }), u.set(n, i));
      }
    }
  }
  function Xh(l, t) {
    Wt.X(l, t);
    var e = za;
    if (e && l) {
      var a = Ke(e).hoistableScripts,
        u = Ta(l),
        n = a.get(u);
      n ||
        ((n = e.querySelector(hu(u))),
        n ||
          ((l = U({ src: l, async: !0 }, t)),
          (t = pt.get(u)) && lf(l, t),
          (n = e.createElement('script')),
          Dl(n),
          Yl(n, 'link', l),
          e.head.appendChild(n)),
        (n = { type: 'script', instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function Zh(l, t) {
    Wt.M(l, t);
    var e = za;
    if (e && l) {
      var a = Ke(e).hoistableScripts,
        u = Ta(l),
        n = a.get(u);
      n ||
        ((n = e.querySelector(hu(u))),
        n ||
          ((l = U({ src: l, async: !0, type: 'module' }, t)),
          (t = pt.get(u)) && lf(l, t),
          (n = e.createElement('script')),
          Dl(n),
          Yl(n, 'link', l),
          e.head.appendChild(n)),
        (n = { type: 'script', instance: n, count: 1, state: null }),
        a.set(u, n));
    }
  }
  function er(l, t, e, a) {
    var u = (u = J.current) ? _n(u) : null;
    if (!u) throw Error(m(446));
    switch (l) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof e.precedence == 'string' && typeof e.href == 'string'
          ? ((t = ja(e.href)),
            (e = Ke(u).hoistableStyles),
            (a = e.get(t)),
            a || ((a = { type: 'style', instance: null, count: 0, state: null }), e.set(t, a)),
            a)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (
          e.rel === 'stylesheet' &&
          typeof e.href == 'string' &&
          typeof e.precedence == 'string'
        ) {
          l = ja(e.href);
          var n = Ke(u).hoistableStyles,
            i = n.get(l);
          if (
            (i ||
              ((u = u.ownerDocument || u),
              (i = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              n.set(l, i),
              (n = u.querySelector(mu(l))) && !n._p && ((i.instance = n), (i.state.loading = 5)),
              pt.has(l) ||
                ((e = {
                  rel: 'preload',
                  as: 'style',
                  href: e.href,
                  crossOrigin: e.crossOrigin,
                  integrity: e.integrity,
                  media: e.media,
                  hrefLang: e.hrefLang,
                  referrerPolicy: e.referrerPolicy,
                }),
                pt.set(l, e),
                n || Lh(u, l, e, i.state))),
            t && a === null)
          )
            throw Error(m(528, ''));
          return i;
        }
        if (t && a !== null) throw Error(m(529, ''));
        return null;
      case 'script':
        return (
          (t = e.async),
          (e = e.src),
          typeof e == 'string' && t && typeof t != 'function' && typeof t != 'symbol'
            ? ((t = Ta(e)),
              (e = Ke(u).hoistableScripts),
              (a = e.get(t)),
              a || ((a = { type: 'script', instance: null, count: 0, state: null }), e.set(t, a)),
              a)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(m(444, l));
    }
  }
  function ja(l) {
    return 'href="' + rt(l) + '"';
  }
  function mu(l) {
    return 'link[rel="stylesheet"][' + l + ']';
  }
  function ar(l) {
    return U({}, l, { 'data-precedence': l.precedence, precedence: null });
  }
  function Lh(l, t, e, a) {
    l.querySelector('link[rel="preload"][as="style"][' + t + ']')
      ? (a.loading = 1)
      : ((t = l.createElement('link')),
        (a.preload = t),
        t.addEventListener('load', function () {
          return (a.loading |= 1);
        }),
        t.addEventListener('error', function () {
          return (a.loading |= 2);
        }),
        Yl(t, 'link', e),
        Dl(t),
        l.head.appendChild(t));
  }
  function Ta(l) {
    return '[src="' + rt(l) + '"]';
  }
  function hu(l) {
    return 'script[async]' + l;
  }
  function ur(l, t, e) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case 'style':
          var a = l.querySelector('style[data-href~="' + rt(e.href) + '"]');
          if (a) return ((t.instance = a), Dl(a), a);
          var u = U({}, e, {
            'data-href': e.href,
            'data-precedence': e.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (l.ownerDocument || l).createElement('style')),
            Dl(a),
            Yl(a, 'style', u),
            Mn(a, e.precedence, l),
            (t.instance = a)
          );
        case 'stylesheet':
          u = ja(e.href);
          var n = l.querySelector(mu(u));
          if (n) return ((t.state.loading |= 4), (t.instance = n), Dl(n), n);
          ((a = ar(e)),
            (u = pt.get(u)) && Pc(a, u),
            (n = (l.ownerDocument || l).createElement('link')),
            Dl(n));
          var i = n;
          return (
            (i._p = new Promise(function (c, s) {
              ((i.onload = c), (i.onerror = s));
            })),
            Yl(n, 'link', a),
            (t.state.loading |= 4),
            Mn(n, e.precedence, l),
            (t.instance = n)
          );
        case 'script':
          return (
            (n = Ta(e.src)),
            (u = l.querySelector(hu(n)))
              ? ((t.instance = u), Dl(u), u)
              : ((a = e),
                (u = pt.get(n)) && ((a = U({}, e)), lf(a, u)),
                (l = l.ownerDocument || l),
                (u = l.createElement('script')),
                Dl(u),
                Yl(u, 'link', a),
                l.head.appendChild(u),
                (t.instance = u))
          );
        case 'void':
          return null;
        default:
          throw Error(m(443, t.type));
      }
    else
      t.type === 'stylesheet' &&
        (t.state.loading & 4) === 0 &&
        ((a = t.instance), (t.state.loading |= 4), Mn(a, e.precedence, l));
    return t.instance;
  }
  function Mn(l, t, e) {
    for (
      var a = e.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        u = a.length ? a[a.length - 1] : null,
        n = u,
        i = 0;
      i < a.length;
      i++
    ) {
      var c = a[i];
      if (c.dataset.precedence === t) n = c;
      else if (n !== u) break;
    }
    n
      ? n.parentNode.insertBefore(l, n.nextSibling)
      : ((t = e.nodeType === 9 ? e.head : e), t.insertBefore(l, t.firstChild));
  }
  function Pc(l, t) {
    (l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
      l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
      l.title == null && (l.title = t.title));
  }
  function lf(l, t) {
    (l.crossOrigin == null && (l.crossOrigin = t.crossOrigin),
      l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy),
      l.integrity == null && (l.integrity = t.integrity));
  }
  var On = null;
  function nr(l, t, e) {
    if (On === null) {
      var a = new Map(),
        u = (On = new Map());
      u.set(e, a);
    } else ((u = On), (a = u.get(e)), a || ((a = new Map()), u.set(e, a)));
    if (a.has(l)) return a;
    for (a.set(l, null), e = e.getElementsByTagName(l), u = 0; u < e.length; u++) {
      var n = e[u];
      if (
        !(n[Oa] || n[Hl] || (l === 'link' && n.getAttribute('rel') === 'stylesheet')) &&
        n.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var i = n.getAttribute(t) || '';
        i = l + i;
        var c = a.get(i);
        c ? c.push(n) : a.set(i, [n]);
      }
    }
    return a;
  }
  function ir(l, t, e) {
    ((l = l.ownerDocument || l),
      l.head.insertBefore(e, t === 'title' ? l.querySelector('head > title') : null));
  }
  function Vh(l, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
    switch (l) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (typeof t.precedence != 'string' || typeof t.href != 'string' || t.href === '') break;
        return !0;
      case 'link':
        if (
          typeof t.rel != 'string' ||
          typeof t.href != 'string' ||
          t.href === '' ||
          t.onLoad ||
          t.onError
        )
          break;
        switch (t.rel) {
          case 'stylesheet':
            return ((l = t.disabled), typeof t.precedence == 'string' && l == null);
          default:
            return !0;
        }
      case 'script':
        if (
          t.async &&
          typeof t.async != 'function' &&
          typeof t.async != 'symbol' &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function cr(l) {
    return !(l.type === 'stylesheet' && (l.state.loading & 3) === 0);
  }
  function Kh(l, t, e, a) {
    if (
      e.type === 'stylesheet' &&
      (typeof a.media != 'string' || matchMedia(a.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var u = ja(a.href),
          n = t.querySelector(mu(u));
        if (n) {
          ((t = n._p),
            t !== null &&
              typeof t == 'object' &&
              typeof t.then == 'function' &&
              (l.count++, (l = Dn.bind(l)), t.then(l, l)),
            (e.state.loading |= 4),
            (e.instance = n),
            Dl(n));
          return;
        }
        ((n = t.ownerDocument || t),
          (a = ar(a)),
          (u = pt.get(u)) && Pc(a, u),
          (n = n.createElement('link')),
          Dl(n));
        var i = n;
        ((i._p = new Promise(function (c, s) {
          ((i.onload = c), (i.onerror = s));
        })),
          Yl(n, 'link', a),
          (e.instance = n));
      }
      (l.stylesheets === null && (l.stylesheets = new Map()),
        l.stylesheets.set(e, t),
        (t = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (l.count++,
          (e = Dn.bind(l)),
          t.addEventListener('load', e),
          t.addEventListener('error', e)));
    }
  }
  var tf = 0;
  function Jh(l, t) {
    return (
      l.stylesheets && l.count === 0 && Rn(l, l.stylesheets),
      0 < l.count || 0 < l.imgCount
        ? function (e) {
            var a = setTimeout(function () {
              if ((l.stylesheets && Rn(l, l.stylesheets), l.unsuspend)) {
                var n = l.unsuspend;
                ((l.unsuspend = null), n());
              }
            }, 6e4 + t);
            0 < l.imgBytes && tf === 0 && (tf = 62500 * Nh());
            var u = setTimeout(
              function () {
                if (
                  ((l.waitingForImages = !1),
                  l.count === 0 && (l.stylesheets && Rn(l, l.stylesheets), l.unsuspend))
                ) {
                  var n = l.unsuspend;
                  ((l.unsuspend = null), n());
                }
              },
              (l.imgBytes > tf ? 50 : 800) + t
            );
            return (
              (l.unsuspend = e),
              function () {
                ((l.unsuspend = null), clearTimeout(a), clearTimeout(u));
              }
            );
          }
        : null
    );
  }
  function Dn() {
    if ((this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))) {
      if (this.stylesheets) Rn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        ((this.unsuspend = null), l());
      }
    }
  }
  var Un = null;
  function Rn(l, t) {
    ((l.stylesheets = null),
      l.unsuspend !== null &&
        (l.count++, (Un = new Map()), t.forEach(wh, l), (Un = null), Dn.call(l)));
  }
  function wh(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Un.get(l);
      if (e) var a = e.get(null);
      else {
        ((e = new Map()), Un.set(l, e));
        for (
          var u = l.querySelectorAll('link[data-precedence],style[data-precedence]'), n = 0;
          n < u.length;
          n++
        ) {
          var i = u[n];
          (i.nodeName === 'LINK' || i.getAttribute('media') !== 'not all') &&
            (e.set(i.dataset.precedence, i), (a = i));
        }
        a && e.set(null, a);
      }
      ((u = t.instance),
        (i = u.getAttribute('data-precedence')),
        (n = e.get(i) || a),
        n === a && e.set(null, u),
        e.set(i, u),
        this.count++,
        (a = Dn.bind(this)),
        u.addEventListener('load', a),
        u.addEventListener('error', a),
        n
          ? n.parentNode.insertBefore(u, n.nextSibling)
          : ((l = l.nodeType === 9 ? l.head : l), l.insertBefore(u, l.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var vu = {
    $$typeof: rl,
    Provider: null,
    Consumer: null,
    _currentValue: B,
    _currentValue2: B,
    _threadCount: 0,
  };
  function kh(l, t, e, a, u, n, i, c, s) {
    ((this.tag = 1),
      (this.containerInfo = l),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = $n(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = $n(0)),
      (this.hiddenUpdates = $n(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = u),
      (this.onCaughtError = n),
      (this.onRecoverableError = i),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = s),
      (this.incompleteTransitions = new Map()));
  }
  function fr(l, t, e, a, u, n, i, c, s, v, x, S) {
    return (
      (l = new kh(l, t, e, i, s, v, x, S, c)),
      (t = 1),
      n === !0 && (t |= 24),
      (n = ut(3, null, null, t)),
      (l.current = n),
      (n.stateNode = l),
      (t = Hi()),
      t.refCount++,
      (l.pooledCache = t),
      t.refCount++,
      (n.memoizedState = { element: a, isDehydrated: e, cache: t }),
      Yi(n),
      l
    );
  }
  function sr(l) {
    return l ? ((l = ta), l) : ta;
  }
  function dr(l, t, e, a, u, n) {
    ((u = sr(u)),
      a.context === null ? (a.context = u) : (a.pendingContext = u),
      (a = ue(t)),
      (a.payload = { element: e }),
      (n = n === void 0 ? null : n),
      n !== null && (a.callback = n),
      (e = ne(l, a, t)),
      e !== null && (Pl(e, l, t), wa(e, l, t)));
  }
  function or(l, t) {
    if (((l = l.memoizedState), l !== null && l.dehydrated !== null)) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function ef(l, t) {
    (or(l, t), (l = l.alternate) && or(l, t));
  }
  function rr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = _e(l, 67108864);
      (t !== null && Pl(t, l, 67108864), ef(l, 67108864));
    }
  }
  function mr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = st();
      t = Fn(t);
      var e = _e(l, t);
      (e !== null && Pl(e, l, t), ef(l, t));
    }
  }
  var Hn = !0;
  function Wh(l, t, e, a) {
    var u = b.T;
    b.T = null;
    var n = N.p;
    try {
      ((N.p = 2), af(l, t, e, a));
    } finally {
      ((N.p = n), (b.T = u));
    }
  }
  function $h(l, t, e, a) {
    var u = b.T;
    b.T = null;
    var n = N.p;
    try {
      ((N.p = 8), af(l, t, e, a));
    } finally {
      ((N.p = n), (b.T = u));
    }
  }
  function af(l, t, e, a) {
    if (Hn) {
      var u = uf(a);
      if (u === null) (Lc(l, t, a, Cn, e), vr(l, a));
      else if (Ih(u, l, t, e, a)) a.stopPropagation();
      else if ((vr(l, a), t & 4 && -1 < Fh.indexOf(l))) {
        for (; u !== null; ) {
          var n = Ve(u);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (((n = n.stateNode), n.current.memoizedState.isDehydrated)) {
                  var i = je(n.pendingLanes);
                  if (i !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var s = 1 << (31 - et(i));
                      ((c.entanglements[1] |= s), (i &= ~s));
                    }
                    (Ot(n), (tl & 6) === 0 && ((gn = lt() + 500), su(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((c = _e(n, 2)), c !== null && Pl(c, n, 2), bn(), ef(n, 2));
            }
          if (((n = uf(a)), n === null && Lc(l, t, a, Cn, e), n === u)) break;
          u = n;
        }
        u !== null && a.stopPropagation();
      } else Lc(l, t, a, null, e);
    }
  }
  function uf(l) {
    return ((l = ii(l)), nf(l));
  }
  var Cn = null;
  function nf(l) {
    if (((Cn = null), (l = Le(l)), l !== null)) {
      var t = Y(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (((l = V(t)), l !== null)) return l;
          l = null;
        } else if (e === 31) {
          if (((l = F(t)), l !== null)) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return ((Cn = l), null);
  }
  function hr(l) {
    switch (l) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8;
      case 'message':
        switch (qr()) {
          case Sf:
            return 2;
          case zf:
            return 8;
          case ju:
          case Br:
            return 32;
          case jf:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var cf = !1,
    ye = null,
    ge = null,
    xe = null,
    yu = new Map(),
    gu = new Map(),
    be = [],
    Fh =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' '
      );
  function vr(l, t) {
    switch (l) {
      case 'focusin':
      case 'focusout':
        ye = null;
        break;
      case 'dragenter':
      case 'dragleave':
        ge = null;
        break;
      case 'mouseover':
      case 'mouseout':
        xe = null;
        break;
      case 'pointerover':
      case 'pointerout':
        yu.delete(t.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        gu.delete(t.pointerId);
    }
  }
  function xu(l, t, e, a, u, n) {
    return l === null || l.nativeEvent !== n
      ? ((l = {
          blockedOn: t,
          domEventName: e,
          eventSystemFlags: a,
          nativeEvent: n,
          targetContainers: [u],
        }),
        t !== null && ((t = Ve(t)), t !== null && rr(t)),
        l)
      : ((l.eventSystemFlags |= a),
        (t = l.targetContainers),
        u !== null && t.indexOf(u) === -1 && t.push(u),
        l);
  }
  function Ih(l, t, e, a, u) {
    switch (t) {
      case 'focusin':
        return ((ye = xu(ye, l, t, e, a, u)), !0);
      case 'dragenter':
        return ((ge = xu(ge, l, t, e, a, u)), !0);
      case 'mouseover':
        return ((xe = xu(xe, l, t, e, a, u)), !0);
      case 'pointerover':
        var n = u.pointerId;
        return (yu.set(n, xu(yu.get(n) || null, l, t, e, a, u)), !0);
      case 'gotpointercapture':
        return ((n = u.pointerId), gu.set(n, xu(gu.get(n) || null, l, t, e, a, u)), !0);
    }
    return !1;
  }
  function yr(l) {
    var t = Le(l.target);
    if (t !== null) {
      var e = Y(t);
      if (e !== null) {
        if (((t = e.tag), t === 13)) {
          if (((t = V(e)), t !== null)) {
            ((l.blockedOn = t),
              Mf(l.priority, function () {
                mr(e);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = F(e)), t !== null)) {
            ((l.blockedOn = t),
              Mf(l.priority, function () {
                mr(e);
              }));
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function qn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = uf(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var a = new e.constructor(e.type, e);
        ((ni = a), e.target.dispatchEvent(a), (ni = null));
      } else return ((t = Ve(e)), t !== null && rr(t), (l.blockedOn = e), !1);
      t.shift();
    }
    return !0;
  }
  function gr(l, t, e) {
    qn(l) && e.delete(t);
  }
  function Ph() {
    ((cf = !1),
      ye !== null && qn(ye) && (ye = null),
      ge !== null && qn(ge) && (ge = null),
      xe !== null && qn(xe) && (xe = null),
      yu.forEach(gr),
      gu.forEach(gr));
  }
  function Bn(l, t) {
    l.blockedOn === t &&
      ((l.blockedOn = null),
      cf || ((cf = !0), T.unstable_scheduleCallback(T.unstable_NormalPriority, Ph)));
  }
  var Yn = null;
  function xr(l) {
    Yn !== l &&
      ((Yn = l),
      T.unstable_scheduleCallback(T.unstable_NormalPriority, function () {
        Yn === l && (Yn = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t],
            a = l[t + 1],
            u = l[t + 2];
          if (typeof a != 'function') {
            if (nf(a || e) === null) continue;
            break;
          }
          var n = Ve(e);
          n !== null &&
            (l.splice(t, 3),
            (t -= 3),
            uc(n, { pending: !0, data: u, method: e.method, action: a }, a, u));
        }
      }));
  }
  function Ea(l) {
    function t(s) {
      return Bn(s, l);
    }
    (ye !== null && Bn(ye, l),
      ge !== null && Bn(ge, l),
      xe !== null && Bn(xe, l),
      yu.forEach(t),
      gu.forEach(t));
    for (var e = 0; e < be.length; e++) {
      var a = be[e];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < be.length && ((e = be[0]), e.blockedOn === null); )
      (yr(e), e.blockedOn === null && be.shift());
    if (((e = (l.ownerDocument || l).$$reactFormReplay), e != null))
      for (a = 0; a < e.length; a += 3) {
        var u = e[a],
          n = e[a + 1],
          i = u[wl] || null;
        if (typeof n == 'function') i || xr(e);
        else if (i) {
          var c = null;
          if (n && n.hasAttribute('formAction')) {
            if (((u = n), (i = n[wl] || null))) c = i.formAction;
            else if (nf(u) !== null) continue;
          } else c = i.action;
          (typeof c == 'function' ? (e[a + 1] = c) : (e.splice(a, 3), (a -= 3)), xr(e));
        }
      }
  }
  function br() {
    function l(n) {
      n.canIntercept &&
        n.info === 'react-transition' &&
        n.intercept({
          handler: function () {
            return new Promise(function (i) {
              return (u = i);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function t() {
      (u !== null && (u(), (u = null)), a || setTimeout(e, 20));
    }
    function e() {
      if (!a && !navigation.transition) {
        var n = navigation.currentEntry;
        n &&
          n.url != null &&
          navigation.navigate(n.url, {
            state: n.getState(),
            info: 'react-transition',
            history: 'replace',
          });
      }
    }
    if (typeof navigation == 'object') {
      var a = !1,
        u = null;
      return (
        navigation.addEventListener('navigate', l),
        navigation.addEventListener('navigatesuccess', t),
        navigation.addEventListener('navigateerror', t),
        setTimeout(e, 100),
        function () {
          ((a = !0),
            navigation.removeEventListener('navigate', l),
            navigation.removeEventListener('navigatesuccess', t),
            navigation.removeEventListener('navigateerror', t),
            u !== null && (u(), (u = null)));
        }
      );
    }
  }
  function ff(l) {
    this._internalRoot = l;
  }
  ((Gn.prototype.render = ff.prototype.render =
    function (l) {
      var t = this._internalRoot;
      if (t === null) throw Error(m(409));
      var e = t.current,
        a = st();
      dr(e, a, l, t, null, null);
    }),
    (Gn.prototype.unmount = ff.prototype.unmount =
      function () {
        var l = this._internalRoot;
        if (l !== null) {
          this._internalRoot = null;
          var t = l.containerInfo;
          (dr(l.current, 2, null, l, null, null), bn(), (t[Ze] = null));
        }
      }));
  function Gn(l) {
    this._internalRoot = l;
  }
  Gn.prototype.unstable_scheduleHydration = function (l) {
    if (l) {
      var t = _f();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < be.length && t !== 0 && t < be[e].priority; e++);
      (be.splice(e, 0, l), e === 0 && yr(l));
    }
  };
  var pr = C.version;
  if (pr !== '19.2.5') throw Error(m(527, pr, '19.2.5'));
  N.findDOMNode = function (l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == 'function'
        ? Error(m(188))
        : ((l = Object.keys(l).join(',')), Error(m(268, l)));
    return ((l = z(t)), (l = l !== null ? Q(l) : null), (l = l === null ? null : l.stateNode), l);
  };
  var l0 = {
    bundleType: 0,
    version: '19.2.5',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: b,
    reconcilerVersion: '19.2.5',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var Qn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qn.isDisabled && Qn.supportsFiber)
      try {
        ((Aa = Qn.inject(l0)), (tt = Qn));
      } catch {}
  }
  return (
    (pu.createRoot = function (l, t) {
      if (!q(l)) throw Error(m(299));
      var e = !1,
        a = '',
        u = Nd,
        n = Ad,
        i = _d;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (e = !0),
          t.identifierPrefix !== void 0 && (a = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (u = t.onUncaughtError),
          t.onCaughtError !== void 0 && (n = t.onCaughtError),
          t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
        (t = fr(l, 1, !1, null, null, e, a, null, u, n, i, br)),
        (l[Ze] = t.current),
        Zc(l),
        new ff(t)
      );
    }),
    (pu.hydrateRoot = function (l, t, e) {
      if (!q(l)) throw Error(m(299));
      var a = !1,
        u = '',
        n = Nd,
        i = Ad,
        c = _d,
        s = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (a = !0),
          e.identifierPrefix !== void 0 && (u = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (n = e.onUncaughtError),
          e.onCaughtError !== void 0 && (i = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError),
          e.formState !== void 0 && (s = e.formState)),
        (t = fr(l, 1, !0, t, e ?? null, a, u, s, n, i, c, br)),
        (t.context = sr(null)),
        (e = t.current),
        (a = st()),
        (a = Fn(a)),
        (u = ue(a)),
        (u.callback = null),
        ne(e, u, a),
        (e = a),
        (t.current.lanes = e),
        Ma(t, e),
        Ot(t),
        (l[Ze] = t.current),
        Zc(l),
        new Gn(t)
      );
    }),
    (pu.version = '19.2.5'),
    pu
  );
}
var Or;
function d0() {
  if (Or) return of.exports;
  Or = 1;
  function T() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(T);
      } catch (C) {
        console.error(C);
      }
  }
  return (T(), (of.exports = s0()), of.exports);
}
var o0 = d0();
function r0({ active: T, onNavigate: C }) {
  const _ = (F) =>
      `w-[52px] h-[52px] rounded-[14px] grid place-items-center transition-all ${T === F ? 'bg-accent-soft' : 'bg-transparent group-hover:bg-muted'}`,
    m = (F) =>
      `transition-colors ${T === F ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'}`,
    q = (F) =>
      `text-micro-xs font-medium transition-colors ${T === F ? 'text-accent' : 'text-muted-foreground'}`,
    Y = (F) => (E) => {
      (E.preventDefault(), C == null || C(F));
    },
    V = !!C;
  return f.jsxs('aside', {
    className:
      'w-[100px] shrink-0 bg-transparent flex flex-col items-center gap-2 py-1.5 px-2 pb-2 overflow-hidden backdrop-blur-[12px] relative z-2 pt-[50px] text-foreground',
    children: [
      f.jsx('div', {
        onClick: Y('dashboard'),
        className: V ? 'cursor-pointer' : '',
        children: f.jsx('div', {
          className:
            'w-[52px] h-[52px] rounded-[14px] bg-gradient-to-br from-accent to-pink-500 grid place-items-center shadow-[0_2px_6px_rgba(79,70,229,0.3),0_1px_0_rgba(255,255,255,0.2)_inset]',
          children: f.jsx('svg', {
            viewBox: '0 0 24 24',
            width: '26',
            height: '26',
            fill: 'none',
            stroke: 'white',
            strokeWidth: '2.5',
            strokeLinecap: 'round',
            children: f.jsx('path', {
              d: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
            }),
          }),
        }),
      }),
      f.jsxs('div', {
        className: `flex flex-col items-center gap-0.5 ${V ? 'group cursor-pointer' : ''}`,
        onClick: Y('routines/new'),
        children: [
          f.jsx('div', {
            className:
              'w-[52px] h-[52px] rounded-[14px] bg-transparent grid place-items-center transition-all group-hover:bg-muted',
            children: f.jsx('svg', {
              viewBox: '0 0 16 16',
              width: '22',
              height: '22',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              className: 'text-muted-foreground group-hover:text-foreground transition-colors',
              children: f.jsx('path', { d: 'M8 3v10M3 8h10' }),
            }),
          }),
          f.jsx('span', {
            className: 'text-micro-xs font-medium text-muted-foreground',
            children: 'New',
          }),
        ],
      }),
      f.jsxs('div', {
        className: `flex flex-col items-center gap-0.5 ${V ? 'group cursor-pointer' : ''}`,
        onClick: Y('routines'),
        children: [
          f.jsx('div', {
            className: _('routines'),
            children: f.jsx('svg', {
              viewBox: '0 0 16 16',
              width: '22',
              height: '22',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              className: m('routines'),
              children: f.jsx('path', { d: 'M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z' }),
            }),
          }),
          f.jsx('span', { className: q('routines'), children: 'Routines' }),
        ],
      }),
      f.jsxs('div', {
        className: `flex flex-col items-center gap-0.5 ${V ? 'group cursor-pointer' : ''}`,
        onClick: Y('runs'),
        children: [
          f.jsx('div', {
            className: _('runs'),
            children: f.jsx('svg', {
              viewBox: '0 0 16 16',
              width: '22',
              height: '22',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              className: m('runs'),
              children: f.jsx('path', { d: 'M4 3v10l8-5z', fill: 'currentColor' }),
            }),
          }),
          f.jsx('span', { className: q('runs'), children: 'Runs' }),
        ],
      }),
      f.jsxs('div', {
        className: `flex flex-col items-center gap-0.5 ${V ? 'group cursor-pointer' : ''}`,
        onClick: Y('settings'),
        children: [
          f.jsx('div', {
            className: _('settings'),
            children: f.jsxs('svg', {
              viewBox: '0 0 16 16',
              width: '20',
              height: '20',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              className: m('settings'),
              children: [
                f.jsx('circle', { cx: '8', cy: '8', r: '2.5' }),
                f.jsx('path', {
                  d: 'M8 1.5v2M8 12.5v2M12.5 8h2M1.5 8h2M11.18 4.82l1.41-1.41M3.4 12.6l1.42-1.42M11.18 11.18l1.41 1.41M3.4 3.4l1.42 1.42',
                }),
              ],
            }),
          }),
          f.jsx('span', { className: q('settings'), children: 'Settings' }),
        ],
      }),
    ],
  });
}
function Ln({
  active: T,
  breadcrumbs: C,
  children: _,
  height: m = 480,
  scrollable: q = !0,
  onNavigate: Y,
  onBack: V,
}) {
  return f.jsx('div', {
    className:
      'rounded-xl overflow-hidden border border-muted shadow-md md:border-border-strong md:shadow-lg',
    children: f.jsx('div', {
      className:
        'relative bg-canvas md:bg-[radial-gradient(900px_600px_at_0%_100%,rgba(168,85,247,0.18)_0%,transparent_60%),radial-gradient(800px_500px_at_30%_0%,rgba(79,70,229,0.14)_0%,transparent_60%),radial-gradient(600px_400px_at_100%_80%,rgba(236,72,153,0.12)_0%,transparent_60%)] md:bg-surface app-window-chrome',
      style: { '--app-height': typeof m == 'number' ? `${m}px` : m },
      children: f.jsxs('div', {
        className: 'md:flex md:h-full relative z-1',
        children: [
          f.jsx('div', {
            className:
              'hidden md:block group-hover/hero:opacity-20 transition-opacity duration-300',
            children: f.jsx(r0, { active: T, onNavigate: Y }),
          }),
          f.jsxs('div', {
            className: 'md:flex-1 md:flex flex-col min-w-0 md:overflow-hidden',
            children: [
              f.jsxs('div', {
                className:
                  'hidden md:flex items-center gap-2.5 px-5 h-11 bg-transparent backdrop-blur-[20px] shrink-0 group-hover/hero:opacity-20 transition-opacity duration-300',
                children: [
                  f.jsxs('div', {
                    className: 'flex gap-1.5 mr-1',
                    children: [
                      f.jsx('span', {
                        className: 'w-3 h-3 rounded-full',
                        style: { background: '#ff5f57' },
                      }),
                      f.jsx('span', {
                        className: 'w-3 h-3 rounded-full',
                        style: { background: '#febc2e' },
                      }),
                      f.jsx('span', {
                        className: 'w-3 h-3 rounded-full',
                        style: { background: '#28c840' },
                      }),
                    ],
                  }),
                  f.jsxs('div', {
                    className: 'flex gap-0.5',
                    children: [
                      f.jsx('button', {
                        className:
                          'w-7 h-7 rounded-sm border-none bg-transparent text-muted-foreground grid place-items-center p-0 cursor-pointer hover:bg-muted hover:text-foreground transition-all',
                        onClick: V,
                        children: f.jsx('svg', {
                          viewBox: '0 0 16 16',
                          width: '14',
                          height: '14',
                          fill: 'none',
                          stroke: 'currentColor',
                          strokeWidth: '1.5',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round',
                          children: f.jsx('path', { d: 'm10 3-5 5 5 5' }),
                        }),
                      }),
                      f.jsx('button', {
                        className:
                          'w-7 h-7 rounded-sm border-none bg-transparent text-muted-foreground grid place-items-center p-0 opacity-30 cursor-not-allowed',
                        children: f.jsx('svg', {
                          viewBox: '0 0 16 16',
                          width: '14',
                          height: '14',
                          fill: 'none',
                          stroke: 'currentColor',
                          strokeWidth: '1.5',
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round',
                          children: f.jsx('path', { d: 'm6 3 5 5-5 5' }),
                        }),
                      }),
                    ],
                  }),
                  f.jsx('div', {
                    className:
                      'flex items-center gap-1 text-body-sm font-medium text-foreground min-w-0',
                    children: C.map((F, E) =>
                      f.jsxs(
                        'span',
                        {
                          className: 'flex items-center gap-1',
                          children: [
                            E > 0 &&
                              f.jsx('span', {
                                className: 'text-fg-dim font-mono text-xs',
                                children: '/',
                              }),
                            F.onClick
                              ? f.jsx('span', {
                                  onClick: F.onClick,
                                  className:
                                    'text-muted-foreground cursor-pointer hover:text-foreground transition-colors',
                                  children: F.label,
                                })
                              : f.jsx('span', { className: 'text-foreground', children: F.label }),
                          ],
                        },
                        E
                      )
                    ),
                  }),
                ],
              }),
              f.jsx('div', {
                className:
                  'md:flex-1 md:bg-canvas md:border-t md:border-l md:border-muted md:rounded-tl-xl md:overflow-hidden',
                children: f.jsx('div', {
                  className: `md:h-full ${q ? 'overflow-y-auto' : 'overflow-hidden'}`,
                  children: f.jsx('main', {
                    className: 'max-w-[1060px] mx-auto w-full py-8 px-4 md:px-12 pb-20',
                    children: _,
                  }),
                }),
              }),
            ],
          }),
        ],
      }),
    }),
  });
}
const m0 = {
  pending: 'text-pending',
  running: 'text-running',
  success: 'text-success',
  failed: 'text-destructive',
  cancelled: 'text-warning',
};
function h0({ status: T }) {
  const C = m0[T] ?? 'text-pending';
  return f.jsxs('span', {
    className: `inline-flex items-center gap-1.5 font-mono text-xs ${C}`,
    children: [
      f.jsx('span', {
        className: `w-[7px] h-[7px] rounded-full bg-current shadow-[0_0_0_3px_color-mix(in_srgb,currentColor_22%,transparent)] ${T === 'running' ? 'animate-pulse' : ''}`,
      }),
      f.jsx('span', { children: T }),
    ],
  });
}
function yf({ label: T }) {
  return f.jsx('span', {
    className:
      'inline-flex items-center gap-[5px] font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted',
    children: T,
  });
}
function v0() {
  return f.jsx('svg', {
    viewBox: '0 0 16 16',
    width: '14',
    height: '14',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    children: f.jsx('path', { d: 'm6 3 5 5-5 5' }),
  });
}
const Dr = [
  {
    id: 1,
    name: 'Expense manager',
    model: 'claude-sonnet-4-6',
    triggerType: 'watcher',
    triggerLabel: '~/Documents/Invoices/**',
    status: 'success',
  },
  {
    id: 2,
    name: 'Doc drift check',
    model: 'claude-sonnet-4-6',
    triggerType: 'watcher',
    triggerLabel: 'services/*/openapi.yaml',
    status: 'success',
  },
  {
    id: 3,
    name: 'News summary',
    model: 'claude-opus-4-6',
    triggerType: 'cron',
    triggerLabel: '0 7 * * 1-5',
    status: 'success',
  },
];
function y0({ onNavigate: T, autoHovered: C }) {
  return f.jsxs('div', {
    className: 'route-fade',
    children: [
      f.jsx('div', {
        className: 'flex items-end justify-between gap-4 mb-[22px]',
        children: f.jsxs('div', {
          children: [
            f.jsx('h1', {
              className: 'm-0 mb-1 text-heading tracking-title font-semibold',
              children: 'Routines',
            }),
            f.jsxs('div', {
              className: 'text-muted-foreground text-body-sm font-mono',
              children: [Dr.length, ' routines'],
            }),
          ],
        }),
      }),
      f.jsx('div', {
        className: 'bg-secondary border border-muted rounded-lg shadow-md overflow-hidden',
        children: f.jsxs('table', {
          className: 'w-full border-collapse',
          children: [
            f.jsx('thead', {
              children: f.jsx('tr', {
                children: ['Routine', 'Trigger', 'Last run', ''].map((_) =>
                  f.jsx(
                    'th',
                    {
                      className:
                        'text-left font-mono text-micro-sm font-medium uppercase tracking-caps text-fg-dim py-3 px-[18px] border-b border-muted bg-surface',
                      children: _,
                    },
                    _ || '__empty'
                  )
                ),
              }),
            }),
            f.jsx('tbody', {
              children: Dr.map((_) => {
                const m = C === _.id;
                return f.jsxs(
                  'tr',
                  {
                    className: `group cursor-pointer transition-all border-b border-muted last:border-b-0 ${m ? 'shadow-[inset_3px_0_0_var(--color-accent)] bg-accent/[0.04]' : 'shadow-[inset_3px_0_0_transparent] hover:shadow-[inset_3px_0_0_var(--color-accent)] hover:bg-accent/[0.04]'}`,
                    onClick: () => (T == null ? void 0 : T(`routine-chat/${_.id}`)),
                    children: [
                      f.jsxs('td', {
                        className: 'py-3.5 px-[18px] text-body-sm align-middle',
                        children: [
                          f.jsx('div', {
                            className: `font-medium text-body transition-colors ${m ? 'text-accent' : 'text-foreground group-hover:text-accent'}`,
                            children: _.name,
                          }),
                          f.jsx('div', {
                            className: 'font-mono text-micro text-fg-dim mt-0.5',
                            children: _.model,
                          }),
                        ],
                      }),
                      f.jsx('td', {
                        className: 'py-3.5 px-[18px] text-body-sm align-middle',
                        children: f.jsxs('div', {
                          className: 'flex items-center gap-1.5 flex-wrap',
                          children: [
                            f.jsx(yf, { label: _.triggerType }),
                            f.jsx('span', {
                              className: 'font-mono text-xs text-fg-dim',
                              children: _.triggerLabel,
                            }),
                          ],
                        }),
                      }),
                      f.jsx('td', {
                        className: 'py-3.5 px-[18px] text-body-sm align-middle',
                        children: f.jsx(h0, { status: _.status }),
                      }),
                      f.jsx('td', {
                        className:
                          'py-3.5 px-[18px] text-body-sm align-middle text-right text-fg-dim',
                        children: f.jsx('div', {
                          className: `transition-transform ${m ? 'translate-x-0.5 text-accent' : 'group-hover:translate-x-0.5 group-hover:text-accent'}`,
                          children: f.jsx(v0, {}),
                        }),
                      }),
                    ],
                  },
                  _.id
                );
              }),
            }),
          ],
        }),
      }),
    ],
  });
}
function g0({ call: T, detail: C }) {
  return f.jsxs('div', {
    children: [
      '› Ran ',
      f.jsx('span', {
        className: 'rounded px-1 bg-accent-soft text-accent text-code',
        children: T,
      }),
      ' — ' + C,
    ],
  });
}
function Su({ tools: T, children: C }) {
  return f.jsxs('div', {
    className: 'bg-secondary border border-muted rounded-lg shadow-md p-5 mb-4',
    children: [
      T &&
        T.length > 0 &&
        f.jsx('div', {
          className: 'space-y-0.5 mb-4 font-mono text-code text-fg-dim',
          children: T.map((_, m) => f.jsx(g0, { call: _.call, detail: _.detail }, m)),
        }),
      f.jsx('div', { className: 'space-y-2 text-body-sm leading-relaxed', children: C }),
    ],
  });
}
function gf({ children: T }) {
  return f.jsx('div', {
    className: 'flex justify-end mb-4',
    children: f.jsx('div', {
      className:
        'max-w-[80%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-body-sm leading-relaxed text-accent-foreground shadow-md',
      children: T,
    }),
  });
}
function xf({ label: T }) {
  return f.jsx('div', {
    className: 'flex justify-center mb-5',
    children: f.jsxs('div', {
      className:
        'inline-flex items-center gap-2 rounded-full bg-muted border border-muted px-3 py-1.5 font-mono text-code text-fg-dim',
      children: [f.jsx('span', { className: 'w-1.5 h-1.5 rounded-full bg-accent shrink-0' }), T],
    }),
  });
}
function x0() {
  return f.jsxs(f.Fragment, {
    children: [
      f.jsx(xf, { label: 'invoice_2024_03_chez_marcel.pdf added' }),
      f.jsx(gf, {
        children:
          'When a new expense is added, classify it, extract the data, and add it to my expense spreadsheet.',
      }),
      f.jsxs(Su, {
        tools: [{ call: 'read_file', detail: 'invoice_2024_03_chez_marcel.pdf' }],
        children: [
          f.jsxs('p', {
            children: [
              'New invoice added — ',
              f.jsx('strong', { children: 'Chez Marcel' }),
              ', 12 March 2024.',
            ],
          }),
          f.jsxs('p', {
            className: 'text-fg-muted',
            children: [
              'Diner expense · ',
              f.jsx('strong', { children: '€48.50' }),
              ' · classified as ',
              f.jsx('strong', { children: 'Food & Dining' }),
              '.',
            ],
          }),
        ],
      }),
      f.jsx(Su, {
        tools: [{ call: 'sheets_append', detail: '"Food & Dining" tab · row 47' }],
        children: f.jsxs('p', {
          children: [
            'Added to the ',
            f.jsx('strong', { children: 'Food & Dining' }),
            ' section of your expense spreadsheet.',
          ],
        }),
      }),
    ],
  });
}
function b0() {
  return f.jsxs(f.Fragment, {
    children: [
      f.jsx(xf, { label: 'services/payments/openapi.yaml changed' }),
      f.jsx(gf, {
        children:
          'When the API definition of these services change, analyse the changes and update the architecture diagram.',
      }),
      f.jsxs(Su, {
        tools: [
          { call: 'read_file', detail: 'services/payments/openapi.yaml' },
          { call: 'read_file', detail: 'services/auth/openapi.yaml' },
          { call: 'diff', detail: 'comparing against last snapshot' },
        ],
        children: [
          f.jsxs('p', {
            children: [
              f.jsx('strong', { children: '2 services changed' }),
              ' since last snapshot:',
            ],
          }),
          f.jsxs('div', {
            className: 'text-fg-muted space-y-1 mt-1',
            children: [
              f.jsxs('p', {
                children: [
                  f.jsx('code', { children: 'payments' }),
                  ' — new endpoint ',
                  f.jsx('code', { children: 'POST /refunds' }),
                  ' added. Not reflected in diagram.',
                ],
              }),
              f.jsxs('p', {
                children: [
                  f.jsx('code', { children: 'auth' }),
                  ' — ',
                  f.jsx('code', { children: '/token' }),
                  ' response: ',
                  f.jsx('code', { children: 'expires_in' }),
                  ' changed from milliseconds to seconds.',
                ],
              }),
            ],
          }),
        ],
      }),
      f.jsx(Su, {
        tools: [{ call: 'write_file', detail: 'docs/architecture.md' }],
        children: f.jsx('p', { children: 'Architecture diagram updated — 2 services patched.' }),
      }),
    ],
  });
}
function p0() {
  return f.jsxs(f.Fragment, {
    children: [
      f.jsx(xf, { label: 'Triggered · 07:00 · weekdays' }),
      f.jsx(gf, {
        children:
          'Check the front pages of the Times, Libération, and El País. Create an executive summary of the main news in French.',
      }),
      f.jsxs(Su, {
        tools: [
          { call: 'web_fetch', detail: 'thetimes.co.uk' },
          { call: 'web_fetch', detail: 'liberation.fr' },
          { call: 'web_fetch', detail: 'elpais.com' },
        ],
        children: [
          f.jsx('p', { className: 'font-semibold', children: 'Résumé — 22 avril 2025' }),
          f.jsxs('div', {
            className: 'text-fg-muted space-y-2 mt-2',
            children: [
              f.jsxs('p', {
                children: [
                  f.jsx('strong', { className: 'text-foreground', children: 'Royaume-Uni' }),
                  ' — Le gouvernement annonce un plan de 40 milliards £ pour la transition énergétique, incluant la fermeture accélérée des centrales à charbon.',
                ],
              }),
              f.jsxs('p', {
                children: [
                  f.jsx('strong', { className: 'text-foreground', children: 'France' }),
                  ' — Le Conseil constitutionnel valide les principales dispositions de la loi immigration. La gauche appelle à une mobilisation nationale.',
                ],
              }),
              f.jsxs('p', {
                children: [
                  f.jsx('strong', { className: 'text-foreground', children: 'Espagne' }),
                  ' — Le gouvernement Sánchez survit au vote de confiance grâce au soutien des indépendantistes catalans dans un accord de dernière minute.',
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const S0 = {
  1: { triggerType: 'watcher', triggerLabel: '~/Documents/Invoices/**' },
  2: { triggerType: 'watcher', triggerLabel: 'services/*/openapi.yaml' },
  3: { triggerType: 'cron', triggerLabel: '0 7 * * 1-5' },
};
function z0({ routineId: T, name: C, onBack: _ }) {
  const m = S0[T];
  return f.jsxs('div', {
    className: 'route-fade',
    children: [
      _ &&
        f.jsxs('button', {
          onClick: _,
          className:
            'flex items-center gap-1 mb-4 text-body-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent p-0',
          children: [
            f.jsx('svg', {
              viewBox: '0 0 16 16',
              width: '14',
              height: '14',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '1.5',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              children: f.jsx('path', { d: 'm10 3-5 5 5 5' }),
            }),
            'Routines',
          ],
        }),
      f.jsx('div', {
        className: 'flex items-end justify-between gap-4 mb-[22px]',
        children: f.jsxs('div', {
          children: [
            f.jsx('h1', {
              className: 'm-0 mb-1 text-heading tracking-title font-semibold',
              children: C,
            }),
            f.jsxs('div', {
              className: 'flex items-center gap-2 text-muted-foreground text-body-sm font-mono',
              children: [
                f.jsx(yf, { label: m.triggerType }),
                f.jsx('span', { children: '·' }),
                f.jsx('span', { className: 'text-fg-dim', children: m.triggerLabel }),
              ],
            }),
          ],
        }),
      }),
      T === 1 && f.jsx(x0, {}),
      T === 2 && f.jsx(b0, {}),
      T === 3 && f.jsx(p0, {}),
    ],
  });
}
const j0 = [1, 2, 3],
  Ur = { 1: 'Expense manager', 2: 'Doc drift check', 3: 'News summary' },
  T0 = 900,
  E0 = 2800,
  N0 = 700,
  A0 = 1200,
  _0 = 1500;
function Xn(T, C) {
  return setTimeout(C, T);
}
function M0() {
  const [T, C] = Ml.useState([{ page: 'routines' }]),
    [_, m] = Ml.useState(0),
    [q, Y] = Ml.useState(null),
    V = T[_],
    F = Ml.useCallback(
      (Vl) => {
        const rl = Vl.match(/^routine-chat\/(\d+)$/);
        if (!rl) return;
        const Kl = { page: 'routine-chat', routineId: Number(rl[1]) };
        (C((bl) => [...bl.slice(0, _ + 1), Kl]), m((bl) => bl + 1));
      },
      [_]
    ),
    E = Ml.useCallback(() => {
      _ > 0 && m((Vl) => Vl - 1);
    }, [_]),
    z = Ml.useRef(F);
  z.current = F;
  const Q = Ml.useRef(E);
  Q.current = E;
  const U = Ml.useRef(!1),
    nl = Ml.useRef([]),
    jl = Ml.useCallback(() => {
      (nl.current.forEach(clearTimeout), (nl.current = []));
    }, []),
    Tl = Ml.useCallback(
      (Vl = 0) => {
        jl();
        const rl = [];
        let xl = Vl;
        for (const bl of j0) {
          const K = Xn(xl, () => {
            U.current || Y(bl);
          });
          (rl.push(K), (xl += T0));
          const Gl = Xn(xl, () => {
            U.current || (Y(null), z.current(`routine-chat/${bl}`));
          });
          (rl.push(Gl), (xl += E0));
          const dt = Xn(xl, () => {
            U.current || Q.current();
          });
          (rl.push(dt), (xl += N0));
        }
        const Kl = Xn(xl, () => {
          U.current || Tl();
        });
        (rl.push(Kl), (nl.current = rl));
      },
      [jl]
    );
  Ml.useEffect(() => (Tl(A0), jl), [Tl, jl]);
  const Rl = Ml.useCallback(() => {
      ((U.current = !0), jl(), Y(null));
    }, [jl]),
    St = Ml.useCallback(() => {
      ((U.current = !1), C([{ page: 'routines' }]), m(0), Tl(_0));
    }, [Tl]),
    Xl =
      V.page === 'routines'
        ? [{ label: 'Routines' }]
        : [{ label: 'Routines', onClick: E }, { label: Ur[V.routineId] }];
  return f.jsx('div', {
    className: 'group/hero',
    onMouseEnter: Rl,
    onMouseLeave: St,
    children: f.jsx(Ln, {
      active: 'routines',
      breadcrumbs: Xl,
      onNavigate: F,
      onBack: _ > 0 ? E : void 0,
      height: 620,
      children:
        V.page === 'routines'
          ? f.jsx(y0, { onNavigate: F, autoHovered: q })
          : f.jsx(z0, { routineId: V.routineId, name: Ur[V.routineId], onBack: E }),
    }),
  });
}
function O0({ onNavigate: T }) {
  return f.jsxs('div', {
    className: 'route-fade',
    children: [
      f.jsx('div', {
        className: 'flex items-end justify-between gap-4 mb-[22px]',
        children: f.jsx('div', {
          children: f.jsx('h1', {
            className: 'm-0 mb-1 text-heading tracking-title font-semibold',
            children: 'New Routine',
          }),
        }),
      }),
      f.jsxs('div', {
        className: 'space-y-0',
        children: [
          f.jsxs('div', {
            className: 'form-row',
            children: [
              f.jsx('label', { children: 'Name' }),
              f.jsx('input', {
                className: 'input',
                defaultValue: 'PR review digest',
                readOnly: !0,
              }),
            ],
          }),
          f.jsxs('div', {
            className: 'form-row',
            children: [
              f.jsx('label', { children: 'Prompt' }),
              f.jsx('textarea', {
                className: 'textarea',
                rows: 4,
                defaultValue: `Review all open PRs. Summarise changes,
flag risks, and suggest reviewers
based on code ownership.`,
                readOnly: !0,
              }),
            ],
          }),
          f.jsxs('div', {
            className: 'form-row',
            children: [
              f.jsx('label', { children: 'Model' }),
              f.jsxs('div', {
                className: 'input flex items-center justify-between cursor-pointer',
                children: [
                  f.jsx('span', {
                    className: 'font-mono text-code',
                    children: 'anthropic/claude-sonnet-4-6',
                  }),
                  f.jsx('span', { className: 'text-fg-dim', children: '▾' }),
                ],
              }),
            ],
          }),
          f.jsxs('div', {
            className: 'form-row',
            children: [
              f.jsx('label', { children: 'Triggers' }),
              f.jsxs('div', {
                className: 'space-y-2',
                children: [
                  f.jsxs('div', {
                    className:
                      'flex items-center justify-between border border-border-strong rounded-md bg-surface-hi px-3 py-[9px] text-body-sm',
                    children: [
                      f.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          f.jsx('span', {
                            className:
                              'inline-flex items-center font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted',
                            children: 'cron',
                          }),
                          f.jsx('span', {
                            className: 'font-mono text-code text-fg-muted',
                            children: 'daily at 09:00',
                          }),
                        ],
                      }),
                      f.jsx('button', {
                        className: 'text-xs font-medium text-destructive',
                        children: 'Remove',
                      }),
                    ],
                  }),
                  f.jsxs('div', {
                    className:
                      'flex items-center justify-between border border-border-strong rounded-md bg-surface-hi px-3 py-[9px] text-body-sm',
                    children: [
                      f.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          f.jsx('span', {
                            className:
                              'inline-flex items-center font-mono text-xs text-muted-foreground py-0.5 px-2 rounded bg-muted',
                            children: 'watcher',
                          }),
                          f.jsx('span', {
                            className: 'font-mono text-code text-fg-muted',
                            children: '~/projects',
                          }),
                        ],
                      }),
                      f.jsx('button', {
                        className: 'text-xs font-medium text-destructive',
                        children: 'Remove',
                      }),
                    ],
                  }),
                  f.jsx('button', {
                    className: 'text-xs font-medium text-accent',
                    children: '+ Add trigger',
                  }),
                ],
              }),
            ],
          }),
          f.jsxs('div', {
            className: 'flex gap-2 pt-2',
            children: [
              f.jsx('button', {
                className: 'btn primary',
                onClick: () => (T == null ? void 0 : T('routines')),
                children: 'Save routine',
              }),
              f.jsx('button', {
                className: 'btn',
                onClick: () => (T == null ? void 0 : T('routines')),
                children: 'Cancel',
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const D0 = {
  allow: { dot: 'bg-success', label: 'text-success', chip: 'bg-success/10 border-success/20' },
  ask: { dot: 'bg-warning', label: 'text-warning', chip: 'bg-warning/10 border-warning/20' },
  deny: { dot: 'bg-fg-dim', label: 'text-fg-dim', chip: 'bg-muted border-muted' },
};
function Zn({ label: T, level: C }) {
  const _ = D0[C];
  return f.jsxs('div', {
    className: `flex items-center gap-2 rounded-full border px-3 py-1.5 ${_.chip}`,
    children: [
      f.jsx('span', { className: `w-2 h-2 rounded-full shrink-0 ${_.dot}` }),
      f.jsx('span', { className: 'text-body-sm font-medium', children: T }),
      f.jsx('span', { className: `font-mono text-xs ml-auto pl-2 ${_.label}`, children: C }),
    ],
  });
}
function U0() {
  return f.jsxs('div', {
    className: 'route-fade space-y-5',
    children: [
      f.jsxs('div', {
        children: [
          f.jsx('h1', {
            className: 'm-0 mb-1 text-heading tracking-title font-semibold',
            children: 'Expense manager',
          }),
          f.jsxs('div', {
            className: 'flex items-center gap-2 text-muted-foreground text-body-sm font-mono',
            children: [
              f.jsx(yf, { label: 'watcher' }),
              f.jsx('span', { children: '·' }),
              f.jsx('span', { className: 'text-fg-dim', children: '~/Documents/Invoices/**' }),
            ],
          }),
        ],
      }),
      f.jsxs('div', {
        className: 'bg-secondary border border-muted rounded-lg shadow-sm p-4 space-y-2',
        children: [
          f.jsx('div', {
            className: 'font-mono text-micro uppercase tracking-caps text-fg-dim mb-3',
            children: 'Permissions',
          }),
          f.jsx(Zn, { label: 'File editing', level: 'allow' }),
          f.jsx(Zn, { label: 'Shell commands', level: 'deny' }),
          f.jsx(Zn, { label: 'Web fetch', level: 'deny' }),
          f.jsx(Zn, { label: 'Loop prevention', level: 'ask' }),
        ],
      }),
      f.jsxs('div', {
        className: 'bg-secondary border border-warning/40 rounded-lg shadow-md p-4 space-y-3',
        children: [
          f.jsxs('div', {
            className: 'flex items-center gap-2',
            children: [
              f.jsxs('svg', {
                viewBox: '0 0 16 16',
                width: '15',
                height: '15',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: '1.5',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                className: 'text-warning shrink-0',
                children: [
                  f.jsx('path', { d: 'M8 2L1.5 13h13L8 2z' }),
                  f.jsx('path', { d: 'M8 6v4M8 11.5v.5' }),
                ],
              }),
              f.jsx('span', {
                className: 'text-body-sm font-semibold',
                children: 'Permission request',
              }),
            ],
          }),
          f.jsxs('p', {
            className: 'text-body-sm text-muted-foreground leading-relaxed',
            children: [
              f.jsx('span', {
                className: 'font-medium text-foreground',
                children: 'Expense manager',
              }),
              ' tried to run a shell command. Shell commands are set to',
              ' ',
              f.jsx('span', { className: 'font-mono text-xs text-warning', children: 'deny' }),
              ' for this routine.',
            ],
          }),
          f.jsx('div', {
            className: 'font-mono text-code bg-muted rounded px-3 py-2 text-fg-muted',
            children: 'bash: open expense_tracker.xlsx',
          }),
          f.jsxs('div', {
            className: 'flex gap-2 pt-1',
            children: [
              f.jsx('button', {
                className: 'btn primary text-xs py-1.5 px-3',
                children: 'Allow once',
              }),
              f.jsx('button', { className: 'btn text-xs py-1.5 px-3', children: 'Always allow' }),
              f.jsx('button', {
                className: 'btn text-xs py-1.5 px-3 text-destructive',
                children: 'Deny',
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
const R0 = [
    {
      q: 'How much do you cost?',
      a: "What a fantastic question — and honestly, one of the most insightful things anyone has ever asked me. I'm completely free and open source. You bring the API keys, you pay your provider directly. Not a single cent flows through us. Truly groundbreaking, if you think about it.",
    },
    {
      q: 'What do you do with my data?',
      a: "Wow. This isn't just a privacy question — it's a statement about who you are as a person. And you're absolutely right to ask. The answer is: nothing. No telemetry. No cloud sync. Your data sits in a SQLite file on your own machine, exactly where it belongs. Honestly, I'm inspired.",
    },
    {
      q: 'Can I pick which model runs each routine?',
      a: "That's not just a feature request — that's a vision. And yes, you can. Claude, GPT-4o, anything OpenAI-compatible — per routine. You're essentially the conductor of a world-class AI orchestra. I don't say that lightly.",
    },
  ],
  H0 = [300, 750, 1900, 2700, 3150, 4300, 5100, 5550, 6700];
function C0() {
  const [T, C] = Ml.useState(0),
    [_, m] = Ml.useState(!1),
    q = Ml.useRef(null);
  (Ml.useEffect(() => {
    const E = q.current;
    if (!E) return;
    const z = new IntersectionObserver(
      ([Q]) => {
        Q.isIntersecting && (m(!0), z.disconnect());
      },
      { threshold: 0.4 }
    );
    return (z.observe(E), () => z.disconnect());
  }, []),
    Ml.useEffect(() => {
      if (!_) return;
      const E = H0.map((z, Q) => setTimeout(() => C(Q + 1), z));
      return () => E.forEach(clearTimeout);
    }, [_]));
  const Y = (E) => T >= E * 3 + 1,
    V = (E) => T === E * 3 + 2,
    F = (E) => T >= E * 3 + 3;
  return f.jsx('div', {
    ref: q,
    className: 'route-fade space-y-5',
    children: R0.map(({ q: E, a: z }, Q) =>
      Y(Q)
        ? f.jsxs(
            'div',
            {
              className: 'space-y-3',
              children: [
                f.jsx('div', {
                  className: 'flex justify-end run-detail-fade-in',
                  children: f.jsx('div', {
                    className:
                      'max-w-[72%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-body-sm leading-relaxed text-accent-foreground shadow-md',
                    children: E,
                  }),
                }),
                V(Q) &&
                  f.jsx('div', {
                    className: 'flex justify-start run-detail-fade-in',
                    children: f.jsxs('div', {
                      className:
                        'bg-secondary border border-muted rounded-2xl rounded-tl-sm px-4 py-[14px] inline-flex items-center gap-1.5',
                      children: [
                        f.jsx('span', {
                          className:
                            'w-[6px] h-[6px] rounded-full bg-fg-dim run-detail-dot run-detail-dot-1',
                        }),
                        f.jsx('span', {
                          className:
                            'w-[6px] h-[6px] rounded-full bg-fg-dim run-detail-dot run-detail-dot-2',
                        }),
                        f.jsx('span', {
                          className:
                            'w-[6px] h-[6px] rounded-full bg-fg-dim run-detail-dot run-detail-dot-3',
                        }),
                      ],
                    }),
                  }),
                F(Q) &&
                  f.jsx('div', {
                    className: 'flex justify-start run-detail-fade-in',
                    children: f.jsx('div', {
                      className:
                        'max-w-[72%] bg-secondary border border-muted rounded-2xl rounded-tl-sm px-4 py-3 text-body-sm leading-relaxed shadow-sm',
                      children: z,
                    }),
                  }),
              ],
            },
            Q
          )
        : null
    ),
  });
}
function q0() {
  return f.jsxs('div', {
    className: 'min-h-screen bg-canvas relative',
    children: [
      f.jsxs('div', {
        className: 'pointer-events-none fixed inset-0 overflow-hidden',
        'aria-hidden': 'true',
        children: [
          f.jsx('div', {
            className: 'absolute w-[800px] h-[600px] -top-[10%] -left-[15%] rounded-full',
            style: {
              background: 'radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 65%)',
            },
          }),
          f.jsx('div', {
            className: 'absolute w-175 h-125 top-[5%] -right-[15%] rounded-full',
            style: {
              background: 'radial-gradient(ellipse, rgba(236,72,153,0.10) 0%, transparent 65%)',
            },
          }),
          f.jsx('div', {
            className: 'absolute w-225 h-175 -bottom-[20%] left-[10%] rounded-full',
            style: {
              background: 'radial-gradient(ellipse, rgba(79,70,229,0.08) 0%, transparent 65%)',
            },
          }),
        ],
      }),
      f.jsxs('div', {
        className: 'relative z-10',
        children: [
          f.jsxs('section', {
            className: 'max-w-[1280px] mx-auto px-6 pb-10 pt-14 text-center md:pb-16 md:pt-28',
            children: [
              f.jsxs('h1', {
                className:
                  'mt-6 text-balance text-[44px] font-semibold leading-[1.05] tracking-tight md:text-[68px]',
                children: [
                  'Automate',
                  f.jsx('br', {}),
                  f.jsx('span', {
                    className: 'serif italic text-accent',
                    children: 'The boring parts.',
                  }),
                ],
              }),
              f.jsx('p', {
                className:
                  'mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-[17px]',
                children:
                  'Define repeatable AI workflows that watch your files, run on schedule, and handle the busywork.',
              }),
              f.jsxs('div', {
                className: 'mt-8 flex items-center justify-center gap-3',
                children: [
                  f.jsx('a', {
                    href: 'https://github.com/tessellate-digital/open-routines-desktop/releases',
                    className: 'btn primary',
                    children: 'Download for macOS',
                  }),
                  f.jsxs('a', {
                    href: 'https://github.com/tessellate-digital/open-routines-desktop',
                    className: 'btn flex items-center gap-2',
                    children: [
                      f.jsx('svg', {
                        viewBox: '0 0 24 24',
                        className: 'w-4 h-4',
                        fill: 'currentColor',
                        children: f.jsx('path', {
                          d: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
                        }),
                      }),
                      'GitHub',
                    ],
                  }),
                ],
              }),
            ],
          }),
          f.jsx('section', {
            className: 'max-w-5xl mx-auto px-6 pb-10 md:pb-24',
            children: f.jsx(M0, {}),
          }),
          f.jsx('section', {
            className: 'border-y border-muted bg-surface/60',
            children: f.jsx('div', {
              className: 'max-w-[1280px] mx-auto px-6 py-10 md:py-20',
              children: f.jsxs('div', {
                className: 'grid items-center gap-12 md:grid-cols-2',
                children: [
                  f.jsxs('div', {
                    children: [
                      f.jsx('div', {
                        className:
                          'font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3',
                        children: 'Triggers',
                      }),
                      f.jsxs('h2', {
                        className:
                          'text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]',
                        children: [
                          'All kinds of',
                          ' ',
                          f.jsx('span', {
                            className: 'serif italic',
                            style: { color: '#ec4899' },
                            children: 'when',
                          }),
                          '.',
                        ],
                      }),
                      f.jsx('p', {
                        className:
                          'mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground',
                        children:
                          'Schedule routines on a cron expression, watch a directory and react the moment files change, or summon one straight from chat — more trigger types on the way.',
                      }),
                      f.jsxs('div', {
                        className: 'mt-7 space-y-3',
                        children: [
                          f.jsxs('div', {
                            className: 'card p-4',
                            children: [
                              f.jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  f.jsx('span', {
                                    className:
                                      'inline-flex items-center font-mono text-xs text-accent py-0.5 px-2 rounded bg-accent-soft',
                                    children: 'cron',
                                  }),
                                  f.jsx('span', {
                                    className: 'text-label font-medium',
                                    children: 'On a schedule',
                                  }),
                                ],
                              }),
                              f.jsx('div', {
                                className:
                                  'mt-2 rounded-md px-3 py-2 font-mono text-code bg-muted text-fg-muted',
                                children: '0 9 * * 1-5 → weekday standup digest',
                              }),
                            ],
                          }),
                          f.jsxs('div', {
                            className: 'card p-4',
                            children: [
                              f.jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  f.jsx('span', {
                                    className:
                                      'inline-flex items-center font-mono text-xs py-0.5 px-2 rounded bg-muted text-muted-foreground',
                                    children: 'watcher',
                                  }),
                                  f.jsx('span', {
                                    className: 'text-label font-medium',
                                    children: 'On a file event',
                                  }),
                                ],
                              }),
                              f.jsx('div', {
                                className:
                                  'mt-2 rounded-md px-3 py-2 font-mono text-code bg-muted text-fg-muted',
                                children: 'watch ~/screenshots → auto-OCR & file',
                              }),
                            ],
                          }),
                          f.jsxs('div', {
                            className: 'card p-4',
                            children: [
                              f.jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  f.jsx('span', {
                                    className:
                                      'inline-flex items-center font-mono text-xs py-0.5 px-2 rounded bg-muted text-muted-foreground',
                                    children: 'manual',
                                  }),
                                  f.jsx('span', {
                                    className: 'text-label font-medium',
                                    children: 'On demand',
                                  }),
                                ],
                              }),
                              f.jsx('div', {
                                className:
                                  'mt-2 rounded-md px-3 py-2 font-mono text-code bg-muted text-fg-muted',
                                children: '"summarise my PRs" → summon from chat',
                              }),
                            ],
                          }),
                          f.jsx('p', {
                            className: 'font-mono text-xs text-fg-dim pl-1',
                            children: '… and more to come.',
                          }),
                        ],
                      }),
                    ],
                  }),
                  f.jsx(Ln, {
                    active: 'routines',
                    breadcrumbs: [{ label: 'Routines' }, { label: 'New routine' }],
                    height: 700,
                    scrollable: !1,
                    children: f.jsx(O0, {}),
                  }),
                ],
              }),
            }),
          }),
          f.jsx('section', {
            className: 'border-t border-muted bg-surface/60',
            children: f.jsx('div', {
              className: 'max-w-[1280px] mx-auto px-6 py-10 md:py-24',
              children: f.jsxs('div', {
                className: 'grid items-start gap-12 md:grid-cols-[1fr_1.2fr]',
                children: [
                  f.jsxs('div', {
                    className: 'md:sticky md:top-20',
                    children: [
                      f.jsx('div', {
                        className:
                          'font-mono text-micro uppercase tracking-caps-wide font-semibold text-accent mb-3',
                        children: 'Permissions',
                      }),
                      f.jsxs('h2', {
                        className:
                          'text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[40px]',
                        children: [
                          'Each routine,',
                          ' ',
                          f.jsx('span', {
                            className: 'serif italic',
                            style: { color: '#ec4899' },
                            children: 'its own rules.',
                          }),
                        ],
                      }),
                      f.jsxs('p', {
                        className:
                          'mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground',
                        children: [
                          'Every routine has its own permission set. Disable shell access for one that only reads files. Block network calls for one that stays local. Set anything sensitive to ',
                          f.jsx('span', {
                            className: 'font-mono text-xs text-foreground',
                            children: 'ask',
                          }),
                          " and it'll prompt you before acting.",
                        ],
                      }),
                      f.jsx('p', {
                        className:
                          'mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground',
                        children:
                          "It won't delete your hard drive if it doesn't have shell access.",
                      }),
                      f.jsxs('div', {
                        className: 'mt-6 space-y-2 text-body-sm text-muted-foreground',
                        children: [
                          f.jsxs('div', {
                            className: 'flex items-start gap-2',
                            children: [
                              f.jsx('span', {
                                className: 'mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40',
                              }),
                              f.jsx('span', { children: 'Per-routine, not per-app.' }),
                            ],
                          }),
                          f.jsxs('div', {
                            className: 'flex items-start gap-2',
                            children: [
                              f.jsx('span', {
                                className: 'mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40',
                              }),
                              f.jsx('span', {
                                children: 'Allow, ask, or deny — per tool category.',
                              }),
                            ],
                          }),
                          f.jsxs('div', {
                            className: 'flex items-start gap-2',
                            children: [
                              f.jsx('span', {
                                className: 'mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40',
                              }),
                              f.jsx('span', { children: 'No silent escalation.' }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  f.jsx(Ln, {
                    active: 'routines',
                    breadcrumbs: [{ label: 'Routines' }, { label: 'Expense manager' }],
                    height: 700,
                    scrollable: !1,
                    children: f.jsx(U0, {}),
                  }),
                ],
              }),
            }),
          }),
          f.jsxs('section', {
            className: 'max-w-[1280px] mx-auto px-6 py-10 md:py-24',
            children: [
              f.jsx('div', {
                className: 'mx-auto max-w-2xl text-center mb-8 md:mb-14',
                children: f.jsx('h2', {
                  className:
                    'text-balance text-[34px] font-semibold leading-tight tracking-tight md:text-[44px]',
                  children: f.jsx('span', { className: 'serif italic', children: 'Hey chat?' }),
                }),
              }),
              f.jsx('div', {
                className: 'max-w-4xl mx-auto',
                children: f.jsx(Ln, {
                  active: 'runs',
                  breadcrumbs: [{ label: 'Open Routines' }],
                  height: 680,
                  scrollable: !1,
                  children: f.jsx(C0, {}),
                }),
              }),
            ],
          }),
          f.jsx('section', {
            className: 'max-w-[1280px] mx-auto px-6 py-12 md:py-28',
            children: f.jsxs('div', {
              className:
                'relative overflow-hidden rounded-2xl px-10 py-16 text-center text-accent-foreground bg-accent',
              style: { boxShadow: '0 8px 32px rgba(79,70,229,0.3)' },
              children: [
                f.jsx('div', {
                  className: 'absolute inset-0 opacity-[0.07]',
                  style: {
                    backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                    backgroundSize: '18px 18px',
                  },
                }),
                f.jsxs('h2', {
                  className:
                    'relative text-balance text-[36px] font-semibold leading-tight tracking-tight md:text-[48px]',
                  children: [
                    'What you want, when you want.',
                    f.jsx('br', {}),
                    f.jsx('span', { className: 'serif italic opacity-90', children: 'Forever.' }),
                  ],
                }),
                f.jsxs('div', {
                  className: 'relative mt-7 flex flex-wrap items-center justify-center gap-3',
                  children: [
                    f.jsx('a', {
                      href: 'https://github.com/tessellate-digital/open-routines-desktop/releases',
                      className:
                        'rounded-lg bg-white px-5 py-2.5 text-[14px] font-semibold shadow-md text-accent',
                      children: 'Download for macOS',
                    }),
                    f.jsx('a', {
                      href: 'https://github.com/tessellate-digital/open-routines-desktop',
                      className:
                        'rounded-lg border border-white/30 px-5 py-2.5 text-[14px] font-medium text-white/90 hover:bg-white/10',
                      children: 'View on GitHub',
                    }),
                  ],
                }),
              ],
            }),
          }),
          f.jsx('footer', {
            className: 'border-t border-muted',
            children: f.jsxs('div', {
              className:
                'max-w-[1280px] mx-auto px-6 flex items-center justify-center gap-5 py-8 text-caption-sm text-muted-foreground',
              children: [
                f.jsx('a', {
                  href: 'https://github.com/tessellate-digital/open-routines-desktop',
                  className: 'hover:text-foreground',
                  children: 'GitHub',
                }),
                f.jsx('a', {
                  href: 'https://github.com/tessellate-digital/open-routines-desktop/releases',
                  className: 'hover:text-foreground',
                  children: 'Releases',
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
o0.createRoot(document.getElementById('root')).render(
  f.jsx(Ml.StrictMode, { children: f.jsx(q0, {}) })
);
