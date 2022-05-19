import { ShapeType } from "./shapeTypes";
import { AdContent } from "./adContent";
import * as utils from '@dcl/ecs-scene-utils';
import { getAdSPTokens } from "../services/adServe";
import { AdSpaceType } from "./adSpaceType";

export class CrosAdEntity extends Entity {
    material: Material = new Material();
    entryTime: number = 0;
    timeSpent: number = 0;

    constructor(shapeType: ShapeType, transform: Transform, public adMaterialType: AdSpaceType) {
        super();
        this.adMaterialType = adMaterialType;
        this.addComponent(this.getShapes(shapeType));
        if (shapeType != ShapeType.Gltf){
            this.addComponent(this.material);
            // this.addComponent(new Billboard());
        }
        this.addComponent(transform);
        this.addComponent(
            new utils.TriggerComponent(new utils.TriggerSphereShape(30), {
              onCameraEnter: async () => {
                  let adContent = await getAdSPTokens();
                  this.entryTime = Date.now();
                  log("triggered entry event");
                //   log(adContent)
                  if (adContent && adContent.content_url) {
                    this.displayAd(adContent, this.getComponent(Transform));
                  }
              },
              onCameraExit: async () => {
                  this.timeSpent = Date.now() - this.entryTime;
                  log("triggered exit event");
                  log("time spent here: ", this.timeSpent);
              }
            })
        )
    }

    displayAd(adContent: AdContent, transform: Transform) {
        if (adContent.content_type == 'image') {
            this.material.albedoTexture = new Texture(this.getContentUrl(adContent))
        } else if(adContent.content_type == 'video') {
          //  let videoTexture = new VideoTexture(this.getContentUrl())
        } else if(adContent.content_type == '3D') {
            this.removeComponent(GLTFShape);
            this.removeComponent(Transform);
            this.addComponent(new GLTFShape(adContent.content_url));
            this.addComponent(transform);
        }    
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
            case ShapeType.Gltf: return new GLTFShape('');
            default: return new PlaneShape();
        }
    }    
}