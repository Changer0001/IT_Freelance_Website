# Voice-AI Agent Platforms Behind AI Phone Receptionists (state as of Oct 2026)

Method note for the report writer: research was done on 2026-10-13. Direct page fetching was blocked in this environment (egress policy denied vendor domains), so every finding below comes from search-engine result summaries of the cited pages. Where a search summary quoted an official page (docs.*, vendor pricing page, official blog) the source is marked [official]; third-party blogs are marked [3rd-party]; competitor-written pages are marked [competitor]. Several third-party "pricing 2026" blogs look AI-generated and contradict each other; I flag conflicts rather than pick silently. Prices are as reported in Aug-Oct 2026 unless dated otherwise.

## 1. Architecture of each platform: cascaded vs speech-to-speech, default/selectable STT-LLM-TTS, bring-your-own LLM

### Takeaway
The market splits into (a) hosted cascaded orchestrators priced per minute (Vapi, Retell, Bland, Synthflow, ElevenLabs Agents, Telnyx, Deepgram Voice Agent API, Cartesia Line, Twilio ConversationRelay), (b) open-source frameworks with optional managed hosting (LiveKit Agents + LiveKit Cloud, Pipecat + Pipecat Cloud), and (c) native speech-to-speech model APIs (OpenAI gpt-realtime-2.x / GPT-Live-1, Google Gemini 3.8 Live, Ultravox). Almost all hosted orchestrators let you bring your own LLM endpoint; Retell itself discourages its custom-LLM path in favour of its built-in agents.

