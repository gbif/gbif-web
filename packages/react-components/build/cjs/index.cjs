'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _objectWithoutProperties = _interopDefault(require('@babel/runtime/helpers/objectWithoutProperties'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var React = require('react');
var React__default = _interopDefault(React);
var Button$1 = require('reakit/Button');
var _taggedTemplateLiteral = _interopDefault(require('@babel/runtime/helpers/taggedTemplateLiteral'));
var md = require('react-icons/md');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var reactIntl = require('react-intl');
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var Popover$1 = require('reakit/Popover');
var _defineProperty$1 = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var Downshift = _interopDefault(require('downshift'));
var useDebounce = require('use-debounce');
var uncontrollable = require('uncontrollable');
var Menu$1 = require('reakit/Menu');
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var Dialog = require('reakit/Dialog');
var mapboxgl = _interopDefault(require('mapbox-gl'));
var bodybuilder = _interopDefault(require('bodybuilder'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var axios$1 = _interopDefault(require('axios'));
var nanoid = require('nanoid');
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var hash = _interopDefault(require('object-hash'));

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  return tag;
}

var StyleSheet =
/*#__PURE__*/
function () {
  function StyleSheet(options) {
    this.isSpeedy = options.speedy === undefined ? "production" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      var _tag = createStyleElement(this);

      var before;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is a really hot path
        // we check the second character first because having "i"
        // as the second character will happen less often than
        // having "@" as the first character
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools

        sheet.insertRule(rule, // we need to insert @import rules before anything else
        // otherwise there will be an error
        // technically this means that the @import rules will
        // _usually_(not always since there could be multiple style tags)
        // be the first ones in prod and generally later in dev
        // this shouldn't really matter in the real world though
        // @import is generally only used for font faces from google fonts and etc.
        // so while this could be technically correct then it would be slower and larger
        // for a tiny bit of correctness that won't matter in the real world
        isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

function stylis_min (W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {
                  }

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler
var delimiter = '/*|*/';
var needle = delimiter + '}';

function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + '}');
  }
}

var Sheet = {
  current: null
};
var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    // property
    case 1:
      {
        switch (content.charCodeAt(0)) {
          case 64:
            {
              // @import
              Sheet.current.insert(content + ';');
              return '';
            }
          // charcode for l

          case 108:
            {
              // charcode for b
              // this ignores label
              if (content.charCodeAt(2) === 98) {
                return '';
              }
            }
        }

        break;
      }
    // selector

    case 2:
      {
        if (ns === 0) return content + delimiter;
        break;
      }
    // at-rule

    case 3:
      {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            {
              Sheet.current.insert(selectors[0] + content);
              return '';
            }

          default:
            {
              return content + (at === 0 ? delimiter : '');
            }
        }
      }

    case -2:
      {
        content.split(needle).forEach(toSheet);
      }
  }
};
var removeLabel = function removeLabel(context, content) {
  if (context === 1 && // charcode for l
  content.charCodeAt(0) === 108 && // charcode for b
  content.charCodeAt(2) === 98 // this ignores label
  ) {
      return '';
    }
};

var isBrowser = typeof document !== 'undefined';
var rootServerStylisCache = {};
var getServerStylisCache = isBrowser ? undefined : weakMemoize(function () {
  var getCache = weakMemoize(function () {
    return {};
  });
  var prefixTrueCache = {};
  var prefixFalseCache = {};
  return function (prefix) {
    if (prefix === undefined || prefix === true) {
      return prefixTrueCache;
    }

    if (prefix === false) {
      return prefixFalseCache;
    }

    return getCache(prefix);
  };
});

var createCache = function createCache(options) {
  if (options === undefined) options = {};
  var key = options.key || 'css';
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var stylis = new stylis_min(stylisOptions);

  var inserted = {}; // $FlowFixMe

  var container;

  if (isBrowser) {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

      attrib.split(' ').forEach(function (id) {
        inserted[id] = true;
      });

      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }

  var _insert;

  if (isBrowser) {
    stylis.use(options.stylisPlugins)(ruleSheet);

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet;

      stylis(selector, serialized.styles);

      if (shouldCache) {
        cache.inserted[name] = true;
      }
    };
  } else {
    stylis.use(removeLabel);
    var serverStylisCache = rootServerStylisCache;

    if (options.stylisPlugins || options.prefix !== undefined) {
      stylis.use(options.stylisPlugins); // $FlowFixMe

      serverStylisCache = getServerStylisCache(options.stylisPlugins || rootServerStylisCache)(options.prefix);
    }

    var getRules = function getRules(selector, serialized) {
      var name = serialized.name;

      if (serverStylisCache[name] === undefined) {
        serverStylisCache[name] = stylis(selector, serialized.styles);
      }

      return serverStylisCache[name];
    };

    _insert = function _insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      var rules = getRules(selector, serialized);

      if (cache.compat === undefined) {
        // in regular mode, we don't set the styles on the inserted cache
        // since we don't need to and that would be wasting memory
        // we return them so that they are rendered in a style tag
        if (shouldCache) {
          cache.inserted[name] = true;
        }

        return rules;
      } else {
        // in compat mode, we put the styles on the inserted cache so
        // that emotion-server can pull out the styles
        // except when we don't want to cache it which was in Global but now
        // is nowhere but we don't want to do a major right now
        // and just in case we're going to leave the case here
        // it's also not affecting client side bundle size
        // so it's really not a big deal
        if (shouldCache) {
          cache.inserted[name] = rules;
        } else {
          return rules;
        }
      }
    };
  }

  var cache = {
    key: key,
    sheet: new StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  return cache;
};

var isBrowser$1 = typeof document !== 'undefined';
function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}
var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser$1 === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var stylesForSSR = '';
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

      if (!isBrowser$1 && maybeStyles !== undefined) {
        stylesForSSR += maybeStyles;
      }

      current = current.next;
    } while (current !== undefined);

    if (!isBrowser$1 && stylesForSSR.length !== 0) {
      return stylesForSSR;
    }
  }
};

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = memoize(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
        }

        break;
      }
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];

  return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "production" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value, false);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;
var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

    if (stringMode) {

      styles += strings[i];
    }
  }


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = murmur2(styles) + identifierName;

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

function css() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return serializeStyles(args);
}

var isBrowser$2 = typeof document !== 'undefined';

var EmotionCacheContext = React.createContext( // we're doing this to avoid preconstruct's dead code elimination in this one case
// because this module is primarily intended for the browser and node
// but it's also required in react native and similar environments sometimes
// and we could have a special build just for that
// but this is much easier and the native packages
// might use a different theme context in the future anyway
typeof HTMLElement !== 'undefined' ? createCache() : null);
var ThemeContext = React.createContext({});
var CacheProvider = EmotionCacheContext.Provider;

var withEmotionCache = function withEmotionCache(func) {
  var render = function render(props, ref) {
    return React.createElement(EmotionCacheContext.Consumer, null, function (cache) {
      return func(props, cache, ref);
    });
  }; // $FlowFixMe


  return React.forwardRef(render);
};

if (!isBrowser$2) {
  var BasicProvider =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(BasicProvider, _React$Component);

    function BasicProvider(props, context, updater) {
      var _this;

      _this = _React$Component.call(this, props, context, updater) || this;
      _this.state = {
        value: createCache()
      };
      return _this;
    }

    var _proto = BasicProvider.prototype;

    _proto.render = function render() {
      return React.createElement(EmotionCacheContext.Provider, this.state, this.props.children(this.state.value));
    };

    return BasicProvider;
  }(React.Component);

  withEmotionCache = function withEmotionCache(func) {
    return function (props) {
      return React.createElement(EmotionCacheContext.Consumer, null, function (context) {
        if (context === null) {
          return React.createElement(BasicProvider, null, function (newContext) {
            return func(props, newContext);
          });
        } else {
          return func(props, context);
        }
      });
    };
  };
}

var typePropName = '__EMOTION_TYPE_PLEASE_DO_NOT_USE__';
var hasOwnProperty = Object.prototype.hasOwnProperty;

var render = function render(cache, props, theme, ref) {
  var cssProp = theme === null ? props.css : props.css(theme); // so that using `css` from `emotion` and passing the result to the css prop works
  // not passing the registered cache to serializeStyles because it would
  // make certain babel optimisations not possible

  if (typeof cssProp === 'string' && cache.registered[cssProp] !== undefined) {
    cssProp = cache.registered[cssProp];
  }

  var type = props[typePropName];
  var registeredStyles = [cssProp];
  var className = '';

  if (typeof props.className === 'string') {
    className = getRegisteredStyles(cache.registered, registeredStyles, props.className);
  } else if (props.className != null) {
    className = props.className + " ";
  }

  var serialized = serializeStyles(registeredStyles);

  var rules = insertStyles(cache, serialized, typeof type === 'string');
  className += cache.key + "-" + serialized.name;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key) && key !== 'css' && key !== typePropName && ("production" === 'production' )) {
      newProps[key] = props[key];
    }
  }

  newProps.ref = ref;
  newProps.className = className;
  var ele = React.createElement(type, newProps);

  if (!isBrowser$2 && rules !== undefined) {
    var _ref;

    var serializedNames = serialized.name;
    var next = serialized.next;

    while (next !== undefined) {
      serializedNames += ' ' + next.name;
      next = next.next;
    }

    return React.createElement(React.Fragment, null, React.createElement("style", (_ref = {}, _ref["data-emotion-" + cache.key] = serializedNames, _ref.dangerouslySetInnerHTML = {
      __html: rules
    }, _ref.nonce = cache.sheet.nonce, _ref)), ele);
  }

  return ele;
};

var Emotion =
/* #__PURE__ */
withEmotionCache(function (props, cache, ref) {
  // use Context.read for the theme when it's stable
  if (typeof props.css === 'function') {
    return React.createElement(ThemeContext.Consumer, null, function (theme) {
      return render(cache, props, theme, ref);
    });
  }

  return render(cache, props, null, ref);
});


var jsx = function jsx(type, props) {
  var args = arguments;

  if (props == null || !hasOwnProperty.call(props, 'css')) {
    // $FlowFixMe
    return React.createElement.apply(undefined, args);
  }

  var argsLength = args.length;
  var createElementArgArray = new Array(argsLength);
  createElementArgArray[0] = Emotion;
  var newProps = {};

  for (var key in props) {
    if (hasOwnProperty.call(props, key)) {
      newProps[key] = props[key];
    }
  }

  newProps[typePropName] = type;

  createElementArgArray[1] = newProps;

  for (var i = 2; i < argsLength; i++) {
    createElementArgArray[i] = args[i];
  } // $FlowFixMe


  return React.createElement.apply(null, createElementArgArray);
};

var keyframes = function keyframes() {
  var insertable = css.apply(void 0, arguments);
  var name = "animation-" + insertable.name; // $FlowFixMe

  return {
    name: name,
    styles: "@keyframes " + name + "{" + insertable.styles + "}",
    anim: 1,
    toString: function toString() {
      return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
    }
  };
};

