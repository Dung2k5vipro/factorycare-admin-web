"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { FormEvent, useEffect, useState } from "react";
import { layDanhSachNhaCungCap } from "@/services/nhaCungCap.service";
import {
  capNhatLoNhap,
  layDanhSachLoNhapQuanLy,
  themLoNhap,
} from "@/services/loNhap.service";
import type { DuLieuLoNhap, LoNhap, NhaCungCap } from "@/types/quanLyThietBi";
import { LoiHttp } from "@/types/api";
import { chiGiuChuSo } from "@/utils/duLieuNhap";
const DU_LIEU_BAN_DAU: DuLieuLoNhap = {
  maLo: "",
  nhaCungCapId: null,
  soHoaDon: "",
  ngayNhap: new Date().toISOString().slice(0, 10),
  tongGiaTri: null,
  ghiChu: "",
  fileHoaDon: null,
};
export default function TrangLoNhap() {
  const [danhSach, datDanhSach] = useState<LoNhap[]>([]);
  const [danhSachNhaCungCap, datDanhSachNhaCungCap] = useState<NhaCungCap[]>(
    [],
  );
  const [tuKhoa, datTuKhoa] = useState("");
  const [trang, datTrang] = useState(1);
  const [tongTrang, datTongTrang] = useState(0);
  const [dangTai, datDangTai] = useState(true);
  const [loi, datLoi] = useState("");
  const [dangMo, datDangMo] = useState(false);
  const [dangSua, datDangSua] = useState<LoNhap | null>(null);
  const [duLieu, datDuLieu] = useState(DU_LIEU_BAN_DAU);
  const [loiForm, datLoiForm] = useState("");
  const [dangXuLy, datDangXuLy] = useState(false);
  const [thongBao, datThongBao] = useState("");
  function taiDanhSach() {
    datDangTai(true);
    datLoi("");
    layDanhSachLoNhapQuanLy({ trang, gioiHan: 10, tuKhoa: tuKhoa || undefined })
      .then((kq) => {
        datDanhSach(kq.danhSach);
        datTongTrang(kq.phanTrang.tongTrang);
      })
      .catch((e: LoiHttp) => datLoi(e.message))
      .finally(() => datDangTai(false));
  }
  useEffect(() => {
    taiDanhSach();
    layDanhSachNhaCungCap({ trang: 1, gioiHan: 100 })
      .then((kq) => datDanhSachNhaCungCap(kq.danhSach))
      .catch(() => undefined);
  }, [trang, tuKhoa]);
  function moForm(loNhap?: LoNhap) {
    datDangSua(loNhap || null);
    datDuLieu(
      loNhap
        ? {
            maLo: loNhap.maLo,
            nhaCungCapId: loNhap.nhaCungCapId || null,
            soHoaDon: loNhap.soHoaDon || "",
            ngayNhap: loNhap.ngayNhap || "",
            tongGiaTri: loNhap.tongGiaTri ?? null,
            ghiChu: loNhap.ghiChu || "",
            fileHoaDon: null,
          }
        : DU_LIEU_BAN_DAU,
    );
    datLoiForm("");
    datDangMo(true);
  }
  async function luu(suKien: FormEvent) {
    suKien.preventDefault();
    if (!duLieu.maLo.trim()) {
      datLoiForm("Mã lô không được để trống.");
      return;
    }
    if (!duLieu.ngayNhap) {
      datLoiForm("Ngày nhập không được để trống.");
      return;
    }
    if (
      duLieu.tongGiaTri !== null &&
      (!Number.isFinite(Number(duLieu.tongGiaTri)) ||
        Number(duLieu.tongGiaTri) < 0)
    ) {
      datLoiForm("Tổng giá trị không được nhỏ hơn 0.");
      return;
    }
    if (duLieu.fileHoaDon) {
      const tep = duLieu.fileHoaDon;
      const dinhDangHopLe =
        ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(
          tep.type,
        ) || /\.(pdf|jpg|jpeg|png|webp)$/i.test(tep.name);
      if (!dinhDangHopLe) {
        datLoiForm("File hóa đơn không đúng định dạng.");
        return;
      }
      if (tep.size > 5 * 1024 * 1024) {
        datLoiForm("File hóa đơn vượt quá dung lượng cho phép.");
        return;
      }
    }
    datDangXuLy(true);
    try {
      if (dangSua) await capNhatLoNhap(dangSua.id, duLieu);
      else await themLoNhap(duLieu);
      datDangMo(false);
      datThongBao(
        dangSua ? "Cập nhật lô nhập thành công." : "Thêm lô nhập thành công.",
      );
      taiDanhSach();
    } catch (e) {
      datLoiForm(
        (e as LoiHttp).maTrangThai === 409
          ? "Mã lô đã tồn tại."
          : (e as LoiHttp).message,
      );
    } finally {
      datDangXuLy(false);
    }
  }
  return (
    <>
      <section className="thanh-cong-cu">
        <button className="nut nut-chinh" onClick={() => moForm()}>
          Thêm lô nhập
        </button>
      </section>
      {thongBao && <div className="thong-bao thanh-cong">{thongBao}</div>}
      <section className="the-noi-dung">
        <div className="bo-loc">
          <div className="o-tim-kiem">
            <span>⌕</span>
            <input
              value={tuKhoa}
              onChange={(e) => {
                datTrang(1);
                datTuKhoa(e.target.value);
              }}
              placeholder="Tìm mã lô, số hóa đơn"
              aria-label="Tìm kiếm lô nhập"
            />
          </div>
        </div>
        {dangTai ? (
          <div className="trang-thai-du-lieu">
            <span className="vong-xoay" /> Đang tải...
          </div>
        ) : loi ? (
          <div className="trang-thai-du-lieu">
            <p className="tieu-de-loi">{loi}</p>
            <button className="nut nut-phu" onClick={taiDanhSach}>
              Thử lại
            </button>
          </div>
        ) : danhSach.length === 0 ? (
          <div className="trang-thai-du-lieu">
            <p>
              {tuKhoa ? "Không tìm thấy lô nhập phù hợp." : "Chưa có lô nhập."}
            </p>
          </div>
        ) : (
          <div className="khung-bang">
            <table>
              <thead>
                <tr>
                  <th>Mã lô</th>
                  <th>Nhà cung cấp</th>
                  <th>Số hóa đơn</th>
                  <th>Ngày nhập</th>
                  <th>Tổng giá trị</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {danhSach.map((loNhap) => (
                  <tr key={loNhap.id}>
                    <td>
                      <strong>{loNhap.maLo}</strong>
                    </td>
                    <td>
                      {loNhap.nhaCungCap?.tenNhaCungCap ||
                        danhSachNhaCungCap.find(
                          (x) => x.id === loNhap.nhaCungCapId,
                        )?.tenNhaCungCap ||
                        "—"}
                    </td>
                    <td>{loNhap.soHoaDon || "—"}</td>
                    <td>
                      {loNhap.ngayNhap
                        ? new Intl.DateTimeFormat("vi-VN").format(
                            new Date(loNhap.ngayNhap),
                          )
                        : "—"}
                    </td>
                    <td>
                      {loNhap.tongGiaTri == null
                        ? "—"
                        : new Intl.NumberFormat("vi-VN").format(
                            loNhap.tongGiaTri,
                          )}
                    </td>
                    <td>
                      <button
                        className="nut nut-phu"
                        onClick={() => moForm(loNhap)}
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!dangTai && !loi && tongTrang > 0 && (
          <footer className="phan-trang">
            <span>
              Trang {trang} / {tongTrang}
            </span>
            <div>
              <button
                className="nut-trang"
                disabled={trang <= 1}
                onClick={() => datTrang((cu) => cu - 1)}
              >
                ‹
              </button>
              <button className="nut-trang dang-chon">{trang}</button>
              <button
                className="nut-trang"
                disabled={trang >= tongTrang}
                onClick={() => datTrang((cu) => cu + 1)}
              >
                ›
              </button>
            </div>
          </footer>
        )}
      </section>
      {dangMo && (
        <div className="lop-phu">
          <section className="hop-thoai">
            <header className="dau-hop-thoai">
              <h2>{dangSua ? "Sửa lô nhập" : "Thêm lô nhập"}</h2>
              <button className="nut-dong" onClick={() => datDangMo(false)}>
                ×
              </button>
            </header>
            <form className="bieu-mau bieu-mau-them" onSubmit={luu}>
              {loiForm && <div className="thong-bao loi">{loiForm}</div>}
              <div className="luoi-hai-cot">
                <div className="nhom-truong">
                  <label>
                    Mã lô <em>*</em>
                  </label>
                  <input
                    value={duLieu.maLo}
                    onChange={(e) =>
                      datDuLieu((cu) => ({ ...cu, maLo: e.target.value }))
                    }
                  />
                </div>
                <div className="nhom-truong">
                  <label>Nhà cung cấp</label>
                  <select
                    value={duLieu.nhaCungCapId || ""}
                    onChange={(e) =>
                      datDuLieu((cu) => ({
                        ...cu,
                        nhaCungCapId: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  >
                    <option value="">Không chọn</option>
                    {danhSachNhaCungCap.map((nhaCungCap) => (
                      <option key={nhaCungCap.id} value={nhaCungCap.id}>
                        {nhaCungCap.tenNhaCungCap}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="nhom-truong">
                  <label>Số hóa đơn</label>
                  <input
                    value={duLieu.soHoaDon || ""}
                    onChange={(e) =>
                      datDuLieu((cu) => ({ ...cu, soHoaDon: e.target.value }))
                    }
                  />
                </div>
                <div className="nhom-truong">
                  <label>
                    Ngày nhập <em>*</em>
                  </label>
                  <input
                    type="date"
                    value={duLieu.ngayNhap}
                    onChange={(e) =>
                      datDuLieu((cu) => ({ ...cu, ngayNhap: e.target.value }))
                    }
                  />
                </div>
                <div className="nhom-truong">
                  <label>Tổng giá trị</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={duLieu.tongGiaTri ?? ""}
                    onChange={(e) =>
                      datDuLieu((cu) => ({
                        ...cu,
                        tongGiaTri: chiGiuChuSo(e.target.value)
                          ? Number(chiGiuChuSo(e.target.value))
                          : null,
                      }))
                    }
                  />
                </div>
                <div className="nhom-truong">
                  <label>Hóa đơn</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(e) =>
                      datDuLieu((cu) => ({
                        ...cu,
                        fileHoaDon: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
                <div className="nhom-truong">
                  <label>Ghi chú</label>
                  <input
                    value={duLieu.ghiChu || ""}
                    onChange={(e) =>
                      datDuLieu((cu) => ({ ...cu, ghiChu: e.target.value }))
                    }
                  />
                </div>
              </div>
              <footer className="chan-hop-thoai">
                <button
                  type="button"
                  className="nut nut-phu"
                  onClick={() => datDangMo(false)}
                >
                  Hủy
                </button>
                <button className="nut nut-chinh" disabled={dangXuLy}>
                  {dangXuLy ? "Đang lưu..." : "Lưu"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
