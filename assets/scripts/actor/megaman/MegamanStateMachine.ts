import StateMachine from '../../../utils/StateMachine';
import Megaman from './Megaman';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class MegamanStateMachine extends StateMachine<MEGAMAN_STATES, Megaman> {
  public onAnimationStart(state: MEGAMAN_STATES): void {
    throw new Error('Method not implemented.');
  }

  public onAnimationEnd(state: MEGAMAN_STATES): void {
    throw new Error('Method not implemented.');
  }
}
