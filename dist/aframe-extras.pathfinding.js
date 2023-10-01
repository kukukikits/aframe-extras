(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require('./src/pathfinding');

},{"./src/pathfinding":3}],2:[function(require,module,exports){
var e=require("three");function t(e,r){return t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},t(e,r)}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function n(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var o=0;return function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=/*#__PURE__*/function(){function t(){}return t.roundNumber=function(e,t){var r=Math.pow(10,t);return Math.round(e*r)/r},t.sample=function(e){return e[Math.floor(Math.random()*e.length)]},t.distanceToSquared=function(e,t){var r=e.x-t.x,n=e.y-t.y,o=e.z-t.z;return r*r+n*n+o*o},t.isPointInPoly=function(e,t){for(var r=!1,n=-1,o=e.length,i=o-1;++n<o;i=n)(e[n].z<=t.z&&t.z<e[i].z||e[i].z<=t.z&&t.z<e[n].z)&&t.x<(e[i].x-e[n].x)*(t.z-e[n].z)/(e[i].z-e[n].z)+e[n].x&&(r=!r);return r},t.isVectorInPolygon=function(e,t,r){var n=1e5,o=-1e5,i=[];return t.vertexIds.forEach(function(e){n=Math.min(r[e].y,n),o=Math.max(r[e].y,o),i.push(r[e])}),!!(e.y<o+.5&&e.y>n-.5&&this.isPointInPoly(i,e))},t.triarea2=function(e,t,r){return(r.x-e.x)*(t.z-e.z)-(t.x-e.x)*(r.z-e.z)},t.vequal=function(e,t){return this.distanceToSquared(e,t)<1e-5},t.mergeVertices=function(t,r){void 0===r&&(r=1e-4),r=Math.max(r,Number.EPSILON);for(var n={},o=t.getIndex(),i=t.getAttribute("position"),s=o?o.count:i.count,a=0,u=[],h=[],c=Math.log10(1/r),l=Math.pow(10,c),f=0;f<s;f++){var p=o?o.getX(f):f,d="";d+=~~(i.getX(p)*l)+",",d+=~~(i.getY(p)*l)+",",(d+=~~(i.getZ(p)*l)+",")in n?u.push(n[d]):(h.push(i.getX(p)),h.push(i.getY(p)),h.push(i.getZ(p)),n[d]=a,u.push(a),a++)}var v=new e.BufferAttribute(new Float32Array(h),i.itemSize,i.normalized),g=new e.BufferGeometry;return g.setAttribute("position",v),g.setIndex(u),g},t}(),s=/*#__PURE__*/function(){function e(e){this.content=[],this.scoreFunction=e}var t=e.prototype;return t.push=function(e){this.content.push(e),this.sinkDown(this.content.length-1)},t.pop=function(){var e=this.content[0],t=this.content.pop();return this.content.length>0&&(this.content[0]=t,this.bubbleUp(0)),e},t.remove=function(e){var t=this.content.indexOf(e),r=this.content.pop();t!==this.content.length-1&&(this.content[t]=r,this.scoreFunction(r)<this.scoreFunction(e)?this.sinkDown(t):this.bubbleUp(t))},t.size=function(){return this.content.length},t.rescoreElement=function(e){this.sinkDown(this.content.indexOf(e))},t.sinkDown=function(e){for(var t=this.content[e];e>0;){var r=(e+1>>1)-1,n=this.content[r];if(!(this.scoreFunction(t)<this.scoreFunction(n)))break;this.content[r]=t,this.content[e]=n,e=r}},t.bubbleUp=function(e){for(var t=this.content.length,r=this.content[e],n=this.scoreFunction(r);;){var o=e+1<<1,i=o-1,s=null,a=void 0;if(i<t&&(a=this.scoreFunction(this.content[i]))<n&&(s=i),o<t&&this.scoreFunction(this.content[o])<(null===s?n:a)&&(s=o),null===s)break;this.content[e]=this.content[s],this.content[s]=r,e=s}},e}(),a=/*#__PURE__*/function(){function e(){}return e.init=function(e){for(var t=0;t<e.length;t++){var r=e[t];r.f=0,r.g=0,r.h=0,r.cost=1,r.visited=!1,r.closed=!1,r.parent=null}},e.cleanUp=function(e){for(var t=0;t<e.length;t++){var r=e[t];delete r.f,delete r.g,delete r.h,delete r.cost,delete r.visited,delete r.closed,delete r.parent}},e.heap=function(){return new s(function(e){return e.f})},e.search=function(e,t,r){this.init(e);var n=this.heap();for(n.push(t);n.size()>0;){var o=n.pop();if(o===r){for(var i=o,s=[];i.parent;)s.push(i),i=i.parent;return this.cleanUp(s),s.reverse()}o.closed=!0;for(var a=this.neighbours(e,o),u=0,h=a.length;u<h;u++){var c=a[u];if(!c.closed){var l=o.g+c.cost,f=c.visited;if(!f||l<c.g){if(c.visited=!0,c.parent=o,!c.centroid||!r.centroid)throw new Error("Unexpected state");c.h=c.h||this.heuristic(c.centroid,r.centroid),c.g=l,c.f=c.g+c.h,f?n.rescoreElement(c):n.push(c)}}}}return[]},e.heuristic=function(e,t){return i.distanceToSquared(e,t)},e.neighbours=function(e,t){for(var r=[],n=0;n<t.neighbours.length;n++)r.push(e[t.neighbours[n]]);return r},e}(),u=/*#__PURE__*/function(){function t(){}return t.buildZone=function(t,r){var n=this,o=this._buildNavigationMesh(t,r),s={};o.vertices.forEach(function(e){e.x=i.roundNumber(e.x,2),e.y=i.roundNumber(e.y,2),e.z=i.roundNumber(e.z,2)}),s.vertices=o.vertices;var a=this._buildPolygonGroups(o);return s.groups=new Array(a.length),a.forEach(function(t,r){var o=new Map;t.forEach(function(e,t){o.set(e,t)});var a=new Array(t.length);t.forEach(function(t,r){var u=[];t.neighbours.forEach(function(e){return u.push(o.get(e))});var h=[];t.neighbours.forEach(function(e){return h.push(n._getSharedVerticesInOrder(t,e))});var c=new e.Vector3(0,0,0);c.add(s.vertices[t.vertexIds[0]]),c.add(s.vertices[t.vertexIds[1]]),c.add(s.vertices[t.vertexIds[2]]),c.divideScalar(3),c.x=i.roundNumber(c.x,2),c.y=i.roundNumber(c.y,2),c.z=i.roundNumber(c.z,2),a[r]={id:r,neighbours:u,vertexIds:t.vertexIds,centroid:c,portals:h}}),s.groups[r]=a}),s},t._buildNavigationMesh=function(e,t){return e=i.mergeVertices(e,t),this._buildPolygonsFromGeometry(e)},t._spreadGroupId=function(e){for(var t=new Set([e]);t.size>0;){var r=t;t=new Set,r.forEach(function(r){r.group=e.group,r.neighbours.forEach(function(e){void 0===e.group&&t.add(e)})})}},t._buildPolygonGroups=function(e){var t=this,r=[];return e.polygons.forEach(function(e){void 0!==e.group?r[e.group].push(e):(e.group=r.length,t._spreadGroupId(e),r.push([e]))}),r},t._buildPolygonNeighbours=function(e,t){var r=new Set,n=t[e.vertexIds[1]],o=t[e.vertexIds[2]];return t[e.vertexIds[0]].forEach(function(t){t!==e&&(n.includes(t)||o.includes(t))&&r.add(t)}),n.forEach(function(t){t!==e&&o.includes(t)&&r.add(t)}),r},t._buildPolygonsFromGeometry=function(t){for(var r=this,n=[],o=[],i=t.attributes.position,s=t.index,a=[],u=0;u<i.count;u++)o.push((new e.Vector3).fromBufferAttribute(i,u)),a[u]=[];for(var h=0;h<t.index.count;h+=3){var c=s.getX(h),l=s.getX(h+1),f=s.getX(h+2),p={vertexIds:[c,l,f],neighbours:null};n.push(p),a[c].push(p),a[l].push(p),a[f].push(p)}return n.forEach(function(e){e.neighbours=r._buildPolygonNeighbours(e,a)}),{polygons:n,vertices:o}},t._getSharedVerticesInOrder=function(e,t){var r=e.vertexIds,n=r[0],o=r[1],i=r[2],s=t.vertexIds,a=s.includes(n),u=s.includes(o),h=s.includes(i);return a&&u&&h?Array.from(r):a&&u?[n,o]:u&&h?[o,i]:a&&h?[i,n]:(console.warn("Error processing navigation mesh neighbors; neighbors with <2 shared vertices found."),[])},t}(),h=/*#__PURE__*/function(){function e(){this.portals=[]}var t=e.prototype;return t.push=function(e,t){void 0===t&&(t=e),this.portals.push({left:e,right:t})},t.stringPull=function(){var e,t,r,n=this.portals,o=[],s=0,a=0,u=0;t=n[0].left,r=n[0].right,o.push(e=n[0].left);for(var h=1;h<n.length;h++){var c=n[h].left,l=n[h].right;if(i.triarea2(e,r,l)<=0){if(!(i.vequal(e,r)||i.triarea2(e,t,l)>0)){o.push(t),t=e=t,r=e,a=s=a,u=s,h=s;continue}r=l,u=h}if(i.triarea2(e,t,c)>=0){if(!(i.vequal(e,t)||i.triarea2(e,r,c)<0)){o.push(r),t=e=r,r=e,a=s=u,u=s,h=s;continue}t=c,a=h}}return 0!==o.length&&i.vequal(o[o.length-1],n[n.length-1].left)||o.push(n[n.length-1].left),this.path=o,o},e}(),c=/*#__PURE__*/function(){function t(){this.zones={}}t.createZone=function(e,t){return void 0===t&&(t=1e-4),u.buildZone(e,t)};var r=t.prototype;return r.setZoneData=function(e,t){this.zones[e]=t},r.getRandomNode=function(t,r,n,o){if(!this.zones[t])return new e.Vector3;n=n||null,o=o||0;var s=[];return this.zones[t].groups[r].forEach(function(e){n&&o?i.distanceToSquared(n,e.centroid)<o*o&&s.push(e.centroid):s.push(e.centroid)}),i.sample(s)||new e.Vector3},r.getClosestNode=function(e,t,r,n){void 0===n&&(n=!1);var o=this.zones[t].vertices,s=null,a=Infinity;return this.zones[t].groups[r].forEach(function(t){var r=i.distanceToSquared(t.centroid,e);r<a&&(!n||i.isVectorInPolygon(e,t,o))&&(s=t,a=r)}),s},r.findPath=function(t,r,n,o){var i=this.zones[n].groups[o],s=this.zones[n].vertices,u=this.getClosestNode(t,n,o,!1),c=this.getClosestNode(r,n,o,!0);if(!u||!c)return null;var l=a.search(i,u,c),f=function(e,t){for(var r=0;r<e.neighbours.length;r++)if(e.neighbours[r]===t.id)return e.portals[r]},p=new h;p.push(t);for(var d=0;d<l.length;d++){var v=l[d+1];if(v){var g=f(l[d],v);p.push(s[g[0]],s[g[1]])}}p.push(r),p.stringPull();var y=p.path.map(function(t){return new e.Vector3(t.x,t.y,t.z)});return y.shift(),y},t}();c.prototype.getGroup=(o=new e.Plane,function(e,t,r){if(void 0===r&&(r=!1),!this.zones[e])return null;for(var s=null,a=Math.pow(50,2),u=this.zones[e],h=0;h<u.groups.length;h++)for(var c,l=n(u.groups[h]);!(c=l()).done;){var f=c.value;if(r&&(o.setFromCoplanarPoints(u.vertices[f.vertexIds[0]],u.vertices[f.vertexIds[1]],u.vertices[f.vertexIds[2]]),Math.abs(o.distanceToPoint(t))<.01&&i.isPointInPoly([u.vertices[f.vertexIds[0]],u.vertices[f.vertexIds[1]],u.vertices[f.vertexIds[2]]],t)))return h;var p=i.distanceToSquared(f.centroid,t);p<a&&(s=h,a=p)}return s}),c.prototype.clampStep=function(){var t,r,n=new e.Vector3,o=new e.Plane,i=new e.Triangle,s=new e.Vector3,a=new e.Vector3;return function(e,u,h,c,l,f){var p=this.zones[c].vertices,d=this.zones[c].groups[l],v=[h],g={};g[h.id]=0,t=void 0,a.set(0,0,0),r=Infinity,o.setFromCoplanarPoints(p[h.vertexIds[0]],p[h.vertexIds[1]],p[h.vertexIds[2]]),o.projectPoint(u,n),s.copy(n);for(var y=v.pop();y;y=v.pop()){i.set(p[y.vertexIds[0]],p[y.vertexIds[1]],p[y.vertexIds[2]]),i.closestPointToPoint(s,n),n.distanceToSquared(s)<r&&(t=y,a.copy(n),r=n.distanceToSquared(s));var b=g[y.id];if(!(b>2))for(var m=0;m<y.neighbours.length;m++){var M=d[y.neighbours[m]];M.id in g||(v.push(M),g[M.id]=b+1)}}return f.copy(a),t}}();var l={PLAYER:new e.Color(15631215).convertGammaToLinear(2.2).getHex(),TARGET:new e.Color(14469912).convertGammaToLinear(2.2).getHex(),PATH:new e.Color(41903).convertGammaToLinear(2.2).getHex(),WAYPOINT:new e.Color(41903).convertGammaToLinear(2.2).getHex(),CLAMPED_STEP:new e.Color(14472114).convertGammaToLinear(2.2).getHex(),CLOSEST_NODE:new e.Color(4417387).convertGammaToLinear(2.2).getHex()},f=/*#__PURE__*/function(r){var n,o;function i(){var t;return(t=r.call(this)||this)._playerMarker=new e.Mesh(new e.SphereBufferGeometry(.25,32,32),new e.MeshBasicMaterial({color:l.PLAYER})),t._targetMarker=new e.Mesh(new e.BoxBufferGeometry(.3,.3,.3),new e.MeshBasicMaterial({color:l.TARGET})),t._nodeMarker=new e.Mesh(new e.BoxBufferGeometry(.1,.8,.1),new e.MeshBasicMaterial({color:l.CLOSEST_NODE})),t._stepMarker=new e.Mesh(new e.BoxBufferGeometry(.1,1,.1),new e.MeshBasicMaterial({color:l.CLAMPED_STEP})),t._pathMarker=new e.Object3D,t._pathLineMaterial=new e.LineBasicMaterial({color:l.PATH,linewidth:2}),t._pathPointMaterial=new e.MeshBasicMaterial({color:l.WAYPOINT}),t._pathPointGeometry=new e.SphereBufferGeometry(.08),t._markers=[t._playerMarker,t._targetMarker,t._nodeMarker,t._stepMarker,t._pathMarker],t._markers.forEach(function(e){e.visible=!1,t.add(e)}),t}o=r,(n=i).prototype=Object.create(o.prototype),n.prototype.constructor=n,t(n,o);var s=i.prototype;return s.setPath=function(t){for(;this._pathMarker.children.length;)this._pathMarker.children[0].visible=!1,this._pathMarker.remove(this._pathMarker.children[0]);t=[this._playerMarker.position].concat(t);var r=new e.BufferGeometry;r.setAttribute("position",new e.BufferAttribute(new Float32Array(3*t.length),3));for(var n=0;n<t.length;n++)r.attributes.position.setXYZ(n,t[n].x,t[n].y+.2,t[n].z);this._pathMarker.add(new e.Line(r,this._pathLineMaterial));for(var o=0;o<t.length-1;o++){var i=new e.Mesh(this._pathPointGeometry,this._pathPointMaterial);i.position.copy(t[o]),i.position.y+=.2,this._pathMarker.add(i)}return this._pathMarker.visible=!0,this},s.setPlayerPosition=function(e){return this._playerMarker.position.copy(e),this._playerMarker.visible=!0,this},s.setTargetPosition=function(e){return this._targetMarker.position.copy(e),this._targetMarker.visible=!0,this},s.setNodePosition=function(e){return this._nodeMarker.position.copy(e),this._nodeMarker.visible=!0,this},s.setStepPosition=function(e){return this._stepMarker.position.copy(e),this._stepMarker.visible=!0,this},s.reset=function(){for(;this._pathMarker.children.length;)this._pathMarker.children[0].visible=!1,this._pathMarker.remove(this._pathMarker.children[0]);return this._markers.forEach(function(e){e.visible=!1}),this},i}(e.Object3D);exports.Pathfinding=c,exports.PathfindingHelper=f;


},{"three":"three"}],3:[function(require,module,exports){
'use strict';

require('./nav-mesh');
require('./nav-terrian');
require('./nav-agent');
require('./system');

},{"./nav-agent":4,"./nav-mesh":5,"./nav-terrian":6,"./system":7}],4:[function(require,module,exports){
"use strict";

var PI_2 = Math.PI / 2;
module.exports = AFRAME.registerComponent("nav-agent", {
  schema: {
    destination: { type: "vec3" },
    active: { default: false },
    speed: { default: 2 },
    gazeTarget: { type: "selector" }, // gaze at target when navigating
    mode: { default: "animate", oneOf: ["teleport", "animate"] }, // 移动模式
    viewSync: { default: true, type: 'boolean' // 是否同步相机视角
    } },
  init: function init() {
    var _this = this;

    this.system = this.el.sceneEl.systems.nav;
    this.system.addAgent(this);
    this.group = null;
    this.path = [];
    this.raycaster = new THREE.Raycaster();
    this.camera = null;
    this.lookControls = null;
    this.el.object3D.traverse(function (node) {
      if (node instanceof THREE.Camera) {
        _this.camera = node;
        _this.lookControls = node.el.components["look-controls"];
      }
    });
  },
  remove: function remove() {
    this.system.removeAgent(this);
  },
  update: function update() {
    this.path.length = 0;
    this.clearState();
  },
  updateNavLocation: function updateNavLocation() {
    this.group = null;
    this.path = [];
  },
  // check if look-control's magicWindowControls is enabled
  isMWControlsEnabled: function isMWControlsEnabled() {
    var lookCtls = this.lookControls;
    if (lookCtls && lookCtls.magicWindowControls && lookCtls.magicWindowControls.enabled) {
      return true;
    }
    return false;
  },
  _getGazeTarget: function _getGazeTarget(vTarget, rotateTarget, waypoint) {
    // vTarget为lookAt的对象，高度y和rotateTarget的高度一致, 防止视角旋转过程中出现视角倒转的问题
    // TODO: 解决在vTarget高度保持和gazeTarget一致时，视角切换可能出现的视角倒转问题，可在编辑器中复现（多次切换文字、图片等）
    rotateTarget.getWorldPosition(vTarget);
    if (this.data.gazeTarget && this.data.gazeTarget.object3D) {
      var point = this.data.gazeTarget.object3D.position;
      vTarget.setX(point.x);
      vTarget.setZ(point.z);
      // vTarget.copy(point);
    } else {
      vTarget.setX(waypoint.x);
      vTarget.setZ(waypoint.z);
    }
  },
  _getVQuaternion: function _getVQuaternion(vQuaternion, vOriQuaternion, rotateTarget, vTarget, waypoint) {
    // 将未转动前的姿态保存到vOriQuaternion中
    vOriQuaternion.copy(rotateTarget.quaternion);
    // 先设置lookAt，即转动rotateTarget
    this._getGazeTarget(vTarget, rotateTarget, waypoint);
    rotateTarget.lookAt(vTarget);
    // 获取lookAt后，rotateTarget的姿态数据vQuaternion
    vQuaternion.copy(rotateTarget.quaternion);
    // 重置，将rotateTarget的姿态重置到未转动前的姿态
    rotateTarget.setRotationFromQuaternion(vOriQuaternion);
  },
  _updateRotation: function _updateRotation(vPreEulerRot, vEulerRot, vOriQuaternion, vQuaternion, rotateTarget) {
    var slerp = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.1;

    if (this.lookControls) {
      if (this.lookControls.touchStarted && this.lookControls.data.touchEnabled || this.lookControls.mouseDown) {
        // 如果在运动过程中用户拖动视角，则不再处理转动
      } else {
        // 如果需要转动的对象是启用了lookControls的camera, 不能直接旋转Three.js camera对象，
        // 必须增量地设置lookControls.yawObject.rotation.y和lookControls.pitchObject.rotation.x
        // 这样就可以和lookControl保持兼容
        if (slerp) {
          vPreEulerRot.setFromQuaternion(vOriQuaternion, "YXZ");
          vOriQuaternion.slerp(vQuaternion, slerp);
          vEulerRot.setFromQuaternion(vOriQuaternion, "YXZ");
          // 将magicWindowControl的转动参数置空，否则会影响rotationDone条件的形成
          var mwc = this.lookControls.magicWindowDeltaEuler;
          mwc.x = 0;
          mwc.y = 0;
          mwc.z = 0;
          var pitchObject = this.lookControls.pitchObject;
          pitchObject.rotation.x += vEulerRot.x - vPreEulerRot.x;
          pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
          this.lookControls.yawObject.rotation.y += vEulerRot.y - vPreEulerRot.y;
        }
      }
    } else {
      // 最后使用四元数差值进行旋转
      rotateTarget.quaternion.slerp(vQuaternion, slerp);
    }
  },
  tick: function () {
    var vDest = new THREE.Vector3();
    var vDelta = new THREE.Vector3();
    var vNext = new THREE.Vector3();
    var vQuaternion = new THREE.Quaternion();
    var vOriQuaternion = new THREE.Quaternion();
    var vTarget = new THREE.Vector3();
    var vEulerRot = new THREE.Euler();
    var vPreEulerRot = new THREE.Euler();
    return function (t, dt) {
      var el = this.el;
      var data = this.data;
      var raycaster = this.raycaster;
      if (!data.active) return;

      var speed = data.speed * dt / 1000;
      // Smoothly rotate when navigating around corners.
      // 如果子节点中存在lookControls，那么将旋转的对象设置为lookControls
      var rotateTarget = this.lookControls ? this.camera : el.object3D;
      var vCurrent = this.getNavStart(el.object3D);
      // Use PatrolJS pathfinding system to get shortest path to target.
      if (!this.path.length) {
        // const position = this.el.object3D.position;
        var position = vCurrent;
        vDest.copy(data.destination);
        this.group = this.group || this.system.getGroup(position);

        // ------------ fix me-----------------
        // 当起始点和目的点在同一个navMesh的面中时，this.system.getPath可能不会返回两点间的直线路径，可能返回一个拐弯的路径
        // 因此加入下面的判断逻辑（TODO：深入了解pathfinding算法后，再确认这种验证逻辑是否正确，就目前来看，起到了一定的优化作用）
        var closestNode = this.system.getNode(position, this.group);
        var farthestNode = this.system.getNode(vDest, this.group);
        // 起始点和目的点都在同一个node中，则直接返回两点间的直线路径
        if (closestNode && farthestNode && farthestNode.id === closestNode.id) {
          this.path = [vDest.clone()];
        }
        // ------------- End ------------------
        else {
            this.path = this.system.getPath(position, vDest, this.group) || [];
          }

        el.emit("navigation-start");
      }

      // If no path is found, exit.
      if (!this.path.length) {
        console.warn("[nav] Unable to find path to %o.", data.destination);
        this.el.setAttribute("nav-agent", { active: false });
        el.emit("navigation-end");
        return;
      }

      // Current segment is a vector from current position to next waypoint.
      // const vCurrent = el.object3D.position;
      //   const vCurrent = this.getNavStart(el.object3D);
      var vWaypoint = this.path[0];
      vDelta.subVectors(vWaypoint, vCurrent);

      // 如果是传送模式，直接设置终点位置和视角
      if (this.data.mode === "teleport") {
        var targetPoint = this.path[this.path.length - 1];
        vCurrent.copy(targetPoint);
        this.terrianMove(el.object3D, dt);
        // 获取总共需要旋转多少的姿态数据到vQuaternion
        // 如果指定了gazeTarget，再旋转
        if (this.data.viewSync && !this.isMWControlsEnabled() && this.data.gazeTarget && this.data.gazeTarget.object3D) {
          this._getVQuaternion(vQuaternion, vOriQuaternion, rotateTarget, vTarget, null);
          this._updateRotation(vPreEulerRot, vEulerRot, vOriQuaternion, vQuaternion, rotateTarget, 1);
        }

        this.el.setAttribute("nav-agent", {
          active: false,
          gazeTarget: null
        }); // deactive and clear gazeTarget
        el.emit("navigation-end");
        return;
      }

      // animate mode
      var distance = vDelta.length();
      var gazeTarget = void 0;

      if (distance < speed) {
        // If <1 step from current waypoint, discard it and move toward next.
        var moved = this.path.shift();
        var mwcEnabled = this.isMWControlsEnabled();
        var rotationGap = mwcEnabled ? 0 : THREE.MathUtils.radToDeg(rotateTarget.quaternion.angleTo(vQuaternion));
        if (!this.data.viewSync) {
          rotationGap = 0;
        }
        var rotationDone = Math.abs(rotationGap) < 0.2; // default slerp interpolation factor is 0.1
        // After discarding the last waypoint, exit pathfinding.
        if (!this.path.length && rotationDone) {
          // 获取总共需要旋转多少的姿态数据到vQuaternion
          if (!mwcEnabled && this.data.viewSync) {
            this._getVQuaternion(vQuaternion, vOriQuaternion, rotateTarget, vTarget, moved);
            this._updateRotation(vPreEulerRot, vEulerRot, vOriQuaternion, vQuaternion, rotateTarget, 1);
          }
          this.el.setAttribute("nav-agent", {
            active: false,
            gazeTarget: null
          }); // deactive and clear gazeTarget
          el.emit("navigation-end");
          return;
        } else if (!this.path.length && !mwcEnabled && !rotationDone) {
          // if arrived target position but rotation is not reached the target
          // continue move
          this.path.push(moved);
        }

        vNext.copy(vCurrent);
        gazeTarget = this.path[0];
      } else {
        // If still far away from next waypoint, find next position for
        // the current frame.
        vNext.copy(vDelta.setLength(speed)).add(vCurrent);
        gazeTarget = vWaypoint;
      }

      // 获取总共需要旋转多少的姿态数据到vQuaternion
      if (!this.isMWControlsEnabled() && this.data.viewSync) {
        this._getVQuaternion(vQuaternion, vOriQuaternion, rotateTarget, vTarget, gazeTarget);
        this._updateRotation(vPreEulerRot, vEulerRot, vOriQuaternion, vQuaternion, rotateTarget);
      }

      vCurrent.copy(vNext);
      this.terrianMove(el.object3D, dt);

      // 不使用下面的这个，会导致视角闪烁
      // Raycast against the nav mesh, to keep the agent moving along the
      // ground, not traveling in a straight line from higher to lower waypoints.
      // raycaster.ray.origin.copy(vNext);
      // raycaster.ray.origin.y += 1.5;
      // raycaster.ray.direction = {x:0, y:-1, z:0};
      // const intersections = raycaster.intersectObject(this.system.getNavMesh());

      // if (!intersections.length) {
      //   // Raycasting failed. Step toward the waypoint and hope for the best.
      //   vCurrent.copy(vNext);
      // } else {
      //   // Re-project next position onto nav mesh.
      //   vDelta.subVectors(intersections[0].point, vCurrent);
      //   vCurrent.add(vDelta.setLength(speed));
      // }
    };
  }(),
  getNavStart: function getNavStart(obj3D) {
    if (!obj3D._navPoint) {
      obj3D._navPoint = this.system.getNavStart(obj3D.position);
      if (!obj3D._navPoint) {
        obj3D._navPoint = new THREE.Vector3();
        obj3D._navPoint.copy(obj3D.position);
      } else {
        obj3D._navPoint = obj3D._navPoint.point;
      }
    }
    return obj3D._navPoint;
  },
  clearState: function clearState() {
    delete this.el.object3D._navPoint;
    this.updateNavLocation();
  },
  terrianMove: function () {
    var wPos = new THREE.Vector3();
    var deltaV = new THREE.Vector3();
    var deltaProject = new THREE.Vector3();
    var yNormal = new THREE.Vector3(0, 1, 0);
    return function (obj3D, dt) {
      obj3D.getWorldPosition(wPos);
      obj3D.position.copy(obj3D._navPoint);
      var interset = this.system.getTerrianIntersect(obj3D._navPoint);
      if (!interset) {
        return;
      }

      // 检测上下坡
      if (!interset.point.equals(wPos)) {
        deltaV.subVectors(interset.point, wPos);
        deltaProject.copy(deltaV);
        deltaProject.projectOnPlane(yNormal);
        var angle = deltaProject.lengthSq() == 0 ? Infinity : deltaProject.angleTo(deltaV);
        if (angle > Math.PI / 4 && Math.abs(interset.point.y - wPos.y) > 0.001) {
          if (interset.point.y > wPos.y) {
            this.el.emit('nav-agent-move', { move: 'up' });
          } else {
            this.el.emit('nav-agent-move', { move: 'down' });
          }
        }
      }
      obj3D.position.y = interset.point.y;
      // obj3D.position.copy(interset.point);
    };
  }()
});

},{}],5:[function(require,module,exports){
"use strict";

/**
 * nav-mesh
 *
 * Waits for a mesh to be loaded on the current entity, then sets it as the
 * nav mesh in the pathfinding system.
 */

module.exports = AFRAME.registerComponent("nav-mesh", {
  schema: {
    nodeName: { type: "string" }
  },

  init: function init() {
    this.system = this.el.sceneEl.systems.nav;
    this.hasLoadedNavMesh = false;
    this.nodeName = this.data.nodeName;
    this.el.addEventListener("object3dset", this.loadNavMesh.bind(this));
  },

  play: function play() {
    if (!this.hasLoadedNavMesh) this.loadNavMesh();
  },

  loadNavMesh: function loadNavMesh() {
    var self = this;
    var object = this.el.getObject3D("mesh");
    var scene = this.el.sceneEl.object3D;

    if (!object) return;

    var navMesh = void 0;
    object.traverse(function (node) {
      if (node.isMesh && (!self.nodeName || node.name === self.nodeName)) {
        navMesh = node;
      }
    });

    if (!navMesh) return;

    var navMeshGeometry = navMesh.geometry.clone();
    navMesh.updateWorldMatrix(true, false);
    navMeshGeometry.applyMatrix4(navMesh.matrixWorld);
    this.system.setNavMeshGeometry(navMeshGeometry);
    this.hasLoadedNavMesh = true;
  }
});

},{}],6:[function(require,module,exports){
"use strict";

/**
 * nav-mesh
 *
 * Waits for a mesh to be loaded on the current entity, then sets it as the
 * nav mesh in the pathfinding system.
 */

module.exports = AFRAME.registerComponent("nav-terrian", {
  schema: {
    terrianName: { type: "string" }
  },

  init: function init() {
    this.system = this.el.sceneEl.systems.nav;
    this.hasLoadedNavMesh = false;
    this.nodeName = this.data.nodeName;
    this.el.addEventListener("object3dset", this.loadNavMesh.bind(this));
  },

  play: function play() {
    if (!this.hasLoadedNavMesh) this.loadNavMesh();
  },

  loadNavMesh: function loadNavMesh() {
    var self = this;
    var object = this.el.getObject3D("mesh");
    var scene = this.el.sceneEl.object3D;

    if (!object) return;

    var terrianMesh = void 0;
    object.traverse(function (node) {
      if (node.isObject3D && node.name === self.data.terrianName) {
        terrianMesh = node;
      }
    });

    if (!terrianMesh) return;

    scene.updateMatrixWorld();
    this.system.setTerrianMesh(terrianMesh);
    this.hasLoadedNavMesh = true;
  }
});

},{}],7:[function(require,module,exports){
"use strict";

var _require = require("three-pathfinding"),
    Pathfinding = _require.Pathfinding;

var pathfinder = new Pathfinding();
var ZONE = "level";

/**
 * nav
 *
 * Pathfinding system, using PatrolJS.
 */
module.exports = AFRAME.registerSystem("nav", {
  init: function init() {
    this.navMesh = null;
    this.agents = new Set();
    this.terrianMesh = null;
  },

  /**
   * @param {THREE.Geometry} geometry
   */
  setNavMeshGeometry: function setNavMeshGeometry(geometry) {
    this.navMesh = new THREE.Mesh(geometry);
    pathfinder.setZoneData(ZONE, Pathfinding.createZone(geometry));
    Array.from(this.agents).forEach(function (agent) {
      return agent.updateNavLocation();
    });
  },

  /**
   * @return {THREE.Mesh}
   */
  getNavMesh: function getNavMesh() {
    return this.navMesh;
  },

  /**
   * @param {NavAgent} ctrl
   */
  addAgent: function addAgent(ctrl) {
    this.agents.add(ctrl);
  },

  /**
   * @param {NavAgent} ctrl
   */
  removeAgent: function removeAgent(ctrl) {
    this.agents.delete(ctrl);
  },

  /**
   * @param  {THREE.Vector3} start
   * @param  {THREE.Vector3} end
   * @param  {number} groupID
   * @return {Array<THREE.Vector3>}
   */
  getPath: function getPath(start, end, groupID) {
    return this.navMesh ? pathfinder.findPath(start, end, ZONE, groupID) : null;
  },

  /**
   * @param {THREE.Vector3} position
   * @return {number}
   */
  getGroup: function getGroup(position) {
    var checkPolygon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return this.navMesh ? pathfinder.getGroup(ZONE, position, checkPolygon) : null;
  },

  /**
   * @param  {THREE.Vector3} position
   * @param  {number} groupID
   * @return {Node}
   */
  getNode: function getNode(position, groupID) {
    var checkPolygon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return this.navMesh ? // disable geometry within check. Player would get stuck and overstep the boundary if set to true.
    pathfinder.getClosestNode(position, ZONE, groupID, checkPolygon) : null;
  },

  /**
   * @param  {THREE.Vector3} start Starting position.
   * @param  {THREE.Vector3} end Desired ending position.
   * @param  {number} groupID
   * @param  {Node} node
   * @param  {THREE.Vector3} endTarget (Output) Adjusted step end position.
   * @return {Node} Current node, after step is taken.
   */
  clampStep: function clampStep(start, end, groupID, node, endTarget) {
    if (!this.navMesh) {
      endTarget.copy(end);
      return null;
    } else if (!node) {
      endTarget.copy(end);
      return this.getNode(end, groupID);
    }
    return pathfinder.clampStep(start, end, node, ZONE, groupID, endTarget);
  },

  setTerrianMesh: function setTerrianMesh(terrianMesh) {
    this.terrianMesh = terrianMesh;
  },

  getTerrianMesh: function getTerrianMesh() {
    return this.terrianMesh;
  },

  getTerrianIntersect: function getTerrianIntersect(point) {
    return this.projectPoint(point, this.terrianMesh);
  },

  getNavStart: function getNavStart(point) {
    return this.projectPoint(point, this.navMesh);
  },

  // 把点point从上到下投影到terrian mesh上，并返回第一个交点信息
  projectPoint: function () {
    var origin = new THREE.Vector3();
    var direction = new THREE.Vector3(0, -1, 0);
    var raycaster = new THREE.Raycaster(origin, direction);
    var target = [];
    return function (point, terrian) {
      if (!terrian || !point) {
        return;
      }
      origin.copy(point);
      origin.y += 0.5;
      target.length = 0;
      var intersections = raycaster.intersectObject(terrian, true, target);
      if (intersections && intersections.length > 0) {
        var res = intersections[0];
        target.length = 0;
        return res;
      }
    };
  }()
});

},{"three-pathfinding":2}]},{},[1]);
