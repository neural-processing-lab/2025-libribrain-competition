---
title: "Brain-Inspired Approaches to Speech Detection"
date: 2025-07-10T00:00:00Z
draft: false
description: "Neuroscience-informed approaches to speech detection for the LibriBrain competition, including STG sensor analysis, spatial and temporal strategies, and architectural recommendations."
tags: ["neuroscience", "speech-detection", "meg", "libribrain", "brain-inspired", "stg"]
categories: ["blog"]
authors: ["Francesco Mantegna", "Gereon Elvers", "Oiwi Parker Jones"]
showDate: true
showAuthor: true
showReadingTime: true
showTableOfContents: true
showBreadcrumbs: true
showEdit: false
showPagination: true
showTaxonomies: true
math: true
---


*This blog post ssumes you've completed the [LibriBrain tutorials](https://neural-processing-lab.github.io/2025-libribrain-competition/participate/) and are familiar with the baseline models.*

The tutorial models make specific assumptions—like focusing on only 23 (out of 306) sensors around the superior temporal gyrus (STG). But are these assumptions optimal? And what else might we learn from how the brain actually processes speech in order to design clever decoding models? In this blog, we discuss some of what we know from neuroscience and how you might use this information to improve your competition submissions. 

## **Why STG Matters (But Isn't Everything)**

The 23 sensors selected in the tutorial aren't random. In the LibriBrain dataset paper (Özdogan et al., 2025), we systematically analysed signal quality across all 306 MEG sensors and found the strongest speech-related activity concentrated in bilateral STG regions. The result of this data-driven approach is the 23 sensors you see in the tutorial (note that each of these code blocks is scrollable left-to-right!):

<pre style="background-color: #f8f9fa; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e9ecef; overflow-x: auto;">
SENSORS_SPEECH_MASK = [18, 20, 22, 23, 45, 120, 138, 140, 142, 143, 145, 146, 147, 149, 175, 176, 177, 179, 180, 198, 271, 272, 275]
</pre>

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div style="flex: 1;">
    <img src="/2025-libribrain-competition/images/blog3-picture1.png" alt="All MEG sensors in the LibriBrain dataset" style="width: 100%; height: auto;">
  </div>
  <div style="flex: 1;">
    <img src="/2025-libribrain-competition/images/blog3-picture2.png" alt="The sensors used in the mask" style="width: 100%; height: auto;">
  </div>
</div>

