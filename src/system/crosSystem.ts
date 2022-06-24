import { CrosEntity } from '../entities/crosEntity';

export class CrosSystem implements ISystem {
   timer: number = 20 

  constructor(private crosEntity: CrosEntity) {

  }
  update(dt: number) {
    if (this.timer > 0) {
        this.timer -= dt
    } else {
        this.timer = 20
        this.crosEntity.displayAd()
    }
  }
}