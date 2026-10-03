/* @ds-bundle: {"format":4,"namespace":"WisdomupDesignSystem_ba770b","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"CategoryCircle","sourcePath":"components/commerce/CategoryCircle.jsx"},{"name":"CompactCard","sourcePath":"components/commerce/CompactCard.jsx"},{"name":"GlassCard","sourcePath":"components/commerce/GlassCard.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"PromoTile","sourcePath":"components/commerce/PromoTile.jsx"},{"name":"Ribbon","sourcePath":"components/commerce/Ribbon.jsx"},{"name":"Chip","sourcePath":"components/forms/Chip.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"GradBadge","sourcePath":"components/forms/GradBadge.jsx"},{"name":"LabelChip","sourcePath":"components/forms/LabelChip.jsx"},{"name":"NavyHeading","sourcePath":"components/forms/NavyHeading.jsx"},{"name":"Quote","sourcePath":"components/forms/Quote.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"ProductArt","sourcePath":"components/icons/ProductArt.jsx"},{"name":"ICONS","sourcePath":"components/icons/iconData.js"},{"name":"ART","sourcePath":"components/icons/iconData.js"},{"name":"ART_DEFS","sourcePath":"components/icons/iconData.js"},{"name":"Footer","sourcePath":"components/layout/Footer.jsx"},{"name":"HeroShell","sourcePath":"components/layout/HeroShell.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"SearchOverlay","sourcePath":"components/layout/SearchOverlay.jsx"},{"name":"TrustBar","sourcePath":"components/layout/TrustBar.jsx"},{"name":"Dots","sourcePath":"components/navigation/Dots.jsx"},{"name":"GlassNav","sourcePath":"components/navigation/GlassNav.jsx"},{"name":"ProductRail","sourcePath":"components/navigation/ProductRail.jsx"},{"name":"SectionHeader","sourcePath":"components/navigation/SectionHeader.jsx"},{"name":"UtilityBar","sourcePath":"components/navigation/UtilityBar.jsx"},{"name":"ColorDots","sourcePath":"components/product/ColorDots.jsx"},{"name":"GiftStrip","sourcePath":"components/product/GiftStrip.jsx"},{"name":"OfferBox","sourcePath":"components/product/OfferBox.jsx"},{"name":"ProductGallery","sourcePath":"components/product/ProductGallery.jsx"},{"name":"Stars","sourcePath":"components/product/Stars.jsx"},{"name":"SwatchTiles","sourcePath":"components/product/SwatchTiles.jsx"},{"name":"Thumbs","sourcePath":"components/product/Thumbs.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"695857fcfc1e","components/commerce/CategoryCircle.jsx":"d0504f177f5e","components/commerce/CompactCard.jsx":"0f62d17d70c9","components/commerce/GlassCard.jsx":"afc7d691a351","components/commerce/ProductCard.jsx":"71380ba21e4a","components/commerce/PromoTile.jsx":"e9db5b693542","components/commerce/Ribbon.jsx":"6c585d5fcbfa","components/forms/Chip.jsx":"c15f2811f074","components/forms/Field.jsx":"132ee482688e","components/forms/GradBadge.jsx":"bdccb4d5a6dd","components/forms/LabelChip.jsx":"d547bf274255","components/forms/NavyHeading.jsx":"c823d39693f0","components/forms/Quote.jsx":"de32ee9ef9f7","components/icons/Icon.jsx":"36a36e75545a","components/icons/ProductArt.jsx":"af3895422f49","components/icons/iconData.js":"15708670183a","components/layout/Footer.jsx":"0dff3eef1a72","components/layout/HeroShell.jsx":"79942887bfc2","components/layout/Panel.jsx":"616dde591390","components/layout/SearchOverlay.jsx":"23d7409b3a83","components/layout/TrustBar.jsx":"a80f8048c68c","components/navigation/Dots.jsx":"143b7264d206","components/navigation/GlassNav.jsx":"7ac991fe724c","components/navigation/ProductRail.jsx":"b16a96cdb273","components/navigation/SectionHeader.jsx":"c210d9af4d4f","components/navigation/UtilityBar.jsx":"5dd9f40ce5f5","components/product/ColorDots.jsx":"c3726f4d7363","components/product/GiftStrip.jsx":"79634a171963","components/product/OfferBox.jsx":"c8d1875048cb","components/product/ProductGallery.jsx":"8f90e07786a1","components/product/Stars.jsx":"3e34ee49bcc5","components/product/SwatchTiles.jsx":"85ae86701aea","components/product/Thumbs.jsx":"90d490765581","reference/components.js":"c6ce1ed42f23","ui_kits/storefront/Chrome.jsx":"aabfd8f6d87f","ui_kits/storefront/CollectionScreen.jsx":"c324019a77e2","ui_kits/storefront/CorporateScreen.jsx":"6d09baa912a7","ui_kits/storefront/HomeScreen.jsx":"36fa0efed4a5","ui_kits/storefront/ProductScreen.jsx":"3d8ffd319dd3","ui_kits/storefront/data.js":"64ef66a5109c","website/AccountScreen.jsx":"967053a55785","website/CheckoutScreen.jsx":"bbf752ad376c","website/InfoScreens.jsx":"df15f159f23c","website/SiteChrome.jsx":"b009344d184d","website/SiteCollection.jsx":"3848f9c2c363","website/SiteCorporate.jsx":"35f09aa3889a","website/SiteHome.jsx":"6cf158f4cfab","website/SiteProduct.jsx":"22f79b8eaa73","website/data.js":"7eab1a7d11ff","website/site-data.js":"899eb81994e7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WisdomupDesignSystem_ba770b = window.WisdomupDesignSystem_ba770b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/Ribbon.jsx
try { (() => {
function Ribbon({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "ribbon"
  }, children);
}
Object.assign(__ds_scope, { Ribbon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/Ribbon.jsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.jsx
try { (() => {
function Chip({
  children,
  active = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chip",
    onClick: onClick,
    style: {
      border: 0,
      cursor: onClick ? 'pointer' : 'default',
      ...(active ? {
        background: 'var(--white)',
        boxShadow: 'var(--shadow-soft)'
      } : null)
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  required,
  placeholder,
  value,
  onChange,
  multiline = false,
  type = 'text'
}) {
  const props = {
    placeholder,
    value,
    onChange: e => onChange && onChange(e.target.value)
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, label, required && /*#__PURE__*/React.createElement("i", null, "*")), multiline ? /*#__PURE__*/React.createElement("textarea", props) : /*#__PURE__*/React.createElement("input", _extends({
    type: type
  }, props)));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/GradBadge.jsx
