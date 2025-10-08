import { ExamCard } from '../exam-card';

export default function ExamCardExample() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      <ExamCard
        title="Midterm Exam"
        subject="Mathematics"
        date={tomorrow}
        difficulty="hard"
        progress={65}
        status="in-progress"
      />
      <ExamCard
        title="Chapter 5 Test"
        subject="Biology"
        date={nextWeek}
        difficulty="medium"
        progress={30}
        status="not-started"
      />
    </div>
  );
}
