import COLLISION_TAGS from '../../COLLISION_TAGS';
import Sensor from '../../Sensor';
import GunVolt from './GunVolt';

const { ccclass } = cc._decorator;

@ccclass
export default class GunVoltSensor extends Sensor {
  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.MEGAMAN) {
      this.targetDetected(GunVolt);
    }
  }
}
