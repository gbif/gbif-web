'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _objectWithoutProperties = _interopDefault(require('@babel/runtime/helpers/objectWithoutProperties'));
var core = require('@emotion/core');
var React = require('react');
var React__default = _interopDefault(React);
require('prop-types');
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var reactIntl = require('react-intl');
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var Button$1 = require('reakit/Button');
var _taggedTemplateLiteral = _interopDefault(require('@babel/runtime/helpers/taggedTemplateLiteral'));
var md = require('react-icons/md');
var Popover$1 = require('reakit/Popover');
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var Downshift = _interopDefault(require('downshift'));
var useDebounce = require('use-debounce');
var camelCase = _interopDefault(require('lodash/camelCase'));
var uncontrollable = require('uncontrollable');
var Menu$1 = require('reakit/Menu');
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var Dialog = require('reakit/Dialog');
var mapboxgl = _interopDefault(require('mapbox-gl'));
var bodybuilder = _interopDefault(require('bodybuilder'));
var _typeof = _interopDefault(require('@babel/runtime/helpers/typeof'));
var snakeCase = _interopDefault(require('lodash/snakeCase'));
var axios$1 = _interopDefault(require('axios'));
var get$1 = _interopDefault(require('lodash/get'));
var startCase = _interopDefault(require('lodash/startCase'));
var isUndefined = _interopDefault(require('lodash/isUndefined'));
var nanoid = _interopDefault(require('nanoid'));
var union = _interopDefault(require('lodash/union'));
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));
var cloneDeep = _interopDefault(require('lodash/cloneDeep'));
var uniqWith = _interopDefault(require('lodash/uniqWith'));
var isEqual = _interopDefault(require('react-fast-compare'));
var hash = _interopDefault(require('object-hash'));
var keyBy = _interopDefault(require('lodash/keyBy'));
var merge = _interopDefault(require('lodash/merge'));

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

var ThemeContext = React__default.createContext(theme);

var root = function root(_ref) {
  var theme = _ref.theme;
  return (
    /*#__PURE__*/
    core.css("font-family:BlinkMacSystemFont,-apple-system,\"Segoe UI\",\"Roboto\",\"Oxygen\",\"Ubuntu\",\"Cantarell\",\"Fira Sans\",\"Droid Sans\",\"Helvetica Neue\",\"Helvetica\",\"Arial\",sans-serif;color:", theme.color || '#4a4a4a', ";font-size:", theme.fontSize || '1em', ";font-weight:400;box-sizing:border-box;-webkit-tap-highlight-color:rgba(0,0,0,0);*,*::before,*::after,strong{box-sizing:inherit;}" + ( "" ))
  );
};
var styles = {
  root: root
};

