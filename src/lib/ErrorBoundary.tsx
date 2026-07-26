import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-black text-white mb-1">Algo deu errado</h2>
          <p className="text-sm text-zinc-500 max-w-xs mb-6">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-black font-extrabold px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" /> Recarregar
          </button>
          {this.state.error && (
            <p className="text-xs text-zinc-700 mt-4 max-w-xs truncate">{this.state.error.message}</p>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
