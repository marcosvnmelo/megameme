import StateMachine from '../../../utils/StateMachine';
import EffectSpawner from './effects/EffectSpawner';
import Megaman from './Megaman';
import MEGAMAN_STATES from './MEGAMAN_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class MegamanStateMachine extends StateMachine<MEGAMAN_STATES, Megaman> {
  private megaman: Megaman;

  public start(): void {
    this.megaman = this.node.getComponent(Megaman);
  }

  public onAnimationStart(state: MEGAMAN_STATES): void {
    switch (state) {
      case MEGAMAN_STATES.DASHING:
        this.node.getChildByName('DashSparkSpawner').getComponent(EffectSpawner).spawn();
        this.schedule(
          () => this.node.getChildByName('SmokeEffectSpawner').getComponent(EffectSpawner).spawn(),
          0.05,
          7,
          0.1
        );
        break;

      default:
        break;
    }
  }

  public onAnimationEnd(state: MEGAMAN_STATES): void {
    switch (state) {
      case MEGAMAN_STATES.JUMPING:
        this.schedule(this.checkIsFalling, 0, cc.macro.REPEAT_FOREVER);
        break;

      case MEGAMAN_STATES.LANDING:
        this.megaman.state = MEGAMAN_STATES.IDLE;
        break;

      case MEGAMAN_STATES.DASHING_SHOOTING:
      case MEGAMAN_STATES.DASHING:
        this.megaman.stopDash();
        this.megaman.state = MEGAMAN_STATES.IDLE;
        break;

      case MEGAMAN_STATES.IDLE_SHOOTING:
        this.megaman.state = MEGAMAN_STATES.IDLE;
        break;

      default:
        break;
    }
  }

  private checkIsFalling(): void {
    if (this.node.getComponent(cc.RigidBody).linearVelocity.y < 0) {
      this.megaman.state = MEGAMAN_STATES.FALLING;
      this.unschedule(this.checkIsFalling);
    }
  }
}
