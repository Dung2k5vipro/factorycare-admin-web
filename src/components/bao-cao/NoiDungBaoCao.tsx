import Link from "next/link";
import BieuDoCot from "@/components/dashboard/BieuDoCot";
import BieuDoDuong from "@/components/dashboard/BieuDoDuong";
import type { KetQuaBaoCao } from "@/types/dashboardBaoCao";
import {
  NHAN_TONG_QUAN,
  dinhDangNgayBaoCao,
  dinhDangNgayGioBaoCao,
  dinhDangSo,
  dinhDangThoiLuongPhut,
  layNhanEnum,
} from "@/utils/dashboardBaoCao";

const DANH_SACH_MAU_BIEU_DO = ["#0f766e", "#0284c7", "#d97706", "#be123c", "#64748b"];

function kiemTraGiaTriThoiLuong(giaTriChiSo: unknown): giaTriChiSo is { giaTri: number | null; donVi: string } {
  return Boolean(giaTriChiSo && typeof giaTriChiSo === "object" && "giaTri" in giaTriChiSo);
}

function TongQuanBaoCao({ ketQuaBaoCao }: { ketQuaBaoCao: KetQuaBaoCao }) {
  function coDuLieuThoiLuong(ten: string) {
    if (ten === "thoiGianXuLyTrungBinh" && ketQuaBaoCao.loaiBaoCao === "su-co") {
      return ketQuaBaoCao.tongQuan.soDaXuLy > 0;
    }
    if (ten === "thoiGianSuaChuaTrungBinh" && ketQuaBaoCao.loaiBaoCao === "sua-chua") {
      return ketQuaBaoCao.tongQuan.tongHoSo > 0;
    }
    return true;
  }

  return (
    <section className="luoi-kpi luoi-kpi-bao-cao" aria-label="Tổng quan báo cáo">
      {Object.entries(ketQuaBaoCao.tongQuan as Record<string, unknown>).map(([tenChiSo, giaTriChiSo]) => (
        <article className="the-kpi kpi-xanh" key={tenChiSo}>
          <span className="nhan-kpi">{NHAN_TONG_QUAN[tenChiSo] || tenChiSo}</span>
          <strong>
            {typeof giaTriChiSo === "number"
              ? dinhDangSo(giaTriChiSo)
              : kiemTraGiaTriThoiLuong(giaTriChiSo)
                ? dinhDangThoiLuongPhut(giaTriChiSo.giaTri, coDuLieuThoiLuong(tenChiSo))
                : "—"}
          </strong>
        </article>
      ))}
    </section>
  );
}

function BieuDoBaoCao({ ketQuaBaoCao }: { ketQuaBaoCao: KetQuaBaoCao }) {
  if (ketQuaBaoCao.loaiBaoCao === "su-co") {
    return (
      <div className="luoi-bieu-do-bao-cao">
        <BieuDoDuong tieuDe="Sự cố theo thời gian" danhSach={ketQuaBaoCao.thongKe.theoThoiGian.map((thongKeNgay) => ({ nhan: thongKeNgay.ngay, giaTri: thongKeNgay.soLuong }))} />
        <BieuDoCot tieuDe="Sự cố theo mức độ" danhSach={ketQuaBaoCao.thongKe.theoMucDo.map((thongKeMucDo, viTri) => ({ nhan: layNhanEnum(thongKeMucDo.mucDo), giaTri: thongKeMucDo.soLuong, mau: DANH_SACH_MAU_BIEU_DO[viTri % DANH_SACH_MAU_BIEU_DO.length] }))} />
      </div>
    );
  }
  if (ketQuaBaoCao.loaiBaoCao === "sua-chua") {
    return <div className="luoi-bieu-do-bao-cao"><BieuDoCot tieuDe="Hồ sơ theo kết quả" danhSach={ketQuaBaoCao.thongKe.theoKetQua.map((thongKeKetQua, viTri) => ({ nhan: layNhanEnum(thongKeKetQua.ketQua), giaTri: thongKeKetQua.soLuong, mau: DANH_SACH_MAU_BIEU_DO[viTri % DANH_SACH_MAU_BIEU_DO.length] }))} /><BieuDoCot tieuDe="Hồ sơ theo kỹ thuật viên" danhSach={ketQuaBaoCao.thongKe.theoKyThuatVien.map((thongKeKyThuatVien, viTri) => ({ nhan: thongKeKyThuatVien.kyThuatVien.hoTen, giaTri: thongKeKyThuatVien.soLuong, mau: DANH_SACH_MAU_BIEU_DO[(viTri + 1) % DANH_SACH_MAU_BIEU_DO.length] }))} /></div>;
  }
  if (ketQuaBaoCao.loaiBaoCao === "bao-tri") {
    return <div className="luoi-bieu-do-bao-cao"><BieuDoCot tieuDe="Phiếu theo trạng thái" danhSach={ketQuaBaoCao.thongKe.theoTrangThai.map((thongKeTrangThai, viTri) => ({ nhan: layNhanEnum(thongKeTrangThai.trangThai), giaTri: thongKeTrangThai.soLuong, mau: DANH_SACH_MAU_BIEU_DO[viTri % DANH_SACH_MAU_BIEU_DO.length] }))} /><BieuDoCot tieuDe="Phiếu theo kỹ thuật viên" danhSach={ketQuaBaoCao.thongKe.theoKyThuatVien.map((thongKeKyThuatVien, viTri) => ({ nhan: thongKeKyThuatVien.kyThuatVien?.hoTen || "Chưa phân công", giaTri: thongKeKyThuatVien.soLuong, mau: DANH_SACH_MAU_BIEU_DO[(viTri + 1) % DANH_SACH_MAU_BIEU_DO.length] }))} /></div>;
  }
  return <div className="luoi-bieu-do-bao-cao"><BieuDoCot tieuDe="Thiết bị theo trạng thái" danhSach={ketQuaBaoCao.thongKe.theoTrangThai.map((thongKeTrangThai, viTri) => ({ nhan: layNhanEnum(thongKeTrangThai.trangThai), giaTri: thongKeTrangThai.soLuong, mau: DANH_SACH_MAU_BIEU_DO[viTri % DANH_SACH_MAU_BIEU_DO.length] }))} /><BieuDoCot tieuDe="Thiết bị theo loại" danhSach={ketQuaBaoCao.thongKe.theoLoai.map((thongKeLoaiThietBi, viTri) => ({ nhan: thongKeLoaiThietBi.loaiThietBi.tenLoai, giaTri: thongKeLoaiThietBi.soLuong, mau: DANH_SACH_MAU_BIEU_DO[(viTri + 1) % DANH_SACH_MAU_BIEU_DO.length] }))} /></div>;
}

