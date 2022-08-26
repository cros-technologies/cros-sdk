import { CrosService } from "../services/crosService";
import { CrosEntity } from "../entities/crosEntity";

export class CrosSystem implements ISystem {
   timer1: number = 15
   timer2: number = 5
   timer3: number = 2
   private static _entities: Array<CrosEntity> = new Array<CrosEntity>()
   private static _instance: CrosSystem | null = null
   private static _crosServiceInstance: CrosService | null = null
   private static assetId: string;

   private constructor() {
    CrosSystem._instance = this
   }

   static createAndAddToEngine(assetId: string): CrosSystem {
    CrosSystem.assetId = assetId;
    if (this._instance == null) {
      this._instance = new CrosSystem()
      engine.addSystem(this._instance)
      this._crosServiceInstance = CrosService.creatInstance(CrosSystem.assetId);
    }
    return this._instance
  }

  static addEntity(crosEntity: CrosEntity) {
    CrosSystem._entities.push(crosEntity)
  }

  update(dt: number) {
    if (this.timer1 > 0) {
        this.timer1 -= dt
    } else {
      for (var val of CrosSystem._entities) {
        val.displayAd();
      }
      
      this.timer1 = 15
    }

    if (this.timer3 > 0) {
      this.timer3 -= dt
    } else {
      if (this.timer3 > -100) {
      for (var val of CrosSystem._entities) {
        if (!val.adContent || !val.adContent.image2DUri) {
          val.displayAd();
          this.timer3 = 2
        } else {
          this.timer3 = -100
        }
      }
    }
    
    
  }

    if (this.timer2 > 0) {
      this.timer2 -= dt
    } else {
      executeTask(async () => {
        await CrosSystem._crosServiceInstance?.fetchAdsFromAdServe(CrosSystem.assetId);
        for (var val of CrosSystem._entities) {
          if (!val.adContent)
          {
              await val.displayAd();
          }
        }
      })
      this.timer2 = 5     
    }
  }
}