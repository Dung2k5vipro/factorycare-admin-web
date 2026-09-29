import Link from "next/link";
import { dinhDangSo } from "@/utils/dashboardBaoCao";

export interface CotBieuDo {
  nhan: string;
  giaTri: number;
  mau?: string;
  duongDan?: string;
}

export default function BieuDoCot({
  tieuDe,
  danhSach,
}: {
  tieuDe: string;
  danhSach: CotBieuDo[];
}) {
  const coDuLieu = danhSach.length > 0;
  const giaTriLonNhat = Math.max(0, ...danhSach.map((cot) => cot.giaTri));

  return (
    <section className="the-bieu-do" aria-label={tieuDe}>
      <div className="dau-the-bieu-do">
        <h2>{tieuDe}</h2>
      </div>
      {!coDuLieu ? (
        <p className="bieu-do-rong">Chưa có dữ liệu.</p>
      ) : (
        <div className="bieu-do-cot" role="list">
          {danhSach.map((cot) => {
            const chieuRong = giaTriLonNhat > 0 ? (cot.giaTri / giaTriLonNhat) * 100 : 0;
            const noiDungCot = (
              <>
                <span className="nhan-cot">{cot.nhan}</span>
                <span className="nen-cot">
                  <i
                    style={{
                      width: `${chieuRong}%`,
                      backgroundColor: cot.mau || "#0f766e",
                    }}
                  />
                </span>
                <strong>{dinhDangSo(cot.giaTri)}</strong>
              </>
            );
            return cot.duongDan ? (
              <Link className="dong-bieu-do-cot co-lien-ket" href={cot.duongDan} key={cot.nhan} role="listitem">
                {noiDungCot}
              </Link>
            ) : (
              <div className="dong-bieu-do-cot" key={cot.nhan} role="listitem">
                {noiDungCot}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
