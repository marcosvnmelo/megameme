const { ccclass } = cc._decorator;

@ccclass
export default class Effect extends cc.Component {
  public onAnimationEnd(): void {
    this.node.destroy();
  }
}
