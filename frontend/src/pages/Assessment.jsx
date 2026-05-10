import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'

const niveaux = {
  vert: { label: 'Minimal', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-400', icon: 'fa-smile', desc: 'Pas de dépression significative détectée.' },
  orange: { label: 'Léger à Modéré', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-400', icon: 'fa-meh', desc: 'Des symptômes légers à modérés sont présents. Un suivi est recommandé.' },
  rouge: { label: 'Sévère', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-400', icon: 'fa-frown', desc: 'Des symptômes sévères sont détectés. Veuillez consulter un conseiller.' },
}

const options = [
  { value: 0, label: 'Jamais' },
  { value: 1, label: 'Plusieurs jours' },
  { value: 2, label: 'Plus de la moitié du temps' },
  { value: 3, label: 'Presque tous les jours' },
]

export default function Assessment() {
  const [questions, setQuestions] = useState([])
  const [questionnaire, setQuestionnaire] = useState(null)
  const [reponses, setReponses] = useState({})
  const [etape, setEtape] = useState('questionnaire') // questionnaire | resultat
  const [resultat, setResultat] = useState(null)
  const [historique, setHistorique] = useState([])
  const [loading, setLoading] = useState(false)
  const [onglet, setOnglet] = useState('evaluation') // evaluation | historique
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchQuestions()
    fetchHistorique()
  }, [])

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get('/assessments/questions/1')
      setQuestions(data.questions)
      setQuestionnaire(data.questionnaire)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchHistorique = async () => {
    try {
      const { data } = await api.get('/assessments/history')
      setHistorique(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReponse = (questionId, valeur) => {
    setReponses(prev => ({ ...prev, [questionId]: valeur }))
  }

  const progression = questions.length > 0
    ? Math.round((Object.keys(reponses).length / questions.length) * 100)
    : 0

  const handleSubmit = async () => {
    if (Object.keys(reponses).length < questions.length) {
      alert('Veuillez répondre à toutes les questions')
      return
    }
    setLoading(true)
    try {
      const reponsesArray = Object.entries(reponses).map(([question_id, valeur]) => ({
        question_id: parseInt(question_id), valeur
      }))
      const { data } = await api.post('/assessments', {
        questionnaire_id: 1,
        reponses: reponsesArray,
        notes_libres: notes
      })
      setResultat(data)
      setEtape('resultat')
      fetchHistorique()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const recommencer = () => {
    setReponses({})
    setResultat(null)
    setEtape('questionnaire')
    setNotes('')
  }

  const getNiveauLabel = (niveau) => {
    const score = parseInt(niveau)
    if (score <= 4) return 'vert'
    if (score <= 9) return 'orange'
    return 'rouge'
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Auto-évaluation psychologique</h1>
        <p className="text-gray-500 mt-1">Questionnaire PHQ-9 — Évaluation de votre bien-être mental</p>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'evaluation', icon: 'fa-clipboard-check', label: 'Évaluation' },
          { id: 'historique', icon: 'fa-history', label: 'Historique' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setOnglet(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              onglet === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>
            <i className={`fas ${tab.icon}`}></i> {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet Évaluation */}
      {onglet === 'evaluation' && (
        <>
          {/* Questionnaire */}
          {etape === 'questionnaire' && (
            <div className="max-w-3xl">

              {/* Info card */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6 flex gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-info text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">PHQ-9 — Patient Health Questionnaire</h3>
                  <p className="text-sm text-gray-600">
                    Ce questionnaire évalue votre état de santé mentale sur les <strong>2 dernières semaines</strong>.
                    Vos réponses sont confidentielles et sauvegardées de façon sécurisée.
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{Object.keys(reponses).length} / {questions.length} questions répondues</span>
                  <span className="font-semibold text-primary">{progression}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progression}%` }}
                  ></div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id}
                    className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition ${
                      reponses[q.id] !== undefined ? 'border-primary/20' : 'border-transparent'
                    }`}>
                    <div className="flex gap-3 mb-4">
                      <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-gray-800 font-medium text-sm leading-relaxed">{q.texte}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-10">
                      {options.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleReponse(q.id, opt.value)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-medium border-2 transition text-left ${
                            reponses[q.id] === opt.value
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-purple-50'
                          }`}>
                          <span className="font-bold mr-2">{opt.value}</span> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes libres */}
              <div className="bg-white rounded-2xl p-6 shadow-sm mt-4">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  <i className="fas fa-pen mr-2 text-primary"></i>
                  Notes personnelles (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Partagez ce que vous ressentez..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 resize-none"
                />
              </div>

              {/* Bouton soumettre */}
              <button
                onClick={handleSubmit}
                disabled={loading || Object.keys(reponses).length < questions.length}
                className="w-full mt-6 bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading
                  ? <><i className="fas fa-spinner fa-spin"></i> Analyse en cours...</>
                  : <><i className="fas fa-paper-plane"></i> Soumettre mon évaluation</>
                }
              </button>
            </div>
          )}

          {/* Résultat */}
          {etape === 'resultat' && resultat && (() => {
            const n = niveaux[resultat.niveau]
            return (
              <div className="max-w-2xl">
                <div className={`${n.bg} border-2 ${n.border} rounded-2xl p-8 text-center mb-6`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${n.bg}`}>
                    <i className={`fas ${n.icon} ${n.color} text-4xl`}></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre résultat</h2>
                  <div className={`text-5xl font-bold ${n.color} mb-2`}>{resultat.score}<span className="text-2xl text-gray-400">/27</span></div>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${n.bg} ${n.color} border ${n.border}`}>
                    {n.label}
                  </span>
                  <p className="text-gray-600 mt-4 text-sm">{n.desc}</p>
                </div>

                {/* Échelle */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Échelle d'interprétation PHQ-9</h3>
                  <div className="space-y-3">
                    {[
                      { range: '0 - 4', label: 'Minimal', color: 'bg-green-500', desc: 'Pas de dépression' },
                      { range: '5 - 9', label: 'Léger', color: 'bg-yellow-500', desc: 'Surveillance recommandée' },
                      { range: '10 - 14', label: 'Modéré', color: 'bg-orange-500', desc: 'Suivi conseillé' },
                      { range: '15 - 27', label: 'Sévère', color: 'bg-red-500', desc: 'Consultation urgente' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium text-gray-700 w-16">{item.range}</span>
                        <span className="text-sm font-semibold text-gray-800 w-20">{item.label}</span>
                        <span className="text-sm text-gray-500">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {resultat.niveau === 'rouge' && (
                  <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-5 mb-6">
                    <div className="flex gap-3">
                      <i className="fas fa-exclamation-triangle text-red-500 mt-0.5"></i>
                      <div>
                        <p className="font-semibold text-red-700">Attention requise</p>
                        <p className="text-red-600 text-sm mt-1">
                          Votre score indique des symptômes sévères. Nous vous recommandons fortement
                          de prendre rendez-vous avec un conseiller dès que possible.
                        </p>
                        <a href="/conseillers"
                          className="inline-flex items-center gap-2 mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition">
                          <i className="fas fa-user-md"></i> Voir les conseillers
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <button onClick={recommencer}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  <i className="fas fa-redo"></i> Faire une nouvelle évaluation
                </button>
              </div>
            )
          })()}
        </>
      )}

      {/* Onglet Historique */}
      {onglet === 'historique' && (
        <div className="max-w-3xl">
          {historique.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <i className="fas fa-history text-4xl text-gray-300 mb-4 block"></i>
              <p className="text-gray-500">Aucune évaluation effectuée pour l'instant</p>
              <button onClick={() => setOnglet('evaluation')}
                className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition">
                Faire ma première évaluation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {historique.map((item) => {
                const n = niveaux[item.niveau] || niveaux['vert']
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 ${n.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <i className={`fas ${n.icon} ${n.color} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{item.questionnaire_nom}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${n.bg} ${n.color} font-medium`}>
                          {n.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(item.date_realisation).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${n.color}`}>{item.score_total}</span>
                      <span className="text-gray-400 text-sm">/27</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}