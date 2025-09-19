import { render, screen } from '@testing-library/react'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders Home and current page crumb', () => {
    render(<Breadcrumbs items={[{ label: 'Launches', href: '/launches' }, { label: 'Falcon 9' }]} />)

    // Home link always present
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()

    // Last item has aria-current=page and is not a link
    const current = screen.getByText('Falcon 9')
    expect(current).toBeInTheDocument()
    expect(current).toHaveAttribute('aria-current', 'page')
  })
})

