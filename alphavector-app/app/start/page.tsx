import type { Metadata } from 'next'
import StartClient from '@/components/alphavector/StartClient'

export const metadata: Metadata = { title: 'Fix your position · AlphaVector' }

export default function StartPage() { return <StartClient /> }
