import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RecoilRoot } from 'recoil';
import RecoilizeDebugger from 'recoilize';
import ErrorBoundary from './error.tsx';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      {/* Debug here!!! */}
        <RecoilizeDebugger />
        <ErrorBoundary>
          <React.Suspense fallback={<div>Loading....</div>}>
            <App />
        </React.Suspense>
        </ErrorBoundary>
      </RecoilRoot>
  </React.StrictMode>,
)
