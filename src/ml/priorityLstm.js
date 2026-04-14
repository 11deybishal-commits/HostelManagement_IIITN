import * as tf from "@tensorflow/tfjs";

const LABELS = ["Low", "Medium", "High"];
const MAX_LEN = 24;
const SAMPLES_PER_LABEL = 1800;
const ENABLE_BROWSER_TRAINING = import.meta.env?.VITE_ENABLE_BROWSER_MODEL === "true";

let modelPromise;

const LOW_CONFIG = {
  seed: 17,
  templates: [
    "minor {issue} in {location}",
    "small {issue} near {location}",
    "routine {issue} at {location}",
    "cosmetic {issue} in {location}",
    "slight {issue} around {location}",
    "low impact {issue} in {location}",
    "{category} concern with {issue} in {location}",
    "{issue} needs attention but there is no safety risk at {location}",
    "{category} maintenance needed for {issue} at {location}",
    "{issue} is annoying but not urgent in {location}",
  ],
  categories: ["Electricity", "Water", "Cleaning", "Internet", "Other"],
  issues: [
    "bulb flicker",
    "fan noise",
    "paint peel",
    "wardrobe handle",
    "table scratch",
    "door hinge",
    "chair wobble",
    "tap drip",
    "light cover loose",
    "socket plate loose",
    "curtain rail bent",
    "locker hinge",
    "ceiling stain",
    "dust on shelf",
    "window latch",
    "minor seepage",
    "small crack",
    "meter cover scratch",
    "button loose",
    "bench mark",
  ],
  locations: [
    "room 204",
    "block A corridor",
    "mess hall",
    "bathroom corner",
    "hostel lobby",
    "wash area",
    "study room",
    "staircase landing",
    "common area",
    "ground floor passage",
    "balcony rail",
    "wardrobe side",
    "window frame",
    "ceiling panel",
    "bed side",
    "near the sink",
  ],
  impacts: [
    "no risk to students",
    "can wait for routine maintenance",
    "affects appearance only",
    "does not block daily use",
    "needs a normal repair slot",
    "no urgent action required",
  ],
};

const MEDIUM_CONFIG = {
  seed: 51,
  templates: [
    "{category} problem with intermittent {issue} in {location}",
    "recurring {issue} near {location} affecting daily use",
    "{issue} is blocking normal use of {location}",
    "medium severity {issue} at {location} causing inconvenience",
    "{category} service is unstable in {location}",
    "{issue} has been broken for hours in {location}",
    "{issue} is not working properly at {location}",
    "{issue} needs timely repair before it gets worse in {location}",
    "{category} complaint about {issue} with recurring delays at {location}",
    "{issue} is making routine hostel life difficult in {location}",
  ],
  categories: ["Electricity", "Water", "Cleaning", "Internet", "Other"],
  issues: [
    "water supply",
    "wifi",
    "geyser",
    "toilet flush",
    "drainage",
    "cleaning",
    "fan",
    "light",
    "tap",
    "door lock",
    "sewage smell",
    "cooler",
    "phone charging point",
    "washroom light",
    "corridor light",
    "menu service",
    "lift",
    "study desk",
    "window shutter",
    "room ventilation",
  ],
  locations: [
    "Hostel A",
    "Hostel B",
    "block C",
    "room 118",
    "room 221",
    "washroom 2",
    "mess counter",
    "first floor",
    "second floor",
    "corridor",
    "reading hall",
    "common wash area",
    "water cooler point",
    "basement passage",
    "stairwell",
    "rear wing",
  ],
  impacts: [
    "causing inconvenience to students",
    "interrupting normal routine",
    "needs attention soon",
    "should be resolved today",
    "is affecting several residents",
    "keeps coming back after repair",
  ],
};

