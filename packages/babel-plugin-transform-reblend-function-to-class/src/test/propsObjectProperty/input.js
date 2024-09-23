/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isCallable } from '../../common/utils'
import { BaseComponent, ReblendRenderingException } from '../../internal/BaseComponent'
import { Reblend } from '../../internal/Reblend'

//@ReblendComponent
function TryCatchError(
  thiz,
  {
    children = ((_error) => <>{''}</>),
  }
) {
  thiz.renderingErrorHandler = (e) => {
    thiz.renderingError = e
    //if (!this.stateEffectRunning && this.attached) {
    //Promise.resolve().then(() => {
    thiz.onStateChange()
    //})
    //}
  }

  const view = () => {
    const arr = []
    for (const child of children) {
      if (isCallable(child)) {
        arr.push((child)(thiz.renderingError))
      } else {
        arr.push(child)
      }
    }

    thiz.renderingError = null
    return arr
  }
  return <div>{view()}</div>
}

export { TryCatchError }
