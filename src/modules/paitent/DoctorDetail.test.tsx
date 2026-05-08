import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import DoctorDetail from './DoctorDetail'

describe('Doctor Detail UI', () => {
  test('doctor detail should render', () => {
    render(
      <BrowserRouter>
        <DoctorDetail />
      </BrowserRouter>
    )

    expect(
      screen.getByText(/bác sĩ|doctor/i)
    ).toBeInTheDocument()
  })
})