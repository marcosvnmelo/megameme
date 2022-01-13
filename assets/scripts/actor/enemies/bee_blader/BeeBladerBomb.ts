const { ccclass, property } = cc._decorator;

@ccclass
export default class BeeBladerBomb extends cc.Component {
  @property(cc.SpriteFrame)
  public fallingSpriteFrame: cc.SpriteFrame = null;

  public onLoad(): void {
    cc.tween(this.node)
      .by(1, { x: -250 })
      .call(() => {
        this.node.getComponent(cc.Sprite).spriteFrame = this.fallingSpriteFrame;
      })
      .by(4, { x: -1000, y: -1000 })
      .call(() => {
        this.node.destroy();
      })
      .start();
  }
}
