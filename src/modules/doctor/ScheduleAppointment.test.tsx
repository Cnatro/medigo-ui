import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Schedule Appointment UI', () => {
  test('schedule appointment should render', () => {
    render(
      <BrowserRouter>
        <ScheduleAppointment />
      </BrowserRouter>
    )

    expect(
      screen.getByText(/quản lý lịch khám/i)
    ).toBeInTheDocument()
  })
})