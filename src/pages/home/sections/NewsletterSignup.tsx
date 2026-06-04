import { useState, type FormEvent } from 'react'
import { homeInfosContent } from '@/config/homeInfos'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type NewsletterSignupProps = {
  formId: string
}

/**
 * Formulaire newsletter — validation côté client, prêt pour branchement API.
 */
export function NewsletterSignup({ formId }: NewsletterSignupProps) {
  const { newsletter } = homeInfosContent
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  /**
   * Envoi — validation e-mail, message utilisateur ; API à brancher plus tard.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()

    if (!EMAIL_PATTERN.test(trimmed)) {
      setIsSuccess(false)
      setFeedback(newsletter.errorMessage)
      return
    }

    // TODO API newsletter (Brevo, Mailchimp, endpoint Vercel /api/newsletter…)
    setIsSuccess(true)
    setFeedback(newsletter.successMessage)
    setEmail('')
  }

  return (
    <div className="home-infos__newsletter">
      <h3 className="home-infos__block-title">{newsletter.title}</h3>
      <p className="home-infos__newsletter-lead">{newsletter.lead}</p>

      <form
        id={formId}
        className="home-infos__newsletter-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <label className="home-infos__newsletter-label" htmlFor={`${formId}-email`}>
          {newsletter.emailLabel}
        </label>
        <div className="home-infos__newsletter-row">
          <input
            id={`${formId}-email`}
            className="home-infos__newsletter-input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder={newsletter.emailPlaceholder}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (feedback) setFeedback(null)
            }}
            aria-describedby={feedback ? `${formId}-feedback` : undefined}
            aria-invalid={feedback && !isSuccess ? true : undefined}
            required
          />
          <button type="submit" className="home-infos__newsletter-submit">
            {newsletter.submitLabel}
          </button>
        </div>
      </form>

      {feedback && (
        <p
          id={`${formId}-feedback`}
          className={`home-infos__newsletter-feedback${isSuccess ? ' home-infos__newsletter-feedback--success' : ' home-infos__newsletter-feedback--error'}`}
          role="status"
        >
          {feedback}
        </p>
      )}
    </div>
  )
}