try { (() => {
function GradBadge({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "badge-grad"
  }, children);
}
Object.assign(__ds_scope, { GradBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/GradBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/LabelChip.jsx
try { (() => {
function LabelChip({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "label-chip"
  }, children);
}
Object.assign(__ds_scope, { LabelChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/LabelChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/NavyHeading.jsx
try { (() => {
function NavyHeading({
  children,
  caps = false,
  size,
  as = 'h2',
  style
}) {
  const T = as;
  return /*#__PURE__*/React.createElement(T, {
    className: 'h-navy' + (caps ? ' h-navy--caps' : ''),
    style: {
      ...(size ? {
        fontSize: size
      } : null),
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { NavyHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/NavyHeading.jsx", error: String((e && e.message) || e) }); }

// components/forms/Quote.jsx
try { (() => {
function Quote({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '24px 0',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 0,
      top: -20,
      font: '800 160px/1 var(--font)',
      color: '#EEF1FB'
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 0,
      bottom: -90,
      font: '800 160px/1 var(--font)',
      color: '#EEF1FB'
    }
  }, "\u201D"), /*#__PURE__*/React.createElement("p", {
    className: "quote",
    style: {
      position: 'relative',
      margin: 0
    }
  }, children));
}
Object.assign(__ds_scope, { Quote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Quote.jsx", error: String((e && e.message) || e) }); }

// components/icons/iconData.js
try { (() => {
// Generated from the source component sheet (reference/component-sheet.html). Do not hand-edit.
const ICONS = {
  "buds": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><circle cx=\"7.5\" cy=\"7\" r=\"3.2\"/><path d=\"M9.5 9.5v9\"/><circle cx=\"16.5\" cy=\"7\" r=\"3.2\"/><path d=\"M14.5 9.5v9\"/></g>"
  },
  "phones": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><path d=\"M3.5 15v-3a8.5 8.5 0 0 1 17 0v3\"/><rect x=\"2.5\" y=\"14\" width=\"5\" height=\"7\" rx=\"2\"/><rect x=\"16.5\" y=\"14\" width=\"5\" height=\"7\" rx=\"2\"/></g>"
  },
  "speaker": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><rect x=\"5\" y=\"2.5\" width=\"14\" height=\"19\" rx=\"3\"/><circle cx=\"12\" cy=\"14.5\" r=\"3.5\"/><circle cx=\"12\" cy=\"7\" r=\"1.4\"/></g>"
  },
  "watch": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"3.5\"/><path d=\"M9 6l1-3.5h4L15 6M9 18l1 3.5h4l1-3.5\"/></g>"
  },
  "bank": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"2.5\" width=\"12\" height=\"19\" rx=\"2.5\"/><path d=\"M13 7l-3 5h4l-3 5\"/></g>"
  },
  "plug": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><rect x=\"6\" y=\"8\" width=\"12\" height=\"13\" rx=\"2.5\"/><path d=\"M9.5 8V3M14.5 8V3\"/></g>"
  },
  "cable": {
    "vb": "0 0 24 24",
    "inner": "<path d=\"M3 7h11a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/>"
  },
  "mic": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><rect x=\"9\" y=\"2.5\" width=\"6\" height=\"12\" rx=\"3\"/><path d=\"M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21.5\"/></g>"
  },
  "grid": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/></g>"
  },
  "search": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><circle cx=\"11\" cy=\"11\" r=\"6.5\"/><path d=\"M16 16l4.5 4.5\"/></g>"
  },
  "user": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"8\" r=\"3.8\"/><path d=\"M4.5 21a7.5 7.5 0 0 1 15 0\"/></g>"
  },
  "bag": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"><path d=\"M5 8h14l-1 13H6z\"/><path d=\"M9 8V6a3 3 0 0 1 6 0v2\"/></g>"
  },
  "cart": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"currentColor\"><path d=\"M2 3.5h3l2.6 11.2h10.6L21 7H7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"9.5\" cy=\"19.5\" r=\"1.7\"/><circle cx=\"17\" cy=\"19.5\" r=\"1.7\"/></g>"
  },
  "truck": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"#3b3b3b\" stroke-width=\"1.4\"><rect x=\"2\" y=\"6\" width=\"12\" height=\"10\" rx=\"1\"/><path d=\"M14 9h4l3 3v4h-7z\"/><circle cx=\"6\" cy=\"17.5\" r=\"1.8\" fill=\"#fff\"/><circle cx=\"17\" cy=\"17.5\" r=\"1.8\" fill=\"#fff\"/></g>"
  },
  "medal": {
    "vb": "0 0 24 24",
    "inner": "<path d=\"M8 14l-2 8 6-3 6 3-2-8\" fill=\"#3558B8\"/><circle cx=\"12\" cy=\"9\" r=\"7\" fill=\"#F0573C\"/><circle cx=\"12\" cy=\"9\" r=\"4\" fill=\"#F5C444\"/>"
  },
  "shield": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"#222\" stroke-width=\"1.5\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 10h8l-4 6z\" stroke=\"#35B9C4\"/></g>"
  },
  "smile": {
    "vb": "0 0 24 24",
    "inner": "<g fill=\"none\" stroke=\"#222\" stroke-width=\"1.4\"><circle cx=\"12\" cy=\"9\" r=\"3.5\" fill=\"#F3A33A\"/><path d=\"M5 20c1-4 4-6 7-6s6 2 7 6\"/></g><g fill=\"#F5C444\"><circle cx=\"5\" cy=\"4\" r=\"1.3\"/><circle cx=\"19\" cy=\"4\" r=\"1.3\"/><circle cx=\"12\" cy=\"2\" r=\"1.3\"/></g>"
  },
  "chev-l": {
    "vb": "0 0 24 24",
    "inner": "<path d=\"M15 4l-8 8 8 8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
  },
  "chev-r": {
    "vb": "0 0 24 24",
    "inner": "<path d=\"M9 4l8 8-8 8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
  },
  "arrow": {
    "vb": "0 0 24 24",
    "inner": "<path d=\"M5 12h14M13 6l6 6-6 6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"
  }
};
const ART = {
  "buds": {
    "vb": "0 0 220 180",
    "inner": "<path d=\"M36 86 C36 62 184 62 184 86 L184 118 C184 158 36 158 36 118 Z\" fill=\"url(#gDark)\"/><path d=\"M40 90 C60 76 160 76 180 90\" stroke=\"url(#gGold)\" stroke-width=\"4\" fill=\"none\"/><rect x=\"74\" y=\"20\" width=\"22\" height=\"78\" rx=\"11\" fill=\"url(#gGold)\" transform=\"rotate(-14 85 60)\"/><rect x=\"124\" y=\"20\" width=\"22\" height=\"78\" rx=\"11\" fill=\"url(#gGold)\" transform=\"rotate(14 135 60)\"/><circle cx=\"80\" cy=\"30\" r=\"17\" fill=\"#1b1b1b\"/><circle cx=\"140\" cy=\"30\" r=\"17\" fill=\"#1b1b1b\"/><circle cx=\"100\" cy=\"140\" r=\"3\" fill=\"#fff\" opacity=\".85\"/><circle cx=\"110\" cy=\"140\" r=\"3\" fill=\"#fff\" opacity=\".85\"/><circle cx=\"120\" cy=\"140\" r=\"3\" fill=\"#fff\" opacity=\".85\"/>"
  },
  "bank": {
    "vb": "0 0 220 180",
    "inner": "<g transform=\"rotate(-24 110 90)\"><rect x=\"52\" y=\"30\" width=\"116\" height=\"130\" rx=\"18\" fill=\"url(#gBlue)\"/><rect x=\"66\" y=\"42\" width=\"60\" height=\"22\" rx=\"6\" fill=\"#0d1526\"/><text x=\"78\" y=\"58\" font-size=\"12\" fill=\"#9fe\" font-family=\"monospace\">100%</text></g><path d=\"M160 70 C200 60 212 110 180 118\" stroke=\"#3B67C9\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/>"
  },
  "watch": {
    "vb": "0 0 220 180",
    "inner": "<rect x=\"84\" y=\"0\" width=\"52\" height=\"60\" rx=\"10\" fill=\"url(#gTan)\"/><rect x=\"84\" y=\"120\" width=\"52\" height=\"60\" rx=\"10\" fill=\"url(#gTan)\"/><circle cx=\"110\" cy=\"90\" r=\"58\" fill=\"url(#gSteel)\"/><circle cx=\"110\" cy=\"90\" r=\"49\" fill=\"#0f1110\"/><text x=\"110\" y=\"84\" text-anchor=\"middle\" font-size=\"26\" font-weight=\"700\" fill=\"#fff\" font-family=\"Arial\">10</text><text x=\"110\" y=\"116\" text-anchor=\"middle\" font-size=\"32\" font-weight=\"800\" fill=\"#6BE35A\" font-family=\"Arial\">08</text><rect x=\"166\" y=\"78\" width=\"8\" height=\"24\" rx=\"3\" fill=\"#777\"/>"
  },
  "phones": {
    "vb": "0 0 220 180",
    "inner": "<path d=\"M52 110 C52 20 168 20 168 110\" stroke=\"#2a2a2a\" stroke-width=\"14\" fill=\"none\" stroke-linecap=\"round\"/><rect x=\"30\" y=\"92\" width=\"46\" height=\"72\" rx=\"22\" fill=\"url(#gDark)\"/><rect x=\"144\" y=\"92\" width=\"46\" height=\"72\" rx=\"22\" fill=\"url(#gDark)\"/>"
  },
  "speaker": {
    "vb": "0 0 220 180",
    "inner": "<rect x=\"56\" y=\"24\" width=\"108\" height=\"140\" rx=\"22\" fill=\"url(#gDark)\"/><circle cx=\"110\" cy=\"112\" r=\"34\" fill=\"#222\" stroke=\"#555\" stroke-width=\"3\"/><circle cx=\"110\" cy=\"112\" r=\"12\" fill=\"#3a3a3a\"/><circle cx=\"110\" cy=\"54\" r=\"14\" fill=\"#222\" stroke=\"#555\" stroke-width=\"2\"/>"
  },
  "bank-ice": {
    "vb": "0 0 220 180",
    "inner": "<g transform=\"rotate(-18 110 90)\"><rect x=\"56\" y=\"28\" width=\"108\" height=\"132\" rx=\"26\" fill=\"url(#gIce)\" stroke=\"#fff\" stroke-width=\"2\"/><rect x=\"92\" y=\"44\" width=\"36\" height=\"12\" rx=\"6\" fill=\"#9DB6D2\"/></g>"
  }
};
const ART_DEFS = "<linearGradient id=\"gDark\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4a4a4a\"/><stop offset=\"1\" stop-color=\"#121212\"/></linearGradient><linearGradient id=\"gBlue\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#5E86D6\"/><stop offset=\"1\" stop-color=\"#23407E\"/></linearGradient><linearGradient id=\"gIce\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#F4F8FC\"/><stop offset=\"1\" stop-color=\"#B8CDE4\"/></linearGradient><linearGradient id=\"gGold\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#8C6A2A\"/><stop offset=\".5\" stop-color=\"#F0D885\"/><stop offset=\"1\" stop-color=\"#A2813A\"/></linearGradient><linearGradient id=\"gSteel\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#EDEDED\"/><stop offset=\"1\" stop-color=\"#8F9396\"/></linearGradient><linearGradient id=\"gTan\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#C98B52\"/><stop offset=\"1\" stop-color=\"#8A552B\"/></linearGradient>";
Object.assign(__ds_scope, { ICONS, ART, ART_DEFS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/iconData.js", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 24,
  className,
  style,
  title
}) {
  const ic = __ds_scope.ICONS[name];
  if (!ic) return null;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: ic.vb,
    width: size,
    height: size,
    className: className,
    style: {
      flex: 'none',
      ...style
    },
    role: title ? 'img' : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    dangerouslySetInnerHTML: {
      __html: ic.inner
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
const CLS = {
  card: 'btn-card',
  buy: 'btn-buy',
  cart: 'btn-cart',
  pill: 'btn-pill'
};
const ICON_SIZE = {
  card: 18,
  buy: 30,
  pill: 18
};
function Button({
  variant = 'card',
  icon,
  children,
  onClick,
  disabled,
  type = 'button',
  style,
  className = ''
}) {
  const ic = icon === undefined ? variant === 'card' || variant === 'buy' ? 'cart' : null : icon;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    className: CLS[variant] + ' ' + className,
    onClick: onClick,
    disabled: disabled,
    style: {
      ...(disabled ? {
        opacity: .45,
        cursor: 'not-allowed',
        filter: 'none'
      } : null),
      ...style
    }
  }, variant === 'cart' ? /*#__PURE__*/React.createElement("span", {
    className: "plus"
  }, "+") : ic ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: ICON_SIZE[variant]
  }) : null, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/icons/ProductArt.jsx
try { (() => {
function ProductArt({
  name = 'buds',
  src,
  alt = '',
  className,
  style
}) {
  const uid = 'pa' + React.useId().replace(/[^a-zA-Z0-9]/g, '');
  if (src) return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    className: className,
    style: {
      objectFit: 'contain',
      ...style
    }
  });
  const a = __ds_scope.ART[name] || __ds_scope.ART.buds;
  const defs = __ds_scope.ART_DEFS.replace(/id="(g\w+)"/g, 'id="' + uid + '$1"');
  const inner = a.inner.replace(/url\(#(g\w+)\)/g, 'url(#' + uid + '$1)');
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: a.vb,
    role: "img",
    "aria-label": alt || name,
    className: className,
    style: style,
    dangerouslySetInnerHTML: {
      __html: '<defs>' + defs + '</defs>' + inner
    }
  });
}
Object.assign(__ds_scope, { ProductArt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/ProductArt.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CategoryCircle.jsx
try { (() => {
function CategoryCircle({
  label,
  art = 'buds',
  src,
  onClick
}) {
  return /*#__PURE__*/React.createElement("a", {
    className: "cat",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClick && onClick();
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "cat__ring"
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: art,
    src: src,
    alt: "",
    style: {
      position: 'absolute',
      left: '50%',
      top: '44%',
      width: '118%',
      translate: '-50% -50%'
    }
  })), label);
}
Object.assign(__ds_scope, { CategoryCircle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CategoryCircle.jsx", error: String((e && e.message) || e) }); }

// components/commerce/CompactCard.jsx
try { (() => {
function CompactCard({
  title,
  meta,
  price,
  was,
  tag,
  art = 'buds',
  src,
  mediaBg = '#222',
  onClick
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "ccard",
    onClick: onClick,
    style: {
      cursor: onClick ? 'pointer' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccard__media",
    style: {
      background: mediaBg
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: art,
    src: src,
    alt: title,
    style: {
      width: '100%',
      height: '100%'
    }
  }), tag && /*#__PURE__*/React.createElement("div", {
    className: "ccard__tag"
  }, /*#__PURE__*/React.createElement("span", null, tag))), /*#__PURE__*/React.createElement("div", {
    className: "ccard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccard__title"
  }, title), meta && /*#__PURE__*/React.createElement("p", {
    className: "ccard__meta"
  }, meta)), /*#__PURE__*/React.createElement("div", {
    className: "ccard__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ccard__price"
  }, price), was && /*#__PURE__*/React.createElement("s", {
    className: "ccard__was"
  }, was)));
}
Object.assign(__ds_scope, { CompactCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/CompactCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/GlassCard.jsx
try { (() => {
function roundedPolygon(pts, r) {
  const n = pts.length;
  let d = '';
  const unit = (q, p) => {
    const dx = q[0] - p[0],
      dy = q[1] - p[1],
      l = Math.hypot(dx, dy);
    return [dx / l, dy / l];
  };
  const dist = (q, p) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      a = pts[(i - 1 + n) % n],
      b = pts[(i + 1) % n];
    const u = unit(a, p),
      v = unit(b, p);
    const ra = Math.min(r, dist(a, p) / 2),
      rb = Math.min(r, dist(b, p) / 2);
    const s = [p[0] + u[0] * ra, p[1] + u[1] * ra],
      e = [p[0] + v[0] * rb, p[1] + v[1] * rb];
    d += (i ? 'L' : 'M') + s[0] + ',' + s[1] + ' Q' + p[0] + ',' + p[1] + ' ' + e[0] + ',' + e[1] + ' ';
  }
  return d + 'Z';
}
function GlassCard({
  label,
  art = 'buds',
  src,
  slant = 15,
  radius = 18,
  onClick
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const draw = () => {
      const w = el.offsetWidth,
        h = el.offsetHeight;
      if (!w || !h) return;
      const drop = Math.tan(slant * Math.PI / 180) * w;
      el.style.clipPath = "path('" + roundedPolygon([[0, 0], [w, drop], [w, h], [0, h]], radius) + "')";
    };
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    draw();
    return () => ro.disconnect();
  }, [slant, radius]);
  return /*#__PURE__*/React.createElement("div", {
    className: "gcard-wrap",
    onClick: onClick,
    style: {
      cursor: onClick ? 'pointer' : undefined
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: art,
    src: src,
    alt: "",
    style: {
      position: 'absolute',
      top: 0,
      left: '50%',
      translate: '-50% 0',
      height: 150,
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "gcard",
    ref: ref
  }, label));
}
Object.assign(__ds_scope, { GlassCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/GlassCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/PromoTile.jsx
try { (() => {
function PromoTile({
  kicker,
  name,
  chips = [],
  art = 'buds',
  src,
  background = 'linear-gradient(120deg,#1b1b1b,#050505)',
  onClick
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "promo",
    onClick: onClick,
    style: {
      background,
      cursor: onClick ? 'pointer' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "promo__inner"
  }, kicker && /*#__PURE__*/React.createElement("span", {
    className: "promo__kicker"
  }, /*#__PURE__*/React.createElement("span", null, kicker)), /*#__PURE__*/React.createElement("div", {
    className: "promo__name"
  }, name), /*#__PURE__*/React.createElement("div", {
    className: "promo__chips"
  }, chips.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "promo__chip"
  }, c)))), /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: art,
    src: src,
    alt: name,
    className: "promo__img"
  }));
}
Object.assign(__ds_scope, { PromoTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/PromoTile.jsx", error: String((e && e.message) || e) }); }

// components/layout/Footer.jsx
try { (() => {
function Footer({
  columns = [],
  logoSrc,
  brand = 'WISDOMUP',
  helpText = "We're here to help.",
  contact,
  newsletterText = 'Get exclusive offers and updates.',
  copyright,
  subRight
}) {
  const [email, setEmail] = React.useState('');
  const [done, setDone] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("h4", null, c.title), c.links.map((l, k) => /*#__PURE__*/React.createElement("a", {
    key: k,
    href: "#",
    onClick: e => e.preventDefault()
  }, l)))), /*#__PURE__*/React.createElement("div", null, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: brand,
    style: {
      height: 40,
      display: 'block',
      marginBottom: 20
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 20,
      font: '800 22px/1 var(--font)',
      letterSpacing: '.08em'
    }
  }, brand), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      font: '400 13px var(--font)'
    }
  }, helpText), contact && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      font: '400 13px var(--font)',
      color: 'var(--navy-link)'
    }
  }, contact), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '22px 0 12px',
      font: '400 13px var(--font)'
    }
  }, done ? 'Thanks — you’re on the list.' : newsletterText), /*#__PURE__*/React.createElement("form", {
    className: "newsletter",
    onSubmit: e => {
      e.preventDefault();
      if (email) setDone(true);
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Email address",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Subscribe",
    type: "submit"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow",
    size: 18
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "subfooter"
  }, /*#__PURE__*/React.createElement("span", null, copyright), /*#__PURE__*/React.createElement("span", null, subRight)));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Footer.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
function Panel({
  children,
  style,
  tone = 'white'
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "panel",
    style: {
      background: tone === 'panel' ? 'var(--panel)' : undefined,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/layout/SearchOverlay.jsx
try { (() => {
function SearchOverlay({
  open = true,
  onClose,
  query = '',
  onQuery,
  label = 'Recently viewed',
  onClear,
  children,
  inline = false
}) {
  if (!open) return null;
  const box = /*#__PURE__*/React.createElement("div", {
    className: "search",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("label", {
    className: "search__field"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 22
  }), /*#__PURE__*/React.createElement("input", {
    autoFocus: !inline,
    placeholder: "Search",
    value: query,
    onChange: e => onQuery && onQuery(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close search",
    style: {
      border: 0,
      background: 'none',
      fontSize: 22,
      color: '#222',
      cursor: 'pointer',
      padding: 0
    }
  }, "\xD7")), label && /*#__PURE__*/React.createElement("div", {
    className: "search__label"
  }, /*#__PURE__*/React.createElement("b", null, label), onClear && /*#__PURE__*/React.createElement("button", {
    onClick: onClear
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    className: "search__grid"
  }, children));
  if (inline) return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: '30px 0',
      background: 'var(--scrim)',
      borderRadius: 'var(--r-panel)',
      display: 'grid',
      placeItems: 'center'
    }
  }, box);
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onClick: onClose,
    style: {
      zIndex: 50
    }
  }, box);
}
Object.assign(__ds_scope, { SearchOverlay });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SearchOverlay.jsx", error: String((e && e.message) || e) }); }

// components/layout/TrustBar.jsx
try { (() => {
function TrustBar({
  title = 'Exceptional Quality Delivered',
  items = []
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "trust",
    "aria-label": "Why shop with us"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "trust__items"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "trust__item"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon,
    size: 36
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'pre-line'
    }
  }, it.label)))));
}
Object.assign(__ds_scope, { TrustBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/TrustBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Dots.jsx
try { (() => {
function Dots({
  count = 4,
  active = 0,
  onChange,
  onLight = false,
  static: isStatic = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: 'dots' + (onLight ? ' on-light-dots' : ''),
    role: "tablist",
    "aria-label": "Slides",
    style: isStatic ? {
      position: 'static',
      ...style
    } : style
  }, Array.from({
    length: count
  }, (_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "dot",
    role: "tab",
    "aria-label": 'Slide ' + (i + 1),
    "aria-selected": i === active,
    onClick: () => onChange && onChange(i),
    style: onLight && i !== active ? {
      background: 'var(--dot-idle-light)'
    } : undefined
  })));
}
Object.assign(__ds_scope, { Dots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Dots.jsx", error: String((e && e.message) || e) }); }

// components/layout/HeroShell.jsx
try { (() => {
const TONES = {
  dark: {
    bg: 'radial-gradient(90% 120% at 70% 40%, #3a3531 0%, #151312 60%, #0d0c0b 100%)',
    color: '#fff',
    cta: '#9FC0FF',
    name: {
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    },
    light: false
  },
  light: {
    bg: 'linear-gradient(180deg, #F7F8F8 0%, #C9CDCD 100%)',
    color: 'var(--ink)',
    cta: '#2350C8',
    name: {},
    light: true
  },
  blue: {
    bg: 'linear-gradient(135deg, #E9F3FC 0%, #9FC7EE 100%)',
    color: '#fff',
    cta: '#2350C8',
    kicker: '#2350C8',
    name: {
      color: '#fff'
    },
    light: true
  }
};
function HeroShell({
  slides = [],
  children,
  autoplay = 4500,
  height = 520,
  onCta
}) {
  const [i, setI] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const n = slides.length;
  React.useEffect(() => {
    if (!autoplay || hover || n < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI(v => (v + 1) % n), autoplay);
    return () => clearInterval(t);
  }, [autoplay, hover, n]);
  const s = slides[i] || {};
  const tone = TONES[s.tone] || TONES.light;
  return /*#__PURE__*/React.createElement("section", {
    className: "shell",
    "aria-roledescription": "carousel",
    style: {
      minHeight: height
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, children, n > 0 && /*#__PURE__*/React.createElement("div", {
    className: "slide",
    style: {
      background: s.background || tone.bg,
      color: tone.color
    }
  }, /*#__PURE__*/React.createElement("div", null, s.kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1 var(--font)',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: tone.kicker
    }
  }, s.kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 ' + (s.nameSize || 76) + 'px/1 var(--font-display)',
      letterSpacing: '.02em',
      margin: '14px 0 22px',
      ...tone.name
    }
  }, s.name), s.specs && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      font: '500 12px/1.3 var(--font)'
    }
  }, s.specs.map((sp, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      whiteSpace: 'pre-line'
    }
  }, sp)))), /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: s.art,
    src: s.src,
    alt: s.name,
    style: {
      width: '100%',
      maxHeight: 330
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onCta && onCta(s, i);
    },
    style: {
      position: 'absolute',
      right: 36,
      bottom: 24,
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      font: '600 17px/1 var(--font)',
      color: tone.cta
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "cart",
    size: 22
  }), s.ctaLabel || 'Shop now')), n > 1 && /*#__PURE__*/React.createElement(__ds_scope.Dots, {
    count: n,
    active: i,
    onChange: setI,
    onLight: tone.light
  }));
}
Object.assign(__ds_scope, { HeroShell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/HeroShell.jsx", error: String((e && e.message) || e) }); }

// components/navigation/GlassNav.jsx
try { (() => {
function GlassNav({
  logoSrc,
  brand = 'WISDOMUP',
  categories = [],
  active = -1,
  onCategory,
  onShopAll,
  onSearch,
  onAccount,
  onBag,
  onLogo,
  bagCount = 0,
  floating = true,
  style
}) {
  const util = (label, name, fn, badge) => /*#__PURE__*/React.createElement("button", {
    className: "navbtn navbtn--util",
    "aria-label": label,
    onClick: fn,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name
  }), badge > 0 && /*#__PURE__*/React.createElement("b", {
    style: {
      position: 'absolute',
      top: 4,
      right: 2,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: 999,
      background: 'var(--accent-red)',
      color: '#fff',
      font: '700 10px/16px var(--font)'
    }
  }, badge));
  return /*#__PURE__*/React.createElement("header", {
    className: "nav",
    style: floating ? style : {
      position: 'relative',
      top: 0,
      left: 0,
      right: 0,
      margin: '0 var(--gutter)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onLogo && onLogo();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: 'none'
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: brand,
    style: {
      height: 34,
      width: 'auto',
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: '800 22px/1 var(--font)',
      letterSpacing: '.08em',
      color: '#fff',
      textShadow: '0 1px 3px rgba(0,0,0,.3)'
    }
  }, brand)), /*#__PURE__*/React.createElement("div", {
    className: "nav__cats"
  }, categories.map((c, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "navbtn",
    "aria-expanded": i === active,
    onClick: () => onCategory && onCategory(c, i)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: c.icon
  }), /*#__PURE__*/React.createElement("span", null, c.label))), /*#__PURE__*/React.createElement("button", {
    className: "navbtn navbtn--all",
    onClick: onShopAll
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "grid"
  }), /*#__PURE__*/React.createElement("span", null, "Shop All")), util('Search', 'search', onSearch), util('Account', 'user', onAccount), util('Bag', 'bag', onBag, bagCount)));
}
Object.assign(__ds_scope, { GlassNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/GlassNav.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ProductRail.jsx
try { (() => {
function ProductRail({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rail",
    style: style
  }, children);
}
Object.assign(__ds_scope, { ProductRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ProductRail.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SectionHeader.jsx
try { (() => {
function SectionHeader({
  title,
  viewAllLabel = 'View All',
  onViewAll,
  centered = false,
  style
}) {
  if (centered) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      margin: '48px 0 16px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title",
    style: {
      fontSize: 18,
      padding: '10px 28px',
      borderRadius: 999,
      backgroundColor: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "grad-text"
  }, title)));
  return /*#__PURE__*/React.createElement("div", {
    className: "sec-head",
    style: {
      margin: '48px var(--gutter) 8px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, title), viewAllLabel && /*#__PURE__*/React.createElement("a", {
    className: "viewall",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onViewAll && onViewAll();
    }
  }, /*#__PURE__*/React.createElement("span", null, viewAllLabel)));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/UtilityBar.jsx
try { (() => {
function UtilityBar({
  links = [],
  onSelect
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "utility",
    "aria-label": "Utility"
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    className: l.tone || undefined,
    onClick: e => {
      e.preventDefault();
      onSelect && onSelect(l, i);
    }
  }, l.label)));
}
Object.assign(__ds_scope, { UtilityBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/UtilityBar.jsx", error: String((e && e.message) || e) }); }

// components/product/ColorDots.jsx
try { (() => {
function ColorDots({
  colors = []
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "swatches"
  }, colors.map((c, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      '--c': c
    }
  })));
}
Object.assign(__ds_scope, { ColorDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ColorDots.jsx", error: String((e && e.message) || e) }); }

// components/product/GiftStrip.jsx
try { (() => {
function GiftStrip({
  price = 'Rs.49',
  label = 'Wrap it with love @',
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "gift",
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: !!checked,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      accentColor: 'var(--focus)',
      width: 16,
      height: 16
    }
  }), /*#__PURE__*/React.createElement("span", null, label, " ", /*#__PURE__*/React.createElement("b", null, price)));
}
Object.assign(__ds_scope, { GiftStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/GiftStrip.jsx", error: String((e && e.message) || e) }); }

// components/product/OfferBox.jsx
try { (() => {
function OfferBox({
  title,
  badge = '%',
  body,
  linkLabel = 'Details ›',
  onLink
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "offer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "offer__head"
  }, title, /*#__PURE__*/React.createElement("span", null, badge)), /*#__PURE__*/React.createElement("div", {
    className: "offer__body"
  }, /*#__PURE__*/React.createElement("span", null, body), linkLabel && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onLink && onLink();
    },
    style: {
      color: 'var(--ink)',
      whiteSpace: 'nowrap',
      marginLeft: 12
    }
  }, linkLabel)));
}
Object.assign(__ds_scope, { OfferBox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/OfferBox.jsx", error: String((e && e.message) || e) }); }

// components/product/Stars.jsx
try { (() => {
function Stars({
  rating = null,
  size = 15
}) {
  const n = rating == null ? 5 : Math.round(rating);
  const rated = rating != null;
  return /*#__PURE__*/React.createElement("span", {
    className: "stars",
    "aria-label": rated ? 'Rated ' + rating + ' of 5' : 'Unrated',
    style: {
      fontSize: size,
      ...(rated ? {
        color: 'var(--star)',
        WebkitTextStroke: 0
      } : null)
    }
  }, '★'.repeat(n));
}
Object.assign(__ds_scope, { Stars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/Stars.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function ProductCard({
  title,
  meta,
  price,
  was,
  ribbon,
  rating = null,
  colors = [],
  art = 'buds',
  src,
  ctaLabel = 'Buy Now',
  onBuy,
  onOpen,
  style
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "pcard",
    style: style
  }, ribbon && /*#__PURE__*/React.createElement(__ds_scope.Ribbon, null, ribbon), /*#__PURE__*/React.createElement("div", {
    className: "pcard__media",
    onClick: onOpen,
    style: {
      cursor: onOpen ? 'pointer' : undefined
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: art,
    src: src,
    alt: title,
    style: {
      width: '100%',
      height: '100%',
      filter: 'var(--shadow-product)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "pcard__body"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "pcard__title",
    onClick: onOpen,
    style: {
      cursor: onOpen ? 'pointer' : undefined
    }
  }, title), meta && /*#__PURE__*/React.createElement("p", {
    className: "pcard__meta"
  }, meta), /*#__PURE__*/React.createElement("div", {
    className: "pcard__row"
  }, /*#__PURE__*/React.createElement(__ds_scope.Stars, {
    rating: rating
  }), /*#__PURE__*/React.createElement(__ds_scope.ColorDots, {
    colors: colors
  })), /*#__PURE__*/React.createElement("div", {
    className: "pcard__foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "price"
  }, price), was && /*#__PURE__*/React.createElement("s", {
    className: "price-was"
  }, was), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "card",
    onClick: onBuy
  }, ctaLabel))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/product/SwatchTiles.jsx
try { (() => {
function SwatchTiles({
  options = [],
  value = 0,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sw-tiles",
    role: "radiogroup"
  }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "sw-tile",
    role: "radio",
    "aria-checked": i === value,
    "aria-label": o.label,
    onClick: () => onChange && onChange(i),
    style: {
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: o.art,
    src: o.src,
    alt: o.label,
    style: {
      width: '80%',
      height: '80%'
    }
  }))));
}
Object.assign(__ds_scope, { SwatchTiles });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/SwatchTiles.jsx", error: String((e && e.message) || e) }); }

// components/product/Thumbs.jsx
try { (() => {
function Thumbs({
  items = [],
  value = 0,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "thumbs",
    style: style
  }, items.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "thumb",
    "aria-current": i === value,
    onClick: () => onChange && onChange(i),
    style: {
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: o.art,
    src: o.src,
    alt: o.label || '',
    style: {
      width: '80%',
      height: '80%'
    }
  }))));
}
Object.assign(__ds_scope, { Thumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/Thumbs.jsx", error: String((e && e.message) || e) }); }

// components/product/ProductGallery.jsx
try { (() => {
function ProductGallery({
  images = [],
  value,
  onChange
}) {
  const [own, setOwn] = React.useState(0);
  const i = value ?? own,
    set = onChange || setOwn,
    n = images.length || 1;
  const cur = images[i] || {};
  return /*#__PURE__*/React.createElement("div", {
    className: "pdp__gallery"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pdp__chev pdp__chev--prev",
    "aria-label": "Previous image",
    onClick: () => set((i - 1 + n) % n)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chev-l",
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    className: "pdp__stage"
  }, /*#__PURE__*/React.createElement(__ds_scope.ProductArt, {
    name: cur.art,
    src: cur.src,
    alt: cur.label || '',
    style: {
      width: '78%',
      maxHeight: '100%'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "pdp__chev pdp__chev--next",
    "aria-label": "Next image",
    onClick: () => set((i + 1) % n)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chev-r",
    size: 30
  })), /*#__PURE__*/React.createElement(__ds_scope.Thumbs, {
    items: images,
    value: i,
    onChange: set
  }));
}
Object.assign(__ds_scope, { ProductGallery });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/product/ProductGallery.jsx", error: String((e && e.message) || e) }); }

// reference/components.js
try { (() => {
// Premium Tech Store — glass-card slant and carousel/pagination helpers.
function roundedPolygon(pts, r) {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[i],
      a = pts[(i - 1 + n) % n],
      b = pts[(i + 1) % n];
    const u = unit(a, p),
      v = unit(b, p);
    const ra = Math.min(r, dist(a, p) / 2),
      rb = Math.min(r, dist(b, p) / 2);
    const s = [p[0] + u[0] * ra, p[1] + u[1] * ra],
      e = [p[0] + v[0] * rb, p[1] + v[1] * rb];
    d += `${i ? "L" : "M"}${s[0]},${s[1]} Q${p[0]},${p[1]} ${e[0]},${e[1]} `;
  }
  return d + "Z";
  function unit(q, p) {
    const dx = q[0] - p[0],
      dy = q[1] - p[1],
      l = Math.hypot(dx, dy);
    return [dx / l, dy / l];
  }
  function dist(q, p) {
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  }
}
function slant(el, deg = 15, r = 18) {
  const draw = () => {
    const w = el.offsetWidth,
      h = el.offsetHeight,
      drop = Math.tan(deg * Math.PI / 180) * w;
    if (!w || !h) return; // hidden (e.g. mega menu closed) — redraws when shown
    el.style.clipPath = `path('${roundedPolygon([[0, 0], [w, drop], [w, h], [0, h]], r)}')`;
  };
  new ResizeObserver(draw).observe(el);
  draw();
}
document.querySelectorAll("[data-slant]").forEach(el => slant(el, +el.dataset.slant || 15));
function carousel(root, ms = 5000) {
  const slides = [...root.querySelectorAll(".slide")],
    dots = [...root.querySelectorAll(".dot")];
  let i = 0,
    t;
  const go = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.toggleAttribute("hidden", k !== i));
    dots.forEach((d, k) => d.setAttribute("aria-selected", k === i));
    root.classList.toggle("on-light", slides[i].dataset.tone === "light");
  };
  const play = () => {
    clearInterval(t);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) t = setInterval(() => go(i + 1), ms);
  };
  dots.forEach((d, k) => d.addEventListener("click", () => {
    go(k);
    play();
  }));
  root.addEventListener("mouseenter", () => clearInterval(t));
  root.addEventListener("mouseleave", play);
  go(0);
  play();
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "reference/components.js", error: String((e && e.message) || e) }); }

// ui_kits/storefront/Chrome.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared chrome: page nav (non-home), mega menu overlay, search overlay, footer.
const WU = window.WisdomupDesignSystem_ba770b;
const LOGO = '../../assets/logo.png';
const LOGO_W = '../../assets/logo-white.png';
function MegaMenu({
  cat,
  onClose,
  onPick
}) {
  const D = window.WU_DATA;
  const subs = D.sub[cat] || [];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 4,
      backdropFilter: 'blur(26px) saturate(140%)',
      WebkitBackdropFilter: 'blur(26px) saturate(140%)',
      background: 'rgba(120,124,124,.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 130,
      width: '26%',
      height: 56,
      borderRadius: '0 999px 999px 0',
      background: 'rgba(255,255,255,.7)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 30,
      font: '600 16px var(--font)',
      color: '#fff',
      textShadow: '0 1px 6px rgba(0,0,0,.35)'
    }
  }, cat), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      left: '29%',
      right: 24,
      top: 100,
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 14
    }
  }, subs.map(([label, art]) => /*#__PURE__*/React.createElement(WU.GlassCard, {
    key: label,
    label: label,
    art: art,
    onClick: () => onPick(cat)
  }))));
}
function PageNav({
  nav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(WU.GlassNav, _extends({
    floating: false,
    logoSrc: LOGO
  }, nav, {
    style: {
      marginBottom: 8
    }
  })));
}
function Search({
  open,
  onClose,
  go
}) {
  const D = window.WU_DATA;
  const [q, setQ] = React.useState('');
  const [recent, setRecent] = React.useState(['gilded', 'halo', 'cyan', 'aura']);
  const bgs = ['radial-gradient(80% 90% at 50% 40%,#e0523a,#8c1c10)', 'radial-gradient(80% 90% at 50% 40%,#5372c9,#101d4a)', 'radial-gradient(80% 90% at 50% 40%,#3f8f86,#0d2a27)', 'radial-gradient(80% 90% at 50% 40%,#6b5a48,#1d1712)'];
  const list = q ? D.products.filter(p => (p.title + p.meta + p.cat).toLowerCase().includes(q.toLowerCase())) : D.products.filter(p => recent.includes(p.id));
  return /*#__PURE__*/React.createElement(WU.SearchOverlay, {
    open: open,
    onClose: onClose,
    query: q,
    onQuery: setQ,
    label: q ? 'Results' : recent.length ? 'Recently viewed' : null,
    onClear: q ? null : () => setRecent([])
  }, list.slice(0, 8).map((p, i) => /*#__PURE__*/React.createElement(WU.CompactCard, {
    key: p.id,
    tag: p.ribbon || p.cat,
    title: p.title.split(' ')[0],
    meta: p.meta,
    price: p.price,
    was: p.was,
    art: p.art,
    mediaBg: bgs[i % 4],
    onClick: () => {
      onClose();
      go('pdp', p.id);
    }
  })), q && !list.length && /*#__PURE__*/React.createElement("p", {
    style: {
      gridColumn: '1/-1',
      color: 'var(--ink-muted)',
      font: '400 15px var(--font)'
    }
  }, "No products match \u201C", q, "\u201D."));
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement(WU.Footer, {
    logoSrc: LOGO_W,
    brand: "Wisdomup",
    columns: window.WU_DATA.footer,
    helpText: "We're here to help.",
    contact: "support@wisdomup.com",
    copyright: "\xA9 Wisdomup Premium Mobile Accessories. All rights reserved.",
    subRight: "Payment partners"
  });
}
Object.assign(window, {
  WU,
  LOGO,
  LOGO_W,
  MegaMenu,
  PageNav,
  Search,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CollectionScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CollectionScreen({
  nav,
  go,
  addToBag,
  cat = 'All',
  setCat
}) {
  const D = window.WU_DATA;
  const [shown, setShown] = React.useState(8);
  const filters = ['All', 'Earbuds', 'Headphones', 'Speakers', 'Smart Watches', 'Power Banks'];
  const list = cat === 'All' ? D.products : D.products.filter(p => p.cat === cat);
  const more = list.length ? Array.from({
    length: shown
  }, (_, i) => list[i % list.length]) : [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    className: "sec-head",
    style: {
      margin: '36px var(--gutter) 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sec-title"
  }, cat === 'All' ? 'All Products' : cat), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font)',
      color: 'var(--ink-meta)'
    }
  }, list.length, " products")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      margin: '20px var(--gutter) 0'
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(WU.Chip, {
    key: f,
    active: f === cat,
    onClick: () => {
      setCat(f);
      setShown(8);
    }
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      columnGap: 22,
      rowGap: 16,
      margin: '0 calc(var(--gutter) + 20px)'
    }
  }, more.map((p, i) => /*#__PURE__*/React.createElement(WU.ProductCard, _extends({
    key: i
  }, p, {
    onBuy: () => addToBag(p),
    onOpen: () => go('pdp', p.id)
  })))), list.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "viewall",
    href: "#",
    onClick: e => {
      e.preventDefault();
      setShown(s => s + 4);
    }
  }, /*#__PURE__*/React.createElement("span", null, "Load more"))), /*#__PURE__*/React.createElement(SiteFooter, null));
}
window.CollectionScreen = CollectionScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CollectionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/CorporateScreen.jsx
try { (() => {
function CorporateScreen({
  nav
}) {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    msg: ''
  });
  const set = k => v => setForm(f => ({
    ...f,
    [k]: v
  }));
  const ok = form.name && form.email && form.phone;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "corp-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WU.LabelChip, null, "Corporate gifting solutions"), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    caps: true,
    style: {
      margin: '16px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Corporate"), " gifting"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-body)',
      lineHeight: 1.6,
      maxWidth: '44ch',
      margin: '0 0 22px'
    }
  }, "Branded gift boxes for teams and clients, with custom sleeves, cards and laser printing."), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: "cart",
    onClick: () => {
      const el = document.getElementById('corp-form');
      if (el) window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 20,
        behavior: 'smooth'
      });
    }
  }, "Order in bulk")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 280,
      borderRadius: 20,
      background: 'linear-gradient(135deg,#F4F4F4,#DADDE0)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: "buds",
    style: {
      width: '60%',
      filter: 'var(--shadow-product)'
    }
  })))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "corp-row"
  }, /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 30
  }, "Why choose us for your ", /*#__PURE__*/React.createElement("strong", null, "corporate gifts?")), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, ['Custom product sleeve', 'Personalized gift box', 'Greeting cards', 'Laser printing'].map(c => /*#__PURE__*/React.createElement(WU.Chip, {
    key: c
  }, c))))), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      scrollMarginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "corp-form"
  }), /*#__PURE__*/React.createElement(WU.GradBadge, null, "% Exclusive discounts"), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 30,
    style: {
      margin: '14px 0 22px'
    }
  }, "Get ", /*#__PURE__*/React.createElement("strong", null, "Exclusive Discount"), " On Your Corporate Orders"), sent ? /*#__PURE__*/React.createElement("p", {
    style: {
      font: '500 16px var(--font)',
      color: 'var(--navy)'
    }
  }, "Thanks, ", form.name.split(' ')[0], " \u2014 our corporate team will reach out within one business day.") : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (ok) setSent(true);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Name",
    required: true,
    placeholder: "Your name",
    value: form.name,
    onChange: set('name')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Email address",
    required: true,
    placeholder: "Your email",
    value: form.email,
    onChange: set('email'),
    type: "email"
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Contact no",
    required: true,
    placeholder: "Contact no",
    value: form.phone,
    onChange: set('phone')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Company name",
    placeholder: "Your company's name",
    value: form.company,
    onChange: set('company')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Message",
    multiline: true,
    placeholder: "Quantities, products, delivery date\u2026",
    value: form.msg,
    onChange: set('msg')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    type: "submit",
    disabled: !ok,
    style: {
      padding: '0 56px'
    }
  }, "Send")))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement(WU.Quote, null, "No more hassle in ", /*#__PURE__*/React.createElement("strong", null, "corporate gifting"), ".")), /*#__PURE__*/React.createElement(SiteFooter, null));
}
window.CorporateScreen = CorporateScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/CorporateScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function HomeScreen({
  nav,
  go,
  addToBag,
  megaCat,
  setMegaCat
}) {
  const D = window.WU_DATA;
  const [best, setBest] = React.useState(0);
  const card = p => /*#__PURE__*/React.createElement(WU.ProductCard, _extends({
    key: p.id
  }, p, {
    onBuy: () => addToBag(p),
    onOpen: () => go('pdp', p.id)
  }));
  const bestSlides = [{
    name: 'FROST',
    kicker: '20,000 mAh power bank',
    art: 'bank-ice',
    bg: 'linear-gradient(135deg,#F4F8FC 0%,#C9DBEF 100%)',
    pid: 'frost'
  }, {
    name: 'HALO',
    kicker: 'Software based headphone',
    art: 'phones',
    bg: 'linear-gradient(180deg,#F7F8F8 0%,#C9CDCD 100%)',
    pid: 'halo'
  }, {
    name: 'GILDED',
    kicker: 'Limited edition earbuds',
    art: 'buds',
    bg: 'linear-gradient(135deg,#FBF4E4 0%,#E8D3A6 100%)',
    pid: 'gilded'
  }];
  const b = bestSlides[best];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WU.UtilityBar, {
    links: D.utility,
    onSelect: l => l.go && go(l.go)
  }), /*#__PURE__*/React.createElement(WU.HeroShell, {
    slides: D.slides,
    autoplay: megaCat ? false : 4500,
    onCta: s => go('pdp', s.pid)
  }, /*#__PURE__*/React.createElement(WU.GlassNav, _extends({
    logoSrc: LOGO
  }, nav, {
    active: D.cats.findIndex(c => c.label === megaCat),
    onCategory: c => setMegaCat(megaCat === c.label ? null : c.label)
  })), megaCat && /*#__PURE__*/React.createElement(MegaMenu, {
    cat: megaCat,
    onClose: () => setMegaCat(null),
    onPick: c => {
      setMegaCat(null);
      go('collection', c);
    }
  })), /*#__PURE__*/React.createElement("nav", {
    className: "cats",
    "aria-label": "Top categories"
  }, [['Audio', 'buds', 'Earbuds'], ['Smart Watches', 'watch', 'Smart Watches'], ['Power Banks', 'bank-ice', 'Power Banks'], ['Headphones', 'phones', 'Headphones'], ['Speakers', 'speaker', 'Speakers']].map(([l, a, c]) => /*#__PURE__*/React.createElement(WU.CategoryCircle, {
    key: l,
    label: l,
    art: a,
    onClick: () => go('collection', c)
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      margin: '0 var(--gutter)',
      height: 130,
      borderRadius: 'var(--r-shell)',
      background: 'linear-gradient(90deg,#151312 0%,#3a3531 100%)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 48px',
      color: '#fff',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: "watch",
    style: {
      position: 'absolute',
      left: 40,
      top: -30,
      height: 170
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px/1 var(--font)',
      letterSpacing: '.16em',
      textTransform: 'uppercase'
    }
  }, "Just launched"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 36px/1 var(--font-display)',
      marginTop: 8,
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "AURA")), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    style: {
      marginLeft: 'auto'
    },
    onClick: () => go('pdp', 'aura')
  }, "Shop now")), /*#__PURE__*/React.createElement(WU.SectionHeader, {
    title: "New Arrivals",
    onViewAll: () => go('collection', 'All')
  }), /*#__PURE__*/React.createElement(WU.ProductRail, null, D.products.slice(0, 6).map(card)), /*#__PURE__*/React.createElement(WU.TrustBar, {
    items: D.trust
  }), /*#__PURE__*/React.createElement("section", {
    className: "promos",
    style: {
      marginTop: 60
    }
  }, /*#__PURE__*/React.createElement(WU.PromoTile, {
    kicker: "Software based earbuds",
    name: "EVOKE",
    chips: ['35 hrs music', 'Dual fit'],
    art: "buds",
    background: "linear-gradient(120deg,#0f2d2a,#050a0a)",
    onClick: () => go('pdp', 'evoke')
  }), /*#__PURE__*/React.createElement(WU.PromoTile, {
    kicker: "10,000 mAh power bank",
    name: "SURGE",
    chips: ['22.5W max', '15W wireless'],
    art: "bank",
    onClick: () => go('pdp', 'cyan')
  }), /*#__PURE__*/React.createElement(WU.PromoTile, {
    kicker: "Software based headphones",
    name: "ORBIT",
    chips: ['25ms latency', 'ANC'],
    art: "phones",
    background: "linear-gradient(120deg,#4a2a18,#a4582a)",
    onClick: () => go('pdp', 'orbit')
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      margin: '56px 0 16px',
      font: '600 13px/1 var(--font)',
      letterSpacing: '.24em',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, "Best seller"), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      margin: '0 var(--gutter)',
      height: 300,
      borderRadius: 'var(--r-panel)',
      background: b.bg,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      padding: '0 64px',
      overflow: 'hidden',
      transition: 'background var(--t-med)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1 var(--font)',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, b.kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 64px/1 var(--font-display)',
      margin: '14px 0 24px',
      color: 'var(--ink)'
    }
  }, b.name), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('pdp', b.pid);
    },
    style: {
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center',
      font: '600 17px/1 var(--font)',
      color: '#2350C8'
    }
  }, /*#__PURE__*/React.createElement(WU.Icon, {
    name: "cart",
    size: 22
  }), "Shop now")), /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: b.art,
    style: {
      maxHeight: 250,
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(WU.Dots, {
    count: bestSlides.length,
    active: best,
    onChange: setBest,
    onLight: true
  })), /*#__PURE__*/React.createElement(WU.SectionHeader, {
    title: "Top Trending",
    onViewAll: () => go('collection', 'All')
  }), /*#__PURE__*/React.createElement(WU.ProductRail, null, D.products.slice(2).concat(D.products.slice(0, 2)).map(card)), /*#__PURE__*/React.createElement(SiteFooter, null));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/ProductScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProductScreen({
  nav,
  go,
  addToBag,
  pid
}) {
  const D = window.WU_DATA;
  const p = D.products.find(x => x.id === pid) || D.products[2];
  const [img, setImg] = React.useState(0);
  const [color, setColor] = React.useState(0);
  const [gift, setGift] = React.useState(false);
  const names = {
    '#222': 'Black',
    '#8A552B': 'Tan',
    '#1c2a44': 'Midnight',
    '#1557C9': 'Cyan',
    '#E9DDC8': 'Cream',
    '#C9A24A': 'Gold',
    '#DCE7F3': 'Ice',
    '#0f2d2a': 'Forest',
    '#a4582a': 'Copper'
  };
  const colors = p.colors.length ? p.colors : ['#222'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("section", {
    className: "pdp"
  }, /*#__PURE__*/React.createElement(WU.ProductGallery, {
    images: [0, 1, 2, 3].map(() => ({
      art: p.art,
      label: p.title
    })),
    value: img,
    onChange: setImg
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdp__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp__sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit'
    },
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }, "Home"), /*#__PURE__*/React.createElement(WU.Icon, {
    name: "chev-r",
    size: 14
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit'
    },
    onClick: e => {
      e.preventDefault();
      go('collection', p.cat);
    }
  }, p.cat), /*#__PURE__*/React.createElement(WU.Icon, {
    name: "chev-r",
    size: 14
  }), p.title.split(' ')[0]), /*#__PURE__*/React.createElement("h1", {
    className: "pdp__title"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "pdp__sub"
  }, p.meta)), /*#__PURE__*/React.createElement("div", {
    className: "pdp__sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp__price"
  }, /*#__PURE__*/React.createElement("b", null, p.price), p.was && /*#__PURE__*/React.createElement("s", null, p.was), /*#__PURE__*/React.createElement("span", {
    className: "rating"
  }, /*#__PURE__*/React.createElement("span", {
    className: "star"
  }, "\u2605"), "4.9 ", /*#__PURE__*/React.createElement("small", null, "(15)"))), /*#__PURE__*/React.createElement("div", {
    className: "opt-label"
  }, "Color: ", /*#__PURE__*/React.createElement("b", null, names[colors[color]] || 'Default')), /*#__PURE__*/React.createElement(WU.SwatchTiles, {
    value: color,
    onChange: setColor,
    options: colors.map(c => ({
      label: names[c] || c,
      art: p.art
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "pdp__sec"
  }, /*#__PURE__*/React.createElement(WU.OfferBox, {
    title: "Get 5% additional discount",
    body: "Express delivery in your city within 3\u20136 hours"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sub-head"
  }, "Gift wrapping ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault()
  }, "Learn more")), /*#__PURE__*/React.createElement(WU.GiftStrip, {
    checked: gift,
    onChange: setGift
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "buy",
    onClick: () => {
      addToBag(p);
    }
  }, "Buy Now"), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "cart",
    onClick: () => addToBag(p)
  }, "Add to cart"))))), /*#__PURE__*/React.createElement(WU.SectionHeader, {
    title: "You may also like",
    onViewAll: () => go('collection', 'All')
  }), /*#__PURE__*/React.createElement(WU.ProductRail, null, D.products.filter(x => x.id !== p.id).map(x => /*#__PURE__*/React.createElement(WU.ProductCard, _extends({
    key: x.id
  }, x, {
    onBuy: () => addToBag(x),
    onOpen: () => go('pdp', x.id)
  })))), /*#__PURE__*/React.createElement(SiteFooter, null));
}
window.ProductScreen = ProductScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/ProductScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/storefront/data.js
try { (() => {
// Demo catalogue for the Wisdomup storefront UI kit. Placeholder art names map to components/icons ProductArt.
window.WU_DATA = {
  cats: [{
    icon: 'buds',
    label: 'Earbuds'
  }, {
    icon: 'phones',
    label: 'Headphones'
  }, {
    icon: 'speaker',
    label: 'Speakers'
  }, {
    icon: 'watch',
    label: 'Smart Watches'
  }, {
    icon: 'bank',
    label: 'Power Banks'
  }, {
    icon: 'plug',
    label: 'Chargers'
  }, {
    icon: 'cable',
    label: 'Cables'
  }, {
    icon: 'mic',
    label: 'Microphones'
  }],
  sub: {
    Earbuds: [['Software Based Earbuds', 'buds'], ['ANC Earbuds', 'phones'], ['ENC Earbuds', 'speaker'], ['Best for Calling', 'bank'], ['Gaming Earbuds', 'buds']],
    Headphones: [['Wireless Headphones', 'phones'], ['ANC Headphones', 'phones'], ['Gaming Headsets', 'phones']],
    Speakers: [['Party Speakers', 'speaker'], ['Portable Speakers', 'speaker']],
    'Smart Watches': [['AMOLED Watches', 'watch'], ['Calling Watches', 'watch'], ['Kids Watches', 'watch']],
    'Power Banks': [['10,000 mAh', 'bank'], ['20,000 mAh', 'bank-ice'], ['Wireless Power Banks', 'bank']],
    Chargers: [['Wall Chargers', 'bank'], ['Car Chargers', 'bank']],
    Cables: [['Type-C Cables', 'bank'], ['Lightning Cables', 'bank']],
    Microphones: [['Wireless Mics', 'speaker'], ['Studio Mics', 'speaker']]
  },
  slides: [{
    tone: 'dark',
    kicker: 'AI powered smartwatch',
    name: 'AURA',
    specs: ['AMOLED\nretina display', '2.5D curved\ndisplay', '1GB\nstorage'],
    art: 'watch',
    pid: 'aura'
  }, {
    tone: 'light',
    kicker: 'The full lineup',
    name: 'ESSENTIALS',
    nameSize: 60,
    art: 'buds',
    pid: 'gilded'
  }, {
    tone: 'blue',
    kicker: 'Best seller',
    name: 'FROST',
    specs: ['20000 mAh · 22.5W max output'],
    art: 'bank-ice',
    pid: 'frost'
  }, {
    tone: 'dark',
    kicker: 'Software based headphones',
    name: 'HALO',
    specs: ['Mood tuned\nsound', 'Dual device\npairing'],
    art: 'phones',
    pid: 'halo'
  }],
  products: [{
    id: 'cyan',
    cat: 'Power Banks',
    ribbon: 'Newly launched',
    title: 'Cyan Powerbank',
    meta: '10,000 mAh | 22.2W Fast Charging | Digital Display',
    price: 'Rs.6,595',
    was: 'Rs.7,995',
    rating: null,
    colors: ['#1557C9'],
    art: 'bank'
  }, {
    id: 'halo',
    cat: 'Headphones',
    ribbon: 'Software based',
    title: 'Halo Headphone',
    meta: 'Mood Tuned Sound | Dual Device | Soft Comfort',
    price: 'Rs.4,995',
    was: 'Rs.8,995',
    rating: 5,
    colors: ['#E9DDC8', '#222'],
    art: 'phones'
  }, {
    id: 'aura',
    cat: 'Smart Watches',
    ribbon: 'Newly launched',
    title: 'Aura Smart Watch',
    meta: 'AMOLED | Always-on Display | 100+ Sports Modes',
    price: 'Rs.14,995',
    was: 'Rs.19,995',
    rating: 5,
    colors: ['#8A552B', '#222', '#1c2a44'],
    art: 'watch'
  }, {
    id: 'gilded',
    cat: 'Earbuds',
    ribbon: 'Limited edition',
    title: 'Gilded Earbuds',
    meta: 'Studio Grade Sound | ENC Quad Mic',
    price: 'Rs.6,995',
    was: 'Rs.8,995',
    rating: 5,
    colors: ['#C9A24A'],
    art: 'buds'
  }, {
    id: 'boom',
    cat: 'Speakers',
    ribbon: 'Newly launched',
    title: 'Boom Box Speaker',
    meta: 'Dual Woofers | Heavy Bass | Wireless Mic',
    price: 'Rs.5,595',
    was: 'Rs.7,995',
    rating: 4,
    colors: ['#222'],
    art: 'speaker'
  }, {
    id: 'frost',
    cat: 'Power Banks',
    title: 'Frost Powerbank',
    meta: '20,000 mAh | 22.5W Max Output | Dual USB-C',
    price: 'Rs.7,495',
    was: 'Rs.9,995',
    rating: 5,
    colors: ['#DCE7F3', '#222'],
    art: 'bank-ice'
  }, {
    id: 'evoke',
    cat: 'Earbuds',
    ribbon: 'Software based',
    title: 'Evoke Earbuds',
    meta: '35 Hrs Music | Dual Fit | ENC',
    price: 'Rs.5,995',
    was: 'Rs.7,495',
    rating: 5,
    colors: ['#0f2d2a', '#222'],
    art: 'buds'
  }, {
    id: 'orbit',
    cat: 'Headphones',
    title: 'Orbit Headphone',
    meta: '25ms Latency | ANC | 60 Hrs Playback',
    price: 'Rs.8,995',
    was: 'Rs.11,995',
    rating: 4,
    colors: ['#a4582a', '#222'],
    art: 'phones'
  }],
  footer: [{
    title: 'Shop',
    links: ['All products', 'Earbuds', 'Headphones', 'Smart watches', 'Power banks']
  }, {
    title: 'Company',
    links: ['About us', 'Customer care', 'Privacy policy', 'Terms of service']
  }, {
    title: 'Care',
    links: ['Track your order', 'Warranty policy', 'Exchange & refunds', 'Shipping policy']
  }],
  utility: [{
    label: 'Anniversary Program',
    tone: 'gold'
  }, {
    label: 'Mega Sale',
    tone: 'green'
  }, {
    label: 'Product Customization'
  }, {
    label: 'Express Delivery'
  }, {
    label: 'Gift Store'
  }, {
    label: 'Corporate Orders',
    go: 'corporate'
  }, {
    label: 'Track Orders'
  }, {
    label: 'Contact Us'
  }],
  trust: [{
    icon: 'truck',
    label: 'Free shipping\nnationwide'
  }, {
    icon: 'smile',
    label: '1M+ satisfied\ncustomers'
  }, {
    icon: 'medal',
    label: '365 days\nwarranty'
  }, {
    icon: 'shield',
    label: 'Certified\nproducts'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/storefront/data.js", error: String((e && e.message) || e) }); }

// website/AccountScreen.jsx
try { (() => {
function AccountScreen({
  nav,
  go,
  user,
  setUser,
  orders
}) {
  const [mode, setMode] = React.useState('Sign in');
  const [tab, setTab] = React.useState('Orders');
  const [f, setF] = React.useState({
    name: '',
    email: '',
    pass: ''
  });
  const [err, setErr] = React.useState('');
  const set = k => v => setF(s => ({
    ...s,
    [k]: v
  }));
  if (!user) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    className: "wu-auth"
  }, /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginBottom: 22
    }
  }, ['Sign in', 'Create account'].map(m => /*#__PURE__*/React.createElement(WU.Chip, {
    key: m,
    active: mode === m,
    onClick: () => {
      setMode(m);
      setErr('');
    }
  }, m))), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 30,
    style: {
      margin: '0 0 20px'
    }
  }, mode === 'Sign in' ? /*#__PURE__*/React.createElement(React.Fragment, null, "Welcome ", /*#__PURE__*/React.createElement("strong", null, "back")) : /*#__PURE__*/React.createElement(React.Fragment, null, "Join ", /*#__PURE__*/React.createElement("strong", null, "Wisdomup"))), /*#__PURE__*/React.createElement("form", {
    style: {
      display: 'grid',
      gap: 14
    },
    onSubmit: e => {
      e.preventDefault();
      if (!f.email || !f.pass || mode !== 'Sign in' && !f.name) return setErr('Please fill in all fields.');
      setUser({
        name: f.name || f.email.split('@')[0],
        email: f.email
      });
    }
  }, mode !== 'Sign in' && /*#__PURE__*/React.createElement(WU.Field, {
    label: "Full name",
    required: true,
    placeholder: "Your name",
    value: f.name,
    onChange: set('name')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Email",
    required: true,
    type: "email",
    placeholder: "you@example.com",
    value: f.email,
    onChange: set('email')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Password",
    required: true,
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: f.pass,
    onChange: set('pass')
  }), err && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: '#D0312D',
      font: '500 14px var(--font)'
    }
  }, err), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    type: "submit",
    style: {
      padding: '0 48px'
    }
  }, mode)))), /*#__PURE__*/React.createElement("div", {
    className: "wu-auth__art"
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: "phones",
    style: {
      width: '70%',
      filter: 'var(--shadow-product)'
    }
  }), /*#__PURE__*/React.createElement("p", null, "Track orders, save addresses and claim warranty in one place."))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    kicker: "My account",
    title: 'Hi, ' + user.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      margin: '0 var(--gutter) 20px'
    }
  }, ['Orders', 'Profile', 'Warranty'].map(t => /*#__PURE__*/React.createElement(WU.Chip, {
    key: t,
    active: tab === t,
    onClick: () => setTab(t)
  }, t)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-link",
    style: {
      marginLeft: 'auto'
    },
    onClick: () => setUser(null)
  }, "Sign out")), tab === 'Orders' && (orders.length ? orders.map(o => /*#__PURE__*/React.createElement(WU.Panel, {
    key: o.no
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      font: '600 16px var(--font)',
      color: 'var(--ink)'
    }
  }, o.no), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-meta)',
      marginLeft: 12,
      font: '400 14px var(--font)'
    }
  }, o.date, " \xB7 ", fmtRs(o.total))), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "cart",
    onClick: () => go('track', o.no)
  }, "Track")), o.items.map((it, i) => /*#__PURE__*/React.createElement(LineItem, {
    key: i,
    item: it,
    compact: true
  })))) : /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--ink-muted)'
    }
  }, "No orders yet. ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-link",
    onClick: () => go('collection', 'All')
  }, "Start shopping")))), tab === 'Profile' && /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "wu-form2",
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Name",
    value: user.name,
    onChange: v => setUser({
      ...user,
      name: v
    })
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Email",
    value: user.email,
    onChange: v => setUser({
      ...user,
      email: v
    })
  }))), tab === 'Warranty' && /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement(WU.OfferBox, {
    title: "365 days warranty on every order",
    body: "Raise a claim with your order number and a short video of the issue.",
    linkLabel: "Warranty policy",
    onLink: () => go('policy', 'warranty')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    onClick: () => go('support')
  }, "Start a claim"))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
