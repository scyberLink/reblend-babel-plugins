import { act, render, waitFor } from 'reblend-testing-library'
import { useMutationObserver } from '..'
import { useCallbackRef } from '..'
import Reblend, { useEffect, useProps } from 'reblendjs'

describe('useMutationObserver', () => {
  let disconnentSpy: any
  beforeEach(async () => {
    disconnentSpy = jest.spyOn(MutationObserver.prototype, 'disconnect')
  })

  afterEach(async () => {
    disconnentSpy?.mockRestore()
  })

  it('should add a mutation observer', async () => {
    const teardown = jest.fn()
    const spy = jest.fn(() => teardown)

    function Wrapper(props) {
      const { item, ref } = useCallbackRef<HTMLElement>()

      const { setElement } = useMutationObserver(
        item,
        { attributes: true },
        spy,
      )

      useEffect(() => {
        if (item) {
          setElement(item)
        }
      }, [item])

      return <div ref={ref} {...props} />
    }

    const wrapper = await render(<Wrapper />)

    expect(spy).toHaveBeenCalledTimes(0)
    await wrapper.rerender(<Wrapper role="button" />)
    await Promise.resolve()
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            type: 'attributes',
            attributeName: 'role',
          }),
        ],
        expect.anything(),
      )
    })

    expect(spy).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          type: 'attributes',
          attributeName: 'role',
        }),
      ],
      expect.anything(),
    )
    // coverage on the teardown
    await wrapper.unmount()
  })

  it('should update config', async () => {
    const teardown = jest.fn()
    const spy = jest.fn(() => teardown)

    function Wrapper({ attributeFilter, ...props }: any) {
      const { item, ref } = useCallbackRef<HTMLElement>()

      const { setConfig, setElement } = useMutationObserver(
        item,
        { attributes: true, attributeFilter },
        spy,
      )

      useEffect(() => setElement(item), item)

      useProps<any>(({ current: { attributeFilter }, initial }) => {
        !initial && setConfig({ attributes: true, attributeFilter })
      })

      return <div ref={ref} {...props} />
    }

    const wrapper = await render(<Wrapper attributeFilter={['data-name']} />)

    await wrapper.rerender(
      <Wrapper attributeFilter={['data-name']} role="presentation" />,
    )

    await Promise.resolve()

    expect(spy).toHaveBeenCalledTimes(0)

    await wrapper.rerender(<Wrapper role="button" />)

    await Promise.resolve()
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            type: 'attributes',
            attributeName: 'role',
          }),
        ],
        expect.anything(),
      )
      expect(disconnentSpy).toHaveBeenCalledTimes(1)
    })

    await wrapper.unmount()

    expect(disconnentSpy).toHaveBeenCalledTimes(3)
  })
})
