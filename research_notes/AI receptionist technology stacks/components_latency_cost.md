# Phone voice agent components: STT, turn detection, LLM, TTS, speech-to-speech, latency budget and cost (as of Oct 2026)

Method note: research run on 2026-10-13. The sandbox's egress proxy blocked direct page fetches (groq.com, deepgram.com, console.groq.com and others returned CONNECT 403 / DNS failure), so every finding below comes from web-search results and their snippets/summaries, not from reading the full pages. Many sources are third-party pricing aggregators or vendor blogs. Where a figure was only seen secondhand it is marked; check vendor pricing pages before committing budgets. "Vendor claim" = number published by the company selling the product; "independent" = third party (Coval, Artificial Analysis, academic preprints), though some "independent" write-ups are hosted by competing vendors (Gradium, Cartesia, Soniox, Telnyx), which is flagged.

## 1. Speech-to-text (streaming) on 8 kHz telephony audio

### Takeaway
On the independent Coval board (re-measured daily, Sep-Oct 2026 snapshots), the fastest, most accurate streaming STT models are Soniox stt-rt-v5, Baseten-hosted Qwen3-ASR, ElevenLabs Scribe v2 Realtime and Speechmatics. Deepgram stays competitive on latency and has the best turn-aware product (Flux), but it is not the cheapest: Flux English costs about $0.0065-0.0077/min against Soniox's $0.002/min ($0.12/h). No source tests Spanish or code-switched speech on real 8 kHz mu-law audio, so the team needs to test that on its own calls.

