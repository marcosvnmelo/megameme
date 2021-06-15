import COLLISION_TAGS from '../../COLLISION_TAGS';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BeeBladerBullet extends cc.Component {
  @property
  public speed = 450;

  public onLoad(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(Math.sqrt(this.speed) * -1, Math.sqrt(this.speed) * -1);
  }

  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.LONG_FLOOR) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
      this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[1].name);
    }
  }

  public onAnimationEnd(): void {
    this.node.destroy();
  }
}
