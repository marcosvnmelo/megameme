// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {}
  // start() { }
  // update (dt) {}
}
