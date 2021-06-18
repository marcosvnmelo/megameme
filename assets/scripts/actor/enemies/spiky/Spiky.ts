import COLLISION_TAGS from '../../COLLISION_TAGS';
import DIRECTIONS from '../../DIRECTIONS';
import ICanMove from '../../ICanMove';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Spiky extends cc.Component implements ICanMove {
  @property
  public walkForce = 100;

  public onCollisionEnter(other: cc.BoxCollider): void {
    switch (other.tag) {
      case COLLISION_TAGS.BREAKABLE_FLOOR:
      case COLLISION_TAGS.LONG_FLOOR:
        this.node.getComponent(cc.RigidBody).gravityScale = 0;
        this.move(DIRECTIONS.LEFT);
        break;

      default:
        break;
    }
  }

  public move(direction: DIRECTIONS): void {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.walkForce * direction, 0);
  }
}
