import ICanMoveOnAir from '../../ICanMoveOnAir';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Jamminger extends cc.Component implements ICanMoveOnAir {
  @property
  public flyForce = 300;

  private get playerPosition(): cc.Vec3 {
    return cc.v3(this.node.parent.convertToNodeSpaceAR(cc.find('Canvas/Megaman').convertToWorldSpaceAR(cc.v2(0))));
  }

  public onLoad(): void {
    this.scheduleOnce(this.seekPlayer, 1);
  }

  private seekPlayer(): void {
    const speed =
      Math.sqrt(
        (this.playerPosition.x - this.node.position.x) ** 2 + (this.playerPosition.y - this.node.position.y) ** 2
      ) / this.flyForce;

    cc.tween(this.node)
      .by(speed, {
        x: (this.playerPosition.x - this.node.position.x) * 1.5,
        y: cc.misc.clampf(
          (this.playerPosition.y - this.node.position.y) * 2,
          Math.abs(this.playerPosition.y - this.node.position.y) - 200,
          Math.abs(this.playerPosition.y - this.node.position.y) + 200
        ),
      })
      .call(() => {
        this.scheduleOnce(this.seekPlayer, 2);
      })
      .start();
  }
}
