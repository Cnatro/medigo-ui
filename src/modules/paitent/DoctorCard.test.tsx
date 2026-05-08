import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { BrowserRouter } from 'react-router-dom'

import DoctorCard from './DoctorCard'

describe('Doctor Card UI', () => {
    test('doctor card should render doctor information', () => {
        render(
            <BrowserRouter>
                <DoctorCard
                    doctor={{
                        id: '1',
                        name: 'Nguyễn Văn A',
                        clinic: 'Bệnh viện Medigo',
                        experience: 5,
                        rating: 5,
                        reviewCount: 120,
                        acceptsInsurance: true,
                        languages: ['Tiếng Việt'],
                        specialties: [
                            {
                                id: '1',
                                name: 'Tim mạch',
                                price: 500000
                            }
                        ]
                    } as any}
                />
            </BrowserRouter>
        )

        expect(
            screen.getByText(/nguyễn văn a/i)
        ).toBeInTheDocument()

        expect(
            screen.getAllByText(/tim mạch/i).length
        ).toBeGreaterThan(0)
    })
})