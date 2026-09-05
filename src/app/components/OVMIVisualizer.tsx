'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import profileData from './ovmiProfiles.json';

type ProfileKey = keyof typeof profileData.profiles;

interface Preset {
  id: string;
  label: string;
  configuration: string;
  accuracy: number;
  coverage: number;
  profile: ProfileKey;
  metricNote: string;
  sourceUrl?: string;
}

const examplePresets: Preset[] = [
  {
    id: 'study-a',
    label: 'Study A',
    configuration: '50 words · 90% accuracy',
    accuracy: 90,
    coverage: profileData.profiles.example50.coverage,
    profile: 'example50',
    metricNote: 'Hypothetical study · 50 most frequent SUBTLEX-UK words',
  },
  {
    id: 'study-b',
    label: 'Study B',
    configuration: '1,000 words · 70% accuracy',
    accuracy: 70,
    coverage: profileData.profiles.example1000.coverage,
    profile: 'example1000',
    metricNote: 'Hypothetical study · 1,000 most frequent SUBTLEX-UK words',
  },
];

const realPresets: Preset[] = [
  {
    id: 'moses-50',
    label: 'Moses 2021',
    configuration: '50 words · isolated',
    accuracy: 47.1,
    coverage: profileData.profiles.moses50.coverage,
    profile: 'moses50',
    metricNote: '47.1% isolated-word accuracy',
    sourceUrl: 'https://doi.org/10.1056/NEJMoa2027540',
  },
  {
    id: 'willett-50',
    label: 'Willett 2023',
    configuration: '50 words · isolated',
    accuracy: 94,
    coverage: profileData.profiles.moses50.coverage,
    profile: 'moses50',
    metricNote: '94.0% isolated-word accuracy',
    sourceUrl: 'https://doi.org/10.1038/s41586-023-06377-x',
  },
  {
    id: 'willett-125k',
    label: 'Willett 2023',
    configuration: '125k words · +LM',
    accuracy: 76.2,
    coverage: profileData.profiles.cmudict125k.coverage,
    profile: 'cmudict125k',
    metricNote: '76.2% = 1 − reported WER',
    sourceUrl: 'https://doi.org/10.1038/s41586-023-06377-x',
  },
  {
    id: 'card-125k',
    label: 'Card 2024',
    configuration: '125k words · +LM',
    accuracy: 97.5,
    coverage: profileData.profiles.cmudict125k.coverage,
    profile: 'cmudict125k',
    metricNote: '97.5% = 1 − reported WER',
    sourceUrl: 'https://doi.org/10.1056/NEJMoa2314132',
  },
];

const presets = [...examplePresets, ...realPresets];
const initialPreset = examplePresets[0];
const profileLabels: Record<ProfileKey, string> = {
  example50: '50 most frequent SUBTLEX-UK words',
  example1000: '1,000 most frequent SUBTLEX-UK words',
  moses50: 'Moses 50-word vocabulary',
  cmudict125k: '125k CMUdict proxy',
};

function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

function informationAtAccuracy(profile: ProfileKey, accuracy: number) {
  const curve = profileData.profiles[profile].informationCurveBits;
  const position = (accuracy - profileData.accuracyMinimum) / profileData.accuracyStep;
  const lowerIndex = Math.max(0, Math.min(curve.length - 1, Math.floor(position)));
  const upperIndex = Math.max(0, Math.min(curve.length - 1, Math.ceil(position)));
  const fraction = position - Math.floor(position);
  return curve[lowerIndex] + (curve[upperIndex] - curve[lowerIndex]) * fraction;
}

