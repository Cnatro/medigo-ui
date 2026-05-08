import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Dermatology Filter UI', () => {
  test('user can choose dermatology specialty', () => {
    render(
      <BrowserRouter>
        <ScheduleAppointment />
      </BrowserRouter>
    )

    const selects = screen.getAllByRole('combobox')

    const specialtySelect = selects[2]

    fireEvent.change(specialtySelect, {
      target: {
        value: 'da-lieu'
      }
    })

    expect(specialtySelect).toHaveValue('da-lieu')
  })
})