### Cited Findings
**Vapi (hosted cascaded orchestrator)**
- Orchestration layer (endpointing, interruption detection, backchanneling) runs exclusively on Vapi infrastructure; STT/LLM/TTS are pluggable providers — [Vapi Data Flow, official](https://docs.vapi.ai/security-and-privacy/data-flow)
- BYOK transcribers listed: Deepgram, Gladia, AssemblyAI, Speechmatics, Google, Azure; Deepgram available via default integration or own key — [Vapi Deepgram docs, official](https://docs.vapi.ai/providers/transcriber/deepgram); [Vapi Data Flow, official](https://docs.vapi.ai/security-and-privacy/data-flow)
- BYOK voice providers include ElevenLabs, PlayHT, Cartesia, Deepgram, OpenAI TTS, Azure; custom TTS via audio-streaming endpoint — [Vapi Data Flow, official](https://docs.vapi.ai/security-and-privacy/data-flow)
- Custom LLM: any OpenAI-compatible endpoint, provider `custom-llm` + base URL (+ credential) — [Vapi custom LLM, official](https://docs.vapi.ai/customization/custom-llm/fine-tuned-openai-models); [Vapi tool-calling integration, official](https://docs.vapi.ai/customization/tool-calling-integration); [Using your server, official](https://docs.vapi.ai/customization/custom-llm/using-your-server)
- Custom transcriber: your WebSocket endpoint receives streamed audio and returns transcript events — [Vapi custom transcriber, official](https://docs.vapi.ai/customization/custom-transcriber)
- Scale: Vapi says >1 billion total calls and 1-5 million calls/day; $50M Series B led by Peak XV at ~$500M valuation (May 2026); won Amazon Ring over 40 rivals — [TechCrunch, 2026-05-12](https://techcrunch.com/2026/05/12/vapi-hits-500m-valuation-as-amazon-ring-chose-its-ai-platform-over-40-rivals/); [Yahoo Finance / Vapi release](https://finance.yahoo.com/sectors/technology/articles/vapi-raises-50m-series-b-130000518.html)

**Retell AI (hosted cascaded orchestrator)**
- Three agent types: single-prompt, conversation flow, and custom LLM. Custom LLM = your WebSocket server that Retell connects to per call; it controls what the agent says and actions like ending the call — [Retell LLM WebSocket, official](https://docs.retellai.com/api-references/llm-websocket); [Custom LLM overview, official](https://docs.retellai.com/integrate-llm/overview)
- Retell's own docs advise using custom LLM only if compliance or use-case requires it; single-prompt/flow agents get new features first plus built-in tools and latency tuning — [Custom LLM overview, official](https://docs.retellai.com/integrate-llm/overview)
- Custom LLM server cannot be serverless/edge (must hold a WebSocket for the whole call); Retell starts speaking at your first complete sentence, so optimise time-to-first-sentence — [Retell troubleshooting, official](https://docs.retellai.com/integrate-llm/troubleshooting)
- TTS voice models exposed in the API include eleven_flash_v2_5, eleven_multilingual_v2, eleven_v3, Cartesia sonic-3, OpenAI tts-1 — [Retell Get Agent API, official](https://docs.retellai.com/api-references/get-agent)
- LLM dropdown (per a 2026 third-party piece): GPT-4.1 default, Claude 4.6 Sonnet, GPT-5 nano, Gemini 3.0 Flash — [futureagi latency guide, 3rd-party](https://futureagi.com/blog/how-to-optimize-retell-latency-2026/). Another 3rd-party source lists GPT 5.5 at $0.16/min standard — [getmacha, 3rd-party](https://www.getmacha.com/blog/retell-ai-pricing-explained)
- Scale claim: "$50M ARR in 2025, 50M+ monthly calls" — unverified market-report claim, no primary source found — [voiceaiwrapper, 3rd-party](https://voiceaiwrapper.com/insights/voice-ai-market-analysis-trends-growth-opportunities)

**Bland AI (hosted, claims self-hosted full stack)**
- Bland claims self-hosted ASR, inference and TTS co-located in one deployment boundary, plus "Conversational Pathways" node-graph engine; homepage claims sub-400ms latency, 1M+ concurrent calls, SOC 2 Type II, HIPAA, PCI DSS — [Bland homepage, official](https://www.bland.ai/); [Bland latency blog, official](https://www.bland.ai/blog/lowest-latency-voice-ai)
- A reviewer says Bland also lets you choose your own providers, so "self-hosted" may not apply to every component in every deployment — [Coval review, 3rd-party](https://www.coval.ai/blog/bland-ai-review-2026-features-pricing-and-when-to-use-it/)

**Synthflow (no-code hosted)**
- Built-in telephony in 100+ countries plus BYO Twilio/SIP — [Venture Harbour, 3rd-party](https://ventureharbour.com/voice-ai-platforms-compared-i-built-voice-agents-on-7-tools/)
- Deepgram case study: Synthflow runs Deepgram self-hosted on Google Cloud (Nova-3 or Flux STT, Aura-2 TTS); ElevenLabs-backed voices also reported — [Deepgram customer story, vendor](https://deepgram.com/customers/synthflow-ai)
- BYO LLM is contested: Synthflow says BYO keys across all layers; a third-party review says locked to OpenAI GPT models — [Synthflow blog, official](https://synthflow.ai/blog/vapi-ai-review); contradicted by [litmustools, 3rd-party](https://litmustools.com/review/synthflow/)

**LiveKit Agents + LiveKit Cloud (open-source framework, WebRTC-native)**
- LiveKit Inference: unified model gateway. STT providers include Deepgram (e.g. flux-general-en), AssemblyAI (Universal-3.6 Pro), Cartesia, Gemini, Speechmatics; TTS includes Cartesia (Sonic 3.6), Deepgram, Fish Audio, Gradium, Inworld, Rime; LLMs include e.g. google/gemma-4-31b-it, openai/chat-latest. Billed per token/time/character — [LiveKit Inference docs, official](https://docs.livekit.io/agents/models/inference/); [STT overview, official](https://docs.livekit.io/agents/models/stt/); [TTS overview, official](https://docs.livekit.io/agents/models/tts/)
- Also supports realtime speech-to-speech models via plugins (OpenAI, Gemini Live) — [LiveKit realtime models, official](https://docs.livekit.io/agents/models/realtime/); [Gemini plugin, official](https://docs.livekit.io/agents/models/realtime/plugins/gemini/)
- LiveKit reportedly raised $100M in Jan 2026 at $1B valuation led by Index Ventures (single source, unverified) — [landbase, 3rd-party](https://www.landbase.com/blog/fastest-growing-voice-ai-platforms-companies)

**Pipecat (Daily) + Pipecat Cloud (open-source Python framework)**
- Pipeline of FrameProcessors passing audio/video/text frames between transport, STT, LLM, TTS and custom processors; swapping transport (Daily / Twilio / raw WebSocket) leaves pipeline logic unchanged; Python 3.11+ — [Pipecat GitHub, official](https://github.com/pipecat-ai/pipecat); [Evalgent Pipecat vs LiveKit, 3rd-party](https://www.evalgent.com/blog/pipecat-vs-livekit)
- Supports S2S services such as Gemini Live as a pipeline service — [Pipecat Gemini Live, official](https://docs.pipecat.ai/api-reference/server/services/s2s/gemini-live)

**Twilio ConversationRelay (Twilio-hosted STT+TTS, your server does the LLM)**
- TwiML `<ConversationRelay>` connects the call to your `wss://` server; Twilio does STT/TTS and sends text prompts, your server returns text tokens — [ConversationRelay TwiML, official](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay); [WebSocket messages, official](https://www.twilio.com/docs/voice/conversationrelay/websocket-messages)
- STT/TTS providers: Amazon, Deepgram, ElevenLabs, Google; Deepgram Flux support added — [Twilio product page, official](https://www.twilio.com/en-us/products/conversational-ai/conversationrelay); [Twilio changelog Flux, official](https://www.twilio.com/en-us/changelog/conversation-relay-now-supports-deepgram-flux---new-features)

**OpenAI Realtime API (speech-to-speech)**
- Model timeline: gpt-realtime GA Aug 2025 (now marked "Deprecated" on its model page); GPT-Realtime-2 + GPT-Realtime-Translate + GPT-Realtime-Whisper (streaming STT) launched May 2026; gpt-realtime-2.1 and 2.1-mini released 2026-07-06 with improved alphanumerics, noise/silence handling and interruption behavior, configurable reasoning effort; OpenAI says p95 latency dropped >=25% via caching — [gpt-realtime model page, official](https://developers.openai.com/api/docs/models/gpt-realtime); [Advancing voice intelligence, official](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/); [OpenAI community 2.1 announcement, official](https://community.openai.com/t/new-realtime-models-on-the-api-gpt-realtime-2-1-and-gpt-realtime-2-1-mini/1385896); [DataNorth, 3rd-party](https://datanorth.ai/news/openai-releases-gpt-realtime-2-1-voice-models)
- GPT-Live-1 (API launch 2026-09-10): full-duplex model that listens while speaking, delegates reasoning/tool calls to a backend text model (e.g. "GPT-6 Astra" or third-party), 12 voices, custom voices, telephony support — [OpenAI announcement, official](https://openai.com/index/introducing-gpt-live-1-in-the-api/); [GPT-Live 1 model page, official](https://developers.openai.com/api/docs/models/gpt-live-1); [GIGAZINE, 3rd-party](https://gigazine.net/gsc_news/en/20260911-gpt-live-1/)
- Connection types: WebRTC, WebSocket, SIP — [gpt-realtime-2 model page, official](https://developers.openai.com/api/docs/models/gpt-realtime-2)

**Google Gemini Live API (speech-to-speech)**
- Gemini 3.8 Live and 3.8 Live Extended Thinking GA 2026-09-15 as audio-to-audio models; 3.1 Flash Live Preview also listed; bidirectional WebSocket, 16 kHz PCM in / 24 kHz out; async (NON_BLOCKING) function calling is now default — [Gemini API release notes, official](https://ai.google.dev/gemini-api/docs/changelog); [Gemini 3.8 Live dev guide, official](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/guides/gemini-3-8-live); [Google blog, official](https://blog.google/innovation-and-ai/technology/developers-tools/build-real-time-voice-applications-gemini-audio/)

**ElevenLabs Agents ("ElevenAgents")**
- Components: fine-tuned STT, choice of LLM or custom LLM, low-latency TTS, proprietary turn-taking model; visual Workflows editor; CLI/SDK/WebSocket API — [ElevenAgents overview, official](https://elevenlabs.io/docs/eleven-agents/overview); [layer3labs guide, 3rd-party](https://www.layer3labs.io/guides/how-to-use-elevenlabs-agents)

**Deepgram Voice Agent API**
- Single WebSocket with Settings message split into listen (STT, e.g. Flux), think (LLM, incl. custom endpoint; BYO OpenAI/Anthropic/Google/NVIDIA/Groq/Bedrock) and speak (TTS) — [Configure the Voice Agent, official](https://developers.deepgram.com/docs/configure-voice-agent); [Deepgram architecture guide, official](https://deepgram.com/learn/real-time-voice-ai-stack-agents-architecture-guide)

**Ultravox (speech-native model + hosted platform)**
- Speech-native model (audio in, no separate STT); default model since Dec 2025 is GLM-4.6-based v0.7 — [Ultravox changelog, official](https://docs.ultravox.ai/changelog/news); [How Ultravox works, official](https://docs.ultravox.ai/gettingstarted/how-ultravox-works)
- Inworld acquired Ultravox (reported 2026-09-30), no price commitment announced — [Beri, 3rd-party](https://www.beri.net/article/inworld-ultravox-acquisition-voice-agent-platform-third-party-tts-continuity-pricing)

**Cartesia Line**
- Code-first Line SDK; Ink-2 STT with native turn detection + Sonic TTS (Sonic 3.5/3.6) + your LLM; Line voice agents GA with flat pricing (Feb 2026) — [Cartesia Line intro, official](https://www.cartesia.ai/blog/introducing-line-for-voice-agents); [Cartesia changelog 2026, official](https://docs.cartesia.ai/changelog/2026); [usagepricing GA note, 3rd-party](https://www.usagepricing.com/blueprint/activity/cartesia-2026-02-10-voice-agents-ga)
- Cartesia will stop hosting Line SDK agents on 2026-12-01 (self-hosted agents unaffected) — [Cartesia changelog 2026, official](https://docs.cartesia.ai/changelog/2026)

**Telnyx AI Assistants**
- Carrier that owns its network and GPUs; $0.05/min bundles orchestration+STT+TTS; LLM on Telnyx GPUs or managed OpenAI/Anthropic — [Telnyx pricing, official](https://telnyx.com/pricing/voice-ai-agents); [Telnyx product page, official](https://telnyx.com/products/voice-ai-agents)

### Inferences
- For a receptionist product with its own turn logic and booking engine, the "LLM-only" integration surfaces (Twilio ConversationRelay text WebSocket, Retell custom LLM WebSocket, Vapi custom-llm, Deepgram think.endpoint) are the closest match to a custom stack: they outsource audio/STT/TTS/turn-taking but leave conversation logic in your server.
- Vendor churn is high: Vapi retired Workflows (Aug 2026), Cartesia ends Line SDK hosting Dec 2026, Ultravox changed owner Sept 2026, OpenAI deprecated gpt-realtime within ~a year. Platform lock-in carries real migration risk.

### Gaps
- Retell's and Bland's default STT providers were not found in sources.
- LiveKit Inference full LLM list and per-model rates were not retrieved.

## 2. Telephony: carriers, SIP trunking, number provisioning, media transport

### Takeaway
Hosted orchestrators provision numbers (usually Twilio/Telnyx under the hood) and accept BYO SIP trunks; frameworks connect either via SIP (LiveKit native SIP, Daily SIP) or carrier WebSocket media streams (Pipecat + Twilio Media Streams). OpenAI now accepts SIP directly; Gemini Live has no native telephony and needs a bridge.

### Cited Findings
- Vapi: phone number resource links external DID to a SIP trunk credential; Telnyx supported with IP auth; support recommends Plivo/Telnyx/Twilio; Vapi cannot pin a BYO trunk to fixed signaling IP/port (an SBC may be needed) — [Vapi SIP trunking, official](https://docs.vapi.ai/advanced/sip/sip-trunk); [Vapi support thread, official forum](https://support.vapi.ai/t/32917569/byo-sip-trunk-fixed-ip-source-port-support)
- Vapi user anecdote: ~3 s first response with Twilio numbers vs ~6 s with Telnyx — [Vapi support thread, anecdote](https://support.vapi.ai/t/30244024/we-are-doing-some-testing-and-finding-that-with-twilio-numbe)
- Retell US telephony: $0.015/min + $2/month per number — [getmacha, 3rd-party](https://www.getmacha.com/blog/retell-ai-pricing-explained)
- LiveKit: native SIP (third-party trunks Twilio/Telnyx/Plivo billed per minute) plus LiveKit Phone Numbers — US only, inbound only (outbound "later"), per-second metering + monthly fee; free allowance 1 US local number and 50 inbound minutes — [LiveKit Phone Numbers, official](https://docs.livekit.io/telephony/start/phone-numbers/); [LiveKit telephony intro, official](https://docs.livekit.io/telephony/); [LiveKit blog, official](https://blog.livekit.io/introducing-livekit-phone-numbers-zero-to-ringing-in-60-seconds/)
- Pipecat: carrier WebSocket media streams via FastAPIWebsocketTransport + TwilioFrameSerializer; SmallWebRTC P2P is default in templates; Daily can receive calls via its own numbers or SIP forwarding (Twilio -> Daily SIP URI); telephony needs more manual setup than LiveKit's native SIP — [Evalgent Pipecat telephony, 3rd-party](https://www.evalgent.com/blog/pipecat-twilio-telnyx-phone-calls); [Pipecat choosing a transport, official](https://docs.pipecat.ai/client/concepts/choosing-a-transport); [dograh comparison, 3rd-party](https://www.dograh.com/feeds/blog/pipecat-livekit-agents)
- Daily telephony rates: SIP $0.003-$0.02/min; PSTN dial-in/out $0.018/min; recording $0.01349/min — [Daily Pipecat Cloud pricing, official](https://www.daily.co/pricing/pipecat-cloud/)
- OpenAI SIP: Twilio Elastic SIP trunk origination URI `sip:<project_id>@sip.api.openai.com;transport=tls` (port 5061); project-level webhook receives `realtime.call.incoming`; accept via `POST /v1/realtime/calls/{call_id}/accept`; no media bridge needed since Aug 2025 GA; warm transfer possible via Twilio Programmable SIP — [Twilio tutorial, official](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking); [Twilio warm transfer tutorial, official](https://www.twilio.com/en-us/blog/developers/tutorials/product/warm-transfer-openai-realtime-programmable-sip); [openai-agents-python example, official](https://github.com/openai/openai-agents-python/tree/main/examples/realtime/twilio_sip)
- OpenAI SIP friction: community reports of `realtime.call.incoming` never firing with Twilio trunks, undocumented hangup endpoint — [OpenAI community, anecdote](https://community.openai.com/t/configure-twilio-elastic-sip-trunking-for-openai/1399986); [OpenAI community, anecdote](https://community.openai.com/t/gpt-realtime-model-implementation/1405449)
- Gemini Live: no official Twilio integration found; community bridges only; each WebSocket connection lasts ~10 min (session resumption needed); audio-only sessions capped at 15 min without context compression — [Google start/manage sessions, official](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/start-manage-session); [Firebase limits, official](https://firebase.google.com/docs/ai-logic/live-api/limits-and-specs)
- ElevenLabs: native Twilio import or SIP trunk (Twilio, Vonage, RingCentral, Telnyx, Plivo, Bandwidth, Sinch, Infobip, Exotel); only SIP supports REFER transfers; warm transfer defaults to conference; ElevenLabs adds no telephony fee per one guide — [ElevenLabs transfer docs, official](https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools/transfer-to-human); [layer3labs integrations, 3rd-party](https://www.layer3labs.io/guides/elevenlabs-agents-integrations)
- Ultravox: BYO telephony (Twilio, Telnyx, Plivo, jambonz); SIP ~$0.005/min PAYG, ~$0.0048 Pro — [Ultravox pricing, official](https://www.ultravox.ai/pricing); [Softcery, 3rd-party](https://softcery.com/lab/choosing-the-right-voice-agent-platform-in-2026)
- Cartesia: $0.014/min when using a Cartesia-provided number — [Cartesia pricing, official](https://www.cartesia.ai/pricing)
- Telnyx: telephony at carrier cost from $0.0032/min on own network — [Telnyx pricing, official](https://telnyx.com/pricing/voice-ai-agents)
- Twilio voice: US local inbound $0.0085/min, outbound from $0.014/min — [Twilio US voice pricing, official](https://www.twilio.com/en-us/voice/pricing/us)

### Inferences
- Media path matters for latency: SIP/WebRTC-native platforms (LiveKit, Telnyx, OpenAI SIP) avoid the extra hop of Twilio Media Streams JSON/base64 over WebSocket, but the PSTN leg dominates anyway; carrier choice (Twilio vs Telnyx) showed multi-second differences in at least one anecdote, so test on your own numbers.

### Gaps
- LiveKit Phone Numbers' dollar rates; Vapi number pricing/free numbers; Bland telephony specifics (one source says Twilio pass-through) not confirmed from official pages.

## 3. Turn-taking: VAD, end-of-turn models, barge-in, backchannels

### Takeaway
2025-2026 moved end-of-turn detection from silence-timeout VAD to semantic/acoustic models: LiveKit turn detector (text-based, 14 languages) + adaptive interruption model, Pipecat Smart Turn v3.x (audio-based, 23 languages, 8 MB, CPU), Deepgram Flux (STT with built-in EOT, eager EOT), Cartesia Ink-2 (English only), OpenAI semantic_vad, Retell/ElevenLabs proprietary models. Backchannel filtering is now a standard switch (Twilio ignoreBackchannel, LiveKit adaptive interruption).

### Cited Findings
- LiveKit turn detector supports English, Spanish, French, German, Italian, Portuguese, Dutch, Chinese, Japanese, Korean, Indonesian, Turkish, Russian, Hindi; full model v1 on LiveKit Inference, v1-mini for self-hosted; full model free on LiveKit Cloud, 7,500 free requests/month for local dev — [LiveKit turn detector, official](https://docs.livekit.io/agents/logic/turns/turn-detector/); [LiveKit quotas, official](https://docs.livekit.io/deploy/admin/quotas-and-limits/)
- LiveKit claims its improved end-of-turn model cut interruptions 39% (vendor claim) — [LiveKit blog, official](https://livekit.com/blog/improved-end-of-turn-model-cuts-voice-ai-interruptions-39)
- LiveKit adaptive interruption handling (~Agents 1.5.0): ignores VAD speech as interruption shortly after agent starts speaking, re-enables when detector identifies a genuine interruption vs backchannel; language-agnostic; on by default on LiveKit Cloud/dev mode — [LiveKit adaptive interruption, official](https://docs.livekit.io/agents/logic/turns/adaptive-interruption-handling/)
- Pipecat Smart Turn v3: Whisper-Tiny base + linear classifier, ~8M params, 8 MB int8, ~12 ms CPU inference, 23 languages, open source and free; v3.1 accuracy English 88.3% -> 94.7%, Spanish 86.7% -> 90.1%; current shipped v3.2 — [Daily Smart Turn v3, official](https://www.daily.co/blog/announcing-smart-turn-v3-with-cpu-inference-in-just-12ms/); [Daily Smart Turn v3.1, official](https://www.daily.co/blog/improved-accuracy-in-smart-turn-v3-1/); [smart-turn GitHub, official](https://github.com/pipecat-ai/smart-turn)
- Deepgram Flux: STT with built-in turn detection, ~260 ms EOT detection, claims 200-600 ms lower response latency and ~30% fewer false interruptions vs STT+VAD; EagerEndOfTurn + TurnResumed events let LLM start speculatively but raise LLM calls 50-70% — [Introducing Flux, official](https://deepgram.com/learn/introducing-flux-conversational-speech-recognition); [Flux EOT parameters, official](https://developers.deepgram.com/docs/flux/configuration)
- Flux multilingual (10 languages incl. Spanish + auto) available on Telnyx since 2026-04-29; multi mode costs some latency/accuracy vs monolingual — [Telnyx release note, official](https://telnyx.com/release-notes/deepgram-flux-multilingual-voice-ai-assistants); [Telnyx STT models, official](https://developers.telnyx.com/docs/voice/stt/models)
- Cartesia Ink-2: native turn.start / turn.end / turn.eager_end, semantic endpointing, English only for now — [Cartesia Ink-2, official](https://www.cartesia.ai/blog/ink-2); [Cartesia changelog, official](https://docs.cartesia.ai/changelog/2026)
- OpenAI semantic_vad: chunks audio when model believes the user finished based on words; eagerness low/medium/high/auto; set via session.audio.input.turn_detection.type — [OpenAI VAD guide, official](https://developers.openai.com/api/docs/guides/realtime-vad)
- Gemini Live: server-side VAD on by default; can disable and send ActivityStart/ActivityEnd yourself (LiveKit's turn detector can replace it) — [Gemini Live API reference, official](https://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/models/multimodal-live); [LiveKit Gemini plugin, official](https://docs.livekit.io/agents/models/realtime/plugins/gemini/)
- Retell: sends turn-taking update events, repeatedly requests responses with higher response_id and discards if caller keeps talking; responsiveness 0-1; backchannel toggle + frequency (example `enable_backchannel: true, backchannel_frequency: 0.9`) — [Retell LLM WebSocket, official](https://docs.retellai.com/api-references/llm-websocket); [Retell Create Agent, official](https://docs.retellai.com/api-references/create-agent)
- Retell turn-taking model handles backchannels, hesitations and EOU within ~600 ms response budget (Retell blog claim) — [Retell blog, official/vendor](https://www.retellai.com/blog/how-real-time-voice-ai-works-stt-llm-tts)
- ElevenLabs: proprietary turn-taking model; turn eagerness eager/normal/patient; take-turn-after-silence 1-30 s — [ElevenAgents overview, official](https://elevenlabs.io/docs/eleven-agents/overview); [layer3labs, 3rd-party](https://www.layer3labs.io/guides/how-to-use-elevenlabs-agents)
- Twilio ConversationRelay: `interruptible` none/dtmf/speech/any (per-message override), `interruptSensitivity` high/medium/low, `ignoreBackchannel` across English, Spanish, French, German and others; interrupt message reports `utteranceUntilInterrupt` so you trim history — [ConversationRelay TwiML, official](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay); [Twilio interruption blog, official](https://www.twilio.com/en-us/blog/insights/ai-voice-agent-interruption-handling)
- Vapi: endpointing/interruption/backchanneling run in Vapi orchestration layer — [Vapi Data Flow, official](https://docs.vapi.ai/security-and-privacy/data-flow)
- OpenAI on phone audio: developer reports speakerphone noise makes the model start talking by itself or respond before user finished, and mishears names/addresses (persisted through gpt-realtime-2) — [OpenAI community, anecdote](https://community.openai.com/t/realtime-api-poor-portuguese-call-quality-with-gpt-realtime-mini-gpt-realtime/1381375)

### Inferences
- A custom stack can adopt the same open components the platforms use (Smart Turn v3.x locally, Flux or LiveKit turn detector) at near-zero cost; turn-taking is no longer a moat for hosted platforms, except for proprietary tuned models (Retell, ElevenLabs).
- For Spanish receptionist calls, Smart Turn (Spanish 90.1%), LiveKit turn detector (Spanish listed), and Flux multi (Spanish) are viable; Cartesia Ink-2 is not (English only).

### Gaps
- No independent head-to-head accuracy benchmark across these EOT models on telephone audio was found.

## 4. Published latency numbers and independent measurements

### Takeaway
Vendor claims cluster at "sub-500 ms" (Vapi, Twilio, Bland sub-400, Telnyx sub-200), but the only multi-platform production-call measurement found (Telnyx/Cekura, vendor-run) shows full-turn p50 of ~2.0-3.2 s. Definitions vary wildly (VAD-cutoff-to-first-byte vs caller-perceived turn gap), so numbers are not comparable across sources.

### Cited Findings
- Twilio ConversationRelay internal benchmark: p50 491 ms, p95 713 ms (vendor, "results may vary") — [Twilio core latency guide, official](https://www.twilio.com/en-us/blog/developers/best-practices/guide-core-latency-ai-voice-agents)
- Vapi publishes median under 500 ms (internal); Vapi blog latency budget breaks into network, telephony, streaming ASR, LLM, TTS — [Vapi speech latency blog, official](https://vapi.ai/blog/speech-latency); [Telnyx comparison citing Vapi claim, vendor](https://telnyx.com/resources/voice-ai-agents-compared-latency)
- Telnyx-published fixed-stack test, 500 production calls per platform, March 2026: full-turn p50 Retell 1.96 s, Vapi 2.34 s, LiveKit 2.46 s, Pipecat 3.15 s (vendor-run; also attributed to Cekura); article states no independent study covers every latency layer — [Telnyx latency comparison, vendor](https://telnyx.com/resources/voice-ai-agents-compared-latency)
- Telnyx own figures: Telnyx-hosted comparison median 1,296 ms / p95 1,856 ms; Cekura benchmark 1.44 s median with Kimi K2.6 vs 2.46 s with GPT-4.1; marketing claims sub-200 ms RTT — [Telnyx latency metrics release note, official](https://telnyx.com/release-notes/end-user-perceived-latency-ai-assistant-demos); [Telnyx enterprise page, official](https://telnyx.com/resources/best-voice-ai-platforms-enterprise)
- Blog measurements (different definitions): Vapi p95 380 ms, Retell p95 420 ms over 1,000 calls (single author) — [roiscale, 3rd-party](https://roiscale.ai/sites/roiscale/articles/89233950-d237-4024-be85-4556f8eb0d20/i-benchmarked-the-2026-voice-agent-stack-vapi-vs-retell-vs-pipecat-vs-roll-your); Vapi 480 ms p50 / 750 p95, LiveKit self-hosted 380 ms p50, ~260 ms with S2S — [samcomtechnologies, 3rd-party](https://www.samcomtechnologies.com/blog/vapi-vs-livekit-for-ai-voice-agents-in-2026-a-developer-head-to-head)
- Bland: claims sub-400 ms; competitor/reviewer reports 700-900 ms average, one user test 2.5 s worst / 800 ms avg — [Bland homepage, official](https://www.bland.ai/); [Coval, 3rd-party](https://www.coval.ai/blog/bland-ai-review-2026-features-pricing-and-when-to-use-it/); [Retell blog, competitor](https://www.retellai.com/blog/bland-ai-reviews)
- Synthflow: marketing sub-100 ms (model-level); reviews 400-800 ms; no P95 or latency SLA published — [Retell blog on Synthflow, competitor](https://www.retellai.com/blog/synhtflow-ai-review); [Venture Harbour, 3rd-party](https://ventureharbour.com/voice-ai-platforms-compared-i-built-voice-agents-on-7-tools/)
- Deepgram Flux ~260 ms EOT; OpenAI 2.1 release cut p95 >=25% — [Deepgram Flux, official](https://deepgram.com/learn/introducing-flux-conversational-speech-recognition); [DataNorth, 3rd-party](https://datanorth.ai/news/openai-releases-gpt-realtime-2-1-voice-models)
- Real-world Vapi complaints: Reddit user ~2-3 s real delay vs dashboard; Trustpilot 3-5 s per turn; 5+ s when Groq LLM hit capacity — [Quiq review, 3rd-party](https://quiq.com/blog/vapi-ai-review/); [Trustpilot](https://www.trustpilot.com/review/vapi.ai)

### Inferences
- Treat any sub-500 ms claim as a component/median figure; plan for ~1-2.5 s caller-perceived turn gap on PSTN with cascaded stacks and measure your own p95. The LLM choice (and its provider's load) is the largest swing factor (e.g. Kimi K2.6 vs GPT-4.1 on Telnyx: 1.44 s vs 2.46 s).

### Gaps
- No truly independent (non-vendor) multi-platform latency study found; none covered Gemini 3.8 Live or GPT-Live-1 on telephony.

## 5. Pricing: platform fee, pass-through, realistic all-in per minute, concurrency, free tiers

### Takeaway
Platform fees range ~$0.01/min (LiveKit/Pipecat Cloud hosting) to $0.05-0.09/min (Vapi, Telnyx, Ultravox, Retell voice engine, Cartesia $0.06, Twilio CR $0.07, ElevenLabs $0.08, Synthflow $0.09) to $0.11-0.14/min (Bland bundled). Realistic all-in receptionist cost is ~$0.06-0.08/min on bundled carrier/S2S offers (Telnyx, Ultravox+SIP) and ~$0.10-0.25/min on composable orchestrators (Vapi, Retell, Synthflow).

### Cited Findings
**Vapi** — platform fee $0.05/min (Build plan, no required subscription), $0.005/SMS-chat message; 10 concurrent calls included then $10/line/month; providers at cost or $0 with own keys; all-in estimates $0.07-$0.33/min; HIPAA add-on reported $2,000/month (other sources $1,000) and Zero Data Retention add-on $1,000/month. Conflicting reports ($499 Pro, $299+$0.12, $0.015/min) appear wrong/outdated — [activepieces, 3rd-party](https://www.activepieces.com/blog/vapi-pricing-2026-the-real-cost-per-minute); [layer3labs, 3rd-party](https://www.layer3labs.io/guides/vapi-pricing); [11x, 3rd-party](https://www.11x.ai/guides/vapi-pricing); [lindy (conflicting), 3rd-party](https://www.lindy.ai/blog/vapi-ai)

**Retell** — no platform fee; voice engine $0.07-0.08/min; LLM $0.003-$0.16/min by model; US telephony $0.015/min + $2/number/month; PAYG 20 concurrent included, $8/extra slot; all-in $0.07-$0.31/min; example GPT 5.4 mini + Retell voice + telephony + KB = $0.114/min ($1,144 per 10k min); enterprise "as low as $0.05/min" — [getmacha, 3rd-party](https://www.getmacha.com/blog/retell-ai-pricing-explained); [11x, 3rd-party](https://www.11x.ai/guides/retell-ai-pricing); [cloudtalk, 3rd-party](https://www.cloudtalk.io/retell-ai-pricing/)

**Bland** — Start: free platform, $0.14/min, 10 concurrent, 100 calls/day; Build: $299/mo + $0.12/min, 50 concurrent, 2,000 calls/day; Scale $499/mo + $0.11/min, 100 concurrent (one source says removed from pricing page as of 2026-09-23); telephony and transfer minutes billed separately; Enterprise custom (on-prem/VPC, BAA) — [orvera, 3rd-party](https://orvera.ai/blogs/bland-ai-pricing); [getmacha, 3rd-party](https://www.getmacha.com/blog/bland-ai-pricing-explained); [layer3labs, 3rd-party](https://www.layer3labs.io/guides/bland-ai-pricing)

**Synthflow** — voice engine $0.09/min flat; LLM $0.02 (GPT-4.1 mini) to $0.05 (GPT-4.1), BYO $0; all-in $0.13-0.24/min; PAYG 5 concurrent default, extra $20/slot up to 50 more; Enterprise from ~$30k/year with HIPAA, unlimited concurrency, 99.99% SLA — [ringly, 3rd-party](https://www.ringly.io/blog/synthflow-pricing); [11x, 3rd-party](https://www.11x.ai/guides/synthflow-pricing); [layer3labs, 3rd-party](https://www.layer3labs.io/guides/synthflow-pricing)

**LiveKit Cloud** — Build free (1,000 agent-session minutes, 5,000 WebRTC min, $2.50 Inference credit); Ship $50/mo (5,000 agent min, then $0.01/min, $5 credit); Scale $500/mo (50,000 agent min, then $0.01/min, $50 credit); turn detector free on Cloud; Inference typically adds $0.03-0.07/min; self-assembled all-in $0.06-0.15/min with LiveKit ~10-20% of total — [LiveKit quotas, official](https://docs.livekit.io/deploy/admin/quotas-and-limits/); [cekura, 3rd-party](https://www.cekura.ai/blogs/livekit-pricing); [forasoft, 3rd-party](https://www.forasoft.com/blog/article/livekit-ai-agent-development)

**Pipecat Cloud** — agent-1x $0.01/min active, $0.0005/min reserved; agent-2x $0.02/$0.001; Smart Turn free (runs on instance CPU); telephony per Daily rates (SIP $0.003-0.02, PSTN $0.018); HIPAA add-on $500/month — [Daily Pipecat Cloud pricing, official](https://www.daily.co/pricing/pipecat-cloud/); [Pipecat HIPAA docs, official](https://docs.pipecat.ai/pipecat-cloud/security/hipaa)

**Twilio ConversationRelay** — from $0.07/min plus Voice minutes (US inbound $0.0085/min); your LLM billed separately; unclear whether STT/TTS are included in the $0.07 — [Twilio conversational AI pricing, official](https://www.twilio.com/en-us/products/conversational-ai/pricing); [thunderphone, 3rd-party](https://thunderphone.com/guides/twilio-conversationrelay-pricing)

**OpenAI Realtime** — gpt-realtime-2 / 2.1: audio $32/1M input ($0.40 cached), $64/1M output; text $4/$24; gpt-realtime-2.1-mini audio $10/$20; 128k context; GPT-Live-1 voice sessions $0.05/min billed per second + backend model separately; no separate SIP surcharge found — [gpt-realtime-2 model page, official](https://developers.openai.com/api/docs/models/gpt-realtime-2); [gpt-realtime-2.1-mini, official](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini); [GPT-Live 1 model page, official](https://developers.openai.com/api/docs/models/gpt-live-1)
- Third-party per-minute derivation: ~600 audio tokens/min heard (~$0.019) and ~1,200 tokens/min spoken (~$0.077); totals $0.02-$0.15/min depending on caching and context replay — [layer3labs, 3rd-party](https://www.layer3labs.io/guides/openai-realtime-api-pricing); [forasoft, 3rd-party](https://www.forasoft.com/blog/article/openai-realtime-api-pricing)

**Gemini Live** — Gemini 3.8 Live / 3.8 Live Extended Thinking / 3.1 Flash Live Preview: audio input $3.00/1M tokens (~$0.005/min), audio output $12.00/1M (~$0.018/min), output includes thinking tokens; concurrency 1,000 sessions/project PAYG per one Google page vs 5,000 per another — [Gemini API pricing, official](https://ai.google.dev/gemini-api/docs/pricing); [Google start/manage sessions, official](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/start-manage-session); [Gemini Live API reference, official](https://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/models/multimodal-live)

**ElevenLabs Agents** — $0.08/min overage on every tier; $0.16/min burst above concurrency cap; included minutes from 15 (free) to 12,375 (Business $990/mo); LLM billed on top; telephony fee disputed (one source none, carrier bills you) — [thunderphone, 3rd-party](https://thunderphone.com/guides/elevenlabs-agents-pricing); [cloudzero, 3rd-party](https://www.cloudzero.com/blog/elevenlabs-pricing/)

**Deepgram Voice Agent API** — Standard $0.075/min PAYG (promo $0.056 ended 2026-09-12); Advanced $0.163/min; BYO TTS ~$0.065, BYO LLM ~$0.059, BYO LLM+TTS ~$0.050; Growth ~10% lower; Flux STT alone $0.0065/min English, $0.0078 multilingual (PAYG, promotional; regular $0.0077) — [diyai, 3rd-party](https://diyai.io/ai-tools/speech-to-text/deepgram-pricing-2026/); [Deepgram pricing, official](https://deepgram.com/pricing); [cekura, 3rd-party](https://www.cekura.ai/blogs/deepgram-pricing)

**Ultravox** — $0.05/min after 30 free minutes, free tier 5 concurrent, Pro $100/month removes cap; SIP ~$0.005/min — [Ultravox pricing, official](https://www.ultravox.ai/pricing)

**Cartesia Line** — flat $0.06/min + $0.014/min with Cartesia number; prepaid agent balance $1 (Free) to $299 (Scale); plan fees likely $5/$49/$299 (sources conflict); concurrency 8 (Free) to 60 (Scale) per one comparison — [Cartesia pricing, official](https://www.cartesia.ai/pricing); [cloudtalk, 3rd-party](https://www.cloudtalk.io/blog/cartesia-pricing/)

**Telnyx** — $0.05/min (orchestration+STT+TTS); LLM at Telnyx GPU or managed OpenAI/Anthropic rates; telephony from $0.0032/min; Telnyx claims production agent ~$0.06/min all-in; one source cites $0.08/min — [Telnyx pricing, official](https://telnyx.com/pricing/voice-ai-agents); [getdial, competitor](https://getdial.ai/compare/dial-vs-telnyx)

### Inferences
- Rough receptionist (3-min inbound call, US) cost per call, computed from cited rates: Telnyx ~$0.18; Ultravox+SIP ~$0.17 plus carrier; Retell example $0.114/min -> ~$0.34; Vapi with mid-tier providers ~$0.10-0.15/min -> ~$0.30-0.45; Bland Start $0.14/min + telephony -> ~$0.45+; Synthflow ~$0.13-0.24/min -> ~$0.40-0.72. A custom stack (Twilio $0.0085 + Flux $0.0065 + small LLM + mid TTS + $0.01 hosting) is plausibly ~$0.04-0.08/min, but this is my estimate, not a sourced figure.
- For a small founder, the platform fee (~$0.05-0.09/min) is roughly 50-80% of a bundled call's cost and can exceed the combined component cost of a lean custom stack; savings from custom only matter at volume (e.g. 10k min/month x $0.05 = ~$500/month).
- Concurrency defaults (Vapi 10, Retell 20, Synthflow 5, Bland 10, Ultravox free 5) are fine for a receptionist serving a handful of small businesses but become line-item costs at ~20+ tenants.

### Gaps
- Official Vapi, Retell, Bland, Synthflow, LiveKit and ElevenLabs pricing pages could not be fetched; figures rely on third-party summaries that partly conflict.
- TTS per-minute rates for common voices (ElevenLabs Flash, Cartesia Sonic) were not gathered.

## 6. Tool use (booking, transfers), structured flows, knowledge bases

### Takeaway
Every platform supports function calling and call transfer; the structured-flow layer differs: Retell Conversation Flow, Bland Conversational Pathways, Synthflow flows, ElevenLabs Workflows, and Vapi Squads (Vapi Workflows were retired Aug 2026). S2S models had documented tool-calling reliability problems.

### Cited Findings
- Vapi Workflows retired; existing ones stop after 2026-08-18; Squads (multiple assistants with context-preserving handoffs) is the replacement, with a node-to-member migration table — [Vapi Workflows migration, official](https://docs.vapi.ai/workflows/legacy-migration); [Vapi intro, official](https://docs.vapi.ai/quickstart/introduction)
- Vapi custom tools each have their own server URL; PHI may only be passed via /call endpoint under HIPAA — [Vapi tool calling, official](https://docs.vapi.ai/customization/tool-calling-integration); [Vapi HIPAA, official](https://docs.vapi.ai/security-and-privacy/hipaa)
- Retell recommends single-prompt or conversation-flow agents with built-in tool sets over custom LLM — [Retell custom LLM overview, official](https://docs.retellai.com/integrate-llm/overview)
- Bland Conversational Pathways: prompt split into connected nodes for guardrails — [Retell review of Bland, competitor](https://www.retellai.com/blog/bland-ai-reviews)
- ElevenLabs: visual Workflows; knowledge base (PDF, Word, text, Markdown, HTML, EPUB; up to 20 MB/file; small docs in context, larger via RAG); transfer-to-number system tool, warm transfers via conference, REFER only on SIP — [ElevenAgents overview, official](https://elevenlabs.io/docs/eleven-agents/overview); [ElevenLabs transfer, official](https://elevenlabs.io/docs/agents-platform/customization/tools/system-tools/transfer-to-human); [layer3labs, 3rd-party](https://www.layer3labs.io/guides/how-to-use-elevenlabs-agents)
- Gemini 3.8 Live: async NON_BLOCKING function calling default; Extended Thinking variant errors on BLOCKING mode — [Gemini 3.8 Live migration guide, official](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/live-api/migrate-from-gemini-2-5-to-gemini-3-8-live)
- OpenAI: developer-reported regression where gpt-realtime-2.1 answered instead of calling tools (~25% success vs 98-100% on gpt-realtime; one unverified test); older threads report ~50% missed function calls — [OpenAI community, anecdote](https://community.openai.com/t/gpt-realtime-2-1-production-tool-invocation-regression-model-answers-instead-of-calling-available-tools/1398438); [OpenAI community, anecdote](https://community.openai.com/t/realtime-api-function-calls-not-triggering-despite-explicit-system-prompt-instructions/1276765)
- Retell-run benchmark (Cekura Bench cohort, vendor-biased): Retell 75.61% pass^3 vs Vapi 59.76%; calls without provider/connection issues 98.37% vs 82.93%; Vapi led task completion 97.56% on calls with outcome evidence — [Retell blog, competitor](https://www.retellai.com/blog/retell-vs-bland-vs-vapi-vs-elevenlabs)

### Inferences
- For deterministic booking (slot lookup, confirmation, cancellation), a text LLM in a cascaded pipeline with your own state machine is currently more controllable than an S2S model, given the tool-calling regressions reported for realtime models.

### Gaps
- Synthflow's flow designer and Retell's conversation-flow limits were not detailed in sources; built-in calendar integrations (Cal.com, Google Calendar) per platform were not verified.

## 7. Spanish / multilingual and code-switching

### Takeaway
Spanish is supported everywhere, but true mid-utterance Spanish-English code-switching depends on the STT: Deepgram Nova-3 multi / Flux multi, and S2S models. Turn detectors vary (Ink-2 English only). No independent phone-call code-switching benchmark was found.

### Cited Findings
- Deepgram Nova-3 Multilingual (GA Mar 2025) code-switches in real time across 10 languages incl. Spanish (`language=multi`); Feb 2026 update claims largest gains in code-switching, ~21% relative streaming WER reduction — [Deepgram changelog 2026-02-05, official](https://developers.deepgram.com/changelog/2026/2/5); [Nova-3 multilingual WER, official](https://deepgram.com/learn/nova-3-multilingual-major-wer-improvements-across-languages)
- Twilio ConversationRelay: `<Language>` element per language, voice fixed at setup (default Spanish voice may change gender), runtime `language` message switches STT/TTS; STT `multi` auto-detects and reports primary tag — [ConversationRelay TwiML, official](https://www.twilio.com/docs/voice/twiml/connect/conversationrelay); [CR best practices, official](https://www.twilio.com/docs/voice/conversationrelay/best-practices)
- Retell: agent language a single locale or array (e.g. ["en-US","es-ES"]) for multilingual agents — [Retell Create Agent, official](https://docs.retellai.com/api-references/create-agent)
- Vapi: multilingual squad example with per-member model and voice — [Vapi multilingual squad, official](https://docs.vapi.ai/squads/examples/multilingual-support)
- ElevenLabs: official docs say 31 languages; marketing says 90+ with mid-conversation switching (conflict) — [ElevenAgents overview, official](https://elevenlabs.io/docs/eleven-agents/overview); [ElevenLabs agents page, official](https://elevenlabs.io/agents)
- Telnyx: Flux multi incl. Spanish (Apr 2026); language count conflict 80+ vs 29-30+ — [Telnyx release note, official](https://telnyx.com/release-notes/deepgram-flux-multilingual-voice-ai-assistants)
- OpenAI GPT-Realtime-Translate: 70+ input languages into 13 output languages — [Advancing voice intelligence, official](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/)
- Smart Turn v3.1 Spanish accuracy 90.1%; LiveKit turn detector includes Spanish; Cartesia Ink-2 English only — [Daily v3.1, official](https://www.daily.co/blog/improved-accuracy-in-smart-turn-v3-1/); [LiveKit turn detector, official](https://docs.livekit.io/agents/logic/turns/turn-detector/); [Cartesia changelog, official](https://docs.cartesia.ai/changelog/2026)

### Inferences
- A bilingual (e.g. San Diego) receptionist should be tested on recorded Spanish/English phone audio; language-switch handling (voice change, turn detector language) is a configuration detail on every platform, not automatic.

### Gaps
- No platform-level Spanish latency or accuracy numbers; no independent Spanish-English code-switching benchmark on 8 kHz audio.

## 8. Compliance: SOC 2, HIPAA BAA, GDPR, retention, recording controls, training on data

### Takeaway
Retell offers the easiest self-signed BAA on pay-as-you-go; Vapi gates HIPAA behind a paid add-on; LiveKit gates BAA to Scale/Enterprise; Daily sells a $500/month HIPAA add-on; ElevenLabs and Synthflow gate HIPAA to enterprise. Training-on-data terms are rarely published.

### Cited Findings
- Retell: HIPAA and GDPR compliant, SOC 2 Type 1 and Type 2; BAA and DPA (EU SCCs) self-signed at click-agreements.retellai.com; does not operate services inside the EU; per-agent retention (reported 1 day-2 years) — [Retell compliance docs, official](https://docs.retellai.com/general/compliance)
- Vapi: HIPAA mode needs signed BAA, org-wide dashboard add-on (not API); records stored in private bucket, retrieved via API; structured outputs not stored by default; HIPAA and ZDR mutually exclusive; ZDR stores only operational metadata — [Vapi HIPAA, official](https://docs.vapi.ai/security-and-privacy/hipaa); [Vapi ZDR, official](https://docs.vapi.ai/security-and-privacy/zero-data-retention)
- Vapi training: older ToS said non-HIPAA persisted call data may be used for model training and HIPAA data may not; newer ToS excerpt does not mention training — [Vapi Terms of Service, official](https://vapi.ai/terms-of-service)
- Vapi requires separate BAAs with each provider in the stack — [silverthreadlabs, 3rd-party](https://www.silverthreadlabs.com/blog/ai-voice-agent-platforms-compared)
- LiveKit: SOC 2 Type II (security, availability, confidentiality), GDPR with DPA, BAA on request for Scale and Enterprise — [LiveKit security overview, official](https://livekit.com/security/overview); [LiveKit trust center, official](https://trust.livekit.io/)
- Daily/Pipecat Cloud: one BAA covers Pipecat Cloud, Daily WebRTC and transcription; no application data logged under HIPAA controls; $500/month; SOC 2 for Pipecat Cloud was "on the roadmap" in Daily's GA post (status unclear) — [Pipecat HIPAA, official](https://docs.pipecat.ai/pipecat-cloud/security/hipaa); [Daily Pipecat Cloud GA blog, official](https://www.daily.co/blog/pipecat-cloud-is-now-generally-available/)
- Bland: claims SOC 2 Type II, HIPAA, PCI DSS; BAA tier disputed (Enterprise vs standard) — [Bland homepage, official](https://www.bland.ai/); [silverthreadlabs, 3rd-party](https://www.silverthreadlabs.com/blog/ai-voice-agent-platforms-compared)
- Synthflow: HIPAA Enterprise only; ElevenLabs HIPAA Enterprise-gated — [11x Synthflow, 3rd-party](https://www.11x.ai/guides/synthflow-pricing); [Retell blog, competitor](https://www.retellai.com/blog/vapi-vs-elevenlabs)
- Telnyx: HIPAA-eligible, signs BAAs (customer Ultradoc confirms); single-BAA-covers-all claim is marketing — [Telnyx Ultradoc story, official](https://telnyx.com/customer-stories/ultradoc)

### Inferences
- A receptionist for medical/dental offices needs a BAA chain covering carrier, STT, LLM, TTS and the orchestrator; Retell (self-serve) or a custom stack with BAAs from Twilio/Deepgram/LLM provider are the cheapest paths; Vapi adds $1-2k/month.

### Gaps
- Training-on-customer-data policies for Retell, Bland, Synthflow, ElevenLabs, Telnyx not found. Data retention defaults for most platforms not published.

## 9. Known reliability problems and developer complaints

### Takeaway
Complaints concentrate on Vapi (latency gaps vs dashboard, frequent incidents, breaking changes), OpenAI Realtime (noise sensitivity, mishearing, tool-call regressions, SIP doc gaps), and cost unpredictability across composable platforms. Much of the critical material is competitor-written.

### Cited Findings
- Vapi status: 16 incidents in 90 days (6 major), median 1 h 30 min (tracker count); Sept 2026 number provisioning down 22 h 45 min; Oct 2026 outbound SIP failing ~21 min — [Vapi status incident, official](https://status.vapi.ai/incident/905860); [StatusGator](https://statusgator.com/services/vapi); [IsDown](https://isdown.app/status/vapi)
- Vapi: bugs/broken integrations after releases; Trustpilot 2.4/5 from 15 reviews; costs start $0.05 but real $0.13-0.31/min — [Trustpilot](https://www.trustpilot.com/review/vapi.ai); [burki, competitor](https://burki.dev/blog/4-why-switching-from-vapi); [dialora, competitor](https://www.dialora.ai/blog/vapi-ai-reviews)
- Retell: slow support, latency in fast exchanges, component pricing hard to forecast; Reddit describes it as dependable for answering/qualifying/booking — [Zeeg review, 3rd-party](https://zeeg.me/en/blog/post/retell-ai-review); [ciela Reddit roundup, 3rd-party](https://ciela.ai/blogs/retell-ai-reddit-review)
- OpenAI Realtime: noise triggers, mishearing names/addresses, tool-call regression on 2.1, undocumented SIP hangup, "sorry state" of Realtime SDK docs — [OpenAI community threads, anecdotes](https://community.openai.com/t/realtime-api-poor-portuguese-call-quality-with-gpt-realtime-mini-gpt-realtime/1381375); [OpenAI community SDK thread](https://community.openai.com/t/the-sorry-state-of-the-realtime-sdk/1356942)
- Bland: real latency well above sub-400 ms claim (competitor/review sourced) — [Coval, 3rd-party](https://www.coval.ai/blog/bland-ai-review-2026-features-pricing-and-when-to-use-it/)
- Synthflow: no P95 latency metrics or latency SLAs published; moved upmarket to $30k/year enterprise — [Retell blog, competitor](https://www.retellai.com/blog/synhtflow-ai-review); [ringly, 3rd-party](https://www.ringly.io/blog/synthflow-pricing)
- Vendor transitions: Vapi Workflows retirement, Cartesia Line SDK hosting end 2026-12-01, Ultravox acquisition by Inworld — [Vapi migration, official](https://docs.vapi.ai/workflows/legacy-migration); [Cartesia changelog, official](https://docs.cartesia.ai/changelog/2026); [Beri, 3rd-party](https://www.beri.net/article/inworld-ultravox-acquisition-voice-agent-platform-third-party-tts-continuity-pricing)

### Inferences
- Building on a hosted platform does not remove the need for your own monitoring, fallback (e.g. forward to voicemail/human on failure), and regression tests; outages and model regressions upstream become your customers' missed calls.

### Gaps
- No independent uptime data (only vendor status pages and trackers); uptime SLA figures (Retell 99.94%, Vapi 99.99%) from a comparison page are unverified and conflict with complaint data; no hallucination-rate comparisons found.
