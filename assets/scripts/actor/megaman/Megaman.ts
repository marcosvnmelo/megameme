import Actor from '../Actor';
import DIRECTIONS from '../DIRECTIONS';
import PHYSICAL_COLLISION_TAGS from '../PHYSICAL_COLLISION_TAGS';
import ChargingEffect from './effects/ChargingEffect';
import CHARGING_EFFECTS from './effects/CHARGING_EFFECTS';
import MegamanStateMachine from './MegamanStateMachine';
import MEGAMAN_STATES from './MEGAMAN_STATES';
import Gunshot from './projectiles/Gunshot';

const { ccclass } = cc._decorator;

@ccclass
export default class Megaman extends Actor<MEGAMAN_STATES> {
  private _state: MEGAMAN_STATES = MEGAMAN_STATES.IDLE;

  private _isJumping = false;

  private facing: DIRECTIONS = DIRECTIONS.RIGHT;

  private rigidBody: cc.RigidBody;

  private jumpForce = 26000;

  private walkForce = 10000;

  private flyForce = 4000;

  private maxWalkSpeed = 250;

  private maxFlySpeed = 150;

  private _isWallSliding = {
    direction: DIRECTIONS.RIGHT,
    isSliding: false,
  };

  private _chargeLevel = 0;

  private isShooting = false;

  private chargingEffectNode: ChargingEffect;

  public get state(): MEGAMAN_STATES {
    return this._state;
  }

  public set state(newValue: MEGAMAN_STATES) {
    if (newValue !== this._state)
      switch (newValue) {
        case MEGAMAN_STATES.JUMPING:
          if (this._state === MEGAMAN_STATES.DASHING || this._state === MEGAMAN_STATES.DASHING_SHOOTING)
            this.stopDash();
          this.node.getComponent(cc.Animation).play(newValue);
          break;

        case MEGAMAN_STATES.RUNNING_SHOOTING:
          this.keepAnimationTimeonSwitch(newValue);
          break;

        case MEGAMAN_STATES.RUNNING:
          if (this._state === MEGAMAN_STATES.RUNNING_SHOOTING) this.keepAnimationTimeonSwitch(newValue);
          else this.node.getComponent(cc.Animation).play(newValue);
          break;

        case MEGAMAN_STATES.DASHING_SHOOTING:
          this.keepAnimationTimeonSwitch(newValue);
          break;

        case MEGAMAN_STATES.DASHING:
          if (this._state === MEGAMAN_STATES.DASHING_SHOOTING) this.keepAnimationTimeonSwitch(newValue);
          else this.node.getComponent(cc.Animation).play(newValue);
          break;

        default:
          this.node.getComponent(cc.Animation).play(newValue);
          break;
      }
    else {
      switch (newValue) {
        case MEGAMAN_STATES.IDLE_SHOOTING:
          this.node.getComponent(cc.Animation).setCurrentTime(0, newValue);
          this.node.getComponent(cc.Animation).play(newValue);
          break;

        default:
          break;
      }
    }

    this._state = newValue;
  }

  public get isJumping(): boolean {
    return this._isJumping;
  }

  public set isJumping(newValue: boolean) {
    if (newValue) {
      this.state = MEGAMAN_STATES.JUMPING;
    }

    if (!newValue && (this.state === MEGAMAN_STATES.FALLING || this.state === MEGAMAN_STATES.WALL_KICK)) {
      this.state = MEGAMAN_STATES.LANDING;
    }

    this._isJumping = newValue;
  }

  public get isWallSliding(): { direction: DIRECTIONS; isSliding: boolean } {
    return this._isWallSliding;
  }

  public set isWallSliding(newValue: { direction: DIRECTIONS; isSliding: boolean }) {
    if (newValue.isSliding) {
      this.schedule(this.keepPlayerOnWall, 0, cc.macro.REPEAT_FOREVER);
      this.state = MEGAMAN_STATES.WALL_SLIDING;
    } else {
      this.unschedule(this.keepPlayerOnWall);
      this.node.getComponent(MegamanStateMachine).stopSpawnWallSmoke();

      if (this.isJumping && this._isWallSliding.isSliding) {
        this.state = MEGAMAN_STATES.WALL_KICK;
      }
    }
    this._isWallSliding = newValue;
  }

  public get chargeLevel(): number {
    return this._chargeLevel;
  }

  public set chargeLevel(newValue: number) {
    if (newValue === 0) {
      this.chargingEffectNode.currentEffect = CHARGING_EFFECTS.NONE;
    }

    if (newValue >= 0.5 && newValue < 1.3) {
      this.isShooting = false;

      this.chargingEffectNode.currentEffect = CHARGING_EFFECTS.LEVEL_1;
    }

    if (newValue >= 1.3) {
      this.chargingEffectNode.currentEffect = CHARGING_EFFECTS.LEVEL_2;
    }

    this._chargeLevel = newValue;
  }

  public start(): void {
    this.chargingEffectNode = this.node.getChildByName('ChargingEffect').getComponent(ChargingEffect);
  }

  public onLoad(): void {
    this.rigidBody = this.getComponent(cc.RigidBody);
  }

