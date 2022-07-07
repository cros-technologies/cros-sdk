import { ShapeType } from "./shapeTypes";
import { AdContent } from "../interfaces/adContent";
import * as utils from '@dcl/ecs-scene-utils'
import { CrosService } from "../services/crosService";
import { AdSpaceType } from "./adSpaceType";
import {getUserAccount} from "@decentraland/EthereumController"
import {getParcel} from '@decentraland/ParcelIdentity'
import { setTimeout } from "@dcl/ecs-scene-utils";

export class CrosEntity extends Entity {
    material: Material = new Material();
    adContent: AdContent = {}
    captureImpressionStartTime = new Date().getTime();
    slot: number = Math.floor(Math.random()*10);
    crosService: CrosService; 

    constructor(shapeType: ShapeType, transform: Transform, private adMaterialType: AdSpaceType) {
        super();
        this.crosService = CrosService.instance;
        this.adMaterialType = adMaterialType;
        if (shapeType == ShapeType.Gltf) {
            this.addComponent(new GLTFShape('models/hondas800.glb'));
        } else {
            this.addComponent(this.getShapes(shapeType));
            this.addComponent(this.material);
        }

        this.addComponent(transform);
        this.addTriggerComponent()
        this.adClickEvent() 
        this.displayAd()      
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
                         //  "Time Spent": impressionTime/1000,
                          //  "User": userAccount,
                            "adContentId": "adContentId",
                            "bidId": "bidId",
                            "campaignId": "campaignId",
                            "adAssetId": "adAssetId",
                            "metaverseAssetId": parcel.land.sceneJsonData.scene.base,
                            "walletAddress": "walletAddress"
                       }
                       await this.crosService.addImpression(impressionData);
                       log("Log Impression")
                       log(impressionData)
                    }
            })            
        )
    }    

    adClickEvent() {
        this.addComponent(
            new OnPointerDown(
                (e) => {
                    if (e.buttonId == 0) {
                      log("Clicked pointer")
                      openExternalURL("https://cros.network")
                    } else if (e.buttonId == 1) {
                        teleportTo('-51,1')                        
                    } 
                  },
              {
                button: ActionButton.ANY,
                showFeedback: true,
                hoverText: "Click to visit site, Press E to visit the store.",
                distance: 15
              }
            )
          )
    }

    async displayAd() {
        executeTask(async () => { 
        log("getting ad content")
        this.adContent = await this.crosService.getAdToDisplay();

        if (this.adContent == null) {
            return false;
        }
        
        if (this.adContent.content_type == 'image') {
            try {
                

            this.material.albedoTexture = new Texture(this.getContentUrl(this.adContent))
            } catch (error) {
                return false;
            }
        } else if(this.adContent.content_type == 'video') {
            let videoTexture = new VideoTexture(new VideoClip(this.getContentUrl(this.adContent)))
            this.material.albedoTexture = videoTexture
        } else if(this.adContent.content_type == '3D') {
            this.removeComponent(GLTFShape);
            this.addComponent(new GLTFShape(this.adContent.content_url));
        } 
    })           
    }

    getContentUrl(adContent: AdContent): string {
        switch(this.adMaterialType) {
            case AdSpaceType.AdContent: return adContent.content_url;
            case AdSpaceType.QR: return adContent.qrCode_url;
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