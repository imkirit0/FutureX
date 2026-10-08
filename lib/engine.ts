// FutureX progressive assessment engine.
// Stages 0-3: AI basics, then the content of FutureX Level 1, 2 and 3.
// Every path uses one bank: the original course questions in stages 0-1,
// graduate-level stages 2-3 (Stanford CS229 / CS224N / CS336).
// Questions only ever get harder: stage by stage, and by difficulty tier inside a stage.

export type Question = { b: number; d: 1 | 2 | 3; t: string; q: string; o: string[]; a: number; e: string };

export const STAGES = ['AI Basics', 'Level 1 · GenAI & Tools', 'Level 2 · ML theory & RAG', 'Level 3 · Agents & LLM systems'];

export const LEVELS: Record<number, { name: string; blurb: string; url: string }> = {
  1: { name: 'Certificate in Generative AI & Applied AI Tools', url: '/courses/certificate-generative-ai-applied-ai-tools',
       blurb: '120 hours · AI & digital fluency, prompt engineering with LLM and vision models, audio & speech AI, ethical AI, AI tools, chatbot capstone.' },
  2: { name: 'Advanced Certificate in Generative AI Pipelines & RAG Systems', url: '/courses/advanced-certificate-generative-ai-pipelines-rag',
       blurb: '120 hours · Machine learning, deep learning, advanced prompting, vector embeddings, semantic search and building RAG systems.' },
  3: { name: 'Professional Certificate in AI Agents, Automation & Deployment', url: '/courses/professional-certificate-ai-agents-automation-deployment',
       blurb: 'AI agents, LangGraph & CrewAI, browser agents, MCP, tool and function calling, deployment capstone.' },
};
export const LEVEL4 = { name: 'Professional Certificate in Generative AI, Foundation Models & FMOps', url: '/courses/professional-certificate-foundation-models-fmops' };