var Root = React__default.forwardRef(function (_ref, ref) {
  var _ref$as = _ref.as,
      Rt = _ref$as === void 0 ? 'div' : _ref$as,
      props = _objectWithoutProperties(_ref, ["as"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx(Rt, _extends({
    ref: ref
  }, props, {
    css: styles.root({
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
      return React__default.createElement(AppContext.Consumer, null, function (context) {
        return React__default.createElement(WrappedComponent, _extends({}, injectedProps(context), props));
      });
    };

    return Wrapper;
  };
};

var _ref =  {
  name: "r443qr",
  styles: "background:white;border:1px solid #ddd;flex:0 0 auto;margin:10px;border-radius:4px;"
} ;

var cssNavBar = function cssNavBar(_ref7) {
  var theme = _ref7.theme,
      isActive = _ref7.isActive;
  return _ref;
};

var _ref2 =  {
  name: "l6930n",
  styles: "flex:1 1 auto;margin:10px;margin-top:0;"
} ;

var cssViewArea = function cssViewArea(_ref8) {
  var theme = _ref8.theme;
  return _ref2;
};

var _ref3 =  {
  name: "120rpdz",
  styles: "display:flex;flex-direction:column;height:100%;overflow:auto;"
} ;

var cssLayout = function cssLayout(_ref9) {
  var theme = _ref9.theme;
  return _ref3;
};

var _ref4 =  {
  name: "1igwztr",
  styles: "flex:0 0 auto;&>div{border-top:1px solid #2a2a38;padding:5px 12px;color:white;font-size:0.85em;font-weight:700;}"
} ;

var cssFooter = function cssFooter(_ref10) {
  var theme = _ref10.theme;
  return _ref4;
};

var _ref5 =  {
  name: "1tottmn",
  styles: "padding:10px;border-bottom:1px solid #eee;"
} ;

var cssFilter = function cssFilter(_ref11) {
  var theme = _ref11.theme;
  return _ref5;
};

var _ref6 =  {
  name: "a5qkfk",
  styles: "margin:0 10px;"
} ;

var cssViews = function cssViews(_ref12) {
  var theme = _ref12.theme;
  return _ref6;
};

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
  return (
    /*#__PURE__*/
    core.css(helper.noUserSelect, " appearance:none;max-width:100%;display:inline-flex;align-items:center;justify-content:flex-start;text-align:center;border:1px solid transparent;border-radius:4px;box-shadow:none;font-size:1em;padding-top:0.5em;padding-bottom:0.5em;line-height:calc(1.5em - 6px);position:relative;margin:0;background-color:white;color:", theme.color, ";cursor:pointer;justify-content:center;padding-left:", theme.dense ? 0.5 : 1, "em;padding-right:", theme.dense ? 0.5 : 1, "em;&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}&[aria-disabled=\"true\"]{opacity:0.5;cursor:auto;}::-moz-focus-inner{border-style:none;}" + ( "" ))
  );
};

var _ref$1 =  {
  name: "9hyy7o",
  styles: "padding:0;border:none;height:auto;color:inherit;line-height:inherit;font-weight:inherit;background:none;border-radius:0;"
} ;

var text = function text(theme) {
  return _ref$1;
};
var primary = function primary(theme) {
  return (
    /*#__PURE__*/
    core.css("background-color:", theme.colors.primary500, ";color:white;&:not([aria-disabled=\"true\"]){&:hover{color:white;border-color:", theme.colors.primary500, ";background-color:", theme.colors.primary600, ";}&:active,&[aria-expanded=\"true\"]{color:white;border-color:", theme.colors.primary600, ";background-color:", theme.colors.primary700, ";}}" + ( "" ))
  );
};
var primaryOutline = function primaryOutline(theme) {
  return (
    /*#__PURE__*/
    core.css("border-color:", theme.colors.primary500, ";background:none;color:", theme.colors.primary700, ";" + ( "" ))
  );
};
var outline = function outline(theme) {
  return (
    /*#__PURE__*/
    core.css("border-color:", theme.transparentInk40, ";background:none;" + ( "" ))
  );
};

var _ref2$1 =  {
  name: "p8cinn",
  styles: "border-color:#808080;color:#808080;background:none;"
} ;

var ghost = function ghost(theme) {
  return _ref2$1;
};

var _ref3$1 =  {
  name: "c15mrh",
  styles: "background:tomato;color:white;"
} ;

var danger = function danger(theme) {
  return _ref3$1;
};

var _ref4$1 =  {
  name: "ug4k3t",
  styles: "border-color:transparent;background:none;"
} ;

var link = function link(theme) {
  return _ref4$1;
};

var _ref5$1 =  {
  name: "hboir5",
  styles: "display:flex;width:100%;"
} ;

var block = function block(theme) {
  return _ref5$1;
};
var spinAround = core.keyframes(_templateObject());
var loading = function loading(theme) {
  return (
    /*#__PURE__*/
    core.css("&:after{animation:", spinAround, " 500ms infinite linear;border:2px solid #dbdbdb;border-radius:0.5em;border-right-color:transparent;border-top-color:transparent;content:\"\";display:block;height:1em;width:1em;left:calc(50% - (1em / 2));top:calc(50% - (1em / 2));position:absolute !important;}color:transparent !important;pointer-events:none;" + ( "" ))
  );
};

var _ref6$1 =  {
  name: "1pxi8ql",
  styles: "display:flex;width:fit-content;> button{border-radius:0;margin:0;}>button:first-of-type:not(:last-of-type){border-right-color:rgba(255,255,255,.2);}>button:first-of-type{border-top-left-radius:4px;border-bottom-left-radius:4px;flex:1 1 auto;}>button:last-of-type{border-top-right-radius:4px;border-bottom-right-radius:4px;}"
} ;

var group = function group(theme) {
  return _ref6$1;
};
var styles$1 = {
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
  var theme = React.useContext(ThemeContext); // const appliedTheme = isEmpty(theme) ? standardTheme : theme;

  var appliedTheme = theme;

  var _getClasses = getClasses(appliedTheme, 'button', classes),
      classesToApply = _getClasses.classesToApply,
      humanClasses = _getClasses.humanClasses;

  return core.jsx(Button$1.Button, _extends({
    ref: ref,
    className: "".concat(humanClasses, " ").concat(className),
    css:
    /*#__PURE__*/
    core.css(styles$1.button(appliedTheme), " ", classesToApply.map(function (x) {
      return styles$1[x](appliedTheme);
    }), ";" + ( "" ))
  }, props), core.jsx("span", {
    style: truncate ? truncateStyle : {}
  }, children));
});
Button.displayName = 'Button';
var ButtonGroup = function ButtonGroup(_ref2) {
  var props = _extends({}, _ref2);

  var theme = React.useContext(ThemeContext);
  return core.jsx("div", _extends({
    css: styles$1.group({
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
    return core.jsx(ButtonGroup, props, core.jsx(Button, {
      ref: ref,
      loading: loading,
      appearance: "primaryOutline",
      onClick: onClick
    }, children));
  }

  return core.jsx(ButtonGroup, props, core.jsx(Button, {
    appearance: "primary",
    ref: ref,
    onClick: onClick,
    loading: loading
  }, children), core.jsx(Button, {
    appearance: "primary",
    onClick: onClearRequest
  }, core.jsx(md.MdClose, null)));
});

var _ref$2 =  {
  name: "1iy96jj",
  styles: "border:none;background:none;outline:none;font-size:inherit;color:inherit;font-weight:inherit;cursor:pointer;&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}"
} ;

var TextButton = React__default.forwardRef(function (_ref2, ref) {
  var props = _extends({}, _ref2);

  var theme = React.useContext(ThemeContext);
  return core.jsx("button", _extends({}, props, {
    css: _ref$2,
    ref: ref
  }));
});
TextButton.displayName = 'TextButton';

var Switch = React__default.forwardRef(function (_ref2, ref) {
  var _ref2$as = _ref2.as,
      Span = _ref2$as === void 0 ? 'span' : _ref2$as,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? '' : _ref2$className,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? {} : _ref2$style,
      props = _objectWithoutProperties(_ref2, ["as", "className", "style"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx(Span, {
    style: style,
    className: className,
    css: switchClass()
  }, core.jsx("input", _extends({
    type: "checkbox",
    ref: ref
  }, props)), core.jsx("span", null));
});
Switch.displayName = 'Switch';

var _ref$3 =  {
  name: "c8cez2",
  styles: "position:relative;top:-0.09em;display:inline-block;line-height:1;white-space:nowrap;vertical-align:middle;outline:none;cursor:pointer;& input{margin:0;position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;width:100%;height:100%;cursor:pointer;opacity:0;}& input + span{position:relative;top:0;left:0;display:block;width:2em;height:1em;background-color:#d4d5e3;transition:.1s;border-radius:34px;&:before{position:absolute;content:\"\";height:calc(1em - 4px);width:calc(1em - 4px);left:2px;bottom:2px;background-color:white;transition:.1s;border-radius:50%;}}& input:checked + span{background-color:#2196F3;}& input:focus + span{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}& input:checked + span:before{transform:translateX(1em);}"
} ;

var switchClass = function switchClass(theme) {
  return _ref$3;
};

var Checkbox = React__default.forwardRef(function (_ref2, ref) {
  var _ref2$as = _ref2.as,
      Span = _ref2$as === void 0 ? 'span' : _ref2$as,
      _ref2$className = _ref2.className,
      className = _ref2$className === void 0 ? '' : _ref2$className,
      _ref2$style = _ref2.style,
      style = _ref2$style === void 0 ? {} : _ref2$style,
      props = _objectWithoutProperties(_ref2, ["as", "className", "style"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx(Span, {
    style: style,
    className: className,
    css: checkbox()
  }, core.jsx("input", _extends({
    type: "checkbox",
    ref: ref
  }, props)), core.jsx("span", null));
});
Checkbox.displayName = 'Checkbox';

var _ref$4 =  {
  name: "1y703ms",
  styles: "position:relative;top:-0.09em;display:inline-block;line-height:1;white-space:nowrap;vertical-align:middle;outline:none;cursor:pointer;input{margin:0;position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;width:100%;height:100%;cursor:pointer;opacity:0;}& input + span{position:relative;top:0;left:0;display:block;width:1em;height:1em;background-color:#fff;border:1px solid #d9d9d9;border-radius:2px;border-collapse:separate;transition:all 0.1s;&:after{position:absolute;top:50%;left:22%;display:table;width:5.71428571px;height:9.14285714px;border:2px solid #fff;border-top:0;border-left:0;transform:rotate(45deg) scale(0) translate(-50%,-50%);opacity:0;transition:all 0.1s cubic-bezier(0.71,-0.46,0.88,0.6),opacity 0.1s;content:' ';}}& input:checked + span{background-color:#1890ff;border-color:#1890ff;&:after{position:absolute;display:table;border:2px solid #fff;border-top:0;border-left:0;transform:rotate(45deg) scale(1) translate(-50%,-50%);opacity:1;transition:all 0.1s cubic-bezier(0.12,0.4,0.29,1.46) 0.1s;content:' ';}}& input:focus + span{box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}"
} ;

var checkbox = function checkbox(props) {
  return _ref$4;
};

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n  from {\n    background-color: #eee;\n  }\n  50% {\n    background-color: #eee;\n  }\n  75% {\n    background-color: #dfdfdf;\n  }\n  to {\n    background-color: #eee;\n  }\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}

var _ref$5 =  {
  name: "1s6237y",
  styles: "&::placeholder{color:#bbb;}"
} ;

var placeholder = function placeholder(props) {
  return _ref$5;
};

var _ref2$2 =  {
  name: "vviroy",
  styles: "&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}::-moz-focus-inner{border-style:none;}"
} ;

var focusStyle = function focusStyle(props) {
  return _ref2$2;
};

var _ref3$2 =  {
  name: "175bdre",
  styles: "scrollbar-width:thin;&::-webkit-scrollbar{width:6px;height:6px;}&::-webkit-scrollbar-thumb{background-color:#686868;}"
} ;

var styledScrollBars = function styledScrollBars(props) {
  return _ref3$2;
};

var _ref4$2 =  {
  name: "qta685",
  styles: "&:hover{position:relative;&[tip]:before{border-radius:2px;background-color:#585858;color:#fff;content:attr(tip);font-size:12px;padding:5px 7px;position:absolute;white-space:nowrap;z-index:25;line-height:1.2em;pointer-events:none;}&[direction=\"right\"]:before{top:50%;left:120%;transform:translateY(-50%);}&[direction=\"left\"]:before{top:50%;right:120%;transform:translateY(-50%);}&[direction=\"top\"]:before{right:50%;bottom:120%;transform:translateX(50%);}&[direction=\"bottom\"]:before{right:50%;top:120%;transform:translateX(50%);}}"
} ;

var tooltip = function tooltip(props) {
  return _ref4$2;
};
var skeletonLoading = core.keyframes(_templateObject$1());

var input = function input(props) {
  return (
    /*#__PURE__*/
    core.css("-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0;font-variant:tabular-nums;list-style:none;font-feature-settings:'tnum';position:relative;display:inline-block;width:100%;height:32px;padding:4px 11px;color:rgba(0,0,0,0.65);font-size:inherit;line-height:1.5;background-color:#fff;background-image:none;border:1px solid #d9d9d9;border-radius:4px;transition:all 0.3s;", focusStyle(), ";", placeholder(), ";" + ( "" ))
  );
};
var styles$2 = {
  input: input
};

var Input = React__default.forwardRef(function (_ref, ref) {
  var props = _extends({}, _ref);

  var theme = React.useContext(ThemeContext);
  return core.jsx("input", _extends({
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

  var theme = React.useContext(ThemeContext);
  var popover = Popover$1.usePopoverState({
    modal: modal || false,
    placement: placement || "bottom-start",
    visible: visible
  });
  var ref = React__default.useRef();
  React__default.useEffect(function () {
    if (popover.visible) {
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [popover.visible]);
  return core.jsx(React__default.Fragment, null, core.jsx(Popover$1.PopoverDisclosure, _extends({}, popover, trigger.props), function (disclosureProps) {
    return React__default.cloneElement(trigger, disclosureProps);
  }), core.jsx(Popover$1.PopoverBackdrop, _extends({}, popover, {
    css: backdrop(),
    onClick: function onClick() {
      return onClickOutside ? onClickOutside(popover) : undefined;
    }
  })), core.jsx(Popover$1.Popover, _extends({}, popover, props, {
    hideOnClickOutside: false,
    hideOnEsc: true
  }), function (props) {
    return popover.visible && core.jsx(Root, _extends({}, props, {
      css: dialog()
    }), core.jsx(Popover$1.PopoverArrow, _extends({
      className: "arrow"
    }, popover)), core.jsx("div", {
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

var _ref$6 =  {
  name: "1vv48t9",
  styles: "background-color:rgba(0,0,0,0.15);position:fixed;top:0px;right:0px;bottom:0px;left:0px;z-index:999;"
} ;

var backdrop = function backdrop(theme) {
  return _ref$6;
};

var _ref2$3 =  {
  name: "104377r",
  styles: "max-height:calc(100vh - 100px);"
} ;

var dialogContent = function dialogContent(theme) {
  return _ref2$3;
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
var loading$1 = core.keyframes(_templateObject$2());

var _ref$7 =  {
  name: "1x19brq",
  styles: "background-color:tomato;left:0;animation:none;width:100%;"
} ;

var errorStyle = function errorStyle(theme) {
  return _ref$7;
};

var before = function before(_ref2) {
  var error = _ref2.error,
      theme = _ref2.theme;
  return (
    /*#__PURE__*/
    core.css("display:block;position:absolute;content:'';left:-200px;width:200px;height:1px;background-color:", theme.colors.primary, ";animation:", loading$1, " 1.5s linear infinite;", error ? errorStyle() : null,  "" )
  );
};

var StripeLoader = function StripeLoader(_ref3) {
  var active = _ref3.active,
      error = _ref3.error,
      props = _objectWithoutProperties(_ref3, ["active", "error"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx("div", {
    css:
    /*#__PURE__*/
    core.css("height:1px;width:100%;position:relative;overflow:hidden;&:before{", active ? before({
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
  return (
    /*#__PURE__*/
    core.css("display:inline-block;margin:0;padding:0;color:rgba(0,0,0,0.65);font-variant:tabular-nums;line-height:1.5;list-style:none;box-sizing:border-box;font-size:14px;font-variant:initial;background-color:#fff;border-radius:4px;outline:none;box-shadow:0 2px 8px rgba(0,0,0,0.15);width:100%;position:absolute;transform:translateY(", props.isOpen ? 5 : 0, "px);opacity:", props.isOpen ? 1 : 0, ";transition:opacity .1s linear,transform .1s ease-in-out;" + ( "" ))
  );
};

var _ref$8 =  {
  name: "wmu2a9",
  styles: "position:relative;display:block;padding:5px 12px;overflow:hidden;color:rgba(0,0,0,0.65);font-weight:normal;font-size:14px;line-height:22px;cursor:pointer;transition:background 0.3s ease;"
} ;

var item = function item(props) {
  return _ref$8;
};
var menu = function menu(props) {
  return (
    /*#__PURE__*/
    core.css("max-height:450px;margin:0;padding:4px 0;padding-left:0;overflow:auto;list-style:none;outline:none;", styledScrollBars(),  "" )
  );
};
var styles$3 = {
  wrapper: wrapper,
  menu: menu,
  item: item
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

  var theme = React.useContext(ThemeContext);

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
  return core.jsx(Downshift, {
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
    return core.jsx("div", {
      style: _objectSpread({
        position: 'relative',
        display: 'inline-block'
      }, style)
    }, core.jsx("div", getRootProps({}, {
      suppressRefError: true
    }), core.jsx(Input, getInputProps(_objectSpread({
      ref: ref
    }, inputProps, {
      onChange: function onChange(event) {
        return inputProps.onChange(event, {
          newValue: event.target.value
        });
      }
    })))), core.jsx("div", {
      css: styles$3.wrapper({
        theme: theme,
        isOpen: isOpen
      })
    }, core.jsx(StripeLoader, {
      active: isLoading,
      error: loadingError
    }), isOpen && inputProps.value.length > 0 && core.jsx("ul", _extends({}, getMenuProps(), {
      css: styles$3.menu({
        theme: theme
      })
    }), !isLoading && !hasSuggestions && core.jsx("li", {
      css: styles$3.item({
        theme: theme
      }),
      style: {
        color: '#aaa'
      }
    }, "No suggestions provided"), hasSuggestions && suggestions.map(function (item, index) {
      return (// eslint-disable-next-line react/jsx-key
        core.jsx("li", _extends({
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
  }, _defineProperty(_ref2, camelCase("border-".concat(dir)), "".concat(width, "px solid ").concat(isActive ? color : 'transparent')), _defineProperty(_ref2, camelCase("border-".concat(opposite[dir])), "".concat(width, "px solid transparent")), _ref2;
};

var tab = function tab(_ref3) {
  var theme = _ref3.theme,
      _ref3$direction = _ref3.direction,
      direction = _ref3$direction === void 0 ? 'bottom' : _ref3$direction,
      isActive = _ref3.isActive;
  return (
    /*#__PURE__*/
    core.css(border(3, theme.colors.primary500, direction, isActive), " display:", direction === 'left' || direction === 'right' ? 'block' : 'inline-block', ";padding:10px 10px;cursor:pointer;&:hover,&:focus{outline:none;background:rgba(0,0,0,.05);}::-moz-focus-inner{border-style:none;}" + ( "" ))
  );
};

var _ref$9 =  {
  name: "17mrx6g",
  styles: "padding:0;margin:0;list-style:none;"
} ;

var tabList = function tabList(_ref4) {
  var theme = _ref4.theme;
  return _ref$9;
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

  return core.jsx(TabsContext.Provider, _extends({
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

  var theme = React.useContext(ThemeContext);
  return core.jsx("ul", _extends({
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

  var theme = React.useContext(ThemeContext);
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
  return core.jsx("li", _extends({
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
  return core.jsx("div", _extends({
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
  return (
    /*#__PURE__*/
    core.css("display:flex;flex-direction:", props.direction || null, ";flex-wrap:", props.wrap ? props.wrap : 'wrap', ";align-items:", props.alignItems ? props.alignItems : null, ";margin:", props.halfGutter ? -props.halfGutter + 'px' : null, ";>*{padding:", props.halfGutter ? props.halfGutter + 'px' : null, ";}" + ( "" ))
  );
};

var asFlexValue = function asFlexValue() {
  var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return bool ? 1 : 0;
};

var getFlexSize = function getFlexSize(size, breakpoint) {
  return (
    /*#__PURE__*/
    core.css("@media (min-width:", breakpoint, "px){flex-basis:", size ? size * 100 / 24 + '%' : null, ";}" + ( "" ))
  );
};

var col = function col(_ref) {
  var shrink = _ref.shrink,
      grow = _ref.grow,
      basis = _ref.basis,
      xs = _ref.xs,
      props = _objectWithoutProperties(_ref, ["shrink", "grow", "basis", "xs"]);

  return (
    /*#__PURE__*/
    core.css("flex-grow:", asFlexValue(grow), ";flex-shrink:", asFlexValue(shrink), ";flex-basis:", basis ? typeof basis === 'number' ? basis + '%' : basis : 'auto', ";flex-basis:", xs ? xs * 100 / 24 + '%' : null, ";justify-content:", props.justifyContent ? props.justifyContent : null, ";", getFlexSize(props.sm, 600), ";", getFlexSize(props.md, 700), ";", getFlexSize(props.lg, 800), ";", getFlexSize(props.xl, 1000), ";" + ( "" ))
  );
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

    return core.jsx(As, _extends({
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

  var theme = React.useContext(ThemeContext);
  var menu = Menu$1.useMenuState({
    placement: placement || 'bottom-end'
  });
  return core.jsx(React__default.Fragment, null, core.jsx(Menu$1.MenuButton, _extends({}, menu, trigger.props), function (disclosureProps) {
    return React__default.cloneElement(trigger, disclosureProps);
  }), core.jsx(Menu$1.Menu, _extends({}, menu, props, {
    css: focus(),
    style: {
      zIndex: 999
    }
  }), core.jsx("div", {
    css: menuContainer()
  }, (typeof items === 'function' ? items(menu) : items).map(function (item, i) {
    return core.jsx(Menu$1.MenuItem, _extends({}, menu, item.props, {
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

  var theme = React.useContext(ThemeContext);
  return core.jsx("label", {
    className: className,
    css: menuOption(),
    ref: ref,
    style: style
  }, core.jsx("div", null, children), core.jsx("div", null, core.jsx(Switch, _extends({
    className: "gb-menuOption-inner-switch",
    onChange: onChange ? onChange : null
  }, props))));
});
var MenuAction = React__default.forwardRef(function (_ref6, ref) {
  var children = _ref6.children,
      props = _objectWithoutProperties(_ref6, ["children"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx("button", _extends({
    ref: ref,
    css: menuAction()
  }, props), core.jsx("span", null, children));
});

var _ref$a =  {
  name: "13t5ujs",
  styles: "&:focus{outline:none;box-shadow:0 0 0 0.125em rgba(50,115,220,0.25);}"
} ;

var focus = function focus(theme) {
  return _ref$a;
};

var _ref2$4 =  {
  name: "sn2w0s",
  styles: "padding:8px 8px;display:block;display:flex;width:100%;justify-content:space-between;overflow:hidden;font-size:13px;&>*{margin:0 8px;}&:focus,:focus-within{outline:none;background:#f5f5f5;}"
} ;

var menuOption = function menuOption(theme) {
  return _ref2$4;
};

var menuAction = function menuAction(theme) {
  return (
    /*#__PURE__*/
    core.css(menuOption(), ";background:none;border:none;background:none;outline:none;" + ( "" ))
  );
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
  return (
    /*#__PURE__*/
    core.css("width:", width, ";display:inline-block;height:1em;animation:", skeletonLoading, " 3s linear infinite;" + ( "" ))
  );
};
var styles$5 = {
  skeleton: skeleton
};

var Skeleton = function Skeleton(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? '100%' : _ref$width,
      props = _objectWithoutProperties(_ref, ["width"]);

  var theme = React.useContext(ThemeContext);
  var w;

  if (width === 'random') {
    w = "".concat(Math.floor(Math.random() * 50 + 50), "%");
  } else if (typeof w === 'number') {
    w = "".concat(Math.floor(Math.random() * 50 + 50), "px");
  } else {
    w = width;
  }

  return core.jsx("div", _extends({
    css: styles$5.skeleton({
      theme: theme,
      width: w
    })
  }, props));
};
Skeleton.displayName = 'Skeleton';

var borderRadius = '5px';

var _ref$b =  {
  name: "oitovc",
  styles: "border:1px solid #e5ebed;height:100%;"
} ;

var wrapper$1 = function wrapper(props) {
  return _ref$b;
};

var _ref2$5 =  {
  name: "14yhzas",
  styles: "width:100%;height:calc(100% - 50px);overflow:auto;position:relative;background:white;"
} ;

var occurrenceTable = function occurrenceTable(props) {
  return _ref2$5;
};
var footer = function footer(props) {
  return (
    /*#__PURE__*/
    core.css("height:50px;display:flex;flex-direction:row;padding:0 10px;background:#f7f9fa;border-radius:0 0 ", borderRadius, " ", borderRadius, ";" + ( "" ))
  );
};

var _ref3$5 =  {
  name: "1wkk93f",
  styles: "flex:0 0 auto;padding:0 10px;height:30px;line-height:30px;margin-top:10px;width:30px;padding:0;text-align:center;border:1px solid transparent;"
} ;

var footerItemBase = function footerItemBase(props) {
  return _ref3$5;
};
var footerItem = function footerItem(props) {
  return (
    /*#__PURE__*/
    core.css(footerItemBase(), ";&:hover{border-color:#eaeaea;};&:active{background:#f0f2f3;}", tooltip(),  "" )
  );
};
var table = function table(props) {
  return (
    /*#__PURE__*/
    core.css("position:relative;min-width:100%;border-collapse:separate;background:white;border-spacing:0;font-size:12px;& th,td{border-right:1px solid #e5ebed;transition:background-color 200ms ease;border-bottom:1px solid #e5ebed;text-align:left;}& thead th{position:sticky;top:0;border-bottom-width:2px;background:#f7f9fa;color:#8091a5;padding:8px 12px;}& td{padding:12px;}& tbody>tr>td:first-of-type{border-right:1px solid #e5ebed;background:white;}", props.stickyColumn ? stickyColumn() : '', ";", props.scrolled ? scrolled() : '', ";" + ( "" ))
  );
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

var _ref5$2 =  {
  name: "gfbbji",
  styles: "& td{background-color:#fbfbfb;}& thead th{background:#f1f3f5;}& thead th:first-of-type{background:#f7f9fa;}"
} ;

var scrolled = function scrolled(props) {
  return _ref5$2;
};
var footerText = function footerText(props) {
  return (
    /*#__PURE__*/
    core.css(footerItemBase(), ";width:auto;font-size:12px;text-align:center;flex:1 1 auto;" + ( "" ))
  );
};

var _ref6$2 =  {
  name: "1bptyke",
  styles: "display:flex;word-break:break-word;"
} ;

var cell = function cell(props) {
  return _ref6$2;
};
var wide = function wide(props) {
  return (
    /*#__PURE__*/
    core.css("width:20em;", cell(), ";" + ( "" ))
  );
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

var TBody = function TBody(_ref) {
  var loading = _ref.loading,
      columnCount = _ref.columnCount,
      rowCount = _ref.rowCount,
      props = _objectWithoutProperties(_ref, ["loading", "columnCount", "rowCount"]);

  // if not loading, then simply show the content as is
  if (!loading) return core.jsx("tbody", props); // if loading and there is already content in the table, then display that content in a skeleton style.
  // content that do not support this styling, will have to manage their own load style.

  if (React__default.Children.count(props.children) > 0) {
    return core.jsx("tbody", _extends({}, props, {
      css: styles$6.tbodyLoading
    }));
  } // if loading and there is no content in the table, then display a bunch of skeleton rows


  return core.jsx("tbody", props, Array(rowCount || 10).fill().map(function (e, i) {
    return core.jsx("tr", {
      key: i
    }, Array(columnCount || 5).fill().map(function (e, i) {
      return core.jsx("td", {
        key: i
      }, core.jsx(Skeleton, null));
    }));
  }));
};
var Th = function Th(_ref2) {
  var children = _ref2.children,
      width = _ref2.width,
      toggle = _ref2.toggle,
      locked = _ref2.locked,
      rest = _objectWithoutProperties(_ref2, ["children", "width", "toggle", "locked"]);

  return core.jsx("th", rest, core.jsx("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      wrap: 'no-wrap'
    },
    css: styles$6[width] ? styles$6[width]() : ''
  }, core.jsx("div", {
    style: {
      flex: '1 1 auto'
    }
  }, children), toggle && core.jsx(Button, {
    appearance: "text",
    onClick: toggle,
    style: {
      display: 'flex',
      marginLeft: 5
    }
  }, locked ? core.jsx(md.MdLock, null) : core.jsx(md.MdLockOpen, null))));
};
var Td = function Td(_ref3) {
  var children = _ref3.children,
      width = _ref3.width,
      rest = _objectWithoutProperties(_ref3, ["children", "width"]);

  return core.jsx("td", rest, core.jsx("span", {
    css: styles$6[width] ? styles$6[width]() : ''
  }, children));
};
var DataTable =
/*#__PURE__*/
function (_Component) {
  _inherits(DataTable, _Component);

  function DataTable(props) {
    var _this;

    _classCallCheck(this, DataTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataTable).call(this, props));
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
      return core.jsx(React__default.Fragment, null, core.jsx("div", {
        css: styles$6.wrapper(),
        style: style
      }, core.jsx("div", {
        css: styles$6.occurrenceTable(),
        onScroll: this.bodyScroll,
        ref: this.myRef
      }, core.jsx("table", {
        css: styles$6.table({
          stickyColumn: fixedColumn,
          scrolled: this.state.scrolled && fixedColumn
        })
      }, children)), core.jsx("div", {
        css: styles$6.footer()
      }, page > 2 && core.jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "right",
        tip: "first",
        onClick: first
      }, core.jsx(md.MdFirstPage, null)), page > 1 && core.jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "right",
        tip: "previous",
        onClick: prev
      }, core.jsx(md.MdChevronLeft, null)), core.jsx("span", {
        css: styles$6.footerText()
      }, core.jsx(reactIntl.FormattedMessage, {
        id: "pagination.pageXofY",
        defaultMessage: 'Loading',
        values: {
          current: core.jsx(reactIntl.FormattedNumber, {
            value: page
          }),
          total: core.jsx(reactIntl.FormattedNumber, {
            value: totalPages
          })
        }
      })), page !== totalPages && core.jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "left",
        tip: "next",
        onClick: next
      }, core.jsx(md.MdChevronRight, null)), core.jsx(Button, {
        appearance: "text",
        css: styles$6.footerItem(),
        direction: "left",
        tip: "options"
      }, core.jsx(md.MdMoreVert, null)))));
    }
  }]);

  return DataTable;
}(React.Component);

var _ref$c =  {
  name: "9virse",
  styles: "margin:4px 4px 10px 4px;display:flex;flex-wrap:wrap;justify-content:flex-start;padding:0;"
} ;

var gallery = function gallery(props) {
  return _ref$c;
};

var _ref2$6 =  {
  name: "1r2ujex",
  styles: "flex:1 1 auto;width:150px;margin:6px;height:150px;display:block;position:relative;overflow:hidden;background:#eee;background-size:cover;background-repeat:no-repeat;background-position:center;&:hover{box-shadow:0 0 1px 1px rgba(0,0,0,0.3);}& img{display:none;}"
} ;

var galleryTile = function galleryTile(props) {
  return _ref2$6;
};

var _ref3$6 =  {
  name: "1u9cyng",
  styles: "position:absolute;bottom:0;left:0;right:0;font-size:.85em;background:rgba(0,0,0,.2);color:white;padding:5px;"
} ;

var caption = function caption(props) {
  return _ref3$6;
};
var more = function more(props) {
  return (
    /*#__PURE__*/
    core.css("flex:100 1 auto;display:flex;height:", props.height || 150, "px;align-items:center;color:#888;min-width:100px;padding-left:30px;" + ( "" ))
  );
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

var _ref5$3 =  {
  name: "1678d4w",
  styles: "border-bottom:1px solid #e8e8e8;padding:10px 20px;h2{font-size:14px;margin:0;}"
} ;

var detailHeader = function detailHeader(props) {
  return _ref5$3;
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
  return (
    /*#__PURE__*/
    core.css(detailNav(), ";left:0;" + ( "" ))
  );
};
var detailNext = function detailNext(props) {
  return (
    /*#__PURE__*/
    core.css(detailNav(), ";right:0;" + ( "" ))
  );
};
var skeletonTile = function skeletonTile(props) {
  return (
    /*#__PURE__*/
    core.css("height:", props.height, "px;width:", props.height * 1.2, "px;flex:1 1 auto;margin:6px;animation:", skeletonLoading, " 3s linear infinite;" + ( "" ))
  );
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
  return (
    /*#__PURE__*/
    core.css( "" )
  );
};
var image = function image(_ref3) {
  var src = _ref3.src,
      blur = _ref3.blur;
  return (
    /*#__PURE__*/
    core.css("height:100%;width:100%;background:url(", src, ");background-position:center;background-size:contain;background-repeat:no-repeat;position:relative;text-align:center;", blur ? 'filter: blur(8px)' : '', ";" + ( "" ))
  );
};

var _ref$d =  {
  name: "i4qehi",
  styles: "position:absolute;bottom:20px;left:20px;background:rgba(0,0,0,.8);color:white;padding:10px;"
} ;

var toolBar = function toolBar() {
  return _ref$d;
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

  var theme = React.useContext(ThemeContext);

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
  return core.jsx("div", _extends({
    ref: wrapperRef,
    css: styles$8.zoomableImage({
      theme: theme
    })
  }, props), core.jsx("div", {
    css: styles$8.image({
      theme: theme,
      src: imageSrc,
      blur: imageSrc === thumbnail
    })
  }), core.jsx("div", {
    css: styles$8.toolBar({
      theme: theme,
      src: src
    })
  }, core.jsx(Button, {
    appearance: "text",
    ref: ref,
    onClick: function onClick() {
      if (isFullscreen) document.exitFullscreen();else wrapperRef.current.requestFullscreen();
      setFullscreen(!isFullscreen);
    }
  }, isFullscreen ? core.jsx(md.MdFullscreenExit, null) : core.jsx(md.MdFullscreen, null))));
});
ZoomableImage.displayName = 'ZoomableImage';

var TabList$1 = Tabs.TabList,
    Tab$1 = Tabs.Tab,
    TabPanel$1 = Tabs.TabPanel;
var getThumbnail = function getThumbnail(src) {
  return "//api.gbif.org/v1/image/unsafe/x150/".concat(encodeURIComponent(src));
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

  var theme = React.useContext(ThemeContext);
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
  return core.jsx(Root, null, core.jsx(Tabs, {
    activeId: activeId,
    onChange: function onChange(id) {
      return setTab(id === activeId ? undefined : id);
    }
  }, core.jsx(Row, _extends({
    as: "section",
    direction: "column",
    wrap: "nowrap"
  }, props, {
    css: detailPage()
  }), core.jsx(Row, {
    css: detailHeader,
    alignItems: "center"
  }, core.jsx(Col, null, item && core.jsx("h2", null, title), subtitle && core.jsx("div", {
    css: detailHeaderDescription
  }, subtitle)), core.jsx(Col, {
    grow: false
  }, core.jsx(Button, {
    appearance: "text",
    onClick: closeRequest
  }, core.jsx(md.MdClose, null)))), core.jsx(Row, {
    css: detailMainWrapper,
    wrap: "nowrap"
  }, core.jsx(Col, {
    css: detailMain,
    shrink: true,
    basis: "100%"
  }, core.jsx("div", {
    css: detailPrev,
    onClick: function onClick() {
      return previous();
    }
  }, core.jsx(md.MdChevronLeft, null)), item && core.jsx(ZoomableImage, {
    src: imageSrc(item),
    thumbnail: getThumbnail(imageSrc(item))
  }), core.jsx("div", {
    css: detailNext,
    onClick: function onClick() {
      return next();
    }
  }, core.jsx(md.MdChevronRight, null))), details && core.jsx(React__default.Fragment, null, core.jsx(Col, {
    shrink: false,
    grow: false,
    css: detailDrawerBar
  }, core.jsx(TabList$1, {
    "aria-label": "Details"
  }, core.jsx(Tab$1, {
    tabId: "details",
    direction: "left"
  }, core.jsx(md.MdInfo, null)))), core.jsx(Col, {
    shrink: false,
    grow: false,
    css: detailDrawerContent
  }, core.jsx(TabPanel$1, {
    tabId: "details"
  }, details(item))))))));
};
GalleryDetails.displayName = 'Gallery'; // Gallery.propTypes = {
// };

var GalleryTileSkeleton = function GalleryTileSkeleton(_ref) {
  var _ref$height = _ref.height,
      height = _ref$height === void 0 ? 150 : _ref$height,
      props = _objectWithoutProperties(_ref, ["height"]);

  return core.jsx("div", _extends({
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

  var theme = React.useContext(ThemeContext);

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

  return core.jsx(Button, _extends({
    appearance: "text",
    css: styles$7.galleryTile({
      theme: theme
    }),
    style: style,
    onClick: onSelect
  }, props, {
    title: "View details"
  }), core.jsx("img", {
    src: backgroundImage,
    width: height,
    onLoad: onLoad,
    alt: "Occurrence evidence"
  }), children);
};
var GalleryCaption = function GalleryCaption(props) {
  var theme = React.useContext(ThemeContext);
  return core.jsx("div", _extends({
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

  var theme = React.useContext(ThemeContext);
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
  return core.jsx(React__default.Fragment, null, !onSelect && core.jsx(Dialog.Dialog, _extends({}, dialog, {
    tabIndex: 0,
    "aria-label": "Welcome"
  }), activeItem && core.jsx(GalleryDetails, {
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
  })), core.jsx("div", _extends({
    css: styles$7.gallery({
      theme: theme
    })
  }, props), items.map(function (e, i) {
    return core.jsx(GalleryTile, {
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
    return core.jsx(GalleryTileSkeleton, {
      key: i
    });
  }) : null, core.jsx("div", {
    css: styles$7.more({
      theme: theme,
      height: 150
    })
  }, loadMore && !loading && core.jsx(Button, {
    appearance: "outline",
    onClick: loadMore
  }, "Load more"))));
};
Gallery.displayName = 'Gallery'; // Gallery.propTypes = {
// };

var Option = React__default.forwardRef(function (_ref2, ref) {
  var label = _ref2.label,
      checked = _ref2.checked,
      onChange = _ref2.onChange,
      helpText = _ref2.helpText,
      helpVisible = _ref2.helpVisible,
      props = _objectWithoutProperties(_ref2, ["label", "checked", "onChange", "helpText", "helpVisible"]);

  return core.jsx("label", {
    css: optionClass(),
    style: {
      display: 'flex',
      wrap: 'nowrap'
    }
  }, core.jsx("div", null, core.jsx(Checkbox, {
    ref: ref,
    checked: checked,
    onChange: onChange,
    style: {
      flex: '0 0 auto'
    }
  })), core.jsx("div", {
    style: {
      flex: '1 1 auto',
      marginLeft: 10
    }
  }, core.jsx("div", null, label), helpVisible && helpText && core.jsx("div", {
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

var _ref$e =  {
  name: "sc26ll",
  styles: "padding:6px 0;&:last-child{margin-bottom:0;}"
} ;

var optionClass = function optionClass(theme) {
  return _ref$e;
};

var list = Array(500).fill().map(function (e, i) {
  return i + '';
});
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
      return React__default.createElement(FilterContext.Consumer, null, function (context) {
        return React__default.createElement(WrappedComponent, _extends({}, injectedProps(context), props));
      });
    };

    return Wrapper;
  };
};

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|download|draggable|encType|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|itemProp|itemScope|itemType|itemID|itemRef|on|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/; // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

var index = memoize(function (prop) {
  return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111
  /* o */
  && prop.charCodeAt(1) === 110
  /* n */
  && prop.charCodeAt(2) < 91;
}
/* Z+1 */
);

var isBrowser = typeof document !== 'undefined';
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
  isBrowser === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var stylesForSSR = '';
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);

      if (!isBrowser && maybeStyles !== undefined) {
        stylesForSSR += maybeStyles;
      }

      current = current.next;
    } while (current !== undefined);

    if (!isBrowser && stylesForSSR.length !== 0) {
      return stylesForSSR;
    }
  }
};

/* eslint-disable */
// murmurhash2 via https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
function murmurhash2_32_gc(str) {
  var l = str.length,
      h = l ^ l,
      i = 0,
      k;

  while (l >= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    k ^= k >>> 24;
    k = (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0x5bd1e995 & 0xffff) << 16);
    h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16) ^ k;
    l -= 4;
    ++i;
  }

  switch (l) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  }

  h ^= h >>> 13;
  h = (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0x5bd1e995 & 0xffff) << 16);
  h ^= h >>> 15;
  return (h >>> 0).toString(36);
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

  var name = murmurhash2_32_gc(styles) + identifierName;

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

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

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var isBrowser$1 = typeof document !== 'undefined';

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


    var Styled = core.withEmotionCache(function (props, context, ref) {
      return React.createElement(core.ThemeContext.Consumer, null, function (theme) {
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

        if (!isBrowser$1 && rules !== undefined) {
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

// enums for example varies between the APIs. field names vary etc.

var filters = {
  year: termOrRangeFilter('year'),
  BasisOfRecord: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values.map(function (e) {
        return snakeCase(e).toUpperCase();
      });
    },
    fieldName: 'basisOfRecord'
  },
  Rank: {
    type: 'TERMS',
    getValues: function getValues(values) {
      return values.map(function (e) {
        return snakeCase(e).toUpperCase();
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

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

var axios = _objectSpread$2({}, axios$1, {
  get: get,
  post: post
});

// const esEndpoint = '//c6n1.gbif.org:9200/occurrence'

var endpoint = '//labs.gbif.org:7011';

var query = function query(filters, size, from) {
  var body = compose(filters).size(size).from(from).build();
  return axios.post("".concat(endpoint, "/_search"), body, {});
}; // const build = (filters) => {

mapboxgl.accessToken = "pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA";
/*
field: coordinates
url: http://labs.gbif.org:7011/_search?
filter: {"bool":{"filter":{"term":{"datasetKey":"4fa7b334-ce0d-4e88-aaae-2e0c138d049e"}}}}
*/

var MapAreaComponent =
/*#__PURE__*/
createStyled('div', {
  target: "ewmcyas0"
})( {
  name: "a9mg2k",
  styles: "flex:1 1 100%;display:flex;height:100%;max-height:100vh;flex-direction:column;"
} );

var MapComponent =
/*#__PURE__*/
createStyled('div', {
  target: "ewmcyas1"
})( {
  name: "1iaaxca",
  styles: "flex:1 1 100%;border:1px solid #ddd;border-radius:3px;display:flex;flex-direction:column;& canvas:focus{outline:none;}"
} );

var Map =
/*#__PURE__*/
function (_Component) {
  _inherits(Map, _Component);

  function Map(props) {
    var _this;

    _classCallCheck(this, Map);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Map).call(this, props));
    _this.addLayer = _this.addLayer.bind(_assertThisInitialized(_this));
    _this.updateLayer = _this.updateLayer.bind(_assertThisInitialized(_this));
    _this.myRef = React__default.createRef();
    _this.state = {};
    return _this;
  }

  _createClass(Map, [{
    key: "componentDidMount",
    value: function componentDidMount() {
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
      return React__default.createElement(MapAreaComponent, null, React__default.createElement(MapComponent, {
        ref: this.myRef
      }));
    }
  }]);

  return Map;
}(React.Component);

var Map$1 = function Map$1(props) {
  return React__default.createElement(Map, props); // return <h1>test</h1>
};

var mapContextToProps = function mapContextToProps(_ref) {
  var filter = _ref.filter,
      filterHash = _ref.filterHash;
  return {
    filter: filter,
    filterHash: filterHash
  };
};

var Map$2 = withContext$1(mapContextToProps)(Map$1);

var formatFactory = (function (getData) {
  return (
    /*#__PURE__*/
    function (_Component) {
      _inherits(Format, _Component);

      function Format(props) {
        var _this;

        _classCallCheck(this, Format);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Format).call(this, props));
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
          var title = this.state.error ? React__default.createElement("span", {
            className: "discreet"
          }, "unknown") : this.state.title;
          var style = typeof title !== 'undefined' ? {} : {
            display: 'inline-block',
            width: '100px',
            background: 'rgba(0,0,0,.1)'
          };
          return React__default.createElement("span", {
            style: style
          }, title, "\xA0");
        }
      }]);

      return Format;
    }(React.Component)
  );
});

var endpoints = {
  dataset: '//api.gbif.org/v1/dataset',
  publisher: '//api.gbif.org/v1/dataset',
  species: '//api.gbif.org/v1/species'
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
      title: startCase(id + '')
    };
  }
}, {
  name: 'TypeStatus',
  format: function format(id) {
    return {
      title: startCase(id + '')
    };
  }
}, {
  name: 'year',
  format: function format(id) {
    if (_typeof(id) === 'object') {
      var title;

      if (isUndefined(id.gte)) {
        title = "before ".concat(id.lt);
      } else if (isUndefined(id.lt)) {
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
  return React__default.createElement(FilterButton, _extends({
    loading: loading,
    isActive: options.length > 0,
    ref: ref,
    onClearRequest: onClear
  }, props), options.length === 1 ? React__default.createElement(DisplayValue, {
    id: options[0]
  }) : React__default.createElement(reactIntl.FormattedMessage, {
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

var Header = function Header(_ref) {
  var children = _ref.children,
      menuItems = _ref.menuItems,
      props = _objectWithoutProperties(_ref, ["children", "menuItems"]);

  return core.jsx(Row, _extends({
    as: "section"
  }, props, {
    css: header,
    alignItems: "center"
  }), core.jsx(Col, null, children), menuItems && core.jsx(Col, {
    grow: false
  }, core.jsx(Menu, {
    "aria-label": "Custom menu",
    trigger: core.jsx(Button, {
      appearance: "text"
    }, core.jsx(md.MdMoreVert, {
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

  var theme = React.useContext(ThemeContext);
  return core.jsx(Row, _extends({}, props, {
    css: footer$1()
  }), core.jsx(Col, null, showBack && core.jsx(Button, {
    appearance: "ghost",
    onClick: onBack
  }, "Back"), !showBack && core.jsx(Button, {
    appearance: "ghost",
    onClick: onCancel
  }, "Cancel")), core.jsx(Col, {
    grow: false
  }, !showBack && core.jsx(Button, {
    type: "submit",
    form: formId,
    onClick: onApply
  }, "Apply")));
};

var _ref$f =  {
  name: "rwikbu",
  styles: "padding:.8em 1em;flex:0 0 auto;"
} ;

var footer$1 = function footer(theme) {
  return _ref$f;
};

var SummaryBar = function SummaryBar(_ref2) {
  var count = _ref2.count,
      onClear = _ref2.onClear,
      props = _objectWithoutProperties(_ref2, ["count", "onClear"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx("div", _extends({}, props, {
    css: summary()
  }), core.jsx(Row, {
    as: "div"
  }, core.jsx(Col, null, count, " selected"), count > 0 && core.jsx(Col, {
    grow: false
  }, core.jsx(Button, {
    appearance: "text",
    onClick: onClear
  }, "Clear"))));
};

var _ref$g =  {
  name: "19qmqma",
  styles: "font-size:.85em;color:#999;font-weight:200;margin:.5em 1.5em;"
} ;

var summary = function summary(theme) {
  return _ref$g;
};

var Prose = React__default.forwardRef(function (_ref8, ref) {
  var _ref8$as = _ref8.as,
      Div = _ref8$as === void 0 ? 'div' : _ref8$as,
      props = _objectWithoutProperties(_ref8, ["as"]);

  var theme = React.useContext(ThemeContext);
  return core.jsx(Div, _extends({}, props, {
    css: prose({
      theme: theme
    })
  }));
});

var _ref$h =  {
  name: "3ugpui",
  styles: "ol{counter-reset:listitem;list-style:none;}ol>li{position:relative;margin:4px 0;padding-left:32px;}ol>li:before{counter-increment:listitem;content:counter(listitem);background:#e3e8ee;color:#697386;font-size:12px;font-weight:500;line-height:10px;text-align:center;padding:5px 0;height:20px;width:20px;border-radius:10px;position:absolute;left:0;}"
} ;

var ol = function ol(_ref10) {
  var theme = _ref10.theme;
  return _ref$h;
};

var _ref2$7 =  {
  name: "fm4a77",
  styles: "font-size:10px;line-height:18px;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;"
} ;

var h6 = function h6(_ref11) {
  var theme = _ref11.theme;
  return _ref2$7;
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

var _ref5$4 =  {
  name: "1toivzt",
  styles: "font-size:20px;line-height:24px;"
} ;

var h3 = function h3(_ref14) {
  var theme = _ref14.theme;
  return _ref5$4;
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
  return (
    /*#__PURE__*/
    core.css("-webkit-font-smoothing:antialiased;line-height:1.3em;h1,h2,h3,h4,h5,h6{font-weight:400;}h1{", h1(theme), ";}h2{", h2(theme), ";}h3{", h3(theme), ";}h4{", h4(theme), ";}h5{", h5(theme), ";}h6{", h6(theme), ";}", ol(theme), ";p{margin-bottom:8px;}" + ( "" ))
  );
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
var FilterBodyDescription =
/*#__PURE__*/
createStyled(FilterBody, {
  target: "e11diz0w2"
})( {
  name: "12aw9rk",
  styles: "padding-top:20px;padding-bottom:20px;"
} );

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var FilterState =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FilterState, _React$Component);

  function FilterState() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilterState);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilterState)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_this), "setFilter",
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(filter) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!isEqual(filter, _this.props.filter)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                if (_typeof(filter) === 'object') {
                  filter = cloneDeep(filter);
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

    _defineProperty(_assertThisInitialized(_this), "setField",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(field, value) {
        var must,
            filter,
            type,
            _args2 = arguments;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                must = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : true;
                filter = _this.props.filter ? cloneDeep(_this.props.filter) : {};
                type = must ? 'must' : 'must_not';

                _this.setFilter(_objectSpread$3({}, filter, _defineProperty({}, type, _objectSpread$3({}, filter[type], _defineProperty({}, field, value)))));

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

    _defineProperty(_assertThisInitialized(_this), "add",
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(field, value) {
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
                values = get$1(_this.props.filter, "".concat(type, ".").concat(field), []);
                values = values.concat(value);
                values = uniqWith(values, isEqual);

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

    _defineProperty(_assertThisInitialized(_this), "remove",
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(field, value) {
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
                values = get$1(_this.props.filter, "".concat(type, ".").concat(field), []);
                values = values.filter(function (e) {
                  return !isEqual(e, value);
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

    _defineProperty(_assertThisInitialized(_this), "toggle",
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5(field, value) {
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
                values = get$1(_this.props.filter, "".concat(type, ".").concat(field), []);

                if (values.some(function (e) {
                  return isEqual(e, value);
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
      return React__default.createElement(FilterContext.Provider, {
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
  return React__default.createElement(UncontrollableFilterState, {
    filter: tmpFilter,
    onChange: function onChange(updatedFilter) {
      return onFilterChange(updatedFilter);
    }
  }, React__default.createElement(FilterContext.Consumer, null, function (_ref2) {
    var setField = _ref2.setField,
        toggle = _ref2.toggle,
        filter = _ref2.filter;
    var selectedItems = get$1(filter, "must.".concat(filterName), []);
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
    return React__default.createElement(FilterBox, {
      style: style
    }, React__default.createElement(Header, {
      menuItems: function menuItems(menuState) {
        return [].concat(_toConsumableArray(aboutText ? [React__default.createElement(MenuAction, {
          key: "About",
          onClick: function onClick() {
            onAboutChange(true);
            menuState.hide();
          }
        }, "About this filter")] : []), _toConsumableArray(hasHelpTexts ? [React__default.createElement(MenuToggle, {
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
    }, title), !aboutVisible && React__default.createElement(React__default.Fragment, null, children({
      summaryProps: summaryProps,
      footerProps: footerProps,
      helpVisible: helpVisible,
      setField: setField,
      toggle: toggle,
      filter: filter,
      selectedItems: selectedItems,
      checkedMap: checkedMap
    })), aboutVisible && React__default.createElement(React__default.Fragment, null, React__default.createElement(Prose, {
      as: FilterBodyDescription
    }, aboutText), React__default.createElement(Footer, footerProps)));
  }));
}

var UncontrollableFilter = uncontrollable.uncontrollable(Filter, {
  aboutVisible: 'onAboutChange',
  helpVisible: 'onHelpChange',
  filter: 'onFilterChange'
});

var Suggest =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Suggest, _React$Component);

  function Suggest() {
    var _this;

    _classCallCheck(this, Suggest);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Suggest).call(this)); // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.

    _defineProperty(_assertThisInitialized(_this), "onChange", function (event, _ref) {
      var newValue = _ref.newValue;

      _this.setState({
        value: newValue
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionsFetchRequested",
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(_ref3) {
        var value, suggestions;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = _ref3.value;

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
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "onSuggestionsClearRequested", function () {
      _this.setState({
        suggestions: []
      });
    });

    _defineProperty(_assertThisInitialized(_this), "onSuggestionSelected", function (_ref4) {
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

      return React__default.createElement(React__default.Fragment, null, React__default.createElement(Autocomplete, {
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
      var _getSuggestions = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(_ref) {
        var q, suggestions;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                q = _ref.q;
                _context.next = 3;
                return axios.get("http://api.gbif.org/v1/species/suggest?limit=8&q=".concat(q));

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
      return core.jsx("div", {
        style: {
          maxWidth: '100%'
        }
      }, core.jsx("div", {
        style: suggestStyle
      }, suggestion.scientificName), core.jsx("div", {
        style: {
          color: '#aaa',
          fontSize: '0.85em'
        }
      }, core.jsx(Classification, {
        taxon: suggestion
      })));
    }
  },
  datasetTitle: {
    //What placeholder to show
    placeholder: 'Search by dataset',
    // how to get the list of suggestion data
    getSuggestions: function () {
      var _getSuggestions2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(_ref2) {
        var q, suggestions;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                q = _ref2.q;
                _context2.next = 3;
                return axios.get("http://api.gbif.org/v1/dataset/suggest?limit=8&q=".concat(q));

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
      return core.jsx("div", {
        style: {
          maxWidth: '100%'
        }
      }, core.jsx("div", {
        style: suggestStyle
      }, suggestion.title));
    }
  }
};
var Classification = function Classification(_ref3) {
  var taxon = _ref3.taxon,
      props = _objectWithoutProperties(_ref3, ["taxon"]);

  var ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  return core.jsx("span", {
    css: taxClass
  }, ranks.map(function (rank) {
    return taxon.rank !== rank.toUpperCase() && taxon[rank] ? core.jsx("span", {
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

  var _React$useState = React__default.useState(nanoid),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      id = _React$useState2[0];

  var initialOptions = get$1(initFilter, "must.".concat(filterName), []);

  var _useState = React.useState(initialOptions),
      _useState2 = _slicedToArray(_useState, 2),
      options = _useState2[0],
      setOptions = _useState2[1];

  return core.jsx(UncontrollableFilter, {
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
    return core.jsx(React__default.Fragment, null, core.jsx(Suggest, _extends({}, suggestConfigs.scientificName, {
      focusRef: focusRef,
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      },
      onSuggestionSelected: function onSuggestionSelected(_ref3) {
        var item = _ref3.item;
        var allOptions = union(options, [item.key]);
        setOptions(allOptions);
        toggle(filterName, item.key);
      }
    })), options.length > 0 && core.jsx(React__default.Fragment, null, core.jsx(SummaryBar, _extends({}, summaryProps, {
      style: {
        marginTop: 0
      }
    })), core.jsx(FilterBody, {
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      }
    }, core.jsx("form", {
      id: formId,
      onSubmit: function onSubmit(e) {
        return e.preventDefault();
      }
    }, options.map(function (taxonKey) {
      return core.jsx(Option, {
        key: taxonKey,
        helpVisible: true,
        label: core.jsx(ScientificName, {
          id: taxonKey
        }),
        checked: checkedMap.has(taxonKey),
        onChange: function onChange() {
          return toggle(filterName, taxonKey);
        }
      });
    }))), core.jsx(Footer, _extends({}, footerProps, {
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
  return core.jsx(Popover, {
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
    return core.jsx(PopupContent, {
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
  return core.jsx(TaxonFilterPopover, {
    modal: true
  }, core.jsx(TriggerButton, _extends({}, props, {
    filterName: filterName,
    displayValueAs: "canonicalName",
    options: get$1(currentFilterContext.filter, "must.".concat(filterName))
  })));
};

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var enumMap = {};

var getByLanguage = function getByLanguage(obj, language) {
  if (!obj) return;
  return obj[language] || obj.eng || undefined;
};

var getCoreFields = function getCoreFields(obj, language) {
  var label = getByLanguage(obj.label, language);
  var definition = getByLanguage(obj.definition, language);
  return _objectSpread$4({
    name: obj.name
  }, label ? {
    label: label
  } : null, {}, definition ? {
    definition: definition
  } : null);
};

var fetchVocabulary =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(name, language) {
    var vocab, concepts, trimmedConcepts;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return axios.get("http://api.gbif-uat.org/v1/vocabularies/".concat(name));

          case 2:
            vocab = _context.sent.data;
            _context.next = 5;
            return axios.get("http://api.gbif-uat.org/v1/vocabularies/".concat(name, "/concepts?limit=1000"));

          case 5:
            concepts = _context.sent.data;
            trimmedConcepts = concepts.results.map(function (c) {
              return _objectSpread$4({}, getCoreFields(c, language));
            });
            return _context.abrupt("return", _objectSpread$4({}, getCoreFields(vocab, language), {
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

var getVocabulary =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(name, language) {
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

  var _React$useState = React__default.useState(nanoid),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      id = _React$useState2[0];

  return React__default.createElement(UncontrollableFilter, {
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
    return React__default.createElement(React__default.Fragment, null, React__default.createElement(SummaryBar, summaryProps), React__default.createElement(FilterBody, null, React__default.createElement("form", {
      id: formId,
      onSubmit: function onSubmit(e) {
        return e.preventDefault();
      }
    }, vocabulary && vocabulary.concepts.map(function (concept, index) {
      return React__default.createElement(Option, {
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
    }))), React__default.createElement(Footer, _extends({}, footerProps, {
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
  return React__default.createElement(VocabularyFilterPopover, {
    modal: true,
    vocabularyName: vocabularyName
  }, function (_ref4) {
    var vocabulary = _ref4.vocabulary;
    return React__default.createElement(Trigger, _extends({}, props, {
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
  return React__default.createElement(Popover, {
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
    return vocabulary && React__default.createElement(PopupContent$1, {
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

  if (!vocabulary) return React__default.createElement(Button, {
    appearance: "primaryOutline",
    ref: ref,
    loading: true
  }, "Loading");
  var appliedFiltersSet = new Set(get$1(filter, "must.".concat(vocabulary.name), []));

  if (appliedFiltersSet.size === 1) {
    var selected = keyBy(vocabulary.concepts, 'name')[filter.must[vocabulary.name][0]].label;
    return React__default.createElement(FilterButton, _extends({
      isActive: true
    }, props, {
      ref: ref,
      onClearRequest: onClear
    }), selected);
  }

  if (appliedFiltersSet.size > 1) {
    return React__default.createElement(FilterButton, _extends({
      isActive: true,
      onClearRequest: onClear
    }, props, {
      ref: ref
    }), appliedFiltersSet.size, " ", vocabulary.label, "s");
  }

  return React__default.createElement(FilterButton, _extends({}, props, {
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
      var val = get$1(row._source, field);
      return React__default.createElement(Td, {
        key: field
      }, val); // if (i === 0) {
      //   return <Td key={field}>
      //     <TextButton onClick={() => console.log(row)}>{val}</TextButton>
      //   </Td>
      // } else {
      //   return <Td key={field}>{val}</Td>;
      // }
    });
    return React__default.createElement("tr", {
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
  var headers = [React__default.createElement(Th, {
    key: "scientificName",
    width: "wide",
    locked: fixedColumn,
    toggle: function toggle() {
      return setFixed(!fixedColumn);
    }
  }, React__default.createElement(Row, null, React__default.createElement(Col, {
    grow: false
  }, "scientificName"), React__default.createElement(Col, null, React__default.createElement(TaxonFilterPopover, {
    modal: true
  }, React__default.createElement(Button, {
    appearance: "text",
    style: {
      display: 'flex'
    }
  }, React__default.createElement(md.MdFilterList, null)))))), React__default.createElement(Th, {
    key: "year"
  }, "year"), React__default.createElement(Th, {
    key: "basisOfRecord",
    width: "wide"
  }, React__default.createElement(Row, null, React__default.createElement(Col, {
    grow: false
  }, "Basis of record"), React__default.createElement(Col, null, React__default.createElement(VocabularyFilterPopover, {
    modal: true
  }, React__default.createElement(Button, {
    appearance: "text",
    style: {
      display: 'flex'
    }
  }, React__default.createElement(md.MdFilterList, null)))))), React__default.createElement(Th, {
    key: "datasetTitle",
    width: "wide"
  }, "datasetTitle"), React__default.createElement(Th, {
    key: "publisherTitle",
    width: "wide"
  }, "publisherTitle"), React__default.createElement(Th, {
    key: "countryCode"
  }, "countryCode"), React__default.createElement(Th, {
    key: "gbifTaxonRank"
  }, "rank")];
  return React__default.createElement("div", {
    style: {
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column"
    }
  }, React__default.createElement(DataTable, _extends({
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
  }), React__default.createElement("thead", null, React__default.createElement("tr", null, headers)), React__default.createElement(TBody, {
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

var Table =
/*#__PURE__*/
function (_Component) {
  _inherits(Table, _Component);

  function Table(props) {
    var _this;

    _classCallCheck(this, Table);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Table).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "loadData", function () {
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

    _defineProperty(_assertThisInitialized(_this), "next", function () {
      _this.setState({
        from: Math.max(0, _this.state.from + _this.state.size)
      }, _this.loadData);
    });

    _defineProperty(_assertThisInitialized(_this), "prev", function () {
      _this.setState({
        from: Math.max(0, _this.state.from - _this.state.size)
      }, _this.loadData);
    });

    _defineProperty(_assertThisInitialized(_this), "first", function () {
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
      return React__default.createElement(TablePresentation, {
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
  var total = get$1(result, 'hits.total', 0);
  var hits = get$1(result, 'hits.hits');
  if (!hits) return React__default.createElement("div", null, "no content");
  var itemsLeft = total ? total - from : 20;
  var loaderCount = Math.min(Math.max(itemsLeft, 0), size);
  return React__default.createElement(Gallery, {
    caption: function caption(_ref2) {
      var item = _ref2.item;
      return React__default.createElement(GalleryCaption, null, item._source.gbifClassification.usage.name);
    },
    title: function title(item) {
      return item._source.gbifClassification.usage.name;
    },
    subtitle: function subtitle(item) {
      return item.description;
    },
    details: function details(item) {
      return React__default.createElement("pre", null, JSON.stringify(item, null, 2));
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

var Gallery$1 =
/*#__PURE__*/
function (_Component) {
  _inherits(Gallery, _Component);

  function Gallery(props) {
    var _this;

    _classCallCheck(this, Gallery);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Gallery).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "loadData", function () {
      _this.setState({
        loading: true,
        error: false
      });

      if (_this.runningQuery && _this.runningQuery.cancel) _this.runningQuery.cancel();
      var filter = merge({}, _this.props.filter, {
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

    _defineProperty(_assertThisInitialized(_this), "next", function () {
      _this.setState({
        from: Math.max(0, _this.state.from + _this.state.size)
      }, _this.loadData);
    });

    _defineProperty(_assertThisInitialized(_this), "prev", function () {
      _this.setState({
        from: Math.max(0, _this.state.from - _this.state.size)
      }, _this.loadData);
    });

    _defineProperty(_assertThisInitialized(_this), "first", function () {
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
      return React__default.createElement(GalleryPresentation, {
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

  var _React$useState = React__default.useState(nanoid),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      id = _React$useState2[0];

  var initialOptions = get$1(initFilter, "must.".concat(filterName), []);

  var _useState = React.useState(initialOptions),
      _useState2 = _slicedToArray(_useState, 2),
      options = _useState2[0],
      setOptions = _useState2[1];

  return core.jsx(UncontrollableFilter, {
    onApply: _onApply,
    onCancel: _onCancel,
    title: core.jsx(reactIntl.FormattedMessage, {
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
    return core.jsx(React__default.Fragment, null, core.jsx(Suggest, _extends({}, suggestConfig, {
      focusRef: focusRef,
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      },
      onSuggestionSelected: function onSuggestionSelected(_ref3) {
        var item = _ref3.item;
        var allOptions = union(options, [item.key]);
        setOptions(allOptions);
        toggle(filterName, item.key);
      }
    })), options.length > 0 && core.jsx(React__default.Fragment, null, core.jsx(SummaryBar, _extends({}, summaryProps, {
      style: {
        marginTop: 0
      }
    })), core.jsx(FilterBody, {
      onKeyPress: function onKeyPress(e) {
        return e.which === keyCodes.ENTER ? _onApply(filter) : null;
      }
    }, core.jsx("form", {
      id: formId,
      onSubmit: function onSubmit(e) {
        return e.preventDefault();
      }
    }, options.map(function (key) {
      return core.jsx(Option, {
        key: key,
        helpVisible: true,
        label: core.jsx(DisplayName, {
          id: key
        }),
        checked: checkedMap.has(key),
        onChange: function onChange() {
          return toggle(filterName, key);
        }
      });
    }))), core.jsx(Footer, _extends({}, footerProps, {
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
  return core.jsx(Popover, {
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
    return core.jsx(PopupContent$2, {
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
function SuggestFilterButton(_ref8) {
  var filterName = _ref8.filterName,
      DisplayName = _ref8.DisplayName,
      displayValueAs = _ref8.displayValueAs,
      suggestConfig = _ref8.suggestConfig,
      props = _objectWithoutProperties(_ref8, ["filterName", "DisplayName", "displayValueAs", "suggestConfig"]);

  var currentFilterContext = React.useContext(FilterContext);
  return core.jsx(SuggestFilterPopover, {
    filterName: filterName,
    DisplayName: DisplayName,
    suggestConfig: suggestConfig,
    modal: true
  }, core.jsx(TriggerButton, _extends({}, props, {
    filterName: filterName,
    displayValueAs: displayValueAs,
    options: get$1(currentFilterContext.filter, "must.".concat(filterName), [])
  })));
}

var ScientificName$1 = displayValue('scientificName').component;
var DatasetTitle = displayValue('datasetTitle').component;

var _ref$i =  {
  name: "bnzwiv",
  styles: "margin-right:4px;margin-bottom:4px;"
} ;

var _ref2$8 =  {
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

  var theme = React.useContext(ThemeContext);
  var prefix = theme.prefix || 'gbif';
  var elementName = 'filterBar';
  return core.jsx("div", _extends({
    className: "".concat(className, " ").concat(prefix, "-").concat(elementName),
    css:
    /*#__PURE__*/
    core.css(style(),  "" )
  }, props), core.jsx("div", null, core.jsx(TaxonFilter, {
    css: _ref$i
  })), core.jsx("div", null, core.jsx(SuggestFilterButton, {
    DisplayName: DatasetTitle,
    filterName: "datasetKey",
    displayValueAs: "datasetTitle",
    suggestConfig: suggestConfigs.datasetTitle,
    css: _ref2$8
  })), core.jsx("div", null, core.jsx(VocabularyFilter, {
    css: _ref3$8
  })), core.jsx("div", null, core.jsx(VocabularyFilter, {
    vocabularyName: "Country",
    css: _ref4$6
  })));
};

var _ref5$5 =  {
  name: "p58oka",
  styles: "display:flex;flex-direction:row;flex-wrap:wrap;"
} ;

var style = function style(theme) {
  return _ref5$5;
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

  var theme = React.useContext(ThemeContext);
  var prefix = theme.prefix || 'gbif';
  var elementName = 'occurrenceSearchLayout';
  return core.jsx("div", _extends({
    className: "".concat(className, " ").concat(prefix, "-").concat(elementName),
    css: cssLayout({
      theme: theme
    })
  }, props), core.jsx(Tabs, {
    activeId: activeView,
    onChange: setActiveView
  }, core.jsx("div", {
    css: cssNavBar({
      theme: theme
    })
  }, core.jsx("div", {
    css: cssFilter({
      theme: theme
    })
  }, core.jsx(FilterBar$1, null)), core.jsx("div", {
    css: cssViews({
      theme: theme
    })
  }, core.jsx(TabList$2, {
    "aria-labelledby": "My tabs"
  }, core.jsx(Tab$2, {
    tabId: "table"
  }, "Table"), core.jsx(Tab$2, {
    tabId: "map"
  }, "Map"), core.jsx(Tab$2, {
    tabId: "gallery"
  }, "Gallery")))), core.jsx(TabPanel$2, {
    lazy: true,
    tabId: "table",
    className: "".concat(prefix, "-").concat(elementName, "-views"),
    css: cssViewArea({
      theme: theme
    })
  }, core.jsx(Table$1, null)), core.jsx(TabPanel$2, {
    lazy: true,
    tabId: "map",
    className: "".concat(prefix, "-").concat(elementName, "-views"),
    css: cssViewArea({
      theme: theme
    })
  }, core.jsx(Map$2, null)), core.jsx(TabPanel$2, {
    lazy: true,
    tabId: "gallery",
    className: "".concat(prefix, "-").concat(elementName, "-views"),
    css: cssViewArea({
      theme: theme
    })
  }, core.jsx(Gallery$2, null)), core.jsx("div", {
    className: "".concat(prefix, "-").concat(elementName, "-footer"),
    css: cssFooter({
      theme: theme
    })
  }, core.jsx("div", null, "Footer content"))));
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


  return core.jsx(Root, null, core.jsx(UncontrollableFilterState, {
    filter: filter,
    onChange: setFilter
  }, core.jsx(Layout$1, props)));
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

var Standalone =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Standalone, _React$Component);

  function Standalone() {
    _classCallCheck(this, Standalone);

    return _possibleConstructorReturn(this, _getPrototypeOf(Standalone).apply(this, arguments));
  }

  _createClass(Standalone, [{
    key: "render",
    value: function render() {
      var style = this.props.style;
      return React__default.createElement(reactIntl.IntlProvider, {
        locale: "en",
        messages: en
      }, React__default.createElement(ThemeContext.Provider, {
        value: lightTheme
      }, React__default.createElement(OccurrenceSearch, {
        style: style
      })));
    }
  }]);

  return Standalone;
}(React__default.Component);

exports.OccurrenceSearch = Standalone;
exports.Root = Root;
