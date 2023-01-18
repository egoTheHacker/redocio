
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { ReactNode } from 'react'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
})

type propType = {
    children?: ReactNode
}

export function APIProvider({children}: propType): JSX.Element {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}
