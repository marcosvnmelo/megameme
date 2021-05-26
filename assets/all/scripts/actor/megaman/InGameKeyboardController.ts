/* eslint-disable dot-notation */
import Megaman from './Megaman';
import KeyboardController from '../../KeyboardController';
import DIRECTIONS from '../DIRECTIONS';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class InGameKeyboardController extends KeyboardController {
  private megaman: Megaman;

  private movePressedButtons: Array<boolean> = [];

  private _isCharging = false;

  public get isCharging(): boolean {
    return this._isCharging;
  }

  public set isCharging(newValue: boolean) {
    if (!this._isCharging && newValue) {
      this.megaman.charge();
    }

    if (this._isCharging && !newValue) {
      this.megaman.stopCharge();
    }

    this._isCharging = newValue;
  }

  public start(): void {
    this.megaman = this.node.parent.getComponent(Megaman);
  }

  public update(): void {
    if ('LEFT' in this.movePressedButtons) {
      this.megaman.move(DIRECTIONS.LEFT);
    }

    if ('RIGHT' in this.movePressedButtons) {
      this.megaman.move(DIRECTIONS.RIGHT);
    }
  }

  public onKeyDown(event: cc.Event.EventKeyboard): void {
    switch (event.keyCode) {
      case cc.macro.KEY.num4:
        this.isCharging = true;
        break;

      case cc.macro.KEY.num5:
        this.megaman.dash();
        break;

      case cc.macro.KEY.space:
        this.megaman.jump();
        break;

      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.movePressedButtons['LEFT'] = true;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.movePressedButtons['RIGHT'] = true;
        break;

      default:
        break;
    }
  }

  public onKeyUp(event: cc.Event.EventKeyboard): void {
    switch (event.keyCode) {
      case cc.macro.KEY.num4:
        this.isCharging = false;
        break;

      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        delete this.movePressedButtons['LEFT'];
        this.stop();
        break;

      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        delete this.movePressedButtons['RIGHT'];
        this.stop();
        break;

      default:
        break;
    }
  }

  private stop(): void {
    if (this.megaman.state !== MEGAMAN_STATES.DASHING) {
      if (!this.megaman.isJumping) {
        this.megaman.state = MEGAMAN_STATES.IDLE;
      }
      this.node.parent.getComponent(cc.RigidBody).linearVelocity.x = 0;
    }
  }
}
