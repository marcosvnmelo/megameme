import COLLISION_TAGS from '../actor/COLLISION_TAGS';
import LINE_POSITIONS from './LINE_POSITIONS';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BreakableFloor extends cc.Component {
  @property(cc.Prefab)
  public nextLinePrefab: cc.Prefab = null;

  @property
  public currentLine = 0;

  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.CRUSHER) {
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