*Left: All MEG sensors in the LibriBrain dataset, as shown with the interactive viewer (see [Speech Detection Colab Tutorial](https://colab.research.google.com/github/neural-processing-lab/2025-libribrain-competition/blob/main/static/colabs/LibriBrain_Competition_Speech_Detection.ipynb#scrollTo=5aB6CExQxJsc) or the similar interactive visualisation below). Right: the sensors used in the mask. To create your own mask, the spatial coordinates for each sensor are on the competition website [here](https://neural-processing-lab.github.io//2025-libribrain-competition/sensor_xyz.json).*

<div style="border: 1px solid #ccc; padding: 1em; border-radius: 5px; background-color: #eeeeee;">
When we are listening to speech (or any rhythmic sound), neural responses are known to entrain to (i.e., synchronise with) the rhythmic   structure of the auditory input, leading to distinct signatures in MEG recordings. One prominent response is an increase in amplitude over temporal sensors, presumably relying on brain sources located in the auditory cortex. This amplitude enhancement reflects stronger evoked responses to the structured acoustic input of speech and is consistent with findings that the auditory cortex is highly sensitive to the temporal dynamics of speech (Luo and Poeppel, 2007). In addition to amplitude, phase consistency across trials was measured as inter-trial coherence (ITC) – a measure of phase consistency in neural oscillations – which is significantly elevated during speech as compared to non-speech intervals. This increase indicates that the phase of low-frequency neural oscillations becomes more aligned across trials (Ding and Simon, 2014; Peelle and Davis, 2012). Moreover, power in the delta (1–4 Hz) and theta (4–8 Hz) frequency bands increases during speech perception in bilateral temporal sensors. This frequency range matches the prosodic rhythms of natural speech (Giraud and Poeppel, 2012).
</div>

The 23 channels used for the speech detection reference model were selected based on the most robust amplitude, phase and power modulations observed in our 50+ hour dataset:

![Sensors clustered around the STG](/2025-libribrain-competition/images/blog3-picture3.png)

*Sensors clustered around the STG, topographic map from [Özdogan et al. 2025](https://arxiv.org/abs/2506.02098) (Figure 9).* 

Topographic maps, like that shown here (in panel A), provide a top-down view of a cartoon head (black circle) with the nose on top (black triangle). This means that the left and right sides of the head correspond to your left and right. Despite appearances, it does *not* mean that the sensors (filled white circles) are positioned *outside* of the head. By convention, the correct way to read topographic maps like this is to imagine that the sensors wrap around the side of the head. Likewise, the brain activity that is represented in shades of red and demarcated by contours can be seen largely around the left and right sides of the head, which is where we would expect to find it from neuroscience.

![The four lobes of the brain](/2025-libribrain-competition/images/blog3-picture4.png)

*The four lobes of the brain (frontal, temporal, parietal, and occipital), with other key landmarks like the lateral fissure, central sulcus, and temporal pole (image from [Wikipedia](https://en.wikipedia.org/wiki/Lobes_of_the_brain#/media/File:LobesCaptsLateral.png)).*

There are three major ridges (or gyri) along the temporal lobe, if you move your eyes from right to left from the temporal pole. The upper-most ridge (or gyrus) is the STG. Its role in auditory (and speech) processing makes sense given its proximity to the primary auditory cortex (A1), which is located on the upper surface of the temporal lobe inside the lateral fissure. 

**But this doesn't mean there aren't other sensor configurations worth exploring.**

Neuroscientific studies of speech detection have not only found signals around the STG (e.g. [Hamilton et al. 2018](https://www.cell.com/current-biology/pdf/S0960-9822(18)30461-5.pdf)) but also show brain activity while people listen to speech in areas around the central sulcus, between the frontal and parietal lobes (e.g. [Cheung et al. 2016](https://elifesciences.org/articles/12577)). In their seminal study of speech decoding in paralysed individuals, [Moses et al. (2021)](https://www.nejm.org/doi/full/10.1056/NEJMoa2027540) further showed that attempted speech could be decoded from electrodes placed on the surface of the brain around the central sulcus. Here's a guess of which MEG sensors might correspond with this:

<pre style="background-color: #f8f9fa; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e9ecef; overflow-x: auto;">
SENSORS_CENTRAL_SULCUS_MASK = [18, 19, 20, 42, 43, 44, 45, 46, 47, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 120, 121, 122, 123, 124, 125, 145, 146, 147, 148, 149, 201, 202, 203, 246, 247, 248]
</pre>

![Location of sensors used for speech detection from Moses et al. 2021](/2025-libribrain-competition/images/blog3-picture5.png)

*Location of sensors used for speech detection from [Moses et al. 2021 (Figure 1)](https://www.nejm.org/doi/full/10.1056/NEJMoa2027540).*

In another study of speech detection, [Kurteff et al. (2024)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11580786/pdf/jneuro-44-e1109242024.pdf) identified yet another brain region: the insula. Located more deeply in the brain, MEG signals for the insula might be expected to show up across a broad range of sensors. In any case, there is information about speech detection in many parts of the brain. Decoding offers a chance to study, empirically, which sensors are best for predicting speech and non-speech across the whole brain. 

## **Posterior and Anterior Divisions within the STG**

Neuroscience can also tell us something about how speech is detected in the brain. Using invasive electrocorticography (ECoG), [Hamilton et al. (2018)](https://www.cell.com/current-biology/pdf/S0960-9822(18)30461-5.pdf) make a distinction between two parts of the STG:

* **Posterior STG**: Responds strongly to acoustic onsets—the transitions from silence to speech  
* **Anterior STG**: Shows sustained responses throughout speech events

![Figure reproduced from Hamilton et al. 2018](/2025-libribrain-competition/images/blog3-picture6.png)

*Figure reproduced from [Hamilton et al. 2018 (graphical abstract)](https://www.cell.com/current-biology/pdf/S0960-9822(18)30461-5.pdf).*

This spatial organisation suggests that even within the tutorial's 23-sensor selection, different sensors might be doing different jobs: some might be better for detecting speech boundaries; others for sustained content processing. Using the highly sophisticated method of "eyeballing" the figure from the Hamilton et al. paper, here's an initial guess at picking sensors which uses ~35% of the posterior STG for onset detection:

<pre style="background-color: #f8f9fa; padding: 1rem; border-radius: 0.5rem; border: 1px solid #e9ecef; overflow-x: auto;">
SENSORS_STG_POSTERIOR = [12, 13, 14, 18, 19, 20, 21, 22, 23, 141, 142, 143, 144, 145, 146, 147, 148, 149, 174, 175, 176, 177, 178, 179, 180, 181, 182, 198, 199, 200, 249, 250, 251, 270, 271, 272, 273, 274, 275, 279, 280, 281]

SENSORS_STG_ANTERIOR = [15, 16, 17, 18, 19, 20, 21, 22, 23, 45, 46, 47, 120, 121, 122, 138, 139, 140, 144, 145, 146, 147, 148, 149]
</pre>

This is a good start but it is not the only way we can take advantage of these insights. What else might we do?

**Relabelling events to add classes:** Another idea for taking advantage of the result from [Hamilton et al. (2018)](https://www.cell.com/current-biology/pdf/S0960-9822(18)30461-5.pdf) would be to relabel the target events to distinguish "onset of speech" from "sustained speech". Concretely, what do we mean?

In the LibriBrain dataset, the speech detection is formulated as simple binary classification, with "speech" labelled as "1" and "non-speech" labelled as "0". One way to distinguish onset and sustained speech would be to introduce a third label for "onset speech", relabelling the first *n* speech labels after an onset as "2" instead of "1". A realistic prior for *n* might start around 33 to 36 labels, given 138 ± 5 ms for speech onset events ([Hamilton et al. 2018](https://www.cell.com/current-biology/pdf/S0960-9822(18)30461-5.pdf)) and a sample rate of 250 Hz (or 4 ms per sample). 

However, to illustrate for *n*=2, you would replace a sequence of labels `[0, 0, 0, 1, 1, 1]` with a new sequence `[0, 0, 0, 2, 2, 1]`. A model trained on these labels should implicitly learn different representations for the events "onset speech" and "sustained speech", rather than being forced to learn a unified label for both. Finally, before submitting to the EvalAI platform, simply replace all predicted "2" labels with "1", making the labels binary again.

What about other relabelling schemes? What about adding a "speech offset" class? While we do not know of any neuroscientific evidence showing the brain's preference for a "speech offset" event, which would represent the transition from speech to non-speech, the decoding framework provides a way of learning new things. 

Whatever works to improve speech detection in the LibriBrain dataset provides evidence of how speech is organised in the brain. So, by doing good machine learning, you could make a novel contribution to neuroscience. 

**Target smoothing/interpolation**: Another assumption of the default labelling scheme is that transitions between speech and non-speech are almost instantaneous, occurring within the 4 ms represented by the 250 Hz sampling rate. 

If state transitions in the brain are slower, then it could make sense to smooth (or interpolate) the target labels. For example, a sequence like `[0, 0, 0, 1, 1, 1]` might become `[0, 0.2, 0.4, 0.6, 0.8, 1]`. This assumes linear interpolation, but of course there are lots of non-linear alternatives such as sigmoid functions with steeper or more gradual transitions. 

Smoothing might also make sense if there is label noise (uncertainty in the event boundaries).

**Modelling conduction delays**: How confident are we about the speech detection labels? 

We've gone beyond what is typical for neural datasets in terms of methodological rigour and quality control, which is reflected empirically in studies such as [Jayalath et al. 2025](https://arxiv.org/abs/2505.13446). Still, this might be a good opportunity to explain how speech labels were assigned in the LibriBrain dataset.

The audio played to the subject in the MEG scanner went through a series of rigorous checks to produce the event files. First, we used voice activity detection (VAD) to automatically segment audio into speech and non-speech. This used an amplitude threshold together with a set of carefully tuned heuristics (e.g. a minimal duration for speech events). But it was still not *perfect*. For instance, quiet sounds (such as plosives like /p, t, k/) might be missed at the beginning of utterances. So we took the extraordinary step of manually checking (and correcting) all of the events—to give a sense of scale, this took *hundreds* of hours. 

In line with the "minimal preprocessing" philosophy of the LibriBrain dataset, no temporal offsets were added to the speech labels. In other words, the speech and non-speech labels from the audio were taken directly as labels for the brain. Although we know that there are conduction delays between the ear and cortex, these delays are not constant across the whole brain. In other words, there is not a single temporal offset from the ear to all parts of the brain. Furthermore, even for specific brain regions, we might not be certain about the precise delay. Ultimately, any explicit offset or set of offsets that we add to the data might introduce errors. We have therefore chosen to trust users to explicitly account for conduction delays. 

So what should you do? Perhaps the most straightforward advice would be to investigate models that are either invariant to small temporal offsets or that explicitly learn offsets. 

Methods that make models less sensitive to exact timing include target smoothing (discussed above), temporal pooling, and data augmentation strategies that add temporal jitter. Some of these are used in the speech detection reference model ([Landau et al. 2025a](https://arxiv.org/abs/2506.10165),b, where the latter is [our dedicated blog post](https://neural-processing-lab.github.io/2025-libribrain-competition/blog/speech-detection-reference-model/) on the reference model). You might also tune the receptive field of architectures that use strided/dilated convolutions. Various model architectures will learn offsets such as transformers, through the use of attention mechanisms. 

For anyone looking for a deeper dive into the neurobiology of audition and of speech comprehension, we heartily recommend Schnupp et al. (2011) and Parker Jones & Schnupp (2021)—the former is the standard Auditory Neuroscience textbook, whereas the latter is a more recent update, emphasising advances in our understanding of speech over other kinds of auditory processing

## **Interactive 3D Sensor Visualization**

Explore the MEG sensor positions and the different sensor masks discussed in this blog post. Use the controls below to visualize how different brain regions map to MEG sensors. Note: The masks provided are our best initial guess. We highly recommend that you to play around with the data yourself to find out what works for you!

<div id="sensor-visualization" style="width: 100%; margin: 20px 0;">
  <div id="sensor-controls" style="margin-bottom: 15px;">
    <div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: center; margin-bottom: 10px;">
      <label style="display: flex; align-items: center; gap: 5px;">
        <strong>Highlight Masks:</strong>
      </label>
      <label style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" id="mask-speech" onchange="updateVisualization()">
        Speech Mask (STG)
      </label>
      <label style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" id="mask-central-sulcus" onchange="updateVisualization()">
        Central Sulcus
      </label>
      <label style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" id="mask-stg-posterior" onchange="updateVisualization()">
        STG Posterior
      </label>
      <label style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" id="mask-stg-anterior" onchange="updateVisualization()">
        STG Anterior
      </label>
      <label style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" id="mask-custom" onchange="updateVisualization()">
        Custom
      </label>
      <label style="display: flex; align-items: center; gap: 5px;">
        <input type="checkbox" id="show-head" onchange="updateVisualization()">
        Show Head Shape
      </label>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 15px; align-items: center; margin-bottom: 10px;">
      <label style="display: flex; align-items: center; gap: 5px;">
        <strong>Custom Sensor IDs:</strong>
        <input type="text" id="custom-sensors" placeholder="e.g., 10,20,30,40" style="width: 200px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;" onchange="updateVisualization()" oninput="updateVisualization()">
      </label>
    </div>
    <div id="selected-sensors" style="background-color: #f8f9fa; padding: 8px; border-radius: 4px; border: 1px solid #e9ecef; font-family: monospace; font-size: 0.9em; max-height: 100px; overflow-y: auto;"></div>
  </div>
  <div id="sensor-plot" style="width: 100%; height: 600px; border: 1px solid #e9ecef; border-radius: 0.5rem;"></div>
</div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
// Sensor masks from the blog post
const SENSOR_MASKS = {
  'speech': [18, 20, 22, 23, 45, 120, 138, 140, 142, 143, 145, 146, 147, 149, 175, 176, 177, 179, 180, 198, 271, 272, 275],
  'central-sulcus': [18, 19, 20, 42, 43, 44, 45, 46, 47, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 120, 121, 122, 123, 124, 125, 145, 146, 147, 148, 149, 201, 202, 203, 246, 247, 248],
  'stg-anterior':  [15, 16, 17, 18, 19, 20, 21, 22, 23, 45, 46, 47, 120, 121, 122, 138, 139, 140, 144, 145, 146, 147, 148, 149],   
  'stg-posterior': [12, 13, 14, 18, 19, 20, 21, 22, 23, 141, 142, 143, 144, 145, 146, 147, 148, 149, 174, 175, 176, 177, 178, 179, 180, 181, 182, 198, 199, 200, 249, 250, 251, 270, 271, 272, 273, 274, 275, 279, 280, 281],
};

// Color scheme for different masks
const MASK_COLORS = {
  'speech': '#e74c3c',
  'central-sulcus': '#3498db',
  'stg-posterior': '#f39c12',
  'stg-anterior': '#2ecc71',
  'custom': '#9b59b6'
};

const MASK_NAMES = {
  'speech': 'Speech Mask (STG)',
  'central-sulcus': 'Central Sulcus',
  'stg-posterior': 'STG Posterior',
  'stg-anterior': 'STG Anterior',
  'custom': 'Custom'
};

let sensorPositions = null;
let plotInitialized = false;

// Function to create a head mesh (ellipsoid)
function createHeadMesh() {
  const phi = [];
  const theta = [];
  const x = [], y = [], z = [];
  
  // Create ellipsoid points - adjust these values to fit within sensor positions
  const a = 0.085; // x-radius (left-right) - larger but still inside sensors
  const b = 0.095; // y-radius (front-back) - larger but still inside sensors
  const c = 0.105; // z-radius (top-bottom) - larger but still inside sensors
  const offsetY = 0.015; // shift forward to align with sensor positions
  
  const phiSteps = 20;
  const thetaSteps = 20;
  
  for (let i = 0; i <= phiSteps; i++) {
    const phiVal = (Math.PI * i) / phiSteps;
    for (let j = 0; j <= thetaSteps; j++) {
      const thetaVal = (2 * Math.PI * j) / thetaSteps;
      
      x.push(a * Math.sin(phiVal) * Math.cos(thetaVal));
      y.push(b * Math.sin(phiVal) * Math.sin(thetaVal) + offsetY);
      z.push(c * Math.cos(phiVal));
      phi.push(phiVal);
      theta.push(thetaVal);
    }
  }
  
  // Create triangular faces for the mesh (simplified to reduce artifacts)
  const i = [], j = [], k = [];
  for (let p = 0; p < phiSteps; p++) {
    for (let t = 0; t < thetaSteps; t++) {
      if (p < phiSteps && t < thetaSteps) {
        const idx = p * (thetaSteps + 1) + t;
        const nextIdx = (p + 1) * (thetaSteps + 1) + t;
        const nextT = p * (thetaSteps + 1) + ((t + 1) % (thetaSteps + 1));
        const nextIdxNextT = (p + 1) * (thetaSteps + 1) + ((t + 1) % (thetaSteps + 1));
        
        if (nextIdx < x.length && nextT < x.length && nextIdxNextT < x.length) {
          // First triangle
          i.push(idx);
          j.push(nextIdx);
          k.push(nextT);
          
          // Second triangle  
          i.push(nextIdx);
          j.push(nextIdxNextT);
          k.push(nextT);
        }
      }
    }
  }
  
  return {
    x: x,
    y: y,
    z: z,
    i: i,
    j: j,
    k: k,
    type: 'mesh3d',
    name: 'Head Shape',
    opacity: 1.0,
    color: '#e6f3ff',
    lighting: {
      ambient: 0.8,
      diffuse: 0.2,
      roughness: 0.9,
      specular: 0.1,
      fresnel: 0.1
    },
    lightposition: {
      x: 0,
      y: 0,
      z: 0
    },
    flatshading: true,
    showlegend: true,
    hoverinfo: 'skip'
  };
}

// Function to create a nose indicator
function createNoseMesh() {
  // Create a diamond-shaped indicator pointing forward (visible from multiple angles)
  // Position relative to head: head front is at offsetY + b
  const offsetY = 0.015;
  const b = 0.095; // y-radius from createHeadMesh
  const headFront = offsetY + b;
  const tipY = headFront + 0.010;
  const baseY = headFront;
  const width = 0.004;
  const height = 0.006;
  
  return {
    x: [0, -width, 0, width, 0],
    y: [tipY, baseY, baseY, baseY, tipY], 
    z: [0, 0, height, 0, -height],
    i: [0, 0, 0, 0, 1, 2],
    j: [1, 2, 3, 4, 2, 3], 
    k: [2, 3, 4, 1, 3, 4],
    type: 'mesh3d',
    name: 'Forward',
    color: '#ff0000',
    opacity: 0.95,
    showlegend: true,
    hoverinfo: 'skip'
  };
}

// Load sensor positions
async function loadSensorPositions() {
  try {
    const response = await fetch('https://neural-processing-lab.github.io/2025-libribrain-competition/sensor_xyz.json');
    sensorPositions = await response.json();
    console.log('Loaded sensor positions:', sensorPositions.length, 'sensors');
    updateVisualization();
  } catch (error) {
    console.error('Error loading sensor positions:', error);
    document.getElementById('sensor-plot').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #dc3545;">Error loading sensor data. Please check your internet connection.</div>';
  }
}

// Parse custom sensor IDs from input
function parseCustomSensorIds() {
  const customInput = document.getElementById('custom-sensors');
  if (!customInput || !customInput.value.trim()) return [];
  
  const idsStr = customInput.value.trim();
  const ids = idsStr.split(',').map(id => {
    const num = parseInt(id.trim());
    return isNaN(num) ? -1 : num;
  }).filter(id => id >= 0 && id < 306);
  
  return ids;
}

// Update the selected sensors display
function updateSelectedSensorsDisplay(selectedMasks, customSensorIds) {
  const displayDiv = document.getElementById('selected-sensors');
  if (!displayDiv) return;

  const sensorSets = {};
  
  // Add predefined masks
  selectedMasks.forEach(maskKey => {
    if (maskKey !== 'custom' && SENSOR_MASKS[maskKey]) {
      sensorSets[MASK_NAMES[maskKey]] = SENSOR_MASKS[maskKey];
    }
  });
  
  // Add custom mask if selected
  if (selectedMasks.includes('custom') && customSensorIds.length > 0) {
    sensorSets['Custom'] = customSensorIds;
  }

  if (Object.keys(sensorSets).length === 0) {
    displayDiv.innerHTML = '<span style="color: #6c757d;">No masks selected</span>';
    return;
  }

  let html = '';
  Object.entries(sensorSets).forEach(([name, ids]) => {
    const color = Object.keys(MASK_NAMES).find(key => MASK_NAMES[key] === name);
    const colorCode = color ? MASK_COLORS[color] : '#999';
    html += `<div style="margin-bottom: 5px;">
      <span style="color: ${colorCode}; font-weight: bold;">${name} (${ids.length}):</span>
      <span style="color: #495057;">[${ids.join(', ')}]</span>
    </div>`;
  });

  displayDiv.innerHTML = html;
}

// Update the 3D visualization
function updateVisualization() {
  if (!sensorPositions) return;

  const plotDiv = document.getElementById('sensor-plot');
  
  // Get selected masks
  const selectedMasks = [];
  Object.keys(SENSOR_MASKS).forEach(maskKey => {
    const checkbox = document.getElementById(`mask-${maskKey}`);
    if (checkbox && checkbox.checked) {
      selectedMasks.push(maskKey);
    }
  });

  // Check custom mask
  const customCheckbox = document.getElementById('mask-custom');
  if (customCheckbox && customCheckbox.checked) {
    selectedMasks.push('custom');
  }

  // Check head shape option
  const showHeadCheckbox = document.getElementById('show-head');
  const showHead = showHeadCheckbox && showHeadCheckbox.checked;

  // Parse custom sensor IDs
  const customSensorIds = parseCustomSensorIds();

  // Update the display of selected sensors
  updateSelectedSensorsDisplay(selectedMasks, customSensorIds);

  // Prepare data for plotting
  const traces = [];
  
  // Add head shape and nose if enabled (add first so they appear behind sensors)
  if (showHead) {
    traces.push(createHeadMesh());
    traces.push(createNoseMesh());
  }
  
  // Always show all sensors as base layer (muted gray)
  // Group sensors by location and offset duplicates for visual differentiation
  const allX = [], allY = [], allZ = [], allHoverText = [];
  const positionTolerance = 0.001; // tolerance for considering positions the same
  const offsetDistance = 0.003; // offset distance for duplicates
  const locationGroups = new Map();
  
  // First pass: group sensors by similar locations
  for (let i = 0; i < sensorPositions.length; i++) {
    const x = sensorPositions[i][0];
    const y = sensorPositions[i][1];
    const z = sensorPositions[i][2];
    const key = `${Math.round(x/positionTolerance)*positionTolerance}_${Math.round(y/positionTolerance)*positionTolerance}_${Math.round(z/positionTolerance)*positionTolerance}`;
    
    if (!locationGroups.has(key)) {
      locationGroups.set(key, []);
    }
    locationGroups.get(key).push(i);
  }
  
  // Second pass: assign positions with offsets for duplicates
  for (let i = 0; i < sensorPositions.length; i++) {
    const baseX = sensorPositions[i][0];
    const baseY = sensorPositions[i][1];
    const baseZ = sensorPositions[i][2];
    const key = `${Math.round(baseX/positionTolerance)*positionTolerance}_${Math.round(baseY/positionTolerance)*positionTolerance}_${Math.round(baseZ/positionTolerance)*positionTolerance}`;
    
    const groupSensors = locationGroups.get(key);
    const indexInGroup = groupSensors.indexOf(i);
    
    let offsetX = baseX;
    let offsetY = baseY;
    let offsetZ = baseZ;
    
    // Apply different offsets for 2nd, 3rd, etc. sensors at same location
    if (indexInGroup === 1) {
      offsetX += offsetDistance;
    } else if (indexInGroup === 2) {
      offsetZ += offsetDistance;
    } else if (indexInGroup === 3) {
      offsetX -= offsetDistance;
    } else if (indexInGroup === 4) {
      offsetZ -= offsetDistance;
    }
    
    allX.push(offsetX);
    allY.push(offsetY);
    allZ.push(offsetZ);
    allHoverText.push(`Sensor ${i}<br>X: ${baseX.toFixed(3)} (display: ${offsetX.toFixed(3)})<br>Y: ${baseY.toFixed(3)}<br>Z: ${baseZ.toFixed(3)} (display: ${offsetZ.toFixed(3)})<br>All Sensors`);
  }

  // Base layer: all sensors in muted gray
  traces.push({
    x: allX,
    y: allY,
    z: allZ,
    mode: 'markers',
    type: 'scatter3d',
    name: 'All Sensors',
    marker: {
      size: 4,
      color: '#888888',
      opacity: 0.7
    },
    text: allHoverText,
    hoverinfo: 'text',
    showlegend: selectedMasks.length === 0
  });

  // Add highlighted masks on top
  selectedMasks.forEach(maskKey => {
    let sensorIndices;
    if (maskKey === 'custom') {
      sensorIndices = customSensorIds;
    } else {
      sensorIndices = SENSOR_MASKS[maskKey];
    }
    
    if (!sensorIndices || sensorIndices.length === 0) return;

    const x = [], y = [], z = [], hoverText = [];
    
    sensorIndices.forEach(idx => {
      if (idx < sensorPositions.length) {
        const baseX = sensorPositions[idx][0];
        const baseY = sensorPositions[idx][1];
        const baseZ = sensorPositions[idx][2];
        const key = `${Math.round(baseX/positionTolerance)*positionTolerance}_${Math.round(baseY/positionTolerance)*positionTolerance}_${Math.round(baseZ/positionTolerance)*positionTolerance}`;
        
        const groupSensors = locationGroups.get(key);
        const indexInGroup = groupSensors.indexOf(idx);
        
        let offsetX = baseX;
        let offsetY = baseY;
        let offsetZ = baseZ;
        
        // Apply same offsets as in base layer
        if (indexInGroup === 1) {
          offsetX += offsetDistance;
        } else if (indexInGroup === 2) {
          offsetZ += offsetDistance;
        } else if (indexInGroup === 3) {
          offsetX -= offsetDistance;
        } else if (indexInGroup === 4) {
          offsetZ -= offsetDistance;
        }
        
        x.push(offsetX);
        y.push(offsetY);
        z.push(offsetZ);
        hoverText.push(`Sensor ${idx}<br>X: ${baseX.toFixed(3)} (display: ${offsetX.toFixed(3)})<br>Y: ${baseY.toFixed(3)}<br>Z: ${baseZ.toFixed(3)} (display: ${offsetZ.toFixed(3)})<br>Mask: ${MASK_NAMES[maskKey]}`);
      }
    });

    traces.push({
      x: x,
      y: y,
      z: z,
      mode: 'markers',
      type: 'scatter3d',
      name: MASK_NAMES[maskKey],
      marker: {
        size: 6,
        color: MASK_COLORS[maskKey],
        opacity: 0.9
      },
      text: hoverText,
      hoverinfo: 'text'
    });
  });

  // Create the plot layout with fixed axis ranges
  const layout = {
    title: {
      text: 'MEG Sensor Positions - LibriBrain Dataset',
      font: { size: 16 }
    },
    scene: {
      xaxis: { 
        title: 'X Position (m)',
        range: [-0.15, 0.15]
      },
      yaxis: { 
        title: 'Y Position (m)',
        range: [-0.15, 0.15]
      },
      zaxis: { 
        title: 'Z Position (m)',
        range: [-0.15, 0.15]
      },
      aspectmode: 'cube',
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    margin: { l: 0, r: 0, b: 0, t: 40 },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: 'rgba(0,0,0,0.2)',
      borderwidth: 1
    }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'resetCameraDefault3d'],
    displaylogo: false
  };

  // Use Plotly.react() to maintain camera view, or Plotly.newPlot() for initial creation
  if (plotInitialized) {
    Plotly.react('sensor-plot', traces, layout, config);
  } else {
    Plotly.newPlot('sensor-plot', traces, layout, config);
    plotInitialized = true;
  }
}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', loadSensorPositions);
</script>

---

***Ready to implement these ideas? Check out the LibriBrain [competition tutorials](https://neural-processing-lab.github.io/2025-libribrain-competition/participate/) and join the discussion on [Discord](https://discord.com/invite/Fqr8gJnvSh). The competition runs through September 2025, with both Standard and Extended tracks to accommodate different resource levels.***

---


## Key References

Broderick, M. P., et al. (2018). Electrophysiological correlates of semantic dissimilarity reflect the comprehension of natural, narrative speech. Current Biology, 28, 803-809.

Cheung, C., Hamilton, L. S., Johnson, K., & Chang, E. F. (2016). [The auditory representation of speech sounds in human motor cortex](https://elifesciences.org/articles/12577). Elife,5, e12577.
Crosse, M. J., et al. (2016). The multivariate temporal response function (mTRF) toolbox. Frontiers in Human Neuroscience, 10, 604.
Di Liberto, G. M., et al. (2015). Low-frequency cortical entrainment to speech reflects phoneme-level processing. Current Biology, 25, 2457-2465.

Ding, N., & Simon, J. Z. (2014). Cortical entrainment to continuous speech: functional roles and interpretations. Frontiers in human neuroscience, 8, 311.

Giraud, A. L., & Poeppel, D. (2012). Cortical oscillations and speech processing: emerging computational principles and operations. Nature neuroscience, 15(4), 511-517.

Hamilton, L. S., et al. (2018). [A spatial map of onset and sustained responses to speech in the human superior temporal gyrus](https://www.cell.com/current-biology/pdf/S0960-9822(18)30461-5.pdf). Current Biology, 28, 1860-1871.

Jayalath, D., Landau, G., & Parker Jones, O. (2025). [Unlocking non-invasive brain-to-text](https://arxiv.org/abs/2505.13446). ICML Workshop on Generative AI and Biology.

Kurteff, G. L., et al. (2024). [Spatiotemporal mapping of auditory onsets during speech production](https://pmc.ncbi.nlm.nih.gov/articles/PMC11580786/pdf/jneuro-44-e1109242024.pdf). Journal of Neuroscience, 44(47), e1109242024.

Landau, G., Özdogan, M., Elvers, G., Mantegna, F., Somaiya, P., Jayalath, D., Kurth, L., Kwon, T., Shillingford, B., Farquhar, G., Jiang, M., Jerbi, K., Abdelhedi, H., Mantilla Ramos, Y., Gulcehre, C., Woolrich, M., Voets, N., & Parker Jones, O. (2025a). [The 2025 PNPL competition: Speech detection and phoneme classification in the LibriBrain dataset](https://arxiv.org/abs/2506.10165). NeurIPS Competition Track.

Landau, G., Elvers, G., Özdogan, M., & Parker Jones, O. (2025b). The speech detection task and the reference model [Blog post]. Neural Processing Lab. [https://neural-processing-lab.github.io/2025-libribrain-competition/blog/speech-detection-reference-model](https://neural-processing-lab.github.io/2025-libribrain-competition/blog/speech-detection-reference-model)

Luo, H., & Poeppel, D. (2007). Phase patterns of neuronal responses reliably discriminate speech in human auditory cortex. Neuron, 54(6), 1001-1010.

Özdogan, M., Landau, G., Elvers, G., Jayalath, D., Somaiya, P., Mantegna, F., Woolrich, M., & Parker Jones, O. (2025). [LibriBrain: Over 50 hours of within-subject MEG to improve speech decoding methods at scale](https://www.arxiv.org/abs/2506.02098). arXiv preprint.

Parker Jones, O., & Schnupp, J. W. H. (2021). [How does the brain represent speech?](https://doi.org/10.1002/9781119184096.ch3) In J. S. Pardo, L. C. Nygaard, R. E. Remez, & D. B. Pisoni (eds.), The handbook of speech perception (2nd ed., Chapter 3). Wiley. 

Peelle, J. E., & Davis, M. H. (2012). Neural oscillations carry speech rhythm through to comprehension. Frontiers in psychology, 3, 320.

Schnupp, J. W. H., Nelken, I., & King, A. J. (2011). [Auditory neuroscience: Making sense of sound](https://mitpress.mit.edu/9780262518024/auditory-neuroscience/). The MIT Press.


## Citation

{{< bibtex >}}
@misc{pnpl_blog2025brainInspiredSpeechDetection,
  title={Brain-Inspired Approaches to Speech Detection},
  author={Mantegna, Francesco and Elvers, Gereon and Parker Jones, Oiwi},
  year={2025},
  url={https://neural-processing-lab.github.io/2025-libribrain-competition/blog/brain-inspired-approaches-speech-detection},
  note={Blog post}
}
{{< /bibtex >}} 
