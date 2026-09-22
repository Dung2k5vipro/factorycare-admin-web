import type { HoSoSuaChua, LinhKienThayThe, SuCo } from "@/types/suCo";
import { dinhDangThoiGian, NHAN_KET_QUA_SUA_CHUA, NHAN_TRANG_THAI_SU_CO } from "@/utils/dinhDangSuCo";

function hienThiNoiDung(noiDung?: string | null) {
  return noiDung?.trim() || "Chưa cập nhật";
}

function hienThiThoiGian(thoiGian?: string | null) {
  return thoiGian ? dinhDangThoiGian(thoiGian) : "Chưa cập nhật";
}

function DanhSachLinhKienThayThe({ danhSachLinhKien }: { danhSachLinhKien?: LinhKienThayThe[] | null }) {
  if (!Array.isArray(danhSachLinhKien) || danhSachLinhKien.length === 0) {
    return <p className="chu-phu">Chưa cập nhật</p>;
  }

  return (
    <div className="khung-bang bang-linh-kien">
      <table>
        <thead><tr><th>Tên linh kiện</th><th>Số lượng</th></tr></thead>
        <tbody>
          {danhSachLinhKien.map((linhKien, viTri) => (
            <tr key={`${linhKien.ten}-${viTri}`}>
              <td>{hienThiNoiDung(linhKien.ten)}</td>
              <td>{Number.isFinite(linhKien.soLuong) ? linhKien.soLuong : "Chưa cập nhật"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoiDungHoSo({ hoSo, soThuTu }: { hoSo: HoSoSuaChua; soThuTu: number }) {
  return (
    <article className="ho-so-sua-chua">
      <h4>Hồ sơ {soThuTu}</h4>
      <dl className="luoi-thong-tin">
        <div><dt>Kỹ thuật viên</dt><dd>{hoSo.kyThuatVien?.hoTen || "Chưa cập nhật"}</dd></div>
        <div><dt>Kết quả</dt><dd>{hoSo.ketQua ? NHAN_KET_QUA_SUA_CHUA[hoSo.ketQua] || hoSo.ketQua : "Chưa cập nhật"}</dd></div>
        <div><dt>Thời gian bắt đầu</dt><dd>{hienThiThoiGian(hoSo.thoiGianBatDau)}</dd></div>
        <div><dt>Thời gian hoàn thành</dt><dd>{hienThiThoiGian(hoSo.thoiGianHoanThanh)}</dd></div>
      </dl>
      <div className="noi-dung-ho-so"><strong>Nguyên nhân</strong><p>{hienThiNoiDung(hoSo.nguyenNhan)}</p></div>
      <div className="noi-dung-ho-so"><strong>Cách xử lý</strong><p>{hienThiNoiDung(hoSo.cachXuLy)}</p></div>
      <div className="noi-dung-ho-so"><strong>Linh kiện thay thế</strong><DanhSachLinhKienThayThe danhSachLinhKien={hoSo.linhKienThayThe} /></div>
      <div className="noi-dung-ho-so"><strong>Ghi chú</strong><p>{hienThiNoiDung(hoSo.ghiChu)}</p></div>
    </article>
  );
}

export default function TheoDoiSuaChua({ suCo }: { suCo: SuCo }) {
  const danhSachHoSo = Array.isArray(suCo.danhSachHoSoSuaChua) ? suCo.danhSachHoSoSuaChua : [];
  const hoSoDangXuLy = danhSachHoSo.find((hoSo) => !hoSo.thoiGianHoanThanh);
  const hoSoGanNhat = hoSoDangXuLy || danhSachHoSo[0];

  return (
    <>
      <section className="muc-chi-tiet-su-co">
        <h3>Theo dõi xử lý</h3>
        <dl className="luoi-thong-tin">
          <div><dt>Trạng thái</dt><dd>{NHAN_TRANG_THAI_SU_CO[suCo.trangThai] || suCo.trangThai}</dd></div>
          <div><dt>Kỹ thuật viên</dt><dd>{suCo.kyThuatVien?.hoTen || "Chưa phân công"}</dd></div>
          <div><dt>Thời gian phân công</dt><dd>{hienThiThoiGian(suCo.thoiGianPhanCong)}</dd></div>
          <div><dt>Thời gian bắt đầu xử lý</dt><dd>{hienThiThoiGian(hoSoGanNhat?.thoiGianBatDau)}</dd></div>
          <div><dt>Thời gian hoàn thành</dt><dd>{hienThiThoiGian(suCo.thoiGianHoanThanh)}</dd></div>
        </dl>
      </section>
      <section className="muc-chi-tiet-su-co">
        <h3>Hồ sơ sửa chữa</h3>
        {danhSachHoSo.length === 0 ? (
          <p className="chu-phu">Chưa cập nhật</p>
        ) : (
          danhSachHoSo.map((hoSo, viTri) => <NoiDungHoSo key={hoSo.id} hoSo={hoSo} soThuTu={danhSachHoSo.length - viTri} />)
        )}
      </section>
    </>
  );
}
