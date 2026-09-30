import type { HoSoSuaChua, LinhKienThayThe, SuCo } from "@/types/suCo";
import { dinhDangThoiGian, NHAN_KET_QUA_SUA_CHUA, NHAN_TRANG_THAI_SU_CO } from "@/utils/dinhDangSuCo";
import { layTatCaAnhHoSo, phanTachAnhHoSo } from "@/utils/hinhAnh";
import HinhAnhSuCo from "./HinhAnhSuCo";

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
            <tr key={`${linhKien.tenLinhKien}-${viTri}`}>
              <td>{hienThiNoiDung(linhKien.tenLinhKien)}</td>
              <td>{Number.isFinite(linhKien.soLuong) ? linhKien.soLuong : "Chưa cập nhật"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoiDungHoSo({ hoSo, soThuTu }: { hoSo: HoSoSuaChua; soThuTu: number }) {
  const dangXuLy = !hoSo.thoiGianHoanThanh;
  const { anhQuaTrinh, anhHoanThanh } = phanTachAnhHoSo(
    layTatCaAnhHoSo(hoSo),
    hoSo.thoiGianHoanThanh
  );

  return (
    <article className="ho-so-sua-chua">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h4 style={{ margin: 0 }}>Hồ sơ {soThuTu}</h4>
        {dangXuLy ? (
          <span style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600 }}>● Đang xử lý / Cập nhật tiến độ</span>
        ) : (
          <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>✓ Đã hoàn thành</span>
        )}
      </div>

      <dl className="luoi-thong-tin">
        <div><dt>Kỹ thuật viên</dt><dd>{hoSo.kyThuatVien?.hoTen || "Chưa cập nhật"}</dd></div>
        <div><dt>Kết quả</dt><dd>{hoSo.ketQua ? NHAN_KET_QUA_SUA_CHUA[hoSo.ketQua] || hoSo.ketQua : dangXuLy ? "Đang xử lý" : "Chưa cập nhật"}</dd></div>
        <div><dt>Thời gian bắt đầu</dt><dd>{hienThiThoiGian(hoSo.thoiGianBatDau)}</dd></div>
        <div><dt>Thời gian hoàn thành</dt><dd>{hienThiThoiGian(hoSo.thoiGianHoanThanh)}</dd></div>
      </dl>

      {hoSo.ghiChu && (
        <div className="noi-dung-ho-so">
          <strong>{dangXuLy ? "Ghi chú tiến độ (Kỹ thuật viên gửi lên)" : "Ghi chú hoàn thành"}</strong>
          <p>{hienThiNoiDung(hoSo.ghiChu)}</p>
        </div>
      )}

      <div className="noi-dung-ho-so">
        <strong>Nguyên nhân</strong>
        <p>{hienThiNoiDung(hoSo.nguyenNhan)}</p>
      </div>

      <div className="noi-dung-ho-so">
        <strong>Cách xử lý</strong>
        <p>{hienThiNoiDung(hoSo.cachXuLy)}</p>
      </div>

      <div className="noi-dung-ho-so">
        <strong>Linh kiện thay thế</strong>
        <DanhSachLinhKienThayThe danhSachLinhKien={hoSo.linhKienThayThe} />
      </div>

      {!hoSo.ghiChu && (
        <div className="noi-dung-ho-so">
          <strong>Ghi chú</strong>
          <p>Chưa cập nhật</p>
        </div>
      )}

      {/* 1. Ảnh quá trình xử lý & sửa chữa (Kỹ thuật viên gửi lên) */}
      <div className="noi-dung-ho-so">
        <strong>1. Ảnh quá trình xử lý &amp; sửa chữa (Kỹ thuật viên gửi lên)</strong>
        {anhQuaTrinh.length > 0 ? (
          <HinhAnhSuCo
            danhSachAnh={anhQuaTrinh}
            tieuDeAnh={`Ảnh quá trình xử lý hồ sơ ${soThuTu}`}
            nhanRong="Chưa có ảnh quá trình xử lý đính kèm."
          />
        ) : (
          <p className="chu-phu">Chưa có ảnh quá trình xử lý đính kèm.</p>
        )}
      </div>

      {/* 2. Ảnh sau khi sửa chữa hoàn thành */}
      <div className="noi-dung-ho-so">
        <strong>2. Ảnh sau khi sửa chữa hoàn thành</strong>
        {!dangXuLy ? (
          anhHoanThanh.length > 0 ? (
            <HinhAnhSuCo
              danhSachAnh={anhHoanThanh}
              tieuDeAnh={`Ảnh sau khi hoàn thành sửa chữa hồ sơ ${soThuTu}`}
              nhanRong="Chưa có ảnh sau khi hoàn thành đính kèm."
            />
          ) : (
            <p className="chu-phu">Chưa có ảnh sau khi hoàn thành đính kèm.</p>
          )
        ) : (
          <p className="chu-phu">Chưa hoàn thành sửa chữa.</p>
        )}
      </div>
    </article>
  );
}

