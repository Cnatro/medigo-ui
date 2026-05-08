import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Validation UI', () => {
  test('click login without input', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    const loginButton = screen.getByRole('button', {
      name: /đăng nhập/i,
    })

    await userEvent.click(loginButton)

    const emailInput = screen.getByPlaceholderText(/email/i)

    const passwordInput = screen.getByPlaceholderText('********')

    expect(emailInput).toBeInTheDocument()

    expect(passwordInput).toBeInTheDocument()
  })
})