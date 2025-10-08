import { GradeDisplay } from '../grade-display';

export default function GradeDisplayExample() {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      <GradeDisplay subject="Mathematics" grade={92} weight={2} />
      <GradeDisplay subject="Physics" grade={85} weight={1} />
      <GradeDisplay subject="Chemistry" grade={78} weight={1} />
      <GradeDisplay subject="English" grade={88} weight={1} />
    </div>
  );
}
