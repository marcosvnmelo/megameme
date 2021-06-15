import Actor from '../../Actor';
import DIRECTIONS from '../../DIRECTIONS';
import ICanMoveOnAir from '../../ICanMoveOnAir';
import ICanSense from '../../ICanSense';
import CrusherStateMachine from './CrusherStateMachine';
import CRUSHER_STATES from './CRUSHER_STATES';
import FloorBreaker from './FloorBreaker';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Crusher extends Actor<CRUSHER_STATES> implements ICanMoveOnAir, ICanSense {
  @property
  public flyForce = 500;

  private stateMachine: CrusherStateMachine;

  private floorBreaker: FloorBreaker;

  private move: cc.Tween;

  private canAttack = false;

  private _state: CRUSHER_STATES = CRUSHER_STATES.IDLE;

  private _facing: DIRECTIONS = DIRECTIONS.LEFT;

  public get state(): CRUSHER_STATES {
    return this._state;
  }

  public set state(newValue: CRUSHER_STATES) {
    if (this.state !== newValue) {
      switch (newValue) {
        case CRUSHER_STATES.LAUNCHING:
          this.move.stop();
          this.stateMachine.onStateChange(newValue);
          break;

        case CRUSHER_STATES.MOVING:
          this.move.start();
          this.stateMachine.onStateChange(newValue);
          break;

        default:
          this.stateMachine.onStateChange(newValue);
          break;
      }
    }

    this._state = newValue;
  }

  public get facing(): DIRECTIONS {
    return this._facing;
  }

  public set facing(value: DIRECTIONS) {
    this.reface(value);

    this._facing = value;
  }

  public start(): void {
    this.floorBreaker = this.node.getChildByName('FloorBreaker').getComponent(FloorBreaker);
    this.stateMachine = this.node.getChildByName('Body').getComponent(CrusherStateMachine);

    this.move = cc.tween(this.node).repeatForever(
      cc
        .tween()
        .call(() => {
          this.facing = DIRECTIONS.LEFT;

          this.stateMachine.onStateChange(CRUSHER_STATES.MOVING);
        })
        .to(
          cc.misc.clampf(
            (cc.misc.clampf(1 + this.flyForce / 1000, 0, 2) *
              Math.abs(-(this.node.parent.width / 2) - this.node.position.x)) /
            30, 1, 3), // eslint-disable-line prettier/prettier
          { position: cc.v3(-(this.node.parent.width / 2), -20) }
        )
        .call(() => {
          this.stateMachine.onStateChange(CRUSHER_STATES.IDLE);
        })
        .delay(2)
        .call(() => {
          this.facing = DIRECTIONS.RIGHT;
        })
        .call(() => {
          this.stateMachine.onStateChange(CRUSHER_STATES.MOVING);
        })
        .to(
          cc.misc.clampf(
            (cc.misc.clampf(1 + this.flyForce / 1000, 0, 2) *
              Math.abs(this.node.parent.width / 2 - this.node.position.x)) /
            30, 1, 3), // eslint-disable-line prettier/prettier
          { position: cc.v3(this.node.parent.width / 2, -20) }
        )
        .call(() => {
          this.facing = DIRECTIONS.LEFT;
        })
        .call(() => {
          this.stateMachine.onStateChange(CRUSHER_STATES.IDLE);
        })
        .delay(2)
    );

    this.scheduleOnce(() => this.move.start(), 0.5);
    this.scheduleOnce(() => {
      this.canAttack = true;
    }, 3);
  }

  public launchFloorBreaker(): void {
    this.floorBreaker.launch();
  }

  public onFloorBreakerBack(): void {
    this.state = CRUSHER_STATES.RETRIEVING;
  }

  public moveAgain(): void {
    this.state = CRUSHER_STATES.MOVING;
    this.scheduleOnce(() => {
      this.canAttack = true;
    }, 5);
  }

  public onTargetDetected(): void {
    if (this.canAttack) {
      this.canAttack = false;

      this.state = CRUSHER_STATES.LAUNCHING;
    }
  }

  private reface(direction: DIRECTIONS): void {
    switch (direction) {
      case DIRECTIONS.LEFT:
        this.node.getChildByName('Body').scaleX = 1;
        break;

      case DIRECTIONS.RIGHT:
        this.node.getChildByName('Body').scaleX = -1;
        break;

      default:
        break;
    }
  }
}