export default function TheoDoiSuaChua({ suCo }: { suCo: SuCo }) {
  let danhSachHoSo: HoSoSuaChua[] = [];
  if (Array.isArray(suCo.danhSachHoSoSuaChua)) {
    danhSachHoSo = suCo.danhSachHoSoSuaChua;
  } else if (Array.isArray(suCo.hoSoSuaChua)) {
    danhSachHoSo = suCo.hoSoSuaChua;
  } else if (suCo.hoSoSuaChua && typeof suCo.hoSoSuaChua === "object") {
    danhSachHoSo = [suCo.hoSoSuaChua as HoSoSuaChua];
  }

  const hoSoDangXuLy = danhSachHoSo.find((hoSo) => !hoSo.thoiGianHoanThanh);
  const hoSoGanNhat = hoSoDangXuLy || danhSachHoSo[0];
  const { anhQuaTrinh: anhQuaTrinhTong, anhHoanThanh: anhHoanThanhTong } = phanTachAnhHoSo(
    layTatCaAnhHoSo(suCo),
    suCo.thoiGianHoanThanh
  );
  const laDaHoanThanh = suCo.trangThai === "DA_XU_LY" || suCo.trangThai === "CHO_XAC_NHAN";

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
        <h3>Hồ sơ sửa chữa &amp; Tiến độ xử lý</h3>
        {danhSachHoSo.length === 0 ? (
          <>
            <p className="chu-phu">Chưa có hồ sơ sửa chữa chi tiết.</p>
            {anhQuaTrinhTong.length > 0 || anhHoanThanhTong.length > 0 ? (
              <>
                <div className="noi-dung-ho-so" style={{ marginTop: "12px" }}>
                  <strong>1. Ảnh quá trình xử lý &amp; sửa chữa (Kỹ thuật viên gửi lên)</strong>
                  {anhQuaTrinhTong.length > 0 ? (
                    <HinhAnhSuCo
                      danhSachAnh={anhQuaTrinhTong}
                      tieuDeAnh="Ảnh quá trình sửa chữa sự cố"
                      nhanRong="Chưa có ảnh quá trình đính kèm."
                    />
                  ) : (
                    <p className="chu-phu">Chưa có ảnh quá trình đính kèm.</p>
                  )}
                </div>
                <div className="noi-dung-ho-so">
                  <strong>2. Ảnh sau khi sửa chữa hoàn thành</strong>
                  {laDaHoanThanh ? (
                    anhHoanThanhTong.length > 0 ? (
                      <HinhAnhSuCo
                        danhSachAnh={anhHoanThanhTong}
                        tieuDeAnh="Ảnh sau khi hoàn thành sửa chữa"
                        nhanRong="Chưa có ảnh sau hoàn thành đính kèm."
                      />
                    ) : (
                      <p className="chu-phu">Chưa có ảnh sau hoàn thành đính kèm.</p>
                    )
                  ) : (
                    <p className="chu-phu">Chưa hoàn thành sửa chữa.</p>
                  )}
                </div>
              </>
            ) : null}
          </>
        ) : (
          danhSachHoSo.map((hoSo, viTri) => (
            <NoiDungHoSo key={hoSo.id || viTri} hoSo={hoSo} soThuTu={danhSachHoSo.length - viTri} />
          ))
        )}
      </section>
    </>
  );
}
