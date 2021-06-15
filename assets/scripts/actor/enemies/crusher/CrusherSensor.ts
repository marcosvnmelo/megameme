import COLLISION_TAGS from '../../COLLISION_TAGS';
import Sensor from '../../Sensor';
import Crusher from './Crusher';

const { ccclass } = cc._decorator;

@ccclass
export default class CrusherSensor extends Sensor {
  public onCollisionEnter(other: cc.BoxCollider): void {
    switch (other.tag) {
      case COLLISION_TAGS.BREAKABLE_FLOOR_TARGET:
      case COLLISION_TAGS.MEGAMAN:
        this.targetDetected(Crusher);
        break;

      default:
        break;
    }
  }
}
