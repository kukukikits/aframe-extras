/**
 * nav-mesh
 *
 * Waits for a mesh to be loaded on the current entity, then sets it as the
 * nav mesh in the pathfinding system.
 */
module.exports = AFRAME.registerComponent("nav-terrian", {
  schema: {
    terrianName: { type: "string" },
  },

  init: function () {
    this.system = this.el.sceneEl.systems.nav;
    this.hasLoadedNavMesh = false;
    this.nodeName = this.data.nodeName;
    this.el.addEventListener("object3dset", this.loadNavMesh.bind(this));
  },

  play: function () {
    if (!this.hasLoadedNavMesh) this.loadNavMesh();
  },

  loadNavMesh: function () {
    var self = this;
    const object = this.el.getObject3D("mesh");
    const scene = this.el.sceneEl.object3D;

    if (!object) return;

    let terrianMesh;
    object.traverse((node) => {
      if (node.isObject3D && node.name === self.data.terrianName) {
        terrianMesh = node;
      }
    });

    if (!terrianMesh) return;

    scene.updateMatrixWorld();
    this.system.setTerrianMesh(terrianMesh);
    this.hasLoadedNavMesh = true;
  },
});
