import COLLISION_TAGS from '../../COLLISION_TAGS';
import BeeBlader from './BeeBlader';

const { ccclass } = cc._decorator;

@ccclass
export default class BeeBladerSensor extends cc.Component {
  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.MEGAMAN) {
      this.targetDetected();
    }
  }

  private targetDetected(): void {
    this.node.parent.getComponent(BeeBlader).onTargetDetected();
  }
}
