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

  public onCollisionEnter(): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
    this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[1].name);
  }

  public onAnimationEnd(): void {
    this.node.destroy();
  }
}
