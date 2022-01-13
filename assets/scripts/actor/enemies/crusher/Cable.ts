const { ccclass } = cc._decorator;

@ccclass
export default class Cable extends cc.Component {
  private body: cc.Node;

  private floorBreaker: cc.Node;

  public onLoad(): void {
    this.body = this.node.parent.getChildByName('Body');
    this.floorBreaker = this.node.parent.getChildByName('FloorBreaker');
  }

  public update(): void {
    this.node.setPosition(cc.v2(0, (this.floorBreaker.position.y - this.body.position.y) / 2));
    this.node.height = Math.abs(this.floorBreaker.position.y - this.body.position.y);
    this.node.getComponent(cc.BoxCollider).size.height = Math.abs(this.floorBreaker.position.y - this.body.position.y);
  }
}
