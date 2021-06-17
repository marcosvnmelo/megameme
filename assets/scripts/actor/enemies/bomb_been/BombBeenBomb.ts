import COLLISION_TAGS from '../../COLLISION_TAGS';

const { ccclass } = cc._decorator;

@ccclass
export default class BombBeenBomb extends cc.Component {
  public onCollisionEnter(other: cc.BoxCollider): void {
    switch (other.tag) {
      case COLLISION_TAGS.BREAKABLE_FLOOR:
      case COLLISION_TAGS.LONG_FLOOR:
        this.node.getComponent(cc.RigidBody).gravityScale = 0;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0);
        this.node.getComponent(cc.Animation).play('ready');
        break;

      case COLLISION_TAGS.MEGAMAN:
        this.node.destroy();
        break;

      default:
        break;
    }
  }
}
