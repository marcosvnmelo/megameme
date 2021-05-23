import Actor from '../Actor';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class Megaman extends Actor<MEGAMAN_STATES> {
  private _state: MEGAMAN_STATES = MEGAMAN_STATES.IDLE;

  private _isJumping = false;

  private rigidBody: cc.RigidBody;

  public get state(): MEGAMAN_STATES {
    return this._state;
  }

  public set state(newValue: MEGAMAN_STATES) {
    switch (newValue) {
      default:
        this.node.getComponent(cc.Animation).play(newValue);
        break;
    }

    this._state = newValue;
  }

  public get isJumping(): boolean {
    return this._isJumping;
  }

  public set isJumping(newValue: boolean) {
    if (newValue) {
      this.state = MEGAMAN_STATES.JUMP;
    }

    if (!newValue && this.state === MEGAMAN_STATES.FALLING) {
      this.state = MEGAMAN_STATES.LANDING;
    }

    this._isJumping = newValue;
  }

  public onLoad(): void {
    this.rigidBody = this.getComponent(cc.RigidBody);
  }

  public onBeginContact(_contact: cc.PhysicsContact, selfCollider: cc.Collider, otherCollider: cc.Collider): void {
    if (selfCollider.tag === 0 && otherCollider.tag === 3 && this.isJumping) {
      this.isJumping = false;
    }
  }

  public onEndContact(_contact: cc.PhysicsContact, selfCollider: cc.Collider, otherCollider: cc.Collider): void {
    if (selfCollider.tag === 0 && otherCollider.tag === 3 && !this.isJumping) {
      this.isJumping = true;
    }
  }

  public jump(): void {
    this.rigidBody.applyForceToCenter(cc.v2(0, 26000), true);
  }
}
