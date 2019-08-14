!function(t){function e(s){if(n[s])return n[s].exports;var i=n[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,s){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,n){(function(e){const s="undefined"!=typeof window?window:e,i="undefined"!=typeof window?null:n(8),r="undefined"!=typeof window?null:n(6),o="undefined"!=typeof window?null:n(7),h="undefined"!=typeof window?{}:r.STATUS_CODES,a=s.location||{},u=s.XP||n(3),d=s.XPBuffer||n(4),p=s.XPEmitter||n(5);t.exports=e.XPUploader=new u.Class("XPUploader",{extends:p,initialize:{promise:!0,value(t,e){u.attempt(e=>{p.call(this);u.isObject(t)||(t={url:t});u.isFalsy(t.url)||Object.assign(t,u.pick(u.parseURL(t.url),["hostname","path","port","protocol"]));this.downLoaded=0;this.upLoaded=0;this.chunks=[];this.state="idle";this.options=t;this.headers=this.options.headers||{};this.hostname=this.options.hostname||a.hostname||"";this.keepAlive=this.options.keepAlive||0;this.method=this.options.method||"POST";this.parser=this.options.parser||"json";this.path=this.options.path||"";this.port=this.options.port||!this.options.hostname&&a.port||null;this.protocol=this.options.protocol||!this.options.hostname&&a.protocol||"http:";this.url=u.toURL({protocol:this.protocol,hostname:this.hostname,port:this.port,pathname:this.pathname,search:this.search});this._handleDownload=this._handleDownload.bind(this);this._handleEnd=this._handleEnd.bind(this,e);this._handleError=this._handleError.bind(this,e);this._handlePipe=this._handlePipe.bind(this);this._handleResponse=this._handleResponse.bind(this,e);this._handleUpload=this._handleUpload.bind(this)},e)}},header(t,e){if(u.assertArgument(u.isString(t,!0),1,"string"),u.assertArgument(u.isVoid(e)||u.isFalse(e)||u.isInput(e,!0),2,"string"),!u.isDefined(e))return this.headers[t];"idle"===this.state&&(e?this.headers[t]=e:delete this.headers[t])},abort:{callback:!0,value(t){return this.tsAbort||!this.tsSubmit?void t(null,!1):(this.adaptee.abort(),this.state="aborted",this.tsAbort=Date.now(),t(null,!0),this)}},submit:{callback:!0,value(t,e,n){if(!u.isInstance(t,r?i.Readable:s.File))return void n(u.error(500,`"data" must be ${r?`Readable`:`File`}.`));if(!u.isVoid(e)&&!u.isInt(e,!0))return void n(u.error(500,`"offset" must be number.`));if(!this.tsSubmit){if(this.ready(n),this.upTotal=r?null:t.size,this.upLoaded=r?0:e||0,r){let e=this.adaptee=(this.protocol.startsWith("https")?o:r).request({hostname:this.hostname,keepAlive:this.keepAlive>0,keepAliveMsecs:this.keepAlive,method:this.method,path:this.path,port:this.port,protocol:this.protocol,withCredentials:!1});Object.keys(this.headers).forEach(t=>u.isInput(this.headers[t],!0)&&e.setHeader(t,this.headers[t])),e.setHeader("Content-Type",t.headers["content-type"]||"application/octet-stream"),e.setHeader("Content-Range",t.headers["content-range"]),e.on("error",this._handleError),e.on("pipe",this._handlePipe),e.on("response",this._handleResponse)}if(!r){let e=this.adaptee=new XMLHttpRequest;e.open(this.method,this.url,!0),Object.keys(this.headers).forEach(t=>u.isInput(this.headers[t],!0)&&e.setRequestHeader(t,this.headers[t])),e.setRequestHeader("Content-Type",t.type||"application/octet-stream"),e.setRequestHeader("Content-Range",`bytes ${this.upLoaded}-${t.size-1}/${t.size}`),e.addEventListener("progress",this._handleResponse),e.addEventListener("progress",this._handleDownload),e.addEventListener("load",this._handleResponse),e.addEventListener("load",this._handleEnd),e.addEventListener("error",this._handleError),e.upload.addEventListener("progress",this._handleUpload),e.upload.addEventListener("error",this._handleError)}return this.state="pending",this.tsSubmit=Date.now(),r?t.pipe(this.adaptee):this.adaptee.send(t),this.emit("submit",t),this}}},adaptee:{set(t){return this.adaptee||t},validate(t){return!u.isObject(t)&&"Object"}},chunks:{set(t){return this.chunks||t},validate(t){return!u.isArray(t)&&"Array"}},data:{set(t){return u.isDefined(this.data)?this.data:t}},downLoaded:{set(t){return t},validate(t){return!u.isInt(t,!0)&&"number"}},downRatio:{get(){return u.isVoid(this.downTotal)?null:this.downTotal?this.downLoaded/this.downTotal:1}},downTotal:{set(t){return u.isDefined(this.downTotal)?this.downTotal:t},validate(t){return!u.isNull(t)&&!u.isInt(t,!0)&&"number"}},error:{set(t){return u.isDefined(this.error)?this.error:t},validate(t){return!u.isNull(t)&&!u.isObject(t)&&"Object"}},headers:{set(t){return this.headers||u.isObject(t)&&u.cloneDeep(t)},validate(t){return!u.isObject(t)&&"Object"}},host:{get(){return`${this.hostname||``}${this.port?`:${this.port}`:``}`}},hostname:{set(t){return this.hostname||t},validate(t){return!u.isString(t,!0)&&"string"}},keepAlive:{set(t){return u.isDefined(this.keepAlive)?this.keepAlive:t},validate(t){return!u.isInt(t,!0)&&"number"}},method:{set(t){return this.method||u.upperCase(t)},validate(t){return!u.isString(t,!0)&&"string"}},parser:{set(t){return this.parser||t},validate(t){return!this.parsers.includes(t)&&"string"}},parsers:{frozen:!0,writable:!1,value:["buffer","json","text"]},path:{set(t){return u.isDefined(this.path)?this.path:t},then(t){let e=t.match(/([^?]*)(.*)/);this.pathname=e[1],this.query=e[2].slice(1)},validate(t){return!u.isString(t)&&"string"}},pathname:{set(t){return u.isDefined(this.pathname)?this.pathname:t},validate(t){return!u.isString(t)&&"string"}},port:{set(t){return u.isDefined(this.port)?this.port:t},validate(t){return!u.isNull(t)&&!u.isNumeric(t,!0)&&"number"}},protocol:{set(t){return this.protocol||t},validate(t){return!u.isString(t,!0)&&"string"}},query:{set(t){return u.isDefined(this.query)?this.query:t},validate(t){return!u.isString(t)&&"string"}},response:{set(t){return this.response||t},validate(t){return!u.isObject(t)&&"Object"}},search:{get(){return this.query?`?${this.query}`:``}},state:{set(t){return t},then(t){return"idle"!==t&&this.emit("state",t)},validate(t){return!this.states.includes(t)&&"string"}},states:{frozen:!0,writable:!1,value:["aborted","complete","failed","idle","pending"]},statusCode:{set(t){return this.statusCode||t},validate(t){return!u.isInt(t,!0)&&"number"}},statusMessage:{set(t){return u.isDefined(this.statusMessage)?this.statusMessage:t},validate(t){return!u.isNull(t)&&!u.isString(t)&&"string"}},time:{get(){return this.tsData?this.tsData-this.tsSubmit:void 0}},tsAbort:{set(t){return this.tsAbort||t},validate(t){return!u.isInt(t,!0)&&"number"}},tsData:{set(t){return this.tsData||t},validate(t){return!u.isInt(t,!0)&&"number"}},tsResponse:{set(t){return this.tsResponse||t},validate(t){return!u.isInt(t,!0)&&"number"}},tsSubmit:{set(t){return this.tsSubmit||t},validate(t){return!u.isInt(t,!0)&&"number"}},upLoaded:{set(t){return t},validate(t){return!u.isInt(t,!0)&&"number"}},upRatio:{get(){return u.isVoid(this.downTotal)?null:this.downTotal?this.downLoaded/this.downTotal:1}},upTotal:{set(t){return u.isDefined(this.downTotal)?this.downTotal:t},validate(t){return!u.isNull(t)&&!u.isInt(t,!0)&&"number"}},url:{set(t){return this.url||t},validate(t){return!u.isString(t,!0)&&"string"}},_handleDownload(t){r&&"buffer"!==this.parser&&this.chunks.push(t),this.emit("download",this.downLoaded+=r?d.byteLength(t):t.loaded,this.downTotal)},_handleEnd(t,e){let n=this.error||"buffer"===this.parser?null:r?this.chunks.join(""):e.target.response,s=this.error?"failed":"complete";"json"!==this.parser||this.error||(n=u.toDefined(u.parseJSON(n.toString()))),this.data=n,this.state=s,this.tsData=Date.now(),this.emit(this.error?"error":"data",this.error||n),"buffer"!==this.parser&&t(this.error,n)},_handleError(t,e){this.error=u.error(0,r?e.message:"Request not sent."),this.state="failed",this.emit("error",this.error),t(this.error,null)},_handlePipe(t){t.on("data",this._handleUpload)},_handleResponse(t,e){u.isDefined(this.statusCode)||(this.response=r?e:e.target,this.statusCode=this.response[r?"statusCode":"status"]||502,this.statusMessage=this.response[r?"statusMessage":"statusText"]||h[this.statusCode]||null,this.error=this.statusCode>=400?u.error(this.statusCode,this.statusMessage):null,this.downTotal=u.toDefined(u.toFinite(r?this.response.headers["content-length"]:this.response.getResponseHeader("Content-Length"))),this.tsResponse=Date.now(),r&&this.response.on("data",this._handleDownload),r&&this.response.on("end",this._handleEnd),this.emit("response",this.response),"buffer"===this.parser&&t(this.error,this.error?null:this.response))},_handleUpload(t){this.emit("upload",this.upLoaded+=r?d.byteLength(t):t.loaded,this.upTotal)}})}).call(e,n(1))},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){t.exports=n(0)},function(t,e){t.exports=XP},function(t,e){t.exports=XPBuffer},function(t,e){t.exports=XPEmitter},function(t,e){t.exports=http},function(t,e){t.exports=https},function(t,e){t.exports=stream}]);