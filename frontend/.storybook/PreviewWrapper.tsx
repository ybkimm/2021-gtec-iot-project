import React, {useMemo} from 'react'
import { Story, StoryContext } from '@storybook/react'
import AppWrapper from '../src/AppWrapper'

const Wrapper = (Story: Story, ctx: StoryContext) => {
  const isDark = useMemo((): boolean => {
    const currentBackground = ctx.parameters.backgrounds.values
      .filter((v: {name: string, value: string}) =>
        v.value === ctx.globals.backgrounds?.value)
    return currentBackground.length > 0
      ? currentBackground[0].name === 'dark'
      : false
  }, [ctx.globals.backgrounds?.value])
  return (
    <AppWrapper colorScheme={isDark ? 'dark' : 'light'}>
      <Story />
    </AppWrapper>
  )
}
export default Wrapper
