import GunVolt from './GunVolt';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunVoltEnergyBallsSpawner extends cc.Component {
  @property(cc.Prefab)
  public energyBallsPrefab: cc.Prefab = null;

  public fire(): void {
    const energyBalls = cc.instantiate(this.energyBallsPrefab);
    const map = cc.find('Canvas/Map');

    map.addChild(energyBalls);

    energyBalls.position = cc.v3(map.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.v2(0))));

    this.node.parent.getComponent(GunVolt).onFired();
  }
}
