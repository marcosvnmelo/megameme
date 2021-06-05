import PHYSICAL_COLLISION_TAGS from '../actor/PHYSICAL_COLLISION_TAGS';
import LINE_POSITIONS from './LINE_POSITIONS';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BreakableFloor extends cc.Component {
  @property(cc.Prefab)
  public nextLinePrefab: cc.Prefab = null;

  @property
  public currentLine = 0;

  public onBeginContact(_contact: cc.PhysicsContact, _selfCollider: cc.Collider, otherCollider: cc.Collider): void {
    if (otherCollider.tag === PHYSICAL_COLLISION_TAGS.FLOOR_BREAKER) {
      switch (this.currentLine) {
        case 0:
          this.changeLine(this.nextLinePrefab, LINE_POSITIONS.POSITION_1);
          break;

        case 1:
          this.changeLine(this.nextLinePrefab, LINE_POSITIONS.POSITION_2);
          break;

        case 2:
          this.changeLine(this.nextLinePrefab, LINE_POSITIONS.POSITION_3);
          break;

        default:
          break;
      }
    }
  }

  private changeLine(newLinePrefab: cc.Prefab, linePosition: LINE_POSITIONS) {
    const newLine = cc.instantiate(newLinePrefab);

    newLine.position = cc.v3(this.node.position.x, linePosition, this.node.position.z);

    this.node.getParent().addChild(newLine);

    this.node.destroy();
  }
}