export const QUESTIONS: Question[] = [
  // ===== One bank for every path: the original course questions in stages 0-1, graduate-level stages 2-3 =====
  // Stage 0: AI basics (quick check)
  { b: 0, d: 1, t: 'AI Fundamentals', q: 'Which statement best describes Artificial Intelligence?', o: ['A robot that looks like a human', 'Machines performing tasks that normally need human intelligence', 'Any software that runs on the internet', 'A very fast calculator'], a: 1, e: 'AI is about machines doing things like understanding language, recognising images or making decisions, which usually need human intelligence.' },
  { b: 0, d: 1, t: 'Data', q: 'What do AI systems need most in order to learn?', o: ['Electricity only', 'Data', 'A keyboard', 'Colourful graphics'], a: 1, e: 'Data is the fuel of AI: models learn patterns from large amounts of examples.' },
  { b: 0, d: 2, t: 'AI Fundamentals', q: '"Generative AI" is AI that can…', o: ['Only sort data into folders', 'Create new content such as text, images or music', 'Generate electricity', 'Only play chess'], a: 1, e: 'Generative AI produces new content: essays, images, code, audio and more.' },
  { b: 0, d: 2, t: 'AI Applications', q: 'When you speak to Alexa or Siri, what is the first AI step?', o: ['Converting your speech into text', 'Sending you an email', 'Taking a photo', 'Turning off the device'], a: 0, e: 'Speech recognition turns your voice into text so the assistant can understand the request.' },
  { b: 0, d: 2, t: 'Responsible AI', q: 'Can AI chatbots give wrong answers?', o: ['No, AI is always correct', 'Only when the internet is slow', 'Only for maths questions', 'Yes, they can sound confident and still be wrong, so verify important facts'], a: 3, e: 'Chatbots can "hallucinate". Always double-check important information.' },
  { b: 0, d: 3, t: 'AI Fundamentals', q: 'What does "machine learning" mean?', o: ['Teaching students to use machines', 'Repairing computers automatically', 'Writing every rule by hand', 'Computers learning patterns from data instead of being programmed with every rule'], a: 3, e: 'In ML, the system finds patterns in examples (data) rather than following hand-written rules for every case.' },
  { b: 0, d: 3, t: 'AI Fundamentals', q: 'Which of these is NOT really an AI task?', o: ['Recognising faces in photos', 'Translating between languages', 'Adding two numbers on a basic calculator', 'Recommending songs'], a: 2, e: 'A calculator follows fixed arithmetic rules; it does not learn or make intelligent judgements.' },

  // Stage 1: Level 1 content
  { b: 1, d: 1, t: 'GenAI Basics', q: 'What does "LLM" stand for?', o: ['Large Language Model', 'Linear Logic Machine', 'Low Latency Memory', 'Learning Language Module'], a: 0, e: 'LLMs such as GPT, Gemini and Claude are trained on huge amounts of text.' },
  { b: 1, d: 1, t: 'Ethics & Safety', q: 'What should you avoid pasting into a public AI chatbot?', o: ['A general maths question', 'A request for a poem', 'A public news headline', 'Personal data, passwords or confidential company information'], a: 3, e: 'Inputs may be stored or used for training; never share sensitive or private data.' },
  { b: 1, d: 1, t: 'Multimodal AI', q: 'Which of these is a text-to-image model?', o: ['Whisper', 'Stable Diffusion', 'Excel', 'BERT'], a: 1, e: 'Stable Diffusion, DALL·E and Midjourney generate images from text prompts.' },
  { b: 1, d: 1, t: 'Prompt Engineering', q: 'Which prompt is likely to give the best result?', o: ['"Write about marketing"', '"Marketing??"', '"Tell me everything"', '"You are a marketing mentor. Give 5 low-budget Instagram ideas for a college café, as a bulleted list."'], a: 3, e: 'Good prompts give a role, context, a clear task and an output format.' },
  { b: 1, d: 2, t: 'GenAI Basics', q: 'In LLMs, a "hallucination" is…', o: ['A visual glitch on screen', 'A very creative poem', 'Plausible-sounding but false or made-up information', 'A model running out of memory'], a: 2, e: 'Hallucinations are confident but incorrect outputs; grounding and verification reduce them.' },
  { b: 1, d: 2, t: 'Multimodal AI', q: 'OpenAI Whisper is mainly used for…', o: ['Image generation', 'Stock prediction', 'Speech-to-text transcription', 'Writing SQL'], a: 2, e: 'Whisper is a speech recognition model that transcribes and translates audio.' },
  { b: 1, d: 2, t: 'Ethics & Safety', q: 'Bias in an AI model most often comes from…', o: ['Slow internet', 'Using a dark theme', 'Unbalanced or biased training data', 'Too many users'], a: 2, e: 'Models learn the patterns in their data, including unfair ones, so data quality matters.' },
  { b: 1, d: 2, t: 'Prompt Engineering', q: '"Few-shot prompting" means…', o: ['Including a few worked examples in the prompt', 'Asking only short questions', 'Running the model a few times', 'Using a smaller model'], a: 0, e: 'Showing examples of input → output helps the model copy the pattern you want.' },
  { b: 1, d: 2, t: 'AI Tools', q: 'Streamlit and Gradio are used to…', o: ['Quickly build web interfaces for AI apps', 'Train GPUs', 'Store passwords', 'Edit videos'], a: 0, e: 'Both let you wrap a model or chatbot in a simple web UI with a few lines of Python.' },
  { b: 1, d: 3, t: 'GenAI Basics', q: 'At its core, how does an LLM produce a reply?', o: ['It searches Google and copies the top result', 'It predicts the next token again and again', 'It looks up a fixed answer table', 'A human types each reply'], a: 1, e: 'An LLM generates text one token at a time, each time predicting the most suitable next token.' },
  { b: 1, d: 3, t: 'Prompt Engineering', q: 'Raising the "temperature" setting of an LLM makes the output…', o: ['Faster', 'More random and creative', 'Shorter', 'Always more accurate'], a: 1, e: 'Low temperature = focused and predictable; high temperature = more varied and creative.' },
  { b: 1, d: 3, t: 'GenAI Basics', q: 'A "token" in an LLM is…', o: ['A login password', 'A small chunk of text, like a word or part of a word', 'A cryptocurrency coin', 'A single GPU'], a: 1, e: 'Models read and write tokens; limits and pricing are usually counted in tokens.' },

  // Stage 2: Level 2 content: ML theory, deep learning & RAG (graduate level: CS229 / CS224N / CS336)
  { b: 2, d: 1, t: 'Optimisation', q: 'Unregularised logistic regression is trained by gradient descent on linearly separable data. What happens to the weights w?', o: ['w converges to a finite MLE with zero training loss', '‖w‖ → ∞, but w/‖w‖ → the max-margin (SVM) direction', 'w converges exactly to the hard-margin SVM weights', '‖w‖ oscillates, because the loss has no finite minimiser'], a: 1, e: 'The loss keeps falling as ‖w‖ grows, so no finite minimiser exists, yet gradient descent is implicitly biased toward the max-margin direction (Soudry et al., 2018).' },
  { b: 2, d: 1, t: 'Optimisation', q: 'What is the key difference between AdamW and Adam with L2 regularisation?', o: ['AdamW adds λ‖w‖² to the loss, so decay is scaled by the second moment', 'AdamW bias-corrects the first moment, which Adam omits', 'AdamW clips each update so its norm never exceeds the learning rate', 'AdamW decouples weight decay from the adaptive gradient step'], a: 3, e: 'With L2 in Adam, the penalty gradient is divided by √v, so heavily updated weights are barely decayed. AdamW applies decay directly to the weights (Loshchilov & Hutter).' },
  { b: 2, d: 1, t: 'Machine Learning', q: 'How do bias and variance change between k-NN with k = 1 and k = n (all training points)?', o: ['k = 1: low bias, high variance; k = n: high bias, low variance', 'k = 1: high bias, low variance; k = n: low bias, high variance', 'Both have low bias; only their variance differs with k', 'Bias and variance are both independent of the choice of k'], a: 0, e: 'k = 1 memorises the training set; k = n predicts the same global majority or mean for every input.' },
  { b: 2, d: 2, t: 'Deep Learning', q: 'For softmax with cross-entropy and a one-hot label y, what is the gradient of the loss with respect to the logits z?', o: ['y − p', 'p ⊙ (1 − p)', 'p − y', '−y / p'], a: 2, e: 'The softmax Jacobian and the log cancel neatly: ∂L/∂z = softmax(z) − y. −y/p is the gradient with respect to the probabilities, not the logits.' },
  { b: 2, d: 2, t: 'Deep Learning', q: 'A network uses inverted dropout with p = 0.5 during training. What do you do at test time?', o: ['Multiply every activation by 0.5', 'Divide every activation by 0.5', 'Average the outputs of 10 random masks', 'Use all units with no rescaling'], a: 3, e: 'Inverted dropout already scales kept activations by 1/(1 − p) during training, so the expected activation matches at test time.' },
  { b: 2, d: 2, t: 'Transformers', q: 'Why do Pre-LN Transformers train more stably than Post-LN ones at depth?', o: ['LayerNorm is applied to the attention logits before softmax', 'Each block uses half as many LayerNorm parameters', 'The residual stream keeps a clean identity path to early layers', 'The residual stream is held at exactly unit variance at every depth'], a: 2, e: 'In Pre-LN, gradients flow straight down the residual stream without passing through LayerNorm. Its residual norm actually grows with depth.' },
  { b: 2, d: 2, t: 'RAG', q: 'Why are cross-encoders used only to re-rank, not for first-stage retrieval?', o: ['Their relevance scores are consistently less accurate than bi-encoder cosine similarities', 'Every query–document pair needs its own forward pass, so nothing can be pre-indexed', 'Their output vectors are too high-dimensional to store in an ANN index', 'They are limited to queries shorter than a single sentence of tokens'], a: 1, e: 'A cross-encoder reads query and document together, which is more accurate but costs one model call per candidate. Bi-encoders embed documents once, ahead of time.' },
  { b: 2, d: 2, t: 'Embeddings', q: 'When training an embedding model with InfoNCE and in-batch negatives, what does a larger batch do?', o: ['Tightens the mutual-information bound by contrasting more negatives', 'Weakens gradients, because each positive is diluted by negatives', 'Has no effect, because the loss is averaged over the whole batch anyway', 'Reduces false negatives, because duplicate pairs become rarer'], a: 0, e: 'InfoNCE bounds mutual information by log(batch size). Larger batches actually raise the chance of false negatives.' },
  { b: 2, d: 2, t: 'RAG', q: 'An LLM receives 20 retrieved passages, one of which holds the answer. How does the answer’s position affect accuracy?', o: ['It rises steadily the later the passage appears', 'Position has no measurable effect with modern attention', 'Highest at the start or the end, lowest in the middle', 'Highest when the passage sits exactly in the middle'], a: 2, e: '"Lost in the Middle" (Liu et al., 2023) found a U-shaped curve, so order retrieved chunks with this in mind.' },
  { b: 2, d: 3, t: 'Systems', q: 'What does FlashAttention change about computing exact attention?', o: ['Memory traffic: it tiles in on-chip SRAM, so the n×n matrix never hits HBM', 'FLOPs: it approximates attention with a low-rank kernel to cut the compute', 'Output: it drops low-scoring keys, so attention becomes sparse', 'Precision: it computes softmax in int8 to halve memory bandwidth'], a: 0, e: 'FlashAttention is exact and still O(n²) in FLOPs. Its speed-up comes from IO-awareness and an online softmax, avoiding reads and writes of the full score matrix.' },
  { b: 2, d: 3, t: 'ML Theory', q: 'As model size grows with the dataset fixed, how does test error behave around the interpolation threshold?', o: ['It decreases monotonically once regularisation is removed', 'It is U-shaped, rising steadily past the interpolation threshold', 'It plateaus at the Bayes error once the model can interpolate', 'It peaks near the threshold, then falls again as size grows'], a: 3, e: 'This is double descent (Belkin et al.; Nakkiran et al.): error spikes where the model can just fit the data, then improves in the over-parameterised regime.' },
  { b: 2, d: 3, t: 'Scaling Laws', q: 'Under Chinchilla scaling, how should parameters N and training tokens D grow with compute?', o: ['Parameters much faster than tokens, as GPT-3 did', 'Roughly equally, about 20 tokens per parameter', 'Tokens fixed at 300B, with extra compute on parameters', 'Tokens only, since parameters matter little past 1B'], a: 1, e: 'Hoffmann et al. (2022) found N and D should scale in equal proportion; GPT-3-era models were heavily under-trained.' },
  { b: 2, d: 3, t: 'Transformers', q: 'Which property defines Rotary Position Embeddings (RoPE)?', o: ['A learned absolute position vector is added to every token embedding at input', 'Query–key dot products depend only on the relative offset between positions', 'Attention scores get a fixed linear penalty that grows with distance', 'Sinusoidal position vectors are added once, at the input layer only'], a: 1, e: 'RoPE rotates q and k by position-dependent angles, so qᵀk depends on m − n. A linear distance penalty is ALiBi; added sinusoids are the original Transformer.' },
  { b: 2, d: 3, t: 'Probabilistic ML', q: 'In variational inference you minimise KL(q ‖ p) over q, and p is multimodal. What does q tend to do?', o: ['Spread out to cover every mode (mass-covering)', 'Match p exactly whenever q is Gaussian', 'Collapse to a point mass at the mean of p', 'Lock onto a single mode (mode-seeking)'], a: 3, e: 'Reverse KL heavily penalises q putting mass where p is small, so q hugs one mode. Forward KL(p ‖ q) is the mass-covering one.' },

  // Stage 3: Level 3 content: agents, post-training & LLM systems (graduate level)
  { b: 3, d: 1, t: 'Post-training', q: 'In RLHF with PPO, why is there a KL penalty to the reference (SFT) model?', o: ['To stop the policy exploiting the reward model by drifting off-distribution', 'To turn the reward model’s raw scores into calibrated probabilities for PPO', 'To reduce the variance of the policy-gradient estimator', 'To keep the value head aligned with the policy head'], a: 0, e: 'The reward model is only accurate near the data it was trained on; without the KL leash the policy finds reward-hacking outputs.' },
  { b: 3, d: 1, t: 'Post-training', q: 'Compared with PPO-based RLHF, what does Direct Preference Optimisation (DPO) remove?', o: ['The need for human preference pairs', 'The frozen reference model in the training objective', 'The explicit reward model and the on-policy RL loop', 'The supervised fine-tuning stage entirely'], a: 2, e: 'DPO optimises a closed-form loss on preference pairs that implicitly defines the reward. It still uses a reference model and is usually run after SFT.' },
  { b: 3, d: 1, t: 'LLM Systems', q: 'Speculative decoding with a small draft model and rejection sampling guarantees that…', o: ['Outputs match the draft model, with the target only verifying', 'Outputs are greedy, whatever temperature you set', 'The distribution is approximate, with a bounded KL error', 'The output distribution exactly matches the target model’s'], a: 3, e: 'Accepting draft tokens with probability min(1, p/q) and resampling from the residual reproduces the target distribution exactly while saving latency.' },
  { b: 3, d: 2, t: 'LLM Systems', q: 'What problem does PagedAttention (vLLM) mainly solve?', o: ['Quadratic attention cost, by attending only within pages of tokens', 'GPU load imbalance, by paging whole transformer layers out to CPU memory', 'KV-cache fragmentation, by allocating the cache in fixed-size blocks', 'Slow prefill, by streaming the prompt through attention in chunks'], a: 2, e: 'Contiguous per-request KV buffers waste memory through fragmentation and over-reservation; paging lets the server pack far more concurrent sequences.' },
  { b: 3, d: 2, t: 'LLM Systems', q: 'What is the main benefit of continuous (in-flight) batching for LLM serving?', o: ['Every request is padded to the same output length', 'Requests join and leave each step, so the GPU never idles on stragglers', 'Batches only group prompts of identical length', 'KV caches are shared across all requests that start with the same prefix'], a: 1, e: 'With static batching, short requests wait for the longest one. Shared prefixes are a different technique: prefix caching.' },
  { b: 3, d: 2, t: 'Security', q: 'Which design best contains prompt injection in a tool-using agent (the dual-LLM / CaMeL pattern)?', o: ['A privileged planner never sees untrusted data; a tool-less model handles it', 'One model drafts the actions and a second model votes on whether to execute them', 'A second model paraphrases untrusted text to strip hidden instructions', 'Two models answer independently and only agreed actions are run'], a: 0, e: 'Separating control flow from untrusted data means injected text can never choose which tools run, rather than hoping a model detects it.' },
  { b: 3, d: 2, t: 'Reasoning', q: 'What is self-consistency decoding?', o: ['Asking the model to check its own answer, then revise it once', 'Running greedy decoding several times and keeping the longest answer', 'Sampling several reasoning paths and taking the majority final answer', 'Having a second model rank all the sampled paths and keeping the top one'], a: 2, e: 'Wang et al. (2022) marginalise over sampled chains of thought by majority vote. Repeated greedy decoding just gives the same answer each time.' },
  { b: 3, d: 2, t: 'Evaluation', q: 'You draw n samples per problem and c pass the tests. What is the unbiased estimator of pass@k?', o: ['1 − C(n − c, k) / C(n, k)', '1 − (1 − c/n)ᵏ', 'c / n', '1 − (1 − c/n)ᵏ · (n − k)/n'], a: 0, e: 'It is one minus the probability that all k samples drawn without replacement fail (Chen et al., 2021). Plugging c/n into 1 − (1 − p)ᵏ is biased.' },
  { b: 3, d: 2, t: 'AI Agents', q: 'Tool-selection accuracy collapses once an agent has 200 tools in its prompt. What is the best fix?', o: ['Merge every tool into one generic tool with a free-form command', 'Use a larger context window so every schema fits comfortably', 'Fine-tune on the tool descriptions alone, without examples', 'Retrieve the few relevant tool schemas per request'], a: 3, e: 'Fewer, relevant tools in context improve selection. A bigger window does not stop distractor tools from confusing the model.' },
  { b: 3, d: 3, t: 'Post-training', q: 'An agent trained with RL on unit-test pass rate starts editing the tests. What is the most robust fix?', o: ['Raise the KL penalty so that the policy stays close to the base model', 'Hold out hidden tests and make test files read-only in the sandbox', 'Penalise any diff that is longer than the reference solution', 'Add "never modify tests" to the system prompt during RL'], a: 1, e: 'This is reward hacking (Goodhart’s law). Fix the environment so the exploit is impossible and the reward unforgeable; prompts and KL only slow it down.' },
  { b: 3, d: 3, t: 'Post-training', q: 'How does GRPO (as used for DeepSeek-R1) estimate the advantage?', o: ['It uses a learned value network, exactly as in PPO', 'It normalises each reward against a group of samples for the same prompt', 'It subtracts an exponential moving average of rewards over all prompts', 'It uses the log-ratio between the policy and the reference model'], a: 1, e: 'GRPO drops the critic: advantage = (r − mean of the group) / std of the group, which saves memory and suits verifiable rewards.' },
  { b: 3, d: 3, t: 'LLM Systems', q: 'Which form of model parallelism most needs the fastest interconnect, such as NVLink inside a node?', o: ['Pipeline parallelism, since stages swap activations every micro-batch', 'Data parallelism, since gradients are all-reduced every step', 'All three need about the same bandwidth per training step', 'Tensor parallelism, since every layer all-reduces activations'], a: 3, e: 'Tensor parallelism communicates inside every layer, forward and backward. Pipeline parallelism sends point-to-point activations, and data parallelism syncs once per step.' },
  { b: 3, d: 3, t: 'LLM Systems', q: 'Why does naive per-tensor int8 quantisation of activations break large LLMs (the LLM.int8() finding)?', o: ['A few channels carry huge outliers that wreck a shared int8 scale', 'Weights are bimodal, so a single int8 grid cannot represent both peaks', 'LayerNorm cannot be computed with integer arithmetic at all', 'int8 matmuls run slower than fp16 on modern data-centre GPUs'], a: 0, e: 'Beyond about 6.7B parameters, systematic outlier features emerge. A shared scale crushes every other value to zero, so outliers are handled in fp16.' },
  { b: 3, d: 3, t: 'Security', q: 'What is "tool poisoning" in the Model Context Protocol?', o: ['A server returns deliberately malformed JSON-RPC responses that crash the MCP client', 'A client sends tool arguments that fall outside the declared JSON schema', 'A server hides instructions in a tool description the model reads but users never see', 'A server throttles its responses so the client times out and denies service'], a: 2, e: 'Tool descriptions go straight into the model’s context, so a malicious or compromised server can inject instructions. Pin and review server definitions.' },
];