window.AccountScreen = AccountScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/AccountScreen.jsx", error: String((e && e.message) || e) }); }

// website/CheckoutScreen.jsx
try { (() => {
function Summary({
  cart,
  subtotal,
  shipping,
  discount,
  children
}) {
  const D = window.WU_DATA;
  const mrp = cart.reduce((n, i) => {
    const p = D.products.find(x => x.id === i.id);
    return n + priceNum(p.was || p.price) * i.qty;
  }, 0);
  const gift = cart.filter(i => i.gift).reduce((n, i) => n + 250 * i.qty, 0);
  const total = subtotal + gift + shipping - discount;
  const row = (k, v, strong) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: (strong ? '700 18px' : '400 15px') + ' var(--font)',
      color: strong ? 'var(--ink)' : 'var(--ink-body)',
      padding: '6px 0'
    }
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("span", null, v));
  return /*#__PURE__*/React.createElement("aside", {
    className: "wu-summary"
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 14px',
      font: '600 18px var(--font)',
      color: 'var(--ink)'
    }
  }, "Order summary"), row('MRP', fmtRs(mrp)), row('Savings', '− ' + fmtRs(mrp - subtotal)), gift > 0 && row('Gift wrapping', fmtRs(gift)), row('Shipping', shipping ? fmtRs(shipping) : 'Free'), discount > 0 && row('Online payment (5%)', '− ' + fmtRs(discount)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--line)',
      margin: '10px 0 4px'
    }
  }), row('Total', fmtRs(total), true), children);
}
function CartScreen({
  nav,
  go,
  cart,
  setQty,
  remove,
  subtotal
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: "Your Bag"
  }), cart.length ? /*#__PURE__*/React.createElement("div", {
    className: "wu-checkout"
  }, /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      margin: 0
    }
  }, cart.map((it, i) => /*#__PURE__*/React.createElement(LineItem, {
    key: i,
    item: it,
    onQty: q => setQty(i, q),
    onRemove: () => remove(i)
  }))), /*#__PURE__*/React.createElement(Summary, {
    cart: cart,
    subtotal: subtotal,
    shipping: 0,
    discount: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "buy",
    style: {
      width: '100%'
    },
    onClick: () => go('checkout')
  }, "Checkout")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-link",
    style: {
      marginTop: 14
    },
    onClick: () => go('collection', 'All')
  }, "Continue shopping"))) : /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--ink-muted)'
    }
  }, "Your bag is empty. ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-link",
    onClick: () => go('collection', 'All')
  }, "Shop all products"))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
