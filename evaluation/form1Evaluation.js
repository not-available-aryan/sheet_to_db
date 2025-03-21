
const rules = {
    a: {
      "90% or more": 50,
      "80%-89%": 40,
      "70%-79%": 30,
      "Below 70%": 0,
      maxScore: 50, // Upper limit
    },
    b: {
      pointsPerExtraLecture: 1,
      maxScore: 5, // Upper limit
    },
    c: {
      pointsPerRemedialLecture: 1,
      maxScore: 5, // Upper limit
    },
    d: {
      "Quality PPT made by the faculty": 5,
      "Animations/Virtual Labs/Website": 10,
      "Good-quality videos": 10,
      "Arranged guest lectures": 2,
      "Arranged subject-related industrial visits": 2,
      "Use of ICT": 2,
      "Innovative pedagogy": 2,
      "Content beyond syllabus": 2,
      maxScore: 40, // Upper limit
    },
    e: {
      "Updated lecture notes": 3,
      "Updated lab manual": 3,
      "Question bank": 2,
      "Question paper solutions": 10, // Total for all solutions
      "Syllabus setting": 5,
      maxScore: 25, // Upper limit
    },
    f: {
      Invigilation: {
        "100% compliance": 5,
        "80%-99% compliance": 3,
        "Less than 80% compliance": 0,
      },
      "Answer script evaluation": {
        "100% compliance": 10,
        "50%-99% compliance": 5,
        "Less than 50% compliance": 0,
      },
      "Question paper setting": 5, // Points per paper
      maxScore: 25, // Upper limit
    },
    totalMaxScore: 150, // Overall limit
  };
  
  // Function to evaluate a single dataset
  function evaluateForm1(dataset) {
    const formData = dataset.formData;
    let totalScore = 0;
  
    // Evaluate section A
    const aResponse =
      formData[
        "a. Lectures, Seminars, tutorials, practical, contact hours undertaken taken as percentage of lectures allocated.\n[MAX API Score allotted 50]"
      ];
    if (aResponse.includes("90%")) {
      totalScore += rules.a["90% or more"];
    } else if (aResponse.includes("80%")) {
      totalScore += rules.a["80%-89%"];
    } else if (aResponse.includes("70%")) {
      totalScore += rules.a["70%-79%"];
    } else {
      totalScore += rules.a["Below 70%"];
    }
  
    // Evaluate section B
    const bResponse =
      parseInt(
        formData[
          "b. Select one Option"
        ].split(" ")[0],
        10
      ) || 0;
    totalScore += Math.min(
      bResponse * rules.b.pointsPerExtraLecture,
      rules.b.maxScore
    );
  
    // Evaluate section C
    const cResponse =
      parseInt(
        formData[
          "c. Select one Option"
        ].split(" ")[0],
        10
      ) || 0;
    totalScore += Math.min(
      cResponse * rules.c.pointsPerRemedialLecture,
      rules.c.maxScore
    );
  
    // Evaluate section D
    let dScore = 0;
    dScore += parseInt(formData["d.1. Quality PPT made by self (5)"], 10) || 0;
    dScore +=
      parseInt(formData["d.2. Animations/virtual labs/website (10)"], 10) || 0;
    dScore +=
      parseInt(
        formData[
          "d.3. Good quality video lectures available on public platforms (recorded online lectures not to be considered) (10)"
        ],
        10
      ) || 0;
    dScore +=
      parseInt(
        formData[
          "d.4. Arranged guest lecture (2 points per lecture. The guest should be external faculty from reputed institute or  industry)"
        ],
        10
      ) || 0;
    dScore +=
      parseInt(
        formData["d.5. Arranged subject related Industrial Visit (2 pts)"],
        10
      ) || 0;
    dScore += parseInt(formData["d.6. Use of ICT (max 2)"], 10) || 0;
    dScore += parseInt(formData["d.7. Innovative pedagogy (max 2)"], 10) || 0;
    dScore += parseInt(formData["d.8. Content beyond syllabus(max 2)"], 10) || 0;
    totalScore += Math.min(dScore, rules.d.maxScore);
  
    // Evaluate section E
    let eScore = 0;
    eScore += parseInt(formData["e.1. Updated lecture notes (max 3)"], 10) || 0;
    eScore += parseInt(formData["e.2. Updated lab manual (max 3)"], 10) || 0;
    eScore += parseInt(formData["e.3. Question bank (2 marks)"], 10) || 0;
    eScore +=
      parseInt(
        formData["e.4. Question Paper solution:\n4.1.  Term Test (1 each max 2)"],
        10
      ) || 0;
    eScore +=
      parseInt(
        formData[
          "e.4. Question Paper solution:\n4.2. Model University solution (5)"
        ],
        10
      ) || 0;
    eScore +=
      parseInt(formData["e.5. Assignment solution (1 each max 2)"], 10) || 0;
    eScore += parseInt(formData["e.6. Syllabus setting (5 marks each)"], 10) || 0;
    totalScore += Math.min(eScore, rules.e.maxScore);
  
    // Evaluate section F
    let fScore = 0;
    const f1Response =
      formData[
        "f.1. Invigilation (flying squad duties/Joint CC/any exam related duties) (max 5 points)\n100% compliance: 5, 80% compliance: 3, less than 80%: no score"
      ];
    fScore += rules.f["Invigilation"][f1Response] || 0;
  
    const f2Response =
      formData[
        "f.2. Evaluation of answer script, preparation of result list on time as specified by Examination Section (max 10 points)\n100% compliance: 5, less than 100%: no score."
      ];
    fScore += rules.f["Answer script evaluation"][f2Response] || 0;
  
    const f3Response =
      parseInt(
        formData["f.3. Question paper setting (5 each, max score 10)"],
        10
      ) || 0;
    fScore += f3Response * rules.f["Question paper setting"];
  
    totalScore += Math.min(fScore, rules.f.maxScore);
  
    // Ensure total score doesn't exceed the maximum possible
    totalScore = Math.min(totalScore, rules.totalMaxScore);
  
    return { userId: dataset.userId["$oid"], totalScore };
  }
  
  // Function to process multiple datasets
  function evaluateAllDatasets(dataArray) {
    return dataArray.map(evaluateForm1);
  }

  module.exports = { evaluateForm1 };
  