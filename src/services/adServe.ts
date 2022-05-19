import {getUserAccount} from "@decentraland/EthereumController"
import { AdContent } from "../entities/adContent"

export async function getAdSPTokens(): Promise<any> {
  let url = 'https://testnets-api.opensea.io/api/v1/asset/0x8C29E91D59c557a25e97d270E2e2373E67eccBf3/'
  
  try {
    let tokenId = 4 % 2 + 1
    url = url + tokenId
    const response = await fetch(url)
    const json = await response.json()
    const userAccount = await getUserAccount()
    log('json from the response: ', json)
    return  {
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
    };
  } catch (e) {
    log('error getting event data ', e)
    return e;
  }
}