var classnames = function classnames(args) {
  var len = args.length;
  var i = 0;
  var cls = '';

  for (; i < len; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = getRegisteredStyles(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var ClassNames = withEmotionCache(function (props, context) {
  return React.createElement(ThemeContext.Consumer, null, function (theme) {
    var rules = '';
    var serializedHashes = '';
    var hasRendered = false;

    var css = function css() {
      if (hasRendered && "production" !== 'production') {
        throw new Error('css can only be used during render');
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var serialized = serializeStyles(args, context.registered);

      if (isBrowser$2) {
        insertStyles(context, serialized, false);
      } else {
        var res = insertStyles(context, serialized, false);

        if (res !== undefined) {
          rules += res;
        }
      }

      if (!isBrowser$2) {
        serializedHashes += " " + serialized.name;
      }

      return context.key + "-" + serialized.name;
    };

    var cx = function cx() {
      if (hasRendered && "production" !== 'production') {
        throw new Error('cx can only be used during render');
      }

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return merge(context.registered, css, classnames(args));
    };

    var content = {
      css: css,
      cx: cx,
      theme: theme
    };
    var ele = props.children(content);
    hasRendered = true;

    if (!isBrowser$2 && rules.length !== 0) {
      var _ref;

      return React.createElement(React.Fragment, null, React.createElement("style", (_ref = {}, _ref["data-emotion-" + context.key] = serializedHashes.substring(1), _ref.dangerouslySetInnerHTML = {
        __html: rules
      }, _ref.nonce = context.sheet.nonce, _ref)), ele);
    }

    return ele;
  });
});

var lightVariables = {
  colors: {
    primary: '#1ea7fd'
  },
  fontSize: '16px',
  background: '#efefef',
  paperBackground: '#ffffff',
  color: '#162d3d',
  fontFamily: '"Helvetica Neue", BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica", "Arial", sans-serif'
};

// https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)#micro-functions-version-4
var shadeHexColor = function shadeHexColor(color, percent) {
  var f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = f >> 8 & 0x00FF,
      B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

var defaultTheme = {};

var themeBuilder = function themeBuilder(theme) {
  var fullTheme = Object.assign({}, defaultTheme, theme);
  fullTheme.colors.primary500 = theme.colors.primary;
  fullTheme.colors.primary600 = shadeHexColor(fullTheme.colors.primary500, -0.05);
  fullTheme.colors.primary700 = shadeHexColor(fullTheme.colors.primary500, -0.1);
  fullTheme.transparentInk40 = "".concat(fullTheme.color, "40");
  fullTheme.transparentInk60 = "".concat(fullTheme.color, "60");
  fullTheme.transparentInk20 = "".concat(fullTheme.color, "20");
  fullTheme.transparentInk80 = "".concat(fullTheme.color, "80");
  fullTheme.transparentInk50 = "".concat(fullTheme.color, "50");
  return fullTheme;
};

var theme = themeBuilder(lightVariables); // A context to share state for the full app/component

var ThemeContext$1 = React__default.createContext(theme);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}var AsyncMode=l;var ConcurrentMode=m;var ContextConsumer=k;var ContextProvider=h;var Element$1=c;var ForwardRef=n;var Fragment=e;var Lazy=t;var Memo=r;var Portal=d;
var Profiler=g;var StrictMode=f;var Suspense=p;var isAsyncMode=function(a){return A(a)||z(a)===l};var isConcurrentMode=A;var isContextConsumer=function(a){return z(a)===k};var isContextProvider=function(a){return z(a)===h};var isElement=function(a){return "object"===typeof a&&null!==a&&a.$$typeof===c};var isForwardRef=function(a){return z(a)===n};var isFragment=function(a){return z(a)===e};var isLazy=function(a){return z(a)===t};
var isMemo=function(a){return z(a)===r};var isPortal=function(a){return z(a)===d};var isProfiler=function(a){return z(a)===g};var isStrictMode=function(a){return z(a)===f};var isSuspense=function(a){return z(a)===p};
var isValidElementType=function(a){return "string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};var typeOf=z;

var reactIs_production_min = {
	AsyncMode: AsyncMode,
	ConcurrentMode: ConcurrentMode,
	ContextConsumer: ContextConsumer,
	ContextProvider: ContextProvider,
	Element: Element$1,
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

var reactIs_development = createCommonjsModule(function (module, exports) {
});
var reactIs_development_1 = reactIs_development.AsyncMode;
var reactIs_development_2 = reactIs_development.ConcurrentMode;
var reactIs_development_3 = reactIs_development.ContextConsumer;
var reactIs_development_4 = reactIs_development.ContextProvider;
var reactIs_development_5 = reactIs_development.Element;
var reactIs_development_6 = reactIs_development.ForwardRef;
var reactIs_development_7 = reactIs_development.Fragment;
var reactIs_development_8 = reactIs_development.Lazy;
var reactIs_development_9 = reactIs_development.Memo;
var reactIs_development_10 = reactIs_development.Portal;
var reactIs_development_11 = reactIs_development.Profiler;
var reactIs_development_12 = reactIs_development.StrictMode;
var reactIs_development_13 = reactIs_development.Suspense;
var reactIs_development_14 = reactIs_development.isAsyncMode;
var reactIs_development_15 = reactIs_development.isConcurrentMode;
var reactIs_development_16 = reactIs_development.isContextConsumer;
var reactIs_development_17 = reactIs_development.isContextProvider;
var reactIs_development_18 = reactIs_development.isElement;
var reactIs_development_19 = reactIs_development.isForwardRef;
var reactIs_development_20 = reactIs_development.isFragment;
var reactIs_development_21 = reactIs_development.isLazy;
var reactIs_development_22 = reactIs_development.isMemo;
var reactIs_development_23 = reactIs_development.isPortal;
var reactIs_development_24 = reactIs_development.isProfiler;
var reactIs_development_25 = reactIs_development.isStrictMode;
var reactIs_development_26 = reactIs_development.isSuspense;
var reactIs_development_27 = reactIs_development.isValidElementType;
var reactIs_development_28 = reactIs_development.typeOf;

var reactIs = createCommonjsModule(function (module) {

{
  module.exports = reactIs_production_min;
}
});

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
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
			if (hasOwnProperty$1.call(from, key)) {
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

var has = Function.call.bind(Object.prototype.hasOwnProperty);

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

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var helper = {
  noUserSelect: "\n    -webkit-touch-callout: none;\n    user-select: none;\n  "
};

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(359deg);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var button = function button(theme) {
  return /*#__PURE__*/css(helper.noUserSelect, " appearance:none;max-width:100%;display:inline-flex;align-items:center;justify-content:flex-start;text-align:center;border:1px solid transparent;border-radius:4px;box-shadow:none;font-size:1em;padding-top:0.5em;padding-bottom:0.5em;line-height:calc(1.5em - 6px);position:relative;margin:0;background-color:white;color:", theme.color, ";cursor:pointer;justify-content:center;padding-left:", theme.dense ? 0.5 : 1, "em;padding-right:", theme.dense ? 0.5 : 1, "em;&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}&[aria-disabled=\"true\"]{opacity:0.5;cursor:auto;}::-moz-focus-inner{border-style:none;}" + ( "" ));
};

var _ref =  {
  name: "9hyy7o",
  styles: "padding:0;border:none;height:auto;color:inherit;line-height:inherit;font-weight:inherit;background:none;border-radius:0;"
} ;

var text = function text(theme) {
  return _ref;
};
var primary = function primary(theme) {
  return /*#__PURE__*/css("background-color:", theme.colors.primary500, ";color:white;&:not([aria-disabled=\"true\"]){&:hover{color:white;border-color:", theme.colors.primary500, ";background-color:", theme.colors.primary600, ";}&:active,&[aria-expanded=\"true\"]{color:white;border-color:", theme.colors.primary600, ";background-color:", theme.colors.primary700, ";}}" + ( "" ));
};
var primaryOutline = function primaryOutline(theme) {
  return /*#__PURE__*/css("border-color:", theme.colors.primary500, ";background:none;color:", theme.colors.primary700, ";" + ( "" ));
};
var outline = function outline(theme) {
  return /*#__PURE__*/css("border-color:", theme.transparentInk40, ";background:none;" + ( "" ));
};

var _ref2 =  {
  name: "p8cinn",
  styles: "border-color:#808080;color:#808080;background:none;"
} ;

var ghost = function ghost(theme) {
  return _ref2;
};

var _ref3 =  {
  name: "c15mrh",
  styles: "background:tomato;color:white;"
} ;

var danger = function danger(theme) {
  return _ref3;
};

var _ref4 =  {
  name: "ug4k3t",
  styles: "border-color:transparent;background:none;"
} ;

var link = function link(theme) {
  return _ref4;
};

var _ref5 =  {
  name: "hboir5",
  styles: "display:flex;width:100%;"
} ;

var block = function block(theme) {
  return _ref5;
};
var spinAround = keyframes(_templateObject());
var loading = function loading(theme) {
  return /*#__PURE__*/css("&:after{animation:", spinAround, " 500ms infinite linear;border:2px solid #dbdbdb;border-radius:0.5em;border-right-color:transparent;border-top-color:transparent;content:\"\";display:block;height:1em;width:1em;left:calc(50% - (1em / 2));top:calc(50% - (1em / 2));position:absolute !important;}color:transparent !important;pointer-events:none;" + ( "" ));
};

var _ref6 =  {
  name: "1pxi8ql",
  styles: "display:flex;width:fit-content;> button{border-radius:0;margin:0;}>button:first-of-type:not(:last-of-type){border-right-color:rgba(255,255,255,.2);}>button:first-of-type{border-top-left-radius:4px;border-bottom-left-radius:4px;flex:1 1 auto;}>button:last-of-type{border-top-right-radius:4px;border-bottom-right-radius:4px;}"
} ;

var group = function group(theme) {
  return _ref6;
};
var styles = {
  button: button,
  primary: primary,
  primaryOutline: primaryOutline,
  outline: outline,
  ghost: ghost,
  danger: danger,
  link: link,
  loading: loading,
  block: block,
  text: text,
  group: group
};

var getClasses = function getClasses(theme, elementName, classes) {
  var classesToApply = [];
  var prefix = theme.prefix || 'gbif';
  Object.keys(classes).forEach(function (key) {
    var val = classes[key];

    if (val === true) {
      classesToApply.push(key);
    } else if (typeof val === 'string') {
      classesToApply.push(val);
    }
  });
  var humanClasses = getClassNames(prefix, elementName, classesToApply);
  return {
    humanClasses: humanClasses,
    classesToApply: classesToApply
  };
};

var getClassNames = function getClassNames(prefix, elementName, classes) {
  var root = "".concat(prefix, "-").concat(elementName);
  return classes.reduce(function (a, c) {
    return "".concat(a, " ").concat(root, "-").concat(c);
  }, "".concat(root));
};
var keyCodes = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  ENTER: 13
};

var truncateStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};
var Button = React__default.forwardRef(function (_ref, ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      _ref$loading = _ref.loading,
      loading = _ref$loading === void 0 ? false : _ref$loading,
      _ref$block = _ref.block,
      block = _ref$block === void 0 ? false : _ref$block,
      _ref$appearance = _ref.appearance,
      appearance = _ref$appearance === void 0 ? 'primary' : _ref$appearance,
      children = _ref.children,
      truncate = _ref.truncate,
      props = _objectWithoutProperties(_ref, ["className", "loading", "block", "appearance", "children", "truncate"]);

  var classes = {
    appearance: appearance,
    loading: loading,
    block: block
  };
  var theme = React.useContext(ThemeContext$1); // const appliedTheme = isEmpty(theme) ? standardTheme : theme;

  var appliedTheme = theme;

  var _getClasses = getClasses(appliedTheme, 'button', classes),
      classesToApply = _getClasses.classesToApply,
      humanClasses = _getClasses.humanClasses;

  return jsx(Button$1.Button, _extends({
    ref: ref,
    className: "".concat(humanClasses, " ").concat(className),
    css: /*#__PURE__*/css(styles.button(appliedTheme), " ", classesToApply.map(function (x) {
      return styles[x](appliedTheme);
    }), ";" + ( "" ))
  }, props), jsx("span", {
    style: truncate ? truncateStyle : {}
  }, children));
});
Button.displayName = 'Button';
var ButtonGroup = function ButtonGroup(_ref2) {
  var props = _extends({}, _ref2);

  var theme = React.useContext(ThemeContext$1);
  return jsx("div", _extends({
    css: styles.group({
      theme: theme
    })
  }, props));
};
ButtonGroup.displayName = 'ButtonGroup';
var FilterButton = React__default.forwardRef(function (_ref3, ref) {
  var isActive = _ref3.isActive,
      _ref3$onClearRequest = _ref3.onClearRequest,
      onClearRequest = _ref3$onClearRequest === void 0 ? function () {} : _ref3$onClearRequest,
      onClick = _ref3.onClick,
      loading = _ref3.loading,
      children = _ref3.children,
      props = _objectWithoutProperties(_ref3, ["isActive", "onClearRequest", "onClick", "loading", "children"]);

  if (!isActive) {
    return jsx(ButtonGroup, props, jsx(Button, {
      ref: ref,
      loading: loading,
      appearance: "primaryOutline",
      onClick: onClick
    }, children));
  }

  return jsx(ButtonGroup, props, jsx(Button, {
    appearance: "primary",
    ref: ref,
    onClick: onClick,
    loading: loading
  }, children), jsx(Button, {
    appearance: "primary",
    onClick: onClearRequest
  }, jsx(md.MdClose, {
    style: {
      verticalAlign: 'middle'
    }
  })));
});

var root = function root(_ref) {
  var theme = _ref.theme;
  return /*#__PURE__*/css("font-family:BlinkMacSystemFont,-apple-system,\"Segoe UI\",\"Roboto\",\"Oxygen\",\"Ubuntu\",\"Cantarell\",\"Fira Sans\",\"Droid Sans\",\"Helvetica Neue\",\"Helvetica\",\"Arial\",sans-serif;color:", theme.color || '#4a4a4a', ";font-size:", theme.fontSize || '1em', ";font-weight:400;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0,0,0,0);*,*::before,*::after,strong{box-sizing:inherit;}-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;" + ( "" ));
};
var styles$1 = {
  root: root
};

var Root = React__default.forwardRef(function (_ref, ref) {
  var _ref$as = _ref.as,
      Rt = _ref$as === void 0 ? 'div' : _ref$as,
      props = _objectWithoutProperties(_ref, ["as"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx(Rt, _extends({
    ref: ref
  }, props, {
    css: styles$1.root({
      theme: theme
    })
  }));
});
Root.displayName = 'Root';

var AppContext = React__default.createContext({});

/**
 * Will add data from the ComponentContext to the wrapped component's props
 * To use you should provide a map of params that you need injected (similar to Redux connect map)
 *
 * Usage exanmple: 
 * const mapContextToProps = ({ locale }) => ({ locale });
 * export default withContext(mapContextToProps)(MyComponent);
 * By default wrapper would provide nothing
 * @param injectedProps
 * @returns {function(*): function(*): *}
 */

var withContext = function withContext() {
  var injectedProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (context) {};
  return function (WrappedComponent) {
    var Wrapper = function Wrapper(props) {
      return /*#__PURE__*/React__default.createElement(AppContext.Consumer, null, function (context) {
        return /*#__PURE__*/React__default.createElement(WrappedComponent, _extends({}, injectedProps(context), props));
      });
    };

    return Wrapper;
  };
};

var _ref$1 =  {
  name: "r443qr",
  styles: "background:white;border:1px solid #ddd;flex:0 0 auto;margin:10px;border-radius:4px;"
} ;

var cssNavBar = function cssNavBar(_ref7) {
  var theme = _ref7.theme,
      isActive = _ref7.isActive;
  return _ref$1;
};

var _ref2$1 =  {
  name: "l6930n",
  styles: "flex:1 1 auto;margin:10px;margin-top:0;"
} ;

var cssViewArea = function cssViewArea(_ref8) {
  var theme = _ref8.theme;
  return _ref2$1;
};

var _ref3$1 =  {
  name: "120rpdz",
  styles: "display:flex;flex-direction:column;height:100%;overflow:auto;"
} ;

var cssLayout = function cssLayout(_ref9) {
  var theme = _ref9.theme;
  return _ref3$1;
};

var _ref4$1 =  {
  name: "1igwztr",
  styles: "flex:0 0 auto;&>div{border-top:1px solid #2a2a38;padding:5px 12px;color:white;font-size:0.85em;font-weight:700;}"
} ;

var cssFooter = function cssFooter(_ref10) {
  var theme = _ref10.theme;
  return _ref4$1;
};

var _ref5$1 =  {
  name: "1tottmn",
  styles: "padding:10px;border-bottom:1px solid #eee;"
} ;

var cssFilter = function cssFilter(_ref11) {
  var theme = _ref11.theme;
  return _ref5$1;
};

var _ref6$1 =  {
  name: "a5qkfk",
  styles: "margin:0 10px;"
} ;

var cssViews = function cssViews(_ref12) {
  var theme = _ref12.theme;
  return _ref6$1;
};

var Switch = React__default.forwardRef(function (_ref2, ref) {
  var _ref2$as = _ref2.as,
      Span = _ref2$as === void 0 ? 'span' : _ref2$as,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? '' : _ref2$className,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? {} : _ref2$style,
      props = _objectWithoutProperties(_ref2, ["as", "className", "style"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx(Span, {
    style: style,
    className: className,
    css: switchClass()
  }, jsx("input", _extends({
    type: "checkbox",
    ref: ref
  }, props)), jsx("span", null));
});
Switch.displayName = 'Switch';

var _ref$2 =  {
  name: "c8cez2",
  styles: "position:relative;top:-0.09em;display:inline-block;line-height:1;white-space:nowrap;vertical-align:middle;outline:none;cursor:pointer;& input{margin:0;position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;width:100%;height:100%;cursor:pointer;opacity:0;}& input + span{position:relative;top:0;left:0;display:block;width:2em;height:1em;background-color:#d4d5e3;transition:.1s;border-radius:34px;&:before{position:absolute;content:\"\";height:calc(1em - 4px);width:calc(1em - 4px);left:2px;bottom:2px;background-color:white;transition:.1s;border-radius:50%;}}& input:checked + span{background-color:#2196F3;}& input:focus + span{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}& input:checked + span:before{transform:translateX(1em);}"
} ;

var switchClass = function switchClass(theme) {
  return _ref$2;
};

var Checkbox = React__default.forwardRef(function (_ref2, ref) {
  var _ref2$as = _ref2.as,
      Span = _ref2$as === void 0 ? 'span' : _ref2$as,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? '' : _ref2$className,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? {} : _ref2$style,
      props = _objectWithoutProperties(_ref2, ["as", "className", "style"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx(Span, {
    style: style,
    className: className,
    css: checkbox()
  }, jsx("input", _extends({
    type: "checkbox",
    ref: ref
  }, props)), jsx("span", null));
});
Checkbox.displayName = 'Checkbox';

var _ref$3 =  {
  name: "1y703ms",
  styles: "position:relative;top:-0.09em;display:inline-block;line-height:1;white-space:nowrap;vertical-align:middle;outline:none;cursor:pointer;input{margin:0;position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;width:100%;height:100%;cursor:pointer;opacity:0;}& input + span{position:relative;top:0;left:0;display:block;width:1em;height:1em;background-color:#fff;border:1px solid #d9d9d9;border-radius:2px;border-collapse:separate;transition:all 0.1s;&:after{position:absolute;top:50%;left:22%;display:table;width:5.71428571px;height:9.14285714px;border:2px solid #fff;border-top:0;border-left:0;transform:rotate(45deg) scale(0) translate(-50%,-50%);opacity:0;transition:all 0.1s cubic-bezier(0.71,-0.46,0.88,0.6),opacity 0.1s;content:' ';}}& input:checked + span{background-color:#1890ff;border-color:#1890ff;&:after{position:absolute;display:table;border:2px solid #fff;border-top:0;border-left:0;transform:rotate(45deg) scale(1) translate(-50%,-50%);opacity:1;transition:all 0.1s cubic-bezier(0.12,0.4,0.29,1.46) 0.1s;content:' ';}}& input:focus + span{box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}"
} ;

var checkbox = function checkbox(props) {
  return _ref$3;
};

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n  from {\n    background-color: #eee;\n  }\n  50% {\n    background-color: #eee;\n  }\n  75% {\n    background-color: #dfdfdf;\n  }\n  to {\n    background-color: #eee;\n  }\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}

var _ref$4 =  {
  name: "1s6237y",
  styles: "&::placeholder{color:#bbb;}"
} ;

var placeholder = function placeholder(props) {
  return _ref$4;
};

var _ref3$2 =  {
  name: "vviroy",
  styles: "&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}::-moz-focus-inner{border-style:none;}"
} ;

var focusStyle = function focusStyle(props) {
  return _ref3$2;
};

var _ref4$2 =  {
  name: "175bdre",
  styles: "scrollbar-width:thin;&::-webkit-scrollbar{width:6px;height:6px;}&::-webkit-scrollbar-thumb{background-color:#686868;}"
} ;

var styledScrollBars = function styledScrollBars(props) {
  return _ref4$2;
};

var _ref5$2 =  {
  name: "qta685",
  styles: "&:hover{position:relative;&[tip]:before{border-radius:2px;background-color:#585858;color:#fff;content:attr(tip);font-size:12px;padding:5px 7px;position:absolute;white-space:nowrap;z-index:25;line-height:1.2em;pointer-events:none;}&[direction=\"right\"]:before{top:50%;left:120%;transform:translateY(-50%);}&[direction=\"left\"]:before{top:50%;right:120%;transform:translateY(-50%);}&[direction=\"top\"]:before{right:50%;bottom:120%;transform:translateX(50%);}&[direction=\"bottom\"]:before{right:50%;top:120%;transform:translateX(50%);}}"
} ;

var tooltip = function tooltip(props) {
  return _ref5$2;
};
var skeletonLoading = keyframes(_templateObject$1());

var input = function input(props) {
  return /*#__PURE__*/css("-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;font-variant:tabular-nums;list-style:none;font-feature-settings:'tnum';position:relative;display:inline-block;width:100%;height:32px;padding:4px 11px;color:rgba(0,0,0,0.65);font-size:inherit;line-height:1.5;background-color:#fff;background-image:none;border:1px solid #d9d9d9;border-radius:4px;transition:all 0.3s;", focusStyle(), ";", placeholder(), ";" + ( "" ));
};
var styles$2 = {
  input: input
};

var Input = React__default.forwardRef(function (_ref, ref) {
  var props = _extends({}, _ref);

  var theme = React.useContext(ThemeContext$1);
  return jsx("input", _extends({
    ref: ref
  }, props, {
    css: styles$2.input({
      theme: theme
    })
  }));
});
Input.displayName = 'Input';

var Popover = function Popover(_ref4) {
  var trigger = _ref4.trigger,
      placement = _ref4.placement,
      visible = _ref4.visible,
      modal = _ref4.modal,
      onClickOutside = _ref4.onClickOutside,
      children = _ref4.children,
      props = _objectWithoutProperties(_ref4, ["trigger", "placement", "visible", "modal", "onClickOutside", "children"]);

  var theme = React.useContext(ThemeContext$1);
  var popover = Popover$1.usePopoverState({
    modal: modal || false,
    placement: placement || "bottom-start",
    visible: visible,
    altAxis: true
  });
  var ref = React__default.useRef();
  React__default.useEffect(function () {
    if (popover.visible) {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [popover.visible]);
  return jsx(React__default.Fragment, null, jsx(Popover$1.PopoverDisclosure, _extends({}, popover, trigger.props), function (disclosureProps) {
    return React__default.cloneElement(trigger, disclosureProps);
  }), jsx(Popover$1.PopoverBackdrop, _extends({}, popover, {
    css: backdrop(),
    onClick: function onClick() {
      return onClickOutside ? onClickOutside(popover) : undefined;
    }
  })), jsx(Popover$1.Popover, _extends({}, popover, props, {
    hideOnClickOutside: false,
    hideOnEsc: true
  }), function (props) {
    return popover.visible && jsx(Root, _extends({}, props, {
      css: dialog()
    }), jsx(Popover$1.PopoverArrow, _extends({
      className: "arrow"
    }, popover)), jsx("div", {
      css: dialogContent()
    }, typeof children === 'function' ? children({
      hide: popover.hide,
      focusRef: ref
    }) : React__default.cloneElement(children, {
      hide: popover.hide,
      focusRef: ref
    })));
  }));
};

var _ref$5 =  {
  name: "1vv48t9",
  styles: "background-color:rgba(0,0,0,0.15);position:fixed;top:0px;right:0px;bottom:0px;left:0px;z-index:999;"
} ;

var backdrop = function backdrop(theme) {
  return _ref$5;
};

var _ref2$2 =  {
  name: "104377r",
  styles: "max-height:calc(100vh - 100px);"
} ;

var dialogContent = function dialogContent(theme) {
  return _ref2$2;
};

var _ref3$3 =  {
  name: "13tqngb",
  styles: "background-color:rgb(255,255,255);top:28px;left:50%;transform:translateX(-50%);z-index:999;border-radius:4px;outline:0px;border:1px solid rgba(33,33,33,0.25);&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}& > .arrow{background-color:transparent;& .stroke{fill:rgba(33,33,33,0.25);}& .fill{fill:white;}}"
} ;

var dialog = function dialog(theme) {
  return _ref3$3;
};

function _templateObject$2() {
  var data = _taggedTemplateLiteral(["\n  from {\n    left: -200,\n    width: 30% \n  }\n  50% {\n    width: 30%\n  }\n  70% {\n    width: 70%\n  }\n  80% {\n    left: 50%\n  }\n  95% {\n    left: 120%\n  }\n  to {\n    left: 100%\n  }\n"]);

  _templateObject$2 = function _templateObject() {
    return data;
  };

  return data;
}
var loading$1 = keyframes(_templateObject$2());

var _ref$6 =  {
  name: "1x19brq",
  styles: "background-color:tomato;left:0;animation:none;width:100%;"
} ;

var errorStyle = function errorStyle(theme) {
  return _ref$6;
};

var before = function before(_ref2) {
  var error = _ref2.error,
      theme = _ref2.theme;
  return /*#__PURE__*/css("display:block;position:absolute;content:'';left:-200px;width:200px;height:1px;background-color:", theme.colors.primary, ";animation:", loading$1, " 1.5s linear infinite;", error ? errorStyle() : null,  "" );
};

var StripeLoader = function StripeLoader(_ref3) {
  var active = _ref3.active,
      error = _ref3.error,
      props = _objectWithoutProperties(_ref3, ["active", "error"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx("div", {
    css: /*#__PURE__*/css("height:1px;width:100%;position:relative;overflow:hidden;&:before{", active ? before({
      error: error,
      theme: theme
    }) : null, "}" + ( "" ))
  });
}; // export const StripeLoader = styled.div`
//   height: 1px;
//   width: 100%;
//   position: relative;
//   overflow: hidden;
//   &:before {
//     ${props => props.active ? before(props) : null}
//   }
// `;

var wrapper = function wrapper(props) {
  return /*#__PURE__*/css("display:inline-block;margin:0;padding:0;color:rgba(0,0,0,0.65);font-variant:tabular-nums;line-height:1.5;list-style:none;box-sizing:border-box;font-size:14px;font-variant:initial;background-color:#fff;border-radius:4px;outline:none;box-shadow:0 2px 8px rgba(0,0,0,0.15);width:100%;position:absolute;transform:translateY(", props.isOpen ? 5 : 0, "px);opacity:", props.isOpen ? 1 : 0, ";transition:opacity .1s linear,transform .1s ease-in-out;" + ( "" ));
};

var _ref$7 =  {
  name: "wmu2a9",
  styles: "position:relative;display:block;padding:5px 12px;overflow:hidden;color:rgba(0,0,0,0.65);font-weight:normal;font-size:14px;line-height:22px;cursor:pointer;transition:background 0.3s ease;"
} ;

var item = function item(props) {
  return _ref$7;
};
var menu = function menu(props) {
  return /*#__PURE__*/css("max-height:450px;margin:0;padding:4px 0;padding-left:0;overflow:auto;list-style:none;outline:none;", styledScrollBars(),  "" );
};
var styles$3 = {
  wrapper: wrapper,
  menu: menu,
  item: item
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var Autocomplete = React__default.forwardRef(function (_ref, ref) {
  var onSuggestionsFetchRequested = _ref.onSuggestionsFetchRequested,
      renderSuggestion = _ref.renderSuggestion,
      getSuggestionValue = _ref.getSuggestionValue,
      onSuggestionSelected = _ref.onSuggestionSelected,
      inputProps = _ref.inputProps,
      isLoading = _ref.isLoading,
      suggestions = _ref.suggestions,
      loadingError = _ref.loadingError,
      style = _ref.style,
      props = _objectWithoutProperties(_ref, ["onSuggestionsFetchRequested", "renderSuggestion", "getSuggestionValue", "onSuggestionSelected", "inputProps", "isLoading", "suggestions", "loadingError", "style"]);

  var theme = React.useContext(ThemeContext$1);

  var _useDebounce = useDebounce.useDebounce(inputProps.value, 100),
      _useDebounce2 = _slicedToArray(_useDebounce, 1),
      debouncedText = _useDebounce2[0];

  React.useEffect(function () {
    if (debouncedText) {
      onSuggestionsFetchRequested({
        value: debouncedText
      });
    }
  }, [debouncedText, onSuggestionsFetchRequested]);

  var itemToString = function itemToString(item) {
    if (typeof item === 'undefined' || item === null) return undefined;
    return getSuggestionValue(item);
  };

  var hasSuggestions = suggestions && suggestions.length > 0;
  return jsx(Downshift, {
    onChange: function onChange(selection) {
      onSuggestionSelected({
        item: selection,
        value: itemToString(selection)
      });
    },
    defaultHighlightedIndex: 0,
    itemToString: itemToString
  }, function (_ref2) {
    var getInputProps = _ref2.getInputProps,
        getItemProps = _ref2.getItemProps,
        getLabelProps = _ref2.getLabelProps,
        getMenuProps = _ref2.getMenuProps,
        isOpen = _ref2.isOpen,
        inputValue = _ref2.inputValue,
        highlightedIndex = _ref2.highlightedIndex,
        selectedItem = _ref2.selectedItem,
        getRootProps = _ref2.getRootProps;
    return jsx("div", {
      style: _objectSpread({
        position: 'relative',
        display: 'inline-block'
      }, style)
    }, jsx("div", getRootProps({}, {
      suppressRefError: true
    }), jsx(Input, getInputProps(_objectSpread(_objectSpread({
      ref: ref
    }, inputProps), {}, {
      onChange: function onChange(event) {
        return inputProps.onChange(event, {
          newValue: event.target.value
        });
      }
    })))), jsx("div", {
      css: styles$3.wrapper({
        theme: theme,
        isOpen: isOpen
      })
    }, jsx(StripeLoader, {
      active: isLoading,
      error: loadingError
    }), isOpen && inputProps.value.length > 0 && jsx("ul", _extends({}, getMenuProps(), {
      css: styles$3.menu({
        theme: theme
      })
    }), !isLoading && !hasSuggestions && jsx("li", {
      css: styles$3.item({
        theme: theme
      }),
      style: {
        color: '#aaa'
      }
    }, "No suggestions provided"), hasSuggestions && suggestions.map(function (item, index) {
      return (// eslint-disable-next-line react/jsx-key
        jsx("li", _extends({
          css: styles$3.item({
            theme: theme
          })
        }, getItemProps({
          key: index,
          index: index,
          item: item,
          style: {
            backgroundColor: highlightedIndex === index ? '#f5f5f5' : 'white',
            fontWeight: selectedItem === item ? 'bold' : 'normal'
          }
        })), renderSuggestion(item, {
          debouncedText: debouncedText,
          isHighlighted: highlightedIndex === index
        }))
      );
    }))));
  });
});
Autocomplete.displayName = 'Autocomplete';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = _freeGlobal || freeSelf || Function('return this')();

var _root = root$1;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

var _arrayMap = arrayMap;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty$2.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray_1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return _arrayMap(value, baseToString) + '';
  }
  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

var _baseToString = baseToString;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice;

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : _baseSlice(array, start, end);
}

var _castSlice = castSlice;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode;

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

var _asciiToArray = asciiToArray;

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']',
    rsCombo = '[' + rsComboRange$1 + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange$1 + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange$1 + ']?',
    rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

var _unicodeToArray = unicodeToArray;

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return _hasUnicode(string)
    ? _unicodeToArray(string)
    : _asciiToArray(string);
}

var _stringToArray = stringToArray;

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString_1(string);

    var strSymbols = _hasUnicode(string)
      ? _stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? _castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

var _createCaseFirst = createCaseFirst;

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = _createCaseFirst('toUpperCase');

var upperFirst_1 = upperFirst;

/**
 * Converts the first character of `string` to upper case and the remaining
 * to lower case.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to capitalize.
 * @returns {string} Returns the capitalized string.
 * @example
 *
 * _.capitalize('FRED');
 * // => 'Fred'
 */
function capitalize(string) {
  return upperFirst_1(toString_1(string).toLowerCase());
}

var capitalize_1 = capitalize;

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

var _arrayReduce = arrayReduce;

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

var _basePropertyOf = basePropertyOf;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter = _basePropertyOf(deburredLetters);

var _deburrLetter = deburrLetter;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange$2 = '\\u0300-\\u036f',
    reComboHalfMarksRange$2 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$2 = '\\u20d0-\\u20ff',
    rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2;

/** Used to compose unicode capture groups. */
var rsCombo$1 = '[' + rsComboRange$2 + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo$1, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString_1(string);
  return string && string.replace(reLatin, _deburrLetter).replace(reComboMark, '');
}

var deburr_1 = deburr;

/** Used to match words composed of alphanumeric characters. */
var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords(string) {
  return string.match(reAsciiWord) || [];
}

var _asciiWords = asciiWords;

/** Used to detect strings that need a more robust regexp to match words. */
var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord(string) {
  return reHasUnicodeWord.test(string);
}

var _hasUnicodeWord = hasUnicodeWord;

/** Used to compose unicode character classes. */
var rsAstralRange$2 = '\\ud800-\\udfff',
    rsComboMarksRange$3 = '\\u0300-\\u036f',
    reComboHalfMarksRange$3 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$3 = '\\u20d0-\\u20ff',
    rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange$2 = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo$2 = '[' + rsComboRange$3 + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange$2 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz$1 = '\\ud83c[\\udffb-\\udfff]',
    rsModifier$1 = '(?:' + rsCombo$2 + '|' + rsFitz$1 + ')',
    rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
    rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ$2 = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod$1 = rsModifier$1 + '?',
    rsOptVar$1 = '[' + rsVarRange$2 + ']?',
    rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
    rsEmoji = '(?:' + [rsDingbat, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsSeq$1;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWord) || [];
}

var _unicodeWords = unicodeWords;

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString_1(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return _hasUnicodeWord(string) ? _unicodeWords(string) : _asciiWords(string);
  }
  return string.match(pattern) || [];
}

var words_1 = words;

/** Used to compose unicode capture groups. */
var rsApos$1 = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos$1, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return _arrayReduce(words_1(deburr_1(string).replace(reApos, '')), callback, '');
  };
}

var _createCompounder = createCompounder;

/**
 * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the camel cased string.
 * @example
 *
 * _.camelCase('Foo Bar');
 * // => 'fooBar'
 *
 * _.camelCase('--foo-bar--');
 * // => 'fooBar'
 *
 * _.camelCase('__FOO_BAR__');
 * // => 'fooBar'
 */
var camelCase = _createCompounder(function(result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize_1(word) : word);
});

var camelCase_1 = camelCase;

var opposite = {
  left: 'right',
  right: 'left',
  top: 'bottom',
  bottom: 'top'
};

var border = function border(width, color, dir, isActive) {
  var _ref2;

  return _ref2 = {
    border: '0 solid transparent'
  }, _defineProperty$1(_ref2, camelCase_1("border-".concat(dir)), "".concat(width, "px solid ").concat(isActive ? color : 'transparent')), _defineProperty$1(_ref2, camelCase_1("border-".concat(opposite[dir])), "".concat(width, "px solid transparent")), _ref2;
};

var tab = function tab(_ref3) {
  var theme = _ref3.theme,
      _ref3$direction = _ref3.direction,
      direction = _ref3$direction === void 0 ? 'bottom' : _ref3$direction,
      isActive = _ref3.isActive;
  return /*#__PURE__*/css(border(3, theme.colors.primary500, direction, isActive), " display:", direction === 'left' || direction === 'right' ? 'block' : 'inline-block', ";padding:10px 10px;cursor:pointer;&:hover,&:focus{outline:none;background:rgba(0,0,0,.05);}::-moz-focus-inner{border-style:none;}" + ( "" ));
};

var _ref$8 =  {
  name: "17mrx6g",
  styles: "padding:0;margin:0;list-style:none;"
} ;

var tabList = function tabList(_ref4) {
  var theme = _ref4.theme;
  return _ref$8;
};
var styles$4 = {
  tab: tab,
  tabList: tabList
};

var TabsContext = React__default.createContext({});

var ControlledTabs = function ControlledTabs(_ref) {
  var activeId = _ref.activeId,
      onChange = _ref.onChange,
      props = _objectWithoutProperties(_ref, ["activeId", "onChange"]);

  return jsx(TabsContext.Provider, _extends({
    value: {
      activeId: activeId,
      onChange: onChange
    }
  }, props));
};

var Tabs = uncontrollable.uncontrollable(ControlledTabs, {
  activeId: 'onChange'
});
var TabList = function TabList(_ref2) {
  var props = _extends({}, _ref2);

  var theme = React.useContext(ThemeContext$1);
  return jsx("ul", _extends({
    css: styles$4.tabList({
      theme: theme
    })
  }, props));
};
TabList.displayName = 'TabList';
var Tab = function Tab(_ref3) {
  var tabId = _ref3.tabId,
      direction = _ref3.direction,
      props = _objectWithoutProperties(_ref3, ["tabId", "direction"]);

  var theme = React.useContext(ThemeContext$1);
  var tabContext = React.useContext(TabsContext);
  var isActive = tabContext.activeId === tabId;
  var tabProps = {
    'aria-selected': isActive ? true : false,
    'aria-controls': "".concat(tabId, "_panel"),
    'role': 'button',
    'id': "".concat(tabId, "_tab"),
    'onClick': function onClick() {
      return tabContext.onChange(tabId);
    }
  };
  return jsx("li", _extends({
    tabIndex: "0",
    css: styles$4.tab({
      theme: theme,
      isActive: isActive,
      direction: direction
    })
  }, tabProps, props));
};
Tab.displayName = 'Tab';
var TabPanel = function TabPanel(_ref4) {
  var tabId = _ref4.tabId,
      lazy = _ref4.lazy,
      props = _objectWithoutProperties(_ref4, ["tabId", "lazy"]);

  // const theme = useContext(ThemeContext);
  var tabContext = React.useContext(TabsContext);
  var isActive = tabContext.activeId === tabId;
  if (lazy && !isActive) return null;
  return jsx("div", _extends({
    id: "".concat(tabId, "_panel"),
    "aria-labelledby": "".concat(tabId, "_tab") // css={styles.tabs({theme})}
    ,
    hidden: !isActive
  }, props));
};
TabPanel.displayName = 'TabPanel';
Tabs.Tab = Tab;
Tabs.TabList = TabList;
Tabs.TabPanel = TabPanel;

var row = function row(props) {
  return /*#__PURE__*/css("display:flex;flex-direction:", props.direction || null, ";flex-wrap:", props.wrap ? props.wrap : 'wrap', ";align-items:", props.alignItems ? props.alignItems : null, ";margin:", props.halfGutter ? -props.halfGutter + 'px' : null, ";>*{padding:", props.halfGutter ? props.halfGutter + 'px' : null, ";}" + ( "" ));
};

var asFlexValue = function asFlexValue() {
  var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return bool ? 1 : 0;
};

var getFlexSize = function getFlexSize(size, breakpoint) {
  return /*#__PURE__*/css("@media (min-width:", breakpoint, "px){flex-basis:", size ? size * 100 / 24 + '%' : null, ";}" + ( "" ));
};

var col = function col(_ref) {
  var shrink = _ref.shrink,
      grow = _ref.grow,
      basis = _ref.basis,
      xs = _ref.xs,
      props = _objectWithoutProperties(_ref, ["shrink", "grow", "basis", "xs"]);

  return /*#__PURE__*/css("flex-grow:", asFlexValue(grow), ";flex-shrink:", asFlexValue(shrink), ";flex-basis:", basis ? typeof basis === 'number' ? basis + '%' : basis : 'auto', ";flex-basis:", xs ? xs * 100 / 24 + '%' : null, ";justify-content:", props.justifyContent ? props.justifyContent : null, ";", getFlexSize(props.sm, 600), ";", getFlexSize(props.md, 700), ";", getFlexSize(props.lg, 800), ";", getFlexSize(props.xl, 1000), ";" + ( "" ));
};

var GetComponent = function GetComponent(rowComponentStyle) {
  return React__default.forwardRef(function (_ref, ref) {
    var _ref$as = _ref.as,
        As = _ref$as === void 0 ? 'div' : _ref$as,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className,
        _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style,
        wrap = _ref.wrap,
        direction = _ref.direction,
        alignItems = _ref.alignItems,
        justifyContent = _ref.justifyContent,
        halfGutter = _ref.halfGutter,
        gridGutter = _ref.gridGutter,
        shrink = _ref.shrink,
        grow = _ref.grow,
        basis = _ref.basis,
        xs = _ref.xs,
        sm = _ref.sm,
        md = _ref.md,
        lg = _ref.lg,
        xl = _ref.xl,
        props = _objectWithoutProperties(_ref, ["as", "className", "style", "wrap", "direction", "alignItems", "justifyContent", "halfGutter", "gridGutter", "shrink", "grow", "basis", "xs", "sm", "md", "lg", "xl"]);

    return jsx(As, _extends({
      ref: ref,
      style: style,
      className: className
    }, props, {
      css: rowComponentStyle({
        wrap: wrap,
        direction: direction,
        alignItems: alignItems,
        justifyContent: justifyContent,
        halfGutter: halfGutter,
        gridGutter: gridGutter,
        shrink: shrink,
        grow: grow,
        basis: basis,
        xs: xs,
        sm: sm,
        md: md,
        lg: lg,
        xl: xl
      })
    }));
  });
};

var Row = GetComponent(row);
var Col = GetComponent(col);

var Menu = React__default.memo(function (_ref4) {
  var trigger = _ref4.trigger,
      placement = _ref4.placement,
      items = _ref4.items,
      props = _objectWithoutProperties(_ref4, ["trigger", "placement", "items"]);

  var theme = React.useContext(ThemeContext$1);
  var menu = Menu$1.useMenuState({
    placement: placement || 'bottom-end'
  });
  return jsx(React__default.Fragment, null, jsx(Menu$1.MenuButton, _extends({}, menu, trigger.props), function (disclosureProps) {
    return React__default.cloneElement(trigger, disclosureProps);
  }), jsx(Menu$1.Menu, _extends({}, menu, props, {
    css: focus(),
    style: {
      zIndex: 999
    }
  }), jsx("div", {
    css: menuContainer()
  }, (typeof items === 'function' ? items(menu) : items).map(function (item, i) {
    return jsx(Menu$1.MenuItem, _extends({}, menu, item.props, {
      key: i
    }), function (itemProps) {
      return React__default.cloneElement(item, itemProps);
    });
  }))));
});
var MenuToggle = React__default.forwardRef(function (_ref5, ref) {
  var children = _ref5.children,
      onChange = _ref5.onChange,
      className = _ref5.className,
      style = _ref5.style,
      props = _objectWithoutProperties(_ref5, ["children", "onChange", "className", "style"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx("label", {
    className: className,
    css: menuOption(),
    ref: ref,
    style: style
  }, jsx("div", null, children), jsx("div", null, jsx(Switch, _extends({
    className: "gb-menuOption-inner-switch",
    onChange: onChange ? onChange : null
  }, props))));
});
var MenuAction = React__default.forwardRef(function (_ref6, ref) {
  var children = _ref6.children,
      props = _objectWithoutProperties(_ref6, ["children"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx("button", _extends({
    ref: ref,
    css: menuAction()
  }, props), jsx("span", null, children));
});

var _ref$9 =  {
  name: "13t5ujs",
  styles: "&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}"
} ;

var focus = function focus(theme) {
  return _ref$9;
};

var _ref2$3 =  {
  name: "sn2w0s",
  styles: "padding:8px 8px;display:block;display:flex;width:100%;justify-content:space-between;overflow:hidden;font-size:13px;&>*{margin:0 8px;}&:focus,:focus-within{outline:none;background:#f5f5f5;}"
} ;

var menuOption = function menuOption(theme) {
  return _ref2$3;
};

var menuAction = function menuAction(theme) {
  return /*#__PURE__*/css(menuOption(), ";background:none;border:none;background:none;outline:none;" + ( "" ));
};

var _ref3$4 =  {
  name: "81d6cl",
  styles: "min-width:180px;max-width:100%;background-color:rgb(255,255,255);z-index:999;outline:0px;border:1px solid rgba(33,33,33,0.15);box-shadow:3px 3px 2px rgba(0,0,0,0.05);"
} ;

var menuContainer = function menuContainer(theme) {
  return _ref3$4;
};

var skeleton = function skeleton(_ref) {
  var width = _ref.width;
  return /*#__PURE__*/css("width:", width, ";display:inline-block;height:1em;animation:", skeletonLoading, " 3s linear infinite;" + ( "" ));
};
var styles$5 = {
  skeleton: skeleton
};

var Skeleton = function Skeleton(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? '100%' : _ref$width,
      props = _objectWithoutProperties(_ref, ["width"]);

  var theme = React.useContext(ThemeContext$1);
  var w;

  if (width === 'random') {
    w = "".concat(Math.floor(Math.random() * 50 + 50), "%");
  } else if (typeof w === 'number') {
    w = "".concat(Math.floor(Math.random() * 50 + 50), "px");
  } else {
    w = width;
  }

  return jsx("div", _extends({
    css: styles$5.skeleton({
      theme: theme,
      width: w
    })
  }, props));
};
Skeleton.displayName = 'Skeleton';

var borderRadius = '5px';

var _ref$a =  {
  name: "oitovc",
  styles: "border:1px solid #e5ebed;height:100%;"
} ;

var wrapper$1 = function wrapper(props) {
  return _ref$a;
};

var _ref2$4 =  {
  name: "14yhzas",
  styles: "width:100%;height:calc(100% - 50px);overflow:auto;position:relative;background:white;"
} ;

var occurrenceTable = function occurrenceTable(props) {
  return _ref2$4;
};
var footer = function footer(props) {
  return /*#__PURE__*/css("height:50px;display:flex;flex-direction:row;padding:0 10px;background:#f7f9fa;border-radius:0 0 ", borderRadius, " ", borderRadius, ";" + ( "" ));
};

var _ref3$5 =  {
  name: "1wkk93f",
  styles: "flex:0 0 auto;padding:0 10px;height:30px;line-height:30px;margin-top:10px;width:30px;padding:0;text-align:center;border:1px solid transparent;"
} ;

var footerItemBase = function footerItemBase(props) {
  return _ref3$5;
};
var footerItem = function footerItem(props) {
  return /*#__PURE__*/css(footerItemBase(), ";&:hover{border-color:#eaeaea;};&:active{background:#f0f2f3;}", tooltip(),  "" );
};
var table = function table(props) {
  return /*#__PURE__*/css("position:relative;min-width:100%;border-collapse:separate;background:white;border-spacing:0;font-size:12px;& th,td{border-right:1px solid #e5ebed;transition:background-color 200ms ease;border-bottom:1px solid #e5ebed;text-align:left;}& thead th{position:sticky;top:0;border-bottom-width:2px;background:#f7f9fa;color:#8091a5;padding:8px 12px;}& td{padding:12px;}& tbody>tr>td:first-of-type{border-right:1px solid #e5ebed;background:white;}", props.stickyColumn ? stickyColumn() : '', ";", props.scrolled ? scrolled() : '', ";" + ( "" ));
};

var _ref4$3 =  {
  name: "1fnpr55",
  styles: "& thead th:first-of-type{left:0;z-index:1;}& tbody>tr>td:first-of-type{position:sticky;left:0;}"
} ;

var stickyColumn = function stickyColumn(props) {
  return _ref4$3;
}; // export const scrollEnd = props => css`
//   & thead th:last-of-type {
//     background: tomato;
//   }
// `;

var _ref5$3 =  {
  name: "gfbbji",
  styles: "& td{background-color:#fbfbfb;}& thead th{background:#f1f3f5;}& thead th:first-of-type{background:#f7f9fa;}"
} ;

var scrolled = function scrolled(props) {
  return _ref5$3;
};
var footerText = function footerText(props) {
  return /*#__PURE__*/css(footerItemBase(), ";width:auto;font-size:12px;text-align:center;flex:1 1 auto;" + ( "" ));
};

var _ref6$2 =  {
  name: "1bptyke",
  styles: "display:flex;word-break:break-word;"
} ;

var cell = function cell(props) {
  return _ref6$2;
};
var wide = function wide(props) {
  return /*#__PURE__*/css("width:20em;", cell(), ";" + ( "" ));
};

var _ref7 =  {
  name: "u7ygyf",
  styles: "td > *{background-color:#f3f3f3;color:transparent;}"
} ;

var tbodyLoading = function tbodyLoading(props) {
  return _ref7;
};
var styles$6 = {
  wrapper: wrapper$1,
  occurrenceTable: occurrenceTable,
  footer: footer,
  footerItem: footerItem,
  table: table,
  stickyColumn: stickyColumn,
  scrolled: scrolled,
  footerText: footerText,
  wide: wide,
  tbodyLoading: tbodyLoading
};

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var TBody = function TBody(_ref) {
  var loading = _ref.loading,
      columnCount = _ref.columnCount,
      rowCount = _ref.rowCount,
      props = _objectWithoutProperties(_ref, ["loading", "columnCount", "rowCount"]);

  // if not loading, then simply show the content as is
  if (!loading) return jsx("tbody", props); // if loading and there is already content in the table, then display that content in a skeleton style.
  // content that do not support this styling, will have to manage their own load style.

  if (React__default.Children.count(props.children) > 0) {
    return jsx("tbody", _extends({}, props, {
      css: styles$6.tbodyLoading
    }));
  } // if loading and there is no content in the table, then display a bunch of skeleton rows


  return jsx("tbody", props, Array(rowCount || 10).fill().map(function (e, i) {
    return jsx("tr", {
      key: i
    }, Array(columnCount || 5).fill().map(function (e, i) {
      return jsx("td", {
        key: i
      }, jsx(Skeleton, null));
    }));
  }));
};
var Th = function Th(_ref2) {
  var children = _ref2.children,
      width = _ref2.width,
      toggle = _ref2.toggle,
      locked = _ref2.locked,
      rest = _objectWithoutProperties(_ref2, ["children", "width", "toggle", "locked"]);

  return jsx("th", rest, jsx("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      wrap: 'no-wrap'
    },
    css: styles$6[width] ? styles$6[width]() : ''
  }, jsx("div", {
    style: {
      flex: '1 1 auto'
    }
  }, children), toggle && jsx(Button, {
    appearance: "text",
    onClick: toggle,
    style: {
      display: 'flex',
      marginLeft: 5
    }
  }, locked ? jsx(md.MdLock, null) : jsx(md.MdLockOpen, null))));
};
var Td = function Td(_ref3) {
  var children = _ref3.children,
      width = _ref3.width,
      rest = _objectWithoutProperties(_ref3, ["children", "width"]);

  return jsx("td", rest, jsx("span", {
    css: styles$6[width] ? styles$6[width]() : ''
  }, children));
};
var DataTable = /*#__PURE__*/function (_Component) {
  _inherits(DataTable, _Component);

  var _super = _createSuper(DataTable);

  function DataTable(props) {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _super.call(this, props);
    _this.bodyScroll = _this.bodyScroll.bind(_assertThisInitialized(_this));
    _this.handleShow = _this.handleShow.bind(_assertThisInitialized(_this));
    _this.handleHide = _this.handleHide.bind(_assertThisInitialized(_this));
    _this.myRef = React__default.createRef();
    _this.state = {};
    return _this;
  }

  _createClass(DataTable, [{
    key: "bodyScroll",
    value: function bodyScroll() {
      // const nearEnd = Math.abs(this.myRef.current.offsetWidth + this.myRef.current.scrollLeft - this.myRef.current.scrollWidth) < 20;
      this.setState({
        scrolled: this.myRef.current.scrollLeft !== 0
      });
    }
  }, {
    key: "handleShow",
    value: function handleShow(field) {
      this.setState({
        showModalFilter: true,
        modalField: field
      });
    }
  }, {
    key: "handleHide",
    value: function handleHide() {
      this.setState({
        showModalFilter: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          first = _this$props.first,
          prev = _this$props.prev,
          next = _this$props.next,
          size = _this$props.size,
          from = _this$props.from,
          total = _this$props.total,
          fixedColumn = _this$props.fixedColumn,
          style = _this$props.style;
      var page = 1 + Math.floor(from / size);
      var totalPages = Math.ceil(total / size);
      return jsx(React__default.Fragment, null, jsx("div", {
        css: styles$6.wrapper(),
        style: style
      }, jsx("div", {
        css: styles$6.occurrenceTable(),
        onScroll: this.bodyScroll,
        ref: this.myRef
      }, jsx("table", {
        css: styles$6.table({
          stickyColumn: fixedColumn,
          scrolled: this.state.scrolled && fixedColumn
        })
      }, children)), jsx("div", {
        css: styles$6.footer()
      }, page > 2 && jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "right",
        tip: "first",
        onClick: first
      }, jsx(md.MdFirstPage, null)), page > 1 && jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "right",
        tip: "previous",
        onClick: prev
      }, jsx(md.MdChevronLeft, null)), jsx("span", {
        css: styles$6.footerText()
      }, jsx(reactIntl.FormattedMessage, {
        id: "pagination.pageXofY",
        defaultMessage: 'Loading',
        values: {
          current: jsx(reactIntl.FormattedNumber, {
            value: page
          }),
          total: jsx(reactIntl.FormattedNumber, {
            value: totalPages
          })
        }
      })), page !== totalPages && jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "left",
        tip: "next",
        onClick: next
      }, jsx(md.MdChevronRight, null)), jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "left",
        tip: "options"
      }, jsx(md.MdMoreVert, null)))));
    }
  }]);

  return DataTable;
}(React.Component);

var _ref$b =  {
  name: "9virse",
  styles: "margin:4px 4px 10px 4px;display:flex;flex-wrap:wrap;justify-content:flex-start;padding:0;"
} ;

var gallery = function gallery(props) {
  return _ref$b;
};

var _ref2$5 =  {
  name: "1r2ujex",
  styles: "flex:1 1 auto;width:150px;margin:6px;height:150px;display:block;position:relative;overflow:hidden;background:#eee;background-size:cover;background-repeat:no-repeat;background-position:center;&:hover{box-shadow:0 0 1px 1px rgba(0,0,0,0.3);}& img{display:none;}"
} ;

var galleryTile = function galleryTile(props) {
  return _ref2$5;
};

var _ref3$6 =  {
  name: "1u9cyng",
  styles: "position:absolute;bottom:0;left:0;right:0;font-size:.85em;background:rgba(0,0,0,.2);color:white;padding:5px;"
} ;

var caption = function caption(props) {
  return _ref3$6;
};
var more = function more(props) {
  return /*#__PURE__*/css("flex:100 1 auto;display:flex;height:", props.height || 150, "px;align-items:center;color:#888;min-width:100px;padding-left:30px;" + ( "" ));
}; // export const slideIn = props => css`
//   opacity: 1;
//   transform: translateX(0);
// `;

var _ref4$4 =  {
  name: "n1swm9",
  styles: "position:fixed;top:0;left:0;right:0;bottom:0;background:white;"
} ;

var detailPage = function detailPage(props) {
  return _ref4$4;
};

var _ref5$4 =  {
  name: "1678d4w",
  styles: "border-bottom:1px solid #e8e8e8;padding:10px 20px;h2{font-size:14px;margin:0;}"
} ;

var detailHeader = function detailHeader(props) {
  return _ref5$4;
};

var _ref6$3 =  {
  name: "1u2sfv2",
  styles: "border:1px solid #e8e8e8;border-width:0 1px;"
} ;

var detailDrawerBar = function detailDrawerBar(props) {
  return _ref6$3;
};

var _ref7$1 =  {
  name: "iptvcf",
  styles: "flex:1 1 auto;max-width:100%;overflow:auto;"
} ;

var detailMainWrapper = function detailMainWrapper(props) {
  return _ref7$1;
};

var _ref8 =  {
  name: "dfs19w",
  styles: "background:#f5f5f5;display:flex;position:relative;>div{flex:1 1 auto;}"
} ;

var detailMain = function detailMain(props) {
  return _ref8;
};

var _ref9 =  {
  name: "sfkrc9",
  styles: "color:#767676;font-size:13px;margin-top:5px;"
} ;

var detailHeaderDescription = function detailHeaderDescription(props) {
  return _ref9;
};

var _ref10 =  {
  name: "dba0jp",
  styles: "overflow:auto;>div{width:300px;}"
} ;

var detailDrawerContent = function detailDrawerContent(props) {
  return _ref10;
};

var _ref11 =  {
  name: "oeh7m0",
  styles: "position:absolute;top:0;bottom:0;display:flex;align-items:center;z-index:1;opacity:0;padding:0 10px;transition:opacity 0.1s ease-in;background:rgba(0,0,0,.4);color:white;cursor:pointer;&:hover{opacity:1;}"
} ;

var detailNav = function detailNav(props) {
  return _ref11;
};
var detailPrev = function detailPrev(props) {
  return /*#__PURE__*/css(detailNav(), ";left:0;" + ( "" ));
};
var detailNext = function detailNext(props) {
  return /*#__PURE__*/css(detailNav(), ";right:0;" + ( "" ));
};
var skeletonTile = function skeletonTile(props) {
  return /*#__PURE__*/css("height:", props.height, "px;width:", props.height * 1.2, "px;flex:1 1 auto;margin:6px;animation:", skeletonLoading, " 3s linear infinite;" + ( "" ));
};
var styles$7 = {
  gallery: gallery,
  galleryTile: galleryTile,
  more: more,
  caption: caption,
  skeletonTile: skeletonTile
};

var zoomableImage = function zoomableImage(_ref2) {
  var src = _ref2.src;
  return /*#__PURE__*/css( "" );
};
var image = function image(_ref3) {
  var src = _ref3.src,
      blur = _ref3.blur;
  return /*#__PURE__*/css("height:100%;width:100%;background:url(", src, ");background-position:center;background-size:contain;background-repeat:no-repeat;position:relative;text-align:center;", blur ? 'filter: blur(8px)' : '', ";" + ( "" ));
};

var _ref$c =  {
  name: "i4qehi",
  styles: "position:absolute;bottom:20px;left:20px;background:rgba(0,0,0,.8);color:white;padding:10px;"
} ;

var toolBar = function toolBar() {
  return _ref$c;
};
var styles$8 = {
  zoomableImage: zoomableImage,
  toolBar: toolBar,
  image: image
};

var ZoomableImage = React__default.forwardRef(function (_ref, ref) {
  var src = _ref.src,
      thumbnail = _ref.thumbnail,
      props = _objectWithoutProperties(_ref, ["src", "thumbnail"]);

  var theme = React.useContext(ThemeContext$1);

  var _useState = React.useState(),
      _useState2 = _slicedToArray(_useState, 2),
      isFullscreen = _useState2[0],
      setFullscreen = _useState2[1];

  var _useState3 = React.useState(thumbnail),
      _useState4 = _slicedToArray(_useState3, 2),
      imageSrc = _useState4[0],
      setImageSrc = _useState4[1];

  var wrapperRef = React.useRef(null);
  React.useEffect(function () {
    setImageSrc(thumbnail);

    if (Image) {
      var downloadingImage = new Image();

      downloadingImage.onload = function () {
        setImageSrc(this.src);
      };

      downloadingImage.src = src;
    }
  }, [src, thumbnail]);
  return jsx("div", _extends({
    ref: wrapperRef,
    css: styles$8.zoomableImage({
      theme: theme
    })
  }, props), jsx("div", {
    css: styles$8.image({
      theme: theme,
      src: imageSrc,
      blur: imageSrc === thumbnail
    })
  }), jsx("div", {
    css: styles$8.toolBar({
      theme: theme,
      src: src
    })
  }, jsx(Button, {
    appearance: "text",
    ref: ref,
    onClick: function onClick() {
      if (isFullscreen) document.exitFullscreen();else wrapperRef.current.requestFullscreen();
      setFullscreen(!isFullscreen);
    }
  }, isFullscreen ? jsx(md.MdFullscreenExit, null) : jsx(md.MdFullscreen, null))));
});
ZoomableImage.displayName = 'ZoomableImage';

var TabList$1 = Tabs.TabList,
    Tab$1 = Tabs.Tab,
    TabPanel$1 = Tabs.TabPanel;
var getThumbnail = function getThumbnail(src) {
  return "https://api.gbif.org/v1/image/unsafe/x150/".concat(encodeURIComponent(src));
};
var GalleryDetails = function GalleryDetails(_ref) {
  var closeRequest = _ref.closeRequest,
      item = _ref.item,
      title = _ref.title,
      subtitle = _ref.subtitle,
      details = _ref.details,
      previous = _ref.previous,
      next = _ref.next,
      imageSrc = _ref.imageSrc,
      props = _objectWithoutProperties(_ref, ["closeRequest", "item", "title", "subtitle", "details", "previous", "next", "imageSrc"]);

  var _useState = React.useState('details'),
      _useState2 = _slicedToArray(_useState, 2),
      activeId = _useState2[0],
      setTab = _useState2[1];

  var theme = React.useContext(ThemeContext$1);
  React.useEffect(function () {
    function handleKeypress(e) {
      switch (e.which) {
        case keyCodes.LEFT_ARROW:
          previous();
          return;

        case keyCodes.RIGHT_ARROW:
          next();
          return;

        default:
          return;
      }
    }

    if (document) document.addEventListener("keydown", handleKeypress, false);
    return function cleanup() {
      if (document) document.removeEventListener("keydown", handleKeypress, false);
    };
  }, [next, previous]);
  return jsx(Root, null, jsx(Tabs, {
    activeId: activeId,
    onChange: function onChange(id) {
      return setTab(id === activeId ? undefined : id);
    }
  }, jsx(Row, _extends({
    as: "section",
    direction: "column",
    wrap: "nowrap"
  }, props, {
    css: detailPage()
  }), jsx(Row, {
    css: detailHeader,
    alignItems: "center"
  }, jsx(Col, null, item && jsx("h2", null, title), subtitle && jsx("div", {
    css: detailHeaderDescription
  }, subtitle)), jsx(Col, {
    grow: false
  }, jsx(Button, {
    appearance: "text",
    onClick: closeRequest
  }, jsx(md.MdClose, null)))), jsx(Row, {
    css: detailMainWrapper,
    wrap: "nowrap"
  }, jsx(Col, {
    css: detailMain,
    shrink: true,
    basis: "100%"
  }, jsx("div", {
    css: detailPrev,
    onClick: function onClick() {
      return previous();
    }
  }, jsx(md.MdChevronLeft, null)), item && jsx(ZoomableImage, {
    src: imageSrc(item),
    thumbnail: getThumbnail(imageSrc(item))
  }), jsx("div", {
    css: detailNext,
    onClick: function onClick() {
      return next();
    }
  }, jsx(md.MdChevronRight, null))), details && jsx(React__default.Fragment, null, jsx(Col, {
    shrink: false,
    grow: false,
    css: detailDrawerBar
  }, jsx(TabList$1, {
    "aria-label": "Details"
  }, jsx(Tab$1, {
    tabId: "details",
    direction: "left"
  }, jsx(md.MdInfo, null)))), jsx(Col, {
    shrink: false,
    grow: false,
    css: detailDrawerContent
  }, jsx(TabPanel$1, {
    tabId: "details"
  }, details(item))))))));
};
GalleryDetails.displayName = 'Gallery'; // Gallery.propTypes = {
// };

var GalleryTileSkeleton = function GalleryTileSkeleton(_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === void 0 ? 150 : _ref$height,
      props = _objectWithoutProperties(_ref, ["height"]);

  return jsx("div", _extends({
    css: styles$7.skeletonTile({
      height: height
    })
  }, props));
};
var GalleryTile = function GalleryTile(_ref2) {
  var src = _ref2.src,
      onSelect = _ref2.onSelect,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? 150 : _ref2$height,
      children = _ref2.children,
      props = _objectWithoutProperties(_ref2, ["src", "onSelect", "height", "children"]);

  var theme = React.useContext(ThemeContext$1);

  var _useState = React.useState(1),
      _useState2 = _slicedToArray(_useState, 2),
      ratio = _useState2[0],
      setRatio = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isValid = _useState4[0],
      setValid = _useState4[1];

  var onLoad = React.useCallback(function (event) {
    setValid(true);
    var ratio = event.target.naturalWidth / event.target.naturalHeight;
    setRatio(ratio);
  }, []);
  var backgroundImage = getThumbnail(src);
  var style = {
    width: ratio * height,
    backgroundImage: "url('".concat(backgroundImage, "')")
  };

  if (ratio < 0.5 || ratio > 2) {
    style.backgroundSize = 'contain';
    style.width = height;
    if (ratio > 2) style.width = height * 1.8;
  }

  return jsx(Button, _extends({
    appearance: "text",
    css: styles$7.galleryTile({
      theme: theme
    }),
    style: style,
    onClick: onSelect
  }, props, {
    title: "View details"
  }), jsx("img", {
    src: backgroundImage,
    width: height,
    onLoad: onLoad,
    alt: "Occurrence evidence"
  }), children);
};
var GalleryCaption = function GalleryCaption(props) {
  var theme = React.useContext(ThemeContext$1);
  return jsx("div", _extends({
    css: styles$7.caption({
      theme: theme
    })
  }, props));
};
var Gallery = function Gallery(_ref3) {
  var onSelect = _ref3.onSelect,
      caption = _ref3.caption,
      title = _ref3.title,
      subtitle = _ref3.subtitle,
      details = _ref3.details,
      _ref3$items = _ref3.items,
      items = _ref3$items === void 0 ? [] : _ref3$items,
      loading = _ref3.loading,
      loadMore = _ref3.loadMore,
      imageSrc = _ref3.imageSrc,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? 20 : _ref3$size,
      props = _objectWithoutProperties(_ref3, ["onSelect", "caption", "title", "subtitle", "details", "items", "loading", "loadMore", "imageSrc", "size"]);

  var theme = React.useContext(ThemeContext$1);
  var dialog = Dialog.useDialogState();

  var _useState5 = React.useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      activeId = _useState6[0],
      setActive = _useState6[1];

  var _useState7 = React.useState(),
      _useState8 = _slicedToArray(_useState7, 2),
      activeItem = _useState8[0],
      setActiveItem = _useState8[1];

  React.useEffect(function () {
    setActiveItem(items[activeId]);
  }, [activeId, items]);
  var next = React.useCallback(function () {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);
  var prev = React.useCallback(function () {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);
  return jsx(React__default.Fragment, null, !onSelect && jsx(Dialog.Dialog, _extends({}, dialog, {
    tabIndex: 0,
    "aria-label": "Welcome"
  }), activeItem && jsx(GalleryDetails, {
    closeRequest: function closeRequest() {
      return dialog.hide();
    },
    item: activeItem,
    title: title ? title(activeItem) : 'Unknown',
    subtitle: title ? subtitle(activeItem) : null,
    details: details,
    imageSrc: imageSrc,
    next: next,
    previous: prev
  })), jsx("div", _extends({
    css: styles$7.gallery({
      theme: theme
    })
  }, props), items.map(function (e, i) {
    return jsx(GalleryTile, {
      key: i,
      src: imageSrc(e),
      onSelect: onSelect ? function () {
        return onSelect({
          item: e
        });
      } : function () {
        setActive(i);
        dialog.show();
      }
    }, caption && caption({
      item: e,
      index: i
    }));
  }), loading ? Array(size).fill().map(function (e, i) {
    return jsx(GalleryTileSkeleton, {
      key: i
    });
  }) : null, jsx("div", {
    css: styles$7.more({
      theme: theme,
      height: 150
    })
  }, loadMore && !loading && jsx(Button, {
    appearance: "outline",
    onClick: loadMore
  }, "Load more"))));
};
Gallery.displayName = 'Gallery'; // Gallery.propTypes = {
// };

var FilterContext = React__default.createContext({});

/**
 * Will add data from the ComponentContext to the wrapped component's props
 * To use you should provide a map of params that you need injected (similar to Redux connect map)
 *
 * Usage exanmple: 
 * const mapContextToProps = ({ locale }) => ({ locale });
 * export default withContext(mapContextToProps)(MyComponent);
 * By default wrapper would provide nothing
 * @param injectedProps
 * @returns {function(*): function(*): *}
 */

var withContext$1 = function withContext() {
  var injectedProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (context) {};
  return function (WrappedComponent) {
    var Wrapper = function Wrapper(props) {
      return /*#__PURE__*/React__default.createElement(FilterContext.Consumer, null, function (context) {
        return /*#__PURE__*/React__default.createElement(WrappedComponent, _extends({}, injectedProps(context), props));
      });
    };

    return Wrapper;
  };
};

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|inert|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var index = memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

var testOmitPropsOnStringTag = index;

var testOmitPropsOnComponent = function testOmitPropsOnComponent(key) {
  return key !== 'theme' && key !== 'innerRef';
};

var getDefaultShouldForwardProp = function getDefaultShouldForwardProp(tag) {
  return typeof tag === 'string' && // 96 is one less than the char code
  // for "a" so this is checking that
  // it's a lowercase character
  tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var isBrowser$3 = typeof document !== 'undefined';

var createStyled = function createStyled(tag, options) {

  var identifierName;
  var shouldForwardProp;
  var targetClassName;

  if (options !== undefined) {
    identifierName = options.label;
    targetClassName = options.target;
    shouldForwardProp = tag.__emotion_forwardProp && options.shouldForwardProp ? function (propName) {
      return tag.__emotion_forwardProp(propName) && // $FlowFixMe
      options.shouldForwardProp(propName);
    } : options.shouldForwardProp;
  }

  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;

  if (typeof shouldForwardProp !== 'function' && isReal) {
    shouldForwardProp = tag.__emotion_forwardProp;
  }

  var defaultShouldForwardProp = shouldForwardProp || getDefaultShouldForwardProp(baseTag);
  var shouldUseAs = !defaultShouldForwardProp('as');
  return function () {
    var args = arguments;
    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push("label:" + identifierName + ";");
    }

    if (args[0] == null || args[0].raw === undefined) {
      styles.push.apply(styles, args);
    } else {

      styles.push(args[0][0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {

        styles.push(args[i], args[0][i]);
      }
    } // $FlowFixMe: we need to cast StatelessFunctionalComponent to our PrivateStyledComponent class


    var Styled = withEmotionCache(function (props, context, ref) {
      return React.createElement(ThemeContext.Consumer, null, function (theme) {
        var finalTag = shouldUseAs && props.as || baseTag;
        var className = '';
        var classInterpolations = [];
        var mergedProps = props;

        if (props.theme == null) {
          mergedProps = {};

          for (var key in props) {
            mergedProps[key] = props[key];
          }

          mergedProps.theme = theme;
        }

        if (typeof props.className === 'string') {
          className = getRegisteredStyles(context.registered, classInterpolations, props.className);
        } else if (props.className != null) {
          className = props.className + " ";
        }

        var serialized = serializeStyles(styles.concat(classInterpolations), context.registered, mergedProps);
        var rules = insertStyles(context, serialized, typeof finalTag === 'string');
        className += context.key + "-" + serialized.name;

        if (targetClassName !== undefined) {
          className += " " + targetClassName;
        }

        var finalShouldForwardProp = shouldUseAs && shouldForwardProp === undefined ? getDefaultShouldForwardProp(finalTag) : defaultShouldForwardProp;
        var newProps = {};

        for (var _key in props) {
          if (shouldUseAs && _key === 'as') continue;

          if ( // $FlowFixMe
          finalShouldForwardProp(_key)) {
            newProps[_key] = props[_key];
          }
        }

        newProps.className = className;
        newProps.ref = ref || props.innerRef;

        var ele = React.createElement(finalTag, newProps);

        if (!isBrowser$3 && rules !== undefined) {
          var _ref;

          var serializedNames = serialized.name;
          var next = serialized.next;

          while (next !== undefined) {
            serializedNames += ' ' + next.name;
            next = next.next;
          }

          return React.createElement(React.Fragment, null, React.createElement("style", (_ref = {}, _ref["data-emotion-" + context.key] = serializedNames, _ref.dangerouslySetInnerHTML = {
            __html: rules
          }, _ref.nonce = context.sheet.nonce, _ref)), ele);
        }

        return ele;
      });
    });
    Styled.displayName = identifierName !== undefined ? identifierName : "Styled(" + (typeof baseTag === 'string' ? baseTag : baseTag.displayName || baseTag.name || 'Component') + ")";
    Styled.defaultProps = tag.defaultProps;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Styled.__emotion_forwardProp = shouldForwardProp;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && "production" !== 'production') {
          return 'NO_COMPONENT_SELECTOR';
        } // $FlowFixMe: coerce undefined to string


        return "." + targetClassName;
      }
    });

    Styled.withComponent = function (nextTag, nextOptions) {
      return createStyled(nextTag, nextOptions !== undefined ? _objectSpread$1({}, options || {}, {}, nextOptions) : options).apply(void 0, styles);
    };

    return Styled;
  };
};

// import { asArray } from '../../util/helpers';

/**
 * For filters that are simple terms (one or many) mapping a filterName to an ES field name, then this will simply return such a builder.
 * This will be the case for most filters and the default. All filters are expected to strings or numbers.
 * @param {*} esField 
 */
var termFilter = function termFilter(esField) {
  return function (values, builder) {
    // const values = asArray(filter);
    if (values.length === 0) {
      return;
    } else if (values.length === 1) {
      builder.filter('term', esField, values[0]);
    } else {
      builder.filter('terms', esField, values);
    }
  };
};
var termOrRangeFilter = function termOrRangeFilter(esField) {
  return function (values, builder) {
    // const values = asArray(filter);
    if (values.length === 0) {
      return;
    }

    if (values.length === 1) {
      addTerm(builder, esField, values[0]);
    } else {
      var includesRanges = hasRanges(values);

      if (!includesRanges) {
        builder.filter('terms', esField, values);
      } else {
        // it is an array and it includes at least on range
        builder.filter('bool', function (b) {
          var a = b;
          values.forEach(function (v) {
            a = isRange(v) ? a.orFilter('range', esField, v) : a.orFilter('term', esField, v);
          });
          return a;
        });
      }
    }
  };
};

var addTerm = function addTerm(builder, esField, val) {
  if (isTerm(val)) {
    builder.filter('term', esField, val);
  }

  if (isRange(val)) {
    builder.filter('range', esField, val);
  }
};

var isTerm = function isTerm(val) {
  return typeof val === 'string' || typeof val === 'number';
};
var isRange = function isRange(val) {
  return _typeof(val) === 'object' && (typeof val.gte !== 'undefined' || typeof val.gt !== 'undefined' || typeof val.lte !== 'undefined' || typeof val.lt !== 'undefined');
};
var hasRanges = function hasRanges(values) {
  return values.some(isRange);
}; // let builder = bodybuilder();
// termFilter('height')([2, 3], builder);
// // rangeFilter('year')([{ gte: 1980, lt: 1990 }, { gte: 1930, lt: 1940 }], builder);
// termOrRangeFilter('year2')([1932, { gte: 1980, lt: 1990 }, { gte: 1930, lt: 1940 }], builder);
// console.log(JSON.stringify(builder.build(), null, 2));

/**
 * Converts `string` to
 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the snake cased string.
 * @example
 *
 * _.snakeCase('Foo Bar');
 * // => 'foo_bar'
 *
 * _.snakeCase('fooBar');
 * // => 'foo_bar'
 *
 * _.snakeCase('--FOO-BAR--');
 * // => 'foo_bar'
 */
var snakeCase = _createCompounder(function(result, word, index) {
  return result + (index ? '_' : '') + word.toLowerCase();
});

var snakeCase_1 = snakeCase;

// enums for example varies between the APIs. field names vary etc.

var filters = {
  year: termOrRangeFilter('year'),
  BasisOfRecord: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values.map(function (e) {
        return snakeCase_1(e).toUpperCase();
      });
    },
    fieldName: 'basisOfRecord'
  },
  Rank: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values.map(function (e) {
        return snakeCase_1(e).toUpperCase();
      });
    },
    fieldName: 'gbifClassification.usage.rank'
  },
  MediaType: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values;
    },
    fieldName: 'mediaTypes'
  },
  gallery_media_type: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values;
    },
    fieldName: 'mediaTypes'
  },
  taxonKey: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values;
    },
    fieldName: 'gbifClassification.taxonKey'
  },
  Country: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values.map(function (e) {
        return e.toUpperCase();
      });
    },
    fieldName: 'countryCode'
  } // not here, and it will be assumed to be a 1 to 1 mapping to a terms filter

};
/**
 * A query is expected to have format: {filterNameA: [1], filterNameB: ['a', 'b']}
 * A query can composed by adding one filter ad a time. the order of filters should not matter.
 * @param {*} query 
 */

