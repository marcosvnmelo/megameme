const { property } = cc._decorator;

export default abstract class Bullet extends cc.Component {
  @property
  public speed = 450;

  @property
  public ownerPath = '';

  public onAnimationEnd(): void {
    this.node.destroy();
  }

  protected onHitTarget?(): void;
}
