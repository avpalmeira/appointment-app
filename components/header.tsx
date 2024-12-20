import { User } from '@/types'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-sky-100 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl text-gray-700">Appointment App</h1>
        <div className="text-gray-700">Welcome, {user.name}</div>
      </div>
    </header>
  )
}