function compose(query) {
  query = query || {};
  var _query = query,
      must = _query.must;
  var builder = bodybuilder();
  if (!must) return builder(); // iterate all filters and add all to the builder
  // TODO might be worth doing this sorting fields and values, so that 2 queries, with different order gets cahced the same

  Object.entries(must).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        filterName = _ref2[0],
        values = _ref2[1];

    var filterConverter = filters[filterName];

    if (filterConverter) {
      // if there exists an explicit mapping for this field, then use that
      if (typeof filterConverter === 'string') {
        // this should be considered a simple terms query with the string as the mapping to the ES field
        termFilter(filterConverter)(values, builder);
      } else {
        // this is a custom builder
        // filters[filterName](values, builder);
        termFilter(filterConverter.fieldName)(filterConverter.getValues(values), builder);
      }
    } else {
      // Not a known filter with an explicit configuration
      // we have several options. 
      // 1 We can ignore the filter as it is unknown
      // 2 We can assume it is a terms filter
      // 3 We can test that it is all strings/numbers and then use a terms filter
      // 4 We can do 3 but also test against the _mappings (e.g. http://c6n1.gbif.org:9200/default-dynamic/_mapping)
      // The simplest solution for now is to assume that it is correctly configured and do 2.
      termFilter(filterName)(values, builder);
    }
  });
  return builder;
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var CancelToken = axios$1.CancelToken;

