import { APP_NAME, DEVELOPER_NAME, SUPPORT_EMAIL } from './consts'
import type { PrivacySection } from './types'

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: 'who-we-are',
    title: '1) Who we are',
    content: `Controller/Developer: ${DEVELOPER_NAME} (independent software developer).\nApplication: ${APP_NAME}\nContact: ${SUPPORT_EMAIL}`
  },
  {
    id: 'policy-covers',
    title: '2) What this policy covers',
    content: `This policy covers the ${APP_NAME} mobile apps and related cloud services used for optional sign-in, subscriptions, and synchronization.`
  },
  {
    id: 'information-processed',
    title: '3) Information we process',
    subsections: [
      {
        title: 'A. Local-Only Mode (no sign-in, no sync)',
        content: `• On-device data: accounts, categories, transactions (amounts, currency, date, notes, attachments you add). Stored locally and not sent to our servers.\n\n• Permissions you may grant:\n   – Photos/Media/Files: attach images to transactions (e.g., receipt photos saved in your gallery).\n   – Camera (planned): capture receipt photos inside the app when the receipt-scanner is offered.\n   – Microphone (planned): add transactions by voice (if/when voice input is released).\n\n• We do not collect analytics or advertising identifiers.`
      },
      {
        title: 'B. Sign-in without Sync (account only)',
        content: `• Account data: minimal information such as email and a user ID from our authentication provider. Your expense data remains only on your device until you purchase sync.\n\n• Payments/Subscribers: if you view subscription screens, our billing provider may process basic device/purchase metadata to validate entitlements. No ad tracking.`
      },
      {
        title: 'C. With Sync Enabled (paid monthly feature)',
        content: `• Synced data: your expense data (accounts, categories, transactions, and attachments/metadata) is transmitted to our cloud for backup and multi-device sync.\n\n• Technical data: standard logs/diagnostics (timestamps, error logs, basic device/app version) to operate and secure the service.`
      },
      {
        title: 'D. Camera-based receipt capture (optional)',
        content: `• User content: photos you capture of receipts to help ${APP_NAME} extract line items.\n\n• Processing: extraction may be performed by third-party AI image processing providers acting as our processors; images are used only to provide the requested extraction and are not used for advertising. Providers may use de-identified data to improve and train their models.\n\n• Output: the structured data (e.g., items, amounts) may be saved as transactions; the original image is saved only if you choose to attach it.`
      }
    ]
  },
  {
    id: 'permissions-consent',
    title: '4) Permissions & your consent',
    content: `• Camera: used to capture photos of receipts so ${APP_NAME} can help convert them into transaction items using third-party AI image processing providers. Granting camera access is optional and requested only when you use this feature. You can revoke camera access at any time in your device settings. We do not use camera access for advertising.\n\n• Photos/Media: allows attaching existing images to transactions (e.g., gallery photos).\n\n• Microphone (optional, if/when available): to add transactions via voice.\n\n• Not requested: we do not request location, contacts, or calendar permissions.\n\nBy granting a permission, you consent to the related processing for that feature. You can withdraw consent by disabling the permission in your OS settings or by contacting us.`
  },
  {
    id: 'why-process',
    title: '5) Why we process this information',
    content: `• Provide the app's core features (local storage of your finances).\n• Authenticate you when you choose to sign in.\n• Deliver paid features (subscriptions, cloud sync; later, optional AI capture).\n• Operate, troubleshoot, and secure our systems.\n• Comply with legal obligations (e.g., tax/accounting for purchases).`
  },
  {
    id: 'legal-bases',
    title: '6) Legal bases (EU/EEA users)',
    content: `• Performance of a contract: providing the app and sync for subscribers.\n\n• Consent: enabling optional permissions (camera/microphone) and using optional AI features.\n\n• Legitimate interests: service security and troubleshooting.\n\n• Legal obligation: retention of payment records we must keep.`
  },
  {
    id: 'sharing-disclosure',
    title: '7) Sharing & disclosure',
    content: `We do not sell your data or share it for advertising. We share data only with service providers acting on our behalf under data-processing terms, such as:\n\n• Authentication (e.g., Clerk)\n• Subscriptions/billing (e.g., RevenueCat integrated with app stores)\n• Cloud database/synchronization (e.g., PowerSync and server database)\n• Optional AI image processing providers to extract structured data from recipe/receipt photos you submit\n\nWe require them to use data only as necessary to provide their services to us. When using AI image processing providers, images may be transmitted for processing solely to provide the requested extraction; providers may use de-identified data to improve and train their models. We do not permit use for advertising or profiling.`
  },
  {
    id: 'data-retention',
    title: '8) Data retention',
    content: `• Local-only data stays on your device until you delete the app data or use the app's delete features.\n\n• For synced accounts, we retain your cloud data while your account is active. If you delete your account or request deletion, we will delete or anonymize your personal data within a reasonable period unless we must keep some records to meet legal obligations (e.g., purchase records).\n\n• Receipt photos: if you attach/save them in ${APP_NAME}, they remain until you delete them. If an external AI image processing provider is used for extraction, we instruct the provider to retain images only as long as needed to provide the service and then delete them. Some system backups may persist for up to 30 days.`
  },
  {
    id: 'your-rights',
    title: '9) Your rights',
    content: `Depending on your region (e.g., EU/EEA), you may have rights to access, correct, delete, export, or object to certain processing. To exercise rights, contact ${SUPPORT_EMAIL}.`
  },
  {
    id: 'children',
    title: '10) Children',
    content: `${APP_NAME} is intended for a general audience and does not include adult or sensitive content. We do not knowingly collect personal data from children under the age required by applicable law (e.g., 13 in the US or 16 in the EEA). Children may use the app in local-only mode without creating an account. Account, sync, and paid features are intended for users of legal age or with parental consent. If you believe a child has provided personal data without consent, contact ${SUPPORT_EMAIL} and we will remove it or obtain appropriate consent.`
  },
  {
    id: 'security',
    title: '11) Security',
    content: `We use reasonable technical and organizational measures to protect data. No system is 100% secure, but we work to prevent unauthorized access, use, or disclosure.`
  },
  {
    id: 'international-transfers',
    title: '12) International transfers',
    content: `Our primary processing and storage occur in the United States (US). If you are located outside the US, your information may be transferred to and processed in the US. Where required, we use appropriate safeguards (e.g., contractual clauses) to protect your information.`
  },
  {
    id: 'data-deletion',
    title: '13) Data deletion & account closure',
    content: `• Local-only users: delete app data via your device OS/app settings.\n\n• Synced users: request deletion of your cloud data by emailing ${SUPPORT_EMAIL}. In-app deletion will be added in a future update. We may retain limited records as legally required (e.g., purchase history).\n\n• Revoking permissions: you can revoke camera/photos/microphone access in your device settings at any time; ${APP_NAME} will stop using those features until you re-enable them.`
  },
  {
    id: 'platform-disclosures',
    title: '14) Platform disclosures (Google Play and Apple App Store)',
    content: `• Publicly accessible URL: this policy is hosted at a web URL accessible without special plugins (/privacy-policy).\n\n• In-app access: an in-app link will be added in a future app update.\n\n• App privacy disclosures: we accurately describe our data practices in Google Play and App Store Connect (including any third-party AI image processing providers we choose to use).\n\n• Camera disclosure (Play Console): "Capture receipt images to extract items into transactions using AI."`
  },
  {
    id: 'early-access-liability',
    title: '15) Early access & limitation of liability',
    content: `The application is in an early stage of development and may contain bugs or issues. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ${DEVELOPER_NAME} PROVIDES ${APP_NAME} “AS IS” AND SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR DATA-LOSS DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE APP. Some jurisdictions do not allow the exclusion or limitation of liability; in those cases, these limitations apply to the maximum extent permitted by law.`
  },
  {
    id: 'policy-changes',
    title: '16) Changes to this policy',
    content: `We may update this policy to reflect changes in the app or legal requirements. We will change the "Last updated" date above and, where appropriate, provide additional notice.`
  }
]
