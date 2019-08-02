/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/vue-scrollto@2.15.0/vue-scrollto.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!(function(n, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
      ? define(e)
      : ((n = n || self)["vue-scrollto"] = e());
})(this, function() {
  "use strict";
  function n(e) {
    return (n =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function(n) {
            return typeof n;
          }
        : function(n) {
            return n &&
              "function" == typeof Symbol &&
              n.constructor === Symbol &&
              n !== Symbol.prototype
              ? "symbol"
              : typeof n;
          })(e);
  }
  function e() {
    return (e =
      Object.assign ||
      function(n) {
        for (var e = 1; e < arguments.length; e++) {
          var t = arguments[e];
          for (var o in t)
            Object.prototype.hasOwnProperty.call(t, o) && (n[o] = t[o]);
        }
        return n;
      }).apply(this, arguments);
  }
  var t = 4,
    o = 0.001,
    r = 1e-7,
    i = 10,
    u = 11,
    f = 1 / (u - 1),
    a = "function" == typeof Float32Array;
  function c(n, e) {
    return 1 - 3 * e + 3 * n;
  }
  function l(n, e) {
    return 3 * e - 6 * n;
  }
  function s(n) {
    return 3 * n;
  }
  function d(n, e, t) {
    return ((c(e, t) * n + l(e, t)) * n + s(e)) * n;
  }
  function v(n, e, t) {
    return 3 * c(e, t) * n * n + 2 * l(e, t) * n + s(e);
  }
  function p(n) {
    return n;
  }
  var y = function(n, e, c, l) {
      if (!(0 <= n && n <= 1 && 0 <= c && c <= 1))
        throw new Error("bezier x values must be in [0, 1] range");
      if (n === e && c === l) return p;
      for (var s = a ? new Float32Array(u) : new Array(u), y = 0; y < u; ++y)
        s[y] = d(y * f, n, c);
      function m(e) {
        for (var a = 0, l = 1, p = u - 1; l !== p && s[l] <= e; ++l) a += f;
        var y = a + (e - s[--l]) / (s[l + 1] - s[l]) * f,
          m = v(y, n, c);
        return m >= o
          ? (function(n, e, o, r) {
              for (var i = 0; i < t; ++i) {
                var u = v(e, o, r);
                if (0 === u) return e;
                e -= (d(e, o, r) - n) / u;
              }
              return e;
            })(e, y, n, c)
          : 0 === m
            ? y
            : (function(n, e, t, o, u) {
                var f,
                  a,
                  c = 0;
                do {
                  (f = d((a = e + (t - e) / 2), o, u) - n) > 0
                    ? (t = a)
                    : (e = a);
                } while (Math.abs(f) > r && ++c < i);
                return a;
              })(e, a, a + f, n, c);
      }
      return function(n) {
        return 0 === n ? 0 : 1 === n ? 1 : d(m(n), e, l);
      };
    },
    m = {
      ease: [0.25, 0.1, 0.25, 1],
      linear: [0, 0, 1, 1],
      "ease-in": [0.42, 0, 1, 1],
      "ease-out": [0, 0, 0.58, 1],
      "ease-in-out": [0.42, 0, 0.58, 1]
    },
    w = !1;
  try {
    var b = Object.defineProperty({}, "passive", {
      get: function() {
        w = !0;
      }
    });
    window.addEventListener("test", null, b);
  } catch (n) {}
  var g = {
      $: function(n) {
        return "string" != typeof n ? n : document.querySelector(n);
      },
      on: function(n, e, t) {
        var o =
          arguments.length > 3 && void 0 !== arguments[3]
            ? arguments[3]
            : { passive: !1 };
        e instanceof Array || (e = [e]);
        for (var r = 0; r < e.length; r++)
          n.addEventListener(e[r], t, !!w && o);
      },
      off: function(n, e, t) {
        e instanceof Array || (e = [e]);
        for (var o = 0; o < e.length; o++) n.removeEventListener(e[o], t);
      },
      cumulativeOffset: function(n) {
        var e = 0,
          t = 0;
        do {
          (e += n.offsetTop || 0),
            (t += n.offsetLeft || 0),
            (n = n.offsetParent);
        } while (n);
        return { top: e, left: t };
      }
    },
    h = [
      "mousedown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "keyup",
      "touchmove"
    ],
    S = {
      container: "body",
      duration: 500,
      easing: "ease",
      offset: 0,
      force: !0,
      cancelable: !0,
      onStart: !1,
      onDone: !1,
      onCancel: !1,
      x: !1,
      y: !0
    };
  function L(n) {
    S = e({}, S, n);
  }
  var T = (function() {
      var e,
        t,
        o,
        r,
        i,
        u,
        f,
        a,
        c,
        l,
        s,
        d,
        v,
        p,
        w,
        b,
        L,
        T,
        O,
        E,
        x,
        A,
        C,
        D,
        j = function(n) {
          f && ((E = n), (O = !0));
        };
      function P(n) {
        if (O) return F();
        A || (A = n),
          (C = n - A),
          (D = Math.min(C / o, 1)),
          (D = x(D)),
          M(t, w + T * D, v + L * D),
          C < o ? window.requestAnimationFrame(P) : F();
      }
      function F() {
        O || M(t, b, p),
          (A = !1),
          g.off(t, h, j),
          O && l && l(E, e),
          !O && c && c(e);
      }
      function M(n, e, t) {
        d && (n.scrollTop = e),
          s && (n.scrollLeft = t),
          "body" === n.tagName.toLowerCase() &&
            (d && (document.documentElement.scrollTop = e),
            s && (document.documentElement.scrollLeft = t));
      }
      return function(A, C) {
        var D =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        if (
          ("object" === n(C)
            ? (D = C)
            : "number" == typeof C && (D.duration = C),
          !(e = g.$(A)))
        )
          return console.warn(
            "[vue-scrollto warn]: Trying to scroll to an element that is not on the page: " +
              A
          );
        (t = g.$(D.container || S.container)),
          (o = D.duration || S.duration),
          (r = D.easing || S.easing),
          (i = D.offset || S.offset),
          (u = D.hasOwnProperty("force") ? !1 !== D.force : S.force),
          (f = D.hasOwnProperty("cancelable")
            ? !1 !== D.cancelable
            : S.cancelable),
          (a = D.onStart || S.onStart),
          (c = D.onDone || S.onDone),
          (l = D.onCancel || S.onCancel),
          (s = void 0 === D.x ? S.x : D.x),
          (d = void 0 === D.y ? S.y : D.y);
        var F = g.cumulativeOffset(t),
          M = g.cumulativeOffset(e);
        if (
          ("function" == typeof i && (i = i()),
          (w = (function(n) {
            var e = n.scrollTop;
            return (
              "body" === n.tagName.toLowerCase() &&
                (e = e || document.documentElement.scrollTop),
              e
            );
          })(t)),
          (b = M.top - F.top + i),
          (v = (function(n) {
            var e = n.scrollLeft;
            return (
              "body" === n.tagName.toLowerCase() &&
                (e = e || document.documentElement.scrollLeft),
              e
            );
          })(t)),
          (p = M.left - F.left + i),
          (O = !1),
          (T = b - w),
          (L = p - v),
          !u)
        ) {
          var V = w,
            $ = V + t.offsetHeight,
            k = b,
            q = k + e.offsetHeight;
          if (k >= V && q <= $) return void c(e);
        }
        return (
          "string" == typeof r && (r = m[r] || m.ease),
          (x = y.apply(y, r)),
          T || L
            ? (a && a(e),
              g.on(t, h, j, { passive: !0 }),
              window.requestAnimationFrame(P),
              function() {
                (E = null), (O = !0);
              })
            : void 0
        );
      };
    })(),
    O = [];
  function E(n) {
    var e = (function(n) {
      for (var e = 0; e < O.length; ++e) if (O[e].el === n) return O[e];
    })(n);
    return e || (O.push((e = { el: n, binding: {} })), e);
  }
  function x(n) {
    n.preventDefault();
    var e = E(this).binding;
    if ("string" == typeof e.value) return T(e.value);
    T(e.value.el || e.value.element, e.value);
  }
  var A = {
      bind: function(n, e) {
        (E(n).binding = e), g.on(n, "click", x);
      },
      unbind: function(n) {
        !(function(n) {
          for (var e = 0; e < O.length; ++e)
            if (O[e].el === n) return O.splice(e, 1), !0;
        })(n),
          g.off(n, "click", x);
      },
      update: function(n, e) {
        E(n).binding = e;
      },
      scrollTo: T,
      bindings: O
    },
    C = function(n, e) {
      e && L(e),
        n.directive("scroll-to", A),
        (n.prototype.$scrollTo = A.scrollTo);
    };
  return (
    "undefined" != typeof window &&
      window.Vue &&
      ((window.VueScrollTo = A),
      (window.VueScrollTo.setDefaults = L),
      window.Vue.use(C)),
    (A.install = C),
    A
  );
});
//# sourceMappingURL=/sm/3e3e92e10ab109eecadc37d73322faa5d6c06568b85402d8f9f7f96aae56f7a6.map
