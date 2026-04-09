export type CoachService = {
  value: string
  label: string
  keywords: string[]
}

export const COACH_SERVICES: CoachService[] = [
  { value: 'coaching-carriere', label: 'Coaching carrière', keywords: ['coach carrière', 'coaching carrière', 'coach career', 'career coach'] },
  { value: 'cv', label: 'CV & lettre de motivation', keywords: ['cv', 'curriculum', 'lettre de motivation', 'resume'] },
  { value: 'entretien', label: 'Préparation entretiens', keywords: ['entretien', 'interview', 'recrutement'] },
  { value: 'bilan', label: 'Bilan de compétences', keywords: ['bilan'] },
  { value: 'reconversion', label: 'Reconversion professionnelle', keywords: ['reconversion'] },
  { value: 'leadership', label: 'Leadership & Management', keywords: ['leadership', 'management', 'manager'] },
  { value: 'developpement', label: 'Développement personnel', keywords: ['développement personnel', 'developpement personnel', 'confiance', 'soft skills'] },
  { value: 'branding', label: 'Personal branding', keywords: ['branding', 'personal brand', 'image professionnelle'] },
  { value: 'orientation', label: 'Orientation professionnelle', keywords: ['orientation', 'conseil carrière', 'conseil career'] },
  { value: 'autre', label: 'Autre', keywords: [] }, // catch-all : filtrés côté serveur
]

export function matchesService(category: string | null, metier: string | null, serviceValue: string): boolean {
  const service = COACH_SERVICES.find(s => s.value === serviceValue)
  if (!service) return true

  const haystack = [category, metier].filter(Boolean).join(' ').toLowerCase()

  if (service.value === 'autre') {
    // "Autre" = ne correspond à aucun service connu
    return !COACH_SERVICES
      .filter(s => s.value !== 'autre')
      .some(s => s.keywords.some(kw => haystack.includes(kw.toLowerCase())))
  }

  return service.keywords.some(kw => haystack.includes(kw.toLowerCase()))
}
