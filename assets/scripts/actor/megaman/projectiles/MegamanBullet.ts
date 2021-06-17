import Bullet from '../../Bullet';
import COLLISION_TAGS from '../../COLLISION_TAGS';
import BeeBlader from '../../enemies/bee_blader/BeeBlader';

const { ccclass } = cc._decorator;

@ccclass
export default class MegamanBullet extends Bullet {
  public onLoad(): void {
    const isToRight = cc.find(this.ownerPath).scaleX > 0;

    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.speed * (isToRight ? 1 : -1), 0);
  }

  public onCollisionEnter(other: cc.BoxCollider): void {
    switch (other.tag) {
      case COLLISION_TAGS.BEE_BLADER:
        other.node.getComponent(BeeBlader).die();
        this.onHitTarget();
        break;

      case COLLISION_TAGS.GUN_VOLT:
      case COLLISION_TAGS.CRUSHER_SENSOR:
      case COLLISION_TAGS.ROAD_ATTACKER:
        this.onHitTarget();
        break;

      default:
        break;
    }
  }

  protected onHitTarget(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[1].name);
  }
}
