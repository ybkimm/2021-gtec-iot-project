import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import Card, { CardProps } from './Card'

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
  }
} as ComponentMeta<typeof Card>

export const Default: ComponentStory<typeof Card> = args => {
  return (
    <Card {...args}>
      <div style={{ padding: '1rem' }}>The Card</div>
    </Card>
  )
}
Default.args = {} as CardProps

export const WithMedia: ComponentStory<typeof Card> = args => {
  return (
    <Card {...args}>
      <iframe
        style={{ display: 'block', width: '100%', minHeight: '400px' }}
        src="https://www.youtube-nocookie.com/embed/tuWw5EQPGlc"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Card>
  )
}
WithMedia.args = {} as CardProps