export const STATUSES = ['School student', 'College student', 'Graduate / job seeker', 'Working professional'];

export const TIME_LIMIT_SECONDS = 20 * 60;

// Each stage is a short paper ordered by difficulty. The student moves freely inside the
// open stage, then submits it: pass and the next (harder) stage unlocks, fail and the test ends.
// Stages below the chosen level's prerequisite are a quick check: 3 questions, 2 to pass.
// The stages that decide the recommendation are 4 questions, 3 to pass.
type Tier = 1 | 2 | 3;
export const isQuick = (chosenLevel: number | null, stage: number) => !!chosenLevel && stage < chosenLevel - 1;
export const passMark = (chosenLevel: number | null, stage: number) => (isQuick(chosenLevel, stage) ? 2 : 3);
const tiersFor = (chosenLevel: number | null, stage: number): Tier[] => (isQuick(chosenLevel, stage) ? [1, 2, 3] : [1, 2, 2, 3]);

export type Choice = number | null;
export type Session = {
  chosenLevel: number | null;
  paper: Question[][]; // per stage, in difficulty order
  picks: Choice[][];   // per stage, per question
  stage: number;       // the open stage (or the last one taken, once done)
  passed: number;      // stages 0..passed-1 are cleared
  done: boolean;
};

export function createSession(chosenLevel: number | null = null, rng: () => number = Math.random): Session {
  const paper = STAGES.map((_, b) => {
    const used = new Set<Question>();
    return tiersFor(chosenLevel, b).map(d => {
      const pool = QUESTIONS.filter(q => q.b === b && q.d === d && !used.has(q));
      const q = pool[Math.floor(rng() * pool.length)];
      used.add(q);
      return q;
    });
  });
  return { chosenLevel, paper, picks: paper.map(qs => qs.map(() => null)), stage: 0, passed: 0, done: false };
}

