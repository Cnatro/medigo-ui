import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Schedule Filter UI', () => {
  test('year dropdown should render', () => {
    render(
      <BrowserRouter>
        <ScheduleAppointment />
      </BrowserRouter>
    )

    expect(
      screen.getByText('2025')
    ).toBeInTheDocument()
  })
})