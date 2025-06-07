function evaluateUGCForm3Engineering(response) {
  const formdata = response.formData
  const weights = {
    // III(A) - Research Papers
    'A.1. Refereed Journals': 15,
    'A.2. Non-refereed but recognized and reputable journals': 10,
    'A.3. Conference proceedings as full papers': 10,

    // III(B) - Books and Chapters
    'B1. Text or Reference Books Published by International Publishers': 50,
    'B2. Subjects Books by National level publishers/State and Central Govt. Publications': 25,
    'B3. Subject Books by Other local publishers': 15,
    'B4. Chapters contributed to edited knowledge based volumes published by International Publishers': 10,
    'B5. Chapters in knowledge based volumes by Indian/National level publishers': 5,

    // III(C)(i) - Sponsored Projects
    'III (C) (i) (a) Major Projects amount mobilized with grants above 30.0 lakhs': 20,
    'III (C) (i) (b) Major Projects amount mobilized with grants above 5.0 lakhs up to 30.00 lakhs': 15,
    'III (C) (i) (c) Minor Projects (Amount mobilized with grants above Rs. 50,000 up to Rs. 5 lakh)': 10,

    // III(C)(ii) - Consultancy Projects
    'III (C) (ii) 1. Amount mobilized with minimum of Rs.10.00 lakh': 10, // per 2 lakh

    // III(C)(iii) - Completed Projects
    'III (C) (iii) 1. Completed project Report(Acceptance from funding agency)': 20, // assume major

    // III(C)(iv) - Project Outputs
    'III (C) (iv) 1. Patent/Technology/transfer/Product/Process': 30, // assume national

    // III(D)
    'III (D) (i) 1. Degree awarded only': 3, // M.Phil.
    'III (D) (ii) 1. Degree awarded': 10,   // Ph.D.
    'III (D) (ii) 2. Thesis submitted': 7,  // Ph.D. Submitted

    // III(E)(i)
    'III(E) (i) (a) Not less than two weeks duration': 20,
    'III(E) (i) (b) One week duration': 10,

    // III(E)(ii) - Conferences
    'III(E) (ii) a) International conference': 10,
    'III(E) (ii) b) National': 7.5,
    'III(E) (ii) c) Regional/State level': 5,
    'III(E) (ii) d) Local – University/College': 3,

    // III(E)(iv) - Invited Talks
    'III(E) (iv) (a) International': 10,
    'III(E) (iv) (b) National level': 5
  };

  const sections = {
    IIIA: 0,
    IIIB: 0,
    IIIC: 0,
    IIID: 0,
    IIIE: 0
  };

  let fdpSubTotal = 0; // To apply 30-point cap on III(E)(i)

  for (const key in formdata) {
    if (!key.includes('(Enter number')) continue;

    const entry = Object.entries(weights).find(([label]) =>
      key.includes(label)
    );

    if (!entry) continue;

    const [label, pointsPerItem] = entry;
    const count = parseFloat(formdata[key]) || 0;
    let score = 0;

    // Special handling: Consultancy project points
    if (label.includes('Amount mobilized with minimum of Rs.10.00 lakh')) {
      score = Math.floor(count / 2) * 10;
    } else {
      score = count * pointsPerItem;
    }

    // Section-wise assignment
    if (label.startsWith('A.')) {
      sections.IIIA += score;
    } else if (label.startsWith('B')) {
      sections.IIIB += score;
    } else if (label.includes('III (C)')) {
      sections.IIIC += score;
    } else if (label.includes('III (D)')) {
      sections.IIID += score;
    } else if (label === 'III(E) (i) (a) Not less than two weeks duration' || label === 'III(E) (i) (b) One week duration') {
      fdpSubTotal += score; // III(E)(i) — will be capped later
    } else if (label.startsWith('III(E)')) {
      sections.IIIE += score; // Conferences, invited lectures, etc.
    }
  }

  // Apply cap of 30 only to FDP/III(E)(i)
  sections.IIIE += Math.min(fdpSubTotal, 30);

  const totalScore = Object.values(sections).reduce((sum, val) => sum + val, 0);

  return {
    userId: response.userId["$oid"],
    totalScore
  };
}

module.exports = { evaluateUGCForm3Engineering };
