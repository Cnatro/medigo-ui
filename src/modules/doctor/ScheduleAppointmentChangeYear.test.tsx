import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import ScheduleAppointment from './ScheduleAppointment'

describe('Doctor Schedule Change Year UI', () => {
    test('user can change year filter', () => {
        render(
            <BrowserRouter>
                <ScheduleAppointment />
            </BrowserRouter>
        )

        const selects = screen.getAllByRole('combobox')

        const yearSelect = selects[0]

        fireEvent.change(yearSelect, {
            target: {
                value: '2026'
            }
        })

        expect(yearSelect).toHaveValue('2026')
    })
})