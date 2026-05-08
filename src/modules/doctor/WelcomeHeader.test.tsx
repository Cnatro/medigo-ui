import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { WelcomeHeader } from './WelcomeHeader'

describe('Doctor Welcome Header UI', () => {
    test('welcome header should render', () => {
        render(
            <WelcomeHeader
                doctor={{
                    id: '1',
                    full_name: 'Dr Test',
                    phone: '0123456789',
                    email: 'doctor@test.com',
                    role: 'doctor',
                    profile: {} as any
                }}
                logout={() => { }}
            />
        )

        expect(screen.getByText(/chào/i)).toBeInTheDocument()
    })
})