export default function OVMIVisualizer() {
  const [accuracy, setAccuracy] = useState(initialPreset.accuracy);
  const [coverage, setCoverage] = useState(initialPreset.coverage);
  const [profile, setProfile] = useState<ProfileKey>(initialPreset.profile);

  const activePreset = presets.find(
    (preset) =>
      preset.profile === profile &&
      Math.abs(preset.accuracy - accuracy) < 0.001 &&
      Math.abs(preset.coverage - coverage) < 0.001,
  );

  const result = useMemo(() => {
    const inVocabularyInformation = informationAtAccuracy(profile, accuracy);
    const score = (coverage / 100) * inVocabularyInformation;
    const referencePercent = (score / profileData.reference.entropyBits) * 100;

    return { inVocabularyInformation, score, referencePercent };
  }, [accuracy, coverage, profile]);

  const applyPreset = (preset: Preset) => {
    setAccuracy(preset.accuracy);
    setCoverage(preset.coverage);
    setProfile(preset.profile);
  };

  const profileLabel = profileLabels[profile];
  const profileSize = profileData.profiles[profile].vocabularySize;

  return (
    <section className="ovmi-visualizer" aria-labelledby="ovmi-visualizer-title">
      <div className="ovmi-visualizer__header">
        <div>
          <p className="ovmi-visualizer__eyebrow">Interactive model</p>
          <h3 id="ovmi-visualizer-title">How much can the system communicate?</h3>
        </div>
        <a
          className="ovmi-reference-pill"
          href={profileData.reference.source}
          target="_blank"
          rel="noreferrer"
        >
          Reference · {profileData.reference.name}
        </a>
      </div>

      {[
        { title: 'Example studies', items: examplePresets },
        { title: 'Real systems', items: realPresets },
      ].map((group) => (
        <fieldset className="ovmi-preset-group" key={group.title}>
          <legend>{group.title}</legend>
          {group.title === 'Example studies' && (
            <p className="ovmi-preset-group__note">
              For these hypothetical examples, we assume each vocabulary contains the most frequent
              SUBTLEX-UK words. Different word choices would change coverage and OVMI.
            </p>
          )}
          <div className="ovmi-presets">
        {group.items.map((preset) => {
          const isActive = activePreset?.id === preset.id;
          return (
            <button
              className={`ovmi-preset${isActive ? ' ovmi-preset--active' : ''}`}
              type="button"
              key={preset.id}
              onClick={() => applyPreset(preset)}
              aria-pressed={isActive}
            >
              <span>{preset.label}</span>
              <small>{preset.configuration}</small>
            </button>
          );
        })}
          </div>
        </fieldset>
      ))}

      <div className="ovmi-visualizer__body">
        <div className="ovmi-controls">
          <div className="ovmi-control">
            <div className="ovmi-control__label-row">
              <label htmlFor="ovmi-accuracy">Decoding accuracy</label>
              <output htmlFor="ovmi-accuracy">{formatPercent(accuracy)}</output>
            </div>
            <input
              id="ovmi-accuracy"
              type="range"
              min={profileData.accuracyMinimum}
              max={profileData.accuracyMaximum}
              step={profileData.accuracyStep}
              value={accuracy}
              onChange={(event) => setAccuracy(Number(event.target.value))}
              style={{ '--range-progress': `${accuracy}%` } as CSSProperties}
              aria-valuetext={`${accuracy.toFixed(1)} percent`}
            />
            <div className="ovmi-control__limits" aria-hidden="true">
              <span>1%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="ovmi-control">
            <div className="ovmi-control__label-row">
              <label htmlFor="ovmi-coverage">Lexical coverage</label>
              <output htmlFor="ovmi-coverage">{formatPercent(coverage)}</output>
            </div>
            <input
              id="ovmi-coverage"
              type="range"
              min="1"
              max="100"
              step="0.1"
              value={coverage}
              onChange={(event) => setCoverage(Number(event.target.value))}
              style={{ '--range-progress': `${coverage}%` } as CSSProperties}
              aria-valuetext={`${coverage.toFixed(1)} percent`}
            />
            <div className="ovmi-control__limits" aria-hidden="true">
              <span>1%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="ovmi-profile-note">
            <span>Vocabulary profile</span>
            <strong>{profileLabel}</strong>
            <small>{profileSize.toLocaleString('en-GB')} decoder words</small>
          </div>
        </div>

        <div className="ovmi-result" aria-live="polite">
          <p className="ovmi-result__label">Open-Vocabulary Mutual Information</p>
          <div className="ovmi-result__score">
            <strong>{result.score.toFixed(3)}</strong>
            <span>bits</span>
          </div>
          <p className="ovmi-result__share">
            {formatPercent(result.referencePercent)} of the {profileData.reference.entropyBits.toFixed(2)}-bit
            SUBTLEX-UK reference
          </p>
          <div
            className="ovmi-result__meter"
            role="meter"
            aria-label="Percentage of SUBTLEX-UK information conveyed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Number(result.referencePercent.toFixed(1))}
          >
            <span style={{ width: `${Math.min(100, result.referencePercent)}%` }} />
          </div>
          <div className="ovmi-equation" aria-label="OVMI calculation">
            <div>
              <span>Coverage</span>
              <strong>{(coverage / 100).toFixed(3)}</strong>
            </div>
            <b aria-hidden="true">×</b>
            <div>
              <span>In-vocabulary MI</span>
              <strong>{result.inVocabularyInformation.toFixed(3)} bits</strong>
            </div>
            <b aria-hidden="true">=</b>
            <div>
              <span>OVMI</span>
              <strong>{result.score.toFixed(3)} bits</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="ovmi-visualizer__footer">
        <p>
          Accuracy is converted to mutual information with OVMI&apos;s symmetric scalar-channel
          approximation, using SUBTLEX-UK frequencies within the selected vocabulary profile.
        </p>
        {activePreset?.sourceUrl ? (
          <a href={activePreset.sourceUrl} target="_blank" rel="noreferrer">
            {activePreset.metricNote} · source
          </a>
        ) : (
          <span>{activePreset?.metricNote ?? 'Custom counterfactual · selected profile retained'}</span>
        )}
      </div>
    </section>
  );
}
