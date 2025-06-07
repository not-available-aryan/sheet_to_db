const maxScores = {
  '1. Lectures, seminars, tutorials, practicals,\ncontact hours undertaken taken as\npercentage of lectures allocated\n[ Maximum Score - 50 ]': 50,
  '2. Lectures or other teaching duties in excess\nof the UGC norms\n[ Maximum Score - 10 ]': 10,
  '3. Preparation and Imparting of knowledge /\ninstruction as per curriculum; syllabus\nenrichment by providing additional resources\nto students\n[ Maximum Score - 20 ]': 20,
  '4. Use of participatory and innovative teaching-\nlearning methodologies; updating of subject\ncontent, course improvement etc\n[ Maximum Score - 20 ]': 20,
  '5. Examination duties (Invigilation; question\npaper setting, evaluation/assessment of\nanswer scripts) as per allotment.\n[ Maximum Score - 25 ]': 25
};

const evaluateUGCForm1 = (response) => {
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
  result.meetsMinimum = totalScore >= 75;

  return {
        userId: response.userId["$oid"], totalScore
    };
};

module.exports = { evaluateUGCForm1 };