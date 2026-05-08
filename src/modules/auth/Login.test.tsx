import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import LoginPage from './LoginPage'
import { AuthProvider } from '../../shared/components/AuthContext'

describe('Login Page UI', () => {
    test('render login form', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        )

        const emailInput = screen.getByPlaceholderText(/email/i)

        const passwordInput = screen.getByPlaceholderText('********')

        const loginButton = screen.getByRole('button', {
            name: /đăng nhập/i,
        })

        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(loginButton).toBeInTheDocument()
    })
})