function CheckoutScreen({
  nav,
  go,
  cart,
  subtotal,
  placeOrder,
  user
}) {
  const [f, setF] = React.useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    postcode: ''
  });
  const [ship, setShip] = React.useState('Standard');
  const [pay, setPay] = React.useState('Card');
  const [tried, setTried] = React.useState(false);
  const set = k => v => setF(s => ({
    ...s,
    [k]: v
  }));
  const shipping = ship === 'Express' ? 350 : 0;
  const discount = pay === 'Cash on delivery' ? 0 : Math.round(subtotal * 0.05);
  const ok = f.name && f.phone && f.address && f.city;
  if (!cart.length) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: "Checkout"
  }, "Your bag is empty."), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    onClick: () => go('collection', 'All')
  }, "Shop all")), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
  const step = (n, t) => /*#__PURE__*/React.createElement("h2", {
    className: "wu-step"
  }, /*#__PURE__*/React.createElement("span", null, n), t);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: "Checkout"
  }), /*#__PURE__*/React.createElement("form", {
    className: "wu-checkout",
    onSubmit: e => {
      e.preventDefault();
      setTried(true);
      if (ok) placeOrder({
        ...f,
        ship,
        pay,
        shipping,
        discount
      });
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      margin: 0
    }
  }, step(1, 'Contact'), /*#__PURE__*/React.createElement("div", {
    className: "wu-form2"
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Full name",
    required: true,
    placeholder: "Your name",
    value: f.name,
    onChange: set('name')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Phone",
    required: true,
    placeholder: "03XX XXXXXXX",
    value: f.phone,
    onChange: set('phone')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1'
    }
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Email",
    placeholder: "For order updates",
    type: "email",
    value: f.email,
    onChange: set('email')
  })))), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      margin: 0
    }
  }, step(2, 'Delivery address'), /*#__PURE__*/React.createElement("div", {
    className: "wu-form2"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1'
    }
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Address",
    required: true,
    placeholder: "House, street, area",
    value: f.address,
    onChange: set('address')
  })), /*#__PURE__*/React.createElement(WU.Field, {
    label: "City",
    required: true,
    placeholder: "City",
    value: f.city,
    onChange: set('city')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Postcode",
    placeholder: "Optional",
    value: f.postcode,
    onChange: set('postcode')
  })), tried && !ok && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--red, #D0312D)',
      font: '500 14px var(--font)',
      margin: '14px 0 0'
    }
  }, "Please fill in the required fields.")), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      margin: 0
    }
  }, step(3, 'Delivery'), /*#__PURE__*/React.createElement("div", {
    className: "wu-opts"
  }, [['Standard', '2–4 working days', 'Free'], ['Express', 'Within 3–6 hours, selected cities', 'Rs.350']].map(([k, d, p]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "wu-opt",
    "data-on": ship === k ? '' : undefined
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "ship",
    checked: ship === k,
    onChange: () => setShip(k)
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, k), /*#__PURE__*/React.createElement("small", null, d)), /*#__PURE__*/React.createElement("em", null, p))))), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      margin: 0
    }
  }, step(4, 'Payment'), /*#__PURE__*/React.createElement("div", {
    className: "wu-opts"
  }, [['Card', 'Visa, Mastercard · extra 5% off'], ['Wallet', 'Mobile wallets · extra 5% off'], ['Cash on delivery', 'Pay when it arrives']].map(([k, d]) => /*#__PURE__*/React.createElement("label", {
    key: k,
    className: "wu-opt",
    "data-on": pay === k ? '' : undefined
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "pay",
    checked: pay === k,
    onChange: () => setPay(k)
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, k), /*#__PURE__*/React.createElement("small", null, d))))))), /*#__PURE__*/React.createElement(Summary, {
    cart: cart,
    subtotal: subtotal,
    shipping: shipping,
    discount: discount
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '16px 0 4px'
    }
  }, cart.map((it, i) => /*#__PURE__*/React.createElement(LineItem, {
    key: i,
    item: it,
    compact: true
  }))), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "buy",
    type: "submit",
    style: {
      width: '100%'
    }
  }, "Place order"))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
