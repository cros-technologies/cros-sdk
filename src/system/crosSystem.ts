import { CrosService } from "src/services/crosService";
import { CrosEntity } from "../entities/crosEntity";

export class CrosSystem implements ISystem {
   timer: number = 30
   private static _entities: Array<CrosEntity> = new Array<CrosEntity>()
   private static _instance: CrosSystem | null = null
   private static _crosServiceInstance: CrosService | null = null
   static get instance(): CrosSystem {
     return this.createAndAddToEngine()
   }

   private constructor() {
    CrosSystem._instance = this
   }

   static createAndAddToEngine(): CrosSystem {
    if (this._instance == null) {
      this._instance = new CrosSystem()
      engine.addSystem(this._instance)
      this._crosServiceInstance = CrosService.creatInstance();
    }
    return this._instance
  }

  static addEntity(crosEntity: CrosEntity) {
    CrosSystem._entities.push(crosEntity)
  }

  update(dt: number) {
    if (this.timer > 0) {
        this.timer -= dt
    } else {
      for (var val of CrosSystem._entities) {
        val.displayAd();
      }
      
      this.timer = 30
    }

    if (this.timer % 10 == 0) {
      executeTask(async () => {
        await CrosSystem._crosServiceInstance.fetchAdsFromAdServe()
      })      
    }
  }
}