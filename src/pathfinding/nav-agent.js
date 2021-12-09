module.exports = AFRAME.registerComponent("nav-agent", {
  schema: {
    destination: { type: "vec3" },
    active: { default: false },
    speed: { default: 2 },
    gazeTarget: { type: "selector" }, // gaze at target when navigating
  },
  init: function () {
    this.system = this.el.sceneEl.systems.nav;
    this.system.addAgent(this);
    this.group = null;
    this.path = [];
    this.raycaster = new THREE.Raycaster();
    this.camera = null;
    this.lookControls = null;
    this.el.object3D.traverse((node) => {
      if (node instanceof THREE.Camera) {
        this.camera = node;
        this.lookControls = node.el.components["look-controls"];
      }
    });
  },
  remove: function () {
    this.system.removeAgent(this);
  },
  update: function () {
    this.path.length = 0;
  },
  updateNavLocation: function () {
    this.group = null;
    this.path = [];
  },
  _getGazeTarget: function (vTarget, rotateTarget, waypoint) {
    if (this.data.gazeTarget && this.data.gazeTarget.object3D) {
      vTarget.copy(this.data.gazeTarget.object3D.position);
    } else {
      // vTarget为lookAt的对象，高度y和rotateTarget的高度一致
      rotateTarget.getWorldPosition(vTarget);
      vTarget.setX(waypoint.x);
      vTarget.setZ(waypoint.z);
    }
  },
  _getVQuaternion: function (
    vQuaternion,
    vOriQuaternion,
    rotateTarget,
    vTarget,
    waypoint
  ) {
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
  _updateRotation: function (
    vPreEulerRot,
    vEulerRot,
    vOriQuaternion,
    vQuaternion,
    rotateTarget,
    slerp = 0.1
  ) {
    if (this.lookControls) {
      if (
        (this.lookControls.touchStarted &&
          this.lookControls.data.touchEnabled) ||
        this.lookControls.mouseDown
      ) {
        // 如果在运动过程中用户拖动视角，则不再处理转动
      } else {
        // 如果需要转动的对象是启用了lookControls的camera, 不能直接旋转Three.js camera对象，
        // 必须增量地设置lookControls.yawObject.rotation.y和lookControls.pitchObject.rotation.x
        // 这样就可以和lookControl保持兼容
        if (slerp) {
          vPreEulerRot.setFromQuaternion(vOriQuaternion, "YXZ");
          vOriQuaternion.slerp(vQuaternion, slerp);
          vEulerRot.setFromQuaternion(vOriQuaternion, "YXZ");
          this.lookControls.pitchObject.rotation.x +=
            vEulerRot.x - vPreEulerRot.x;
          this.lookControls.yawObject.rotation.y +=
            vEulerRot.y - vPreEulerRot.y;
        }
      }
    } else {
      // 最后使用四元数差值进行旋转
      rotateTarget.quaternion.slerp(vQuaternion, slerp);
    }
  },
  tick: (function () {
    const vDest = new THREE.Vector3();
    const vDelta = new THREE.Vector3();
    const vNext = new THREE.Vector3();
    const vQuaternion = new THREE.Quaternion();
    const vOriQuaternion = new THREE.Quaternion();
    const vTarget = new THREE.Vector3();
    const vEulerRot = new THREE.Euler();
    const vPreEulerRot = new THREE.Euler();

    return function (t, dt) {
      const el = this.el;
      const data = this.data;
      const raycaster = this.raycaster;
      if (!data.active) return;

      const speed = (data.speed * dt) / 1000;
      // Smoothly rotate when navigating around corners.
      // 如果子节点中存在lookControls，那么将旋转的对象设置为lookControls
      const rotateTarget = this.lookControls ? this.camera : el.object3D;

      // Use PatrolJS pathfinding system to get shortest path to target.
      if (!this.path.length) {
        const position = this.el.object3D.position;
        vDest.copy(data.destination);
        this.group = this.group || this.system.getGroup(position);

        // ------------ fix me-----------------
        // 当起始点和目的点在同一个navMesh的面中时，this.system.getPath可能不会返回两点间的直线路径，可能返回一个拐弯的路径
        // 因此加入下面的判断逻辑（TODO：深入了解pathfinding算法后，再确认这种验证逻辑是否正确，就目前来看，起到了一定的优化作用）
        const closestNode = this.system.getNode(position, this.group);
        const farthestNode = this.system.getNode(vDest, this.group);
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
      const vCurrent = el.object3D.position;
      const vWaypoint = this.path[0];
      vDelta.subVectors(vWaypoint, vCurrent);

      const distance = vDelta.length();
      let gazeTarget;

      if (distance < speed) {
        // If <1 step from current waypoint, discard it and move toward next.
        let moved = this.path.shift();
        const rotationGap = THREE.MathUtils.radToDeg(
          rotateTarget.quaternion.angleTo(vQuaternion)
        );
        const rotationDone = Math.abs(rotationGap) < 0.2; // default slerp interpolation factor is 0.1
        // After discarding the last waypoint, exit pathfinding.
        if (!this.path.length && rotationDone) {
          // 获取总共需要旋转多少的姿态数据到vQuaternion
          this._getVQuaternion(
            vQuaternion,
            vOriQuaternion,
            rotateTarget,
            vTarget,
            moved
          );
          this._updateRotation(
            vPreEulerRot,
            vEulerRot,
            vOriQuaternion,
            vQuaternion,
            rotateTarget,
            1
          );
          this.el.setAttribute("nav-agent", {
            active: false,
            gazeTarget: null,
          }); // deactive and clear gazeTarget
          el.emit("navigation-end");
          return;
        } else if (!this.path.length && !rotationDone) {
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
      this._getVQuaternion(
        vQuaternion,
        vOriQuaternion,
        rotateTarget,
        vTarget,
        gazeTarget
      );
      this._updateRotation(
        vPreEulerRot,
        vEulerRot,
        vOriQuaternion,
        vQuaternion,
        rotateTarget
      );

      vCurrent.copy(vNext);

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
  })(),
});
