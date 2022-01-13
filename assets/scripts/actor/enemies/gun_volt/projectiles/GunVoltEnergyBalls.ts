import Bullet from '../../../Bullet';
import COLLISION_TAGS from '../../../COLLISION_TAGS';

const { ccclass } = cc._decorator;

@ccclass
export default class GunVoltEnergyBalls extends Bullet {
  public onLoad(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.speed, -this.speed);
  }

  public onCollisionEnter(other: cc.BoxCollider): void {
    switch (other.tag) {
      case COLLISION_TAGS.LONG_FLOOR:
      case COLLISION_TAGS.BREAKABLE_FLOOR:
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.speed, 0);
        break;

      default:
        break;
    }
  }
}
