(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

require('./src/misc');

},{"./src/misc":5}],2:[function(require,module,exports){
'use strict';

module.exports = AFRAME.registerComponent('checkpoint', {
  schema: {
    offset: { default: { x: 0, y: 0, z: 0 }, type: 'vec3' }
  },

  init: function init() {
    this.active = false;
    this.targetEl = null;
    this.fire = this.fire.bind(this);
    this.offset = new THREE.Vector3();
  },

  update: function update() {
    this.offset.copy(this.data.offset);
  },

  play: function play() {
    this.el.addEventListener('click', this.fire);
  },
  pause: function pause() {
    this.el.removeEventListener('click', this.fire);
  },
  remove: function remove() {
    this.pause();
  },

  fire: function fire() {
    var targetEl = this.el.sceneEl.querySelector('[checkpoint-controls]');
    if (!targetEl) {
      throw new Error('No `checkpoint-controls` component found.');
    }
    targetEl.components['checkpoint-controls'].setCheckpoint(this.el);
  },

  getOffset: function getOffset() {
    return this.offset.copy(this.data.offset);
  }
});

},{}],3:[function(require,module,exports){
'use strict';

/**
 * @param  {Array<THREE.Material>|THREE.Material} material
 * @return {Array<THREE.Material>}
 */

function ensureMaterialArray(material) {
  if (!material) {
    return [];
  } else if (Array.isArray(material)) {
    return material;
  } else if (material.materials) {
    return material.materials;
  } else {
    return [material];
  }
}

/**
 * @param  {THREE.Object3D} mesh
 * @param  {Array<string>} materialNames
 * @param  {THREE.Texture} envMap
 * @param  {number} reflectivity  [description]
 */
function applyEnvMap(mesh, materialNames, envMap, reflectivity) {
  if (!mesh) return;

  materialNames = materialNames || [];

  mesh.traverse(function (node) {

    if (!node.isMesh) return;

    var meshMaterials = ensureMaterialArray(node.material);

    meshMaterials.forEach(function (material) {

      if (material && !('envMap' in material)) return;
      if (materialNames.length && materialNames.indexOf(material.name) === -1) return;

      material.envMap = envMap;
      material.reflectivity = reflectivity;
      material.needsUpdate = true;
    });
  });
}

/**
 * Specifies an envMap on an entity, without replacing any existing material
 * properties.
 */
module.exports = AFRAME.registerComponent('cube-env-map', {
  multiple: true,

  schema: {
    path: { default: '' },
    extension: { default: 'jpg', oneOf: ['jpg', 'png'] },
    enableBackground: { default: false },
    reflectivity: { default: 1, min: 0, max: 1 },
    materials: { default: [] }
  },

  init: function init() {
    var _this = this;

    var data = this.data;

    this.texture = new THREE.CubeTextureLoader().load([data.path + 'posx.' + data.extension, data.path + 'negx.' + data.extension, data.path + 'posy.' + data.extension, data.path + 'negy.' + data.extension, data.path + 'posz.' + data.extension, data.path + 'negz.' + data.extension]);
    this.texture.format = THREE.RGBAFormat;

    this.object3dsetHandler = function () {
      var mesh = _this.el.getObject3D('mesh');
      var data = _this.data;
      applyEnvMap(mesh, data.materials, _this.texture, data.reflectivity);
    };

    this.object3dsetHandler();
    this.el.addEventListener('object3dset', this.object3dsetHandler);
  },

  update: function update(oldData) {
    var data = this.data;
    var mesh = this.el.getObject3D('mesh');

    var addedMaterialNames = [];
    var removedMaterialNames = [];

    if (data.materials.length) {
      if (oldData.materials) {
        addedMaterialNames = data.materials.filter(function (name) {
          return !oldData.materials.includes(name);
        });
        removedMaterialNames = oldData.materials.filter(function (name) {
          return !data.materials.includes(name);
        });
      } else {
        addedMaterialNames = data.materials;
      }
    }
    if (addedMaterialNames.length) {
      applyEnvMap(mesh, addedMaterialNames, this.texture, data.reflectivity);
    }
    if (removedMaterialNames.length) {
      applyEnvMap(mesh, removedMaterialNames, null, 1);
    }

    if (oldData.materials && data.reflectivity !== oldData.reflectivity) {
      var maintainedMaterialNames = data.materials.filter(function (name) {
        return oldData.materials.includes(name);
      });
      if (maintainedMaterialNames.length) {
        applyEnvMap(mesh, maintainedMaterialNames, this.texture, data.reflectivity);
      }
    }

    if (this.data.enableBackground && !oldData.enableBackground) {
      this.setBackground(this.texture);
    } else if (!this.data.enableBackground && oldData.enableBackground) {
      this.setBackground(null);
    }
  },

  remove: function remove() {
    this.el.removeEventListener('object3dset', this.object3dsetHandler);
    var mesh = this.el.getObject3D('mesh');
    var data = this.data;

    applyEnvMap(mesh, data.materials, null, 1);
    if (data.enableBackground) this.setBackground(null);
  },

  setBackground: function setBackground(texture) {
    this.el.sceneEl.object3D.background = texture;
  }
});

},{}],4:[function(require,module,exports){
'use strict';

/* global CANNON */

/**
 * Based on aframe/examples/showcase/tracked-controls.
 *
 * Handles events coming from the hand-controls.
 * Determines if the entity is grabbed or released.
 * Updates its position to move along the controller.
 */

module.exports = AFRAME.registerComponent('grab', {
  init: function init() {
    this.system = this.el.sceneEl.systems.physics;

    this.GRABBED_STATE = 'grabbed';

    this.grabbing = false;
    this.hitEl = /** @type {AFRAME.Element}    */null;
    this.physics = /** @type {AFRAME.System}     */this.el.sceneEl.systems.physics;
    this.constraint = /** @type {CANNON.Constraint} */null;

    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.onGripOpen = this.onGripOpen.bind(this);
    this.onGripClose = this.onGripClose.bind(this);
  },

  play: function play() {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('gripdown', this.onGripClose);
    el.addEventListener('gripup', this.onGripOpen);
    el.addEventListener('trackpaddown', this.onGripClose);
    el.addEventListener('trackpadup', this.onGripOpen);
    el.addEventListener('triggerdown', this.onGripClose);
    el.addEventListener('triggerup', this.onGripOpen);
  },

  pause: function pause() {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('gripdown', this.onGripClose);
    el.removeEventListener('gripup', this.onGripOpen);
    el.removeEventListener('trackpaddown', this.onGripClose);
    el.removeEventListener('trackpadup', this.onGripOpen);
    el.removeEventListener('triggerdown', this.onGripClose);
    el.removeEventListener('triggerup', this.onGripOpen);
  },

  onGripClose: function onGripClose() {
    this.grabbing = true;
  },

  onGripOpen: function onGripOpen() {
    var hitEl = this.hitEl;
    this.grabbing = false;
    if (!hitEl) {
      return;
    }
    hitEl.removeState(this.GRABBED_STATE);
    this.hitEl = undefined;
    this.system.removeConstraint(this.constraint);
    this.constraint = null;
  },

  onHit: function onHit(evt) {
    var hitEl = evt.detail.el;
    // If the element is already grabbed (it could be grabbed by another controller).
    // If the hand is not grabbing the element does not stick.
    // If we're already grabbing something you can't grab again.
    if (hitEl.is(this.GRABBED_STATE) || !this.grabbing || this.hitEl) {
      return;
    }
    hitEl.addState(this.GRABBED_STATE);
    this.hitEl = hitEl;
    this.constraint = new CANNON.LockConstraint(this.el.body, hitEl.body);
    this.system.addConstraint(this.constraint);
  }
});

},{}],5:[function(require,module,exports){
'use strict';

require('./checkpoint');
require('./cube-env-map');
require('./grab');
require('./normal-material');
require('./sphere-collider');

},{"./checkpoint":2,"./cube-env-map":3,"./grab":4,"./normal-material":6,"./sphere-collider":7}],6:[function(require,module,exports){
'use strict';

/**
 * Recursively applies a MeshNormalMaterial to the entity, such that
 * face colors are determined by their orientation. Helpful for
 * debugging geometry
 */

module.exports = AFRAME.registerComponent('normal-material', {
  init: function init() {
    this.material = new THREE.MeshNormalMaterial({ flatShading: true });
    this.applyMaterial = this.applyMaterial.bind(this);
    this.el.addEventListener('object3dset', this.applyMaterial);
    this.applyMaterial();
  },

  remove: function remove() {
    this.el.removeEventListener('object3dset', this.applyMaterial);
  },

  applyMaterial: function applyMaterial() {
    var _this = this;

    this.el.object3D.traverse(function (node) {
      if (node.isMesh) node.material = _this.material;
    });
  }
});

},{}],7:[function(require,module,exports){
'use strict';

/**
 * Based on aframe/examples/showcase/tracked-controls.
 *
 * Implement bounding sphere collision detection for entities with a mesh.
 * Sets the specified state on the intersected entities.
 *
 * @property {string} objects - Selector of the entities to test for collision.
 * @property {string} state - State to set on collided entities.
 *
 */

module.exports = AFRAME.registerComponent('sphere-collider', {
  schema: {
    enabled: { default: true },
    interval: { default: 80 },
    objects: { default: '' },
    state: { default: 'collided' },
    radius: { default: 0.05 },
    watch: { default: true }
  },

  init: function init() {
    /** @type {MutationObserver} */
    this.observer = null;
    /** @type {Array<Element>} Elements to watch for collisions. */
    this.els = [];
    /** @type {Array<Element>} Elements currently in collision state. */
    this.collisions = [];
    this.prevCheckTime = undefined;

    this.eventDetail = {};
    this.handleHit = this.handleHit.bind(this);
    this.handleHitEnd = this.handleHitEnd.bind(this);
  },

  play: function play() {
    var sceneEl = this.el.sceneEl;

    if (this.data.watch) {
      this.observer = new MutationObserver(this.update.bind(this, null));
      this.observer.observe(sceneEl, { childList: true, subtree: true });
    }
  },

  pause: function pause() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  /**
   * Update list of entities to test for collision.
   */
  update: function update() {
    var data = this.data;
    var objectEls = void 0;

    // Push entities into list of els to intersect.
    if (data.objects) {
      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
    } else {
      // If objects not defined, intersect with everything.
      objectEls = this.el.sceneEl.children;
    }
    // Convert from NodeList to Array
    this.els = Array.prototype.slice.call(objectEls);
  },

  tick: function () {
    var position = new THREE.Vector3(),
        meshPosition = new THREE.Vector3(),
        colliderScale = new THREE.Vector3(),
        size = new THREE.Vector3(),
        box = new THREE.Box3(),
        collisions = [],
        distanceMap = new Map();
    return function (time) {
      if (!this.data.enabled) {
        return;
      }

      // Only check for intersection if interval time has passed.
      var prevCheckTime = this.prevCheckTime;
      if (prevCheckTime && time - prevCheckTime < this.data.interval) {
        return;
      }
      // Update check time.
      this.prevCheckTime = time;

      var el = this.el,
          data = this.data,
          mesh = el.getObject3D('mesh');
      var colliderRadius = void 0;

      if (!mesh) {
        return;
      }

      collisions.length = 0;
      distanceMap.clear();
      el.object3D.getWorldPosition(position);
      el.object3D.getWorldScale(colliderScale);
      colliderRadius = data.radius * scaleFactor(colliderScale);
      // Update collision list.
      this.els.forEach(intersect);

      // Emit events and add collision states, in order of distance.
      collisions.sort(function (a, b) {
        return distanceMap.get(a) > distanceMap.get(b) ? 1 : -1;
      }).forEach(this.handleHit);

      // Remove collision state from other elements.
      this.collisions.filter(function (el) {
        return !distanceMap.has(el);
      }).forEach(this.handleHitEnd);

      // Store new collisions
      copyArray(this.collisions, collisions);

      // Bounding sphere collision detection
      function intersect(el) {
        var radius = void 0,
            mesh = void 0,
            distance = void 0,
            extent = void 0;

        if (!el.isEntity) {
          return;
        }

        mesh = el.getObject3D('mesh');

        if (!mesh) {
          return;
        }

        box.setFromObject(mesh).getSize(size);
        extent = Math.max(size.x, size.y, size.z) / 2;
        radius = Math.sqrt(2 * extent * extent);
        box.getCenter(meshPosition);

        if (!radius) {
          return;
        }

        distance = position.distanceTo(meshPosition);
        if (distance < radius + colliderRadius) {
          collisions.push(el);
          distanceMap.set(el, distance);
        }
      }
      // use max of scale factors to maintain bounding sphere collision
      function scaleFactor(scaleVec) {
        return Math.max(scaleVec.x, scaleVec.y, scaleVec.z);
      }
    };
  }(),

  handleHit: function handleHit(targetEl) {
    targetEl.emit('hit');
    targetEl.addState(this.data.state);
    this.eventDetail.el = targetEl;
    this.el.emit('hit', this.eventDetail);
  },
  handleHitEnd: function handleHitEnd(targetEl) {
    targetEl.emit('hitend');
    targetEl.removeState(this.data.state);
    this.eventDetail.el = targetEl;
    this.el.emit('hitend', this.eventDetail);
  }
});

function copyArray(dest, source) {
  dest.length = 0;
  for (var i = 0; i < source.length; i++) {
    dest[i] = source[i];
  }
}

},{}]},{},[1]);
