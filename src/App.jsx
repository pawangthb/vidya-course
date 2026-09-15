import { useState } from 'react'
import './App.css'

const EMAIL = 'pg19062004@gmail.com'

const SERVICES = [
  ['Course flexibility', 'Slots that fit school and homework time.'],
  ['Student support', 'Doubt clearing with patient, personal guidance.'],
  ['Interactive lessons', 'Engaging classes that make learning enjoyable.'],
  ['Expert tuition', 'Hindi and English medium, all subjects.'],
  ['Weekly test & analysis', 'Regular tests so progress is visible.'],
  ['Homework help', 'Daily assistance so classwork stays on track.'],
  ['Free trial for new students', 'Try a class before committing to a slot.'],
]

const SUBJECTS = ['All subjects', 'Hindi', 'English', 'Maths', 'EVS / Science', 'SST', 'Computer']
const CLASSES = ['1', '2', '3', '4', '5', '6']
const TIMINGS = ['Morning', 'Afternoon', 'Evening', 'Mon–Fri after school', 'Need suggestion']

const empty = {
  parentName: '',
  studentName: '',
  className: '3',
  location: 'Shakarpur / Laxmi Nagar',
  subjects: 'All subjects',
  timing: 'Evening',
  enquiry: '',
}

export default function App() {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function onChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  function buildMailto() {
    const subject = encodeURIComponent('Vidya Course Home Tuition Enquiry')
    const body = encodeURIComponent(
      [
        'Vidya Course home tuition enquiry',
        '',
        `Parent name : ${form.parentName}`,
        `Student name: ${form.studentName}`,
        `Class       : ${form.className}`,
        `Location    : ${form.location}`,
        `Subjects    : ${form.subjects}`,
        `Timing      : ${form.timing}`,
        '',
        `Enquiry:`,
        form.enquiry,
      ].join('\n')
    )
    return `mailto:${EMAIL}?subject=${subject}&body=${body}`
  }

  function validate() {
    if (!form.parentName.trim()) return 'Enter parent name.'
    if (!form.studentName.trim()) return 'Enter student name.'
    if (!form.location.trim()) return 'Enter location.'
    if (!form.enquiry.trim()) return 'Write a short enquiry.'
    return ''
  }

  function onSubmit(e) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    window.location.href = buildMailto()
    setSent(true)
  }

  function onReset() {
    setForm(empty)
    setError('')
    setSent(false)
  }

  return (
    <div className="page">
      <nav className="nav">
        <div className="brand"><span className="cap">V</span> VIDYA COURSE</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Enquire</a></li>
        </ul>
        <button className="nav-cta" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
          Book a slot
        </button>
      </nav>

      <section className="hero">
        <div>
          <p className="kicker">Class 1–6 · Mon–Fri · All subjects</p>
          <h1>Hindi / English <em>Home Tuition</em></h1>
          <p>Students learn fast and confidently. Engaging classes, homework help, and weekly tests in Shakarpur, Laxmi Nagar.</p>
          <div className="chips">
            <span className="chip">Class 1–6</span>
            <span className="chip">Mon–Fri</span>
            <span className="chip">All subjects</span>
            <span className="chip">Shakarpur, Laxmi Nagar</span>
          </div>
          <div className="actions">
            <a className="btn btn-red" href={`mailto:${EMAIL}`}>Email Pawan Gupta</a>
            <button className="btn btn-line" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Send enquiry</button>
          </div>
        </div>
        <div className="hero-art">
          <img className="kid" src="/flyer.webp" alt="Child reading during tuition" />
        </div>
      </section>

      <section className="section" id="about">
        <h2>Personal guidance that sticks</h2>
        <p className="lead">
          Engaging and interactive classes designed to make learning enjoyable and effective. Personalized guidance in all subjects, homework assistance, and regular progress tracking.
        </p>
      </section>

      <section className="section" id="services" style={{ paddingTop: 0 }}>
        <h2>Service</h2>
        <div className="grid-4">
          {SERVICES.map(([t, d], i) => (
            <article className="card" key={t} style={{ animationDelay: `${i * 70}ms` }}>
              <b><span className="tick">✓</span>{t}</b>
              <span>{d}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="grid-2">
          <div>
            <h2>Enquire for a home slot</h2>
            <p className="lead">
              Fill the form and it will open your email app with everything filled in — just hit Send. You can also email directly.
            </p>
            <div className="card" style={{ marginTop: 20 }}>
              <b>Pawan Gupta</b>
              <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p>Shakarpur, Laxmi Nagar</p>
            </div>
          </div>

          {sent ? (
            <div className="sent-state">
              <div className="sent-icon">✉️</div>
              <h3>Your email app should be open!</h3>
              <p>
                Your enquiry is pre-filled and ready to send to <strong>{EMAIL}</strong>. Just press Send in your email app.
              </p>
              <p>If the email app didn't open, you can email us directly at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
              <button className="btn btn-red" onClick={onReset}>Send another enquiry</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div>
                <label htmlFor="parentName">Parent name</label>
                <input id="parentName" name="parentName" value={form.parentName} onChange={onChange} required />
              </div>
              <div>
                <label htmlFor="studentName">Student name</label>
                <input id="studentName" name="studentName" value={form.studentName} onChange={onChange} required />
              </div>
              <div>
                <label htmlFor="className">Class</label>
                <select id="className" name="className" value={form.className} onChange={onChange}>
                  {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="location">Location</label>
                <input id="location" name="location" value={form.location} onChange={onChange} required />
              </div>
              <div>
                <label htmlFor="subjects">Subjects</label>
                <select id="subjects" name="subjects" value={form.subjects} onChange={onChange}>
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="timing">Timing / enquiry slot</label>
                <select id="timing" name="timing" value={form.timing} onChange={onChange}>
                  {TIMINGS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="enquiry">Enquiry</label>
                <textarea
                  id="enquiry"
                  name="enquiry"
                  rows="4"
                  value={form.enquiry}
                  onChange={onChange}
                  required
                  placeholder="Tell us preferred days, medium, or any doubt."
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button className="btn btn-red" type="submit">Send Enquiry Email</button>
            </form>
          )}
        </div>
      </section>

      <footer className="footer">
        <span>Vidya Course · Home tuition · Class 1–6</span>
        <span>Pawan Gupta · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · Shakarpur, Laxmi Nagar</span>
      </footer>
    </div>
  )
}