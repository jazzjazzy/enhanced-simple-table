function c(r, e = {}) {
  const t = document.createElement(r);
  return Object.entries(e).forEach(([n, i]) => {
    n === "class" || n === "className" ? t.className = i : n === "style" && typeof i == "object" ? Object.entries(i).forEach(([s, a]) => {
      t.style[s] = a;
    }) : n.startsWith("data-") ? t.setAttribute(n, i) : n === "textContent" ? t.textContent = i : n === "innerHTML" ? t.innerHTML = i : t.setAttribute(n, i);
  }), t;
}
function he(r) {
  for (; r.firstChild; )
    r.removeChild(r.firstChild);
}
const u = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
  CURRENCY: "currency",
  ARRAY: "array",
  OBJECT: "object",
  NULL: "null",
  UNDEFINED: "undefined"
};
function Q(r) {
  if (r === null)
    return u.NULL;
  if (r === void 0)
    return u.UNDEFINED;
  if (Array.isArray(r))
    return u.ARRAY;
  const e = typeof r;
  return e === "object" ? r instanceof Date ? u.DATE : u.OBJECT : e === "number" ? u.NUMBER : e === "boolean" ? u.BOOLEAN : e === "string" ? ee(r) ? u.DATE : te(r) ? u.NUMBER : ne(r) ? u.BOOLEAN : u.STRING : u.STRING;
}
function ee(r) {
  if (typeof r != "string")
    return !1;
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(r))
    return !0;
  const t = new Date(r);
  return !isNaN(t.getTime());
}
function te(r) {
  return typeof r != "string" ? !1 : !isNaN(r) && !isNaN(parseFloat(r));
}
function ne(r) {
  if (typeof r != "string")
    return !1;
  const e = r.toLowerCase();
  return e === "true" || e === "false" || e === "yes" || e === "no";
}
function fe(r, e) {
  if (r == null)
    return r;
  switch (e) {
    case u.STRING:
      return String(r);
    case u.NUMBER:
      return Number(r);
    case u.BOOLEAN:
      if (typeof r == "string") {
        const t = r.toLowerCase();
        if (t === "true" || t === "yes" || t === "1")
          return !0;
        if (t === "false" || t === "no" || t === "0")
          return !1;
      }
      return !!r;
    case u.DATE:
      return r instanceof Date ? r : new Date(r);
    case u.ARRAY:
      return Array.isArray(r) ? r : [r];
    default:
      return r;
  }
}
function re(r) {
  if (!Array.isArray(r) || r.length === 0)
    return {};
  const e = {}, t = {};
  return r.forEach((n) => {
    !n || typeof n != "object" || Object.entries(n).forEach(([i, s]) => {
      const a = Q(s);
      t[i] || (t[i] = {}), t[i][a] = (t[i][a] || 0) + 1;
    });
  }), Object.entries(t).forEach(([n, i]) => {
    let s = 0, a = u.STRING;
    Object.entries(i).forEach(([l, o]) => {
      o > s && (s = o, a = l);
    }), e[n] = a;
  }), e;
}
function v(r, e = "US") {
  if (r == null)
    return "";
  try {
    const t = Number(r);
    if (isNaN(t))
      return String(r);
    const i = {
      // Alpha-2 codes
      AD: { currency: "EUR", locale: "ca-AD" },
      // Andorra
      AE: { currency: "AED", locale: "ar-AE" },
      // United Arab Emirates
      AF: { currency: "AFN", locale: "ps-AF" },
      // Afghanistan
      AG: { currency: "XCD", locale: "en-AG" },
      // Antigua and Barbuda
      AI: { currency: "XCD", locale: "en-AI" },
      // Anguilla
      AL: { currency: "ALL", locale: "sq-AL" },
      // Albania
      AM: { currency: "AMD", locale: "hy-AM" },
      // Armenia
      AO: { currency: "AOA", locale: "pt-AO" },
      // Angola
      AR: { currency: "ARS", locale: "es-AR" },
      // Argentina
      AT: { currency: "EUR", locale: "de-AT" },
      // Austria
      AU: { currency: "AUD", locale: "en-AU" },
      // Australia
      AZ: { currency: "AZN", locale: "az-AZ" },
      // Azerbaijan
      BA: { currency: "BAM", locale: "bs-BA" },
      // Bosnia and Herzegovina
      BB: { currency: "BBD", locale: "en-BB" },
      // Barbados
      BD: { currency: "BDT", locale: "bn-BD" },
      // Bangladesh
      BE: { currency: "EUR", locale: "nl-BE" },
      // Belgium
      BG: { currency: "BGN", locale: "bg-BG" },
      // Bulgaria
      BH: { currency: "BHD", locale: "ar-BH" },
      // Bahrain
      BI: { currency: "BIF", locale: "fr-BI" },
      // Burundi
      BJ: { currency: "XOF", locale: "fr-BJ" },
      // Benin
      BN: { currency: "BND", locale: "ms-BN" },
      // Brunei
      BO: { currency: "BOB", locale: "es-BO" },
      // Bolivia
      BR: { currency: "BRL", locale: "pt-BR" },
      // Brazil
      BS: { currency: "BSD", locale: "en-BS" },
      // Bahamas
      BT: { currency: "BTN", locale: "dz-BT" },
      // Bhutan
      BW: { currency: "BWP", locale: "en-BW" },
      // Botswana
      BY: { currency: "BYN", locale: "be-BY" },
      // Belarus
      BZ: { currency: "BZD", locale: "en-BZ" },
      // Belize
      CA: { currency: "CAD", locale: "en-CA" },
      // Canada
      CH: { currency: "CHF", locale: "de-CH" },
      // Switzerland
      CL: { currency: "CLP", locale: "es-CL" },
      // Chile
      CN: { currency: "CNY", locale: "zh-CN" },
      // China
      CO: { currency: "COP", locale: "es-CO" },
      // Colombia
      CR: { currency: "CRC", locale: "es-CR" },
      // Costa Rica
      CU: { currency: "CUP", locale: "es-CU" },
      // Cuba
      CV: { currency: "CVE", locale: "pt-CV" },
      // Cape Verde
      CY: { currency: "EUR", locale: "el-CY" },
      // Cyprus
      CZ: { currency: "CZK", locale: "cs-CZ" },
      // Czech Republic
      DE: { currency: "EUR", locale: "de-DE" },
      // Germany
      DK: { currency: "DKK", locale: "da-DK" },
      // Denmark
      DO: { currency: "DOP", locale: "es-DO" },
      // Dominican Republic
      DZ: { currency: "DZD", locale: "ar-DZ" },
      // Algeria
      EC: { currency: "USD", locale: "es-EC" },
      // Ecuador
      EE: { currency: "EUR", locale: "et-EE" },
      // Estonia
      EG: { currency: "EGP", locale: "ar-EG" },
      // Egypt
      ES: { currency: "EUR", locale: "es-ES" },
      // Spain
      ET: { currency: "ETB", locale: "am-ET" },
      // Ethiopia
      EU: { currency: "EUR", locale: "en-EU" },
      // European Union
      FI: { currency: "EUR", locale: "fi-FI" },
      // Finland
      FJ: { currency: "FJD", locale: "en-FJ" },
      // Fiji
      FR: { currency: "EUR", locale: "fr-FR" },
      // France
      GB: { currency: "GBP", locale: "en-GB" },
      // United Kingdom
      GE: { currency: "GEL", locale: "ka-GE" },
      // Georgia
      GH: { currency: "GHS", locale: "en-GH" },
      // Ghana
      GR: { currency: "EUR", locale: "el-GR" },
      // Greece
      GT: { currency: "GTQ", locale: "es-GT" },
      // Guatemala
      HK: { currency: "HKD", locale: "zh-HK" },
      // Hong Kong
      HN: { currency: "HNL", locale: "es-HN" },
      // Honduras
      HR: { currency: "EUR", locale: "hr-HR" },
      // Croatia
      HU: { currency: "HUF", locale: "hu-HU" },
      // Hungary
      ID: { currency: "IDR", locale: "id-ID" },
      // Indonesia
      IE: { currency: "EUR", locale: "en-IE" },
      // Ireland
      IL: { currency: "ILS", locale: "he-IL" },
      // Israel
      IN: { currency: "INR", locale: "en-IN" },
      // India
      IQ: { currency: "IQD", locale: "ar-IQ" },
      // Iraq
      IR: { currency: "IRR", locale: "fa-IR" },
      // Iran
      IS: { currency: "ISK", locale: "is-IS" },
      // Iceland
      IT: { currency: "EUR", locale: "it-IT" },
      // Italy
      JM: { currency: "JMD", locale: "en-JM" },
      // Jamaica
      JO: { currency: "JOD", locale: "ar-JO" },
      // Jordan
      JP: { currency: "JPY", locale: "ja-JP" },
      // Japan
      KE: { currency: "KES", locale: "sw-KE" },
      // Kenya
      KG: { currency: "KGS", locale: "ky-KG" },
      // Kyrgyzstan
      KH: { currency: "KHR", locale: "km-KH" },
      // Cambodia
      KR: { currency: "KRW", locale: "ko-KR" },
      // South Korea
      KW: { currency: "KWD", locale: "ar-KW" },
      // Kuwait
      KZ: { currency: "KZT", locale: "kk-KZ" },
      // Kazakhstan
      LA: { currency: "LAK", locale: "lo-LA" },
      // Laos
      LB: { currency: "LBP", locale: "ar-LB" },
      // Lebanon
      LK: { currency: "LKR", locale: "si-LK" },
      // Sri Lanka
      LT: { currency: "EUR", locale: "lt-LT" },
      // Lithuania
      LU: { currency: "EUR", locale: "fr-LU" },
      // Luxembourg
      LV: { currency: "EUR", locale: "lv-LV" },
      // Latvia
      LY: { currency: "LYD", locale: "ar-LY" },
      // Libya
      MA: { currency: "MAD", locale: "ar-MA" },
      // Morocco
      MD: { currency: "MDL", locale: "ro-MD" },
      // Moldova
      ME: { currency: "EUR", locale: "sr-ME" },
      // Montenegro
      MG: { currency: "MGA", locale: "fr-MG" },
      // Madagascar
      MK: { currency: "MKD", locale: "mk-MK" },
      // North Macedonia
      MM: { currency: "MMK", locale: "my-MM" },
      // Myanmar
      MN: { currency: "MNT", locale: "mn-MN" },
      // Mongolia
      MO: { currency: "MOP", locale: "zh-MO" },
      // Macau
      MT: { currency: "EUR", locale: "mt-MT" },
      // Malta
      MU: { currency: "MUR", locale: "en-MU" },
      // Mauritius
      MV: { currency: "MVR", locale: "dv-MV" },
      // Maldives
      MX: { currency: "MXN", locale: "es-MX" },
      // Mexico
      MY: { currency: "MYR", locale: "ms-MY" },
      // Malaysia
      MZ: { currency: "MZN", locale: "pt-MZ" },
      // Mozambique
      NA: { currency: "NAD", locale: "en-NA" },
      // Namibia
      NG: { currency: "NGN", locale: "en-NG" },
      // Nigeria
      NI: { currency: "NIO", locale: "es-NI" },
      // Nicaragua
      NL: { currency: "EUR", locale: "nl-NL" },
      // Netherlands
      NO: { currency: "NOK", locale: "no-NO" },
      // Norway
      NP: { currency: "NPR", locale: "ne-NP" },
      // Nepal
      NZ: { currency: "NZD", locale: "en-NZ" },
      // New Zealand
      OM: { currency: "OMR", locale: "ar-OM" },
      // Oman
      PA: { currency: "PAB", locale: "es-PA" },
      // Panama
      PE: { currency: "PEN", locale: "es-PE" },
      // Peru
      PG: { currency: "PGK", locale: "en-PG" },
      // Papua New Guinea
      PH: { currency: "PHP", locale: "en-PH" },
      // Philippines
      PK: { currency: "PKR", locale: "ur-PK" },
      // Pakistan
      PL: { currency: "PLN", locale: "pl-PL" },
      // Poland
      PT: { currency: "EUR", locale: "pt-PT" },
      // Portugal
      PY: { currency: "PYG", locale: "es-PY" },
      // Paraguay
      QA: { currency: "QAR", locale: "ar-QA" },
      // Qatar
      RO: { currency: "RON", locale: "ro-RO" },
      // Romania
      RS: { currency: "RSD", locale: "sr-RS" },
      // Serbia
      RU: { currency: "RUB", locale: "ru-RU" },
      // Russia
      SA: { currency: "SAR", locale: "ar-SA" },
      // Saudi Arabia
      SE: { currency: "SEK", locale: "sv-SE" },
      // Sweden
      SG: { currency: "SGD", locale: "en-SG" },
      // Singapore
      SI: { currency: "EUR", locale: "sl-SI" },
      // Slovenia
      SK: { currency: "EUR", locale: "sk-SK" },
      // Slovakia
      TH: { currency: "THB", locale: "th-TH" },
      // Thailand
      TN: { currency: "TND", locale: "ar-TN" },
      // Tunisia
      TR: { currency: "TRY", locale: "tr-TR" },
      // Turkey
      TW: { currency: "TWD", locale: "zh-TW" },
      // Taiwan
      TZ: { currency: "TZS", locale: "sw-TZ" },
      // Tanzania
      UA: { currency: "UAH", locale: "uk-UA" },
      // Ukraine
      UG: { currency: "UGX", locale: "en-UG" },
      // Uganda
      UM: { currency: "USD", locale: "en-UM" },
      // United States Minor Outlying Islands
      US: { currency: "USD", locale: "en-US" },
      // United States
      UY: { currency: "UYU", locale: "es-UY" },
      // Uruguay
      UZ: { currency: "UZS", locale: "uz-UZ" },
      // Uzbekistan
      VA: { currency: "EUR", locale: "it-VA" },
      // Vatican City
      VE: { currency: "VES", locale: "es-VE" },
      // Venezuela
      VN: { currency: "VND", locale: "vi-VN" },
      // Vietnam
      ZA: { currency: "ZAR", locale: "en-ZA" },
      // South Africa
      ZM: { currency: "ZMW", locale: "en-ZM" },
      // Zambia
      ZW: { currency: "USD", locale: "en-ZW" },
      // Zimbabwe
      // Alpha-3 codes for major countries
      USA: { currency: "USD", locale: "en-US" },
      // United States
      GBR: { currency: "GBP", locale: "en-GB" },
      // United Kingdom
      CAN: { currency: "CAD", locale: "en-CA" },
      // Canada
      AUS: { currency: "AUD", locale: "en-AU" },
      // Australia
      NZL: { currency: "NZD", locale: "en-NZ" },
      // New Zealand
      EUR: { currency: "EUR", locale: "en-EU" },
      // European Union
      JPN: { currency: "JPY", locale: "ja-JP" },
      // Japan
      CHN: { currency: "CNY", locale: "zh-CN" },
      // China
      IND: { currency: "INR", locale: "en-IN" },
      // India
      BRA: { currency: "BRL", locale: "pt-BR" },
      // Brazil
      RUS: { currency: "RUB", locale: "ru-RU" },
      // Russia
      ZAF: { currency: "ZAR", locale: "en-ZA" },
      // South Africa
      MEX: { currency: "MXN", locale: "es-MX" },
      // Mexico
      SGP: { currency: "SGD", locale: "en-SG" },
      // Singapore
      CHE: { currency: "CHF", locale: "de-CH" },
      // Switzerland
      SWE: { currency: "SEK", locale: "sv-SE" },
      // Sweden
      NOR: { currency: "NOK", locale: "no-NO" },
      // Norway
      DNK: { currency: "DKK", locale: "da-DK" },
      // Denmark
      KOR: { currency: "KRW", locale: "ko-KR" }
      // South Korea
    }[e] || { currency: "USD", locale: "en-US" };
    return t.toLocaleString(i.locale, {
      style: "currency",
      currency: i.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  } catch (t) {
    return console.error("Error formatting currency:", t), String(r);
  }
}
function pe(r, e, t = {}) {
  if (r == null)
    return "";
  switch (e) {
    case u.DATE:
      try {
        const n = r instanceof Date ? r : new Date(r);
        return isNaN(n.getTime()) ? String(r) : t.dateFormat === "relative" ? ge(n) : n.toLocaleDateString(t.locale, t.dateOptions);
      } catch {
        return String(r);
      }
    case u.NUMBER:
      try {
        const n = Number(r);
        return isNaN(n) ? String(r) : t.numberFormat ? n.toLocaleString(t.locale, t.numberOptions) : String(n);
      } catch {
        return String(r);
      }
    case u.CURRENCY:
      return v(r, t.countryCode);
    case u.BOOLEAN:
      return t.booleanFormat === "yes-no" ? r ? "Yes" : "No" : t.booleanFormat === "true-false" ? r ? "True" : "False" : t.booleanFormat === "custom" && t.booleanLabels ? r ? t.booleanLabels.true : t.booleanLabels.false : String(r);
    case u.ARRAY:
      return Array.isArray(r) ? r.join(t.arraySeparator || ", ") : String(r);
    default:
      return String(r);
  }
}
function ge(r) {
  const t = /* @__PURE__ */ new Date() - r, n = Math.round(t / 1e3), i = Math.round(n / 60), s = Math.round(i / 60), a = Math.round(s / 24), l = Math.round(a / 30), o = Math.round(a / 365);
  return n < 60 ? "just now" : i < 60 ? `${i} minute${i === 1 ? "" : "s"} ago` : s < 24 ? `${s} hour${s === 1 ? "" : "s"} ago` : a < 30 ? `${a} day${a === 1 ? "" : "s"} ago` : l < 12 ? `${l} month${l === 1 ? "" : "s"} ago` : `${o} year${o === 1 ? "" : "s"} ago`;
}
const ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DATA_TYPES: u,
  convertType: fe,
  detectDataTypes: re,
  detectType: Q,
  formatCurrency: v,
  formatValue: pe,
  isBooleanString: ne,
  isDateString: ee,
  isNumericString: te
}, Symbol.toStringTag, { value: "Module" })), J = ["dark", "blue", "minimal", "high-contrast"];
class ye {
  /**
   * Create a new Renderer instance
   * @param {Table} tableInstance - The Table instance to render
   */
  constructor(e) {
    this.table = e, this.container = e.container, this.elements = {
      table: null,
      thead: null,
      tbody: null,
      filterRow: null,
      filterInputs: /* @__PURE__ */ new Map(),
      styleLinks: /* @__PURE__ */ new Map(),
      paginationContainer: null,
      loadingIndicator: null
    }, this.stylingOptions = this.table.options.styling || {}, this.stylingOptions.theme && this.loadTheme(this.stylingOptions.theme), this.stylingOptions.customStylesheet && this.loadCustomStylesheet(this.stylingOptions.customStylesheet);
  }
  /**
   * Load a theme stylesheet
   * @param {string} themeName - Name of the theme to load
   * @returns {boolean} Whether the theme was loaded successfully
   */
  loadTheme(e) {
    if (!J.includes(e))
      return console.warn(`Theme "${e}" is not available. Available themes: ${J.join(", ")}`), !1;
    const t = document.createElement("link");
    t.rel = "stylesheet";
    const i = window.location.pathname.includes("/examples/") ? `../src/styles/themes/${e}.css` : `./src/styles/themes/${e}.css`;
    return t.href = this.stylingOptions.themesPath || i, t.id = `filter-table-theme-${e}`, console.log(`Loading theme: ${e} from ${t.href}`), document.head.appendChild(t), this.elements.styleLinks.set("theme", t), this.currentTheme = e, !0;
  }
  /**
   * Load a custom stylesheet
   * @param {string} stylesheetPath - Path to the custom stylesheet
   * @returns {boolean} Whether the stylesheet was loaded successfully
   */
  loadCustomStylesheet(e) {
    if (!e)
      return !1;
    const t = document.createElement("link");
    return t.rel = "stylesheet", t.href = e, t.id = "filter-table-custom-stylesheet", document.head.appendChild(t), this.elements.styleLinks.set("custom", t), !0;
  }
  /**
   * Change the current theme
   * @param {string} themeName - Name of the theme to switch to
   * @returns {boolean} Whether the theme was changed successfully
   */
  changeTheme(e) {
    if (this.currentTheme && this.elements.table && this.elements.table.classList.remove(`theme-${this.currentTheme}`), this.elements.styleLinks.has("theme")) {
      const n = this.elements.styleLinks.get("theme");
      document.head.removeChild(n), this.elements.styleLinks.delete("theme");
    }
    const t = this.loadTheme(e);
    return t && this.elements.table && this.elements.table.classList.add(`theme-${e}`), t;
  }
  /**
   * Render the table from scratch
   */
  render() {
    this.clear();
    const e = c("div", {
      class: "filter-table-wrapper"
    });
    let t = "filter-table";
    this.currentTheme && (t += ` theme-${this.currentTheme}`);
    const n = c("table", {
      class: t
    }), i = this._createHeader();
    n.appendChild(i);
    const s = this._createFilterRow();
    i.appendChild(s);
    const a = this._createBody();
    if (n.appendChild(a), this.elements.table = n, this.elements.thead = i, this.elements.tbody = a, this.elements.filterRow = s, e.appendChild(n), this.table.paginationOptions.enabled) {
      const l = this._createPaginationControls();
      e.appendChild(l), this.elements.paginationContainer = l;
    }
    if (this.table.endlessScrollingOptions.enabled) {
      const l = this._createLoadingIndicator();
      e.appendChild(l), this.elements.loadingIndicator = l;
    }
    this.container.appendChild(e);
  }
  /**
   * Update the table with current data
   */
  update() {
    if (this.elements.tbody) {
      const e = this._createBody();
      this.elements.table.replaceChild(e, this.elements.tbody), this.elements.tbody = e;
    }
    if (this._updateFilterInputs(), this.table.paginationOptions.enabled && this.elements.paginationContainer) {
      const e = this._createPaginationControls();
      this.elements.paginationContainer.parentNode.replaceChild(
        e,
        this.elements.paginationContainer
      ), this.elements.paginationContainer = e;
    }
    this.table.endlessScrollingOptions.enabled && this.elements.loadingIndicator && this._updateLoadingIndicator();
  }
  /**
   * Clear the container
   */
  clear() {
    he(this.container), this.elements.filterInputs.clear();
  }
  /**
   * Create the table header
   * @private
   * @returns {HTMLElement} The table header element
   */
  _createHeader() {
    const e = c("thead"), t = c("tr");
    return this.table.columns.forEach((n) => {
      const i = c("th", {
        "data-field": n.field,
        class: n.sortable ? "sortable" : ""
      });
      i.textContent = n.title || n.field, t.appendChild(i);
    }), e.appendChild(t), e;
  }
  /**
   * Create the filter row
   * @private
   * @returns {HTMLElement} The filter row element
   */
  _createFilterRow() {
    const e = c("tr", {
      class: "filter-row"
    });
    return this.table.columns.forEach((t) => {
      const n = c("td");
      if (t.filterable !== !1) {
        const i = c("div", {
          class: "filter-container"
        }), s = c("span", {
          class: "filter-icon",
          "data-field": t.field
        });
        s.innerHTML = "&#9776;", i.appendChild(s);
        const a = c("div", {
          class: "filter-dropdown",
          "data-field": t.field
        }), l = this._createFilterInput(t);
        a.appendChild(l), this._addAdvancedFilterOptions(a, t), i.appendChild(a), this.elements.filterInputs.set(t.field, l), n.appendChild(i);
      }
      e.appendChild(n);
    }), e;
  }
  /**
   * Add advanced filter options to dropdown
   * @private
   * @param {HTMLElement} dropdown - Dropdown element
   * @param {Object} column - Column configuration
   */
  _addAdvancedFilterOptions(e, t) {
    const n = t.dataType || "string", i = c("div", {
      class: "filter-options"
    });
    switch (n) {
      case "string":
        this._addFilterOption(i, t, "contains", "Contains"), this._addFilterOption(i, t, "equals", "Equals"), this._addFilterOption(i, t, "startsWith", "Starts With"), this._addFilterOption(i, t, "endsWith", "Ends With"), this._addFilterOption(i, t, "fuzzy", "Fuzzy Search"), this._addFilterOption(i, t, "regex", "Regex");
        break;
      case "number":
        this._addFilterOption(i, t, "equals", "Equals"), this._addFilterOption(i, t, "range", "Between"), this._addFilterOption(i, t, "greaterThan", "Greater Than"), this._addFilterOption(i, t, "lessThan", "Less Than");
        break;
      case "date":
        this._addFilterOption(i, t, "equals", "On Date"), this._addFilterOption(i, t, "dateRange", "Between Dates"), this._addFilterOption(i, t, "date", "Before/After");
        break;
    }
    e.appendChild(i);
  }
  /**
   * Add a filter option to the options container
   * @private
   * @param {HTMLElement} container - Options container
   * @param {Object} column - Column configuration
   * @param {string} filterType - Filter type
   * @param {string} label - Option label
   */
  _addFilterOption(e, t, n, i) {
    const s = c("div", {
      class: "filter-option",
      "data-field": t.field,
      "data-filter-type": n
    });
    s.textContent = i, e.appendChild(s);
  }
  /**
   * Create a filter input for a column
   * @private
   * @param {Object} column - Column configuration
   * @returns {HTMLElement} The filter input element
   */
  _createFilterInput(e) {
    const t = e.dataType || "string", n = e.filterType || t;
    let i;
    switch (n) {
      case "boolean":
        i = c("select", {
          "data-field": e.field,
          "data-filter-type": "boolean",
          // Explicitly set filter type to boolean
          class: "filter-input filter-select"
        }), [
          { value: "", text: "All" },
          { value: "yes", text: "Yes" },
          // Use 'yes' instead of 'true'
          { value: "no", text: "No" }
          // Use 'no' instead of 'false'
        ].forEach((p) => {
          const g = c("option", {
            value: p.value
          });
          g.textContent = p.text, i.appendChild(g);
        });
        break;
      case "date":
        i = c("input", {
          type: "date",
          "data-field": e.field,
          class: "filter-input filter-date"
        });
        break;
      case "number":
        const a = c("div", {
          class: "filter-number-container"
        }), l = c("input", {
          type: "number",
          "data-field": e.field,
          "data-range-type": "min",
          class: "filter-input filter-number",
          placeholder: "Min"
        }), o = c("input", {
          type: "number",
          "data-field": e.field,
          "data-range-type": "max",
          class: "filter-input filter-number",
          placeholder: "Max"
        });
        a.appendChild(l), a.appendChild(o), this.elements.filterInputs.set(`${e.field}-min`, l), this.elements.filterInputs.set(`${e.field}-max`, o), i = a;
        break;
      case "select":
        i = c("select", {
          "data-field": e.field,
          class: "filter-input filter-select"
        });
        const d = c("option", {
          value: ""
        });
        d.textContent = "All", i.appendChild(d);
        const h = /* @__PURE__ */ new Set();
        this.table.data.forEach((p) => {
          p[e.field] !== void 0 && p[e.field] !== null && h.add(p[e.field]);
        }), Array.from(h).sort().forEach((p) => {
          const g = c("option", {
            value: p
          });
          g.textContent = p, i.appendChild(g);
        });
        break;
      case "string":
      default:
        i = c("input", {
          type: "text",
          "data-field": e.field,
          class: "filter-input filter-text",
          placeholder: `Filter ${e.title || e.field}...`
        });
        break;
    }
    return i;
  }
  /**
   * Update filter input values to match current filters
   * @private
   */
  _updateFilterInputs() {
    const e = this.table.getCurrentFilters();
    this.elements.filterInputs.forEach((t, n) => {
      if (n.includes("-min") || n.includes("-max")) {
        const [i, s] = n.split("-"), a = e.find((l) => l.column === i && l.type === "range");
        a ? s === "min" && a.min !== void 0 ? t.value = a.min : s === "max" && a.max !== void 0 && (t.value = a.max) : t.value = "";
      } else {
        const i = e.find((s) => s.column === n);
        i && i.value !== void 0 ? t.value = i.value : t.value = "";
      }
    });
  }
  /**
   * Create the table body
   * @private
   * @returns {HTMLElement} The table body element
   */
  _createBody() {
    const e = c("tbody"), t = this.table.getDisplayData();
    if (t.length === 0) {
      const n = c("tr", {
        class: "empty-row"
      }), i = c("td", {
        colspan: this.table.columns.length
      });
      i.textContent = "No data to display", n.appendChild(i), e.appendChild(n);
    } else
      t.forEach((n, i) => {
        const s = c("tr", {
          "data-row-index": i
        });
        if (this.table.options.rowLink) {
          const a = typeof this.table.options.rowLink == "function" ? this.table.options.rowLink(n) : this.table.options.rowLink.replace("{id}", encodeURIComponent(n.id));
          s.dataset.href = a, s.style.cursor = "pointer", s.addEventListener("click", (l) => {
            l.target.tagName !== "A" && (window.location.href = a);
          });
        }
        this.table.columns.forEach((a) => {
          const l = c("td", {
            "data-field": a.field
          });
          let o = n[a.field];
          if (a.formatter)
            o = a.formatter(o, n, a);
          else if (a.dataType === "date" && o)
            try {
              o = new Date(o).toLocaleDateString();
            } catch {
            }
          else if (a.dataType === "boolean")
            o = o ? "Yes" : "No";
          else if (a.dataType === "currency" && o !== null && o !== void 0)
            try {
              o = v(o, a.countryCode || "US");
            } catch (d) {
              console.error("Error formatting currency:", d);
            }
          if (o == null && (o = ""), a.link) {
            const d = c("a", {
              href: typeof a.link == "function" ? a.link(o, n, a) : a.link.replace("{value}", encodeURIComponent(o))
            });
            d.textContent = o, l.appendChild(d);
          } else
            l.textContent = o;
          s.appendChild(l);
        }), e.appendChild(s);
      });
    return e;
  }
  /**
   * Create pagination controls
   * @private
   * @returns {HTMLElement} The pagination controls container
   */
  _createPaginationControls() {
    const e = c("div", {
      class: "filter-table-pagination"
    }), { currentPage: t, pageSize: n, pageSizeOptions: i } = this.table.paginationOptions, s = this.table.filteredData.length, a = Math.ceil(s / n), l = c("div", {
      class: "pagination-page-size"
    }), o = c("span");
    o.textContent = "Rows per page: ", l.appendChild(o);
    const d = c("select", {
      class: "page-size-select"
    });
    i.forEach((f) => {
      const L = c("option", {
        value: f,
        selected: f === n ? "selected" : null
      });
      L.textContent = f, d.appendChild(L);
    }), d.addEventListener("change", () => {
      const f = parseInt(d.value, 10);
      this.table.changePageSize(f);
    }), l.appendChild(d), e.appendChild(l);
    const h = c("div", {
      class: "pagination-navigation"
    }), p = c("span", {
      class: "pagination-info"
    }), g = s === 0 ? 0 : (t - 1) * n + 1, y = Math.min(t * n, s);
    p.textContent = `${g}-${y} of ${s}`, h.appendChild(p);
    const oe = this._createPaginationButton("«", 1, t <= 1), ce = this._createPaginationButton("‹", t - 1, t <= 1), de = this._createPaginationButton("›", t + 1, t >= a), ue = this._createPaginationButton("»", a, t >= a);
    h.appendChild(oe), h.appendChild(ce);
    const T = 5;
    let S = Math.max(1, t - Math.floor(T / 2)), O = Math.min(a, S + T - 1);
    if (O - S < T - 1 && (S = Math.max(1, O - T + 1)), S > 1) {
      const f = c("span", {
        class: "pagination-ellipsis"
      });
      f.textContent = "...", h.appendChild(f);
    }
    for (let f = S; f <= O; f++) {
      const L = this._createPaginationButton(f, f, !1, f === t);
      h.appendChild(L);
    }
    if (O < a) {
      const f = c("span", {
        class: "pagination-ellipsis"
      });
      f.textContent = "...", h.appendChild(f);
    }
    return h.appendChild(de), h.appendChild(ue), e.appendChild(h), e;
  }
  /**
   * Create a pagination button
   * @private
   * @param {string|number} text - Button text
   * @param {number} page - Page number to navigate to
   * @param {boolean} disabled - Whether the button is disabled
   * @param {boolean} active - Whether the button is active (current page)
   * @returns {HTMLElement} The pagination button
   */
  _createPaginationButton(e, t, n = !1, i = !1) {
    console.log(`Creating pagination button: text=${e}, page=${t}, disabled=${n}, active=${i}`);
    const s = c("button", {
      class: `pagination-button${i ? " active" : ""}`,
      ...n ? { disabled: !0 } : {},
      "data-page": t
    });
    return s.textContent = e, !n && !i && s.addEventListener("click", (a) => {
      console.log(`Pagination button clicked: page=${t}`), this.table.goToPage(t);
    }), s;
  }
  /**
   * Create loading indicator for endless scrolling
   * @private
   * @returns {HTMLElement} The loading indicator
   */
  _createLoadingIndicator() {
    const e = c("div", {
      class: "filter-table-loading"
    }), t = c("div", {
      class: "loading-spinner"
    }), n = c("span", {
      class: "loading-text"
    });
    return this._updateLoadingIndicatorState(e, t, n), e.appendChild(t), e.appendChild(n), e;
  }
  /**
   * Update loading indicator state
   * @private
   * @param {HTMLElement} indicator - Loading indicator element
   * @param {HTMLElement} spinner - Spinner element
   * @param {HTMLElement} text - Loading text element
   */
  _updateLoadingIndicatorState(e, t, n) {
    const { loadedItems: i } = this.table.endlessScrollingOptions, s = this.table.filteredData.length;
    i >= s ? e.style.display = "none" : (e.style.display = "flex", t.style.display = "inline-block", n.textContent = `Showing ${i} of ${s} items`);
  }
  /**
   * Update loading indicator
   * @private
   */
  _updateLoadingIndicator() {
    if (!this.elements.loadingIndicator) return;
    const e = this.elements.loadingIndicator.querySelector(".loading-spinner"), t = this.elements.loadingIndicator.querySelector(".loading-text");
    this._updateLoadingIndicatorState(this.elements.loadingIndicator, e, t);
  }
}
function U(r, e, t = !1) {
  let n;
  return function(...s) {
    const a = this, l = function() {
      n = null, t || r.apply(a, s);
    }, o = t && !n;
    clearTimeout(n), n = setTimeout(l, e), o && r.apply(a, s);
  };
}
class me {
  /**
   * Create a new EventManager instance
   * @param {Table} tableInstance - The Table instance to manage events for
   */
  constructor(e) {
    this.table = e, this.listeners = /* @__PURE__ */ new Map(), this.boundHandlers = /* @__PURE__ */ new Map(), this.customEventListeners = /* @__PURE__ */ new Map(), this.debouncedFilterHandler = U(this._handleFilterChange.bind(this), 300);
  }
  /**
   * Attach all event listeners to the table
   */
  attachEvents() {
    this._attachFilterEvents(), this._attachFilterIconEvents(), this._attachFilterOptionEvents(), this._attachSortEvents(), this._attachRowEvents();
  }
  /**
   * Detach all event listeners from the table
   */
  detachEvents() {
    this.listeners.forEach((e, t) => {
      const [n, i] = e;
      t.removeEventListener(n, i);
    }), this.listeners.clear(), this.boundHandlers.clear();
  }
  /**
   * Add a custom event listener
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute
   * @returns {Function} Function to remove the listener
   */
  on(e, t) {
    return this.customEventListeners.has(e) || this.customEventListeners.set(e, /* @__PURE__ */ new Set()), this.customEventListeners.get(e).add(t), () => {
      const n = this.customEventListeners.get(e);
      n && n.delete(t);
    };
  }
  /**
   * Trigger a custom event
   * @param {string} eventType - Type of event to trigger
   * @param {Object} data - Data to pass to event handlers
   */
  trigger(e, t = {}) {
    const n = this.customEventListeners.get(e);
    n && n.forEach((i) => {
      try {
        i(t);
      } catch (s) {
        console.error(`Error in ${e} event handler:`, s);
      }
    });
  }
  /**
   * Attach filter event listeners
   * @private
   */
  _attachFilterEvents() {
    const { filterInputs: e } = this.table.renderer.elements;
    e.forEach((t, n) => {
      n.includes("-min") || n.includes("-max") ? this._addEventListener(t, "input", this.debouncedFilterHandler) : t.tagName === "SELECT" ? this._addEventListener(t, "change", this.debouncedFilterHandler) : this._addEventListener(t, "input", this.debouncedFilterHandler);
    });
  }
  /**
   * Attach sort event listeners
   * @private
   */
  _attachSortEvents() {
    this.table.renderer.elements.thead.querySelectorAll("th.sortable").forEach((t) => {
      this._addEventListener(t, "click", this._handleSort.bind(this));
    });
  }
  /**
   * Attach row event listeners
   * @private
   */
  _attachRowEvents() {
    this.table.renderer.elements.tbody.querySelectorAll("tr:not(.empty-row)").forEach((t) => {
      this._addEventListener(t, "click", this._handleRowClick.bind(this));
    });
  }
  /**
   * Add an event listener and track it for later removal
   * @private
   * @param {HTMLElement} element - Element to attach listener to
   * @param {string} eventType - Type of event to listen for
   * @param {Function} handler - Event handler function
   */
  _addEventListener(e, t, n) {
    this.listeners.set(e, [t, n]), e.addEventListener(t, n);
  }
  /**
   * Handle filter input changes
   * @private
   * @param {Event} event - Input event
   */
  _handleFilterChange(e) {
    const t = e.target, n = t.getAttribute("data-field");
    if (n) {
      if (t.hasAttribute("data-range-type")) {
        const i = t.getAttribute("data-range-type"), s = t.value.trim();
        s === "" ? this._updateRangeFilter(n, i, void 0) : this._updateRangeFilter(n, i, parseFloat(s));
      } else if (t.tagName === "SELECT") {
        const i = t.value;
        if (i === "")
          this.table.removeFilter(n);
        else {
          const s = t.getAttribute("data-filter-type") || "equals";
          this.table.addFilter({
            column: n,
            type: s,
            value: i
          }), console.log("Adding filter:", {
            column: n,
            type: s,
            value: i
          });
        }
      } else {
        const i = t.value.trim();
        if (i === "")
          this.table.removeFilter(n);
        else {
          const s = t.type === "date" ? "date" : "contains";
          this.table.addFilter({
            column: n,
            type: s,
            value: i
          });
        }
      }
      this.trigger("filterChange", {
        filters: this.table.getCurrentFilters()
      });
    }
  }
  /**
   * Update a range filter
   * @private
   * @param {string} field - Field to filter on
   * @param {string} rangeType - Type of range ('min' or 'max')
   * @param {number} value - Filter value
   */
  _updateRangeFilter(e, t, n) {
    const s = this.table.getCurrentFilters().find((a) => a.column === e && a.type === "range");
    if (s)
      t === "min" ? s.min = n : s.max = n, s.min === void 0 && s.max === void 0 ? this.table.removeFilter(e) : this.table.addFilter(s);
    else if (n !== void 0) {
      const a = {
        column: e,
        type: "range"
      };
      t === "min" ? a.min = n : a.max = n, this.table.addFilter(a);
    }
  }
  /**
   * Handle sort header click
   * @private
   * @param {Event} event - Click event
   */
  _handleSort(e) {
    const t = e.currentTarget, n = t.getAttribute("data-field");
    if (!n) return;
    const i = t.getAttribute("data-sort-direction") || "none";
    let s;
    i === "none" ? s = "asc" : i === "asc" ? s = "desc" : s = "none", t.setAttribute("data-sort-direction", s), this.table.renderer.elements.thead.querySelectorAll('th:not([data-field="' + n + '"])').forEach((l) => {
      l.removeAttribute("data-sort-direction");
    }), this.trigger("sort", {
      field: n,
      direction: s
    }), this.table.refresh();
  }
  /**
   * Attach filter icon event listeners
   * @private
   */
  _attachFilterIconEvents() {
    this.table.renderer.elements.table.querySelectorAll(".filter-icon").forEach((t) => {
      this._addEventListener(t, "click", this._handleFilterIconClick.bind(this));
    });
  }
  /**
   * Attach filter option event listeners
   * @private
   */
  _attachFilterOptionEvents() {
    this.table.renderer.elements.table.querySelectorAll(".filter-option").forEach((t) => {
      this._addEventListener(t, "click", this._handleFilterOptionClick.bind(this));
    });
  }
  /**
   * Handle filter icon click
   * @private
   * @param {Event} event - Click event
   */
  _handleFilterIconClick(e) {
    const t = e.currentTarget, n = t.getAttribute("data-field");
    if (!n) return;
    const i = t.parentElement.querySelector(`.filter-dropdown[data-field="${n}"]`);
    if (!i) return;
    const s = i.classList.contains("visible");
    this.table.renderer.elements.table.querySelectorAll(".filter-dropdown").forEach((o) => o.classList.remove("visible")), s || i.classList.add("visible"), e.stopPropagation();
    const l = (o) => {
      !i.contains(o.target) && o.target !== t && (i.classList.remove("visible"), document.removeEventListener("click", l));
    };
    document.addEventListener("click", l);
  }
  /**
   * Handle filter option click
   * @private
   * @param {Event} event - Click event
   */
  _handleFilterOptionClick(e) {
    const t = e.currentTarget, n = t.getAttribute("data-field"), i = t.getAttribute("data-filter-type");
    if (!n || !i) return;
    const s = this.table.renderer.elements.filterInputs.get(n);
    if (!s) return;
    switch (i) {
      case "contains":
      case "equals":
      case "startsWith":
      case "endsWith":
        const l = s.value.trim();
        l && this.table.addFilter({
          column: n,
          type: i,
          value: l
        });
        break;
      case "fuzzy":
        const o = s.value.trim();
        if (o) {
          const y = prompt("Enter fuzzy search tolerance (0-1):", "0.3");
          y !== null && this.table.addFilter({
            column: n,
            type: "fuzzy",
            value: o,
            tolerance: parseFloat(y)
          });
        }
        break;
      case "regex":
        const d = prompt("Enter regex pattern:", s.value.trim());
        if (d) {
          const y = prompt("Enter regex flags (optional):", "i");
          this.table.addFilter({
            column: n,
            type: "regex",
            pattern: d,
            flags: y
          });
        }
        break;
      case "range":
        break;
      case "greaterThan":
        const h = prompt("Enter minimum value:");
        h !== null && this.table.addFilter({
          column: n,
          type: "greaterThan",
          value: parseFloat(h)
        });
        break;
      case "lessThan":
        const p = prompt("Enter maximum value:");
        p !== null && this.table.addFilter({
          column: n,
          type: "lessThan",
          value: parseFloat(p)
        });
        break;
      case "dateRange":
        const g = prompt("Enter start date (YYYY-MM-DD):");
        if (g !== null) {
          const y = prompt("Enter end date (YYYY-MM-DD):");
          y !== null && this.table.addFilter({
            column: n,
            type: "dateRange",
            start: g,
            end: y
          });
        }
        break;
    }
    const a = t.closest(".filter-dropdown");
    a && a.classList.remove("visible"), this.trigger("filterChange", {
      filters: this.table.getCurrentFilters()
    });
  }
  /**
   * Handle row click
   * @private
   * @param {Event} event - Click event
   */
  _handleRowClick(e) {
    const t = e.currentTarget, n = parseInt(t.getAttribute("data-row-index"), 10), i = this.table.filteredData[n];
    this.trigger("rowClick", {
      row: i,
      index: n,
      originalEvent: e
    });
  }
}
function be(r, e, t) {
  if (r == null)
    return !1;
  const n = String(r), i = String(e.value);
  return e.caseSensitive ? n.includes(i) : n.toLowerCase().includes(i.toLowerCase());
}
function Ee(r, e) {
  return r == null ? e.value === null || e.value === void 0 || e.value === "" : typeof r == "string" && typeof e.value == "string" ? r.toLowerCase() === e.value.toLowerCase() : r == e.value;
}
function Se(r, e) {
  if (r == null)
    return !1;
  const t = String(r), n = String(e.value);
  return e.caseSensitive ? t.startsWith(n) : t.toLowerCase().startsWith(n.toLowerCase());
}
function Ce(r, e) {
  if (r == null)
    return !1;
  const t = String(r), n = String(e.value);
  return e.caseSensitive ? t.endsWith(n) : t.toLowerCase().endsWith(n.toLowerCase());
}
function Ae(r, e) {
  if (r == null)
    return !1;
  const t = Number(r);
  if (isNaN(t))
    return !1;
  const { min: n, max: i } = e;
  return n !== void 0 && i !== void 0 ? t >= n && t <= i : n !== void 0 ? t >= n : i !== void 0 ? t <= i : !0;
}
function De(r, e) {
  if (r == null)
    return !1;
  const t = Number(r), n = Number(e.value);
  return isNaN(t) || isNaN(n) ? !1 : t > n;
}
function Te(r, e) {
  if (r == null)
    return !1;
  const t = Number(r), n = Number(e.value);
  return isNaN(t) || isNaN(n) ? !1 : t < n;
}
function Oe(r, e) {
  if (r == null)
    return !1;
  let t;
  try {
    if (t = new Date(r), isNaN(t.getTime()))
      return !1;
  } catch {
    return !1;
  }
  let n;
  try {
    if (n = new Date(e.value), isNaN(n.getTime()))
      return !1;
  } catch {
    return !1;
  }
  switch (t.setHours(0, 0, 0, 0), n.setHours(0, 0, 0, 0), e.comparison || "equals") {
    case "before":
      return t < n;
    case "after":
      return t > n;
    case "equals":
    default:
      return t.getTime() === n.getTime();
  }
}
function Le(r, e) {
  if (r == null)
    return !1;
  let t;
  try {
    if (t = new Date(r), isNaN(t.getTime()))
      return !1;
  } catch {
    return !1;
  }
  t.setHours(0, 0, 0, 0);
  const { start: n, end: i } = e;
  if (n && i) {
    const s = new Date(n), a = new Date(i);
    return s.setHours(0, 0, 0, 0), a.setHours(0, 0, 0, 0), t >= s && t <= a;
  } else if (n) {
    const s = new Date(n);
    return s.setHours(0, 0, 0, 0), t >= s;
  } else if (i) {
    const s = new Date(i);
    return s.setHours(0, 0, 0, 0), t <= s;
  }
  return !0;
}
function we(r, e, t) {
  if (r == null)
    return !1;
  let n;
  if (typeof e.value == "string") {
    const s = e.value.toLowerCase();
    s === "true" || s === "yes" || s === "1" ? n = !0 : s === "false" || s === "no" || s === "0" ? n = !1 : n = !!e.value;
  } else typeof e.value == "number" ? n = e.value !== 0 : n = !!e.value;
  let i;
  if (typeof r == "boolean")
    i = r;
  else if (typeof r == "string") {
    const s = r.toLowerCase();
    s === "true" || s === "yes" || s === "1" ? i = !0 : s === "false" || s === "no" || s === "0" ? i = !1 : i = !!r;
  } else typeof r == "number" ? i = r !== 0 : i = !!r;
  return console.log("Boolean filter:", {
    cellValue: r,
    cellBoolean: i,
    filterValue: e.value,
    targetBoolean: n
  }), i === n;
}
function se(r, e) {
  return r == null || !e.values || !Array.isArray(e.values) ? !1 : e.values.some((t) => typeof r == "string" && typeof t == "string" ? r.toLowerCase() === t.toLowerCase() : r == t);
}
function Fe(r, e) {
  return !se(r, e);
}
function ae(r) {
  return r == null || r === "";
}
function Re(r) {
  return !ae(r);
}
const Ne = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  boolean: we,
  contains: be,
  date: Oe,
  dateRange: Le,
  empty: ae,
  endsWith: Ce,
  equals: Ee,
  greaterThan: De,
  inList: se,
  lessThan: Te,
  notEmpty: Re,
  notInList: Fe,
  range: Ae,
  startsWith: Se
}, Symbol.toStringTag, { value: "Module" }));
function Me(r, e) {
  if (r == null)
    return !1;
  const t = String(r).toLowerCase(), n = String(e.value).toLowerCase(), i = e.tolerance !== void 0 ? e.tolerance : 0.3;
  if (n === "")
    return !0;
  if (n.length <= 2)
    return t.includes(n);
  if (t.includes(n))
    return !0;
  if (t.length > n.length) {
    for (let l = 0; l <= t.length - n.length; l++) {
      const o = t.substring(l, l + n.length);
      if (w(o, n) / n.length <= i)
        return !0;
    }
    const s = t.split(/\s+/), a = n.split(/\s+/);
    for (const l of a) {
      if (l.length < 3) continue;
      let o = !1;
      for (const d of s)
        if (d.includes(l) || w(d, l) <= Math.ceil(l.length * i)) {
          o = !0;
          break;
        }
      if (!o)
        return !1;
    }
    return a.length > 0;
  } else {
    const s = w(t, n), a = Math.max(t.length, n.length);
    return s / a <= i;
  }
}
function w(r, e) {
  const t = [];
  for (let n = 0; n <= e.length; n++)
    t[n] = [n];
  for (let n = 0; n <= r.length; n++)
    t[0][n] = n;
  for (let n = 1; n <= e.length; n++)
    for (let i = 1; i <= r.length; i++)
      e.charAt(n - 1) === r.charAt(i - 1) ? t[n][i] = t[n - 1][i - 1] : t[n][i] = Math.min(
        t[n - 1][i - 1] + 1,
        // Substitution
        t[n][i - 1] + 1,
        // Insertion
        t[n - 1][i] + 1
        // Deletion
      );
  return t[e.length][r.length];
}
function _e(r, e) {
  if (r == null)
    return !1;
  const t = String(r);
  try {
    const n = e.flags || "i";
    return new RegExp(e.pattern, n).test(t);
  } catch (n) {
    return console.warn("Invalid regex pattern:", n), !1;
  }
}
function Ie(r, e) {
  return r == null ? !1 : !e.values || !Array.isArray(e.values) || e.values.length === 0 ? !0 : Array.isArray(r) ? r.some(
    (t) => e.values.some(
      (n) => typeof t == "string" && typeof n == "string" ? t.toLowerCase() === n.toLowerCase() : t == n
    )
  ) : e.values.some(
    (t) => typeof r == "string" && typeof t == "string" ? r.toLowerCase() === t.toLowerCase() : r == t
  );
}
function Be(r, e, t) {
  if (r == null)
    return !1;
  const n = e.value, i = e.hierarchy || {};
  if (r === n)
    return !0;
  let s = r;
  for (; i[s]; )
    if (s = i[s], s === n)
      return !0;
  return !1;
}
function Pe(r, e, t) {
  if (r == null)
    return !1;
  const n = e.typeMap || {}, i = e.filterParams || {};
  let s;
  if (typeof r == "number")
    s = "number";
  else if (typeof r == "boolean")
    s = "boolean";
  else if (typeof r == "string") {
    const l = new Date(r);
    isNaN(l.getTime()) ? s = "string" : s = "date";
  } else Array.isArray(r) ? s = "array" : s = "object";
  switch (n[s] || "contains") {
    case "equals":
      return r == e.value;
    case "contains":
      return String(r).toLowerCase().includes(String(e.value).toLowerCase());
    case "range":
      if (s === "number") {
        const l = Number(r), o = i.min !== void 0 ? Number(i.min) : -1 / 0, d = i.max !== void 0 ? Number(i.max) : 1 / 0;
        return l >= o && l <= d;
      }
      return !1;
    case "date":
      try {
        const l = new Date(r), o = new Date(e.value);
        return l.getTime() === o.getTime();
      } catch {
        return !1;
      }
    default:
      return !1;
  }
}
function Ue(r, e) {
  if (r == null)
    return !1;
  const t = String(r).toLowerCase(), n = String(e.value).toLowerCase(), i = e.suggestions || [], s = e.tolerance !== void 0 ? e.tolerance : 0.3;
  return n === "" || t.includes(n) ? !0 : i.some((a) => {
    const l = String(a).toLowerCase();
    if (l.includes(n))
      return !0;
    const o = w(l, n), d = n.length * s;
    return o <= d;
  });
}
function ve(r, e) {
  if (r == null)
    return !1;
  const t = String(r).toLowerCase(), i = String(e.value).toLowerCase().split(/\s+/).filter((s) => s.length > 0);
  return i.length === 0 ? !0 : i.every((s) => t.includes(s));
}
function xe(r, e) {
  if (r == null)
    return !1;
  const t = String(r).toLowerCase(), n = String(e.value).toLowerCase(), i = X(t), s = X(n);
  return i === s;
}
function X(r) {
  const e = r.toLowerCase().split(""), t = e[0], n = e.map((l) => {
    const o = "bfpvcgjkqsxzdtlmnr".indexOf(l);
    return o >= 0 ? Math.floor(o / 4) + 1 : 0;
  });
  let i = -1;
  const s = n.filter((l, o) => o === 0 || l === 0 || l !== i ? (i = l, !0) : !1);
  return (t + s.slice(1, 4).join("") + "000").slice(0, 4);
}
const Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  contextual: Pe,
  fuzzy: Me,
  hierarchical: Be,
  multiSelect: Ie,
  phonetic: xe,
  regex: _e,
  suggestion: Ue,
  wordMatch: ve
}, Symbol.toStringTag, { value: "Module" }));
function He(r, e, t) {
  if (!Array.isArray(r) || r.length === 0)
    return () => !0;
  const n = r.map((i) => {
    const { column: s, type: a = "contains", ...l } = i, o = t[a] || t.contains;
    return (d) => {
      const h = d[s];
      return o(h, l, d);
    };
  });
  return (i) => n.some((s) => s(i));
}
class ke {
  /**
   * Create a new FilterManager instance
   * @param {Table} tableInstance - The Table instance to manage filters for
   */
  constructor(e) {
    this.table = e, this.activeFilters = [], this.filterGroups = [], this.filters = {
      ...Ne,
      ...Ge
    };
  }
  /**
   * Add a filter to the table
   * @param {Object} filterConfig - Filter configuration
   */
  addFilter(e) {
    if (!e || !e.column)
      throw new Error("Invalid filter configuration: missing column");
    this.removeFilter(e.column), this.activeFilters.push({ ...e });
  }
  /**
   * Remove a filter from the table
   * @param {string} column - Column field to remove filter from
   */
  removeFilter(e) {
    this.activeFilters = this.activeFilters.filter((t) => t.column !== e);
  }
  /**
   * Clear all filters from the table
   */
  clearFilters() {
    this.activeFilters = [], this.filterGroups = [];
  }
  /**
   * Add a filter group with multiple filters and logical operator
   * @param {Object} groupConfig - Filter group configuration
   */
  addFilterGroup(e) {
    if (!e || !e.filters || !Array.isArray(e.filters))
      throw new Error("Invalid filter group configuration: missing filters array");
    if (!e.operator || !["AND", "OR"].includes(e.operator.toUpperCase()))
      throw new Error('Invalid filter group configuration: operator must be "AND" or "OR"');
    this.filterGroups.push({
      operator: e.operator.toUpperCase(),
      filters: [...e.filters]
    });
  }
  /**
   * Get the current set of active filters
   * @returns {Object} Current filter configuration
   */
  getCurrentFilters() {
    return [
      ...this.activeFilters,
      ...this.filterGroups.flatMap((e) => e.filters)
    ];
  }
  /**
   * Set filters from a configuration object
   * @param {Object} filters - Filter configuration to apply
   */
  setFilters(e) {
    this.clearFilters(), e && (Array.isArray(e) ? e.forEach((t) => {
      this.addFilter(t);
    }) : e.groups && Array.isArray(e.groups) && (e.groups.forEach((t) => {
      this.addFilterGroup(t);
    }), e.filters && Array.isArray(e.filters) && e.filters.forEach((t) => {
      this.addFilter(t);
    })));
  }
  /**
   * Apply all active filters to the data
   * @param {Array} data - Data to filter
   * @returns {Array} Filtered data
   */
  applyFilters(e) {
    if (!e || !Array.isArray(e))
      return [];
    if (this.activeFilters.length === 0 && this.filterGroups.length === 0)
      return [...e];
    let t = this._applyIndividualFilters(e);
    return t = this._applyFilterGroups(t), t;
  }
  /**
   * Apply individual filters to the data
   * @private
   * @param {Array} data - Data to filter
   * @returns {Array} Filtered data
   */
  _applyIndividualFilters(e) {
    return this.activeFilters.reduce((t, n) => this._applyFilter(t, n), [...e]);
  }
  /**
   * Apply filter groups to the data
   * @private
   * @param {Array} data - Data to filter
   * @returns {Array} Filtered data
   */
  _applyFilterGroups(e) {
    return this.filterGroups.reduce((t, n) => {
      const { operator: i, filters: s } = n;
      if (i === "AND")
        return s.reduce((a, l) => this._applyFilter(a, l), t);
      if (i === "OR") {
        const a = He(s, "OR", this.filters);
        return t.filter((l) => a(l));
      }
      return t;
    }, [...e]);
  }
  /**
   * Apply a single filter to the data
   * @private
   * @param {Array} data - Data to filter
   * @param {Object} filterConfig - Filter configuration
   * @returns {Array} Filtered data
   */
  _applyFilter(e, t) {
    const { column: n, type: i = "contains", ...s } = t, a = this._getFilterFunction(i);
    return a ? e.filter((l) => {
      const o = l[n];
      return a(o, s, l);
    }) : (console.warn(`Unknown filter type: ${i}`), e);
  }
  /**
   * Get a filter function by type
   * @private
   * @param {string} type - Filter type
   * @returns {Function} Filter function
   */
  _getFilterFunction(e) {
    return this.filters[e] ? this.filters[e] : this.filters.contains;
  }
  /**
   * Register a custom filter
   * @param {string} type - Filter type
   * @param {Function} filterFn - Filter function
   */
  registerFilter(e, t) {
    if (typeof t != "function")
      throw new Error("Filter must be a function");
    this.filters[e] = t;
  }
}
class ze {
  /**
   * Create a new Table instance
   * @param {string|HTMLElement} container - CSS selector or DOM element to render the table in
   * @param {Object} options - Configuration options
   */
  constructor(e, t = {}) {
    var n, i, s, a, l, o, d, h;
    if (this._validateOptions(t), this.options = { ...t }, this.container = typeof e == "string" ? document.querySelector(e) : e, !this.container)
      throw new Error(`Container not found: ${e}`);
    this.data = [...t.data || []], this.originalData = [...this.data], this.columns = [...t.columns || []], this.filteredData = [...this.data], this.data.length > 0 && this._autoDetectColumnTypes(), this.paginationOptions = {
      enabled: ((n = t.pagination) == null ? void 0 : n.enabled) || !1,
      pageSize: ((i = t.pagination) == null ? void 0 : i.pageSize) || 10,
      currentPage: ((s = t.pagination) == null ? void 0 : s.currentPage) || 1,
      pageSizeOptions: ((a = t.pagination) == null ? void 0 : a.pageSizeOptions) || [10, 25, 50, 100]
    }, this.endlessScrollingOptions = {
      enabled: ((l = t.endlessScrolling) == null ? void 0 : l.enabled) || !1,
      itemsPerLoad: ((o = t.endlessScrolling) == null ? void 0 : o.itemsPerLoad) || 20,
      loadMoreThreshold: ((d = t.endlessScrolling) == null ? void 0 : d.loadMoreThreshold) || 200,
      loadedItems: ((h = t.endlessScrolling) == null ? void 0 : h.initialItems) || 20
    }, this.paginationOptions.enabled && this.endlessScrollingOptions.enabled && (console.warn("Both pagination and endless scrolling are enabled. Defaulting to pagination."), this.endlessScrollingOptions.enabled = !1), this.filterManager = new ke(this), this.renderer = new ye(this), this.eventManager = new me(this), t.filters && this.applyFilters(t.filters), this.render(), this._debouncedRefresh = U(() => this.refresh(), 150), this.endlessScrollingOptions.enabled && this._setupEndlessScrolling();
  }
  /**
   * Validate constructor options
   * @private
   * @param {Object} options - Options to validate
   */
  _validateOptions(e) {
    if (e.data && !Array.isArray(e.data))
      throw new Error("Data must be an array");
    if (e.columns && !Array.isArray(e.columns))
      throw new Error("Columns must be an array");
  }
  /**
   * Auto-detect column data types based on data
   * @private
   */
  _autoDetectColumnTypes() {
    const e = this.data.slice(0, Math.min(20, this.data.length)), t = re(e);
    this.columns.forEach((n) => {
      !n.dataType && t[n.field] && (n.dataType = t[n.field]);
    });
  }
  /**
   * Render the table
   */
  render() {
    this.renderer.render(), this.eventManager.attachEvents();
  }
  /**
   * Refresh the table with current data and filters
   */
  refresh() {
    this.filteredData = this.filterManager.applyFilters(this.data), this._applySorting(), this.paginationOptions.enabled && (this.paginationOptions.currentPage = 1), this.endlessScrollingOptions.enabled && (this.endlessScrollingOptions.loadedItems = this.endlessScrollingOptions.itemsPerLoad), this.renderer.update(), this.eventManager.trigger("refresh", {
      filteredData: this.filteredData,
      totalRows: this.filteredData.length,
      originalRows: this.data.length
    });
  }
  /**
   * Apply sorting to the filtered data
   * @private
   */
  _applySorting() {
    const e = this.renderer.elements.thead.querySelectorAll("th");
    let t = null, n = null;
    if (e.forEach((s) => {
      const a = s.getAttribute("data-sort-direction");
      a && a !== "none" && (t = s.getAttribute("data-field"), n = a);
    }), !t || !n)
      return;
    const i = this.columns.find((s) => s.field === t);
    i && this.filteredData.sort((s, a) => {
      let l = s[t], o = a[t];
      if (l == null)
        return n === "asc" ? -1 : 1;
      if (o == null)
        return n === "asc" ? 1 : -1;
      switch (i.dataType || typeof l) {
        case "number":
          l = Number(l), o = Number(o);
          break;
        case "date":
          l = new Date(l).getTime(), o = new Date(o).getTime();
          break;
        case "boolean":
          l = !!l, o = !!o;
          break;
        default:
          l = String(l).toLowerCase(), o = String(o).toLowerCase();
          break;
      }
      return l < o ? n === "asc" ? -1 : 1 : l > o ? n === "asc" ? 1 : -1 : 0;
    });
  }
  /**
   * Get the data to display based on pagination or endless scrolling settings
   * @returns {Array} Data to display
   */
  getDisplayData() {
    if (this.paginationOptions.enabled) {
      const e = (this.paginationOptions.currentPage - 1) * this.paginationOptions.pageSize, t = e + this.paginationOptions.pageSize;
      return this.filteredData.slice(e, t);
    } else return this.endlessScrollingOptions.enabled ? this.filteredData.slice(0, this.endlessScrollingOptions.loadedItems) : this.filteredData;
  }
  /**
   * Set up endless scrolling event listeners
   * @private
   */
  _setupEndlessScrolling() {
    if (!this.endlessScrollingOptions.enabled) return;
    const e = U(() => {
      if (!this.endlessScrollingOptions.enabled) return;
      const t = this.renderer.elements.table.getBoundingClientRect().bottom, n = window.innerHeight;
      t - n < this.endlessScrollingOptions.loadMoreThreshold && this.endlessScrollingOptions.loadedItems < this.filteredData.length && (this.endlessScrollingOptions.loadedItems += this.endlessScrollingOptions.itemsPerLoad, this.endlessScrollingOptions.loadedItems > this.filteredData.length && (this.endlessScrollingOptions.loadedItems = this.filteredData.length), this.renderer.update(), this.eventManager.trigger("loadMore", {
        loadedItems: this.endlessScrollingOptions.loadedItems,
        totalItems: this.filteredData.length
      }));
    }, 100);
    window.addEventListener("scroll", e), this._scrollHandler = e;
  }
  /**
   * Change the current page
   * @param {number} page - Page number to change to
   */
  goToPage(e) {
    if (!this.paginationOptions.enabled) return;
    const t = Math.ceil(this.filteredData.length / this.paginationOptions.pageSize);
    e < 1 ? e = 1 : e > t && (e = t), this.paginationOptions.currentPage = e, this.renderer.update(), this.eventManager.trigger("pageChange", {
      currentPage: e,
      totalPages: t,
      pageSize: this.paginationOptions.pageSize
    });
  }
  /**
   * Change the page size
   * @param {number} pageSize - New page size
   */
  changePageSize(e) {
    if (!this.paginationOptions.enabled) return;
    this.paginationOptions.pageSizeOptions.includes(e) || (console.warn(`Invalid page size: ${e}. Using default.`), e = this.paginationOptions.pageSizeOptions[0]);
    const t = (this.paginationOptions.currentPage - 1) * this.paginationOptions.pageSize;
    this.paginationOptions.pageSize = e;
    const n = Math.floor(t / e) + 1;
    this.paginationOptions.currentPage = n, this.renderer.update(), this.eventManager.trigger("pageSizeChange", {
      pageSize: e,
      currentPage: n,
      totalPages: Math.ceil(this.filteredData.length / e)
    });
  }
  /**
   * Enable or disable pagination
   * @param {boolean} enabled - Whether pagination should be enabled
   * @param {Object} options - Pagination options
   */
  setPagination(e, t = {}) {
    this.paginationOptions.enabled = e, t.pageSize && (this.paginationOptions.pageSize = t.pageSize), t.pageSizeOptions && (this.paginationOptions.pageSizeOptions = t.pageSizeOptions), this.paginationOptions.currentPage = 1, e && (this.endlessScrollingOptions.enabled = !1, this._scrollHandler && window.removeEventListener("scroll", this._scrollHandler)), this.render();
  }
  /**
   * Enable or disable endless scrolling
   * @param {boolean} enabled - Whether endless scrolling should be enabled
   * @param {Object} options - Endless scrolling options
   */
  setEndlessScrolling(e, t = {}) {
    this.endlessScrollingOptions.enabled = e, t.itemsPerLoad && (this.endlessScrollingOptions.itemsPerLoad = t.itemsPerLoad), t.loadMoreThreshold && (this.endlessScrollingOptions.loadMoreThreshold = t.loadMoreThreshold), this.endlessScrollingOptions.loadedItems = this.endlessScrollingOptions.itemsPerLoad, e ? (this.paginationOptions.enabled = !1, this._setupEndlessScrolling()) : this._scrollHandler && window.removeEventListener("scroll", this._scrollHandler), this.render();
  }
  /**
   * Set the display mode (default, pagination, or endless scrolling)
   * @param {string} mode - Display mode ('default', 'pagination', or 'endlessScrolling')
   * @param {Object} options - Options for the selected mode
   */
  setDisplayMode(e, t = {}) {
    switch (e) {
      case "pagination":
        this.setPagination(!0, t);
        break;
      case "endlessScrolling":
        this.setEndlessScrolling(!0, t);
        break;
      case "default":
      default:
        this.paginationOptions.enabled = !1, this.endlessScrollingOptions.enabled = !1, this._scrollHandler && window.removeEventListener("scroll", this._scrollHandler), this.render();
        break;
    }
  }
  /**
   * Add a filter to the table
   * @param {Object} filterConfig - Filter configuration
   */
  addFilter(e) {
    this.filterManager.addFilter(e), this._debouncedRefresh();
  }
  /**
   * Remove a filter from the table
   * @param {string} column - Column field to remove filter from
   */
  removeFilter(e) {
    this.filterManager.removeFilter(e), this._debouncedRefresh();
  }
  /**
   * Clear all filters from the table
   */
  clearFilters() {
    this.filterManager.clearFilters(), this._debouncedRefresh();
  }
  /**
   * Add a filter group with multiple filters and logical operator
   * @param {Object} groupConfig - Filter group configuration
   */
  addFilterGroup(e) {
    this.filterManager.addFilterGroup(e), this._debouncedRefresh();
  }
  /**
   * Get the current set of active filters
   * @returns {Object} Current filter configuration
   */
  getCurrentFilters() {
    return this.filterManager.getCurrentFilters();
  }
  /**
   * Apply a filter configuration
   * @param {Object} filters - Filter configuration to apply
   */
  applyFilters(e) {
    this.filterManager.setFilters(e), this._debouncedRefresh();
  }
  /**
   * Update the table data
   * @param {Array} data - New data array
   */
  setData(e) {
    if (!Array.isArray(e))
      throw new Error("Data must be an array");
    this.data = [...e], this.originalData = [...e], e.length > 0 && this.columns.some((t) => !t.dataType) && this._autoDetectColumnTypes(), this._debouncedRefresh();
  }
  /**
   * Get the current table data (after filtering)
   * @returns {Array} Current filtered data
   */
  getData() {
    return [...this.filteredData];
  }
  /**
   * Get the original unfiltered table data
   * @returns {Array} Original unfiltered data
   */
  getOriginalData() {
    return [...this.originalData];
  }
  /**
   * Set table columns configuration
   * @param {Array} columns - Column configuration array
   */
  setColumns(e) {
    if (!Array.isArray(e))
      throw new Error("Columns must be an array");
    this.columns = [...e], this.data.length > 0 && this._autoDetectColumnTypes(), this.render();
  }
  /**
   * Get current column configuration
   * @returns {Array} Current column configuration
   */
  getColumns() {
    return [...this.columns];
  }
  /**
   * Destroy the table instance and clean up resources
   */
  destroy() {
    this.eventManager.detachEvents(), this.renderer.clear(), this.filterManager.clearFilters(), this._scrollHandler && window.removeEventListener("scroll", this._scrollHandler), this.data = null, this.originalData = null, this.filteredData = null, this.columns = null, this.options = null;
  }
}
const E = "contains", C = "equals", x = "startsWith", G = "endsWith", F = "range", H = "greaterThan", k = "lessThan", R = "date", z = "dateRange", N = "boolean", A = "inList", D = "notInList", m = "empty", b = "notEmpty", M = "fuzzy", _ = "regex", I = "multiSelect", V = "hierarchical", K = "contextual", Y = "suggestion", B = "wordMatch", P = "phonetic", Z = "AND", $ = "OR", W = "NOT", j = "crossColumn", q = "complexGroup";
function Ve(r) {
  return {
    // Basic filter types
    [E]: "Contains",
    [C]: "Equals",
    [x]: "Starts With",
    [G]: "Ends With",
    [F]: "Range",
    [H]: "Greater Than",
    [k]: "Less Than",
    [R]: "Date",
    [z]: "Date Range",
    [N]: "Boolean",
    [A]: "In List",
    [D]: "Not In List",
    [m]: "Empty",
    [b]: "Not Empty",
    // Advanced filter types
    [M]: "Fuzzy Search",
    [_]: "Regular Expression",
    [I]: "Multi-Select",
    [V]: "Hierarchical",
    [K]: "Contextual",
    [Y]: "Suggestion",
    [B]: "Word Match",
    [P]: "Phonetic",
    // Filter combination types
    [Z]: "AND",
    [$]: "OR",
    [W]: "NOT",
    [j]: "Cross-Column",
    [q]: "Complex Group"
  }[r] || r;
}
function Ke(r) {
  switch (r) {
    case "string":
      return [
        E,
        C,
        x,
        G,
        M,
        _,
        B,
        P,
        A,
        D,
        m,
        b
      ];
    case "number":
      return [
        C,
        F,
        H,
        k,
        A,
        D,
        m,
        b
      ];
    case "date":
      return [
        R,
        z,
        m,
        b
      ];
    case "boolean":
      return [
        N,
        m,
        b
      ];
    case "array":
      return [
        E,
        A,
        D,
        I,
        m,
        b
      ];
    default:
      return [
        E,
        C,
        m,
        b
      ];
  }
}
function Ye(r) {
  return [Z, $, W, j, q].includes(r);
}
function Ze(r) {
  return [M, _, I, V, K, Y, B, P].includes(r);
}
function $e(r) {
  switch (r) {
    case "string":
      return E;
    case "number":
      return F;
    case "date":
      return R;
    case "boolean":
      return N;
    case "array":
      return E;
    default:
      return E;
  }
}
const We = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AND: Z,
  BOOLEAN: N,
  COMPLEX_GROUP: q,
  CONTAINS: E,
  CONTEXTUAL: K,
  CROSS_COLUMN: j,
  DATE: R,
  DATE_RANGE: z,
  EMPTY: m,
  ENDS_WITH: G,
  EQUALS: C,
  FUZZY: M,
  GREATER_THAN: H,
  HIERARCHICAL: V,
  IN_LIST: A,
  LESS_THAN: k,
  MULTI_SELECT: I,
  NOT: W,
  NOT_EMPTY: b,
  NOT_IN_LIST: D,
  OR: $,
  PHONETIC: P,
  RANGE: F,
  REGEX: _,
  STARTS_WITH: x,
  SUGGESTION: Y,
  WORD_MATCH: B,
  getDefaultFilterType: $e,
  getFilterName: Ve,
  getFilterTypesForDataType: Ke,
  isAdvancedType: Ze,
  isCombinationType: Ye
}, Symbol.toStringTag, { value: "Module" }));
class le {
  /**
   * Create a new EnhancedSimpleTable instance
   * @param {string|HTMLElement} container - CSS selector or DOM element to render the table in
   * @param {Object} options - Configuration options
   * @param {Array} options.data - Array of data objects to display in the table
   * @param {Array} options.columns - Column definitions
   * @param {Object} [options.filters] - Initial filter configuration
   * @param {Object} [options.pagination] - Pagination options
   * @param {Object} [options.pagination.enabled] - Whether pagination is enabled
   * @param {number} [options.pagination.pageSize] - Number of rows per page
   * @param {number} [options.pagination.currentPage] - Current page number
   * @param {Array} [options.pagination.pageSizeOptions] - Available page size options
   * @param {Object} [options.endlessScrolling] - Endless scrolling options
   * @param {boolean} [options.endlessScrolling.enabled] - Whether endless scrolling is enabled
   * @param {number} [options.endlessScrolling.itemsPerLoad] - Number of items to load per scroll
   * @param {number} [options.endlessScrolling.loadMoreThreshold] - Threshold in pixels to trigger loading more items
   * @param {number} [options.endlessScrolling.initialItems] - Initial number of items to display
   * @param {Object} [options.sorting] - Sorting options
   * @param {Object} [options.styling] - Styling options
   */
  constructor(e, t = {}) {
    this.table = new ze(e, t), this._savedFilters = /* @__PURE__ */ new Map();
  }
  /**
   * Refresh the table with current data and filters
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  refresh() {
    return this.table.refresh(), this;
  }
  /**
   * Add a filter to the table
   * @param {Object} filterConfig - Filter configuration
   * @param {string} filterConfig.column - Column field to filter on
   * @param {string} filterConfig.type - Type of filter to apply
   * @param {*} filterConfig.value - Filter value
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  addFilter(e) {
    return this.table.addFilter(e), this;
  }
  /**
   * Remove a filter from the table
   * @param {string} column - Column field to remove filter from
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  removeFilter(e) {
    return this.table.removeFilter(e), this;
  }
  /**
   * Clear all filters from the table
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  clearFilters() {
    return this.table.clearFilters(), this;
  }
  /**
   * Add a filter group with multiple filters and logical operator
   * @param {Object} groupConfig - Filter group configuration
   * @param {string} groupConfig.operator - Logical operator ('AND' or 'OR')
   * @param {Array} groupConfig.filters - Array of filter configurations
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  addFilterGroup(e) {
    return this.table.addFilterGroup(e), this;
  }
  /**
   * Save the current set of filters with a name for later use
   * @param {string} name - Name to save the filters under
   * @returns {Object} The saved filter configuration
   */
  saveCurrentFilters(e) {
    const t = this.table.getCurrentFilters();
    return this._savedFilters.set(e, t), t;
  }
  /**
   * Apply a previously saved filter or filter configuration
   * @param {string|Object} filterNameOrConfig - Name of saved filter or filter configuration object
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  applyFilters(e) {
    let t;
    if (typeof e == "string") {
      if (t = this._savedFilters.get(e), !t)
        throw new Error(`No saved filter found with name: ${e}`);
    } else
      t = e;
    return this.table.applyFilters(t), this;
  }
  /**
   * Get all saved filters
   * @returns {Object} Map of all saved filters
   */
  getSavedFilters() {
    return Object.fromEntries(this._savedFilters);
  }
  /**
   * Update the table data
   * @param {Array} data - New data array
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  setData(e) {
    return this.table.setData(e), this;
  }
  /**
   * Get the current table data (after filtering)
   * @returns {Array} Current filtered data
   */
  getData() {
    return this.table.getData();
  }
  /**
   * Get the original unfiltered table data
   * @returns {Array} Original unfiltered data
   */
  getOriginalData() {
    return this.table.getOriginalData();
  }
  /**
   * Set table columns configuration
   * @param {Array} columns - Column configuration array
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  setColumns(e) {
    return this.table.setColumns(e), this;
  }
  /**
   * Get current column configuration
   * @returns {Array} Current column configuration
   */
  getColumns() {
    return this.table.getColumns();
  }
  /**
   * Enable or disable pagination
   * @param {boolean} enabled - Whether pagination should be enabled
   * @param {Object} options - Pagination options
   * @param {number} [options.pageSize] - Number of rows per page
   * @param {Array} [options.pageSizeOptions] - Available page size options
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  setPagination(e, t = {}) {
    return this.table.setPagination(e, t), this;
  }
  /**
   * Change the current page
   * @param {number} page - Page number to change to
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  goToPage(e) {
    return this.table.goToPage(e), this;
  }
  /**
   * Change the page size
   * @param {number} pageSize - New page size
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  changePageSize(e) {
    return this.table.changePageSize(e), this;
  }
  /**
   * Enable or disable endless scrolling
   * @param {boolean} enabled - Whether endless scrolling should be enabled
   * @param {Object} options - Endless scrolling options
   * @param {number} [options.itemsPerLoad] - Number of items to load per scroll
   * @param {number} [options.loadMoreThreshold] - Threshold in pixels to trigger loading more items
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  setEndlessScrolling(e, t = {}) {
    return this.table.setEndlessScrolling(e, t), this;
  }
  /**
   * Set the display mode (default, pagination, or endless scrolling)
   * @param {string} mode - Display mode ('default', 'pagination', or 'endlessScrolling')
   * @param {Object} options - Options for the selected mode
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  setDisplayMode(e, t = {}) {
    return this.table.setDisplayMode(e, t), this;
  }
  /**
   * Destroy the table instance and clean up resources
   */
  destroy() {
    this.table.destroy(), this._savedFilters.clear();
  }
  /**
   * Add a custom event listener
   * @param {string} eventType - Type of event to listen for
   * @param {Function} callback - Callback function to execute
   * @returns {Function} Function to remove the listener
   */
  on(e, t) {
    return this.table.eventManager.on(e, t);
  }
  /**
   * Change the current theme
   * @param {string} themeName - Name of the theme to switch to
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  setTheme(e) {
    return this.table.renderer.changeTheme(e), this;
  }
  /**
   * Get the current theme name
   * @returns {string|null} The current theme name or null if no theme is applied
   */
  getTheme() {
    return this.table.renderer.currentTheme || null;
  }
  /**
   * Load a custom stylesheet
   * @param {string} stylesheetPath - Path to the custom stylesheet
   * @returns {EnhancedSimpleTable} The EnhancedSimpleTable instance for chaining
   */
  loadCustomStylesheet(e) {
    return this.table.renderer.loadCustomStylesheet(e), this;
  }
  /**
   * Get available themes
   * @returns {string[]} Array of available theme names
   */
  getAvailableThemes() {
    return ["dark", "blue", "minimal", "high-contrast"];
  }
}
le.FilterTypes = We;
le.DataTypes = ie;
const { formatCurrency: je } = ie;
export {
  le as default,
  je as formatCurrency
};
