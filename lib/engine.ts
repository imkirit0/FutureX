// FutureX progressive assessment engine.
// Stages 0-3: math & Python foundations, then the content of FutureX Level 1, 2 and 3.
// Every path uses one hard bank: brain-cracking stages 0-1, graduate-level stages 2-3
// (Stanford CS229 / CS224N / CS336).
// Questions only ever get harder: stage by stage, and by difficulty tier inside a stage.

export type Question = { b: number; d: 1 | 2 | 3; t: string; q: string; o: string[]; a: number; e: string };

export const STAGES = ['Foundations · Math & Python', 'Level 1 · GenAI & Tools', 'Level 2 · ML theory & RAG', 'Level 3 · Agents & LLM systems'];

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
  // ===== One hard bank for every path: brain-cracking stages 0-1, graduate-level stages 2-3 =====
  // Every option is a plausible near-miss; correct answers are spread across A-D.
  // Stage 0: Foundations: brain-cracking math, probability & CS
  { b: 0, d: 1, t: 'Python', q: 'def f(x, acc=[]): acc.append(x); return acc. You call f(1), then print(f(2)). What is printed?', o: ['[2]', '[1]', '[1, 2]', '[[1], 2]'], a: 2, e: 'Default arguments are evaluated once, when the function is defined, so every call shares the same list.' },
  { b: 0, d: 1, t: 'Python', q: 'fs = [lambda: i for i in range(3)]. What is [f() for f in fs]?', o: ['[2, 2, 2]', '[0, 1, 2]', '[0, 0, 0]', '[3, 3, 3]'], a: 0, e: 'Closures capture the variable i, not its value. By the time they run, i is 2. Use lambda i=i: i to bind early.' },
  { b: 0, d: 1, t: 'Linear Algebra', q: 'A is 5×3 with rank 3. What are the ranks of AᵀA (3×3) and AAᵀ (5×5)?', o: ['3 and 5', '5 and 3', '3 and 1', '3 and 3'], a: 3, e: 'rank(AᵀA) = rank(AAᵀ) = rank(A). AAᵀ is 5×5 but only rank 3, so it is singular.' },
  { b: 0, d: 1, t: 'Probability', q: 'What is the expected number of fair-coin flips until you first see two heads in a row?', o: ['4', '6', '3', '8'], a: 1, e: 'Let E be the expected count from scratch: E = ½(1 + E) + ¼(2 + E) + ¼·2, which gives E = 6.' },
  { b: 0, d: 2, t: 'Probability', q: 'X and Y are independent Uniform(0, 1). What is E[max(X, Y)]?', o: ['1/2', '2/3', '3/4', '1/3'], a: 1, e: 'P(max ≤ t) = t², so the density is 2t and E = ∫₀¹ 2t² dt = 2/3.' },
  { b: 0, d: 2, t: 'Linear Algebra', q: 'What are the eigenvalues of [[2, 1], [1, 2]]?', o: ['2 and 2', '0 and 4', '1 and 4', '1 and 3'], a: 3, e: 'The trace is 4 and the determinant is 3, so λ² − 4λ + 3 = 0 and λ = 1, 3 (eigenvectors [1, −1] and [1, 1]).' },
  { b: 0, d: 2, t: 'Calculus', q: 'f(z) = log Σᵢ exp(zᵢ) and p = softmax(z). What is the Hessian ∇²f?', o: ['diag(p) − ppᵀ', 'diag(p)', 'ppᵀ − diag(p)', 'I − ppᵀ'], a: 0, e: '∇f = p, and ∂pᵢ/∂zⱼ = pᵢ(δᵢⱼ − pⱼ). It is positive semi-definite, which proves log-sum-exp is convex.' },
  { b: 0, d: 2, t: 'Algorithms', q: 'A is n×1, B is 1×n, C is n×1. What is the cheapest way to compute ABC, and its cost?', o: ['O(n²), as (AB)C', 'O(n³), either way', 'O(n), as A(BC)', 'O(n), as (AB)C'], a: 2, e: '(AB) builds an n×n matrix (n² work) before multiplying by C. BC is a 1×1 scalar costing n, then A·scalar costs n.' },
  { b: 0, d: 2, t: 'Probability', q: 'A 32-bit hash maps keys uniformly. Roughly how many keys until a collision is more likely than not?', o: ['About 65,536', 'About 2.1 billion', 'About 4.3 billion', 'About 77,000'], a: 3, e: 'Birthday bound: n ≈ 1.177·√N = 1.177·2¹⁶ ≈ 77,000. 2¹⁶ is the right order but too small for 50%.' },
  { b: 0, d: 3, t: 'Statistics', q: 'For n i.i.d. Gaussian samples, what is the expected value of the maximum-likelihood estimate of the variance?', o: ['σ²', 'nσ² / (n − 1)', '(n − 1)σ² / n', 'σ² / n'], a: 2, e: 'The MLE divides by n but measures spread around the sample mean, which loses one degree of freedom. Bessel’s n − 1 correction removes the bias.' },
  { b: 0, d: 3, t: 'Numerical Methods', q: 'Solving least squares via the normal equations XᵀXw = Xᵀy, what is the condition number of XᵀX in terms of κ(X)?', o: ['κ(X)', 'κ(X)²', '√κ(X)', '2·κ(X)'], a: 1, e: 'Squaring the singular values squares the condition number, which is why QR or SVD is preferred for ill-conditioned X.' },
  { b: 0, d: 3, t: 'Probability', q: 'How many uniformly random draws do you expect to need to collect all n distinct coupons?', o: ['n·Hₙ ≈ n ln n', 'n²/2', '2n', 'n log₂ n, exactly'], a: 0, e: 'After collecting k coupons, a new one takes n/(n − k) draws on average. Summing gives n(1 + ½ + … + 1/n) = n·Hₙ.' },
  { b: 0, d: 3, t: 'Probability', q: 'n candidates arrive in random order; you must accept or reject each on the spot. With the optimal rule, how often do you pick the single best one as n grows large?', o: ['About 1/2', 'About 1/n', 'About 1/e ≈ 0.37', 'About 1 − 1/e ≈ 0.63'], a: 2, e: 'The secretary problem: reject the first n/e candidates, then take the first one better than all of them. You succeed with probability → 1/e.' },

  // Stage 1: Level 1 content: brain-cracking LLM internals
  { b: 1, d: 1, t: 'Transformers', q: 'How many parameters does one multi-head attention layer with model width d have (no biases)?', o: ['4d²', '3d²', 'd²', '12d²'], a: 0, e: 'W_Q, W_K, W_V and W_O are each d×d. 12d² is a whole block, adding the 8d² feed-forward layer.' },
  { b: 1, d: 1, t: 'LLM Systems', q: 'How much KV cache does one token need per layer with full multi-head attention, d_model = 4096, in fp16?', o: ['8 KB', '32 KB', '4 KB', '16 KB'], a: 3, e: 'K and V each store 4096 values × 2 bytes = 8 KB, so 16 KB per token per layer. Multiply by layers and context length.' },
  { b: 1, d: 1, t: 'Transformers', q: 'What is the main benefit of grouped-query attention (GQA)?', o: ['It cuts attention FLOPs from O(n²) to O(n) per sequence', 'It shrinks the KV cache by sharing K/V heads across query heads', 'It removes the need for positional encodings altogether', 'It lets each attention head attend to its own sliding window of tokens'], a: 1, e: 'GQA keeps many query heads but few K/V heads, so decoding needs far less KV memory and bandwidth.' },
  { b: 1, d: 1, t: 'Tokenisation', q: 'What does BPE tokeniser training repeatedly do?', o: ['Split every word at its lowest-probability character boundary first', 'Merge the most frequent adjacent pair of symbols into a new token', 'Prune subwords that least reduce the corpus likelihood', 'Give each word its own token, falling back to raw bytes'], a: 1, e: 'BPE builds its vocabulary bottom-up by greedy merges. Likelihood-based pruning is the Unigram LM tokeniser.' },
  { b: 1, d: 2, t: 'Scaling', q: 'About how many FLOPs does it take to train a 7B-parameter model on 1 trillion tokens?', o: ['About 1.4 × 10²² FLOPs', 'About 7 × 10²¹ FLOPs', 'About 4.2 × 10²⁴ FLOPs', 'About 4.2 × 10²² FLOPs'], a: 3, e: 'Training costs about 6·N·D FLOPs (2 forward + 4 backward per parameter per token): 6 × 7×10⁹ × 10¹² = 4.2 × 10²².' },
  { b: 1, d: 2, t: 'LLM Systems', q: 'Full fine-tuning of a 7B model with Adam in mixed precision. Ignoring activations, how much GPU memory do weights, gradients and optimiser state need?', o: ['About 112 GB', 'About 14 GB', 'About 28 GB', 'About 56 GB'], a: 0, e: 'About 16 bytes per parameter: fp16 weights (2) + fp16 gradients (2) + fp32 master copy (4) + Adam m and v (4 + 4).' },
  { b: 1, d: 2, t: 'Transformers', q: 'Causal masking sets future logits to −∞ before softmax. Why not just zero the future probabilities after softmax?', o: ['Writing zeros is slower on GPUs than writing −∞ values', 'Using −∞ stops gradients vanishing in very deep stacks', 'The softmax denominator would still include future tokens, leaking them', 'Masking after the softmax would break the memory layout of the KV cache'], a: 2, e: 'Each surviving probability is normalised by a sum that includes future logits, so information about the future leaks into every position.' },
  { b: 1, d: 2, t: 'Evaluation', q: 'A language model’s cross-entropy is 2.0 nats per token. What is its perplexity?', o: ['About 4.0', 'About 2.0', 'About 100', 'About 7.39'], a: 3, e: 'Perplexity = exp(cross-entropy in nats) = e² ≈ 7.39. With log base 2, you would use 2^H instead.' },
  { b: 1, d: 2, t: 'Transformers', q: 'What does tying the input embedding matrix to the output projection do?', o: ['Lets the model skip the softmax at inference time', 'Makes the attention scores symmetric in q and k', 'Saves V·d parameters and often improves perplexity', 'Removes the need for a fixed tokenizer vocabulary'], a: 2, e: 'One V×d matrix serves both lookup and output logits (Press & Wolf, 2017), which also regularises rare-token embeddings.' },
  { b: 1, d: 3, t: 'Training Stability', q: 'What does the auxiliary "z-loss" used in PaLM-style training penalise?', o: ['Low-entropy outputs, to reduce the model’s overconfidence on rare tokens', 'log Z drifting from 0, which stops logits blowing up in low precision', 'Attention weights that stray too far from a uniform distribution', 'The gap between hard targets and a label-smoothed target distribution'], a: 1, e: 'Adding α·(log Z)² keeps the softmax normaliser near 1, preventing divergence in bf16 training.' },
  { b: 1, d: 3, t: 'Mixture of Experts', q: 'A Mixtral-style model has 8 expert FFNs per layer with top-2 routing. Compared with running every expert, its per-token expert FLOPs are…', o: ['About a quarter, since 2 of 8 experts run', 'The same, since every expert runs and is then masked', 'About half, since the two experts share one pass', 'About an eighth, since routing picks one expert'], a: 0, e: 'Only the chosen experts compute, so the model has many parameters but few active ones. Attention FLOPs are unchanged.' },
  { b: 1, d: 3, t: 'LLM Systems', q: 'Streaming LLMs that evict old context keep the KV of the first few tokens. Why?', o: ['Those tokens hold the system prompt, which serving providers must never evict from memory', 'Rotary embeddings need position 0 as a fixed reference point', 'Models dump surplus attention on initial tokens; evicting them collapses quality', 'They are cached in fp32, so recomputing them would be expensive'], a: 2, e: 'These are "attention sinks" (Xiao et al., 2023). Softmax must put mass somewhere, and models learn to park it on the first tokens.' },
  { b: 1, d: 3, t: 'Interpretability', q: 'What does an "induction head" do inside a transformer?', o: ['Finds an earlier occurrence of the current token and copies what followed it', 'Attends only to the previous token to track local syntax', 'Pools all tokens into a single sentence-level summary vector', 'Detects sentence boundaries and resets the positional information at each one'], a: 0, e: 'Induction heads implement [A][B] … [A] → [B]. They are a key mechanism behind in-context learning (Olsson et al., 2022).' },

  // Stage 2: Level 2 content: ML theory, deep learning & RAG (graduate level: CS229 / CS224N / CS336)
  { b: 2, d: 1, t: 'Optimisation', q: 'Unregularised logistic regression is trained by gradient descent on linearly separable data. What happens to the weights w?', o: ['w converges to a finite MLE with zero training loss', 'w converges exactly to the hard-margin SVM weights', '‖w‖ oscillates, because the loss has no finite minimiser', '‖w‖ → ∞, but w/‖w‖ → the max-margin (SVM) direction'], a: 3, e: 'The loss keeps falling as ‖w‖ grows, so no finite minimiser exists, yet gradient descent is implicitly biased toward the max-margin direction (Soudry et al., 2018).' },
  { b: 2, d: 1, t: 'Optimisation', q: 'What is the key difference between AdamW and Adam with L2 regularisation?', o: ['AdamW adds λ‖w‖² to the loss, so decay is scaled by the second moment', 'AdamW decouples weight decay from the adaptive gradient step', 'AdamW bias-corrects the first moment, which Adam omits', 'AdamW clips each update so its norm never exceeds the learning rate'], a: 1, e: 'With L2 in Adam, the penalty gradient is divided by √v, so heavily updated weights are barely decayed. AdamW applies decay directly to the weights (Loshchilov & Hutter).' },
  { b: 2, d: 1, t: 'Machine Learning', q: 'How do bias and variance change between k-NN with k = 1 and k = n (all training points)?', o: ['k = 1: high bias, low variance; k = n: low bias, high variance', 'k = 1: low bias, high variance; k = n: high bias, low variance', 'Both have low bias; only their variance differs with k', 'Bias and variance are both independent of the choice of k'], a: 1, e: 'k = 1 memorises the training set; k = n predicts the same global majority or mean for every input.' },
  { b: 2, d: 2, t: 'Deep Learning', q: 'For softmax with cross-entropy and a one-hot label y, what is the gradient of the loss with respect to the logits z?', o: ['y − p', 'p ⊙ (1 − p)', '−y / p', 'p − y'], a: 3, e: 'The softmax Jacobian and the log cancel neatly: ∂L/∂z = softmax(z) − y. −y/p is the gradient with respect to the probabilities, not the logits.' },
  { b: 2, d: 2, t: 'Deep Learning', q: 'A network uses inverted dropout with p = 0.5 during training. What do you do at test time?', o: ['Use all units with no rescaling', 'Multiply every activation by 0.5', 'Divide every activation by 0.5', 'Average the outputs of 10 random masks'], a: 0, e: 'Inverted dropout already scales kept activations by 1/(1 − p) during training, so the expected activation matches at test time.' },
  { b: 2, d: 2, t: 'Transformers', q: 'Why do Pre-LN Transformers train more stably than Post-LN ones at depth?', o: ['LayerNorm is applied to the attention logits before softmax', 'Each block uses half as many LayerNorm parameters', 'The residual stream keeps a clean identity path to early layers', 'The residual stream is held at exactly unit variance at every depth'], a: 2, e: 'In Pre-LN, gradients flow straight down the residual stream without passing through LayerNorm. Its residual norm actually grows with depth.' },
  { b: 2, d: 2, t: 'RAG', q: 'Why are cross-encoders used only to re-rank, not for first-stage retrieval?', o: ['Their relevance scores are consistently less accurate than bi-encoder cosine similarities', 'Their output vectors are too high-dimensional to store in an ANN index', 'They are limited to queries shorter than a single sentence of tokens', 'Every query–document pair needs its own forward pass, so nothing can be pre-indexed'], a: 3, e: 'A cross-encoder reads query and document together, which is more accurate but costs one model call per candidate. Bi-encoders embed documents once, ahead of time.' },
  { b: 2, d: 2, t: 'Embeddings', q: 'When training an embedding model with InfoNCE and in-batch negatives, what does a larger batch do?', o: ['Weakens gradients, because each positive is diluted by negatives', 'Has no effect, because the loss is averaged over the whole batch anyway', 'Tightens the mutual-information bound by contrasting more negatives', 'Reduces false negatives, because duplicate pairs become rarer'], a: 2, e: 'InfoNCE bounds mutual information by log(batch size). Larger batches actually raise the chance of false negatives.' },
  { b: 2, d: 2, t: 'RAG', q: 'An LLM receives 20 retrieved passages, one of which holds the answer. How does the answer’s position affect accuracy?', o: ['It rises steadily the later the passage appears', 'Highest at the start or the end, lowest in the middle', 'Position has no measurable effect with modern attention', 'Highest when the passage sits exactly in the middle'], a: 1, e: '"Lost in the Middle" (Liu et al., 2023) found a U-shaped curve, so order retrieved chunks with this in mind.' },
  { b: 2, d: 3, t: 'Systems', q: 'What does FlashAttention change about computing exact attention?', o: ['Memory traffic: it tiles in on-chip SRAM, so the n×n matrix never hits HBM', 'FLOPs: it approximates attention with a low-rank kernel to cut the compute', 'Output: it drops low-scoring keys, so attention becomes sparse', 'Precision: it computes softmax in int8 to halve memory bandwidth'], a: 0, e: 'FlashAttention is exact and still O(n²) in FLOPs. Its speed-up comes from IO-awareness and an online softmax, avoiding reads and writes of the full score matrix.' },
  { b: 2, d: 3, t: 'ML Theory', q: 'As model size grows with the dataset fixed, how does test error behave around the interpolation threshold?', o: ['It decreases monotonically once regularisation is removed', 'It is U-shaped, rising steadily past the interpolation threshold', 'It peaks near the threshold, then falls again as size grows', 'It plateaus at the Bayes error once the model can interpolate'], a: 2, e: 'This is double descent (Belkin et al.; Nakkiran et al.): error spikes where the model can just fit the data, then improves in the over-parameterised regime.' },
  { b: 2, d: 3, t: 'Scaling Laws', q: 'Under Chinchilla scaling, how should parameters N and training tokens D grow with compute?', o: ['Roughly equally, about 20 tokens per parameter', 'Parameters much faster than tokens, as GPT-3 did', 'Tokens fixed at 300B, with extra compute on parameters', 'Tokens only, since parameters matter little past 1B'], a: 0, e: 'Hoffmann et al. (2022) found N and D should scale in equal proportion; GPT-3-era models were heavily under-trained.' },
  { b: 2, d: 3, t: 'Transformers', q: 'Which property defines Rotary Position Embeddings (RoPE)?', o: ['A learned absolute position vector is added to every token embedding at input', 'Attention scores get a fixed linear penalty that grows with distance', 'Sinusoidal position vectors are added once, at the input layer only', 'Query–key dot products depend only on the relative offset between positions'], a: 3, e: 'RoPE rotates q and k by position-dependent angles, so qᵀk depends on m − n. A linear distance penalty is ALiBi; added sinusoids are the original Transformer.' },
  { b: 2, d: 3, t: 'Probabilistic ML', q: 'In variational inference you minimise KL(q ‖ p) over q, and p is multimodal. What does q tend to do?', o: ['Spread out to cover every mode (mass-covering)', 'Lock onto a single mode (mode-seeking)', 'Match p exactly whenever q is Gaussian', 'Collapse to a point mass at the mean of p'], a: 1, e: 'Reverse KL heavily penalises q putting mass where p is small, so q hugs one mode. Forward KL(p ‖ q) is the mass-covering one.' },

  // Stage 3: Level 3 content: agents, post-training & LLM systems (graduate level)
  { b: 3, d: 1, t: 'Post-training', q: 'In RLHF with PPO, why is there a KL penalty to the reference (SFT) model?', o: ['To turn the reward model’s raw scores into calibrated probabilities for PPO', 'To stop the policy exploiting the reward model by drifting off-distribution', 'To reduce the variance of the policy-gradient estimator', 'To keep the value head aligned with the policy head'], a: 1, e: 'The reward model is only accurate near the data it was trained on; without the KL leash the policy finds reward-hacking outputs.' },
  { b: 3, d: 1, t: 'Post-training', q: 'Compared with PPO-based RLHF, what does Direct Preference Optimisation (DPO) remove?', o: ['The need for human preference pairs', 'The frozen reference model in the training objective', 'The supervised fine-tuning stage entirely', 'The explicit reward model and the on-policy RL loop'], a: 3, e: 'DPO optimises a closed-form loss on preference pairs that implicitly defines the reward. It still uses a reference model and is usually run after SFT.' },
  { b: 3, d: 1, t: 'LLM Systems', q: 'Speculative decoding with a small draft model and rejection sampling guarantees that…', o: ['The output distribution exactly matches the target model’s', 'Outputs match the draft model, with the target only verifying', 'Outputs are greedy, whatever temperature you set', 'The distribution is approximate, with a bounded KL error'], a: 0, e: 'Accepting draft tokens with probability min(1, p/q) and resampling from the residual reproduces the target distribution exactly while saving latency.' },
  { b: 3, d: 2, t: 'LLM Systems', q: 'What problem does PagedAttention (vLLM) mainly solve?', o: ['Quadratic attention cost, by attending only within pages of tokens', 'GPU load imbalance, by paging whole transformer layers out to CPU memory', 'KV-cache fragmentation, by allocating the cache in fixed-size blocks', 'Slow prefill, by streaming the prompt through attention in chunks'], a: 2, e: 'Contiguous per-request KV buffers waste memory through fragmentation and over-reservation; paging lets the server pack far more concurrent sequences.' },
  { b: 3, d: 2, t: 'LLM Systems', q: 'What is the main benefit of continuous (in-flight) batching for LLM serving?', o: ['Every request is padded to the same output length', 'Batches only group prompts of identical length', 'KV caches are shared across all requests that start with the same prefix', 'Requests join and leave each step, so the GPU never idles on stragglers'], a: 3, e: 'With static batching, short requests wait for the longest one. Shared prefixes are a different technique: prefix caching.' },
  { b: 3, d: 2, t: 'Security', q: 'Which design best contains prompt injection in a tool-using agent (the dual-LLM / CaMeL pattern)?', o: ['One model drafts the actions and a second model votes on whether to execute them', 'A second model paraphrases untrusted text to strip hidden instructions', 'A privileged planner never sees untrusted data; a tool-less model handles it', 'Two models answer independently and only agreed actions are run'], a: 2, e: 'Separating control flow from untrusted data means injected text can never choose which tools run, rather than hoping a model detects it.' },
  { b: 3, d: 2, t: 'Reasoning', q: 'What is self-consistency decoding?', o: ['Asking the model to check its own answer, then revise it once', 'Sampling several reasoning paths and taking the majority final answer', 'Running greedy decoding several times and keeping the longest answer', 'Having a second model rank all the sampled paths and keeping the top one'], a: 1, e: 'Wang et al. (2022) marginalise over sampled chains of thought by majority vote. Repeated greedy decoding just gives the same answer each time.' },
  { b: 3, d: 2, t: 'Evaluation', q: 'You draw n samples per problem and c pass the tests. What is the unbiased estimator of pass@k?', o: ['1 − C(n − c, k) / C(n, k)', '1 − (1 − c/n)ᵏ', 'c / n', '1 − (1 − c/n)ᵏ · (n − k)/n'], a: 0, e: 'It is one minus the probability that all k samples drawn without replacement fail (Chen et al., 2021). Plugging c/n into 1 − (1 − p)ᵏ is biased.' },
  { b: 3, d: 2, t: 'AI Agents', q: 'Tool-selection accuracy collapses once an agent has 200 tools in its prompt. What is the best fix?', o: ['Merge every tool into one generic tool with a free-form command', 'Use a larger context window so every schema fits comfortably', 'Retrieve the few relevant tool schemas per request', 'Fine-tune on the tool descriptions alone, without examples'], a: 2, e: 'Fewer, relevant tools in context improve selection. A bigger window does not stop distractor tools from confusing the model.' },
  { b: 3, d: 3, t: 'Post-training', q: 'An agent trained with RL on unit-test pass rate starts editing the tests. What is the most robust fix?', o: ['Hold out hidden tests and make test files read-only in the sandbox', 'Raise the KL penalty so that the policy stays close to the base model', 'Penalise any diff that is longer than the reference solution', 'Add "never modify tests" to the system prompt during RL'], a: 0, e: 'This is reward hacking (Goodhart’s law). Fix the environment so the exploit is impossible and the reward unforgeable; prompts and KL only slow it down.' },
  { b: 3, d: 3, t: 'Post-training', q: 'How does GRPO (as used for DeepSeek-R1) estimate the advantage?', o: ['It uses a learned value network, exactly as in PPO', 'It subtracts an exponential moving average of rewards over all prompts', 'It uses the log-ratio between the policy and the reference model', 'It normalises each reward against a group of samples for the same prompt'], a: 3, e: 'GRPO drops the critic: advantage = (r − mean of the group) / std of the group, which saves memory and suits verifiable rewards.' },
  { b: 3, d: 3, t: 'LLM Systems', q: 'Which form of model parallelism most needs the fastest interconnect, such as NVLink inside a node?', o: ['Pipeline parallelism, since stages swap activations every micro-batch', 'Tensor parallelism, since every layer all-reduces activations', 'Data parallelism, since gradients are all-reduced every step', 'All three need about the same bandwidth per training step'], a: 1, e: 'Tensor parallelism communicates inside every layer, forward and backward. Pipeline parallelism sends point-to-point activations, and data parallelism syncs once per step.' },
  { b: 3, d: 3, t: 'LLM Systems', q: 'Why does naive per-tensor int8 quantisation of activations break large LLMs (the LLM.int8() finding)?', o: ['Weights are bimodal, so a single int8 grid cannot represent both peaks', 'A few channels carry huge outliers that wreck a shared int8 scale', 'LayerNorm cannot be computed with integer arithmetic at all', 'int8 matmuls run slower than fp16 on modern data-centre GPUs'], a: 1, e: 'Beyond about 6.7B parameters, systematic outlier features emerge. A shared scale crushes every other value to zero, so outliers are handled in fp16.' },
  { b: 3, d: 3, t: 'Security', q: 'What is "tool poisoning" in the Model Context Protocol?', o: ['A server returns deliberately malformed JSON-RPC responses that crash the MCP client', 'A client sends tool arguments that fall outside the declared JSON schema', 'A server throttles its responses so the client times out and denies service', 'A server hides instructions in a tool description the model reads but users never see'], a: 3, e: 'Tool descriptions go straight into the model’s context, so a malicious or compromised server can inject instructions. Pin and review server definitions.' },
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
