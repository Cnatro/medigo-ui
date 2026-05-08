import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

describe('Doctor Sidebar Patient UI', () => {
  test('patient profile menu should render correctly', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    const patientLink = screen.getByRole('link', {
      name: /hồ sơ bệnh nhân/i,
    })

    expect(patientLink).toBeInTheDocument()

    expect(patientLink).toHaveAttribute(
      'href',
      '/doctor/patients'
    )
  })
})