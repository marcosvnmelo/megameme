import Actor from '../Actor';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class Megaman extends Actor<MEGAMAN_STATES> {
  private _state: MEGAMAN_STATES = MEGAMAN_STATES.IDLE;

  public get state(): MEGAMAN_STATES {
    return this._state;
  }

  public set state(newValue: MEGAMAN_STATES) {
    this._state = newValue;
  }
}
