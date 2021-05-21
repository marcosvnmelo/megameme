const { ccclass } = cc._decorator;

@ccclass
export default abstract class Actor<S> extends cc.Component {
  abstract state: S;
}
