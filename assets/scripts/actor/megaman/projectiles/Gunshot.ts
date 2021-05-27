const { ccclass, property } = cc._decorator;

@ccclass
export default class Gunshot extends cc.Component {
  @property(cc.Prefab)
  public normalBullet: cc.Prefab = null;

  @property(cc.Prefab)
  public level1Bullet: cc.Prefab = null;

  @property(cc.Prefab)
  public level2Bullet: cc.Prefab = null;

  public fire(level: number): void {
    switch (level) {
      case 0:
        this.node.addChild(cc.instantiate(this.normalBullet));
        break;

      case 1:
        this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[0].name);
        break;

      case 2:
        this.node.getComponent(cc.Animation).play(this.node.getComponent(cc.Animation).getClips()[1].name);
        break;

      default:
        break;
    }
  }

  public onAnimationEnd(level: number): void {
    switch (level) {
      case 1:
        this.node.addChild(cc.instantiate(this.level1Bullet));
        break;

      case 2:
        this.node.addChild(cc.instantiate(this.level2Bullet));
        break;

      default:
        break;
    }
  }
}
