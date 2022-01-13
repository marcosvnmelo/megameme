import StateMachine from '../../../../utils/StateMachine';
import RoadAttacker from './RoadAttacker';
import ROAD_ATTACKER_STATES from './ROAD_ATTACKER_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class RoadAttackerStateMachine extends StateMachine<ROAD_ATTACKER_STATES, RoadAttacker> {
  private roadAttacker: RoadAttacker;

  public start(): void {
    this.roadAttacker = this.node.getComponent(RoadAttacker);
  }

  public onAnimationEnd(state: ROAD_ATTACKER_STATES): void {
    switch (state) {
      case ROAD_ATTACKER_STATES.DRIVING:
        this.roadAttacker.turbo();
        break;

      case ROAD_ATTACKER_STATES.LOOKING_BACK:
        this.roadAttacker.state = ROAD_ATTACKER_STATES.TURNING_AROUND;
        break;

      case ROAD_ATTACKER_STATES.TURNING_AROUND:
        this.roadAttacker.turnAround();
        break;

      case ROAD_ATTACKER_STATES.STEPPING_ABOVE:
        this.roadAttacker.state = ROAD_ATTACKER_STATES.NO_DRIVING;
        break;

      default:
        break;
    }
  }

  public changeState(state: ROAD_ATTACKER_STATES): void {
    this.node.getComponent(cc.Animation).play(state);
  }
}
