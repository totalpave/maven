// Copyright (c) 2013 Intel Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Implementation of the W3C's Raw Socket API.
// http://www.w3.org/2012/sysapps/raw-sockets/

var v8tools = requireNative('v8tools');

var internal = requireNative('internal');
internal.setupInternalExtension(extension);

var common = requireNative('sysapps_common');
common.setupSysAppsCommon(internal, v8tools);

// The ReadyStateObserver is a proxy object that will
// subscribe to the parent's |readystate| event. An object
// cannot subscribe to its own events otherwise it will
// leak (because it creates a circular reference).
//
var ReadyStateObserver = function(object_id, initial_state) {
  common.BindingObject.call(this, object_id);
  common.EventTarget.call(this);

  this._addEvent("readystate");
  this.readyState = initial_state;

  var that = this;
  this.onreadystate = function(event) {
    that.readyState = event.data;
  };

  this.destructor = function() {
    this.onreadystate = null;
  };
};

ReadyStateObserver.prototype = new common.EventTargetPrototype();

// TCPSocket interface.
//
// TODO(tmpsantos): We are currently not throwing any exceptions
// neither validating the input parameters.
//
// TODO(tmpsantos): TCPOptions argument is being ignored by now.
//
var TCPSocket = function(remoteAddress, remotePort, options, object_id) {
  common.BindingObject.call(this, object_id ? object_id : common.getUniqueId());
  common.EventTarget.call(this);

  if (object_id == undefined)
    internal.postMessage("TCPSocketConstructor", [this._id]);

  options = options || {};

  if (!options.localAddress)
    options.localAddress = "0.0.0.0";
  if (!options.localPort)
    options.localPort = 0;
  if (!options.addressReuse)
    options.addressReuse = true;
  if (!options.noDelay)
    options.noDelay = true;
  if (!options.useSecureTransport)
    options.useSecureTransport = false;

  this._addMethod("_close");
  this._addMethod("_halfclose");
  this._addMethod("suspend");
  this._addMethod("resume");
  this._addMethod("_sendString");

  this._addEvent("drain");
  this._addEvent("open");
  this._addEvent("close");
  this._addEvent("error");
  this._addEvent("data");

  function sendWrapper(data) {
    this._sendString(data);

    // FIXME(tmpsantos): The spec says that send() should always
    // return if you can keep sending data. This can only be
    // verified in the native implementation, which makes this
    // call sync. We are returning always true here to keep the
    // implementation async.
    return true;
  };

  function closeWrapper(data) {
    if (this._readyStateObserver.readyState == "closed")
      return;

    this._readyStateObserver.readyState = "closing";
    this._close();
  };

  function halfcloseWrapper(data) {
    if (this._readyStateObserver.readyState == "closed")
      return;

    this._readyStateObserver.readyState = "halfclosed";
    this._halfclose();
  };

  Object.defineProperties(this, {
    "_readyStateObserver": {
      value: new ReadyStateObserver(
          this._id, object_id ? "open" : "opening"),
    },
    "_readyStateObserverDeleter": {
      value: v8tools.lifecycleTracker(),
    },
    "send": {
      value: sendWrapper,
      enumerable: true,
    },
    "close": {
      value: closeWrapper,
      enumerable: true,
    },
    "halfclose": {
      value: halfcloseWrapper,
      enumerable: true,
    },
    "remoteAddress": {
      value: remoteAddress,
      enumerable: true,
    },
    "remotePort": {
      value: remotePort,
      enumerable: true,
    },
    "localAddress": {
      value: options.localAddress,
      enumerable: true,
    },
    "localPort": {
      value: options.localPort,
      enumerable: true,
    },
    "noDelay": {
      value: options.noDelay,
      enumerable: true,
    },
    "addressReuse": {
      value: options.addressReuse,
      enumerable: true,
    },
    "bufferedAmount": {
      value: 0,
      enumerable: true,
    },
    "readyState": {
      get: function() { return this._readyStateObserver.readyState; },
      enumerable: true,
    },
  });

  var watcher = this._readyStateObserver;
  this._readyStateObserverDeleter.destructor = function() {
    watcher.destructor();
  };

  // This is needed, otherwise events like "error" can get fired before
  // we give the user a chance to register a listener.
  function delayedInitialization(obj) {
    obj._postMessage("init", [remoteAddress, remotePort, options]);
  };

  this._registerLifecycleTracker();
  setTimeout(delayedInitialization, 0, this);
};

TCPSocket.prototype = new common.EventTargetPrototype();
TCPSocket.prototype.constructor = TCPSocket;

