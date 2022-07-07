import { ButtonType } from "./buttonType";
import { CrosEntity } from "./crosEntity";

export class crosButton extends Entity {
    constructor(private buttonType: ButtonType, transform: Transform, private crosEntity: CrosEntity) {
        super();
       // const myMaterial = new Material()
       // myMaterial.albedoColor = Color3.Blue()
       // myMaterial.metallic = 0.9
       // myMaterial.roughness = 0.1
       // this.addComponent(myMaterial)
        const myMaterial = new Material()

        myMaterial.albedoColor = new Color3(0, 0, 0) // ALPHATEST
        myMaterial.alphaTest = 0.3

       // this.addComponent(new PlaneShape())
        this.addComponent(transform)
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
                distance: 20
              }
            )
          )
        
        this.addComponent(new TextShape(buttonType == ButtonType.VisitWebSite ? "Buy Now" : "Visit Store"))
        
    }    
}