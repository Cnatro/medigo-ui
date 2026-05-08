import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom/vitest'

import { QueueList } from './QueueList'

describe('Doctor QueueList UI', () => {
  test('queue list should render', () => {
    render(
      <QueueList
        queueItems={[]}
      />
    )

    expect(
      screen.getByText(/hàng chờ hôm nay/i)
    ).toBeInTheDocument()
  })
})