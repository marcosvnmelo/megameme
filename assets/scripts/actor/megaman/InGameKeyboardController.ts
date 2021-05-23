import Megaman from './Megaman';
import KeyboardController from '../../KeyboardController';

const { ccclass } = cc._decorator;

@ccclass
export default class InGameKeyboardController extends KeyboardController {
  private megaman: Megaman;

  public start(): void {
    this.megaman = this.node.parent.getComponent(Megaman);
  }

  public onKeyDown(event: cc.Event.EventKeyboard): void {
    switch (event.keyCode) {
      case cc.macro.KEY.space:
        this.megaman.jump();
        break;

      default:
        console.log('apertou');

        break;
    }
  }

  public onKeyUp(event: cc.Event.EventKeyboard): void {
    switch (event.keyCode) {
      default:
        console.log('soltou');

        break;
    }
  }
}