function get(url, options) {
  var cancel;
  options = options || {};
  options.cancelToken = options.cancelToken || new CancelToken(function executor(c) {
    cancel = c;
  });
  var p = axios$1.get(url, options);
  p.cancel = cancel;
  return p;
}

function post(url, body, options) {
  var cancel;
  options = options || {};
  options.cancelToken = options.cancelToken || new CancelToken(function executor(c) {
    cancel = c;
  });
  var p = axios$1.post(url, body, options);
  p.cancel = cancel;
  return p;
}

var axios = _objectSpread$2(_objectSpread$2({}, axios$1), {}, {
  get: get,
  post: post
});

// const esEndpoint = '//c6n1.gbif.org:9200/occurrence'

var endpoint = 'http://labs.gbif.org:7011';

var query = function query(filters, size, from) {
  var body = compose(filters).size(size).from(from).build();
  return axios.post("".concat(endpoint, "/_search"), body, {});
}; // const build = (filters) => {

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
/*
field: coordinates
url: http://labs.gbif.org:7011/_search?
filter: {"bool":{"filter":{"term":{"datasetKey":"4fa7b334-ce0d-4e88-aaae-2e0c138d049e"}}}}
*/

var MapAreaComponent = /*#__PURE__*/createStyled('div', {
  target: "ewmcyas0"
})( {
  name: "a9mg2k",
  styles: "flex:1 1 100%;display:flex;height:100%;max-height:100vh;flex-direction:column;"
} );

