// app/onboarding/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { OnboardingClient } from './onboarding-client'

export default async function OnboardingPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { careerLevelId: true },
  })

  // Already onboarded — send to the app
  if (user?.careerLevelId) redirect('/')

  // Fetch career levels for the server render (avoids flash)
  const careerLevels = await db.careerLevel.findMany({
    select: { id: true, name: true, order: true },
    orderBy: { order: 'asc' },
  })

  return <OnboardingClient careerLevels={careerLevels} />
}