  public onBeginContact(_contact: cc.PhysicsContact, selfCollider: cc.Collider, otherCollider: cc.Collider): void {
    if (
      selfCollider.tag === PHYSICAL_COLLISION_TAGS.MEGAMAN_FEET &&
      otherCollider.tag === PHYSICAL_COLLISION_TAGS.FLOOR &&
      (this.isJumping || this.state === MEGAMAN_STATES.WALL_SLIDING)
    ) {
      this.isJumping = false;

      this.isWallSliding = {
        direction: this.isWallSliding.direction,
        isSliding: false,
      };
    }

    if (
      selfCollider.tag === PHYSICAL_COLLISION_TAGS.MEGAMAN_RIGHT_SIDE &&
      otherCollider.tag === PHYSICAL_COLLISION_TAGS.RIGHT_WALL &&
      this.isJumping
    ) {
      this.isWallSliding = {
        direction: DIRECTIONS.RIGHT,
        isSliding: true,
      };
    }

    if (
      selfCollider.tag === PHYSICAL_COLLISION_TAGS.MEGAMAN_LEFT_SIDE &&
      otherCollider.tag === PHYSICAL_COLLISION_TAGS.LEFT_WALL &&
      this.isJumping
    ) {
      this.isWallSliding = {
        direction: DIRECTIONS.LEFT,
        isSliding: true,
      };
    }
  }

  public onEndContact(_contact: cc.PhysicsContact, selfCollider: cc.Collider, otherCollider: cc.Collider): void {
    if (selfCollider.tag === 0 && otherCollider.tag === 3 && !this.isJumping) {
      this.isJumping = true;
    }

    if (
      selfCollider.tag === PHYSICAL_COLLISION_TAGS.MEGAMAN_RIGHT_SIDE &&
      otherCollider.tag === PHYSICAL_COLLISION_TAGS.RIGHT_WALL &&
      this.isJumping
    ) {
      this.isWallSliding = {
        direction: this.isWallSliding.direction,
        isSliding: false,
      };
    }

    if (
      selfCollider.tag === PHYSICAL_COLLISION_TAGS.MEGAMAN_LEFT_SIDE &&
      otherCollider.tag === PHYSICAL_COLLISION_TAGS.LEFT_WALL &&
      this.isJumping
    ) {
      this.isWallSliding = {
        direction: this.isWallSliding.direction,
        isSliding: false,
      };
    }
  }

  public jump(): void {
    if (!this.isJumping) {
      this.rigidBody.applyForceToCenter(cc.v2(0, this.jumpForce), true);
    }

    if (this.state === MEGAMAN_STATES.WALL_SLIDING) {
      this.node.x += this.isWallSliding.direction * -1 * 10;
      this.rigidBody.applyForceToCenter(cc.v2(this.isWallSliding.direction * -1 * 9000, this.jumpForce * 1.3), true);

      this.schedule(
        () => {
          if (this.rigidBody.linearVelocity.maxAxis() > 700) {
            this.rigidBody.applyForceToCenter(cc.v2(0, -this.jumpForce * 10), true);
          }
        },
        0,
        300
      );
    }
  }

  public move(direction: DIRECTIONS): void {
    if (
      this.state !== MEGAMAN_STATES.DASHING &&
      this.state !== MEGAMAN_STATES.DASHING_SHOOTING &&
      (this.isWallSliding.isSliding ? this.isWallSliding.direction !== direction : true)
    ) {
      this.movePlayer(direction);
      if (direction !== this.facing) {
        this.reface(direction);
        this.isWallSliding = {
          direction,
          isSliding: this.isWallSliding.isSliding,
        };
      } else if (!this.isJumping) {
        this.state = this.isShooting ? MEGAMAN_STATES.RUNNING_SHOOTING : MEGAMAN_STATES.RUNNING;
      }
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

  public dash(): void {
    if (!this.isJumping && this.state !== MEGAMAN_STATES.DASHING && this.state !== MEGAMAN_STATES.DASHING_SHOOTING) {
      this.state = MEGAMAN_STATES.DASHING;

      this.schedule(this.dashPlayer, 0, cc.macro.REPEAT_FOREVER);
    }
  }

  private dashPlayer(): void {
    if (Math.abs(this.rigidBody.linearVelocity.x) < this.maxWalkSpeed * 2) {
      this.rigidBody.applyForceToCenter(cc.v2(this.facing * this.walkForce, 0), true);
    }
  }

  public stopDash(): void {
    if (this.state === MEGAMAN_STATES.DASHING || this.state === MEGAMAN_STATES.DASHING_SHOOTING) {
      this.unschedule(this.dashPlayer);
    }
  }

  private keepPlayerOnWall(): void {
    this.rigidBody.applyForceToCenter(cc.v2(this.isWallSliding.direction * this.flyForce, -6000), true);
  }

  private shoot(): void {
    const shootLevel = Math.floor((this.chargeLevel / 1.3) * 2);

    const gunshot = this.node.getChildByName('Gunshot').getComponent(Gunshot);
    gunshot.fire(shootLevel);

    this.switchShootingAnimations();

    this.chargeLevel = 0;
  }

  public charge(): void {
    this.schedule(this.incrementCharge, 0.01, 130);
    this.isShooting = true;
  }

  public stopCharge(): void {
    this.unschedule(this.incrementCharge);
    this.shoot();
    this.isShooting = false;
  }

  private incrementCharge(): void {
    this.chargeLevel += 0.01;
  }

  private switchShootingAnimations(): void {
    switch (this.state) {
      case MEGAMAN_STATES.IDLE:
        this.state = MEGAMAN_STATES.IDLE_SHOOTING;
        break;

      case MEGAMAN_STATES.RUNNING:
        this.state = MEGAMAN_STATES.RUNNING_SHOOTING;
        break;

      case MEGAMAN_STATES.DASHING:
        this.state = MEGAMAN_STATES.DASHING_SHOOTING;
        break;

      default:
        break;
    }
  }

  private keepAnimationTimeonSwitch(newValue: MEGAMAN_STATES) {
    this.node.getComponent(cc.Animation).play(newValue);
    this.node
      .getComponent(cc.Animation)
      .setCurrentTime(this.node.getComponent(cc.Animation).getAnimationState(this._state).time);
  }
}
