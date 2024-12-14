// import React from 'react';
// import { Card } from '@/components/ui/card';
// import { useRecoilValue } from 'recoil';
// import { scoreAtom } from '@/store/atoms/game';

// interface ScoreProps {
//   high: number;
// }

// export function Score({ high }: ScoreProps): React.ReactElement {
//   const score = useRecoilValue<number>(scoreAtom);

//   return (
//     <Card className="p-4 bg-card/90 backdrop-blur">
//       <div className="space-y-2">
//         <div className="text-sm text-muted-foreground">Score</div>
//         <div className="text-3xl font-bold text-primary">{score}</div>
//         <div className="text-sm text-muted-foreground">High Score</div>
//         <div className="text-xl font-semibold">{high}</div>
//       </div>
//     </Card>
// //   );
// }
