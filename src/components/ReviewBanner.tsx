import t from "../i18n";
import s from "./ReviewBanner.module.css";

interface Props {
  count: number;
}

export default function ReviewBanner({ count }: Props) {
  return (
    <div className={s.banner}>
      <span className={s.text}>
        {t.reviewBanner(count)}
      </span>
    </div>
  );
}
