import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Banner, { Props } from './item'

const banner = new Banner()
const spawner = new Spawner<Props>(banner)

spawner.spawn(
   'banner',
   new Transform({
       position: new Vector3(4, 0, 8)
   }),
   {
    assetId: '8',
  }
)