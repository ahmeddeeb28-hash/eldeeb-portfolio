import { CardStage } from '../_shared/CardStage';
import { SaryAddAllLoop, SaryPhone } from './SaryPhone';

/* The Sary thumbnail: the "Add all" loop on the Buy Again hub,
   with the review basket and a past order beside it. */
export function SaryCardStage({ active }: { active: boolean }) {
  return (
    <CardStage
      active={active}
      aspect={844 / 390}
      background="radial-gradient(ellipse 60% 75% at 50% 45%, #2a4aa8 0%, #182c6b 45%, #0b1330 100%)"
      dot="#FEDD02"
      label="Live · Add all in one tap"
      shortLabel="Live · Add all"
      left={(w) => <SaryPhone state="review" width={w} />}
      center={(w, playing) => <SaryAddAllLoop width={w} playing={playing} />}
      right={(w) => <SaryPhone state="order" width={w} />}
    />
  );
}