function ConfirmScreen({
  nav,
  go,
  order
}) {
  if (!order) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
      nav: nav
    }), /*#__PURE__*/React.createElement(PageHead, {
      title: "No recent order"
    }), /*#__PURE__*/React.createElement(SiteFooter, {
      go: go
    }));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      textAlign: 'center',
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(WU.GradBadge, null, "Order confirmed"), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 34,
    style: {
      margin: '18px 0 10px'
    }
  }, "Thank you, ", /*#__PURE__*/React.createElement("strong", null, order.name.split(' ')[0])), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-body)',
      margin: '0 auto 6px',
      maxWidth: '46ch',
      lineHeight: 1.6
    }
  }, "Order ", /*#__PURE__*/React.createElement("b", null, order.no), " is confirmed. We'll send tracking details to ", order.phone, order.email ? ' and ' + order.email : '', "."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-meta)',
      margin: '0 0 26px',
      font: '400 14px var(--font)'
    }
  }, order.ship === 'Express' ? 'Arriving within 3–6 hours' : 'Arriving in 2–4 working days', " \xB7 ", order.pay), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    onClick: () => go('track', order.no)
  }, "Track order"), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "cart",
    onClick: () => go('home')
  }, "Continue shopping"))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560,
      margin: '0 auto'
    }
  }, order.items.map((it, i) => /*#__PURE__*/React.createElement(LineItem, {
    key: i,
    item: it,
    compact: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: '700 17px var(--font)',
      paddingTop: 14,
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total paid"), /*#__PURE__*/React.createElement("span", null, fmtRs(order.total))))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
Object.assign(window, {
  CartScreen,
  CheckoutScreen,
  ConfirmScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/CheckoutScreen.jsx", error: String((e && e.message) || e) }); }

// website/InfoScreens.jsx
try { (() => {
function TrackScreen({
  nav,
  go,
  orders,
  initial
}) {
  const [no, setNo] = React.useState(initial || '');
  const [phone, setPhone] = React.useState('');
  const [res, setRes] = React.useState(initial ? {
    no: initial
  } : null);
  const steps = ['Order placed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  const order = res && orders.find(o => o.no.toLowerCase() === res.no.toLowerCase());
  const at = order ? 1 : 2;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: "Track your order"
  }, "Enter the order number from your confirmation message."), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("form", {
    className: "wu-track",
    onSubmit: e => {
      e.preventDefault();
      if (no) setRes({
        no: no.trim()
      });
    }
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Order number",
    required: true,
    placeholder: "WU-100245",
    value: no,
    onChange: setNo
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Phone",
    placeholder: "Used at checkout",
    value: phone,
    onChange: setPhone
  }), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    type: "submit"
  }, "Track"))), res && /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 17px var(--font)',
      color: 'var(--ink)',
      marginBottom: 28
    }
  }, "Order ", res.no.toUpperCase(), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font)',
      color: 'var(--ink-meta)',
      marginLeft: 8
    }
  }, steps[at])), /*#__PURE__*/React.createElement("ol", {
    className: "wu-timeline"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    "data-done": i <= at ? '' : undefined,
    "data-now": i === at ? '' : undefined
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, s)))), order && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      maxWidth: 560
    }
  }, order.items.map((it, i) => /*#__PURE__*/React.createElement(LineItem, {
    key: i,
    item: it,
    compact: true
  })))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
