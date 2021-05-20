// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Actor from '../Actor';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class Megaman extends Actor<MEGAMAN_STATES> {
  private _state: MEGAMAN_STATES = MEGAMAN_STATES.IDLE;

  public get state(): MEGAMAN_STATES {
    return this._state;
  }

  // LIFE-CYCLE CALLBACKS:
  // onLoad () {}
  // start() { }
  // update (dt) {}
}
