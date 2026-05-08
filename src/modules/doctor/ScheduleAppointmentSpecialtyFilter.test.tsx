import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Specialty Filter UI', () => {
  test('user can change specialty filter', () => {
    render(
      <BrowserRouter>
        <ScheduleAppointment />
      </BrowserRouter>
    )

    const selects = screen.getAllByRole('combobox')

    const specialtySelect = selects[2]

    fireEvent.change(specialtySelect, {
      target: {
        value: 'tim-mach'
      }
    })

    expect(specialtySelect).toHaveValue('tim-mach')
  })
})