var MapComponent = /*#__PURE__*/createStyled('div', {
  target: "ewmcyas1"
})( {
  name: "1iaaxca",
  styles: "flex:1 1 100%;border:1px solid #ddd;border-radius:3px;display:flex;flex-direction:column;& canvas:focus{outline:none;}"
} );

var Map$1 = /*#__PURE__*/function (_Component) {
  _inherits(Map, _Component);

  var _super = _createSuper$1(Map);

  function Map(props) {
    var _this;

    _classCallCheck(this, Map);

    _this = _super.call(this, props);
    _this.addLayer = _this.addLayer.bind(_assertThisInitialized(_this));
    _this.updateLayer = _this.updateLayer.bind(_assertThisInitialized(_this));
    _this.myRef = React__default.createRef();
    _this.state = {};
    return _this;
  }

  _createClass(Map, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      mapboxgl.accessToken = 'pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA';
      this.map = new mapboxgl.Map({
        container: this.myRef.current,
        style: "mapbox://styles/mapbox/light-v9",
        zoom: sessionStorage.getItem('mapZoom') || 0,
        center: [sessionStorage.getItem('mapLng') || 0, sessionStorage.getItem('mapLat') || 0]
      });
      this.map.addControl(new mapboxgl.NavigationControl({
        showCompass: false
      }), 'top-left');
      this.map.on("load", this.addLayer);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.map.remove();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.filterHash !== this.props.filterHash) {
        this.updateLayer();
      }
    }
  }, {
    key: "updateLayer",
    value: function updateLayer() {
      var layer = this.map.getSource("occurrences");

      if (layer) {
        this.map.removeLayer("occurrences");
        this.map.removeSource("occurrences");
        this.addLayer();
      } else {
        this.addLayer();
      }
    }
  }, {
    key: "addLayer",
    value: function addLayer() {
      // let filter = this.props.filter;
      // filter = this.props.api.compose(filter).build();
      // let borArray = get(this.props.filter, 'must.BasisOfRecord', []).map(e => snakeCase(e).toUpperCase());
      // let filter = {"bool":{"filter":{"terms":{"basisOfRecord":borArray}}}};
      // let filter = {"bool":{"filter":{"terms":{"gbifClassification.usage.rank":borArray}}}};
      var esQuery = compose(this.props.filter).build();
      var tileString = //"https://esmap.gbif-dev.org/api/tile/{x}/{y}/{z}.mvt?field=coordinates&url=" +
      "http://labs.gbif.org:7012/api/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates&url=" + // "http://localhost:3000/api/tile/significant/{x}/{y}/{z}.mvt?field=coordinate_point&significantField=backbone.speciesKey&url=" +
      //"http://localhost:3001/api/tile/point/{x}/{y}/{z}.mvt?resolution=high&field=coordinates&url=" +
      encodeURIComponent("http://c6n1.gbif.org:9200/occurrence/_search?") + "&filter=" + encodeURIComponent(JSON.stringify(esQuery.query));
      this.map.addLayer({
        id: "occurrences",
        type: "circle",
        source: {
          type: "vector",
          tiles: [tileString]
        },
        "source-layer": "occurrences",
        paint: {
          // make circles larger as the user zooms from z12 to z22
          "circle-radius": {
            property: "count",
            type: "interval",
            //stops: [[0, 2]]
            stops: [[0, 2], [10, 3], [100, 5], [1000, 8], [10000, 15]]
          },
          // color circles by ethnicity, using data-driven styles
          "circle-color": {
            property: "count",
            type: "interval",
            stops: [[0, "#fed976"], //#b99939
            [10, "#fd8d3c"], [100, "#fd8d3c"], //#b45100
            [1000, "#f03b20"], //#a40000
            [10000, "#bd0026"]] //#750000

          },
          "circle-opacity": {
            property: "count",
            type: "interval",
            stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
          },
          "circle-stroke-color": {
            property: "count",
            type: "interval",
            stops: [[0, "#fe9724"], //#b99939
            [10, "#fd5b24"], [100, "#fd471d"], //#b45100
            [1000, "#f01129"], //#a40000
            [10000, "#bd0047"]] //#750000

          },
          "circle-stroke-width": {
            property: "count",
            type: "interval",
            stops: [[0, 1], [10, 0]]
          }
        }
      }, "poi-scalerank2");
      var map = this.map;
      map.on('zoomend', function () {
        var center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom());
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });
      map.on('moveend', function () {
        var center = map.getCenter();
        sessionStorage.setItem('mapZoom', map.getZoom());
        sessionStorage.setItem('mapLng', center.lng);
        sessionStorage.setItem('mapLat', center.lat);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React__default.createElement(MapAreaComponent, null, /*#__PURE__*/React__default.createElement(MapComponent, {
        ref: this.myRef
      }));
    }
  }]);

  return Map;
}(React.Component);

var Map$2 = function Map(props) {
  if (typeof window !== 'undefined') {
    return /*#__PURE__*/React__default.createElement(Map$1, props);
  } else {
    return /*#__PURE__*/React__default.createElement("h1", null, "Map placeholder");
  } // return <h1>test</h1>

};

var mapContextToProps = function mapContextToProps(_ref) {
  var filter = _ref.filter,
      filterHash = _ref.filterHash;
  return {
    filter: filter,
    filterHash: filterHash
  };
};

var Map$3 = withContext$1(mapContextToProps)(Map$2);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol_1(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

var _isKey = isKey;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$3).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$4.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$5.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/* Built-in method references that are verified to be native. */
var Map$4 = _getNative(_root, 'Map');

var _Map = Map$4;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize$1(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize$1.Cache || _MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize$1.Cache = _MapCache;

var memoize_1 = memoize$1;

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize_1(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = _memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

var _stringToPath = stringToPath;

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }
  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

/** Used as references for various `Number` constants. */
var INFINITY$1 = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
}

var _toKey = toKey;

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = _castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

var _baseGet = baseGet;

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get$1;

function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var formatFactory = (function (getData) {
  return /*#__PURE__*/function (_Component) {
    _inherits(Format, _Component);

    var _super = _createSuper$2(Format);

    function Format(props) {
      var _this;

      _classCallCheck(this, Format);

      _this = _super.call(this, props);
      _this.getTitle = _this.getTitle.bind(_assertThisInitialized(_this));
      _this.state = {};
      return _this;
    }

    _createClass(Format, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this._mounted = true;
        this.getTitle();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        // Cancel fetch callback?
        this._mounted = false;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
          this.getTitle();
        }
      }
    }, {
      key: "getTitle",
      value: function getTitle() {
        var _this2 = this;

        // TODO consider to cancel request?
        var dataResult = getData(this.props.id); // if it is a promise, then wait for it to return

        if (dataResult && typeof dataResult.then === "function") {
          dataResult.then(function (result) {
            if (_this2._mounted) {
              _this2.setState({
                title: result.title
              });
            }
          }, function (error) {
            if (_this2._mounted) {
              _this2.setState({
                title: "unknown",
                error: true
              });
            }
          });
        } else {
          // the function simply returned a value.
          this.setState({
            title: typeof dataResult.title === 'undefined' ? '' : dataResult.title
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var title = this.state.error ? /*#__PURE__*/React__default.createElement("span", {
          className: "discreet"
        }, "unknown") : this.state.title;
        var style = typeof title !== 'undefined' ? {} : {
          display: 'inline-block',
          width: '100px',
          background: 'rgba(0,0,0,.1)'
        };
        return /*#__PURE__*/React__default.createElement("span", {
          style: style
        }, title, "\xA0");
      }
    }]);

    return Format;
  }(React.Component);
});

/**
 * Converts `string` to
 * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
 *
 * @static
 * @memberOf _
 * @since 3.1.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the start cased string.
 * @example
 *
 * _.startCase('--foo-bar--');
 * // => 'Foo Bar'
 *
 * _.startCase('fooBar');
 * // => 'Foo Bar'
 *
 * _.startCase('__FOO_BAR__');
 * // => 'FOO BAR'
 */
var startCase = _createCompounder(function(result, word, index) {
  return result + (index ? ' ' : '') + upperFirst_1(word);
});

var startCase_1 = startCase;

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

var isUndefined_1 = isUndefined;

var endpoints = {
  dataset: 'https://api.gbif.org/v1/dataset',
  publisher: 'https://api.gbif.org/v1/dataset',
  species: 'https://api.gbif.org/v1/species'
};
var displayName = [{
  name: 'identity',
  format: function format(id) {
    return {
      title: _typeof(id) !== 'object' ? id : JSON.stringify(id)
    };
  }
}, {
  name: 'datasetTitle',
  format: function format(id) {
    return axios.get(endpoints.dataset + '/' + id).then(function (result) {
      return {
        title: result.data.title
      };
    });
  }
}, {
  name: 'publisherKey',
  format: function format(id) {
    return axios.get(endpoints.publisher + '/' + id).then(function (result) {
      return {
        title: result.data.title
      };
    });
  }
}, {
  name: 'TaxonKey',
  format: function format(id) {
    return axios.get(endpoints.species + '/' + id).then(function (result) {
      return {
        title: result.data.scientificName
      };
    });
  }
}, {
  name: 'scientificName',
  format: function format(id) {
    return axios.get(endpoints.species + '/' + id).then(function (result) {
      return {
        title: result.data.scientificName
      };
    });
  }
}, {
  name: 'canonicalName',
  format: function format(id) {
    return axios.get(endpoints.species + '/' + id).then(function (result) {
      return {
        title: result.data.canonicalName
      };
    });
  }
}, {
  name: 'BasisOfRecord',
  format: function format(id) {
    return {
      title: startCase_1(id + '')
    };
  }
}, {
  name: 'TypeStatus',
  format: function format(id) {
    return {
      title: startCase_1(id + '')
    };
  }
}, {
  name: 'year',
  format: function format(id) {
    if (_typeof(id) === 'object') {
      var title;

      if (isUndefined_1(id.gte)) {
        title = "before ".concat(id.lt);
      } else if (isUndefined_1(id.lt)) {
        title = "after ".concat(id.gte);
      } else if (id.gte === id.lt) {
        title = id.gte;
      } else {
        title = "".concat(id.gte, " - ").concat(id.lt);
      }

      return {
        title: title,
        description: 'from (incl) - to (excl)'
      };
    }

    return {
      title: id
    };
  }
}];

function getAsComponents(fns) {
  var displayNamesMap = {};
  fns.forEach(function (x) {
    displayNamesMap[x.name] = {
      format: x.format,
      component: formatFactory(x.format)
    };
  });
  return displayNamesMap;
}

var nameMap = getAsComponents(displayName);
function displayValue (field) {
  return nameMap[field] ? nameMap[field] : nameMap.identity;
}

var TriggerButton = React__default.forwardRef(function (_ref, ref) {
  var options = _ref.options,
      filterName = _ref.filterName,
      displayValueAs = _ref.displayValueAs,
      loading = _ref.loading,
      props = _objectWithoutProperties(_ref, ["options", "filterName", "displayValueAs", "loading"]);

  var currentFilterContext = React.useContext(FilterContext); // const {formatMessage: f} = useIntl();

  var onClear = React.useCallback(function () {
    currentFilterContext.setField(filterName, []);
  }, [currentFilterContext, filterName]);
  var DisplayValue = displayValue(displayValueAs || filterName).component;
  return /*#__PURE__*/React__default.createElement(FilterButton, _extends({
    loading: loading,
    isActive: options.length > 0,
    onClearRequest: onClear
  }, props), options.length === 1 ? /*#__PURE__*/React__default.createElement(DisplayValue, {
    id: options[0]
  }) : /*#__PURE__*/React__default.createElement(reactIntl.FormattedMessage, {
    id: "".concat(options.length === 0 ? 'filterName' : 'filterCount', ".").concat(filterName),
    defaultMessage: 'Loading',
    values: {
      num: options.length
    }
  }) // f({id: `filterName.${filterName}`}) : 
  // f({id: `filterCount.${filterName}`}, {num: options.length})
  );
});
TriggerButton.displayName = 'TriggerButton';

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

var _arrayPush = arrayPush;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$5.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$6.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/** Built-in value references. */
var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray_1(value) || isArguments_1(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

var _isFlattenable = isFlattenable;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = _isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        _arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

var _baseFlatten = baseFlatten;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
  return _defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);
  return this;
}

var _setCacheAdd = setCacheAdd;

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new _MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;

var _SetCache = SetCache;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

var _baseFindIndex = baseFindIndex;

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

var _baseIsNaN = baseIsNaN;

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

var _strictIndexOf = strictIndexOf;

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? _strictIndexOf(array, value, fromIndex)
    : _baseFindIndex(array, _baseIsNaN, fromIndex);
}

var _baseIndexOf = baseIndexOf;

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && _baseIndexOf(array, value, 0) > -1;
}

var _arrayIncludes = arrayIncludes;

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

var _arrayIncludesWith = arrayIncludesWith;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

/* Built-in method references that are verified to be native. */
var Set$1 = _getNative(_root, 'Set');

var _Set = Set$1;

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var noop_1 = noop;

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

/** Used as references for various `Number` constants. */
var INFINITY$2 = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(_Set && (1 / _setToArray(new _Set([,-0]))[1]) == INFINITY$2) ? noop_1 : function(values) {
  return new _Set(values);
};

var _createSet = createSet;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = _arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = _arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : _createSet(array);
    if (set) {
      return _setToArray(set);
    }
    isCommon = false;
    includes = _cacheHas;
    seen = new _SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

var _baseUniq = baseUniq;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([2], [1, 2]);
 * // => [2, 1]
 */
var union = _baseRest(function(arrays) {
  return _baseUniq(_baseFlatten(arrays, 1, isArrayLikeObject_1, true));
});

var union_1 = union;

var Header = function Header(_ref) {
  var children = _ref.children,
      menuItems = _ref.menuItems,
      props = _objectWithoutProperties(_ref, ["children", "menuItems"]);

  return jsx(Row, _extends({
    as: "section"
  }, props, {
    css: header,
    alignItems: "center"
  }), jsx(Col, null, children), menuItems && jsx(Col, {
    grow: false
  }, jsx(Menu, {
    "aria-label": "Custom menu",
    trigger: jsx(Button, {
      appearance: "text"
    }, jsx(md.MdMoreVert, {
      style: {
        fontSize: 24
      }
    })),
    items: menuItems
  })));
};

var header =  {
  name: "59c67a",
  styles: "border-bottom:1px solid #eee;padding:1.2em 1.5em;flex:0 0 auto;"
} ;

