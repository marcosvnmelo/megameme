import DIRECTIONS from './DIRECTIONS';

export default interface ICanMove {
  walkForce: number;

  move(direction: DIRECTIONS): void;
}