function SupportScreen({
  nav,
  go
}) {
  const D = window.WU_DATA;
  const [open, setOpen] = React.useState(0);
  const [f, setF] = React.useState({
    name: '',
    email: '',
    topic: 'Order',
    msg: ''
  });
  const [sent, setSent] = React.useState(false);
  const set = k => v => setF(s => ({
    ...s,
    [k]: v
  }));
  const tiles = [['truck', 'Track an order', () => go('track')], ['medal', 'Warranty claim', () => {
    set('topic')('Warranty');
    window.scrollTo({
      top: document.getElementById('wu-contact').offsetTop - 20,
      behavior: 'smooth'
    });
  }], ['shield', 'Exchange & refunds', () => go('policy', 'exchange')], ['smile', 'Corporate orders', () => go('corporate')]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    kicker: "Customer care",
    title: "How can we help?"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wu-tiles"
  }, tiles.map(([ic, l, fn]) => /*#__PURE__*/React.createElement("button", {
    key: l,
    type: "button",
    className: "wu-tile",
    onClick: fn
  }, /*#__PURE__*/React.createElement(WU.Icon, {
    name: ic,
    size: 30
  }), /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement(WU.Icon, {
    name: "chev-r",
    size: 16
  })))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 28,
    style: {
      margin: '0 0 12px'
    }
  }, "Frequently asked ", /*#__PURE__*/React.createElement("strong", null, "questions")), /*#__PURE__*/React.createElement("div", {
    className: "wu-faq"
  }, D.faqs.map(([q, a], i) => /*#__PURE__*/React.createElement("div", {
    key: q,
    "data-open": open === i ? '' : undefined
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setOpen(open === i ? -1 : i),
    "aria-expanded": open === i
  }, q, /*#__PURE__*/React.createElement("span", null, open === i ? '−' : '+')), open === i && /*#__PURE__*/React.createElement("p", null, a))))), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      scrollMarginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "wu-contact",
    className: "corp-row",
    style: {
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 28,
    style: {
      margin: '0 0 18px'
    }
  }, "Write to ", /*#__PURE__*/React.createElement("strong", null, "us")), sent ? /*#__PURE__*/React.createElement("p", {
    style: {
      font: '500 16px var(--font)',
      color: 'var(--navy)'
    }
  }, "Thanks", f.name ? ', ' + f.name.split(' ')[0] : '', " \u2014 we reply within one working day.") : /*#__PURE__*/React.createElement("form", {
    style: {
      display: 'grid',
      gap: 14
    },
    onSubmit: e => {
      e.preventDefault();
      if (f.email && f.msg) setSent(true);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wu-form2"
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Name",
    placeholder: "Your name",
    value: f.name,
    onChange: set('name')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Email",
    required: true,
    type: "email",
    placeholder: "Your email",
    value: f.email,
    onChange: set('email')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['Order', 'Warranty', 'Exchange', 'Other'].map(t => /*#__PURE__*/React.createElement(WU.Chip, {
    key: t,
    active: f.topic === t,
    onClick: () => set('topic')(t)
  }, t))), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Message",
    required: true,
    multiline: true,
    placeholder: f.topic === 'Warranty' ? 'Order number and what went wrong' : 'How can we help?',
    value: f.msg,
    onChange: set('msg')
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    type: "submit",
    disabled: !f.email || !f.msg,
    style: {
      padding: '0 56px'
    }
  }, "Send")))), /*#__PURE__*/React.createElement("div", {
    className: "wu-contact"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Email"), /*#__PURE__*/React.createElement("span", null, "support@wisdomup.com")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Hours"), /*#__PURE__*/React.createElement("span", null, "Mon\u2013Sat, 10 am \u2013 7 pm")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Response time"), /*#__PURE__*/React.createElement("span", null, "Within one working day"))))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
function AboutScreen({
  nav,
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "corp-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WU.LabelChip, null, "About Wisdomup"), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    caps: true,
    style: {
      margin: '16px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Premium"), " made everyday"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-body)',
      lineHeight: 1.6,
      maxWidth: '46ch',
      margin: '0 0 22px',
      textWrap: 'pretty'
    }
  }, "Wisdomup designs mobile accessories \u2014 audio, wearables and power \u2014 that look and feel premium without the premium price."), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: "cart",
    onClick: () => go('collection', 'All')
  }, "Shop the range")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 280,
      borderRadius: 20,
      background: 'linear-gradient(135deg,#F4F4F4,#DADDE0)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: "watch",
    style: {
      width: '46%',
      filter: 'var(--shadow-product)'
    }
  })))), /*#__PURE__*/React.createElement(WU.TrustBar, {
    items: window.WU_DATA.trust
  }), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "wu-values"
  }, [['Designed in-house', 'Every product is tuned and styled by our own team.'], ['Tested to last', 'Each batch is checked before it ships, backed by a 365-day warranty.'], ['Care that answers', 'Real people on support, replying within one working day.']].map(([t, b]) => /*#__PURE__*/React.createElement("div", {
    key: t
  }, /*#__PURE__*/React.createElement("h3", null, t), /*#__PURE__*/React.createElement("p", null, b))))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement(WU.Quote, null, "Accessories that feel ", /*#__PURE__*/React.createElement("strong", null, "premium"), ", every day.")), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
function PolicyScreen({
  nav,
  go,
  which
}) {
  const P = window.WU_DATA.policies;
  const key = P[which] ? which : 'shipping';
  const doc = P[key];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: doc.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      margin: '0 var(--gutter) 20px'
    }
  }, Object.entries(P).map(([k, v]) => /*#__PURE__*/React.createElement(WU.Chip, {
    key: k,
    active: k === key,
    onClick: () => go('policy', k)
  }, v.title))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "wu-policy"
  }, doc.body.map(([h, t]) => /*#__PURE__*/React.createElement("section", {
    key: h
  }, /*#__PURE__*/React.createElement("h2", null, h), /*#__PURE__*/React.createElement("p", null, t)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '28px 0 0',
      font: '400 14px var(--font)',
      color: 'var(--ink-meta)'
    }
  }, "Questions? ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-link",
    onClick: () => go('support')
  }, "Contact customer care"))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
Object.assign(window, {
  TrackScreen,
  SupportScreen,
  AboutScreen,
  PolicyScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/InfoScreens.jsx", error: String((e && e.message) || e) }); }

// website/SiteChrome.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared chrome: page nav, mega menu, search, footer (routed), bag drawer, page header, qty stepper.
const WU = window.WisdomupDesignSystem_ba770b;
const LOGO = '../assets/logo.png';
const LOGO_W = '../assets/logo-white.png';
function MegaMenu({
  cat,
  onClose,
  onPick
}) {
  const subs = window.WU_DATA.sub[cat] || [];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 4,
      backdropFilter: 'blur(26px) saturate(140%)',
      WebkitBackdropFilter: 'blur(26px) saturate(140%)',
      background: 'rgba(120,124,124,.18)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 130,
      width: '26%',
      height: 56,
      borderRadius: '0 999px 999px 0',
      background: 'rgba(255,255,255,.7)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 30,
      font: '600 16px var(--font)',
      color: '#fff',
      textShadow: '0 1px 6px rgba(0,0,0,.35)'
    }
  }, cat), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "wu-mega",
    style: {
      position: 'absolute',
      left: '29%',
      right: 24,
      top: 100,
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: 14
    }
  }, subs.map(([label, art]) => /*#__PURE__*/React.createElement(WU.GlassCard, {
    key: label,
    label: label,
    art: art,
    onClick: () => onPick(cat)
  }))));
}
function PageNav({
  nav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(WU.GlassNav, _extends({
    floating: false,
    logoSrc: LOGO
  }, nav, {
    style: {
      marginBottom: 8
    }
  })));
}
function PageHead({
  kicker,
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '36px var(--gutter) 20px'
    }
  }, kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(WU.LabelChip, null, kicker)), /*#__PURE__*/React.createElement("h1", {
    className: "sec-title"
  }, title), children && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      maxWidth: '60ch',
      color: 'var(--ink-body)',
      font: '400 16px/1.6 var(--font)',
      textWrap: 'pretty'
    }
  }, children));
}
function Search({
  open,
  onClose,
  go
}) {
  const D = window.WU_DATA;
  const [q, setQ] = React.useState('');
  const [recent, setRecent] = React.useState(['gilded', 'halo', 'cyan', 'aura']);
  const bgs = ['radial-gradient(80% 90% at 50% 40%,#e0523a,#8c1c10)', 'radial-gradient(80% 90% at 50% 40%,#5372c9,#101d4a)', 'radial-gradient(80% 90% at 50% 40%,#3f8f86,#0d2a27)', 'radial-gradient(80% 90% at 50% 40%,#6b5a48,#1d1712)'];
  const list = q ? D.products.filter(p => (p.title + p.meta + p.cat).toLowerCase().includes(q.toLowerCase())) : D.products.filter(p => recent.includes(p.id));
  return /*#__PURE__*/React.createElement(WU.SearchOverlay, {
    open: open,
    onClose: onClose,
    query: q,
    onQuery: setQ,
    label: q ? 'Results' : recent.length ? 'Recently viewed' : null,
    onClear: q ? null : () => setRecent([])
  }, list.slice(0, 8).map((p, i) => /*#__PURE__*/React.createElement(WU.CompactCard, {
    key: p.id,
    tag: p.ribbon || p.cat,
    title: p.title.split(' ')[0],
    meta: p.meta,
    price: p.price,
    was: p.was,
    art: p.art,
    mediaBg: bgs[i % 4],
    onClick: () => {
      onClose();
      go('pdp', p.id);
    }
  })), q && !list.length && /*#__PURE__*/React.createElement("p", {
    style: {
      gridColumn: '1/-1',
      color: 'var(--ink-muted)',
      font: '400 15px var(--font)'
    }
  }, "No products match \u201C", q, "\u201D."));
}
function SiteFooter({
  go
}) {
  const routes = window.WU_DATA.footerRoutes;
  const onClick = e => {
    const a = e.target.closest('a');
    if (!a || !go) return;
    const r = routes[a.textContent.trim()];
    if (r) {
      e.preventDefault();
      go(r[0], r[1]);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      marginTop: 72
    }
  }, /*#__PURE__*/React.createElement(WU.Footer, {
    logoSrc: LOGO_W,
    brand: "Wisdomup",
    columns: window.WU_DATA.footer,
    helpText: "We're here to help.",
    contact: "support@wisdomup.com",
    copyright: "\xA9 Wisdomup Premium Mobile Accessories. All rights reserved.",
    subRight: "Payment partners"
  }));
}
function Qty({
  value,
  onChange,
  min = 1
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "wu-qty"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Decrease",
    onClick: () => onChange(Math.max(min, value - 1))
  }, "\u2212"), /*#__PURE__*/React.createElement("span", null, value), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Increase",
    onClick: () => onChange(value + 1)
  }, "+"));
}
function LineItem({
  item,
  onQty,
  onRemove,
  compact
}) {
  const p = window.WU_DATA.products.find(x => x.id === item.id);
  if (!p) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "wu-line"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wu-line__art"
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: p.art
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.3 var(--font)',
      color: 'var(--ink)'
    }
  }, p.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px/1.4 var(--font)',
      color: 'var(--ink-meta)',
      marginTop: 4
    }
  }, [item.color, item.gift && 'Gift wrapped'].filter(Boolean).join(' · ')), onQty ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Qty, {
    value: item.qty,
    onChange: onQty
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-link",
    onClick: onRemove
  }, "Remove")) : /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 13px var(--font)',
      color: 'var(--ink-meta)',
      marginTop: 4
    }
  }, "Qty ", item.qty)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      font: '700 15px/1.3 var(--font)',
      color: 'var(--ink)',
      whiteSpace: 'nowrap'
    }
  }, fmtRs(priceNum(p.price) * item.qty), !compact && p.was && /*#__PURE__*/React.createElement("s", {
    style: {
      display: 'block',
      font: '400 13px var(--font)',
      color: 'var(--ink-strike)'
    }
  }, fmtRs(priceNum(p.was) * item.qty))));
}
function BagDrawer({
  open,
  onClose,
  cart,
  setQty,
  remove,
  subtotal,
  go
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "wu-drawer",
    "data-open": open ? '' : undefined,
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "wu-drawer__scrim",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("aside", {
    className: "wu-drawer__panel",
    role: "dialog",
    "aria-label": "Your bag"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 24px 12px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: '600 20px var(--font)',
      color: 'var(--ink)'
    }
  }, "Your bag ", cart.length > 0 && /*#__PURE__*/React.createElement("small", {
    style: {
      font: '400 14px var(--font)',
      color: 'var(--ink-meta)'
    }
  }, "(", cart.reduce((n, i) => n + i.qty, 0), ")")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wu-x",
    "aria-label": "Close",
    onClick: onClose
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '0 24px'
    }
  }, cart.length ? cart.map((it, i) => /*#__PURE__*/React.createElement(LineItem, {
    key: i,
    item: it,
    onQty: q => setQty(i, q),
    onRemove: () => remove(i)
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '64px 0'
    }
  }, /*#__PURE__*/React.createElement(WU.Icon, {
    name: "bag",
    size: 40,
    style: {
      color: 'var(--ink-meta)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-muted)',
      margin: '14px 0 22px'
    }
  }, "Your bag is empty."), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    onClick: () => {
      onClose();
      go('collection', 'All');
    }
  }, "Shop all"))), cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: '600 16px var(--font)',
      color: 'var(--ink)',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, fmtRs(subtotal))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 18px',
      font: '400 13px var(--font)',
      color: 'var(--ink-meta)'
    }
  }, "Free shipping nationwide. Taxes included."), /*#__PURE__*/React.createElement("div", {
    className: "wu-duo"
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "cart",
    onClick: () => {
      onClose();
      go('cart');
    }
  }, "View bag"), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "buy",
    onClick: () => {
      onClose();
      go('checkout');
    }
  }, "Checkout")))));
}
Object.assign(window, {
  WU,
  LOGO,
  LOGO_W,
  MegaMenu,
  PageNav,
  PageHead,
  Search,
  SiteFooter,
  Qty,
  LineItem,
  BagDrawer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/SiteChrome.jsx", error: String((e && e.message) || e) }); }

// website/SiteCollection.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CollectionScreen({
  nav,
  go,
  addToBag,
  cat = 'All',
  setCat
}) {
  const D = window.WU_DATA;
  const [shown, setShown] = React.useState(8);
  const [sort, setSort] = React.useState('Featured');
  const filters = ['All', 'Sale', 'Earbuds', 'Headphones', 'Speakers', 'Smart Watches', 'Power Banks'];
  const off = p => 1 - priceNum(p.price) / priceNum(p.was || p.price);
  let list = cat === 'All' ? D.products : cat === 'Sale' ? D.products.filter(p => off(p) >= .25) : cat === 'Limited' ? D.products.filter(p => p.ribbon) : D.products.filter(p => p.cat === cat);
  if (sort === 'Price: low to high') list = [...list].sort((a, b) => priceNum(a.price) - priceNum(b.price));
  if (sort === 'Price: high to low') list = [...list].sort((a, b) => priceNum(b.price) - priceNum(a.price));
  if (sort === 'Biggest discount') list = [...list].sort((a, b) => off(b) - off(a));
  const more = list.slice(0, shown);
  const titles = {
    All: 'All Products',
    Sale: 'Mega Sale',
    Limited: 'Anniversary Picks'
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    className: "sec-head",
    style: {
      margin: '36px var(--gutter) 0'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sec-title"
  }, titles[cat] || cat), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      font: '400 14px var(--font)',
      color: 'var(--ink-meta)'
    }
  }, list.length, " products", /*#__PURE__*/React.createElement("select", {
    className: "wu-select",
    value: sort,
    onChange: e => setSort(e.target.value)
  }, ['Featured', 'Price: low to high', 'Price: high to low', 'Biggest discount'].map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      margin: '20px var(--gutter) 0'
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(WU.Chip, {
    key: f,
    active: f === cat,
    onClick: () => {
      setCat(f);
      setShown(8);
    }
  }, f))), /*#__PURE__*/React.createElement("div", {
    className: "wu-grid",
    style: {
      display: 'grid',
      columnGap: 22,
      rowGap: 16,
      margin: '0 calc(var(--gutter) + 20px)'
    }
  }, !list.length && /*#__PURE__*/React.createElement("p", {
    style: {
      gridColumn: '1/-1',
      margin: '48px 0',
      textAlign: 'center',
      color: 'var(--ink-muted)'
    }
  }, "Nothing here yet."), more.map((p, i) => /*#__PURE__*/React.createElement(WU.ProductCard, _extends({
    key: p.id
  }, p, {
    onBuy: () => addToBag(p),
    onOpen: () => go('pdp', p.id)
  })))), list.length > shown && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "viewall",
    href: "#",
    onClick: e => {
      e.preventDefault();
      setShown(s => s + 4);
    }
  }, /*#__PURE__*/React.createElement("span", null, "Load more"))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
