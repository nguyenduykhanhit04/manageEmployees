import { proxy } from '@/proxy';

// Mock Next.js server utilities
jest.mock('next/server', () => ({
  NextRequest: jest.fn((url: string) => ({
    nextUrl: new URL(url),
    // Add any other properties of NextRequest that are accessed in proxy.ts
  })),
  NextResponse: {
    next: jest.fn(() => ({ type: 'NextResponse.next' })),
    // Add any other properties/methods of NextResponse that are accessed
  },
}));

// Import the mocked NextRequest and NextResponse after mocking next/server
import { NextRequest, NextResponse } from 'next/server';

describe('Proxy Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return NextResponse.next() for protected routes', () => {
    const request = new NextRequest('http://localhost/employees/list');
    const response = proxy(request);
    expect(response).toEqual(NextResponse.next());
  });

  it('should return NextResponse.next() for auth routes (login)', () => {
    const request = new NextRequest('http://localhost/login');
    const response = proxy(request);
    expect(response).toEqual(NextResponse.next());
  });

  it('should return NextResponse.next() for auth routes (logout)', () => {
    const request = new NextRequest('http://localhost/logout');
    const response = proxy(request);
    expect(response).toEqual(NextResponse.next());
  });

  it('should return NextResponse.next() for other routes', () => {
    const request = new NextRequest('http://localhost/some-other-page');
    const response = proxy(request);
    expect(response).toEqual(NextResponse.next());
  });
});
