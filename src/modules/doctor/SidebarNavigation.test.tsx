import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

describe('Doctor Sidebar Navigation UI', () => {
  test('schedule work link should navigate correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    const scheduleLink = screen.getByRole('link', {
      name: /lịch làm việc/i,
    })

    expect(scheduleLink).toBeInTheDocument()

    expect(scheduleLink).toHaveAttribute(
      'href',
      '/doctor/schedule-work'
    )
  })
})