import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Content UI', () => {
  test('render login texts and links', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    )

    // kiểm tra text MediGo
    expect(screen.getByText(/medigo/i)).toBeInTheDocument()

    // kiểm tra nút đăng nhập
    expect(
      screen.getByRole('button', {
        name: /đăng nhập/i,
      })
    ).toBeInTheDocument()

    // kiểm tra link đăng ký
    expect(
      screen.getByRole('link', {
        name: /đăng ký ngay/i,
      })
    ).toBeInTheDocument()
  })
})