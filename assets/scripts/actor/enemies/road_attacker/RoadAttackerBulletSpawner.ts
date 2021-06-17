import DIRECTIONS from '../../DIRECTIONS';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoadAttackerBulletSpawner extends cc.Component {
  @property
  public bulletSpeed = 0;

  @property(cc.Prefab)
  public bulletPrefab: cc.Prefab = null;

  public fire(direction: DIRECTIONS): void {
    const bullet = cc.instantiate(this.bulletPrefab);

    const map = cc.find('Canvas/Map');

    map.addChild(bullet);

    bullet.position = cc.v3(map.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2(0))));

    bullet.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.bulletSpeed * direction, 0);
  }
}
