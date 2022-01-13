import Actor from '../../Actor';
import DIRECTIONS from '../../DIRECTIONS';
import ICanMoveOnAir from '../../ICanMoveOnAir';
import BombBeenBombSpawner from './BombBeenBombSpawner';
import BombBeenStateMachine from './BombBeenStateMachine';
import BOMB_BEEN_STATES from './BOMB_BEEN_STATES';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BombBeen extends Actor<BOMB_BEEN_STATES> implements ICanMoveOnAir {
  @property
  public flyForce = 0;

  private stateMachine: BombBeenStateMachine;

  private _state: BOMB_BEEN_STATES = BOMB_BEEN_STATES.FLYING;

  public get state(): BOMB_BEEN_STATES {
    return this._state;
  }

  public set state(value: BOMB_BEEN_STATES) {
    if (value !== this._state) {
      switch (value) {
        case BOMB_BEEN_STATES.FLYING:
          this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.flyForce, 0);
          break;

        case BOMB_BEEN_STATES.OPENING:
          this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0);
          break;

        case BOMB_BEEN_STATES.SHOOTING:
          this.shoot();
          break;

        default:
          break;
      }

      this.stateMachine.onStateChange(value);
    }

    this._state = value;
  }

  public get directionToShoot(): DIRECTIONS {
    const player = cc.find('Canvas/Megaman');

    const playerPosition = this.node.parent.convertToNodeSpaceAR(player.convertToWorldSpaceAR(cc.v2(0)));

    return playerPosition.x < this.node.getPosition().x ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
  }

  public start(): void {
    this.stateMachine = this.node.getComponent(BombBeenStateMachine);

    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.flyForce, 0);

    this.schedule(this.checkPlayerPosition, 0, cc.macro.REPEAT_FOREVER);
  }

  private checkPlayerPosition(): void {
    const player = cc.find('Canvas/Megaman');

    const playerPosition = this.node.parent.convertToNodeSpaceAR(player.convertToWorldSpaceAR(cc.v2(0)));

    if (Math.abs(playerPosition.x - this.node.position.x) <= 50) {
      this.state = BOMB_BEEN_STATES.OPENING;
      this.unschedule(this.checkPlayerPosition);
    }
  }

  private shoot(): void {
    this.node.getChildByName('BombSpawner').getComponent(BombBeenBombSpawner).spawn(this.directionToShoot);
  }

  public onShootFinished(): void {
    this.state = BOMB_BEEN_STATES.CLOSING;
  }
}
