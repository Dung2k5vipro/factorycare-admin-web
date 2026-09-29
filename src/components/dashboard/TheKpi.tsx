import Link from "next/link";

interface ThuocTinhTheKpi {
  nhan: string;
  giaTri: string;
  ghiChu?: string;
  tongMau?: "xanh" | "do" | "cam" | "tim" | "lam";
  duongDan?: string;
}

export default function TheKpi({
  nhan,
  giaTri,
  ghiChu,
  tongMau = "xanh",
  duongDan,
}: ThuocTinhTheKpi) {
  const noiDung = (
    <>
      <span className="nhan-kpi">{nhan}</span>
      <strong>{giaTri}</strong>
      {ghiChu && <small>{ghiChu}</small>}
    </>
  );

  return duongDan ? (
    <Link className={`the-kpi kpi-${tongMau}`} href={duongDan}>
      {noiDung}
      <span className="mo-chi-tiet-kpi">Xem chi tiết →</span>
    </Link>
  ) : (
    <article className={`the-kpi kpi-${tongMau}`}>{noiDung}</article>
  );
}

