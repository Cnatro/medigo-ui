import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Checkbox UI', () => {
  test('remember me checkbox can be clicked', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    const checkbox = screen.getByRole('checkbox')

    // ban đầu checked
    expect(checkbox).toBeChecked()

    // click bỏ check
    await userEvent.click(checkbox)

    expect(checkbox).not.toBeChecked()
  })
})