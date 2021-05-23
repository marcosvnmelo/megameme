import Actor from '../Actor';
import DIRECTIONS from '../DIRECTIONS';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class Megaman extends Actor<MEGAMAN_STATES> {
  private _state: MEGAMAN_STATES = MEGAMAN_STATES.IDLE;

  private _isJumping = false;

  private facing: DIRECTIONS = DIRECTIONS.RIGHT;

  private rigidBody: cc.RigidBody;

  private jumpForce = 26000;

  private walkForce = 10000;

  private flyForce = 2000;

  private maxWalkSpeed = 250;

  private maxFlySpeed = 100;

  public get state(): MEGAMAN_STATES {
    return this._state;
  }

  public set state(newValue: MEGAMAN_STATES) {
    if (newValue !== this._state)
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
    if (!this.isJumping) {
      this.rigidBody.applyForceToCenter(cc.v2(0, this.jumpForce), true);
    }
  }

  public move(direction: DIRECTIONS): void {
    this.movePlayer(direction);
    if (direction !== this.facing) {
      this.reface(direction);
    } else if (!this.isJumping) {
      this.state = MEGAMAN_STATES.RUNNING;
    }
  }

  private movePlayer(direction: DIRECTIONS): void {
    if (Math.abs(this.rigidBody.linearVelocity.x) < (!this.isJumping ? this.maxWalkSpeed : this.maxFlySpeed)) {
      this.rigidBody.applyForceToCenter(cc.v2(direction * (!this.isJumping ? this.walkForce : this.flyForce), 0), true);
    }
  }

  private reface(direction: DIRECTIONS): void {
    this.node.scaleX *= -1;
    this.facing = direction;
  }
}
