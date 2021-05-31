const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectSpawner extends cc.Component {
  @property(cc.Prefab)
  public effectPrefab: cc.Prefab = null;

  public spawn(): void {
    const effect = cc.instantiate(this.effectPrefab);

    cc.find('Canvas').addChild(effect);

    effect.setPosition(
      this.node.parent.position.addSelf(
        this.node.position.scaleSelf(cc.v3(this.node.parent.scaleX / Math.abs(this.node.parent.scaleX), 1, 1))
      )
    );

    effect.scaleX *= this.node.parent.scaleX / Math.abs(this.node.parent.scaleX);
  }
}
