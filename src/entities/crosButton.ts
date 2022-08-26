import { ButtonType } from "../enums/buttonType";
import { CrosEntity } from "./crosEntity";

export class crosButton extends Entity {
    constructor(private buttonType: ButtonType, transform: Transform, private crosEntity: CrosEntity) {
        super();
        const myMaterial = new Material()

        myMaterial.albedoColor = new Color3(0, 0, 0)
        myMaterial.alphaTest = 0.3

        this.addComponent(transform)
        this.addComponent(
            new OnPointerDown(
                (e) => {
                    if (buttonType == ButtonType.VisitWebSite) {
                      openExternalURL("")  
                    } else {
                        teleportTo('')
                    }                     
                  },
              {
                button: ActionButton.PRIMARY,
                showFeedback: true,
                hoverText: "Click to buy now",
                distance: 20
              }
            )
          )
        
        this.addComponent(new TextShape(buttonType == ButtonType.VisitWebSite ? "Buy Now" : "Visit Store"))
        
    }    
}