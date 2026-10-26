import { createFileRoute } from '@tanstack/react-router'
import { GuitarElectric } from "#/components/guitar-electric"

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Bienvenue sur Rock'n'Mania</h1>
      <p className="mt-4 text-lg flex items-center gap-2">
        Vivez au maximum votre passion pour l'univers du Rock'n'roll{' '}
        <GuitarElectric />
      </p>
    </div>
  )
}
