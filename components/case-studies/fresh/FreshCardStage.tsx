import { CardStage } from '../_shared/CardStage';
import { FreshPhone, LoopingPhone } from './FreshPhone';

/* The fresh thumbnail: the five second order-placed loop with
   the edit sheet and the late notice beside it. */
export function FreshCardStage({ active }: { active: boolean }) {
  return (
    <CardStage
      active={active}
      aspect={956 / 440}
      background="radial-gradient(ellipse 60% 75% at 50% 45%, #1f5440 0%, #123326 45%, #0c1a14 100%)"
      dot="#5FE0A2"
      label="Live · 5s window"
      shortLabel="Live · 5s"
      left={(w) => <FreshPhone state="edit-address" width={w} />}
      center={(w, playing) => <LoopingPhone width={w} playing={playing} />}
      right={(w) => <FreshPhone state="late" width={w} />}
    />
  );
}
