import gql from 'graphql-tag'

export const ENS_SUGGESTIONS = gql`
  query lookup($name: String!, $amount: Int!) {
    domains(
      first: $amount
      where: { name_starts_with: $name, resolvedAddress_not: null, name_ends_with: ".eth" }
      orderBy: name
    ) {
      name
      resolver {
        addr {
          id
        }
      }
    }
  }
`
