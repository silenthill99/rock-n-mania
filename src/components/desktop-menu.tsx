import type { Menu } from '#/types'
import { Link } from '@tanstack/react-router'
import { authClient } from '../../auth-client.ts'

type Props = {
  menu: Menu[]
}

const DesktopMenu = ({menu}: Props) => {
  const {data: session} = authClient.useSession()
  return (
    <nav className={"hidden lg:flex justify-between items-center"}>
      <ul>
        {menu.map((item, index) => (
          <li key={index}>
            <Link to={item.url} activeProps={{className: "underline"}}>{item.label}</Link>
          </li>
        ))}
      </ul>
      {session?.user ? (
        <Link to={"/"}>Tableau de bord</Link>
      ) : (
        <ul className={"flex gap-2"}>
          <li><Link to={"/login"}>Se connecter</Link></li>
          <li><Link to={"/register"}>Créer un compte</Link></li>
        </ul>
      )}
    </nav>
  )
}

export default DesktopMenu