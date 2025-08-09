(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const Vm=()=>{};var dl={};/**
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
 */const Zu=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Nm=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],l=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},eh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,l=a?n[s+1]:0,h=s+2<n.length,d=h?n[s+2]:0,m=o>>2,_=(o&3)<<4|l>>4;let E=(l&15)<<2|d>>6,R=d&63;h||(R=64,a||(E=64)),r.push(t[m],t[_],t[E],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Zu(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Nm(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const _=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||l==null||d==null||_==null)throw new Dm;const E=o<<2|l>>4;if(r.push(E),d!==64){const R=l<<4&240|d>>2;if(r.push(R),_!==64){const P=d<<6&192|_;r.push(P)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Dm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Om=function(n){const e=Zu(n);return eh.encodeByteArray(e,!0)},ti=function(n){return Om(n).replace(/\./g,"")},th=function(n){try{return eh.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Lm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Mm=()=>Lm().__FIREBASE_DEFAULTS__,xm=()=>{if(typeof process>"u"||typeof dl>"u")return;const n=dl.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Fm=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&th(n[1]);return e&&JSON.parse(e)},Si=()=>{try{return Vm()||Mm()||xm()||Fm()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},nh=n=>Si()?.emulatorHosts?.[n],Bm=n=>{const e=nh(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},rh=()=>Si()?.config,sh=n=>Si()?.[`_${n}`];/**
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
 */class Um{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
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
 */function Qn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ih(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */function $m(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[ti(JSON.stringify(t)),ti(JSON.stringify(a)),""].join(".")}const Sr={};function qm(){const n={prod:[],emulator:[]};for(const e of Object.keys(Sr))Sr[e]?n.emulator.push(e):n.prod.push(e);return n}function jm(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let fl=!1;function oh(n,e){if(typeof window>"u"||typeof document>"u"||!Qn(window.location.host)||Sr[n]===e||Sr[n]||fl)return;Sr[n]=e;function t(E){return`__firebase__banner__${E}`}const r="__firebase__banner",o=qm().prod.length>0;function a(){const E=document.getElementById(r);E&&E.remove()}function l(E){E.style.display="flex",E.style.background="#7faaf0",E.style.position="fixed",E.style.bottom="5px",E.style.left="5px",E.style.padding=".5em",E.style.borderRadius="5px",E.style.alignItems="center"}function h(E,R){E.setAttribute("width","24"),E.setAttribute("id",R),E.setAttribute("height","24"),E.setAttribute("viewBox","0 0 24 24"),E.setAttribute("fill","none"),E.style.marginLeft="-6px"}function d(){const E=document.createElement("span");return E.style.cursor="pointer",E.style.marginLeft="16px",E.style.fontSize="24px",E.innerHTML=" &times;",E.onclick=()=>{fl=!0,a()},E}function m(E,R){E.setAttribute("id",R),E.innerText="Learn more",E.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",E.setAttribute("target","__blank"),E.style.paddingLeft="5px",E.style.textDecoration="underline"}function _(){const E=jm(r),R=t("text"),P=document.getElementById(R)||document.createElement("span"),O=t("learnmore"),V=document.getElementById(O)||document.createElement("a"),H=t("preprendIcon"),U=document.getElementById(H)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(E.created){const G=E.element;l(G),m(V,O);const ue=d();h(U,H),G.append(U,P,V,ue),document.body.appendChild(G)}o?(P.innerText="Preview backend disconnected.",U.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(U.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,P.innerText="Preview backend running in this workspace."),P.setAttribute("id",R)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",_):_()}/**
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
 */function be(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Hm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(be())}function zm(){const n=Si()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Gm(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Wm(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Km(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Qm(){const n=be();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Jm(){return!zm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Xm(){try{return typeof indexedDB=="object"}catch{return!1}}function Ym(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
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
 */const Zm="FirebaseError";class wt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Zm,Object.setPrototypeOf(this,wt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Jr.prototype.create)}}class Jr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?ep(o,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new wt(s,l,r)}}function ep(n,e){return n.replace(tp,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const tp=/\{\$([^}]+)}/g;function np(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function hn(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(ml(o)&&ml(a)){if(!hn(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function ml(n){return n!==null&&typeof n=="object"}/**
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
 */function Xr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function rp(n,e){const t=new sp(n,e);return t.subscribe.bind(t)}class sp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");ip(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=vo),s.error===void 0&&(s.error=vo),s.complete===void 0&&(s.complete=vo);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ip(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function vo(){}/**
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
 */function Pe(n){return n&&n._delegate?n._delegate:n}class dn{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const tn="[DEFAULT]";/**
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
 */class op{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Um;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(cp(e))try{this.getOrInitializeService({instanceIdentifier:tn})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=tn){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=tn){return this.instances.has(e)}getOptions(e=tn){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);r===l&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ap(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=tn){return this.component?this.component.multipleInstances?e:tn:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ap(n){return n===tn?void 0:n}function cp(n){return n.instantiationMode==="EAGER"}/**
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
 */class lp{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new op(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var $;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})($||($={}));const up={debug:$.DEBUG,verbose:$.VERBOSE,info:$.INFO,warn:$.WARN,error:$.ERROR,silent:$.SILENT},hp=$.INFO,dp={[$.DEBUG]:"log",[$.VERBOSE]:"log",[$.INFO]:"info",[$.WARN]:"warn",[$.ERROR]:"error"},fp=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=dp[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class fa{constructor(e){this.name=e,this._logLevel=hp,this._logHandler=fp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in $))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?up[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,$.DEBUG,...e),this._logHandler(this,$.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,$.VERBOSE,...e),this._logHandler(this,$.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,$.INFO,...e),this._logHandler(this,$.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,$.WARN,...e),this._logHandler(this,$.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,$.ERROR,...e),this._logHandler(this,$.ERROR,...e)}}const mp=(n,e)=>e.some(t=>n instanceof t);let pl,gl;function pp(){return pl||(pl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function gp(){return gl||(gl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ah=new WeakMap,Lo=new WeakMap,ch=new WeakMap,Io=new WeakMap,ma=new WeakMap;function yp(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(Mt(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&ah.set(t,n)}).catch(()=>{}),ma.set(e,n),e}function _p(n){if(Lo.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});Lo.set(n,e)}let Mo={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Lo.get(n);if(e==="objectStoreNames")return n.objectStoreNames||ch.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Mt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Ep(n){Mo=n(Mo)}function vp(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(To(this),e,...t);return ch.set(r,e.sort?e.sort():[e]),Mt(r)}:gp().includes(n)?function(...e){return n.apply(To(this),e),Mt(ah.get(this))}:function(...e){return Mt(n.apply(To(this),e))}}function Ip(n){return typeof n=="function"?vp(n):(n instanceof IDBTransaction&&_p(n),mp(n,pp())?new Proxy(n,Mo):n)}function Mt(n){if(n instanceof IDBRequest)return yp(n);if(Io.has(n))return Io.get(n);const e=Ip(n);return e!==n&&(Io.set(n,e),ma.set(e,n)),e}const To=n=>ma.get(n);function Tp(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),l=Mt(a);return r&&a.addEventListener("upgradeneeded",h=>{r(Mt(a.result),h.oldVersion,h.newVersion,Mt(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),l.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const wp=["get","getKey","getAll","getAllKeys","count"],Ap=["put","add","delete","clear"],wo=new Map;function yl(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(wo.get(e))return wo.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Ap.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||wp.includes(t)))return;const o=async function(a,...l){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),s&&h.done]))[0]};return wo.set(e,o),o}Ep(n=>({...n,get:(e,t,r)=>yl(e,t)||n.get(e,t,r),has:(e,t)=>!!yl(e,t)||n.has(e,t)}));/**
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
 */class bp{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Sp(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Sp(n){return n.getComponent()?.type==="VERSION"}const xo="@firebase/app",_l="0.14.1";/**
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
 */const _t=new fa("@firebase/app"),Cp="@firebase/app-compat",Rp="@firebase/analytics-compat",Pp="@firebase/analytics",kp="@firebase/app-check-compat",Vp="@firebase/app-check",Np="@firebase/auth",Dp="@firebase/auth-compat",Op="@firebase/database",Lp="@firebase/data-connect",Mp="@firebase/database-compat",xp="@firebase/functions",Fp="@firebase/functions-compat",Bp="@firebase/installations",Up="@firebase/installations-compat",$p="@firebase/messaging",qp="@firebase/messaging-compat",jp="@firebase/performance",Hp="@firebase/performance-compat",zp="@firebase/remote-config",Gp="@firebase/remote-config-compat",Wp="@firebase/storage",Kp="@firebase/storage-compat",Qp="@firebase/firestore",Jp="@firebase/ai",Xp="@firebase/firestore-compat",Yp="firebase",Zp="12.1.0";/**
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
 */const Fo="[DEFAULT]",eg={[xo]:"fire-core",[Cp]:"fire-core-compat",[Pp]:"fire-analytics",[Rp]:"fire-analytics-compat",[Vp]:"fire-app-check",[kp]:"fire-app-check-compat",[Np]:"fire-auth",[Dp]:"fire-auth-compat",[Op]:"fire-rtdb",[Lp]:"fire-data-connect",[Mp]:"fire-rtdb-compat",[xp]:"fire-fn",[Fp]:"fire-fn-compat",[Bp]:"fire-iid",[Up]:"fire-iid-compat",[$p]:"fire-fcm",[qp]:"fire-fcm-compat",[jp]:"fire-perf",[Hp]:"fire-perf-compat",[zp]:"fire-rc",[Gp]:"fire-rc-compat",[Wp]:"fire-gcs",[Kp]:"fire-gcs-compat",[Qp]:"fire-fst",[Xp]:"fire-fst-compat",[Jp]:"fire-vertex","fire-js":"fire-js",[Yp]:"fire-js-all"};/**
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
 */const ni=new Map,tg=new Map,Bo=new Map;function El(n,e){try{n.container.addComponent(e)}catch(t){_t.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Un(n){const e=n.name;if(Bo.has(e))return _t.debug(`There were multiple attempts to register component ${e}.`),!1;Bo.set(e,n);for(const t of ni.values())El(t,n);for(const t of tg.values())El(t,n);return!0}function pa(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Je(n){return n==null?!1:n.settings!==void 0}/**
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
 */const ng={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},xt=new Jr("app","Firebase",ng);/**
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
 */class rg{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new dn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw xt.create("app-deleted",{appName:this._name})}}/**
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
 */const Jn=Zp;function ga(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:Fo,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw xt.create("bad-app-name",{appName:String(s)});if(t||(t=rh()),!t)throw xt.create("no-options");const o=ni.get(s);if(o){if(hn(t,o.options)&&hn(r,o.config))return o;throw xt.create("duplicate-app",{appName:s})}const a=new lp(s);for(const h of Bo.values())a.addComponent(h);const l=new rg(t,r,a);return ni.set(s,l),l}function lh(n=Fo){const e=ni.get(n);if(!e&&n===Fo&&rh())return ga();if(!e)throw xt.create("no-app",{appName:n});return e}function Ft(n,e,t){let r=eg[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),_t.warn(a.join(" "));return}Un(new dn(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const sg="firebase-heartbeat-database",ig=1,Lr="firebase-heartbeat-store";let Ao=null;function uh(){return Ao||(Ao=Tp(sg,ig,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Lr)}catch(t){console.warn(t)}}}}).catch(n=>{throw xt.create("idb-open",{originalErrorMessage:n.message})})),Ao}async function og(n){try{const t=(await uh()).transaction(Lr),r=await t.objectStore(Lr).get(hh(n));return await t.done,r}catch(e){if(e instanceof wt)_t.warn(e.message);else{const t=xt.create("idb-get",{originalErrorMessage:e?.message});_t.warn(t.message)}}}async function vl(n,e){try{const r=(await uh()).transaction(Lr,"readwrite");await r.objectStore(Lr).put(e,hh(n)),await r.done}catch(t){if(t instanceof wt)_t.warn(t.message);else{const r=xt.create("idb-set",{originalErrorMessage:t?.message});_t.warn(r.message)}}}function hh(n){return`${n.name}!${n.options.appId}`}/**
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
 */const ag=1024,cg=30;class lg{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new hg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Il();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>cg){const s=dg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){_t.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Il(),{heartbeatsToSend:t,unsentEntries:r}=ug(this._heartbeatsCache.heartbeats),s=ti(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return _t.warn(e),""}}}function Il(){return new Date().toISOString().substring(0,10)}function ug(n,e=ag){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),Tl(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),Tl(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class hg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Xm()?Ym().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await og(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return vl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return vl(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Tl(n){return ti(JSON.stringify({version:2,heartbeats:n})).length}function dg(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
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
 */function fg(n){Un(new dn("platform-logger",e=>new bp(e),"PRIVATE")),Un(new dn("heartbeat",e=>new lg(e),"PRIVATE")),Ft(xo,_l,n),Ft(xo,_l,"esm2020"),Ft("fire-js","")}fg("");var mg="firebase",pg="12.1.0";/**
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
 */Ft(mg,pg,"app");function dh(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const gg=dh,fh=new Jr("auth","Firebase",dh());/**
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
 */const ri=new fa("@firebase/auth");function yg(n,...e){ri.logLevel<=$.WARN&&ri.warn(`Auth (${Jn}): ${n}`,...e)}function Ms(n,...e){ri.logLevel<=$.ERROR&&ri.error(`Auth (${Jn}): ${n}`,...e)}/**
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
 */function Et(n,...e){throw ya(n,...e)}function Ze(n,...e){return ya(n,...e)}function mh(n,e,t){const r={...gg(),[e]:t};return new Jr("auth","Firebase",r).create(e,{appName:n.name})}function sn(n){return mh(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function ya(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return fh.create(n,...e)}function x(n,e,...t){if(!n)throw ya(e,...t)}function dt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Ms(e),new Error(e)}function vt(n,e){n||dt(e)}/**
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
 */function Uo(){return typeof self<"u"&&self.location?.href||""}function _g(){return wl()==="http:"||wl()==="https:"}function wl(){return typeof self<"u"&&self.location?.protocol||null}/**
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
 */function Eg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(_g()||Wm()||"connection"in navigator)?navigator.onLine:!0}function vg(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Yr{constructor(e,t){this.shortDelay=e,this.longDelay=t,vt(t>e,"Short delay should be less than long delay!"),this.isMobile=Hm()||Km()}get(){return Eg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function _a(n,e){vt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class ph{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;dt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;dt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;dt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const Ig={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const Tg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],wg=new Yr(3e4,6e4);function Ea(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Xn(n,e,t,r,s={}){return gh(n,s,async()=>{let o={},a={};r&&(e==="GET"?a=r:o={body:JSON.stringify(r)});const l=Xr({key:n.config.apiKey,...a}).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const d={method:e,headers:h,...o};return Gm()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&Qn(n.emulatorConfig.host)&&(d.credentials="include"),ph.fetch()(await yh(n,n.config.apiHost,t,l),d)})}async function gh(n,e,t){n._canInitEmulator=!1;const r={...Ig,...e};try{const s=new bg(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw ks(n,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const l=o.ok?a.errorMessage:a.error.message,[h,d]=l.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw ks(n,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw ks(n,"email-already-in-use",a);if(h==="USER_DISABLED")throw ks(n,"user-disabled",a);const m=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw mh(n,m,d);Et(n,m)}}catch(s){if(s instanceof wt)throw s;Et(n,"network-request-failed",{message:String(s)})}}async function Ag(n,e,t,r,s={}){const o=await Xn(n,e,t,r,s);return"mfaPendingCredential"in o&&Et(n,"multi-factor-auth-required",{_serverResponse:o}),o}async function yh(n,e,t,r){const s=`${e}${t}?${r}`,o=n,a=o.config.emulator?_a(n.config,s):`${n.config.apiScheme}://${s}`;return Tg.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(a).toString():a}class bg{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Ze(this.auth,"network-request-failed")),wg.get())})}}function ks(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Ze(n,e,r);return s.customData._tokenResponse=t,s}/**
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
 */async function Sg(n,e){return Xn(n,"POST","/v1/accounts:delete",e)}async function si(n,e){return Xn(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function Cr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Cg(n,e=!1){const t=Pe(n),r=await t.getIdToken(e),s=va(r);x(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o?.sign_in_provider;return{claims:s,token:r,authTime:Cr(bo(s.auth_time)),issuedAtTime:Cr(bo(s.iat)),expirationTime:Cr(bo(s.exp)),signInProvider:a||null,signInSecondFactor:o?.sign_in_second_factor||null}}function bo(n){return Number(n)*1e3}function va(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ms("JWT malformed, contained fewer than 3 sections"),null;try{const s=th(t);return s?JSON.parse(s):(Ms("Failed to decode base64 JWT payload"),null)}catch(s){return Ms("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Al(n){const e=va(n);return x(e,"internal-error"),x(typeof e.exp<"u","internal-error"),x(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function Mr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof wt&&Rg(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Rg({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class Pg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class $o{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Cr(this.lastLoginAt),this.creationTime=Cr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function ii(n){const e=n.auth,t=await n.getIdToken(),r=await Mr(n,si(e,{idToken:t}));x(r?.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const o=s.providerUserInfo?.length?_h(s.providerUserInfo):[],a=Vg(n.providerData,o),l=n.isAnonymous,h=!(n.email&&s.passwordHash)&&!a?.length,d=l?h:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new $o(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(n,m)}async function kg(n){const e=Pe(n);await ii(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Vg(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function _h(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
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
 */async function Ng(n,e){const t=await gh(n,{},async()=>{const r=Xr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,a=await yh(n,s,"/v1/token",`key=${o}`),l=await n._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const h={method:"POST",headers:l,body:r};return n.emulatorConfig&&Qn(n.emulatorConfig.host)&&(h.credentials="include"),ph.fetch()(a,h)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Dg(n,e){return Xn(n,"POST","/v2/accounts:revokeToken",Ea(n,e))}/**
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
 */class Nn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){x(e.idToken,"internal-error"),x(typeof e.idToken<"u","internal-error"),x(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Al(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){x(e.length!==0,"internal-error");const t=Al(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(x(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:o}=await Ng(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:o}=t,a=new Nn;return r&&(x(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(x(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(x(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Nn,this.toJSON())}_performRefresh(){return dt("not implemented")}}/**
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
 */function Rt(n,e){x(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Ue{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new Pg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new $o(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Mr(this,this.stsTokenManager.getToken(this.auth,e));return x(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Cg(this,e)}reload(){return kg(this)}_assign(e){this!==e&&(x(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ue({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){x(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await ii(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Je(this.auth.app))return Promise.reject(sn(this.auth));const e=await this.getIdToken();return await Mr(this,Sg(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,o=t.phoneNumber??void 0,a=t.photoURL??void 0,l=t.tenantId??void 0,h=t._redirectEventId??void 0,d=t.createdAt??void 0,m=t.lastLoginAt??void 0,{uid:_,emailVerified:E,isAnonymous:R,providerData:P,stsTokenManager:O}=t;x(_&&O,e,"internal-error");const V=Nn.fromJSON(this.name,O);x(typeof _=="string",e,"internal-error"),Rt(r,e.name),Rt(s,e.name),x(typeof E=="boolean",e,"internal-error"),x(typeof R=="boolean",e,"internal-error"),Rt(o,e.name),Rt(a,e.name),Rt(l,e.name),Rt(h,e.name),Rt(d,e.name),Rt(m,e.name);const H=new Ue({uid:_,auth:e,email:s,emailVerified:E,displayName:r,isAnonymous:R,photoURL:a,phoneNumber:o,tenantId:l,stsTokenManager:V,createdAt:d,lastLoginAt:m});return P&&Array.isArray(P)&&(H.providerData=P.map(U=>({...U}))),h&&(H._redirectEventId=h),H}static async _fromIdTokenResponse(e,t,r=!1){const s=new Nn;s.updateFromServerResponse(t);const o=new Ue({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await ii(o),o}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];x(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?_h(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!o?.length,l=new Nn;l.updateFromIdToken(r);const h=new Ue({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new $o(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!o?.length};return Object.assign(h,d),h}}/**
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
 */const bl=new Map;function ft(n){vt(n instanceof Function,"Expected a class definition");let e=bl.get(n);return e?(vt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,bl.set(n,e),e)}/**
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
 */class Eh{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Eh.type="NONE";const Sl=Eh;/**
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
 */function xs(n,e,t){return`firebase:${n}:${e}:${t}`}class Dn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:o}=this.auth;this.fullUserKey=xs(this.userKey,s.apiKey,o),this.fullPersistenceKey=xs("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await si(this.auth,{idToken:e}).catch(()=>{});return t?Ue._fromGetAccountInfoResponse(this.auth,t,e):null}return Ue._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Dn(ft(Sl),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let o=s[0]||ft(Sl);const a=xs(r,e.config.apiKey,e.name);let l=null;for(const d of t)try{const m=await d._get(a);if(m){let _;if(typeof m=="string"){const E=await si(e,{idToken:m}).catch(()=>{});if(!E)break;_=await Ue._fromGetAccountInfoResponse(e,E,m)}else _=Ue._fromJSON(e,m);d!==o&&(l=_),o=d;break}}catch{}const h=s.filter(d=>d._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new Dn(o,e,r):(o=h[0],l&&await o._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==o)try{await d._remove(a)}catch{}})),new Dn(o,e,r))}}/**
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
 */function Cl(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(wh(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(vh(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(bh(e))return"Blackberry";if(Sh(e))return"Webos";if(Ih(e))return"Safari";if((e.includes("chrome/")||Th(e))&&!e.includes("edge/"))return"Chrome";if(Ah(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function vh(n=be()){return/firefox\//i.test(n)}function Ih(n=be()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Th(n=be()){return/crios\//i.test(n)}function wh(n=be()){return/iemobile/i.test(n)}function Ah(n=be()){return/android/i.test(n)}function bh(n=be()){return/blackberry/i.test(n)}function Sh(n=be()){return/webos/i.test(n)}function Ia(n=be()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Og(n=be()){return Ia(n)&&!!window.navigator?.standalone}function Lg(){return Qm()&&document.documentMode===10}function Ch(n=be()){return Ia(n)||Ah(n)||Sh(n)||bh(n)||/windows phone/i.test(n)||wh(n)}/**
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
 */function Rh(n,e=[]){let t;switch(n){case"Browser":t=Cl(be());break;case"Worker":t=`${Cl(be())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Jn}/${r}`}/**
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
 */class Mg{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=o=>new Promise((a,l)=>{try{const h=e(o);a(h)}catch(h){l(h)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
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
 */async function xg(n,e={}){return Xn(n,"GET","/v2/passwordPolicy",Ea(n,e))}/**
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
 */const Fg=6;class Bg{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Fg,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
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
 */class Ug{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Rl(this),this.idTokenSubscription=new Rl(this),this.beforeStateQueue=new Mg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=fh,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ft(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await Dn.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await si(this,{idToken:e}),r=await Ue._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Je(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=this.redirectUser?._redirectEventId,a=r?._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&l?.user&&(r=l.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return x(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await ii(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=vg()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Je(this.app))return Promise.reject(sn(this));const t=e?Pe(e):null;return t&&x(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&x(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Je(this.app)?Promise.reject(sn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Je(this.app)?Promise.reject(sn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ft(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await xg(this),t=new Bg(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Jr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Dg(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&ft(e)||this._popupRedirectResolver;x(t,this,"argument-error"),this.redirectPersistenceManager=await Dn.create(this,[ft(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(x(l,this,"internal-error"),l.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return x(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Rh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(Je(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&yg(`Error while retrieving App Check token: ${e.error}`),e?.token}}function Ta(n){return Pe(n)}class Rl{constructor(e){this.auth=e,this.observer=null,this.addObserver=rp(t=>this.observer=t)}get next(){return x(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let wa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function $g(n){wa=n}function qg(n){return wa.loadJS(n)}function jg(){return wa.gapiScript}function Hg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function zg(n,e){const t=pa(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),o=t.getOptions();if(hn(o,e??{}))return s;Et(s,"already-initialized")}return t.initialize({options:e})}function Gg(n,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(ft);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function Wg(n,e,t){const r=Ta(n);x(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,o=Ph(e),{host:a,port:l}=Kg(e),h=l===null?"":`:${l}`,d={url:`${o}//${a}${h}/`},m=Object.freeze({host:a,port:l,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){x(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),x(hn(d,r.config.emulator)&&hn(m,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=m,r.settings.appVerificationDisabledForTesting=!0,Qn(a)?(ih(`${o}//${a}${h}`),oh("Auth",!0)):Qg()}function Ph(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Kg(n){const e=Ph(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const o=s[1];return{host:o,port:Pl(r.substr(o.length+1))}}else{const[o,a]=r.split(":");return{host:o,port:Pl(a)}}}function Pl(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Qg(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class kh{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return dt("not implemented")}_getIdTokenResponse(e){return dt("not implemented")}_linkToIdToken(e,t){return dt("not implemented")}_getReauthenticationResolver(e){return dt("not implemented")}}/**
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
 */async function On(n,e){return Ag(n,"POST","/v1/accounts:signInWithIdp",Ea(n,e))}/**
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
 */const Jg="http://localhost";class fn extends kh{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new fn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Et("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...o}=t;if(!r||!s)return null;const a=new fn(r,s);return a.idToken=o.idToken||void 0,a.accessToken=o.accessToken||void 0,a.secret=o.secret,a.nonce=o.nonce,a.pendingToken=o.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return On(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,On(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,On(e,t)}buildRequest(){const e={requestUri:Jg,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Xr(t)}return e}}/**
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
 */class Vh{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class Zr extends Vh{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class Vt extends Zr{constructor(){super("facebook.com")}static credential(e){return fn._fromParams({providerId:Vt.PROVIDER_ID,signInMethod:Vt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Vt.credentialFromTaggedObject(e)}static credentialFromError(e){return Vt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Vt.credential(e.oauthAccessToken)}catch{return null}}}Vt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Vt.PROVIDER_ID="facebook.com";/**
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
 */class Nt extends Zr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return fn._fromParams({providerId:Nt.PROVIDER_ID,signInMethod:Nt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Nt.credentialFromTaggedObject(e)}static credentialFromError(e){return Nt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Nt.credential(t,r)}catch{return null}}}Nt.GOOGLE_SIGN_IN_METHOD="google.com";Nt.PROVIDER_ID="google.com";/**
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
 */class Dt extends Zr{constructor(){super("github.com")}static credential(e){return fn._fromParams({providerId:Dt.PROVIDER_ID,signInMethod:Dt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Dt.credentialFromTaggedObject(e)}static credentialFromError(e){return Dt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Dt.credential(e.oauthAccessToken)}catch{return null}}}Dt.GITHUB_SIGN_IN_METHOD="github.com";Dt.PROVIDER_ID="github.com";/**
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
 */class Ot extends Zr{constructor(){super("twitter.com")}static credential(e,t){return fn._fromParams({providerId:Ot.PROVIDER_ID,signInMethod:Ot.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Ot.credentialFromTaggedObject(e)}static credentialFromError(e){return Ot.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Ot.credential(t,r)}catch{return null}}}Ot.TWITTER_SIGN_IN_METHOD="twitter.com";Ot.PROVIDER_ID="twitter.com";/**
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
 */class $n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const o=await Ue._fromIdTokenResponse(e,r,s),a=kl(r);return new $n({user:o,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=kl(r);return new $n({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function kl(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class oi extends wt{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,oi.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new oi(e,t,r,s)}}function Nh(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?oi._fromErrorAndOperation(n,o,e,r):o})}async function Xg(n,e,t=!1){const r=await Mr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return $n._forOperation(n,"link",r)}/**
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
 */async function Yg(n,e,t=!1){const{auth:r}=n;if(Je(r.app))return Promise.reject(sn(r));const s="reauthenticate";try{const o=await Mr(n,Nh(r,s,e,n),t);x(o.idToken,r,"internal-error");const a=va(o.idToken);x(a,r,"internal-error");const{sub:l}=a;return x(n.uid===l,r,"user-mismatch"),$n._forOperation(n,s,o)}catch(o){throw o?.code==="auth/user-not-found"&&Et(r,"user-mismatch"),o}}/**
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
 */async function Zg(n,e,t=!1){if(Je(n.app))return Promise.reject(sn(n));const r="signIn",s=await Nh(n,r,e),o=await $n._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}function ey(n,e,t,r){return Pe(n).onIdTokenChanged(e,t,r)}function ty(n,e,t){return Pe(n).beforeAuthStateChanged(e,t)}const ai="__sak";/**
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
 */class Dh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ai,"1"),this.storage.removeItem(ai),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const ny=1e3,ry=10;class Oh extends Dh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Ch(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,h)=>{this.notifyListeners(a,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},o=this.storage.getItem(r);Lg()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,ry):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},ny)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Oh.type="LOCAL";const sy=Oh;/**
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
 */class Lh extends Dh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Lh.type="SESSION";const Mh=Lh;/**
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
 */function iy(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Ci{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Ci(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:o}=t.data,a=this.handlersMap[s];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(t.origin,o)),h=await iy(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ci.receivers=[];/**
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
 */function Aa(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class oy{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,a;return new Promise((l,h)=>{const d=Aa("",20);s.port1.start();const m=setTimeout(()=>{h(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(_){const E=_;if(E.data.eventId===d)switch(E.data.status){case"ack":clearTimeout(m),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),l(E.data.response);break;default:clearTimeout(m),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function et(){return window}function ay(n){et().location.href=n}/**
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
 */function xh(){return typeof et().WorkerGlobalScope<"u"&&typeof et().importScripts=="function"}async function cy(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ly(){return navigator?.serviceWorker?.controller||null}function uy(){return xh()?self:null}/**
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
 */const Fh="firebaseLocalStorageDb",hy=1,ci="firebaseLocalStorage",Bh="fbase_key";class es{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ri(n,e){return n.transaction([ci],e?"readwrite":"readonly").objectStore(ci)}function dy(){const n=indexedDB.deleteDatabase(Fh);return new es(n).toPromise()}function qo(){const n=indexedDB.open(Fh,hy);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(ci,{keyPath:Bh})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(ci)?e(r):(r.close(),await dy(),e(await qo()))})})}async function Vl(n,e,t){const r=Ri(n,!0).put({[Bh]:e,value:t});return new es(r).toPromise()}async function fy(n,e){const t=Ri(n,!1).get(e),r=await new es(t).toPromise();return r===void 0?null:r.value}function Nl(n,e){const t=Ri(n,!0).delete(e);return new es(t).toPromise()}const my=800,py=3;class Uh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await qo(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>py)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return xh()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ci._getInstance(uy()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await cy(),!this.activeServiceWorker)return;this.sender=new oy(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ly()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await qo();return await Vl(e,ai,"1"),await Nl(e,ai),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Vl(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>fy(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Nl(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const o=Ri(s,!1).getAll();return new es(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),my)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Uh.type="LOCAL";const gy=Uh;new Yr(3e4,6e4);/**
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
 */function yy(n,e){return e?ft(e):(x(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class ba extends kh{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return On(e,this._buildIdpRequest())}_linkToIdToken(e,t){return On(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return On(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function _y(n){return Zg(n.auth,new ba(n),n.bypassAuthState)}function Ey(n){const{auth:e,user:t}=n;return x(t,e,"internal-error"),Yg(t,new ba(n),n.bypassAuthState)}async function vy(n){const{auth:e,user:t}=n;return x(t,e,"internal-error"),Xg(t,new ba(n),n.bypassAuthState)}/**
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
 */class $h{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:a,type:l}=e;if(a){this.reject(a);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(h))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _y;case"linkViaPopup":case"linkViaRedirect":return vy;case"reauthViaPopup":case"reauthViaRedirect":return Ey;default:Et(this.auth,"internal-error")}}resolve(e){vt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){vt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const Iy=new Yr(2e3,1e4);class Pn extends $h{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,Pn.currentPopupAction&&Pn.currentPopupAction.cancel(),Pn.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return x(e,this.auth,"internal-error"),e}async onExecution(){vt(this.filter.length===1,"Popup operations only handle one event");const e=Aa();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Ze(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(Ze(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Pn.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ze(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Iy.get())};e()}}Pn.currentPopupAction=null;/**
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
 */const Ty="pendingRedirect",Fs=new Map;class wy extends $h{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Fs.get(this.auth._key());if(!e){try{const r=await Ay(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Fs.set(this.auth._key(),e)}return this.bypassAuthState||Fs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ay(n,e){const t=Cy(e),r=Sy(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function by(n,e){Fs.set(n._key(),e)}function Sy(n){return ft(n._redirectPersistence)}function Cy(n){return xs(Ty,n.config.apiKey,n.name)}async function Ry(n,e,t=!1){if(Je(n.app))return Promise.reject(sn(n));const r=Ta(n),s=yy(r,e),a=await new wy(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const Py=600*1e3;class ky{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Vy(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!qh(e)){const r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(Ze(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Py&&this.cachedEventUids.clear(),this.cachedEventUids.has(Dl(e))}saveEventToCache(e){this.cachedEventUids.add(Dl(e)),this.lastProcessedEventTime=Date.now()}}function Dl(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function qh({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Vy(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return qh(n);default:return!1}}/**
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
 */async function Ny(n,e={}){return Xn(n,"GET","/v1/projects",e)}/**
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
 */const Dy=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Oy=/^https?/;async function Ly(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Ny(n);for(const t of e)try{if(My(t))return}catch{}Et(n,"unauthorized-domain")}function My(n){const e=Uo(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!Oy.test(t))return!1;if(Dy.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
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
 */const xy=new Yr(3e4,6e4);function Ol(){const n=et().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Fy(n){return new Promise((e,t)=>{function r(){Ol(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Ol(),t(Ze(n,"network-request-failed"))},timeout:xy.get()})}if(et().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(et().gapi?.load)r();else{const s=Hg("iframefcb");return et()[s]=()=>{gapi.load?r():t(Ze(n,"network-request-failed"))},qg(`${jg()}?onload=${s}`).catch(o=>t(o))}}).catch(e=>{throw Bs=null,e})}let Bs=null;function By(n){return Bs=Bs||Fy(n),Bs}/**
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
 */const Uy=new Yr(5e3,15e3),$y="__/auth/iframe",qy="emulator/auth/iframe",jy={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Hy=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function zy(n){const e=n.config;x(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?_a(e,qy):`https://${n.config.authDomain}/${$y}`,r={apiKey:e.apiKey,appName:n.name,v:Jn},s=Hy.get(n.config.apiHost);s&&(r.eid=s);const o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${Xr(r).slice(1)}`}async function Gy(n){const e=await By(n),t=et().gapi;return x(t,n,"internal-error"),e.open({where:document.body,url:zy(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:jy,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});const a=Ze(n,"network-request-failed"),l=et().setTimeout(()=>{o(a)},Uy.get());function h(){et().clearTimeout(l),s(r)}r.ping(h).then(h,()=>{o(a)})}))}/**
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
 */const Wy={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Ky=500,Qy=600,Jy="_blank",Xy="http://localhost";class Ll{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Yy(n,e,t,r=Ky,s=Qy){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const h={...Wy,width:r.toString(),height:s.toString(),top:o,left:a},d=be().toLowerCase();t&&(l=Th(d)?Jy:t),vh(d)&&(e=e||Xy,h.scrollbars="yes");const m=Object.entries(h).reduce((E,[R,P])=>`${E}${R}=${P},`,"");if(Og(d)&&l!=="_self")return Zy(e||"",l),new Ll(null);const _=window.open(e||"",l,m);x(_,n,"popup-blocked");try{_.focus()}catch{}return new Ll(_)}function Zy(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const e_="__/auth/handler",t_="emulator/auth/handler",n_=encodeURIComponent("fac");async function Ml(n,e,t,r,s,o){x(n.config.authDomain,n,"auth-domain-config-required"),x(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Jn,eventId:s};if(e instanceof Vh){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",np(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[m,_]of Object.entries({}))a[m]=_}if(e instanceof Zr){const m=e.getScopes().filter(_=>_!=="");m.length>0&&(a.scopes=m.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const m of Object.keys(l))l[m]===void 0&&delete l[m];const h=await n._getAppCheckToken(),d=h?`#${n_}=${encodeURIComponent(h)}`:"";return`${r_(n)}?${Xr(l).slice(1)}${d}`}function r_({config:n}){return n.emulator?_a(n,t_):`https://${n.authDomain}/${e_}`}/**
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
 */const So="webStorageSupport";class s_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Mh,this._completeRedirectFn=Ry,this._overrideRedirectResult=by}async _openPopup(e,t,r,s){vt(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const o=await Ml(e,t,r,Uo(),s);return Yy(e,o,Aa())}async _openRedirect(e,t,r,s){await this._originValidation(e);const o=await Ml(e,t,r,Uo(),s);return ay(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):(vt(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Gy(e),r=new ky(e);return t.register("authEvent",s=>(x(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(So,{type:So},s=>{const o=s?.[0]?.[So];o!==void 0&&t(!!o),Et(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Ly(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Ch()||Ih()||Ia()}}const i_=s_;var xl="@firebase/auth",Fl="1.11.0";/**
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
 */class o_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){x(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function a_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function c_(n){Un(new dn("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;x(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Rh(n)},d=new Ug(r,s,o,h);return Gg(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Un(new dn("auth-internal",e=>{const t=Ta(e.getProvider("auth").getImmediate());return(r=>new o_(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ft(xl,Fl,a_(n)),Ft(xl,Fl,"esm2020")}/**
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
 */const l_=300,u_=sh("authIdTokenMaxAge")||l_;let Bl=null;const h_=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>u_)return;const s=t?.token;Bl!==s&&(Bl=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function jh(n=lh()){const e=pa(n,"auth");if(e.isInitialized())return e.getImmediate();const t=zg(n,{popupRedirectResolver:i_,persistence:[gy,sy,Mh]}),r=sh("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const a=h_(o.toString());ty(t,a,()=>a(t.currentUser)),ey(t,l=>a(l))}}const s=nh("auth");return s&&Wg(t,`http://${s}`),t}function d_(){return document.getElementsByTagName("head")?.[0]??document}$g({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const o=Ze("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",d_().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});c_("Browser");var Ul=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Bt,Hh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,p){function y(){}y.prototype=p.prototype,T.D=p.prototype,T.prototype=new y,T.prototype.constructor=T,T.C=function(v,I,A){for(var g=Array(arguments.length-2),ct=2;ct<arguments.length;ct++)g[ct-2]=arguments[ct];return p.prototype[I].apply(v,g)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,p,y){y||(y=0);var v=Array(16);if(typeof p=="string")for(var I=0;16>I;++I)v[I]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(I=0;16>I;++I)v[I]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=T.g[0],y=T.g[1],I=T.g[2];var A=T.g[3],g=p+(A^y&(I^A))+v[0]+3614090360&4294967295;p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+v[1]+3905402710&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+v[2]+606105819&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+v[3]+3250441966&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(A^y&(I^A))+v[4]+4118548399&4294967295,p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+v[5]+1200080426&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+v[6]+2821735955&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+v[7]+4249261313&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(A^y&(I^A))+v[8]+1770035416&4294967295,p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+v[9]+2336552879&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+v[10]+4294925233&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+v[11]+2304563134&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(A^y&(I^A))+v[12]+1804603682&4294967295,p=y+(g<<7&4294967295|g>>>25),g=A+(I^p&(y^I))+v[13]+4254626195&4294967295,A=p+(g<<12&4294967295|g>>>20),g=I+(y^A&(p^y))+v[14]+2792965006&4294967295,I=A+(g<<17&4294967295|g>>>15),g=y+(p^I&(A^p))+v[15]+1236535329&4294967295,y=I+(g<<22&4294967295|g>>>10),g=p+(I^A&(y^I))+v[1]+4129170786&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+v[6]+3225465664&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+v[11]+643717713&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+v[0]+3921069994&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^A&(y^I))+v[5]+3593408605&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+v[10]+38016083&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+v[15]+3634488961&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+v[4]+3889429448&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^A&(y^I))+v[9]+568446438&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+v[14]+3275163606&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+v[3]+4107603335&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+v[8]+1163531501&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(I^A&(y^I))+v[13]+2850285829&4294967295,p=y+(g<<5&4294967295|g>>>27),g=A+(y^I&(p^y))+v[2]+4243563512&4294967295,A=p+(g<<9&4294967295|g>>>23),g=I+(p^y&(A^p))+v[7]+1735328473&4294967295,I=A+(g<<14&4294967295|g>>>18),g=y+(A^p&(I^A))+v[12]+2368359562&4294967295,y=I+(g<<20&4294967295|g>>>12),g=p+(y^I^A)+v[5]+4294588738&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+v[8]+2272392833&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+v[11]+1839030562&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+v[14]+4259657740&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^A)+v[1]+2763975236&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+v[4]+1272893353&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+v[7]+4139469664&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+v[10]+3200236656&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^A)+v[13]+681279174&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+v[0]+3936430074&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+v[3]+3572445317&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+v[6]+76029189&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(y^I^A)+v[9]+3654602809&4294967295,p=y+(g<<4&4294967295|g>>>28),g=A+(p^y^I)+v[12]+3873151461&4294967295,A=p+(g<<11&4294967295|g>>>21),g=I+(A^p^y)+v[15]+530742520&4294967295,I=A+(g<<16&4294967295|g>>>16),g=y+(I^A^p)+v[2]+3299628645&4294967295,y=I+(g<<23&4294967295|g>>>9),g=p+(I^(y|~A))+v[0]+4096336452&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+v[7]+1126891415&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+v[14]+2878612391&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+v[5]+4237533241&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~A))+v[12]+1700485571&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+v[3]+2399980690&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+v[10]+4293915773&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+v[1]+2240044497&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~A))+v[8]+1873313359&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+v[15]+4264355552&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+v[6]+2734768916&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+v[13]+1309151649&4294967295,y=I+(g<<21&4294967295|g>>>11),g=p+(I^(y|~A))+v[4]+4149444226&4294967295,p=y+(g<<6&4294967295|g>>>26),g=A+(y^(p|~I))+v[11]+3174756917&4294967295,A=p+(g<<10&4294967295|g>>>22),g=I+(p^(A|~y))+v[2]+718787259&4294967295,I=A+(g<<15&4294967295|g>>>17),g=y+(A^(I|~p))+v[9]+3951481745&4294967295,T.g[0]=T.g[0]+p&4294967295,T.g[1]=T.g[1]+(I+(g<<21&4294967295|g>>>11))&4294967295,T.g[2]=T.g[2]+I&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.u=function(T,p){p===void 0&&(p=T.length);for(var y=p-this.blockSize,v=this.B,I=this.h,A=0;A<p;){if(I==0)for(;A<=y;)s(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<p;)if(v[I++]=T.charCodeAt(A++),I==this.blockSize){s(this,v),I=0;break}}else for(;A<p;)if(v[I++]=T[A++],I==this.blockSize){s(this,v),I=0;break}}this.h=I,this.o+=p},r.prototype.v=function(){var T=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);T[0]=128;for(var p=1;p<T.length-8;++p)T[p]=0;var y=8*this.o;for(p=T.length-8;p<T.length;++p)T[p]=y&255,y/=256;for(this.u(T),T=Array(16),p=y=0;4>p;++p)for(var v=0;32>v;v+=8)T[y++]=this.g[p]>>>v&255;return T};function o(T,p){var y=l;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=p(T)}function a(T,p){this.h=p;for(var y=[],v=!0,I=T.length-1;0<=I;I--){var A=T[I]|0;v&&A==p||(y[I]=A,v=!1)}this.g=y}var l={};function h(T){return-128<=T&&128>T?o(T,function(p){return new a([p|0],0>p?-1:0)}):new a([T|0],0>T?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return _;if(0>T)return V(d(-T));for(var p=[],y=1,v=0;T>=y;v++)p[v]=T/y|0,y*=4294967296;return new a(p,0)}function m(T,p){if(T.length==0)throw Error("number format error: empty string");if(p=p||10,2>p||36<p)throw Error("radix out of range: "+p);if(T.charAt(0)=="-")return V(m(T.substring(1),p));if(0<=T.indexOf("-"))throw Error('number format error: interior "-" character');for(var y=d(Math.pow(p,8)),v=_,I=0;I<T.length;I+=8){var A=Math.min(8,T.length-I),g=parseInt(T.substring(I,I+A),p);8>A?(A=d(Math.pow(p,A)),v=v.j(A).add(d(g))):(v=v.j(y),v=v.add(d(g)))}return v}var _=h(0),E=h(1),R=h(16777216);n=a.prototype,n.m=function(){if(O(this))return-V(this).m();for(var T=0,p=1,y=0;y<this.g.length;y++){var v=this.i(y);T+=(0<=v?v:4294967296+v)*p,p*=4294967296}return T},n.toString=function(T){if(T=T||10,2>T||36<T)throw Error("radix out of range: "+T);if(P(this))return"0";if(O(this))return"-"+V(this).toString(T);for(var p=d(Math.pow(T,6)),y=this,v="";;){var I=ue(y,p).g;y=H(y,I.j(p));var A=((0<y.g.length?y.g[0]:y.h)>>>0).toString(T);if(y=I,P(y))return A+v;for(;6>A.length;)A="0"+A;v=A+v}},n.i=function(T){return 0>T?0:T<this.g.length?this.g[T]:this.h};function P(T){if(T.h!=0)return!1;for(var p=0;p<T.g.length;p++)if(T.g[p]!=0)return!1;return!0}function O(T){return T.h==-1}n.l=function(T){return T=H(this,T),O(T)?-1:P(T)?0:1};function V(T){for(var p=T.g.length,y=[],v=0;v<p;v++)y[v]=~T.g[v];return new a(y,~T.h).add(E)}n.abs=function(){return O(this)?V(this):this},n.add=function(T){for(var p=Math.max(this.g.length,T.g.length),y=[],v=0,I=0;I<=p;I++){var A=v+(this.i(I)&65535)+(T.i(I)&65535),g=(A>>>16)+(this.i(I)>>>16)+(T.i(I)>>>16);v=g>>>16,A&=65535,g&=65535,y[I]=g<<16|A}return new a(y,y[y.length-1]&-2147483648?-1:0)};function H(T,p){return T.add(V(p))}n.j=function(T){if(P(this)||P(T))return _;if(O(this))return O(T)?V(this).j(V(T)):V(V(this).j(T));if(O(T))return V(this.j(V(T)));if(0>this.l(R)&&0>T.l(R))return d(this.m()*T.m());for(var p=this.g.length+T.g.length,y=[],v=0;v<2*p;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(var I=0;I<T.g.length;I++){var A=this.i(v)>>>16,g=this.i(v)&65535,ct=T.i(I)>>>16,sr=T.i(I)&65535;y[2*v+2*I]+=g*sr,U(y,2*v+2*I),y[2*v+2*I+1]+=A*sr,U(y,2*v+2*I+1),y[2*v+2*I+1]+=g*ct,U(y,2*v+2*I+1),y[2*v+2*I+2]+=A*ct,U(y,2*v+2*I+2)}for(v=0;v<p;v++)y[v]=y[2*v+1]<<16|y[2*v];for(v=p;v<2*p;v++)y[v]=0;return new a(y,0)};function U(T,p){for(;(T[p]&65535)!=T[p];)T[p+1]+=T[p]>>>16,T[p]&=65535,p++}function G(T,p){this.g=T,this.h=p}function ue(T,p){if(P(p))throw Error("division by zero");if(P(T))return new G(_,_);if(O(T))return p=ue(V(T),p),new G(V(p.g),V(p.h));if(O(p))return p=ue(T,V(p)),new G(V(p.g),p.h);if(30<T.g.length){if(O(T)||O(p))throw Error("slowDivide_ only works with positive integers.");for(var y=E,v=p;0>=v.l(T);)y=Ke(y),v=Ke(v);var I=ge(y,1),A=ge(v,1);for(v=ge(v,2),y=ge(y,2);!P(v);){var g=A.add(v);0>=g.l(T)&&(I=I.add(y),A=g),v=ge(v,1),y=ge(y,1)}return p=H(T,I.j(p)),new G(I,p)}for(I=_;0<=T.l(p);){for(y=Math.max(1,Math.floor(T.m()/p.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=48>=v?1:Math.pow(2,v-48),A=d(y),g=A.j(p);O(g)||0<g.l(T);)y-=v,A=d(y),g=A.j(p);P(A)&&(A=E),I=I.add(A),T=H(T,g)}return new G(I,T)}n.A=function(T){return ue(this,T).h},n.and=function(T){for(var p=Math.max(this.g.length,T.g.length),y=[],v=0;v<p;v++)y[v]=this.i(v)&T.i(v);return new a(y,this.h&T.h)},n.or=function(T){for(var p=Math.max(this.g.length,T.g.length),y=[],v=0;v<p;v++)y[v]=this.i(v)|T.i(v);return new a(y,this.h|T.h)},n.xor=function(T){for(var p=Math.max(this.g.length,T.g.length),y=[],v=0;v<p;v++)y[v]=this.i(v)^T.i(v);return new a(y,this.h^T.h)};function Ke(T){for(var p=T.g.length+1,y=[],v=0;v<p;v++)y[v]=T.i(v)<<1|T.i(v-1)>>>31;return new a(y,T.h)}function ge(T,p){var y=p>>5;p%=32;for(var v=T.g.length-y,I=[],A=0;A<v;A++)I[A]=0<p?T.i(A+y)>>>p|T.i(A+y+1)<<32-p:T.i(A+y);return new a(I,T.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Hh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=m,Bt=a}).apply(typeof Ul<"u"?Ul:typeof self<"u"?self:typeof window<"u"?window:{});var Vs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var zh,Ir,Gh,Us,jo,Wh,Kh,Qh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(i,c,u){return i==Array.prototype||i==Object.prototype||(i[c]=u.value),i};function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof Vs=="object"&&Vs];for(var c=0;c<i.length;++c){var u=i[c];if(u&&u.Math==Math)return u}throw Error("Cannot find global object")}var r=t(this);function s(i,c){if(c)e:{var u=r;i=i.split(".");for(var f=0;f<i.length-1;f++){var w=i[f];if(!(w in u))break e;u=u[w]}i=i[i.length-1],f=u[i],c=c(f),c!=f&&c!=null&&e(u,i,{configurable:!0,writable:!0,value:c})}}function o(i,c){i instanceof String&&(i+="");var u=0,f=!1,w={next:function(){if(!f&&u<i.length){var b=u++;return{value:c(b,i[b]),done:!1}}return f=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}s("Array.prototype.values",function(i){return i||function(){return o(this,function(c,u){return u})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},l=this||self;function h(i){var c=typeof i;return c=c!="object"?c:i?Array.isArray(i)?"array":c:"null",c=="array"||c=="object"&&typeof i.length=="number"}function d(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function m(i,c,u){return i.call.apply(i.bind,arguments)}function _(i,c,u){if(!i)throw Error();if(2<arguments.length){var f=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,f),i.apply(c,w)}}return function(){return i.apply(c,arguments)}}function E(i,c,u){return E=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?m:_,E.apply(null,arguments)}function R(i,c){var u=Array.prototype.slice.call(arguments,1);return function(){var f=u.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function P(i,c){function u(){}u.prototype=c.prototype,i.aa=c.prototype,i.prototype=new u,i.prototype.constructor=i,i.Qb=function(f,w,b){for(var k=Array(arguments.length-2),J=2;J<arguments.length;J++)k[J-2]=arguments[J];return c.prototype[w].apply(f,k)}}function O(i){const c=i.length;if(0<c){const u=Array(c);for(let f=0;f<c;f++)u[f]=i[f];return u}return[]}function V(i,c){for(let u=1;u<arguments.length;u++){const f=arguments[u];if(h(f)){const w=i.length||0,b=f.length||0;i.length=w+b;for(let k=0;k<b;k++)i[w+k]=f[k]}else i.push(f)}}class H{constructor(c,u){this.i=c,this.j=u,this.h=0,this.g=null}get(){let c;return 0<this.h?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function U(i){return/^[\s\xa0]*$/.test(i)}function G(){var i=l.navigator;return i&&(i=i.userAgent)?i:""}function ue(i){return ue[" "](i),i}ue[" "]=function(){};var Ke=G().indexOf("Gecko")!=-1&&!(G().toLowerCase().indexOf("webkit")!=-1&&G().indexOf("Edge")==-1)&&!(G().indexOf("Trident")!=-1||G().indexOf("MSIE")!=-1)&&G().indexOf("Edge")==-1;function ge(i,c,u){for(const f in i)c.call(u,i[f],f,i)}function T(i,c){for(const u in i)c.call(void 0,i[u],u,i)}function p(i){const c={};for(const u in i)c[u]=i[u];return c}const y="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function v(i,c){let u,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(u in f)i[u]=f[u];for(let b=0;b<y.length;b++)u=y[b],Object.prototype.hasOwnProperty.call(f,u)&&(i[u]=f[u])}}function I(i){var c=1;i=i.split(":");const u=[];for(;0<c&&i.length;)u.push(i.shift()),c--;return i.length&&u.push(i.join(":")),u}function A(i){l.setTimeout(()=>{throw i},0)}function g(){var i=Qi;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class ct{constructor(){this.h=this.g=null}add(c,u){const f=sr.get();f.set(c,u),this.h?this.h.next=f:this.g=f,this.h=f}}var sr=new H(()=>new Jf,i=>i.reset());class Jf{constructor(){this.next=this.g=this.h=null}set(c,u){this.h=c,this.g=u,this.next=null}reset(){this.next=this.g=this.h=null}}let ir,or=!1,Qi=new ct,dc=()=>{const i=l.Promise.resolve(void 0);ir=()=>{i.then(Xf)}};var Xf=()=>{for(var i;i=g();){try{i.h.call(i.g)}catch(u){A(u)}var c=sr;c.j(i),100>c.h&&(c.h++,i.next=c.g,c.g=i)}or=!1};function At(){this.s=this.s,this.C=this.C}At.prototype.s=!1,At.prototype.ma=function(){this.s||(this.s=!0,this.N())},At.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ye(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}ye.prototype.h=function(){this.defaultPrevented=!0};var Yf=function(){if(!l.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const u=()=>{};l.addEventListener("test",u,c),l.removeEventListener("test",u,c)}catch{}return i}();function ar(i,c){if(ye.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i){var u=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;if(this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget){if(Ke){e:{try{ue(c.nodeName);var w=!0;break e}catch{}w=!1}w||(c=null)}}else u=="mouseover"?c=i.fromElement:u=="mouseout"&&(c=i.toElement);this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=typeof i.pointerType=="string"?i.pointerType:Zf[i.pointerType]||"",this.state=i.state,this.i=i,i.defaultPrevented&&ar.aa.h.call(this)}}P(ar,ye);var Zf={2:"touch",3:"pen",4:"mouse"};ar.prototype.h=function(){ar.aa.h.call(this);var i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var hs="closure_listenable_"+(1e6*Math.random()|0),em=0;function tm(i,c,u,f,w){this.listener=i,this.proxy=null,this.src=c,this.type=u,this.capture=!!f,this.ha=w,this.key=++em,this.da=this.fa=!1}function ds(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function fs(i){this.src=i,this.g={},this.h=0}fs.prototype.add=function(i,c,u,f,w){var b=i.toString();i=this.g[b],i||(i=this.g[b]=[],this.h++);var k=Xi(i,c,f,w);return-1<k?(c=i[k],u||(c.fa=!1)):(c=new tm(c,this.src,b,!!f,w),c.fa=u,i.push(c)),c};function Ji(i,c){var u=c.type;if(u in i.g){var f=i.g[u],w=Array.prototype.indexOf.call(f,c,void 0),b;(b=0<=w)&&Array.prototype.splice.call(f,w,1),b&&(ds(c),i.g[u].length==0&&(delete i.g[u],i.h--))}}function Xi(i,c,u,f){for(var w=0;w<i.length;++w){var b=i[w];if(!b.da&&b.listener==c&&b.capture==!!u&&b.ha==f)return w}return-1}var Yi="closure_lm_"+(1e6*Math.random()|0),Zi={};function fc(i,c,u,f,w){if(Array.isArray(c)){for(var b=0;b<c.length;b++)fc(i,c[b],u,f,w);return null}return u=gc(u),i&&i[hs]?i.K(c,u,d(f)?!!f.capture:!1,w):nm(i,c,u,!1,f,w)}function nm(i,c,u,f,w,b){if(!c)throw Error("Invalid event type");var k=d(w)?!!w.capture:!!w,J=to(i);if(J||(i[Yi]=J=new fs(i)),u=J.add(c,u,f,k,b),u.proxy)return u;if(f=rm(),u.proxy=f,f.src=i,f.listener=u,i.addEventListener)Yf||(w=k),w===void 0&&(w=!1),i.addEventListener(c.toString(),f,w);else if(i.attachEvent)i.attachEvent(pc(c.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return u}function rm(){function i(u){return c.call(i.src,i.listener,u)}const c=sm;return i}function mc(i,c,u,f,w){if(Array.isArray(c))for(var b=0;b<c.length;b++)mc(i,c[b],u,f,w);else f=d(f)?!!f.capture:!!f,u=gc(u),i&&i[hs]?(i=i.i,c=String(c).toString(),c in i.g&&(b=i.g[c],u=Xi(b,u,f,w),-1<u&&(ds(b[u]),Array.prototype.splice.call(b,u,1),b.length==0&&(delete i.g[c],i.h--)))):i&&(i=to(i))&&(c=i.g[c.toString()],i=-1,c&&(i=Xi(c,u,f,w)),(u=-1<i?c[i]:null)&&eo(u))}function eo(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[hs])Ji(c.i,i);else{var u=i.type,f=i.proxy;c.removeEventListener?c.removeEventListener(u,f,i.capture):c.detachEvent?c.detachEvent(pc(u),f):c.addListener&&c.removeListener&&c.removeListener(f),(u=to(c))?(Ji(u,i),u.h==0&&(u.src=null,c[Yi]=null)):ds(i)}}}function pc(i){return i in Zi?Zi[i]:Zi[i]="on"+i}function sm(i,c){if(i.da)i=!0;else{c=new ar(c,this);var u=i.listener,f=i.ha||i.src;i.fa&&eo(i),i=u.call(f,c)}return i}function to(i){return i=i[Yi],i instanceof fs?i:null}var no="__closure_events_fn_"+(1e9*Math.random()>>>0);function gc(i){return typeof i=="function"?i:(i[no]||(i[no]=function(c){return i.handleEvent(c)}),i[no])}function _e(){At.call(this),this.i=new fs(this),this.M=this,this.F=null}P(_e,At),_e.prototype[hs]=!0,_e.prototype.removeEventListener=function(i,c,u,f){mc(this,i,c,u,f)};function Se(i,c){var u,f=i.F;if(f)for(u=[];f;f=f.F)u.push(f);if(i=i.M,f=c.type||c,typeof c=="string")c=new ye(c,i);else if(c instanceof ye)c.target=c.target||i;else{var w=c;c=new ye(f,i),v(c,w)}if(w=!0,u)for(var b=u.length-1;0<=b;b--){var k=c.g=u[b];w=ms(k,f,!0,c)&&w}if(k=c.g=i,w=ms(k,f,!0,c)&&w,w=ms(k,f,!1,c)&&w,u)for(b=0;b<u.length;b++)k=c.g=u[b],w=ms(k,f,!1,c)&&w}_e.prototype.N=function(){if(_e.aa.N.call(this),this.i){var i=this.i,c;for(c in i.g){for(var u=i.g[c],f=0;f<u.length;f++)ds(u[f]);delete i.g[c],i.h--}}this.F=null},_e.prototype.K=function(i,c,u,f){return this.i.add(String(i),c,!1,u,f)},_e.prototype.L=function(i,c,u,f){return this.i.add(String(i),c,!0,u,f)};function ms(i,c,u,f){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();for(var w=!0,b=0;b<c.length;++b){var k=c[b];if(k&&!k.da&&k.capture==u){var J=k.listener,he=k.ha||k.src;k.fa&&Ji(i.i,k),w=J.call(he,f)!==!1&&w}}return w&&!f.defaultPrevented}function yc(i,c,u){if(typeof i=="function")u&&(i=E(i,u));else if(i&&typeof i.handleEvent=="function")i=E(i.handleEvent,i);else throw Error("Invalid listener argument");return 2147483647<Number(c)?-1:l.setTimeout(i,c||0)}function _c(i){i.g=yc(()=>{i.g=null,i.i&&(i.i=!1,_c(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class im extends At{constructor(c,u){super(),this.m=c,this.l=u,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:_c(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function cr(i){At.call(this),this.h=i,this.g={}}P(cr,At);var Ec=[];function vc(i){ge(i.g,function(c,u){this.g.hasOwnProperty(u)&&eo(c)},i),i.g={}}cr.prototype.N=function(){cr.aa.N.call(this),vc(this)},cr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ro=l.JSON.stringify,om=l.JSON.parse,am=class{stringify(i){return l.JSON.stringify(i,void 0)}parse(i){return l.JSON.parse(i,void 0)}};function so(){}so.prototype.h=null;function Ic(i){return i.h||(i.h=i.i())}function Tc(){}var lr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function io(){ye.call(this,"d")}P(io,ye);function oo(){ye.call(this,"c")}P(oo,ye);var Xt={},wc=null;function ps(){return wc=wc||new _e}Xt.La="serverreachability";function Ac(i){ye.call(this,Xt.La,i)}P(Ac,ye);function ur(i){const c=ps();Se(c,new Ac(c))}Xt.STAT_EVENT="statevent";function bc(i,c){ye.call(this,Xt.STAT_EVENT,i),this.stat=c}P(bc,ye);function Ce(i){const c=ps();Se(c,new bc(c,i))}Xt.Ma="timingevent";function Sc(i,c){ye.call(this,Xt.Ma,i),this.size=c}P(Sc,ye);function hr(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){i()},c)}function dr(){this.g=!0}dr.prototype.xa=function(){this.g=!1};function cm(i,c,u,f,w,b){i.info(function(){if(i.g)if(b)for(var k="",J=b.split("&"),he=0;he<J.length;he++){var K=J[he].split("=");if(1<K.length){var Ee=K[0];K=K[1];var ve=Ee.split("_");k=2<=ve.length&&ve[1]=="type"?k+(Ee+"="+K+"&"):k+(Ee+"=redacted&")}}else k=null;else k=b;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+c+`
`+u+`
`+k})}function lm(i,c,u,f,w,b,k){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+c+`
`+u+`
`+b+" "+k})}function In(i,c,u,f){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+hm(i,u)+(f?" "+f:"")})}function um(i,c){i.info(function(){return"TIMEOUT: "+c})}dr.prototype.info=function(){};function hm(i,c){if(!i.g)return c;if(!c)return null;try{var u=JSON.parse(c);if(u){for(i=0;i<u.length;i++)if(Array.isArray(u[i])){var f=u[i];if(!(2>f.length)){var w=f[1];if(Array.isArray(w)&&!(1>w.length)){var b=w[0];if(b!="noop"&&b!="stop"&&b!="close")for(var k=1;k<w.length;k++)w[k]=""}}}}return ro(u)}catch{return c}}var gs={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Cc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},ao;function ys(){}P(ys,so),ys.prototype.g=function(){return new XMLHttpRequest},ys.prototype.i=function(){return{}},ao=new ys;function bt(i,c,u,f){this.j=i,this.i=c,this.l=u,this.R=f||1,this.U=new cr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Rc}function Rc(){this.i=null,this.g="",this.h=!1}var Pc={},co={};function lo(i,c,u){i.L=1,i.v=Is(lt(c)),i.m=u,i.P=!0,kc(i,null)}function kc(i,c){i.F=Date.now(),_s(i),i.A=lt(i.v);var u=i.A,f=i.R;Array.isArray(f)||(f=[String(f)]),Hc(u.i,"t",f),i.C=0,u=i.j.J,i.h=new Rc,i.g=cl(i.j,u?c:null,!i.m),0<i.O&&(i.M=new im(E(i.Y,i,i.g),i.O)),c=i.U,u=i.g,f=i.ca;var w="readystatechange";Array.isArray(w)||(w&&(Ec[0]=w.toString()),w=Ec);for(var b=0;b<w.length;b++){var k=fc(u,w[b],f||c.handleEvent,!1,c.h||c);if(!k)break;c.g[k.key]=k}c=i.H?p(i.H):{},i.m?(i.u||(i.u="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.A,i.u,i.m,c)):(i.u="GET",i.g.ea(i.A,i.u,null,c)),ur(),cm(i.i,i.u,i.A,i.l,i.R,i.m)}bt.prototype.ca=function(i){i=i.target;const c=this.M;c&&ut(i)==3?c.j():this.Y(i)},bt.prototype.Y=function(i){try{if(i==this.g)e:{const ve=ut(this.g);var c=this.g.Ba();const An=this.g.Z();if(!(3>ve)&&(ve!=3||this.g&&(this.h.h||this.g.oa()||Xc(this.g)))){this.J||ve!=4||c==7||(c==8||0>=An?ur(3):ur(2)),uo(this);var u=this.g.Z();this.X=u;t:if(Vc(this)){var f=Xc(this.g);i="";var w=f.length,b=ut(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Yt(this),fr(this);var k="";break t}this.h.i=new l.TextDecoder}for(c=0;c<w;c++)this.h.h=!0,i+=this.h.i.decode(f[c],{stream:!(b&&c==w-1)});f.length=0,this.h.g+=i,this.C=0,k=this.h.g}else k=this.g.oa();if(this.o=u==200,lm(this.i,this.u,this.A,this.l,this.R,ve,u),this.o){if(this.T&&!this.K){t:{if(this.g){var J,he=this.g;if((J=he.g?he.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!U(J)){var K=J;break t}}K=null}if(u=K)In(this.i,this.l,u,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ho(this,u);else{this.o=!1,this.s=3,Ce(12),Yt(this),fr(this);break e}}if(this.P){u=!0;let Be;for(;!this.J&&this.C<k.length;)if(Be=dm(this,k),Be==co){ve==4&&(this.s=4,Ce(14),u=!1),In(this.i,this.l,null,"[Incomplete Response]");break}else if(Be==Pc){this.s=4,Ce(15),In(this.i,this.l,k,"[Invalid Chunk]"),u=!1;break}else In(this.i,this.l,Be,null),ho(this,Be);if(Vc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),ve!=4||k.length!=0||this.h.h||(this.s=1,Ce(16),u=!1),this.o=this.o&&u,!u)In(this.i,this.l,k,"[Invalid Chunked Response]"),Yt(this),fr(this);else if(0<k.length&&!this.W){this.W=!0;var Ee=this.j;Ee.g==this&&Ee.ba&&!Ee.M&&(Ee.j.info("Great, no buffering proxy detected. Bytes received: "+k.length),_o(Ee),Ee.M=!0,Ce(11))}}else In(this.i,this.l,k,null),ho(this,k);ve==4&&Yt(this),this.o&&!this.J&&(ve==4?sl(this.j,this):(this.o=!1,_s(this)))}else Pm(this.g),u==400&&0<k.indexOf("Unknown SID")?(this.s=3,Ce(12)):(this.s=0,Ce(13)),Yt(this),fr(this)}}}catch{}finally{}};function Vc(i){return i.g?i.u=="GET"&&i.L!=2&&i.j.Ca:!1}function dm(i,c){var u=i.C,f=c.indexOf(`
`,u);return f==-1?co:(u=Number(c.substring(u,f)),isNaN(u)?Pc:(f+=1,f+u>c.length?co:(c=c.slice(f,f+u),i.C=f+u,c)))}bt.prototype.cancel=function(){this.J=!0,Yt(this)};function _s(i){i.S=Date.now()+i.I,Nc(i,i.I)}function Nc(i,c){if(i.B!=null)throw Error("WatchDog timer not null");i.B=hr(E(i.ba,i),c)}function uo(i){i.B&&(l.clearTimeout(i.B),i.B=null)}bt.prototype.ba=function(){this.B=null;const i=Date.now();0<=i-this.S?(um(this.i,this.A),this.L!=2&&(ur(),Ce(17)),Yt(this),this.s=2,fr(this)):Nc(this,this.S-i)};function fr(i){i.j.G==0||i.J||sl(i.j,i)}function Yt(i){uo(i);var c=i.M;c&&typeof c.ma=="function"&&c.ma(),i.M=null,vc(i.U),i.g&&(c=i.g,i.g=null,c.abort(),c.ma())}function ho(i,c){try{var u=i.j;if(u.G!=0&&(u.g==i||fo(u.h,i))){if(!i.K&&fo(u.h,i)&&u.G==3){try{var f=u.Da.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!u.u){if(u.g)if(u.g.F+3e3<i.F)Cs(u),bs(u);else break e;yo(u),Ce(18)}}else u.za=w[1],0<u.za-u.T&&37500>w[2]&&u.F&&u.v==0&&!u.C&&(u.C=hr(E(u.Za,u),6e3));if(1>=Lc(u.h)&&u.ca){try{u.ca()}catch{}u.ca=void 0}}else en(u,11)}else if((i.K||u.g==i)&&Cs(u),!U(c))for(w=u.Da.g.parse(c),c=0;c<w.length;c++){let K=w[c];if(u.T=K[0],K=K[1],u.G==2)if(K[0]=="c"){u.K=K[1],u.ia=K[2];const Ee=K[3];Ee!=null&&(u.la=Ee,u.j.info("VER="+u.la));const ve=K[4];ve!=null&&(u.Aa=ve,u.j.info("SVER="+u.Aa));const An=K[5];An!=null&&typeof An=="number"&&0<An&&(f=1.5*An,u.L=f,u.j.info("backChannelRequestTimeoutMs_="+f)),f=u;const Be=i.g;if(Be){const Ps=Be.g?Be.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Ps){var b=f.h;b.g||Ps.indexOf("spdy")==-1&&Ps.indexOf("quic")==-1&&Ps.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(mo(b,b.h),b.h=null))}if(f.D){const Eo=Be.g?Be.g.getResponseHeader("X-HTTP-Session-Id"):null;Eo&&(f.ya=Eo,Y(f.I,f.D,Eo))}}u.G=3,u.l&&u.l.ua(),u.ba&&(u.R=Date.now()-i.F,u.j.info("Handshake RTT: "+u.R+"ms")),f=u;var k=i;if(f.qa=al(f,f.J?f.ia:null,f.W),k.K){Mc(f.h,k);var J=k,he=f.L;he&&(J.I=he),J.B&&(uo(J),_s(J)),f.g=k}else nl(f);0<u.i.length&&Ss(u)}else K[0]!="stop"&&K[0]!="close"||en(u,7);else u.G==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?en(u,7):go(u):K[0]!="noop"&&u.l&&u.l.ta(K),u.v=0)}}ur(4)}catch{}}var fm=class{constructor(i,c){this.g=i,this.map=c}};function Dc(i){this.l=i||10,l.PerformanceNavigationTiming?(i=l.performance.getEntriesByType("navigation"),i=0<i.length&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Oc(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Lc(i){return i.h?1:i.g?i.g.size:0}function fo(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function mo(i,c){i.g?i.g.add(c):i.h=c}function Mc(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}Dc.prototype.cancel=function(){if(this.i=xc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function xc(i){if(i.h!=null)return i.i.concat(i.h.D);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const u of i.g.values())c=c.concat(u.D);return c}return O(i.i)}function mm(i){if(i.V&&typeof i.V=="function")return i.V();if(typeof Map<"u"&&i instanceof Map||typeof Set<"u"&&i instanceof Set)return Array.from(i.values());if(typeof i=="string")return i.split("");if(h(i)){for(var c=[],u=i.length,f=0;f<u;f++)c.push(i[f]);return c}c=[],u=0;for(f in i)c[u++]=i[f];return c}function pm(i){if(i.na&&typeof i.na=="function")return i.na();if(!i.V||typeof i.V!="function"){if(typeof Map<"u"&&i instanceof Map)return Array.from(i.keys());if(!(typeof Set<"u"&&i instanceof Set)){if(h(i)||typeof i=="string"){var c=[];i=i.length;for(var u=0;u<i;u++)c.push(u);return c}c=[],u=0;for(const f in i)c[u++]=f;return c}}}function Fc(i,c){if(i.forEach&&typeof i.forEach=="function")i.forEach(c,void 0);else if(h(i)||typeof i=="string")Array.prototype.forEach.call(i,c,void 0);else for(var u=pm(i),f=mm(i),w=f.length,b=0;b<w;b++)c.call(void 0,f[b],u&&u[b],i)}var Bc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function gm(i,c){if(i){i=i.split("&");for(var u=0;u<i.length;u++){var f=i[u].indexOf("="),w=null;if(0<=f){var b=i[u].substring(0,f);w=i[u].substring(f+1)}else b=i[u];c(b,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Zt(i){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,i instanceof Zt){this.h=i.h,Es(this,i.j),this.o=i.o,this.g=i.g,vs(this,i.s),this.l=i.l;var c=i.i,u=new gr;u.i=c.i,c.g&&(u.g=new Map(c.g),u.h=c.h),Uc(this,u),this.m=i.m}else i&&(c=String(i).match(Bc))?(this.h=!1,Es(this,c[1]||"",!0),this.o=mr(c[2]||""),this.g=mr(c[3]||"",!0),vs(this,c[4]),this.l=mr(c[5]||"",!0),Uc(this,c[6]||"",!0),this.m=mr(c[7]||"")):(this.h=!1,this.i=new gr(null,this.h))}Zt.prototype.toString=function(){var i=[],c=this.j;c&&i.push(pr(c,$c,!0),":");var u=this.g;return(u||c=="file")&&(i.push("//"),(c=this.o)&&i.push(pr(c,$c,!0),"@"),i.push(encodeURIComponent(String(u)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u=this.s,u!=null&&i.push(":",String(u))),(u=this.l)&&(this.g&&u.charAt(0)!="/"&&i.push("/"),i.push(pr(u,u.charAt(0)=="/"?Em:_m,!0))),(u=this.i.toString())&&i.push("?",u),(u=this.m)&&i.push("#",pr(u,Im)),i.join("")};function lt(i){return new Zt(i)}function Es(i,c,u){i.j=u?mr(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function vs(i,c){if(c){if(c=Number(c),isNaN(c)||0>c)throw Error("Bad port number "+c);i.s=c}else i.s=null}function Uc(i,c,u){c instanceof gr?(i.i=c,Tm(i.i,i.h)):(u||(c=pr(c,vm)),i.i=new gr(c,i.h))}function Y(i,c,u){i.i.set(c,u)}function Is(i){return Y(i,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),i}function mr(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function pr(i,c,u){return typeof i=="string"?(i=encodeURI(i).replace(c,ym),u&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function ym(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var $c=/[#\/\?@]/g,_m=/[#\?:]/g,Em=/[#\?]/g,vm=/[#\?@]/g,Im=/#/g;function gr(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function St(i){i.g||(i.g=new Map,i.h=0,i.i&&gm(i.i,function(c,u){i.add(decodeURIComponent(c.replace(/\+/g," ")),u)}))}n=gr.prototype,n.add=function(i,c){St(this),this.i=null,i=Tn(this,i);var u=this.g.get(i);return u||this.g.set(i,u=[]),u.push(c),this.h+=1,this};function qc(i,c){St(i),c=Tn(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function jc(i,c){return St(i),c=Tn(i,c),i.g.has(c)}n.forEach=function(i,c){St(this),this.g.forEach(function(u,f){u.forEach(function(w){i.call(c,w,f,this)},this)},this)},n.na=function(){St(this);const i=Array.from(this.g.values()),c=Array.from(this.g.keys()),u=[];for(let f=0;f<c.length;f++){const w=i[f];for(let b=0;b<w.length;b++)u.push(c[f])}return u},n.V=function(i){St(this);let c=[];if(typeof i=="string")jc(this,i)&&(c=c.concat(this.g.get(Tn(this,i))));else{i=Array.from(this.g.values());for(let u=0;u<i.length;u++)c=c.concat(i[u])}return c},n.set=function(i,c){return St(this),this.i=null,i=Tn(this,i),jc(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=this.V(i),0<i.length?String(i[0]):c):c};function Hc(i,c,u){qc(i,c),0<u.length&&(i.i=null,i.g.set(Tn(i,c),O(u)),i.h+=u.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(var u=0;u<c.length;u++){var f=c[u];const b=encodeURIComponent(String(f)),k=this.V(f);for(f=0;f<k.length;f++){var w=b;k[f]!==""&&(w+="="+encodeURIComponent(String(k[f]))),i.push(w)}}return this.i=i.join("&")};function Tn(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function Tm(i,c){c&&!i.j&&(St(i),i.i=null,i.g.forEach(function(u,f){var w=f.toLowerCase();f!=w&&(qc(this,f),Hc(this,w,u))},i)),i.j=c}function wm(i,c){const u=new dr;if(l.Image){const f=new Image;f.onload=R(Ct,u,"TestLoadImage: loaded",!0,c,f),f.onerror=R(Ct,u,"TestLoadImage: error",!1,c,f),f.onabort=R(Ct,u,"TestLoadImage: abort",!1,c,f),f.ontimeout=R(Ct,u,"TestLoadImage: timeout",!1,c,f),l.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else c(!1)}function Am(i,c){const u=new dr,f=new AbortController,w=setTimeout(()=>{f.abort(),Ct(u,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:f.signal}).then(b=>{clearTimeout(w),b.ok?Ct(u,"TestPingServer: ok",!0,c):Ct(u,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),Ct(u,"TestPingServer: error",!1,c)})}function Ct(i,c,u,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(u)}catch{}}function bm(){this.g=new am}function Sm(i,c,u){const f=u||"";try{Fc(i,function(w,b){let k=w;d(w)&&(k=ro(w)),c.push(f+b+"="+encodeURIComponent(k))})}catch(w){throw c.push(f+"type="+encodeURIComponent("_badmap")),w}}function Ts(i){this.l=i.Ub||null,this.j=i.eb||!1}P(Ts,so),Ts.prototype.g=function(){return new ws(this.l,this.j)},Ts.prototype.i=function(i){return function(){return i}}({});function ws(i,c){_e.call(this),this.D=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}P(ws,_e),n=ws.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=i,this.A=c,this.readyState=1,_r(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const c={headers:this.u,method:this.B,credentials:this.m,cache:void 0};i&&(c.body=i),(this.D||l).fetch(new Request(this.A,c)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,yr(this)),this.readyState=0},n.Sa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,_r(this)),this.g&&(this.readyState=3,_r(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;zc(this)}else i.text().then(this.Ra.bind(this),this.ga.bind(this))};function zc(i){i.j.read().then(i.Pa.bind(i)).catch(i.ga.bind(i))}n.Pa=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.v.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?yr(this):_r(this),this.readyState==3&&zc(this)}},n.Ra=function(i){this.g&&(this.response=this.responseText=i,yr(this))},n.Qa=function(i){this.g&&(this.response=i,yr(this))},n.ga=function(){this.g&&yr(this)};function yr(i){i.readyState=4,i.l=null,i.j=null,i.v=null,_r(i)}n.setRequestHeader=function(i,c){this.u.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var u=c.next();!u.done;)u=u.value,i.push(u[0]+": "+u[1]),u=c.next();return i.join(`\r
`)};function _r(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(ws.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Gc(i){let c="";return ge(i,function(u,f){c+=f,c+=":",c+=u,c+=`\r
`}),c}function po(i,c,u){e:{for(f in u){var f=!1;break e}f=!0}f||(u=Gc(u),typeof i=="string"?u!=null&&encodeURIComponent(String(u)):Y(i,c,u))}function ne(i){_e.call(this),this.headers=new Map,this.o=i||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}P(ne,_e);var Cm=/^https?$/i,Rm=["POST","PUT"];n=ne.prototype,n.Ha=function(i){this.J=i},n.ea=function(i,c,u,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ao.g(),this.v=this.o?Ic(this.o):Ic(ao),this.g.onreadystatechange=E(this.Ea,this);try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(b){Wc(this,b);return}if(i=u||"",u=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)u.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const b of f.keys())u.set(b,f.get(b));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(u.keys()).find(b=>b.toLowerCase()=="content-type"),w=l.FormData&&i instanceof l.FormData,!(0<=Array.prototype.indexOf.call(Rm,c,void 0))||f||w||u.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,k]of u)this.g.setRequestHeader(b,k);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Jc(this),this.u=!0,this.g.send(i),this.u=!1}catch(b){Wc(this,b)}};function Wc(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.m=5,Kc(i),As(i)}function Kc(i){i.A||(i.A=!0,Se(i,"complete"),Se(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=i||7,Se(this,"complete"),Se(this,"abort"),As(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),As(this,!0)),ne.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Qc(this):this.bb())},n.bb=function(){Qc(this)};function Qc(i){if(i.h&&typeof a<"u"&&(!i.v[1]||ut(i)!=4||i.Z()!=2)){if(i.u&&ut(i)==4)yc(i.Ea,0,i);else if(Se(i,"readystatechange"),ut(i)==4){i.h=!1;try{const k=i.Z();e:switch(k){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var u;if(!(u=c)){var f;if(f=k===0){var w=String(i.D).match(Bc)[1]||null;!w&&l.self&&l.self.location&&(w=l.self.location.protocol.slice(0,-1)),f=!Cm.test(w?w.toLowerCase():"")}u=f}if(u)Se(i,"complete"),Se(i,"success");else{i.m=6;try{var b=2<ut(i)?i.g.statusText:""}catch{b=""}i.l=b+" ["+i.Z()+"]",Kc(i)}}finally{As(i)}}}}function As(i,c){if(i.g){Jc(i);const u=i.g,f=i.v[0]?()=>{}:null;i.g=null,i.v=null,c||Se(i,"ready");try{u.onreadystatechange=f}catch{}}}function Jc(i){i.I&&(l.clearTimeout(i.I),i.I=null)}n.isActive=function(){return!!this.g};function ut(i){return i.g?i.g.readyState:0}n.Z=function(){try{return 2<ut(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),om(c)}};function Xc(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.H){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Pm(i){const c={};i=(i.g&&2<=ut(i)&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if(U(i[f]))continue;var u=I(i[f]);const w=u[0];if(u=u[1],typeof u!="string")continue;u=u.trim();const b=c[w]||[];c[w]=b,b.push(u)}T(c,function(f){return f.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Er(i,c,u){return u&&u.internalChannelParams&&u.internalChannelParams[i]||c}function Yc(i){this.Aa=0,this.i=[],this.j=new dr,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Er("failFast",!1,i),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Er("baseRetryDelayMs",5e3,i),this.cb=Er("retryDelaySeedMs",1e4,i),this.Wa=Er("forwardChannelMaxRetries",2,i),this.wa=Er("forwardChannelRequestTimeoutMs",2e4,i),this.pa=i&&i.xmlHttpFactory||void 0,this.Xa=i&&i.Tb||void 0,this.Ca=i&&i.useFetchStreams||!1,this.L=void 0,this.J=i&&i.supportsCrossDomainXhr||!1,this.K="",this.h=new Dc(i&&i.concurrentRequestLimit),this.Da=new bm,this.P=i&&i.fastHandshake||!1,this.O=i&&i.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=i&&i.Rb||!1,i&&i.xa&&this.j.xa(),i&&i.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&i&&i.detectBufferingProxy||!1,this.ja=void 0,i&&i.longPollingTimeout&&0<i.longPollingTimeout&&(this.ja=i.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Yc.prototype,n.la=8,n.G=1,n.connect=function(i,c,u,f){Ce(0),this.W=i,this.H=c||{},u&&f!==void 0&&(this.H.OSID=u,this.H.OAID=f),this.F=this.X,this.I=al(this,null,this.W),Ss(this)};function go(i){if(Zc(i),i.G==3){var c=i.U++,u=lt(i.I);if(Y(u,"SID",i.K),Y(u,"RID",c),Y(u,"TYPE","terminate"),vr(i,u),c=new bt(i,i.j,c),c.L=2,c.v=Is(lt(u)),u=!1,l.navigator&&l.navigator.sendBeacon)try{u=l.navigator.sendBeacon(c.v.toString(),"")}catch{}!u&&l.Image&&(new Image().src=c.v,u=!0),u||(c.g=cl(c.j,null),c.g.ea(c.v)),c.F=Date.now(),_s(c)}ol(i)}function bs(i){i.g&&(_o(i),i.g.cancel(),i.g=null)}function Zc(i){bs(i),i.u&&(l.clearTimeout(i.u),i.u=null),Cs(i),i.h.cancel(),i.s&&(typeof i.s=="number"&&l.clearTimeout(i.s),i.s=null)}function Ss(i){if(!Oc(i.h)&&!i.s){i.s=!0;var c=i.Ga;ir||dc(),or||(ir(),or=!0),Qi.add(c,i),i.B=0}}function km(i,c){return Lc(i.h)>=i.h.j-(i.s?1:0)?!1:i.s?(i.i=c.D.concat(i.i),!0):i.G==1||i.G==2||i.B>=(i.Va?0:i.Wa)?!1:(i.s=hr(E(i.Ga,i,c),il(i,i.B)),i.B++,!0)}n.Ga=function(i){if(this.s)if(this.s=null,this.G==1){if(!i){this.U=Math.floor(1e5*Math.random()),i=this.U++;const w=new bt(this,this.j,i);let b=this.o;if(this.S&&(b?(b=p(b),v(b,this.S)):b=this.S),this.m!==null||this.O||(w.H=b,b=null),this.P)e:{for(var c=0,u=0;u<this.i.length;u++){t:{var f=this.i[u];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(c+=f,4096<c){c=u;break e}if(c===4096||u===this.i.length-1){c=u+1;break e}}c=1e3}else c=1e3;c=tl(this,w,c),u=lt(this.I),Y(u,"RID",i),Y(u,"CVER",22),this.D&&Y(u,"X-HTTP-Session-Id",this.D),vr(this,u),b&&(this.O?c="headers="+encodeURIComponent(String(Gc(b)))+"&"+c:this.m&&po(u,this.m,b)),mo(this.h,w),this.Ua&&Y(u,"TYPE","init"),this.P?(Y(u,"$req",c),Y(u,"SID","null"),w.T=!0,lo(w,u,null)):lo(w,u,c),this.G=2}}else this.G==3&&(i?el(this,i):this.i.length==0||Oc(this.h)||el(this))};function el(i,c){var u;c?u=c.l:u=i.U++;const f=lt(i.I);Y(f,"SID",i.K),Y(f,"RID",u),Y(f,"AID",i.T),vr(i,f),i.m&&i.o&&po(f,i.m,i.o),u=new bt(i,i.j,u,i.B+1),i.m===null&&(u.H=i.o),c&&(i.i=c.D.concat(i.i)),c=tl(i,u,1e3),u.I=Math.round(.5*i.wa)+Math.round(.5*i.wa*Math.random()),mo(i.h,u),lo(u,f,c)}function vr(i,c){i.H&&ge(i.H,function(u,f){Y(c,f,u)}),i.l&&Fc({},function(u,f){Y(c,f,u)})}function tl(i,c,u){u=Math.min(i.i.length,u);var f=i.l?E(i.l.Na,i.l,i):null;e:{var w=i.i;let b=-1;for(;;){const k=["count="+u];b==-1?0<u?(b=w[0].g,k.push("ofs="+b)):b=0:k.push("ofs="+b);let J=!0;for(let he=0;he<u;he++){let K=w[he].g;const Ee=w[he].map;if(K-=b,0>K)b=Math.max(0,w[he].g-100),J=!1;else try{Sm(Ee,k,"req"+K+"_")}catch{f&&f(Ee)}}if(J){f=k.join("&");break e}}}return i=i.i.splice(0,u),c.D=i,f}function nl(i){if(!i.g&&!i.u){i.Y=1;var c=i.Fa;ir||dc(),or||(ir(),or=!0),Qi.add(c,i),i.v=0}}function yo(i){return i.g||i.u||3<=i.v?!1:(i.Y++,i.u=hr(E(i.Fa,i),il(i,i.v)),i.v++,!0)}n.Fa=function(){if(this.u=null,rl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var i=2*this.R;this.j.info("BP detection timer enabled: "+i),this.A=hr(E(this.ab,this),i)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ce(10),bs(this),rl(this))};function _o(i){i.A!=null&&(l.clearTimeout(i.A),i.A=null)}function rl(i){i.g=new bt(i,i.j,"rpc",i.Y),i.m===null&&(i.g.H=i.o),i.g.O=0;var c=lt(i.qa);Y(c,"RID","rpc"),Y(c,"SID",i.K),Y(c,"AID",i.T),Y(c,"CI",i.F?"0":"1"),!i.F&&i.ja&&Y(c,"TO",i.ja),Y(c,"TYPE","xmlhttp"),vr(i,c),i.m&&i.o&&po(c,i.m,i.o),i.L&&(i.g.I=i.L);var u=i.g;i=i.ia,u.L=1,u.v=Is(lt(c)),u.m=null,u.P=!0,kc(u,i)}n.Za=function(){this.C!=null&&(this.C=null,bs(this),yo(this),Ce(19))};function Cs(i){i.C!=null&&(l.clearTimeout(i.C),i.C=null)}function sl(i,c){var u=null;if(i.g==c){Cs(i),_o(i),i.g=null;var f=2}else if(fo(i.h,c))u=c.D,Mc(i.h,c),f=1;else return;if(i.G!=0){if(c.o)if(f==1){u=c.m?c.m.length:0,c=Date.now()-c.F;var w=i.B;f=ps(),Se(f,new Sc(f,u)),Ss(i)}else nl(i);else if(w=c.s,w==3||w==0&&0<c.X||!(f==1&&km(i,c)||f==2&&yo(i)))switch(u&&0<u.length&&(c=i.h,c.i=c.i.concat(u)),w){case 1:en(i,5);break;case 4:en(i,10);break;case 3:en(i,6);break;default:en(i,2)}}}function il(i,c){let u=i.Ta+Math.floor(Math.random()*i.cb);return i.isActive()||(u*=2),u*c}function en(i,c){if(i.j.info("Error code "+c),c==2){var u=E(i.fb,i),f=i.Xa;const w=!f;f=new Zt(f||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Es(f,"https"),Is(f),w?wm(f.toString(),u):Am(f.toString(),u)}else Ce(2);i.G=0,i.l&&i.l.sa(c),ol(i),Zc(i)}n.fb=function(i){i?(this.j.info("Successfully pinged google.com"),Ce(2)):(this.j.info("Failed to ping google.com"),Ce(1))};function ol(i){if(i.G=0,i.ka=[],i.l){const c=xc(i.h);(c.length!=0||i.i.length!=0)&&(V(i.ka,c),V(i.ka,i.i),i.h.i.length=0,O(i.i),i.i.length=0),i.l.ra()}}function al(i,c,u){var f=u instanceof Zt?lt(u):new Zt(u);if(f.g!="")c&&(f.g=c+"."+f.g),vs(f,f.s);else{var w=l.location;f=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;var b=new Zt(null);f&&Es(b,f),c&&(b.g=c),w&&vs(b,w),u&&(b.l=u),f=b}return u=i.D,c=i.ya,u&&c&&Y(f,u,c),Y(f,"VER",i.la),vr(i,f),f}function cl(i,c,u){if(c&&!i.J)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Ca&&!i.pa?new ne(new Ts({eb:u})):new ne(i.pa),c.Ha(i.J),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ll(){}n=ll.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Rs(){}Rs.prototype.g=function(i,c){return new Le(i,c)};function Le(i,c){_e.call(this),this.g=new Yc(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.va&&(i?i["X-WebChannel-Client-Profile"]=c.va:i={"X-WebChannel-Client-Profile":c.va}),this.g.S=i,(i=c&&c.Sb)&&!U(i)&&(this.g.m=i),this.v=c&&c.supportsCrossDomainXhr||!1,this.u=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!U(c)&&(this.g.D=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new wn(this)}P(Le,_e),Le.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Le.prototype.close=function(){go(this.g)},Le.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var u={};u.__data__=i,i=u}else this.u&&(u={},u.__data__=ro(i),i=u);c.i.push(new fm(c.Ya++,i)),c.G==3&&Ss(c)},Le.prototype.N=function(){this.g.l=null,delete this.j,go(this.g),delete this.g,Le.aa.N.call(this)};function ul(i){io.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const u in c){i=u;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}P(ul,io);function hl(){oo.call(this),this.status=1}P(hl,oo);function wn(i){this.g=i}P(wn,ll),wn.prototype.ua=function(){Se(this.g,"a")},wn.prototype.ta=function(i){Se(this.g,new ul(i))},wn.prototype.sa=function(i){Se(this.g,new hl)},wn.prototype.ra=function(){Se(this.g,"b")},Rs.prototype.createWebChannel=Rs.prototype.g,Le.prototype.send=Le.prototype.o,Le.prototype.open=Le.prototype.m,Le.prototype.close=Le.prototype.close,Qh=function(){return new Rs},Kh=function(){return ps()},Wh=Xt,jo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},gs.NO_ERROR=0,gs.TIMEOUT=8,gs.HTTP_ERROR=6,Us=gs,Cc.COMPLETE="complete",Gh=Cc,Tc.EventType=lr,lr.OPEN="a",lr.CLOSE="b",lr.ERROR="c",lr.MESSAGE="d",_e.prototype.listen=_e.prototype.K,Ir=Tc,ne.prototype.listenOnce=ne.prototype.L,ne.prototype.getLastError=ne.prototype.Ka,ne.prototype.getLastErrorCode=ne.prototype.Ba,ne.prototype.getStatus=ne.prototype.Z,ne.prototype.getResponseJson=ne.prototype.Oa,ne.prototype.getResponseText=ne.prototype.oa,ne.prototype.send=ne.prototype.ea,ne.prototype.setWithCredentials=ne.prototype.Ha,zh=ne}).apply(typeof Vs<"u"?Vs:typeof self<"u"?self:typeof window<"u"?window:{});const $l="@firebase/firestore",ql="4.9.0";/**
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
 */class Te{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Te.UNAUTHENTICATED=new Te(null),Te.GOOGLE_CREDENTIALS=new Te("google-credentials-uid"),Te.FIRST_PARTY=new Te("first-party-uid"),Te.MOCK_USER=new Te("mock-user");/**
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
 */let Yn="12.0.0";/**
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
 */const mn=new fa("@firebase/firestore");function bn(){return mn.logLevel}function D(n,...e){if(mn.logLevel<=$.DEBUG){const t=e.map(Sa);mn.debug(`Firestore (${Yn}): ${n}`,...t)}}function It(n,...e){if(mn.logLevel<=$.ERROR){const t=e.map(Sa);mn.error(`Firestore (${Yn}): ${n}`,...t)}}function qn(n,...e){if(mn.logLevel<=$.WARN){const t=e.map(Sa);mn.warn(`Firestore (${Yn}): ${n}`,...t)}}function Sa(n){if(typeof n=="string")return n;try{/**
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
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
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
 */function M(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Jh(n,r,t)}function Jh(n,e,t){let r=`FIRESTORE (${Yn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw It(r),new Error(r)}function Q(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||Jh(e,s,r)}function B(n,e){return n}/**
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
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends wt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class mt{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Xh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class f_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Te.UNAUTHENTICATED))}shutdown(){}}class m_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class p_{constructor(e){this.t=e,this.currentUser=Te.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Q(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new mt;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new mt,e.enqueueRetryable(()=>s(this.currentUser))};const a=()=>{const h=o;e.enqueueRetryable(async()=>{await h.promise,await s(this.currentUser)})},l=h=>{D("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(h=>l(h)),setTimeout(()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?l(h):(D("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new mt)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(D("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string",31837,{l:r}),new Xh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Q(e===null||typeof e=="string",2055,{h:e}),new Te(e)}}class g_{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Te.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class y_{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new g_(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(Te.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class jl{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class __{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Je(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Q(this.o===void 0,3512);const r=o=>{o.error!=null&&D("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,D("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable(()=>r(o))};const s=o=>{D("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(o=>s(o)),setTimeout(()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):D("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new jl(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Q(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new jl(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function E_(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */class Ca{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=E_(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%62))}return r}}function q(n,e){return n<e?-1:n>e?1:0}function Ho(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),o=e.charAt(r);if(s!==o)return Co(s)===Co(o)?q(s,o):Co(s)?1:-1}return q(n.length,e.length)}const v_=55296,I_=57343;function Co(n){const e=n.charCodeAt(0);return e>=v_&&e<=I_}function jn(n,e,t){return n.length===e.length&&n.every((r,s)=>t(r,e[s]))}/**
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
 */const Hl="__name__";class Qe{constructor(e,t,r){t===void 0?t=0:t>e.length&&M(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&M(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Qe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Qe?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=Qe.compareSegments(e.get(s),t.get(s));if(o!==0)return o}return q(e.length,t.length)}static compareSegments(e,t){const r=Qe.isNumericId(e),s=Qe.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?Qe.extractNumericId(e).compare(Qe.extractNumericId(t)):Ho(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Bt.fromString(e.substring(4,e.length-2))}}class X extends Qe{construct(e,t,r){return new X(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(s=>s.length>0))}return new X(t)}static emptyPath(){return new X([])}}const T_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class me extends Qe{construct(e,t,r){return new me(e,t,r)}static isValidIdentifier(e){return T_.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),me.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Hl}static keyField(){return new me([Hl])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new N(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new N(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(o(),s++)}if(o(),a)throw new N(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new me(t)}static emptyPath(){return new me([])}}/**
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
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(X.fromString(e))}static fromName(e){return new L(X.fromString(e).popFirst(5))}static empty(){return new L(X.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&X.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return X.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new X(e.slice()))}}/**
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
 */function Yh(n,e,t){if(!t)throw new N(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function w_(n,e,t,r){if(e===!0&&r===!0)throw new N(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function zl(n){if(!L.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Gl(n){if(L.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Zh(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Pi(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":M(12329,{type:typeof n})}function pn(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Pi(n);throw new N(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
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
 */function oe(n,e){const t={typeString:n};return e&&(t.value=e),t}function ts(n,e){if(!Zh(n))throw new N(S.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,o="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){t=`Expected '${r}' field to equal '${o.value}'`;break}}if(t)throw new N(S.INVALID_ARGUMENT,t);return!0}/**
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
 */const Wl=-62135596800,Kl=1e6;class Z{static now(){return Z.fromMillis(Date.now())}static fromDate(e){return Z.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Kl);return new Z(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Wl)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Kl}_compareTo(e){return this.seconds===e.seconds?q(this.nanoseconds,e.nanoseconds):q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Z._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(ts(e,Z._jsonSchema))return new Z(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Wl;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Z._jsonSchemaVersion="firestore/timestamp/1.0",Z._jsonSchema={type:oe("string",Z._jsonSchemaVersion),seconds:oe("number"),nanoseconds:oe("number")};/**
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
 */class F{static fromTimestamp(e){return new F(e)}static min(){return new F(new Z(0,0))}static max(){return new F(new Z(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const xr=-1;function A_(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=F.fromTimestamp(r===1e9?new Z(t+1,0):new Z(t,r));return new Ht(s,L.empty(),e)}function b_(n){return new Ht(n.readTime,n.key,xr)}class Ht{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Ht(F.min(),L.empty(),xr)}static max(){return new Ht(F.max(),L.empty(),xr)}}function S_(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:q(n.largestBatchId,e.largestBatchId))}/**
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
 */const C_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class R_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function Zn(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==C_)throw n;D("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class C{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new C((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof C?t:C.resolve(t)}catch(t){return C.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):C.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):C.reject(t)}static resolve(e){return new C((t,r)=>{t(e)})}static reject(e){return new C((t,r)=>{r(e)})}static waitFor(e){return new C((t,r)=>{let s=0,o=0,a=!1;e.forEach(l=>{++s,l.next(()=>{++o,a&&o===s&&t()},h=>r(h))}),a=!0,o===s&&t()})}static or(e){let t=C.resolve(!1);for(const r of e)t=t.next(s=>s?C.resolve(s):r());return t}static forEach(e,t){const r=[];return e.forEach((s,o)=>{r.push(t.call(this,s,o))}),this.waitFor(r)}static mapArray(e,t){return new C((r,s)=>{const o=e.length,a=new Array(o);let l=0;for(let h=0;h<o;h++){const d=h;t(e[d]).next(m=>{a[d]=m,++l,l===o&&r(a)},m=>s(m))}})}static doWhile(e,t){return new C((r,s)=>{const o=()=>{e()===!0?t().next(()=>{o()},s):r()};o()})}}function P_(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function er(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class ki{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>t.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}ki.ce=-1;/**
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
 */const Ra=-1;function Vi(n){return n==null}function li(n){return n===0&&1/n==-1/0}function k_(n){return typeof n=="number"&&Number.isInteger(n)&&!li(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const ed="";function V_(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Ql(e)),e=N_(n.get(t),e);return Ql(e)}function N_(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":t+="";break;case ed:t+="";break;default:t+=o}}return t}function Ql(n){return n+ed+""}/**
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
 */function Jl(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Jt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function td(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class ee{constructor(e,t){this.comparator=e,this.root=t||fe.EMPTY}insert(e,t){return new ee(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,fe.BLACK,null,null))}remove(e){return new ee(this.comparator,this.root.remove(e,this.comparator).copy(null,null,fe.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ns(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ns(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ns(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ns(this.root,e,this.comparator,!0)}}class Ns{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class fe{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??fe.RED,this.left=s??fe.EMPTY,this.right=o??fe.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new fe(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return fe.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return fe.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,fe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,fe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw M(27949);return e+(this.isRed()?0:1)}}fe.EMPTY=null,fe.RED=!0,fe.BLACK=!1;fe.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(e,t,r,s,o){return this}insert(e,t,r){return new fe(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class ce{constructor(e){this.comparator=e,this.data=new ee(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Xl(this.data.getIterator())}getIteratorFrom(e){return new Xl(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof ce)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new ce(this.comparator);return t.data=e,t}}class Xl{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class $e{constructor(e){this.fields=e,e.sort(me.comparator)}static empty(){return new $e([])}unionWith(e){let t=new ce(me.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new $e(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return jn(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class nd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class pe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new nd("Invalid base64 string: "+o):o}}(e);return new pe(t)}static fromUint8Array(e){const t=function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o}(e);return new pe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}pe.EMPTY_BYTE_STRING=new pe("");const D_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function zt(n){if(Q(!!n,39018),typeof n=="string"){let e=0;const t=D_.exec(n);if(Q(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:re(n.seconds),nanos:re(n.nanos)}}function re(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Gt(n){return typeof n=="string"?pe.fromBase64String(n):pe.fromUint8Array(n)}/**
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
 */const rd="server_timestamp",sd="__type__",id="__previous_value__",od="__local_write_time__";function Pa(n){return(n?.mapValue?.fields||{})[sd]?.stringValue===rd}function Ni(n){const e=n.mapValue.fields[id];return Pa(e)?Ni(e):e}function Fr(n){const e=zt(n.mapValue.fields[od].timestampValue);return new Z(e.seconds,e.nanos)}/**
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
 */class O_{constructor(e,t,r,s,o,a,l,h,d,m){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=h,this.useFetchStreams=d,this.isUsingEmulator=m}}const ui="(default)";class Br{constructor(e,t){this.projectId=e,this.database=t||ui}static empty(){return new Br("","")}get isDefaultDatabase(){return this.database===ui}isEqual(e){return e instanceof Br&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const ad="__type__",L_="__max__",Ds={mapValue:{}},cd="__vector__",hi="value";function Wt(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Pa(n)?4:x_(n)?9007199254740991:M_(n)?10:11:M(28295,{value:n})}function at(n,e){if(n===e)return!0;const t=Wt(n);if(t!==Wt(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Fr(n).isEqual(Fr(e));case 3:return function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=zt(s.timestampValue),l=zt(o.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(s,o){return Gt(s.bytesValue).isEqual(Gt(o.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(s,o){return re(s.geoPointValue.latitude)===re(o.geoPointValue.latitude)&&re(s.geoPointValue.longitude)===re(o.geoPointValue.longitude)}(n,e);case 2:return function(s,o){if("integerValue"in s&&"integerValue"in o)return re(s.integerValue)===re(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=re(s.doubleValue),l=re(o.doubleValue);return a===l?li(a)===li(l):isNaN(a)&&isNaN(l)}return!1}(n,e);case 9:return jn(n.arrayValue.values||[],e.arrayValue.values||[],at);case 10:case 11:return function(s,o){const a=s.mapValue.fields||{},l=o.mapValue.fields||{};if(Jl(a)!==Jl(l))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(l[h]===void 0||!at(a[h],l[h])))return!1;return!0}(n,e);default:return M(52216,{left:n})}}function Ur(n,e){return(n.values||[]).find(t=>at(t,e))!==void 0}function Hn(n,e){if(n===e)return 0;const t=Wt(n),r=Wt(e);if(t!==r)return q(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return q(n.booleanValue,e.booleanValue);case 2:return function(o,a){const l=re(o.integerValue||o.doubleValue),h=re(a.integerValue||a.doubleValue);return l<h?-1:l>h?1:l===h?0:isNaN(l)?isNaN(h)?0:-1:1}(n,e);case 3:return Yl(n.timestampValue,e.timestampValue);case 4:return Yl(Fr(n),Fr(e));case 5:return Ho(n.stringValue,e.stringValue);case 6:return function(o,a){const l=Gt(o),h=Gt(a);return l.compareTo(h)}(n.bytesValue,e.bytesValue);case 7:return function(o,a){const l=o.split("/"),h=a.split("/");for(let d=0;d<l.length&&d<h.length;d++){const m=q(l[d],h[d]);if(m!==0)return m}return q(l.length,h.length)}(n.referenceValue,e.referenceValue);case 8:return function(o,a){const l=q(re(o.latitude),re(a.latitude));return l!==0?l:q(re(o.longitude),re(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return Zl(n.arrayValue,e.arrayValue);case 10:return function(o,a){const l=o.fields||{},h=a.fields||{},d=l[hi]?.arrayValue,m=h[hi]?.arrayValue,_=q(d?.values?.length||0,m?.values?.length||0);return _!==0?_:Zl(d,m)}(n.mapValue,e.mapValue);case 11:return function(o,a){if(o===Ds.mapValue&&a===Ds.mapValue)return 0;if(o===Ds.mapValue)return 1;if(a===Ds.mapValue)return-1;const l=o.fields||{},h=Object.keys(l),d=a.fields||{},m=Object.keys(d);h.sort(),m.sort();for(let _=0;_<h.length&&_<m.length;++_){const E=Ho(h[_],m[_]);if(E!==0)return E;const R=Hn(l[h[_]],d[m[_]]);if(R!==0)return R}return q(h.length,m.length)}(n.mapValue,e.mapValue);default:throw M(23264,{he:t})}}function Yl(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return q(n,e);const t=zt(n),r=zt(e),s=q(t.seconds,r.seconds);return s!==0?s:q(t.nanos,r.nanos)}function Zl(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=Hn(t[s],r[s]);if(o)return o}return q(t.length,r.length)}function zn(n){return zo(n)}function zo(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=zt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Gt(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return L.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=zo(o);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${zo(t.fields[a])}`;return s+"}"}(n.mapValue):M(61005,{value:n})}function $s(n){switch(Wt(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ni(n);return e?16+$s(e):16;case 5:return 2*n.stringValue.length;case 6:return Gt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((s,o)=>s+$s(o),0)}(n.arrayValue);case 10:case 11:return function(r){let s=0;return Jt(r.fields,(o,a)=>{s+=o.length+$s(a)}),s}(n.mapValue);default:throw M(13486,{value:n})}}function eu(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Go(n){return!!n&&"integerValue"in n}function ka(n){return!!n&&"arrayValue"in n}function tu(n){return!!n&&"nullValue"in n}function nu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function qs(n){return!!n&&"mapValue"in n}function M_(n){return(n?.mapValue?.fields||{})[ad]?.stringValue===cd}function Rr(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return Jt(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=Rr(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Rr(n.arrayValue.values[t]);return e}return{...n}}function x_(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===L_}/**
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
 */class Me{constructor(e){this.value=e}static empty(){return new Me({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!qs(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Rr(t)}setAll(e){let t=me.emptyPath(),r={},s=[];e.forEach((a,l)=>{if(!t.isImmediateParentOf(l)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=l.popLast()}a?r[l.lastSegment()]=Rr(a):s.push(l.lastSegment())});const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());qs(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return at(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];qs(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Jt(t,(s,o)=>e[s]=o);for(const s of r)delete e[s]}clone(){return new Me(Rr(this.value))}}function ld(n){const e=[];return Jt(n.fields,(t,r)=>{const s=new me([t]);if(qs(r)){const o=ld(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)}),new $e(e)}/**
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
 */class we{constructor(e,t,r,s,o,a,l){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=l}static newInvalidDocument(e){return new we(e,0,F.min(),F.min(),F.min(),Me.empty(),0)}static newFoundDocument(e,t,r,s){return new we(e,1,t,F.min(),r,s,0)}static newNoDocument(e,t){return new we(e,2,t,F.min(),F.min(),Me.empty(),0)}static newUnknownDocument(e,t){return new we(e,3,t,F.min(),F.min(),Me.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(F.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Me.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Me.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=F.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof we&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new we(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class di{constructor(e,t){this.position=e,this.inclusive=t}}function ru(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=Hn(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function su(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!at(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class fi{constructor(e,t="asc"){this.field=e,this.dir=t}}function F_(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class ud{}class ie extends ud{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new U_(e,t,r):t==="array-contains"?new j_(e,r):t==="in"?new H_(e,r):t==="not-in"?new z_(e,r):t==="array-contains-any"?new G_(e,r):new ie(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new $_(e,r):new q_(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Hn(t,this.value)):t!==null&&Wt(this.value)===Wt(t)&&this.matchesComparison(Hn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class qe extends ud{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new qe(e,t)}matches(e){return hd(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function hd(n){return n.op==="and"}function dd(n){return B_(n)&&hd(n)}function B_(n){for(const e of n.filters)if(e instanceof qe)return!1;return!0}function Wo(n){if(n instanceof ie)return n.field.canonicalString()+n.op.toString()+zn(n.value);if(dd(n))return n.filters.map(e=>Wo(e)).join(",");{const e=n.filters.map(t=>Wo(t)).join(",");return`${n.op}(${e})`}}function fd(n,e){return n instanceof ie?function(r,s){return s instanceof ie&&r.op===s.op&&r.field.isEqual(s.field)&&at(r.value,s.value)}(n,e):n instanceof qe?function(r,s){return s instanceof qe&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce((o,a,l)=>o&&fd(a,s.filters[l]),!0):!1}(n,e):void M(19439)}function md(n){return n instanceof ie?function(t){return`${t.field.canonicalString()} ${t.op} ${zn(t.value)}`}(n):n instanceof qe?function(t){return t.op.toString()+" {"+t.getFilters().map(md).join(" ,")+"}"}(n):"Filter"}class U_ extends ie{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class $_ extends ie{constructor(e,t){super(e,"in",t),this.keys=pd("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class q_ extends ie{constructor(e,t){super(e,"not-in",t),this.keys=pd("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function pd(n,e){return(e.arrayValue?.values||[]).map(t=>L.fromName(t.referenceValue))}class j_ extends ie{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ka(t)&&Ur(t.arrayValue,this.value)}}class H_ extends ie{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ur(this.value.arrayValue,t)}}class z_ extends ie{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ur(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Ur(this.value.arrayValue,t)}}class G_ extends ie{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ka(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Ur(this.value.arrayValue,r))}}/**
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
 */class W_{constructor(e,t=null,r=[],s=[],o=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=l,this.Te=null}}function iu(n,e=null,t=[],r=[],s=null,o=null,a=null){return new W_(n,e,t,r,s,o,a)}function Va(n){const e=B(n);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>Wo(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(o){return o.field.canonicalString()+o.dir}(r)).join(","),Vi(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>zn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>zn(r)).join(",")),e.Te=t}return e.Te}function Na(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!F_(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!fd(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!su(n.startAt,e.startAt)&&su(n.endAt,e.endAt)}function Ko(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class ns{constructor(e,t=null,r=[],s=[],o=null,a="F",l=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=l,this.endAt=h,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function K_(n,e,t,r,s,o,a,l){return new ns(n,e,t,r,s,o,a,l)}function Da(n){return new ns(n)}function ou(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function gd(n){return n.collectionGroup!==null}function Pr(n){const e=B(n);if(e.Ie===null){e.Ie=[];const t=new Set;for(const o of e.explicitOrderBy)e.Ie.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new ce(me.comparator);return a.filters.forEach(h=>{h.getFlattenedFilters().forEach(d=>{d.isInequality()&&(l=l.add(d.field))})}),l})(e).forEach(o=>{t.has(o.canonicalString())||o.isKeyField()||e.Ie.push(new fi(o,r))}),t.has(me.keyField().canonicalString())||e.Ie.push(new fi(me.keyField(),r))}return e.Ie}function tt(n){const e=B(n);return e.Ee||(e.Ee=Q_(e,Pr(n))),e.Ee}function Q_(n,e){if(n.limitType==="F")return iu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(s=>{const o=s.dir==="desc"?"asc":"desc";return new fi(s.field,o)});const t=n.endAt?new di(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new di(n.startAt.position,n.startAt.inclusive):null;return iu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Qo(n,e){const t=n.filters.concat([e]);return new ns(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Jo(n,e,t){return new ns(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function Di(n,e){return Na(tt(n),tt(e))&&n.limitType===e.limitType}function yd(n){return`${Va(tt(n))}|lt:${n.limitType}`}function Sn(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(s=>md(s)).join(", ")}]`),Vi(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(s=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(s)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(s=>zn(s)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(s=>zn(s)).join(",")),`Target(${r})`}(tt(n))}; limitType=${n.limitType})`}function Oi(n,e){return e.isFoundDocument()&&function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):L.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)}(n,e)&&function(r,s){for(const o of Pr(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0}(n,e)&&function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0}(n,e)&&function(r,s){return!(r.startAt&&!function(a,l,h){const d=ru(a,l,h);return a.inclusive?d<=0:d<0}(r.startAt,Pr(r),s)||r.endAt&&!function(a,l,h){const d=ru(a,l,h);return a.inclusive?d>=0:d>0}(r.endAt,Pr(r),s))}(n,e)}function J_(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function _d(n){return(e,t)=>{let r=!1;for(const s of Pr(n)){const o=X_(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function X_(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):function(o,a,l){const h=a.data.field(o),d=l.data.field(o);return h!==null&&d!==null?Hn(h,d):M(42886)}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return M(19790,{direction:n.dir})}}/**
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
 */class _n{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Jt(this.inner,(t,r)=>{for(const[s,o]of r)e(s,o)})}isEmpty(){return td(this.inner)}size(){return this.innerSize}}/**
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
 */const Y_=new ee(L.comparator);function Tt(){return Y_}const Ed=new ee(L.comparator);function Tr(...n){let e=Ed;for(const t of n)e=e.insert(t.key,t);return e}function vd(n){let e=Ed;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function nn(){return kr()}function Id(){return kr()}function kr(){return new _n(n=>n.toString(),(n,e)=>n.isEqual(e))}const Z_=new ee(L.comparator),eE=new ce(L.comparator);function j(...n){let e=eE;for(const t of n)e=e.add(t);return e}const tE=new ce(q);function nE(){return tE}/**
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
 */function Oa(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:li(e)?"-0":e}}function Td(n){return{integerValue:""+n}}function wd(n,e){return k_(e)?Td(e):Oa(n,e)}/**
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
 */class Li{constructor(){this._=void 0}}function rE(n,e,t){return n instanceof $r?function(s,o){const a={fields:{[sd]:{stringValue:rd},[od]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Pa(o)&&(o=Ni(o)),o&&(a.fields[id]=o),{mapValue:a}}(t,e):n instanceof qr?bd(n,e):n instanceof jr?Sd(n,e):function(s,o){const a=Ad(s,o),l=au(a)+au(s.Ae);return Go(a)&&Go(s.Ae)?Td(l):Oa(s.serializer,l)}(n,e)}function sE(n,e,t){return n instanceof qr?bd(n,e):n instanceof jr?Sd(n,e):t}function Ad(n,e){return n instanceof Hr?function(r){return Go(r)||function(o){return!!o&&"doubleValue"in o}(r)}(e)?e:{integerValue:0}:null}class $r extends Li{}class qr extends Li{constructor(e){super(),this.elements=e}}function bd(n,e){const t=Cd(e);for(const r of n.elements)t.some(s=>at(s,r))||t.push(r);return{arrayValue:{values:t}}}class jr extends Li{constructor(e){super(),this.elements=e}}function Sd(n,e){let t=Cd(e);for(const r of n.elements)t=t.filter(s=>!at(s,r));return{arrayValue:{values:t}}}class Hr extends Li{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function au(n){return re(n.integerValue||n.doubleValue)}function Cd(n){return ka(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class Rd{constructor(e,t){this.field=e,this.transform=t}}function iE(n,e){return n.field.isEqual(e.field)&&function(r,s){return r instanceof qr&&s instanceof qr||r instanceof jr&&s instanceof jr?jn(r.elements,s.elements,at):r instanceof Hr&&s instanceof Hr?at(r.Ae,s.Ae):r instanceof $r&&s instanceof $r}(n.transform,e.transform)}class oE{constructor(e,t){this.version=e,this.transformResults=t}}class pt{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new pt}static exists(e){return new pt(void 0,e)}static updateTime(e){return new pt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function js(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class Mi{}function Pd(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new Vd(n.key,pt.none()):new xi(n.key,n.data,pt.none());{const t=n.data,r=Me.empty();let s=new ce(me.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new En(n.key,r,new $e(s.toArray()),pt.none())}}function aE(n,e,t){n instanceof xi?function(s,o,a){const l=s.value.clone(),h=lu(s.fieldTransforms,o,a.transformResults);l.setAll(h),o.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):n instanceof En?function(s,o,a){if(!js(s.precondition,o))return void o.convertToUnknownDocument(a.version);const l=lu(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(kd(s)),h.setAll(l),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()}(n,e,t):function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function Vr(n,e,t,r){return n instanceof xi?function(o,a,l,h){if(!js(o.precondition,a))return l;const d=o.value.clone(),m=uu(o.fieldTransforms,h,a);return d.setAll(m),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof En?function(o,a,l,h){if(!js(o.precondition,a))return l;const d=uu(o.fieldTransforms,h,a),m=a.data;return m.setAll(kd(o)),m.setAll(d),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map(_=>_.field))}(n,e,t,r):function(o,a,l){return js(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l}(n,e,t)}function cE(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=Ad(r.transform,s||null);o!=null&&(t===null&&(t=Me.empty()),t.set(r.field,o))}return t||null}function cu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&jn(r,s,(o,a)=>iE(o,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class xi extends Mi{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class En extends Mi{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function kd(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function lu(n,e,t){const r=new Map;Q(n.length===t.length,32656,{Re:t.length,Ve:n.length});for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,l=e.data.field(o.field);r.set(o.field,sE(a,l,t[s]))}return r}function uu(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,rE(o,a,e))}return r}class Vd extends Mi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class lE extends Mi{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class uE{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&aE(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Vr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Vr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=Id();return this.mutations.forEach(s=>{const o=e.get(s.key),a=o.overlayedDocument;let l=this.applyToLocalView(a,o.mutatedFields);l=t.has(s.key)?null:l;const h=Pd(a,l);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(F.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),j())}isEqual(e){return this.batchId===e.batchId&&jn(this.mutations,e.mutations,(t,r)=>cu(t,r))&&jn(this.baseMutations,e.baseMutations,(t,r)=>cu(t,r))}}class La{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){Q(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let s=function(){return Z_}();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new La(e,t,r,s)}}/**
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
 */class hE{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class dE{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var se,W;function fE(n){switch(n){case S.OK:return M(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return M(15467,{code:n})}}function Nd(n){if(n===void 0)return It("GRPC error has no .code"),S.UNKNOWN;switch(n){case se.OK:return S.OK;case se.CANCELLED:return S.CANCELLED;case se.UNKNOWN:return S.UNKNOWN;case se.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case se.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case se.INTERNAL:return S.INTERNAL;case se.UNAVAILABLE:return S.UNAVAILABLE;case se.UNAUTHENTICATED:return S.UNAUTHENTICATED;case se.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case se.NOT_FOUND:return S.NOT_FOUND;case se.ALREADY_EXISTS:return S.ALREADY_EXISTS;case se.PERMISSION_DENIED:return S.PERMISSION_DENIED;case se.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case se.ABORTED:return S.ABORTED;case se.OUT_OF_RANGE:return S.OUT_OF_RANGE;case se.UNIMPLEMENTED:return S.UNIMPLEMENTED;case se.DATA_LOSS:return S.DATA_LOSS;default:return M(39323,{code:n})}}(W=se||(se={}))[W.OK=0]="OK",W[W.CANCELLED=1]="CANCELLED",W[W.UNKNOWN=2]="UNKNOWN",W[W.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",W[W.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",W[W.NOT_FOUND=5]="NOT_FOUND",W[W.ALREADY_EXISTS=6]="ALREADY_EXISTS",W[W.PERMISSION_DENIED=7]="PERMISSION_DENIED",W[W.UNAUTHENTICATED=16]="UNAUTHENTICATED",W[W.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",W[W.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",W[W.ABORTED=10]="ABORTED",W[W.OUT_OF_RANGE=11]="OUT_OF_RANGE",W[W.UNIMPLEMENTED=12]="UNIMPLEMENTED",W[W.INTERNAL=13]="INTERNAL",W[W.UNAVAILABLE=14]="UNAVAILABLE",W[W.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function mE(){return new TextEncoder}/**
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
 */const pE=new Bt([4294967295,4294967295],0);function hu(n){const e=mE().encode(n),t=new Hh;return t.update(e),new Uint8Array(t.digest())}function du(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new Bt([t,r],0),new Bt([s,o],0)]}class Ma{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new wr(`Invalid padding: ${t}`);if(r<0)throw new wr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new wr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new wr(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Bt.fromNumber(this.ge)}ye(e,t,r){let s=e.add(t.multiply(Bt.fromNumber(r)));return s.compare(pE)===1&&(s=new Bt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=hu(e),[r,s]=du(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new Ma(o,s,t);return r.forEach(l=>a.insert(l)),a}insert(e){if(this.ge===0)return;const t=hu(e),[r,s]=du(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class wr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Fi{constructor(e,t,r,s,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,rs.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Fi(F.min(),s,new ee(q),Tt(),j())}}class rs{constructor(e,t,r,s,o){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new rs(r,t,j(),j(),j())}}/**
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
 */class Hs{constructor(e,t,r,s){this.be=e,this.removedTargetIds=t,this.key=r,this.De=s}}class Dd{constructor(e,t){this.targetId=e,this.Ce=t}}class Od{constructor(e,t,r=pe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class fu{constructor(){this.ve=0,this.Fe=mu(),this.Me=pe.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=j(),t=j(),r=j();return this.Fe.forEach((s,o)=>{switch(o){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:M(38017,{changeType:o})}}),new rs(this.Me,this.xe,e,t,r)}qe(){this.Oe=!1,this.Fe=mu()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,Q(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class gE{constructor(e){this.Ge=e,this.ze=new Map,this.je=Tt(),this.Je=Os(),this.He=Os(),this.Ye=new ee(q)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const r=this.nt(t);switch(e.state){case 0:this.rt(t)&&r.Le(e.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(r.We(),r.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),r.Le(e.resumeToken));break;default:M(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((r,s)=>{this.rt(s)&&t(s)})}st(e){const t=e.targetId,r=e.Ce.count,s=this.ot(t);if(s){const o=s.target;if(Ko(o))if(r===0){const a=new L(o.path);this.et(t,a,we.newNoDocument(a,F.min()))}else Q(r===1,20013,{expectedCount:r});else{const a=this._t(t);if(a!==r){const l=this.ut(e),h=l?this.ct(l,e,a):1;if(h!==0){this.it(t);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,d)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=t;let a,l;try{a=Gt(r).toUint8Array()}catch(h){if(h instanceof nd)return qn("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{l=new Ma(a,s,o)}catch(h){return qn(h instanceof wr?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return l.ge===0?null:l}ct(e,t,r){return t.Ce.count===r-this.Pt(e,t.targetId)?0:2}Pt(e,t){const r=this.Ge.getRemoteKeysForTarget(t);let s=0;return r.forEach(o=>{const a=this.Ge.ht(),l=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(l)||(this.et(t,o,null),s++)}),s}Tt(e){const t=new Map;this.ze.forEach((o,a)=>{const l=this.ot(a);if(l){if(o.current&&Ko(l.target)){const h=new L(l.target.path);this.It(h).has(a)||this.Et(a,h)||this.et(a,h,we.newNoDocument(h,e))}o.Be&&(t.set(a,o.ke()),o.qe())}});let r=j();this.He.forEach((o,a)=>{let l=!0;a.forEachWhile(h=>{const d=this.ot(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(o))}),this.je.forEach((o,a)=>a.setReadTime(e));const s=new Fi(e,t,this.Ye,this.je,r);return this.je=Tt(),this.Je=Os(),this.He=Os(),this.Ye=new ee(q),s}Xe(e,t){if(!this.rt(e))return;const r=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,r),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,r){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.Qe(t,1):s.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),r&&(this.je=this.je.insert(t,r))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new fu,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new ce(q),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new ce(q),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||D("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new fu),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Os(){return new ee(L.comparator)}function mu(){return new ee(L.comparator)}const yE={asc:"ASCENDING",desc:"DESCENDING"},_E={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},EE={and:"AND",or:"OR"};class vE{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Xo(n,e){return n.useProto3Json||Vi(e)?e:{value:e}}function mi(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ld(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function IE(n,e){return mi(n,e.toTimestamp())}function nt(n){return Q(!!n,49232),F.fromTimestamp(function(t){const r=zt(t);return new Z(r.seconds,r.nanos)}(n))}function xa(n,e){return Yo(n,e).canonicalString()}function Yo(n,e){const t=function(s){return new X(["projects",s.projectId,"databases",s.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Md(n){const e=X.fromString(n);return Q($d(e),10190,{key:e.toString()}),e}function Zo(n,e){return xa(n.databaseId,e.path)}function Ro(n,e){const t=Md(e);if(t.get(1)!==n.databaseId.projectId)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(Fd(t))}function xd(n,e){return xa(n.databaseId,e)}function TE(n){const e=Md(n);return e.length===4?X.emptyPath():Fd(e)}function ea(n){return new X(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Fd(n){return Q(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function pu(n,e,t){return{name:Zo(n,e),fields:t.value.mapValue.fields}}function wE(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M(39313,{state:d})}(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],o=function(d,m){return d.useProto3Json?(Q(m===void 0||typeof m=="string",58123),pe.fromBase64String(m||"")):(Q(m===void 0||m instanceof Buffer||m instanceof Uint8Array,16193),pe.fromUint8Array(m||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&function(d){const m=d.code===void 0?S.UNKNOWN:Nd(d.code);return new N(m,d.message||"")}(a);t=new Od(r,s,o,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Ro(n,r.document.name),o=nt(r.document.updateTime),a=r.document.createTime?nt(r.document.createTime):F.min(),l=new Me({mapValue:{fields:r.document.fields}}),h=we.newFoundDocument(s,o,a,l),d=r.targetIds||[],m=r.removedTargetIds||[];t=new Hs(d,m,h.key,h)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Ro(n,r.document),o=r.readTime?nt(r.readTime):F.min(),a=we.newNoDocument(s,o),l=r.removedTargetIds||[];t=new Hs([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Ro(n,r.document),o=r.removedTargetIds||[];t=new Hs([],o,s,null)}else{if(!("filter"in e))return M(11601,{Rt:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new dE(s,o),l=r.targetId;t=new Dd(l,a)}}return t}function AE(n,e){let t;if(e instanceof xi)t={update:pu(n,e.key,e.value)};else if(e instanceof Vd)t={delete:Zo(n,e.key)};else if(e instanceof En)t={update:pu(n,e.key,e.data),updateMask:DE(e.fieldMask)};else{if(!(e instanceof lE))return M(16599,{Vt:e.type});t={verify:Zo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(o,a){const l=a.transform;if(l instanceof $r)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof qr)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof jr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Hr)return{fieldPath:a.field.canonicalString(),increment:l.Ae};throw M(20930,{transform:a.transform})}(0,r))),e.precondition.isNone||(t.currentDocument=function(s,o){return o.updateTime!==void 0?{updateTime:IE(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:M(27497)}(n,e.precondition)),t}function bE(n,e){return n&&n.length>0?(Q(e!==void 0,14353),n.map(t=>function(s,o){let a=s.updateTime?nt(s.updateTime):nt(o);return a.isEqual(F.min())&&(a=nt(o)),new oE(a,s.transformResults||[])}(t,e))):[]}function SE(n,e){return{documents:[xd(n,e.path)]}}function CE(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=xd(n,s);const o=function(d){if(d.length!==0)return Ud(qe.create(d,"and"))}(e.filters);o&&(t.structuredQuery.where=o);const a=function(d){if(d.length!==0)return d.map(m=>function(E){return{field:Cn(E.field),direction:kE(E.dir)}}(m))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Xo(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{ft:t,parent:s}}function RE(n){let e=TE(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){Q(r===1,65062);const m=t.from[0];m.allDescendants?s=m.collectionId:e=e.child(m.collectionId)}let o=[];t.where&&(o=function(_){const E=Bd(_);return E instanceof qe&&dd(E)?E.getFilters():[E]}(t.where));let a=[];t.orderBy&&(a=function(_){return _.map(E=>function(P){return new fi(Rn(P.field),function(V){switch(V){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(P.direction))}(E))}(t.orderBy));let l=null;t.limit&&(l=function(_){let E;return E=typeof _=="object"?_.value:_,Vi(E)?null:E}(t.limit));let h=null;t.startAt&&(h=function(_){const E=!!_.before,R=_.values||[];return new di(R,E)}(t.startAt));let d=null;return t.endAt&&(d=function(_){const E=!_.before,R=_.values||[];return new di(R,E)}(t.endAt)),K_(e,s,a,o,l,"F",h,d)}function PE(n,e){const t=function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Bd(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=Rn(t.unaryFilter.field);return ie.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Rn(t.unaryFilter.field);return ie.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Rn(t.unaryFilter.field);return ie.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Rn(t.unaryFilter.field);return ie.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}}(n):n.fieldFilter!==void 0?function(t){return ie.create(Rn(t.fieldFilter.field),function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return qe.create(t.compositeFilter.filters.map(r=>Bd(r)),function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}}(t.compositeFilter.op))}(n):M(30097,{filter:n})}function kE(n){return yE[n]}function VE(n){return _E[n]}function NE(n){return EE[n]}function Cn(n){return{fieldPath:n.canonicalString()}}function Rn(n){return me.fromServerFormat(n.fieldPath)}function Ud(n){return n instanceof ie?function(t){if(t.op==="=="){if(nu(t.value))return{unaryFilter:{field:Cn(t.field),op:"IS_NAN"}};if(tu(t.value))return{unaryFilter:{field:Cn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(nu(t.value))return{unaryFilter:{field:Cn(t.field),op:"IS_NOT_NAN"}};if(tu(t.value))return{unaryFilter:{field:Cn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Cn(t.field),op:VE(t.op),value:t.value}}}(n):n instanceof qe?function(t){const r=t.getFilters().map(s=>Ud(s));return r.length===1?r[0]:{compositeFilter:{op:NE(t.op),filters:r}}}(n):M(54877,{filter:n})}function DE(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function $d(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class Lt{constructor(e,t,r,s,o=F.min(),a=F.min(),l=pe.EMPTY_BYTE_STRING,h=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=h}withSequenceNumber(e){return new Lt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Lt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Lt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Lt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class OE{constructor(e){this.yt=e}}function LE(n){const e=RE({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Jo(e,e.limit,"L"):e}/**
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
 */class ME{constructor(){this.Cn=new xE}addToCollectionParentIndex(e,t){return this.Cn.add(t),C.resolve()}getCollectionParents(e,t){return C.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return C.resolve()}deleteFieldIndex(e,t){return C.resolve()}deleteAllFieldIndexes(e){return C.resolve()}createTargetIndexes(e,t){return C.resolve()}getDocumentsMatchingTarget(e,t){return C.resolve(null)}getIndexType(e,t){return C.resolve(0)}getFieldIndexes(e,t){return C.resolve([])}getNextCollectionGroupToUpdate(e){return C.resolve(null)}getMinOffset(e,t){return C.resolve(Ht.min())}getMinOffsetFromCollectionGroup(e,t){return C.resolve(Ht.min())}updateCollectionGroup(e,t,r){return C.resolve()}updateIndexEntries(e,t){return C.resolve()}}class xE{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ce(X.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ce(X.comparator)).toArray()}}/**
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
 */const gu={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},qd=41943040;class Ve{static withCacheSize(e){return new Ve(e,Ve.DEFAULT_COLLECTION_PERCENTILE,Ve.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
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
 */Ve.DEFAULT_COLLECTION_PERCENTILE=10,Ve.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ve.DEFAULT=new Ve(qd,Ve.DEFAULT_COLLECTION_PERCENTILE,Ve.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ve.DISABLED=new Ve(-1,0,0);/**
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
 */class Gn{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new Gn(0)}static cr(){return new Gn(-1)}}/**
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
 */const yu="LruGarbageCollector",FE=1048576;function _u([n,e],[t,r]){const s=q(n,t);return s===0?q(e,r):s}class BE{constructor(e){this.Ir=e,this.buffer=new ce(_u),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();_u(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class UE{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){D(yu,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){er(t)?D(yu,"Ignoring IndexedDB error during garbage collection: ",t):await Zn(t)}await this.Vr(3e5)})}}class $E{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return C.resolve(ki.ce);const r=new BE(t);return this.mr.forEachTarget(e,s=>r.Ar(s.sequenceNumber)).next(()=>this.mr.pr(e,s=>r.Ar(s))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.mr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(D("LruGarbageCollector","Garbage collection skipped; disabled"),C.resolve(gu)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(D("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),gu):this.yr(e,t))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let r,s,o,a,l,h,d;const m=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(_=>(_>this.params.maximumSequenceNumbersToCollect?(D("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${_}`),s=this.params.maximumSequenceNumbersToCollect):s=_,a=Date.now(),this.nthSequenceNumber(e,s))).next(_=>(r=_,l=Date.now(),this.removeTargets(e,r,t))).next(_=>(o=_,h=Date.now(),this.removeOrphanedDocuments(e,r))).next(_=>(d=Date.now(),bn()<=$.DEBUG&&D("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-m}ms
	Determined least recently used ${s} in `+(l-a)+`ms
	Removed ${o} targets in `+(h-l)+`ms
	Removed ${_} documents in `+(d-h)+`ms
Total Duration: ${d-m}ms`),C.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:_})))}}function qE(n,e){return new $E(n,e)}/**
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
 */class jE{constructor(){this.changes=new _n(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,we.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?C.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 *//**
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
 */class HE{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class zE{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(s=>(r=s,this.remoteDocumentCache.getEntry(e,t))).next(s=>(r!==null&&Vr(r.mutation,s,$e.empty(),Z.now()),s))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,j()).next(()=>r))}getLocalViewOfDocuments(e,t,r=j()){const s=nn();return this.populateOverlays(e,s,t).next(()=>this.computeViews(e,t,s,r).next(o=>{let a=Tr();return o.forEach((l,h)=>{a=a.insert(l,h.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=nn();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,j()))}populateOverlays(e,t,r){const s=[];return r.forEach(o=>{t.has(o)||s.push(o)}),this.documentOverlayCache.getOverlays(e,s).next(o=>{o.forEach((a,l)=>{t.set(a,l)})})}computeViews(e,t,r,s){let o=Tt();const a=kr(),l=function(){return kr()}();return t.forEach((h,d)=>{const m=r.get(d.key);s.has(d.key)&&(m===void 0||m.mutation instanceof En)?o=o.insert(d.key,d):m!==void 0?(a.set(d.key,m.mutation.getFieldMask()),Vr(m.mutation,d,m.mutation.getFieldMask(),Z.now())):a.set(d.key,$e.empty())}),this.recalculateAndSaveOverlays(e,o).next(h=>(h.forEach((d,m)=>a.set(d,m)),t.forEach((d,m)=>l.set(d,new HE(m,a.get(d)??null))),l))}recalculateAndSaveOverlays(e,t){const r=kr();let s=new ee((a,l)=>a-l),o=j();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const l of a)l.keys().forEach(h=>{const d=t.get(h);if(d===null)return;let m=r.get(h)||$e.empty();m=l.applyToLocalView(d,m),r.set(h,m);const _=(s.get(l.batchId)||j()).add(h);s=s.insert(l.batchId,_)})}).next(()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const h=l.getNext(),d=h.key,m=h.value,_=Id();m.forEach(E=>{if(!o.has(E)){const R=Pd(t.get(E),r.get(E));R!==null&&_.set(E,R),o=o.add(E)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,_))}return C.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,s){return function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):gd(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next(o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):C.resolve(nn());let l=xr,h=o;return a.next(d=>C.forEach(d,(m,_)=>(l<_.largestBatchId&&(l=_.largestBatchId),o.get(m)?C.resolve():this.remoteDocumentCache.getEntry(e,m).next(E=>{h=h.insert(m,E)}))).next(()=>this.populateOverlays(e,d,o)).next(()=>this.computeViews(e,h,d,j())).next(m=>({batchId:l,changes:vd(m)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(r=>{let s=Tr();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s})}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=Tr();return this.indexManager.getCollectionParents(e,o).next(l=>C.forEach(l,h=>{const d=function(_,E){return new ns(E,null,_.explicitOrderBy.slice(),_.filters.slice(),_.limit,_.limitType,_.startAt,_.endAt)}(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next(m=>{m.forEach((_,E)=>{a=a.insert(_,E)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s))).next(a=>{o.forEach((h,d)=>{const m=d.getKey();a.get(m)===null&&(a=a.insert(m,we.newInvalidDocument(m)))});let l=Tr();return a.forEach((h,d)=>{const m=o.get(h);m!==void 0&&Vr(m.mutation,d,$e.empty(),Z.now()),Oi(t,d)&&(l=l.insert(h,d))}),l})}}/**
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
 */class GE{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return C.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,function(s){return{id:s.id,version:s.version,createTime:nt(s.createTime)}}(t)),C.resolve()}getNamedQuery(e,t){return C.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,function(s){return{name:s.name,query:LE(s.bundledQuery),readTime:nt(s.readTime)}}(t)),C.resolve()}}/**
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
 */class WE{constructor(){this.overlays=new ee(L.comparator),this.qr=new Map}getOverlay(e,t){return C.resolve(this.overlays.get(t))}getOverlays(e,t){const r=nn();return C.forEach(t,s=>this.getOverlay(e,s).next(o=>{o!==null&&r.set(s,o)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((s,o)=>{this.St(e,t,o)}),C.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach(o=>this.overlays=this.overlays.remove(o)),this.qr.delete(r)),C.resolve()}getOverlaysForCollection(e,t,r){const s=nn(),o=t.length+1,a=new L(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const h=l.getNext().value,d=h.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return C.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new ee((d,m)=>d-m);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let m=o.get(d.largestBatchId);m===null&&(m=nn(),o=o.insert(d.largestBatchId,m)),m.set(d.getKey(),d)}}const l=nn(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach((d,m)=>l.set(d,m)),!(l.size()>=s)););return C.resolve(l)}St(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new hE(t,r));let o=this.qr.get(t);o===void 0&&(o=j(),this.qr.set(t,o)),this.qr.set(t,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
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
 */class KE{constructor(){this.sessionToken=pe.EMPTY_BYTE_STRING}getSessionToken(e){return C.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,C.resolve()}}/**
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
 */class Fa{constructor(){this.Qr=new ce(le.$r),this.Ur=new ce(le.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const r=new le(e,t);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Gr(new le(e,t))}zr(e,t){e.forEach(r=>this.removeReference(r,t))}jr(e){const t=new L(new X([])),r=new le(t,e),s=new le(t,e+1),o=[];return this.Ur.forEachInRange([r,s],a=>{this.Gr(a),o.push(a.key)}),o}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new L(new X([])),r=new le(t,e),s=new le(t,e+1);let o=j();return this.Ur.forEachInRange([r,s],a=>{o=o.add(a.key)}),o}containsKey(e){const t=new le(e,0),r=this.Qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class le{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return L.comparator(e.key,t.key)||q(e.Yr,t.Yr)}static Kr(e,t){return q(e.Yr,t.Yr)||L.comparator(e.key,t.key)}}/**
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
 */class QE{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new ce(le.$r)}checkEmpty(e){return C.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new uE(o,t,r,s);this.mutationQueue.push(a);for(const l of s)this.Zr=this.Zr.add(new le(l.key,o)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return C.resolve(a)}lookupMutationBatch(e,t){return C.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.ei(r),o=s<0?0:s;return C.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return C.resolve(this.mutationQueue.length===0?Ra:this.tr-1)}getAllMutationBatches(e){return C.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new le(t,0),s=new le(t,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([r,s],a=>{const l=this.Xr(a.Yr);o.push(l)}),C.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ce(q);return t.forEach(s=>{const o=new le(s,0),a=new le(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,a],l=>{r=r.add(l.Yr)})}),C.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;L.isDocumentKey(o)||(o=o.child(""));const a=new le(new L(o),0);let l=new ce(q);return this.Zr.forEachWhile(h=>{const d=h.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(h.Yr)),!0)},a),C.resolve(this.ti(l))}ti(e){const t=[];return e.forEach(r=>{const s=this.Xr(r);s!==null&&t.push(s)}),t}removeMutationBatch(e,t){Q(this.ni(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return C.forEach(t.mutations,s=>{const o=new le(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)}).next(()=>{this.Zr=r})}ir(e){}containsKey(e,t){const r=new le(t,0),s=this.Zr.firstAfterOrEqual(r);return C.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,C.resolve()}ni(e,t){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class JE{constructor(e){this.ri=e,this.docs=function(){return new ee(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.ri(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return C.resolve(r?r.document.mutableCopy():we.newInvalidDocument(t))}getEntries(e,t){let r=Tt();return t.forEach(s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():we.newInvalidDocument(s))}),C.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=Tt();const a=t.path,l=new L(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(l);for(;h.hasNext();){const{key:d,value:{document:m}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||S_(b_(m),r)<=0||(s.has(m.key)||Oi(t,m))&&(o=o.insert(m.key,m.mutableCopy()))}return C.resolve(o)}getAllFromCollectionGroup(e,t,r,s){M(9500)}ii(e,t){return C.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new XE(this)}getSize(e){return C.resolve(this.size)}}class XE extends jE{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach((r,s)=>{s.isValidDocument()?t.push(this.Nr.addEntry(e,s)):this.Nr.removeEntry(r)}),C.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}/**
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
 */class YE{constructor(e){this.persistence=e,this.si=new _n(t=>Va(t),Na),this.lastRemoteSnapshotVersion=F.min(),this.highestTargetId=0,this.oi=0,this._i=new Fa,this.targetCount=0,this.ai=Gn.ur()}forEachTarget(e,t){return this.si.forEach((r,s)=>t(s)),C.resolve()}getLastRemoteSnapshotVersion(e){return C.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return C.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),C.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.oi&&(this.oi=t),C.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new Gn(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,C.resolve()}updateTargetData(e,t){return this.Pr(t),C.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,C.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.si.forEach((a,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.si.delete(a),o.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)}),C.waitFor(o).next(()=>s)}getTargetCount(e){return C.resolve(this.targetCount)}getTargetData(e,t){const r=this.si.get(t)||null;return C.resolve(r)}addMatchingKeys(e,t,r){return this._i.Wr(t,r),C.resolve()}removeMatchingKeys(e,t,r){this._i.zr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach(a=>{o.push(s.markPotentiallyOrphaned(e,a))}),C.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),C.resolve()}getMatchingKeysForTargetId(e,t){const r=this._i.Hr(t);return C.resolve(r)}containsKey(e,t){return C.resolve(this._i.containsKey(t))}}/**
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
 */class jd{constructor(e,t){this.ui={},this.overlays={},this.ci=new ki(0),this.li=!1,this.li=!0,this.hi=new KE,this.referenceDelegate=e(this),this.Pi=new YE(this),this.indexManager=new ME,this.remoteDocumentCache=function(s){return new JE(s)}(r=>this.referenceDelegate.Ti(r)),this.serializer=new OE(t),this.Ii=new GE(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new WE,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ui[e.toKey()];return r||(r=new QE(t,this.referenceDelegate),this.ui[e.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,r){D("MemoryPersistence","Starting transaction:",e);const s=new ZE(this.ci.next());return this.referenceDelegate.Ei(),r(s).next(o=>this.referenceDelegate.di(s).next(()=>o)).toPromise().then(o=>(s.raiseOnCommittedEvent(),o))}Ai(e,t){return C.or(Object.values(this.ui).map(r=>()=>r.containsKey(e,t)))}}class ZE extends R_{constructor(e){super(),this.currentSequenceNumber=e}}class Ba{constructor(e){this.persistence=e,this.Ri=new Fa,this.Vi=null}static mi(e){return new Ba(e)}get fi(){if(this.Vi)return this.Vi;throw M(60996)}addReference(e,t,r){return this.Ri.addReference(r,t),this.fi.delete(r.toString()),C.resolve()}removeReference(e,t,r){return this.Ri.removeReference(r,t),this.fi.add(r.toString()),C.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),C.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach(s=>this.fi.add(s.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(s=>{s.forEach(o=>this.fi.add(o.toString()))}).next(()=>r.removeTargetData(e,t))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return C.forEach(this.fi,r=>{const s=L.fromPath(r);return this.gi(e,s).next(o=>{o||t.removeEntry(s,F.min())})}).next(()=>(this.Vi=null,t.apply(e)))}updateLimboDocument(e,t){return this.gi(e,t).next(r=>{r?this.fi.delete(t.toString()):this.fi.add(t.toString())})}Ti(e){return 0}gi(e,t){return C.or([()=>C.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class pi{constructor(e,t){this.persistence=e,this.pi=new _n(r=>V_(r.path),(r,s)=>r.isEqual(s)),this.garbageCollector=qE(this,t)}static mi(e,t){return new pi(e,t)}Ei(){}di(e){return C.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>t.next(s=>r+s))}wr(e){let t=0;return this.pr(e,r=>{t++}).next(()=>t)}pr(e,t){return C.forEach(this.pi,(r,s)=>this.br(e,r,s).next(o=>o?C.resolve():t(s)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(e,a=>this.br(e,a,t).next(l=>{l||(r++,o.removeEntry(a,F.min()))})).next(()=>o.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),C.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.pi.set(r,e.currentSequenceNumber),C.resolve()}removeReference(e,t,r){return this.pi.set(r,e.currentSequenceNumber),C.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),C.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=$s(e.data.value)),t}br(e,t,r){return C.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.pi.get(t);return C.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class Ua{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Es=r,this.ds=s}static As(e,t){let r=j(),s=j();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Ua(e,t.fromCache,r,s)}}/**
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
 */class ev{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class tv{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return Jm()?8:P_(be())>0?6:4}()}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.ys(e,t).next(a=>{o.result=a}).next(()=>{if(!o.result)return this.ws(e,t,s,r).next(a=>{o.result=a})}).next(()=>{if(o.result)return;const a=new ev;return this.Ss(e,t,a).next(l=>{if(o.result=l,this.Vs)return this.bs(e,t,a,l.size)})}).next(()=>o.result)}bs(e,t,r,s){return r.documentReadCount<this.fs?(bn()<=$.DEBUG&&D("QueryEngine","SDK will not create cache indexes for query:",Sn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),C.resolve()):(bn()<=$.DEBUG&&D("QueryEngine","Query:",Sn(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(bn()<=$.DEBUG&&D("QueryEngine","The SDK decides to create cache indexes for query:",Sn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,tt(t))):C.resolve())}ys(e,t){if(ou(t))return C.resolve(null);let r=tt(t);return this.indexManager.getIndexType(e,r).next(s=>s===0?null:(t.limit!==null&&s===1&&(t=Jo(t,null,"F"),r=tt(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(o=>{const a=j(...o);return this.ps.getDocuments(e,a).next(l=>this.indexManager.getMinOffset(e,r).next(h=>{const d=this.Ds(t,l);return this.Cs(t,d,a,h.readTime)?this.ys(e,Jo(t,null,"F")):this.vs(e,d,t,h)}))})))}ws(e,t,r,s){return ou(t)||s.isEqual(F.min())?C.resolve(null):this.ps.getDocuments(e,r).next(o=>{const a=this.Ds(t,o);return this.Cs(t,a,r,s)?C.resolve(null):(bn()<=$.DEBUG&&D("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Sn(t)),this.vs(e,a,t,A_(s,xr)).next(l=>l))})}Ds(e,t){let r=new ce(_d(e));return t.forEach((s,o)=>{Oi(e,o)&&(r=r.add(o))}),r}Cs(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(e,t,r){return bn()<=$.DEBUG&&D("QueryEngine","Using full collection scan to execute query:",Sn(t)),this.ps.getDocumentsMatchingQuery(e,t,Ht.min(),r)}vs(e,t,r,s){return this.ps.getDocumentsMatchingQuery(e,r,s).next(o=>(t.forEach(a=>{o=o.insert(a.key,a)}),o))}}/**
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
 */const $a="LocalStore",nv=3e8;class rv{constructor(e,t,r,s){this.persistence=e,this.Fs=t,this.serializer=s,this.Ms=new ee(q),this.xs=new _n(o=>Va(o),Na),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(r)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new zE(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ms))}}function sv(n,e,t,r){return new rv(n,e,t,r)}async function Hd(n,e){const t=B(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next(o=>(s=o,t.Bs(e),t.mutationQueue.getAllMutationBatches(r))).next(o=>{const a=[],l=[];let h=j();for(const d of s){a.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}for(const d of o){l.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}return t.localDocuments.getDocuments(r,h).next(d=>({Ls:d,removedBatchIds:a,addedBatchIds:l}))})})}function iv(n,e){const t=B(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const s=e.batch.keys(),o=t.Ns.newChangeBuffer({trackRemovals:!0});return function(l,h,d,m){const _=d.batch,E=_.keys();let R=C.resolve();return E.forEach(P=>{R=R.next(()=>m.getEntry(h,P)).next(O=>{const V=d.docVersions.get(P);Q(V!==null,48541),O.version.compareTo(V)<0&&(_.applyToRemoteDocument(O,d),O.isValidDocument()&&(O.setReadTime(d.commitVersion),m.addEntry(O)))})}),R.next(()=>l.mutationQueue.removeMutationBatch(h,_))}(t,r,e,o).next(()=>o.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let h=j();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(h=h.add(l.batch.mutations[d].key));return h}(e))).next(()=>t.localDocuments.getDocuments(r,s))})}function zd(n){const e=B(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Pi.getLastRemoteSnapshotVersion(t))}function ov(n,e){const t=B(n),r=e.snapshotVersion;let s=t.Ms;return t.persistence.runTransaction("Apply remote event","readwrite-primary",o=>{const a=t.Ns.newChangeBuffer({trackRemovals:!0});s=t.Ms;const l=[];e.targetChanges.forEach((m,_)=>{const E=s.get(_);if(!E)return;l.push(t.Pi.removeMatchingKeys(o,m.removedDocuments,_).next(()=>t.Pi.addMatchingKeys(o,m.addedDocuments,_)));let R=E.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(_)!==null?R=R.withResumeToken(pe.EMPTY_BYTE_STRING,F.min()).withLastLimboFreeSnapshotVersion(F.min()):m.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(m.resumeToken,r)),s=s.insert(_,R),function(O,V,H){return O.resumeToken.approximateByteSize()===0||V.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=nv?!0:H.addedDocuments.size+H.modifiedDocuments.size+H.removedDocuments.size>0}(E,R,m)&&l.push(t.Pi.updateTargetData(o,R))});let h=Tt(),d=j();if(e.documentUpdates.forEach(m=>{e.resolvedLimboDocuments.has(m)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(o,m))}),l.push(av(o,a,e.documentUpdates).next(m=>{h=m.ks,d=m.qs})),!r.isEqual(F.min())){const m=t.Pi.getLastRemoteSnapshotVersion(o).next(_=>t.Pi.setTargetsMetadata(o,o.currentSequenceNumber,r));l.push(m)}return C.waitFor(l).next(()=>a.apply(o)).next(()=>t.localDocuments.getLocalViewOfDocuments(o,h,d)).next(()=>h)}).then(o=>(t.Ms=s,o))}function av(n,e,t){let r=j(),s=j();return t.forEach(o=>r=r.add(o)),e.getEntries(n,r).next(o=>{let a=Tt();return t.forEach((l,h)=>{const d=o.get(l);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),h.isNoDocument()&&h.version.isEqual(F.min())?(e.removeEntry(l,h.readTime),a=a.insert(l,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(h),a=a.insert(l,h)):D($a,"Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",h.version)}),{ks:a,qs:s}})}function cv(n,e){const t=B(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=Ra),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function lv(n,e){const t=B(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let s;return t.Pi.getTargetData(r,e).next(o=>o?(s=o,C.resolve(s)):t.Pi.allocateTargetId(r).next(a=>(s=new Lt(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Pi.addTargetData(r,s).next(()=>s))))}).then(r=>{const s=t.Ms.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Ms=t.Ms.insert(r.targetId,r),t.xs.set(e,r.targetId)),r})}async function ta(n,e,t){const r=B(n),s=r.Ms.get(e),o=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",o,a=>r.persistence.referenceDelegate.removeTarget(a,s))}catch(a){if(!er(a))throw a;D($a,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Ms=r.Ms.remove(e),r.xs.delete(s.target)}function Eu(n,e,t){const r=B(n);let s=F.min(),o=j();return r.persistence.runTransaction("Execute query","readwrite",a=>function(h,d,m){const _=B(h),E=_.xs.get(m);return E!==void 0?C.resolve(_.Ms.get(E)):_.Pi.getTargetData(d,m)}(r,a,tt(e)).next(l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(a,l.targetId).next(h=>{o=h})}).next(()=>r.Fs.getDocumentsMatchingQuery(a,e,t?s:F.min(),t?o:j())).next(l=>(uv(r,J_(e),l),{documents:l,Qs:o})))}function uv(n,e,t){let r=n.Os.get(e)||F.min();t.forEach((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)}),n.Os.set(e,r)}class vu{constructor(){this.activeTargetIds=nE()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class hv{constructor(){this.Mo=new vu,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,r){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new vu,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class dv{Oo(e){}shutdown(){}}/**
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
 */const Iu="ConnectivityMonitor";class Tu{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){D(Iu,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){D(Iu,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Ls=null;function na(){return Ls===null?Ls=function(){return 268435456+Math.round(2147483648*Math.random())}():Ls++,"0x"+Ls.toString(16)}/**
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
 */const Po="RestConnection",fv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class mv{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===ui?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(e,t,r,s,o){const a=na(),l=this.zo(e,t.toUriEncodedString());D(Po,`Sending RPC '${e}' ${a}:`,l,r);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(h,s,o);const{host:d}=new URL(l),m=Qn(d);return this.Jo(e,l,h,r,m).then(_=>(D(Po,`Received RPC '${e}' ${a}: `,_),_),_=>{throw qn(Po,`RPC '${e}' ${a} failed with error: `,_,"url: ",l,"request:",r),_})}Ho(e,t,r,s,o,a){return this.Go(e,t,r,s,o)}jo(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Yn}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((s,o)=>e[o]=s),r&&r.headers.forEach((s,o)=>e[o]=s)}zo(e,t){const r=fv[e];return`${this.Uo}/v1/${t}:${r}`}terminate(){}}/**
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
 */class pv{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
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
 */const Ie="WebChannelConnection";class gv extends mv{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,r,s,o){const a=na();return new Promise((l,h)=>{const d=new zh;d.setWithCredentials(!0),d.listenOnce(Gh.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case Us.NO_ERROR:const _=d.getResponseJson();D(Ie,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(_)),l(_);break;case Us.TIMEOUT:D(Ie,`RPC '${e}' ${a} timed out`),h(new N(S.DEADLINE_EXCEEDED,"Request time out"));break;case Us.HTTP_ERROR:const E=d.getStatus();if(D(Ie,`RPC '${e}' ${a} failed with status:`,E,"response text:",d.getResponseText()),E>0){let R=d.getResponseJson();Array.isArray(R)&&(R=R[0]);const P=R?.error;if(P&&P.status&&P.message){const O=function(H){const U=H.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(U)>=0?U:S.UNKNOWN}(P.status);h(new N(O,P.message))}else h(new N(S.UNKNOWN,"Server responded with status "+d.getStatus()))}else h(new N(S.UNAVAILABLE,"Connection failed."));break;default:M(9055,{l_:e,streamId:a,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{D(Ie,`RPC '${e}' ${a} completed.`)}});const m=JSON.stringify(s);D(Ie,`RPC '${e}' ${a} sending request:`,s),d.send(t,"POST",m,r,15)})}T_(e,t,r){const s=na(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Qh(),l=Kh(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(h.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(h.useFetchStreams=!0),this.jo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const m=o.join("");D(Ie,`Creating RPC '${e}' stream ${s}: ${m}`,h);const _=a.createWebChannel(m,h);this.I_(_);let E=!1,R=!1;const P=new pv({Yo:V=>{R?D(Ie,`Not sending because RPC '${e}' stream ${s} is closed:`,V):(E||(D(Ie,`Opening RPC '${e}' stream ${s} transport.`),_.open(),E=!0),D(Ie,`RPC '${e}' stream ${s} sending:`,V),_.send(V))},Zo:()=>_.close()}),O=(V,H,U)=>{V.listen(H,G=>{try{U(G)}catch(ue){setTimeout(()=>{throw ue},0)}})};return O(_,Ir.EventType.OPEN,()=>{R||(D(Ie,`RPC '${e}' stream ${s} transport opened.`),P.o_())}),O(_,Ir.EventType.CLOSE,()=>{R||(R=!0,D(Ie,`RPC '${e}' stream ${s} transport closed`),P.a_(),this.E_(_))}),O(_,Ir.EventType.ERROR,V=>{R||(R=!0,qn(Ie,`RPC '${e}' stream ${s} transport errored. Name:`,V.name,"Message:",V.message),P.a_(new N(S.UNAVAILABLE,"The operation could not be completed")))}),O(_,Ir.EventType.MESSAGE,V=>{if(!R){const H=V.data[0];Q(!!H,16349);const U=H,G=U?.error||U[0]?.error;if(G){D(Ie,`RPC '${e}' stream ${s} received error:`,G);const ue=G.status;let Ke=function(p){const y=se[p];if(y!==void 0)return Nd(y)}(ue),ge=G.message;Ke===void 0&&(Ke=S.INTERNAL,ge="Unknown error status: "+ue+" with message "+G.message),R=!0,P.a_(new N(Ke,ge)),_.close()}else D(Ie,`RPC '${e}' stream ${s} received:`,H),P.u_(H)}}),O(l,Wh.STAT_EVENT,V=>{V.stat===jo.PROXY?D(Ie,`RPC '${e}' stream ${s} detected buffering proxy`):V.stat===jo.NOPROXY&&D(Ie,`RPC '${e}' stream ${s} detected no buffering proxy`)}),setTimeout(()=>{P.__()},0),P}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(t=>t===e)}}function ko(){return typeof document<"u"?document:null}/**
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
 */function Bi(n){return new vE(n,!0)}/**
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
 */class Gd{constructor(e,t,r=1e3,s=1.5,o=6e4){this.Mi=e,this.timerId=t,this.d_=r,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-r);s>0&&D("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
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
 */const wu="PersistentStream";class Wd{constructor(e,t,r,s,o,a,l,h){this.Mi=e,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Gd(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(It(t.toString()),It("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,s])=>{this.D_===t&&this.G_(r,s)},r=>{e(()=>{const s=new N(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)})})}G_(e,t){const r=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo(()=>{r(()=>this.listener.Xo())}),this.stream.t_(()=>{r(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(s=>{r(()=>this.z_(s))}),this.stream.onMessage(s=>{r(()=>++this.F_==1?this.J_(s):this.onNext(s))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return D(wu,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget(()=>this.D_===e?t():(D(wu,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class yv extends Wd{constructor(e,t,r,s,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=wE(this.serializer,e),r=function(o){if(!("targetChange"in o))return F.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?F.min():a.readTime?nt(a.readTime):F.min()}(e);return this.listener.H_(t,r)}Y_(e){const t={};t.database=ea(this.serializer),t.addTarget=function(o,a){let l;const h=a.target;if(l=Ko(h)?{documents:SE(o,h)}:{query:CE(o,h).ft},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Ld(o,a.resumeToken);const d=Xo(o,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(F.min())>0){l.readTime=mi(o,a.snapshotVersion.toTimestamp());const d=Xo(o,a.expectedCount);d!==null&&(l.expectedCount=d)}return l}(this.serializer,e);const r=PE(this.serializer,e);r&&(t.labels=r),this.q_(t)}Z_(e){const t={};t.database=ea(this.serializer),t.removeTarget=e,this.q_(t)}}class _v extends Wd{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return Q(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Q(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){Q(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=bE(e.writeResults,e.commitTime),r=nt(e.commitTime);return this.listener.na(r,t)}ra(){const e={};e.database=ea(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>AE(this.serializer,r))};this.q_(t)}}/**
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
 */class Ev{}class vv extends Ev{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,a])=>this.connection.Go(e,Yo(t,r),s,o,a)).catch(o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(S.UNKNOWN,o.toString())})}Ho(e,t,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,l])=>this.connection.Ho(e,Yo(t,r),s,a,l,o)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new N(S.UNKNOWN,a.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class Iv{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(It(t),this.aa=!1):D("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const gn="RemoteStore";class Tv{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo(a=>{r.enqueueAndForget(async()=>{vn(this)&&(D(gn,"Restarting streams for network reachability change."),await async function(h){const d=B(h);d.Ea.add(4),await ss(d),d.Ra.set("Unknown"),d.Ea.delete(4),await Ui(d)}(this))})}),this.Ra=new Iv(r,s)}}async function Ui(n){if(vn(n))for(const e of n.da)await e(!0)}async function ss(n){for(const e of n.da)await e(!1)}function Kd(n,e){const t=B(n);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),za(t)?Ha(t):tr(t).O_()&&ja(t,e))}function qa(n,e){const t=B(n),r=tr(t);t.Ia.delete(e),r.O_()&&Qd(t,e),t.Ia.size===0&&(r.O_()?r.L_():vn(t)&&t.Ra.set("Unknown"))}function ja(n,e){if(n.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(F.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}tr(n).Y_(e)}function Qd(n,e){n.Va.Ue(e),tr(n).Z_(e)}function Ha(n){n.Va=new gE({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),At:e=>n.Ia.get(e)||null,ht:()=>n.datastore.serializer.databaseId}),tr(n).start(),n.Ra.ua()}function za(n){return vn(n)&&!tr(n).x_()&&n.Ia.size>0}function vn(n){return B(n).Ea.size===0}function Jd(n){n.Va=void 0}async function wv(n){n.Ra.set("Online")}async function Av(n){n.Ia.forEach((e,t)=>{ja(n,e)})}async function bv(n,e){Jd(n),za(n)?(n.Ra.ha(e),Ha(n)):n.Ra.set("Unknown")}async function Sv(n,e,t){if(n.Ra.set("Online"),e instanceof Od&&e.state===2&&e.cause)try{await async function(s,o){const a=o.cause;for(const l of o.targetIds)s.Ia.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.Ia.delete(l),s.Va.removeTarget(l))}(n,e)}catch(r){D(gn,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await gi(n,r)}else if(e instanceof Hs?n.Va.Ze(e):e instanceof Dd?n.Va.st(e):n.Va.tt(e),!t.isEqual(F.min()))try{const r=await zd(n.localStore);t.compareTo(r)>=0&&await function(o,a){const l=o.Va.Tt(a);return l.targetChanges.forEach((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const m=o.Ia.get(d);m&&o.Ia.set(d,m.withResumeToken(h.resumeToken,a))}}),l.targetMismatches.forEach((h,d)=>{const m=o.Ia.get(h);if(!m)return;o.Ia.set(h,m.withResumeToken(pe.EMPTY_BYTE_STRING,m.snapshotVersion)),Qd(o,h);const _=new Lt(m.target,h,d,m.sequenceNumber);ja(o,_)}),o.remoteSyncer.applyRemoteEvent(l)}(n,t)}catch(r){D(gn,"Failed to raise snapshot:",r),await gi(n,r)}}async function gi(n,e,t){if(!er(e))throw e;n.Ea.add(1),await ss(n),n.Ra.set("Offline"),t||(t=()=>zd(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{D(gn,"Retrying IndexedDB access"),await t(),n.Ea.delete(1),await Ui(n)})}function Xd(n,e){return e().catch(t=>gi(n,t,e))}async function $i(n){const e=B(n),t=Kt(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:Ra;for(;Cv(e);)try{const s=await cv(e.localStore,r);if(s===null){e.Ta.length===0&&t.L_();break}r=s.batchId,Rv(e,s)}catch(s){await gi(e,s)}Yd(e)&&Zd(e)}function Cv(n){return vn(n)&&n.Ta.length<10}function Rv(n,e){n.Ta.push(e);const t=Kt(n);t.O_()&&t.X_&&t.ea(e.mutations)}function Yd(n){return vn(n)&&!Kt(n).x_()&&n.Ta.length>0}function Zd(n){Kt(n).start()}async function Pv(n){Kt(n).ra()}async function kv(n){const e=Kt(n);for(const t of n.Ta)e.ea(t.mutations)}async function Vv(n,e,t){const r=n.Ta.shift(),s=La.from(r,e,t);await Xd(n,()=>n.remoteSyncer.applySuccessfulWrite(s)),await $i(n)}async function Nv(n,e){e&&Kt(n).X_&&await async function(r,s){if(function(a){return fE(a)&&a!==S.ABORTED}(s.code)){const o=r.Ta.shift();Kt(r).B_(),await Xd(r,()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s)),await $i(r)}}(n,e),Yd(n)&&Zd(n)}async function Au(n,e){const t=B(n);t.asyncQueue.verifyOperationInProgress(),D(gn,"RemoteStore received new credentials");const r=vn(t);t.Ea.add(3),await ss(t),r&&t.Ra.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await Ui(t)}async function Dv(n,e){const t=B(n);e?(t.Ea.delete(2),await Ui(t)):e||(t.Ea.add(2),await ss(t),t.Ra.set("Unknown"))}function tr(n){return n.ma||(n.ma=function(t,r,s){const o=B(t);return o.sa(),new yv(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:wv.bind(null,n),t_:Av.bind(null,n),r_:bv.bind(null,n),H_:Sv.bind(null,n)}),n.da.push(async e=>{e?(n.ma.B_(),za(n)?Ha(n):n.Ra.set("Unknown")):(await n.ma.stop(),Jd(n))})),n.ma}function Kt(n){return n.fa||(n.fa=function(t,r,s){const o=B(t);return o.sa(),new _v(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)}(n.datastore,n.asyncQueue,{Xo:()=>Promise.resolve(),t_:Pv.bind(null,n),r_:Nv.bind(null,n),ta:kv.bind(null,n),na:Vv.bind(null,n)}),n.da.push(async e=>{e?(n.fa.B_(),await $i(n)):(await n.fa.stop(),n.Ta.length>0&&(D(gn,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))})),n.fa}/**
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
 */class Ga{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new mt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,l=new Ga(e,t,a,s,o);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Wa(n,e){if(It("AsyncQueue",`${e}: ${n}`),er(n))return new N(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class Ln{static emptySet(e){return new Ln(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=Tr(),this.sortedSet=new ee(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ln)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new Ln;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
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
 */class bu{constructor(){this.ga=new ee(L.comparator)}track(e){const t=e.doc.key,r=this.ga.get(t);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(t,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(t):e.type===1&&r.type===2?this.ga=this.ga.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):M(63341,{Rt:e,pa:r}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,r)=>{e.push(r)}),e}}class Wn{constructor(e,t,r,s,o,a,l,h,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,o){const a=[];return t.forEach(l=>{a.push({type:0,doc:l})}),new Wn(e,t,Ln.emptySet(t),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Di(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
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
 */class Ov{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class Lv{constructor(){this.queries=Su(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,r){const s=B(t),o=s.queries;s.queries=Su(),o.forEach((a,l)=>{for(const h of l.Sa)h.onError(r)})})(this,new N(S.ABORTED,"Firestore shutting down"))}}function Su(){return new _n(n=>yd(n),Di)}async function ef(n,e){const t=B(n);let r=3;const s=e.query;let o=t.queries.get(s);o?!o.ba()&&e.Da()&&(r=2):(o=new Ov,r=e.Da()?0:1);try{switch(r){case 0:o.wa=await t.onListen(s,!0);break;case 1:o.wa=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const l=Wa(a,`Initialization of query '${Sn(e.query)}' failed`);return void e.onError(l)}t.queries.set(s,o),o.Sa.push(e),e.va(t.onlineState),o.wa&&e.Fa(o.wa)&&Ka(t)}async function tf(n,e){const t=B(n),r=e.query;let s=3;const o=t.queries.get(r);if(o){const a=o.Sa.indexOf(e);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=e.Da()?0:1:!o.ba()&&e.Da()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function Mv(n,e){const t=B(n);let r=!1;for(const s of e){const o=s.query,a=t.queries.get(o);if(a){for(const l of a.Sa)l.Fa(s)&&(r=!0);a.wa=s}}r&&Ka(t)}function xv(n,e,t){const r=B(n),s=r.queries.get(e);if(s)for(const o of s.Sa)o.onError(t);r.queries.delete(e)}function Ka(n){n.Ca.forEach(e=>{e.next()})}var ra,Cu;(Cu=ra||(ra={})).Ma="default",Cu.Cache="cache";class nf{constructor(e,t,r){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Wn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const r=t!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=Wn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==ra.Cache}}/**
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
 */class rf{constructor(e){this.key=e}}class sf{constructor(e){this.key=e}}class Fv{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=j(),this.mutatedKeys=j(),this.eu=_d(e),this.tu=new Ln(this.eu)}get nu(){return this.Ya}ru(e,t){const r=t?t.iu:new bu,s=t?t.tu:this.tu;let o=t?t.mutatedKeys:this.mutatedKeys,a=s,l=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal((m,_)=>{const E=s.get(m),R=Oi(this.query,_)?_:null,P=!!E&&this.mutatedKeys.has(E.key),O=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let V=!1;E&&R?E.data.isEqual(R.data)?P!==O&&(r.track({type:3,doc:R}),V=!0):this.su(E,R)||(r.track({type:2,doc:R}),V=!0,(h&&this.eu(R,h)>0||d&&this.eu(R,d)<0)&&(l=!0)):!E&&R?(r.track({type:0,doc:R}),V=!0):E&&!R&&(r.track({type:1,doc:E}),V=!0,(h||d)&&(l=!0)),V&&(R?(a=a.add(R),o=O?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),r.track({type:1,doc:m})}return{tu:a,iu:r,Cs:l,mutatedKeys:o}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const a=e.iu.ya();a.sort((m,_)=>function(R,P){const O=V=>{switch(V){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{Rt:V})}};return O(R)-O(P)}(m.type,_.type)||this.eu(m.doc,_.doc)),this.ou(r),s=s??!1;const l=t&&!s?this._u():[],h=this.Xa.size===0&&this.current&&!s?1:0,d=h!==this.Za;return this.Za=h,a.length!==0||d?{snapshot:new Wn(this.query,e.tu,o,a,e.mutatedKeys,h===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new bu,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(t=>this.Ya=this.Ya.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ya=this.Ya.delete(t)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=j(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))});const t=[];return e.forEach(r=>{this.Xa.has(r)||t.push(new sf(r))}),this.Xa.forEach(r=>{e.has(r)||t.push(new rf(r))}),t}cu(e){this.Ya=e.Qs,this.Xa=j();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Wn.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const Qa="SyncEngine";class Bv{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class Uv{constructor(e){this.key=e,this.hu=!1}}class $v{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new _n(l=>yd(l),Di),this.Iu=new Map,this.Eu=new Set,this.du=new ee(L.comparator),this.Au=new Map,this.Ru=new Fa,this.Vu={},this.mu=new Map,this.fu=Gn.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function qv(n,e,t=!0){const r=hf(n);let s;const o=r.Tu.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await of(r,e,t,!0),s}async function jv(n,e){const t=hf(n);await of(t,e,!0,!1)}async function of(n,e,t,r){const s=await lv(n.localStore,tt(e)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,t);let l;return r&&(l=await Hv(n,e,o,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&Kd(n.remoteStore,s),l}async function Hv(n,e,t,r,s){n.pu=(_,E,R)=>async function(O,V,H,U){let G=V.view.ru(H);G.Cs&&(G=await Eu(O.localStore,V.query,!1).then(({documents:T})=>V.view.ru(T,G)));const ue=U&&U.targetChanges.get(V.targetId),Ke=U&&U.targetMismatches.get(V.targetId)!=null,ge=V.view.applyChanges(G,O.isPrimaryClient,ue,Ke);return Pu(O,V.targetId,ge.au),ge.snapshot}(n,_,E,R);const o=await Eu(n.localStore,e,!0),a=new Fv(e,o.Qs),l=a.ru(o.documents),h=rs.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,h);Pu(n,t,d.au);const m=new Bv(e,t,a);return n.Tu.set(e,m),n.Iu.has(t)?n.Iu.get(t).push(e):n.Iu.set(t,[e]),d.snapshot}async function zv(n,e,t){const r=B(n),s=r.Tu.get(e),o=r.Iu.get(s.targetId);if(o.length>1)return r.Iu.set(s.targetId,o.filter(a=>!Di(a,e))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ta(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),t&&qa(r.remoteStore,s.targetId),sa(r,s.targetId)}).catch(Zn)):(sa(r,s.targetId),await ta(r.localStore,s.targetId,!0))}async function Gv(n,e){const t=B(n),r=t.Tu.get(e),s=t.Iu.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),qa(t.remoteStore,r.targetId))}async function Wv(n,e,t){const r=eI(n);try{const s=await function(a,l){const h=B(a),d=Z.now(),m=l.reduce((R,P)=>R.add(P.key),j());let _,E;return h.persistence.runTransaction("Locally write mutations","readwrite",R=>{let P=Tt(),O=j();return h.Ns.getEntries(R,m).next(V=>{P=V,P.forEach((H,U)=>{U.isValidDocument()||(O=O.add(H))})}).next(()=>h.localDocuments.getOverlayedDocuments(R,P)).next(V=>{_=V;const H=[];for(const U of l){const G=cE(U,_.get(U.key).overlayedDocument);G!=null&&H.push(new En(U.key,G,ld(G.value.mapValue),pt.exists(!0)))}return h.mutationQueue.addMutationBatch(R,d,H,l)}).next(V=>{E=V;const H=V.applyToLocalDocumentSet(_,O);return h.documentOverlayCache.saveOverlays(R,V.batchId,H)})}).then(()=>({batchId:E.batchId,changes:vd(_)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),function(a,l,h){let d=a.Vu[a.currentUser.toKey()];d||(d=new ee(q)),d=d.insert(l,h),a.Vu[a.currentUser.toKey()]=d}(r,s.batchId,t),await is(r,s.changes),await $i(r.remoteStore)}catch(s){const o=Wa(s,"Failed to persist write");t.reject(o)}}async function af(n,e){const t=B(n);try{const r=await ov(t.localStore,e);e.targetChanges.forEach((s,o)=>{const a=t.Au.get(o);a&&(Q(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?Q(a.hu,14607):s.removedDocuments.size>0&&(Q(a.hu,42227),a.hu=!1))}),await is(t,r,e)}catch(r){await Zn(r)}}function Ru(n,e,t){const r=B(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Tu.forEach((o,a)=>{const l=a.view.va(e);l.snapshot&&s.push(l.snapshot)}),function(a,l){const h=B(a);h.onlineState=l;let d=!1;h.queries.forEach((m,_)=>{for(const E of _.Sa)E.va(l)&&(d=!0)}),d&&Ka(h)}(r.eventManager,e),s.length&&r.Pu.H_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function Kv(n,e,t){const r=B(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Au.get(e),o=s&&s.key;if(o){let a=new ee(L.comparator);a=a.insert(o,we.newNoDocument(o,F.min()));const l=j().add(o),h=new Fi(F.min(),new Map,new ee(q),a,l);await af(r,h),r.du=r.du.remove(o),r.Au.delete(e),Ja(r)}else await ta(r.localStore,e,!1).then(()=>sa(r,e,t)).catch(Zn)}async function Qv(n,e){const t=B(n),r=e.batch.batchId;try{const s=await iv(t.localStore,e);lf(t,r,null),cf(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await is(t,s)}catch(s){await Zn(s)}}async function Jv(n,e,t){const r=B(n);try{const s=await function(a,l){const h=B(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let m;return h.mutationQueue.lookupMutationBatch(d,l).next(_=>(Q(_!==null,37113),m=_.keys(),h.mutationQueue.removeMutationBatch(d,_))).next(()=>h.mutationQueue.performConsistencyCheck(d)).next(()=>h.documentOverlayCache.removeOverlaysForBatchId(d,m,l)).next(()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,m)).next(()=>h.localDocuments.getDocuments(d,m))})}(r.localStore,e);lf(r,e,t),cf(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await is(r,s)}catch(s){await Zn(s)}}function cf(n,e){(n.mu.get(e)||[]).forEach(t=>{t.resolve()}),n.mu.delete(e)}function lf(n,e,t){const r=B(n);let s=r.Vu[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Vu[r.currentUser.toKey()]=s}}function sa(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Iu.get(e))n.Tu.delete(r),t&&n.Pu.yu(r,t);n.Iu.delete(e),n.isPrimaryClient&&n.Ru.jr(e).forEach(r=>{n.Ru.containsKey(r)||uf(n,r)})}function uf(n,e){n.Eu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(qa(n.remoteStore,t),n.du=n.du.remove(e),n.Au.delete(t),Ja(n))}function Pu(n,e,t){for(const r of t)r instanceof rf?(n.Ru.addReference(r.key,e),Xv(n,r)):r instanceof sf?(D(Qa,"Document no longer in limbo: "+r.key),n.Ru.removeReference(r.key,e),n.Ru.containsKey(r.key)||uf(n,r.key)):M(19791,{wu:r})}function Xv(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Eu.has(r)||(D(Qa,"New document in limbo: "+t),n.Eu.add(r),Ja(n))}function Ja(n){for(;n.Eu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Eu.values().next().value;n.Eu.delete(e);const t=new L(X.fromString(e)),r=n.fu.next();n.Au.set(r,new Uv(t)),n.du=n.du.insert(t,r),Kd(n.remoteStore,new Lt(tt(Da(t.path)),r,"TargetPurposeLimboResolution",ki.ce))}}async function is(n,e,t){const r=B(n),s=[],o=[],a=[];r.Tu.isEmpty()||(r.Tu.forEach((l,h)=>{a.push(r.pu(h,e,t).then(d=>{if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:t?.targetChanges.get(h.targetId)?.current;r.sharedClientState.updateQueryState(h.targetId,m?"current":"not-current")}if(d){s.push(d);const m=Ua.As(h.targetId,d);o.push(m)}}))}),await Promise.all(a),r.Pu.H_(s),await async function(h,d){const m=B(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",_=>C.forEach(d,E=>C.forEach(E.Es,R=>m.persistence.referenceDelegate.addReference(_,E.targetId,R)).next(()=>C.forEach(E.ds,R=>m.persistence.referenceDelegate.removeReference(_,E.targetId,R)))))}catch(_){if(!er(_))throw _;D($a,"Failed to update sequence numbers: "+_)}for(const _ of d){const E=_.targetId;if(!_.fromCache){const R=m.Ms.get(E),P=R.snapshotVersion,O=R.withLastLimboFreeSnapshotVersion(P);m.Ms=m.Ms.insert(E,O)}}}(r.localStore,o))}async function Yv(n,e){const t=B(n);if(!t.currentUser.isEqual(e)){D(Qa,"User change. New user:",e.toKey());const r=await Hd(t.localStore,e);t.currentUser=e,function(o,a){o.mu.forEach(l=>{l.forEach(h=>{h.reject(new N(S.CANCELLED,a))})}),o.mu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await is(t,r.Ls)}}function Zv(n,e){const t=B(n),r=t.Au.get(e);if(r&&r.hu)return j().add(r.key);{let s=j();const o=t.Iu.get(e);if(!o)return s;for(const a of o){const l=t.Tu.get(a);s=s.unionWith(l.view.nu)}return s}}function hf(n){const e=B(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=af.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Zv.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Kv.bind(null,e),e.Pu.H_=Mv.bind(null,e.eventManager),e.Pu.yu=xv.bind(null,e.eventManager),e}function eI(n){const e=B(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Qv.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Jv.bind(null,e),e}class yi{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Bi(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return sv(this.persistence,new tv,e.initialUser,this.serializer)}Cu(e){return new jd(Ba.mi,this.serializer)}Du(e){return new hv}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}yi.provider={build:()=>new yi};class tI extends yi{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){Q(this.persistence.referenceDelegate instanceof pi,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new UE(r,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Ve.withCacheSize(this.cacheSizeBytes):Ve.DEFAULT;return new jd(r=>pi.mi(r,t),this.serializer)}}class ia{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Ru(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Yv.bind(null,this.syncEngine),await Dv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new Lv}()}createDatastore(e){const t=Bi(e.databaseInfo.databaseId),r=function(o){return new gv(o)}(e.databaseInfo);return function(o,a,l,h){return new vv(o,a,l,h)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,s,o,a,l){return new Tv(r,s,o,a,l)}(this.localStore,this.datastore,e.asyncQueue,t=>Ru(this.syncEngine,t,0),function(){return Tu.v()?new Tu:new dv}())}createSyncEngine(e,t){return function(s,o,a,l,h,d,m){const _=new $v(s,o,a,l,h,d);return m&&(_.gu=!0),_}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await async function(t){const r=B(t);D(gn,"RemoteStore shutting down."),r.Ea.add(5),await ss(r),r.Aa.shutdown(),r.Ra.set("Unknown")}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}ia.provider={build:()=>new ia};/**
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
 *//**
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
 */class df{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):It("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */const Qt="FirestoreClient";class nI{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Te.UNAUTHENTICATED,this.clientId=Ca.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,async a=>{D(Qt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(D(Qt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new mt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Wa(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Vo(n,e){n.asyncQueue.verifyOperationInProgress(),D(Qt,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async s=>{r.isEqual(s)||(await Hd(e.localStore,s),r=s)}),e.persistence.setDatabaseDeletedListener(()=>n.terminate()),n._offlineComponents=e}async function ku(n,e){n.asyncQueue.verifyOperationInProgress();const t=await rI(n);D(Qt,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>Au(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,s)=>Au(e.remoteStore,s)),n._onlineComponents=e}async function rI(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){D(Qt,"Using user provided OfflineComponentProvider");try{await Vo(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11}(t))throw t;qn("Error using user provided cache. Falling back to memory cache: "+t),await Vo(n,new yi)}}else D(Qt,"Using default OfflineComponentProvider"),await Vo(n,new tI(void 0));return n._offlineComponents}async function ff(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(D(Qt,"Using user provided OnlineComponentProvider"),await ku(n,n._uninitializedComponentsProvider._online)):(D(Qt,"Using default OnlineComponentProvider"),await ku(n,new ia))),n._onlineComponents}function sI(n){return ff(n).then(e=>e.syncEngine)}async function mf(n){const e=await ff(n),t=e.eventManager;return t.onListen=qv.bind(null,e.syncEngine),t.onUnlisten=zv.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=jv.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Gv.bind(null,e.syncEngine),t}function iI(n,e,t={}){const r=new mt;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,l,h,d){const m=new df({next:E=>{m.Nu(),a.enqueueAndForget(()=>tf(o,_));const R=E.docs.has(l);!R&&E.fromCache?d.reject(new N(S.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&E.fromCache&&h&&h.source==="server"?d.reject(new N(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(E)},error:E=>d.reject(E)}),_=new nf(Da(l.path),m,{includeMetadataChanges:!0,qa:!0});return ef(o,_)}(await mf(n),n.asyncQueue,e,t,r)),r.promise}function oI(n,e,t={}){const r=new mt;return n.asyncQueue.enqueueAndForget(async()=>function(o,a,l,h,d){const m=new df({next:E=>{m.Nu(),a.enqueueAndForget(()=>tf(o,_)),E.fromCache&&h.source==="server"?d.reject(new N(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(E)},error:E=>d.reject(E)}),_=new nf(l,m,{includeMetadataChanges:!0,qa:!0});return ef(o,_)}(await mf(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function pf(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const Vu=new Map;/**
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
 */const gf="firestore.googleapis.com",Nu=!0;class Du{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new N(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=gf,this.ssl=Nu}else this.host=e.host,this.ssl=e.ssl??Nu;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=qd;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<FE)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}w_("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=pf(e.experimentalLongPollingOptions??{}),function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,s){return r.timeoutSeconds===s.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class qi{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Du({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Du(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new f_;switch(r.type){case"firstParty":return new y_(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=Vu.get(t);r&&(D("ComponentProvider","Removing Datastore"),Vu.delete(t),r.terminate())}(this),Promise.resolve()}}function aI(n,e,t,r={}){n=pn(n,qi);const s=Qn(e),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},l=`${e}:${t}`;s&&(ih(`https://${l}`),oh("Firestore",!0)),o.host!==gf&&o.host!==l&&qn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:l,ssl:s,emulatorOptions:r};if(!hn(h,a)&&(n._setSettings(h),r.mockUserToken)){let d,m;if(typeof r.mockUserToken=="string")d=r.mockUserToken,m=Te.MOCK_USER;else{d=$m(r.mockUserToken,n._app?.options.projectId);const _=r.mockUserToken.sub||r.mockUserToken.user_id;if(!_)throw new N(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new Te(_)}n._authCredentials=new m_(new Xh(d,m))}}/**
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
 */class nr{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new nr(this.firestore,e,this._query)}}class ae{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ut(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ae(this.firestore,e,this._key)}toJSON(){return{type:ae._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(ts(t,ae._jsonSchema))return new ae(e,r||null,new L(X.fromString(t.referencePath)))}}ae._jsonSchemaVersion="firestore/documentReference/1.0",ae._jsonSchema={type:oe("string",ae._jsonSchemaVersion),referencePath:oe("string")};class Ut extends nr{constructor(e,t,r){super(e,t,Da(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ae(this.firestore,null,new L(e))}withConverter(e){return new Ut(this.firestore,e,this._path)}}function je(n,e,...t){if(n=Pe(n),Yh("collection","path",e),n instanceof qi){const r=X.fromString(e,...t);return Gl(r),new Ut(n,null,r)}{if(!(n instanceof ae||n instanceof Ut))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return Gl(r),new Ut(n.firestore,null,r)}}function yf(n,e,...t){if(n=Pe(n),arguments.length===1&&(e=Ca.newId()),Yh("doc","path",e),n instanceof qi){const r=X.fromString(e,...t);return zl(r),new ae(n,null,new L(r))}{if(!(n instanceof ae||n instanceof Ut))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(X.fromString(e,...t));return zl(r),new ae(n.firestore,n instanceof Ut?n.converter:null,new L(r))}}/**
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
 */const Ou="AsyncQueue";class Lu{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Gd(this,"async_queue_retry"),this._c=()=>{const r=ko();r&&D(Ou,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const t=ko();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=ko();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new mt;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!er(e))throw e;D(Ou,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,It("INTERNAL UNHANDLED ERROR: ",Mu(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=t,t}enqueueAfterDelay(e,t,r){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=Ga.createAndSchedule(this,e,t,r,o=>this.hc(o));return this.tc.push(s),s}uc(){this.nc&&M(47125,{Pc:Mu(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Mu(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class ji extends qi{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Lu,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Lu(e),this._firestoreClient=void 0,await e}}}function _f(n,e){const t=typeof n=="object"?n:lh(),r=typeof n=="string"?n:ui,s=pa(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Bm("firestore");o&&aI(s,...o)}return s}function Xa(n){if(n._terminated)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||cI(n),n._firestoreClient}function cI(n){const e=n._freezeSettings(),t=function(s,o,a,l){return new O_(s,o,a,l.host,l.ssl,l.experimentalForceLongPolling,l.experimentalAutoDetectLongPolling,pf(l.experimentalLongPollingOptions),l.useFetchStreams,l.isUsingEmulator)}(n._databaseId,n._app?.options.appId||"",n._persistenceKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new nI(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&function(s){const o=s?._online.build();return{_offline:s?._offline.build(o),_online:o}}(n._componentsProvider))}/**
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
 */class Fe{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Fe(pe.fromBase64String(e))}catch(t){throw new N(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Fe(pe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Fe._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(ts(e,Fe._jsonSchema))return Fe.fromBase64String(e.bytes)}}Fe._jsonSchemaVersion="firestore/bytes/1.0",Fe._jsonSchema={type:oe("string",Fe._jsonSchemaVersion),bytes:oe("string")};/**
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
 */class Hi{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new me(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class os{constructor(e){this._methodName=e}}/**
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
 */class rt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return q(this._lat,e._lat)||q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:rt._jsonSchemaVersion}}static fromJSON(e){if(ts(e,rt._jsonSchema))return new rt(e.latitude,e.longitude)}}rt._jsonSchemaVersion="firestore/geoPoint/1.0",rt._jsonSchema={type:oe("string",rt._jsonSchemaVersion),latitude:oe("number"),longitude:oe("number")};/**
 * @license
 * Copyright 2024 Google LLC
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
 */class st{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0}(this._values,e._values)}toJSON(){return{type:st._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(ts(e,st._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new st(e.vectorValues);throw new N(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}st._jsonSchemaVersion="firestore/vectorValue/1.0",st._jsonSchema={type:oe("string",st._jsonSchemaVersion),vectorValues:oe("object")};/**
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
 */const lI=/^__.*__$/;class Ef{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new En(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function vf(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ac:n})}}class Ya{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new Ya({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){const t=this.path?.child(e),r=this.Vc({path:t,fc:!1});return r.gc(e),r}yc(e){const t=this.path?.child(e),r=this.Vc({path:t,fc:!1});return r.Rc(),r}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return _i(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(vf(this.Ac)&&lI.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class uI{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Bi(e)}Cc(e,t,r,s=!1){return new Ya({Ac:e,methodName:t,Dc:r,path:me.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function If(n){const e=n._freezeSettings(),t=Bi(n._databaseId);return new uI(n._databaseId,!!e.ignoreUndefinedProperties,t)}class zi extends os{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof zi}}class Za extends os{_toFieldTransform(e){return new Rd(e.path,new $r)}isEqual(e){return e instanceof Za}}class ec extends os{constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){const t=new Hr(e.serializer,wd(e.serializer,this.Fc));return new Rd(e.path,t)}isEqual(e){return e instanceof ec&&this.Fc===e.Fc}}function hI(n,e,t,r){const s=n.Cc(1,e,t);wf("Data must be an object, but it was:",s,r);const o=[],a=Me.empty();Jt(r,(h,d)=>{const m=tc(e,h,t);d=Pe(d);const _=s.yc(m);if(d instanceof zi)o.push(m);else{const E=as(d,_);E!=null&&(o.push(m),a.set(m,E))}});const l=new $e(o);return new Ef(a,l,s.fieldTransforms)}function dI(n,e,t,r,s,o){const a=n.Cc(1,e,t),l=[xu(e,r,t)],h=[s];if(o.length%2!=0)throw new N(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let E=0;E<o.length;E+=2)l.push(xu(e,o[E])),h.push(o[E+1]);const d=[],m=Me.empty();for(let E=l.length-1;E>=0;--E)if(!gI(d,l[E])){const R=l[E];let P=h[E];P=Pe(P);const O=a.yc(R);if(P instanceof zi)d.push(R);else{const V=as(P,O);V!=null&&(d.push(R),m.set(R,V))}}const _=new $e(d);return new Ef(m,_,a.fieldTransforms)}function fI(n,e,t,r=!1){return as(t,n.Cc(r?4:3,e))}function as(n,e){if(Tf(n=Pe(n)))return wf("Unsupported field value:",e,n),mI(n,e);if(n instanceof os)return function(r,s){if(!vf(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return function(r,s){const o=[];let a=0;for(const l of r){let h=as(l,s.wc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}}(n,e)}return function(r,s){if((r=Pe(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return wd(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=Z.fromDate(r);return{timestampValue:mi(s.serializer,o)}}if(r instanceof Z){const o=new Z(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:mi(s.serializer,o)}}if(r instanceof rt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Fe)return{bytesValue:Ld(s.serializer,r._byteString)};if(r instanceof ae){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Sc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:xa(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof st)return function(a,l){return{mapValue:{fields:{[ad]:{stringValue:cd},[hi]:{arrayValue:{values:a.toArray().map(d=>{if(typeof d!="number")throw l.Sc("VectorValues must only contain numeric values.");return Oa(l.serializer,d)})}}}}}}(r,s);throw s.Sc(`Unsupported field value: ${Pi(r)}`)}(n,e)}function mI(n,e){const t={};return td(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Jt(n,(r,s)=>{const o=as(s,e.mc(r));o!=null&&(t[r]=o)}),{mapValue:{fields:t}}}function Tf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Z||n instanceof rt||n instanceof Fe||n instanceof ae||n instanceof os||n instanceof st)}function wf(n,e,t){if(!Tf(t)||!Zh(t)){const r=Pi(t);throw r==="an object"?e.Sc(n+" a custom object"):e.Sc(n+" "+r)}}function xu(n,e,t){if((e=Pe(e))instanceof Hi)return e._internalPath;if(typeof e=="string")return tc(n,e);throw _i("Field path arguments must be of type string or ",n,!1,void 0,t)}const pI=new RegExp("[~\\*/\\[\\]]");function tc(n,e,t){if(e.search(pI)>=0)throw _i(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Hi(...e.split("."))._internalPath}catch{throw _i(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function _i(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new N(S.INVALID_ARGUMENT,l+n+h)}function gI(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class Af{constructor(e,t,r,s,o){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new ae(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new yI(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(bf("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class yI extends Af{data(){return super.data()}}function bf(n,e){return typeof e=="string"?tc(n,e):e instanceof Hi?e._internalPath:e._delegate._internalPath}/**
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
 */function _I(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class nc{}class EI extends nc{}function cs(n,e,...t){let r=[];e instanceof nc&&r.push(e),r=r.concat(t),function(o){const a=o.filter(h=>h instanceof sc).length,l=o.filter(h=>h instanceof rc).length;if(a>1||a>0&&l>0)throw new N(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)n=s._apply(n);return n}class rc extends EI{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new rc(e,t,r)}_apply(e){const t=this._parse(e);return Sf(e._query,t),new nr(e.firestore,e.converter,Qo(e._query,t))}_parse(e){const t=If(e.firestore);return function(o,a,l,h,d,m,_){let E;if(d.isKeyField()){if(m==="array-contains"||m==="array-contains-any")throw new N(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${m}' queries on documentId().`);if(m==="in"||m==="not-in"){Bu(_,m);const P=[];for(const O of _)P.push(Fu(h,o,O));E={arrayValue:{values:P}}}else E=Fu(h,o,_)}else m!=="in"&&m!=="not-in"&&m!=="array-contains-any"||Bu(_,m),E=fI(l,a,_,m==="in"||m==="not-in");return ie.create(d,m,E)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class sc extends nc{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new sc(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:qe.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(s,o){let a=s;const l=o.getFlattenedFilters();for(const h of l)Sf(a,h),a=Qo(a,h)}(e._query,t),new nr(e.firestore,e.converter,Qo(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function Fu(n,e,t){if(typeof(t=Pe(t))=="string"){if(t==="")throw new N(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!gd(e)&&t.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(X.fromString(t));if(!L.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return eu(n,new L(r))}if(t instanceof ae)return eu(n,t._key);throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Pi(t)}.`)}function Bu(n,e){if(!Array.isArray(n)||n.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Sf(n,e){const t=function(s,o){for(const a of s)for(const l of a.getFlattenedFilters())if(o.indexOf(l.op)>=0)return l.op;return null}(n.filters,function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class vI{convertValue(e,t="none"){switch(Wt(e)){case 0:return null;case 1:return e.booleanValue;case 2:return re(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Gt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Jt(e,(s,o)=>{r[s]=this.convertValue(o,t)}),r}convertVectorValue(e){const t=e.fields?.[hi].arrayValue?.values?.map(r=>re(r.doubleValue));return new st(t)}convertGeoPoint(e){return new rt(re(e.latitude),re(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Ni(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Fr(e));default:return null}}convertTimestamp(e){const t=zt(e);return new Z(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=X.fromString(e);Q($d(r),9688,{name:e});const s=new Br(r.get(1),r.get(3)),o=new L(r.popFirst(5));return s.isEqual(t)||It(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}class Ar{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class on extends Af{constructor(e,t,r,s,o,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new zs(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(bf("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=on._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}on._jsonSchemaVersion="firestore/documentSnapshot/1.0",on._jsonSchema={type:oe("string",on._jsonSchemaVersion),bundleSource:oe("string","DocumentSnapshot"),bundleName:oe("string"),bundle:oe("string")};class zs extends on{data(e={}){return super.data(e)}}class Mn{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Ar(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new zs(this._firestore,this._userDataWriter,r.key,r,new Ar(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map(l=>{const h=new zs(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Ar(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}})}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter(l=>o||l.type!==3).map(l=>{const h=new zs(s._firestore,s._userDataWriter,l.doc.key,l.doc,new Ar(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,m=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),m=a.indexOf(l.doc.key)),{type:II(l.type),doc:h,oldIndex:d,newIndex:m}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Mn._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ca.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach(o=>{o._document!==null&&(t.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function II(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:n})}}/**
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
 */function TI(n){n=pn(n,ae);const e=pn(n.firestore,ji);return iI(Xa(e),n._key).then(t=>AI(e,n,t))}Mn._jsonSchemaVersion="firestore/querySnapshot/1.0",Mn._jsonSchema={type:oe("string",Mn._jsonSchemaVersion),bundleSource:oe("string","QuerySnapshot"),bundleName:oe("string"),bundle:oe("string")};class Cf extends vI{constructor(e){super(),this.firestore=e}convertBytes(e){return new Fe(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ae(this.firestore,null,t)}}function He(n){n=pn(n,nr);const e=pn(n.firestore,ji),t=Xa(e),r=new Cf(e);return _I(n._query),oI(t,n._query).then(s=>new Mn(e,r,n,s))}function Rf(n,e,t,...r){n=pn(n,ae);const s=pn(n.firestore,ji),o=If(s);let a;return a=typeof(e=Pe(e))=="string"||e instanceof Hi?dI(o,"updateDoc",n._key,e,t,r):hI(o,"updateDoc",n._key,e),wI(s,[a.toMutation(n._key,pt.exists(!0))])}function wI(n,e){return function(r,s){const o=new mt;return r.asyncQueue.enqueueAndForget(async()=>Wv(await sI(r),s,o)),o.promise}(Xa(n),e)}function AI(n,e,t){const r=t.docs.get(e._key),s=new Cf(n);return new on(n,s,e._key,r,new Ar(t.hasPendingWrites,t.fromCache),e.converter)}function bI(){return new Za("serverTimestamp")}function SI(n){return new ec("increment",n)}(function(e,t=!0){(function(s){Yn=s})(Jn),Un(new dn("firestore",(r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),l=new ji(new p_(r.getProvider("auth-internal")),new __(a,r.getProvider("app-check-internal")),function(d,m){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new N(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Br(d.options.projectId,m)}(a,s),a);return o={useFetchStreams:t,...o},l._setSettings(o),l},"PUBLIC").setMultipleInstances(!0)),Ft($l,ql,e),Ft($l,ql,"esm2020")})();const CI={apiKey:"AIzaSyBDQ8xTd9T_pdDGVeuG-XDFtl2TwwBkzyc",authDomain:"cyclopedia-edu.firebaseapp.com",projectId:"cyclopedia-edu",storageBucket:"cyclopedia-edu.firebasestorage.app",messagingSenderId:"1060215261508",appId:"1:1060215261508:web:89176b35858d88ccfaaf11",measurementId:"G-46FB22ZVNX"},Pf=ga(CI);jh(Pf);_f(Pf);localStorage.getItem("lang");const RI={apiKey:"AIzaSyBDQ8xTd9T_pdDGVeuG-XDFtl2TwwBkzyc",authDomain:"cyclopedia-edu.firebaseapp.com",projectId:"cyclopedia-edu",storageBucket:"cyclopedia-edu.firebasestorage.app",messagingSenderId:"1060215261508",appId:"1:1060215261508:web:89176b35858d88ccfaaf11",measurementId:"G-46FB22ZVNX"},kf=ga(RI);jh(kf);const Ne=_f(kf);async function PI(){const e=await(await fetch("/users/profile.html")).text();document.querySelector("main.main-content").innerHTML=e,kI()}async function kI(){const n=JSON.parse(localStorage.getItem("user")||"{}");document.getElementById("username").value=n.username||"",document.getElementById("language").value=n.language||"en";const e=yf(Ne,"users",n.uid),t=await TI(e);if(t.exists()){const r=t.data();document.getElementById("points-value").textContent=r.points||0;const s=document.getElementById("activity-log"),o=r.activityLog||{};s.innerHTML="",Object.entries(o).forEach(([a,l])=>{const h=document.createElement("li");h.textContent=`${l.action} – ${new Date(l.timestamp?.toDate?.()||l.timestamp).toLocaleString()}`,s.appendChild(h)})}document.getElementById("profileForm").addEventListener("submit",async r=>{r.preventDefault();const s=document.getElementById("username").value.trim(),o=document.getElementById("language").value;try{await Rf(e,{username:s,language:o}),n.username=s,n.language=o,localStorage.setItem("user",JSON.stringify(n)),localStorage.setItem("language",o),document.getElementById("statusMsg").textContent="✅ تم تحديث البيانات!"}catch{document.getElementById("statusMsg").textContent="❌ فشل التحديث."}})}let Vf=localStorage.getItem("lang")||"ar";function z(){return Vf}function ze(n){const e=n==="ar"||n==="he"?"rtl":"ltr";document.documentElement.setAttribute("dir",e),document.documentElement.setAttribute("lang",n)}async function rr(n){try{const e=await fetch(`/lang/${n}.json`);if(!e.ok)throw new Error(`تعذر تحميل ملف الترجمة: ${n}.json`);const t=await e.json();ke(t)}catch(e){console.error("❌ خطأ في تحميل الترجمة:",e)}}function ke(n){if(!n||typeof n!="object"){console.warn("⚠️ ملف الترجمة غير صالح أو غير محمّل.");return}document.querySelectorAll("[data-i18n]").forEach(e=>{const t=e.getAttribute("data-i18n");n[t]?e.innerHTML=n[t]:console.warn(`🔍 المفتاح '${t}' غير موجود في ملف الترجمة.`)})}function VI(n){Vf=n,localStorage.setItem("lang",n),ze(n),rr(n),document.dispatchEvent(new CustomEvent("languageChanged",{detail:n}))}let kn=null;function Ae(n){te(),kn=new Audio(n),kn.play().catch(e=>{console.warn("Audio playback failed:",e)})}function te(){kn&&(kn.pause(),kn.currentTime=0,kn=null)}async function Ge(n,e){if(!n||!n.uid)return;const t=yf(Ne,"users",n.uid),r=Date.now().toString(),s={action:`تعرف على اسم في فئة ${e}`,category:e,timestamp:bI()};await Rf(t,{points:SI(1),[`activityLog.${r}`]:s})}const Gi=(...n)=>{const e=Ge||void 0||void 0;if(typeof e=="function")try{e(...n)}catch(t){console.warn("[activity] log failed:",t)}};let Re=[],Xe=0,xe=null,Gs,Ws,Ks,Qs,$t,br;async function Nf(){te();const n=document.querySelector("main.main-content");if(!n){console.warn("[animals] لم يتم العثور على <main class='main-content'>");return}n.innerHTML=`
    <section id="animals-game" class="topic-container">
      <div class="topic-header">
        <h2 id="animal-word" data-i18n="animals.title">—</h2>
      </div>

      <div class="topic-body">
        <div class="image-area">
          <img id="animal-image" alt="" src="" loading="lazy"/>
        </div>

        <div id="animal-details-section" class="details-area">
          <div class="line"><span data-i18n="animals.classification">—</span>: <span id="animal-classification">—</span></div>
          <div class="line"><span data-i18n="animals.description">—</span>: <span id="animal-description">—</span></div>

          <div class="baby-animal-section">
            <div class="line"><span data-i18n="animals.baby">—</span>: <span id="animal-baby">—</span></div>
            <button id="play-baby-sound-btn-animal" class="btn small" type="button" data-i18n="animals.play_baby_sound">تشغيل صوت الصغير</button>
          </div>

          <div class="female-animal-section">
            <div class="line"><span data-i18n="animals.female">—</span>: <span id="animal-female">—</span></div>
          </div>
        </div>
      </div>
    </section>
  `,Gs=document.getElementById("prev-animal-btn"),Ws=document.getElementById("next-animal-btn"),Ks=document.getElementById("play-sound-btn-animal"),Qs=document.getElementById("play-baby-sound-btn-animal"),$t=document.getElementById("voice-select-animal"),br=document.getElementById("game-lang-select-animal"),Gs&&(Gs.onclick=MI),Ws&&(Ws.onclick=LI),Ks&&(Ks.onclick=DI),Qs&&(Qs.onclick=OI),$t&&($t.onchange=()=>zr()),br&&(br.onchange=async()=>{await NI(br.value)}),await Df(),Xe=0,xe=Re.length?Re[0]:null,Of(Re.length===0),zr(),ke()}async function Df(n){Re=[];try{const e=je(Ne,"categories","animals","items");(await He(e)).forEach(r=>{const s=r.data();Re.push({id:r.id,...s})})}catch(e){console.error("[animals] fetchAnimals error:",e)}}async function NI(n){te(),await Df(),Xe=0,xe=Re.length?Re[0]:null,Of(Re.length===0),zr(),ke()}function zr(){const n=z(),e=document.getElementById("animal-word"),t=document.getElementById("animal-image"),r=document.getElementById("animal-details-section"),s=document.getElementById("animal-classification"),o=document.getElementById("animal-description"),a=document.getElementById("animal-baby"),l=document.getElementById("animal-female");if(!e||!t||!r)return;if(!xe){e.textContent="—",t.src="",s&&(s.textContent="—"),o&&(o.textContent="—"),a&&(a.textContent="—"),l&&(l.textContent="—");return}const h=xe,d=h.name&&(h.name[n]||h.name.ar||h.name.en||h.name.he)||h.title||h.word||"—";e.textContent=d;const m=h.image_path||h.images&&(h.images.main||h.images[n])||"";m?(t.src=m,t.alt=d):(t.removeAttribute("src"),t.alt=""),s&&(s.textContent=h.classification&&(h.classification[n]||h.classification.ar)||"—"),o&&(o.textContent=h.description&&(h.description[n]||h.description.ar)||"—");const _=h.baby||{},E=h.female||{};if(a){const R=_.name&&(_.name[n]||_.name.ar||_.name.en)||"—";a.textContent=R}if(l){const R=E.name&&(E.name[n]||E.name.ar||E.name.en)||"—";l.textContent=R}}function DI(){if(!xe)return;const n=z(),e=$t&&$t.value||"boy",t=xI(xe,n,e);t&&(te(),Ae(t),Gi("animals","play_sound",{id:xe.id,voiceType:e,lang:n}))}function OI(){if(!xe||!xe.baby)return;const n=z(),e=$t&&$t.value||"boy",t=FI(xe.baby,n,e);t&&(te(),Ae(t),Gi("animals","play_baby_sound",{id:xe.id,voiceType:e,lang:n}))}function LI(){Re.length&&(te(),Xe=(Xe+1)%Re.length,xe=Re[Xe],zr(),Gi("animals","next",{index:Xe}))}function MI(){Re.length&&(te(),Xe=(Xe-1+Re.length)%Re.length,xe=Re[Xe],zr(),Gi("animals","prev",{index:Xe}))}function xI(n,e,t){const r=`${t}_${e}`;if(n.voices&&n.voices[r])return n.voices[r];const s=n.sound_base||n.sound&&n.sound.base;return s?`audio/${e}/animals/${s}_${t}_${e}.mp3`:n.sound&&n.sound[e]&&n.sound[e][t]?n.sound[e][t]:null}function FI(n,e,t){const r=`${t}_${e}`;if(n.voices&&n.voices[r])return n.voices[r];const s=n.sound_base||n.sound&&n.sound.base;return s?`audio/${e}/animals/${s}_${t}_${e}.mp3`:n.sound&&n.sound[e]&&n.sound[e][t]?n.sound[e][t]:null}function Of(n){[Gs,Ws,Ks,Qs,$t,br].forEach(e=>{e&&(e.disabled=!!n)})}let an=[],Nr=0,Pt=null;async function Lf(){te();const n=document.querySelector("main.main-content"),e=document.getElementById("human-body-sidebar-controls");if(!n||!e){console.error("Main content area or human body sidebar controls not found.");return}n.innerHTML=`
    <div class="game-box">
      <h2 id="human-body-word" class="item-main-name">---</h2>
      <img id="human-body-image" src="" alt="human body part" />
      
      <div class="human-body-details-section info-box">
        <h3>حقائق عن جسم الإنسان:</h3>
        <ul id="human-body-details-list">
          <li><strong>الوظيفة:</strong> <span id="human-body-function">---</span></li>
          <li><strong>الجهاز:</strong> <span id="human-body-system">---</span></li>
          <li><strong>حقيقة ممتعة:</strong> <span id="human-body-fun-fact">---</span></li>
        </ul>
        <div class="human-body-description-box info-box">
          <h4>الوصف:</h4>
          <p id="human-body-description">---</p>
        </div>
      </div>
    </div>
  `;const t=document.getElementById("human-body-image"),r=document.getElementById("human-body-word"),s=document.getElementById("human-body-function"),o=document.getElementById("human-body-system"),a=document.getElementById("human-body-fun-fact"),l=document.getElementById("human-body-description"),h=document.getElementById("game-lang-select-human-body");if(!h){console.error("Language select for human body game not found.");return}if(h.addEventListener("change",async()=>{te(),await $u(h.value),Nr=0,Uu(),ke(),ze(h.value)}),await $u(h.value),an.length===0){console.warn("No human body parts found. Please check Firestore data or rules."),t&&(t.src="/images/default.png"),r&&(r.textContent="لا توجد بيانات"),l&&(l.textContent="لا يوجد وصف متوفر."),s&&(s.textContent="غير متوفر"),o&&(o.textContent="غير متوفر"),a&&(a.textContent="غير متوفر"),qu(!0);return}Nr=0,Uu(),qu(!1)}function Uu(){if(an.length===0)return;Pt=an[Nr];const n=document.getElementById("human-body-image"),e=document.getElementById("human-body-word"),t=document.getElementById("human-body-function"),r=document.getElementById("human-body-system"),s=document.getElementById("human-body-fun-fact"),o=document.getElementById("human-body-description"),a=document.getElementById("prev-human-body-btn"),l=document.getElementById("next-human-body-btn"),h=Pt.name?.[z()]||Pt.name?.en||"---",d=`/images/human-body/${Pt.image}`;n&&(n.src=d),n&&(n.alt=h),e&&(e.textContent=h),t&&(t.textContent=Pt.function?.[z()]||"غير متوفر"),r&&(r.textContent=Pt.system?.[z()]||"غير متوفر"),s&&(s.textContent=Pt.fun_fact?.[z()]||"لا توجد حقائق ممتعة"),o&&(o.textContent=Pt.description?.[z()]||"لا يوجد وصف"),a&&(a.disabled=Nr===0),l&&(l.disabled=Nr===an.length-1),te()}async function $u(n){try{const e=je(Ne,"categories","human-body","items"),t=cs(e);an=(await He(e)).docs.map(s=>s.data()),console.log("Fetched human body parts:",an)}catch(e){console.error("Error fetching human body parts from Firestore:",e),an=[]}}function qu(n){const e=document.getElementById("play-sound-btn-human-body"),t=document.getElementById("next-human-body-btn"),r=document.getElementById("prev-human-body-btn"),s=document.getElementById("voice-select-human-body"),o=document.getElementById("game-lang-select-human-body");e&&(e.disabled=n),t&&(t.disabled=n),r&&(r.disabled=n),s&&(s.disabled=n),o&&(o.disabled=n)}let cn=[],qt=0,kt=null;async function ic(){te();const n=document.querySelector("main.main-content");if(!n){console.error("Main content area not found.");return}n.innerHTML=`
    <div class="game-box">
      <h2 id="tool-name" class="item-main-name" data-i18n="tool_game_title">تعرف على الأدوات</h2>
      <img id="tool-image" src="" alt="tool" />

      <div class="tool-description-box info-box" id="tool-description-box" style="display:none;">
        <h4 data-i18n="description_title">الوصف:</h4>
        <p id="tool-description">---</p>
        <p><strong data-i18n="tool_related_professions">المهن المرتبطة بالأداة:</strong> 
		<span id="tool-professions"></span></p>
      </div>
    </div>
  `;const e=document.getElementById("game-lang-select-tools");document.getElementById("voice-select-tools");const t=document.getElementById("play-sound-btn-tools"),r=document.getElementById("prev-tools-btn"),s=document.getElementById("next-tools-btn"),o=document.getElementById("toggle-description-btn-tools");if(await BI(),cn.length===0){console.warn("No tools found."),document.getElementById("tool-name").textContent="لا توجد بيانات",document.getElementById("tool-description").textContent="غير متوفر.",document.getElementById("tool-image").src="/images/default.png",ju(!0);return}qt=0,oc(),ju(!1),e.onchange=async()=>{const a=e.value;await rr(a),ke(),ze(a),await ic()},t&&(t.onclick=()=>oa()),r&&(r.onclick=()=>$I()),s&&(s.onclick=()=>UI()),o&&(o.onclick=()=>{const a=document.getElementById("tool-description-box");a.style.display=a.style.display==="none"?"block":"none"}),ke(),ze(e.value)}function oc(){if(cn.length===0)return;kt=cn[qt];const n=document.getElementById("tool-name"),e=document.getElementById("tool-description"),t=document.getElementById("tool-professions"),r=document.getElementById("tool-image"),s=r.parentElement;r.remove(),n.textContent=kt.name?.[z()]||"",e.textContent=kt.description?.[z()]||"لا يوجد وصف.",t.textContent=(kt.professions||[]).map(qI).join("، ");const o=document.createElement("img");o.id="tool-image",o.src=`/${kt.image_path}`,o.alt=kt.name?.[z()]||"",s.insertBefore(o,s.children[1]),document.getElementById("prev-tools-btn").disabled=qt===0,document.getElementById("next-tools-btn").disabled=qt===cn.length-1,o.onclick=oa,n.onclick=oa,te()}async function BI(){try{const n=je(Ne,"profession_tools"),e=cs(n);cn=(await He(e)).docs.map(r=>r.data())}catch(n){console.error("Error fetching tools from Firestore:",n),cn=[]}}function UI(){te(),qt<cn.length-1&&(qt++,oc(),Ge(JSON.parse(localStorage.getItem("user")),"tools"))}function $I(){te(),qt>0&&(qt--,oc(),Ge(JSON.parse(localStorage.getItem("user")),"tools"))}function oa(){if(kt){const n=document.getElementById("voice-select-tools").value,e=document.getElementById("game-lang-select-tools").value,t=kt.sound?.[e]?.[n];if(!t){console.warn("🔇 لا يوجد ملف صوت لنوع الصوت المحدد");return}const r=`/${t}`;Ae(r),Ge(JSON.parse(localStorage.getItem("user")),"tools_audio")}else console.warn("No tool selected for audio playback.")}function ju(n){["play-sound-btn-tools","prev-tools-btn","next-tools-btn","toggle-description-btn-tools","game-lang-select-tools","voice-select-tools"].forEach(e=>{const t=document.getElementById(e);t&&(t.disabled=n)})}function qI(n){return window.translations?.professions?.[n]||n}let Kn=[],Gr=0,Vn=null;async function Mf(){const n=document.querySelector("main.main-content"),t=await(await fetch("/html/professions.html")).text();n.innerHTML=t,Kn=(await He(je(Ne,"professions"))).docs.map(s=>s.data()),Dr(0),document.getElementById("next-profession-btn")?.addEventListener("click",jI),document.getElementById("prev-profession-btn")?.addEventListener("click",HI),document.getElementById("play-sound-btn-profession")?.addEventListener("click",No),document.getElementById("game-lang-select-profession")?.addEventListener("change",()=>{const s=document.getElementById("game-lang-select-profession").value;VI(s),Dr(Gr)}),document.getElementById("voice-select-profession")?.addEventListener("change",()=>{Dr(Gr)}),document.getElementById("profession-name")?.addEventListener("click",No),document.getElementById("profession-image")?.addEventListener("click",No),document.getElementById("toggle-description-btn-profession")?.addEventListener("click",()=>{const s=document.getElementById("profession-description");s&&s.classList.toggle("hidden")}),Ge("view_professions")}function Dr(n){if(n<0||n>=Kn.length)return;Gr=n,Vn=Kn[n];const e=z(),t=document.getElementById("profession-name"),r=document.getElementById("profession-image"),s=document.getElementById("profession-description");t&&(t.textContent=Vn.name?.[e]||"",t.classList.add("clickable-text")),r&&(r.src=Vn.image_path||"",r.classList.add("clickable-image")),s&&(s.textContent=Vn.description?.[e]||"")}function jI(){const n=(Gr+1)%Kn.length;Dr(n)}function HI(){const n=(Gr-1+Kn.length)%Kn.length;Dr(n)}function No(){if(!Vn)return;const n=document.getElementById("voice-select-profession")?.value||"boy",e=z(),t=Vn.sound?.[e]?.[n];t&&Ae(t)}console.log("🎯 النسخة التي تم تحميلها تحتوي على المهن والأدوات");let Js=[],Ei=null,gt="animals",Wi="teacher";console.log("✅ تم تحميل alphabet-press-game.js");const zI={ar:["أ","ب","ت","ث","ج","ح","خ","د","ذ","ر","ز","س","ش","ص","ض","ع","غ","ف","ق","ك","ل","م","ن","ه","و","ي"],en:[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"],he:["א","ב","ג","ד","ה","ו","ז","ח","ט","י","כ","ל","מ","נ","ס","ע","פ","צ","ק","ר","ש","ת"]},Hu=[{id:"animals",name_ar:"حيوانات",name_en:"Animals",name_he:"חיות"},{id:"fruits",name_ar:"فواكه",name_en:"Fruits",name_he:"פירות"},{id:"vegetables",name_ar:"خضروات",name_en:"Vegetables",name_he:"ירקות"},{id:"human-body",name_ar:"جسم الإنسان",name_en:"Human Body",name_he:"גוף האדם"},{id:"professions",name_ar:"مهن",name_en:"Professions",name_he:"מקצועות"},{id:"profession_tools",name_ar:"أدوات المهن",name_en:"Profession Tools",name_he:"כלי עבודה"}];function GI(n){Wi=n}async function WI(){const n=document.getElementById("alphabet-press-language-select"),e=document.getElementById("alphabet-press-category-select"),t=document.getElementById("alphabet-press-voice-select"),r=document.getElementById("alphabet-press-play-audio-sidebar");!n||!e||!t||!r||(n.innerHTML="",["ar","en","he"].forEach(s=>{const o=document.createElement("option");o.value=s,o.textContent={ar:"العربية",en:"English",he:"עברית"}[s],n.appendChild(o)}),n.value=z(),e.innerHTML="",Hu.forEach(s=>{const o=document.createElement("option");o.value=s.id,o.textContent=s["name_"+z()],e.appendChild(o)}),e.value=gt,t.innerHTML=`
    <option value="teacher">المعلم</option>
    <option value="boy">صوت ولد</option>
    <option value="girl">صوت بنت</option>
    <option value="child">صوت طفل</option>
  `,t.value=Wi,n.addEventListener("change",async()=>{await rr(n.value),ke(),ze(n.value),Array.from(e.options).forEach(s=>{const o=Hu.find(a=>a.id===s.value);o&&(s.textContent=o["name_"+n.value])}),QI(n.value)}),e.addEventListener("change",()=>{JI(e.value)}),t.addEventListener("change",()=>{GI(t.value)}),r.addEventListener("click",()=>{KI()}))}async function xf(){const n=document.querySelector(".main-content");try{const e=await fetch("/html/alphabet-press.html");if(!e.ok)throw new Error(`Failed to load html: ${e.statusText}`);n.innerHTML=await e.text()}catch(e){console.error(e),n.innerHTML="<p style='color:red;'>فشل تحميل اللعبة.</p>";return}Ff(z()),Ki(),await ac(gt),ke()}function KI(){if(!Ei)return;const n=Bf(Ei,Wi,gt);if(n){Ae(n);const e=JSON.parse(localStorage.getItem("user"));e&&Ge(e,gt)}}async function QI(n){Ff(z()),Ki(),await ac(gt)}async function JI(n){gt=n,await ac(n),Ki()}function Ff(n){const e=document.getElementById("alphabet-keyboard");e&&(e.innerHTML="",(zI[n]||[]).forEach(t=>{const r=document.createElement("button");r.className="keyboard-button",r.textContent=t,r.onclick=()=>XI(t),e.appendChild(r)}))}async function ac(n){Xs("جارٍ التحميل...","info");try{const e=je(Ne,"categories",n,"items"),t=cs(e);Js=(await He(t)).docs.map(s=>s.data()),cc(),Js.length===0&&Xs("لا توجد عناصر لهذه الفئة.","warning")}catch(e){console.error(e),Xs("فشل تحميل العناصر.","error"),Js=[]}}function XI(n){te();const e=z(),t=Js.filter(r=>r.letter?.[e]?.toLowerCase()===n.toLowerCase());if(t.length>0){const r=t[Math.floor(Math.random()*t.length)];YI(r)}else Ki(),Xs(`لا يوجد عنصر يبدأ بالحرف "${n}"`,"warning")}function YI(n){Ei=n;const e=document.getElementById("alphabet-press-image"),t=document.getElementById("alphabet-press-item-name"),r=n.name?.[z()]||"";e&&(e.src=`/images/${gt}/${n.image}`,e.alt=r),t&&(t.innerHTML=r?`<span class="highlight-first-letter">${r[0]}</span>${r.slice(1)}`:"");const s=Bf(n,Wi,gt);if(s){Ae(s);const a=JSON.parse(localStorage.getItem("user"));a&&Ge(a,gt)}const o=document.getElementById("item-display-area");o&&(o.style.display="flex"),cc()}function Bf(n,e,t){const r=z(),s=`${e}_${r}`,o=`/audio/${r}/${t}/`;let a=null;return t==="professions"&&n.sound?.[r]?.[e]?`/${n.sound[r][e]}`:(n.voices?.[s]?a=n.voices[s]:n.sound_base&&(a=`${n.sound_base}_${e}_${r}.mp3`),a?`${o}${a}`:(console.warn(`🔇 لا يوجد ملف صوت للعنصر: ${n.name?.[r]}`),null))}function Ki(){const n=document.getElementById("item-display-area");n&&(n.style.display="none"),Ei=null,te(),cc()}function Xs(n,e){const t=document.getElementById("game-message");t&&(t.querySelector("p").textContent=n,t.style.display="block",t.className="info-box",t.style.backgroundColor={info:"var(--color-info)",warning:"var(--color-warning)",error:"var(--color-danger)"}[e]||"var(--color-info)",t.style.color=e==="warning"?"var(--color-text-primary)":"var(--color-white)")}function cc(){const n=document.getElementById("game-message");n&&(n.style.display="none")}let Ys,Zs,xn,ei,Fn,yt,Uf=[],jt=[],aa=0,vi=!1,ls={},de="animals",Ye="image-image";async function $f(){console.log("جارٍ تحميل محتوى لعبة الذاكرة...");const n=document.querySelector(".main-content");n.innerHTML=`

        <div class="memory-game-grid" id="memory-game-board">
            </div>
        <div class="game-status" id="memory-game-status">
            </div>
    `,Ys=document.getElementById("memory-game-board"),yt=document.getElementById("memory-game-status"),await tT()}async function ZI(){console.log("Initializing Memory Game Sidebar Controls..."),Zs=document.getElementById("memory-game-start-button"),xn=document.getElementById("memory-game-lang-select"),ei=document.getElementById("memory-game-topic-select"),Fn=document.getElementById("memory-game-mode-select"),eT();const n=z();xn&&(xn.value=n),Fn&&(Fn.value=Ye),Object.keys(ls).length>0?Hf():console.log("allCardData is empty, populateTopicOptions will be called after fetchCardData.")}function eT(){Zs&&(Zs.removeEventListener("click",Wr),Zs.addEventListener("click",Wr)),xn&&(xn.removeEventListener("change",zu),xn.addEventListener("change",zu)),ei&&(ei.removeEventListener("change",Gu),ei.addEventListener("change",Gu)),Fn&&(Fn.removeEventListener("change",Wu),Fn.addEventListener("change",Wu))}function zu(n){rr(n.target.value).then(()=>{ze(n.target.value),iT()})}function Gu(n){de=n.target.value,Wr()}function Wu(n){Ye=n.target.value,Wr()}function Bn(n,e){const t=z();return e==="name"?n[`name_${t}`]:e==="letter"?n[`letter_${t}`]:e==="audio"?n[`audio_${t}`]:""}async function tT(){const n=z();if(!Ne){console.error("Firestore DB not initialized. Cannot fetch data."),yt.textContent=n==="ar"?"فشل إعداد قاعدة البيانات.":"Database setup failed.";return}try{const e=await He(je(Ne,"categories")),t={};for(const r of e.docs){const s=r.id,o=je(Ne,"categories",s,"items"),a=await He(o);t[s]=a.docs.map(l=>{const h=l.data();return{id:l.id,image_name:h.image,name_ar:h.name.ar,name_en:h.name.en,name_he:h.name.he||"",letter_ar:h.letter?h.letter.ar:"",letter_en:h.letter?h.letter.en:"",letter_he:h.letter?h.letter.he:"",audio_ar:h.voices&&h.voices.ar?h.voices.ar:"",audio_en:h.voices&&h.voices.en?h.voices.en:"",audio_he:h.voices&&h.voices.he?h.voices.he:""}})}ls=t,Hf(),Wr()}catch(e){console.error("فشل تحميل البيانات:",e),yt.textContent=n==="ar"?"فشل تحميل البيانات.":n==="he"?"שגיאה בטעינת נתונים":"Failed to load data."}}function Ku(n){for(let e=n.length-1;e>0;e--){const t=Math.floor(Math.random()*(e+1));[n[e],n[t]]=[n[t],n[e]]}return n}function Wr(){const n=z();if(!Ys){console.error("Game board element not found in createBoard.");return}Ys.innerHTML="",yt.textContent="",jt=[],aa=0,vi=!1;const e=ls[de];if(!e||e.length<6){console.warn(`لا توجد بيانات كافية للموضوع ${de} أو الموضوع غير موجود.`),yt.textContent=n==="ar"?"لا توجد بيانات كافية لهذا الموضوع.":"Not enough data for this topic.";return}const r=Ku([...e]).slice(0,6),s=[];if(r.forEach(a=>{const l={text_ar:a.name_ar,text_en:a.name_en,text_he:a.name_he};Ye==="image-image"?(s.push({type:"image",value:`images/${de}/${a.image_name}`,id:a.id,...l}),s.push({type:"image",value:`images/${de}/${a.image_name}`,id:a.id,...l})):Ye==="image-word"?a.name_he?(s.push({type:"image",value:`images/${de}/${a.image_name}`,id:a.id,...l}),s.push({type:"word",value:Bn(a,"name"),id:a.id,...l})):console.warn(`لا يوجد اسم عبري لـ ${a.id} في الموضوع ${de}. سيتم تخطي هذا العنصر لهذا النمط.`):Ye==="image-char"?a.letter_ar&&a.letter_en&&a.letter_he?(s.push({type:"image",value:`images/${de}/${a.image_name}`,id:a.id,...l}),s.push({type:"char",value:Bn(a,"letter"),id:a.id,...l})):console.warn(`لا يوجد حرف لـ ${a.id} في الموضوع ${de} لجميع اللغات المطلوبة. سيتم تخطي هذا العنصر لهذا النمط.`):Ye==="image-audio"&&(a.audio_ar&&a.audio_en&&a.audio_he?(s.push({type:"image",value:`images/${de}/${a.image_name}`,id:a.id,...l}),s.push({type:"audio",value:`audio/${n}/${de}/${Bn(a,"audio")}`,id:a.id,...l,image_url_for_audio_card:`images/${de}/${a.image_name}`})):console.warn(`لا يوجد صوت لـ ${a.id} في الموضوع ${de} لجميع اللغات المطلوبة. سيتم تخطي هذا العنصر لهذا النمط.`))}),s.length<12){yt.textContent=n==="ar"?"لا توجد عناصر كافية لهذا النمط والموضوع.":"Not enough items for this mode and topic.",console.error("Not enough cards generated for the selected mode. Generated:",s.length);return}Ku(s).forEach(a=>{const l=document.createElement("div");l.classList.add("memory-card"),l.dataset.cardId=a.id,l.dataset.cardType=a.type;let h="";if(a.type==="image"?h=`<img src="${a.value}" alt="${a.id}">`:a.type==="word"||a.type==="char"?h=`<span class="card-display-text">${a.value}</span>`:a.type==="audio"&&(h=`
                <img src="${a.image_url_for_audio_card}" alt="${a.id}">
                <audio src="${a.value}" preload="auto"></audio>
                <button class="play-audio-btn">▶</button>
            `),l.innerHTML=`
            <div class="front-face">
                ${h}
            </div>
            <div class="back-face"></div>
        `,a.type==="word"||a.type==="char"){const d=l.querySelector(".card-display-text");d&&(n==="he"?d.style.direction="rtl":d.style.direction="ltr")}if(a.type==="audio"){const d=l.querySelector(".play-audio-btn");d&&d.addEventListener("click",m=>{m.stopPropagation();const _=l.querySelector("audio");_&&Ae(_.src)})}l.addEventListener("click",qf),Ys.appendChild(l)}),Uf=document.querySelectorAll(".memory-card")}function qf(){if(!vi&&this!==jt[0]&&!this.classList.contains("matched")){if(this.classList.add("flipped"),jt.push(this),this.dataset.cardType==="audio"){const n=this.querySelector("audio");n&&Ae(n.src)}jt.length===2&&(vi=!0,nT())}}function nT(){const n=z(),[e,t]=jt,r=e.dataset.cardId,s=t.dataset.cardId,o=e.dataset.cardType,a=t.dataset.cardType;let l=!1;if(r===s&&(Ye==="image-image"?l=o==="image"&&a==="image":Ye==="image-word"?l=o==="image"&&a==="word"||o==="word"&&a==="image":Ye==="image-char"?l=o==="image"&&a==="char"||o==="char"&&a==="image":Ye==="image-audio"&&(l=o==="image"&&a==="audio"||o==="audio"&&a==="image")),l){rT(),aa++,yt.textContent=n==="ar"?"لقد وجدت زوجًا!":n==="he"?"מצאת זוג!":"You found a pair!";const h=JSON.parse(localStorage.getItem("user"));h&&Ge(h,de),aa===6&&setTimeout(()=>{yt.textContent=n==="ar"?"تهانينا! لقد فزت باللعبة!":n==="he"?"מזל טוב! ניצחת במשחק!":"Congratulations! You won the game!"},500)}else sT(),yt.textContent=n==="ar"?"حاول مرة أخرى.":n==="he"?"נסה שוב.":"Try again."}function rT(){jt.forEach(n=>{n.removeEventListener("click",qf),n.classList.add("matched")}),jf()}function sT(){setTimeout(()=>{jt.forEach(n=>n.classList.remove("flipped")),jf()},1e3)}function jf(){[jt,vi]=[[],!1]}function iT(){const n=z();Uf.forEach(e=>{const t=e.dataset.cardId,r=e.dataset.cardType,s=ls[de],o=s?s.find(a=>a.id===t):null;if(o){const a=e.querySelector(".card-display-text");if(a&&(r==="word"?a.textContent=Bn(o,"name"):r==="char"&&(a.textContent=Bn(o,"letter")),(r==="word"||r==="char")&&(n==="he"?a.style.direction="rtl":a.style.direction="ltr")),r==="audio"){const l=e.querySelector("audio");l&&(l.src=`audio/${n}/${de}/${Bn(o,"audio")}`)}}})}function Hf(){const n=document.getElementById("memory-game-topic-select");if(!n){console.error("Topic select element not found in memory game sidebar controls.");return}n.innerHTML="",Object.keys(ls).forEach(t=>{const r=document.createElement("option");r.value=t,r.textContent=t.charAt(0).toUpperCase()+t.slice(1),n.appendChild(r)}),n.value=de}let zf=[],ca=new Map,Gf=[],Or=null,rn=[];async function ln(){te(),localStorage.getItem("lang")||localStorage.setItem("lang","ar");const n=document.querySelector("main.main-content");n.innerHTML=`
    <section class="tools-match-game-section">
      <h2 class="game-title" data-i18n="tools_match_title">من صاحب الأداة؟</h2>

      <div class="tool-display"></div>

      <div id="profession-options" class="options-grid" aria-live="polite"></div>

      <div class="actions">
        <button id="check-button" class="check-btn" data-i18n="check">تحقق من الإجابة</button>
        <button id="next-button" class="next-btn" style="display:none" data-i18n="next">التالي</button>
      </div>

      <div id="result-message" class="result-message" role="status"></div>
    </section>
  `,ke(),oT(),await aT(),Qu(),document.getElementById("check-button").onclick=uT,document.getElementById("next-button").onclick=Qu}function oT(){const n=document.getElementById("tools-match-replay-sound-btn"),e=document.getElementById("tools-match-lang-select"),t=document.getElementById("tools-match-display-mode"),r=document.getElementById("tools-match-voice-select");n&&(n.onclick=()=>{const s=Or?.sound?.[Kr()]?.[la()];s&&Ae(s)}),e&&(e.value=Kr(),e.onchange=()=>{localStorage.setItem("lang",e.value),ln()}),t&&(t.value=lc(),t.onchange=()=>ln()),r&&(r.value=la(),r.onchange=()=>ln())}async function aT(){zf=(await He(je(Ne,"profession_tools"))).docs.map(t=>({id:t.id,...t.data()}));const e=await He(je(Ne,"professions"));ca=new Map(e.docs.map(t=>[t.id,{id:t.id,...t.data()}])),Gf=Array.from(ca.keys())}function Qu(){const n=document.getElementById("result-message");n.textContent="",document.getElementById("check-button").style.display="inline-block",document.getElementById("next-button").style.display="none",Or=hT(zf),cT(Or),lT(Or)}function cT(n){const e=document.querySelector(".tool-display"),t=lc(),r=Kr(),s=la();if(e.innerHTML="",t.startsWith("image")){const o=document.createElement("img");o.src="/"+n.image_path,o.alt=n.name?.[r]||"",o.classList.add("tool-image","clickable-image"),o.onclick=()=>{const a=n.sound?.[r]?.[s];a&&Ae(a)},e.appendChild(o)}if(t.startsWith("text")){const o=document.createElement("div");o.textContent=n.name?.[r]||"؟",o.classList.add("tool-name","clickable-text"),o.onclick=()=>{const a=n.sound?.[r]?.[s];a&&Ae(a)},e.appendChild(o)}if(t.startsWith("sound")){const o=n.sound?.[r]?.[s];o&&Ae(o)}}function lT(n){const e=Kr();rn=Array.isArray(n.professions)?[...n.professions]:[];const t=Gf.filter(l=>!rn.includes(l)),r=Math.max(0,6-rn.length),s=Wf(t,r),o=dT([...new Set([...rn,...s])]),a=document.getElementById("profession-options");a.innerHTML="";for(const l of o){const h=ca.get(l),d=document.createElement("button");if(d.className="option-btn",d.dataset.profession=l,d.onclick=()=>d.classList.toggle("selected"),lc().endsWith("image")&&h?.image_path){const m=document.createElement("img");m.src="/"+h.image_path,m.alt=h?.name?.[e]||l,m.style.width="100px",d.appendChild(m)}else d.textContent=h?.name?.[e]||l;a.appendChild(d)}}function uT(){const n=Array.from(document.querySelectorAll(".option-btn.selected")).map(s=>s.dataset.profession),e=document.getElementById("result-message"),t=document.getElementById("next-button"),r=n.length===rn.length&&n.every(s=>rn.includes(s));e.classList.remove("ok","bad"),r?(e.textContent="أحسنت! اخترت جميع المهن الصحيحة.",e.classList.add("ok"),Ae("/audio/success/success_toolMatch_a.mp3")):(e.textContent="بعض اختياراتك غير صحيحة. حاول مجددًا.",e.classList.add("bad"),Ae("/audio/fail/fail_toolMatch_a.mp3")),Ge("tools-match-multi",{tool:Or.name?.[Kr()],selected:n,correctAnswers:rn,success:r}),document.getElementById("check-button").style.display="none",t.style.display="inline-block"}function Kr(){return document.getElementById("tools-match-lang-select")?.value||localStorage.getItem("lang")||z()}function la(){return document.getElementById("tools-match-voice-select")?.value||"boy"}function lc(){return document.getElementById("tools-match-display-mode")?.value||"image-text"}function hT(n){return n[Math.floor(Math.random()*n.length)]}function Wf(n,e){const t=[...n];for(let r=t.length-1;r>0;r--){const s=Math.floor(Math.random()*(r+1));[t[r],t[s]]=[t[s],t[r]]}return t.slice(0,e)}function dT(n){return Wf(n,n.length)}window.loadToolsMatchGameContent=ln;let ht=[],it=0,ua=null;async function Kf(){te();const n=document.querySelector("main.main-content"),e=document.getElementById("fruit-sidebar-controls");if(!n||!e){console.error("Main content area or fruit sidebar controls not found.");return}n.innerHTML=`
        <div class="game-box">
            <h2 id="fruit-name-ar" class="item-main-name">---</h2>
            <img id="fruit-image" src="" alt="Fruit" />
            <div class="info-box"> <h4 data-i18n="description_title">الوصف:</h4>
                <p id="fruit-description-ar" class="fruit-description-ar"></p>
                <p id="fruit-description-en" class="fruit-description-en"></p>
            </div>
            <div class="navigation-buttons">
                <button id="prev-fruit-btn" class="nav-button" data-i18n="previous">السابق</button>
                <button id="next-fruit-btn" class="nav-button" data-i18n="next">التالي</button>
            </div>
        </div>
    `,e.innerHTML=`
        <div class="sidebar-game-controls">
            <div class="control-group">
                <label for="game-lang-select-fruit">لغة اللعبة:</label>
                <select id="game-lang-select-fruit"></select>
            </div>
            <div class="control-group">
                <label for="voice-select-fruit">نوع الصوت:</label>
                <select id="voice-select-fruit"></select>
            </div>
            <button id="play-sound-btn-fruit" class="action-button">تشغيل الصوت</button>
            <button id="view-all-fruits-btn" class="action-button">عرض كل الفواكه</button>
        </div>
    `,yT(document.getElementById("game-lang-select-fruit"),document.getElementById("voice-select-fruit"),document.getElementById("play-sound-btn-fruit"),document.getElementById("next-fruit-btn"),document.getElementById("prev-fruit-btn"),Kf,pT,mT,fT);try{const t=cs(je(Ne,"categories","fruits","items"));ht=(await He(t)).docs.map(s=>({id:s.id,...s.data()})),console.log(`✅ تم تحميل ${ht.length} عنصر من مجموعة الفواكه.`),ht.length>0?(console.table(ht.map(s=>({id:s.id,name_ar:s.name?.ar,image:s.image,sound_base:s.sound_base,voices:s.voices?Object.keys(s.voices):[]}))),it=0,uc(ht[it]),Do(!1)):(n.innerHTML='<p class="info-message">لا توجد فواكه متاحة حالياً.</p>',Do(!0))}catch(t){console.error("❌ خطأ أثناء تحميل بيانات الفواكه:",t),n.innerHTML='<p class="error-message">حدث خطأ أثناء تحميل بيانات الفواكه. يرجى المحاولة لاحقاً.</p>',Do(!0)}}function uc(n){ua=n;const e=document.getElementById("fruit-name-ar"),t=document.getElementById("fruit-name-en"),r=document.getElementById("fruit-image"),s=document.getElementById("fruit-description-ar"),o=document.getElementById("fruit-description-en");e&&(e.innerText=n.name?.ar||"---"),t&&(t.innerText=n.name?.en||"---"),r&&n.image&&(r.src=`/images/fruits/${n.image}`,r.alt=n.name?.en||"Fruit image"),s&&(s.innerText=n.description?.ar||"---"),o&&(o.innerText=n.description?.en||"---");const a=document.getElementById("next-fruit-btn"),l=document.getElementById("prev-fruit-btn");a&&(a.disabled=it>=ht.length-1),l&&(l.disabled=it<=0),ke()}function fT(){te(),it<ht.length-1&&(it++,uc(ht[it]))}function mT(){te(),it>0&&(it--,uc(ht[it]))}function pT(){if(ua){const n=document.getElementById("voice-select-fruit").value,e=gT(ua,n);e&&(Ae(e),Ge(JSON.parse(localStorage.getItem("user")),"fruits"))}else console.warn("⚠️ لا توجد فاكهة معروضة لتشغيل الصوت.")}function gT(n,e){const t=document.getElementById("game-lang-select-fruit").value,r="fruits",s=`${e}_${t}`;let o;if(n.voices&&n.voices[s])o=n.voices[s],console.log(`✅ Found voice file: ${s} → ${o}`);else if(n.sound_base)o=`${n.sound_base}_${e}_${t}.mp3`,console.warn(`⚠️ Used fallback from sound_base: ${o}`);else return console.error(`❌ No voice or sound_base for: ${n.name?.[z()]}`),null;const a=`/audio/${t}/${r}/${o}`;return console.log(`🎧 Full audio path: ${a}`),a}function Do(n){const e=document.getElementById("play-sound-btn-fruit"),t=document.getElementById("next-fruit-btn"),r=document.getElementById("prev-fruit-btn"),s=document.getElementById("voice-select-fruit"),o=document.getElementById("game-lang-select-fruit");e&&(e.disabled=n),t&&(t.disabled=n),r&&(r.disabled=n),s&&(s.disabled=n),o&&(o.disabled=n)}function yT(n,e,t,r,s,o,a,l,h){n&&n.options.length===0?(["ar","en","he"].forEach(d=>{const m=document.createElement("option");m.value=d,m.textContent={ar:"العربية",en:"English",he:"עברית"}[d],n.appendChild(m)}),n.value=z()):n&&(n.value=z()),e&&e.options.length===0&&(["teacher","boy","girl","child"].forEach(d=>{const m=document.createElement("option");m.value=d,m.textContent={teacher:"المعلم",boy:"صوت ولد",girl:"صوت بنت",child:"صوت طفل"}[d],e.appendChild(m)}),e.value="teacher"),n.onchange=async()=>{const d=n.value;await rr(d),ke(),ze(d),await o()},t&&(t.onclick=()=>{a()}),s&&(s.onclick=()=>{l()}),r&&(r.onclick=()=>{h()})}let un=[],ot=0,ha=null;async function Qf(){te();const n=document.querySelector("main.main-content"),e=document.getElementById("vegetable-sidebar-controls");if(!n||!e){console.error("❌ Main content area or vegetable sidebar controls not found.");return}n.innerHTML=`
    <div class="game-box">
      <h2 id="vegetable-word" class="item-main-name">---</h2>
      <img id="vegetable-image" src="" alt="vegetable" />
      <div class="vegetable-details-section info-box">
        <h3>حقائق عن الخضروات:</h3>
        <ul id="vegetable-details-list">
          <li><strong data-i18n="vegetable_category">الصنف:</strong> <span id="vegetable-type">---</span></li>
          <li><strong>الفوائد:</strong> <span id="vegetable-benefits">---</span></li>
        </ul>
      </div>
      <div class="navigation-buttons">
        <button id="prev-vegetable-btn" class="nav-button" data-i18n="previous">السابق</button>
        <button id="next-vegetable-btn" class="nav-button" data-i18n="next">التالي</button>
      </div>
    </div>
  `,e.innerHTML=`
    <div class="sidebar-game-controls">
      <div class="control-group">
        <label for="game-lang-select-vegetable">لغة اللعبة:</label>
        <select id="game-lang-select-vegetable"></select>
      </div>
      <div class="control-group">
        <label for="voice-select-vegetable">نوع الصوت:</label>
        <select id="voice-select-vegetable"></select>
      </div>
      <button id="play-sound-btn-vegetable" class="action-button">تشغيل الصوت</button>
      <button id="view-all-vegetables-btn" class="action-button">عرض كل الخضروات</button>
    </div>
  `,IT(document.getElementById("game-lang-select-vegetable"),document.getElementById("voice-select-vegetable"),document.getElementById("play-sound-btn-vegetable"),document.getElementById("next-vegetable-btn"),document.getElementById("prev-vegetable-btn"),Qf,da,ET,_T);try{const t=cs(je(Ne,"categories","vegetables","items"));un=(await He(t)).docs.map(s=>({id:s.id,...s.data()})),un.length>0?(ot=0,hc(un[ot]),Oo(!1)):(n.innerHTML='<p class="info-message">لا توجد خضروات متاحة حالياً.</p>',Oo(!0))}catch(t){console.error("❌ خطأ أثناء تحميل بيانات الخضروات:",t),n.innerHTML='<p class="error-message">حدث خطأ أثناء تحميل بيانات الخضروات. يرجى المحاولة لاحقاً.</p>',Oo(!0)}}function hc(n){ha=n;const e=z(),t=document.getElementById("vegetable-word"),r=document.getElementById("vegetable-image"),s=document.getElementById("vegetable-type"),o=document.getElementById("vegetable-benefits");t&&(t.innerText=n.name?.[e]||"---",t.onclick=da),r&&n.image&&(r.src=`/images/vegetables/${n.image}`,r.alt=n.name?.en||"Vegetable image",r.onclick=da),s&&(s.innerText=n.type?.[e]||"---"),o&&(o.innerText=n.benefits?.[e]||"---");const a=document.getElementById("next-vegetable-btn"),l=document.getElementById("prev-vegetable-btn");a&&(a.disabled=ot>=un.length-1),l&&(l.disabled=ot<=0),ke()}function _T(){te(),ot<un.length-1&&(ot++,hc(un[ot]))}function ET(){te(),ot>0&&(ot--,hc(un[ot]))}function da(){if(ha){const n=document.getElementById("voice-select-vegetable").value,e=vT(ha,n);e&&(Ae(e),Ge(JSON.parse(localStorage.getItem("user")),"vegetables"))}else console.warn("⚠️ لا توجد خضروات معروضة لتشغيل الصوت.")}function vT(n,e){const t=document.getElementById("game-lang-select-vegetable").value,r="vegetables",s=`${e}_${t}`;let o;if(n.voices&&n.voices[s])o=n.voices[s],console.log(`✅ Found voice: ${s} → ${o}`);else if(n.sound_base)o=`${n.sound_base}_${e}_${t}.mp3`,console.warn(`⚠️ Used fallback from sound_base: ${o}`);else return console.error(`❌ لا يوجد مسار صوتي لـ ${n.name?.[z()]}`),null;const a=`/audio/${t}/${r}/${o}`;return console.log(`🎧 Full audio path: ${a}`),a}function Oo(n){const e=document.getElementById("play-sound-btn-vegetable"),t=document.getElementById("next-vegetable-btn"),r=document.getElementById("prev-vegetable-btn"),s=document.getElementById("voice-select-vegetable"),o=document.getElementById("game-lang-select-vegetable");e&&(e.disabled=n),t&&(t.disabled=n),r&&(r.disabled=n),s&&(s.disabled=n),o&&(o.disabled=n)}function IT(n,e,t,r,s,o,a,l,h){n&&n.options.length===0?(["ar","en","he"].forEach(d=>{const m=document.createElement("option");m.value=d,m.textContent={ar:"العربية",en:"English",he:"עברית"}[d],n.appendChild(m)}),n.value=z()):n&&(n.value=z()),e&&e.options.length===0&&(["teacher","boy","girl","child"].forEach(d=>{const m=document.createElement("option");m.value=d,m.textContent={teacher:"المعلم",boy:"صوت ولد",girl:"صوت بنت",child:"صوت طفل"}[d],e.appendChild(m)}),e.value="teacher"),n.onchange=async()=>{const d=n.value;await rr(d),ke(),ze(d),await o()},t&&(t.onclick=()=>{a()}),s&&(s.onclick=()=>{l()}),r&&(r.onclick=()=>{h()})}async function us(n){document.querySelectorAll(".sidebar-section").forEach(r=>{r.style.display="none"});const e=document.getElementById(`${n}-sidebar-controls`);e&&(e.style.display="block",ke()),n==="animals"?await Nf():n==="fruits"?await Kf():n==="vegetables"?await Qf():n==="human-body"?await Lf():n==="professions"?await Mf():n==="tools"?await ic():n==="alphabet-press"?await xf():n==="memory-game"&&await $f();const t=z();ze(t)}window.loadToolsMatchGameContent=ln;const TT=["animal","fruit","vegetable","human-body","profession","tools","alphabet-press","memory-game"],Ju=document.querySelector("main.main-content");if(Ju){const n=Ju.getAttribute("data-subject-type");n&&TT.includes(n)&&us(n)}const yn=document.querySelector("main.main-content"),Ii=document.getElementById("animal-sidebar-controls"),Xu=document.getElementById("fruit-sidebar-controls"),Yu=document.getElementById("vegetable-sidebar-controls"),Ti=document.getElementById("human-body-sidebar-controls"),wi=document.getElementById("alphabet-press-sidebar-controls"),Qr=document.getElementById("memory-game-sidebar-controls"),Ai=document.getElementById("tools-sidebar-controls"),bi=document.getElementById("profession-sidebar-controls"),De=document.getElementById("welcome-message"),Oe=document.getElementById("home-topic-cards");window.loadToolsMatchPage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none");try{const e=await(await fetch("/html/tools-match.html")).text();yn.innerHTML=e;const r=await(await fetch("/html/tools-match-controls.html")).text(),s=document.querySelector("aside.sidebar"),o=document.getElementById("tools-match-sidebar-controls");o&&o.remove(),s.insertAdjacentHTML("beforeend",r);const a=document.getElementById("tools-match-sidebar-controls");a&&(a.style.display="block"),await ln()}catch(n){yn.innerHTML="<p>تعذر تحميل اللعبة</p>",console.error(n)}};window.loadLogin=async()=>{We();try{const n=await fetch("/users/login-form.html");if(!n.ok)throw new Error("Failed to load login form");const e=await n.text();yn.innerHTML=e}catch(n){console.error("Error loading login form:",n),yn.innerHTML='<p style="color: red;">تعذر تحميل نموذج تسجيل الدخول. يرجى المحاولة لاحقاً.</p>'}};window.loadRegister=async()=>{We();try{const n=await fetch("/users/register-form.html");if(!n.ok)throw new Error("Failed to load register form");const e=await n.text();yn.innerHTML=e}catch(n){console.error("Error loading register form:",n),yn.innerHTML='<p style="color: red;">تعذر تحميل نموذج التسجيل. يرجى المحاولة لاحقاً.</p>'}};window.loadProfile=()=>{PI(),We()};window.loadAnimalsPage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none"),await Nf(),wT(),us("animal")};window.loadHumanBodyPage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none"),await Lf(),CT(),us("human-body")};window.loadProfessionsPage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none"),await Mf(),bi&&(bi.style.display="block"),us("profession")};window.loadAlphabetPressPage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none"),PT(),await WI(),await xf()};window.loadMemoryGamePage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none"),Qr?(await ZI(),VT()):console.error("Memory game sidebar controls not found. Cannot initialize."),await $f()};window.showHomePage=()=>{yn.innerHTML=`
            <h2 id="welcome-message-inner" style="display: block;" data-i18n="welcome_message">مرحباً بكم في الموسوعة التفاعلية</h2>
            <div id="home-topic-cards-inner" class="home-cards-container">
                <a href="#" class="topic-card animals" onclick="loadAnimalsPage(); return false;">
                    <span class="icon">🐾</span>
                    <h3 data-i18n="animals">الحيوانات</h3>
                </a>
				
				<a href="#" class="topic-card fruits" onclick="import('/src/js/main.js').then(m => {
					console.log('📦 loading fruits page via loadPage()');
					import('/src/subjects/fruits.js').then(f => m.loadPage('fruit', '/html/fruits.html', f.loadFruitsGameContent));
					return false;
				});">
					<span class="icon">🍎</span>
					<h3 data-i18n="fruits_title">الفواكه</h3>
				</a>



				<a href="#" class="topic-card vegetables" onclick="import('/src/js/main.js').then(m => {
					console.log('🥦 loading vegetables page via loadPage()');
					import('/src/subjects/vegetables.js').then(v => m.loadPage('vegetable', '/html/vegetables.html', v.loadVegetablesGameContent));
					return false;
				});">
					<span class="icon">🥦</span>
					<h3 data-i18n="vegetables">الخضروات</h3>
				</a>


                <a href="#" class="topic-card human-body" onclick="loadHumanBodyPage(); return false;">
                    <span class="icon">🧠</span>
                    <h3 data-i18n="human_body">جسم الإنسان</h3>
                </a>
                <a href="#" class="topic-card games" onclick="loadAlphabetPressPage(); return false;">
                    <span class="icon">🔠</span>
                    <h3 data-i18n="alphabet_game">لعبة الحروف</h3> </a>
                <a href="#" class="topic-card games" onclick="loadMemoryGamePage(); return false;">
                    <span class="icon">🧠</span>
                    <h3 data-i18n="memory_game_title">لعبة الذاكرة</h3>
                </a>
		
				<a href="#" class="topic-card professions" onclick="loadProfessionsPage(); return false;">
				<span class="icon">👷‍♂️</span>
				<h3 data-i18n="professions">المهن</h3>
				</a>
				<a href="#" class="topic-card tools" onclick="loadToolsPage(); return false;">
				  <span class="icon">🔧</span>
				  <h3 data-i18n="tools_topic">الأدوات</h3>
				</a>
				<a href="#" class="topic-card tools-match" onclick="loadToolsMatchPage(); return false;">
				  <span class="icon">🧰</span>
				  <h3 data-i18n="tools_match_topic">من صاحب الأداة؟</h3>
				</a>
					</div>
				  `,We();const n=localStorage.getItem("lang")||"ar";ze(n),ke()};function wT(){Ii&&(Ii.style.display="block")}function AT(){Ii&&(Ii.style.display="none")}function bT(){Xu&&(Xu.style.display="none")}function ST(){Yu&&(Yu.style.display="none")}function CT(){Ti&&(Ti.style.display="block")}function RT(){Ti&&(Ti.style.display="none")}function PT(){wi&&(wi.style.display="block")}function kT(){wi&&(wi.style.display="none")}function VT(){Qr&&(Qr.style.display="block")}function NT(){Qr&&(Qr.style.display="none")}function We(){AT(),bT(),ST(),RT(),kT(),NT(),DT(),bi&&(bi.style.display="none")}window.loadToolsPage=async()=>{We(),De&&(De.style.display="none"),Oe&&(Oe.style.display="none"),await ic(),Ai&&(Ai.style.display="block"),us("tools")};document.addEventListener("DOMContentLoaded",()=>{const n=localStorage.getItem("lang")||"ar";ze(n),initializeLanguage(),window.showHomePage()});function DT(){Ai&&(Ai.style.display="none")}window.loadToolsMatchGameContent=ln;
//# sourceMappingURL=index-CAw28jX3.js.map
