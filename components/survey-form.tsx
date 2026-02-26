"use client"

import { Plus, Trash2 } from "lucide-react"
import type { SurveyConfig, SurveyQuestion, SurveyMode } from "@/lib/survey-types"

interface SurveyFormProps {
  config: SurveyConfig
  onChange: (config: SurveyConfig) => void
}

export function SurveyForm({ config, onChange }: SurveyFormProps) {
  const updateMode = (mode: SurveyMode) => {
    onChange({ ...config, mode })
  }

  const updateQuestion = (
    key: "question1" | "question2",
    updates: Partial<SurveyQuestion>
  ) => {
    onChange({
      ...config,
      [key]: { ...config[key], ...updates },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header card */}
      <div className="bg-card rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="text-[22px] font-semibold tracking-tight text-card-foreground">
          Create New CSAT Survey
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1">
          Configure your CleverTap in-app message survey
        </p>
      </div>

      {/* Survey type selector */}
      <div className="bg-card rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Survey Type
        </label>
        <div className="flex gap-3 mt-3">
          <TypeButton
            label="Single Survey"
            description="2 steps"
            active={config.mode === "2-step"}
            onClick={() => updateMode("2-step")}
          />
          <TypeButton
            label="Double Survey"
            description="4 steps"
            active={config.mode === "4-step"}
            onClick={() => updateMode("4-step")}
          />
        </div>
      </div>

      {/* Question 1 */}
      <QuestionCard
        title="Question 1"
        subtitle={config.mode === "2-step" ? "CSAT + Follow-up" : "CSAT + Follow-up (Topic 1)"}
        question={config.question1}
        onChange={(updates) => updateQuestion("question1", updates)}
      />

      {/* Question 2 (only in 4-step mode) */}
      {config.mode === "4-step" && (
        <QuestionCard
          title="Question 2"
          subtitle="CSAT + Follow-up (Topic 2)"
          question={config.question2}
          onChange={(updates) => updateQuestion("question2", updates)}
        />
      )}
    </div>
  )
}

function TypeButton({
  label,
  description,
  active,
  onClick,
}: {
  label: string
  description: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-4 py-3.5 text-left transition-all border ${
        active
          ? "border-accent bg-accent/10 shadow-[0_0_0_1px_var(--accent)]"
          : "border-border bg-card hover:border-muted-foreground/30"
      }`}
    >
      <span
        className={`block text-[13px] font-semibold ${
          active ? "text-accent" : "text-card-foreground"
        }`}
      >
        {label}
      </span>
      <span className="block text-[11px] text-muted-foreground mt-0.5">
        {description}
      </span>
    </button>
  )
}

function QuestionCard({
  title,
  subtitle,
  question,
  onChange,
}: {
  title: string
  subtitle: string
  question: SurveyQuestion
  onChange: (updates: Partial<SurveyQuestion>) => void
}) {
  const updateFollowup = (
    field: string,
    value: string | string[]
  ) => {
    onChange({
      followup: {
        ...question.followup,
        [field]: value,
      },
    })
  }

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...question.answers]
    newAnswers[index] = value
    onChange({ answers: newAnswers })
  }

  const addAnswer = () => {
    if (question.answers.length < 7) {
      onChange({ answers: [...question.answers, ""] })
    }
  }

  const removeAnswer = (index: number) => {
    if (question.answers.length > 2) {
      const newAnswers = question.answers.filter((_, i) => i !== index)
      onChange({ answers: newAnswers })
    }
  }

  const updateFollowupOption = (
    key: "dissatisfiedOptions" | "delightedOptions",
    index: number,
    value: string
  ) => {
    const current = question.followup[key]
    const updated = [...current]
    updated[index] = value
    updateFollowup(key, updated)
  }

  const addFollowupOption = (key: "dissatisfiedOptions" | "delightedOptions") => {
    const current = question.followup[key]
    if (current.length < 6) {
      updateFollowup(key, [...current, ""])
    }
  }

  const removeFollowupOption = (
    key: "dissatisfiedOptions" | "delightedOptions",
    index: number
  ) => {
    const current = question.followup[key]
    if (current.length > 1) {
      updateFollowup(
        key,
        current.filter((_, i) => i !== index)
      )
    }
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-baseline gap-3 mb-6">
        <h3 className="text-[15px] font-semibold text-card-foreground">{title}</h3>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </div>

      {/* Context */}
      <FieldGroup label="Survey Context">
        <input
          type="text"
          value={question.context}
          onChange={(e) => onChange({ context: e.target.value })}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
          placeholder="e.g. CSAT Celengan Top-up"
        />
      </FieldGroup>

      {/* Main question */}
      <FieldGroup label="Question Label">
        <input
          type="text"
          value={question.questionLabel}
          onChange={(e) => onChange({ questionLabel: e.target.value })}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
          placeholder="e.g. Seberapa puas Anda dengan..."
        />
      </FieldGroup>

      {/* CSAT Answers */}
      <FieldGroup label="CSAT Answers">
        <div className="flex flex-col gap-2">
          {question.answers.map((ans, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground w-5 shrink-0 text-center font-mono">
                {i + 1}
              </span>
              <input
                type="text"
                value={ans}
                onChange={(e) => updateAnswer(i, e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
                placeholder={`Answer ${i + 1}`}
              />
              {question.answers.length > 2 && (
                <button
                  onClick={() => removeAnswer(i)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label={`Remove answer ${i + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          {question.answers.length < 7 && (
            <button
              onClick={addAnswer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add answer
            </button>
          )}
        </div>
      </FieldGroup>

      {/* Follow-up: Dissatisfied */}
      <FollowupSection
        sentiment="Dissatisfied"
        sentimentNote="Score 1-4"
        titleValue={question.followup.dissatisfiedTitle}
        onTitleChange={(v) => updateFollowup("dissatisfiedTitle", v)}
        options={question.followup.dissatisfiedOptions}
        onOptionChange={(i, v) => updateFollowupOption("dissatisfiedOptions", i, v)}
        onAddOption={() => addFollowupOption("dissatisfiedOptions")}
        onRemoveOption={(i) => removeFollowupOption("dissatisfiedOptions", i)}
      />

      {/* Follow-up: Delighted */}
      <FollowupSection
        sentiment="Delighted"
        sentimentNote="Score 5"
        titleValue={question.followup.delightedTitle}
        onTitleChange={(v) => updateFollowup("delightedTitle", v)}
        options={question.followup.delightedOptions}
        onOptionChange={(i, v) => updateFollowupOption("delightedOptions", i, v)}
        onAddOption={() => addFollowupOption("delightedOptions")}
        onRemoveOption={(i) => removeFollowupOption("delightedOptions", i)}
      />
    </div>
  )
}

function FollowupSection({
  sentiment,
  sentimentNote,
  titleValue,
  onTitleChange,
  options,
  onOptionChange,
  onAddOption,
  onRemoveOption,
}: {
  sentiment: string
  sentimentNote: string
  titleValue: string
  onTitleChange: (v: string) => void
  options: string[]
  onOptionChange: (i: number, v: string) => void
  onAddOption: () => void
  onRemoveOption: (i: number) => void
}) {
  return (
    <div className="mt-5 pt-5 border-t border-border">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-[12px] font-semibold text-card-foreground">
          Follow-up: {sentiment}
        </span>
        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-secondary rounded-md">
          {sentimentNote}
        </span>
      </div>

      <FieldGroup label="Question Title">
        <input
          type="text"
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
          placeholder="Follow-up question..."
        />
      </FieldGroup>

      <FieldGroup label="Options">
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => onOptionChange(i, e.target.value)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-[13px] text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow"
                placeholder={`Option ${i + 1}`}
              />
              {options.length > 1 && (
                <button
                  onClick={() => onRemoveOption(i)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label={`Remove option ${i + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          {options.length < 6 && (
            <button
              onClick={onAddOption}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add option
            </button>
          )}
        </div>
      </FieldGroup>

      <p className="text-[10px] text-muted-foreground mt-2 italic">
        {'A "Lainnya" (Other) option with free-text input is automatically appended.'}
      </p>
    </div>
  )
}

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-4">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}
