import COLLISION_TAGS from '../../COLLISION_TAGS';
import BeeBlader from '../../enemies/bee_blader/BeeBlader';

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Animation)
@requireComponent(cc.RigidBody)
export default class Bullet extends cc.Component {
  @property
  public speed = 450;

  @property
  public ownerPath = '';

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

      default:
        break;
    }
  }

  public onAnimationEnd(): void {
    this.node.destroy();
  }

  private onHitTarget(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[1].name);
  }
}
