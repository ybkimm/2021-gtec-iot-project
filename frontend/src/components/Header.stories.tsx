import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import favicon from '../assets/favicon.png'
import Header from './Header'

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    branding: {
      control: { disable: true }
    },
    nav: {
      control: { disable: true }
    },
    username: {
      control: 'string'
    },
    disableTablet: {
      control: 'boolean'
    },
    disableDesktop: {
      control: 'boolean'
    }
  }
} as ComponentMeta<typeof Header>

const Template: ComponentStory<typeof Header> = args => {
  return (
    <Header {...args} />
  )
}

export const SignedIn = Template.bind({})
SignedIn.args = {
  branding: (
    <img style={{ display: 'block' }} height="100%" src={favicon} alt="logo" />
  ),
  nav: (
    <>
      <a href="http://example.com/">MenuA</a>
      <a href="http://example.com/">MenuB</a>
    </>
  ),
  username: 'Admin'
}

export const NotSignedIn = Template.bind({})
NotSignedIn.args = {
  branding: (
    <img style={{ display: 'block' }} height="100%" src={favicon} alt="logo" />
  ),
  nav: (
    <>
      <a href="http://example.com/">MenuA</a>
      <a href="http://example.com/">MenuB</a>
    </>
  )
}
