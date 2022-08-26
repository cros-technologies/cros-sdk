import { signedFetch } from "@decentraland/SignedFetch";
import { AdContent } from "src/interfaces/adContent";
import {getParcel} from '@decentraland/ParcelIdentity'
import { getUserData } from "@decentraland/Identity"

export class CrosService {
  private static _instance: CrosService;
  private static _adCollection: Array<AdContent> = new Array<AdContent>();
  private static _baseUrl: string = 'https://cros-metaverse-gateway-staging.azurewebsites.net';

  static getInstance(assetId: string): CrosService {
    return this.creatInstance(assetId)
  }

  private constructor() {
    CrosService._instance = this
   }

  static creatInstance(assetId: string): CrosService {
    if (this._instance == null) {
      log('created service')
      this._instance = new CrosService()
      executeTask(async () => {
        await this._instance?.fetchAdsFromAdServe(assetId);     
      })     
    }
    return this._instance
  }

  async getAdToDisplay(): Promise<AdContent> {
    log('count' + CrosService._adCollection.length)
    return CrosService._adCollection.shift() ?? {};
  }

  async fetchAdsFromAdServe(assetId: string): Promise<any> {
    log('fetch ads')
    if (!CrosService._adCollection) {
      CrosService._adCollection = new Array<AdContent>();
    }
  
    if (CrosService._adCollection.length > 5) {
      return;
    }

    let publisherAddress = await this.getPublisherAddress();
    let user = await getUserData()
    let userId = user ? user.userId  : ''
    let url = `${CrosService._baseUrl}/adserve/decentraland/${publisherAddress}/${assetId}?userId=${userId}`
    try {
      let response = await signedFetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "GET"
      })

      if (!response.text) {
        throw new Error("Invalid response")
      }
  
      let result = await JSON.parse(response.text)
      CrosService._adCollection.push(...result);
    } catch(e) {
      log("failed to reach URL" + e)
    }
  }

  async ping(assetId: string): Promise<any> {
    let publisherAddress = await this.getPublisherAddress();
    let url = `${CrosService._baseUrl}/ping/DECENTRALAND/${assetId}?publisherAddress=${publisherAddress}`
    executeTask(async () => {
      try {
        let response = await signedFetch(url, {
          headers: { "Content-Type": "application/json" },
          method: "GET"
        })

        if (!response.text) {
          throw new Error("Invalid response")
        }
    
        let json = await JSON.parse(response.text)
    
        log("Response received: ", json)
      } catch {
        log("failed to reach URL")
      }
    })
  }

  async addImpression(impressionData: any): Promise<any> {
    let url = CrosService._baseUrl + '/impression/DECENTRALAND'
      executeTask(async () => {
        try {
          let response = await signedFetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(impressionData),
          })
      
          if (!response.text) {
            throw new Error("Invalid response")
          }
      
          let json = await JSON.parse(response.text)
      
          log("Response received: ", json)
        } catch {
          log("failed to reach URL")
        }
    })
  }

  private async getPublisherAddress(): Promise<string> {
    const parcel = await getParcel()
    let coordinatesBaseString = parcel.land.sceneJsonData.scene.base;
    let coordinates = coordinatesBaseString.split(',');
    let url = `https://api.decentraland.org/v2/tiles?x1=${coordinates[0]}&y1=${coordinates[1]}&x2=${coordinates[0]}&y2=${coordinates[1]}`
    try {
      let response = await signedFetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "GET"
      })
      if (!response.text) {
        throw new Error("Invalid response")
      }
  
      let result = await JSON.parse(response.text)
      return result.data[coordinatesBaseString].owner;
    } catch(e) {
      log("failed to reach URL" + e)
      return '';
    }
  }
}