export function choose(s: Session, stage: number, i: number, choice: Choice): Session {
  if (s.done || stage !== s.stage) return s; // earlier stages are locked
  const picks = s.picks.map(r => r.slice());
  picks[stage][i] = choice;
  return { ...s, picks };
}

export const stageScore = (s: Session, b: number) => s.paper[b].filter((q, i) => s.picks[b][i] === q.a).length;

export function submitStage(s: Session): Session {
  if (s.done) return s;
  if (stageScore(s, s.stage) < passMark(s.chosenLevel, s.stage)) return { ...s, done: true }; // ceiling found
  const passed = s.stage + 1;
  return passed > 3 ? { ...s, passed, done: true } : { ...s, passed, stage: passed };
}

// Time's up: submit the open stage, and any stage it unlocks fails unanswered.
export function finish(s: Session): Session {
  while (!s.done) s = submitStage(s);
  return s;
}

export type StageSubmission = { ids: number[]; choices: Choice[] };
export const submissionOf = (s: Session): StageSubmission[] =>
  s.paper.slice(0, s.stage + 1).map((qs, b) => ({ ids: qs.map(q => QUESTIONS.indexOf(q)), choices: s.picks[b] }));

// Server-side: rebuild the session from the submitted papers so results can't be faked.
export function replay(chosenLevel: number | null, stages: StageSubmission[]): Session | null {
  if (!Array.isArray(stages) || stages.length < 1 || stages.length > STAGES.length) return null;
  let s: Session = { chosenLevel, paper: STAGES.map(() => []), picks: STAGES.map(() => []), stage: 0, passed: 0, done: false };
  for (const [b, st] of stages.entries()) {
    if (s.done) return null;
    const tiers = tiersFor(chosenLevel, b);
    const qs = Array.isArray(st?.ids) ? st.ids.map(id => QUESTIONS[id]) : [];
    const choices = Array.isArray(st?.choices) ? st.choices : [];
    if (qs.length !== tiers.length || choices.length !== tiers.length || new Set(qs).size !== qs.length) return null;
    if (qs.some((q, i) => !q || q.b !== b || q.d !== tiers[i])) return null; // must be a progressive paper
    if (choices.some(c => c !== null && !(Number.isInteger(c) && c >= 0 && c < 4))) return null;
    s.paper[b] = qs;
    s.picks[b] = choices;
    s = submitStage(s);
  }
  return s.done ? s : null;
}