### Cited Findings
**Latency and accuracy (Coval, independent; snapshots Sep-Oct 2026)**
- Coval's benchmark pages are re-measured daily. Snapshots seen are dated Sep-Oct 2026. Coval notes that production endpointing/turn detection adds latency outside the interval it attributes to the model. — [Coval benchmarks (via search summary)](https://benchmarks.coval.ai/providers/speechmatics)
- Soniox stt-rt-v5: 48 ms time-to-first-segment (TTFS) in one Coval table (23,514 samples), and 63 ms in the ranking shown on another page. — [Coval Universal-Streaming page](https://benchmarks.coval.ai/models/universal-streaming)
- Baseten Qwen3-ASR 1.7B: TTFS 39 ms. Baseten claims that no provider on Coval is both faster and lower-WER (as of 2026-09-22). This is a vendor's reading of Coval data. — [Baseten blog](https://www.baseten.co/blog/baseten-leads-covals-voice-ai-benchmark/)
- ElevenLabs Scribe v2 Realtime: 123 ms time to final segment, 4.4% WER. — [Coval Scribe v2 Realtime](https://benchmarks.coval.ai/models/scribe_v2_realtime)
- Speechmatics: its fastest dated entry has a mean of 270 ms to final segment (20th of 28) with 3.9% WER. — [Coval Speechmatics](https://benchmarks.coval.ai/providers/speechmatics)
- AssemblyAI Universal-Streaming: 7% WER (19th of 26) and 1,509 ms TTFT on Coval. A Gradium article citing Coval instead gives 4.2% average WER. The two sources conflict. — [Coval](https://benchmarks.coval.ai/models/universal-streaming); [Gradium](https://gradium.ai/content/stt-api-benchmark-2026-latency-accuracy)
- Deepgram Nova-3: 85 ms TTFS on Coval. A Gradium (competitor) article reports 25.3% WER for Nova-3. That is out of line with every other source and should be treated as suspect. — [Gradium STT benchmark](https://gradium.ai/content/stt-api-benchmark-2026-latency-accuracy)
- A Coval STT benchmark (May 2026) reports median TTFT from 992 ms (Deepgram Nova-3) to 2,080 ms (ElevenLabs Scribe v2). These numbers are far above the TTFS figures above, which shows how much the measurement definition (first partial vs. final transcript vs. after endpointing) changes results. — [Gradium/Coval summary](https://gradium.ai/content/tts-latency-benchmark-2026)
- Pipecat's public STT benchmark (English, reproducible dataset `pipecat-ai/stt-benchmark-data` on Hugging Face): Soniox stt-rt-v5 at 1.34% semantic WER vs. Deepgram nova-3-general at 1.71%. — [Soniox vs Deepgram compare page citing Pipecat](https://soniox.com/compare-stt/soniox-vs-deepgram)

**Spanish, code-switching, telephony**
- Soniox (vendor claim, 2025 study, 60 languages, YouTube wideband audio): Spanish WER 5.3% vs. Deepgram 10.1%. — [Soniox vs Deepgram (Spanish)](https://soniox.com/compare/soniox-vs-deepgram/spanish)
- Code-switching coverage: Deepgram Nova-3 multilingual covers 10 languages with code-switching, and Flux multilingual covers 10 languages with code-switching. Soniox claims automatic detection and mid-conversation switching across 60+ languages. — [Soniox compare page](https://soniox.com/compare/soniox-vs-deepgram); [Retell STT roundup](https://www.retellai.com/blog/best-speech-to-text-models)
- PSTN audio arrives at 8 kHz, often mu-law. Benchmarks use wideband audio, so test with the real codec rather than upsampling. — [Evalgent Deepgram testing guide](https://www.evalgent.com/blog/deepgram-stt-voice-agent-testing-guide)
- An unsourced claim says multilingual models that post ~5% WER on monolingual benchmarks reach 15-20% WER on Spanish-English code-switched calls. Treat it as an anecdote only. — [search summary of Evalgent/Coval blog](https://www.coval.ai/blog/best-speech-to-text-providers-in-2026-independent-benchmarks-and-how-to-choose/)
- An academic benchmark of commercial ASR on code-switching exists, but only for Arabic, Persian and German, not Spanish. — [arXiv 2605.19069](https://arxiv.org/pdf/2605.19069)

**Price per minute (streaming; dates as stated)**
- Deepgram Flux English: $0.0065/min pay-as-you-go, $0.0077/min regular list, about $0.0057/min on Growth (markaicode checked against Deepgram's page on 2026-09-02). Flux Multilingual: $0.0078/min. — [markaicode](https://markaicode.com/pricing/deepgram-pricing/); [diyai](https://diyai.io/ai-tools/speech-to-text/deepgram-pricing-2026/)
- Deepgram Nova-3 monolingual streaming: $0.0048/min under a limited-time promotion, $0.0077/min regular. Nova-3 multilingual streaming is quoted at $0.0058/min in one source and $0.0092/min in another (conflict). Batch is $0.0043/min. — [markaicode](https://markaicode.com/pricing/deepgram-pricing/); [aiagentsquare](https://aiagentsquare.com/agents/deepgram)
- Deepgram keyterm prompting add-on: about $0.0013/min. Diarization: about $0.0020/min. — [aiagentsquare](https://aiagentsquare.com/agents/deepgram)
- AssemblyAI Universal-Streaming English: $0.15/h ($0.0025/min), billed for the whole time the WebSocket stays open, including idle time. Universal-3.5 Pro Realtime: $0.45/h. — [buildmvpfast / convertaudiototext roundups](https://www.buildmvpfast.com/api-costs/transcription)
- Soniox real-time: $0.12/h (~$0.002/min). Async: $0.10/h. — [Soniox pricing](https://soniox.com/pricing)
- ElevenLabs Scribe v2 Realtime: $0.39/h (~$0.0065/min). One review puts it at $0.39-0.48/h depending on plan. Batch Scribe v2: $0.22/h. — [ElevenLabs API pricing](https://elevenlabs.io/pricing/api)
- Gladia real-time: $0.75/h pay-as-you-go Starter, down to $0.25/h at volume (one 2026 guide). — [Gladia blog / futureagi](https://www.gladia.io/blog/best-speech-to-text-apis)
- Speechmatics: no full public price list. Quotes range from ~$0.24/h (Pro tier) to $0.54/h (real-time Enhanced, per Soniox's comparison page). — [Soniox pricing compare](https://soniox.com/compare/stt/pricing)
- OpenAI: gpt-4o-transcribe batch about $0.006/min, gpt-4o-mini-transcribe $0.003/min, realtime/streaming transcription about $0.017/min (another page lists $0.02/min). — [costgoat (Oct 2026)](https://costgoat.com/pricing/openai-transcription)

### Inferences
- For English, Flux's main value is the built-in end-of-turn signal, not raw accuracy or price. Soniox is about 3x cheaper and scores at least as well on independent English WER. Switching would mean moving turn detection elsewhere (e.g. Smart Turn or LiveKit's model).
- For Spanish, the only head-to-head numbers are vendor-run on wideband audio. The quickest way to decide is to record 30-50 real Spanish and Spanglish calls (8 kHz mu-law) and score Flux-multi, Nova-3-multi and Soniox on names, addresses and street names.

### Gaps
- No verified figures for Google Chirp 3 or Azure streaming latency/WER/price, or for Whisper-on-Groq (batch-only, not streaming) cost per hour. The searches did not surface them, and Groq's pricing page could not be fetched.
- No independent telephony-specific (8 kHz) WER table, and no Spanish code-switching benchmark covering Flux.
- No comparative data on how well keyterm/keyword boosting works for proper nouns or street names across vendors. Only Deepgram's add-on price was found.

## 2. Turn detection (end-of-turn / endpointing)

### Takeaway
Model-based turn detection beats pure silence timers, but every detector trades false cut-offs against delay. Deepgram Flux defaults to `eot_threshold` 0.7 and `eot_timeout_ms` 5000. Its eager mode signals 150-250 ms earlier at the cost of 50-70% more LLM calls (vendor claim). Silence floors are typically 100-800 ms, and AssemblyAI documents 160 ms (aggressive) to 800 ms (conservative). Independent comparisons of LiveKit's model and Pipecat Smart Turn disagree.

### Cited Findings
- Deepgram Flux `eot_threshold`: range 0.5-0.9 in the configuration page, default 0.7. The API reference lists 0.5-1.0, where 1.0 disables confidence-based EOT. Higher values mean more certainty and slightly more latency. — [Deepgram Flux configuration](https://developers.deepgram.com/docs/flux/configuration); [Flux API reference](https://developers.deepgram.com/reference/speech-to-text/listen-flux)
- Flux `eager_eot_threshold`: off unless set, range 0.3-0.9. EagerEndOfTurn and TurnResumed events fire only when it is configured. — [Deepgram Flux configuration](https://developers.deepgram.com/docs/flux/configuration)
- Flux `eot_timeout_ms`: default 5000, range 500-60000. It ends an idle turn even without high EOT confidence. — [Flux API reference](https://developers.deepgram.com/reference/speech-to-text/listen-flux)
- Vendor claim: with `eager_eot_threshold` at 0.3-0.5, EagerEndOfTurn arrives 150-250 ms before EndOfTurn, at the cost of 50-70% more LLM calls (speculative generations that get thrown away on TurnResumed). — [Deepgram Flux launch post](https://deepgram.com/learn/introducing-flux-conversational-speech-recognition); [Eager EOT guide](https://developers.deepgram.com/docs/flux/voice-agent-eager-eot)
- Flux supports on-the-fly reconfiguration mid-stream (e.g. changing thresholds or keyterms as the conversation moves on). — [Deepgram blog](https://deepgram.com/learn/flux-on-the-fly-configuration)
- Pipecat Smart Turn: v3 runs CPU inference in about 12 ms (vendor). The README says ~10 ms on some CPUs and under 100 ms on most cloud instances. It is audio-only and runs during silence alongside Silero VAD. v3.1 accuracy on Daily's test set: 94.7% English (8 MB model) and 95.6% (32 MB), up from 88.3% for v3.0. — [Daily: Smart Turn v3](https://www.daily.co/blog/announcing-smart-turn-v3-with-cpu-inference-in-just-12ms/); [Daily: Smart Turn v3.1](https://www.daily.co/blog/improved-accuracy-in-smart-turn-v3-1/); [GitHub smart-turn](https://github.com/pipecat-ai/smart-turn)
- LiveKit EOT leaderboard (vendor-run): at a 300 ms latency budget, LiveKit Turn Detector v1 has a 9.9% false cut-off rate vs. 35.2% for Smart Turn v3.2. — [LiveKit EOT bench](https://livekit.com/benchmarks/eot-bench)
- Independent preprint (Voice-Light, arXiv 2609.20995), on real conversations: EOT recall of 91.50% for LiveKit vs. 20.72% for Smart Turn, with a caveat about possible training-data overlap. Smart Turn emits its boundary score at 240 ms and LiveKit at 320 ms. — [arXiv 2609.20995](https://arxiv.org/pdf/2609.20995)
- A third-party LiveKit plugin for Smart Turn reports a p50 of 84.5 ms (single thread, laptop CPU, inference only). — [smart-turn-livekit on PyPI](https://pypi.org/project/smart-turn-livekit/0.3.0/)
- AssemblyAI legacy Universal-Streaming: a turn ends when confidence exceeds `end_of_turn_confidence_threshold` (default 0.4) and `min_turn_silence` (default 400 ms) has passed. The docs suggest 160 ms / 0.4 for aggressive agents and 800 ms / 0.7 for conservative ones. Lower silence values split numbers and proper nouns more often. Universal-3.x Pro streaming switched to punctuation-based turn detection, and the confidence parameter is deprecated. Defaults conflict across sources (100 ms vs. 300 ms). LiveKit's integration lowers the threshold to 0.01. — [AssemblyAI turn detection docs](https://assemblyai.com/docs/streaming/universal-streaming/turn-detection); [AssemblyAI migration guide](https://www.assemblyai.com/docs/streaming/migration-guides/universal-to-universal-3-5-pro-streaming); [LiveKit AssemblyAI plugin](https://docs.livekit.io/agents/models/stt/assemblyai/)
- OpenAI Realtime: `turn_detection.type = semantic_vad` with `eagerness` low/medium/high/auto. Low gives users more time and high cuts in as soon as possible; auto behaves like medium. Developers report that Azure ignored semantic_vad updates and stayed on server_vad. — [OpenAI VAD guide](https://developers.openai.com/api/docs/guides/realtime-vad); [LiveKit OpenAI plugin](https://docs.livekit.io/agents/models/realtime/plugins/openai/); [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5521485/azure-openai-realtime-api-ignores-semantic-vad-tur)
- Kwindla Kramer (Daily/Pipecat) notes that when the STT model delivers final transcripts outside the VAD timeout window, Pipecat adds an aggregation delay that "pads your voice-to-voice response time substantially". — [Kwindla, "Advice on Voice Agents", June 2025](https://gist.github.com/kwindla/f755284ef2b14730e1075c2ac803edcf)
- Measurement caveat: Twilio sends audio continuously (including silence), which skews naive measurements of final-transcript latency. — [Deepgram GitHub discussion #1006](https://github.com/orgs/deepgram/discussions/1006)

### Inferences
- In this stack, Flux's EOT is the natural detector. The main tuning levers are `eot_threshold` (0.7 default; raise it to around 0.8 if callers get cut off while reading addresses or phone numbers) and eager EOT with speculative LLM calls. On Groq's very cheap gpt-oss pricing, 50-70% more LLM calls costs little money but uses rate-limit headroom.
- Per-state tuning is worthwhile: be more conservative while collecting digits, addresses or names, and more eager on yes/no confirmations. AssemblyAI's guidance on entity splitting at low silence settings supports this, and Flux's mid-stream reconfiguration makes it possible.

### Gaps
- No published data on Krisp's turn-taking model (accuracy, latency, price) was found.
- No published false-cut-off rate or latency distribution for Flux EOT from an independent source.
- No authoritative OpenAI default for `silence_duration_ms`. The commonly cited 500 ms appeared only in third-party code.

## 3. LLMs for voice: TTFT, throughput, price, rate limits, tool calling

### Takeaway
Groq's gpt-oss-120b is about $0.15/$0.60 per 1M tokens (input/output), with cached input at $0.075 and roughly 480-500 tokens/s. Its TTFT is dominated by reasoning effort, so use low reasoning for voice. Cerebras is about 3x faster at $0.35/$0.75. Closed "mini" models (GPT-4.1-mini) sit around 0.8 s TTFT, and reasoning models like GPT-5-mini or Haiku 4.5 (reasoning) are unusable for voice unless reasoning is turned off. The Groq free tier (about 30 RPM / 1K RPD / 8K TPM on gpt-oss-120b, per third-party sources) is too small for production. The Developer tier is reported at about 1K RPM / 250K TPM.

### Cited Findings
**Groq (prices consistent across third-party sources; Groq's page itself could not be fetched)**
- openai/gpt-oss-120b: $0.15 per 1M input tokens, $0.075 cached input, $0.60 output. openai/gpt-oss-20b: $0.075 input, ~$0.0375 cached, $0.30 output. Cached tokens get 50% off, apply only to the gpt-oss family, expire after 2 h unused, and do not count toward rate limits. — [CloudZero Groq pricing 2026](https://www.cloudzero.com/blog/groq-pricing/); [eesel Groq pricing](https://www.eesel.ai/blog/groq-pricing); [Glamdring, Sep 2026](https://www.glamdringresearch.com/post/groq-api-pricing)
- Conflict: Requesty lists gpt-oss-20b at $0.10/$0.50. This appears to be a reseller markup, not Groq's list price. — [Requesty](https://www.requesty.ai/models/groq/openai-gpt-oss-20b)
- Rate limits: the free tier is reported at 30 RPM, 1K RPD and 8K TPM on gpt-oss-120b. The Developer tier is reported at 1K RPM and 250K TPM for both gpt-oss models. Sources disagree on daily caps: one says Developer has no daily token cap, another lists 500K requests per day. A 2026 blog says the free tier is 1,000 requests a day and Llama models have been removed. — [CloudZero](https://www.cloudzero.com/blog/groq-pricing/); [klymentiev](https://klymentiev.com/blog/groq-pricing)
- gpt-oss-120b on Groq supports tool use, browser search, code execution and JSON-schema mode. — [GroqDocs model page (via search)](https://console.groq.com/docs/model/openai/gpt-oss-120b)
- TTFT on Groq: Artificial Analysis gives 4.87 s time to first *answer* token for gpt-oss-120b at **high** reasoning (includes thinking), vs. Cerebras 1.61 s and SambaNova 3.96 s. Third-party pages give 0.74 s at high effort and a p95 TTFT of 0.50 s over a trailing 7 days. TTFT is driven by input length and `reasoning_effort`. Throughput is about 478-500 tokens/s. — [Artificial Analysis gpt-oss-120b providers](https://artificialanalysis.ai/models/gpt-oss-120b/providers); [markaicode Groq benchmark](https://markaicode.com/benchmarks/groq-mixtral-m4-max-latency-benchmark/); [benchlm](https://benchlm.ai/models/gpt-oss-120b)
- The gpt-oss model card evaluates tool use on τ-Bench Retail, with functions supplied in the developer message. No Groq-specific function-calling reliability score was found. — [gpt-oss model card, arXiv 2508.10925](https://arxiv.org/pdf/2508.10925)

**Cerebras**
- gpt-oss-120b: $0.35 input / $0.75 output per 1M tokens (public rate card, Oct 2026). Its other listed model is Qwen 3.8 27B at $0.99/$1.49. — [morphllm Cerebras pricing](https://www.morphllm.com/cerebras-pricing); [spheron Groq vs Cerebras](https://www.spheron.network/blog/groq-lpu-vs-cerebras-wse-cheapest-inference-2026/)
- Throughput: vendor claims ~3,000 tokens/s. Artificial Analysis measured ~1,700 tokens/s sustained (Jul 2026), and ~1,812 tokens/s at high / ~1,670 at low reasoning (Jun 2026 table). TTFT of ~0.52 s from a single uncorroborated source. — [morphllm](https://www.morphllm.com/cerebras-pricing); [benchlm Cerebras vs Groq](https://benchlm.ai/blog/posts/cerebras-won-speed-not-the-shortlist)

**Closed models (Artificial Analysis comparison pages; snapshot dates vary)**
- GPT-4.1 mini: ~0.80-0.85 s TTFT, ~150-152 tokens/s. GPT-4.1: 0.87 s TTFT, 150.6 tokens/s. — [AA: Gemini 2.5 Flash vs GPT-4.1 mini](https://artificialanalysis.ai/models/comparisons/gemini-2-5-flash-preview-09-2025-reasoning-vs-gpt-4-1-mini); [AA: GPT-5 mini vs GPT-4.1](https://artificialanalysis.ai/models/comparisons/gpt-5-mini-vs-gpt-4-1)
- GPT-5 mini (high reasoning): 44.7-105.7 s to first answer token (includes thinking), 164 tokens/s. Claude Haiku 4.5 (reasoning): 18.3 s to first answer token. These are reasoning-mode figures and are not comparable to non-reasoning TTFT. — [AA: Haiku 4.5 vs GPT-5 mini](https://artificialanalysis.ai/models/comparisons/claude-4-5-haiku-reasoning-vs-gpt-5-mini)
- Gemini 2.5 Flash: ~450 ms TTFT and ~204.5 tokens/s in a non-AA blog benchmark (methodology differs). — [kunalganglani 2026 LLM latency](https://www.kunalganglani.com/blog/llm-api-latency-benchmarks-2026)
- Generic 2026 guidance: a good voice LLM reaches 150-300 ms TTFT on a typical voice prompt (another source says 200-500 ms). These are ranges, not measurements. — [Gradium/Retell summary](https://www.retellai.com/blog/how-real-time-voice-ai-works-stt-llm-tts)
- MarkTechPost ran a TTFT-first comparison of inference APIs for voice (Aug 2026). Its bottom-up table totals 790 ms-1.3 s voice-to-voice. — [MarkTechPost](https://www.marktechpost.com/2026/08/30/lowest-latency-inference-apis-for-voice-and-realtime-agents-a-time-to-first-token-ttft-first-benchmark/)

### Inferences
- For voice, run gpt-oss-120b with `reasoning_effort: low` and keep the system prompt stable so it is cached (50% input discount, and cached tokens do not count against TPM). The main latency risk on Groq is not tokens/s but TTFT variance and 429s under rate limits. Moving off the free tier to Developer is the single biggest reliability step.
- Rough capacity: at ~3-4K input tokens per turn and ~6 turns per call-minute, one concurrent call uses ~20-25K TPM. A 250K TPM Developer limit then supports about 10 concurrent calls before caching relief (more with caching, since cached tokens are exempt). This is my estimate, not a measured figure.
- Cerebras is the latency upgrade path for the same model (about 3x throughput) at roughly 2.3x the input price. At voice-sized outputs, the speed gain matters mainly for TTFT, which was only weakly sourced.

### Gaps
- No verified current TTFT numbers were found for GPT-4o-mini, GPT-4.1-nano, GPT-5-nano, Gemini 3 Flash/Flash-Lite, SambaNova, Fireworks or Together on voice-sized prompts, and no prices for those providers.
- No independent function-calling reliability benchmark (e.g. BFCL / τ-Bench score per provider) was found specifically for Groq-hosted gpt-oss.
- Groq Developer-tier daily caps conflict across sources and could not be checked against console.groq.com (fetch blocked).

## 4. Text-to-speech

### Takeaway
On naturalness, ElevenLabs Eleven v4 / v4 Turbo, Cartesia Sonic 3.6 and Inworld Realtime TTS-2 lead Artificial Analysis (Sep 2026). Inworld is the cheapest of the top three at ~$20.8 per 1M characters. Deepgram Aura-2 costs $0.030 per 1K characters ($30 per 1M) and Groq Orpheus costs $22 per 1M characters, but Orpheus is English and Arabic only (no Spanish), preview status, and limited to 200 characters per request. Vendor TTFB claims (40-90 ms) are model-only figures. The independent Coval P50s were 155-340 ms.

### Cited Findings
**Naturalness rankings (Artificial Analysis)**
- 29 Sep 2026 snapshot, Provider Voice arena: Eleven v4 1,319 Elo ($80 per 1M characters), Cartesia Sonic 3.6 1,276 ($49), Inworld Realtime TTS-2 1,246 ($20.8). This is secondhand via an article. — [progressiverobot](https://www.progressiverobot.com/2026/09/28/eleven-v4-turbo-elevenlabs-tops-tts-arena/)
- AA Controlled Voice leaderboard: Eleven v4 Turbo 1,168 ($40 per 1M), Eleven v4 1,160 ($80), Inworld TTS-2 1,144 ($20.8), Cartesia Sonic 3.6 1,143 ($49). — [Artificial Analysis Controlled Voice](https://artificialanalysis.ai/text-to-speech/leaderboard/controlled-voice)
- Before Eleven v4 launched (early-to-late Sep 2026), Cartesia Sonic 3.6 ranked first at ~1,273-1,282 Elo and Inworld TTS-2 at ~1,245-1,252. — [teamday](https://www.teamday.ai/blog/best-ai-voice-models-2026)
- Artificial Analysis launched multilingual TTS arenas covering 9 languages including Spanish. It notes that performance varies widely by language. — [Artificial Analysis on X](https://x.com/ArtificialAnlys/status/2102490340678856997)
- No Artificial Analysis Elo or per-character price was found for Rime. Rime's pricing is tiered. — [Coval TTS blog](https://www.coval.ai/blog/best-text-to-speech-providers-in-2026-how-to-choose-(and-why-vendor-benchmarks-lie)/)

**Latency (time to first audio)**
- Coval benchmark, May 2026 (independent, reported by competitor Gradium): Gradium ~155 ms P50, Cartesia Sonic-3 188 ms, ElevenLabs Turbo v2.5 264 ms, Rime Mist-v3 337 ms P50 with a 381 ms IQR (high variance). Some models were batch-only at over 1.2 s. — [Gradium TTS latency benchmark 2026](https://gradium.ai/content/tts-latency-benchmark-2026)
- Vendor model-level claims: Cartesia Sonic-3 ~90 ms, Sonic Turbo ~40 ms (Sonic 4 Turbo ~40 ms TTFA), ElevenLabs Flash v2.5 ~75 ms. — [Gradium](https://gradium.ai/content/best-low-latency-tts-apis-2026); [futureagi TTS roundup](https://futureagi.com/blog/best-text-to-speech-providers-2026/)
- Caveat: ElevenLabs' ~75 ms Flash figure is model latency. In Cekura's fixed-stack full-turn test, the p50 was 1.73 s. — [Coval "vendor benchmarks lie"](https://www.coval.ai/blog/best-text-to-speech-providers-in-2026-how-to-choose-(and-why-vendor-benchmarks-lie)/)

**Prices (third-party aggregators unless noted; dates 2026)**
- Deepgram Aura-2: $0.030 per 1K characters (~$27 per 1M on Growth). Aura-1: ~$0.015 per 1K. — [aiagentsquare](https://aiagentsquare.com/agents/deepgram)
- ElevenLabs Flash v2.5: $40-60 per 1M characters depending on source and plan, or ~$0.045 per spoken minute. Eleven v3 / Multilingual v2: ~$0.08 per 1K. — [speechify TTS pricing at volume](https://speechify.ai/blog/tts-api-pricing-at-volume-2026); [nineninesix](https://www.nineninesix.ai/blog/tts-api-pricing-comparison-2026)
- Cartesia Sonic 3.6: ~$37-50 per 1M characters depending on plan (1 credit ≈ 1 character), ~$30 on the Scale tier. — [speechify comparison](https://speechify.ai/blog/best-tts-providers-2026-comparison)
- OpenAI gpt-4o-mini-tts: $0.60 per 1M text input tokens plus $12 per 1M audio output tokens, about $0.015 per minute. tts-1: $15 per 1M characters. — [tokencost](https://tokencost.app/blog/tts-api-pricing-2026); [texttolab](https://texttolab.com/blog/openai-tts-pricing)
- Groq Orpheus: canopylabs/orpheus-v1-english at $22 per 1M characters, Arabic (Saudi) at $40. Maximum 200 characters per request, preview status, English and Arabic only (no Spanish). Free-tier limits are reported as 10 RPM / 100 RPD / 3,600 TPD. Only a throughput figure (~100 chars/s) was found, no time to first byte. — [GroqDocs Orpheus (via search)](https://console.groq.com/docs/text-to-speech/orpheus); [adwaitx](https://www.adwaitx.com/groq-canopy-orpheus-tts-groqcloud-launch/); [agentdeals PR](https://github.com/robhunter/agentdeals/pull/2580)
- Inworld Realtime TTS-2: ~$20.8 per 1M characters (AA listing). — [Artificial Analysis](https://artificialanalysis.ai/text-to-speech/leaderboard/controlled-voice)

**Telephony output and Spanish**
- ElevenLabs can output `ulaw_8000` directly (μ-law 8 kHz), which is forwarded to Twilio without resampling. Its Twilio tutorial uses Flash v2.5 in this format. An older Pipecat issue showed the wrapper rejecting ulaw_8000. — [ElevenLabs Twilio tutorial](https://elevenlabs.io/blog/build-voice-agent-twilio-elevenlabs); [Pipecat issue #1632](https://github.com/pipecat-ai/pipecat/issues/1632)
- Cartesia supports μ-law 8 kHz output over WebSocket (`pcm_mulaw`, per a third-party comparison). — [apiscout](https://apiscout.dev/guides/elevenlabs-vs-cartesia-voice-ai-api-2026)
- Deepgram Aura-2 covers seven languages, with speed and IPA pronunciation controls for English and Spanish. Deepgram's model guide says Aura-1 has the broadest English and Spanish catalog. A search summary mentions an English-only Deepgram "Flux TTS" model, which could not be verified. — [Deepgram TTS models](https://developers.deepgram.com/docs/voice-agent-tts-models); [Cartesia comparison page](https://www.cartesia.ai/vs/elevenlabs-vs-deepgram)

### Inferences
- Rough per-minute TTS cost for a receptionist (agent speaking ~40% of the call at ~900 characters per spoken minute, so ~360 characters per call-minute; my estimate): Aura-2 ≈ $0.011, Orpheus ≈ $0.008, Inworld ≈ $0.0075, Cartesia ≈ $0.013-0.018, ElevenLabs Flash ≈ $0.014-0.022, Eleven v4 ≈ $0.029.
- Orpheus on Groq cannot serve Spanish callers, and the 200-character cap forces sentence-level chunking. Keep Aura-2 (or a Spanish-capable alternative) for Spanish.
- Requesting μ-law 8 kHz directly from the TTS provider avoids a resampling step and some bytes. Check that each chosen provider supports it natively.

### Gaps
- No verified prices or time-to-first-byte numbers for Rime Arcana/Mist, Hume Octave, PlayHT/PlayAI (status after Meta's acquisition unknown) or self-hosted Kokoro.
- No independent Spanish naturalness ranking with numbers. The AA multilingual arena exists, but its Spanish results were not retrieved.
- No independent time-to-first-byte figure for Deepgram Aura-2 or Groq Orpheus was found.

## 5. Speech-to-speech (S2S) vs cascaded

### Takeaway
S2S options in 2026 include OpenAI gpt-realtime-2.1 / -2.1-mini, Gemini 3.8 Live and Ultravox (now owned by Inworld). The mini/Live tiers are nominally $0.02-0.05 per minute, but they are billed by token and the context is re-billed every turn, so measured production costs run higher (one dataset: $0.063-0.146 per minute for gpt-realtime-mini). Cascaded stacks give more control: per-stage swapping, per-state turn tuning, deterministic validators, and transcripts for auditing. No independent hallucination or tool-calling comparison was found.

### Cited Findings
- OpenAI gpt-realtime-2.1: $32 per 1M audio input tokens ($0.40 cached), $64 per 1M audio output. gpt-realtime-2.1-mini: $10 input / $0.30 cached / $20 output, the same as the prior gpt-realtime-mini but with reasoning added (released Jul 2026). — [OpenAI pricing](https://developers.openai.com/api/docs/pricing); [MarkTechPost, 2026-07-06](https://www.marktechpost.com/2026/07/06/openai-gpt-realtime-2-1-mini-reasoning-realtime-api/)
- Per-minute estimates for OpenAI realtime vary: ~$0.077 per minute of bot speech for the flagship and ~$0.024 for the mini (assuming ~1,200 output tokens per minute), another estimate of ~$0.016 per minute for the mini, and a measured $0.063-0.146 per minute for gpt-realtime-mini across 4,000 production sessions (plus separate transcription). — [forasoft](https://www.forasoft.com/blog/article/openai-realtime-api-pricing); [HackerNoon, 4,000 sessions](https://hackernoon.com/openai-realtime-api-pricing-in-2026-real-world-data-from-4000-measured-sessions)
- Gemini 3.8 Live: audio input $3 per 1M tokens (~$0.005 per minute by Google's estimate), audio output $12 per 1M tokens (~$0.018 per minute, including thinking tokens). That works out to about $1.38 per hour of conversation. A Google forum answer says accumulated audio tokens are re-billed at the input rate on every turn, so long calls cost more than the simple math suggests. — [datacamp](https://www.datacamp.com/blog/gemini-3-8-live); [pasqualepillitteri](https://pasqualepillitteri.it/en/news/16547/gemini-3-8-live-audio-model); [Google AI forum](https://discuss.ai.google.dev/t/pricing-of-speech-to-speech-live-model/140340)
- Ultravox: 30 free minutes, then $0.05 per minute, plus a $100/month Pro plan (official pricing page). The 2024 launch claimed latency comparable to GPT-4o Realtime at a third of the cost. Inworld has acquired Ultravox, and one article advises getting the per-minute rate and bring-your-own-TTS terms in writing. — [Ultravox pricing](https://www.ultravox.ai/pricing); [Fixie/Ultravox on X](https://x.com/FixieAI/status/1856823608926244944); [beri.net](https://www.beri.net/article/inworld-ultravox-acquisition-voice-agent-platform-third-party-tts-continuity-pricing)
- OpenAI's Agents SDK has a Twilio extension that connects Twilio Media Streams directly to the Realtime API. — [OpenAI Agents JS: Twilio](https://openai.github.io/openai-agents-js/extensions/twilio/)
- A developer reports that server_vad broke tool use in the Realtime API. — [OpenAI community](https://community.openai.com/t/using-server-vad-breaks-tool-use-in-realtime-api/1362139)
- Gradium (vendor) frames the 2026 tradeoff as cascaded vs. S2S. A generic summary says S2S can go below the 500-700 ms budget typical of cascaded stacks. — [Gradium cascaded vs S2S](https://gradium.ai/content/cascaded-voice-agent-vs-speech-to-speech-2026)
- Research preprints are exploring tool calls in full-duplex speech models through a frontend/backend split, which suggests tool calling in native S2S is still an open engineering problem. — [arXiv 2609.19334](https://arxiv.org/pdf/2609.19334)

### Inferences
- For a receptionist whose correctness depends on structured extraction (names, dates, addresses) and validators, a cascaded stack keeps the text layer where rules and schema validation run. S2S would collapse that layer and make the reader/validator architecture harder to keep.
- Nominal S2S per-minute prices are similar to or higher than a Groq-based cascade (see section 7), so cost is not a reason to switch.

### Gaps
- No independent head-to-head of voice-to-voice latency, hallucination rate or function-calling accuracy between S2S and cascaded systems.
- Nothing found on Moshi in production.

## 6. End-to-end latency budget on phone calls

### Takeaway
The practitioner consensus target is about 800 ms median voice-to-voice (Kwindla/Pipecat), with ~1.5 s acceptable for early prototypes. Callers start talking over the agent when responses run ~300 ms past the budget. Hosted platforms measured at 680-850 ms median and 920-1,180 ms p95 (Telnyx, vendor-run). The PSTN/Twilio leg is not published by Twilio. Practitioners report a few hundred ms up to over 1 s of telephony buffering, which is outside the developer's control.

### Cited Findings
- Kwindla Kramer (Pipecat): aim for 800 ms median voice-to-voice latency eventually; 1,500 ms is fine for an initial proof of concept. His budget shows LLM ~500 ms and TTS ~200 ms. A secondary article attributes a ~200 ms-per-stage split to him (transport, STT+endpointing, LLM, TTS); this is secondhand. — [Kwindla gist, June 2025](https://gist.github.com/kwindla/f755284ef2b14730e1075c2ac803edcf); [futureagi Pipecat latency](https://futureagi.com/blog/how-to-optimize-pipecat-latency-2026/)
- Self-hosted Twilio guide: to feel human, audio must come back in under 800 ms. Miss that by ~300 ms and callers start talking over the agent. — [husnainbukhari](https://www.husnainbukhari.com/blog/self-host-ai-voice-agent)
- The telephony platform's buffers plus the network, between the last audio chunk sent and playback at the caller's ear, add from a couple hundred ms to over a second. Local testing hides this. — [DEV: When is it safe to open the microphone](https://dev.to/petersoos/when-is-it-safe-to-open-the-microphone-building-a-realtime-voice-agent-on-twilio-3ddo)
- Twilio Media Streams deliver 8 kHz μ-law in 20 ms frames as JSON over WebSocket (a 20 ms framing floor). — [genaihub Twilio](https://genaihub.eu/technical/twilio-voice)
- Telnyx (vendor) measured 500 calls per platform: Retell 680 ms median / 920 ms p95, Vapi 720 / 1,050, Bland 850 / 1,180. Its estimate for a generic self-stitched stack is 600-1,700 ms. — [Telnyx latency comparison](https://telnyx.com/resources/voice-ai-agents-compared-latency)
- Common budget: 500-700 ms across STT+LLM+TTS. Gradium claims 420-520 ms total turn latency (vendor). — [Gradium](https://gradium.ai/content/cascaded-voice-agent-vs-speech-to-speech-2026)
- MarkTechPost's bottom-up table: 790 ms-1.3 s, at or slightly above the 800 ms target. — [MarkTechPost Aug 2026](https://www.marktechpost.com/2026/08/30/lowest-latency-inference-apis-for-voice-and-realtime-agents-a-time-to-first-token-ttft-first-benchmark/)
- Techniques documented in sources:
  - Eager EOT with speculative LLM generation (150-250 ms saved, vendor claim).
  - Streaming at every stage.
  - Prompt caching, which on Groq also avoids rate-limit consumption.
  - Low reasoning effort.
  - Asking the TTS provider for μ-law 8 kHz directly to skip resampling.
  - Testing latency on live PSTN calls rather than locally.
  — [Deepgram eager EOT](https://developers.deepgram.com/docs/flux/voice-agent-eager-eot); [CloudZero Groq caching](https://www.cloudzero.com/blog/groq-pricing/); [ElevenLabs Twilio](https://elevenlabs.io/blog/build-voice-agent-twilio-elevenlabs); [futureagi 12 techniques](https://futureagi.com/blog/how-to-optimize-pipecat-latency-2026/)
- P95/P99 under load matters more than the P50 figures vendors publish. — [Coval TTS blog](https://www.coval.ai/blog/best-text-to-speech-providers-in-2026-how-to-choose-(and-why-vendor-benchmarks-lie)/)

### Inferences
- An illustrative budget for this stack, measured from the caller's last word to the first agent audio at the caller's ear (my synthesis of the ranges above, not a measured figure):

  | Stage | Estimate |
  |---|---|
  | PSTN + Twilio inbound | ~100-150 ms |
  | Flux EOT decision after speech stops | ~200-400 ms with `eot_threshold` 0.7; less with eager EOT |
  | Groq gpt-oss-120b TTFT at low reasoning plus the first sentence | ~200-500 ms |
  | Aura-2 first byte | ~150-250 ms |
  | Twilio/PSTN outbound buffering | ~100-200 ms+ |
  | **Total** | **≈ 750-1,500 ms** |

- Reasonable targets: p50 ≤ 900 ms and p95 ≤ 1.5 s measured on real calls. Eager EOT and filler or pre-rendered phrases are the main levers for staying under 800 ms.
- Server co-location matters. Deepgram, Groq and Twilio media regions should be in the same area as the app server (e.g. US-East/US-West), since each extra cross-country hop adds ~60-80 ms round trip (general networking knowledge, not sourced here).

### Gaps
- No Twilio-published Media Streams or PSTN latency figure.
- No independent per-stage measurement of a Flux + Groq + Aura-2 pipeline.

## 7. Realistic all-in cost per minute

### Takeaway
A self-built Groq-based cascade comes to roughly $0.03-0.04 per call-minute all-in (including Twilio), which is well below the $0.05-0.15 per minute that hosted platforms advertise and their real $0.12-0.25 per minute. S2S per-minute costs nominally run $0.02-0.08 for model usage alone, plus telephony, and measured gpt-realtime-mini sessions came to $0.06-0.15 per minute.

### Cited Findings
- Twilio inbound ~$0.0085/min, outbound ~$0.014/min. Media Streams ~$0.002/min per stream (third-party; not verified against Twilio). — [telphiconsulting](https://www.telphiconsulting.com/blog/twilio-ai-voice-agent-cost); [bitbytes](https://www.bitbytes.io/blog/ai-voice-speech-tools/ai-voice-agent-pricing)
- Component ranges: STT $0.004-0.024/min, LLM $0.003-0.08/min, TTS $0.02-0.10/min, telephony $0.008-0.014/min, platform orchestration fees $0.05-0.14/min. Advertised hosted rates are $0.05-0.15/min. The actual all-in cost for most production deployments is $0.12-0.25/min. — [opennash](https://opennash.com/blog/ai-voice-agent-cost-per-minute-what-005-to-100-actually/); [agentcxlabs](https://agentcxlabs.com/blog/ai-voice-agent-pricing-2026)
- Raw component cost (STT+LLM+TTS+telephony) is about $0.05-0.09 per minute in 2026. One blog calculates ~$0.032/min for an optimized Deepgram + GPT-4o-mini stack. — [autointerviewai](https://www.autointerviewai.com/blog/real-cost-ai-voice-agents-pricing-breakdown-2026); [aliteq](https://aliteq.com/ai-voice-agent-cost-per-minute)
- Hidden multipliers: billing for silence (AssemblyAI bills open-socket time, and Flux is billed on streamed audio), per-call rounding, and concurrency reservations. — [softcery calculator](https://softcery.com/ai-voice-agents-calculator); [buildmvpfast](https://www.buildmvpfast.com/api-costs/transcription)
- S2S: Ultravox $0.05/min. Gemini 3.8 Live ~$0.023/min nominal before context re-billing. gpt-realtime-mini estimated at $0.016-0.024/min, measured at $0.063-0.146/min. — sources in section 5

### Inferences
- Estimate for the current stack per call-minute (my arithmetic from the cited prices; assumes the caller speaks ~50% of the time, the agent ~40%, ~6 LLM turns per minute at ~3K input / ~60 output tokens, half the input cached):

  | Item | Cost per call-minute |
  |---|---|
  | Twilio inbound | $0.0085 |
  | Media Streams | ~$0.002 |
  | Flux | $0.0065-0.0077 (whole call streamed) |
  | Keyterm add-on (if billed separately with Flux; unverified) | ~$0.0013 |
  | gpt-oss-120b | ~$0.002 |
  | gpt-oss-20b classifier | ~$0.0005 |
  | Aura-2 | ~$0.011 |
  | **Total** | **≈ $0.031-0.034/min** |

- Swapping Aura-2 for Orpheus (English) saves ~$0.003/min. Swapping Flux for Soniox saves ~$0.005/min. Both savings are small compared with the cost of telephony plus TTS.
- Reasonable cost target: ≤ $0.04/min for English, and ≤ $0.05/min with premium TTS (Cartesia/ElevenLabs) or Spanish. At 1,000 call-minutes per month per client, the AI plus telephony bill comes to about $35-50.

### Gaps
- Twilio's Media Streams per-minute fee and current inbound rates were not verified on Twilio's site (fetch blocked).
- No measured (as opposed to calculated) all-in cost per minute for a self-built Twilio + Deepgram + Groq stack was found.
