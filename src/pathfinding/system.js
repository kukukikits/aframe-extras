const { Pathfinding } = require("three-pathfinding");

const pathfinder = new Pathfinding();
const ZONE = "level";

/**
 * nav
 *
 * Pathfinding system, using PatrolJS.
 */
module.exports = AFRAME.registerSystem("nav", {
  init: function () {
    this.navMesh = null;
    this.agents = new Set();
    this.terrianMesh = null;
  },

  /**
   * @param {THREE.Geometry} geometry
   */
  setNavMeshGeometry: function (geometry) {
    this.navMesh = new THREE.Mesh(geometry);
    pathfinder.setZoneData(ZONE, Pathfinding.createZone(geometry));
    Array.from(this.agents).forEach((agent) => agent.updateNavLocation());
  },

  /**
   * @return {THREE.Mesh}
   */
  getNavMesh: function () {
    return this.navMesh;
  },

  /**
   * @param {NavAgent} ctrl
   */
  addAgent: function (ctrl) {
    this.agents.add(ctrl);
  },

  /**
   * @param {NavAgent} ctrl
   */
  removeAgent: function (ctrl) {
    this.agents.delete(ctrl);
  },

  /**
   * @param  {THREE.Vector3} start
   * @param  {THREE.Vector3} end
   * @param  {number} groupID
   * @return {Array<THREE.Vector3>}
   */
  getPath: function (start, end, groupID) {
    return this.navMesh ? pathfinder.findPath(start, end, ZONE, groupID) : null;
  },

  /**
   * @param {THREE.Vector3} position
   * @return {number}
   */
   getGroup: function (position, checkPolygon = false) {
    return this.navMesh ? pathfinder.getGroup(ZONE, position, checkPolygon) : null;
  },

  /**
   * @param  {THREE.Vector3} position
   * @param  {number} groupID
   * @return {Node}
   */
   getNode: function (position, groupID, checkPolygon = false) {
    return this.navMesh
      ? // disable geometry within check. Player would get stuck and overstep the boundary if set to true.
        pathfinder.getClosestNode(position, ZONE, groupID, checkPolygon)
      : null;
  },

  /**
   * @param  {THREE.Vector3} start Starting position.
   * @param  {THREE.Vector3} end Desired ending position.
   * @param  {number} groupID
   * @param  {Node} node
   * @param  {THREE.Vector3} endTarget (Output) Adjusted step end position.
   * @return {Node} Current node, after step is taken.
   */
  clampStep: function (start, end, groupID, node, endTarget) {
    if (!this.navMesh) {
      endTarget.copy(end);
      return null;
    } else if (!node) {
      endTarget.copy(end);
      return this.getNode(end, groupID);
    }
    return pathfinder.clampStep(start, end, node, ZONE, groupID, endTarget);
  },

  setTerrianMesh: function (terrianMesh) {
    this.terrianMesh = terrianMesh;
  },

  getTerrianMesh: function () {
    return this.terrianMesh;
  },

  getTerrianIntersect: function (point) {
    return this.projectPoint(point, this.terrianMesh);
  },

  getNavStart: function (point) {
    return this.projectPoint(point, this.navMesh);
  },

  // 把点point从上到下投影到terrian mesh上，并返回第一个交点信息
  projectPoint: (function () {
    let origin = new THREE.Vector3();
    let direction = new THREE.Vector3(0, -1, 0);
    let raycaster = new THREE.Raycaster(origin, direction);
    let target = [];
    return function (point, terrian) {
      if (!terrian || !point) {
        return;
      }
      origin.copy(point);
      origin.y += 0.5;
      target.length = 0;
      let intersections = raycaster.intersectObject(terrian, true, target);
      if (intersections && intersections.length > 0) {
        let res = intersections[0];
        target.length = 0;
        return res;
      }
    };
  })(),
});
