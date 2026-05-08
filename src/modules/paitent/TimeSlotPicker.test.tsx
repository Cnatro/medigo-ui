import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import TimeSlotPicker from './TimeSlotPicker'

describe('Time Slot Picker UI', () => {
  test('loading schedule should render', () => {
    render(
      <TimeSlotPicker
        doctorSpecialtyId="1"
        weekOffset={0}
        getWeek={() => ({
          monday: new Date(),
          sunday: new Date()
        })}
      />
    )

    expect(
      screen.getByText(/đang tải lịch khám/i)
    ).toBeInTheDocument()
  })
})