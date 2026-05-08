import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Input UI', () => {
  test('user can type email and password', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText(/email/i)

    const passwordInput = screen.getByPlaceholderText('********')

    await userEvent.type(emailInput, 'test@gmail.com')

    await userEvent.type(passwordInput, '123456')

    expect(emailInput).toHaveValue('test@gmail.com')

    expect(passwordInput).toHaveValue('123456')
  })
})