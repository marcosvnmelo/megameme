import PHYSICAL_COLLISION_TAGS from '../../PHYSICAL_COLLISION_TAGS';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BeeBlader extends cc.Component {
  @property(cc.Prefab)
  public bulletPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  public bombPrefab: cc.Prefab = null;

  @property(cc.SpriteFrame)
  public deadSprite: cc.SpriteFrame = null;

  private movementTween: cc.Tween;

  private canShootBombs = false;

  public onLoad(): void {
    this.node.getComponent(cc.RigidBody).gravityScale = 0;
    this.node.getComponent(cc.PhysicsChainCollider).enabled = false;

    this.movementTween = cc
      .tween(this.node)
      .delay(0.6)
      .call(() => {
        this.startShooting();
        this.canShootBombs = true;
      })
      .to(15, { x: -200 });

    this.movementTween.start();
  }

  public onBeginContact(
    _contact: cc.PhysicsContact,
    _selfCollider: cc.PhysicsChainCollider,
    otherCollider: cc.PhysicsBoxCollider
  ): void {
    if (otherCollider.tag === PHYSICAL_COLLISION_TAGS.FLOOR && this.node.position.y < -750) {
      this.scheduleOnce(() => {
        this.node.getComponent(cc.PhysicsChainCollider).tag = PHYSICAL_COLLISION_TAGS.FLOOR;
        this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
      }, 0.1);
    }
  }

  private shoot(): void {
    const bullet = cc.instantiate(this.bulletPrefab);

    this.node.getChildByName('BulletSpawnPoint').addChild(bullet);
  }

  private startShooting(): void {
    this.schedule(this.shoot, 0.1, cc.macro.REPEAT_FOREVER, 0.7);
  }

  private stopShooting(): void {
    this.unschedule(this.shoot);
  }

  public onTargetDetected(): void {
    if (this.canShootBombs && this.node.getChildByName('BombSpawnPoint').children.length === 0) {
      const bomb = cc.instantiate(this.bombPrefab);

      this.node.getChildByName('BombSpawnPoint').addChild(bomb);
    }
  }

  public die(): void {
    if (this.node.position.x < 20) {
      this.movementTween.stop();
      this.stopShooting();
      this.node.getChildByName('Body').getComponent(cc.Animation).stop();
      this.node.getChildByName('Body').getComponent(cc.Sprite).spriteFrame = this.deadSprite;
      this.node.getChildByName('Body').color = cc.color(150, 150, 150, 255);

      this.node.getComponent(cc.BoxCollider).enabled = false;
      this.node.getChildByName('Sensor').getComponent(cc.BoxCollider).enabled = false;

      this.node.getComponent(cc.PhysicsChainCollider).enabled = true;
      this.node.getComponent(cc.RigidBody).gravityScale = 0.5;
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 100);
    }
  }
}
