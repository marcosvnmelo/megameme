const { ccclass, property } = cc._decorator;

@ccclass
export default class GunVoltRocket extends cc.Component {
  @property(cc.Prefab)
  public rocketSmokePrefab: cc.Prefab = null;

  public onLoad(): void {
    this.schedule(
      () => {
        const rocketSmoke = cc.instantiate(this.rocketSmokePrefab);

        this.node.parent.addChild(rocketSmoke);

        rocketSmoke.position = cc.v3(
          this.node.position.x + this.node.width / 2 + rocketSmoke.width / 2,
          this.node.position.y
        );
      },
      0.05,
      cc.macro.REPEAT_FOREVER,
      0.1
    );
  }
}
