// FutureX progressive assessment engine.
// Stages 0-3: AI basics, then the content of FutureX Level 1, 2 and 3.
// Questions only ever get harder: stage by stage, and easy → hard inside a stage.

// k: 'new' marks the beginner track; questions without it belong to the level-check track.
export type Question = { k?: 'new'; b: number; d: 1 | 2 | 3; t: string; q: string; o: string[]; a: number; e: string };

export const STAGES = ['AI Basics', 'Level 1 · GenAI & Tools', 'Level 2 · ML & RAG', 'Level 3 · Agents & MCP'];
// "New to AI" climbs its own beginner levels; each still maps to the same course recommendation.
export const BEGINNER_STAGES = ['Curious · AI around you', 'Explorer · Chatbots & prompts', 'Creator · How AI learns', 'Innovator · AI agents'];
export const stagesFor = (chosenLevel: number | null) => (chosenLevel ? STAGES : BEGINNER_STAGES);

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
  // ===== "I chose a level" track: course-style questions =====
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

  // Stage 2: Level 2 content
  { b: 2, d: 1, t: 'Machine Learning', q: 'Supervised learning trains a model using…', o: ['Labelled data (inputs paired with correct outputs)', 'No data at all', 'Only images', 'Rewards from a game only'], a: 0, e: 'Each training example has the right answer attached, e.g. emails labelled spam / not spam.' },
  { b: 2, d: 1, t: 'Machine Learning', q: 'Predicting the selling price of a house is a…', o: ['Classification problem', 'Clustering problem', 'Regression problem', 'Ranking problem'], a: 2, e: 'Regression predicts a continuous number; classification predicts a category.' },
  { b: 2, d: 1, t: 'RAG', q: 'RAG stands for…', o: ['Rapid AI Generation', 'Random Answer Generator', 'Recursive Attention Graph', 'Retrieval-Augmented Generation'], a: 3, e: 'RAG retrieves relevant documents and adds them to the prompt before the LLM answers.' },
  { b: 2, d: 2, t: 'Machine Learning', q: 'A model scores 99% on training data but 60% on new data. This is…', o: ['Underfitting', 'Overfitting', 'Data augmentation', 'Perfect generalisation'], a: 1, e: 'Overfitting = memorising the training set instead of learning patterns that generalise.' },
  { b: 2, d: 2, t: 'Embeddings', q: 'A text embedding is…', o: ['A compressed zip file', 'An image inside a document', 'A numeric vector that captures meaning, so similar texts are close together', 'A font style'], a: 2, e: 'Embeddings map text to vectors; semantically similar text lands near each other in vector space.' },
  { b: 2, d: 2, t: 'Embeddings', q: 'A vector database (e.g. Chroma, Pinecone, FAISS) is used to…', o: ['Store and search embeddings by similarity', 'Host websites', 'Render 3D graphics', 'Replace an LLM'], a: 0, e: 'Vector DBs do fast nearest-neighbour search over millions of embeddings.' },
  { b: 2, d: 2, t: 'RAG', q: 'The main advantage of RAG over relying on the LLM alone is…', o: ['It makes the model smaller', 'Answers are grounded in your own, up-to-date documents without retraining', 'It removes the need for prompts', 'It makes responses longer'], a: 1, e: 'RAG injects fresh, private knowledge at query time and reduces hallucinations.' },
  { b: 2, d: 2, t: 'RAG', q: 'Why are documents split into "chunks" in a RAG pipeline?', o: ['To make files look neat', 'To encrypt them', 'So retrieval is precise and relevant pieces fit in the context window', 'Because LLMs cannot read PDFs'], a: 2, e: 'Smaller chunks give sharper similarity matches and fit within token limits.' },
  { b: 2, d: 3, t: 'Deep Learning', q: 'How does a neural network learn its weights during training?', o: ['Random guessing each epoch', 'Copying weights from the internet', 'Manual tuning by engineers', 'Backpropagation with gradient descent to reduce the loss'], a: 3, e: 'Backprop computes how each weight affects the error; gradient descent nudges weights to reduce it.' },
  { b: 2, d: 3, t: 'Deep Learning', q: 'The key mechanism inside Transformer models is…', o: ['Self-attention', 'Decision trees', 'Convolution only', 'K-means'], a: 0, e: 'Self-attention lets every token weigh its relationship to every other token in the sequence.' },
  { b: 2, d: 3, t: 'Embeddings', q: 'Which metric is most commonly used to compare two embeddings?', o: ['Word count', 'Cosine similarity', 'File size', 'Character length'], a: 1, e: 'Cosine similarity measures the angle between vectors: closer to 1 means more similar.' },
  { b: 2, d: 3, t: 'RAG', q: 'Adding a "re-ranker" to a RAG system helps by…', o: ['Re-ordering retrieved chunks so the most relevant go to the LLM', 'Translating documents', 'Deleting old documents', 'Increasing temperature'], a: 0, e: 'A re-ranker scores retrieved candidates more carefully, improving answer quality.' },

  // Stage 3: Level 3 content
  { b: 3, d: 1, t: 'AI Agents', q: 'What mainly separates an AI agent from a plain chatbot?', o: ['It has a nicer UI', 'It plans and takes actions with tools in a loop to reach a goal', 'It uses a bigger font', 'It never uses an LLM'], a: 1, e: 'Agents reason, call tools, observe results and iterate until the task is done.' },
  { b: 3, d: 1, t: 'Browser Agents', q: 'A browser agent…', o: ['Is a new web browser brand', 'Controls a real browser (navigate, click, type) to complete web tasks', 'Blocks advertisements', 'Speeds up page loading'], a: 1, e: 'Browser agents use automation (e.g. Playwright) plus an LLM to operate websites like a human.' },
  { b: 3, d: 1, t: 'Deployment & Safety', q: 'Your agent can send emails and make payments. Best safety practice?', o: ['Require human approval for high-impact actions and give least-privilege access', 'Give it admin access to everything', 'Turn off logging', 'Let it retry forever'], a: 0, e: 'Human-in-the-loop and least privilege limit damage from mistakes or prompt injection.' },
  { b: 3, d: 2, t: 'Tool Calling & MCP', q: 'With function / tool calling, what does the LLM actually do?', o: ['Runs the code on its own servers', 'Outputs a structured call (tool name + JSON arguments) that your app executes', 'Edits your database directly', 'Downloads the tool'], a: 1, e: 'The model chooses the tool and arguments; your application runs it and returns the result.' },
  { b: 3, d: 2, t: 'Tool Calling & MCP', q: 'MCP (Model Context Protocol) is…', o: ['A GPU driver', 'A prompt template', 'A fine-tuning method', 'An open standard for connecting AI apps to tools and data sources through servers'], a: 3, e: 'MCP servers expose tools/resources once, and any MCP-compatible AI client can use them.' },
  { b: 3, d: 2, t: 'Agent Frameworks', q: 'CrewAI is mainly used for…', o: ['Image editing', 'Database backups', 'Orchestrating multiple role-based agents that collaborate on a task', 'Speech synthesis'], a: 2, e: 'CrewAI defines agents with roles and goals that work together as a "crew".' },
  { b: 3, d: 2, t: 'AI Agents', q: 'A key benefit of a multi-agent (supervisor + specialists) design is…', o: ['It never needs prompts', 'It always costs less', 'It removes the need for tools', 'Each agent specialises, and a supervisor routes sub-tasks to the right one'], a: 3, e: 'Specialisation keeps each agent focused and makes complex workflows easier to manage.' },
  { b: 3, d: 2, t: 'Deployment & Safety', q: 'An agent keeps calling the same tool forever. The simplest fix?', o: ['Use a bigger GPU', 'Add a max-iterations limit / clear stopping condition', 'Increase temperature', 'Remove all tools'], a: 1, e: 'Agent loops need step limits and explicit "done" conditions.' },
  { b: 3, d: 3, t: 'AI Agents', q: 'The "ReAct" agent pattern means…', o: ['Using React.js for the UI', 'Reacting only to errors', 'Interleaving reasoning steps with actions (tool calls) and observations', 'Retraining the model after each answer'], a: 2, e: 'ReAct = Reason + Act: think, call a tool, read the observation, repeat.' },
  { b: 3, d: 3, t: 'Agent Frameworks', q: 'LangGraph models an agent workflow as…', o: ['A graph of nodes and edges with shared state, including loops', 'A single long prompt', 'A spreadsheet', 'A fixed linear script only'], a: 0, e: 'Nodes do work, edges route control, and state flows through. Cycles enable agent loops.' },
  { b: 3, d: 3, t: 'Tool Calling & MCP', q: 'Why give each tool a JSON schema?', o: ['To make it look professional', 'To slow the model down', 'So the model knows the parameters and produces valid arguments', 'It is required by HTML'], a: 2, e: 'The schema describes names, types and required fields, so tool calls are well-formed.' },
  { b: 3, d: 3, t: 'AI Agents', q: 'In agents, "long-term memory" usually means…', o: ['The current chat window only', 'The GPU RAM', 'The model weights', 'Information persisted across sessions, e.g. in a database or vector store'], a: 3, e: 'Short-term memory is the running conversation; long-term memory is stored and recalled later.' },

  // ===== "New to AI" track: fun, everyday questions =====
  // Stage 0: AI basics
  { k: 'new', b: 0, d: 1, t: 'AI Around You', q: 'Netflix suggests a show and you end up loving it. Who picked it for you?', o: ['A random intern', 'An AI that learned from what you watch', "Your phone's battery", 'Pure luck'], a: 1, e: 'Recommendation AI studies what you (and people like you) watch, then predicts what you will enjoy next.' },
  { k: 'new', b: 0, d: 1, t: 'AI Around You', q: 'Your phone unlocks the moment it sees your face. What is doing the magic?', o: ['Face-recognition AI', 'A tiny camera elf', 'The flashlight', 'Your Wi-Fi'], a: 0, e: 'Face ID uses AI that learned the unique shape of your face, so it can tell you apart from everyone else.' },
  { k: 'new', b: 0, d: 1, t: 'AI Around You', q: 'Google Maps says "Traffic ahead, take the next left". How does it know?', o: ['It guesses', 'Someone phones it in', 'AI reading live location data from millions of phones', 'It checks the newspaper'], a: 2, e: 'Maps AI spots slow-moving phones on a road and predicts a jam, then reroutes you.' },
  { k: 'new', b: 0, d: 1, t: 'AI Around You', q: 'Which of these is an AI chatbot you can have a conversation with?', o: ['Microsoft Paint', 'A calculator', 'Notepad', 'ChatGPT'], a: 3, e: 'ChatGPT, Gemini and Claude are AI chatbots built on large language models.' },
  { k: 'new', b: 0, d: 2, t: 'How AI Learns', q: 'You show an AI 10,000 pizza photos and 10,000 "not pizza" photos. What is it doing?', o: ['Ordering pizza', 'Learning from examples, called "training"', 'Getting hungry', 'Deleting the photos'], a: 1, e: 'This is training: the AI finds patterns (round, cheesy, toppings…) so it can recognise pizza in new photos.' },
  { k: 'new', b: 0, d: 2, t: 'Generative AI', q: 'You type "a cat astronaut eating ice cream on the moon" and get a picture. This is…', o: ['A search for a real photo', 'Photoshop by a human', 'Generative AI creating a brand-new image', 'A screenshot'], a: 2, e: 'Generative AI creates new content (images, text, music) from your description.' },
  { k: 'new', b: 0, d: 2, t: 'Using AI Wisely', q: 'A chatbot confidently says the Eiffel Tower is in London. What happened?', o: ['It made a mistake. AI can "hallucinate" wrong facts', 'The tower moved', 'The internet was down', 'AI is never wrong, so it must be true'], a: 0, e: 'AI can sound sure and still be wrong. Always double-check important facts.' },
  { k: 'new', b: 0, d: 2, t: 'AI Around You', q: 'Your inbox moves "You WON a free iPhone!!!" straight to spam. Why?', o: ['The sender asked it to', 'Your inbox was full', 'Pure chance', 'AI learned what spam emails usually look like'], a: 3, e: 'Spam filters are trained on millions of emails people marked as spam, so they recognise the pattern.' },
  { k: 'new', b: 0, d: 2, t: 'How AI Learns', q: 'Who builds your Spotify "Discover Weekly" playlist?', o: ['AI spotting patterns in what you and similar listeners play', 'A DJ who secretly knows you', 'Songs in alphabetical order', 'The most expensive songs'], a: 0, e: 'Spotify compares your listening with millions of others to find songs you are likely to love.' },
  { k: 'new', b: 0, d: 3, t: 'How AI Learns', q: 'Which is the best description of how AI "learns"?', o: ['It reads one book and memorises it', 'It downloads a human brain', 'It finds patterns in lots of data', 'It asks a human every single time'], a: 2, e: 'Machine learning means finding patterns in large amounts of data, then using them on new situations.' },
  { k: 'new', b: 0, d: 3, t: 'Using AI Wisely', q: "You're using an AI chatbot for homework. What is the smart move?", o: ['Share your passwords so it helps better', 'Copy everything without reading it', 'Trust it 100%', "Check important facts and don't share personal info"], a: 3, e: 'Use AI as a helper: verify what it says and keep private information private.' },
  { k: 'new', b: 0, d: 3, t: 'Using AI Wisely', q: 'An AI hiring tool, trained mostly on past male hires, starts preferring men. Why?', o: ['It copied a bias hidden in its training data', 'AI dislikes people', 'The server was faulty', 'It was a coincidence'], a: 0, e: 'AI learns whatever patterns are in its data, including unfair ones. Good data matters.' },

  // Stage 1: GenAI & tools, beginner style
  { k: 'new', b: 1, d: 1, t: 'GenAI Basics', q: 'You ask ChatGPT for a birthday poem for your mom and get one in seconds. ChatGPT is…', o: ['A chatbot powered by a Large Language Model (LLM)', 'A human typing really fast', 'A search engine copying an old poem', 'A spell checker'], a: 0, e: 'ChatGPT runs on an LLM, an AI trained on huge amounts of text that writes new text for you.' },
  { k: 'new', b: 1, d: 1, t: 'Prompting', q: 'Which message to a chatbot will get the most useful answer?', o: ['"Food?"', '"Tell me stuff"', '"Suggest 3 veg dinners I can cook in 15 minutes, with steps"', '"Dinner!!!"'], a: 2, e: 'Clear, specific prompts (what you want, any limits, the format) get much better answers.' },
  { k: 'new', b: 1, d: 2, t: 'Multimodal AI', q: 'An app turns your voice note into written text. Which kind of AI is that?', o: ['Text-to-image', 'Spam filtering', 'Speech-to-text', 'A calculator'], a: 2, e: 'Speech-to-text AI (like OpenAI Whisper) listens to audio and writes down the words.' },
  { k: 'new', b: 1, d: 2, t: 'AI Tools', q: 'You want a poster image made from a text description. Which tool fits?', o: ['Excel', 'Zoom', 'WhatsApp', 'DALL·E or Midjourney'], a: 3, e: 'Image generators like DALL·E, Midjourney and Stable Diffusion turn text into pictures.' },
  { k: 'new', b: 1, d: 2, t: 'Prompting', q: 'You start with "Act as a friendly maths teacher…". What is this prompt trick called?', o: ['Hacking the AI', 'Giving the AI a role', 'Training a new model', 'Coding'], a: 1, e: 'Role prompting tells the AI who to be, which shapes its tone and the kind of answer you get.' },
  { k: 'new', b: 1, d: 3, t: 'GenAI Basics', q: 'Chatbots read text in small chunks like "un", "believ", "able". What are these chunks called?', o: ['Tokens', 'Pixels', 'Cookies', 'Emojis'], a: 0, e: 'LLMs read and write tokens, which are small pieces of words. Limits and prices are counted in tokens too.' },
  { k: 'new', b: 1, d: 3, t: 'Prompting', q: 'You want the AI to be more creative and surprising. Which setting do you turn up?', o: ['Volume', 'Temperature', 'Brightness', 'Font size'], a: 1, e: 'Higher temperature means more random, creative output. Lower means more focused and predictable.' },

  // Stage 2: ML & RAG, beginner style
  { k: 'new', b: 2, d: 1, t: 'Machine Learning', q: 'You teach an AI using photos labelled "cat" or "dog". Learning from labelled examples is called…', o: ['Magic', 'Supervised learning', 'Copy-paste', 'Guesswork'], a: 1, e: 'Supervised learning means every example comes with the right answer, so the AI learns to match them.' },
  { k: 'new', b: 2, d: 1, t: 'Machine Learning', q: 'An AI estimates a house price from its size and location. What is it predicting?', o: ['A number', 'A colour', 'A yes/no answer', 'An emoji'], a: 0, e: 'Predicting a number is called regression. Picking a category (like spam/not spam) is classification.' },
  { k: 'new', b: 2, d: 2, t: 'Machine Learning', q: "A student memorises last year's answers but fails a new exam. In AI this problem is called…", o: ['Underfitting', 'Overclocking', 'Overfitting', 'Overthinking'], a: 2, e: 'An overfit model memorises its training data instead of learning patterns, so it fails on new data.' },
  { k: 'new', b: 2, d: 2, t: 'Embeddings', q: 'AI places "king" and "queen" close together on a map of word meanings. These meaning-maps are called…', o: ['Spreadsheets', 'Hashtags', 'Fonts', 'Embeddings'], a: 3, e: 'Embeddings turn words into numbers so that similar meanings sit close together.' },
  { k: 'new', b: 2, d: 2, t: 'RAG', q: "A company chatbot looks up the right page in the company's handbook before answering. This is called…", o: ['RAG (Retrieval-Augmented Generation)', 'Guessing', 'Fine print', 'Copy-paste'], a: 0, e: 'RAG retrieves relevant documents first, then the AI answers using them, so answers stay accurate.' },
  { k: 'new', b: 2, d: 3, t: 'Deep Learning', q: 'Deep learning uses layers of tiny connected units, loosely inspired by the brain. What are they called?', o: ['Routers', 'Folders', 'Neural networks', 'Spreadsheets'], a: 2, e: 'Neural networks power deep learning, from face recognition to chatbots.' },
  { k: 'new', b: 2, d: 3, t: 'RAG', q: 'Before a chatbot can search a 300-page PDF, the PDF is cut into small pieces. Why?', o: ['To save paper', 'So it can quickly find just the relevant bits', "Because AI can't read long words", 'To hide information'], a: 1, e: 'Small chunks are easier to search and match, and they fit in what the AI can read at once.' },

  // Stage 3: Agents, beginner style
  { k: 'new', b: 3, d: 1, t: 'AI Agents', q: 'You say "Book me the cheapest flight to Goa" and the AI searches, compares and books it. This is an…', o: ['AI agent', 'Calculator', 'Screensaver', 'Email signature'], a: 0, e: 'An agent plans steps and takes actions with tools to reach your goal, not just chat.' },
  { k: 'new', b: 3, d: 1, t: 'Tool Calling', q: 'A chatbot checks a weather app to tell you if it will rain. Using outside apps like this is called…', o: ['Daydreaming', 'Tool calling', 'Printing', 'Buffering'], a: 1, e: 'Tool calling lets an AI use apps and APIs (weather, search, calendar) to get real answers.' },
  { k: 'new', b: 3, d: 2, t: 'AI Agents', q: 'One AI researches, another writes and a third checks the work, like a team. This is a…', o: ['Single prompt', 'Group chat sticker', 'Multi-agent system', 'Spreadsheet'], a: 2, e: 'Multi-agent systems split big jobs between specialist AIs, often with a "manager" agent.' },
  { k: 'new', b: 3, d: 2, t: 'Browser Agents', q: 'An AI that opens websites, clicks buttons and fills in forms for you is a…', o: ['Web designer', 'Antivirus', 'Search bar', 'Browser agent'], a: 3, e: 'Browser agents operate websites like a person would, to finish tasks for you.' },
  { k: 'new', b: 3, d: 2, t: 'Safety', q: 'Your AI agent is allowed to spend money. What is the safest setup?', o: ['It asks you before any payment', 'It spends freely', 'You give it your bank password', 'You turn off all its logs'], a: 0, e: 'Keep a human in the loop for risky actions and give agents only the access they need.' },
  { k: 'new', b: 3, d: 3, t: 'Tool Calling', q: 'MCP lets AI apps plug into tools and data like a universal adapter. What does MCP stand for?', o: ['Mega Computer Program', 'Model Context Protocol', 'Machine Control Panel', 'Multi Chat Platform'], a: 1, e: 'Model Context Protocol is an open standard for connecting AI apps to tools and data sources.' },
  { k: 'new', b: 3, d: 3, t: 'AI Agents', q: 'An AI agent keeps repeating the same step forever. What is the simplest fix?', o: ['Buy a faster laptop', 'Make the screen bigger', 'Set a limit on how many steps it can take', 'Restart the internet'], a: 2, e: 'Agents need step limits and a clear "done" condition so they never loop forever.' },
];

