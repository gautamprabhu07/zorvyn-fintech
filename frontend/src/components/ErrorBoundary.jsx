import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <section className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">Please refresh the page</p>
            <button type="button" onClick={this.handleReload} className="ui-button-primary mt-5">
              Reload Page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
