import COLLISION_TAGS from '../COLLISION_TAGS';
import Crusher from './Crusher';

const { ccclass } = cc._decorator;

@ccclass
export default class Sensor extends cc.Component {
  public onCollisionEnter(other: cc.BoxCollider): void {
    switch (other.tag) {
      case COLLISION_TAGS.BREAKABLE_FLOOR_TARGET:
      case COLLISION_TAGS.MEGAMAN:
        this.targetDetected();
        break;

      default:
        break;
    }
  }

  private targetDetected(): void {
    this.node.parent.getComponent(Crusher).onTargetDetected();
  }
}