export function answersOf(s: Session) {
  const taken = s.done ? s.stage + 1 : s.stage;
  return s.paper.slice(0, taken).flatMap((qs, b) =>
    qs.map((q, i) => ({ q, choice: s.picks[b][i], correct: s.picks[b][i] === q.a })));
}

export type Report = ReturnType<typeof report>;

export function report(s: Session) {
  const answers = answersOf(s);
  const stages = STAGES.map((name, b) => {
    const xs = answers.filter(a => a.q.b === b);
    const status = b < s.passed ? 'passed' : xs.length ? 'stopped' : 'not reached';
    return { name, right: xs.filter(a => a.correct).length, total: xs.length, status };
  });

  const byTopic = new Map<string, { topic: string; right: number; total: number }>();
  for (const a of answers) {
    const t = byTopic.get(a.q.t) ?? { topic: a.q.t, right: 0, total: 0 };
    t.total++; if (a.correct) t.right++;
    byTopic.set(a.q.t, t);
  }
  const topics = [...byTopic.values()];

  const top = s.passed - 1; // highest stage passed, -1 = none
  const recommended = Math.min(3, Math.max(1, top + 1));
  const verdict = !s.chosenLevel ? null
    : recommended === s.chosenLevel ? 'fit' : recommended < s.chosenLevel ? 'too-high' : 'too-low';

  return {
    score: answers.filter(a => a.correct).length,
    total: answers.length,
    stages, top, recommended,
    beyond: top === 3,
    verdict: verdict as 'fit' | 'too-high' | 'too-low' | null,
    chosenLevel: s.chosenLevel,
    strengths: topics.filter(t => t.right / t.total >= 0.75).map(t => t.topic),
    gaps: topics.filter(t => t.right / t.total < 0.5).map(t => t.topic),
  };
}
