import Actor from '../../Actor';
import ICanSense from '../../ICanSense';
import GunVoltEnergyBallsSpawner from './GunVoltEnergyBallsSpawner';
import GunVoltRocketSpawner from './GunVoltRocketSpawner';
import GunVoltStateMachine from './GunVoltStateMachine';
import GUN_VOLT_STATES from './GUN_VOLT_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class GunVolt extends Actor<GUN_VOLT_STATES> implements ICanSense {
  private stateMachine: GunVoltStateMachine;

  private _active = false;

  public get active(): boolean {
    return this._active;
  }

  public set active(value: boolean) {
    if (!this._active) {
      this.state = GUN_VOLT_STATES.LOADING;
    }

    this._active = value;
  }

  private _state: GUN_VOLT_STATES = GUN_VOLT_STATES.IDLE;

  public get state(): GUN_VOLT_STATES {
    return this._state;
  }

  public set state(value: GUN_VOLT_STATES) {
    if (value !== this._state) {
      switch (value) {
        case GUN_VOLT_STATES.IDLE:
          this.scheduleOnce(() => {
            this.state = GUN_VOLT_STATES.LOADING;
          }, 4);
          break;

        case GUN_VOLT_STATES.SHOOTING:
          this.shoot();
          break;

        default:
          break;
      }

      this.stateMachine.changeState(value);
    }

    this._state = value;
  }

  public start(): void {
    this.stateMachine = this.node.getComponent(GunVoltStateMachine);
  }

  public onTargetDetected(): void {
    this.active = true;
  }

  public shoot(): void {
    switch (Math.random() < 0.5 ? 1 : 2) {
      case 1:
        this.node.getChildByName('EnergyBallsSpawner').getComponent(GunVoltEnergyBallsSpawner).fire();
        break;

      case 2:
        this.node.getChildByName('RocketSpawner').getComponent(GunVoltRocketSpawner).fire();
        break;

      default:
        break;
    }
  }

  public onFired(): void {
    this.scheduleOnce(() => {
      this.state = GUN_VOLT_STATES.CLOSING;
    }, 1);
  }
}
