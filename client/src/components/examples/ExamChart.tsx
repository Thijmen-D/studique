import { ExamChart } from '../exam-chart';

export default function ExamChartExample() {
  return (
    <div className="p-4 max-w-md">
      <ExamChart completed={8} total={12} />
    </div>
  );
}
