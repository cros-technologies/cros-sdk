import { ShapeType } from "../enums/shapeTypes";
import { AdContent } from "../interfaces/adContent";
import { CrosService } from "../services/crosService";
import { AdSpaceType } from "../enums/adSpaceType";
import {getUserAccount} from "@decentraland/EthereumController"
import {getParcel} from '@decentraland/ParcelIdentity'
import * as utils from 'triggerClass';

export class CrosEntity extends Entity {
    material: Material = new Material();
    adContent: AdContent = {}
    captureImpressionStartTime = new Date().getTime();
    slot: number = Math.floor(Math.random()*10);
    crosService: CrosService;

    constructor(shapeType: ShapeType, transform: Transform, private adMaterialType: AdSpaceType, private assetId: string) {
        super();
        this.crosService = CrosService.getInstance(assetId);
        this.adMaterialType = adMaterialType;
        if (shapeType == ShapeType.Gltf) {
            this.addComponent(new GLTFShape(''));
        } else {
            this.addComponent(this.getShapes(shapeType));
            this.addComponent(this.material);
        }

        this.addComponent(transform);
        this.addTriggerComponent()
        this.adClickEvent() 
        executeTask(async () => { this.displayAd() })      
    }

    addTriggerComponent() {
        this.addComponent(
            new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(5, 5, 5)), {
              onCameraEnter: async () => {
                  this.captureImpressionStartTime = new Date().getTime();
              },
                    onCameraExit: async () => {
                       let impressionTime = new Date().getTime() - this.captureImpressionStartTime;
                       const userAccount = await getUserAccount()
                       const parcel = await getParcel()
                       let impressionData = {
                            "adContentId": '',
                            "bidId": this.adContent.bid_id,
                            "campaignId": this.adContent.campaign_id,
                            "tokenId": this.assetId,
                            "metaverseAssetId": parcel.land.sceneJsonData.scene.base,
                            "walletAddress": userAccount,
                            "metaverse": "DECENTRALAND"
                       }
                       await this.crosService.addImpression(impressionData);
                       log(impressionData)
                    }
            })            
        )
    }    

    adClickEvent() {
        this.addComponent(
            new OnPointerDown(
                (e) => {
                    openExternalURL(this.adContent.click_url ?? '')
                },
            )
        )
    }

    async logImpression() {
        const userAccount = await getUserAccount()
        const parcel = await getParcel()
        let impressionData = {
            "adContentId": '',
            "bidId": this.adContent.bid_id,
            "campaignId": this.adContent.campaign_id,
            "tokenId": this.assetId,
            "metaverseAssetId": parcel.land.sceneJsonData.scene.base,
            "walletAddress": userAccount ?? "",
            "metaverse": "DECENTRALAND"
        }
        await this.crosService.addImpression(impressionData);
    }

    async displayAd() {
        log("getting ad content")
        this.adContent = await this.crosService.getAdToDisplay();
        if (!this.adContent || !this.adContent.image2DUri) {
            return;
        }
        if (this.adContent.content_type == '2DIMAGE') {
            try {           
                this.material.albedoTexture = new Texture(this.getContentUrl(this.adContent))       
            } catch (error) {
                return false;
            }
        } else if(this.adContent.content_type == 'VIDEO') {
            let videoTexture = new VideoTexture(new VideoClip(this.getContentUrl(this.adContent)))
            this.material.albedoTexture = videoTexture
        } else if(this.adContent.content_type == '3DIMAGE') {
            this.removeComponent(GLTFShape);
            this.addComponent(new GLTFShape(''));
        }

        await this.logImpression(); 
    }

    getContentUrl(adContent: AdContent): string {
        switch(this.adMaterialType) {
            case AdSpaceType.AdContent: 
            if (adContent && adContent.image2DUri) {
                return adContent.image2DUri[0]
            }
            case AdSpaceType.QR: return '';
            default: return "";
        }
    }

    getShapes(shapeType: ShapeType) {
        switch(shapeType) {
            case ShapeType.Plain: return new PlaneShape();
            case ShapeType.Box: return new BoxShape();
            default: return new PlaneShape();
        }
    }
}