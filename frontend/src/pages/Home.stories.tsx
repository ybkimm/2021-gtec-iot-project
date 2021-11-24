import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import Home from './Home'

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'Pages/Home',
  component: Home,
  argTypes: {
  }
} as ComponentMeta<typeof Home>

export const Default: ComponentStory<typeof Home> = args => {
  return (
    <Home {...args} />
  )
}
Default.args = {}
