/**
 * Real testimonials only. The home page shows the testimonials section when this list has entries and
 * hides it when it is empty, so nothing is shown until someone has actually said it and agreed to be quoted.
 */
export interface Testimonial {
  quote: string
  name: string
  role: string
  /** Where they were when they used AlphaVector: a college, a cohort, a company. */
  context?: string
}

export const TESTIMONIALS: Testimonial[] = []
