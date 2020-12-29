(this["webpackJsonpreact-starter"]=this["webpackJsonpreact-starter"]||[]).push([[0],{202:function(e,t,n){},275:function(e,t,n){e.exports=n(324)},280:function(e,t,n){},312:function(e,t){},313:function(e,t){},321:function(e,t){},324:function(e,t,n){"use strict";n.r(t);var o=n(35),a=n.n(o),r=n(256),i=n.n(r),c=(n(280),n(9)),s=n.n(c),l=n(13),u=n(16),d=n(15),f=n(41),m=n(42),h=n(188),v=n.n(h),p=(n(202),n(257)),g=n.n(p),w=n(145),b=function(e){var t=a.a.useRef(null),n=a.a.useCallback((function(){if(t){var n=setInterval((function(){var n,o=null===(n=t.current)||void 0===n?void 0:n.getScreenshot();e.updatedScreenshot(o)}),500);setTimeout((function(){clearTimeout(n)}),6e4)}}),[t]);return a.a.createElement(o.Fragment,null,a.a.createElement(v.a,{audio:!1,height:720,ref:t,screenshotFormat:"image/jpeg",width:1280,videoConstraints:{facingMode:"user"}}),a.a.createElement("button",{onClick:n},"Capture photo"))},k=(a.a.Component,Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)));function _(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var E=function(e){var t=a.a.useRef(null),n=a.a.useCallback((function(){if(t){var e=setInterval((function(){}),500);setTimeout((function(){clearTimeout(e)}),6e4)}}),[t]);return a.a.createElement(o.Fragment,null,a.a.createElement(v.a,{audio:!1,height:720,ref:t,id:"video_main_id",screenshotFormat:"image/jpeg",width:1280,videoConstraints:{facingMode:"user"}}),a.a.createElement("button",{onClick:n},"Capture photo"))},y=function(e){Object(m.a)(n,e);var t=Object(f.a)(n);function n(){var e;Object(u.a)(this,n);for(var o=arguments.length,a=new Array(o),r=0;r<o;r++)a[r]=arguments[r];return(e=t.call.apply(t,[this].concat(a))).socket=void 0,e.state={ids:{},latest_image:"",loaded_model:"loading",posenet_data:{}},e.res_net=void 0,e.mobile_net=void 0,e}return Object(d.a)(n,[{key:"load_model",value:function(){var e=Object(l.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.time("resnet loaded"),e.next=3,w.a({architecture:"ResNet50",outputStride:16,inputResolution:{width:640,height:480},multiplier:1});case 3:this.res_net=e.sent,this.setState({loaded_model:"res_net"}),console.timeEnd("resnet loaded");case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidMount",value:function(){var e=Object(l.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("mounted"),console.time("mobilenet loaded"),e.next=4,w.a({architecture:"MobileNetV1",outputStride:16,inputResolution:{width:640,height:480},multiplier:.75});case 4:this.mobile_net=e.sent,this.setState({loaded_model:"mobile_net"}),this.fromMediaStream(),console.log("dafafd"),console.timeEnd("mobilenet loaded"),this.load_model();case 10:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getNet",value:function(){return"res_net"!==this.state.loaded_model?this.mobile_net:this.res_net}},{key:"fromMediaStream",value:function(){var e=Object(l.a)(s.a.mark((function e(){var t,n=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:null===(t=document.getElementById("video_main_id"))||void 0===t||t.addEventListener("loadeddata",Object(l.a)(s.a.mark((function e(){var o;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:try{o=n.getNet(),setInterval(Object(l.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=n,e.next=3,o.estimateSinglePose(t);case 3:e.t1=e.sent,e.t2={posenet_data:e.t1},e.t0.setState.call(e.t0,e.t2);case 6:case"end":return e.stop()}}),e)}))),500)}catch(a){console.log(a)}case 1:case"end":return e.stop()}}),e)}))));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return a.a.createElement("div",{className:"App"},a.a.createElement(E,null),a.a.createElement("br",null),a.a.createElement("div",{className:"",style:{width:"500px"}},"loading"===this.state.loaded_model?a.a.createElement("div",{className:""},"Loading Model"):a.a.createElement("div",{className:""},"Loaded ",this.state.loaded_model),a.a.createElement("pre",null,JSON.stringify(this.state,void 0,8))))}}]),n}(a.a.Component);i.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(y,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/origin-to-server-socket-image",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/origin-to-server-socket-image","/service-worker.js");k?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var o=n.headers.get("content-type");404===n.status||null!=o&&-1===o.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):_(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):_(t,e)}))}}()}},[[275,1,2]]]);
//# sourceMappingURL=main.b56b812e.chunk.js.map