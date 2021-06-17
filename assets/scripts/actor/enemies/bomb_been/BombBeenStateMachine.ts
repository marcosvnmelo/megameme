import StateMachine from '../../../../utils/StateMachine';
import BombBeen from './BombBeen';
import BOMB_BEEN_STATES from './BOMB_BEEN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class BombBeenStateMachine extends StateMachine<BOMB_BEEN_STATES, BombBeen> {
  private bombBeen: BombBeen;

  private animations: cc.Animation;

  public start(): void {
    this.bombBeen = this.node.getComponent(BombBeen);
    this.animations = this.node.getComponent(cc.Animation);
  }

  public onAnimationEnd(state: BOMB_BEEN_STATES): void {
    switch (state) {
      case BOMB_BEEN_STATES.OPENING:
        this.bombBeen.state = BOMB_BEEN_STATES.SHOOTING;
        break;

      case BOMB_BEEN_STATES.CLOSING:
        this.bombBeen.state = BOMB_BEEN_STATES.FLYING;
        break;

      default:
        break;
    }
  }

  public onStateChange(state: BOMB_BEEN_STATES): void {
    this.animations.play(state);
  }
}
