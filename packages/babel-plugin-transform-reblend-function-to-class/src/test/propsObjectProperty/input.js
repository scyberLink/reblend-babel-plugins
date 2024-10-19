/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isCallable } from '../../common/utils'
import { BaseComponent, ReblendRenderingException } from '../../internal/BaseComponent'
import { Reblend } from '../../internal/Reblend'

//@ReblendComponent
function TryCatchError(  
  {
    children = ((_error) => <>{''}</>),
  },thisComponent
) {
  thisComponent.renderingErrorHandler = (e) => {
    thisComponent.renderingError = e
    //if (!this.stateEffectRunning && this.attached) {
    //Promise.resolve().then(() => {
    thisComponent.onStateChange()
    //})
    //}
  }

  const view = () => {
    const arr = []
    for (const child of children) {
      if (isCallable(child)) {
        arr.push((child)(thisComponent.renderingError))
      } else {
        arr.push(child)
      }
    }

    thisComponent.renderingError = null
    return arr
  }
  return <div>{view()}</div>
}

export { TryCatchError }
