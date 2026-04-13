'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

export class FormErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-3 rounded-lg border border-error/20 bg-error-bg p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-error" />
          <p className="text-sm text-error">
            {this.props.fallbackMessage ?? 'Beim Laden des Formulars ist ein Fehler aufgetreten. Bitte laden Sie die Seite neu.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
