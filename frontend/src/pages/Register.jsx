import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form.nom, form.prenom, form.email, form.mot_de_passe)
      setSuccess('Compte créé ! Redirection...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription')
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
          Rejoignez des milliers d'étudiants qui prennent soin de leur santé mentale
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { icon: 'fa-shield-alt', label: 'Confidentiel' },
            { icon: 'fa-clock', label: 'Disponible 24h/7j' },
            { icon: 'fa-heart', label: 'Bienveillant' },
            { icon: 'fa-graduation-cap', label: 'Pour étudiants' },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
              <i className={`fas ${item.icon} text-2xl mb-2 block`}></i>
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau droit */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Créer un compte ✨</h2>
            <p className="text-gray-500 mt-2">Rejoignez MindCare aujourd'hui</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2 text-sm">
              <i className="fas fa-check-circle"></i> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Nom</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                  <input
                    type="text" placeholder="Dupont"
                    value={form.nom}
                    onChange={e => setForm({ ...form, nom: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Prénom</label>
                <input
                  type="text" placeholder="Jean"
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Adresse email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email" placeholder="votre@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Mot de passe</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={form.mot_de_passe}
                  onChange={e => setForm({ ...form, mot_de_passe: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2"
            >
              {loading
                ? <><i className="fas fa-spinner fa-spin"></i> Inscription...</>
                : <><i className="fas fa-user-plus"></i> Créer mon compte</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}