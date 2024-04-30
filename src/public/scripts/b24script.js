(function () {
  var webPacker = { address: "https://studio.bitrix24.ru" };

  (function () {
    (function () {
      "use strict";
      if (typeof webPacker === "undefined") {
        return;
      }
      var e = [];
      function t(t) {
        this.name = t;
        e.push(this);
      }
      t.prototype = {
        language: null,
        languages: [],
        messages: {},
        properties: {},
        setProperties: function (e) {
          this.properties = e || {};
        },
        loadResources: function (e) {
          return (e || []).forEach(function (e) {
            webPacker.resource.load(e, this);
          }, this);
        },
        message: function (e) {
          var t = this.messages;
          if (e in t) {
            return t[e];
          }
          var n = this.language || "en";
          if (t[n] && t[n][e]) {
            return t[n][e];
          }
          n = "en";
          if (t[n] && t[n][e]) {
            return t[n][e];
          }
          return "";
        },
        getMessages: function (e) {
          var t = e || this.language || "en";
          var n = this.messages;
          if (n[t]) {
            return n[t];
          }
          t = this.language || "en";
          if (n[t]) {
            return n[t];
          }
          if (n.en) {
            return n.en;
          }
          return n;
        },
      };
      webPacker.getModule = function (e) {
        return this.getModules().filter(function (t) {
          return t.name === e;
        })[0];
      };
      webPacker.getModules = function () {
        return e;
      };
      webPacker.module = t;
      webPacker.getAddress = function () {
        return this.address;
      };
      webPacker.resource = {
        load: function (e, t) {
          switch (e.type) {
            case "css":
              this.loadCss(e.content);
              break;
            case "js":
              this.loadJs(e.content || e.src, !e.content);
              break;
            case "html":
            case "layout":
              if (t) {
                var n = t.messages[t.language]
                  ? t.messages[t.language]
                  : t.messages;
                for (var r in n) {
                  if (!n.hasOwnProperty(r)) {
                    continue;
                  }
                  e.content = e.content.replace(
                    new RegExp("%" + r + "%", "g"),
                    n[r]
                  );
                }
              }
              this.loadLayout(e.content);
              break;
          }
        },
        loadLayout: function (e) {
          if (!e) {
            return;
          }
          var t = document.createElement("DIV");
          t.innerHTML = e;
          document.body.insertBefore(t, document.body.firstChild);
        },
        loadJs: function (e, t, n) {
          if (!e) {
            return;
          }
          var r = document.createElement("SCRIPT");
          r.setAttribute("type", "text/javascript");
          r.setAttribute("async", "");
          if (t) {
            r.setAttribute("src", src);
          } else {
            if (webPacker.browser.isIE()) {
              r.text = text;
            } else {
              r.appendChild(document.createTextNode(e));
            }
          }
          this.appendToHead(r, !t && n);
        },
        appendToHead: function (e, t) {
          (
            document.getElementsByTagName("head")[0] || document.documentElement
          ).appendChild(e);
          if (t) {
            document.head.removeChild(e);
          }
        },
        loadCss: function (e) {
          if (!e) {
            return;
          }
          var t = document.createElement("STYLE");
          t.setAttribute("type", "text/css");
          if (t.styleSheet) {
            t.styleSheet.cssText = e;
          } else {
            t.appendChild(document.createTextNode(e));
          }
          this.appendToHead(t);
        },
      };
      webPacker.type = {
        isArray: function (e) {
          return e && Object.prototype.toString.call(e) === "[object Array]";
        },
        isString: function (e) {
          return e === ""
            ? true
            : e
            ? typeof e === "string" || e instanceof String
            : false;
        },
        toArray: function (e) {
          return Array.prototype.slice.call(e);
        },
      };
      webPacker.classes = {
        change: function (e, t, n) {
          e ? (n ? this.add(e, t) : this.remove(e, t)) : null;
        },
        remove: function (e, t) {
          e ? e.classList.remove(t) : null;
        },
        add: function (e, t) {
          e ? e.classList.add(t) : null;
        },
        has: function (e, t) {
          return e && e.classList.contains(t);
        },
      };

      function getCookie(cookie) {
        return cookie.split('; ').reduce((acc, item) => {
          const [name, value] = item.split('=')
          //@ts-ignore
          acc[name] = value
          return acc
        }, {})
      }
      const cookie = getCookie(document.cookie);
      const basicList = {'UF_CRM_1712667811': cookie.roistat_visit};
      webPacker.url = {};
      webPacker.url.parameter = {
        list: basiclist,
        get: function (e) {
          var t = this.getObject();
          return t.hasOwnProperty(e) ? decodeURIComponent(t[e]) : null;
        },
        has: function (e) {
          var t = this.getObject();
          return t.hasOwnProperty(e);
        },
        getList: function () {
          if (this.list) {
            return this.list;
          }
          var e = window.location.search.substr(1);
          if (e.length <= 1) {
            return [];
          }
          this.list = e.split("&").map(function (e) {
            var t = e.split("=");
            return { name: t[0], value: t[1] || "" };
          }, this);
          return this.list;
        },
        getObject: function () {
          return this.getList().reduce(function (e, t) {
            e[t.name] = t.value;
            return e;
          }, {});
        },
      };
      webPacker.ready = function (e) {
        document.readyState === "complete" || document.readyState === "loaded"
          ? e()
          : this.addEventListener(window, "DOMContentLoaded", e);
      };
      webPacker.addEventListener = function (e, t, n) {
        e = e || window;
        if (window.addEventListener) {
          e.addEventListener(t, n, false);
        } else {
          e.attachEvent("on" + t, n);
        }
      };
      webPacker.event = {
        listeners: [],
        on: function (e, t, n) {
          this.listeners
            .filter(function (n) {
              return n[0] === e && n[1] === t;
            })
            .forEach(function (e) {
              e[2].apply(this, n);
            });
        },
        listen: function (e, t, n) {
          this.listeners.push([e, t, n]);
        },
      };
      webPacker.cookie = {
        setItem: function (e, t, n) {
          try {
            this.set(e, JSON.stringify(t), n);
          } catch (e) {}
        },
        getItem: function (e) {
          try {
            return JSON.parse(this.get(e)) || null;
          } catch (e) {
            return null;
          }
        },
        set: function (e, t, n) {
          n = n || 3600 * 24 * 365 * 10;
          var r = new Date(new Date().getTime() + 1e3 * n);
          document.cookie =
            e + "=" + t + "; path=/; expires=" + r.toUTCString();
        },
        get: function (e) {
          var t = document.cookie.match(
            new RegExp(
              "(?:^|; )" +
                e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
                "=([^;]*)"
            )
          );
          return t ? decodeURIComponent(t[1]) : null;
        },
      };
      webPacker.ls = {
        supported: null,
        removeItem: function (e) {
          if (!this.isSupported()) return;
          window.localStorage.removeItem(e);
        },
        setItem: function (e, t, n) {
          if (!this.isSupported()) return;
          try {
            if (n && t && typeof t === "object") {
              n = parseInt(n);
              t.cacheData = {
                time: parseInt(Date.now() / 1e3),
                ttl: isNaN(n) ? 3600 : n,
              };
            }
            window.localStorage.setItem(e, JSON.stringify(t));
          } catch (e) {}
        },
        getItem: function (e, t) {
          if (!this.isSupported()) return null;
          try {
            var n = JSON.parse(window.localStorage.getItem(e)) || null;
            if (t && n && typeof n === "object" && n.cacheData) {
              t = parseInt(t);
              t = t && !isNaN(t) ? t : n.cacheData.ttl;
              if (parseInt(Date.now() / 1e3) > n.cacheData.time + t) {
                n = null;
                this.removeItem(e);
              }
            }
            if (n && typeof n === "object") {
              delete n.cacheData;
            }
            return n;
          } catch (e) {
            return null;
          }
        },
        isSupported: function () {
          if (this.supported === null) {
            this.supported = false;
            try {
              var e = "b24crm-x-test";
              window.localStorage.setItem(e, "x");
              window.localStorage.removeItem(e);
              this.supported = true;
            } catch (e) {}
          }
          return this.supported;
        },
      };
      webPacker.browser = {
        isIOS: function () {
          return /(iPad;)|(iPhone;)/i.test(navigator.userAgent);
        },
        isOpera: function () {
          return navigator.userAgent.toLowerCase().indexOf("opera") !== -1;
        },
        isIE: function () {
          return document.attachEvent && !this.isOpera();
        },
        isMobile: function () {
          return /(ipad|iphone|android|mobile|touch)/i.test(
            navigator.userAgent
          );
        },
      };
      webPacker.analytics = {
        trackGa: function (e, t, n) {
          if (window.gtag) {
            if (e === "pageview") {
              if (window.dataLayer) {
                var r = window.dataLayer
                  .filter(function (e) {
                    return e[0] === "config";
                  })
                  .map(function (e) {
                    return e[1];
                  });
                if (r.length > 0) {
                  window.gtag("config", r[0], { page_path: t });
                }
              }
            } else if (e === "event") {
              window.gtag("event", n, { event_category: t });
            }
          } else if (window.dataLayer) {
            if (e === "pageview") {
              window.dataLayer.push({
                event: "VirtualPageview",
                virtualPageURL: t,
              });
            } else if (e === "event") {
              window.dataLayer.push({
                event: "crm-form",
                eventCategory: t,
                eventAction: n,
              });
            }
          } else if (typeof window.ga === "function") {
            if (n) {
              window.ga("send", e, t, n);
            } else {
              window.ga("send", e, t);
            }
          }
        },
        trackYa: function (e) {
          if (!window["Ya"]) {
            return;
          }
          var t;
          if (Ya.Metrika && Ya.Metrika.counters()[0]) {
            t = Ya.Metrika.counters()[0].id;
          } else if (Ya.Metrika2 && Ya.Metrika2.counters()[0]) {
            t = Ya.Metrika2.counters()[0].id;
          }
          if (t && window["yaCounter" + t]) {
            window["yaCounter" + t].reachGoal(e);
          }
        },
      };
    })();
    //# sourceMappingURL=https://studio.bitrix24.ru/bitrix/js/ui/webpacker/ui.webpacker.map.js
  })();

  (function () {
    var module = new webPacker.module("crm.tracking.tracker.loader");
    (function (w, d, u) {
      var s = d.createElement("script");
      s.async = true;
      s.src = u + "?" + ((Date.now() / 60000) | 0);
      var h = d.getElementsByTagName("script")[0];
      h.parentNode.insertBefore(s, h);
    })(
      window,
      document,
      "https://cdn-ru.bitrix24.ru/b26302288/crm/tag/call.tracker.js"
    );
  })();

  (function () {
    var module = new webPacker.module("crm.tracking.guest");
    module.setProperties({ lifespan: 28, canRegisterOrder: true });
    (function () {
      "use strict";
      if (typeof webPacker === "undefined") {
        return;
      }
      window.b24Tracker = window.b24Tracker || {};
      if (window.b24Tracker.guest) {
        return;
      }
      window.b24Tracker.guest = {
        cookieName: "b24_crm_guest_id",
        returnCookieName: "b24_crm_guest_id_returned",
        requestUrl: "",
        isInit: false,
        init: function () {
          if (this.isInit) {
            return;
          }
          this.isInit = true;
          this.requestUrl =
            (webPacker.getAddress() + "/").match(
              /((http|https):\/\/[^\/]+?)\//
            )[1] + "/pub/guest.php";
          if (module.properties["lifespan"]) {
            var t = parseInt(module.properties["lifespan"]);
            if (!isNaN(t) && t) {
              r.lifespan = t;
              n.lifespan = t;
            }
          }
          e.collect();
          r.collect();
          n.collect();
          s.collect();
          this.checkReturn();
          window.b24order = window.b24order || [];
          window.b24order.forEach(function (e) {
            this.registerOrder(e);
          }, this);
          window.b24order.push = function (e) {
            this.registerOrder(e);
          }.bind(this);
        },
        checkReturn: function () {
          if (
            !this.getGidCookie() ||
            !window.sessionStorage ||
            sessionStorage.getItem(this.returnCookieName)
          ) {
            return;
          }
          a.query(
            this.requestUrl,
            { gid: this.getGidCookie(), a: "event", e: "Return" },
            this.onAjaxResponse.bind(this)
          );
          this.markReturned();
        },
        storeTrace: function (e, t) {
          t = t || "storeTrace";
          a.query(this.requestUrl, { a: t, d: { trace: e } });
        },
        link: function (e) {
          if (!e || this.getGidCookie()) {
            return;
          }
          a.query(
            this.requestUrl,
            { a: "link", gid: e },
            this.onAjaxResponse.bind(this)
          );
        },
        register: function () {
          if (this.getGidCookie()) {
            return;
          }
          a.query(
            this.requestUrl,
            { a: "register" },
            this.onAjaxResponse.bind(this)
          );
        },
        onAjaxResponse: function (e) {
          e = e || {};
          e.data = e.data || {};
          if (!this.getGidCookie() && !!e.data.gid) {
            webPacker.ls.setItem(this.cookieName, e.data.gid);
            this.markReturned();
          }
        },
        getPages: function () {
          return s.list();
        },
        getTags: function () {
          return r.list();
        },
        registerOrder: function (e) {
          if (!module.properties["canRegisterOrder"]) {
            return;
          }
          this.storeTrace(this.getTraceOrder(e), "registerOrder");
        },
        getTraceOrder: function (e) {
          e = e || {};
          var t = e.id || "";
          if (!Number.isNaN(t) && typeof t === "number") {
            t = t.toString();
          }
          if (
            !t ||
            !webPacker.type.isString(t) ||
            !t.match(/^[\d\w.\-\/\\_#]{1,30}$/i)
          ) {
            if (window.console && window.console.error) {
              window.console.error("Wrong order id: " + e.id);
            }
          }
          var i = parseFloat(e.sum);
          if (isNaN(i) || i < 0) {
            if (window.console && window.console.error) {
              window.console.error("Wrong order sum: " + e.sum);
            }
          }
          this.sentOrders = this.sentOrders || [];
          if (this.sentOrders.indexOf(t) >= 0) {
            return;
          }
          this.sentOrders.push(t);
          return this.getTrace({
            channels: [{ code: "order", value: t }],
            order: { id: t, sum: i },
          });
        },
        getTrace: function (t) {
          var i = this.remindTrace(t);
          e.clear();
          return i;
        },
        remindTrace: function (t) {
          return JSON.stringify(e.current(t));
        },
        getUtmSource: function () {
          return this.getTags().utm_source || "";
        },
        isUtmSourceDetected: function () {
          return r.isSourceDetected();
        },
        getGidCookie: function () {
          return webPacker.ls.getItem(this.cookieName);
        },
        setGid: function (e) {
          this.markReturned();
          return webPacker.ls.setItem(this.cookieName, e);
        },
        markReturned: function () {
          if (window.sessionStorage) {
            sessionStorage.setItem(this.returnCookieName, "y");
          }
        },
      };
      var e = {
        maxCount: 5,
        lsKey: "b24_crm_guest_traces",
        previous: function () {
          return webPacker.ls.getItem(this.lsKey) || { list: [] };
        },
        current: function (e) {
          e = e || {};
          var i = {
            url: window.location.href,
            ref: n.getData().ref,
            device: { isMobile: webPacker.browser.isMobile() },
            tags: r.getData(),
            client: t.getData(),
            pages: { list: s.list() },
            gid: b24Tracker.guest.getGidCookie(),
          };
          if (e.previous !== false) {
            i.previous = this.previous();
          }
          if (e.channels) {
            i.channels = e.channels;
          }
          if (e.order) {
            i.order = e.order;
          }
          return i;
        },
        clear: function () {
          webPacker.ls.removeItem(this.lsKey);
        },
        collect: function () {
          if (!r.isSourceDetected() && !n.detect().newest) {
            return;
          }
          var e = this.current({ previous: false });
          if (!e.pages.list) {
            return;
          }
          var t = this.previous();
          t = t || {};
          t.list = t.list || [];
          t.list.push(this.current({ previous: false }));
          if (t.list.length > this.maxCount) {
            t.list.shift();
          }
          r.clear();
          s.clear();
          webPacker.ls.setItem(this.lsKey, t);
        },
      };
      var t = {
        getData: function () {
          var e = { gaId: this.getGaId(), yaId: this.getYaId() };
          if (!e.gaId) delete e["gaId"];
          if (!e.yaId) delete e["yaId"];
          return e;
        },
        getGaId: function () {
          var e;
          if (typeof window.ga === "function") {
            ga(function (t) {
              e = t.get("clientId");
            });
            if (e) {
              return e;
            }
            if (ga.getAll && ga.getAll()[0]) {
              e = ga.getAll()[0].get("clientId");
            }
          }
          if (e) {
            return e;
          }
          e = (document.cookie || "").match(/_ga=(.+?);/);
          if (e) {
            e = (e[1] || "").split(".").slice(-2).join(".");
          }
          return e ? e : null;
        },
        getYaId: function () {
          var e;
          if (window.Ya) {
            var t;
            if (Ya.Metrika && Ya.Metrika.counters()[0]) {
              t = Ya.Metrika.counters()[0].id;
            } else if (Ya.Metrika2 && Ya.Metrika2.counters()[0]) {
              t = Ya.Metrika2.counters()[0].id;
            }
            if (!t) {
              return null;
            }
            if (window.ym && typeof window.ym === "object") {
              ym(t, "getClientID", function (t) {
                e = t;
              });
            }
            if (!e && window["yaCounter" + t]) {
              e = window["yaCounter" + t].getClientID();
            }
          }
          if (
            !e &&
            window.ym &&
            typeof window.ym === "function" &&
            window.ym.a &&
            window.ym.a[0] !== undefined
          ) {
            e = window.ym.a[0][0];
          }
          if (!e) {
            e = webPacker.cookie.get("_ym_uid");
          }
          return e ? e : null;
        },
      };
      var i = null;
      var r = {
        lifespan: 28,
        lsPageKey: "b24_crm_guest_utm",
        tags: [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
        ],
        sameTagLifeSpan: 3600,
        list: function () {
          return this.getData().list || {};
        },
        isSourceDetected: function () {
          if (i === null) {
            var e = this.tags[0];
            var t = webPacker.url.parameter.get(e);
            if (t === null || !t) {
              i = false;
            } else if (this.list()[e] !== t) {
              i = true;
            } else {
              i =
                this.getTimestamp(true) - this.getTimestamp() >
                this.sameTagLifeSpan;
            }
          }
          return i;
        },
        getGCLid: function () {
          return this.getData().gclid || null;
        },
        getTimestamp: function (e) {
          return (
            (e ? null : parseInt(this.getData().ts)) ||
            parseInt(Date.now() / 1e3)
          );
        },
        getData: function () {
          return (
            (webPacker.ls.isSupported()
              ? webPacker.ls.getItem(this.lsPageKey)
              : webPacker.cookie.getItem(this.lsPageKey)) || {}
          );
        },
        clear: function () {
          webPacker.ls.removeItem(this.lsPageKey);
        },
        collect: function () {
          var e = this.getTimestamp();
          var t = webPacker.url.parameter.getList().filter(function (e) {
            return this.tags.indexOf(e.name) > -1;
          }, this);
          if (t.length > 0) {
            t = t
              .filter(function (e) {
                return e.value.trim().length > 0;
              })
              .reduce(function (e, t) {
                e[t.name] = decodeURIComponent(t.value);
                return e;
              }, {});
            e = this.getTimestamp(true);
          } else {
            t = this.list();
          }
          var i = webPacker.url.parameter
            .getList()
            .filter(function (e) {
              return e.name === "gclid";
            }, this)
            .map(function (e) {
              return e.value;
            });
          i = i[0] || this.getGCLid();
          if (this.getTimestamp(true) - e > this.lifespan * 3600 * 24) {
            this.clear();
            return;
          }
          var r = { ts: e, list: t, gclid: i };
          webPacker.ls.isSupported()
            ? webPacker.ls.setItem(this.lsPageKey, r)
            : webPacker.cookie.setItem(this.lsPageKey, r);
        },
      };
      var n = {
        lifespan: 28,
        lsKey: "b24_crm_guest_ref",
        sameRefLifeSpan: 3600,
        detect: function () {
          var e = {
            detected: false,
            existed: false,
            expired: false,
            newest: false,
            value: null,
          };
          var t = document.referrer;
          if (!t) {
            return e;
          }
          var i = document.createElement("a");
          i.href = t;
          if (!i.hostname) {
            return e;
          }
          if (i.hostname === window.location.hostname) {
            return e;
          }
          e.value = t;
          e.detected = true;
          if (t !== this.getData().ref) {
            e.newest = true;
            return e;
          }
          e.existed = true;
          if (this.getTs(true) - this.getTs() > this.sameRefLifeSpan) {
            e.expired = true;
            return e;
          }
          return false;
        },
        getTs: function (e) {
          return (
            (e ? null : parseInt(this.getData().ts)) ||
            parseInt(Date.now() / 1e3)
          );
        },
        getData: function () {
          return (
            (webPacker.ls.isSupported()
              ? webPacker.ls.getItem(this.lsKey, this.getTtl())
              : null) || {}
          );
        },
        clear: function () {
          webPacker.ls.removeItem(this.lsKey);
        },
        getTtl: function () {
          return this.lifespan * 3600 * 24;
        },
        collect: function () {
          var e = this.detect();
          if (!e.detected) {
            return;
          }
          if (e.expired) {
            this.clear();
            return;
          }
          webPacker.ls.setItem(
            this.lsKey,
            { ts: this.getTs(), ref: e.value },
            this.getTtl()
          );
        },
      };
      var s = {
        maxCount: 5,
        lsPageKey: "b24_crm_guest_pages",
        list: function () {
          return webPacker.ls.getItem(this.lsPageKey);
        },
        clear: function () {
          webPacker.ls.removeItem(this.lsPageKey);
        },
        collect: function () {
          if (!document.body) {
            return;
          }
          var e = document.body.querySelector("h1");
          e = e ? e.textContent.trim() : "";
          if (e.length === 0) {
            e = document.head.querySelector("title");
            e = e ? e.textContent.trim() : "";
          }
          e = e.substring(0, 40);
          var t = window.location.href;
          var i = webPacker.ls.getItem(this.lsPageKey);
          i = i instanceof Array ? i : [];
          var r = -1;
          i.forEach(function (e, i) {
            if (e[0] === t) r = i;
          });
          if (r > -1) {
            i = i.slice(0, r).concat(i.slice(r + 1));
          }
          while (i.length >= this.maxCount) {
            i.shift();
          }
          var n = new Date();
          i.push([t, Math.round(n.getTime() / 1e3), e]);
          webPacker.ls.setItem(this.lsPageKey, i);
        },
      };
      var a = {
        query: function (e, t, i) {
          this.ajax = null;
          if (window.XMLHttpRequest) {
            this.ajax = new XMLHttpRequest();
          } else if (window.ActiveXObject) {
            this.ajax = new window.ActiveXObject("Microsoft.XMLHTTP");
          }
          "withCredentials" in this.ajax ? this.post(e, t, i) : this.get(e, t);
        },
        get: function (e, t) {
          var i = document.createElement("script");
          i.type = "text/javascript";
          i.src = e + "?" + this.stringify(t);
          i.async = true;
          var r = document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(i, r);
        },
        post: function (e, t, i) {
          var r = this.ajax;
          r.open("POST", e, true);
          r.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
          r.withCredentials = true;
          r.onreadystatechange = function () {
            if (i && r.readyState === 4 && r.status === 200) {
              i.apply(this, [JSON.parse(this.responseText)]);
            }
          };
          r.send(this.stringify(t));
        },
        stringify: function (e) {
          var t = [];
          if (Object.prototype.toString.call(e) === "[object Array]") {
          } else if (typeof e === "object") {
            for (var i in e) {
              if (!e.hasOwnProperty(i)) {
                continue;
              }
              var r = e[i];
              if (typeof r === "object") {
                r = JSON.stringify(r);
              }
              t.push(i + "=" + encodeURIComponent(r));
            }
          }
          return t.join("&");
        },
        getAjax: function () {
          if (this.ajax) {
            return this.ajax;
          }
          if (window.XMLHttpRequest) {
            this.ajax = new XMLHttpRequest();
          } else if (window.ActiveXObject) {
            this.ajax = new window.ActiveXObject("Microsoft.XMLHTTP");
          }
          return this.ajax;
        },
      };
      window.b24Tracker.guest.init();
    })();
    //# sourceMappingURL=https://studio.bitrix24.ru/bitrix/js/crm/tracking/guest/script.map.js
  })();

  (function () {
    var module = new webPacker.module("crm.site.button");
    module.loadResources([
      {
        type: "css",
        path: "https://studio.bitrix24.ru/bitrix/components/bitrix/crm.button.button/templates/.default/style.css?1636112442.29954",
        content:
          "html.bx-ios.bx-ios-fix-frame-focus,.bx-ios.bx-ios-fix-frame-focus body{-webkit-overflow-scrolling:touch}.bx-touch{-webkit-tap-highlight-color:rgba(0,0,0,0)}.bx-touch.crm-widget-button-mobile,.bx-touch.crm-widget-button-mobile body{height:100%;overflow:auto}.b24-widget-button-shadow{position:fixed;background:rgba(33,33,33,.3);width:100%;height:100%;top:0;left:0;visibility:hidden;z-index:10100}.bx-touch .b24-widget-button-shadow{background:rgba(33,33,33,.75)}.b24-widget-button-inner-container{position:relative;display:inline-block}.b24-widget-button-position-fixed{position:fixed;z-index:10000}.b24-widget-button-block{width:66px;height:66px;border-radius:100%;box-sizing:border-box;overflow:hidden;cursor:pointer}.b24-widget-button-block .b24-widget-button-icon{opacity:1}.b24-widget-button-block-active .b24-widget-button-icon{opacity:.7}.b24-widget-button-position-top-left{top:50px;left:50px}.b24-widget-button-position-top-middle{top:50px;left:50%;margin:0 0 0 -33px}.b24-widget-button-position-top-right{top:50px;right:50px}.b24-widget-button-position-bottom-left{left:50px;bottom:50px}.b24-widget-button-position-bottom-middle{left:50%;bottom:50px;margin:0 0 0 -33px}.b24-widget-button-position-bottom-right{right:50px;bottom:50px}.b24-widget-button-inner-block{position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;height:66px;border-radius:100px;background:#00aeef;box-sizing:border-box}.b24-widget-button-icon-container{position:relative;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.b24-widget-button-inner-item{position:absolute;top:0;left:0;display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;-webkit-transition:opacity .6s ease-out;transition:opacity .6s ease-out;-webkit-animation:socialRotateBack .4s;animation:socialRotateBack .4s;opacity:0;overflow:hidden;box-sizing:border-box}.b24-widget-button-icon-animation{opacity:1}.b24-widget-button-inner-mask{position:absolute;top:-8px;left:-8px;height:82px;min-width:66px;-webkit-width:calc(100% + 16px);width:calc(100% + 16px);border-radius:100px;background:#00aeef;opacity:.2}.b24-widget-button-icon{-webkit-transition:opacity .3s ease-out;transition:opacity .3s ease-out;cursor:pointer}.b24-widget-button-icon:hover{opacity:1}.b24-widget-button-inner-item-active .b24-widget-button-icon{opacity:1}.b24-widget-button-wrapper{position:fixed;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;visibility:hidden;direction:ltr;z-index:10150}.bx-imopenlines-config-sidebar{z-index:10101}.b24-widget-button-visible{visibility:visible;-webkit-animation:b24-widget-button-visible 1s ease-out forwards 1;animation:b24-widget-button-visible 1s ease-out forwards 1}@-webkit-keyframes b24-widget-button-visible{from{-webkit-transform:scale(0);transform:scale(0)}30.001%{-webkit-transform:scale(1.2);transform:scale(1.2)}62.999%{-webkit-transform:scale(1);transform:scale(1)}100%{-webkit-transform:scale(1);transform:scale(1)}}@keyframes b24-widget-button-visible{from{-webkit-transform:scale(0);transform:scale(0)}30.001%{-webkit-transform:scale(1.2);transform:scale(1.2)}62.999%{-webkit-transform:scale(1);transform:scale(1)}100%{-webkit-transform:scale(1);transform:scale(1)}}.b24-widget-button-disable{-webkit-animation:b24-widget-button-disable .3s ease-out forwards 1;animation:b24-widget-button-disable .3s ease-out forwards 1}@-webkit-keyframes b24-widget-button-disable{from{-webkit-transform:scale(1);transform:scale(1)}50.001%{-webkit-transform:scale(.5);transform:scale(.5)}92.999%{-webkit-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(0);transform:scale(0)}}@keyframes b24-widget-button-disable{from{-webkit-transform:scale(1);transform:scale(1)}50.001%{-webkit-transform:scale(.5);transform:scale(.5)}92.999%{-webkit-transform:scale(0);transform:scale(0)}100%{-webkit-transform:scale(0);transform:scale(0)}}.b24-widget-button-social{display:none}.b24-widget-button-social-item{position:relative;display:block;margin:0 10px 10px 0;width:45px;height:44px;background-size:100%;border-radius:25px;-webkit-box-shadow:0 8px 6px -6px rgba(33,33,33,.2);-moz-box-shadow:0 8px 6px -6px rgba(33,33,33,.2);box-shadow:0 8px 6px -6px rgba(33,33,33,.2);cursor:pointer}.b24-widget-button-social-item:hover{-webkit-box-shadow:0 0 6px rgba(0,0,0,.16),0 6px 12px rgba(0,0,0,.32);box-shadow:0 0 6px rgba(0,0,0,.16),0 6px 12px rgba(0,0,0,.32);-webkit-transition:box-shadow .17s cubic-bezier(0,0,.2,1);transition:box-shadow .17s cubic-bezier(0,0,.2,1)}.ui-icon.b24-widget-button-social-item,.ui-icon.connector-icon-45{width:46px;height:46px;--ui-icon-size-md:46px }\n\n.b24-widget-button-callback {\n\tbackground-image: url(\u0027data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2229%22%20height%3D%2230%22%20viewBox%3D%220%200%2029%2030%22%3E%3Cpath%20fill%3D%22%23FFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M21.872%2019.905c-.947-.968-2.13-.968-3.072%200-.718.737-1.256.974-1.962%201.723-.193.206-.356.25-.59.112-.466-.262-.96-.474-1.408-.76-2.082-1.356-3.827-3.098-5.372-5.058-.767-.974-1.45-2.017-1.926-3.19-.096-.238-.078-.394.11-.587.717-.718.96-.98%201.665-1.717.984-1.024.984-2.223-.006-3.253-.56-.586-1.103-1.397-1.56-2.034-.458-.636-.817-1.392-1.403-1.985C5.4%202.2%204.217%202.2%203.275%203.16%202.55%203.9%201.855%204.654%201.12%205.378.438%206.045.093%206.863.02%207.817c-.114%201.556.255%203.023.774%204.453%201.062%202.96%202.68%205.587%204.642%207.997%202.65%203.26%205.813%205.837%209.513%207.698%201.665.836%203.39%201.48%205.268%201.585%201.292.075%202.415-.262%203.314-1.304.616-.712%201.31-1.36%201.962-2.042.966-1.01.972-2.235.012-3.234-1.147-1.192-2.48-1.88-3.634-3.065zm-.49-5.36l.268-.047c.583-.103.953-.707.79-1.295-.465-1.676-1.332-3.193-2.537-4.445-1.288-1.33-2.857-2.254-4.59-2.708-.574-.15-1.148.248-1.23.855l-.038.28c-.07.522.253%201.01.747%201.142%201.326.355%202.53%201.064%203.517%202.086.926.958%201.59%202.125%201.952%203.412.14.5.624.807%201.12.72zm2.56-9.85C21.618%202.292%2018.74.69%2015.56.02c-.56-.117-1.1.283-1.178.868l-.038.28c-.073.537.272%201.04.786%201.15%202.74.584%205.218%201.968%207.217%204.03%201.885%201.95%203.19%204.36%203.803%207.012.122.53.617.873%201.136.78l.265-.046c.57-.1.934-.678.8-1.26-.71-3.08-2.223-5.873-4.41-8.14z%22/%3E%3C/svg%3E\u0027); background-repeat:no-repeat;background-position:center;background-color:#00aeef;background-size:43%;}\n.b24-widget-button-whatsapp {\n\tbackground-image: url(\u0022data:image/svg+xml,%3Csvg viewBox=\u00270 0 44 44\u0027 fill=\u0027none\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M37.277 6.634C33.224 2.576 27.833.34 22.09.338 10.257.338.626 9.968.621 21.805a21.432 21.432 0 0 0 2.866 10.733L.44 43.662l11.381-2.985a21.447 21.447 0 0 0 10.26 2.613h.008c11.832 0 21.464-9.631 21.468-21.469a21.338 21.338 0 0 0-6.281-15.187ZM13.372 22.586c-.268-.358-2.19-2.909-2.19-5.55 0-2.64 1.385-3.937 1.877-4.474.491-.537 1.073-.671 1.43-.671.358 0 .716.003 1.029.019.329.017.771-.126 1.206.92.448 1.075 1.52 3.715 1.654 3.984.135.268.224.581.045.94-.178.357-.268.58-.536.894-.268.314-.563.7-.805.94-.268.267-.548.558-.235 1.095.313.537 1.389 2.293 2.984 3.716 2.049 1.828 3.777 2.394 4.314 2.662.536.269.849.224 1.162-.134.313-.358 1.34-1.566 1.698-2.103.358-.537.716-.447 1.207-.269.492.18 3.13 1.477 3.666 1.745.536.269.894.403 1.028.627.134.224.134 1.298-.313 2.55-.447 1.254-2.59 2.398-3.621 2.551-.924.138-2.094.196-3.379-.212a30.823 30.823 0 0 1-3.058-1.13c-5.38-2.324-8.895-7.742-9.163-8.1Z\u0027 fill=\u0027%23FFF\u0027/%3E%3C/svg%3E\u0022); background-repeat:no-repeat;background-position:center;background-color:#00aeef;background-size:43%;}\n.b24-widget-button-crmform {\n\tbackground-image: url(\u0027data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23FFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M22.407%200h-21.1C.586%200%200%20.586%200%201.306v21.1c0%20.72.586%201.306%201.306%201.306h21.1c.72%200%201.306-.586%201.306-1.305V1.297C23.702.587%2023.117%200%2022.407%200zm-9.094%2018.046c0%20.41-.338.737-.738.737H3.9c-.41%200-.738-.337-.738-.737v-1.634c0-.408.337-.737.737-.737h8.675c.41%200%20.738.337.738.737v1.634zm7.246-5.79c0%20.408-.338.737-.738.737H3.89c-.41%200-.737-.338-.737-.737v-1.634c0-.41.337-.737.737-.737h15.923c.41%200%20.738.337.738.737v1.634h.01zm0-5.8c0%20.41-.338.738-.738.738H3.89c-.41%200-.737-.338-.737-.738V4.822c0-.408.337-.737.737-.737h15.923c.41%200%20.738.338.738.737v1.634h.01z%22/%3E%3C/svg%3E\u0027); background-repeat:no-repeat;background-position:center;background-color:#00aeef;background-size:43%;}\n.b24-widget-button-openline_livechat {\n\tbackground-image: url(\u0027data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2231%22%20height%3D%2228%22%20viewBox%3D%220%200%2031%2028%22%3E%3Cpath%20fill%3D%22%23FFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M23.29%2013.25V2.84c0-1.378-1.386-2.84-2.795-2.84h-17.7C1.385%200%200%201.462%200%202.84v10.41c0%201.674%201.385%203.136%202.795%202.84H5.59v5.68h.93c.04%200%20.29-1.05.933-.947l3.726-4.732h9.315c1.41.296%202.795-1.166%202.795-2.84zm2.795-3.785v4.733c.348%202.407-1.756%204.558-4.658%204.732h-8.385l-1.863%201.893c.22%201.123%201.342%202.127%202.794%201.893h7.453l2.795%203.786c.623-.102.93.947.93.947h.933v-4.734h1.863c1.57.234%202.795-1.02%202.795-2.84v-7.57c0-1.588-1.225-2.84-2.795-2.84h-1.863z%22/%3E%3C/svg%3E\u0027); background-repeat:no-repeat;background-position:center;background-color:#00aeef;background-size:43%}.b24-widget-button-social-tooltip{position:absolute;top:50%;left:-9000px;display:inline-block;padding:5px 10px;max-width:360px;border-radius:10px;font:13px/15px \u0022Helvetica Neue\u0022,Arial,Helvetica,sans-serif;color:#000;background:#fff;text-align:center;text-overflow:ellipsis;white-space:nowrap;transform:translate(0,-50%);transition:opacity .6s linear;opacity:0;overflow:hidden}@media(max-width:480px){.b24-widget-button-social-tooltip{max-width:200px}}.b24-widget-button-social-item:hover .b24-widget-button-social-tooltip{left:50px;-webkit-transform:translate(0,-50%);transform:translate(0,-50%);opacity:1;z-index:1}.b24-widget-button-close{display:none}.b24-widget-button-position-bottom-left .b24-widget-button-social-item:hover .b24-widget-button-social-tooltip,.b24-widget-button-position-top-left .b24-widget-button-social-item:hover .b24-widget-button-social-tooltip{left:50px;-webkit-transform:translate(0,-50%);transform:translate(0,-50%);opacity:1}.b24-widget-button-position-top-right .b24-widget-button-social-item:hover .b24-widget-button-social-tooltip,.b24-widget-button-position-bottom-right .b24-widget-button-social-item:hover .b24-widget-button-social-tooltip{left:-5px;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%);opacity:1}.b24-widget-button-inner-container,.bx-touch .b24-widget-button-inner-container{-webkit-transform:scale(.85);transform:scale(.85);-webkit-transition:transform .3s;transition:transform .3s}.b24-widget-button-top .b24-widget-button-inner-container,.b24-widget-button-bottom .b24-widget-button-inner-container{-webkit-transform:scale(.7);transform:scale(.7);-webkit-transition:transform .3s linear;transition:transform .3s linear}.b24-widget-button-top .b24-widget-button-inner-block,.b24-widget-button-top .b24-widget-button-inner-mask,.b24-widget-button-bottom .b24-widget-button-inner-block,.b24-widget-button-bottom .b24-widget-button-inner-mask{background:#d6d6d6 !important;-webkit-transition:background .3s linear;transition:background .3s linear}.b24-widget-button-top .b24-widget-button-pulse,.b24-widget-button-bottom .b24-widget-button-pulse{display:none}.b24-widget-button-wrapper.b24-widget-button-position-bottom-right,.b24-widget-button-wrapper.b24-widget-button-position-bottom-middle,.b24-widget-button-wrapper.b24-widget-button-position-bottom-left{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.b24-widget-button-bottom .b24-widget-button-social,.b24-widget-button-top .b24-widget-button-social{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-line-pack:end;align-content:flex-end;height:-webkit-calc(100vh - 110px);height:calc(100vh - 110px);-webkit-animation:bottomOpen .3s;animation:bottomOpen .3s;visibility:visible}.b24-widget-button-top .b24-widget-button-social{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;padding:10px 0 0 0;-webkit-animation:topOpen .3s;animation:topOpen .3s}.b24-widget-button-position-bottom-left.b24-widget-button-bottom .b24-widget-button-social{-ms-flex-line-pack:start;align-content:flex-start}.b24-widget-button-position-top-left.b24-widget-button-top .b24-widget-button-social{-ms-flex-line-pack:start;align-content:flex-start}.b24-widget-button-position-top-right.b24-widget-button-top .b24-widget-button-social{-ms-flex-line-pack:start;align-content:flex-start;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.b24-widget-button-position-bottom-right.b24-widget-button-bottom .b24-widget-button-social,.b24-widget-button-position-bottom-left.b24-widget-button-bottom .b24-widget-button-social,.b24-widget-button-position-bottom-middle.b24-widget-button-bottom .b24-widget-button-social{-ms-flex-line-pack:start;align-content:flex-start;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse;order:1}.b24-widget-button-position-bottom-left.b24-widget-button-bottom .b24-widget-button-social{-ms-flex-wrap:wrap;flex-wrap:wrap}.b24-widget-button-position-bottom-left .b24-widget-button-social-item,.b24-widget-button-position-top-left .b24-widget-button-social-item,.b24-widget-button-position-top-middle .b24-widget-button-social-item,.b24-widget-button-position-bottom-middle .b24-widget-button-social-item{margin:0 0 10px 10px}.b24-widget-button-position-bottom-left.b24-widget-button-wrapper{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.b24-widget-button-position-top-left.b24-widget-button-wrapper{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.b24-widget-button-position-bottom-middle.b24-widget-button-wrapper,.b24-widget-button-position-top-middle.b24-widget-button-wrapper{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;-ms-flex-line-pack:start;align-content:flex-start}.b24-widget-button-position-top-middle.b24-widget-button-top .b24-widget-button-social{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-line-pack:start;align-content:flex-start}.b24-widget-button-bottom .b24-widget-button-inner-item{display:none}.b24-widget-button-bottom .b24-widget-button-close{display:flex;-webkit-animation:socialRotate .4s;animation:socialRotate .4s;opacity:1}.b24-widget-button-top .b24-widget-button-inner-item{display:none}.b24-widget-button-top .b24-widget-button-close{display:flex;-webkit-animation:socialRotate .4s;animation:socialRotate .4s;opacity:1}.b24-widget-button-show{-webkit-animation:b24-widget-show .3s cubic-bezier(.75,.01,.75,0) forwards;animation:b24-widget-show .3s cubic-bezier(.75,.01,.75,0) forwards}@-webkit-keyframes b24-widget-show{from{opacity:0}to{opacity:1;visibility:visible}}@keyframes b24-widget-show{from{opacity:0}to{opacity:1;visibility:visible}}.b24-widget-button-hide{-webkit-animation:b24-widget-hidden .3s linear forwards;animation:b24-widget-hidden .3s linear forwards}@-webkit-keyframes b24-widget-hidden{from{opacity:1;visibility:visible}50%{opacity:1}99.999%{visibility:visible}100%{opacity:0;visibility:hidden}}@keyframes b24-widget-hidden{from{opacity:1;visibility:visible}50%{opacity:1}99.999%{visibility:visible}100%{opacity:0;visibility:hidden}}.b24-widget-button-hide-icons{-webkit-animation:hideIconsBottom .2s linear forwards;animation:hideIconsBottom .2s linear forwards}@-webkit-keyframes hideIconsBottom{from{opacity:1}50%{opacity:1}100%{opacity:0;-webkit-transform:translate(0,20px);transform:translate(0,20px);visibility:hidden}}@keyframes hideIconsBottom{from{opacity:1}50%{opacity:1}100%{opacity:0;-webkit-transform:translate(0,20px);transform:translate(0,20px);visibility:hidden}}@-webkit-keyframes hideIconsTop{from{opacity:1}50%{opacity:1}100%{opacity:0;-webkit-transform:translate(0,-20px);transform:translate(0,-20px);visibility:hidden}}@keyframes hideIconsTop{from{opacity:1}50%{opacity:1}100%{opacity:0;-webkit-transform:translate(0,-20px);transform:translate(0,-20px);visibility:hidden}}.b24-widget-button-popup-name{font:bold 14px \u0022Helvetica Neue\u0022,Arial,Helvetica,sans-serif;color:#000}.b24-widget-button-popup-description{margin:4px 0 0 0;font:13px \u0022Helvetica Neue\u0022,Arial,Helvetica,sans-serif;color:#424956}.b24-widget-button-close-item{width:28px;height:28px;\tbackground-image: url(\u0027data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2229%22%20height%3D%2229%22%20viewBox%3D%220%200%2029%2029%22%3E%3Cpath%20fill%3D%22%23FFF%22%20fill-rule%3D%22evenodd%22%20d%3D%22M18.866%2014.45l9.58-9.582L24.03.448l-9.587%209.58L4.873.447.455%204.866l9.575%209.587-9.583%209.57%204.418%204.42%209.58-9.577%209.58%209.58%204.42-4.42%22/%3E%3C/svg%3E\u0027); background-repeat:no-repeat;background-position:center;cursor:pointer}.b24-widget-button-wrapper.b24-widget-button-top{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}@-webkit-keyframes bottomOpen{from{opacity:0;-webkit-transform:translate(0,20px);transform:translate(0,20px)}to{opacity:1;-webkit-transform:translate(0,0);transform:translate(0,0)}}@keyframes bottomOpen{from{opacity:0;-webkit-transform:translate(0,20px);transform:translate(0,20px)}to{opacity:1;-webkit-transform:translate(0,0);transform:translate(0,0)}}@-webkit-keyframes topOpen{from{opacity:0;-webkit-transform:translate(0,-20px);transform:translate(0,-20px)}to{opacity:1;-webkit-transform:translate(0,0);transform:translate(0,0)}}@keyframes topOpen{from{opacity:0;-webkit-transform:translate(0,-20px);transform:translate(0,-20px)}to{opacity:1;-webkit-transform:translate(0,0);transform:translate(0,0)}}@-webkit-keyframes socialRotate{from{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}to{-webkit-transform:rotate(0);transform:rotate(0)}}@keyframes socialRotate{from{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}to{-webkit-transform:rotate(0);transform:rotate(0)}}@-webkit-keyframes socialRotateBack{from{-webkit-transform:rotate(90deg);transform:rotate(90deg)}to{-webkit-transform:rotate(0);transform:rotate(0)}}@keyframes socialRotateBack{from{-webkit-transform:rotate(90deg);transform:rotate(90deg)}to{-webkit-transform:rotate(0);.b24-widget-button-inner-item transform:rotate(0)}}.b24-widget-button-popup{display:none;position:absolute;left:100px;padding:12px 20px 12px 14px;width:312px;border:2px solid #2fc7f7;background:#fff;border-radius:15px;box-sizing:border-box;z-index:1;cursor:pointer}.b24-widget-button-popup-triangle{position:absolute;display:block;width:8px;height:8px;background:#fff;border-right:2px solid #2fc7f7;border-bottom:2px solid #2fc7f7}.b24-widget-button-popup-show{display:block;-webkit-animation:show .4s linear forwards;animation:show .4s linear forwards}.b24-widget-button-position-top-left .b24-widget-button-popup-triangle{top:19px;left:-6px;-webkit-transform:rotate(134deg);transform:rotate(134deg)}.b24-widget-button-position-bottom-left .b24-widget-button-popup-triangle{bottom:25px;left:-6px;-webkit-transform:rotate(134deg);transform:rotate(134deg)}.b24-widget-button-position-bottom-left .b24-widget-button-popup,.b24-widget-button-position-bottom-middle .b24-widget-button-popup{bottom:0;left:75px}.b24-widget-button-position-bottom-right .b24-widget-button-popup-triangle{bottom:25px;right:-6px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.b24-widget-button-position-bottom-right .b24-widget-button-popup{left:-320px;bottom:0}.b24-widget-button-position-top-right .b24-widget-button-popup-triangle{top:19px;right:-6px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.b24-widget-button-position-top-right .b24-widget-button-popup{top:0;left:-320px}.b24-widget-button-position-top-middle .b24-widget-button-popup-triangle{top:19px;left:-6px;-webkit-transform:rotate(134deg);transform:rotate(134deg)}.b24-widget-button-position-top-middle .b24-widget-button-popup,.b24-widget-button-position-top-left .b24-widget-button-popup{top:0;left:75px}.b24-widget-button-position-bottom-middle .b24-widget-button-popup-triangle{bottom:25px;left:-6px;-webkit-transform:rotate(134deg);transform:rotate(134deg)}.bx-touch .b24-widget-button-popup{padding:10px 22px 10px 15px}.bx-touch .b24-widget-button-popup{width:230px}.bx-touch .b24-widget-button-position-bottom-left .b24-widget-button-popup{bottom:90px;left:0}.bx-touch .b24-widget-button-popup-image{margin:0 auto 10px auto}.bx-touch .b24-widget-button-popup-content{text-align:center}.bx-touch .b24-widget-button-position-bottom-left .b24-widget-button-popup-triangle{bottom:-6px;left:25px;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.bx-touch .b24-widget-button-position-bottom-left .b24-widget-button-popup{bottom:90px;left:0}.bx-touch .b24-widget-button-position-bottom-right .b24-widget-button-popup{bottom:90px;left:-160px}.bx-touch .b24-widget-button-position-bottom-right .b24-widget-button-popup-triangle{bottom:-6px;right:30px;-webkit-transform:rotate(-45deg);transform:rotate(45deg)}.bx-touch .b24-widget-button-position-bottom-middle .b24-widget-button-popup{bottom:90px;left:50%;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}.bx-touch .b24-widget-button-position-bottom-middle .b24-widget-button-popup-triangle{bottom:-6px;left:108px;-webkit-transform:rotate(134deg);transform:rotate(45deg)}.bx-touch .b24-widget-button-position-top-middle .b24-widget-button-popup{top:90px;left:50%;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}.bx-touch .b24-widget-button-position-top-middle .b24-widget-button-popup-triangle{top:-7px;left:auto;right:108px;-webkit-transform:rotate(-135deg);transform:rotate(-135deg)}.bx-touch .b24-widget-button-position-top-left .b24-widget-button-popup{top:90px;left:0}.bx-touch .b24-widget-button-position-top-left .b24-widget-button-popup-triangle{left:25px;top:-6px;-webkit-transform:rotate(-135deg);transform:rotate(-135deg)}.bx-touch .b24-widget-button-position-top-right .b24-widget-button-popup{top:90px;left:-150px}.bx-touch .b24-widget-button-position-top-right .b24-widget-button-popup-triangle{top:-7px;right:40px;-webkit-transform:rotate(-135deg);transform:rotate(-135deg)}.b24-widget-button-popup-btn-hide{position:absolute;top:4px;right:4px;display:inline-block;height:20px;width:20px;\tbackground-image: url(\u0027data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2010%2010%22%3E%3Cpath%20fill%3D%22%23525C68%22%20fill-rule%3D%22evenodd%22%20d%3D%22M6.41%205.07l2.867-2.864-1.34-1.34L5.07%203.73%202.207.867l-1.34%201.34L3.73%205.07.867%207.938l1.34%201.34L5.07%206.41l2.867%202.867%201.34-1.34L6.41%205.07z%22/%3E%3C/svg%3E\u0027); background-repeat:no-repeat;background-position:center;opacity:.2;-webkit-transition:opacity .3s;transition:opacity .3s;cursor:pointer}.b24-widget-button-popup-btn-hide:hover{opacity:1;}\n.bx-touch .b24-widget-button-popup-btn-hide {\n\tbackground-image: url(\u0027data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%3E%3Cpath%20fill%3D%22%23525C68%22%20fill-rule%3D%22evenodd%22%20d%3D%22M8.36%207.02l5.34-5.34L12.36.34%207.02%205.68%201.68.34.34%201.68l5.34%205.34-5.34%205.342%201.34%201.34%205.34-5.34%205.34%205.34%201.34-1.34-5.34-5.34z%22/%3E%3C/svg%3E\u0027); background-repeat:no-repeat}.b24-widget-button-popup-inner{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap}.b24-widget-button-popup-content{width:222px}.b24-widget-button-popup-image{margin:0 10px 0 0;width:42px;text-align:center}.b24-widget-button-popup-image-item{display:inline-block;width:42px;height:42px;border-radius:100%;background-repeat:no-repeat;background-position:center;background-size:cover}.b24-widget-button-popup-button{margin:15px 0 0 0;-webkit-box-flex:1;-ms-flex:1;flex:1;text-align:center}.b24-widget-button-popup-button-item{display:inline-block;margin:0 16px 0 0;font:bold 12px \u0022Helvetica Neue\u0022,Arial,Helvetica,sans-serif;color:#08a6d8;text-transform:uppercase;border-bottom:1px solid #08a6d8;-webkit-transition:border-bottom .3s;transition:border-bottom .3s;cursor:pointer}.b24-widget-button-popup-button-item:hover{border-bottom:1px solid transparent}.b24-widget-button-popup-button-item:last-child{margin:0}.b24-widget-button-pulse{position:absolute;top:0;left:0;bottom:0;right:0;border:1px solid #00aeef;border-radius:50%}.b24-widget-button-pulse-animate{-webkit-animation:widgetPulse infinite 1.5s;animation:widgetPulse infinite 1.5s}@-webkit-keyframes widgetPulse{50%{-webkit-transform:scale(1,1);transform:scale(1,1);opacity:1}100%{-webkit-transform:scale(2,2);transform:scale(2,2);opacity:0}}@keyframes widgetPulse{50%{-webkit-transform:scale(1,1);transform:scale(1,1);opacity:1}100%{-webkit-transform:scale(2,2);transform:scale(2,2);opacity:0}}@media(min-height:1024px){.b24-widget-button-top .b24-widget-button-social,.b24-widget-button-bottom .b24-widget-button-social{max-height:900px}}@media(max-height:768px){.b24-widget-button-top .b24-widget-button-social,.b24-widget-button-bottom .b24-widget-button-social{max-height:600px}}@media(max-height:667px){.b24-widget-button-top .b24-widget-button-social,.b24-widget-button-bottom .b24-widget-button-social{max-height:440px}}@media(max-height:568px){.b24-widget-button-top .b24-widget-button-social,.b24-widget-button-bottom .b24-widget-button-social{max-height:380px}}@media(max-height:480px){.b24-widget-button-top .b24-widget-button-social,.b24-widget-button-bottom .b24-widget-button-social{max-height:335px}}",
        cache: true,
      },
      {
        type: "css",
        path: "https://studio.bitrix24.ru/bitrix/components/bitrix/crm.button.webform/templates/.default/style.css?1664804273.5873",
        content:
          ".bx-crm-widget-form-config-sidebar{position:fixed;left:-3850px;height:100%;width:369px;box-shadow:0 0 5px 0 rgba(0,0,0,0.25);background:rgba(255,255,255,.98);overflow:hidden;transition:opacity .5s ease;box-sizing:border-box;opacity:0;z-index:10101}.bx-crm-widget-form-config-sidebar-inner{position:absolute;width:100%;height:100%;overflow:hidden}.bx-crm-widget-form-config-sidebar.open-sidebar{left:auto;right:0;opacity:1;top:0}.bx-crm-widget-form-config-button.open-sidebar{display:none}.bx-crm-widget-form-config-button.button-visible{display:block}.bx-crm-widget-form-config-sidebar.close-sidebar{right:-385px}.bx-crm-widget-form-config-sidebar-header{position:absolute;top:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0 20px;height:60px;width:100%;border-bottom:1px solid #e6e6e7;box-shadow:0 1px 0 0 rgba(0,0,0,0.03);background:#fff;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;z-index:4}.bx-crm-widget-form-config-sidebar-close{display:inline-block;-webkit-box-flex:1;-ms-flex:1;flex:1}.bx-crm-widget-form-config-sidebar-close-item{display:inline-block;\tbackground-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij4gIDxwYXRoIGZpbGw9IiM4MDg2OEUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE2NDIuNDI0NjIsMjQ1LjAxMDQwOCBMMTYzNi40MTQyMSwyMzkgTDE2MzUsMjQwLjQxNDIxNCBMMTY0MS4wMTA0MSwyNDYuNDI0NjIxIEwxNjM1LDI1Mi40MzUwMjkgTDE2MzYuNDE0MjEsMjUzLjg0OTI0MiBMMTY0Mi40MjQ2MiwyNDcuODM4ODM1IEwxNjQ4LjQzNTAzLDI1My44NDkyNDIgTDE2NDkuODQ5MjQsMjUyLjQzNTAyOSBMMTY0My44Mzg4MywyNDYuNDI0NjIxIEwxNjQ5Ljg0OTI0LDI0MC40MTQyMTQgTDE2NDguNDM1MDMsMjM5IEwxNjQyLjQyNDYyLDI0NS4wMTA0MDggWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2MzUgLTIzOSkiLz48L3N2Zz4=); cursor:pointer;-webkit-transition:opacity .3s ease-in-out;-moz-transition:opacity .3s ease-in-out;transition:opacity .3s ease-in-out;opacity:.5}.bx-crm-widget-form-config-sidebar-close-item{width:20px;height:18px;background-position:3px 2px;background-repeat:no-repeat}.bx-crm-widget-form-config-sidebar-close-item:hover{opacity:1}.bx-crm-widget-form-config-sidebar-message{-webkit-box-flex:16;-ms-flex:16;flex:16;text-align:center}.bx-crm-widget-form-config-sidebar-message-item{display:inline-block;max-width:310px;font:var(--ui-font-weight-bold) 10px var(--ui-font-family-primary,var(--ui-font-family-helvetica));color:#424956;text-transform:uppercase;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.bx-crm-widget-form-config-sidebar-rollup{display:none;margin:0 6px 0 0}.bx-crm-widget-form-config-sidebar-hamburger{display:none}.bx-crm-widget-form-config-sidebar-info{position:absolute;top:60px;width:100%;-webkit-height:calc(100% - 130px);height:calc(100% - 130px);background:#fff;transition:opacity .6s ease;overflow:auto;opacity:1;-webkit-overflow-scrolling:touch}.bx-crm-widget-form-copyright-disabled .bx-crm-widget-form-config-sidebar-info{height:calc(100% - 75px)}.bx-crm-widget-form-copyright-disabled .bx-crm-widget-form-config-sidebar-logo{display:none}.bx-crm-widget-form-config-sidebar-chat-container{position:absolute;bottom:0;width:100%;background:#fff;box-sizing:border-box;z-index:4}.bx-crm-widget-form-config-sidebar-chat{padding:20px;-webkit-box-shadow:0 -2px 0 0 rgba(0,0,0,0.03);box-shadow:0 -2px 0 0 rgba(0,0,0,0.03)}.bx-crm-widget-form-config-sidebar-chat-border{height:3px;background:#2fc7f7;background:-moz-linear-gradient(left,#2fc7f7 0,#35e8f6 50%,#7ce3a7 74%,#bcf664 100%);background:-webkit-linear-gradient(left,#2fc7f7 0,#35e8f6 50%,#7ce3a7 74%,#bcf664 100%);background:linear-gradient(to right,#2fc7f7 0,#35e8f6 50%,#7ce3a7 74%,#bcf664 100%)}.bx-crm-widget-form-config-sidebar-logo{padding:15px 0 10px 0;text-align:center}.bx-crm-widget-form-config-sidebar-logo a{text-decoration:none !important}.bx-crm-widget-form-config-sidebar-logo-text{display:inline-block;margin:0 0 0 -2px;font:12px var(--ui-font-family-primary,var(--ui-font-family-helvetica));color:#b2b6bd}.bx-crm-widget-form-config-sidebar-logo-bx{display:inline-block;margin:0 -2px 0 0;font:var(--ui-font-weight-bold) 14px var(--ui-font-family-primary,var(--ui-font-family-helvetica));color:#2fc7f7}.bx-crm-widget-form-config-sidebar-logo-24{display:inline-block;font:var(--ui-font-weight-bold) 15px var(--ui-font-family-primary,var(--ui-font-family-helvetica));color:#215f98}@media(min-width:320px) and (max-width:420px){.bx-crm-widget-form-config-sidebar{width:100%}.bx-crm-widget-form-config-sidebar-info-block-container{padding:0;width:100%;height:115px;border-radius:0}.bx-crm-widget-form-config-sidebar-info-block-container:before{top:0;left:0;width:100%;height:113px;border-radius:0}.bx-crm-widget-form-config-sidebar-info-block-container:after{top:0;left:0;width:100%;height:100px;border-radius:0}.bx-crm-widget-form-config-sidebar-social{width:100%}.crm-webform-header-container{text-align:center}}",
        cache: true,
      },
      {
        type: "css",
        path: "https://studio.bitrix24.ru/bitrix/js/ui/icons/base/ui.icons.base.css?1669212942.1312",
        content:
          ":root{--ui-icon-size-xs:26px;--ui-icon-size-sm:31px;--ui-icon-size-md:39px;--ui-icon-size-lg:47px;--ui-icon-size:39px;--ui-icon-service-bg-color:#ebeff2}.ui-icon{position:relative;display:inline-block;width:var(--ui-icon-size)}.ui-icon\u003Ei{position:relative;display:block;padding-top:100%;width:100%;border-radius:50%;background-position:center;background-size:100% auto;background-repeat:no-repeat;background-color:var(--ui-icon-service-bg-color);background-image:var(--ui-icon-service-bg-image)}.ui-icon-square\u003Ei,.ui-icon[class*=ui-icon-file-]\u003Ei{border-radius:1px !important}button.ui-icon,.ui-icon-btn{padding:0;outline:0;border:0;background:transparent;text-decoration:none;cursor:pointer}button.ui-icon\u003Ei,.ui-icon-btn\u003Ei{transition:250ms linear opacity}button.ui-icon\u003Ei:hover,.ui-icon-btn\u003Ei:hover{opacity:.85}button.ui-icon\u003Ei:active,.ui-icon-btn\u003Ei:active{opacity:1}.ui-icon-xs{--ui-icon-size:var(--ui-icon-size-xs)}.ui-icon-sm{--ui-icon-size:var(--ui-icon-size-sm)}.ui-icon-md{--ui-icon-size:var(--ui-icon-size-md)}.ui-icon-lg{--ui-icon-size:var(--ui-icon-size-lg)}",
        cache: true,
      },
      {
        type: "css",
        path: "https://studio.bitrix24.ru/bitrix/js/ui/icons/service/ui.icons.service.css?1711434476.77415",
        content:
          ".ui-icon[class*=ui-icon-service-light-]{--ui-icon-service-bg-color:#ebeff2}.ui-icon-service-bitrix24{--ui-icon-service-bg-color:#3ac8f5;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M22.09 17.926h-1.386v3.716h3.551v-1.386H22.09v-2.33zm-.616 7.356a4.718 4.718 0 1 1 0-9.436 4.718 4.718 0 0 1 0 9.436zm9.195-6A5.19 5.19 0 0 0 23.721 14a5.19 5.19 0 0 0-9.872 1.69A6.234 6.234 0 0 0 15.233 28h14.761c2.444 0 4.425-1.724 4.425-4.425 0-3.497-3.406-4.379-3.75-4.293z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-bitrix24{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-bitrix24.svg);}\n\n.ui-icon-service-alice \u003E i {\n\tbackground: no-repeat center url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-alice.svg), rgb(182, 40, 255); \tbackground: no-repeat center url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-alice.svg), -moz-linear-gradient(45deg, rgba(182, 40, 255, 1) 0%, rgba(94, 39, 255, 1) 100%); \tbackground: no-repeat center url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-alice.svg), -webkit-linear-gradient(45deg, rgba(182, 40, 255, 1) 0%, rgba(94, 39, 255, 1) 100%); \tbackground: no-repeat center url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-alice.svg), linear-gradient(45deg, rgba(182, 40, 255, 1) 0%, rgba(94, 39, 255, 1) 100%); filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=\u0027#b628ff\u0027,endColorstr=\u0027#5e27ff\u0027,GradientType=1)}.ui-icon-service-light-alice{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-alice.svg)}.ui-icon-service-instagram{--ui-icon-service-bg-color:#d56c9a;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-instagram.svg)}.ui-icon-service-light-instagram{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-instagram.svg)}.ui-icon-service-fb-instagram{--ui-icon-service-bg-color:#c529a4;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-fb-instagram.svg)}.ui-icon-service-light-fb-instagram{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-fb-instagram.svg)}.ui-icon-service-vk,.ui-icon-service-vkontakte{--ui-icon-service-bg-color:#3871ba;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M30.889 26.837a1.64 1.64 0 0 0-.072-.137c-.364-.657-1.06-1.463-2.088-2.42l-.022-.022-.01-.01-.011-.012h-.011c-.467-.445-.762-.744-.886-.898-.226-.292-.277-.587-.153-.887.087-.226.415-.704.984-1.434.299-.387.535-.697.71-.93 1.261-1.68 1.808-2.753 1.64-3.22l-.065-.11c-.043-.065-.156-.126-.338-.18-.183-.055-.416-.064-.7-.028l-3.15.022a.408.408 0 0 0-.218.006l-.142.033-.055.027-.044.033a.486.486 0 0 0-.12.115.752.752 0 0 0-.109.191 17.894 17.894 0 0 1-1.17 2.464c-.27.453-.517.845-.744 1.178a5.663 5.663 0 0 1-.568.733 3.968 3.968 0 0 1-.416.378c-.124.095-.218.135-.284.12a8.002 8.002 0 0 1-.186-.043.728.728 0 0 1-.246-.269 1.203 1.203 0 0 1-.125-.427 4.716 4.716 0 0 1-.039-.443 9.28 9.28 0 0 1 .006-.526c.007-.226.01-.38.01-.46 0-.277.006-.579.017-.903l.027-.772c.008-.19.011-.391.011-.603 0-.211-.013-.377-.038-.498a1.706 1.706 0 0 0-.114-.35.59.59 0 0 0-.225-.263 1.262 1.262 0 0 0-.366-.148c-.386-.088-.878-.135-1.476-.142-1.356-.015-2.227.073-2.613.262a1.47 1.47 0 0 0-.416.329c-.13.16-.15.248-.054.263.437.065.747.222.929.47l.066.132c.05.095.102.263.153.504.05.24.084.507.098.799.036.533.036.99 0 1.369-.036.38-.07.675-.104.887a1.778 1.778 0 0 1-.147.515 2.25 2.25 0 0 1-.132.24.188.188 0 0 1-.054.055.818.818 0 0 1-.296.055c-.102 0-.226-.051-.371-.153a2.625 2.625 0 0 1-.454-.422 5.636 5.636 0 0 1-.53-.75 13.01 13.01 0 0 1-.613-1.139l-.175-.318c-.109-.204-.258-.502-.448-.892s-.357-.769-.503-1.134a.722.722 0 0 0-.262-.35l-.055-.033a.748.748 0 0 0-.175-.093 1.159 1.159 0 0 0-.251-.071l-2.996.022c-.306 0-.514.07-.623.208l-.044.066a.355.355 0 0 0-.033.175c0 .08.022.179.066.295.437 1.03.913 2.023 1.426 2.98.514.955.96 1.726 1.34 2.31a27.08 27.08 0 0 0 1.159 1.653c.393.518.654.85.781.997.128.146.228.255.301.328l.274.263c.175.175.431.385.77.63.34.244.715.485 1.127.722.412.238.89.431 1.437.58.547.15 1.08.21 1.597.182h1.257c.255-.023.448-.103.58-.241l.043-.055a.727.727 0 0 0 .082-.203c.026-.09.038-.191.038-.3a3.614 3.614 0 0 1 .071-.85c.055-.251.117-.441.186-.569a1.4 1.4 0 0 1 .422-.482.713.713 0 0 1 .087-.038c.175-.058.38-.002.618.17.237.172.459.383.667.635.208.252.457.535.749.849.291.314.546.547.765.7l.219.132c.146.088.335.168.568.241.233.073.437.091.613.055l2.799-.044c.276 0 .492-.046.645-.137.153-.091.244-.192.273-.301a.85.85 0 0 0 .006-.373 1.376 1.376 0 0 0-.077-.29z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-vkads{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-vkads.svg)}.ui-icon-service-light-vk,.ui-icon-service-light-vkontakte{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-vk.svg)}.ui-icon-service-vk-adds{--ui-icon-service-bg-color:#3871ba;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-vk-adds.svg)}.ui-icon-service-light-vk-adds{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-vk-adds.svg)}.ui-icon-service-vk-order{--ui-icon-service-bg-color:#4a73a5;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg width=\u002742\u0027 height=\u002742\u0027 viewBox=\u0027-11 -7 42 42\u0027 fill=\u0027none\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027%3E%3Cpath fill=\u0027%23fff\u0027 fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M14.667 17.053c.275-.059.472.142.777.42A14.827 14.827 0 0 1 17 19.159c-.107 0-.091.031 0 0-.057.104-.04.168 0 .42-.007-.067-.008.016 0 0-.047.162-.107.228-.389.422.077-.073-.065-.041-.389 0h-1.555c-.288.012-.425 0-.39 0-.346-.097-.472-.15-.388 0l-.389-.421c-.083.023-.254-.134-.389-.421-.254-.131-.42-.32-.389-.421-.307-.235-.456-.376-.778-.421.006-.184-.132-.222-.388 0 .125-.178.106-.169 0 0 .058-.144.017-.11 0 0-.1.007-.153.08-.39 0 .144.25.103.377 0 .42.03.292.015.48 0 .843.02-.08.011-.014 0 0-.023.108-.041.153 0 0V20c-.177-.11-.306-.056-.388 0H10c-.493-.023-.848-.063-1.167 0-.41-.262-.73-.391-1.166-.421-.112-.286-.363-.446-.778-.421-.036-.352-.208-.492-.389-.421v-.421c-.166.01-.233-.062-.389 0-.015-.258-.188-.479-.389-.842a3.16 3.16 0 0 1-.778-1.264c-.309-.211-.606-.723-.777-1.263-.515-.736-.832-1.398-1.167-2.105.015-.058 0-.123 0 0 0-.23.007-.269 0-.42.124-.01.263-.056.389 0h1.944a.497.497 0 0 1 .39 0c-.038-.002 0 .019 0 0 .14.114.197.192.388.42-.054.118.057.37 0 .421.31.47.41.668.389.842h.389c-.038.465.098.719.389.842-.028.305.09.472 0 .421.299.289.4.383.389.421.205.098.287.133.389 0 .034.133.1.12 0 0 .173.092.185.079.388 0-.173.04-.145-.014 0 0-.057-.188-.024-.302 0-.42.02-.166.042-.362 0-.422.091-.446.091-.751 0-1.263.057-.037.035-.215 0-.42-.033-.117-.067-.228 0-.422a6.017 6.017 0 0 1-.777-.42c-.05.14-.038.08 0 0 .132-.119.224-.192.389-.422.194.05.776-.009 1.555 0 .522.006.851.037 1.167 0 .038.12.12.154 0 0 .251.236.3.294.389.421-.02.024.006.102 0 0 .039.263.048.374 0 .421.048.236.045.368 0 .421.035.2.03.373 0 .421.015.384.011.584 0 .842.011-.018.01.084 0 .421 0-.035-.002.082 0 0 .003.247.011.345 0 .421.04.154.068.248 0 .421.151-.022.206.038.389 0-.076.092-.035.101 0 0 .052.12.115.094.388 0-.107-.032-.015-.117 0-.42.19.094.316-.07.39-.422.227-.09.393-.352.388-.842.476-.318.736-.864.778-1.263.205-.24.23-.283.389-.42-.1.065-.075.04 0 0 .015-.015.047-.023 0 0 .174-.052.222-.053.389 0h1.944c.212-.08.367-.074.39 0 .22 0 .296.04.388 0 .092.467-.273 1.183-1.167 2.104-.063.354-.22.56-.389.842-.41.464-.629.781-.777.842.008.29.042.488 0 .843zM6 5.75C6 3.69 7.798 2 10 2s4 1.69 4 3.75V7H6V5.75zM18.431 7.2c.035-.443-.159-.595-.392-.4h-2.745V5.6c.104-3.112-2.333-5.6-5.098-5.6-3.13 0-5.567 2.488-5.49 5.6v1.2H1.96c-.206-.194-.4.008-.392.4L0 22.4C0 23.69.622 24 1.569 24H18.43c.982 0 1.569-.31 1.569-1.6.017-.192-.486-5.26-1.569-15.2z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-vk-order{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-vk-order.svg)}.ui-icon-service-g-assistant{--ui-icon-service-bg-color:#33cde0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-g-assistant.svg)}.ui-icon-service-light-g-assistant{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-g-assistant.svg)}.ui-icon-service-crm{--ui-icon-service-bg-color:#11bff5;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-crm.svg)}.ui-icon-service-light-crm{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-crm.svg)}.ui-icon-service-livechat{--ui-icon-service-bg-color:#ffa900;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M12 12h11.785a2 2 0 0 1 2 2v7.227a2 2 0 0 1-2 2h-5.893l-4.384 4.318v-4.318H12a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2zm17.923 5.182a2 2 0 0 1 2 2v6.363a2 2 0 0 1-2 2h-1.508V31l-3.507-3.455h-5.016a2 2 0 0 1-2-2v-.59h6.65a3 3 0 0 0 3-3v-4.773h2.381z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-livechat-24{--ui-icon-service-bg-color:#2ec0ee;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-livechat-24.svg)}.ui-icon-service-light-livechat{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-livechat.svg)}.ui-icon-service-bitrix24-sms{--ui-icon-service-bg-color:#1ec6fa;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg width=\u002742\u0027 height=\u002742\u0027 viewBox=\u00270 0 42 42\u0027 fill=\u0027none\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M19.06 8C22.1891 8 25.253 9.23859 27.4694 11.5202C27.6079 11.6587 27.7426 11.8002 27.8733 11.9447C27.3557 11.8748 26.8273 11.8387 26.2905 11.8387C25.7782 11.8387 25.2736 11.8716 24.7787 11.9353C21.6389 9.66911 17.3199 9.42194 13.7797 11.5854C9.08605 14.4537 7.71708 20.5815 10.5854 25.2099L10.8462 25.6011L9.86832 29.3169L13.6493 28.339L14.0404 28.5346C14.7086 28.9413 15.4285 29.2574 16.1771 29.4828C16.695 30.365 17.3251 31.1734 18.0477 31.8884C16.4123 31.7634 14.7991 31.3101 13.3234 30.4903L7 32.12L8.69492 25.927C7.71708 24.1017 7.13038 22.0809 7.13038 19.9948C7.06519 13.4107 12.4107 8 19.06 8ZM19.9572 16.857C21.6943 15.0688 24.0956 14.0981 26.548 14.0981C31.7594 14.0981 35.9489 18.3387 35.8978 23.4989C35.8978 25.1338 35.4379 26.7177 34.6716 28.1482L35.9999 33.0019L31.0441 31.7246C29.6646 32.491 28.1319 32.8487 26.5991 32.8487C21.4389 32.8487 17.2494 28.6081 17.2494 23.4478C17.2494 20.9443 18.2201 18.5941 19.9572 16.857ZM24.8536 21.5747C24.8536 20.9034 24.2983 20.6679 23.7073 20.6679C22.9156 20.6679 22.2656 20.927 21.6629 21.1979L21.2492 19.9614C21.9229 19.6551 22.8565 19.3136 23.9674 19.3136C25.7045 19.3136 26.5435 20.1851 26.5435 21.4098C26.5435 22.623 25.597 23.342 24.6854 24.0343C23.9865 24.5652 23.3082 25.0804 23.0927 25.7909H26.6499V27.1569H20.9893C21.1824 24.8408 22.5569 23.8443 23.6123 23.0792C24.3009 22.58 24.8536 22.1793 24.8536 21.5747ZM29.1415 24.0108H29.8506V23.1746C29.8506 22.5741 29.8978 21.8792 29.9215 21.7261L28.1607 24.0461C28.3024 24.0343 28.8698 24.0108 29.1415 24.0108ZM26.3661 24.2816L30.2658 19.3354H31.424V24.0107H32.5821V25.3061H31.424V27.1551H29.8522V25.3061H26.3661V24.2816Z\u0027 fill=\u0027%23fff\u0027/%3E%3C/svg%3E%0A\u0022)}.ui-icon-service-bitrix24-sms-light{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-bitrix24-sms.svg)}.ui-icon-service-skype{--ui-icon-service-bg-color:#02aff0;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M30.561 22.282c.08-.507.123-1.025.123-1.554 0-5.498-4.457-9.955-9.956-9.955-.527 0-1.047.043-1.553.123a6.016 6.016 0 0 0-8.279 8.28 10.137 10.137 0 0 0-.122 1.552c0 5.499 4.457 9.954 9.954 9.954.528 0 1.048-.04 1.554-.12a6.016 6.016 0 0 0 8.28-8.28zm-5.106 2.974c-.421.606-1.04 1.08-1.848 1.42-.81.342-1.768.512-2.873.512-1.325 0-2.423-.232-3.289-.7a4.261 4.261 0 0 1-1.497-1.346c-.384-.561-.58-1.111-.58-1.647 0-.316.121-.591.356-.815.237-.226.543-.34.903-.34.296 0 .55.09.756.266.205.176.377.432.517.77.169.392.352.719.547.98.193.258.466.474.819.642.349.17.813.254 1.395.254.795 0 1.438-.172 1.93-.512.494-.342.732-.76.732-1.263 0-.401-.128-.72-.39-.969-.266-.252-.608-.444-1.033-.578a18.596 18.596 0 0 0-1.716-.43c-.963-.21-1.769-.454-2.42-.735-.654-.282-1.174-.668-1.56-1.155-.386-.492-.579-1.103-.579-1.827 0-.69.203-1.308.61-1.845.408-.54.996-.952 1.764-1.239.765-.287 1.666-.43 2.698-.43.825 0 1.539.095 2.143.285.602.191 1.105.444 1.506.76.4.317.693.65.879 1 .186.351.28.694.28 1.028 0 .311-.121.594-.356.84a1.175 1.175 0 0 1-.887.373c-.316 0-.564-.073-.736-.227-.168-.15-.344-.388-.534-.72-.241-.462-.53-.822-.865-1.08-.326-.253-.865-.385-1.614-.384-.693 0-1.248.142-1.667.42-.42.28-.622.607-.623.99 0 .24.07.442.208.615.141.174.337.326.589.453.252.13.508.23.766.302.26.074.693.18 1.294.322.754.162 1.438.344 2.052.542.614.199 1.137.438 1.57.724.435.285.776.648 1.019 1.087.245.439.367.976.367 1.607 0 .76-.211 1.444-.633 2.05z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-skype{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-skype.svg)}.ui-icon-service-fb,.ui-icon-service-facebook{--ui-icon-service-bg-color:#38659f;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M18.161 18.289H16v3.704h2.161V33h4.44V21.994h2.98s.279-1.776.415-3.718h-3.378v-2.533c0-.378.484-.887.963-.887H26V11h-3.29c-4.658 0-4.549 3.707-4.549 4.261v3.028z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-fb,.ui-icon-service-light-facebook{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-fb.svg)}.ui-icon-service-fb-comments{--ui-icon-service-bg-color:#38659f;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M10.76 17.843H9v2.97h1.76v8.823h3.613v-8.823h2.425s.227-1.424.338-2.98h-2.749v-2.03c0-.304.394-.712.783-.712h1.97V12h-2.678c-3.792 0-3.703 2.972-3.703 3.416v2.427zM22 16.015h9a2 2 0 0 1 2 2v5.247a2 2 0 0 1-2 2h-4.5l-3.611 3.556v-3.556H22a2 2 0 0 1-2-2v-5.247a2 2 0 0 1 2-2z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-fb-comments{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-fb-comments.svg)}.ui-icon-service-fb-messenger{--ui-icon-service-bg-color:#0183ff;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M14.854 31.373v-4.231a.169.169 0 0 0-.054-.129 9.016 9.016 0 0 1-1.31-1.511 8.37 8.37 0 0 1-1.028-2.028 8.19 8.19 0 0 1-.388-1.659 8.456 8.456 0 0 1-.064-1.511 8.527 8.527 0 0 1 1.733-4.737 8.862 8.862 0 0 1 1.815-1.788 9.123 9.123 0 0 1 2.663-1.355 9.515 9.515 0 0 1 1.597-.35A8.275 8.275 0 0 1 20.992 12c.406 0 .812.028 1.21.074.487.064.974.166 1.443.304a8.76 8.76 0 0 1 1.887.802 8.9 8.9 0 0 1 2.148 1.677 8.673 8.673 0 0 1 2.176 4.12 8.265 8.265 0 0 1 .135 2.664 8.431 8.431 0 0 1-.605 2.34 8.66 8.66 0 0 1-1.597 2.507 8.935 8.935 0 0 1-3.16 2.24 8.676 8.676 0 0 1-2.13.608c-.596.101-1.2.138-1.805.11a9.324 9.324 0 0 1-1.742-.24 12.567 12.567 0 0 1-.343-.082c-.045-.01-.072-.01-.118.018-.767.47-1.525.94-2.292 1.41-.425.268-.858.526-1.291.793l-.054.028zm.514-7.797c0 .009.01.009.01.018a580.834 580.834 0 0 0 4.152-2.36c.054-.027.08-.027.126.02l2.265 2.312c.046.047.064.047.109 0 .568-.635 1.128-1.271 1.697-1.907.93-1.051 1.868-2.092 2.798-3.143.054-.065.108-.12.162-.184a.148.148 0 0 0-.108.046 590.38 590.38 0 0 0-4.053 2.304c-.054.027-.081.027-.126-.019l-2.266-2.313c-.045-.046-.063-.046-.108 0-.569.636-1.128 1.272-1.697 1.908-.93 1.05-1.869 2.092-2.798 3.143-.054.055-.109.11-.163.175z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-fb-messenger{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-fb-messenger.svg)}.ui-icon-service-viber{--ui-icon-service-bg-color:#995aca;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M32.508 15.53l-.007-.027c-.53-2.17-2.923-4.499-5.12-4.983l-.025-.006a28.14 28.14 0 0 0-10.712 0l-.025.006c-2.197.484-4.59 2.813-5.121 4.983l-.006.027a21.443 21.443 0 0 0 0 9.135l.006.026c.509 2.078 2.723 4.3 4.839 4.91v2.423c0 .877 1.056 1.308 1.657.675l2.426-2.552a27.78 27.78 0 0 0 6.936-.467l.024-.005c2.198-.485 4.59-2.814 5.121-4.984l.007-.026a21.447 21.447 0 0 0 0-9.135zm-2.01 8.435c-.35 1.374-2.148 3.082-3.577 3.398-1.87.352-3.755.503-5.638.452a.134.134 0 0 0-.1.04L19.43 29.64l-1.865 1.899c-.136.14-.376.045-.376-.15v-3.895a.135.135 0 0 0-.11-.131h-.001c-1.429-.316-3.226-2.024-3.577-3.399a18.53 18.53 0 0 1 0-8.013c.351-1.374 2.148-3.082 3.577-3.398a26.437 26.437 0 0 1 9.843 0c1.43.316 3.227 2.024 3.578 3.398a18.511 18.511 0 0 1 0 8.014zm-5.676 2.065c-.225-.068-.44-.115-.64-.198-2.068-.861-3.97-1.973-5.478-3.677-.858-.968-1.529-2.062-2.096-3.22-.269-.549-.496-1.12-.727-1.686-.21-.517.1-1.05.427-1.44a3.37 3.37 0 0 1 1.128-.852c.334-.16.663-.068.906.216.527.614 1.01 1.259 1.402 1.97.24.438.175.973-.262 1.27-.106.073-.202.158-.301.24a.99.99 0 0 0-.228.24.662.662 0 0 0-.044.58c.538 1.486 1.446 2.64 2.935 3.263.238.1.477.215.751.183.46-.054.609-.56.931-.825.315-.258.717-.262 1.056-.046.34.215.668.447.995.68.321.23.64.455.936.717.285.251.383.581.223.923-.294.625-.72 1.146-1.336 1.478-.174.093-.382.124-.578.184-.225-.069.196-.06 0 0zm-2.378-11.847c2.464.075 4.488 1.86 4.922 4.517.074.452.1.915.133 1.375.014.193-.087.377-.278.38-.198.002-.286-.178-.3-.371-.025-.383-.042-.767-.09-1.146-.256-2.003-1.72-3.66-3.546-4.015-.275-.054-.556-.068-.835-.1-.176-.02-.407-.031-.446-.27a.32.32 0 0 1 .297-.37c.048-.003.096 0 .143 0 2.464.075-.047 0 0 0zm2.994 5.176c-.004.033-.006.11-.023.183-.06.265-.405.298-.484.03a.918.918 0 0 1-.028-.254c0-.558-.105-1.115-.347-1.6-.249-.5-.63-.92-1.075-1.173a2.786 2.786 0 0 0-.857-.306c-.13-.025-.26-.04-.39-.06-.157-.026-.241-.143-.234-.323.007-.169.114-.29.272-.28.52.035 1.023.165 1.485.45.94.579 1.478 1.493 1.635 2.713.007.055.018.11.022.165.009.137.014.274.023.455-.003.033-.009-.18 0 0zm-.996.397c-.275.005-.423-.144-.451-.391-.02-.173-.035-.348-.077-.516a1.447 1.447 0 0 0-.546-.84 1.436 1.436 0 0 0-.444-.21c-.202-.057-.412-.04-.613-.09-.219-.052-.34-.226-.305-.427a.394.394 0 0 1 .417-.311c1.275.09 2.186.737 2.316 2.209.01.104.02.213-.003.313a.325.325 0 0 1-.294.263c-.275.005.125-.008 0 0z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-viber{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-viber.svg)}.ui-icon-service-twilio{--ui-icon-service-bg-color:#e42e3a;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M18.565 21.419a2.04 2.04 0 0 0-2.037 2.037 2.04 2.04 0 0 0 2.037 2.037 2.04 2.04 0 0 0 2.037-2.037 2.034 2.034 0 0 0-2.037-2.037zm4.956 0a2.04 2.04 0 0 0-2.037 2.037 2.04 2.04 0 0 0 2.037 2.037 2.04 2.04 0 0 0 2.037-2.037 2.04 2.04 0 0 0-2.037-2.037zm-4.956-4.956a2.04 2.04 0 0 0-2.037 2.037 2.04 2.04 0 0 0 2.037 2.037 2.04 2.04 0 0 0 2.037-2.037 2.034 2.034 0 0 0-2.037-2.037zm4.956 0a2.04 2.04 0 0 0-2.037 2.037 2.04 2.04 0 0 0 2.037 2.037 2.04 2.04 0 0 0 2.037-2.037 2.04 2.04 0 0 0-2.037-2.037zm-2.516-5.458c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10c-.01-5.523-4.477-10-10-10zm0 16.569a6.569 6.569 0 1 1 0-13.138 6.569 6.569 0 0 1 0 13.138z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-twilio{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-twilio.svg)}.ui-icon-service-telegram{--ui-icon-service-bg-color:#2fc6f6;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M25.616 16.036L17.8 23.269a1.61 1.61 0 0 0-.502.965l-.266 1.964c-.035.263-.405.289-.478.035l-1.024-3.582a.948.948 0 0 1 .417-1.068l9.471-5.807c.17-.104.346.125.2.26m3.793-3.997L9.52 19.677a.568.568 0 0 0 .005 1.064l4.847 1.8 1.876 6.005c.12.385.592.527.906.272l2.701-2.192a.809.809 0 0 1 .983-.028l4.872 3.522c.336.242.811.06.895-.344l3.57-17.09a.57.57 0 0 0-.765-.647\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-telegram{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-telegram.svg)}.ui-icon-service-microsoft{--ui-icon-service-bg-color:#06afe5;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M13 13h7v7h-7v-7zm0 9h7v7h-7v-7zm9-9h7v7h-7v-7zm0 9h7v7h-7v-7z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-microsoft{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-microsoft.svg)}.ui-icon-service-kik{--ui-icon-service-bg-color:#212121;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M27.959 20.957l1.863-1.653c.31-.304.532-.652.532-1.087 0-.565-.399-1.087-1.02-1.087-.4 0-.71.218-1.02.566l-2.928 2.913v-5.392A1.19 1.19 0 0 0 24.19 14c-.665 0-1.198.565-1.198 1.217v9.522a1.19 1.19 0 0 0 1.198 1.218c.665 0 1.197-.566 1.197-1.218v-1.391l.932-.87 2.04 2.957c.266.391.577.565 1.02.565.577 0 1.11-.435 1.11-1.13 0-.261-.09-.522-.311-.783l-2.218-3.13zm-7.968-3.653c-.665 0-1.197.566-1.197 1.218v6.217a1.19 1.19 0 0 0 1.197 1.218c.666 0 1.198-.566 1.198-1.218v-6.217c-.045-.696-.577-1.218-1.198-1.218zm-5.023 3.653l1.863-1.653c.31-.304.532-.652.532-1.087 0-.565-.4-1.087-1.02-1.087-.4 0-.71.218-1.02.566l-2.928 2.913v-5.392A1.19 1.19 0 0 0 11.198 14c-.666 0-1.198.565-1.198 1.217v9.522a1.19 1.19 0 0 0 1.198 1.218c.665 0 1.197-.566 1.197-1.218v-1.391l.932-.87 2.04 2.957c.266.391.577.565 1.02.565.577 0 1.11-.435 1.11-1.13 0-.261-.09-.522-.311-.783l-2.218-3.13zm16.701-.653c-.754 0-1.33.566-1.33 1.305s.576 1.304 1.33 1.304c.754 0 1.331-.565 1.331-1.304 0-.74-.577-1.305-1.33-1.305z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-kik{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-kik.svg)}.ui-icon-service-slack{--ui-icon-service-bg-color:#776ebd;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M30.017 21.525a1.577 1.577 0 0 0-2.083-.796l-.758.34-1.944-4.346.758-.339a1.576 1.576 0 0 0-1.287-2.878l-.758.34-.339-.76a1.576 1.576 0 1 0-2.877 1.288l.34.759-4.346 1.943-.34-.758a1.576 1.576 0 0 0-2.877 1.286l.34.758-.759.34a1.575 1.575 0 1 0 1.287 2.878l.759-.34 1.943 4.346-.759.339a1.577 1.577 0 0 0 1.287 2.878l.758-.34.34.759a1.575 1.575 0 1 0 2.876-1.286l-.338-.76 4.346-1.942.339.756a1.575 1.575 0 1 0 2.877-1.285l-.34-.758.758-.34a1.575 1.575 0 0 0 .797-2.082zM19.953 24.3l-1.944-4.346 4.346-1.943 1.944 4.345-4.346 1.944z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-slack{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-slack.svg)}.ui-icon-service-groupme{--ui-icon-service-bg-color:#1db0ed;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M20.445 19.264c.17-.007.341 0 .511 0h.511c.075 0 .102-.027.102-.103v-1.005c0-.076-.02-.103-.095-.103-.347.007-.695 0-1.035 0-.068 0-.096.027-.096.096v1.02c0 .081.028.095.102.095zm8.46-3.01a3.02 3.02 0 0 0-.164-.856 3.481 3.481 0 0 0-1.396-1.813c-.62-.41-1.314-.582-2.05-.582-2.786-.007-5.565 0-8.35 0-.307 0-.613.014-.92.048a3.25 3.25 0 0 0-1.13.349 3.459 3.459 0 0 0-1.37 1.273 3.324 3.324 0 0 0-.517 1.786c-.007 2.58-.007 5.159 0 7.732 0 .54-.027 1.081.02 1.622.034.444.15.869.354 1.266.252.485.593.903 1.029 1.231.586.431 1.24.67 1.961.685.988.013 1.976.006 2.97 0 .068 0 .13 0 .17.068.157.253.314.513.47.766.3.486.606.972.906 1.465.041.061.068.082.116 0 .13-.212.266-.425.395-.637.32-.52.647-1.033.967-1.553.048-.075.096-.11.184-.11.92.007 1.846 0 2.765.007.28 0 .552-.02.831-.075.872-.178 1.574-.643 2.105-1.355.477-.643.674-1.382.681-2.176.007-1.471 0-2.942 0-4.728-.027-1.266.034-2.84-.027-4.414zm-11.143 3.12c0-.09.027-.117.116-.117.354.007.708 0 1.062.007.096 0 .13-.02.13-.123a22.782 22.782 0 0 1 0-.965c0-.096-.028-.123-.123-.116-.177.007-.361 0-.538 0h-.552c-.068 0-.095-.02-.095-.096 0-.376.007-.746 0-1.122 0-.096.048-.096.116-.096h1.049c.102 0 .136-.034.136-.137-.007-.349 0-.698-.007-1.047 0-.089.014-.137.123-.13.347.007.694.007 1.042 0 .095 0 .122.028.122.123-.007.35 0 .698-.007 1.047 0 .117.041.15.15.15.32-.006.634-.006.954 0 .095 0 .13-.02.13-.122-.008-.35 0-.698-.008-1.047 0-.11.035-.144.143-.144.348.007.695.007 1.043 0 .102 0 .122.034.122.13-.007.356 0 .712-.007 1.068 0 .088.028.116.116.116.361-.007.715 0 1.076 0 .089 0 .116.02.116.11a27.11 27.11 0 0 0 0 1.067c0 .102-.034.13-.13.13-.347-.007-.7 0-1.048-.007-.089 0-.123.02-.123.116.007.329.007.657 0 .979 0 .089.027.116.116.11.347-.008.702 0 1.049-.008.102 0 .143.028.136.137a27.16 27.16 0 0 0 0 1.068c0 .082-.027.11-.109.11-.347-.008-.701 0-1.049-.008-.116 0-.15.041-.15.151.007.349 0 .698.007 1.047 0 .089-.02.116-.109.116a28.21 28.21 0 0 0-1.076 0c-.095 0-.116-.034-.116-.123.007-.356 0-.712.007-1.067 0-.096-.027-.124-.123-.124-.326.007-.653.007-.973 0-.11 0-.137.041-.137.144.007.35 0 .705.007 1.054 0 .089-.02.116-.109.116a26.8 26.8 0 0 0-1.049 0c-.095 0-.116-.034-.116-.123.007-.349 0-.698.007-1.047 0-.11-.034-.144-.143-.144-.347.007-.695 0-1.042.007-.088 0-.13-.013-.122-.116-.007-.349-.007-.712-.014-1.074zm9.229 3.859c-.123.28-.313.52-.497.76a7.077 7.077 0 0 1-.654.704 6.14 6.14 0 0 1-1.362 1.013 6.332 6.332 0 0 1-1.676.657 6.856 6.856 0 0 1-1.124.171c-.238.02-.477.007-.708.02a7.178 7.178 0 0 1-1.873-.198 6.676 6.676 0 0 1-2.466-1.197 6.929 6.929 0 0 1-.899-.835 4.72 4.72 0 0 1-.742-1.013c-.116-.219-.19-.458-.082-.705a.728.728 0 0 1 .892-.397c.273.082.457.274.613.5.463.684 1.083 1.197 1.792 1.608a5.691 5.691 0 0 0 1.798.657c.272.055.545.082.824.089a5.507 5.507 0 0 0 1.996-.329 5.906 5.906 0 0 0 1.757-.999 5.36 5.36 0 0 0 1.049-1.17c.197-.294.585-.451.885-.376.545.137.681.588.477 1.04z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-groupme{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-groupme.svg)}.ui-icon-service-outlook{--ui-icon-service-bg-color:#0071c5;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M18.533 19.85c-.41-.549-1.213-.54-1.635-.069-.206.23-.335.498-.414.791-.138.513-.142 1.034-.068 1.555.047.334.151.65.347.93.328.469.855.629 1.354.408.302-.134.487-.38.619-.669.183-.402.227-.831.244-1.269-.024-.249-.038-.5-.076-.746a2.04 2.04 0 0 0-.371-.93m12.42-3.36c-.152-.284-.359-.466-.711-.465-2.07.006-4.14.003-6.21.001-.085 0-.11.022-.11.109.003 1.173.002 2.346 0 3.52 0 .063.02.1.074.134.392.242.783.485 1.172.732.095.06.174.056.266-.006l4.91-3.286c.217-.145.437-.285.656-.428v-.223l-.047-.089m-5.436 5.462c-.16.105-.29.104-.45-.005l-1.05-.716c-.025-.017-.053-.032-.09-.054l-.003.073c0 1.62 0 3.239-.002 4.858 0 .087.038.094.107.093h2.22c1.283 0 2.566 0 3.85-.003a.896.896 0 0 0 .859-.628c.01-.03.028-.06.042-.09v-7.154l-.083.06-5.4 3.566m-5.3-.583c.001.739-.09 1.377-.376 1.976-.269.563-.653 1.024-1.237 1.29a2.275 2.275 0 0 1-1.157.188c-.999-.085-1.606-.676-2.004-1.53a3.558 3.558 0 0 1-.305-1.253c-.049-.662-.014-1.316.192-1.952.195-.602.514-1.125 1.037-1.507.378-.276.807-.4 1.275-.413.538-.016 1.027.112 1.449.45.489.39.782.907.954 1.497.126.437.177.883.171 1.254m-.078-8.798l-2.97.57c-1.047.202-2.095.401-3.143.602l-1.979.381c-.015.003-.03.002-.046.002v14.588l4.192.87 3.524.737 3.15.654c.02.004.039.016.058.025h.262V12.17c0-.189 0-.187-.18-.152-.956.185-1.912.37-2.868.553z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-outlook{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-outlook.svg)}.ui-icon-service-webchat{--ui-icon-service-bg-color:#4393d0;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M25.183 20.983c-.845 0-1.521.694-1.521 1.561 0 .868.676 1.562 1.521 1.562.845 0 1.521-.694 1.521-1.562 0-.867-.76-1.561-1.52-1.561zm-4.14 0c-.846 0-1.522.694-1.522 1.561 0 .868.676 1.562 1.521 1.562.845 0 1.521-.694 1.521-1.562 0-.867-.676-1.561-1.52-1.561zm-4.057 0c-.845 0-1.521.694-1.521 1.561 0 .868.676 1.562 1.52 1.562.846 0 1.522-.694 1.522-1.562 0-.867-.676-1.561-1.521-1.561zM29.83 13H12.169c-.084 0-.169.087-.169.174V28.79c0 .087.085.174.169.174h17.662c.084 0 .169-.087.169-.174V13.174c0-.087-.085-.174-.169-.174zm-2.535 1.649c0-.174.084-.26.253-.26h.845c.17 0 .254.086.254.26v.867c0 .174-.085.26-.254.26h-.845c-.169 0-.253-.086-.253-.26v-.867zm-2.197 0c0-.174.084-.26.253-.26h.845c.17 0 .254.086.254.26v.867c0 .174-.085.26-.254.26h-.845c-.169 0-.253-.086-.253-.26v-.867zm-11.662 0c0-.174.084-.26.253-.26h8.535c.17 0 .254.086.254.26v.867c0 .174-.085.26-.254.26H13.69c-.169 0-.253-.086-.253-.26v-.867zm15.55 13.101c0 .174-.085.26-.254.26H13.183c-.169 0-.253-.086-.253-.26V17.685c0-.173.084-.26.253-.26h15.55c.168 0 .253.087.253.26V27.75z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-webchat{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-webchat.svg)}.ui-icon-service-directline{--ui-icon-service-bg-color:#4393d0;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M21 12c-3.802 0-6.983 2.328-8.38 5.664v.077A9.018 9.018 0 0 0 12 21c0 4.966 4.034 9 9 9s9-4.034 9-9-4.034-9-9-9zm7.37 10.94h-3.103c.078-.621.078-1.242.078-1.862 0-.854-.078-1.707-.155-2.483h3.18a8.74 8.74 0 0 1 .389 2.483c0 .62-.078 1.319-.233 1.94 0-.078-.078-.078-.155-.078zM21 28.914c-1.164 0-2.405-1.862-2.948-4.733h5.974c-.62 2.87-1.862 4.733-3.026 4.733zm-3.181-5.974c-.078-.621-.078-1.242-.078-1.862 0-.854.078-1.707.156-2.483h6.129c.077.776.155 1.63.155 2.483 0 .62 0 1.319-.078 1.862H17.82zm-4.655-1.862c0-.854.155-1.707.388-2.483h3.18c-.077.776-.154 1.63-.154 2.483 0 .62 0 1.241.077 1.862h-3.258a7.652 7.652 0 0 1-.233-1.862zM21 13.164c1.086 0 2.25 1.552 2.87 4.112h-5.663c.543-2.483 1.707-4.112 2.793-4.112zm6.905 4.112h-2.87c-.31-1.474-.854-2.793-1.475-3.724 1.862.698 3.414 2.017 4.345 3.724zm-9.465-3.647c-.621.931-1.164 2.173-1.474 3.724h-2.871a7.607 7.607 0 0 1 4.345-3.724zm-4.656 10.552h3.026c.31 1.785.854 3.259 1.63 4.267-2.095-.698-3.802-2.25-4.656-4.267zm9.699 4.267c.776-1.008 1.319-2.56 1.63-4.267h3.025c-.854 2.017-2.56 3.569-4.655 4.267z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-directline{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-directline.svg)}.ui-icon-service-callback{--ui-icon-service-bg-color:#ff5752;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-call.svg)}.ui-icon-service-light-callback{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-call.svg)}.ui-icon-service-call{--ui-icon-service-bg-color:#54d1e1;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-call.svg)}.ui-icon-service-light-call{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-call.svg)}.ui-icon-service-calltracking{--ui-icon-service-bg-color:#1eae43;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-calltracking.svg)}.ui-icon-service-light-calltracking{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-calltracking.svg)}.ui-icon-service-envelope{--ui-icon-service-bg-color:#4393d0;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M28.954 15H13.046c-.58 0-1.046.484-1.046 1.072v10.856A1.06 1.06 0 0 0 13.046 28h15.908c.58 0 1.046-.484 1.046-1.072V16.072c0-.595-.466-1.072-1.046-1.072zM21 21.099l-5.809-4.301H26.81l-5.81 4.3zm-7.246 5.103v-8.25l6.733 4.986c.007.007.014.007.02.014.007.007.02.014.027.02.027.015.048.029.075.042h.006a.407.407 0 0 0 .081.035c.007 0 .014.007.02.007.061.02.122.034.183.041h.013c.034 0 .061.007.095.007.033 0 .06 0 .094-.007h.014a.865.865 0 0 0 .182-.041c.007 0 .013-.007.02-.007.027-.014.054-.02.081-.035h.007c.027-.013.047-.027.074-.041.007-.007.02-.014.027-.02.007-.008.013-.008.02-.015l6.733-4.985v8.25H13.754z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-envelope{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-envelope.svg)}.ui-icon-service-email{--ui-icon-service-bg-color:#90be00;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-email.svg)}.ui-icon-service-light-email{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-email.svg)}.ui-icon-service-ok{--ui-icon-service-bg-color:#ee8208;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3C%3Fxml version=\u00271.0\u0027 encoding=\u0027UTF-8\u0027%3F%3E%3Csvg width=\u002744px\u0027 height=\u002744px\u0027 viewBox=\u00270 0 44 44\u0027 version=\u00271.1\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027 xmlns:xlink=\u0027http://www.w3.org/1999/xlink\u0027%3E%3Cg id=\u0027Group-3\u0027 transform=\u0027translate(1, 1)\u0027%3E%3Cpath d=\u0027M20.9581384,11.5509713 C22.3406381,11.5509713 23.466354,12.6758916 23.466354,14.0594024 C23.466354,15.4411287 22.3406381,16.5663465 20.9581384,16.5663465 C19.5753412,16.5663465 18.4496254,15.4411287 18.4496254,14.0594024 C18.4496254,12.6758916 19.5753412,11.5509713 20.9581384,11.5509713 M20.9581384,20.1153846 C24.2987086,20.1153846 27.0153846,17.3993674 27.0153846,14.0594024 C27.0153846,10.7176529 24.2987086,8 20.9581384,8 C17.6172707,8 14.9,10.7176529 14.9,14.0594024 C14.9,17.3993674 17.6172707,20.1153846 20.9581384,20.1153846\u0027 fill=\u0027%23fff\u0027 fill-rule=\u0027nonzero\u0027/%3E%3Cpath d=\u0027M23.4188521,25.4501792 C24.6742432,25.1621461 25.8866321,24.6622388 27.0009033,23.9574639 C27.8459567,23.4228281 28.1001844,22.3005499 27.5678053,21.4512254 C27.0364861,20.6002253 25.9214578,20.3443313 25.076253,20.8800333 C22.5491179,22.4781526 19.2956397,22.4772387 16.7701702,20.8800333 C15.9249654,20.3443313 14.80918,20.6002253 14.2783151,21.4512254 C13.7460874,22.3011592 14.0001636,23.4228281 14.8444599,23.9574639 C15.9594883,24.6622388 17.1711201,25.1621461 18.4266626,25.4501792 L14.9783118,28.9196761 C14.2727127,29.6294775 14.2727127,30.7802391 14.9790689,31.4900404 C15.3323227,31.8452458 15.7936876,32.0220869 16.255961,32.0220869 C16.7189915,32.0220869 17.1818706,31.8452458 17.5342159,31.4900404 L20.9224545,28.0811661 L24.3135699,31.4900404 C25.0176549,32.2007558 26.1623608,32.2007558 26.8670514,31.4900404 C27.5744676,30.7802391 27.5744676,29.6285636 26.8670514,28.9196761 L23.4188521,25.4501792 Z\u0027 fill=\u0027%23fff\u0027 fill-rule=\u0027nonzero\u0027/%3E%3C/g%3E%3C/svg%3E\u0022)}.ui-icon-service-light-ok{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-ok.svg)}.ui-icon-service-webform{--ui-icon-service-bg-color:#00b4ac;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-webform.svg)}.ui-icon-service-light-webform{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-webform.svg)}.ui-icon-service-apple{--ui-icon-service-bg-color:#000;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-apple.svg)}.ui-icon-service-light-apple{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-apple.svg)}.ui-icon-service-imessage{--ui-icon-service-bg-color:#54d857;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 width=\u002742\u0027 height=\u002742\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M21.5 11.6c-5.799 0-10.5 4.223-10.5 9.432 0 2.647 1.215 5.038 3.17 6.751.556 3.422-2.13 4.055-2.13 4.055s-.334.482.499.66c3.353.688 6.064-2.339 6.064-2.339l.003-.06c.92.236 1.89.366 2.894.366 5.8 0 10.5-4.223 10.5-9.433S27.3 11.6 21.5 11.6z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-imessage{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-imessage.svg)}.ui-icon-service-site-b24{--ui-icon-service-bg-color:#4393d0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-siteb24.svg)}.ui-icon-service-light-site-b24{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-siteb24.svg)}.ui-icon-service-fb-adds{--ui-icon-service-bg-color:#38659f;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-fb-adds.svg)}.ui-icon-service-light-fb-adds{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-fb-adds.svg)}.ui-icon-service-estore{--ui-icon-service-bg-color:#90be00;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-estore.svg)}.ui-icon-service-light-estore{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-estore.svg)}.ui-icon-service-site{--ui-icon-service-bg-color:#d4825a;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-ownsite.svg)}.ui-icon-service-light-site{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-ownsite.svg)}.ui-icon-service-call-up{--ui-icon-service-bg-color:#55d0e0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-call-up.svg)}.ui-icon-service-light-call-up{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-call-up.svg)}.ui-icon-service-organic{--ui-icon-service-bg-color:#6baf0e;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-organic.svg)}.ui-icon-service-light-organic{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-organic.svg)}.ui-icon-service-common{--ui-icon-service-bg-color:#55d0e0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-common.svg)}.ui-icon-service-light-common{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-common.svg)}.ui-icon-service-universal{--ui-icon-service-bg-color:#55d0e0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-universal.svg)}.ui-icon-service-light-universal{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-universal.svg)}.ui-icon-service-instagram-fb{--ui-icon-service-bg-color:#e85998;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg width=\u002742\u0027 height=\u002742\u0027 viewBox=\u0027-12 -11 42 42\u0027 fill=\u0027none\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M13.144 4.282c0-.526.435-.951.973-.951s.974.425.974.951a.962.962 0 0 1-.974.952.962.962 0 0 1-.973-.952zM5.354 0h7.79c2.948 0 5.354 2.351 5.354 5.234v2.269h-1.947v-2.27c0-1.86-1.503-3.33-3.407-3.33h-7.79c-1.904 0-3.407 1.47-3.407 3.33v7.614c0 1.862 1.503 3.331 3.407 3.331h6.45v1.903h-6.45C2.405 18.081 0 15.73 0 12.847V5.234C0 2.35 2.405 0 5.354 0zM4.138 9.04c0-2.748 2.3-4.996 5.111-4.996 2.38 0 4.39 1.615 4.95 3.779a3.98 3.98 0 0 0-1.801 1.531c.01-.102.015-.207.015-.314 0-1.719-1.405-3.092-3.164-3.092-1.759 0-3.164 1.373-3.164 3.092 0 1.72 1.405 3.093 3.164 3.093a3.17 3.17 0 0 0 2.604-1.33l-.023.17a3.654 3.654 0 0 0-.024.403v1.98a5.15 5.15 0 0 1-2.557.68c-2.812 0-5.111-2.247-5.111-4.996zm10.172 4.393h1.014V12.08c0-.247-.051-1.902 2.133-1.902h1.542V11.9h-1.134c-.224 0-.45.227-.45.396v1.13h1.583c-.064.868-.195 1.66-.195 1.66h-1.397V20h-2.082v-4.914H14.31v-1.653z\u0027 fill=\u0027%23fff\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-instagram-direct{--ui-icon-service-bg-color:#eb358c;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg width=\u002742\u0027 height=\u002742\u0027 viewBox=\u00270 0 42 42\u0027 fill=\u0027none\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M16.8378 11C14.3067 11 12 13.3694 12 15.9693V24.2515C12 26.8515 14.3067 29.2209 16.8378 29.2209H23.9353C23.6188 28.7355 23.2072 28.3154 22.72 27.9907L22.0805 27.5644H17.0274C15.1063 27.5644 13.6125 26.0299 13.6125 24.0566V16.1642C13.6125 14.1909 15.1063 12.6564 17.0274 12.6564H24.7109C26.6319 12.6564 28.1258 14.1909 28.1258 16.1642V18.7293L29.7385 18.3398V15.9693C29.7385 13.3694 27.4318 11 24.9007 11H16.8378ZM20.869 15.1411C23.271 15.1411 25.2784 16.963 25.6465 19.328L24.0713 19.7084C23.8805 18.0592 22.5295 16.7975 20.8691 16.7975C19.0763 16.7975 17.644 18.2688 17.644 20.1104C17.644 21.0048 17.9818 21.8118 18.5347 22.4053C18.3435 22.9267 18.292 23.5087 18.4163 24.0927C18.442 24.2135 18.4747 24.3319 18.5143 24.4473C17.0358 23.5945 16.0313 21.9673 16.0313 20.1104C16.0313 17.3771 18.208 15.1411 20.869 15.1411ZM24.9007 15.1411C24.9007 14.6833 25.2613 14.3128 25.707 14.3128C26.1527 14.3128 26.5133 14.6833 26.5133 15.1411C26.5133 15.5988 26.1527 15.9693 25.707 15.9693C25.2613 15.9693 24.9007 15.5988 24.9007 15.1411ZM23.19 23.6296L31.1239 21.8753L26.9903 28.8583L26.5452 25.9039C26.4775 25.4549 26.1964 25.0702 25.7956 24.8782L23.19 23.6296ZM32.8032 22.1832C33.4078 21.1618 32.5292 19.8931 31.3916 20.1447L22.0841 22.2027C20.8421 22.4774 20.6513 24.2161 21.8028 24.7679L24.9948 26.2974L25.5295 29.8457C25.7185 31.1008 27.3297 31.43 27.972 30.3448L32.8032 22.1832Z\u0027 fill=\u0027%23fff\u0027/%3E%3C/svg%3E%0A\u0022)}.ui-icon-service-light-instagram-direct{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-instagram-sh.svg)}.ui-icon-service-light-instagram-fb{--ui-icon-service-bg-color:#e85998;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-instagram-fb.svg)}.ui-icon-service-light-instagram-fb{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-instagram-fb.svg)}.ui-icon-service-1c{--ui-icon-service-bg-color:#fade39;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-1c.svg?v=1)}.ui-icon-service-light-1c{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-1c.svg)}.ui-icon-service-red-1c{--ui-icon-service-bg-color:#eb181e;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-red-1c.svg?v=1)}.ui-icon-service-office365{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-office365.svg)}.ui-icon-service-light-office365{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-office365.svg)}.ui-icon-service-ya,.ui-icon-service-yandex{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-ya.svg)}.ui-icon-service-light-ya{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-ya.svg)}.ui-icon-service-ya-dialogs{--ui-icon-service-bg-color:#3a78db;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 width=\u002742\u0027 height=\u002742\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M28.817 24.06c-.068.845-.443 1.499-1.16 1.936-1.092.666-2.2 1.307-3.302 1.96-.129.077-.252.163-.377.245-.352.112-.62.415-1.034.4-.576-.021-1.039-.38-1.046-.955-.017-1.368-.048-2.74.033-4.103.057-.955.615-1.708 1.346-2.315.15-.125.307-.241.461-.362l4.49-2.55c.542-.309.671-.245.66.361-.032 1.794.074 3.59-.071 5.382m-9.324-5.592c-1.352-.808-2.732-1.568-4.099-2.352-.518-.297-.535-.46-.036-.75a408.602 408.602 0 0 1 4.575-2.603c.858-.482 1.729-.439 2.588.016.345.184.686.374 1.029.562.947.55 1.886 1.115 2.843 1.646.444.246.746.567.74 1.084-.007.515-.372.782-.78 1.017-.972.558-1.936 1.131-2.902 1.698-1.379.625-2.68.448-3.958-.318m.307 9.746c-.006.574-.153.658-.634.383-1.462-.835-2.95-1.626-4.372-2.524-.75-.474-1.284-1.17-1.27-2.17.021-1.553-.02-3.106-.013-4.658.004-.885.797-1.33 1.57-.896.932.524 1.849 1.075 2.784 1.591 1.305.72 1.876 1.865 1.931 3.3.032.828.006 1.658.006 2.487 0 .83.006 1.658-.002 2.487m9.03-14.334c-.551-.314-1.111-.618-1.65-.944a175.673 175.673 0 0 0-3.718-2.204c-1.29-.817-2.662-1.004-4.021-.278-1.684.9-3.311 1.907-4.961 2.871-.455.266-.916.526-1.349.825-1.106.763-1.688 1.842-1.706 3.173-.031 2.368-.034 4.737.002 7.105.022 1.44.671 2.584 1.918 3.33 2.04 1.22 4.099 2.405 6.14 3.62.314.188.647.33.987.37h1.358c.926-.257 1.755-.708 2.538-1.252 1.636-.965 3.345-1.803 4.902-2.909 1.702-1.21 1.703-2.839 1.702-2.985-.047-5.237-.072-7.866-.076-7.889-.23-1.28-.958-2.202-2.067-2.833z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-ya-dialogs{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-ya-dialogs.svg)}.ui-icon-service-ya-direct{--ui-icon-service-bg-color:#ffce00;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-ya-direct.svg)}.ui-icon-service-light-ya-direct{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-ya-direct.svg)}.ui-icon-service-ya-toloka{--ui-icon-service-bg-color:#ea8428;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-ya-toloka.svg);background-size:30px}.ui-icon-service-light-ya-toloka{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-ya-toloka.svg)}.ui-icon-service-liveid{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-liveid.svg)}.ui-icon-service-light-liveid{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-liveid.svg)}.ui-icon-service-twitter{--ui-icon-service-bg-color:#1ea1f2;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-twitter.svg)}.ui-icon-service-light-twitter{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-twitter.svg)}.ui-icon-service-google{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-google.svg)}.ui-icon-service-light-google{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-google.svg)}.ui-icon-service-google-ads{--ui-icon-service-bg-color:#3889db;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-googleads.svg)}.ui-icon-service-light-google-ads{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-googleads.svg)}.ui-icon-service-rest-contact-center{--ui-icon-service-bg-color:#eb9e06;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-common.svg)}.ui-icon-service-light-rest-contact-center{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-common.svg)}.ui-icon-service-chatbot{--ui-icon-service-bg-color:#359fd0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-chatbot.svg)}.ui-icon-service-light-chatbot{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-chatbot.svg)}.ui-icon-service-telephonybot{--ui-icon-service-bg-color:#af6d4d;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-telephonybot.svg)}.ui-icon-service-light-telephonybot{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-telephonybot.svg)}.ui-icon-service-campaign{--ui-icon-service-bg-color:#2bbff0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-campaign.svg)}.ui-icon-service-light-campaign{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-campaign.svg)}.ui-icon-service-sms{--ui-icon-service-bg-color:#f4769c;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-sms.svg)}.ui-icon-service-light-sms{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-sms.svg)}.ui-icon-service-messenger{--ui-icon-service-bg-color:#97cb13;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-messenger.svg)}.ui-icon-service-light-messenger{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-messenger.svg)}.ui-icon-service-infocall{--ui-icon-service-bg-color:#349ed0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-infocall.svg)}.ui-icon-service-audio-infocall{--ui-icon-service-bg-color:#3dc9db;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-audio-infocall.svg)}.ui-icon-service-light-audio-infocall{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-audio-infocall.svg)}.ui-icon-service-light-infocall{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-audio-infocall.svg)}.ui-icon-service-deal{--ui-icon-service-bg-color:#349ed0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-deal.svg)}.ui-icon-service-light-deal{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-deal.svg)}.ui-icon-service-edna{--ui-icon-service-bg-color:#1aea76;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg width=\u002796\u0027 height=\u002796\u0027 viewBox=\u00270 0 96 96\u0027 fill=\u0027none\u0027 xmlns=\u0027http://www.w3.org/2000/svg\u0027%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M21.2669 39.7473C25.8392 37.6335 29.214 37.4178 31.3477 39.208C35.1145 42.4002 33.4815 46.8865 32.0445 50.8335C30.9123 53.9825 29.6712 55.9022 28.4519 57.0668C26.4488 58.9649 24.8812 59.0296 23.6619 58.9649C21.0709 58.8355 19.0025 57.3472 16.6946 54.0688C14.735 51.2433 13.0803 48.2668 14.5826 44.8806C14.8221 44.3414 15.7366 42.2923 21.2669 39.7473ZM23.7421 54.2211C24.7626 54.3072 26.0002 54.4117 27.7552 49.5179C29.3664 45.0747 29.3664 43.7806 28.1907 42.9179C27.6463 42.5296 26.3835 42.2923 23.2047 43.8022C20.396 45.1394 19.2855 45.8943 18.959 46.6708C18.5017 47.7492 18.3711 48.5688 20.2871 51.308C21.5935 53.1845 22.7692 54.1335 23.7272 54.2198L23.7421 54.2211Z\u0027 fill=\u0027%23fff\u0027/%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M57.9328 40.2004H56.6264C56.4087 40.2004 56.2563 40.373 56.2563 40.5671V44.5789C55.2765 43.673 54.0137 43.1985 52.6637 43.1985C49.659 43.1985 47.1987 45.722 47.1987 48.8495C47.1987 51.9554 49.659 54.5004 52.6637 54.5004C54.0137 54.5004 55.32 54.0044 56.3216 53.0554L56.3869 53.7456C56.4087 53.9397 56.5828 54.069 56.757 54.069H57.9328C58.1505 54.069 58.3029 53.8965 58.3029 53.7024V40.5887C58.3029 40.3946 58.1287 40.2004 57.9328 40.2004ZM56.0821 48.8495C56.0821 50.7906 54.558 52.3652 52.6637 52.3652C50.7695 52.3652 49.2236 50.7906 49.2236 48.8495C49.2236 46.9083 50.7477 45.3338 52.6419 45.3338C54.5362 45.3338 56.0821 46.8867 56.0821 48.8495Z\u0027 fill=\u0027%23fff\u0027/%3E%3Cpath d=\u0027M69.5585 45.1181C69.2972 44.7299 68.992 44.3848 68.6439 44.126C68.2953 43.8456 67.9037 43.6299 67.4683 43.4789C66.7063 43.1985 65.8569 43.1554 64.9861 43.3064C63.7233 43.5221 62.8087 44.1692 62.2645 44.6437L62.1992 43.9319C62.1773 43.7378 62.0032 43.6083 61.8291 43.6083H60.5659C60.3484 43.6083 60.1958 43.7809 60.1958 43.975V53.7025C60.1958 53.9181 60.3703 54.0692 60.5659 54.0692H61.9598C62.1773 54.0692 62.3299 53.8966 62.3299 53.7025V46.7789C63.3533 46.0672 64.2675 45.5711 65.3128 45.377C65.7482 45.2907 66.2923 45.3554 66.7716 45.528C67.1851 45.6789 67.5551 45.9378 67.7731 46.326C68.2304 47.0162 68.2304 47.879 68.2304 48.6554V53.6809C68.2304 53.8966 68.4045 54.0476 68.6005 54.0476H70.0154C70.2333 54.0476 70.3855 53.875 70.3855 53.6809V49.1515C70.4074 48.224 70.4074 47.2319 70.1246 46.3044C69.972 45.8946 69.7979 45.4633 69.5585 45.1181Z\u0027 fill=\u0027%23fff\u0027/%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M80.9896 43.5865H82.2963C82.5138 43.5865 82.6878 43.7591 82.6878 44.0179V53.7237C82.6878 53.9179 82.5357 54.0904 82.3178 54.0904H81.1422C80.9682 54.0904 80.7936 53.961 80.7722 53.7669L80.7068 53.0767C79.7049 54.0257 78.3987 54.5218 77.0486 54.5218C74.0443 54.5218 71.584 51.9767 71.584 48.8708C71.584 45.7434 74.0443 43.2198 77.0486 43.2198C78.3768 43.2198 79.6401 43.6944 80.6196 44.6003V43.9532C80.6196 43.7591 80.7722 43.5865 80.9896 43.5865ZM77.0486 52.3649C78.9433 52.3649 80.467 50.7904 80.467 48.8493C80.467 46.8865 78.9433 45.3336 77.0486 45.3336C75.1544 45.3336 73.6303 46.9081 73.6303 48.8493C73.6303 50.7904 75.1544 52.3649 77.0486 52.3649Z\u0027 fill=\u0027%23fff\u0027/%3E%3Cpath fill-rule=\u0027evenodd\u0027 clip-rule=\u0027evenodd\u0027 d=\u0027M46.3268 47.7493C45.9349 45.1826 43.8883 43.2198 41.232 43.2198H41.1667C38.162 43.2198 35.7017 45.7434 35.7017 48.8708C35.7017 51.9767 38.1402 54.5003 41.1667 54.5218H41.2755C43.1044 54.5218 44.6721 53.7669 45.826 52.4944C45.9567 52.3434 45.9567 52.1493 45.826 51.9983L44.9987 51.0924C44.9116 51.0061 44.8245 50.963 44.7157 50.963C44.6068 50.963 44.4979 51.0277 44.4326 51.114C43.7141 52.0198 42.7561 52.4081 41.2973 52.4081H41.1667C39.5119 52.4081 38.1402 51.2003 37.8136 49.6042H45.543C46.022 49.6042 46.414 49.2159 46.414 48.7198C46.4046 48.7105 46.3992 48.6211 46.3909 48.4826C46.38 48.2998 46.364 48.0315 46.3268 47.7493ZM38.0096 47.4904C38.5103 46.2179 39.7296 45.3336 41.1449 45.3336H41.2537C42.669 45.3336 43.8665 46.1963 44.302 47.4904H38.0096Z\u0027 fill=\u0027%23fff\u0027/%3E%3C/svg%3E%0A\u0022)}.ui-icon-service-light-edna{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-edna.svg)}.ui-icon-service-lead{--ui-icon-service-bg-color:#349ed0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-lead.svg)}.ui-icon-service-light-lead{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-lead.svg)}.ui-icon-service-whatsapp{--ui-icon-service-bg-color:#01e675;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 width=\u002740\u0027 height=\u002740\u0027 viewBox=\u0027-5 -5 50 50\u0027%3E%3Cpath fill=\u0027%23FFFFFF\u0027 d=\u0027M6,33.6692502 L7.9357003,26.7942754 C6.69093133,24.6795989 6.03555244,22.2735659 6.03555244,19.8018908 C6.03555244,12.1915008 12.2270533,6 19.8374433,6 C27.4478333,6 33.6392474,12.1915008 33.6392474,19.8018908 C33.6392474,27.4122809 27.4478333,33.6037817 19.8374433,33.6037817 C17.4660955,33.6037817 15.1440876,32.9967888 13.089937,31.844196 L6,33.6692502 Z M13.4523985,29.3332399 L13.8748655,29.5912119 C15.6658414,30.6845795 17.7277095,31.2625234 19.8374433,31.2625234 C26.1568462,31.2625234 31.2979892,26.1212937 31.2979892,19.8018908 C31.2979892,13.482488 26.1568462,8.34125826 19.8374433,8.34125826 C13.5180404,8.34125826 8.3768107,13.482488 8.3768107,19.8018908 C8.3768107,22.0038009 9.00262036,24.1420634 10.1864299,25.9855008 L10.4709361,26.4285188 L9.35623707,30.3876733 L13.4523985,29.3332399 Z\u0027/%3E%3Cpath fill=\u0027%23FFFFFF\u0027 d=\u0027M16.0558808,13.4906124 L15.1603062,13.4417928 C14.8790083,13.4264446 14.6030867,13.5204418 14.3904658,13.705141 C13.9562925,14.0821703 13.262066,14.8110821 13.0488381,15.7609392 C12.7308605,17.177227 13.2222646,18.9114924 14.4940881,20.6457578 C15.7659117,22.3800232 18.1360454,25.1548478 22.3271579,26.339958 C23.677717,26.7218432 24.740128,26.4643915 25.5598285,25.9400364 C26.2090508,25.5247666 26.6565779,24.8582017 26.8178646,24.1046634 L26.9608548,23.4367978 C27.0062926,23.2245237 26.898508,23.0091279 26.701322,22.9182524 L23.6745953,21.5231226 C23.4781031,21.432594 23.2451045,21.4898247 23.1129535,21.6610834 L21.9247216,23.2014579 C21.8349733,23.3178272 21.6813174,23.3639586 21.5425762,23.3152258 C20.7288589,23.0292454 18.003114,21.8876652 16.5074835,19.0067036 C16.442622,18.8817497 16.4587507,18.7300882 16.5507535,18.6235176 L17.6863504,17.3098116 C17.8023728,17.1756662 17.8316819,16.9870648 17.7619644,16.8240439 L16.4572766,13.7716501 C16.3878192,13.6091494 16.2321689,13.5002376 16.0558808,13.4906124 Z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-whatsapp{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-whatsapp.svg?v=2)}.ui-icon-service-wechat{--ui-icon-service-bg-color:#2ec100;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 width=\u002740\u0027 height=\u002740\u0027 viewBox=\u00270 0 40 40\u0027%3E%3Cpath fill=\u0027%23FFFFFF\u0027 fill-rule=\u0027evenodd\u0027 d=\u0027M31.0962509,28.3065859 C32.8041239,27.0682659 33.8956386,25.2382418 33.8956386,23.2031385 C33.8956386,19.4758512 30.2680893,16.4534538 25.7944481,16.4534538 C21.3208069,16.4534538 17.6932576,19.4758512 17.6932576,23.2031385 C17.6932576,26.9315464 21.3208069,29.9539438 25.7944481,29.9539438 C26.7189857,29.9539438 27.6110244,29.8228275 28.4391859,29.5841287 L28.6767641,29.5482679 C28.8325346,29.5482679 28.9737367,29.5964559 29.1070943,29.6726602 L30.8810858,30.6969358 L31.0368563,30.7473651 C31.185903,30.7473651 31.3069334,30.6263347 31.3069334,30.4772881 L31.263228,30.2800534 L30.8978955,28.9184617 L30.8698793,28.7458813 C30.8698793,28.5643358 30.9595314,28.4040826 31.0962509,28.3065859 L31.0962509,28.3065859 Z M16.7216527,9 C11.3526108,9 7,12.6264286 7,17.1011905 C7,19.5419697 8.30892108,21.7395675 10.3585929,23.2244309 C10.5233287,23.3409786 10.6309112,23.5337307 10.6309112,23.7522578 L10.5972917,23.9584577 L10.1591169,25.5923677 L10.1064463,25.8288252 C10.1064463,26.0081295 10.252131,26.1538142 10.4303146,26.1538142 L10.618584,26.093299 L12.7467014,24.8639442 C12.905834,24.7720507 13.0750524,24.7148975 13.2622012,24.7148975 L13.5479673,24.7574823 C14.5408647,25.0432484 15.6122076,25.202381 16.7216527,25.202381 L17.2550829,25.1889331 C17.0444004,24.5568856 16.9289732,23.8912186 16.9289732,23.2042591 C16.9289732,19.1239666 20.8983212,15.8158031 25.7944481,15.8158031 L26.322275,15.8292509 C25.5904895,11.9596409 21.5707122,9 16.7216527,9 L16.7216527,9 Z M23.0936777,22.123951 C22.4974911,22.123951 22.0144902,21.6398295 22.0144902,21.0436428 C22.0144902,20.4463355 22.4974911,19.9633347 23.0936777,19.9633347 C23.6909851,19.9633347 24.1739859,20.4463355 24.1739859,21.0436428 C24.1739859,21.6398295 23.6909851,22.123951 23.0936777,22.123951 Z M28.4952185,22.123951 C27.8979112,22.123951 27.4149103,21.6398295 27.4149103,21.0436428 C27.4149103,20.4463355 27.8979112,19.9633347 28.4952185,19.9633347 C29.0914052,19.9633347 29.574406,20.4463355 29.574406,21.0436428 C29.574406,21.6398295 29.0914052,22.123951 28.4952185,22.123951 Z M13.4807283,15.8045966 C12.7646319,15.8045966 12.185255,15.224099 12.185255,14.5091233 C12.185255,13.7930269 12.7646319,13.2125294 13.4807283,13.2125294 C14.1968246,13.2125294 14.7773222,13.7930269 14.7773222,14.5091233 C14.7773222,15.224099 14.1968246,15.8045966 13.4807283,15.8045966 Z M19.9614565,15.8045966 C19.2453601,15.8045966 18.6659832,15.224099 18.6659832,14.5091233 C18.6659832,13.7930269 19.2453601,13.2125294 19.9614565,13.2125294 C20.6775529,13.2125294 21.2580504,13.7930269 21.2580504,14.5091233 C21.2580504,15.224099 20.6775529,15.8045966 19.9614565,15.8045966 Z\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-bitrix24-virtual-wa{--ui-icon-service-bg-color:#6cc5f0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-bitrix24-virtual-wa.svg?v=2)}.ui-icon-service-light-bitrix24-virtual-wa{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-bitrix24-virtual-wa.svg?v=2)}.ui-icon-service-light-wechat{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-wechat.svg)}.ui-icon-service-avito{--ui-icon-service-bg-color:#0af;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 width=\u002742\u0027 height=\u002742\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cg fill=\u0027%23FFF\u0027 transform=\u0027translate(9 10)\u0027%3E%3Ccircle cx=\u002717.361\u0027 cy=\u002716.953\u0027 r=\u00276.273\u0027/%3E%3Ccircle cx=\u00275.57\u0027 cy=\u002716.953\u0027 r=\u00272.92\u0027/%3E%3Ccircle cx=\u002717.361\u0027 cy=\u00275.162\u0027 r=\u00274.038\u0027/%3E%3Ccircle cx=\u00275.57\u0027 cy=\u00275.162\u0027 r=\u00275.155\u0027/%3E%3C/g%3E%3C/svg%3E\u0022)}.ui-icon-service-light-avito{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-avito.svg)}.ui-icon-service-mailru,.ui-icon-service-mailru2{--ui-icon-service-bg-color:#005ff9;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-mailru.svg)}.ui-icon-service-light-mailru,.ui-icon-service-light-mailru2{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-mailru.svg)}.ui-icon.ui-icon-service-sbbol,.ui-icon.ui-icon-service-sberbank{--ui-icon-service-bg-color:#289d37;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-sberbank.svg)}.ui-icon.ui-icon-service-green-sberbank{--ui-icon-service-bg-color:#ebeff2;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-green-sberbank.svg)}.ui-icon.ui-icon-service-light-sbbol,.ui-icon.ui-icon-service-light-sberbank{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-sberbank.svg)}.ui-icon-service-olx{--ui-icon-service-bg-color:#5b2b82;--ui-icon-service-bg-image:url(\u0022data:image/svg+xml,%3Csvg xmlns=\u0027http://www.w3.org/2000/svg\u0027 width=\u002742\u0027 height=\u002742\u0027 viewBox=\u00270 0 42 42\u0027%3E%3Cpath fill=\u0027%23FFF\u0027 d=\u0027M29.9255904,2.7601004 C30.3972008,2.22953869 31.1046165,1.99373348 31.6351782,2.22953869 C32.1436332,2.45551868 32.3272419,3.0063449 31.9784638,3.57070638 L31.9299347,3.64436992 L28.4518079,8.71418185 L32.9321068,15.4935815 C33.3294823,16.0612607 33.1255382,16.6836053 32.5308378,16.8342077 L32.4604964,16.8494615 L30.3382495,17.4389745 C29.6603096,17.6084595 28.9282286,17.2365341 28.608973,16.6345092 L28.5697105,16.5547049 L26.1527071,12.1333573 L23.1461908,16.5547049 C22.8055832,17.1791521 22.1916487,17.1476143 21.778154,16.618014 L21.7313595,16.5547049 L20.84709,15.1398737 C20.5102254,14.5222886 20.5476548,13.6373507 20.9593782,13.0961522 L21.0239439,13.0176269 L24.561022,9.00893836 L22.0850673,3.99807773 C21.7903108,3.34961342 22.1440186,2.6421978 22.792483,2.40639259 C23.4127532,2.18083979 24.2487696,2.49465239 24.6814344,3.03828155 L24.7378759,3.11380821 L26.8601228,6.29717849 L29.9255904,2.7601004 Z M6.75772896,2.5242952 C10.0000505,2.5242952 12.6528591,5.70766548 12.6528591,9.59845137 C12.6528591,13.4892373 10.0000505,16.6726075 6.75772896,16.6726075 C3.51540738,16.6726075 0.862598812,13.4892373 0.862598812,9.59845137 C0.862598812,5.70766548 3.51540738,2.5242952 6.75772896,2.5242952 Z M6.75772896,4.82339595 C5.22499512,4.82339595 3.98701779,6.94564281 3.98701779,9.59845137 C3.98701779,12.2512599 5.22499512,14.4324581 6.75772896,14.4324581 C8.2904628,14.4324581 9.52844013,12.2512599 9.52844013,9.59845137 C9.52844013,6.94564281 8.2904628,4.82339595 6.75772896,4.82339595 Z M15.7183268,0.519950946 C16.5130777,0.519950946 16.7611745,1.06660499 16.7784618,1.79142776 L16.7794502,1.87583088 L16.7794502,8.30152274 C16.8362961,9.09736531 17.0027734,9.23541963 17.7546039,9.24426555 L20.0772617,9.24583029 C20.5219187,9.25379958 21.0899522,9.32021035 21.1385059,9.87363347 L21.1418465,9.95215918 L21.1418465,11.5438443 C21.0853515,12.1652893 20.6498693,12.3536059 19.93917,12.3682201 L19.8449179,12.3691625 L14.8340573,12.3691625 C13.9257705,12.3691625 13.4548071,11.8771739 13.4211668,11.1037597 L13.419226,11.0132826 L13.419226,1.99373348 C13.3624581,1.36928636 13.6336826,0.69017384 14.3908218,0.640725789 L14.4803495,0.637853549 L15.7183268,0.519950946 Z\u0027 transform=\u0027translate(4 12)\u0027/%3E%3C/svg%3E\u0022)}.ui-icon-service-light-olx{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-olx.svg)}.ui-icon.ui-icon-service-kufar{--ui-icon-service-bg-color:#01ad64;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-kufar.svg)}.ui-icon.ui-icon-service-light-kufar{--ui-icon-service-bg-color:#01ad64;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-kufar.svg)}.ui-icon.ui-icon-service-import{--ui-icon-service-bg-color:#6a89b0;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-import.svg)}.ui-icon.ui-icon-service-light-import{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-import.svg)}.ui-icon-service-calendar{--ui-icon-service-bg-color:#8ebb00;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-calendar.svg)}.ui-icon-service-light-calendar{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-calendar.svg)}.ui-icon-service-epics{--ui-icon-service-bg-color:#207ede;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-epics.svg)}.ui-icon-service-light-epics{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-epics.svg)}.ui-icon-service-dod{--ui-icon-service-bg-color:#207ede;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-dod.svg)}.ui-icon-service-light-dod{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-dod.svg)}.ui-icon-service-tutorial{--ui-icon-service-bg-color:#207ede;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-tutorial.svg)}.ui-icon-service-light-tutorial{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-tutorial.svg)}.ui-icon-service-roles-rights{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-roles-rights.svg)}.ui-icon-service-light-roles-rights{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-roles-rights.svg)}.ui-icon-service-openid{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-openid.svg)}.ui-icon-service-livejournal{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-livejournal.svg)}.ui-icon-service-blogger{--ui-icon-service-bg-color:#f06a35;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-blogger.svg)}.ui-icon-service-saml-azure{--ui-icon-service-bg-color:#f6f7fa;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-saml-azure-2.svg)}.ui-icon-service-light-blogger{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-blogger.svg)}.ui-icon-service-liveinternet{--ui-icon-service-bg-color:#fff;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-liveinternet.svg)}.ui-icon-service-light-liveinternet{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-liveinternet.svg)}.ui-icon-service-dropbox{--ui-icon-service-bg-color:#007ee5;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-dropbox.svg)}.ui-icon-service-light-dropbox{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-dropbox.svg)}.ui-icon-service-box{--ui-icon-service-bg-color:#0071f7;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-box.svg)}.ui-icon-service-light-box{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-box.svg)}.ui-icon-service-message-widget{--ui-icon-service-bg-color:#3fe5aa;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-message-widget.svg)}.ui-icon-service-light-message-widget{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-message-widget.svg)}.ui-icon-service-code{--ui-icon-service-bg-color:#3fe5aa;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-code.svg)}.ui-icon-service-light-code{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-code.svg)}.ui-icon-service-click{--ui-icon-service-bg-color:#3fe5aa;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-click.svg)}.ui-icon-service-light-click{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-click.svg)}.ui-icon-service-clock{--ui-icon-service-bg-color:#28d1a9;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-clock.svg)}.ui-icon-service-light-clock{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-clock.svg)}.ui-icon-service-linked-link{--ui-icon-service-bg-color:#28d1a9;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-linked-link.svg)}.ui-icon-service-light-linked-link{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-linked-link.svg)}.ui-icon.ui-icon-service-zoom{--ui-icon-service-bg-color:#4690fb;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-zoom.svg)}.ui-icon.ui-icon-service-blue-zoom{--ui-icon-service-bg-color:transparent;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-blue-zoom.svg)}.ui-icon.ui-icon-service-light-zoom{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-zoom.svg)}.ui-icon.ui-icon-service-widget{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-widget.svg)}.ui-icon.ui-icon-service-light-widget{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-widget.svg)}.ui-icon.ui-icon-service-wheel{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-wheel.svg)}.ui-icon.ui-icon-service-light-wheel{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-wheel.svg)}.ui-icon.ui-icon-service-play{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-play.svg)}.ui-icon.ui-icon-service-light-play{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-play.svg)}.ui-icon.ui-icon-service-other{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-other.svg)}.ui-icon.ui-icon-service-light-other{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-other.svg)}.ui-icon.ui-icon-service-cart{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-cart.svg)}.ui-icon.ui-icon-service-light-cart{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-cart.svg)}.ui-icon.ui-icon-service-add{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-add.svg)}.ui-icon.ui-icon-service-light-add{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-add.svg)}.ui-icon.ui-icon-service-arrows{--ui-icon-service-bg-color:#333;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-arrows.svg)}.ui-icon.ui-icon-service-light-arrows{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-arrows.svg)}.ui-icon.ui-icon-service-call-in{--ui-icon-service-bg-color:#00ace3;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-call-in.svg)}.ui-icon.ui-icon-service-light-call-in{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-call-in.svg)}.ui-icon.ui-icon-service-call-out{--ui-icon-service-bg-color:#9dcf00;--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-call-out.svg)}.ui-icon.ui-icon-service-light-call-out{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-call-out.svg)}.ui-icon.ui-icon-service-settings{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-settings.svg)}.ui-icon.ui-icon-service-light-settings{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-light-settings.svg)}.ui-icon.ui-icon-service-yandex{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-yandex.svg)}.ui-icon.ui-icon-service-yahoo{--ui-icon-service-bg-image:url(https://studio.bitrix24.ru/bitrix/js/ui/icons/service/images/ui-service-yahoo.svg)}",
        cache: true,
      },
      {
        type: "css",
        path: "https://studio.bitrix24.ru/bitrix/js/ui/icons/b24/ui.icons.b24.css?1635345539.2337",
        content:
          ".ui-icon-common-user{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-user.svg?v2)}.ui-icon-common-phone{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-call.svg)}.ui-icon-common-notification{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-notification.svg)}.ui-icon-common-user-group{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-user-group.svg?v2)}.ui-icon-common-user-mail{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-user-mail.svg?v2)}.ui-icon-common-company{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-user-company.svg?v2)}.ui-icon-common-light-company{--ui-icon-service-bg-color:#ebeff2;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-user-light-company.svg?v2)}.ui-icon-common-bitrix24{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/service/images/ui-service-bitrix24.svg)}.ui-icon-common-cloud{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-cloud.svg)}.ui-icon-common-folder{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-folder.svg)}.ui-icon-common-info{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-info.svg)}.ui-icon-common-question{--ui-icon-service-bg-color:#7b8691;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-question.svg)}.ui-icon-package-numbers-five{--ui-icon-service-bg-color:#9dcf00;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-package-numbers-five.svg?v2)}.ui-icon-package-numbers-five\u003Ei{background-size:20px 20px}.ui-icon-package-numbers-ten{--ui-icon-service-bg-color:#55d0e0;--ui-icon-service-bg-image:url(/bitrix/js/ui/icons/b24/images/ui-package-numbers-ten.svg?v2)}.ui-icon-package-numbers-ten\u003Ei{background-size:28px 20px}",
        cache: true,
      },
      {
        type: "css",
        path: "https://studio.bitrix24.ru/bitrix/js/ui/icons/disk/ui.icons.disk.css?1669212942.1886",
        content:
          "/*region File icons*/\n.ui-icon[class*=ui-icon-file-] \u003E i {\n\tbackground: url(/bitrix/js/ui/icons/disk/images/sprite-files.min.svg?v1.3) no-repeat 0 0; background-size:100% auto;--icon-file-col:14}.ui-icon.ui-icon-file-empty\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 0)}.ui-icon.ui-icon-file-txt\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 1)}.ui-icon.ui-icon-file-doc\u003Ei,.ui-icon.ui-icon-file-docx\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 2)}.ui-icon.ui-icon-file-xls\u003Ei,.ui-icon.ui-icon-file-xlsx\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 3)}.ui-icon.ui-icon-file-php\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 4)}.ui-icon.ui-icon-file-pdf\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 5)}.ui-icon.ui-icon-file-pptx\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 6)}.ui-icon.ui-icon-file-ppt\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 6)}.ui-icon.ui-icon-file-rar\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 7)}.ui-icon.ui-icon-file-zip\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 8)}.ui-icon.ui-icon-file-set\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 9)}.ui-icon.ui-icon-file-mov\u003Ei,.ui-icon.ui-icon-file-mp4\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 10)}.ui-icon.ui-icon-file-img\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 11)}.ui-icon.ui-icon-file-folder\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 12)}.ui-icon.ui-icon-file-folder-shared\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 13)}.ui-icon.ui-icon-file-folder-shared-2\u003Ei{background-position:0 calc(100% / var(--icon-file-col) * 14)}",
        cache: true,
      },
    ]);

    module.language = "ru";
    module.languages = ["ru"];
    module.messages = {
      location: "bottom-right",
      colorBackground: "#99ff00",
      colorIcon: "#FFFFFF",
    };

    module.loadResources([
      {
        type: "layout",
        path: "https://studio.bitrix24.ru/bitrix/components/bitrix/crm.button.button/templates/.default/layout.html?1620813732.7851",
        content:
          "\u003Cdiv\u003E\n\t\u003Cdiv data-b24-crm-button-shadow=\u0022\u0022 class=\u0022b24-widget-button-shadow\u0022\u003E\u003C/div\u003E\n\t\u003Cdiv style=\u0022display: none;\u0022\u003E\n\t\t\u003Ca data-b24-crm-button-widget-blank=\u0022\u0022 data-b24-crm-button-widget=\u0022\u0022 class=\u0022b24-widget-button-social-item\u0022 title=\u0022\u0022\u003E\n\t\t\t\u003Ci\u003E\u003C/i\u003E\n\t\t\t\u003Cspan data-b24-crm-button-tooltip=\u0022\u0022 class=\u0022b24-widget-button-social-tooltip\u0022\u003E\u003C/span\u003E\n\t\t\u003C/a\u003E\n\t\u003C/div\u003E\n\n\t\u003Cdiv dir=\u0022ltr\u0022 data-b24-crm-button-cont=\u0022\u0022 class=\u0022b24-widget-button-wrapper b24-widget-button-position-%location%\u0022\u003E\n\t\t\u003Cdiv data-b24-crm-hello-cont=\u0022\u0022 class=\u0022b24-widget-button-popup\u0022 style=\u0022border-color: %colorBackground%;\u0022\u003E\n\t\t\t\u003Cspan data-b24-hello-btn-hide=\u0022\u0022 class=\u0022b24-widget-button-popup-btn-hide\u0022\u003E\u003C/span\u003E\n\t\t\t\u003Cdiv class=\u0022b24-widget-button-popup-inner\u0022\u003E\n\t\t\t\t\u003Cdiv class=\u0022b24-widget-button-popup-image\u0022\u003E\n\t\t\t\t\t\u003Cspan data-b24-hello-icon=\u0022\u0022 class=\u0022b24-widget-button-popup-image-item\u0022\u003E\u003C/span\u003E\n\t\t\t\t\u003C/div\u003E\n\t\t\t\t\u003Cdiv class=\u0022b24-widget-button-popup-content\u0022\u003E\n\t\t\t\t\t\u003Cdiv data-b24-hello-name=\u0022\u0022 class=\u0022b24-widget-button-popup-name\u0022\u003E\u003C/div\u003E\n\t\t\t\t\t\u003Cdiv data-b24-hello-text=\u0022\u0022 class=\u0022b24-widget-button-popup-description\u0022\u003E\u003C/div\u003E\n\t\t\t\t\u003C/div\u003E\n\t\t\t\u003C/div\u003E\n\t\t\t\u003Cdiv class=\u0022b24-widget-button-popup-triangle\u0022 style=\u0022border-color: %colorBackground%;\u0022\u003E\u003C/div\u003E\n\t\t\u003C/div\u003E\n\n\t\t\u003Cdiv data-b24-crm-button-block=\u0022\u0022 class=\u0022b24-widget-button-social\u0022\u003E\n\n\t\t\u003C/div\u003E\n\t\t\u003Cdiv data-b24-crm-button-block-button=\u0022\u0022 class=\u0022b24-widget-button-inner-container\u0022\u003E\n\t\t\t\u003Cdiv data-b24-crm-button-block-border=\u0022\u0022 class=\u0022b24-widget-button-inner-mask\u0022 style=\u0022background: %colorBackground%;\u0022\u003E\u003C/div\u003E\n\t\t\t\u003Cdiv class=\u0022b24-widget-button-block\u0022\u003E\n\t\t\t\t\u003Cdiv data-b24-crm-button-pulse=\u0022\u0022 class=\u0022b24-widget-button-pulse\u0022 style=\u0022border-color: %colorBackground%;\u0022\u003E\u003C/div\u003E\n\t\t\t\t\u003Cdiv data-b24-crm-button-block-inner=\u0022\u0022 class=\u0022b24-widget-button-inner-block\u0022 style=\u0022background: %colorBackground%;\u0022\u003E\n\t\t\t\t\t\u003Cdiv class=\u0022b24-widget-button-icon-container\u0022\u003E\n\n\t\t\t\t\t\t\u003Cdiv data-b24-crm-button-icon=\u0022crmform\u0022 class=\u0022b24-widget-button-inner-item\u0022\u003E\n\t\t\t\t\t\t\t\u003Csvg class=\u0022b24-crm-button-icon\u0022 xmlns=\u0022http://www.w3.org/2000/svg\u0022 width=\u002228\u0022 height=\u002228\u0022\n\t\t\t\t\t\t\t\t viewBox=\u00220 0 24 28\u0022\u003E\n\t\t\t\t\t\t\t\t\u003Cpath class=\u0022b24-crm-button-webform-icon\u0022 fill=\u0022 %colorIcon%\u0022 fill-rule=\u0022evenodd\u0022\n\t\t\t\t\t\t\t\t\t  d=\u0022M815.406703,961 L794.305503,961 C793.586144,961 793,961.586144 793,962.305503 L793,983.406703 C793,984.126062 793.586144,984.712206 794.305503,984.712206 L815.406703,984.712206 C816.126062,984.712206 816.712206,984.126062 816.712206,983.406703 L816.712206,962.296623 C816.703325,961.586144 816.117181,961 815.406703,961 L815.406703,961 Z M806.312583,979.046143 C806.312583,979.454668 805.975106,979.783264 805.575462,979.783264 L796.898748,979.783264 C796.490224,979.783264 796.161627,979.445787 796.161627,979.046143 L796.161627,977.412044 C796.161627,977.003519 796.499105,976.674923 796.898748,976.674923 L805.575462,976.674923 C805.983987,976.674923 806.312583,977.0124 806.312583,977.412044 L806.312583,979.046143 L806.312583,979.046143 Z M813.55946,973.255747 C813.55946,973.664272 813.221982,973.992868 812.822339,973.992868 L796.889868,973.992868 C796.481343,973.992868 796.152746,973.655391 796.152746,973.255747 L796.152746,971.621647 C796.152746,971.213122 796.490224,970.884526 796.889868,970.884526 L812.813458,970.884526 C813.221982,970.884526 813.550579,971.222003 813.550579,971.621647 L813.550579,973.255747 L813.55946,973.255747 Z M813.55946,967.45647 C813.55946,967.864994 813.221982,968.193591 812.822339,968.193591 L796.889868,968.193591 C796.481343,968.193591 796.152746,967.856114 796.152746,967.45647 L796.152746,965.82237 C796.152746,965.413845 796.490224,965.085249 796.889868,965.085249 L812.813458,965.085249 C813.221982,965.085249 813.550579,965.422726 813.550579,965.82237 L813.550579,967.45647 L813.55946,967.45647 Z\u0022\n\t\t\t\t\t\t\t\t\t  transform=\u0022translate(-793 -961)\u0022/\u003E\n\t\t\t\t\t\t\t\u003C/svg\u003E\n\t\t\t\t\t\t\u003C/div\u003E\n\n\t\t\t\t\t\t\u003Cdiv data-b24-crm-button-icon=\u0022callback\u0022 class=\u0022b24-widget-button-inner-item\u0022\u003E\n\t\t\t\t\t\t\t\u003Csvg class=\u0022b24-crm-button-icon\u0022 xmlns=\u0022http://www.w3.org/2000/svg\u0022 width=\u002228\u0022 height=\u002228\u0022\n\t\t\t\t\t\t\t\tviewBox=\u00220 0 28 30\u0022\u003E\n\t\t\t\t\t\t\t\t\u003Cpath class=\u0022b24-crm-button-call-icon\u0022 fill=\u0022%colorIcon%\u0022 fill-rule=\u0022evenodd\u0022\n\t\t\t\t\t\t\t\t\td=\u0022M940.872414,978.904882 C939.924716,977.937215 938.741602,977.937215 937.79994,978.904882 C937.08162,979.641558 936.54439,979.878792 935.838143,980.627954 C935.644982,980.833973 935.482002,980.877674 935.246586,980.740328 C934.781791,980.478121 934.286815,980.265859 933.840129,979.97868 C931.757607,978.623946 930.013117,976.882145 928.467826,974.921839 C927.701216,973.947929 927.019115,972.905345 926.542247,971.731659 C926.445666,971.494424 926.463775,971.338349 926.6509,971.144815 C927.36922,970.426869 927.610672,970.164662 928.316918,969.427987 C929.300835,968.404132 929.300835,967.205474 928.310882,966.175376 C927.749506,965.588533 927.206723,964.77769 926.749111,964.14109 C926.29156,963.50449 925.932581,962.747962 925.347061,962.154875 C924.399362,961.199694 923.216248,961.199694 922.274586,962.161118 C921.55023,962.897794 920.856056,963.653199 920.119628,964.377388 C919.437527,965.045391 919.093458,965.863226 919.021022,966.818407 C918.906333,968.372917 919.274547,969.840026 919.793668,971.269676 C920.856056,974.228864 922.473784,976.857173 924.43558,979.266977 C927.085514,982.52583 930.248533,985.104195 933.948783,986.964613 C935.6148,987.801177 937.341181,988.444207 939.218469,988.550339 C940.510236,988.625255 941.632988,988.288132 942.532396,987.245549 C943.148098,986.533845 943.842272,985.884572 944.494192,985.204083 C945.459999,984.192715 945.466036,982.969084 944.506265,981.970202 C943.359368,980.777786 942.025347,980.091055 940.872414,978.904882 Z M940.382358,973.54478 L940.649524,973.497583 C941.23257,973.394635 941.603198,972.790811 941.439977,972.202844 C940.97488,970.527406 940.107887,969.010104 938.90256,967.758442 C937.61538,966.427182 936.045641,965.504215 934.314009,965.050223 C933.739293,964.899516 933.16512,965.298008 933.082785,965.905204 L933.044877,966.18514 C932.974072,966.707431 933.297859,967.194823 933.791507,967.32705 C935.117621,967.682278 936.321439,968.391422 937.308977,969.412841 C938.23579,970.371393 938.90093,971.53815 939.261598,972.824711 C939.401641,973.324464 939.886476,973.632369 940.382358,973.54478 Z M942.940854,963.694228 C940.618932,961.29279 937.740886,959.69052 934.559939,959.020645 C934.000194,958.902777 933.461152,959.302642 933.381836,959.8878 L933.343988,960.167112 C933.271069,960.705385 933.615682,961.208072 934.130397,961.317762 C936.868581,961.901546 939.347628,963.286122 941.347272,965.348626 C943.231864,967.297758 944.53673,969.7065 945.149595,972.360343 C945.27189,972.889813 945.766987,973.232554 946.285807,973.140969 L946.55074,973.094209 C947.119782,972.993697 947.484193,972.415781 947.350127,971.835056 C946.638568,968.753629 945.126778,965.960567 942.940854,963.694228 Z\u0022\n\t\t\t\t\t\t\t\t\ttransform=\u0022translate(-919 -959)\u0022/\u003E\n\t\t\t\t\t\t\t\u003C/svg\u003E\n\t\t\t\t\t\t\u003C/div\u003E\n\n\t\t\t\t\t\t\u003Cdiv data-b24-crm-button-icon=\u0022openline\u0022 class=\u0022b24-widget-button-inner-item\u0022\u003E\n\t\t\t\t\t\t\t\u003Csvg class=\u0022b24-crm-button-icon b24-crm-button-icon-active\u0022 width=\u002228\u0022 height=\u002229\u0022 xmlns=\u0022http://www.w3.org/2000/svg\u0022\u003E\n\t\t\t\t\t\t\t\t\u003Cpath class=\u0022b24-crm-button-chat-icon\u0022 d=\u0022M25.99 7.744a2 2 0 012 2v11.49a2 2 0 01-2 2h-1.044v5.162l-4.752-5.163h-7.503a2 2 0 01-2-2v-1.872h10.073a3 3 0 003-3V7.744zM19.381 0a2 2 0 012 2v12.78a2 2 0 01-2 2h-8.69l-5.94 6.453V16.78H2a2 2 0 01-2-2V2a2 2 0 012-2h17.382z\u0022\n\t\t\t\t\t\t\t\t\t  fill=\u0022 %colorIcon%\u0022 fill-rule=\u0022evenodd\u0022/\u003E\n\t\t\t\t\t\t\t\u003C/svg\u003E\n\t\t\t\t\t\t\u003C/div\u003E\n\n\t\t\t\t\t\u003C/div\u003E\n\t\t\t\t\t\u003Cdiv class=\u0022b24-widget-button-inner-item b24-widget-button-close\u0022\u003E\n\t\t\t\t\t\t\u003Csvg class=\u0022b24-widget-button-icon b24-widget-button-close-item\u0022 xmlns=\u0022http://www.w3.org/2000/svg\u0022 width=\u002229\u0022 height=\u002229\u0022 viewBox=\u00220 0 29 29\u0022\u003E\u003Cpath fill=\u0022#FFF\u0022 fill-rule=\u0022evenodd\u0022 d=\u0022M18.866 14.45l9.58-9.582L24.03.448l-9.587 9.58L4.873.447.455 4.866l9.575 9.587-9.583 9.57 4.418 4.42 9.58-9.577 9.58 9.58 4.42-4.42\u0022/\u003E\u003C/svg\u003E\n\t\t\t\t\t\u003C/div\u003E\n\t\t\t\t\u003C/div\u003E\n\t\t\t\u003C/div\u003E\n\t\t\u003C/div\u003E\n\t\u003C/div\u003E\n\u003C/div\u003E\n",
        cache: true,
      },
    ]);

    (function () {
      "use strict";
      if (typeof webPacker === "undefined") {
        return;
      }
      if (!window.BX) {
        window.BX = {};
      } else if (window.BX.SiteButton) {
        return;
      }
      var t = webPacker.classes;
      var e = webPacker.browser;
      var i = webPacker.type;
      var n = {
        clickHandler: null,
        shadowNode: null,
        displayed: false,
        init: function (t) {
          this.shadowNode = t.shadowNode;
          webPacker.addEventListener(
            this.shadowNode,
            "click",
            this.onClick.bind(this)
          );
          webPacker.addEventListener(
            document,
            "keyup",
            function (t) {
              if ((t || window.e).keyCode === 27) this.onClick();
            }.bind(this)
          );
        },
        onClick: function () {
          if (!this.displayed) {
            return;
          }
          r.hide();
          o.hide();
          if (!this.clickHandler) {
            return;
          }
          this.clickHandler.apply(this, []);
          this.clickHandler = null;
        },
        show: function (e) {
          this.clickHandler = e;
          t.add(this.shadowNode, "b24-widget-button-show");
          t.remove(this.shadowNode, "b24-widget-button-hide");
          l.saveScrollPos();
          t.add(document.documentElement, "crm-widget-button-mobile", true);
          this.displayed = true;
        },
        hide: function () {
          if (this.displayed) {
            t.add(this.shadowNode, "b24-widget-button-hide");
          }
          t.remove(this.shadowNode, "b24-widget-button-show");
          t.remove(document.documentElement, "crm-widget-button-mobile");
          l.restoreScrollPos();
          this.displayed = false;
        },
      };
      var o = {
        isShown: false,
        isInit: false,
        wasOnceShown: false,
        wasOnceClick: false,
        blankButtonNode: null,
        list: [],
        frozen: false,
        init: function (t) {
          this.container = t.container;
          this.blankButtonNode = t.blankButtonNode;
          this.openerButtonNode = t.openerButtonNode;
          this.openerClassName =
            h.config.location > 3
              ? "b24-widget-button-bottom"
              : "b24-widget-button-top";
          webPacker.addEventListener(
            this.openerButtonNode,
            "click",
            function () {
              if (this.frozen) {
                this.unfreeze();
              } else {
                if (
                  this.list.length === 1 &&
                  this.list[0].onclick &&
                  !this.list[0].href
                ) {
                  this.list[0].onclick.apply(this, []);
                } else {
                  this.toggle();
                }
              }
            }.bind(this)
          );
          this.isInit = true;
          this.list.forEach(function (t) {
            if (!t.node) this.insert(t);
          }, this);
          s.restart();
        },
        getByType: function (t) {
          var e = this.list.filter(function (e) {
            return t === e.type;
          }, this);
          return e.length > 0 ? e[0] : null;
        },
        toggle: function () {
          this.isShown ? this.hide() : this.show();
        },
        show: function () {
          if (e.isIOS()) {
            t.add(document.documentElement, "bx-ios-fix-frame-focus");
          }
          {
            n.show();
          }
          this.isShown = true;
          this.wasOnceShown = true;
          t.add(h.container, this.openerClassName);
          t.add(this.container, "b24-widget-button-show");
          t.remove(this.container, "b24-widget-button-hide");
          a.hide();
        },
        hide: function () {
          if (e.isIOS()) {
            t.remove(document.documentElement, "bx-ios-fix-frame-focus");
          }
          this.isShown = false;
          t.add(this.container, "b24-widget-button-hide");
          t.remove(this.container, "b24-widget-button-show");
          t.remove(h.container, this.openerClassName);
          a.hide();
          n.hide();
        },
        freeze: function (t) {
          this.hide();
          if (t) {
            s.freeze(t);
          }
          this.frozen = true;
        },
        unfreeze: function () {
          s.start();
          r.hide();
          this.hide();
          this.frozen = false;
        },
        displayButton: function (t, e) {
          this.list.forEach(function (i) {
            if (i.id !== t) return;
            if (!i.node) return;
            i.node.style.display = e ? "" : "none";
          });
        },
        sortOut: function () {
          this.list.sort(function (t, e) {
            return t.sort > e.sort ? 1 : -1;
          });
          this.list.forEach(function (t) {
            if (!t.node) return;
            t.node.parentNode.appendChild(t.node);
          });
        },
        add: function (t) {
          this.list.push(t);
          return this.insert(t);
        },
        insert: function (e) {
          if (!this.isInit) {
            e.node = null;
            return null;
          }
          var i = this.blankButtonNode.cloneNode(true);
          e.node = i;
          e.sort = e.sort || 100;
          i.setAttribute("data-b24-crm-button-widget", e.id);
          i.setAttribute("data-b24-widget-sort", e.sort);
          if (e.classList && e.classList.length > 0) {
            e.classList.forEach(function (e) {
              t.add(i, e);
            }, this);
          }
          if (e.title) {
            var n = i.querySelector("[data-b24-crm-button-tooltip]");
            if (n) {
              n.innerText = e.title;
            } else {
              i.title = e.title;
            }
          }
          if (e.icon) {
            i.style["background-image"] = "url(" + e.icon + ")";
          } else {
            if (e.iconColor) {
              setTimeout(function () {
                var t = "background-image";
                if (!window.getComputedStyle) {
                  return;
                }
                var n = window.getComputedStyle(i, null).getPropertyValue(t);
                i.style[t] = (n || "").replace("FFF", e.iconColor.substring(1));
              }, 1e3);
            }
            if (e.bgColor) {
              i.style["background-color"] = e.bgColor;
            }
          }
          if (e.href) {
            i.href = e.href;
            i.target = e.target ? e.target : "_blank";
          }
          if (e.onclick) {
            webPacker.addEventListener(
              i,
              "click",
              function () {
                this.wasOnceClick = true;
                e.onclick.apply(this, []);
              }.bind(this)
            );
          }
          this.container.appendChild(i);
          this.sortOut();
          s.restart();
          return i;
        },
      };
      var s = {
        isInit: false,
        timer: null,
        timerPeriod: 1500,
        icons: [],
        pulsar: null,
        stop: function () {
          this.rotate(false).pulse(false);
        },
        freeze: function (t) {
          this.rotate(t).pulse(false);
        },
        start: function () {
          this.rotate().pulse(true);
        },
        rotate: function (e) {
          this.init();
          if (this.timer) clearTimeout(this.timer);
          if (e === false) {
            return this;
          }
          var i = "b24-widget-button-icon-animation";
          var n = 0;
          var o = this.icons.filter(function (t) {
            return !t.hidden;
          });
          o.forEach(function (e, o) {
            if (t.has(e.node, i)) n = o;
            t.remove(e.node, i);
          }, this);
          var s;
          if (e === "whatsapp") {
            e = "callback";
          }
          if (
            e &&
            !(s = o.filter(function (t) {
              return t.type === e;
            })[0])
          ) {
            throw new Error("Animation.rotate: Unknown type `" + e + "`");
          }
          if (!s && !(s = o.concat(this.icons).slice(n + 1)[0])) {
            return this;
          }
          t.add(s.node, i);
          if (!e && o.length > 1) {
            this.timer = setTimeout(this.rotate.bind(this), this.timerPeriod);
          }
          return this;
        },
        pulse: function (e) {
          t.change(this.pulsar, "b24-widget-button-pulse-animate", e);
          return this;
        },
        restart: function () {
          this.isInit = false;
          this.start();
        },
        init: function () {
          if (this.isInit) {
            return this;
          }
          var t = "data-b24-crm-button-icon";
          this.icons = i
            .toArray(h.context.querySelectorAll("[" + t + "]"))
            .map(function (e) {
              var i = e.getAttribute(t);
              var n = !o.getByType(i);
              if (n && i === "callback") {
                n = !o.getByType("whatsapp");
              }
              e.style.display = n ? "none" : "";
              return { node: e, type: i, hidden: n };
            }, this)
            .filter(function (t) {
              return !t.hidden;
            }, this);
          this.pulsar = h.context.querySelector("[data-b24-crm-button-pulse]");
          this.isInit = true;
          return this;
        },
      };
      var r = {
        showedWidget: null,
        loadedCount: 0,
        getList: function () {
          return h.config.widgets.filter(function (t) {
            return t.isLoaded;
          }, this);
        },
        getById: function (t) {
          var e = h.config.widgets.filter(function (e) {
            return t === e.id && e.isLoaded;
          }, this);
          return e.length > 0 ? e[0] : null;
        },
        hide: function () {
          if (!this.showedWidget) {
            return;
          }
          var t = this.showedWidget;
          this.showedWidget = null;
          if (t.hide) {
            c.evalGlobal(t.hide);
          }
          h.show();
          n.hide();
        },
        show: function (t) {
          this.storeTrace(t);
          var o = t.show;
          if (o && typeof o === "object" && o.js) {
            if (e.isMobile() && o.js.mobile) {
              o = o.js.mobile;
            } else if (!e.isMobile() && o.js.desktop) {
              o = o.js.desktop;
            } else if (i.isString(o.js)) {
              o = o.js;
            } else {
              o = null;
            }
          } else if (!i.isString(o)) {
            o = null;
          }
          if (!o) {
            return;
          }
          this.showedWidget = t;
          if (!t.freeze) {
            n.show();
          }
          c.evalGlobal(o);
          if (t.freeze) {
            h.freeze(t.type);
          } else {
            h.hide();
          }
        },
        storeTrace: function (t) {
          if (!t || !t.tracking || !t.tracking.detecting) {
            return;
          }
          t.tracking.detecting = false;
          var e = h.getTrace({ channels: [t.tracking.channel] });
          h.b24Tracker.guest.storeTrace(e);
        },
        showById: function (t) {
          var e = this.getById(t);
          if (e) {
            this.show(e);
          }
        },
        checkAll: function () {
          return h.config.widgets.some(this.check, this);
        },
        check: function (t) {
          return this.checkPages(t) && this.checkWorkTime(t);
        },
        checkPagesAll: function () {
          return h.config.widgets.some(this.checkPages, this);
        },
        checkPages: function (t) {
          var e = c.isCurPageInList(t.pages.list);
          if (t.pages.mode === "EXCLUDE") {
            return !e;
          } else {
            return e;
          }
        },
        checkWorkTimeAll: function () {
          return h.config.widgets.some(this.checkWorkTime, this);
        },
        checkWorkTime: function (t) {
          if (!t.workTime) {
            t.isWorkTimeNow = true;
            t.isWorkTimeChecked = true;
          }
          if (t.isWorkTimeChecked) {
            return t.isWorkTimeNow;
          }
          var e = t.workTime;
          var i = new Date();
          if (h.config.serverTimeStamp) {
            i = new Date(h.config.serverTimeStamp);
          }
          var n = e.timeZoneOffset + i.getTimezoneOffset();
          i = new Date(i.valueOf() + n * 6e4);
          var o = i.getMinutes();
          o = o >= 10 ? o : "0" + o;
          var s = parseFloat(i.getHours() + "." + o);
          var r = true;
          if (e.dayOff) {
            var a = i.getDay();
            if (
              e.dayOff.some(function (t) {
                return t === a;
              })
            ) {
              r = false;
            }
          }
          if (r && e.holidays) {
            var c = (i.getMonth() + 1).toString();
            c = (c.length === 1 ? "0" : "") + c;
            c = i.getDate() + "." + c;
            if (
              e.holidays.some(function (t) {
                return t === c;
              })
            ) {
              r = false;
            }
          }
          if (r) {
            var l = e.timeTo < e.timeFrom;
            if (l) {
              if (s > e.timeTo && s < e.timeFrom) {
                r = false;
              }
            } else {
              if (s < e.timeFrom || s > e.timeTo) {
                r = false;
              }
            }
          }
          t.isWorkTimeChecked = true;
          t.isWorkTimeActionRule = false;
          if (!r && !!e.actionRule) {
            r = true;
            t.isWorkTimeActionRule = true;
          }
          t.isWorkTimeNow = r;
          return r;
        },
        loadAll: function () {
          h.config.widgets.forEach(this.load, this);
        },
        load: function (t) {
          t.isLoaded = false;
          h.execEventHandler("load-widget-" + t.id, [t]);
          if (!this.check(t)) {
            return;
          }
          if (t.workTime && t.isWorkTimeActionRule) {
            switch (t.workTime.actionRule) {
              case "text":
                if (t.type === "callback") {
                  h.addEventHandler("form-init", function (e) {
                    if (!e.isCallbackForm) return;
                    window.Bitrix24FormLoader.addEventHandler(
                      e,
                      "init-frame-params",
                      function (e, i) {
                        i.resultSuccessText = t.workTime.actionText;
                        i.stopCallBack = true;
                      }
                    );
                  });
                }
                break;
            }
          }
          t.buttonNode = o.add({
            id: t.id,
            type: t.type,
            href: this.getButtonUrl(t),
            sort: t.sort,
            classList: typeof t.classList !== "undefined" ? t.classList : null,
            title: typeof t.title !== "undefined" ? t.title : null,
            onclick: this.show.bind(this, t),
            bgColor: t.useColors ? h.config.bgColor : null,
            iconColor: t.useColors ? h.config.iconColor : null,
          });
          this.loadScript(t);
          t.isLoaded = true;
          this.loadedCount++;
        },
        getButtonUrl: function (t) {
          if (!t.show || (t.script && !(t.show.url && t.show.url.force))) {
            return null;
          }
          if (i.isString(t.show) || !t.show.url) {
            return null;
          }
          var n = null;
          if (e.isMobile() && t.show.url.mobile) {
            n = t.show.url.mobile;
          } else if (!e.isMobile() && t.show.url.desktop) {
            n = t.show.url.desktop;
          } else if (i.isString(t.show.url)) {
            n = t.show.url;
          }
          return n;
        },
        loadScript: function (t) {
          if (!t.script) {
            return;
          }
          var e = "";
          var i = false;
          var n = t.script.match(/<script\b[^>]*>(.*?)<\/script>/i);
          if (n && n[1]) {
            e = n[1];
            i = true;
          } else if (!t.freeze) {
            t.node = c.getNodeFromText(t.script);
            if (!t.node) {
              return;
            }
            i = false;
            if (typeof t.caption !== "undefined") {
              var o = t.node.querySelector("[data-bx-crm-widget-caption]");
              if (o) {
                o.innerText = t.caption;
              }
            }
          } else {
            e = t.script;
            i = true;
          }
          if (i) {
            t.node = document.createElement("script");
            try {
              t.node.appendChild(document.createTextNode(e));
            } catch (i) {
              t.node.text = e;
            }
            document.head.appendChild(t.node);
          } else {
            document.body.insertBefore(t.node, document.body.firstChild);
          }
        },
      };
      var a = {
        isInit: false,
        wasOnceShown: false,
        condition: null,
        cookieName: "b24_sitebutton_hello",
        init: function (t) {
          if (this.isInit) {
            return;
          }
          this.context = t.context;
          this.showClassName = "b24-widget-button-popup-show";
          this.config = h.config.hello || {};
          this.delay = this.config.delay;
          this.buttonHideNode = this.context.querySelector(
            "[data-b24-hello-btn-hide]"
          );
          this.iconNode = this.context.querySelector("[data-b24-hello-icon]");
          this.nameNode = this.context.querySelector("[data-b24-hello-name]");
          this.textNode = this.context.querySelector("[data-b24-hello-text]");
          this.initHandlers();
          this.isInit = true;
          if (webPacker.cookie.get(this.cookieName) === "y") {
            return;
          }
          if (
            !this.config ||
            !this.config.conditions ||
            this.config.conditions.length === 0
          ) {
            return;
          }
          if (!this.condition) {
            this.setConditions(this.config.conditions, true);
          }
          h.addEventHandler("first-show", this.initCondition.bind(this));
        },
        setConditions: function (t, e) {
          this.condition = this.findCondition(t);
          if (!e) {
            this.initCondition();
          }
        },
        initCondition: function () {
          if (!this.condition) {
            return;
          }
          if (!this.isInit) {
            return;
          }
          if (this.condition.icon) {
            this.iconNode.style["background-image"] =
              "url(" + this.condition.icon + ")";
          }
          if (this.condition.name) {
            this.nameNode.innerText = this.condition.name;
          }
          if (this.condition.text) {
            this.textNode.innerText = this.condition.text;
          }
          if (this.condition.delay) {
            this.delay = this.condition.delay;
          }
          this.planShowing();
        },
        initHandlers: function () {
          webPacker.addEventListener(
            this.buttonHideNode,
            "click",
            function (t) {
              this.hide();
              if (!t) t = window.event;
              if (t.stopPropagation) {
                t.preventDefault();
                t.stopPropagation();
              } else {
                t.cancelBubble = true;
                t.returnValue = false;
              }
            }.bind(this)
          );
          webPacker.addEventListener(
            this.context,
            "click",
            this.showWidget.bind(this)
          );
        },
        planShowing: function () {
          if (this.wasOnceShown || o.wasOnceClick) {
            return;
          }
          setTimeout(this.show.bind(this), (this.delay || 10) * 1e3);
        },
        findCondition: function (t) {
          if (!t) {
            return;
          }
          var e;
          e = t.filter(function (t) {
            if (
              !t.pages ||
              t.pages.MODE === "EXCLUDE" ||
              t.pages.LIST.length === 0
            ) {
              return false;
            }
            return c.isCurPageInList(t.pages.LIST);
          }, this);
          if (e.length > 0) {
            return e[0];
          }
          e = t.filter(function (t) {
            if (!t.pages || t.pages.MODE === "INCLUDE") {
              return false;
            }
            return !c.isCurPageInList(t.pages.LIST);
          }, this);
          if (e.length > 0) {
            return e[0];
          }
          e = t.filter(function (t) {
            return !t.pages;
          }, this);
          if (e.length > 0) {
            return e[0];
          }
          return null;
        },
        showWidget: function () {
          this.hide();
          var t = null;
          if (this.condition && this.condition.showWidgetId) {
            t = r.getById(this.condition.showWidgetId);
          }
          if (!t) {
            t = r.getById(this.config.showWidgetId);
          }
          if (!t) {
            var e = r.getList();
            if (e.length > 0) {
              t = e[0];
            }
          }
          if (t) {
            r.show(t);
          }
        },
        showImmediately: function (t) {
          t = t || null;
          if (t) {
            this.setConditions([
              { icon: t.icon, name: t.name, text: t.text, page: "", delay: 0 },
            ]);
          }
          this.show(true);
        },
        show: function (e) {
          if (!this.condition) {
            return;
          }
          e = e || false;
          if (!e && o.isShown) {
            this.planShowing();
            return;
          }
          this.wasOnceShown = true;
          t.add(this.context, this.showClassName);
        },
        hide: function () {
          t.remove(this.context, this.showClassName);
          webPacker.cookie.set(this.cookieName, "y", 60 * 60 * 6);
        },
      };
      var c = {
        getNodeFromText: function (t) {
          var e = document.createElement("div");
          e.innerHTML = t;
          return e.children[0];
        },
        evalGlobal: function (t) {
          webPacker.resource.loadJs(t, false, true);
        },
        isCurPageInList: function (t) {
          var e = t.filter(function (t) {
            t = encodeURI(t);
            var e = this.prepareUrl(t)
              .split("*")
              .map(function (t) {
                return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
              })
              .join(".*");
            e = "^" + e + "$";
            return new RegExp(e).test(this.prepareUrl(window.location.href));
          }, this);
          return e.length > 0;
        },
        prepareUrl: function (t) {
          var e;
          if (t.substring(0, 5) === "http:") {
            e = t.substring(7);
          } else if (t.substring(0, 6) === "https:") {
            e = t.substring(8);
          } else {
            e = t;
          }
          return e;
        },
      };
      var l = {
        scrollPos: 0,
        saveScrollPos: function () {
          this.scrollPos = window.pageYOffset;
        },
        restoreScrollPos: function () {
          if (!e.isMobile()) {
            return;
          }
          window.scrollTo(0, this.scrollPos);
        },
      };
      var h = (window.BX.SiteButton = {
        buttons: o,
        animation: s,
        shadow: n,
        wm: r,
        hello: a,
        util: c,
        classes: t,
        hacks: l,
        isShown: false,
        init: function (t) {
          this.b24Tracker = window.b24Tracker || {};
          this.userParams = window.Bitrix24WidgetObject || {};
          this.config = t;
          this.handlers = this.userParams.handlers || {};
          this.eventHandlers = [];
          this.execEventHandler("init", [this]);
          if (!this.check()) {
            return;
          }
          this.load();
          if (this.config.delay) {
            window.setTimeout(this.show.bind(this), 1e3 * this.config.delay);
          } else {
            this.show();
          }
        },
        check: function () {
          if (!this.config.isActivated) {
            return false;
          }
          if (this.config.widgets.length === 0) {
            return false;
          }
          if (this.config.disableOnMobile && e.isMobile()) {
            return false;
          }
          return r.checkAll();
        },
        loadResources: function () {},
        load: function () {
          this.execEventHandler("load", [this]);
          e.isIOS() ? t.add(document.documentElement, "bx-ios") : null;
          e.isMobile() ? t.add(document.documentElement, "bx-touch") : null;
          this.loadResources();
          this.container = document.body.querySelector(
            "[data-b24-crm-button-cont]"
          );
          this.context = this.container.parentNode;
          this.shadow.init({
            shadowNode: this.context.querySelector(
              "[data-b24-crm-button-shadow]"
            ),
          });
          this.buttons.init({
            container: this.container.querySelector(
              "[data-b24-crm-button-block]"
            ),
            blankButtonNode: this.context.querySelector(
              "[data-b24-crm-button-widget-blank]"
            ),
            openerButtonNode: this.context.querySelector(
              "[data-b24-crm-button-block-button]"
            ),
          });
          this.hello.init({
            context: this.container.querySelector("[data-b24-crm-hello-cont]"),
          });
          this.wm.loadAll();
          this.execEventHandler("loaded", [this]);
        },
        show: function () {
          t.remove(this.container, "b24-widget-button-disable");
          t.add(this.container, "b24-widget-button-visible");
          this.execEventHandler("show", [this]);
          if (!this.isShown) {
            this.execEventHandler("first-show", [this]);
          }
          this.isShown = true;
        },
        hide: function () {
          t.add(this.container, "b24-widget-button-disable");
          this.execEventHandler("hide", [this]);
        },
        freeze: function (t) {
          setTimeout(
            function () {
              o.freeze(t);
              this.show();
            }.bind(this)
          );
        },
        addEventHandler: function (t, e) {
          if (!t || !e) {
            return;
          }
          this.eventHandlers.push({ eventName: t, handler: e });
        },
        execEventHandler: function (t, e) {
          e = e || [];
          if (!t) {
            return;
          }
          this.eventHandlers.forEach(function (i) {
            if (i.eventName === t) {
              i.handler.apply(this, e);
            }
          }, this);
          if (this.handlers[t]) {
            this.handlers[t].apply(this, e);
          }
          var i = "b24-sitebutton-" + t;
          if (window.BX.onCustomEvent) {
            window.BX.onCustomEvent(document, i, e);
          }
          if (window.jQuery && typeof window.jQuery === "function") {
            var n = window.jQuery(document);
            if (n && n.trigger) n.trigger(i, e);
          }
        },
        onWidgetFormInit: function (t) {
          this.execEventHandler("form-init", [t]);
        },
        onWidgetClose: function () {
          o.unfreeze();
          this.show();
        },
        getTrace: function (t) {
          if (!this.b24Tracker.guest) {
            return null;
          }
          t = t || {};
          t.channels = t.channels || [];
          t.channels = [this.config.tracking.channel].concat(t.channels);
          return this.b24Tracker.guest.getTrace(t);
        },
      });
    })();
    //# sourceMappingURL=https://studio.bitrix24.ru/bitrix/js/crm/site/button/script.map.js

    window.BX.SiteButton.init({
      isActivated: true,
      id: null,
      tracking: { channel: { code: "button", value: 2 } },
      disableOnMobile: false,
      location: 4,
      delay: 0,
      bgColor: "#99ff00",
      iconColor: "#FFFFFF",
      widgets: [
        {
          id: "openline_livechat",
          title: "\u041e\u043d\u043b\u0430\u0439\u043d \u0447\u0430\u0442",
          script:
            "\u003Cscript\u003Ewindow.addEventListener(\u0027onBitrixLiveChatSourceLoaded\u0027,function() { var buttonInstance = BX.SiteButton;  BXLiveChat = new BX.LiveChatWidget({   host: \u0027https://studio.bitrix24.ru\u0027,   code: \u00276FotlGjP\u0027,   language: \u0027ru\u0027,   styles: {    backgroundColor: buttonInstance.config.bgColor || null,    iconColor: buttonInstance.config.iconColor || null   },   location: buttonInstance.config.location || null,   buttonInstance: buttonInstance,   copyrightUrl: \u0027https://www.bitrix24.ru/?p=1550629\u0027,   copyright: true,   localize: {\u0027JS_CORE_LOADING\u0027:\u0027\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...\u0027,\u0027JS_CORE_NO_DATA\u0027:\u0027- \u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445 -\u0027,\u0027JS_CORE_WINDOW_CLOSE\u0027:\u0027\u0417\u0430\u043a\u0440\u044b\u0442\u044c\u0027,\u0027JS_CORE_WINDOW_EXPAND\u0027:\u0027\u0420\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c\u0027,\u0027JS_CORE_WINDOW_NARROW\u0027:\u0027\u0421\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u0432 \u043e\u043a\u043d\u043e\u0027,\u0027JS_CORE_WINDOW_SAVE\u0027:\u0027\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c\u0027,\u0027JS_CORE_WINDOW_CANCEL\u0027:\u0027\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c\u0027,\u0027JS_CORE_WINDOW_CONTINUE\u0027:\u0027\u041f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c\u0027,\u0027JS_CORE_H\u0027:\u0027\u0447\u0027,\u0027JS_CORE_M\u0027:\u0027\u043c\u0027,\u0027JS_CORE_S\u0027:\u0027\u0441\u0027,\u0027JSADM_AI_HIDE_EXTRA\u0027:\u0027\u0421\u043a\u0440\u044b\u0442\u044c \u043b\u0438\u0448\u043d\u0438\u0435\u0027,\u0027JSADM_AI_ALL_NOTIF\u0027:\u0027\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0432\u0441\u0435\u0027,\u0027JSADM_AUTH_REQ\u0027:\u0027\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f!\u0027,\u0027JS_CORE_WINDOW_AUTH\u0027:\u0027\u0412\u043e\u0439\u0442\u0438\u0027,\u0027JS_CORE_IMAGE_FULL\u0027:\u0027\u041f\u043e\u043b\u043d\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440\u0027,\u0027PULL_OLD_REVISION\u0027:\u0027\u0414\u043b\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0435\u043d\u0438\u044f \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0441\u0430\u0439\u0442\u043e\u043c \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443.\u0027,\u0027BX_PULL_STATUS_ONLINE\u0027:\u0027\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u043e\u0027,\u0027BX_PULL_STATUS_OFFLINE\u0027:\u0027\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c\u0027,\u0027BX_PULL_STATUS_CONNECTING\u0027:\u0027\u0423\u0441\u0442\u0430\u043d\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u043c \u0441\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u0438\u0435 \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u043c\u0027,\u0027BX_PULL_STATUS_BUTTON_RELOAD\u0027:\u0027\u041f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c\u0027,\u0027BX_PULL_STATUS_BUTTON_RECONNECT\u0027:\u0027\u041f\u043e\u0434\u043a\u043b\u044e\u0447\u0438\u0442\u044c\u0441\u044f\u0027,\u0027MONTH_1\u0027:\u0027\u042f\u043d\u0432\u0430\u0440\u044c\u0027,\u0027MONTH_2\u0027:\u0027\u0424\u0435\u0432\u0440\u0430\u043b\u044c\u0027,\u0027MONTH_3\u0027:\u0027\u041c\u0430\u0440\u0442\u0027,\u0027MONTH_4\u0027:\u0027\u0410\u043f\u0440\u0435\u043b\u044c\u0027,\u0027MONTH_5\u0027:\u0027\u041c\u0430\u0439\u0027,\u0027MONTH_6\u0027:\u0027\u0418\u044e\u043d\u044c\u0027,\u0027MONTH_7\u0027:\u0027\u0418\u044e\u043b\u044c\u0027,\u0027MONTH_8\u0027:\u0027\u0410\u0432\u0433\u0443\u0441\u0442\u0027,\u0027MONTH_9\u0027:\u0027\u0421\u0435\u043d\u0442\u044f\u0431\u0440\u044c\u0027,\u0027MONTH_10\u0027:\u0027\u041e\u043a\u0442\u044f\u0431\u0440\u044c\u0027,\u0027MONTH_11\u0027:\u0027\u041d\u043e\u044f\u0431\u0440\u044c\u0027,\u0027MONTH_12\u0027:\u0027\u0414\u0435\u043a\u0430\u0431\u0440\u044c\u0027,\u0027MONTH_1_S\u0027:\u0027\u044f\u043d\u0432\u0430\u0440\u044f\u0027,\u0027MONTH_2_S\u0027:\u0027\u0444\u0435\u0432\u0440\u0430\u043b\u044f\u0027,\u0027MONTH_3_S\u0027:\u0027\u043c\u0430\u0440\u0442\u0430\u0027,\u0027MONTH_4_S\u0027:\u0027\u0430\u043f\u0440\u0435\u043b\u044f\u0027,\u0027MONTH_5_S\u0027:\u0027\u043c\u0430\u044f\u0027,\u0027MONTH_6_S\u0027:\u0027\u0438\u044e\u043d\u044f\u0027,\u0027MONTH_7_S\u0027:\u0027\u0438\u044e\u043b\u044f\u0027,\u0027MONTH_8_S\u0027:\u0027\u0430\u0432\u0433\u0443\u0441\u0442\u0430\u0027,\u0027MONTH_9_S\u0027:\u0027\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f\u0027,\u0027MONTH_10_S\u0027:\u0027\u043e\u043a\u0442\u044f\u0431\u0440\u044f\u0027,\u0027MONTH_11_S\u0027:\u0027\u043d\u043e\u044f\u0431\u0440\u044f\u0027,\u0027MONTH_12_S\u0027:\u0027\u0434\u0435\u043a\u0430\u0431\u0440\u044f\u0027,\u0027MON_1\u0027:\u0027\u044f\u043d\u0432\u0027,\u0027MON_2\u0027:\u0027\u0444\u0435\u0432\u0027,\u0027MON_3\u0027:\u0027\u043c\u0430\u0440\u0027,\u0027MON_4\u0027:\u0027\u0430\u043f\u0440\u0027,\u0027MON_5\u0027:\u0027\u043c\u0430\u044f\u0027,\u0027MON_6\u0027:\u0027\u0438\u044e\u043d\u0027,\u0027MON_7\u0027:\u0027\u0438\u044e\u043b\u0027,\u0027MON_8\u0027:\u0027\u0430\u0432\u0433\u0027,\u0027MON_9\u0027:\u0027\u0441\u0435\u043d\u0027,\u0027MON_10\u0027:\u0027\u043e\u043a\u0442\u0027,\u0027MON_11\u0027:\u0027\u043d\u043e\u044f\u0027,\u0027MON_12\u0027:\u0027\u0434\u0435\u043a\u0027,\u0027DAY_OF_WEEK_0\u0027:\u0027\u0412\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435\u0027,\u0027DAY_OF_WEEK_1\u0027:\u0027\u041f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a\u0027,\u0027DAY_OF_WEEK_2\u0027:\u0027\u0412\u0442\u043e\u0440\u043d\u0438\u043a\u0027,\u0027DAY_OF_WEEK_3\u0027:\u0027\u0421\u0440\u0435\u0434\u0430\u0027,\u0027DAY_OF_WEEK_4\u0027:\u0027\u0427\u0435\u0442\u0432\u0435\u0440\u0433\u0027,\u0027DAY_OF_WEEK_5\u0027:\u0027\u041f\u044f\u0442\u043d\u0438\u0446\u0430\u0027,\u0027DAY_OF_WEEK_6\u0027:\u0027\u0421\u0443\u0431\u0431\u043e\u0442\u0430\u0027,\u0027DOW_0\u0027:\u0027\u0412\u0441\u0027,\u0027DOW_1\u0027:\u0027\u041f\u043d\u0027,\u0027DOW_2\u0027:\u0027\u0412\u0442\u0027,\u0027DOW_3\u0027:\u0027\u0421\u0440\u0027,\u0027DOW_4\u0027:\u0027\u0427\u0442\u0027,\u0027DOW_5\u0027:\u0027\u041f\u0442\u0027,\u0027DOW_6\u0027:\u0027\u0421\u0431\u0027,\u0027FD_SECOND_AGO_0\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_SECOND_AGO_1\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0443 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_SECOND_AGO_10_20\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_SECOND_AGO_MOD_1\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0443 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_SECOND_AGO_MOD_2_4\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u044b \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_SECOND_AGO_MOD_OTHER\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_SECOND_DIFF_0\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0027,\u0027FD_SECOND_DIFF_1\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0430\u0027,\u0027FD_SECOND_DIFF_10_20\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0027,\u0027FD_SECOND_DIFF_MOD_1\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0430\u0027,\u0027FD_SECOND_DIFF_MOD_2_4\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u044b\u0027,\u0027FD_SECOND_DIFF_MOD_OTHER\u0027:\u0027#VALUE# \u0441\u0435\u043a\u0443\u043d\u0434\u0027,\u0027FD_SECOND_SHORT\u0027:\u0027#VALUE#\u0441\u0027,\u0027FD_MINUTE_AGO_0\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MINUTE_AGO_1\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0443 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MINUTE_AGO_10_20\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MINUTE_AGO_MOD_1\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0443 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MINUTE_AGO_MOD_2_4\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u044b \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MINUTE_AGO_MOD_OTHER\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MINUTE_DIFF_0\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0027,\u0027FD_MINUTE_DIFF_1\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0430\u0027,\u0027FD_MINUTE_DIFF_10_20\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0027,\u0027FD_MINUTE_DIFF_MOD_1\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0430\u0027,\u0027FD_MINUTE_DIFF_MOD_2_4\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u044b\u0027,\u0027FD_MINUTE_DIFF_MOD_OTHER\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0027,\u0027FD_MINUTE_0\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0027,\u0027FD_MINUTE_1\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0443\u0027,\u0027FD_MINUTE_10_20\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0027,\u0027FD_MINUTE_MOD_1\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0443\u0027,\u0027FD_MINUTE_MOD_2_4\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u044b\u0027,\u0027FD_MINUTE_MOD_OTHER\u0027:\u0027#VALUE# \u043c\u0438\u043d\u0443\u0442\u0027,\u0027FD_MINUTE_SHORT\u0027:\u0027#VALUE#\u043c\u0438\u043d\u0027,\u0027FD_HOUR_AGO_0\u0027:\u0027#VALUE# \u0447\u0430\u0441\u043e\u0432 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_HOUR_AGO_1\u0027:\u0027#VALUE# \u0447\u0430\u0441 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_HOUR_AGO_10_20\u0027:\u0027#VALUE# \u0447\u0430\u0441\u043e\u0432 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_HOUR_AGO_MOD_1\u0027:\u0027#VALUE# \u0447\u0430\u0441 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_HOUR_AGO_MOD_2_4\u0027:\u0027#VALUE# \u0447\u0430\u0441\u0430 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_HOUR_AGO_MOD_OTHER\u0027:\u0027#VALUE# \u0447\u0430\u0441\u043e\u0432 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_HOUR_DIFF_0\u0027:\u0027#VALUE# \u0447\u0430\u0441\u043e\u0432\u0027,\u0027FD_HOUR_DIFF_1\u0027:\u0027#VALUE# \u0447\u0430\u0441\u0027,\u0027FD_HOUR_DIFF_10_20\u0027:\u0027#VALUE# \u0447\u0430\u0441\u043e\u0432\u0027,\u0027FD_HOUR_DIFF_MOD_1\u0027:\u0027#VALUE# \u0447\u0430\u0441\u0027,\u0027FD_HOUR_DIFF_MOD_2_4\u0027:\u0027#VALUE# \u0447\u0430\u0441\u0430\u0027,\u0027FD_HOUR_DIFF_MOD_OTHER\u0027:\u0027#VALUE# \u0447\u0430\u0441\u043e\u0432\u0027,\u0027FD_HOUR_SHORT\u0027:\u0027#VALUE#\u0447\u0027,\u0027FD_YESTERDAY\u0027:\u0027\u0432\u0447\u0435\u0440\u0430\u0027,\u0027FD_TODAY\u0027:\u0027\u0441\u0435\u0433\u043e\u0434\u043d\u044f\u0027,\u0027FD_TOMORROW\u0027:\u0027\u0437\u0430\u0432\u0442\u0440\u0430\u0027,\u0027FD_DAY_AGO_0\u0027:\u0027#VALUE# \u0434\u043d\u0435\u0439 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_DAY_AGO_1\u0027:\u0027#VALUE# \u0434\u0435\u043d\u044c \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_DAY_AGO_10_20\u0027:\u0027#VALUE# \u0434\u043d\u0435\u0439 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_DAY_AGO_MOD_1\u0027:\u0027#VALUE# \u0434\u0435\u043d\u044c \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_DAY_AGO_MOD_2_4\u0027:\u0027#VALUE# \u0434\u043d\u044f \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_DAY_AGO_MOD_OTHER\u0027:\u0027#VALUE# \u0434\u043d\u0435\u0439 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_DAY_DIFF_0\u0027:\u0027#VALUE# \u0434\u043d\u0435\u0439\u0027,\u0027FD_DAY_DIFF_1\u0027:\u0027#VALUE# \u0434\u0435\u043d\u044c\u0027,\u0027FD_DAY_DIFF_10_20\u0027:\u0027#VALUE# \u0434\u043d\u0435\u0439\u0027,\u0027FD_DAY_DIFF_MOD_1\u0027:\u0027#VALUE# \u0434\u0435\u043d\u044c\u0027,\u0027FD_DAY_DIFF_MOD_2_4\u0027:\u0027#VALUE# \u0434\u043d\u044f\u0027,\u0027FD_DAY_DIFF_MOD_OTHER\u0027:\u0027#VALUE# \u0434\u043d\u0435\u0439\u0027,\u0027FD_DAY_AT_TIME\u0027:\u0027#DAY# \u0432 #TIME#\u0027,\u0027FD_DAY_SHORT\u0027:\u0027#VALUE#\u0434\u0027,\u0027FD_MONTH_AGO_0\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0435\u0432 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MONTH_AGO_1\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MONTH_AGO_10_20\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0435\u0432 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MONTH_AGO_MOD_1\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MONTH_AGO_MOD_2_4\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0430 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MONTH_AGO_MOD_OTHER\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0435\u0432 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_MONTH_DIFF_0\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0435\u0432\u0027,\u0027FD_MONTH_DIFF_1\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0027,\u0027FD_MONTH_DIFF_10_20\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0435\u0432\u0027,\u0027FD_MONTH_DIFF_MOD_1\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0027,\u0027FD_MONTH_DIFF_MOD_2_4\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0430\u0027,\u0027FD_MONTH_DIFF_MOD_OTHER\u0027:\u0027#VALUE# \u043c\u0435\u0441\u044f\u0446\u0435\u0432\u0027,\u0027FD_MONTH_SHORT\u0027:\u0027#VALUE#\u043c\u0435\u0441\u0027,\u0027FD_YEARS_AGO_0\u0027:\u0027#VALUE# \u043b\u0435\u0442 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_YEARS_AGO_1\u0027:\u0027#VALUE# \u0433\u043e\u0434 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_YEARS_AGO_10_20\u0027:\u0027#VALUE# \u043b\u0435\u0442 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_YEARS_AGO_MOD_1\u0027:\u0027#VALUE# \u0433\u043e\u0434 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_YEARS_AGO_MOD_2_4\u0027:\u0027#VALUE# \u0433\u043e\u0434\u0430 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_YEARS_AGO_MOD_OTHER\u0027:\u0027#VALUE# \u043b\u0435\u0442 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027FD_YEARS_DIFF_0\u0027:\u0027#VALUE# \u043b\u0435\u0442\u0027,\u0027FD_YEARS_DIFF_1\u0027:\u0027#VALUE# \u0433\u043e\u0434\u0027,\u0027FD_YEARS_DIFF_10_20\u0027:\u0027#VALUE# \u043b\u0435\u0442\u0027,\u0027FD_YEARS_DIFF_MOD_1\u0027:\u0027#VALUE# \u0433\u043e\u0434\u0027,\u0027FD_YEARS_DIFF_MOD_2_4\u0027:\u0027#VALUE# \u0433\u043e\u0434\u0430\u0027,\u0027FD_YEARS_DIFF_MOD_OTHER\u0027:\u0027#VALUE# \u043b\u0435\u0442\u0027,\u0027FD_YEARS_SHORT_0\u0027:\u0027#VALUE#\u043b\u0027,\u0027FD_YEARS_SHORT_1\u0027:\u0027#VALUE#\u0433\u0027,\u0027FD_YEARS_SHORT_10_20\u0027:\u0027#VALUE#\u043b\u0027,\u0027FD_YEARS_SHORT_MOD_1\u0027:\u0027#VALUE#\u0433\u0027,\u0027FD_YEARS_SHORT_MOD_2_4\u0027:\u0027#VALUE#\u0433\u0027,\u0027FD_YEARS_SHORT_MOD_OTHER\u0027:\u0027#VALUE#\u043b\u0027,\u0027CAL_BUTTON\u0027:\u0027\u0412\u044b\u0431\u0440\u0430\u0442\u044c\u0027,\u0027CAL_TIME_SET\u0027:\u0027\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c \u0432\u0440\u0435\u043c\u044f\u0027,\u0027CAL_TIME\u0027:\u0027\u0412\u0440\u0435\u043c\u044f\u0027,\u0027FD_LAST_SEEN_TOMORROW\u0027:\u0027\u0437\u0430\u0432\u0442\u0440\u0430 \u0432 #TIME#\u0027,\u0027FD_LAST_SEEN_NOW\u0027:\u0027\u0442\u043e\u043b\u044c\u043a\u043e \u0447\u0442\u043e\u0027,\u0027FD_LAST_SEEN_TODAY\u0027:\u0027\u0441\u0435\u0433\u043e\u0434\u043d\u044f \u0432 #TIME#\u0027,\u0027FD_LAST_SEEN_YESTERDAY\u0027:\u0027\u0432\u0447\u0435\u0440\u0430 \u0432 #TIME#\u0027,\u0027FD_LAST_SEEN_MORE_YEAR\u0027:\u0027\u0431\u043e\u043b\u0435\u0435 \u0433\u043e\u0434\u0430 \u043d\u0430\u0437\u0430\u0434\u0027,\u0027IM_UTILS_FORMAT_DATE_RECENT\u0027:\u0027D, j F\u0027,\u0027IM_UTILS_FORMAT_DATE\u0027:\u0027l, j F Y\u0027,\u0027IM_UTILS_FORMAT_DATE_SHORT\u0027:\u0027d.m.Y\u0027,\u0027IM_UTILS_FORMAT_TIME\u0027:\u0027H:i\u0027,\u0027IM_UTILS_FORMAT_READED\u0027:\u0027j F Y {{\u0432}} H:i\u0027,\u0027IM_UTILS_FORMAT_DATE_TIME\u0027:\u0027j F Y H:i\u0027,\u0027IM_STATUS_ONLINE\u0027:\u0027\u041e\u043d\u043b\u0430\u0439\u043d\u0027,\u0027IM_STATUS_BOT\u0027:\u0027\u0427\u0430\u0442-\u0431\u043e\u0442\u0027,\u0027IM_STATUS_NETWORK_MSGVER_1\u0027:\u0027\u0411\u0438\u0442\u0440\u0438\u043a\u044124 Network\u0027,\u0027IM_STATUS_OFFLINE\u0027:\u0027\u041d\u0435 \u0432 \u0441\u0435\u0442\u0438\u0027,\u0027IM_STATUS_AWAY\u0027:\u0027\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0027,\u0027IM_STATUS_AWAY_TITLE\u0027:\u0027\u041e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 #TIME#\u0027,\u0027IM_STATUS_DND\u0027:\u0027\u041d\u0435 \u0431\u0435\u0441\u043f\u043e\u043a\u043e\u0438\u0442\u044c\u0027,\u0027IM_STATUS_MOBILE\u0027:\u0027\u041e\u043d\u043b\u0430\u0439\u043d, \u0441 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430\u0027,\u0027IM_STATUS_NA\u0027:\u0027\u041d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d\u0027,\u0027IM_STATUS_GUEST\u0027:\u0027\u041d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d\u0027,\u0027IM_STATUS_LINES-ONLINE\u0027:\u0027\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0445 \u043b\u0438\u043d\u0438\u0439\u0027,\u0027IM_STATUS_VACATION\u0027:\u0027\u0412 \u043e\u0442\u043f\u0443\u0441\u043a\u0435\u0027,\u0027IM_STATUS_VACATION_TITLE\u0027:\u0027\u0412 \u043e\u0442\u043f\u0443\u0441\u043a\u0435 \u0434\u043e #DATE#\u0027,\u0027IM_LAST_SEEN_M\u0027:\u0027#POSITION#. \u0417\u0430\u0445\u043e\u0434\u0438\u043b #LAST_SEEN#\u0027,\u0027IM_LAST_SEEN_F\u0027:\u0027#POSITION#. \u0417\u0430\u0445\u043e\u0434\u0438\u043b\u0430 #LAST_SEEN#\u0027,\u0027IM_LAST_SEEN_SHORT_M\u0027:\u0027\u0417\u0430\u0445\u043e\u0434\u0438\u043b #LAST_SEEN#\u0027,\u0027IM_LAST_SEEN_SHORT_F\u0027:\u0027\u0417\u0430\u0445\u043e\u0434\u0438\u043b\u0430 #LAST_SEEN#\u0027,\u0027IM_UTILS_TEXT_ICON\u0027:\u0027\u0418\u043a\u043e\u043d\u043a\u0430\u0027,\u0027IM_UTILS_TEXT_FILE\u0027:\u0027\u0424\u0430\u0439\u043b\u0027,\u0027IM_UTILS_TEXT_IMAGE\u0027:\u0027\u0424\u043e\u0442\u043e\u0027,\u0027IM_UTILS_TEXT_AUDIO\u0027:\u0027\u0410\u0443\u0434\u0438\u043e\u0027,\u0027IM_UTILS_TEXT_VIDEO\u0027:\u0027\u0412\u0438\u0434\u0435\u043e\u0027,\u0027IM_UTILS_TEXT_ATTACH\u0027:\u0027\u0412\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u0027,\u0027IM_UTILS_TEXT_RATING\u0027:\u0027\u0420\u0435\u0439\u0442\u0438\u043d\u0433\u0027,\u0027IM_UTILS_TEXT_DELETED\u0027:\u0027\u042d\u0442\u043e \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0431\u044b\u043b\u043e \u0443\u0434\u0430\u043b\u0435\u043d\u043e.\u0027,\u0027IM_UTILS_TEXT_CODE\u0027:\u0027\u0424\u0440\u0430\u0433\u043c\u0435\u043d\u0442 \u043a\u043e\u0434\u0430\u0027,\u0027IM_UTILS_TEXT_QUOTE\u0027:\u0027\u0426\u0438\u0442\u0430\u0442\u0430\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_DOWNLOAD_TITLE\u0027:\u0027\u0421\u043a\u0430\u0447\u0430\u0442\u044c: #NAME# (#SIZE#)\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_SHOW_TITLE\u0027:\u0027\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u043b\u043d\u0443\u044e \u0432\u0435\u0440\u0441\u0438\u044e: #NAME# (#SIZE#)\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_SIZE_BYTE\u0027:\u0027\u0431\u0430\u0439\u0442\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_SIZE_KB\u0027:\u0027\u041a\u0431\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_SIZE_MB\u0027:\u0027\u041c\u0431\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_SIZE_GB\u0027:\u0027\u0413\u0431\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_SIZE_TB\u0027:\u0027\u0422\u0431\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_ERROR\u0027:\u0027\u041e\u0448\u0438\u0431\u043a\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0438\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_SAVING\u0027:\u0027\u041e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0430...\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_LOADING\u0027:\u0027\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_WAITING\u0027:\u0027\u0424\u0430\u0439\u043b \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u0442\u0441\u044f...\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_COMPLETED\u0027:\u0027\u0417\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u043e\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_CANCELED\u0027:\u0027\u041e\u0442\u043c\u0435\u043d\u0435\u043d\u043e\u0027,\u0027IM_MESSENGER_ELEMENT_FILE_UPLOAD_CANCEL_TITLE\u0027:\u0027\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0443 \u0444\u0430\u0439\u043b\u0430\u0027,\u0027IM_MESSENGER_ATTACH_FILE_DOWNLOAD_TITLE\u0027:\u0027\u0421\u043a\u0430\u0447\u0430\u0442\u044c: #NAME# (#SIZE#)\u0027,\u0027IM_MESSENGER_ATTACH_FILE_SHOW_TITLE\u0027:\u0027\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u043b\u043d\u0443\u044e \u0432\u0435\u0440\u0441\u0438\u044e: #NAME# (#SIZE#)\u0027,\u0027IM_MESSENGER_ATTACH_FILE_SIZE_BYTE\u0027:\u0027\u0431\u0430\u0439\u0442\u0027,\u0027IM_MESSENGER_ATTACH_FILE_SIZE_KB\u0027:\u0027\u041a\u0431\u0027,\u0027IM_MESSENGER_ATTACH_FILE_SIZE_MB\u0027:\u0027\u041c\u0431\u0027,\u0027IM_MESSENGER_ATTACH_FILE_SIZE_GB\u0027:\u0027\u0413\u0431\u0027,\u0027IM_MESSENGER_ATTACH_FILE_SIZE_TB\u0027:\u0027\u0422\u0431\u0027,\u0027IM_MESSENGER_COMMENT_PLURAL_0\u0027:\u0027\u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439\u0027,\u0027IM_MESSENGER_COMMENT_PLURAL_1\u0027:\u0027\u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u044f\u0027,\u0027IM_MESSENGER_COMMENT_PLURAL_2\u0027:\u0027\u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432\u0027,\u0027IM_MESSENGER_COMMENT_ZERO\u0027:\u0027\u041d\u0435\u0442 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0435\u0432\u0027,\u0027IM_MESSENGER_COMMENT_OPEN\u0027:\u0027\u041e\u0442\u043a\u0440\u044b\u0442\u044c\u0027,\u0027UI_VUE_REACTION_ICON_LIKE\u0027:\u0027\u041d\u0440\u0430\u0432\u0438\u0442\u0441\u044f\u0027,\u0027UI_VUE_REACTION_ICON_KISS\u0027:\u0027\u0412\u043e\u0441\u0445\u0438\u0449\u0430\u044e\u0441\u044c\u0027,\u0027UI_VUE_REACTION_ICON_LAUGH\u0027:\u0027\u0421\u043c\u0435\u044e\u0441\u044c\u0027,\u0027UI_VUE_REACTION_ICON_WONDER\u0027:\u0027\u0423\u0434\u0438\u0432\u043b\u044f\u044e\u0441\u044c\u0027,\u0027UI_VUE_REACTION_ICON_CRY\u0027:\u0027\u041f\u0435\u0447\u0430\u043b\u044e\u0441\u044c\u0027,\u0027UI_VUE_REACTION_ICON_ANGRY\u0027:\u0027\u0417\u043b\u044e\u0441\u044c\u0027,\u0027IM_MESSENGER_MESSAGE_LIKE\u0027:\u0027\u041d\u0440\u0430\u0432\u0438\u0442\u0441\u044f\u0027,\u0027IM_MESSENGER_MESSAGE_DELETED\u0027:\u0027\u042d\u0442\u043e \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435 \u0431\u044b\u043b\u043e \u0443\u0434\u0430\u043b\u0435\u043d\u043e.\u0027,\u0027IM_MESSENGER_MESSAGE_DOWNLOAD\u0027:\u0027\u0421\u043a\u0430\u0447\u0430\u0442\u044c\u0027,\u0027IM_MESSENGER_MESSAGE_SAVE_TO_DISK\u0027:\u0027\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043d\u0430 \u0414\u0438\u0441\u043a\u0027,\u0027IM_MESSENGER_MESSAGE_USER_ANONYM\u0027:\u0027\u0410\u043d\u043e\u043d\u0438\u043c\u0027,\u0027IM_MESSENGER_MESSAGE_FILE_DELETED\u0027:\u0027\u0424\u0430\u0439\u043b \u0431\u044b\u043b \u0443\u0434\u0430\u043b\u0435\u043d\u0027,\u0027IM_MESSENGER_MESSAGE_MENU_TITLE\u0027:\u0027\u041a\u043b\u0438\u043a\u043d\u0438\u0442\u0435 \u0434\u043b\u044f \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u044f \u043c\u0435\u043d\u044e \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0438\u043b\u0438 \u043a\u043b\u0438\u043a\u043d\u0438\u0442\u0435 \u0443\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044f #SHORTCUT# \u0434\u043b\u044f \u0446\u0438\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f\u0027,\u0027IM_MESSENGER_MESSAGE_RETRY_TITLE\u0027:\u0027\u041a\u043b\u0438\u043a\u043d\u0438\u0442\u0435 \u0434\u043b\u044f \u043f\u043e\u0432\u0442\u043e\u0440\u043d\u043e\u0439 \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0438 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u044f\u0027,\u0027IM_DIALOG_CLIPBOARD_COPY_SUCCESS\u0027:\u0027\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e \u0432 \u0431\u0443\u0444\u0435\u0440 \u043e\u0431\u043c\u0435\u043d\u0430\u0027,\u0027IM_DIALOG_LOADING\u0027:\u0027\u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435 \u043d\u0435\u043c\u043d\u043e\u0433\u043e\u0027,\u0027IM_DIALOG_EMPTY\u0027:\u0027- \u041d\u0435\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439 -\u0027,\u0027IM_DIALOG_ERROR_TITLE\u0027:\u0027\u041a \u0441\u043e\u0436\u0430\u043b\u0435\u043d\u0438\u044e, \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0447\u0430\u0442 \u043d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c :(\u0027,\u0027IM_DIALOG_ERROR_DESC\u0027:\u0027\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0447\u0430\u0442 \u043f\u043e\u0437\u0436\u0435.\u0027,\u0027IM_MESSENGER_DIALOG_MESSAGES_READED_USER\u0027:\u0027\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u043e: #DATE#\u0027,\u0027IM_MESSENGER_DIALOG_MESSAGES_READED_CHAT\u0027:\u0027\u041f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u043e: #USERS#\u0027,\u0027IM_MESSENGER_DIALOG_MESSAGES_READED_CHAT_PLURAL\u0027:\u0027#USER# \u0438 [LINK]\u0435\u0449\u0435 #COUNT#[/LINK]\u0027,\u0027IM_MESSENGER_DIALOG_WRITES_MESSAGE\u0027:\u0027#USER# \u043f\u0438\u0448\u0435\u0442 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435...\u0027,\u0027IM_MESSENGER_DIALOG_LOAD_MESSAGES\u0027:\u0027\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0439...\u0027,\u0027IM_QUOTE_PANEL_DEFAULT_TITLE\u0027:\u0027\u0421\u0438\u0441\u0442\u0435\u043c\u043d\u043e\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435\u0027,\u0027BX_MESSENGER_TEXTAREA_PLACEHOLDER\u0027:\u0027\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435...\u0027,\u0027BX_MESSENGER_TEXTAREA_BUTTON_SEND\u0027:\u0027\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435\u0027,\u0027BX_MESSENGER_TEXTAREA_FILE\u0027:\u0027\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0444\u0430\u0439\u043b\u0027,\u0027BX_MESSENGER_TEXTAREA_SMILE\u0027:\u0027\u0412\u044b\u0431\u043e\u0440 \u0441\u043c\u0430\u0439\u043b\u043e\u0432\u0027,\u0027BX_MESSENGER_TEXTAREA_GIPHY\u0027:\u0027\u0412\u044b\u0431\u043e\u0440 GIF-\u043a\u0430\u0440\u0442\u0438\u043d\u043e\u043a\u0027,\u0027IMOL_MESSAGE_DIALOG_ID\u0027:\u0027\u0414\u0438\u0430\u043b\u043e\u0433 \u2116#ID#\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_PEOPLE\u0027:\u0027\u0421\u043c\u0430\u0439\u043b\u044b \u0438 \u043b\u044e\u0434\u0438\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_ANIMALS\u0027:\u0027\u0416\u0438\u0432\u043e\u0442\u043d\u044b\u0435 \u0438 \u043f\u0440\u0438\u0440\u043e\u0434\u0430\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_FOOD\u0027:\u0027\u0415\u0434\u0430 \u0438 \u043d\u0430\u043f\u0438\u0442\u043a\u0438\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_HOBBY\u0027:\u0027\u0425\u043e\u0431\u0431\u0438 \u0438 \u0441\u043f\u043e\u0440\u0442\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_TRAVEL\u0027:\u0027\u041c\u0435\u0441\u0442\u0430 \u0438 \u043f\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044f\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_OBJECTS\u0027:\u0027\u041e\u0431\u044a\u0435\u043a\u0442\u044b\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_SYMBOLS\u0027:\u0027\u0421\u0438\u043c\u0432\u043e\u043b\u044b\u0027,\u0027UI_VUE_SMILES_EMOJI_CATEGORY_FLAGS\u0027:\u0027\u0424\u043b\u0430\u0433\u0438\u0027,\u0027BX_LIVECHAT_TITLE\u0027:\u0027\u041e\u0442\u043a\u0440\u044b\u0442\u0430\u044f \u043b\u0438\u043d\u0438\u044f\u0027,\u0027BX_LIVECHAT_USER\u0027:\u0027\u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u043d\u0442\u0027,\u0027BX_LIVECHAT_ONLINE_LINE_1\u0027:\u0027\u041c\u044b \u043e\u043d\u043b\u0430\u0439\u043d\u0027,\u0027BX_LIVECHAT_ONLINE_LINE_2\u0027:\u0027\u0438 \u0433\u043e\u0442\u043e\u0432\u044b \u0432\u0430\u043c \u043f\u043e\u043c\u043e\u0447\u044c!\u0027,\u0027BX_LIVECHAT_OFFLINE\u0027:\u0027\u041d\u0430\u0448\u0438 \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u043d\u0442\u044b \u043e\u0442\u0432\u0435\u0442\u044f\u0442 \u0432\u0430\u043c \u0432 \u0441\u0430\u043c\u043e\u0435 \u0431\u043b\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043c\u044f!\u0027,\u0027BX_LIVECHAT_SONET_TITLE\u0027:\u0027\u041a\u043b\u0438\u043a\u043d\u0438\u0442\u0435 \u043f\u043e \u043d\u0443\u0436\u043d\u043e\u0439 \u0438\u043a\u043e\u043d\u043a\u0435 \u0438 \u043d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c \u0447\u0435\u0440\u0435\u0437 \u0443\u0434\u043e\u0431\u043d\u043e\u0435 \u0434\u043b\u044f \u0432\u0430\u0441 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435\u0027,\u0027BX_LIVECHAT_SONET_MORE\u0027:\u0027\u0415\u0449\u0435 #COUNT#...\u0027,\u0027BX_LIVECHAT_MOBILE_ROTATE\u0027:\u0027\u041f\u0435\u0440\u0435\u0432\u0435\u0440\u043d\u0438\u0442\u0435 \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u043e\u0027,\u0027BX_LIVECHAT_LOADING\u0027:\u0027\u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435 \u043d\u0435\u043c\u043d\u043e\u0433\u043e\u0027,\u0027BX_LIVECHAT_ERROR_TITLE\u0027:\u0027\u041a \u0441\u043e\u0436\u0430\u043b\u0435\u043d\u0438\u044e, \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442 \u043d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c :(\u0027,\u0027BX_LIVECHAT_ERROR_DESC\u0027:\u0027\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435\u0441\u044c \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u043a\u0430\u043d\u0430\u043b\u0430\u043c\u0438 \u0441\u0432\u044f\u0437\u0438 \u0438\u043b\u0438 \u043f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0447\u0430\u0442 \u043f\u043e\u0437\u0436\u0435.\u0027,\u0027BX_LIVECHAT_AUTH_FAILED\u0027:\u0027\u041a \u0441\u043e\u0436\u0430\u043b\u0435\u043d\u0438\u044e, \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u041e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442 \u043d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c :(\u003Cbr\u003E\u003Cbr\u003E\u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e, \u043d\u0430 \u044d\u0442\u043e\u043c \u0441\u0430\u0439\u0442\u0435 \u0440\u0430\u043d\u0435\u0435 \u0431\u044b\u043b \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d \u0434\u0440\u0443\u0433\u043e\u0439 \u0432\u0438\u0434\u0436\u0435\u0442. \u003Cbr\u003E\u003Cbr\u003E #LINK_START#\u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u043f\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443#LINK_END# \u0438\u043b\u0438 \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435\u0441\u044c \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u043a\u0430\u043d\u0430\u043b\u0430\u043c\u0438 \u0441\u0432\u044f\u0437\u0438.\u0027,\u0027BX_LIVECHAT_PORTAL_USER_NEW\u0027:\u0027\u0412\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u0442\u0435 \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 \u043e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442, \u0442\u0430\u043a \u043a\u0430\u043a \u0432 \u044d\u0442\u043e\u043c \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0432\u044b \u0443\u0436\u0435 \u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d\u044b \u043a\u0430\u043a \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a \u044d\u0442\u043e\u0433\u043e \u0411\u0438\u0442\u0440\u0438\u043a\u044124. \u003Cbr\u003E\u003Cbr\u003E \u041d\u043e \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 \u044d\u0442\u0443 \u043e\u0442\u043a\u0440\u044b\u0442\u0443\u044e \u043b\u0438\u043d\u0438\u044e \u0443 \u0441\u0435\u0431\u044f \u043d\u0430 #LINK_START#\u043f\u043e\u0440\u0442\u0430\u043b\u0435#LINK_END# \u0438\u043b\u0438 \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u043a\u0430\u043d\u0430\u043b\u0430\u043c\u0438 \u0441\u0432\u044f\u0437\u0438.\u0027,\u0027BX_LIVECHAT_SAME_DOMAIN\u0027:\u0027\u041e\u0431\u043d\u0430\u0440\u0443\u0436\u0435\u043d\u0430 \u043c\u0443\u043b\u044c\u0442\u0438\u0441\u0430\u0439\u0442\u043e\u0432\u0430\u044f \u043a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044f.\u003Cbr\u003E\u003Cbr\u003E\u0414\u043b\u044f \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0435\u043d\u0438\u044f \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0432\u0438\u0434\u0436\u0435\u0442\u043e\u043c \u043e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442\u0430 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e \u043d\u0430\u0441\u0442\u0440\u043e\u0438\u0442\u044c \u043e\u043a\u0440\u0443\u0436\u0435\u043d\u0438\u0435.\u0027,\u0027BX_LIVECHAT_SAME_DOMAIN_MORE\u0027:\u0027\u0414\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0446\u0438\u044f\u0027,\u0027BX_LIVECHAT_SAME_DOMAIN_LINK\u0027:\u0027https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=135\u0026LESSON_ID=22634\u0027,\u0027BX_LIVECHAT_OLD_BROWSER\u0027:\u0027\u0412\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u0442\u0435 \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 \u043e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442, \u0442\u0430\u043a \u043a\u0430\u043a \u0443 \u0432\u0430\u0441 \u0443\u0441\u0442\u0430\u0440\u0435\u0432\u0448\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430.\u003Cbr\u003E\u003Cbr\u003E \u041d\u043e \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 \u044d\u0442\u0443 \u043e\u0442\u043a\u0440\u044b\u0442\u0443\u044e \u043b\u0438\u043d\u0438\u044e \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0448\u0438\u0441\u044c \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u043a\u0430\u043d\u0430\u043b\u0430\u043c\u0438 \u0441\u0432\u044f\u0437\u0438.\u0027,\u0027BX_LIVECHAT_OLD_VUE\u0027:\u0027 \u041a \u0441\u043e\u0436\u0430\u043b\u0435\u043d\u0438\u044e, \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u041e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442 \u043d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c :(\\n \u041d\u043e \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c \u0432 \u044d\u0442\u0443 \u043e\u0442\u043a\u0440\u044b\u0442\u0443\u044e \u043b\u0438\u043d\u0438\u044e \u0432\u043e\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0432\u0448\u0438\u0441\u044c \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u043a\u0430\u043d\u0430\u043b\u0430\u043c\u0438 \u0441\u0432\u044f\u0437\u0438.\u0027,\u0027BX_LIVECHAT_ACTION_EXPIRED\u0027:\u0027\u041a \u0441\u043e\u0436\u0430\u043b\u0435\u043d\u0438\u044e, \u0434\u0430\u043d\u043d\u0430\u044f \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u044f \u0443\u0436\u0435 \u043d\u0435 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430.\u0027,\u0027BX_LIVECHAT_OLD_VUE_DEV\u0027:\u0027\u041d\u0430 \u0441\u0430\u0439\u0442\u0435 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d\u0430 \u0432\u0435\u0440\u0441\u0438\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 Vue (#CURRENT_VERSION#), \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u043d\u0435 \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u0432\u0438\u0434\u0436\u0435\u0442\u043e\u043c \u043e\u043d\u043b\u0430\u0439\u043d-\u0447\u0430\u0442\u0430 (\u043c\u0438\u043d\u0438\u043c\u0430\u043b\u044c\u043d\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f 2.1, \u043c\u044b \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0435\u043c 2.5 \u0438 \u0432\u044b\u0448\u0435). \u0421\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c \u0441 \u0440\u0430\u0437\u0440\u0430\u0431\u043e\u0442\u0447\u0438\u043a\u043e\u043c \u0441\u0430\u0439\u0442\u0430, \u0447\u0442\u043e\u0431\u044b \u043e\u043d \u0440\u0430\u0441\u0441\u043c\u043e\u0442\u0440\u0435\u043b \u0432\u043e\u0437\u043c\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438.\u0027,\u0027BX_LIVECHAT_CLOSE_BUTTON\u0027:\u0027\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u0432\u0438\u0434\u0436\u0435\u0442\u0027,\u0027BX_LIVECHAT_VOTE_BUTTON\u0027:\u0027\u041e\u0446\u0435\u043d\u0438\u0442\u044c \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u044f\u0027,\u0027BX_LIVECHAT_VOTE_PLUS\u0027:\u0027\u041d\u0440\u0430\u0432\u0438\u0442\u0441\u044f\u0027,\u0027BX_LIVECHAT_VOTE_MINUS\u0027:\u0027\u041d\u0435 \u043d\u0440\u0430\u0432\u0438\u0442\u0441\u044f\u0027,\u0027BX_LIVECHAT_VOTE_LATER\u0027:\u0027\u041e\u0446\u0435\u043d\u0438\u0442\u044c \u043f\u043e\u0437\u0436\u0435\u0027,\u0027BX_LIVECHAT_MAIL_BUTTON_NEW\u0027:\u0027\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043f\u0438\u044e \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440\u0430\u0027,\u0027BX_LIVECHAT_DOWNLOAD_HISTORY\u0027:\u0027\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e \u0434\u0438\u0430\u043b\u043e\u0433\u0430\u0027,\u0027BX_LIVECHAT_MAIL_TITLE_NEW\u0027:\u0027\u0423\u043a\u0430\u0436\u0438\u0442\u0435 E-mail \u043d\u0430 \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u043c\u044b \u0432\u044b\u0448\u043b\u0435\u043c \u0432\u0430\u043c \u043a\u043e\u043f\u0438\u044e \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440\u0430.\u0027,\u0027BX_LIVECHAT_MAIL_FIELD_EMAIL\u0027:\u0027\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430\u0027,\u0027BX_LIVECHAT_MAIL_RESULT_NEW\u0027:\u0027\u041c\u044b \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u043b\u0438 \u043a\u043e\u043f\u0438\u044e \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440\u0430 \u043d\u0430 \u0432\u0430\u0448\u0443 \u043f\u043e\u0447\u0442\u0443.\u0027,\u0027BX_LIVECHAT_MAIL_SEND\u0027:\u0027\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c\u0027,\u0027BX_LIVECHAT_MAIL_CONSENT_ERROR_NEW\u0027:\u0027\u041c\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u043c \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043f\u0438\u044e \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440\u0430, \u0442\u0430\u043a \u043a\u0430\u043a \u0432\u044b \u043d\u0435 \u0434\u0430\u043b\u0438 \u0441\u0432\u043e\u0435 \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u0432\u0430\u0448\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445.\u0027,\u0027BX_LIVECHAT_OFFLINE_TITLE\u0027:\u0027\u041e\u0441\u0442\u0430\u0432\u044c\u0442\u0435 \u043a\u043e\u043d\u0442\u0430\u043a\u0442\u044b \u0438 \u043c\u044b \u0443\u0432\u0435\u0434\u043e\u043c\u0438\u043c \u0432\u0430\u0441 \u043e\u0431 \u043e\u0442\u0432\u0435\u0442\u0435\u0027,\u0027BX_LIVECHAT_ABOUT_TITLE\u0027:\u0027\u041f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u044c\u0442\u0435\u0441\u044c, \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430\u0027,\u0027BX_LIVECHAT_ABOUT_FIELD_NAME_NEW\u0027:\u0027\u0418\u043c\u044f\u0027,\u0027BX_LIVECHAT_ABOUT_FIELD_EMAIL\u0027:\u0027\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430\u0027,\u0027BX_LIVECHAT_ABOUT_RESULT\u0027:\u0027\u041f\u0440\u0438\u044f\u0442\u043d\u043e \u043f\u043e\u0437\u043d\u0430\u043a\u043e\u043c\u0438\u0442\u044c\u0441\u044f!\u0027,\u0027BX_LIVECHAT_ABOUT_SEND\u0027:\u0027\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c\u0027,\u0027BX_LIVECHAT_ABOUT_CONSENT_ERROR\u0027:\u0027\u041c\u044b \u043d\u0435 \u043c\u043e\u0436\u0435\u043c \u0441\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043e \u0432\u0430\u0441, \u0442\u0430\u043a \u043a\u0430\u043a \u0432\u044b \u043d\u0435 \u0434\u0430\u043b\u0438 \u0441\u0432\u043e\u0435 \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u0432\u0430\u0448\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445.\u0027,\u0027BX_LIVECHAT_FIELD_NAME\u0027:\u0027\u0418\u043c\u044f\u0027,\u0027BX_LIVECHAT_FIELD_MAIL\u0027:\u0027\u042d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u0430\u044f \u043f\u043e\u0447\u0442\u0430\u0027,\u0027BX_LIVECHAT_FIELD_MAIL_TOOLTIP\u0027:\u0027\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0432\u0430\u0448 \u0430\u0434\u0440\u0435\u0441 \u044d\u043b\u0435\u043a\u0442\u0440\u043e\u043d\u043d\u043e\u0439 \u043f\u043e\u0447\u0442\u044b, \u0447\u0442\u043e \u0431\u044b \u043c\u044b \u043c\u043e\u0433\u043b\u0438 \u043e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0432\u0430\u043c \u043f\u043e\u0441\u0442\u0443\u043f\u0430\u044e\u0449\u0438\u0435 \u043e\u0442\u0432\u0435\u0442\u044b.\u0027,\u0027BX_LIVECHAT_FIELD_PHONE\u0027:\u0027\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430\u0027,\u0027BX_LIVECHAT_FIELD_PHONE_TOOLTIP\u0027:\u0027\u0423\u043a\u0430\u0436\u0438\u0442\u0435 \u0432\u0430\u0448 \u043d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430, \u0447\u0442\u043e \u0431\u044b \u043c\u044b \u043c\u043e\u0433\u043b\u0438 \u0441\u0432\u044f\u0437\u0430\u0442\u044c\u0441\u044f \u0441 \u0432\u0430\u043c\u0438 \u043f\u0440\u0438 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u043e\u0441\u0442\u0438.\u0027,\u0027BX_LIVECHAT_CONSENT_TITLE\u0027:\u0027\u0421\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430 \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u043f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u044b\u0445 \u0434\u0430\u043d\u043d\u044b\u0445\u0027,\u0027BX_LIVECHAT_CONSENT_CHECKBOX_1\u0027:\u0027\u042f \u0434\u0430\u044e \u0441\u0432\u043e\u0435 \u0441\u043e\u0433\u043b\u0430\u0441\u0438\u0435 \u043d\u0430\u0027,\u0027BX_LIVECHAT_CONSENT_CHECKBOX_2\u0027:\u0027\u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0443 \u043c\u043e\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445\u0027,\u0027BX_LIVECHAT_CONSENT_AGREE\u0027:\u0027\u041f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0027,\u0027BX_LIVECHAT_CONSENT_DISAGREE\u0027:\u0027\u041d\u0435 \u043f\u0440\u0438\u043d\u0438\u043c\u0430\u044e\u0027,\u0027BX_LIVECHAT_COPYRIGHT_TEXT\u0027:\u0027\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u0430\u044f CRM, \u0447\u0430\u0442\u044b \u0438 \u0441\u0430\u0439\u0442\u044b.\u0027,\u0027BX_LIVECHAT_EXTRA_SITE\u0027:\u0027\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 \u0441\u0430\u0439\u0442\u0430\u0027,\u0027BX_LIVECHAT_SYSTEM_MESSAGE\u0027:\u0027\u0421\u0438\u0441\u0442\u0435\u043c\u043d\u043e\u0435 \u0441\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435\u0027,\u0027BX_LIVECHAT_FILE_MESSAGE\u0027:\u0027\u0424\u0430\u0439\u043b\u0027,\u0027BX_LIVECHAT_FILE_SIZE_EXCEEDED\u0027:\u0027\u041f\u0440\u0435\u0432\u044b\u0448\u0435\u043d \u043c\u0430\u043a\u0441\u0438\u043c\u0430\u043b\u044c\u043d\u044b\u0439 \u0440\u0430\u0437\u043c\u0435\u0440 \u0444\u0430\u0439\u043b\u0430 (#LIMIT# \u041c\u0431).\u0027,\u0027BX_LIVECHAT_VOTE_TITLE\u0027:\u0027\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430 \u043e\u0446\u0435\u043d\u0438\u0442\u0435 \u043a\u0430\u0447\u0435\u0441\u0442\u0432\u043e \u043e\u0431\u0441\u043b\u0443\u0436\u0438\u0432\u0430\u043d\u0438\u044f\u0027,\u0027BX_LIVECHAT_VOTE_PLUS_TITLE\u0027:\u0027\u0421\u043f\u0430\u0441\u0438\u0431\u043e \u0437\u0430 \u043e\u0446\u0435\u043d\u043a\u0443!\u0027,\u0027BX_LIVECHAT_VOTE_MINUS_TITLE\u0027:\u0027\u041e\u0447\u0435\u043d\u044c \u0436\u0430\u043b\u044c, \u0447\u0442\u043e \u043c\u044b \u043d\u0435 \u0441\u043c\u043e\u0433\u043b\u0438 \u043f\u043e\u043c\u043e\u0447\u044c \u0432\u0430\u043c, \u043c\u044b \u043f\u043e\u0441\u0442\u0430\u0440\u0430\u0435\u043c\u0441\u044f \u0441\u0442\u0430\u0442\u044c \u043b\u0443\u0447\u0448\u0435.\u0027,\u0027BX_LIVECHAT_OPERATOR_POSITION_ONLY\u0027:\u0027#POSITION#\u0027,\u0027BX_LIVECHAT_OPERATOR_POSITION_AND_SESSION_ID\u0027:\u0027#POSITION#, \u0434\u0438\u0430\u043b\u043e\u0433 \u2116#ID#\u0027,\u0027BX_LIVECHAT_ADDITIONAL_ACTION_BUTTON_TOOLTIP\u0027:\u0027\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044f\u0027}  });  BXLiveChat.start();});(function () {var f = function () {var week = function () {var d = new Date();d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1)); return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);};var head = (document.getElementsByTagName(\u0022head\u0022)[0] || document.documentElement);var style = document.createElement(\u0022link\u0022); style.type = \u0022text/css\u0022; style.rel = \u0022stylesheet\u0022;  style.href = \u0022https://studio.bitrix24.ru/bitrix/js/imopenlines/widget/styles.min.css?r=1714037334-\u0022+week();var script = document.createElement(\u0022script\u0022); script.type = \u0022text/javascript\u0022; script.async = \u0022true\u0022; script.charset = \u0022UTF-8\u0022; script.src = \u0022https://studio.bitrix24.ru/bitrix/js/imopenlines/widget/script.min.js?r=1714037334-\u0022+week();head.appendChild(style); head.appendChild(script);};if (typeof(BX)!=\u0022undefined\u0022 \u0026\u0026 typeof(BX.ready)!=\u0022undefined\u0022) {BX.ready(f)}else if (typeof(jQuery)!=\u0022undefined\u0022) {jQuery(f)}else {f();}})();\u003C/script\u003E",
          show: "window.BX.LiveChat.openLiveChat();",
          hide: "window.BX.LiveChat.closeLiveChat();",
          tracking: {
            detecting: false,
            channel: { code: "imol", value: "livechat" },
          },
          freeze: true,
          sort: 100,
          useColors: true,
          classList: ["b24-widget-button-openline_livechat"],
          type: "openline",
          pages: { mode: "EXCLUDE", list: [] },
          workTime: null,
        },
        {
          id: "openline_telegrambot",
          title: "PNHD STUDIO",
          script: "",
          show: { url: "https://t.me/pnhd_studio_bot" },
          hide: null,
          tracking: {
            detecting: true,
            channel: { code: "imol", value: "telegrambot" },
          },
          classList: [
            "ui-icon",
            "ui-icon-service-telegram",
            "connector-icon-45",
          ],
          sort: 400,
          type: "openline",
          pages: { mode: "EXCLUDE", list: [] },
          workTime: null,
        },
        {
          id: "openline_notifications",
          title:
            "\u041d\u0430\u043f\u0438\u0448\u0438\u0442\u0435 \u043d\u0430\u043c \u0432 WhatsApp",
          script:
            "(function(d) {\n\tfunction loadCSS(url) {\n\t\treturn new Promise(function(resolve) {\n\t\t\tvar l=d.createElement(\u0022link\u0022);l.type=\u0022text/css\u0022;l.rel=\u0022stylesheet\u0022;l.onload = function(){resolve();};l.href=url;\n\t\t\td.head.appendChild(l);\n\t\t});\n\t}\n\tfunction loadJS(url) {\n\t\treturn new Promise(function(resolve) {\n\t\t\tvar s=d.createElement(\u0027script\u0027);s.type=\u0027text/javascript\u0027;s.async=true;s.onload=function(){resolve();};s.src=url;\n    \t\td.head.appendChild(s);\n\t\t});\n\t}\n\tfunction loadAll(jsList, cssList) {\n\t\tvar l=[];\n\t\tjsList.forEach(function(url){l.push(loadJS(url))});\n\t\tcssList.forEach(function(url){l.push(loadCSS(url))});\n\t\treturn Promise.all(l);\n\t}\n\tif(!BX)BX={};BX.NotificationsWidgetLoader={\n\t\tinit: function(params) {\n\t\t\treturn new Promise(function(resolve) {\n\t\t\t\tloadAll([\u0027https://studio.bitrix24.ru/bitrix/js/main/qrcode/qrcode.js?142902392731901\u0027,\u0027https://studio.bitrix24.ru/bitrix/js/imconnector/notifications/widget/src/notifications.widget.js?16504655664371\u0027], [\u0027https://studio.bitrix24.ru/bitrix/js/ui/design-tokens/dist/ui.design-tokens.css?171076220026098\u0027,\u0027https://studio.bitrix24.ru/bitrix/js/intranet/design-tokens/bitrix24/bitrix24-design-tokens.css?16854388541587\u0027,\u0027https://studio.bitrix24.ru/bitrix/js/ui/fonts/opensans/ui.font.opensans.css?16620208132555\u0027,\u0027https://studio.bitrix24.ru/bitrix/js/imconnector/notifications/widget/src/notifications.widget.css?16620242462196\u0027]).then(function() {\n\t\t\t\t\tBX.NotificationsWidget.Instance = new BX.NotificationsWidget(params);\n\t\t\t\t\tresolve();\n\t\t\t\t})\n\t\t\t});\n\t\t}\n\t};\n})(document);",
          show: {
            js: {
              desktop:
                "BX.NotificationsWidgetLoader.init({\u0022url\u0022:\u0022https:\\/\\/api.whatsapp.com\\/send\\/?phone=79114600190\\u0026text=%D0%9F%D0%BE%D0%B6%D0%B0%D0%BB%D1%83%D0%B9%D1%81%D1%82%D0%B0%2C%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D1%8D%D1%82%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B8%20%D1%81%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%BC%20%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%D0%BE%D0%BC%20%23941074%20%D0%A1%D0%BF%D0%B0%D1%81%D0%B8%D0%B1%D0%BE%21\u0022,\u0022onclick\u0022:\u0022document.location.href=\\u0027whatsapp:\\/\\/send\\/?phone=79114600190\\u0026text=%D0%9F%D0%BE%D0%B6%D0%B0%D0%BB%D1%83%D0%B9%D1%81%D1%82%D0%B0%2C%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D1%8D%D1%82%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B8%20%D1%81%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%BC%20%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%D0%BE%D0%BC%20%23941074%20%D0%A1%D0%BF%D0%B0%D1%81%D0%B8%D0%B1%D0%BE%21\\u0027;event.preventDefault();\u0022,\u0022messages\u0022:{\u0022IMCONNECTOR_NOTIFICATIONS_WIDGET_SELECT_COMMUNICATION_WAY\u0022:\u0022\\u0412\\u044b\\u0431\\u0435\\u0440\\u0438\\u0442\\u0435 \\u0443\\u0434\\u043e\\u0431\\u043d\\u044b\\u0439 \\u0441\\u043f\\u043e\\u0441\\u043e\\u0431 \\u043a\\u043e\\u043c\\u043c\\u0443\\u043d\\u0438\\u043a\\u0430\\u0446\\u0438\\u0439 \\u0447\\u0435\\u0440\\u0435\\u0437 WhatsApp\u0022,\u0022IMCONNECTOR_NOTIFICATIONS_WIDGET_OPEN_HERE\u0022:\u0022\\u0423 \\u043c\\u0435\\u043d\\u044f \\u0435\\u0441\\u0442\\u044c \\u043f\\u0440\\u0438\\u043b\\u043e\\u0436\\u0435\\u043d\\u0438\\u0435 \\u043d\\u0430 \\u043a\\u043e\\u043c\\u043f\\u044c\\u044e\\u0442\\u0435\\u0440\\u0435\u0022,\u0022IMCONNECTOR_NOTIFICATIONS_WIDGET_GOTO\u0022:\u0022\\u041f\\u0435\\u0440\\u0435\\u0439\\u0442\\u0438\u0022,\u0022IMCONNECTOR_NOTIFICATIONS_WIDGET_OPEN_MOBILE\u0022:\u0022\\u041f\\u0435\\u0440\\u0435\\u0439\\u0442\\u0438 \\u0432 \\u043f\\u0440\\u0438\\u043b\\u043e\\u0436\\u0435\\u043d\\u0438\\u0435 WhatsApp \\u043d\\u0430 \\u0442\\u0435\\u043b\\u0435\\u0444\\u043e\\u043d\\u0435\u0022,\u0022IMCONNECTOR_NOTIFICATIONS_WIDGET_SCAN_QR_CODE\u0022:\u0022\\u041e\\u0442\\u0441\\u043a\\u0430\\u043d\\u0438\\u0440\\u0443\\u0439\\u0442\\u0435 QR-\\u043a\\u043e\\u0434 \\u043a\\u0430\\u043c\\u0435\\u0440\\u043e\\u0439 \\u0441\\u043c\\u0430\\u0440\\u0442\\u0444\\u043e\\u043d\\u0430\u0022,\u0022IMCONNECTOR_NOTIFICATIONS_WIDGET_CLOSE\u0022:\u0022\\u0417\\u0430\\u043a\\u0440\\u044b\\u0442\\u044c\u0022},\u0022disclaimerUrl\u0022:\u0022https:\\/\\/bitrix24.com\u0022}).then(function(){window.BX.NotificationsWidget.Instance.show();})",
            },
            url: {
              mobile:
                "https://api.whatsapp.com/send/?phone=79114600190\u0026text=%D0%9F%D0%BE%D0%B6%D0%B0%D0%BB%D1%83%D0%B9%D1%81%D1%82%D0%B0%2C%20%D0%BE%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D1%8C%D1%82%D0%B5%20%D1%8D%D1%82%D0%BE%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B2%D1%8F%D0%B7%D0%B8%20%D1%81%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%BC%20%D0%BC%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80%D0%BE%D0%BC%20%23941074%20%D0%A1%D0%BF%D0%B0%D1%81%D0%B8%D0%B1%D0%BE%21",
              force: true,
            },
          },
          hide: "window.BX.NotificationsWidget.Instance.close();",
          tracking: {
            detecting: false,
            channel: { code: "imol", value: "notifications" },
          },
          classList: [
            "ui-icon",
            "ui-icon-service-whatsapp",
            "connector-icon-45",
          ],
          sort: 500,
          freeze: true,
          type: "openline",
          pages: { mode: "EXCLUDE", list: [] },
          workTime: null,
        },
      ],
      hello: { delay: 1, showWidgetId: "openline_livechat", conditions: [] },
    });
  })();
})();