// TCPServerSocket interface.
//
// TODO(tmpsantos): We are currently not throwing any exceptions
// neither validating the input parameters.
//
var TCPServerSocket = function(options) {
  common.BindingObject.call(this, common.getUniqueId());
  common.EventTarget.call(this);

  internal.postMessage("TCPServerSocketConstructor", [this._id]);

  options = options || {};

  if (!options.localAddress)
    options.localAddress = "0.0.0.0";
  if (!options.localPort)
    options.localPort = 1234;
  if (!options.addressReuse)
    options.addressReuse = true;
  if (!options.useSecureTransport)
    options.useSecureTransport = false;

  this._addMethod("_close");
  this._addMethod("suspend");
  this._addMethod("resume");

  // FIXME(tmpsantos): Get the real remote IP and port
  // from the native backend.
  function ConnectEvent(type, data) {
    var object_id = data[0];
    var options = data[1];

    this.type = type;
    this.connectedSocket = new TCPSocket(
        options.localAddress, options.localPort, {}, object_id);
  }

  this._addEvent("open");
  this._addEvent("connect", ConnectEvent);
  this._addEvent("error");
  this._addEvent("connecterror");

  function closeWrapper(data) {
    if (this._readyStateObserver.readyState = "closed")
      return;

    this._readyStateObserver.readyState = "closing";
    this._close();
  };

  Object.defineProperties(this, {
    "_readyStateObserver": {
      value: new ReadyStateObserver(this._id, "opening"),
    },
    "_readyStateObserverDeleter": {
      value: v8tools.lifecycleTracker(),
    },
    "close": {
      value: closeWrapper,
      enumerable: true,
    },
    "localAddress": {
      value: options.localAddress,
      enumerable: true,
    },
    "localPort": {
      value: options.localPort,
      enumerable: true,
    },
    "addressReuse": {
      value: options.addressReuse,
      enumerable: true,
    },
    "readyState": {
      get: function() { return this._readyStateObserver.readyState; },
      enumerable: true,
    },
  });

  var watcher = this._readyStateObserver;
  this._readyStateObserverDeleter.destructor = function() {
    watcher.destructor();
  };

  function delayedInitialization(obj) {
    obj._postMessage("init", [options]);
  };

  this._registerLifecycleTracker();
  setTimeout(delayedInitialization, 0, this);
};

TCPServerSocket.prototype = new common.EventTargetPrototype();
TCPServerSocket.prototype.constructor = TCPServerSocket;

// UDPSocket interface.
//
// TODO(tmpsantos): We are currently not throwing any exceptions
// neither validating the input parameters.
//
var UDPSocket = function(options) {
  common.BindingObject.call(this, common.getUniqueId());
  common.EventTarget.call(this);

  internal.postMessage("UDPSocketConstructor", [this._id]);

  var options = options || {};

  if (!options.localAddress)
    options.localAddress = "";
  if (!options.localPort)
    options.localPort = 0;
  if (!options.remoteAddress)
    options.remoteAddress = "";
  if (!options.remotePort)
    options.remotePort = 0;
  if (!options.addressReuse)
    options.addressReuse = true;
  if (!options.loopback)
    options.loopback = false;

  this._addMethod("_close");
  this._addMethod("suspend");
  this._addMethod("resume");
  this._addMethod("joinMulticast");
  this._addMethod("leaveMulticast");
  this._addMethod("_sendString");

  function MessageEvent(type, data) {
    this.type = type;
    this.data = data.data;
    this.remotePort = data.remotePort;
    this.remoteAddress = data.remoteAddress;
  }

  this._addEvent("open");
  this._addEvent("drain");
  this._addEvent("error");
  this._addEvent("message", MessageEvent);

  function sendWrapper(data, remoteAddress, remotePort) {
    this._sendString(data, remoteAddress, remotePort);

    // FIXME(tmpsantos): The spec says that send() should always
    // return if you can keep sending data. This can only be
    // verified in the native implementation, which makes this
    // call sync. We are returning always true here to keep the
    // implementation async.
    return true;
  };

  function closeWrapper(data) {
    if (this._readyStateObserver.readyState == "closed")
      return;

    this._readyStateObserver.readyState = "closing";
    this._close();
  };

  Object.defineProperties(this, {
    "_readyStateObserver": {
      value: new ReadyStateObserver(this._id, "opening"),
    },
    "_readyStateObserverDeleter": {
      value: v8tools.lifecycleTracker(),
    },
    "send": {
      value: sendWrapper,
      enumerable: true,
    },
    "close": {
      value: closeWrapper,
      enumerable: true,
    },
    "remoteAddress": {
      value: options.remoteAddress,
      enumerable: true,
    },
    "remotePort": {
      value: options.remotePort,
      enumerable: true,
    },
    "localAddress": {
      value: options.localAddress,
      enumerable: true,
    },
    "localPort": {
      value: options.localPort,
      enumerable: true,
    },
    "addressReuse": {
      value: options.addressReuse,
      enumerable: true,
    },
    "loopback": {
      value: options.loopback,
      enumerable: true,
    },
    "bufferedAmount": {
      value: 0,
      enumerable: true,
    },
    "readyState": {
      get: function() { return this._readyStateObserver.readyState; },
      enumerable: true,
    },
  });

  var watcher = this._readyStateObserver;
  this._readyStateObserverDeleter.destructor = function() {
    watcher.destructor();
  };

  // This is needed, otherwise events like "error" can get fired before
  // we give the user a chance to register a listener.
  function delayedInitialization(obj) {
    obj._postMessage("init", [options]);
  };

  this._registerLifecycleTracker();
  setTimeout(delayedInitialization, 0, this);
};

UDPSocket.prototype = new common.EventTargetPrototype();
UDPSocket.prototype.constructor = UDPSocket;

// Exported API.
exports.TCPSocket = TCPSocket;
exports.TCPServerSocket = TCPServerSocket;
exports.UDPSocket = UDPSocket;