const HIGH_CONFIG = {
  seed: 89,
  templates: [
    "urgent {issue} in {location} {impact}",
    "dangerous {issue} near {location} causing immediate risk",
    "critical {issue} with {impact} at {location}",
    "fire or electric hazard: {issue} in {location}",
    "food contamination and poison complaint at {location}",
    "gas leak smell and smoke near {location}",
    "electrical shock risk because of {issue} at {location}",
    "severe {issue} creating safety danger in {location}",
    "life threatening {issue} reported at {location}",
    "high risk {issue} needs immediate response in {location}",
  ],
  categories: ["Electricity", "Water", "Cleaning", "Internet", "Other", "Mess", "Kitchen"],
  issues: [
    "exposed live wire",
    "short circuit",
    "fire smell",
    "smoke from switchboard",
    "poison in food",
    "food contamination",
    "gas leak",
    "gas smell",
    "electric shock risk",
    "sparking outlet",
    "water flooding",
    "severe leakage near power line",
    "chemical spill",
    "blood contamination",
    "bathroom collapse",
    "burning smell",
    "unsafe staircase",
    "broken ceiling with falling debris",
    "panic alarm",
    "hostel kitchen smoke",
  ],
  locations: [
    "mess kitchen",
    "room 101",
    "main corridor",
    "bathroom",
    "meter box area",
    "power room",
    "staircase",
    "Hostel C",
    "common washroom",
    "main entrance",
    "ground floor hall",
    "electrical panel",
    "basement",
    "water line junction",
    "mess serving area",
    "block D",
  ],
  impacts: [
    "requiring immediate evacuation",
    "posing a safety hazard",
    "with danger to residents",
    "and needs emergency action",
    "with possible injury risk",
    "that should be fixed immediately",
  ],
};

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function buildVocabulary(samples) {
  const vocab = new Map();
  let idx = 1;
  for (const sample of samples) {
    for (const token of tokenize(sample.text)) {
      if (!vocab.has(token)) {
        vocab.set(token, idx++);
      }
    }
  }
  return vocab;
}

