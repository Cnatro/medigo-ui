import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Forgot Password UI', () => {
  test('forgot password link should render', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    const forgotPasswordLink = screen.getByRole('link', {
      name: /quên mật khẩu/i,
    })

    expect(forgotPasswordLink).toBeInTheDocument()
  })
})