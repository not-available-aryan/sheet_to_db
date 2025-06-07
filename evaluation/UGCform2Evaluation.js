const maxScores = {
  '1. Student related co-curricular, extension and field based activities (such as extension work through NSS/NCC and other channels, cultural activities, subject related events, advisement and counseling)\n[ Maximum Score - 20 ]': 20,
  '2. Contribution to Corporate life and management of the department and institution through participation in academic and administrative committees and responsibilities.\n[ Maximum Score - 15 ]': 15,
  '3. Professional Development activities (such as participation in seminars, conferences, short term, training courses, talks, lectures, membership of associations, dissemination and general articles, not covered in Category III)\n[ Maximum Score - 15 ]': 15
};

const evaluateUGCForm2 = (response) => {
  const formdata = response.formData
  const result = {};
  let totalScore = 0;

  for (const key in maxScores) {
    const val = parseFloat(formdata[key]) || 0;
    const capped = Math.min(val, maxScores[key]);
    result[key] = capped;
    totalScore += capped;

  }

  result.totalScore = totalScore;
  result.meetsMinimum = totalScore >= 15;

  return {
        userId: response.userId["$oid"], totalScore
    };
};

module.exports = { evaluateUGCForm2 };

