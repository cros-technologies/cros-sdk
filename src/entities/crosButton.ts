import { ButtonType } from "./buttonType";
import { CrosEntity } from "./crosEntity";

export class CrosButton extends Entity {
    constructor(private buttonType: ButtonType, transform: Transform, private crosEntity: CrosEntity) {
        super();
       // const myMaterial = new Material()
       // myMaterial.albedoColor = Color3.Blue()
       // myMaterial.metallic = 0.9
       // myMaterial.roughness = 0.1
       // this.addComponent(myMaterial)
        this.addComponent(transform)
        this.addComponent(new TextShape(buttonType == ButtonType.VisitWebSite ? "Buy Now" : "Visit Store"))
        this.addComponent(
            new OnPointerDown(
                (e) => {
                    if (buttonType == ButtonType.VisitWebSite) {
                      openExternalURL("https://cros.network")  
                    } else {
                        teleportTo('-51,1')
                    }                     
                  },
              {
                button: ActionButton.PRIMARY,
                showFeedback: true,
                hoverText: "Click to buy now",
                distance: 15
              }
            )
          )
        
    }    
}