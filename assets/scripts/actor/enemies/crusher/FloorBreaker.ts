import COLLISION_TAGS from '../../COLLISION_TAGS';
import Crusher from './Crusher';

const { ccclass } = cc._decorator;

@ccclass
export default class FloorBreaker extends cc.Component {
  private backToBody: cc.Tween;

  private _destroyedFloors = 0;

  private get destroyedFloors(): number {
    return this._destroyedFloors;
  }

  private set destroyedFloors(value: number) {
    if (value === 2) {
      this.scheduleOnce(() => {
        this.node.getComponent(cc.BoxCollider).tag = COLLISION_TAGS.FLOOR_BREAKER_DISABLED;
      }, 0.01);
    }

    if (value === 3) {
      this.backToBody.start();
    }

    this._destroyedFloors = value;
  }

  public start(): void {
    this.node.getComponent(cc.RigidBody).active = false;

    this.backToBody = cc
      .tween(this.node)
      .call(() => {
        this.node.getComponent(cc.RigidBody).active = false;
        this.node.getComponent(cc.RigidBody).gravityScale = 0;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0);

        this.unschedule(this.checkMaxDistance);
      })
      .delay(1)
      .to(1, { position: cc.v3(0, -18.5) }, { easing: 'smooth' })
      .delay(0.05)
      .call(() => {
        this.node.opacity = 0;
        this.node.parent.getChildByName('Cable').opacity = 0;

        this.destroyedFloors = 0;

        this.node.parent.getComponent(Crusher).onFloorBreakerBack();
      });
  }

  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.BREAKABLE_FLOOR) {
      this.destroyedFloors += 1;
    }
  }

  public launch(): void {
    this.node.setPosition(cc.v2(0, -18.5));

    this.node.opacity = 255;
    this.node.parent.getChildByName('Cable').opacity = 255;

    this.node.getComponent(cc.RigidBody).active = true;
    this.node.getComponent(cc.RigidBody).gravityScale = 0.4;
    this.node.getComponent(cc.BoxCollider).tag = COLLISION_TAGS.CRUSHER;

    this.schedule(this.checkMaxDistance, 0, cc.macro.REPEAT_FOREVER);
  }

  private checkMaxDistance(): void {
    if (this.node.position.y < -120) {
      this.unschedule(this.checkMaxDistance);

      this.backToBody.start();
    }
  }
}