var Footer = function Footer(_ref2) {
  var onApply = _ref2.onApply,
      onCancel = _ref2.onCancel,
      onBack = _ref2.onBack,
      _ref2$showBack = _ref2.showBack,
      showBack = _ref2$showBack === void 0 ? false : _ref2$showBack,
      formId = _ref2.formId,
      props = _objectWithoutProperties(_ref2, ["onApply", "onCancel", "onBack", "showBack", "formId"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx(Row, _extends({}, props, {
    css: footer$1()
  }), jsx(Col, null, showBack && jsx(Button, {
    appearance: "ghost",
    onClick: onBack
  }, "Back"), !showBack && jsx(Button, {
    appearance: "ghost",
    onClick: onCancel
  }, "Cancel")), jsx(Col, {
    grow: false
  }, !showBack && jsx(Button, {
    type: "submit",
    form: formId,
    onClick: onApply
  }, "Apply")));
};

var _ref$d =  {
  name: "rwikbu",
  styles: "padding:.8em 1em;flex:0 0 auto;"
} ;

var footer$1 = function footer(theme) {
  return _ref$d;
};

var SummaryBar = function SummaryBar(_ref2) {
  var count = _ref2.count,
      onClear = _ref2.onClear,
      props = _objectWithoutProperties(_ref2, ["count", "onClear"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx("div", _extends({}, props, {
    css: summary()
  }), jsx(Row, {
    as: "div"
  }, jsx(Col, null, count, " selected"), count > 0 && jsx(Col, {
    grow: false
  }, jsx(Button, {
    appearance: "text",
    onClick: onClear
  }, "Clear"))));
};

var _ref$e =  {
  name: "19qmqma",
  styles: "font-size:.85em;color:#999;font-weight:200;margin:.5em 1.5em;"
} ;

var summary = function summary(theme) {
  return _ref$e;
};

var Prose = React__default.forwardRef(function (_ref8, ref) {
  var _ref8$as = _ref8.as,
      Div = _ref8$as === void 0 ? 'div' : _ref8$as,
      props = _objectWithoutProperties(_ref8, ["as"]);

  var theme = React.useContext(ThemeContext$1);
  return jsx(Div, _extends({}, props, {
    css: prose({
      theme: theme
    })
  }));
});

var _ref$f =  {
  name: "3ugpui",
  styles: "ol{counter-reset:listitem;list-style:none;}ol>li{position:relative;margin:4px 0;padding-left:32px;}ol>li:before{counter-increment:listitem;content:counter(listitem);background:#e3e8ee;color:#697386;font-size:12px;font-weight:500;line-height:10px;text-align:center;padding:5px 0;height:20px;width:20px;border-radius:10px;position:absolute;left:0;}"
} ;

var ol = function ol(_ref10) {
  var theme = _ref10.theme;
  return _ref$f;
};

var _ref2$6 =  {
  name: "fm4a77",
  styles: "font-size:10px;line-height:18px;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;"
} ;

var h6 = function h6(_ref11) {
  var theme = _ref11.theme;
  return _ref2$6;
};

var _ref3$7 =  {
  name: "10eq0k5",
  styles: "font-size:12px;line-height:24px;text-transform:uppercase;letter-spacing:1px;font-weight:500;color:#32536a;"
} ;

var h5 = function h5(_ref12) {
  var theme = _ref12.theme;
  return _ref3$7;
};

var _ref4$5 =  {
  name: "1bqvafv",
  styles: "font-size:18px;line-height:24px;"
} ;

var h4 = function h4(_ref13) {
  var theme = _ref13.theme;
  return _ref4$5;
};

var _ref5$5 =  {
  name: "1toivzt",
  styles: "font-size:20px;line-height:24px;"
} ;

var h3 = function h3(_ref14) {
  var theme = _ref14.theme;
  return _ref5$5;
};

var _ref6$4 =  {
  name: "1vplvgm",
  styles: "font-size:28px;line-height:36px;"
} ;

var h2 = function h2(_ref15) {
  var theme = _ref15.theme;
  return _ref6$4;
};

var _ref7$2 =  {
  name: "1042jzs",
  styles: "font-size:36px;line-height:48px;"
} ;

var h1 = function h1(_ref16) {
  var theme = _ref16.theme;
  return _ref7$2;
};
var prose = function prose(_ref17) {
  var theme = _ref17.theme;
  return /*#__PURE__*/css("-webkit-font-smoothing:antialiased;line-height:1.3em;h1,h2,h3,h4,h5,h6{font-weight:400;}h1{", h1(theme), ";}h2{", h2(theme), ";}h3{", h3(theme), ";}h4{", h4(theme), ";}h5{", h5(theme), ";}h6{", h6(theme), ";}", ol(theme), ";p{margin-bottom:8px;}" + ( "" ));
};

// to use theme do e.g.: color: ${props => props.theme.colors.primary};
var FilterBox = createStyled("div", {
  target: "e11diz0w0"
})( {
  name: "uwbajk",
  styles: "display:flex;flex-direction:column;max-height:inherit;"
} ); // https://stackoverflow.com/questions/9333379/check-if-an-elements-content-is-overflowing
// I would never have thought of this myself.

var scrollBox =  {
  name: "1c38yq8",
  styles: "background:linear-gradient(white 30%,rgba(255,255,255,0)),linear-gradient(rgba(255,255,255,0),white 70%) 0 100%,linear-gradient(to bottom,#eee 1px,transparent 1px 100%),linear-gradient(to bottom,transparent calc(100% - 1px),#eee calc(100% - 1px) 100%);background-repeat:no-repeat;background-color:white;background-size:100% 10px,100% 10px,100% 20px,100% 100%;background-attachment:local,local,scroll,scroll;"
} ;
var FilterBody = createStyled("div", {
  target: "e11diz0w1"
})(scrollBox, " padding:.5em 1.5em;flex:1 1 auto;overflow:auto;scrollbar-width:thin;&::-webkit-scrollbar{width:6px;}&::-webkit-scrollbar-thumb{background-color:#686868;}" + ( "" ));
var FilterBodyDescription = /*#__PURE__*/createStyled(FilterBody, {
  target: "e11diz0w2"
})( {
  name: "12aw9rk",
  styles: "padding-top:20px;padding-bottom:20px;"
} );

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE$1 = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE$1 - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$6.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$7.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$7.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$8.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$9 = objectProto$9.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$a = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$a.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$1(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn$1;

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports =  exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

var _arrayFilter = arrayFilter;

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

/** Used for built-in method references. */
var objectProto$b = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

var _getSymbols = getSymbols;

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
  var result = [];
  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }
  return result;
};

var _getSymbolsIn = getSymbolsIn;

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Promise = _getNative(_root, 'Promise');

var _Promise = Promise;

/* Built-in method references that are verified to be native. */
var WeakMap$1 = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap$1;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

var dataViewTag$1 = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
    (_Map && getTag(new _Map) != mapTag$1) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag$1) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag$1;
        case mapCtorString: return mapTag$1;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag$1;
        case weakMapCtorString: return weakMapTag$1;
      }
    }
    return result;
  };
}

var _getTag = getTag;

/** Used for built-in method references. */
var objectProto$c = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$b = objectProto$c.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty$b.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

var _initCloneArray = initCloneArray;

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/** `Object#toString` result references. */
var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';

var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1: case float64Tag$1:
    case int8Tag$1: case int16Tag$1: case int32Tag$1:
    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor;

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor;

    case symbolTag$1:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/** `Object#toString` result references. */
var mapTag$3 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
}

var _baseIsMap = baseIsMap;

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

/** `Object#toString` result references. */
var setTag$3 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
cloneableTags[numberTag$2] = cloneableTags[objectTag$2] =
cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
cloneableTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject_1(value)) {
    return value;
  }
  var isArr = isArray_1(value);
  if (isArr) {
    result = _initCloneArray(value);
    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }
    if (tag == objectTag$2 || tag == argsTag$2 || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? _copySymbolsIn(value, _baseAssignIn(result, value))
          : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = _initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new _Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_1(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? _getAllKeysIn : _getAllKeys)
    : (isFlat ? keysIn : keys_1);

  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1,
    CLONE_SYMBOLS_FLAG$1 = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
}

var cloneDeep_1 = cloneDeep;

/**
 * This method is like `_.uniq` except that it accepts `comparator` which
 * is invoked to compare elements of `array`. The order of result values is
 * determined by the order they occur in the array.The comparator is invoked
 * with two arguments: (arrVal, othVal).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 *
 * _.uniqWith(objects, _.isEqual);
 * // => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 */
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return (array && array.length) ? _baseUniq(array, undefined, comparator) : [];
}

var uniqWith_1 = uniqWith;

/* global Map:readonly, Set:readonly, ArrayBuffer:readonly */

var hasElementType = typeof Element !== 'undefined';
var hasMap = typeof Map === 'function';
var hasSet = typeof Set === 'function';
var hasArrayBuffer = typeof ArrayBuffer === 'function' && !!ArrayBuffer.isView;

// Note: We **don't** need `envHasBigInt64Array` in fde es6/index.js

function equal(a, b) {
  // START: fast-deep-equal es6/index.js 3.1.1
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

    // START: Modifications:
    // 1. Extra `has<Type> &&` helpers in initial condition allow es6 code
    //    to co-exist with es5.
    // 2. Replace `for of` with es5 compliant iteration using `for`.
    //    Basically, take:
    //
    //    ```js
    //    for (i of a.entries())
    //      if (!b.has(i[0])) return false;
    //    ```
    //
    //    ... and convert to:
    //
    //    ```js
    //    it = a.entries();
    //    while (!(i = it.next()).done)
    //      if (!b.has(i.value[0])) return false;
    //    ```
    //
    //    **Note**: `i` access switches to `i.value`.
    var it;
    if (hasMap && (a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!b.has(i.value[0])) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!equal(i.value[1], b.get(i.value[0]))) return false;
      return true;
    }

    if (hasSet && (a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      it = a.entries();
      while (!(i = it.next()).done)
        if (!b.has(i.value[0])) return false;
      return true;
    }
    // END: Modifications

    if (hasArrayBuffer && ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
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
    // END: fast-deep-equal

    // START: react-fast-compare
    // custom handling for DOM elements
    if (hasElementType && a instanceof Element) return false;

    // custom handling for React/Preact
    for (i = length; i-- !== 0;) {
      if ((keys[i] === '_owner' || keys[i] === '__v' || keys[i] === '__o') && a.$$typeof) {
        // React-specific: avoid traversing React elements' _owner
        // Preact-specific: avoid traversing Preact elements' __v and __o
        //    __v = $_original / $_vnode
        //    __o = $_owner
        // These properties contain circular references and are not needed when
        // comparing the actual elements (and not their owners)
        // .$$typeof and ._store on just reasonable markers of elements

        continue;
      }

      // all other properties should be traversed as usual
      if (!equal(a[keys[i]], b[keys[i]])) return false;
    }
    // END: react-fast-compare

    // START: fast-deep-equal
    return true;
  }

  return a !== a && b !== b;
}
// end fast-deep-equal

var reactFastCompare = function isEqual(a, b) {
  try {
    return equal(a, b);
  } catch (error) {
    if (((error.message || '').match(/stack|recursion/i))) {
      // warn on circular references, don't crash
      // browsers give this different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      console.warn('react-fast-compare cannot handle circular refs');
      return false;
    }
    // some other error. we should definitely know about these
    throw error;
  }
};

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var FilterState = /*#__PURE__*/function (_React$Component) {
  _inherits(FilterState, _React$Component);

  var _super = _createSuper$3(FilterState);

  function FilterState() {
    var _this;

    _classCallCheck(this, FilterState);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty$1(_assertThisInitialized(_this), "setFilter", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(filter) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!reactFastCompare(filter, _this.props.filter)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                if (_typeof(filter) === 'object') {
                  filter = cloneDeep_1(filter);
                  Object.keys(filter).forEach(function (key) {
                    if (typeof filter[key] === 'undefined') delete filter[key];
                  });
                  if (Object.keys(filter).length === 0) filter = undefined;
                }

                _this.props.onChange(filter);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty$1(_assertThisInitialized(_this), "setField", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(field, value) {
        var must,
            filter,
            type,
            _args2 = arguments;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                must = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : true;
                filter = _this.props.filter ? cloneDeep_1(_this.props.filter) : {};
                type = must ? 'must' : 'must_not';

                _this.setFilter(_objectSpread$3(_objectSpread$3({}, filter), {}, _defineProperty$1({}, type, _objectSpread$3(_objectSpread$3({}, filter[type]), {}, _defineProperty$1({}, field, value)))));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty$1(_assertThisInitialized(_this), "add", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(field, value) {
        var must,
            type,
            values,
            _args3 = arguments;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                must = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : true;
                type = must ? 'must' : 'must_not';
                values = get_1(_this.props.filter, "".concat(type, ".").concat(field), []);
                values = values.concat(value);
                values = uniqWith_1(values, reactFastCompare);

                _this.setField(field, values, must);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      return function (_x4, _x5) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty$1(_assertThisInitialized(_this), "remove", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(field, value) {
        var must,
            type,
            values,
            _args4 = arguments;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                must = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : true;
                type = must ? 'must' : 'must_not';
                values = get_1(_this.props.filter, "".concat(type, ".").concat(field), []);
                values = values.filter(function (e) {
                  return !reactFastCompare(e, value);
                });

                _this.setField(field, values, must);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x6, _x7) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty$1(_assertThisInitialized(_this), "toggle", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(field, value) {
        var must,
            type,
            values,
            _args5 = arguments;
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                must = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : true;
                type = must ? 'must' : 'must_not';
                values = get_1(_this.props.filter, "".concat(type, ".").concat(field), []);

                if (values.some(function (e) {
                  return reactFastCompare(e, value);
                })) {
                  _this.remove(field, value, must);
                } else {
                  _this.add(field, value, must);
                }

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x8, _x9) {
        return _ref5.apply(this, arguments);
      };
    }());

    return _this;
  }

  _createClass(FilterState, [{
    key: "render",
    value: function render() {
      var contextValue = {
        setField: this.setField,
        // updates a single field
        setFilter: this.setFilter,
        // updates the filter as a whole
        add: this.add,
        remove: this.remove,
        toggle: this.toggle,
        filter: this.props.filter,
        filterHash: hash(this.props.filter || {})
      };
      return /*#__PURE__*/React__default.createElement(FilterContext.Provider, {
        value: contextValue
      }, this.props.children);
    }
  }]);

  return FilterState;
}(React__default.Component); // export default FilterState;


var UncontrollableFilterState = uncontrollable.uncontrollable(FilterState, {
  filter: 'onChange'
});

function Filter(_ref) {
  var children = _ref.children,
      onApply = _ref.onApply,
      onCancel = _ref.onCancel,
      title = _ref.title,
      aboutText = _ref.aboutText,
      hasHelpTexts = _ref.hasHelpTexts,
      filterName = _ref.filterName,
      formId = _ref.formId,
      tmpFilter = _ref.filter,
      onFilterChange = _ref.onFilterChange,
      aboutVisible = _ref.aboutVisible,
      onAboutChange = _ref.onAboutChange,
      helpVisible = _ref.helpVisible,
      onHelpChange = _ref.onHelpChange,
      style = _ref.style;
  return /*#__PURE__*/React__default.createElement(UncontrollableFilterState, {
    filter: tmpFilter,
    onChange: function onChange(updatedFilter) {
      return onFilterChange(updatedFilter);
    }
  }, /*#__PURE__*/React__default.createElement(FilterContext.Consumer, null, function (_ref2) {
    var setField = _ref2.setField,
        toggle = _ref2.toggle,
        filter = _ref2.filter;
    var selectedItems = get_1(filter, "must.".concat(filterName), []);
    var checkedMap = new Set(selectedItems);
    var summaryProps = {
      count: checkedMap.size,
      onClear: function onClear() {
        return setField(filterName, []);
      }
    };
    var footerProps = {
      formId: formId,
      showBack: aboutVisible,
      onBack: function onBack() {
        return onAboutChange(false);
      }
    };
    return /*#__PURE__*/React__default.createElement(FilterBox, {
      style: style
    }, /*#__PURE__*/React__default.createElement(Header, {
      menuItems: function menuItems(menuState) {
        return [].concat(_toConsumableArray(aboutText ? [/*#__PURE__*/React__default.createElement(MenuAction, {
          key: "About",
          onClick: function onClick() {
            onAboutChange(true);
            menuState.hide();
          }
        }, "About this filter")] : []), _toConsumableArray(hasHelpTexts ? [/*#__PURE__*/React__default.createElement(MenuToggle, {
          key: "Help",
          disabled: aboutVisible,
          style: {
            opacity: aboutVisible ? .5 : 1
          },
          checked: !!helpVisible,
          onChange: function onChange() {
            return onHelpChange(!helpVisible);
          }
        }, "Show help texts")] : []));
      }
    }, title), !aboutVisible && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, children({
      summaryProps: summaryProps,
      footerProps: footerProps,
      helpVisible: helpVisible,
      setField: setField,
      toggle: toggle,
      filter: filter,
      selectedItems: selectedItems,
      checkedMap: checkedMap
    })), aboutVisible && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Prose, {
      as: FilterBodyDescription
    }, aboutText), /*#__PURE__*/React__default.createElement(Footer, footerProps)));
  }));
}

var UncontrollableFilter = uncontrollable.uncontrollable(Filter, {
  aboutVisible: 'onAboutChange',
  helpVisible: 'onHelpChange',
  filter: 'onFilterChange'
});

var Option = React__default.forwardRef(function (_ref2, ref) {
  var label = _ref2.label,
      tabIndex = _ref2.tabIndex,
      checked = _ref2.checked,
      onChange = _ref2.onChange,
      helpText = _ref2.helpText,
      helpVisible = _ref2.helpVisible,
      props = _objectWithoutProperties(_ref2, ["label", "tabIndex", "checked", "onChange", "helpText", "helpVisible"]);

  return jsx("label", {
    css: optionClass(),
    style: {
      display: 'flex',
      wrap: 'nowrap'
    }
  }, jsx("div", null, jsx(Checkbox, {
    ref: ref,
    tabIndex: tabIndex,
    checked: checked,
    onChange: onChange,
    style: {
      flex: '0 0 auto'
    }
  })), jsx("div", {
    style: {
      flex: '1 1 auto',
      marginLeft: 10
    }
  }, jsx("div", null, label), helpVisible && helpText && jsx("div", {
    style: {
      marginTop: 4,
      fontSize: '0.85em',
      color: '#aaa'
    }
  }, helpText))); // return <Row as="label" {...props} css={optionClass(theme)} halfGutter={4} wrap="nowrap">
  //   <Col grow={false} shrink={false}>
  //     <Checkbox ref={ref} checked={checked} onChange={onChange} />
  //   </Col>
  //   <Col>
  //     <div>{label}</div>
  //     {helpVisible && helpText && <div style={{ marginTop: 4, fontSize: '0.85em', color: '#aaa' }}>
  //       {helpText}
  //     </div>}
  //   </Col>
  // </Row>
});
Option.displayName = 'FilterOption';

var _ref$g =  {
  name: "sc26ll",
  styles: "padding:6px 0;&:last-child{margin-bottom:0;}"
} ;

var optionClass = function optionClass(theme) {
  return _ref$g;
};

function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Suggest = /*#__PURE__*/function (_React$Component) {
  _inherits(Suggest, _React$Component);

  var _super = _createSuper$4(Suggest);

  function Suggest() {
    var _this;

    _classCallCheck(this, Suggest);

    _this = _super.call(this); // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.

    _defineProperty$1(_assertThisInitialized(_this), "onChange", function (event, _ref) {
      var newValue = _ref.newValue;

      _this.setState({
        value: newValue
      });
    });

    _defineProperty$1(_assertThisInitialized(_this), "onSuggestionsFetchRequested", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref2) {
        var value, suggestions;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = _ref2.value;

                _this.setState({
                  loading: true
                });

                _context.next = 4;
                return _this.props.getSuggestions({
                  q: value
                });

              case 4:
                suggestions = _context.sent;

                _this.setState({
                  suggestions: suggestions,
                  loading: false
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }());

    _defineProperty$1(_assertThisInitialized(_this), "onSuggestionsClearRequested", function () {
      _this.setState({
        suggestions: []
      });
    });

    _defineProperty$1(_assertThisInitialized(_this), "onSuggestionSelected", function (_ref4) {
      var item = _ref4.item,
          value = _ref4.value;

      _this.props.onSuggestionSelected({
        item: item,
        value: value
      });

      _this.setState({
        value: '',
        item: item
      });
    });

    _this.state = {
      value: '',
      suggestions: []
    };
    return _this;
  }

  _createClass(Suggest, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          value = _this$state.value,
          suggestions = _this$state.suggestions,
          loading = _this$state.loading;
      var _this$props = this.props,
          render = _this$props.render,
          getValue = _this$props.getValue,
          placeholder = _this$props.placeholder; // Autosuggest will pass through all these props to the input.

      var inputProps = {
        placeholder: placeholder || 'Search',
        value: value,
        onChange: this.onChange,
        onKeyPress: this.props.onKeyPress
      }; // Finally, render it!

      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Autocomplete, {
        style: {
          margin: '10px',
          zIndex: 10
        },
        suggestions: suggestions,
        onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
        onSuggestionsClearRequested: this.onSuggestionsClearRequested,
        getSuggestionValue: getValue,
        renderSuggestion: render,
        inputProps: inputProps,
        onSuggestionSelected: this.onSuggestionSelected,
        isLoading: loading,
        ref: this.props.focusRef
      }));
    }
  }]);

  return Suggest;
}(React__default.Component);

