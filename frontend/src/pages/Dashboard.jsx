import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const StatCard = ({ icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center`}>
      <i className={`fas ${icon} ${color} text-xl`}></i>
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    derniereHumeur: '--',
    niveauStress: '--',
    evaluations: 0,
    rendezVous: 0
  })

  const heure = new Date().getHours()
  const salutation = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {salutation}, {user?.prenom}
        </h1>
        <p className="text-gray-500 mt-1">Comment allez-vous aujourd'hui ?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon="fa-smile" label="Dernière humeur" value={stats.derniereHumeur} color="text-yellow-500" bg="bg-yellow-50"/>
        <StatCard icon="fa-heartbeat" label="Niveau stress" value={stats.niveauStress} color="text-red-500" bg="bg-red-50"/>
        <StatCard icon="fa-clipboard-check" label="Évaluations" value={stats.evaluations} color="text-purple-500" bg="bg-purple-50"/>
        <StatCard icon="fa-calendar-check" label="Rendez-vous" value={stats.rendezVous} color="text-green-500" bg="bg-green-50"/>
      </div>

      {/* Actions rapides */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: 'fa-clipboard-check', label: 'Faire une évaluation', desc: 'Questionnaire PHQ-9', color: 'bg-purple-500', link: '/evaluation' },
            { icon: 'fa-smile', label: 'Enregistrer mon humeur', desc: 'Suivi quotidien', color: 'bg-yellow-500', link: '/humeur' },
            { icon: 'fa-user-md', label: 'Voir les conseillers', desc: 'Prendre rendez-vous', color: 'bg-green-500', link: '/conseillers' },
          ].map((action, i) => (
            <a key={i} href={action.link}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center gap-4 group">
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition`}>
                <i className={`fas ${action.icon} text-white`}></i>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{action.label}</p>
                <p className="text-xs text-gray-400">{action.desc}</p>
              </div>
              <i className="fas fa-chevron-right ml-auto text-gray-300 group-hover:text-primary transition"></i>
            </a>
          ))}
        </div>
      </div>

      {/* Conseil du jour */}
      <div className="bg-gradient-to-r from-primary to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-lightbulb text-yellow-300 text-xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Conseil du jour</h3>
            <p className="text-purple-100 text-sm leading-relaxed">
              Prenez 5 minutes pour respirer profondément. La pleine conscience peut réduire le stress de 40%. Votre santé mentale est aussi importante que votre santé physique.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}