function BangSuCo({ ketQuaBaoCao }: { ketQuaBaoCao: Extract<KetQuaBaoCao, { loaiBaoCao: "su-co" }> }) {
  return <table><thead><tr><th>Mã sự cố</th><th>Thiết bị</th><th>Mức độ</th><th>Trạng thái</th><th>Kỹ thuật viên</th><th>Thời gian báo</th><th>Hoàn thành</th></tr></thead><tbody>{ketQuaBaoCao.danhSach.map((dong) => <tr key={dong.id}><td><Link className="lien-ket-bang" href={`/admin/su-co?tuKhoa=${encodeURIComponent(dong.maSuCo)}`}>{dong.maSuCo}</Link><span className="chu-phu-bang">{dong.tieuDe}</span></td><td><strong className="ten-chinh-bang">{dong.thietBi.maThietBi}</strong><span className="chu-phu-bang">{dong.thietBi.tenThietBi}</span></td><td><span className="huy-hieu">{layNhanEnum(dong.mucDo)}</span></td><td>{layNhanEnum(dong.trangThai)}</td><td>{dong.kyThuatVien?.hoTen || "Chưa phân công"}</td><td>{dinhDangNgayGioBaoCao(dong.thoiGianBao)}</td><td>{dinhDangNgayGioBaoCao(dong.thoiGianHoanThanh)}</td></tr>)}</tbody></table>;
}

function BangSuaChua({ ketQuaBaoCao }: { ketQuaBaoCao: Extract<KetQuaBaoCao, { loaiBaoCao: "sua-chua" }> }) {
  return <table><thead><tr><th>Mã sự cố</th><th>Thiết bị</th><th>Kỹ thuật viên</th><th>Kết quả</th><th>Nguyên nhân</th><th>Bắt đầu</th><th>Hoàn thành</th></tr></thead><tbody>{ketQuaBaoCao.danhSach.map((dong) => <tr key={dong.id}><td><Link className="lien-ket-bang" href={`/admin/su-co?tuKhoa=${encodeURIComponent(dong.maSuCo)}`}>{dong.maSuCo}</Link></td><td><strong className="ten-chinh-bang">{dong.thietBi.maThietBi}</strong><span className="chu-phu-bang">{dong.thietBi.tenThietBi}</span></td><td>{dong.kyThuatVien?.hoTen || "—"}</td><td><span className="huy-hieu">{layNhanEnum(dong.ketQua)}</span></td><td className="o-noi-dung-dai">{dong.nguyenNhan || "—"}</td><td>{dinhDangNgayGioBaoCao(dong.thoiGianBatDau)}</td><td>{dinhDangNgayGioBaoCao(dong.thoiGianHoanThanh)}</td></tr>)}</tbody></table>;
}

