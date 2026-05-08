import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Navigation UI', () => {
  test('register link points to register page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    const registerLink = screen.getByRole('link', {
      name: /đăng ký ngay/i,
    })

    expect(registerLink).toBeInTheDocument()

    expect(registerLink).toHaveAttribute('href', '/register')
  })
})