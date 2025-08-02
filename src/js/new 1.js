(function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload"))
        return;
    for (const i of document.querySelectorAll('link[rel="modulepreload"]'))
        s(i);
    new MutationObserver(i => {
        for (const r of i)
            if (r.type === "childList")
                for (const o of r.addedNodes)
                    o.tagName === "LINK" && o.rel === "modulepreload" && s(o)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function t(i) {
        const r = {};
        return i.integrity && (r.integrity = i.integrity),
        i.referrerPolicy && (r.referrerPolicy = i.referrerPolicy),
        i.crossOrigin === "use-credentials" ? r.credentials = "include" : i.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin",
        r
    }
    function s(i) {
        if (i.ep)
            return;
        i.ep = !0;
        const r = t(i);
        fetch(i.href, r)
    }
}
)();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tc = function(n) {
    const e = [];
    let t = 0;
    for (let s = 0; s < n.length; s++) {
        let i = n.charCodeAt(s);
        i < 128 ? e[t++] = i : i < 2048 ? (e[t++] = i >> 6 | 192,
        e[t++] = i & 63 | 128) : (i & 64512) === 55296 && s + 1 < n.length && (n.charCodeAt(s + 1) & 64512) === 56320 ? (i = 65536 + ((i & 1023) << 10) + (n.charCodeAt(++s) & 1023),
        e[t++] = i >> 18 | 240,
        e[t++] = i >> 12 & 63 | 128,
        e[t++] = i >> 6 & 63 | 128,
        e[t++] = i & 63 | 128) : (e[t++] = i >> 12 | 224,
        e[t++] = i >> 6 & 63 | 128,
        e[t++] = i & 63 | 128)
    }
    return e
}
  , vh = function(n) {
    const e = [];
    let t = 0
      , s = 0;
    for (; t < n.length; ) {
        const i = n[t++];
        if (i < 128)
            e[s++] = String.fromCharCode(i);
        else if (i > 191 && i < 224) {
            const r = n[t++];
            e[s++] = String.fromCharCode((i & 31) << 6 | r & 63)
        } else if (i > 239 && i < 365) {
            const r = n[t++]
              , o = n[t++]
              , a = n[t++]
              , c = ((i & 7) << 18 | (r & 63) << 12 | (o & 63) << 6 | a & 63) - 65536;
            e[s++] = String.fromCharCode(55296 + (c >> 10)),
            e[s++] = String.fromCharCode(56320 + (c & 1023))
        } else {
            const r = n[t++]
              , o = n[t++];
            e[s++] = String.fromCharCode((i & 15) << 12 | (r & 63) << 6 | o & 63)
        }
    }
    return e.join("")
}
  , nc = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + "+/="
    },
    get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + "-_."
    },
    HAS_NATIVE_SUPPORT: typeof atob == "function",
    encodeByteArray(n, e) {
        if (!Array.isArray(n))
            throw Error("encodeByteArray takes an array as a parameter");
        this.init_();
        const t = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_
          , s = [];
        for (let i = 0; i < n.length; i += 3) {
            const r = n[i]
              , o = i + 1 < n.length
              , a = o ? n[i + 1] : 0
              , c = i + 2 < n.length
              , u = c ? n[i + 2] : 0
              , l = r >> 2
              , h = (r & 3) << 4 | a >> 4;
            let f = (a & 15) << 2 | u >> 6
              , g = u & 63;
            c || (g = 64,
            o || (f = 64)),
            s.push(t[l], t[h], t[f], t[g])
        }
        return s.join("")
    },
    encodeString(n, e) {
        return this.HAS_NATIVE_SUPPORT && !e ? btoa(n) : this.encodeByteArray(tc(n), e)
    },
    decodeString(n, e) {
        return this.HAS_NATIVE_SUPPORT && !e ? atob(n) : vh(this.decodeStringToByteArray(n, e))
    },
    decodeStringToByteArray(n, e) {
        this.init_();
        const t = e ? this.charToByteMapWebSafe_ : this.charToByteMap_
          , s = [];
        for (let i = 0; i < n.length; ) {
            const r = t[n.charAt(i++)]
              , a = i < n.length ? t[n.charAt(i)] : 0;
            ++i;
            const u = i < n.length ? t[n.charAt(i)] : 64;
            ++i;
            const h = i < n.length ? t[n.charAt(i)] : 64;
            if (++i,
            r == null || a == null || u == null || h == null)
                throw new wh;
            const f = r << 2 | a >> 4;
            if (s.push(f),
            u !== 64) {
                const g = a << 4 & 240 | u >> 2;
                if (s.push(g),
                h !== 64) {
                    const E = u << 6 & 192 | h;
                    s.push(E)
                }
            }
        }
        return s
    },
    init_() {
        if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {},
            this.charToByteMap_ = {},
            this.byteToCharMapWebSafe_ = {},
            this.charToByteMapWebSafe_ = {};
            for (let n = 0; n < this.ENCODED_VALS.length; n++)
                this.byteToCharMap_[n] = this.ENCODED_VALS.charAt(n),
                this.charToByteMap_[this.byteToCharMap_[n]] = n,
                this.byteToCharMapWebSafe_[n] = this.ENCODED_VALS_WEBSAFE.charAt(n),
                this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]] = n,
                n >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)] = n,
                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)] = n)
        }
    }
};
class wh extends Error {
    constructor() {
        super(...arguments),
        this.name = "DecodeBase64StringError"
    }
}
const Eh = function(n) {
    const e = tc(n);
    return nc.encodeByteArray(e, !0)
}
  , ys = function(n) {
    return Eh(n).replace(/\./g, "")
}
  , sc = function(n) {
    try {
        return nc.decodeString(n, !0)
    } catch (e) {
        console.error("base64Decode failed: ", e)
    }
    return null
};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ih() {
    if (typeof self < "u")
        return self;
    if (typeof window < "u")
        return window;
    if (typeof global < "u")
        return global;
    throw new Error("Unable to locate global object.")
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _h = () => Ih().__FIREBASE_DEFAULTS__
  , Th = () => {
    if (typeof process > "u" || typeof process.env > "u")
        return;
    const n = {}.__FIREBASE_DEFAULTS__;
    if (n)
        return JSON.parse(n)
}
  , Sh = () => {
    if (typeof document > "u")
        return;
    let n;
    try {
        n = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
    } catch {
        return
    }
    const e = n && sc(n[1]);
    return e && JSON.parse(e)
}
  , yr = () => {
    try {
        return _h() || Th() || Sh()
    } catch (n) {
        console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);
        return
    }
}
  , ic = n => {
    var e, t;
    return (t = (e = yr()) === null || e === void 0 ? void 0 : e.emulatorHosts) === null || t === void 0 ? void 0 : t[n]
}
  , Ah = n => {
    const e = ic(n);
    if (!e)
        return;
    const t = e.lastIndexOf(":");
    if (t <= 0 || t + 1 === e.length)
        throw new Error(`Invalid host ${e} with no separate hostname and port!`);
    const s = parseInt(e.substring(t + 1), 10);
    return e[0] === "[" ? [e.substring(1, t - 1), s] : [e.substring(0, t), s]
}
  , rc = () => {
    var n;
    return (n = yr()) === null || n === void 0 ? void 0 : n.config
}
  , oc = n => {
    var e;
    return (e = yr()) === null || e === void 0 ? void 0 : e[`_${n}`]
}
;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ch {
    constructor() {
        this.reject = () => {}
        ,
        this.resolve = () => {}
        ,
        this.promise = new Promise( (e, t) => {
            this.resolve = e,
            this.reject = t
        }
        )
    }
    wrapCallback(e) {
        return (t, s) => {
            t ? this.reject(t) : this.resolve(s),
            typeof e == "function" && (this.promise.catch( () => {}
            ),
            e.length === 1 ? e(t) : e(t, s))
        }
    }
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function bh(n, e) {
    if (n.uid)
        throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
    const t = {
        alg: "none",
        type: "JWT"
    }
      , s = e || "demo-project"
      , i = n.iat || 0
      , r = n.sub || n.user_id;
    if (!r)
        throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
    const o = Object.assign({
        iss: `https://securetoken.google.com/${s}`,
        aud: s,
        iat: i,
        exp: i + 3600,
        auth_time: i,
        sub: r,
        user_id: r,
        firebase: {
            sign_in_provider: "custom",
            identities: {}
        }
    }, n)
      , a = "";
    return [ys(JSON.stringify(t)), ys(JSON.stringify(o)), a].join(".")
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ie() {
    return typeof navigator < "u" && typeof navigator.userAgent == "string" ? navigator.userAgent : ""
}
function kh() {
    return typeof window < "u" && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ie())
}
function Dh() {
    const n = typeof chrome == "object" ? chrome.runtime : typeof browser == "object" ? browser.runtime : void 0;
    return typeof n == "object" && n.id !== void 0
}
function Nh() {
    return typeof navigator == "object" && navigator.product === "ReactNative"
}
function Rh() {
    const n = ie();
    return n.indexOf("MSIE ") >= 0 || n.indexOf("Trident/") >= 0
}
function Oh() {
    try {
        return typeof indexedDB == "object"
    } catch {
        return !1
    }
}
function Ph() {
    return new Promise( (n, e) => {
        try {
            let t = !0;
            const s = "validate-browser-context-for-indexeddb-analytics-module"
              , i = self.indexedDB.open(s);
            i.onsuccess = () => {
                i.result.close(),
                t || self.indexedDB.deleteDatabase(s),
                n(!0)
            }
            ,
            i.onupgradeneeded = () => {
                t = !1
            }
            ,
            i.onerror = () => {
                var r;
                e(((r = i.error) === null || r === void 0 ? void 0 : r.message) || "")
            }
        } catch (t) {
            e(t)
        }
    }
    )
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Mh = "FirebaseError";
class Me extends Error {
    constructor(e, t, s) {
        super(t),
        this.code = e,
        this.customData = s,
        this.name = Mh,
        Object.setPrototypeOf(this, Me.prototype),
        Error.captureStackTrace && Error.captureStackTrace(this, Dn.prototype.create)
    }
}
class Dn {
    constructor(e, t, s) {
        this.service = e,
        this.serviceName = t,
        this.errors = s
    }
    create(e, ...t) {
        const s = t[0] || {}
          , i = `${this.service}/${e}`
          , r = this.errors[e]
          , o = r ? Lh(r, s) : "Error"
          , a = `${this.serviceName}: ${o} (${i}).`;
        return new Me(i,a,s)
    }
}
function Lh(n, e) {
    return n.replace(xh, (t, s) => {
        const i = e[s];
        return i != null ? String(i) : `<${s}?>`
    }
    )
}
const xh = /\{\$([^}]+)}/g;
function Fh(n) {
    for (const e in n)
        if (Object.prototype.hasOwnProperty.call(n, e))
            return !1;
    return !0
}
function vs(n, e) {
    if (n === e)
        return !0;
    const t = Object.keys(n)
      , s = Object.keys(e);
    for (const i of t) {
        if (!s.includes(i))
            return !1;
        const r = n[i]
          , o = e[i];
        if (Ro(r) && Ro(o)) {
            if (!vs(r, o))
                return !1
        } else if (r !== o)
            return !1
    }
    for (const i of s)
        if (!t.includes(i))
            return !1;
    return !0
}
function Ro(n) {
    return n !== null && typeof n == "object"
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Nn(n) {
    const e = [];
    for (const [t,s] of Object.entries(n))
        Array.isArray(s) ? s.forEach(i => {
            e.push(encodeURIComponent(t) + "=" + encodeURIComponent(i))
        }
        ) : e.push(encodeURIComponent(t) + "=" + encodeURIComponent(s));
    return e.length ? "&" + e.join("&") : ""
}
function Uh(n, e) {
    const t = new Vh(n,e);
    return t.subscribe.bind(t)
}
class Vh {
    constructor(e, t) {
        this.observers = [],
        this.unsubscribes = [],
        this.observerCount = 0,
        this.task = Promise.resolve(),
        this.finalized = !1,
        this.onNoObservers = t,
        this.task.then( () => {
            e(this)
        }
        ).catch(s => {
            this.error(s)
        }
        )
    }
    next(e) {
        this.forEachObserver(t => {
            t.next(e)
        }
        )
    }
    error(e) {
        this.forEachObserver(t => {
            t.error(e)
        }
        ),
        this.close(e)
    }
    complete() {
        this.forEachObserver(e => {
            e.complete()
        }
        ),
        this.close()
    }
    subscribe(e, t, s) {
        let i;
        if (e === void 0 && t === void 0 && s === void 0)
            throw new Error("Missing Observer.");
        $h(e, ["next", "error", "complete"]) ? i = e : i = {
            next: e,
            error: t,
            complete: s
        },
        i.next === void 0 && (i.next = wi),
        i.error === void 0 && (i.error = wi),
        i.complete === void 0 && (i.complete = wi);
        const r = this.unsubscribeOne.bind(this, this.observers.length);
        return this.finalized && this.task.then( () => {
            try {
                this.finalError ? i.error(this.finalError) : i.complete()
            } catch {}
        }
        ),
        this.observers.push(i),
        r
    }
    unsubscribeOne(e) {
        this.observers === void 0 || this.observers[e] === void 0 || (delete this.observers[e],
        this.observerCount -= 1,
        this.observerCount === 0 && this.onNoObservers !== void 0 && this.onNoObservers(this))
    }
    forEachObserver(e) {
        if (!this.finalized)
            for (let t = 0; t < this.observers.length; t++)
                this.sendOne(t, e)
    }
    sendOne(e, t) {
        this.task.then( () => {
            if (this.observers !== void 0 && this.observers[e] !== void 0)
                try {
                    t(this.observers[e])
                } catch (s) {
                    typeof console < "u" && console.error && console.error(s)
                }
        }
        )
    }
    close(e) {
        this.finalized || (this.finalized = !0,
        e !== void 0 && (this.finalError = e),
        this.task.then( () => {
            this.observers = void 0,
            this.onNoObservers = void 0
        }
        ))
    }
}
function $h(n, e) {
    if (typeof n != "object" || n === null)
        return !1;
    for (const t of e)
        if (t in n && typeof n[t] == "function")
            return !0;
    return !1
}
function wi() {}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ae(n) {
    return n && n._delegate ? n._delegate : n
}
class at {
    constructor(e, t, s) {
        this.name = e,
        this.instanceFactory = t,
        this.type = s,
        this.multipleInstances = !1,
        this.serviceProps = {},
        this.instantiationMode = "LAZY",
        this.onInstanceCreated = null
    }
    setInstantiationMode(e) {
        return this.instantiationMode = e,
        this
    }
    setMultipleInstances(e) {
        return this.multipleInstances = e,
        this
    }
    setServiceProps(e) {
        return this.serviceProps = e,
        this
    }
    setInstanceCreatedCallback(e) {
        return this.onInstanceCreated = e,
        this
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ze = "[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Bh {
    constructor(e, t) {
        this.name = e,
        this.container = t,
        this.component = null,
        this.instances = new Map,
        this.instancesDeferred = new Map,
        this.instancesOptions = new Map,
        this.onInitCallbacks = new Map
    }
    get(e) {
        const t = this.normalizeInstanceIdentifier(e);
        if (!this.instancesDeferred.has(t)) {
            const s = new Ch;
            if (this.instancesDeferred.set(t, s),
            this.isInitialized(t) || this.shouldAutoInitialize())
                try {
                    const i = this.getOrInitializeService({
                        instanceIdentifier: t
                    });
                    i && s.resolve(i)
                } catch {}
        }
        return this.instancesDeferred.get(t).promise
    }
    getImmediate(e) {
        var t;
        const s = this.normalizeInstanceIdentifier(e == null ? void 0 : e.identifier)
          , i = (t = e == null ? void 0 : e.optional) !== null && t !== void 0 ? t : !1;
        if (this.isInitialized(s) || this.shouldAutoInitialize())
            try {
                return this.getOrInitializeService({
                    instanceIdentifier: s
                })
            } catch (r) {
                if (i)
                    return null;
                throw r
            }
        else {
            if (i)
                return null;
            throw Error(`Service ${this.name} is not available`)
        }
    }
    getComponent() {
        return this.component
    }
    setComponent(e) {
        if (e.name !== this.name)
            throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);
        if (this.component)
            throw Error(`Component for ${this.name} has already been provided`);
        if (this.component = e,
        !!this.shouldAutoInitialize()) {
            if (qh(e))
                try {
                    this.getOrInitializeService({
                        instanceIdentifier: Ze
                    })
                } catch {}
            for (const [t,s] of this.instancesDeferred.entries()) {
                const i = this.normalizeInstanceIdentifier(t);
                try {
                    const r = this.getOrInitializeService({
                        instanceIdentifier: i
                    });
                    s.resolve(r)
                } catch {}
            }
        }
    }
    clearInstance(e=Ze) {
        this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e)
    }
    async delete() {
        const e = Array.from(this.instances.values());
        await Promise.all([...e.filter(t => "INTERNAL"in t).map(t => t.INTERNAL.delete()), ...e.filter(t => "_delete"in t).map(t => t._delete())])
    }
    isComponentSet() {
        return this.component != null
    }
    isInitialized(e=Ze) {
        return this.instances.has(e)
    }
    getOptions(e=Ze) {
        return this.instancesOptions.get(e) || {}
    }
    initialize(e={}) {
        const {options: t={}} = e
          , s = this.normalizeInstanceIdentifier(e.instanceIdentifier);
        if (this.isInitialized(s))
            throw Error(`${this.name}(${s}) has already been initialized`);
        if (!this.isComponentSet())
            throw Error(`Component ${this.name} has not been registered yet`);
        const i = this.getOrInitializeService({
            instanceIdentifier: s,
            options: t
        });
        for (const [r,o] of this.instancesDeferred.entries()) {
            const a = this.normalizeInstanceIdentifier(r);
            s === a && o.resolve(i)
        }
        return i
    }
    onInit(e, t) {
        var s;
        const i = this.normalizeInstanceIdentifier(t)
          , r = (s = this.onInitCallbacks.get(i)) !== null && s !== void 0 ? s : new Set;
        r.add(e),
        this.onInitCallbacks.set(i, r);
        const o = this.instances.get(i);
        return o && e(o, i),
        () => {
            r.delete(e)
        }
    }
    invokeOnInitCallbacks(e, t) {
        const s = this.onInitCallbacks.get(t);
        if (s)
            for (const i of s)
                try {
                    i(e, t)
                } catch {}
    }
    getOrInitializeService({instanceIdentifier: e, options: t={}}) {
        let s = this.instances.get(e);
        if (!s && this.component && (s = this.component.instanceFactory(this.container, {
            instanceIdentifier: jh(e),
            options: t
        }),
        this.instances.set(e, s),
        this.instancesOptions.set(e, t),
        this.invokeOnInitCallbacks(s, e),
        this.component.onInstanceCreated))
            try {
                this.component.onInstanceCreated(this.container, e, s)
            } catch {}
        return s || null
    }
    normalizeInstanceIdentifier(e=Ze) {
        return this.component ? this.component.multipleInstances ? e : Ze : e
    }
    shouldAutoInitialize() {
        return !!this.component && this.component.instantiationMode !== "EXPLICIT"
    }
}
function jh(n) {
    return n === Ze ? void 0 : n
}
function qh(n) {
    return n.instantiationMode === "EAGER"
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class zh {
    constructor(e) {
        this.name = e,
        this.providers = new Map
    }
    addComponent(e) {
        const t = this.getProvider(e.name);
        if (t.isComponentSet())
            throw new Error(`Component ${e.name} has already been registered with ${this.name}`);
        t.setComponent(e)
    }
    addOrOverwriteComponent(e) {
        this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name),
        this.addComponent(e)
    }
    getProvider(e) {
        if (this.providers.has(e))
            return this.providers.get(e);
        const t = new Bh(e,this);
        return this.providers.set(e, t),
        t
    }
    getProviders() {
        return Array.from(this.providers.values())
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var N;
(function(n) {
    n[n.DEBUG = 0] = "DEBUG",
    n[n.VERBOSE = 1] = "VERBOSE",
    n[n.INFO = 2] = "INFO",
    n[n.WARN = 3] = "WARN",
    n[n.ERROR = 4] = "ERROR",
    n[n.SILENT = 5] = "SILENT"
}
)(N || (N = {}));
const Hh = {
    debug: N.DEBUG,
    verbose: N.VERBOSE,
    info: N.INFO,
    warn: N.WARN,
    error: N.ERROR,
    silent: N.SILENT
}
  , Kh = N.INFO
  , Gh = {
    [N.DEBUG]: "log",
    [N.VERBOSE]: "log",
    [N.INFO]: "info",
    [N.WARN]: "warn",
    [N.ERROR]: "error"
}
  , Wh = (n, e, ...t) => {
    if (e < n.logLevel)
        return;
    const s = new Date().toISOString()
      , i = Gh[e];
    if (i)
        console[i](`[${s}]  ${n.name}:`, ...t);
    else
        throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)
}
;
class vr {
    constructor(e) {
        this.name = e,
        this._logLevel = Kh,
        this._logHandler = Wh,
        this._userLogHandler = null
    }
    get logLevel() {
        return this._logLevel
    }
    set logLevel(e) {
        if (!(e in N))
            throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
        this._logLevel = e
    }
    setLogLevel(e) {
        this._logLevel = typeof e == "string" ? Hh[e] : e
    }
    get logHandler() {
        return this._logHandler
    }
    set logHandler(e) {
        if (typeof e != "function")
            throw new TypeError("Value assigned to `logHandler` must be a function");
        this._logHandler = e
    }
    get userLogHandler() {
        return this._userLogHandler
    }
    set userLogHandler(e) {
        this._userLogHandler = e
    }
    debug(...e) {
        this._userLogHandler && this._userLogHandler(this, N.DEBUG, ...e),
        this._logHandler(this, N.DEBUG, ...e)
    }
    log(...e) {
        this._userLogHandler && this._userLogHandler(this, N.VERBOSE, ...e),
        this._logHandler(this, N.VERBOSE, ...e)
    }
    info(...e) {
        this._userLogHandler && this._userLogHandler(this, N.INFO, ...e),
        this._logHandler(this, N.INFO, ...e)
    }
    warn(...e) {
        this._userLogHandler && this._userLogHandler(this, N.WARN, ...e),
        this._logHandler(this, N.WARN, ...e)
    }
    error(...e) {
        this._userLogHandler && this._userLogHandler(this, N.ERROR, ...e),
        this._logHandler(this, N.ERROR, ...e)
    }
}
const Qh = (n, e) => e.some(t => n instanceof t);
let Oo, Po;
function Yh() {
    return Oo || (Oo = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
}
function Jh() {
    return Po || (Po = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])
}
const ac = new WeakMap
  , Ui = new WeakMap
  , cc = new WeakMap
  , Ei = new WeakMap
  , wr = new WeakMap;
function Xh(n) {
    const e = new Promise( (t, s) => {
        const i = () => {
            n.removeEventListener("success", r),
            n.removeEventListener("error", o)
        }
          , r = () => {
            t(Be(n.result)),
            i()
        }
          , o = () => {
            s(n.error),
            i()
        }
        ;
        n.addEventListener("success", r),
        n.addEventListener("error", o)
    }
    );
    return e.then(t => {
        t instanceof IDBCursor && ac.set(t, n)
    }
    ).catch( () => {}
    ),
    wr.set(e, n),
    e
}
function Zh(n) {
    if (Ui.has(n))
        return;
    const e = new Promise( (t, s) => {
        const i = () => {
            n.removeEventListener("complete", r),
            n.removeEventListener("error", o),
            n.removeEventListener("abort", o)
        }
          , r = () => {
            t(),
            i()
        }
          , o = () => {
            s(n.error || new DOMException("AbortError","AbortError")),
            i()
        }
        ;
        n.addEventListener("complete", r),
        n.addEventListener("error", o),
        n.addEventListener("abort", o)
    }
    );
    Ui.set(n, e)
}
let Vi = {
    get(n, e, t) {
        if (n instanceof IDBTransaction) {
            if (e === "done")
                return Ui.get(n);
            if (e === "objectStoreNames")
                return n.objectStoreNames || cc.get(n);
            if (e === "store")
                return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0])
        }
        return Be(n[e])
    },
    set(n, e, t) {
        return n[e] = t,
        !0
    },
    has(n, e) {
        return n instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in n
    }
};
function ed(n) {
    Vi = n(Vi)
}
function td(n) {
    return n === IDBDatabase.prototype.transaction && !("objectStoreNames"in IDBTransaction.prototype) ? function(e, ...t) {
        const s = n.call(Ii(this), e, ...t);
        return cc.set(s, e.sort ? e.sort() : [e]),
        Be(s)
    }
    : Jh().includes(n) ? function(...e) {
        return n.apply(Ii(this), e),
        Be(ac.get(this))
    }
    : function(...e) {
        return Be(n.apply(Ii(this), e))
    }
}
function nd(n) {
    return typeof n == "function" ? td(n) : (n instanceof IDBTransaction && Zh(n),
    Qh(n, Yh()) ? new Proxy(n,Vi) : n)
}
function Be(n) {
    if (n instanceof IDBRequest)
        return Xh(n);
    if (Ei.has(n))
        return Ei.get(n);
    const e = nd(n);
    return e !== n && (Ei.set(n, e),
    wr.set(e, n)),
    e
}
const Ii = n => wr.get(n);
function sd(n, e, {blocked: t, upgrade: s, blocking: i, terminated: r}={}) {
    const o = indexedDB.open(n, e)
      , a = Be(o);
    return s && o.addEventListener("upgradeneeded", c => {
        s(Be(o.result), c.oldVersion, c.newVersion, Be(o.transaction), c)
    }
    ),
    t && o.addEventListener("blocked", c => t(c.oldVersion, c.newVersion, c)),
    a.then(c => {
        r && c.addEventListener("close", () => r()),
        i && c.addEventListener("versionchange", u => i(u.oldVersion, u.newVersion, u))
    }
    ).catch( () => {}
    ),
    a
}
const id = ["get", "getKey", "getAll", "getAllKeys", "count"]
  , rd = ["put", "add", "delete", "clear"]
  , _i = new Map;
function Mo(n, e) {
    if (!(n instanceof IDBDatabase && !(e in n) && typeof e == "string"))
        return;
    if (_i.get(e))
        return _i.get(e);
    const t = e.replace(/FromIndex$/, "")
      , s = e !== t
      , i = rd.includes(t);
    if (!(t in (s ? IDBIndex : IDBObjectStore).prototype) || !(i || id.includes(t)))
        return;
    const r = async function(o, ...a) {
        const c = this.transaction(o, i ? "readwrite" : "readonly");
        let u = c.store;
        return s && (u = u.index(a.shift())),
        (await Promise.all([u[t](...a), i && c.done]))[0]
    };
    return _i.set(e, r),
    r
}
ed(n => ({
    ...n,
    get: (e, t, s) => Mo(e, t) || n.get(e, t, s),
    has: (e, t) => !!Mo(e, t) || n.has(e, t)
}));
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class od {
    constructor(e) {
        this.container = e
    }
    getPlatformInfoString() {
        return this.container.getProviders().map(t => {
            if (ad(t)) {
                const s = t.getImmediate();
                return `${s.library}/${s.version}`
            } else
                return null
        }
        ).filter(t => t).join(" ")
    }
}
function ad(n) {
    const e = n.getComponent();
    return (e == null ? void 0 : e.type) === "VERSION"
}
const $i = "@firebase/app"
  , Lo = "0.9.13";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ct = new vr("@firebase/app")
  , cd = "@firebase/app-compat"
  , ud = "@firebase/analytics-compat"
  , ld = "@firebase/analytics"
  , hd = "@firebase/app-check-compat"
  , dd = "@firebase/app-check"
  , fd = "@firebase/auth"
  , pd = "@firebase/auth-compat"
  , gd = "@firebase/database"
  , md = "@firebase/database-compat"
  , yd = "@firebase/functions"
  , vd = "@firebase/functions-compat"
  , wd = "@firebase/installations"
  , Ed = "@firebase/installations-compat"
  , Id = "@firebase/messaging"
  , _d = "@firebase/messaging-compat"
  , Td = "@firebase/performance"
  , Sd = "@firebase/performance-compat"
  , Ad = "@firebase/remote-config"
  , Cd = "@firebase/remote-config-compat"
  , bd = "@firebase/storage"
  , kd = "@firebase/storage-compat"
  , Dd = "@firebase/firestore"
  , Nd = "@firebase/firestore-compat"
  , Rd = "firebase"
  , Od = "9.23.0";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Bi = "[DEFAULT]"
  , Pd = {
    [$i]: "fire-core",
    [cd]: "fire-core-compat",
    [ld]: "fire-analytics",
    [ud]: "fire-analytics-compat",
    [dd]: "fire-app-check",
    [hd]: "fire-app-check-compat",
    [fd]: "fire-auth",
    [pd]: "fire-auth-compat",
    [gd]: "fire-rtdb",
    [md]: "fire-rtdb-compat",
    [yd]: "fire-fn",
    [vd]: "fire-fn-compat",
    [wd]: "fire-iid",
    [Ed]: "fire-iid-compat",
    [Id]: "fire-fcm",
    [_d]: "fire-fcm-compat",
    [Td]: "fire-perf",
    [Sd]: "fire-perf-compat",
    [Ad]: "fire-rc",
    [Cd]: "fire-rc-compat",
    [bd]: "fire-gcs",
    [kd]: "fire-gcs-compat",
    [Dd]: "fire-fst",
    [Nd]: "fire-fst-compat",
    "fire-js": "fire-js",
    [Rd]: "fire-js-all"
};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ws = new Map
  , ji = new Map;
function Md(n, e) {
    try {
        n.container.addComponent(e)
    } catch (t) {
        ct.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`, t)
    }
}
function Ot(n) {
    const e = n.name;
    if (ji.has(e))
        return ct.debug(`There were multiple attempts to register component ${e}.`),
        !1;
    ji.set(e, n);
    for (const t of ws.values())
        Md(t, n);
    return !0
}
function Er(n, e) {
    const t = n.container.getProvider("heartbeat").getImmediate({
        optional: !0
    });
    return t && t.triggerHeartbeat(),
    n.container.getProvider(e)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ld = {
    "no-app": "No Firebase App '{$appName}' has been created - call initializeApp() first",
    "bad-app-name": "Illegal App name: '{$appName}",
    "duplicate-app": "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "no-options": "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument": "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument": "First argument to `onLog` must be null or a function.",
    "idb-open": "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get": "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set": "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete": "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
}
  , je = new Dn("app","Firebase",Ld);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xd {
    constructor(e, t, s) {
        this._isDeleted = !1,
        this._options = Object.assign({}, e),
        this._config = Object.assign({}, t),
        this._name = t.name,
        this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled,
        this._container = s,
        this.container.addComponent(new at("app", () => this,"PUBLIC"))
    }
    get automaticDataCollectionEnabled() {
        return this.checkDestroyed(),
        this._automaticDataCollectionEnabled
    }
    set automaticDataCollectionEnabled(e) {
        this.checkDestroyed(),
        this._automaticDataCollectionEnabled = e
    }
    get name() {
        return this.checkDestroyed(),
        this._name
    }
    get options() {
        return this.checkDestroyed(),
        this._options
    }
    get config() {
        return this.checkDestroyed(),
        this._config
    }
    get container() {
        return this._container
    }
    get isDeleted() {
        return this._isDeleted
    }
    set isDeleted(e) {
        this._isDeleted = e
    }
    checkDestroyed() {
        if (this.isDeleted)
            throw je.create("app-deleted", {
                appName: this._name
            })
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const jt = Od;
function uc(n, e={}) {
    let t = n;
    typeof e != "object" && (e = {
        name: e
    });
    const s = Object.assign({
        name: Bi,
        automaticDataCollectionEnabled: !1
    }, e)
      , i = s.name;
    if (typeof i != "string" || !i)
        throw je.create("bad-app-name", {
            appName: String(i)
        });
    if (t || (t = rc()),
    !t)
        throw je.create("no-options");
    const r = ws.get(i);
    if (r) {
        if (vs(t, r.options) && vs(s, r.config))
            return r;
        throw je.create("duplicate-app", {
            appName: i
        })
    }
    const o = new zh(i);
    for (const c of ji.values())
        o.addComponent(c);
    const a = new xd(t,s,o);
    return ws.set(i, a),
    a
}
function lc(n=Bi) {
    const e = ws.get(n);
    if (!e && n === Bi && rc())
        return uc();
    if (!e)
        throw je.create("no-app", {
            appName: n
        });
    return e
}
function qe(n, e, t) {
    var s;
    let i = (s = Pd[n]) !== null && s !== void 0 ? s : n;
    t && (i += `-${t}`);
    const r = i.match(/\s|\//)
      , o = e.match(/\s|\//);
    if (r || o) {
        const a = [`Unable to register library "${i}" with version "${e}":`];
        r && a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),
        r && o && a.push("and"),
        o && a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),
        ct.warn(a.join(" "));
        return
    }
    Ot(new at(`${i}-version`, () => ({
        library: i,
        version: e
    }),"VERSION"))
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Fd = "firebase-heartbeat-database"
  , Ud = 1
  , ln = "firebase-heartbeat-store";
let Ti = null;
function hc() {
    return Ti || (Ti = sd(Fd, Ud, {
        upgrade: (n, e) => {
            switch (e) {
            case 0:
                n.createObjectStore(ln)
            }
        }
    }).catch(n => {
        throw je.create("idb-open", {
            originalErrorMessage: n.message
        })
    }
    )),
    Ti
}
async function Vd(n) {
    try {
        return await (await hc()).transaction(ln).objectStore(ln).get(dc(n))
    } catch (e) {
        if (e instanceof Me)
            ct.warn(e.message);
        else {
            const t = je.create("idb-get", {
                originalErrorMessage: e == null ? void 0 : e.message
            });
            ct.warn(t.message)
        }
    }
}
async function xo(n, e) {
    try {
        const s = (await hc()).transaction(ln, "readwrite");
        await s.objectStore(ln).put(e, dc(n)),
        await s.done
    } catch (t) {
        if (t instanceof Me)
            ct.warn(t.message);
        else {
            const s = je.create("idb-set", {
                originalErrorMessage: t == null ? void 0 : t.message
            });
            ct.warn(s.message)
        }
    }
}
function dc(n) {
    return `${n.name}!${n.options.appId}`
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $d = 1024
  , Bd = 30 * 24 * 60 * 60 * 1e3;
class jd {
    constructor(e) {
        this.container = e,
        this._heartbeatsCache = null;
        const t = this.container.getProvider("app").getImmediate();
        this._storage = new zd(t),
        this._heartbeatsCachePromise = this._storage.read().then(s => (this._heartbeatsCache = s,
        s))
    }
    async triggerHeartbeat() {
        const t = this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString()
          , s = Fo();
        if (this._heartbeatsCache === null && (this._heartbeatsCache = await this._heartbeatsCachePromise),
        !(this._heartbeatsCache.lastSentHeartbeatDate === s || this._heartbeatsCache.heartbeats.some(i => i.date === s)))
            return this._heartbeatsCache.heartbeats.push({
                date: s,
                agent: t
            }),
            this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter(i => {
                const r = new Date(i.date).valueOf();
                return Date.now() - r <= Bd
            }
            ),
            this._storage.overwrite(this._heartbeatsCache)
    }
    async getHeartbeatsHeader() {
        if (this._heartbeatsCache === null && await this._heartbeatsCachePromise,
        this._heartbeatsCache === null || this._heartbeatsCache.heartbeats.length === 0)
            return "";
        const e = Fo()
          , {heartbeatsToSend: t, unsentEntries: s} = qd(this._heartbeatsCache.heartbeats)
          , i = ys(JSON.stringify({
            version: 2,
            heartbeats: t
        }));
        return this._heartbeatsCache.lastSentHeartbeatDate = e,
        s.length > 0 ? (this._heartbeatsCache.heartbeats = s,
        await this._storage.overwrite(this._heartbeatsCache)) : (this._heartbeatsCache.heartbeats = [],
        this._storage.overwrite(this._heartbeatsCache)),
        i
    }
}
function Fo() {
    return new Date().toISOString().substring(0, 10)
}
function qd(n, e=$d) {
    const t = [];
    let s = n.slice();
    for (const i of n) {
        const r = t.find(o => o.agent === i.agent);
        if (r) {
            if (r.dates.push(i.date),
            Uo(t) > e) {
                r.dates.pop();
                break
            }
        } else if (t.push({
            agent: i.agent,
            dates: [i.date]
        }),
        Uo(t) > e) {
            t.pop();
            break
        }
        s = s.slice(1)
    }
    return {
        heartbeatsToSend: t,
        unsentEntries: s
    }
}
class zd {
    constructor(e) {
        this.app = e,
        this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck()
    }
    async runIndexedDBEnvironmentCheck() {
        return Oh() ? Ph().then( () => !0).catch( () => !1) : !1
    }
    async read() {
        return await this._canUseIndexedDBPromise ? await Vd(this.app) || {
            heartbeats: []
        } : {
            heartbeats: []
        }
    }
    async overwrite(e) {
        var t;
        if (await this._canUseIndexedDBPromise) {
            const i = await this.read();
            return xo(this.app, {
                lastSentHeartbeatDate: (t = e.lastSentHeartbeatDate) !== null && t !== void 0 ? t : i.lastSentHeartbeatDate,
                heartbeats: e.heartbeats
            })
        } else
            return
    }
    async add(e) {
        var t;
        if (await this._canUseIndexedDBPromise) {
            const i = await this.read();
            return xo(this.app, {
                lastSentHeartbeatDate: (t = e.lastSentHeartbeatDate) !== null && t !== void 0 ? t : i.lastSentHeartbeatDate,
                heartbeats: [...i.heartbeats, ...e.heartbeats]
            })
        } else
            return
    }
}
function Uo(n) {
    return ys(JSON.stringify({
        version: 2,
        heartbeats: n
    })).length
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Hd(n) {
    Ot(new at("platform-logger",e => new od(e),"PRIVATE")),
    Ot(new at("heartbeat",e => new jd(e),"PRIVATE")),
    qe($i, Lo, n),
    qe($i, Lo, "esm2017"),
    qe("fire-js", "")
}
Hd("");
var Kd = "firebase"
  , Gd = "9.23.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
qe(Kd, Gd, "app");
function Ir(n, e) {
    var t = {};
    for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && e.indexOf(s) < 0 && (t[s] = n[s]);
    if (n != null && typeof Object.getOwnPropertySymbols == "function")
        for (var i = 0, s = Object.getOwnPropertySymbols(n); i < s.length; i++)
            e.indexOf(s[i]) < 0 && Object.prototype.propertyIsEnumerable.call(n, s[i]) && (t[s[i]] = n[s[i]]);
    return t
}
function fc() {
    return {
        "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    }
}
const Wd = fc
  , pc = new Dn("auth","Firebase",fc());
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Es = new vr("@firebase/auth");
function Qd(n, ...e) {
    Es.logLevel <= N.WARN && Es.warn(`Auth (${jt}): ${n}`, ...e)
}
function us(n, ...e) {
    Es.logLevel <= N.ERROR && Es.error(`Auth (${jt}): ${n}`, ...e)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ke(n, ...e) {
    throw _r(n, ...e)
}
function we(n, ...e) {
    return _r(n, ...e)
}
function Yd(n, e, t) {
    const s = Object.assign(Object.assign({}, Wd()), {
        [e]: t
    });
    return new Dn("auth","Firebase",s).create(e, {
        appName: n.name
    })
}
function _r(n, ...e) {
    if (typeof n != "string") {
        const t = e[0]
          , s = [...e.slice(1)];
        return s[0] && (s[0].appName = n.name),
        n._errorFactory.create(t, ...s)
    }
    return pc.create(n, ...e)
}
function A(n, e, ...t) {
    if (!n)
        throw _r(e, ...t)
}
function Te(n) {
    const e = "INTERNAL ASSERTION FAILED: " + n;
    throw us(e),
    new Error(e)
}
function De(n, e) {
    n || Te(e)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qi() {
    var n;
    return typeof self < "u" && ((n = self.location) === null || n === void 0 ? void 0 : n.href) || ""
}
function Jd() {
    return Vo() === "http:" || Vo() === "https:"
}
function Vo() {
    var n;
    return typeof self < "u" && ((n = self.location) === null || n === void 0 ? void 0 : n.protocol) || null
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Xd() {
    return typeof navigator < "u" && navigator && "onLine"in navigator && typeof navigator.onLine == "boolean" && (Jd() || Dh() || "connection"in navigator) ? navigator.onLine : !0
}
function Zd() {
    if (typeof navigator > "u")
        return null;
    const n = navigator;
    return n.languages && n.languages[0] || n.language || null
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Rn {
    constructor(e, t) {
        this.shortDelay = e,
        this.longDelay = t,
        De(t > e, "Short delay should be less than long delay!"),
        this.isMobile = kh() || Nh()
    }
    get() {
        return Xd() ? this.isMobile ? this.longDelay : this.shortDelay : Math.min(5e3, this.shortDelay)
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Tr(n, e) {
    De(n.emulator, "Emulator should always be set here");
    const {url: t} = n.emulator;
    return e ? `${t}${e.startsWith("/") ? e.slice(1) : e}` : t
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gc {
    static initialize(e, t, s) {
        this.fetchImpl = e,
        t && (this.headersImpl = t),
        s && (this.responseImpl = s)
    }
    static fetch() {
        if (this.fetchImpl)
            return this.fetchImpl;
        if (typeof self < "u" && "fetch"in self)
            return self.fetch;
        Te("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")
    }
    static headers() {
        if (this.headersImpl)
            return this.headersImpl;
        if (typeof self < "u" && "Headers"in self)
            return self.Headers;
        Te("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")
    }
    static response() {
        if (this.responseImpl)
            return this.responseImpl;
        if (typeof self < "u" && "Response"in self)
            return self.Response;
        Te("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ef = {
    CREDENTIAL_MISMATCH: "custom-token-mismatch",
    MISSING_CUSTOM_TOKEN: "internal-error",
    INVALID_IDENTIFIER: "invalid-email",
    MISSING_CONTINUE_URI: "internal-error",
    INVALID_PASSWORD: "wrong-password",
    MISSING_PASSWORD: "missing-password",
    EMAIL_EXISTS: "email-already-in-use",
    PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
    INVALID_IDP_RESPONSE: "invalid-credential",
    INVALID_PENDING_TOKEN: "invalid-credential",
    FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
    MISSING_REQ_TYPE: "internal-error",
    EMAIL_NOT_FOUND: "user-not-found",
    RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
    EXPIRED_OOB_CODE: "expired-action-code",
    INVALID_OOB_CODE: "invalid-action-code",
    MISSING_OOB_CODE: "internal-error",
    CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
    INVALID_ID_TOKEN: "invalid-user-token",
    TOKEN_EXPIRED: "user-token-expired",
    USER_NOT_FOUND: "user-token-expired",
    TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
    INVALID_CODE: "invalid-verification-code",
    INVALID_SESSION_INFO: "invalid-verification-id",
    INVALID_TEMPORARY_PROOF: "invalid-credential",
    MISSING_SESSION_INFO: "missing-verification-id",
    SESSION_EXPIRED: "code-expired",
    MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
    UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
    INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
    ADMIN_ONLY_OPERATION: "admin-restricted-operation",
    INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
    MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
    MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
    MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
    SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
    SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
    BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
    RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
    MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
    INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
    INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
    MISSING_CLIENT_TYPE: "missing-client-type",
    MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
    INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
    INVALID_REQ_TYPE: "invalid-req-type"
};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tf = new Rn(3e4,6e4);
function mc(n, e) {
    return n.tenantId && !e.tenantId ? Object.assign(Object.assign({}, e), {
        tenantId: n.tenantId
    }) : e
}
async function On(n, e, t, s, i={}) {
    return yc(n, i, async () => {
        let r = {}
          , o = {};
        s && (e === "GET" ? o = s : r = {
            body: JSON.stringify(s)
        });
        const a = Nn(Object.assign({
            key: n.config.apiKey
        }, o)).slice(1)
          , c = await n._getAdditionalHeaders();
        return c["Content-Type"] = "application/json",
        n.languageCode && (c["X-Firebase-Locale"] = n.languageCode),
        gc.fetch()(vc(n, n.config.apiHost, t, a), Object.assign({
            method: e,
            headers: c,
            referrerPolicy: "no-referrer"
        }, r))
    }
    )
}
async function yc(n, e, t) {
    n._canInitEmulator = !1;
    const s = Object.assign(Object.assign({}, ef), e);
    try {
        const i = new sf(n)
          , r = await Promise.race([t(), i.promise]);
        i.clearNetworkTimeout();
        const o = await r.json();
        if ("needConfirmation"in o)
            throw Zn(n, "account-exists-with-different-credential", o);
        if (r.ok && !("errorMessage"in o))
            return o;
        {
            const a = r.ok ? o.errorMessage : o.error.message
              , [c,u] = a.split(" : ");
            if (c === "FEDERATED_USER_ID_ALREADY_LINKED")
                throw Zn(n, "credential-already-in-use", o);
            if (c === "EMAIL_EXISTS")
                throw Zn(n, "email-already-in-use", o);
            if (c === "USER_DISABLED")
                throw Zn(n, "user-disabled", o);
            const l = s[c] || c.toLowerCase().replace(/[_\s]+/g, "-");
            if (u)
                throw Yd(n, l, u);
            ke(n, l)
        }
    } catch (i) {
        if (i instanceof Me)
            throw i;
        ke(n, "network-request-failed", {
            message: String(i)
        })
    }
}
async function nf(n, e, t, s, i={}) {
    const r = await On(n, e, t, s, i);
    return "mfaPendingCredential"in r && ke(n, "multi-factor-auth-required", {
        _serverResponse: r
    }),
    r
}
function vc(n, e, t, s) {
    const i = `${e}${t}?${s}`;
    return n.config.emulator ? Tr(n.config, i) : `${n.config.apiScheme}://${i}`
}
class sf {
    constructor(e) {
        this.auth = e,
        this.timer = null,
        this.promise = new Promise( (t, s) => {
            this.timer = setTimeout( () => s(we(this.auth, "network-request-failed")), tf.get())
        }
        )
    }
    clearNetworkTimeout() {
        clearTimeout(this.timer)
    }
}
function Zn(n, e, t) {
    const s = {
        appName: n.name
    };
    t.email && (s.email = t.email),
    t.phoneNumber && (s.phoneNumber = t.phoneNumber);
    const i = we(n, e, s);
    return i.customData._tokenResponse = t,
    i
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function rf(n, e) {
    return On(n, "POST", "/v1/accounts:delete", e)
}
async function of(n, e) {
    return On(n, "POST", "/v1/accounts:lookup", e)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function sn(n) {
    if (n)
        try {
            const e = new Date(Number(n));
            if (!isNaN(e.getTime()))
                return e.toUTCString()
        } catch {}
}
async function af(n, e=!1) {
    const t = ae(n)
      , s = await t.getIdToken(e)
      , i = Sr(s);
    A(i && i.exp && i.auth_time && i.iat, t.auth, "internal-error");
    const r = typeof i.firebase == "object" ? i.firebase : void 0
      , o = r == null ? void 0 : r.sign_in_provider;
    return {
        claims: i,
        token: s,
        authTime: sn(Si(i.auth_time)),
        issuedAtTime: sn(Si(i.iat)),
        expirationTime: sn(Si(i.exp)),
        signInProvider: o || null,
        signInSecondFactor: (r == null ? void 0 : r.sign_in_second_factor) || null
    }
}
function Si(n) {
    return Number(n) * 1e3
}
function Sr(n) {
    const [e,t,s] = n.split(".");
    if (e === void 0 || t === void 0 || s === void 0)
        return us("JWT malformed, contained fewer than 3 sections"),
        null;
    try {
        const i = sc(t);
        return i ? JSON.parse(i) : (us("Failed to decode base64 JWT payload"),
        null)
    } catch (i) {
        return us("Caught error parsing JWT payload as JSON", i == null ? void 0 : i.toString()),
        null
    }
}
function cf(n) {
    const e = Sr(n);
    return A(e, "internal-error"),
    A(typeof e.exp < "u", "internal-error"),
    A(typeof e.iat < "u", "internal-error"),
    Number(e.exp) - Number(e.iat)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function hn(n, e, t=!1) {
    if (t)
        return e;
    try {
        return await e
    } catch (s) {
        throw s instanceof Me && uf(s) && n.auth.currentUser === n && await n.auth.signOut(),
        s
    }
}
function uf({code: n}) {
    return n === "auth/user-disabled" || n === "auth/user-token-expired"
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class lf {
    constructor(e) {
        this.user = e,
        this.isRunning = !1,
        this.timerId = null,
        this.errorBackoff = 3e4
    }
    _start() {
        this.isRunning || (this.isRunning = !0,
        this.schedule())
    }
    _stop() {
        this.isRunning && (this.isRunning = !1,
        this.timerId !== null && clearTimeout(this.timerId))
    }
    getInterval(e) {
        var t;
        if (e) {
            const s = this.errorBackoff;
            return this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4),
            s
        } else {
            this.errorBackoff = 3e4;
            const i = ((t = this.user.stsTokenManager.expirationTime) !== null && t !== void 0 ? t : 0) - Date.now() - 3e5;
            return Math.max(0, i)
        }
    }
    schedule(e=!1) {
        if (!this.isRunning)
            return;
        const t = this.getInterval(e);
        this.timerId = setTimeout(async () => {
            await this.iteration()
        }
        , t)
    }
    async iteration() {
        try {
            await this.user.getIdToken(!0)
        } catch (e) {
            (e == null ? void 0 : e.code) === "auth/network-request-failed" && this.schedule(!0);
            return
        }
        this.schedule()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class wc {
    constructor(e, t) {
        this.createdAt = e,
        this.lastLoginAt = t,
        this._initializeTime()
    }
    _initializeTime() {
        this.lastSignInTime = sn(this.lastLoginAt),
        this.creationTime = sn(this.createdAt)
    }
    _copy(e) {
        this.createdAt = e.createdAt,
        this.lastLoginAt = e.lastLoginAt,
        this._initializeTime()
    }
    toJSON() {
        return {
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
        }
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Is(n) {
    var e;
    const t = n.auth
      , s = await n.getIdToken()
      , i = await hn(n, of(t, {
        idToken: s
    }));
    A(i == null ? void 0 : i.users.length, t, "internal-error");
    const r = i.users[0];
    n._notifyReloadListener(r);
    const o = !((e = r.providerUserInfo) === null || e === void 0) && e.length ? ff(r.providerUserInfo) : []
      , a = df(n.providerData, o)
      , c = n.isAnonymous
      , u = !(n.email && r.passwordHash) && !(a != null && a.length)
      , l = c ? u : !1
      , h = {
        uid: r.localId,
        displayName: r.displayName || null,
        photoURL: r.photoUrl || null,
        email: r.email || null,
        emailVerified: r.emailVerified || !1,
        phoneNumber: r.phoneNumber || null,
        tenantId: r.tenantId || null,
        providerData: a,
        metadata: new wc(r.createdAt,r.lastLoginAt),
        isAnonymous: l
    };
    Object.assign(n, h)
}
async function hf(n) {
    const e = ae(n);
    await Is(e),
    await e.auth._persistUserIfCurrent(e),
    e.auth._notifyListenersIfCurrent(e)
}
function df(n, e) {
    return [...n.filter(s => !e.some(i => i.providerId === s.providerId)), ...e]
}
function ff(n) {
    return n.map(e => {
        var {providerId: t} = e
          , s = Ir(e, ["providerId"]);
        return {
            providerId: t,
            uid: s.rawId || "",
            displayName: s.displayName || null,
            email: s.email || null,
            phoneNumber: s.phoneNumber || null,
            photoURL: s.photoUrl || null
        }
    }
    )
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function pf(n, e) {
    const t = await yc(n, {}, async () => {
        const s = Nn({
            grant_type: "refresh_token",
            refresh_token: e
        }).slice(1)
          , {tokenApiHost: i, apiKey: r} = n.config
          , o = vc(n, i, "/v1/token", `key=${r}`)
          , a = await n._getAdditionalHeaders();
        return a["Content-Type"] = "application/x-www-form-urlencoded",
        gc.fetch()(o, {
            method: "POST",
            headers: a,
            body: s
        })
    }
    );
    return {
        accessToken: t.access_token,
        expiresIn: t.expires_in,
        refreshToken: t.refresh_token
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class dn {
    constructor() {
        this.refreshToken = null,
        this.accessToken = null,
        this.expirationTime = null
    }
    get isExpired() {
        return !this.expirationTime || Date.now() > this.expirationTime - 3e4
    }
    updateFromServerResponse(e) {
        A(e.idToken, "internal-error"),
        A(typeof e.idToken < "u", "internal-error"),
        A(typeof e.refreshToken < "u", "internal-error");
        const t = "expiresIn"in e && typeof e.expiresIn < "u" ? Number(e.expiresIn) : cf(e.idToken);
        this.updateTokensAndExpiration(e.idToken, e.refreshToken, t)
    }
    async getToken(e, t=!1) {
        return A(!this.accessToken || this.refreshToken, e, "user-token-expired"),
        !t && this.accessToken && !this.isExpired ? this.accessToken : this.refreshToken ? (await this.refresh(e, this.refreshToken),
        this.accessToken) : null
    }
    clearRefreshToken() {
        this.refreshToken = null
    }
    async refresh(e, t) {
        const {accessToken: s, refreshToken: i, expiresIn: r} = await pf(e, t);
        this.updateTokensAndExpiration(s, i, Number(r))
    }
    updateTokensAndExpiration(e, t, s) {
        this.refreshToken = t || null,
        this.accessToken = e || null,
        this.expirationTime = Date.now() + s * 1e3
    }
    static fromJSON(e, t) {
        const {refreshToken: s, accessToken: i, expirationTime: r} = t
          , o = new dn;
        return s && (A(typeof s == "string", "internal-error", {
            appName: e
        }),
        o.refreshToken = s),
        i && (A(typeof i == "string", "internal-error", {
            appName: e
        }),
        o.accessToken = i),
        r && (A(typeof r == "number", "internal-error", {
            appName: e
        }),
        o.expirationTime = r),
        o
    }
    toJSON() {
        return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
        }
    }
    _assign(e) {
        this.accessToken = e.accessToken,
        this.refreshToken = e.refreshToken,
        this.expirationTime = e.expirationTime
    }
    _clone() {
        return Object.assign(new dn, this.toJSON())
    }
    _performRefresh() {
        return Te("not implemented")
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Le(n, e) {
    A(typeof n == "string" || typeof n > "u", "internal-error", {
        appName: e
    })
}
class it {
    constructor(e) {
        var {uid: t, auth: s, stsTokenManager: i} = e
          , r = Ir(e, ["uid", "auth", "stsTokenManager"]);
        this.providerId = "firebase",
        this.proactiveRefresh = new lf(this),
        this.reloadUserInfo = null,
        this.reloadListener = null,
        this.uid = t,
        this.auth = s,
        this.stsTokenManager = i,
        this.accessToken = i.accessToken,
        this.displayName = r.displayName || null,
        this.email = r.email || null,
        this.emailVerified = r.emailVerified || !1,
        this.phoneNumber = r.phoneNumber || null,
        this.photoURL = r.photoURL || null,
        this.isAnonymous = r.isAnonymous || !1,
        this.tenantId = r.tenantId || null,
        this.providerData = r.providerData ? [...r.providerData] : [],
        this.metadata = new wc(r.createdAt || void 0,r.lastLoginAt || void 0)
    }
    async getIdToken(e) {
        const t = await hn(this, this.stsTokenManager.getToken(this.auth, e));
        return A(t, this.auth, "internal-error"),
        this.accessToken !== t && (this.accessToken = t,
        await this.auth._persistUserIfCurrent(this),
        this.auth._notifyListenersIfCurrent(this)),
        t
    }
    getIdTokenResult(e) {
        return af(this, e)
    }
    reload() {
        return hf(this)
    }
    _assign(e) {
        this !== e && (A(this.uid === e.uid, this.auth, "internal-error"),
        this.displayName = e.displayName,
        this.photoURL = e.photoURL,
        this.email = e.email,
        this.emailVerified = e.emailVerified,
        this.phoneNumber = e.phoneNumber,
        this.isAnonymous = e.isAnonymous,
        this.tenantId = e.tenantId,
        this.providerData = e.providerData.map(t => Object.assign({}, t)),
        this.metadata._copy(e.metadata),
        this.stsTokenManager._assign(e.stsTokenManager))
    }
    _clone(e) {
        const t = new it(Object.assign(Object.assign({}, this), {
            auth: e,
            stsTokenManager: this.stsTokenManager._clone()
        }));
        return t.metadata._copy(this.metadata),
        t
    }
    _onReload(e) {
        A(!this.reloadListener, this.auth, "internal-error"),
        this.reloadListener = e,
        this.reloadUserInfo && (this._notifyReloadListener(this.reloadUserInfo),
        this.reloadUserInfo = null)
    }
    _notifyReloadListener(e) {
        this.reloadListener ? this.reloadListener(e) : this.reloadUserInfo = e
    }
    _startProactiveRefresh() {
        this.proactiveRefresh._start()
    }
    _stopProactiveRefresh() {
        this.proactiveRefresh._stop()
    }
    async _updateTokensIfNecessary(e, t=!1) {
        let s = !1;
        e.idToken && e.idToken !== this.stsTokenManager.accessToken && (this.stsTokenManager.updateFromServerResponse(e),
        s = !0),
        t && await Is(this),
        await this.auth._persistUserIfCurrent(this),
        s && this.auth._notifyListenersIfCurrent(this)
    }
    async delete() {
        const e = await this.getIdToken();
        return await hn(this, rf(this.auth, {
            idToken: e
        })),
        this.stsTokenManager.clearRefreshToken(),
        this.auth.signOut()
    }
    toJSON() {
        return Object.assign(Object.assign({
            uid: this.uid,
            email: this.email || void 0,
            emailVerified: this.emailVerified,
            displayName: this.displayName || void 0,
            isAnonymous: this.isAnonymous,
            photoURL: this.photoURL || void 0,
            phoneNumber: this.phoneNumber || void 0,
            tenantId: this.tenantId || void 0,
            providerData: this.providerData.map(e => Object.assign({}, e)),
            stsTokenManager: this.stsTokenManager.toJSON(),
            _redirectEventId: this._redirectEventId
        }, this.metadata.toJSON()), {
            apiKey: this.auth.config.apiKey,
            appName: this.auth.name
        })
    }
    get refreshToken() {
        return this.stsTokenManager.refreshToken || ""
    }
    static _fromJSON(e, t) {
        var s, i, r, o, a, c, u, l;
        const h = (s = t.displayName) !== null && s !== void 0 ? s : void 0
          , f = (i = t.email) !== null && i !== void 0 ? i : void 0
          , g = (r = t.phoneNumber) !== null && r !== void 0 ? r : void 0
          , E = (o = t.photoURL) !== null && o !== void 0 ? o : void 0
          , C = (a = t.tenantId) !== null && a !== void 0 ? a : void 0
          , _ = (c = t._redirectEventId) !== null && c !== void 0 ? c : void 0
          , U = (u = t.createdAt) !== null && u !== void 0 ? u : void 0
          , V = (l = t.lastLoginAt) !== null && l !== void 0 ? l : void 0
          , {uid: z, emailVerified: ue, isAnonymous: Je, providerData: Xe, stsTokenManager: Qt} = t;
        A(z && Qt, e, "internal-error");
        const vi = dn.fromJSON(this.name, Qt);
        A(typeof z == "string", e, "internal-error"),
        Le(h, e.name),
        Le(f, e.name),
        A(typeof ue == "boolean", e, "internal-error"),
        A(typeof Je == "boolean", e, "internal-error"),
        Le(g, e.name),
        Le(E, e.name),
        Le(C, e.name),
        Le(_, e.name),
        Le(U, e.name),
        Le(V, e.name);
        const vt = new it({
            uid: z,
            auth: e,
            email: f,
            emailVerified: ue,
            displayName: h,
            isAnonymous: Je,
            photoURL: E,
            phoneNumber: g,
            tenantId: C,
            stsTokenManager: vi,
            createdAt: U,
            lastLoginAt: V
        });
        return Xe && Array.isArray(Xe) && (vt.providerData = Xe.map(yh => Object.assign({}, yh))),
        _ && (vt._redirectEventId = _),
        vt
    }
    static async _fromIdTokenResponse(e, t, s=!1) {
        const i = new dn;
        i.updateFromServerResponse(t);
        const r = new it({
            uid: t.localId,
            auth: e,
            stsTokenManager: i,
            isAnonymous: s
        });
        return await Is(r),
        r
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const $o = new Map;
function Se(n) {
    De(n instanceof Function, "Expected a class definition");
    let e = $o.get(n);
    return e ? (De(e instanceof n, "Instance stored in cache mismatched with class"),
    e) : (e = new n,
    $o.set(n, e),
    e)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ec {
    constructor() {
        this.type = "NONE",
        this.storage = {}
    }
    async _isAvailable() {
        return !0
    }
    async _set(e, t) {
        this.storage[e] = t
    }
    async _get(e) {
        const t = this.storage[e];
        return t === void 0 ? null : t
    }
    async _remove(e) {
        delete this.storage[e]
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
}
Ec.type = "NONE";
const Bo = Ec;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function ls(n, e, t) {
    return `firebase:${n}:${e}:${t}`
}
class At {
    constructor(e, t, s) {
        this.persistence = e,
        this.auth = t,
        this.userKey = s;
        const {config: i, name: r} = this.auth;
        this.fullUserKey = ls(this.userKey, i.apiKey, r),
        this.fullPersistenceKey = ls("persistence", i.apiKey, r),
        this.boundEventHandler = t._onStorageEvent.bind(t),
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler)
    }
    setCurrentUser(e) {
        return this.persistence._set(this.fullUserKey, e.toJSON())
    }
    async getCurrentUser() {
        const e = await this.persistence._get(this.fullUserKey);
        return e ? it._fromJSON(this.auth, e) : null
    }
    removeCurrentUser() {
        return this.persistence._remove(this.fullUserKey)
    }
    savePersistenceForRedirect() {
        return this.persistence._set(this.fullPersistenceKey, this.persistence.type)
    }
    async setPersistence(e) {
        if (this.persistence === e)
            return;
        const t = await this.getCurrentUser();
        if (await this.removeCurrentUser(),
        this.persistence = e,
        t)
            return this.setCurrentUser(t)
    }
    delete() {
        this.persistence._removeListener(this.fullUserKey, this.boundEventHandler)
    }
    static async create(e, t, s="authUser") {
        if (!t.length)
            return new At(Se(Bo),e,s);
        const i = (await Promise.all(t.map(async u => {
            if (await u._isAvailable())
                return u
        }
        ))).filter(u => u);
        let r = i[0] || Se(Bo);
        const o = ls(s, e.config.apiKey, e.name);
        let a = null;
        for (const u of t)
            try {
                const l = await u._get(o);
                if (l) {
                    const h = it._fromJSON(e, l);
                    u !== r && (a = h),
                    r = u;
                    break
                }
            } catch {}
        const c = i.filter(u => u._shouldAllowMigration);
        return !r._shouldAllowMigration || !c.length ? new At(r,e,s) : (r = c[0],
        a && await r._set(o, a.toJSON()),
        await Promise.all(t.map(async u => {
            if (u !== r)
                try {
                    await u._remove(o)
                } catch {}
        }
        )),
        new At(r,e,s))
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function jo(n) {
    const e = n.toLowerCase();
    if (e.includes("opera/") || e.includes("opr/") || e.includes("opios/"))
        return "Opera";
    if (Tc(e))
        return "IEMobile";
    if (e.includes("msie") || e.includes("trident/"))
        return "IE";
    if (e.includes("edge/"))
        return "Edge";
    if (Ic(e))
        return "Firefox";
    if (e.includes("silk/"))
        return "Silk";
    if (Ac(e))
        return "Blackberry";
    if (Cc(e))
        return "Webos";
    if (Ar(e))
        return "Safari";
    if ((e.includes("chrome/") || _c(e)) && !e.includes("edge/"))
        return "Chrome";
    if (Sc(e))
        return "Android";
    {
        const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/
          , s = n.match(t);
        if ((s == null ? void 0 : s.length) === 2)
            return s[1]
    }
    return "Other"
}
function Ic(n=ie()) {
    return /firefox\//i.test(n)
}
function Ar(n=ie()) {
    const e = n.toLowerCase();
    return e.includes("safari/") && !e.includes("chrome/") && !e.includes("crios/") && !e.includes("android")
}
function _c(n=ie()) {
    return /crios\//i.test(n)
}
function Tc(n=ie()) {
    return /iemobile/i.test(n)
}
function Sc(n=ie()) {
    return /android/i.test(n)
}
function Ac(n=ie()) {
    return /blackberry/i.test(n)
}
function Cc(n=ie()) {
    return /webos/i.test(n)
}
function Us(n=ie()) {
    return /iphone|ipad|ipod/i.test(n) || /macintosh/i.test(n) && /mobile/i.test(n)
}
function gf(n=ie()) {
    var e;
    return Us(n) && !!(!((e = window.navigator) === null || e === void 0) && e.standalone)
}
function mf() {
    return Rh() && document.documentMode === 10
}
function bc(n=ie()) {
    return Us(n) || Sc(n) || Cc(n) || Ac(n) || /windows phone/i.test(n) || Tc(n)
}
function yf() {
    try {
        return !!(window && window !== window.top)
    } catch {
        return !1
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function kc(n, e=[]) {
    let t;
    switch (n) {
    case "Browser":
        t = jo(ie());
        break;
    case "Worker":
        t = `${jo(ie())}-${n}`;
        break;
    default:
        t = n
    }
    const s = e.length ? e.join(",") : "FirebaseCore-web";
    return `${t}/JsCore/${jt}/${s}`
}
async function Dc(n, e) {
    return On(n, "GET", "/v2/recaptchaConfig", mc(n, e))
}
function qo(n) {
    return n !== void 0 && n.enterprise !== void 0
}
class Nc {
    constructor(e) {
        if (this.siteKey = "",
        this.emailPasswordEnabled = !1,
        e.recaptchaKey === void 0)
            throw new Error("recaptchaKey undefined");
        this.siteKey = e.recaptchaKey.split("/")[3],
        this.emailPasswordEnabled = e.recaptchaEnforcementState.some(t => t.provider === "EMAIL_PASSWORD_PROVIDER" && t.enforcementState !== "OFF")
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function vf() {
    var n, e;
    return (e = (n = document.getElementsByTagName("head")) === null || n === void 0 ? void 0 : n[0]) !== null && e !== void 0 ? e : document
}
function Rc(n) {
    return new Promise( (e, t) => {
        const s = document.createElement("script");
        s.setAttribute("src", n),
        s.onload = e,
        s.onerror = i => {
            const r = we("internal-error");
            r.customData = i,
            t(r)
        }
        ,
        s.type = "text/javascript",
        s.charset = "UTF-8",
        vf().appendChild(s)
    }
    )
}
function wf(n) {
    return `__${n}${Math.floor(Math.random() * 1e6)}`
}
const Ef = "https://www.google.com/recaptcha/enterprise.js?render="
  , If = "recaptcha-enterprise"
  , _f = "NO_RECAPTCHA";
class Tf {
    constructor(e) {
        this.type = If,
        this.auth = Vs(e)
    }
    async verify(e="verify", t=!1) {
        async function s(r) {
            if (!t) {
                if (r.tenantId == null && r._agentRecaptchaConfig != null)
                    return r._agentRecaptchaConfig.siteKey;
                if (r.tenantId != null && r._tenantRecaptchaConfigs[r.tenantId] !== void 0)
                    return r._tenantRecaptchaConfigs[r.tenantId].siteKey
            }
            return new Promise(async (o, a) => {
                Dc(r, {
                    clientType: "CLIENT_TYPE_WEB",
                    version: "RECAPTCHA_ENTERPRISE"
                }).then(c => {
                    if (c.recaptchaKey === void 0)
                        a(new Error("recaptcha Enterprise site key undefined"));
                    else {
                        const u = new Nc(c);
                        return r.tenantId == null ? r._agentRecaptchaConfig = u : r._tenantRecaptchaConfigs[r.tenantId] = u,
                        o(u.siteKey)
                    }
                }
                ).catch(c => {
                    a(c)
                }
                )
            }
            )
        }
        function i(r, o, a) {
            const c = window.grecaptcha;
            qo(c) ? c.enterprise.ready( () => {
                c.enterprise.execute(r, {
                    action: e
                }).then(u => {
                    o(u)
                }
                ).catch( () => {
                    o(_f)
                }
                )
            }
            ) : a(Error("No reCAPTCHA enterprise script loaded."))
        }
        return new Promise( (r, o) => {
            s(this.auth).then(a => {
                if (!t && qo(window.grecaptcha))
                    i(a, r, o);
                else {
                    if (typeof window > "u") {
                        o(new Error("RecaptchaVerifier is only supported in browser"));
                        return
                    }
                    Rc(Ef + a).then( () => {
                        i(a, r, o)
                    }
                    ).catch(c => {
                        o(c)
                    }
                    )
                }
            }
            ).catch(a => {
                o(a)
            }
            )
        }
        )
    }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Sf {
    constructor(e) {
        this.auth = e,
        this.queue = []
    }
    pushCallback(e, t) {
        const s = r => new Promise( (o, a) => {
            try {
                const c = e(r);
                o(c)
            } catch (c) {
                a(c)
            }
        }
        );
        s.onAbort = t,
        this.queue.push(s);
        const i = this.queue.length - 1;
        return () => {
            this.queue[i] = () => Promise.resolve()
        }
    }
    async runMiddleware(e) {
        if (this.auth.currentUser === e)
            return;
        const t = [];
        try {
            for (const s of this.queue)
                await s(e),
                s.onAbort && t.push(s.onAbort)
        } catch (s) {
            t.reverse();
            for (const i of t)
                try {
                    i()
                } catch {}
            throw this.auth._errorFactory.create("login-blocked", {
                originalMessage: s == null ? void 0 : s.message
            })
        }
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Af {
    constructor(e, t, s, i) {
        this.app = e,
        this.heartbeatServiceProvider = t,
        this.appCheckServiceProvider = s,
        this.config = i,
        this.currentUser = null,
        this.emulatorConfig = null,
        this.operations = Promise.resolve(),
        this.authStateSubscription = new zo(this),
        this.idTokenSubscription = new zo(this),
        this.beforeStateQueue = new Sf(this),
        this.redirectUser = null,
        this.isProactiveRefreshEnabled = !1,
        this._canInitEmulator = !0,
        this._isInitialized = !1,
        this._deleted = !1,
        this._initializationPromise = null,
        this._popupRedirectResolver = null,
        this._errorFactory = pc,
        this._agentRecaptchaConfig = null,
        this._tenantRecaptchaConfigs = {},
        this.lastNotifiedUid = void 0,
        this.languageCode = null,
        this.tenantId = null,
        this.settings = {
            appVerificationDisabledForTesting: !1
        },
        this.frameworks = [],
        this.name = e.name,
        this.clientVersion = i.sdkClientVersion
    }
    _initializeWithPersistence(e, t) {
        return t && (this._popupRedirectResolver = Se(t)),
        this._initializationPromise = this.queue(async () => {
            var s, i;
            if (!this._deleted && (this.persistenceManager = await At.create(this, e),
            !this._deleted)) {
                if (!((s = this._popupRedirectResolver) === null || s === void 0) && s._shouldInitProactively)
                    try {
                        await this._popupRedirectResolver._initialize(this)
                    } catch {}
                await this.initializeCurrentUser(t),
                this.lastNotifiedUid = ((i = this.currentUser) === null || i === void 0 ? void 0 : i.uid) || null,
                !this._deleted && (this._isInitialized = !0)
            }
        }
        ),
        this._initializationPromise
    }
    async _onStorageEvent() {
        if (this._deleted)
            return;
        const e = await this.assertedPersistence.getCurrentUser();
        if (!(!this.currentUser && !e)) {
            if (this.currentUser && e && this.currentUser.uid === e.uid) {
                this._currentUser._assign(e),
                await this.currentUser.getIdToken();
                return
            }
            await this._updateCurrentUser(e, !0)
        }
    }
    async initializeCurrentUser(e) {
        var t;
        const s = await this.assertedPersistence.getCurrentUser();
        let i = s
          , r = !1;
        if (e && this.config.authDomain) {
            await this.getOrInitRedirectPersistenceManager();
            const o = (t = this.redirectUser) === null || t === void 0 ? void 0 : t._redirectEventId
              , a = i == null ? void 0 : i._redirectEventId
              , c = await this.tryRedirectSignIn(e);
            (!o || o === a) && (c != null && c.user) && (i = c.user,
            r = !0)
        }
        if (!i)
            return this.directlySetCurrentUser(null);
        if (!i._redirectEventId) {
            if (r)
                try {
                    await this.beforeStateQueue.runMiddleware(i)
                } catch (o) {
                    i = s,
                    this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(o))
                }
            return i ? this.reloadAndSetCurrentUserOrClear(i) : this.directlySetCurrentUser(null)
        }
        return A(this._popupRedirectResolver, this, "argument-error"),
        await this.getOrInitRedirectPersistenceManager(),
        this.redirectUser && this.redirectUser._redirectEventId === i._redirectEventId ? this.directlySetCurrentUser(i) : this.reloadAndSetCurrentUserOrClear(i)
    }
    async tryRedirectSignIn(e) {
        let t = null;
        try {
            t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0)
        } catch {
            await this._setRedirectUser(null)
        }
        return t
    }
    async reloadAndSetCurrentUserOrClear(e) {
        try {
            await Is(e)
        } catch (t) {
            if ((t == null ? void 0 : t.code) !== "auth/network-request-failed")
                return this.directlySetCurrentUser(null)
        }
        return this.directlySetCurrentUser(e)
    }
    useDeviceLanguage() {
        this.languageCode = Zd()
    }
    async _delete() {
        this._deleted = !0
    }
    async updateCurrentUser(e) {
        const t = e ? ae(e) : null;
        return t && A(t.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token"),
        this._updateCurrentUser(t && t._clone(this))
    }
    async _updateCurrentUser(e, t=!1) {
        if (!this._deleted)
            return e && A(this.tenantId === e.tenantId, this, "tenant-id-mismatch"),
            t || await this.beforeStateQueue.runMiddleware(e),
            this.queue(async () => {
                await this.directlySetCurrentUser(e),
                this.notifyAuthListeners()
            }
            )
    }
    async signOut() {
        return await this.beforeStateQueue.runMiddleware(null),
        (this.redirectPersistenceManager || this._popupRedirectResolver) && await this._setRedirectUser(null),
        this._updateCurrentUser(null, !0)
    }
    setPersistence(e) {
        return this.queue(async () => {
            await this.assertedPersistence.setPersistence(Se(e))
        }
        )
    }
    async initializeRecaptchaConfig() {
        const e = await Dc(this, {
            clientType: "CLIENT_TYPE_WEB",
            version: "RECAPTCHA_ENTERPRISE"
        })
          , t = new Nc(e);
        this.tenantId == null ? this._agentRecaptchaConfig = t : this._tenantRecaptchaConfigs[this.tenantId] = t,
        t.emailPasswordEnabled && new Tf(this).verify()
    }
    _getRecaptchaConfig() {
        return this.tenantId == null ? this._agentRecaptchaConfig : this._tenantRecaptchaConfigs[this.tenantId]
    }
    _getPersistence() {
        return this.assertedPersistence.persistence.type
    }
    _updateErrorMap(e) {
        this._errorFactory = new Dn("auth","Firebase",e())
    }
    onAuthStateChanged(e, t, s) {
        return this.registerStateListener(this.authStateSubscription, e, t, s)
    }
    beforeAuthStateChanged(e, t) {
        return this.beforeStateQueue.pushCallback(e, t)
    }
    onIdTokenChanged(e, t, s) {
        return this.registerStateListener(this.idTokenSubscription, e, t, s)
    }
    toJSON() {
        var e;
        return {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            appName: this.name,
            currentUser: (e = this._currentUser) === null || e === void 0 ? void 0 : e.toJSON()
        }
    }
    async _setRedirectUser(e, t) {
        const s = await this.getOrInitRedirectPersistenceManager(t);
        return e === null ? s.removeCurrentUser() : s.setCurrentUser(e)
    }
    async getOrInitRedirectPersistenceManager(e) {
        if (!this.redirectPersistenceManager) {
            const t = e && Se(e) || this._popupRedirectResolver;
            A(t, this, "argument-error"),
            this.redirectPersistenceManager = await At.create(this, [Se(t._redirectPersistence)], "redirectUser"),
            this.redirectUser = await this.redirectPersistenceManager.getCurrentUser()
        }
        return this.redirectPersistenceManager
    }
    async _redirectUserForId(e) {
        var t, s;
        return this._isInitialized && await this.queue(async () => {}
        ),
        ((t = this._currentUser) === null || t === void 0 ? void 0 : t._redirectEventId) === e ? this._currentUser : ((s = this.redirectUser) === null || s === void 0 ? void 0 : s._redirectEventId) === e ? this.redirectUser : null
    }
    async _persistUserIfCurrent(e) {
        if (e === this.currentUser)
            return this.queue(async () => this.directlySetCurrentUser(e))
    }
    _notifyListenersIfCurrent(e) {
        e === this.currentUser && this.notifyAuthListeners()
    }
    _key() {
        return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`
    }
    _startProactiveRefresh() {
        this.isProactiveRefreshEnabled = !0,
        this.currentUser && this._currentUser._startProactiveRefresh()
    }
    _stopProactiveRefresh() {
        this.isProactiveRefreshEnabled = !1,
        this.currentUser && this._currentUser._stopProactiveRefresh()
    }
    get _currentUser() {
        return this.currentUser
    }
    notifyAuthListeners() {
        var e, t;
        if (!this._isInitialized)
            return;
        this.idTokenSubscription.next(this.currentUser);
        const s = (t = (e = this.currentUser) === null || e === void 0 ? void 0 : e.uid) !== null && t !== void 0 ? t : null;
        this.lastNotifiedUid !== s && (this.lastNotifiedUid = s,
        this.authStateSubscription.next(this.currentUser))
    }
    registerStateListener(e, t, s, i) {
        if (this._deleted)
            return () => {}
            ;
        const r = typeof t == "function" ? t : t.next.bind(t)
          , o = this._isInitialized ? Promise.resolve() : this._initializationPromise;
        return A(o, this, "internal-error"),
        o.then( () => r(this.currentUser)),
        typeof t == "function" ? e.addObserver(t, s, i) : e.addObserver(t)
    }
    async directlySetCurrentUser(e) {
        this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(),
        e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(),
        this.currentUser = e,
        e ? await this.assertedPersistence.setCurrentUser(e) : await this.assertedPersistence.removeCurrentUser()
    }
    queue(e) {
        return this.operations = this.operations.then(e, e),
        this.operations
    }
    get assertedPersistence() {
        return A(this.persistenceManager, this, "internal-error"),
        this.persistenceManager
    }
    _logFramework(e) {
        !e || this.frameworks.includes(e) || (this.frameworks.push(e),
        this.frameworks.sort(),
        this.clientVersion = kc(this.config.clientPlatform, this._getFrameworks()))
    }
    _getFrameworks() {
        return this.frameworks
    }
    async _getAdditionalHeaders() {
        var e;
        const t = {
            "X-Client-Version": this.clientVersion
        };
        this.app.options.appId && (t["X-Firebase-gmpid"] = this.app.options.appId);
        const s = await ((e = this.heartbeatServiceProvider.getImmediate({
            optional: !0
        })) === null || e === void 0 ? void 0 : e.getHeartbeatsHeader());
        s && (t["X-Firebase-Client"] = s);
        const i = await this._getAppCheckToken();
        return i && (t["X-Firebase-AppCheck"] = i),
        t
    }
    async _getAppCheckToken() {
        var e;
        const t = await ((e = this.appCheckServiceProvider.getImmediate({
            optional: !0
        })) === null || e === void 0 ? void 0 : e.getToken());
        return t != null && t.error && Qd(`Error while retrieving App Check token: ${t.error}`),
        t == null ? void 0 : t.token
    }
}
function Vs(n) {
    return ae(n)
}
class zo {
    constructor(e) {
        this.auth = e,
        this.observer = null,
        this.addObserver = Uh(t => this.observer = t)
    }
    get next() {
        return A(this.observer, this.auth, "internal-error"),
        this.observer.next.bind(this.observer)
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Cf(n, e) {
    const t = Er(n, "auth");
    if (t.isInitialized()) {
        const i = t.getImmediate()
          , r = t.getOptions();
        if (vs(r, e ?? {}))
            return i;
        ke(i, "already-initialized")
    }
    return t.initialize({
        options: e
    })
}
function bf(n, e) {
    const t = (e == null ? void 0 : e.persistence) || []
      , s = (Array.isArray(t) ? t : [t]).map(Se);
    e != null && e.errorMap && n._updateErrorMap(e.errorMap),
    n._initializeWithPersistence(s, e == null ? void 0 : e.popupRedirectResolver)
}
function kf(n, e, t) {
    const s = Vs(n);
    A(s._canInitEmulator, s, "emulator-config-failed"),
    A(/^https?:\/\//.test(e), s, "invalid-emulator-scheme");
    const i = !!(t != null && t.disableWarnings)
      , r = Oc(e)
      , {host: o, port: a} = Df(e)
      , c = a === null ? "" : `:${a}`;
    s.config.emulator = {
        url: `${r}//${o}${c}/`
    },
    s.settings.appVerificationDisabledForTesting = !0,
    s.emulatorConfig = Object.freeze({
        host: o,
        port: a,
        protocol: r.replace(":", ""),
        options: Object.freeze({
            disableWarnings: i
        })
    }),
    i || Nf()
}
function Oc(n) {
    const e = n.indexOf(":");
    return e < 0 ? "" : n.substr(0, e + 1)
}
function Df(n) {
    const e = Oc(n)
      , t = /(\/\/)?([^?#/]+)/.exec(n.substr(e.length));
    if (!t)
        return {
            host: "",
            port: null
        };
    const s = t[2].split("@").pop() || ""
      , i = /^(\[[^\]]+\])(:|$)/.exec(s);
    if (i) {
        const r = i[1];
        return {
            host: r,
            port: Ho(s.substr(r.length + 1))
        }
    } else {
        const [r,o] = s.split(":");
        return {
            host: r,
            port: Ho(o)
        }
    }
}
function Ho(n) {
    if (!n)
        return null;
    const e = Number(n);
    return isNaN(e) ? null : e
}
function Nf() {
    function n() {
        const e = document.createElement("p")
          , t = e.style;
        e.innerText = "Running in emulator mode. Do not use with production credentials.",
        t.position = "fixed",
        t.width = "100%",
        t.backgroundColor = "#ffffff",
        t.border = ".1em solid #000000",
        t.color = "#b50000",
        t.bottom = "0px",
        t.left = "0px",
        t.margin = "0px",
        t.zIndex = "10000",
        t.textAlign = "center",
        e.classList.add("firebase-emulator-warning"),
        document.body.appendChild(e)
    }
    typeof console < "u" && typeof console.info == "function" && console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),
    typeof window < "u" && typeof document < "u" && (document.readyState === "loading" ? window.addEventListener("DOMContentLoaded", n) : n())
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pc {
    constructor(e, t) {
        this.providerId = e,
        this.signInMethod = t
    }
    toJSON() {
        return Te("not implemented")
    }
    _getIdTokenResponse(e) {
        return Te("not implemented")
    }
    _linkToIdToken(e, t) {
        return Te("not implemented")
    }
    _getReauthenticationResolver(e) {
        return Te("not implemented")
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ct(n, e) {
    return nf(n, "POST", "/v1/accounts:signInWithIdp", mc(n, e))
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Rf = "http://localhost";
class ut extends Pc {
    constructor() {
        super(...arguments),
        this.pendingToken = null
    }
    static _fromParams(e) {
        const t = new ut(e.providerId,e.signInMethod);
        return e.idToken || e.accessToken ? (e.idToken && (t.idToken = e.idToken),
        e.accessToken && (t.accessToken = e.accessToken),
        e.nonce && !e.pendingToken && (t.nonce = e.nonce),
        e.pendingToken && (t.pendingToken = e.pendingToken)) : e.oauthToken && e.oauthTokenSecret ? (t.accessToken = e.oauthToken,
        t.secret = e.oauthTokenSecret) : ke("argument-error"),
        t
    }
    toJSON() {
        return {
            idToken: this.idToken,
            accessToken: this.accessToken,
            secret: this.secret,
            nonce: this.nonce,
            pendingToken: this.pendingToken,
            providerId: this.providerId,
            signInMethod: this.signInMethod
        }
    }
    static fromJSON(e) {
        const t = typeof e == "string" ? JSON.parse(e) : e
          , {providerId: s, signInMethod: i} = t
          , r = Ir(t, ["providerId", "signInMethod"]);
        if (!s || !i)
            return null;
        const o = new ut(s,i);
        return o.idToken = r.idToken || void 0,
        o.accessToken = r.accessToken || void 0,
        o.secret = r.secret,
        o.nonce = r.nonce,
        o.pendingToken = r.pendingToken || null,
        o
    }
    _getIdTokenResponse(e) {
        const t = this.buildRequest();
        return Ct(e, t)
    }
    _linkToIdToken(e, t) {
        const s = this.buildRequest();
        return s.idToken = t,
        Ct(e, s)
    }
    _getReauthenticationResolver(e) {
        const t = this.buildRequest();
        return t.autoCreate = !1,
        Ct(e, t)
    }
    buildRequest() {
        const e = {
            requestUri: Rf,
            returnSecureToken: !0
        };
        if (this.pendingToken)
            e.pendingToken = this.pendingToken;
        else {
            const t = {};
            this.idToken && (t.id_token = this.idToken),
            this.accessToken && (t.access_token = this.accessToken),
            this.secret && (t.oauth_token_secret = this.secret),
            t.providerId = this.providerId,
            this.nonce && !this.pendingToken && (t.nonce = this.nonce),
            e.postBody = Nn(t)
        }
        return e
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Mc {
    constructor(e) {
        this.providerId = e,
        this.defaultLanguageCode = null,
        this.customParameters = {}
    }
    setDefaultLanguage(e) {
        this.defaultLanguageCode = e
    }
    setCustomParameters(e) {
        return this.customParameters = e,
        this
    }
    getCustomParameters() {
        return this.customParameters
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pn extends Mc {
    constructor() {
        super(...arguments),
        this.scopes = []
    }
    addScope(e) {
        return this.scopes.includes(e) || this.scopes.push(e),
        this
    }
    getScopes() {
        return [...this.scopes]
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xe extends Pn {
    constructor() {
        super("facebook.com")
    }
    static credential(e) {
        return ut._fromParams({
            providerId: xe.PROVIDER_ID,
            signInMethod: xe.FACEBOOK_SIGN_IN_METHOD,
            accessToken: e
        })
    }
    static credentialFromResult(e) {
        return xe.credentialFromTaggedObject(e)
    }
    static credentialFromError(e) {
        return xe.credentialFromTaggedObject(e.customData || {})
    }
    static credentialFromTaggedObject({_tokenResponse: e}) {
        if (!e || !("oauthAccessToken"in e) || !e.oauthAccessToken)
            return null;
        try {
            return xe.credential(e.oauthAccessToken)
        } catch {
            return null
        }
    }
}
xe.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
xe.PROVIDER_ID = "facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Fe extends Pn {
    constructor() {
        super("google.com"),
        this.addScope("profile")
    }
    static credential(e, t) {
        return ut._fromParams({
            providerId: Fe.PROVIDER_ID,
            signInMethod: Fe.GOOGLE_SIGN_IN_METHOD,
            idToken: e,
            accessToken: t
        })
    }
    static credentialFromResult(e) {
        return Fe.credentialFromTaggedObject(e)
    }
    static credentialFromError(e) {
        return Fe.credentialFromTaggedObject(e.customData || {})
    }
    static credentialFromTaggedObject({_tokenResponse: e}) {
        if (!e)
            return null;
        const {oauthIdToken: t, oauthAccessToken: s} = e;
        if (!t && !s)
            return null;
        try {
            return Fe.credential(t, s)
        } catch {
            return null
        }
    }
}
Fe.GOOGLE_SIGN_IN_METHOD = "google.com";
Fe.PROVIDER_ID = "google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ue extends Pn {
    constructor() {
        super("github.com")
    }
    static credential(e) {
        return ut._fromParams({
            providerId: Ue.PROVIDER_ID,
            signInMethod: Ue.GITHUB_SIGN_IN_METHOD,
            accessToken: e
        })
    }
    static credentialFromResult(e) {
        return Ue.credentialFromTaggedObject(e)
    }
    static credentialFromError(e) {
        return Ue.credentialFromTaggedObject(e.customData || {})
    }
    static credentialFromTaggedObject({_tokenResponse: e}) {
        if (!e || !("oauthAccessToken"in e) || !e.oauthAccessToken)
            return null;
        try {
            return Ue.credential(e.oauthAccessToken)
        } catch {
            return null
        }
    }
}
Ue.GITHUB_SIGN_IN_METHOD = "github.com";
Ue.PROVIDER_ID = "github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ve extends Pn {
    constructor() {
        super("twitter.com")
    }
    static credential(e, t) {
        return ut._fromParams({
            providerId: Ve.PROVIDER_ID,
            signInMethod: Ve.TWITTER_SIGN_IN_METHOD,
            oauthToken: e,
            oauthTokenSecret: t
        })
    }
    static credentialFromResult(e) {
        return Ve.credentialFromTaggedObject(e)
    }
    static credentialFromError(e) {
        return Ve.credentialFromTaggedObject(e.customData || {})
    }
    static credentialFromTaggedObject({_tokenResponse: e}) {
        if (!e)
            return null;
        const {oauthAccessToken: t, oauthTokenSecret: s} = e;
        if (!t || !s)
            return null;
        try {
            return Ve.credential(t, s)
        } catch {
            return null
        }
    }
}
Ve.TWITTER_SIGN_IN_METHOD = "twitter.com";
Ve.PROVIDER_ID = "twitter.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pt {
    constructor(e) {
        this.user = e.user,
        this.providerId = e.providerId,
        this._tokenResponse = e._tokenResponse,
        this.operationType = e.operationType
    }
    static async _fromIdTokenResponse(e, t, s, i=!1) {
        const r = await it._fromIdTokenResponse(e, s, i)
          , o = Ko(s);
        return new Pt({
            user: r,
            providerId: o,
            _tokenResponse: s,
            operationType: t
        })
    }
    static async _forOperation(e, t, s) {
        await e._updateTokensIfNecessary(s, !0);
        const i = Ko(s);
        return new Pt({
            user: e,
            providerId: i,
            _tokenResponse: s,
            operationType: t
        })
    }
}
function Ko(n) {
    return n.providerId ? n.providerId : "phoneNumber"in n ? "phone" : null
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class _s extends Me {
    constructor(e, t, s, i) {
        var r;
        super(t.code, t.message),
        this.operationType = s,
        this.user = i,
        Object.setPrototypeOf(this, _s.prototype),
        this.customData = {
            appName: e.name,
            tenantId: (r = e.tenantId) !== null && r !== void 0 ? r : void 0,
            _serverResponse: t.customData._serverResponse,
            operationType: s
        }
    }
    static _fromErrorAndOperation(e, t, s, i) {
        return new _s(e,t,s,i)
    }
}
function Lc(n, e, t, s) {
    return (e === "reauthenticate" ? t._getReauthenticationResolver(n) : t._getIdTokenResponse(n)).catch(r => {
        throw r.code === "auth/multi-factor-auth-required" ? _s._fromErrorAndOperation(n, r, e, s) : r
    }
    )
}
async function Of(n, e, t=!1) {
    const s = await hn(n, e._linkToIdToken(n.auth, await n.getIdToken()), t);
    return Pt._forOperation(n, "link", s)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Pf(n, e, t=!1) {
    const {auth: s} = n
      , i = "reauthenticate";
    try {
        const r = await hn(n, Lc(s, i, e, n), t);
        A(r.idToken, s, "internal-error");
        const o = Sr(r.idToken);
        A(o, s, "internal-error");
        const {sub: a} = o;
        return A(n.uid === a, s, "user-mismatch"),
        Pt._forOperation(n, i, r)
    } catch (r) {
        throw (r == null ? void 0 : r.code) === "auth/user-not-found" && ke(s, "user-mismatch"),
        r
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Mf(n, e, t=!1) {
    const s = "signIn"
      , i = await Lc(n, s, e)
      , r = await Pt._fromIdTokenResponse(n, s, i);
    return t || await n._updateCurrentUser(r.user),
    r
}
function Lf(n, e, t, s) {
    return ae(n).onIdTokenChanged(e, t, s)
}
function xf(n, e, t) {
    return ae(n).beforeAuthStateChanged(e, t)
}
const Ts = "__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xc {
    constructor(e, t) {
        this.storageRetriever = e,
        this.type = t
    }
    _isAvailable() {
        try {
            return this.storage ? (this.storage.setItem(Ts, "1"),
            this.storage.removeItem(Ts),
            Promise.resolve(!0)) : Promise.resolve(!1)
        } catch {
            return Promise.resolve(!1)
        }
    }
    _set(e, t) {
        return this.storage.setItem(e, JSON.stringify(t)),
        Promise.resolve()
    }
    _get(e) {
        const t = this.storage.getItem(e);
        return Promise.resolve(t ? JSON.parse(t) : null)
    }
    _remove(e) {
        return this.storage.removeItem(e),
        Promise.resolve()
    }
    get storage() {
        return this.storageRetriever()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ff() {
    const n = ie();
    return Ar(n) || Us(n)
}
const Uf = 1e3
  , Vf = 10;
class Fc extends xc {
    constructor() {
        super( () => window.localStorage, "LOCAL"),
        this.boundEventHandler = (e, t) => this.onStorageEvent(e, t),
        this.listeners = {},
        this.localCache = {},
        this.pollTimer = null,
        this.safariLocalStorageNotSynced = Ff() && yf(),
        this.fallbackToPolling = bc(),
        this._shouldAllowMigration = !0
    }
    forAllChangedKeys(e) {
        for (const t of Object.keys(this.listeners)) {
            const s = this.storage.getItem(t)
              , i = this.localCache[t];
            s !== i && e(t, i, s)
        }
    }
    onStorageEvent(e, t=!1) {
        if (!e.key) {
            this.forAllChangedKeys( (o, a, c) => {
                this.notifyListeners(o, c)
            }
            );
            return
        }
        const s = e.key;
        if (t ? this.detachListener() : this.stopPolling(),
        this.safariLocalStorageNotSynced) {
            const o = this.storage.getItem(s);
            if (e.newValue !== o)
                e.newValue !== null ? this.storage.setItem(s, e.newValue) : this.storage.removeItem(s);
            else if (this.localCache[s] === e.newValue && !t)
                return
        }
        const i = () => {
            const o = this.storage.getItem(s);
            !t && this.localCache[s] === o || this.notifyListeners(s, o)
        }
          , r = this.storage.getItem(s);
        mf() && r !== e.newValue && e.newValue !== e.oldValue ? setTimeout(i, Vf) : i()
    }
    notifyListeners(e, t) {
        this.localCache[e] = t;
        const s = this.listeners[e];
        if (s)
            for (const i of Array.from(s))
                i(t && JSON.parse(t))
    }
    startPolling() {
        this.stopPolling(),
        this.pollTimer = setInterval( () => {
            this.forAllChangedKeys( (e, t, s) => {
                this.onStorageEvent(new StorageEvent("storage",{
                    key: e,
                    oldValue: t,
                    newValue: s
                }), !0)
            }
            )
        }
        , Uf)
    }
    stopPolling() {
        this.pollTimer && (clearInterval(this.pollTimer),
        this.pollTimer = null)
    }
    attachListener() {
        window.addEventListener("storage", this.boundEventHandler)
    }
    detachListener() {
        window.removeEventListener("storage", this.boundEventHandler)
    }
    _addListener(e, t) {
        Object.keys(this.listeners).length === 0 && (this.fallbackToPolling ? this.startPolling() : this.attachListener()),
        this.listeners[e] || (this.listeners[e] = new Set,
        this.localCache[e] = this.storage.getItem(e)),
        this.listeners[e].add(t)
    }
    _removeListener(e, t) {
        this.listeners[e] && (this.listeners[e].delete(t),
        this.listeners[e].size === 0 && delete this.listeners[e]),
        Object.keys(this.listeners).length === 0 && (this.detachListener(),
        this.stopPolling())
    }
    async _set(e, t) {
        await super._set(e, t),
        this.localCache[e] = JSON.stringify(t)
    }
    async _get(e) {
        const t = await super._get(e);
        return this.localCache[e] = JSON.stringify(t),
        t
    }
    async _remove(e) {
        await super._remove(e),
        delete this.localCache[e]
    }
}
Fc.type = "LOCAL";
const $f = Fc;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Uc extends xc {
    constructor() {
        super( () => window.sessionStorage, "SESSION")
    }
    _addListener(e, t) {}
    _removeListener(e, t) {}
}
Uc.type = "SESSION";
const Vc = Uc;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Bf(n) {
    return Promise.all(n.map(async e => {
        try {
            return {
                fulfilled: !0,
                value: await e
            }
        } catch (t) {
            return {
                fulfilled: !1,
                reason: t
            }
        }
    }
    ))
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class $s {
    constructor(e) {
        this.eventTarget = e,
        this.handlersMap = {},
        this.boundEventHandler = this.handleEvent.bind(this)
    }
    static _getInstance(e) {
        const t = this.receivers.find(i => i.isListeningto(e));
        if (t)
            return t;
        const s = new $s(e);
        return this.receivers.push(s),
        s
    }
    isListeningto(e) {
        return this.eventTarget === e
    }
    async handleEvent(e) {
        const t = e
          , {eventId: s, eventType: i, data: r} = t.data
          , o = this.handlersMap[i];
        if (!(o != null && o.size))
            return;
        t.ports[0].postMessage({
            status: "ack",
            eventId: s,
            eventType: i
        });
        const a = Array.from(o).map(async u => u(t.origin, r))
          , c = await Bf(a);
        t.ports[0].postMessage({
            status: "done",
            eventId: s,
            eventType: i,
            response: c
        })
    }
    _subscribe(e, t) {
        Object.keys(this.handlersMap).length === 0 && this.eventTarget.addEventListener("message", this.boundEventHandler),
        this.handlersMap[e] || (this.handlersMap[e] = new Set),
        this.handlersMap[e].add(t)
    }
    _unsubscribe(e, t) {
        this.handlersMap[e] && t && this.handlersMap[e].delete(t),
        (!t || this.handlersMap[e].size === 0) && delete this.handlersMap[e],
        Object.keys(this.handlersMap).length === 0 && this.eventTarget.removeEventListener("message", this.boundEventHandler)
    }
}
$s.receivers = [];
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Cr(n="", e=10) {
    let t = "";
    for (let s = 0; s < e; s++)
        t += Math.floor(Math.random() * 10);
    return n + t
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jf {
    constructor(e) {
        this.target = e,
        this.handlers = new Set
    }
    removeMessageHandler(e) {
        e.messageChannel && (e.messageChannel.port1.removeEventListener("message", e.onMessage),
        e.messageChannel.port1.close()),
        this.handlers.delete(e)
    }
    async _send(e, t, s=50) {
        const i = typeof MessageChannel < "u" ? new MessageChannel : null;
        if (!i)
            throw new Error("connection_unavailable");
        let r, o;
        return new Promise( (a, c) => {
            const u = Cr("", 20);
            i.port1.start();
            const l = setTimeout( () => {
                c(new Error("unsupported_event"))
            }
            , s);
            o = {
                messageChannel: i,
                onMessage(h) {
                    const f = h;
                    if (f.data.eventId === u)
                        switch (f.data.status) {
                        case "ack":
                            clearTimeout(l),
                            r = setTimeout( () => {
                                c(new Error("timeout"))
                            }
                            , 3e3);
                            break;
                        case "done":
                            clearTimeout(r),
                            a(f.data.response);
                            break;
                        default:
                            clearTimeout(l),
                            clearTimeout(r),
                            c(new Error("invalid_response"));
                            break
                        }
                }
            },
            this.handlers.add(o),
            i.port1.addEventListener("message", o.onMessage),
            this.target.postMessage({
                eventType: e,
                eventId: u,
                data: t
            }, [i.port2])
        }
        ).finally( () => {
            o && this.removeMessageHandler(o)
        }
        )
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Ee() {
    return window
}
function qf(n) {
    Ee().location.href = n
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function $c() {
    return typeof Ee().WorkerGlobalScope < "u" && typeof Ee().importScripts == "function"
}
async function zf() {
    if (!(navigator != null && navigator.serviceWorker))
        return null;
    try {
        return (await navigator.serviceWorker.ready).active
    } catch {
        return null
    }
}
function Hf() {
    var n;
    return ((n = navigator == null ? void 0 : navigator.serviceWorker) === null || n === void 0 ? void 0 : n.controller) || null
}
function Kf() {
    return $c() ? self : null
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Bc = "firebaseLocalStorageDb"
  , Gf = 1
  , Ss = "firebaseLocalStorage"
  , jc = "fbase_key";
class Mn {
    constructor(e) {
        this.request = e
    }
    toPromise() {
        return new Promise( (e, t) => {
            this.request.addEventListener("success", () => {
                e(this.request.result)
            }
            ),
            this.request.addEventListener("error", () => {
                t(this.request.error)
            }
            )
        }
        )
    }
}
function Bs(n, e) {
    return n.transaction([Ss], e ? "readwrite" : "readonly").objectStore(Ss)
}
function Wf() {
    const n = indexedDB.deleteDatabase(Bc);
    return new Mn(n).toPromise()
}
function zi() {
    const n = indexedDB.open(Bc, Gf);
    return new Promise( (e, t) => {
        n.addEventListener("error", () => {
            t(n.error)
        }
        ),
        n.addEventListener("upgradeneeded", () => {
            const s = n.result;
            try {
                s.createObjectStore(Ss, {
                    keyPath: jc
                })
            } catch (i) {
                t(i)
            }
        }
        ),
        n.addEventListener("success", async () => {
            const s = n.result;
            s.objectStoreNames.contains(Ss) ? e(s) : (s.close(),
            await Wf(),
            e(await zi()))
        }
        )
    }
    )
}
async function Go(n, e, t) {
    const s = Bs(n, !0).put({
        [jc]: e,
        value: t
    });
    return new Mn(s).toPromise()
}
async function Qf(n, e) {
    const t = Bs(n, !1).get(e)
      , s = await new Mn(t).toPromise();
    return s === void 0 ? null : s.value
}
function Wo(n, e) {
    const t = Bs(n, !0).delete(e);
    return new Mn(t).toPromise()
}
const Yf = 800
  , Jf = 3;
class qc {
    constructor() {
        this.type = "LOCAL",
        this._shouldAllowMigration = !0,
        this.listeners = {},
        this.localCache = {},
        this.pollTimer = null,
        this.pendingWrites = 0,
        this.receiver = null,
        this.sender = null,
        this.serviceWorkerReceiverAvailable = !1,
        this.activeServiceWorker = null,
        this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then( () => {}
        , () => {}
        )
    }
    async _openDb() {
        return this.db ? this.db : (this.db = await zi(),
        this.db)
    }
    async _withRetries(e) {
        let t = 0;
        for (; ; )
            try {
                const s = await this._openDb();
                return await e(s)
            } catch (s) {
                if (t++ > Jf)
                    throw s;
                this.db && (this.db.close(),
                this.db = void 0)
            }
    }
    async initializeServiceWorkerMessaging() {
        return $c() ? this.initializeReceiver() : this.initializeSender()
    }
    async initializeReceiver() {
        this.receiver = $s._getInstance(Kf()),
        this.receiver._subscribe("keyChanged", async (e, t) => ({
            keyProcessed: (await this._poll()).includes(t.key)
        })),
        this.receiver._subscribe("ping", async (e, t) => ["keyChanged"])
    }
    async initializeSender() {
        var e, t;
        if (this.activeServiceWorker = await zf(),
        !this.activeServiceWorker)
            return;
        this.sender = new jf(this.activeServiceWorker);
        const s = await this.sender._send("ping", {}, 800);
        s && !((e = s[0]) === null || e === void 0) && e.fulfilled && !((t = s[0]) === null || t === void 0) && t.value.includes("keyChanged") && (this.serviceWorkerReceiverAvailable = !0)
    }
    async notifyServiceWorker(e) {
        if (!(!this.sender || !this.activeServiceWorker || Hf() !== this.activeServiceWorker))
            try {
                await this.sender._send("keyChanged", {
                    key: e
                }, this.serviceWorkerReceiverAvailable ? 800 : 50)
            } catch {}
    }
    async _isAvailable() {
        try {
            if (!indexedDB)
                return !1;
            const e = await zi();
            return await Go(e, Ts, "1"),
            await Wo(e, Ts),
            !0
        } catch {}
        return !1
    }
    async _withPendingWrite(e) {
        this.pendingWrites++;
        try {
            await e()
        } finally {
            this.pendingWrites--
        }
    }
    async _set(e, t) {
        return this._withPendingWrite(async () => (await this._withRetries(s => Go(s, e, t)),
        this.localCache[e] = t,
        this.notifyServiceWorker(e)))
    }
    async _get(e) {
        const t = await this._withRetries(s => Qf(s, e));
        return this.localCache[e] = t,
        t
    }
    async _remove(e) {
        return this._withPendingWrite(async () => (await this._withRetries(t => Wo(t, e)),
        delete this.localCache[e],
        this.notifyServiceWorker(e)))
    }
    async _poll() {
        const e = await this._withRetries(i => {
            const r = Bs(i, !1).getAll();
            return new Mn(r).toPromise()
        }
        );
        if (!e)
            return [];
        if (this.pendingWrites !== 0)
            return [];
        const t = []
          , s = new Set;
        for (const {fbase_key: i, value: r} of e)
            s.add(i),
            JSON.stringify(this.localCache[i]) !== JSON.stringify(r) && (this.notifyListeners(i, r),
            t.push(i));
        for (const i of Object.keys(this.localCache))
            this.localCache[i] && !s.has(i) && (this.notifyListeners(i, null),
            t.push(i));
        return t
    }
    notifyListeners(e, t) {
        this.localCache[e] = t;
        const s = this.listeners[e];
        if (s)
            for (const i of Array.from(s))
                i(t)
    }
    startPolling() {
        this.stopPolling(),
        this.pollTimer = setInterval(async () => this._poll(), Yf)
    }
    stopPolling() {
        this.pollTimer && (clearInterval(this.pollTimer),
        this.pollTimer = null)
    }
    _addListener(e, t) {
        Object.keys(this.listeners).length === 0 && this.startPolling(),
        this.listeners[e] || (this.listeners[e] = new Set,
        this._get(e)),
        this.listeners[e].add(t)
    }
    _removeListener(e, t) {
        this.listeners[e] && (this.listeners[e].delete(t),
        this.listeners[e].size === 0 && delete this.listeners[e]),
        Object.keys(this.listeners).length === 0 && this.stopPolling()
    }
}
qc.type = "LOCAL";
const Xf = qc;
new Rn(3e4,6e4);
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Zf(n, e) {
    return e ? Se(e) : (A(n._popupRedirectResolver, n, "argument-error"),
    n._popupRedirectResolver)
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class br extends Pc {
    constructor(e) {
        super("custom", "custom"),
        this.params = e
    }
    _getIdTokenResponse(e) {
        return Ct(e, this._buildIdpRequest())
    }
    _linkToIdToken(e, t) {
        return Ct(e, this._buildIdpRequest(t))
    }
    _getReauthenticationResolver(e) {
        return Ct(e, this._buildIdpRequest())
    }
    _buildIdpRequest(e) {
        const t = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: !0,
            returnIdpCredential: !0
        };
        return e && (t.idToken = e),
        t
    }
}
function ep(n) {
    return Mf(n.auth, new br(n), n.bypassAuthState)
}
function tp(n) {
    const {auth: e, user: t} = n;
    return A(t, e, "internal-error"),
    Pf(t, new br(n), n.bypassAuthState)
}
async function np(n) {
    const {auth: e, user: t} = n;
    return A(t, e, "internal-error"),
    Of(t, new br(n), n.bypassAuthState)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class zc {
    constructor(e, t, s, i, r=!1) {
        this.auth = e,
        this.resolver = s,
        this.user = i,
        this.bypassAuthState = r,
        this.pendingPromise = null,
        this.eventManager = null,
        this.filter = Array.isArray(t) ? t : [t]
    }
    execute() {
        return new Promise(async (e, t) => {
            this.pendingPromise = {
                resolve: e,
                reject: t
            };
            try {
                this.eventManager = await this.resolver._initialize(this.auth),
                await this.onExecution(),
                this.eventManager.registerConsumer(this)
            } catch (s) {
                this.reject(s)
            }
        }
        )
    }
    async onAuthEvent(e) {
        const {urlResponse: t, sessionId: s, postBody: i, tenantId: r, error: o, type: a} = e;
        if (o) {
            this.reject(o);
            return
        }
        const c = {
            auth: this.auth,
            requestUri: t,
            sessionId: s,
            tenantId: r || void 0,
            postBody: i || void 0,
            user: this.user,
            bypassAuthState: this.bypassAuthState
        };
        try {
            this.resolve(await this.getIdpTask(a)(c))
        } catch (u) {
            this.reject(u)
        }
    }
    onError(e) {
        this.reject(e)
    }
    getIdpTask(e) {
        switch (e) {
        case "signInViaPopup":
        case "signInViaRedirect":
            return ep;
        case "linkViaPopup":
        case "linkViaRedirect":
            return np;
        case "reauthViaPopup":
        case "reauthViaRedirect":
            return tp;
        default:
            ke(this.auth, "internal-error")
        }
    }
    resolve(e) {
        De(this.pendingPromise, "Pending promise was never set"),
        this.pendingPromise.resolve(e),
        this.unregisterAndCleanUp()
    }
    reject(e) {
        De(this.pendingPromise, "Pending promise was never set"),
        this.pendingPromise.reject(e),
        this.unregisterAndCleanUp()
    }
    unregisterAndCleanUp() {
        this.eventManager && this.eventManager.unregisterConsumer(this),
        this.pendingPromise = null,
        this.cleanUp()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const sp = new Rn(2e3,1e4);
class _t extends zc {
    constructor(e, t, s, i, r) {
        super(e, t, i, r),
        this.provider = s,
        this.authWindow = null,
        this.pollId = null,
        _t.currentPopupAction && _t.currentPopupAction.cancel(),
        _t.currentPopupAction = this
    }
    async executeNotNull() {
        const e = await this.execute();
        return A(e, this.auth, "internal-error"),
        e
    }
    async onExecution() {
        De(this.filter.length === 1, "Popup operations only handle one event");
        const e = Cr();
        this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], e),
        this.authWindow.associatedEvent = e,
        this.resolver._originValidation(this.auth).catch(t => {
            this.reject(t)
        }
        ),
        this.resolver._isIframeWebStorageSupported(this.auth, t => {
            t || this.reject(we(this.auth, "web-storage-unsupported"))
        }
        ),
        this.pollUserCancellation()
    }
    get eventId() {
        var e;
        return ((e = this.authWindow) === null || e === void 0 ? void 0 : e.associatedEvent) || null
    }
    cancel() {
        this.reject(we(this.auth, "cancelled-popup-request"))
    }
    cleanUp() {
        this.authWindow && this.authWindow.close(),
        this.pollId && window.clearTimeout(this.pollId),
        this.authWindow = null,
        this.pollId = null,
        _t.currentPopupAction = null
    }
    pollUserCancellation() {
        const e = () => {
            var t, s;
            if (!((s = (t = this.authWindow) === null || t === void 0 ? void 0 : t.window) === null || s === void 0) && s.closed) {
                this.pollId = window.setTimeout( () => {
                    this.pollId = null,
                    this.reject(we(this.auth, "popup-closed-by-user"))
                }
                , 8e3);
                return
            }
            this.pollId = window.setTimeout(e, sp.get())
        }
        ;
        e()
    }
}
_t.currentPopupAction = null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ip = "pendingRedirect"
  , hs = new Map;
class rp extends zc {
    constructor(e, t, s=!1) {
        super(e, ["signInViaRedirect", "linkViaRedirect", "reauthViaRedirect", "unknown"], t, void 0, s),
        this.eventId = null
    }
    async execute() {
        let e = hs.get(this.auth._key());
        if (!e) {
            try {
                const s = await op(this.resolver, this.auth) ? await super.execute() : null;
                e = () => Promise.resolve(s)
            } catch (t) {
                e = () => Promise.reject(t)
            }
            hs.set(this.auth._key(), e)
        }
        return this.bypassAuthState || hs.set(this.auth._key(), () => Promise.resolve(null)),
        e()
    }
    async onAuthEvent(e) {
        if (e.type === "signInViaRedirect")
            return super.onAuthEvent(e);
        if (e.type === "unknown") {
            this.resolve(null);
            return
        }
        if (e.eventId) {
            const t = await this.auth._redirectUserForId(e.eventId);
            if (t)
                return this.user = t,
                super.onAuthEvent(e);
            this.resolve(null)
        }
    }
    async onExecution() {}
    cleanUp() {}
}
async function op(n, e) {
    const t = up(e)
      , s = cp(n);
    if (!await s._isAvailable())
        return !1;
    const i = await s._get(t) === "true";
    return await s._remove(t),
    i
}
function ap(n, e) {
    hs.set(n._key(), e)
}
function cp(n) {
    return Se(n._redirectPersistence)
}
function up(n) {
    return ls(ip, n.config.apiKey, n.name)
}
async function lp(n, e, t=!1) {
    const s = Vs(n)
      , i = Zf(s, e)
      , o = await new rp(s,i,t).execute();
    return o && !t && (delete o.user._redirectEventId,
    await s._persistUserIfCurrent(o.user),
    await s._setRedirectUser(null, e)),
    o
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const hp = 10 * 60 * 1e3;
class dp {
    constructor(e) {
        this.auth = e,
        this.cachedEventUids = new Set,
        this.consumers = new Set,
        this.queuedRedirectEvent = null,
        this.hasHandledPotentialRedirect = !1,
        this.lastProcessedEventTime = Date.now()
    }
    registerConsumer(e) {
        this.consumers.add(e),
        this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, e) && (this.sendToConsumer(this.queuedRedirectEvent, e),
        this.saveEventToCache(this.queuedRedirectEvent),
        this.queuedRedirectEvent = null)
    }
    unregisterConsumer(e) {
        this.consumers.delete(e)
    }
    onEvent(e) {
        if (this.hasEventBeenHandled(e))
            return !1;
        let t = !1;
        return this.consumers.forEach(s => {
            this.isEventForConsumer(e, s) && (t = !0,
            this.sendToConsumer(e, s),
            this.saveEventToCache(e))
        }
        ),
        this.hasHandledPotentialRedirect || !fp(e) || (this.hasHandledPotentialRedirect = !0,
        t || (this.queuedRedirectEvent = e,
        t = !0)),
        t
    }
    sendToConsumer(e, t) {
        var s;
        if (e.error && !Hc(e)) {
            const i = ((s = e.error.code) === null || s === void 0 ? void 0 : s.split("auth/")[1]) || "internal-error";
            t.onError(we(this.auth, i))
        } else
            t.onAuthEvent(e)
    }
    isEventForConsumer(e, t) {
        const s = t.eventId === null || !!e.eventId && e.eventId === t.eventId;
        return t.filter.includes(e.type) && s
    }
    hasEventBeenHandled(e) {
        return Date.now() - this.lastProcessedEventTime >= hp && this.cachedEventUids.clear(),
        this.cachedEventUids.has(Qo(e))
    }
    saveEventToCache(e) {
        this.cachedEventUids.add(Qo(e)),
        this.lastProcessedEventTime = Date.now()
    }
}
function Qo(n) {
    return [n.type, n.eventId, n.sessionId, n.tenantId].filter(e => e).join("-")
}
function Hc({type: n, error: e}) {
    return n === "unknown" && (e == null ? void 0 : e.code) === "auth/no-auth-event"
}
function fp(n) {
    switch (n.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
        return !0;
    case "unknown":
        return Hc(n);
    default:
        return !1
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function pp(n, e={}) {
    return On(n, "GET", "/v1/projects", e)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const gp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
  , mp = /^https?/;
async function yp(n) {
    if (n.config.emulator)
        return;
    const {authorizedDomains: e} = await pp(n);
    for (const t of e)
        try {
            if (vp(t))
                return
        } catch {}
    ke(n, "unauthorized-domain")
}
function vp(n) {
    const e = qi()
      , {protocol: t, hostname: s} = new URL(e);
    if (n.startsWith("chrome-extension://")) {
        const o = new URL(n);
        return o.hostname === "" && s === "" ? t === "chrome-extension:" && n.replace("chrome-extension://", "") === e.replace("chrome-extension://", "") : t === "chrome-extension:" && o.hostname === s
    }
    if (!mp.test(t))
        return !1;
    if (gp.test(n))
        return s === n;
    const i = n.replace(/\./g, "\\.");
    return new RegExp("^(.+\\." + i + "|" + i + ")$","i").test(s)
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const wp = new Rn(3e4,6e4);
function Yo() {
    const n = Ee().___jsl;
    if (n != null && n.H) {
        for (const e of Object.keys(n.H))
            if (n.H[e].r = n.H[e].r || [],
            n.H[e].L = n.H[e].L || [],
            n.H[e].r = [...n.H[e].L],
            n.CP)
                for (let t = 0; t < n.CP.length; t++)
                    n.CP[t] = null
    }
}
function Ep(n) {
    return new Promise( (e, t) => {
        var s, i, r;
        function o() {
            Yo(),
            gapi.load("gapi.iframes", {
                callback: () => {
                    e(gapi.iframes.getContext())
                }
                ,
                ontimeout: () => {
                    Yo(),
                    t(we(n, "network-request-failed"))
                }
                ,
                timeout: wp.get()
            })
        }
        if (!((i = (s = Ee().gapi) === null || s === void 0 ? void 0 : s.iframes) === null || i === void 0) && i.Iframe)
            e(gapi.iframes.getContext());
        else if (!((r = Ee().gapi) === null || r === void 0) && r.load)
            o();
        else {
            const a = wf("iframefcb");
            return Ee()[a] = () => {
                gapi.load ? o() : t(we(n, "network-request-failed"))
            }
            ,
            Rc(`https://apis.google.com/js/api.js?onload=${a}`).catch(c => t(c))
        }
    }
    ).catch(e => {
        throw ds = null,
        e
    }
    )
}
let ds = null;
function Ip(n) {
    return ds = ds || Ep(n),
    ds
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _p = new Rn(5e3,15e3)
  , Tp = "__/auth/iframe"
  , Sp = "emulator/auth/iframe"
  , Ap = {
    style: {
        position: "absolute",
        top: "-100px",
        width: "1px",
        height: "1px"
    },
    "aria-hidden": "true",
    tabindex: "-1"
}
  , Cp = new Map([["identitytoolkit.googleapis.com", "p"], ["staging-identitytoolkit.sandbox.googleapis.com", "s"], ["test-identitytoolkit.sandbox.googleapis.com", "t"]]);
function bp(n) {
    const e = n.config;
    A(e.authDomain, n, "auth-domain-config-required");
    const t = e.emulator ? Tr(e, Sp) : `https://${n.config.authDomain}/${Tp}`
      , s = {
        apiKey: e.apiKey,
        appName: n.name,
        v: jt
    }
      , i = Cp.get(n.config.apiHost);
    i && (s.eid = i);
    const r = n._getFrameworks();
    return r.length && (s.fw = r.join(",")),
    `${t}?${Nn(s).slice(1)}`
}
async function kp(n) {
    const e = await Ip(n)
      , t = Ee().gapi;
    return A(t, n, "internal-error"),
    e.open({
        where: document.body,
        url: bp(n),
        messageHandlersFilter: t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: Ap,
        dontclear: !0
    }, s => new Promise(async (i, r) => {
        await s.restyle({
            setHideOnLeave: !1
        });
        const o = we(n, "network-request-failed")
          , a = Ee().setTimeout( () => {
            r(o)
        }
        , _p.get());
        function c() {
            Ee().clearTimeout(a),
            i(s)
        }
        s.ping(c).then(c, () => {
            r(o)
        }
        )
    }
    ))
}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Dp = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no"
}
  , Np = 500
  , Rp = 600
  , Op = "_blank"
  , Pp = "http://localhost";
class Jo {
    constructor(e) {
        this.window = e,
        this.associatedEvent = null
    }
    close() {
        if (this.window)
            try {
                this.window.close()
            } catch {}
    }
}
function Mp(n, e, t, s=Np, i=Rp) {
    const r = Math.max((window.screen.availHeight - i) / 2, 0).toString()
      , o = Math.max((window.screen.availWidth - s) / 2, 0).toString();
    let a = "";
    const c = Object.assign(Object.assign({}, Dp), {
        width: s.toString(),
        height: i.toString(),
        top: r,
        left: o
    })
      , u = ie().toLowerCase();
    t && (a = _c(u) ? Op : t),
    Ic(u) && (e = e || Pp,
    c.scrollbars = "yes");
    const l = Object.entries(c).reduce( (f, [g,E]) => `${f}${g}=${E},`, "");
    if (gf(u) && a !== "_self")
        return Lp(e || "", a),
        new Jo(null);
    const h = window.open(e || "", a, l);
    A(h, n, "popup-blocked");
    try {
        h.focus()
    } catch {}
    return new Jo(h)
}
function Lp(n, e) {
    const t = document.createElement("a");
    t.href = n,
    t.target = e;
    const s = document.createEvent("MouseEvent");
    s.initMouseEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 1, null),
    t.dispatchEvent(s)
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const xp = "__/auth/handler"
  , Fp = "emulator/auth/handler"
  , Up = encodeURIComponent("fac");
async function Xo(n, e, t, s, i, r) {
    A(n.config.authDomain, n, "auth-domain-config-required"),
    A(n.config.apiKey, n, "invalid-api-key");
    const o = {
        apiKey: n.config.apiKey,
        appName: n.name,
        authType: t,
        redirectUrl: s,
        v: jt,
        eventId: i
    };
    if (e instanceof Mc) {
        e.setDefaultLanguage(n.languageCode),
        o.providerId = e.providerId || "",
        Fh(e.getCustomParameters()) || (o.customParameters = JSON.stringify(e.getCustomParameters()));
        for (const [l,h] of Object.entries(r || {}))
            o[l] = h
    }
    if (e instanceof Pn) {
        const l = e.getScopes().filter(h => h !== "");
        l.length > 0 && (o.scopes = l.join(","))
    }
    n.tenantId && (o.tid = n.tenantId);
    const a = o;
    for (const l of Object.keys(a))
        a[l] === void 0 && delete a[l];
    const c = await n._getAppCheckToken()
      , u = c ? `#${Up}=${encodeURIComponent(c)}` : "";
    return `${Vp(n)}?${Nn(a).slice(1)}${u}`
}
function Vp({config: n}) {
    return n.emulator ? Tr(n, Fp) : `https://${n.authDomain}/${xp}`
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ai = "webStorageSupport";
class $p {
    constructor() {
        this.eventManagers = {},
        this.iframes = {},
        this.originValidationPromises = {},
        this._redirectPersistence = Vc,
        this._completeRedirectFn = lp,
        this._overrideRedirectResult = ap
    }
    async _openPopup(e, t, s, i) {
        var r;
        De((r = this.eventManagers[e._key()]) === null || r === void 0 ? void 0 : r.manager, "_initialize() not called before _openPopup()");
        const o = await Xo(e, t, s, qi(), i);
        return Mp(e, o, Cr())
    }
    async _openRedirect(e, t, s, i) {
        await this._originValidation(e);
        const r = await Xo(e, t, s, qi(), i);
        return qf(r),
        new Promise( () => {}
        )
    }
    _initialize(e) {
        const t = e._key();
        if (this.eventManagers[t]) {
            const {manager: i, promise: r} = this.eventManagers[t];
            return i ? Promise.resolve(i) : (De(r, "If manager is not set, promise should be"),
            r)
        }
        const s = this.initAndGetManager(e);
        return this.eventManagers[t] = {
            promise: s
        },
        s.catch( () => {
            delete this.eventManagers[t]
        }
        ),
        s
    }
    async initAndGetManager(e) {
        const t = await kp(e)
          , s = new dp(e);
        return t.register("authEvent", i => (A(i == null ? void 0 : i.authEvent, e, "invalid-auth-event"),
        {
            status: s.onEvent(i.authEvent) ? "ACK" : "ERROR"
        }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),
        this.eventManagers[e._key()] = {
            manager: s
        },
        this.iframes[e._key()] = t,
        s
    }
    _isIframeWebStorageSupported(e, t) {
        this.iframes[e._key()].send(Ai, {
            type: Ai
        }, i => {
            var r;
            const o = (r = i == null ? void 0 : i[0]) === null || r === void 0 ? void 0 : r[Ai];
            o !== void 0 && t(!!o),
            ke(e, "internal-error")
        }
        , gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)
    }
    _originValidation(e) {
        const t = e._key();
        return this.originValidationPromises[t] || (this.originValidationPromises[t] = yp(e)),
        this.originValidationPromises[t]
    }
    get _shouldInitProactively() {
        return bc() || Ar() || Us()
    }
}
const Bp = $p;
var Zo = "@firebase/auth"
  , ea = "0.23.2";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jp {
    constructor(e) {
        this.auth = e,
        this.internalListeners = new Map
    }
    getUid() {
        var e;
        return this.assertAuthConfigured(),
        ((e = this.auth.currentUser) === null || e === void 0 ? void 0 : e.uid) || null
    }
    async getToken(e) {
        return this.assertAuthConfigured(),
        await this.auth._initializationPromise,
        this.auth.currentUser ? {
            accessToken: await this.auth.currentUser.getIdToken(e)
        } : null
    }
    addAuthTokenListener(e) {
        if (this.assertAuthConfigured(),
        this.internalListeners.has(e))
            return;
        const t = this.auth.onIdTokenChanged(s => {
            e((s == null ? void 0 : s.stsTokenManager.accessToken) || null)
        }
        );
        this.internalListeners.set(e, t),
        this.updateProactiveRefresh()
    }
    removeAuthTokenListener(e) {
        this.assertAuthConfigured();
        const t = this.internalListeners.get(e);
        t && (this.internalListeners.delete(e),
        t(),
        this.updateProactiveRefresh())
    }
    assertAuthConfigured() {
        A(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth")
    }
    updateProactiveRefresh() {
        this.internalListeners.size > 0 ? this.auth._startProactiveRefresh() : this.auth._stopProactiveRefresh()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qp(n) {
    switch (n) {
    case "Node":
        return "node";
    case "ReactNative":
        return "rn";
    case "Worker":
        return "webworker";
    case "Cordova":
        return "cordova";
    default:
        return
    }
}
function zp(n) {
    Ot(new at("auth", (e, {options: t}) => {
        const s = e.getProvider("app").getImmediate()
          , i = e.getProvider("heartbeat")
          , r = e.getProvider("app-check-internal")
          , {apiKey: o, authDomain: a} = s.options;
        A(o && !o.includes(":"), "invalid-api-key", {
            appName: s.name
        });
        const c = {
            apiKey: o,
            authDomain: a,
            clientPlatform: n,
            apiHost: "identitytoolkit.googleapis.com",
            tokenApiHost: "securetoken.googleapis.com",
            apiScheme: "https",
            sdkClientVersion: kc(n)
        }
          , u = new Af(s,i,r,c);
        return bf(u, t),
        u
    }
    ,"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback( (e, t, s) => {
        e.getProvider("auth-internal").initialize()
    }
    )),
    Ot(new at("auth-internal",e => {
        const t = Vs(e.getProvider("auth").getImmediate());
        return (s => new jp(s))(t)
    }
    ,"PRIVATE").setInstantiationMode("EXPLICIT")),
    qe(Zo, ea, qp(n)),
    qe(Zo, ea, "esm2017")
}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Hp = 5 * 60
  , Kp = oc("authIdTokenMaxAge") || Hp;
let ta = null;
const Gp = n => async e => {
    const t = e && await e.getIdTokenResult()
      , s = t && (new Date().getTime() - Date.parse(t.issuedAtTime)) / 1e3;
    if (s && s > Kp)
        return;
    const i = t == null ? void 0 : t.token;
    ta !== i && (ta = i,
    await fetch(n, {
        method: i ? "POST" : "DELETE",
        headers: i ? {
            Authorization: `Bearer ${i}`
        } : {}
    }))
}
;
function Wp(n=lc()) {
    const e = Er(n, "auth");
    if (e.isInitialized())
        return e.getImmediate();
    const t = Cf(n, {
        popupRedirectResolver: Bp,
        persistence: [Xf, $f, Vc]
    })
      , s = oc("authTokenSyncURL");
    if (s) {
        const r = Gp(s);
        xf(t, r, () => r(t.currentUser)),
        Lf(t, o => r(o))
    }
    const i = ic("auth");
    return i && kf(t, `http://${i}`),
    t
}
zp("Browser");
var Qp = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, m, kr = kr || {}, T = Qp || self;
function js(n) {
    var e = typeof n;
    return e = e != "object" ? e : n ? Array.isArray(n) ? "array" : e : "null",
    e == "array" || e == "object" && typeof n.length == "number"
}
function Ln(n) {
    var e = typeof n;
    return e == "object" && n != null || e == "function"
}
function Yp(n) {
    return Object.prototype.hasOwnProperty.call(n, Ci) && n[Ci] || (n[Ci] = ++Jp)
}
var Ci = "closure_uid_" + (1e9 * Math.random() >>> 0)
  , Jp = 0;
function Xp(n, e, t) {
    return n.call.apply(n.bind, arguments)
}
function Zp(n, e, t) {
    if (!n)
        throw Error();
    if (2 < arguments.length) {
        var s = Array.prototype.slice.call(arguments, 2);
        return function() {
            var i = Array.prototype.slice.call(arguments);
            return Array.prototype.unshift.apply(i, s),
            n.apply(e, i)
        }
    }
    return function() {
        return n.apply(e, arguments)
    }
}
function te(n, e, t) {
    return Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? te = Xp : te = Zp,
    te.apply(null, arguments)
}
function es(n, e) {
    var t = Array.prototype.slice.call(arguments, 1);
    return function() {
        var s = t.slice();
        return s.push.apply(s, arguments),
        n.apply(this, s)
    }
}
function G(n, e) {
    function t() {}
    t.prototype = e.prototype,
    n.$ = e.prototype,
    n.prototype = new t,
    n.prototype.constructor = n,
    n.ac = function(s, i, r) {
        for (var o = Array(arguments.length - 2), a = 2; a < arguments.length; a++)
            o[a - 2] = arguments[a];
        return e.prototype[i].apply(s, o)
    }
}
function Qe() {
    this.s = this.s,
    this.o = this.o
}
var eg = 0;
Qe.prototype.s = !1;
Qe.prototype.sa = function() {
    !this.s && (this.s = !0,
    this.N(),
    eg != 0) && Yp(this)
}
;
Qe.prototype.N = function() {
    if (this.o)
        for (; this.o.length; )
            this.o.shift()()
}
;
const Kc = Array.prototype.indexOf ? function(n, e) {
    return Array.prototype.indexOf.call(n, e, void 0)
}
: function(n, e) {
    if (typeof n == "string")
        return typeof e != "string" || e.length != 1 ? -1 : n.indexOf(e, 0);
    for (let t = 0; t < n.length; t++)
        if (t in n && n[t] === e)
            return t;
    return -1
}
;
function Dr(n) {
    const e = n.length;
    if (0 < e) {
        const t = Array(e);
        for (let s = 0; s < e; s++)
            t[s] = n[s];
        return t
    }
    return []
}
function na(n, e) {
    for (let t = 1; t < arguments.length; t++) {
        const s = arguments[t];
        if (js(s)) {
            const i = n.length || 0
              , r = s.length || 0;
            n.length = i + r;
            for (let o = 0; o < r; o++)
                n[i + o] = s[o]
        } else
            n.push(s)
    }
}
function ne(n, e) {
    this.type = n,
    this.g = this.target = e,
    this.defaultPrevented = !1
}
ne.prototype.h = function() {
    this.defaultPrevented = !0
}
;
var tg = function() {
    if (!T.addEventListener || !Object.defineProperty)
        return !1;
    var n = !1
      , e = Object.defineProperty({}, "passive", {
        get: function() {
            n = !0
        }
    });
    try {
        T.addEventListener("test", () => {}
        , e),
        T.removeEventListener("test", () => {}
        , e)
    } catch {}
    return n
}();
function fn(n) {
    return /^[\s\xa0]*$/.test(n)
}
function qs() {
    var n = T.navigator;
    return n && (n = n.userAgent) ? n : ""
}
function me(n) {
    return qs().indexOf(n) != -1
}
function Nr(n) {
    return Nr[" "](n),
    n
}
Nr[" "] = function() {}
;
function ng(n, e) {
    var t = Wg;
    return Object.prototype.hasOwnProperty.call(t, n) ? t[n] : t[n] = e(n)
}
var sg = me("Opera")
  , Mt = me("Trident") || me("MSIE")
  , Gc = me("Edge")
  , Hi = Gc || Mt
  , Wc = me("Gecko") && !(qs().toLowerCase().indexOf("webkit") != -1 && !me("Edge")) && !(me("Trident") || me("MSIE")) && !me("Edge")
  , ig = qs().toLowerCase().indexOf("webkit") != -1 && !me("Edge");
function Qc() {
    var n = T.document;
    return n ? n.documentMode : void 0
}
var Ki;
e: {
    var bi = ""
      , ki = function() {
        var n = qs();
        if (Wc)
            return /rv:([^\);]+)(\)|;)/.exec(n);
        if (Gc)
            return /Edge\/([\d\.]+)/.exec(n);
        if (Mt)
            return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(n);
        if (ig)
            return /WebKit\/(\S+)/.exec(n);
        if (sg)
            return /(?:Version)[ \/]?(\S+)/.exec(n)
    }();
    if (ki && (bi = ki ? ki[1] : ""),
    Mt) {
        var Di = Qc();
        if (Di != null && Di > parseFloat(bi)) {
            Ki = String(Di);
            break e
        }
    }
    Ki = bi
}
var Gi;
if (T.document && Mt) {
    var sa = Qc();
    Gi = sa || parseInt(Ki, 10) || void 0
} else
    Gi = void 0;
var rg = Gi;
function pn(n, e) {
    if (ne.call(this, n ? n.type : ""),
    this.relatedTarget = this.g = this.target = null,
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0,
    this.key = "",
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1,
    this.state = null,
    this.pointerId = 0,
    this.pointerType = "",
    this.i = null,
    n) {
        var t = this.type = n.type
          , s = n.changedTouches && n.changedTouches.length ? n.changedTouches[0] : null;
        if (this.target = n.target || n.srcElement,
        this.g = e,
        e = n.relatedTarget) {
            if (Wc) {
                e: {
                    try {
                        Nr(e.nodeName);
                        var i = !0;
                        break e
                    } catch {}
                    i = !1
                }
                i || (e = null)
            }
        } else
            t == "mouseover" ? e = n.fromElement : t == "mouseout" && (e = n.toElement);
        this.relatedTarget = e,
        s ? (this.clientX = s.clientX !== void 0 ? s.clientX : s.pageX,
        this.clientY = s.clientY !== void 0 ? s.clientY : s.pageY,
        this.screenX = s.screenX || 0,
        this.screenY = s.screenY || 0) : (this.clientX = n.clientX !== void 0 ? n.clientX : n.pageX,
        this.clientY = n.clientY !== void 0 ? n.clientY : n.pageY,
        this.screenX = n.screenX || 0,
        this.screenY = n.screenY || 0),
        this.button = n.button,
        this.key = n.key || "",
        this.ctrlKey = n.ctrlKey,
        this.altKey = n.altKey,
        this.shiftKey = n.shiftKey,
        this.metaKey = n.metaKey,
        this.pointerId = n.pointerId || 0,
        this.pointerType = typeof n.pointerType == "string" ? n.pointerType : og[n.pointerType] || "",
        this.state = n.state,
        this.i = n,
        n.defaultPrevented && pn.$.h.call(this)
    }
}
G(pn, ne);
var og = {
    2: "touch",
    3: "pen",
    4: "mouse"
};
pn.prototype.h = function() {
    pn.$.h.call(this);
    var n = this.i;
    n.preventDefault ? n.preventDefault() : n.returnValue = !1
}
;
var xn = "closure_listenable_" + (1e6 * Math.random() | 0)
  , ag = 0;
function cg(n, e, t, s, i) {
    this.listener = n,
    this.proxy = null,
    this.src = e,
    this.type = t,
    this.capture = !!s,
    this.la = i,
    this.key = ++ag,
    this.fa = this.ia = !1
}
function zs(n) {
    n.fa = !0,
    n.listener = null,
    n.proxy = null,
    n.src = null,
    n.la = null
}
function Rr(n, e, t) {
    for (const s in n)
        e.call(t, n[s], s, n)
}
function ug(n, e) {
    for (const t in n)
        e.call(void 0, n[t], t, n)
}
function Yc(n) {
    const e = {};
    for (const t in n)
        e[t] = n[t];
    return e
}
const ia = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Jc(n, e) {
    let t, s;
    for (let i = 1; i < arguments.length; i++) {
        s = arguments[i];
        for (t in s)
            n[t] = s[t];
        for (let r = 0; r < ia.length; r++)
            t = ia[r],
            Object.prototype.hasOwnProperty.call(s, t) && (n[t] = s[t])
    }
}
function Hs(n) {
    this.src = n,
    this.g = {},
    this.h = 0
}
Hs.prototype.add = function(n, e, t, s, i) {
    var r = n.toString();
    n = this.g[r],
    n || (n = this.g[r] = [],
    this.h++);
    var o = Qi(n, e, s, i);
    return -1 < o ? (e = n[o],
    t || (e.ia = !1)) : (e = new cg(e,this.src,r,!!s,i),
    e.ia = t,
    n.push(e)),
    e
}
;
function Wi(n, e) {
    var t = e.type;
    if (t in n.g) {
        var s = n.g[t], i = Kc(s, e), r;
        (r = 0 <= i) && Array.prototype.splice.call(s, i, 1),
        r && (zs(e),
        n.g[t].length == 0 && (delete n.g[t],
        n.h--))
    }
}
function Qi(n, e, t, s) {
    for (var i = 0; i < n.length; ++i) {
        var r = n[i];
        if (!r.fa && r.listener == e && r.capture == !!t && r.la == s)
            return i
    }
    return -1
}
var Or = "closure_lm_" + (1e6 * Math.random() | 0)
  , Ni = {};
function Xc(n, e, t, s, i) {
    if (s && s.once)
        return eu(n, e, t, s, i);
    if (Array.isArray(e)) {
        for (var r = 0; r < e.length; r++)
            Xc(n, e[r], t, s, i);
        return null
    }
    return t = Lr(t),
    n && n[xn] ? n.O(e, t, Ln(s) ? !!s.capture : !!s, i) : Zc(n, e, t, !1, s, i)
}
function Zc(n, e, t, s, i, r) {
    if (!e)
        throw Error("Invalid event type");
    var o = Ln(i) ? !!i.capture : !!i
      , a = Mr(n);
    if (a || (n[Or] = a = new Hs(n)),
    t = a.add(e, t, s, o, r),
    t.proxy)
        return t;
    if (s = lg(),
    t.proxy = s,
    s.src = n,
    s.listener = t,
    n.addEventListener)
        tg || (i = o),
        i === void 0 && (i = !1),
        n.addEventListener(e.toString(), s, i);
    else if (n.attachEvent)
        n.attachEvent(nu(e.toString()), s);
    else if (n.addListener && n.removeListener)
        n.addListener(s);
    else
        throw Error("addEventListener and attachEvent are unavailable.");
    return t
}
function lg() {
    function n(t) {
        return e.call(n.src, n.listener, t)
    }
    const e = hg;
    return n
}
function eu(n, e, t, s, i) {
    if (Array.isArray(e)) {
        for (var r = 0; r < e.length; r++)
            eu(n, e[r], t, s, i);
        return null
    }
    return t = Lr(t),
    n && n[xn] ? n.P(e, t, Ln(s) ? !!s.capture : !!s, i) : Zc(n, e, t, !0, s, i)
}
function tu(n, e, t, s, i) {
    if (Array.isArray(e))
        for (var r = 0; r < e.length; r++)
            tu(n, e[r], t, s, i);
    else
        s = Ln(s) ? !!s.capture : !!s,
        t = Lr(t),
        n && n[xn] ? (n = n.i,
        e = String(e).toString(),
        e in n.g && (r = n.g[e],
        t = Qi(r, t, s, i),
        -1 < t && (zs(r[t]),
        Array.prototype.splice.call(r, t, 1),
        r.length == 0 && (delete n.g[e],
        n.h--)))) : n && (n = Mr(n)) && (e = n.g[e.toString()],
        n = -1,
        e && (n = Qi(e, t, s, i)),
        (t = -1 < n ? e[n] : null) && Pr(t))
}
function Pr(n) {
    if (typeof n != "number" && n && !n.fa) {
        var e = n.src;
        if (e && e[xn])
            Wi(e.i, n);
        else {
            var t = n.type
              , s = n.proxy;
            e.removeEventListener ? e.removeEventListener(t, s, n.capture) : e.detachEvent ? e.detachEvent(nu(t), s) : e.addListener && e.removeListener && e.removeListener(s),
            (t = Mr(e)) ? (Wi(t, n),
            t.h == 0 && (t.src = null,
            e[Or] = null)) : zs(n)
        }
    }
}
function nu(n) {
    return n in Ni ? Ni[n] : Ni[n] = "on" + n
}
function hg(n, e) {
    if (n.fa)
        n = !0;
    else {
        e = new pn(e,this);
        var t = n.listener
          , s = n.la || n.src;
        n.ia && Pr(n),
        n = t.call(s, e)
    }
    return n
}
function Mr(n) {
    return n = n[Or],
    n instanceof Hs ? n : null
}
var Ri = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
function Lr(n) {
    return typeof n == "function" ? n : (n[Ri] || (n[Ri] = function(e) {
        return n.handleEvent(e)
    }
    ),
    n[Ri])
}
function K() {
    Qe.call(this),
    this.i = new Hs(this),
    this.S = this,
    this.J = null
}
G(K, Qe);
K.prototype[xn] = !0;
K.prototype.removeEventListener = function(n, e, t, s) {
    tu(this, n, e, t, s)
}
;
function Y(n, e) {
    var t, s = n.J;
    if (s)
        for (t = []; s; s = s.J)
            t.push(s);
    if (n = n.S,
    s = e.type || e,
    typeof e == "string")
        e = new ne(e,n);
    else if (e instanceof ne)
        e.target = e.target || n;
    else {
        var i = e;
        e = new ne(s,n),
        Jc(e, i)
    }
    if (i = !0,
    t)
        for (var r = t.length - 1; 0 <= r; r--) {
            var o = e.g = t[r];
            i = ts(o, s, !0, e) && i
        }
    if (o = e.g = n,
    i = ts(o, s, !0, e) && i,
    i = ts(o, s, !1, e) && i,
    t)
        for (r = 0; r < t.length; r++)
            o = e.g = t[r],
            i = ts(o, s, !1, e) && i
}
K.prototype.N = function() {
    if (K.$.N.call(this),
    this.i) {
        var n = this.i, e;
        for (e in n.g) {
            for (var t = n.g[e], s = 0; s < t.length; s++)
                zs(t[s]);
            delete n.g[e],
            n.h--
        }
    }
    this.J = null
}
;
K.prototype.O = function(n, e, t, s) {
    return this.i.add(String(n), e, !1, t, s)
}
;
K.prototype.P = function(n, e, t, s) {
    return this.i.add(String(n), e, !0, t, s)
}
;
function ts(n, e, t, s) {
    if (e = n.i.g[String(e)],
    !e)
        return !0;
    e = e.concat();
    for (var i = !0, r = 0; r < e.length; ++r) {
        var o = e[r];
        if (o && !o.fa && o.capture == t) {
            var a = o.listener
              , c = o.la || o.src;
            o.ia && Wi(n.i, o),
            i = a.call(c, s) !== !1 && i
        }
    }
    return i && !s.defaultPrevented
}
var xr = T.JSON.stringify;
class dg {
    constructor(e, t) {
        this.i = e,
        this.j = t,
        this.h = 0,
        this.g = null
    }
    get() {
        let e;
        return 0 < this.h ? (this.h--,
        e = this.g,
        this.g = e.next,
        e.next = null) : e = this.i(),
        e
    }
}
function fg() {
    var n = Fr;
    let e = null;
    return n.g && (e = n.g,
    n.g = n.g.next,
    n.g || (n.h = null),
    e.next = null),
    e
}
class pg {
    constructor() {
        this.h = this.g = null
    }
    add(e, t) {
        const s = su.get();
        s.set(e, t),
        this.h ? this.h.next = s : this.g = s,
        this.h = s
    }
}
var su = new dg( () => new gg,n => n.reset());
class gg {
    constructor() {
        this.next = this.g = this.h = null
    }
    set(e, t) {
        this.h = e,
        this.g = t,
        this.next = null
    }
    reset() {
        this.next = this.g = this.h = null
    }
}
function mg(n) {
    var e = 1;
    n = n.split(":");
    const t = [];
    for (; 0 < e && n.length; )
        t.push(n.shift()),
        e--;
    return n.length && t.push(n.join(":")),
    t
}
function yg(n) {
    T.setTimeout( () => {
        throw n
    }
    , 0)
}
let gn, mn = !1, Fr = new pg, iu = () => {
    const n = T.Promise.resolve(void 0);
    gn = () => {
        n.then(vg)
    }
}
;
var vg = () => {
    for (var n; n = fg(); ) {
        try {
            n.h.call(n.g)
        } catch (t) {
            yg(t)
        }
        var e = su;
        e.j(n),
        100 > e.h && (e.h++,
        n.next = e.g,
        e.g = n)
    }
    mn = !1
}
;
function Ks(n, e) {
    K.call(this),
    this.h = n || 1,
    this.g = e || T,
    this.j = te(this.qb, this),
    this.l = Date.now()
}
G(Ks, K);
m = Ks.prototype;
m.ga = !1;
m.T = null;
m.qb = function() {
    if (this.ga) {
        var n = Date.now() - this.l;
        0 < n && n < .8 * this.h ? this.T = this.g.setTimeout(this.j, this.h - n) : (this.T && (this.g.clearTimeout(this.T),
        this.T = null),
        Y(this, "tick"),
        this.ga && (Ur(this),
        this.start()))
    }
}
;
m.start = function() {
    this.ga = !0,
    this.T || (this.T = this.g.setTimeout(this.j, this.h),
    this.l = Date.now())
}
;
function Ur(n) {
    n.ga = !1,
    n.T && (n.g.clearTimeout(n.T),
    n.T = null)
}
m.N = function() {
    Ks.$.N.call(this),
    Ur(this),
    delete this.g
}
;
function Vr(n, e, t) {
    if (typeof n == "function")
        t && (n = te(n, t));
    else if (n && typeof n.handleEvent == "function")
        n = te(n.handleEvent, n);
    else
        throw Error("Invalid listener argument");
    return 2147483647 < Number(e) ? -1 : T.setTimeout(n, e || 0)
}
function ru(n) {
    n.g = Vr( () => {
        n.g = null,
        n.i && (n.i = !1,
        ru(n))
    }
    , n.j);
    const e = n.h;
    n.h = null,
    n.m.apply(null, e)
}
class wg extends Qe {
    constructor(e, t) {
        super(),
        this.m = e,
        this.j = t,
        this.h = null,
        this.i = !1,
        this.g = null
    }
    l(e) {
        this.h = arguments,
        this.g ? this.i = !0 : ru(this)
    }
    N() {
        super.N(),
        this.g && (T.clearTimeout(this.g),
        this.g = null,
        this.i = !1,
        this.h = null)
    }
}
function yn(n) {
    Qe.call(this),
    this.h = n,
    this.g = {}
}
G(yn, Qe);
var ra = [];
function ou(n, e, t, s) {
    Array.isArray(t) || (t && (ra[0] = t.toString()),
    t = ra);
    for (var i = 0; i < t.length; i++) {
        var r = Xc(e, t[i], s || n.handleEvent, !1, n.h || n);
        if (!r)
            break;
        n.g[r.key] = r
    }
}
function au(n) {
    Rr(n.g, function(e, t) {
        this.g.hasOwnProperty(t) && Pr(e)
    }, n),
    n.g = {}
}
yn.prototype.N = function() {
    yn.$.N.call(this),
    au(this)
}
;
yn.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented")
}
;
function Gs() {
    this.g = !0
}
Gs.prototype.Ea = function() {
    this.g = !1
}
;
function Eg(n, e, t, s, i, r) {
    n.info(function() {
        if (n.g)
            if (r)
                for (var o = "", a = r.split("&"), c = 0; c < a.length; c++) {
                    var u = a[c].split("=");
                    if (1 < u.length) {
                        var l = u[0];
                        u = u[1];
                        var h = l.split("_");
                        o = 2 <= h.length && h[1] == "type" ? o + (l + "=" + u + "&") : o + (l + "=redacted&")
                    }
                }
            else
                o = null;
        else
            o = r;
        return "XMLHTTP REQ (" + s + ") [attempt " + i + "]: " + e + `
` + t + `
` + o
    })
}
function Ig(n, e, t, s, i, r, o) {
    n.info(function() {
        return "XMLHTTP RESP (" + s + ") [ attempt " + i + "]: " + e + `
` + t + `
` + r + " " + o
    })
}
function Tt(n, e, t, s) {
    n.info(function() {
        return "XMLHTTP TEXT (" + e + "): " + Tg(n, t) + (s ? " " + s : "")
    })
}
function _g(n, e) {
    n.info(function() {
        return "TIMEOUT: " + e
    })
}
Gs.prototype.info = function() {}
;
function Tg(n, e) {
    if (!n.g)
        return e;
    if (!e)
        return null;
    try {
        var t = JSON.parse(e);
        if (t) {
            for (n = 0; n < t.length; n++)
                if (Array.isArray(t[n])) {
                    var s = t[n];
                    if (!(2 > s.length)) {
                        var i = s[1];
                        if (Array.isArray(i) && !(1 > i.length)) {
                            var r = i[0];
                            if (r != "noop" && r != "stop" && r != "close")
                                for (var o = 1; o < i.length; o++)
                                    i[o] = ""
                        }
                    }
                }
        }
        return xr(t)
    } catch {
        return e
    }
}
var pt = {}
  , oa = null;
function Ws() {
    return oa = oa || new K
}
pt.Ta = "serverreachability";
function cu(n) {
    ne.call(this, pt.Ta, n)
}
G(cu, ne);
function vn(n) {
    const e = Ws();
    Y(e, new cu(e))
}
pt.STAT_EVENT = "statevent";
function uu(n, e) {
    ne.call(this, pt.STAT_EVENT, n),
    this.stat = e
}
G(uu, ne);
function oe(n) {
    const e = Ws();
    Y(e, new uu(e,n))
}
pt.Ua = "timingevent";
function lu(n, e) {
    ne.call(this, pt.Ua, n),
    this.size = e
}
G(lu, ne);
function Fn(n, e) {
    if (typeof n != "function")
        throw Error("Fn must not be null and must be a function");
    return T.setTimeout(function() {
        n()
    }, e)
}
var Qs = {
    NO_ERROR: 0,
    rb: 1,
    Eb: 2,
    Db: 3,
    yb: 4,
    Cb: 5,
    Fb: 6,
    Qa: 7,
    TIMEOUT: 8,
    Ib: 9
}
  , hu = {
    wb: "complete",
    Sb: "success",
    Ra: "error",
    Qa: "abort",
    Kb: "ready",
    Lb: "readystatechange",
    TIMEOUT: "timeout",
    Gb: "incrementaldata",
    Jb: "progress",
    zb: "downloadprogress",
    $b: "uploadprogress"
};
function $r() {}
$r.prototype.h = null;
function aa(n) {
    return n.h || (n.h = n.i())
}
function du() {}
var Un = {
    OPEN: "a",
    vb: "b",
    Ra: "c",
    Hb: "d"
};
function Br() {
    ne.call(this, "d")
}
G(Br, ne);
function jr() {
    ne.call(this, "c")
}
G(jr, ne);
var Yi;
function Ys() {}
G(Ys, $r);
Ys.prototype.g = function() {
    return new XMLHttpRequest
}
;
Ys.prototype.i = function() {
    return {}
}
;
Yi = new Ys;
function Vn(n, e, t, s) {
    this.l = n,
    this.j = e,
    this.m = t,
    this.W = s || 1,
    this.U = new yn(this),
    this.P = Sg,
    n = Hi ? 125 : void 0,
    this.V = new Ks(n),
    this.I = null,
    this.i = !1,
    this.s = this.A = this.v = this.L = this.G = this.Y = this.B = null,
    this.F = [],
    this.g = null,
    this.C = 0,
    this.o = this.u = null,
    this.ca = -1,
    this.J = !1,
    this.O = 0,
    this.M = null,
    this.ba = this.K = this.aa = this.S = !1,
    this.h = new fu
}
function fu() {
    this.i = null,
    this.g = "",
    this.h = !1
}
var Sg = 45e3
  , Ji = {}
  , As = {};
m = Vn.prototype;
m.setTimeout = function(n) {
    this.P = n
}
;
function Xi(n, e, t) {
    n.L = 1,
    n.v = Xs(Ne(e)),
    n.s = t,
    n.S = !0,
    pu(n, null)
}
function pu(n, e) {
    n.G = Date.now(),
    $n(n),
    n.A = Ne(n.v);
    var t = n.A
      , s = n.W;
    Array.isArray(s) || (s = [String(s)]),
    _u(t.i, "t", s),
    n.C = 0,
    t = n.l.J,
    n.h = new fu,
    n.g = qu(n.l, t ? e : null, !n.s),
    0 < n.O && (n.M = new wg(te(n.Pa, n, n.g),n.O)),
    ou(n.U, n.g, "readystatechange", n.nb),
    e = n.I ? Yc(n.I) : {},
    n.s ? (n.u || (n.u = "POST"),
    e["Content-Type"] = "application/x-www-form-urlencoded",
    n.g.ha(n.A, n.u, n.s, e)) : (n.u = "GET",
    n.g.ha(n.A, n.u, null, e)),
    vn(),
    Eg(n.j, n.u, n.A, n.m, n.W, n.s)
}
m.nb = function(n) {
    n = n.target;
    const e = this.M;
    e && ye(n) == 3 ? e.l() : this.Pa(n)
}
;
m.Pa = function(n) {
    try {
        if (n == this.g)
            e: {
                const l = ye(this.g);
                var e = this.g.Ia();
                const h = this.g.da();
                if (!(3 > l) && (l != 3 || Hi || this.g && (this.h.h || this.g.ja() || ha(this.g)))) {
                    this.J || l != 4 || e == 7 || (e == 8 || 0 >= h ? vn(3) : vn(2)),
                    Js(this);
                    var t = this.g.da();
                    this.ca = t;
                    t: if (gu(this)) {
                        var s = ha(this.g);
                        n = "";
                        var i = s.length
                          , r = ye(this.g) == 4;
                        if (!this.h.i) {
                            if (typeof TextDecoder > "u") {
                                tt(this),
                                rn(this);
                                var o = "";
                                break t
                            }
                            this.h.i = new T.TextDecoder
                        }
                        for (e = 0; e < i; e++)
                            this.h.h = !0,
                            n += this.h.i.decode(s[e], {
                                stream: r && e == i - 1
                            });
                        s.splice(0, i),
                        this.h.g += n,
                        this.C = 0,
                        o = this.h.g
                    } else
                        o = this.g.ja();
                    if (this.i = t == 200,
                    Ig(this.j, this.u, this.A, this.m, this.W, l, t),
                    this.i) {
                        if (this.aa && !this.K) {
                            t: {
                                if (this.g) {
                                    var a, c = this.g;
                                    if ((a = c.g ? c.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !fn(a)) {
                                        var u = a;
                                        break t
                                    }
                                }
                                u = null
                            }
                            if (t = u)
                                Tt(this.j, this.m, t, "Initial handshake response via X-HTTP-Initial-Response"),
                                this.K = !0,
                                Zi(this, t);
                            else {
                                this.i = !1,
                                this.o = 3,
                                oe(12),
                                tt(this),
                                rn(this);
                                break e
                            }
                        }
                        this.S ? (mu(this, l, o),
                        Hi && this.i && l == 3 && (ou(this.U, this.V, "tick", this.mb),
                        this.V.start())) : (Tt(this.j, this.m, o, null),
                        Zi(this, o)),
                        l == 4 && tt(this),
                        this.i && !this.J && (l == 4 ? Vu(this.l, this) : (this.i = !1,
                        $n(this)))
                    } else
                        Hg(this.g),
                        t == 400 && 0 < o.indexOf("Unknown SID") ? (this.o = 3,
                        oe(12)) : (this.o = 0,
                        oe(13)),
                        tt(this),
                        rn(this)
                }
            }
    } catch {} finally {}
}
;
function gu(n) {
    return n.g ? n.u == "GET" && n.L != 2 && n.l.Ha : !1
}
function mu(n, e, t) {
    let s = !0, i;
    for (; !n.J && n.C < t.length; )
        if (i = Ag(n, t),
        i == As) {
            e == 4 && (n.o = 4,
            oe(14),
            s = !1),
            Tt(n.j, n.m, null, "[Incomplete Response]");
            break
        } else if (i == Ji) {
            n.o = 4,
            oe(15),
            Tt(n.j, n.m, t, "[Invalid Chunk]"),
            s = !1;
            break
        } else
            Tt(n.j, n.m, i, null),
            Zi(n, i);
    gu(n) && i != As && i != Ji && (n.h.g = "",
    n.C = 0),
    e != 4 || t.length != 0 || n.h.h || (n.o = 1,
    oe(16),
    s = !1),
    n.i = n.i && s,
    s ? 0 < t.length && !n.ba && (n.ba = !0,
    e = n.l,
    e.g == n && e.ca && !e.M && (e.l.info("Great, no buffering proxy detected. Bytes received: " + t.length),
    Wr(e),
    e.M = !0,
    oe(11))) : (Tt(n.j, n.m, t, "[Invalid Chunked Response]"),
    tt(n),
    rn(n))
}
m.mb = function() {
    if (this.g) {
        var n = ye(this.g)
          , e = this.g.ja();
        this.C < e.length && (Js(this),
        mu(this, n, e),
        this.i && n != 4 && $n(this))
    }
}
;
function Ag(n, e) {
    var t = n.C
      , s = e.indexOf(`
`, t);
    return s == -1 ? As : (t = Number(e.substring(t, s)),
    isNaN(t) ? Ji : (s += 1,
    s + t > e.length ? As : (e = e.slice(s, s + t),
    n.C = s + t,
    e)))
}
m.cancel = function() {
    this.J = !0,
    tt(this)
}
;
function $n(n) {
    n.Y = Date.now() + n.P,
    yu(n, n.P)
}
function yu(n, e) {
    if (n.B != null)
        throw Error("WatchDog timer not null");
    n.B = Fn(te(n.lb, n), e)
}
function Js(n) {
    n.B && (T.clearTimeout(n.B),
    n.B = null)
}
m.lb = function() {
    this.B = null;
    const n = Date.now();
    0 <= n - this.Y ? (_g(this.j, this.A),
    this.L != 2 && (vn(),
    oe(17)),
    tt(this),
    this.o = 2,
    rn(this)) : yu(this, this.Y - n)
}
;
function rn(n) {
    n.l.H == 0 || n.J || Vu(n.l, n)
}
function tt(n) {
    Js(n);
    var e = n.M;
    e && typeof e.sa == "function" && e.sa(),
    n.M = null,
    Ur(n.V),
    au(n.U),
    n.g && (e = n.g,
    n.g = null,
    e.abort(),
    e.sa())
}
function Zi(n, e) {
    try {
        var t = n.l;
        if (t.H != 0 && (t.g == n || er(t.i, n))) {
            if (!n.K && er(t.i, n) && t.H == 3) {
                try {
                    var s = t.Ja.g.parse(e)
                } catch {
                    s = null
                }
                if (Array.isArray(s) && s.length == 3) {
                    var i = s;
                    if (i[0] == 0) {
                        e: if (!t.u) {
                            if (t.g)
                                if (t.g.G + 3e3 < n.G)
                                    ks(t),
                                    ti(t);
                                else
                                    break e;
                            Gr(t),
                            oe(18)
                        }
                    } else
                        t.Fa = i[1],
                        0 < t.Fa - t.V && 37500 > i[2] && t.G && t.A == 0 && !t.v && (t.v = Fn(te(t.ib, t), 6e3));
                    if (1 >= Au(t.i) && t.oa) {
                        try {
                            t.oa()
                        } catch {}
                        t.oa = void 0
                    }
                } else
                    nt(t, 11)
            } else if ((n.K || t.g == n) && ks(t),
            !fn(e))
                for (i = t.Ja.g.parse(e),
                e = 0; e < i.length; e++) {
                    let u = i[e];
                    if (t.V = u[0],
                    u = u[1],
                    t.H == 2)
                        if (u[0] == "c") {
                            t.K = u[1],
                            t.pa = u[2];
                            const l = u[3];
                            l != null && (t.ra = l,
                            t.l.info("VER=" + t.ra));
                            const h = u[4];
                            h != null && (t.Ga = h,
                            t.l.info("SVER=" + t.Ga));
                            const f = u[5];
                            f != null && typeof f == "number" && 0 < f && (s = 1.5 * f,
                            t.L = s,
                            t.l.info("backChannelRequestTimeoutMs_=" + s)),
                            s = t;
                            const g = n.g;
                            if (g) {
                                const E = g.g ? g.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                                if (E) {
                                    var r = s.i;
                                    r.g || E.indexOf("spdy") == -1 && E.indexOf("quic") == -1 && E.indexOf("h2") == -1 || (r.j = r.l,
                                    r.g = new Set,
                                    r.h && (qr(r, r.h),
                                    r.h = null))
                                }
                                if (s.F) {
                                    const C = g.g ? g.g.getResponseHeader("X-HTTP-Session-Id") : null;
                                    C && (s.Da = C,
                                    P(s.I, s.F, C))
                                }
                            }
                            t.H = 3,
                            t.h && t.h.Ba(),
                            t.ca && (t.S = Date.now() - n.G,
                            t.l.info("Handshake RTT: " + t.S + "ms")),
                            s = t;
                            var o = n;
                            if (s.wa = ju(s, s.J ? s.pa : null, s.Y),
                            o.K) {
                                Cu(s.i, o);
                                var a = o
                                  , c = s.L;
                                c && a.setTimeout(c),
                                a.B && (Js(a),
                                $n(a)),
                                s.g = o
                            } else
                                Fu(s);
                            0 < t.j.length && ni(t)
                        } else
                            u[0] != "stop" && u[0] != "close" || nt(t, 7);
                    else
                        t.H == 3 && (u[0] == "stop" || u[0] == "close" ? u[0] == "stop" ? nt(t, 7) : Kr(t) : u[0] != "noop" && t.h && t.h.Aa(u),
                        t.A = 0)
                }
        }
        vn(4)
    } catch {}
}
function Cg(n) {
    if (n.Z && typeof n.Z == "function")
        return n.Z();
    if (typeof Map < "u" && n instanceof Map || typeof Set < "u" && n instanceof Set)
        return Array.from(n.values());
    if (typeof n == "string")
        return n.split("");
    if (js(n)) {
        for (var e = [], t = n.length, s = 0; s < t; s++)
            e.push(n[s]);
        return e
    }
    e = [],
    t = 0;
    for (s in n)
        e[t++] = n[s];
    return e
}
function bg(n) {
    if (n.ta && typeof n.ta == "function")
        return n.ta();
    if (!n.Z || typeof n.Z != "function") {
        if (typeof Map < "u" && n instanceof Map)
            return Array.from(n.keys());
        if (!(typeof Set < "u" && n instanceof Set)) {
            if (js(n) || typeof n == "string") {
                var e = [];
                n = n.length;
                for (var t = 0; t < n; t++)
                    e.push(t);
                return e
            }
            e = [],
            t = 0;
            for (const s in n)
                e[t++] = s;
            return e
        }
    }
}
function vu(n, e) {
    if (n.forEach && typeof n.forEach == "function")
        n.forEach(e, void 0);
    else if (js(n) || typeof n == "string")
        Array.prototype.forEach.call(n, e, void 0);
    else
        for (var t = bg(n), s = Cg(n), i = s.length, r = 0; r < i; r++)
            e.call(void 0, s[r], t && t[r], n)
}
var wu = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
function kg(n, e) {
    if (n) {
        n = n.split("&");
        for (var t = 0; t < n.length; t++) {
            var s = n[t].indexOf("=")
              , i = null;
            if (0 <= s) {
                var r = n[t].substring(0, s);
                i = n[t].substring(s + 1)
            } else
                r = n[t];
            e(r, i ? decodeURIComponent(i.replace(/\+/g, " ")) : "")
        }
    }
}
function rt(n) {
    if (this.g = this.s = this.j = "",
    this.m = null,
    this.o = this.l = "",
    this.h = !1,
    n instanceof rt) {
        this.h = n.h,
        Cs(this, n.j),
        this.s = n.s,
        this.g = n.g,
        bs(this, n.m),
        this.l = n.l;
        var e = n.i
          , t = new wn;
        t.i = e.i,
        e.g && (t.g = new Map(e.g),
        t.h = e.h),
        ca(this, t),
        this.o = n.o
    } else
        n && (e = String(n).match(wu)) ? (this.h = !1,
        Cs(this, e[1] || "", !0),
        this.s = Xt(e[2] || ""),
        this.g = Xt(e[3] || "", !0),
        bs(this, e[4]),
        this.l = Xt(e[5] || "", !0),
        ca(this, e[6] || "", !0),
        this.o = Xt(e[7] || "")) : (this.h = !1,
        this.i = new wn(null,this.h))
}
rt.prototype.toString = function() {
    var n = []
      , e = this.j;
    e && n.push(Zt(e, ua, !0), ":");
    var t = this.g;
    return (t || e == "file") && (n.push("//"),
    (e = this.s) && n.push(Zt(e, ua, !0), "@"),
    n.push(encodeURIComponent(String(t)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
    t = this.m,
    t != null && n.push(":", String(t))),
    (t = this.l) && (this.g && t.charAt(0) != "/" && n.push("/"),
    n.push(Zt(t, t.charAt(0) == "/" ? Rg : Ng, !0))),
    (t = this.i.toString()) && n.push("?", t),
    (t = this.o) && n.push("#", Zt(t, Pg)),
    n.join("")
}
;
function Ne(n) {
    return new rt(n)
}
function Cs(n, e, t) {
    n.j = t ? Xt(e, !0) : e,
    n.j && (n.j = n.j.replace(/:$/, ""))
}
function bs(n, e) {
    if (e) {
        if (e = Number(e),
        isNaN(e) || 0 > e)
            throw Error("Bad port number " + e);
        n.m = e
    } else
        n.m = null
}
function ca(n, e, t) {
    e instanceof wn ? (n.i = e,
    Mg(n.i, n.h)) : (t || (e = Zt(e, Og)),
    n.i = new wn(e,n.h))
}
function P(n, e, t) {
    n.i.set(e, t)
}
function Xs(n) {
    return P(n, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36)),
    n
}
function Xt(n, e) {
    return n ? e ? decodeURI(n.replace(/%25/g, "%2525")) : decodeURIComponent(n) : ""
}
function Zt(n, e, t) {
    return typeof n == "string" ? (n = encodeURI(n).replace(e, Dg),
    t && (n = n.replace(/%25([0-9a-fA-F]{2})/g, "%$1")),
    n) : null
}
function Dg(n) {
    return n = n.charCodeAt(0),
    "%" + (n >> 4 & 15).toString(16) + (n & 15).toString(16)
}
var ua = /[#\/\?@]/g
  , Ng = /[#\?:]/g
  , Rg = /[#\?]/g
  , Og = /[#\?@]/g
  , Pg = /#/g;
function wn(n, e) {
    this.h = this.g = null,
    this.i = n || null,
    this.j = !!e
}
function Ye(n) {
    n.g || (n.g = new Map,
    n.h = 0,
    n.i && kg(n.i, function(e, t) {
        n.add(decodeURIComponent(e.replace(/\+/g, " ")), t)
    }))
}
m = wn.prototype;
m.add = function(n, e) {
    Ye(this),
    this.i = null,
    n = qt(this, n);
    var t = this.g.get(n);
    return t || this.g.set(n, t = []),
    t.push(e),
    this.h += 1,
    this
}
;
function Eu(n, e) {
    Ye(n),
    e = qt(n, e),
    n.g.has(e) && (n.i = null,
    n.h -= n.g.get(e).length,
    n.g.delete(e))
}
function Iu(n, e) {
    return Ye(n),
    e = qt(n, e),
    n.g.has(e)
}
m.forEach = function(n, e) {
    Ye(this),
    this.g.forEach(function(t, s) {
        t.forEach(function(i) {
            n.call(e, i, s, this)
        }, this)
    }, this)
}
;
m.ta = function() {
    Ye(this);
    const n = Array.from(this.g.values())
      , e = Array.from(this.g.keys())
      , t = [];
    for (let s = 0; s < e.length; s++) {
        const i = n[s];
        for (let r = 0; r < i.length; r++)
            t.push(e[s])
    }
    return t
}
;
m.Z = function(n) {
    Ye(this);
    let e = [];
    if (typeof n == "string")
        Iu(this, n) && (e = e.concat(this.g.get(qt(this, n))));
    else {
        n = Array.from(this.g.values());
        for (let t = 0; t < n.length; t++)
            e = e.concat(n[t])
    }
    return e
}
;
m.set = function(n, e) {
    return Ye(this),
    this.i = null,
    n = qt(this, n),
    Iu(this, n) && (this.h -= this.g.get(n).length),
    this.g.set(n, [e]),
    this.h += 1,
    this
}
;
m.get = function(n, e) {
    return n ? (n = this.Z(n),
    0 < n.length ? String(n[0]) : e) : e
}
;
function _u(n, e, t) {
    Eu(n, e),
    0 < t.length && (n.i = null,
    n.g.set(qt(n, e), Dr(t)),
    n.h += t.length)
}
m.toString = function() {
    if (this.i)
        return this.i;
    if (!this.g)
        return "";
    const n = []
      , e = Array.from(this.g.keys());
    for (var t = 0; t < e.length; t++) {
        var s = e[t];
        const r = encodeURIComponent(String(s))
          , o = this.Z(s);
        for (s = 0; s < o.length; s++) {
            var i = r;
            o[s] !== "" && (i += "=" + encodeURIComponent(String(o[s]))),
            n.push(i)
        }
    }
    return this.i = n.join("&")
}
;
function qt(n, e) {
    return e = String(e),
    n.j && (e = e.toLowerCase()),
    e
}
function Mg(n, e) {
    e && !n.j && (Ye(n),
    n.i = null,
    n.g.forEach(function(t, s) {
        var i = s.toLowerCase();
        s != i && (Eu(this, s),
        _u(this, i, t))
    }, n)),
    n.j = e
}
var Lg = class {
    constructor(n, e) {
        this.g = n,
        this.map = e
    }
}
;
function Tu(n) {
    this.l = n || xg,
    T.PerformanceNavigationTiming ? (n = T.performance.getEntriesByType("navigation"),
    n = 0 < n.length && (n[0].nextHopProtocol == "hq" || n[0].nextHopProtocol == "h2")) : n = !!(T.g && T.g.Ka && T.g.Ka() && T.g.Ka().ec),
    this.j = n ? this.l : 1,
    this.g = null,
    1 < this.j && (this.g = new Set),
    this.h = null,
    this.i = []
}
var xg = 10;
function Su(n) {
    return n.h ? !0 : n.g ? n.g.size >= n.j : !1
}
function Au(n) {
    return n.h ? 1 : n.g ? n.g.size : 0
}
function er(n, e) {
    return n.h ? n.h == e : n.g ? n.g.has(e) : !1
}
function qr(n, e) {
    n.g ? n.g.add(e) : n.h = e
}
function Cu(n, e) {
    n.h && n.h == e ? n.h = null : n.g && n.g.has(e) && n.g.delete(e)
}
Tu.prototype.cancel = function() {
    if (this.i = bu(this),
    this.h)
        this.h.cancel(),
        this.h = null;
    else if (this.g && this.g.size !== 0) {
        for (const n of this.g.values())
            n.cancel();
        this.g.clear()
    }
}
;
function bu(n) {
    if (n.h != null)
        return n.i.concat(n.h.F);
    if (n.g != null && n.g.size !== 0) {
        let e = n.i;
        for (const t of n.g.values())
            e = e.concat(t.F);
        return e
    }
    return Dr(n.i)
}
var Fg = class {
    stringify(n) {
        return T.JSON.stringify(n, void 0)
    }
    parse(n) {
        return T.JSON.parse(n, void 0)
    }
}
;
function Ug() {
    this.g = new Fg
}
function Vg(n, e, t) {
    const s = t || "";
    try {
        vu(n, function(i, r) {
            let o = i;
            Ln(i) && (o = xr(i)),
            e.push(s + r + "=" + encodeURIComponent(o))
        })
    } catch (i) {
        throw e.push(s + "type=" + encodeURIComponent("_badmap")),
        i
    }
}
function $g(n, e) {
    const t = new Gs;
    if (T.Image) {
        const s = new Image;
        s.onload = es(ns, t, s, "TestLoadImage: loaded", !0, e),
        s.onerror = es(ns, t, s, "TestLoadImage: error", !1, e),
        s.onabort = es(ns, t, s, "TestLoadImage: abort", !1, e),
        s.ontimeout = es(ns, t, s, "TestLoadImage: timeout", !1, e),
        T.setTimeout(function() {
            s.ontimeout && s.ontimeout()
        }, 1e4),
        s.src = n
    } else
        e(!1)
}
function ns(n, e, t, s, i) {
    try {
        e.onload = null,
        e.onerror = null,
        e.onabort = null,
        e.ontimeout = null,
        i(s)
    } catch {}
}
function Bn(n) {
    this.l = n.fc || null,
    this.j = n.ob || !1
}
G(Bn, $r);
Bn.prototype.g = function() {
    return new Zs(this.l,this.j)
}
;
Bn.prototype.i = function(n) {
    return function() {
        return n
    }
}({});
function Zs(n, e) {
    K.call(this),
    this.F = n,
    this.u = e,
    this.m = void 0,
    this.readyState = zr,
    this.status = 0,
    this.responseType = this.responseText = this.response = this.statusText = "",
    this.onreadystatechange = null,
    this.v = new Headers,
    this.h = null,
    this.C = "GET",
    this.B = "",
    this.g = !1,
    this.A = this.j = this.l = null
}
G(Zs, K);
var zr = 0;
m = Zs.prototype;
m.open = function(n, e) {
    if (this.readyState != zr)
        throw this.abort(),
        Error("Error reopening a connection");
    this.C = n,
    this.B = e,
    this.readyState = 1,
    En(this)
}
;
m.send = function(n) {
    if (this.readyState != 1)
        throw this.abort(),
        Error("need to call open() first. ");
    this.g = !0;
    const e = {
        headers: this.v,
        method: this.C,
        credentials: this.m,
        cache: void 0
    };
    n && (e.body = n),
    (this.F || T).fetch(new Request(this.B,e)).then(this.$a.bind(this), this.ka.bind(this))
}
;
m.abort = function() {
    this.response = this.responseText = "",
    this.v = new Headers,
    this.status = 0,
    this.j && this.j.cancel("Request was aborted.").catch( () => {}
    ),
    1 <= this.readyState && this.g && this.readyState != 4 && (this.g = !1,
    jn(this)),
    this.readyState = zr
}
;
m.$a = function(n) {
    if (this.g && (this.l = n,
    this.h || (this.status = this.l.status,
    this.statusText = this.l.statusText,
    this.h = n.headers,
    this.readyState = 2,
    En(this)),
    this.g && (this.readyState = 3,
    En(this),
    this.g)))
        if (this.responseType === "arraybuffer")
            n.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
        else if (typeof T.ReadableStream < "u" && "body"in n) {
            if (this.j = n.body.getReader(),
            this.u) {
                if (this.responseType)
                    throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
                this.response = []
            } else
                this.response = this.responseText = "",
                this.A = new TextDecoder;
            ku(this)
        } else
            n.text().then(this.Za.bind(this), this.ka.bind(this))
}
;
function ku(n) {
    n.j.read().then(n.Xa.bind(n)).catch(n.ka.bind(n))
}
m.Xa = function(n) {
    if (this.g) {
        if (this.u && n.value)
            this.response.push(n.value);
        else if (!this.u) {
            var e = n.value ? n.value : new Uint8Array(0);
            (e = this.A.decode(e, {
                stream: !n.done
            })) && (this.response = this.responseText += e)
        }
        n.done ? jn(this) : En(this),
        this.readyState == 3 && ku(this)
    }
}
;
m.Za = function(n) {
    this.g && (this.response = this.responseText = n,
    jn(this))
}
;
m.Ya = function(n) {
    this.g && (this.response = n,
    jn(this))
}
;
m.ka = function() {
    this.g && jn(this)
}
;
function jn(n) {
    n.readyState = 4,
    n.l = null,
    n.j = null,
    n.A = null,
    En(n)
}
m.setRequestHeader = function(n, e) {
    this.v.append(n, e)
}
;
m.getResponseHeader = function(n) {
    return this.h && this.h.get(n.toLowerCase()) || ""
}
;
m.getAllResponseHeaders = function() {
    if (!this.h)
        return "";
    const n = []
      , e = this.h.entries();
    for (var t = e.next(); !t.done; )
        t = t.value,
        n.push(t[0] + ": " + t[1]),
        t = e.next();
    return n.join(`\r
`)
}
;
function En(n) {
    n.onreadystatechange && n.onreadystatechange.call(n)
}
Object.defineProperty(Zs.prototype, "withCredentials", {
    get: function() {
        return this.m === "include"
    },
    set: function(n) {
        this.m = n ? "include" : "same-origin"
    }
});
var Bg = T.JSON.parse;
function F(n) {
    K.call(this),
    this.headers = new Map,
    this.u = n || null,
    this.h = !1,
    this.C = this.g = null,
    this.I = "",
    this.m = 0,
    this.j = "",
    this.l = this.G = this.v = this.F = !1,
    this.B = 0,
    this.A = null,
    this.K = Du,
    this.L = this.M = !1
}
G(F, K);
var Du = ""
  , jg = /^https?$/i
  , qg = ["POST", "PUT"];
m = F.prototype;
m.Oa = function(n) {
    this.M = n
}
;
m.ha = function(n, e, t, s) {
    if (this.g)
        throw Error("[goog.net.XhrIo] Object is active with another request=" + this.I + "; newUri=" + n);
    e = e ? e.toUpperCase() : "GET",
    this.I = n,
    this.j = "",
    this.m = 0,
    this.F = !1,
    this.h = !0,
    this.g = this.u ? this.u.g() : Yi.g(),
    this.C = this.u ? aa(this.u) : aa(Yi),
    this.g.onreadystatechange = te(this.La, this);
    try {
        this.G = !0,
        this.g.open(e, String(n), !0),
        this.G = !1
    } catch (r) {
        la(this, r);
        return
    }
    if (n = t || "",
    t = new Map(this.headers),
    s)
        if (Object.getPrototypeOf(s) === Object.prototype)
            for (var i in s)
                t.set(i, s[i]);
        else if (typeof s.keys == "function" && typeof s.get == "function")
            for (const r of s.keys())
                t.set(r, s.get(r));
        else
            throw Error("Unknown input type for opt_headers: " + String(s));
    s = Array.from(t.keys()).find(r => r.toLowerCase() == "content-type"),
    i = T.FormData && n instanceof T.FormData,
    !(0 <= Kc(qg, e)) || s || i || t.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    for (const [r,o] of t)
        this.g.setRequestHeader(r, o);
    this.K && (this.g.responseType = this.K),
    "withCredentials"in this.g && this.g.withCredentials !== this.M && (this.g.withCredentials = this.M);
    try {
        Ou(this),
        0 < this.B && ((this.L = zg(this.g)) ? (this.g.timeout = this.B,
        this.g.ontimeout = te(this.ua, this)) : this.A = Vr(this.ua, this.B, this)),
        this.v = !0,
        this.g.send(n),
        this.v = !1
    } catch (r) {
        la(this, r)
    }
}
;
function zg(n) {
    return Mt && typeof n.timeout == "number" && n.ontimeout !== void 0
}
m.ua = function() {
    typeof kr < "u" && this.g && (this.j = "Timed out after " + this.B + "ms, aborting",
    this.m = 8,
    Y(this, "timeout"),
    this.abort(8))
}
;
function la(n, e) {
    n.h = !1,
    n.g && (n.l = !0,
    n.g.abort(),
    n.l = !1),
    n.j = e,
    n.m = 5,
    Nu(n),
    ei(n)
}
function Nu(n) {
    n.F || (n.F = !0,
    Y(n, "complete"),
    Y(n, "error"))
}
m.abort = function(n) {
    this.g && this.h && (this.h = !1,
    this.l = !0,
    this.g.abort(),
    this.l = !1,
    this.m = n || 7,
    Y(this, "complete"),
    Y(this, "abort"),
    ei(this))
}
;
m.N = function() {
    this.g && (this.h && (this.h = !1,
    this.l = !0,
    this.g.abort(),
    this.l = !1),
    ei(this, !0)),
    F.$.N.call(this)
}
;
m.La = function() {
    this.s || (this.G || this.v || this.l ? Ru(this) : this.kb())
}
;
m.kb = function() {
    Ru(this)
}
;
function Ru(n) {
    if (n.h && typeof kr < "u" && (!n.C[1] || ye(n) != 4 || n.da() != 2)) {
        if (n.v && ye(n) == 4)
            Vr(n.La, 0, n);
        else if (Y(n, "readystatechange"),
        ye(n) == 4) {
            n.h = !1;
            try {
                const o = n.da();
                e: switch (o) {
                case 200:
                case 201:
                case 202:
                case 204:
                case 206:
                case 304:
                case 1223:
                    var e = !0;
                    break e;
                default:
                    e = !1
                }
                var t;
                if (!(t = e)) {
                    var s;
                    if (s = o === 0) {
                        var i = String(n.I).match(wu)[1] || null;
                        !i && T.self && T.self.location && (i = T.self.location.protocol.slice(0, -1)),
                        s = !jg.test(i ? i.toLowerCase() : "")
                    }
                    t = s
                }
                if (t)
                    Y(n, "complete"),
                    Y(n, "success");
                else {
                    n.m = 6;
                    try {
                        var r = 2 < ye(n) ? n.g.statusText : ""
                    } catch {
                        r = ""
                    }
                    n.j = r + " [" + n.da() + "]",
                    Nu(n)
                }
            } finally {
                ei(n)
            }
        }
    }
}
function ei(n, e) {
    if (n.g) {
        Ou(n);
        const t = n.g
          , s = n.C[0] ? () => {}
        : null;
        n.g = null,
        n.C = null,
        e || Y(n, "ready");
        try {
            t.onreadystatechange = s
        } catch {}
    }
}
function Ou(n) {
    n.g && n.L && (n.g.ontimeout = null),
    n.A && (T.clearTimeout(n.A),
    n.A = null)
}
m.isActive = function() {
    return !!this.g
}
;
function ye(n) {
    return n.g ? n.g.readyState : 0
}
m.da = function() {
    try {
        return 2 < ye(this) ? this.g.status : -1
    } catch {
        return -1
    }
}
;
m.ja = function() {
    try {
        return this.g ? this.g.responseText : ""
    } catch {
        return ""
    }
}
;
m.Wa = function(n) {
    if (this.g) {
        var e = this.g.responseText;
        return n && e.indexOf(n) == 0 && (e = e.substring(n.length)),
        Bg(e)
    }
}
;
function ha(n) {
    try {
        if (!n.g)
            return null;
        if ("response"in n.g)
            return n.g.response;
        switch (n.K) {
        case Du:
        case "text":
            return n.g.responseText;
        case "arraybuffer":
            if ("mozResponseArrayBuffer"in n.g)
                return n.g.mozResponseArrayBuffer
        }
        return null
    } catch {
        return null
    }
}
function Hg(n) {
    const e = {};
    n = (n.g && 2 <= ye(n) && n.g.getAllResponseHeaders() || "").split(`\r
`);
    for (let s = 0; s < n.length; s++) {
        if (fn(n[s]))
            continue;
        var t = mg(n[s]);
        const i = t[0];
        if (t = t[1],
        typeof t != "string")
            continue;
        t = t.trim();
        const r = e[i] || [];
        e[i] = r,
        r.push(t)
    }
    ug(e, function(s) {
        return s.join(", ")
    })
}
m.Ia = function() {
    return this.m
}
;
m.Sa = function() {
    return typeof this.j == "string" ? this.j : String(this.j)
}
;
function Pu(n) {
    let e = "";
    return Rr(n, function(t, s) {
        e += s,
        e += ":",
        e += t,
        e += `\r
`
    }),
    e
}
function Hr(n, e, t) {
    e: {
        for (s in t) {
            var s = !1;
            break e
        }
        s = !0
    }
    s || (t = Pu(t),
    typeof n == "string" ? t != null && encodeURIComponent(String(t)) : P(n, e, t))
}
function Yt(n, e, t) {
    return t && t.internalChannelParams && t.internalChannelParams[n] || e
}
function Mu(n) {
    this.Ga = 0,
    this.j = [],
    this.l = new Gs,
    this.pa = this.wa = this.I = this.Y = this.g = this.Da = this.F = this.na = this.o = this.U = this.s = null,
    this.fb = this.W = 0,
    this.cb = Yt("failFast", !1, n),
    this.G = this.v = this.u = this.m = this.h = null,
    this.aa = !0,
    this.Fa = this.V = -1,
    this.ba = this.A = this.C = 0,
    this.ab = Yt("baseRetryDelayMs", 5e3, n),
    this.hb = Yt("retryDelaySeedMs", 1e4, n),
    this.eb = Yt("forwardChannelMaxRetries", 2, n),
    this.xa = Yt("forwardChannelRequestTimeoutMs", 2e4, n),
    this.va = n && n.xmlHttpFactory || void 0,
    this.Ha = n && n.dc || !1,
    this.L = void 0,
    this.J = n && n.supportsCrossDomainXhr || !1,
    this.K = "",
    this.i = new Tu(n && n.concurrentRequestLimit),
    this.Ja = new Ug,
    this.P = n && n.fastHandshake || !1,
    this.O = n && n.encodeInitMessageHeaders || !1,
    this.P && this.O && (this.O = !1),
    this.bb = n && n.bc || !1,
    n && n.Ea && this.l.Ea(),
    n && n.forceLongPolling && (this.aa = !1),
    this.ca = !this.P && this.aa && n && n.detectBufferingProxy || !1,
    this.qa = void 0,
    n && n.longPollingTimeout && 0 < n.longPollingTimeout && (this.qa = n.longPollingTimeout),
    this.oa = void 0,
    this.S = 0,
    this.M = !1,
    this.ma = this.B = null
}
m = Mu.prototype;
m.ra = 8;
m.H = 1;
function Kr(n) {
    if (Lu(n),
    n.H == 3) {
        var e = n.W++
          , t = Ne(n.I);
        if (P(t, "SID", n.K),
        P(t, "RID", e),
        P(t, "TYPE", "terminate"),
        qn(n, t),
        e = new Vn(n,n.l,e),
        e.L = 2,
        e.v = Xs(Ne(t)),
        t = !1,
        T.navigator && T.navigator.sendBeacon)
            try {
                t = T.navigator.sendBeacon(e.v.toString(), "")
            } catch {}
        !t && T.Image && (new Image().src = e.v,
        t = !0),
        t || (e.g = qu(e.l, null),
        e.g.ha(e.v)),
        e.G = Date.now(),
        $n(e)
    }
    Bu(n)
}
function ti(n) {
    n.g && (Wr(n),
    n.g.cancel(),
    n.g = null)
}
function Lu(n) {
    ti(n),
    n.u && (T.clearTimeout(n.u),
    n.u = null),
    ks(n),
    n.i.cancel(),
    n.m && (typeof n.m == "number" && T.clearTimeout(n.m),
    n.m = null)
}
function ni(n) {
    if (!Su(n.i) && !n.m) {
        n.m = !0;
        var e = n.Na;
        gn || iu(),
        mn || (gn(),
        mn = !0),
        Fr.add(e, n),
        n.C = 0
    }
}
function Kg(n, e) {
    return Au(n.i) >= n.i.j - (n.m ? 1 : 0) ? !1 : n.m ? (n.j = e.F.concat(n.j),
    !0) : n.H == 1 || n.H == 2 || n.C >= (n.cb ? 0 : n.eb) ? !1 : (n.m = Fn(te(n.Na, n, e), $u(n, n.C)),
    n.C++,
    !0)
}
m.Na = function(n) {
    if (this.m)
        if (this.m = null,
        this.H == 1) {
            if (!n) {
                this.W = Math.floor(1e5 * Math.random()),
                n = this.W++;
                const i = new Vn(this,this.l,n);
                let r = this.s;
                if (this.U && (r ? (r = Yc(r),
                Jc(r, this.U)) : r = this.U),
                this.o !== null || this.O || (i.I = r,
                r = null),
                this.P)
                    e: {
                        for (var e = 0, t = 0; t < this.j.length; t++) {
                            t: {
                                var s = this.j[t];
                                if ("__data__"in s.map && (s = s.map.__data__,
                                typeof s == "string")) {
                                    s = s.length;
                                    break t
                                }
                                s = void 0
                            }
                            if (s === void 0)
                                break;
                            if (e += s,
                            4096 < e) {
                                e = t;
                                break e
                            }
                            if (e === 4096 || t === this.j.length - 1) {
                                e = t + 1;
                                break e
                            }
                        }
                        e = 1e3
                    }
                else
                    e = 1e3;
                e = xu(this, i, e),
                t = Ne(this.I),
                P(t, "RID", n),
                P(t, "CVER", 22),
                this.F && P(t, "X-HTTP-Session-Id", this.F),
                qn(this, t),
                r && (this.O ? e = "headers=" + encodeURIComponent(String(Pu(r))) + "&" + e : this.o && Hr(t, this.o, r)),
                qr(this.i, i),
                this.bb && P(t, "TYPE", "init"),
                this.P ? (P(t, "$req", e),
                P(t, "SID", "null"),
                i.aa = !0,
                Xi(i, t, null)) : Xi(i, t, e),
                this.H = 2
            }
        } else
            this.H == 3 && (n ? da(this, n) : this.j.length == 0 || Su(this.i) || da(this))
}
;
function da(n, e) {
    var t;
    e ? t = e.m : t = n.W++;
    const s = Ne(n.I);
    P(s, "SID", n.K),
    P(s, "RID", t),
    P(s, "AID", n.V),
    qn(n, s),
    n.o && n.s && Hr(s, n.o, n.s),
    t = new Vn(n,n.l,t,n.C + 1),
    n.o === null && (t.I = n.s),
    e && (n.j = e.F.concat(n.j)),
    e = xu(n, t, 1e3),
    t.setTimeout(Math.round(.5 * n.xa) + Math.round(.5 * n.xa * Math.random())),
    qr(n.i, t),
    Xi(t, s, e)
}
function qn(n, e) {
    n.na && Rr(n.na, function(t, s) {
        P(e, s, t)
    }),
    n.h && vu({}, function(t, s) {
        P(e, s, t)
    })
}
function xu(n, e, t) {
    t = Math.min(n.j.length, t);
    var s = n.h ? te(n.h.Va, n.h, n) : null;
    e: {
        var i = n.j;
        let r = -1;
        for (; ; ) {
            const o = ["count=" + t];
            r == -1 ? 0 < t ? (r = i[0].g,
            o.push("ofs=" + r)) : r = 0 : o.push("ofs=" + r);
            let a = !0;
            for (let c = 0; c < t; c++) {
                let u = i[c].g;
                const l = i[c].map;
                if (u -= r,
                0 > u)
                    r = Math.max(0, i[c].g - 100),
                    a = !1;
                else
                    try {
                        Vg(l, o, "req" + u + "_")
                    } catch {
                        s && s(l)
                    }
            }
            if (a) {
                s = o.join("&");
                break e
            }
        }
    }
    return n = n.j.splice(0, t),
    e.F = n,
    s
}
function Fu(n) {
    if (!n.g && !n.u) {
        n.ba = 1;
        var e = n.Ma;
        gn || iu(),
        mn || (gn(),
        mn = !0),
        Fr.add(e, n),
        n.A = 0
    }
}
function Gr(n) {
    return n.g || n.u || 3 <= n.A ? !1 : (n.ba++,
    n.u = Fn(te(n.Ma, n), $u(n, n.A)),
    n.A++,
    !0)
}
m.Ma = function() {
    if (this.u = null,
    Uu(this),
    this.ca && !(this.M || this.g == null || 0 >= this.S)) {
        var n = 2 * this.S;
        this.l.info("BP detection timer enabled: " + n),
        this.B = Fn(te(this.jb, this), n)
    }
}
;
m.jb = function() {
    this.B && (this.B = null,
    this.l.info("BP detection timeout reached."),
    this.l.info("Buffering proxy detected and switch to long-polling!"),
    this.G = !1,
    this.M = !0,
    oe(10),
    ti(this),
    Uu(this))
}
;
function Wr(n) {
    n.B != null && (T.clearTimeout(n.B),
    n.B = null)
}
function Uu(n) {
    n.g = new Vn(n,n.l,"rpc",n.ba),
    n.o === null && (n.g.I = n.s),
    n.g.O = 0;
    var e = Ne(n.wa);
    P(e, "RID", "rpc"),
    P(e, "SID", n.K),
    P(e, "AID", n.V),
    P(e, "CI", n.G ? "0" : "1"),
    !n.G && n.qa && P(e, "TO", n.qa),
    P(e, "TYPE", "xmlhttp"),
    qn(n, e),
    n.o && n.s && Hr(e, n.o, n.s),
    n.L && n.g.setTimeout(n.L);
    var t = n.g;
    n = n.pa,
    t.L = 1,
    t.v = Xs(Ne(e)),
    t.s = null,
    t.S = !0,
    pu(t, n)
}
m.ib = function() {
    this.v != null && (this.v = null,
    ti(this),
    Gr(this),
    oe(19))
}
;
function ks(n) {
    n.v != null && (T.clearTimeout(n.v),
    n.v = null)
}
function Vu(n, e) {
    var t = null;
    if (n.g == e) {
        ks(n),
        Wr(n),
        n.g = null;
        var s = 2
    } else if (er(n.i, e))
        t = e.F,
        Cu(n.i, e),
        s = 1;
    else
        return;
    if (n.H != 0) {
        if (e.i)
            if (s == 1) {
                t = e.s ? e.s.length : 0,
                e = Date.now() - e.G;
                var i = n.C;
                s = Ws(),
                Y(s, new lu(s,t)),
                ni(n)
            } else
                Fu(n);
        else if (i = e.o,
        i == 3 || i == 0 && 0 < e.ca || !(s == 1 && Kg(n, e) || s == 2 && Gr(n)))
            switch (t && 0 < t.length && (e = n.i,
            e.i = e.i.concat(t)),
            i) {
            case 1:
                nt(n, 5);
                break;
            case 4:
                nt(n, 10);
                break;
            case 3:
                nt(n, 6);
                break;
            default:
                nt(n, 2)
            }
    }
}
function $u(n, e) {
    let t = n.ab + Math.floor(Math.random() * n.hb);
    return n.isActive() || (t *= 2),
    t * e
}
function nt(n, e) {
    if (n.l.info("Error code " + e),
    e == 2) {
        var t = null;
        n.h && (t = null);
        var s = te(n.pb, n);
        t || (t = new rt("//www.google.com/images/cleardot.gif"),
        T.location && T.location.protocol == "http" || Cs(t, "https"),
        Xs(t)),
        $g(t.toString(), s)
    } else
        oe(2);
    n.H = 0,
    n.h && n.h.za(e),
    Bu(n),
    Lu(n)
}
m.pb = function(n) {
    n ? (this.l.info("Successfully pinged google.com"),
    oe(2)) : (this.l.info("Failed to ping google.com"),
    oe(1))
}
;
function Bu(n) {
    if (n.H = 0,
    n.ma = [],
    n.h) {
        const e = bu(n.i);
        (e.length != 0 || n.j.length != 0) && (na(n.ma, e),
        na(n.ma, n.j),
        n.i.i.length = 0,
        Dr(n.j),
        n.j.length = 0),
        n.h.ya()
    }
}
function ju(n, e, t) {
    var s = t instanceof rt ? Ne(t) : new rt(t);
    if (s.g != "")
        e && (s.g = e + "." + s.g),
        bs(s, s.m);
    else {
        var i = T.location;
        s = i.protocol,
        e = e ? e + "." + i.hostname : i.hostname,
        i = +i.port;
        var r = new rt(null);
        s && Cs(r, s),
        e && (r.g = e),
        i && bs(r, i),
        t && (r.l = t),
        s = r
    }
    return t = n.F,
    e = n.Da,
    t && e && P(s, t, e),
    P(s, "VER", n.ra),
    qn(n, s),
    s
}
function qu(n, e, t) {
    if (e && !n.J)
        throw Error("Can't create secondary domain capable XhrIo object.");
    return e = t && n.Ha && !n.va ? new F(new Bn({
        ob: !0
    })) : new F(n.va),
    e.Oa(n.J),
    e
}
m.isActive = function() {
    return !!this.h && this.h.isActive(this)
}
;
function zu() {}
m = zu.prototype;
m.Ba = function() {}
;
m.Aa = function() {}
;
m.za = function() {}
;
m.ya = function() {}
;
m.isActive = function() {
    return !0
}
;
m.Va = function() {}
;
function Ds() {
    if (Mt && !(10 <= Number(rg)))
        throw Error("Environmental error: no available transport.")
}
Ds.prototype.g = function(n, e) {
    return new he(n,e)
}
;
function he(n, e) {
    K.call(this),
    this.g = new Mu(e),
    this.l = n,
    this.h = e && e.messageUrlParams || null,
    n = e && e.messageHeaders || null,
    e && e.clientProtocolHeaderRequired && (n ? n["X-Client-Protocol"] = "webchannel" : n = {
        "X-Client-Protocol": "webchannel"
    }),
    this.g.s = n,
    n = e && e.initMessageHeaders || null,
    e && e.messageContentType && (n ? n["X-WebChannel-Content-Type"] = e.messageContentType : n = {
        "X-WebChannel-Content-Type": e.messageContentType
    }),
    e && e.Ca && (n ? n["X-WebChannel-Client-Profile"] = e.Ca : n = {
        "X-WebChannel-Client-Profile": e.Ca
    }),
    this.g.U = n,
    (n = e && e.cc) && !fn(n) && (this.g.o = n),
    this.A = e && e.supportsCrossDomainXhr || !1,
    this.v = e && e.sendRawJson || !1,
    (e = e && e.httpSessionIdParam) && !fn(e) && (this.g.F = e,
    n = this.h,
    n !== null && e in n && (n = this.h,
    e in n && delete n[e])),
    this.j = new zt(this)
}
G(he, K);
he.prototype.m = function() {
    this.g.h = this.j,
    this.A && (this.g.J = !0);
    var n = this.g
      , e = this.l
      , t = this.h || void 0;
    oe(0),
    n.Y = e,
    n.na = t || {},
    n.G = n.aa,
    n.I = ju(n, null, n.Y),
    ni(n)
}
;
he.prototype.close = function() {
    Kr(this.g)
}
;
he.prototype.u = function(n) {
    var e = this.g;
    if (typeof n == "string") {
        var t = {};
        t.__data__ = n,
        n = t
    } else
        this.v && (t = {},
        t.__data__ = xr(n),
        n = t);
    e.j.push(new Lg(e.fb++,n)),
    e.H == 3 && ni(e)
}
;
he.prototype.N = function() {
    this.g.h = null,
    delete this.j,
    Kr(this.g),
    delete this.g,
    he.$.N.call(this)
}
;
function Hu(n) {
    Br.call(this),
    n.__headers__ && (this.headers = n.__headers__,
    this.statusCode = n.__status__,
    delete n.__headers__,
    delete n.__status__);
    var e = n.__sm__;
    if (e) {
        e: {
            for (const t in e) {
                n = t;
                break e
            }
            n = void 0
        }
        (this.i = n) && (n = this.i,
        e = e !== null && n in e ? e[n] : void 0),
        this.data = e
    } else
        this.data = n
}
G(Hu, Br);
function Ku() {
    jr.call(this),
    this.status = 1
}
G(Ku, jr);
function zt(n) {
    this.g = n
}
G(zt, zu);
zt.prototype.Ba = function() {
    Y(this.g, "a")
}
;
zt.prototype.Aa = function(n) {
    Y(this.g, new Hu(n))
}
;
zt.prototype.za = function(n) {
    Y(this.g, new Ku)
}
;
zt.prototype.ya = function() {
    Y(this.g, "b")
}
;
function Gg() {
    this.blockSize = -1
}
function pe() {
    this.blockSize = -1,
    this.blockSize = 64,
    this.g = Array(4),
    this.m = Array(this.blockSize),
    this.i = this.h = 0,
    this.reset()
}
G(pe, Gg);
pe.prototype.reset = function() {
    this.g[0] = 1732584193,
    this.g[1] = 4023233417,
    this.g[2] = 2562383102,
    this.g[3] = 271733878,
    this.i = this.h = 0
}
;
function Oi(n, e, t) {
    t || (t = 0);
    var s = Array(16);
    if (typeof e == "string")
        for (var i = 0; 16 > i; ++i)
            s[i] = e.charCodeAt(t++) | e.charCodeAt(t++) << 8 | e.charCodeAt(t++) << 16 | e.charCodeAt(t++) << 24;
    else
        for (i = 0; 16 > i; ++i)
            s[i] = e[t++] | e[t++] << 8 | e[t++] << 16 | e[t++] << 24;
    e = n.g[0],
    t = n.g[1],
    i = n.g[2];
    var r = n.g[3]
      , o = e + (r ^ t & (i ^ r)) + s[0] + 3614090360 & 4294967295;
    e = t + (o << 7 & 4294967295 | o >>> 25),
    o = r + (i ^ e & (t ^ i)) + s[1] + 3905402710 & 4294967295,
    r = e + (o << 12 & 4294967295 | o >>> 20),
    o = i + (t ^ r & (e ^ t)) + s[2] + 606105819 & 4294967295,
    i = r + (o << 17 & 4294967295 | o >>> 15),
    o = t + (e ^ i & (r ^ e)) + s[3] + 3250441966 & 4294967295,
    t = i + (o << 22 & 4294967295 | o >>> 10),
    o = e + (r ^ t & (i ^ r)) + s[4] + 4118548399 & 4294967295,
    e = t + (o << 7 & 4294967295 | o >>> 25),
    o = r + (i ^ e & (t ^ i)) + s[5] + 1200080426 & 4294967295,
    r = e + (o << 12 & 4294967295 | o >>> 20),
    o = i + (t ^ r & (e ^ t)) + s[6] + 2821735955 & 4294967295,
    i = r + (o << 17 & 4294967295 | o >>> 15),
    o = t + (e ^ i & (r ^ e)) + s[7] + 4249261313 & 4294967295,
    t = i + (o << 22 & 4294967295 | o >>> 10),
    o = e + (r ^ t & (i ^ r)) + s[8] + 1770035416 & 4294967295,
    e = t + (o << 7 & 4294967295 | o >>> 25),
    o = r + (i ^ e & (t ^ i)) + s[9] + 2336552879 & 4294967295,
    r = e + (o << 12 & 4294967295 | o >>> 20),
    o = i + (t ^ r & (e ^ t)) + s[10] + 4294925233 & 4294967295,
    i = r + (o << 17 & 4294967295 | o >>> 15),
    o = t + (e ^ i & (r ^ e)) + s[11] + 2304563134 & 4294967295,
    t = i + (o << 22 & 4294967295 | o >>> 10),
    o = e + (r ^ t & (i ^ r)) + s[12] + 1804603682 & 4294967295,
    e = t + (o << 7 & 4294967295 | o >>> 25),
    o = r + (i ^ e & (t ^ i)) + s[13] + 4254626195 & 4294967295,
    r = e + (o << 12 & 4294967295 | o >>> 20),
    o = i + (t ^ r & (e ^ t)) + s[14] + 2792965006 & 4294967295,
    i = r + (o << 17 & 4294967295 | o >>> 15),
    o = t + (e ^ i & (r ^ e)) + s[15] + 1236535329 & 4294967295,
    t = i + (o << 22 & 4294967295 | o >>> 10),
    o = e + (i ^ r & (t ^ i)) + s[1] + 4129170786 & 4294967295,
    e = t + (o << 5 & 4294967295 | o >>> 27),
    o = r + (t ^ i & (e ^ t)) + s[6] + 3225465664 & 4294967295,
    r = e + (o << 9 & 4294967295 | o >>> 23),
    o = i + (e ^ t & (r ^ e)) + s[11] + 643717713 & 4294967295,
    i = r + (o << 14 & 4294967295 | o >>> 18),
    o = t + (r ^ e & (i ^ r)) + s[0] + 3921069994 & 4294967295,
    t = i + (o << 20 & 4294967295 | o >>> 12),
    o = e + (i ^ r & (t ^ i)) + s[5] + 3593408605 & 4294967295,
    e = t + (o << 5 & 4294967295 | o >>> 27),
    o = r + (t ^ i & (e ^ t)) + s[10] + 38016083 & 4294967295,
    r = e + (o << 9 & 4294967295 | o >>> 23),
    o = i + (e ^ t & (r ^ e)) + s[15] + 3634488961 & 4294967295,
    i = r + (o << 14 & 4294967295 | o >>> 18),
    o = t + (r ^ e & (i ^ r)) + s[4] + 3889429448 & 4294967295,
    t = i + (o << 20 & 4294967295 | o >>> 12),
    o = e + (i ^ r & (t ^ i)) + s[9] + 568446438 & 4294967295,
    e = t + (o << 5 & 4294967295 | o >>> 27),
    o = r + (t ^ i & (e ^ t)) + s[14] + 3275163606 & 4294967295,
    r = e + (o << 9 & 4294967295 | o >>> 23),
    o = i + (e ^ t & (r ^ e)) + s[3] + 4107603335 & 4294967295,
    i = r + (o << 14 & 4294967295 | o >>> 18),
    o = t + (r ^ e & (i ^ r)) + s[8] + 1163531501 & 4294967295,
    t = i + (o << 20 & 4294967295 | o >>> 12),
    o = e + (i ^ r & (t ^ i)) + s[13] + 2850285829 & 4294967295,
    e = t + (o << 5 & 4294967295 | o >>> 27),
    o = r + (t ^ i & (e ^ t)) + s[2] + 4243563512 & 4294967295,
    r = e + (o << 9 & 4294967295 | o >>> 23),
    o = i + (e ^ t & (r ^ e)) + s[7] + 1735328473 & 4294967295,
    i = r + (o << 14 & 4294967295 | o >>> 18),
    o = t + (r ^ e & (i ^ r)) + s[12] + 2368359562 & 4294967295,
    t = i + (o << 20 & 4294967295 | o >>> 12),
    o = e + (t ^ i ^ r) + s[5] + 4294588738 & 4294967295,
    e = t + (o << 4 & 4294967295 | o >>> 28),
    o = r + (e ^ t ^ i) + s[8] + 2272392833 & 4294967295,
    r = e + (o << 11 & 4294967295 | o >>> 21),
    o = i + (r ^ e ^ t) + s[11] + 1839030562 & 4294967295,
    i = r + (o << 16 & 4294967295 | o >>> 16),
    o = t + (i ^ r ^ e) + s[14] + 4259657740 & 4294967295,
    t = i + (o << 23 & 4294967295 | o >>> 9),
    o = e + (t ^ i ^ r) + s[1] + 2763975236 & 4294967295,
    e = t + (o << 4 & 4294967295 | o >>> 28),
    o = r + (e ^ t ^ i) + s[4] + 1272893353 & 4294967295,
    r = e + (o << 11 & 4294967295 | o >>> 21),
    o = i + (r ^ e ^ t) + s[7] + 4139469664 & 4294967295,
    i = r + (o << 16 & 4294967295 | o >>> 16),
    o = t + (i ^ r ^ e) + s[10] + 3200236656 & 4294967295,
    t = i + (o << 23 & 4294967295 | o >>> 9),
    o = e + (t ^ i ^ r) + s[13] + 681279174 & 4294967295,
    e = t + (o << 4 & 4294967295 | o >>> 28),
    o = r + (e ^ t ^ i) + s[0] + 3936430074 & 4294967295,
    r = e + (o << 11 & 4294967295 | o >>> 21),
    o = i + (r ^ e ^ t) + s[3] + 3572445317 & 4294967295,
    i = r + (o << 16 & 4294967295 | o >>> 16),
    o = t + (i ^ r ^ e) + s[6] + 76029189 & 4294967295,
    t = i + (o << 23 & 4294967295 | o >>> 9),
    o = e + (t ^ i ^ r) + s[9] + 3654602809 & 4294967295,
    e = t + (o << 4 & 4294967295 | o >>> 28),
    o = r + (e ^ t ^ i) + s[12] + 3873151461 & 4294967295,
    r = e + (o << 11 & 4294967295 | o >>> 21),
    o = i + (r ^ e ^ t) + s[15] + 530742520 & 4294967295,
    i = r + (o << 16 & 4294967295 | o >>> 16),
    o = t + (i ^ r ^ e) + s[2] + 3299628645 & 4294967295,
    t = i + (o << 23 & 4294967295 | o >>> 9),
    o = e + (i ^ (t | ~r)) + s[0] + 4096336452 & 4294967295,
    e = t + (o << 6 & 4294967295 | o >>> 26),
    o = r + (t ^ (e | ~i)) + s[7] + 1126891415 & 4294967295,
    r = e + (o << 10 & 4294967295 | o >>> 22),
    o = i + (e ^ (r | ~t)) + s[14] + 2878612391 & 4294967295,
    i = r + (o << 15 & 4294967295 | o >>> 17),
    o = t + (r ^ (i | ~e)) + s[5] + 4237533241 & 4294967295,
    t = i + (o << 21 & 4294967295 | o >>> 11),
    o = e + (i ^ (t | ~r)) + s[12] + 1700485571 & 4294967295,
    e = t + (o << 6 & 4294967295 | o >>> 26),
    o = r + (t ^ (e | ~i)) + s[3] + 2399980690 & 4294967295,
    r = e + (o << 10 & 4294967295 | o >>> 22),
    o = i + (e ^ (r | ~t)) + s[10] + 4293915773 & 4294967295,
    i = r + (o << 15 & 4294967295 | o >>> 17),
    o = t + (r ^ (i | ~e)) + s[1] + 2240044497 & 4294967295,
    t = i + (o << 21 & 4294967295 | o >>> 11),
    o = e + (i ^ (t | ~r)) + s[8] + 1873313359 & 4294967295,
    e = t + (o << 6 & 4294967295 | o >>> 26),
    o = r + (t ^ (e | ~i)) + s[15] + 4264355552 & 4294967295,
    r = e + (o << 10 & 4294967295 | o >>> 22),
    o = i + (e ^ (r | ~t)) + s[6] + 2734768916 & 4294967295,
    i = r + (o << 15 & 4294967295 | o >>> 17),
    o = t + (r ^ (i | ~e)) + s[13] + 1309151649 & 4294967295,
    t = i + (o << 21 & 4294967295 | o >>> 11),
    o = e + (i ^ (t | ~r)) + s[4] + 4149444226 & 4294967295,
    e = t + (o << 6 & 4294967295 | o >>> 26),
    o = r + (t ^ (e | ~i)) + s[11] + 3174756917 & 4294967295,
    r = e + (o << 10 & 4294967295 | o >>> 22),
    o = i + (e ^ (r | ~t)) + s[2] + 718787259 & 4294967295,
    i = r + (o << 15 & 4294967295 | o >>> 17),
    o = t + (r ^ (i | ~e)) + s[9] + 3951481745 & 4294967295,
    n.g[0] = n.g[0] + e & 4294967295,
    n.g[1] = n.g[1] + (i + (o << 21 & 4294967295 | o >>> 11)) & 4294967295,
    n.g[2] = n.g[2] + i & 4294967295,
    n.g[3] = n.g[3] + r & 4294967295
}
pe.prototype.j = function(n, e) {
    e === void 0 && (e = n.length);
    for (var t = e - this.blockSize, s = this.m, i = this.h, r = 0; r < e; ) {
        if (i == 0)
            for (; r <= t; )
                Oi(this, n, r),
                r += this.blockSize;
        if (typeof n == "string") {
            for (; r < e; )
                if (s[i++] = n.charCodeAt(r++),
                i == this.blockSize) {
                    Oi(this, s),
                    i = 0;
                    break
                }
        } else
            for (; r < e; )
                if (s[i++] = n[r++],
                i == this.blockSize) {
                    Oi(this, s),
                    i = 0;
                    break
                }
    }
    this.h = i,
    this.i += e
}
;
pe.prototype.l = function() {
    var n = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
    n[0] = 128;
    for (var e = 1; e < n.length - 8; ++e)
        n[e] = 0;
    var t = 8 * this.i;
    for (e = n.length - 8; e < n.length; ++e)
        n[e] = t & 255,
        t /= 256;
    for (this.j(n),
    n = Array(16),
    e = t = 0; 4 > e; ++e)
        for (var s = 0; 32 > s; s += 8)
            n[t++] = this.g[e] >>> s & 255;
    return n
}
;
function O(n, e) {
    this.h = e;
    for (var t = [], s = !0, i = n.length - 1; 0 <= i; i--) {
        var r = n[i] | 0;
        s && r == e || (t[i] = r,
        s = !1)
    }
    this.g = t
}
var Wg = {};
function Qr(n) {
    return -128 <= n && 128 > n ? ng(n, function(e) {
        return new O([e | 0],0 > e ? -1 : 0)
    }) : new O([n | 0],0 > n ? -1 : 0)
}
function ve(n) {
    if (isNaN(n) || !isFinite(n))
        return bt;
    if (0 > n)
        return Q(ve(-n));
    for (var e = [], t = 1, s = 0; n >= t; s++)
        e[s] = n / t | 0,
        t *= tr;
    return new O(e,0)
}
function Gu(n, e) {
    if (n.length == 0)
        throw Error("number format error: empty string");
    if (e = e || 10,
    2 > e || 36 < e)
        throw Error("radix out of range: " + e);
    if (n.charAt(0) == "-")
        return Q(Gu(n.substring(1), e));
    if (0 <= n.indexOf("-"))
        throw Error('number format error: interior "-" character');
    for (var t = ve(Math.pow(e, 8)), s = bt, i = 0; i < n.length; i += 8) {
        var r = Math.min(8, n.length - i)
          , o = parseInt(n.substring(i, i + r), e);
        8 > r ? (r = ve(Math.pow(e, r)),
        s = s.R(r).add(ve(o))) : (s = s.R(t),
        s = s.add(ve(o)))
    }
    return s
}
var tr = 4294967296
  , bt = Qr(0)
  , nr = Qr(1)
  , fa = Qr(16777216);
m = O.prototype;
m.ea = function() {
    if (de(this))
        return -Q(this).ea();
    for (var n = 0, e = 1, t = 0; t < this.g.length; t++) {
        var s = this.D(t);
        n += (0 <= s ? s : tr + s) * e,
        e *= tr
    }
    return n
}
;
m.toString = function(n) {
    if (n = n || 10,
    2 > n || 36 < n)
        throw Error("radix out of range: " + n);
    if (Ae(this))
        return "0";
    if (de(this))
        return "-" + Q(this).toString(n);
    for (var e = ve(Math.pow(n, 6)), t = this, s = ""; ; ) {
        var i = Rs(t, e).g;
        t = Ns(t, i.R(e));
        var r = ((0 < t.g.length ? t.g[0] : t.h) >>> 0).toString(n);
        if (t = i,
        Ae(t))
            return r + s;
        for (; 6 > r.length; )
            r = "0" + r;
        s = r + s
    }
}
;
m.D = function(n) {
    return 0 > n ? 0 : n < this.g.length ? this.g[n] : this.h
}
;
function Ae(n) {
    if (n.h != 0)
        return !1;
    for (var e = 0; e < n.g.length; e++)
        if (n.g[e] != 0)
            return !1;
    return !0
}
function de(n) {
    return n.h == -1
}
m.X = function(n) {
    return n = Ns(this, n),
    de(n) ? -1 : Ae(n) ? 0 : 1
}
;
function Q(n) {
    for (var e = n.g.length, t = [], s = 0; s < e; s++)
        t[s] = ~n.g[s];
    return new O(t,~n.h).add(nr)
}
m.abs = function() {
    return de(this) ? Q(this) : this
}
;
m.add = function(n) {
    for (var e = Math.max(this.g.length, n.g.length), t = [], s = 0, i = 0; i <= e; i++) {
        var r = s + (this.D(i) & 65535) + (n.D(i) & 65535)
          , o = (r >>> 16) + (this.D(i) >>> 16) + (n.D(i) >>> 16);
        s = o >>> 16,
        r &= 65535,
        o &= 65535,
        t[i] = o << 16 | r
    }
    return new O(t,t[t.length - 1] & -2147483648 ? -1 : 0)
}
;
function Ns(n, e) {
    return n.add(Q(e))
}
m.R = function(n) {
    if (Ae(this) || Ae(n))
        return bt;
    if (de(this))
        return de(n) ? Q(this).R(Q(n)) : Q(Q(this).R(n));
    if (de(n))
        return Q(this.R(Q(n)));
    if (0 > this.X(fa) && 0 > n.X(fa))
        return ve(this.ea() * n.ea());
    for (var e = this.g.length + n.g.length, t = [], s = 0; s < 2 * e; s++)
        t[s] = 0;
    for (s = 0; s < this.g.length; s++)
        for (var i = 0; i < n.g.length; i++) {
            var r = this.D(s) >>> 16
              , o = this.D(s) & 65535
              , a = n.D(i) >>> 16
              , c = n.D(i) & 65535;
            t[2 * s + 2 * i] += o * c,
            ss(t, 2 * s + 2 * i),
            t[2 * s + 2 * i + 1] += r * c,
            ss(t, 2 * s + 2 * i + 1),
            t[2 * s + 2 * i + 1] += o * a,
            ss(t, 2 * s + 2 * i + 1),
            t[2 * s + 2 * i + 2] += r * a,
            ss(t, 2 * s + 2 * i + 2)
        }
    for (s = 0; s < e; s++)
        t[s] = t[2 * s + 1] << 16 | t[2 * s];
    for (s = e; s < 2 * e; s++)
        t[s] = 0;
    return new O(t,0)
}
;
function ss(n, e) {
    for (; (n[e] & 65535) != n[e]; )
        n[e + 1] += n[e] >>> 16,
        n[e] &= 65535,
        e++
}
function Jt(n, e) {
    this.g = n,
    this.h = e
}
function Rs(n, e) {
    if (Ae(e))
        throw Error("division by zero");
    if (Ae(n))
        return new Jt(bt,bt);
    if (de(n))
        return e = Rs(Q(n), e),
        new Jt(Q(e.g),Q(e.h));
    if (de(e))
        return e = Rs(n, Q(e)),
        new Jt(Q(e.g),e.h);
    if (30 < n.g.length) {
        if (de(n) || de(e))
            throw Error("slowDivide_ only works with positive integers.");
        for (var t = nr, s = e; 0 >= s.X(n); )
            t = pa(t),
            s = pa(s);
        var i = wt(t, 1)
          , r = wt(s, 1);
        for (s = wt(s, 2),
        t = wt(t, 2); !Ae(s); ) {
            var o = r.add(s);
            0 >= o.X(n) && (i = i.add(t),
            r = o),
            s = wt(s, 1),
            t = wt(t, 1)
        }
        return e = Ns(n, i.R(e)),
        new Jt(i,e)
    }
    for (i = bt; 0 <= n.X(e); ) {
        for (t = Math.max(1, Math.floor(n.ea() / e.ea())),
        s = Math.ceil(Math.log(t) / Math.LN2),
        s = 48 >= s ? 1 : Math.pow(2, s - 48),
        r = ve(t),
        o = r.R(e); de(o) || 0 < o.X(n); )
            t -= s,
            r = ve(t),
            o = r.R(e);
        Ae(r) && (r = nr),
        i = i.add(r),
        n = Ns(n, o)
    }
    return new Jt(i,n)
}
m.gb = function(n) {
    return Rs(this, n).h
}
;
m.and = function(n) {
    for (var e = Math.max(this.g.length, n.g.length), t = [], s = 0; s < e; s++)
        t[s] = this.D(s) & n.D(s);
    return new O(t,this.h & n.h)
}
;
m.or = function(n) {
    for (var e = Math.max(this.g.length, n.g.length), t = [], s = 0; s < e; s++)
        t[s] = this.D(s) | n.D(s);
    return new O(t,this.h | n.h)
}
;
m.xor = function(n) {
    for (var e = Math.max(this.g.length, n.g.length), t = [], s = 0; s < e; s++)
        t[s] = this.D(s) ^ n.D(s);
    return new O(t,this.h ^ n.h)
}
;
function pa(n) {
    for (var e = n.g.length + 1, t = [], s = 0; s < e; s++)
        t[s] = n.D(s) << 1 | n.D(s - 1) >>> 31;
    return new O(t,n.h)
}
function wt(n, e) {
    var t = e >> 5;
    e %= 32;
    for (var s = n.g.length - t, i = [], r = 0; r < s; r++)
        i[r] = 0 < e ? n.D(r + t) >>> e | n.D(r + t + 1) << 32 - e : n.D(r + t);
    return new O(i,n.h)
}
Ds.prototype.createWebChannel = Ds.prototype.g;
he.prototype.send = he.prototype.u;
he.prototype.open = he.prototype.m;
he.prototype.close = he.prototype.close;
Qs.NO_ERROR = 0;
Qs.TIMEOUT = 8;
Qs.HTTP_ERROR = 6;
hu.COMPLETE = "complete";
du.EventType = Un;
Un.OPEN = "a";
Un.CLOSE = "b";
Un.ERROR = "c";
Un.MESSAGE = "d";
K.prototype.listen = K.prototype.O;
F.prototype.listenOnce = F.prototype.P;
F.prototype.getLastError = F.prototype.Sa;
F.prototype.getLastErrorCode = F.prototype.Ia;
F.prototype.getStatus = F.prototype.da;
F.prototype.getResponseJson = F.prototype.Wa;
F.prototype.getResponseText = F.prototype.ja;
F.prototype.send = F.prototype.ha;
F.prototype.setWithCredentials = F.prototype.Oa;
pe.prototype.digest = pe.prototype.l;
pe.prototype.reset = pe.prototype.reset;
pe.prototype.update = pe.prototype.j;
O.prototype.add = O.prototype.add;
O.prototype.multiply = O.prototype.R;
O.prototype.modulo = O.prototype.gb;
O.prototype.compare = O.prototype.X;
O.prototype.toNumber = O.prototype.ea;
O.prototype.toString = O.prototype.toString;
O.prototype.getBits = O.prototype.D;
O.fromNumber = ve;
O.fromString = Gu;
var Qg = function() {
    return new Ds
}
  , Yg = function() {
    return Ws()
}
  , Pi = Qs
  , Jg = hu
  , Xg = pt
  , ga = {
    xb: 0,
    Ab: 1,
    Bb: 2,
    Ub: 3,
    Zb: 4,
    Wb: 5,
    Xb: 6,
    Vb: 7,
    Tb: 8,
    Yb: 9,
    PROXY: 10,
    NOPROXY: 11,
    Rb: 12,
    Nb: 13,
    Ob: 14,
    Mb: 15,
    Pb: 16,
    Qb: 17,
    tb: 18,
    sb: 19,
    ub: 20
}
  , Zg = Bn
  , is = du
  , em = F
  , tm = pe
  , kt = O;
const ma = "@firebase/firestore";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class X {
    constructor(e) {
        this.uid = e
    }
    isAuthenticated() {
        return this.uid != null
    }
    toKey() {
        return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user"
    }
    isEqual(e) {
        return e.uid === this.uid
    }
}
X.UNAUTHENTICATED = new X(null),
X.GOOGLE_CREDENTIALS = new X("google-credentials-uid"),
X.FIRST_PARTY = new X("first-party-uid"),
X.MOCK_USER = new X("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Ht = "9.23.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const lt = new vr("@firebase/firestore");
function ya() {
    return lt.logLevel
}
function v(n, ...e) {
    if (lt.logLevel <= N.DEBUG) {
        const t = e.map(Yr);
        lt.debug(`Firestore (${Ht}): ${n}`, ...t)
    }
}
function Re(n, ...e) {
    if (lt.logLevel <= N.ERROR) {
        const t = e.map(Yr);
        lt.error(`Firestore (${Ht}): ${n}`, ...t)
    }
}
function Lt(n, ...e) {
    if (lt.logLevel <= N.WARN) {
        const t = e.map(Yr);
        lt.warn(`Firestore (${Ht}): ${n}`, ...t)
    }
}
function Yr(n) {
    if (typeof n == "string")
        return n;
    try {
        return e = n,
        JSON.stringify(e)
    } catch {
        return n
    }
    /**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
    var e
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function I(n="Unexpected state") {
    const e = `FIRESTORE (${Ht}) INTERNAL ASSERTION FAILED: ` + n;
    throw Re(e),
    new Error(e)
}
function L(n, e) {
    n || I()
}
function b(n, e) {
    return n
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const d = {
    OK: "ok",
    CANCELLED: "cancelled",
    UNKNOWN: "unknown",
    INVALID_ARGUMENT: "invalid-argument",
    DEADLINE_EXCEEDED: "deadline-exceeded",
    NOT_FOUND: "not-found",
    ALREADY_EXISTS: "already-exists",
    PERMISSION_DENIED: "permission-denied",
    UNAUTHENTICATED: "unauthenticated",
    RESOURCE_EXHAUSTED: "resource-exhausted",
    FAILED_PRECONDITION: "failed-precondition",
    ABORTED: "aborted",
    OUT_OF_RANGE: "out-of-range",
    UNIMPLEMENTED: "unimplemented",
    INTERNAL: "internal",
    UNAVAILABLE: "unavailable",
    DATA_LOSS: "data-loss"
};
class y extends Me {
    constructor(e, t) {
        super(e, t),
        this.code = e,
        this.message = t,
        this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ce {
    constructor() {
        this.promise = new Promise( (e, t) => {
            this.resolve = e,
            this.reject = t
        }
        )
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Wu {
    constructor(e, t) {
        this.user = t,
        this.type = "OAuth",
        this.headers = new Map,
        this.headers.set("Authorization", `Bearer ${e}`)
    }
}
class nm {
    getToken() {
        return Promise.resolve(null)
    }
    invalidateToken() {}
    start(e, t) {
        e.enqueueRetryable( () => t(X.UNAUTHENTICATED))
    }
    shutdown() {}
}
class sm {
    constructor(e) {
        this.token = e,
        this.changeListener = null
    }
    getToken() {
        return Promise.resolve(this.token)
    }
    invalidateToken() {}
    start(e, t) {
        this.changeListener = t,
        e.enqueueRetryable( () => t(this.token.user))
    }
    shutdown() {
        this.changeListener = null
    }
}
class im {
    constructor(e) {
        this.t = e,
        this.currentUser = X.UNAUTHENTICATED,
        this.i = 0,
        this.forceRefresh = !1,
        this.auth = null
    }
    start(e, t) {
        let s = this.i;
        const i = c => this.i !== s ? (s = this.i,
        t(c)) : Promise.resolve();
        let r = new Ce;
        this.o = () => {
            this.i++,
            this.currentUser = this.u(),
            r.resolve(),
            r = new Ce,
            e.enqueueRetryable( () => i(this.currentUser))
        }
        ;
        const o = () => {
            const c = r;
            e.enqueueRetryable(async () => {
                await c.promise,
                await i(this.currentUser)
            }
            )
        }
          , a = c => {
            v("FirebaseAuthCredentialsProvider", "Auth detected"),
            this.auth = c,
            this.auth.addAuthTokenListener(this.o),
            o()
        }
        ;
        this.t.onInit(c => a(c)),
        setTimeout( () => {
            if (!this.auth) {
                const c = this.t.getImmediate({
                    optional: !0
                });
                c ? a(c) : (v("FirebaseAuthCredentialsProvider", "Auth not yet detected"),
                r.resolve(),
                r = new Ce)
            }
        }
        , 0),
        o()
    }
    getToken() {
        const e = this.i
          , t = this.forceRefresh;
        return this.forceRefresh = !1,
        this.auth ? this.auth.getToken(t).then(s => this.i !== e ? (v("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."),
        this.getToken()) : s ? (L(typeof s.accessToken == "string"),
        new Wu(s.accessToken,this.currentUser)) : null) : Promise.resolve(null)
    }
    invalidateToken() {
        this.forceRefresh = !0
    }
    shutdown() {
        this.auth && this.auth.removeAuthTokenListener(this.o)
    }
    u() {
        const e = this.auth && this.auth.getUid();
        return L(e === null || typeof e == "string"),
        new X(e)
    }
}
class rm {
    constructor(e, t, s) {
        this.h = e,
        this.l = t,
        this.m = s,
        this.type = "FirstParty",
        this.user = X.FIRST_PARTY,
        this.g = new Map
    }
    p() {
        return this.m ? this.m() : null
    }
    get headers() {
        this.g.set("X-Goog-AuthUser", this.h);
        const e = this.p();
        return e && this.g.set("Authorization", e),
        this.l && this.g.set("X-Goog-Iam-Authorization-Token", this.l),
        this.g
    }
}
class om {
    constructor(e, t, s) {
        this.h = e,
        this.l = t,
        this.m = s
    }
    getToken() {
        return Promise.resolve(new rm(this.h,this.l,this.m))
    }
    start(e, t) {
        e.enqueueRetryable( () => t(X.FIRST_PARTY))
    }
    shutdown() {}
    invalidateToken() {}
}
class am {
    constructor(e) {
        this.value = e,
        this.type = "AppCheck",
        this.headers = new Map,
        e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value)
    }
}
class cm {
    constructor(e) {
        this.I = e,
        this.forceRefresh = !1,
        this.appCheck = null,
        this.T = null
    }
    start(e, t) {
        const s = r => {
            r.error != null && v("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${r.error.message}`);
            const o = r.token !== this.T;
            return this.T = r.token,
            v("FirebaseAppCheckTokenProvider", `Received ${o ? "new" : "existing"} token.`),
            o ? t(r.token) : Promise.resolve()
        }
        ;
        this.o = r => {
            e.enqueueRetryable( () => s(r))
        }
        ;
        const i = r => {
            v("FirebaseAppCheckTokenProvider", "AppCheck detected"),
            this.appCheck = r,
            this.appCheck.addTokenListener(this.o)
        }
        ;
        this.I.onInit(r => i(r)),
        setTimeout( () => {
            if (!this.appCheck) {
                const r = this.I.getImmediate({
                    optional: !0
                });
                r ? i(r) : v("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
            }
        }
        , 0)
    }
    getToken() {
        const e = this.forceRefresh;
        return this.forceRefresh = !1,
        this.appCheck ? this.appCheck.getToken(e).then(t => t ? (L(typeof t.token == "string"),
        this.T = t.token,
        new am(t.token)) : null) : Promise.resolve(null)
    }
    invalidateToken() {
        this.forceRefresh = !0
    }
    shutdown() {
        this.appCheck && this.appCheck.removeTokenListener(this.o)
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function um(n) {
    const e = typeof self < "u" && (self.crypto || self.msCrypto)
      , t = new Uint8Array(n);
    if (e && typeof e.getRandomValues == "function")
        e.getRandomValues(t);
    else
        for (let s = 0; s < n; s++)
            t[s] = Math.floor(256 * Math.random());
    return t
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Qu {
    static A() {
        const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
          , t = Math.floor(256 / e.length) * e.length;
        let s = "";
        for (; s.length < 20; ) {
            const i = um(40);
            for (let r = 0; r < i.length; ++r)
                s.length < 20 && i[r] < t && (s += e.charAt(i[r] % e.length))
        }
        return s
    }
}
function R(n, e) {
    return n < e ? -1 : n > e ? 1 : 0
}
function xt(n, e, t) {
    return n.length === e.length && n.every( (s, i) => t(s, e[i]))
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class q {
    constructor(e, t) {
        if (this.seconds = e,
        this.nanoseconds = t,
        t < 0)
            throw new y(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: " + t);
        if (t >= 1e9)
            throw new y(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: " + t);
        if (e < -62135596800)
            throw new y(d.INVALID_ARGUMENT,"Timestamp seconds out of range: " + e);
        if (e >= 253402300800)
            throw new y(d.INVALID_ARGUMENT,"Timestamp seconds out of range: " + e)
    }
    static now() {
        return q.fromMillis(Date.now())
    }
    static fromDate(e) {
        return q.fromMillis(e.getTime())
    }
    static fromMillis(e) {
        const t = Math.floor(e / 1e3)
          , s = Math.floor(1e6 * (e - 1e3 * t));
        return new q(t,s)
    }
    toDate() {
        return new Date(this.toMillis())
    }
    toMillis() {
        return 1e3 * this.seconds + this.nanoseconds / 1e6
    }
    _compareTo(e) {
        return this.seconds === e.seconds ? R(this.nanoseconds, e.nanoseconds) : R(this.seconds, e.seconds)
    }
    isEqual(e) {
        return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds
    }
    toString() {
        return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")"
    }
    toJSON() {
        return {
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
        }
    }
    valueOf() {
        const e = this.seconds - -62135596800;
        return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0")
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class S {
    constructor(e) {
        this.timestamp = e
    }
    static fromTimestamp(e) {
        return new S(e)
    }
    static min() {
        return new S(new q(0,0))
    }
    static max() {
        return new S(new q(253402300799,999999999))
    }
    compareTo(e) {
        return this.timestamp._compareTo(e.timestamp)
    }
    isEqual(e) {
        return this.timestamp.isEqual(e.timestamp)
    }
    toMicroseconds() {
        return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3
    }
    toString() {
        return "SnapshotVersion(" + this.timestamp.toString() + ")"
    }
    toTimestamp() {
        return this.timestamp
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class In {
    constructor(e, t, s) {
        t === void 0 ? t = 0 : t > e.length && I(),
        s === void 0 ? s = e.length - t : s > e.length - t && I(),
        this.segments = e,
        this.offset = t,
        this.len = s
    }
    get length() {
        return this.len
    }
    isEqual(e) {
        return In.comparator(this, e) === 0
    }
    child(e) {
        const t = this.segments.slice(this.offset, this.limit());
        return e instanceof In ? e.forEach(s => {
            t.push(s)
        }
        ) : t.push(e),
        this.construct(t)
    }
    limit() {
        return this.offset + this.length
    }
    popFirst(e) {
        return e = e === void 0 ? 1 : e,
        this.construct(this.segments, this.offset + e, this.length - e)
    }
    popLast() {
        return this.construct(this.segments, this.offset, this.length - 1)
    }
    firstSegment() {
        return this.segments[this.offset]
    }
    lastSegment() {
        return this.get(this.length - 1)
    }
    get(e) {
        return this.segments[this.offset + e]
    }
    isEmpty() {
        return this.length === 0
    }
    isPrefixOf(e) {
        if (e.length < this.length)
            return !1;
        for (let t = 0; t < this.length; t++)
            if (this.get(t) !== e.get(t))
                return !1;
        return !0
    }
    isImmediateParentOf(e) {
        if (this.length + 1 !== e.length)
            return !1;
        for (let t = 0; t < this.length; t++)
            if (this.get(t) !== e.get(t))
                return !1;
        return !0
    }
    forEach(e) {
        for (let t = this.offset, s = this.limit(); t < s; t++)
            e(this.segments[t])
    }
    toArray() {
        return this.segments.slice(this.offset, this.limit())
    }
    static comparator(e, t) {
        const s = Math.min(e.length, t.length);
        for (let i = 0; i < s; i++) {
            const r = e.get(i)
              , o = t.get(i);
            if (r < o)
                return -1;
            if (r > o)
                return 1
        }
        return e.length < t.length ? -1 : e.length > t.length ? 1 : 0
    }
}
class M extends In {
    construct(e, t, s) {
        return new M(e,t,s)
    }
    canonicalString() {
        return this.toArray().join("/")
    }
    toString() {
        return this.canonicalString()
    }
    static fromString(...e) {
        const t = [];
        for (const s of e) {
            if (s.indexOf("//") >= 0)
                throw new y(d.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);
            t.push(...s.split("/").filter(i => i.length > 0))
        }
        return new M(t)
    }
    static emptyPath() {
        return new M([])
    }
}
const lm = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
class ee extends In {
    construct(e, t, s) {
        return new ee(e,t,s)
    }
    static isValidIdentifier(e) {
        return lm.test(e)
    }
    canonicalString() {
        return this.toArray().map(e => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"),
        ee.isValidIdentifier(e) || (e = "`" + e + "`"),
        e)).join(".")
    }
    toString() {
        return this.canonicalString()
    }
    isKeyField() {
        return this.length === 1 && this.get(0) === "__name__"
    }
    static keyField() {
        return new ee(["__name__"])
    }
    static fromServerFormat(e) {
        const t = [];
        let s = ""
          , i = 0;
        const r = () => {
            if (s.length === 0)
                throw new y(d.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            t.push(s),
            s = ""
        }
        ;
        let o = !1;
        for (; i < e.length; ) {
            const a = e[i];
            if (a === "\\") {
                if (i + 1 === e.length)
                    throw new y(d.INVALID_ARGUMENT,"Path has trailing escape character: " + e);
                const c = e[i + 1];
                if (c !== "\\" && c !== "." && c !== "`")
                    throw new y(d.INVALID_ARGUMENT,"Path has invalid escape sequence: " + e);
                s += c,
                i += 2
            } else
                a === "`" ? (o = !o,
                i++) : a !== "." || o ? (s += a,
                i++) : (r(),
                i++)
        }
        if (r(),
        o)
            throw new y(d.INVALID_ARGUMENT,"Unterminated ` in path: " + e);
        return new ee(t)
    }
    static emptyPath() {
        return new ee([])
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class w {
    constructor(e) {
        this.path = e
    }
    static fromPath(e) {
        return new w(M.fromString(e))
    }
    static fromName(e) {
        return new w(M.fromString(e).popFirst(5))
    }
    static empty() {
        return new w(M.emptyPath())
    }
    get collectionGroup() {
        return this.path.popLast().lastSegment()
    }
    hasCollectionId(e) {
        return this.path.length >= 2 && this.path.get(this.path.length - 2) === e
    }
    getCollectionGroup() {
        return this.path.get(this.path.length - 2)
    }
    getCollectionPath() {
        return this.path.popLast()
    }
    isEqual(e) {
        return e !== null && M.comparator(this.path, e.path) === 0
    }
    toString() {
        return this.path.toString()
    }
    static comparator(e, t) {
        return M.comparator(e.path, t.path)
    }
    static isDocumentKey(e) {
        return e.length % 2 == 0
    }
    static fromSegments(e) {
        return new w(new M(e.slice()))
    }
}
function hm(n, e) {
    const t = n.toTimestamp().seconds
      , s = n.toTimestamp().nanoseconds + 1
      , i = S.fromTimestamp(s === 1e9 ? new q(t + 1,0) : new q(t,s));
    return new Ke(i,w.empty(),e)
}
function dm(n) {
    return new Ke(n.readTime,n.key,-1)
}
class Ke {
    constructor(e, t, s) {
        this.readTime = e,
        this.documentKey = t,
        this.largestBatchId = s
    }
    static min() {
        return new Ke(S.min(),w.empty(),-1)
    }
    static max() {
        return new Ke(S.max(),w.empty(),-1)
    }
}
function fm(n, e) {
    let t = n.readTime.compareTo(e.readTime);
    return t !== 0 ? t : (t = w.comparator(n.documentKey, e.documentKey),
    t !== 0 ? t : R(n.largestBatchId, e.largestBatchId))
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const pm = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
class gm {
    constructor() {
        this.onCommittedListeners = []
    }
    addOnCommittedListener(e) {
        this.onCommittedListeners.push(e)
    }
    raiseOnCommittedEvent() {
        this.onCommittedListeners.forEach(e => e())
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function zn(n) {
    if (n.code !== d.FAILED_PRECONDITION || n.message !== pm)
        throw n;
    v("LocalStore", "Unexpectedly lost primary lease")
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class p {
    constructor(e) {
        this.nextCallback = null,
        this.catchCallback = null,
        this.result = void 0,
        this.error = void 0,
        this.isDone = !1,
        this.callbackAttached = !1,
        e(t => {
            this.isDone = !0,
            this.result = t,
            this.nextCallback && this.nextCallback(t)
        }
        , t => {
            this.isDone = !0,
            this.error = t,
            this.catchCallback && this.catchCallback(t)
        }
        )
    }
    catch(e) {
        return this.next(void 0, e)
    }
    next(e, t) {
        return this.callbackAttached && I(),
        this.callbackAttached = !0,
        this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new p( (s, i) => {
            this.nextCallback = r => {
                this.wrapSuccess(e, r).next(s, i)
            }
            ,
            this.catchCallback = r => {
                this.wrapFailure(t, r).next(s, i)
            }
        }
        )
    }
    toPromise() {
        return new Promise( (e, t) => {
            this.next(e, t)
        }
        )
    }
    wrapUserFunction(e) {
        try {
            const t = e();
            return t instanceof p ? t : p.resolve(t)
        } catch (t) {
            return p.reject(t)
        }
    }
    wrapSuccess(e, t) {
        return e ? this.wrapUserFunction( () => e(t)) : p.resolve(t)
    }
    wrapFailure(e, t) {
        return e ? this.wrapUserFunction( () => e(t)) : p.reject(t)
    }
    static resolve(e) {
        return new p( (t, s) => {
            t(e)
        }
        )
    }
    static reject(e) {
        return new p( (t, s) => {
            s(e)
        }
        )
    }
    static waitFor(e) {
        return new p( (t, s) => {
            let i = 0
              , r = 0
              , o = !1;
            e.forEach(a => {
                ++i,
                a.next( () => {
                    ++r,
                    o && r === i && t()
                }
                , c => s(c))
            }
            ),
            o = !0,
            r === i && t()
        }
        )
    }
    static or(e) {
        let t = p.resolve(!1);
        for (const s of e)
            t = t.next(i => i ? p.resolve(i) : s());
        return t
    }
    static forEach(e, t) {
        const s = [];
        return e.forEach( (i, r) => {
            s.push(t.call(this, i, r))
        }
        ),
        this.waitFor(s)
    }
    static mapArray(e, t) {
        return new p( (s, i) => {
            const r = e.length
              , o = new Array(r);
            let a = 0;
            for (let c = 0; c < r; c++) {
                const u = c;
                t(e[u]).next(l => {
                    o[u] = l,
                    ++a,
                    a === r && s(o)
                }
                , l => i(l))
            }
        }
        )
    }
    static doWhile(e, t) {
        return new p( (s, i) => {
            const r = () => {
                e() === !0 ? t().next( () => {
                    r()
                }
                , i) : s()
            }
            ;
            r()
        }
        )
    }
}
function Hn(n) {
    return n.name === "IndexedDbTransactionError"
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Jr {
    constructor(e, t) {
        this.previousValue = e,
        t && (t.sequenceNumberHandler = s => this.ot(s),
        this.ut = s => t.writeSequenceNumber(s))
    }
    ot(e) {
        return this.previousValue = Math.max(e, this.previousValue),
        this.previousValue
    }
    next() {
        const e = ++this.previousValue;
        return this.ut && this.ut(e),
        e
    }
}
Jr.ct = -1;
function si(n) {
    return n == null
}
function Os(n) {
    return n === 0 && 1 / n == -1 / 0
}
function mm(n) {
    return typeof n == "number" && Number.isInteger(n) && !Os(n) && n <= Number.MAX_SAFE_INTEGER && n >= Number.MIN_SAFE_INTEGER
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function va(n) {
    let e = 0;
    for (const t in n)
        Object.prototype.hasOwnProperty.call(n, t) && e++;
    return e
}
function gt(n, e) {
    for (const t in n)
        Object.prototype.hasOwnProperty.call(n, t) && e(t, n[t])
}
function Yu(n) {
    for (const e in n)
        if (Object.prototype.hasOwnProperty.call(n, e))
            return !1;
    return !0
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class x {
    constructor(e, t) {
        this.comparator = e,
        this.root = t || W.EMPTY
    }
    insert(e, t) {
        return new x(this.comparator,this.root.insert(e, t, this.comparator).copy(null, null, W.BLACK, null, null))
    }
    remove(e) {
        return new x(this.comparator,this.root.remove(e, this.comparator).copy(null, null, W.BLACK, null, null))
    }
    get(e) {
        let t = this.root;
        for (; !t.isEmpty(); ) {
            const s = this.comparator(e, t.key);
            if (s === 0)
                return t.value;
            s < 0 ? t = t.left : s > 0 && (t = t.right)
        }
        return null
    }
    indexOf(e) {
        let t = 0
          , s = this.root;
        for (; !s.isEmpty(); ) {
            const i = this.comparator(e, s.key);
            if (i === 0)
                return t + s.left.size;
            i < 0 ? s = s.left : (t += s.left.size + 1,
            s = s.right)
        }
        return -1
    }
    isEmpty() {
        return this.root.isEmpty()
    }
    get size() {
        return this.root.size
    }
    minKey() {
        return this.root.minKey()
    }
    maxKey() {
        return this.root.maxKey()
    }
    inorderTraversal(e) {
        return this.root.inorderTraversal(e)
    }
    forEach(e) {
        this.inorderTraversal( (t, s) => (e(t, s),
        !1))
    }
    toString() {
        const e = [];
        return this.inorderTraversal( (t, s) => (e.push(`${t}:${s}`),
        !1)),
        `{${e.join(", ")}}`
    }
    reverseTraversal(e) {
        return this.root.reverseTraversal(e)
    }
    getIterator() {
        return new rs(this.root,null,this.comparator,!1)
    }
    getIteratorFrom(e) {
        return new rs(this.root,e,this.comparator,!1)
    }
    getReverseIterator() {
        return new rs(this.root,null,this.comparator,!0)
    }
    getReverseIteratorFrom(e) {
        return new rs(this.root,e,this.comparator,!0)
    }
}
class rs {
    constructor(e, t, s, i) {
        this.isReverse = i,
        this.nodeStack = [];
        let r = 1;
        for (; !e.isEmpty(); )
            if (r = t ? s(e.key, t) : 1,
            t && i && (r *= -1),
            r < 0)
                e = this.isReverse ? e.left : e.right;
            else {
                if (r === 0) {
                    this.nodeStack.push(e);
                    break
                }
                this.nodeStack.push(e),
                e = this.isReverse ? e.right : e.left
            }
    }
    getNext() {
        let e = this.nodeStack.pop();
        const t = {
            key: e.key,
            value: e.value
        };
        if (this.isReverse)
            for (e = e.left; !e.isEmpty(); )
                this.nodeStack.push(e),
                e = e.right;
        else
            for (e = e.right; !e.isEmpty(); )
                this.nodeStack.push(e),
                e = e.left;
        return t
    }
    hasNext() {
        return this.nodeStack.length > 0
    }
    peek() {
        if (this.nodeStack.length === 0)
            return null;
        const e = this.nodeStack[this.nodeStack.length - 1];
        return {
            key: e.key,
            value: e.value
        }
    }
}
class W {
    constructor(e, t, s, i, r) {
        this.key = e,
        this.value = t,
        this.color = s ?? W.RED,
        this.left = i ?? W.EMPTY,
        this.right = r ?? W.EMPTY,
        this.size = this.left.size + 1 + this.right.size
    }
    copy(e, t, s, i, r) {
        return new W(e ?? this.key,t ?? this.value,s ?? this.color,i ?? this.left,r ?? this.right)
    }
    isEmpty() {
        return !1
    }
    inorderTraversal(e) {
        return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e)
    }
    reverseTraversal(e) {
        return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e)
    }
    min() {
        return this.left.isEmpty() ? this : this.left.min()
    }
    minKey() {
        return this.min().key
    }
    maxKey() {
        return this.right.isEmpty() ? this.key : this.right.maxKey()
    }
    insert(e, t, s) {
        let i = this;
        const r = s(e, i.key);
        return i = r < 0 ? i.copy(null, null, null, i.left.insert(e, t, s), null) : r === 0 ? i.copy(null, t, null, null, null) : i.copy(null, null, null, null, i.right.insert(e, t, s)),
        i.fixUp()
    }
    removeMin() {
        if (this.left.isEmpty())
            return W.EMPTY;
        let e = this;
        return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()),
        e = e.copy(null, null, null, e.left.removeMin(), null),
        e.fixUp()
    }
    remove(e, t) {
        let s, i = this;
        if (t(e, i.key) < 0)
            i.left.isEmpty() || i.left.isRed() || i.left.left.isRed() || (i = i.moveRedLeft()),
            i = i.copy(null, null, null, i.left.remove(e, t), null);
        else {
            if (i.left.isRed() && (i = i.rotateRight()),
            i.right.isEmpty() || i.right.isRed() || i.right.left.isRed() || (i = i.moveRedRight()),
            t(e, i.key) === 0) {
                if (i.right.isEmpty())
                    return W.EMPTY;
                s = i.right.min(),
                i = i.copy(s.key, s.value, null, null, i.right.removeMin())
            }
            i = i.copy(null, null, null, null, i.right.remove(e, t))
        }
        return i.fixUp()
    }
    isRed() {
        return this.color
    }
    fixUp() {
        let e = this;
        return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()),
        e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()),
        e.left.isRed() && e.right.isRed() && (e = e.colorFlip()),
        e
    }
    moveRedLeft() {
        let e = this.colorFlip();
        return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()),
        e = e.rotateLeft(),
        e = e.colorFlip()),
        e
    }
    moveRedRight() {
        let e = this.colorFlip();
        return e.left.left.isRed() && (e = e.rotateRight(),
        e = e.colorFlip()),
        e
    }
    rotateLeft() {
        const e = this.copy(null, null, W.RED, null, this.right.left);
        return this.right.copy(null, null, this.color, e, null)
    }
    rotateRight() {
        const e = this.copy(null, null, W.RED, this.left.right, null);
        return this.left.copy(null, null, this.color, null, e)
    }
    colorFlip() {
        const e = this.left.copy(null, null, !this.left.color, null, null)
          , t = this.right.copy(null, null, !this.right.color, null, null);
        return this.copy(null, null, !this.color, e, t)
    }
    checkMaxDepth() {
        const e = this.check();
        return Math.pow(2, e) <= this.size + 1
    }
    check() {
        if (this.isRed() && this.left.isRed() || this.right.isRed())
            throw I();
        const e = this.left.check();
        if (e !== this.right.check())
            throw I();
        return e + (this.isRed() ? 0 : 1)
    }
}
W.EMPTY = null,
W.RED = !0,
W.BLACK = !1;
W.EMPTY = new class {
    constructor() {
        this.size = 0
    }
    get key() {
        throw I()
    }
    get value() {
        throw I()
    }
    get color() {
        throw I()
    }
    get left() {
        throw I()
    }
    get right() {
        throw I()
    }
    copy(n, e, t, s, i) {
        return this
    }
    insert(n, e, t) {
        return new W(n,e)
    }
    remove(n, e) {
        return this
    }
    isEmpty() {
        return !0
    }
    inorderTraversal(n) {
        return !1
    }
    reverseTraversal(n) {
        return !1
    }
    minKey() {
        return null
    }
    maxKey() {
        return null
    }
    isRed() {
        return !1
    }
    checkMaxDepth() {
        return !0
    }
    check() {
        return 0
    }
}
;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class se {
    constructor(e) {
        this.comparator = e,
        this.data = new x(this.comparator)
    }
    has(e) {
        return this.data.get(e) !== null
    }
    first() {
        return this.data.minKey()
    }
    last() {
        return this.data.maxKey()
    }
    get size() {
        return this.data.size
    }
    indexOf(e) {
        return this.data.indexOf(e)
    }
    forEach(e) {
        this.data.inorderTraversal( (t, s) => (e(t),
        !1))
    }
    forEachInRange(e, t) {
        const s = this.data.getIteratorFrom(e[0]);
        for (; s.hasNext(); ) {
            const i = s.getNext();
            if (this.comparator(i.key, e[1]) >= 0)
                return;
            t(i.key)
        }
    }
    forEachWhile(e, t) {
        let s;
        for (s = t !== void 0 ? this.data.getIteratorFrom(t) : this.data.getIterator(); s.hasNext(); )
            if (!e(s.getNext().key))
                return
    }
    firstAfterOrEqual(e) {
        const t = this.data.getIteratorFrom(e);
        return t.hasNext() ? t.getNext().key : null
    }
    getIterator() {
        return new wa(this.data.getIterator())
    }
    getIteratorFrom(e) {
        return new wa(this.data.getIteratorFrom(e))
    }
    add(e) {
        return this.copy(this.data.remove(e).insert(e, !0))
    }
    delete(e) {
        return this.has(e) ? this.copy(this.data.remove(e)) : this
    }
    isEmpty() {
        return this.data.isEmpty()
    }
    unionWith(e) {
        let t = this;
        return t.size < e.size && (t = e,
        e = this),
        e.forEach(s => {
            t = t.add(s)
        }
        ),
        t
    }
    isEqual(e) {
        if (!(e instanceof se) || this.size !== e.size)
            return !1;
        const t = this.data.getIterator()
          , s = e.data.getIterator();
        for (; t.hasNext(); ) {
            const i = t.getNext().key
              , r = s.getNext().key;
            if (this.comparator(i, r) !== 0)
                return !1
        }
        return !0
    }
    toArray() {
        const e = [];
        return this.forEach(t => {
            e.push(t)
        }
        ),
        e
    }
    toString() {
        const e = [];
        return this.forEach(t => e.push(t)),
        "SortedSet(" + e.toString() + ")"
    }
    copy(e) {
        const t = new se(this.comparator);
        return t.data = e,
        t
    }
}
class wa {
    constructor(e) {
        this.iter = e
    }
    getNext() {
        return this.iter.getNext().key
    }
    hasNext() {
        return this.iter.hasNext()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class fe {
    constructor(e) {
        this.fields = e,
        e.sort(ee.comparator)
    }
    static empty() {
        return new fe([])
    }
    unionWith(e) {
        let t = new se(ee.comparator);
        for (const s of this.fields)
            t = t.add(s);
        for (const s of e)
            t = t.add(s);
        return new fe(t.toArray())
    }
    covers(e) {
        for (const t of this.fields)
            if (t.isPrefixOf(e))
                return !0;
        return !1
    }
    isEqual(e) {
        return xt(this.fields, e.fields, (t, s) => t.isEqual(s))
    }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ju extends Error {
    constructor() {
        super(...arguments),
        this.name = "Base64DecodeError"
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class re {
    constructor(e) {
        this.binaryString = e
    }
    static fromBase64String(e) {
        const t = function(s) {
            try {
                return atob(s)
            } catch (i) {
                throw typeof DOMException < "u" && i instanceof DOMException ? new Ju("Invalid base64 string: " + i) : i
            }
        }(e);
        return new re(t)
    }
    static fromUint8Array(e) {
        const t = function(s) {
            let i = "";
            for (let r = 0; r < s.length; ++r)
                i += String.fromCharCode(s[r]);
            return i
        }(e);
        return new re(t)
    }
    [Symbol.iterator]() {
        let e = 0;
        return {
            next: () => e < this.binaryString.length ? {
                value: this.binaryString.charCodeAt(e++),
                done: !1
            } : {
                value: void 0,
                done: !0
            }
        }
    }
    toBase64() {
        return e = this.binaryString,
        btoa(e);
        var e
    }
    toUint8Array() {
        return function(e) {
            const t = new Uint8Array(e.length);
            for (let s = 0; s < e.length; s++)
                t[s] = e.charCodeAt(s);
            return t
        }(this.binaryString)
    }
    approximateByteSize() {
        return 2 * this.binaryString.length
    }
    compareTo(e) {
        return R(this.binaryString, e.binaryString)
    }
    isEqual(e) {
        return this.binaryString === e.binaryString
    }
}
re.EMPTY_BYTE_STRING = new re("");
const ym = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function Ge(n) {
    if (L(!!n),
    typeof n == "string") {
        let e = 0;
        const t = ym.exec(n);
        if (L(!!t),
        t[1]) {
            let i = t[1];
            i = (i + "000000000").substr(0, 9),
            e = Number(i)
        }
        const s = new Date(n);
        return {
            seconds: Math.floor(s.getTime() / 1e3),
            nanos: e
        }
    }
    return {
        seconds: B(n.seconds),
        nanos: B(n.nanos)
    }
}
function B(n) {
    return typeof n == "number" ? n : typeof n == "string" ? Number(n) : 0
}
function ht(n) {
    return typeof n == "string" ? re.fromBase64String(n) : re.fromUint8Array(n)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Xr(n) {
    var e, t;
    return ((t = (((e = n == null ? void 0 : n.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}).__type__) === null || t === void 0 ? void 0 : t.stringValue) === "server_timestamp"
}
function Zr(n) {
    const e = n.mapValue.fields.__previous_value__;
    return Xr(e) ? Zr(e) : e
}
function _n(n) {
    const e = Ge(n.mapValue.fields.__local_write_time__.timestampValue);
    return new q(e.seconds,e.nanos)
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class vm {
    constructor(e, t, s, i, r, o, a, c, u) {
        this.databaseId = e,
        this.appId = t,
        this.persistenceKey = s,
        this.host = i,
        this.ssl = r,
        this.forceLongPolling = o,
        this.autoDetectLongPolling = a,
        this.longPollingOptions = c,
        this.useFetchStreams = u
    }
}
class Tn {
    constructor(e, t) {
        this.projectId = e,
        this.database = t || "(default)"
    }
    static empty() {
        return new Tn("","")
    }
    get isDefaultDatabase() {
        return this.database === "(default)"
    }
    isEqual(e) {
        return e instanceof Tn && e.projectId === this.projectId && e.database === this.database
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const os = {
    mapValue: {
        fields: {
            __type__: {
                stringValue: "__max__"
            }
        }
    }
};
function dt(n) {
    return "nullValue"in n ? 0 : "booleanValue"in n ? 1 : "integerValue"in n || "doubleValue"in n ? 2 : "timestampValue"in n ? 3 : "stringValue"in n ? 5 : "bytesValue"in n ? 6 : "referenceValue"in n ? 7 : "geoPointValue"in n ? 8 : "arrayValue"in n ? 9 : "mapValue"in n ? Xr(n) ? 4 : wm(n) ? 9007199254740991 : 10 : I()
}
function _e(n, e) {
    if (n === e)
        return !0;
    const t = dt(n);
    if (t !== dt(e))
        return !1;
    switch (t) {
    case 0:
    case 9007199254740991:
        return !0;
    case 1:
        return n.booleanValue === e.booleanValue;
    case 4:
        return _n(n).isEqual(_n(e));
    case 3:
        return function(s, i) {
            if (typeof s.timestampValue == "string" && typeof i.timestampValue == "string" && s.timestampValue.length === i.timestampValue.length)
                return s.timestampValue === i.timestampValue;
            const r = Ge(s.timestampValue)
              , o = Ge(i.timestampValue);
            return r.seconds === o.seconds && r.nanos === o.nanos
        }(n, e);
    case 5:
        return n.stringValue === e.stringValue;
    case 6:
        return function(s, i) {
            return ht(s.bytesValue).isEqual(ht(i.bytesValue))
        }(n, e);
    case 7:
        return n.referenceValue === e.referenceValue;
    case 8:
        return function(s, i) {
            return B(s.geoPointValue.latitude) === B(i.geoPointValue.latitude) && B(s.geoPointValue.longitude) === B(i.geoPointValue.longitude)
        }(n, e);
    case 2:
        return function(s, i) {
            if ("integerValue"in s && "integerValue"in i)
                return B(s.integerValue) === B(i.integerValue);
            if ("doubleValue"in s && "doubleValue"in i) {
                const r = B(s.doubleValue)
                  , o = B(i.doubleValue);
                return r === o ? Os(r) === Os(o) : isNaN(r) && isNaN(o)
            }
            return !1
        }(n, e);
    case 9:
        return xt(n.arrayValue.values || [], e.arrayValue.values || [], _e);
    case 10:
        return function(s, i) {
            const r = s.mapValue.fields || {}
              , o = i.mapValue.fields || {};
            if (va(r) !== va(o))
                return !1;
            for (const a in r)
                if (r.hasOwnProperty(a) && (o[a] === void 0 || !_e(r[a], o[a])))
                    return !1;
            return !0
        }(n, e);
    default:
        return I()
    }
}
function Sn(n, e) {
    return (n.values || []).find(t => _e(t, e)) !== void 0
}
function Ft(n, e) {
    if (n === e)
        return 0;
    const t = dt(n)
      , s = dt(e);
    if (t !== s)
        return R(t, s);
    switch (t) {
    case 0:
    case 9007199254740991:
        return 0;
    case 1:
        return R(n.booleanValue, e.booleanValue);
    case 2:
        return function(i, r) {
            const o = B(i.integerValue || i.doubleValue)
              , a = B(r.integerValue || r.doubleValue);
            return o < a ? -1 : o > a ? 1 : o === a ? 0 : isNaN(o) ? isNaN(a) ? 0 : -1 : 1
        }(n, e);
    case 3:
        return Ea(n.timestampValue, e.timestampValue);
    case 4:
        return Ea(_n(n), _n(e));
    case 5:
        return R(n.stringValue, e.stringValue);
    case 6:
        return function(i, r) {
            const o = ht(i)
              , a = ht(r);
            return o.compareTo(a)
        }(n.bytesValue, e.bytesValue);
    case 7:
        return function(i, r) {
            const o = i.split("/")
              , a = r.split("/");
            for (let c = 0; c < o.length && c < a.length; c++) {
                const u = R(o[c], a[c]);
                if (u !== 0)
                    return u
            }
            return R(o.length, a.length)
        }(n.referenceValue, e.referenceValue);
    case 8:
        return function(i, r) {
            const o = R(B(i.latitude), B(r.latitude));
            return o !== 0 ? o : R(B(i.longitude), B(r.longitude))
        }(n.geoPointValue, e.geoPointValue);
    case 9:
        return function(i, r) {
            const o = i.values || []
              , a = r.values || [];
            for (let c = 0; c < o.length && c < a.length; ++c) {
                const u = Ft(o[c], a[c]);
                if (u)
                    return u
            }
            return R(o.length, a.length)
        }(n.arrayValue, e.arrayValue);
    case 10:
        return function(i, r) {
            if (i === os.mapValue && r === os.mapValue)
                return 0;
            if (i === os.mapValue)
                return 1;
            if (r === os.mapValue)
                return -1;
            const o = i.fields || {}
              , a = Object.keys(o)
              , c = r.fields || {}
              , u = Object.keys(c);
            a.sort(),
            u.sort();
            for (let l = 0; l < a.length && l < u.length; ++l) {
                const h = R(a[l], u[l]);
                if (h !== 0)
                    return h;
                const f = Ft(o[a[l]], c[u[l]]);
                if (f !== 0)
                    return f
            }
            return R(a.length, u.length)
        }(n.mapValue, e.mapValue);
    default:
        throw I()
    }
}
function Ea(n, e) {
    if (typeof n == "string" && typeof e == "string" && n.length === e.length)
        return R(n, e);
    const t = Ge(n)
      , s = Ge(e)
      , i = R(t.seconds, s.seconds);
    return i !== 0 ? i : R(t.nanos, s.nanos)
}
function Ut(n) {
    return sr(n)
}
function sr(n) {
    return "nullValue"in n ? "null" : "booleanValue"in n ? "" + n.booleanValue : "integerValue"in n ? "" + n.integerValue : "doubleValue"in n ? "" + n.doubleValue : "timestampValue"in n ? function(s) {
        const i = Ge(s);
        return `time(${i.seconds},${i.nanos})`
    }(n.timestampValue) : "stringValue"in n ? n.stringValue : "bytesValue"in n ? ht(n.bytesValue).toBase64() : "referenceValue"in n ? (t = n.referenceValue,
    w.fromName(t).toString()) : "geoPointValue"in n ? `geo(${(e = n.geoPointValue).latitude},${e.longitude})` : "arrayValue"in n ? function(s) {
        let i = "["
          , r = !0;
        for (const o of s.values || [])
            r ? r = !1 : i += ",",
            i += sr(o);
        return i + "]"
    }(n.arrayValue) : "mapValue"in n ? function(s) {
        const i = Object.keys(s.fields || {}).sort();
        let r = "{"
          , o = !0;
        for (const a of i)
            o ? o = !1 : r += ",",
            r += `${a}:${sr(s.fields[a])}`;
        return r + "}"
    }(n.mapValue) : I();
    var e, t
}
function Ia(n, e) {
    return {
        referenceValue: `projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`
    }
}
function ir(n) {
    return !!n && "integerValue"in n
}
function eo(n) {
    return !!n && "arrayValue"in n
}
function _a(n) {
    return !!n && "nullValue"in n
}
function Ta(n) {
    return !!n && "doubleValue"in n && isNaN(Number(n.doubleValue))
}
function fs(n) {
    return !!n && "mapValue"in n
}
function on(n) {
    if (n.geoPointValue)
        return {
            geoPointValue: Object.assign({}, n.geoPointValue)
        };
    if (n.timestampValue && typeof n.timestampValue == "object")
        return {
            timestampValue: Object.assign({}, n.timestampValue)
        };
    if (n.mapValue) {
        const e = {
            mapValue: {
                fields: {}
            }
        };
        return gt(n.mapValue.fields, (t, s) => e.mapValue.fields[t] = on(s)),
        e
    }
    if (n.arrayValue) {
        const e = {
            arrayValue: {
                values: []
            }
        };
        for (let t = 0; t < (n.arrayValue.values || []).length; ++t)
            e.arrayValue.values[t] = on(n.arrayValue.values[t]);
        return e
    }
    return Object.assign({}, n)
}
function wm(n) {
    return (((n.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__"
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class le {
    constructor(e) {
        this.value = e
    }
    static empty() {
        return new le({
            mapValue: {}
        })
    }
    field(e) {
        if (e.isEmpty())
            return this.value;
        {
            let t = this.value;
            for (let s = 0; s < e.length - 1; ++s)
                if (t = (t.mapValue.fields || {})[e.get(s)],
                !fs(t))
                    return null;
            return t = (t.mapValue.fields || {})[e.lastSegment()],
            t || null
        }
    }
    set(e, t) {
        this.getFieldsMap(e.popLast())[e.lastSegment()] = on(t)
    }
    setAll(e) {
        let t = ee.emptyPath()
          , s = {}
          , i = [];
        e.forEach( (o, a) => {
            if (!t.isImmediateParentOf(a)) {
                const c = this.getFieldsMap(t);
                this.applyChanges(c, s, i),
                s = {},
                i = [],
                t = a.popLast()
            }
            o ? s[a.lastSegment()] = on(o) : i.push(a.lastSegment())
        }
        );
        const r = this.getFieldsMap(t);
        this.applyChanges(r, s, i)
    }
    delete(e) {
        const t = this.field(e.popLast());
        fs(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()]
    }
    isEqual(e) {
        return _e(this.value, e.value)
    }
    getFieldsMap(e) {
        let t = this.value;
        t.mapValue.fields || (t.mapValue = {
            fields: {}
        });
        for (let s = 0; s < e.length; ++s) {
            let i = t.mapValue.fields[e.get(s)];
            fs(i) && i.mapValue.fields || (i = {
                mapValue: {
                    fields: {}
                }
            },
            t.mapValue.fields[e.get(s)] = i),
            t = i
        }
        return t.mapValue.fields
    }
    applyChanges(e, t, s) {
        gt(t, (i, r) => e[i] = r);
        for (const i of s)
            delete e[i]
    }
    clone() {
        return new le(on(this.value))
    }
}
function Xu(n) {
    const e = [];
    return gt(n.fields, (t, s) => {
        const i = new ee([t]);
        if (fs(s)) {
            const r = Xu(s.mapValue).fields;
            if (r.length === 0)
                e.push(i);
            else
                for (const o of r)
                    e.push(i.child(o))
        } else
            e.push(i)
    }
    ),
    new fe(e)
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Z {
    constructor(e, t, s, i, r, o, a) {
        this.key = e,
        this.documentType = t,
        this.version = s,
        this.readTime = i,
        this.createTime = r,
        this.data = o,
        this.documentState = a
    }
    static newInvalidDocument(e) {
        return new Z(e,0,S.min(),S.min(),S.min(),le.empty(),0)
    }
    static newFoundDocument(e, t, s, i) {
        return new Z(e,1,t,S.min(),s,i,0)
    }
    static newNoDocument(e, t) {
        return new Z(e,2,t,S.min(),S.min(),le.empty(),0)
    }
    static newUnknownDocument(e, t) {
        return new Z(e,3,t,S.min(),S.min(),le.empty(),2)
    }
    convertToFoundDocument(e, t) {
        return !this.createTime.isEqual(S.min()) || this.documentType !== 2 && this.documentType !== 0 || (this.createTime = e),
        this.version = e,
        this.documentType = 1,
        this.data = t,
        this.documentState = 0,
        this
    }
    convertToNoDocument(e) {
        return this.version = e,
        this.documentType = 2,
        this.data = le.empty(),
        this.documentState = 0,
        this
    }
    convertToUnknownDocument(e) {
        return this.version = e,
        this.documentType = 3,
        this.data = le.empty(),
        this.documentState = 2,
        this
    }
    setHasCommittedMutations() {
        return this.documentState = 2,
        this
    }
    setHasLocalMutations() {
        return this.documentState = 1,
        this.version = S.min(),
        this
    }
    setReadTime(e) {
        return this.readTime = e,
        this
    }
    get hasLocalMutations() {
        return this.documentState === 1
    }
    get hasCommittedMutations() {
        return this.documentState === 2
    }
    get hasPendingWrites() {
        return this.hasLocalMutations || this.hasCommittedMutations
    }
    isValidDocument() {
        return this.documentType !== 0
    }
    isFoundDocument() {
        return this.documentType === 1
    }
    isNoDocument() {
        return this.documentType === 2
    }
    isUnknownDocument() {
        return this.documentType === 3
    }
    isEqual(e) {
        return e instanceof Z && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data)
    }
    mutableCopy() {
        return new Z(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)
    }
    toString() {
        return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`
    }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ps {
    constructor(e, t) {
        this.position = e,
        this.inclusive = t
    }
}
function Sa(n, e, t) {
    let s = 0;
    for (let i = 0; i < n.position.length; i++) {
        const r = e[i]
          , o = n.position[i];
        if (r.field.isKeyField() ? s = w.comparator(w.fromName(o.referenceValue), t.key) : s = Ft(o, t.data.field(r.field)),
        r.dir === "desc" && (s *= -1),
        s !== 0)
            break
    }
    return s
}
function Aa(n, e) {
    if (n === null)
        return e === null;
    if (e === null || n.inclusive !== e.inclusive || n.position.length !== e.position.length)
        return !1;
    for (let t = 0; t < n.position.length; t++)
        if (!_e(n.position[t], e.position[t]))
            return !1;
    return !0
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class an {
    constructor(e, t="asc") {
        this.field = e,
        this.dir = t
    }
}
function Em(n, e) {
    return n.dir === e.dir && n.field.isEqual(e.field)
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Zu {
}
class j extends Zu {
    constructor(e, t, s) {
        super(),
        this.field = e,
        this.op = t,
        this.value = s
    }
    static create(e, t, s) {
        return e.isKeyField() ? t === "in" || t === "not-in" ? this.createKeyFieldInFilter(e, t, s) : new _m(e,t,s) : t === "array-contains" ? new Am(e,s) : t === "in" ? new Cm(e,s) : t === "not-in" ? new bm(e,s) : t === "array-contains-any" ? new km(e,s) : new j(e,t,s)
    }
    static createKeyFieldInFilter(e, t, s) {
        return t === "in" ? new Tm(e,s) : new Sm(e,s)
    }
    matches(e) {
        const t = e.data.field(this.field);
        return this.op === "!=" ? t !== null && this.matchesComparison(Ft(t, this.value)) : t !== null && dt(this.value) === dt(t) && this.matchesComparison(Ft(t, this.value))
    }
    matchesComparison(e) {
        switch (this.op) {
        case "<":
            return e < 0;
        case "<=":
            return e <= 0;
        case "==":
            return e === 0;
        case "!=":
            return e !== 0;
        case ">":
            return e > 0;
        case ">=":
            return e >= 0;
        default:
            return I()
        }
    }
    isInequality() {
        return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0
    }
    getFlattenedFilters() {
        return [this]
    }
    getFilters() {
        return [this]
    }
    getFirstInequalityField() {
        return this.isInequality() ? this.field : null
    }
}
class ge extends Zu {
    constructor(e, t) {
        super(),
        this.filters = e,
        this.op = t,
        this.lt = null
    }
    static create(e, t) {
        return new ge(e,t)
    }
    matches(e) {
        return el(this) ? this.filters.find(t => !t.matches(e)) === void 0 : this.filters.find(t => t.matches(e)) !== void 0
    }
    getFlattenedFilters() {
        return this.lt !== null || (this.lt = this.filters.reduce( (e, t) => e.concat(t.getFlattenedFilters()), [])),
        this.lt
    }
    getFilters() {
        return Object.assign([], this.filters)
    }
    getFirstInequalityField() {
        const e = this.ft(t => t.isInequality());
        return e !== null ? e.field : null
    }
    ft(e) {
        for (const t of this.getFlattenedFilters())
            if (e(t))
                return t;
        return null
    }
}
function el(n) {
    return n.op === "and"
}
function tl(n) {
    return Im(n) && el(n)
}
function Im(n) {
    for (const e of n.filters)
        if (e instanceof ge)
            return !1;
    return !0
}
function rr(n) {
    if (n instanceof j)
        return n.field.canonicalString() + n.op.toString() + Ut(n.value);
    if (tl(n))
        return n.filters.map(e => rr(e)).join(",");
    {
        const e = n.filters.map(t => rr(t)).join(",");
        return `${n.op}(${e})`
    }
}
function nl(n, e) {
    return n instanceof j ? function(t, s) {
        return s instanceof j && t.op === s.op && t.field.isEqual(s.field) && _e(t.value, s.value)
    }(n, e) : n instanceof ge ? function(t, s) {
        return s instanceof ge && t.op === s.op && t.filters.length === s.filters.length ? t.filters.reduce( (i, r, o) => i && nl(r, s.filters[o]), !0) : !1
    }(n, e) : void I()
}
function sl(n) {
    return n instanceof j ? function(e) {
        return `${e.field.canonicalString()} ${e.op} ${Ut(e.value)}`
    }(n) : n instanceof ge ? function(e) {
        return e.op.toString() + " {" + e.getFilters().map(sl).join(" ,") + "}"
    }(n) : "Filter"
}
class _m extends j {
    constructor(e, t, s) {
        super(e, t, s),
        this.key = w.fromName(s.referenceValue)
    }
    matches(e) {
        const t = w.comparator(e.key, this.key);
        return this.matchesComparison(t)
    }
}
class Tm extends j {
    constructor(e, t) {
        super(e, "in", t),
        this.keys = il("in", t)
    }
    matches(e) {
        return this.keys.some(t => t.isEqual(e.key))
    }
}
class Sm extends j {
    constructor(e, t) {
        super(e, "not-in", t),
        this.keys = il("not-in", t)
    }
    matches(e) {
        return !this.keys.some(t => t.isEqual(e.key))
    }
}
function il(n, e) {
    var t;
    return (((t = e.arrayValue) === null || t === void 0 ? void 0 : t.values) || []).map(s => w.fromName(s.referenceValue))
}
class Am extends j {
    constructor(e, t) {
        super(e, "array-contains", t)
    }
    matches(e) {
        const t = e.data.field(this.field);
        return eo(t) && Sn(t.arrayValue, this.value)
    }
}
class Cm extends j {
    constructor(e, t) {
        super(e, "in", t)
    }
    matches(e) {
        const t = e.data.field(this.field);
        return t !== null && Sn(this.value.arrayValue, t)
    }
}
class bm extends j {
    constructor(e, t) {
        super(e, "not-in", t)
    }
    matches(e) {
        if (Sn(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
        }))
            return !1;
        const t = e.data.field(this.field);
        return t !== null && !Sn(this.value.arrayValue, t)
    }
}
class km extends j {
    constructor(e, t) {
        super(e, "array-contains-any", t)
    }
    matches(e) {
        const t = e.data.field(this.field);
        return !(!eo(t) || !t.arrayValue.values) && t.arrayValue.values.some(s => Sn(this.value.arrayValue, s))
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Dm {
    constructor(e, t=null, s=[], i=[], r=null, o=null, a=null) {
        this.path = e,
        this.collectionGroup = t,
        this.orderBy = s,
        this.filters = i,
        this.limit = r,
        this.startAt = o,
        this.endAt = a,
        this.dt = null
    }
}
function Ca(n, e=null, t=[], s=[], i=null, r=null, o=null) {
    return new Dm(n,e,t,s,i,r,o)
}
function to(n) {
    const e = b(n);
    if (e.dt === null) {
        let t = e.path.canonicalString();
        e.collectionGroup !== null && (t += "|cg:" + e.collectionGroup),
        t += "|f:",
        t += e.filters.map(s => rr(s)).join(","),
        t += "|ob:",
        t += e.orderBy.map(s => function(i) {
            return i.field.canonicalString() + i.dir
        }(s)).join(","),
        si(e.limit) || (t += "|l:",
        t += e.limit),
        e.startAt && (t += "|lb:",
        t += e.startAt.inclusive ? "b:" : "a:",
        t += e.startAt.position.map(s => Ut(s)).join(",")),
        e.endAt && (t += "|ub:",
        t += e.endAt.inclusive ? "a:" : "b:",
        t += e.endAt.position.map(s => Ut(s)).join(",")),
        e.dt = t
    }
    return e.dt
}
function no(n, e) {
    if (n.limit !== e.limit || n.orderBy.length !== e.orderBy.length)
        return !1;
    for (let t = 0; t < n.orderBy.length; t++)
        if (!Em(n.orderBy[t], e.orderBy[t]))
            return !1;
    if (n.filters.length !== e.filters.length)
        return !1;
    for (let t = 0; t < n.filters.length; t++)
        if (!nl(n.filters[t], e.filters[t]))
            return !1;
    return n.collectionGroup === e.collectionGroup && !!n.path.isEqual(e.path) && !!Aa(n.startAt, e.startAt) && Aa(n.endAt, e.endAt)
}
function or(n) {
    return w.isDocumentKey(n.path) && n.collectionGroup === null && n.filters.length === 0
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Kn {
    constructor(e, t=null, s=[], i=[], r=null, o="F", a=null, c=null) {
        this.path = e,
        this.collectionGroup = t,
        this.explicitOrderBy = s,
        this.filters = i,
        this.limit = r,
        this.limitType = o,
        this.startAt = a,
        this.endAt = c,
        this.wt = null,
        this._t = null,
        this.startAt,
        this.endAt
    }
}
function Nm(n, e, t, s, i, r, o, a) {
    return new Kn(n,e,t,s,i,r,o,a)
}
function so(n) {
    return new Kn(n)
}
function ba(n) {
    return n.filters.length === 0 && n.limit === null && n.startAt == null && n.endAt == null && (n.explicitOrderBy.length === 0 || n.explicitOrderBy.length === 1 && n.explicitOrderBy[0].field.isKeyField())
}
function rl(n) {
    return n.explicitOrderBy.length > 0 ? n.explicitOrderBy[0].field : null
}
function io(n) {
    for (const e of n.filters) {
        const t = e.getFirstInequalityField();
        if (t !== null)
            return t
    }
    return null
}
function ol(n) {
    return n.collectionGroup !== null
}
function Dt(n) {
    const e = b(n);
    if (e.wt === null) {
        e.wt = [];
        const t = io(e)
          , s = rl(e);
        if (t !== null && s === null)
            t.isKeyField() || e.wt.push(new an(t)),
            e.wt.push(new an(ee.keyField(),"asc"));
        else {
            let i = !1;
            for (const r of e.explicitOrderBy)
                e.wt.push(r),
                r.field.isKeyField() && (i = !0);
            if (!i) {
                const r = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
                e.wt.push(new an(ee.keyField(),r))
            }
        }
    }
    return e.wt
}
function Oe(n) {
    const e = b(n);
    if (!e._t)
        if (e.limitType === "F")
            e._t = Ca(e.path, e.collectionGroup, Dt(e), e.filters, e.limit, e.startAt, e.endAt);
        else {
            const t = [];
            for (const r of Dt(e)) {
                const o = r.dir === "desc" ? "asc" : "desc";
                t.push(new an(r.field,o))
            }
            const s = e.endAt ? new Ps(e.endAt.position,e.endAt.inclusive) : null
              , i = e.startAt ? new Ps(e.startAt.position,e.startAt.inclusive) : null;
            e._t = Ca(e.path, e.collectionGroup, t, e.filters, e.limit, s, i)
        }
    return e._t
}
function ar(n, e) {
    e.getFirstInequalityField(),
    io(n);
    const t = n.filters.concat([e]);
    return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)
}
function cr(n, e, t) {
    return new Kn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)
}
function ii(n, e) {
    return no(Oe(n), Oe(e)) && n.limitType === e.limitType
}
function al(n) {
    return `${to(Oe(n))}|lt:${n.limitType}`
}
function ur(n) {
    return `Query(target=${function(e) {
        let t = e.path.canonicalString();
        return e.collectionGroup !== null && (t += " collectionGroup=" + e.collectionGroup),
        e.filters.length > 0 && (t += `, filters: [${e.filters.map(s => sl(s)).join(", ")}]`),
        si(e.limit) || (t += ", limit: " + e.limit),
        e.orderBy.length > 0 && (t += `, orderBy: [${e.orderBy.map(s => function(i) {
            return `${i.field.canonicalString()} (${i.dir})`
        }(s)).join(", ")}]`),
        e.startAt && (t += ", startAt: ",
        t += e.startAt.inclusive ? "b:" : "a:",
        t += e.startAt.position.map(s => Ut(s)).join(",")),
        e.endAt && (t += ", endAt: ",
        t += e.endAt.inclusive ? "a:" : "b:",
        t += e.endAt.position.map(s => Ut(s)).join(",")),
        `Target(${t})`
    }(Oe(n))}; limitType=${n.limitType})`
}
function ri(n, e) {
    return e.isFoundDocument() && function(t, s) {
        const i = s.key.path;
        return t.collectionGroup !== null ? s.key.hasCollectionId(t.collectionGroup) && t.path.isPrefixOf(i) : w.isDocumentKey(t.path) ? t.path.isEqual(i) : t.path.isImmediateParentOf(i)
    }(n, e) && function(t, s) {
        for (const i of Dt(t))
            if (!i.field.isKeyField() && s.data.field(i.field) === null)
                return !1;
        return !0
    }(n, e) && function(t, s) {
        for (const i of t.filters)
            if (!i.matches(s))
                return !1;
        return !0
    }(n, e) && function(t, s) {
        return !(t.startAt && !function(i, r, o) {
            const a = Sa(i, r, o);
            return i.inclusive ? a <= 0 : a < 0
        }(t.startAt, Dt(t), s) || t.endAt && !function(i, r, o) {
            const a = Sa(i, r, o);
            return i.inclusive ? a >= 0 : a > 0
        }(t.endAt, Dt(t), s))
    }(n, e)
}
function Rm(n) {
    return n.collectionGroup || (n.path.length % 2 == 1 ? n.path.lastSegment() : n.path.get(n.path.length - 2))
}
function cl(n) {
    return (e, t) => {
        let s = !1;
        for (const i of Dt(n)) {
            const r = Om(i, e, t);
            if (r !== 0)
                return r;
            s = s || i.field.isKeyField()
        }
        return 0
    }
}
function Om(n, e, t) {
    const s = n.field.isKeyField() ? w.comparator(e.key, t.key) : function(i, r, o) {
        const a = r.data.field(i)
          , c = o.data.field(i);
        return a !== null && c !== null ? Ft(a, c) : I()
    }(n.field, e, t);
    switch (n.dir) {
    case "asc":
        return s;
    case "desc":
        return -1 * s;
    default:
        return I()
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Kt {
    constructor(e, t) {
        this.mapKeyFn = e,
        this.equalsFn = t,
        this.inner = {},
        this.innerSize = 0
    }
    get(e) {
        const t = this.mapKeyFn(e)
          , s = this.inner[t];
        if (s !== void 0) {
            for (const [i,r] of s)
                if (this.equalsFn(i, e))
                    return r
        }
    }
    has(e) {
        return this.get(e) !== void 0
    }
    set(e, t) {
        const s = this.mapKeyFn(e)
          , i = this.inner[s];
        if (i === void 0)
            return this.inner[s] = [[e, t]],
            void this.innerSize++;
        for (let r = 0; r < i.length; r++)
            if (this.equalsFn(i[r][0], e))
                return void (i[r] = [e, t]);
        i.push([e, t]),
        this.innerSize++
    }
    delete(e) {
        const t = this.mapKeyFn(e)
          , s = this.inner[t];
        if (s === void 0)
            return !1;
        for (let i = 0; i < s.length; i++)
            if (this.equalsFn(s[i][0], e))
                return s.length === 1 ? delete this.inner[t] : s.splice(i, 1),
                this.innerSize--,
                !0;
        return !1
    }
    forEach(e) {
        gt(this.inner, (t, s) => {
            for (const [i,r] of s)
                e(i, r)
        }
        )
    }
    isEmpty() {
        return Yu(this.inner)
    }
    size() {
        return this.innerSize
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pm = new x(w.comparator);
function Pe() {
    return Pm
}
const ul = new x(w.comparator);
function en(...n) {
    let e = ul;
    for (const t of n)
        e = e.insert(t.key, t);
    return e
}
function ll(n) {
    let e = ul;
    return n.forEach( (t, s) => e = e.insert(t, s.overlayedDocument)),
    e
}
function st() {
    return cn()
}
function hl() {
    return cn()
}
function cn() {
    return new Kt(n => n.toString(), (n, e) => n.isEqual(e))
}
const Mm = new x(w.comparator)
  , Lm = new se(w.comparator);
function k(...n) {
    let e = Lm;
    for (const t of n)
        e = e.add(t);
    return e
}
const xm = new se(R);
function Fm() {
    return xm
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function dl(n, e) {
    if (n.useProto3Json) {
        if (isNaN(e))
            return {
                doubleValue: "NaN"
            };
        if (e === 1 / 0)
            return {
                doubleValue: "Infinity"
            };
        if (e === -1 / 0)
            return {
                doubleValue: "-Infinity"
            }
    }
    return {
        doubleValue: Os(e) ? "-0" : e
    }
}
function fl(n) {
    return {
        integerValue: "" + n
    }
}
function pl(n, e) {
    return mm(e) ? fl(e) : dl(n, e)
}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class oi {
    constructor() {
        this._ = void 0
    }
}
function Um(n, e, t) {
    return n instanceof An ? function(s, i) {
        const r = {
            fields: {
                __type__: {
                    stringValue: "server_timestamp"
                },
                __local_write_time__: {
                    timestampValue: {
                        seconds: s.seconds,
                        nanos: s.nanoseconds
                    }
                }
            }
        };
        return i && Xr(i) && (i = Zr(i)),
        i && (r.fields.__previous_value__ = i),
        {
            mapValue: r
        }
    }(t, e) : n instanceof Cn ? ml(n, e) : n instanceof bn ? yl(n, e) : function(s, i) {
        const r = gl(s, i)
          , o = ka(r) + ka(s.gt);
        return ir(r) && ir(s.gt) ? fl(o) : dl(s.serializer, o)
    }(n, e)
}
function Vm(n, e, t) {
    return n instanceof Cn ? ml(n, e) : n instanceof bn ? yl(n, e) : t
}
function gl(n, e) {
    return n instanceof kn ? ir(t = e) || function(s) {
        return !!s && "doubleValue"in s
    }(t) ? e : {
        integerValue: 0
    } : null;
    var t
}
class An extends oi {
}
class Cn extends oi {
    constructor(e) {
        super(),
        this.elements = e
    }
}
function ml(n, e) {
    const t = vl(e);
    for (const s of n.elements)
        t.some(i => _e(i, s)) || t.push(s);
    return {
        arrayValue: {
            values: t
        }
    }
}
class bn extends oi {
    constructor(e) {
        super(),
        this.elements = e
    }
}
function yl(n, e) {
    let t = vl(e);
    for (const s of n.elements)
        t = t.filter(i => !_e(i, s));
    return {
        arrayValue: {
            values: t
        }
    }
}
class kn extends oi {
    constructor(e, t) {
        super(),
        this.serializer = e,
        this.gt = t
    }
}
function ka(n) {
    return B(n.integerValue || n.doubleValue)
}
function vl(n) {
    return eo(n) && n.arrayValue.values ? n.arrayValue.values.slice() : []
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class wl {
    constructor(e, t) {
        this.field = e,
        this.transform = t
    }
}
function $m(n, e) {
    return n.field.isEqual(e.field) && function(t, s) {
        return t instanceof Cn && s instanceof Cn || t instanceof bn && s instanceof bn ? xt(t.elements, s.elements, _e) : t instanceof kn && s instanceof kn ? _e(t.gt, s.gt) : t instanceof An && s instanceof An
    }(n.transform, e.transform)
}
class Bm {
    constructor(e, t) {
        this.version = e,
        this.transformResults = t
    }
}
class be {
    constructor(e, t) {
        this.updateTime = e,
        this.exists = t
    }
    static none() {
        return new be
    }
    static exists(e) {
        return new be(void 0,e)
    }
    static updateTime(e) {
        return new be(e)
    }
    get isNone() {
        return this.updateTime === void 0 && this.exists === void 0
    }
    isEqual(e) {
        return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime)
    }
}
function ps(n, e) {
    return n.updateTime !== void 0 ? e.isFoundDocument() && e.version.isEqual(n.updateTime) : n.exists === void 0 || n.exists === e.isFoundDocument()
}
class ai {
}
function El(n, e) {
    if (!n.hasLocalMutations || e && e.fields.length === 0)
        return null;
    if (e === null)
        return n.isNoDocument() ? new _l(n.key,be.none()) : new ci(n.key,n.data,be.none());
    {
        const t = n.data
          , s = le.empty();
        let i = new se(ee.comparator);
        for (let r of e.fields)
            if (!i.has(r)) {
                let o = t.field(r);
                o === null && r.length > 1 && (r = r.popLast(),
                o = t.field(r)),
                o === null ? s.delete(r) : s.set(r, o),
                i = i.add(r)
            }
        return new mt(n.key,s,new fe(i.toArray()),be.none())
    }
}
function jm(n, e, t) {
    n instanceof ci ? function(s, i, r) {
        const o = s.value.clone()
          , a = Na(s.fieldTransforms, i, r.transformResults);
        o.setAll(a),
        i.convertToFoundDocument(r.version, o).setHasCommittedMutations()
    }(n, e, t) : n instanceof mt ? function(s, i, r) {
        if (!ps(s.precondition, i))
            return void i.convertToUnknownDocument(r.version);
        const o = Na(s.fieldTransforms, i, r.transformResults)
          , a = i.data;
        a.setAll(Il(s)),
        a.setAll(o),
        i.convertToFoundDocument(r.version, a).setHasCommittedMutations()
    }(n, e, t) : function(s, i, r) {
        i.convertToNoDocument(r.version).setHasCommittedMutations()
    }(0, e, t)
}
function un(n, e, t, s) {
    return n instanceof ci ? function(i, r, o, a) {
        if (!ps(i.precondition, r))
            return o;
        const c = i.value.clone()
          , u = Ra(i.fieldTransforms, a, r);
        return c.setAll(u),
        r.convertToFoundDocument(r.version, c).setHasLocalMutations(),
        null
    }(n, e, t, s) : n instanceof mt ? function(i, r, o, a) {
        if (!ps(i.precondition, r))
            return o;
        const c = Ra(i.fieldTransforms, a, r)
          , u = r.data;
        return u.setAll(Il(i)),
        u.setAll(c),
        r.convertToFoundDocument(r.version, u).setHasLocalMutations(),
        o === null ? null : o.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map(l => l.field))
    }(n, e, t, s) : function(i, r, o) {
        return ps(i.precondition, r) ? (r.convertToNoDocument(r.version).setHasLocalMutations(),
        null) : o
    }(n, e, t)
}
function qm(n, e) {
    let t = null;
    for (const s of n.fieldTransforms) {
        const i = e.data.field(s.field)
          , r = gl(s.transform, i || null);
        r != null && (t === null && (t = le.empty()),
        t.set(s.field, r))
    }
    return t || null
}
function Da(n, e) {
    return n.type === e.type && !!n.key.isEqual(e.key) && !!n.precondition.isEqual(e.precondition) && !!function(t, s) {
        return t === void 0 && s === void 0 || !(!t || !s) && xt(t, s, (i, r) => $m(i, r))
    }(n.fieldTransforms, e.fieldTransforms) && (n.type === 0 ? n.value.isEqual(e.value) : n.type !== 1 || n.data.isEqual(e.data) && n.fieldMask.isEqual(e.fieldMask))
}
class ci extends ai {
    constructor(e, t, s, i=[]) {
        super(),
        this.key = e,
        this.value = t,
        this.precondition = s,
        this.fieldTransforms = i,
        this.type = 0
    }
    getFieldMask() {
        return null
    }
}
class mt extends ai {
    constructor(e, t, s, i, r=[]) {
        super(),
        this.key = e,
        this.data = t,
        this.fieldMask = s,
        this.precondition = i,
        this.fieldTransforms = r,
        this.type = 1
    }
    getFieldMask() {
        return this.fieldMask
    }
}
function Il(n) {
    const e = new Map;
    return n.fieldMask.fields.forEach(t => {
        if (!t.isEmpty()) {
            const s = n.data.field(t);
            e.set(t, s)
        }
    }
    ),
    e
}
function Na(n, e, t) {
    const s = new Map;
    L(n.length === t.length);
    for (let i = 0; i < t.length; i++) {
        const r = n[i]
          , o = r.transform
          , a = e.data.field(r.field);
        s.set(r.field, Vm(o, a, t[i]))
    }
    return s
}
function Ra(n, e, t) {
    const s = new Map;
    for (const i of n) {
        const r = i.transform
          , o = t.data.field(i.field);
        s.set(i.field, Um(r, o, e))
    }
    return s
}
class _l extends ai {
    constructor(e, t) {
        super(),
        this.key = e,
        this.precondition = t,
        this.type = 2,
        this.fieldTransforms = []
    }
    getFieldMask() {
        return null
    }
}
class zm extends ai {
    constructor(e, t) {
        super(),
        this.key = e,
        this.precondition = t,
        this.type = 3,
        this.fieldTransforms = []
    }
    getFieldMask() {
        return null
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Hm {
    constructor(e, t, s, i) {
        this.batchId = e,
        this.localWriteTime = t,
        this.baseMutations = s,
        this.mutations = i
    }
    applyToRemoteDocument(e, t) {
        const s = t.mutationResults;
        for (let i = 0; i < this.mutations.length; i++) {
            const r = this.mutations[i];
            r.key.isEqual(e.key) && jm(r, e, s[i])
        }
    }
    applyToLocalView(e, t) {
        for (const s of this.baseMutations)
            s.key.isEqual(e.key) && (t = un(s, e, t, this.localWriteTime));
        for (const s of this.mutations)
            s.key.isEqual(e.key) && (t = un(s, e, t, this.localWriteTime));
        return t
    }
    applyToLocalDocumentSet(e, t) {
        const s = hl();
        return this.mutations.forEach(i => {
            const r = e.get(i.key)
              , o = r.overlayedDocument;
            let a = this.applyToLocalView(o, r.mutatedFields);
            a = t.has(i.key) ? null : a;
            const c = El(o, a);
            c !== null && s.set(i.key, c),
            o.isValidDocument() || o.convertToNoDocument(S.min())
        }
        ),
        s
    }
    keys() {
        return this.mutations.reduce( (e, t) => e.add(t.key), k())
    }
    isEqual(e) {
        return this.batchId === e.batchId && xt(this.mutations, e.mutations, (t, s) => Da(t, s)) && xt(this.baseMutations, e.baseMutations, (t, s) => Da(t, s))
    }
}
class ro {
    constructor(e, t, s, i) {
        this.batch = e,
        this.commitVersion = t,
        this.mutationResults = s,
        this.docVersions = i
    }
    static from(e, t, s) {
        L(e.mutations.length === s.length);
        let i = Mm;
        const r = e.mutations;
        for (let o = 0; o < r.length; o++)
            i = i.insert(r[o].key, s[o].version);
        return new ro(e,t,s,i)
    }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Km {
    constructor(e, t) {
        this.largestBatchId = e,
        this.mutation = t
    }
    getKey() {
        return this.mutation.key
    }
    isEqual(e) {
        return e !== null && this.mutation === e.mutation
    }
    toString() {
        return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Gm {
    constructor(e, t) {
        this.count = e,
        this.unchangedNames = t
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var $, D;
function Wm(n) {
    switch (n) {
    default:
        return I();
    case d.CANCELLED:
    case d.UNKNOWN:
    case d.DEADLINE_EXCEEDED:
    case d.RESOURCE_EXHAUSTED:
    case d.INTERNAL:
    case d.UNAVAILABLE:
    case d.UNAUTHENTICATED:
        return !1;
    case d.INVALID_ARGUMENT:
    case d.NOT_FOUND:
    case d.ALREADY_EXISTS:
    case d.PERMISSION_DENIED:
    case d.FAILED_PRECONDITION:
    case d.ABORTED:
    case d.OUT_OF_RANGE:
    case d.UNIMPLEMENTED:
    case d.DATA_LOSS:
        return !0
    }
}
function Tl(n) {
    if (n === void 0)
        return Re("GRPC error has no .code"),
        d.UNKNOWN;
    switch (n) {
    case $.OK:
        return d.OK;
    case $.CANCELLED:
        return d.CANCELLED;
    case $.UNKNOWN:
        return d.UNKNOWN;
    case $.DEADLINE_EXCEEDED:
        return d.DEADLINE_EXCEEDED;
    case $.RESOURCE_EXHAUSTED:
        return d.RESOURCE_EXHAUSTED;
    case $.INTERNAL:
        return d.INTERNAL;
    case $.UNAVAILABLE:
        return d.UNAVAILABLE;
    case $.UNAUTHENTICATED:
        return d.UNAUTHENTICATED;
    case $.INVALID_ARGUMENT:
        return d.INVALID_ARGUMENT;
    case $.NOT_FOUND:
        return d.NOT_FOUND;
    case $.ALREADY_EXISTS:
        return d.ALREADY_EXISTS;
    case $.PERMISSION_DENIED:
        return d.PERMISSION_DENIED;
    case $.FAILED_PRECONDITION:
        return d.FAILED_PRECONDITION;
    case $.ABORTED:
        return d.ABORTED;
    case $.OUT_OF_RANGE:
        return d.OUT_OF_RANGE;
    case $.UNIMPLEMENTED:
        return d.UNIMPLEMENTED;
    case $.DATA_LOSS:
        return d.DATA_LOSS;
    default:
        return I()
    }
}
(D = $ || ($ = {}))[D.OK = 0] = "OK",
D[D.CANCELLED = 1] = "CANCELLED",
D[D.UNKNOWN = 2] = "UNKNOWN",
D[D.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT",
D[D.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED",
D[D.NOT_FOUND = 5] = "NOT_FOUND",
D[D.ALREADY_EXISTS = 6] = "ALREADY_EXISTS",
D[D.PERMISSION_DENIED = 7] = "PERMISSION_DENIED",
D[D.UNAUTHENTICATED = 16] = "UNAUTHENTICATED",
D[D.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED",
D[D.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION",
D[D.ABORTED = 10] = "ABORTED",
D[D.OUT_OF_RANGE = 11] = "OUT_OF_RANGE",
D[D.UNIMPLEMENTED = 12] = "UNIMPLEMENTED",
D[D.INTERNAL = 13] = "INTERNAL",
D[D.UNAVAILABLE = 14] = "UNAVAILABLE",
D[D.DATA_LOSS = 15] = "DATA_LOSS";
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class oo {
    constructor() {
        this.onExistenceFilterMismatchCallbacks = new Map
    }
    static get instance() {
        return as
    }
    static getOrCreateInstance() {
        return as === null && (as = new oo),
        as
    }
    onExistenceFilterMismatch(e) {
        const t = Symbol();
        return this.onExistenceFilterMismatchCallbacks.set(t, e),
        () => this.onExistenceFilterMismatchCallbacks.delete(t)
    }
    notifyOnExistenceFilterMismatch(e) {
        this.onExistenceFilterMismatchCallbacks.forEach(t => t(e))
    }
}
let as = null;
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Qm() {
    return new TextEncoder
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ym = new kt([4294967295, 4294967295],0);
function Oa(n) {
    const e = Qm().encode(n)
      , t = new tm;
    return t.update(e),
    new Uint8Array(t.digest())
}
function Pa(n) {
    const e = new DataView(n.buffer)
      , t = e.getUint32(0, !0)
      , s = e.getUint32(4, !0)
      , i = e.getUint32(8, !0)
      , r = e.getUint32(12, !0);
    return [new kt([t, s],0), new kt([i, r],0)]
}
class ao {
    constructor(e, t, s) {
        if (this.bitmap = e,
        this.padding = t,
        this.hashCount = s,
        t < 0 || t >= 8)
            throw new tn(`Invalid padding: ${t}`);
        if (s < 0)
            throw new tn(`Invalid hash count: ${s}`);
        if (e.length > 0 && this.hashCount === 0)
            throw new tn(`Invalid hash count: ${s}`);
        if (e.length === 0 && t !== 0)
            throw new tn(`Invalid padding when bitmap length is 0: ${t}`);
        this.It = 8 * e.length - t,
        this.Tt = kt.fromNumber(this.It)
    }
    Et(e, t, s) {
        let i = e.add(t.multiply(kt.fromNumber(s)));
        return i.compare(Ym) === 1 && (i = new kt([i.getBits(0), i.getBits(1)],0)),
        i.modulo(this.Tt).toNumber()
    }
    At(e) {
        return (this.bitmap[Math.floor(e / 8)] & 1 << e % 8) != 0
    }
    vt(e) {
        if (this.It === 0)
            return !1;
        const t = Oa(e)
          , [s,i] = Pa(t);
        for (let r = 0; r < this.hashCount; r++) {
            const o = this.Et(s, i, r);
            if (!this.At(o))
                return !1
        }
        return !0
    }
    static create(e, t, s) {
        const i = e % 8 == 0 ? 0 : 8 - e % 8
          , r = new Uint8Array(Math.ceil(e / 8))
          , o = new ao(r,i,t);
        return s.forEach(a => o.insert(a)),
        o
    }
    insert(e) {
        if (this.It === 0)
            return;
        const t = Oa(e)
          , [s,i] = Pa(t);
        for (let r = 0; r < this.hashCount; r++) {
            const o = this.Et(s, i, r);
            this.Rt(o)
        }
    }
    Rt(e) {
        const t = Math.floor(e / 8)
          , s = e % 8;
        this.bitmap[t] |= 1 << s
    }
}
class tn extends Error {
    constructor() {
        super(...arguments),
        this.name = "BloomFilterError"
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ui {
    constructor(e, t, s, i, r) {
        this.snapshotVersion = e,
        this.targetChanges = t,
        this.targetMismatches = s,
        this.documentUpdates = i,
        this.resolvedLimboDocuments = r
    }
    static createSynthesizedRemoteEventForCurrentChange(e, t, s) {
        const i = new Map;
        return i.set(e, Gn.createSynthesizedTargetChangeForCurrentChange(e, t, s)),
        new ui(S.min(),i,new x(R),Pe(),k())
    }
}
class Gn {
    constructor(e, t, s, i, r) {
        this.resumeToken = e,
        this.current = t,
        this.addedDocuments = s,
        this.modifiedDocuments = i,
        this.removedDocuments = r
    }
    static createSynthesizedTargetChangeForCurrentChange(e, t, s) {
        return new Gn(s,t,k(),k(),k())
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gs {
    constructor(e, t, s, i) {
        this.Pt = e,
        this.removedTargetIds = t,
        this.key = s,
        this.bt = i
    }
}
class Sl {
    constructor(e, t) {
        this.targetId = e,
        this.Vt = t
    }
}
class Al {
    constructor(e, t, s=re.EMPTY_BYTE_STRING, i=null) {
        this.state = e,
        this.targetIds = t,
        this.resumeToken = s,
        this.cause = i
    }
}
class Ma {
    constructor() {
        this.St = 0,
        this.Dt = xa(),
        this.Ct = re.EMPTY_BYTE_STRING,
        this.xt = !1,
        this.Nt = !0
    }
    get current() {
        return this.xt
    }
    get resumeToken() {
        return this.Ct
    }
    get kt() {
        return this.St !== 0
    }
    get Mt() {
        return this.Nt
    }
    $t(e) {
        e.approximateByteSize() > 0 && (this.Nt = !0,
        this.Ct = e)
    }
    Ot() {
        let e = k()
          , t = k()
          , s = k();
        return this.Dt.forEach( (i, r) => {
            switch (r) {
            case 0:
                e = e.add(i);
                break;
            case 2:
                t = t.add(i);
                break;
            case 1:
                s = s.add(i);
                break;
            default:
                I()
            }
        }
        ),
        new Gn(this.Ct,this.xt,e,t,s)
    }
    Ft() {
        this.Nt = !1,
        this.Dt = xa()
    }
    Bt(e, t) {
        this.Nt = !0,
        this.Dt = this.Dt.insert(e, t)
    }
    Lt(e) {
        this.Nt = !0,
        this.Dt = this.Dt.remove(e)
    }
    qt() {
        this.St += 1
    }
    Ut() {
        this.St -= 1
    }
    Kt() {
        this.Nt = !0,
        this.xt = !0
    }
}
class Jm {
    constructor(e) {
        this.Gt = e,
        this.Qt = new Map,
        this.jt = Pe(),
        this.zt = La(),
        this.Wt = new x(R)
    }
    Ht(e) {
        for (const t of e.Pt)
            e.bt && e.bt.isFoundDocument() ? this.Jt(t, e.bt) : this.Yt(t, e.key, e.bt);
        for (const t of e.removedTargetIds)
            this.Yt(t, e.key, e.bt)
    }
    Xt(e) {
        this.forEachTarget(e, t => {
            const s = this.Zt(t);
            switch (e.state) {
            case 0:
                this.te(t) && s.$t(e.resumeToken);
                break;
            case 1:
                s.Ut(),
                s.kt || s.Ft(),
                s.$t(e.resumeToken);
                break;
            case 2:
                s.Ut(),
                s.kt || this.removeTarget(t);
                break;
            case 3:
                this.te(t) && (s.Kt(),
                s.$t(e.resumeToken));
                break;
            case 4:
                this.te(t) && (this.ee(t),
                s.$t(e.resumeToken));
                break;
            default:
                I()
            }
        }
        )
    }
    forEachTarget(e, t) {
        e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.Qt.forEach( (s, i) => {
            this.te(i) && t(i)
        }
        )
    }
    ne(e) {
        var t;
        const s = e.targetId
          , i = e.Vt.count
          , r = this.se(s);
        if (r) {
            const o = r.target;
            if (or(o))
                if (i === 0) {
                    const a = new w(o.path);
                    this.Yt(s, a, Z.newNoDocument(a, S.min()))
                } else
                    L(i === 1);
            else {
                const a = this.ie(s);
                if (a !== i) {
                    const c = this.re(e, a);
                    if (c !== 0) {
                        this.ee(s);
                        const u = c === 2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
                        this.Wt = this.Wt.insert(s, u)
                    }
                    (t = oo.instance) === null || t === void 0 || t.notifyOnExistenceFilterMismatch(function(u, l, h) {
                        var f, g, E, C, _, U;
                        const V = {
                            localCacheCount: l,
                            existenceFilterCount: h.count
                        }
                          , z = h.unchangedNames;
                        return z && (V.bloomFilter = {
                            applied: u === 0,
                            hashCount: (f = z == null ? void 0 : z.hashCount) !== null && f !== void 0 ? f : 0,
                            bitmapLength: (C = (E = (g = z == null ? void 0 : z.bits) === null || g === void 0 ? void 0 : g.bitmap) === null || E === void 0 ? void 0 : E.length) !== null && C !== void 0 ? C : 0,
                            padding: (U = (_ = z == null ? void 0 : z.bits) === null || _ === void 0 ? void 0 : _.padding) !== null && U !== void 0 ? U : 0
                        }),
                        V
                    }(c, a, e.Vt))
                }
            }
        }
    }
    re(e, t) {
        const {unchangedNames: s, count: i} = e.Vt;
        if (!s || !s.bits)
            return 1;
        const {bits: {bitmap: r="", padding: o=0}, hashCount: a=0} = s;
        let c, u;
        try {
            c = ht(r).toUint8Array()
        } catch (l) {
            if (l instanceof Ju)
                return Lt("Decoding the base64 bloom filter in existence filter failed (" + l.message + "); ignoring the bloom filter and falling back to full re-query."),
                1;
            throw l
        }
        try {
            u = new ao(c,o,a)
        } catch (l) {
            return Lt(l instanceof tn ? "BloomFilter error: " : "Applying bloom filter failed: ", l),
            1
        }
        return u.It === 0 ? 1 : i !== t - this.oe(e.targetId, u) ? 2 : 0
    }
    oe(e, t) {
        const s = this.Gt.getRemoteKeysForTarget(e);
        let i = 0;
        return s.forEach(r => {
            const o = this.Gt.ue()
              , a = `projects/${o.projectId}/databases/${o.database}/documents/${r.path.canonicalString()}`;
            t.vt(a) || (this.Yt(e, r, null),
            i++)
        }
        ),
        i
    }
    ce(e) {
        const t = new Map;
        this.Qt.forEach( (r, o) => {
            const a = this.se(o);
            if (a) {
                if (r.current && or(a.target)) {
                    const c = new w(a.target.path);
                    this.jt.get(c) !== null || this.ae(o, c) || this.Yt(o, c, Z.newNoDocument(c, e))
                }
                r.Mt && (t.set(o, r.Ot()),
                r.Ft())
            }
        }
        );
        let s = k();
        this.zt.forEach( (r, o) => {
            let a = !0;
            o.forEachWhile(c => {
                const u = this.se(c);
                return !u || u.purpose === "TargetPurposeLimboResolution" || (a = !1,
                !1)
            }
            ),
            a && (s = s.add(r))
        }
        ),
        this.jt.forEach( (r, o) => o.setReadTime(e));
        const i = new ui(e,t,this.Wt,this.jt,s);
        return this.jt = Pe(),
        this.zt = La(),
        this.Wt = new x(R),
        i
    }
    Jt(e, t) {
        if (!this.te(e))
            return;
        const s = this.ae(e, t.key) ? 2 : 0;
        this.Zt(e).Bt(t.key, s),
        this.jt = this.jt.insert(t.key, t),
        this.zt = this.zt.insert(t.key, this.he(t.key).add(e))
    }
    Yt(e, t, s) {
        if (!this.te(e))
            return;
        const i = this.Zt(e);
        this.ae(e, t) ? i.Bt(t, 1) : i.Lt(t),
        this.zt = this.zt.insert(t, this.he(t).delete(e)),
        s && (this.jt = this.jt.insert(t, s))
    }
    removeTarget(e) {
        this.Qt.delete(e)
    }
    ie(e) {
        const t = this.Zt(e).Ot();
        return this.Gt.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size
    }
    qt(e) {
        this.Zt(e).qt()
    }
    Zt(e) {
        let t = this.Qt.get(e);
        return t || (t = new Ma,
        this.Qt.set(e, t)),
        t
    }
    he(e) {
        let t = this.zt.get(e);
        return t || (t = new se(R),
        this.zt = this.zt.insert(e, t)),
        t
    }
    te(e) {
        const t = this.se(e) !== null;
        return t || v("WatchChangeAggregator", "Detected inactive target", e),
        t
    }
    se(e) {
        const t = this.Qt.get(e);
        return t && t.kt ? null : this.Gt.le(e)
    }
    ee(e) {
        this.Qt.set(e, new Ma),
        this.Gt.getRemoteKeysForTarget(e).forEach(t => {
            this.Yt(e, t, null)
        }
        )
    }
    ae(e, t) {
        return this.Gt.getRemoteKeysForTarget(e).has(t)
    }
}
function La() {
    return new x(w.comparator)
}
function xa() {
    return new x(w.comparator)
}
const Xm = ( () => ({
    asc: "ASCENDING",
    desc: "DESCENDING"
}))()
  , Zm = ( () => ({
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
}))()
  , ey = ( () => ({
    and: "AND",
    or: "OR"
}))();
class ty {
    constructor(e, t) {
        this.databaseId = e,
        this.useProto3Json = t
    }
}
function lr(n, e) {
    return n.useProto3Json || si(e) ? e : {
        value: e
    }
}
function Ms(n, e) {
    return n.useProto3Json ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z` : {
        seconds: "" + e.seconds,
        nanos: e.nanoseconds
    }
}
function Cl(n, e) {
    return n.useProto3Json ? e.toBase64() : e.toUint8Array()
}
function ny(n, e) {
    return Ms(n, e.toTimestamp())
}
function Ie(n) {
    return L(!!n),
    S.fromTimestamp(function(e) {
        const t = Ge(e);
        return new q(t.seconds,t.nanos)
    }(n))
}
function co(n, e) {
    return function(t) {
        return new M(["projects", t.projectId, "databases", t.database])
    }(n).child("documents").child(e).canonicalString()
}
function bl(n) {
    const e = M.fromString(n);
    return L(Rl(e)),
    e
}
function hr(n, e) {
    return co(n.databaseId, e.path)
}
function Mi(n, e) {
    const t = bl(e);
    if (t.get(1) !== n.databaseId.projectId)
        throw new y(d.INVALID_ARGUMENT,"Tried to deserialize key from different project: " + t.get(1) + " vs " + n.databaseId.projectId);
    if (t.get(3) !== n.databaseId.database)
        throw new y(d.INVALID_ARGUMENT,"Tried to deserialize key from different database: " + t.get(3) + " vs " + n.databaseId.database);
    return new w(kl(t))
}
function dr(n, e) {
    return co(n.databaseId, e)
}
function sy(n) {
    const e = bl(n);
    return e.length === 4 ? M.emptyPath() : kl(e)
}
function fr(n) {
    return new M(["projects", n.databaseId.projectId, "databases", n.databaseId.database]).canonicalString()
}
function kl(n) {
    return L(n.length > 4 && n.get(4) === "documents"),
    n.popFirst(5)
}
function Fa(n, e, t) {
    return {
        name: hr(n, e),
        fields: t.value.mapValue.fields
    }
}
function iy(n, e) {
    let t;
    if ("targetChange"in e) {
        e.targetChange;
        const s = function(c) {
            return c === "NO_CHANGE" ? 0 : c === "ADD" ? 1 : c === "REMOVE" ? 2 : c === "CURRENT" ? 3 : c === "RESET" ? 4 : I()
        }(e.targetChange.targetChangeType || "NO_CHANGE")
          , i = e.targetChange.targetIds || []
          , r = function(c, u) {
            return c.useProto3Json ? (L(u === void 0 || typeof u == "string"),
            re.fromBase64String(u || "")) : (L(u === void 0 || u instanceof Uint8Array),
            re.fromUint8Array(u || new Uint8Array))
        }(n, e.targetChange.resumeToken)
          , o = e.targetChange.cause
          , a = o && function(c) {
            const u = c.code === void 0 ? d.UNKNOWN : Tl(c.code);
            return new y(u,c.message || "")
        }(o);
        t = new Al(s,i,r,a || null)
    } else if ("documentChange"in e) {
        e.documentChange;
        const s = e.documentChange;
        s.document,
        s.document.name,
        s.document.updateTime;
        const i = Mi(n, s.document.name)
          , r = Ie(s.document.updateTime)
          , o = s.document.createTime ? Ie(s.document.createTime) : S.min()
          , a = new le({
            mapValue: {
                fields: s.document.fields
            }
        })
          , c = Z.newFoundDocument(i, r, o, a)
          , u = s.targetIds || []
          , l = s.removedTargetIds || [];
        t = new gs(u,l,c.key,c)
    } else if ("documentDelete"in e) {
        e.documentDelete;
        const s = e.documentDelete;
        s.document;
        const i = Mi(n, s.document)
          , r = s.readTime ? Ie(s.readTime) : S.min()
          , o = Z.newNoDocument(i, r)
          , a = s.removedTargetIds || [];
        t = new gs([],a,o.key,o)
    } else if ("documentRemove"in e) {
        e.documentRemove;
        const s = e.documentRemove;
        s.document;
        const i = Mi(n, s.document)
          , r = s.removedTargetIds || [];
        t = new gs([],r,i,null)
    } else {
        if (!("filter"in e))
            return I();
        {
            e.filter;
            const s = e.filter;
            s.targetId;
            const {count: i=0, unchangedNames: r} = s
              , o = new Gm(i,r)
              , a = s.targetId;
            t = new Sl(a,o)
        }
    }
    return t
}
function ry(n, e) {
    let t;
    if (e instanceof ci)
        t = {
            update: Fa(n, e.key, e.value)
        };
    else if (e instanceof _l)
        t = {
            delete: hr(n, e.key)
        };
    else if (e instanceof mt)
        t = {
            update: Fa(n, e.key, e.data),
            updateMask: py(e.fieldMask)
        };
    else {
        if (!(e instanceof zm))
            return I();
        t = {
            verify: hr(n, e.key)
        }
    }
    return e.fieldTransforms.length > 0 && (t.updateTransforms = e.fieldTransforms.map(s => function(i, r) {
        const o = r.transform;
        if (o instanceof An)
            return {
                fieldPath: r.field.canonicalString(),
                setToServerValue: "REQUEST_TIME"
            };
        if (o instanceof Cn)
            return {
                fieldPath: r.field.canonicalString(),
                appendMissingElements: {
                    values: o.elements
                }
            };
        if (o instanceof bn)
            return {
                fieldPath: r.field.canonicalString(),
                removeAllFromArray: {
                    values: o.elements
                }
            };
        if (o instanceof kn)
            return {
                fieldPath: r.field.canonicalString(),
                increment: o.gt
            };
        throw I()
    }(0, s))),
    e.precondition.isNone || (t.currentDocument = function(s, i) {
        return i.updateTime !== void 0 ? {
            updateTime: ny(s, i.updateTime)
        } : i.exists !== void 0 ? {
            exists: i.exists
        } : I()
    }(n, e.precondition)),
    t
}
function oy(n, e) {
    return n && n.length > 0 ? (L(e !== void 0),
    n.map(t => function(s, i) {
        let r = s.updateTime ? Ie(s.updateTime) : Ie(i);
        return r.isEqual(S.min()) && (r = Ie(i)),
        new Bm(r,s.transformResults || [])
    }(t, e))) : []
}
function ay(n, e) {
    return {
        documents: [dr(n, e.path)]
    }
}
function cy(n, e) {
    const t = {
        structuredQuery: {}
    }
      , s = e.path;
    e.collectionGroup !== null ? (t.parent = dr(n, s),
    t.structuredQuery.from = [{
        collectionId: e.collectionGroup,
        allDescendants: !0
    }]) : (t.parent = dr(n, s.popLast()),
    t.structuredQuery.from = [{
        collectionId: s.lastSegment()
    }]);
    const i = function(c) {
        if (c.length !== 0)
            return Nl(ge.create(c, "and"))
    }(e.filters);
    i && (t.structuredQuery.where = i);
    const r = function(c) {
        if (c.length !== 0)
            return c.map(u => function(l) {
                return {
                    field: Et(l.field),
                    direction: hy(l.dir)
                }
            }(u))
    }(e.orderBy);
    r && (t.structuredQuery.orderBy = r);
    const o = lr(n, e.limit);
    var a;
    return o !== null && (t.structuredQuery.limit = o),
    e.startAt && (t.structuredQuery.startAt = {
        before: (a = e.startAt).inclusive,
        values: a.position
    }),
    e.endAt && (t.structuredQuery.endAt = function(c) {
        return {
            before: !c.inclusive,
            values: c.position
        }
    }(e.endAt)),
    t
}
function uy(n) {
    let e = sy(n.parent);
    const t = n.structuredQuery
      , s = t.from ? t.from.length : 0;
    let i = null;
    if (s > 0) {
        L(s === 1);
        const l = t.from[0];
        l.allDescendants ? i = l.collectionId : e = e.child(l.collectionId)
    }
    let r = [];
    t.where && (r = function(l) {
        const h = Dl(l);
        return h instanceof ge && tl(h) ? h.getFilters() : [h]
    }(t.where));
    let o = [];
    t.orderBy && (o = t.orderBy.map(l => function(h) {
        return new an(It(h.field),function(f) {
            switch (f) {
            case "ASCENDING":
                return "asc";
            case "DESCENDING":
                return "desc";
            default:
                return
            }
        }(h.direction))
    }(l)));
    let a = null;
    t.limit && (a = function(l) {
        let h;
        return h = typeof l == "object" ? l.value : l,
        si(h) ? null : h
    }(t.limit));
    let c = null;
    t.startAt && (c = function(l) {
        const h = !!l.before
          , f = l.values || [];
        return new Ps(f,h)
    }(t.startAt));
    let u = null;
    return t.endAt && (u = function(l) {
        const h = !l.before
          , f = l.values || [];
        return new Ps(f,h)
    }(t.endAt)),
    Nm(e, i, o, r, a, "F", c, u)
}
function ly(n, e) {
    const t = function(s) {
        switch (s) {
        case "TargetPurposeListen":
            return null;
        case "TargetPurposeExistenceFilterMismatch":
            return "existence-filter-mismatch";
        case "TargetPurposeExistenceFilterMismatchBloom":
            return "existence-filter-mismatch-bloom";
        case "TargetPurposeLimboResolution":
            return "limbo-document";
        default:
            return I()
        }
    }(e.purpose);
    return t == null ? null : {
        "goog-listen-tags": t
    }
}
function Dl(n) {
    return n.unaryFilter !== void 0 ? function(e) {
        switch (e.unaryFilter.op) {
        case "IS_NAN":
            const t = It(e.unaryFilter.field);
            return j.create(t, "==", {
                doubleValue: NaN
            });
        case "IS_NULL":
            const s = It(e.unaryFilter.field);
            return j.create(s, "==", {
                nullValue: "NULL_VALUE"
            });
        case "IS_NOT_NAN":
            const i = It(e.unaryFilter.field);
            return j.create(i, "!=", {
                doubleValue: NaN
            });
        case "IS_NOT_NULL":
            const r = It(e.unaryFilter.field);
            return j.create(r, "!=", {
                nullValue: "NULL_VALUE"
            });
        default:
            return I()
        }
    }(n) : n.fieldFilter !== void 0 ? function(e) {
        return j.create(It(e.fieldFilter.field), function(t) {
            switch (t) {
            case "EQUAL":
                return "==";
            case "NOT_EQUAL":
                return "!=";
            case "GREATER_THAN":
                return ">";
            case "GREATER_THAN_OR_EQUAL":
                return ">=";
            case "LESS_THAN":
                return "<";
            case "LESS_THAN_OR_EQUAL":
                return "<=";
            case "ARRAY_CONTAINS":
                return "array-contains";
            case "IN":
                return "in";
            case "NOT_IN":
                return "not-in";
            case "ARRAY_CONTAINS_ANY":
                return "array-contains-any";
            default:
                return I()
            }
        }(e.fieldFilter.op), e.fieldFilter.value)
    }(n) : n.compositeFilter !== void 0 ? function(e) {
        return ge.create(e.compositeFilter.filters.map(t => Dl(t)), function(t) {
            switch (t) {
            case "AND":
                return "and";
            case "OR":
                return "or";
            default:
                return I()
            }
        }(e.compositeFilter.op))
    }(n) : I()
}
function hy(n) {
    return Xm[n]
}
function dy(n) {
    return Zm[n]
}
function fy(n) {
    return ey[n]
}
function Et(n) {
    return {
        fieldPath: n.canonicalString()
    }
}
function It(n) {
    return ee.fromServerFormat(n.fieldPath)
}
function Nl(n) {
    return n instanceof j ? function(e) {
        if (e.op === "==") {
            if (Ta(e.value))
                return {
                    unaryFilter: {
                        field: Et(e.field),
                        op: "IS_NAN"
                    }
                };
            if (_a(e.value))
                return {
                    unaryFilter: {
                        field: Et(e.field),
                        op: "IS_NULL"
                    }
                }
        } else if (e.op === "!=") {
            if (Ta(e.value))
                return {
                    unaryFilter: {
                        field: Et(e.field),
                        op: "IS_NOT_NAN"
                    }
                };
            if (_a(e.value))
                return {
                    unaryFilter: {
                        field: Et(e.field),
                        op: "IS_NOT_NULL"
                    }
                }
        }
        return {
            fieldFilter: {
                field: Et(e.field),
                op: dy(e.op),
                value: e.value
            }
        }
    }(n) : n instanceof ge ? function(e) {
        const t = e.getFilters().map(s => Nl(s));
        return t.length === 1 ? t[0] : {
            compositeFilter: {
                op: fy(e.op),
                filters: t
            }
        }
    }(n) : I()
}
function py(n) {
    const e = [];
    return n.fields.forEach(t => e.push(t.canonicalString())),
    {
        fieldPaths: e
    }
}
function Rl(n) {
    return n.length >= 4 && n.get(0) === "projects" && n.get(2) === "databases"
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class $e {
    constructor(e, t, s, i, r=S.min(), o=S.min(), a=re.EMPTY_BYTE_STRING, c=null) {
        this.target = e,
        this.targetId = t,
        this.purpose = s,
        this.sequenceNumber = i,
        this.snapshotVersion = r,
        this.lastLimboFreeSnapshotVersion = o,
        this.resumeToken = a,
        this.expectedCount = c
    }
    withSequenceNumber(e) {
        return new $e(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)
    }
    withResumeToken(e, t) {
        return new $e(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)
    }
    withExpectedCount(e) {
        return new $e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)
    }
    withLastLimboFreeSnapshotVersion(e) {
        return new $e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gy {
    constructor(e) {
        this.fe = e
    }
}
function my(n) {
    const e = uy({
        parent: n.parent,
        structuredQuery: n.structuredQuery
    });
    return n.limitType === "LAST" ? cr(e, e.limit, "L") : e
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class yy {
    constructor() {
        this.rn = new vy
    }
    addToCollectionParentIndex(e, t) {
        return this.rn.add(t),
        p.resolve()
    }
    getCollectionParents(e, t) {
        return p.resolve(this.rn.getEntries(t))
    }
    addFieldIndex(e, t) {
        return p.resolve()
    }
    deleteFieldIndex(e, t) {
        return p.resolve()
    }
    getDocumentsMatchingTarget(e, t) {
        return p.resolve(null)
    }
    getIndexType(e, t) {
        return p.resolve(0)
    }
    getFieldIndexes(e, t) {
        return p.resolve([])
    }
    getNextCollectionGroupToUpdate(e) {
        return p.resolve(null)
    }
    getMinOffset(e, t) {
        return p.resolve(Ke.min())
    }
    getMinOffsetFromCollectionGroup(e, t) {
        return p.resolve(Ke.min())
    }
    updateCollectionGroup(e, t, s) {
        return p.resolve()
    }
    updateIndexEntries(e, t) {
        return p.resolve()
    }
}
class vy {
    constructor() {
        this.index = {}
    }
    add(e) {
        const t = e.lastSegment()
          , s = e.popLast()
          , i = this.index[t] || new se(M.comparator)
          , r = !i.has(s);
        return this.index[t] = i.add(s),
        r
    }
    has(e) {
        const t = e.lastSegment()
          , s = e.popLast()
          , i = this.index[t];
        return i && i.has(s)
    }
    getEntries(e) {
        return (this.index[e] || new se(M.comparator)).toArray()
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Vt {
    constructor(e) {
        this.Nn = e
    }
    next() {
        return this.Nn += 2,
        this.Nn
    }
    static kn() {
        return new Vt(0)
    }
    static Mn() {
        return new Vt(-1)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class wy {
    constructor() {
        this.changes = new Kt(e => e.toString(), (e, t) => e.isEqual(t)),
        this.changesApplied = !1
    }
    addEntry(e) {
        this.assertNotApplied(),
        this.changes.set(e.key, e)
    }
    removeEntry(e, t) {
        this.assertNotApplied(),
        this.changes.set(e, Z.newInvalidDocument(e).setReadTime(t))
    }
    getEntry(e, t) {
        this.assertNotApplied();
        const s = this.changes.get(t);
        return s !== void 0 ? p.resolve(s) : this.getFromCache(e, t)
    }
    getEntries(e, t) {
        return this.getAllFromCache(e, t)
    }
    apply(e) {
        return this.assertNotApplied(),
        this.changesApplied = !0,
        this.applyChanges(e)
    }
    assertNotApplied() {}
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ey {
    constructor(e, t) {
        this.overlayedDocument = e,
        this.mutatedFields = t
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Iy {
    constructor(e, t, s, i) {
        this.remoteDocumentCache = e,
        this.mutationQueue = t,
        this.documentOverlayCache = s,
        this.indexManager = i
    }
    getDocument(e, t) {
        let s = null;
        return this.documentOverlayCache.getOverlay(e, t).next(i => (s = i,
        this.remoteDocumentCache.getEntry(e, t))).next(i => (s !== null && un(s.mutation, i, fe.empty(), q.now()),
        i))
    }
    getDocuments(e, t) {
        return this.remoteDocumentCache.getEntries(e, t).next(s => this.getLocalViewOfDocuments(e, s, k()).next( () => s))
    }
    getLocalViewOfDocuments(e, t, s=k()) {
        const i = st();
        return this.populateOverlays(e, i, t).next( () => this.computeViews(e, t, i, s).next(r => {
            let o = en();
            return r.forEach( (a, c) => {
                o = o.insert(a, c.overlayedDocument)
            }
            ),
            o
        }
        ))
    }
    getOverlayedDocuments(e, t) {
        const s = st();
        return this.populateOverlays(e, s, t).next( () => this.computeViews(e, t, s, k()))
    }
    populateOverlays(e, t, s) {
        const i = [];
        return s.forEach(r => {
            t.has(r) || i.push(r)
        }
        ),
        this.documentOverlayCache.getOverlays(e, i).next(r => {
            r.forEach( (o, a) => {
                t.set(o, a)
            }
            )
        }
        )
    }
    computeViews(e, t, s, i) {
        let r = Pe();
        const o = cn()
          , a = cn();
        return t.forEach( (c, u) => {
            const l = s.get(u.key);
            i.has(u.key) && (l === void 0 || l.mutation instanceof mt) ? r = r.insert(u.key, u) : l !== void 0 ? (o.set(u.key, l.mutation.getFieldMask()),
            un(l.mutation, u, l.mutation.getFieldMask(), q.now())) : o.set(u.key, fe.empty())
        }
        ),
        this.recalculateAndSaveOverlays(e, r).next(c => (c.forEach( (u, l) => o.set(u, l)),
        t.forEach( (u, l) => {
            var h;
            return a.set(u, new Ey(l,(h = o.get(u)) !== null && h !== void 0 ? h : null))
        }
        ),
        a))
    }
    recalculateAndSaveOverlays(e, t) {
        const s = cn();
        let i = new x( (o, a) => o - a)
          , r = k();
        return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next(o => {
            for (const a of o)
                a.keys().forEach(c => {
                    const u = t.get(c);
                    if (u === null)
                        return;
                    let l = s.get(c) || fe.empty();
                    l = a.applyToLocalView(u, l),
                    s.set(c, l);
                    const h = (i.get(a.batchId) || k()).add(c);
                    i = i.insert(a.batchId, h)
                }
                )
        }
        ).next( () => {
            const o = []
              , a = i.getReverseIterator();
            for (; a.hasNext(); ) {
                const c = a.getNext()
                  , u = c.key
                  , l = c.value
                  , h = hl();
                l.forEach(f => {
                    if (!r.has(f)) {
                        const g = El(t.get(f), s.get(f));
                        g !== null && h.set(f, g),
                        r = r.add(f)
                    }
                }
                ),
                o.push(this.documentOverlayCache.saveOverlays(e, u, h))
            }
            return p.waitFor(o)
        }
        ).next( () => s)
    }
    recalculateAndSaveOverlaysForDocumentKeys(e, t) {
        return this.remoteDocumentCache.getEntries(e, t).next(s => this.recalculateAndSaveOverlays(e, s))
    }
    getDocumentsMatchingQuery(e, t, s) {
        return function(i) {
            return w.isDocumentKey(i.path) && i.collectionGroup === null && i.filters.length === 0
        }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : ol(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, s) : this.getDocumentsMatchingCollectionQuery(e, t, s)
    }
    getNextDocuments(e, t, s, i) {
        return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, s, i).next(r => {
            const o = i - r.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, s.largestBatchId, i - r.size) : p.resolve(st());
            let a = -1
              , c = r;
            return o.next(u => p.forEach(u, (l, h) => (a < h.largestBatchId && (a = h.largestBatchId),
            r.get(l) ? p.resolve() : this.remoteDocumentCache.getEntry(e, l).next(f => {
                c = c.insert(l, f)
            }
            ))).next( () => this.populateOverlays(e, u, r)).next( () => this.computeViews(e, c, u, k())).next(l => ({
                batchId: a,
                changes: ll(l)
            })))
        }
        )
    }
    getDocumentsMatchingDocumentQuery(e, t) {
        return this.getDocument(e, new w(t)).next(s => {
            let i = en();
            return s.isFoundDocument() && (i = i.insert(s.key, s)),
            i
        }
        )
    }
    getDocumentsMatchingCollectionGroupQuery(e, t, s) {
        const i = t.collectionGroup;
        let r = en();
        return this.indexManager.getCollectionParents(e, i).next(o => p.forEach(o, a => {
            const c = function(u, l) {
                return new Kn(l,null,u.explicitOrderBy.slice(),u.filters.slice(),u.limit,u.limitType,u.startAt,u.endAt)
            }(t, a.child(i));
            return this.getDocumentsMatchingCollectionQuery(e, c, s).next(u => {
                u.forEach( (l, h) => {
                    r = r.insert(l, h)
                }
                )
            }
            )
        }
        ).next( () => r))
    }
    getDocumentsMatchingCollectionQuery(e, t, s) {
        let i;
        return this.documentOverlayCache.getOverlaysForCollection(e, t.path, s.largestBatchId).next(r => (i = r,
        this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, s, i))).next(r => {
            i.forEach( (a, c) => {
                const u = c.getKey();
                r.get(u) === null && (r = r.insert(u, Z.newInvalidDocument(u)))
            }
            );
            let o = en();
            return r.forEach( (a, c) => {
                const u = i.get(a);
                u !== void 0 && un(u.mutation, c, fe.empty(), q.now()),
                ri(t, c) && (o = o.insert(a, c))
            }
            ),
            o
        }
        )
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class _y {
    constructor(e) {
        this.serializer = e,
        this.cs = new Map,
        this.hs = new Map
    }
    getBundleMetadata(e, t) {
        return p.resolve(this.cs.get(t))
    }
    saveBundleMetadata(e, t) {
        var s;
        return this.cs.set(t.id, {
            id: (s = t).id,
            version: s.version,
            createTime: Ie(s.createTime)
        }),
        p.resolve()
    }
    getNamedQuery(e, t) {
        return p.resolve(this.hs.get(t))
    }
    saveNamedQuery(e, t) {
        return this.hs.set(t.name, function(s) {
            return {
                name: s.name,
                query: my(s.bundledQuery),
                readTime: Ie(s.readTime)
            }
        }(t)),
        p.resolve()
    }
}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ty {
    constructor() {
        this.overlays = new x(w.comparator),
        this.ls = new Map
    }
    getOverlay(e, t) {
        return p.resolve(this.overlays.get(t))
    }
    getOverlays(e, t) {
        const s = st();
        return p.forEach(t, i => this.getOverlay(e, i).next(r => {
            r !== null && s.set(i, r)
        }
        )).next( () => s)
    }
    saveOverlays(e, t, s) {
        return s.forEach( (i, r) => {
            this.we(e, t, r)
        }
        ),
        p.resolve()
    }
    removeOverlaysForBatchId(e, t, s) {
        const i = this.ls.get(s);
        return i !== void 0 && (i.forEach(r => this.overlays = this.overlays.remove(r)),
        this.ls.delete(s)),
        p.resolve()
    }
    getOverlaysForCollection(e, t, s) {
        const i = st()
          , r = t.length + 1
          , o = new w(t.child(""))
          , a = this.overlays.getIteratorFrom(o);
        for (; a.hasNext(); ) {
            const c = a.getNext().value
              , u = c.getKey();
            if (!t.isPrefixOf(u.path))
                break;
            u.path.length === r && c.largestBatchId > s && i.set(c.getKey(), c)
        }
        return p.resolve(i)
    }
    getOverlaysForCollectionGroup(e, t, s, i) {
        let r = new x( (u, l) => u - l);
        const o = this.overlays.getIterator();
        for (; o.hasNext(); ) {
            const u = o.getNext().value;
            if (u.getKey().getCollectionGroup() === t && u.largestBatchId > s) {
                let l = r.get(u.largestBatchId);
                l === null && (l = st(),
                r = r.insert(u.largestBatchId, l)),
                l.set(u.getKey(), u)
            }
        }
        const a = st()
          , c = r.getIterator();
        for (; c.hasNext() && (c.getNext().value.forEach( (u, l) => a.set(u, l)),
        !(a.size() >= i)); )
            ;
        return p.resolve(a)
    }
    we(e, t, s) {
        const i = this.overlays.get(s.key);
        if (i !== null) {
            const o = this.ls.get(i.largestBatchId).delete(s.key);
            this.ls.set(i.largestBatchId, o)
        }
        this.overlays = this.overlays.insert(s.key, new Km(t,s));
        let r = this.ls.get(t);
        r === void 0 && (r = k(),
        this.ls.set(t, r)),
        this.ls.set(t, r.add(s.key))
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class uo {
    constructor() {
        this.fs = new se(H.ds),
        this.ws = new se(H._s)
    }
    isEmpty() {
        return this.fs.isEmpty()
    }
    addReference(e, t) {
        const s = new H(e,t);
        this.fs = this.fs.add(s),
        this.ws = this.ws.add(s)
    }
    gs(e, t) {
        e.forEach(s => this.addReference(s, t))
    }
    removeReference(e, t) {
        this.ys(new H(e,t))
    }
    ps(e, t) {
        e.forEach(s => this.removeReference(s, t))
    }
    Is(e) {
        const t = new w(new M([]))
          , s = new H(t,e)
          , i = new H(t,e + 1)
          , r = [];
        return this.ws.forEachInRange([s, i], o => {
            this.ys(o),
            r.push(o.key)
        }
        ),
        r
    }
    Ts() {
        this.fs.forEach(e => this.ys(e))
    }
    ys(e) {
        this.fs = this.fs.delete(e),
        this.ws = this.ws.delete(e)
    }
    Es(e) {
        const t = new w(new M([]))
          , s = new H(t,e)
          , i = new H(t,e + 1);
        let r = k();
        return this.ws.forEachInRange([s, i], o => {
            r = r.add(o.key)
        }
        ),
        r
    }
    containsKey(e) {
        const t = new H(e,0)
          , s = this.fs.firstAfterOrEqual(t);
        return s !== null && e.isEqual(s.key)
    }
}
class H {
    constructor(e, t) {
        this.key = e,
        this.As = t
    }
    static ds(e, t) {
        return w.comparator(e.key, t.key) || R(e.As, t.As)
    }
    static _s(e, t) {
        return R(e.As, t.As) || w.comparator(e.key, t.key)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Sy {
    constructor(e, t) {
        this.indexManager = e,
        this.referenceDelegate = t,
        this.mutationQueue = [],
        this.vs = 1,
        this.Rs = new se(H.ds)
    }
    checkEmpty(e) {
        return p.resolve(this.mutationQueue.length === 0)
    }
    addMutationBatch(e, t, s, i) {
        const r = this.vs;
        this.vs++,
        this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
        const o = new Hm(r,t,s,i);
        this.mutationQueue.push(o);
        for (const a of i)
            this.Rs = this.Rs.add(new H(a.key,r)),
            this.indexManager.addToCollectionParentIndex(e, a.key.path.popLast());
        return p.resolve(o)
    }
    lookupMutationBatch(e, t) {
        return p.resolve(this.Ps(t))
    }
    getNextMutationBatchAfterBatchId(e, t) {
        const s = t + 1
          , i = this.bs(s)
          , r = i < 0 ? 0 : i;
        return p.resolve(this.mutationQueue.length > r ? this.mutationQueue[r] : null)
    }
    getHighestUnacknowledgedBatchId() {
        return p.resolve(this.mutationQueue.length === 0 ? -1 : this.vs - 1)
    }
    getAllMutationBatches(e) {
        return p.resolve(this.mutationQueue.slice())
    }
    getAllMutationBatchesAffectingDocumentKey(e, t) {
        const s = new H(t,0)
          , i = new H(t,Number.POSITIVE_INFINITY)
          , r = [];
        return this.Rs.forEachInRange([s, i], o => {
            const a = this.Ps(o.As);
            r.push(a)
        }
        ),
        p.resolve(r)
    }
    getAllMutationBatchesAffectingDocumentKeys(e, t) {
        let s = new se(R);
        return t.forEach(i => {
            const r = new H(i,0)
              , o = new H(i,Number.POSITIVE_INFINITY);
            this.Rs.forEachInRange([r, o], a => {
                s = s.add(a.As)
            }
            )
        }
        ),
        p.resolve(this.Vs(s))
    }
    getAllMutationBatchesAffectingQuery(e, t) {
        const s = t.path
          , i = s.length + 1;
        let r = s;
        w.isDocumentKey(r) || (r = r.child(""));
        const o = new H(new w(r),0);
        let a = new se(R);
        return this.Rs.forEachWhile(c => {
            const u = c.key.path;
            return !!s.isPrefixOf(u) && (u.length === i && (a = a.add(c.As)),
            !0)
        }
        , o),
        p.resolve(this.Vs(a))
    }
    Vs(e) {
        const t = [];
        return e.forEach(s => {
            const i = this.Ps(s);
            i !== null && t.push(i)
        }
        ),
        t
    }
    removeMutationBatch(e, t) {
        L(this.Ss(t.batchId, "removed") === 0),
        this.mutationQueue.shift();
        let s = this.Rs;
        return p.forEach(t.mutations, i => {
            const r = new H(i.key,t.batchId);
            return s = s.delete(r),
            this.referenceDelegate.markPotentiallyOrphaned(e, i.key)
        }
        ).next( () => {
            this.Rs = s
        }
        )
    }
    Cn(e) {}
    containsKey(e, t) {
        const s = new H(t,0)
          , i = this.Rs.firstAfterOrEqual(s);
        return p.resolve(t.isEqual(i && i.key))
    }
    performConsistencyCheck(e) {
        return this.mutationQueue.length,
        p.resolve()
    }
    Ss(e, t) {
        return this.bs(e)
    }
    bs(e) {
        return this.mutationQueue.length === 0 ? 0 : e - this.mutationQueue[0].batchId
    }
    Ps(e) {
        const t = this.bs(e);
        return t < 0 || t >= this.mutationQueue.length ? null : this.mutationQueue[t]
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ay {
    constructor(e) {
        this.Ds = e,
        this.docs = new x(w.comparator),
        this.size = 0
    }
    setIndexManager(e) {
        this.indexManager = e
    }
    addEntry(e, t) {
        const s = t.key
          , i = this.docs.get(s)
          , r = i ? i.size : 0
          , o = this.Ds(t);
        return this.docs = this.docs.insert(s, {
            document: t.mutableCopy(),
            size: o
        }),
        this.size += o - r,
        this.indexManager.addToCollectionParentIndex(e, s.path.popLast())
    }
    removeEntry(e) {
        const t = this.docs.get(e);
        t && (this.docs = this.docs.remove(e),
        this.size -= t.size)
    }
    getEntry(e, t) {
        const s = this.docs.get(t);
        return p.resolve(s ? s.document.mutableCopy() : Z.newInvalidDocument(t))
    }
    getEntries(e, t) {
        let s = Pe();
        return t.forEach(i => {
            const r = this.docs.get(i);
            s = s.insert(i, r ? r.document.mutableCopy() : Z.newInvalidDocument(i))
        }
        ),
        p.resolve(s)
    }
    getDocumentsMatchingQuery(e, t, s, i) {
        let r = Pe();
        const o = t.path
          , a = new w(o.child(""))
          , c = this.docs.getIteratorFrom(a);
        for (; c.hasNext(); ) {
            const {key: u, value: {document: l}} = c.getNext();
            if (!o.isPrefixOf(u.path))
                break;
            u.path.length > o.length + 1 || fm(dm(l), s) <= 0 || (i.has(l.key) || ri(t, l)) && (r = r.insert(l.key, l.mutableCopy()))
        }
        return p.resolve(r)
    }
    getAllFromCollectionGroup(e, t, s, i) {
        I()
    }
    Cs(e, t) {
        return p.forEach(this.docs, s => t(s))
    }
    newChangeBuffer(e) {
        return new Cy(this)
    }
    getSize(e) {
        return p.resolve(this.size)
    }
}
class Cy extends wy {
    constructor(e) {
        super(),
        this.os = e
    }
    applyChanges(e) {
        const t = [];
        return this.changes.forEach( (s, i) => {
            i.isValidDocument() ? t.push(this.os.addEntry(e, i)) : this.os.removeEntry(s)
        }
        ),
        p.waitFor(t)
    }
    getFromCache(e, t) {
        return this.os.getEntry(e, t)
    }
    getAllFromCache(e, t) {
        return this.os.getEntries(e, t)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class by {
    constructor(e) {
        this.persistence = e,
        this.xs = new Kt(t => to(t),no),
        this.lastRemoteSnapshotVersion = S.min(),
        this.highestTargetId = 0,
        this.Ns = 0,
        this.ks = new uo,
        this.targetCount = 0,
        this.Ms = Vt.kn()
    }
    forEachTarget(e, t) {
        return this.xs.forEach( (s, i) => t(i)),
        p.resolve()
    }
    getLastRemoteSnapshotVersion(e) {
        return p.resolve(this.lastRemoteSnapshotVersion)
    }
    getHighestSequenceNumber(e) {
        return p.resolve(this.Ns)
    }
    allocateTargetId(e) {
        return this.highestTargetId = this.Ms.next(),
        p.resolve(this.highestTargetId)
    }
    setTargetsMetadata(e, t, s) {
        return s && (this.lastRemoteSnapshotVersion = s),
        t > this.Ns && (this.Ns = t),
        p.resolve()
    }
    Fn(e) {
        this.xs.set(e.target, e);
        const t = e.targetId;
        t > this.highestTargetId && (this.Ms = new Vt(t),
        this.highestTargetId = t),
        e.sequenceNumber > this.Ns && (this.Ns = e.sequenceNumber)
    }
    addTargetData(e, t) {
        return this.Fn(t),
        this.targetCount += 1,
        p.resolve()
    }
    updateTargetData(e, t) {
        return this.Fn(t),
        p.resolve()
    }
    removeTargetData(e, t) {
        return this.xs.delete(t.target),
        this.ks.Is(t.targetId),
        this.targetCount -= 1,
        p.resolve()
    }
    removeTargets(e, t, s) {
        let i = 0;
        const r = [];
        return this.xs.forEach( (o, a) => {
            a.sequenceNumber <= t && s.get(a.targetId) === null && (this.xs.delete(o),
            r.push(this.removeMatchingKeysForTargetId(e, a.targetId)),
            i++)
        }
        ),
        p.waitFor(r).next( () => i)
    }
    getTargetCount(e) {
        return p.resolve(this.targetCount)
    }
    getTargetData(e, t) {
        const s = this.xs.get(t) || null;
        return p.resolve(s)
    }
    addMatchingKeys(e, t, s) {
        return this.ks.gs(t, s),
        p.resolve()
    }
    removeMatchingKeys(e, t, s) {
        this.ks.ps(t, s);
        const i = this.persistence.referenceDelegate
          , r = [];
        return i && t.forEach(o => {
            r.push(i.markPotentiallyOrphaned(e, o))
        }
        ),
        p.waitFor(r)
    }
    removeMatchingKeysForTargetId(e, t) {
        return this.ks.Is(t),
        p.resolve()
    }
    getMatchingKeysForTargetId(e, t) {
        const s = this.ks.Es(t);
        return p.resolve(s)
    }
    containsKey(e, t) {
        return p.resolve(this.ks.containsKey(t))
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ky {
    constructor(e, t) {
        this.$s = {},
        this.overlays = {},
        this.Os = new Jr(0),
        this.Fs = !1,
        this.Fs = !0,
        this.referenceDelegate = e(this),
        this.Bs = new by(this),
        this.indexManager = new yy,
        this.remoteDocumentCache = function(s) {
            return new Ay(s)
        }(s => this.referenceDelegate.Ls(s)),
        this.serializer = new gy(t),
        this.qs = new _y(this.serializer)
    }
    start() {
        return Promise.resolve()
    }
    shutdown() {
        return this.Fs = !1,
        Promise.resolve()
    }
    get started() {
        return this.Fs
    }
    setDatabaseDeletedListener() {}
    setNetworkEnabled() {}
    getIndexManager(e) {
        return this.indexManager
    }
    getDocumentOverlayCache(e) {
        let t = this.overlays[e.toKey()];
        return t || (t = new Ty,
        this.overlays[e.toKey()] = t),
        t
    }
    getMutationQueue(e, t) {
        let s = this.$s[e.toKey()];
        return s || (s = new Sy(t,this.referenceDelegate),
        this.$s[e.toKey()] = s),
        s
    }
    getTargetCache() {
        return this.Bs
    }
    getRemoteDocumentCache() {
        return this.remoteDocumentCache
    }
    getBundleCache() {
        return this.qs
    }
    runTransaction(e, t, s) {
        v("MemoryPersistence", "Starting transaction:", e);
        const i = new Dy(this.Os.next());
        return this.referenceDelegate.Us(),
        s(i).next(r => this.referenceDelegate.Ks(i).next( () => r)).toPromise().then(r => (i.raiseOnCommittedEvent(),
        r))
    }
    Gs(e, t) {
        return p.or(Object.values(this.$s).map(s => () => s.containsKey(e, t)))
    }
}
class Dy extends gm {
    constructor(e) {
        super(),
        this.currentSequenceNumber = e
    }
}
class lo {
    constructor(e) {
        this.persistence = e,
        this.Qs = new uo,
        this.js = null
    }
    static zs(e) {
        return new lo(e)
    }
    get Ws() {
        if (this.js)
            return this.js;
        throw I()
    }
    addReference(e, t, s) {
        return this.Qs.addReference(s, t),
        this.Ws.delete(s.toString()),
        p.resolve()
    }
    removeReference(e, t, s) {
        return this.Qs.removeReference(s, t),
        this.Ws.add(s.toString()),
        p.resolve()
    }
    markPotentiallyOrphaned(e, t) {
        return this.Ws.add(t.toString()),
        p.resolve()
    }
    removeTarget(e, t) {
        this.Qs.Is(t.targetId).forEach(i => this.Ws.add(i.toString()));
        const s = this.persistence.getTargetCache();
        return s.getMatchingKeysForTargetId(e, t.targetId).next(i => {
            i.forEach(r => this.Ws.add(r.toString()))
        }
        ).next( () => s.removeTargetData(e, t))
    }
    Us() {
        this.js = new Set
    }
    Ks(e) {
        const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
        return p.forEach(this.Ws, s => {
            const i = w.fromPath(s);
            return this.Hs(e, i).next(r => {
                r || t.removeEntry(i, S.min())
            }
            )
        }
        ).next( () => (this.js = null,
        t.apply(e)))
    }
    updateLimboDocument(e, t) {
        return this.Hs(e, t).next(s => {
            s ? this.Ws.delete(t.toString()) : this.Ws.add(t.toString())
        }
        )
    }
    Ls(e) {
        return 0
    }
    Hs(e, t) {
        return p.or([ () => p.resolve(this.Qs.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Gs(e, t)])
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ho {
    constructor(e, t, s, i) {
        this.targetId = e,
        this.fromCache = t,
        this.Fi = s,
        this.Bi = i
    }
    static Li(e, t) {
        let s = k()
          , i = k();
        for (const r of t.docChanges)
            switch (r.type) {
            case 0:
                s = s.add(r.doc.key);
                break;
            case 1:
                i = i.add(r.doc.key)
            }
        return new ho(e,t.fromCache,s,i)
    }
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ny {
    constructor() {
        this.qi = !1
    }
    initialize(e, t) {
        this.Ui = e,
        this.indexManager = t,
        this.qi = !0
    }
    getDocumentsMatchingQuery(e, t, s, i) {
        return this.Ki(e, t).next(r => r || this.Gi(e, t, i, s)).next(r => r || this.Qi(e, t))
    }
    Ki(e, t) {
        if (ba(t))
            return p.resolve(null);
        let s = Oe(t);
        return this.indexManager.getIndexType(e, s).next(i => i === 0 ? null : (t.limit !== null && i === 1 && (t = cr(t, null, "F"),
        s = Oe(t)),
        this.indexManager.getDocumentsMatchingTarget(e, s).next(r => {
            const o = k(...r);
            return this.Ui.getDocuments(e, o).next(a => this.indexManager.getMinOffset(e, s).next(c => {
                const u = this.ji(t, a);
                return this.zi(t, u, o, c.readTime) ? this.Ki(e, cr(t, null, "F")) : this.Wi(e, u, t, c)
            }
            ))
        }
        )))
    }
    Gi(e, t, s, i) {
        return ba(t) || i.isEqual(S.min()) ? this.Qi(e, t) : this.Ui.getDocuments(e, s).next(r => {
            const o = this.ji(t, r);
            return this.zi(t, o, s, i) ? this.Qi(e, t) : (ya() <= N.DEBUG && v("QueryEngine", "Re-using previous result from %s to execute query: %s", i.toString(), ur(t)),
            this.Wi(e, o, t, hm(i, -1)))
        }
        )
    }
    ji(e, t) {
        let s = new se(cl(e));
        return t.forEach( (i, r) => {
            ri(e, r) && (s = s.add(r))
        }
        ),
        s
    }
    zi(e, t, s, i) {
        if (e.limit === null)
            return !1;
        if (s.size !== t.size)
            return !0;
        const r = e.limitType === "F" ? t.last() : t.first();
        return !!r && (r.hasPendingWrites || r.version.compareTo(i) > 0)
    }
    Qi(e, t) {
        return ya() <= N.DEBUG && v("QueryEngine", "Using full collection scan to execute query:", ur(t)),
        this.Ui.getDocumentsMatchingQuery(e, t, Ke.min())
    }
    Wi(e, t, s, i) {
        return this.Ui.getDocumentsMatchingQuery(e, s, i).next(r => (t.forEach(o => {
            r = r.insert(o.key, o)
        }
        ),
        r))
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ry {
    constructor(e, t, s, i) {
        this.persistence = e,
        this.Hi = t,
        this.serializer = i,
        this.Ji = new x(R),
        this.Yi = new Kt(r => to(r),no),
        this.Xi = new Map,
        this.Zi = e.getRemoteDocumentCache(),
        this.Bs = e.getTargetCache(),
        this.qs = e.getBundleCache(),
        this.tr(s)
    }
    tr(e) {
        this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e),
        this.indexManager = this.persistence.getIndexManager(e),
        this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager),
        this.localDocuments = new Iy(this.Zi,this.mutationQueue,this.documentOverlayCache,this.indexManager),
        this.Zi.setIndexManager(this.indexManager),
        this.Hi.initialize(this.localDocuments, this.indexManager)
    }
    collectGarbage(e) {
        return this.persistence.runTransaction("Collect garbage", "readwrite-primary", t => e.collect(t, this.Ji))
    }
}
function Oy(n, e, t, s) {
    return new Ry(n,e,t,s)
}
async function Ol(n, e) {
    const t = b(n);
    return await t.persistence.runTransaction("Handle user change", "readonly", s => {
        let i;
        return t.mutationQueue.getAllMutationBatches(s).next(r => (i = r,
        t.tr(e),
        t.mutationQueue.getAllMutationBatches(s))).next(r => {
            const o = []
              , a = [];
            let c = k();
            for (const u of i) {
                o.push(u.batchId);
                for (const l of u.mutations)
                    c = c.add(l.key)
            }
            for (const u of r) {
                a.push(u.batchId);
                for (const l of u.mutations)
                    c = c.add(l.key)
            }
            return t.localDocuments.getDocuments(s, c).next(u => ({
                er: u,
                removedBatchIds: o,
                addedBatchIds: a
            }))
        }
        )
    }
    )
}
function Py(n, e) {
    const t = b(n);
    return t.persistence.runTransaction("Acknowledge batch", "readwrite-primary", s => {
        const i = e.batch.keys()
          , r = t.Zi.newChangeBuffer({
            trackRemovals: !0
        });
        return function(o, a, c, u) {
            const l = c.batch
              , h = l.keys();
            let f = p.resolve();
            return h.forEach(g => {
                f = f.next( () => u.getEntry(a, g)).next(E => {
                    const C = c.docVersions.get(g);
                    L(C !== null),
                    E.version.compareTo(C) < 0 && (l.applyToRemoteDocument(E, c),
                    E.isValidDocument() && (E.setReadTime(c.commitVersion),
                    u.addEntry(E)))
                }
                )
            }
            ),
            f.next( () => o.mutationQueue.removeMutationBatch(a, l))
        }(t, s, e, r).next( () => r.apply(s)).next( () => t.mutationQueue.performConsistencyCheck(s)).next( () => t.documentOverlayCache.removeOverlaysForBatchId(s, i, e.batch.batchId)).next( () => t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(s, function(o) {
            let a = k();
            for (let c = 0; c < o.mutationResults.length; ++c)
                o.mutationResults[c].transformResults.length > 0 && (a = a.add(o.batch.mutations[c].key));
            return a
        }(e))).next( () => t.localDocuments.getDocuments(s, i))
    }
    )
}
function Pl(n) {
    const e = b(n);
    return e.persistence.runTransaction("Get last remote snapshot version", "readonly", t => e.Bs.getLastRemoteSnapshotVersion(t))
}
function My(n, e) {
    const t = b(n)
      , s = e.snapshotVersion;
    let i = t.Ji;
    return t.persistence.runTransaction("Apply remote event", "readwrite-primary", r => {
        const o = t.Zi.newChangeBuffer({
            trackRemovals: !0
        });
        i = t.Ji;
        const a = [];
        e.targetChanges.forEach( (l, h) => {
            const f = i.get(h);
            if (!f)
                return;
            a.push(t.Bs.removeMatchingKeys(r, l.removedDocuments, h).next( () => t.Bs.addMatchingKeys(r, l.addedDocuments, h)));
            let g = f.withSequenceNumber(r.currentSequenceNumber);
            e.targetMismatches.get(h) !== null ? g = g.withResumeToken(re.EMPTY_BYTE_STRING, S.min()).withLastLimboFreeSnapshotVersion(S.min()) : l.resumeToken.approximateByteSize() > 0 && (g = g.withResumeToken(l.resumeToken, s)),
            i = i.insert(h, g),
            function(E, C, _) {
                return E.resumeToken.approximateByteSize() === 0 || C.snapshotVersion.toMicroseconds() - E.snapshotVersion.toMicroseconds() >= 3e8 ? !0 : _.addedDocuments.size + _.modifiedDocuments.size + _.removedDocuments.size > 0
            }(f, g, l) && a.push(t.Bs.updateTargetData(r, g))
        }
        );
        let c = Pe()
          , u = k();
        if (e.documentUpdates.forEach(l => {
            e.resolvedLimboDocuments.has(l) && a.push(t.persistence.referenceDelegate.updateLimboDocument(r, l))
        }
        ),
        a.push(Ly(r, o, e.documentUpdates).next(l => {
            c = l.nr,
            u = l.sr
        }
        )),
        !s.isEqual(S.min())) {
            const l = t.Bs.getLastRemoteSnapshotVersion(r).next(h => t.Bs.setTargetsMetadata(r, r.currentSequenceNumber, s));
            a.push(l)
        }
        return p.waitFor(a).next( () => o.apply(r)).next( () => t.localDocuments.getLocalViewOfDocuments(r, c, u)).next( () => c)
    }
    ).then(r => (t.Ji = i,
    r))
}
function Ly(n, e, t) {
    let s = k()
      , i = k();
    return t.forEach(r => s = s.add(r)),
    e.getEntries(n, s).next(r => {
        let o = Pe();
        return t.forEach( (a, c) => {
            const u = r.get(a);
            c.isFoundDocument() !== u.isFoundDocument() && (i = i.add(a)),
            c.isNoDocument() && c.version.isEqual(S.min()) ? (e.removeEntry(a, c.readTime),
            o = o.insert(a, c)) : !u.isValidDocument() || c.version.compareTo(u.version) > 0 || c.version.compareTo(u.version) === 0 && u.hasPendingWrites ? (e.addEntry(c),
            o = o.insert(a, c)) : v("LocalStore", "Ignoring outdated watch update for ", a, ". Current version:", u.version, " Watch version:", c.version)
        }
        ),
        {
            nr: o,
            sr: i
        }
    }
    )
}
function xy(n, e) {
    const t = b(n);
    return t.persistence.runTransaction("Get next mutation batch", "readonly", s => (e === void 0 && (e = -1),
    t.mutationQueue.getNextMutationBatchAfterBatchId(s, e)))
}
function Fy(n, e) {
    const t = b(n);
    return t.persistence.runTransaction("Allocate target", "readwrite", s => {
        let i;
        return t.Bs.getTargetData(s, e).next(r => r ? (i = r,
        p.resolve(i)) : t.Bs.allocateTargetId(s).next(o => (i = new $e(e,o,"TargetPurposeListen",s.currentSequenceNumber),
        t.Bs.addTargetData(s, i).next( () => i))))
    }
    ).then(s => {
        const i = t.Ji.get(s.targetId);
        return (i === null || s.snapshotVersion.compareTo(i.snapshotVersion) > 0) && (t.Ji = t.Ji.insert(s.targetId, s),
        t.Yi.set(e, s.targetId)),
        s
    }
    )
}
async function pr(n, e, t) {
    const s = b(n)
      , i = s.Ji.get(e)
      , r = t ? "readwrite" : "readwrite-primary";
    try {
        t || await s.persistence.runTransaction("Release target", r, o => s.persistence.referenceDelegate.removeTarget(o, i))
    } catch (o) {
        if (!Hn(o))
            throw o;
        v("LocalStore", `Failed to update sequence numbers for target ${e}: ${o}`)
    }
    s.Ji = s.Ji.remove(e),
    s.Yi.delete(i.target)
}
function Ua(n, e, t) {
    const s = b(n);
    let i = S.min()
      , r = k();
    return s.persistence.runTransaction("Execute query", "readonly", o => function(a, c, u) {
        const l = b(a)
          , h = l.Yi.get(u);
        return h !== void 0 ? p.resolve(l.Ji.get(h)) : l.Bs.getTargetData(c, u)
    }(s, o, Oe(e)).next(a => {
        if (a)
            return i = a.lastLimboFreeSnapshotVersion,
            s.Bs.getMatchingKeysForTargetId(o, a.targetId).next(c => {
                r = c
            }
            )
    }
    ).next( () => s.Hi.getDocumentsMatchingQuery(o, e, t ? i : S.min(), t ? r : k())).next(a => (Uy(s, Rm(e), a),
    {
        documents: a,
        ir: r
    })))
}
function Uy(n, e, t) {
    let s = n.Xi.get(e) || S.min();
    t.forEach( (i, r) => {
        r.readTime.compareTo(s) > 0 && (s = r.readTime)
    }
    ),
    n.Xi.set(e, s)
}
class Va {
    constructor() {
        this.activeTargetIds = Fm()
    }
    lr(e) {
        this.activeTargetIds = this.activeTargetIds.add(e)
    }
    dr(e) {
        this.activeTargetIds = this.activeTargetIds.delete(e)
    }
    hr() {
        const e = {
            activeTargetIds: this.activeTargetIds.toArray(),
            updateTimeMs: Date.now()
        };
        return JSON.stringify(e)
    }
}
class Vy {
    constructor() {
        this.Hr = new Va,
        this.Jr = {},
        this.onlineStateHandler = null,
        this.sequenceNumberHandler = null
    }
    addPendingMutation(e) {}
    updateMutationState(e, t, s) {}
    addLocalQueryTarget(e) {
        return this.Hr.lr(e),
        this.Jr[e] || "not-current"
    }
    updateQueryState(e, t, s) {
        this.Jr[e] = t
    }
    removeLocalQueryTarget(e) {
        this.Hr.dr(e)
    }
    isLocalQueryTarget(e) {
        return this.Hr.activeTargetIds.has(e)
    }
    clearQueryState(e) {
        delete this.Jr[e]
    }
    getAllActiveQueryTargets() {
        return this.Hr.activeTargetIds
    }
    isActiveQueryTarget(e) {
        return this.Hr.activeTargetIds.has(e)
    }
    start() {
        return this.Hr = new Va,
        Promise.resolve()
    }
    handleUserChange(e, t, s) {}
    setOnlineState(e) {}
    shutdown() {}
    writeSequenceNumber(e) {}
    notifyBundleLoaded(e) {}
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class $y {
    Yr(e) {}
    shutdown() {}
}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class $a {
    constructor() {
        this.Xr = () => this.Zr(),
        this.eo = () => this.no(),
        this.so = [],
        this.io()
    }
    Yr(e) {
        this.so.push(e)
    }
    shutdown() {
        window.removeEventListener("online", this.Xr),
        window.removeEventListener("offline", this.eo)
    }
    io() {
        window.addEventListener("online", this.Xr),
        window.addEventListener("offline", this.eo)
    }
    Zr() {
        v("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
        for (const e of this.so)
            e(0)
    }
    no() {
        v("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
        for (const e of this.so)
            e(1)
    }
    static D() {
        return typeof window < "u" && window.addEventListener !== void 0 && window.removeEventListener !== void 0
    }
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let cs = null;
function Li() {
    return cs === null ? cs = 268435456 + Math.round(2147483648 * Math.random()) : cs++,
    "0x" + cs.toString(16)
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const By = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery",
    RunAggregationQuery: "runAggregationQuery"
};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jy {
    constructor(e) {
        this.ro = e.ro,
        this.oo = e.oo
    }
    uo(e) {
        this.co = e
    }
    ao(e) {
        this.ho = e
    }
    onMessage(e) {
        this.lo = e
    }
    close() {
        this.oo()
    }
    send(e) {
        this.ro(e)
    }
    fo() {
        this.co()
    }
    wo(e) {
        this.ho(e)
    }
    _o(e) {
        this.lo(e)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const J = "WebChannelConnection";
class qy extends class {
    constructor(e) {
        this.databaseInfo = e,
        this.databaseId = e.databaseId;
        const t = e.ssl ? "https" : "http";
        this.mo = t + "://" + e.host,
        this.yo = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents"
    }
    get po() {
        return !1
    }
    Io(e, t, s, i, r) {
        const o = Li()
          , a = this.To(e, t);
        v("RestConnection", `Sending RPC '${e}' ${o}:`, a, s);
        const c = {};
        return this.Eo(c, i, r),
        this.Ao(e, a, c, s).then(u => (v("RestConnection", `Received RPC '${e}' ${o}: `, u),
        u), u => {
            throw Lt("RestConnection", `RPC '${e}' ${o} failed with error: `, u, "url: ", a, "request:", s),
            u
        }
        )
    }
    vo(e, t, s, i, r, o) {
        return this.Io(e, t, s, i, r)
    }
    Eo(e, t, s) {
        e["X-Goog-Api-Client"] = "gl-js/ fire/" + Ht,
        e["Content-Type"] = "text/plain",
        this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId),
        t && t.headers.forEach( (i, r) => e[r] = i),
        s && s.headers.forEach( (i, r) => e[r] = i)
    }
    To(e, t) {
        const s = By[e];
        return `${this.mo}/v1/${t}:${s}`
    }
}
{
    constructor(e) {
        super(e),
        this.forceLongPolling = e.forceLongPolling,
        this.autoDetectLongPolling = e.autoDetectLongPolling,
        this.useFetchStreams = e.useFetchStreams,
        this.longPollingOptions = e.longPollingOptions
    }
    Ao(e, t, s, i) {
        const r = Li();
        return new Promise( (o, a) => {
            const c = new em;
            c.setWithCredentials(!0),
            c.listenOnce(Jg.COMPLETE, () => {
                try {
                    switch (c.getLastErrorCode()) {
                    case Pi.NO_ERROR:
                        const l = c.getResponseJson();
                        v(J, `XHR for RPC '${e}' ${r} received:`, JSON.stringify(l)),
                        o(l);
                        break;
                    case Pi.TIMEOUT:
                        v(J, `RPC '${e}' ${r} timed out`),
                        a(new y(d.DEADLINE_EXCEEDED,"Request time out"));
                        break;
                    case Pi.HTTP_ERROR:
                        const h = c.getStatus();
                        if (v(J, `RPC '${e}' ${r} failed with status:`, h, "response text:", c.getResponseText()),
                        h > 0) {
                            let f = c.getResponseJson();
                            Array.isArray(f) && (f = f[0]);
                            const g = f == null ? void 0 : f.error;
                            if (g && g.status && g.message) {
                                const E = function(C) {
                                    const _ = C.toLowerCase().replace(/_/g, "-");
                                    return Object.values(d).indexOf(_) >= 0 ? _ : d.UNKNOWN
                                }(g.status);
                                a(new y(E,g.message))
                            } else
                                a(new y(d.UNKNOWN,"Server responded with status " + c.getStatus()))
                        } else
                            a(new y(d.UNAVAILABLE,"Connection failed."));
                        break;
                    default:
                        I()
                    }
                } finally {
                    v(J, `RPC '${e}' ${r} completed.`)
                }
            }
            );
            const u = JSON.stringify(i);
            v(J, `RPC '${e}' ${r} sending request:`, i),
            c.send(t, "POST", u, s, 15)
        }
        )
    }
    Ro(e, t, s) {
        const i = Li()
          , r = [this.mo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"]
          , o = Qg()
          , a = Yg()
          , c = {
            httpSessionIdParam: "gsessionid",
            initMessageHeaders: {},
            messageUrlParams: {
                database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
            },
            sendRawJson: !0,
            supportsCrossDomainXhr: !0,
            internalChannelParams: {
                forwardChannelRequestTimeoutMs: 6e5
            },
            forceLongPolling: this.forceLongPolling,
            detectBufferingProxy: this.autoDetectLongPolling
        }
          , u = this.longPollingOptions.timeoutSeconds;
        u !== void 0 && (c.longPollingTimeout = Math.round(1e3 * u)),
        this.useFetchStreams && (c.xmlHttpFactory = new Zg({})),
        this.Eo(c.initMessageHeaders, t, s),
        c.encodeInitMessageHeaders = !0;
        const l = r.join("");
        v(J, `Creating RPC '${e}' stream ${i}: ${l}`, c);
        const h = o.createWebChannel(l, c);
        let f = !1
          , g = !1;
        const E = new jy({
            ro: _ => {
                g ? v(J, `Not sending because RPC '${e}' stream ${i} is closed:`, _) : (f || (v(J, `Opening RPC '${e}' stream ${i} transport.`),
                h.open(),
                f = !0),
                v(J, `RPC '${e}' stream ${i} sending:`, _),
                h.send(_))
            }
            ,
            oo: () => h.close()
        })
          , C = (_, U, V) => {
            _.listen(U, z => {
                try {
                    V(z)
                } catch (ue) {
                    setTimeout( () => {
                        throw ue
                    }
                    , 0)
                }
            }
            )
        }
        ;
        return C(h, is.EventType.OPEN, () => {
            g || v(J, `RPC '${e}' stream ${i} transport opened.`)
        }
        ),
        C(h, is.EventType.CLOSE, () => {
            g || (g = !0,
            v(J, `RPC '${e}' stream ${i} transport closed`),
            E.wo())
        }
        ),
        C(h, is.EventType.ERROR, _ => {
            g || (g = !0,
            Lt(J, `RPC '${e}' stream ${i} transport errored:`, _),
            E.wo(new y(d.UNAVAILABLE,"The operation could not be completed")))
        }
        ),
        C(h, is.EventType.MESSAGE, _ => {
            var U;
            if (!g) {
                const V = _.data[0];
                L(!!V);
                const z = V
                  , ue = z.error || ((U = z[0]) === null || U === void 0 ? void 0 : U.error);
                if (ue) {
                    v(J, `RPC '${e}' stream ${i} received error:`, ue);
                    const Je = ue.status;
                    let Xe = function(vi) {
                        const vt = $[vi];
                        if (vt !== void 0)
                            return Tl(vt)
                    }(Je)
                      , Qt = ue.message;
                    Xe === void 0 && (Xe = d.INTERNAL,
                    Qt = "Unknown error status: " + Je + " with message " + ue.message),
                    g = !0,
                    E.wo(new y(Xe,Qt)),
                    h.close()
                } else
                    v(J, `RPC '${e}' stream ${i} received:`, V),
                    E._o(V)
            }
        }
        ),
        C(a, Xg.STAT_EVENT, _ => {
            _.stat === ga.PROXY ? v(J, `RPC '${e}' stream ${i} detected buffering proxy`) : _.stat === ga.NOPROXY && v(J, `RPC '${e}' stream ${i} detected no buffering proxy`)
        }
        ),
        setTimeout( () => {
            E.fo()
        }
        , 0),
        E
    }
}
function xi() {
    return typeof document < "u" ? document : null
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function li(n) {
    return new ty(n,!0)
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ml {
    constructor(e, t, s=1e3, i=1.5, r=6e4) {
        this.ii = e,
        this.timerId = t,
        this.Po = s,
        this.bo = i,
        this.Vo = r,
        this.So = 0,
        this.Do = null,
        this.Co = Date.now(),
        this.reset()
    }
    reset() {
        this.So = 0
    }
    xo() {
        this.So = this.Vo
    }
    No(e) {
        this.cancel();
        const t = Math.floor(this.So + this.ko())
          , s = Math.max(0, Date.now() - this.Co)
          , i = Math.max(0, t - s);
        i > 0 && v("ExponentialBackoff", `Backing off for ${i} ms (base delay: ${this.So} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),
        this.Do = this.ii.enqueueAfterDelay(this.timerId, i, () => (this.Co = Date.now(),
        e())),
        this.So *= this.bo,
        this.So < this.Po && (this.So = this.Po),
        this.So > this.Vo && (this.So = this.Vo)
    }
    Mo() {
        this.Do !== null && (this.Do.skipDelay(),
        this.Do = null)
    }
    cancel() {
        this.Do !== null && (this.Do.cancel(),
        this.Do = null)
    }
    ko() {
        return (Math.random() - .5) * this.So
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ll {
    constructor(e, t, s, i, r, o, a, c) {
        this.ii = e,
        this.$o = s,
        this.Oo = i,
        this.connection = r,
        this.authCredentialsProvider = o,
        this.appCheckCredentialsProvider = a,
        this.listener = c,
        this.state = 0,
        this.Fo = 0,
        this.Bo = null,
        this.Lo = null,
        this.stream = null,
        this.qo = new Ml(e,t)
    }
    Uo() {
        return this.state === 1 || this.state === 5 || this.Ko()
    }
    Ko() {
        return this.state === 2 || this.state === 3
    }
    start() {
        this.state !== 4 ? this.auth() : this.Go()
    }
    async stop() {
        this.Uo() && await this.close(0)
    }
    Qo() {
        this.state = 0,
        this.qo.reset()
    }
    jo() {
        this.Ko() && this.Bo === null && (this.Bo = this.ii.enqueueAfterDelay(this.$o, 6e4, () => this.zo()))
    }
    Wo(e) {
        this.Ho(),
        this.stream.send(e)
    }
    async zo() {
        if (this.Ko())
            return this.close(0)
    }
    Ho() {
        this.Bo && (this.Bo.cancel(),
        this.Bo = null)
    }
    Jo() {
        this.Lo && (this.Lo.cancel(),
        this.Lo = null)
    }
    async close(e, t) {
        this.Ho(),
        this.Jo(),
        this.qo.cancel(),
        this.Fo++,
        e !== 4 ? this.qo.reset() : t && t.code === d.RESOURCE_EXHAUSTED ? (Re(t.toString()),
        Re("Using maximum backoff delay to prevent overloading the backend."),
        this.qo.xo()) : t && t.code === d.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(),
        this.appCheckCredentialsProvider.invalidateToken()),
        this.stream !== null && (this.Yo(),
        this.stream.close(),
        this.stream = null),
        this.state = e,
        await this.listener.ao(t)
    }
    Yo() {}
    auth() {
        this.state = 1;
        const e = this.Xo(this.Fo)
          , t = this.Fo;
        Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then( ([s,i]) => {
            this.Fo === t && this.Zo(s, i)
        }
        , s => {
            e( () => {
                const i = new y(d.UNKNOWN,"Fetching auth token failed: " + s.message);
                return this.tu(i)
            }
            )
        }
        )
    }
    Zo(e, t) {
        const s = this.Xo(this.Fo);
        this.stream = this.eu(e, t),
        this.stream.uo( () => {
            s( () => (this.state = 2,
            this.Lo = this.ii.enqueueAfterDelay(this.Oo, 1e4, () => (this.Ko() && (this.state = 3),
            Promise.resolve())),
            this.listener.uo()))
        }
        ),
        this.stream.ao(i => {
            s( () => this.tu(i))
        }
        ),
        this.stream.onMessage(i => {
            s( () => this.onMessage(i))
        }
        )
    }
    Go() {
        this.state = 5,
        this.qo.No(async () => {
            this.state = 0,
            this.start()
        }
        )
    }
    tu(e) {
        return v("PersistentStream", `close with error: ${e}`),
        this.stream = null,
        this.close(4, e)
    }
    Xo(e) {
        return t => {
            this.ii.enqueueAndForget( () => this.Fo === e ? t() : (v("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."),
            Promise.resolve()))
        }
    }
}
class zy extends Ll {
    constructor(e, t, s, i, r, o) {
        super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, s, i, o),
        this.serializer = r
    }
    eu(e, t) {
        return this.connection.Ro("Listen", e, t)
    }
    onMessage(e) {
        this.qo.reset();
        const t = iy(this.serializer, e)
          , s = function(i) {
            if (!("targetChange"in i))
                return S.min();
            const r = i.targetChange;
            return r.targetIds && r.targetIds.length ? S.min() : r.readTime ? Ie(r.readTime) : S.min()
        }(e);
        return this.listener.nu(t, s)
    }
    su(e) {
        const t = {};
        t.database = fr(this.serializer),
        t.addTarget = function(i, r) {
            let o;
            const a = r.target;
            if (o = or(a) ? {
                documents: ay(i, a)
            } : {
                query: cy(i, a)
            },
            o.targetId = r.targetId,
            r.resumeToken.approximateByteSize() > 0) {
                o.resumeToken = Cl(i, r.resumeToken);
                const c = lr(i, r.expectedCount);
                c !== null && (o.expectedCount = c)
            } else if (r.snapshotVersion.compareTo(S.min()) > 0) {
                o.readTime = Ms(i, r.snapshotVersion.toTimestamp());
                const c = lr(i, r.expectedCount);
                c !== null && (o.expectedCount = c)
            }
            return o
        }(this.serializer, e);
        const s = ly(this.serializer, e);
        s && (t.labels = s),
        this.Wo(t)
    }
    iu(e) {
        const t = {};
        t.database = fr(this.serializer),
        t.removeTarget = e,
        this.Wo(t)
    }
}
class Hy extends Ll {
    constructor(e, t, s, i, r, o) {
        super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, s, i, o),
        this.serializer = r,
        this.ru = !1
    }
    get ou() {
        return this.ru
    }
    start() {
        this.ru = !1,
        this.lastStreamToken = void 0,
        super.start()
    }
    Yo() {
        this.ru && this.uu([])
    }
    eu(e, t) {
        return this.connection.Ro("Write", e, t)
    }
    onMessage(e) {
        if (L(!!e.streamToken),
        this.lastStreamToken = e.streamToken,
        this.ru) {
            this.qo.reset();
            const t = oy(e.writeResults, e.commitTime)
              , s = Ie(e.commitTime);
            return this.listener.cu(s, t)
        }
        return L(!e.writeResults || e.writeResults.length === 0),
        this.ru = !0,
        this.listener.au()
    }
    hu() {
        const e = {};
        e.database = fr(this.serializer),
        this.Wo(e)
    }
    uu(e) {
        const t = {
            streamToken: this.lastStreamToken,
            writes: e.map(s => ry(this.serializer, s))
        };
        this.Wo(t)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ky extends class {
}
{
    constructor(e, t, s, i) {
        super(),
        this.authCredentials = e,
        this.appCheckCredentials = t,
        this.connection = s,
        this.serializer = i,
        this.lu = !1
    }
    fu() {
        if (this.lu)
            throw new y(d.FAILED_PRECONDITION,"The client has already been terminated.")
    }
    Io(e, t, s) {
        return this.fu(),
        Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then( ([i,r]) => this.connection.Io(e, t, s, i, r)).catch(i => {
            throw i.name === "FirebaseError" ? (i.code === d.UNAUTHENTICATED && (this.authCredentials.invalidateToken(),
            this.appCheckCredentials.invalidateToken()),
            i) : new y(d.UNKNOWN,i.toString())
        }
        )
    }
    vo(e, t, s, i) {
        return this.fu(),
        Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then( ([r,o]) => this.connection.vo(e, t, s, r, o, i)).catch(r => {
            throw r.name === "FirebaseError" ? (r.code === d.UNAUTHENTICATED && (this.authCredentials.invalidateToken(),
            this.appCheckCredentials.invalidateToken()),
            r) : new y(d.UNKNOWN,r.toString())
        }
        )
    }
    terminate() {
        this.lu = !0
    }
}
class Gy {
    constructor(e, t) {
        this.asyncQueue = e,
        this.onlineStateHandler = t,
        this.state = "Unknown",
        this.wu = 0,
        this._u = null,
        this.mu = !0
    }
    gu() {
        this.wu === 0 && (this.yu("Unknown"),
        this._u = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this._u = null,
        this.pu("Backend didn't respond within 10 seconds."),
        this.yu("Offline"),
        Promise.resolve())))
    }
    Iu(e) {
        this.state === "Online" ? this.yu("Unknown") : (this.wu++,
        this.wu >= 1 && (this.Tu(),
        this.pu(`Connection failed 1 times. Most recent error: ${e.toString()}`),
        this.yu("Offline")))
    }
    set(e) {
        this.Tu(),
        this.wu = 0,
        e === "Online" && (this.mu = !1),
        this.yu(e)
    }
    yu(e) {
        e !== this.state && (this.state = e,
        this.onlineStateHandler(e))
    }
    pu(e) {
        const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
        this.mu ? (Re(t),
        this.mu = !1) : v("OnlineStateTracker", t)
    }
    Tu() {
        this._u !== null && (this._u.cancel(),
        this._u = null)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Wy {
    constructor(e, t, s, i, r) {
        this.localStore = e,
        this.datastore = t,
        this.asyncQueue = s,
        this.remoteSyncer = {},
        this.Eu = [],
        this.Au = new Map,
        this.vu = new Set,
        this.Ru = [],
        this.Pu = r,
        this.Pu.Yr(o => {
            s.enqueueAndForget(async () => {
                yt(this) && (v("RemoteStore", "Restarting streams for network reachability change."),
                await async function(a) {
                    const c = b(a);
                    c.vu.add(4),
                    await Wn(c),
                    c.bu.set("Unknown"),
                    c.vu.delete(4),
                    await hi(c)
                }(this))
            }
            )
        }
        ),
        this.bu = new Gy(s,i)
    }
}
async function hi(n) {
    if (yt(n))
        for (const e of n.Ru)
            await e(!0)
}
async function Wn(n) {
    for (const e of n.Ru)
        await e(!1)
}
function xl(n, e) {
    const t = b(n);
    t.Au.has(e.targetId) || (t.Au.set(e.targetId, e),
    go(t) ? po(t) : Gt(t).Ko() && fo(t, e))
}
function Fl(n, e) {
    const t = b(n)
      , s = Gt(t);
    t.Au.delete(e),
    s.Ko() && Ul(t, e),
    t.Au.size === 0 && (s.Ko() ? s.jo() : yt(t) && t.bu.set("Unknown"))
}
function fo(n, e) {
    if (n.Vu.qt(e.targetId),
    e.resumeToken.approximateByteSize() > 0 || e.snapshotVersion.compareTo(S.min()) > 0) {
        const t = n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;
        e = e.withExpectedCount(t)
    }
    Gt(n).su(e)
}
function Ul(n, e) {
    n.Vu.qt(e),
    Gt(n).iu(e)
}
function po(n) {
    n.Vu = new Jm({
        getRemoteKeysForTarget: e => n.remoteSyncer.getRemoteKeysForTarget(e),
        le: e => n.Au.get(e) || null,
        ue: () => n.datastore.serializer.databaseId
    }),
    Gt(n).start(),
    n.bu.gu()
}
function go(n) {
    return yt(n) && !Gt(n).Uo() && n.Au.size > 0
}
function yt(n) {
    return b(n).vu.size === 0
}
function Vl(n) {
    n.Vu = void 0
}
async function Qy(n) {
    n.Au.forEach( (e, t) => {
        fo(n, e)
    }
    )
}
async function Yy(n, e) {
    Vl(n),
    go(n) ? (n.bu.Iu(e),
    po(n)) : n.bu.set("Unknown")
}
async function Jy(n, e, t) {
    if (n.bu.set("Online"),
    e instanceof Al && e.state === 2 && e.cause)
        try {
            await async function(s, i) {
                const r = i.cause;
                for (const o of i.targetIds)
                    s.Au.has(o) && (await s.remoteSyncer.rejectListen(o, r),
                    s.Au.delete(o),
                    s.Vu.removeTarget(o))
            }(n, e)
        } catch (s) {
            v("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), s),
            await Ls(n, s)
        }
    else if (e instanceof gs ? n.Vu.Ht(e) : e instanceof Sl ? n.Vu.ne(e) : n.Vu.Xt(e),
    !t.isEqual(S.min()))
        try {
            const s = await Pl(n.localStore);
            t.compareTo(s) >= 0 && await function(i, r) {
                const o = i.Vu.ce(r);
                return o.targetChanges.forEach( (a, c) => {
                    if (a.resumeToken.approximateByteSize() > 0) {
                        const u = i.Au.get(c);
                        u && i.Au.set(c, u.withResumeToken(a.resumeToken, r))
                    }
                }
                ),
                o.targetMismatches.forEach( (a, c) => {
                    const u = i.Au.get(a);
                    if (!u)
                        return;
                    i.Au.set(a, u.withResumeToken(re.EMPTY_BYTE_STRING, u.snapshotVersion)),
                    Ul(i, a);
                    const l = new $e(u.target,a,c,u.sequenceNumber);
                    fo(i, l)
                }
                ),
                i.remoteSyncer.applyRemoteEvent(o)
            }(n, t)
        } catch (s) {
            v("RemoteStore", "Failed to raise snapshot:", s),
            await Ls(n, s)
        }
}
async function Ls(n, e, t) {
    if (!Hn(e))
        throw e;
    n.vu.add(1),
    await Wn(n),
    n.bu.set("Offline"),
    t || (t = () => Pl(n.localStore)),
    n.asyncQueue.enqueueRetryable(async () => {
        v("RemoteStore", "Retrying IndexedDB access"),
        await t(),
        n.vu.delete(1),
        await hi(n)
    }
    )
}
function $l(n, e) {
    return e().catch(t => Ls(n, t, e))
}
async function di(n) {
    const e = b(n)
      , t = We(e);
    let s = e.Eu.length > 0 ? e.Eu[e.Eu.length - 1].batchId : -1;
    for (; Xy(e); )
        try {
            const i = await xy(e.localStore, s);
            if (i === null) {
                e.Eu.length === 0 && t.jo();
                break
            }
            s = i.batchId,
            Zy(e, i)
        } catch (i) {
            await Ls(e, i)
        }
    Bl(e) && jl(e)
}
function Xy(n) {
    return yt(n) && n.Eu.length < 10
}
function Zy(n, e) {
    n.Eu.push(e);
    const t = We(n);
    t.Ko() && t.ou && t.uu(e.mutations)
}
function Bl(n) {
    return yt(n) && !We(n).Uo() && n.Eu.length > 0
}
function jl(n) {
    We(n).start()
}
async function ev(n) {
    We(n).hu()
}
async function tv(n) {
    const e = We(n);
    for (const t of n.Eu)
        e.uu(t.mutations)
}
async function nv(n, e, t) {
    const s = n.Eu.shift()
      , i = ro.from(s, e, t);
    await $l(n, () => n.remoteSyncer.applySuccessfulWrite(i)),
    await di(n)
}
async function sv(n, e) {
    e && We(n).ou && await async function(t, s) {
        if (i = s.code,
        Wm(i) && i !== d.ABORTED) {
            const r = t.Eu.shift();
            We(t).Qo(),
            await $l(t, () => t.remoteSyncer.rejectFailedWrite(r.batchId, s)),
            await di(t)
        }
        var i
    }(n, e),
    Bl(n) && jl(n)
}
async function Ba(n, e) {
    const t = b(n);
    t.asyncQueue.verifyOperationInProgress(),
    v("RemoteStore", "RemoteStore received new credentials");
    const s = yt(t);
    t.vu.add(3),
    await Wn(t),
    s && t.bu.set("Unknown"),
    await t.remoteSyncer.handleCredentialChange(e),
    t.vu.delete(3),
    await hi(t)
}
async function iv(n, e) {
    const t = b(n);
    e ? (t.vu.delete(2),
    await hi(t)) : e || (t.vu.add(2),
    await Wn(t),
    t.bu.set("Unknown"))
}
function Gt(n) {
    return n.Su || (n.Su = function(e, t, s) {
        const i = b(e);
        return i.fu(),
        new zy(t,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)
    }(n.datastore, n.asyncQueue, {
        uo: Qy.bind(null, n),
        ao: Yy.bind(null, n),
        nu: Jy.bind(null, n)
    }),
    n.Ru.push(async e => {
        e ? (n.Su.Qo(),
        go(n) ? po(n) : n.bu.set("Unknown")) : (await n.Su.stop(),
        Vl(n))
    }
    )),
    n.Su
}
function We(n) {
    return n.Du || (n.Du = function(e, t, s) {
        const i = b(e);
        return i.fu(),
        new Hy(t,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)
    }(n.datastore, n.asyncQueue, {
        uo: ev.bind(null, n),
        ao: sv.bind(null, n),
        au: tv.bind(null, n),
        cu: nv.bind(null, n)
    }),
    n.Ru.push(async e => {
        e ? (n.Du.Qo(),
        await di(n)) : (await n.Du.stop(),
        n.Eu.length > 0 && (v("RemoteStore", `Stopping write stream with ${n.Eu.length} pending writes`),
        n.Eu = []))
    }
    )),
    n.Du
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class mo {
    constructor(e, t, s, i, r) {
        this.asyncQueue = e,
        this.timerId = t,
        this.targetTimeMs = s,
        this.op = i,
        this.removalCallback = r,
        this.deferred = new Ce,
        this.then = this.deferred.promise.then.bind(this.deferred.promise),
        this.deferred.promise.catch(o => {}
        )
    }
    static createAndSchedule(e, t, s, i, r) {
        const o = Date.now() + s
          , a = new mo(e,t,o,i,r);
        return a.start(s),
        a
    }
    start(e) {
        this.timerHandle = setTimeout( () => this.handleDelayElapsed(), e)
    }
    skipDelay() {
        return this.handleDelayElapsed()
    }
    cancel(e) {
        this.timerHandle !== null && (this.clearTimeout(),
        this.deferred.reject(new y(d.CANCELLED,"Operation cancelled" + (e ? ": " + e : ""))))
    }
    handleDelayElapsed() {
        this.asyncQueue.enqueueAndForget( () => this.timerHandle !== null ? (this.clearTimeout(),
        this.op().then(e => this.deferred.resolve(e))) : Promise.resolve())
    }
    clearTimeout() {
        this.timerHandle !== null && (this.removalCallback(this),
        clearTimeout(this.timerHandle),
        this.timerHandle = null)
    }
}
function yo(n, e) {
    if (Re("AsyncQueue", `${e}: ${n}`),
    Hn(n))
        return new y(d.UNAVAILABLE,`${e}: ${n}`);
    throw n
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Nt {
    constructor(e) {
        this.comparator = e ? (t, s) => e(t, s) || w.comparator(t.key, s.key) : (t, s) => w.comparator(t.key, s.key),
        this.keyedMap = en(),
        this.sortedSet = new x(this.comparator)
    }
    static emptySet(e) {
        return new Nt(e.comparator)
    }
    has(e) {
        return this.keyedMap.get(e) != null
    }
    get(e) {
        return this.keyedMap.get(e)
    }
    first() {
        return this.sortedSet.minKey()
    }
    last() {
        return this.sortedSet.maxKey()
    }
    isEmpty() {
        return this.sortedSet.isEmpty()
    }
    indexOf(e) {
        const t = this.keyedMap.get(e);
        return t ? this.sortedSet.indexOf(t) : -1
    }
    get size() {
        return this.sortedSet.size
    }
    forEach(e) {
        this.sortedSet.inorderTraversal( (t, s) => (e(t),
        !1))
    }
    add(e) {
        const t = this.delete(e.key);
        return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null))
    }
    delete(e) {
        const t = this.get(e);
        return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this
    }
    isEqual(e) {
        if (!(e instanceof Nt) || this.size !== e.size)
            return !1;
        const t = this.sortedSet.getIterator()
          , s = e.sortedSet.getIterator();
        for (; t.hasNext(); ) {
            const i = t.getNext().key
              , r = s.getNext().key;
            if (!i.isEqual(r))
                return !1
        }
        return !0
    }
    toString() {
        const e = [];
        return this.forEach(t => {
            e.push(t.toString())
        }
        ),
        e.length === 0 ? "DocumentSet ()" : `DocumentSet (
  ` + e.join(`  
`) + `
)`
    }
    copy(e, t) {
        const s = new Nt;
        return s.comparator = this.comparator,
        s.keyedMap = e,
        s.sortedSet = t,
        s
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ja {
    constructor() {
        this.Cu = new x(w.comparator)
    }
    track(e) {
        const t = e.doc.key
          , s = this.Cu.get(t);
        s ? e.type !== 0 && s.type === 3 ? this.Cu = this.Cu.insert(t, e) : e.type === 3 && s.type !== 1 ? this.Cu = this.Cu.insert(t, {
            type: s.type,
            doc: e.doc
        }) : e.type === 2 && s.type === 2 ? this.Cu = this.Cu.insert(t, {
            type: 2,
            doc: e.doc
        }) : e.type === 2 && s.type === 0 ? this.Cu = this.Cu.insert(t, {
            type: 0,
            doc: e.doc
        }) : e.type === 1 && s.type === 0 ? this.Cu = this.Cu.remove(t) : e.type === 1 && s.type === 2 ? this.Cu = this.Cu.insert(t, {
            type: 1,
            doc: s.doc
        }) : e.type === 0 && s.type === 1 ? this.Cu = this.Cu.insert(t, {
            type: 2,
            doc: e.doc
        }) : I() : this.Cu = this.Cu.insert(t, e)
    }
    xu() {
        const e = [];
        return this.Cu.inorderTraversal( (t, s) => {
            e.push(s)
        }
        ),
        e
    }
}
class $t {
    constructor(e, t, s, i, r, o, a, c, u) {
        this.query = e,
        this.docs = t,
        this.oldDocs = s,
        this.docChanges = i,
        this.mutatedKeys = r,
        this.fromCache = o,
        this.syncStateChanged = a,
        this.excludesMetadataChanges = c,
        this.hasCachedResults = u
    }
    static fromInitialDocuments(e, t, s, i, r) {
        const o = [];
        return t.forEach(a => {
            o.push({
                type: 0,
                doc: a
            })
        }
        ),
        new $t(e,t,Nt.emptySet(t),o,s,i,!0,!1,r)
    }
    get hasPendingWrites() {
        return !this.mutatedKeys.isEmpty()
    }
    isEqual(e) {
        if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && ii(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs)))
            return !1;
        const t = this.docChanges
          , s = e.docChanges;
        if (t.length !== s.length)
            return !1;
        for (let i = 0; i < t.length; i++)
            if (t[i].type !== s[i].type || !t[i].doc.isEqual(s[i].doc))
                return !1;
        return !0
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class rv {
    constructor() {
        this.Nu = void 0,
        this.listeners = []
    }
}
class ov {
    constructor() {
        this.queries = new Kt(e => al(e),ii),
        this.onlineState = "Unknown",
        this.ku = new Set
    }
}
async function ql(n, e) {
    const t = b(n)
      , s = e.query;
    let i = !1
      , r = t.queries.get(s);
    if (r || (i = !0,
    r = new rv),
    i)
        try {
            r.Nu = await t.onListen(s)
        } catch (o) {
            const a = yo(o, `Initialization of query '${ur(e.query)}' failed`);
            return void e.onError(a)
        }
    t.queries.set(s, r),
    r.listeners.push(e),
    e.Mu(t.onlineState),
    r.Nu && e.$u(r.Nu) && vo(t)
}
async function zl(n, e) {
    const t = b(n)
      , s = e.query;
    let i = !1;
    const r = t.queries.get(s);
    if (r) {
        const o = r.listeners.indexOf(e);
        o >= 0 && (r.listeners.splice(o, 1),
        i = r.listeners.length === 0)
    }
    if (i)
        return t.queries.delete(s),
        t.onUnlisten(s)
}
function av(n, e) {
    const t = b(n);
    let s = !1;
    for (const i of e) {
        const r = i.query
          , o = t.queries.get(r);
        if (o) {
            for (const a of o.listeners)
                a.$u(i) && (s = !0);
            o.Nu = i
        }
    }
    s && vo(t)
}
function cv(n, e, t) {
    const s = b(n)
      , i = s.queries.get(e);
    if (i)
        for (const r of i.listeners)
            r.onError(t);
    s.queries.delete(e)
}
function vo(n) {
    n.ku.forEach(e => {
        e.next()
    }
    )
}
class Hl {
    constructor(e, t, s) {
        this.query = e,
        this.Ou = t,
        this.Fu = !1,
        this.Bu = null,
        this.onlineState = "Unknown",
        this.options = s || {}
    }
    $u(e) {
        if (!this.options.includeMetadataChanges) {
            const s = [];
            for (const i of e.docChanges)
                i.type !== 3 && s.push(i);
            e = new $t(e.query,e.docs,e.oldDocs,s,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)
        }
        let t = !1;
        return this.Fu ? this.Lu(e) && (this.Ou.next(e),
        t = !0) : this.qu(e, this.onlineState) && (this.Uu(e),
        t = !0),
        this.Bu = e,
        t
    }
    onError(e) {
        this.Ou.error(e)
    }
    Mu(e) {
        this.onlineState = e;
        let t = !1;
        return this.Bu && !this.Fu && this.qu(this.Bu, e) && (this.Uu(this.Bu),
        t = !0),
        t
    }
    qu(e, t) {
        if (!e.fromCache)
            return !0;
        const s = t !== "Offline";
        return (!this.options.Ku || !s) && (!e.docs.isEmpty() || e.hasCachedResults || t === "Offline")
    }
    Lu(e) {
        if (e.docChanges.length > 0)
            return !0;
        const t = this.Bu && this.Bu.hasPendingWrites !== e.hasPendingWrites;
        return !(!e.syncStateChanged && !t) && this.options.includeMetadataChanges === !0
    }
    Uu(e) {
        e = $t.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults),
        this.Fu = !0,
        this.Ou.next(e)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Kl {
    constructor(e) {
        this.key = e
    }
}
class Gl {
    constructor(e) {
        this.key = e
    }
}
class uv {
    constructor(e, t) {
        this.query = e,
        this.Yu = t,
        this.Xu = null,
        this.hasCachedResults = !1,
        this.current = !1,
        this.Zu = k(),
        this.mutatedKeys = k(),
        this.tc = cl(e),
        this.ec = new Nt(this.tc)
    }
    get nc() {
        return this.Yu
    }
    sc(e, t) {
        const s = t ? t.ic : new ja
          , i = t ? t.ec : this.ec;
        let r = t ? t.mutatedKeys : this.mutatedKeys
          , o = i
          , a = !1;
        const c = this.query.limitType === "F" && i.size === this.query.limit ? i.last() : null
          , u = this.query.limitType === "L" && i.size === this.query.limit ? i.first() : null;
        if (e.inorderTraversal( (l, h) => {
            const f = i.get(l)
              , g = ri(this.query, h) ? h : null
              , E = !!f && this.mutatedKeys.has(f.key)
              , C = !!g && (g.hasLocalMutations || this.mutatedKeys.has(g.key) && g.hasCommittedMutations);
            let _ = !1;
            f && g ? f.data.isEqual(g.data) ? E !== C && (s.track({
                type: 3,
                doc: g
            }),
            _ = !0) : this.rc(f, g) || (s.track({
                type: 2,
                doc: g
            }),
            _ = !0,
            (c && this.tc(g, c) > 0 || u && this.tc(g, u) < 0) && (a = !0)) : !f && g ? (s.track({
                type: 0,
                doc: g
            }),
            _ = !0) : f && !g && (s.track({
                type: 1,
                doc: f
            }),
            _ = !0,
            (c || u) && (a = !0)),
            _ && (g ? (o = o.add(g),
            r = C ? r.add(l) : r.delete(l)) : (o = o.delete(l),
            r = r.delete(l)))
        }
        ),
        this.query.limit !== null)
            for (; o.size > this.query.limit; ) {
                const l = this.query.limitType === "F" ? o.last() : o.first();
                o = o.delete(l.key),
                r = r.delete(l.key),
                s.track({
                    type: 1,
                    doc: l
                })
            }
        return {
            ec: o,
            ic: s,
            zi: a,
            mutatedKeys: r
        }
    }
    rc(e, t) {
        return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations
    }
    applyChanges(e, t, s) {
        const i = this.ec;
        this.ec = e.ec,
        this.mutatedKeys = e.mutatedKeys;
        const r = e.ic.xu();
        r.sort( (u, l) => function(h, f) {
            const g = E => {
                switch (E) {
                case 0:
                    return 1;
                case 2:
                case 3:
                    return 2;
                case 1:
                    return 0;
                default:
                    return I()
                }
            }
            ;
            return g(h) - g(f)
        }(u.type, l.type) || this.tc(u.doc, l.doc)),
        this.oc(s);
        const o = t ? this.uc() : []
          , a = this.Zu.size === 0 && this.current ? 1 : 0
          , c = a !== this.Xu;
        return this.Xu = a,
        r.length !== 0 || c ? {
            snapshot: new $t(this.query,e.ec,i,r,e.mutatedKeys,a === 0,c,!1,!!s && s.resumeToken.approximateByteSize() > 0),
            cc: o
        } : {
            cc: o
        }
    }
    Mu(e) {
        return this.current && e === "Offline" ? (this.current = !1,
        this.applyChanges({
            ec: this.ec,
            ic: new ja,
            mutatedKeys: this.mutatedKeys,
            zi: !1
        }, !1)) : {
            cc: []
        }
    }
    ac(e) {
        return !this.Yu.has(e) && !!this.ec.has(e) && !this.ec.get(e).hasLocalMutations
    }
    oc(e) {
        e && (e.addedDocuments.forEach(t => this.Yu = this.Yu.add(t)),
        e.modifiedDocuments.forEach(t => {}
        ),
        e.removedDocuments.forEach(t => this.Yu = this.Yu.delete(t)),
        this.current = e.current)
    }
    uc() {
        if (!this.current)
            return [];
        const e = this.Zu;
        this.Zu = k(),
        this.ec.forEach(s => {
            this.ac(s.key) && (this.Zu = this.Zu.add(s.key))
        }
        );
        const t = [];
        return e.forEach(s => {
            this.Zu.has(s) || t.push(new Gl(s))
        }
        ),
        this.Zu.forEach(s => {
            e.has(s) || t.push(new Kl(s))
        }
        ),
        t
    }
    hc(e) {
        this.Yu = e.ir,
        this.Zu = k();
        const t = this.sc(e.documents);
        return this.applyChanges(t, !0)
    }
    lc() {
        return $t.fromInitialDocuments(this.query, this.ec, this.mutatedKeys, this.Xu === 0, this.hasCachedResults)
    }
}
class lv {
    constructor(e, t, s) {
        this.query = e,
        this.targetId = t,
        this.view = s
    }
}
class hv {
    constructor(e) {
        this.key = e,
        this.fc = !1
    }
}
class dv {
    constructor(e, t, s, i, r, o) {
        this.localStore = e,
        this.remoteStore = t,
        this.eventManager = s,
        this.sharedClientState = i,
        this.currentUser = r,
        this.maxConcurrentLimboResolutions = o,
        this.dc = {},
        this.wc = new Kt(a => al(a),ii),
        this._c = new Map,
        this.mc = new Set,
        this.gc = new x(w.comparator),
        this.yc = new Map,
        this.Ic = new uo,
        this.Tc = {},
        this.Ec = new Map,
        this.Ac = Vt.Mn(),
        this.onlineState = "Unknown",
        this.vc = void 0
    }
    get isPrimaryClient() {
        return this.vc === !0
    }
}
async function fv(n, e) {
    const t = Tv(n);
    let s, i;
    const r = t.wc.get(e);
    if (r)
        s = r.targetId,
        t.sharedClientState.addLocalQueryTarget(s),
        i = r.view.lc();
    else {
        const o = await Fy(t.localStore, Oe(e))
          , a = t.sharedClientState.addLocalQueryTarget(o.targetId);
        s = o.targetId,
        i = await pv(t, e, s, a === "current", o.resumeToken),
        t.isPrimaryClient && xl(t.remoteStore, o)
    }
    return i
}
async function pv(n, e, t, s, i) {
    n.Rc = (h, f, g) => async function(E, C, _, U) {
        let V = C.view.sc(_);
        V.zi && (V = await Ua(E.localStore, C.query, !1).then( ({documents: Je}) => C.view.sc(Je, V)));
        const z = U && U.targetChanges.get(C.targetId)
          , ue = C.view.applyChanges(V, E.isPrimaryClient, z);
        return za(E, C.targetId, ue.cc),
        ue.snapshot
    }(n, h, f, g);
    const r = await Ua(n.localStore, e, !0)
      , o = new uv(e,r.ir)
      , a = o.sc(r.documents)
      , c = Gn.createSynthesizedTargetChangeForCurrentChange(t, s && n.onlineState !== "Offline", i)
      , u = o.applyChanges(a, n.isPrimaryClient, c);
    za(n, t, u.cc);
    const l = new lv(e,t,o);
    return n.wc.set(e, l),
    n._c.has(t) ? n._c.get(t).push(e) : n._c.set(t, [e]),
    u.snapshot
}
async function gv(n, e) {
    const t = b(n)
      , s = t.wc.get(e)
      , i = t._c.get(s.targetId);
    if (i.length > 1)
        return t._c.set(s.targetId, i.filter(r => !ii(r, e))),
        void t.wc.delete(e);
    t.isPrimaryClient ? (t.sharedClientState.removeLocalQueryTarget(s.targetId),
    t.sharedClientState.isActiveQueryTarget(s.targetId) || await pr(t.localStore, s.targetId, !1).then( () => {
        t.sharedClientState.clearQueryState(s.targetId),
        Fl(t.remoteStore, s.targetId),
        gr(t, s.targetId)
    }
    ).catch(zn)) : (gr(t, s.targetId),
    await pr(t.localStore, s.targetId, !0))
}
async function mv(n, e, t) {
    const s = Sv(n);
    try {
        const i = await function(r, o) {
            const a = b(r)
              , c = q.now()
              , u = o.reduce( (f, g) => f.add(g.key), k());
            let l, h;
            return a.persistence.runTransaction("Locally write mutations", "readwrite", f => {
                let g = Pe()
                  , E = k();
                return a.Zi.getEntries(f, u).next(C => {
                    g = C,
                    g.forEach( (_, U) => {
                        U.isValidDocument() || (E = E.add(_))
                    }
                    )
                }
                ).next( () => a.localDocuments.getOverlayedDocuments(f, g)).next(C => {
                    l = C;
                    const _ = [];
                    for (const U of o) {
                        const V = qm(U, l.get(U.key).overlayedDocument);
                        V != null && _.push(new mt(U.key,V,Xu(V.value.mapValue),be.exists(!0)))
                    }
                    return a.mutationQueue.addMutationBatch(f, c, _, o)
                }
                ).next(C => {
                    h = C;
                    const _ = C.applyToLocalDocumentSet(l, E);
                    return a.documentOverlayCache.saveOverlays(f, C.batchId, _)
                }
                )
            }
            ).then( () => ({
                batchId: h.batchId,
                changes: ll(l)
            }))
        }(s.localStore, e);
        s.sharedClientState.addPendingMutation(i.batchId),
        function(r, o, a) {
            let c = r.Tc[r.currentUser.toKey()];
            c || (c = new x(R)),
            c = c.insert(o, a),
            r.Tc[r.currentUser.toKey()] = c
        }(s, i.batchId, t),
        await Qn(s, i.changes),
        await di(s.remoteStore)
    } catch (i) {
        const r = yo(i, "Failed to persist write");
        t.reject(r)
    }
}
async function Wl(n, e) {
    const t = b(n);
    try {
        const s = await My(t.localStore, e);
        e.targetChanges.forEach( (i, r) => {
            const o = t.yc.get(r);
            o && (L(i.addedDocuments.size + i.modifiedDocuments.size + i.removedDocuments.size <= 1),
            i.addedDocuments.size > 0 ? o.fc = !0 : i.modifiedDocuments.size > 0 ? L(o.fc) : i.removedDocuments.size > 0 && (L(o.fc),
            o.fc = !1))
        }
        ),
        await Qn(t, s, e)
    } catch (s) {
        await zn(s)
    }
}
function qa(n, e, t) {
    const s = b(n);
    if (s.isPrimaryClient && t === 0 || !s.isPrimaryClient && t === 1) {
        const i = [];
        s.wc.forEach( (r, o) => {
            const a = o.view.Mu(e);
            a.snapshot && i.push(a.snapshot)
        }
        ),
        function(r, o) {
            const a = b(r);
            a.onlineState = o;
            let c = !1;
            a.queries.forEach( (u, l) => {
                for (const h of l.listeners)
                    h.Mu(o) && (c = !0)
            }
            ),
            c && vo(a)
        }(s.eventManager, e),
        i.length && s.dc.nu(i),
        s.onlineState = e,
        s.isPrimaryClient && s.sharedClientState.setOnlineState(e)
    }
}
async function yv(n, e, t) {
    const s = b(n);
    s.sharedClientState.updateQueryState(e, "rejected", t);
    const i = s.yc.get(e)
      , r = i && i.key;
    if (r) {
        let o = new x(w.comparator);
        o = o.insert(r, Z.newNoDocument(r, S.min()));
        const a = k().add(r)
          , c = new ui(S.min(),new Map,new x(R),o,a);
        await Wl(s, c),
        s.gc = s.gc.remove(r),
        s.yc.delete(e),
        wo(s)
    } else
        await pr(s.localStore, e, !1).then( () => gr(s, e, t)).catch(zn)
}
async function vv(n, e) {
    const t = b(n)
      , s = e.batch.batchId;
    try {
        const i = await Py(t.localStore, e);
        Yl(t, s, null),
        Ql(t, s),
        t.sharedClientState.updateMutationState(s, "acknowledged"),
        await Qn(t, i)
    } catch (i) {
        await zn(i)
    }
}
async function wv(n, e, t) {
    const s = b(n);
    try {
        const i = await function(r, o) {
            const a = b(r);
            return a.persistence.runTransaction("Reject batch", "readwrite-primary", c => {
                let u;
                return a.mutationQueue.lookupMutationBatch(c, o).next(l => (L(l !== null),
                u = l.keys(),
                a.mutationQueue.removeMutationBatch(c, l))).next( () => a.mutationQueue.performConsistencyCheck(c)).next( () => a.documentOverlayCache.removeOverlaysForBatchId(c, u, o)).next( () => a.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c, u)).next( () => a.localDocuments.getDocuments(c, u))
            }
            )
        }(s.localStore, e);
        Yl(s, e, t),
        Ql(s, e),
        s.sharedClientState.updateMutationState(e, "rejected", t),
        await Qn(s, i)
    } catch (i) {
        await zn(i)
    }
}
function Ql(n, e) {
    (n.Ec.get(e) || []).forEach(t => {
        t.resolve()
    }
    ),
    n.Ec.delete(e)
}
function Yl(n, e, t) {
    const s = b(n);
    let i = s.Tc[s.currentUser.toKey()];
    if (i) {
        const r = i.get(e);
        r && (t ? r.reject(t) : r.resolve(),
        i = i.remove(e)),
        s.Tc[s.currentUser.toKey()] = i
    }
}
function gr(n, e, t=null) {
    n.sharedClientState.removeLocalQueryTarget(e);
    for (const s of n._c.get(e))
        n.wc.delete(s),
        t && n.dc.Pc(s, t);
    n._c.delete(e),
    n.isPrimaryClient && n.Ic.Is(e).forEach(s => {
        n.Ic.containsKey(s) || Jl(n, s)
    }
    )
}
function Jl(n, e) {
    n.mc.delete(e.path.canonicalString());
    const t = n.gc.get(e);
    t !== null && (Fl(n.remoteStore, t),
    n.gc = n.gc.remove(e),
    n.yc.delete(t),
    wo(n))
}
function za(n, e, t) {
    for (const s of t)
        s instanceof Kl ? (n.Ic.addReference(s.key, e),
        Ev(n, s)) : s instanceof Gl ? (v("SyncEngine", "Document no longer in limbo: " + s.key),
        n.Ic.removeReference(s.key, e),
        n.Ic.containsKey(s.key) || Jl(n, s.key)) : I()
}
function Ev(n, e) {
    const t = e.key
      , s = t.path.canonicalString();
    n.gc.get(t) || n.mc.has(s) || (v("SyncEngine", "New document in limbo: " + t),
    n.mc.add(s),
    wo(n))
}
function wo(n) {
    for (; n.mc.size > 0 && n.gc.size < n.maxConcurrentLimboResolutions; ) {
        const e = n.mc.values().next().value;
        n.mc.delete(e);
        const t = new w(M.fromString(e))
          , s = n.Ac.next();
        n.yc.set(s, new hv(t)),
        n.gc = n.gc.insert(t, s),
        xl(n.remoteStore, new $e(Oe(so(t.path)),s,"TargetPurposeLimboResolution",Jr.ct))
    }
}
async function Qn(n, e, t) {
    const s = b(n)
      , i = []
      , r = []
      , o = [];
    s.wc.isEmpty() || (s.wc.forEach( (a, c) => {
        o.push(s.Rc(c, e, t).then(u => {
            if ((u || t) && s.isPrimaryClient && s.sharedClientState.updateQueryState(c.targetId, u != null && u.fromCache ? "not-current" : "current"),
            u) {
                i.push(u);
                const l = ho.Li(c.targetId, u);
                r.push(l)
            }
        }
        ))
    }
    ),
    await Promise.all(o),
    s.dc.nu(i),
    await async function(a, c) {
        const u = b(a);
        try {
            await u.persistence.runTransaction("notifyLocalViewChanges", "readwrite", l => p.forEach(c, h => p.forEach(h.Fi, f => u.persistence.referenceDelegate.addReference(l, h.targetId, f)).next( () => p.forEach(h.Bi, f => u.persistence.referenceDelegate.removeReference(l, h.targetId, f)))))
        } catch (l) {
            if (!Hn(l))
                throw l;
            v("LocalStore", "Failed to update sequence numbers: " + l)
        }
        for (const l of c) {
            const h = l.targetId;
            if (!l.fromCache) {
                const f = u.Ji.get(h)
                  , g = f.snapshotVersion
                  , E = f.withLastLimboFreeSnapshotVersion(g);
                u.Ji = u.Ji.insert(h, E)
            }
        }
    }(s.localStore, r))
}
async function Iv(n, e) {
    const t = b(n);
    if (!t.currentUser.isEqual(e)) {
        v("SyncEngine", "User change. New user:", e.toKey());
        const s = await Ol(t.localStore, e);
        t.currentUser = e,
        function(i, r) {
            i.Ec.forEach(o => {
                o.forEach(a => {
                    a.reject(new y(d.CANCELLED,r))
                }
                )
            }
            ),
            i.Ec.clear()
        }(t, "'waitForPendingWrites' promise is rejected due to a user change."),
        t.sharedClientState.handleUserChange(e, s.removedBatchIds, s.addedBatchIds),
        await Qn(t, s.er)
    }
}
function _v(n, e) {
    const t = b(n)
      , s = t.yc.get(e);
    if (s && s.fc)
        return k().add(s.key);
    {
        let i = k();
        const r = t._c.get(e);
        if (!r)
            return i;
        for (const o of r) {
            const a = t.wc.get(o);
            i = i.unionWith(a.view.nc)
        }
        return i
    }
}
function Tv(n) {
    const e = b(n);
    return e.remoteStore.remoteSyncer.applyRemoteEvent = Wl.bind(null, e),
    e.remoteStore.remoteSyncer.getRemoteKeysForTarget = _v.bind(null, e),
    e.remoteStore.remoteSyncer.rejectListen = yv.bind(null, e),
    e.dc.nu = av.bind(null, e.eventManager),
    e.dc.Pc = cv.bind(null, e.eventManager),
    e
}
function Sv(n) {
    const e = b(n);
    return e.remoteStore.remoteSyncer.applySuccessfulWrite = vv.bind(null, e),
    e.remoteStore.remoteSyncer.rejectFailedWrite = wv.bind(null, e),
    e
}
class Ha {
    constructor() {
        this.synchronizeTabs = !1
    }
    async initialize(e) {
        this.serializer = li(e.databaseInfo.databaseId),
        this.sharedClientState = this.createSharedClientState(e),
        this.persistence = this.createPersistence(e),
        await this.persistence.start(),
        this.localStore = this.createLocalStore(e),
        this.gcScheduler = this.createGarbageCollectionScheduler(e, this.localStore),
        this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e, this.localStore)
    }
    createGarbageCollectionScheduler(e, t) {
        return null
    }
    createIndexBackfillerScheduler(e, t) {
        return null
    }
    createLocalStore(e) {
        return Oy(this.persistence, new Ny, e.initialUser, this.serializer)
    }
    createPersistence(e) {
        return new ky(lo.zs,this.serializer)
    }
    createSharedClientState(e) {
        return new Vy
    }
    async terminate() {
        this.gcScheduler && this.gcScheduler.stop(),
        await this.sharedClientState.shutdown(),
        await this.persistence.shutdown()
    }
}
class Av {
    async initialize(e, t) {
        this.localStore || (this.localStore = e.localStore,
        this.sharedClientState = e.sharedClientState,
        this.datastore = this.createDatastore(t),
        this.remoteStore = this.createRemoteStore(t),
        this.eventManager = this.createEventManager(t),
        this.syncEngine = this.createSyncEngine(t, !e.synchronizeTabs),
        this.sharedClientState.onlineStateHandler = s => qa(this.syncEngine, s, 1),
        this.remoteStore.remoteSyncer.handleCredentialChange = Iv.bind(null, this.syncEngine),
        await iv(this.remoteStore, this.syncEngine.isPrimaryClient))
    }
    createEventManager(e) {
        return new ov
    }
    createDatastore(e) {
        const t = li(e.databaseInfo.databaseId)
          , s = (i = e.databaseInfo,
        new qy(i));
        var i;
        return function(r, o, a, c) {
            return new Ky(r,o,a,c)
        }(e.authCredentials, e.appCheckCredentials, s, t)
    }
    createRemoteStore(e) {
        return t = this.localStore,
        s = this.datastore,
        i = e.asyncQueue,
        r = a => qa(this.syncEngine, a, 0),
        o = $a.D() ? new $a : new $y,
        new Wy(t,s,i,r,o);
        var t, s, i, r, o
    }
    createSyncEngine(e, t) {
        return function(s, i, r, o, a, c, u) {
            const l = new dv(s,i,r,o,a,c);
            return u && (l.vc = !0),
            l
        }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t)
    }
    terminate() {
        return async function(e) {
            const t = b(e);
            v("RemoteStore", "RemoteStore shutting down."),
            t.vu.add(5),
            await Wn(t),
            t.Pu.shutdown(),
            t.bu.set("Unknown")
        }(this.remoteStore)
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Xl {
    constructor(e) {
        this.observer = e,
        this.muted = !1
    }
    next(e) {
        this.observer.next && this.Sc(this.observer.next, e)
    }
    error(e) {
        this.observer.error ? this.Sc(this.observer.error, e) : Re("Uncaught Error in snapshot listener:", e.toString())
    }
    Dc() {
        this.muted = !0
    }
    Sc(e, t) {
        this.muted || setTimeout( () => {
            this.muted || e(t)
        }
        , 0)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Cv {
    constructor(e, t, s, i) {
        this.authCredentials = e,
        this.appCheckCredentials = t,
        this.asyncQueue = s,
        this.databaseInfo = i,
        this.user = X.UNAUTHENTICATED,
        this.clientId = Qu.A(),
        this.authCredentialListener = () => Promise.resolve(),
        this.appCheckCredentialListener = () => Promise.resolve(),
        this.authCredentials.start(s, async r => {
            v("FirestoreClient", "Received user=", r.uid),
            await this.authCredentialListener(r),
            this.user = r
        }
        ),
        this.appCheckCredentials.start(s, r => (v("FirestoreClient", "Received new app check token=", r),
        this.appCheckCredentialListener(r, this.user)))
    }
    async getConfiguration() {
        return {
            asyncQueue: this.asyncQueue,
            databaseInfo: this.databaseInfo,
            clientId: this.clientId,
            authCredentials: this.authCredentials,
            appCheckCredentials: this.appCheckCredentials,
            initialUser: this.user,
            maxConcurrentLimboResolutions: 100
        }
    }
    setCredentialChangeListener(e) {
        this.authCredentialListener = e
    }
    setAppCheckTokenChangeListener(e) {
        this.appCheckCredentialListener = e
    }
    verifyNotTerminated() {
        if (this.asyncQueue.isShuttingDown)
            throw new y(d.FAILED_PRECONDITION,"The client has already been terminated.")
    }
    terminate() {
        this.asyncQueue.enterRestrictedMode();
        const e = new Ce;
        return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
            try {
                this._onlineComponents && await this._onlineComponents.terminate(),
                this._offlineComponents && await this._offlineComponents.terminate(),
                this.authCredentials.shutdown(),
                this.appCheckCredentials.shutdown(),
                e.resolve()
            } catch (t) {
                const s = yo(t, "Failed to shutdown persistence");
                e.reject(s)
            }
        }
        ),
        e.promise
    }
}
async function Fi(n, e) {
    n.asyncQueue.verifyOperationInProgress(),
    v("FirestoreClient", "Initializing OfflineComponentProvider");
    const t = await n.getConfiguration();
    await e.initialize(t);
    let s = t.initialUser;
    n.setCredentialChangeListener(async i => {
        s.isEqual(i) || (await Ol(e.localStore, i),
        s = i)
    }
    ),
    e.persistence.setDatabaseDeletedListener( () => n.terminate()),
    n._offlineComponents = e
}
async function Ka(n, e) {
    n.asyncQueue.verifyOperationInProgress();
    const t = await kv(n);
    v("FirestoreClient", "Initializing OnlineComponentProvider");
    const s = await n.getConfiguration();
    await e.initialize(t, s),
    n.setCredentialChangeListener(i => Ba(e.remoteStore, i)),
    n.setAppCheckTokenChangeListener( (i, r) => Ba(e.remoteStore, r)),
    n._onlineComponents = e
}
function bv(n) {
    return n.name === "FirebaseError" ? n.code === d.FAILED_PRECONDITION || n.code === d.UNIMPLEMENTED : !(typeof DOMException < "u" && n instanceof DOMException) || n.code === 22 || n.code === 20 || n.code === 11
}
async function kv(n) {
    if (!n._offlineComponents)
        if (n._uninitializedComponentsProvider) {
            v("FirestoreClient", "Using user provided OfflineComponentProvider");
            try {
                await Fi(n, n._uninitializedComponentsProvider._offline)
            } catch (e) {
                const t = e;
                if (!bv(t))
                    throw t;
                Lt("Error using user provided cache. Falling back to memory cache: " + t),
                await Fi(n, new Ha)
            }
        } else
            v("FirestoreClient", "Using default OfflineComponentProvider"),
            await Fi(n, new Ha);
    return n._offlineComponents
}
async function Zl(n) {
    return n._onlineComponents || (n._uninitializedComponentsProvider ? (v("FirestoreClient", "Using user provided OnlineComponentProvider"),
    await Ka(n, n._uninitializedComponentsProvider._online)) : (v("FirestoreClient", "Using default OnlineComponentProvider"),
    await Ka(n, new Av))),
    n._onlineComponents
}
function Dv(n) {
    return Zl(n).then(e => e.syncEngine)
}
async function eh(n) {
    const e = await Zl(n)
      , t = e.eventManager;
    return t.onListen = fv.bind(null, e.syncEngine),
    t.onUnlisten = gv.bind(null, e.syncEngine),
    t
}
function Nv(n, e, t={}) {
    const s = new Ce;
    return n.asyncQueue.enqueueAndForget(async () => function(i, r, o, a, c) {
        const u = new Xl({
            next: h => {
                r.enqueueAndForget( () => zl(i, l));
                const f = h.docs.has(o);
                !f && h.fromCache ? c.reject(new y(d.UNAVAILABLE,"Failed to get document because the client is offline.")) : f && h.fromCache && a && a.source === "server" ? c.reject(new y(d.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : c.resolve(h)
            }
            ,
            error: h => c.reject(h)
        })
          , l = new Hl(so(o.path),u,{
            includeMetadataChanges: !0,
            Ku: !0
        });
        return ql(i, l)
    }(await eh(n), n.asyncQueue, e, t, s)),
    s.promise
}
function Rv(n, e, t={}) {
    const s = new Ce;
    return n.asyncQueue.enqueueAndForget(async () => function(i, r, o, a, c) {
        const u = new Xl({
            next: h => {
                r.enqueueAndForget( () => zl(i, l)),
                h.fromCache && a.source === "server" ? c.reject(new y(d.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : c.resolve(h)
            }
            ,
            error: h => c.reject(h)
        })
          , l = new Hl(o,u,{
            includeMetadataChanges: !0,
            Ku: !0
        });
        return ql(i, l)
    }(await eh(n), n.asyncQueue, e, t, s)),
    s.promise
}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function th(n) {
    const e = {};
    return n.timeoutSeconds !== void 0 && (e.timeoutSeconds = n.timeoutSeconds),
    e
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ga = new Map;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function nh(n, e, t) {
    if (!t)
        throw new y(d.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)
}
function Ov(n, e, t, s) {
    if (e === !0 && s === !0)
        throw new y(d.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)
}
function Wa(n) {
    if (!w.isDocumentKey(n))
        throw new y(d.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)
}
function Qa(n) {
    if (w.isDocumentKey(n))
        throw new y(d.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)
}
function fi(n) {
    if (n === void 0)
        return "undefined";
    if (n === null)
        return "null";
    if (typeof n == "string")
        return n.length > 20 && (n = `${n.substring(0, 20)}...`),
        JSON.stringify(n);
    if (typeof n == "number" || typeof n == "boolean")
        return "" + n;
    if (typeof n == "object") {
        if (n instanceof Array)
            return "an array";
        {
            const e = function(t) {
                return t.constructor ? t.constructor.name : null
            }(n);
            return e ? `a custom ${e} object` : "an object"
        }
    }
    return typeof n == "function" ? "a function" : I()
}
function ft(n, e) {
    if ("_delegate"in n && (n = n._delegate),
    !(n instanceof e)) {
        if (e.name === n.constructor.name)
            throw new y(d.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
        {
            const t = fi(n);
            throw new y(d.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)
        }
    }
    return n
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ya {
    constructor(e) {
        var t, s;
        if (e.host === void 0) {
            if (e.ssl !== void 0)
                throw new y(d.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com",
            this.ssl = !0
        } else
            this.host = e.host,
            this.ssl = (t = e.ssl) === null || t === void 0 || t;
        if (this.credentials = e.credentials,
        this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties,
        this.cache = e.localCache,
        e.cacheSizeBytes === void 0)
            this.cacheSizeBytes = 41943040;
        else {
            if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
                throw new y(d.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = e.cacheSizeBytes
        }
        Ov("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling),
        this.experimentalForceLongPolling = !!e.experimentalForceLongPolling,
        this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = !1 : e.experimentalAutoDetectLongPolling === void 0 ? this.experimentalAutoDetectLongPolling = !0 : this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling,
        this.experimentalLongPollingOptions = th((s = e.experimentalLongPollingOptions) !== null && s !== void 0 ? s : {}),
        function(i) {
            if (i.timeoutSeconds !== void 0) {
                if (isNaN(i.timeoutSeconds))
                    throw new y(d.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (must not be NaN)`);
                if (i.timeoutSeconds < 5)
                    throw new y(d.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (minimum allowed value is 5)`);
                if (i.timeoutSeconds > 30)
                    throw new y(d.INVALID_ARGUMENT,`invalid long polling timeout: ${i.timeoutSeconds} (maximum allowed value is 30)`)
            }
        }(this.experimentalLongPollingOptions),
        this.useFetchStreams = !!e.useFetchStreams
    }
    isEqual(e) {
        return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && (t = this.experimentalLongPollingOptions,
        s = e.experimentalLongPollingOptions,
        t.timeoutSeconds === s.timeoutSeconds) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
        var t, s
    }
}
class pi {
    constructor(e, t, s, i) {
        this._authCredentials = e,
        this._appCheckCredentials = t,
        this._databaseId = s,
        this._app = i,
        this.type = "firestore-lite",
        this._persistenceKey = "(lite)",
        this._settings = new Ya({}),
        this._settingsFrozen = !1
    }
    get app() {
        if (!this._app)
            throw new y(d.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");
        return this._app
    }
    get _initialized() {
        return this._settingsFrozen
    }
    get _terminated() {
        return this._terminateTask !== void 0
    }
    _setSettings(e) {
        if (this._settingsFrozen)
            throw new y(d.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
        this._settings = new Ya(e),
        e.credentials !== void 0 && (this._authCredentials = function(t) {
            if (!t)
                return new nm;
            switch (t.type) {
            case "firstParty":
                return new om(t.sessionIndex || "0",t.iamToken || null,t.authTokenFactory || null);
            case "provider":
                return t.client;
            default:
                throw new y(d.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")
            }
        }(e.credentials))
    }
    _getSettings() {
        return this._settings
    }
    _freezeSettings() {
        return this._settingsFrozen = !0,
        this._settings
    }
    _delete() {
        return this._terminateTask || (this._terminateTask = this._terminate()),
        this._terminateTask
    }
    toJSON() {
        return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
        }
    }
    _terminate() {
        return function(e) {
            const t = Ga.get(e);
            t && (v("ComponentProvider", "Removing Datastore"),
            Ga.delete(e),
            t.terminate())
        }(this),
        Promise.resolve()
    }
}
function Pv(n, e, t, s={}) {
    var i;
    const r = (n = ft(n, pi))._getSettings()
      , o = `${e}:${t}`;
    if (r.host !== "firestore.googleapis.com" && r.host !== o && Lt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),
    n._setSettings(Object.assign(Object.assign({}, r), {
        host: o,
        ssl: !1
    })),
    s.mockUserToken) {
        let a, c;
        if (typeof s.mockUserToken == "string")
            a = s.mockUserToken,
            c = X.MOCK_USER;
        else {
            a = bh(s.mockUserToken, (i = n._app) === null || i === void 0 ? void 0 : i.options.projectId);
            const u = s.mockUserToken.sub || s.mockUserToken.user_id;
            if (!u)
                throw new y(d.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");
            c = new X(u)
        }
        n._authCredentials = new sm(new Wu(a,c))
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ce {
    constructor(e, t, s) {
        this.converter = t,
        this._key = s,
        this.type = "document",
        this.firestore = e
    }
    get _path() {
        return this._key.path
    }
    get id() {
        return this._key.path.lastSegment()
    }
    get path() {
        return this._key.path.canonicalString()
    }
    get parent() {
        return new ze(this.firestore,this.converter,this._key.path.popLast())
    }
    withConverter(e) {
        return new ce(this.firestore,e,this._key)
    }
}
class Wt {
    constructor(e, t, s) {
        this.converter = t,
        this._query = s,
        this.type = "query",
        this.firestore = e
    }
    withConverter(e) {
        return new Wt(this.firestore,e,this._query)
    }
}
class ze extends Wt {
    constructor(e, t, s) {
        super(e, t, so(s)),
        this._path = s,
        this.type = "collection"
    }
    get id() {
        return this._query.path.lastSegment()
    }
    get path() {
        return this._query.path.canonicalString()
    }
    get parent() {
        const e = this._path.popLast();
        return e.isEmpty() ? null : new ce(this.firestore,null,new w(e))
    }
    withConverter(e) {
        return new ze(this.firestore,e,this._path)
    }
}
function Mv(n, e, ...t) {
    if (n = ae(n),
    nh("collection", "path", e),
    n instanceof pi) {
        const s = M.fromString(e, ...t);
        return Qa(s),
        new ze(n,null,s)
    }
    {
        if (!(n instanceof ce || n instanceof ze))
            throw new y(d.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const s = n._path.child(M.fromString(e, ...t));
        return Qa(s),
        new ze(n.firestore,null,s)
    }
}
function Lv(n, e, ...t) {
    if (n = ae(n),
    arguments.length === 1 && (e = Qu.A()),
    nh("doc", "path", e),
    n instanceof pi) {
        const s = M.fromString(e, ...t);
        return Wa(s),
        new ce(n,null,new w(s))
    }
    {
        if (!(n instanceof ce || n instanceof ze))
            throw new y(d.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
        const s = n._path.child(M.fromString(e, ...t));
        return Wa(s),
        new ce(n.firestore,n instanceof ze ? n.converter : null,new w(s))
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xv {
    constructor() {
        this.Gc = Promise.resolve(),
        this.Qc = [],
        this.jc = !1,
        this.zc = [],
        this.Wc = null,
        this.Hc = !1,
        this.Jc = !1,
        this.Yc = [],
        this.qo = new Ml(this,"async_queue_retry"),
        this.Xc = () => {
            const t = xi();
            t && v("AsyncQueue", "Visibility state changed to " + t.visibilityState),
            this.qo.Mo()
        }
        ;
        const e = xi();
        e && typeof e.addEventListener == "function" && e.addEventListener("visibilitychange", this.Xc)
    }
    get isShuttingDown() {
        return this.jc
    }
    enqueueAndForget(e) {
        this.enqueue(e)
    }
    enqueueAndForgetEvenWhileRestricted(e) {
        this.Zc(),
        this.ta(e)
    }
    enterRestrictedMode(e) {
        if (!this.jc) {
            this.jc = !0,
            this.Jc = e || !1;
            const t = xi();
            t && typeof t.removeEventListener == "function" && t.removeEventListener("visibilitychange", this.Xc)
        }
    }
    enqueue(e) {
        if (this.Zc(),
        this.jc)
            return new Promise( () => {}
            );
        const t = new Ce;
        return this.ta( () => this.jc && this.Jc ? Promise.resolve() : (e().then(t.resolve, t.reject),
        t.promise)).then( () => t.promise)
    }
    enqueueRetryable(e) {
        this.enqueueAndForget( () => (this.Qc.push(e),
        this.ea()))
    }
    async ea() {
        if (this.Qc.length !== 0) {
            try {
                await this.Qc[0](),
                this.Qc.shift(),
                this.qo.reset()
            } catch (e) {
                if (!Hn(e))
                    throw e;
                v("AsyncQueue", "Operation failed with retryable error: " + e)
            }
            this.Qc.length > 0 && this.qo.No( () => this.ea())
        }
    }
    ta(e) {
        const t = this.Gc.then( () => (this.Hc = !0,
        e().catch(s => {
            this.Wc = s,
            this.Hc = !1;
            const i = function(r) {
                let o = r.message || "";
                return r.stack && (o = r.stack.includes(r.message) ? r.stack : r.message + `
` + r.stack),
                o
            }(s);
            throw Re("INTERNAL UNHANDLED ERROR: ", i),
            s
        }
        ).then(s => (this.Hc = !1,
        s))));
        return this.Gc = t,
        t
    }
    enqueueAfterDelay(e, t, s) {
        this.Zc(),
        this.Yc.indexOf(e) > -1 && (t = 0);
        const i = mo.createAndSchedule(this, e, t, s, r => this.na(r));
        return this.zc.push(i),
        i
    }
    Zc() {
        this.Wc && I()
    }
    verifyOperationInProgress() {}
    async sa() {
        let e;
        do
            e = this.Gc,
            await e;
        while (e !== this.Gc)
    }
    ia(e) {
        for (const t of this.zc)
            if (t.timerId === e)
                return !0;
        return !1
    }
    ra(e) {
        return this.sa().then( () => {
            this.zc.sort( (t, s) => t.targetTimeMs - s.targetTimeMs);
            for (const t of this.zc)
                if (t.skipDelay(),
                e !== "all" && t.timerId === e)
                    break;
            return this.sa()
        }
        )
    }
    oa(e) {
        this.Yc.push(e)
    }
    na(e) {
        const t = this.zc.indexOf(e);
        this.zc.splice(t, 1)
    }
}
class gi extends pi {
    constructor(e, t, s, i) {
        super(e, t, s, i),
        this.type = "firestore",
        this._queue = new xv,
        this._persistenceKey = (i == null ? void 0 : i.name) || "[DEFAULT]"
    }
    _terminate() {
        return this._firestoreClient || sh(this),
        this._firestoreClient.terminate()
    }
}
function Fv(n, e) {
    const t = typeof n == "object" ? n : lc()
      , s = typeof n == "string" ? n : e || "(default)"
      , i = Er(t, "firestore").getImmediate({
        identifier: s
    });
    if (!i._initialized) {
        const r = Ah("firestore");
        r && Pv(i, ...r)
    }
    return i
}
function Eo(n) {
    return n._firestoreClient || sh(n),
    n._firestoreClient.verifyNotTerminated(),
    n._firestoreClient
}
function sh(n) {
    var e, t, s;
    const i = n._freezeSettings()
      , r = function(o, a, c, u) {
        return new vm(o,a,c,u.host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,th(u.experimentalLongPollingOptions),u.useFetchStreams)
    }(n._databaseId, ((e = n._app) === null || e === void 0 ? void 0 : e.options.appId) || "", n._persistenceKey, i);
    n._firestoreClient = new Cv(n._authCredentials,n._appCheckCredentials,n._queue,r),
    !((t = i.cache) === null || t === void 0) && t._offlineComponentProvider && (!((s = i.cache) === null || s === void 0) && s._onlineComponentProvider) && (n._firestoreClient._uninitializedComponentsProvider = {
        _offlineKind: i.cache.kind,
        _offline: i.cache._offlineComponentProvider,
        _online: i.cache._onlineComponentProvider
    })
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Bt {
    constructor(e) {
        this._byteString = e
    }
    static fromBase64String(e) {
        try {
            return new Bt(re.fromBase64String(e))
        } catch (t) {
            throw new y(d.INVALID_ARGUMENT,"Failed to construct data from Base64 string: " + t)
        }
    }
    static fromUint8Array(e) {
        return new Bt(re.fromUint8Array(e))
    }
    toBase64() {
        return this._byteString.toBase64()
    }
    toUint8Array() {
        return this._byteString.toUint8Array()
    }
    toString() {
        return "Bytes(base64: " + this.toBase64() + ")"
    }
    isEqual(e) {
        return this._byteString.isEqual(e._byteString)
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class mi {
    constructor(...e) {
        for (let t = 0; t < e.length; ++t)
            if (e[t].length === 0)
                throw new y(d.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");
        this._internalPath = new ee(e)
    }
    isEqual(e) {
        return this._internalPath.isEqual(e._internalPath)
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Yn {
    constructor(e) {
        this._methodName = e
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Io {
    constructor(e, t) {
        if (!isFinite(e) || e < -90 || e > 90)
            throw new y(d.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: " + e);
        if (!isFinite(t) || t < -180 || t > 180)
            throw new y(d.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: " + t);
        this._lat = e,
        this._long = t
    }
    get latitude() {
        return this._lat
    }
    get longitude() {
        return this._long
    }
    isEqual(e) {
        return this._lat === e._lat && this._long === e._long
    }
    toJSON() {
        return {
            latitude: this._lat,
            longitude: this._long
        }
    }
    _compareTo(e) {
        return R(this._lat, e._lat) || R(this._long, e._long)
    }
}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Uv = /^__.*__$/;
class ih {
    constructor(e, t, s) {
        this.data = e,
        this.fieldMask = t,
        this.fieldTransforms = s
    }
    toMutation(e, t) {
        return new mt(e,this.data,this.fieldMask,t,this.fieldTransforms)
    }
}
function rh(n) {
    switch (n) {
    case 0:
    case 2:
    case 1:
        return !0;
    case 3:
    case 4:
        return !1;
    default:
        throw I()
    }
}
class _o {
    constructor(e, t, s, i, r, o) {
        this.settings = e,
        this.databaseId = t,
        this.serializer = s,
        this.ignoreUndefinedProperties = i,
        r === void 0 && this.ua(),
        this.fieldTransforms = r || [],
        this.fieldMask = o || []
    }
    get path() {
        return this.settings.path
    }
    get ca() {
        return this.settings.ca
    }
    aa(e) {
        return new _o(Object.assign(Object.assign({}, this.settings), e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)
    }
    ha(e) {
        var t;
        const s = (t = this.path) === null || t === void 0 ? void 0 : t.child(e)
          , i = this.aa({
            path: s,
            la: !1
        });
        return i.fa(e),
        i
    }
    da(e) {
        var t;
        const s = (t = this.path) === null || t === void 0 ? void 0 : t.child(e)
          , i = this.aa({
            path: s,
            la: !1
        });
        return i.ua(),
        i
    }
    wa(e) {
        return this.aa({
            path: void 0,
            la: !0
        })
    }
    _a(e) {
        return xs(e, this.settings.methodName, this.settings.ma || !1, this.path, this.settings.ga)
    }
    contains(e) {
        return this.fieldMask.find(t => e.isPrefixOf(t)) !== void 0 || this.fieldTransforms.find(t => e.isPrefixOf(t.field)) !== void 0
    }
    ua() {
        if (this.path)
            for (let e = 0; e < this.path.length; e++)
                this.fa(this.path.get(e))
    }
    fa(e) {
        if (e.length === 0)
            throw this._a("Document fields must not be empty");
        if (rh(this.ca) && Uv.test(e))
            throw this._a('Document fields cannot begin and end with "__"')
    }
}
class Vv {
    constructor(e, t, s) {
        this.databaseId = e,
        this.ignoreUndefinedProperties = t,
        this.serializer = s || li(e)
    }
    ya(e, t, s, i=!1) {
        return new _o({
            ca: e,
            methodName: t,
            ga: s,
            path: ee.emptyPath(),
            la: !1,
            ma: i
        },this.databaseId,this.serializer,this.ignoreUndefinedProperties)
    }
}
function oh(n) {
    const e = n._freezeSettings()
      , t = li(n._databaseId);
    return new Vv(n._databaseId,!!e.ignoreUndefinedProperties,t)
}
class yi extends Yn {
    _toFieldTransform(e) {
        if (e.ca !== 2)
            throw e.ca === 1 ? e._a(`${this._methodName}() can only appear at the top level of your update data`) : e._a(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
        return e.fieldMask.push(e.path),
        null
    }
    isEqual(e) {
        return e instanceof yi
    }
}
class To extends Yn {
    _toFieldTransform(e) {
        return new wl(e.path,new An)
    }
    isEqual(e) {
        return e instanceof To
    }
}
class $v extends Yn {
    constructor(e, t) {
        super(e),
        this.Ia = t
    }
    _toFieldTransform(e) {
        const t = new kn(e.serializer,pl(e.serializer, this.Ia));
        return new wl(e.path,t)
    }
    isEqual(e) {
        return this === e
    }
}
function Bv(n, e, t, s) {
    const i = n.ya(1, e, t);
    ch("Data must be an object, but it was:", i, s);
    const r = []
      , o = le.empty();
    gt(s, (c, u) => {
        const l = So(e, c, t);
        u = ae(u);
        const h = i.da(l);
        if (u instanceof yi)
            r.push(l);
        else {
            const f = Jn(u, h);
            f != null && (r.push(l),
            o.set(l, f))
        }
    }
    );
    const a = new fe(r);
    return new ih(o,a,i.fieldTransforms)
}
function jv(n, e, t, s, i, r) {
    const o = n.ya(1, e, t)
      , a = [Ja(e, s, t)]
      , c = [i];
    if (r.length % 2 != 0)
        throw new y(d.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
    for (let f = 0; f < r.length; f += 2)
        a.push(Ja(e, r[f])),
        c.push(r[f + 1]);
    const u = []
      , l = le.empty();
    for (let f = a.length - 1; f >= 0; --f)
        if (!Kv(u, a[f])) {
            const g = a[f];
            let E = c[f];
            E = ae(E);
            const C = o.da(g);
            if (E instanceof yi)
                u.push(g);
            else {
                const _ = Jn(E, C);
                _ != null && (u.push(g),
                l.set(g, _))
            }
        }
    const h = new fe(u);
    return new ih(l,h,o.fieldTransforms)
}
function qv(n, e, t, s=!1) {
    return Jn(t, n.ya(s ? 4 : 3, e))
}
function Jn(n, e) {
    if (ah(n = ae(n)))
        return ch("Unsupported field value:", e, n),
        zv(n, e);
    if (n instanceof Yn)
        return function(t, s) {
            if (!rh(s.ca))
                throw s._a(`${t._methodName}() can only be used with update() and set()`);
            if (!s.path)
                throw s._a(`${t._methodName}() is not currently supported inside arrays`);
            const i = t._toFieldTransform(s);
            i && s.fieldTransforms.push(i)
        }(n, e),
        null;
    if (n === void 0 && e.ignoreUndefinedProperties)
        return null;
    if (e.path && e.fieldMask.push(e.path),
    n instanceof Array) {
        if (e.settings.la && e.ca !== 4)
            throw e._a("Nested arrays are not supported");
        return function(t, s) {
            const i = [];
            let r = 0;
            for (const o of t) {
                let a = Jn(o, s.wa(r));
                a == null && (a = {
                    nullValue: "NULL_VALUE"
                }),
                i.push(a),
                r++
            }
            return {
                arrayValue: {
                    values: i
                }
            }
        }(n, e)
    }
    return function(t, s) {
        if ((t = ae(t)) === null)
            return {
                nullValue: "NULL_VALUE"
            };
        if (typeof t == "number")
            return pl(s.serializer, t);
        if (typeof t == "boolean")
            return {
                booleanValue: t
            };
        if (typeof t == "string")
            return {
                stringValue: t
            };
        if (t instanceof Date) {
            const i = q.fromDate(t);
            return {
                timestampValue: Ms(s.serializer, i)
            }
        }
        if (t instanceof q) {
            const i = new q(t.seconds,1e3 * Math.floor(t.nanoseconds / 1e3));
            return {
                timestampValue: Ms(s.serializer, i)
            }
        }
        if (t instanceof Io)
            return {
                geoPointValue: {
                    latitude: t.latitude,
                    longitude: t.longitude
                }
            };
        if (t instanceof Bt)
            return {
                bytesValue: Cl(s.serializer, t._byteString)
            };
        if (t instanceof ce) {
            const i = s.databaseId
              , r = t.firestore._databaseId;
            if (!r.isEqual(i))
                throw s._a(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${i.projectId}/${i.database}`);
            return {
                referenceValue: co(t.firestore._databaseId || s.databaseId, t._key.path)
            }
        }
        throw s._a(`Unsupported field value: ${fi(t)}`)
    }(n, e)
}
function zv(n, e) {
    const t = {};
    return Yu(n) ? e.path && e.path.length > 0 && e.fieldMask.push(e.path) : gt(n, (s, i) => {
        const r = Jn(i, e.ha(s));
        r != null && (t[s] = r)
    }
    ),
    {
        mapValue: {
            fields: t
        }
    }
}
function ah(n) {
    return !(typeof n != "object" || n === null || n instanceof Array || n instanceof Date || n instanceof q || n instanceof Io || n instanceof Bt || n instanceof ce || n instanceof Yn)
}
function ch(n, e, t) {
    if (!ah(t) || !function(s) {
        return typeof s == "object" && s !== null && (Object.getPrototypeOf(s) === Object.prototype || Object.getPrototypeOf(s) === null)
    }(t)) {
        const s = fi(t);
        throw s === "an object" ? e._a(n + " a custom object") : e._a(n + " " + s)
    }
}
function Ja(n, e, t) {
    if ((e = ae(e))instanceof mi)
        return e._internalPath;
    if (typeof e == "string")
        return So(n, e);
    throw xs("Field path arguments must be of type string or ", n, !1, void 0, t)
}
const Hv = new RegExp("[~\\*/\\[\\]]");
function So(n, e, t) {
    if (e.search(Hv) >= 0)
        throw xs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, n, !1, void 0, t);
    try {
        return new mi(...e.split("."))._internalPath
    } catch {
        throw xs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, n, !1, void 0, t)
    }
}
function xs(n, e, t, s, i) {
    const r = s && !s.isEmpty()
      , o = i !== void 0;
    let a = `Function ${e}() called with invalid data`;
    t && (a += " (via `toFirestore()`)"),
    a += ". ";
    let c = "";
    return (r || o) && (c += " (found",
    r && (c += ` in field ${s}`),
    o && (c += ` in document ${i}`),
    c += ")"),
    new y(d.INVALID_ARGUMENT,a + n + c)
}
function Kv(n, e) {
    return n.some(t => t.isEqual(e))
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class uh {
    constructor(e, t, s, i, r) {
        this._firestore = e,
        this._userDataWriter = t,
        this._key = s,
        this._document = i,
        this._converter = r
    }
    get id() {
        return this._key.path.lastSegment()
    }
    get ref() {
        return new ce(this._firestore,this._converter,this._key)
    }
    exists() {
        return this._document !== null
    }
    data() {
        if (this._document) {
            if (this._converter) {
                const e = new Gv(this._firestore,this._userDataWriter,this._key,this._document,null);
                return this._converter.fromFirestore(e)
            }
            return this._userDataWriter.convertValue(this._document.data.value)
        }
    }
    get(e) {
        if (this._document) {
            const t = this._document.data.field(lh("DocumentSnapshot.get", e));
            if (t !== null)
                return this._userDataWriter.convertValue(t)
        }
    }
}
class Gv extends uh {
    data() {
        return super.data()
    }
}
function lh(n, e) {
    return typeof e == "string" ? So(n, e) : e instanceof mi ? e._internalPath : e._delegate._internalPath
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Wv(n) {
    if (n.limitType === "L" && n.explicitOrderBy.length === 0)
        throw new y(d.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")
}
class Ao {
}
class Qv extends Ao {
}
function Yv(n, e, ...t) {
    let s = [];
    e instanceof Ao && s.push(e),
    s = s.concat(t),
    function(i) {
        const r = i.filter(a => a instanceof bo).length
          , o = i.filter(a => a instanceof Co).length;
        if (r > 1 || r > 0 && o > 0)
            throw new y(d.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")
    }(s);
    for (const i of s)
        n = i._apply(n);
    return n
}
class Co extends Qv {
    constructor(e, t, s) {
        super(),
        this._field = e,
        this._op = t,
        this._value = s,
        this.type = "where"
    }
    static _create(e, t, s) {
        return new Co(e,t,s)
    }
    _apply(e) {
        const t = this._parse(e);
        return hh(e._query, t),
        new Wt(e.firestore,e.converter,ar(e._query, t))
    }
    _parse(e) {
        const t = oh(e.firestore);
        return function(i, r, o, a, c, u, l) {
            let h;
            if (c.isKeyField()) {
                if (u === "array-contains" || u === "array-contains-any")
                    throw new y(d.INVALID_ARGUMENT,`Invalid Query. You can't perform '${u}' queries on documentId().`);
                if (u === "in" || u === "not-in") {
                    Za(l, u);
                    const f = [];
                    for (const g of l)
                        f.push(Xa(a, i, g));
                    h = {
                        arrayValue: {
                            values: f
                        }
                    }
                } else
                    h = Xa(a, i, l)
            } else
                u !== "in" && u !== "not-in" && u !== "array-contains-any" || Za(l, u),
                h = qv(o, r, l, u === "in" || u === "not-in");
            return j.create(c, u, h)
        }(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value)
    }
}
class bo extends Ao {
    constructor(e, t) {
        super(),
        this.type = e,
        this._queryConstraints = t
    }
    static _create(e, t) {
        return new bo(e,t)
    }
    _parse(e) {
        const t = this._queryConstraints.map(s => s._parse(e)).filter(s => s.getFilters().length > 0);
        return t.length === 1 ? t[0] : ge.create(t, this._getOperator())
    }
    _apply(e) {
        const t = this._parse(e);
        return t.getFilters().length === 0 ? e : (function(s, i) {
            let r = s;
            const o = i.getFlattenedFilters();
            for (const a of o)
                hh(r, a),
                r = ar(r, a)
        }(e._query, t),
        new Wt(e.firestore,e.converter,ar(e._query, t)))
    }
    _getQueryConstraints() {
        return this._queryConstraints
    }
    _getOperator() {
        return this.type === "and" ? "and" : "or"
    }
}
function Xa(n, e, t) {
    if (typeof (t = ae(t)) == "string") {
        if (t === "")
            throw new y(d.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
        if (!ol(e) && t.indexOf("/") !== -1)
            throw new y(d.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);
        const s = e.path.child(M.fromString(t));
        if (!w.isDocumentKey(s))
            throw new y(d.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${s}' is not because it has an odd number of segments (${s.length}).`);
        return Ia(n, new w(s))
    }
    if (t instanceof ce)
        return Ia(n, t._key);
    throw new y(d.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${fi(t)}.`)
}
function Za(n, e) {
    if (!Array.isArray(n) || n.length === 0)
        throw new y(d.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)
}
function hh(n, e) {
    if (e.isInequality()) {
        const s = io(n)
          , i = e.field;
        if (s !== null && !s.isEqual(i))
            throw new y(d.INVALID_ARGUMENT,`Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${s.toString()}' and '${i.toString()}'`);
        const r = rl(n);
        r !== null && Jv(n, i, r)
    }
    const t = function(s, i) {
        for (const r of s)
            for (const o of r.getFlattenedFilters())
                if (i.indexOf(o.op) >= 0)
                    return o.op;
        return null
    }(n.filters, function(s) {
        switch (s) {
        case "!=":
            return ["!=", "not-in"];
        case "array-contains-any":
        case "in":
            return ["not-in"];
        case "not-in":
            return ["array-contains-any", "in", "not-in", "!="];
        default:
            return []
        }
    }(e.op));
    if (t !== null)
        throw t === e.op ? new y(d.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`) : new y(d.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)
}
function Jv(n, e, t) {
    if (!t.isEqual(e))
        throw new y(d.INVALID_ARGUMENT,`Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${e.toString()}' and so you must also use '${e.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${t.toString()}' instead.`)
}
class Xv {
    convertValue(e, t="none") {
        switch (dt(e)) {
        case 0:
            return null;
        case 1:
            return e.booleanValue;
        case 2:
            return B(e.integerValue || e.doubleValue);
        case 3:
            return this.convertTimestamp(e.timestampValue);
        case 4:
            return this.convertServerTimestamp(e, t);
        case 5:
            return e.stringValue;
        case 6:
            return this.convertBytes(ht(e.bytesValue));
        case 7:
            return this.convertReference(e.referenceValue);
        case 8:
            return this.convertGeoPoint(e.geoPointValue);
        case 9:
            return this.convertArray(e.arrayValue, t);
        case 10:
            return this.convertObject(e.mapValue, t);
        default:
            throw I()
        }
    }
    convertObject(e, t) {
        return this.convertObjectMap(e.fields, t)
    }
    convertObjectMap(e, t="none") {
        const s = {};
        return gt(e, (i, r) => {
            s[i] = this.convertValue(r, t)
        }
        ),
        s
    }
    convertGeoPoint(e) {
        return new Io(B(e.latitude),B(e.longitude))
    }
    convertArray(e, t) {
        return (e.values || []).map(s => this.convertValue(s, t))
    }
    convertServerTimestamp(e, t) {
        switch (t) {
        case "previous":
            const s = Zr(e);
            return s == null ? null : this.convertValue(s, t);
        case "estimate":
            return this.convertTimestamp(_n(e));
        default:
            return null
        }
    }
    convertTimestamp(e) {
        const t = Ge(e);
        return new q(t.seconds,t.nanos)
    }
    convertDocumentKey(e, t) {
        const s = M.fromString(e);
        L(Rl(s));
        const i = new Tn(s.get(1),s.get(3))
          , r = new w(s.popFirst(5));
        return i.isEqual(t) || Re(`Document ${r} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),
        r
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class nn {
    constructor(e, t) {
        this.hasPendingWrites = e,
        this.fromCache = t
    }
    isEqual(e) {
        return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache
    }
}
class dh extends uh {
    constructor(e, t, s, i, r, o) {
        super(e, t, s, i, o),
        this._firestore = e,
        this._firestoreImpl = e,
        this.metadata = r
    }
    exists() {
        return super.exists()
    }
    data(e={}) {
        if (this._document) {
            if (this._converter) {
                const t = new ms(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);
                return this._converter.fromFirestore(t, e)
            }
            return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps)
        }
    }
    get(e, t={}) {
        if (this._document) {
            const s = this._document.data.field(lh("DocumentSnapshot.get", e));
            if (s !== null)
                return this._userDataWriter.convertValue(s, t.serverTimestamps)
        }
    }
}
class ms extends dh {
    data(e={}) {
        return super.data(e)
    }
}
class Zv {
    constructor(e, t, s, i) {
        this._firestore = e,
        this._userDataWriter = t,
        this._snapshot = i,
        this.metadata = new nn(i.hasPendingWrites,i.fromCache),
        this.query = s
    }
    get docs() {
        const e = [];
        return this.forEach(t => e.push(t)),
        e
    }
    get size() {
        return this._snapshot.docs.size
    }
    get empty() {
        return this.size === 0
    }
    forEach(e, t) {
        this._snapshot.docs.forEach(s => {
            e.call(t, new ms(this._firestore,this._userDataWriter,s.key,s,new nn(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))
        }
        )
    }
    docChanges(e={}) {
        const t = !!e.includeMetadataChanges;
        if (t && this._snapshot.excludesMetadataChanges)
            throw new y(d.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
        return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = function(s, i) {
            if (s._snapshot.oldDocs.isEmpty()) {
                let r = 0;
                return s._snapshot.docChanges.map(o => {
                    const a = new ms(s._firestore,s._userDataWriter,o.doc.key,o.doc,new nn(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);
                    return o.doc,
                    {
                        type: "added",
                        doc: a,
                        oldIndex: -1,
                        newIndex: r++
                    }
                }
                )
            }
            {
                let r = s._snapshot.oldDocs;
                return s._snapshot.docChanges.filter(o => i || o.type !== 3).map(o => {
                    const a = new ms(s._firestore,s._userDataWriter,o.doc.key,o.doc,new nn(s._snapshot.mutatedKeys.has(o.doc.key),s._snapshot.fromCache),s.query.converter);
                    let c = -1
                      , u = -1;
                    return o.type !== 0 && (c = r.indexOf(o.doc.key),
                    r = r.delete(o.doc.key)),
                    o.type !== 1 && (r = r.add(o.doc),
                    u = r.indexOf(o.doc.key)),
                    {
                        type: ew(o.type),
                        doc: a,
                        oldIndex: c,
                        newIndex: u
                    }
                }
                )
            }
        }(this, t),
        this._cachedChangesIncludeMetadataChanges = t),
        this._cachedChanges
    }
}
function ew(n) {
    switch (n) {
    case 0:
        return "added";
    case 2:
    case 3:
        return "modified";
    case 1:
        return "removed";
    default:
        return I()
    }
}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function gw(n) {
    n = ft(n, ce);
    const e = ft(n.firestore, gi);
    return Nv(Eo(e), n._key).then(t => iw(e, n, t))
}
class fh extends Xv {
    constructor(e) {
        super(),
        this.firestore = e
    }
    convertBytes(e) {
        return new Bt(e)
    }
    convertReference(e) {
        const t = this.convertDocumentKey(e, this.firestore._databaseId);
        return new ce(this.firestore,null,t)
    }
}
function tw(n) {
    n = ft(n, Wt);
    const e = ft(n.firestore, gi)
      , t = Eo(e)
      , s = new fh(e);
    return Wv(n._query),
    Rv(t, n._query).then(i => new Zv(e,s,n,i))
}
function nw(n, e, t, ...s) {
    n = ft(n, ce);
    const i = ft(n.firestore, gi)
      , r = oh(i);
    let o;
    return o = typeof (e = ae(e)) == "string" || e instanceof mi ? jv(r, "updateDoc", n._key, e, t, s) : Bv(r, "updateDoc", n._key, e),
    sw(i, [o.toMutation(n._key, be.exists(!0))])
}
function sw(n, e) {
    return function(t, s) {
        const i = new Ce;
        return t.asyncQueue.enqueueAndForget(async () => mv(await Dv(t), s, i)),
        i.promise
    }(Eo(n), e)
}
function iw(n, e, t) {
    const s = t.docs.get(e._key)
      , i = new fh(n);
    return new dh(n,i,e._key,s,new nn(t.hasPendingWrites,t.fromCache),e.converter)
}
function rw() {
    return new To("serverTimestamp")
}
function ow(n) {
    return new $v("increment",n)
}
(function(n, e=!0) {
    (function(t) {
        Ht = t
    }
    )(jt),
    Ot(new at("firestore", (t, {instanceIdentifier: s, options: i}) => {
        const r = t.getProvider("app").getImmediate()
          , o = new gi(new im(t.getProvider("auth-internal")),new cm(t.getProvider("app-check-internal")),function(a, c) {
            if (!Object.prototype.hasOwnProperty.apply(a.options, ["projectId"]))
                throw new y(d.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');
            return new Tn(a.options.projectId,c)
        }(r, s),r);
        return i = Object.assign({
            useFetchStreams: e
        }, i),
        o._setSettings(i),
        o
    }
    ,"PUBLIC").setMultipleInstances(!0)),
    qe(ma, "3.13.0", n),
    qe(ma, "3.13.0", "esm2017")
}
)();
const aw = {
    apiKey: "AIzaSyBDQ8xTd9T_pdDGVeuG-XDFtl2TwwBkzyc",
    authDomain: "cyclopedia-edu.firebaseapp.com",
    projectId: "cyclopedia-edu",
    storageBucket: "cyclopedia-edu.firebasestorage.app",
    messagingSenderId: "1060215261508",
    appId: "1:1060215261508:web:89176b35858d88ccfaaf11",
    measurementId: "G-46FB22ZVNX"
}
  , ph = uc(aw);
Wp(ph);
const gh = Fv(ph);
let Rt = localStorage.getItem("lang") || "ar"
  , mh = {};
document.addEventListener("DOMContentLoaded", async () => {
    await ko(Rt),
    mr(),
    Fs(Rt)
}
);
async function ko(n) {
    try {
        mh = await (await fetch(`/lang/${n}.json`)).json(),
        Rt = n,
        localStorage.setItem("lang", n),
        Fs(n)
    } catch (e) {
        console.error(`Failed to load language '${n}':`, e),
        n !== "ar" && (console.warn("Attempting to load default language 'ar' due to failure."),
        await ko("ar"))
    }
}
function cw(n) {
    return mh[n] || n
}
function mr() {
    document.querySelectorAll("[data-i18n]").forEach(n => {
        const e = n.getAttribute("data-i18n");
        n.innerText = cw(e)
    }
    )
}
function Fs(n) {
    const e = n === "ar" || n === "he" ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", n),
    document.documentElement.setAttribute("dir", e)
}
let St = null;
function uw(n) {
    Xn(),
    St = new Audio(n),
    St.play().catch(e => {
        console.warn("Audio playback failed:", e)
    }
    )
}
function Xn() {
    St && (St.pause(),
    St.currentTime = 0,
    St = null)
}
async function Do(n, e) {
    if (!n || !n.uid)
        return;
    const t = Lv(gh, "users", n.uid)
      , s = Date.now().toString()
      , i = {
        action: `تعرف على اسم في فئة ${e}`,
        category: e,
        timestamp: rw()
    };
    await nw(t, {
        points: ow(1),
        [`activityLog.${s}`]: i
    })
}
let ot = []
  , He = 0
  , et = null;
async function lw() {
    Xn();
    const n = document.querySelector("main.main-content")
      , e = document.getElementById("profession-sidebar-controls");
    if (!n || !e) {
        console.error("Main content area or profession sidebar not found.");
        return
    }
    n.innerHTML = `
    <div class="game-box">
      <h2 id="profession-name" class="item-main-name"></h2>
      <img id="profession-image" src="" alt="profession" />

      <div class="profession-description-box info-box" id="profession-description-box" style="display:none;">
        <h4>الوصف:</h4>
        <p id="profession-description">---</p>
      </div>
    </div>
  `;
    const t = document.getElementById("game-lang-select-profession");
    document.getElementById("voice-select-profession");
    const s = document.getElementById("play-sound-btn-profession")
      , i = document.getElementById("prev-profession-btn")
      , r = document.getElementById("next-profession-btn")
      , o = document.getElementById("toggle-description-btn-profession");
    if (await hw(t.value),
    ot.length === 0) {
        console.warn("No professions found for this language."),
        document.getElementById("profession-name").textContent = "لا توجد بيانات",
        document.getElementById("profession-description").textContent = "غير متوفر.",
        document.getElementById("profession-image").src = "/images/default.png",
        ec(!0);
        return
    }
    He = 0,
    No(),
    ec(!1),
    t.onchange = async () => {
        const a = t.value;
        await ko(a),
        mr(),
        Fs(a),
        await lw()
    }
    ,
    s && (s.onclick = () => {
        pw()
    }
    ),
    i && (i.onclick = () => {
        fw()
    }
    ),
    r && (r.onclick = () => {
        dw()
    }
    ),
    o && (o.onclick = () => {
        const a = document.getElementById("profession-description-box");
        a.style.display = a.style.display === "none" ? "block" : "none"
    }
    ),
    mr(),
    Fs(t.value)
}
function No() {
    var s;
    if (ot.length === 0)
        return;
    et = ot[He];
    const n = document.getElementById("profession-image")
      , e = document.getElementById("profession-name")
      , t = document.getElementById("profession-description");
    n.src = `/${et.image_path}`,
    n.alt = et.name[Rt],
    e.textContent = et.name[Rt] || "",
    t.textContent = ((s = et.description) == null ? void 0 : s[Rt]) || "لا يوجد وصف.",
    document.getElementById("prev-profession-btn").disabled = He === 0,
    document.getElementById("next-profession-btn").disabled = He === ot.length - 1,
    Xn()
}
async function hw() {
    try {
        const n = Mv(gh, "professions")
          , e = Yv(n);
        ot = (await tw(e)).docs.map(s => s.data())
    } catch (n) {
        console.error("Error fetching professions from Firestore:", n),
        ot = []
    }
}
function dw() {
    Xn(),
    He < ot.length - 1 && (He++,
    No(),
    Do(JSON.parse(localStorage.getItem("user")), "professions"))
}
function fw() {
    Xn(),
    He > 0 && (He--,
    No(),
    Do(JSON.parse(localStorage.getItem("user")), "professions"))
}
function pw() {
    var n, e;
    if (et) {
        const t = document.getElementById("voice-select-profession").value
          , s = document.getElementById("game-lang-select-profession").value
          , i = (e = (n = et.sound) == null ? void 0 : n[s]) == null ? void 0 : e[t];
        if (!i) {
            console.error("Audio not available for this profession/voice/lang");
            return
        }
        const r = `/${i}`;
        uw(r),
        Do(JSON.parse(localStorage.getItem("user")), "professions_audio")
    } else
        console.warn("No profession selected for audio playback.")
}
function ec(n) {
    ["play-sound-btn-profession", "prev-profession-btn", "next-profession-btn", "toggle-description-btn-profession", "game-lang-select-profession", "voice-select-profession"].forEach(e => {
        const t = document.getElementById(e);
        t && (t.disabled = n)
    }
    )
}
export {Yv as R, Mv as _, gw as a, nw as b, Rt as c, gh as d, tw as e, mr as f, Lv as g, Fs as h, lw as i, dw as j, fw as k, ko as l, pw as m, uw as p, Do as r, Xn as s};
//# sourceMappingURL=professions-game-a770cd30.js.map