var suggestStyle = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: '100%',
  overflow: 'hidden'
};
var suggestConfigs = {
  scientificName: {
    //What placeholder to show
    placeholder: 'Search by scientific name',
    // how to get the list of suggestion data
    getSuggestions: function () {
      var _getSuggestions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_ref) {
        var q, suggestions;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                q = _ref.q;
                _context.next = 3;
                return axios.get("https://api.gbif.org/v1/species/suggest?limit=8&q=".concat(q));

              case 3:
                suggestions = _context.sent.data;
                return _context.abrupt("return", suggestions);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getSuggestions(_x) {
        return _getSuggestions.apply(this, arguments);
      }

      return getSuggestions;
    }(),
    // how to map the results to a single string value
    getValue: function getValue(suggestion) {
      return suggestion.scientificName;
    },
    // how to display the individual suggestions in the list
    render: function ScientificNameSuggestItem(suggestion) {
      return jsx("div", {
        style: {
          maxWidth: '100%'
        }
      }, jsx("div", {
        style: suggestStyle
      }, suggestion.scientificName), jsx("div", {
        style: {
          color: '#aaa',
          fontSize: '0.85em'
        }
      }, jsx(Classification, {
        taxon: suggestion
      })));
    }
  },
  datasetTitle: {
    //What placeholder to show
    placeholder: 'Search by dataset',
    // how to get the list of suggestion data
    getSuggestions: function () {
      var _getSuggestions2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(_ref2) {
        var q, suggestions;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                q = _ref2.q;
                _context2.next = 3;
                return axios.get("https://api.gbif.org/v1/dataset/suggest?limit=8&q=".concat(q));

              case 3:
                suggestions = _context2.sent.data;
                return _context2.abrupt("return", suggestions);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getSuggestions(_x2) {
        return _getSuggestions2.apply(this, arguments);
      }

      return getSuggestions;
    }(),
    // how to map the results to a single string value
    getValue: function getValue(suggestion) {
      return suggestion.title;
    },
    // how to display the individual suggestions in the list
    render: function ScientificNameSuggestItem(suggestion) {
      return jsx("div", {
        style: {
          maxWidth: '100%'
        }
      }, jsx("div", {
        style: suggestStyle
      }, suggestion.title));
    }
  }
};
var Classification = function Classification(_ref3) {
  var taxon = _ref3.taxon,
      props = _objectWithoutProperties(_ref3, ["taxon"]);

  var ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  return jsx("span", {
    css: taxClass
  }, ranks.map(function (rank) {
    return taxon.rank !== rank.toUpperCase() && taxon[rank] ? jsx("span", {
      key: rank
    }, taxon[rank]) : null;
  }));
};
var taxClass =  {
  name: "45h2oi",
  styles: "&>span:after{font-style:normal;content:' \u276F ';font-size:80%;color:#ccc;display:inline-block;padding:0 3px;}&>span:last-of-type:after{display:none;}"
} ;

var ScientificName = displayValue('scientificName').component;
var PopupContent = function PopupContent(_ref) {
  var hide = _ref.hide,
      _onApply = _ref.onApply,
      _onCancel = _ref.onCancel,
      onFilterChange = _ref.onFilterChange,
      focusRef = _ref.focusRef,
      filterName = _ref.filterName,
      initFilter = _ref.initFilter;

  var _React$useState = React__default.useState(nanoid.nanoid),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      id = _React$useState2[0];

  var initialOptions = get_1(initFilter, "must.".concat(filterName), []);

  var _useState = React.useState(initialOptions),
      _useState2 = _slicedToArray(_useState, 2),
      options = _useState2[0],
      setOptions = _useState2[1];

  return jsx(UncontrollableFilter, {
    onApply: _onApply,
    onCancel: _onCancel,
    title: "Scientific name",
    aboutText: "some help text",
    onFilterChange: onFilterChange,
    filterName: filterName,
    formId: id,
    defaultFilter: initFilter
  }, function (_ref2) {
    var filter = _ref2.filter,
        toggle = _ref2.toggle,
        checkedMap = _ref2.checkedMap,
        formId = _ref2.formId,
        summaryProps = _ref2.summaryProps,
        footerProps = _ref2.footerProps;
    return jsx(React__default.Fragment, null, jsx(Suggest, _extends({}, suggestConfigs.scientificName, {
      focusRef: focusRef,
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      },
      onSuggestionSelected: function onSuggestionSelected(_ref3) {
        var item = _ref3.item;
        var allOptions = union_1(options, [item.key]);
        setOptions(allOptions);
        toggle(filterName, item.key);
      }
    })), options.length > 0 && jsx(React__default.Fragment, null, jsx(SummaryBar, _extends({}, summaryProps, {
      style: {
        marginTop: 0
      }
    })), jsx(FilterBody, {
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      }
    }, jsx("form", {
      id: formId,
      onSubmit: function onSubmit(e) {
        return e.preventDefault();
      }
    }, options.map(function (taxonKey) {
      return jsx(Option, {
        key: taxonKey,
        helpVisible: true,
        label: jsx(ScientificName, {
          id: taxonKey
        }),
        checked: checkedMap.has(taxonKey),
        onChange: function onChange() {
          return toggle(filterName, taxonKey);
        }
      });
    }))), jsx(Footer, _extends({}, footerProps, {
      onApply: function onApply() {
        return _onApply({
          filter: filter,
          hide: hide
        });
      },
      onCancel: function onCancel() {
        return _onCancel({
          filter: filter,
          hide: hide
        });
      }
    }))));
  });
};
var TaxonFilterPopover = function TaxonFilterPopover(_ref7) {
  var placement = _ref7.placement,
      modal = _ref7.modal,
      children = _ref7.children;
  var currentFilterContext = React.useContext(FilterContext);

  var _useState5 = React.useState(currentFilterContext.filter),
      _useState6 = _slicedToArray(_useState5, 2),
      tmpFilter = _useState6[0],
      setFilter = _useState6[1];

  React.useEffect(function () {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);
  var onApply = React.useCallback(function (_ref8) {
    var filter = _ref8.filter,
        hide = _ref8.hide;
    currentFilterContext.setFilter(filter);
    hide();
  }, [currentFilterContext]);
  var onCancel = React.useCallback(function (_ref9) {
    var hide = _ref9.hide;
    hide();
  }, []);
  var onFilterChange = React.useCallback(function (filter) {
    setFilter(filter);
  }, []);
  return jsx(Popover, {
    onClickOutside: function onClickOutside(popover) {
      currentFilterContext.setFilter(tmpFilter);
      popover.hide();
    },
    style: {
      width: '22em',
      maxWidth: '100%'
    },
    "aria-label": "Filter on scientific name",
    placement: placement,
    trigger: children,
    modal: modal
  }, function (_ref10) {
    var hide = _ref10.hide,
        focusRef = _ref10.focusRef;
    return jsx(PopupContent, {
      filterName: "taxonKey" // onApply={filter => { currentFilterContext.setFilter(filter) }}
      // onCancel={emptyFunc}
      // onFilterChange={emptyFunc}
      // initFilter={currentFilterContext.filter}
      ,
      hide: hide,
      onApply: onApply,
      onCancel: onCancel,
      onFilterChange: onFilterChange,
      initFilter: currentFilterContext.filter,
      focusRef: focusRef
    });
  });
};
var TaxonFilter = function TaxonFilter(_ref11) {
  var props = _extends({}, _ref11);

  var currentFilterContext = React.useContext(FilterContext);
  var filterName = 'taxonKey';
  return jsx(TaxonFilterPopover, {
    modal: true
  }, jsx(TriggerButton, _extends({}, props, {
    filterName: filterName,
    displayValueAs: "canonicalName",
    options: get_1(currentFilterContext.filter, "must.".concat(filterName))
  })));
};

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

var _arrayAggregator = arrayAggregator;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  _baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

var _baseAggregator = baseAggregator;

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

var _arraySome = arraySome;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new _SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!_arraySome(other, function(othValue, othIndex) {
            if (!_cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

/** `Object#toString` result references. */
var boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]';

var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$3:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq_1(+object, +other);

    case errorTag$2:
      return object.name == other.name && object.message == other.message;

    case regexpTag$3:
    case stringTag$3:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag$5:
      var convert = _mapToArray;

    case setTag$5:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG$1;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }
  }
  return false;
}

var _equalByTag = equalByTag;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$c = objectProto$d.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty$c.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;

/** `Object#toString` result references. */
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$3 = '[object Object]';

/** Used for built-in method references. */
var objectProto$e = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$d = objectProto$e.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$2 : _getTag(object),
      othTag = othIsArr ? arrayTag$2 : _getTag(other);

  objTag = objTag == argsTag$3 ? objectTag$3 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$3 : othTag;

  var objIsObj = objTag == objectTag$3,
      othIsObj = othTag == objectTag$3,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack);
    return (objIsArr || isTypedArray_1(object))
      ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$d.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$d.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new _Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new _Stack);
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
    return value !== value && other !== other;
  }
  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

var _baseIsMatch = baseIsMatch;

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, _isStrictComparable(value)];
  }
  return result;
}

var _getMatchData = getMatchData;

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = _getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) &&
    (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get_1(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn_1(object, path)
      : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity_1;
  }
  if (typeof value == 'object') {
    return isArray_1(value)
      ? _baseMatchesProperty(value[0], value[1])
      : _baseMatches(value);
  }
  return property_1(value);
}

var _baseIteratee = baseIteratee;

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayAggregator : _baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, _baseIteratee(iteratee), accumulator);
  };
}

var _createAggregator = createAggregator;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the last element responsible for generating the key. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.keyBy(array, function(o) {
 *   return String.fromCharCode(o.code);
 * });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.keyBy(array, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 */
var keyBy = _createAggregator(function(result, value, key) {
  _baseAssignValue(result, key, value);
});

var keyBy_1 = keyBy;

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var enumMap = {};

var getByLanguage = function getByLanguage(obj, language) {
  if (!obj) return;
  return obj[language] || obj.eng || undefined;
};

var getCoreFields = function getCoreFields(obj, language) {
  var label = getByLanguage(obj.label, language);
  var definition = getByLanguage(obj.definition, language);
  return _objectSpread$4(_objectSpread$4({
    name: obj.name
  }, label ? {
    label: label
  } : null), definition ? {
    definition: definition
  } : null);
};

var fetchVocabulary = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(name, language) {
    var vocab, concepts, trimmedConcepts;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return axios.get("https://api.gbif-uat.org/v1/vocabularies/".concat(name));

          case 2:
            vocab = _context.sent.data;
            _context.next = 5;
            return axios.get("https://api.gbif-uat.org/v1/vocabularies/".concat(name, "/concepts?limit=1000"));

          case 5:
            concepts = _context.sent.data;
            trimmedConcepts = concepts.results.map(function (c) {
              return _objectSpread$4({}, getCoreFields(c, language));
            });
            return _context.abrupt("return", _objectSpread$4(_objectSpread$4({}, getCoreFields(vocab, language)), {}, {
              concepts: trimmedConcepts,
              hasConceptDefinitions: trimmedConcepts.some(function (e) {
                return e.definition;
              })
            }));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchVocabulary(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getVocabulary = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(name, language) {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            language = language || 'eng';

            if (!enumMap["".concat(name, "_").concat(language)]) {
              enumMap["".concat(name, "_").concat(language)] = fetchVocabulary(name, language);
            }

            return _context2.abrupt("return", enumMap["".concat(name, "_").concat(language)]);

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getVocabulary(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

function PopupContent$1(_ref) {
  var hide = _ref.hide,
      _onApply = _ref.onApply,
      _onCancel = _ref.onCancel,
      onFilterChange = _ref.onFilterChange,
      focusRef = _ref.focusRef,
      vocabulary = _ref.vocabulary,
      filterName = _ref.filterName,
      initFilter = _ref.initFilter;

  var _React$useState = React__default.useState(nanoid.nanoid),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      id = _React$useState2[0];

  return /*#__PURE__*/React__default.createElement(UncontrollableFilter, {
    onApply: _onApply,
    onCancel: _onCancel,
    title: vocabulary.label,
    aboutText: vocabulary.definition,
    hasHelpTexts: vocabulary.hasConceptDefinitions,
    onFilterChange: onFilterChange,
    filterName: filterName,
    formId: id,
    defaultFilter: initFilter
  }, function (_ref2) {
    var helpVisible = _ref2.helpVisible,
        toggle = _ref2.toggle,
        filter = _ref2.filter,
        checkedMap = _ref2.checkedMap,
        formId = _ref2.formId,
        summaryProps = _ref2.summaryProps,
        footerProps = _ref2.footerProps;
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(SummaryBar, summaryProps), /*#__PURE__*/React__default.createElement(FilterBody, null, /*#__PURE__*/React__default.createElement("form", {
      id: formId,
      onSubmit: function onSubmit(e) {
        return e.preventDefault();
      }
    }, vocabulary && vocabulary.concepts.map(function (concept, index) {
      return /*#__PURE__*/React__default.createElement(Option, {
        innerRef: index === 0 ? focusRef : null,
        key: concept.name,
        helpVisible: helpVisible,
        helpText: concept.definition,
        label: concept.label,
        checked: checkedMap.has(concept.name),
        onChange: function onChange() {
          return toggle(vocabulary.name, concept.name);
        }
      });
    }))), /*#__PURE__*/React__default.createElement(Footer, _extends({}, footerProps, {
      onApply: function onApply() {
        return _onApply({
          filter: filter,
          hide: hide
        });
      },
      onCancel: function onCancel() {
        return _onCancel({
          filter: filter,
          hide: hide
        });
      }
    })));
  });
}

var VocabularyFilter = function VocabularyFilter(_ref3) {
  var _ref3$vocabularyName = _ref3.vocabularyName,
      vocabularyName = _ref3$vocabularyName === void 0 ? 'BasisOfRecord' : _ref3$vocabularyName,
      props = _objectWithoutProperties(_ref3, ["vocabularyName"]);

  var currentFilterContext = React.useContext(FilterContext);
  return /*#__PURE__*/React__default.createElement(VocabularyFilterPopover, {
    modal: true,
    vocabularyName: vocabularyName
  }, function (_ref4) {
    var vocabulary = _ref4.vocabulary;
    return /*#__PURE__*/React__default.createElement(Trigger, _extends({}, props, {
      vocabulary: vocabulary,
      onClear: function onClear() {
        return currentFilterContext.setField(vocabularyName, []);
      },
      filter: currentFilterContext.filter
    }));
  });
};
var VocabularyFilterPopover = function VocabularyFilterPopover(_ref5) {
  var _ref5$vocabularyName = _ref5.vocabularyName,
      vocabularyName = _ref5$vocabularyName === void 0 ? 'BasisOfRecord' : _ref5$vocabularyName,
      children = _ref5.children,
      modal = _ref5.modal,
      placement = _ref5.placement,
      props = _objectWithoutProperties(_ref5, ["vocabularyName", "children", "modal", "placement"]);

  var currentFilterContext = React.useContext(FilterContext);

  var _useState = React.useState(),
      _useState2 = _slicedToArray(_useState, 2),
      vocabulary = _useState2[0],
      setVocabulary = _useState2[1];

  var _useState3 = React.useState(currentFilterContext.filter),
      _useState4 = _slicedToArray(_useState3, 2),
      tmpFilter = _useState4[0],
      setFilter = _useState4[1];

  getVocabulary(vocabularyName, 'eng').then(function (v) {
    return setVocabulary(v);
  })["catch"](function (err) {
    return console.error(err);
  });
  React.useEffect(function () {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);
  var onApply = React.useCallback(function (_ref6) {
    var filter = _ref6.filter,
        hide = _ref6.hide;
    currentFilterContext.setFilter(filter);
    hide();
  }, [currentFilterContext]);
  var onCancel = React.useCallback(function (_ref7) {
    var hide = _ref7.hide;
    hide();
  }, []);
  var onFilterChange = React.useCallback(function (filter) {
    setFilter(filter);
  }, []);
  return /*#__PURE__*/React__default.createElement(Popover, {
    onClickOutside: function onClickOutside(popover) {
      currentFilterContext.setFilter(tmpFilter);
      popover.hide();
    },
    style: {
      width: '22em',
      maxWidth: '100%'
    },
    "aria-label": "Filter on ".concat(vocabularyName),
    placement: placement,
    modal: modal,
    trigger: typeof children === 'function' ? children({
      vocabulary: vocabulary
    }) : children
  }, function (_ref8) {
    var hide = _ref8.hide,
        focusRef = _ref8.focusRef;
    return vocabulary && /*#__PURE__*/React__default.createElement(PopupContent$1, {
      filterName: vocabularyName,
      vocabulary: vocabulary,
      hide: hide,
      onApply: onApply,
      onCancel: onCancel,
      onFilterChange: onFilterChange,
      initFilter: currentFilterContext.filter,
      focusRef: focusRef
    });
  });
};
var Trigger = React__default.forwardRef(function (_ref9, ref) {
  var filter = _ref9.filter,
      onClear = _ref9.onClear,
      vocabulary = _ref9.vocabulary,
      props = _objectWithoutProperties(_ref9, ["filter", "onClear", "vocabulary"]);

  if (!vocabulary) return /*#__PURE__*/React__default.createElement(Button, {
    appearance: "primaryOutline",
    ref: ref,
    loading: true
  }, "Loading");
  var appliedFiltersSet = new Set(get_1(filter, "must.".concat(vocabulary.name), []));

  if (appliedFiltersSet.size === 1) {
    var selected = keyBy_1(vocabulary.concepts, 'name')[filter.must[vocabulary.name][0]].label;
    return /*#__PURE__*/React__default.createElement(FilterButton, _extends({
      isActive: true
    }, props, {
      ref: ref,
      onClearRequest: onClear
    }), selected);
  }

  if (appliedFiltersSet.size > 1) {
    return /*#__PURE__*/React__default.createElement(FilterButton, _extends({
      isActive: true,
      onClearRequest: onClear
    }, props, {
      ref: ref
    }), appliedFiltersSet.size, " ", vocabulary.label, "s");
  }

  return /*#__PURE__*/React__default.createElement(FilterButton, _extends({}, props, {
    ref: ref
  }), vocabulary.label);
});
Trigger.displayName = 'FilterButton';

var getRows = function getRows(_ref) {
  var result = _ref.result;
  var hits = result.hits.hits;
  var rows = hits.map(function (row) {
    var cells = ['gbifClassification.acceptedUsage.name', 'year', 'basisOfRecord', 'datasetTitle', 'publisherTitle', 'countryCode', 'gbifClassification.acceptedUsage.rank'].map(function (field, i) {
      // const FormatedName = formatters(field).component;
      // const Presentation = <FormatedName id={row._source[field]} />;
      // if (i === 0) return <Td key={field}><Action onSelect={() => console.log(row._id)}>{Presentation}</Action></Td>;
      // else return <Td key={field}>{Presentation}</Td>;
      var val = get_1(row._source, field);
      return /*#__PURE__*/React__default.createElement(Td, {
        key: field
      }, val); // if (i === 0) {
      //   return <Td key={field}>
      //     <TextButton onClick={() => console.log(row)}>{val}</TextButton>
      //   </Td>
      // } else {
      //   return <Td key={field}>{val}</Td>;
      // }
    });
    return /*#__PURE__*/React__default.createElement("tr", {
      key: row._id
    }, cells);
  });
  return rows;
};

var TablePresentation = function TablePresentation(_ref2) {
  var first = _ref2.first,
      prev = _ref2.prev,
      next = _ref2.next,
      size = _ref2.size,
      from = _ref2.from,
      result = _ref2.result,
      loading = _ref2.loading;

  var _useState = React.useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      fixedColumn = _useState2[0],
      setFixed = _useState2[1];

  var total = result.hits.total;
  var headers = [/*#__PURE__*/React__default.createElement(Th, {
    key: "scientificName",
    width: "wide",
    locked: fixedColumn,
    toggle: function toggle() {
      return setFixed(!fixedColumn);
    }
  }, /*#__PURE__*/React__default.createElement(Row, null, /*#__PURE__*/React__default.createElement(Col, {
    grow: false
  }, "scientificName"), /*#__PURE__*/React__default.createElement(Col, null, /*#__PURE__*/React__default.createElement(TaxonFilterPopover, {
    modal: true
  }, /*#__PURE__*/React__default.createElement(Button, {
    appearance: "text",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React__default.createElement(md.MdFilterList, null)))))), /*#__PURE__*/React__default.createElement(Th, {
    key: "year"
  }, "year"), /*#__PURE__*/React__default.createElement(Th, {
    key: "basisOfRecord",
    width: "wide"
  }, /*#__PURE__*/React__default.createElement(Row, null, /*#__PURE__*/React__default.createElement(Col, {
    grow: false
  }, "Basis of record"), /*#__PURE__*/React__default.createElement(Col, null, /*#__PURE__*/React__default.createElement(VocabularyFilterPopover, {
    modal: true
  }, /*#__PURE__*/React__default.createElement(Button, {
    appearance: "text",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React__default.createElement(md.MdFilterList, null)))))), /*#__PURE__*/React__default.createElement(Th, {
    key: "datasetTitle",
    width: "wide"
  }, /*#__PURE__*/React__default.createElement(Row, null, /*#__PURE__*/React__default.createElement(Col, {
    grow: false
  }, "Basis of record"), /*#__PURE__*/React__default.createElement(Col, null, /*#__PURE__*/React__default.createElement(VocabularyFilterPopover, {
    modal: true
  }, /*#__PURE__*/React__default.createElement(Button, {
    appearance: "text",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React__default.createElement(md.MdFilterList, null)))))), /*#__PURE__*/React__default.createElement(Th, {
    key: "publisherTitle",
    width: "wide"
  }, "publisherTitle"), /*#__PURE__*/React__default.createElement(Th, {
    key: "countryCode"
  }, "countryCode"), /*#__PURE__*/React__default.createElement(Th, {
    key: "gbifTaxonRank"
  }, "rank")];
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React__default.createElement(DataTable, _extends({
    fixedColumn: fixedColumn
  }, {
    first: first,
    prev: prev,
    next: next,
    size: size,
    from: from,
    total: total
  }, {
    style: {
      flex: "1 1 auto",
      height: 100
    }
  }), /*#__PURE__*/React__default.createElement("thead", null, /*#__PURE__*/React__default.createElement("tr", null, headers)), /*#__PURE__*/React__default.createElement(TBody, {
    rowCount: size,
    columnCount: 7,
    loading: loading
  }, getRows({
    result: result
  })))); // return <div>
  // <DataTable fixedColumn={fixedColumn} {...{ first, prev, next, size, from, total }}>
  //   <thead>
  //     <tr>{headers}</tr>
  //   </thead>
  //   <TBody columnCount={7} loading={loading}>
  //     {getRows({ result })}
  //   </TBody>
  // </DataTable>
  // </div>
};

function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Table = /*#__PURE__*/function (_Component) {
  _inherits(Table, _Component);

  var _super = _createSuper$5(Table);

  function Table(props) {
    var _this;

    _classCallCheck(this, Table);

    _this = _super.call(this, props);

    _defineProperty$1(_assertThisInitialized(_this), "loadData", function () {
      _this.setState({
        loading: true,
        error: false
      });

      if (_this.runningQuery && _this.runningQuery.cancel) _this.runningQuery.cancel();
      _this.runningQuery = query(_this.props.filter, _this.state.size, _this.state.from);

      _this.runningQuery.then(function (response) {
        if (_this._isMount) {
          _this.setState({
            loading: false,
            error: false,
            data: response.data
          });
        }
      })["catch"](function (err) {
        console.error(err); //TODO error handling

        if (_this._isMount) {
          _this.setState({
            loading: false,
            error: true
          });
        }
      });
    });

    _defineProperty$1(_assertThisInitialized(_this), "next", function () {
      _this.setState({
        from: Math.max(0, _this.state.from + _this.state.size)
      }, _this.loadData);
    });

    _defineProperty$1(_assertThisInitialized(_this), "prev", function () {
      _this.setState({
        from: Math.max(0, _this.state.from - _this.state.size)
      }, _this.loadData);
    });

    _defineProperty$1(_assertThisInitialized(_this), "first", function () {
      _this.setState({
        from: 0
      }, _this.loadData);
    });

    _this.state = {
      loading: true,
      error: false,
      size: 20,
      from: 0,
      data: {
        hits: {
          hits: []
        }
      }
    };
    return _this;
  }

  _createClass(Table, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMount = true;
      this.loadData();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMount = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.filterHash !== this.props.filterHash) {
        this.setState({
          from: 0
        }, this.loadData);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React__default.createElement(TablePresentation, {
        loading: this.state.loading,
        result: this.state.data,
        next: this.next,
        prev: this.prev,
        first: this.first,
        size: this.state.size,
        from: this.state.from
      });
    }
  }]);

  return Table;
}(React.Component);

var mapContextToProps$1 = function mapContextToProps(_ref) {
  var filter = _ref.filter,
      filterHash = _ref.filterHash,
      api = _ref.api,
      components = _ref.components;
  return {
    filter: filter,
    filterHash: filterHash,
    api: api,
    components: components
  };
};

var Table$1 = withContext$1(mapContextToProps$1)(Table);

var GalleryPresentation = function GalleryPresentation(_ref) {
  var first = _ref.first,
      prev = _ref.prev,
      next = _ref.next,
      size = _ref.size,
      from = _ref.from,
      result = _ref.result,
      loading = _ref.loading,
      error = _ref.error;
  var total = get_1(result, 'hits.total', 0);
  var hits = get_1(result, 'hits.hits');
  if (!hits) return /*#__PURE__*/React__default.createElement("div", null, "no content");
  var itemsLeft = total ? total - from : 20;
  var loaderCount = Math.min(Math.max(itemsLeft, 0), size);
  return /*#__PURE__*/React__default.createElement(Gallery, {
    caption: function caption(_ref2) {
      var item = _ref2.item;
      return /*#__PURE__*/React__default.createElement(GalleryCaption, null, item._source.gbifClassification.usage.name);
    },
    title: function title(item) {
      return item._source.gbifClassification.usage.name;
    },
    subtitle: function subtitle(item) {
      return item.description;
    },
    details: function details(item) {
      return /*#__PURE__*/React__default.createElement("pre", null, JSON.stringify(item, null, 2));
    },
    loading: loading || error,
    items: hits,
    loadMore: from + size < total ? function () {
      return next();
    } : null,
    size: loaderCount,
    imageSrc: function imageSrc(item) {
      return item._source._galleryImages[0].identifier;
    }
  });
};

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/** `Object#toString` result references. */
var objectTag$4 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$f = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$e = objectProto$f.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$4) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$e.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    stack || (stack = new _Stack);
    if (isObject_1(srcValue)) {
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge$1 = _createAssigner(function(object, source, srcIndex) {
  _baseMerge(object, source, srcIndex);
});

var merge_1 = merge$1;

function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Gallery$1 = /*#__PURE__*/function (_Component) {
  _inherits(Gallery, _Component);

  var _super = _createSuper$6(Gallery);

  function Gallery(props) {
    var _this;

    _classCallCheck(this, Gallery);

    _this = _super.call(this, props);

    _defineProperty$1(_assertThisInitialized(_this), "loadData", function () {
      _this.setState({
        loading: true,
        error: false
      });

      if (_this.runningQuery && _this.runningQuery.cancel) _this.runningQuery.cancel();
      var filter = merge_1({}, _this.props.filter, {
        must: {
          gallery_media_type: ["StillImage"] // occurrenceId: ["http://bins.boldsystems.org/index.php/Public_RecordView?processid=EPRBE064-18"],

        }
      });
      _this.runningQuery = query(filter, _this.state.size, _this.state.from);

      _this.runningQuery.then(function (response) {
        if (_this._isMount) {
          // extract first image in occurrence
          response.data.hits.hits.forEach(function (occ) {
            occ._source._galleryImages = occ._source.multimediaItems.filter(function (img) {
              return img.type === 'StillImage';
            });
          });

          if (_this.state.from > 0) {
            response.data.hits.hits = [].concat(_toConsumableArray(_this.state.data.hits.hits), _toConsumableArray(response.data.hits.hits));

            _this.setState({
              loading: false,
              error: false,
              data: response.data
            });
          } else {
            _this.setState({
              loading: false,
              error: false,
              data: response.data
            });
          }
        }
      })["catch"](function (err) {
        console.error(err); //TODO error handling

        if (_this._isMount) {
          _this.setState({
            loading: false,
            error: true
          });
        }
      });
    });

    _defineProperty$1(_assertThisInitialized(_this), "next", function () {
      _this.setState({
        from: Math.max(0, _this.state.from + _this.state.size)
      }, _this.loadData);
    });

    _defineProperty$1(_assertThisInitialized(_this), "prev", function () {
      _this.setState({
        from: Math.max(0, _this.state.from - _this.state.size)
      }, _this.loadData);
    });

    _defineProperty$1(_assertThisInitialized(_this), "first", function () {
      _this.setState({
        from: 0
      }, _this.loadData);
    });

    _this.state = {
      loading: true,
      error: false,
      size: 20,
      from: 0,
      data: {
        hits: {
          hits: []
        }
      }
    };
    return _this;
  }

  _createClass(Gallery, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMount = true;
      this.loadData();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMount = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.filterHash !== this.props.filterHash) {
        this.setState({
          from: 0,
          data: {}
        }, this.loadData);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React__default.createElement(GalleryPresentation, {
        error: this.state.error,
        loading: this.state.loading,
        result: this.state.data,
        next: this.next,
        prev: this.prev,
        first: this.first,
        size: this.state.size,
        from: this.state.from
      });
    }
  }]);

  return Gallery;
}(React.Component);

var mapContextToProps$2 = function mapContextToProps(_ref) {
  var filter = _ref.filter,
      filterHash = _ref.filterHash,
      api = _ref.api,
      components = _ref.components;
  return {
    filter: filter,
    filterHash: filterHash,
    api: api,
    components: components
  };
};

var Gallery$2 = withContext$1(mapContextToProps$2)(Gallery$1);

var PopupContent$2 = function PopupContent(_ref) {
  var hide = _ref.hide,
      DisplayName = _ref.DisplayName,
      suggestConfig = _ref.suggestConfig,
      _onApply = _ref.onApply,
      _onCancel = _ref.onCancel,
      onFilterChange = _ref.onFilterChange,
      focusRef = _ref.focusRef,
      filterName = _ref.filterName,
      initFilter = _ref.initFilter;

  var _React$useState = React__default.useState(nanoid.nanoid),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      id = _React$useState2[0];

  var initialOptions = get_1(initFilter, "must.".concat(filterName), []);

  var _useState = React.useState(initialOptions),
      _useState2 = _slicedToArray(_useState, 2),
      options = _useState2[0],
      setOptions = _useState2[1];

  return jsx(UncontrollableFilter, {
    onApply: _onApply,
    onCancel: _onCancel,
    title: jsx(reactIntl.FormattedMessage, {
      id: "filterName.".concat(filterName),
      defaultMessage: 'Loading'
    }) //this should be formated or be provided as such
    ,
    aboutText: "some help text",
    onFilterChange: onFilterChange,
    filterName: filterName,
    formId: id,
    defaultFilter: initFilter
  }, function (_ref2) {
    var filter = _ref2.filter,
        toggle = _ref2.toggle,
        checkedMap = _ref2.checkedMap,
        formId = _ref2.formId,
        summaryProps = _ref2.summaryProps,
        footerProps = _ref2.footerProps;
    return jsx(React__default.Fragment, null, jsx(Suggest, _extends({}, suggestConfig, {
      focusRef: focusRef,
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      },
      onSuggestionSelected: function onSuggestionSelected(_ref3) {
        var item = _ref3.item;
        var allOptions = union_1(options, [item.key]);
        setOptions(allOptions);
        toggle(filterName, item.key);
      }
    })), options.length > 0 && jsx(React__default.Fragment, null, jsx(SummaryBar, _extends({}, summaryProps, {
      style: {
        marginTop: 0
      }
    })), jsx(FilterBody, {
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      }
    }, jsx("form", {
      id: formId,
      onSubmit: function onSubmit(e) {
        return e.preventDefault();
      }
    }, options.map(function (key) {
      return jsx(Option, {
        key: key,
        helpVisible: true,
        label: jsx(DisplayName, {
          id: key
        }),
        checked: checkedMap.has(key),
        onChange: function onChange() {
          return toggle(filterName, key);
        }
      });
    }))), jsx(Footer, _extends({}, footerProps, {
      onApply: function onApply() {
        return _onApply({
          filter: filter,
          hide: hide
        });
      },
      onCancel: function onCancel() {
        return _onCancel({
          filter: filter,
          hide: hide
        });
      }
    }))));
  });
};