function BangBaoTri({ ketQuaBaoCao }: { ketQuaBaoCao: Extract<KetQuaBaoCao, { loaiBaoCao: "bao-tri" }> }) {
  return <table><thead><tr><th>Phiếu</th><th>Thiết bị</th><th>Ngày dự kiến</th><th>Kỹ thuật viên</th><th>Trạng thái</th><th>Hoàn thành</th><th>Kết quả</th></tr></thead><tbody>{ketQuaBaoCao.danhSach.map((dong) => <tr key={dong.id}><td><Link className="lien-ket-bang" href={`/admin/bao-tri/phieu?phieuId=${dong.id}`}>#{dong.id}</Link></td><td><strong className="ten-chinh-bang">{dong.thietBi.maThietBi}</strong><span className="chu-phu-bang">{dong.thietBi.tenThietBi}</span></td><td>{dinhDangNgayBaoCao(dong.ngayDuKien)}{dong.daQuaHan && <span className="chu-phu-bang chu-qua-han">Đã quá hạn</span>}</td><td>{dong.kyThuatVien?.hoTen || "Chưa phân công"}</td><td><span className="huy-hieu">{layNhanEnum(dong.trangThai)}</span></td><td>{dinhDangNgayGioBaoCao(dong.thoiGianHoanThanh)}</td><td className="o-noi-dung-dai">{dong.ketQuaBaoTri || "—"}</td></tr>)}</tbody></table>;
}

function BangThietBi({ ketQuaBaoCao }: { ketQuaBaoCao: Extract<KetQuaBaoCao, { loaiBaoCao: "thiet-bi" }> }) {
  return <table><thead><tr><th>Mã thiết bị</th><th>Tên thiết bị</th><th>Loại</th><th>Vị trí</th><th>Trạng thái</th><th>Sự cố</th><th>Bảo trì quá hạn</th></tr></thead><tbody>{ketQuaBaoCao.danhSach.map((dong) => <tr key={dong.id}><td><Link className="lien-ket-bang" href={`/admin/thiet-bi?tuKhoa=${encodeURIComponent(dong.maThietBi)}`}>{dong.maThietBi}</Link></td><td>{dong.tenThietBi}</td><td>{dong.loaiThietBi?.tenLoai || "—"}</td><td>{dong.viTriHienTai?.tenViTri || "Chưa gán"}</td><td><span className="huy-hieu">{layNhanEnum(dong.trangThai)}</span></td><td>{dinhDangSo(dong.soSuCo)}</td><td>{dinhDangSo(dong.soBaoTriQuaHan)}</td></tr>)}</tbody></table>;
}

function BangBaoCao({ ketQuaBaoCao }: { ketQuaBaoCao: KetQuaBaoCao }) {
  if (ketQuaBaoCao.danhSach.length === 0) return <div className="trang-thai-du-lieu"><div className="bieu-tuong-rong">□</div><p>Không tìm thấy dữ liệu phù hợp.</p></div>;
  return <div className="khung-bang bang-bao-cao">{ketQuaBaoCao.loaiBaoCao === "su-co" ? <BangSuCo ketQuaBaoCao={ketQuaBaoCao} /> : ketQuaBaoCao.loaiBaoCao === "sua-chua" ? <BangSuaChua ketQuaBaoCao={ketQuaBaoCao} /> : ketQuaBaoCao.loaiBaoCao === "bao-tri" ? <BangBaoTri ketQuaBaoCao={ketQuaBaoCao} /> : <BangThietBi ketQuaBaoCao={ketQuaBaoCao} />}</div>;
}

export default function NoiDungBaoCao({
  ketQuaBaoCao,
  xuLyDoiTrang,
}: {
  ketQuaBaoCao: KetQuaBaoCao;
  xuLyDoiTrang: (trang: number) => void;
}) {
  const { phanTrang } = ketQuaBaoCao;
  return <>
    <TongQuanBaoCao ketQuaBaoCao={ketQuaBaoCao} />
    <BieuDoBaoCao ketQuaBaoCao={ketQuaBaoCao} />
    <section className="the-noi-dung ket-qua-bao-cao">
      <div className="dau-ket-qua-bao-cao"><h2>Dữ liệu chi tiết</h2><span>{dinhDangSo(phanTrang.tongBanGhi)} bản ghi</span></div>
      <BangBaoCao ketQuaBaoCao={ketQuaBaoCao} />
      {phanTrang.tongTrang > 0 && <footer className="phan-trang"><span>Trang {phanTrang.trang} / {phanTrang.tongTrang}</span><div><button className="nut-trang" type="button" disabled={phanTrang.trang <= 1} onClick={() => xuLyDoiTrang(phanTrang.trang - 1)}>‹</button><button className="nut-trang dang-chon" type="button">{phanTrang.trang}</button><button className="nut-trang" type="button" disabled={phanTrang.trang >= phanTrang.tongTrang} onClick={() => xuLyDoiTrang(phanTrang.trang + 1)}>›</button></div></footer>}
    </section>
  </>;
}
