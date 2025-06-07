function evaluateUGCForm3Language(response) {
    const formdata = response.formData
  const weights = {
    // III(A) – Research Papers
    'A.1. Refereed Journals': 15,
    'A.2. Non-refereed but recognized and reputable journals': 10,
    'A.3. Conference proceedings as full papers': 10,

    // III(B) – Books & Chapters
    'B1. Text or Reference Books Published by International Publishers': 50,
    'B2. Subjects Books by National level publishers/State and Central Govt. Publications': 25,
    'B3. Subject Books by Other local publishers': 15,
    'B4. Chapters contributed to edited knowledge based volumes published by International Publishers': 10,
    'B5. Chapters in knowledge based volumes by Indian/National level publishers': 5,

    // III(C)(i) – Sponsored Projects
    'III (C) (i) 1. Major Projects amount mobilized with grants above 5.0 lakhs': 20,
    'III (C) (i) 2. Major Projects Amount mobilized with minimum of Rs. 3.00 lakhs up to Rs. 5.00 lakhs': 15,
    'III (C) (i) 3. Minor Projects (Amount mobilized with grants above Rs. 25,000 up to Rs. 3 lakh)': 10,

    // III(C)(ii) – Consultancy Projects
    'III (C) (ii) 1. Amount mobilized with minimum of Rs. 2.0 lakhs Rs.10.0 lakhs': 10, // per Rs.2L

    // III(C)(iii) – Completed Projects
    'III (C) (iii) 1. Completed project report (Accepted by funding agency)': 20,

    // III(C)(iv) – Major Policy Documents
    'III (C) (iv) 1. Major Policy document of Govt. Bodies at Central and State level': 30, // national level

    // III(D)
    'III (D) (i) 1. Degree awarded only': 3, // M.Phil.
    'III (D) (ii) (a) Degree awarded': 10,   // Ph.D. awarded
    'III (D) (ii) (b) Thesis submitted': 7,  // Ph.D. submitted

    // III(E)(i) – FDP, Refresher (capped at 30)
    'III(E) (i) 1. Not less than two weeks duration': 20,
    'III(E) (i) 2. One week duration': 10,

    // III(E)(ii) – Conferences
    'III(E) (ii) 1. International conference': 10,
    'III(E) (ii) 2. National': 7.5,
    'III(E) (ii) 3. Regional/State level': 5,
    'III(E) (ii) 4. Local – University/College': 3,

    // III(E)(iv) – Invited Talks
    'III(E) (iv) 1. International': 10,
    'III(E) (iv) 2. National level': 5
  };

  const sections = {
    IIIA: 0,
    IIIB: 0,
    IIIC: 0,
    IIID: 0,
    IIIE: 0
  };

  let fdpSubTotal = 0;

  for (const key in formdata) {
    if (!key.includes('(Enter number')) continue;

    const matchedEntry = Object.entries(weights).find(([label]) =>
      key.includes(label)
    );

    if (!matchedEntry) continue;

    const [label, perItemScore] = matchedEntry;
    const count = parseFloat(formdata[key]) || 0;

    let score = 0;

    // Special case: Consultancy — 10 points per Rs. 2 lakh
    if (label.includes('Amount mobilized with minimum of Rs. 2.0 lakhs')) {
      score = Math.floor(count / 2) * 10;
    } else {
      score = count * perItemScore;
    }

    // Assign score to proper section
    if (label.startsWith('A.')) {
      sections.IIIA += score;
    } else if (label.startsWith('B')) {
      sections.IIIB += score;
    } else if (label.includes('III (C)')) {
      sections.IIIC += score;
    } else if (label.includes('III (D)')) {
      sections.IIID += score;
    } else if (
      label === 'III(E) (i) 1. Not less than two weeks duration' ||
      label === 'III(E) (i) 2. One week duration'
    ) {
      fdpSubTotal += score;
    } else if (label.startsWith('III(E)')) {
      sections.IIIE += score;
    }
  }

  // Apply cap of 30 only to FDP/III(E)(i)
  sections.IIIE += Math.min(fdpSubTotal, 30);

  const totalScore = Object.values(sections).reduce((sum, s) => sum + s, 0);

  return {
    userId: response.userId["$oid"],
    totalScore
  };
}
