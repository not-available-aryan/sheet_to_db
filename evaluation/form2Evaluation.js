function evaluateForm2(response) {
    const formdata = response.formData
    // Keys for each category
    const cat1Keys = [
      '1.a. Contribution to corporate life in colleges and universities through meetings/popular lectures/subject-related events/articles in college magazines and university volumes - 3 pts each',
      '1.b. Institutional governance responsibilities like Vice-Principal, Deans, HOD, Director, IQAC Coordinator/T&P officer, Exam cell in charge, Admission cell in charge maximum of 25 points (or any other equivalent responsibility)',
      '1.c1. Conference - 15 points',
      '1.c2.1. One week or more - 10 points',
      '1.c2.2. Less than a week but greater than two days - 5 points',
      '1.c2.3. One to two days - 3 points',
      '1.c2.4. Committee member of ICAST - 2 points',
      '1.c2.5. Seminars - 1 point',
      '1.c3.1. At college level for faculty - 3 points',
      '1.c3.2. During STTP - 10 points',
      '1.c3.3. International - 15 points',
      '1.d. Establishing labs with the help of industry/industry/another organization. Max 5 per individual if a group is involved - 10 if only 1 person is involved',
    ];
  
    const cat2Keys = [
      '2.a. Field studies /Educational Tour (other than subject\nrelated in 1.d)',
      '2.b. Placement activity (for coordinators 15 marks)',
      '2.c. Community Service, Social Orientation other (10\nmarks)',
      '2.d. IQAC members/DQC/PAC (10 marks)',
      '2.e. IIC members (10 marks)',
      '2.f. Alumni committee members (10 marks)',
      '2.g. Admission cell members (15 marks)',
      '2.h. ATF Coordinators Member& dept supports (5)',
      '2.i. NSS/NCC/NSO/other (15 marks)',
      '2.j. Exam coordinator (10)',
      '2.k. Time Table coordinator (10)',
      '2.l. Project Coordinators (5)',
      '2.m. Class teacher (10 marks for 1 semester)',
      '2.n. Proctor coordinator /NPTEL coordinator (max 3\nmarks)',
      '2.o. Project Competition Coordinators (5)',
      '2.p. IIIC Coordinators, IV Coordinators(5)',
      '2.q. Any other coordinators (marks based on activeness\nmax 5 provided ithe same is not repeated elsewhere)'
    ];
  
    const cat3Keys = [
      '3.1. In charge for Score/Oscillations/Surge/Intech etc (Judge for project competition in Intech) (Max 10)',
      '3.2. Coordinators of different events based on complexity- (as recommended by in-charge) (coordinated Placement in 5 different companies and coordinated for collaboration with industries) (Max 10)'
    ];
  
    const cat4Keys = [
      '4.1. coordinator of student chapters\nIEEE/IETE/IET/CSI/ISTE etc (5 points)',
      '4.2. Media participation in profession related\ntalks/debates etc (5 points.)',
      '4.3. Membership in profession related committees at\nstate and national level (max 3)',
      '4.4. Participation in subject associations,\nconferences, seminars without paper\npresentation (1 marks each subject to max 3)',
      '4.5.1 IIT /NIT/Govt college/ TEQIP (10 each for\nexternal 8 for local)',
      '4.5.2 Industry related (max 10 for outside Mumbai 5\nin Mumbai)',
      '4.5.3 not belonging to above (5 for external 4 for local)',
      '4.6 Boards of Studies, editorial committees of journals\n– (5pts)'
    ];
  
    // Sum with safety fallback to 0
    const sumCategory = (keys, cap) => {
      const total = keys.reduce((sum, key) => {
        const val = parseFloat(formdata[key]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
      return Math.min(total, cap);
    };
  
    const category1 = sumCategory(cat1Keys, 35);
    const category2 = sumCategory(cat2Keys, 25);
    const category3 = sumCategory(cat3Keys, 20);
    const category4 = sumCategory(cat4Keys, 20);
  
    const totalScore = category1 + category2 + category3 + category4;
  
    return {
        userId: response.userId["$oid"], totalScore
    };
  }
  
  module.exports = { evaluateForm2 };