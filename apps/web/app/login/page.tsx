import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "./_components/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/vercel.svg" alt="Wealthee Logo" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold text-blue-600">Wealthee</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-blue-600 bg-opacity-10">
          <div className="flex h-full items-center justify-center p-12">
            <div className="max-w-2xl rounded-xl bg-white bg-opacity-90 p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900">Manage your wealth with confidence</h3>
              <p className="mt-2 text-gray-600">
                Track your investments, monitor performance, and connect with your portfolio manager all in one place.
              </p>
              <div className="mt-6 flex gap-4">
                <div className="rounded-md bg-blue-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Real-time performance tracking</h4>
                  <p className="text-sm text-gray-600">Monitor your portfolio performance with up-to-date market data</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="rounded-md bg-green-50 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Secure account protection</h4>
                  <p className="text-sm text-gray-600">Bank-level security to safeguard your financial data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

