import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

// The app has no marketing page (that lives in the separate AlphaVector site).
// Signed-in people go to their daily track; everyone else starts the flow.
export default async function RootPage() {
  const session = await getSession()
  redirect(session ? '/track' : '/start')
}
