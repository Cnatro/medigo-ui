import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

describe('Doctor Sidebar UI', () => {
  test('render sidebar menu', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    )

    // kiểm tra sidebar render
    expect(screen.getByText(/tổng quan/i)).toBeInTheDocument()
  })
})