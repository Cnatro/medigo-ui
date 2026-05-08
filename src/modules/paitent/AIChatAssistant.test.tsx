import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import AIChatAssistant from './AIChatAssistant'

describe('AI Chat Assistant UI', () => {
  test('user can type message', () => {
    render(
      <AIChatAssistant
        onClose={() => {}}
      />
    )

    const input = screen.getByRole('textbox')

    fireEvent.change(input, {
      target: {
        value: 'Xin chào AI'
      }
    })

    expect(input).toHaveValue('Xin chào AI')
  })
})