/**
 * Popover filter for fields that need an autocomplete
 * @filterName {string} name of the filter (used to map to a field filter)
 * @DisplayName {Component} component that takes an id as a prop and displays a formatted name. E.g. id=uuid and it will display a title.
 * @placement {string} to which direction should the popover show? Availabel strings defined in popper js docs
 * @modal {boolean} should the popover show as a modal or as the next element
 * @suggestConfig {object} Configuration for how the suggest input box should work. Used by suggest wrapper that use the Autocomplete
 */
function SuggestFilterPopover(_ref4) {
  var filterName = _ref4.filterName,
      DisplayName = _ref4.DisplayName,
      placement = _ref4.placement,
      modal = _ref4.modal,
      suggestConfig = _ref4.suggestConfig,
      children = _ref4.children;
  var currentFilterContext = React.useContext(FilterContext);

  var _useState3 = React.useState(currentFilterContext.filter),
      _useState4 = _slicedToArray(_useState3, 2),
      tmpFilter = _useState4[0],
      setFilter = _useState4[1];

  React.useEffect(function () {
    setFilter(currentFilterContext.filter);
  }, [currentFilterContext.filter]);
  var onApply = React.useCallback(function (_ref5) {
    var filter = _ref5.filter,
        hide = _ref5.hide;
    currentFilterContext.setFilter(filter);
    hide();
  }, [currentFilterContext]);
  var onCancel = React.useCallback(function (_ref6) {
    var hide = _ref6.hide;
    hide();
  }, []);
  var onFilterChange = React.useCallback(function (filter) {
    setFilter(filter);
  }, []);
  return jsx(Popover, {
    onClickOutside: function onClickOutside(popover) {
      currentFilterContext.setFilter(tmpFilter);
      popover.hide();
    },
    style: {
      width: '22em',
      maxWidth: '100%'
    },
    "aria-label": "Filter on scientific name" //todo, this should either point to a tag or be dynamic
    ,
    placement: placement,
    trigger: children,
    modal: modal
  }, function (_ref7) {
    var hide = _ref7.hide,
        focusRef = _ref7.focusRef;
    return jsx(PopupContent$2, {
      filterName: filterName,
      hide: hide,
      DisplayName: DisplayName,
      suggestConfig: suggestConfig,
      onApply: onApply,
      onCancel: onCancel,
      onFilterChange: onFilterChange,
      initFilter: currentFilterContext.filter,
      focusRef: focusRef
    });
  });
}

/**
 * Popover filter for fields that need an autocomplete
 * @filterName {string} name of the filter (used to map to a field filter)
 * @DisplayName {Component} component that takes an id as a prop and displays a formatted name. E.g. id=uuid and it will display a title.
 * @displayValueAs {string} component that takes an id as a prop and displays a formatted name. E.g. id=uuid and it will display a title.
 * @placement {string} to which direction should the popover show? Availabel strings defined in popper js docs
 * @modal {boolean} should the popover show as a modal or as the next element
 * @suggestConfig {object} Configuration for how the suggest input box should work. Used by suggest wrapper that use the Autocomplete
 */
function SuggestFilterButton(_ref8) {
  var filterName = _ref8.filterName,
      DisplayName = _ref8.DisplayName,
      displayValueAs = _ref8.displayValueAs,
      suggestConfig = _ref8.suggestConfig,
      props = _objectWithoutProperties(_ref8, ["filterName", "DisplayName", "displayValueAs", "suggestConfig"]);

  var currentFilterContext = React.useContext(FilterContext);
  return jsx(SuggestFilterPopover, {
    filterName: filterName,
    DisplayName: DisplayName,
    suggestConfig: suggestConfig,
    modal: true
  }, jsx(TriggerButton, _extends({}, props, {
    filterName: filterName,
    displayValueAs: displayValueAs,
    options: get_1(currentFilterContext.filter, "must.".concat(filterName), [])
  })));
}

var ScientificName$1 = displayValue('scientificName').component;
var DatasetTitle = displayValue('datasetTitle').component;

var _ref$h =  {
  name: "bnzwiv",
  styles: "margin-right:4px;margin-bottom:4px;"
} ;

var _ref2$7 =  {
  name: "bnzwiv",
  styles: "margin-right:4px;margin-bottom:4px;"
} ;

var _ref3$8 =  {
  name: "bnzwiv",
  styles: "margin-right:4px;margin-bottom:4px;"
} ;

var _ref4$6 =  {
  name: "bnzwiv",
  styles: "margin-right:4px;margin-bottom:4px;"
} ;

var FilterBar = function FilterBar(_ref6) {
  var _ref6$className = _ref6.className,
      className = _ref6$className === void 0 ? '' : _ref6$className,
      stateApi = _ref6.stateApi,
      filter = _ref6.filter,
      props = _objectWithoutProperties(_ref6, ["className", "stateApi", "filter"]);

  var theme = React.useContext(ThemeContext$1);
  var prefix = theme.prefix || 'gbif';
  var elementName = 'filterBar';
  return jsx("div", _extends({
    className: "".concat(className, " ").concat(prefix, "-").concat(elementName),
    css: /*#__PURE__*/css(style(),  "" )
  }, props), jsx("div", null, jsx(TaxonFilter, {
    css: _ref$h
  })), jsx("div", null, jsx(SuggestFilterButton, {
    DisplayName: DatasetTitle,
    filterName: "datasetKey",
    displayValueAs: "datasetTitle",
    suggestConfig: suggestConfigs.datasetTitle,
    css: _ref2$7
  })), jsx("div", null, jsx(VocabularyFilter, {
    css: _ref3$8
  })), jsx("div", null, jsx(VocabularyFilter, {
    vocabularyName: "Country",
    css: _ref4$6
  })));
};

var _ref5$6 =  {
  name: "p58oka",
  styles: "display:flex;flex-direction:row;flex-wrap:wrap;"
} ;

var style = function style(theme) {
  return _ref5$6;
};

var mapContextToProps$3 = function mapContextToProps(_ref7) {
  var filter = _ref7.filter,
      stateApi = _ref7.stateApi;
  return {
    filter: filter,
    stateApi: stateApi
  };
};

var FilterBar$1 = withContext(mapContextToProps$3)(FilterBar);

var TabList$2 = Tabs.TabList,
    Tab$2 = Tabs.Tab,
    TabPanel$2 = Tabs.TabPanel;

var Layout = function Layout(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      props = _objectWithoutProperties(_ref, ["className"]);

  var _useState = React.useState('table'),
      _useState2 = _slicedToArray(_useState, 2),
      activeView = _useState2[0],
      setActiveView = _useState2[1];

  var theme = React.useContext(ThemeContext$1);
  var prefix = theme.prefix || 'gbif';
  var elementName = 'occurrenceSearchLayout';
  return jsx("div", _extends({
    className: "".concat(className, " ").concat(prefix, "-").concat(elementName),
    css: cssLayout({
      theme: theme
    })
  }, props), jsx(Tabs, {
    activeId: activeView,
    onChange: setActiveView
  }, jsx("div", {
    css: cssNavBar({
      theme: theme
    })
  }, jsx("div", {
    css: cssFilter({
      theme: theme
    })
  }, jsx(FilterBar$1, null)), jsx("div", {
    css: cssViews({
      theme: theme
    })
  }, jsx(TabList$2, {
    "aria-labelledby": "My tabs"
  }, jsx(Tab$2, {
    tabId: "table"
  }, "Table"), jsx(Tab$2, {
    tabId: "map"
  }, "Map"), jsx(Tab$2, {
    tabId: "gallery"
  }, "Gallery")))), jsx(TabPanel$2, {
    lazy: true,
    tabId: "table",
    className: "".concat(prefix, "-").concat(elementName, "-views"),
    css: cssViewArea({
      theme: theme
    })
  }, jsx(Table$1, null)), jsx(TabPanel$2, {
    lazy: true,
    tabId: "map",
    className: "".concat(prefix, "-").concat(elementName, "-views"),
    css: cssViewArea({
      theme: theme
    })
  }, jsx(Map$3, null)), jsx(TabPanel$2, {
    lazy: true,
    tabId: "gallery",
    className: "".concat(prefix, "-").concat(elementName, "-views"),
    css: cssViewArea({
      theme: theme
    })
  }, jsx(Gallery$2, null)), jsx("div", {
    className: "".concat(prefix, "-").concat(elementName, "-footer"),
    css: cssFooter({
      theme: theme
    })
  }, jsx("div", null, "Footer content"))));
};

var mapContextToProps$4 = function mapContextToProps(_ref2) {
  var test = _ref2.test;
  return {
    test: test
  };
};

var Layout$1 = withContext(mapContextToProps$4)(Layout);

function OccurrenceSearch(props) {
  var _useState = React.useState({
    must: {
      taxonKey: [2292251]
    }
  }),
      _useState2 = _slicedToArray(_useState, 2),
      filter = _useState2[0],
      setFilter = _useState2[1]; // const esQuery = compose(filter).build();


  return jsx(Root, null, jsx(UncontrollableFilterState, {
    filter: filter,
    onChange: setFilter
  }, jsx(Layout$1, props)));
} // OccurrenceSearch.propTypes = {

var en = {
  first: 'First',
  previous: 'Previous',
  next: 'Next',
  options: 'Options',
  'pagination.pageXofY': 'Page {current} of {total}',
  'filterName.taxonKey': 'Scientific name',
  'filterCount.taxonKey': '{num, plural, one {Scientific name} other {# scientific names}}',
  'filterName.datasetKey': 'Dataset',
  'filterCount.datasetKey': '{num, plural, one {Dataset} other {# datasets}}'
};

var darkVariables = {
  dense: true,
  colors: {
    primary: '#39af5d'
  },
  fontSize: '14px',
  background: '#0b0c1b',
  paperBackground: '#22263b',
  color: '#f2f4f8',
  fontFamily: 'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif'
};

var a11yVariables = {
  colors: {
    primary: '#333333'
  },
  fontSize: '16px',
  background: '#eeeeee',
  paperBackground: '#ffffff',
  color: '#000000',
  fontFamily: 'BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif'
};

var darkTheme = themeBuilder(darkVariables);
var lightTheme = themeBuilder(lightVariables);
var a11yTheme = themeBuilder(a11yVariables);

function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var Standalone = /*#__PURE__*/function (_React$Component) {
  _inherits(Standalone, _React$Component);

  var _super = _createSuper$7(Standalone);

  function Standalone() {
    _classCallCheck(this, Standalone);

    return _super.apply(this, arguments);
  }

  _createClass(Standalone, [{
    key: "render",
    value: function render() {
      var style = this.props.style;
      return /*#__PURE__*/React__default.createElement(reactIntl.IntlProvider, {
        locale: "en",
        messages: en
      }, /*#__PURE__*/React__default.createElement(ThemeContext$1.Provider, {
        value: lightTheme
      }, /*#__PURE__*/React__default.createElement(OccurrenceSearch, {
        style: style
      })));
    }
  }]);

  return Standalone;
}(React__default.Component);

exports.Button = Button;
exports.OccurrenceSearch = Standalone;
exports.Root = Root;
