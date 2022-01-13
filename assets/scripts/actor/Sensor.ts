export default abstract class Sensor extends cc.Component {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected targetDetected(parentClass: Function): void {
    this.node.parent.getComponent(parentClass).onTargetDetected();
  }
}
