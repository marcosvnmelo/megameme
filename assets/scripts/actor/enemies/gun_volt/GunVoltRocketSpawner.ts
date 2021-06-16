import GunVolt from './GunVolt';

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunVoltRocketSpawner extends cc.Component {
  @property(cc.Prefab)
  public rocketPrefab: cc.Prefab = null;

  public fire(): void {
    for (let i = 0; i < 2; i += 1) {
      this.scheduleOnce(() => {
        const rocket = cc.instantiate(this.rocketPrefab);
        const map = cc.find('Canvas/Map');

        map.addChild(rocket);

        rocket.position = cc.v3(
          map.convertToNodeSpaceAR(
            this.node.convertToWorldSpaceAR(this.node.getChildByName(`Point${i + 1}`).getPosition())
          )
        );
      }, i);
    }

    this.node.parent.getComponent(GunVolt).onFired();
  }
}
