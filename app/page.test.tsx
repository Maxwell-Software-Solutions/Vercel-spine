import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Page />);
    const heading = screen.getByText(/Vercel Spine/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the Vercel triangle', () => {
    render(<Page />);
    const triangle = screen.getByAltText(/Vercel Triangle/i);
    expect(triangle).toBeInTheDocument();
    expect(triangle).toHaveAttribute('src', '/vercel-triangle.svg');
  });

  it('renders the subtitle', () => {
    render(<Page />);
    expect(screen.getByText(/Next.js Full-Stack Template/i)).toBeInTheDocument();
  });

  it('renders the Features section', () => {
    render(<Page />);
    expect(screen.getByText(/🚀 Features/i)).toBeInTheDocument();
    expect(screen.getByText(/Next.js 14 App Router/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailwind CSS/i)).toBeInTheDocument();
    expect(screen.getByText(/GraphQL with Apollo/i)).toBeInTheDocument();
  });

  it('renders the Testing section', () => {
    render(<Page />);
    expect(screen.getByText(/✅ Testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Jest \(95% coverage\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Playwright E2E/i)).toBeInTheDocument();
    expect(screen.getByText(/Lighthouse CI/i)).toBeInTheDocument();
    expect(screen.getByText(/Unified test command/i)).toBeInTheDocument();
  });

  it('renders the Tools section', () => {
    render(<Page />);
    expect(screen.getByText(/🛠️ Tools/i)).toBeInTheDocument();
    expect(screen.getByText(/Prisma ORM/i)).toBeInTheDocument();
    expect(screen.getByText(/NextAuth.js/i)).toBeInTheDocument();
    expect(screen.getByText(/Plop.js generators/i)).toBeInTheDocument();
    expect(screen.getByText(/TurboRepo/i)).toBeInTheDocument();
  });

  it('feature titles are clickable links with correct attributes', () => {
    render(<Page />);
    
    // Check Features link
    const featuresLink = screen.getByRole('link', { name: /🚀 Features/i });
    expect(featuresLink).toBeInTheDocument();
    expect(featuresLink).toHaveAttribute('href', 'https://github.com/Maxwell-Software-Solutions/Vercel-spine#-features');
    expect(featuresLink).toHaveAttribute('target', '_blank');
    expect(featuresLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check Testing link
    const testingLink = screen.getByRole('link', { name: /✅ Testing/i });
    expect(testingLink).toBeInTheDocument();
    expect(testingLink).toHaveAttribute('href', 'https://github.com/Maxwell-Software-Solutions/Vercel-spine#-testing');
    expect(testingLink).toHaveAttribute('target', '_blank');
    expect(testingLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Check Tools link
    const toolsLink = screen.getByRole('link', { name: /🛠️ Tools/i });
    expect(toolsLink).toBeInTheDocument();
    expect(toolsLink).toHaveAttribute('href', 'https://github.com/Maxwell-Software-Solutions/Vercel-spine#-code-generation-with-plop');
    expect(toolsLink).toHaveAttribute('target', '_blank');
    expect(toolsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('feature links have proper focus styles for accessibility', () => {
    render(<Page />);
    
    const featuresLink = screen.getByRole('link', { name: /🚀 Features/i });
    expect(featuresLink).toHaveClass('focus:outline-none');
    expect(featuresLink).toHaveClass('focus:ring-2');
    expect(featuresLink).toHaveClass('focus:ring-blue-500');
  });
});
