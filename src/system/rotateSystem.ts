import { CrosEntity } from "src/entities/crosEntity"

export class SimpleRotate implements ISystem {
    constructor(private crosEntity: CrosEntity) {

    }
    
    update() {
      let transform = this.crosEntity.getComponent(Transform)
      transform.rotate(Vector3.Up(), 1)
    }
  }