window.CollectionScreen = CollectionScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/SiteCollection.jsx", error: String((e && e.message) || e) }); }

// website/SiteCorporate.jsx
try { (() => {
function CorporateScreen({
  nav,
  go
}) {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    msg: ''
  });
  const set = k => v => setForm(f => ({
    ...f,
    [k]: v
  }));
  const ok = form.name && form.email && form.phone;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "corp-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(WU.LabelChip, null, "Corporate gifting solutions"), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    caps: true,
    style: {
      margin: '16px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Corporate"), " gifting"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-body)',
      lineHeight: 1.6,
      maxWidth: '44ch',
      margin: '0 0 22px'
    }
  }, "Branded gift boxes for teams and clients, with custom sleeves, cards and laser printing."), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: "cart",
    onClick: () => {
      const el = document.getElementById('corp-form');
      if (el) window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 20,
        behavior: 'smooth'
      });
    }
  }, "Order in bulk")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 280,
      borderRadius: 20,
      background: 'linear-gradient(135deg,#F4F4F4,#DADDE0)',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: "buds",
    style: {
      width: '60%',
      filter: 'var(--shadow-product)'
    }
  })))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement("div", {
    className: "corp-row"
  }, /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 30
  }, "Why choose us for your ", /*#__PURE__*/React.createElement("strong", null, "corporate gifts?")), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, ['Custom product sleeve', 'Personalized gift box', 'Greeting cards', 'Laser printing'].map(c => /*#__PURE__*/React.createElement(WU.Chip, {
    key: c
  }, c))))), /*#__PURE__*/React.createElement(WU.Panel, {
    style: {
      scrollMarginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    id: "corp-form"
  }), /*#__PURE__*/React.createElement(WU.GradBadge, null, "% Exclusive discounts"), /*#__PURE__*/React.createElement(WU.NavyHeading, {
    size: 30,
    style: {
      margin: '14px 0 22px'
    }
  }, "Get ", /*#__PURE__*/React.createElement("strong", null, "Exclusive Discount"), " On Your Corporate Orders"), sent ? /*#__PURE__*/React.createElement("p", {
    style: {
      font: '500 16px var(--font)',
      color: 'var(--navy)'
    }
  }, "Thanks, ", form.name.split(' ')[0], " \u2014 our corporate team will reach out within one business day.") : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (ok) setSent(true);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row"
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Name",
    required: true,
    placeholder: "Your name",
    value: form.name,
    onChange: set('name')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Email address",
    required: true,
    placeholder: "Your email",
    value: form.email,
    onChange: set('email'),
    type: "email"
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Contact no",
    required: true,
    placeholder: "Contact no",
    value: form.phone,
    onChange: set('phone')
  }), /*#__PURE__*/React.createElement(WU.Field, {
    label: "Company name",
    placeholder: "Your company's name",
    value: form.company,
    onChange: set('company')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(WU.Field, {
    label: "Message",
    multiline: true,
    placeholder: "Quantities, products, delivery date\u2026",
    value: form.msg,
    onChange: set('msg')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    icon: null,
    type: "submit",
    disabled: !ok,
    style: {
      padding: '0 56px'
    }
  }, "Send")))), /*#__PURE__*/React.createElement(WU.Panel, null, /*#__PURE__*/React.createElement(WU.Quote, null, "No more hassle in ", /*#__PURE__*/React.createElement("strong", null, "corporate gifting"), ".")), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
window.CorporateScreen = CorporateScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/SiteCorporate.jsx", error: String((e && e.message) || e) }); }

// website/SiteHome.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function HomeScreen({
  nav,
  go,
  addToBag,
  megaCat,
  setMegaCat
}) {
  const D = window.WU_DATA;
  const [best, setBest] = React.useState(0);
  const card = p => /*#__PURE__*/React.createElement(WU.ProductCard, _extends({
    key: p.id
  }, p, {
    onBuy: () => addToBag(p),
    onOpen: () => go('pdp', p.id)
  }));
  const bestSlides = [{
    name: 'FROST',
    kicker: '20,000 mAh power bank',
    art: 'bank-ice',
    bg: 'linear-gradient(135deg,#F4F8FC 0%,#C9DBEF 100%)',
    pid: 'frost'
  }, {
    name: 'HALO',
    kicker: 'Software based headphone',
    art: 'phones',
    bg: 'linear-gradient(180deg,#F7F8F8 0%,#C9CDCD 100%)',
    pid: 'halo'
  }, {
    name: 'GILDED',
    kicker: 'Limited edition earbuds',
    art: 'buds',
    bg: 'linear-gradient(135deg,#FBF4E4 0%,#E8D3A6 100%)',
    pid: 'gilded'
  }];
  const b = bestSlides[best];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WU.UtilityBar, {
    links: D.utility,
    onSelect: l => l.go && go(l.go, l.arg)
  }), /*#__PURE__*/React.createElement(WU.HeroShell, {
    slides: D.slides,
    autoplay: megaCat ? false : 4500,
    onCta: s => go('pdp', s.pid)
  }, /*#__PURE__*/React.createElement(WU.GlassNav, _extends({
    logoSrc: LOGO
  }, nav, {
    active: D.cats.findIndex(c => c.label === megaCat),
    onCategory: c => setMegaCat(megaCat === c.label ? null : c.label)
  })), megaCat && /*#__PURE__*/React.createElement(MegaMenu, {
    cat: megaCat,
    onClose: () => setMegaCat(null),
    onPick: c => {
      setMegaCat(null);
      go('collection', c);
    }
  })), /*#__PURE__*/React.createElement("nav", {
    className: "cats",
    "aria-label": "Top categories"
  }, [['Audio', 'buds', 'Earbuds'], ['Smart Watches', 'watch', 'Smart Watches'], ['Power Banks', 'bank-ice', 'Power Banks'], ['Headphones', 'phones', 'Headphones'], ['Speakers', 'speaker', 'Speakers']].map(([l, a, c]) => /*#__PURE__*/React.createElement(WU.CategoryCircle, {
    key: l,
    label: l,
    art: a,
    onClick: () => go('collection', c)
  }))), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      margin: '0 var(--gutter)',
      height: 130,
      borderRadius: 'var(--r-shell)',
      background: 'linear-gradient(90deg,#151312 0%,#3a3531 100%)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 48px',
      color: '#fff',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: "watch",
    style: {
      position: 'absolute',
      left: 40,
      top: -30,
      height: 170
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 200
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px/1 var(--font)',
      letterSpacing: '.16em',
      textTransform: 'uppercase'
    }
  }, "Just launched"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 36px/1 var(--font-display)',
      marginTop: 8,
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "AURA")), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "pill",
    style: {
      marginLeft: 'auto'
    },
    onClick: () => go('pdp', 'aura')
  }, "Shop now")), /*#__PURE__*/React.createElement(WU.SectionHeader, {
    title: "New Arrivals",
    onViewAll: () => go('collection', 'All')
  }), /*#__PURE__*/React.createElement(WU.ProductRail, null, D.products.slice(0, 6).map(card)), /*#__PURE__*/React.createElement(WU.TrustBar, {
    items: D.trust
  }), /*#__PURE__*/React.createElement("section", {
    className: "promos",
    style: {
      marginTop: 60
    }
  }, /*#__PURE__*/React.createElement(WU.PromoTile, {
    kicker: "Software based earbuds",
    name: "EVOKE",
    chips: ['35 hrs music', 'Dual fit'],
    art: "buds",
    background: "linear-gradient(120deg,#0f2d2a,#050a0a)",
    onClick: () => go('pdp', 'evoke')
  }), /*#__PURE__*/React.createElement(WU.PromoTile, {
    kicker: "10,000 mAh power bank",
    name: "SURGE",
    chips: ['22.5W max', '15W wireless'],
    art: "bank",
    onClick: () => go('pdp', 'cyan')
  }), /*#__PURE__*/React.createElement(WU.PromoTile, {
    kicker: "Software based headphones",
    name: "ORBIT",
    chips: ['25ms latency', 'ANC'],
    art: "phones",
    background: "linear-gradient(120deg,#4a2a18,#a4582a)",
    onClick: () => go('pdp', 'orbit')
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      margin: '56px 0 16px',
      font: '600 13px/1 var(--font)',
      letterSpacing: '.24em',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, "Best seller"), /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      margin: '0 var(--gutter)',
      height: 300,
      borderRadius: 'var(--r-panel)',
      background: b.bg,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      padding: '0 64px',
      overflow: 'hidden',
      transition: 'background var(--t-med)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px/1 var(--font)',
      letterSpacing: '.16em',
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, b.kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 64px/1 var(--font-display)',
      margin: '14px 0 24px',
      color: 'var(--ink)'
    }
  }, b.name), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('pdp', b.pid);
    },
    style: {
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center',
      font: '600 17px/1 var(--font)',
      color: '#2350C8'
    }
  }, /*#__PURE__*/React.createElement(WU.Icon, {
    name: "cart",
    size: 22
  }), "Shop now")), /*#__PURE__*/React.createElement(WU.ProductArt, {
    name: b.art,
    style: {
      maxHeight: 250,
      width: '100%'
    }
  }), /*#__PURE__*/React.createElement(WU.Dots, {
    count: bestSlides.length,
    active: best,
    onChange: setBest,
    onLight: true
  })), /*#__PURE__*/React.createElement(WU.SectionHeader, {
    title: "Top Trending",
    onViewAll: () => go('collection', 'All')
  }), /*#__PURE__*/React.createElement(WU.ProductRail, null, D.products.slice(2).concat(D.products.slice(0, 2)).map(card)), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/SiteHome.jsx", error: String((e && e.message) || e) }); }

