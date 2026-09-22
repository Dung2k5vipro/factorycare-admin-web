"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { FormEvent, useEffect, useState } from "react";
import {
  dieuChuyenThietBi,
  layDanhSachThietBi,
  layLichSuDieuChuyen,
} from "@/services/thietBi.service";
import { layDanhSachViTri } from "@/services/thietBi.service";
import type { LoiHttp } from "@/types/api";
import type { LichSuDieuChuyen } from "@/types/quanLyThietBi";
import type { ThietBi, ViTri } from "@/types/thietBi";
export default function TrangDieuChuyen() {
  const [danhSachThietBi, datDanhSachThietBi] = useState<ThietBi[]>([]);
  const [danhSachViTri, datDanhSachViTri] = useState<ViTri[]>([]);
  const [thietBiId, datThietBiId] = useState("");
  const [viTriMoiId, datViTriMoiId] = useState("");
  const [lyDo, datLyDo] = useState("");
  const [ghiChu, datGhiChu] = useState("");
  const [lichSu, datLichSu] = useState<LichSuDieuChuyen[]>([]);
  const [loiForm, datLoiForm] = useState("");
  const [dangXuLy, datDangXuLy] = useState(false);
  const [thongBao, datThongBao] = useState("");
  const thietBiDangChon = danhSachThietBi.find(
    (x) => x.id === Number(thietBiId),
  );
  useEffect(() => {
    layDanhSachThietBi({ trang: 1, gioiHan: 100 })
      .then((kq) => datDanhSachThietBi(kq.danhSach))
      .catch(() => undefined);
    layDanhSachViTri()
      .then((kq) => datDanhSachViTri(kq.danhSach))
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    if (thietBiId)
      layLichSuDieuChuyen(Number(thietBiId))
        .then((kq) => datLichSu(kq.danhSach))
        .catch(() => datLichSu([]));
    else datLichSu([]);
  }, [thietBiId]);
  async function xuLyDieuChuyen(suKien: FormEvent) {
    suKien.preventDefault();
    datLoiForm("");
    const idThietBi = Number(thietBiId);
    const idViTriMoi = Number(viTriMoiId);
    if (!thietBiDangChon || !idThietBi) {
      datLoiForm("Vui lòng chọn thiết bị.");
      return;
    }
    if (!idViTriMoi) {
      datLoiForm("Vui lòng chọn vị trí mới.");
      return;
    }
    if (thietBiDangChon.viTriId === idViTriMoi) {
      datLoiForm("Thiết bị đang ở vị trí này.");
      return;
    }
    if (!lyDo.trim()) {
      datLoiForm("Lý do điều chuyển không được để trống.");
      return;
    }
    datDangXuLy(true);
    try {
      await dieuChuyenThietBi(idThietBi, {
        viTriMoiId: idViTriMoi,
        lyDo: lyDo.trim(),
        ghiChu: ghiChu.trim() || undefined,
      });
      datThongBao("Điều chuyển thành công.");
      datLyDo("");
      datGhiChu("");
      const kq = await layLichSuDieuChuyen(idThietBi);
      datLichSu(kq.danhSach);
    } catch (e) {
      datLoiForm((e as LoiHttp).message);
    } finally {
      datDangXuLy(false);
    }
  }
  return (
    <>
      <section className="the-noi-dung">
        <div className="noi-dung-chi-tiet">
          <h2>Điều chuyển thiết bị</h2>
          {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}
          {loiForm && <div className="thong-bao loi">{loiForm}</div>}
          <form className="bieu-mau" onSubmit={xuLyDieuChuyen}>
            <div className="nhom-truong">
              <label>
                Thiết bị <em>*</em>
              </label>
              <select
                value={thietBiId}
                onChange={(e) => datThietBiId(e.target.value)}
              >
                <option value="">Chọn thiết bị</option>
                {danhSachThietBi.map((thietBi) => (
                  <option key={thietBi.id} value={thietBi.id}>
                    {thietBi.maThietBi} - {thietBi.tenThietBi}
                  </option>
                ))}
              </select>
            </div>
            <div className="nhom-truong">
              <label>Vị trí hiện tại</label>
              <input
                value={thietBiDangChon?.viTri?.tenViTri || "Chưa xác định"}
                readOnly
              />
            </div>
            <div className="nhom-truong">
              <label>
                Vị trí mới <em>*</em>
              </label>
              <select
                value={viTriMoiId}
                onChange={(e) => datViTriMoiId(e.target.value)}
              >
                <option value="">Chọn vị trí</option>
                {danhSachViTri.map((viTri) => (
                  <option key={viTri.id} value={viTri.id}>
                    {viTri.tenViTri}
                  </option>
                ))}
              </select>
            </div>
            <div className="nhom-truong">
              <label>
                Lý do <em>*</em>
              </label>
              <input value={lyDo} onChange={(e) => datLyDo(e.target.value)} />
            </div>
            <div className="nhom-truong">
              <label>Ghi chú</label>
              <input
                value={ghiChu}
                onChange={(e) => datGhiChu(e.target.value)}
              />
            </div>
            <button className="nut nut-chinh" disabled={dangXuLy}>
              {dangXuLy ? "Đang xử lý..." : "Điều chuyển"}
            </button>
          </form>
        </div>
      </section>
      <section className="the-noi-dung">
        <header className="dau-hop-thoai">
          <h2>Lịch sử điều chuyển</h2>
        </header>
        {!thietBiId ? (
          <div className="trang-thai-du-lieu">
            <p>Chọn thiết bị để xem lịch sử.</p>
          </div>
        ) : lichSu.length === 0 ? (
          <div className="trang-thai-du-lieu">
            <p>Chưa có lịch sử điều chuyển.</p>
          </div>
        ) : (
          <div className="khung-bang">
            <table>
              <thead>
                <tr>
                  <th>Ngày điều chuyển</th>
                  <th>Vị trí cũ</th>
                  <th>Vị trí mới</th>
                  <th>Người thực hiện</th>
                  <th>Lý do</th>
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {lichSu.map((suKien) => (
                  <tr key={suKien.id}>
                    <td>
                      {suKien.ngayDieuChuyen
                        ? new Intl.DateTimeFormat("vi-VN").format(
                            new Date(suKien.ngayDieuChuyen),
                          )
                        : "—"}
                    </td>
                    <td>{suKien.viTriCu?.tenViTri || "—"}</td>
                    <td>{suKien.viTriMoi?.tenViTri || "—"}</td>
                    <td>{suKien.nguoiThucHien?.hoTen || "—"}</td>
                    <td>{suKien.lyDo || "—"}</td>
                    <td>{suKien.ghiChu || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
