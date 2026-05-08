import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { StatCard } from './StatCard'

describe('Doctor StatCard UI', () => {
  test('stat card should render correctly', () => {
    render(
      <StatCard
        value="120"
        label="Tổng bệnh nhân"
        subtext="Hôm nay"
        color="blue"
      />
    )

    expect(
      screen.getByText(/tổng bệnh nhân/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText('120')
    ).toBeInTheDocument()

    expect(
      screen.getByText(/hôm nay/i)
    ).toBeInTheDocument()
  })
})