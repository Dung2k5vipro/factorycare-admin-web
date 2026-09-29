import Link from "next/link";
import type { DuLieuDashboardTongQuan } from "@/types/dashboardBaoCao";
import { dinhDangNgayBaoCao, dinhDangNgayGioBaoCao, layNhanEnum } from "@/utils/dashboardBaoCao";

export default function DanhSachCanChuY({
  duLieuDashboard,
}: {
  duLieuDashboard: DuLieuDashboardTongQuan;
}) {
  const coDuLieuCanChuY =
    duLieuDashboard.canChuY.suCoNghiemTrong.length > 0 ||
    duLieuDashboard.canChuY.baoTriQuaHan.length > 0 ||
    duLieuDashboard.topThietBiNhieuSuCo.length > 0;

  return (
    <section className="khu-vuc-can-chu-y">
      <div className="dau-khu-vuc"><h2>Dữ liệu cần chú ý</h2></div>
      {!coDuLieuCanChuY ? (
        <p className="bieu-do-rong">Không có dữ liệu cần chú ý.</p>
      ) : (
        <div className="luoi-can-chu-y">
          <article>
            <h3>Sự cố nghiêm trọng</h3>
            {duLieuDashboard.canChuY.suCoNghiemTrong.length === 0 ? <p>Không có dữ liệu cần chú ý.</p> : (
              <ul>
                {duLieuDashboard.canChuY.suCoNghiemTrong.map((suCo) => (
                  <li key={suCo.id}>
                    <Link href={`/admin/su-co?tuKhoa=${encodeURIComponent(suCo.maSuCo)}`}>
                      <strong>{suCo.maSuCo}</strong>
                      <span>{suCo.tieuDe}</span>
                      <small>{layNhanEnum(suCo.trangThai)} · {dinhDangNgayGioBaoCao(suCo.thoiGianBao)}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article>
            <h3>Bảo trì quá hạn</h3>
            {duLieuDashboard.canChuY.baoTriQuaHan.length === 0 ? <p>Không có dữ liệu cần chú ý.</p> : (
              <ul>
                {duLieuDashboard.canChuY.baoTriQuaHan.map((phieu) => (
                  <li key={phieu.phieuBaoTriId}>
                    <Link href={`/admin/bao-tri/phieu?phieuId=${phieu.phieuBaoTriId}`}>
                      <strong>{phieu.thietBi.maThietBi}</strong>
                      <span>{phieu.thietBi.tenThietBi}</span>
                      <small>{phieu.soNgayQuaHan} ngày quá hạn · {dinhDangNgayBaoCao(phieu.ngayDuKien)}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article>
            <h3>Thiết bị nhiều sự cố</h3>
            {duLieuDashboard.topThietBiNhieuSuCo.length === 0 ? <p>Chưa có dữ liệu trong khoảng thời gian này.</p> : (
              <ul>
                {duLieuDashboard.topThietBiNhieuSuCo.map((thietBi) => (
                  <li key={thietBi.id}>
                    <Link href={`/admin/thiet-bi?tuKhoa=${encodeURIComponent(thietBi.maThietBi)}`}>
                      <strong>{thietBi.maThietBi}</strong>
                      <span>{thietBi.tenThietBi}</span>
                      <small>{thietBi.soSuCo} sự cố · {layNhanEnum(thietBi.trangThai)}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
