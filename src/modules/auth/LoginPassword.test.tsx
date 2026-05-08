import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Password UI', () => {
  test('password input should have password type', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    const passwordInput = screen.getByPlaceholderText('********')

    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})