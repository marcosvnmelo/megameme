import Actor from '../../Actor';
import COLLISION_TAGS from '../../COLLISION_TAGS';
import DIRECTIONS from '../../DIRECTIONS';
import PHYSICAL_COLLISION_TAGS from '../../PHYSICAL_COLLISION_TAGS';
import RoadAttackerBulletSpawner from './RoadAttackerBulletSpawner';
import RoadAttackerStateMachine from './RoadAttackerStateMachine';
import ROAD_ATTACKER_STATES from './ROAD_ATTACKER_STATES';

const { ccclass } = cc._decorator;

@ccclass
export default class RoadAttacker extends Actor<ROAD_ATTACKER_STATES> {
  private stateMachine: RoadAttackerStateMachine;

  private playerNode: cc.Node;

  private _facing = DIRECTIONS.LEFT;

  private _state: ROAD_ATTACKER_STATES = ROAD_ATTACKER_STATES.DRIVING;

  private _speed = 100;

  public get state(): ROAD_ATTACKER_STATES {
    return this._state;
  }

  public set state(value: ROAD_ATTACKER_STATES) {
    if (this._state !== value) {
      this.stateMachine.changeState(value);
    }

    this._state = value;
  }

  public get speed(): number {
    return this._speed;
  }

  public set speed(value: number) {
    this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(value * this.facing, 0);

    this._speed = value;
  }

  public get facing(): DIRECTIONS {
    return this._facing;
  }

  public set facing(value: DIRECTIONS) {
    this.node.getChildByName('Body').scaleX = value * -1;

    if (value !== this._facing) {
      this.state = ROAD_ATTACKER_STATES.DRIVING;

      this.speed = -100;
    }

    this._facing = value;
  }

  public start(): void {
    this.stateMachine = this.node.getComponent(RoadAttackerStateMachine);
    this.playerNode = cc.find('Canvas/Megaman');

    this.schedule(this.checkPlayerPosition, 0.5, cc.macro.REPEAT_FOREVER);
    this.schedule(this.shoot, 4, cc.macro.REPEAT_FOREVER, 0.8);
  }

  public update(): void {
    if (
      this.state !== ROAD_ATTACKER_STATES.TURNING_AROUND &&
      this.node.getComponent(cc.RigidBody).linearVelocity.x !== this.speed * this.facing
    ) {
      this.node.position = this.node.position.addSelf(cc.v3(0, 1, 0));
      this.speed *= 1;
    }
  }

  public onCollisionEnter(other: cc.BoxCollider): void {
    if (other.tag === COLLISION_TAGS.BULLET && this.state === ROAD_ATTACKER_STATES.DRIVING) {
      this.state = ROAD_ATTACKER_STATES.NO_DRIVING;
      this.unschedule(this.checkPlayerPosition);
      this.unschedule(this.shoot);
    }
  }

  public onBeginContact(
    _contact: cc.PhysicsContact,
    _selfCollider: cc.PhysicsBoxCollider,
    otherCollider: cc.PhysicsBoxCollider
  ): void {
    if (otherCollider.tag === PHYSICAL_COLLISION_TAGS.MEGAMAN_FEET && this.state === ROAD_ATTACKER_STATES.NO_DRIVING) {
      this.state = ROAD_ATTACKER_STATES.STEPPING_ABOVE;
    }
  }

  private checkPlayerPosition(): void {
    if (this.state === ROAD_ATTACKER_STATES.DRIVING) {
      const playerPosition = this.node.parent.convertToNodeSpaceAR(this.playerNode.convertToWorldSpaceAR(cc.v3(0)));

      const distanceToPlayer = playerPosition.x - this.node.getPosition().x;

      if (distanceToPlayer / Math.abs(distanceToPlayer) !== this.facing) {
        this.state = ROAD_ATTACKER_STATES.LOOKING_BACK;
      }
    }
  }

  public turbo(): void {
    this.speed = 200;
  }

  public turnAround(): void {
    this.speed = 50;

    this.scheduleOnce(() => {
      this.facing *= -1;
    }, 0.2);
  }

  private shoot(): void {
    if (this.state === ROAD_ATTACKER_STATES.DRIVING) {
      this.node.getChildByName('BulletSpawner').getComponent(RoadAttackerBulletSpawner).fire(this.facing);
    }
  }
}
