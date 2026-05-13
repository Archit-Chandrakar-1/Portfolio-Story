import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

await updateDoc(doc(db, 'projects', '48oRLgb9F6YAN7D40cWa'), {
  caseStudy: {
    problem:   { heading: 'The Problem',    body: 'CRAFTO had a less than 5% iOS conversion rate and a post-trial Android churn spike. Users were dropping off after the trial without converting to paid.' },
    research:  { heading: 'What We Found',  body: 'Conducted funnel analysis and 1:1 user interviews. Found users did not feel enough value before the paywall appeared, and the trial lacked engagement hooks.' },
    solution:  { heading: 'What We Built',  body: 'Proposed value-anchored paywalls and engagement loops — showing users their creation history and progress before the paywall hit, with a soft-lock model.' },
    learnings: { heading: 'What I Learned', body: 'Paywalls fail when they interrupt before the user has felt real value. Timing and context of the ask matters more than the offer itself.' },
    metrics: [
      { label: 'Trial-to-Paid Conversion', before: '<5%',  after: '~10%' },
      { label: 'Post-Trial Churn',         before: 'High', after: '-40%' },
    ],
  }
});

console.log('✅ Done!');
