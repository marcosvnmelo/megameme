import StateMachine from '../../../../utils/StateMachine';
import GunVolt from './GunVolt';
import GUN_VOLT_STATES from './GUN_VOLT_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class GunVoltStateMachine extends StateMachine<GUN_VOLT_STATES, GunVolt> {
  private gunVolt: GunVolt;

  public start(): void {
    this.gunVolt = this.node.getComponent(GunVolt);
  }

  public onAnimationEnd(state: GUN_VOLT_STATES): void {
    switch (state) {
      case GUN_VOLT_STATES.LOADING:
        this.gunVolt.state = GUN_VOLT_STATES.SHOOTING;
        break;

      case GUN_VOLT_STATES.CLOSING:
        this.gunVolt.state = GUN_VOLT_STATES.IDLE;
        break;
      default:
        break;
    }
  }

  public changeState(state: GUN_VOLT_STATES): void {
    this.node.getComponent(cc.Animation).play(state);
  }
}
