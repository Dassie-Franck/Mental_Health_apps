import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { path: '/dashboard', icon: 'fa-home', label: 'Tableau de bord' },
  { path: '/evaluation', icon: 'fa-clipboard-check', label: 'Auto-évaluation' },
  { path: '/humeur', icon: 'fa-smile', label: 'Suivi humeur' },
  { path: '/conseillers', icon: 'fa-user-md', label: 'Conseillers' },
  { path: '/rendez-vous', icon: 'fa-calendar-alt', label: 'Rendez-vous' },
  { path: '/profil', icon: 'fa-user', label: 'Mon profil' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="w-64 min-h-screen bg-white shadow-lg flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <i className="fas fa-brain text-white"></i>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg">MindCare</h1>
            <p className="text-xs text-gray-400">Santé mentale</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="p-4 mx-3 mt-4 bg-purple-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-primary text-white shadow-md shadow-purple-200'
                : 'text-gray-600 hover:bg-purple-50 hover:text-primary'
            }`}
          >
            <i className={`fas ${item.icon} w-4`}></i>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <i className="fas fa-sign-out-alt w-4"></i>
          Déconnexion
        </button>
      </div>
    </div>
  )
}