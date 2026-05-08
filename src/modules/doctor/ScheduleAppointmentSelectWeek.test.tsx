import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Select Week UI', () => {
  test('user can select another week', () => {
    render(
      <BrowserRouter>
        <ScheduleAppointment />
      </BrowserRouter>
    )

    const selects = screen.getAllByRole('combobox')

    const weekSelect = selects[1]

    fireEvent.change(weekSelect, {
      target: {
        value: '10'
      }
    })

    expect(weekSelect).toHaveValue('10')
  })
})