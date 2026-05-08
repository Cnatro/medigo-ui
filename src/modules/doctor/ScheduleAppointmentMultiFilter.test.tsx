import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Multi Filter UI', () => {
  test('user can change multiple filters', () => {
    render(
      <BrowserRouter>
        <ScheduleAppointment />
      </BrowserRouter>
    )

    const selects = screen.getAllByRole('combobox')

    const yearSelect = selects[0]
    const weekSelect = selects[1]
    const specialtySelect = selects[2]

    fireEvent.change(yearSelect, {
      target: {
        value: '2026'
      }
    })

    fireEvent.change(weekSelect, {
      target: {
        value: '10'
      }
    })

    fireEvent.change(specialtySelect, {
      target: {
        value: 'tim-mach'
      }
    })

    expect(yearSelect).toHaveValue('2026')

    expect(weekSelect).toHaveValue('10')

    expect(specialtySelect).toHaveValue('tim-mach')
  })
})