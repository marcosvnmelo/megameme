import Bullet from '../../Bullet';
import COLLISION_TAGS from '../../COLLISION_TAGS';

const { ccclass } = cc._decorator;

@ccclass
export default class BeeBladerBullet extends Bullet {
  public onLoad(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(Math.sqrt(this.speed) * -1, Math.sqrt(this.speed) * -1);
  }

  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.LONG_FLOOR) {
      this.onHitTarget();
    }
  }

  protected onHitTarget(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[1].name);
  }
}
