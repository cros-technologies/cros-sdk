export declare class TriggerBoxShape {
  size: Vector3;
  position: Vector3;
  constructor(size?: Vector3, position?: Vector3);
}

export declare class TriggerSphereShape {
  radius: number;
  position: Vector3;
  constructor(radius?: number, position?: Vector3);
}

export declare type TriggerData = {
  /**
   * layer of the Trigger, useful to discriminate between trigger events. You can set multiple layers by using a | symbol.
   */
  layer?: number;
  /**
   * against which layers to check collisions
   */
  triggeredByLayer?: number;
  /**
   * callback when an entity of a valid layer enters the trigger area
   */
  onTriggerEnter?: (entity: Entity) => void;
  /**
   * callback when an entity of a valid layer leaves the trigger area
   */
  onTriggerExit?: (entity: Entity) => void;
  /**
   * callback when the player enters the trigger area
   */
  onCameraEnter?: () => void;
  /**
   * callback when the player leaves the trigger area
   */
  onCameraExit?: () => void;
  /**
   * when true makes the trigger area visible for debug purposes.
   */
  enableDebug?: boolean;
};


export declare class TriggerComponent {
  /**
   * Is the trigger enabled? If false, the associated functions aren't triggered.
   */
  enabled: boolean;
  /**
   * shape of the collider
   */
  shape: TriggerBoxShape | TriggerSphereShape;
  /**
   * bit layer of the Tigger (usefull to discriminate between trigger events)
   */
  layer: number;
  /**
   * against which layer are we going to check trigger's collisions
   */
  triggeredByLayer: number;
  /**
   * callback when trigger is entered
   */
  onTriggerEnter?: (entity: Entity) => void;
  /**
   * callback when trigger is exit
   */
  onTriggerExit?: (entity: Entity) => void;
  /**
   * callback when trigger is entered
   */
  onCameraEnter?: () => void;
  /**
   * callback when trigger is exit
   */
  onCameraExit?: () => void;
  /**
   * get if debug is enabled
   */
  get debugEnabled(): boolean;
  private _debugEnabled;
  /**
   * @param shape - shape of the triggering collider area
   * @param data - An object with additional parameters for the trigger component
   */
  constructor(shape: TriggerBoxShape | TriggerSphereShape, data?: TriggerData);
}