export const STATUSES = ['School student', 'College student', 'Graduate / job seeker', 'Working professional'];

export const TIME_LIMIT_SECONDS = 20 * 60;

// Each stage is a short paper ordered easy → hard. The student moves freely inside the
// open stage, then submits it: pass and the next (harder) stage unlocks, fail and the test ends.
// Stages below the chosen level's prerequisite are a quick check: 3 questions, 2 to pass.
// The stages that decide the recommendation are 4 questions, 3 to pass.
type Tier = 1 | 2 | 3;
export const isQuick = (chosenLevel: number | null, stage: number) => !!chosenLevel && stage < chosenLevel - 1;
export const passMark = (chosenLevel: number | null, stage: number) => (isQuick(chosenLevel, stage) ? 2 : 3);
const tiersFor = (chosenLevel: number | null, stage: number): Tier[] => (isQuick(chosenLevel, stage) ? [1, 2, 3] : [1, 2, 2, 3]);

// "New to AI" gets the fun beginner track; "I chose a level" gets course-style questions.
export const inTrack = (q: Question, chosenLevel: number | null) => (q.k === 'new') === !chosenLevel;

export type Choice = number | null;
export type Session = {
  chosenLevel: number | null;
  paper: Question[][]; // per stage, easy → hard
  picks: Choice[][];   // per stage, per question
  stage: number;       // the open stage (or the last one taken, once done)
  passed: number;      // stages 0..passed-1 are cleared
  done: boolean;
};

export function createSession(chosenLevel: number | null = null, rng: () => number = Math.random): Session {
  const paper = STAGES.map((_, b) => {
    const used = new Set<Question>();
    return tiersFor(chosenLevel, b).map(d => {
      const pool = QUESTIONS.filter(q => inTrack(q, chosenLevel) && q.b === b && q.d === d && !used.has(q));
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
    if (qs.some((q, i) => !q || !inTrack(q, chosenLevel) || q.b !== b || q.d !== tiers[i])) return null; // must be a progressive paper
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
  const stages = stagesFor(s.chosenLevel).map((name, b) => {
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
