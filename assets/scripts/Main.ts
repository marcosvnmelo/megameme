const { ccclass } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  private physicsManager: cc.PhysicsManager;

  private collisionManager: cc.CollisionManager;

  public onLoad(): void {
    this.physicsManager = cc.director.getPhysicsManager();
    this.physicsManager.enabled = true;
    this.physicsManager.gravity = cc.v2(0, -2000);
    this.collisionManager = cc.director.getCollisionManager();
    this.collisionManager.enabled = true;
  }
}
