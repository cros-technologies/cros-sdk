import {getUserAccount} from "@decentraland/EthereumController"
import { signedFetch } from "@decentraland/SignedFetch";
import { AdContent } from "src/interfaces/adContent";

const BASE_URL = '';
export class CrosService {
  private static _instance: CrosService;
  private static _adCollection: Array<AdContent> = new Array<AdContent>();


  static get instance(): CrosService {
    return this.creatInstance()
  }

  private constructor() {
    CrosService._instance = this
   }

  static creatInstance(): CrosService {
    if (this._instance == null) {
      this._instance = new CrosService()

      
    }
    return this._instance
  }

  async getAdToDisplay(): Promise<AdContent> {
    log('count' + CrosService._adCollection.length)
    if (CrosService._adCollection.length == 0) {
      await this.fetchAdsFromAdServe()
    }
    return CrosService._adCollection.shift();
  }

async fetchAdsFromAdServe(): Promise<any> {
  let baseurl = 'https://testnets-api.opensea.io/api/v1/asset/0x8C29E91D59c557a25e97d270E2e2373E67eccBf3/'

  let number = Math.floor(Math.random()*10) % 2 + 1;
  let url = baseurl + number
  if (!CrosService._adCollection) {
    CrosService._adCollection = new Array<AdContent>();
  }
  let x = await this.fetchAdFromAdServe(url)
  log("adserve data" + x)
  CrosService._adCollection.push(...x);
}

async fetchAdFromAdServe(url: string): Promise<Array<AdContent>> {
  try {
    executeTask(async () => {
      try {
        let response = await fetch(url)
        let json = await response.json()

        if (!response.ok) {
          return;
        }
      } catch {
        log("failed to reach URL")
      }
    })

    let result = new Array<AdContent>();
    let a1 = {
      content_type: 'image', 
      content_url: 'https://lh3.googleusercontent.com/X2idHyPXnppLAIKbOkHVai4EkNUMUSFKpLQlLD74MVWfHex2gJwjuV41po3OIcjrRtkeL0h47IGt0_ifZlpard2rgQtBXEaR0XgWRg', 
      bid_id: '', 
      campaign_id: '',
      click_url: '',
      facebook_url: '',
      instagram_url: '',
      qrCode_url:'',
      youtube_url:'',
      advertiserAddress: ''
    }

    let a2 = {
      content_type: 'image', 
      content_url: 'https://lh3.googleusercontent.com/1I_RcFjbGyu4Gj7AKgMoTq-Bv3Pzp-bq4Jde0G__ZwQR4EGsMRR1anv5rJSJ-mkp5Olu4nv6rFygaXCfuIUGQGEBzCD7ByIuBqfB3w', 
      bid_id: '', 
      campaign_id: '',
      click_url: '',
      facebook_url: '',
      instagram_url: '',
      qrCode_url:'',
      youtube_url:'',
      advertiserAddress: ''
    }

    if (Math.floor(Math.random()*10) % 2) {
      result.push(a1)
    } else {
      result.push(a2)
    }
    
    if (Math.floor(Math.random()*10) % 2) {
      result.push(a1)
    } else {
      result.push(a2)
    } 

    return result;
    
  } catch (e) {
    log('error getting event data ', e)
    return null;
  }
}

async ping(assetId: string): Promise<any> {
  let url = 'https://testnets-api.opensea.io/api/v1/asset/0x8C29E91D59c557a25e97d270E2e2373E67eccBf3/'
  
  try {
    let tokenId = 4 % 2 + 1
    url = url + tokenId
    const response = await fetch(url)
  } catch (e) {
    log('error getting event data ', e)
    return null;
  }
}

async addImpression(impressionData: any): Promise<any> {
  let url = 'https://cros-metaverse-gateway-dev.azurewebsites.net/metaverse/impression/DECENTRALAND'
  debugger
  try {
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
  } catch (e) {
    log('error getting event data ', e)
    return null;
  }
}
}