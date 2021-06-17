import DIRECTIONS from '../../DIRECTIONS';
import BombBeen from './BombBeen';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BombBeenBombSpawner extends cc.Component {
  @property(cc.Prefab)
  public bombPrefab: cc.Prefab = null;

  private force = 1;

  public spawn(direction: DIRECTIONS): void {
    this.schedule(
      () => {
        const bomb = cc.instantiate(this.bombPrefab);

        const map = cc.find('Canvas/Map');

        map.addChild(bomb);

        bomb.position = cc.v3(map.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2(0))));

        bomb.getComponent(cc.RigidBody).linearVelocity = cc.v2((100 * this.force + 50) * direction);

        if (this.force === 3) {
          this.force = 1;

          this.node.parent.getComponent(BombBeen).onShootFinished();
        } else {
          this.force += 1;
        }
      },
      0.5,
      2
    );
  }
}
