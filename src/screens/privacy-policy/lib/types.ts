export interface PrivacySubsection {
  title: string
  content: string
}

export interface PrivacySection {
  id: string
  title: string
  content?: string
  subsections?: PrivacySubsection[]
}
