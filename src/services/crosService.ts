import {getUserAccount} from "@decentraland/EthereumController"
import { AdContent } from '../interfaces/adContent';

const BASE_URL = '';
export class CrosService {
  private static _instance: CrosService;
  private _adCollection: Array<AdContent> = new Array<AdContent>();
  private constructor() {
   }

  static getInstance() {
    debugger;
      if (this._instance) {
          return this._instance;
      }

      this._instance = new CrosService();
      this._instance.fetchAds();
      return this._instance;
  }

  async getAdToDisplay(): Promise<AdContent> {
    log('count' + this._adCollection.length)
    if (this._adCollection.length <= 1) {
      await this.fetchAds();
    }
      return this._adCollection.pop();
  }

async fetchAds(): Promise<any> {
  let url = 'https://testnets-api.opensea.io/api/v1/asset/0x8C29E91D59c557a25e97d270E2e2373E67eccBf3/1'

  try {
    let response = await fetch(url)
    log(response)
    let json = await response.json()
    let userAccount = await getUserAccount()
    log(url + ' json from the response: ', json)
    if (!response.ok) {
      return;
    }
    this._adCollection.push({
      content_type: 'image', 
      content_url: json.image_url, 
      bid_id: '', 
      campaign_id: '',
      click_url: '',
      facebook_url: '',
      instagram_url: '',
      qrCode_url:'',
      youtube_url:'',
      advertiserAddress: ''
    });

    url = 'https://testnets-api.opensea.io/api/v1/asset/0x8C29E91D59c557a25e97d270E2e2373E67eccBf3/2'
    response = await fetch(url)
    log(response)
    json = await response.json()
    userAccount = await getUserAccount()
    log(url + ' json from the response: ', json)
    this._adCollection.push({
      content_type: 'image', 
      content_url: json.image_url, 
      bid_id: '', 
      campaign_id: '',
      click_url: '',
      facebook_url: '',
      instagram_url: '',
      qrCode_url:'',
      youtube_url:'',
      advertiserAddress: ''
    });
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
}