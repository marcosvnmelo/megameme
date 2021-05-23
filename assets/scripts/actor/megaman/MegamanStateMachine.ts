import StateMachine from '../../../utils/StateMachine';
import Megaman from './Megaman';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class MegamanStateMachine extends StateMachine<MEGAMAN_STATES, Megaman> {
  public onAnimationStart(state: MEGAMAN_STATES): void {
    switch (state) {
      default:
        console.log(state);
        break;
    }
  }

  public onAnimationEnd(state: MEGAMAN_STATES): void {
    switch (state) {
      case MEGAMAN_STATES.JUMP:
        this.node.getComponent(cc.Animation).play(MEGAMAN_STATES.FALLING);
        break;
      case MEGAMAN_STATES.FALLING:
        this.node.getComponent(cc.Animation).play(MEGAMAN_STATES.LANDING);
        break;
      case MEGAMAN_STATES.LANDING:
        this.node.getComponent(cc.Animation).play(MEGAMAN_STATES.IDLE);
        break;

      default:
        console.log(state);
        break;
    }
  }
}
