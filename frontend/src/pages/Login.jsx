import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', mot_de_passe: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.mot_de_passe)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-poppins">

      {/* Panneau gauche */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-purple-800 flex-col justify-center items-center text-white p-12">
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6">
          <i className="fas fa-brain text-4xl"></i>
        </div>
        <h1 className="text-4xl font-bold mb-4">MindCare</h1>
        <p className="text-purple-200 text-center text-lg leading-relaxed max-w-sm">
          Votre plateforme de suivi de santé mentale pour étudiants
        </p>
        <div className="mt-12 space-y-4 w-full max-w-sm">
          {[
            { icon: 'fa-clipboard-check', text: 'Auto-évaluation psychologique' },
            { icon: 'fa-chart-line', text: 'Suivi du stress et de l\'humeur' },
            { icon: 'fa-user-md', text: 'Mise en relation avec des conseillers' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <i className={`fas ${item.icon} text-purple-200`}></i>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Bon retour 👋</h2>
            <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Adresse email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Mot de passe</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.mot_de_passe}
                  onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition bg-gray-50"
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin"></i> Connexion...</>
                : <><i className="fas fa-sign-in-alt"></i> Se connecter</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}