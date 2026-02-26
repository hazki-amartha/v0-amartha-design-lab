export type SurveyMode = "2-step" | "4-step"

export interface FollowupOptions {
  dissatisfiedTitle: string
  dissatisfiedOptions: string[]
  delightedTitle: string
  delightedOptions: string[]
}

export interface SurveyQuestion {
  context: string
  questionLabel: string
  answers: string[]
  followup: FollowupOptions
}

export interface SurveyConfig {
  mode: SurveyMode
  question1: SurveyQuestion
  question2: SurveyQuestion // only used in 4-step mode
}

export function getDefaultConfig(): SurveyConfig {
  return {
    mode: "2-step",
    question1: {
      context: "CSAT Celengan Top-up",
      questionLabel: "Seberapa puas Anda dengan pengalaman top-up di AmarthaFin?",
      answers: [
        "Sangat tidak puas",
        "Tidak puas",
        "Biasa saja",
        "Puas",
        "Sangat puas",
      ],
      followup: {
        dissatisfiedTitle: "Apa yang paling perlu ditingkatkan dari fitur top-up ini?",
        dissatisfiedOptions: [
          "Proses terlalu lama",
          "Instruksi tidak jelas",
          "Sering gagal / error",
          "Metode pembayaran terbatas",
        ],
        delightedTitle: "Apa yang paling Anda sukai dari fitur top-up ini?",
        delightedOptions: [
          "Prosesnya cepat",
          "Instruksi jelas",
          "Banyak pilihan metode",
          "Tampilannya mudah digunakan",
        ],
      },
    },
    question2: {
      context: "CSAT Celengan Divest",
      questionLabel: "Seberapa puas Anda dengan pengalaman penarikan (divest) Celengan di AmarthaFin?",
      answers: [
        "Sangat tidak puas",
        "Tidak puas",
        "Biasa saja",
        "Puas",
        "Sangat puas",
      ],
      followup: {
        dissatisfiedTitle: "Apa yang paling perlu ditingkatkan dari fitur penarikan (divest) ini?",
        dissatisfiedOptions: [
          "Proses terlalu lama",
          "Instruksi tidak jelas",
          "Sering gagal / error",
          "Dana lambat masuk",
        ],
        delightedTitle: "Apa yang paling Anda sukai dari fitur penarikan (divest) ini?",
        delightedOptions: [
          "Prosesnya cepat",
          "Instruksi jelas",
          "Dana cepat masuk",
          "Tampilannya mudah digunakan",
        ],
      },
    },
  }
}