function createRng(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function pick(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function renderTemplate(template, values) {
  return template
    .replace(/\{category\}/g, values.category)
    .replace(/\{issue\}/g, values.issue)
    .replace(/\{location\}/g, values.location)
    .replace(/\{impact\}/g, values.impact);
}

function generateSamples(config, count, label) {
  const rng = createRng(config.seed);
  const samples = [];
  const seen = new Set();

  while (samples.length < count) {
    const values = {
      category: pick(config.categories, rng),
      issue: pick(config.issues, rng),
      location: pick(config.locations, rng),
      impact: pick(config.impacts, rng),
    };

    const sample = renderTemplate(pick(config.templates, rng), values).toLowerCase();

    if (seen.has(sample)) {
      continue;
    }

    seen.add(sample);
    samples.push({ text: sample, label });
  }

  return samples;
}

function buildTrainingSamples() {
  const samples = [
    ...generateSamples(LOW_CONFIG, SAMPLES_PER_LABEL, "Low"),
    ...generateSamples(MEDIUM_CONFIG, SAMPLES_PER_LABEL, "Medium"),
    ...generateSamples(HIGH_CONFIG, SAMPLES_PER_LABEL, "High"),
  ];

  tf.util.shuffle(samples);
  return samples;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const RULE_SETS = {
  High: [
    "poison in food",
    "food contamination",
    "gas leak",
    "gas smell",
    "smoke",
    "fire",
    "burning smell",
    "short circuit",
    "sparking",
    "live wire",
    "electric shock",
    "electric shock risk",
    "exposed wire",
    "wire leak",
    "current leak",
    "electric leak",
    "wire spark",
    "wire exposed",
    "flooding",
    "chemical spill",
    "blood contamination",
    "unsafe staircase",
    "collapse",
    "emergency",
    "evacuate",
  ],
  Medium: [
    "intermittent",
    "not working",
    "broken",
    "clogged",
    "leaking",
    "slow",
    "unstable",
    "jammed",
    "stuck",
    "not heating",
    "not cooling",
    "recurring",
    "inconvenience",
    "needs timely repair",
    "affecting daily use",
  ],
  Low: [
    "minor",
    "small",
    "cosmetic",
    "slight",
    "routine",
    "no risk",
    "not urgent",
    "can wait",
    "annoying",
    "paint peel",
    "bulb flicker",
    "fan noise",
    "loose",
    "scratch",
  ],
};

function scoreRules(text) {
  const normalized = normalizeText(text);
  const tokens = tokenize(normalized);
  const scores = { Low: 0, Medium: 0, High: 0 };

  for (const [label, phrases] of Object.entries(RULE_SETS)) {
    for (const phrase of phrases) {
      if (normalized.includes(phrase)) {
        scores[label] += phrase.length >= 12 ? 3 : 1;
      }
    }
  }

  if (normalized.includes("poison") || normalized.includes("gas leak") || normalized.includes("live wire") || normalized.includes("electric shock")) {
    scores.High += 4;
  }

  if (normalized.includes("food") && (normalized.includes("smell") || normalized.includes("contamination") || normalized.includes("poison"))) {
    scores.High += 3;
  }

  if (normalized.includes("water") && normalized.includes("flood")) {
    scores.High += 2;
  }

  // Token-level safety heuristics so short user phrases like "wire leak" are caught.
  if (tokens.includes("wire") || tokens.includes("electric") || tokens.includes("electrical")) {
    scores.High += 2;
  }
  if (tokens.includes("spark") || tokens.includes("sparking") || tokens.includes("shock")) {
    scores.High += 2;
  }
  if (tokens.includes("leak") || tokens.includes("leakage")) {
    scores.Medium += 1;
  }
  if ((tokens.includes("wire") || tokens.includes("electric") || tokens.includes("electrical"))
    && (tokens.includes("leak") || tokens.includes("leakage") || tokens.includes("spark") || tokens.includes("sparking"))) {
    scores.High += 3;
  }

  const total = scores.Low + scores.Medium + scores.High;

  if (total === 0) {
    return {
      label: "Low",
      confidence: 0.55,
      probabilities: [0.55, 0.3, 0.15],
    };
  }

  const probabilities = LABELS.map((label) => scores[label] / total);
  const topValue = Math.max(...probabilities);
  const topIndex = probabilities.findIndex((value) => value === topValue);

  return {
    label: LABELS[topIndex],
    confidence: topValue,
    probabilities,
  };
}

function normalizeProbabilities(probabilities) {
  const sum = probabilities.reduce((total, value) => total + value, 0) || 1;
  return probabilities.map((value) => value / sum);
}

function blendPredictions(modelProbabilities, ruleProbabilities) {
  const blended = modelProbabilities.map((value, index) => value * 0.7 + ruleProbabilities[index] * 0.3);
  return normalizeProbabilities(blended);
}

function vectorize(text, vocab) {
  const tokens = tokenize(text);
  const seq = new Array(MAX_LEN).fill(0);
  const trimmed = tokens.slice(0, MAX_LEN);
  for (let i = 0; i < trimmed.length; i += 1) {
    seq[i] = vocab.get(trimmed[i]) || 0;
  }
  return seq;
}

async function trainModel() {
  await tf.ready();

  const trainingSamples = buildTrainingSamples();
  const vocab = buildVocabulary(trainingSamples);
  const vocabSize = vocab.size + 1;

  const xsData = trainingSamples.map((s) => vectorize(s.text, vocab));
  const ysData = trainingSamples.map((s) => LABELS.indexOf(s.label));

  const xs = tf.tensor2d(xsData, [xsData.length, MAX_LEN], "int32");
  const ys = tf.oneHot(tf.tensor1d(ysData, "int32"), LABELS.length).toFloat();

  const model = tf.sequential();
  model.add(tf.layers.embedding({ inputDim: vocabSize, outputDim: 32, inputLength: MAX_LEN }));
  model.add(tf.layers.bidirectional({
    layer: tf.layers.lstm({ units: 16, returnSequences: false }),
    mergeMode: "concat",
  }));
  model.add(tf.layers.dropout({ rate: 0.15 }));
  model.add(tf.layers.dense({ units: 16, activation: "relu" }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  model.compile({
    optimizer: tf.train.adam(0.003),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  const callbacks = [tf.callbacks.earlyStopping({ monitor: "val_loss", patience: 2 })];

  await model.fit(xs, ys, {
    epochs: 5,
    batchSize: 64,
    shuffle: true,
    validationSplit: 0.15,
    callbacks,
    verbose: 0,
  });

  xs.dispose();
  ys.dispose();

  return { model, vocab };
}

export async function initializePriorityModel() {
  // Keep prediction responsive by default. Neural training is opt-in only.
  if (!ENABLE_BROWSER_TRAINING) {
    return { model: null, vocab: null };
  }

  if (!modelPromise) {
    modelPromise = trainModel().catch((error) => {
      console.error("Priority model warmup failed, rule-based fallback will be used:", error);
      return { model: null, vocab: null };
    });
  }
  return modelPromise;
}

export async function predictPriorityLstm(description) {
  if (!description || !description.trim()) {
    return { label: "Low", confidence: 0, probabilities: [1, 0, 0] };
  }

  const inputText = normalizeText(description);
  const rulePrediction = scoreRules(inputText);

  if (rulePrediction.confidence >= 0.9) {
    return rulePrediction;
  }

  const { model, vocab } = await initializePriorityModel();
  if (!model || !vocab) {
    return rulePrediction;
  }

  const input = tf.tensor2d([vectorize(description, vocab)], [1, MAX_LEN], "int32");
  const output = model.predict(input);
  const probs = Array.from(await output.data());

  input.dispose();
  output.dispose();

  const blended = blendPredictions(probs, rulePrediction.probabilities);
  const maxVal = Math.max(...blended);
  const maxIdx = blended.findIndex((v) => v === maxVal);

  return {
    label: LABELS[maxIdx] || "Low",
    confidence: maxVal,
    probabilities: blended,
  };
}