// website/SiteProduct.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProductScreen({
  nav,
  go,
  addToBag,
  pid,
  buyNow
}) {
  const D = window.WU_DATA;
  const p = D.products.find(x => x.id === pid) || D.products[2];
  const [img, setImg] = React.useState(0);
  const [color, setColor] = React.useState(0);
  const [gift, setGift] = React.useState(false);
  const names = {
    '#222': 'Black',
    '#8A552B': 'Tan',
    '#1c2a44': 'Midnight',
    '#1557C9': 'Cyan',
    '#E9DDC8': 'Cream',
    '#C9A24A': 'Gold',
    '#DCE7F3': 'Ice',
    '#0f2d2a': 'Forest',
    '#a4582a': 'Copper'
  };
  const colors = p.colors.length ? p.colors : ['#222'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageNav, {
    nav: nav
  }), /*#__PURE__*/React.createElement("section", {
    className: "pdp"
  }, /*#__PURE__*/React.createElement(WU.ProductGallery, {
    images: [0, 1, 2, 3].map(() => ({
      art: p.art,
      label: p.title
    })),
    value: img,
    onChange: setImg
  }), /*#__PURE__*/React.createElement("div", {
    className: "pdp__info"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp__sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit'
    },
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }, "Home"), /*#__PURE__*/React.createElement(WU.Icon, {
    name: "chev-r",
    size: 14
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit'
    },
    onClick: e => {
      e.preventDefault();
      go('collection', p.cat);
    }
  }, p.cat), /*#__PURE__*/React.createElement(WU.Icon, {
    name: "chev-r",
    size: 14
  }), p.title.split(' ')[0]), /*#__PURE__*/React.createElement("h1", {
    className: "pdp__title"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "pdp__sub"
  }, p.meta)), /*#__PURE__*/React.createElement("div", {
    className: "pdp__sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pdp__price"
  }, /*#__PURE__*/React.createElement("b", null, p.price), p.was && /*#__PURE__*/React.createElement("s", null, p.was), /*#__PURE__*/React.createElement("span", {
    className: "rating"
  }, /*#__PURE__*/React.createElement("span", {
    className: "star"
  }, "\u2605"), "4.9 ", /*#__PURE__*/React.createElement("small", null, "(15)"))), /*#__PURE__*/React.createElement("div", {
    className: "opt-label"
  }, "Color: ", /*#__PURE__*/React.createElement("b", null, names[colors[color]] || 'Default')), /*#__PURE__*/React.createElement(WU.SwatchTiles, {
    value: color,
    onChange: setColor,
    options: colors.map(c => ({
      label: names[c] || c,
      art: p.art
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "pdp__sec"
  }, /*#__PURE__*/React.createElement(WU.OfferBox, {
    title: "Get 5% additional discount",
    body: "Express delivery in your city within 3\u20136 hours",
    onLink: () => go('policy', 'shipping')
  }), /*#__PURE__*/React.createElement("div", {
    className: "sub-head"
  }, "Gift wrapping ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('support');
    }
  }, "Learn more")), /*#__PURE__*/React.createElement(WU.GiftStrip, {
    checked: gift,
    onChange: setGift
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(WU.Button, {
    variant: "buy",
    onClick: () => buyNow(p, {
      color: names[colors[color]],
      gift
    })
  }, "Buy Now"), /*#__PURE__*/React.createElement(WU.Button, {
    variant: "cart",
    onClick: () => addToBag(p, {
      color: names[colors[color]],
      gift
    })
  }, "Add to cart"))))), /*#__PURE__*/React.createElement("section", {
    className: "wu-specs"
  }, [['Warranty', '365 days replacement warranty'], ['In the box', p.title + ', USB-C cable, user manual'], ['Delivery', 'Free nationwide · 2–4 working days'], ['Returns', '7-day exchange on unused items']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("b", null, k), /*#__PURE__*/React.createElement("span", null, v)))), /*#__PURE__*/React.createElement(WU.SectionHeader, {
    title: "You may also like",
    onViewAll: () => go('collection', 'All')
  }), /*#__PURE__*/React.createElement(WU.ProductRail, null, D.products.filter(x => x.id !== p.id).map(x => /*#__PURE__*/React.createElement(WU.ProductCard, _extends({
    key: x.id
  }, x, {
    onBuy: () => addToBag(x),
    onOpen: () => go('pdp', x.id)
  })))), /*#__PURE__*/React.createElement(SiteFooter, {
    go: go
  }));
}
window.ProductScreen = ProductScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/SiteProduct.jsx", error: String((e && e.message) || e) }); }

// website/data.js
try { (() => {
// Demo catalogue for the Wisdomup storefront UI kit. Placeholder art names map to components/icons ProductArt.
window.WU_DATA = {
  cats: [{
    icon: 'buds',
    label: 'Earbuds'
  }, {
    icon: 'phones',
    label: 'Headphones'
  }, {
    icon: 'speaker',
    label: 'Speakers'
  }, {
    icon: 'watch',
    label: 'Smart Watches'
  }, {
    icon: 'bank',
    label: 'Power Banks'
  }, {
    icon: 'plug',
    label: 'Chargers'
  }, {
    icon: 'cable',
    label: 'Cables'
  }, {
    icon: 'mic',
    label: 'Microphones'
  }],
  sub: {
    Earbuds: [['Software Based Earbuds', 'buds'], ['ANC Earbuds', 'phones'], ['ENC Earbuds', 'speaker'], ['Best for Calling', 'bank'], ['Gaming Earbuds', 'buds']],
    Headphones: [['Wireless Headphones', 'phones'], ['ANC Headphones', 'phones'], ['Gaming Headsets', 'phones']],
    Speakers: [['Party Speakers', 'speaker'], ['Portable Speakers', 'speaker']],
    'Smart Watches': [['AMOLED Watches', 'watch'], ['Calling Watches', 'watch'], ['Kids Watches', 'watch']],
    'Power Banks': [['10,000 mAh', 'bank'], ['20,000 mAh', 'bank-ice'], ['Wireless Power Banks', 'bank']],
    Chargers: [['Wall Chargers', 'bank'], ['Car Chargers', 'bank']],
    Cables: [['Type-C Cables', 'bank'], ['Lightning Cables', 'bank']],
    Microphones: [['Wireless Mics', 'speaker'], ['Studio Mics', 'speaker']]
  },
  slides: [{
    tone: 'dark',
    kicker: 'AI powered smartwatch',
    name: 'AURA',
    specs: ['AMOLED\nretina display', '2.5D curved\ndisplay', '1GB\nstorage'],
    art: 'watch',
    pid: 'aura'
  }, {
    tone: 'light',
    kicker: 'The full lineup',
    name: 'ESSENTIALS',
    nameSize: 60,
    art: 'buds',
    pid: 'gilded'
  }, {
    tone: 'blue',
    kicker: 'Best seller',
    name: 'FROST',
    specs: ['20000 mAh · 22.5W max output'],
    art: 'bank-ice',
    pid: 'frost'
  }, {
    tone: 'dark',
    kicker: 'Software based headphones',
    name: 'HALO',
    specs: ['Mood tuned\nsound', 'Dual device\npairing'],
    art: 'phones',
    pid: 'halo'
  }],
  products: [{
    id: 'cyan',
    cat: 'Power Banks',
    ribbon: 'Newly launched',
    title: 'Cyan Powerbank',
    meta: '10,000 mAh | 22.2W Fast Charging | Digital Display',
    price: 'Rs.6,595',
    was: 'Rs.7,995',
    rating: null,
    colors: ['#1557C9'],
    art: 'bank'
  }, {
    id: 'halo',
    cat: 'Headphones',
    ribbon: 'Software based',
    title: 'Halo Headphone',
    meta: 'Mood Tuned Sound | Dual Device | Soft Comfort',
    price: 'Rs.4,995',
    was: 'Rs.8,995',
    rating: 5,
    colors: ['#E9DDC8', '#222'],
    art: 'phones'
  }, {
    id: 'aura',
    cat: 'Smart Watches',
    ribbon: 'Newly launched',
    title: 'Aura Smart Watch',
    meta: 'AMOLED | Always-on Display | 100+ Sports Modes',
    price: 'Rs.14,995',
    was: 'Rs.19,995',
    rating: 5,
    colors: ['#8A552B', '#222', '#1c2a44'],
    art: 'watch'
  }, {
    id: 'gilded',
    cat: 'Earbuds',
    ribbon: 'Limited edition',
    title: 'Gilded Earbuds',
    meta: 'Studio Grade Sound | ENC Quad Mic',
    price: 'Rs.6,995',
    was: 'Rs.8,995',
    rating: 5,
    colors: ['#C9A24A'],
    art: 'buds'
  }, {
    id: 'boom',
    cat: 'Speakers',
    ribbon: 'Newly launched',
    title: 'Boom Box Speaker',
    meta: 'Dual Woofers | Heavy Bass | Wireless Mic',
    price: 'Rs.5,595',
    was: 'Rs.7,995',
    rating: 4,
    colors: ['#222'],
    art: 'speaker'
  }, {
    id: 'frost',
    cat: 'Power Banks',
    title: 'Frost Powerbank',
    meta: '20,000 mAh | 22.5W Max Output | Dual USB-C',
    price: 'Rs.7,495',
    was: 'Rs.9,995',
    rating: 5,
    colors: ['#DCE7F3', '#222'],
    art: 'bank-ice'
  }, {
    id: 'evoke',
    cat: 'Earbuds',
    ribbon: 'Software based',
    title: 'Evoke Earbuds',
    meta: '35 Hrs Music | Dual Fit | ENC',
    price: 'Rs.5,995',
    was: 'Rs.7,495',
    rating: 5,
    colors: ['#0f2d2a', '#222'],
    art: 'buds'
  }, {
    id: 'orbit',
    cat: 'Headphones',
    title: 'Orbit Headphone',
    meta: '25ms Latency | ANC | 60 Hrs Playback',
    price: 'Rs.8,995',
    was: 'Rs.11,995',
    rating: 4,
    colors: ['#a4582a', '#222'],
    art: 'phones'
  }],
  footer: [{
    title: 'Shop',
    links: ['All products', 'Earbuds', 'Headphones', 'Smart watches', 'Power banks']
  }, {
    title: 'Company',
    links: ['About us', 'Customer care', 'Privacy policy', 'Terms of service']
  }, {
    title: 'Care',
    links: ['Track your order', 'Warranty policy', 'Exchange & refunds', 'Shipping policy']
  }],
  utility: [{
    label: 'Anniversary Program',
    tone: 'gold',
    go: 'collection',
    arg: 'Limited'
  }, {
    label: 'Mega Sale',
    tone: 'green',
    go: 'collection',
    arg: 'Sale'
  }, {
    label: 'Product Customization',
    go: 'corporate'
  }, {
    label: 'Express Delivery',
    go: 'policy',
    arg: 'shipping'
  }, {
    label: 'Gift Store',
    go: 'collection',
    arg: 'All'
  }, {
    label: 'Corporate Orders',
    go: 'corporate'
  }, {
    label: 'Track Orders',
    go: 'track'
  }, {
    label: 'Contact Us',
    go: 'support'
  }],
  trust: [{
    icon: 'truck',
    label: 'Free shipping\nnationwide'
  }, {
    icon: 'smile',
    label: '1M+ satisfied\ncustomers'
  }, {
    icon: 'medal',
    label: '365 days\nwarranty'
  }, {
    icon: 'shield',
    label: 'Certified\nproducts'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/data.js", error: String((e && e.message) || e) }); }

// website/site-data.js
try { (() => {
// Site-level content beyond the catalogue. Copy is draft — replace with Wisdomup's approved text.
Object.assign(window.WU_DATA, {
  faqs: [['How long does delivery take?', 'Standard delivery reaches most cities in 2–4 working days and is free nationwide. Express delivery arrives within 3–6 hours in selected cities.'], ['What does the 365-day warranty cover?', 'Manufacturing defects in the device and the included cable, for one year from the delivery date. Physical or liquid damage is not covered.'], ['How do I claim warranty?', 'Open Customer Care, choose Warranty claim and share your order number with a short video of the issue. We collect the unit and send a replacement.'], ['Can I exchange a product?', 'Unused products in original packaging can be exchanged within 7 days of delivery.'], ['Do you offer cash on delivery?', 'Yes, cash on delivery is available on all orders. Card and wallet payments get an extra 5% off.'], ['Can I customise products for my company?', 'Yes — laser printing, custom sleeves and branded gift boxes are available on corporate orders.']],
  policies: {
    privacy: {
      title: 'Privacy policy',
      body: [['What we collect', 'Your name, contact details and delivery address when you place an order, and basic device information when you browse.'], ['How we use it', 'To process and deliver orders, provide support and — only if you opt in — send offers.'], ['Sharing', 'We share delivery details with courier partners only. We never sell personal data.'], ['Your choices', 'Write to support@wisdomup.com to access, correct or delete your data.']]
    },
    terms: {
      title: 'Terms of service',
      body: [['Orders', 'An order is confirmed once you receive a confirmation message. Prices include all taxes.'], ['Pricing', 'We may correct pricing errors and will contact you before shipping if a price changes.'], ['Use of site', 'Content on this site belongs to Wisdomup and may not be reused without permission.']]
    },
    warranty: {
      title: 'Warranty policy',
      body: [['Coverage', '365 days against manufacturing defects from the delivery date.'], ['Not covered', 'Physical damage, liquid damage, unauthorised repair and normal wear of ear tips and straps.'], ['Process', 'Raise a claim from Customer Care. We arrange pickup and dispatch a replacement after inspection.']]
    },
    exchange: {
      title: 'Exchange & refunds',
      body: [['Window', '7 days from delivery for unused products in original packaging.'], ['Refunds', 'Prepaid orders are refunded to the original payment method within 5–7 working days after inspection.'], ['Non-returnable', 'Opened earbuds and personalised corporate orders.']]
    },
    shipping: {
      title: 'Shipping policy',
      body: [['Standard', 'Free nationwide, 2–4 working days.'], ['Express', 'Delivered within 3–6 hours in selected cities for orders placed before 6 pm.'], ['Tracking', 'A tracking link is sent by SMS and email once your order ships.']]
    }
  },
  footerRoutes: {
    'All products': ['collection', 'All'],
    Earbuds: ['collection', 'Earbuds'],
    Headphones: ['collection', 'Headphones'],
    'Smart watches': ['collection', 'Smart Watches'],
    'Power banks': ['collection', 'Power Banks'],
    'About us': ['about'],
    'Customer care': ['support'],
    'Privacy policy': ['policy', 'privacy'],
    'Terms of service': ['policy', 'terms'],
    'Track your order': ['track'],
    'Warranty policy': ['policy', 'warranty'],
    'Exchange & refunds': ['policy', 'exchange'],
    'Shipping policy': ['policy', 'shipping']
  }
});
window.priceNum = s => Number(String(s || 0).replace(/[^\d]/g, ''));
window.fmtRs = n => 'Rs.' + n.toLocaleString('en-US');
})(); } catch (e) { __ds_ns.__errors.push({ path: "website/site-data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CategoryCircle = __ds_scope.CategoryCircle;

__ds_ns.CompactCard = __ds_scope.CompactCard;

__ds_ns.GlassCard = __ds_scope.GlassCard;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.PromoTile = __ds_scope.PromoTile;

__ds_ns.Ribbon = __ds_scope.Ribbon;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.GradBadge = __ds_scope.GradBadge;

__ds_ns.LabelChip = __ds_scope.LabelChip;

__ds_ns.NavyHeading = __ds_scope.NavyHeading;

__ds_ns.Quote = __ds_scope.Quote;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ProductArt = __ds_scope.ProductArt;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.ART = __ds_scope.ART;

__ds_ns.ART_DEFS = __ds_scope.ART_DEFS;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.HeroShell = __ds_scope.HeroShell;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.SearchOverlay = __ds_scope.SearchOverlay;

__ds_ns.TrustBar = __ds_scope.TrustBar;

__ds_ns.Dots = __ds_scope.Dots;

__ds_ns.GlassNav = __ds_scope.GlassNav;

__ds_ns.ProductRail = __ds_scope.ProductRail;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.UtilityBar = __ds_scope.UtilityBar;

__ds_ns.ColorDots = __ds_scope.ColorDots;

__ds_ns.GiftStrip = __ds_scope.GiftStrip;

__ds_ns.OfferBox = __ds_scope.OfferBox;

__ds_ns.ProductGallery = __ds_scope.ProductGallery;

__ds_ns.Stars = __ds_scope.Stars;

__ds_ns.SwatchTiles = __ds_scope.SwatchTiles;

__ds_ns.Thumbs = __ds_scope.Thumbs;

})();
