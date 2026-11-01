# Job Application Agent — Plan (nothing built yet)

Goal: for every job description you give it, the agent produces a resume and
cover letter tailored to that posting, drawn only from your real experience,
so recruiters and applicant tracking systems (ATS) shortlist you for interviews.

## What I need from you before building

1. **Your master resume.** Paste it, or drop a file (PDF, DOCX, or plain text)
   into `job-agent/profile/`. It should be the long, complete version: every
   job, project, certification, tool, and measurable result. More is better;
   the agent trims per posting, it never invents.
2. **Target roles and locations**, e.g. "IT support, network engineer, field
   technician; San Diego County, remote OK".
3. **Hard constraints**: salary floor, visa or clearance status, on-site vs remote,
   anything you will not apply to.
4. **Where you want it to run** (see "Two ways to run it" below).

## How it works

```
job-agent/
  profile/
    master-resume.md      <- your full history (you write it once; agent reads it)
    preferences.md        <- roles, locations, constraints, tone
  inbox/
    acme-network-admin.md <- one file per job description you paste in
  applications/
    acme-network-admin/
      job.md              <- the posting, saved for the record
      analysis.md         <- keywords, must-haves, gaps, fit score
      resume.md           <- tailored resume (source of truth)
      resume.pdf          <- exported, ATS-friendly single column
      cover-letter.md
      cover-letter.pdf
      status.md           <- applied? date, link, follow-ups
  tracker.md              <- one table of every application and its status
```

Per job, the agent:

1. Reads the posting and pulls out the required and preferred skills, exact
   keyword phrasing, seniority, and anything that is a dealbreaker.
2. Scores fit against your master resume and lists gaps honestly.
3. Rewrites your summary and reorders or rewords bullets so the strongest
   matching experience leads and the posting's own keywords appear verbatim
   where they are true of you. Nothing is added that is not in your master
   resume. Numbers come from you, never guessed.
4. Writes a short cover letter (three paragraphs, under 250 words).
5. Exports both to PDF (plain single-column layout so ATS parsers read it)
   and appends a row to the tracker.

Guardrails:

- No fabricated employers, dates, titles, degrees, certifications, or metrics.
- Flags any required skill you lack instead of papering over it, so you can
  decide whether to apply.
- Keeps a copy of every version sent, so you know what each recruiter saw.

## Two ways to run it

**Option A (recommended to start): a Claude Code skill in this repo.**
You paste a job description into `inbox/`, run `/tailor-resume`, and the
session does the work. No API key, no extra cost beyond this session.
Fastest to build and to iterate on tone.

**Option B: a standalone Python script** using the Anthropic SDK
(`claude-opus-5-5`, adaptive thinking, server-side refusal fallback).
Runs in batch over a folder of postings, from your own machine or a cron job.
Needs an API key you pay for. Roughly $0.05 to $0.15 per application at
current Opus 5.5 rates. Worth adding once Option A's output looks right.

Both share the same prompts and folder layout, so B is a thin wrapper around A.

## What "apply" means here

The agent writes and files the application. Submitting it on LinkedIn,
Indeed, or a company careers page stays a manual step for now, because:

- those sites need your logged-in browser on your own computer, and most
  forbid automated submissions in their terms;
- each form asks different questions (salary, work authorization,
  "why us"), and a wrong answer on an auto-filled form is hard to undo.

If you want the submission step automated later, the path is the Claude in
Chrome extension on your machine, with you approving each submit. That is a
separate phase after the resumes are good.

## Steps once you confirm

1. Create the folder layout above and a `preferences.md` template.
2. Convert your master resume into `profile/master-resume.md`.
3. Write the skill (`.claude/skills/tailor-resume/SKILL.md`) with the analysis
   and rewriting prompts and the PDF export step.
4. Run it on one real posting you choose, review together, adjust tone.
5. Optionally add the Python batch script (Option B).

This plan file is the only thing added to the repo so far. The site files
are untouched.
