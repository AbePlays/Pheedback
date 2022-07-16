import { useMatches } from '@remix-run/react'

export default function useRouteData<T>(routeId: string): T | undefined {
  const matches = useMatches()
  const data = matches.find((match) => match.id === routeId)?.data

  return data as T | undefined
}
