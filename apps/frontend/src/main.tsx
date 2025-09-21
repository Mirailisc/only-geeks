import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client/react'
import { client } from './lib/apollo.ts'
import { store } from './store/index.ts'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
)
