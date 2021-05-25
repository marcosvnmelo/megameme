import CHARGING_EFFECTS from './CHARGING_EFFECTS';

const { ccclass } = cc._decorator;

@ccclass
export default class ChargingEffect extends cc.Component {
  private _currentEffect: CHARGING_EFFECTS = CHARGING_EFFECTS.NONE;

  public get currentEffect(): CHARGING_EFFECTS {
    return this._currentEffect;
  }

  public set currentEffect(newValue: CHARGING_EFFECTS) {
    if (newValue !== this.currentEffect) {
      switch (newValue) {
        case CHARGING_EFFECTS.NONE:
          this.node.getComponent(cc.Animation).stop();
          this.node.getComponent(cc.Sprite).spriteFrame = null;
          break;

        case CHARGING_EFFECTS.LEVEL_1:
          this.node.getComponent(cc.Animation).play(newValue);
          break;

        default:
          this.node.getComponent(cc.Animation).play(newValue);
          break;
      }

      this._currentEffect = newValue;
    }
  }
}
