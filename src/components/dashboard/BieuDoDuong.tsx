import { dinhDangNgayBaoCao, dinhDangSo } from "@/utils/dashboardBaoCao";

interface DiemBieuDoDuong {
  nhan: string;
  giaTri: number;
}

export default function BieuDoDuong({
  tieuDe,
  danhSach,
}: {
  tieuDe: string;
  danhSach: DiemBieuDoDuong[];
}) {
  if (danhSach.length === 0) {
    return (
      <section className="the-bieu-do" aria-label={tieuDe}>
        <div className="dau-the-bieu-do"><h2>{tieuDe}</h2></div>
        <p className="bieu-do-rong">Chưa có dữ liệu.</p>
      </section>
    );
  }

  const rong = 600;
  const cao = 210;
  const le = 24;
  const giaTriLonNhat = Math.max(1, ...danhSach.map((diem) => diem.giaTri));
  const khoangCach = danhSach.length > 1 ? (rong - le * 2) / (danhSach.length - 1) : 0;
  const danhSachDiem = danhSach.map((diem, viTri) => ({
    ...diem,
    toaDoX: danhSach.length === 1 ? rong / 2 : le + viTri * khoangCach,
    toaDoY: cao - le - (diem.giaTri / giaTriLonNhat) * (cao - le * 2),
  }));
  const duongVe = danhSachDiem.map((diem) => `${diem.toaDoX},${diem.toaDoY}`).join(" ");

  return (
    <section className="the-bieu-do" aria-label={tieuDe}>
      <div className="dau-the-bieu-do"><h2>{tieuDe}</h2></div>
      <div className="khung-bieu-do-duong">
        <svg viewBox={`0 0 ${rong} ${cao}`} role="img" aria-label={tieuDe}>
          <line x1={le} y1={cao - le} x2={rong - le} y2={cao - le} className="truc-bieu-do" />
          {danhSachDiem.length > 1 && <polyline points={duongVe} className="duong-bieu-do" />}
          {danhSachDiem.map((diem) => (
            <g key={`${diem.nhan}-${diem.toaDoX}`}>
              <circle cx={diem.toaDoX} cy={diem.toaDoY} r="5" className="diem-bieu-do" />
              <title>{`${dinhDangNgayBaoCao(diem.nhan)}: ${dinhDangSo(diem.giaTri)}`}</title>
            </g>
          ))}
        </svg>
        <div className="nhan-bieu-do-duong">
          <span>{dinhDangNgayBaoCao(danhSach[0].nhan)}</span>
          <strong>Tổng {dinhDangSo(danhSach.reduce((tong, diem) => tong + diem.giaTri, 0))}</strong>
          <span>{dinhDangNgayBaoCao(danhSach[danhSach.length - 1].nhan)}</span>
        </div>
      </div>
    </section>
  );
}
