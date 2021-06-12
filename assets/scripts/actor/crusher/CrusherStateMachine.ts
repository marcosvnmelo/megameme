import StateMachine from '../../../utils/StateMachine';
import Crusher from './Crusher';
import CRUSHER_STATES from './CRUSHER_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class CrusherStateMachine extends StateMachine<CRUSHER_STATES, Crusher> {
  private crusher: Crusher;

  private animations: cc.Animation;

  public start(): void {
    this.crusher = this.node.parent.getComponent(Crusher);
    this.animations = this.node.getComponent(cc.Animation);
  }

  public onAnimationEnd(state: CRUSHER_STATES): void {
    switch (state) {
      case CRUSHER_STATES.LAUNCHING:
        this.crusher.launchFloorBreaker();
        break;

      case CRUSHER_STATES.RETRIEVING:
        this.crusher.moveAgain();
        break;

      default:
        break;
    }
  }

  public onStateChange(state: CRUSHER_STATES): void {
    this.animations.play(state);
  }
}
