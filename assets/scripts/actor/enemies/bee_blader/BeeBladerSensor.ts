import COLLISION_TAGS from '../../COLLISION_TAGS';
import Sensor from '../../Sensor';
import BeeBlader from './BeeBlader';

const { ccclass } = cc._decorator;

@ccclass
export default class BeeBladerSensor extends Sensor {
  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.MEGAMAN) {
      this.targetDetected(BeeBlader);
    }
  }
}
