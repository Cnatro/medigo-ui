import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

describe('Doctor Sidebar Settings UI', () => {
  test('settings menu should render correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    const settingsLink = screen.getByRole('link', {
      name: /cài đặt/i,
    })

    expect(settingsLink).toBeInTheDocument()

    expect(settingsLink).toHaveAttribute(
      'href',
      '/doctor/settings'
    )
  })
})