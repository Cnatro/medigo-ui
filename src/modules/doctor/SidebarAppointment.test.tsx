import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

describe('Doctor Sidebar Appointment UI', () => {
  test('appointment menu should render correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    const appointmentLink = screen.getByRole('link', {
      name: /cuộc hẹn/i,
    })

    expect(appointmentLink).toBeInTheDocument()

    expect(appointmentLink).toHaveAttribute(
      'href',
      '/doctor/schedule-appointment'
    )
  })
})